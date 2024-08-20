# Instacart Live Challenge

This challenge is for a candidate for developer for the engine team. It aims to understand the way of working of the candidate as well as his communication skills.

## Description

The Instacart service currently is able to handle the creation, obtainment and updates on a cart. The service has the following endpoints:

- `GET /` - Health endpoint
- `GET /health` - Health endpoint
- `GET /carts` - Retrieves all the carts in the DB
- `GET /carts/:id` - Retrieves a cart by id from the DB
- `PUT /carts/:id` - Updates a cart existing in the DB
- `GET /carts/:id/maximum_redeemable_points` - Gets maximum cashbak points that can be redeemed. These points are retreived from an external service that has the count of the cashback points.

The ERD is the following:

![ERD](https://github.com/user-attachments/assets/1344fd30-390f-4813-8363-728b2d35d410)

The challenge consists of adding an endpoint that allows to apply cashback points (loyalty) to an existing cart. The endpoint must:

- Validate if the points can be applied. This must be done against the external service that has the count of the points.
- Update the cart to include the applied points to the service.

## Running the service

### Repository cloning

```bash
git clone git@github.com:EngHans/instacart.git
cd instacart
```

### Dependency Installation

```bash
nvm install
nvm use
npm install
```

### Start the DB System and Apply Migrations

```bash
npm run apply-migrations
```

### Generate Random Data

```bash
npm run seed
```

### Running the Project

```bash
npm start
```

Navigate to http://localhost:3000/carts in your browser.


## Requirements for the Challenge

- [Docker/Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [DBeaver](https://dbeaver.io/download/) (Or some PostgreSQL DB Client)
- [Git CLI](https://git-scm.com/downloads)
- [Node.js](https://nodejs.org/en/download/package-manager) (Typescript)
- [NPM](https://www.npmjs.com/) (Node Package Manager)
- [NVM](https://github.com/nvm-sh/nvm) 
- [Postman](https://www.postman.com/downloads/) (Or [Hoppscotch](https://hoppscotch.com/download))
- [Account on Github](https://github.com/)
