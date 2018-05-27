
var map;
var neighborhoods = [
    {lat: -33.91337, lng: 151.23171},
    {lat: -33.91437, lng: 151.23271},
    {lat: -33.91937, lng: 151.23371},
    {lat: -33.91837, lng: 151.23471}
];
var markers = [];
var marker;
var myCenter = {lat: -33.91665490690587, lng: 151.2312249841309};

function MapMenu(controlDiv, map, txt) {

        // tab controllers
                
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.marginLeft = '15px';
        controlUI.style.marginRight = '15px';
        controlUI.style.marginTop = '15px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to change mode';
        controlUI.setAttribute("class", 'btn btn-primary');
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.innerHTML = txt;
        controlUI.appendChild(controlText);

        // Setup the click event listeners: simply set the map to Chicago.
        controlUI.addEventListener('click', function() {
          //drop();
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
        var m = new google.maps.Marker({
            position: position,
            map: map,
            draggable:true,
            animation: google.maps.Animation.DROP
        });
        m.addListener('click',toggleBounce);
        markers.push(m);
  }, timeout);
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers = [];
}


function toggleBounce() { 
  var currLat = marker.getPosition().lat();
  var currLng = marker.getPosition().lng();
  
  // 反向 解析
  var retAddress;
  var retLocation;
  var geocoder = new google.maps.Geocoder();
  var arr = new Array();
  geocoder.geocode(
    {location:new google.maps.LatLng(currLat, currLng)},
    function geoResults(results, status){
      //这里处理结果和上面一模一样
      if (status == google.maps.GeocoderStatus.OK) {
        retAddress = results[0].formatted_address
        retLocation = results[0].geometry.location;
        arr[0] = retAddress;
        arr[1] = retLocation;
        // ----- wyj ----
        // console.log(arr[0].split(', ')[1].split('NSW ')[0]+'council');
        // geocoder.geocode({address:arr[0].split(', ')[1].split('NSW ')[0]+'council, NSW'},function geoResults(results, status){
          // if (status == google.maps.GeocoderStatus.OK) {
                // alert('Analysis 1: '+results[0].formatted_address);
                // alert('Analysis 2: '+results[0].geometry.location);
          // }
        // });
        // ----- wyj ----
        var currReverseGeo = arr;
        console.log(currReverseGeo[0]);
        console.log(currReverseGeo[1]);
        var imgUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x280&location='+currLat+','+currLng+'&fov=90&heading=90&pitch=10';
        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">'+
            currReverseGeo[0].split(', ')[1].split('NSW ')[0]+'</h1>'+
            '<div id="bodyContent">'+
            '<p><b>'+currReverseGeo[0].split(', ')[1].split('NSW ')[0]+'</b>'+
            ' Information about live ranking, criminal and renting statistics.</p>'+
            '<img src="'+imgUrl+'" style="width:400px; height:280px;" />'+
            '<p>Geo Postcode: _'+ currReverseGeo[0].split('NSW ')[1].substring(0,4) + '</p>' +
            //'GeoReturnLoca: '+ currReverseGeo[1] +
            '<p>Ref Criminal Data: <br />'+
            '2016: 7092 Cases.<br />'+
            '2017: 8217 Cases.<br />'+
            '2018: 6982 Cases.<br /></p>'+
            '</div>'+
            '</div>';

        var infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        infowindow.open(map, marker);
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(google.maps.Animation.BOUNCE);
        }
        console.log(currLat+","+currLng);
      }else{
        alert("found error " + status);
      }
    }
  );
  
}

function initMap() {
    
  
  // load cowra map
  var cowraTest = JSON.parse(data);
  map = new google.maps.Map(document.getElementById('map'), {
    center: myCenter,
    zoom: 16,
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true
  });
  // set cowra test
  var colors = ['#FF0230', '#EEAE00', '#BB0328', '#8E2110', '#440000'];
  var count = 0;
  for(var j in cowraTest){
      count = count+1;
      var cowradata = cowraTest[j];
      var cowraPosition = [];
          for(var i=0; i<cowradata.length; i++){
              var currPos = {};
              currPos['lat'] = cowradata[i][1];
              currPos['lng'] = cowradata[i][0];
              cowraPosition.push(currPos);
          }
      //console.log(cowraPosition);
      var flightPath = new google.maps.Polygon({
        path: cowraPosition,
        geodesic: true,
        strokeColor: '#FF0000',
        fillColor: colors[count%5],
        strokeOpacity: 1.0,
        strokeWeight: 2
      });

      google.maps.event.addListener(flightPath, "click", function(event) {  
        var lat = event.latLng.lat();  
        var lng = event.latLng.lng();  
        // 经纬度  
        //alert("Lat=" + lat + "; Lng=" + lng);  
        marker.setMap(null);
        marker = new google.maps.Marker({
            position: {lat:lat, lng:lng},
            map: map,
            title: 'check info or move by click',
            draggable: true,
            animation: google.maps.Animation.DROP
        });
        marker.addListener('click', toggleBounce);
      });  
      flightPath.setMap(map);
  }
  
  //
  marker = new google.maps.Marker({
    position: myCenter,
    map: map,
    title: 'Hello 9321!',
    draggable: true,
    animation: google.maps.Animation.DROP
  });
  marker.addListener('click', toggleBounce);
  
  var btnDiv = document.createElement('div');
  var btn = new MapMenu(btnDiv, map, 'Free Press');
  btnDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv);
  
  
  var btnDiv1 = document.createElement('div');
  var btn1 = new MapMenu(btnDiv1, map, 'Ranking');
  btnDiv1.index = 2;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv1);
  
  
  var btnDiv2 = document.createElement('div');
  var btn2 = new MapMenu(btnDiv2, map, 'Criminal');
  btnDiv2.index = 3;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv2);
  
  
  var btnDiv3 = document.createElement('div');
  var btn3 = new MapMenu(btnDiv3, map, 'Renting');
  btnDiv3.index = 4;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv3);
  
  
  
  // 左键点击获取经纬度
  // google.maps.event.addListener(map, "click", function(event) {  
    // var lat = event.latLng.lat();  
    // var lng = event.latLng.lng();  
    // // 经纬度  
    // //alert("Lat=" + lat + "; Lng=" + lng);  
    // addMarkerWithTimeout({lat: lat, lng: lng}, 200);
  // });  
  
}
