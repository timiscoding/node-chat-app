import $ from 'jquery';

$(document).ready(() => {
  $('form').submit((e) => {
    e.preventDefault();
    const data = {
      name: $('#name').val(),
      room: $('#room-text').val() || $('#room-select').val()
    };

    window.location.href = `chat.html?${$.param(data)}`;
  });

  $('#room-text').change(() => {
    $('#room-select').val('');
  });

  $('#room-select').change(() => {
    $('#room-text').val('');
  });
});
