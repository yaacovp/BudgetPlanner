"use client";

import { useState } from "react";
import type {
  CreateTransactionPayload,
  Transaction,
  TransactionRecurrence,
  TransactionType
} from "@/types/transaction";
import { format } from "date-fns";

interface Props {
  initial?: Transaction;
  onSubmit: (payload: CreateTransactionPayload) => Promise<void>;
  onClose: () => void;
}

export function TransactionForm({ initial, onSubmit, onClose }: Props) {
  const [montant, setMontant] = useState(
    initial ? String(initial.montant) : ""
  );
  const [commentaire, setCommentaire] = useState(
    initial?.commentaire ?? ""
  );
  const [type, setType] = useState<TransactionType>(initial?.type ?? "depense");
  const [recurrence, setRecurrence] = useState<TransactionRecurrence>(
    initial?.recurrence ?? "unique"
  );
  const [date, setDate] = useState(
    initial ? format(new Date(initial.date), "yyyy-MM-dd") : format(new Date(), "yyyy-MM-dd")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const value = parseFloat(montant.replace(",", "."));
    if (Number.isNaN(value) || value <= 0) {
      setError("Le montant doit être un nombre positif.");
      return;
    }
    if (!date) {
      setError("La date est requise.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        montant: value,
        commentaire,
        type,
        recurrence,
        date: new Date(date).toISOString()
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">
            {initial ? "Modifier la transaction" : "Ajouter une transaction"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
          >
            Fermer
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Montant</label>
            <input
              type="number"
              step="0.01"
              value={montant}
              onChange={(e) => setMontant(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">
              Commentaire / description
            </label>
            <input
              type="text"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Ex: Courses, Salaire..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
              >
                <option value="depense">Dépense</option>
                <option value="entree">Entrée</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-slate-300">Récurrence</label>
              <select
                value={recurrence}
                onChange={(e) =>
                  setRecurrence(e.target.value as TransactionRecurrence)
                }
              >
                <option value="unique">Unique</option>
                <option value="mensuelle">Mensuelle</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-slate-300">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
            >
              {isSubmitting
                ? "Enregistrement..."
                : initial
                ? "Enregistrer"
                : "Ajouter"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


