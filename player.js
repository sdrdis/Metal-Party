goog.provide('m.Player');

goog.require('goog.events.KeyCodes');
goog.require('box2d.Vec2');
goog.require('m.Entity');

/**
 * The player
 * @constructor
 */
m.Player = function(coordinate) {
	m.Entity.call(this, 'objects', this.convertCoordToPos(coordinate), {density: 1, preventRotation: true, allowSleep: false});

	this.leftPressed = false;
	this.rightPressed = false;
	this.jump = false;
	
	this.t = 0;
	this.animFrame = 0;
	this.animDirection = 0;
	
	goog.events.listen(this.object, ['keydown'], this.onKeyDown, false, this);
	goog.events.listen(this.object, ['keyup'], this.onKeyUp, false, this);
	goog.events.listen(this.object.getParent(), ['mousemove'], this.onMouseMove, false, this);
	this.lastUpdate = 0;

	lime.scheduleManager.schedule(function(dt) {
		// Handling
		
		var contactZone = this.body.GetContactList();
		if (contactZone) {
			if (contactZone.other.isDeathZone) {
				this.moveTo(startPosition);
			}
		}
		var sceneSize = scene.getSize();
		this.lastUpdate += dt;
		/*
		if (this.lastUpdate > 20) {
			this.lastUpdate = 0;
		*/
		//console.log(this.body.GetCenterPosition().x - sceneSize.width / 2, worldSize.width * tilesSize + sceneSize.width / 2);

		//console.log(worldSize.width * tilesSize - sceneSize.width / 2);
			var x = Math.min(worldSize.width * tilesSize - sceneSize.width, Math.max(this.body.GetCenterPosition().x - sceneSize.width / 2, 0));
			var y = Math.min(worldSize.height * tilesSize - sceneSize.height, Math.max(this.body.GetCenterPosition().y - sceneSize.height / 2, 0));
			for ( var key in layers ) {
				layers[ key ].setPosition(-x, -y);
			}
		//}
	},this);
};
goog.inherits(m.Player, m.Entity);

m.Player.prototype.createObject = function() {
	var layer = new lime.Layer();
	
	var bw = 28, bh = 53;
	var bodySprite = new lime.RoundedRect().setRadius(0).setSize(bw,bh).setPosition(0,0);
	var bodyAnim = new m.ManualAnimation([
			{path: 'resources/player/body1.png', w: bw, h:bh},
			{path: 'resources/player/body1flip.png', w: bw, h:bh},
			{path: 'resources/player/body2.png', w: bw, h:bh},
			{path: 'resources/player/body2flip.png', w: bw, h:bh}
		]);
	bodySprite.runAction(bodyAnim);
	var backHandSprite = new lime.RoundedRect().setRadius(0).setSize(32,32).setPosition(0,5);
	var backHandAnim = new m.ManualAnimation([
			{path: 'resources/player/leftarm.png', w: 32, h:32},
			{path: 'resources/player/rightarmflip.png', w: 32, h:32}
		]);
	backHandSprite.runAction(backHandAnim);
	var frontHandSprite = new lime.RoundedRect().setRadius(0).setSize(32,32).setPosition(-4,7);
	var frontHandAnim = new m.ManualAnimation([
			{path: 'resources/player/rightarm.png', w: 32, h:32},
			{path: 'resources/player/leftarmflip.png', w: 32, h:32}
		]);
	frontHandSprite.runAction(frontHandAnim);
	
	this.sprites = {
		body: bodySprite,
		backHand: backHandSprite,
		frontHand: frontHandSprite
	};
	this.anims = {
		body: bodyAnim,
		backHand: backHandAnim,
		frontHand: frontHandAnim
	};
	
	layer.appendChild(backHandSprite);
	layer.appendChild(bodySprite);
	layer.appendChild(frontHandSprite);
	
	return layer;
};

m.Player.prototype.moveTo = function(coordinate) {
	var pos = this.convertCoordToPos(coordinate);
	var posVect = new box2d.Vec2(pos.x, pos.y);
	this.body.SetOriginPosition(posVect, 0);
	this.object.setPosition(posVect);
}

m.Player.prototype.createShapeDefs = function() {
	var shapeDefB = new box2d.BoxDef();
	shapeDefB.extents.Set(tilesSize * 0.45, tilesSize * 0.80);
	shapeDefB.localPosition.Set(0, -0.20 * tilesSize);
	
	var shapeDefC = new box2d.CircleDef();
	shapeDefC.radius = 0.45 * tilesSize;
	shapeDefC.localPosition.Set(0, 0.35 * tilesSize);
	
	return [ shapeDefB, shapeDefC ];
};

