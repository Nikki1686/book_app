'use strict';

function populateForm(title, author, isbn, image_url, details) {
  $('form').children()[0].value = title;
  $('form').children()[1].value = author;
  $('form').children()[2].value = isbn;
  $('form').children()[3].value = image_url;
  $('form').children()[4].value = details;
}

function getDetails(siblings) {
  const image_url = siblings[0].src;
  // const title = 
}

$(() => {
  $('#add-form').hide();

  $('.select-book').on('click', e => {
    e.preventDefault();
    e.stopPropagation();

    getDetails($(e.target).siblings());

    $('main').hide();
    $('#add-form').show();
    console.log($(e.target).siblings()[0].src);
  })

  $('#add-form-submit').on('click', e => {
    e.preventDefault();
    e.stopPropagation();
    console.log('gottem');
  });
});