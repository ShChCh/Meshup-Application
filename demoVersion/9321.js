
var map;
var data;
// var mode = "get_one_crimedata";
// var imgMode = "crimes";
// var diInfo = "(criminals per 100,000 population)";
var mode = "get_one_rent";
var currHMtxt = "";
var imgMode = "rents";
var diInfo1 = "(average dollar per week)";
var diInfo2 = "(criminal per 100,000 population)";
var currentPolygonName = 'randwick';
var serverURL = 'http://ec2-54-252-243-63.ap-southeast-2.compute.amazonaws.com';
var neighborhoods = []
var markers = [];
var marker;
var myCenter = {lat: -33.91665490690587, lng: 151.2312249841309};
var lastPolyonIdx = -1;

var polygonArr = [];
var colors = ['#ffce7b', '#f8aba6', '#f3704b', '#ef5b9x', '#ae5039'];
function MapMenu(controlDiv, map, txt, type) {

        // tab controllers
                
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.marginLeft = '15px';
        controlUI.style.marginRight = '2px';
        controlUI.style.marginTop = '15px';
        controlUI.style.textAlign = 'center';
        // controlUI.style.border = '2px solid #fff';
        // controlUI.style.borderRadius = '3px';
        // controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        //controlUI.style.backgroundColor = '#B9B9FF';
        controlUI.style.fontWeight = 'bold';
        controlUI.title = 'Click to '+currHMtxt;
        controlUI.setAttribute("class", 'btn btn-primary');
        controlDiv.appendChild(controlUI);

        // Set CSS for the control interior.
        var controlText = document.createElement('a');
        controlText.style.color = 'rgb(220,120,120)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '12px';
        controlText.style.lineHeight = '15px';
        // controlText.style.fontColor = '#000000';
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
            if(type==6)
                setSchool();
        });

}


function MapColor(controlDiv, map) {
        // Set CSS for the control border.
        var controlUI = document.createElement('div');
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.marginLeft = '15px';
        controlUI.style.marginRight = '2px';
        controlUI.style.marginTop = '15px';
        controlUI.style.textAlign = 'center';
        // controlUI.style.border = '2px solid #fff';
        // controlUI.style.borderRadius = '3px';
        // controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        //controlUI.style.backgroundColor = '#B9B9FF';
        controlUI.style.fontWeight = 'bold';
        controlUI.title = 'Layers Chart';
        controlUI.setAttribute("class", 'btn btn-primary1');
        controlDiv.appendChild(controlUI);
        
        var controlText = document.createElement('font');
        controlText.color = colors[0];
        controlText.size = '8';
        controlText.style.fontSize = '12px';
        controlText.style.lineHeight = '15px';
        controlText.innerHTML = '■■■<p style="font-color:#000000;">excellent</p>';
        controlUI.appendChild(controlText);
        
        var controlText1 = document.createElement('font');
        controlText1.color = colors[1];
        controlText1.size = '8';
        controlText1.style.fontSize = '12px';
        controlText1.style.lineHeight = '15px';
        controlText1.innerHTML = '■■■<p style="font-color:#000000;">nice</p>';
        controlUI.appendChild(controlText1);
        
        var controlText2 = document.createElement('font');
        controlText2.color = colors[2];
        controlText2.size = '8';
        controlText2.style.fontSize = '12px';
        controlText2.style.lineHeight = '15px';
        controlText2.innerHTML = '■■■<p style="font-color:#000000;">good</p>';
        controlUI.appendChild(controlText2);
        
        var controlText3 = document.createElement('font');
        controlText3.color = colors[3];
        controlText3.size = '8';
        controlText3.style.fontSize = '12px';
        controlText3.style.lineHeight = '15px';
        controlText3.innerHTML = '■■■<p style="font-color:#000000;">careful</p>';
        controlUI.appendChild(controlText3);
        
        var controlText4 = document.createElement('font');
        controlText4.color = colors[4];
        controlText4.size = '8';
        controlText4.style.fontSize = '12px';
        controlText4.style.lineHeight = '15px';
        controlText4.innerHTML = '■■■<p style="font-color:#000000;">extreme</p>';
        controlUI.appendChild(controlText4);
        
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
        var currReverseGeo = arr;
        var placeName = currReverseGeo[0].split(', ')[1].split('NSW ')[0];
        //get_one_crimedata
        $.getJSON(serverURL+'/get_one_rent/'+currentPolygonName, function(currInfo1) {
        $.getJSON(serverURL+'/get_one_crimedata/'+currentPolygonName, function(currInfo2) {
            console.log(currentPolygonName);
            var imgUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x280&location='+currLat+','+currLng+'&fov=90&heading=90&pitch=10';
            //var imgUrl2 = serverURL+'/img/crimes';
            var imgUrl2 = serverURL+currInfo1[currentPolygonName]["path"];
            var imgUrl3 = serverURL+currInfo2[currentPolygonName]["path"];
            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">'+
                placeName+'</h1>'+
                '<div id="bodyContent">'+
                '<p><b>'+placeName+'</b>'+
                ' Statistics Information.</p>'+
                '<b>Rent Data: '+diInfo1+'<br /></b>'+
                '<img src="'+imgUrl2+'?'+Math.random()+'" style="width:200px; height:140px;" />'+
                '<br /><b>Criminal Data: '+diInfo2+'<br /></b>'+
                '<img src="'+imgUrl3+'?'+Math.random()+'" style="width:200px; height:140px;" />';;
            contentString = contentString +
                '<br /><b>Steet views at current position.<br /></b>'+
                '<img src="'+imgUrl+'" style="width:200px; height:140px;" /></p>'+
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
        })
        });
        }else{
            alert("found error " + status);
        }
    }
);
  
}

