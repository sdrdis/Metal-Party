goog.provide('m.Entity');

m.Entity = function(layerName, position, colliderProperties) {
	
	this.object = this.createObject();
	layers[layerName].appendChild(this.object);
	var x = position.x + this.object.getSize().width / 2;
	var y = position.y + this.object.getSize().height / 2;
	this.object.setPosition(x ,y );
	var bodyDef = new box2d.BodyDef;
	bodyDef.position.Set(x, y);

	if (!colliderProperties) {
		colliderProperties = {};
	}
	if (!colliderProperties['density']) {
		colliderProperties['density'] = 0;
	}
	if (colliderProperties['density'] > 0) {
		references.push( this );
		goog.events.listen(this.object, ['mousedown'], this.onMouseDown, false, this);
	}
	
	if (colliderProperties['preventRotation'] !== undefined) {
		bodyDef.preventRotation = colliderProperties['preventRotation'];
	}
	if (colliderProperties['allowSleep'] !== undefined) {
		bodyDef.allowSleep = colliderProperties['allowSleep'];
	}
	
	var shapeDefs = this.createShapeDefs();
	for ( var i=0; i<shapeDefs.length; i++ ) {
		for (var key in colliderProperties) {
			shapeDefs[i][key] = colliderProperties[key];
		}
		bodyDef.AddShape(shapeDefs[i]);
	}
	this.body = world.CreateBody(bodyDef);
	
	this.shapes = [];
	var shape = this.body.GetShapeList();
	while (shape) {
		this.shapes.push(shape);
		shape = shape.GetNext();
	}
};

m.Entity.prototype.createObject = function() {
	return new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,31)
	.setFill(255,150,0);
};

m.Entity.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef;
	shapeDef.extents = new box2d.Vec2(tilesSize / 2, tilesSize / 2);
	return [ shapeDef ];
};

m.Entity.prototype.update = function(dt) {
	var pos = this.body.GetCenterPosition();
    var rot = this.body.GetRotation();
    this.object.setRotation(-rot / Math.PI * 180);
    this.object.setPosition(pos);
};


m.Entity.prototype.onMouseDown = function(e) {
	console.log(this.body);
	this.body.ApplyForce(new box2d.Vec2(400000, -100000000), this.body.GetOriginPosition());
};