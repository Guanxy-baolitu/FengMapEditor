var init = function() {
  initQQMap();
  window.switchToPaintMode = switchToPaintModeFunction;
  window.switchColor = function(color){ switchColorFunction(color)};
  window.switchToSelectMode = switchToSelectModeFunction;
  window.deleteCurrentMarkers = deleteCurrentMarkersFunction;
  window.assignCurrentMarkers = assignCurrentMarkersFunction;
  window.addNewFloor = AddNewFloorFunction;
  window.addDetailPage = AddDetailPageFunction;
  window.selectFloorOnChange = function(floor){
    ReFreshTheQQMap(currentPageName, floor.value);
  };
  window.selectPageOnChange = function(page){
    ReFreshTheQQMap(page.value, 1);
  };
  window.searchKeyword = searchKeywordFunction;
  window.previewDetailPage = previewDetailPageFunction;
  window.saveAllToGeoJSON = saveAllToGeoJSONFunction;
}


