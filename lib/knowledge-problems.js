"use strict";
function createRelationshipComponentName(a, b) {
    if (b < a) {
        var c = a;
        a = b;
        b = c;
    }
    return a.replace(/~/g, '\\~') + '~' + b.replace(/~/g, '\\~');
}
exports.createRelationshipComponentName = createRelationshipComponentName;
function createComponentsFromProblems(problems) {
    var comps = {};
    for (var _i = 0, problems_1 = problems; _i < problems_1.length; _i++) {
        var p = problems_1[_i];
        for (var _a = 0, _b = p.components; _a < _b.length; _a++) {
            var c = _b[_a];
            if (!comps[c]) {
                comps[c] = { name: c };
            }
        }
    }
    return comps;
}
exports.createComponentsFromProblems = createComponentsFromProblems;
//# sourceMappingURL=knowledge-problems.js.map