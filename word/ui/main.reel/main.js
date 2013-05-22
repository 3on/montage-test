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

    wordInput : {
        value: null
    },

    translationSelect : {
        value: null
    },

    translationList: {
        serializable: false,
        value: null
    },

    placeholderFn: {
        get: function(e) {
            var el = document.getElementById('wordInput');
            if (!el) {
                console.log('fail')
                return "Fail";
            }
            var ph = el.dataset["placeholder-enfr"]
            return "truc"
        },
        set: function(e) {
            console.log("SET", e);
            return e;
        }
    },

    didCreate: {
        value: function() {
            this.translationListController = ArrayController.create();
            window.__hack = this; // for jsonp callback
        }
    },

    prepareForDraw: {
        value: function(e) {
            this.wordForm.identifier = "wordForm";
            this.wordForm.addEventListener("submit", this, false);

            this.handleTranslationSelectChange(undefined);
            var self = this;
            this.translationSelect.addEventListener("change", function(e){
                self.handleTranslationSelectChange(e);
            }, false); // FIXME
        }
    },

    handleTranslationSelectChange: {
        value: function(e) {
            var trans = this.translationSelect.value;
            var elem = this.wordInput;
            elem.placeholder = elem.dataset[trans];
        }
    },

    handleWordFormSubmit: {
        value: function(e) {
            e.preventDefault();
            var word = this.wordInput.value.trim();
            var translation = this.translationSelect.value;

            this.wordInput.value = null;
            // adding a spinner here would be nice

            // http://api.wordreference.com/76d0e/json/enfr/word?callback=jsonp
            var jsonp = document.createElement("script");
            jsonp.src = "http://api.wordreference.com/76d0e/json/" + translation + "/" + word + "?callback=jsonpCallback";
            jsonp.dataset.jsonp = (new Date()).getTime();
            document.body.appendChild(jsonp);
        }
    },

    addTranslation: {
        value: function(term, sense, pos) {
            var n = Translation.create().initWithTermSenceAndPartOfSpeech(term, sense, pos);
            this.translationListController.addObjects(n);
            return n;
        }
    },

    dropController: {
        value: function() {
            this.translationListController = ArrayController.create();
        }
    }

});

window.jsonpCallback = function(data) {
    __hack.dropController();
    for (var i in data.term0.PrincipalTranslations) {
        var translations = data.term0.PrincipalTranslations[i];
        var wantedKeys = {"FirstTranslation": 1, "SecondTranslation":1, "ThirdTranslation":1, "FourthTranslation": 1};
        for (var key in translations) {
            if (key in wantedKeys) {
                var t = translations[key];
                __hack.addTranslation(t["term"], t["sense"], t["POS"]);
            }
        }
    }
    // clean the DOM
    document.body.removeChild(document.querySelector("script[data-jsonp]"));
}

