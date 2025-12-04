"use client";

import { useMemo, useState } from "react";
import { useComptes } from "@/hooks/useComptes";
import { useTransactions } from "@/hooks/useTransactions";
import { calculateAllSoldes } from "@/utils/comptes";
import type { Compte } from "@/types/compte";

export default function ComptesPage() {
  const { comptes, isLoading, error, createCompte, updateCompte, deleteCompte } =
    useComptes();
  const { transactions } = useTransactions();
  const [editing, setEditing] = useState<Compte | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formIntitule, setFormIntitule] = useState("");
  const [formBanque, setFormBanque] = useState("");
  const [formSolde, setFormSolde] = useState("0");
  const [formError, setFormError] = useState<string | null>(null);

  const soldes = useMemo(
    () => calculateAllSoldes(comptes, transactions),
    [comptes, transactions]
  );

  const totalGlobal = soldes.reduce((sum, s) => sum + s.solde, 0);

  const openCreate = () => {
    setEditing(null);
    setFormIntitule("");
    setFormBanque("");
    setFormSolde("0");
    setFormError(null);
    setIsCreating(true);
  };

  const openEdit = (compte: Compte) => {
    setEditing(compte);
    setFormIntitule(compte.intitule);
    setFormBanque(compte.nom_banque);
    setFormSolde(String(compte.solde_initial));
    setFormError(null);
    setIsCreating(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    const solde = parseFloat(formSolde.replace(",", "."));
    if (!formIntitule.trim() || !formBanque.trim() || Number.isNaN(solde)) {
      setFormError("Veuillez remplir tous les champs avec des valeurs valides.");
      return;
    }

    if (editing) {
      await updateCompte(editing.id, {
        intitule: formIntitule.trim(),
        nom_banque: formBanque.trim(),
        solde_initial: solde
      });
    } else {
      await createCompte({
        intitule: formIntitule.trim(),
        nom_banque: formBanque.trim(),
        solde_initial: solde
      });
    }
    setIsCreating(false);
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Comptes</h1>
          <p className="text-sm text-slate-400">
            Gérez vos comptes bancaires et espèces et suivez leurs soldes.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary-700"
        >
          + Nouveau compte
        </button>
      </div>

      {isLoading && (
        <p className="text-sm text-slate-400">Chargement des comptes...</p>
      )}
      {error && (
        <p className="text-sm text-red-400">
          Erreur lors du chargement : {error}
        </p>
      )}

      <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-4">
        <p className="text-xs text-slate-400">Total de tous les comptes</p>
        <p className="mt-2 text-2xl font-semibold text-slate-50">
          {totalGlobal.toFixed(2)} €
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {soldes.map(({ compte, solde }) => (
          <div
            key={compte.id}
            className="flex flex-col rounded-xl border border-slate-800 bg-slate-900/70 p-4"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-slate-50">
                  {compte.intitule}
                </p>
                <p className="text-xs text-slate-400">{compte.nom_banque}</p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p>Solde initial</p>
                <p className="font-medium text-slate-200">
                  {compte.solde_initial.toFixed(2)} €
                </p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs text-slate-400">Solde actuel</p>
              <p
                className={`mt-1 text-lg font-semibold ${
                  solde >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {solde.toFixed(2)} €
              </p>
            </div>
            <div className="mt-3 flex justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => openEdit(compte)}
                className="rounded-md border border-slate-700 px-3 py-1 hover:bg-slate-800"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (
                    confirm(
                      "Supprimer ce compte ? Les transactions resteront mais ne seront plus associées."
                    )
                  ) {
                    await deleteCompte(compte.id);
                  }
                }}
                className="rounded-md border border-red-700 px-3 py-1 text-red-400 hover:bg-red-900/40"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
        {soldes.length === 0 && (
          <p className="text-sm text-slate-400">
            Aucun compte pour le moment. Ajoutez votre premier compte pour
            commencer le suivi.
          </p>
        )}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold">
                {editing ? "Modifier le compte" : "Nouveau compte"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false);
                  setEditing(null);
                }}
                className="rounded-md border border-slate-700 px-2 py-1 text-xs hover:bg-slate-800"
              >
                Fermer
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Intitulé</label>
                <input
                  type="text"
                  value={formIntitule}
                  onChange={(e) => setFormIntitule(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">Nom de la banque</label>
                <input
                  type="text"
                  value={formBanque}
                  onChange={(e) => setFormBanque(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-300">
                  Solde initial
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formSolde}
                  onChange={(e) => setFormSolde(e.target.value)}
                  required
                />
              </div>
              {formError && (
                <p className="text-xs text-red-400">{formError}</p>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setEditing(null);
                  }}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-xs hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded-md bg-primary-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                >
                  {editing ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


