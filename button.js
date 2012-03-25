goog.provide('m.Button');

goog.require('m.Entity');

/**
 * A button
 * @constructor
 */
m.Button = function(coordinate) {
	var properties = coordinate.tile.properties;
	this.active = false;
	this.targetName = properties.targetName;
	this.actionOn = properties.actionOn;
	this.actionOff = properties.actionOff;
	m.Entity.call(this, 'decorations', coordinate, {density: 0, restitution: 0});
	var position = this.object.getPosition();
	this.object.setPosition( position.x + tilesSize/2, position.y + tilesSize/2 );
	buttons.push( this );
	this.buttonId  = buttons.length;
};
goog.inherits(m.Button, m.Entity);

m.Button.prototype.createObject = function() {
	return new lime.Circle()
	    .setSize(8, 8)
	    .setFill( this.color );
};

m.Button.prototype.createShapeDefs = function() {
	return [ ];
};

m.Button.prototype.activate = function() {
	if ( ! this.active && targets[ this.targetName ] ) { 
		targets[ this.targetName ].action( this.actionOn );
	}
	this.active = true;
};
m.Button.prototype.desactivate = function() {
	if ( this.active && targets[ this.targetName ] ) { 
		targets[ this.targetName ].action( this.actionOff );
	}
	this.active = false;
};
m.Button.prototype.trigger = function() {
	if (this.active) {
		this.desactivate();
	} else {
		this.activate();
	}
};
