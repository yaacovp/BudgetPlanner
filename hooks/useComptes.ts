"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { Compte, CreateComptePayload } from "@/types/compte";

interface UseComptesResult {
  comptes: Compte[];
  isLoading: boolean;
  error: string | null;
  createCompte: (payload: CreateComptePayload) => Promise<Compte | null>;
  updateCompte: (id: string, payload: Partial<CreateComptePayload>) => Promise<Compte | null>;
  deleteCompte: (id: string) => Promise<void>;
  refreshComptes: () => Promise<void>;
}

export function useComptes(): UseComptesResult {
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComptes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("comptes")
      .select("*")
      .order("nom_banque", { ascending: true });

    if (error) {
      setError(error.message);
    } else if (data) {
      setComptes(data as Compte[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchComptes();
  }, [fetchComptes]);

  const createCompte = useCallback(
    async (payload: CreateComptePayload): Promise<Compte | null> => {
      const { data, error } = await supabase
        .from("comptes")
        .insert({
          intitule: payload.intitule,
          nom_banque: payload.nom_banque,
          solde_initial: payload.solde_initial || 0
        } as any)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }
      if (data) {
        setComptes((prev) => [...prev, data as Compte]);
        return data as Compte;
      }
      return null;
    },
    []
  );

  const updateCompte = useCallback(
    async (
      id: string,
      payload: Partial<CreateComptePayload>
    ): Promise<Compte | null> => {
      const { data, error } = await supabase
        .from("comptes")
        .update(payload as any)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        setError(error.message);
        return null;
      }
      if (data) {
        setComptes((prev) =>
          prev.map((c) => (c.id === id ? (data as Compte) : c))
        );
        return data as Compte;
      }
      return null;
    },
    []
  );

  const deleteCompte = useCallback(async (id: string) => {
    const previous = comptes;
    setComptes((prev) => prev.filter((c) => c.id !== id));

    const { error } = await supabase.from("comptes").delete().eq("id", id);

    if (error) {
      setError(error.message);
      setComptes(previous);
    }
  }, [comptes]);

  return {
    comptes,
    isLoading,
    error,
    createCompte,
    updateCompte,
    deleteCompte,
    refreshComptes: fetchComptes
  };
}


