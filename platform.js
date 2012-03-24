goog.provide('m.Platform');

m.Platform = function(position) {
	m.Entity.call(this, 'objects', position, {density: 1, restitution: 0.5});
	
	
	var bodyDef = box2d.BodyDef;
	bodyDef.position = box2d.Vec2(0, 0);
	bodyDef.linearVelocity = box2d.Vec2(0, 0);
	
	var worldBody = world.CreateBody(bodyDef); // BUG !!!
	
	var jointDef = new box2d.PrismaticJointDef;
	jointDef.axis = new box2d.Vec2(0, 1);
	jointDef.body1 = this.body;
	jointDef.body2 = body;
	jointDef.anchorPoint = box2d.Vec2(0, 0);
	
	world.CreateJoint(jointDef);
};

goog.inherits(m.Platform, m.Entity);

m.Platform.prototype.createObject = function() {
	return new lime.RoundedRect()
	    .setSize(50, 8)
		.setFill(0,0,255);
	
	
};

m.Platform.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef;
	shapeDef.extents = new box2d.Vec2(50, 8);
	
	return [ shapeDef ];
};