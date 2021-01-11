# Repository pattern & Dependency injection using TypeScript

This scafold project implements a NodeJS, and ExpressJS powered web application using repository pattern and dependency injection. The main idea is independent of any framework or database. TypeScript is used instead of JavaScript for various reasons. Especially the support for interface, generic type support, and better IntelliSense. It also uses Jest as its testing framework and Passport for authentication and authorization.

# Usage
- Install TypeScript globally (`npm i -g typescript`)
- Install required modules (`npm install`)
- Compile typescript to javascript (`npm run compile`)
- Run (`npm start`)
- Run tests (`npm run test`)

# Core Features
- Dependency injection
- Repository pattern
- Jest unit testing
- Passport security
- Containerization

## Dependency injection using InversifyJS
[InversifyJS](http://inversify.io/) is a very useful library for dependency injection in JavaScript. It has first class support for TypeScript. It is not necessary to use interface to use dependency injection because Inversify can work with class. But, we should **"depend upon Abstractions and do not depend upon concretions"**. So we will use interfaces (abstractions). Everywhere in our application, we will only use (import) interfaces. In the `src/inversify.ts` file we will create a container, import necessary classes and do dependency bindings. InversifyJS requires a library named [reflect-metadata](https://www.npmjs.com/package/reflect-metadata).

## Repository pattern
Main purpose is to seperate database from business logic. If you ever decide to change the databse then you only need to update repositories. The base repository is `src/repositories/base.repository.ts`. All other repositores should be derived from it (Ex: `user.repository.ts`).

## Security
The Passport library was used to implement security for authentication and authorization.

## Testing
Two functionaliities were tested using the Jest framework
- Security (Authentication and Role-based Authorization)
- File upload