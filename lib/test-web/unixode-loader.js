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
//# sourceMappingURL=unixode-loader.js.map