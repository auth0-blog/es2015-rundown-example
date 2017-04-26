
const auth0 = new window.auth0.WebAuth({
    clientID: "E799daQPbejDsFx57FecbKLjAvkmjEvo",
    domain: "speyrott.auth0.com",
    scope: "openid email profile purchase",
    audience: "/protected",
    responseType: "token id_token",
    redirectUri: "http://localhost:9000"
});

function logout() {
    localStorage.removeItem('id_token');
    localStorage.removeItem('access_token');
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

function retrieveProfile() {
    var idToken = localStorage.getItem('id_token');
    if (idToken) {
        try {
            const profile = jwt_decode(idToken);
            showProfileInfo(profile);
        } catch (err) {
            alert('There was an error getting the profile: ' + err.message);
        }
    }
}

auth0.parseHash(window.location.hash, (err, result) => {
    if(err || !result) {
        // Handle error
        return;
    }

    localStorage.setItem('id_token', result.idToken);
    localStorage.setItem('access_token', result.accessToken);
    retrieveProfile();
});

function afterLoad() {
    // buttons
    var btnLogin = document.getElementById('btn-login');
    var btnLogout = document.getElementById('btn-logout');

    btnLogin.addEventListener('click', function () {
        auth0.authorize();
    });

    btnLogout.addEventListener('click', function () {
        logout();
    });

    retrieveProfile();
}

window.addEventListener('load', afterLoad);
