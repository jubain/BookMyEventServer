// import io from 'socket.io-client';

const socket = io('http://localhost:3000/');
// const socket = new WebSocket('ws://localhost:3000/venue');
const msgBox = document.getElementById('exampleFormControlTextarea1');
const msgCont = document.getElementById('data-container');
const email = document.getElementById('email');

//get old messages from the server
const messages = [];
function getMessages() {
  fetch('http://localhost:3000/venue/1')
    .then((response) => response.json())
    .then((data) => {
      loadDate(data);
      data.forEach((el) => {
        messages.push(el);
      });
    })
    .catch((err) => console.error(err));
}
getMessages();

//When a user press the enter key, send message.
msgBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    console.log('hello');
    sendMessage({ email: email.value, text: e.target.value });
    e.target.value = '';
  }
});

//Display messages to the users
function loadDate(data) {
  let messages = '';
  data.map((message) => {
    messages += ` <li class="bg-secondary p-2 rounded mb-2 text-light">
      <span class="fw-bolder">${message.email}</span>
      ${message.text}
    </li>`;
  });
  msgCont.innerHTML = messages;
}

//socket.io
//emit sendMessage event to send message
function sendMessage(message) {
  socket.emit('bookMessage', message);
}
//Listen to recMessage event to get the messages sent by users
socket.on('recBookMessage', (message) => {
  console.log(message);
  messages.push(message);
  loadDate(messages);
});
