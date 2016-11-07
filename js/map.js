function initMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 15,
            center: pos
        });

        var marker = new google.maps.Marker({
            position: pos,
            map: map
        });

        marker.setPosition(pos);
        map.setCenter(pos);
    });
}

