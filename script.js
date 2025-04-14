
function saveMessage(event) {
  event.preventDefault();
  const name = document.getElementById('name').value;
  const msg = document.getElementById('message').value;
  const li = document.createElement('li');
  li.textContent = `${name}: ${msg}`;
  document.getElementById('messages').appendChild(li);
  document.getElementById('name').value = '';
  document.getElementById('message').value = '';
  return false;
}
