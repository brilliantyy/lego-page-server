(function(t){function e(e){for(var r,a,c=e[0],s=e[1],u=e[2],l=0,f=[];l<c.length;l++)a=c[l],Object.prototype.hasOwnProperty.call(o,a)&&o[a]&&f.push(o[a][0]),o[a]=0;for(r in s)Object.prototype.hasOwnProperty.call(s,r)&&(t[r]=s[r]);p&&p(e);while(f.length)f.shift()();return i.push.apply(i,u||[]),n()}function n(){for(var t,e=0;e<i.length;e++){for(var n=i[e],r=!0,c=1;c<n.length;c++){var s=n[c];0!==o[s]&&(r=!1)}r&&(i.splice(e--,1),t=a(a.s=n[0]))}return t}var r={},o={main:0},i=[];function a(e){if(r[e])return r[e].exports;var n=r[e]={i:e,l:!1,exports:{}};return t[e].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=t,a.c=r,a.d=function(t,e,n){a.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},a.r=function(t){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},a.t=function(t,e){if(1&e&&(t=a(t)),8&e)return t;if(4&e&&"object"===typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)a.d(n,r,function(e){return t[e]}.bind(null,r));return n},a.n=function(t){var e=t&&t.__esModule?function(){return t["default"]}:function(){return t};return a.d(e,"a",e),e},a.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},a.p="/dist/";var c=window["webpackJsonp"]=window["webpackJsonp"]||[],s=c.push.bind(c);c.push=e,c=c.slice();for(var u=0;u<c.length;u++)e(c[u]);var p=s;i.push(["a949","chunk-vendors"]),n()})({"2b4e":function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{style:t.wrapperStyle},[n("div",{staticClass:"swiper-container swiper-rotate",style:t.contentStyle,attrs:{id:t.id}},[n("div",{staticClass:"swiper-wrapper"},t._l(t.slides,(function(e,r){return n("div",{key:r,staticClass:"swiper-slide",style:t.slideStyle},[n("img",{style:{objectFit:t.css.objectFit},attrs:{src:e.url}})])})),0),t._v(" "),n("div",{staticClass:"swiper-pagination"})])])},o=[],i={name:"cmp-carousel",inheritAttrs:!1,data:function(){return{instance:null,slides:this.options.items}},props:{id:{type:String,default:""},css:{type:Object,default:function(){}},options:{type:Object,default:function(){}}},computed:{wrapperStyle:function(){var t=this.css,e=t.left,n=t.top,r=t.right,o=t.width,i=t.height,a=t.paddingLeft,c=t.paddingTop,s=t.paddingBottom,u=t.paddingRight,p=t.marginTop,l=t.marginLeft,f=t.marginBottom,d=t.marginRight,g=t.zIndex,m=t.borderColor,h=t.borderStyle,b=t.borderWidth,y=t.boxSizing;return{position:"absolute",left:e,top:n,right:r,width:o,height:i,paddingLeft:a,paddingTop:c,paddingBottom:s,paddingRight:u,marginTop:p,marginLeft:l,marginBottom:f,marginRight:d,zIndex:g,borderColor:m,borderStyle:h,borderWidth:b,boxSizing:y}},contentStyle:function(){var t=this.css,e=t.borderRadius,n=t.backgroundColor;return{height:"100%",borderRadius:e,backgroundColor:n}}},mounted:function(){this.init(),console.log(this.options)},beforeDestroy:function(){this.instance.destroy()},methods:{init:function(){var t=this;this.$nextTick((function(){var e={loop:!0,autoplay:t.options.autoplay,delay:t.options.delay,speed:t.options.speed,effect:t.options.effect,pagination:{el:".swiper-pagination"}};t.instance=new Swiper("#".concat(t.id),e)}))}}},a=i,c=n("2877"),s=Object(c["a"])(a,r,o,!1,null,null,null);e["default"]=s.exports},7831:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"cmp-div",style:t.css,on:{click:t.handleClick}})},o=[],i={name:"cmp-div",inheritAttrs:!1,data:function(){return{}},props:{id:{type:String,default:""},css:{type:Object,default:function(){}},options:{type:Object,default:function(){}}},methods:{handleClick:function(){console.log(1)}}},a=i,c=n("2877"),s=Object(c["a"])(a,r,o,!1,null,null,null);e["default"]=s.exports},a949:function(t,e,n){"use strict";n.r(e);n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),o=(n("8e6e"),n("ac6a"),n("456d"),n("ade3")),i=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{attrs:{id:"lego-app"}},t._l(t.cmps,(function(t){return n(t.name,{key:t.id,tag:"component",attrs:{id:t.id,css:t.css,options:t.options}})})),1)},a=[],c={name:"lego-app",data:function(){return{}},props:{cmps:{type:Array,default:function(){return[]}}}},s=c,u=n("2877"),p=Object(u["a"])(s,i,a,!1,null,null,null),l=p.exports,f=n("8c4f");function d(){return new f["a"]({mode:"history",routes:[{path:"/",name:"index",component:l}]})}r["a"].use(f["a"]);var g=n("2f62");function m(){return new g["a"].Store({state:{__PAGE_DATA__:{}},mutations:{},actions:{}})}r["a"].use(g["a"]);n("6762");function h(t){var e=["width","height","left","top","bottom","right","borderWidth","borderRadius","fontSize","lineHeight","letterSpacing","paddingTop","paddingLeft","paddingBottom","paddingRight","marginTop","margiLeft","marginBottom","marginRight","slideWidth"],n=Object.assign({},t);return Object.keys(n).forEach((function(t){e.includes(t)&&(n[t]="".concat(parseFloat(n[t]/37.5).toFixed(2),"rem"))})),n.position="absolute",n}function b(t){var e=[];return t.keys().forEach((function(n){e.push(t(n))})),e}n("7f7f");function y(t){var e=b(n("ffe0"));e.forEach((function(e){t.component(e.default.name,e.default)}))}var v=y;function O(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),n.push.apply(n,r)}return n}function _(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?O(Object(n),!0).forEach((function(e){Object(o["a"])(t,e,n[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):O(Object(n)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))}))}return t}function w(t){var e=t.Vue,n=t.pageData,r=d(),o=m();v(e);var i=[],a=null;try{a=JSON.parse(n)}catch(s){}a&&a.components&&a.components.length&&(i=a.components.map((function(t){return _(_({},t),{},{css:h(t.css)})})));var c=new e({router:r,store:o,render:function(t){return t(l,{props:{cmps:i}})}});return{app:c,router:r,store:o}}var j="{}";window.__PAGE_DATA__&&(j=JSON.stringify(window.__PAGE_DATA__));var S=w({Vue:r["a"],pageData:j}),x=S.app,T=S.store;window.__INITIAL_STATE__&&T.replaceState(window.__INITIAL_STATE__),x.$mount("#lego-app")},c06c:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("img",{staticClass:"cmp-image",style:t.css,attrs:{src:t.options.url}})},o=[],i={name:"cmp-image",inheritAttrs:!1,data:function(){return{}},props:{id:{type:String,default:""},css:{type:Object,default:function(){}},options:{type:Object,default:function(){}}}},a=i,c=n("2877"),s=Object(c["a"])(a,r,o,!1,null,null,null);e["default"]=s.exports},ef86:function(t,e,n){"use strict";n.r(e);var r=function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("p",{staticClass:"cmp-text",style:t.css},[t._v(t._s(t.options.text))])},o=[],i={name:"cmp-text",inheritAttrs:!1,data:function(){return{}},props:{id:{type:String,default:""},css:{type:Object,default:function(){}},options:{type:Object,default:function(){}}}},a=i,c=n("2877"),s=Object(c["a"])(a,r,o,!1,null,null,null);e["default"]=s.exports},ffe0:function(t,e,n){var r={"./cmpCarousel/cmpCarousel.vue":"2b4e","./cmpDiv/cmpDiv.vue":"7831","./cmpImage/cmpImage.vue":"c06c","./cmpText/cmpText.vue":"ef86"};function o(t){var e=i(t);return n(e)}function i(t){if(!n.o(r,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return r[t]}o.keys=function(){return Object.keys(r)},o.resolve=i,t.exports=o,o.id="ffe0"}});
//# sourceMappingURL=main.d58f9919.js.map