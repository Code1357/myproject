/* 'use strict';

const btn = document.getElementById('btn');
const xhr = new XMLHttpRequest();
xhr.open('POST', '/staffs/create');
btn.addEventListener('click', (e) => {
  const newConfirmation = JSON.pars((xhr.responseText));
  const a = newConfirmation[0].employee_id;
  document.getElementById('employee_id').innerHTML = a;
});

xhr.send();
 */
