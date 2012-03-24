//set main namespace
goog.provide('metalparty');


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




//get requirements
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

var tilesSize = 32;
var layers, references = [];
var world;





//bodyDef.AddShape(shapeDef);
/*

function updateReferences( object ) {
	if (!object.objectId) {
		object.objectId = objectMaxId;
		objectMaxId++;
	}
	
	if (object.currentReference) {
		delete references[object.currentReference.x][object.currentReference.y][objectMaxId];
	}
	var position = object.getPosition();
	console.dir( position );
	var tX = Math.round((position.x - tilesSize) / tilesSize);
	var tY = Math.round((position.y - tilesSize) / tilesSize);
	if (!references[tX]) {
		references[tX] = {};
	}
	if (!references[tX][tY]) {
		references[tX][tY] = {};
	}
	references[tX][tY][object.objectId] = object;
	object.currentReference = {x: tX, y: tY};
}

function moveObject( object, position ) {
	object.setPosition(position);
	
    updateReferences(object);
}
*/

function appendChild(layer, coordinate, object, colliderProperties) {
	var x = coordinate.x * tilesSize + tilesSize / 2;
	var y = coordinate.y * tilesSize + tilesSize / 2;
	object.setPosition(x, y);
	layer.appendChild(object);
	
	var bodyDef = new box2d.BodyDef;
	bodyDef.position.Set(x, y);

	var shapeDef = new box2d.BoxDef;
	shapeDef.extents = new box2d.Vec2(tilesSize / 2, tilesSize / 2);
	for (var key in colliderProperties) {
		shapeDef[key] = colliderProperties[key];
	}
	/*
	shapeDef.density = colliderProperties.density;
	shapeDef.restitution = 0;
	shapeDef.friction = 1;
	*/
	bodyDef.AddShape(shapeDef);
	

	var body = world.CreateBody(bodyDef);
	object._body = body;
	
	references.push(object);
	
	//updateReferences(object);
}

function appendObject(coordinate) {
	var object = new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,31)
	.setFill(255,0,0);
	appendChild(layers.objects, coordinate, object, {density: 5});
	return object;
}


function appendWall(coordinate) {
	var object = new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,31)
	.setFill(255,150,0);
	appendChild(layers.walls, coordinate, object, {density: 0, restitution: 0.5}
	);
}

function loadMap(layers) {
	for (var i = 0; i < 20; i++) {
		appendWall({x: i, y: 13} );
		//layers.walls.appendChild(new lime.RoundedRect().setRadius(4).setSize(31,31).setFill(255,150,0).setPosition(i * 32, 430));
	}
}


// entrypoint
metalparty.start = function(){
	
	var bounds = new box2d.AABB();
	
	var gravity = new box2d.Vec2(0, 200);
	var bounds = new box2d.AABB();
	bounds.minVertex.Set(-1000, -1000);
	bounds.maxVertex.Set(1000,1000);
	world = new box2d.World(bounds, gravity, false);

	var director = new lime.Director(document.body,640,480);
	var scene = new lime.Scene();
	var perso = new lime.RoundedRect().setRadius(2).setSize(16,24).setFill(255,0,0).setPosition(20, 20);
	
	layers = {
	    background: new lime.Layer().setPosition(0,0),
	    walls: new lime.Layer().setPosition(0,0),
	    decorations: new lime.Layer().setPosition(0, 0),
	    objects: new lime.Layer().setPosition(0,0),
	    foreground: new lime.Layer().setPosition(0,0),
	};
	
	loadMap(layers);
	
	var perso = appendObject({x: 1, y: 1});
	
	
	


    lime.scheduleManager.schedule(function(dt) {
    	var updateFromBody = function(shape){
            var pos = shape._body.GetCenterPosition();
            var rot = shape._body.GetRotation();
            shape.setRotation(-rot / Math.PI * 180);
            shape.setPosition(pos);
        }
    	
        if(dt>100) dt=100; // long delays(after pause) cause false collisions
        world.Step(dt / 1000, 3);
        
        for (var i = 0; i < references.length; i++) {
        	updateFromBody(references[i]);
        }
        
    },this);
	
	
	
	//applyGravity(perso);
	
	
/*
        var circle = new lime.Circle().setSize(150,150).setFill(255,150,0),
        lbl = new lime.Label().setSize(160,50).setFontSize(30).setText('TOUCH ME!'),
        title = new lime.Label().setSize(640,70).setFontSize(60).setText('Now move me around!')
            .setOpacity(0).setPosition(320,80).setFontColor('#999').setFill(200,100,0,.1);
           */ 
           
    


    //add circle and label to target object
   // layers['objects'].appendChild(circle);
    //layers['objects'].appendChild(new lime.Circle().setSize(150,150).setFill(255,150,0).setPosition(20, 20));
    //layers['objects'].appendChild(lbl);

    //add target and title to the scene
    scene.appendChild(layers['background']);
    scene.appendChild(layers['walls']);
    scene.appendChild(layers['decorations']);
    scene.appendChild(layers['objects']);
    scene.appendChild(layers['foreground']);
    //scene.appendChild(title);

	director.makeMobileWebAppCapable();
/*
    //add some interaction
    goog.events.listen(target,['mousedown','touchstart'],function(e){

        //animate
        target.runAction(new lime.animation.Spawn(
            new lime.animation.FadeTo(.5).setDuration(.2),
            new lime.animation.ScaleTo(1.5).setDuration(.8)
        ));

        title.runAction(new lime.animation.FadeTo(1));

        //let target follow the mouse/finger
        e.startDrag();

        //listen for end event
        e.swallow(['mouseup','touchend'],function(){
            target.runAction(new lime.animation.Spawn(
                new lime.animation.FadeTo(1),
                new lime.animation.ScaleTo(1),
                new lime.animation.MoveTo(320,240)
            ));

            title.runAction(new lime.animation.FadeTo(0));
        });


    });
    */

	// set current scene active
	director.replaceScene(scene);

}


//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('metalparty.start', metalparty.start);
