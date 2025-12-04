import { MonthlySummary } from "@/utils/transactions";

interface Props {
  summary: MonthlySummary;
}

export function StatsCards({ summary }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs text-slate-400">Solde du mois</p>
        <p className="mt-2 text-2xl font-semibold text-slate-50">
          {summary.solde.toFixed(2)} €
        </p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs text-slate-400">Total entrées</p>
        <p className="mt-2 text-lg font-semibold text-emerald-400">
          {summary.totalEntrees.toFixed(2)} €
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Récurrentes : {summary.totalEntreesRecurrentes.toFixed(2)} €
        </p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs text-slate-400">Total dépenses</p>
        <p className="mt-2 text-lg font-semibold text-red-400">
          {summary.totalDepenses.toFixed(2)} €
        </p>
        <p className="mt-1 text-[11px] text-slate-400">
          Récurrentes : {summary.totalDepensesRecurrentes.toFixed(2)} €
        </p>
      </div>
      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 lg:col-span-3">
        <p className="text-xs text-slate-400">Budget prévisionnel mensuel</p>
        <p className="mt-2 text-lg font-semibold text-slate-50">
          {summary.budgetPrevisionnel.toFixed(2)} €
        </p>
        <p className="mt-1 text-[11px] text-slate-500">
          Calculé à partir des entrées et dépenses marquées comme mensuelles.
        </p>
      </div>
    </div>
  );
}


