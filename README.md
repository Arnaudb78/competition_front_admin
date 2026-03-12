# Mirokaï Experience — Interface Admin

Dashboard d'administration pour gérer l'ensemble des contenus de la Mirokaï Experience.
Construit avec **Next.js 15** (App Router), **Tailwind CSS** et **shadcn/ui**.

> **Desktop uniquement.** Interface conçue pour ordinateur (résolution minimum recommandée : 1280px).

**URL de production :** https://admin.xn--miroka-experience-jwb.fr/

---

## Fonctionnalités

- Gérer les **modules** d'exposition (CRUD, upload média S3, placement sur plan, réordonnancement)
- Gérer les **challenges** et leurs questions (quiz pour les membres)
- Gérer les **événements** avec analytics par type (Experience, Afterwork, Talks)
- Gérer les **médias** : replays vidéo et clips courts
- Gérer les **utilisateurs admin**
- Gérer la banque de **questions**

---

## Architecture

```
front-admin-mirokai/
├── app/
│   ├── page.tsx                    → Page de connexion
│   ├── layout.tsx                  → Layout racine
│   └── (authenticated)/
│       ├── layout.tsx              → Layout protégé (sidebar + auth check)
│       ├── dashboard/              → Tableau de bord
│       ├── modules/
│       │   ├── page.tsx            → Liste des modules
│       │   ├── create/             → Création
│       │   ├── [id]/               → Édition
│       │   ├── map/                → Éditeur plan (drag & drop)
│       │   └── order/              → Réordonnancement
│       ├── challenges/
│       │   ├── page.tsx            → Liste des challenges
│       │   ├── create/             → Création
│       │   └── [id]/               → Édition + questions
│       ├── events/
│       │   ├── page.tsx            → Analytics globaux
│       │   ├── list/               → Gestion des événements
│       │   ├── create/             → Création
│       │   ├── experience/         → Analytics Mirokaï Experience
│       │   ├── afterwork/          → Analytics Robot Drinks / Afterwork
│       │   └── talks/              → Analytics Enchanted Talks
│       ├── media/
│       │   ├── replays/            → CRUD replays vidéo
│       │   └── clips/              → CRUD clips courts
│       ├── users/                  → Gestion des admins
│       └── questions/              → Banque de questions
├── components/
│   ├── app-sidebar.tsx             → Navigation principale
│   ├── modules/                    → Formulaires et éditeurs modules
│   ├── challenges/                 → Formulaires challenges
│   ├── events/                     → Composants events & analytics
│   ├── media/                      → Composants replays & clips
│   ├── questions/                  → Composants questions
│   ├── users/                      → Composants utilisateurs
│   └── ui/                         → Composants shadcn/ui
└── lib/
    ├── api.ts                      → Client HTTP (auth JWT cookie)
    └── utils.ts                    → Utilitaires
```

---

## Prérequis

- **Node.js** 20+
- **pnpm** — `npm install -g pnpm`
- Le [backend](https://github.com/Arnaudb78/competition_project_back) lancé (local ou production)

---

## Installation

```bash
git clone <url-du-repo>
cd front-admin-mirokai
pnpm install
```

---

## Configuration

Créer un fichier `.env.local` à la racine :

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

---

## Lancer en développement

```bash
pnpm dev
```

Ouvrir `http://localhost:3000`

---

## Build & déploiement

```bash
pnpm build
pnpm start
```

### Variables d'environnement en production

```env
NEXT_PUBLIC_API_URL=https://api.mirokai-experience.fr/api
```
