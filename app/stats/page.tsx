"use client";

import { useTransactions } from "@/hooks/useTransactions";
import {
  BalanceTrendChart,
  EvolutionInOutChart,
  InOutPieChart
} from "@/components/charts/ChartsStats";

export default function StatsPage() {
  const { transactions, isLoading, error } = useTransactions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          Statistiques détaillées
        </h1>
        <p className="text-sm text-slate-400">
          Graphiques d&apos;évolution et répartition de vos dépenses et entrées.
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-400">Chargement des statistiques...</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          Erreur lors du chargement : {error}
        </p>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-200">
            Évolution des entrées et dépenses
          </h2>
          <EvolutionInOutChart transactions={transactions} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-200">
            Évolution du solde
          </h2>
          <BalanceTrendChart transactions={transactions} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-slate-200">
            Répartition globale entrées vs dépenses
          </h2>
          <InOutPieChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
}


