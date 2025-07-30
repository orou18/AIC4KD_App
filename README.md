
# 🌟 **Nephrosense** – La santé rénale réinventée

**Nephrosense**, c’est bien plus qu’une application : c’est une plateforme intelligente pensée pour accompagner les professionnels de santé dans le **suivi, l’analyse** et la **gestion des maladies rénales chroniques (CKD)**. Un outil moderne, sécurisé et conçu pour simplifier les tâches cliniques du quotidien — sans compromis sur la précision médicale.

---

## 🎯 **Notre mission**

* 🖥️ **Digitaliser** les processus de suivi des patients atteints de CKD
* 🚨 **Automatiser** la détection des cas critiques via des alertes intelligentes
* 🧠 **Centraliser** les données pour une vue clinique complète
* 📄 **Générer** des rapports PDF professionnels en un clic
* 📊 **Faciliter** les décisions médicales par la donnée
* 🤖 **Préparer** l’avenir avec l’intégration de l’IA

---

## 🧩 **Fonctionnalités clés**

### 🔐 Authentification & Sécurité

* Connexion sécurisée, gestion des sessions
* Routes protégées pour les données sensibles

### 📊 Tableau de bord intelligent

* Statistiques live : patients, alertes, consultations
* Graphiques interactifs & filtrage dynamique
* Vue synthétique des cas critiques

### 👤 Gestion des patients

* Création et édition de fiches patients
* Attribution automatique d’un stade CKD (1 à 5)
* Historique médical complet
* Identifiants patients uniques

### 🏥 Gestion des consultations

* Saisie des constantes cliniques (créatinine, eGFR, tension, poids)
* Notes cliniques riches
* Historique structuré par patient

### ⚠️ Alertes intelligentes

* Alertes **critiques**, **modérées** ou **préventives**
* Seuils personnalisables par patient
* Suivi automatique des tendances et évolutions

### 📄 Rapports PDF médicaux

* Données cliniques + visualisations
* Export sécurisé pour impression ou archivage

### 🌍 Interface multilingue

* 🇫🇷 Français & 🇬🇧 Anglais
* Design responsive : desktop, tablette, mobile

---

## ⚙️ **Architecture technique**

### 🎨 Frontend (React + Vite)

| Outil              | Usage                 |
| ------------------ | --------------------- |
| **React 18**       | Interface utilisateur |
| **Vite 5**         | Build ultrarapide     |
| **TailwindCSS**    | Styling moderne       |
| **Wouter**         | Routing minimal       |
| **TanStack Query** | Données synchronisées |
| **Framer Motion**  | Animations fluides    |

### 🧠 Backend (Node.js + Express)

| Outil           | Usage                          |
| --------------- | ------------------------------ |
| **Express**     | API REST                       |
| **PostgreSQL**  | Base de données                |
| **Drizzle ORM** | Modélisation fluide            |
| **PDFKit**      | Génération PDF                 |
| **Passport.js** | Authentification               |
| **Zod**         | Validation stricte des données |

---

## 📦 Installation en 5 minutes

```bash
# Cloner le projet
git clone <url-du-repo>
cd Nephrosense

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env
# Modifier DATABASE_URL dans .env

# Appliquer le schéma en base de données
npm run db:push

# Lancer le serveur de dev
npm run dev
```

---

## 📜 Scripts utiles

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `npm run dev`     | Démarrage du mode développement |
| `npm run build`   | Compilation pour la production  |
| `npm start`       | Lancement en production         |
| `npm run check`   | Vérification TypeScript         |
| `npm run db:push` | Synchronisation de la DB        |

---

## 🗂️ Arborescence simplifiée

```
Nephrosense/
├── client/         → Interface utilisateur (React)
├── server/         → API et logique métier (Express)
├── shared/         → Schémas partagés (Zod + Drizzle)
├── .env            → Variables d'environnement
├── package.json    → Dépendances et scripts
└── README.md       → Documentation
```

---

## 🧬 Modèle de données

### 👥 Patients

* Identité, âge, antécédents, stade CKD
* UUID unique et timestamps

### 📅 Consultations

* Valeurs cliniques clés
* Notes du praticien
* Référencement au patient

### ⚠️ Alertes

* Niveaux : info / warning / critical
* Statut : actif / résolu
* Détail des seuils atteints

---

## 🔌 API REST (extraits)

| Endpoint                    | Action                |
| --------------------------- | --------------------- |
| `GET /api/patients`         | Liste des patients    |
| `POST /api/consultations`   | Nouvelle consultation |
| `GET /api/alerts`           | Alertes en cours      |
| `GET /api/patients/:id/pdf` | Rapport PDF généré    |

---

## 🔐 Sécurité & confidentialité

* 🔑 Sessions sécurisées par cookie
* 🧼 Validation serveur & client avec Zod
* 🧾 Séparation stricte des accès frontend/backend
* 🧊 Variables d’environnement externalisées
* 🔒 Connexion sécurisée à la base PostgreSQL

---

## 🚀 Déploiement

```bash
npm run build    # Compile l'app (frontend + backend)
npm start        # Lance l'application en mode production
```

**.env requis** :

```env
DATABASE_URL=postgresql://user:pass@host:port/db
NODE_ENV=production
PORT=5000
```

## 🧭 Roadmap 2025

### ✅ Phase 1 (complétée)

* Gestion des patients
* Système d’alertes initial
* Génération PDF

### 🔄 Phase 2 (en cours)

* 🎯 Intégration d’IA (détection de gravité)
* 📲 API mobile + notifications
* 🧪 Tests avancés

### 🧠 Phase 3 (à venir)

* 🔗 Intégration avec hôpitaux
* 📱 App mobile native
* 📊 Analytics avancés

---

## 💬 Contact

👨‍💻 **Développeur** : Léonce OROU AWA
📧 **Email** : `orouleonce@gmail.com`
🌐 **Repo GitHub** : \[git@github.com:orou18/AIC4KD_App.git]
🌐**Lien Site web Nephrosense** : \[ https://aic4kd-app-6.onrender.com]
