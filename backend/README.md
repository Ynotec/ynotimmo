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
ODOO_DB_NAME="Progiciel"
ODOO_DB_USER="test"
ODOO_DB_PASSWORD="test"
ODOO_NODE_ENV="PRD"
YNOTIMMO_PORT=3000

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

Attention que product_id doit correspondre à un ID de variante d'article (product.product) et non au template. (product.template)

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
      "name": "Villa ensolleilée dans un quartier résidentiel",
      "product_uom_qty": 3,
      "price_unit": 1500
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
            "order_line": [
                {
                    "product_id": 32,
                    "name": "Villa ensolleilée dans un quartier résidentiel",
                    "product_uom_qty": 3,
                    "price_unit": 1500
                }
            ]
        }
    ]
}
```

## Login 

### /api/auth/login

**POST**
Permet de simuler une connexion utilisateur en demandant à Odoo de vérifier les credentials.

#### req
```
{
    "email": "johndoe@gmail.com",
    "password": "password123",
}
```

## RentalProperty

### /api/rentalProperty/import
**POST**
Permet d'importer une propriété locative dans Odoo à partir des données fournies.

#### req
```
{
    "name": "Villa ensolleilée dans un quartier résidentiel",
    "street": "203 Avenue Mascaux",
    "number_house": "12B",
    "postal_code": "6001",
    "city": "Marcinelle",
    "description": "Belle villa avec jardin et piscine.",
    "list_price": 1500,
    "number_of_bedrooms": 4,
    "number_of_bathrooms": 3,
    "climatization": true,
    "image_1920": "<base64-encoded-image-string>"
}
```

#### res
```
{
    "id": 45,
    "name": "Villa ensolleilée dans un quartier résidentiel",
    "street": "203 Avenue Mascaux",
    "number_house": "12B",
    "postal_code": "6001",
    "city": "Marcinelle",
    "description": "Belle villa avec jardin et piscine.",
    "list_price": 1500,
    "number_of_bedrooms": 4,
    "number_of_bathrooms": 3,
    "climatization": true,
    "image_1920": "<base64-encoded-image-string>"
}
```

### /api/rentalProperty/import-json
**POST**
Permet d'importer plusieurs propriétés locatives dans Odoo à partir d'un fichier CSV contenant
les données.

#### req 

````
name,description_sale,list_price,street,number_house,postal_code,guest_capacity,number_of_bed,number_of_bedrooms,number_of_bathrooms,climatization,active,property_type,image_1920
"Appartement cosy au centre-ville","Un superbe appartement avec vue sur la place principale. Parfait pour un couple.",1200,"Grande Place","1A","1000",2,1,1,1,True,True,"appartement","<base64-encoded-image-string>"
```


