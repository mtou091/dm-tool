/*!
 * Cloudgamer JavaScript Library v0.1
 * Copyright (c) 2009 cloudgamer
 * Blog: http://cloudgamer.cnblogs.com/
 * Date: 2009-10-15
 */

var $$, $$B, $$A, $$F, $$D, $$E, $$CE, $$S;

(function(undefined){

var O, B, A, F, D, E, CE, S;


/*Object*/

O = function (id) {
	return "string" == typeof id ? document.getElementById(id) : id;
};

O.emptyFunction = function(){};

O.extend = function (destination, source, override) {
	if (override === undefined) override = true;
	for (var property in source) {
		if (override || !(property in destination)) {
			destination[property] = source[property];
		}
	}
	return destination;
};

O.deepextend = function (destination, source) {
	for (var property in source) {
		var copy = source[property];
		if ( destination === copy ) continue;
		if ( typeof copy === "object" ){
			destination[property] = arguments.callee( destination[property] || {}, copy );
		}else{
			destination[property] = copy;
		}
	}
	return destination;
};

/*from youa*/
O.wrapper = function(me, parent) {
    var ins = function() { me.apply(this, arguments); };
    var subclass = function() {};
    subclass.prototype = parent.prototype;
    ins.prototype = new subclass;
    return ins;
};


/*Browser*/

/*from youa*/
B = (function(ua){
	var b = {
		msie: /msie/.test(ua) && !/opera/.test(ua),
		opera: /opera/.test(ua),
		safari: /webkit/.test(ua) && !/chrome/.test(ua),
		firefox: /firefox/.test(ua),
		chrome: /chrome/.test(ua)
	};
	var vMark = "";
	for (var i in b) {
		if (b[i]) { vMark = "safari" == i ? "version" : i; break; }
	}
	b.version = vMark && RegExp("(?:" + vMark + ")[\\/: ]([\\d.]+)").test(ua) ? RegExp.$1 : "0";
	
	b.ie = b.msie;
	b.ie6 = b.msie && parseInt(b.version, 10) == 6;
	b.ie7 = b.msie && parseInt(b.version, 10) == 7;
	b.ie8 = b.msie && parseInt(b.version, 10) == 8;
	
	return b;
})(window.navigator.userAgent.toLowerCase());


/*Array*/

A = function(){
	
	var ret = {
		isArray: function( obj ) {
			return Object.prototype.toString.call(obj) === "[object Array]";
		},
		indexOf: function( array, elt, from ){
			if (array.indexOf) {
				return isNaN(from) ? array.indexOf(elt) : array.indexOf(elt, from);
			} else {
				var len = array.length;
				from = isNaN(from) ? 0
					: from < 0 ? Math.ceil(from) + len : Math.floor(from);
				
				for ( ; from < len; from++ ) { if ( array[from] === elt ) return from; }
				return -1;
			}
		},
		lastIndexOf: function( array, elt, from ){
			if (array.lastIndexOf) {
				return isNaN(from) ? array.lastIndexOf(elt) : array.lastIndexOf(elt, from);
			} else {
				var len = array.length;
				from = isNaN(from) || from >= len - 1 ? len - 1
					: from < 0 ? Math.ceil(from) + len : Math.floor(from);
				
				for ( ; from > -1; from-- ) { if ( array[from] === elt ) return from; }
				return -1;
			}
		}
	};
	
	function each( object, callback ) {
		if ( undefined === object.length ){
			for ( var name in object ) {
				if (false === callback( object[name], name, object )) break;
			}
		} else {
			for ( var i = 0, len = object.length; i < len; i++ ) {
				if (i in object) { if (false === callback( object[i], i, object )) break; }
			}
		}
	};
	
	each({
			forEach: function( object, callback, thisp ){
				each( object, function(){ callback.apply(thisp, arguments); } );
			},
			map: function( object, callback, thisp ){
				var ret = [];
				each( object, function(){ ret.push(callback.apply(thisp, arguments)); });
				return ret;
			},
			filter: function( object, callback, thisp ){
				var ret = [];
				each( object, function(item){
						callback.apply(thisp, arguments) && ret.push(item);
					});
				return ret;
			},
			every: function( object, callback, thisp ){
				var ret = true;
				each( object, function(){
						if ( !callback.apply(thisp, arguments) ){ ret = false; return false; };
					});
				return ret;
			},
			some: function( object, callback, thisp ){
				var ret = false;
				each( object, function(){
						if ( callback.apply(thisp, arguments) ){ ret = true; return false; };
					});
				return ret;
			}
		}, function(method, name){
			ret[name] = function( object, callback, thisp ){
				if (object[name]) {
					return object[name]( callback, thisp );
				} else {
					return method( object, callback, thisp );
				}
			}
		});
	
	return ret;
}();


/*Function*/

F = (function(){
	var slice = Array.prototype.slice;
	return {
		bind: function( fun, thisp ) {
			var args = slice.call(arguments, 2);
			return function() {
				return fun.apply(thisp, args.concat(slice.call(arguments)));
			}
		},
		bindAsEventListener: function( fun, thisp ) {
			var args = slice.call(arguments, 2);
			return function(event) {
				return fun.apply(thisp, [E.fixEvent(event)].concat(args));
			}
		}
	};
})();


/*Dom*/

D = {
	getScrollTop: function(node) {
		var doc = node ? node.ownerDocument : document;
		return doc.documentElement.scrollTop || doc.body.scrollTop;
	},
	getScrollLeft: function(node) {
		var doc = node ? node.ownerDocument : document;
		return doc.documentElement.scrollLeft || doc.body.scrollLeft;
	},
	contains: document.defaultView
		? function (a, b) { return !!( a.compareDocumentPosition(b) & 16 ); }
		: function (a, b) { return a != b && a.contains(b); },
	rect: function(node){
		var left = 0, top = 0, right = 0, bottom = 0;
		//ie8的getBoundingClientRect获取不准确
		if ( !node.getBoundingClientRect || B.ie8 ) {
			var n = node;
			while (n) { left += n.offsetLeft, top += n.offsetTop; n = n.offsetParent; };
			right = left + node.offsetWidth; bottom = top + node.offsetHeight;
		} else {
			var rect = node.getBoundingClientRect();
			left = right = D.getScrollLeft(node); top = bottom = D.getScrollTop(node);
			left += rect.left; right += rect.right;
			top += rect.top; bottom += rect.bottom;
		};
		return { "left": left, "top": top, "right": right, "bottom": bottom };
	},
	clientRect: function(node) {
		var rect = D.rect(node), sLeft = D.getScrollLeft(node), sTop = D.getScrollTop(node);
		rect.left -= sLeft; rect.right -= sLeft;
		rect.top -= sTop; rect.bottom -= sTop;
		return rect;
	},
	curStyle: document.defaultView
		? function (elem) { return document.defaultView.getComputedStyle(elem, null); }
		: function (elem) { return elem.currentStyle; },
	getStyle: document.defaultView
		? function (elem, name) {
			var style = document.defaultView.getComputedStyle(elem, null);
			return name in style ? style[ name ] : style.getPropertyValue( name );
		}
		: function (elem, name) {
			var style = elem.style, curStyle = elem.currentStyle;
			//透明度 from youa
			if ( name == "opacity" ) {
				if ( /alpha\(opacity=(.*)\)/i.test(curStyle.filter) ) {
					var opacity = parseFloat(RegExp.$1);
					return opacity ? opacity / 100 : 0;
				}
				return 1;
			}
			if ( name == "float" ) { name = "styleFloat"; }
			var ret = curStyle[ name ] || curStyle[ S.camelize( name ) ];
			//单位转换 from jqury
			if ( !/^-?\d+(?:px)?$/i.test( ret ) && /^\-?\d/.test( ret ) ) {
				var left = style.left, rtStyle = elem.runtimeStyle, rsLeft = rtStyle.left;
				
				rtStyle.left = curStyle.left;
				style.left = ret || 0;
				ret = style.pixelLeft + "px";
				
				style.left = left;
				rtStyle.left = rsLeft;
			}
			return ret;
		},
	setStyle: function(elems, style, value) {
		if ( !elems.length ) { elems = [ elems ]; }
		if ( typeof style == "string" ) { var s = style; style = {}; style[s] = value; }
		A.forEach( elems, function(elem ) {
			for (var name in style) {
				var value = style[name];
				if (name == "opacity" && B.ie) {
					//ie透明度设置 from jquery
					elem.style.filter = (elem.currentStyle && elem.currentStyle.filter || "").replace( /alpha\([^)]*\)/, "" ) + " alpha(opacity=" + (value * 100 | 0) + ")";
				} else if (name == "float") {
					elem.style[ B.ie ? "styleFloat" : "cssFloat" ] = value;
				} else {
					elem.style[ S.camelize( name ) ] = value;
				}
			};
		});
	},
	getSize: function(elem) {
		var width = elem.offsetWidth, height = elem.offsetHeight;
		if ( !width && !height ) {
			var repair = !D.contains( document.body, elem ), parent;
			if ( repair ) {//如果元素不在body上
				parent = elem.parentNode;
				document.body.insertBefore(elem, document.body.childNodes[0]);
			}
			var style = elem.style,
				cssShow = { position: "absolute", visibility: "hidden", display: "block", left: "-9999px", top: "-9999px" },
				cssBack = { position: style.position, visibility: style.visibility, display: style.display, left: style.left, top: style.top };
			D.setStyle( elem, cssShow );
			width = elem.offsetWidth; height = elem.offsetHeight;
			D.setStyle( elem, cssBack );
			if ( repair ) {
				parent ? parent.appendChild(elem) : document.body.removeChild(elem);
			}
		}
		return { "width": width, "height": height };
	}
};


/*Event*/
E = (function(){
	/*from dean edwards*/
	var addEvent, removeEvent, guid = 1,
		storage = function( element, type, handler ){
			if (!handler.$$guid) handler.$$guid = guid++;
			if (!element.events) element.events = {};
			var handlers = element.events[type];
			if (!handlers) {
				handlers = element.events[type] = {};
				if (element["on" + type]) {
					handlers[0] = element["on" + type];
				}
			}
		};
	if ( window.addEventListener ) {
		var fix = { "mouseenter": "mouseover", "mouseleave": "mouseout" };
		addEvent = function( element, type, handler ){
			if ( type in fix ) {
				storage( element, type, handler );
				var fixhandler = element.events[type][handler.$$guid] = function(event){
					var related = event.relatedTarget;
					if ( !related || (element != related && !(element.compareDocumentPosition(related) & 16)) ){
						handler.call(this, event);
					}
				};
				element.addEventListener(fix[type], fixhandler, false);
			} else {
				element.addEventListener(type, handler, false);
			};
		};
		removeEvent = function( element, type, handler ){
			if ( type in fix ) {
				if (element.events && element.events[type]) {
					element.removeEventListener(fix[type], element.events[type][handler.$$guid], false);
					delete element.events[type][handler.$$guid];
				}
			} else {
				element.removeEventListener(type, handler, false);
			};
		};
	} else {
		addEvent = function( element, type, handler ){
			storage( element, type, handler );
			element.events[type][handler.$$guid] = handler;
			element["on" + type] = handleEvent;
		};
		removeEvent = function( element, type, handler ){
			if (element.events && element.events[type]) {
				delete element.events[type][handler.$$guid];
			}
		};
		function handleEvent() {
			var returnValue = true, event = fixEvent();
			var handlers = this.events[event.type];
			for (var i in handlers) {
				this.$$handleEvent = handlers[i];
				if (this.$$handleEvent(event) === false) {
					returnValue = false;
				}
			}
			return returnValue;
		};
	}
	
	function fixEvent(event) {
		if (event) return event;
		event = window.event;
		event.pageX = event.clientX + D.getScrollLeft(event.srcElement);
		event.pageY = event.clientY + D.getScrollTop(event.srcElement);
		event.target = event.srcElement;
		event.stopPropagation = stopPropagation;
		event.preventDefault = preventDefault;
		var relatedTarget = {
				"mouseout": event.toElement, "mouseover": event.fromElement
			}[ event.type ];
		if ( relatedTarget ){ event.relatedTarget = relatedTarget;}
		
		return event;
	};
	function stopPropagation() { this.cancelBubble = true; };
	function preventDefault() { this.returnValue = false; };
	
	return {
		"addEvent": addEvent,
		"removeEvent": removeEvent,
		"fixEvent": fixEvent
	};
})();


/*CustomEvent*/

CE = (function(){
	var guid = 1;
	return {
		addEvent: function( object, type, handler ){
			if (!handler.$$$guid) handler.$$$guid = guid++;
			if (!object.cusevents) object.cusevents = {};
			if (!object.cusevents[type]) object.cusevents[type] = {};
			object.cusevents[type][handler.$$$guid] = handler;
		},
		removeEvent: function( object, type, handler ){
			if (object.cusevents && object.cusevents[type]) {
				delete object.cusevents[type][handler.$$$guid];
			}
		},
		fireEvent: function( object, type ){
			if (!object.cusevents) return;
			var args = Array.prototype.slice.call(arguments, 2),
				handlers = object.cusevents[type];
			for (var i in handlers) {
				handlers[i].apply(object, args);
			}
		},
		clearEvent: function( object ){
			if (!object.cusevents) return;
			for (var type in object.cusevents) {
				var handlers = object.cusevents[type];
				for (var i in handlers) {
					handlers[i] = null;
				}
				object.cusevents[type] = null;
			}
			object.cusevents = null;
		}
	};
})();


/*String*/

S = {
	camelize: function(s){
		return s.replace(/-([a-z])/ig, function(all, letter) { return letter.toUpperCase(); });
	}
};


/*System*/

// remove css image flicker
if (B.ie6) {
	try {
		document.execCommand("BackgroundImageCache", false, true);
	} catch(e) {}
};


/*define*/

$$ = O; $$B = B; $$A = A; $$F = F; $$D = D; $$E = E; $$CE = CE; $$S = S;

})();