/**
 * @file: amd.js
 * @author huangliang01@baidu.com
 * @version 1.0.0
 */
var require,define;

(function(window) {
    var head = document.getElementsByTagName('head')[0],modCache = {};

    function isFunction(o) {
        return Object.prototype.toString().call(o) === '[object Function]';
    }
    function isArray(o) {
        return Object.prototype.toString().call(o) === '[object Array]';
    }

    function loadMod(modName, callback) {
        var url = getUrl(modName),mod;

        if(modCache[modName]) {
            mod = modCache[modName];
            if(mod.status == 'loaded') {
                setTimeout(callback(this.params), 0);
            }else {
                mod.onload.push(callback);
            }
        }else {
            mod = modCache[modName] = {
                modName : modName,
                status: 'loading',
                export: null,
                onload: [callback]
            }

            var script = document.createElement('script');
            script.charset= 'utf-8';
            script.id = modName;
            script.type = 'text/javascript';
            script.async = true;
            script.id = modName;
            script.src = url;

            head.appendChild(script);
        }
        
    }

    var getUrl = function(modName) {
        return modName.indexOf('.js')==-1? modName+'.js' : modName;
    }

    require = function(deps, factory) {
        var params = [];
        var depsCount = 0;
        var modName,i,len,isEmpty = false;

        modName = document.currentScript && document.currentScript.id || 'REQUIRE_MAIN';

        if(deps.length) {
            for(i =0 , len = deps.length; i < len; i++ ) {
                (function(i) {
                    depsCount ++;
                    loadMod(deps[i], function(param) {
                        params[i] = param;
                        // console.log('params', params, param, deps[i]);
                        depsCount--;
                        if(depsCount == 0) {
                            saveModule(modName, params, factory);
                        }
                    });
                })(i);
            }
        }else {
            isEmpty = true;
        }

        if(isEmpty) {
            setTimeout(function() {
                saveModule(modName, null, factory);
            }, 0);
        }
    }

    var saveModule = function(modName, params, factory) {
        var mod, fn;
        if(modCache.hasOwnProperty(modName)) {
            mod = modCache[modName];
            mod.status = 'loaded';
            // output 
            mod.export = factory ? factory.apply(null,params) : null;

            while(fn = mod.onload.shift()) {
                fn(mod.export);
            }
        }else {
            factory && factory.apply(window, params);
        }
    }
    define = require;
}(this));