goog.provide('m.BoxButton');

goog.require('m.Button');

/**
 * A box button
 * @constructor
 */
m.BoxButton = function(coordinate) {
	this.color = new lime.fill.Color('#0000FF');
	m.Button.call(this, coordinate);
};
goog.inherits(m.BoxButton, m.Button);
