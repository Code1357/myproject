'use strict';

const btn = document.getElementById('btn');
btn.addEventListener('click', makeRequest);

function makeRequest () {
  const xhr = new XMLHttpRequest();

  xhr.open('POST', 'newConfirmation.ejs');
  xhr.send();
}
