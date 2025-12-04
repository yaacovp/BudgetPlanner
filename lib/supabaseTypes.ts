export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string;
          montant: number;
          commentaire: string | null;
          type: "depense" | "entree";
          recurrence: "unique" | "mensuelle";
          date: string;
          created_at: string;
          updated_at: string | null;
          compte_id: string | null;
        };
        Insert: {
          id?: string;
          montant: number;
          commentaire?: string | null;
          type: "depense" | "entree";
          recurrence: "unique" | "mensuelle";
          date: string;
          created_at?: string;
          updated_at?: string | null;
          compte_id?: string | null;
        };
        Update: {
          id?: string;
          montant?: number;
          commentaire?: string | null;
          type?: "depense" | "entree";
          recurrence?: "unique" | "mensuelle";
          date?: string;
          created_at?: string;
          updated_at?: string | null;
          compte_id?: string | null;
        };
      };
      comptes: {
        Row: {
          id: string;
          intitule: string;
          nom_banque: string;
          solde_initial: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          intitule: string;
          nom_banque: string;
          solde_initial?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          intitule?: string;
          nom_banque?: string;
          solde_initial?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}


