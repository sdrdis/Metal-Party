goog.provide('m.Box');

/**
 * A box
 * @constructor
 */
m.Box = function(position) {
	m.Entity.call(this, 'objects', position, {density: 5, restitution: 0.5});
};
goog.inherits(m.Box, m.Entity);

m.Box.prototype.createObject = function() {
	return new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,31)
	.setFill(0,255,0);
};

m.Player.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef;
	shapeDef.extents = new box2d.Vec2(tilesSize / 2, tilesSize / 2);
	return [ shapeDef ];
};