"use strict";
var knowledge_problems_1 = require("./../knowledge-problems");
function createSpellingProblem(word) {
    var comps = [];
    var key = word.map(function (x) { return x.letter; }).join('');
    for (var _i = 0, word_1 = word; _i < word_1.length; _i++) {
        var x = word_1[_i];
        comps.push(x.letter);
        comps.push(x.sound);
        comps.push(knowledge_problems_1.createRelationshipComponentName(x.letter, x.sound));
        comps.push(knowledge_problems_1.createRelationshipComponentName(x.letter, key));
        comps.push(knowledge_problems_1.createRelationshipComponentName(x.sound, key));
    }
    return {
        problem: { key: key, components: comps },
        componentNames: comps
    };
}
exports.createSpellingProblem = createSpellingProblem;
//# sourceMappingURL=spelling.js.map