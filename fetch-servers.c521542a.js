parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"NiJU":[function(require,module,exports) {
function e(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function t(t){for(var r=1;r<arguments.length;r++){var o=null!=arguments[r]?arguments[r]:{};r%2?e(Object(o),!0).forEach(function(e){n(t,e,o[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))})}return t}function n(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}const r=[{url:"https://play.gib.murl.is/serverinfo"}];function o(e){"loading"!=document.readyState?e():document.addEventListener("DOMContentLoaded",e)}function a(e,t){const n=[];let r=0;for(;r<e.length;)n.push(e.slice(r,t+r)),r+=t;return n}function c(e){return e.toLowerCase().split(" ").map(function(e){return e[0].toUpperCase()+e.slice(1)}).join(" ")}function i(e){return a(e.split("\n"),4).map(e=>({timestamp:e[0],players:e[1],maxplayers:e[2],map:e[3]}))}async function s(){const e=await fetch("https://worldtimeapi.org/api/timezone/Etc/UTC");return(await e.json()).unixtime}function l(e,t,n=900){return e<t+n&&e>t-n}function u(e,t){return e.toLowerCase().startsWith(t.toLowerCase())&&(e=e.slice(t.length)),c(e.replace(/_/g," "))}function f(e,t){const n=document.querySelector("[data-server-cluster-index='".concat(e,"']")),r=n.querySelectorAll("[data-server-index]");if(n.classList.add("synced"),0===t.length)for(let o=0;o<r.length;o++)t[o]={online:!1};t.forEach(({online:e,players:t,maxplayers:n,map:o},a)=>{const c=r[a].querySelector(".servers__map"),i=r[a].querySelector(".servers__players"),s=r[a].querySelector(".servers__status");e||(o=null,t=null),c.innerHTML=o?u(o,"mg_"):"&ndash;",i.innerHTML=t?"".concat(t,"/").concat(n):"&ndash;",s.innerHTML=e?"Online":"Offline",r[a].classList.add(e?"online":"offline")})}async function p(){let e;try{e=await s()}catch(n){console.warn("Unable to fetch remote timestamp. Using local time.\n",n),e=Math.floor(Date.now()/1e3)}r.forEach(async({url:r},a)=>{let c=[];try{const e=await fetch(r),t=await e.text();c=i(t)}catch(n){console.warn("Could not fetch data for cluster",a),console.error(n)}c=c.map(n=>t({online:l(n.timestamp,e)},n)),o(()=>f(a,c))})}p();const d=60;let y=window.setInterval(p,6e4);document.addEventListener("visibilitychange",()=>{"visible"===document.visibilityState?(p(),y=window.setInterval(p,6e4)):window.clearInterval(y)});
},{}]},{},["NiJU"], null)
//# sourceMappingURL=fetch-servers.c521542a.js.map