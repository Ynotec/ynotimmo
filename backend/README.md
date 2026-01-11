## 
Ynotimmo : Backend API

Ce projet est une API Backend développée en **Node.js** et **TypeScript**. Elle sert de backend entre une application frontend (site de réservation) et une instance **Odoo**.

Elle permet de gérer les utilisateurs, de récupérer les propriétés locatives et de gérer le flux complet de réservation (Création de compte → Devis → Commande).

## Prérequis

* **Node.js** (v18+ recommandé)
* **npm**
* Une instance **Odoo** accessible (v18)
* Un compte utilisateur Odoo avec les droits d'accès API

## Installation

1.  **Cloner le projet :**
    ```bash
    git clone TODO : rajouter URL
    cd backend
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurer l'environnement :**
    Créez un fichier `.env` à la racine du dossier backend.

## Configuration (.env)

```env

ODOO_BASE_URL="http://localhost"
ODOO_DB_NAME="dbname"
ODOO_DB_USER="user"
ODOO_DB_PASSWORD="password"

```

# Démarrage

```
// DEV
npm run dev 

// PRD
npm run build
npm run start
```

# Architecture 
```
src/
├── lib/         # librairie (OdooApi Singleton)
├── controllers/    # Gestion des requêtes HTTP
├── models/         # Interfaces
├── repositories/   # CRUD vers Odoo
├── routes/         # Définition des endpoints API
├── services/       # Logique métier
└── index.ts        # Point d'entrée de l'application
```

# Documentation API
JSON application/json

## Test
**GET**
Route qui permet juste de vérifier si le backend répond bien.

req
```
/
```
res
```
Le back-end est en ligne
```

## Réservation 

### /api/bookings


#### /api/bookings/create
**POST**
Pour créer une réservation, cette route vérifie si le client existe (via email), si ce n'est pas le cas, il le crée ensuite le devis est crée en mode brouillon.

Attention que product_id doit correspondre à un ID de variante d'article (product.product) et non au template.

#### req
```
{
  "user": {
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "phone": "0601020304",
    "street": "203 Avenue Mascaux",
    "city": "Marcinelle",
    "zip": "6001"
  },
  "lines": [
    {
      "product_id": 32,
      "name": "Location appartement centre-ville - 3 Nuits",
      "product_uom_qty": 3,
      "price_unit": 150
    }
  ]
}
```
#### res

### /api/bookings/track
**POST**

Retrouve toutes les commandes liées à une adresse mail
#### req
```
{
    "email": "johndoe@gmail.com"
}
```


#### res

si pas de commande, un tableau vide sera renvoyé
```
{
    "orders": []
}
```

si une commande existe 
Status possible : 
sale = devis confirmé, en commande
cancel = devis annulé
sent = commande confirmée et envoyé par mail
draft = devis en cours de traitement (brouillon)
```
{
    "orders": [
        {
            "id": 2,
            "name": "S00002",
            "date_order": "2026-01-08 07:00:59",
            "state": "sale",
            "amount_total": 544.5
        }
    ]
}
```