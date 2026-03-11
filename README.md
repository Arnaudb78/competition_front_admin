# Mirokaï Experience — Interface Admin

Dashboard d'administration pour gérer les contenus de la Mirokaï Experience.
Construit avec **Next.js 15** (App Router), **Tailwind CSS** et **shadcn/ui**.

> **Desktop uniquement.** Cette interface est conçue pour une utilisation sur ordinateur par les équipes admin.

---

## Fonctionnalités

- Créer, modifier et supprimer des **modules** d'exposition
- Uploader des **médias** (vidéo, audio, images) vers AWS S3
- Placer les modules sur le **plan interactif** par drag & drop
- Gérer la visibilité de chaque module

---

## Architecture

```
front-admin-mirokai/
├── app/
│   └── (authenticated)/
│       ├── modules/
│       │   ├── page.tsx         → Liste des modules
│       │   ├── create/          → Création d'un module
│       │   ├── [id]/edit/       → Modification d'un module
│       │   └── map/             → Éditeur de plan (drag & drop)
│       └── layout.tsx
├── components/
│   ├── modules/
│   │   ├── module-edit-form.tsx → Formulaire d'édition
│   │   └── module-map-editor.tsx → Éditeur de plan
│   └── ui/                      → Composants shadcn/ui
└── lib/
    └── api.ts                   → Client HTTP (avec auth JWT)
```

---

## Prérequis

- **Node.js** 20+
- **pnpm** — `npm install -g pnpm`
- Le [backend](../back-project) lancé (local ou production)

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

En production, remplacer par l'URL de l'API déployée.

---

## Lancer en développement

```bash
pnpm dev
```

Ouvrir `http://localhost:3000`

---

## Guide d'utilisation

### 1. Connexion

Se connecter avec les identifiants admin créés en base de données.

### 2. Créer un module

Aller dans **Modules → Ajouter un module** et remplir :

| Champ | Description |
|---|---|
| Numéro | Identifiant unique affiché sur le plan (ex : `1`) |
| Nom | Titre du module affiché aux visiteurs |
| Cartel | Texte descriptif affiché lors de la visite |
| Type de média | `Aucun`, `Vidéo` ou `Audio` |
| Fichier média | Vidéo ou audio uploadé vers S3 |
| Images | Photos supplémentaires (grille) |
| Visible | Active/désactive l'affichage aux visiteurs |

### 3. Placer les modules sur le plan

Aller dans **Modules → Plan** :
- Glisser-déposer chaque module sur le plan de l'expérience
- Les positions sont sauvegardées en pourcentage (0–1) pour s'adapter à toutes les tailles d'écran
- Cliquer **Sauvegarder le plan** pour enregistrer

---

## Exemple de module complet

```json
{
  "number": 3,
  "name": "L'Atelier des Créateurs",
  "cartel": "Dans cet espace, découvrez comment les robots apprennent à créer...",
  "mediaType": "video",
  "mediaUrl": "https://bucket.s3.eu-west-3.amazonaws.com/videos/atelier.mp4",
  "images": [
    "https://bucket.s3.eu-west-3.amazonaws.com/images/atelier1.jpg",
    "https://bucket.s3.eu-west-3.amazonaws.com/images/atelier2.jpg"
  ],
  "mapX": 0.62,
  "mapY": 0.45,
  "isVisible": true
}
```

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

> L'application est optimisée pour une utilisation sur desktop (résolution minimum recommandée : 1280px).
