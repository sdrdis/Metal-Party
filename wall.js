goog.provide('m.Wall');

/**
 * A wall
 * @constructor
 */
m.Wall = function(position, image) {
	if (image) {
		this.image = image;
	}
	m.Entity.call(this, 'walls', position, {density: 0});
};
goog.inherits(m.Wall, m.Entity);

m.Wall.prototype.createObject = function() {
	if (this.image) {
	return new lime.Sprite()
	.setSize(tilesSize,tilesSize)
	.setFill(this.image);
	} else {
		return m.Wall.superClass_.createObject.call();
	}
};

m.Wall.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef;
	shapeDef.extents = new box2d.Vec2(tilesSize / 2, tilesSize / 2);
	return [ shapeDef ];
};