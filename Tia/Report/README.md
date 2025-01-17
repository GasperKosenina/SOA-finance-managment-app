<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://static-00.iconduck.com/assets.00/nestjs-icon-2048x2038-6bjnpydw.png" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A <b>REPORT MICROSERVICE</b> for a <b>Personal Finance Managment App</b>.
    <p align="center">

## Project setup

```bash
$ npm install
```

## Database setup

Create a new file `.env` directory and add the following content

```env
MONGODB_URI=mongodb+srv://user:<password>@report.45czh.mongodb.net/
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

```

# Documentation 
Swagger documentation is available at http://localhost:4000/api


docker compose up --build -d
docker build -t tiazv09/report-microservice:1.1 .
docker push tiazv09/report-microservice:1.1