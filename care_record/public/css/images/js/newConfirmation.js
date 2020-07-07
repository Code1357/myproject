'use strict';

const btn = document.getElementById('btn').value;

btn.addEventListener('click', function () {
const xhr = new XMLHttpRequest();
xhr.open('POST', 'newConfirmation.ejs', true);
});