m.Player.prototype.onKeyDown = function(e) {
	var codes = goog.events.KeyCodes;
	switch (e.event.keyCode) {
		case codes.DOWN:
			myButtons = this.getButtons();
			for ( var i=0; i<myButtons.length; i++){
				myButtons[i].trigger();
			}
			break;

		case codes.LEFT:
			this.leftPressed = true;
			//this.body.ApplyImpulse(new box2d.Vec2(0, -200), this.body.GetOriginPosition());
			break;
			
		case codes.RIGHT:
			this.rightPressed = true;
			//this.body.ApplyImpulse(new box2d.Vec2(0, -200), this.body.GetOriginPosition());
			break;
			
		case codes.UP:
			this.jump = true;
			break;
			
		case codes.F5:
			window.location.reload();
			break;
			
		default:
			return true;
	}
	return false;
};

m.Player.prototype.getButtons = function() {
	return m.Player.superClass_.getOverEntities.call(this, buttons, m.PlayerButton);
};

m.Player.prototype.onKeyUp = function(e) {
	var codes = goog.events.KeyCodes;
	switch (e.event.keyCode) {
		case codes.LEFT:
			this.leftPressed = false;
			break;
			
		case codes.RIGHT:
			this.rightPressed = false;
			break;
			
		case codes.UP:
			this.jump = false;
			break;
			
		default:
			return true;
	}
	return false;
}

m.Player.prototype.beforePhysics = function() {
	var vel = this.body.GetLinearVelocity();
	var max = 300;
	if (Math.abs(vel.x) > max) {
		vel.x = (vel.x > 0) ? max : -max;
		this.body.SetLinearVelocity(vel);
	}
	
	if (this.leftPressed) {
		this.body.ApplyImpulse(new box2d.Vec2(-50000, 0), this.body.GetOriginPosition());
	}
	
	if (this.rightPressed) {
		this.body.ApplyImpulse(new box2d.Vec2(50000, 0), this.body.GetOriginPosition());
	}
	
	var grounded = false;
	var contact = this.body.GetContactList();
	while (contact) {
		if (contact.contact.m_shape1 == this.shapes[0] || contact.contact.m_shape2 == this.shapes[0]) {
			grounded = true;
			break;
		}
		contact = contact.next;
	}
	
	if (grounded && !this.leftPressed && !this.rightPressed) {	
		vel.x *= 0.9;
		this.body.SetLinearVelocity(vel);
	}
	
	if (this.jump) {
		//this.jump = false;
		if (grounded) {
			vel.y = 0;
			this.body.SetLinearVelocity(vel);
			var pos = this.body.GetOriginPosition();
			pos.y -= 1;
			this.body.SetOriginPosition(pos, 0);
			this.body.ApplyImpulse(new box2d.Vec2(0, -1400000), pos);
		}
	}
}

m.Player.prototype.update = function(dt) {
	m.Player.superClass_.update.call(this, dt);
	
	this.t += dt;
	
	// Gather data
	var isWalking = Math.abs(this.body.GetLinearVelocity().x) > 50;
	var newAnimFrame;
	if (isWalking) {
		newAnimFrame = (this.t % 400 < 200) ? 0 : 2;
	}
	else {
		newAnimFrame = 0;
	}
	var newAnimDirection;
	if (isWalking) {
		newAnimDirection = (this.body.GetLinearVelocity().x > 0) ? 0 : 1;
	}
	else {
		newAnimDirection = this.animDirection;
	}
	
	// Update sprites frames if needed
	if (newAnimDirection != this.animDirection || newAnimFrame != this.animFrame) {
		this.anims.body.setFrame(newAnimFrame + newAnimDirection);
		this.anims.backHand.setFrame(newAnimDirection);
		this.anims.frontHand.setFrame(newAnimDirection);
		this.animFrame = newAnimFrame;
		this.animDirection = newAnimDirection;
	}
	
	// Arms movement
	var armsFrame = 0;
	if (!isWalking) {
		var tt = this.t % 1000;
		armsFrame = (tt < 500) ? (tt/200) : (5 - tt/200);
	}
	this.sprites.backHand.setPosition(0, armsFrame);
	this.sprites.frontHand.setPosition(-8 * this.animDirection + 4, armsFrame + 4);
	
};

m.Player.prototype.onMouseMove = function(e) {
	// Update hands position
	/*var dx = e.event.clientX - player.object.getPosition().x;
	var dy = e.event.clientY - player.object.getPosition().y;
	var adx = Math.abs(dx);
	var ady = Math.abs(dy);
	var d = Math.sqrt(adx*adx+ady*ady);
	var alpha = Math.acos(adx/d) * 180 / Math.PI;
	
	//if (this.leftPressed) {
		this.setHandRotation((this.animDirection == 0) ? this.sprites.backHand : this.sprites.frontHand, alpha);
	//}
	//if (this.rightPressed) {
		this.setHandRotation((this.animDirection == 0) ? this.sprites.frontHand : this.sprites.backHand, alpha);
	//}
	*/
};

m.Player.prototype.setHandRotation = function(hand, rotation) {
	hand.setRotation(rotation);
}
