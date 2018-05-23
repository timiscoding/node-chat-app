import $ from 'jquery'; // eslint-disable-line import/no-extraneous-dependencies

const socket = io(); // eslint-disable-line no-undef

const updateRoomInfo = ({ rooms }) => {
  $('#active-rooms').text(rooms.length);
  const defaultOption = $('<option value="" selected="selected">-- Active rooms --</option>');
  const options = rooms.map(room => $(`<option>${room}</option>`, { value: room }));
  $('#room-select').empty().append(defaultOption, options);
};

$(document).ready(() => {
  $('form').submit((e) => {
    e.preventDefault();
    const data = {
      name: $('#name').val(),
      room: $('#room-text').val() || $('#room-select').val(),
    };

    window.location.href = `chat.html?${$.param(data)}`;
  });

  $('#room-text').change(() => {
    $('#room-select').val('');
  });

  $('#room-select').change(() => {
    $('#room-text').val('');
  });

  socket.on('connect', () => {
    socket.emit('getRoomList', null, updateRoomInfo);
  });

  socket.on('updateRoomList', updateRoomInfo);
});
