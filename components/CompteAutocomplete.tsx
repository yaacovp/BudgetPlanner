"use client";

import { useMemo, useState } from "react";
import { useComptes } from "@/hooks/useComptes";
import type { Compte } from "@/types/compte";

interface Props {
  value: string | null;
  onChange: (compteId: string | null) => void;
}

export function CompteAutocomplete({ value, onChange }: Props) {
  const { comptes, createCompte, isLoading, error } = useComptes();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newIntitule, setNewIntitule] = useState("");
  const [newNomBanque, setNewNomBanque] = useState("");
  const [newSolde, setNewSolde] = useState("0");
  const [localError, setLocalError] = useState<string | null>(null);

  const selectedCompte: Compte | undefined = useMemo(
    () => comptes.find((c) => c.id === value),
    [comptes, value]
  );

  const suggestions = useMemo(() => {
    const q = query.toLowerCase();
    return comptes.filter(
      (c) =>
        c.intitule.toLowerCase().includes(q) ||
        c.nom_banque.toLowerCase().includes(q)
    );
  }, [comptes, query]);

  const handleSelect = (compte: Compte | null) => {
    onChange(compte ? compte.id : null);
    setOpen(false);
    setQuery("");
  };

  const handleStartCreate = () => {
    setIsCreating(true);
    setNewIntitule(query || "");
    setNewNomBanque("");
    setNewSolde("0");
    setLocalError(null);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    const solde = parseFloat(newSolde.replace(",", "."));
    if (!newIntitule.trim() || !newNomBanque.trim() || Number.isNaN(solde)) {
      setLocalError("Veuillez renseigner tous les champs avec des valeurs valides.");
      return;
    }
    const compte = await createCompte({
      intitule: newIntitule.trim(),
      nom_banque: newNomBanque.trim(),
      solde_initial: solde
    });
    if (compte) {
      onChange(compte.id);
      setIsCreating(false);
      setQuery("");
    }
  };

  return (
    <div className="space-y-1">
      <label className="text-xs text-slate-300">Compte (optionnel)</label>
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            placeholder={
              selectedCompte
                ? `${selectedCompte.intitule} – ${selectedCompte.nom_banque}`
                : "Rechercher ou créer un compte"
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="absolute inset-y-0 right-1 flex items-center px-1 text-slate-400 hover:text-slate-200"
            tabIndex={-1}
          >
            <span className="text-xs">▾</span>
          </button>
          {open && (
            <div className="absolute z-20 mt-1 max-h-40 w-full overflow-y-auto rounded-md border border-slate-800 bg-slate-950 text-xs">
              {suggestions.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className="flex w-full items-center justify-between px-3 py-1.5 text-left hover:bg-slate-800"
                >
                  <span>
                    {c.intitule}{" "}
                    <span className="text-[10px] text-slate-400">
                      • {c.nom_banque}
                    </span>
                  </span>
                </button>
              ))}
              {suggestions.length === 0 && (
                <div className="px-3 py-2 text-slate-400">
                  Aucun compte trouvé.
                  {query && (
                    <button
                      type="button"
                      onClick={handleStartCreate}
                      className="ml-2 text-primary-400 hover:text-primary-300"
                    >
                      Créer « {query} »
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
        {selectedCompte && !query && (
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Compte sélectionné :{" "}
              <strong className="text-slate-200">
                {selectedCompte.intitule} – {selectedCompte.nom_banque}
              </strong>
            </span>
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="ml-2 text-red-400 hover:text-red-300"
            >
              Effacer
            </button>
          </div>
        )}
      </div>
      {(isLoading || error) && (
        <p className="text-[11px] text-slate-500">
          {isLoading && "Chargement des comptes..."}
          {error && `Erreur: ${error}`}
        </p>
      )}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="mt-2 space-y-2 rounded-md border border-slate-800 bg-slate-900 p-3"
        >
          <p className="text-xs font-medium text-slate-200">
            Nouveau compte
          </p>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300">Intitulé</label>
            <input
              type="text"
              value={newIntitule}
              onChange={(e) => setNewIntitule(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300">Nom de la banque</label>
            <input
              type="text"
              value={newNomBanque}
              onChange={(e) => setNewNomBanque(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label className="text-[11px] text-slate-300">
              Solde initial
            </label>
            <input
              type="number"
              step="0.01"
              value={newSolde}
              onChange={(e) => setNewSolde(e.target.value)}
            />
          </div>
          {localError && (
            <p className="text-[11px] text-red-400">{localError}</p>
          )}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="rounded-md border border-slate-700 px-2 py-1 text-[11px] hover:bg-slate-800"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="rounded-md bg-primary-600 px-3 py-1 text-[11px] font-medium text-white hover:bg-primary-700"
            >
              Créer
            </button>
          </div>
        </form>
      )}
    </div>
  );
}


