goog.provide('m.Trap');

/**
 * A Trap
 * @constructor
 */
m.Trap = function(coordinate) {
    var properties = coordinate.tile.properties;
	this.opened = properties.initial == 'opened' ? true : false;
    this.name = properties.name;
    this.frames = {
        opened : new lime.fill.Image('resources/trap_opened.png').setSize(tilesSize ,tilesSize).setOffset(0, 0),
        closed : new lime.fill.Image('resources/trap_closed.png').setSize(tilesSize ,tilesSize).setOffset(0, 0)
    }
	m.Entity.call(this, 'decorations', this.convertCoordToPos(coordinate), {density: 0, restitution: 0});
	targets[name] = this;
};
goog.inherits(m.Trap, m.Entity);

m.Trap.prototype.createObject = function() {
    return new lime.Sprite()
        .setSize(tilesSize, tilesSize)
        .setFill(this.frames[this.opened ? 'opened' : 'closed']);
};

m.Trap.prototype.createShapeDefs = function() {
	return [ ];
};

m.Trap.prototype.action = function(name) {
    if (name == 'switch') {
        this.change();
    } else {
        this[name]();
    }
};

m.Trap.prototype.open = function() {
	this.opened = true;
    this.object.setFill(this.frames['opened']);
};
m.Trap.prototype.close = function() {
	this.opened = false;
    this.object.setFill(this.frames['closed']);
};
m.Trap.prototype.change = function() {
	if (this.opened) {
		this.close();
	} else {
		this.open();
	}
};
