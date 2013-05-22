var Montage = require("montage").Montage;

exports.Translation = Montage.create(Montage, {
    initWithTermSenceAndPartOfSpeech: {
        value: function(term, sense, partOfSpeech) {
            this.term = term;
            this.sense = sense;
            this.partOfSpeech = partOfSpeech;
            return this;
        }
    },

    term: {
        value: null
    },

    sense: {
        value: null
    },

    partOfSpeech: {
        value: null
    }

});