export interface XHR {
    setRequestHeader(header: string, value: string): void;
    getResponseHeader(header: string): string;
}

export interface AjaxSettings {
    url: string;
    type: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD';
    data?: string;
    beforeSend?(xhr: XHR): void;
    success?(data: string, textStatus: string, xhr: XHR): void;
    error?(xhr: XHR, textStatus: string, errorThrown: string): void;
    complete?(): void;
}

// Vanilla Ajax Requests
// From: http://stackoverflow.com/a/18078705/567524

export class Ajax {

    private createXhr() {
        if (typeof XMLHttpRequest !== 'undefined') {
            return new XMLHttpRequest();
        }
        let versions = [
            'MSXML2.XmlHttp.6.0',
            'MSXML2.XmlHttp.5.0',
            'MSXML2.XmlHttp.4.0',
            'MSXML2.XmlHttp.3.0',
            'MSXML2.XmlHttp.2.0',
            'Microsoft.XmlHttp'
        ];

        for (let i = 0; i < versions.length; i++) {
            try {
                return new ActiveXObject(versions[i]);
            } catch (e) {
            }
        }
    }

    get(url: string, onSuccess: (response: string) => void, onFail: (error: string) => void) {
        this.ajax({
            url: url,
            type: 'GET',
            success: onSuccess,
            error: (xhr, errorStatus, information) => onFail(errorStatus + ':' + information)
        });
    };

    ajax(settings: AjaxSettings) {
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

        settings.success = settings.success || (() => { });
        settings.error = settings.error || (() => { });
        settings.complete = settings.complete || (() => { });
        settings.beforeSend = settings.beforeSend || (() => { });

        let xhr = this.createXhr();

        let hasCompleted = false;
        setTimeout(() => {
            if (!hasCompleted) {
                settings.error(xhr, 'Timed Out', '');
            }
        }, 30 * 1000);

        let url = settings.url;
        let method = settings.type || 'GET';

        xhr.open(method, url, true);
        // xhr.withCredentials = true;

        xhr.onerror = function (err: any) {
            settings.error(xhr, '' + xhr.status, '' + err);
        };

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                hasCompleted = true;

                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        settings.success(xhr.responseText, '' + xhr.status, xhr);
                    } catch (err) { console.log('ERROR in success handler', err); }
                } else {
                    try {
                        settings.error(xhr, '' + xhr.status, '');
                    } catch (err) { console.log('ERROR in error handler', err); }
                }
                try {
                    settings.complete();
                } catch (err) { console.log('ERROR in complete handler', err); }
            }
        };

        settings.beforeSend(xhr);
        xhr.send(settings.data);
    }

}