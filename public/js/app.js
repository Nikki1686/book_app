'use strict';

$(() => {
  // always hide the editable forms
  $('.add-form').hide();

  // Event helper
  function eventHelper(e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  // show form in search results
  $('.select-book').on('click', e => {
    eventHelper(e);

    $(e.target).parent().hide();
    $(e.target).parent().next().show();
  });

  // hide form on cancel click in search results
  $('.cancel-add').on('click', e => {
    eventHelper(e);

    $(e.target).parent().parent().parent().hide();
    $(e.target).parent().parent().parent().prev().show();
  });

  // show form in details view
  $('#update-details').on('click', e => {
    eventHelper(e);

    $(e.target).parent().parent().hide();
    $(e.target).parent().parent().next().show();
  });


  // Toggle menu from hamburger button
  $('#menu').hide();
  $('#hamburger').on('click', e => {
    eventHelper(e);

    $('#menu').toggle();
  });
});