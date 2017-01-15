"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var _1 = require("./../src/");
var spelling_1 = require("./../src/problems/spelling");
var ajax_1 = require("./ajax");
var unixode_loader_1 = require("./unixode-loader");
var domain = null;
var state = null;
var host = null;
window['__debug'] = function () { return ({
    domain: domain, state: state, host: host,
    getProblems: function (key) {
        return domain.problems.filter(function (x) { return x.key.toUpperCase() === key.toUpperCase(); })
            .map(function (x) { return (__assign({}, x, { componentsObjects: x.components.map(function (c) { return domain.components[c]; }) })); });
    }
}); };
function setup() {
    var input = document.createElement('input');
    document.body.appendChild(input);
    input.type = 'text';
    input.onchange = function () { return addProblem(input.value); };
    host = document.createElement('div');
    document.body.appendChild(host);
    var ajax = new ajax_1.Ajax();
    ajax.get('/Words_UniXode_Kids.txt', function (r) {
        // ajax.get('/Words_UniXode.txt', r => {
        var result = unixode_loader_1.loadUnixode(r);
        var words = result.words.map(function (x) { return x.pairs.map(function (x2) { return ({ letters: x2.english, sound: x2.xharish }); }); });
        var problems = words.map(function (x) { return spelling_1.createSpellingProblem(x); });
        var comps = _1.createComponentsFromProblems(problems);
        domain = { components: comps, problems: problems };
        state = {};
        showPriority();
    }, function (err) { return console.warn(err); });
}
function showPriority() {
    _1.calculatePriority(domain, state);
    var html = '';
    var p = domain.problems.map(function (x) { return x; });
    p.sort(function (a, b) { return b.userPriority - a.userPriority; });
    p.forEach(function (x) { return html += '<br>' + (x.key + " " + Math.round(x.userPriority * 100) / 100 + " = " + Math.round(x.userValue * 100) / 100 + " / " + Math.round(x.userDifficulty * 100) / 100); });
    host.innerHTML = html;
}
function addProblem(key) {
    console.log('addProblem', key, state);
    key = key.toUpperCase();
    var p = domain.problems.filter(function (x) { return x.key === key; });
    p.sort(function (a, b) { return b.userPriority - a.userPriority; });
    if (p[0]) {
        p[0].components.forEach(function (x) {
            var c = domain.components[x];
            var s = state[x];
            if (!s) {
                s = state[x] = { right: 0, wrong: 0, score: 0 };
            }
            s.right++;
            s.score = s.score * 0.5 + 0.5;
            if (s.score >= 0.75 && s.wrong === 0) {
                s.score = 1;
            }
        });
    }
    showPriority();
}
setup();
//# sourceMappingURL=test.js.map