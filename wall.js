goog.provide('m.Wall');


m.Wall = function(coordinate) {
	m.Entity.call(this, 'walls', coordinate, {density: 0});
};
goog.inherits(m.Wall, m.Entity);

m.Wall.prototype.createObject = function() {
	return new lime.RoundedRect()
	.setRadius(4)
	.setSize(31,31)
	.setFill(255,150,0);
};

m.Player.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef;
	shapeDef.extents = new box2d.Vec2(tilesSize / 2, tilesSize / 2);
	return [ shapeDef ];
};