var OracleDatabase = function() {
    this.config = {
        apiKey: "AIzaSyB8FZwtlYDxBni9M3G-8fta9AD6rmZMS2E",
        authDomain: "oracle-88740.firebaseapp.com",
        databaseURL: "https://oracle-88740.firebaseio.com",
        storageBucket: "oracle-88740.appspot.com",
        messagingSenderId: "583073245986"
    };
    this.db = null;
    this.listener = {};
    this.init();
}

OracleDatabase.prototype.init = function init() {
    firebase.initializeApp(this.config);
    this.db = firebase.database();
}

OracleDatabase.prototype._listen = function _listen(itemName, callback) {
    var self = this;
    this.listener[itemName].push(callback);
    var len = this.listener[itemName].length;

    this.db.ref(itemName).on('value', function(snap) {
        for (var i = 0; i < len; i++) {
            self.listener[itemName][i](snap.val());
        }
    });
}

OracleDatabase.prototype._get = function _get(itemName) {
    return this.db.ref(itemName).once('value');
}

OracleDatabase.prototype._set = function _set(itemName, object) {
    return this.db.ref(itemName).set(object);
}

OracleDatabase.prototype._update = function _update(itemName, object) {
    return this.db.ref(itemName).update(object);
}

OracleDatabase.prototype._remove = function _remove(itemName) {
     return this.db.ref(itemName).remove();
}

OracleDatabase.prototype.getUsers = function getUsers() {
    return this._get('/users');
}

OracleDatabase.prototype.getFeedbacks = function getFeedbacks() {
    return this._get('/feedbacks');
}

OracleDatabase.prototype.authEmail = function authEmail(email, password, callback) {
    firebase.auth().signInWithEmailAndPassword(email, password).then(callback).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(error);
    });
}

OracleDatabase.prototype.authGoogle = function authGoogle() {
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result) {
        var token = result.credential.accessToken;
        var user = result.user;
        console.log(user);
    }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(error);
    });
}
