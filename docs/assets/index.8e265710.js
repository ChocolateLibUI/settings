(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const n of t)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function r(t){const n={};return t.integrity&&(n.integrity=t.integrity),t.referrerpolicy&&(n.referrerPolicy=t.referrerpolicy),t.crossorigin==="use-credentials"?n.credentials="include":t.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(t){if(t.ep)return;t.ep=!0;const n=r(t);fetch(t.href,n)}})();let u={},c=(o,e,r)=>(u[o]=new l(o,e,r),u[o]);class l{constructor(e,r,i){this.settings={},this.subGroups={},this.pathID=e,this.name=r,this.description=i}makeSubGroup(e,r,i){if(e in this.subGroups){console.warn("Sub group already registered "+e);return}else return this.subGroups[e]=new l(this.pathID+"/"+e,r,i)}async addState(e,r,i,t=void 0){if(e in this.settings)throw new Error("Settings already registered "+e);let n=localStorage[this.pathID+"/"+e];n?i(JSON.parse(n)):t!==void 0&&i(await t),r.subscribe(s=>{localStorage[this.pathID+"/"+e]=JSON.stringify(s)},!n),this.settings[e]=r}}const d="@chocolatelibui/settings";let a=c(d,"Test Settings","Description of test settings");(async()=>{let o=a.makeBooleanSetting("TestBool","","",!1),e=document.createElement("input");e.type="checkbox",document.body.appendChild(e),e.checked=await o.get,e.addEventListener("change",s=>{o.set=e.checked});let r=a.makeNumberSetting("TestNumber","","",10,2,99),i=document.createElement("input");i.type="number",i.min=String(r.min),i.max=String(r.max),document.body.appendChild(i),i.value=String(await r.get),i.addEventListener("change",async s=>{r.set=Number(i.value),i.value=String(await r.get)});let t=a.makeStringSetting("TestString","","","asdf",void 0,10),n=document.createElement("input");document.body.appendChild(n),n.value=await t.get,n.addEventListener("change",async s=>{t.set=n.value,n.value=await t.get})})();
