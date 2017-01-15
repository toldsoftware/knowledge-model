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
//# sourceMappingURL=ajax.js.map