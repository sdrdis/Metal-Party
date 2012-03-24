goog.provide('m.Button');

/**
 * A button
 * @constructor
 */
m.Button = function(position) {
	m.Entity.call(this, 'decorations', position, {density: 0, restitution: 0.5});
};
goog.inherits(m.Button, m.Entity);

m.Button.prototype.createObject = function() {
	return new lime.Circle
	    .setSize(4, 4)
		.setFill(0,0,255);
};

m.Button.prototype.createShapeDefs = function() {
	return [ ];
};