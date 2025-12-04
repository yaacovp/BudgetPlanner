"use client";

import { useMemo, useState } from "react";
import { addMonths, format, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { useTransactions } from "@/hooks/useTransactions";
import { filterTransactions, TransactionFilters } from "@/utils/transactions";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionForm } from "@/components/TransactionForm";
import type { Transaction } from "@/types/transaction";

export default function TransactionsPage() {
  const today = useMemo(() => startOfMonth(new Date()), []);
  const [filters, setFilters] = useState<TransactionFilters>({ month: today });
  const [editing, setEditing] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { transactions, isLoading, error, createTransaction, updateTransaction, deleteTransaction } =
    useTransactions();

  const filtered = useMemo(
    () => filterTransactions(transactions, filters),
    [transactions, filters]
  );

  const handleMonthChange = (offset: number) => {
    setFilters((f) => ({
      ...f,
      month: f.month ? addMonths(f.month, offset) : addMonths(today, offset)
    }));
  };

  const currentMonthLabel = filters.month
    ? format(filters.month, "MMMM yyyy", { locale: fr })
    : "Tous les mois";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Transactions
          </h1>
          <p className="text-sm text-slate-400">
            Liste complète avec filtres et actions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setIsFormOpen(true);
          }}
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary-700"
        >
          + Ajouter
        </button>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 md:col-span-2">
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs hover:bg-slate-800"
          >
            ◀
          </button>
          <div className="flex-1 text-center text-xs font-medium">
            {currentMonthLabel}
          </div>
          <button
            type="button"
            onClick={() => handleMonthChange(1)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-xs hover:bg-slate-800"
          >
            ▶
          </button>
          <button
            type="button"
            onClick={() =>
              setFilters((f) => ({
                ...f,
                month: undefined
              }))
            }
            className="ml-2 text-[11px] text-slate-400 hover:text-slate-200"
          >
            Réinitialiser
          </button>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Type</label>
          <select
            value={filters.type ?? "tous"}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                type: e.target.value as TransactionFilters["type"]
              }))
            }
          >
            <option value="tous">Tous</option>
            <option value="depense">Dépenses</option>
            <option value="entree">Entrées</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs text-slate-300">Récurrence</label>
          <select
            value={filters.recurrence ?? "tous"}
            onChange={(e) =>
              setFilters((f) => ({
                ...f,
                recurrence: e.target.value as TransactionFilters["recurrence"]
              }))
            }
          >
            <option value="tous">Toutes</option>
            <option value="unique">Unique</option>
            <option value="mensuelle">Mensuelle</option>
          </select>
        </div>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-400">Chargement des transactions...</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          Erreur lors du chargement : {error}
        </p>
      )}

      <TransactionTable
        transactions={filtered}
        onEdit={(t) => {
          setEditing(t);
          setIsFormOpen(true);
        }}
        onDelete={async (id) => {
          if (confirm("Supprimer cette transaction ?")) {
            await deleteTransaction(id);
          }
        }}
      />

      {isFormOpen && (
        <TransactionForm
          initial={editing ?? undefined}
          onClose={() => {
            setEditing(null);
            setIsFormOpen(false);
          }}
          onSubmit={async (payload) => {
            if (editing) {
              await updateTransaction(editing.id, payload);
            } else {
              await createTransaction(payload);
            }
            setEditing(null);
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}


