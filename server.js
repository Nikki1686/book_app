'use strict';

// Load Dependencies
const express = require('express');
const cors = require('cors');
const superagent = require('superagent');
const pg = require('pg');
const methodOverride = require('method-override');

// Load env vars;
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// PostgresQL setup
const client = new pg.Client(process.env.DATABASE_URL);
client.connect();
client.on('error', err => console.error(err));

// App setup, configure, and middlewares
const app = express();
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.static('./public'));

app.use(methodOverride((req, res) => {
  if(req.body && typeof req.body === 'object' && '_method' in req.body){
    let method = req.body['_method'];
    delete req.body['_method'];
    return method;
  }
}));

app.set('view engine', 'ejs');


// Routes
app.get('/', home);
app.get('/searches', newSearch);
app.post('/searches', search);
app.get('/books/:id', getOneBook);
app.post('/books', saveBook);
app.put('/books/:id', updateBook);
app.delete('/books/:id', deleteBook);


// Handles
function home(req, res){
  client.query('SELECT * FROM books')
    .then(data => {
      res.render('pages/index', {
        books: data.rows, 
        view: 'index'
      });
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
      if (result.body.totalItems === 0) {
        return handleError('No results found', res);
      }
      let books = result.body.items.map(book => new Book(book));
      res.render('pages/searches/show', {
        books: books, 
        view: 'searches'
      });
    })
    .catch(err => handleError(err, res));

}

function getOneBook(req, res) {
  let SQL = 'SELECT * FROM books WHERE id=$1;';
  let values = [req.params.id];

  return client.query(SQL, values)
    .then(result => {
      const book = result.rows[0];
      return client.query('SELECT DISTINCT bookshelf FROM books;')
        .then(bookshelfData => {
          const bookshelves = bookshelfData.rows;
          res.render('pages/books/show', {
            book: book,
            bookshelves: bookshelves,
            view: 'detail'
          });
        })
        .catch(err => handleError(err, res));
    })
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

function updateBook(req, res) {
  let SQL = `UPDATE books SET 
              title=$2,
              author=$3,
              isbn=$4,
              image_url=$5,
              description=$6,
              bookshelf=$7
              WHERE id=$1;`;
  let values = [req.params.id, req.body.title, req.body.author, req.body.isbn, req.body.image_url, req.body.description, req.body.bookshelf];
  
  client.query(SQL, values)
    .then(results => {
      res.redirect(`/books/${req.params.id}`);
    })
    .catch(err => handleError(err, res));
}

function deleteBook(req, res) {
  let SQL = 'DELETE FROM books WHERE id=$1';
  let values = [req.params.id];

  client.query(SQL, values)
    .then(result => {
      res.redirect('/');
    }) 
    .catch(err => handleError(err, res));
}


// Model
function Book(book){
  this.title = book.volumeInfo.title || 'No title provided';
  this.author = book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'Unknown';
  this.image_url = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : 'https://i.imgur.com/J5LVHEL.jpeg';
  this.description = book.volumeInfo.description || 'No description provided.';
  this.isbn = book.volumeInfo.industryIdentifiers ? book.volumeInfo.industryIdentifiers[0].identifier : 'Unknown ISBN';
}


// Page not found handler
app.get('/*', function(req, res) {
  res.status(404).render('pages/error', {
    message: 'Page does not exist',
    error: 'You are in the wrong place bozo',
  })
});

// Server error handler
function handleError(err, res) {
  console.error(err);
  if (res) res.status(500).render('pages/error', {
    message: 'Server Error',
    error: err
  });
}

// App listening on PORT
app.listen(PORT, () => {
  console.log(`server is up on port : ${PORT}`);
});
