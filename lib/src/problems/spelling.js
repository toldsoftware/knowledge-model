"use strict";
var knowledge_problems_1 = require("./../knowledge-problems");
function createSpellingProblem(wordPairs) {
    var comps = [];
    var exclusives = [];
    var wordEnglish = wordPairs.map(function (x) { return x.letters; }).join('');
    for (var _i = 0, wordPairs_1 = wordPairs; _i < wordPairs_1.length; _i++) {
        var pair = wordPairs_1[_i];
        var letters = 'l:' + pair.letters;
        var sound = 's:' + pair.sound;
        comps.push(letters);
        comps.push(sound);
        exclusives.push({ type: 'letters_sound', items: [letters, sound] });
        comps.push(knowledge_problems_1.createRelationshipComponentName(letters, sound));
        comps.push(knowledge_problems_1.createRelationshipComponentName(letters, wordEnglish));
        exclusives.push({ type: 'wordLetters_sound', items: [comps[comps.length - 1], sound] });
        comps.push(knowledge_problems_1.createRelationshipComponentName(sound, wordEnglish));
        comps.push(knowledge_problems_1.createRelationshipComponentName(sound, '(hear)'));
        pair.letters.split('').forEach(function (c) { return comps.push(knowledge_problems_1.createRelationshipComponentName('l:' + c, '(type)')); });
        if (pair.letters.length > 0) {
            pair.letters.split('').forEach(function (c) { return comps.push(knowledge_problems_1.createRelationshipComponentName('l:' + c, '(read)')); });
        }
        comps.push(knowledge_problems_1.createRelationshipComponentName(letters, '(read)'));
    }
    var keys = {};
    comps = comps.filter(function (x) {
        if (keys[x]) {
            return false;
        }
        keys[x] = true;
        return true;
    });
    return {
        key: wordEnglish,
        components: comps,
        exclusives: exclusives
    };
}
exports.createSpellingProblem = createSpellingProblem;
//# sourceMappingURL=spelling.js.map