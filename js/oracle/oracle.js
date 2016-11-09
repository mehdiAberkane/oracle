/**
 * Application object
 * App = Framework7
 * $$ = Dom7
 * map = Google Map
 * mainView = Framework7 main view
 * userMarker = geolocatilisation marker
 * _restaurants = array of google map place
 */
var Oracle = function(view, map, database) {
    this.$$ = Dom7;
    this.view = view;
    this.map = map;
    this.database = database;
    this.init();
}

/**
 * Entry point
 */
Oracle.prototype.init = function init() {
    this.eventListener();
    this.database.getFeedbacks().then(function(snap) {console.log(snap.val())});
}

/**
 * Event listener function. All the event (from the dom) should be here
 */
Oracle.prototype.eventListener = function eventListener() {
    var self = this;

    this.$$('#run').on('click', function(e) {
        self.run();
    });

    this.$$('#connect').on('click', function(e) {
        self.auth();
    });

    this.$$("#refresh").on('click', function(e) {
        self.map.removeCache();
    });
}

/**
 * Authentification by email
 */
Oracle.prototype.auth = function auth() {
    var email = this.$$('#email').val();
    var password = this.$$('#password').val();

    this.database.authEmail(email, password, function(e) {console.log(e);});
}

/**
 * Run oracle
 * 
 * @param {any} params
 */
Oracle.prototype.run = function run(params) {
    var scope = this._defineScope(params);
    var random = this._getRandomInt(0, scope.length-1);
    var result = scope[random];

    this.$$('#result-title').text(result.name);
    this.$$('#result-description').html("<p>Rating: " + result.rating + "</p><p>Adresse: " + result.vicinity + "</p>");
    this.$$('#result-img').attr('src', result.icon);

    if (!result.photos) {
        return;
    }

    var url = result.photos[0].getUrl({'maxWidth': 400, 'maxHeight': 400});
    this.$$('#result-img').attr('src', url);
}

/**
 * @private
 * Define the scope of search with params
 * 
 * @param {any} params
 * @returns {Array[]} restaurant
 */
Oracle.prototype._defineScope = function _defineScope(params) {
    return this.map.getRestaurants();
}

/**
 * @private
 * Get a radom integer between min and max (include)
 * 
 * @param {integer} min
 * @param {integer} max
 * @returns {integer}
 */
Oracle.prototype._getRandomInt = function _getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min +1)) + min;
}
