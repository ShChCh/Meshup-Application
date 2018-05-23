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

function CenterControl(controlDiv, map, txt) {

        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.marginLeft = '15px';
        controlUI.style.marginRight = '15px';
        controlUI.style.marginTop = '15px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.innerHTML = txt;
        controlText.class = "btn btn-primary";
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          map.setCenter(myCenter);
        });

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

  var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Sample Data</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Kingsford</b>'+
      ' Sample data.</p>'+
      '<p>Ref Criminal Data: <br />'+
      '2016: 0 Cases.<br />'+
      '2017: 7 Cases.<br />'+
      '2018: 5 Cases.<br /></p>'+
      '</div>'+
      '</div>';

  var infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  infowindow.open(map, marker);
  if (marker.getAnimation() !== null) {
    //marker.setAnimation(null);
    console.log(marker.getPosition().lat()+","+marker.getPosition().lng());
  } else {
    //marker.setAnimation(google.maps.Animation.BOUNCE);
    console.log(marker.getPosition().lat()+","+marker.getPosition().lng());
  }
}

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: myCenter,
    zoom: 16,
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true
  });
  marker = new google.maps.Marker({
    position: myCenter,
    map: map,
    title: 'Hello 9321!',
    draggable: true,
    animation: google.maps.Animation.DROP
  });
  marker.addListener('click', toggleBounce);
  
  var btnDiv = document.createElement('div');
  var btn = new CenterControl(btnDiv, map, 'check criminal');
  btnDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv);
  
  
  var btnDiv1 = document.createElement('div');
  var btn1 = new CenterControl(btnDiv1, map, 'check renting');
  btnDiv1.index = 2;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv1);
  
  var btnDiv2 = document.createElement('div');
  var btn2 = new CenterControl(btnDiv2, map, 'check total ranking');
  btnDiv2.index = 3;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv2);
  

  
}
