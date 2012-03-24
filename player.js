goog.provide('m.Player');

/**
 * The player
 * @constructor
 */
m.Player = function(coordinate) {
	var position = {};
	position.x = coordinate.x * tilesSize;
	position.y = coordinate.y * tilesSize;
	m.Entity.call(this, 'objects', position, {density: 5});
};
goog.inherits(m.Player, m.Entity);

m.Player.prototype.createObject = function() {
	return new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,31)
	.setFill(255,0,0);
};

m.Player.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef;
	shapeDef.extents = new box2d.Vec2(tilesSize / 2, tilesSize / 2);
	return [ shapeDef ];
};
