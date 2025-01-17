<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">An <b>ACCOUNT MICROSERVICE</b> for a <b>Personal Finance Managment App</b>.
    <p align="center">

## Project setup

```bash
$ npm install
```

## Database setup

Create a new file `.env` directory and add the following content

```env
MONGODB_URI=mongodb+srv://<username>:<password>@accountservice.lc1wo.mongodb.net/
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

# Documentation 
Swagger documentation is available at http://localhost:3000/api


docker compose up --build -d
docker build -t tiazv09/account-microservice:1.0 .
docker push tiazv09/account-microservice:1.0