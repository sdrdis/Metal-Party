goog.provide('m.Player');

goog.require('goog.events.KeyCodes');
goog.require('box2d.Vec2');

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
	return new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,63)
	.setFill(255,0,0);
};

m.Player.prototype.createShapeDefs = function() {
	var shapeDefB = new box2d.BoxDef;
	shapeDefB.extents.Set(tilesSize / 2, tilesSize * 0.80);
	shapeDefB.localPosition.Set(0, tilesSize * (-0.20));
	
	var shapeDefC = new box2d.CircleDef;
	shapeDefC.radius = tilesSize * 0.55;
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
			this.body.ApplyImpulse(new box2d.Vec2(0, -200), this.body.GetOriginPosition());
			break;
			
		case codes.RIGHT:
			this.rightPressed = true;
			this.body.ApplyImpulse(new box2d.Vec2(0, -200), this.body.GetOriginPosition());
			break;
			
		case codes.UP:
			this.jump = true;
			break;
			
		default:
			return true;
	}
	return false;
};

m.Player.prototype.getButtons = function() {
	var myButtons = [];
	for ( var i=0; i<buttons.length; i++ ) {
		var button = buttons[i];
		if ( button instanceof m.PlayerButton ) {
			if ( button.collideWithEntity( this ) ) {
				myButtons.push(button);
			}
		}
	}
	return myButtons;
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
		this.jump = false;
		if (grounded) {
			vel.y = 0;
			this.body.SetLinearVelocity(vel);
			var pos = this.body.GetOriginPosition();
			pos.y += 0.01;
			this.body.SetOriginPosition(pos, 0);
			this.body.ApplyImpulse(new box2d.Vec2(0, -1500000), pos);
		}
	}	
}
