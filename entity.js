goog.provide('m.Entity');

m.Entity = function(layerName, coordinate, colliderProperties) {
	
	this.object = this.createObject();
	layers[layerName].appendChild(this.object);
	var x = coordinate.x * tilesSize + tilesSize / 2;
	var y = coordinate.y * tilesSize + tilesSize / 2;
	this.object.setPosition(x, y);
	
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
	}
	
	var shapeDefs = this.createShapeDefs();
	for ( var i=0; i<shapeDefs.length; i++ ) {
		for (var key in colliderProperties) {
			shapeDefs[i][key] = colliderProperties[key];
		}
		bodyDef.AddShape(shapeDefs[i]);
	}
	this.body = world.CreateBody(bodyDef);
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