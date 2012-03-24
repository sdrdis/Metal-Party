goog.provide('m.Door');

/**
 * A door
 * @constructor
 */
m.Door = function(coordinate) {
    var properties = coordinate.tile.properties;
	this.opened = properties.initial == 'opened' ? true : false;
    this.name = properties.name;
    this.frames = {
        opened : new lime.fill.Image('resources/door_opened.png').setSize(tilesSize , 2 * tilesSize).setOffset(0, 0),
        closed : new lime.fill.Image('resources/door_closed.png').setSize(tilesSize , 2 * tilesSize).setOffset(0, 0)
    }
	m.Entity.call(this, 'decorations', this.convertCoordToPos(coordinate), {density: 0, restitution: 0});
	targets[name] = this;
};
goog.inherits(m.Door, m.Entity);

m.Door.prototype.createObject = function() {
    return new lime.Sprite()
        .setSize(tilesSize, 2 * tilesSize)
        .setFill(this.frames[this.opened ? 'opened' : 'closed']);
};

m.Door.prototype.createShapeDefs = function() {
	return [ ];
};

m.Door.prototype.action = function(name) {
    if (name == 'switch') {
        this.change();
    } else {
        this[name]();
    }
};

m.Door.prototype.open = function() {
	this.opened = true;
    this.object.setFill(this.frames['opened']);
};
m.Door.prototype.close = function() {
	this.opened = false;
    this.object.setFill(this.frames['closed']);
};
m.Door.prototype.change = function() {
	if (this.opened) {
		this.close();
	} else {
		this.open();
	}
};
