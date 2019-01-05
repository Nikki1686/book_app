'use strict';

$(() => {
  // first hide the relevant forms
  $('.edit-form').hide();

  // Event helper
  function eventHelper(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  // Toggle form and card
  function toggleFormAndCard(e) {
    const id = $(e.target).attr('id').split('-')[1];
    const cardId = '#card-' + id;
    const formId = '#form-' + id;
    $(cardId).toggle();
    $(formId).toggle();
  }
  
  // show form in search results
  $('.select-book').on('click', e => {
    eventHelper(e);
    toggleFormAndCard(e);
  });
  
  // show form in details view
  $('.update-details').on('click', e => {
    eventHelper(e);
    toggleFormAndCard(e);
  });
  
  // hide form on cancel
  $('.cancel').on('click', e => {
    eventHelper(e);
    toggleFormAndCard(e);
  });

  // Toggle menu from hamburger button
  $('#menu').hide();
  $('#hamburger').on('click', e => {
    eventHelper(e);
    $('#menu').toggle();
  });
});