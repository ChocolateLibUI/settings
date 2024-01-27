var N=(s,e,t)=>{if(!e.has(s))throw TypeError("Cannot "+t)};var a=(s,e,t)=>(N(s,e,"read from private field"),t?t.call(s):e.get(s)),w=(s,e,t)=>{if(e.has(s))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(s):e.set(s,t)},d=(s,e,t,n)=>(N(s,e,"write to private field"),n?n.call(s,t):e.set(s,t),t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const u of r)if(u.type==="childList")for(const i of u.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function t(r){const u={};return r.integrity&&(u.integrity=r.integrity),r.referrerPolicy&&(u.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?u.credentials="include":r.crossOrigin==="anonymous"?u.credentials="omit":u.credentials="same-origin",u}function n(r){if(r.ep)return;r.ep=!0;const u=t(r);fetch(r.href,u)}})();class v{constructor(e){this.value=e}get ok(){return!0}get err(){return!1}expect(){return this.value}expectErr(e){throw new Error(e)}get unwrap(){return this.value}unwrapOr(){return this.value}andThen(e){return e(this.value)}orElse(){return this}map(e){return new v(e(this.value))}mapErr(){return this}get toOptional(){return new y(this.value)}safeUnwrap(){return this.value}}var p;const T=class T{constructor(e){w(this,p,void 0);d(this,p,new Error().stack),this.error=e}get valid(){return!1}get ok(){return!1}get err(){return!0}expect(e){throw new Error(e+`
Original `+a(this,p)+`
Expect Error`)}expectErr(){return this.error}get unwrap(){throw new Error(`Tried to unwrap Error
Original `+a(this,p)+`
Unwrap Error`)}unwrapOr(e){return e}andThen(){return this}orElse(e){return e(this.error)}map(){return this}mapErr(e){return new T(e(this.error))}get toOptional(){return new L}get stack(){return a(this,p)}};p=new WeakMap;let E=T;class y{constructor(e){this.value=e}get valid(){return!0}get some(){return!0}get none(){return!1}expect(){return this.value}get unwrap(){return this.value}unwrapOr(){return this.value}andThen(e){return e(this.value)}orElse(){return this}map(e){return new y(e(this.value))}toResult(){return new v(this.value)}}class L{get valid(){return!1}get some(){return!1}get none(){return!0}expect(e){throw new Error(e)}get unwrap(){throw new Error("Tried to unwrap None")}unwrapOr(e){return e}andThen(){return this}orElse(e){return e()}map(){return this}toResult(e){return new E(e)}}function m(s){return new v(s)}function x(s){return new y(s)}function P(){return new L}class I{constructor(){this.subscribers=[]}subscribe(e,t){return this.subscribers.includes(e)?(console.warn("Function already registered as subscriber"),e):(this.subscribers.push(e),t&&this.then(n=>{e(n)}),e)}unsubscribe(e){const t=this.subscribers.indexOf(e);return t!=-1?this.subscribers.splice(t,1):console.warn("Subscriber not found with state",this,e),e}related(){return P()}inUse(){return!!this.subscribers.length}hasSubscriber(e){return this.subscribers.includes(e)}updateSubscribers(e){for(let t=0,n=this.subscribers.length;t<n;t++)try{this.subscribers[t](e)}catch(r){console.warn("Failed while calling subscribers ",r,this,this.subscribers[t])}}}var h,g,l,b;class k extends I{constructor(t,n,r,u){super();w(this,h,void 0);w(this,g,void 0);w(this,l,void 0);w(this,b,void 0);if(n&&d(this,g,n===!0?i=>a(this,l)?a(this,l).limit(i).map(o=>m(o)):x(m(i)):n),r&&d(this,l,r),u&&d(this,b,u),t instanceof Promise)this.then=t.then.bind(t),t.then(i=>{d(this,h,i),delete this.then,delete this.write}),this.write=i=>{t.then(()=>{delete this.write,this.write(i)})};else if(typeof t=="function"){let i=new Promise(o=>{this.then=c=>{let f=t();return this.then=f.then.bind(f),f.then(D=>{d(this,h,D),delete this.then,delete this.write,o()}),f.then(c)}});this.write=o=>{i.then(()=>{delete this.write,this.write(o)})}}else d(this,h,t)}async then(t){return t(a(this,h))}related(){return a(this,b)?a(this,b).call(this):P()}write(t){a(this,g)&&a(this,h).ok&&a(this,h).value!==t&&a(this,g).call(this,t).map(this.set.bind(this))}check(t){return a(this,l)?a(this,l).check(t):void 0}limit(t){return a(this,l)?a(this,l).limit(t):x(t)}set(t){d(this,h,t),this.updateSubscribers(t)}}h=new WeakMap,g=new WeakMap,l=new WeakMap,b=new WeakMap;let G=(s,e,t)=>new O(s,e,t);class O{constructor(e,t,n){this.settings={},this.subGroups={},this.pathID=e,this.name=t,this.description=n}makeSubGroup(e,t,n){if(e in this.subGroups){console.warn("Sub group already registered "+e);return}return this.subGroups[e]=new O(this.pathID+"/"+e,t,n)}addSetting(e,t,n,r,u){if(e in this.settings)throw new Error("Settings already registered "+e);let i=localStorage[this.pathID+"/"+e],o=this.settings[e]=new k(async()=>{if(i)try{return m(JSON.parse(i))}catch{}let c;return t instanceof Promise?c=await t:typeof t=="function"?c=await t():c=t,localStorage[this.pathID+"/"+e]=JSON.stringify(c),m(c)},n,r,u);return o.subscribe(c=>{localStorage[this.pathID+"/"+e]=JSON.stringify(c.unwrap)}),o}}const B="@chocolatelibui/settings";let S=G(B,"Test Settings","Description of test settings");(async()=>{let s=new k(new Promise(o=>setTimeout(o,500,1)));s.write(2),console.log(await s);let e=S.addSetting("TestBool",!1,!0),t=document.createElement("input");t.type="checkbox",document.body.appendChild(t),t.checked=(await e).unwrap,t.addEventListener("change",o=>{e.write(t.checked)});let n=S.addSetting("TestNumber",99,!0),r=document.createElement("input");r.type="number",document.body.appendChild(r),r.value=String((await n).unwrap),r.addEventListener("change",async o=>{n.write(Number(r.value)),r.value=String((await n).unwrap)});let u=S.addSetting("TestString",new Promise(o=>{setTimeout(()=>{o("yo")},5e3)}),!0),i=document.createElement("input");document.body.appendChild(i),i.value=(await u).unwrap,i.addEventListener("change",async o=>{u.write(i.value),i.value=(await u).unwrap})})();
