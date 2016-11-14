import {
  AUTH0_CLIENT_ID,
  AUTH0_DOMAIN,
  AUTH0_CALLBACK_URL
} from './auth0-variables.js';

import Promise from 'bluebird';

var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN);
const getProfile = Promise.promisify(lock.getProfile, { context: lock });

function logout() {
    localStorage.removeItem('id_token');
    window.location.href = "/";
}

function showProfileInfo(profile) {
    var btnLogin = document.getElementById('btn-login');
    var btnLogout = document.getElementById('btn-logout');
    var avatar = document.getElementById('avatar');
    document.getElementById('nickname').textContent = profile.nickname;
    btnLogin.style.display = "none";
    avatar.src = profile.picture;
    avatar.style.display = "block";
    btnLogout.style.display = "block";
}

async function retrieveProfile() {
  var idToken = localStorage.getItem('id_token');
  if (idToken) {
    try {
      const profile = await getProfile(idToken);
      showProfileInfo(profile);
    } catch(err) {
      alert('There was an error getting the profile: ' + err.message);
    }
  }
}

async function afterLoad() {
  // buttons
  var btnLogin = document.getElementById('btn-login');
  var btnLogout = document.getElementById('btn-logout');

  btnLogin.addEventListener('click', function () {
    lock.show();
  });

  btnLogout.addEventListener('click', function () {
    logout();
  });

  lock.on("authenticated", function(authResult) {
    getProfile(authResult.idToken).then(profile => {
      localStorage.setItem('id_token', authResult.idToken);
      showProfileInfo(profile); 
    }, error => {
      // Handle error
    });
  });

  return retrieveProfile();
}

window.addEventListener('load', function () {
  afterLoad().then();
});
