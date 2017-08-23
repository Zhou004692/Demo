;(function(win, lib) {
    var Promise = win.Promise;
    var doc = win.document;
    var ua = win.navigator.userAgent;
    var isWin = (/Windows\sPhone\s(?:OS\s)?[\d\.]+/i).test(ua) || (/Windows\sNT\s[\d\.]+/i).test(ua);
    var isWinWV = isWin && win['WindVane_Win_Private'] && win['WindVane_Win_Private'].call;
    var isIOS = (/iPhone|iPad|iPod/i).test(ua);
    var isAndroid = (/Android/i).test(ua);
    var wvVersion = ua.match(/WindVane[\/\s](\d+[._]\d+[._]\d+)/);
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var WindVane = lib.windvane = win.WindVane || (win.WindVane = {});
    var sidBase = Math.floor(Math.random() * (1 << 16)), inc = 1, iframePool = [], iframeLimit = 3;

    var LOCAL_PROTOCOL = 'hybrid';
    var WV_PROTOCOL = 'wv_hybrid';
    var IFRAME_PREFIX = 'iframe_';
    var PARAM_PREFIX = 'param_';
    var CALL_GC_TIME = 60 * 1000 * 10;
    var PARAM_GC_TIME = 60 * 1000;

    function compareVersion(v1, v2) {
        v1 = v1.toString().split('.');
        v2 = v2.toString().split('.');

        for(var i = 0; i < v1.length || i < v2.length; i++) {
            var n1 = parseInt(v1[i],10),  n2 = parseInt(v2[i],10);

            if(window.isNaN(n1)) {
                n1 = 0;
            }
            if(window.isNaN(n2)) {
                n2 = 0;
            }
            if( n1 < n2 ) {
                return -1;
            }
            else if( n1 > n2) {
                return 1;
            }
        }
        return 0;
    }

    if (wvVersion) {
        wvVersion = (wvVersion[1] || '0.0.0').replace(/\_/g, '.');
    } else {
        wvVersion = '0.0.0';
    }

    /**
     * @namespace  lib
     */

    /**
     * @namespace windvane
     * @memberOf lib
     */

    var WV_Core = {
        isAvailable: compareVersion(wvVersion, '0') === 1,

        /**
         * @method  call
         * @memberOf lib.windvane
         * @param  {String} obj       瑕佽皟鐢ㄧ殑瀹㈡埛绔被鍚�
         * @param  {String} method    瑕佽皟鐢ㄧ殑瀹㈡埛绔柟娉曞悕
         * @param  {Object} params    瑕佷紶閫掔粰瀹㈡埛绔殑鍙傛暟
         * @param  {Function} [success] 鎵ц鎴愬姛鍚庣殑鍥炶皟
         * @param  {Function} [failure] 鎵ц澶辫触鍚庣殑鍥炶皟
         * @param  {Number} [timeout]   鎵ц瓒呮椂锛岃秴鏃跺悗鑷姩浠� {ret:['HY_TIMEOUT']}
         * @return {Promise}          濡傛灉褰撳墠杩愯鐜鏀寔Promise锛屽垯杩斿洖涓€涓狿romise瀹炰緥銆�
         */
        call: function(obj, method, params, success, failure, timeout) {
            var sid, promise;

            if (typeof arguments[arguments.length - 1] === 'number') {
                timeout = arguments[arguments.length - 1];
            }

            if (typeof success !== 'function') {
                success = null;
            }

            if (typeof failure !== 'function') {
                failure = null;
            }

            if (Promise && !success && !failure) {
                promise = new Promise(function(resolve, reject) {
                    success = function(data) {
                        resolve(data);
                    }
                    failure = function(data) {
                        reject(data);
                    }
                });
            }

            if (win.__windvane__ && win.__windvane__.call) {
                win.__windvane__.call(obj + '.' + method, params, success, failure, timeout);
                return promise;
            }

            sid = WV_Private.getSid();
            var callInfo = {
                success: success,
                failure: failure,
            };
            if (timeout > 0) {
                callInfo.timeout = setTimeout(function() {
                    WV_Core.onFailure(sid, {ret:'HY_TIMEOUT'});
                }, timeout);
            }

            WV_Private.registerCall(sid, callInfo);
            WV_Private.registerGC(sid, timeout);
            if (!WV_Core.isAvailable) {
                WV_Core.onFailure(sid, {ret:'HY_NOT_IN_WINDVANE'});
            }
            else {
                WV_Private.callMethod(obj, method, params, sid);
            }

            return promise;
        },

        fireEvent: function(eventname, eventdata, sid) {
            // 褰搉ative闇€瑕侀€氱煡js鐨勬椂鍊欙紙閫氫俊锛夛紝鐢ㄨЕ鍙戜簨浠剁殑鏂瑰紡杩涜
            var ev = doc.createEvent('HTMLEvents');
            ev.initEvent(eventname, false, true);
            ev.param = WV_Private.parseData(eventdata);

            doc.dispatchEvent(ev);
        },

        getParam: function(sid) {
            return WV_Private.getParam(sid);
        },

        setData: function(sid, chunk) {},

        find: function (reqId, keepAlive) {
            if (!keepAlive) {
                WV_Private.unregisterCall(reqId, false);
            }
        },
        onSuccess: function(sid, data, keepAlive) {
            // native浠ｇ爜澶勭悊鎴愬姛鍚庯紝璋冪敤璇ユ柟娉曟潵閫氱煡js
            WV_Private.onComplete(sid, data, 'success', keepAlive);
        },

        onFailure: function(sid, data) {
            // native浠ｇ爜澶勭悊澶辫触鍚庯紝璋冪敤璇ユ柟娉曟潵閫氱煡js
            WV_Private.onComplete(sid, data, 'failure');
        }
    };

    var WV_Private = {
        params: {},
        calls: {},

        getSid: function() {
            // iOS 10.3 鍚庣鍙ｅ彿涓嶈兘瓒呰繃 65536銆�
            return ((sidBase + inc++) % 65536) + '';
        },

        buildParam: function(obj) {
            if (obj && typeof obj === 'object') {
                return JSON.stringify(obj);
            } else {
                return obj || '';
            }
        },

        getParam: function(sid) {
            // 鍥犱负ios涓媔frame鍗忚锛屽浜巙rl闀垮害鏈夐檺鍒讹紝鎵€浠ュ鍔犱竴涓弬鏁扮殑map銆�
            return this.params[PARAM_PREFIX + sid] || '';
        },

        setParam: function(sid, params) {
            this.params[PARAM_PREFIX + sid] = params;
        },

        parseData: function(str) {
            var rst;
            if (str && typeof str === 'string') {
                try {
                    rst = JSON.parse(str);
                } catch(e) {
                    rst = {ret:['HY_RESULT_PARSE_ERROR']};
                }
            } else {
                rst = str || {};
            }

            return rst;
        },

        registerCall: function(sid, callInfo) {
            this.calls[sid] = callInfo;
        },

        unregisterCall: function(sid, keepAlive) {
            var callInfo = this.calls[sid] || {};

            var timeout = callInfo.timeout;
            if (timeout) {
                clearTimeout(timeout);
            }

            if (!keepAlive) {
                delete this.calls[sid];
            }

            return callInfo;
        },

        useIframe: function(sid, url) {
            var iframeid = IFRAME_PREFIX + sid;
            var iframe = iframePool.pop();

            if (!iframe) {
                iframe = doc.createElement('iframe');
                iframe.setAttribute('frameborder', '0');
                iframe.style.cssText = 'width:0;height:0;border:0;display:none;';
            }

            iframe.setAttribute('id', iframeid);
            iframe.setAttribute('src', url);

            if (!iframe.parentNode) {
                setTimeout(function() {
                    doc.body.appendChild(iframe);
                },5);
            }
        },

        retrieveIframe : function(sid) {
            var iframeid = IFRAME_PREFIX + sid;
            var iframe = doc.querySelector('#' + iframeid);

            if (iframe) {
                if (iframePool.length >= iframeLimit) {
                    try {
                        doc.body.removeChild(iframe);
                    } catch (e) {
                        // 鏈夋椂 iframe 鐨� parent 骞朵笉鏄� body锛屾垨鑰呯姸鎬佷笉姝ｇ‘锛屼細瀵艰嚧鎶涘紓甯�
                    }
                } else {
                    // 閬垮厤鍚屼竴涓� iframe 閲嶅鎻掑叆涓ゆ iframePoll
                    if (iframePool.indexOf(iframe) < 0) {
                        iframePool.push(iframe);
                    }
                }
            }
        },

        callMethod: function(obj, method, params, sid) {
            // hybrid://objectName:sid/methodName?params
            params = WV_Private.buildParam(params);

            if (isWin) {
                if (isWinWV) {
                    win['WindVane_Win_Private'].call(obj, method, sid, params);
                } else {
                    this.onComplete(sid, {ret: 'HY_NO_HANDLER_ON_WP'}, 'failure');
                }
            } else {
                if (isIOS) {
                    // iOS涓嬬敤iframe璋冪敤
                    this.setParam(sid, params);
                    var uri = LOCAL_PROTOCOL + '://' + obj + ':' + sid + '/' + method + '?' + encodeURIComponent(params);
                    this.useIframe(sid, uri);
                } else if (isAndroid) {
                    // Android涓嬬敤window.prompt璋冪敤璋冪敤
                    var uri = LOCAL_PROTOCOL + '://' + obj + ':' + sid + '/' + method + '?' + params;
                    var value = WV_PROTOCOL + ':';
                    window.prompt(uri, value);
                } else {
                    this.onComplete(sid, {ret: 'HY_NOT_SUPPORT_DEVICE'}, 'failure');
                }
            }
        },

        registerGC: function(sid, timeout) {
            // 鍨冨溇鍥炴敹
            var that = this;
            var callGCTime = Math.max(timeout || 0, CALL_GC_TIME);
            var paramGCTime = Math.max(timeout || 0, PARAM_GC_TIME);

            setTimeout(function(){
                that.unregisterCall(sid);
            }, callGCTime);

            if (isIOS) {
                // ios涓嬪鐞唒arams鐨勫洖鏀�
                setTimeout(function(){
                    if (that.params[PARAM_PREFIX + sid]) {
                        delete that.params[PARAM_PREFIX + sid];
                    }
                }, paramGCTime);
            }
        },

        onComplete: function(sid, data, type, keepAlive) {
            var call = this.unregisterCall(sid, keepAlive);
            var success = call.success;
            var failure = call.failure;

            data = this.parseData(data);

            var ret = data.ret;
            if (typeof ret === 'string') {
                data = data.value || data;
                if (!data.ret) {
                    data.ret = [ret];
                }
            }

            if (type === 'success') {
                success && success(data);
            } else if (type === 'failure') {
                failure && failure(data);
            }

            if (isIOS) {    //iOS涓嬪洖鏀秈frame
                this.retrieveIframe(sid);
                if (this.params[PARAM_PREFIX + sid]) {
                    delete this.params[PARAM_PREFIX + sid];
                }
            }
        }
    };

    for (var key in WV_Core) {
        if (!hasOwnProperty.call(WindVane, key)) {
            WindVane[key] = WV_Core[key];
        }
    }
})(window, window['lib'] || (window['lib'] = {}))