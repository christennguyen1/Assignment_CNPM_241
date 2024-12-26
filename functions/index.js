const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});

admin.initializeApp();

exports.api = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    if (req.method === "GET") {
      res.json({msg: "This is CORS-enabled for all origins!"});
    } else {
      res.status(405).send("Method Not Allowed");
    }
  });
});
