import {
  addMonths,
  differenceInCalendarMonths,
  endOfMonth,
  isSameMonth,
  startOfMonth
} from "date-fns";
import type { Transaction } from "@/types/transaction";

export interface MonthlySummary {
  totalDepenses: number;
  totalEntrees: number;
  solde: number;
  totalDepensesRecurrentes: number;
  totalEntreesRecurrentes: number;
  budgetPrevisionnel: number;
}

export function computeMonthlySummary(
  transactions: Transaction[],
  month: Date
): MonthlySummary {
  const start = startOfMonth(month);
  const end = endOfMonth(month);

  let totalDepenses = 0;
  let totalEntrees = 0;
  let totalDepensesRecurrentes = 0;
  let totalEntreesRecurrentes = 0;

  for (const t of transactions) {
    const tDate = new Date(t.date);
    const isInMonth = tDate >= start && tDate <= end;

    if (t.recurrence === "unique" && !isInMonth) continue;

    if (t.type === "depense") {
      totalDepenses += t.montant;
      if (t.recurrence === "mensuelle") totalDepensesRecurrentes += t.montant;
    } else {
      totalEntrees += t.montant;
      if (t.recurrence === "mensuelle") totalEntreesRecurrentes += t.montant;
    }
  }

  const solde = totalEntrees - totalDepenses;
  const budgetPrevisionnel =
    totalEntreesRecurrentes - totalDepensesRecurrentes;

  return {
    totalDepenses,
    totalEntrees,
    solde,
    totalDepensesRecurrentes,
    totalEntreesRecurrentes,
    budgetPrevisionnel
  };
}

export function buildMonthlySeries(
  transactions: Transaction[],
  monthsBack = 11
) {
  const now = startOfMonth(new Date());
  const first = addMonths(now, -monthsBack);

  const result: {
    month: string;
    totalDepenses: number;
    totalEntrees: number;
    solde: number;
  }[] = [];

  for (let i = 0; i <= monthsBack; i++) {
    const current = addMonths(first, i);
    const summary = computeMonthlySummary(transactions, current);
    result.push({
      month: `${current.getMonth() + 1}/${current.getFullYear().toString().slice(-2)}`,
      totalDepenses: summary.totalDepenses,
      totalEntrees: summary.totalEntrees,
      solde: summary.solde
    });
  }

  return result;
}

export interface TransactionFilters {
  month?: Date;
  type?: "depense" | "entree" | "tous";
  recurrence?: "unique" | "mensuelle" | "tous";
  compteId?: string | "tous";
}

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters
): Transaction[] {
  return transactions.filter((t) => {
    const tDate = new Date(t.date);
    if (filters.month && !isSameMonth(tDate, filters.month)) {
      return false;
    }
    if (filters.type && filters.type !== "tous" && t.type !== filters.type) {
      return false;
    }
    if (
      filters.recurrence &&
      filters.recurrence !== "tous" &&
      t.recurrence !== filters.recurrence
    ) {
      return false;
    }
    if (filters.compteId && filters.compteId !== "tous") {
      if (filters.compteId === "none" && t.compte_id !== null) {
        return false;
      }
      if (filters.compteId !== "none" && t.compte_id !== filters.compteId) {
        return false;
      }
    }
    return true;
  });
}


