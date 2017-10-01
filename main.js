var colorGrid = document.getElementsByClassName('color-grid')[0];
var gridHeight;
var gridWidth;
var stylesheet = document.createElement("style");
var styleRules = stylesheet.innerHTML;
document.head.appendChild(stylesheet);

function SetGrid() {
  var width = document.getElementsByName('color-grid-width')[0].value;
  var height = document.getElementsByName('color-grid-height')[0].value;
  gridHeight = height;
  gridWidth = width;
  var allRows = document.getElementsByTagName('tr');
  while (colorGrid.hasChildNodes()) {
    colorGrid.removeChild(colorGrid.firstChild);
  }
    for (var i = 0; i < height; i++) {
      var gridRow = document.createElement("tr");
      colorGrid.appendChild(gridRow);
      for (var j = 0; j < width; j++) {
        var gridCell = document.createElement("td");
        gridCell.className = "v-" + i + "-h-" + j;
        gridCell.setAttribute("v-index",i);
        gridCell.setAttribute("h-index",j);
        gridCell.onmousedown = DrawColor;
        gridRow.appendChild(gridCell);
      }
    }
}
SetGrid();

var colorPreview = document.getElementsByClassName("color-preview")[0];
var colorH = document.getElementsByName('color-H')[0];
var colorS = document.getElementsByName('color-S')[0];
var colorL = document.getElementsByName('color-L')[0];
function setPreviewColor(){
  setColor(colorPreview,colorH.value, colorS.value, colorL.value, true);
}
setPreviewColor();

var prevStyle;
function setColor(obj,cH,cS,cL, doDelete) {
  var endStyleText = "/* end of " + obj.className + " styles */ ";
  if (doDelete) {
     //stylesheet.innerHTML = stylesheet.innerHTML.replace((stylesheet.innerHTML.slice(stylesheet.innerHTML.search("." + obj.className),stylesheet.innerHTML.search(endStyleText))), "");
  }
    stylesheet.innerHTML += ("." + obj.className + "{background-color: hsl(" + cH + "," + cS + "%," + cL + "%);}" + endStyleText);
    obj.setAttribute("H",cH);
    obj.setAttribute("S",cS);
    obj.setAttribute("L",cL);
}

function DrawColor() {
  setColor(this,colorPreview.getAttribute("H"),colorPreview.getAttribute("S"),colorPreview.getAttribute("L"), true);
  SetPallete(this);
}

function SetPallete(cell) {
  var bright = 60;
  var dark = 240;
  var brightValue;
  var darkValue;
  var curHpos = cell.getAttribute("h-index");
  var curVpos = cell.getAttribute("v-index");
  var curH = cell.getAttribute("H");
  var curS = cell.getAttribute("S");
  var curL = cell.getAttribute("L");
  if (curH >= dark) {
    brightValue = 360 + bright;
  } else {
    brightValue = bright;
  }
  if (curH <= bright) {
    darkValue = dark - 360;
  } else {
    darkValue = dark;
  }
  var upSteps = curVpos;
  var downSteps = (gridHeight - 1) - curVpos;
  //alert ("brightValue: " + brightValue + ", darkValue: " + darkValue);

  for (var u = 0; u < upSteps; u++) {
    var mult = (upSteps - 1) - u;
    var lightRate = (100 - curL)/upSteps;
    var lightValue = Math.round(100 - (mult * lightRate));
    var satRate = curS/upSteps;
    var satValue = Math.round(satRate * mult);
    var hueRate = (brightValue - curH)/upSteps;
    var hueValue = setHue(Math.round(brightValue - (mult * hueRate)));
    //alert ("UpSteps: " + upSteps + ", Mult: " + mult + ", LightRate: " + lightRate + ", LightValue: " + lightValue + ", SatRate: " + satRate + ", SatValue: " + satValue + ", HueRate: " + hueRate + ", HueValue: " + hueValue);
    var cells = document.querySelector('[v-index= "' + mult + '"][h-index= "' + curHpos + '"]');
    setColor(cells,hueValue,satValue,lightValue, true);
  }
  for (var d = 0; d < downSteps; d++) {
    var mult = gridHeight - 1 - d;
    var lightRate = curL/downSteps;
    var lightValue = Math.round(lightRate * d);
    var satRate = (100 - curS)/downSteps;
    var satValue = Math.round(100 - (d * satRate));
    var hueRate = (darkValue - parseInt(curH))/(downSteps);
    var hueValue = setHue(Math.round(darkValue - (hueRate * d)));
    //alert ("DownSteps: " + downSteps + ", Mult: " + mult + ", LightRate: " + lightRate + ", LightValue: " + lightValue + ", SatRate: " + satRate + ", SatValue: " + satValue + ", HueRate: " + hueRate + ", HueValue: " + hueValue);
    var cells = document.querySelector('[v-index= "' + mult + '"][h-index= "' + curHpos + '"]');
    setColor(cells,hueValue,satValue,lightValue, true);
  }
}

function setHue(value) {
  if (value >= 360) {
    return value - 360;
  } else if (value < 0) {
    return value + 360;
  } else {
    return value;
  }
}

function ResetStylesheet() {
  stylesheet.innerHTML = "";
  setPreviewColor();
}
