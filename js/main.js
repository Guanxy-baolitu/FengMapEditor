var map;
var polylineListener, pointListener
var indoorMapObj = {};
indoorMapObj.borderlines = [];//在腾讯地图无法表示的一个场馆内，多个borderline可表示不同的楼层
indoorMapObj.regions = [];
indoorMapObj.keydots = [];

function FeatureObj(mtype)
{
  this.type ="Feature";
  this.geometry = {};
  this.geometry.type = mtype;
  this.geometry.coordinates =[];
  this.properties ={};
}
var penPointMarker;

var init = function() {
  map = new qq.maps.Map(document.getElementById("container"),{
    center: new qq.maps.LatLng(39.7592,116.356666),

    draggableCursor: "crosshair",
    zoom: 18
  });
  penPointMarker = new qq.maps.Circle({
    map: map,
    radius: 2,
    fillColor: "#00f",
    strokeWeight: 2,
    zIndex:3
  });
  window.switchToPointMode = function() {
    var newPoint = new qq.maps.Circle({
      map: map,
      radius: 2,
      fillColor: "#f86553",
      strokeWeight: 5,
      zIndex:2
    });
    pointListener = qq.maps.event.addListener(map, 'click', function(event) {
      newPoint.setCenter(event.latLng);
      var geoPoint = [];
      geoPoint.push(event.latLng.getLng());
      geoPoint.push(event.latLng.getLat());
      indoorMapObj.keydots.push(geoPoint);
      qq.maps.event.removeListener(pointListener);
    });
  };
  window.switchToBoderPolyLineMode = function() {
    var borderLine = [];
    var polyline = new qq.maps.Polyline({
      path: borderLine,
      strokeColor: '#f86553',
      strokeWeight: 2,
      editable:false,
      map: map
    });
    polylineListener = qq.maps.event.addListener(map, 'click', function(event) {
      penPointMarker.setVisible(true);
      penPointMarker.setCenter(event.latLng);
      borderLine.push(event.latLng);
      polyline.setPath(borderLine);
    });
    var enterToMakePolygon = function(e)
    {
      // 兼容FF和IE和Opera
      var event = e || window.event;
      var key = event.which || event.keyCode || event.charCode;
      if (key == 13) {
        borderLine.push(borderLine[0]);
        indoorMapObj.borderlines.push(borderLine);
        polyline.setPath([]);
        penPointMarker.setVisible(false);
        var polygon = new qq.maps.Polygon({
          path:borderLine,
          map: map
        });
        qq.maps.event.addListener(polygon, 'click', function(event)
        {
          polygon.fillcolor = '#5f9ea0';
          d3.select()
          {

          }
        })
        qq.maps.event.removeListener(polylineListener);
        document.removeEventListener("keydown", enterToMakePolygon);
      }
    }
    document.addEventListener("keydown", enterToMakePolygon);
  };
  window.saveAllToGeoJSON = function()
  {
    var geoStorageObj = {};
    geoStorageObj.type = "FeatureCollection";
    geoStorageObj.features = [];
    if(indoorMapObj.keydots.length!==0)
    {
      var multiPointFeature = new FeatureObj("MultiPoint");
      multiPointFeature.geometry.coordinates = indoorMapObj.keydots;
      geoStorageObj.features.push(multiPointFeature);
    }
    if (indoorMapObj.borderlines.length !== 0)
    {
      for(var borderLineIdx in indoorMapObj.borderlines)
      {
        var lineStringFeature = new FeatureObj("Polygon");
        var borderLine =  indoorMapObj.borderlines[borderLineIdx];
        for (var qqPntIdx in borderLine)
        {
          var geoPoint = [];
          geoPoint.push(borderLine[qqPntIdx].getLng());
          geoPoint.push(borderLine[qqPntIdx].getLat());
          lineStringFeature.geometry.coordinates.push(geoPoint);
        }
        geoStorageObj.features.push(lineStringFeature);
      }
    }
    var new_json = JSON.stringify(geoStorageObj);
    alert(new_json);
  };

}


