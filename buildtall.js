

function Layer(z, width, x, y) {
  this.z = z;
  this.width = width;
  this.x = typeof x !== 'undefined' ? x : 0;
  this.y = typeof y !== 'undefined' ? y : 0;
  this.buildings = new Array();

  //constants
  this.colorScheme = new Array( "#FF0000", "#00FF00", "#0000FF" );
  this.maxBuildings = 20;
  this.minBuildings = 10;
  this.minBuildingWidth = 50;
  this.numPoints = 50;

  this.addBuilding = function(building) {
    this.buildings.push(building);
  }

  this.draw = function(context) {
    for (building of this.buildings) {
      building.draw(context);
    }
  }

  this.populate = function() {
    var index;
    var points = new Array();
    for (index = 0; index < this.numPoints; ++index) {
      points.push(Math.floor((Math.random() * this.width) + this.x));
    }
    points.sort(function(a, b){return a-b});
    index = 0;
    while (index < points.length - 1) {
      var left = points[index];
      index++;
      while ((points[index] - left) < this.minBuildingWidth) {
        index++;
      }
      if (index >= points.length) return;
      this.addBuilding(new Building(
            left, 
            points[index] - left, 
            200, 
            this.colorScheme[Math.floor(Math.random() * this.colorScheme.length)]
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

  this.draw = function(context) {
    var style = context.fillStyle;
    console.log(this.x_loc + " " + this.width_loc + " " + this.color);
    context.fillStyle = this.color;
    context.fillRect(this.x_loc, 10, this.width_loc, this.height);
    context.fillStyle = style;
  }
}

function Scene(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  this.canvas = canvas;
  this.context = canvas.getContext('2d');
  this.width = canvas.width;
  this.layers = new Array(new Layer(0, this.width)); 

  this.layers[0].populate();

  this.draw = function draw() {
    for (layer of this.layers) {
      layer.draw(this.context);
    }
  }
}

function start(canvas) {
  var bt = new Scene(canvas);
  bt.draw();
}
