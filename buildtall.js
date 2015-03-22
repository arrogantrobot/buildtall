/*  Buildtall Cities
 *  Change the speed of redraw by placing the following at the end of the buildtall.com url ?speed=<milliseconds>
 *
 *
 *
 */


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
  "windows"           : {
      'width'         : 5,
      'height'        : 10,
      'v_space'       : 15,
      'number'        : 4,
      'group_size'    : 5,
      'orientation'   : 'updown',
      'toporbottom'   : 'top',
      'leftright'     : 'right',
      'min_x'         : 0.10,
      'max_x'         : 0.90,
      'min_y'         : 0.50,
      'max_y'         : 0.90,
      'lites_out'     : 0.20,
  },

}

var sceneStyleLayer2 = {  
  "colorScheme"       : ["#ADA386", "#825F43", "#5F8076", "#402B1A", /*blue*/ "#3c3957", /*rust*/ "#92432b", /*olive*/ "#57633e"],
  "maxBuildings"      : 40,
  "minBuildings"      : 20,
  "minBuildingWidth"  : 0.05,
  "maxBuildingWidth"  : 0.15,
  "minBuildingHeight" : 0.0833,
  "maxBuildingHeight" : 0.5,
  "windows"           : {
      'width'         : 5,
      'height'        : 10,
      'v_space'       : 15,
      'number'        : 2,
      'group_size'    : 4,
      'orientation'   : 'updown',
      'toporbottom'   : 'top',
      'leftright'     : 'right',
      'min_x'         : 0.10,
      'max_x'         : 0.90,
      'min_y'         : 0.50,
      'max_y'         : 0.90,
      'lites_out'     : 0.20,
  },
}

var sceneStyleLayer3 = {  
  "colorScheme"       : ["#ADA386", "#825F43", "#5F8076", "#402B1A", /*blue*/ "#3c3957", /*rust*/ "#92432b", /*olive*/ "#57633e"],
  "maxBuildings"      : 50,
  "minBuildings"      : 40,
  "minBuildingWidth"  : 0.025,
  "maxBuildingWidth"  : 0.15,
  "minBuildingHeight" : 0.07,
  "maxBuildingHeight" : 0.1,
  "windows"           : {
      'width'         : 5,
      'height'        : 5,
      'v_space'       : 10,
      'number'        : 5,
      'group_size'    : 2,
      'orientation'   : 'updown',
      'toporbottom'   : 'top',
      'leftright'     : 'right',
      'min_x'         : 0.10,
      'max_x'         : 0.90,
      'min_y'         : 0.50,
      'max_y'         : 0.90,
      'lites_out'     : 0.20,
  },
}

function getRandInt(lower, upper) {
  return Math.floor((Math.random() * upper) + lower);
}

function getRandFloat(lower, upper) {
  return (Math.random() * (upper - lower)) + lower;
}

function getRandMinMax(param, scheme) {
  var minP = "min"+param;
  var maxP = "max"+param;
  var answer = getRandFloat(scheme[minP],scheme[maxP]);
  return answer;
}

function getRandArrayElem(array) {
  return array[Math.floor((Math.random() * array.length))];
}

function getRandBool(true_bias) {
  var bias = 0.5;
  if(true_bias) {
    bias = true_bias;
  }
  return Math.random() <= bias;
}

