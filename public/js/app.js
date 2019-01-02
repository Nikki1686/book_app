'use strict';

$(() => {
  $('.add-form').hide();

  $('.select-book').on('click', e => {
    e.preventDefault();
    e.stopPropagation();

    $(e.target).parent().hide();
    $(e.target).parent().next().show();
  });


  $('header ul').hide();
  $('#hamburger').on('click', e => {
    e.preventDefault();
    e.stopPropagation();

    $('header ul').toggle();
  })
});