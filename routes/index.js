const express = require('express');
const router = express.Router();
const scrapping = require('../helpers/scrapping.js');

// GET home page
router.get('/', function(req, res, next) {
  let champions = scrapping.read('champions');
  res.render('home', { "champions": champions });
});

// POST single champion
router.post("/champion/scrap", function(req, res, next) {
  let url = req.body.url;
  scrapping.champion.scrap(url, function () {
    res.send('coucou');
  });
});

// GET refreshed home page
router.get('/champions/scrap', function(req, res, next) {
  scrapping.champions.scrap(function () {
    res.send('true');
  });
});

module.exports = router;
