const { google } = require("googleapis");
const { client } = require("./postgredb");
require('dotenv').config();

let email;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

const oauth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const scopes = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

const Autherization = () => {
  // generate a url that asks permissions for drive
  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  return url;
};

const Authcallback = async (code) => {
  //get an access token
  let authed = false;
  const { tokens } = await oauth2Client.getToken(code);

  oauth2Client.setCredentials(tokens);

  const people = google.people({
    version: "v1",
    auth: oauth2Client,
  });
  const userInfo = await people.people.get({
    resourceName: "people/me",
    personFields: "emailAddresses",
  });

  email = userInfo.data.emailAddresses[0].value;

  client.query(`SELECT * FROM tokens WHERE email=$1`, [email], (err, res) => {
    if (err) throw err;
    if (res.length === 0) {
      client.query(
        `INSERT INTO tokens (email) VALUES ($1)`,
        [email],
        (err, res) => {
          if (err) throw err;
        }
      );
    }
  });

  client.query(
    `UPDATE tokens SET refresh_token=$1,access_token=$2 WHERE email=$3`,
    [tokens.refresh_token, tokens.access_token, email],
    (err, res) => {
      if (err) throw err;
    }
  );

  let REFRESH_TOKEN;
  client.query(
    `SELECT refresh_token FROM tokens WHERE email=$1`,
    [email],
    (err, res) => {
      if (err) throw err;
      REFRESH_TOKEN = res.rows[0].refresh_token;
      oauth2Client.setCredentials({
        refresh_token: REFRESH_TOKEN,
      });
    }
  );

  authed = true;

  return authed;
};

const RevokeAccess = () => {
  let ACCESS_TOKEN;
  client.query(
    `SELECT access_token FROM tokens WHERE email=$1`,
    [email],
    (err, res) => {
      if (err) throw err;
      ACCESS_TOKEN = res.rows[0].access_token;
      oauth2Client.revokeToken(ACCESS_TOKEN, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log("revoked");
        }
      });
    }
  );
  return false;
};

module.exports = { Autherization, Authcallback, RevokeAccess, oauth2Client };
