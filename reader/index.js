const express = require("express");
const router = express.Router();
const fs = require("fs");
const config = require("../config");
const path = require("path");

router.get('/', (req, res) => {
  fs.readdir(config.logPath, (err, files) => {
    res.json(files)
  })
});

router.get('/file/:name', (req, res, next) => {

  if (!req.params.name) {
    res.sendStatus(404);
    return;
  }

  const fileName = path.join(config.logPath, req.params.name);

  console.log('will send', fileName);

  const options = {
    root: path.join(__dirname, "..")
  };

  fs.access(fileName, fs.constants.F_OK, err => {
    if (err) {
      res.sendStatus(404);
      return;
    }

    res.sendFile(fileName, options, err => {
      if (err) {
        console.error(err);
        res.sendStatus(500);
      }
    });
  });

});

module.exports = router;
