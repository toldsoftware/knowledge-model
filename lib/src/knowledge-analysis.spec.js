"use strict";
var _1 = require("./");
var spelling_1 = require("./problems/spelling");
function createDomain() {
    var domain = {
        components: {},
        problems: []
    };
    domain.problems.push(spelling_1.createSpellingProblem([
        { letters: 'b', sound: 'B' },
        { letters: 'a', sound: 'A' },
        { letters: 't', sound: 'T' }
    ]));
    domain.problems.push(spelling_1.createSpellingProblem([
        { letters: 'b', sound: 'B' },
        { letters: 'a', sound: 'A' },
        { letters: 'd', sound: 'D' }
    ]));
    domain.problems.push(spelling_1.createSpellingProblem([
        { letters: 'c', sound: 'K' },
        { letters: 'a', sound: 'A' },
        { letters: 't', sound: 'T' }
    ]));
    domain.problems.push(spelling_1.createSpellingProblem([
        { letters: 't', sound: 'T' },
        { letters: 'a', sound: 'A' },
        { letters: 'ck', sound: 'K' }
    ]));
    domain.problems.push(spelling_1.createSpellingProblem([
        { letters: 'd', sound: 'D' },
        { letters: 'o', sound: 'O' },
        { letters: 'g', sound: 'G' }
    ]));
    domain.components = _1.createComponentsFromProblems(domain.problems);
    return domain;
}
function logProblems(d) {
    var p = d.problems.map(function (x) { return x; });
    p.sort(function (a, b) { return b.userPriority - a.userPriority; });
    // console.log(p.map(x => (`${x.key} ${x.userPriority}=${x.userValue}/${x.userDifficulty}`)));
    console.log('Problems:');
    p.forEach(function (x) { return console.log((x.key + " " + Math.round(x.userPriority * 100) / 100 + " = " + Math.round(x.userValue * 100) / 100 + " / " + Math.round(x.userDifficulty * 100) / 100)); });
}
describe('calculatePriority', function () {
    var domain = createDomain();
    _1.calculatePriority(domain, {});
    logProblems(domain);
    it('should calculate occurence for all components', function () {
        for (var k in domain.components) {
            expect(domain.components[k].occurences).toBeGreaterThanOrEqual(1);
        }
    });
    it('should calculate difficulty for all problems', function () {
        domain.problems.forEach(function (x) { return expect(x.userDifficulty).toBeGreaterThan(1); });
    });
    it('should calculate value for all problems', function () {
        domain.problems.forEach(function (x) { return expect(x.userValue).toBeGreaterThan(1); });
    });
    it('should prioritize all problems', function () {
        domain.problems.forEach(function (x) { return expect(x.userPriority).toBeGreaterThanOrEqual(0); });
    });
});
describe('calculatePriority with problem knowledge', function () {
    var domain = createDomain();
    var pComponents = domain.problems[0].components;
    var pState = {};
    pComponents.forEach(function (x) {
        pState[x] = { right: 1, wrong: 0, score: 1 };
    });
    _1.calculatePriority(domain, pState);
    logProblems(domain);
    it('should make problem no value', function () {
        expect(domain.problems[0].userValue).toEqual(0);
    });
    it('should make problem no difficulty', function () {
        expect(domain.problems[0].userDifficulty).toEqual(0);
    });
    it('should make problem no priority', function () {
        expect(domain.problems[0].userPriority).toEqual(0);
    });
});
describe('calculatePriority with 2 problem knowledge', function () {
    var domain = createDomain();
    var pComponents = domain.problems[0].components.concat(domain.problems[1].components);
    var pState = {};
    pComponents.forEach(function (x) {
        pState[x] = { right: 1, wrong: 0, score: 1 };
    });
    _1.calculatePriority(domain, pState);
    logProblems(domain);
    it('should make both no value', function () {
        expect(domain.problems[0].userValue).toEqual(0);
        expect(domain.problems[1].userValue).toEqual(0);
    });
    it('should make both no difficulty', function () {
        expect(domain.problems[0].userDifficulty).toEqual(0);
        expect(domain.problems[1].userDifficulty).toEqual(0);
    });
    it('should make both no priority', function () {
        expect(domain.problems[0].userPriority).toEqual(0);
        expect(domain.problems[1].userPriority).toEqual(0);
    });
});
//# sourceMappingURL=knowledge-analysis.spec.js.map