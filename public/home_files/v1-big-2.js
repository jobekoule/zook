var FuseTech;
(function (FuseTech) {
    FuseTech.BuildMode = 'release';
    FuseTech.DEBUG_MODE = 'debug';
    FuseTech.RELEASE_MODE = 'release';
    var Core = (function () {
        function Core() {
            this.optOutCookieName = "FUSEOPTOUT";
            this._noTrack = false;
            this._cookieable = true;
            if (Core._instance) {
                if (FuseTech.BuildMode == FuseTech.DEBUG_MODE)
                    throw new Error("Error: Instantiation failed: Use Core.getInstance() instead of new.");
                else
                    return;
            }
            this._integrations = new Array();
            this.checkTrackingOption();
            Core._instance = this;
        }
        Core.prototype.checkTrackingOption = function () {

            var dntHeader = null;
            if (navigator.msDoNotTrack !== undefined)
                dntHeader = navigator.msDoNotTrack;
            if (navigator.doNotTrack !== undefined)
                dntHeader = navigator.doNotTrack;
            if (window.doNotTrack !== undefined)
                dntHeader = window.doNotTrack;
            var hasCookie = document.cookie.indexOf(this.optOutCookieName) > -1;
            if (hasCookie || (dntHeader != null && (dntHeader == 1 || dntHeader == "yes"))) {
                this._noTrack = true;
                if (hasCookie) {
                    FuseTech.CookiesManager.updateCookieExpirationDate(this.optOutCookieName);
                }
            }
            else {
                if (document.referrer != null && document.referrer !== undefined && document.referrer != '') {
                    if (document.referrer.indexOf("optout") > -1) {
                        FuseTech.CookiesManager.addCookie(this.optOutCookieName, "1");
                        this._noTrack = true;
                    }
                }
            }

            this._cookieable = (function() {

        		if(navigator.cookieEnabled)
        			return true;

        		document.cookie = "fusetest=1";
        		var cookiesEnabled = document.cookie.indexOf("fusetest=") != -1;
        		document.cookie = "fusetest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";

        		return cookiesEnabled;

        	})();

            this.init();
        };
        Core.prototype.init = function () {

            if(!this._cookiable)
            {
                for(var i = 0; i < this._integrations.length; i++)
                {
                    if(this._integrations[i].Name != "InternalBuyer")
                        this._integrations[i].IsExecuted = true;
                }
            }

            if (this._noTrack == false) {
                this._script = FuseTech.ScriptTagsManager.getInstance().getScriptAndRemoveExecutedOnes(true);
                if (this._script === undefined || this._script == null) {
                    return;
                }
                Core.log_url = this._script.getAttribute('src').split('?')[0];
                Core.log_url = Core.log_url.substring(0, Core.log_url.length - 3);
                Core.log_url = Core.log_url + ".error?";
                var queryString = this._script.getAttribute("src").replace(/^[^\?]+\??/, '');
                this._params = this.parseQuery(queryString);
                for (var i = 0; i < this._integrations.length; i++) {
                    if (!this._integrations[i].IsExecuted)
                        this._integrations[i].setup(this._params);
                }
            }
        };
        Core.prototype.parseQuery = function (query) {
            var Params = new Object();
            if (!query)
                return Params;
            var Pairs = query.split(/[;&]/);
            for (var i = 0; i < Pairs.length; i++) {
                var KeyVal = Pairs[i].split('=');
                if (!KeyVal || KeyVal.length != 2)
                    continue;
                var key = window.unescape(KeyVal[0]);
                var val = window.unescape(KeyVal[1]);
                val = val.replace(/\+/g, ' ');
                Params[key] = val;
            }
            return Params;
        };
        Core.prototype.registerIntegration = function (integration) {
            this._integrations.push(integration);
            if (this._script != null && this._script != undefined)
                integration.setup(this._params);
        };
        Core.isValidParam = function (paramValue) {
            if (paramValue === undefined || paramValue == '' || paramValue == null)
                return false;
            return true;
        };
        Core.addAsFirstParam = function (destUrl, key, paramValue) {
            if (Core.isValidParam(paramValue))
                destUrl = destUrl + '?' + key + '=' + paramValue;
            return destUrl;
        };
        Core.addOptionalParam = function (destUrl, key, paramValue) {
            if (Core.isValidParam(paramValue))
                destUrl = destUrl + '&' + key + '=' + paramValue;
            return destUrl;
        };
        Core.StringReplaceAll = function (text, pattern, textToReplaceWith) {
            if (text != null && text != undefined && pattern != null && pattern != undefined && textToReplaceWith != null) {
                return text.split(pattern).join(textToReplaceWith);
            }
            return text;
        };
        Core.prototype.getIntegrations = function () {
            return this._integrations;
        };
        Core.Log = function (message) {
            var computedMessage = "message=" + encodeURIComponent(message);
            FuseTech.HtmlTagManager.getInstance().createAndAddPixelImgTag(Core.log_url + computedMessage, document.head);
        };
        Core.getInstance = function () {
            if (Core._instance == null || Core._instance === undefined) {
                Core._instance = new Core();
            }
            return Core._instance;
        };
        Core.getIntegrationByName = function (name) {
            for (var i = 0; i <= Core.getInstance()._integrations.length; i++) {
                if (Core.getInstance()._integrations[i].Name == name)
                    return Core.getInstance()._integrations[i];
            }
            return null;
        };
        Core.PARTNERID_REQ = 'pid';
        Core.SITEID_REQ = 'sid';
        Core.AGE_REQ = 'age';
        Core.GENDER_REQ = 'gen';
        Core.INT1_REQ = 'int1';
        Core.INT2_OPT = 'int2';
        Core.DEM1_OPT = 'dem1';
        Core.DEM2_OPT = 'dem2';
        Core.TEN1_OPT = 'ten1';
        Core.TEN2_OPT = 'ten2';
        Core.COUNTRY_REQ = 'cntry';
        Core.ACT1_OPT = 'act1';
        Core.ACT2_OPT = 'act2';
        Core.version = '4.2';
        Core.log_url = '';
        return Core;
    })();
    FuseTech.Core = Core;
})(FuseTech || (FuseTech = {}));
//# sourceMappingURL=Core.js.map
;var FuseTech;
(function (FuseTech) {
    var CookiesManager = (function () {
        function CookiesManager() {
            if (CookiesManager._instance != null)
                if (FuseTech.BuildMode == FuseTech.DEBUG_MODE)
                    throw Error("Object already exists. Please using CookiesManager.getInstance()");
                else
                    return;
            CookiesManager._instance = this;
        }
        CookiesManager.getInstance = function () {
            if (CookiesManager._instance == null)
                new CookiesManager();
            return CookiesManager._instance;
        };
        CookiesManager.addCookie = function (cookieName, value) {
            var dCur = new Date();
            var dExp = new Date(dCur.getTime() + 365 * 24 * 60 * 60 * 1000);
            var expiry = "; expires=" + dExp.toUTCString();
            var path = "; path=/";
            var domain = "; domain=." + window.location.host;
            document.cookie = cookieName + "=" + value + expiry + path + domain;
        };
        CookiesManager.updateCookieExpirationDate = function (cookieName) {
            CookiesManager.addCookie(cookieName, "1");
        };
        return CookiesManager;
    })();
    FuseTech.CookiesManager = CookiesManager;
})(FuseTech || (FuseTech = {}));
//# sourceMappingURL=cookiesmanager.js.map;var FuseTech;
(function (FuseTech) {
    var HtmlTagManager = (function () {
        function HtmlTagManager() {
            if (HtmlTagManager._instance != null)
                if (FuseTech.BuildMode == FuseTech.DEBUG_MODE)
                    throw Error("Object already exists. Please using HtmlTagManager.getInstance()");
                else
                    return;
            HtmlTagManager._instance = this;
        }
        HtmlTagManager.getInstance = function () {
            if (HtmlTagManager._instance == null)
                new HtmlTagManager();
            return HtmlTagManager._instance;
        };
        HtmlTagManager.prototype.createAndAddPixelImgTag = function (url, targetContainer) {
            if (targetContainer === undefined || targetContainer == null)
                return;
            var elem = document.createElement("img");
            elem.setAttribute("src", url);
            elem.setAttribute("height", "1");
            elem.setAttribute("width", "1");
            elem.setAttribute("alt", "");
            targetContainer.appendChild(elem);
        };
        HtmlTagManager.prototype.createAndAddIframeTag = function (url, targetContainer, iFrameName) {
            if (targetContainer === undefined || targetContainer == null)
                return;
            var elem = document.createElement("iframe");
            elem.setAttribute("src", url);
            elem.setAttribute("height", "0");
            elem.setAttribute("width", "0");
            elem.setAttribute("frameborder", "0");
            elem.setAttribute("name", iFrameName);
            targetContainer.appendChild(elem);
        };
        return HtmlTagManager;
    })();
    FuseTech.HtmlTagManager = HtmlTagManager;
})(FuseTech || (FuseTech = {}));
//# sourceMappingURL=htmltagmanager.js.map;var FuseTech;
(function (FuseTech) {
    var RequestsManager = (function () {
        function RequestsManager() {
            if (RequestsManager._instance != null)
                if (FuseTech.BuildMode == FuseTech.DEBUG_MODE)
                    throw Error("Object already exists. Please using RequestsManager.getInstance()");
                else
                    return;
            RequestsManager._instance = this;
        }
        RequestsManager.getInstance = function () {
            if (RequestsManager._instance == null)
                new RequestsManager();
            return RequestsManager._instance;
        };
        RequestsManager.prototype.createCORSRequest = function (method, url) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {
                xhr.withCredentials = true;
                xhr.open(method, url, true);
            }
            else if (typeof XDomainRequest != "undefined") {
                xhr = new XDomainRequest();
                xhr.withCredentials = true;
                xhr.open(method, url);
            }
            else {
                xhr = null;
            }
            return xhr;
        };
        RequestsManager.prototype.createRequest = function (url) {
            var xmlhttp = this.createCORSRequest("GET", url);
            if (xmlhttp) {
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                    }
                };
                xmlhttp.send();
            }
        };
        RequestsManager.prototype.createRequestWithResponse = function (url, callback) {
            var xmlhttp = this.createCORSRequest("GET", url);
            if (xmlhttp) {
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                        callback(xmlhttp.responseText);
                    }
                };
                xmlhttp.send();
            }
        };
        return RequestsManager;
    })();
    FuseTech.RequestsManager = RequestsManager;
})(FuseTech || (FuseTech = {}));
//# sourceMappingURL=requestsmanager.js.map;var FuseTech;
(function (FuseTech) {
    var ScriptTagsManager = (function () {
        function ScriptTagsManager() {
            if (ScriptTagsManager._instance != null)
                if (FuseTech.BuildMode == FuseTech.DEBUG_MODE)
                    throw Error("Object already exists. Please using ScriptTagsManager.getInstance()");
                else
                    return;
            ScriptTagsManager._instance = this;
        }
        ScriptTagsManager.getInstance = function () {
            if (ScriptTagsManager._instance == null)
                new ScriptTagsManager();
            return ScriptTagsManager._instance;
        };
        ScriptTagsManager.prototype.createScript = function (scriptUrl, useAsync, defer) {
            var se = document.createElement('script');
            se.async = useAsync;
            se.setAttribute('type', 'text/javascript');
            se.setAttribute('src', scriptUrl);
            if (defer != null) {
                se.defer = defer;
            }
            return se;
        };
        ScriptTagsManager.prototype.createScriptWithInnerTextAndAppend = function (innertText, useAsync) {
            var se = document.createElement('script');
            se.async = useAsync;
            se.setAttribute('type', 'text/javascript');
            se.innerHTML = innertText;
            document.body.appendChild(se);
        };
        ScriptTagsManager.prototype.createScriptAndAppend = function (scriptUrl, useAsync, defer) {
            var se = this.createScript(scriptUrl, useAsync, defer);
            document.head.appendChild(se);
        };
        ScriptTagsManager.prototype.createScriptWithIdAndAppend = function (scriptUrl, id, useAsync, defer) {
            var se = this.createScript(scriptUrl, useAsync, defer);
            se.setAttribute("id", id);
            document.head.appendChild(se);
        };
        ScriptTagsManager.prototype.createScriptWithIdAndAppendWithLoadCallback = function (scriptUrl, id, useAsync, loadCallback, defer) {
            var se = this.createScript(scriptUrl, useAsync, defer);
            se.onload = loadCallback;
            se.setAttribute("id", id);
            document.head.appendChild(se);
        };
        ScriptTagsManager.prototype.removeExecutedScripts = function (fuseScripts) {
            for (var j = 0; j < fuseScripts.length; j++) {
                if (fuseScripts[j].getAttribute(ScriptTagsManager.EXECUTED_ATTRIBUTE) == "true") {
                    fuseScripts[j].parentNode.removeChild(fuseScripts[j]);
                }
            }
        };
        ScriptTagsManager.prototype.getScriptAndRemoveExecutedOnes = function (removeFiles) {
            var result;
            var fuseScripts = new Array();
            var scripts = document.getElementsByTagName("script");
            for (var i = 0; i < scripts.length; i++) {
                if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src') != '' && scripts[i].getAttribute('src') != undefined && /fuse-data\.com|nyfte\.com/i.test(scripts[i].getAttribute('src'))) {
                    fuseScripts.push(scripts[i]);
                }
                else {
                    if (scripts[i].getAttribute("id") != null && scripts[i].getAttribute("id") != undefined) {
                        var isMatching = scripts[i].getAttribute("id").indexOf("fuse-tech-container") > -1;
                        if (isMatching)
                            fuseScripts.push(scripts[i]);
                    }
                }
            }
            for (var j = 0; j < fuseScripts.length; j++) {
                if (fuseScripts[j].getAttribute(ScriptTagsManager.EXECUTED_ATTRIBUTE) == "false" || fuseScripts[j].getAttribute(ScriptTagsManager.EXECUTED_ATTRIBUTE) == undefined) {
                    this.removeExecutedScripts(fuseScripts);
                    fuseScripts[j].setAttribute(ScriptTagsManager.EXECUTED_ATTRIBUTE, "true");
                    result = fuseScripts[j];
                    break;
                }
            }
            return result;
        };
        ScriptTagsManager.EXECUTED_ATTRIBUTE = "fuse-ex";
        return ScriptTagsManager;
    })();
    FuseTech.ScriptTagsManager = ScriptTagsManager;
})(FuseTech || (FuseTech = {}));
//# sourceMappingURL=scripttagsmanager.js.map
;
(function (FuseTech) {
    var Utils = (function () {
        function Utils() { }
        Utils.isValidMD5 = function (value) {
            if (value === undefined || value == null) {
                return false;
            }
            if (value.length == 32 && Utils.HexRegexPattern.test(value)) return true;
            else {
                return false;
            }
        }
        Utils.isValidSHA1 = function (value) {
            if (value === undefined || value == null) {
                return false;
            }
            if (value.length == 40 && Utils.HexRegexPattern.test(value)) return true;
            else {
                return false;
            }
        }
        Utils.isValidSHA256 = function (value) {
            if (value === undefined || value == null) {
                return false;
            }
            if (value.length == 64 && Utils.HexRegexPattern.test(value)) return true;
            else {
                return false;
            }
        }
        Utils.HexRegexPattern = new RegExp('[a-fA-F0-9]');
        return Utils;
    })();
    FuseTech.Utils = Utils;
})(FuseTech || (FuseTech = {}));var FuseTech;
(function (FuseTech) {
    var InternalBuyer = (function () {
        function InternalBuyer() {
            this.BASE_URL = "//c.nyfte.net/b3?";
            this.IsExecuted = false;
            this.Name = "InternalBuyer";
            this.Bname = "InternalBuyer";
            this.guidCookieName = "FUSEGUID";
        }
        InternalBuyer.prototype.getCookieValue = function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1);
                if (c.indexOf(name) == 0)
                    return c.substring(name.length, c.length);
            }
            return "";
        };
        InternalBuyer.prototype.getHex4Chars = function () {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        };
        InternalBuyer.prototype.generateGuid = function () {
            var result = '';
            if (document.cookie.indexOf(this.guidCookieName) > -1) {
                result = this.getCookieValue(this.guidCookieName);
            }
            else {
                result = this.getHex4Chars() + this.getHex4Chars() + this.getHex4Chars() + this.getHex4Chars() + this.getHex4Chars() + this.getHex4Chars() + this.getHex4Chars() + this.getHex4Chars();
            }
            FuseTech.CookiesManager.addCookie(this.guidCookieName, result);
            return result;
        };
        InternalBuyer.prototype.initPixelTracking = function () {
            var guid = this.generateGuid();
            var url = FuseTech.Core.addOptionalParam(this.BASE_URL, "v", guid);

            var referrer = document.referrer.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
            var url1 = FuseTech.Core.addOptionalParam(url, "r", referrer);
            var url2 = FuseTech.Core.addOptionalParam(url1, "s", !!location.protocol.match(/https/)?"1":"0");
            var url3 = FuseTech.Core.addOptionalParam(url2, "k", FuseTech.Core._instance._cookieable ? "1" : "0");
		url = url3;
            for (var i = 0; i < document.scripts.length; i++) {
                var src = document.scripts[i].src;
                if (!src) {
                    continue;
                }
                var match = src.match(/(?:fuse-data\.com|nyfte\.com)\/(.*)/);
                if (match) {
					match = match[1].replace(/^.*\//, '');
                    var match1 = match.split('?');
                    url = FuseTech.Core.addOptionalParam(url, "p", match1[0]);
		    var hParameter = "'" + document.location.href.substring(0, 1800).replace(/['\s]|#.*$/g, '');
                    hParameter += "'&" + match1[1];
	            url = FuseTech.Core.addOptionalParam(url, "h", encodeURIComponent(hParameter));
                }
            }

            FuseTech.HtmlTagManager.getInstance().createAndAddPixelImgTag(url, document.body);
        };
        InternalBuyer.prototype.setup = function (params) {
            var self = this;
            if (document.readyState === "complete") {
                self.initPixelTracking();
                this.IsExecuted = true;
            }

            else {
                InternalBuyer.tryToAdd();
            }
        };
        InternalBuyer.tryToAdd = function () {
            InternalBuyer.AID_TIMEOUT_INTERVAL = setTimeout(function () {
                if (document.readyState == "complete") {
                    var instance = FuseTech.Core.getIntegrationByName("InternalBuyer");
                    instance.initPixelTracking();
                    instance.IsExecuted = true;
                    clearTimeout(InternalBuyer.AID_TIMEOUT_INTERVAL);
                }
                else {
                    InternalBuyer.tryToAdd();
                }
            }, 200);
        };
        return InternalBuyer;
    })();
    FuseTech.InternalBuyer = InternalBuyer;
    FuseTech.Core.getInstance().registerIntegration(new InternalBuyer());
})(FuseTech || (FuseTech = {}));
//# sourceMappingURL=InternalBuyer.js.map
;var FuseTech;
(function (FuseTech) {
    var LOT = (function () {
        function LOT() {
            this.IsExecuted = false;
            this.BASE_URL = "//tags.crwdcntrl.net/c/$pid$/cc.js?ns=_cc$pid$";
            this.Name = "LOT";
            this.Bname = "Lotame";
            this.map = {};
            this.int1Map = {};
            this.int2Map = {};
            this.ten1Map = {};
        }
        LOT.prototype.initFuseTaxonomyMapping = function () {
            this.int1Map['1'] = 'Automobiles';
            this.int1Map['16'] = ['Movies', 'Television'];
            this.int1Map['56'] = 'Food & Beverages';
            this.int1Map['88'] = 'Online games';
            this.int1Map['116'] = 'News';
            this.int1Map['117'] = 'News';
            this.int1Map['161'] = 'Sports & Recreation';
            this.int1Map['172'] = 'Sports & Recreation';
            this.int1Map['177'] = 'Airlines';
            this.int1Map['190'] = 'Baseball';
            this.int2Map['1'] = 'Automobiles';
            this.int2Map['12'] = 'Art';
            this.int2Map['13'] = 'Art';
            this.int2Map['16'] = ['Movies', 'Television'];
            this.int2Map['20'] = 'Literature';
            this.int2Map['21'] = 'Theater';
            this.int2Map['22'] = 'Art';
            this.int2Map['23'] = ['Finance Business', 'Business Finance'];
            this.int2Map['24'] = 'Advertising & Marketing Business';
            this.int2Map['33'] = 'School & Education';
            this.int2Map['34'] = 'School & Education';
            this.int2Map['42'] = 'Computers & Technology';
            this.int2Map['56'] = 'Food & Beverages';
            this.int2Map['70'] = 'Health & Medicine';
            this.int2Map['80'] = 'Lawn & Garden';
            this.int2Map['94'] = 'Online Shopping';
            this.int2Map['99'] = 'Fashion & Beauty';
            this.int2Map['100'] = 'Entertainment';
            this.int2Map['115'] = 'News';
            this.int2Map['116'] = 'News';
            this.int2Map['132'] = 'Politics';
            this.int2Map['140'] = 'Science & Mathematics';
            this.int2Map['161'] = 'Sports & Recreation';
            this.int2Map['162'] = 'Gymnastics';
            this.int2Map['166'] = 'Golf';
            this.int2Map['172'] = 'Sports & Recreation';
            this.int2Map['173'] = 'Sports & Recreation';
            this.int2Map['176'] = 'Travel';
            this.int2Map['186'] = 'Video Games';
            this.ten1Map['e07749'] = 'Live Theater';
        };
        LOT.prototype.setup = function (params) {
            this.initFuseTaxonomyMapping();
            this.map[FuseTech.Core.PARTNERID_REQ] = '';
            this.map[FuseTech.Core.SITEID_REQ] = '';
            this.map[FuseTech.Core.INT1_REQ] = 'int1';
            this.map[FuseTech.Core.INT2_OPT] = 'int2';
            this.map[FuseTech.Core.TEN1_OPT] = 'ten1';
            var pattern = '$pid$';
            var script1 = 'debugger;';
            var url = this.BASE_URL;
            url = FuseTech.Core.StringReplaceAll(url, pattern, LOT.PID_VALUE);
            var script2 = '';
            if (FuseTech.Core.isValidParam(params[FuseTech.Core.INT1_REQ])) {
                if (FuseTech.Core.isValidParam(this.int1Map[params[FuseTech.Core.INT1_REQ]])) {
                    if (this.int1Map[params[FuseTech.Core.INT1_REQ]].constructor === Array) {
                        for (var i in this.int1Map[params[FuseTech.Core.INT1_REQ]]) {
                            script2 = script2.concat(" _cc$pid$.add('int', '" + this.int1Map[params[FuseTech.Core.INT1_REQ]][i] + "');");
                        }
                    }
                    else {
                        script2 = script2.concat(" _cc$pid$.add('int', '" + this.int1Map[params[FuseTech.Core.INT1_REQ]] + "');");
                    }
                }
            }
            if (FuseTech.Core.isValidParam(params[FuseTech.Core.INT2_OPT])) {
                if (FuseTech.Core.isValidParam(this.int2Map[params[FuseTech.Core.INT2_OPT]])) {
                    if (this.int2Map[params[FuseTech.Core.INT2_OPT]].constructor === Array) {
                        for (var i in this.int2Map[params[FuseTech.Core.INT2_OPT]]) {
                            script2 = script2.concat(" _cc$pid$.add('int', '" + this.int2Map[params[FuseTech.Core.INT2_OPT]][i] + "');");
                        }
                    }
                    else {
                        script2 = script2.concat(" _cc$pid$.add('int', '" + this.int2Map[params[FuseTech.Core.INT2_OPT]] + "');");
                    }
                }
            }
            if (FuseTech.Core.isValidParam(params[FuseTech.Core.TEN1_OPT])) {
                if (FuseTech.Core.isValidParam(this.ten1Map[params[FuseTech.Core.TEN1_OPT]])) {
                    script2 = script2.concat(" _cc$pid$.add('med', '" + this.ten1Map[params[FuseTech.Core.TEN1_OPT]] + "');");
                }
            }
            script2 = script2.concat(" _cc$pid$.bcp();");
            FuseTech.ScriptTagsManager.getInstance().createScriptWithIdAndAppendWithLoadCallback(url, FuseTech.Core.StringReplaceAll(LOT.LOT_SCRIPT_ID, pattern, LOT.PID_VALUE), false, function (event) {
                if (document.readyState === "complete") {
                    FuseTech.ScriptTagsManager.getInstance().createScriptWithInnerTextAndAppend(FuseTech.Core.StringReplaceAll(script2, pattern, LOT.PID_VALUE), false);
                    this.IsExecuted = true;
                }
                else {
                    LOT.tryToAdd(FuseTech.Core.StringReplaceAll(script2, pattern, LOT.PID_VALUE));
                }
            });
        };
        LOT.tryToAdd = function (element) {
            LOT.AID_TIMEOUT_INTERVAL = setTimeout(function () {
                if (document.readyState == "complete") {
                    FuseTech.ScriptTagsManager.getInstance().createScriptWithInnerTextAndAppend(element, false);
                    FuseTech.Core.getIntegrationByName("LOT").IsExecuted = true;
                    clearTimeout(LOT.AID_TIMEOUT_INTERVAL);
                }
                else {
                    LOT.tryToAdd(element);
                }
            }, 200);
        };
        LOT.PID_VALUE = '8421';
        LOT.SID_VALUE = '';
        LOT.LOT_SCRIPT_ID = 'LOTCC_$pid$';
        return LOT;
    })();
    FuseTech.LOT = LOT;
    FuseTech.Core.getInstance().registerIntegration(new LOT());
})(FuseTech || (FuseTech = {}));
//# sourceMappingURL=Lotame.js.map;var FuseTech;
(function (FuseTech) {
    var SIM = (function () {
        function SIM() {
            this.IsExecuted = false;
            this.BASE_URL = "//i.simpli.fi/dpx.js?m=1";
            this.Name = "SIM";
            this.map = {};
            this.Bname = "Simplify";
        }
        SIM.prototype.setup = function (params) {
            this.map[FuseTech.Core.PARTNERID_REQ] = 'cid';
            this.map[FuseTech.Core.SITEID_REQ] = 'sifi_tuid';
            var url = this.BASE_URL;
            url = FuseTech.Core.addOptionalParam(url, this.map[FuseTech.Core.PARTNERID_REQ], SIM.PID_VALUE);
            url = FuseTech.Core.addOptionalParam(url, this.map[FuseTech.Core.SITEID_REQ], SIM.SID_VALUE);
            FuseTech.ScriptTagsManager.getInstance().createScriptAndAppend(url, true);
        };
        SIM.PID_VALUE = '42768';
        SIM.SID_VALUE = '21092';
        return SIM;
    })();
    FuseTech.SIM = SIM;
    FuseTech.Core.getInstance().registerIntegration(new SIM());
})(FuseTech || (FuseTech = {}));
//# sourceMappingURL=Simplify.js.map