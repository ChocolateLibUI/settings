var v=Object.defineProperty;var S=(r,i,e)=>i in r?v(r,i,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[i]=e;var h=(r,i,e)=>(S(r,typeof i!="symbol"?i+"":i,e),e);(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))t(s);new MutationObserver(s=>{for(const n of s)if(n.type==="childList")for(const _ of n.addedNodes)_.tagName==="LINK"&&_.rel==="modulepreload"&&t(_)}).observe(document,{childList:!0,subtree:!0});function e(s){const n={};return s.integrity&&(n.integrity=s.integrity),s.referrerpolicy&&(n.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?n.credentials="include":s.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function t(s){if(s.ep)return;s.ep=!0;const n=e(s);fetch(s.href,n)}})();const y="modulepreload",x=function(r,i){return new URL(r,i).href},d={},w=function(i,e,t){if(!e||e.length===0)return i();const s=document.getElementsByTagName("link");return Promise.all(e.map(n=>{if(n=x(n,t),n in d)return;d[n]=!0;const _=n.endsWith(".css"),u=_?'[rel="stylesheet"]':"";if(!!t)for(let l=s.length-1;l>=0;l--){const o=s[l];if(o.href===n&&(!_||o.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${n}"]${u}`))return;const a=document.createElement("link");if(a.rel=_?"stylesheet":y,_||(a.as="script",a.crossOrigin=""),a.href=n,document.head.appendChild(a),_)return new Promise((l,o)=>{a.addEventListener("load",l),a.addEventListener("error",()=>o(new Error(`Unable to preload CSS for ${n}`)))})})).then(()=>i())};let g=(r,i)=>{var t;let e=new TextEncoder().encode(r);return r=new TextDecoder().decode(e.slice(0,i)),((t=r.at(-1))==null?void 0:t.charCodeAt(0))===65533?r.slice(0,-1):r};class p{constructor(i){h(this,"___valueListeners",[]);h(this,"___value");h(this,"info");this.___value=i}addListener(i,e){if(this.___valueListeners.push(i),e){let t=this.get;t instanceof Promise?t.then(i):i(t)}return i}removeListener(i){let e=this.___valueListeners.indexOf(i);return e!=-1&&this.___valueListeners.splice(e,1),i}get get(){return this.___value}set set(i){this.___value!==i&&(this.___value=i,this.___update())}___update(){if(this.___valueListeners)for(let i=0,e=this.___valueListeners.length;i<e;i++)try{this.___valueListeners[i](this.___value)}catch(t){console.warn("Failed while calling value listeners ",t)}}compare(i){let e=this.get;return e instanceof Promise?e.then(t=>i!==t):i!==e}get inUse(){return this.___valueListeners.length!==0}hasListener(i){return this.___valueListeners.indexOf(i)!==-1}toJSON(){return this.___value}}class L extends p{constructor(e,t){super(e);h(this,"___limiters");h(this,"___limitersListeners",[]);this.___limiters=t}addLimiterListener(e,t){return this.___limitersListeners.push(e),t&&e(this),e}removeLimiterListener(e){let t=this.___limitersListeners.indexOf(e);return t!=-1&&this.___limitersListeners.splice(t,1),e}___updateLimiter(){if(this.___limitersListeners)for(let e=0,t=this.___limitersListeners.length;e<t;e++)try{this.___limitersListeners[e](this)}catch(s){console.warn("Failed while calling value listeners ",s)}}get limiters(){return this.___limiters}set limiters(e){e?this.___limiters=e:delete this.___limiters,this.___updateLimiter()}checkLimit(e){if(this.___limiters){for(let t=0;t<this.___limiters.length;t++)if(this.___limiters[t].func(e))return!1}return!0}checkLimitReason(e){if(this.___limiters){for(let t=0;t<this.___limiters.length;t++)if(this.___limiters[t].func(e))switch(typeof this.___limiters[t].reason){case"string":return this.___limiters[t].reason;case"function":return this.___limiters[t].reason(e)}}return!0}set set(e){e===this.___value||!this.checkLimit(e)||(this.___value=e,this.___update())}}class k extends L{constructor(e,t=-1/0,s=1/0,n,_){super(e,_);h(this,"_min");h(this,"_max");h(this,"_step");h(this,"halfStep",0);this._min=t,this._max=s,n&&(this._step=n,this.halfStep=n/2)}get min(){return this._min}set min(e){this._min=e;let t=Math.max(this._min,this.___value);this.___value!==t&&(this.___value=t,this.___update()),this.___updateLimiter()}get max(){return this._max}set max(e){this._max=e;let t=Math.min(this._max,this.___value);this.___value!==t&&(this.___value=t,this.___update()),this.___updateLimiter()}get step(){return this._step}set step(e){if(e){this._step=e,this.halfStep=e/2;let t=this.___value%this._step,s=t>this.halfStep?this.___value+(this._step-t):this.___value-t;s!==this.___value&&(this.___value=s,this.___update())}else delete this._step,this.halfStep=0;this.___updateLimiter()}set set(e){if(this._step){let t=e%this._step;e=t>this.halfStep?e+(this._step-t):e-t}e=Math.min(this._max,Math.max(this._min,e)),e!==this.___value&&this.checkLimit(e)&&(this.___value=e,this.___update())}}class b extends L{constructor(e,t,s,n,_){super(e,_);h(this,"_maxLength");h(this,"_maxByteLength");h(this,"___enums");this._maxLength=s,this._maxByteLength=n,this.___enums=t}get enums(){return this.___enums}set enums(e){if(e){if(this.___enums=e,!this.checkEnum(this.___value))for(const t in this.___enums){this.___value=t,this.___update();return}}else delete this.___enums;this.___updateLimiter()}get enum(){if(this.___enums)return this.___enums[this.___value]}checkEnum(e){return!this.___enums||e in this.___enums}get maxLength(){return this._maxLength}set maxLength(e){this._maxLength=e,this._maxLength&&this.___value.length>this._maxLength&&(this.___value=this.___value.slice(0,this._maxLength),this.___update()),this.___updateLimiter()}get maxByteLength(){return this._maxByteLength}set maxByteLength(e){if(this._maxByteLength=e,this._maxByteLength){let t=g(this.___value,this._maxByteLength);this.___value!==t&&(this.___value=t,this.___update())}this.___updateLimiter()}set set(e){this._maxLength&&e.length>this._maxLength&&(e=e.slice(0,this._maxLength)),this._maxByteLength&&(e=g(e,this._maxByteLength)),e!==this.___value&&this.checkLimit(e)&&this.checkEnum(e)&&(this.___value=e,this.___update())}}let f={},E=(r,i,e)=>(f[r]=new c(r,i,e),f[r]);class c{constructor(i,e,t){h(this,"pathID");h(this,"settings",{});h(this,"subGroups",{});h(this,"name");h(this,"description");this.pathID=i,this.name=e,this.description=t}makeSubGroup(i,e,t){if(i in this.subGroups){console.warn("Sub group already registered "+i);return}else return this.subGroups[i]=new c(this.pathID+"/"+i,e,t)}makeBooleanSetting(i,e,t,s){if(i in this.settings)throw new Error("Settings already registered "+i);let n=localStorage[this.pathID+"/"+i],_=new p(n?JSON.parse(n):s);return _.info={name:e,description:t},_.addListener(u=>{localStorage[this.pathID+"/"+i]=JSON.stringify(u)},!n),this.settings[i]=_}makeNumberSetting(i,e,t,s,n,_,u,m){if(i in this.settings)throw new Error("Settings already registered "+i);let a=localStorage[this.pathID+"/"+i],l=new k(a?JSON.parse(a):s,n,_,u,m);return l.info={name:e,description:t},l.addListener(o=>{localStorage[this.pathID+"/"+i]=JSON.stringify(o)},!a),this.settings[i]=l}makeStringSetting(i,e,t,s,n,_,u,m){if(i in this.settings)throw new Error("Settings already registered "+i);let a=localStorage[this.pathID+"/"+i],l=new b(a?JSON.parse(a):s,n,_,u,m);return l.info={name:e,description:t},l.addListener(o=>{localStorage[this.pathID+"/"+i]=JSON.stringify(o)},!a),this.settings[i]=l}}(async()=>{let r=E((await w(()=>import("./package.c758d59c.js"),[],import.meta.url)).name,"Test Settings","Description of test settings"),i=r.makeBooleanSetting("TestBool","","",!1),e=document.createElement("input");e.type="checkbox",document.body.appendChild(e),e.checked=await i.get,e.addEventListener("change",u=>{i.set=e.checked});let t=r.makeNumberSetting("TestNumber","","",10,2,99),s=document.createElement("input");s.type="number",s.min=String(t.min),s.max=String(t.max),document.body.appendChild(s),s.value=String(await t.get),s.addEventListener("change",async u=>{t.set=Number(s.value),s.value=String(await t.get)});let n=r.makeStringSetting("TestString","","","asdf",void 0,10),_=document.createElement("input");document.body.appendChild(_),_.value=await n.get,_.addEventListener("change",async u=>{n.set=_.value,_.value=await n.get})})();
