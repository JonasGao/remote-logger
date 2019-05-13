const express = require("express");
const router = express.Router();
const fs = require("fs");
const config = require("../config");

router.get('/', (req, res) => {
  fs.readdir(config.logPath, (err, files) => {
    res.json(files)
  })
});

module.exports = router;
