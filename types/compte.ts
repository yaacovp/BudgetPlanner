export interface Compte {
  id: string;
  intitule: string;
  nom_banque: string;
  solde_initial: number;
  created_at: string;
  updated_at: string;
}

export interface CreateComptePayload {
  intitule: string;
  nom_banque: string;
  solde_initial: number;
}


