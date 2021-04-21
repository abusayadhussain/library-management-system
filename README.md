# Library Management System

Library management system api built with MongodDB, Express.js and Node.js

## Techonologies used in this application

1. MongoDB
2. Express.js
3. Node.js

## Install dependencies

There is a package.json file associated with the project. Simply by running 
`npm install or npm i` do the trick

## Run the application

- run `npm run dev`
- App will open at [http://localhost:3000](http://localhost:3000)

## About the api

There are 5 modules in this app

- Admin
- User
- Books
- Author
- Loan

## Library Member

Browse books, authors, request and view Book-Loans

## Library Admin

Create, update, remove Books and Authors. Accepet, reject Book-Loan requests. Update Book-Loan when book is returned

## Additional Functionalities
- Token Based Authentication (JWT RS256 implemented)
- Profile image upload for users
- Browse books by title and author
- Excel export for Book-Loans data (only Library Admin)


## Test The Api
There is a file postman-collection added with the github repo. Simply import it to the postman will import all the 
endpoints to postman for testing.
