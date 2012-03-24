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

m.Entity.prototype.convertCoordToPos = function(coordinate) {
	var position = {};
	position.x = coordinate.x * tilesSize;
	position.y = coordinate.y * tilesSize;
	return position
}

m.Entity.prototype.getCoord = function() {
	var coordinate = {};
	var position = this.object.getPosition();
	coordinate.x = Math.floor( position.x / tilesSize );
	coordinate.y = Math.floor( position.y / tilesSize );
	return coordinate;
}

m.Entity.prototype.collideWithCoord = function( coord ) {
	var myCoord = this.getCoord();
	return ( myCoord.x == coord.x && myCoord.y == coord.y );
}

m.Entity.prototype.collideWithEntity = function( entity ) {
	return this.collideWithCoord( entity.getCoord() );
}

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
