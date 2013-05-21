/**
    @module "ui/translation-view.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component;

/**
    Description TODO
    @class module:"ui/translation-view.reel".TranslationView
    @extends module:montage/ui/component.Component
*/
exports.TranslationView = Montage.create(Component, /** @lends module:"ui/translation-view.reel".TranslationView# */ {
    
    translation: {
        value: null
    },

    didCreate: {
        value: function() {

        }
    },

    draw: {
        value: function() {
            
        }
    }

});
