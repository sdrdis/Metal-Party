goog.provide('m.Target');

goog.require('m.Entity');

/**
 * A door
 * @constructor
 */
m.Target = function(coordinate) {
	var properties = coordinate.tile.properties;
	this.opened = properties.initial == 'opened' ? true : false;
	this['name'] = properties['name'];
	for ( key in this.frames ) {
		this.frames[key].setSize(this.width, this.height).setOffset(0, 0);
	}
	m.Entity.call(this, 'decorations', coordinate, {density: 0, restitution: 0});
	targets[this['name']] = this;
};
goog.inherits(m.Target, m.Entity);

m.Target.prototype.createObject = function() {
	return new lime.Sprite()
		.setSize(this.width, this.height)
		.setFill(this.frames[this.opened ? 'opened' : 'closed']);
};

m.Target.prototype.createShapeDefs = function() {
	if (this.opened){
		return [ ];
	} else {
		var shapeDef = new box2d.BoxDef;
		shapeDef.extents = new box2d.Vec2(this.width / 2, this.height / 2);
		return [ shapeDef ];
	}
};

m.Target.prototype.action = function(name) {
	if (name == 'switch') {
		this.change();
	} else {
		this[name]();
	}
};
m.Target.prototype.change = function() {
	this.setOpened(!this.opened);
};
m.Target.prototype.open = function() {
	this.setOpened(true);
};
m.Target.prototype.close = function() {
	this.setOpened(false);
};
m.Target.prototype.setOpened = function( opened ) {
	this.opened = opened;
	this.object.setFill(this.frames[opened ? 'opened' : 'closed']);
	this.updateShapeDefs();
}
