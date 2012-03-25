goog.provide('m.DoorTarget');

goog.require('m.Target');

/**
 * A door
 * @constructor
 */
m.DoorTarget = function(coordinate) {
	this.height = tilesSize * 2;
	this.width = tilesSize;
	this.frames = {
		opened : new lime.fill.Image('resources/door_opened.png'),
		closed : new lime.fill.Image('resources/door_closed.png')
	}
	m.Target.call(this, coordinate);
};
goog.inherits(m.DoorTarget, m.Target);

