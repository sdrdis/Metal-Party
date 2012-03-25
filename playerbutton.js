goog.provide('m.PlayerButton');

goog.require('m.Button');

/**
 * A player button
 * @constructor
 */
m.PlayerButton = function(coordinate) {
	this.color = new lime.fill.Color('#6666FF');
	m.Button.call(this, coordinate);
};
goog.inherits(m.PlayerButton, m.Button);
