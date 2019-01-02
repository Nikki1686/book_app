'use strict';

$(() => {
  // always hide form
  $('.add-form').hide();

  // Show form helper
  function showFormHelper(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // show form in search results
  $('.select-book').on('click', e => {
    showFormHelper(e);

    $(e.target).parent().hide();
    $(e.target).parent().next().show();
  });

  // show form in details view
  $('#update-details').on('click', e => {
    showFormHelper(e);

    $(e.target).parent().parent().hide();
    $(e.target).parent().parent().next().show();
  });


  // Toggle menu from hamburger button
  $('#menu').hide();
  $('#hamburger').on('click', e => {
    e.preventDefault();
    e.stopPropagation();

    $('#menu').toggle();
  });
});