//shadeColor function taken from http://stackoverflow.com/a/13542669/135703
function shadeColor(color, percent) {  
    var num = parseInt(color.slice(1),16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = (num >> 8 & 0x00FF) + amt,
    B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
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

  this.removeBuilding = function() {
    this.buildings.shift()
  }

  this.draw = function(context) {
    for (index = 0; index < this.buildings.length; ++index) {
      this.buildings[index].draw(context, this.scheme, this.x, this.y);
    }
  }

  this.populateFromScheme = function(){
    this.populate(this.scheme['maxBuildings']);
  }

  this.populate = function(numBuildings) {
    var width = window.innerWidth;
    var height = window.innerHeight;
    for (index = 0; index < numBuildings ; ++index) {
      this.addBuilding(new Building(
            getRandInt(this.x, this.width),
            getRandMinMax("BuildingWidth", this.scheme) * width,
            getRandMinMax("BuildingHeight", this.scheme) * height,
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
  this.color_lite = shadeColor(color, 20);

  this.drawWindows = function(context, scheme, x, y) {
    var winx = this.x_loc + x;
    var rf = getRandFloat(
        scheme['windows']['min_y'],
        scheme['windows']['max_y']
    );
    var winy = y - (this.height * rf);
    winx += this.width_loc * getRandFloat(
        scheme['windows']['min_x'],
        scheme['windows']['max_x']
    );
    var index = 0;
    var style = context.fillStyle;
    for (index = 0; index < scheme['windows']['group_size']; index++) {
      if (scheme['windows']['lites_out'] > Math.random()) {
        winy += 15;
        continue;
      }
      if (winy + 10 > y) {
        break;
      }
      context.fillStyle = this.color_lite;
      context.fillRect(winx, winy, scheme['windows']['width'], scheme['windows']['height']);
      winy += scheme['windows']['v_space'];
    }
    context.fillStyle = style;
  }

  this.drawHighlights = function(context, scheme, x, y) {
    var hwide = 2;
    var hgrad = context.createLinearGradient(this.x_loc + x, y - this.height, this.width_loc, hwide);
    hgrad.addColorStop(0, this.color);
    hgrad.addColorStop(1, this.color_lite);
    context.fillStyle = this.color_lite;
    context.fillRect(this.x_loc + x, y - this.height, this.width_loc, -1 * hwide);
    
    var vgrad = context.createLinearGradient(this.x_loc + x + this.width_loc - hwide, y - this.height, hwide, y);
    vgrad.addColorStop(0, this.color);
    vgrad.addColorStop(1, this.color_lite);
    context.fillStyle = this.color_lite;
    context.fillRect(this.x_loc + x + this.width_loc - hwide, y - this.height, hwide, this.height);
  }
  
  this.draw = function(context, scheme, x, y) {
    var style = context.fillStyle;
    context.fillStyle = this.color;
    context.fillRect(this.x_loc + x, y, this.width_loc, -1 * this.height);
    context.fillStyle = style;
    var index;
    for (index = 0; index < scheme['windows']['number']; index++) {
      this.drawWindows(context, scheme, x, y);
    }
    this.drawHighlights(context, scheme, x, y);
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

  this.layers['1'].populateFromScheme();
  this.layers['2'].populateFromScheme();
  this.layers['3'].populateFromScheme();

  this.draw = function draw() {
    for (layer in this.layers) {
      this.layers[layer].draw(this.context);
    }
  }

  this.updateScene = function() {
    this.layers['1'].populate(1);
    this.layers['2'].populate(1);
    this.layers['3'].populate(1);
    this.layers['1'].removeBuilding(1);
    this.layers['2'].removeBuilding(1);
    this.layers['3'].removeBuilding(1);
    this.draw();
  }
}

// This function copied whole-cloth from http://www.abeautifulsite.net/parsing-urls-in-javascript/
function parseURL(url) {

  var parser = document.createElement('a'),
    searchObject = {},
    queries, split, i;

  // Let the browser do the work
  parser.href = url;

  // Convert query string to object
  queries = parser.search.replace(/^\?/, '').split('&');
  for( i = 0; i < queries.length; i++ ) {
    split = queries[i].split('=');
    searchObject[split[0]] = split[1];
  }

  return {
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.pathname,
    search: parser.search,
    searchObject: searchObject,
    hash: parser.hash
  };

}

function SpaceTime(canvas) {
  this.canvas = canvas;
  this.scene = "";
  this.newCity = function() {
    this.scene = new Scene(this.canvas);
    this.scene.draw(); 
  }
  this.updateCity = function() {
    this.scene.updateScene()    
  }
}


function start(canvas) {
  var so  = parseURL(document.URL);
  var speed = so.searchObject['speed'] ? parseInt(so.searchObject['speed']) : 500;
  var spaceTime = new SpaceTime(canvas);
  spaceTime.newCity(canvas);
  setInterval(
    function () {
      spaceTime.updateCity();
    },
    speed
  );
}
