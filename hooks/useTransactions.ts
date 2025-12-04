"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type {
  CreateTransactionPayload,
  Transaction,
  UpdateTransactionPayload
} from "@/types/transaction";

interface UseTransactionsResult {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  createTransaction: (payload: CreateTransactionPayload) => Promise<void>;
  updateTransaction: (
    id: string,
    payload: UpdateTransactionPayload
  ) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

export function useTransactions(): UseTransactionsResult {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      setError(error.message);
    } else if (data) {
      setTransactions(data as Transaction[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const createTransaction = useCallback(
    async (payload: CreateTransactionPayload) => {
      const { data, error } = await supabase
        .from("transactions")
        .insert({
          montant: payload.montant,
          type: payload.type,
          recurrence: payload.recurrence,
          date: payload.date,
          commentaire: payload.commentaire || null,
          compte_id: payload.compte_id ?? null
        } as any) // ← Ajout de 'as any'
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }
      if (data) {
        setTransactions((prev) => [data as Transaction, ...prev]);
      }
    },
    []
  );

  const updateTransaction = useCallback(
    async (id: string, payload: UpdateTransactionPayload) => {
      const updateData: any = {}; // ← Change en 'any'
      
      if (payload.montant !== undefined) updateData.montant = payload.montant;
      if (payload.type !== undefined) updateData.type = payload.type;
      if (payload.recurrence !== undefined) updateData.recurrence = payload.recurrence;
      if (payload.date !== undefined) updateData.date = payload.date;
      if (payload.commentaire !== undefined) updateData.commentaire = payload.commentaire || null;
      if (payload.compte_id !== undefined) updateData.compte_id = payload.compte_id ?? null;

      const { data, error } = await supabase
        .from("transactions")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return;
      }
      if (data) {
        setTransactions((prev) =>
          prev.map((t) => (t.id === id ? (data as Transaction) : t))
        );
      }
    },
    []
  );

  const deleteTransaction = useCallback(async (id: string) => {
    const previous = transactions;
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      setError(error.message);
      setTransactions(previous);
    }
  }, [transactions]);

  return {
    transactions,
    isLoading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction
  };
}