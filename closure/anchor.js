goog.provide('m.Anchor');

goog.require('m.Entity');

/**
 * A wall
 * @constructor
 */
m.Anchor = function(tileInfos) {
	this.isAnchor = true;
	if (tileInfos.tile.frame) {
		this.image = tileInfos.tile.frame;
	}
	m.Entity.call(this, 'walls', {x: tileInfos.px, y: tileInfos.py}, {density: 0});
};
goog.inherits(m.Anchor, m.Wall);