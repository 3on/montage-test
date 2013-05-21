/**
    @module "ui/main.reel"
    @requires montage
    @requires montage/ui/component
*/
var Montage = require("montage").Montage,
    Component = require("montage/ui/component").Component,
    ArrayController = require("montage/ui/controller/array-controller").ArrayController,
    Translation = require("../../core/translation.js").Translation;

/**
    Description TODO
    @class module:"ui/main.reel".Main
    @extends module:ui/component.Component
*/
exports.Main = Montage.create(Component, /** @lends module:"ui/main.reel".Main# */ {
    wordForm : {
        value: null
    },

    translationSelect : {
        value: null
    },

    wordInput : {
        value: null
    },

    translationList: {
        serializable: false,
        value: null
    },

    didCreate: {
        value: function() {
            this.translationListController = ArrayController.create();
            window.__hack = this;
        }
    },

    prepareForDraw: {
        value: function() {
            this.wordForm.identifier = "wordForm";
            this.wordForm.addEventListener("submit", this, false);
        }
    },

    handleWordFormSubmit: {
        value: function(e) {
            e.preventDefault();
            var word = this.wordInput.value.trim();
            var translation = this.translationSelect.value;

            // http://api.wordreference.com/76d0e/json/enfr/word?callback=jsonp
            var jsonp = document.createElement("script");
            jsonp.src = "http://api.wordreference.com/76d0e/json/" + translation + "/" + word + "?callback=jsonpCallback";
            jsonp.dataset.jsonp = (new Date()).getTime();
            document.body.appendChild(jsonp);
            //this.addTranslation('test', 'test', 'nm');

            this.wordInput.value = null;
        }
    },

    addTranslation: {
        value: function(term, sense, pos) {
            var n = Translation.create().initWithTermSenceAndPartOfSpeech(term, sense, pos);
            this.translationListController.addObjects(n);
            return n;
        }
    }

});

window.jsonpCallback = function(data) {
    console.log(data);
    console.log(exports.Main);
    for (var i in data.term0.PrincipalTranslations) {
        var translations = data.term0.PrincipalTranslations[i];
        var wantedKeys = {"FirstTranslation": 1, "SecondTranslation":1, "ThirdTranslation":1, "FourthTranslation": 1};
        for (var key in translations) {
            if (key in wantedKeys) {
                var t = translations[key];
                __hack.addTranslation.call(__hack, t["term"], t["sense"], t["POS"]);
            }
        }
    }

    document.body.removeChild(document.querySelector("script[data-jsonp]"));
}

