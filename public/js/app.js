'use strict';

$(() => {
  $('#add-form').hide();

  $('.select-book').on('click', e => {
    e.preventDefault();
    e.stopPropagation();
    $('main').hide();
    $('#add-form').show();
  })

  $('#add-form').on('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('gottem');
  });
});