/**
 * Created by 关某人 on 2019/5/12.
 */
var currentColor = new qq.maps.Color(255, 127, 80, 0.3);
var currentIcon = new qq.maps.MarkerImage("img/penPoint.png");
var constShadow = new qq.maps.MarkerImage("img/shadow.png");

var drawingManager;
var initDrawManager = function () {
  drawingManager = new qq.maps.drawing.DrawingManager({
    map:map,
    drawingMode: null,
    drawingControl: false,
    drawingControlOptions: {
      position: qq.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        qq.maps.drawing.OverlayType.MARKER,
        qq.maps.drawing.OverlayType.CIRCLE,
        qq.maps.drawing.OverlayType.POLYGON,
        qq.maps.drawing.OverlayType.POLYLINE,
        qq.maps.drawing.OverlayType.RECTANGLE
      ]
    },
    markerOptions:{
      map: map,
      draggable: true,
      icon: currentIcon,
      //设置Marker标题，鼠标划过Marker时显示
      title: '测试'
    }
  });
  refreshDrawOptions();
  qq.maps.event.addListener(drawingManager, 'overlaycomplete', function(cover) {addCoverToMapObj(cover.overlay);});
}
var addCoverToMapObj = function (cover) {
  var newCover = new mapCoverObj(cover);
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.push(newCover);
}
var refreshDrawOptions = function()
{
  drawingManager.setOptions({
    polylineOptions: {map: map, strokeColor: currentColor, strokeWeight:4, clickable: false, editable: true},
    polygonOptions: {map: map, fillColor: currentColor, strokeColor:currentColor, strokeWeight:2, clickable: false, editable: true},
    circleOptions: {map: map, fillColor: currentColor, strokeColor:currentColor, strokeWeight:2, clickable: false, editable: true},
    rectangleOptions: {map: map, fillColor: currentColor, strokeColor:currentColor, strokeWeight:2, clickable: false, editable: true}});
}
var refreshMapCoverOptions = function(isClickable, isEditable)
{ 
  if(GeojsonPages[currentPageName].floors[currentFloor].MapCovers==false) return;
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function(mapCover)
  {
    mapCover.qqCover.clickable=isClickable;
    if(isClickable){
      mapCover.qqCover.cursor = "hand";
    }
    else{
      mapCover.qqCover.cursor = "default";
      if(mapCover.clickListener!==undefined)
        qq.maps.event.removeListener(mapCover.clickListener);
    }
    if(mapCover.qqCover instanceof qq.maps.Marker) {mapCover.qqCover.setDraggable(isEditable);mapCover.qqCover.setShadow(null);}
    else {mapCover.qqCover.setEditable(isEditable);mapCover.qqCover.setOptions({strokeColor: mapCover.qqCover.fillColor});}
  })
}
var enterToExitPaintMode = function(e)
{
  var event = e || window.event; var key = event.which || event.keyCode || event.charCode;// 兼容FF和IE和Opera
  if (key == 13||key==27) {
    exitPaintMode();
    document.removeEventListener("keydown", enterToExitPaintMode);
  }
}
var exitPaintMode = function () {
  $("#PaintBtn").removeClass("btn-warning");
  $("#PaintBtn").addClass("btn-primary");
  $("#paintCollapse").removeClass("in");
  drawingManager.setOptions({drawingControl: false});
  drawingManager.setDrawingMode(null);
  refreshMapCoverOptions(false, false);
};
//-------------------------------------------Window Function-----------------------------------------------------
var switchToPaintModeFunction = function () {
  exitSelectMode();
  $("#PaintBtn").removeClass("btn-primary");
  $("#PaintBtn").addClass("btn-warning");
  $("#paintCollapse").collapse("show")
  drawingManager.setOptions({drawingControl: true});
  drawingManager.setDrawingMode(qq.maps.drawing.OverlayType.MARKER);
  refreshMapCoverOptions(false, true);
  addEventListener("keydown", enterToExitPaintMode);
};

var switchColorFunction = function (color) {
  switch (color) {
    case '1': currentColor = new qq.maps.Color(255, 127, 80, 0.3); break;
    case '2': currentColor = new qq.maps.Color(135, 206, 250, 0.3); break;
    case '3': currentColor = new qq.maps.Color(218, 112, 213, 0.3); break;
    case '4': currentColor = new qq.maps.Color(50, 205, 51, 0.3); break;
    case '5': currentColor = new qq.maps.Color(250, 215, 95, 0.3); break;
    case '6': currentColor = new qq.maps.Color(206, 92, 92, 0.3); break;
    default: break;
  }
  refreshDrawOptions();
  $("#currentColor").attr("src", "img/colors/color" + color + ".jpg");
}