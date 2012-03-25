goog.provide('m.ManualAnimation');

goog.require('goog.events');
goog.require('lime.animation.KeyframeAnimation');

/**
 * @Constructor
 */
m.ManualAnimation = function(imageData) { // = array of {path, w, h}
	lime.animation.KeyframeAnimation.call(this);
	for (var i = 0; i < imageData.length; i++) {
		var image = new lime.fill.Image(imageData[i].path);
		var frame = new lime.fill.Frame(imageData[i].path, 0, 0, imageData[i].w, imageData[i].h);
		this.addFrame(frame);
	}
	this.setFrame(0);
	this.setLooping(false);
};
goog.inherits(m.ManualAnimation, lime.animation.KeyframeAnimation);

m.ManualAnimation.prototype.setFrame = function(id) {
		this.currentFrame_ = id;
};