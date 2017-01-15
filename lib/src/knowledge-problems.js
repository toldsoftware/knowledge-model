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
                comps[c] = { name: c, occurences: 0, exclusives: {} };
            }
        }
        for (var _c = 0, _d = p.exclusives; _c < _d.length; _c++) {
            var exclusive = _d[_c];
            var _loop_1 = function (item) {
                comps[item].exclusives[exclusive.type] = comps[item].exclusives[exclusive.type] || [];
                (_a = comps[item].exclusives[exclusive.type]).push.apply(_a, exclusive.items.filter(function (x) { return x !== item; }));
            };
            for (var _e = 0, _f = exclusive.items; _e < _f.length; _e++) {
                var item = _f[_e];
                _loop_1(item);
            }
        }
    }
    return comps;
    var _a;
}
exports.createComponentsFromProblems = createComponentsFromProblems;
//# sourceMappingURL=knowledge-problems.js.map