"use strict";
function calculateOccurences(domain) {
    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
        var p = _a[_i];
        for (var _b = 0, _c = p.components; _b < _c.length; _b++) {
            var c = _c[_b];
            if (!domain.components[c]) {
                domain.components[c] = { name: c, occurences: 0, exclusives: {} };
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
            var cState = state[c];
            var cScore = 0;
            if (cState) {
                cScore = state[c].score;
            }
            // Add Difficulty for rare items
            var occurenceRatio = domain.components[c].occurences / domain.problems.length;
            inverseScores += (1 - cScore) * (10 / (occurenceRatio + 1));
        }
        p.userDifficulty = (0.0001 + inverseScores) * Math.log(Math.E + p.components.length);
    }
}
exports.calculateDifficulty = calculateDifficulty;
function calculatePriority(domain, state) {
    calculateValue(domain, state);
    calculateDifficulty(domain, state);
    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
        var p = _a[_i];
        p.userPriority = p.userDifficulty === 0 ? 0 : p.userValue / Math.pow(p.userDifficulty, 2);
    }
}
exports.calculatePriority = calculatePriority;
//# sourceMappingURL=knowledge-analysis.js.map