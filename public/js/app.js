'use strict';

$(() => {
  // Show form in search results
  $('.add-form').hide();
  $('.select-book').on('click', e => {
    e.preventDefault();
    e.stopPropagation();

    $(e.target).parent().hide();
    $(e.target).parent().next().show();
  });

  // Toggle menu from hamburger button
  $('header ul').hide();
  $('#hamburger').on('click', e => {
    e.preventDefault();
    e.stopPropagation();

    $('#menu').toggle();
  })
});