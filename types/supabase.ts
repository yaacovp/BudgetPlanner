export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transactions: {
        Row: {
          id: string
          montant: number
          commentaire: string | null
          type: 'depense' | 'entree'
          recurrence: 'unique' | 'mensuelle'
          date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          montant: number
          commentaire?: string | null
          type: 'depense' | 'entree'
          recurrence: 'unique' | 'mensuelle'
          date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          montant?: number
          commentaire?: string | null
          type?: 'depense' | 'entree'
          recurrence?: 'unique' | 'mensuelle'
          date?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}