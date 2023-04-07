<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

## Wallet
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
## UML
![image](https://user-images.githubusercontent.com/30913247/230661192-3f1a0a49-2c25-4cfc-a0a2-534ae440fd33.png)

## DER
![image](https://user-images.githubusercontent.com/30913247/230661474-096fd76a-7b12-426f-ba32-79f9fe6106a6.png)

## LOGIC
![image](https://user-images.githubusercontent.com/30913247/229671390-6ee5295a-adba-4fd2-94e9-10d74f88ed2b.png)

Link da documentação: https://app.diagrams.net/#G1LdAEeKeAHpw8F96Z1rubbvg7tL5a046K

# Docker

Execute one of the following steps to have the application running on http://localhost:3000.

## Running with docker compose (recommended)

```sh
$ docker compose -f dockerfiles/docker-compose.yml up --build
```

## Running with docker



```sh
$ docker image list
REPOSITORY                  TAG       IMAGE ID       CREATED         SIZE
app-wallet         0.0.1     6770c550a346   7 minutes ago   313MB
```

```sh
$ docker start app-wallet
```
