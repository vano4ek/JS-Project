function initialize() {
    const mapProp = {
        center: new google.maps.LatLng(50.464379,30.519131),
        zoom: 11
    };
    const html_element = document.getElementById("googleMap");
    const map = new google.maps.Map(html_element, mapProp);


    google.maps.event.addListener(map, 'click', function (me) {
        renderAll(me.latLng.lat(), me.latLng.lng());
        $('#mapModal').modal('toggle');
    });

}

google.maps.event.addDomListener(window, 'load', initialize);