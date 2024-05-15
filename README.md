# Node.js API Server voor Programmeren 4

Dit is een API-server voor de cursus Programmeren 4. De server is online gedeployed op Azure.

## Deployment

De server is gedeployed op: [https://deelopdrachtprog4.azurewebsites.net](https://deelopdrachtprog4.azurewebsites.net)

## Projectstructuur

project-root
├── src
│ ├── controllers
│ ├── models
│ ├── routes
│ └── utils
├── test
├── .env
├── .gitignore
├── package.json
└── README.md


## Installatie en Setup

1. **Kloon de repository:**

    ```bash
    git clone <repository-url>
    cd project-root
    ```

2. **Installeer de dependencies:**

    ```bash
    npm install
    ```

3. **Omgevingsvariabelen:**

    Maak een `.env` bestand aan in de hoofdmap met de volgende inhoud:

    ```
    DB_HOST=<je-database-host>
    DB_PORT=<je-database-poort>
    DB_USER=<je-database-gebruiker>
    DB_PASSWORD=<je-database-wachtwoord>
    DB_DATABASE=<je-database-naam>
    JWT_KEY=<je-jwt-sleutel>
    ```

4. **Start de server:**

    ```bash
    npm start
    ```

    De server zal starten op de poort die is opgegeven in je `.env` bestand of standaard op poort 3000.

## Testen

Om de tests uit te voeren, gebruik je het volgende commando:

npm test

## Gebruik
API Endpoints
Hier zijn enkele voorbeeld API endpoints:

GET /api/users - Haal alle gebruikers op
POST /api/users - Maak een nieuwe gebruiker aan
GET /api/users/:id - Haal een gebruiker op ID op
PUT /api/users/:id - Werk een gebruiker bij op ID
DELETE /api/users/:id - Verwijder een gebruiker op ID
Bekijk de broncode van het project voor meer endpoints en hun details.

Deployment naar Azure
Vereisten
Azure account
Azure CLI geïnstalleerd
Node.js en npm geïnstalleerd