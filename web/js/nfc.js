var quintusCore = function(exportTarget, key) {
    "use strict";
    var Quintus = exportTarget[key] = function(opts) {
        var Q = function(selector, scope, options) {
            return Q.select(selector, scope, options);
        };
        Q.select = function() {}, Q.include = function(mod) {
            return Q._each(Q._normalizeArg(mod), function(name) {
                var m = Quintus[name] || name;
                if (!Q._isFunction(m)) throw "Invalid Module:" + name;
                m(Q);
            }), Q;
        }, Q._normalizeArg = function(arg) {
            return Q._isString(arg) && (arg = arg.replace(/\s+/g, "").split(",")), Q._isArray(arg) || (arg = [ arg ]), 
            arg;
        }, Q._extend = function(dest, source) {
            if (!source) return dest;
            for (var prop in source) dest[prop] = source[prop];
            return dest;
        }, Q._clone = function(obj) {
            return Q._extend({}, obj);
        }, Q._defaults = function(dest, source) {
            if (!source) return dest;
            for (var prop in source) void 0 === dest[prop] && (dest[prop] = source[prop]);
            return dest;
        }, Q._has = function(obj, key) {
            return Object.prototype.hasOwnProperty.call(obj, key);
        }, Q._isString = function(obj) {
            return "string" == typeof obj;
        }, Q._isNumber = function(obj) {
            return "[object Number]" === Object.prototype.toString.call(obj);
        }, Q._isFunction = function(obj) {
            return "[object Function]" === Object.prototype.toString.call(obj);
        }, Q._isObject = function(obj) {
            return "[object Object]" === Object.prototype.toString.call(obj);
        }, Q._isArray = function(obj) {
            return "[object Array]" === Object.prototype.toString.call(obj);
        }, Q._isUndefined = function(obj) {
            return void 0 === obj;
        }, Q._popProperty = function(obj, property) {
            var val = obj[property];
            return delete obj[property], val;
        }, Q._each = function(obj, iterator, context) {
            if (null != obj) if (obj.forEach) obj.forEach(iterator, context); else if (obj.length === +obj.length) for (var i = 0, l = obj.length; l > i; i++) iterator.call(context, obj[i], i, obj); else for (var key in obj) iterator.call(context, obj[key], key, obj);
        }, Q._invoke = function(arr, property, arg1, arg2) {
            if (null !== arr) for (var i = 0, l = arr.length; l > i; i++) arr[i][property](arg1, arg2);
        }, Q._detect = function(obj, iterator, context, arg1, arg2) {
            var result;
            if (null !== obj) {
                if (obj.length === +obj.length) {
                    for (var i = 0, l = obj.length; l > i; i++) if (result = iterator.call(context, obj[i], i, arg1, arg2)) return result;
                    return !1;
                }
                for (var key in obj) if (result = iterator.call(context, obj[key], key, arg1, arg2)) return result;
                return !1;
            }
        }, Q._map = function(obj, iterator, context) {
            var results = [];
            return null === obj ? results : obj.map ? obj.map(iterator, context) : (Q._each(obj, function(value, index, list) {
                results[results.length] = iterator.call(context, value, index, list);
            }), obj.length === +obj.length && (results.length = obj.length), results);
        }, Q._uniq = function(arr) {
            arr = arr.slice().sort();
            for (var output = [], last = null, i = 0; i < arr.length; i++) void 0 !== arr[i] && last !== arr[i] && output.push(arr[i]), 
            last = arr[i];
            return output;
        }, Q._shuffle = function(obj) {
            var rand, shuffled = [];
            return Q._each(obj, function(value, index, list) {
                rand = Math.floor(Math.random() * (index + 1)), shuffled[index] = shuffled[rand], 
                shuffled[rand] = value;
            }), shuffled;
        }, Q._keys = Object.keys || function(obj) {
            if (Q._isObject(obj)) throw new TypeError("Invalid object");
            var keys = [];
            for (var key in obj) Q._has(obj, key) && (keys[keys.length] = key);
            return keys;
        }, Q._range = function(start, stop, step) {
            step = step || 1;
            for (var len = Math.max(Math.ceil((stop - start) / step), 0), idx = 0, range = new Array(len); len > idx; ) range[idx++] = start, 
            start += step;
            return range;
        };
        var idIndex = 0;
        return Q._uniqueId = function() {
            return idIndex++;
        }, Q.options = {
            imagePath: "images/",
            audioPath: "audio/",
            dataPath: "data/",
            audioSupported: [ "mp3", "ogg" ],
            sound: !0,
            frameTimeLimit: 100,
            autoFocus: !0
        }, opts && Q._extend(Q.options, opts), Q.scheduleFrame = function(callback) {
            return window.requestAnimationFrame(callback);
        }, Q.cancelFrame = function(loop) {
            window.cancelAnimationFrame(loop);
        }, Q.gameLoop = function(callback) {
            return Q.lastGameLoopFrame = new Date().getTime(), Q.loop = !0, Q._loopFrame = 0, 
            Q.gameLoopCallbackWrapper = function() {
                var now = new Date().getTime();
                Q._loopFrame++, Q.loop = Q.scheduleFrame(Q.gameLoopCallbackWrapper);
                var dt = now - Q.lastGameLoopFrame;
                dt > Q.options.frameTimeLimit && (dt = Q.options.frameTimeLimit), callback.apply(Q, [ dt / 1e3 ]), 
                Q.lastGameLoopFrame = now;
            }, Q.scheduleFrame(Q.gameLoopCallbackWrapper), Q;
        }, Q.pauseGame = function() {
            Q.loop && Q.cancelFrame(Q.loop), Q.loop = null;
        }, Q.unpauseGame = function() {
            Q.loop || (Q.lastGameLoopFrame = new Date().getTime(), Q.loop = Q.scheduleFrame(Q.gameLoopCallbackWrapper));
        }, function() {
            var initializing = !1, fnTest = /xyz/.test(function() {
            }) ? /\b_super\b/ : /.*/;
            Q.Class = function() {}, Q.Class.prototype.isA = function(className) {
                return this.className === className;
            }, Q.Class.extend = function(className, prop, classMethods) {
                function _superFactory(name, fn) {
                    return function() {
                        var tmp = this._super;
                        this._super = _super[name];
                        var ret = fn.apply(this, arguments);
                        return this._super = tmp, ret;
                    };
                }
                function Class() {
                    !initializing && this.init && this.init.apply(this, arguments);
                }
                Q._isString(className) || (classMethods = prop, prop = className, className = null);
                var _super = this.prototype, ThisClass = this;
                initializing = !0;
                var prototype = new ThisClass();
                initializing = !1;
                for (var name in prop) prototype[name] = "function" == typeof prop[name] && "function" == typeof _super[name] && fnTest.test(prop[name]) ? _superFactory(name, prop[name]) : prop[name];
                return Class.prototype = prototype, Class.prototype.constructor = Class, Class.extend = Q.Class.extend, 
                classMethods && Q._extend(Class, classMethods), className && (Q[className] = Class, 
                Class.prototype.className = className, Class.className = className), Class;
            };
        }(), Q.Class.extend("Evented", {
            on: function(event, target, callback) {
                if (Q._isArray(event) || -1 !== event.indexOf(",")) {
                    event = Q._normalizeArg(event);
                    for (var i = 0; i < event.length; i++) this.on(event[i], target, callback);
                } else callback || (callback = target, target = null), callback || (callback = event), 
                Q._isString(callback) && (callback = (target || this)[callback]), this.listeners = this.listeners || {}, 
                this.listeners[event] = this.listeners[event] || [], this.listeners[event].push([ target || this, callback ]), 
                target && (target.binds || (target.binds = []), target.binds.push([ this, event, callback ]));
            },
            trigger: function(event, data) {
                if (this.listeners && this.listeners[event]) for (var i = 0, len = this.listeners[event].length; len > i; i++) {
                    var listener = this.listeners[event][i];
                    listener[1].call(listener[0], data);
                }
            },
            off: function(event, target, callback) {
                if (target) {
                    Q._isString(callback) && target[callback] && (callback = target[callback]);
                    var l = this.listeners && this.listeners[event];
                    if (l) for (var i = l.length - 1; i >= 0; i--) l[i][0] === target && (callback && callback !== l[i][1] || this.listeners[event].splice(i, 1));
                } else this.listeners[event] && delete this.listeners[event];
            },
            debind: function() {
                if (this.binds) for (var i = 0, len = this.binds.length; len > i; i++) {
                    var boundEvent = this.binds[i], source = boundEvent[0], event = boundEvent[1];
                    source.off(event, this);
                }
            }
        }), Q.components = {}, Q.Evented.extend("Component", {
            init: function(entity) {
                this.entity = entity, this.extend && Q._extend(entity, this.extend), entity[this.name] = this, 
                entity.activeComponents.push(this.componentName), entity.stage && entity.stage.addToList && entity.stage.addToList(this.componentName, entity), 
                this.added && this.added();
            },
            destroy: function() {
                if (this.extend) for (var extensions = Q._keys(this.extend), i = 0, len = extensions.length; len > i; i++) delete this.entity[extensions[i]];
                delete this.entity[this.name];
                var idx = this.entity.activeComponents.indexOf(this.componentName);
                -1 !== idx && (this.entity.activeComponents.splice(idx, 1), this.entity.stage && this.entity.stage.addToList && this.entity.stage.addToLists(this.componentName, this.entity)), 
                this.debind(), this.destroyed && this.destroyed();
            }
        }), Q.Evented.extend("GameObject", {
            has: function(component) {
                return !!this[component];
            },
            add: function(components) {
                components = Q._normalizeArg(components), this.activeComponents || (this.activeComponents = []);
                for (var i = 0, len = components.length; len > i; i++) {
                    var name = components[i], Comp = Q.components[name];
                    if (!this.has(name) && Comp) {
                        var c = new Comp(this);
                        this.trigger("addComponent", c);
                    }
                }
                return this;
            },
            del: function(components) {
                components = Q._normalizeArg(components);
                for (var i = 0, len = components.length; len > i; i++) {
                    var name = components[i];
                    name && this.has(name) && (this.trigger("delComponent", this[name]), this[name].destroy());
                }
                return this;
            },
            destroy: function() {
                this.isDestroyed || (this.trigger("destroyed"), this.debind(), this.stage && this.stage.remove && this.stage.remove(this), 
                this.isDestroyed = !0, this.destroyed && this.destroyed());
            }
        }), Q.component = function(name, methods) {
            return methods ? (methods.name = name, methods.componentName = "." + name, Q.components[name] = Q.Component.extend(name + "Component", methods)) : Q.components[name];
        }, Q.GameObject.extend("GameState", {
            init: function(p) {
                this.p = Q._extend({}, p), this.listeners = {};
            },
            reset: function(p) {
                this.init(p), this.trigger("reset");
            },
            _triggerProperty: function(value, key) {
                this.p[key] !== value && (this.p[key] = value, this.trigger("change." + key, value));
            },
            set: function(properties, value) {
                Q._isObject(properties) ? Q._each(properties, this._triggerProperty, this) : this._triggerProperty(value, properties), 
                this.trigger("change");
            },
            inc: function(property, amount) {
                this.set(property, this.get(property) + amount);
            },
            dec: function(property, amount) {
                this.set(property, this.get(property) - amount);
            },
            get: function(property) {
                return this.p[property];
            }
        }), Q.state = new Q.GameState(), Q.reset = function() {
            Q.state.reset();
        }, Q.touchDevice = "undefined" == typeof exports && "ontouchstart" in document, 
        Q.setup = function(id, options) {
            Q._isObject(id) && (options = id, id = null), options = options || {}, id = id || "quintus", 
            Q._isString(id) ? Q.el = document.getElementById(id) : Q.el = id, Q.el || (Q.el = document.createElement("canvas"), 
            Q.el.width = options.width || 320, Q.el.height = options.height || 420, Q.el.id = id, 
            document.body.appendChild(Q.el));
            var w = parseInt(Q.el.width, 10), h = parseInt(Q.el.height, 10), maxWidth = options.maxWidth || 5e3, maxHeight = options.maxHeight || 5e3, resampleWidth = options.resampleWidth, resampleHeight = options.resampleHeight, upsampleWidth = options.upsampleWidth, upsampleHeight = options.upsampleHeight;
            options.maximize === !0 || Q.touchDevice && "touch" === options.maximize ? (document.body.style.padding = 0, 
            document.body.style.margin = 0, w = options.width || Math.min(window.innerWidth, maxWidth) - (options.pagescroll ? 17 : 0), 
            h = options.height || Math.min(window.innerHeight - 5, maxHeight), Q.touchDevice && (Q.el.style.height = 2 * h + "px", 
            window.scrollTo(0, 1), w = Math.min(window.innerWidth, maxWidth), h = Math.min(window.innerHeight, maxHeight))) : Q.touchDevice && window.scrollTo(0, 1), 
            upsampleWidth && upsampleWidth >= w || upsampleHeight && upsampleHeight >= h ? (Q.el.style.height = h + "px", 
            Q.el.style.width = w + "px", Q.el.width = 2 * w, Q.el.height = 2 * h) : (resampleWidth && w > resampleWidth || resampleHeight && h > resampleHeight) && Q.touchDevice ? (Q.el.style.height = h + "px", 
            Q.el.style.width = w + "px", Q.el.width = w / 2, Q.el.height = h / 2) : (Q.el.style.height = h + "px", 
            Q.el.style.width = w + "px", Q.el.width = w, Q.el.height = h);
            var elParent = Q.el.parentNode;
            if (elParent && !Q.wrapper && (Q.wrapper = document.createElement("div"), Q.wrapper.id = Q.el.id + "_container", 
            Q.wrapper.style.width = w + "px", Q.wrapper.style.margin = "0 auto", Q.wrapper.style.position = "relative", 
            elParent.insertBefore(Q.wrapper, Q.el), Q.wrapper.appendChild(Q.el)), Q.el.style.position = "relative", 
            Q.ctx = Q.el.getContext && Q.el.getContext("2d"), Q.width = parseInt(Q.el.width, 10), 
            Q.height = parseInt(Q.el.height, 10), Q.cssWidth = w, Q.cssHeight = h, options.scaleToFit) {
                var factor = 1, winW = window.innerWidth * factor, winH = window.innerHeight * factor, winRatio = winW / winH, gameRatio = Q.el.width / Q.el.height, scaleRatio = winRatio > gameRatio ? winH / Q.el.height : winW / Q.el.width, scaledW = Q.el.width * scaleRatio, scaledH = Q.el.height * scaleRatio;
                if (Q.el.style.width = scaledW + "px", Q.el.style.height = scaledH + "px", Q.el.parentNode && (Q.el.parentNode.style.width = scaledW + "px", 
                Q.el.parentNode.style.height = scaledH + "px"), Q.cssWidth = parseInt(scaledW, 10), 
                Q.cssHeight = parseInt(scaledH, 10), gameRatio > winRatio) {
                    var topPos = (winH - scaledH) / 2;
                    Q.el.style.top = topPos + "px";
                }
            }
            return window.addEventListener("orientationchange", function() {
                setTimeout(function() {
                    window.scrollTo(0, 1);
                }, 0);
            }), Q;
        }, Q.clear = function() {
            Q.clearColor ? (Q.ctx.globalAlpha = 1, Q.ctx.fillStyle = Q.clearColor, Q.ctx.fillRect(0, 0, Q.width, Q.height)) : Q.ctx.clearRect(0, 0, Q.width, Q.height);
        }, Q.setImageSmoothing = function(enabled) {
            Q.ctx.mozImageSmoothingEnabled = enabled, Q.ctx.webkitImageSmoothingEnabled = enabled, 
            Q.ctx.msImageSmoothingEnabled = enabled, Q.ctx.imageSmoothingEnabled = enabled;
        }, Q.imageData = function(img) {
            var canvas = document.createElement("canvas");
            canvas.width = img.width, canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            return ctx.drawImage(img, 0, 0), ctx.getImageData(0, 0, img.width, img.height);
        }, Q.assetTypes = {
            png: "Image",
            jpg: "Image",
            gif: "Image",
            jpeg: "Image",
            ogg: "Audio",
            wav: "Audio",
            m4a: "Audio",
            mp3: "Audio"
        }, Q._fileExtension = function(filename) {
            var fileParts = filename.split("."), fileExt = fileParts[fileParts.length - 1].toLowerCase();
            return fileExt;
        }, Q.assetType = function(asset) {
            var fileExt = Q._fileExtension(asset), fileType = Q.assetTypes[fileExt];
            return "Audio" === fileType && Q.audio && "WebAudio" === Q.audio.type && (fileType = "WebAudio"), 
            fileType || "Other";
        }, Q.assetUrl = function(base, url) {
            var timestamp = "";
            return Q.options.development && (timestamp = (/\?/.test(url) ? "&" : "?") + "_t=" + new Date().getTime()), 
            /^https?:\/\//.test(url) || "/" === url[0] ? url + timestamp : base + url + timestamp;
        }, Q.loadAssetImage = function(key, src, callback, errorCallback) {
            var img = new Image();
            img.onload = function() {
                callback(key, img);
            }, img.onerror = errorCallback, img.src = Q.assetUrl(Q.options.imagePath, src);
        }, Q.audioMimeTypes = {
            mp3: "audio/mpeg",
            ogg: 'audio/ogg; codecs="vorbis"',
            m4a: "audio/m4a",
            wav: "audio/wav"
        }, Q._audioAssetExtension = function() {
            if (Q._audioAssetPreferredExtension) return Q._audioAssetPreferredExtension;
            var snd = new Audio();
            return Q._audioAssetPreferredExtension = Q._detect(Q.options.audioSupported, function(extension) {
                return snd.canPlayType(Q.audioMimeTypes[extension]) ? extension : null;
            });
        }, Q.loadAssetAudio = function(key, src, callback, errorCallback) {
            if (!document.createElement("audio").play || !Q.options.sound) return void callback(key, null);
            var baseName = Q._removeExtension(src), extension = Q._audioAssetExtension(), snd = new Audio();
            return extension ? (snd.addEventListener("error", errorCallback), Q.touchDevice || snd.addEventListener("canplaythrough", function() {
                callback(key, snd);
            }), snd.src = Q.assetUrl(Q.options.audioPath, baseName + "." + extension), snd.load(), 
            void (Q.touchDevice && callback(key, snd))) : void callback(key, null);
        }, Q.loadAssetWebAudio = function(key, src, callback, errorCallback) {
            var request = new XMLHttpRequest(), baseName = Q._removeExtension(src), extension = Q._audioAssetExtension();
            request.open("GET", Q.assetUrl(Q.options.audioPath, baseName + "." + extension), !0), 
            request.responseType = "arraybuffer", request.onload = function() {
                request.response;
                Q.audioContext.decodeAudioData(request.response, function(buffer) {
                    callback(key, buffer);
                }, errorCallback);
            }, request.send();
        }, Q.loadAssetOther = function(key, src, callback, errorCallback) {
            var request = new XMLHttpRequest(), fileParts = src.split("."), fileExt = fileParts[fileParts.length - 1].toLowerCase();
            return "file://" === document.location.origin || "null" === document.location.origin ? (Q.fileURLAlert || (Q.fileURLAlert = !0, 
            alert("Quintus Error: Loading assets is not supported from file:// urls - please run from a local web-server and try again")), 
            errorCallback()) : (request.onreadystatechange = function() {
                4 === request.readyState && (200 === request.status ? "json" === fileExt ? callback(key, JSON.parse(request.responseText)) : callback(key, request.responseText) : errorCallback());
            }, request.open("GET", Q.assetUrl(Q.options.dataPath, src), !0), void request.send(null));
        }, Q._removeExtension = function(filename) {
            return filename.replace(/\.(\w{3,4})$/, "");
        }, Q.assets = {}, Q.asset = function(name) {
            return Q.assets[name];
        }, Q.load = function(assets, callback, options) {
            var assetObj = {};
            options || (options = {});
            var progressCallback = options.progressCallback, errors = !1, errorCallback = function(itm) {
                errors = !0, (options.errorCallback || function(itm) {
                    throw "Error Loading: " + itm;
                })(itm);
            };
            Q._isString(assets) && (assets = Q._normalizeArg(assets)), Q._isArray(assets) ? Q._each(assets, function(itm) {
                Q._isObject(itm) ? Q._extend(assetObj, itm) : assetObj[itm] = itm;
            }) : assetObj = assets;
            var assetsTotal = Q._keys(assetObj).length, assetsRemaining = assetsTotal, loadedCallback = function(key, obj, force) {
                errors || (Q.assets[key] && !force || (Q.assets[key] = obj, assetsRemaining--, progressCallback && progressCallback(assetsTotal - assetsRemaining, assetsTotal)), 
                0 === assetsRemaining && callback && callback.apply(Q));
            };
            Q._each(assetObj, function(itm, key) {
                var assetType = Q.assetType(itm);
                Q.assets[key] ? loadedCallback(key, Q.assets[key], !0) : Q["loadAsset" + assetType](key, itm, loadedCallback, function() {
                    errorCallback(itm);
                });
            });
        }, Q.preloads = [], Q.preload = function(arg, options) {
            Q._isFunction(arg) ? (Q.load(Q._uniq(Q.preloads), arg, options), Q.preloads = []) : Q.preloads = Q.preloads.concat(arg);
        }, Q.matrices2d = [], Q.matrix2d = function() {
            return Q.matrices2d.length > 0 ? Q.matrices2d.pop().identity() : new Q.Matrix2D();
        }, Q.Matrix2D = Q.Class.extend({
            init: function(source) {
                source ? (this.m = [], this.clone(source)) : this.m = [ 1, 0, 0, 0, 1, 0 ];
            },
            identity: function() {
                var m = this.m;
                return m[0] = 1, m[1] = 0, m[2] = 0, m[3] = 0, m[4] = 1, m[5] = 0, this;
            },
            clone: function(matrix) {
                var d = this.m, s = matrix.m;
                return d[0] = s[0], d[1] = s[1], d[2] = s[2], d[3] = s[3], d[4] = s[4], d[5] = s[5], 
                this;
            },
            multiply: function(matrix) {
                var a = this.m, b = matrix.m, m11 = a[0] * b[0] + a[1] * b[3], m12 = a[0] * b[1] + a[1] * b[4], m13 = a[0] * b[2] + a[1] * b[5] + a[2], m21 = a[3] * b[0] + a[4] * b[3], m22 = a[3] * b[1] + a[4] * b[4], m23 = a[3] * b[2] + a[4] * b[5] + a[5];
                return a[0] = m11, a[1] = m12, a[2] = m13, a[3] = m21, a[4] = m22, a[5] = m23, this;
            },
            rotate: function(radians) {
                if (0 === radians) return this;
                var cos = Math.cos(radians), sin = Math.sin(radians), m = this.m, m11 = m[0] * cos + m[1] * sin, m12 = m[0] * -sin + m[1] * cos, m21 = m[3] * cos + m[4] * sin, m22 = m[3] * -sin + m[4] * cos;
                return m[0] = m11, m[1] = m12, m[3] = m21, m[4] = m22, this;
            },
            rotateDeg: function(degrees) {
                return 0 === degrees ? this : this.rotate(Math.PI * degrees / 180);
            },
            scale: function(sx, sy) {
                var m = this.m;
                return void 0 === sy && (sy = sx), m[0] *= sx, m[1] *= sy, m[3] *= sx, m[4] *= sy, 
                this;
            },
            translate: function(tx, ty) {
                var m = this.m;
                return m[2] += m[0] * tx + m[1] * ty, m[5] += m[3] * tx + m[4] * ty, this;
            },
            transform: function(x, y) {
                return [ x * this.m[0] + y * this.m[1] + this.m[2], x * this.m[3] + y * this.m[4] + this.m[5] ];
            },
            transformPt: function(obj) {
                var x = obj.x, y = obj.y;
                return obj.x = x * this.m[0] + y * this.m[1] + this.m[2], obj.y = x * this.m[3] + y * this.m[4] + this.m[5], 
                obj;
            },
            transformArr: function(inArr, outArr) {
                var x = inArr[0], y = inArr[1];
                return outArr[0] = x * this.m[0] + y * this.m[1] + this.m[2], outArr[1] = x * this.m[3] + y * this.m[4] + this.m[5], 
                outArr;
            },
            transformX: function(x, y) {
                return x * this.m[0] + y * this.m[1] + this.m[2];
            },
            transformY: function(x, y) {
                return x * this.m[3] + y * this.m[4] + this.m[5];
            },
            release: function() {
                return Q.matrices2d.push(this), null;
            },
            setContextTransform: function(ctx) {
                var m = this.m;
                ctx.transform(m[0], m[3], m[1], m[4], m[2], m[5]);
            }
        }), Q;
    };
    return function() {
        if ("undefined" != typeof window) {
            for (var lastTime = 0, vendors = [ "ms", "moz", "webkit", "o" ], x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"], 
            window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame"] || window[vendors[x] + "CancelRequestAnimationFrame"];
            window.requestAnimationFrame || (window.requestAnimationFrame = function(callback, element) {
                var currTime = new Date().getTime(), timeToCall = Math.max(0, 16 - (currTime - lastTime)), id = setTimeout(function() {
                    callback(currTime + timeToCall);
                }, timeToCall);
                return lastTime = currTime + timeToCall, id;
            }), window.cancelAnimationFrame || (window.cancelAnimationFrame = function(id) {
                clearTimeout(id);
            });
        }
    }(), Quintus;
};

if ("undefined" == typeof exports) quintusCore(this, "Quintus"); else var Quintus = quintusCore(module, "exports");

var quintus2D = function(Quintus) {
    "use strict";
    Quintus["2D"] = function(Q) {
        Q.component("viewport", {
            added: function() {
                this.entity.on("prerender", this, "prerender"), this.entity.on("render", this, "postrender"), 
                this.x = 0, this.y = 0, this.offsetX = 0, this.offsetY = 0, this.centerX = Q.width / 2, 
                this.centerY = Q.height / 2, this.scale = 1;
            },
            extend: {
                follow: function(sprite, directions, boundingBox) {
                    this.off("poststep", this.viewport, "follow"), this.viewport.directions = directions || {
                        x: !0,
                        y: !0
                    }, this.viewport.following = sprite, Q._isUndefined(boundingBox) && void 0 !== this.lists.TileLayer ? this.viewport.boundingBox = Q._detect(this.lists.TileLayer, function(layer) {
                        return layer.p.boundingBox ? {
                            minX: 0,
                            maxX: layer.p.w,
                            minY: 0,
                            maxY: layer.p.h
                        } : null;
                    }) : this.viewport.boundingBox = boundingBox, this.on("poststep", this.viewport, "follow"), 
                    this.viewport.follow(!0);
                },
                unfollow: function() {
                    this.off("poststep", this.viewport, "follow");
                },
                centerOn: function(x, y) {
                    this.viewport.centerOn(x, y);
                },
                moveTo: function(x, y) {
                    return this.viewport.moveTo(x, y);
                }
            },
            follow: function(first) {
                var followX = Q._isFunction(this.directions.x) ? this.directions.x(this.following) : this.directions.x, followY = Q._isFunction(this.directions.y) ? this.directions.y(this.following) : this.directions.y;
                this[first === !0 ? "centerOn" : "softCenterOn"](followX ? this.following.p.x - this.offsetX : void 0, followY ? this.following.p.y - this.offsetY : void 0);
            },
            offset: function(x, y) {
                this.offsetX = x, this.offsetY = y;
            },
            softCenterOn: function(x, y) {
                if (void 0 !== x) {
                    var dx = (x - Q.width / 2 / this.scale - this.x) / 3;
                    this.boundingBox ? this.x + dx < this.boundingBox.minX ? this.x = this.boundingBox.minX / this.scale : this.x + dx > (this.boundingBox.maxX - Q.width) / this.scale ? this.x = Math.max(this.boundingBox.maxX - Q.width, this.boundingBox.minX) / this.scale : this.x += dx : this.x += dx;
                }
                if (void 0 !== y) {
                    var dy = (y - Q.height / 2 / this.scale - this.y) / 3;
                    this.boundingBox ? this.y + dy < this.boundingBox.minY ? this.y = this.boundingBox.minY / this.scale : this.y + dy > (this.boundingBox.maxY - Q.height) / this.scale ? this.y = Math.max(this.boundingBox.maxY - Q.height, this.boundingBox.minY) / this.scale : this.y += dy : this.y += dy;
                }
            },
            centerOn: function(x, y) {
                void 0 !== x && (this.x = x - Q.width / 2 / this.scale), void 0 !== y && (this.y = y - Q.height / 2 / this.scale);
            },
            moveTo: function(x, y) {
                return void 0 !== x && (this.x = x), void 0 !== y && (this.y = y), this.entity;
            },
            prerender: function() {
                this.centerX = this.x + Q.width / 2 / this.scale, this.centerY = this.y + Q.height / 2 / this.scale, 
                Q.ctx.save(), Q.ctx.translate(Math.floor(Q.width / 2), Math.floor(Q.height / 2)), 
                Q.ctx.scale(this.scale, this.scale), Q.ctx.translate(-Math.floor(this.centerX), -Math.floor(this.centerY));
            },
            postrender: function() {
                Q.ctx.restore();
            }
        }), Q.Sprite.extend("TileLayer", {
            init: function(props) {
                this._super(props, {
                    tileW: 32,
                    tileH: 32,
                    blockTileW: 10,
                    blockTileH: 10,
                    type: 1,
                    renderAlways: !0
                }), this.p.dataAsset && this.load(this.p.dataAsset), this.setDimensions(), this.blocks = [], 
                this.p.blockW = this.p.tileW * this.p.blockTileW, this.p.blockH = this.p.tileH * this.p.blockTileH, 
                this.colBounds = {}, this.directions = [ "top", "left", "right", "bottom" ], this.tileProperties = {}, 
                this.collisionObject = {
                    p: {
                        w: this.p.tileW,
                        h: this.p.tileH,
                        cx: this.p.tileW / 2,
                        cy: this.p.tileH / 2
                    }
                }, this.tileCollisionObjects = {}, this.collisionNormal = {
                    separate: []
                }, this._generateCollisionObjects();
            },
            _generateCollisionObjects: function() {
                function returnPoint(pt) {
                    return [ pt[0] * self.p.tileW - self.p.tileW / 2, pt[1] * self.p.tileH - self.p.tileH / 2 ];
                }
                var self = this;
                if (this.sheet() && this.sheet().frameProperties) {
                    var frameProperties = this.sheet().frameProperties;
                    for (var k in frameProperties) {
                        var colObj = this.tileCollisionObjects[k] = {
                            p: Q._clone(this.collisionObject.p)
                        };
                        Q._extend(colObj.p, frameProperties[k]), colObj.p.points && (colObj.p.points = Q._map(colObj.p.points, returnPoint)), 
                        this.tileCollisionObjects[k] = colObj;
                    }
                }
            },
            load: function(dataAsset) {
                var data, fileParts = dataAsset.split("."), fileExt = fileParts[fileParts.length - 1].toLowerCase();
                if ("json" !== fileExt) throw "file type not supported";
                data = Q._isString(dataAsset) ? Q.asset(dataAsset) : dataAsset, this.p.tiles = data;
            },
            setDimensions: function() {
                var tiles = this.p.tiles;
                tiles && (this.p.rows = tiles.length, this.p.cols = tiles[0].length, this.p.w = this.p.cols * this.p.tileW, 
                this.p.h = this.p.rows * this.p.tileH);
            },
            getTile: function(tileX, tileY) {
                return this.p.tiles[tileY] && this.p.tiles[tileY][tileX];
            },
            getTileProperty: function(tile, prop) {
                return void 0 !== this.tileProperties[tile] ? this.tileProperties[tile][prop] : void 0;
            },
            getTileProperties: function(tile) {
                return void 0 !== this.tileProperties[tile] ? this.tileProperties[tile] : {};
            },
            getTilePropertyAt: function(tileX, tileY, prop) {
                return this.getTileProperty(this.getTile(tileX, tileY), prop);
            },
            getTilePropertiesAt: function(tileX, tileY) {
                return this.getTileProperties(this.getTile(tileX, tileY));
            },
            tileHasProperty: function(tile, prop) {
                return void 0 !== this.getTileProperty(tile, prop);
            },
            setTile: function(x, y, tile) {
                var p = this.p, blockX = Math.floor(x / p.blockTileW), blockY = Math.floor(y / p.blockTileH);
                x >= 0 && x < this.p.cols && y >= 0 && y < this.p.rows && (this.p.tiles[y][x] = tile, 
                this.blocks[blockY] && (this.blocks[blockY][blockX] = null));
            },
            tilePresent: function(tileX, tileY) {
                return this.p.tiles[tileY] && this.collidableTile(this.p.tiles[tileY][tileX]);
            },
            drawableTile: function(tileNum) {
                return tileNum > 0;
            },
            collidableTile: function(tileNum) {
                return tileNum > 0;
            },
            getCollisionObject: function(tileX, tileY) {
                var colObj, p = this.p, tile = this.getTile(tileX, tileY);
                return colObj = void 0 !== this.tileCollisionObjects[tile] ? this.tileCollisionObjects[tile] : this.collisionObject, 
                colObj.p.x = tileX * p.tileW + p.x + p.tileW / 2, colObj.p.y = tileY * p.tileH + p.y + p.tileH / 2, 
                colObj;
            },
            collide: function(obj) {
                var col, colObj, p = this.p, objP = obj.c || obj.p, tileStartX = Math.floor((objP.x - objP.cx - p.x) / p.tileW), tileStartY = Math.floor((objP.y - objP.cy - p.y) / p.tileH), tileEndX = Math.ceil((objP.x - objP.cx + objP.w - p.x) / p.tileW), tileEndY = Math.ceil((objP.y - objP.cy + objP.h - p.y) / p.tileH), normal = this.collisionNormal;
                normal.collided = !1;
                for (var tileY = tileStartY; tileEndY >= tileY; tileY++) for (var tileX = tileStartX; tileEndX >= tileX; tileX++) this.tilePresent(tileX, tileY) && (colObj = this.getCollisionObject(tileX, tileY), 
                col = Q.collision(obj, colObj), col && col.magnitude > 0 && (colObj.p.sensor ? (colObj.tile = this.getTile(tileX, tileY), 
                obj.trigger && obj.trigger("sensor.tile", colObj)) : (!normal.collided || normal.magnitude < col.magnitude) && (normal.collided = !0, 
                normal.separate[0] = col.separate[0], normal.separate[1] = col.separate[1], normal.magnitude = col.magnitude, 
                normal.distance = col.distance, normal.normalX = col.normalX, normal.normalY = col.normalY, 
                normal.tileX = tileX, normal.tileY = tileY, normal.tile = this.getTile(tileX, tileY), 
                void 0 !== obj.p.collisions && obj.p.collisions.push(normal))));
                return normal.collided ? normal : !1;
            },
            prerenderBlock: function(blockX, blockY) {
                var p = this.p, tiles = p.tiles, sheet = this.sheet(), blockOffsetX = blockX * p.blockTileW, blockOffsetY = blockY * p.blockTileH;
                if (!(0 > blockOffsetX || blockOffsetX >= this.p.cols || 0 > blockOffsetY || blockOffsetY >= this.p.rows)) {
                    var canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
                    canvas.width = p.blockW, canvas.height = p.blockH, this.blocks[blockY] = this.blocks[blockY] || {}, 
                    this.blocks[blockY][blockX] = canvas;
                    for (var y = 0; y < p.blockTileH; y++) if (tiles[y + blockOffsetY]) for (var x = 0; x < p.blockTileW; x++) this.drawableTile(tiles[y + blockOffsetY][x + blockOffsetX]) && sheet.draw(ctx, x * p.tileW, y * p.tileH, tiles[y + blockOffsetY][x + blockOffsetX]);
                }
            },
            drawBlock: function(ctx, blockX, blockY) {
                var p = this.p, startX = Math.floor(blockX * p.blockW + p.x), startY = Math.floor(blockY * p.blockH + p.y);
                this.blocks[blockY] && this.blocks[blockY][blockX] || this.prerenderBlock(blockX, blockY), 
                this.blocks[blockY] && this.blocks[blockY][blockX] && ctx.drawImage(this.blocks[blockY][blockX], startX, startY);
            },
            draw: function(ctx) {
                for (var p = this.p, viewport = this.stage.viewport, scale = viewport ? viewport.scale : 1, x = viewport ? viewport.x : 0, y = viewport ? viewport.y : 0, viewW = Q.width / scale, viewH = Q.height / scale, startBlockX = Math.floor((x - p.x) / p.blockW), startBlockY = Math.floor((y - p.y) / p.blockH), endBlockX = Math.floor((x + viewW - p.x) / p.blockW), endBlockY = Math.floor((y + viewH - p.y) / p.blockH), iy = startBlockY; endBlockY >= iy; iy++) for (var ix = startBlockX; endBlockX >= ix; ix++) this.drawBlock(ctx, ix, iy);
            }
        }), Q.gravityY = 9.8 * 100, Q.gravityX = 0, Q.component("2d", {
            added: function() {
                var entity = this.entity;
                Q._defaults(entity.p, {
                    vx: 0,
                    vy: 0,
                    ax: 0,
                    ay: 0,
                    gravity: 1,
                    collisionMask: Q.SPRITE_DEFAULT
                }), entity.on("step", this, "step"), entity.on("hit", this, "collision");
            },
            collision: function(col, last) {
                var entity = this.entity, p = entity.p;
                if (col.obj.p && col.obj.p.sensor) return void col.obj.trigger("sensor", entity);
                col.impact = 0;
                var impactX = Math.abs(p.vx), impactY = Math.abs(p.vy);
                p.x -= col.separate[0], p.y -= col.separate[1], col.normalY < -.3 && (!p.skipCollide && p.vy > 0 && (p.vy = 0), 
                col.impact = impactY, entity.trigger("bump.bottom", col), entity.trigger("bump", col)), 
                col.normalY > .3 && (!p.skipCollide && p.vy < 0 && (p.vy = 0), col.impact = impactY, 
                entity.trigger("bump.top", col), entity.trigger("bump", col)), col.normalX < -.3 && (!p.skipCollide && p.vx > 0 && (p.vx = 0), 
                col.impact = impactX, entity.trigger("bump.right", col), entity.trigger("bump", col)), 
                col.normalX > .3 && (!p.skipCollide && p.vx < 0 && (p.vx = 0), col.impact = impactX, 
                entity.trigger("bump.left", col), entity.trigger("bump", col));
            },
            step: function(dt) {
                for (var p = this.entity.p, dtStep = dt; dtStep > 0; ) dt = Math.min(1 / 30, dtStep), 
                p.vx += p.ax * dt + (void 0 === p.gravityX ? Q.gravityX : p.gravityX) * dt * p.gravity, 
                p.vy += p.ay * dt + (void 0 === p.gravityY ? Q.gravityY : p.gravityY) * dt * p.gravity, 
                p.x += p.vx * dt, p.y += p.vy * dt, this.entity.stage.collide(this.entity), dtStep -= dt;
            }
        }), Q.component("aiBounce", {
            added: function() {
                this.entity.on("bump.right", this, "goLeft"), this.entity.on("bump.left", this, "goRight");
            },
            goLeft: function(col) {
                this.entity.p.vx = -col.impact, "right" === this.entity.p.defaultDirection ? this.entity.p.flip = "x" : this.entity.p.flip = !1;
            },
            goRight: function(col) {
                this.entity.p.vx = col.impact, "left" === this.entity.p.defaultDirection ? this.entity.p.flip = "x" : this.entity.p.flip = !1;
            }
        });
    };
};

"undefined" == typeof Quintus ? module.exports = quintus2D : quintus2D(Quintus);

var quintusAnim = function(Quintus) {
    "use strict";
    Quintus.Anim = function(Q) {
        Q._animations = {}, Q.animations = function(sprite, animations) {
            Q._animations[sprite] || (Q._animations[sprite] = {}), Q._extend(Q._animations[sprite], animations);
        }, Q.animation = function(sprite, name) {
            return Q._animations[sprite] && Q._animations[sprite][name];
        }, Q.component("animation", {
            added: function() {
                var p = this.entity.p;
                p.animation = null, p.animationPriority = -1, p.animationFrame = 0, p.animationTime = 0, 
                this.entity.on("step", this, "step");
            },
            extend: {
                play: function(name, priority, resetFrame) {
                    this.animation.play(name, priority, resetFrame);
                }
            },
            step: function(dt) {
                var entity = this.entity, p = entity.p;
                if (p.animation) {
                    var anim = Q.animation(p.sprite, p.animation), rate = anim.rate || p.rate, stepped = 0;
                    if (p.animationTime += dt, p.animationChanged ? p.animationChanged = !1 : p.animationTime > rate && (stepped = Math.floor(p.animationTime / rate), 
                    p.animationTime -= stepped * rate, p.animationFrame += stepped), stepped > 0) {
                        if (p.animationFrame >= anim.frames.length) {
                            if (anim.loop === !1 || anim.next) return p.animationFrame = anim.frames.length - 1, 
                            entity.trigger("animEnd"), entity.trigger("animEnd." + p.animation), p.animation = null, 
                            p.animationPriority = -1, anim.trigger && entity.trigger(anim.trigger, anim.triggerData), 
                            void (anim.next && this.play(anim.next, anim.nextPriority));
                            entity.trigger("animLoop"), entity.trigger("animLoop." + p.animation), p.animationFrame = p.animationFrame % anim.frames.length;
                        }
                        entity.trigger("animFrame");
                    }
                    p.sheet = anim.sheet || p.sheet, p.frame = anim.frames[p.animationFrame], anim.hasOwnProperty("flip") && (p.flip = anim.flip);
                }
            },
            play: function(name, priority, resetFrame) {
                var entity = this.entity, p = entity.p;
                priority = priority || 0, name !== p.animation && priority >= p.animationPriority && (void 0 === resetFrame && (resetFrame = !0), 
                p.animation = name, resetFrame && (p.animationChanged = !0, p.animationTime = 0, 
                p.animationFrame = 0), p.animationPriority = priority, entity.trigger("anim"), entity.trigger("anim." + p.animation));
            }
        }), Q.Sprite.extend("Repeater", {
            init: function(props) {
                this._super(Q._defaults(props, {
                    speedX: 1,
                    speedY: 1,
                    repeatY: !0,
                    repeatX: !0,
                    renderAlways: !0,
                    type: 0
                })), this.p.repeatW = this.p.repeatW || this.p.w, this.p.repeatH = this.p.repeatH || this.p.h;
            },
            draw: function(ctx) {
                var curX, curY, startX, endX, endY, p = this.p, asset = this.asset(), sheet = this.sheet(), scale = this.stage.viewport ? this.stage.viewport.scale : 1, viewX = Math.floor(this.stage.viewport ? this.stage.viewport.x : 0), viewY = Math.floor(this.stage.viewport ? this.stage.viewport.y : 0), offsetX = Math.floor(p.x + viewX * this.p.speedX), offsetY = Math.floor(p.y + viewY * this.p.speedY);
                for (p.repeatX ? (curX = -offsetX % p.repeatW, curX > 0 && (curX -= p.repeatW)) : curX = p.x - viewX, 
                p.repeatY ? (curY = -offsetY % p.repeatH, curY > 0 && (curY -= p.repeatH)) : curY = p.y - viewY, 
                startX = curX, endX = Q.width / Math.abs(scale) / Math.abs(p.scale || 1) + p.repeatW, 
                endY = Q.height / Math.abs(scale) / Math.abs(p.scale || 1) + p.repeatH; endY > curY; ) {
                    for (curX = startX; endX > curX && (sheet ? sheet.draw(ctx, curX + viewX, curY + viewY, p.frame) : ctx.drawImage(asset, curX + viewX, curY + viewY), 
                    curX += p.repeatW, p.repeatX); ) ;
                    if (curY += p.repeatH, !p.repeatY) break;
                }
            }
        }), Q.Tween = Q.Class.extend({
            init: function(entity, properties, duration, easing, options) {
                Q._isObject(easing) && (options = easing, easing = Q.Easing.Linear), Q._isObject(duration) && (options = duration, 
                duration = 1), this.entity = entity, this.duration = duration || 1, this.time = 0, 
                this.options = options || {}, this.delay = this.options.delay || 0, this.easing = easing || this.options.easing || Q.Easing.Linear, 
                this.startFrame = Q._loopFrame + 1, this.properties = properties, this.start = {}, 
                this.diff = {};
            },
            step: function(dt) {
                var property;
                if (this.startFrame > Q._loopFrame) return !0;
                if (this.delay >= dt) return this.delay -= dt, !0;
                if (this.delay > 0 && (dt -= this.delay, this.delay = 0), 0 === this.time) {
                    var entity = this.entity, properties = this.properties;
                    this.p = entity instanceof Q.Stage ? entity.viewport : entity.p;
                    for (property in properties) this.start[property] = this.p[property], Q._isUndefined(this.start[property]) || (this.diff[property] = properties[property] - this.start[property]);
                }
                this.time += dt;
                var progress = Math.min(1, this.time / this.duration), location = this.easing(progress);
                for (property in this.start) Q._isUndefined(this.p[property]) || (this.p[property] = this.start[property] + this.diff[property] * location);
                return progress >= 1 && this.options.callback && this.options.callback.apply(this.entity), 
                1 > progress;
            }
        }), Q.Easing = {
            Linear: function(k) {
                return k;
            },
            Quadratic: {
                In: function(k) {
                    return k * k;
                },
                Out: function(k) {
                    return k * (2 - k);
                },
                InOut: function(k) {
                    return (k *= 2) < 1 ? .5 * k * k : -.5 * (--k * (k - 2) - 1);
                }
            }
        }, Q.component("tween", {
            added: function() {
                this._tweens = [], this.entity.on("step", this, "step");
            },
            extend: {
                animate: function(properties, duration, easing, options) {
                    return this.tween._tweens.push(new Q.Tween(this, properties, duration, easing, options)), 
                    this;
                },
                chain: function(properties, duration, easing, options) {
                    Q._isObject(easing) && (options = easing, easing = Q.Easing.Linear);
                    var tweenCnt = this.tween._tweens.length;
                    if (tweenCnt > 0) {
                        var lastTween = this.tween._tweens[tweenCnt - 1];
                        options = options || {}, options.delay = lastTween.duration - lastTween.time + lastTween.delay;
                    }
                    return this.animate(properties, duration, easing, options), this;
                },
                stop: function() {
                    return this.tween._tweens.length = 0, this;
                }
            },
            step: function(dt) {
                for (var i = 0; i < this._tweens.length; i++) this._tweens[i].step(dt) || (this._tweens.splice(i, 1), 
                i--);
            }
        });
    };
};

"undefined" == typeof Quintus ? module.exports = quintusAnim : quintusAnim(Quintus);

var quintusAudio = function(Quintus) {
    "use strict";
    Quintus.Audio = function(Q) {
        Q.audio = {
            channels: [],
            channelMax: Q.options.channelMax || 10,
            active: {},
            play: function() {}
        }, Q.hasWebAudio = "undefined" != typeof AudioContext || "undefined" != typeof webkitAudioContext, 
        Q.hasWebAudio && ("undefined" != typeof AudioContext ? Q.audioContext = new AudioContext() : Q.audioContext = new window.webkitAudioContext()), 
        Q.enableSound = function() {
            "undefined" != typeof window && !!("ontouchstart" in window);
            return Q.hasWebAudio ? Q.audio.enableWebAudioSound() : Q.audio.enableHTML5Sound(), 
            Q;
        }, Q.audio.enableWebAudioSound = function() {
            Q.audio.type = "WebAudio", Q.audio.soundID = 0, Q.audio.playingSounds = {}, Q.audio.removeSound = function(soundID) {
                delete Q.audio.playingSounds[soundID];
            }, Q.audio.play = function(s, options) {
                var now = new Date().getTime();
                if (!(Q.audio.active[s] && Q.audio.active[s] > now)) {
                    options && options.debounce ? Q.audio.active[s] = now + options.debounce : delete Q.audio.active[s];
                    var soundID = Q.audio.soundID++, source = Q.audioContext.createBufferSource();
                    source.buffer = Q.asset(s), source.connect(Q.audioContext.destination), options && options.loop ? source.loop = !0 : setTimeout(function() {
                        Q.audio.removeSound(soundID);
                    }, 1e3 * source.buffer.duration), source.assetName = s, source.start ? source.start(0) : source.noteOn(0), 
                    Q.audio.playingSounds[soundID] = source;
                }
            }, Q.audio.stop = function(s) {
                for (var key in Q.audio.playingSounds) {
                    var snd = Q.audio.playingSounds[key];
                    s && s !== snd.assetName || (snd.stop ? snd.stop(0) : snd.noteOff(0));
                }
            };
        }, Q.audio.enableHTML5Sound = function() {
            Q.audio.type = "HTML5";
            for (var i = 0; i < Q.audio.channelMax; i++) Q.audio.channels[i] = {}, Q.audio.channels[i].channel = new Audio(), 
            Q.audio.channels[i].finished = -1;
            Q.audio.play = function(s, options) {
                var now = new Date().getTime();
                if (!(Q.audio.active[s] && Q.audio.active[s] > now)) {
                    options && options.debounce ? Q.audio.active[s] = now + options.debounce : delete Q.audio.active[s];
                    for (var i = 0; i < Q.audio.channels.length; i++) if (!Q.audio.channels[i].loop && Q.audio.channels[i].finished < now) {
                        Q.audio.channels[i].channel.src = Q.asset(s).src, options && options.loop ? (Q.audio.channels[i].loop = !0, 
                        Q.audio.channels[i].channel.loop = !0) : Q.audio.channels[i].finished = now + 1e3 * Q.asset(s).duration, 
                        Q.audio.channels[i].channel.load(), Q.audio.channels[i].channel.play();
                        break;
                    }
                }
            }, Q.audio.stop = function(s) {
                for (var src = s ? Q.asset(s).src : null, tm = new Date().getTime(), i = 0; i < Q.audio.channels.length; i++) src && Q.audio.channels[i].channel.src !== src || !(Q.audio.channels[i].loop || Q.audio.channels[i].finished >= tm) || (Q.audio.channels[i].channel.pause(), 
                Q.audio.channels[i].loop = !1);
            };
        };
    };
};

"undefined" == typeof Quintus ? module.exports = quintusAudio : quintusAudio(Quintus);

var quintusInput = function(Quintus) {
    "use strict";
    Quintus.Input = function(Q) {
        var KEY_NAMES = Q.KEY_NAMES = {
            LEFT: 37,
            RIGHT: 39,
            UP: 38,
            DOWN: 40,
            ZERO: 48,
            ONE: 49,
            TWO: 50,
            THREE: 51,
            FOUR: 52,
            FIVE: 53,
            SIX: 54,
            SEVEN: 55,
            EIGHT: 56,
            NINE: 57,
            A: 65,
            B: 66,
            C: 67,
            D: 68,
            E: 69,
            F: 70,
            G: 71,
            H: 72,
            I: 73,
            J: 74,
            K: 75,
            L: 76,
            M: 77,
            N: 78,
            O: 79,
            P: 80,
            Q: 81,
            R: 82,
            S: 83,
            T: 84,
            U: 85,
            V: 86,
            W: 87,
            X: 88,
            Y: 89,
            Z: 90,
            ENTER: 13,
            ESC: 27,
            BACKSPACE: 8,
            TAB: 9,
            SHIFT: 16,
            CTRL: 17,
            ALT: 18,
            SPACE: 32,
            HOME: 36,
            END: 35,
            PGGUP: 33,
            PGDOWN: 34
        }, DEFAULT_KEYS = {
            LEFT: "left",
            RIGHT: "right",
            UP: "up",
            DOWN: "down",
            SPACE: "fire",
            Z: "fire",
            X: "action",
            ENTER: "confirm",
            ESC: "esc",
            P: "P",
            S: "S"
        }, DEFAULT_TOUCH_CONTROLS = [ [ "left", "<" ], [ "right", ">" ], [], [ "action", "b" ], [ "fire", "a" ] ], DEFAULT_JOYPAD_INPUTS = [ "up", "right", "down", "left" ];
        Q.inputs = {}, Q.joypad = {};
        var hasTouch = !!("ontouchstart" in window);
        Q.canvasToStageX = function(x, stage) {
            return x = x / Q.cssWidth * Q.width, stage.viewport && (x /= stage.viewport.scale, 
            x += stage.viewport.x), x;
        }, Q.canvasToStageY = function(y, stage) {
            return y = y / Q.cssWidth * Q.width, stage.viewport && (y /= stage.viewport.scale, 
            y += stage.viewport.y), y;
        }, Q.InputSystem = Q.Evented.extend({
            keys: {},
            keypad: {},
            keyboardEnabled: !1,
            touchEnabled: !1,
            joypadEnabled: !1,
            bindKey: function(key, name) {
                Q.input.keys[KEY_NAMES[key] || key] = name;
            },
            enableKeyboard: function() {
                return this.keyboardEnabled ? !1 : (Q.el.tabIndex = 0, Q.el.style.outline = 0, Q.el.addEventListener("keydown", function(e) {
                    if (Q.input.keys[e.keyCode]) {
                        var actionName = Q.input.keys[e.keyCode];
                        Q.inputs[actionName] = !0, Q.input.trigger(actionName), Q.input.trigger("keydown", e.keyCode);
                    }
                    e.ctrlKey || e.metaKey || e.preventDefault();
                }, !1), Q.el.addEventListener("keyup", function(e) {
                    if (Q.input.keys[e.keyCode]) {
                        var actionName = Q.input.keys[e.keyCode];
                        Q.inputs[actionName] = !1, Q.input.trigger(actionName + "Up"), Q.input.trigger("keyup", e.keyCode);
                    }
                    e.preventDefault();
                }, !1), Q.options.autoFocus && Q.el.focus(), void (this.keyboardEnabled = !0));
            },
            keyboardControls: function(keys) {
                keys = keys || DEFAULT_KEYS, Q._each(keys, function(name, key) {
                    this.bindKey(key, name);
                }, Q.input), this.enableKeyboard();
            },
            _containerOffset: function() {
                Q.input.offsetX = 0, Q.input.offsetY = 0;
                var el = Q.el;
                do Q.input.offsetX += el.offsetLeft, Q.input.offsetY += el.offsetTop; while (el = el.offsetParent);
            },
            touchLocation: function(touch) {
                var touchX, touchY, posX = (Q.el, touch.offsetX), posY = touch.offsetY;
                return (Q._isUndefined(posX) || Q._isUndefined(posY)) && (posX = touch.layerX, posY = touch.layerY), 
                (Q._isUndefined(posX) || Q._isUndefined(posY)) && (void 0 === Q.input.offsetX && Q.input._containerOffset(), 
                posX = touch.pageX - Q.input.offsetX, posY = touch.pageY - Q.input.offsetY), touchX = Q.width * posX / Q.cssWidth, 
                touchY = Q.height * posY / Q.cssHeight, {
                    x: touchX,
                    y: touchY
                };
            },
            touchControls: function(opts) {
                function getKey(touch) {
                    for (var pos = Q.input.touchLocation(touch), minY = opts.bottom - opts.unit, i = 0, len = opts.controls.length; len > i; i++) {
                        var minX = i * opts.unit + opts.gutter;
                        if (pos.x >= minX && pos.x <= minX + opts.size && (opts.fullHeight || pos.y >= minY + opts.gutter && pos.y <= minY + opts.unit - opts.gutter)) return opts.controls[i][0];
                    }
                }
                function touchDispatch(event) {
                    var i, len, tch, key, actionName, wasOn = {};
                    for (i = 0, len = opts.controls.length; len > i; i++) actionName = opts.controls[i][0], 
                    Q.inputs[actionName] && (wasOn[actionName] = !0), Q.inputs[actionName] = !1;
                    var touches = event.touches ? event.touches : [ event ];
                    for (i = 0, len = touches.length; len > i; i++) tch = touches[i], key = getKey(tch), 
                    key && (Q.inputs[key] = !0, wasOn[key] ? delete wasOn[key] : Q.input.trigger(key));
                    for (actionName in wasOn) Q.input.trigger(actionName + "Up");
                    return null;
                }
                return this.touchEnabled ? !1 : hasTouch ? (Q.input.keypad = opts = Q._extend({
                    left: 0,
                    gutter: 10,
                    controls: DEFAULT_TOUCH_CONTROLS,
                    width: Q.width,
                    bottom: Q.height,
                    fullHeight: !1
                }, opts), opts.unit = opts.width / opts.controls.length, opts.size = opts.unit - 2 * opts.gutter, 
                this.touchDispatchHandler = function(e) {
                    touchDispatch(e), e.preventDefault();
                }, Q._each([ "touchstart", "touchend", "touchmove", "touchcancel" ], function(evt) {
                    Q.el.addEventListener(evt, this.touchDispatchHandler);
                }, this), void (this.touchEnabled = !0)) : !1;
            },
            disableTouchControls: function() {
                Q._each([ "touchstart", "touchend", "touchmove", "touchcancel" ], function(evt) {
                    Q.el.removeEventListener(evt, this.touchDispatchHandler);
                }, this), Q.el.removeEventListener("touchstart", this.joypadStart), Q.el.removeEventListener("touchmove", this.joypadMove), 
                Q.el.removeEventListener("touchend", this.joypadEnd), Q.el.removeEventListener("touchcancel", this.joypadEnd), 
                this.touchEnabled = !1;
                for (var input in Q.inputs) Q.inputs[input] = !1;
            },
            joypadControls: function(opts) {
                if (this.joypadEnabled) return !1;
                if (!hasTouch) return !1;
                var joypad = Q.joypad = Q._defaults(opts || {}, {
                    size: 50,
                    trigger: 20,
                    center: 25,
                    color: "#CCC",
                    background: "#000",
                    alpha: .5,
                    zone: Q.width / 2,
                    joypadTouch: null,
                    inputs: DEFAULT_JOYPAD_INPUTS,
                    triggers: []
                });
                this.joypadStart = function(evt) {
                    if (null === joypad.joypadTouch) {
                        var touch = evt.changedTouches[0], loc = Q.input.touchLocation(touch);
                        loc.x < joypad.zone && (joypad.joypadTouch = touch.identifier, joypad.centerX = loc.x, 
                        joypad.centerY = loc.y, joypad.x = null, joypad.y = null);
                    }
                }, this.joypadMove = function(e) {
                    if (null !== joypad.joypadTouch) for (var evt = e, i = 0, len = evt.changedTouches.length; len > i; i++) {
                        var touch = evt.changedTouches[i];
                        if (touch.identifier === joypad.joypadTouch) {
                            var loc = Q.input.touchLocation(touch), dx = loc.x - joypad.centerX, dy = loc.y - joypad.centerY, dist = Math.sqrt(dx * dx + dy * dy), overage = Math.max(1, dist / joypad.size), ang = Math.atan2(dx, dy);
                            overage > 1 && (dx /= overage, dy /= overage, dist /= overage);
                            for (var triggers = [ dy < -joypad.trigger, dx > joypad.trigger, dy > joypad.trigger, dx < -joypad.trigger ], k = 0; k < triggers.length; k++) {
                                var actionName = joypad.inputs[k];
                                triggers[k] ? (Q.inputs[actionName] = !0, joypad.triggers[k] || Q.input.trigger(actionName)) : (Q.inputs[actionName] = !1, 
                                joypad.triggers[k] && Q.input.trigger(actionName + "Up"));
                            }
                            Q._extend(joypad, {
                                dx: dx,
                                dy: dy,
                                x: joypad.centerX + dx,
                                y: joypad.centerY + dy,
                                dist: dist,
                                ang: ang,
                                triggers: triggers
                            });
                            break;
                        }
                    }
                    e.preventDefault();
                }, this.joypadEnd = function(e) {
                    var evt = e;
                    if (null !== joypad.joypadTouch) for (var i = 0, len = evt.changedTouches.length; len > i; i++) {
                        var touch = evt.changedTouches[i];
                        if (touch.identifier === joypad.joypadTouch) {
                            for (var k = 0; k < joypad.triggers.length; k++) {
                                var actionName = joypad.inputs[k];
                                Q.inputs[actionName] = !1, joypad.triggers[k] && Q.input.trigger(actionName + "Up");
                            }
                            joypad.joypadTouch = null;
                            break;
                        }
                    }
                    e.preventDefault();
                }, Q.el.addEventListener("touchstart", this.joypadStart), Q.el.addEventListener("touchmove", this.joypadMove), 
                Q.el.addEventListener("touchend", this.joypadEnd), Q.el.addEventListener("touchcancel", this.joypadEnd), 
                this.joypadEnabled = !0;
            },
            mouseControls: function(options) {
                options = options || {};
                var stageNum = options.stageNum || 0, mouseInputX = options.mouseX || "mouseX", mouseInputY = options.mouseY || "mouseY", cursor = options.cursor || "off", mouseMoveObj = {};
                "on" !== cursor && ("off" === cursor ? Q.el.style.cursor = "none" : Q.el.style.cursor = cursor), 
                Q.inputs[mouseInputX] = 0, Q.inputs[mouseInputY] = 0, Q._mouseMove = function(e) {
                    e.preventDefault();
                    var touch = e.touches ? e.touches[0] : e, el = Q.el, rect = el.getBoundingClientRect(), style = window.getComputedStyle(el), posX = touch.clientX - rect.left - parseInt(style.paddingLeft, 10), posY = touch.clientY - rect.top - parseInt(style.paddingTop, 10), stage = Q.stage(stageNum);
                    (Q._isUndefined(posX) || Q._isUndefined(posY)) && (posX = touch.offsetX, posY = touch.offsetY), 
                    (Q._isUndefined(posX) || Q._isUndefined(posY)) && (posX = touch.layerX, posY = touch.layerY), 
                    (Q._isUndefined(posX) || Q._isUndefined(posY)) && (void 0 === Q.input.offsetX && Q.input._containerOffset(), 
                    posX = touch.pageX - Q.input.offsetX, posY = touch.pageY - Q.input.offsetY), stage && (mouseMoveObj.x = Q.canvasToStageX(posX, stage), 
                    mouseMoveObj.y = Q.canvasToStageY(posY, stage), Q.inputs[mouseInputX] = mouseMoveObj.x, 
                    Q.inputs[mouseInputY] = mouseMoveObj.y, Q.input.trigger("mouseMove", mouseMoveObj));
                }, Q._mouseWheel = function(e) {
                    e = window.event || e;
                    var delta = Math.max(-1, Math.min(1, e.wheelDelta || -e.detail));
                    Q.input.trigger("mouseWheel", delta);
                }, Q.el.addEventListener("mousemove", Q._mouseMove, !0), Q.el.addEventListener("touchstart", Q._mouseMove, !0), 
                Q.el.addEventListener("touchmove", Q._mouseMove, !0), Q.el.addEventListener("mousewheel", Q._mouseWheel, !0), 
                Q.el.addEventListener("DOMMouseScroll", Q._mouseWheel, !0);
            },
            disableMouseControls: function() {
                Q._mouseMove && (Q.el.removeEventListener("mousemove", Q._mouseMove, !0), Q.el.removeEventListener("mousewheel", Q._mouseWheel, !0), 
                Q.el.removeEventListener("DOMMouseScroll", Q._mouseWheel, !0), Q.el.style.cursor = "inherit", 
                Q._mouseMove = null);
            },
            drawButtons: function() {
                var keypad = Q.input.keypad, ctx = Q.ctx;
                ctx.save(), ctx.textAlign = "center", ctx.textBaseline = "middle";
                for (var i = 0; i < keypad.controls.length; i++) {
                    var control = keypad.controls[i];
                    if (control[0]) {
                        ctx.font = "bold " + keypad.size / 2 + "px arial";
                        var x = keypad.left + i * keypad.unit + keypad.gutter, y = keypad.bottom - keypad.unit, key = Q.inputs[control[0]];
                        ctx.fillStyle = keypad.color || "#FFFFFF", ctx.globalAlpha = key ? 1 : .5, ctx.fillRect(x, y, keypad.size, keypad.size), 
                        ctx.fillStyle = keypad.text || "#000000", ctx.fillText(control[1], x + keypad.size / 2, y + keypad.size / 2);
                    }
                }
                ctx.restore();
            },
            drawCircle: function(x, y, color, size) {
                var ctx = Q.ctx, joypad = Q.joypad;
                ctx.save(), ctx.beginPath(), ctx.globalAlpha = joypad.alpha, ctx.fillStyle = color, 
                ctx.arc(x, y, size, 0, 2 * Math.PI, !0), ctx.closePath(), ctx.fill(), ctx.restore();
            },
            drawJoypad: function() {
                var joypad = Q.joypad;
                null !== joypad.joypadTouch && (Q.input.drawCircle(joypad.centerX, joypad.centerY, joypad.background, joypad.size), 
                null !== joypad.x && Q.input.drawCircle(joypad.x, joypad.y, joypad.color, joypad.center));
            },
            drawCanvas: function() {
                this.touchEnabled && this.drawButtons(), this.joypadEnabled && this.drawJoypad();
            }
        }), Q.input = new Q.InputSystem(), Q.controls = function(joypad) {
            return Q.input.keyboardControls(), joypad ? (Q.input.touchControls({
                controls: [ [], [], [], [ "action", "b" ], [ "fire", "a" ] ]
            }), Q.input.joypadControls()) : Q.input.touchControls(), Q;
        }, Q.component("platformerControls", {
            defaults: {
                speed: 200,
                jumpSpeed: -300,
                collisions: []
            },
            added: function() {
                var p = this.entity.p;
                Q._defaults(p, this.defaults), this.entity.on("step", this, "step"), this.entity.on("bump.bottom", this, "landed"), 
                p.landed = 0, p.direction = "right";
            },
            landed: function(col) {
                var p = this.entity.p;
                p.landed = .2;
            },
            step: function(dt) {
                var p = this.entity.p;
                if (void 0 === p.ignoreControls || !p.ignoreControls) {
                    var collision = null;
                    if (void 0 !== p.collisions && p.collisions.length > 0 && (Q.inputs.left || Q.inputs.right || p.landed > 0)) {
                        if (1 === p.collisions.length) collision = p.collisions[0]; else {
                            collision = null;
                            for (var i = 0; i < p.collisions.length; i++) p.collisions[i].normalY < 0 && (collision = p.collisions[i]);
                        }
                        null !== collision && collision.normalY > -.3 && collision.normalY < .3 && (collision = null);
                    }
                    Q.inputs.left ? (p.direction = "left", collision && p.landed > 0 ? (p.vx = p.speed * collision.normalY, 
                    p.vy = -p.speed * collision.normalX) : p.vx = -p.speed) : Q.inputs.right ? (p.direction = "right", 
                    collision && p.landed > 0 ? (p.vx = -p.speed * collision.normalY, p.vy = p.speed * collision.normalX) : p.vx = p.speed) : (p.vx = 0, 
                    collision && p.landed > 0 && (p.vy = 0)), p.landed > 0 && (Q.inputs.up || Q.inputs.action) && !p.jumping ? (p.vy = p.jumpSpeed, 
                    p.landed = -dt, p.jumping = !0) : (Q.inputs.up || Q.inputs.action) && (this.entity.trigger("jump", this.entity), 
                    p.jumping = !0), !p.jumping || Q.inputs.up || Q.inputs.action || (p.jumping = !1, 
                    this.entity.trigger("jumped", this.entity), p.vy < p.jumpSpeed / 3 && (p.vy = p.jumpSpeed / 3));
                }
                p.landed -= dt;
            }
        }), Q.component("stepControls", {
            added: function() {
                var p = this.entity.p;
                p.stepDistance || (p.stepDistance = 32), p.stepDelay || (p.stepDelay = .2), p.stepWait = 0, 
                this.entity.on("step", this, "step"), this.entity.on("hit", this, "collision");
            },
            collision: function(col) {
                var p = this.entity.p;
                p.stepping && (p.stepping = !1, p.x = p.origX, p.y = p.origY);
            },
            step: function(dt) {
                var p = this.entity.p;
                p.stepWait -= dt, p.stepping && (p.x += p.diffX * dt / p.stepDelay, p.y += p.diffY * dt / p.stepDelay), 
                p.stepWait > 0 || (p.stepping && (p.x = p.destX, p.y = p.destY), p.stepping = !1, 
                p.diffX = 0, p.diffY = 0, Q.inputs.left ? p.diffX = -p.stepDistance : Q.inputs.right && (p.diffX = p.stepDistance), 
                Q.inputs.up ? p.diffY = -p.stepDistance : Q.inputs.down && (p.diffY = p.stepDistance), 
                (p.diffY || p.diffX) && (p.stepping = !0, p.origX = p.x, p.origY = p.y, p.destX = p.x + p.diffX, 
                p.destY = p.y + p.diffY, p.stepWait = p.stepDelay));
            }
        });
    };
};

"undefined" == typeof Quintus ? module.exports = quintusInput : quintusInput(Quintus);

var quintusScenes = function(Quintus) {
    "use strict";
    Quintus.Scenes = function(Q) {
        Q.scenes = {}, Q.stages = [], Q.Class.extend("Scene", {
            init: function(sceneFunc, opts) {
                this.opts = opts || {}, this.sceneFunc = sceneFunc;
            }
        }), Q.scene = function(name, sceneFunc, opts) {
            return void 0 === sceneFunc ? Q.scenes[name] : (Q._isFunction(sceneFunc) && (sceneFunc = new Q.Scene(sceneFunc, opts), 
            sceneFunc.name = name), Q.scenes[name] = sceneFunc, sceneFunc);
        }, Q._nullContainer = {
            c: {
                x: 0,
                y: 0,
                angle: 0,
                scale: 1
            },
            matrix: Q.matrix2d()
        }, Q.collision = function() {
            function calculateNormal(points, idx) {
                var pt1 = points[idx], pt2 = points[idx + 1] || points[0];
                normalX = -(pt2[1] - pt1[1]), normalY = pt2[0] - pt1[0];
                var dist = Math.sqrt(normalX * normalX + normalY * normalY);
                dist > 0 && (normalX /= dist, normalY /= dist);
            }
            function dotProductAgainstNormal(point) {
                return normalX * point[0] + normalY * point[1];
            }
            function collide(o1, o2, flip) {
                var min1, max1, min2, max2, d1, d2, offsetLength, tmp, i, j, minDist, minDistAbs, p1, p2, shortestDist = Number.POSITIVE_INFINITY, collided = !1, result = flip ? result2 : result1;
                for (offset[0] = 0, offset[1] = 0, o1.c ? p1 = o1.c.points : (p1 = o1.p.points, 
                offset[0] += o1.p.x, offset[1] += o1.p.y), o2.c ? p2 = o2.c.points : (p2 = o2.p.points, 
                offset[0] += -o2.p.x, offset[1] += -o2.p.y), o1 = o1.p, o2 = o2.p, i = 0; i < p1.length; i++) {
                    for (calculateNormal(p1, i), min1 = dotProductAgainstNormal(p1[0]), max1 = min1, 
                    j = 1; j < p1.length; j++) tmp = dotProductAgainstNormal(p1[j]), min1 > tmp && (min1 = tmp), 
                    tmp > max1 && (max1 = tmp);
                    for (min2 = dotProductAgainstNormal(p2[0]), max2 = min2, j = 1; j < p2.length; j++) tmp = dotProductAgainstNormal(p2[j]), 
                    min2 > tmp && (min2 = tmp), tmp > max2 && (max2 = tmp);
                    if (offsetLength = dotProductAgainstNormal(offset), min1 += offsetLength, max1 += offsetLength, 
                    d1 = min1 - max2, d2 = min2 - max1, d1 > 0 || d2 > 0) return null;
                    minDist = -1 * (max2 - min1), flip && (minDist *= -1), minDistAbs = Math.abs(minDist), 
                    shortestDist > minDistAbs && (result.distance = minDist, result.magnitude = minDistAbs, 
                    result.normalX = normalX, result.normalY = normalY, result.distance > 0 && (result.distance *= -1, 
                    result.normalX *= -1, result.normalY *= -1), collided = !0, shortestDist = minDistAbs);
                }
                return collided ? result : null;
            }
            function satCollision(o1, o2) {
                var result1, result2, result;
                return o1.p.points || Q._generatePoints(o1), o2.p.points || Q._generatePoints(o2), 
                (result1 = collide(o1, o2)) && (result2 = collide(o2, o1, !0)) ? (result = result2.magnitude < result1.magnitude ? result2 : result1, 
                0 === result.magnitude ? !1 : (result.separate[0] = result.distance * result.normalX, 
                result.separate[1] = result.distance * result.normalY, result)) : !1;
            }
            var normalX, normalY, offset = [ 0, 0 ], result1 = {
                separate: []
            }, result2 = {
                separate: []
            };
            return satCollision;
        }(), Q.overlap = function(o1, o2) {
            var c1 = o1.c || o1.p || o1, c2 = o2.c || o2.p || o2, o1x = c1.x - (c1.cx || 0), o1y = c1.y - (c1.cy || 0), o2x = c2.x - (c2.cx || 0), o2y = c2.y - (c2.cy || 0);
            return !(o1y + c1.h < o2y || o1y > o2y + c2.h || o1x + c1.w < o2x || o1x > o2x + c2.w);
        }, Q.Stage = Q.GameObject.extend({
            defaults: {
                sort: !1,
                gridW: 400,
                gridH: 400,
                x: 0,
                y: 0
            },
            init: function(scene, opts) {
                this.scene = scene, this.items = [], this.lists = {}, this.index = {}, this.removeList = [], 
                this.grid = {}, this._collisionLayers = [], this.time = 0, this.defaults.w = Q.width, 
                this.defaults.h = Q.height, this.options = Q._extend({}, this.defaults), this.scene && Q._extend(this.options, scene.opts), 
                opts && Q._extend(this.options, opts), this.options.sort && !Q._isFunction(this.options.sort) && (this.options.sort = function(a, b) {
                    return (a.p && a.p.z || -1) - (b.p && b.p.z || -1);
                });
            },
            destroyed: function() {
                this.invoke("debind"), this.trigger("destroyed");
            },
            loadScene: function() {
                this.scene && this.scene.sceneFunc(this);
            },
            loadAssets: function(asset) {
                for (var assetArray = Q._isArray(asset) ? asset : Q.asset(asset), i = 0; i < assetArray.length; i++) {
                    var spriteClass = assetArray[i][0], spriteProps = assetArray[i][1];
                    this.insert(new Q[spriteClass](spriteProps));
                }
            },
            each: function(callback) {
                for (var i = 0, len = this.items.length; len > i; i++) callback.call(this.items[i], arguments[1], arguments[2]);
            },
            invoke: function(funcName) {
                for (var i = 0, len = this.items.length; len > i; i++) this.items[i][funcName].call(this.items[i], arguments[1], arguments[2]);
            },
            detect: function(func) {
                for (var i = this.items.length - 1; i >= 0; i--) if (func.call(this.items[i], arguments[1], arguments[2], arguments[3])) return this.items[i];
                return !1;
            },
            identify: function(func) {
                for (var result, i = this.items.length - 1; i >= 0; i--) if (result = func.call(this.items[i], arguments[1], arguments[2], arguments[3])) return result;
                return !1;
            },
            find: function(id) {
                return this.index[id];
            },
            addToLists: function(lists, object) {
                for (var i = 0; i < lists.length; i++) this.addToList(lists[i], object);
            },
            addToList: function(list, itm) {
                this.lists[list] || (this.lists[list] = []), this.lists[list].push(itm);
            },
            removeFromLists: function(lists, itm) {
                for (var i = 0; i < lists.length; i++) this.removeFromList(lists[i], itm);
            },
            removeFromList: function(list, itm) {
                var listIndex = this.lists[list].indexOf(itm);
                -1 !== listIndex && this.lists[list].splice(listIndex, 1);
            },
            insert: function(itm, container) {
                return this.items.push(itm), itm.stage = this, itm.container = container, container && container.children.push(itm), 
                itm.grid = {}, Q._generatePoints(itm), Q._generateCollisionPoints(itm), itm.className && this.addToList(itm.className, itm), 
                itm.activeComponents && this.addToLists(itm.activeComponents, itm), itm.p && (this.index[itm.p.id] = itm), 
                this.trigger("inserted", itm), itm.trigger("inserted", this), this.regrid(itm), 
                itm;
            },
            remove: function(itm) {
                this.delGrid(itm), this.removeList.push(itm);
            },
            forceRemove: function(itm) {
                var idx = this.items.indexOf(itm);
                if (-1 !== idx) {
                    if (this.items.splice(idx, 1), itm.className && this.removeFromList(itm.className, itm), 
                    itm.activeComponents && this.removeFromLists(itm.activeComponents, itm), itm.container) {
                        var containerIdx = itm.container.children.indexOf(itm);
                        -1 !== containerIdx && itm.container.children.splice(containerIdx, 1);
                    }
                    itm.destroy && itm.destroy(), itm.p.id && delete this.index[itm.p.id], this.trigger("removed", itm);
                }
            },
            pause: function() {
                this.paused = !0;
            },
            unpause: function() {
                this.paused = !1;
            },
            _gridCellCheck: function(type, id, obj, collisionMask) {
                if (Q._isUndefined(collisionMask) || collisionMask & type) {
                    var obj2 = this.index[id];
                    if (obj2 && obj2 !== obj && Q.overlap(obj, obj2)) {
                        var col = Q.collision(obj, obj2);
                        return col ? (col.obj = obj2, col) : !1;
                    }
                }
            },
            gridTest: function(obj, collisionMask) {
                for (var gridCell, col, grid = obj.grid, y = grid.Y1; y <= grid.Y2; y++) if (this.grid[y]) for (var x = grid.X1; x <= grid.X2; x++) if (gridCell = this.grid[y][x], 
                gridCell && (col = Q._detect(gridCell, this._gridCellCheck, this, obj, collisionMask))) return col;
                return !1;
            },
            collisionLayer: function(layer) {
                return this._collisionLayers.push(layer), layer.collisionLayer = !0, this.insert(layer);
            },
            _collideCollisionLayer: function(obj, collisionMask) {
                for (var col, i = 0, max = this._collisionLayers.length; max > i; i++) {
                    var layer = this._collisionLayers[i];
                    if (layer.p.type & collisionMask && (col = layer.collide(obj))) return col.obj = layer, 
                    col;
                }
                return !1;
            },
            search: function(obj, collisionMask) {
                var col;
                return obj.grid || this.regrid(obj, obj.stage !== this), collisionMask = Q._isUndefined(collisionMask) ? obj.p && obj.p.collisionMask : collisionMask, 
                col = this._collideCollisionLayer(obj, collisionMask), col = col || this.gridTest(obj, collisionMask);
            },
            _locateObj: {
                p: {
                    x: 0,
                    y: 0,
                    cx: 0,
                    cy: 0,
                    w: 1,
                    h: 1
                },
                grid: {}
            },
            locate: function(x, y, collisionMask) {
                var col = null;
                return this._locateObj.p.x = x, this._locateObj.p.y = y, this.regrid(this._locateObj, !0), 
                col = this._collideCollisionLayer(this._locateObj, collisionMask), col = col || this.gridTest(this._locateObj, collisionMask), 
                col && col.obj ? col.obj : !1;
            },
            collide: function(obj, options) {
                var col, col2, collisionMask, maxCol, curCol, skipEvents;
                for (Q._isObject(options) ? (collisionMask = options.collisionMask, maxCol = options.maxCol, 
                skipEvents = options.skipEvents) : collisionMask = options, collisionMask = Q._isUndefined(collisionMask) ? obj.p && obj.p.collisionMask : collisionMask, 
                maxCol = maxCol || 3, Q._generateCollisionPoints(obj), this.regrid(obj), curCol = maxCol; curCol > 0 && (col = this._collideCollisionLayer(obj, collisionMask)); ) skipEvents || (obj.trigger("hit", col), 
                obj.trigger("hit.collision", col)), Q._generateCollisionPoints(obj), this.regrid(obj), 
                curCol--;
                for (curCol = maxCol; curCol > 0 && (col2 = this.gridTest(obj, collisionMask)); ) {
                    if (obj.trigger("hit", col2), obj.trigger("hit.sprite", col2), !skipEvents) {
                        var obj2 = col2.obj;
                        col2.obj = obj, col2.normalX *= -1, col2.normalY *= -1, col2.distance = 0, col2.magnitude = 0, 
                        col2.separate[0] = 0, col2.separate[1] = 0, obj2.trigger("hit", col2), obj2.trigger("hit.sprite", col2);
                    }
                    Q._generateCollisionPoints(obj), this.regrid(obj), curCol--;
                }
                return col2 || col;
            },
            delGrid: function(item) {
                for (var grid = item.grid, y = grid.Y1; y <= grid.Y2; y++) if (this.grid[y]) for (var x = grid.X1; x <= grid.X2; x++) this.grid[y][x] && delete this.grid[y][x][item.p.id];
            },
            addGrid: function(item) {
                for (var grid = item.grid, y = grid.Y1; y <= grid.Y2; y++) {
                    this.grid[y] || (this.grid[y] = {});
                    for (var x = grid.X1; x <= grid.X2; x++) this.grid[y][x] || (this.grid[y][x] = {}), 
                    this.grid[y][x][item.p.id] = item.p.type;
                }
            },
            regrid: function(item, skipAdd) {
                if (!item.collisionLayer) {
                    item.grid = item.grid || {};
                    var c = item.c || item.p, gridX1 = Math.floor((c.x - c.cx) / this.options.gridW), gridY1 = Math.floor((c.y - c.cy) / this.options.gridH), gridX2 = Math.floor((c.x - c.cx + c.w) / this.options.gridW), gridY2 = Math.floor((c.y - c.cy + c.h) / this.options.gridH), grid = item.grid;
                    grid.X1 === gridX1 && grid.X2 === gridX2 && grid.Y1 === gridY1 && grid.Y2 === gridY2 || (void 0 !== grid.X1 && this.delGrid(item), 
                    grid.X1 = gridX1, grid.X2 = gridX2, grid.Y1 = gridY1, grid.Y2 = gridY2, skipAdd || this.addGrid(item));
                }
            },
            markSprites: function(items, time) {
                for (var gridRow, gridBlock, viewport = this.viewport, scale = viewport ? viewport.scale : 1, x = viewport ? viewport.x : 0, y = viewport ? viewport.y : 0, viewW = Q.width / scale, viewH = Q.height / scale, gridX1 = Math.floor(x / this.options.gridW), gridY1 = Math.floor(y / this.options.gridH), gridX2 = Math.floor((x + viewW) / this.options.gridW), gridY2 = Math.floor((y + viewH) / this.options.gridH), iy = gridY1; gridY2 >= iy; iy++) if (gridRow = this.grid[iy]) for (var ix = gridX1; gridX2 >= ix; ix++) if (gridBlock = gridRow[ix]) for (var id in gridBlock) this.index[id] && (this.index[id].mark = time, 
                this.index[id].container && (this.index[id].container.mark = time));
            },
            updateSprites: function(items, dt, isContainer) {
                for (var item, i = 0, len = items.length; len > i; i++) item = items[i], !isContainer && item.p.visibleOnly && (!item.mark || item.mark < this.time) || !isContainer && item.container || (item.update(dt), 
                Q._generateCollisionPoints(item), this.regrid(item));
            },
            step: function(dt) {
                if (this.paused) return !1;
                if (this.time += dt, this.markSprites(this.items, this.time), this.trigger("prestep", dt), 
                this.updateSprites(this.items, dt), this.trigger("step", dt), this.removeList.length > 0) {
                    for (var i = 0, len = this.removeList.length; len > i; i++) this.forceRemove(this.removeList[i]);
                    this.removeList.length = 0;
                }
                this.trigger("poststep", dt);
            },
            hide: function() {
                this.hidden = !0;
            },
            show: function() {
                this.hidden = !1;
            },
            stop: function() {
                this.hide(), this.pause();
            },
            start: function() {
                this.show(), this.unpause();
            },
            render: function(ctx) {
                if (this.hidden) return !1;
                this.options.sort && this.items.sort(this.options.sort), this.trigger("prerender", ctx), 
                this.trigger("beforerender", ctx);
                for (var i = 0, len = this.items.length; len > i; i++) {
                    var item = this.items[i];
                    !item.container && (item.p.renderAlways || item.mark >= this.time) && item.render(ctx);
                }
                this.trigger("render", ctx), this.trigger("postrender", ctx);
            }
        }), Q.activeStage = 0, Q.StageSelector = Q.Class.extend({
            emptyList: [],
            init: function(stage, selector) {
                this.stage = stage, this.selector = selector, this.items = this.stage.lists[this.selector] || this.emptyList, 
                this.length = this.items.length;
            },
            each: function(callback) {
                for (var i = 0, len = this.items.length; len > i; i++) callback.call(this.items[i], arguments[1], arguments[2]);
                return this;
            },
            invoke: function(funcName) {
                for (var i = 0, len = this.items.length; len > i; i++) this.items[i][funcName].call(this.items[i], arguments[1], arguments[2]);
                return this;
            },
            trigger: function(name, params) {
                this.invoke("trigger", name, params);
            },
            destroy: function() {
                this.invoke("destroy");
            },
            detect: function(func) {
                for (var i = 0, len = this.items.length; len > i; i++) if (func.call(this.items[i], arguments[1], arguments[2])) return this.items[i];
                return !1;
            },
            identify: function(func) {
                for (var result = null, i = 0, len = this.items.length; len > i; i++) if (result = func.call(this.items[i], arguments[1], arguments[2])) return result;
                return !1;
            },
            _pObject: function(source) {
                Q._extend(this.p, source);
            },
            _pSingle: function(property, value) {
                this.p[property] = value;
            },
            set: function(property, value) {
                return void 0 === value ? this.each(this._pObject, property) : this.each(this._pSingle, property, value), 
                this;
            },
            at: function(idx) {
                return this.items[idx];
            },
            first: function() {
                return this.items[0];
            },
            last: function() {
                return this.items[this.items.length - 1];
            }
        }), Q.select = function(selector, scope) {
            return scope = void 0 === scope ? Q.activeStage : scope, scope = Q.stage(scope), 
            Q._isNumber(selector) ? scope.index[selector] : new Q.StageSelector(scope, selector);
        }, Q.stage = function(num) {
            return num = void 0 === num ? Q.activeStage : num, Q.stages[num];
        }, Q.stageScene = function(scene, num, options) {
            Q._isString(scene) && (scene = Q.scene(scene)), Q._isObject(num) && (options = num, 
            num = Q._popProperty(options, "stage") || scene && scene.opts.stage || 0), options = Q._clone(options);
            var StageClass = Q._popProperty(options, "stageClass") || scene && scene.opts.stageClass || Q.Stage;
            num = Q._isUndefined(num) ? scene && scene.opts.stage || 0 : num, Q.stages[num] && Q.stages[num].destroy(), 
            Q.activeStage = num;
            var stage = Q.stages[num] = new StageClass(scene, options);
            return stage.options.asset && stage.loadAssets(stage.options.asset), scene && stage.loadScene(), 
            Q.activeStage = 0, Q.loop || Q.gameLoop(Q.stageGameLoop), stage;
        }, Q.stageStepLoop = function(dt) {
            var i, len, stage;
            for (0 > dt && (dt = 1 / 60), dt > 1 / 15 && (dt = 1 / 15), i = 0, len = Q.stages.length; len > i; i++) Q.activeStage = i, 
            stage = Q.stage(), stage && stage.step(dt);
            Q.activeStage = 0;
        }, Q.stageRenderLoop = function() {
            Q.ctx && Q.clear();
            for (var i = 0, len = Q.stages.length; len > i; i++) {
                Q.activeStage = i;
                var stage = Q.stage();
                stage && stage.render(Q.ctx);
            }
            Q.input && Q.ctx && Q.input.drawCanvas(Q.ctx), Q.activeStage = 0;
        }, Q.stageGameLoop = function(dt) {
            Q.stageStepLoop(dt), Q.stageRenderLoop();
        }, Q.clearStage = function(num) {
            Q.stages[num] && (Q.stages[num].destroy(), Q.stages[num] = null);
        }, Q.clearStages = function() {
            for (var i = 0, len = Q.stages.length; len > i; i++) Q.stages[i] && Q.stages[i].destroy();
            Q.stages.length = 0;
        };
    };
};

"undefined" == typeof Quintus ? module.exports = quintusScenes : quintusScenes(Quintus);

var quintusSprites = function(Quintus) {
    "use strict";
    Quintus.Sprites = function(Q) {
        return Q.Class.extend("SpriteSheet", {
            init: function(name, asset, options) {
                if (!Q.asset(asset)) throw "Invalid Asset:" + asset;
                Q._extend(this, {
                    name: name,
                    asset: asset,
                    w: Q.asset(asset).width,
                    h: Q.asset(asset).height,
                    tileW: 64,
                    tileH: 64,
                    sx: 0,
                    sy: 0,
                    spacingX: 0,
                    spacingY: 0,
                    frameProperties: {}
                }), options && Q._extend(this, options), this.tilew && (this.tileW = this.tilew, 
                delete this.tilew), this.tileh && (this.tileH = this.tileh, delete this.tileh), 
                this.cols = this.cols || Math.floor((this.w + this.spacingX) / (this.tileW + this.spacingX)), 
                this.frames = this.cols * Math.floor(this.h / (this.tileH + this.spacingY));
            },
            fx: function(frame) {
                return Math.floor(frame % this.cols * (this.tileW + this.spacingX) + this.sx);
            },
            fy: function(frame) {
                return Math.floor(Math.floor(frame / this.cols) * (this.tileH + this.spacingY) + this.sy);
            },
            draw: function(ctx, x, y, frame) {
                ctx || (ctx = Q.ctx), ctx.drawImage(Q.asset(this.asset), this.fx(frame), this.fy(frame), this.tileW, this.tileH, Math.floor(x), Math.floor(y), this.tileW, this.tileH);
            }
        }), Q.sheets = {}, Q.sheet = function(name, asset, options) {
            return asset ? void (Q.sheets[name] = new Q.SpriteSheet(name, asset, options)) : Q.sheets[name];
        }, Q.compileSheets = function(imageAsset, spriteDataAsset) {
            var data = Q.asset(spriteDataAsset);
            Q._each(data, function(spriteData, name) {
                Q.sheet(name, imageAsset, spriteData);
            });
        }, Q.SPRITE_NONE = 0, Q.SPRITE_DEFAULT = 1, Q.SPRITE_PARTICLE = 2, Q.SPRITE_ACTIVE = 4, 
        Q.SPRITE_FRIENDLY = 8, Q.SPRITE_ENEMY = 16, Q.SPRITE_POWERUP = 32, Q.SPRITE_UI = 64, 
        Q.SPRITE_ALL = 65535, Q._generatePoints = function(obj, force) {
            if (!obj.p.points || force) {
                var p = obj.p, halfW = p.w / 2, halfH = p.h / 2;
                p.points = [ [ -halfW, -halfH ], [ halfW, -halfH ], [ halfW, halfH ], [ -halfW, halfH ] ];
            }
        }, Q._generateCollisionPoints = function(obj) {
            if (obj.matrix || obj.refreshMatrix) {
                obj.c || (obj.c = {
                    points: []
                });
                var p = obj.p, c = obj.c;
                if (p.moved || c.origX !== p.x || c.origY !== p.y || c.origScale !== p.scale || c.origAngle !== p.angle) {
                    c.origX = p.x, c.origY = p.y, c.origScale = p.scale, c.origAngle = p.angle, obj.refreshMatrix();
                    var i;
                    if (obj.container || p.scale && 1 !== p.scale || 0 !== p.angle) {
                        var container = obj.container || Q._nullContainer;
                        c.x = container.matrix.transformX(p.x, p.y), c.y = container.matrix.transformY(p.x, p.y), 
                        c.angle = p.angle + container.c.angle, c.scale = (container.c.scale || 1) * (p.scale || 1);
                        var minX = 1 / 0, minY = 1 / 0, maxX = -(1 / 0), maxY = -(1 / 0);
                        for (i = 0; i < obj.p.points.length; i++) {
                            obj.c.points[i] || (obj.c.points[i] = []), obj.matrix.transformArr(obj.p.points[i], obj.c.points[i]);
                            var x = obj.c.points[i][0], y = obj.c.points[i][1];
                            minX > x && (minX = x), x > maxX && (maxX = x), minY > y && (minY = y), y > maxY && (maxY = y);
                        }
                        minX === maxX && (maxX += 1), minY === maxY && (maxY += 1), c.cx = c.x - minX, c.cy = c.y - minY, 
                        c.w = maxX - minX, c.h = maxY - minY;
                    } else {
                        for (i = 0; i < obj.p.points.length; i++) obj.c.points[i] = obj.c.points[i] || [], 
                        obj.c.points[i][0] = p.x + obj.p.points[i][0], obj.c.points[i][1] = p.y + obj.p.points[i][1];
                        c.x = p.x, c.y = p.y, c.cx = p.cx, c.cy = p.cy, c.w = p.w, c.h = p.h;
                    }
                    p.moved = !1, obj.children && obj.children.length > 0 && Q._invoke(obj.children, "moved");
                }
            }
        }, Q.GameObject.extend("Sprite", {
            init: function(props, defaultProps) {
                this.p = Q._extend({
                    x: 0,
                    y: 0,
                    z: 0,
                    opacity: 1,
                    angle: 0,
                    frame: 0,
                    type: Q.SPRITE_DEFAULT | Q.SPRITE_ACTIVE,
                    name: "",
                    spriteProperties: {}
                }, defaultProps), this.matrix = new Q.Matrix2D(), this.children = [], Q._extend(this.p, props), 
                this.size(), this.p.id = this.p.id || Q._uniqueId(), this.refreshMatrix();
            },
            size: function(force) {
                !force && this.p.w && this.p.h || (this.asset() ? (this.p.w = this.asset().width, 
                this.p.h = this.asset().height) : this.sheet() && (this.p.w = this.sheet().tileW, 
                this.p.h = this.sheet().tileH)), this.p.cx = force || void 0 === this.p.cx ? this.p.w / 2 : this.p.cx, 
                this.p.cy = force || void 0 === this.p.cy ? this.p.h / 2 : this.p.cy;
            },
            asset: function(name, resize) {
                return name ? (this.p.asset = name, void (resize && (this.size(!0), Q._generatePoints(this, !0)))) : Q.asset(this.p.asset);
            },
            sheet: function(name, resize) {
                return name ? (this.p.sheet = name, void (resize && (this.size(!0), Q._generatePoints(this, !0)))) : Q.sheet(this.p.sheet);
            },
            hide: function() {
                this.p.hidden = !0;
            },
            show: function() {
                this.p.hidden = !1;
            },
            set: function(properties) {
                return Q._extend(this.p, properties), this;
            },
            _sortChild: function(a, b) {
                return (a.p && a.p.z || -1) - (b.p && b.p.z || -1);
            },
            _flipArgs: {
                x: [ -1, 1 ],
                y: [ 1, -1 ],
                xy: [ -1, -1 ]
            },
            render: function(ctx) {
                var p = this.p;
                p.hidden || 0 === p.opacity || (ctx || (ctx = Q.ctx), this.trigger("predraw", ctx), 
                ctx.save(), void 0 !== this.p.opacity && 1 !== this.p.opacity && (ctx.globalAlpha = this.p.opacity), 
                this.matrix.setContextTransform(ctx), this.p.flip && ctx.scale.apply(ctx, this._flipArgs[this.p.flip]), 
                this.trigger("beforedraw", ctx), this.draw(ctx), this.trigger("draw", ctx), ctx.restore(), 
                this.p.sort && this.children.sort(this._sortChild), Q._invoke(this.children, "render", ctx), 
                this.trigger("postdraw", ctx), Q.debug && this.debugRender(ctx));
            },
            center: function() {
                this.container ? (this.p.x = 0, this.p.y = 0) : (this.p.x = Q.width / 2, this.p.y = Q.height / 2);
            },
            draw: function(ctx) {
                var p = this.p;
                p.sheet ? this.sheet().draw(ctx, -p.cx, -p.cy, p.frame) : p.asset ? ctx.drawImage(Q.asset(p.asset), -p.cx, -p.cy) : p.color && (ctx.fillStyle = p.color, 
                ctx.fillRect(-p.cx, -p.cy, p.w, p.h));
            },
            debugRender: function(ctx) {
                this.p.points || Q._generatePoints(this), ctx.save(), this.matrix.setContextTransform(ctx), 
                ctx.beginPath(), ctx.fillStyle = this.p.hit ? "blue" : "red", ctx.strokeStyle = "#FF0000", 
                ctx.fillStyle = "rgba(0,0,0,0.5)", ctx.moveTo(this.p.points[0][0], this.p.points[0][1]);
                for (var i = 0; i < this.p.points.length; i++) ctx.lineTo(this.p.points[i][0], this.p.points[i][1]);
                if (ctx.lineTo(this.p.points[0][0], this.p.points[0][1]), ctx.stroke(), Q.debugFill && ctx.fill(), 
                ctx.restore(), this.c) {
                    var c = this.c;
                    ctx.save(), ctx.globalAlpha = 1, ctx.lineWidth = 2, ctx.strokeStyle = "#FF00FF", 
                    ctx.beginPath(), ctx.moveTo(c.x - c.cx, c.y - c.cy), ctx.lineTo(c.x - c.cx + c.w, c.y - c.cy), 
                    ctx.lineTo(c.x - c.cx + c.w, c.y - c.cy + c.h), ctx.lineTo(c.x - c.cx, c.y - c.cy + c.h), 
                    ctx.lineTo(c.x - c.cx, c.y - c.cy), ctx.stroke(), ctx.restore();
                }
            },
            update: function(dt) {
                this.trigger("prestep", dt), this.step && this.step(dt), this.trigger("step", dt), 
                Q._generateCollisionPoints(this), this.stage && this.children.length > 0 && this.stage.updateSprites(this.children, dt, !0), 
                this.p.collisions && (this.p.collisions = []);
            },
            refreshMatrix: function() {
                var p = this.p;
                this.matrix.identity(), this.container && this.matrix.multiply(this.container.matrix), 
                this.matrix.translate(p.x, p.y), p.scale && this.matrix.scale(p.scale, p.scale), 
                this.matrix.rotateDeg(p.angle);
            },
            moved: function() {
                this.p.moved = !0;
            }
        }), Q.Sprite.extend("MovingSprite", {
            init: function(props, defaultProps) {
                this._super(Q._extend({
                    vx: 0,
                    vy: 0,
                    ax: 0,
                    ay: 0
                }, props), defaultProps);
            },
            step: function(dt) {
                var p = this.p;
                p.vx += p.ax * dt, p.vy += p.ay * dt, p.x += p.vx * dt, p.y += p.vy * dt;
            }
        }), Q;
    };
};

"undefined" == typeof Quintus ? module.exports = quintusSprites : quintusSprites(Quintus);

var quintusTMX = function(Quintus) {
    "use strict";
    Quintus.TMX = function(Q) {
        function attr(elem, atr) {
            var value = elem.getAttribute(atr);
            return isNaN(value) ? value : +value;
        }
        function parseProperties(elem) {
            for (var propElems = elem.querySelectorAll("property"), props = {}, i = 0; i < propElems.length; i++) {
                var propElem = propElems[i];
                props[attr(propElem, "name")] = attr(propElem, "value");
            }
            return props;
        }
        Q.assetTypes.tmx = "TMX", Q.loadAssetTMX = function(key, src, callback, errorCallback) {
            Q.loadAssetOther(key, src, function(key, responseText) {
                var parser = new DOMParser(), doc = parser.parseFromString(responseText, "application/xml");
                callback(key, doc);
            }, errorCallback);
        }, Q._tmxExtractAssetName = function(result) {
            var source = result.getAttribute("source"), sourceParts = source.split("/");
            return sourceParts[sourceParts.length - 1];
        }, Q._tmxExtractSources = function(asset) {
            var results = asset.querySelectorAll("[source]");
            return Q._map(results, Q._tmxExtractAssetName);
        }, Q.loadTMX = function(files, callback, options) {
            Q._isString(files) && (files = Q._normalizeArg(files));
            var tmxFiles = [];
            Q._each(files, function(file) {
                "tmx" === Q._fileExtension(file) && tmxFiles.push(file);
            });
            var additionalAssets = [];
            Q.load(files, function() {
                Q._each(tmxFiles, function(tmxFile) {
                    var sources = Q._tmxExtractSources(Q.asset(tmxFile));
                    additionalAssets = additionalAssets.concat(sources);
                }), additionalAssets.length > 0 ? Q.load(additionalAssets, callback, options) : callback();
            });
        }, Q._tmxLoadTilesets = function(tilesets, tileProperties) {
            function parsePoint(pt) {
                var pts = pt.split(",");
                return [ parseFloat(pts[0]), parseFloat(pts[1]) ];
            }
            for (var gidMap = [], t = 0; t < tilesets.length; t++) {
                for (var tileset = tilesets[t], sheetName = attr(tileset, "name"), gid = attr(tileset, "firstgid"), assetName = Q._tmxExtractAssetName(tileset.querySelector("image")), tilesetTileProps = {}, tilesetProps = {
                    tileW: attr(tileset, "tilewidth"),
                    tileH: attr(tileset, "tileheight"),
                    spacingX: attr(tileset, "spacing"),
                    spacingY: attr(tileset, "spacing")
                }, tiles = tileset.querySelectorAll("tile"), i = 0; i < tiles.length; i++) {
                    var tile = tiles[i], tileId = attr(tile, "id"), tileGid = gid + tileId, properties = parseProperties(tile);
                    properties.points && (properties.points = Q._map(properties.points.split(" "), parsePoint)), 
                    tileProperties[tileGid] = properties, tilesetTileProps[tileId] = properties;
                }
                tilesetProps.frameProperties = tilesetTileProps, gidMap.push([ gid, sheetName ]), 
                Q.sheet(sheetName, assetName, tilesetProps);
            }
            return gidMap;
        }, Q._tmxProcessImageLayer = function(stage, gidMap, tileProperties, layer) {
            var assetName = Q._tmxExtractAssetName(layer.querySelector("image")), properties = parseProperties(layer);
            properties.asset = assetName, stage.insert(new Q.Repeater(properties));
        }, Q._lookupGid = function(gid, gidMap) {
            for (var idx = 0; gidMap[idx + 1] && gid >= gidMap[idx + 1][0]; ) idx++;
            return gidMap[idx];
        }, Q._tmxProcessTileLayer = function(stage, gidMap, tileProperties, layer) {
            for (var gidDetails, gidOffset, sheetName, tiles = layer.querySelectorAll("tile"), width = attr(layer, "width"), height = attr(layer, "height"), data = [], idx = 0, y = 0; height > y; y++) {
                data[y] = [];
                for (var x = 0; width > x; x++) {
                    var gid = attr(tiles[idx], "gid");
                    0 === gid ? data[y].push(null) : (gidOffset || (gidDetails = Q._lookupGid(attr(tiles[idx], "gid"), gidMap), 
                    gidOffset = gidDetails[0], sheetName = gidDetails[1]), data[y].push(gid - gidOffset)), 
                    idx++;
                }
            }
            var tileLayerProperties = Q._extend({
                tileW: Q.sheet(sheetName).tileW,
                tileH: Q.sheet(sheetName).tileH,
                sheet: sheetName,
                tiles: data
            }, parseProperties(layer)), TileLayerClass = tileLayerProperties.Class || "TileLayer";
            tileLayerProperties.collision ? stage.collisionLayer(new Q[TileLayerClass](tileLayerProperties)) : stage.insert(new Q[TileLayerClass](tileLayerProperties));
        }, Q._tmxProcessObjectLayer = function(stage, gidMap, tileProperties, layer) {
            for (var objects = layer.querySelectorAll("object"), i = 0; i < objects.length; i++) {
                var obj = objects[i], gid = attr(obj, "gid"), x = attr(obj, "x"), y = attr(obj, "y"), properties = tileProperties[gid], overrideProperties = parseProperties(obj);
                if (!properties) throw "Invalid TMX Object: missing properties for GID:" + gid;
                if (!properties.Class) throw "Invalid TMX Object: missing Class for GID:" + gid;
                var className = properties.Class;
                if (!className) throw "Invalid TMX Object Class: " + className + " GID:" + gid;
                var p = Q._extend(Q._extend({
                    x: x,
                    y: y
                }, properties), overrideProperties), sprite = new Q[className](p);
                sprite.p.x += sprite.p.w / 2, sprite.p.y -= sprite.p.h / 2, stage.insert(sprite);
            }
        }, Q._tmxProcessors = {
            objectgroup: Q._tmxProcessObjectLayer,
            layer: Q._tmxProcessTileLayer,
            imagelayer: Q._tmxProcessImageLayer
        }, Q.stageTMX = function(dataAsset, stage) {
            var data = Q._isString(dataAsset) ? Q.asset(dataAsset) : dataAsset, tileProperties = {}, tilesets = data.getElementsByTagName("tileset"), gidMap = Q._tmxLoadTilesets(tilesets, tileProperties);
            Q._each(data.documentElement.childNodes, function(layer) {
                var layerType = layer.tagName;
                Q._tmxProcessors[layerType] && Q._tmxProcessors[layerType](stage, gidMap, tileProperties, layer);
            });
        };
    };
};

"undefined" == typeof Quintus ? module.exports = quintusTMX : quintusTMX(Quintus);

var quintusTouch = function(Quintus) {
    "use strict";
    Quintus.Touch = function(Q) {
        if (Q._isUndefined(Quintus.Sprites)) throw "Quintus.Touch requires Quintus.Sprites Module";
        var touchStage = [ 0 ], touchType = 0;
        Q.Evented.extend("TouchSystem", {
            init: function() {
                var touchSystem = this;
                this.boundTouch = function(e) {
                    touchSystem.touch(e);
                }, this.boundDrag = function(e) {
                    touchSystem.drag(e);
                }, this.boundEnd = function(e) {
                    touchSystem.touchEnd(e);
                }, Q.el.addEventListener("touchstart", this.boundTouch), Q.el.addEventListener("mousedown", this.boundTouch), 
                Q.el.addEventListener("touchmove", this.boundDrag), Q.el.addEventListener("mousemove", this.boundDrag), 
                Q.el.addEventListener("touchend", this.boundEnd), Q.el.addEventListener("mouseup", this.boundEnd), 
                Q.el.addEventListener("touchcancel", this.boundEnd), this.touchPos = new Q.Evented(), 
                this.touchPos.grid = {}, this.touchPos.p = {
                    w: 1,
                    h: 1,
                    cx: 0,
                    cy: 0
                }, this.activeTouches = {}, this.touchedObjects = {};
            },
            destroy: function() {
                Q.el.removeEventListener("touchstart", this.boundTouch), Q.el.removeEventListener("mousedown", this.boundTouch), 
                Q.el.removeEventListener("touchmove", this.boundDrag), Q.el.removeEventListener("mousemove", this.boundDrag), 
                Q.el.removeEventListener("touchend", this.boundEnd), Q.el.removeEventListener("mouseup", this.boundEnd), 
                Q.el.removeEventListener("touchcancel", this.boundEnd);
            },
            normalizeTouch: function(touch, stage) {
                var el = Q.el, rect = el.getBoundingClientRect(), style = window.getComputedStyle(el), posX = touch.clientX - rect.left - parseInt(style.paddingLeft, 10), posY = touch.clientY - rect.top - parseInt(style.paddingTop, 10);
                if ((Q._isUndefined(posX) || Q._isUndefined(posY)) && (posX = touch.offsetX, posY = touch.offsetY), 
                (Q._isUndefined(posX) || Q._isUndefined(posY)) && (posX = touch.layerX, posY = touch.layerY), 
                Q._isUndefined(posX) || Q._isUndefined(posY)) {
                    if (void 0 === Q.touch.offsetX) {
                        Q.touch.offsetX = 0, Q.touch.offsetY = 0, el = Q.el;
                        do Q.touch.offsetX += el.offsetLeft, Q.touch.offsetY += el.offsetTop; while (el = el.offsetParent);
                    }
                    posX = touch.pageX - Q.touch.offsetX, posY = touch.pageY - Q.touch.offsetY;
                }
                return this.touchPos.p.ox = this.touchPos.p.px = posX / Q.cssWidth * Q.width, this.touchPos.p.oy = this.touchPos.p.py = posY / Q.cssHeight * Q.height, 
                stage.viewport && (this.touchPos.p.px /= stage.viewport.scale, this.touchPos.p.py /= stage.viewport.scale, 
                this.touchPos.p.px += stage.viewport.x, this.touchPos.p.py += stage.viewport.y), 
                this.touchPos.p.x = this.touchPos.p.px, this.touchPos.p.y = this.touchPos.p.py, 
                this.touchPos.obj = null, this.touchPos;
            },
            touch: function(e) {
                for (var touches = e.changedTouches || [ e ], i = 0; i < touches.length; i++) for (var stageIdx = 0; stageIdx < touchStage.length; stageIdx++) {
                    var touch = touches[i], stage = Q.stage(touchStage[stageIdx]);
                    if (stage) {
                        var touchIdentifier = touch.identifier || 0, pos = this.normalizeTouch(touch, stage);
                        stage.regrid(pos, !0);
                        var obj, col = stage.search(pos, touchType);
                        if ((col || stageIdx === touchStage.length - 1) && (obj = col && col.obj, pos.obj = obj, 
                        this.trigger("touch", pos)), obj && !this.touchedObjects[obj]) {
                            this.activeTouches[touchIdentifier] = {
                                x: pos.p.px,
                                y: pos.p.py,
                                origX: obj.p.x,
                                origY: obj.p.y,
                                sx: pos.p.ox,
                                sy: pos.p.oy,
                                identifier: touchIdentifier,
                                obj: obj,
                                stage: stage
                            }, this.touchedObjects[obj.p.id] = !0, obj.trigger("touch", this.activeTouches[touchIdentifier]);
                            break;
                        }
                    }
                }
            },
            drag: function(e) {
                for (var touches = e.changedTouches || [ e ], i = 0; i < touches.length; i++) {
                    var touch = touches[i], touchIdentifier = touch.identifier || 0, active = this.activeTouches[touchIdentifier], stage = active && active.stage;
                    if (active) {
                        var pos = this.normalizeTouch(touch, stage);
                        active.x = pos.p.px, active.y = pos.p.py, active.dx = pos.p.ox - active.sx, active.dy = pos.p.oy - active.sy, 
                        active.obj.trigger("drag", active);
                    }
                }
                e.preventDefault();
            },
            touchEnd: function(e) {
                for (var touches = e.changedTouches || [ e ], i = 0; i < touches.length; i++) {
                    var touch = touches[i], touchIdentifier = touch.identifier || 0, active = this.activeTouches[touchIdentifier];
                    active && (active.obj.trigger("touchEnd", active), delete this.touchedObjects[active.obj.p.id], 
                    this.activeTouches[touchIdentifier] = null);
                }
                e.preventDefault();
            }
        }), Q.touch = function(type, stage) {
            return Q.untouch(), touchType = type || Q.SPRITE_UI, touchStage = stage || [ 2, 1, 0 ], 
            Q._isArray(touchStage) || (touchStage = [ touchStage ]), Q._touch || (Q.touchInput = new Q.TouchSystem()), 
            Q;
        }, Q.untouch = function() {
            return Q.touchInput && (Q.touchInput.destroy(), delete Q.touchInput), Q;
        };
    };
};

"undefined" == typeof Quintus ? module.exports = quintusTouch : quintusTouch(Quintus);

var quintusUI = function(Quintus) {
    "use strict";
    Quintus.UI = function(Q) {
        if (Q._isUndefined(Quintus.Touch)) throw "Quintus.UI requires Quintus.Touch Module";
        Q.UI = {}, Q.UI.roundRect = function(ctx, rect) {
            ctx.beginPath(), ctx.moveTo(-rect.cx + rect.radius, -rect.cy), ctx.lineTo(-rect.cx + rect.w - rect.radius, -rect.cy), 
            ctx.quadraticCurveTo(-rect.cx + rect.w, -rect.cy, -rect.cx + rect.w, -rect.cy + rect.radius), 
            ctx.lineTo(-rect.cx + rect.w, -rect.cy + rect.h - rect.radius), ctx.quadraticCurveTo(-rect.cx + rect.w, -rect.cy + rect.h, -rect.cx + rect.w - rect.radius, -rect.cy + rect.h), 
            ctx.lineTo(-rect.cx + rect.radius, -rect.cy + rect.h), ctx.quadraticCurveTo(-rect.cx, -rect.cy + rect.h, -rect.cx, -rect.cy + rect.h - rect.radius), 
            ctx.lineTo(-rect.cx, -rect.cy + rect.radius), ctx.quadraticCurveTo(-rect.cx, -rect.cy, -rect.cx + rect.radius, -rect.cy), 
            ctx.closePath();
        }, Q.UI.Container = Q.Sprite.extend("UI.Container", {
            init: function(p, defaults) {
                var match, adjustedP = Q._clone(p || {});
                p && Q._isString(p.w) && (match = p.w.match(/^[0-9]+%$/)) && (adjustedP.w = parseInt(p.w, 10) * Q.width / 100, 
                adjustedP.x = Q.width / 2 - adjustedP.w / 2), p && Q._isString(p.h) && (match = p.h.match(/^[0-9]+%$/)) && (adjustedP.h = parseInt(p.h, 10) * Q.height / 100, 
                adjustedP.y = Q.height / 2 - adjustedP.h / 2), this._super(Q._defaults(adjustedP, defaults), {
                    opacity: 1,
                    hidden: !1,
                    fill: null,
                    highlight: null,
                    radius: 5,
                    stroke: "#000",
                    border: !1,
                    shadow: !1,
                    shadowColor: !1,
                    outlineWidth: !1,
                    outlineColor: "#000",
                    type: Q.SPRITE_NONE
                });
            },
            insert: function(obj) {
                return this.stage.insert(obj, this), obj;
            },
            fit: function(paddingY, paddingX) {
                if (0 !== this.children.length) {
                    void 0 === paddingY && (paddingY = 0), void 0 === paddingX && (paddingX = paddingY);
                    for (var minX = 1 / 0, minY = 1 / 0, maxX = -(1 / 0), maxY = -(1 / 0), i = 0; i < this.children.length; i++) {
                        var obj = this.children[i], minObjX = obj.p.x - obj.p.cx, minObjY = obj.p.y - obj.p.cy, maxObjX = obj.p.x - obj.p.cx + obj.p.w, maxObjY = obj.p.y - obj.p.cy + obj.p.h;
                        minX > minObjX && (minX = minObjX), minY > minObjY && (minY = minObjY), maxObjX > maxX && (maxX = maxObjX), 
                        maxObjY > maxY && (maxY = maxObjY);
                    }
                    this.p.cx = -minX + paddingX, this.p.cy = -minY + paddingY, this.p.w = maxX - minX + 2 * paddingX, 
                    this.p.h = maxY - minY + 2 * paddingY, Q._generatePoints(this, !0), Q._generateCollisionPoints(this, !0);
                }
            },
            addShadow: function(ctx) {
                if (this.p.shadow) {
                    var shadowAmount = Q._isNumber(this.p.shadow) ? this.p.shadow : 5;
                    ctx.shadowOffsetX = shadowAmount, ctx.shadowOffsetY = shadowAmount, ctx.shadowColor = this.p.shadowColor || "rgba(0,0,50,0.1)";
                }
            },
            clearShadow: function(ctx) {
                ctx.shadowColor = "transparent";
            },
            drawRadius: function(ctx) {
                Q.UI.roundRect(ctx, this.p), this.addShadow(ctx), ctx.fill(), this.p.border && (this.clearShadow(ctx), 
                ctx.lineWidth = this.p.border, ctx.stroke());
            },
            drawSquare: function(ctx) {
                this.addShadow(ctx), this.p.fill && ctx.fillRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h), 
                this.p.border && (this.clearShadow(ctx), ctx.lineWidth = this.p.border, ctx.strokeRect(-this.p.cx, -this.p.cy, this.p.w, this.p.h));
            },
            draw: function(ctx) {
                return this.p.hidden ? !1 : void ((this.p.border || this.p.fill) && (ctx.globalAlpha = this.p.opacity, 
                1 === this.p.frame && this.p.highlight ? ctx.fillStyle = this.p.highlight : ctx.fillStyle = this.p.fill, 
                ctx.strokeStyle = this.p.stroke, this.p.radius > 0 ? this.drawRadius(ctx) : this.drawSquare(ctx)));
            }
        }), Q.UI.Text = Q.Sprite.extend("UI.Text", {
            init: function(p, defaultProps) {
                this._super(Q._defaults(p || {}, defaultProps), {
                    type: Q.SPRITE_UI,
                    size: 24,
                    lineHeight: 1.2,
                    align: "center"
                }), this.p.label && this.calcSize();
            },
            calcSize: function() {
                var p = this.p;
                this.setFont(Q.ctx), this.splitLabel = p.label.split("\n");
                p.w = 0;
                for (var i = 0; i < this.splitLabel.length; i++) {
                    var metrics = Q.ctx.measureText(this.splitLabel[i]);
                    metrics.width > p.w && (p.w = metrics.width);
                }
                p.lineHeightPx = p.size * p.lineHeight, p.h = p.lineHeightPx * this.splitLabel.length, 
                p.halfLeading = .5 * p.size * Math.max(0, p.lineHeight - 1), p.cy = 0, "center" === p.align ? (p.cx = p.w / 2, 
                p.points = [ [ -p.cx, 0 ], [ p.cx, 0 ], [ p.cx, p.h ], [ -p.cx, p.h ] ]) : "right" === p.align ? (p.cx = p.w, 
                p.points = [ [ -p.w, 0 ], [ 0, 0 ], [ 0, p.h ], [ -p.w, p.h ] ]) : (p.cx = 0, p.points = [ [ 0, 0 ], [ p.w, 0 ], [ p.w, p.h ], [ 0, p.h ] ]);
            },
            prerender: function() {
                this.p.oldLabel !== this.p.label && (this.p.oldLabel = this.p.label, this.calcSize(), 
                this.el.width = this.p.w, this.el.height = 4 * this.p.h, this.ctx.clearRect(0, 0, this.p.w, this.p.h), 
                this.ctx.fillStyle = "#FF0", this.ctx.fillRect(0, 0, this.p.w, this.p.h / 2), this.setFont(this.ctx), 
                this.ctx.fillText(this.p.label, 0, 0));
            },
            draw: function(ctx) {
                var p = this.p;
                if (0 !== p.opacity) {
                    p.oldLabel !== p.label && this.calcSize(), this.setFont(ctx), void 0 !== p.opacity && (ctx.globalAlpha = p.opacity);
                    for (var i = 0; i < this.splitLabel.length; i++) p.outlineWidth && ctx.strokeText(this.splitLabel[i], 0, p.halfLeading + i * p.lineHeightPx), 
                    ctx.fillText(this.splitLabel[i], 0, p.halfLeading + i * p.lineHeightPx);
                }
            },
            asset: function() {
                return this.el;
            },
            setFont: function(ctx) {
                ctx.textBaseline = "top", ctx.font = this.font(), ctx.fillStyle = this.p.color || "black", 
                ctx.textAlign = this.p.align || "left", ctx.strokeStyle = this.p.outlineColor || "black", 
                ctx.lineWidth = this.p.outlineWidth || 0;
            },
            font: function() {
                return this.fontString ? this.fontString : (this.fontString = (this.p.weight || "800") + " " + (this.p.size || 24) + "px " + (this.p.family || "Arial"), 
                this.fontString);
            }
        }), Q.UI.Button = Q.UI.Container.extend("UI.Button", {
            init: function(p, callback, defaultProps) {
                if (this._super(Q._defaults(p || {}, defaultProps), {
                    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT,
                    keyActionName: null
                }), this.p.label && (!this.p.w || !this.p.h)) {
                    Q.ctx.save(), this.setFont(Q.ctx);
                    var metrics = Q.ctx.measureText(this.p.label);
                    Q.ctx.restore(), this.p.h || (this.p.h = 44), this.p.w || (this.p.w = metrics.width + 20);
                }
                isNaN(this.p.cx) && (this.p.cx = this.p.w / 2), isNaN(this.p.cy) && (this.p.cy = this.p.h / 2), 
                this.callback = callback, this.on("touch", this, "highlight"), this.on("touchEnd", this, "push"), 
                this.p.keyActionName && Q.input.on(this.p.keyActionName, this, "push");
            },
            highlight: function() {
                "undefined" != typeof this.sheet() && this.sheet().frames > 1 && (this.p.frame = 1);
            },
            push: function() {
                this.p.frame = 0, this.callback && this.callback(), this.trigger("click");
            },
            draw: function(ctx) {
                this._super(ctx), (this.p.asset || this.p.sheet) && Q.Sprite.prototype.draw.call(this, ctx), 
                this.p.label && (ctx.save(), this.setFont(ctx), ctx.fillText(this.p.label, 0, 0), 
                ctx.restore());
            },
            setFont: function(ctx) {
                ctx.textBaseline = "middle", ctx.font = this.p.font || "400 24px arial", ctx.fillStyle = this.p.fontColor || "black", 
                ctx.textAlign = "center";
            }
        }), Q.UI.IFrame = Q.Sprite.extend("UI.IFrame", {
            init: function(p) {
                this._super(p, {
                    opacity: 1,
                    type: Q.SPRITE_UI | Q.SPRITE_DEFAULT
                }), Q.wrapper.style.overflow = "hidden", this.iframe = document.createElement("IFRAME"), 
                this.iframe.setAttribute("src", this.p.url), this.iframe.style.position = "absolute", 
                this.iframe.style.zIndex = 500, this.iframe.setAttribute("width", this.p.w), this.iframe.setAttribute("height", this.p.h), 
                this.iframe.setAttribute("frameborder", 0), this.p.background && (this.iframe.style.backgroundColor = this.p.background), 
                Q.wrapper.appendChild(this.iframe), this.on("inserted", function(parent) {
                    this.positionIFrame(), parent.on("destroyed", this, "remove");
                });
            },
            positionIFrame: function() {
                var x = this.p.x, y = this.p.y;
                this.stage.viewport && (x -= this.stage.viewport.x, y -= this.stage.viewport.y), 
                this.oldX === x && this.oldY === y && this.oldOpacity === this.p.opacity || (this.iframe.style.top = y - this.p.cy + "px", 
                this.iframe.style.left = x - this.p.cx + "px", this.iframe.style.opacity = this.p.opacity, 
                this.oldX = x, this.oldY = y, this.oldOpacity = this.p.opacity);
            },
            step: function(dt) {
                this._super(dt), this.positionIFrame();
            },
            remove: function() {
                this.iframe && (Q.wrapper.removeChild(this.iframe), this.iframe = null);
            }
        }), Q.UI.HTMLElement = Q.Sprite.extend("UI.HTMLElement", {
            init: function(p) {
                this._super(p, {
                    opacity: 1,
                    type: Q.SPRITE_UI
                }), Q.wrapper.style.overflow = "hidden", this.el = document.createElement("div"), 
                this.el.innerHTML = this.p.html, Q.wrapper.appendChild(this.el), this.on("inserted", function(parent) {
                    this.position(), parent.on("destroyed", this, "remove"), parent.on("clear", this, "remove");
                });
            },
            position: function() {},
            step: function(dt) {
                this._super(dt), this.position();
            },
            remove: function() {
                this.el && (Q.wrapper.removeChild(this.el), this.el = null);
            }
        }), Q.UI.VerticalLayout = Q.Sprite.extend("UI.VerticalLayout", {
            init: function(p) {
                this.children = [], this._super(p, {
                    type: 0
                });
            },
            insert: function(sprite) {
                return this.stage.insert(sprite, this), this.relayout(), sprite;
            },
            relayout: function() {
                for (var totalHeight = 0, i = 0; i < this.children.length; i++) totalHeight += this.children[i].p.h || 0;
                this.p.h - totalHeight;
            }
        });
    };
};

"undefined" == typeof Quintus ? module.exports = quintusUI : quintusUI(Quintus);