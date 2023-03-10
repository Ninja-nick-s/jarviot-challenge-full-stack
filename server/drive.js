const { google } = require("googleapis");

const { oauth2Client } = require("./auth");

const drive = google.drive({ version: "v3", auth: oauth2Client });

const getFiles = async (callback) => {
  let sharedFiles = [];
  let selfOwnedFiles = [];
  let ownedSharedFiles = [];
  let totalfiles = 0;
  let res = await drive.files.list({
    pageSize: 100,
    fields:
      "nextPageToken,files(name,size,fileExtension, webViewLink,owners, shared,ownedByMe,permissions)",
    orderBy: "createdTime desc",
  });

  let nextPageToken = res.data.nextPageToken;
  let files = res.data.files;
  totalfiles += files.length;
  files.map((file) => {
    if (file.ownedByMe === true) {
      selfOwnedFiles.push({
        name: file.name,
        size: parseInt(file.size / 1024),
        fileExtension: file.fileExtension,
        viewLink: file.webViewLink,
        ownerEmail: file.owners[0].emailAddress,
        ownerPhoto: file.owners[0].photoLink,
      });
    }
    if (file.ownedByMe === true && file.shared === true) {
      ownedSharedFiles.push({
        name: file.name,
        size: parseInt(file.size / 1024),
        fileExtension: file.fileExtension,
        viewLink: file.webViewLink,
        ownerEmail: file.owners[0].emailAddress,
        ownerPhoto: file.owners[0].photoLink,
      });
    }
    if (file.ownedByMe === false && file.shared === true) {
      sharedFiles.push({
        name: file.name,
        size: parseInt(file.size / 1024),
        fileExtension: file.fileExtension,
        viewLink: file.webViewLink,
        ownerEmail: file.owners[0].emailAddress,
        ownerPhoto: file.owners[0].photoLink,
      });
    }
  });

  while (nextPageToken) {
    res = await drive.files.list({
      pageSize: 100,
      fields:
        "nextPageToken,files(name,size,fileExtension, webViewLink, sharingUser,owners, shared,ownedByMe,permissions)",
      orderBy: "createdTime desc",
      pageToken: nextPageToken,
    });
    files = res.data.files;
    totalfiles += files.length;
    files.map((file) => {
      if (file.ownedByMe === true) {
        selfOwnedFiles.push({
          name: file.name,
          size: parseInt(file.size / 1024),
          fileExtension: file.fileExtension,
          viewLink: file.webViewLink,
          ownerEmail: file.owners[0].emailAddress,
          ownerPhoto: file.owners[0].photoLink,
        });
      }
      if (file.ownedByMe === true && file.shared === true) {
        ownedSharedFiles.push({
          name: file.name,
          size: parseInt(file.size / 1024),
          fileExtension: file.fileExtension,
          viewLink: file.webViewLink,
          ownerEmail: file.owners[0].emailAddress,
          ownerPhoto: file.owners[0].photoLink,
        });
      }
      if (file.ownedByMe === false && file.shared === true) {
        sharedFiles.push({
          name: file.name,
          size: parseInt(file.size / 1024),
          fileExtension: file.fileExtension,
          viewLink: file.webViewLink,
          ownerEmail: file.owners[0].emailAddress,
          ownerPhoto: file.owners[0].photoLink,
        });
      }
    });
    nextPageToken = res.data.nextPageToken;
  }

  callback(sharedFiles, selfOwnedFiles, ownedSharedFiles, totalfiles);
};

module.exports = { getFiles };
