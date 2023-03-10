# <b>Google Drive Risk Report

## <b>Getting Started with Project

This project has server and client side architecture. Postgresql is used for database. For server side node express is used. For client side containing frontend is developed using react. This makes it a PERN stack project.

## <b>Available Scripts

In the project directory, you can run:

### `npm start`

Do npm start to install packages in root repository directory. Then in both client and server directory.

### **Note: It uses concurrently package to run both frontend and backend at one command !** <br>

### `npm run dev`

## <b>Google APIs

Login into your google cloud console and in API and services enable google drive api and google people api.<br>
Get your credentials, setup redirect URI properly and put it into environment variables using .env file.<br>.env.example file is given for example.

## <b>Postgresql Database

Download postgresql in your local machine and create a database and table for our app.<br> Get URL database to connect and access either client or pool for query.<br>
You can also use [Elephant sql](https://www.elephantsql.com/) to configure online postgresql database.

### **Setup environment variables properly and you are ready to go !**<br>
