goog.provide('m.Platform');

m.Platform = function(position) {
	m.Entity.call(this, 'objects', position, {density: 1, restitution: 0.5});
};

goog.inherits(m.Platform, m.Entity);

m.Platform.prototype.createObject = function() {
	return new RoundedRect
	    .setSize(30, 4)
		.setFill(0,0,255);
};