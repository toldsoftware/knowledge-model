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
	var _1 = __webpack_require__(1);
	var spelling_1 = __webpack_require__(5);
	var ajax_1 = __webpack_require__(6);
	var unixode_loader_1 = __webpack_require__(7);
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
	        setTimeout(function () {
	            // ajax.get('/Words_UniXode.txt', r => {
	            var result = unixode_loader_1.loadUnixode(r);
	            var words = result.words.map(function (x) { return x.pairs.map(function (x2) { return ({ letters: x2.english, sound: x2.xharish }); }); });
	            var problems = words.map(function (x) { return spelling_1.createSpellingProblem(x); });
	            var comps = _1.createComponentsFromProblems(problems);
	            // let excComps = [] as any;
	            // for (let k in comps) {
	            //     if (Object.getOwnPropertyNames(comps[k].exclusives).length === 0) { continue; }
	            //     excComps.push(comps[k]);
	            // }
	            // console.log(excComps);
	            console.log(problems.filter(function (x) { return x.conflict > 0; }));
	            domain = { components: comps, problems: problems, hasCalculatedConflict: false, hasCalculatedOccurences: false };
	            state = {};
	            showPriority();
	        });
	    }, function (err) { return console.warn(err); });
	}
	function showPriority() {
	    _1.calculatePriority(domain, state);
	    var html = '';
	    var p = domain.problems.map(function (x) { return x; });
	    p.sort(function (a, b) { return b.userPriority - a.userPriority; });
	    p.forEach(function (x) { return html += '<br>' + (x.key + " " + Math.round(x.userPriority * 100) / 100 + " = " + Math.round(x.userValue * 100) / 100 + " / " + Math.round(x.userDifficulty * 100) / 100 + " / " + Math.round(x.conflict * 100) / 100); });
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
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(2));
	__export(__webpack_require__(3));


/***/ },
/* 2 */
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
	                comps[c] = { name: c, occurences: 0, exclusives: {}, conflict: 0 };
	            }
	        }
	        var _loop_1 = function (exclusive) {
	            var exc = {};
	            var _loop_2 = function (item) {
	                if (exc[item]) {
	                    return "continue";
	                }
	                exc[item] = true;
	                comps[item].exclusives[exclusive.type] = comps[item].exclusives[exclusive.type] || {};
	                exclusive.items.filter(function (x) { return x !== item; }).forEach(function (x) { return comps[item].exclusives[exclusive.type][x] = comps[x]; });
	            };
	            for (var _i = 0, _a = exclusive.items; _i < _a.length; _i++) {
	                var item = _a[_i];
	                _loop_2(item);
	            }
	        };
	        for (var _c = 0, _d = p.exclusives; _c < _d.length; _c++) {
	            var exclusive = _d[_c];
	            _loop_1(exclusive);
	        }
	    }
	    return comps;
	}
	exports.createComponentsFromProblems = createComponentsFromProblems;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var utils_1 = __webpack_require__(4);
	function calculateOccurences(domain) {
	    if (domain.hasCalculatedOccurences) {
	        return;
	    }
	    domain.hasCalculatedOccurences = true;
	    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
	        var p = _a[_i];
	        for (var _b = 0, _c = p.components; _b < _c.length; _b++) {
	            var c = _c[_b];
	            if (!domain.components[c]) {
	                domain.components[c] = { name: c, occurences: 0, exclusives: {}, conflict: 0 };
	            }
	            domain.components[c].occurences++;
	        }
	    }
	}
	exports.calculateOccurences = calculateOccurences;
	function calculateConflict(domain) {
	    if (domain.hasCalculatedConflict) {
	        return;
	    }
	    domain.hasCalculatedConflict = true;
	    calculateOccurences(domain);
	    var _loop_1 = function (p) {
	        var compInsideRatios = [];
	        var ratiosDebug = [];
	        var _loop_2 = function (c) {
	            var comp = domain.components[c];
	            utils_1.forprops(comp.exclusives, function (x) {
	                var othersInProblem = [];
	                var othersNotInProblem = [];
	                utils_1.forprops(x, function (o) {
	                    var isInProblem = p.components.indexOf(o.name) >= 0;
	                    if (isInProblem) {
	                        othersInProblem.push(o);
	                    }
	                    else {
	                        othersNotInProblem.push(o);
	                    }
	                });
	                var inProblemOccurences = othersInProblem.reduce(function (out, o) { return out += o.occurences; }, 0);
	                var outProblemOccurences = othersNotInProblem.reduce(function (out, o) { return out += o.occurences; }, 0);
	                if (othersInProblem.length > 1) {
	                    var minInProblemOccurences = othersInProblem.reduce(function (out, o) { return out < o.occurences ? out : o.occurences; }, 1000000000);
	                    compInsideRatios.push(Math.pow(minInProblemOccurences / (inProblemOccurences + outProblemOccurences), othersInProblem.length));
	                }
	                else {
	                    compInsideRatios.push(inProblemOccurences / (inProblemOccurences + outProblemOccurences));
	                }
	                ratiosDebug.push({ comp: comp, exclusive: x, ratio: compInsideRatios[compInsideRatios.length - 1] });
	            });
	        };
	        for (var _i = 0, _a = p.components; _i < _a.length; _i++) {
	            var c = _a[_i];
	            _loop_2(c);
	        }
	        p.conflict = -Math.log(compInsideRatios.reduce(function (out, r) { return out *= r; }, 1));
	    };
	    // for (let k in domain.components) {
	    //     let c = domain.components[k];
	    //     let totalUniquenessDeviationRatios = 0;
	    //     let typeCount = 0;
	    //     for (let exk in c.exclusives) {
	    //         let ex = c.exclusives[exk];
	    //         let occurences = [];
	    //         for (let ok in ex) {
	    //             let o = ex[ok];
	    //             occurences.push(o.occurences);
	    //         }
	    //         if (occurences.length === 1) { continue; }
	    //         let stats = calculateStats(occurences);
	    //         totalUniquenessDeviationRatios += stats.stdDeviation / stats.range;
	    //         typeCount++;
	    //     }
	    //     c.conflict = typeCount === 0 ? 0 : 1 - totalUniquenessDeviationRatios / typeCount;
	    //     if (c.conflict <= 0 && typeCount > 0) {
	    //         let breakdance = true;
	    //     }
	    // }
	    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
	        var p = _a[_i];
	        _loop_1(p);
	    }
	}
	exports.calculateConflict = calculateConflict;
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
	    calculateConflict(domain);
	    for (var _i = 0, _a = domain.problems; _i < _a.length; _i++) {
	        var p = _a[_i];
	        p.userPriority = p.userDifficulty === 0 ? 0 : Math.log(1 + (p.userValue / Math.pow((1 + p.userDifficulty), 1.5) / (0.01 + p.conflict)));
	    }
	}
	exports.calculatePriority = calculatePriority;


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	function forprops(obj, callback) {
	    for (var k in obj) {
	        callback(obj[k], k);
	    }
	}
	exports.forprops = forprops;


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var knowledge_problems_1 = __webpack_require__(2);
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
	        // exclusives.push({ type: 'wordLetters_sound', items: [comps[comps.length - 1], sound] });
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
	        exclusives: exclusives,
	        conflict: 0
	    };
	}
	exports.createSpellingProblem = createSpellingProblem;


/***/ },
/* 6 */
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
/* 7 */
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


/***/ }
/******/ ]);
//# sourceMappingURL=test.js.map