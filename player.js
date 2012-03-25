goog.provide('m.Player');

goog.require('goog.events.KeyCodes');
goog.require('box2d.Vec2');
goog.require('m.Entity');

/**
 * The player
 * @constructor
 */
m.Player = function(coordinate) {
	m.Entity.call(this, 'objects', this.convertCoordToPos(coordinate), {density: 1, preventRotation: true, allowSleep: false});

	this.leftPressed = false;
	this.rightPressed = false;
	this.jump = false;
	
	goog.events.listen(this.object, ['keydown'], this.onKeyDown, false, this);
	goog.events.listen(this.object, ['keyup'], this.onKeyUp, false, this);
};
goog.inherits(m.Player, m.Entity);

m.Player.prototype.createObject = function() {
	var layer = new lime.Layer();
	
	var bodySprite = new lime.RoundedRect().setRadius(0).setSize(32,64);
	bodySprite.runAction(new m.ManualAnimation([
			{path: 'resources/player/body1.png', w: 32, h:64},
			{path: 'resources/player/body2.png', w: 32, h:64}
		]));
	var leftHandSprite = new lime.RoundedRect().setRadius(0).setSize(32,32).setPosition(0,0);
	var leftHandImage = new lime.fill.Image('resources/player/leftarm.png').setSize(32, 32);
	leftHandSprite.setFill(leftHandImage);
	var rightHandSprite = new lime.RoundedRect().setRadius(0).setSize(32,32).setPosition(0,3);
	var rightHandImage = new lime.fill.Image('resources/player/rightarm.png').setSize(32, 32);
	rightHandSprite.setFill(rightHandImage);
	
	this.sprites = {
		body: bodySprite,
		leftHand: leftHandSprite,
		rightHand: rightHandSprite
	};
	
	layer.appendChild(leftHandSprite);
	layer.appendChild(bodySprite);
	layer.appendChild(rightHandSprite);
	
	return layer;
};

m.Player.prototype.createShapeDefs = function() {
	var shapeDefB = new box2d.BoxDef;
	shapeDefB.extents.Set(tilesSize * 0.45, tilesSize * 0.80);
	shapeDefB.localPosition.Set(0, tilesSize * (-0.20));
	
	var shapeDefC = new box2d.CircleDef;
	shapeDefC.radius = tilesSize * 0.45;
	shapeDefC.localPosition.Set(0, tilesSize * (0.45));
	
	return [ shapeDefB, shapeDefC ];
};

m.Player.prototype.onKeyDown = function(e) {
	var codes = goog.events.KeyCodes;
	switch (e.event.keyCode) {
		case codes.DOWN:
			myButtons = this.getButtons();
			for ( var i=0; i<myButtons.length; i++){
				myButtons[i].trigger();
			}
			break;

		case codes.LEFT:
			this.leftPressed = true;
			//this.body.ApplyImpulse(new box2d.Vec2(0, -200), this.body.GetOriginPosition());
			break;
			
		case codes.RIGHT:
			this.rightPressed = true;
			//this.body.ApplyImpulse(new box2d.Vec2(0, -200), this.body.GetOriginPosition());
			break;
			
		case codes.UP:
			this.jump = true;
			break;
			
		case codes.F5:
			window.location.reload();
			break;
			
		default:
			return true;
	}
	return false;
};

m.Player.prototype.getButtons = function() {
	return m.Player.superClass_.getOverEntities.call(this, buttons, m.PlayerButton);
};

m.Player.prototype.onKeyUp = function(e) {
	var codes = goog.events.KeyCodes;
	switch (e.event.keyCode) {
		case codes.LEFT:
			this.leftPressed = false;
			break;
			
		case codes.RIGHT:
			this.rightPressed = false;
			break;
			
		case codes.UP:
			this.jump = false;
			break;
			
		default:
			return true;
	}
	return false;
}

m.Player.prototype.beforePhysics = function() {
	var vel = this.body.GetLinearVelocity();
	var max = 300;
	if (Math.abs(vel.x) > max) {
		vel.x = (vel.x > 0) ? max : -max;
		this.body.SetLinearVelocity(vel);
	}
	
	if (this.leftPressed) {
		this.body.ApplyImpulse(new box2d.Vec2(-50000, 0), this.body.GetOriginPosition());
	}
	
	if (this.rightPressed) {
		this.body.ApplyImpulse(new box2d.Vec2(50000, 0), this.body.GetOriginPosition());
	}
	
	var grounded = false;
	var contact = this.body.GetContactList();
	while (contact) {
		if (contact.contact.m_shape1 == this.shapes[0] || contact.contact.m_shape2 == this.shapes[0]) {
			grounded = true;
			break;
		}
		contact = contact.next;
	}
	
	if (grounded && !this.leftPressed && !this.rightPressed) {	
		vel.x *= 0.9;
		this.body.SetLinearVelocity(vel);
	}
	
	if (this.jump) {			
		//this.jump = false;
		if (grounded) {
			vel.y = 0;
			this.body.SetLinearVelocity(vel);
			var pos = this.body.GetOriginPosition();
			pos.y -= 1;
			this.body.SetOriginPosition(pos, 0);
			this.body.ApplyImpulse(new box2d.Vec2(0, -1400000), pos);
		}
	}	
}
