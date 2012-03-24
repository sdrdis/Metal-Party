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





function appendObject(coordinate) {

	var object = new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,31)
	.setFill(255,0,0);
	appendChild(layers.objects, coordinate, object, {density: 5});
	return object;
}

/*
function appendWall(coordinate) {
	
	
	var object = new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,31)
	.setFill(255,150,0);
	
	
	appendChild(layers.walls, coordinate, object, {density: 0}
	);
}*/

function loadMap(layers) {
	for (var i = 0; i < 20; i++) {
		new m.Wall({x: i, y: 13});
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
	
	var perso = new m.Player({x: 1, y: 1});
	var box = new m.Box({x: 2, y: 1});
	
	/*
	var perso = appendObject({x: 1, y: 1});
	*/
	
	


    lime.scheduleManager.schedule(function(dt) {
        if(dt>100) dt=100; // long delays(after pause) cause false collisions
        world.Step(dt / 1000, 3);
        
        for (var i = 0; i < references.length; i++) {
        	references[i].update();
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
