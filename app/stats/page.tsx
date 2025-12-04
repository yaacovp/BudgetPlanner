"use client";

import { useMemo, useState } from "react";
import { useTransactions } from "@/hooks/useTransactions";
import { useComptes } from "@/hooks/useComptes";
import {
  BalanceTrendChart,
  EvolutionInOutChart,
  InOutPieChart
} from "@/components/charts/ChartsStats";
import type { Transaction } from "@/types/transaction";

export default function StatsPage() {
  const { transactions, isLoading, error } = useTransactions();
  const { comptes } = useComptes();
  const [selectedCompteId, setSelectedCompteId] = useState<string | "tous">(
    "tous"
  );

  const filteredTransactions: Transaction[] = useMemo(() => {
    if (selectedCompteId === "tous") return transactions;
    if (selectedCompteId === "none") {
      return transactions.filter((t) => !t.compte_id);
    }
    return transactions.filter((t) => t.compte_id === selectedCompteId);
  }, [transactions, selectedCompteId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Statistiques détaillées
          </h1>
          <p className="text-sm text-slate-400">
            Graphiques d&apos;évolution et répartition de vos dépenses et entrées.
          </p>
        </div>
        <div className="space-y-1 sm:w-64">
          <label className="text-xs text-slate-300">Compte</label>
          <select
            value={selectedCompteId}
            onChange={(e) =>
              setSelectedCompteId(e.target.value as typeof selectedCompteId)
            }
          >
            <option value="tous">Tous les comptes</option>
            <option value="none">Sans compte</option>
            {comptes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.intitule} – {c.nom_banque}
              </option>
            ))}
          </select>
        </div>
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
          <EvolutionInOutChart transactions={filteredTransactions} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <h2 className="mb-3 text-sm font-medium text-slate-200">
            Évolution du solde
          </h2>
          <BalanceTrendChart transactions={filteredTransactions} />
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-medium text-slate-200">
            Répartition globale entrées vs dépenses
          </h2>
          <InOutPieChart transactions={filteredTransactions} />
        </div>
      </div>
    </div>
  );
}