function initMap() {
   $.getJSON(serverURL+'/get_all_coordinates', function(cdata) {
            //data is the JSON string
   data = cdata;
            
  // load cowra map 
  // 边界构成的多边形存在polygonArr中
  // 此处为init接口，调用接口等待边界数据，最后保存在下方语句中
  var cowraTest = data;
  map = new google.maps.Map(document.getElementById('map'), {
    center: myCenter,
    zoom: 8,
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
        for(var k=0; k<polygonArr.length; k++){
            if(google.maps.geometry.poly.containsLocation(event.latLng, polygonArr[k])){
                console.log('polygon id1 is :'+polygonArr[k].name);
                currentPolygonName = polygonArr[k].name;
            }
        }
        console.log('polygon id2 is :'+this.name);
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
  
  currHMtxt = "check Rating Heat Map";
  var btnDiv = document.createElement('div');
  var btn = new MapMenu(btnDiv, map, 'Rating', 4);
  btnDiv.index = 1;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv);
  
  
  currHMtxt = "check Sales Heat Map";
  var btnDiv1 = document.createElement('div');
  var btn1 = new MapMenu(btnDiv1, map, 'Sales', 3);
  btnDiv1.index = 2;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv1);
  
  
  currHMtxt = "check Criminal Heat Map";
  var btnDiv2 = document.createElement('div');
  var btn2 = new MapMenu(btnDiv2, map, 'Criminal', 1);
  btnDiv2.index = 3;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv2);
  
  
  currHMtxt = "check Renting Heat Map";
  var btnDiv3 = document.createElement('div');
  var btn3 = new MapMenu(btnDiv3, map, 'Renting', 2);
  btnDiv3.index = 4;
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(btnDiv3);
  
  
  
  currHMtxt = "free press on";
  var btnDiv4 = document.createElement('div');
  var btn4 = new MapMenu(btnDiv4, map, 'Free Press', 5);
  btnDiv4.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(btnDiv4);
  
  
  currHMtxt = "check school nearby";
  var btnDiv5 = document.createElement('div');
  var btn5 = new MapMenu(btnDiv5, map, 'School Nearby', 6);
  btnDiv5.index = 2;
  map.controls[google.maps.ControlPosition.RIGHT_CENTER].push(btnDiv5);
  
  //MapColor
  
  var btnDiv6 = document.createElement('div');
  var btn6 = new MapColor(btnDiv6, map);
  btnDiv6.index = 1;
  map.controls[google.maps.ControlPosition.LEFT_CENTER].push(btnDiv6);
  
  // 当前地点点击，画边界，然后放信息
  
    google.maps.event.addListener(map, "click", function(event) {  
      var lat = event.latLng.lat();  
      var lng = event.latLng.lng();  
      // 经纬度  
      for(var k=0; k<polygonArr.length; k++){
          if(google.maps.geometry.poly.containsLocation(event.latLng, polygonArr[k])){
              if(lastPolyonIdx!=-1)
                  polygonArr[lastPolyonIdx].setMap(null);
              lastPolyonIdx = k;
              polygonArr[k].setOptions({fillColor: '#00FA9A'});
              polygonArr[k].setMap(map);
              currentPolygonName = polygonArr[k].name;
              break;
          }
      }
      
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
    for(var k=0; k<polygonArr.length; k++)
        polygonArr[k].setOptions({fillColor: colors[0]});
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
    $.getJSON(serverURL+'/get_all_crimedata', function(currInfo) {
        setHeatMap(currInfo);
    });
}

// 各个hm按钮的单独接口
function setRentingHM(){
    // 得到criminal data的ranking
    console.log("renting");
    $.getJSON(serverURL+'/get_all_rent', function(currInfo) {
        setHeatMap(currInfo);
    });
}

// 各个hm按钮的单独接口
function setSalesHM(){
    // 得到criminal data的ranking
    console.log("sales");
    $.getJSON(serverURL+'/get_all_sales', function(currInfo) {
        setHeatMap(currInfo);
    });
}

// 各个hm按钮的单独接口
function setAllHM(){
    // 得到criminal data的ranking
    console.log("All");
    $.getJSON(serverURL+'/get_all_rank', function(currInfo) {
        setHeatMap(currInfo);
    });
}

// 各个hm按钮的单独接口
function setSchool(){
    // 得到criminal data的ranking
    console.log("School");
    for(var i=0; i<neighborhoods.length; i++)
        neighborhoods[i].setMap(null);
    neighborhoods = [];
    $.getJSON(serverURL+'/get_one_school/'+currentPolygonName, function(currInfo) {
        //var neighborhoods = [{lat: -33.91337, lng: 151.23171},];
        console.log(currInfo);
        var count = 0;
        for(var item in currInfo){
            var newMarker = new google.maps.Marker({
                position: {lat:parseFloat(currInfo[item]["latitude"]), lng:parseFloat(currInfo[item]["longitude"])},
                map: map,
                name: item,
                type: currInfo[item]["school_type"],
                title: 'School: '+item+' , type: '+currInfo[item]["school_type"],
                draggable: true,
                animation: google.maps.Animation.DROP
            });
            
            neighborhoods.push(newMarker);
      google.maps.event.addListener(newMarker, "click", function(event) {  
        var lat = event.latLng.lat();  
        var lng = event.latLng.lng();  
        // 经纬度  
            var imgUrl = 'https://maps.googleapis.com/maps/api/streetview?size=400x280&location='+lat+','+lng+'&fov=90&heading=90&pitch=10';
        var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">'+
                'School Info</h1>'+
                '<div id="bodyContent">'+
                '<p><b>Name:</b>'+this.name+
                '<br /><b>Type:</b>'+this.type+
                '</p><p><br /><b>Steet views at current position.<br /></b>'+
                '<img src="'+imgUrl+'" style="width:200px; height:140px;" /></p>'+
                '</div>'+
                '</div>';

            var infowindow = new google.maps.InfoWindow({
              content: contentString
            });
            infowindow.open(map, this);
        });  
        }
    });
}
//  单个区域
function setSingle(){
    // 得到criminal data的ranking
    console.log("Single");
    for(var j=0; j<polygonArr.length; j++)
        polygonArr[j].setMap(null);
}