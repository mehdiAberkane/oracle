/**
 * Application object
 * App = Framework7
 * $$ = Dom7
 * map = Google Map
 * mainView = Framework7 main view
 * userMarker = geolocatilisation marker
 * _restaurants = array of google map place
 */
var Oracle = function() {
    this.app = null;
    this.$$ = null;
    this.map = null;
    this.mainView = null;
    this.userMarker = null;
    this._restaurants = [];
    this.config = {
        location: null,
        radius: 500,
        types: ['food'],
        query: 'restaurant'
    };

    this.init();
}

/**
 * Entry point
 */
Oracle.prototype.init = function init() {
    this.app = new Framework7();
    this.$$ = Dom7;

    this.initView();
    this.eventListener();
}

/**
 * Initialize view, Framework7 method
 */
Oracle.prototype.initView = function initView() {
    this.mainView = this.app.addView('.view-main', {
        dynamicNavbar: true
    });
}

/**
 * Initialize map with geolocatilisation, Google Map Method
 */
Oracle.prototype.initMap = function initMap() {
    var self = this;

    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        self.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: pos
        });

        self.userMarker = new google.maps.Marker({
            position: pos,
            map: self.map
        });

        self.userMarker.setPosition(pos);
        self.map.setCenter(pos);
        self.config.location = pos;

        self._callPlacesAPI();
    });
}

/**
 * @private
 * Call the Google Place API from a position pos
 * 
 * @param {any} pos
 */
Oracle.prototype._callPlacesAPI = function _callPlacesAPI() {
    var self = this;
    var service = new google.maps.places.PlacesService(self.map);

    service.nearbySearch(self.config, function(r, s) {
        self._receivePlacesAPI(r, s);
    });
}

/**
 * @private
 * @callback
 * Receive the result of _callPlacesAPI
 * 
 * @param {any} results
 * @param {any} status
 */
Oracle.prototype._receivePlacesAPI = function _receivePlacesAPI(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
            this.addRestaurant(results[i]);
        }
    }

    this._ready();
}

/**
 * Create a marker on Oracle.map and add a listener on it
 * 
 * @param {any} place
 */
Oracle.prototype.createMarker = function createMarker(place) {
    var self = this;

    var marker = new google.maps.Marker({
        map: self.map,
        position: place.geometry.location
    });

    var infowindow = new google.maps.InfoWindow();
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.setContent(place.name);
        infowindow.open(self.map, this);
    });
}

Oracle.prototype._ready = function _ready() {
    console.log(this._restaurants);
}

/**
 * Event listener function. All the event (from the dom) should be here
 */
Oracle.prototype.eventListener = function eventListener() {
    var self = this;

    this.$$('#run').on('click', function(e) {
        self.run();
    });
}

/**
 * Add restaurants
 * 
 * @param {any} restaurant
 */
Oracle.prototype.addRestaurant = function addRestaurant(restaurant) {
    this._restaurants.push(restaurant);
}

/**
 * Get all restaurants
 * 
 * @returns {Array[]}
 */
Oracle.prototype.getRestaurants = function getRestaurants() {
    return this._restaurants;
}

/**
 * Run oracle
 * 
 * @param {any} params
 */
Oracle.prototype.run = function run(params) {
    var scope = this._defineScope(params);
    var lgt = scope.length;
    var random = this._getRandomInt(0, lgt);

    var result = scope[random];
    
    console.log(result.photos[0].getUrl({'maxWidth': 35, 'maxHeight': 35}));

    this.$$('#result-title').text(result.name);
    this.$$("#result-description").text();

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
    return this._restaurants;
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

var OO = new Oracle();
