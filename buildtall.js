

function Layer(z, width, x, y) {
  this.z = z;
  this.width = width;
  this.x = typeof x !== 'undefined' ? x : 0;
  this.y = typeof y !== 'undefined' ? y : 0;
  this.buildings = new Array();

  //constants
  this.colorScheme = [ "#FF0000", "#0FF00", "#0000FF" ];
  this.maxBuildings = 20;
  this.minBuildings = 10;
  this.minBuildingWidth = 50;


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
    for (index = 0; index < this.maxBuildings; ++index) {
      points.push(Math.floor((Math.random() * this.width) + this.x));
    }
    points.sort();
    index = 0;
    while (index < points.length) {
      var left = points[index];
      index++;
      while ((points[index] - left) < this.minBuildingWidth) {
        index++;
      }
      this.addBuilding(new Building(
            left, 
            points[index], 
            200, 
            this.colorScheme[Math.random() * this.colorScheme.length]
      ));
    }
  }

}

function Building(x, width, height, color) {
  this.x = x;
  this.width = width;
  this.height = height;
  this.color = color;

  this.draw = function(context) {
    var style = context.fillStyle;
    context.fillStyle = this.color;
    context.rect(this.x, 10, this.width, this.height);
    context.fill();
    context.fillStyle = style;
  }
}

function Buildtall(canvas) {
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
  var bt = new Buildtall(canvas);
  bt.draw();
}
