/**
 * Created by 关某人 on 2019/5/14.
 */
var deleteClickListener;
var currentMarkerList = [];

var enterToExitSelectMode = function(e)
{
  var event = e || window.event; var key = event.which || event.keyCode || event.charCode;// 兼容FF和IE和Opera
  if (key == 13||key==27) {
    exitSelectMode();
    document.removeEventListener("keydown", enterToExitSelectMode);
  }
}
var exitSelectMode = function () {
  $("#SelectBtn").removeClass("btn-warning");
  $("#SelectBtn").addClass("btn-primary");
  $("#selectCollapse").removeClass("in");
  refreshMapCoverOptions(false, false);
};

var switchToSelectModeFunction = function () {
  exitPaintMode();
  $("#SelectBtn").removeClass("btn-primary");
  $("#SelectBtn").addClass("btn-warning");
  $("#selectCollapse").collapse("show");
  currentMarkerList.length = 0;
  addEventListener("keydown", enterToExitSelectMode);
  if(GeojsonPages[currentPageName].floors[currentFloor].MapCovers==false) return;
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function(mapCover)
  {
    mapCover.qqCover.clickable=true;
    mapCover.qqCover.editable=false;
    mapCover.qqCover.cursor = "hand";
    var pushToList = function (currentMarkerList) { 
      currentMarkerList.push(mapCover); 
      mapCover.qqCover.clickable = false;
      if(mapCover.qqCover instanceof qq.maps.Marker) {mapCover.qqCover.setShadow(constShadow);}
      else {mapCover.qqCover.setStrokeColor("#1e90ff");}
      mapCover.qqCover.cursor = "default"; 
      qq.maps.event.removeListener(mapCover.clickListener); 
    };
    mapCover.clickListener = qq.maps.event.addListener(mapCover.qqCover, 'click', function(event){pushToList(currentMarkerList);});
    mapCover.qqCover.strokeColor = mapCover.qqCover.fillColor;
  });
  ReFreshTheQQMap(currentPageName,currentFloor);
};

var assignCurrentMarkersFunction = function ()
{
  exitSelectMode();
  var GPSs = [];
  if(currentMarkerList==false) return;
  currentMarkerList.forEach(function(gpsObj) {
    var gps;
    if(gpsObj instanceof KeyPoint)
      gps = gpsObj.qqCover.center;
    else if(gpsObj instanceof Rectangle)
      gps=new qq.maps.LatLng((gpsObj.points[0].getLat()+gpsObj.points[2].getLat())*0.5,
        (gpsObj.points[0].getLng()+gpsObj.points[2].getLng())*0.5);
    else if(gpsObj instanceof Polygon)
    {
      var lat = 0.0, lng = 0.0;
      gpsObj.points.forEach(function(pnt){
        lat+=pnt.getLat();
        lng+=pnt.getLng();
      });
      gps = new qq.maps.LatLng(lat/gpsObj.points.length, lng/gpsObj.points.length);
    }
    GPSs.push(gps);
  });
  alert(GPSs.toString());
};
var deleteCurrentMarkersFunction = function ()
{
  exitSelectMode();
  if(currentMarkerList==false) return;
  currentMarkerList.forEach(function(delMarker) {delMarker.qqCover.setMap(null);});
};

var selectMultiMarkersWithCallback = function (objList, callback) {
  exitPaintMode();
  if (GeojsonPages[currentPageName].floors[currentFloor].MapCovers == false) return;
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function (cover) {
    cover.qqCover.clickable = true;
    cover.cursor = "pointer";
    var pushToList = function (event, objList) {
      objList.push(cover); cover.qqCover.clickable = false; cover.qqCover.cursor = "move"; qq.maps.event.removeListener(cover.clickListener);
      //if(event.shiftKey) {document.addEventListener("keyup", releaseShiftToFinish);console.log("shiftKey")}
      //else if(typeof callback == "function") callback(objList);
    }
    cover.clickListener = qq.maps.event.addListener(cover.qqCover, 'click', function (event) { pushToList(event, objList); });
  });
  //var releaseShiftToFinish = function(e){
  //  var event = e || window.event;var key = event.which || event.keyCode || event.charCode;// 兼容FF和IE和Opera
  //  if (key == 16) {document.removeEventListener("keyup", releaseShiftToFinish);map.draggableCursor="move";console.log("ReleaseshiftKey");if(typeof callback == "function") callback(objList);}
  //};
};

