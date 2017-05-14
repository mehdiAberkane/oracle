var OracleMap = function(radius = 150) {
    this.map = null;
    this._restaurants = [];
     this.userMarker = null;
     this.config = {
        location: null,
        radius: radius,
        types: ['food'],
        query: 'restaurant'
    };
    this.prod = true;
    this.key_places = "oracle_google_api_places_nearby";
}

/**
 * Initialize map with geolocatilisation, Google Map Method
 */
OracleMap.prototype.initMap = function initMap() {
    var self = this;

    if (!this.prod) {
        return;
    }

    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        self.map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: pos,
            scrollwheel: false,
            navigationControl: false,
            mapTypeControl: false,
            scaleControl: false,
            draggable: false
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
OracleMap.prototype._callPlacesAPI = function _callPlacesAPI() {
    var self = this;

    if (localStorage.getItem('oracle_nearby')) {
        var r = localStorage.getItem(self.key_places);
        r = JSON.parse(r);
        self._receivePlacesAPI(r, google.maps.places.PlacesServiceStatus.OK);
        return;
    }

    var service = new google.maps.places.PlacesService(this.map);

    service.nearbySearch(self.config, function(r, s) {
        var t = JSON.stringify(r);
        localStorage.setItem(self.key_places, t);
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
OracleMap.prototype._receivePlacesAPI = function _receivePlacesAPI(results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
        for (var i = 0; i < results.length; i++) {
            this.createMarker(results[i]);
            this.addRestaurant(results[i]);
        }
    }
}

/**
 * Create a marker on Oracle.map and add a listener on it
 * 
 * @param {any} place
 */
OracleMap.prototype.createMarker = function createMarker(place) {
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

/**
 * Add restaurants
 * 
 * @param {any} restaurant
 */
OracleMap.prototype.addRestaurant = function addRestaurant(restaurant) {
    this._restaurants.push(restaurant);
}

/**
 * Get all restaurants
 * 
 * @returns {Array[]}
 */
OracleMap.prototype.getRestaurants = function getRestaurants() {
    return this._restaurants;
}

/**
 * Remove the cache
 */
OracleMap.prototype.removeCache = function removeCache() {
     localStorage.removeItem(this.key_places);
}
