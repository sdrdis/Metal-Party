goog.provide('m.PlayerButton');

goog.require('m.Button');

/**
 * A player button
 * @constructor
 */
m.PlayerButton = function(tileInfos) {
	this.color = new lime.fill.Color('#6666FF');
	m.Button.call(this, tileInfos);
};
goog.inherits(m.PlayerButton, m.Button);
