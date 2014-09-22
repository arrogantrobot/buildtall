var sceneStyle = {  
  "colorScheme"       : ["#ADA386", "#825F43", "#5F8076", "#402B1A"],
  "maxBuildings"      : 20,
  "minBuildings"      : 10,
  "minBuildingWidth"  : 50,
  "numPoints"         : 50,
  "minBuildingHeight" : 50,
  "maxBuildingHeight" : 300,
  'bgColorOne'        : "#443322",
  'bgColorTwo'        : "#613d30",
  'cloudWidth'        : [50, 200],
  'cloudHeight'       : [20, 100],
  'numClouds'         : [1, 10],
}

function getRandInt(lower, upper) {
  return Math.floor((Math.random() * upper) + lower);
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
  }
}

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

function Scene(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.width = canvas.width;
  this.layers = {};
  this.layers['0'] = new BackGround(0, 400, 0, this.width, sceneStyle);
  this.layers['1'] = new Layer(0, 400, 1, this.width, sceneStyle); 

  this.layers['1'].populate();

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
