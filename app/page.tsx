"use client";

import { useMemo, useState } from "react";
import { addMonths, format, startOfMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { useTransactions } from "@/hooks/useTransactions";
import { computeMonthlySummary } from "@/utils/transactions";
import { TransactionForm } from "@/components/TransactionForm";
import { StatsCards } from "@/components/StatsCards";
import {
  BalanceLineChart,
  InOutBarChart
} from "@/components/charts/ChartsDashboard";

export default function DashboardPage() {
  const today = useMemo(() => startOfMonth(new Date()), []);
  const [selectedMonth, setSelectedMonth] = useState<Date>(today);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const { transactions, isLoading, error, createTransaction } =
    useTransactions();

  const summary = useMemo(
    () => computeMonthlySummary(transactions, selectedMonth),
    [transactions, selectedMonth]
  );

  const handleMonthChange = (offset: number) => {
    setSelectedMonth((current) => addMonths(current, offset));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Dashboard mensuel
          </h1>
          <p className="text-sm text-slate-400">
            Vue d&apos;ensemble de votre budget pour le mois sélectionné.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleMonthChange(-1)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm hover:bg-slate-800"
          >
            ◀
          </button>
          <div className="min-w-[140px] text-center text-sm font-medium">
            {format(selectedMonth, "MMMM yyyy", { locale: fr })}
          </div>
          <button
            type="button"
            onClick={() => handleMonthChange(1)}
            className="rounded-md border border-slate-700 bg-slate-900 px-2 py-1 text-sm hover:bg-slate-800"
          >
            ▶
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary-700"
        >
          + Ajouter une transaction
        </button>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-400">Chargement des données...</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          Erreur lors du chargement : {error}
        </p>
      )}

      <StatsCards summary={summary} />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-200">
            Évolution du solde (12 derniers mois)
          </h2>
          <BalanceLineChart transactions={transactions} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-200">
            Dépenses vs entrées (12 derniers mois)
          </h2>
          <InOutBarChart transactions={transactions} />
        </div>
      </div>

      {isFormOpen && (
        <TransactionForm
          onClose={() => setIsFormOpen(false)}
          onSubmit={async (payload) => {
            await createTransaction(payload);
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}


