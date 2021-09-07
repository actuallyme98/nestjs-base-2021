## Development

1. Install Docker, Docker compose
2. Create `.env.development` file follow `.env.sample`
3. Setup mysql, phpmyadmin container

```
docker-compose --env-file=.env.development up -d
```

4. Install dependency packages

```
yarn install
```

5. Run migration

```
yarn db:migrate
```

6. Seeding

```
yarn db:seed
```

7. Run project in dev environment

```
yarn start:dev
```

## Production

1. Install Docker, Docker compose
2. Create `.env.production` file follow `.env.sample`
3. Run project in production environment

```
docker-compose -f docker-compose.prod.yaml --env-file=.env.production up --build
```
