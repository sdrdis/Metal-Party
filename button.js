goog.provide('m.Button');

/**
 * A button
 * @constructor
 */
m.Button = function(coordinate) {
	this.active = false;
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
	//TODO: actionOn
};
m.Button.prototype.desactivate = function() {
	this.active = false;
	//TODO: actionOff
};
m.Button.prototype.trigger = function() {
	if (this.active) {
		this.desactivate();
	} else {
		this.activate();
	}
};
