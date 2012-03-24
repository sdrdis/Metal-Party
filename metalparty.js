//set main namespace
goog.provide('metalparty');

goog.require('m.Entity');
goog.require('m.Player');
goog.require('m.Wall');
goog.require('m.Box');
goog.require('m.Button');
goog.require('m.PlayerButton');
goog.require('m.BoxButton');
goog.require('m.Platform');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
goog.require('box2d.JointDef');
goog.require('box2d.MouseJointDef');
goog.require('box2d.World');

goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.RoundedRect');
goog.require('lime.Label');
goog.require('lime.animation.Spawn');
goog.require('lime.animation.FadeTo');
goog.require('lime.animation.ScaleTo');
goog.require('lime.animation.MoveTo');

goog.require('lime.parser.TMX');

// Globals
var tilesSize = 32;
var layers, references = [], buttons = [];
var world;

// entrypoint
metalparty.start = function() {

	function load_tmx(tmx) {
		for ( var i=0; i<tmx.layers.length; i++ ) {
			if ( layers[ tmx.layers[i].name ] ) {
				layer = layers[ tmx.layers[i].name ];
				layer.setPosition( tmx.layers[i].px, tmx.layers[i].py);
				tmx.layers[i].tiles.forEach(function(tileInfos) {
					tileInfos.tile.properties = tmx_tile_parse_property(tileInfos.tile);
					var type = 'Wall';
					new m[type](tileInfos);
				});
			}
		}
		for ( var key in layers ) {
			scene.appendChild(layers[ key ]);
		}
	}
	
	function tmx_tile_parse_property(tile) {
		var values = {};
		if (tile.properties.length > 0) {
			tile.properties.forEach(function(prop) {
				values[prop.name] = prop.value;
			});
		}
		return values;
	}
	
	function tmx_tile_get_property(tile, name) {
		var value = null;
		tile.properties.forEach(function(prop) {
			if (prop.name == name) {
				value = prop.value;
			}
		});
		return value;
	}
	
	// World
	var gravity = new box2d.Vec2(0, 200);
	var bounds = new box2d.AABB();
	bounds.minVertex.Set(-1000, -1000);
	bounds.maxVertex.Set(1000,1000);
	world = new box2d.World(bounds, gravity, false);
	var director = new lime.Director(document.body,640,480);
	var scene = new lime.Scene();
	
	// TMX
	var tmx = new lime.parser.TMX('resources/area02.tmx');
	layers = {
		background: new lime.Layer().setPosition(0,0),
		walls: new lime.Layer().setPosition(0,0),
		decorations: new lime.Layer().setPosition(0, 0),
		objects: new lime.Layer().setPosition(0,0),
		foreground: new lime.Layer().setPosition(0,0),
	};
	load_tmx(tmx);
	
   	// Level
	var player = new m.Player({x: 5, y: 2});
		window.addEventListener('keydown', function(e) {
			// DOWN
			if (e.keyCode == 40 ) {
				myButtons = player.getButtons();
			for ( var i=0; i<myButtons.length; i++){
			myButtons[i].trigger();
			}
		}
	});
	new m.PlayerButton({x:5, y: 12});
	//new m.Platform({x: 100, y: 100});
	

   	// Initialization
   	lime.scheduleManager.schedule(function(dt) {
		if(dt>100) dt=100; // long delays(after pause) cause false collisions
		player.beforePhysics();
		world.Step(dt / 1000, 3);
		for (var i = 0; i < references.length; i++) {
			references[i].update();
		}
	},this);
	director.makeMobileWebAppCapable();
	director.replaceScene(scene);
}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('metalparty.start', metalparty.start);
