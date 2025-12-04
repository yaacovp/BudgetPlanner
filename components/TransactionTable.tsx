"use client";

import type { Transaction } from "@/types/transaction";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  transactions: Transaction[];
  onEdit: (t: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionTable({ transactions, onEdit, onDelete }: Props) {
  if (transactions.length === 0) {
    return (
      <p className="text-sm text-slate-400">
        Aucune transaction ne correspond aux filtres.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="rounded-xl border border-slate-800 bg-slate-900/70 p-3"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-400">
                {format(new Date(t.date), "dd MMM yyyy", { locale: fr })}
              </div>
              <div
                className={`text-sm font-semibold ${
                  t.type === "entree" ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {t.type === "entree" ? "+" : "-"}
                {t.montant.toFixed(2)} €
              </div>
            </div>
            {t.commentaire && (
              <p className="mt-1 text-sm text-slate-200">{t.commentaire}</p>
            )}
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span>
                {t.type === "entree" ? "Entrée" : "Dépense"} •{" "}
                {t.recurrence === "mensuelle" ? "Mensuelle" : "Unique"}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onEdit(t)}
                  className="rounded border border-slate-700 px-2 py-0.5 text-[11px] hover:bg-slate-800"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
                  className="rounded border border-red-700 px-2 py-0.5 text-[11px] text-red-400 hover:bg-red-900/40"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/70">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/80">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">
                Date
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">
                Commentaire
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-slate-400">
                Récurrence
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-400">
                Montant
              </th>
              <th className="px-4 py-2 text-right text-xs font-medium text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr
                key={t.id}
                className="border-t border-slate-800 hover:bg-slate-800/50"
              >
                <td className="px-4 py-2 text-xs text-slate-300">
                  {format(new Date(t.date), "dd/MM/yyyy", { locale: fr })}
                </td>
                <td className="px-4 py-2 text-xs text-slate-200">
                  {t.commentaire || "-"}
                </td>
                <td className="px-4 py-2 text-xs text-slate-300">
                  {t.type === "entree" ? "Entrée" : "Dépense"}
                </td>
                <td className="px-4 py-2 text-xs text-slate-300">
                  {t.recurrence === "mensuelle" ? "Mensuelle" : "Unique"}
                </td>
                <td
                  className={`px-4 py-2 text-right text-xs font-semibold ${
                    t.type === "entree" ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {t.type === "entree" ? "+" : "-"}
                  {t.montant.toFixed(2)} €
                </td>
                <td className="px-4 py-2 text-right text-xs">
                  <button
                    type="button"
                    onClick={() => onEdit(t)}
                    className="mr-2 rounded border border-slate-700 px-2 py-1 hover:bg-slate-800"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(t.id)}
                    className="rounded border border-red-700 px-2 py-1 text-red-400 hover:bg-red-900/40"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


