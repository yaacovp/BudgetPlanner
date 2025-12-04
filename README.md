# Budget Planner (Next.js + Supabase)

Application web de gestion de budget personnel construite avec **Next.js 14 (App Router)**, **React**, **TypeScript**, **Tailwind CSS**, **Recharts** et **Supabase (PostgreSQL)**.

## Fonctionnalités

- **Transactions**
  - Ajout, modification, suppression de transactions
  - Champs : montant, commentaire, type (dépense/entrée), récurrence (unique/mensuelle), date
  - Liste filtrable par mois, type et récurrence
- **Dashboard**
  - Solde mensuel
  - Total des dépenses et entrées
  - Total des dépenses/entrées récurrentes
  - Budget prévisionnel (entrées mensuelles - dépenses mensuelles)
  - Graphiques (évolution du solde, dépenses vs entrées)
- **Statistiques**
  - Évolution des entrées et dépenses
  - Évolution du solde
  - Répartition globale entrées vs dépenses

## Prérequis

- Node.js 18+
- Un compte **Supabase**

## Installation

```bash
npm install
```

## Configuration Supabase

1. Crée un nouveau projet Supabase.
2. Dans l'onglet **SQL**, exécute la migration `supabase/migrations/001_create_transactions.sql`.
3. Récupère :
   - `SUPABASE_URL` (`Project settings` → `API`)
   - `anon public` key.
4. Crée un fichier `.env.local` à la racine du projet :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
```

Les politiques RLS incluses dans la migration ouvrent l'accès **public (anon)** en lecture/écriture sur la table `transactions` (pas d'authentification).

## Démarrage en développement

```bash
npm run dev
```

Ensuite ouvre `http://localhost:3000`.

## Build et production

```bash
npm run build
npm start
```

## Déploiement sur Vercel

1. Pousser ce repo sur GitHub/GitLab.
2. Importer le projet dans Vercel.
3. Dans les **Environment Variables** sur Vercel, ajouter :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Déployer.

## Structure principale

- `app/`
  - `layout.tsx` – layout global, navigation, responsive
  - `page.tsx` – dashboard principal
  - `transactions/page.tsx` – liste filtrable des transactions + CRUD
  - `stats/page.tsx` – page statistiques et graphiques
- `components/`
  - `TransactionForm.tsx` – formulaire (modal) d'ajout/édition
  - `TransactionTable.tsx` – tableau/cartes responsive
  - `StatsCards.tsx` – cartes de résumé
  - `components/charts/*` – composants Recharts
- `hooks/useTransactions.ts` – hook CRUD vers Supabase
- `lib/supabaseClient.ts` – client Supabase
- `utils/transactions.ts` – calculs de totaux, filtrage, séries temporelles
- `supabase/migrations/` – SQL de création de la table `transactions` + RLS

## Notes

- L'application est **mobile-first** (layout, navigation, cartes sur mobile).
- Les composants critiques sont des **Client Components** pour permettre l'appel direct à Supabase depuis le navigateur.
- Les calculs de totaux/budgets sont centralisés dans `utils/transactions.ts` pour être facilement testables/évolutifs.


