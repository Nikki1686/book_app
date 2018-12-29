'use strict';

//App Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

//Load env vars;
require('dotenv').config();
const PORT = process.env.PORT || 3004;

//postgres
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//app
const app = express();
app.use(cors());

function home(request, response){
  response.render('pages/index');
}

// Error messages
app.get('/*', function(request, response) {
  response.status(404).send('halp, you are in the wrong place');
});

// Error handler
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).send('Sorry, something went wrong');
}

app.listen(PORT, () => {
  console.log(`app is up on port : ${PORT}`);
});
