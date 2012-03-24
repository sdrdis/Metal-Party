//set main namespace
//goog.provide('metalparty');

//get requirements
goog.require('lime.Director');
goog.require('lime.Scene');
goog.require('lime.Layer');
goog.require('lime.Circle');
goog.require('lime.Label');

goog.require('lime.parser.TMX');

var tmx = new lime.parser.TMX('resources/area02.tmx');

//this is required for outside access after code is compiled in ADVANCED_COMPILATIONS mode
goog.exportSymbol('tmx', tmx);
