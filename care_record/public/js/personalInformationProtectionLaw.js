'use strict';

const xhr = new XMLHttpRequest();
xhr.open('GET', '/userList');
xhr.addEventListener('load', (e) => {
  const users = JSON.parse((xhr.responseText));
  const d = [users[0].email];
  console.log(d);
  document.querySelector('#ajax4').innerHTML = d;
});
xhr.send();
