/**
 * Created by 关某人 on 2019/5/14.
 */
var deleteClickListener;
var currentMarkerList = [];

var enterToExitSelectMode = function (e) {
  var event = e || window.event; var key = event.which || event.keyCode || event.charCode;// 兼容FF和IE和Opera
  if (key == 13 || key == 27) {
    exitSelectMode();
    document.removeEventListener("keydown", enterToExitSelectMode);
  }
}
var exitSelectMode = function () {
  $("#SelectBtn").removeClass("btn-warning");
  $("#SelectBtn").addClass("btn-primary");
  $("#selectCollapse").removeClass("in");
  setSelectButtonsEnabled(false);
  refreshMapCoverOptions(false, false);
};

var setSelectButtonsEnabled = function(enable){
  if(enable==true)
  {
    $("#AddDetailPageBtn").removeClass("disabled");
    $("#DeleteBtn").removeClass("disabled");
    $("#assignActBtn").removeClass("disabled");
  }
  else{
    $("#AddDetailPageBtn").addClass("disabled");
    $("#DeleteBtn").addClass("disabledg");
    $("#assignActBtn").addClass("disabled");
  }
}

var switchToSelectModeFunction = function () {
  exitPaintMode();
  $("#SelectBtn").removeClass("btn-primary");
  $("#SelectBtn").addClass("btn-warning");
  $("#selectCollapse").collapse("show");
  currentMarkerList.length = 0;
  addEventListener("keydown", enterToExitSelectMode);
  if (GeojsonPages[currentPageName].floors[currentFloor].MapCovers == false) return;
  GeojsonPages[currentPageName].floors[currentFloor].MapCovers.forEach(function (mapCover) {
    mapCover.qqCover.clickable = true;
    mapCover.qqCover.editable = false;
    mapCover.qqCover.cursor = "hand";
    var pushToList = function (currentMarkerList) {
      currentMarkerList.push(mapCover);
      mapCover.qqCover.clickable = false;
      if (mapCover.qqCover instanceof qq.maps.Marker) { mapCover.qqCover.setShadow(constShadow); }
      else { mapCover.qqCover.setStrokeColor("#1e90ff"); }
      mapCover.qqCover.cursor = "default";
      qq.maps.event.removeListener(mapCover.clickListener);
    };
    mapCover.clickListener = qq.maps.event.addListener(mapCover.qqCover, 'click', function (event) { pushToList(currentMarkerList); 
      setSelectButtonsEnabled(true); });
    mapCover.qqCover.strokeColor = mapCover.qqCover.fillColor;
  });
  ReFreshTheQQMap(currentPageName, currentFloor);
};

var updateActivityOptionsFunction = function () {
  var actSelectDom = document.getElementById("actSelect");
  actSelectDom.options.length = 0;
  ///Mock
  var activities = [];
  function act(idx, name) {
    this.actID = idx;
    this.actName = name;
  }
  activities.push(new act(1, "表演"));
  activities.push(new act(2, "抽奖"));
  ///Mock
  if (activities.length === 0) return;
  activities.forEach(function (act) {
    actSelectDom.options.add(new Option(act.actName, act.actID));
  });
  actSelectDom.value = activities[0].actID;
}

var assignCurrentMarkersFunction = function () {
  if (currentMarkerList == false) return;
  var actID = parseInt(document.getElementById('actSelect').value);
  exitSelectMode();
  currentMarkerList.forEach(function (mapCover) {
    mapCover.actId=actID;
  });
};
var deleteCurrentMarkersFunction = function () {
  if (currentMarkerList == false) return;
  exitSelectMode();
  currentMarkerList.forEach(function (delMarker) { delMarker.qqCover.setMap(null); });
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

