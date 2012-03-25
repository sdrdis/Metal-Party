goog.provide('m.Entity');

m.Entity = function(layerName, position, colliderProperties) {
	this.object = this.createObject();
	layers[layerName].appendChild(this.object);
	var x = position.x + this.getWidth() / 2;
	var y = position.y + this.getHeight() / 2;
	this.object.setPosition(x, y);
	
	this.setColliderProperties(colliderProperties);
	this.updateShapeDefs();
	
	this.shapes = [];
	var shape = this.body.GetShapeList();
	while (shape) {
		this.shapes.push(shape);
		shape = shape.GetNext();
	}
};

m.Entity.prototype.getWidthInTile = function() {
	return Math.ceil( this.object.getSize().width / tilesSize );
}

m.Entity.prototype.getWidth = function() {
	return this.getWidthInTile() * tilesSize;
}

m.Entity.prototype.getHeightInTile = function() {
	return Math.ceil( this.object.getSize().height / tilesSize );
}

m.Entity.prototype.getHeight = function() {
	return this.getHeightInTile() * tilesSize;
}

m.Entity.prototype.createObject = function() {
	return new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,31)
	.setFill(255,150,0);
};

m.Entity.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef();
	shapeDef.extents.Set(tilesSize / 2, tilesSize / 2);
	return [ shapeDef ];
};

m.Entity.prototype.updateShapeDefs = function() {
	if ( this.body ) {
		// La pratique, pour Supprimer un body : 
		this.body.SetOriginPosition( {x:-100, y:-100}, 0 );
		this.body.m_userData = null;
		// La Théorie :
		world.DestroyBody( this.body );
	}
	var bodyDef = new box2d.BodyDef();
	var position = this.object.getPosition();
	bodyDef.position.Set(position.x, position.y);
	var shapeDefs = this.createShapeDefs();
	for ( var i=0; i<shapeDefs.length; i++ ) {
		for (var key in this.colliderProperties) {
			shapeDefs[i][key] = this.colliderProperties[key];
		}
		bodyDef.AddShape(shapeDefs[i]);
	}
	if (this.colliderProperties['preventRotation'] !== undefined) {
		bodyDef.preventRotation = this.colliderProperties['preventRotation'];
	}
	if (this.colliderProperties['allowSleep'] !== undefined) {
		bodyDef.allowSleep = this.colliderProperties['allowSleep'];
	}
	this.body = world.CreateBody(bodyDef);
};

m.Entity.prototype.setColliderProperties = function(colliderProperties) {
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
	this.colliderProperties = colliderProperties;
}
m.Entity.prototype.convertCoordToPos = function(coordinate) {
	var position = {};
	position.x = coordinate.x * tilesSize;
	position.y = coordinate.y * tilesSize;
	return position
}

m.Entity.prototype.getCoords = function() {
	var coords = [];
	var origin = {};
	var position = this.object.getPosition();
	origin.x = Math.floor( position.x / tilesSize );
	origin.y = Math.floor( position.y / tilesSize );
	for ( var i=0; i<this.getWidthInTile(); i++ ) {
		for ( var j=0; j<this.getHeightInTile(); j++ ) {
			coords.push( {x: origin.x - i, y: origin.y - j} );
		}
	}
	return coords;
}

m.Entity.prototype.inFrontOfCoords = function( coords ) {
	var myCoords = this.getCoords();
	for ( var i=0; i<coords.length; i++ ) {
		for ( var j=0; j<myCoords.length; j++ ) {
			if ( myCoords[j].x == coords[i].x && myCoords[j].y == coords[i].y ) {
				return true;
			}
		}
	}
	return false;
}

m.Entity.prototype.inFrontOfEntity = function( entity ) {
	return this.inFrontOfCoords( entity.getCoords() );
}

m.Entity.prototype.collideWithEntity = function( entity ) {
	var bb = entity.object.getBoundingBox();
	var myBb = this.object.getBoundingBox();
	return ( 
		( ( bb.left < myBb.right && bb.left > myBb.left ) || ( bb.right < myBb.right && bb.right > myBb.left ) ) &&
		( ( bb.top < myBb.bottom && bb.top > myBb.top ) || ( bb.bottom < myBb.bottom && bb.bottom > myBb.top ) )
	);
};

m.Entity.prototype.isInList = function(elementList) {
	for ( var i=0; i<elementList.length; i++ ) {
		if ( this == elementList ) return i;
	}
	return false;
}

m.Entity.prototype.getOverEntities = function(elementList, elementType) {
	var myElements = [];
	for ( var i=0; i<elementList.length; i++ ) {
		var element = elementList[i];
		if ( element instanceof elementType ) {
			if ( element.inFrontOfEntity( this ) ) {
				myElements.push(element);
			}
		}
	}
	return myElements;
};

m.Entity.prototype.update = function(dt) {
	if (this.body) {
		var pos = this.body.GetCenterPosition();
		var rot = this.body.GetRotation();
		this.object.setRotation(-rot / Math.PI * 180);
		this.object.setPosition(pos);
	}
};

m.Entity.prototype.onMouseDown = function(e) {
	if (this == player) { // I know it's risky...
		return;
	}
	
	var forceApplying = function(dt) {
		var pos = this.object.getPosition();
		var pos2 = player.object.getPosition();
		var strength = 20000000 / Math.sqrt((pos.x - pos2.x) * (pos.x - pos2.x) + (pos.y - pos2.y) * (pos.y - pos2.y) );
		var vect = new box2d.Vec2(pos.x, pos.y);
		var vect2 = new box2d.Vec2(pos2.x, pos2.y);
		vect = vect.Negative();
		vect.x += vect2.x;
		vect.y += vect2.y;
		vect.Normalize();
		vect.x *= strength;
		vect.y *= strength;
		if (e.event.button == 2) {
			vect = vect.Negative();
		}
		
		vect.x = vect.x * dt;
		vect.y = vect.y * dt;
		
		this.body.ApplyForce(vect, this.body.GetOriginPosition());
	};
	
	
	lime.scheduleManager.schedule(forceApplying,this);
	var self = this;
	document.onmouseup = function() { lime.scheduleManager.unschedule(forceApplying,self); }; //Didn't have any other idea....
	
};
