'use strict';

$(() => {
  $('.add-form').hide();

  $('.select-book').on('click', e => {
    e.preventDefault();
    e.stopPropagation();

    console.log($(e.target).parent().next());
    $(e.target).parent().hide();
    $(e.target).parent().next().show();
  })

  $('#add-form-submit').on('click', e => {
    e.preventDefault();
    e.stopPropagation();
    console.log('gottem');
  });
});