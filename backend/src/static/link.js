const url = window.location.href;
const link = document.createElement('a');
link.className = 'btn-blue';
link.innerHTML = 'Login ✨';
link.href = `${url}api/auth/github`;
document.getElementById('link').appendChild(link);
