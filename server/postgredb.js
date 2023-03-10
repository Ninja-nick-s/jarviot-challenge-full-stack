const pg = require("pg");
require("dotenv").config();
const URL = process.env.DATABASE_URL;

let conString = URL;

const client = new pg.Client(conString);

const connectDB = () => {
  client.connect(function (err) {
    if (err) {
      console.error("could not connect to postgres", err);
    } else {
      console.log("Database connected");
    }
  });
  //   client.query(
  //     `CREATE TABLE tokens (email TEXT UNIQUE,refresh_token TEXT DEFAULT "refreshtoken",access_token TEXT DEFAULT "accesstoken")`,
  //     (err, res) => {
  //       if (err) throw err;
  //     }
  //   );
};

module.exports = { client, connectDB };
