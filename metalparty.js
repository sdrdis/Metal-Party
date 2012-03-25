//set main namespace
goog.provide('m');

goog.require('m.Entity');
goog.require('m.Player');
goog.require('m.Wall');
goog.require('m.Box');
goog.require('m.Button');
goog.require('m.PlayerButton');
goog.require('m.BoxButton');
goog.require('m.Platform');
goog.require('m.Target');
goog.require('m.DoorTarget');
goog.require('m.TrapTarget');
goog.require('m.DeathZone');
goog.require('m.ManualAnimation');

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
goog.require('lime.audio.Audio');

goog.require('lime.parser.TMX');

// Globals
var tilesSize = 32;
var layers, references = [], buttons = [], targets = {}, bodiesToRemove = [];
var world;
var player;

var startPosition = {x: 4, y: 36};
var scene;
var worldSize = {width: 0, height: 0};

//var startPosition = {x: 4, y: 4};

/** @const */ pixelPerMeter = 1;


// entrypoint
m.start = function() {
	function load_tmx(tmx) {
		worldSize = {width: tmx.width, height: tmx.height};
		for ( var i=0; i<tmx.layers.length; i++ ) {
			if ( layers[ tmx.layers[i].name ] ) {
				layer = layers[ tmx.layers[i].name ];
				layer.setPosition( tmx.layers[i].px, tmx.layers[i].py);
				
				tmx.layers[i].tiles.forEach(function(tileInfos) {
                    add_tile(tileInfos);
				});
			}
		}
        for (var i=0; i<tmx.objects.length; i++) {
            var obj = tmx.objects[i];
            var tile;
            if (obj.tile) {
                tile = obj.tile;
            } else {
                tile = {
                    properties : obj.properties
                }
            }
            add_tile({
                x : obj.px,
                y : obj.py,
                tile : tile
            });
        }
		for ( var key in layers ) {
			scene.appendChild(layers[ key ]);
		}
	}

    function add_tile(tileInfos) {

        if (tileInfos.tile.properties instanceof Array) {
            tileInfos.tile.properties = tmx_tile_parse_property(tileInfos.tile);
            if (tileInfos.tile.properties.type == 'box') {
                tileInfos.tile.x *= tileInfos.x;
                tileInfos.tile.y *= tileInfos.y;
                tileInfos.tile.px = tileInfos.x * tilesSize;
                tileInfos.tile.py = tileInfos.y * tilesSize;
                tileInfos.x = tileInfos.tile.px;
                tileInfos.y = tileInfos.tile.py;
            }
        }

        var type;
        switch (tileInfos.tile.properties.type) {

            case 'triggerWorld' :
                type = 'BoxButton';
                break;

            case 'triggerPlayer':
                type = 'PlayerButton';
                break;

            case 'door':
                type = 'DoorTarget';
                break;

            case 'trap':
                type = 'TrapTarget';
                break;

            case 'mortal':
                type = 'DeathZone';
                break;

            case 'box':
                type = 'Box';
                break;

            case 'vertical':
            case 'horizontal':
                type = 'Platform';
                break;

            default:
                type = 'Wall';
        }
        if (tileInfos.tile.properties.type != 'ignore') {
            new m[type](tileInfos);
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
	var gravity = new box2d.Vec2(0, 1500);
	var bounds = new box2d.AABB();
	bounds.minVertex.Set(-10000, -10000);
	bounds.maxVertex.Set(10000, 10000);
	world = new box2d.World(bounds, gravity, false);
	
	var director = new lime.Director(document.body,640,480);
	scene = new lime.Scene();
	
	// TMX
	var tmx = new lime.parser.TMX('resources/level01a.tmx');
	layers = {
		background: new lime.Layer().setPosition(0,0),
		walls: new lime.Layer().setPosition(0,0),
		decorations: new lime.Layer().setPosition(0, 0),
		objects: new lime.Layer().setPosition(0,0),
		foreground: new lime.Layer().setPosition(0,0)
	};
	load_tmx(tmx);
	

   	// Level


	player = new m.Player(startPosition);
	//new m.Box({x: 17 * tilesSize, y: 2 * tilesSize});
	//new m.PlayerButton({x:5, y: 12});
	//new m.Platform({x: 100, y: 200});
	//new m.Door({x:7, y: 11, tile : { properties : {} } });
	//new m.Trap({x:9, y: 12, tile : { properties : {} } });

   	// Initialization
   	lime.scheduleManager.schedule(function(dt) {
		if(dt>100) dt=100; // long delays(after pause) cause false collisions
		player.beforePhysics();
		world.Step(dt / 1000, 3);
		for (var i = 0; i < references.length; i++) {
			references[i].update(dt);
		}
	},this);
	director.makeMobileWebAppCapable();
	director.replaceScene(scene);

}

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('m.start', m.start);
