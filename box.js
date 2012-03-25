goog.provide('m.Box');

goog.require('m.Entity');

/**
 * A box
 * @constructor
 */
m.Box = function(position) {
	this.buttons = {};
	m.Entity.call(this, 'objects', position, {density: 1, restitution: 0.2, friction: 20});
};
goog.inherits(m.Box, m.Entity);

m.Box.prototype.createObject = function() {
	return new lime.RoundedRect()
	.setRadius(4)
	.setSize(30,30)
	.setFill(0,255,0);
};

m.Box.prototype.createShapeDefs = function() {
	var shapeDef = new box2d.BoxDef;
	shapeDef.extents = new box2d.Vec2(tilesSize / 2 * 0.8, tilesSize / 2 * 0.8);
	return [ shapeDef ];
};

m.Box.prototype.getButtons = function() {
	var unorderedButtons = m.Box.superClass_.getOverEntities.call(this, buttons, m.BoxButton);
	var orderedButtons = {};
	for ( var i=0; i<unorderedButtons.length; i++) {
		orderedButtons[unorderedButtons[i].buttonId] = unorderedButtons[i];
	}
	return orderedButtons;
};

m.Box.prototype.triggerBoxButton = function() {
	var myButtons = this.getButtons();
	var buttonsToDesactivate = this.buttons;
	for ( var key in myButtons ) {
		if ( this.buttons[myButtons[key].buttonId] ) {
			delete buttonsToDesactivate[myButtons[key].buttonId];
		} else {
			myButtons[key].activate();
		}
	}
	for ( var key in buttonsToDesactivate ) {
		buttonsToDesactivate[key].desactivate();
	}
	this.buttons = myButtons;
};

m.Box.prototype.update = function(dt) {
	m.Box.superClass_.update.call(this,dt);
	this.triggerBoxButton();
};
