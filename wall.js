goog.provide('m.Wall');

goog.require('m.Entity');

/**
 * A wall
 * @constructor
 */
m.Wall = function(tileInfos) {
	if (tileInfos.tile.frame) {
		this.image = tileInfos.tile.frame;
	}
	m.Entity.call(this, 'walls', {x: tileInfos.px, y: tileInfos.py}, {density: 0});
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
	var shapeDef = new box2d.BoxDef();
	shapeDef.extents = new box2d.Vec2(tilesSize / 2, tilesSize / 2);
	return [ shapeDef ];
};

m.Wall.prototype.update = function(dt) {
}