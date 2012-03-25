goog.provide('m.Platform');

goog.require('m.Entity');

m.Platform = function(coordinate) {
	m.Entity.call(this, 'objects', coordinate, {density: 30, restitution: 0.2});
	
	//var properties = coordinate;
	//console.log(coordinate);
	
	var jointDef = new box2d.PrismaticJointDef();
	jointDef.axis = new box2d.Vec2(1, 0);
	jointDef.body1 = this.body;
	jointDef.body2 = world.GetGroundBody();
	jointDef.anchorPoint = this.body.GetOriginPosition();
	jointDef.lowerTranslation = -800;
	jointDef.upperTranslation = 0;
	//jointDef.enableMotor = true;
	jointDef.enableLimit = true;
	//jointDef.enableLimit = true;
	
	world.CreateJoint(jointDef);
};

goog.inherits(m.Platform, m.Entity);

m.Platform.prototype.createObject = function() {
	return new lime.RoundedRect()
	    //.setSize(50, 8)
	    .setSize(50, 8)
		.setFill(0,0,255);
	
	
};

m.Platform.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef();
	shapeDef.extents = new box2d.Vec2(25, 8);
	return [ shapeDef ];
};