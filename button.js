goog.provide('m.Button');

goog.require('m.Entity');

/**
 * A button
 * @constructor
 */
m.Button = function(tileInfos) {
	var properties = tileInfos.tile.properties;
	this.active = false;
	this.targetName = properties.targetName;
	this.actionOn = properties.actionOn;
	this.actionOff = properties.actionOff;
	m.Entity.call(this, 'decorations', {x: tileInfos.px, y: tileInfos.py}, {density: 0, restitution: 0});
	buttons.push( this );
	this.buttonId  = buttons.length;
};
goog.inherits(m.Button, m.Entity);

m.Button.prototype.createObject = function() {
    var fill = this.frames[this.active ? 'active' : 'unactive'];
	return new lime.RoundedRect()
	    .setSize(32, 32)
        .setRadius(0)
	    .setFill( fill ? fill : this.color );
};

m.Button.prototype.createShapeDefs = function() {
	return [ ];
};

m.Button.prototype.activate = function() {
	if ( ! this.active && targets[ this.targetName ] ) { 
		targets[ this.targetName ].action( this.actionOn );
	}
	this.active = true;
    if (this.frames.active) {
    	this.object.setFill(this.frames.active);
    }
};
m.Button.prototype.desactivate = function() {
	if ( this.active && targets[ this.targetName ] ) { 
		targets[ this.targetName ].action( this.actionOff );
	}
	this.active = false;
    if (this.frames.unactive) {
    	this.object.setFill(this.frames.unactive);
    }
};
m.Button.prototype.trigger = function() {
	if (this.active) {
		this.desactivate();
	} else {
		this.activate();
	}
};
