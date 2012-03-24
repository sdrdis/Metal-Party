//set main namespace
goog.provide('metalparty');

goog.require('m.Entity');
goog.require('m.Player');
goog.require('m.Wall');
goog.require('m.Box');

goog.require('box2d.BodyDef');
goog.require('box2d.BoxDef');
goog.require('box2d.CircleDef');
goog.require('box2d.CircleShape');
goog.require('box2d.PolyDef');
goog.require('box2d.Vec2');
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

// Globals
var tilesSize = 32;
var layers, references = [];
var world;

function loadMap(layers) {
	for (var i = 0; i < 20; i++) {
		new m.Wall({x: i, y: 13});
	}
}

// entrypoint
metalparty.start = function(){
	
	// World
	var gravity = new box2d.Vec2(0, 200);
	var bounds = new box2d.AABB();
	bounds.minVertex.Set(-1000, -1000);
	bounds.maxVertex.Set(1000,1000);
	world = new box2d.World(bounds, gravity, false);
	var director = new lime.Director(document.body,640,480);
	var scene = new lime.Scene();
	
	// Layers
	layers = {
	    background: new lime.Layer().setPosition(0,0),
	    walls: new lime.Layer().setPosition(0,0),
	    decorations: new lime.Layer().setPosition(0, 0),
	    objects: new lime.Layer().setPosition(0,0),
	    foreground: new lime.Layer().setPosition(0,0),
	};
    scene.appendChild(layers['background']);
    scene.appendChild(layers['walls']);
    scene.appendChild(layers['decorations']);
    scene.appendChild(layers['objects']);
    scene.appendChild(layers['foreground']);
	
    // Level
	var perso = new m.Player({x: 1, y: 1});
	var box = new m.Box({x: 2, y: 1});
	loadMap(layers);

    // Initialization
    lime.scheduleManager.schedule(function(dt) {
        if(dt>100) dt=100; // long delays(after pause) cause false collisions
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
