goog.provide('m.PlayerButton');

goog.require('m.Button');

/**
 * A player button
 * @constructor
 */
m.PlayerButton = function(tileInfos) {
	this.color = new lime.fill.Color('#6666FF');
	this.frames = {
		active : new lime.fill.Image('resources/playerbutton_opened.png'),
		unactive : new lime.fill.Image('resources/playerbutton_closed.png')
	}
	m.Button.call(this, tileInfos);
};
goog.inherits(m.PlayerButton, m.Button);
