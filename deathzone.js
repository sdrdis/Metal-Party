goog.provide('m.DeathZone');

goog.require('m.Entity');

/**
 * A wall
 * @constructor
 */
m.DeathZone = function(tileInfos) {
	if (tileInfos.tile.frame) {
		this.image = tileInfos.tile.frame;
	}
	//this.body.isDeathZone = true;
	m.Entity.call(this, 'objects', {x: tileInfos.px, y: tileInfos.py}, {density: 0});
	this.body.isDeathZone = true;
};
goog.inherits(m.DeathZone, m.Entity);

m.DeathZone.prototype.createObject = function() {
	if (this.image) {
        return new lime.Sprite()
        .setSize(tilesSize,tilesSize)
        .setFill(this.image);
	} else {
		return m.Wall.superClass_.createObject.call();
	}
};

m.DeathZone.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef();
	shapeDef.extents = new box2d.Vec2(tilesSize / 2, tilesSize / 2);
	return [ shapeDef ];
};
