var map;
var neighborhoods = [
    {lat: -33.91337, lng: 151.23171},
    {lat: -33.91437, lng: 151.23271},
    {lat: -33.91937, lng: 151.23371},
    {lat: -33.91837, lng: 151.23471}
];
var markers = [];
var marker;
var myCenter = {lat: -33.91637, lng: 151.23071};

function CenterControl(controlDiv, map) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Center Map';
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          map.setCenter(myCenter);
        });

      }

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: myCenter,
    zoom: 16
  });
  marker = new google.maps.Marker({
    position: myCenter,
    map: map,
    title: 'Hello 9321!',
    draggable:true,
    animation: google.maps.Animation.DROP
  });
  marker.addListener('click', toggleBounce);
  
  var btnDiv = document.createElement('div');
  var btn = new CenterControl(btnDiv, map);
  btnDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(btnDiv);
}

function drop() {
  clearMarkers();
  for (var i = 0; i < neighborhoods.length; i++) {
    addMarkerWithTimeout(neighborhoods[i], i * 200);
  }
}

function addMarkerWithTimeout(position, timeout) {
      window.setTimeout(function() {
        markers.push(new google.maps.Marker({
            position: position,
            map: map,
            draggable:true,
            animation: google.maps.Animation.DROP
        })
      );
  }, timeout);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}