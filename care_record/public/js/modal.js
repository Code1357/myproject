'use strict';
/* {
  const open = document.getElementById('open');
  const close = document.getElementById('close');
  const modal = document.getElementById('modal');
  const mask = document.getElementById('mask');

  open.addEventListener('click', function () {
    modal.classList.remove('hidden');
    mask.classList.remove('hidden');
  });
  close.addEventListener('click', function () {
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  });
} */

const oBtn = document.getElementById('oBtn');
const a = document.getElementById('inputEmployee').value;
const b = document.getElementById('inputUsername').value;
console.log(a);
const inputMess = '入力された値は' + a + b + 'です';

oBtn.addEventListener('click', (e) => {
  document.getElementById('output').innerHTML = inputMess;
});
