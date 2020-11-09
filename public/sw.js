/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "../";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./serviceWorker.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./serviceWorker.ts":
/*!**************************!*\
  !*** ./serviceWorker.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

var config = {
    version: 'achilles',
    staticCacheItems: [
        '/'
    ],
    cachePathPattern: new RegExp('^.*\\.(jpg|png|jpeg|woff)$'),
    offlinePage: '/offline/'
};
function cacheName(key, opts) {
    return opts.version + "-" + key;
}
function addToCache(cacheKey, request, response) {
    if (response.ok) {
        var copy = response.clone();
        caches.open(cacheKey).then(function (cache) {
            cache.put(request, copy);
        });
    }
    return response;
}
function fetchFromCache(event) {
    return caches.match(event.request).then(function (response) {
        if (!response) {
            throw Error(event.request.url + " not found in cache");
        }
        return response;
    });
}
function offlineResponse(resourceType, opts) {
    var tmp = { code: 'Вы оффлайн' };
    return Promise.resolve(new Response(JSON.stringify(tmp), { headers: {
            'Content-Type': 'text/html; charset=utf-8'
        } }));
}
self.addEventListener('install', function (event) {
    function onInstall(event, opts) {
        var cacheKey = cacheName('static', opts);
        return caches.open(cacheKey)
            .then(function (cache) { return cache.addAll(opts.staticCacheItems); });
    }
    event.waitUntil(onInstall(event, config).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('fetch', function (event) {
    function onFetch(event, opts, isStatic) {
        var request = event.request;
        var resourceType = 'static';
        var cacheKey;
        cacheKey = 'cache-v1';
        if (!isStatic) {
            event.respondWith(fetch(request)
                .then(function (response) { return addToCache(cacheKey, request, response); })
                .catch(function () { return fetchFromCache(event); })
                .catch(function () { return offlineResponse(resourceType, opts); }));
        }
        else {
            event.respondWith(fetchFromCache(event)
                .catch(function () { return fetch(request); })
                .then(function (response) { return addToCache(cacheKey, request, response); })
                .catch(function () { return offlineResponse(resourceType, opts); }));
        }
    }
    if (event.request.method === 'GET') {
        var url = new URL(event.request.url);
        if (url.pathname === '/sw.js') {
            return;
        }
        onFetch(event, config, config.cachePathPattern.test(url.href));
    }
});


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc2VydmljZVdvcmtlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7QUNsRkEsSUFBSSxNQUFNLEdBQUc7SUFDVCxPQUFPLEVBQUUsVUFBVTtJQUNuQixnQkFBZ0IsRUFBRTtRQUNkLEdBQUc7S0FDTjtJQUNELGdCQUFnQixFQUFFLElBQUksTUFBTSxDQUFDLDRCQUE0QixDQUFDO0lBQzFELFdBQVcsRUFBRSxXQUFXO0NBQzNCLENBQUM7QUFFRixTQUFTLFNBQVMsQ0FBRSxHQUFXLEVBQUUsSUFBNkI7SUFDMUQsT0FBVSxJQUFJLENBQUMsT0FBTyxTQUFJLEdBQUssQ0FBQztBQUNwQyxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUUsUUFBZ0IsRUFBRSxPQUFnQixFQUFFLFFBQWtCO0lBQ3ZFLElBQUksUUFB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Q0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxFQUF2QyxDQUF1QyxDQUFDO2lCQUN6RCxLQUFLLENBQUMsY0FBTSxzQkFBZSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsRUFBbkMsQ0FBbUMsQ0FBQyxDQUN4RCxDQUFDO1NBQ0w7SUFDTCxDQUFDO0lBQ0QsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxLQUFLLEVBQUU7UUFDaEMsSUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1lBQzNCLE9BQU87U0FDVjtRQUNELE9BQU8sQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFXLE1BQU0sQ0FBQyxnQkFBaUIsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDNUU7QUFDTCxDQUFDLENBQUMsQ0FBQyIsImZpbGUiOiJzdy5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi4vXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc2VydmljZVdvcmtlci50c1wiKTtcbiIsInZhciBjb25maWcgPSB7XG4gICAgdmVyc2lvbjogJ2FjaGlsbGVzJyxcbiAgICBzdGF0aWNDYWNoZUl0ZW1zOiBbXG4gICAgICAgICcvJ1xuICAgIF0sXG4gICAgY2FjaGVQYXRoUGF0dGVybjogbmV3IFJlZ0V4cCgnXi4qXFxcXC4oanBnfHBuZ3xqcGVnfHdvZmYpJCcpLFxuICAgIG9mZmxpbmVQYWdlOiAnL29mZmxpbmUvJ1xufTtcblxuZnVuY3Rpb24gY2FjaGVOYW1lIChrZXk6IHN0cmluZywgb3B0czogUmVjb3JkPHN0cmluZywgdW5rbm93bj4pIHtcbiAgICByZXR1cm4gYCR7b3B0cy52ZXJzaW9ufS0ke2tleX1gO1xufVxuXG5mdW5jdGlvbiBhZGRUb0NhY2hlIChjYWNoZUtleTogc3RyaW5nLCByZXF1ZXN0OiBSZXF1ZXN0LCByZXNwb25zZTogUmVzcG9uc2UpIHtcbiAgICBpZiAocmVzcG9uc2Uub2spIHtcbiAgICAgICAgdmFyIGNvcHkgPSByZXNwb25zZS5jbG9uZSgpO1xuICAgICAgICBjYWNoZXMub3BlbihjYWNoZUtleSkudGhlbiggY2FjaGUgPT4ge1xuICAgICAgICAgICAgY2FjaGUucHV0KHJlcXVlc3QsIGNvcHkpO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3BvbnNlO1xufVxuXG5mdW5jdGlvbiBmZXRjaEZyb21DYWNoZSAoZXZlbnQ6IEZldGNoRXZlbnQpIHtcbiAgICByZXR1cm4gY2FjaGVzLm1hdGNoKGV2ZW50LnJlcXVlc3QpLnRoZW4ocmVzcG9uc2UgPT4ge1xuICAgICAgICBpZiAoIXJlc3BvbnNlKSB7XG4gICAgICAgICAgICB0aHJvdyBFcnJvcihgJHtldmVudC5yZXF1ZXN0LnVybH0gbm90IGZvdW5kIGluIGNhY2hlYCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBvZmZsaW5lUmVzcG9uc2UgKHJlc291cmNlVHlwZTogc3RyaW5nLCBvcHRzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikge1xuICAgIGNvbnN0IHRtcCA9IHtjb2RlOiAn0JLRiyDQvtGE0YTQu9Cw0LnQvSd9O1xuICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHRtcCksIHsgaGVhZGVyczoge1xuICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICd0ZXh0L2h0bWw7IGNoYXJzZXQ9dXRmLTgnXG4gICAgICAgIH19KSk7XG59XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsIChldmVudDogRXh0ZW5kYWJsZUV2ZW50KSA9PiB7XG4gICAgZnVuY3Rpb24gb25JbnN0YWxsIChldmVudDogRXh0ZW5kYWJsZUV2ZW50LCBvcHRzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPikge1xuICAgICAgICB2YXIgY2FjaGVLZXkgPSBjYWNoZU5hbWUoJ3N0YXRpYycsIG9wdHMpO1xuICAgICAgICByZXR1cm4gY2FjaGVzLm9wZW4oY2FjaGVLZXkpXG4gICAgICAgICAgICAudGhlbihjYWNoZSA9PiBjYWNoZS5hZGRBbGwoPEFycmF5PHN0cmluZz4+b3B0cy5zdGF0aWNDYWNoZUl0ZW1zKSk7XG4gICAgfVxuXG4gICAgZXZlbnQud2FpdFVudGlsKFxuICAgICAgICBvbkluc3RhbGwoZXZlbnQsIGNvbmZpZykudGhlbiggKCkgPT4gc2VsZi5za2lwV2FpdGluZygpIClcbiAgICApO1xufSk7XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignZmV0Y2gnLCAoZXZlbnQ6IEZldGNoRXZlbnQpID0+IHtcblxuICAgIGZ1bmN0aW9uIG9uRmV0Y2ggKGV2ZW50OiBGZXRjaEV2ZW50LCBvcHRzOiBSZWNvcmQ8c3RyaW5nLCB1bmtub3duPiwgaXNTdGF0aWM6IGJvb2xlYW4pIHtcbiAgICAgICAgdmFyIHJlcXVlc3QgPSBldmVudC5yZXF1ZXN0O1xuICAgICAgICB2YXIgcmVzb3VyY2VUeXBlID0gJ3N0YXRpYyc7XG4gICAgICAgIHZhciBjYWNoZUtleTogc3RyaW5nO1xuXG4gICAgICAgIGNhY2hlS2V5ID0gJ2NhY2hlLXYxJztcblxuICAgICAgICBpZiAoIWlzU3RhdGljKSB7XG4gICAgICAgICAgICBldmVudC5yZXNwb25kV2l0aChcbiAgICAgICAgICAgICAgICBmZXRjaChyZXF1ZXN0KVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiBhZGRUb0NhY2hlKGNhY2hlS2V5LCByZXF1ZXN0LCByZXNwb25zZSkpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBmZXRjaEZyb21DYWNoZShldmVudCkpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBvZmZsaW5lUmVzcG9uc2UocmVzb3VyY2VUeXBlLCBvcHRzKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBldmVudC5yZXNwb25kV2l0aChcbiAgICAgICAgICAgICAgICBmZXRjaEZyb21DYWNoZShldmVudClcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKCgpID0+IGZldGNoKHJlcXVlc3QpKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiBhZGRUb0NhY2hlKGNhY2hlS2V5LCByZXF1ZXN0LCByZXNwb25zZSkpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoKSA9PiBvZmZsaW5lUmVzcG9uc2UocmVzb3VyY2VUeXBlLCBvcHRzKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKGV2ZW50LnJlcXVlc3QubWV0aG9kID09PSAnR0VUJykge1xuICAgICAgICBjb25zdCB1cmwgPSBuZXcgVVJMKGV2ZW50LnJlcXVlc3QudXJsKTtcbiAgICAgICAgaWYgKHVybC5wYXRobmFtZSA9PT0gJy9zdy5qcycpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBvbkZldGNoKGV2ZW50LCBjb25maWcsICg8UmVnRXhwPmNvbmZpZy5jYWNoZVBhdGhQYXR0ZXJuKS50ZXN0KHVybC5ocmVmKSk7XG4gICAgfVxufSk7XG4iXSwic291cmNlUm9vdCI6IiJ9