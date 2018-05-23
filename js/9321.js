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
  var menuDOM = document.createElement('div');
  menuDOM.class = "primary-menu";
  menuDOM.id = "TOP_RIGHT_MENU";
  menuDOM.innerHTML = '<a type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></a><div id="navbar" class="navbar-collapse collapse"><ul class="nav navbar-nav"><li><a data-scroll onclick="drop()">Critical</a></li><li><a data-scroll onclick="drop()">Renting</a></li><li><a data-scroll onclick="drop()">Rate</a></li></ul></div>';

  var menuTop0 = document.createElement('nav');
  menuTop0.class ="navbar navbar-fixed-top";
  menuTop0.id="header-nav";
  
  var menuTop1 = document.createElement('div');
  menuTop1.class="container-fluid";
  
  menuTop1.appendChild(menuDOM);
  menuTop0.appendChild(menuTop1)
  
  var test01 = document.createElement('header');
  test01.appendChild(menuTop0);
  test01.index = 1;
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(test01);
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