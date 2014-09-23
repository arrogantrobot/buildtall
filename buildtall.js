var backGroundLayer = {
  'bgColorOne'        : "#443322",
  'bgColorTwo'        : "#613d30",
  'cloudWidth'        : [50, 200],
  'cloudHeight'       : [20, 100],
  'cloudColor'        : ["#876448"],
  'numClouds'         : [1, 10],
}

var sceneStyleLayer1 = {  
  "colorScheme"       : ["#ADA386", "#825F43", "#5F8076", "#402B1A", /*blue*/ "#3c3957", /*rust*/ "#92432b", /*olive*/ "#57633e"],
  "maxBuildings"      : 30,
  "minBuildings"      : 20,
  "minBuildingWidth"  : 50,
  "maxBuildingWidth"  : 300,
  "numPoints"         : 50,
  "minBuildingHeight" : 90,
  "maxBuildingHeight" : 600,
}

var sceneStyleLayer2 = {  
  "colorScheme"       : ["#ADA386", "#825F43", "#5F8076", "#402B1A", /*blue*/ "#3c3957", /*rust*/ "#92432b", /*olive*/ "#57633e"],
  "maxBuildings"      : 40,
  "minBuildings"      : 20,
  "minBuildingWidth"  : 30,
  "maxBuildingWidth"  : 300,
  "minBuildingHeight" : 50,
  "maxBuildingHeight" : 300,
}

var sceneStyleLayer3 = {  
  "colorScheme"       : ["#ADA386", "#825F43", "#5F8076", "#402B1A", /*blue*/ "#3c3957", /*rust*/ "#92432b", /*olive*/ "#57633e"],
  "maxBuildings"      : 50,
  "minBuildings"      : 40,
  "minBuildingWidth"  : 30,
  "maxBuildingWidth"  : 200,
  "minBuildingHeight" : 30,
  "maxBuildingHeight" : 50,
}

function getRandInt(lower, upper) {
  return Math.floor((Math.random() * upper) + lower);
}

function getRandArrayElem(array) {
  return array[Math.floor((Math.random() * array.length))];
}

// drawEllipse function taken from http://www.williammalone.com/briefs/how-to-draw-ellipse-html5-canvas/
function drawEllipse(centerX, centerY, width, height, context, style) {
  
  context.beginPath();
  
  context.moveTo(centerX, centerY - height/2); // A1
  
  context.bezierCurveTo(
    centerX + width/2, centerY - height/2, // C1
    centerX + width/2, centerY + height/2, // C2
    centerX, centerY + height/2); // A2

  context.bezierCurveTo(
    centerX - width/2, centerY + height/2, // C3
    centerX - width/2, centerY - height/2, // C4
    centerX, centerY - height/2); // A1
  var s = context.fillStyle;
  context.fillStyle = style;
  context.fill();
  context.closePath();
  context.fillStyle = s;
}

function BackGround(x, y, z, width, scheme) {
  this.x = x;
  this.y = y;
  this.z = z;
  this.width = width;
  this.scheme = scheme;

  this.draw = function(context) {
    var style = context.fillStyle;
    var grd = context.createLinearGradient(0,0,0,context.canvas.height);
    grd.addColorStop(0, this.scheme['bgColorOne']);
    grd.addColorStop(1, this.scheme['bgColorTwo']);
    context.fillStyle = grd;
    context.fillRect(0,0,context.canvas.width,context.canvas.height);
    context.fillStyle = style;
    //this.drawClouds(context);
  }
 

  this.drawClouds = function(context) {
    var x = getRandInt(this.scheme['cloudWidth'][1], context.canvas.width - this.scheme['cloudWidth'][1]);
    var y = getRandInt(this.scheme['cloudHeight'][1], context.canvas.width - this.scheme['cloudHeight'][1]);
    var w = getRandInt(this.scheme['cloudWidth'][0], this.scheme['cloudWidth'][1]);
    var h = getRandInt(this.scheme['cloudHeight'][0], this.scheme['cloudHeight'][1]);
    drawEllipse(x, y, w, h, context, getRandArrayElem(this.scheme['cloudColor']));
  }
}

//A layer contains many buildings in roughly the same depth
//Each layer may have its own color scheme
//Changing a Layer's x or y will move the buildings with it
function Layer(x, y, z, width, scheme) {
  this.z = z;
  this.width = width;
  this.x = typeof x !== 'undefined' ? x : 0;
  this.y = typeof y !== 'undefined' ? y : 0;
  this.scheme = scheme;
  this.buildings = new Array();


  this.addBuilding = function(building) {
    this.buildings.push(building);
  }

  this.draw = function(context) {
    for (building of this.buildings) {
      building.draw(context, this.x, this.y);
    }
  }

  this.populate = function() {
    for (index = 0; index < this.scheme['maxBuildings']; ++index) {
      this.addBuilding(new Building(
            getRandInt(this.x, this.width),
            getRandInt(this.scheme['minBuildingWidth'], this.scheme['maxBuildingWidth']), 
            getRandInt(this.scheme['minBuildingHeight'], this.scheme['maxBuildingHeight']), 
            getRandArrayElem(this.scheme['colorScheme'])
      ));
      if (index > this.scheme['minBuildings']) {
        if (getRandInt(1,4) > 3) return;
      }
    }
  }

  this.populateSameDepth = function() {
    var index;
    var points = new Array();
    for (index = 0; index < this.scheme['numPoints']; ++index) {
      points.push(Math.floor((Math.random() * this.width) + this.x));
    }
    points.sort(function(a, b){return a-b});
    index = 0;
    while (index < points.length - 1) {
      var left = points[index];
      index++;
      while ((points[index] - left) < this.scheme['minBuildingWidth']) {
        index++;
      }
      if (index >= points.length) return;
      this.addBuilding(new Building(
            left, 
            points[index] - left, 
            Math.floor(Math.random() * this.scheme['maxBuildingHeight']) + this.scheme['minBuildingHeight'], 
            this.scheme['colorScheme'][Math.floor(Math.random() * this.scheme['colorScheme'].length)]
      ));
      index++;
    }
  }

}

//A building represents all of the details associated with a single building
function Building(x, width, height, color) {
  this.x_loc = x;
  this.width_loc = width;
  this.height = height;
  this.color = color;

  this.draw = function(context, x, y) {
    var style = context.fillStyle;
    console.log(this.x_loc + " " + this.width_loc + " " + this.color);
    context.fillStyle = this.color;
    context.fillRect(this.x_loc + x, y, this.width_loc, -1 * this.height);
    context.fillStyle = style;
  }
}

//A scene holds and renders layers. The layers are rendered in the order they were added
function Scene(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.width = canvas.width;
  this.layers = {};
  var y = window.innerHeight * 0.9;
  this.layers['0'] = new BackGround(0, y, 0, this.width, backGroundLayer);
  this.layers['1'] = new Layer(0, y, 1, this.width, sceneStyleLayer1); 
  this.layers['2'] = new Layer(0, y, 2, this.width, sceneStyleLayer2); 
  this.layers['3'] = new Layer(0, y, 2, this.width, sceneStyleLayer2); 

  this.layers['1'].populate();
  this.layers['2'].populate();
  this.layers['3'].populate();

  this.draw = function draw() {
    for (layer in this.layers) {
      this.layers[layer].draw(this.context);
    }
  }
}

function start(canvas) {
  var bt = new Scene(canvas);
  bt.draw();
}
