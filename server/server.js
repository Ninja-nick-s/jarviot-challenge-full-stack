const path = require("path");
const express = require("express");
const { connectDB } = require("./postgredb");
let cors = require("cors");
const { Autherization, Authcallback, RevokeAccess } = require("./auth");
const { getFiles } = require("./drive");
const app = express();
require("dotenv").config();

app.use(cors());
app.options("*", cors());
connectDB();

// app.use(express.static(path.join(__dirname, "../client/build")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });

let authed = false;

app.get("/api", (req, res) => {
  res.send("hello world");
});

app.get("/api/files", async (req, res) => {
  if (authed) {
    let sharedfiles = [];
    let selfownedfiles = [];
    let ownedsharedfiles = [];
    let filescount = 0;
    const callback = (
      sharedFiles,
      selfOwnedFiles,
      ownedSharedFiles,
      totalfiles
    ) => {
      sharedfiles = sharedFiles;
      selfownedfiles = selfOwnedFiles;
      (ownedsharedfiles = ownedSharedFiles), (filescount = totalfiles);
    };
    await getFiles(callback);
    let sharedfilescount = sharedfiles.length;
    let ownedsharedfilecount = ownedsharedfiles.length;
    const allFiles = {
      sharedfiles: sharedfiles,
      selfownedfiles: selfownedfiles,
      ownedsharedfiles: ownedsharedfiles,
      filescount: filescount,
      sharedfilescount: sharedfilescount,
      ownedsharedfilecount: ownedsharedfilecount,
    };
    res.json(allFiles);
  } else {
    res.send("Not authorized yet!");
  }
});

app.get("/api/auth", (req, res) => {
  if (!authed) {
    const url = Autherization();
    res.json({ url: url, authed: false });
  } else {
    res.json({ authed: true });
  }
});

app.get("/api/oauth2callback", async (req, res) => {
  const code = req.query.code;
  if (code) {
    authed = Authcallback(code);
    if (authed) {
      res.redirect(process.env.CLIENT_URL);
    } else {
      res.send("Autherization failed");
    }
  }
});

app.get("/api/revoke", (req, res) => {
  if (authed) {
    authed = RevokeAccess();
    authed = false;
    res.json({ authed: false });
  } else {
    res.send("Not Autherized Yet!");
  }
});

const PORT = 5000 || process.env.PORT;

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
