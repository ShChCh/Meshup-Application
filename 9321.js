
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
var lastPolyonIdx = -1;

var polygonArr = [];
var colors = ['#ff2b00', '#0000ff', '#ffff00', '#ff9900', '#eed898'];
function MapMenu(controlDiv, map, txt, type) {

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
            if(type==1)
                setCriHM();
            if(type==2)
                setRentingHM();
            if(type==3)
                setSalesHM();
            if(type==4)
                setAllHM();
            if(type==5)
                setSingle();
        });

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
  // 边界构成的多边形存在polygonArr中
  // 此处为init接口，调用接口等待边界数据，最后保存在下方语句中
  var cowraTest = JSON.parse(data);
  map = new google.maps.Map(document.getElementById('map'), {
    center: myCenter,
    zoom: 16,
    disableDefaultUI: true,
    zoomControl: true,
    scaleControl: true
  });
  // set cowra test
  var count = 0;
  for(var j in cowraTest){
      var cowradata = cowraTest[j];
      var cowraPosition = [];
          for(var i=0; i<cowradata.length; i++){
              var currPos = {};
              currPos['lat'] = cowradata[i][1];
              currPos['lng'] = cowradata[i][0];
              cowraPosition.push(currPos);
          }
      polygonArr[count] = new google.maps.Polygon({
        path: cowraPosition,
        geodesic: true,
        name: j,
        strokeColor: '#000000',
        fillColor: '#00FA9A',
        strokeOpacity: 1.0,
        strokeWeight: 3
      })
      ;
      google.maps.event.addListener(polygonArr[count], "click", function(event) {  
        var lat = event.latLng.lat();  
        var lng = event.latLng.lng();  
        // 经纬度  
        marker.setMap(null);
        marker = new google.maps.Marker({
            position: {lat:lat, lng:lng},
            map: map,
            title: 'check info or move by click',
            draggable: true,
            animation: google.maps.Animation.DROP
        });
        marker.addListener('click', toggleBounce);
        // for(var k=0; k<polygonArr.length; k++){
            // if(polygonArr[k].containsLocation(event.latLng))
                // console.log('polygon id is :'+polygonArr[k].name);
        // }
        console.log('polygon id is :'+this.name);
      });  
      //polygonArr[count].setMap(map);
      
      count = count+1;
  }
  
  marker = new google.maps.Marker({
    position: myCenter,
    map: map,
    title: 'Hello 9321!',
    draggable: true,
    animation: google.maps.Animation.DROP
  });
  marker.addListener('click', toggleBounce);
  
  var btnDiv = document.createElement('div');
  var btn = new MapMenu(btnDiv, map, 'Rating Heatmap', 4);
  btnDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv);
  
  
  var btnDiv1 = document.createElement('div');
  var btn1 = new MapMenu(btnDiv1, map, 'Sales Heatmap', 3);
  btnDiv1.index = 2;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv1);
  
  
  var btnDiv2 = document.createElement('div');
  var btn2 = new MapMenu(btnDiv2, map, 'Criminal Heatmap', 1);
  btnDiv2.index = 3;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv2);
  
  
  var btnDiv3 = document.createElement('div');
  var btn3 = new MapMenu(btnDiv3, map, 'Renting Heatmap', 2);
  btnDiv3.index = 4;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv3);
  
  
  
  var btnDiv4 = document.createElement('div');
  var btn4 = new MapMenu(btnDiv3, map, 'Free Press', 5);
  btnDiv4.index = 5;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv4);
  
  
  // 当前地点点击，画边界，然后放信息
  
    google.maps.event.addListener(map, "click", function(event) {  
      var lat = event.latLng.lat();  
      var lng = event.latLng.lng();  
      // 经纬度  
      marker.setMap(null);
      marker = new google.maps.Marker({
        position: {lat:lat, lng:lng},
        map: map,
        title: 'check info or move by click',
        draggable: true,
        animation: google.maps.Animation.DROP
      });
      marker.addListener('click', toggleBounce);
      // for(var k=0; k<polygonArr.length; k++){
        // if(polygonArr[k].containsLocation(event.latLng))
            // console.log('polygon id is :'+polygonArr[k].name);
      // }
      for(var k=0; k<polygonArr.length; k++){
          if(google.maps.geometry.poly.containsLocation(event.latLng, polygonArr[k])){
              if(lastPolyonIdx!=-1)
                  polygonArr[lastPolyonIdx].setMap(null);
              lastPolyonIdx = k;
              polygonArr[k].setOptions({fillColor: '#00FA9A'});
              polygonArr[k].setMap(map);
              break;
          }
      }
    });  
    
}

// 所有的热度图，根据输入的rank不一样来做重新color
function setHeatMap(d){
    // cdata两个属性,rank和name
    // 得到对应的ranking
    var threshhold = Object.keys(d).length/5;
    var cthresh = [];
    cthresh.push(0);
    cthresh.push(threshhold);
    cthresh.push(threshhold*2);
    cthresh.push(threshhold*3);
    cthresh.push(threshhold*4);
    cthresh.push(Object.keys(d).length);
    //console.log(cthresh);
    for(var i in d)
        for(var j=0; j<polygonArr.length; j++){
            if(polygonArr[j].name === i){
                //console.log("ff__"+i+"__"+polygonArr[j].name+"__found__"+d[i]['rank']+"__");
                for(var k=0; k<5; k++){
                    if(d[i]['rank'] < cthresh[k+1] && d[i]['rank'] >= cthresh[k]){
                        //console.log("__"+polygonArr[j].name+"__"+colors[k]);
                        polygonArr[j].setOptions({fillColor: colors[k]});
                        break;
                    }
                }
            }
            polygonArr[j].setMap(map);
        }
}

// 各个hm按钮的单独接口
function setCriHM(){
    // 得到criminal data的ranking
    console.log("criminal");
    chmd = JSON.parse(cdata);
    setHeatMap(chmd);
}

// 各个hm按钮的单独接口
function setRentingHM(){
    // 得到criminal data的ranking
    console.log("renting");
    rhmd = JSON.parse(rdata);
    setHeatMap(rhmd);
}

// 各个hm按钮的单独接口
function setSalesHM(){
    // 得到criminal data的ranking
    console.log("sales");
    shmd = JSON.parse(sdata);
    setHeatMap(shmd);
}

// 各个hm按钮的单独接口
function setAllHM(){
    // 得到criminal data的ranking
    console.log("All");
    ahmd = JSON.parse(adata);
    setHeatMap(ahmd);
}

//  单个区域
function setSingle(){
    // 得到criminal data的ranking
    console.log("Single");
    for(var j=0; j<polygonArr.length; j++)
        polygonArr[j].setMap(null);
}