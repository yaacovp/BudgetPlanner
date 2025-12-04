import type { Transaction } from "@/types/transaction";
import type { Compte } from "@/types/compte";

export function calculateSoldeActuel(
  compte: Compte,
  transactions: Transaction[]
): number {
  const transactionsCompte = transactions.filter(
    (t) => t.compte_id === compte.id
  );

  const totalEntrees = transactionsCompte
    .filter((t) => t.type === "entree")
    .reduce((sum, t) => sum + t.montant, 0);

  const totalDepenses = transactionsCompte
    .filter((t) => t.type === "depense")
    .reduce((sum, t) => sum + t.montant, 0);

  return compte.solde_initial + totalEntrees - totalDepenses;
}

export function calculateAllSoldes(
  comptes: Compte[],
  transactions: Transaction[]
): Array<{ compte: Compte; solde: number }> {
  return comptes.map((compte) => ({
    compte,
    solde: calculateSoldeActuel(compte, transactions)
  }));
}


