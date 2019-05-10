var yesnoDiv = d3.select("body").append("div")
  .attr("class","d3-small-tip")
  .style("opacity",0)
  .html(" <input id='yesBtn'style='position: relative;left:-12px top:-11px;' src='img/yes.png' onclick='yes()' class='yesno' type='image' />" +
  "<input id='noBtn'style='position: relative;left:12px top:-11px;' src='img/no.png' onclick='saveAllToGeoJSON()' class='yesno' type='image' />");
