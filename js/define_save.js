/**
 * Created by 关某人 on 2019/5/14.
 */
//存储GJSON所用
var strFloor = "floor";
var strAct = "actId";
var strPage = "hasPage";
//专有
var strColor = "color";
var strRadius = "radius";
var strIcon = "icon";
var strGrav = "gravPnt";
var geoStorageObj;
function FeatureObj(mtype) {
  this.type = "Feature";
  this.geometry = {};
  this.geometry.type = mtype;
  this.geometry.coordinates = [];
  this.properties = {};
}
var ReadJsonToGeoPage = function () {//TODO:多个页
  for (var i = 0; i < 1; ++i) {
    var name = defaultPageName;//TODO:name 是从JSON存储中获得的,现在暂时只加载default
    currentPageName = name;
    GeojsonPages[currentPageName] = new GeojsonPage(currentPageName);
    var strJSON = prompt("从数据库中读取JSON", "");
    if (strJSON != "") {
      var geoStorageObj = JSON.parse(strJSON); if (geoStorageObj !== null)
        geoStorageObj.features.forEach(function (feature) {
          currentFloor = feature.properties[strFloor];
          if (GeojsonPages[currentPageName].floors[currentFloor] == undefined) GeojsonPages[currentPageName].floors[currentFloor] = new Floor(currentFloor);
          var mapCover = new mapCoverObj(null);
          if (feature.geometry.type == "Point") {
            mapCover.qqCover = new qq.maps.Circle({
              map: map,
              center: new qq.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
              radius: feature.properties[strRadius],
              fillColor: qq.maps.Color.fromHex(feature.properties[strColor],0.3),
              strokeColor: qq.maps.Color.fromHex(feature.properties[strColor],0.3),
              strokeWeight: 2, clickable: false, editable: false
            });
          }
          else if(feature.geometry.type == "Marker"){
            mapCover.qqCover = new qq.maps.Marker({
              map: map,draggable: true,icon: feature.properties[strIcon],shadow: null,
              position: new qq.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]),
            });
          }
          else if (feature.geometry.type == "Polygon" || feature.geometry.type == "MultiLineString") {
            var onlyLine = [];
            feature.geometry.coordinates[0].forEach(function (geopnt) {
              onlyLine.push(new qq.maps.LatLng(geopnt[1], geopnt[0]));
            });
            if (feature.geometry.type == "Polygon")
              mapCover.qqCover = new qq.maps.Polygon({
                map: map, path: onlyLine, fillColor: qq.maps.Color.fromHex(feature.properties[strColor],0.3),
                strokeColor: qq.maps.Color.fromHex(feature.properties[strColor],0.3), strokeWeight: 2, clickable: false, editable: false
              });
            else
              mapCover.qqCover = new qq.maps.Polyline({
                map: map, path: onlyLine,
                strokeColor: qq.maps.Color.fromHex(feature.properties[strColor],0.3), strokeWeight: 4, clickable: false, editable: false
              });
          }
          if (feature.properties[strAct] != "") mapCover.actId = feature.properties[strAct];
          if (feature.properties[strPage] != "") mapCover.hasPage = feature.properties[strPage];
          GeojsonPages[currentPageName].floors[currentFloor].MapCovers.push(mapCover);
        });
    }
  }
  currentPageName = defaultPageName;
  currentFloor = 1;
  ReFreshTheQQMap(defaultPageName, 1);
};

var saveAllToGeoJSONFunction = function () {
  Object.keys(GeojsonPages).forEach(function (name) {
    geoStorageObj = {};
    geoStorageObj.type = "FeatureCollection";
    geoStorageObj.features = [];
    Object.keys(GeojsonPages[name].floors).forEach(function (idx) {
      GeojsonPages[name].floors[idx].MapCovers.forEach(function (mapCover) {
        if (mapCover.qqCover instanceof qq.maps.Circle) {
          var pointFeature = new FeatureObj("Point");
          pointFeature.geometry.coordinates.push(mapCover.qqCover.center.getLng());
          pointFeature.geometry.coordinates.push(mapCover.qqCover.center.getLat());
          pointFeature.properties[strColor] = mapCover.qqCover.strokeColor.toHex();
          pointFeature.properties[strRadius] = mapCover.qqCover.radius;
          pointFeature.properties[strFloor] = idx;
          geoStorageObj.features.push(pointFeature);
        }
        else if (mapCover.qqCover instanceof qq.maps.Marker) {//注意判断有无map,以处理删除！
          var pointFeature = new FeatureObj("Marker");
          pointFeature.geometry.coordinates.push(mapCover.qqCover.position.getLng());
          pointFeature.geometry.coordinates.push(mapCover.qqCover.position.getLat());
          pointFeature.properties[strIcon] = mapCover.qqCover.icon.url;
          pointFeature.properties[strFloor] = idx;
          geoStorageObj.features.push(pointFeature);
        }
        else if (mapCover.qqCover instanceof qq.maps.Polygon || mapCover.qqCover instanceof qq.maps.Polyline) {
          var polyFeature, latlngBounds;
          if (mapCover.actId != null || mapCover.hasPage != false) { latlngBounds = new qq.maps.LatLngBounds(); }
          if (mapCover.qqCover instanceof qq.maps.Polygon) polyFeature = new FeatureObj("Polygon");
          else polyFeature = new FeatureObj("MultiLineString");
          var onlyLine = [];
          for (var pointIdx in mapCover.qqCover.path.elems) {
            var geoPoint = [];
            if (mapCover.actId != null || mapCover.hasPage != false) latlngBounds.extend(mapCover.qqCover.path.elems[pointIdx]);
            geoPoint.push(mapCover.qqCover.path.elems[pointIdx].getLng());
            geoPoint.push(mapCover.qqCover.path.elems[pointIdx].getLat());
            onlyLine.push(geoPoint);
          }
          if (mapCover.qqCover instanceof qq.maps.Polygon) { onlyLine.push(onlyLine[0]); } polyFeature.geometry.coordinates.push(onlyLine);
          polyFeature.properties[strFloor] = idx;
          polyFeature.properties[strColor] = mapCover.qqCover.strokeColor.toHex();
          if (mapCover.actId != null||mapCover.hasPage != false) {polyFeature.properties[strGrav]=latlngBounds.getCenter();}
          geoStorageObj.features.push(polyFeature);
        }
      });
    });
    var fileName = name;
    var new_json = JSON.stringify(geoStorageObj);
    alert(new_json);
    console.log(new_json);
  });
};

var previewDetailPageFunction = function () {

}