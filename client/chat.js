/* eslint-disable no-alert, no-console */

import $ from 'jquery';
import moment from 'moment';
import Mustache from 'mustache';

const socket = io(); // eslint-disable-line no-undef

const scrollToBottom = () => {
  const messages = $('#message-list');
  const newMessage = messages.children('li:last-child');
  const scrollTop = messages.prop('scrollTop');
  const scrollHeight = messages.prop('scrollHeight');
  const clientHeight = messages.prop('clientHeight');
  const newMessageHeight = newMessage.innerHeight();
  const lastMessageHeight = newMessage.prev().innerHeight();

  if (scrollTop + clientHeight + newMessageHeight + lastMessageHeight >= scrollHeight) {
    messages.scrollTop(scrollHeight);
  }
};

const renderMessage = (message) => {
  const timestamp = moment(message.createdAt).calendar();
  const template = $('#message-template').html();
  const html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: timestamp,
  });

  $('#message-list').append(html);
  scrollToBottom();
};

socket.on('connect', () => {
  const params = JSON.parse(sessionStorage.getItem('joinParams'));
  socket.emit('join', params, (err, messages) => {
    if (err) {
      alert(err);
      window.location.href = '/';
    }

    messages
      .map(msg => ({ text: msg.content, from: msg.from && msg.from.username || '<deleted user>', createdAt: msg.createdAt }))
      .forEach(renderMessage);
    // console.log('messages', messages);
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('updateUserList', (users) => {
  const ol = $('<ol></ol>');

  users.forEach((name) => {
    ol.append($('<li></li>').text(name));
  });

  $('#users').html(ol);
});

socket.on('newMessage', renderMessage);

socket.on('newLocationMessage', (message) => {
  const timestamp = moment(message.createdAt).format('h:mm a');
  const template = $('#location-message-template').html();
  const html = Mustache.render(template, {
    from: message.from,
    url: message.url,
    createdAt: timestamp,
  });

  $('#message-list').append(html);
  scrollToBottom();
});

$('#message-form').on('submit', (e) => {
  e.preventDefault();

  const messageTextbox = $('[name=message]');
  socket.emit('createMessage', {
    text: messageTextbox.val(),
  }, () => {
    messageTextbox.val('');
  });
});

const locationButton = $('#send-location');
locationButton.on('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation not supported by your browser');
  }

  locationButton.attr('disabled', 'disabled').text('Sending location...');

  return navigator.geolocation.getCurrentPosition((position) => {
    locationButton.removeAttr('disabled').text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, () => {
    locationButton.removeAttr('disabled').text('Send location');
    alert('Unable to fetch location');
  });
});

$('#leave-room').on('click', () => {
  location.href = '/'; // eslint-disable-line no-restricted-globals
});
