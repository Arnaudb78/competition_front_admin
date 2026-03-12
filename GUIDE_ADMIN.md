# Guide d'utilisation — Interface Admin Mirokaï

## Accès

| | |
|---|---|
| **URL** | https://admin.xn--miroka-experience-jwb.fr/ |
| **Email** | admin@enchantedtools.fr |
| **Mot de passe** | admin |

---

## 1. Connexion

1. Ouvrez l'URL ci-dessus dans votre navigateur (Chrome ou Firefox recommandé)
2. Saisissez l'email et le mot de passe
3. Cliquez sur **Se connecter**

Vous arrivez sur le **tableau de bord** avec les accès rapides à toutes les sections.

---

## 2. Modules d'exposition

Les modules représentent les points d'intérêt visités par les participants lors de la Mirokaï Experience.

### Créer un module

1. Sidebar → **Modules** → **Ajouter**
2. Remplissez les champs :

| Champ | Description |
|---|---|
| Numéro | Identifiant affiché sur le plan (ex : `1`) |
| Nom | Titre visible par les visiteurs |
| Cartel | Texte descriptif affiché lors de la visite |
| Type de média | `Aucun`, `Vidéo` ou `Audio` |
| Fichier média | Vidéo ou audio — uploadé automatiquement vers S3 |
| Images | Photos complémentaires |
| Visible | Active ou désactive le module pour les visiteurs |

3. Cliquez **Enregistrer**

### Modifier / Supprimer un module

- Sidebar → **Modules** → cliquez sur la ligne du module souhaité
- Modifiez les champs puis **Enregistrer**, ou cliquez **Supprimer**

### Placer les modules sur le plan

1. Sidebar → **Modules** → **Plan**
2. Glissez-déposez chaque module sur le plan de l'expérience
3. Cliquez **Sauvegarder le plan**

> Les positions sont enregistrées en pourcentage (0–1) pour s'adapter à tous les écrans.

### Réordonner les modules

- Sidebar → **Modules** → **Ordre**
- Glissez les modules pour définir l'ordre d'affichage
- Cliquez **Sauvegarder**

---

## 3. Challenges

Les challenges sont des quiz accessibles aux membres via l'application mobile.

### Créer un challenge

1. Sidebar → **Challenges** → **Ajouter**
2. Renseignez le nom, la description et uploadez une image de couverture
3. Cliquez **Enregistrer**

### Ajouter des questions à un challenge

1. Ouvrez un challenge existant
2. Dans la section **Questions**, cliquez **Ajouter une question**
3. Saisissez la question, les propositions de réponse et indiquez la bonne réponse
4. Répétez pour chaque question

> Le score d'un membre augmente uniquement lorsqu'il améliore son meilleur score personnel.

---

## 4. Événements

### Créer un événement

1. Sidebar → **Événements** → **Ajouter**
2. Remplissez : titre, description, date, heure, lieu, prix, organisateur, capacité max
3. Uploadez une image si disponible
4. Activez **Visible** pour le rendre public
5. Cliquez **Enregistrer**

### Consulter les analytics

La section **Événements** propose des tableaux de bord par type :

- **Mirokaï Experience** — créneaux, capacité, taux de remplissage
- **Afterwork / Robot Drinks** — éditions, participants, check-ins
- **Enchanted Talks** — sessions, intervenants, inscriptions

---

## 5. Médias

### Replays

1. Sidebar → **Médias** → **Replays**
2. Cliquez **Ajouter** pour uploader une vidéo de replay (titre, description, URL vidéo)
3. Modifiez ou supprimez via la liste

### Clips

1. Sidebar → **Médias** → **Clips**
2. Cliquez **Ajouter** pour créer un clip court (titre, URL vidéo)
3. Les membres peuvent liker les clips depuis l'application

---

## 6. Utilisateurs admin

1. Sidebar → **Utilisateurs**
2. Cliquez **Ajouter un utilisateur** pour créer un nouveau compte admin (email + mot de passe)
3. Les admins ont accès à l'ensemble de l'interface

> Ne partagez pas les identifiants admin. Créez un compte distinct pour chaque membre de l'équipe.

---

## 7. Questions

La banque de questions est partagée entre les modules et les challenges.

1. Sidebar → **Questions**
2. Cliquez **Ajouter une question**
3. Renseignez : texte, groupe d'âge (enfant / adulte), propositions, bonne réponse

---

## Bonnes pratiques

- **Images et vidéos** : les fichiers sont uploadés automatiquement sur AWS S3. Privilégiez des vidéos en MP4 (H.264) et des images en JPG/WebP.
- **Visibilité** : un module ou événement avec `Visible = désactivé` n'est pas affiché aux visiteurs — utile pour préparer du contenu avant publication.
- **Plan interactif** : après tout ajout ou modification de module, pensez à vérifier et mettre à jour les positions sur le plan.
- **Challenges** : ajoutez au minimum 3 questions par challenge pour une expérience satisfaisante.
