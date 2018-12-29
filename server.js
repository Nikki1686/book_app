'use strict';

//App Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');

//Load env vars;
require('dotenv').config();
const PORT = process.env.PORT || 3000;

//postgres
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

//app
const app = express();
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.get('/', home);
app.get('/hello', hello);
app.post('/searches', search);


function home(request, response){
  response.render('pages/index');
}

function hello(request, response){
  response.render('pages/index');
}

function search(request, response){
  const searchStr = request.body.search[0];
  const searchType = request.body.search[1];
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(searchType === 'title'){
    url += `+intitle:${searchStr}`;
  } else if(searchType === 'author'){
    url += `+inauthor:${searchStr}`
  }

  return superagent.get(url)
    .then(result => {
      let books = result.body.items.map(book => new Book(book));
      console.log(books);
      response.render('pages/searches/shows', {books});
    });

}

function Book(book){
  // console.log(book);
  this.title = book.volumeInfo.title || 'this book does not have a title';
  this.placeholderImage = 'https://i.imgur.com/J5LVHEL.jpeg';
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
