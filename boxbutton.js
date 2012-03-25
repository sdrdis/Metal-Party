goog.provide('m.BoxButton');

goog.require('m.Button');

/**
 * A box button
 * @constructor
 */
m.BoxButton = function(tileInfos) {
	this.color = new lime.fill.Color('#0000FF');
	m.Button.call(this, tileInfos);
};
goog.inherits(m.BoxButton, m.Button);

m.BoxButton.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef();
	shapeDef.extents = new box2d.Vec2(tilesSize / 2, tilesSize / 2);
	return [ shapeDef ];
};

// On simule que le box button soit une case plus haute, pour le déclenchement
m.BoxButton.prototype.getCoords = function() {
	var coords = m.BoxButton.superClass_.getCoords.call(this);
	for ( var i=0; i<coords.length; i++ ) {
		coords[i].y -= 1;
	}
	return coords;
}
