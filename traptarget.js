goog.provide('m.TrapTarget');

goog.require('m.Target');

/**
 * A Trap
 * @constructor
 */
m.TrapTarget = function(tileInfos) {
	this.height = tilesSize;
	this.width = tilesSize;
	this.frames = {
		opened : new lime.fill.Image('resources/trap_opened.png'),
		closed : new lime.fill.Image('resources/trap_closed.png')
	}
	m.Target.call(this, tileInfos);
};
goog.inherits(m.TrapTarget, m.Target);
