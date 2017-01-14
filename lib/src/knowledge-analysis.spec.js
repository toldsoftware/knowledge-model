"use strict";
var _1 = require("./");
var spelling_1 = require("./problems/spelling");
describe('calculatePriority', function () {
    var domain = {
        components: {},
        problems: []
    };
    domain.problems.push(spelling_1.createSpellingProblem([
        { letter: 'c', sound: 'K' },
        { letter: 'a', sound: 'A' },
        { letter: 't', sound: 'T' }
    ]).problem);
    domain.problems.push(spelling_1.createSpellingProblem([
        { letter: 'd', sound: 'D' },
        { letter: 'o', sound: 'O' },
        { letter: 'g', sound: 'G' }
    ]).problem);
    domain.problems.push(spelling_1.createSpellingProblem([
        { letter: 't', sound: 'T' },
        { letter: 'a', sound: 'A' },
        { letter: 'ck', sound: 'K' }
    ]).problem);
    domain.problems.push(spelling_1.createSpellingProblem([
        { letter: 'b', sound: 'B' },
        { letter: 'a', sound: 'A' },
        { letter: 't', sound: 'T' }
    ]).problem);
    domain.problems.push(spelling_1.createSpellingProblem([
        { letter: 'b', sound: 'B' },
        { letter: 'a', sound: 'A' },
        { letter: 'd', sound: 'D' }
    ]).problem);
    domain.components = _1.createComponentsFromProblems(domain.problems);
    _1.calculatePriority(domain, {});
    it('should prioritize all problems', function () {
        domain.problems.forEach(function (x) { return expect(x.userPriority).toBeGreaterThanOrEqual(0) && expect(x.userPriority).toBeLessThanOrEqual(1); });
    });
});
//# sourceMappingURL=knowledge-analysis.spec.js.map