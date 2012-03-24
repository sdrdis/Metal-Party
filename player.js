goog.provide('m.Player');

goog.require('goog.events.KeyCodes');
goog.require('box2d.Vec2');

/**
 * The player
 * @constructor
 */
m.Player = function(coordinate) {
	m.Entity.call(this, 'objects', coordinate, {density: .5, preventRotation: true, allowSleep: false});
	
	this.jump = false;
	this.leftPressed = false;
	this.rightPressed = false;
	
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
	shapeDefB.extents.Set(tilesSize / 2, tilesSize * 0.75);
	shapeDefB.localPosition.Set(0, tilesSize * (-0.25));
	
	var shapeDefC = new box2d.CircleDef;
	shapeDefC.radius = tilesSize / 2;
	shapeDefC.localPosition.Set(0, tilesSize * (0.5));
	
	return [ shapeDefB, shapeDefC ];
};

m.Player.prototype.onKeyDown = function(e) {
	var codes = goog.events.KeyCodes;
	switch (e.event.keyCode) {
		case codes.LEFT:
			this.leftPressed = true;
			break;
			
		case codes.RIGHT:
			this.rightPressed = true;
			break;
			
		case codes.UP:
			this.jump = true;
			break;
			
		default:
			return true;
	}
	return false;
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
	if (this.leftPressed) {
		this.body.ApplyImpulse(new box2d.Vec2(-20000, 0), this.body.GetOriginPosition());
	}
	
	if (this.rightPressed) {
		this.body.ApplyImpulse(new box2d.Vec2(20000, 0), this.body.GetOriginPosition());
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
	
	if (this.jump) {			
		this.jump = false;
		if (grounded) {
			var vel = this.body.GetLinearVelocity();
			vel.y = 0;
			this.body.SetLinearVelocity(vel);
			var pos = this.body.GetOriginPosition();
			pos.y += 0.01;
			this.body.SetOriginPosition(pos, 0);
			this.body.ApplyImpulse(new box2d.Vec2(0, -200000), pos);
		}
	}	
}
/*
m.Player.prototype.update = function(dt) {
	m.Entity.prototype.update.call(this, dt);
}
*/