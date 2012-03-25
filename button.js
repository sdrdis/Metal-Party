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
	m.Entity.call(this, 'decorations', this.convertCoordToPos(coordinate), {density: 0, restitution: 0});
	buttons.push( this );
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
	this.active = true;
	if ( targets[ this.targetName ] ) { 
		targets[ this.targetName ].action( this.actionOn );
	} else {
		console.log( 'Le métal c\'est pas bon' );
	}
};
m.Button.prototype.desactivate = function() {
	this.active = false;
	if ( targets[ this.targetName ] ) { 
		targets[ this.targetName ].action( this.actionOff );
	} else {
		console.log( 'Le métal c\'est pas bon' );
	}
};
m.Button.prototype.trigger = function() {
	if (this.active) {
		this.desactivate();
	} else {
		this.activate();
	}
};
