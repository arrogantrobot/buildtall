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
  "minBuildingWidth"  : 0.05,
  "maxBuildingWidth"  : 0.1,
  "minBuildingHeight" : 0.15,
  "maxBuildingHeight" : 0.7,
}

var sceneStyleLayer2 = {  
  "colorScheme"       : ["#ADA386", "#825F43", "#5F8076", "#402B1A", /*blue*/ "#3c3957", /*rust*/ "#92432b", /*olive*/ "#57633e"],
  "maxBuildings"      : 40,
  "minBuildings"      : 20,
  "minBuildingWidth"  : 0.05,
  "maxBuildingWidth"  : 0.2,
  "minBuildingHeight" : 0.0833,
  "maxBuildingHeight" : 0.5,
}

var sceneStyleLayer3 = {  
  "colorScheme"       : ["#ADA386", "#825F43", "#5F8076", "#402B1A", /*blue*/ "#3c3957", /*rust*/ "#92432b", /*olive*/ "#57633e"],
  "maxBuildings"      : 50,
  "minBuildings"      : 40,
  "minBuildingWidth"  : 0.025,
  "maxBuildingWidth"  : 0.25,
  "minBuildingHeight" : 0.07,
  "maxBuildingHeight" : 0.1,
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
    for (index = 0; index < this.buildings.length; ++index) {
      this.buildings[index].draw(context, this.x, this.y);
    }
  }

  this.populate = function() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    for (index = 0; index < this.scheme['maxBuildings']; ++index) {
      this.addBuilding(new Building(
            getRandInt(this.x, this.width),
            getRandInt(this.scheme['minBuildingWidth'] * width, this.scheme['maxBuildingWidth'] * width), 
            getRandInt(this.scheme['minBuildingHeight'] * height, this.scheme['maxBuildingHeight'] * height), 
            getRandArrayElem(this.scheme['colorScheme'])
      ));
      if (index > this.scheme['minBuildings']) {
        if (getRandInt(1,4) > 3) return;
      }
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
  this.layers['3'] = new Layer(0, y, 2, this.width, sceneStyleLayer3); 

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
