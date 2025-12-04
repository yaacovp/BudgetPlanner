export type TransactionType = "depense" | "entree";
export type TransactionRecurrence = "unique" | "mensuelle";

export interface TransactionBase {
  montant: number;
  commentaire: string;
  type: TransactionType;
  recurrence: TransactionRecurrence;
  date: string; // ISO string
}

export interface Transaction extends TransactionBase {
  id: string;
  created_at: string;
  updated_at: string | null;
}

export interface CreateTransactionPayload extends TransactionBase {}

export interface UpdateTransactionPayload extends Partial<TransactionBase> {}


