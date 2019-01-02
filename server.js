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
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.set('view engine', 'ejs');

app.get('/', home);
app.get('/searches', newSearch);
app.post('/searches', search);
app.get('/books/:id', getOneBook);
app.post('/books', saveBook);


function home(req, res){
  client.query(`SELECT * FROM books`)
    .then(data => {
      res.render('pages/index', {books: data.rows});
    })
    .catch(err => handleError(err, res));
}

function newSearch(req, res) {
  res.render('pages/searches/new');
}

function search(req, res){
  const searchStr = req.body.search[0];
  const searchType = req.body.search[1];
  let url = 'https://www.googleapis.com/books/v1/volumes?q=';

  if(searchType === 'title'){
    url += `+intitle:${searchStr}`;
  } else if(searchType === 'author'){
    url += `+inauthor:${searchStr}`
  }

  return superagent.get(url)
    .then(result => {
      // console.log(result.body.items[0]);
      let books = result.body.items.map(book => new Book(book));
      res.render('pages/searches/shows', {books});
    })
    .catch(err => handleError(err, res));

}

function getOneBook(req, res) {
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [req.params.id];

  return client.query(SQL, values)
    .then(result => res.render('pages/books/show', {book: result.rows[0]}))
    .catch(err => handleError(err, res));
}

function saveBook(req, res) {
  let SQL = 'INSERT INTO books(title, author, isbn, image_url, description, bookshelf) VALUES ($1, $2, $3, $4, $5, $6);';
  let values = [req.body.title, req.body.author, req.body.isbn, req.body.image_url, req.body.description, req.body.bookshelf];

  return client.query(SQL, values)
    .then(result => {
      let SQL = 'SELECT id FROM books WHERE isbn=$1;';
      let values = [req.body.isbn];

      return client.query(SQL, values)
        .then(result => {
          res.redirect(`/books/${result.rows[0].id}`);
        })
        .catch(err => handleError(err, res));
    })
    .catch(err => handleError(err, res));
}


// Model
function Book(book){
  this.title = book.volumeInfo.title || 'No title provided';
  this.author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown';
  this.image = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpeg';
  this.description = book.volumeInfo.description || 'No description provided.';
  this.isbn = book.volumeInfo.industryIdentifiers[0].identifier;
}

// Error messages
app.get('/*', function(req, res) {
  res.status(404).send('you are in the wrong place bozo');
});

// Error handler
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).render('pages/error');
}

app.listen(PORT, () => {
  console.log(`server is up on port : ${PORT}`);
});
