"use strict";
function calculateOccurences(domain) {
    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
        var p = _a[_i];
        for (var _b = 0, _c = p.components; _b < _c.length; _b++) {
            var c = _c[_b];
            if (!domain.components[c]) {
                domain.components[c] = { name: c };
            }
            domain.components[c].occurences++;
        }
    }
}
exports.calculateOccurences = calculateOccurences;
function calculateValue(domain, state) {
    calculateOccurences(domain);
    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
        var p = _a[_i];
        var value = 0;
        for (var _b = 0, _c = p.components; _b < _c.length; _b++) {
            var c = _c[_b];
            var cScore = !state[c] ? 0 : state[c].score;
            value += (1 - cScore) * Math.log(Math.E + domain.components[c].occurences);
        }
        p.userValue = value;
    }
}
exports.calculateValue = calculateValue;
function calculateDifficulty(domain, state) {
    calculateOccurences(domain);
    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
        var p = _a[_i];
        var inverseScores = 0;
        for (var _b = 0, _c = p.components; _b < _c.length; _b++) {
            var c = _c[_b];
            var cScore = !state[c] ? 0 : state[c].score;
            inverseScores += 1 - cScore;
        }
        p.userDifficulty = inverseScores / p.components.length * Math.log(Math.E + p.components.length);
    }
}
exports.calculateDifficulty = calculateDifficulty;
function calculatePriority(domain, state) {
    calculateValue(domain, state);
    calculateDifficulty(domain, state);
    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
        var p = _a[_i];
        p.userPriority = p.userValue / p.userDifficulty;
    }
}
exports.calculatePriority = calculatePriority;
//# sourceMappingURL=knowledge-analysis.js.map