/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __assign = (this && this.__assign) || Object.assign || function(t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	        s = arguments[i];
	        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	            t[p] = s[p];
	    }
	    return t;
	};
	var _1 = __webpack_require__(5);
	var spelling_1 = __webpack_require__(3);
	var ajax_1 = __webpack_require__(1);
	var unixode_loader_1 = __webpack_require__(2);
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
	        var problems = words.map(function (x) { return spelling_1.createSpellingProblem(x); }).map(function (x) { return x.problem; });
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


/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";
	// Vanilla Ajax Requests
	// From: http://stackoverflow.com/a/18078705/567524
	var Ajax = (function () {
	    function Ajax() {
	    }
	    Ajax.prototype.createXhr = function () {
	        if (typeof XMLHttpRequest !== 'undefined') {
	            return new XMLHttpRequest();
	        }
	        var versions = [
	            'MSXML2.XmlHttp.6.0',
	            'MSXML2.XmlHttp.5.0',
	            'MSXML2.XmlHttp.4.0',
	            'MSXML2.XmlHttp.3.0',
	            'MSXML2.XmlHttp.2.0',
	            'Microsoft.XmlHttp'
	        ];
	        for (var i = 0; i < versions.length; i++) {
	            try {
	                return new ActiveXObject(versions[i]);
	            }
	            catch (e) {
	            }
	        }
	    };
	    Ajax.prototype.get = function (url, onSuccess, onFail) {
	        this.ajax({
	            url: url,
	            type: 'GET',
	            success: onSuccess,
	            error: function (xhr, errorStatus, information) { return onFail(errorStatus + ':' + information); }
	        });
	    };
	    ;
	    Ajax.prototype.ajax = function (settings) {
	        // settings.beforeSend
	        // settings.complete
	        // settings.contentType
	        // settings.data
	        // settings.dataType - No Processing Done Null or Text only
	        // settings.error
	        // settings.processData - Always false
	        // settings.success
	        // settings.type
	        // settings.url
	        settings.success = settings.success || (function () { });
	        settings.error = settings.error || (function () { });
	        settings.complete = settings.complete || (function () { });
	        settings.beforeSend = settings.beforeSend || (function () { });
	        var xhr = this.createXhr();
	        var hasCompleted = false;
	        setTimeout(function () {
	            if (!hasCompleted) {
	                settings.error(xhr, 'Timed Out', '');
	            }
	        }, 30 * 1000);
	        var url = settings.url;
	        var method = settings.type || 'GET';
	        xhr.open(method, url, true);
	        // xhr.withCredentials = true;
	        xhr.onerror = function (err) {
	            settings.error(xhr, '' + xhr.status, '' + err);
	        };
	        xhr.onreadystatechange = function () {
	            if (xhr.readyState === 4) {
	                hasCompleted = true;
	                if (xhr.status >= 200 && xhr.status < 300) {
	                    try {
	                        settings.success(xhr.responseText, '' + xhr.status, xhr);
	                    }
	                    catch (err) {
	                        console.log('ERROR in success handler', err);
	                    }
	                }
	                else {
	                    try {
	                        settings.error(xhr, '' + xhr.status, '');
	                    }
	                    catch (err) {
	                        console.log('ERROR in error handler', err);
	                    }
	                }
	                try {
	                    settings.complete();
	                }
	                catch (err) {
	                    console.log('ERROR in complete handler', err);
	                }
	            }
	        };
	        settings.beforeSend(xhr);
	        xhr.send(settings.data);
	    };
	    return Ajax;
	}());
	exports.Ajax = Ajax;


/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	function loadUnixode(document) {
	    var parts = document.split('### WORDS:');
	    var mappings = parts[0].split('\n').filter(function (x) { return x.trim().length > 0; }).map(function (x) {
	        var partsA = x.split(':');
	        var partsB = partsA[1].split('=');
	        var unixode = partsA[0];
	        var english = partsB[0];
	        var xharish = partsB[1];
	        return {
	            unixode: unixode,
	            english: english,
	            xharish: xharish,
	        };
	    });
	    var lookup = {};
	    mappings.forEach(function (x2) { return lookup[x2.unixode] = x2; });
	    var words = parts[1].split('\n').filter(function (x) { return x.trim().length > 0; }).map(function (x) {
	        var lookups = x.split('').filter(function (x2) { return x2.trim().length > 0; }).map(function (x2) { return lookup[x2]; });
	        return {
	            unixode: x,
	            pairs: x.split('').map(function (x2) { return ({
	                english: lookup[x2] ? lookup[x2].english : '',
	                xharish: lookup[x2] ? lookup[x2].xharish : ''
	            }); }).filter(function (x2) { return x2.english !== '' || x2.xharish !== ''; }),
	            english: lookups.map(function (x2) { return x2.english; }).join(''),
	            xharish: lookups.map(function (x2) { return x2.xharish; }).join(''),
	        };
	    });
	    return {
	        mappings: mappings,
	        words: words
	    };
	}
	exports.loadUnixode = loadUnixode;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var knowledge_problems_1 = __webpack_require__(4);
	function createSpellingProblem(word) {
	    var comps = [];
	    var key = word.map(function (x) { return x.letters; }).join('');
	    for (var _i = 0, word_1 = word; _i < word_1.length; _i++) {
	        var x = word_1[_i];
	        var letters = 'l:' + x.letters;
	        var sound = 's:' + x.sound;
	        comps.push(letters);
	        comps.push(sound);
	        comps.push(knowledge_problems_1.createRelationshipComponentName(letters, sound));
	        comps.push(knowledge_problems_1.createRelationshipComponentName(letters, key));
	        comps.push(knowledge_problems_1.createRelationshipComponentName(sound, key));
	        comps.push(knowledge_problems_1.createRelationshipComponentName(sound, '(hear)'));
	        x.letters.split('').forEach(function (c) { return comps.push(knowledge_problems_1.createRelationshipComponentName('l:' + c, '(type)')); });
	        if (x.letters.length > 0) {
	            x.letters.split('').forEach(function (c) { return comps.push(knowledge_problems_1.createRelationshipComponentName('l:' + c, '(read)')); });
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
	        problem: { key: key, components: comps },
	        componentNames: comps
	    };
	}
	exports.createSpellingProblem = createSpellingProblem;


/***/ },
/* 4 */
/***/ function(module, exports) {

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
	                comps[c] = { name: c, occurences: 0 };
	            }
	        }
	    }
	    return comps;
	}
	exports.createComponentsFromProblems = createComponentsFromProblems;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(4));
	__export(__webpack_require__(6));


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	function calculateOccurences(domain) {
	    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
	        var p = _a[_i];
	        for (var _b = 0, _c = p.components; _b < _c.length; _b++) {
	            var c = _c[_b];
	            if (!domain.components[c]) {
	                domain.components[c] = { name: c, occurences: 0 };
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
	        p.userDifficulty = inverseScores * Math.log(Math.E + p.components.length);
	    }
	}
	exports.calculateDifficulty = calculateDifficulty;
	function calculatePriority(domain, state) {
	    calculateValue(domain, state);
	    calculateDifficulty(domain, state);
	    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
	        var p = _a[_i];
	        p.userPriority = p.userDifficulty === 0 ? 0 : p.userValue / p.userDifficulty;
	    }
	}
	exports.calculatePriority = calculatePriority;


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map