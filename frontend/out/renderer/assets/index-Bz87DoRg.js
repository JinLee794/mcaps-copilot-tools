import { b as CopilotKitCoreRuntimeConnectionStatus } from "./index-CVwF7dxm.js";
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2 = globalThis, e$4 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$5 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$4 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$5.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$5.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$2 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$5 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$4) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$4 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$2(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$4, defineProperty: e$3, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$1, getOwnPropertySymbols: o$4, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i4 = t2;
  switch (s2) {
    case Boolean:
      i4 = null !== t2;
      break;
    case Number:
      i4 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i4 = JSON.parse(t2);
      } catch (t3) {
        i4 = null;
      }
  }
  return i4;
} }, f$1 = (t2, s2) => !i$4(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ??= Symbol("metadata"), a$1.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ??= []).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i4 = Symbol(), h2 = this.getPropertyDescriptor(t2, i4, s2);
      void 0 !== h2 && e$3(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i4) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2?.call(this);
      r2?.call(this, s3), this.requestUpdate(t2, h2, i4);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$1(t3), ...o$4(t3)];
      for (const i4 of s2) this.createProperty(i4, t3[i4]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i4] of s2) this.elementProperties.set(t3, i4);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i4 = this._$Eu(t3, s2);
      void 0 !== i4 && this._$Eh.set(i4, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i4 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i4.unshift(c$2(s3));
    } else void 0 !== s2 && i4.push(c$2(s2));
    return i4;
  }
  static _$Eu(t2, s2) {
    const i4 = s2.attribute;
    return false === i4 ? void 0 : "string" == typeof i4 ? i4 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t2) => t2(this));
  }
  addController(t2) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t2), void 0 !== this.renderRoot && this.isConnected && t2.hostConnected?.();
  }
  removeController(t2) {
    this._$EO?.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i4 of s2.keys()) this.hasOwnProperty(i4) && (t2.set(i4, this[i4]), delete this[i4]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(true), this._$EO?.forEach((t2) => t2.hostConnected?.());
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t2) => t2.hostDisconnected?.());
  }
  attributeChangedCallback(t2, s2, i4) {
    this._$AK(t2, i4);
  }
  _$ET(t2, s2) {
    const i4 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i4);
    if (void 0 !== e2 && true === i4.reflect) {
      const h2 = (void 0 !== i4.converter?.toAttribute ? i4.converter : u$1).toAttribute(s2, i4.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    const i4 = this.constructor, e2 = i4._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i4.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== t3.converter?.fromAttribute ? t3.converter : u$1;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = r2 ?? this._$Ej?.get(e2) ?? r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i4, e2 = false, h2) {
    if (void 0 !== t2) {
      const r2 = this.constructor;
      if (false === e2 && (h2 = this[t2]), i4 ??= r2.getPropertyOptions(t2), !((i4.hasChanged ?? f$1)(h2, s2) || i4.useDefault && i4.reflect && h2 === this._$Ej?.get(t2) && !this.hasAttribute(r2._$Eu(t2, i4)))) return;
      this.C(t2, s2, i4);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i4, reflect: e2, wrapped: h2 }, r2) {
    i4 && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i4 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i4] of t3) {
        const { wrapped: t4 } = i4, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i4, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), this._$EO?.forEach((t3) => t3.hostUpdate?.()), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    this._$EO?.forEach((t3) => t3.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq &&= this._$Eq.forEach((t3) => this._$ET(t3, this[t3])), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1?.({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$3 = (t2) => t2, s$1 = t$1.trustedTypes, e$2 = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, h = "$lit$", o$3 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$1 = "?" + o$3, r = `<${n$1}>`, l = document, c = () => l.createComment(""), a = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u = Array.isArray, d = (t2) => u(t2) || "function" == typeof t2?.[Symbol.iterator], f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y2 = /^(?:script|style|textarea|title)$/i, x = (t2) => (i4, ...s2) => ({ _$litType$: t2, strings: i4, values: s2 }), b = x(1), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l.createTreeWalker(l, 129);
function V(t2, i4) {
  if (!u(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e$2 ? e$2.createHTML(i4) : i4;
}
const N = (t2, i4) => {
  const s2 = t2.length - 1, e2 = [];
  let n3, l2 = 2 === i4 ? "<svg>" : 3 === i4 ? "<math>" : "", c2 = v;
  for (let i5 = 0; i5 < s2; i5++) {
    const s3 = t2[i5];
    let a2, u2, d2 = -1, f2 = 0;
    for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m : void 0 !== u2[2] ? (y2.test(u2[2]) && (n3 = RegExp("</" + u2[2], "g")), c2 = p) : void 0 !== u2[3] && (c2 = p) : c2 === p ? ">" === u2[0] ? (c2 = n3 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p : '"' === u2[3] ? $ : g) : c2 === $ || c2 === g ? c2 = p : c2 === _ || c2 === m ? c2 = v : (c2 = p, n3 = void 0);
    const x2 = c2 === p && t2[i5 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === v ? s3 + r : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h + s3.slice(d2) + o$3 + x2) : s3 + o$3 + (-2 === d2 ? i5 : x2);
  }
  return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i4 ? "</svg>" : 3 === i4 ? "</math>" : "")), e2];
};
class S {
  constructor({ strings: t2, _$litType$: i4 }, e2) {
    let r2;
    this.parts = [];
    let l2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N(t2, i4);
    if (this.el = S.createElement(f2, e2), P.currentNode = this.el.content, 2 === i4 || 3 === i4) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = P.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h)) {
          const i5 = v2[a2++], s2 = r2.getAttribute(t3).split(o$3), e3 = /([.?@])?(.*)/.exec(i5);
          d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z : H }), r2.removeAttribute(t3);
        } else t3.startsWith(o$3) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
        if (y2.test(r2.tagName)) {
          const t3 = r2.textContent.split(o$3), i5 = t3.length - 1;
          if (i5 > 0) {
            r2.textContent = s$1 ? s$1.emptyScript : "";
            for (let s2 = 0; s2 < i5; s2++) r2.append(t3[s2], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
            r2.append(t3[i5], c());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === n$1) d2.push({ type: 2, index: l2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(o$3, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o$3.length - 1;
      }
      l2++;
    }
  }
  static createElement(t2, i4) {
    const s2 = l.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function M(t2, i4, s2 = t2, e2) {
  if (i4 === E) return i4;
  let h2 = void 0 !== e2 ? s2._$Co?.[e2] : s2._$Cl;
  const o2 = a(i4) ? void 0 : i4._$litDirective$;
  return h2?.constructor !== o2 && (h2?._$AO?.(false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ??= [])[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i4 = M(t2, h2._$AS(t2, i4.values), h2, e2)), i4;
}
class R {
  constructor(t2, i4) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i4;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i4 }, parts: s2 } = this._$AD, e2 = (t2?.creationScope ?? l).importNode(i4, true);
    P.currentNode = e2;
    let h2 = P.nextNode(), o2 = 0, n3 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i5;
        2 === r2.type ? i5 = new k(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i5 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i5 = new Z(h2, this, t2)), this._$AV.push(i5), r2 = s2[++n3];
      }
      o2 !== r2?.index && (h2 = P.nextNode(), o2++);
    }
    return P.currentNode = l, e2;
  }
  p(t2) {
    let i4 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i4), i4 += s2.strings.length - 2) : s2._$AI(t2[i4])), i4++;
  }
}
class k {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t2, i4, s2, e2) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i4, this._$AM = s2, this.options = e2, this._$Cv = e2?.isConnected ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i4 = this._$AM;
    return void 0 !== i4 && 11 === t2?.nodeType && (t2 = i4.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i4 = this) {
    t2 = M(this, t2, i4), a(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    const { values: i4, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S.createElement(V(s2.h, s2.h[0]), this.options)), s2);
    if (this._$AH?._$AD === e2) this._$AH.p(i4);
    else {
      const t3 = new R(e2, this), s3 = t3.u(this.options);
      t3.p(i4), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i4 = C.get(t2.strings);
    return void 0 === i4 && C.set(t2.strings, i4 = new S(t2)), i4;
  }
  k(t2) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i4 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i4.length ? i4.push(s2 = new k(this.O(c()), this.O(c()), this, this.options)) : s2 = i4[e2], s2._$AI(h2), e2++;
    e2 < i4.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i4.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, s2) {
    for (this._$AP?.(false, true, s2); t2 !== this._$AB; ) {
      const s3 = i$3(t2).nextSibling;
      i$3(t2).remove(), t2 = s3;
    }
  }
  setConnected(t2) {
    void 0 === this._$AM && (this._$Cv = t2, this._$AP?.(t2));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i4, s2, e2, h2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i4, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  _$AI(t2, i4 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = M(this, t2, i4, 0), o2 = !a(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = M(this, e3[s2 + n3], i4, n3), r2 === E && (r2 = this._$AH[n3]), o2 ||= !a(r2) || r2 !== this._$AH[n3], r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class I extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === A ? void 0 : t2;
  }
}
class L extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
  }
}
class z extends H {
  constructor(t2, i4, s2, e2, h2) {
    super(t2, i4, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i4 = this) {
    if ((t2 = M(this, t2, i4, 0) ?? A) === E) return;
    const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class Z {
  constructor(t2, i4, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i4, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    M(this, t2);
  }
}
const B = t$1.litHtmlPolyfillSupport;
B?.(S, k), (t$1.litHtmlVersions ??= []).push("3.3.2");
const D = (t2, i4, s2) => {
  const e2 = s2?.renderBefore ?? i4;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = s2?.renderBefore ?? null;
    e2._$litPart$ = h2 = new k(i4.insertBefore(c(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
let i$2 = class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t2 = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t2.firstChild, t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = D(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return E;
  }
};
i$2._$litElement$ = true, i$2["finalized"] = true, s.litElementHydrateSupport?.({ LitElement: i$2 });
const o$2 = s.litElementPolyfillSupport;
o$2?.({ LitElement: i$2 });
(s.litElementVersions ??= []).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = { ATTRIBUTE: 1, CHILD: 2 }, e$1 = (t2) => (...e2) => ({ _$litDirective$: t2, values: e2 });
let i$1 = class i2 {
  constructor(t2) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t2, e2, i4) {
    this._$Ct = t2, this._$AM = e2, this._$Ci = i4;
  }
  _$AS(t2, e2) {
    return this.update(t2, e2);
  }
  update(t2, e2) {
    return this.render(...e2);
  }
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const n2 = "important", i3 = " !" + n2, o$1 = e$1(class extends i$1 {
  constructor(t$12) {
    if (super(t$12), t$12.type !== t.ATTRIBUTE || "style" !== t$12.name || t$12.strings?.length > 2) throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t2) {
    return Object.keys(t2).reduce((e2, r2) => {
      const s2 = t2[r2];
      return null == s2 ? e2 : e2 + `${r2 = r2.includes("-") ? r2 : r2.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s2};`;
    }, "");
  }
  update(e2, [r2]) {
    const { style: s2 } = e2.element;
    if (void 0 === this.ft) return this.ft = new Set(Object.keys(r2)), this.render(r2);
    for (const t2 of this.ft) null == r2[t2] && (this.ft.delete(t2), t2.includes("-") ? s2.removeProperty(t2) : s2[t2] = null);
    for (const t2 in r2) {
      const e3 = r2[t2];
      if (null != e3) {
        this.ft.add(t2);
        const r3 = "string" == typeof e3 && e3.endsWith(i3);
        t2.includes("-") || r3 ? s2.setProperty(t2, r3 ? e3.slice(0, -11) : e3, r3 ? n2 : "") : s2[t2] = e3;
      }
    }
    return E;
  }
});
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class e extends i$1 {
  constructor(i4) {
    if (super(i4), this.it = A, i4.type !== t.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r2) {
    if (r2 === A || null == r2) return this._t = void 0, this.it = r2;
    if (r2 === E) return r2;
    if ("string" != typeof r2) throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r2 === this.it) return this._t;
    this.it = r2;
    const s2 = [r2];
    return s2.raw = s2, this._t = { _$litType$: this.constructor.resultType, strings: s2, values: [] };
  }
}
e.directiveName = "unsafeHTML", e.resultType = 1;
const o = e$1(e);
function _getDefaults() {
  return {
    async: false,
    breaks: false,
    extensions: null,
    gfm: true,
    hooks: null,
    pedantic: false,
    renderer: null,
    silent: false,
    tokenizer: null,
    walkTokens: null
  };
}
let _defaults = _getDefaults();
function changeDefaults(newDefaults) {
  _defaults = newDefaults;
}
const escapeTest = /[&<>"']/;
const escapeReplace = new RegExp(escapeTest.source, "g");
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g");
const escapeReplacements = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
const getEscapeReplacement = (ch) => escapeReplacements[ch];
function escape$1(html2, encode) {
  if (encode) {
    if (escapeTest.test(html2)) {
      return html2.replace(escapeReplace, getEscapeReplacement);
    }
  } else {
    if (escapeTestNoEncode.test(html2)) {
      return html2.replace(escapeReplaceNoEncode, getEscapeReplacement);
    }
  }
  return html2;
}
const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
function unescape(html2) {
  return html2.replace(unescapeTest, (_2, n3) => {
    n3 = n3.toLowerCase();
    if (n3 === "colon")
      return ":";
    if (n3.charAt(0) === "#") {
      return n3.charAt(1) === "x" ? String.fromCharCode(parseInt(n3.substring(2), 16)) : String.fromCharCode(+n3.substring(1));
    }
    return "";
  });
}
const caret = /(^|[^\[])\^/g;
function edit(regex, opt) {
  let source = typeof regex === "string" ? regex : regex.source;
  opt = opt || "";
  const obj = {
    replace: (name, val) => {
      let valSource = typeof val === "string" ? val : val.source;
      valSource = valSource.replace(caret, "$1");
      source = source.replace(name, valSource);
      return obj;
    },
    getRegex: () => {
      return new RegExp(source, opt);
    }
  };
  return obj;
}
function cleanUrl(href) {
  try {
    href = encodeURI(href).replace(/%25/g, "%");
  } catch (e2) {
    return null;
  }
  return href;
}
const noopTest = { exec: () => null };
function splitCells(tableRow, count) {
  const row = tableRow.replace(/\|/g, (match, offset, str) => {
    let escaped = false;
    let curr = offset;
    while (--curr >= 0 && str[curr] === "\\")
      escaped = !escaped;
    if (escaped) {
      return "|";
    } else {
      return " |";
    }
  }), cells = row.split(/ \|/);
  let i4 = 0;
  if (!cells[0].trim()) {
    cells.shift();
  }
  if (cells.length > 0 && !cells[cells.length - 1].trim()) {
    cells.pop();
  }
  if (count) {
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count)
        cells.push("");
    }
  }
  for (; i4 < cells.length; i4++) {
    cells[i4] = cells[i4].trim().replace(/\\\|/g, "|");
  }
  return cells;
}
function rtrim(str, c2, invert) {
  const l2 = str.length;
  if (l2 === 0) {
    return "";
  }
  let suffLen = 0;
  while (suffLen < l2) {
    const currChar = str.charAt(l2 - suffLen - 1);
    if (currChar === c2 && true) {
      suffLen++;
    } else {
      break;
    }
  }
  return str.slice(0, l2 - suffLen);
}
function findClosingBracket(str, b2) {
  if (str.indexOf(b2[1]) === -1) {
    return -1;
  }
  let level = 0;
  for (let i4 = 0; i4 < str.length; i4++) {
    if (str[i4] === "\\") {
      i4++;
    } else if (str[i4] === b2[0]) {
      level++;
    } else if (str[i4] === b2[1]) {
      level--;
      if (level < 0) {
        return i4;
      }
    }
  }
  return -1;
}
function outputLink(cap, link2, raw, lexer) {
  const href = link2.href;
  const title = link2.title ? escape$1(link2.title) : null;
  const text = cap[1].replace(/\\([\[\]])/g, "$1");
  if (cap[0].charAt(0) !== "!") {
    lexer.state.inLink = true;
    const token = {
      type: "link",
      raw,
      href,
      title,
      text,
      tokens: lexer.inlineTokens(text)
    };
    lexer.state.inLink = false;
    return token;
  }
  return {
    type: "image",
    raw,
    href,
    title,
    text: escape$1(text)
  };
}
function indentCodeCompensation(raw, text) {
  const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
  if (matchIndentToCode === null) {
    return text;
  }
  const indentToCode = matchIndentToCode[1];
  return text.split("\n").map((node) => {
    const matchIndentInNode = node.match(/^\s+/);
    if (matchIndentInNode === null) {
      return node;
    }
    const [indentInNode] = matchIndentInNode;
    if (indentInNode.length >= indentToCode.length) {
      return node.slice(indentToCode.length);
    }
    return node;
  }).join("\n");
}
class _Tokenizer {
  options;
  rules;
  // set by the lexer
  lexer;
  // set by the lexer
  constructor(options) {
    this.options = options || _defaults;
  }
  space(src) {
    const cap = this.rules.block.newline.exec(src);
    if (cap && cap[0].length > 0) {
      return {
        type: "space",
        raw: cap[0]
      };
    }
  }
  code(src) {
    const cap = this.rules.block.code.exec(src);
    if (cap) {
      const text = cap[0].replace(/^ {1,4}/gm, "");
      return {
        type: "code",
        raw: cap[0],
        codeBlockStyle: "indented",
        text: !this.options.pedantic ? rtrim(text, "\n") : text
      };
    }
  }
  fences(src) {
    const cap = this.rules.block.fences.exec(src);
    if (cap) {
      const raw = cap[0];
      const text = indentCodeCompensation(raw, cap[3] || "");
      return {
        type: "code",
        raw,
        lang: cap[2] ? cap[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : cap[2],
        text
      };
    }
  }
  heading(src) {
    const cap = this.rules.block.heading.exec(src);
    if (cap) {
      let text = cap[2].trim();
      if (/#$/.test(text)) {
        const trimmed = rtrim(text, "#");
        if (this.options.pedantic) {
          text = trimmed.trim();
        } else if (!trimmed || / $/.test(trimmed)) {
          text = trimmed.trim();
        }
      }
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[1].length,
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  hr(src) {
    const cap = this.rules.block.hr.exec(src);
    if (cap) {
      return {
        type: "hr",
        raw: cap[0]
      };
    }
  }
  blockquote(src) {
    const cap = this.rules.block.blockquote.exec(src);
    if (cap) {
      let text = cap[0].replace(/\n {0,3}((?:=+|-+) *)(?=\n|$)/g, "\n    $1");
      text = rtrim(text.replace(/^ *>[ \t]?/gm, ""), "\n");
      const top = this.lexer.state.top;
      this.lexer.state.top = true;
      const tokens = this.lexer.blockTokens(text);
      this.lexer.state.top = top;
      return {
        type: "blockquote",
        raw: cap[0],
        tokens,
        text
      };
    }
  }
  list(src) {
    let cap = this.rules.block.list.exec(src);
    if (cap) {
      let bull = cap[1].trim();
      const isordered = bull.length > 1;
      const list2 = {
        type: "list",
        raw: "",
        ordered: isordered,
        start: isordered ? +bull.slice(0, -1) : "",
        loose: false,
        items: []
      };
      bull = isordered ? `\\d{1,9}\\${bull.slice(-1)}` : `\\${bull}`;
      if (this.options.pedantic) {
        bull = isordered ? bull : "[*+-]";
      }
      const itemRegex = new RegExp(`^( {0,3}${bull})((?:[	 ][^\\n]*)?(?:\\n|$))`);
      let raw = "";
      let itemContents = "";
      let endsWithBlankLine = false;
      while (src) {
        let endEarly = false;
        if (!(cap = itemRegex.exec(src))) {
          break;
        }
        if (this.rules.block.hr.test(src)) {
          break;
        }
        raw = cap[0];
        src = src.substring(raw.length);
        let line = cap[2].split("\n", 1)[0].replace(/^\t+/, (t2) => " ".repeat(3 * t2.length));
        let nextLine = src.split("\n", 1)[0];
        let indent = 0;
        if (this.options.pedantic) {
          indent = 2;
          itemContents = line.trimStart();
        } else {
          indent = cap[2].search(/[^ ]/);
          indent = indent > 4 ? 1 : indent;
          itemContents = line.slice(indent);
          indent += cap[1].length;
        }
        let blankLine = false;
        if (!line && /^ *$/.test(nextLine)) {
          raw += nextLine + "\n";
          src = src.substring(nextLine.length + 1);
          endEarly = true;
        }
        if (!endEarly) {
          const nextBulletRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`);
          const hrRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`);
          const fencesBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}(?:\`\`\`|~~~)`);
          const headingBeginRegex = new RegExp(`^ {0,${Math.min(3, indent - 1)}}#`);
          while (src) {
            const rawLine = src.split("\n", 1)[0];
            nextLine = rawLine;
            if (this.options.pedantic) {
              nextLine = nextLine.replace(/^ {1,4}(?=( {4})*[^ ])/g, "  ");
            }
            if (fencesBeginRegex.test(nextLine)) {
              break;
            }
            if (headingBeginRegex.test(nextLine)) {
              break;
            }
            if (nextBulletRegex.test(nextLine)) {
              break;
            }
            if (hrRegex.test(src)) {
              break;
            }
            if (nextLine.search(/[^ ]/) >= indent || !nextLine.trim()) {
              itemContents += "\n" + nextLine.slice(indent);
            } else {
              if (blankLine) {
                break;
              }
              if (line.search(/[^ ]/) >= 4) {
                break;
              }
              if (fencesBeginRegex.test(line)) {
                break;
              }
              if (headingBeginRegex.test(line)) {
                break;
              }
              if (hrRegex.test(line)) {
                break;
              }
              itemContents += "\n" + nextLine;
            }
            if (!blankLine && !nextLine.trim()) {
              blankLine = true;
            }
            raw += rawLine + "\n";
            src = src.substring(rawLine.length + 1);
            line = nextLine.slice(indent);
          }
        }
        if (!list2.loose) {
          if (endsWithBlankLine) {
            list2.loose = true;
          } else if (/\n *\n *$/.test(raw)) {
            endsWithBlankLine = true;
          }
        }
        let istask = null;
        let ischecked;
        if (this.options.gfm) {
          istask = /^\[[ xX]\] /.exec(itemContents);
          if (istask) {
            ischecked = istask[0] !== "[ ] ";
            itemContents = itemContents.replace(/^\[[ xX]\] +/, "");
          }
        }
        list2.items.push({
          type: "list_item",
          raw,
          task: !!istask,
          checked: ischecked,
          loose: false,
          text: itemContents,
          tokens: []
        });
        list2.raw += raw;
      }
      list2.items[list2.items.length - 1].raw = raw.trimEnd();
      list2.items[list2.items.length - 1].text = itemContents.trimEnd();
      list2.raw = list2.raw.trimEnd();
      for (let i4 = 0; i4 < list2.items.length; i4++) {
        this.lexer.state.top = false;
        list2.items[i4].tokens = this.lexer.blockTokens(list2.items[i4].text, []);
        if (!list2.loose) {
          const spacers = list2.items[i4].tokens.filter((t2) => t2.type === "space");
          const hasMultipleLineBreaks = spacers.length > 0 && spacers.some((t2) => /\n.*\n/.test(t2.raw));
          list2.loose = hasMultipleLineBreaks;
        }
      }
      if (list2.loose) {
        for (let i4 = 0; i4 < list2.items.length; i4++) {
          list2.items[i4].loose = true;
        }
      }
      return list2;
    }
  }
  html(src) {
    const cap = this.rules.block.html.exec(src);
    if (cap) {
      const token = {
        type: "html",
        block: true,
        raw: cap[0],
        pre: cap[1] === "pre" || cap[1] === "script" || cap[1] === "style",
        text: cap[0]
      };
      return token;
    }
  }
  def(src) {
    const cap = this.rules.block.def.exec(src);
    if (cap) {
      const tag2 = cap[1].toLowerCase().replace(/\s+/g, " ");
      const href = cap[2] ? cap[2].replace(/^<(.*)>$/, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "";
      const title = cap[3] ? cap[3].substring(1, cap[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : cap[3];
      return {
        type: "def",
        tag: tag2,
        raw: cap[0],
        href,
        title
      };
    }
  }
  table(src) {
    const cap = this.rules.block.table.exec(src);
    if (!cap) {
      return;
    }
    if (!/[:|]/.test(cap[2])) {
      return;
    }
    const headers = splitCells(cap[1]);
    const aligns = cap[2].replace(/^\||\| *$/g, "").split("|");
    const rows = cap[3] && cap[3].trim() ? cap[3].replace(/\n[ \t]*$/, "").split("\n") : [];
    const item = {
      type: "table",
      raw: cap[0],
      header: [],
      align: [],
      rows: []
    };
    if (headers.length !== aligns.length) {
      return;
    }
    for (const align of aligns) {
      if (/^ *-+: *$/.test(align)) {
        item.align.push("right");
      } else if (/^ *:-+: *$/.test(align)) {
        item.align.push("center");
      } else if (/^ *:-+ *$/.test(align)) {
        item.align.push("left");
      } else {
        item.align.push(null);
      }
    }
    for (const header of headers) {
      item.header.push({
        text: header,
        tokens: this.lexer.inline(header)
      });
    }
    for (const row of rows) {
      item.rows.push(splitCells(row, item.header.length).map((cell) => {
        return {
          text: cell,
          tokens: this.lexer.inline(cell)
        };
      }));
    }
    return item;
  }
  lheading(src) {
    const cap = this.rules.block.lheading.exec(src);
    if (cap) {
      return {
        type: "heading",
        raw: cap[0],
        depth: cap[2].charAt(0) === "=" ? 1 : 2,
        text: cap[1],
        tokens: this.lexer.inline(cap[1])
      };
    }
  }
  paragraph(src) {
    const cap = this.rules.block.paragraph.exec(src);
    if (cap) {
      const text = cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1];
      return {
        type: "paragraph",
        raw: cap[0],
        text,
        tokens: this.lexer.inline(text)
      };
    }
  }
  text(src) {
    const cap = this.rules.block.text.exec(src);
    if (cap) {
      return {
        type: "text",
        raw: cap[0],
        text: cap[0],
        tokens: this.lexer.inline(cap[0])
      };
    }
  }
  escape(src) {
    const cap = this.rules.inline.escape.exec(src);
    if (cap) {
      return {
        type: "escape",
        raw: cap[0],
        text: escape$1(cap[1])
      };
    }
  }
  tag(src) {
    const cap = this.rules.inline.tag.exec(src);
    if (cap) {
      if (!this.lexer.state.inLink && /^<a /i.test(cap[0])) {
        this.lexer.state.inLink = true;
      } else if (this.lexer.state.inLink && /^<\/a>/i.test(cap[0])) {
        this.lexer.state.inLink = false;
      }
      if (!this.lexer.state.inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = true;
      } else if (this.lexer.state.inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
        this.lexer.state.inRawBlock = false;
      }
      return {
        type: "html",
        raw: cap[0],
        inLink: this.lexer.state.inLink,
        inRawBlock: this.lexer.state.inRawBlock,
        block: false,
        text: cap[0]
      };
    }
  }
  link(src) {
    const cap = this.rules.inline.link.exec(src);
    if (cap) {
      const trimmedUrl = cap[2].trim();
      if (!this.options.pedantic && /^</.test(trimmedUrl)) {
        if (!/>$/.test(trimmedUrl)) {
          return;
        }
        const rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
        if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
          return;
        }
      } else {
        const lastParenIndex = findClosingBracket(cap[2], "()");
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
      }
      let href = cap[2];
      let title = "";
      if (this.options.pedantic) {
        const link2 = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
        if (link2) {
          href = link2[1];
          title = link2[3];
        }
      } else {
        title = cap[3] ? cap[3].slice(1, -1) : "";
      }
      href = href.trim();
      if (/^</.test(href)) {
        if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
          href = href.slice(1);
        } else {
          href = href.slice(1, -1);
        }
      }
      return outputLink(cap, {
        href: href ? href.replace(this.rules.inline.anyPunctuation, "$1") : href,
        title: title ? title.replace(this.rules.inline.anyPunctuation, "$1") : title
      }, cap[0], this.lexer);
    }
  }
  reflink(src, links) {
    let cap;
    if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
      const linkString = (cap[2] || cap[1]).replace(/\s+/g, " ");
      const link2 = links[linkString.toLowerCase()];
      if (!link2) {
        const text = cap[0].charAt(0);
        return {
          type: "text",
          raw: text,
          text
        };
      }
      return outputLink(cap, link2, cap[0], this.lexer);
    }
  }
  emStrong(src, maskedSrc, prevChar = "") {
    let match = this.rules.inline.emStrongLDelim.exec(src);
    if (!match)
      return;
    if (match[3] && prevChar.match(/[\p{L}\p{N}]/u))
      return;
    const nextChar = match[1] || match[2] || "";
    if (!nextChar || !prevChar || this.rules.inline.punctuation.exec(prevChar)) {
      const lLength = [...match[0]].length - 1;
      let rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
      const endReg = match[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      endReg.lastIndex = 0;
      maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
      while ((match = endReg.exec(maskedSrc)) != null) {
        rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
        if (!rDelim)
          continue;
        rLength = [...rDelim].length;
        if (match[3] || match[4]) {
          delimTotal += rLength;
          continue;
        } else if (match[5] || match[6]) {
          if (lLength % 3 && !((lLength + rLength) % 3)) {
            midDelimTotal += rLength;
            continue;
          }
        }
        delimTotal -= rLength;
        if (delimTotal > 0)
          continue;
        rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
        const lastCharLength = [...match[0]][0].length;
        const raw = src.slice(0, lLength + match.index + lastCharLength + rLength);
        if (Math.min(lLength, rLength) % 2) {
          const text2 = raw.slice(1, -1);
          return {
            type: "em",
            raw,
            text: text2,
            tokens: this.lexer.inlineTokens(text2)
          };
        }
        const text = raw.slice(2, -2);
        return {
          type: "strong",
          raw,
          text,
          tokens: this.lexer.inlineTokens(text)
        };
      }
    }
  }
  codespan(src) {
    const cap = this.rules.inline.code.exec(src);
    if (cap) {
      let text = cap[2].replace(/\n/g, " ");
      const hasNonSpaceChars = /[^ ]/.test(text);
      const hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
      if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
        text = text.substring(1, text.length - 1);
      }
      text = escape$1(text, true);
      return {
        type: "codespan",
        raw: cap[0],
        text
      };
    }
  }
  br(src) {
    const cap = this.rules.inline.br.exec(src);
    if (cap) {
      return {
        type: "br",
        raw: cap[0]
      };
    }
  }
  del(src) {
    const cap = this.rules.inline.del.exec(src);
    if (cap) {
      return {
        type: "del",
        raw: cap[0],
        text: cap[2],
        tokens: this.lexer.inlineTokens(cap[2])
      };
    }
  }
  autolink(src) {
    const cap = this.rules.inline.autolink.exec(src);
    if (cap) {
      let text, href;
      if (cap[2] === "@") {
        text = escape$1(cap[1]);
        href = "mailto:" + text;
      } else {
        text = escape$1(cap[1]);
        href = text;
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  url(src) {
    let cap;
    if (cap = this.rules.inline.url.exec(src)) {
      let text, href;
      if (cap[2] === "@") {
        text = escape$1(cap[0]);
        href = "mailto:" + text;
      } else {
        let prevCapZero;
        do {
          prevCapZero = cap[0];
          cap[0] = this.rules.inline._backpedal.exec(cap[0])?.[0] ?? "";
        } while (prevCapZero !== cap[0]);
        text = escape$1(cap[0]);
        if (cap[1] === "www.") {
          href = "http://" + cap[0];
        } else {
          href = cap[0];
        }
      }
      return {
        type: "link",
        raw: cap[0],
        text,
        href,
        tokens: [
          {
            type: "text",
            raw: text,
            text
          }
        ]
      };
    }
  }
  inlineText(src) {
    const cap = this.rules.inline.text.exec(src);
    if (cap) {
      let text;
      if (this.lexer.state.inRawBlock) {
        text = cap[0];
      } else {
        text = escape$1(cap[0]);
      }
      return {
        type: "text",
        raw: cap[0],
        text
      };
    }
  }
}
const newline = /^(?: *(?:\n|$))+/;
const blockCode = /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/;
const fences = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/;
const hr = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/;
const heading = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/;
const bullet = /(?:[*+-]|\d{1,9}[.)])/;
const lheading = edit(/^(?!bull |blockCode|fences|blockquote|heading|html)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html))+?)\n {0,3}(=+|-+) *(?:\n+|$)/).replace(/bull/g, bullet).replace(/blockCode/g, / {4}/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).getRegex();
const _paragraph = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/;
const blockText = /^[^\n]+/;
const _blockLabel = /(?!\s*\])(?:\\.|[^\[\]\\])+/;
const def = edit(/^ {0,3}\[(label)\]: *(?:\n *)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n *)?| *\n *)(title))? *(?:\n+|$)/).replace("label", _blockLabel).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex();
const list = edit(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, bullet).getRegex();
const _tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
const _comment = /<!--(?:-?>|[\s\S]*?(?:-->|$))/;
const html = edit("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))", "i").replace("comment", _comment).replace("tag", _tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
const paragraph = edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
const blockquote = edit(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", paragraph).getRegex();
const blockNormal = {
  blockquote,
  code: blockCode,
  def,
  fences,
  heading,
  hr,
  html,
  lheading,
  list,
  newline,
  paragraph,
  table: noopTest,
  text: blockText
};
const gfmTable = edit("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex();
const blockGfm = {
  ...blockNormal,
  table: gfmTable,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", gfmTable).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", _tag).getRegex()
};
const blockPedantic = {
  ...blockNormal,
  html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", _comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
  heading: /^(#{1,6})(.*)(?:\n+|$)/,
  fences: noopTest,
  // fences not supported
  lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/,
  paragraph: edit(_paragraph).replace("hr", hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", lheading).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex()
};
const escape = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/;
const inlineCode = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/;
const br = /^( {2,}|\\)\n(?!\s*$)/;
const inlineText = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/;
const _punctuation = "\\p{P}\\p{S}";
const punctuation = edit(/^((?![*_])[\spunctuation])/, "u").replace(/punctuation/g, _punctuation).getRegex();
const blockSkip = /\[[^[\]]*?\]\([^\(\)]*?\)|`[^`]*?`|<[^<>]*?>/g;
const emStrongLDelim = edit(/^(?:\*+(?:((?!\*)[punct])|[^\s*]))|^_+(?:((?!_)[punct])|([^\s_]))/, "u").replace(/punct/g, _punctuation).getRegex();
const emStrongRDelimAst = edit("^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)[punct](\\*+)(?=[\\s]|$)|[^punct\\s](\\*+)(?!\\*)(?=[punct\\s]|$)|(?!\\*)[punct\\s](\\*+)(?=[^punct\\s])|[\\s](\\*+)(?!\\*)(?=[punct])|(?!\\*)[punct](\\*+)(?!\\*)(?=[punct])|[^punct\\s](\\*+)(?=[^punct\\s])", "gu").replace(/punct/g, _punctuation).getRegex();
const emStrongRDelimUnd = edit("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)[punct](_+)(?=[\\s]|$)|[^punct\\s](_+)(?!_)(?=[punct\\s]|$)|(?!_)[punct\\s](_+)(?=[^punct\\s])|[\\s](_+)(?!_)(?=[punct])|(?!_)[punct](_+)(?!_)(?=[punct])", "gu").replace(/punct/g, _punctuation).getRegex();
const anyPunctuation = edit(/\\([punct])/, "gu").replace(/punct/g, _punctuation).getRegex();
const autolink = edit(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex();
const _inlineComment = edit(_comment).replace("(?:-->|$)", "-->").getRegex();
const tag = edit("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", _inlineComment).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex();
const _inlineLabel = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
const link = edit(/^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/).replace("label", _inlineLabel).replace("href", /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex();
const reflink = edit(/^!?\[(label)\]\[(ref)\]/).replace("label", _inlineLabel).replace("ref", _blockLabel).getRegex();
const nolink = edit(/^!?\[(ref)\](?:\[\])?/).replace("ref", _blockLabel).getRegex();
const reflinkSearch = edit("reflink|nolink(?!\\()", "g").replace("reflink", reflink).replace("nolink", nolink).getRegex();
const inlineNormal = {
  _backpedal: noopTest,
  // only used for GFM url
  anyPunctuation,
  autolink,
  blockSkip,
  br,
  code: inlineCode,
  del: noopTest,
  emStrongLDelim,
  emStrongRDelimAst,
  emStrongRDelimUnd,
  escape,
  link,
  nolink,
  punctuation,
  reflink,
  reflinkSearch,
  tag,
  text: inlineText,
  url: noopTest
};
const inlinePedantic = {
  ...inlineNormal,
  link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", _inlineLabel).getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", _inlineLabel).getRegex()
};
const inlineGfm = {
  ...inlineNormal,
  escape: edit(escape).replace("])", "~|])").getRegex(),
  url: edit(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(),
  _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
};
const inlineBreaks = {
  ...inlineGfm,
  br: edit(br).replace("{2,}", "*").getRegex(),
  text: edit(inlineGfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
};
const block = {
  normal: blockNormal,
  gfm: blockGfm,
  pedantic: blockPedantic
};
const inline = {
  normal: inlineNormal,
  gfm: inlineGfm,
  breaks: inlineBreaks,
  pedantic: inlinePedantic
};
class _Lexer {
  tokens;
  options;
  state;
  tokenizer;
  inlineQueue;
  constructor(options) {
    this.tokens = [];
    this.tokens.links = /* @__PURE__ */ Object.create(null);
    this.options = options || _defaults;
    this.options.tokenizer = this.options.tokenizer || new _Tokenizer();
    this.tokenizer = this.options.tokenizer;
    this.tokenizer.options = this.options;
    this.tokenizer.lexer = this;
    this.inlineQueue = [];
    this.state = {
      inLink: false,
      inRawBlock: false,
      top: true
    };
    const rules = {
      block: block.normal,
      inline: inline.normal
    };
    if (this.options.pedantic) {
      rules.block = block.pedantic;
      rules.inline = inline.pedantic;
    } else if (this.options.gfm) {
      rules.block = block.gfm;
      if (this.options.breaks) {
        rules.inline = inline.breaks;
      } else {
        rules.inline = inline.gfm;
      }
    }
    this.tokenizer.rules = rules;
  }
  /**
   * Expose Rules
   */
  static get rules() {
    return {
      block,
      inline
    };
  }
  /**
   * Static Lex Method
   */
  static lex(src, options) {
    const lexer = new _Lexer(options);
    return lexer.lex(src);
  }
  /**
   * Static Lex Inline Method
   */
  static lexInline(src, options) {
    const lexer = new _Lexer(options);
    return lexer.inlineTokens(src);
  }
  /**
   * Preprocessing
   */
  lex(src) {
    src = src.replace(/\r\n|\r/g, "\n");
    this.blockTokens(src, this.tokens);
    for (let i4 = 0; i4 < this.inlineQueue.length; i4++) {
      const next = this.inlineQueue[i4];
      this.inlineTokens(next.src, next.tokens);
    }
    this.inlineQueue = [];
    return this.tokens;
  }
  blockTokens(src, tokens = []) {
    if (this.options.pedantic) {
      src = src.replace(/\t/g, "    ").replace(/^ +$/gm, "");
    } else {
      src = src.replace(/^( *)(\t+)/gm, (_2, leading, tabs) => {
        return leading + "    ".repeat(tabs.length);
      });
    }
    let token;
    let lastToken;
    let cutSrc;
    let lastParagraphClipped;
    while (src) {
      if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.space(src)) {
        src = src.substring(token.raw.length);
        if (token.raw.length === 1 && tokens.length > 0) {
          tokens[tokens.length - 1].raw += "\n";
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.code(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.fences(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.heading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.hr(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.blockquote(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.list(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.html(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.def(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && (lastToken.type === "paragraph" || lastToken.type === "text")) {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.raw;
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else if (!this.tokens.links[token.tag]) {
          this.tokens.links[token.tag] = {
            href: token.href,
            title: token.title
          };
        }
        continue;
      }
      if (token = this.tokenizer.table(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.lheading(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startBlock) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startBlock.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (this.state.top && (token = this.tokenizer.paragraph(cutSrc))) {
        lastToken = tokens[tokens.length - 1];
        if (lastParagraphClipped && lastToken.type === "paragraph") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        lastParagraphClipped = cutSrc.length !== src.length;
        src = src.substring(token.raw.length);
        continue;
      }
      if (token = this.tokenizer.text(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += "\n" + token.raw;
          lastToken.text += "\n" + token.text;
          this.inlineQueue.pop();
          this.inlineQueue[this.inlineQueue.length - 1].src = lastToken.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    this.state.top = true;
    return tokens;
  }
  inline(src, tokens = []) {
    this.inlineQueue.push({ src, tokens });
    return tokens;
  }
  /**
   * Lexing/Compiling
   */
  inlineTokens(src, tokens = []) {
    let token, lastToken, cutSrc;
    let maskedSrc = src;
    let match;
    let keepPrevChar, prevChar;
    if (this.tokens.links) {
      const links = Object.keys(this.tokens.links);
      if (links.length > 0) {
        while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
          if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
            maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
          }
        }
      }
    }
    while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "[" + "a".repeat(match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    }
    while ((match = this.tokenizer.rules.inline.anyPunctuation.exec(maskedSrc)) != null) {
      maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    }
    while (src) {
      if (!keepPrevChar) {
        prevChar = "";
      }
      keepPrevChar = false;
      if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some((extTokenizer) => {
        if (token = extTokenizer.call({ lexer: this }, src, tokens)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          return true;
        }
        return false;
      })) {
        continue;
      }
      if (token = this.tokenizer.escape(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.tag(src)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.link(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.reflink(src, this.tokens.links)) {
        src = src.substring(token.raw.length);
        lastToken = tokens[tokens.length - 1];
        if (lastToken && token.type === "text" && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.codespan(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.br(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.del(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (token = this.tokenizer.autolink(src)) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      if (!this.state.inLink && (token = this.tokenizer.url(src))) {
        src = src.substring(token.raw.length);
        tokens.push(token);
        continue;
      }
      cutSrc = src;
      if (this.options.extensions && this.options.extensions.startInline) {
        let startIndex = Infinity;
        const tempSrc = src.slice(1);
        let tempStart;
        this.options.extensions.startInline.forEach((getStartIndex) => {
          tempStart = getStartIndex.call({ lexer: this }, tempSrc);
          if (typeof tempStart === "number" && tempStart >= 0) {
            startIndex = Math.min(startIndex, tempStart);
          }
        });
        if (startIndex < Infinity && startIndex >= 0) {
          cutSrc = src.substring(0, startIndex + 1);
        }
      }
      if (token = this.tokenizer.inlineText(cutSrc)) {
        src = src.substring(token.raw.length);
        if (token.raw.slice(-1) !== "_") {
          prevChar = token.raw.slice(-1);
        }
        keepPrevChar = true;
        lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          lastToken.raw += token.raw;
          lastToken.text += token.text;
        } else {
          tokens.push(token);
        }
        continue;
      }
      if (src) {
        const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
        if (this.options.silent) {
          console.error(errMsg);
          break;
        } else {
          throw new Error(errMsg);
        }
      }
    }
    return tokens;
  }
}
class _Renderer {
  options;
  constructor(options) {
    this.options = options || _defaults;
  }
  code(code, infostring, escaped) {
    const lang = (infostring || "").match(/^\S*/)?.[0];
    code = code.replace(/\n$/, "") + "\n";
    if (!lang) {
      return "<pre><code>" + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
    }
    return '<pre><code class="language-' + escape$1(lang) + '">' + (escaped ? code : escape$1(code, true)) + "</code></pre>\n";
  }
  blockquote(quote) {
    return `<blockquote>
${quote}</blockquote>
`;
  }
  html(html2, block2) {
    return html2;
  }
  heading(text, level, raw) {
    return `<h${level}>${text}</h${level}>
`;
  }
  hr() {
    return "<hr>\n";
  }
  list(body, ordered, start) {
    const type = ordered ? "ol" : "ul";
    const startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
    return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
  }
  listitem(text, task, checked) {
    return `<li>${text}</li>
`;
  }
  checkbox(checked) {
    return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
  }
  paragraph(text) {
    return `<p>${text}</p>
`;
  }
  table(header, body) {
    if (body)
      body = `<tbody>${body}</tbody>`;
    return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
  }
  tablerow(content) {
    return `<tr>
${content}</tr>
`;
  }
  tablecell(content, flags) {
    const type = flags.header ? "th" : "td";
    const tag2 = flags.align ? `<${type} align="${flags.align}">` : `<${type}>`;
    return tag2 + content + `</${type}>
`;
  }
  /**
   * span level renderer
   */
  strong(text) {
    return `<strong>${text}</strong>`;
  }
  em(text) {
    return `<em>${text}</em>`;
  }
  codespan(text) {
    return `<code>${text}</code>`;
  }
  br() {
    return "<br>";
  }
  del(text) {
    return `<del>${text}</del>`;
  }
  link(href, title, text) {
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;
    let out = '<a href="' + href + '"';
    if (title) {
      out += ' title="' + title + '"';
    }
    out += ">" + text + "</a>";
    return out;
  }
  image(href, title, text) {
    const cleanHref = cleanUrl(href);
    if (cleanHref === null) {
      return text;
    }
    href = cleanHref;
    let out = `<img src="${href}" alt="${text}"`;
    if (title) {
      out += ` title="${title}"`;
    }
    out += ">";
    return out;
  }
  text(text) {
    return text;
  }
}
class _TextRenderer {
  // no need for block level renderers
  strong(text) {
    return text;
  }
  em(text) {
    return text;
  }
  codespan(text) {
    return text;
  }
  del(text) {
    return text;
  }
  html(text) {
    return text;
  }
  text(text) {
    return text;
  }
  link(href, title, text) {
    return "" + text;
  }
  image(href, title, text) {
    return "" + text;
  }
  br() {
    return "";
  }
}
class _Parser {
  options;
  renderer;
  textRenderer;
  constructor(options) {
    this.options = options || _defaults;
    this.options.renderer = this.options.renderer || new _Renderer();
    this.renderer = this.options.renderer;
    this.renderer.options = this.options;
    this.textRenderer = new _TextRenderer();
  }
  /**
   * Static Parse Method
   */
  static parse(tokens, options) {
    const parser = new _Parser(options);
    return parser.parse(tokens);
  }
  /**
   * Static Parse Inline Method
   */
  static parseInline(tokens, options) {
    const parser = new _Parser(options);
    return parser.parseInline(tokens);
  }
  /**
   * Parse Loop
   */
  parse(tokens, top = true) {
    let out = "";
    for (let i4 = 0; i4 < tokens.length; i4++) {
      const token = tokens[i4];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        const genericToken = token;
        const ret = this.options.extensions.renderers[genericToken.type].call({ parser: this }, genericToken);
        if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(genericToken.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "space": {
          continue;
        }
        case "hr": {
          out += this.renderer.hr();
          continue;
        }
        case "heading": {
          const headingToken = token;
          out += this.renderer.heading(this.parseInline(headingToken.tokens), headingToken.depth, unescape(this.parseInline(headingToken.tokens, this.textRenderer)));
          continue;
        }
        case "code": {
          const codeToken = token;
          out += this.renderer.code(codeToken.text, codeToken.lang, !!codeToken.escaped);
          continue;
        }
        case "table": {
          const tableToken = token;
          let header = "";
          let cell = "";
          for (let j = 0; j < tableToken.header.length; j++) {
            cell += this.renderer.tablecell(this.parseInline(tableToken.header[j].tokens), { header: true, align: tableToken.align[j] });
          }
          header += this.renderer.tablerow(cell);
          let body = "";
          for (let j = 0; j < tableToken.rows.length; j++) {
            const row = tableToken.rows[j];
            cell = "";
            for (let k2 = 0; k2 < row.length; k2++) {
              cell += this.renderer.tablecell(this.parseInline(row[k2].tokens), { header: false, align: tableToken.align[k2] });
            }
            body += this.renderer.tablerow(cell);
          }
          out += this.renderer.table(header, body);
          continue;
        }
        case "blockquote": {
          const blockquoteToken = token;
          const body = this.parse(blockquoteToken.tokens);
          out += this.renderer.blockquote(body);
          continue;
        }
        case "list": {
          const listToken = token;
          const ordered = listToken.ordered;
          const start = listToken.start;
          const loose = listToken.loose;
          let body = "";
          for (let j = 0; j < listToken.items.length; j++) {
            const item = listToken.items[j];
            const checked = item.checked;
            const task = item.task;
            let itemBody = "";
            if (item.task) {
              const checkbox = this.renderer.checkbox(!!checked);
              if (loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                  item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                  if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                    item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                  }
                } else {
                  item.tokens.unshift({
                    type: "text",
                    text: checkbox + " "
                  });
                }
              } else {
                itemBody += checkbox + " ";
              }
            }
            itemBody += this.parse(item.tokens, loose);
            body += this.renderer.listitem(itemBody, task, !!checked);
          }
          out += this.renderer.list(body, ordered, start);
          continue;
        }
        case "html": {
          const htmlToken = token;
          out += this.renderer.html(htmlToken.text, htmlToken.block);
          continue;
        }
        case "paragraph": {
          const paragraphToken = token;
          out += this.renderer.paragraph(this.parseInline(paragraphToken.tokens));
          continue;
        }
        case "text": {
          let textToken = token;
          let body = textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text;
          while (i4 + 1 < tokens.length && tokens[i4 + 1].type === "text") {
            textToken = tokens[++i4];
            body += "\n" + (textToken.tokens ? this.parseInline(textToken.tokens) : textToken.text);
          }
          out += top ? this.renderer.paragraph(body) : body;
          continue;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
  /**
   * Parse Inline Tokens
   */
  parseInline(tokens, renderer) {
    renderer = renderer || this.renderer;
    let out = "";
    for (let i4 = 0; i4 < tokens.length; i4++) {
      const token = tokens[i4];
      if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
        const ret = this.options.extensions.renderers[token.type].call({ parser: this }, token);
        if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
          out += ret || "";
          continue;
        }
      }
      switch (token.type) {
        case "escape": {
          const escapeToken = token;
          out += renderer.text(escapeToken.text);
          break;
        }
        case "html": {
          const tagToken = token;
          out += renderer.html(tagToken.text);
          break;
        }
        case "link": {
          const linkToken = token;
          out += renderer.link(linkToken.href, linkToken.title, this.parseInline(linkToken.tokens, renderer));
          break;
        }
        case "image": {
          const imageToken = token;
          out += renderer.image(imageToken.href, imageToken.title, imageToken.text);
          break;
        }
        case "strong": {
          const strongToken = token;
          out += renderer.strong(this.parseInline(strongToken.tokens, renderer));
          break;
        }
        case "em": {
          const emToken = token;
          out += renderer.em(this.parseInline(emToken.tokens, renderer));
          break;
        }
        case "codespan": {
          const codespanToken = token;
          out += renderer.codespan(codespanToken.text);
          break;
        }
        case "br": {
          out += renderer.br();
          break;
        }
        case "del": {
          const delToken = token;
          out += renderer.del(this.parseInline(delToken.tokens, renderer));
          break;
        }
        case "text": {
          const textToken = token;
          out += renderer.text(textToken.text);
          break;
        }
        default: {
          const errMsg = 'Token with "' + token.type + '" type was not found.';
          if (this.options.silent) {
            console.error(errMsg);
            return "";
          } else {
            throw new Error(errMsg);
          }
        }
      }
    }
    return out;
  }
}
class _Hooks {
  options;
  constructor(options) {
    this.options = options || _defaults;
  }
  static passThroughHooks = /* @__PURE__ */ new Set([
    "preprocess",
    "postprocess",
    "processAllTokens"
  ]);
  /**
   * Process markdown before marked
   */
  preprocess(markdown) {
    return markdown;
  }
  /**
   * Process HTML after marked is finished
   */
  postprocess(html2) {
    return html2;
  }
  /**
   * Process all tokens before walk tokens
   */
  processAllTokens(tokens) {
    return tokens;
  }
}
class Marked {
  defaults = _getDefaults();
  options = this.setOptions;
  parse = this.#parseMarkdown(_Lexer.lex, _Parser.parse);
  parseInline = this.#parseMarkdown(_Lexer.lexInline, _Parser.parseInline);
  Parser = _Parser;
  Renderer = _Renderer;
  TextRenderer = _TextRenderer;
  Lexer = _Lexer;
  Tokenizer = _Tokenizer;
  Hooks = _Hooks;
  constructor(...args) {
    this.use(...args);
  }
  /**
   * Run callback for every token
   */
  walkTokens(tokens, callback) {
    let values = [];
    for (const token of tokens) {
      values = values.concat(callback.call(this, token));
      switch (token.type) {
        case "table": {
          const tableToken = token;
          for (const cell of tableToken.header) {
            values = values.concat(this.walkTokens(cell.tokens, callback));
          }
          for (const row of tableToken.rows) {
            for (const cell of row) {
              values = values.concat(this.walkTokens(cell.tokens, callback));
            }
          }
          break;
        }
        case "list": {
          const listToken = token;
          values = values.concat(this.walkTokens(listToken.items, callback));
          break;
        }
        default: {
          const genericToken = token;
          if (this.defaults.extensions?.childTokens?.[genericToken.type]) {
            this.defaults.extensions.childTokens[genericToken.type].forEach((childTokens) => {
              const tokens2 = genericToken[childTokens].flat(Infinity);
              values = values.concat(this.walkTokens(tokens2, callback));
            });
          } else if (genericToken.tokens) {
            values = values.concat(this.walkTokens(genericToken.tokens, callback));
          }
        }
      }
    }
    return values;
  }
  use(...args) {
    const extensions = this.defaults.extensions || { renderers: {}, childTokens: {} };
    args.forEach((pack) => {
      const opts = { ...pack };
      opts.async = this.defaults.async || opts.async || false;
      if (pack.extensions) {
        pack.extensions.forEach((ext) => {
          if (!ext.name) {
            throw new Error("extension name required");
          }
          if ("renderer" in ext) {
            const prevRenderer = extensions.renderers[ext.name];
            if (prevRenderer) {
              extensions.renderers[ext.name] = function(...args2) {
                let ret = ext.renderer.apply(this, args2);
                if (ret === false) {
                  ret = prevRenderer.apply(this, args2);
                }
                return ret;
              };
            } else {
              extensions.renderers[ext.name] = ext.renderer;
            }
          }
          if ("tokenizer" in ext) {
            if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
              throw new Error("extension level must be 'block' or 'inline'");
            }
            const extLevel = extensions[ext.level];
            if (extLevel) {
              extLevel.unshift(ext.tokenizer);
            } else {
              extensions[ext.level] = [ext.tokenizer];
            }
            if (ext.start) {
              if (ext.level === "block") {
                if (extensions.startBlock) {
                  extensions.startBlock.push(ext.start);
                } else {
                  extensions.startBlock = [ext.start];
                }
              } else if (ext.level === "inline") {
                if (extensions.startInline) {
                  extensions.startInline.push(ext.start);
                } else {
                  extensions.startInline = [ext.start];
                }
              }
            }
          }
          if ("childTokens" in ext && ext.childTokens) {
            extensions.childTokens[ext.name] = ext.childTokens;
          }
        });
        opts.extensions = extensions;
      }
      if (pack.renderer) {
        const renderer = this.defaults.renderer || new _Renderer(this.defaults);
        for (const prop in pack.renderer) {
          if (!(prop in renderer)) {
            throw new Error(`renderer '${prop}' does not exist`);
          }
          if (prop === "options") {
            continue;
          }
          const rendererProp = prop;
          const rendererFunc = pack.renderer[rendererProp];
          const prevRenderer = renderer[rendererProp];
          renderer[rendererProp] = (...args2) => {
            let ret = rendererFunc.apply(renderer, args2);
            if (ret === false) {
              ret = prevRenderer.apply(renderer, args2);
            }
            return ret || "";
          };
        }
        opts.renderer = renderer;
      }
      if (pack.tokenizer) {
        const tokenizer = this.defaults.tokenizer || new _Tokenizer(this.defaults);
        for (const prop in pack.tokenizer) {
          if (!(prop in tokenizer)) {
            throw new Error(`tokenizer '${prop}' does not exist`);
          }
          if (["options", "rules", "lexer"].includes(prop)) {
            continue;
          }
          const tokenizerProp = prop;
          const tokenizerFunc = pack.tokenizer[tokenizerProp];
          const prevTokenizer = tokenizer[tokenizerProp];
          tokenizer[tokenizerProp] = (...args2) => {
            let ret = tokenizerFunc.apply(tokenizer, args2);
            if (ret === false) {
              ret = prevTokenizer.apply(tokenizer, args2);
            }
            return ret;
          };
        }
        opts.tokenizer = tokenizer;
      }
      if (pack.hooks) {
        const hooks = this.defaults.hooks || new _Hooks();
        for (const prop in pack.hooks) {
          if (!(prop in hooks)) {
            throw new Error(`hook '${prop}' does not exist`);
          }
          if (prop === "options") {
            continue;
          }
          const hooksProp = prop;
          const hooksFunc = pack.hooks[hooksProp];
          const prevHook = hooks[hooksProp];
          if (_Hooks.passThroughHooks.has(prop)) {
            hooks[hooksProp] = (arg) => {
              if (this.defaults.async) {
                return Promise.resolve(hooksFunc.call(hooks, arg)).then((ret2) => {
                  return prevHook.call(hooks, ret2);
                });
              }
              const ret = hooksFunc.call(hooks, arg);
              return prevHook.call(hooks, ret);
            };
          } else {
            hooks[hooksProp] = (...args2) => {
              let ret = hooksFunc.apply(hooks, args2);
              if (ret === false) {
                ret = prevHook.apply(hooks, args2);
              }
              return ret;
            };
          }
        }
        opts.hooks = hooks;
      }
      if (pack.walkTokens) {
        const walkTokens = this.defaults.walkTokens;
        const packWalktokens = pack.walkTokens;
        opts.walkTokens = function(token) {
          let values = [];
          values.push(packWalktokens.call(this, token));
          if (walkTokens) {
            values = values.concat(walkTokens.call(this, token));
          }
          return values;
        };
      }
      this.defaults = { ...this.defaults, ...opts };
    });
    return this;
  }
  setOptions(opt) {
    this.defaults = { ...this.defaults, ...opt };
    return this;
  }
  lexer(src, options) {
    return _Lexer.lex(src, options ?? this.defaults);
  }
  parser(tokens, options) {
    return _Parser.parse(tokens, options ?? this.defaults);
  }
  #parseMarkdown(lexer, parser) {
    return (src, options) => {
      const origOpt = { ...options };
      const opt = { ...this.defaults, ...origOpt };
      if (this.defaults.async === true && origOpt.async === false) {
        if (!opt.silent) {
          console.warn("marked(): The async option was set to true by an extension. The async: false option sent to parse will be ignored.");
        }
        opt.async = true;
      }
      const throwError = this.#onError(!!opt.silent, !!opt.async);
      if (typeof src === "undefined" || src === null) {
        return throwError(new Error("marked(): input parameter is undefined or null"));
      }
      if (typeof src !== "string") {
        return throwError(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected"));
      }
      if (opt.hooks) {
        opt.hooks.options = opt;
      }
      if (opt.async) {
        return Promise.resolve(opt.hooks ? opt.hooks.preprocess(src) : src).then((src2) => lexer(src2, opt)).then((tokens) => opt.hooks ? opt.hooks.processAllTokens(tokens) : tokens).then((tokens) => opt.walkTokens ? Promise.all(this.walkTokens(tokens, opt.walkTokens)).then(() => tokens) : tokens).then((tokens) => parser(tokens, opt)).then((html2) => opt.hooks ? opt.hooks.postprocess(html2) : html2).catch(throwError);
      }
      try {
        if (opt.hooks) {
          src = opt.hooks.preprocess(src);
        }
        let tokens = lexer(src, opt);
        if (opt.hooks) {
          tokens = opt.hooks.processAllTokens(tokens);
        }
        if (opt.walkTokens) {
          this.walkTokens(tokens, opt.walkTokens);
        }
        let html2 = parser(tokens, opt);
        if (opt.hooks) {
          html2 = opt.hooks.postprocess(html2);
        }
        return html2;
      } catch (e2) {
        return throwError(e2);
      }
    };
  }
  #onError(silent, async) {
    return (e2) => {
      e2.message += "\nPlease report this to https://github.com/markedjs/marked.";
      if (silent) {
        const msg = "<p>An error occurred:</p><pre>" + escape$1(e2.message + "", true) + "</pre>";
        if (async) {
          return Promise.resolve(msg);
        }
        return msg;
      }
      if (async) {
        return Promise.reject(e2);
      }
      throw e2;
    };
  }
}
const markedInstance = new Marked();
function marked(src, opt) {
  return markedInstance.parse(src, opt);
}
marked.options = marked.setOptions = function(options) {
  markedInstance.setOptions(options);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.getDefaults = _getDefaults;
marked.defaults = _defaults;
marked.use = function(...args) {
  markedInstance.use(...args);
  marked.defaults = markedInstance.defaults;
  changeDefaults(marked.defaults);
  return marked;
};
marked.walkTokens = function(tokens, callback) {
  return markedInstance.walkTokens(tokens, callback);
};
marked.parseInline = markedInstance.parseInline;
marked.Parser = _Parser;
marked.parser = _Parser.parse;
marked.Renderer = _Renderer;
marked.TextRenderer = _TextRenderer;
marked.Lexer = _Lexer;
marked.lexer = _Lexer.lex;
marked.Tokenizer = _Tokenizer;
marked.Hooks = _Hooks;
marked.parse = marked;
marked.options;
marked.setOptions;
marked.use;
marked.walkTokens;
marked.parseInline;
_Parser.parse;
_Lexer.lex;
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AArrowDown = [
  ["path", { d: "M3.5 13h6" }],
  ["path", { d: "m2 16 4.5-9 4.5 9" }],
  ["path", { d: "M18 7v9" }],
  ["path", { d: "m14 12 4 4 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ALargeSmall = [
  ["path", { d: "M21 14h-5" }],
  ["path", { d: "M16 16v-3.5a2.5 2.5 0 0 1 5 0V16" }],
  ["path", { d: "M4.5 13h6" }],
  ["path", { d: "m3 16 4.5-9 4.5 9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AArrowUp = [
  ["path", { d: "M3.5 13h6" }],
  ["path", { d: "m2 16 4.5-9 4.5 9" }],
  ["path", { d: "M18 16V7" }],
  ["path", { d: "m14 11 4-4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Accessibility = [
  ["circle", { cx: "16", cy: "4", r: "1" }],
  ["path", { d: "m18 19 1-7-6 1" }],
  ["path", { d: "m5 8 3-3 5.5 3-2.36 3.5" }],
  ["path", { d: "M4.24 14.5a5 5 0 0 0 6.88 6" }],
  ["path", { d: "M13.76 17.5a5 5 0 0 0-6.88-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Activity = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AirVent = [
  ["path", { d: "M18 17.5a2.5 2.5 0 1 1-4 2.03V12" }],
  ["path", { d: "M6 12H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M6 8h12" }],
  ["path", { d: "M6.6 15.572A2 2 0 1 0 10 17v-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Airplay = [
  ["path", { d: "M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1" }],
  ["path", { d: "m12 15 5 6H7Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlarmClockCheck = [
  ["circle", { cx: "12", cy: "13", r: "8" }],
  ["path", { d: "M5 3 2 6" }],
  ["path", { d: "m22 6-3-3" }],
  ["path", { d: "M6.38 18.7 4 21" }],
  ["path", { d: "M17.64 18.67 20 21" }],
  ["path", { d: "m9 13 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlarmClockMinus = [
  ["circle", { cx: "12", cy: "13", r: "8" }],
  ["path", { d: "M5 3 2 6" }],
  ["path", { d: "m22 6-3-3" }],
  ["path", { d: "M6.38 18.7 4 21" }],
  ["path", { d: "M17.64 18.67 20 21" }],
  ["path", { d: "M9 13h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlarmClockOff = [
  ["path", { d: "M6.87 6.87a8 8 0 1 0 11.26 11.26" }],
  ["path", { d: "M19.9 14.25a8 8 0 0 0-9.15-9.15" }],
  ["path", { d: "m22 6-3-3" }],
  ["path", { d: "M6.26 18.67 4 21" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M4 4 2 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlarmClockPlus = [
  ["circle", { cx: "12", cy: "13", r: "8" }],
  ["path", { d: "M5 3 2 6" }],
  ["path", { d: "m22 6-3-3" }],
  ["path", { d: "M6.38 18.7 4 21" }],
  ["path", { d: "M17.64 18.67 20 21" }],
  ["path", { d: "M12 10v6" }],
  ["path", { d: "M9 13h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlarmClock = [
  ["circle", { cx: "12", cy: "13", r: "8" }],
  ["path", { d: "M12 9v4l2 2" }],
  ["path", { d: "M5 3 2 6" }],
  ["path", { d: "m22 6-3-3" }],
  ["path", { d: "M6.38 18.7 4 21" }],
  ["path", { d: "M17.64 18.67 20 21" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlarmSmoke = [
  ["path", { d: "M11 21c0-2.5 2-2.5 2-5" }],
  ["path", { d: "M16 21c0-2.5 2-2.5 2-5" }],
  ["path", { d: "m19 8-.8 3a1.25 1.25 0 0 1-1.2 1H7a1.25 1.25 0 0 1-1.2-1L5 8" }],
  ["path", { d: "M21 3a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1z" }],
  ["path", { d: "M6 21c0-2.5 2-2.5 2-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Album = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["polyline", { points: "11 3 11 11 14 8 17 11 17 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignCenterHorizontal = [
  ["path", { d: "M2 12h20" }],
  ["path", { d: "M10 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" }],
  ["path", { d: "M10 8V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M20 16v1a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2v-1" }],
  ["path", { d: "M14 8V7c0-1.1.9-2 2-2h2a2 2 0 0 1 2 2v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignCenterVertical = [
  ["path", { d: "M12 2v20" }],
  ["path", { d: "M8 10H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h4" }],
  ["path", { d: "M16 10h4a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-4" }],
  ["path", { d: "M8 20H7a2 2 0 0 1-2-2v-2c0-1.1.9-2 2-2h1" }],
  ["path", { d: "M16 14h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignCenter = [
  ["path", { d: "M17 12H7" }],
  ["path", { d: "M19 18H5" }],
  ["path", { d: "M21 6H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignEndHorizontal = [
  ["rect", { width: "6", height: "16", x: "4", y: "2", rx: "2" }],
  ["rect", { width: "6", height: "9", x: "14", y: "9", rx: "2" }],
  ["path", { d: "M22 22H2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignEndVertical = [
  ["rect", { width: "16", height: "6", x: "2", y: "4", rx: "2" }],
  ["rect", { width: "9", height: "6", x: "9", y: "14", rx: "2" }],
  ["path", { d: "M22 22V2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignHorizontalDistributeCenter = [
  ["rect", { width: "6", height: "14", x: "4", y: "5", rx: "2" }],
  ["rect", { width: "6", height: "10", x: "14", y: "7", rx: "2" }],
  ["path", { d: "M17 22v-5" }],
  ["path", { d: "M17 7V2" }],
  ["path", { d: "M7 22v-3" }],
  ["path", { d: "M7 5V2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignHorizontalDistributeStart = [
  ["rect", { width: "6", height: "14", x: "4", y: "5", rx: "2" }],
  ["rect", { width: "6", height: "10", x: "14", y: "7", rx: "2" }],
  ["path", { d: "M4 2v20" }],
  ["path", { d: "M14 2v20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignHorizontalDistributeEnd = [
  ["rect", { width: "6", height: "14", x: "4", y: "5", rx: "2" }],
  ["rect", { width: "6", height: "10", x: "14", y: "7", rx: "2" }],
  ["path", { d: "M10 2v20" }],
  ["path", { d: "M20 2v20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignHorizontalJustifyCenter = [
  ["rect", { width: "6", height: "14", x: "2", y: "5", rx: "2" }],
  ["rect", { width: "6", height: "10", x: "16", y: "7", rx: "2" }],
  ["path", { d: "M12 2v20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignHorizontalJustifyStart = [
  ["rect", { width: "6", height: "14", x: "6", y: "5", rx: "2" }],
  ["rect", { width: "6", height: "10", x: "16", y: "7", rx: "2" }],
  ["path", { d: "M2 2v20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignHorizontalJustifyEnd = [
  ["rect", { width: "6", height: "14", x: "2", y: "5", rx: "2" }],
  ["rect", { width: "6", height: "10", x: "12", y: "7", rx: "2" }],
  ["path", { d: "M22 2v20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignHorizontalSpaceAround = [
  ["rect", { width: "6", height: "10", x: "9", y: "7", rx: "2" }],
  ["path", { d: "M4 22V2" }],
  ["path", { d: "M20 22V2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignHorizontalSpaceBetween = [
  ["rect", { width: "6", height: "14", x: "3", y: "5", rx: "2" }],
  ["rect", { width: "6", height: "10", x: "15", y: "7", rx: "2" }],
  ["path", { d: "M3 2v20" }],
  ["path", { d: "M21 2v20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignJustify = [
  ["path", { d: "M3 12h18" }],
  ["path", { d: "M3 18h18" }],
  ["path", { d: "M3 6h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignLeft = [
  ["path", { d: "M15 12H3" }],
  ["path", { d: "M17 18H3" }],
  ["path", { d: "M21 6H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignRight = [
  ["path", { d: "M21 12H9" }],
  ["path", { d: "M21 18H7" }],
  ["path", { d: "M21 6H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignStartHorizontal = [
  ["rect", { width: "6", height: "16", x: "4", y: "6", rx: "2" }],
  ["rect", { width: "6", height: "9", x: "14", y: "6", rx: "2" }],
  ["path", { d: "M22 2H2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignStartVertical = [
  ["rect", { width: "9", height: "6", x: "6", y: "14", rx: "2" }],
  ["rect", { width: "16", height: "6", x: "6", y: "4", rx: "2" }],
  ["path", { d: "M2 2v20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignVerticalDistributeCenter = [
  ["path", { d: "M22 17h-3" }],
  ["path", { d: "M22 7h-5" }],
  ["path", { d: "M5 17H2" }],
  ["path", { d: "M7 7H2" }],
  ["rect", { x: "5", y: "14", width: "14", height: "6", rx: "2" }],
  ["rect", { x: "7", y: "4", width: "10", height: "6", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignVerticalDistributeEnd = [
  ["rect", { width: "14", height: "6", x: "5", y: "14", rx: "2" }],
  ["rect", { width: "10", height: "6", x: "7", y: "4", rx: "2" }],
  ["path", { d: "M2 20h20" }],
  ["path", { d: "M2 10h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignVerticalDistributeStart = [
  ["rect", { width: "14", height: "6", x: "5", y: "14", rx: "2" }],
  ["rect", { width: "10", height: "6", x: "7", y: "4", rx: "2" }],
  ["path", { d: "M2 14h20" }],
  ["path", { d: "M2 4h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignVerticalJustifyCenter = [
  ["rect", { width: "14", height: "6", x: "5", y: "16", rx: "2" }],
  ["rect", { width: "10", height: "6", x: "7", y: "2", rx: "2" }],
  ["path", { d: "M2 12h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignVerticalJustifyEnd = [
  ["rect", { width: "14", height: "6", x: "5", y: "12", rx: "2" }],
  ["rect", { width: "10", height: "6", x: "7", y: "2", rx: "2" }],
  ["path", { d: "M2 22h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignVerticalJustifyStart = [
  ["rect", { width: "14", height: "6", x: "5", y: "16", rx: "2" }],
  ["rect", { width: "10", height: "6", x: "7", y: "6", rx: "2" }],
  ["path", { d: "M2 2h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignVerticalSpaceAround = [
  ["rect", { width: "10", height: "6", x: "7", y: "9", rx: "2" }],
  ["path", { d: "M22 20H2" }],
  ["path", { d: "M22 4H2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AlignVerticalSpaceBetween = [
  ["rect", { width: "14", height: "6", x: "5", y: "15", rx: "2" }],
  ["rect", { width: "10", height: "6", x: "7", y: "3", rx: "2" }],
  ["path", { d: "M2 21h20" }],
  ["path", { d: "M2 3h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ambulance = [
  ["path", { d: "M10 10H6" }],
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" }],
  [
    "path",
    {
      d: "M19 18h2a1 1 0 0 0 1-1v-3.28a1 1 0 0 0-.684-.948l-1.923-.641a1 1 0 0 1-.578-.502l-1.539-3.076A1 1 0 0 0 16.382 8H14"
    }
  ],
  ["path", { d: "M8 8v4" }],
  ["path", { d: "M9 18h6" }],
  ["circle", { cx: "17", cy: "18", r: "2" }],
  ["circle", { cx: "7", cy: "18", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ampersand = [
  [
    "path",
    {
      d: "M17.5 12c0 4.4-3.6 8-8 8A4.5 4.5 0 0 1 5 15.5c0-6 8-4 8-8.5a3 3 0 1 0-6 0c0 3 2.5 8.5 12 13"
    }
  ],
  ["path", { d: "M16 12h3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ampersands = [
  [
    "path",
    { d: "M10 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5" }
  ],
  [
    "path",
    { d: "M22 17c-5-3-7-7-7-9a2 2 0 0 1 4 0c0 2.5-5 2.5-5 6 0 1.7 1.3 3 3 3 2.8 0 5-2.2 5-5" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Amphora = [
  ["path", { d: "M10 2v5.632c0 .424-.272.795-.653.982A6 6 0 0 0 6 14c.006 4 3 7 5 8" }],
  ["path", { d: "M10 5H8a2 2 0 0 0 0 4h.68" }],
  ["path", { d: "M14 2v5.632c0 .424.272.795.652.982A6 6 0 0 1 18 14c0 4-3 7-5 8" }],
  ["path", { d: "M14 5h2a2 2 0 0 1 0 4h-.68" }],
  ["path", { d: "M18 22H6" }],
  ["path", { d: "M9 2h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Anchor = [
  ["path", { d: "M12 22V8" }],
  ["path", { d: "M5 12H2a10 10 0 0 0 20 0h-3" }],
  ["circle", { cx: "12", cy: "5", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Angry = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M16 16s-1.5-2-4-2-4 2-4 2" }],
  ["path", { d: "M7.5 8 10 9" }],
  ["path", { d: "m14 9 2.5-1" }],
  ["path", { d: "M9 10h.01" }],
  ["path", { d: "M15 10h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Annoyed = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M8 15h8" }],
  ["path", { d: "M8 9h2" }],
  ["path", { d: "M14 9h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Antenna = [
  ["path", { d: "M2 12 7 2" }],
  ["path", { d: "m7 12 5-10" }],
  ["path", { d: "m12 12 5-10" }],
  ["path", { d: "m17 12 5-10" }],
  ["path", { d: "M4.5 7h15" }],
  ["path", { d: "M12 16v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Anvil = [
  ["path", { d: "M7 10H6a4 4 0 0 1-4-4 1 1 0 0 1 1-1h4" }],
  ["path", { d: "M7 5a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1 7 7 0 0 1-7 7H8a1 1 0 0 1-1-1z" }],
  ["path", { d: "M9 12v5" }],
  ["path", { d: "M15 12v5" }],
  ["path", { d: "M5 20a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3 1 1 0 0 1-1 1H6a1 1 0 0 1-1-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Aperture = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m14.31 8 5.74 9.94" }],
  ["path", { d: "M9.69 8h11.48" }],
  ["path", { d: "m7.38 12 5.74-9.94" }],
  ["path", { d: "M9.69 16 3.95 6.06" }],
  ["path", { d: "M14.31 16H2.83" }],
  ["path", { d: "m16.62 12-5.74 9.94" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AppWindowMac = [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
  ["path", { d: "M6 8h.01" }],
  ["path", { d: "M10 8h.01" }],
  ["path", { d: "M14 8h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AppWindow = [
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }],
  ["path", { d: "M10 4v4" }],
  ["path", { d: "M2 8h20" }],
  ["path", { d: "M6 4v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Apple = [
  [
    "path",
    {
      d: "M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z"
    }
  ],
  ["path", { d: "M10 2c1 .5 2 2 2 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArchiveRestore = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h2" }],
  ["path", { d: "M20 8v11a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "m9 15 3-3 3 3" }],
  ["path", { d: "M12 12v9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Archive = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }],
  ["path", { d: "M10 12h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Armchair = [
  ["path", { d: "M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3" }],
  [
    "path",
    {
      d: "M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"
    }
  ],
  ["path", { d: "M5 18v2" }],
  ["path", { d: "M19 18v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArchiveX = [
  ["rect", { width: "20", height: "5", x: "2", y: "3", rx: "1" }],
  ["path", { d: "M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" }],
  ["path", { d: "m9.5 17 5-5" }],
  ["path", { d: "m9.5 12 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowBigDownDash = [
  ["path", { d: "M15 5H9" }],
  ["path", { d: "M15 9v3h4l-7 7-7-7h4V9z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowBigDown = [["path", { d: "M15 6v6h4l-7 7-7-7h4V6h6z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowBigLeftDash = [
  ["path", { d: "M19 15V9" }],
  ["path", { d: "M15 15h-3v4l-7-7 7-7v4h3v6z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowBigLeft = [["path", { d: "M18 15h-6v4l-7-7 7-7v4h6v6z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowBigRightDash = [
  ["path", { d: "M5 9v6" }],
  ["path", { d: "M9 9h3V5l7 7-7 7v-4H9V9z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowBigUpDash = [
  ["path", { d: "M9 19h6" }],
  ["path", { d: "M9 15v-3H5l7-7 7 7h-4v3H9z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowBigRight = [["path", { d: "M6 9h6V5l7 7-7 7v-4H6V9z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowBigUp = [["path", { d: "M9 18v-6H5l7-7 7 7h-4v6H9z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDown01 = [
  ["path", { d: "m3 16 4 4 4-4" }],
  ["path", { d: "M7 20V4" }],
  ["rect", { x: "15", y: "4", width: "4", height: "6", ry: "2" }],
  ["path", { d: "M17 20v-6h-2" }],
  ["path", { d: "M15 20h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDown10 = [
  ["path", { d: "m3 16 4 4 4-4" }],
  ["path", { d: "M7 20V4" }],
  ["path", { d: "M17 10V4h-2" }],
  ["path", { d: "M15 10h4" }],
  ["rect", { x: "15", y: "14", width: "4", height: "6", ry: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownAZ = [
  ["path", { d: "m3 16 4 4 4-4" }],
  ["path", { d: "M7 20V4" }],
  ["path", { d: "M20 8h-5" }],
  ["path", { d: "M15 10V6.5a2.5 2.5 0 0 1 5 0V10" }],
  ["path", { d: "M15 14h5l-5 6h5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownFromLine = [
  ["path", { d: "M19 3H5" }],
  ["path", { d: "M12 21V7" }],
  ["path", { d: "m6 15 6 6 6-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownLeft = [
  ["path", { d: "M17 7 7 17" }],
  ["path", { d: "M17 17H7V7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownNarrowWide = [
  ["path", { d: "m3 16 4 4 4-4" }],
  ["path", { d: "M7 20V4" }],
  ["path", { d: "M11 4h4" }],
  ["path", { d: "M11 8h7" }],
  ["path", { d: "M11 12h10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownRight = [
  ["path", { d: "m7 7 10 10" }],
  ["path", { d: "M17 7v10H7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownToDot = [
  ["path", { d: "M12 2v14" }],
  ["path", { d: "m19 9-7 7-7-7" }],
  ["circle", { cx: "12", cy: "21", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownToLine = [
  ["path", { d: "M12 17V3" }],
  ["path", { d: "m6 11 6 6 6-6" }],
  ["path", { d: "M19 21H5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownUp = [
  ["path", { d: "m3 16 4 4 4-4" }],
  ["path", { d: "M7 20V4" }],
  ["path", { d: "m21 8-4-4-4 4" }],
  ["path", { d: "M17 4v16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownWideNarrow = [
  ["path", { d: "m3 16 4 4 4-4" }],
  ["path", { d: "M7 20V4" }],
  ["path", { d: "M11 4h10" }],
  ["path", { d: "M11 8h7" }],
  ["path", { d: "M11 12h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDownZA = [
  ["path", { d: "m3 16 4 4 4-4" }],
  ["path", { d: "M7 4v16" }],
  ["path", { d: "M15 4h5l-5 6h5" }],
  ["path", { d: "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" }],
  ["path", { d: "M20 18h-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowDown = [
  ["path", { d: "M12 5v14" }],
  ["path", { d: "m19 12-7 7-7-7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowLeftFromLine = [
  ["path", { d: "m9 6-6 6 6 6" }],
  ["path", { d: "M3 12h14" }],
  ["path", { d: "M21 19V5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowLeftRight = [
  ["path", { d: "M8 3 4 7l4 4" }],
  ["path", { d: "M4 7h16" }],
  ["path", { d: "m16 21 4-4-4-4" }],
  ["path", { d: "M20 17H4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowLeftToLine = [
  ["path", { d: "M3 19V5" }],
  ["path", { d: "m13 6-6 6 6 6" }],
  ["path", { d: "M7 12h14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowLeft = [
  ["path", { d: "m12 19-7-7 7-7" }],
  ["path", { d: "M19 12H5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRightFromLine = [
  ["path", { d: "M3 5v14" }],
  ["path", { d: "M21 12H7" }],
  ["path", { d: "m15 18 6-6-6-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRightLeft = [
  ["path", { d: "m16 3 4 4-4 4" }],
  ["path", { d: "M20 7H4" }],
  ["path", { d: "m8 21-4-4 4-4" }],
  ["path", { d: "M4 17h16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRightToLine = [
  ["path", { d: "M17 12H3" }],
  ["path", { d: "m11 18 6-6-6-6" }],
  ["path", { d: "M21 5v14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowRight = [
  ["path", { d: "M5 12h14" }],
  ["path", { d: "m12 5 7 7-7 7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUp01 = [
  ["path", { d: "m3 8 4-4 4 4" }],
  ["path", { d: "M7 4v16" }],
  ["rect", { x: "15", y: "4", width: "4", height: "6", ry: "2" }],
  ["path", { d: "M17 20v-6h-2" }],
  ["path", { d: "M15 20h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUp10 = [
  ["path", { d: "m3 8 4-4 4 4" }],
  ["path", { d: "M7 4v16" }],
  ["path", { d: "M17 10V4h-2" }],
  ["path", { d: "M15 10h4" }],
  ["rect", { x: "15", y: "14", width: "4", height: "6", ry: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpAZ = [
  ["path", { d: "m3 8 4-4 4 4" }],
  ["path", { d: "M7 4v16" }],
  ["path", { d: "M20 8h-5" }],
  ["path", { d: "M15 10V6.5a2.5 2.5 0 0 1 5 0V10" }],
  ["path", { d: "M15 14h5l-5 6h5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpDown = [
  ["path", { d: "m21 16-4 4-4-4" }],
  ["path", { d: "M17 20V4" }],
  ["path", { d: "m3 8 4-4 4 4" }],
  ["path", { d: "M7 4v16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpFromDot = [
  ["path", { d: "m5 9 7-7 7 7" }],
  ["path", { d: "M12 16V2" }],
  ["circle", { cx: "12", cy: "21", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpFromLine = [
  ["path", { d: "m18 9-6-6-6 6" }],
  ["path", { d: "M12 3v14" }],
  ["path", { d: "M5 21h14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpLeft = [
  ["path", { d: "M7 17V7h10" }],
  ["path", { d: "M17 17 7 7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpNarrowWide = [
  ["path", { d: "m3 8 4-4 4 4" }],
  ["path", { d: "M7 4v16" }],
  ["path", { d: "M11 12h4" }],
  ["path", { d: "M11 16h7" }],
  ["path", { d: "M11 20h10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpRight = [
  ["path", { d: "M7 7h10v10" }],
  ["path", { d: "M7 17 17 7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpWideNarrow = [
  ["path", { d: "m3 8 4-4 4 4" }],
  ["path", { d: "M7 4v16" }],
  ["path", { d: "M11 12h10" }],
  ["path", { d: "M11 16h7" }],
  ["path", { d: "M11 20h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpToLine = [
  ["path", { d: "M5 3h14" }],
  ["path", { d: "m18 13-6-6-6 6" }],
  ["path", { d: "M12 7v14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUpZA = [
  ["path", { d: "m3 8 4-4 4 4" }],
  ["path", { d: "M7 4v16" }],
  ["path", { d: "M15 4h5l-5 6h5" }],
  ["path", { d: "M15 20v-3.5a2.5 2.5 0 0 1 5 0V20" }],
  ["path", { d: "M20 18h-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowUp = [
  ["path", { d: "m5 12 7-7 7 7" }],
  ["path", { d: "M12 19V5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Asterisk = [
  ["path", { d: "M12 6v12" }],
  ["path", { d: "M17.196 9 6.804 15" }],
  ["path", { d: "m6.804 9 10.392 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ArrowsUpFromLine = [
  ["path", { d: "m4 6 3-3 3 3" }],
  ["path", { d: "M7 17V3" }],
  ["path", { d: "m14 6 3-3 3 3" }],
  ["path", { d: "M17 17V3" }],
  ["path", { d: "M4 21h16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AtSign = [
  ["circle", { cx: "12", cy: "12", r: "4" }],
  ["path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Atom = [
  ["circle", { cx: "12", cy: "12", r: "1" }],
  [
    "path",
    {
      d: "M20.2 20.2c2.04-2.03.02-7.36-4.5-11.9-4.54-4.52-9.87-6.54-11.9-4.5-2.04 2.03-.02 7.36 4.5 11.9 4.54 4.52 9.87 6.54 11.9 4.5Z"
    }
  ],
  [
    "path",
    {
      d: "M15.7 15.7c4.52-4.54 6.54-9.87 4.5-11.9-2.03-2.04-7.36-.02-11.9 4.5-4.52 4.54-6.54 9.87-4.5 11.9 2.03 2.04 7.36.02 11.9-4.5Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AudioLines = [
  ["path", { d: "M2 10v3" }],
  ["path", { d: "M6 6v11" }],
  ["path", { d: "M10 3v18" }],
  ["path", { d: "M14 8v7" }],
  ["path", { d: "M18 5v13" }],
  ["path", { d: "M22 10v3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const AudioWaveform = [
  [
    "path",
    {
      d: "M2 13a2 2 0 0 0 2-2V7a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0V4a2 2 0 0 1 4 0v13a2 2 0 0 0 4 0v-4a2 2 0 0 1 2-2"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Award = [
  [
    "path",
    {
      d: "m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Axe = [
  ["path", { d: "m14 12-8.381 8.38a1 1 0 0 1-3.001-3L11 9" }],
  [
    "path",
    {
      d: "M15 15.5a.5.5 0 0 0 .5.5A6.5 6.5 0 0 0 22 9.5a.5.5 0 0 0-.5-.5h-1.672a2 2 0 0 1-1.414-.586l-5.062-5.062a1.205 1.205 0 0 0-1.704 0L9.352 5.648a1.205 1.205 0 0 0 0 1.704l5.062 5.062A2 2 0 0 1 15 13.828z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Axis3d = [
  ["path", { d: "M13.5 10.5 15 9" }],
  ["path", { d: "M4 4v15a1 1 0 0 0 1 1h15" }],
  ["path", { d: "M4.293 19.707 6 18" }],
  ["path", { d: "m9 15 1.5-1.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Baby = [
  ["path", { d: "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5" }],
  ["path", { d: "M15 12h.01" }],
  [
    "path",
    {
      d: "M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"
    }
  ],
  ["path", { d: "M9 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Backpack = [
  ["path", { d: "M4 10a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" }],
  ["path", { d: "M8 10h8" }],
  ["path", { d: "M8 18h8" }],
  ["path", { d: "M8 22v-6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v6" }],
  ["path", { d: "M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeAlert = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeCheck = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeCent = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "M12 7v10" }],
  ["path", { d: "M15.4 10a4 4 0 1 0 0 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeDollarSign = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }],
  ["path", { d: "M12 18V6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeEuro = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "M7 12h5" }],
  ["path", { d: "M15 9.4a4 4 0 1 0 0 5.2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeIndianRupee = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "M8 8h8" }],
  ["path", { d: "M8 12h8" }],
  ["path", { d: "m13 17-5-1h1a4 4 0 0 0 0-8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeInfo = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["line", { x1: "12", x2: "12", y1: "16", y2: "12" }],
  ["line", { x1: "12", x2: "12.01", y1: "8", y2: "8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeJapaneseYen = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "m9 8 3 3v7" }],
  ["path", { d: "m12 11 3-3" }],
  ["path", { d: "M9 12h6" }],
  ["path", { d: "M9 16h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeMinus = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgePercent = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "m15 9-6 6" }],
  ["path", { d: "M9 9h.01" }],
  ["path", { d: "M15 15h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgePoundSterling = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "M8 12h4" }],
  ["path", { d: "M10 16V9.5a2.5 2.5 0 0 1 5 0" }],
  ["path", { d: "M8 16h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgePlus = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "16" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeQuestionMark = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
  ["line", { x1: "12", x2: "12.01", y1: "17", y2: "17" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeRussianRuble = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "M9 16h5" }],
  ["path", { d: "M9 12h5a2 2 0 1 0 0-4h-3v9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeSwissFranc = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["path", { d: "M11 17V8h4" }],
  ["path", { d: "M11 12h3" }],
  ["path", { d: "M9 16h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BadgeX = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ],
  ["line", { x1: "15", x2: "9", y1: "9", y2: "15" }],
  ["line", { x1: "9", x2: "15", y1: "9", y2: "15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Badge = [
  [
    "path",
    {
      d: "M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BaggageClaim = [
  ["path", { d: "M22 18H6a2 2 0 0 1-2-2V7a2 2 0 0 0-2-2" }],
  ["path", { d: "M17 14V4a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v10" }],
  ["rect", { width: "13", height: "8", x: "8", y: "6", rx: "1" }],
  ["circle", { cx: "18", cy: "20", r: "2" }],
  ["circle", { cx: "9", cy: "20", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ban = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m4.9 4.9 14.2 14.2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Banana = [
  ["path", { d: "M4 13c3.5-2 8-2 10 2a5.5 5.5 0 0 1 8 5" }],
  [
    "path",
    {
      d: "M5.15 17.89c5.52-1.52 8.65-6.89 7-12C11.55 4 11.5 2 13 2c3.22 0 5 5.5 5 8 0 6.5-4.2 12-10.49 12C5.11 22 2 22 2 20c0-1.5 1.14-1.55 3.15-2.11Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BanknoteArrowDown = [
  ["path", { d: "M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" }],
  ["path", { d: "m16 19 3 3 3-3" }],
  ["path", { d: "M18 12h.01" }],
  ["path", { d: "M19 16v6" }],
  ["path", { d: "M6 12h.01" }],
  ["circle", { cx: "12", cy: "12", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BanknoteArrowUp = [
  ["path", { d: "M12 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" }],
  ["path", { d: "M18 12h.01" }],
  ["path", { d: "M19 22v-6" }],
  ["path", { d: "m22 19-3-3-3 3" }],
  ["path", { d: "M6 12h.01" }],
  ["circle", { cx: "12", cy: "12", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bandage = [
  ["path", { d: "M10 10.01h.01" }],
  ["path", { d: "M10 14.01h.01" }],
  ["path", { d: "M14 10.01h.01" }],
  ["path", { d: "M14 14.01h.01" }],
  ["path", { d: "M18 6v11.5" }],
  ["path", { d: "M6 6v12" }],
  ["rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BanknoteX = [
  ["path", { d: "M13 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5" }],
  ["path", { d: "m17 17 5 5" }],
  ["path", { d: "M18 12h.01" }],
  ["path", { d: "m22 17-5 5" }],
  ["path", { d: "M6 12h.01" }],
  ["circle", { cx: "12", cy: "12", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Banknote = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }],
  ["circle", { cx: "12", cy: "12", r: "2" }],
  ["path", { d: "M6 12h.01M18 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Barcode = [
  ["path", { d: "M3 5v14" }],
  ["path", { d: "M8 5v14" }],
  ["path", { d: "M12 5v14" }],
  ["path", { d: "M17 5v14" }],
  ["path", { d: "M21 5v14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Barrel = [
  ["path", { d: "M10 3a41 41 0 0 0 0 18" }],
  ["path", { d: "M14 3a41 41 0 0 1 0 18" }],
  [
    "path",
    {
      d: "M17 3a2 2 0 0 1 1.68.92 15.25 15.25 0 0 1 0 16.16A2 2 0 0 1 17 21H7a2 2 0 0 1-1.68-.92 15.25 15.25 0 0 1 0-16.16A2 2 0 0 1 7 3z"
    }
  ],
  ["path", { d: "M3.84 17h16.32" }],
  ["path", { d: "M3.84 7h16.32" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Baseline = [
  ["path", { d: "M4 20h16" }],
  ["path", { d: "m6 16 6-12 6 12" }],
  ["path", { d: "M8 12h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bath = [
  ["path", { d: "M10 4 8 6" }],
  ["path", { d: "M17 19v2" }],
  ["path", { d: "M2 12h20" }],
  ["path", { d: "M7 19v2" }],
  ["path", { d: "M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BatteryCharging = [
  ["path", { d: "m11 7-3 5h4l-3 5" }],
  ["path", { d: "M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935" }],
  ["path", { d: "M22 14v-4" }],
  ["path", { d: "M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BatteryFull = [
  ["path", { d: "M10 10v4" }],
  ["path", { d: "M14 10v4" }],
  ["path", { d: "M22 14v-4" }],
  ["path", { d: "M6 10v4" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BatteryLow = [
  ["path", { d: "M22 14v-4" }],
  ["path", { d: "M6 14v-4" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BatteryMedium = [
  ["path", { d: "M10 14v-4" }],
  ["path", { d: "M22 14v-4" }],
  ["path", { d: "M6 14v-4" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BatteryPlus = [
  ["path", { d: "M10 9v6" }],
  ["path", { d: "M12.543 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.605" }],
  ["path", { d: "M22 14v-4" }],
  ["path", { d: "M7 12h6" }],
  ["path", { d: "M7.606 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.606" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BatteryWarning = [
  ["path", { d: "M10 17h.01" }],
  ["path", { d: "M10 7v6" }],
  ["path", { d: "M14 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M22 14v-4" }],
  ["path", { d: "M6 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Battery = [
  ["path", { d: "M 22 14 L 22 10" }],
  ["rect", { x: "2", y: "6", width: "16", height: "12", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Beaker = [
  ["path", { d: "M4.5 3h15" }],
  ["path", { d: "M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3" }],
  ["path", { d: "M6 14h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BeanOff = [
  ["path", { d: "M9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22a13.96 13.96 0 0 0 9.9-4.1" }],
  ["path", { d: "M10.75 5.093A6 6 0 0 1 22 8c0 2.411-.61 4.68-1.683 6.66" }],
  ["path", { d: "M5.341 10.62a4 4 0 0 0 6.487 1.208M10.62 5.341a4.015 4.015 0 0 1 2.039 2.04" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bean = [
  [
    "path",
    {
      d: "M10.165 6.598C9.954 7.478 9.64 8.36 9 9c-.64.64-1.521.954-2.402 1.165A6 6 0 0 0 8 22c7.732 0 14-6.268 14-14a6 6 0 0 0-11.835-1.402Z"
    }
  ],
  ["path", { d: "M5.341 10.62a4 4 0 1 0 5.279-5.28" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BedDouble = [
  ["path", { d: "M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8" }],
  ["path", { d: "M4 10V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" }],
  ["path", { d: "M12 4v6" }],
  ["path", { d: "M2 18h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BedSingle = [
  ["path", { d: "M3 20v-8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8" }],
  ["path", { d: "M5 10V6a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4" }],
  ["path", { d: "M3 18h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bed = [
  ["path", { d: "M2 4v16" }],
  ["path", { d: "M2 8h18a2 2 0 0 1 2 2v10" }],
  ["path", { d: "M2 17h20" }],
  ["path", { d: "M6 8v9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Beef = [
  [
    "path",
    {
      d: "M16.4 13.7A6.5 6.5 0 1 0 6.28 6.6c-1.1 3.13-.78 3.9-3.18 6.08A3 3 0 0 0 5 18c4 0 8.4-1.8 11.4-4.3"
    }
  ],
  [
    "path",
    {
      d: "m18.5 6 2.19 4.5a6.48 6.48 0 0 1-2.29 7.2C15.4 20.2 11 22 7 22a3 3 0 0 1-2.68-1.66L2.4 16.5"
    }
  ],
  ["circle", { cx: "12.5", cy: "8.5", r: "2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BeerOff = [
  ["path", { d: "M13 13v5" }],
  ["path", { d: "M17 11.47V8" }],
  ["path", { d: "M17 11h1a3 3 0 0 1 2.745 4.211" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-3" }],
  ["path", { d: "M7.536 7.535C6.766 7.649 6.154 8 5.5 8a2.5 2.5 0 0 1-1.768-4.268" }],
  [
    "path",
    {
      d: "M8.727 3.204C9.306 2.767 9.885 2 11 2c1.56 0 2 1.5 3 1.5s1.72-.5 2.5-.5a1 1 0 1 1 0 5c-.78 0-1.5-.5-2.5-.5a3.149 3.149 0 0 0-.842.12"
    }
  ],
  ["path", { d: "M9 14.6V18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Beer = [
  ["path", { d: "M17 11h1a3 3 0 0 1 0 6h-1" }],
  ["path", { d: "M9 12v6" }],
  ["path", { d: "M13 12v6" }],
  [
    "path",
    {
      d: "M14 7.5c-1 0-1.44.5-3 .5s-2-.5-3-.5-1.72.5-2.5.5a2.5 2.5 0 0 1 0-5c.78 0 1.57.5 2.5.5S9.44 2 11 2s2 1.5 3 1.5 1.72-.5 2.5-.5a2.5 2.5 0 0 1 0 5c-.78 0-1.5-.5-2.5-.5Z"
    }
  ],
  ["path", { d: "M5 8v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BellDot = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
  [
    "path",
    {
      d: "M13.916 2.314A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.74 7.327A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673 9 9 0 0 1-.585-.665"
    }
  ],
  ["circle", { cx: "18", cy: "8", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BellElectric = [
  ["path", { d: "M18.518 17.347A7 7 0 0 1 14 19" }],
  ["path", { d: "M18.8 4A11 11 0 0 1 20 9" }],
  ["path", { d: "M9 9h.01" }],
  ["circle", { cx: "20", cy: "16", r: "2" }],
  ["circle", { cx: "9", cy: "9", r: "7" }],
  ["rect", { x: "4", y: "16", width: "10", height: "6", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BellMinus = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
  ["path", { d: "M15 8h6" }],
  [
    "path",
    {
      d: "M16.243 3.757A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673A9.4 9.4 0 0 1 18.667 12"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BellOff = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
  ["path", { d: "M17 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 .258-1.742" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M8.668 3.01A6 6 0 0 1 18 8c0 2.687.77 4.653 1.707 6.05" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BellPlus = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
  ["path", { d: "M15 8h6" }],
  ["path", { d: "M18 5v6" }],
  [
    "path",
    {
      d: "M20.002 14.464a9 9 0 0 0 .738.863A1 1 0 0 1 20 17H4a1 1 0 0 1-.74-1.673C4.59 13.956 6 12.499 6 8a6 6 0 0 1 8.75-5.332"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BellRing = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
  ["path", { d: "M22 8c0-2.3-.8-4.3-2-6" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
    }
  ],
  ["path", { d: "M4 2C2.8 3.7 2 5.7 2 8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bell = [
  ["path", { d: "M10.268 21a2 2 0 0 0 3.464 0" }],
  [
    "path",
    {
      d: "M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BetweenHorizontalEnd = [
  ["rect", { width: "13", height: "7", x: "3", y: "3", rx: "1" }],
  ["path", { d: "m22 15-3-3 3-3" }],
  ["rect", { width: "13", height: "7", x: "3", y: "14", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BetweenHorizontalStart = [
  ["rect", { width: "13", height: "7", x: "8", y: "3", rx: "1" }],
  ["path", { d: "m2 9 3 3-3 3" }],
  ["rect", { width: "13", height: "7", x: "8", y: "14", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BetweenVerticalEnd = [
  ["rect", { width: "7", height: "13", x: "3", y: "3", rx: "1" }],
  ["path", { d: "m9 22 3-3 3 3" }],
  ["rect", { width: "7", height: "13", x: "14", y: "3", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BetweenVerticalStart = [
  ["rect", { width: "7", height: "13", x: "3", y: "8", rx: "1" }],
  ["path", { d: "m15 2-3 3-3-3" }],
  ["rect", { width: "7", height: "13", x: "14", y: "8", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BicepsFlexed = [
  [
    "path",
    {
      d: "M12.409 13.017A5 5 0 0 1 22 15c0 3.866-4 7-9 7-4.077 0-8.153-.82-10.371-2.462-.426-.316-.631-.832-.62-1.362C2.118 12.723 2.627 2 10 2a3 3 0 0 1 3 3 2 2 0 0 1-2 2c-1.105 0-1.64-.444-2-1"
    }
  ],
  ["path", { d: "M15 14a5 5 0 0 0-7.584 2" }],
  ["path", { d: "M9.964 6.825C8.019 7.977 9.5 13 8 15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Binary = [
  ["rect", { x: "14", y: "14", width: "4", height: "6", rx: "2" }],
  ["rect", { x: "6", y: "4", width: "4", height: "6", rx: "2" }],
  ["path", { d: "M6 20h4" }],
  ["path", { d: "M14 10h4" }],
  ["path", { d: "M6 14h2v6" }],
  ["path", { d: "M14 4h2v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bike = [
  ["circle", { cx: "18.5", cy: "17.5", r: "3.5" }],
  ["circle", { cx: "5.5", cy: "17.5", r: "3.5" }],
  ["circle", { cx: "15", cy: "5", r: "1" }],
  ["path", { d: "M12 17.5V14l-3-3 4-3 2 3h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Binoculars = [
  ["path", { d: "M10 10h4" }],
  ["path", { d: "M19 7V4a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3" }],
  [
    "path",
    {
      d: "M20 21a2 2 0 0 0 2-2v-3.851c0-1.39-2-2.962-2-4.829V8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v11a2 2 0 0 0 2 2z"
    }
  ],
  ["path", { d: "M 22 16 L 2 16" }],
  [
    "path",
    {
      d: "M4 21a2 2 0 0 1-2-2v-3.851c0-1.39 2-2.962 2-4.829V8a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11a2 2 0 0 1-2 2z"
    }
  ],
  ["path", { d: "M9 7V4a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Biohazard = [
  ["circle", { cx: "12", cy: "11.9", r: "2" }],
  ["path", { d: "M6.7 3.4c-.9 2.5 0 5.2 2.2 6.7C6.5 9 3.7 9.6 2 11.6" }],
  ["path", { d: "m8.9 10.1 1.4.8" }],
  ["path", { d: "M17.3 3.4c.9 2.5 0 5.2-2.2 6.7 2.4-1.2 5.2-.6 6.9 1.5" }],
  ["path", { d: "m15.1 10.1-1.4.8" }],
  ["path", { d: "M16.7 20.8c-2.6-.4-4.6-2.6-4.7-5.3-.2 2.6-2.1 4.8-4.7 5.2" }],
  ["path", { d: "M12 13.9v1.6" }],
  ["path", { d: "M13.5 5.4c-1-.2-2-.2-3 0" }],
  ["path", { d: "M17 16.4c.7-.7 1.2-1.6 1.5-2.5" }],
  ["path", { d: "M5.5 13.9c.3.9.8 1.8 1.5 2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bird = [
  ["path", { d: "M16 7h.01" }],
  ["path", { d: "M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" }],
  ["path", { d: "m20 7 2 .5-2 .5" }],
  ["path", { d: "M10 18v3" }],
  ["path", { d: "M14 17.75V21" }],
  ["path", { d: "M7 18a6 6 0 0 0 3.84-10.61" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Blend = [
  ["circle", { cx: "9", cy: "9", r: "7" }],
  ["circle", { cx: "15", cy: "15", r: "7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bitcoin = [
  [
    "path",
    {
      d: "M11.767 19.089c4.924.868 6.14-6.025 1.216-6.894m-1.216 6.894L5.86 18.047m5.908 1.042-.347 1.97m1.563-8.864c4.924.869 6.14-6.025 1.215-6.893m-1.215 6.893-3.94-.694m5.155-6.2L8.29 4.26m5.908 1.042.348-1.97M7.48 20.364l3.126-17.727"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Blinds = [
  ["path", { d: "M3 3h18" }],
  ["path", { d: "M20 7H8" }],
  ["path", { d: "M20 11H8" }],
  ["path", { d: "M10 19h10" }],
  ["path", { d: "M8 15h12" }],
  ["path", { d: "M4 3v14" }],
  ["circle", { cx: "4", cy: "19", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Blocks = [
  [
    "path",
    {
      d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2"
    }
  ],
  ["rect", { x: "14", y: "2", width: "8", height: "8", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BluetoothConnected = [
  ["path", { d: "m7 7 10 10-5 5V2l5 5L7 17" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "12" }],
  ["line", { x1: "3", x2: "6", y1: "12", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BluetoothOff = [
  ["path", { d: "m17 17-5 5V12l-5 5" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M14.5 9.5 17 7l-5-5v4.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BluetoothSearching = [
  ["path", { d: "m7 7 10 10-5 5V2l5 5L7 17" }],
  ["path", { d: "M20.83 14.83a4 4 0 0 0 0-5.66" }],
  ["path", { d: "M18 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bold = [
  ["path", { d: "M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bluetooth = [["path", { d: "m7 7 10 10-5 5V2l5 5L7 17" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bolt = [
  [
    "path",
    {
      d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bomb = [
  ["circle", { cx: "11", cy: "13", r: "9" }],
  [
    "path",
    { d: "M14.35 4.65 16.3 2.7a2.41 2.41 0 0 1 3.4 0l1.6 1.6a2.4 2.4 0 0 1 0 3.4l-1.95 1.95" }
  ],
  ["path", { d: "m22 2-1.5 1.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bone = [
  [
    "path",
    {
      d: "M17 10c.7-.7 1.69 0 2.5 0a2.5 2.5 0 1 0 0-5 .5.5 0 0 1-.5-.5 2.5 2.5 0 1 0-5 0c0 .81.7 1.8 0 2.5l-7 7c-.7.7-1.69 0-2.5 0a2.5 2.5 0 0 0 0 5c.28 0 .5.22.5.5a2.5 2.5 0 1 0 5 0c0-.81-.7-1.8 0-2.5Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookA = [
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "m8 13 4-7 4 7" }],
  ["path", { d: "M9.1 11h5.7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookAlert = [
  ["path", { d: "M12 13h.01" }],
  ["path", { d: "M12 6v3" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookAudio = [
  ["path", { d: "M12 6v7" }],
  ["path", { d: "M16 8v3" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "M8 8v3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookCheck = [
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "m9 9.5 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookCopy = [
  ["path", { d: "M2 16V4a2 2 0 0 1 2-2h11" }],
  [
    "path",
    { d: "M22 18H11a2 2 0 1 0 0 4h10.5a.5.5 0 0 0 .5-.5v-15a.5.5 0 0 0-.5-.5H11a2 2 0 0 0-2 2v12" }
  ],
  ["path", { d: "M5 14H4a2 2 0 1 0 0 4h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookDown = [
  ["path", { d: "M12 13V7" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "m9 10 3 3 3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookDashed = [
  ["path", { d: "M12 17h1.5" }],
  ["path", { d: "M12 22h1.5" }],
  ["path", { d: "M12 2h1.5" }],
  ["path", { d: "M17.5 22H19a1 1 0 0 0 1-1" }],
  ["path", { d: "M17.5 2H19a1 1 0 0 1 1 1v1.5" }],
  ["path", { d: "M20 14v3h-2.5" }],
  ["path", { d: "M20 8.5V10" }],
  ["path", { d: "M4 10V8.5" }],
  ["path", { d: "M4 19.5V14" }],
  ["path", { d: "M4 4.5A2.5 2.5 0 0 1 6.5 2H8" }],
  ["path", { d: "M8 22H6.5a1 1 0 0 1 0-5H8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookHeadphones = [
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "M8 12v-2a4 4 0 0 1 8 0v2" }],
  ["circle", { cx: "15", cy: "12", r: "1" }],
  ["circle", { cx: "9", cy: "12", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookHeart = [
  [
    "path",
    {
      d: "M16 8.2A2.22 2.22 0 0 0 13.8 6c-.8 0-1.4.3-1.8.9-.4-.6-1-.9-1.8-.9A2.22 2.22 0 0 0 8 8.2c0 .6.3 1.2.7 1.6A226.652 226.652 0 0 0 12 13a404 404 0 0 0 3.3-3.1 2.413 2.413 0 0 0 .7-1.7"
    }
  ],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookImage = [
  ["path", { d: "m20 13.7-2.1-2.1a2 2 0 0 0-2.8 0L9.7 17" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["circle", { cx: "10", cy: "8", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookKey = [
  ["path", { d: "m19 3 1 1" }],
  ["path", { d: "m20 2-4.5 4.5" }],
  ["path", { d: "M20 7.898V21a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }],
  ["path", { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2h7.844" }],
  ["circle", { cx: "14", cy: "8", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookLock = [
  ["path", { d: "M18 6V4a2 2 0 1 0-4 0v2" }],
  ["path", { d: "M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }],
  ["path", { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10" }],
  ["rect", { x: "12", y: "6", width: "8", height: "5", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookMarked = [
  ["path", { d: "M10 2v8l3-3 3 3V2" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookMinus = [
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "M9 10h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookOpenText = [
  ["path", { d: "M12 7v14" }],
  ["path", { d: "M16 12h2" }],
  ["path", { d: "M16 8h2" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
    }
  ],
  ["path", { d: "M6 12h2" }],
  ["path", { d: "M6 8h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookOpenCheck = [
  ["path", { d: "M12 21V7" }],
  ["path", { d: "m16 12 2 2 4-4" }],
  [
    "path",
    {
      d: "M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookOpen = [
  ["path", { d: "M12 7v14" }],
  [
    "path",
    {
      d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookPlus = [
  ["path", { d: "M12 7v6" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "M9 10h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookText = [
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "M8 11h8" }],
  ["path", { d: "M8 7h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookType = [
  ["path", { d: "M10 13h4" }],
  ["path", { d: "M12 6v7" }],
  ["path", { d: "M16 8V6H8v2" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookUp2 = [
  ["path", { d: "M12 13V7" }],
  ["path", { d: "M18 2h1a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }],
  ["path", { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2" }],
  ["path", { d: "m9 10 3-3 3 3" }],
  ["path", { d: "m9 5 3-3 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookUser = [
  ["path", { d: "M15 13a3 3 0 1 0-6 0" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["circle", { cx: "12", cy: "8", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookUp = [
  ["path", { d: "M12 13V7" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "m9 10 3-3 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookX = [
  ["path", { d: "m14.5 7-5 5" }],
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ],
  ["path", { d: "m9.5 7 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Book = [
  [
    "path",
    { d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookmarkCheck = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" }],
  ["path", { d: "m9 10 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookmarkMinus = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" }],
  ["line", { x1: "15", x2: "9", y1: "10", y2: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookmarkPlus = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" }],
  ["line", { x1: "12", x2: "12", y1: "7", y2: "13" }],
  ["line", { x1: "15", x2: "9", y1: "10", y2: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BookmarkX = [
  ["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" }],
  ["path", { d: "m14.5 7.5-5 5" }],
  ["path", { d: "m9.5 7.5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bookmark = [["path", { d: "m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BoomBox = [
  ["path", { d: "M4 9V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v4" }],
  ["path", { d: "M8 8v1" }],
  ["path", { d: "M12 8v1" }],
  ["path", { d: "M16 8v1" }],
  ["rect", { width: "20", height: "12", x: "2", y: "9", rx: "2" }],
  ["circle", { cx: "8", cy: "15", r: "2" }],
  ["circle", { cx: "16", cy: "15", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BotOff = [
  ["path", { d: "M13.67 8H18a2 2 0 0 1 2 2v4.33" }],
  ["path", { d: "M2 14h2" }],
  ["path", { d: "M20 14h2" }],
  ["path", { d: "M22 22 2 2" }],
  ["path", { d: "M8 8H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 1.414-.586" }],
  ["path", { d: "M9 13v2" }],
  ["path", { d: "M9.67 4H12v2.33" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bot = [
  ["path", { d: "M12 8V4H8" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2" }],
  ["path", { d: "M2 14h2" }],
  ["path", { d: "M20 14h2" }],
  ["path", { d: "M15 13v2" }],
  ["path", { d: "M9 13v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BotMessageSquare = [
  ["path", { d: "M12 6V2H8" }],
  ["path", { d: "m8 18-4 4V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2Z" }],
  ["path", { d: "M2 12h2" }],
  ["path", { d: "M9 11v2" }],
  ["path", { d: "M15 11v2" }],
  ["path", { d: "M20 12h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BottleWine = [
  [
    "path",
    {
      d: "M10 3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2a6 6 0 0 0 1.2 3.6l.6.8A6 6 0 0 1 17 13v8a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-8a6 6 0 0 1 1.2-3.6l.6-.8A6 6 0 0 0 10 5z"
    }
  ],
  ["path", { d: "M17 13h-4a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BowArrow = [
  ["path", { d: "M17 3h4v4" }],
  ["path", { d: "M18.575 11.082a13 13 0 0 1 1.048 9.027 1.17 1.17 0 0 1-1.914.597L14 17" }],
  ["path", { d: "M7 10 3.29 6.29a1.17 1.17 0 0 1 .6-1.91 13 13 0 0 1 9.03 1.05" }],
  [
    "path",
    {
      d: "M7 14a1.7 1.7 0 0 0-1.207.5l-2.646 2.646A.5.5 0 0 0 3.5 18H5a1 1 0 0 1 1 1v1.5a.5.5 0 0 0 .854.354L9.5 18.207A1.7 1.7 0 0 0 10 17v-2a1 1 0 0 0-1-1z"
    }
  ],
  ["path", { d: "M9.707 14.293 21 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Box = [
  [
    "path",
    {
      d: "M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
    }
  ],
  ["path", { d: "m3.3 7 8.7 5 8.7-5" }],
  ["path", { d: "M12 22V12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Boxes = [
  [
    "path",
    {
      d: "M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"
    }
  ],
  ["path", { d: "m7 16.5-4.74-2.85" }],
  ["path", { d: "m7 16.5 5-3" }],
  ["path", { d: "M7 16.5v5.17" }],
  [
    "path",
    {
      d: "M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"
    }
  ],
  ["path", { d: "m17 16.5-5-3" }],
  ["path", { d: "m17 16.5 4.74-2.85" }],
  ["path", { d: "M17 16.5v5.17" }],
  [
    "path",
    {
      d: "M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"
    }
  ],
  ["path", { d: "M12 8 7.26 5.15" }],
  ["path", { d: "m12 8 4.74-2.85" }],
  ["path", { d: "M12 13.5V8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Braces = [
  ["path", { d: "M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1" }],
  ["path", { d: "M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Brackets = [
  ["path", { d: "M16 3h3a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-3" }],
  ["path", { d: "M8 21H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BrainCircuit = [
  [
    "path",
    { d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }
  ],
  ["path", { d: "M9 13a4.5 4.5 0 0 0 3-4" }],
  ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5" }],
  ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396" }],
  ["path", { d: "M6 18a4 4 0 0 1-1.967-.516" }],
  ["path", { d: "M12 13h4" }],
  ["path", { d: "M12 18h6a2 2 0 0 1 2 2v1" }],
  ["path", { d: "M12 8h8" }],
  ["path", { d: "M16 8V5a2 2 0 0 1 2-2" }],
  ["circle", { cx: "16", cy: "13", r: ".5" }],
  ["circle", { cx: "18", cy: "3", r: ".5" }],
  ["circle", { cx: "20", cy: "21", r: ".5" }],
  ["circle", { cx: "20", cy: "8", r: ".5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BrainCog = [
  ["path", { d: "m10.852 14.772-.383.923" }],
  ["path", { d: "m10.852 9.228-.383-.923" }],
  ["path", { d: "m13.148 14.772.382.924" }],
  ["path", { d: "m13.531 8.305-.383.923" }],
  ["path", { d: "m14.772 10.852.923-.383" }],
  ["path", { d: "m14.772 13.148.923.383" }],
  [
    "path",
    {
      d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 0 0-5.63-1.446 3 3 0 0 0-.368 1.571 4 4 0 0 0-2.525 5.771"
    }
  ],
  ["path", { d: "M17.998 5.125a4 4 0 0 1 2.525 5.771" }],
  ["path", { d: "M19.505 10.294a4 4 0 0 1-1.5 7.706" }],
  [
    "path",
    { d: "M4.032 17.483A4 4 0 0 0 11.464 20c.18-.311.892-.311 1.072 0a4 4 0 0 0 7.432-2.516" }
  ],
  ["path", { d: "M4.5 10.291A4 4 0 0 0 6 18" }],
  ["path", { d: "M6.002 5.125a3 3 0 0 0 .4 1.375" }],
  ["path", { d: "m9.228 10.852-.923-.383" }],
  ["path", { d: "m9.228 13.148-.923.383" }],
  ["circle", { cx: "12", cy: "12", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Brain = [
  [
    "path",
    { d: "M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" }
  ],
  [
    "path",
    { d: "M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" }
  ],
  ["path", { d: "M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" }],
  ["path", { d: "M17.599 6.5a3 3 0 0 0 .399-1.375" }],
  ["path", { d: "M6.003 5.125A3 3 0 0 0 6.401 6.5" }],
  ["path", { d: "M3.477 10.896a4 4 0 0 1 .585-.396" }],
  ["path", { d: "M19.938 10.5a4 4 0 0 1 .585.396" }],
  ["path", { d: "M6 18a4 4 0 0 1-1.967-.516" }],
  ["path", { d: "M19.967 17.484A4 4 0 0 1 18 18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BrickWallFire = [
  ["path", { d: "M16 3v2.107" }],
  [
    "path",
    {
      d: "M17 9c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 22 17a5 5 0 0 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C13 11.5 16 9 17 9"
    }
  ],
  ["path", { d: "M21 8.274V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.938" }],
  ["path", { d: "M3 15h5.253" }],
  ["path", { d: "M3 9h8.228" }],
  ["path", { d: "M8 15v6" }],
  ["path", { d: "M8 3v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BrickWall = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M12 9v6" }],
  ["path", { d: "M16 15v6" }],
  ["path", { d: "M16 3v6" }],
  ["path", { d: "M3 15h18" }],
  ["path", { d: "M3 9h18" }],
  ["path", { d: "M8 15v6" }],
  ["path", { d: "M8 3v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BriefcaseBusiness = [
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" }],
  ["path", { d: "M22 13a18.15 18.15 0 0 1-20 0" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BriefcaseConveyorBelt = [
  ["path", { d: "M10 20v2" }],
  ["path", { d: "M14 20v2" }],
  ["path", { d: "M18 20v2" }],
  ["path", { d: "M21 20H3" }],
  ["path", { d: "M6 20v2" }],
  ["path", { d: "M8 16V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v12" }],
  ["rect", { x: "4", y: "6", width: "16", height: "10", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BriefcaseMedical = [
  ["path", { d: "M12 11v4" }],
  ["path", { d: "M14 13h-4" }],
  ["path", { d: "M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" }],
  ["path", { d: "M18 6v14" }],
  ["path", { d: "M6 6v14" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Briefcase = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BringToFront = [
  ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "2" }],
  ["path", { d: "M4 10a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2" }],
  ["path", { d: "M14 20a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BrushCleaning = [
  ["path", { d: "m16 22-1-4" }],
  [
    "path",
    {
      d: "M19 13.99a1 1 0 0 0 1-1V12a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v.99a1 1 0 0 0 1 1"
    }
  ],
  ["path", { d: "M5 14h14l1.973 6.767A1 1 0 0 1 20 22H4a1 1 0 0 1-.973-1.233z" }],
  ["path", { d: "m8 22 1-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Brush = [
  ["path", { d: "m11 10 3 3" }],
  ["path", { d: "M6.5 21A3.5 3.5 0 1 0 3 17.5a2.62 2.62 0 0 1-.708 1.792A1 1 0 0 0 3 21z" }],
  ["path", { d: "M9.969 17.031 21.378 5.624a1 1 0 0 0-3.002-3.002L6.967 14.031" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bubbles = [
  ["path", { d: "M7.2 14.8a2 2 0 0 1 2 2" }],
  ["circle", { cx: "18.5", cy: "8.5", r: "3.5" }],
  ["circle", { cx: "7.5", cy: "16.5", r: "5.5" }],
  ["circle", { cx: "7.5", cy: "4.5", r: "2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BugOff = [
  ["path", { d: "M15 7.13V6a3 3 0 0 0-5.14-2.1L8 2" }],
  ["path", { d: "M14.12 3.88 16 2" }],
  ["path", { d: "M22 13h-4v-2a4 4 0 0 0-4-4h-1.3" }],
  ["path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M7.7 7.7A4 4 0 0 0 6 11v3a6 6 0 0 0 11.13 3.13" }],
  ["path", { d: "M12 20v-8" }],
  ["path", { d: "M6 13H2" }],
  ["path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BugPlay = [
  [
    "path",
    {
      d: "M12.765 21.522a.5.5 0 0 1-.765-.424v-8.196a.5.5 0 0 1 .765-.424l5.878 3.674a1 1 0 0 1 0 1.696z"
    }
  ],
  ["path", { d: "M14.12 3.88 16 2" }],
  ["path", { d: "M18 11a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4v3a6.1 6.1 0 0 0 2 4.5" }],
  ["path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4" }],
  ["path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4" }],
  ["path", { d: "M6 13H2" }],
  ["path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5" }],
  ["path", { d: "m8 2 1.88 1.88" }],
  ["path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bug = [
  ["path", { d: "m8 2 1.88 1.88" }],
  ["path", { d: "M14.12 3.88 16 2" }],
  ["path", { d: "M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" }],
  ["path", { d: "M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" }],
  ["path", { d: "M12 20v-9" }],
  ["path", { d: "M6.53 9C4.6 8.8 3 7.1 3 5" }],
  ["path", { d: "M6 13H2" }],
  ["path", { d: "M3 21c0-2.1 1.7-3.9 3.8-4" }],
  ["path", { d: "M20.97 5c0 2.1-1.6 3.8-3.5 4" }],
  ["path", { d: "M22 13h-4" }],
  ["path", { d: "M17.2 17c2.1.1 3.8 1.9 3.8 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Building2 = [
  ["path", { d: "M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" }],
  ["path", { d: "M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M10 6h4" }],
  ["path", { d: "M10 10h4" }],
  ["path", { d: "M10 14h4" }],
  ["path", { d: "M10 18h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Building = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", ry: "2" }],
  ["path", { d: "M9 22v-4h6v4" }],
  ["path", { d: "M8 6h.01" }],
  ["path", { d: "M16 6h.01" }],
  ["path", { d: "M12 6h.01" }],
  ["path", { d: "M12 10h.01" }],
  ["path", { d: "M12 14h.01" }],
  ["path", { d: "M16 10h.01" }],
  ["path", { d: "M16 14h.01" }],
  ["path", { d: "M8 10h.01" }],
  ["path", { d: "M8 14h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const BusFront = [
  ["path", { d: "M4 6 2 7" }],
  ["path", { d: "M10 6h4" }],
  ["path", { d: "m22 7-2-1" }],
  ["rect", { width: "16", height: "16", x: "4", y: "3", rx: "2" }],
  ["path", { d: "M4 11h16" }],
  ["path", { d: "M8 15h.01" }],
  ["path", { d: "M16 15h.01" }],
  ["path", { d: "M6 19v2" }],
  ["path", { d: "M18 21v-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Bus = [
  ["path", { d: "M8 6v6" }],
  ["path", { d: "M15 6v6" }],
  ["path", { d: "M2 12h19.6" }],
  [
    "path",
    {
      d: "M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3"
    }
  ],
  ["circle", { cx: "7", cy: "18", r: "2" }],
  ["path", { d: "M9 18h5" }],
  ["circle", { cx: "16", cy: "18", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CableCar = [
  ["path", { d: "M10 3h.01" }],
  ["path", { d: "M14 2h.01" }],
  ["path", { d: "m2 9 20-5" }],
  ["path", { d: "M12 12V6.5" }],
  ["rect", { width: "16", height: "10", x: "4", y: "12", rx: "3" }],
  ["path", { d: "M9 12v5" }],
  ["path", { d: "M15 12v5" }],
  ["path", { d: "M4 17h16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cable = [
  ["path", { d: "M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1" }],
  ["path", { d: "M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9" }],
  ["path", { d: "M21 21v-2h-4" }],
  ["path", { d: "M3 5h4V3" }],
  ["path", { d: "M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CakeSlice = [
  ["circle", { cx: "9", cy: "7", r: "2" }],
  ["path", { d: "M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6" }],
  ["path", { d: "M16 13H3" }],
  ["path", { d: "M16 17H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cake = [
  ["path", { d: "M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" }],
  ["path", { d: "M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" }],
  ["path", { d: "M2 21h20" }],
  ["path", { d: "M7 8v3" }],
  ["path", { d: "M12 8v3" }],
  ["path", { d: "M17 8v3" }],
  ["path", { d: "M7 4h.01" }],
  ["path", { d: "M12 4h.01" }],
  ["path", { d: "M17 4h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Calculator = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
  ["line", { x1: "8", x2: "16", y1: "6", y2: "6" }],
  ["line", { x1: "16", x2: "16", y1: "14", y2: "18" }],
  ["path", { d: "M16 10h.01" }],
  ["path", { d: "M12 10h.01" }],
  ["path", { d: "M8 10h.01" }],
  ["path", { d: "M12 14h.01" }],
  ["path", { d: "M8 14h.01" }],
  ["path", { d: "M12 18h.01" }],
  ["path", { d: "M8 18h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Calendar1 = [
  ["path", { d: "M11 14h1v4" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M8 2v4" }],
  ["rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarArrowDown = [
  ["path", { d: "m14 18 4 4 4-4" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M18 14v8" }],
  ["path", { d: "M21 11.354V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.343" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M8 2v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarArrowUp = [
  ["path", { d: "m14 18 4-4 4 4" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M18 22v-8" }],
  ["path", { d: "M21 11.343V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h9" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M8 2v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarCheck2 = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M21 14V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "m16 20 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarCheck = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "m9 16 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarClock = [
  ["path", { d: "M16 14v2.2l1.6 1" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" }],
  ["path", { d: "M3 10h5" }],
  ["path", { d: "M8 2v4" }],
  ["circle", { cx: "16", cy: "16", r: "6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarCog = [
  ["path", { d: "m15.228 16.852-.923-.383" }],
  ["path", { d: "m15.228 19.148-.923.383" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "m16.47 14.305.382.923" }],
  ["path", { d: "m16.852 20.772-.383.924" }],
  ["path", { d: "m19.148 15.228.383-.923" }],
  ["path", { d: "m19.53 21.696-.382-.924" }],
  ["path", { d: "m20.772 16.852.924-.383" }],
  ["path", { d: "m20.772 19.148.924.383" }],
  ["path", { d: "M21 11V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M8 2v4" }],
  ["circle", { cx: "18", cy: "18", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarDays = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M8 14h.01" }],
  ["path", { d: "M12 14h.01" }],
  ["path", { d: "M16 14h.01" }],
  ["path", { d: "M8 18h.01" }],
  ["path", { d: "M12 18h.01" }],
  ["path", { d: "M16 18h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarMinus2 = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M10 16h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarFold = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M21 17V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11Z" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M15 22v-4a2 2 0 0 1 2-2h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarHeart = [
  ["path", { d: "M3 10h18V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7" }],
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  [
    "path",
    {
      d: "M21.29 14.7a2.43 2.43 0 0 0-2.65-.52c-.3.12-.57.3-.8.53l-.34.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L17.5 22l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarMinus = [
  ["path", { d: "M16 19h6" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M21 15V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M8 2v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarOff = [
  ["path", { d: "M4.2 4.2A2 2 0 0 0 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 1.82-1.18" }],
  ["path", { d: "M21 15.5V6a2 2 0 0 0-2-2H9.5" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M3 10h7" }],
  ["path", { d: "M21 10h-5.5" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarPlus2 = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M10 16h4" }],
  ["path", { d: "M12 14v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarPlus = [
  ["path", { d: "M16 19h6" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M19 16v6" }],
  ["path", { d: "M21 12.598V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8.5" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M8 2v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarRange = [
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M17 14h-6" }],
  ["path", { d: "M13 18H7" }],
  ["path", { d: "M7 14h.01" }],
  ["path", { d: "M17 18h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarSearch = [
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25" }],
  ["path", { d: "m22 22-1.875-1.875" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "M8 2v4" }],
  ["circle", { cx: "18", cy: "18", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarSync = [
  ["path", { d: "M11 10v4h4" }],
  ["path", { d: "m11 14 1.535-1.605a5 5 0 0 1 8 1.5" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "m21 18-1.535 1.605a5 5 0 0 1-8-1.5" }],
  ["path", { d: "M21 22v-4h-4" }],
  ["path", { d: "M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3" }],
  ["path", { d: "M3 10h4" }],
  ["path", { d: "M8 2v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarX2 = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "m17 22 5-5" }],
  ["path", { d: "m17 17 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CalendarX = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
  ["path", { d: "M3 10h18" }],
  ["path", { d: "m14 14-4 4" }],
  ["path", { d: "m10 14 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Calendar = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2" }],
  ["path", { d: "M3 10h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CameraOff = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
  ["path", { d: "M7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16" }],
  ["path", { d: "M9.5 4h5L17 7h3a2 2 0 0 1 2 2v7.5" }],
  ["path", { d: "M14.121 15.121A3 3 0 1 1 9.88 10.88" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Camera = [
  [
    "path",
    {
      d: "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CandyCane = [
  [
    "path",
    { d: "M5.7 21a2 2 0 0 1-3.5-2l8.6-14a6 6 0 0 1 10.4 6 2 2 0 1 1-3.464-2 2 2 0 1 0-3.464-2Z" }
  ],
  ["path", { d: "M17.75 7 15 2.1" }],
  ["path", { d: "M10.9 4.8 13 9" }],
  ["path", { d: "m7.9 9.7 2 4.4" }],
  ["path", { d: "M4.9 14.7 7 18.9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CandyOff = [
  ["path", { d: "M10 10v7.9" }],
  ["path", { d: "M11.802 6.145a5 5 0 0 1 6.053 6.053" }],
  ["path", { d: "M14 6.1v2.243" }],
  ["path", { d: "m15.5 15.571-.964.964a5 5 0 0 1-7.071 0 5 5 0 0 1 0-7.07l.964-.965" }],
  [
    "path",
    {
      d: "M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4"
    }
  ],
  ["path", { d: "m2 2 20 20" }],
  [
    "path",
    {
      d: "M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Candy = [
  ["path", { d: "M10 7v10.9" }],
  ["path", { d: "M14 6.1V17" }],
  [
    "path",
    {
      d: "M16 7V3a1 1 0 0 1 1.707-.707 2.5 2.5 0 0 0 2.152.717 1 1 0 0 1 1.131 1.131 2.5 2.5 0 0 0 .717 2.152A1 1 0 0 1 21 8h-4"
    }
  ],
  [
    "path",
    {
      d: "M16.536 7.465a5 5 0 0 0-7.072 0l-2 2a5 5 0 0 0 0 7.07 5 5 0 0 0 7.072 0l2-2a5 5 0 0 0 0-7.07"
    }
  ],
  [
    "path",
    {
      d: "M8 17v4a1 1 0 0 1-1.707.707 2.5 2.5 0 0 0-2.152-.717 1 1 0 0 1-1.131-1.131 2.5 2.5 0 0 0-.717-2.152A1 1 0 0 1 3 16h4"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cannabis = [
  ["path", { d: "M12 22v-4" }],
  [
    "path",
    {
      d: "M7 12c-1.5 0-4.5 1.5-5 3 3.5 1.5 6 1 6 1-1.5 1.5-2 3.5-2 5 2.5 0 4.5-1.5 6-3 1.5 1.5 3.5 3 6 3 0-1.5-.5-3.5-2-5 0 0 2.5.5 6-1-.5-1.5-3.5-3-5-3 1.5-1 4-4 4-6-2.5 0-5.5 1.5-7 3 0-2.5-.5-5-2-7-1.5 2-2 4.5-2 7-1.5-1.5-4.5-3-7-3 0 2 2.5 5 4 6"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CaptionsOff = [
  ["path", { d: "M10.5 5H19a2 2 0 0 1 2 2v8.5" }],
  ["path", { d: "M17 11h-.5" }],
  ["path", { d: "M19 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M7 11h4" }],
  ["path", { d: "M7 15h2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Captions = [
  ["rect", { width: "18", height: "14", x: "3", y: "5", rx: "2", ry: "2" }],
  ["path", { d: "M7 15h4M15 15h2M7 11h2M13 11h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CarFront = [
  ["path", { d: "m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" }],
  ["path", { d: "M7 14h.01" }],
  ["path", { d: "M17 14h.01" }],
  ["rect", { width: "18", height: "8", x: "3", y: "10", rx: "2" }],
  ["path", { d: "M5 18v2" }],
  ["path", { d: "M19 18v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CarTaxiFront = [
  ["path", { d: "M10 2h4" }],
  ["path", { d: "m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8" }],
  ["path", { d: "M7 14h.01" }],
  ["path", { d: "M17 14h.01" }],
  ["rect", { width: "18", height: "8", x: "3", y: "10", rx: "2" }],
  ["path", { d: "M5 18v2" }],
  ["path", { d: "M19 18v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Car = [
  [
    "path",
    {
      d: "M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"
    }
  ],
  ["circle", { cx: "7", cy: "17", r: "2" }],
  ["path", { d: "M9 17h6" }],
  ["circle", { cx: "17", cy: "17", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Caravan = [
  ["path", { d: "M18 19V9a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v8a2 2 0 0 0 2 2h2" }],
  ["path", { d: "M2 9h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H2" }],
  ["path", { d: "M22 17v1a1 1 0 0 1-1 1H10v-9a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v9" }],
  ["circle", { cx: "8", cy: "19", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CardSim = [
  ["path", { d: "M12 14v4" }],
  [
    "path",
    {
      d: "M14.172 2a2 2 0 0 1 1.414.586l3.828 3.828A2 2 0 0 1 20 7.828V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"
    }
  ],
  ["path", { d: "M8 14h8" }],
  ["rect", { x: "8", y: "10", width: "8", height: "8", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Carrot = [
  [
    "path",
    {
      d: "M2.27 21.7s9.87-3.5 12.73-6.36a4.5 4.5 0 0 0-6.36-6.37C5.77 11.84 2.27 21.7 2.27 21.7zM8.64 14l-2.05-2.04M15.34 15l-2.46-2.46"
    }
  ],
  ["path", { d: "M22 9s-1.33-2-3.5-2C16.86 7 15 9 15 9s1.33 2 3.5 2S22 9 22 9z" }],
  ["path", { d: "M15 2s-2 1.33-2 3.5S15 9 15 9s2-1.84 2-3.5C17 3.33 15 2 15 2z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CaseLower = [
  ["circle", { cx: "7", cy: "12", r: "3" }],
  ["path", { d: "M10 9v6" }],
  ["circle", { cx: "17", cy: "12", r: "3" }],
  ["path", { d: "M14 7v8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CaseSensitive = [
  ["path", { d: "m3 15 4-8 4 8" }],
  ["path", { d: "M4 13h6" }],
  ["circle", { cx: "18", cy: "12", r: "3" }],
  ["path", { d: "M21 9v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CaseUpper = [
  ["path", { d: "m3 15 4-8 4 8" }],
  ["path", { d: "M4 13h6" }],
  ["path", { d: "M15 11h4.5a2 2 0 0 1 0 4H15V7h4a2 2 0 0 1 0 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CassetteTape = [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
  ["circle", { cx: "8", cy: "10", r: "2" }],
  ["path", { d: "M8 12h8" }],
  ["circle", { cx: "16", cy: "10", r: "2" }],
  ["path", { d: "m6 20 .7-2.9A1.4 1.4 0 0 1 8.1 16h7.8a1.4 1.4 0 0 1 1.4 1l.7 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cast = [
  ["path", { d: "M2 8V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-6" }],
  ["path", { d: "M2 12a9 9 0 0 1 8 8" }],
  ["path", { d: "M2 16a5 5 0 0 1 4 4" }],
  ["line", { x1: "2", x2: "2.01", y1: "20", y2: "20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Castle = [
  ["path", { d: "M22 20v-9H2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2Z" }],
  ["path", { d: "M18 11V4H6v7" }],
  ["path", { d: "M15 22v-4a3 3 0 0 0-3-3a3 3 0 0 0-3 3v4" }],
  ["path", { d: "M22 11V9" }],
  ["path", { d: "M2 11V9" }],
  ["path", { d: "M6 4V2" }],
  ["path", { d: "M18 4V2" }],
  ["path", { d: "M10 4V2" }],
  ["path", { d: "M14 4V2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cat = [
  [
    "path",
    {
      d: "M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"
    }
  ],
  ["path", { d: "M8 14v.5" }],
  ["path", { d: "M16 14v.5" }],
  ["path", { d: "M11.25 16.25h1.5L12 17l-.75-.75Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartArea = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  [
    "path",
    {
      d: "M7 11.207a.5.5 0 0 1 .146-.353l2-2a.5.5 0 0 1 .708 0l3.292 3.292a.5.5 0 0 0 .708 0l4.292-4.292a.5.5 0 0 1 .854.353V16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cctv = [
  [
    "path",
    { d: "M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97" }
  ],
  [
    "path",
    {
      d: "M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z"
    }
  ],
  ["path", { d: "M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15" }],
  ["path", { d: "M2 21v-4" }],
  ["path", { d: "M7 9h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartBarBig = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["rect", { x: "7", y: "13", width: "9", height: "4", rx: "1" }],
  ["rect", { x: "7", y: "5", width: "12", height: "4", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartBarDecreasing = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["path", { d: "M7 11h8" }],
  ["path", { d: "M7 16h3" }],
  ["path", { d: "M7 6h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartBarIncreasing = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["path", { d: "M7 11h8" }],
  ["path", { d: "M7 16h12" }],
  ["path", { d: "M7 6h3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartBarStacked = [
  ["path", { d: "M11 13v4" }],
  ["path", { d: "M15 5v4" }],
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["rect", { x: "7", y: "13", width: "9", height: "4", rx: "1" }],
  ["rect", { x: "7", y: "5", width: "12", height: "4", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartBar = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["path", { d: "M7 16h8" }],
  ["path", { d: "M7 11h12" }],
  ["path", { d: "M7 6h3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartCandlestick = [
  ["path", { d: "M9 5v4" }],
  ["rect", { width: "4", height: "6", x: "7", y: "9", rx: "1" }],
  ["path", { d: "M9 15v2" }],
  ["path", { d: "M17 3v2" }],
  ["rect", { width: "4", height: "8", x: "15", y: "5", rx: "1" }],
  ["path", { d: "M17 13v3" }],
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartColumnBig = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["rect", { x: "15", y: "5", width: "4", height: "12", rx: "1" }],
  ["rect", { x: "7", y: "8", width: "4", height: "9", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartColumnDecreasing = [
  ["path", { d: "M13 17V9" }],
  ["path", { d: "M18 17v-3" }],
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["path", { d: "M8 17V5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartColumnIncreasing = [
  ["path", { d: "M13 17V9" }],
  ["path", { d: "M18 17V5" }],
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["path", { d: "M8 17v-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartColumnStacked = [
  ["path", { d: "M11 13H7" }],
  ["path", { d: "M19 9h-4" }],
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["rect", { x: "15", y: "5", width: "4", height: "12", rx: "1" }],
  ["rect", { x: "7", y: "8", width: "4", height: "9", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartColumn = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["path", { d: "M18 17V9" }],
  ["path", { d: "M13 17V5" }],
  ["path", { d: "M8 17v-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartGantt = [
  ["path", { d: "M10 6h8" }],
  ["path", { d: "M12 16h6" }],
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["path", { d: "M8 11h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartLine = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["path", { d: "m19 9-5 5-4-4-3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartNoAxesColumnDecreasing = [
  ["path", { d: "M12 20V10" }],
  ["path", { d: "M18 20v-4" }],
  ["path", { d: "M6 20V4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartNoAxesColumnIncreasing = [
  ["line", { x1: "12", x2: "12", y1: "20", y2: "10" }],
  ["line", { x1: "18", x2: "18", y1: "20", y2: "4" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartNetwork = [
  ["path", { d: "m13.11 7.664 1.78 2.672" }],
  ["path", { d: "m14.162 12.788-3.324 1.424" }],
  ["path", { d: "m20 4-6.06 1.515" }],
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["circle", { cx: "12", cy: "6", r: "2" }],
  ["circle", { cx: "16", cy: "12", r: "2" }],
  ["circle", { cx: "9", cy: "15", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartNoAxesColumn = [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "10" }],
  ["line", { x1: "12", x2: "12", y1: "20", y2: "4" }],
  ["line", { x1: "6", x2: "6", y1: "20", y2: "14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartNoAxesCombined = [
  ["path", { d: "M12 16v5" }],
  ["path", { d: "M16 14v7" }],
  ["path", { d: "M20 10v11" }],
  ["path", { d: "m22 3-8.646 8.646a.5.5 0 0 1-.708 0L9.354 8.354a.5.5 0 0 0-.707 0L2 15" }],
  ["path", { d: "M4 18v3" }],
  ["path", { d: "M8 14v7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartNoAxesGantt = [
  ["path", { d: "M8 6h10" }],
  ["path", { d: "M6 12h9" }],
  ["path", { d: "M11 18h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartPie = [
  [
    "path",
    {
      d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z"
    }
  ],
  ["path", { d: "M21.21 15.89A10 10 0 1 1 8 2.83" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartScatter = [
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "18.5", cy: "5.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "11.5", cy: "11.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "7.5", cy: "16.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "17.5", cy: "14.5", r: ".5", fill: "currentColor" }],
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChartSpline = [
  ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  ["path", { d: "M7 16c.5-2 1.5-7 4-7 2 0 2 3 4 3 2.5 0 4.5-5 5-7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CheckCheck = [
  ["path", { d: "M18 6 7 17l-5-5" }],
  ["path", { d: "m22 10-7.5 7.5L13 16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CheckLine = [
  ["path", { d: "M20 4L9 15" }],
  ["path", { d: "M21 19L3 19" }],
  ["path", { d: "M9 15L4 10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Check = [["path", { d: "M20 6 9 17l-5-5" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cherry = [
  ["path", { d: "M2 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" }],
  ["path", { d: "M12 17a5 5 0 0 0 10 0c0-2.76-2.5-5-5-3-2.5-2-5 .24-5 3Z" }],
  ["path", { d: "M7 14c3.22-2.91 4.29-8.75 5-12 1.66 2.38 4.94 9 5 12" }],
  ["path", { d: "M22 9c-4.29 0-7.14-2.33-10-7 5.71 0 10 4.67 10 7Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChefHat = [
  [
    "path",
    {
      d: "M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z"
    }
  ],
  ["path", { d: "M6 17h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronDown = [["path", { d: "m6 9 6 6 6-6" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronFirst = [
  ["path", { d: "m17 18-6-6 6-6" }],
  ["path", { d: "M7 6v12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronLeft = [["path", { d: "m15 18-6-6 6-6" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronLast = [
  ["path", { d: "m7 18 6-6-6-6" }],
  ["path", { d: "M17 6v12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronRight = [["path", { d: "m9 18 6-6-6-6" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronUp = [["path", { d: "m18 15-6-6-6 6" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronsDownUp = [
  ["path", { d: "m7 20 5-5 5 5" }],
  ["path", { d: "m7 4 5 5 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronsDown = [
  ["path", { d: "m7 6 5 5 5-5" }],
  ["path", { d: "m7 13 5 5 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronsLeftRightEllipsis = [
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M16 12h.01" }],
  ["path", { d: "m17 7 5 5-5 5" }],
  ["path", { d: "m7 7-5 5 5 5" }],
  ["path", { d: "M8 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronsLeftRight = [
  ["path", { d: "m9 7-5 5 5 5" }],
  ["path", { d: "m15 7 5 5-5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronsLeft = [
  ["path", { d: "m11 17-5-5 5-5" }],
  ["path", { d: "m18 17-5-5 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronsRightLeft = [
  ["path", { d: "m20 17-5-5 5-5" }],
  ["path", { d: "m4 17 5-5-5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronsRight = [
  ["path", { d: "m6 17 5-5-5-5" }],
  ["path", { d: "m13 17 5-5-5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronsUpDown = [
  ["path", { d: "m7 15 5 5 5-5" }],
  ["path", { d: "m7 9 5-5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ChevronsUp = [
  ["path", { d: "m17 11-5-5-5 5" }],
  ["path", { d: "m17 18-5-5-5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Chrome = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["circle", { cx: "12", cy: "12", r: "4" }],
  ["line", { x1: "21.17", x2: "12", y1: "8", y2: "8" }],
  ["line", { x1: "3.95", x2: "8.54", y1: "6.06", y2: "14" }],
  ["line", { x1: "10.88", x2: "15.46", y1: "21.94", y2: "14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Church = [
  ["path", { d: "M10 9h4" }],
  ["path", { d: "M12 7v5" }],
  ["path", { d: "M14 22v-4a2 2 0 0 0-4 0v4" }],
  [
    "path",
    {
      d: "M18 22V5.618a1 1 0 0 0-.553-.894l-4.553-2.277a2 2 0 0 0-1.788 0L6.553 4.724A1 1 0 0 0 6 5.618V22"
    }
  ],
  [
    "path",
    {
      d: "m18 7 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.618a1 1 0 0 1 .553-.894L6 7"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CigaretteOff = [
  ["path", { d: "M12 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h13" }],
  ["path", { d: "M18 8c0-2.5-2-2.5-2-5" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M21 12a1 1 0 0 1 1 1v2a1 1 0 0 1-.5.866" }],
  ["path", { d: "M22 8c0-2.5-2-2.5-2-5" }],
  ["path", { d: "M7 12v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cigarette = [
  ["path", { d: "M17 12H3a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h14" }],
  ["path", { d: "M18 8c0-2.5-2-2.5-2-5" }],
  ["path", { d: "M21 16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }],
  ["path", { d: "M22 8c0-2.5-2-2.5-2-5" }],
  ["path", { d: "M7 12v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleArrowDown = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 8v8" }],
  ["path", { d: "m8 12 4 4 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleAlert = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleArrowLeft = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m12 8-4 4 4 4" }],
  ["path", { d: "M16 12H8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleArrowOutDownLeft = [
  ["path", { d: "M2 12a10 10 0 1 1 10 10" }],
  ["path", { d: "m2 22 10-10" }],
  ["path", { d: "M8 22H2v-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleArrowOutUpLeft = [
  ["path", { d: "M2 8V2h6" }],
  ["path", { d: "m2 2 10 10" }],
  ["path", { d: "M12 2A10 10 0 1 1 2 12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleArrowOutUpRight = [
  ["path", { d: "M22 12A10 10 0 1 1 12 2" }],
  ["path", { d: "M22 2 12 12" }],
  ["path", { d: "M16 2h6v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleArrowRight = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m12 16 4-4-4-4" }],
  ["path", { d: "M8 12h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleArrowOutDownRight = [
  ["path", { d: "M12 22a10 10 0 1 1 10-10" }],
  ["path", { d: "M22 22 12 12" }],
  ["path", { d: "M22 16v6h-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleArrowUp = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m16 12-4-4-4 4" }],
  ["path", { d: "M12 16V8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleCheckBig = [
  ["path", { d: "M21.801 10A10 10 0 1 1 17 3.335" }],
  ["path", { d: "m9 11 3 3L22 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleCheck = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m9 12 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleChevronDown = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m16 10-4 4-4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleChevronLeft = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m14 16-4-4 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleChevronRight = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m10 8 4 4-4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleChevronUp = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m8 14 4-4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleDashed = [
  ["path", { d: "M10.1 2.182a10 10 0 0 1 3.8 0" }],
  ["path", { d: "M13.9 21.818a10 10 0 0 1-3.8 0" }],
  ["path", { d: "M17.609 3.721a10 10 0 0 1 2.69 2.7" }],
  ["path", { d: "M2.182 13.9a10 10 0 0 1 0-3.8" }],
  ["path", { d: "M20.279 17.609a10 10 0 0 1-2.7 2.69" }],
  ["path", { d: "M21.818 10.1a10 10 0 0 1 0 3.8" }],
  ["path", { d: "M3.721 6.391a10 10 0 0 1 2.7-2.69" }],
  ["path", { d: "M6.391 20.279a10 10 0 0 1-2.69-2.7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleDivide = [
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }],
  ["line", { x1: "12", x2: "12", y1: "16", y2: "16" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "8" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleDollarSign = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }],
  ["path", { d: "M12 18V6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleDotDashed = [
  ["path", { d: "M10.1 2.18a9.93 9.93 0 0 1 3.8 0" }],
  ["path", { d: "M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" }],
  ["path", { d: "M21.82 10.1a9.93 9.93 0 0 1 0 3.8" }],
  ["path", { d: "M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" }],
  ["path", { d: "M13.9 21.82a9.94 9.94 0 0 1-3.8 0" }],
  ["path", { d: "M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" }],
  ["path", { d: "M2.18 13.9a9.93 9.93 0 0 1 0-3.8" }],
  ["path", { d: "M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" }],
  ["circle", { cx: "12", cy: "12", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleDot = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["circle", { cx: "12", cy: "12", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleEllipsis = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M17 12h.01" }],
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M7 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleEqual = [
  ["path", { d: "M7 10h10" }],
  ["path", { d: "M7 14h10" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleFadingArrowUp = [
  ["path", { d: "M12 2a10 10 0 0 1 7.38 16.75" }],
  ["path", { d: "m16 12-4-4-4 4" }],
  ["path", { d: "M12 16V8" }],
  ["path", { d: "M2.5 8.875a10 10 0 0 0-.5 3" }],
  ["path", { d: "M2.83 16a10 10 0 0 0 2.43 3.4" }],
  ["path", { d: "M4.636 5.235a10 10 0 0 1 .891-.857" }],
  ["path", { d: "M8.644 21.42a10 10 0 0 0 7.631-.38" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleFadingPlus = [
  ["path", { d: "M12 2a10 10 0 0 1 7.38 16.75" }],
  ["path", { d: "M12 8v8" }],
  ["path", { d: "M16 12H8" }],
  ["path", { d: "M2.5 8.875a10 10 0 0 0-.5 3" }],
  ["path", { d: "M2.83 16a10 10 0 0 0 2.43 3.4" }],
  ["path", { d: "M4.636 5.235a10 10 0 0 1 .891-.857" }],
  ["path", { d: "M8.644 21.42a10 10 0 0 0 7.631-.38" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleGauge = [
  ["path", { d: "M15.6 2.7a10 10 0 1 0 5.7 5.7" }],
  ["circle", { cx: "12", cy: "12", r: "2" }],
  ["path", { d: "M13.4 10.6 19 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleMinus = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M8 12h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleOff = [
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M8.35 2.69A10 10 0 0 1 21.3 15.65" }],
  ["path", { d: "M19.08 19.08A10 10 0 1 1 4.92 4.92" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleParkingOff = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m5 5 14 14" }],
  ["path", { d: "M13 13a3 3 0 1 0 0-6H9v2" }],
  ["path", { d: "M9 17v-2.34" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleParking = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M9 17V7h4a3 3 0 0 1 0 6H9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CirclePercent = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m15 9-6 6" }],
  ["path", { d: "M9 9h.01" }],
  ["path", { d: "M15 15h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CirclePause = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["line", { x1: "10", x2: "10", y1: "15", y2: "9" }],
  ["line", { x1: "14", x2: "14", y1: "15", y2: "9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CirclePlay = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["polygon", { points: "10 8 16 12 10 16 10 8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CirclePlus = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M8 12h8" }],
  ["path", { d: "M12 8v8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CirclePoundSterling = [
  ["path", { d: "M10 16V9.5a1 1 0 0 1 5 0" }],
  ["path", { d: "M8 12h4" }],
  ["path", { d: "M8 16h7" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleQuestionMark = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
  ["path", { d: "M12 17h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CirclePower = [
  ["path", { d: "M12 7v4" }],
  ["path", { d: "M7.998 9.003a5 5 0 1 0 8-.005" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleSlash2 = [
  ["path", { d: "M22 2 2 22" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleSlash = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["line", { x1: "9", x2: "15", y1: "15", y2: "9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleSmall = [["circle", { cx: "12", cy: "12", r: "6" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleStop = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["rect", { x: "9", y: "9", width: "6", height: "6", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleUserRound = [
  ["path", { d: "M18 20a6 6 0 0 0-12 0" }],
  ["circle", { cx: "12", cy: "10", r: "4" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleUser = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["circle", { cx: "12", cy: "10", r: "3" }],
  ["path", { d: "M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Circle = [["circle", { cx: "12", cy: "12", r: "10" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircleX = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m15 9-6 6" }],
  ["path", { d: "m9 9 6 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CircuitBoard = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M11 9h4a2 2 0 0 0 2-2V3" }],
  ["circle", { cx: "9", cy: "9", r: "2" }],
  ["path", { d: "M7 21v-4a2 2 0 0 1 2-2h4" }],
  ["circle", { cx: "15", cy: "15", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Citrus = [
  [
    "path",
    { d: "M21.66 17.67a1.08 1.08 0 0 1-.04 1.6A12 12 0 0 1 4.73 2.38a1.1 1.1 0 0 1 1.61-.04z" }
  ],
  ["path", { d: "M19.65 15.66A8 8 0 0 1 8.35 4.34" }],
  ["path", { d: "m14 10-5.5 5.5" }],
  ["path", { d: "M14 17.85V10H6.15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clapperboard = [
  ["path", { d: "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z" }],
  ["path", { d: "m6.2 5.3 3.1 3.9" }],
  ["path", { d: "m12.4 3.4 3.1 4" }],
  ["path", { d: "M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardCopy = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v4" }],
  ["path", { d: "M21 14H11" }],
  ["path", { d: "m15 10-4 4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardCheck = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }],
  ["path", { d: "m9 14 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardList = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M12 11h4" }],
  ["path", { d: "M12 16h4" }],
  ["path", { d: "M8 11h.01" }],
  ["path", { d: "M8 16h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardMinus = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M9 14h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardPaste = [
  ["path", { d: "M11 14h10" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v1.344" }],
  ["path", { d: "m17 18 4-4-4-4" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113" }],
  ["rect", { x: "8", y: "2", width: "8", height: "4", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardPenLine = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1" }],
  ["path", { d: "M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-.5" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 1.73 1" }],
  ["path", { d: "M8 18h1" }],
  [
    "path",
    {
      d: "M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardPlus = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M9 14h6" }],
  ["path", { d: "M12 17v-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardPen = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5" }],
  ["path", { d: "M4 13.5V6a2 2 0 0 1 2-2h2" }],
  [
    "path",
    {
      d: "M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardType = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M9 12v-1h6v1" }],
  ["path", { d: "M11 17h2" }],
  ["path", { d: "M12 11v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClipboardX = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }],
  ["path", { d: "m15 11-6 6" }],
  ["path", { d: "m9 11 6 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clipboard = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock1 = [
  ["path", { d: "M12 6v6l2-4" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock10 = [
  ["path", { d: "M12 6v6l-4-2" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock11 = [
  ["path", { d: "M12 6v6l-2-4" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock12 = [
  ["path", { d: "M12 6v6" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock2 = [
  ["path", { d: "M12 6v6l4-2" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock4 = [
  ["path", { d: "M12 6v6l4 2" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock3 = [
  ["path", { d: "M12 6v6h4" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock5 = [
  ["path", { d: "M12 6v6l2 4" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock6 = [
  ["path", { d: "M12 6v10" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock7 = [
  ["path", { d: "M12 6v6l-2 4" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock9 = [
  ["path", { d: "M12 6v6H8" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock8 = [
  ["path", { d: "M12 6v6l-4 2" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClockAlert = [
  ["path", { d: "M12 6v6l4 2" }],
  ["path", { d: "M20 12v5" }],
  ["path", { d: "M20 21h.01" }],
  ["path", { d: "M21.25 8.2A10 10 0 1 0 16 21.16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClockArrowDown = [
  ["path", { d: "M12 6v6l2 1" }],
  ["path", { d: "M12.337 21.994a10 10 0 1 1 9.588-8.767" }],
  ["path", { d: "m14 18 4 4 4-4" }],
  ["path", { d: "M18 14v8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClockArrowUp = [
  ["path", { d: "M12 6v6l1.56.78" }],
  ["path", { d: "M13.227 21.925a10 10 0 1 1 8.767-9.588" }],
  ["path", { d: "m14 18 4-4 4 4" }],
  ["path", { d: "M18 22v-8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClockFading = [
  ["path", { d: "M12 2a10 10 0 0 1 7.38 16.75" }],
  ["path", { d: "M12 6v6l4 2" }],
  ["path", { d: "M2.5 8.875a10 10 0 0 0-.5 3" }],
  ["path", { d: "M2.83 16a10 10 0 0 0 2.43 3.4" }],
  ["path", { d: "M4.636 5.235a10 10 0 0 1 .891-.857" }],
  ["path", { d: "M8.644 21.42a10 10 0 0 0 7.631-.38" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ClockPlus = [
  ["path", { d: "M12 6v6l3.644 1.822" }],
  ["path", { d: "M16 19h6" }],
  ["path", { d: "M19 16v6" }],
  ["path", { d: "M21.92 13.267a10 10 0 1 0-8.653 8.653" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clock = [
  ["path", { d: "M12 6v6l4 2" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudAlert = [
  ["path", { d: "M12 12v4" }],
  ["path", { d: "M12 20h.01" }],
  ["path", { d: "M17 18h.5a1 1 0 0 0 0-9h-1.79A7 7 0 1 0 7 17.708" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudCheck = [
  ["path", { d: "m17 15-5.5 5.5L9 18" }],
  ["path", { d: "M5 17.743A7 7 0 1 1 15.71 10h1.79a4.5 4.5 0 0 1 1.5 8.742" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudCog = [
  ["path", { d: "m10.852 19.772-.383.924" }],
  ["path", { d: "m13.148 14.228.383-.923" }],
  ["path", { d: "M13.148 19.772a3 3 0 1 0-2.296-5.544l-.383-.923" }],
  ["path", { d: "m13.53 20.696-.382-.924a3 3 0 1 1-2.296-5.544" }],
  ["path", { d: "m14.772 15.852.923-.383" }],
  ["path", { d: "m14.772 18.148.923.383" }],
  ["path", { d: "M4.2 15.1a7 7 0 1 1 9.93-9.858A7 7 0 0 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.2" }],
  ["path", { d: "m9.228 15.852-.923-.383" }],
  ["path", { d: "m9.228 18.148-.923.383" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudDownload = [
  ["path", { d: "M12 13v8l-4-4" }],
  ["path", { d: "m12 21 4-4" }],
  ["path", { d: "M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudDrizzle = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
  ["path", { d: "M8 19v1" }],
  ["path", { d: "M8 14v1" }],
  ["path", { d: "M16 19v1" }],
  ["path", { d: "M16 14v1" }],
  ["path", { d: "M12 21v1" }],
  ["path", { d: "M12 16v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudFog = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
  ["path", { d: "M16 17H7" }],
  ["path", { d: "M17 21H9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudHail = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
  ["path", { d: "M16 14v2" }],
  ["path", { d: "M8 14v2" }],
  ["path", { d: "M16 20h.01" }],
  ["path", { d: "M8 20h.01" }],
  ["path", { d: "M12 16v2" }],
  ["path", { d: "M12 22h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudLightning = [
  ["path", { d: "M6 16.326A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 .5 8.973" }],
  ["path", { d: "m13 12-3 5h4l-3 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudMoonRain = [
  ["path", { d: "M10.188 8.5A6 6 0 0 1 16 4a1 1 0 0 0 6 6 6 6 0 0 1-3 5.197" }],
  ["path", { d: "M11 20v2" }],
  ["path", { d: "M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24" }],
  ["path", { d: "M7 19v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudOff = [
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M5.782 5.782A7 7 0 0 0 9 19h8.5a4.5 4.5 0 0 0 1.307-.193" }],
  ["path", { d: "M21.532 16.5A4.5 4.5 0 0 0 17.5 10h-1.79A7.008 7.008 0 0 0 10 5.07" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudMoon = [
  ["path", { d: "M10.188 8.5A6 6 0 0 1 16 4a1 1 0 0 0 6 6 6 6 0 0 1-3 5.197" }],
  ["path", { d: "M13 16a3 3 0 1 1 0 6H7a5 5 0 1 1 4.9-6Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudRainWind = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
  ["path", { d: "m9.2 22 3-7" }],
  ["path", { d: "m9 13-3 7" }],
  ["path", { d: "m17 13-3 7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudRain = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
  ["path", { d: "M16 14v6" }],
  ["path", { d: "M8 14v6" }],
  ["path", { d: "M12 16v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudSnow = [
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
  ["path", { d: "M8 15h.01" }],
  ["path", { d: "M8 19h.01" }],
  ["path", { d: "M12 17h.01" }],
  ["path", { d: "M12 21h.01" }],
  ["path", { d: "M16 15h.01" }],
  ["path", { d: "M16 19h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudSunRain = [
  ["path", { d: "M12 2v2" }],
  ["path", { d: "m4.93 4.93 1.41 1.41" }],
  ["path", { d: "M20 12h2" }],
  ["path", { d: "m19.07 4.93-1.41 1.41" }],
  ["path", { d: "M15.947 12.65a4 4 0 0 0-5.925-4.128" }],
  ["path", { d: "M3 20a5 5 0 1 1 8.9-4H13a3 3 0 0 1 2 5.24" }],
  ["path", { d: "M11 20v2" }],
  ["path", { d: "M7 19v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudSun = [
  ["path", { d: "M12 2v2" }],
  ["path", { d: "m4.93 4.93 1.41 1.41" }],
  ["path", { d: "M20 12h2" }],
  ["path", { d: "m19.07 4.93-1.41 1.41" }],
  ["path", { d: "M15.947 12.65a4 4 0 0 0-5.925-4.128" }],
  ["path", { d: "M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CloudUpload = [
  ["path", { d: "M12 13v8" }],
  ["path", { d: "M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" }],
  ["path", { d: "m8 17 4-4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cloud = [["path", { d: "M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cloudy = [
  ["path", { d: "M17.5 21H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" }],
  ["path", { d: "M22 10a3 3 0 0 0-3-3h-2.207a5.502 5.502 0 0 0-10.702.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Clover = [
  ["path", { d: "M16.17 7.83 2 22" }],
  [
    "path",
    {
      d: "M4.02 12a2.827 2.827 0 1 1 3.81-4.17A2.827 2.827 0 1 1 12 4.02a2.827 2.827 0 1 1 4.17 3.81A2.827 2.827 0 1 1 19.98 12a2.827 2.827 0 1 1-3.81 4.17A2.827 2.827 0 1 1 12 19.98a2.827 2.827 0 1 1-4.17-3.81A1 1 0 1 1 4 12"
    }
  ],
  ["path", { d: "m7.83 7.83 8.34 8.34" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Club = [
  [
    "path",
    { d: "M17.28 9.05a5.5 5.5 0 1 0-10.56 0A5.5 5.5 0 1 0 12 17.66a5.5 5.5 0 1 0 5.28-8.6Z" }
  ],
  ["path", { d: "M12 17.66L12 22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CodeXml = [
  ["path", { d: "m18 16 4-4-4-4" }],
  ["path", { d: "m6 8-4 4 4 4" }],
  ["path", { d: "m14.5 4-5 16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Code = [
  ["path", { d: "m16 18 6-6-6-6" }],
  ["path", { d: "m8 6-6 6 6 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Codepen = [
  ["polygon", { points: "12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "15.5" }],
  ["polyline", { points: "22 8.5 12 15.5 2 8.5" }],
  ["polyline", { points: "2 15.5 12 8.5 22 15.5" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "8.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Codesandbox = [
  [
    "path",
    {
      d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
    }
  ],
  ["polyline", { points: "7.5 4.21 12 6.81 16.5 4.21" }],
  ["polyline", { points: "7.5 19.79 7.5 14.6 3 12" }],
  ["polyline", { points: "21 12 16.5 14.6 16.5 19.79" }],
  ["polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }],
  ["line", { x1: "12", x2: "12", y1: "22.08", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Coffee = [
  ["path", { d: "M10 2v2" }],
  ["path", { d: "M14 2v2" }],
  [
    "path",
    {
      d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"
    }
  ],
  ["path", { d: "M6 2v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cog = [
  ["path", { d: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" }],
  ["path", { d: "M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" }],
  ["path", { d: "M12 2v2" }],
  ["path", { d: "M12 22v-2" }],
  ["path", { d: "m17 20.66-1-1.73" }],
  ["path", { d: "M11 10.27 7 3.34" }],
  ["path", { d: "m20.66 17-1.73-1" }],
  ["path", { d: "m3.34 7 1.73 1" }],
  ["path", { d: "M14 12h8" }],
  ["path", { d: "M2 12h2" }],
  ["path", { d: "m20.66 7-1.73 1" }],
  ["path", { d: "m3.34 17 1.73-1" }],
  ["path", { d: "m17 3.34-1 1.73" }],
  ["path", { d: "m11 13.73-4 6.93" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Coins = [
  ["circle", { cx: "8", cy: "8", r: "6" }],
  ["path", { d: "M18.09 10.37A6 6 0 1 1 10.34 18" }],
  ["path", { d: "M7 6h1v4" }],
  ["path", { d: "m16.71 13.88.7.71-2.82 2.82" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Columns2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M12 3v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Columns3Cog = [
  ["path", { d: "M10.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5" }],
  ["path", { d: "m14.3 19.6 1-.4" }],
  ["path", { d: "M15 3v7.5" }],
  ["path", { d: "m15.2 16.9-.9-.3" }],
  ["path", { d: "m16.6 21.7.3-.9" }],
  ["path", { d: "m16.8 15.3-.4-1" }],
  ["path", { d: "m19.1 15.2.3-.9" }],
  ["path", { d: "m19.6 21.7-.4-1" }],
  ["path", { d: "m20.7 16.8 1-.4" }],
  ["path", { d: "m21.7 19.4-.9-.3" }],
  ["path", { d: "M9 3v18" }],
  ["circle", { cx: "18", cy: "18", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Columns3 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M9 3v18" }],
  ["path", { d: "M15 3v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Columns4 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M7.5 3v18" }],
  ["path", { d: "M12 3v18" }],
  ["path", { d: "M16.5 3v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Combine = [
  ["path", { d: "M10 18H5a3 3 0 0 1-3-3v-1" }],
  ["path", { d: "M14 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" }],
  ["path", { d: "M20 2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" }],
  ["path", { d: "m7 21 3-3-3-3" }],
  ["rect", { x: "14", y: "14", width: "8", height: "8", rx: "2" }],
  ["rect", { x: "2", y: "2", width: "8", height: "8", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Command = [
  ["path", { d: "M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Compass = [
  [
    "path",
    {
      d: "m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Component = [
  [
    "path",
    {
      d: "M15.536 11.293a1 1 0 0 0 0 1.414l2.376 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"
    }
  ],
  [
    "path",
    {
      d: "M2.297 11.293a1 1 0 0 0 0 1.414l2.377 2.377a1 1 0 0 0 1.414 0l2.377-2.377a1 1 0 0 0 0-1.414L6.088 8.916a1 1 0 0 0-1.414 0z"
    }
  ],
  [
    "path",
    {
      d: "M8.916 17.912a1 1 0 0 0 0 1.415l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.415l-2.377-2.376a1 1 0 0 0-1.414 0z"
    }
  ],
  [
    "path",
    {
      d: "M8.916 4.674a1 1 0 0 0 0 1.414l2.377 2.376a1 1 0 0 0 1.414 0l2.377-2.376a1 1 0 0 0 0-1.414l-2.377-2.377a1 1 0 0 0-1.414 0z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Computer = [
  ["rect", { width: "14", height: "8", x: "5", y: "2", rx: "2" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2" }],
  ["path", { d: "M6 18h2" }],
  ["path", { d: "M12 18h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ConciergeBell = [
  ["path", { d: "M3 20a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1Z" }],
  ["path", { d: "M20 16a8 8 0 1 0-16 0" }],
  ["path", { d: "M12 4v4" }],
  ["path", { d: "M10 4h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cone = [
  ["path", { d: "m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98" }],
  ["ellipse", { cx: "12", cy: "19", rx: "9", ry: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Construction = [
  ["rect", { x: "2", y: "6", width: "20", height: "8", rx: "1" }],
  ["path", { d: "M17 14v7" }],
  ["path", { d: "M7 14v7" }],
  ["path", { d: "M17 3v3" }],
  ["path", { d: "M7 3v3" }],
  ["path", { d: "M10 14 2.3 6.3" }],
  ["path", { d: "m14 6 7.7 7.7" }],
  ["path", { d: "m8 6 8 8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Contact = [
  ["path", { d: "M16 2v2" }],
  ["path", { d: "M7 22v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M8 2v2" }],
  ["circle", { cx: "12", cy: "11", r: "3" }],
  ["rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ContactRound = [
  ["path", { d: "M16 2v2" }],
  ["path", { d: "M17.915 22a6 6 0 0 0-12 0" }],
  ["path", { d: "M8 2v2" }],
  ["circle", { cx: "12", cy: "12", r: "4" }],
  ["rect", { x: "3", y: "4", width: "18", height: "18", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Container = [
  [
    "path",
    {
      d: "M22 7.7c0-.6-.4-1.2-.8-1.5l-6.3-3.9a1.72 1.72 0 0 0-1.7 0l-10.3 6c-.5.2-.9.8-.9 1.4v6.6c0 .5.4 1.2.8 1.5l6.3 3.9a1.72 1.72 0 0 0 1.7 0l10.3-6c.5-.3.9-1 .9-1.5Z"
    }
  ],
  ["path", { d: "M10 21.9V14L2.1 9.1" }],
  ["path", { d: "m10 14 11.9-6.9" }],
  ["path", { d: "M14 19.8v-8.1" }],
  ["path", { d: "M18 17.5V9.4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Contrast = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 18a6 6 0 0 0 0-12v12z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cookie = [
  ["path", { d: "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" }],
  ["path", { d: "M8.5 8.5v.01" }],
  ["path", { d: "M16 15.5v.01" }],
  ["path", { d: "M12 12v.01" }],
  ["path", { d: "M11 17v.01" }],
  ["path", { d: "M7 14v.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CookingPot = [
  ["path", { d: "M2 12h20" }],
  ["path", { d: "M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" }],
  ["path", { d: "m4 8 16-4" }],
  ["path", { d: "m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CopyCheck = [
  ["path", { d: "m12 15 2 2 4-4" }],
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CopyPlus = [
  ["line", { x1: "15", x2: "15", y1: "12", y2: "18" }],
  ["line", { x1: "12", x2: "18", y1: "15", y2: "15" }],
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CopyMinus = [
  ["line", { x1: "12", x2: "18", y1: "15", y2: "15" }],
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CopySlash = [
  ["line", { x1: "12", x2: "18", y1: "18", y2: "12" }],
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CopyX = [
  ["line", { x1: "12", x2: "18", y1: "12", y2: "18" }],
  ["line", { x1: "12", x2: "18", y1: "18", y2: "12" }],
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Copy = [
  ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2" }],
  ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Copyleft = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M9.17 14.83a4 4 0 1 0 0-5.66" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Copyright = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M14.83 14.83a4 4 0 1 1 0-5.66" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CornerDownLeft = [
  ["path", { d: "M20 4v7a4 4 0 0 1-4 4H4" }],
  ["path", { d: "m9 10-5 5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CornerDownRight = [
  ["path", { d: "m15 10 5 5-5 5" }],
  ["path", { d: "M4 4v7a4 4 0 0 0 4 4h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CornerLeftDown = [
  ["path", { d: "m14 15-5 5-5-5" }],
  ["path", { d: "M20 4h-7a4 4 0 0 0-4 4v12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CornerLeftUp = [
  ["path", { d: "M14 9 9 4 4 9" }],
  ["path", { d: "M20 20h-7a4 4 0 0 1-4-4V4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CornerRightDown = [
  ["path", { d: "m10 15 5 5 5-5" }],
  ["path", { d: "M4 4h7a4 4 0 0 1 4 4v12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CornerRightUp = [
  ["path", { d: "m10 9 5-5 5 5" }],
  ["path", { d: "M4 20h7a4 4 0 0 0 4-4V4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CornerUpLeft = [
  ["path", { d: "M20 20v-7a4 4 0 0 0-4-4H4" }],
  ["path", { d: "M9 14 4 9l5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CornerUpRight = [
  ["path", { d: "m15 14 5-5-5-5" }],
  ["path", { d: "M4 20v-7a4 4 0 0 1 4-4h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cpu = [
  ["path", { d: "M12 20v2" }],
  ["path", { d: "M12 2v2" }],
  ["path", { d: "M17 20v2" }],
  ["path", { d: "M17 2v2" }],
  ["path", { d: "M2 12h2" }],
  ["path", { d: "M2 17h2" }],
  ["path", { d: "M2 7h2" }],
  ["path", { d: "M20 12h2" }],
  ["path", { d: "M20 17h2" }],
  ["path", { d: "M20 7h2" }],
  ["path", { d: "M7 20v2" }],
  ["path", { d: "M7 2v2" }],
  ["rect", { x: "4", y: "4", width: "16", height: "16", rx: "2" }],
  ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CreativeCommons = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M10 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1" }],
  ["path", { d: "M17 9.3a2.8 2.8 0 0 0-3.5 1 3.1 3.1 0 0 0 0 3.4 2.7 2.7 0 0 0 3.5 1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CreditCard = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Croissant = [
  [
    "path",
    {
      d: "m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z"
    }
  ],
  [
    "path",
    { d: "m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83" }
  ],
  ["path", { d: "M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4" }],
  [
    "path",
    {
      d: "m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2"
    }
  ],
  ["path", { d: "M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Crop = [
  ["path", { d: "M6 2v14a2 2 0 0 0 2 2h14" }],
  ["path", { d: "M18 22V8a2 2 0 0 0-2-2H2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cross = [
  [
    "path",
    {
      d: "M4 9a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h4a1 1 0 0 1 1 1v4a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-4a1 1 0 0 1 1-1h4a2 2 0 0 0 2-2v-2a2 2 0 0 0-2-2h-4a1 1 0 0 1-1-1V4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4a1 1 0 0 1-1 1z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Crosshair = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["line", { x1: "22", x2: "18", y1: "12", y2: "12" }],
  ["line", { x1: "6", x2: "2", y1: "12", y2: "12" }],
  ["line", { x1: "12", x2: "12", y1: "6", y2: "2" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Crown = [
  [
    "path",
    {
      d: "M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"
    }
  ],
  ["path", { d: "M5 21h14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cuboid = [
  [
    "path",
    {
      d: "m21.12 6.4-6.05-4.06a2 2 0 0 0-2.17-.05L2.95 8.41a2 2 0 0 0-.95 1.7v5.82a2 2 0 0 0 .88 1.66l6.05 4.07a2 2 0 0 0 2.17.05l9.95-6.12a2 2 0 0 0 .95-1.7V8.06a2 2 0 0 0-.88-1.66Z"
    }
  ],
  ["path", { d: "M10 22v-8L2.25 9.15" }],
  ["path", { d: "m10 14 11.77-6.87" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const CupSoda = [
  ["path", { d: "m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8" }],
  ["path", { d: "M5 8h14" }],
  ["path", { d: "M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0" }],
  ["path", { d: "m12 8 1-6h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Currency = [
  ["circle", { cx: "12", cy: "12", r: "8" }],
  ["line", { x1: "3", x2: "6", y1: "3", y2: "6" }],
  ["line", { x1: "21", x2: "18", y1: "3", y2: "6" }],
  ["line", { x1: "3", x2: "6", y1: "21", y2: "18" }],
  ["line", { x1: "21", x2: "18", y1: "21", y2: "18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Cylinder = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
  ["path", { d: "M3 5v14a9 3 0 0 0 18 0V5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dam = [
  ["path", { d: "M11 11.31c1.17.56 1.54 1.69 3.5 1.69 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" }],
  ["path", { d: "M11.75 18c.35.5 1.45 1 2.75 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" }],
  ["path", { d: "M2 10h4" }],
  ["path", { d: "M2 14h4" }],
  ["path", { d: "M2 18h4" }],
  ["path", { d: "M2 6h4" }],
  ["path", { d: "M7 3a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1L10 4a1 1 0 0 0-1-1z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DatabaseBackup = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
  ["path", { d: "M3 12a9 3 0 0 0 5 2.69" }],
  ["path", { d: "M21 9.3V5" }],
  ["path", { d: "M3 5v14a9 3 0 0 0 6.47 2.88" }],
  ["path", { d: "M12 12v4h4" }],
  ["path", { d: "M13 20a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L12 16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DatabaseZap = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 15 21.84" }],
  ["path", { d: "M21 5V8" }],
  ["path", { d: "M21 12L18 17H22L19 22" }],
  ["path", { d: "M3 12A9 3 0 0 0 14.59 14.87" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DecimalsArrowLeft = [
  ["path", { d: "m13 21-3-3 3-3" }],
  ["path", { d: "M20 18H10" }],
  ["path", { d: "M3 11h.01" }],
  ["rect", { x: "6", y: "3", width: "5", height: "8", rx: "2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DecimalsArrowRight = [
  ["path", { d: "M10 18h10" }],
  ["path", { d: "m17 21 3-3-3-3" }],
  ["path", { d: "M3 11h.01" }],
  ["rect", { x: "15", y: "3", width: "5", height: "8", rx: "2.5" }],
  ["rect", { x: "6", y: "3", width: "5", height: "8", rx: "2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Database = [
  ["ellipse", { cx: "12", cy: "5", rx: "9", ry: "3" }],
  ["path", { d: "M3 5V19A9 3 0 0 0 21 19V5" }],
  ["path", { d: "M3 12A9 3 0 0 0 21 12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Delete = [
  [
    "path",
    {
      d: "M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"
    }
  ],
  ["path", { d: "m12 9 6 6" }],
  ["path", { d: "m18 9-6 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dessert = [
  [
    "path",
    {
      d: "M10.162 3.167A10 10 0 0 0 2 13a2 2 0 0 0 4 0v-1a2 2 0 0 1 4 0v4a2 2 0 0 0 4 0v-4a2 2 0 0 1 4 0v1a2 2 0 0 0 4-.006 10 10 0 0 0-8.161-9.826"
    }
  ],
  ["path", { d: "M20.804 14.869a9 9 0 0 1-17.608 0" }],
  ["circle", { cx: "12", cy: "4", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Diameter = [
  ["circle", { cx: "19", cy: "19", r: "2" }],
  ["circle", { cx: "5", cy: "5", r: "2" }],
  ["path", { d: "M6.48 3.66a10 10 0 0 1 13.86 13.86" }],
  ["path", { d: "m6.41 6.41 11.18 11.18" }],
  ["path", { d: "M3.66 6.48a10 10 0 0 0 13.86 13.86" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DiamondPercent = [
  [
    "path",
    {
      d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0Z"
    }
  ],
  ["path", { d: "M9.2 9.2h.01" }],
  ["path", { d: "m14.5 9.5-5 5" }],
  ["path", { d: "M14.7 14.8h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DiamondPlus = [
  ["path", { d: "M12 8v8" }],
  [
    "path",
    {
      d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"
    }
  ],
  ["path", { d: "M8 12h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DiamondMinus = [
  [
    "path",
    {
      d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41L13.7 2.71a2.41 2.41 0 0 0-3.41 0z"
    }
  ],
  ["path", { d: "M8 12h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Diamond = [
  [
    "path",
    {
      d: "M2.7 10.3a2.41 2.41 0 0 0 0 3.41l7.59 7.59a2.41 2.41 0 0 0 3.41 0l7.59-7.59a2.41 2.41 0 0 0 0-3.41l-7.59-7.59a2.41 2.41 0 0 0-3.41 0Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dice1 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["path", { d: "M12 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dice2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["path", { d: "M15 9h.01" }],
  ["path", { d: "M9 15h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dice3 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["path", { d: "M16 8h.01" }],
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M8 16h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dice5 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["path", { d: "M16 8h.01" }],
  ["path", { d: "M8 8h.01" }],
  ["path", { d: "M8 16h.01" }],
  ["path", { d: "M16 16h.01" }],
  ["path", { d: "M12 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dice4 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["path", { d: "M16 8h.01" }],
  ["path", { d: "M8 8h.01" }],
  ["path", { d: "M8 16h.01" }],
  ["path", { d: "M16 16h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dice6 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["path", { d: "M16 8h.01" }],
  ["path", { d: "M16 12h.01" }],
  ["path", { d: "M16 16h.01" }],
  ["path", { d: "M8 8h.01" }],
  ["path", { d: "M8 12h.01" }],
  ["path", { d: "M8 16h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dices = [
  ["rect", { width: "12", height: "12", x: "2", y: "10", rx: "2", ry: "2" }],
  ["path", { d: "m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6" }],
  ["path", { d: "M6 18h.01" }],
  ["path", { d: "M10 14h.01" }],
  ["path", { d: "M15 6h.01" }],
  ["path", { d: "M18 9h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Disc2 = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["circle", { cx: "12", cy: "12", r: "4" }],
  ["path", { d: "M12 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Diff = [
  ["path", { d: "M12 3v14" }],
  ["path", { d: "M5 10h14" }],
  ["path", { d: "M5 21h14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Disc3 = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M6 12c0-1.7.7-3.2 1.8-4.2" }],
  ["circle", { cx: "12", cy: "12", r: "2" }],
  ["path", { d: "M18 12c0 1.7-.7 3.2-1.8 4.2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DiscAlbum = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["circle", { cx: "12", cy: "12", r: "5" }],
  ["path", { d: "M12 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Disc = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["circle", { cx: "12", cy: "12", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Divide = [
  ["circle", { cx: "12", cy: "6", r: "1" }],
  ["line", { x1: "5", x2: "19", y1: "12", y2: "12" }],
  ["circle", { cx: "12", cy: "18", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DnaOff = [
  ["path", { d: "M15 2c-1.35 1.5-2.092 3-2.5 4.5L14 8" }],
  ["path", { d: "m17 6-2.891-2.891" }],
  ["path", { d: "M2 15c3.333-3 6.667-3 10-3" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "m20 9 .891.891" }],
  ["path", { d: "M22 9c-1.5 1.35-3 2.092-4.5 2.5l-1-1" }],
  ["path", { d: "M3.109 14.109 4 15" }],
  ["path", { d: "m6.5 12.5 1 1" }],
  ["path", { d: "m7 18 2.891 2.891" }],
  ["path", { d: "M9 22c1.35-1.5 2.092-3 2.5-4.5L10 16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dna = [
  ["path", { d: "m10 16 1.5 1.5" }],
  ["path", { d: "m14 8-1.5-1.5" }],
  ["path", { d: "M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" }],
  ["path", { d: "m16.5 10.5 1 1" }],
  ["path", { d: "m17 6-2.891-2.891" }],
  ["path", { d: "M2 15c6.667-6 13.333 0 20-6" }],
  ["path", { d: "m20 9 .891.891" }],
  ["path", { d: "M3.109 14.109 4 15" }],
  ["path", { d: "m6.5 12.5 1 1" }],
  ["path", { d: "m7 18 2.891 2.891" }],
  ["path", { d: "M9 22c1.798-1.998 2.518-3.995 2.807-5.993" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dock = [
  ["path", { d: "M2 8h20" }],
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
  ["path", { d: "M6 16h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dog = [
  ["path", { d: "M11.25 16.25h1.5L12 17z" }],
  ["path", { d: "M16 14v.5" }],
  [
    "path",
    {
      d: "M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"
    }
  ],
  ["path", { d: "M8 14v.5" }],
  [
    "path",
    {
      d: "M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DollarSign = [
  ["line", { x1: "12", x2: "12", y1: "2", y2: "22" }],
  ["path", { d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Donut = [
  [
    "path",
    {
      d: "M20.5 10a2.5 2.5 0 0 1-2.4-3H18a2.95 2.95 0 0 1-2.6-4.4 10 10 0 1 0 6.3 7.1c-.3.2-.8.3-1.2.3"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DoorClosedLocked = [
  ["path", { d: "M10 12h.01" }],
  ["path", { d: "M18 9V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" }],
  ["path", { d: "M2 20h8" }],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2" }],
  ["rect", { x: "14", y: "17", width: "8", height: "5", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DoorClosed = [
  ["path", { d: "M10 12h.01" }],
  ["path", { d: "M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" }],
  ["path", { d: "M2 20h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DoorOpen = [
  ["path", { d: "M11 20H2" }],
  [
    "path",
    {
      d: "M11 4.562v16.157a1 1 0 0 0 1.242.97L19 20V5.562a2 2 0 0 0-1.515-1.94l-4-1A2 2 0 0 0 11 4.561z"
    }
  ],
  ["path", { d: "M11 4H8a2 2 0 0 0-2 2v14" }],
  ["path", { d: "M14 12h.01" }],
  ["path", { d: "M22 20h-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dot = [["circle", { cx: "12.1", cy: "12.1", r: "1" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Download = [
  ["path", { d: "M12 15V3" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }],
  ["path", { d: "m7 10 5 5 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DraftingCompass = [
  ["path", { d: "m12.99 6.74 1.93 3.44" }],
  ["path", { d: "M19.136 12a10 10 0 0 1-14.271 0" }],
  ["path", { d: "m21 21-2.16-3.84" }],
  ["path", { d: "m3 21 8.02-14.26" }],
  ["circle", { cx: "12", cy: "5", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Drama = [
  ["path", { d: "M10 11h.01" }],
  ["path", { d: "M14 6h.01" }],
  ["path", { d: "M18 6h.01" }],
  ["path", { d: "M6.5 13.1h.01" }],
  ["path", { d: "M22 5c0 9-4 12-6 12s-6-3-6-12c0-2 2-3 6-3s6 1 6 3" }],
  ["path", { d: "M17.4 9.9c-.8.8-2 .8-2.8 0" }],
  [
    "path",
    {
      d: "M10.1 7.1C9 7.2 7.7 7.7 6 8.6c-3.5 2-4.7 3.9-3.7 5.6 4.5 7.8 9.5 8.4 11.2 7.4.9-.5 1.9-2.1 1.9-4.7"
    }
  ],
  ["path", { d: "M9.1 16.5c.3-1.1 1.4-1.7 2.4-1.4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dribbble = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M19.13 5.09C15.22 9.14 10 10.44 2.25 10.94" }],
  ["path", { d: "M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" }],
  ["path", { d: "M8.56 2.75c4.37 6 6 9.42 8 17.72" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Drill = [
  ["path", { d: "M10 18a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H5a3 3 0 0 1-3-3 1 1 0 0 1 1-1z" }],
  [
    "path",
    {
      d: "M13 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1l-.81 3.242a1 1 0 0 1-.97.758H8"
    }
  ],
  ["path", { d: "M14 4h3a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3" }],
  ["path", { d: "M18 6h4" }],
  ["path", { d: "m5 10-2 8" }],
  ["path", { d: "m7 18 2-8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Drone = [
  ["path", { d: "M10 10 7 7" }],
  ["path", { d: "m10 14-3 3" }],
  ["path", { d: "m14 10 3-3" }],
  ["path", { d: "m14 14 3 3" }],
  ["path", { d: "M14.205 4.139a4 4 0 1 1 5.439 5.863" }],
  ["path", { d: "M19.637 14a4 4 0 1 1-5.432 5.868" }],
  ["path", { d: "M4.367 10a4 4 0 1 1 5.438-5.862" }],
  ["path", { d: "M9.795 19.862a4 4 0 1 1-5.429-5.873" }],
  ["rect", { x: "10", y: "8", width: "4", height: "8", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const DropletOff = [
  [
    "path",
    {
      d: "M18.715 13.186C18.29 11.858 17.384 10.607 16 9.5c-2-1.6-3.5-4-4-6.5a10.7 10.7 0 0 1-.884 2.586"
    }
  ],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M8.795 8.797A11 11 0 0 1 8 9.5C6 11.1 5 13 5 15a7 7 0 0 0 13.222 3.208" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Droplet = [
  [
    "path",
    {
      d: "M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Drum = [
  ["path", { d: "m2 2 8 8" }],
  ["path", { d: "m22 2-8 8" }],
  ["ellipse", { cx: "12", cy: "9", rx: "10", ry: "5" }],
  ["path", { d: "M7 13.4v7.9" }],
  ["path", { d: "M12 14v8" }],
  ["path", { d: "M17 13.4v7.9" }],
  ["path", { d: "M2 9v8a10 5 0 0 0 20 0V9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Droplets = [
  [
    "path",
    {
      d: "M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"
    }
  ],
  [
    "path",
    {
      d: "M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Drumstick = [
  ["path", { d: "M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23" }],
  ["path", { d: "m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Dumbbell = [
  [
    "path",
    {
      d: "M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"
    }
  ],
  ["path", { d: "m2.5 21.5 1.4-1.4" }],
  ["path", { d: "m20.1 3.9 1.4-1.4" }],
  [
    "path",
    {
      d: "M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"
    }
  ],
  ["path", { d: "m9.6 14.4 4.8-4.8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ear = [
  ["path", { d: "M6 8.5a6.5 6.5 0 1 1 13 0c0 6-6 6-6 10a3.5 3.5 0 1 1-7 0" }],
  ["path", { d: "M15 8.5a2.5 2.5 0 0 0-5 0v1a2 2 0 1 1 0 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EarOff = [
  ["path", { d: "M6 18.5a3.5 3.5 0 1 0 7 0c0-1.57.92-2.52 2.04-3.46" }],
  ["path", { d: "M6 8.5c0-.75.13-1.47.36-2.14" }],
  ["path", { d: "M8.8 3.15A6.5 6.5 0 0 1 19 8.5c0 1.63-.44 2.81-1.09 3.76" }],
  ["path", { d: "M12.5 6A2.5 2.5 0 0 1 15 8.5M10 13a2 2 0 0 0 1.82-1.18" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EarthLock = [
  ["path", { d: "M7 3.34V5a3 3 0 0 0 3 3" }],
  ["path", { d: "M11 21.95V18a2 2 0 0 0-2-2 2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" }],
  ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54" }],
  ["path", { d: "M12 2a10 10 0 1 0 9.54 13" }],
  ["path", { d: "M20 6V4a2 2 0 1 0-4 0v2" }],
  ["rect", { width: "8", height: "5", x: "14", y: "6", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Earth = [
  ["path", { d: "M21.54 15H17a2 2 0 0 0-2 2v4.54" }],
  [
    "path",
    { d: "M7 3.34V5a3 3 0 0 0 3 3a2 2 0 0 1 2 2c0 1.1.9 2 2 2a2 2 0 0 0 2-2c0-1.1.9-2 2-2h3.17" }
  ],
  ["path", { d: "M11 21.95V18a2 2 0 0 0-2-2a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eclipse = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 2a7 7 0 1 0 10 10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EggFried = [
  ["circle", { cx: "11.5", cy: "12.5", r: "3.5" }],
  [
    "path",
    {
      d: "M3 8c0-3.5 2.5-6 6.5-6 5 0 4.83 3 7.5 5s5 2 5 6c0 4.5-2.5 6.5-7 6.5-2.5 0-2.5 2.5-6 2.5s-7-2-7-5.5c0-3 1.5-3 1.5-5C3.5 10 3 9 3 8Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EggOff = [
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M20 14.347V14c0-6-4-12-8-12-1.078 0-2.157.436-3.157 1.19" }],
  ["path", { d: "M6.206 6.21C4.871 8.4 4 11.2 4 14a8 8 0 0 0 14.568 4.568" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Egg = [["path", { d: "M12 2C8 2 4 8 4 14a8 8 0 0 0 16 0c0-6-4-12-8-12" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EllipsisVertical = [
  ["circle", { cx: "12", cy: "12", r: "1" }],
  ["circle", { cx: "12", cy: "5", r: "1" }],
  ["circle", { cx: "12", cy: "19", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ellipsis = [
  ["circle", { cx: "12", cy: "12", r: "1" }],
  ["circle", { cx: "19", cy: "12", r: "1" }],
  ["circle", { cx: "5", cy: "12", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EqualApproximately = [
  ["path", { d: "M5 15a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" }],
  ["path", { d: "M5 9a6.5 6.5 0 0 1 7 0 6.5 6.5 0 0 0 7 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EqualNot = [
  ["line", { x1: "5", x2: "19", y1: "9", y2: "9" }],
  ["line", { x1: "5", x2: "19", y1: "15", y2: "15" }],
  ["line", { x1: "19", x2: "5", y1: "5", y2: "19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Equal = [
  ["line", { x1: "5", x2: "19", y1: "9", y2: "9" }],
  ["line", { x1: "5", x2: "19", y1: "15", y2: "15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eraser = [
  [
    "path",
    {
      d: "M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"
    }
  ],
  ["path", { d: "m5.082 11.09 8.828 8.828" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EthernetPort = [
  [
    "path",
    { d: "m15 20 3-3h2a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h2l3 3z" }
  ],
  ["path", { d: "M6 8v1" }],
  ["path", { d: "M10 8v1" }],
  ["path", { d: "M14 8v1" }],
  ["path", { d: "M18 8v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Euro = [
  ["path", { d: "M4 10h12" }],
  ["path", { d: "M4 14h9" }],
  [
    "path",
    { d: "M19 6a7.7 7.7 0 0 0-5.2-2A7.9 7.9 0 0 0 6 12c0 4.4 3.5 8 7.8 8 2 0 3.8-.8 5.2-2" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Expand = [
  ["path", { d: "m15 15 6 6" }],
  ["path", { d: "m15 9 6-6" }],
  ["path", { d: "M21 16v5h-5" }],
  ["path", { d: "M21 8V3h-5" }],
  ["path", { d: "M3 16v5h5" }],
  ["path", { d: "m3 21 6-6" }],
  ["path", { d: "M3 8V3h5" }],
  ["path", { d: "M9 9 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ExternalLink = [
  ["path", { d: "M15 3h6v6" }],
  ["path", { d: "M10 14 21 3" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EyeClosed = [
  ["path", { d: "m15 18-.722-3.25" }],
  ["path", { d: "M2 8a10.645 10.645 0 0 0 20 0" }],
  ["path", { d: "m20 15-1.726-2.05" }],
  ["path", { d: "m4 15 1.726-2.05" }],
  ["path", { d: "m9 18 .722-3.25" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const EyeOff = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"
    }
  ],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Eye = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Facebook = [
  ["path", { d: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Factory = [
  ["path", { d: "M12 16h.01" }],
  ["path", { d: "M16 16h.01" }],
  [
    "path",
    {
      d: "M3 19a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5a.5.5 0 0 0-.769-.422l-4.462 2.844A.5.5 0 0 1 15 10.5v-2a.5.5 0 0 0-.769-.422L9.77 10.922A.5.5 0 0 1 9 10.5V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"
    }
  ],
  ["path", { d: "M8 16h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fan = [
  [
    "path",
    {
      d: "M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z"
    }
  ],
  ["path", { d: "M12 12v.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FastForward = [
  ["polygon", { points: "13 19 22 12 13 5 13 19" }],
  ["polygon", { points: "2 19 11 12 2 5 2 19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Feather = [
  [
    "path",
    {
      d: "M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z"
    }
  ],
  ["path", { d: "M16 8 2 22" }],
  ["path", { d: "M17.5 15H9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fence = [
  ["path", { d: "M4 3 2 5v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" }],
  ["path", { d: "M6 8h4" }],
  ["path", { d: "M6 18h4" }],
  ["path", { d: "m12 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" }],
  ["path", { d: "M14 8h4" }],
  ["path", { d: "M14 18h4" }],
  ["path", { d: "m20 3-2 2v15c0 .6.4 1 1 1h2c.6 0 1-.4 1-1V5Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FerrisWheel = [
  ["circle", { cx: "12", cy: "12", r: "2" }],
  ["path", { d: "M12 2v4" }],
  ["path", { d: "m6.8 15-3.5 2" }],
  ["path", { d: "m20.7 7-3.5 2" }],
  ["path", { d: "M6.8 9 3.3 7" }],
  ["path", { d: "m20.7 17-3.5-2" }],
  ["path", { d: "m9 22 3-8 3 8" }],
  ["path", { d: "M8 22h8" }],
  ["path", { d: "M18 18.7a9 9 0 1 0-12 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Figma = [
  ["path", { d: "M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" }],
  ["path", { d: "M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" }],
  ["path", { d: "M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" }],
  ["path", { d: "M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" }],
  ["path", { d: "M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileArchive = [
  ["path", { d: "M10 12v-1" }],
  ["path", { d: "M10 18v-2" }],
  ["path", { d: "M10 7V6" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M15.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 .274 1.01" }],
  ["circle", { cx: "10", cy: "20", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileAudio2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["circle", { cx: "3", cy: "17", r: "1" }],
  ["path", { d: "M2 17v-3a4 4 0 0 1 8 0v3" }],
  ["circle", { cx: "9", cy: "17", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileAudio = [
  ["path", { d: "M17.5 22h.5a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  [
    "path",
    { d: "M2 19a2 2 0 1 1 4 0v1a2 2 0 1 1-4 0v-4a6 6 0 0 1 12 0v4a2 2 0 1 1-4 0v-1a2 2 0 1 1 4 0" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileBadge2 = [
  [
    "path",
    {
      d: "m13.69 12.479 1.29 4.88a.5.5 0 0 1-.697.591l-1.844-.849a1 1 0 0 0-.88.001l-1.846.85a.5.5 0 0 1-.693-.593l1.29-4.88"
    }
  ],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" }],
  ["circle", { cx: "12", cy: "10", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileAxis3d = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m8 18 4-4" }],
  ["path", { d: "M8 10v8h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileBadge = [
  ["path", { d: "M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.072" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  [
    "path",
    {
      d: "m6.69 16.479 1.29 4.88a.5.5 0 0 1-.698.591l-1.843-.849a1 1 0 0 0-.88.001l-1.846.85a.5.5 0 0 1-.693-.593l1.29-4.88"
    }
  ],
  ["circle", { cx: "5", cy: "14", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileBox = [
  ["path", { d: "M14.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  [
    "path",
    {
      d: "M3 13.1a2 2 0 0 0-1 1.76v3.24a2 2 0 0 0 .97 1.78L6 21.7a2 2 0 0 0 2.03.01L11 19.9a2 2 0 0 0 1-1.76V14.9a2 2 0 0 0-.97-1.78L8 11.3a2 2 0 0 0-2.03-.01Z"
    }
  ],
  ["path", { d: "M7 17v5" }],
  ["path", { d: "M11.7 14.2 7 17l-4.7-2.8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileChartColumn = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M8 18v-1" }],
  ["path", { d: "M12 18v-6" }],
  ["path", { d: "M16 18v-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileChartColumnIncreasing = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M8 18v-2" }],
  ["path", { d: "M12 18v-4" }],
  ["path", { d: "M16 18v-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileChartPie = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3.5" }],
  ["path", { d: "M4.017 11.512a6 6 0 1 0 8.466 8.475" }],
  [
    "path",
    {
      d: "M9 16a1 1 0 0 1-1-1v-4c0-.552.45-1.008.995-.917a6 6 0 0 1 4.922 4.922c.091.544-.365.995-.917.995z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileCheck2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m3 15 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileChartLine = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m16 13-3.5 3.5-2-2L8 17" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileCheck = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m9 15 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileClock = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M16 22h2a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" }],
  ["path", { d: "M8 14v2.2l1.6 1" }],
  ["circle", { cx: "8", cy: "16", r: "6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileCode2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m5 12-3 3 3 3" }],
  ["path", { d: "m9 18 3-3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileCode = [
  ["path", { d: "M10 12.5 8 15l2 2.5" }],
  ["path", { d: "m14 12.5 2 2.5-2 2.5" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileCog = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m2.305 15.53.923-.382" }],
  ["path", { d: "m3.228 12.852-.924-.383" }],
  ["path", { d: "M4.677 21.5a2 2 0 0 0 1.313.5H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2.5" }],
  ["path", { d: "m4.852 11.228-.383-.923" }],
  ["path", { d: "m4.852 16.772-.383.924" }],
  ["path", { d: "m7.148 11.228.383-.923" }],
  ["path", { d: "m7.53 17.696-.382-.924" }],
  ["path", { d: "m8.772 12.852.923-.383" }],
  ["path", { d: "m8.772 15.148.923.383" }],
  ["circle", { cx: "6", cy: "14", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileDiff = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M9 10h6" }],
  ["path", { d: "M12 13V7" }],
  ["path", { d: "M9 17h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileDigit = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["rect", { width: "4", height: "6", x: "2", y: "12", rx: "2" }],
  ["path", { d: "M10 12h2v6" }],
  ["path", { d: "M10 18h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileDown = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M12 18v-6" }],
  ["path", { d: "m9 15 3 3 3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileHeart = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v2" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  [
    "path",
    {
      d: "M10.29 10.7a2.43 2.43 0 0 0-2.66-.52c-.29.12-.56.3-.78.53l-.35.34-.35-.34a2.43 2.43 0 0 0-2.65-.53c-.3.12-.56.3-.79.53-.95.94-1 2.53.2 3.74L6.5 18l3.6-3.55c1.2-1.21 1.14-2.8.19-3.74Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileImage = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["circle", { cx: "10", cy: "12", r: "2" }],
  ["path", { d: "m20 17-1.296-1.296a2.41 2.41 0 0 0-3.408 0L9 22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileInput = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M2 15h10" }],
  ["path", { d: "m9 18 3-3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileJson2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M4 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" }],
  ["path", { d: "M8 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileJson = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M10 12a1 1 0 0 0-1 1v1a1 1 0 0 1-1 1 1 1 0 0 1 1 1v1a1 1 0 0 0 1 1" }],
  ["path", { d: "M14 18a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1 1 1 0 0 1-1-1v-1a1 1 0 0 0-1-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileKey2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v6" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["circle", { cx: "4", cy: "16", r: "2" }],
  ["path", { d: "m10 10-4.5 4.5" }],
  ["path", { d: "m9 11 1 1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileKey = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["circle", { cx: "10", cy: "16", r: "2" }],
  ["path", { d: "m16 10-4.5 4.5" }],
  ["path", { d: "m15 11 1 1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileLock2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v1" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["rect", { width: "8", height: "5", x: "2", y: "13", rx: "1" }],
  ["path", { d: "M8 13v-2a2 2 0 1 0-4 0v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileLock = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["rect", { width: "8", height: "6", x: "8", y: "12", rx: "1" }],
  ["path", { d: "M10 12v-2a2 2 0 1 1 4 0v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileMinus2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M3 15h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileMinus = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M9 15h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileMusic = [
  ["path", { d: "M10.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v8.4" }],
  ["path", { d: "M8 18v-7.7L16 9v7" }],
  ["circle", { cx: "14", cy: "16", r: "2" }],
  ["circle", { cx: "6", cy: "18", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileOutput = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M4 7V4a2 2 0 0 1 2-2 2 2 0 0 0-2 2" }],
  ["path", { d: "M4.063 20.999a2 2 0 0 0 2 1L18 22a2 2 0 0 0 2-2V7l-5-5H6" }],
  ["path", { d: "m5 11-3 3" }],
  ["path", { d: "m5 17-3-3h10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FilePenLine = [
  [
    "path",
    { d: "m18 5-2.414-2.414A2 2 0 0 0 14.172 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2" }
  ],
  [
    "path",
    {
      d: "M21.378 12.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ],
  ["path", { d: "M8 18h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FilePen = [
  ["path", { d: "M12.5 22H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v9.5" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  [
    "path",
    {
      d: "M13.378 15.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FilePlus2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M3 15h6" }],
  ["path", { d: "M6 12v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FilePlus = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M9 15h6" }],
  ["path", { d: "M12 18v-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileQuestionMark = [
  ["path", { d: "M12 17h.01" }],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" }],
  ["path", { d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileScan = [
  ["path", { d: "M20 10V7l-5-5H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M16 14a2 2 0 0 0-2 2" }],
  ["path", { d: "M20 14a2 2 0 0 1 2 2" }],
  ["path", { d: "M20 22a2 2 0 0 0 2-2" }],
  ["path", { d: "M16 22a2 2 0 0 1-2-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileSearch2 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["circle", { cx: "11.5", cy: "14.5", r: "2.5" }],
  ["path", { d: "M13.3 16.3 15 18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileSearch = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3" }],
  ["path", { d: "m9 18-1.5-1.5" }],
  ["circle", { cx: "5", cy: "14", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileSliders = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M8 12h8" }],
  ["path", { d: "M10 11v2" }],
  ["path", { d: "M8 17h8" }],
  ["path", { d: "M14 16v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileSpreadsheet = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M8 13h2" }],
  ["path", { d: "M14 13h2" }],
  ["path", { d: "M8 17h2" }],
  ["path", { d: "M14 17h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileStack = [
  ["path", { d: "M21 7h-3a2 2 0 0 1-2-2V2" }],
  [
    "path",
    { d: "M21 6v6.5c0 .8-.7 1.5-1.5 1.5h-7c-.8 0-1.5-.7-1.5-1.5v-9c0-.8.7-1.5 1.5-1.5H17Z" }
  ],
  ["path", { d: "M7 8v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H15" }],
  ["path", { d: "M3 12v8.8c0 .3.2.6.4.8.2.2.5.4.8.4H11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileSymlink = [
  ["path", { d: "m10 18 3-3-3-3" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  [
    "path",
    { d: "M4 11V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileTerminal = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m8 16 2-2-2-2" }],
  ["path", { d: "M12 18h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileText = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M10 9H8" }],
  ["path", { d: "M16 13H8" }],
  ["path", { d: "M16 17H8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileType2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M2 13v-1h6v1" }],
  ["path", { d: "M5 12v6" }],
  ["path", { d: "M4 18h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileType = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M9 13v-1h6v1" }],
  ["path", { d: "M12 12v6" }],
  ["path", { d: "M11 18h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileUp = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M12 12v6" }],
  ["path", { d: "m15 15-3-3-3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileVideo2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["rect", { width: "8", height: "6", x: "2", y: "12", rx: "1" }],
  ["path", { d: "m10 15.5 4 2.5v-6l-4 2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileUser = [
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M15 18a3 3 0 1 0-6 0" }],
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" }],
  ["circle", { cx: "12", cy: "13", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileVideo = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m10 11 5 3-5 3v-6Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileVolume2 = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M8 15h.01" }],
  ["path", { d: "M11.5 13.5a2.5 2.5 0 0 1 0 3" }],
  ["path", { d: "M15 12a5 5 0 0 1 0 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileVolume = [
  ["path", { d: "M11 11a5 5 0 0 1 0 6" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M4 6.765V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-.93-.23" }],
  [
    "path",
    {
      d: "M7 10.51a.5.5 0 0 0-.826-.38l-1.893 1.628A1 1 0 0 1 3.63 12H2.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1.129a1 1 0 0 1 .652.242l1.893 1.63a.5.5 0 0 0 .826-.38z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileWarning = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M12 9v4" }],
  ["path", { d: "M12 17h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileX2 = [
  ["path", { d: "M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m8 12.5-5 5" }],
  ["path", { d: "m3 12.5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FileX = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "m14.5 12.5-5 5" }],
  ["path", { d: "m9.5 12.5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const File = [
  ["path", { d: "M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Files = [
  ["path", { d: "M20 7h-3a2 2 0 0 1-2-2V2" }],
  ["path", { d: "M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" }],
  ["path", { d: "M3 7.6v12.8A1.6 1.6 0 0 0 4.6 22h9.8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Film = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M7 3v18" }],
  ["path", { d: "M3 7.5h4" }],
  ["path", { d: "M3 12h18" }],
  ["path", { d: "M3 16.5h4" }],
  ["path", { d: "M17 3v18" }],
  ["path", { d: "M17 7.5h4" }],
  ["path", { d: "M17 16.5h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fingerprint = [
  ["path", { d: "M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" }],
  ["path", { d: "M14 13.12c0 2.38 0 6.38-1 8.88" }],
  ["path", { d: "M17.29 21.02c.12-.6.43-2.3.5-3.02" }],
  ["path", { d: "M2 12a10 10 0 0 1 18-6" }],
  ["path", { d: "M2 16h.01" }],
  ["path", { d: "M21.8 16c.2-2 .131-5.354 0-6" }],
  ["path", { d: "M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" }],
  ["path", { d: "M8.65 22c.21-.66.45-1.32.57-2" }],
  ["path", { d: "M9 6.8a6 6 0 0 1 9 5.2v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FireExtinguisher = [
  ["path", { d: "M15 6.5V3a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v3.5" }],
  ["path", { d: "M9 18h8" }],
  ["path", { d: "M18 3h-3" }],
  ["path", { d: "M11 3a6 6 0 0 0-6 6v11" }],
  ["path", { d: "M5 13h4" }],
  ["path", { d: "M17 10a4 4 0 0 0-8 0v10a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FishOff = [
  [
    "path",
    {
      d: "M18 12.47v.03m0-.5v.47m-.475 5.056A6.744 6.744 0 0 1 15 18c-3.56 0-7.56-2.53-8.5-6 .348-1.28 1.114-2.433 2.121-3.38m3.444-2.088A8.802 8.802 0 0 1 15 6c3.56 0 6.06 2.54 7 6-.309 1.14-.786 2.177-1.413 3.058"
    }
  ],
  [
    "path",
    {
      d: "M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33m7.48-4.372A9.77 9.77 0 0 1 16 6.07m0 11.86a9.77 9.77 0 0 1-1.728-3.618"
    }
  ],
  [
    "path",
    {
      d: "m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98M8.53 3h5.27a2 2 0 0 1 1.98 1.67l.23 1.4M2 2l20 20"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FishSymbol = [["path", { d: "M2 16s9-15 20-4C11 23 2 8 2 8" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fish = [
  [
    "path",
    {
      d: "M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z"
    }
  ],
  ["path", { d: "M18 12v.5" }],
  ["path", { d: "M16 17.93a9.77 9.77 0 0 1 0-11.86" }],
  [
    "path",
    {
      d: "M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33"
    }
  ],
  ["path", { d: "M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4" }],
  ["path", { d: "m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlagOff = [
  ["path", { d: "M16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M4 22V4" }],
  ["path", { d: "M7.656 2H8c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10.347" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlagTriangleLeft = [["path", { d: "M17 22V2L7 7l10 5" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlagTriangleRight = [["path", { d: "M7 22V2l10 5-10 5" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Flag = [
  [
    "path",
    {
      d: "M4 22V4a1 1 0 0 1 .4-.8A6 6 0 0 1 8 2c3 0 5 2 7.333 2q2 0 3.067-.8A1 1 0 0 1 20 4v10a1 1 0 0 1-.4.8A6 6 0 0 1 16 16c-3 0-5-2-8-2a6 6 0 0 0-4 1.528"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlameKindling = [
  [
    "path",
    {
      d: "M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z"
    }
  ],
  ["path", { d: "m5 22 14-4" }],
  ["path", { d: "m5 18 14 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Flame = [
  [
    "path",
    {
      d: "M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlashlightOff = [
  ["path", { d: "M16 16v4a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4" }],
  ["path", { d: "M7 2h11v4c0 2-2 2-2 4v1" }],
  ["line", { x1: "11", x2: "18", y1: "6", y2: "6" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Flashlight = [
  ["path", { d: "M18 6c0 2-2 2-2 4v10a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V10c0-2-2-2-2-4V2h12z" }],
  ["line", { x1: "6", x2: "18", y1: "6", y2: "6" }],
  ["line", { x1: "12", x2: "12", y1: "12", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlaskConical = [
  [
    "path",
    {
      d: "M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"
    }
  ],
  ["path", { d: "M6.453 15h11.094" }],
  ["path", { d: "M8.5 2h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlaskConicalOff = [
  ["path", { d: "M10 2v2.343" }],
  ["path", { d: "M14 2v6.343" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M20 20a2 2 0 0 1-2 2H6a2 2 0 0 1-1.755-2.96l5.227-9.563" }],
  ["path", { d: "M6.453 15H15" }],
  ["path", { d: "M8.5 2h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlaskRound = [
  ["path", { d: "M10 2v6.292a7 7 0 1 0 4 0V2" }],
  ["path", { d: "M5 15h14" }],
  ["path", { d: "M8.5 2h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlipHorizontal2 = [
  ["path", { d: "m3 7 5 5-5 5V7" }],
  ["path", { d: "m21 7-5 5 5 5V7" }],
  ["path", { d: "M12 20v2" }],
  ["path", { d: "M12 14v2" }],
  ["path", { d: "M12 8v2" }],
  ["path", { d: "M12 2v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlipVertical2 = [
  ["path", { d: "m17 3-5 5-5-5h10" }],
  ["path", { d: "m17 21-5-5-5 5h10" }],
  ["path", { d: "M4 12H2" }],
  ["path", { d: "M10 12H8" }],
  ["path", { d: "M16 12h-2" }],
  ["path", { d: "M22 12h-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlipHorizontal = [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h3" }],
  ["path", { d: "M16 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" }],
  ["path", { d: "M12 20v2" }],
  ["path", { d: "M12 14v2" }],
  ["path", { d: "M12 8v2" }],
  ["path", { d: "M12 2v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FlipVertical = [
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v3" }],
  ["path", { d: "M21 16v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3" }],
  ["path", { d: "M4 12H2" }],
  ["path", { d: "M10 12H8" }],
  ["path", { d: "M16 12h-2" }],
  ["path", { d: "M22 12h-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Flower2 = [
  [
    "path",
    {
      d: "M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "2" }],
  ["path", { d: "M12 10v12" }],
  ["path", { d: "M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z" }],
  ["path", { d: "M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Flower = [
  ["circle", { cx: "12", cy: "12", r: "3" }],
  [
    "path",
    {
      d: "M12 16.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 1 1 12 7.5a4.5 4.5 0 1 1 4.5 4.5 4.5 4.5 0 1 1-4.5 4.5"
    }
  ],
  ["path", { d: "M12 7.5V9" }],
  ["path", { d: "M7.5 12H9" }],
  ["path", { d: "M16.5 12H15" }],
  ["path", { d: "M12 16.5V15" }],
  ["path", { d: "m8 8 1.88 1.88" }],
  ["path", { d: "M14.12 9.88 16 8" }],
  ["path", { d: "m8 16 1.88-1.88" }],
  ["path", { d: "M14.12 14.12 16 16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Focus = [
  ["circle", { cx: "12", cy: "12", r: "3" }],
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FoldHorizontal = [
  ["path", { d: "M2 12h6" }],
  ["path", { d: "M22 12h-6" }],
  ["path", { d: "M12 2v2" }],
  ["path", { d: "M12 8v2" }],
  ["path", { d: "M12 14v2" }],
  ["path", { d: "M12 20v2" }],
  ["path", { d: "m19 9-3 3 3 3" }],
  ["path", { d: "m5 15 3-3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FoldVertical = [
  ["path", { d: "M12 22v-6" }],
  ["path", { d: "M12 8V2" }],
  ["path", { d: "M4 12H2" }],
  ["path", { d: "M10 12H8" }],
  ["path", { d: "M16 12h-2" }],
  ["path", { d: "M22 12h-2" }],
  ["path", { d: "m15 19-3-3-3 3" }],
  ["path", { d: "m15 5-3 3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderArchive = [
  ["circle", { cx: "15", cy: "19", r: "2" }],
  [
    "path",
    {
      d: "M20.9 19.8A2 2 0 0 0 22 18V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h5.1"
    }
  ],
  ["path", { d: "M15 11v-1" }],
  ["path", { d: "M15 17v-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderCheck = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ],
  ["path", { d: "m9 13 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderClock = [
  ["path", { d: "M16 14v2.2l1.6 1" }],
  [
    "path",
    {
      d: "M7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2"
    }
  ],
  ["circle", { cx: "16", cy: "16", r: "6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderClosed = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ],
  ["path", { d: "M2 10h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderCode = [
  ["path", { d: "M10 10.5 8 13l2 2.5" }],
  ["path", { d: "m14 10.5 2 2.5-2 2.5" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderCog = [
  [
    "path",
    {
      d: "M10.3 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.98a2 2 0 0 1 1.69.9l.66 1.2A2 2 0 0 0 12 6h8a2 2 0 0 1 2 2v3.3"
    }
  ],
  ["path", { d: "m14.305 19.53.923-.382" }],
  ["path", { d: "m15.228 16.852-.923-.383" }],
  ["path", { d: "m16.852 15.228-.383-.923" }],
  ["path", { d: "m16.852 20.772-.383.924" }],
  ["path", { d: "m19.148 15.228.383-.923" }],
  ["path", { d: "m19.53 21.696-.382-.924" }],
  ["path", { d: "m20.772 16.852.924-.383" }],
  ["path", { d: "m20.772 19.148.924.383" }],
  ["circle", { cx: "18", cy: "18", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderDot = [
  [
    "path",
    {
      d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderDown = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ],
  ["path", { d: "M12 10v6" }],
  ["path", { d: "m15 13-3 3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderGit2 = [
  [
    "path",
    {
      d: "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v5"
    }
  ],
  ["circle", { cx: "13", cy: "12", r: "2" }],
  ["path", { d: "M18 19c-2.8 0-5-2.2-5-5v8" }],
  ["circle", { cx: "20", cy: "19", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderGit = [
  ["circle", { cx: "12", cy: "13", r: "2" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ],
  ["path", { d: "M14 13h3" }],
  ["path", { d: "M7 13h3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderHeart = [
  [
    "path",
    {
      d: "M11 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v1.5"
    }
  ],
  [
    "path",
    {
      d: "M13.9 17.45c-1.2-1.2-1.14-2.8-.2-3.73a2.43 2.43 0 0 1 3.44 0l.36.34.34-.34a2.43 2.43 0 0 1 3.45-.01c.95.95 1 2.53-.2 3.74L17.5 21Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderInput = [
  [
    "path",
    {
      d: "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1"
    }
  ],
  ["path", { d: "M2 13h10" }],
  ["path", { d: "m9 16 3-3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderKanban = [
  [
    "path",
    {
      d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
    }
  ],
  ["path", { d: "M8 10v4" }],
  ["path", { d: "M12 10v2" }],
  ["path", { d: "M16 10v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderKey = [
  ["circle", { cx: "16", cy: "20", r: "2" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2"
    }
  ],
  ["path", { d: "m22 14-4.5 4.5" }],
  ["path", { d: "m21 15 1 1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderLock = [
  ["rect", { width: "8", height: "5", x: "14", y: "17", rx: "1" }],
  [
    "path",
    {
      d: "M10 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v2.5"
    }
  ],
  ["path", { d: "M20 17v-2a2 2 0 1 0-4 0v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderMinus = [
  ["path", { d: "M9 13h6" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderOpen = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderOpenDot = [
  [
    "path",
    {
      d: "m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.9l.82 1.2a2 2 0 0 0 1.66.9H18a2 2 0 0 1 2 2v2"
    }
  ],
  ["circle", { cx: "14", cy: "15", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderOutput = [
  [
    "path",
    {
      d: "M2 7.5V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-1.5"
    }
  ],
  ["path", { d: "M2 13h10" }],
  ["path", { d: "m5 10-3 3 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderPen = [
  [
    "path",
    {
      d: "M2 11.5V5a2 2 0 0 1 2-2h3.9c.7 0 1.3.3 1.7.9l.8 1.2c.4.6 1 .9 1.7.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-9.5"
    }
  ],
  [
    "path",
    {
      d: "M11.378 13.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderPlus = [
  ["path", { d: "M12 10v6" }],
  ["path", { d: "M9 13h6" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderRoot = [
  [
    "path",
    {
      d: "M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"
    }
  ],
  ["circle", { cx: "12", cy: "13", r: "2" }],
  ["path", { d: "M12 15v5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderSearch2 = [
  ["circle", { cx: "11.5", cy: "12.5", r: "2.5" }],
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ],
  ["path", { d: "M13.3 14.3 15 16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderSearch = [
  [
    "path",
    {
      d: "M10.7 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v4.1"
    }
  ],
  ["path", { d: "m21 21-1.9-1.9" }],
  ["circle", { cx: "17", cy: "17", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderSymlink = [
  [
    "path",
    {
      d: "M2 9V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h7"
    }
  ],
  ["path", { d: "m8 16 3-3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderSync = [
  [
    "path",
    {
      d: "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5"
    }
  ],
  ["path", { d: "M12 10v4h4" }],
  ["path", { d: "m12 14 1.535-1.605a5 5 0 0 1 8 1.5" }],
  ["path", { d: "M22 22v-4h-4" }],
  ["path", { d: "m22 18-1.535 1.605a5 5 0 0 1-8-1.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderTree = [
  [
    "path",
    {
      d: "M20 10a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2.5a1 1 0 0 1-.8-.4l-.9-1.2A1 1 0 0 0 15 3h-2a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"
    }
  ],
  [
    "path",
    {
      d: "M20 21a1 1 0 0 0 1-1v-3a1 1 0 0 0-1-1h-2.9a1 1 0 0 1-.88-.55l-.42-.85a1 1 0 0 0-.92-.6H13a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1Z"
    }
  ],
  ["path", { d: "M3 5a2 2 0 0 0 2 2h3" }],
  ["path", { d: "M3 3v13a2 2 0 0 0 2 2h3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderUp = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ],
  ["path", { d: "M12 10v6" }],
  ["path", { d: "m9 13 3-3 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FolderX = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ],
  ["path", { d: "m9.5 10.5 5 5" }],
  ["path", { d: "m14.5 10.5-5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Folders = [
  [
    "path",
    {
      d: "M20 17a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3.9a2 2 0 0 1-1.69-.9l-.81-1.2a2 2 0 0 0-1.67-.9H8a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2Z"
    }
  ],
  ["path", { d: "M2 8v11a2 2 0 0 0 2 2h14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Folder = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Footprints = [
  [
    "path",
    {
      d: "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"
    }
  ],
  [
    "path",
    {
      d: "M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"
    }
  ],
  ["path", { d: "M16 17h4" }],
  ["path", { d: "M4 13h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Forklift = [
  ["path", { d: "M12 12H5a2 2 0 0 0-2 2v5" }],
  ["circle", { cx: "13", cy: "19", r: "2" }],
  ["circle", { cx: "5", cy: "19", r: "2" }],
  ["path", { d: "M8 19h3m5-17v17h6M6 12V7c0-1.1.9-2 2-2h3l5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Forward = [
  ["path", { d: "m15 17 5-5-5-5" }],
  ["path", { d: "M4 18v-2a4 4 0 0 1 4-4h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Frame = [
  ["line", { x1: "22", x2: "2", y1: "6", y2: "6" }],
  ["line", { x1: "22", x2: "2", y1: "18", y2: "18" }],
  ["line", { x1: "6", x2: "6", y1: "2", y2: "22" }],
  ["line", { x1: "18", x2: "18", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Framer = [["path", { d: "M5 16V9h14V2H5l14 14h-7m-7 0 7 7v-7m-7 0h7" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fuel = [
  ["line", { x1: "3", x2: "15", y1: "22", y2: "22" }],
  ["line", { x1: "4", x2: "14", y1: "9", y2: "9" }],
  ["path", { d: "M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" }],
  [
    "path",
    { d: "M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2a2 2 0 0 0 2-2V9.83a2 2 0 0 0-.59-1.42L18 5" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Frown = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M16 16s-1.5-2-4-2-4 2-4 2" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Fullscreen = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ["rect", { width: "10", height: "8", x: "7", y: "8", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FunnelPlus = [
  [
    "path",
    {
      d: "M13.354 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l1.218-1.348"
    }
  ],
  ["path", { d: "M16 6h6" }],
  ["path", { d: "M19 3v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const FunnelX = [
  [
    "path",
    {
      d: "M12.531 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14v6a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341l.427-.473"
    }
  ],
  ["path", { d: "m16.5 3.5 5 5" }],
  ["path", { d: "m21.5 3.5-5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Funnel = [
  [
    "path",
    {
      d: "M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GalleryHorizontalEnd = [
  ["path", { d: "M2 7v10" }],
  ["path", { d: "M6 5v14" }],
  ["rect", { width: "12", height: "18", x: "10", y: "3", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GalleryHorizontal = [
  ["path", { d: "M2 3v18" }],
  ["rect", { width: "12", height: "18", x: "6", y: "3", rx: "2" }],
  ["path", { d: "M22 3v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GalleryThumbnails = [
  ["rect", { width: "18", height: "14", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M4 21h1" }],
  ["path", { d: "M9 21h1" }],
  ["path", { d: "M14 21h1" }],
  ["path", { d: "M19 21h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GalleryVerticalEnd = [
  ["path", { d: "M7 2h10" }],
  ["path", { d: "M5 6h14" }],
  ["rect", { width: "18", height: "12", x: "3", y: "10", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GalleryVertical = [
  ["path", { d: "M3 2h18" }],
  ["rect", { width: "18", height: "12", x: "3", y: "6", rx: "2" }],
  ["path", { d: "M3 22h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gamepad2 = [
  ["line", { x1: "6", x2: "10", y1: "11", y2: "11" }],
  ["line", { x1: "8", x2: "8", y1: "9", y2: "13" }],
  ["line", { x1: "15", x2: "15.01", y1: "12", y2: "12" }],
  ["line", { x1: "18", x2: "18.01", y1: "10", y2: "10" }],
  [
    "path",
    {
      d: "M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gamepad = [
  ["line", { x1: "6", x2: "10", y1: "12", y2: "12" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14" }],
  ["line", { x1: "15", x2: "15.01", y1: "13", y2: "13" }],
  ["line", { x1: "18", x2: "18.01", y1: "11", y2: "11" }],
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gauge = [
  ["path", { d: "m12 14 4-4" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gavel = [
  ["path", { d: "m14.5 12.5-8 8a2.119 2.119 0 1 1-3-3l8-8" }],
  ["path", { d: "m16 16 6-6" }],
  ["path", { d: "m8 8 6-6" }],
  ["path", { d: "m9 7 8 8" }],
  ["path", { d: "m21 11-8-8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gem = [
  ["path", { d: "M6 3h12l4 6-10 13L2 9Z" }],
  ["path", { d: "M11 3 8 9l4 13 4-13-3-6" }],
  ["path", { d: "M2 9h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GeorgianLari = [
  ["path", { d: "M11.5 21a7.5 7.5 0 1 1 7.35-9" }],
  ["path", { d: "M13 12V3" }],
  ["path", { d: "M4 21h16" }],
  ["path", { d: "M9 12V3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ghost = [
  ["path", { d: "M9 10h.01" }],
  ["path", { d: "M15 10h.01" }],
  ["path", { d: "M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 19l2.5 2.5L17 19l3 3V10a8 8 0 0 0-8-8z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gift = [
  ["rect", { x: "3", y: "8", width: "18", height: "4", rx: "1" }],
  ["path", { d: "M12 8v13" }],
  ["path", { d: "M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" }],
  ["path", { d: "M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitBranchPlus = [
  ["path", { d: "M6 3v12" }],
  ["path", { d: "M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" }],
  ["path", { d: "M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" }],
  ["path", { d: "M15 6a9 9 0 0 0-9 9" }],
  ["path", { d: "M18 15v6" }],
  ["path", { d: "M21 18h-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitBranch = [
  ["line", { x1: "6", x2: "6", y1: "3", y2: "15" }],
  ["circle", { cx: "18", cy: "6", r: "3" }],
  ["circle", { cx: "6", cy: "18", r: "3" }],
  ["path", { d: "M18 9a9 9 0 0 1-9 9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitCommitVertical = [
  ["path", { d: "M12 3v6" }],
  ["circle", { cx: "12", cy: "12", r: "3" }],
  ["path", { d: "M12 15v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitCompareArrows = [
  ["circle", { cx: "5", cy: "6", r: "3" }],
  ["path", { d: "M12 6h5a2 2 0 0 1 2 2v7" }],
  ["path", { d: "m15 9-3-3 3-3" }],
  ["circle", { cx: "19", cy: "18", r: "3" }],
  ["path", { d: "M12 18H7a2 2 0 0 1-2-2V9" }],
  ["path", { d: "m9 15 3 3-3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitCommitHorizontal = [
  ["circle", { cx: "12", cy: "12", r: "3" }],
  ["line", { x1: "3", x2: "9", y1: "12", y2: "12" }],
  ["line", { x1: "15", x2: "21", y1: "12", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitCompare = [
  ["circle", { cx: "18", cy: "18", r: "3" }],
  ["circle", { cx: "6", cy: "6", r: "3" }],
  ["path", { d: "M13 6h3a2 2 0 0 1 2 2v7" }],
  ["path", { d: "M11 18H8a2 2 0 0 1-2-2V9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitFork = [
  ["circle", { cx: "12", cy: "18", r: "3" }],
  ["circle", { cx: "6", cy: "6", r: "3" }],
  ["circle", { cx: "18", cy: "6", r: "3" }],
  ["path", { d: "M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9" }],
  ["path", { d: "M12 12v3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitGraph = [
  ["circle", { cx: "5", cy: "6", r: "3" }],
  ["path", { d: "M5 9v6" }],
  ["circle", { cx: "5", cy: "18", r: "3" }],
  ["path", { d: "M12 3v18" }],
  ["circle", { cx: "19", cy: "6", r: "3" }],
  ["path", { d: "M16 15.7A9 9 0 0 0 19 9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitMerge = [
  ["circle", { cx: "18", cy: "18", r: "3" }],
  ["circle", { cx: "6", cy: "6", r: "3" }],
  ["path", { d: "M6 21V9a9 9 0 0 0 9 9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitPullRequestArrow = [
  ["circle", { cx: "5", cy: "6", r: "3" }],
  ["path", { d: "M5 9v12" }],
  ["circle", { cx: "19", cy: "18", r: "3" }],
  ["path", { d: "m15 9-3-3 3-3" }],
  ["path", { d: "M12 6h5a2 2 0 0 1 2 2v7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitPullRequestClosed = [
  ["circle", { cx: "6", cy: "6", r: "3" }],
  ["path", { d: "M6 9v12" }],
  ["path", { d: "m21 3-6 6" }],
  ["path", { d: "m21 9-6-6" }],
  ["path", { d: "M18 11.5V15" }],
  ["circle", { cx: "18", cy: "18", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitPullRequestCreateArrow = [
  ["circle", { cx: "5", cy: "6", r: "3" }],
  ["path", { d: "M5 9v12" }],
  ["path", { d: "m15 9-3-3 3-3" }],
  ["path", { d: "M12 6h5a2 2 0 0 1 2 2v3" }],
  ["path", { d: "M19 15v6" }],
  ["path", { d: "M22 18h-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitPullRequestCreate = [
  ["circle", { cx: "6", cy: "6", r: "3" }],
  ["path", { d: "M6 9v12" }],
  ["path", { d: "M13 6h3a2 2 0 0 1 2 2v3" }],
  ["path", { d: "M18 15v6" }],
  ["path", { d: "M21 18h-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitPullRequestDraft = [
  ["circle", { cx: "18", cy: "18", r: "3" }],
  ["circle", { cx: "6", cy: "6", r: "3" }],
  ["path", { d: "M18 6V5" }],
  ["path", { d: "M18 11v-1" }],
  ["line", { x1: "6", x2: "6", y1: "9", y2: "21" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GitPullRequest = [
  ["circle", { cx: "18", cy: "18", r: "3" }],
  ["circle", { cx: "6", cy: "6", r: "3" }],
  ["path", { d: "M13 6h3a2 2 0 0 1 2 2v7" }],
  ["line", { x1: "6", x2: "6", y1: "9", y2: "21" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Github = [
  [
    "path",
    {
      d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
    }
  ],
  ["path", { d: "M9 18c-4.51 2-5-2-7-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gitlab = [
  [
    "path",
    {
      d: "m22 13.29-3.33-10a.42.42 0 0 0-.14-.18.38.38 0 0 0-.22-.11.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18l-2.26 6.67H8.32L6.1 3.26a.42.42 0 0 0-.1-.18.38.38 0 0 0-.26-.08.39.39 0 0 0-.23.07.42.42 0 0 0-.14.18L2 13.29a.74.74 0 0 0 .27.83L12 21l9.69-6.88a.71.71 0 0 0 .31-.83Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GlassWater = [
  [
    "path",
    {
      d: "M5.116 4.104A1 1 0 0 1 6.11 3h11.78a1 1 0 0 1 .994 1.105L17.19 20.21A2 2 0 0 1 15.2 22H8.8a2 2 0 0 1-2-1.79z"
    }
  ],
  ["path", { d: "M6 12a5 5 0 0 1 6 0 5 5 0 0 0 6 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Glasses = [
  ["circle", { cx: "6", cy: "15", r: "4" }],
  ["circle", { cx: "18", cy: "15", r: "4" }],
  ["path", { d: "M14 15a2 2 0 0 0-2-2 2 2 0 0 0-2 2" }],
  ["path", { d: "M2.5 13 5 7c.7-1.3 1.4-2 3-2" }],
  ["path", { d: "M21.5 13 19 7c-.7-1.3-1.5-2-3-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GlobeLock = [
  ["path", { d: "M15.686 15A14.5 14.5 0 0 1 12 22a14.5 14.5 0 0 1 0-20 10 10 0 1 0 9.542 13" }],
  ["path", { d: "M2 12h8.5" }],
  ["path", { d: "M20 6V4a2 2 0 1 0-4 0v2" }],
  ["rect", { width: "8", height: "5", x: "14", y: "6", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Globe = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" }],
  ["path", { d: "M2 12h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Goal = [
  ["path", { d: "M12 13V2l8 4-8 4" }],
  ["path", { d: "M20.561 10.222a9 9 0 1 1-12.55-5.29" }],
  ["path", { d: "M8.002 9.997a5 5 0 1 0 8.9 2.02" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Grab = [
  ["path", { d: "M18 11.5V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" }],
  ["path", { d: "M14 10V8a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" }],
  ["path", { d: "M10 9.9V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v5" }],
  ["path", { d: "M6 14a2 2 0 0 0-2-2a2 2 0 0 0-2 2" }],
  ["path", { d: "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-4a8 8 0 0 1-8-8 2 2 0 1 1 4 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GraduationCap = [
  [
    "path",
    {
      d: "M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"
    }
  ],
  ["path", { d: "M22 10v6" }],
  ["path", { d: "M6 12.5V16a6 3 0 0 0 12 0v-3.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Gpu = [
  ["path", { d: "M2 21V3" }],
  ["path", { d: "M2 5h18a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2.26" }],
  ["path", { d: "M7 17v3a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-3" }],
  ["circle", { cx: "16", cy: "11", r: "2" }],
  ["circle", { cx: "8", cy: "11", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Grape = [
  ["path", { d: "M22 5V2l-5.89 5.89" }],
  ["circle", { cx: "16.6", cy: "15.89", r: "3" }],
  ["circle", { cx: "8.11", cy: "7.4", r: "3" }],
  ["circle", { cx: "12.35", cy: "11.65", r: "3" }],
  ["circle", { cx: "13.91", cy: "5.85", r: "3" }],
  ["circle", { cx: "18.15", cy: "10.09", r: "3" }],
  ["circle", { cx: "6.56", cy: "13.2", r: "3" }],
  ["circle", { cx: "10.8", cy: "17.44", r: "3" }],
  ["circle", { cx: "5", cy: "19", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Grid2x2Check = [
  [
    "path",
    {
      d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3"
    }
  ],
  ["path", { d: "m16 19 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Grid2x2X = [
  [
    "path",
    {
      d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3"
    }
  ],
  ["path", { d: "m16 16 5 5" }],
  ["path", { d: "m16 21 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Grid2x2Plus = [
  [
    "path",
    {
      d: "M12 3v17a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1H3"
    }
  ],
  ["path", { d: "M16 19h6" }],
  ["path", { d: "M19 22v-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Grid2x2 = [
  ["path", { d: "M12 3v18" }],
  ["path", { d: "M3 12h18" }],
  ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Grid3x2 = [
  ["path", { d: "M15 3v18" }],
  ["path", { d: "M3 12h18" }],
  ["path", { d: "M9 3v18" }],
  ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Grid3x3 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 9h18" }],
  ["path", { d: "M3 15h18" }],
  ["path", { d: "M9 3v18" }],
  ["path", { d: "M15 3v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GripHorizontal = [
  ["circle", { cx: "12", cy: "9", r: "1" }],
  ["circle", { cx: "19", cy: "9", r: "1" }],
  ["circle", { cx: "5", cy: "9", r: "1" }],
  ["circle", { cx: "12", cy: "15", r: "1" }],
  ["circle", { cx: "19", cy: "15", r: "1" }],
  ["circle", { cx: "5", cy: "15", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Grip = [
  ["circle", { cx: "12", cy: "5", r: "1" }],
  ["circle", { cx: "19", cy: "5", r: "1" }],
  ["circle", { cx: "5", cy: "5", r: "1" }],
  ["circle", { cx: "12", cy: "12", r: "1" }],
  ["circle", { cx: "19", cy: "12", r: "1" }],
  ["circle", { cx: "5", cy: "12", r: "1" }],
  ["circle", { cx: "12", cy: "19", r: "1" }],
  ["circle", { cx: "19", cy: "19", r: "1" }],
  ["circle", { cx: "5", cy: "19", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const GripVertical = [
  ["circle", { cx: "9", cy: "12", r: "1" }],
  ["circle", { cx: "9", cy: "5", r: "1" }],
  ["circle", { cx: "9", cy: "19", r: "1" }],
  ["circle", { cx: "15", cy: "12", r: "1" }],
  ["circle", { cx: "15", cy: "5", r: "1" }],
  ["circle", { cx: "15", cy: "19", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Group = [
  ["path", { d: "M3 7V5c0-1.1.9-2 2-2h2" }],
  ["path", { d: "M17 3h2c1.1 0 2 .9 2 2v2" }],
  ["path", { d: "M21 17v2c0 1.1-.9 2-2 2h-2" }],
  ["path", { d: "M7 21H5c-1.1 0-2-.9-2-2v-2" }],
  ["rect", { width: "7", height: "5", x: "7", y: "7", rx: "1" }],
  ["rect", { width: "7", height: "5", x: "10", y: "12", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Guitar = [
  ["path", { d: "m11.9 12.1 4.514-4.514" }],
  [
    "path",
    {
      d: "M20.1 2.3a1 1 0 0 0-1.4 0l-1.114 1.114A2 2 0 0 0 17 4.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 17.828 7h1.344a2 2 0 0 0 1.414-.586L21.7 5.3a1 1 0 0 0 0-1.4z"
    }
  ],
  ["path", { d: "m6 16 2 2" }],
  [
    "path",
    {
      d: "M8.23 9.85A3 3 0 0 1 11 8a5 5 0 0 1 5 5 3 3 0 0 1-1.85 2.77l-.92.38A2 2 0 0 0 12 18a4 4 0 0 1-4 4 6 6 0 0 1-6-6 4 4 0 0 1 4-4 2 2 0 0 0 1.85-1.23z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ham = [
  ["path", { d: "M13.144 21.144A7.274 10.445 45 1 0 2.856 10.856" }],
  [
    "path",
    { d: "M13.144 21.144A7.274 4.365 45 0 0 2.856 10.856a7.274 4.365 45 0 0 10.288 10.288" }
  ],
  [
    "path",
    {
      d: "M16.565 10.435 18.6 8.4a2.501 2.501 0 1 0 1.65-4.65 2.5 2.5 0 1 0-4.66 1.66l-2.024 2.025"
    }
  ],
  ["path", { d: "m8.5 16.5-1-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hamburger = [
  ["path", { d: "M12 16H4a2 2 0 1 1 0-4h16a2 2 0 1 1 0 4h-4.25" }],
  ["path", { d: "M5 12a2 2 0 0 1-2-2 9 7 0 0 1 18 0 2 2 0 0 1-2 2" }],
  ["path", { d: "M5 16a2 2 0 0 0-2 2 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 2 2 0 0 0-2-2q0 0 0 0" }],
  ["path", { d: "m6.67 12 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hammer = [
  ["path", { d: "m15 12-8.373 8.373a1 1 0 1 1-3-3L12 9" }],
  ["path", { d: "m18 15 4-4" }],
  [
    "path",
    {
      d: "m21.5 11.5-1.914-1.914A2 2 0 0 1 19 8.172V7l-2.26-2.26a6 6 0 0 0-4.202-1.756L9 2.96l.92.82A6.18 6.18 0 0 1 12 8.4V10l2 2h1.172a2 2 0 0 1 1.414.586L18.5 14.5"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HandCoins = [
  ["path", { d: "M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" }],
  [
    "path",
    {
      d: "m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"
    }
  ],
  ["path", { d: "m2 16 6 6" }],
  ["circle", { cx: "16", cy: "9", r: "2.9" }],
  ["circle", { cx: "6", cy: "5", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HandHeart = [
  ["path", { d: "M11 14h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 16" }],
  [
    "path",
    {
      d: "m7 20 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"
    }
  ],
  ["path", { d: "m2 15 6 6" }],
  [
    "path",
    {
      d: "M19.5 8.5c.7-.7 1.5-1.6 1.5-2.7A2.73 2.73 0 0 0 16 4a2.78 2.78 0 0 0-5 1.8c0 1.2.8 2 1.5 2.8L16 12Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HandHelping = [
  ["path", { d: "M11 12h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 14" }],
  [
    "path",
    {
      d: "m7 18 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9"
    }
  ],
  ["path", { d: "m2 13 6 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HandMetal = [
  ["path", { d: "M18 12.5V10a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1.4" }],
  ["path", { d: "M14 11V9a2 2 0 1 0-4 0v2" }],
  ["path", { d: "M10 10.5V5a2 2 0 1 0-4 0v9" }],
  [
    "path",
    {
      d: "m7 15-1.76-1.76a2 2 0 0 0-2.83 2.82l3.6 3.6C7.5 21.14 9.2 22 12 22h2a8 8 0 0 0 8-8V7a2 2 0 1 0-4 0v5"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HandPlatter = [
  ["path", { d: "M12 3V2" }],
  [
    "path",
    {
      d: "m15.4 17.4 3.2-2.8a2 2 0 1 1 2.8 2.9l-3.6 3.3c-.7.8-1.7 1.2-2.8 1.2h-4c-1.1 0-2.1-.4-2.8-1.2l-1.302-1.464A1 1 0 0 0 6.151 19H5"
    }
  ],
  ["path", { d: "M2 14h12a2 2 0 0 1 0 4h-2" }],
  ["path", { d: "M4 10h16" }],
  ["path", { d: "M5 10a7 7 0 0 1 14 0" }],
  ["path", { d: "M5 14v6a1 1 0 0 1-1 1H2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hand = [
  ["path", { d: "M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2" }],
  ["path", { d: "M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2" }],
  ["path", { d: "M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8" }],
  [
    "path",
    {
      d: "M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Handshake = [
  ["path", { d: "m11 17 2 2a1 1 0 1 0 3-3" }],
  [
    "path",
    {
      d: "m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"
    }
  ],
  ["path", { d: "m21 3 1 11h-2" }],
  ["path", { d: "M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" }],
  ["path", { d: "M3 4h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HardDriveDownload = [
  ["path", { d: "M12 2v8" }],
  ["path", { d: "m16 6-4 4-4-4" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2" }],
  ["path", { d: "M6 18h.01" }],
  ["path", { d: "M10 18h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HardDriveUpload = [
  ["path", { d: "m16 6-4-4-4 4" }],
  ["path", { d: "M12 2v8" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2" }],
  ["path", { d: "M6 18h.01" }],
  ["path", { d: "M10 18h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HardDrive = [
  ["line", { x1: "22", x2: "2", y1: "12", y2: "12" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
    }
  ],
  ["line", { x1: "6", x2: "6.01", y1: "16", y2: "16" }],
  ["line", { x1: "10", x2: "10.01", y1: "16", y2: "16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HardHat = [
  ["path", { d: "M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" }],
  ["path", { d: "M14 6a6 6 0 0 1 6 6v3" }],
  ["path", { d: "M4 15v-3a6 6 0 0 1 6-6" }],
  ["rect", { x: "2", y: "15", width: "20", height: "4", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hash = [
  ["line", { x1: "4", x2: "20", y1: "9", y2: "9" }],
  ["line", { x1: "4", x2: "20", y1: "15", y2: "15" }],
  ["line", { x1: "10", x2: "8", y1: "3", y2: "21" }],
  ["line", { x1: "16", x2: "14", y1: "3", y2: "21" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Haze = [
  ["path", { d: "m5.2 6.2 1.4 1.4" }],
  ["path", { d: "M2 13h2" }],
  ["path", { d: "M20 13h2" }],
  ["path", { d: "m17.4 7.6 1.4-1.4" }],
  ["path", { d: "M22 17H2" }],
  ["path", { d: "M22 21H2" }],
  ["path", { d: "M16 13a4 4 0 0 0-8 0" }],
  ["path", { d: "M12 5V2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HdmiPort = [
  [
    "path",
    { d: "M22 9a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h1l2 2h12l2-2h1a1 1 0 0 0 1-1Z" }
  ],
  ["path", { d: "M7.5 12h9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Heading1 = [
  ["path", { d: "M4 12h8" }],
  ["path", { d: "M4 18V6" }],
  ["path", { d: "M12 18V6" }],
  ["path", { d: "m17 12 3-2v8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Heading2 = [
  ["path", { d: "M4 12h8" }],
  ["path", { d: "M4 18V6" }],
  ["path", { d: "M12 18V6" }],
  ["path", { d: "M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Heading4 = [
  ["path", { d: "M12 18V6" }],
  ["path", { d: "M17 10v3a1 1 0 0 0 1 1h3" }],
  ["path", { d: "M21 10v8" }],
  ["path", { d: "M4 12h8" }],
  ["path", { d: "M4 18V6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Heading3 = [
  ["path", { d: "M4 12h8" }],
  ["path", { d: "M4 18V6" }],
  ["path", { d: "M12 18V6" }],
  ["path", { d: "M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2" }],
  ["path", { d: "M17 17.5c2 1.5 4 .3 4-1.5a2 2 0 0 0-2-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Heading5 = [
  ["path", { d: "M4 12h8" }],
  ["path", { d: "M4 18V6" }],
  ["path", { d: "M12 18V6" }],
  ["path", { d: "M17 13v-3h4" }],
  ["path", { d: "M17 17.7c.4.2.8.3 1.3.3 1.5 0 2.7-1.1 2.7-2.5S19.8 13 18.3 13H17" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Heading6 = [
  ["path", { d: "M4 12h8" }],
  ["path", { d: "M4 18V6" }],
  ["path", { d: "M12 18V6" }],
  ["circle", { cx: "19", cy: "16", r: "2" }],
  ["path", { d: "M20 10c-2 2-3 3.5-3 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Heading = [
  ["path", { d: "M6 12h12" }],
  ["path", { d: "M6 20V4" }],
  ["path", { d: "M18 20V4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HeadphoneOff = [
  ["path", { d: "M21 14h-1.343" }],
  ["path", { d: "M9.128 3.47A9 9 0 0 1 21 12v3.343" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M20.414 20.414A2 2 0 0 1 19 21h-1a2 2 0 0 1-2-2v-3" }],
  ["path", { d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 2.636-6.364" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Headphones = [
  [
    "path",
    {
      d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Headset = [
  [
    "path",
    {
      d: "M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"
    }
  ],
  ["path", { d: "M21 16v2a4 4 0 0 1-4 4h-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HeartCrack = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
    }
  ],
  ["path", { d: "m12 13-1-1 2-2-3-3 2-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HeartHandshake = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
    }
  ],
  [
    "path",
    {
      d: "M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66"
    }
  ],
  ["path", { d: "m18 15-2-2" }],
  ["path", { d: "m15 18-2-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HeartMinus = [
  [
    "path",
    {
      d: "M13.5 19.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5A5.5 5.5 0 0 1 7.5 3c1.76 0 3 .5 4.5 2 1.5-1.5 2.74-2 4.5-2a5.5 5.5 0 0 1 5.402 6.5"
    }
  ],
  ["path", { d: "M15 15h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HeartOff = [
  ["line", { x1: "2", y1: "2", x2: "22", y2: "22" }],
  ["path", { d: "M16.5 16.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5a5.5 5.5 0 0 1 2.14-4.35" }],
  [
    "path",
    {
      d: "M8.76 3.1c1.15.22 2.13.78 3.24 1.9 1.5-1.5 2.74-2 4.5-2A5.5 5.5 0 0 1 22 8.5c0 2.12-1.3 3.78-2.67 5.17"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HeartPlus = [
  [
    "path",
    {
      d: "M13.5 19.5 12 21l-7-7c-1.5-1.45-3-3.2-3-5.5A5.5 5.5 0 0 1 7.5 3c1.76 0 3 .5 4.5 2 1.5-1.5 2.74-2 4.5-2a5.5 5.5 0 0 1 5.402 6.5"
    }
  ],
  ["path", { d: "M15 15h6" }],
  ["path", { d: "M18 12v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HeartPulse = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
    }
  ],
  ["path", { d: "M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Heart = [
  [
    "path",
    {
      d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Heater = [
  ["path", { d: "M11 8c2-3-2-3 0-6" }],
  ["path", { d: "M15.5 8c2-3-2-3 0-6" }],
  ["path", { d: "M6 10h.01" }],
  ["path", { d: "M6 14h.01" }],
  ["path", { d: "M10 16v-4" }],
  ["path", { d: "M14 16v-4" }],
  ["path", { d: "M18 16v-4" }],
  ["path", { d: "M20 6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3" }],
  ["path", { d: "M5 20v2" }],
  ["path", { d: "M19 20v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hexagon = [
  [
    "path",
    {
      d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Highlighter = [
  ["path", { d: "m9 11-6 6v3h9l3-3" }],
  ["path", { d: "m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const History = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }],
  ["path", { d: "M12 7v5l4 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HopOff = [
  ["path", { d: "M10.82 16.12c1.69.6 3.91.79 5.18.85.28.01.53-.09.7-.27" }],
  [
    "path",
    { d: "M11.14 20.57c.52.24 2.44 1.12 4.08 1.37.46.06.86-.25.9-.71.12-1.52-.3-3.43-.5-4.28" }
  ],
  ["path", { d: "M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .7-.26" }],
  [
    "path",
    { d: "M17.99 5.52a20.83 20.83 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-1.17.1-2.5.02-3.9-.25" }
  ],
  ["path", { d: "M20.57 11.14c.24.52 1.12 2.44 1.37 4.08.04.3-.08.59-.31.75" }],
  [
    "path",
    {
      d: "M4.93 4.93a10 10 0 0 0-.67 13.4c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.85.85 0 0 0 .48-.24"
    }
  ],
  [
    "path",
    { d: "M5.52 17.99c1.05.95 2.91 2.42 4.5 3.15a.8.8 0 0 0 1.13-.68c.2-2.34-.33-5.3-1.57-8.28" }
  ],
  ["path", { d: "M8.35 2.68a10 10 0 0 1 9.98 1.58c.43.35.4.96-.12 1.17-1.5.6-4.3.98-6.07 1.05" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hop = [
  [
    "path",
    { d: "M10.82 16.12c1.69.6 3.91.79 5.18.85.55.03 1-.42.97-.97-.06-1.27-.26-3.5-.85-5.18" }
  ],
  [
    "path",
    {
      d: "M11.5 6.5c1.64 0 5-.38 6.71-1.07.52-.2.55-.82.12-1.17A10 10 0 0 0 4.26 18.33c.35.43.96.4 1.17-.12.69-1.71 1.07-5.07 1.07-6.71 1.34.45 3.1.9 4.88.62a.88.88 0 0 0 .73-.74c.3-2.14-.15-3.5-.61-4.88"
    }
  ],
  [
    "path",
    { d: "M15.62 16.95c.2.85.62 2.76.5 4.28a.77.77 0 0 1-.9.7 16.64 16.64 0 0 1-4.08-1.36" }
  ],
  [
    "path",
    { d: "M16.13 21.05c1.65.63 3.68.84 4.87.91a.9.9 0 0 0 .96-.96 17.68 17.68 0 0 0-.9-4.87" }
  ],
  [
    "path",
    { d: "M16.94 15.62c.86.2 2.77.62 4.29.5a.77.77 0 0 0 .7-.9 16.64 16.64 0 0 0-1.36-4.08" }
  ],
  [
    "path",
    { d: "M17.99 5.52a20.82 20.82 0 0 1 3.15 4.5.8.8 0 0 1-.68 1.13c-2.33.2-5.3-.32-8.27-1.57" }
  ],
  ["path", { d: "M4.93 4.93 3 3a.7.7 0 0 1 0-1" }],
  [
    "path",
    {
      d: "M9.58 12.18c1.24 2.98 1.77 5.95 1.57 8.28a.8.8 0 0 1-1.13.68 20.82 20.82 0 0 1-4.5-3.15"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hospital = [
  ["path", { d: "M12 6v4" }],
  ["path", { d: "M14 14h-4" }],
  ["path", { d: "M14 18h-4" }],
  ["path", { d: "M14 8h-4" }],
  ["path", { d: "M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hotel = [
  ["path", { d: "M10 22v-6.57" }],
  ["path", { d: "M12 11h.01" }],
  ["path", { d: "M12 7h.01" }],
  ["path", { d: "M14 15.43V22" }],
  ["path", { d: "M15 16a5 5 0 0 0-6 0" }],
  ["path", { d: "M16 11h.01" }],
  ["path", { d: "M16 7h.01" }],
  ["path", { d: "M8 11h.01" }],
  ["path", { d: "M8 7h.01" }],
  ["rect", { x: "4", y: "2", width: "16", height: "20", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Hourglass = [
  ["path", { d: "M5 22h14" }],
  ["path", { d: "M5 2h14" }],
  ["path", { d: "M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" }],
  ["path", { d: "M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HousePlug = [
  ["path", { d: "M10 12V8.964" }],
  ["path", { d: "M14 12V8.964" }],
  ["path", { d: "M15 12a1 1 0 0 1 1 1v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2a1 1 0 0 1 1-1z" }],
  [
    "path",
    {
      d: "M8.5 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2h-5a2 2 0 0 1-2-2v-2"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HousePlus = [
  [
    "path",
    {
      d: "M12.662 21H5a2 2 0 0 1-2-2v-9a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v2.475"
    }
  ],
  ["path", { d: "M14.959 12.717A1 1 0 0 0 14 12h-4a1 1 0 0 0-1 1v8" }],
  ["path", { d: "M15 18h6" }],
  ["path", { d: "M18 15v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const HouseWifi = [
  ["path", { d: "M9.5 13.866a4 4 0 0 1 5 .01" }],
  ["path", { d: "M12 17h.01" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    }
  ],
  ["path", { d: "M7 10.754a8 8 0 0 1 10 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const House = [
  ["path", { d: "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" }],
  [
    "path",
    {
      d: "M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IceCreamBowl = [
  [
    "path",
    { d: "M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6m-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0" }
  ],
  ["path", { d: "M12.14 11a3.5 3.5 0 1 1 6.71 0" }],
  ["path", { d: "M15.5 6.5a3.5 3.5 0 1 0-7 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IceCreamCone = [
  ["path", { d: "m7 11 4.08 10.35a1 1 0 0 0 1.84 0L17 11" }],
  ["path", { d: "M17 7A5 5 0 0 0 7 7" }],
  ["path", { d: "M17 7a2 2 0 0 1 0 4H7a2 2 0 0 1 0-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IdCardLanyard = [
  ["path", { d: "M13.5 8h-3" }],
  ["path", { d: "m15 2-1 2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3" }],
  ["path", { d: "M16.899 22A5 5 0 0 0 7.1 22" }],
  ["path", { d: "m9 2 3 6" }],
  ["circle", { cx: "12", cy: "15", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IdCard = [
  ["path", { d: "M16 10h2" }],
  ["path", { d: "M16 14h2" }],
  ["path", { d: "M6.17 15a3 3 0 0 1 5.66 0" }],
  ["circle", { cx: "9", cy: "11", r: "2" }],
  ["rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ImageDown = [
  [
    "path",
    {
      d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"
    }
  ],
  ["path", { d: "m14 19 3 3v-5.5" }],
  ["path", { d: "m17 22 3-3" }],
  ["circle", { cx: "9", cy: "9", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ImageMinus = [
  ["path", { d: "M21 9v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" }],
  ["line", { x1: "16", x2: "22", y1: "5", y2: "5" }],
  ["circle", { cx: "9", cy: "9", r: "2" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ImageOff = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
  ["path", { d: "M10.41 10.41a2 2 0 1 1-2.83-2.83" }],
  ["line", { x1: "13.5", x2: "6", y1: "13.5", y2: "21" }],
  ["line", { x1: "18", x2: "21", y1: "12", y2: "15" }],
  ["path", { d: "M3.59 3.59A1.99 1.99 0 0 0 3 5v14a2 2 0 0 0 2 2h14c.55 0 1.052-.22 1.41-.59" }],
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ImagePlay = [
  ["path", { d: "m11 16-5 5" }],
  ["path", { d: "M11 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6.5" }],
  [
    "path",
    {
      d: "M15.765 22a.5.5 0 0 1-.765-.424V13.38a.5.5 0 0 1 .765-.424l5.878 3.674a1 1 0 0 1 0 1.696z"
    }
  ],
  ["circle", { cx: "9", cy: "9", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ImagePlus = [
  ["path", { d: "M16 5h6" }],
  ["path", { d: "M19 2v6" }],
  ["path", { d: "M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }],
  ["circle", { cx: "9", cy: "9", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ImageUp = [
  [
    "path",
    {
      d: "M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10l-3.1-3.1a2 2 0 0 0-2.814.014L6 21"
    }
  ],
  ["path", { d: "m14 19.5 3-3 3 3" }],
  ["path", { d: "M17 22v-5.5" }],
  ["circle", { cx: "9", cy: "9", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ImageUpscale = [
  ["path", { d: "M16 3h5v5" }],
  ["path", { d: "M17 21h2a2 2 0 0 0 2-2" }],
  ["path", { d: "M21 12v3" }],
  ["path", { d: "m21 3-5 5" }],
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2" }],
  ["path", { d: "m5 21 4.144-4.144a1.21 1.21 0 0 1 1.712 0L13 19" }],
  ["path", { d: "M9 3h3" }],
  ["rect", { x: "3", y: "11", width: "10", height: "10", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Image = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["circle", { cx: "9", cy: "9", r: "2" }],
  ["path", { d: "m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Images = [
  ["path", { d: "M18 22H4a2 2 0 0 1-2-2V6" }],
  ["path", { d: "m22 13-1.296-1.296a2.41 2.41 0 0 0-3.408 0L11 18" }],
  ["circle", { cx: "12", cy: "8", r: "2" }],
  ["rect", { width: "16", height: "16", x: "6", y: "2", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Import = [
  ["path", { d: "M12 3v12" }],
  ["path", { d: "m8 11 4 4 4-4" }],
  ["path", { d: "M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Inbox = [
  ["polyline", { points: "22 12 16 12 14 15 10 15 8 12 2 12" }],
  [
    "path",
    {
      d: "M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IndentDecrease = [
  ["path", { d: "M21 12H11" }],
  ["path", { d: "M21 18H11" }],
  ["path", { d: "M21 6H11" }],
  ["path", { d: "m7 8-4 4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IndentIncrease = [
  ["path", { d: "M21 12H11" }],
  ["path", { d: "M21 18H11" }],
  ["path", { d: "M21 6H11" }],
  ["path", { d: "m3 8 4 4-4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IndianRupee = [
  ["path", { d: "M6 3h12" }],
  ["path", { d: "M6 8h12" }],
  ["path", { d: "m6 13 8.5 8" }],
  ["path", { d: "M6 13h3" }],
  ["path", { d: "M9 13c6.667 0 6.667-10 0-10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Infinity$1 = [
  ["path", { d: "M6 16c5 0 7-8 12-8a4 4 0 0 1 0 8c-5 0-7-8-12-8a4 4 0 1 0 0 8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Info = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M12 16v-4" }],
  ["path", { d: "M12 8h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const InspectionPanel = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M7 7h.01" }],
  ["path", { d: "M17 7h.01" }],
  ["path", { d: "M7 17h.01" }],
  ["path", { d: "M17 17h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Instagram = [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5" }],
  ["path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }],
  ["line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Italic = [
  ["line", { x1: "19", x2: "10", y1: "4", y2: "4" }],
  ["line", { x1: "14", x2: "5", y1: "20", y2: "20" }],
  ["line", { x1: "15", x2: "9", y1: "4", y2: "20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IterationCcw = [
  ["path", { d: "m16 14 4 4-4 4" }],
  ["path", { d: "M20 10a8 8 0 1 0-8 8h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const IterationCw = [
  ["path", { d: "M4 10a8 8 0 1 1 8 8H4" }],
  ["path", { d: "m8 22-4-4 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const JapaneseYen = [
  ["path", { d: "M12 9.5V21m0-11.5L6 3m6 6.5L18 3" }],
  ["path", { d: "M6 15h12" }],
  ["path", { d: "M6 11h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Kanban = [
  ["path", { d: "M6 5v11" }],
  ["path", { d: "M12 5v6" }],
  ["path", { d: "M18 5v14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Joystick = [
  ["path", { d: "M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z" }],
  ["path", { d: "M6 15v-2" }],
  ["path", { d: "M12 15V9" }],
  ["circle", { cx: "12", cy: "6", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const KeyRound = [
  [
    "path",
    {
      d: "M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
    }
  ],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const KeySquare = [
  [
    "path",
    {
      d: "M12.4 2.7a2.5 2.5 0 0 1 3.4 0l5.5 5.5a2.5 2.5 0 0 1 0 3.4l-3.7 3.7a2.5 2.5 0 0 1-3.4 0L8.7 9.8a2.5 2.5 0 0 1 0-3.4z"
    }
  ],
  ["path", { d: "m14 7 3 3" }],
  [
    "path",
    {
      d: "m9.4 10.6-6.814 6.814A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Key = [
  ["path", { d: "m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4" }],
  ["path", { d: "m21 2-9.6 9.6" }],
  ["circle", { cx: "7.5", cy: "15.5", r: "5.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const KeyboardMusic = [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
  ["path", { d: "M6 8h4" }],
  ["path", { d: "M14 8h.01" }],
  ["path", { d: "M18 8h.01" }],
  ["path", { d: "M2 12h20" }],
  ["path", { d: "M6 12v4" }],
  ["path", { d: "M10 12v4" }],
  ["path", { d: "M14 12v4" }],
  ["path", { d: "M18 12v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const KeyboardOff = [
  ["path", { d: "M 20 4 A2 2 0 0 1 22 6" }],
  ["path", { d: "M 22 6 L 22 16.41" }],
  ["path", { d: "M 7 16 L 16 16" }],
  ["path", { d: "M 9.69 4 L 20 4" }],
  ["path", { d: "M14 8h.01" }],
  ["path", { d: "M18 8h.01" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" }],
  ["path", { d: "M6 8h.01" }],
  ["path", { d: "M8 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Keyboard = [
  ["path", { d: "M10 8h.01" }],
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M14 8h.01" }],
  ["path", { d: "M16 12h.01" }],
  ["path", { d: "M18 8h.01" }],
  ["path", { d: "M6 8h.01" }],
  ["path", { d: "M7 16h10" }],
  ["path", { d: "M8 12h.01" }],
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LampCeiling = [
  ["path", { d: "M12 2v5" }],
  ["path", { d: "M14.829 15.998a3 3 0 1 1-5.658 0" }],
  [
    "path",
    {
      d: "M20.92 14.606A1 1 0 0 1 20 16H4a1 1 0 0 1-.92-1.394l3-7A1 1 0 0 1 7 7h10a1 1 0 0 1 .92.606z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LampDesk = [
  [
    "path",
    {
      d: "M10.293 2.293a1 1 0 0 1 1.414 0l2.5 2.5 5.994 1.227a1 1 0 0 1 .506 1.687l-7 7a1 1 0 0 1-1.687-.506l-1.227-5.994-2.5-2.5a1 1 0 0 1 0-1.414z"
    }
  ],
  ["path", { d: "m14.207 4.793-3.414 3.414" }],
  ["path", { d: "M3 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" }],
  ["path", { d: "m9.086 6.5-4.793 4.793a1 1 0 0 0-.18 1.17L7 18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LampFloor = [
  ["path", { d: "M12 10v12" }],
  [
    "path",
    {
      d: "M17.929 7.629A1 1 0 0 1 17 9H7a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 9 2h6a1 1 0 0 1 .928.629z"
    }
  ],
  ["path", { d: "M9 22h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LampWallDown = [
  [
    "path",
    {
      d: "M19.929 18.629A1 1 0 0 1 19 20H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 13h6a1 1 0 0 1 .928.629z"
    }
  ],
  ["path", { d: "M6 3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" }],
  ["path", { d: "M8 6h4a2 2 0 0 1 2 2v5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LampWallUp = [
  [
    "path",
    {
      d: "M19.929 9.629A1 1 0 0 1 19 11H9a1 1 0 0 1-.928-1.371l2-5A1 1 0 0 1 11 4h6a1 1 0 0 1 .928.629z"
    }
  ],
  ["path", { d: "M6 15a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1z" }],
  ["path", { d: "M8 18h4a2 2 0 0 0 2-2v-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lamp = [
  ["path", { d: "M12 12v6" }],
  [
    "path",
    {
      d: "M4.077 10.615A1 1 0 0 0 5 12h14a1 1 0 0 0 .923-1.385l-3.077-7.384A2 2 0 0 0 15 2H9a2 2 0 0 0-1.846 1.23Z"
    }
  ],
  ["path", { d: "M8 20a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LandPlot = [
  ["path", { d: "m12 8 6-3-6-3v10" }],
  [
    "path",
    {
      d: "m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12"
    }
  ],
  ["path", { d: "m6.49 12.85 11.02 6.3" }],
  ["path", { d: "M17.51 12.85 6.5 19.15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Landmark = [
  ["path", { d: "M10 18v-7" }],
  [
    "path",
    {
      d: "M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z"
    }
  ],
  ["path", { d: "M14 18v-7" }],
  ["path", { d: "M18 18v-7" }],
  ["path", { d: "M3 22h18" }],
  ["path", { d: "M6 18v-7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Languages = [
  ["path", { d: "m5 8 6 6" }],
  ["path", { d: "m4 14 6-6 2-3" }],
  ["path", { d: "M2 5h12" }],
  ["path", { d: "M7 2h1" }],
  ["path", { d: "m22 22-5-10-5 10" }],
  ["path", { d: "M14 18h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LaptopMinimalCheck = [
  ["path", { d: "M2 20h20" }],
  ["path", { d: "m9 10 2 2 4-4" }],
  ["rect", { x: "3", y: "4", width: "18", height: "12", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LaptopMinimal = [
  ["rect", { width: "18", height: "12", x: "3", y: "4", rx: "2", ry: "2" }],
  ["line", { x1: "2", x2: "22", y1: "20", y2: "20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Laptop = [
  [
    "path",
    {
      d: "M18 5a2 2 0 0 1 2 2v8.526a2 2 0 0 0 .212.897l1.068 2.127a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45l1.068-2.127A2 2 0 0 0 4 15.526V7a2 2 0 0 1 2-2z"
    }
  ],
  ["path", { d: "M20.054 15.987H3.946" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LassoSelect = [
  ["path", { d: "M7 22a5 5 0 0 1-2-4" }],
  ["path", { d: "M7 16.93c.96.43 1.96.74 2.99.91" }],
  [
    "path",
    { d: "M3.34 14A6.8 6.8 0 0 1 2 10c0-4.42 4.48-8 10-8s10 3.58 10 8a7.19 7.19 0 0 1-.33 2" }
  ],
  ["path", { d: "M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" }],
  [
    "path",
    {
      d: "M14.33 22h-.09a.35.35 0 0 1-.24-.32v-10a.34.34 0 0 1 .33-.34c.08 0 .15.03.21.08l7.34 6a.33.33 0 0 1-.21.59h-4.49l-2.57 3.85a.35.35 0 0 1-.28.14z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lasso = [
  ["path", { d: "M7 22a5 5 0 0 1-2-4" }],
  [
    "path",
    { d: "M3.3 14A6.8 6.8 0 0 1 2 10c0-4.4 4.5-8 10-8s10 3.6 10 8-4.5 8-10 8a12 12 0 0 1-5-1" }
  ],
  ["path", { d: "M5 18a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Laugh = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M18 13a6 6 0 0 1-6 5 6 6 0 0 1-6-5h12Z" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Layers2 = [
  [
    "path",
    {
      d: "M13 13.74a2 2 0 0 1-2 0L2.5 8.87a1 1 0 0 1 0-1.74L11 2.26a2 2 0 0 1 2 0l8.5 4.87a1 1 0 0 1 0 1.74z"
    }
  ],
  [
    "path",
    {
      d: "m20 14.285 1.5.845a1 1 0 0 1 0 1.74L13 21.74a2 2 0 0 1-2 0l-8.5-4.87a1 1 0 0 1 0-1.74l1.5-.845"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Layers = [
  [
    "path",
    {
      d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"
    }
  ],
  ["path", { d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" }],
  ["path", { d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutDashboard = [
  ["rect", { width: "7", height: "9", x: "3", y: "3", rx: "1" }],
  ["rect", { width: "7", height: "5", x: "14", y: "3", rx: "1" }],
  ["rect", { width: "7", height: "9", x: "14", y: "12", rx: "1" }],
  ["rect", { width: "7", height: "5", x: "3", y: "16", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutGrid = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutList = [
  ["rect", { width: "7", height: "7", x: "3", y: "3", rx: "1" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" }],
  ["path", { d: "M14 4h7" }],
  ["path", { d: "M14 9h7" }],
  ["path", { d: "M14 15h7" }],
  ["path", { d: "M14 20h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutPanelLeft = [
  ["rect", { width: "7", height: "18", x: "3", y: "3", rx: "1" }],
  ["rect", { width: "7", height: "7", x: "14", y: "3", rx: "1" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutTemplate = [
  ["rect", { width: "18", height: "7", x: "3", y: "3", rx: "1" }],
  ["rect", { width: "9", height: "7", x: "3", y: "14", rx: "1" }],
  ["rect", { width: "5", height: "7", x: "16", y: "14", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LayoutPanelTop = [
  ["rect", { width: "18", height: "7", x: "3", y: "3", rx: "1" }],
  ["rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" }],
  ["rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Leaf = [
  [
    "path",
    { d: "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" }
  ],
  ["path", { d: "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LeafyGreen = [
  [
    "path",
    {
      d: "M2 22c1.25-.987 2.27-1.975 3.9-2.2a5.56 5.56 0 0 1 3.8 1.5 4 4 0 0 0 6.187-2.353 3.5 3.5 0 0 0 3.69-5.116A3.5 3.5 0 0 0 20.95 8 3.5 3.5 0 1 0 16 3.05a3.5 3.5 0 0 0-5.831 1.373 3.5 3.5 0 0 0-5.116 3.69 4 4 0 0 0-2.348 6.155C3.499 15.42 4.409 16.712 4.2 18.1 3.926 19.743 3.014 20.732 2 22"
    }
  ],
  ["path", { d: "M2 22 17 7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lectern = [
  [
    "path",
    {
      d: "M16 12h3a2 2 0 0 0 1.902-1.38l1.056-3.333A1 1 0 0 0 21 6H3a1 1 0 0 0-.958 1.287l1.056 3.334A2 2 0 0 0 5 12h3"
    }
  ],
  ["path", { d: "M18 6V3a1 1 0 0 0-1-1h-3" }],
  ["rect", { width: "8", height: "12", x: "8", y: "10", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LetterText = [
  ["path", { d: "M15 12h6" }],
  ["path", { d: "M15 6h6" }],
  ["path", { d: "m3 13 3.553-7.724a.5.5 0 0 1 .894 0L11 13" }],
  ["path", { d: "M3 18h18" }],
  ["path", { d: "M3.92 11h6.16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LibraryBig = [
  ["rect", { width: "8", height: "18", x: "3", y: "3", rx: "1" }],
  ["path", { d: "M7 3v18" }],
  [
    "path",
    {
      d: "M20.4 18.9c.2.5-.1 1.1-.6 1.3l-1.9.7c-.5.2-1.1-.1-1.3-.6L11.1 5.1c-.2-.5.1-1.1.6-1.3l1.9-.7c.5-.2 1.1.1 1.3.6Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Library = [
  ["path", { d: "m16 6 4 14" }],
  ["path", { d: "M12 6v14" }],
  ["path", { d: "M8 8v12" }],
  ["path", { d: "M4 4v16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LifeBuoy = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "m4.93 4.93 4.24 4.24" }],
  ["path", { d: "m14.83 9.17 4.24-4.24" }],
  ["path", { d: "m14.83 14.83 4.24 4.24" }],
  ["path", { d: "m9.17 14.83-4.24 4.24" }],
  ["circle", { cx: "12", cy: "12", r: "4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ligature = [
  ["path", { d: "M14 12h2v8" }],
  ["path", { d: "M14 20h4" }],
  ["path", { d: "M6 12h4" }],
  ["path", { d: "M6 20h4" }],
  ["path", { d: "M8 20V8a4 4 0 0 1 7.464-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LightbulbOff = [
  ["path", { d: "M16.8 11.2c.8-.9 1.2-2 1.2-3.2a6 6 0 0 0-9.3-5" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M6.3 6.3a4.67 4.67 0 0 0 1.2 5.2c.7.7 1.3 1.5 1.5 2.5" }],
  ["path", { d: "M9 18h6" }],
  ["path", { d: "M10 22h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lightbulb = [
  [
    "path",
    {
      d: "M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"
    }
  ],
  ["path", { d: "M9 18h6" }],
  ["path", { d: "M10 22h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LineSquiggle = [
  [
    "path",
    { d: "M7 3.5c5-2 7 2.5 3 4C1.5 10 2 15 5 16c5 2 9-10 14-7s.5 13.5-4 12c-5-2.5.5-11 6-2" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Link2Off = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7" }],
  ["path", { d: "M15 7h2a5 5 0 0 1 4 8" }],
  ["line", { x1: "8", x2: "12", y1: "12", y2: "12" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Link2 = [
  ["path", { d: "M9 17H7A5 5 0 0 1 7 7h2" }],
  ["path", { d: "M15 7h2a5 5 0 1 1 0 10h-2" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Link = [
  ["path", { d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" }],
  ["path", { d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Linkedin = [
  ["path", { d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" }],
  ["rect", { width: "4", height: "12", x: "2", y: "9" }],
  ["circle", { cx: "4", cy: "4", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListCheck = [
  ["path", { d: "M11 18H3" }],
  ["path", { d: "m15 18 2 2 4-4" }],
  ["path", { d: "M16 12H3" }],
  ["path", { d: "M16 6H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListChecks = [
  ["path", { d: "m3 17 2 2 4-4" }],
  ["path", { d: "m3 7 2 2 4-4" }],
  ["path", { d: "M13 6h8" }],
  ["path", { d: "M13 12h8" }],
  ["path", { d: "M13 18h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListCollapse = [
  ["path", { d: "M10 12h11" }],
  ["path", { d: "M10 18h11" }],
  ["path", { d: "M10 6h11" }],
  ["path", { d: "m3 10 3-3-3-3" }],
  ["path", { d: "m3 20 3-3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListEnd = [
  ["path", { d: "M16 12H3" }],
  ["path", { d: "M16 6H3" }],
  ["path", { d: "M10 18H3" }],
  ["path", { d: "M21 6v10a2 2 0 0 1-2 2h-5" }],
  ["path", { d: "m16 16-2 2 2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListFilterPlus = [
  ["path", { d: "M10 18h4" }],
  ["path", { d: "M11 6H3" }],
  ["path", { d: "M15 6h6" }],
  ["path", { d: "M18 9V3" }],
  ["path", { d: "M7 12h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListFilter = [
  ["path", { d: "M3 6h18" }],
  ["path", { d: "M7 12h10" }],
  ["path", { d: "M10 18h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListMusic = [
  ["path", { d: "M21 15V6" }],
  ["path", { d: "M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" }],
  ["path", { d: "M12 12H3" }],
  ["path", { d: "M16 6H3" }],
  ["path", { d: "M12 18H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListMinus = [
  ["path", { d: "M11 12H3" }],
  ["path", { d: "M16 6H3" }],
  ["path", { d: "M16 18H3" }],
  ["path", { d: "M21 12h-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListOrdered = [
  ["path", { d: "M10 12h11" }],
  ["path", { d: "M10 18h11" }],
  ["path", { d: "M10 6h11" }],
  ["path", { d: "M4 10h2" }],
  ["path", { d: "M4 6h1v4" }],
  ["path", { d: "M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListPlus = [
  ["path", { d: "M11 12H3" }],
  ["path", { d: "M16 6H3" }],
  ["path", { d: "M16 18H3" }],
  ["path", { d: "M18 9v6" }],
  ["path", { d: "M21 12h-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListRestart = [
  ["path", { d: "M21 6H3" }],
  ["path", { d: "M7 12H3" }],
  ["path", { d: "M7 18H3" }],
  ["path", { d: "M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" }],
  ["path", { d: "M11 10v4h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListStart = [
  ["path", { d: "M16 12H3" }],
  ["path", { d: "M16 18H3" }],
  ["path", { d: "M10 6H3" }],
  ["path", { d: "M21 18V8a2 2 0 0 0-2-2h-5" }],
  ["path", { d: "m16 8-2-2 2-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListVideo = [
  ["path", { d: "M12 12H3" }],
  ["path", { d: "M16 6H3" }],
  ["path", { d: "M12 18H3" }],
  ["path", { d: "m16 12 5 3-5 3v-6Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListTodo = [
  ["rect", { x: "3", y: "5", width: "6", height: "6", rx: "1" }],
  ["path", { d: "m3 17 2 2 4-4" }],
  ["path", { d: "M13 6h8" }],
  ["path", { d: "M13 12h8" }],
  ["path", { d: "M13 18h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListX = [
  ["path", { d: "M11 12H3" }],
  ["path", { d: "M16 6H3" }],
  ["path", { d: "M16 18H3" }],
  ["path", { d: "m19 10-4 4" }],
  ["path", { d: "m15 10 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ListTree = [
  ["path", { d: "M21 12h-8" }],
  ["path", { d: "M21 6H8" }],
  ["path", { d: "M21 18h-8" }],
  ["path", { d: "M3 6v4c0 1.1.9 2 2 2h3" }],
  ["path", { d: "M3 10v6c0 1.1.9 2 2 2h3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const List = [
  ["path", { d: "M3 12h.01" }],
  ["path", { d: "M3 18h.01" }],
  ["path", { d: "M3 6h.01" }],
  ["path", { d: "M8 12h13" }],
  ["path", { d: "M8 18h13" }],
  ["path", { d: "M8 6h13" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LoaderCircle = [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LoaderPinwheel = [
  ["path", { d: "M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" }],
  ["path", { d: "M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" }],
  ["path", { d: "M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Loader = [
  ["path", { d: "M12 2v4" }],
  ["path", { d: "m16.2 7.8 2.9-2.9" }],
  ["path", { d: "M18 12h4" }],
  ["path", { d: "m16.2 16.2 2.9 2.9" }],
  ["path", { d: "M12 18v4" }],
  ["path", { d: "m4.9 19.1 2.9-2.9" }],
  ["path", { d: "M2 12h4" }],
  ["path", { d: "m4.9 4.9 2.9 2.9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LocateFixed = [
  ["line", { x1: "2", x2: "5", y1: "12", y2: "12" }],
  ["line", { x1: "19", x2: "22", y1: "12", y2: "12" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "5" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22" }],
  ["circle", { cx: "12", cy: "12", r: "7" }],
  ["circle", { cx: "12", cy: "12", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LocateOff = [
  ["path", { d: "M12 19v3" }],
  ["path", { d: "M12 2v3" }],
  ["path", { d: "M18.89 13.24a7 7 0 0 0-8.13-8.13" }],
  ["path", { d: "M19 12h3" }],
  ["path", { d: "M2 12h3" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M7.05 7.05a7 7 0 0 0 9.9 9.9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LocationEdit = [
  ["path", { d: "M17.97 9.304A8 8 0 0 0 2 10c0 4.69 4.887 9.562 7.022 11.468" }],
  [
    "path",
    {
      d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ],
  ["circle", { cx: "10", cy: "10", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Locate = [
  ["line", { x1: "2", x2: "5", y1: "12", y2: "12" }],
  ["line", { x1: "19", x2: "22", y1: "12", y2: "12" }],
  ["line", { x1: "12", x2: "12", y1: "2", y2: "5" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22" }],
  ["circle", { cx: "12", cy: "12", r: "7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LockKeyholeOpen = [
  ["circle", { cx: "12", cy: "16", r: "1" }],
  ["rect", { width: "18", height: "12", x: "3", y: "10", rx: "2" }],
  ["path", { d: "M7 10V7a5 5 0 0 1 9.33-2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LockKeyhole = [
  ["circle", { cx: "12", cy: "16", r: "1" }],
  ["rect", { x: "3", y: "10", width: "18", height: "12", rx: "2" }],
  ["path", { d: "M7 10V7a5 5 0 0 1 10 0v3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LockOpen = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 9.9-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lock = [
  ["rect", { width: "18", height: "11", x: "3", y: "11", rx: "2", ry: "2" }],
  ["path", { d: "M7 11V7a5 5 0 0 1 10 0v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LogIn = [
  ["path", { d: "m10 17 5-5-5-5" }],
  ["path", { d: "M15 12H3" }],
  ["path", { d: "M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const LogOut = [
  ["path", { d: "m16 17 5-5-5-5" }],
  ["path", { d: "M21 12H9" }],
  ["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Logs = [
  ["path", { d: "M13 12h8" }],
  ["path", { d: "M13 18h8" }],
  ["path", { d: "M13 6h8" }],
  ["path", { d: "M3 12h1" }],
  ["path", { d: "M3 18h1" }],
  ["path", { d: "M3 6h1" }],
  ["path", { d: "M8 12h1" }],
  ["path", { d: "M8 18h1" }],
  ["path", { d: "M8 6h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Lollipop = [
  ["circle", { cx: "11", cy: "11", r: "8" }],
  ["path", { d: "m21 21-4.3-4.3" }],
  ["path", { d: "M11 11a2 2 0 0 0 4 0 4 4 0 0 0-8 0 6 6 0 0 0 12 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Luggage = [
  ["path", { d: "M6 20a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" }],
  ["path", { d: "M8 18V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14" }],
  ["path", { d: "M10 20h4" }],
  ["circle", { cx: "16", cy: "20", r: "2" }],
  ["circle", { cx: "8", cy: "20", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Magnet = [
  [
    "path",
    {
      d: "m6 15-4-4 6.75-6.77a7.79 7.79 0 0 1 11 11L13 22l-4-4 6.39-6.36a2.14 2.14 0 0 0-3-3L6 15"
    }
  ],
  ["path", { d: "m5 8 4 4" }],
  ["path", { d: "m12 15 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MailCheck = [
  ["path", { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
  ["path", { d: "m16 19 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MailMinus = [
  ["path", { d: "M22 15V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
  ["path", { d: "M16 19h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MailOpen = [
  [
    "path",
    {
      d: "M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z"
    }
  ],
  ["path", { d: "m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MailPlus = [
  ["path", { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
  ["path", { d: "M19 16v6" }],
  ["path", { d: "M16 19h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MailQuestionMark = [
  ["path", { d: "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
  ["path", { d: "M18 15.28c.2-.4.5-.8.9-1a2.1 2.1 0 0 1 2.6.4c.3.4.5.8.5 1.3 0 1.3-2 2-2 2" }],
  ["path", { d: "M20 22v.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MailSearch = [
  ["path", { d: "M22 12.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h7.5" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
  ["path", { d: "M18 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" }],
  ["circle", { cx: "18", cy: "18", r: "3" }],
  ["path", { d: "m22 22-1.5-1.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MailWarning = [
  ["path", { d: "M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h12.5" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
  ["path", { d: "M20 14v4" }],
  ["path", { d: "M20 22v.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MailX = [
  ["path", { d: "M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" }],
  ["path", { d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" }],
  ["path", { d: "m17 17 4 4" }],
  ["path", { d: "m21 17-4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mail = [
  ["path", { d: "m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" }],
  ["rect", { x: "2", y: "4", width: "20", height: "16", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mailbox = [
  ["path", { d: "M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z" }],
  ["polyline", { points: "15,9 18,9 18,11" }],
  ["path", { d: "M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2" }],
  ["line", { x1: "6", x2: "7", y1: "10", y2: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mails = [
  ["rect", { width: "16", height: "13", x: "6", y: "4", rx: "2" }],
  ["path", { d: "m22 7-7.1 3.78c-.57.3-1.23.3-1.8 0L6 7" }],
  ["path", { d: "M2 8v11c0 1.1.9 2 2 2h14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinCheckInside = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
    }
  ],
  ["path", { d: "m9 10 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinCheck = [
  [
    "path",
    {
      d: "M19.43 12.935c.357-.967.57-1.955.57-2.935a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32.197 32.197 0 0 0 .813-.728"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3" }],
  ["path", { d: "m16 18 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinHouse = [
  [
    "path",
    {
      d: "M15 22a1 1 0 0 1-1-1v-4a1 1 0 0 1 .445-.832l3-2a1 1 0 0 1 1.11 0l3 2A1 1 0 0 1 22 17v4a1 1 0 0 1-1 1z"
    }
  ],
  ["path", { d: "M18 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 .601.2" }],
  ["path", { d: "M18 22v-3" }],
  ["circle", { cx: "10", cy: "10", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinMinusInside = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
    }
  ],
  ["path", { d: "M9 10h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinMinus = [
  [
    "path",
    {
      d: "M18.977 14C19.6 12.701 20 11.343 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3" }],
  ["path", { d: "M16 18h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinOff = [
  ["path", { d: "M12.75 7.09a3 3 0 0 1 2.16 2.16" }],
  [
    "path",
    {
      d: "M17.072 17.072c-1.634 2.17-3.527 3.912-4.471 4.727a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 1.432-4.568"
    }
  ],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M8.475 2.818A8 8 0 0 1 20 10c0 1.183-.31 2.377-.81 3.533" }],
  ["path", { d: "M9.13 9.13a3 3 0 0 0 3.74 3.74" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinPlusInside = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
    }
  ],
  ["path", { d: "M12 7v6" }],
  ["path", { d: "M9 10h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinPlus = [
  [
    "path",
    {
      d: "M19.914 11.105A7.298 7.298 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 32 32 0 0 0 .824-.738"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3" }],
  ["path", { d: "M16 18h6" }],
  ["path", { d: "M19 15v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinXInside = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
    }
  ],
  ["path", { d: "m14.5 7.5-5 5" }],
  ["path", { d: "m9.5 7.5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinX = [
  [
    "path",
    {
      d: "M19.752 11.901A7.78 7.78 0 0 0 20 10a8 8 0 0 0-16 0c0 4.993 5.539 10.193 7.399 11.799a1 1 0 0 0 1.202 0 19 19 0 0 0 .09-.077"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3" }],
  ["path", { d: "m21.5 15.5-5 5" }],
  ["path", { d: "m21.5 20.5-5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPin = [
  [
    "path",
    {
      d: "M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"
    }
  ],
  ["circle", { cx: "12", cy: "10", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPinned = [
  [
    "path",
    {
      d: "M18 8c0 3.613-3.869 7.429-5.393 8.795a1 1 0 0 1-1.214 0C9.87 15.429 6 11.613 6 8a6 6 0 0 1 12 0"
    }
  ],
  ["circle", { cx: "12", cy: "8", r: "2" }],
  [
    "path",
    {
      d: "M8.714 14h-3.71a1 1 0 0 0-.948.683l-2.004 6A1 1 0 0 0 3 22h18a1 1 0 0 0 .948-1.316l-2-6a1 1 0 0 0-.949-.684h-3.712"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MapPlus = [
  [
    "path",
    {
      d: "m11 19-1.106-.552a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0l4.212 2.106a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619V12"
    }
  ],
  ["path", { d: "M15 5.764V12" }],
  ["path", { d: "M18 15v6" }],
  ["path", { d: "M21 18h-6" }],
  ["path", { d: "M9 3.236v15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Map$1 = [
  [
    "path",
    {
      d: "M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"
    }
  ],
  ["path", { d: "M15 5.764v15" }],
  ["path", { d: "M9 3.236v15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MarsStroke = [
  ["path", { d: "m14 6 4 4" }],
  ["path", { d: "M17 3h4v4" }],
  ["path", { d: "m21 3-7.75 7.75" }],
  ["circle", { cx: "9", cy: "15", r: "6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mars = [
  ["path", { d: "M16 3h5v5" }],
  ["path", { d: "m21 3-6.75 6.75" }],
  ["circle", { cx: "10", cy: "14", r: "6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Martini = [
  ["path", { d: "M8 22h8" }],
  ["path", { d: "M12 11v11" }],
  ["path", { d: "m19 3-7 8-7-8Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Maximize2 = [
  ["path", { d: "M15 3h6v6" }],
  ["path", { d: "m21 3-7 7" }],
  ["path", { d: "m3 21 7-7" }],
  ["path", { d: "M9 21H3v-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Maximize = [
  ["path", { d: "M8 3H5a2 2 0 0 0-2 2v3" }],
  ["path", { d: "M21 8V5a2 2 0 0 0-2-2h-3" }],
  ["path", { d: "M3 16v3a2 2 0 0 0 2 2h3" }],
  ["path", { d: "M16 21h3a2 2 0 0 0 2-2v-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Medal = [
  [
    "path",
    {
      d: "M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"
    }
  ],
  ["path", { d: "M11 12 5.12 2.2" }],
  ["path", { d: "m13 12 5.88-9.8" }],
  ["path", { d: "M8 7h8" }],
  ["circle", { cx: "12", cy: "17", r: "5" }],
  ["path", { d: "M12 18v-2h-.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MegaphoneOff = [
  ["path", { d: "M11.636 6A13 13 0 0 0 19.4 3.2 1 1 0 0 1 21 4v11.344" }],
  ["path", { d: "M14.378 14.357A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h1" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" }],
  ["path", { d: "M8 8v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Megaphone = [
  [
    "path",
    {
      d: "M11 6a13 13 0 0 0 8.4-2.8A1 1 0 0 1 21 4v12a1 1 0 0 1-1.6.8A13 13 0 0 0 11 14H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
    }
  ],
  ["path", { d: "M6 14a12 12 0 0 0 2.4 7.2 2 2 0 0 0 3.2-2.4A8 8 0 0 1 10 14" }],
  ["path", { d: "M8 6v8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Meh = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["line", { x1: "8", x2: "16", y1: "15", y2: "15" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MemoryStick = [
  ["path", { d: "M6 19v-3" }],
  ["path", { d: "M10 19v-3" }],
  ["path", { d: "M14 19v-3" }],
  ["path", { d: "M18 19v-3" }],
  ["path", { d: "M8 11V9" }],
  ["path", { d: "M16 11V9" }],
  ["path", { d: "M12 11V9" }],
  ["path", { d: "M2 15h20" }],
  [
    "path",
    {
      d: "M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Menu = [
  ["path", { d: "M4 12h16" }],
  ["path", { d: "M4 18h16" }],
  ["path", { d: "M4 6h16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Merge = [
  ["path", { d: "m8 6 4-4 4 4" }],
  ["path", { d: "M12 2v10.3a4 4 0 0 1-1.172 2.872L4 22" }],
  ["path", { d: "m20 22-5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircleCode = [
  ["path", { d: "M10 9.5 8 12l2 2.5" }],
  ["path", { d: "m14 9.5 2 2.5-2 2.5" }],
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircleDashed = [
  ["path", { d: "M13.5 3.1c-.5 0-1-.1-1.5-.1s-1 .1-1.5.1" }],
  ["path", { d: "M19.3 6.8a10.45 10.45 0 0 0-2.1-2.1" }],
  ["path", { d: "M20.9 13.5c.1-.5.1-1 .1-1.5s-.1-1-.1-1.5" }],
  ["path", { d: "M17.2 19.3a10.45 10.45 0 0 0 2.1-2.1" }],
  ["path", { d: "M10.5 20.9c.5.1 1 .1 1.5.1s1-.1 1.5-.1" }],
  ["path", { d: "M3.5 17.5 2 22l4.5-1.5" }],
  ["path", { d: "M3.1 10.5c0 .5-.1 1-.1 1.5s.1 1 .1 1.5" }],
  ["path", { d: "M6.8 4.7a10.45 10.45 0 0 0-2.1 2.1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircleHeart = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }],
  [
    "path",
    {
      d: "M15.8 9.2a2.5 2.5 0 0 0-3.5 0l-.3.4-.35-.3a2.42 2.42 0 1 0-3.2 3.6l3.6 3.5 3.6-3.5c1.2-1.2 1.1-2.7.2-3.7"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircleMore = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }],
  ["path", { d: "M8 12h.01" }],
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M16 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCirclePlus = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }],
  ["path", { d: "M8 12h8" }],
  ["path", { d: "M12 8v8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircleOff = [
  ["path", { d: "M20.5 14.9A9 9 0 0 0 9.1 3.5" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M5.6 5.6C3 8.3 2.2 12.5 4 16l-2 6 6-2c3.4 1.8 7.6 1.1 10.3-1.7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircleQuestionMark = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }],
  ["path", { d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }],
  ["path", { d: "M12 17h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircleReply = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }],
  ["path", { d: "m10 15-3-3 3-3" }],
  ["path", { d: "M7 12h7a2 2 0 0 1 2 2v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircleX = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }],
  ["path", { d: "m15 9-6 6" }],
  ["path", { d: "m9 9 6 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircleWarning = [
  ["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }],
  ["path", { d: "M12 8v4" }],
  ["path", { d: "M12 16h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageCircle = [["path", { d: "M7.9 20A9 9 0 1 0 4 16.1L2 22Z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareCode = [
  ["path", { d: "M10 7.5 8 10l2 2.5" }],
  ["path", { d: "m14 7.5 2 2.5-2 2.5" }],
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareDashed = [
  ["path", { d: "M10 17H7l-4 4v-7" }],
  ["path", { d: "M14 17h1" }],
  ["path", { d: "M14 3h1" }],
  ["path", { d: "M19 3a2 2 0 0 1 2 2" }],
  ["path", { d: "M21 14v1a2 2 0 0 1-2 2" }],
  ["path", { d: "M21 9v1" }],
  ["path", { d: "M3 9v1" }],
  ["path", { d: "M5 3a2 2 0 0 0-2 2" }],
  ["path", { d: "M9 3h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareDiff = [
  ["path", { d: "m5 19-2 2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2" }],
  ["path", { d: "M9 10h6" }],
  ["path", { d: "M12 7v6" }],
  ["path", { d: "M9 17h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareDot = [
  ["path", { d: "M11.7 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2v-2.7" }],
  ["circle", { cx: "18", cy: "6", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareHeart = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }],
  [
    "path",
    {
      d: "M14.8 7.5a1.84 1.84 0 0 0-2.6 0l-.2.3-.3-.3a1.84 1.84 0 1 0-2.4 2.8L12 13l2.7-2.7c.9-.9.8-2.1.1-2.8"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareLock = [
  ["path", { d: "M19 15v-2a2 2 0 1 0-4 0v2" }],
  ["path", { d: "M9 17H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3.5" }],
  ["rect", { x: "13", y: "15", width: "8", height: "5", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareMore = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }],
  ["path", { d: "M8 10h.01" }],
  ["path", { d: "M12 10h.01" }],
  ["path", { d: "M16 10h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareOff = [
  ["path", { d: "M21 15V5a2 2 0 0 0-2-2H9" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M3.6 3.6c-.4.3-.6.8-.6 1.4v16l4-4h10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquarePlus = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }],
  ["path", { d: "M12 7v6" }],
  ["path", { d: "M9 10h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareQuote = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }],
  ["path", { d: "M8 12a2 2 0 0 0 2-2V8H8" }],
  ["path", { d: "M14 12a2 2 0 0 0 2-2V8h-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareReply = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }],
  ["path", { d: "m10 7-3 3 3 3" }],
  ["path", { d: "M17 13v-1a2 2 0 0 0-2-2H7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareShare = [
  ["path", { d: "M21 12v3a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h7" }],
  ["path", { d: "M16 3h5v5" }],
  ["path", { d: "m16 8 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareText = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }],
  ["path", { d: "M13 8H7" }],
  ["path", { d: "M17 12H7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareWarning = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }],
  ["path", { d: "M12 7v2" }],
  ["path", { d: "M12 13h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquareX = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }],
  ["path", { d: "m14.5 7.5-5 5" }],
  ["path", { d: "m9.5 7.5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessageSquare = [
  ["path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MessagesSquare = [
  ["path", { d: "M14 9a2 2 0 0 1-2 2H6l-4 4V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2z" }],
  ["path", { d: "M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MicOff = [
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }],
  ["path", { d: "M18.89 13.23A7.12 7.12 0 0 0 19 12v-2" }],
  ["path", { d: "M5 10v2a7 7 0 0 0 12 5" }],
  ["path", { d: "M15 9.34V5a3 3 0 0 0-5.68-1.33" }],
  ["path", { d: "M9 9v3a3 3 0 0 0 5.12 2.12" }],
  ["line", { x1: "12", x2: "12", y1: "19", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MicVocal = [
  ["path", { d: "m11 7.601-5.994 8.19a1 1 0 0 0 .1 1.298l.817.818a1 1 0 0 0 1.314.087L15.09 12" }],
  [
    "path",
    {
      d: "M16.5 21.174C15.5 20.5 14.372 20 13 20c-2.058 0-3.928 2.356-6 2-2.072-.356-2.775-3.369-1.5-4.5"
    }
  ],
  ["circle", { cx: "16", cy: "7", r: "5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mic = [
  ["path", { d: "M12 19v3" }],
  ["path", { d: "M19 10v2a7 7 0 0 1-14 0v-2" }],
  ["rect", { x: "9", y: "2", width: "6", height: "13", rx: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Microchip = [
  ["path", { d: "M18 12h2" }],
  ["path", { d: "M18 16h2" }],
  ["path", { d: "M18 20h2" }],
  ["path", { d: "M18 4h2" }],
  ["path", { d: "M18 8h2" }],
  ["path", { d: "M4 12h2" }],
  ["path", { d: "M4 16h2" }],
  ["path", { d: "M4 20h2" }],
  ["path", { d: "M4 4h2" }],
  ["path", { d: "M4 8h2" }],
  [
    "path",
    {
      d: "M8 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-1.5c-.276 0-.494.227-.562.495a2 2 0 0 1-3.876 0C9.994 2.227 9.776 2 9.5 2z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Microscope = [
  ["path", { d: "M6 18h8" }],
  ["path", { d: "M3 22h18" }],
  ["path", { d: "M14 22a7 7 0 1 0 0-14h-1" }],
  ["path", { d: "M9 14h2" }],
  ["path", { d: "M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" }],
  ["path", { d: "M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Microwave = [
  ["rect", { width: "20", height: "15", x: "2", y: "4", rx: "2" }],
  ["rect", { width: "8", height: "7", x: "6", y: "8", rx: "1" }],
  ["path", { d: "M18 8v7" }],
  ["path", { d: "M6 19v2" }],
  ["path", { d: "M18 19v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Milestone = [
  ["path", { d: "M12 13v8" }],
  ["path", { d: "M12 3v3" }],
  [
    "path",
    {
      d: "M4 6a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h13a2 2 0 0 0 1.152-.365l3.424-2.317a1 1 0 0 0 0-1.635l-3.424-2.318A2 2 0 0 0 17 6z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MilkOff = [
  ["path", { d: "M8 2h8" }],
  [
    "path",
    {
      d: "M9 2v1.343M15 2v2.789a4 4 0 0 0 .672 2.219l.656.984a4 4 0 0 1 .672 2.22v1.131M7.8 7.8l-.128.192A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-3"
    }
  ],
  ["path", { d: "M7 15a6.47 6.47 0 0 1 5 0 6.472 6.472 0 0 0 3.435.435" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Milk = [
  ["path", { d: "M8 2h8" }],
  [
    "path",
    {
      d: "M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2"
    }
  ],
  ["path", { d: "M7 15a6.472 6.472 0 0 1 5 0 6.47 6.47 0 0 0 5 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Minimize2 = [
  ["path", { d: "m14 10 7-7" }],
  ["path", { d: "M20 10h-6V4" }],
  ["path", { d: "m3 21 7-7" }],
  ["path", { d: "M4 14h6v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Minimize = [
  ["path", { d: "M8 3v3a2 2 0 0 1-2 2H3" }],
  ["path", { d: "M21 8h-3a2 2 0 0 1-2-2V3" }],
  ["path", { d: "M3 16h3a2 2 0 0 1 2 2v3" }],
  ["path", { d: "M16 21v-3a2 2 0 0 1 2-2h3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Minus = [["path", { d: "M5 12h14" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorCheck = [
  ["path", { d: "m9 10 2 2 4-4" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "M8 21h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorCog = [
  ["path", { d: "M12 17v4" }],
  ["path", { d: "m14.305 7.53.923-.382" }],
  ["path", { d: "m15.228 4.852-.923-.383" }],
  ["path", { d: "m16.852 3.228-.383-.924" }],
  ["path", { d: "m16.852 8.772-.383.923" }],
  ["path", { d: "m19.148 3.228.383-.924" }],
  ["path", { d: "m19.53 9.696-.382-.924" }],
  ["path", { d: "m20.772 4.852.924-.383" }],
  ["path", { d: "m20.772 7.148.924.383" }],
  ["path", { d: "M22 13v2a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7" }],
  ["path", { d: "M8 21h8" }],
  ["circle", { cx: "18", cy: "6", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorDot = [
  ["circle", { cx: "19", cy: "6", r: "3" }],
  ["path", { d: "M22 12v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "M8 21h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorDown = [
  ["path", { d: "M12 13V7" }],
  ["path", { d: "m15 10-3 3-3-3" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "M8 21h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorOff = [
  ["path", { d: "M17 17H4a2 2 0 0 1-2-2V5c0-1.5 1-2 1-2" }],
  ["path", { d: "M22 15V5a2 2 0 0 0-2-2H9" }],
  ["path", { d: "M8 21h8" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorPause = [
  ["path", { d: "M10 13V7" }],
  ["path", { d: "M14 13V7" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "M8 21h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorPlay = [
  [
    "path",
    {
      d: "M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z"
    }
  ],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "M8 21h8" }],
  ["rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorSmartphone = [
  ["path", { d: "M18 8V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h8" }],
  ["path", { d: "M10 19v-3.96 3.15" }],
  ["path", { d: "M7 19h5" }],
  ["rect", { width: "6", height: "10", x: "16", y: "12", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorStop = [
  ["path", { d: "M12 17v4" }],
  ["path", { d: "M8 21h8" }],
  ["rect", { x: "2", y: "3", width: "20", height: "14", rx: "2" }],
  ["rect", { x: "9", y: "7", width: "6", height: "6", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorUp = [
  ["path", { d: "m9 10 3-3 3 3" }],
  ["path", { d: "M12 13V7" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "M8 21h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorSpeaker = [
  ["path", { d: "M5.5 20H8" }],
  ["path", { d: "M17 9h.01" }],
  ["rect", { width: "10", height: "16", x: "12", y: "4", rx: "2" }],
  ["path", { d: "M8 6H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h4" }],
  ["circle", { cx: "17", cy: "15", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MonitorX = [
  ["path", { d: "m14.5 12.5-5-5" }],
  ["path", { d: "m9.5 12.5 5-5" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "M8 21h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Monitor = [
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }],
  ["line", { x1: "8", x2: "16", y1: "21", y2: "21" }],
  ["line", { x1: "12", x2: "12", y1: "17", y2: "21" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoonStar = [
  ["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9" }],
  ["path", { d: "M20 3v4" }],
  ["path", { d: "M22 5h-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Moon = [["path", { d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MountainSnow = [
  ["path", { d: "m8 3 4 8 5-5 5 15H2L8 3z" }],
  ["path", { d: "M4.14 15.08c2.62-1.57 5.24-1.43 7.86.42 2.74 1.94 5.49 2 8.23.19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MouseOff = [
  ["path", { d: "M12 6v.343" }],
  ["path", { d: "M18.218 18.218A7 7 0 0 1 5 15V9a7 7 0 0 1 .782-3.218" }],
  ["path", { d: "M19 13.343V9A7 7 0 0 0 8.56 2.902" }],
  ["path", { d: "M22 22 2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mountain = [["path", { d: "m8 3 4 8 5-5 5 15H2L8 3z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MousePointer2 = [
  [
    "path",
    {
      d: "M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MousePointerBan = [
  [
    "path",
    {
      d: "M2.034 2.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.944L8.204 7.545a1 1 0 0 0-.66.66l-1.066 3.443a.5.5 0 0 1-.944.033z"
    }
  ],
  ["circle", { cx: "16", cy: "16", r: "6" }],
  ["path", { d: "m11.8 11.8 8.4 8.4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MousePointerClick = [
  ["path", { d: "M14 4.1 12 6" }],
  ["path", { d: "m5.1 8-2.9-.8" }],
  ["path", { d: "m6 12-1.9 2" }],
  ["path", { d: "M7.2 2.2 8 5.1" }],
  [
    "path",
    {
      d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Mouse = [
  ["rect", { x: "5", y: "2", width: "14", height: "20", rx: "7" }],
  ["path", { d: "M12 6v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MousePointer = [
  ["path", { d: "M12.586 12.586 19 19" }],
  [
    "path",
    {
      d: "M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Move3d = [
  ["path", { d: "M5 3v16h16" }],
  ["path", { d: "m5 19 6-6" }],
  ["path", { d: "m2 6 3-3 3 3" }],
  ["path", { d: "m18 16 3 3-3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveDiagonal2 = [
  ["path", { d: "M19 13v6h-6" }],
  ["path", { d: "M5 11V5h6" }],
  ["path", { d: "m5 5 14 14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveDiagonal = [
  ["path", { d: "M11 19H5v-6" }],
  ["path", { d: "M13 5h6v6" }],
  ["path", { d: "M19 5 5 19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveDownLeft = [
  ["path", { d: "M11 19H5V13" }],
  ["path", { d: "M19 5L5 19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveDownRight = [
  ["path", { d: "M19 13V19H13" }],
  ["path", { d: "M5 5L19 19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveDown = [
  ["path", { d: "M8 18L12 22L16 18" }],
  ["path", { d: "M12 2V22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveHorizontal = [
  ["path", { d: "m18 8 4 4-4 4" }],
  ["path", { d: "M2 12h20" }],
  ["path", { d: "m6 8-4 4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveLeft = [
  ["path", { d: "M6 8L2 12L6 16" }],
  ["path", { d: "M2 12H22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveRight = [
  ["path", { d: "M18 8L22 12L18 16" }],
  ["path", { d: "M2 12H22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveUpLeft = [
  ["path", { d: "M5 11V5H11" }],
  ["path", { d: "M5 5L19 19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveUpRight = [
  ["path", { d: "M13 5H19V11" }],
  ["path", { d: "M19 5L5 19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveUp = [
  ["path", { d: "M8 6L12 2L16 6" }],
  ["path", { d: "M12 2V22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const MoveVertical = [
  ["path", { d: "M12 2v20" }],
  ["path", { d: "m8 18 4 4 4-4" }],
  ["path", { d: "m8 6 4-4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Move = [
  ["path", { d: "M12 2v20" }],
  ["path", { d: "m15 19-3 3-3-3" }],
  ["path", { d: "m19 9 3 3-3 3" }],
  ["path", { d: "M2 12h20" }],
  ["path", { d: "m5 9-3 3 3 3" }],
  ["path", { d: "m9 5 3-3 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Music2 = [
  ["circle", { cx: "8", cy: "18", r: "4" }],
  ["path", { d: "M12 18V2l7 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Music3 = [
  ["circle", { cx: "12", cy: "18", r: "4" }],
  ["path", { d: "M16 18V2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Music4 = [
  ["path", { d: "M9 18V5l12-2v13" }],
  ["path", { d: "m9 9 12-2" }],
  ["circle", { cx: "6", cy: "18", r: "3" }],
  ["circle", { cx: "18", cy: "16", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Music = [
  ["path", { d: "M9 18V5l12-2v13" }],
  ["circle", { cx: "6", cy: "18", r: "3" }],
  ["circle", { cx: "18", cy: "16", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Navigation2Off = [
  ["path", { d: "M9.31 9.31 5 21l7-4 7 4-1.17-3.17" }],
  ["path", { d: "M14.53 8.88 12 2l-1.17 3.17" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Navigation2 = [["polygon", { points: "12 2 19 21 12 17 5 21 12 2" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NavigationOff = [
  ["path", { d: "M8.43 8.43 3 11l8 2 2 8 2.57-5.43" }],
  ["path", { d: "M17.39 11.73 22 2l-9.73 4.61" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Navigation = [["polygon", { points: "3 11 22 2 13 21 11 13 3 11" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Network = [
  ["rect", { x: "16", y: "16", width: "6", height: "6", rx: "1" }],
  ["rect", { x: "2", y: "16", width: "6", height: "6", rx: "1" }],
  ["rect", { x: "9", y: "2", width: "6", height: "6", rx: "1" }],
  ["path", { d: "M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3" }],
  ["path", { d: "M12 12V8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Newspaper = [
  ["path", { d: "M15 18h-5" }],
  ["path", { d: "M18 14h-8" }],
  [
    "path",
    {
      d: "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9a2 2 0 0 1 2-2h2"
    }
  ],
  ["rect", { width: "8", height: "4", x: "10", y: "6", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nfc = [
  ["path", { d: "M6 8.32a7.43 7.43 0 0 1 0 7.36" }],
  ["path", { d: "M9.46 6.21a11.76 11.76 0 0 1 0 11.58" }],
  ["path", { d: "M12.91 4.1a15.91 15.91 0 0 1 .01 15.8" }],
  ["path", { d: "M16.37 2a20.16 20.16 0 0 1 0 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NonBinary = [
  ["path", { d: "M12 2v10" }],
  ["path", { d: "m8.5 4 7 4" }],
  ["path", { d: "m8.5 8 7-4" }],
  ["circle", { cx: "12", cy: "17", r: "5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NotebookPen = [
  ["path", { d: "M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4" }],
  ["path", { d: "M2 6h4" }],
  ["path", { d: "M2 10h4" }],
  ["path", { d: "M2 14h4" }],
  ["path", { d: "M2 18h4" }],
  [
    "path",
    {
      d: "M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NotebookText = [
  ["path", { d: "M2 6h4" }],
  ["path", { d: "M2 10h4" }],
  ["path", { d: "M2 14h4" }],
  ["path", { d: "M2 18h4" }],
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
  ["path", { d: "M9.5 8h5" }],
  ["path", { d: "M9.5 12H16" }],
  ["path", { d: "M9.5 16H14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NotebookTabs = [
  ["path", { d: "M2 6h4" }],
  ["path", { d: "M2 10h4" }],
  ["path", { d: "M2 14h4" }],
  ["path", { d: "M2 18h4" }],
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
  ["path", { d: "M15 2v20" }],
  ["path", { d: "M15 7h5" }],
  ["path", { d: "M15 12h5" }],
  ["path", { d: "M15 17h5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Notebook = [
  ["path", { d: "M2 6h4" }],
  ["path", { d: "M2 10h4" }],
  ["path", { d: "M2 14h4" }],
  ["path", { d: "M2 18h4" }],
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
  ["path", { d: "M16 2v20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NotepadTextDashed = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M12 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["path", { d: "M16 4h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M20 12v2" }],
  ["path", { d: "M20 18v2a2 2 0 0 1-2 2h-1" }],
  ["path", { d: "M13 22h-2" }],
  ["path", { d: "M7 22H6a2 2 0 0 1-2-2v-2" }],
  ["path", { d: "M4 14v-2" }],
  ["path", { d: "M4 8V6a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M8 10h6" }],
  ["path", { d: "M8 14h8" }],
  ["path", { d: "M8 18h5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NotepadText = [
  ["path", { d: "M8 2v4" }],
  ["path", { d: "M12 2v4" }],
  ["path", { d: "M16 2v4" }],
  ["rect", { width: "16", height: "18", x: "4", y: "4", rx: "2" }],
  ["path", { d: "M8 10h6" }],
  ["path", { d: "M8 14h8" }],
  ["path", { d: "M8 18h5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const NutOff = [
  ["path", { d: "M12 4V2" }],
  [
    "path",
    {
      d: "M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592a7.01 7.01 0 0 0 4.125-2.939"
    }
  ],
  ["path", { d: "M19 10v3.343" }],
  [
    "path",
    {
      d: "M12 12c-1.349-.573-1.905-1.005-2.5-2-.546.902-1.048 1.353-2.5 2-1.018-.644-1.46-1.08-2-2-1.028.71-1.69.918-3 1 1.081-1.048 1.757-2.03 2-3 .194-.776.84-1.551 1.79-2.21m11.654 5.997c.887-.457 1.28-.891 1.556-1.787 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4-.74 0-1.461.068-2.15.192"
    }
  ],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Nut = [
  ["path", { d: "M12 4V2" }],
  [
    "path",
    {
      d: "M5 10v4a7.004 7.004 0 0 0 5.277 6.787c.412.104.802.292 1.102.592L12 22l.621-.621c.3-.3.69-.488 1.102-.592A7.003 7.003 0 0 0 19 14v-4"
    }
  ],
  [
    "path",
    {
      d: "M12 4C8 4 4.5 6 4 8c-.243.97-.919 1.952-2 3 1.31-.082 1.972-.29 3-1 .54.92.982 1.356 2 2 1.452-.647 1.954-1.098 2.5-2 .595.995 1.151 1.427 2.5 2 1.31-.621 1.862-1.058 2.5-2 .629.977 1.162 1.423 2.5 2 1.209-.548 1.68-.967 2-2 1.032.916 1.683 1.157 3 1-1.297-1.036-1.758-2.03-2-3-.5-2-4-4-8-4Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const OctagonAlert = [
  ["path", { d: "M12 16h.01" }],
  ["path", { d: "M12 8v4" }],
  [
    "path",
    {
      d: "M15.312 2a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586l-4.688-4.688A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const OctagonMinus = [
  [
    "path",
    {
      d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"
    }
  ],
  ["path", { d: "M8 12h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const OctagonPause = [
  ["path", { d: "M10 15V9" }],
  ["path", { d: "M14 15V9" }],
  [
    "path",
    {
      d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const OctagonX = [
  ["path", { d: "m15 9-6 6" }],
  [
    "path",
    {
      d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"
    }
  ],
  ["path", { d: "m9 9 6 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Octagon = [
  [
    "path",
    {
      d: "M2.586 16.726A2 2 0 0 1 2 15.312V8.688a2 2 0 0 1 .586-1.414l4.688-4.688A2 2 0 0 1 8.688 2h6.624a2 2 0 0 1 1.414.586l4.688 4.688A2 2 0 0 1 22 8.688v6.624a2 2 0 0 1-.586 1.414l-4.688 4.688a2 2 0 0 1-1.414.586H8.688a2 2 0 0 1-1.414-.586z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Omega = [
  [
    "path",
    {
      d: "M3 20h4.5a.5.5 0 0 0 .5-.5v-.282a.52.52 0 0 0-.247-.437 8 8 0 1 1 8.494-.001.52.52 0 0 0-.247.438v.282a.5.5 0 0 0 .5.5H21"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Option = [
  ["path", { d: "M3 3h6l6 18h6" }],
  ["path", { d: "M14 3h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Orbit = [
  ["path", { d: "M20.341 6.484A10 10 0 0 1 10.266 21.85" }],
  ["path", { d: "M3.659 17.516A10 10 0 0 1 13.74 2.152" }],
  ["circle", { cx: "12", cy: "12", r: "3" }],
  ["circle", { cx: "19", cy: "5", r: "2" }],
  ["circle", { cx: "5", cy: "19", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Origami = [
  ["path", { d: "M12 12V4a1 1 0 0 1 1-1h6.297a1 1 0 0 1 .651 1.759l-4.696 4.025" }],
  [
    "path",
    { d: "m12 21-7.414-7.414A2 2 0 0 1 4 12.172V6.415a1.002 1.002 0 0 1 1.707-.707L20 20.009" }
  ],
  [
    "path",
    {
      d: "m12.214 3.381 8.414 14.966a1 1 0 0 1-.167 1.199l-1.168 1.163a1 1 0 0 1-.706.291H6.351a1 1 0 0 1-.625-.219L3.25 18.8a1 1 0 0 1 .631-1.781l4.165.027"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Package2 = [
  ["path", { d: "M12 3v6" }],
  [
    "path",
    {
      d: "M16.76 3a2 2 0 0 1 1.8 1.1l2.23 4.479a2 2 0 0 1 .21.891V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.472a2 2 0 0 1 .211-.894L5.45 4.1A2 2 0 0 1 7.24 3z"
    }
  ],
  ["path", { d: "M3.054 9.013h17.893" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PackageCheck = [
  ["path", { d: "m16 16 2 2 4-4" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PackageMinus = [
  ["path", { d: "M16 16h6" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PackageOpen = [
  ["path", { d: "M12 22v-9" }],
  [
    "path",
    {
      d: "M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z"
    }
  ],
  [
    "path",
    {
      d: "M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13"
    }
  ],
  [
    "path",
    {
      d: "M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PackagePlus = [
  ["path", { d: "M16 16h6" }],
  ["path", { d: "M19 13v6" }],
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PackageSearch = [
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }],
  ["circle", { cx: "18.5", cy: "15.5", r: "2.5" }],
  ["path", { d: "M20.27 17.27 22 19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PackageX = [
  [
    "path",
    {
      d: "M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"
    }
  ],
  ["path", { d: "m7.5 4.27 9 5.15" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7" }],
  ["line", { x1: "12", x2: "12", y1: "22", y2: "12" }],
  ["path", { d: "m17 13 5 5m-5 0 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Package = [
  [
    "path",
    {
      d: "M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"
    }
  ],
  ["path", { d: "M12 22V12" }],
  ["polyline", { points: "3.29 7 12 12 20.71 7" }],
  ["path", { d: "m7.5 4.27 9 5.15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PaintBucket = [
  ["path", { d: "m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" }],
  ["path", { d: "m5 2 5 5" }],
  ["path", { d: "M2 13h15" }],
  ["path", { d: "M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PaintRoller = [
  ["rect", { width: "16", height: "6", x: "2", y: "2", rx: "2" }],
  ["path", { d: "M10 16v-2a2 2 0 0 1 2-2h8a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" }],
  ["rect", { width: "4", height: "6", x: "8", y: "16", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PaintbrushVertical = [
  ["path", { d: "M10 2v2" }],
  ["path", { d: "M14 2v4" }],
  ["path", { d: "M17 2a1 1 0 0 1 1 1v9H6V3a1 1 0 0 1 1-1z" }],
  [
    "path",
    {
      d: "M6 12a1 1 0 0 0-1 1v1a2 2 0 0 0 2 2h2a1 1 0 0 1 1 1v2.9a2 2 0 1 0 4 0V17a1 1 0 0 1 1-1h2a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Paintbrush = [
  ["path", { d: "m14.622 17.897-10.68-2.913" }],
  [
    "path",
    {
      d: "M18.376 2.622a1 1 0 1 1 3.002 3.002L17.36 9.643a.5.5 0 0 0 0 .707l.944.944a2.41 2.41 0 0 1 0 3.408l-.944.944a.5.5 0 0 1-.707 0L8.354 7.348a.5.5 0 0 1 0-.707l.944-.944a2.41 2.41 0 0 1 3.408 0l.944.944a.5.5 0 0 0 .707 0z"
    }
  ],
  [
    "path",
    {
      d: "M9 8c-1.804 2.71-3.97 3.46-6.583 3.948a.507.507 0 0 0-.302.819l7.32 8.883a1 1 0 0 0 1.185.204C12.735 20.405 16 16.792 16 15"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Panda = [
  ["path", { d: "M11.25 17.25h1.5L12 18z" }],
  ["path", { d: "m15 12 2 2" }],
  ["path", { d: "M18 6.5a.5.5 0 0 0-.5-.5" }],
  [
    "path",
    {
      d: "M20.69 9.67a4.5 4.5 0 1 0-7.04-5.5 8.35 8.35 0 0 0-3.3 0 4.5 4.5 0 1 0-7.04 5.5C2.49 11.2 2 12.88 2 14.5 2 19.47 6.48 22 12 22s10-2.53 10-7.5c0-1.62-.48-3.3-1.3-4.83"
    }
  ],
  ["path", { d: "M6 6.5a.495.495 0 0 1 .5-.5" }],
  ["path", { d: "m9 12-2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Palette = [
  [
    "path",
    {
      d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"
    }
  ],
  ["circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor" }],
  ["circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelBottomClose = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 15h18" }],
  ["path", { d: "m15 8-3 3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelBottomDashed = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M14 15h1" }],
  ["path", { d: "M19 15h2" }],
  ["path", { d: "M3 15h2" }],
  ["path", { d: "M9 15h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelBottomOpen = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 15h18" }],
  ["path", { d: "m9 10 3-3 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelBottom = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 15h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelLeftClose = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M9 3v18" }],
  ["path", { d: "m16 15-3-3 3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelLeftDashed = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M9 14v1" }],
  ["path", { d: "M9 19v2" }],
  ["path", { d: "M9 3v2" }],
  ["path", { d: "M9 9v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelLeftOpen = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M9 3v18" }],
  ["path", { d: "m14 9 3 3-3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelLeft = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M9 3v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelRightClose = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M15 3v18" }],
  ["path", { d: "m8 9 3 3-3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelRightDashed = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M15 14v1" }],
  ["path", { d: "M15 19v2" }],
  ["path", { d: "M15 3v2" }],
  ["path", { d: "M15 9v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelRightOpen = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M15 3v18" }],
  ["path", { d: "m10 15-3-3 3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelRight = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M15 3v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelTopClose = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 9h18" }],
  ["path", { d: "m9 16 3-3 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelTopDashed = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M14 9h1" }],
  ["path", { d: "M19 9h2" }],
  ["path", { d: "M3 9h2" }],
  ["path", { d: "M9 9h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelTopOpen = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 9h18" }],
  ["path", { d: "m15 14-3 3-3-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelTop = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 9h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelsLeftBottom = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M9 3v18" }],
  ["path", { d: "M9 15h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelsRightBottom = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 15h12" }],
  ["path", { d: "M15 3v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PanelsTopLeft = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 9h18" }],
  ["path", { d: "M9 21V9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Paperclip = [
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Parentheses = [
  ["path", { d: "M8 21s-4-3-4-9 4-9 4-9" }],
  ["path", { d: "M16 3s4 3 4 9-4 9-4 9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ParkingMeter = [
  ["path", { d: "M11 15h2" }],
  ["path", { d: "M12 12v3" }],
  ["path", { d: "M12 19v3" }],
  [
    "path",
    {
      d: "M15.282 19a1 1 0 0 0 .948-.68l2.37-6.988a7 7 0 1 0-13.2 0l2.37 6.988a1 1 0 0 0 .948.68z"
    }
  ],
  ["path", { d: "M9 9a3 3 0 1 1 6 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PartyPopper = [
  ["path", { d: "M5.8 11.3 2 22l10.7-3.79" }],
  ["path", { d: "M4 3h.01" }],
  ["path", { d: "M22 8h.01" }],
  ["path", { d: "M15 2h.01" }],
  ["path", { d: "M22 20h.01" }],
  [
    "path",
    {
      d: "m22 2-2.24.75a2.9 2.9 0 0 0-1.96 3.12c.1.86-.57 1.63-1.45 1.63h-.38c-.86 0-1.6.6-1.76 1.44L14 10"
    }
  ],
  ["path", { d: "m22 13-.82-.33c-.86-.34-1.82.2-1.98 1.11c-.11.7-.72 1.22-1.43 1.22H17" }],
  ["path", { d: "m11 2 .33.82c.34.86-.2 1.82-1.11 1.98C9.52 4.9 9 5.52 9 6.23V7" }],
  [
    "path",
    {
      d: "M11 13c1.93 1.93 2.83 4.17 2 5-.83.83-3.07-.07-5-2-1.93-1.93-2.83-4.17-2-5 .83-.83 3.07.07 5 2Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pause = [
  ["rect", { x: "14", y: "4", width: "4", height: "16", rx: "1" }],
  ["rect", { x: "6", y: "4", width: "4", height: "16", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PawPrint = [
  ["circle", { cx: "11", cy: "4", r: "2" }],
  ["circle", { cx: "18", cy: "8", r: "2" }],
  ["circle", { cx: "20", cy: "16", r: "2" }],
  [
    "path",
    {
      d: "M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PcCase = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2" }],
  ["path", { d: "M15 14h.01" }],
  ["path", { d: "M9 6h6" }],
  ["path", { d: "M9 10h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PenLine = [
  ["path", { d: "M12 20h9" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PenOff = [
  [
    "path",
    {
      d: "m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982"
    }
  ],
  ["path", { d: "m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PenTool = [
  [
    "path",
    {
      d: "M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"
    }
  ],
  [
    "path",
    {
      d: "m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"
    }
  ],
  ["path", { d: "m2.3 2.3 7.286 7.286" }],
  ["circle", { cx: "11", cy: "11", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pen = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PencilLine = [
  ["path", { d: "M12 20h9" }],
  [
    "path",
    {
      d: "M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"
    }
  ],
  ["path", { d: "m15 5 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PencilOff = [
  [
    "path",
    {
      d: "m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982"
    }
  ],
  ["path", { d: "m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353" }],
  ["path", { d: "m15 5 4 4" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PencilRuler = [
  ["path", { d: "M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13" }],
  ["path", { d: "m8 6 2-2" }],
  ["path", { d: "m18 16 2-2" }],
  ["path", { d: "m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17" }],
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
    }
  ],
  ["path", { d: "m15 5 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pencil = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
    }
  ],
  ["path", { d: "m15 5 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pentagon = [
  [
    "path",
    {
      d: "M10.83 2.38a2 2 0 0 1 2.34 0l8 5.74a2 2 0 0 1 .73 2.25l-3.04 9.26a2 2 0 0 1-1.9 1.37H7.04a2 2 0 0 1-1.9-1.37L2.1 10.37a2 2 0 0 1 .73-2.25z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Percent = [
  ["line", { x1: "19", x2: "5", y1: "5", y2: "19" }],
  ["circle", { cx: "6.5", cy: "6.5", r: "2.5" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PersonStanding = [
  ["circle", { cx: "12", cy: "5", r: "1" }],
  ["path", { d: "m9 20 3-6 3 6" }],
  ["path", { d: "m6 8 6 2 6-2" }],
  ["path", { d: "M12 10v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PhilippinePeso = [
  ["path", { d: "M20 11H4" }],
  ["path", { d: "M20 7H4" }],
  ["path", { d: "M7 21V4a1 1 0 0 1 1-1h4a1 1 0 0 1 0 12H7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PhoneCall = [
  ["path", { d: "M13 2a9 9 0 0 1 9 9" }],
  ["path", { d: "M13 6a5 5 0 0 1 5 5" }],
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PhoneForwarded = [
  ["path", { d: "M14 6h8" }],
  ["path", { d: "m18 2 4 4-4 4" }],
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PhoneIncoming = [
  ["path", { d: "M16 2v6h6" }],
  ["path", { d: "m22 2-6 6" }],
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PhoneMissed = [
  ["path", { d: "m16 2 6 6" }],
  ["path", { d: "m22 2-6 6" }],
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PhoneOff = [
  [
    "path",
    {
      d: "M10.1 13.9a14 14 0 0 0 3.732 2.668 1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2 18 18 0 0 1-12.728-5.272"
    }
  ],
  ["path", { d: "M22 2 2 22" }],
  [
    "path",
    {
      d: "M4.76 13.582A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 .244.473"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PhoneOutgoing = [
  ["path", { d: "m16 8 6-6" }],
  ["path", { d: "M22 8V2h-6" }],
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Phone = [
  [
    "path",
    {
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pi = [
  ["line", { x1: "9", x2: "9", y1: "4", y2: "20" }],
  ["path", { d: "M4 7c0-1.7 1.3-3 3-3h13" }],
  ["path", { d: "M18 20c-1.7 0-3-1.3-3-3V4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Piano = [
  [
    "path",
    {
      d: "M18.5 8c-1.4 0-2.6-.8-3.2-2A6.87 6.87 0 0 0 2 9v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-8.5C22 9.6 20.4 8 18.5 8"
    }
  ],
  ["path", { d: "M2 14h20" }],
  ["path", { d: "M6 14v4" }],
  ["path", { d: "M10 14v4" }],
  ["path", { d: "M14 14v4" }],
  ["path", { d: "M18 14v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pickaxe = [
  ["path", { d: "M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" }],
  [
    "path",
    { d: "M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393" }
  ],
  [
    "path",
    {
      d: "M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"
    }
  ],
  [
    "path",
    {
      d: "M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PictureInPicture2 = [
  ["path", { d: "M21 9V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 1.1.9 2 2 2h4" }],
  ["rect", { width: "10", height: "7", x: "12", y: "13", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PictureInPicture = [
  ["path", { d: "M2 10h6V4" }],
  ["path", { d: "m2 4 6 6" }],
  ["path", { d: "M21 10V7a2 2 0 0 0-2-2h-7" }],
  ["path", { d: "M3 14v2a2 2 0 0 0 2 2h3" }],
  ["rect", { x: "12", y: "14", width: "10", height: "7", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PiggyBank = [
  [
    "path",
    {
      d: "M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"
    }
  ],
  ["path", { d: "M16 10h.01" }],
  ["path", { d: "M2 8v1a2 2 0 0 0 2 2h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PilcrowLeft = [
  ["path", { d: "M14 3v11" }],
  ["path", { d: "M14 9h-3a3 3 0 0 1 0-6h9" }],
  ["path", { d: "M18 3v11" }],
  ["path", { d: "M22 18H2l4-4" }],
  ["path", { d: "m6 22-4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PilcrowRight = [
  ["path", { d: "M10 3v11" }],
  ["path", { d: "M10 9H7a1 1 0 0 1 0-6h8" }],
  ["path", { d: "M14 3v11" }],
  ["path", { d: "m18 14 4 4H2" }],
  ["path", { d: "m22 18-4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pilcrow = [
  ["path", { d: "M13 4v16" }],
  ["path", { d: "M17 4v16" }],
  ["path", { d: "M19 4H9.5a4.5 4.5 0 0 0 0 9H13" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PillBottle = [
  ["path", { d: "M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4" }],
  ["path", { d: "M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" }],
  ["rect", { width: "16", height: "5", x: "4", y: "2", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pill = [
  ["path", { d: "m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" }],
  ["path", { d: "m8.5 8.5 7 7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PinOff = [
  ["path", { d: "M12 17v5" }],
  ["path", { d: "M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pin = [
  ["path", { d: "M12 17v5" }],
  [
    "path",
    {
      d: "M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pipette = [
  [
    "path",
    {
      d: "m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"
    }
  ],
  ["path", { d: "m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z" }],
  ["path", { d: "m2 22 .414-.414" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pizza = [
  ["path", { d: "m12 14-1 1" }],
  ["path", { d: "m13.75 18.25-1.25 1.42" }],
  ["path", { d: "M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12" }],
  ["path", { d: "M18.8 9.3a1 1 0 0 0 2.1 7.7" }],
  [
    "path",
    {
      d: "M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PlaneLanding = [
  ["path", { d: "M2 22h20" }],
  [
    "path",
    {
      d: "M3.77 10.77 2 9l2-4.5 1.1.55c.55.28.9.84.9 1.45s.35 1.17.9 1.45L8 8.5l3-6 1.05.53a2 2 0 0 1 1.09 1.52l.72 5.4a2 2 0 0 0 1.09 1.52l4.4 2.2c.42.22.78.55 1.01.96l.6 1.03c.49.88-.06 1.98-1.06 2.1l-1.18.15c-.47.06-.95-.02-1.37-.24L4.29 11.15a2 2 0 0 1-.52-.38Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PlaneTakeoff = [
  ["path", { d: "M2 22h20" }],
  [
    "path",
    {
      d: "M6.36 17.4 4 17l-2-4 1.1-.55a2 2 0 0 1 1.8 0l.17.1a2 2 0 0 0 1.8 0L8 12 5 6l.9-.45a2 2 0 0 1 2.09.2l4.02 3a2 2 0 0 0 2.1.2l4.19-2.06a2.41 2.41 0 0 1 1.73-.17L21 7a1.4 1.4 0 0 1 .87 1.99l-.38.76c-.23.46-.6.84-1.07 1.08L7.58 17.2a2 2 0 0 1-1.22.18Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plane = [
  [
    "path",
    {
      d: "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Play = [["polygon", { points: "6 3 20 12 6 21 6 3" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plug2 = [
  ["path", { d: "M9 2v6" }],
  ["path", { d: "M15 2v6" }],
  ["path", { d: "M12 17v5" }],
  ["path", { d: "M5 8h14" }],
  ["path", { d: "M6 11V8h12v3a6 6 0 1 1-12 0Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PlugZap = [
  ["path", { d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" }],
  ["path", { d: "m2 22 3-3" }],
  ["path", { d: "M7.5 13.5 10 11" }],
  ["path", { d: "M10.5 16.5 13 14" }],
  ["path", { d: "m18 3-4 4h6l-4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plug = [
  ["path", { d: "M12 22v-5" }],
  ["path", { d: "M9 8V2" }],
  ["path", { d: "M15 8V2" }],
  ["path", { d: "M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Plus = [
  ["path", { d: "M5 12h14" }],
  ["path", { d: "M12 5v14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pocket = [
  ["path", { d: "M20 3a2 2 0 0 1 2 2v6a1 1 0 0 1-20 0V5a2 2 0 0 1 2-2z" }],
  ["path", { d: "m8 10 4 4 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PocketKnife = [
  ["path", { d: "M3 2v1c0 1 2 1 2 2S3 6 3 7s2 1 2 2-2 1-2 2 2 1 2 2" }],
  ["path", { d: "M18 6h.01" }],
  ["path", { d: "M6 18h.01" }],
  ["path", { d: "M20.83 8.83a4 4 0 0 0-5.66-5.66l-12 12a4 4 0 1 0 5.66 5.66Z" }],
  ["path", { d: "M18 11.66V22a4 4 0 0 0 4-4V6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Podcast = [
  ["path", { d: "M16.85 18.58a9 9 0 1 0-9.7 0" }],
  ["path", { d: "M8 14a5 5 0 1 1 8 0" }],
  ["circle", { cx: "12", cy: "11", r: "1" }],
  ["path", { d: "M13 17a1 1 0 1 0-2 0l.5 4.5a.5.5 0 1 0 1 0Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PointerOff = [
  ["path", { d: "M10 4.5V4a2 2 0 0 0-2.41-1.957" }],
  ["path", { d: "M13.9 8.4a2 2 0 0 0-1.26-1.295" }],
  ["path", { d: "M21.7 16.2A8 8 0 0 0 22 14v-3a2 2 0 1 0-4 0v-1a2 2 0 0 0-3.63-1.158" }],
  [
    "path",
    { d: "m7 15-1.8-1.8a2 2 0 0 0-2.79 2.86L6 19.7a7.74 7.74 0 0 0 6 2.3h2a8 8 0 0 0 5.657-2.343" }
  ],
  ["path", { d: "M6 6v8" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Popcorn = [
  ["path", { d: "M18 8a2 2 0 0 0 0-4 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0-4 0 2 2 0 0 0 0 4" }],
  ["path", { d: "M10 22 9 8" }],
  ["path", { d: "m14 22 1-14" }],
  [
    "path",
    {
      d: "M20 8c.5 0 .9.4.8 1l-2.6 12c-.1.5-.7 1-1.2 1H7c-.6 0-1.1-.4-1.2-1L3.2 9c-.1-.6.3-1 .8-1Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pointer = [
  ["path", { d: "M22 14a8 8 0 0 1-8 8" }],
  ["path", { d: "M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2" }],
  ["path", { d: "M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1" }],
  ["path", { d: "M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10" }],
  [
    "path",
    {
      d: "M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Popsicle = [
  [
    "path",
    { d: "M18.6 14.4c.8-.8.8-2 0-2.8l-8.1-8.1a4.95 4.95 0 1 0-7.1 7.1l8.1 8.1c.9.7 2.1.7 2.9-.1Z" }
  ],
  ["path", { d: "m22 22-5.5-5.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PoundSterling = [
  ["path", { d: "M18 7c0-5.333-8-5.333-8 0" }],
  ["path", { d: "M10 7v14" }],
  ["path", { d: "M6 21h12" }],
  ["path", { d: "M6 13h10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PowerOff = [
  ["path", { d: "M18.36 6.64A9 9 0 0 1 20.77 15" }],
  ["path", { d: "M6.16 6.16a9 9 0 1 0 12.68 12.68" }],
  ["path", { d: "M12 2v4" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Power = [
  ["path", { d: "M12 2v10" }],
  ["path", { d: "M18.4 6.6a9 9 0 1 1-12.77.04" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Presentation = [
  ["path", { d: "M2 3h20" }],
  ["path", { d: "M21 3v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V3" }],
  ["path", { d: "m7 21 5-5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const PrinterCheck = [
  ["path", { d: "M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5" }],
  ["path", { d: "m16 19 2 2 4-4" }],
  ["path", { d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Printer = [
  ["path", { d: "M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" }],
  ["rect", { x: "6", y: "14", width: "12", height: "8", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Projector = [
  ["path", { d: "M5 7 3 5" }],
  ["path", { d: "M9 6V3" }],
  ["path", { d: "m13 7 2-2" }],
  ["circle", { cx: "9", cy: "13", r: "3" }],
  [
    "path",
    { d: "M11.83 12H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h2.17" }
  ],
  ["path", { d: "M16 16h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Proportions = [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
  ["path", { d: "M12 9v11" }],
  ["path", { d: "M2 9h13a2 2 0 0 1 2 2v9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Puzzle = [
  [
    "path",
    {
      d: "M15.39 4.39a1 1 0 0 0 1.68-.474 2.5 2.5 0 1 1 3.014 3.015 1 1 0 0 0-.474 1.68l1.683 1.682a2.414 2.414 0 0 1 0 3.414L19.61 15.39a1 1 0 0 1-1.68-.474 2.5 2.5 0 1 0-3.014 3.015 1 1 0 0 1 .474 1.68l-1.683 1.682a2.414 2.414 0 0 1-3.414 0L8.61 19.61a1 1 0 0 0-1.68.474 2.5 2.5 0 1 1-3.014-3.015 1 1 0 0 0 .474-1.68l-1.683-1.682a2.414 2.414 0 0 1 0-3.414L4.39 8.61a1 1 0 0 1 1.68.474 2.5 2.5 0 1 0 3.014-3.015 1 1 0 0 1-.474-1.68l1.683-1.682a2.414 2.414 0 0 1 3.414 0z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Pyramid = [
  [
    "path",
    {
      d: "M2.5 16.88a1 1 0 0 1-.32-1.43l9-13.02a1 1 0 0 1 1.64 0l9 13.01a1 1 0 0 1-.32 1.44l-8.51 4.86a2 2 0 0 1-1.98 0Z"
    }
  ],
  ["path", { d: "M12 2v20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const QrCode = [
  ["rect", { width: "5", height: "5", x: "3", y: "3", rx: "1" }],
  ["rect", { width: "5", height: "5", x: "16", y: "3", rx: "1" }],
  ["rect", { width: "5", height: "5", x: "3", y: "16", rx: "1" }],
  ["path", { d: "M21 16h-3a2 2 0 0 0-2 2v3" }],
  ["path", { d: "M21 21v.01" }],
  ["path", { d: "M12 7v3a2 2 0 0 1-2 2H7" }],
  ["path", { d: "M3 12h.01" }],
  ["path", { d: "M12 3h.01" }],
  ["path", { d: "M12 16v.01" }],
  ["path", { d: "M16 12h1" }],
  ["path", { d: "M21 12v.01" }],
  ["path", { d: "M12 21v-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Quote = [
  [
    "path",
    {
      d: "M16 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
    }
  ],
  [
    "path",
    {
      d: "M5 3a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2 1 1 0 0 1 1 1v1a2 2 0 0 1-2 2 1 1 0 0 0-1 1v2a1 1 0 0 0 1 1 6 6 0 0 0 6-6V5a2 2 0 0 0-2-2z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rabbit = [
  ["path", { d: "M13 16a3 3 0 0 1 2.24 5" }],
  ["path", { d: "M18 12h.01" }],
  [
    "path",
    {
      d: "M18 21h-8a4 4 0 0 1-4-4 7 7 0 0 1 7-7h.2L9.6 6.4a1 1 0 1 1 2.8-2.8L15.8 7h.2c3.3 0 6 2.7 6 6v1a2 2 0 0 1-2 2h-1a3 3 0 0 0-3 3"
    }
  ],
  ["path", { d: "M20 8.54V4a2 2 0 1 0-4 0v3" }],
  ["path", { d: "M7.612 12.524a3 3 0 1 0-1.6 4.3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Radar = [
  ["path", { d: "M19.07 4.93A10 10 0 0 0 6.99 3.34" }],
  ["path", { d: "M4 6h.01" }],
  ["path", { d: "M2.29 9.62A10 10 0 1 0 21.31 8.35" }],
  ["path", { d: "M16.24 7.76A6 6 0 1 0 8.23 16.67" }],
  ["path", { d: "M12 18h.01" }],
  ["path", { d: "M17.99 11.66A6 6 0 0 1 15.77 16.67" }],
  ["circle", { cx: "12", cy: "12", r: "2" }],
  ["path", { d: "m13.41 10.59 5.66-5.66" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Radiation = [
  ["path", { d: "M12 12h.01" }],
  [
    "path",
    {
      d: "M14 15.4641a4 4 0 0 1-4 0L7.52786 19.74597 A 1 1 0 0 0 7.99303 21.16211 10 10 0 0 0 16.00697 21.16211 1 1 0 0 0 16.47214 19.74597z"
    }
  ],
  [
    "path",
    {
      d: "M16 12a4 4 0 0 0-2-3.464l2.472-4.282a1 1 0 0 1 1.46-.305 10 10 0 0 1 4.006 6.94A1 1 0 0 1 21 12z"
    }
  ],
  [
    "path",
    {
      d: "M8 12a4 4 0 0 1 2-3.464L7.528 4.254a1 1 0 0 0-1.46-.305 10 10 0 0 0-4.006 6.94A1 1 0 0 0 3 12z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Radical = [
  [
    "path",
    {
      d: "M3 12h3.28a1 1 0 0 1 .948.684l2.298 7.934a.5.5 0 0 0 .96-.044L13.82 4.771A1 1 0 0 1 14.792 4H21"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RadioReceiver = [
  ["path", { d: "M5 16v2" }],
  ["path", { d: "M19 16v2" }],
  ["rect", { width: "20", height: "8", x: "2", y: "8", rx: "2" }],
  ["path", { d: "M18 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Radio = [
  ["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478" }],
  ["path", { d: "M19.075 4.933a10 10 0 0 1 0 14.134" }],
  ["path", { d: "M4.925 19.067a10 10 0 0 1 0-14.134" }],
  ["path", { d: "M7.753 16.239a6 6 0 0 1 0-8.478" }],
  ["circle", { cx: "12", cy: "12", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RadioTower = [
  ["path", { d: "M4.9 16.1C1 12.2 1 5.8 4.9 1.9" }],
  ["path", { d: "M7.8 4.7a6.14 6.14 0 0 0-.8 7.5" }],
  ["circle", { cx: "12", cy: "9", r: "2" }],
  ["path", { d: "M16.2 4.8c2 2 2.26 5.11.8 7.47" }],
  ["path", { d: "M19.1 1.9a9.96 9.96 0 0 1 0 14.1" }],
  ["path", { d: "M9.5 18h5" }],
  ["path", { d: "m8 22 4-11 4 11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Radius = [
  ["path", { d: "M20.34 17.52a10 10 0 1 0-2.82 2.82" }],
  ["circle", { cx: "19", cy: "19", r: "2" }],
  ["path", { d: "m13.41 13.41 4.18 4.18" }],
  ["circle", { cx: "12", cy: "12", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RailSymbol = [
  ["path", { d: "M5 15h14" }],
  ["path", { d: "M5 9h14" }],
  ["path", { d: "m14 20-5-5 6-6-5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rainbow = [
  ["path", { d: "M22 17a10 10 0 0 0-20 0" }],
  ["path", { d: "M6 17a6 6 0 0 1 12 0" }],
  ["path", { d: "M10 17a2 2 0 0 1 4 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rat = [
  ["path", { d: "M13 22H4a2 2 0 0 1 0-4h12" }],
  ["path", { d: "M13.236 18a3 3 0 0 0-2.2-5" }],
  ["path", { d: "M16 9h.01" }],
  [
    "path",
    {
      d: "M16.82 3.94a3 3 0 1 1 3.237 4.868l1.815 2.587a1.5 1.5 0 0 1-1.5 2.1l-2.872-.453a3 3 0 0 0-3.5 3"
    }
  ],
  ["path", { d: "M17 4.988a3 3 0 1 0-5.2 2.052A7 7 0 0 0 4 14.015 4 4 0 0 0 8 18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ratio = [
  ["rect", { width: "12", height: "20", x: "6", y: "2", rx: "2" }],
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReceiptCent = [
  ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
  ["path", { d: "M12 6.5v11" }],
  ["path", { d: "M15 9.4a4 4 0 1 0 0 5.2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReceiptEuro = [
  ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
  ["path", { d: "M8 12h5" }],
  ["path", { d: "M16 9.5a4 4 0 1 0 0 5.2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReceiptIndianRupee = [
  ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
  ["path", { d: "M8 7h8" }],
  ["path", { d: "M12 17.5 8 15h1a4 4 0 0 0 0-8" }],
  ["path", { d: "M8 11h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReceiptJapaneseYen = [
  ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
  ["path", { d: "m12 10 3-3" }],
  ["path", { d: "m9 7 3 3v7.5" }],
  ["path", { d: "M9 11h6" }],
  ["path", { d: "M9 15h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReceiptPoundSterling = [
  ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
  ["path", { d: "M8 13h5" }],
  ["path", { d: "M10 17V9.5a2.5 2.5 0 0 1 5 0" }],
  ["path", { d: "M8 17h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReceiptRussianRuble = [
  ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
  ["path", { d: "M8 15h5" }],
  ["path", { d: "M8 11h5a2 2 0 1 0 0-4h-3v10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReceiptSwissFranc = [
  ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
  ["path", { d: "M10 17V7h5" }],
  ["path", { d: "M10 11h4" }],
  ["path", { d: "M8 15h5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReceiptText = [
  ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
  ["path", { d: "M14 8H8" }],
  ["path", { d: "M16 12H8" }],
  ["path", { d: "M13 16H8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Receipt = [
  ["path", { d: "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" }],
  ["path", { d: "M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" }],
  ["path", { d: "M12 17.5v-11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RectangleEllipsis = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }],
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M17 12h.01" }],
  ["path", { d: "M7 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RectangleCircle = [
  ["path", { d: "M14 4v16H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" }],
  ["circle", { cx: "14", cy: "12", r: "8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RectangleGoggles = [
  [
    "path",
    {
      d: "M20 6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4a2 2 0 0 1-1.6-.8l-1.6-2.13a1 1 0 0 0-1.6 0L9.6 17.2A2 2 0 0 1 8 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RectangleHorizontal = [
  ["rect", { width: "20", height: "12", x: "2", y: "6", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RectangleVertical = [
  ["rect", { width: "12", height: "20", x: "6", y: "2", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Recycle = [
  ["path", { d: "M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" }],
  ["path", { d: "M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" }],
  ["path", { d: "m14 16-3 3 3 3" }],
  ["path", { d: "M8.293 13.596 7.196 9.5 3.1 10.598" }],
  [
    "path",
    {
      d: "m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843"
    }
  ],
  ["path", { d: "m13.378 9.633 4.096 1.098 1.097-4.096" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Redo2 = [
  ["path", { d: "m15 14 5-5-5-5" }],
  ["path", { d: "M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Redo = [
  ["path", { d: "M21 7v6h-6" }],
  ["path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RedoDot = [
  ["circle", { cx: "12", cy: "17", r: "1" }],
  ["path", { d: "M21 7v6h-6" }],
  ["path", { d: "M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RefreshCcwDot = [
  ["path", { d: "M3 2v6h6" }],
  ["path", { d: "M21 12A9 9 0 0 0 6 5.3L3 8" }],
  ["path", { d: "M21 22v-6h-6" }],
  ["path", { d: "M3 12a9 9 0 0 0 15 6.7l3-2.7" }],
  ["circle", { cx: "12", cy: "12", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RefreshCcw = [
  ["path", { d: "M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }],
  ["path", { d: "M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" }],
  ["path", { d: "M16 16h5v5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RefreshCwOff = [
  ["path", { d: "M21 8L18.74 5.74A9.75 9.75 0 0 0 12 3C11 3 10.03 3.16 9.13 3.47" }],
  ["path", { d: "M8 16H3v5" }],
  ["path", { d: "M3 12C3 9.51 4 7.26 5.64 5.64" }],
  ["path", { d: "m3 16 2.26 2.26A9.75 9.75 0 0 0 12 21c2.49 0 4.74-1 6.36-2.64" }],
  ["path", { d: "M21 12c0 1-.16 1.97-.47 2.87" }],
  ["path", { d: "M21 3v5h-5" }],
  ["path", { d: "M22 22 2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RefreshCw = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }],
  ["path", { d: "M21 3v5h-5" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }],
  ["path", { d: "M8 16H3v5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Refrigerator = [
  ["path", { d: "M5 6a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6Z" }],
  ["path", { d: "M5 10h14" }],
  ["path", { d: "M15 7v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Regex = [
  ["path", { d: "M17 3v10" }],
  ["path", { d: "m12.67 5.5 8.66 5" }],
  ["path", { d: "m12.67 10.5 8.66-5" }],
  ["path", { d: "M9 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2v-2z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RemoveFormatting = [
  ["path", { d: "M4 7V4h16v3" }],
  ["path", { d: "M5 20h6" }],
  ["path", { d: "M13 4 8 20" }],
  ["path", { d: "m15 15 5 5" }],
  ["path", { d: "m20 15-5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Repeat1 = [
  ["path", { d: "m17 2 4 4-4 4" }],
  ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14" }],
  ["path", { d: "m7 22-4-4 4-4" }],
  ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3" }],
  ["path", { d: "M11 10h1v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Repeat2 = [
  ["path", { d: "m2 9 3-3 3 3" }],
  ["path", { d: "M13 18H7a2 2 0 0 1-2-2V6" }],
  ["path", { d: "m22 15-3 3-3-3" }],
  ["path", { d: "M11 6h6a2 2 0 0 1 2 2v10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Repeat = [
  ["path", { d: "m17 2 4 4-4 4" }],
  ["path", { d: "M3 11v-1a4 4 0 0 1 4-4h14" }],
  ["path", { d: "m7 22-4-4 4-4" }],
  ["path", { d: "M21 13v1a4 4 0 0 1-4 4H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReplaceAll = [
  ["path", { d: "M14 14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" }],
  ["path", { d: "M14 4a2 2 0 0 1 2-2" }],
  ["path", { d: "M16 10a2 2 0 0 1-2-2" }],
  ["path", { d: "M20 14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2" }],
  ["path", { d: "M20 2a2 2 0 0 1 2 2" }],
  ["path", { d: "M22 8a2 2 0 0 1-2 2" }],
  ["path", { d: "m3 7 3 3 3-3" }],
  ["path", { d: "M6 10V5a 3 3 0 0 1 3-3h1" }],
  ["rect", { x: "2", y: "14", width: "8", height: "8", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Replace = [
  ["path", { d: "M14 4a2 2 0 0 1 2-2" }],
  ["path", { d: "M16 10a2 2 0 0 1-2-2" }],
  ["path", { d: "M20 2a2 2 0 0 1 2 2" }],
  ["path", { d: "M22 8a2 2 0 0 1-2 2" }],
  ["path", { d: "m3 7 3 3 3-3" }],
  ["path", { d: "M6 10V5a3 3 0 0 1 3-3h1" }],
  ["rect", { x: "2", y: "14", width: "8", height: "8", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ReplyAll = [
  ["path", { d: "m12 17-5-5 5-5" }],
  ["path", { d: "M22 18v-2a4 4 0 0 0-4-4H7" }],
  ["path", { d: "m7 17-5-5 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Reply = [
  ["path", { d: "M20 18v-2a4 4 0 0 0-4-4H4" }],
  ["path", { d: "m9 17-5-5 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rewind = [
  ["polygon", { points: "11 19 2 12 11 5 11 19" }],
  ["polygon", { points: "22 19 13 12 22 5 22 19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ribbon = [
  ["path", { d: "M12 11.22C11 9.997 10 9 10 8a2 2 0 0 1 4 0c0 1-.998 2.002-2.01 3.22" }],
  ["path", { d: "m12 18 2.57-3.5" }],
  ["path", { d: "M6.243 9.016a7 7 0 0 1 11.507-.009" }],
  ["path", { d: "M9.35 14.53 12 11.22" }],
  [
    "path",
    {
      d: "M9.35 14.53C7.728 12.246 6 10.221 6 7a6 5 0 0 1 12 0c-.005 3.22-1.778 5.235-3.43 7.5l3.557 4.527a1 1 0 0 1-.203 1.43l-1.894 1.36a1 1 0 0 1-1.384-.215L12 18l-2.679 3.593a1 1 0 0 1-1.39.213l-1.865-1.353a1 1 0 0 1-.203-1.422z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rocket = [
  [
    "path",
    {
      d: "M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"
    }
  ],
  [
    "path",
    {
      d: "m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"
    }
  ],
  ["path", { d: "M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" }],
  ["path", { d: "M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RockingChair = [
  ["polyline", { points: "3.5 2 6.5 12.5 18 12.5" }],
  ["line", { x1: "9.5", x2: "5.5", y1: "12.5", y2: "20" }],
  ["line", { x1: "15", x2: "18.5", y1: "12.5", y2: "20" }],
  ["path", { d: "M2.75 18a13 13 0 0 0 18.5 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rotate3d = [
  [
    "path",
    {
      d: "M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2"
    }
  ],
  ["path", { d: "m15.194 13.707 3.814 1.86-1.86 3.814" }],
  [
    "path",
    {
      d: "M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RollerCoaster = [
  ["path", { d: "M6 19V5" }],
  ["path", { d: "M10 19V6.8" }],
  ["path", { d: "M14 19v-7.8" }],
  ["path", { d: "M18 5v4" }],
  ["path", { d: "M18 19v-6" }],
  ["path", { d: "M22 19V9" }],
  ["path", { d: "M2 19V9a4 4 0 0 1 4-4c2 0 4 1.33 6 4s4 4 6 4a4 4 0 1 0-3-6.65" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RotateCcwSquare = [
  ["path", { d: "M20 9V7a2 2 0 0 0-2-2h-6" }],
  ["path", { d: "m15 2-3 3 3 3" }],
  ["path", { d: "M20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RotateCcwKey = [
  ["path", { d: "m14.5 9.5 1 1" }],
  ["path", { d: "m15.5 8.5-4 4" }],
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }],
  ["circle", { cx: "10", cy: "14", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RotateCcw = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" }],
  ["path", { d: "M3 3v5h5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RotateCwSquare = [
  ["path", { d: "M12 5H6a2 2 0 0 0-2 2v3" }],
  ["path", { d: "m9 8 3-3-3-3" }],
  ["path", { d: "M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RotateCw = [
  ["path", { d: "M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" }],
  ["path", { d: "M21 3v5h-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RouteOff = [
  ["circle", { cx: "6", cy: "19", r: "3" }],
  ["path", { d: "M9 19h8.5c.4 0 .9-.1 1.3-.2" }],
  ["path", { d: "M5.2 5.2A3.5 3.53 0 0 0 6.5 12H12" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M21 15.3a3.5 3.5 0 0 0-3.3-3.3" }],
  ["path", { d: "M15 5h-4.3" }],
  ["circle", { cx: "18", cy: "5", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Route = [
  ["circle", { cx: "6", cy: "19", r: "3" }],
  ["path", { d: "M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15" }],
  ["circle", { cx: "18", cy: "5", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Router = [
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2" }],
  ["path", { d: "M6.01 18H6" }],
  ["path", { d: "M10.01 18H10" }],
  ["path", { d: "M15 10v4" }],
  ["path", { d: "M17.84 7.17a4 4 0 0 0-5.66 0" }],
  ["path", { d: "M20.66 4.34a8 8 0 0 0-11.31 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rows2 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 12h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rows3 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M21 9H3" }],
  ["path", { d: "M21 15H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rows4 = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M21 7.5H3" }],
  ["path", { d: "M21 12H3" }],
  ["path", { d: "M21 16.5H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Rss = [
  ["path", { d: "M4 11a9 9 0 0 1 9 9" }],
  ["path", { d: "M4 4a16 16 0 0 1 16 16" }],
  ["circle", { cx: "5", cy: "19", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RulerDimensionLine = [
  ["path", { d: "M12 15v-3.014" }],
  ["path", { d: "M16 15v-3.014" }],
  ["path", { d: "M20 6H4" }],
  ["path", { d: "M20 8V4" }],
  ["path", { d: "M4 8V4" }],
  ["path", { d: "M8 15v-3.014" }],
  ["rect", { x: "3", y: "12", width: "18", height: "7", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ruler = [
  [
    "path",
    {
      d: "M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"
    }
  ],
  ["path", { d: "m14.5 12.5 2-2" }],
  ["path", { d: "m11.5 9.5 2-2" }],
  ["path", { d: "m8.5 6.5 2-2" }],
  ["path", { d: "m17.5 15.5 2-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const RussianRuble = [
  ["path", { d: "M6 11h8a4 4 0 0 0 0-8H9v18" }],
  ["path", { d: "M6 15h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sailboat = [
  ["path", { d: "M22 18H2a4 4 0 0 0 4 4h12a4 4 0 0 0 4-4Z" }],
  ["path", { d: "M21 14 10 2 3 14h18Z" }],
  ["path", { d: "M10 2v16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Salad = [
  ["path", { d: "M7 21h10" }],
  ["path", { d: "M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" }],
  [
    "path",
    {
      d: "M11.38 12a2.4 2.4 0 0 1-.4-4.77 2.4 2.4 0 0 1 3.2-2.77 2.4 2.4 0 0 1 3.47-.63 2.4 2.4 0 0 1 3.37 3.37 2.4 2.4 0 0 1-1.1 3.7 2.51 2.51 0 0 1 .03 1.1"
    }
  ],
  ["path", { d: "m13 12 4-4" }],
  ["path", { d: "M10.9 7.25A3.99 3.99 0 0 0 4 10c0 .73.2 1.41.54 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sandwich = [
  ["path", { d: "m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777" }],
  ["path", { d: "M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25" }],
  ["path", { d: "M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9" }],
  ["path", { d: "m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2" }],
  ["rect", { width: "20", height: "4", x: "2", y: "11", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SatelliteDish = [
  ["path", { d: "M4 10a7.31 7.31 0 0 0 10 10Z" }],
  ["path", { d: "m9 15 3-3" }],
  ["path", { d: "M17 13a6 6 0 0 0-6-6" }],
  ["path", { d: "M21 13A10 10 0 0 0 11 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Satellite = [
  [
    "path",
    {
      d: "m13.5 6.5-3.148-3.148a1.205 1.205 0 0 0-1.704 0L6.352 5.648a1.205 1.205 0 0 0 0 1.704L9.5 10.5"
    }
  ],
  ["path", { d: "M16.5 7.5 19 5" }],
  [
    "path",
    {
      d: "m17.5 10.5 3.148 3.148a1.205 1.205 0 0 1 0 1.704l-2.296 2.296a1.205 1.205 0 0 1-1.704 0L13.5 14.5"
    }
  ],
  ["path", { d: "M9 21a6 6 0 0 0-6-6" }],
  [
    "path",
    {
      d: "M9.352 10.648a1.205 1.205 0 0 0 0 1.704l2.296 2.296a1.205 1.205 0 0 0 1.704 0l4.296-4.296a1.205 1.205 0 0 0 0-1.704l-2.296-2.296a1.205 1.205 0 0 0-1.704 0z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SaudiRiyal = [
  ["path", { d: "m20 19.5-5.5 1.2" }],
  ["path", { d: "M14.5 4v11.22a1 1 0 0 0 1.242.97L20 15.2" }],
  ["path", { d: "m2.978 19.351 5.549-1.363A2 2 0 0 0 10 16V2" }],
  ["path", { d: "M20 10 4 13.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SaveAll = [
  ["path", { d: "M10 2v3a1 1 0 0 0 1 1h5" }],
  ["path", { d: "M18 18v-6a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6" }],
  ["path", { d: "M18 22H4a2 2 0 0 1-2-2V6" }],
  [
    "path",
    {
      d: "M8 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9.172a2 2 0 0 1 1.414.586l2.828 2.828A2 2 0 0 1 22 6.828V16a2 2 0 0 1-2.01 2z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SaveOff = [
  ["path", { d: "M13 13H8a1 1 0 0 0-1 1v7" }],
  ["path", { d: "M14 8h1" }],
  ["path", { d: "M17 21v-4" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M20.41 20.41A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 .59-1.41" }],
  ["path", { d: "M29.5 11.5s5 5 4 5" }],
  ["path", { d: "M9 3h6.2a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Save = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Scale3d = [
  ["path", { d: "M5 7v11a1 1 0 0 0 1 1h11" }],
  ["path", { d: "M5.293 18.707 11 13" }],
  ["circle", { cx: "19", cy: "19", r: "2" }],
  ["circle", { cx: "5", cy: "5", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Scale = [
  ["path", { d: "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }],
  ["path", { d: "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z" }],
  ["path", { d: "M7 21h10" }],
  ["path", { d: "M12 3v18" }],
  ["path", { d: "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Scaling = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }],
  ["path", { d: "M14 15H9v-5" }],
  ["path", { d: "M16 3h5v5" }],
  ["path", { d: "M21 3 9 15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScanBarcode = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ["path", { d: "M8 7v10" }],
  ["path", { d: "M12 7v10" }],
  ["path", { d: "M17 7v10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScanFace = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }],
  ["path", { d: "M9 9h.01" }],
  ["path", { d: "M15 9h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScanEye = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ["circle", { cx: "12", cy: "12", r: "1" }],
  [
    "path",
    {
      d: "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScanHeart = [
  [
    "path",
    {
      d: "M11.246 16.657a1 1 0 0 0 1.508 0l3.57-4.101A2.75 2.75 0 1 0 12 9.168a2.75 2.75 0 1 0-4.324 3.388z"
    }
  ],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScanLine = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ["path", { d: "M7 12h10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScanQrCode = [
  ["path", { d: "M17 12v4a1 1 0 0 1-1 1h-4" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M17 8V7" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M7 17h.01" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ["rect", { x: "7", y: "7", width: "5", height: "5", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Scan = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScanSearch = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ["circle", { cx: "12", cy: "12", r: "3" }],
  ["path", { d: "m16 16-1.9-1.9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScanText = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2" }],
  ["path", { d: "M7 8h8" }],
  ["path", { d: "M7 12h10" }],
  ["path", { d: "M7 16h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const School = [
  ["path", { d: "M14 22v-4a2 2 0 1 0-4 0v4" }],
  [
    "path",
    {
      d: "m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10"
    }
  ],
  ["path", { d: "M18 5v17" }],
  ["path", { d: "m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6" }],
  ["path", { d: "M6 5v17" }],
  ["circle", { cx: "12", cy: "9", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Scissors = [
  ["circle", { cx: "6", cy: "6", r: "3" }],
  ["path", { d: "M8.12 8.12 12 12" }],
  ["path", { d: "M20 4 8.12 15.88" }],
  ["circle", { cx: "6", cy: "18", r: "3" }],
  ["path", { d: "M14.8 14.8 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScissorsLineDashed = [
  ["path", { d: "M5.42 9.42 8 12" }],
  ["circle", { cx: "4", cy: "8", r: "2" }],
  ["path", { d: "m14 6-8.58 8.58" }],
  ["circle", { cx: "4", cy: "16", r: "2" }],
  ["path", { d: "M10.8 14.8 14 18" }],
  ["path", { d: "M16 12h-2" }],
  ["path", { d: "M22 12h-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScreenShareOff = [
  ["path", { d: "M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" }],
  ["path", { d: "M8 21h8" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "m22 3-5 5" }],
  ["path", { d: "m17 3 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScrollText = [
  ["path", { d: "M15 12h-5" }],
  ["path", { d: "M15 8h-5" }],
  ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4" }],
  [
    "path",
    {
      d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ScreenShare = [
  ["path", { d: "M13 3H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-3" }],
  ["path", { d: "M8 21h8" }],
  ["path", { d: "M12 17v4" }],
  ["path", { d: "m17 8 5-5" }],
  ["path", { d: "M17 3h5v5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Scroll = [
  ["path", { d: "M19 17V5a2 2 0 0 0-2-2H4" }],
  [
    "path",
    {
      d: "M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SearchCheck = [
  ["path", { d: "m8 11 2 2 4-4" }],
  ["circle", { cx: "11", cy: "11", r: "8" }],
  ["path", { d: "m21 21-4.3-4.3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SearchCode = [
  ["path", { d: "m13 13.5 2-2.5-2-2.5" }],
  ["path", { d: "m21 21-4.3-4.3" }],
  ["path", { d: "M9 8.5 7 11l2 2.5" }],
  ["circle", { cx: "11", cy: "11", r: "8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SearchSlash = [
  ["path", { d: "m13.5 8.5-5 5" }],
  ["circle", { cx: "11", cy: "11", r: "8" }],
  ["path", { d: "m21 21-4.3-4.3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SearchX = [
  ["path", { d: "m13.5 8.5-5 5" }],
  ["path", { d: "m8.5 8.5 5 5" }],
  ["circle", { cx: "11", cy: "11", r: "8" }],
  ["path", { d: "m21 21-4.3-4.3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Section = [
  ["path", { d: "M16 5a4 3 0 0 0-8 0c0 4 8 3 8 7a4 3 0 0 1-8 0" }],
  ["path", { d: "M8 19a4 3 0 0 0 8 0c0-4-8-3-8-7a4 3 0 0 1 8 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Search = [
  ["path", { d: "m21 21-4.34-4.34" }],
  ["circle", { cx: "11", cy: "11", r: "8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SendHorizontal = [
  [
    "path",
    {
      d: "M3.714 3.048a.498.498 0 0 0-.683.627l2.843 7.627a2 2 0 0 1 0 1.396l-2.842 7.627a.498.498 0 0 0 .682.627l18-8.5a.5.5 0 0 0 0-.904z"
    }
  ],
  ["path", { d: "M6 12h16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SendToBack = [
  ["rect", { x: "14", y: "14", width: "8", height: "8", rx: "2" }],
  ["rect", { x: "2", y: "2", width: "8", height: "8", rx: "2" }],
  ["path", { d: "M7 14v1a2 2 0 0 0 2 2h1" }],
  ["path", { d: "M14 7h1a2 2 0 0 1 2 2v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Send = [
  [
    "path",
    {
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SeparatorHorizontal = [
  ["path", { d: "m16 16-4 4-4-4" }],
  ["path", { d: "M3 12h18" }],
  ["path", { d: "m8 8 4-4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SeparatorVertical = [
  ["path", { d: "M12 3v18" }],
  ["path", { d: "m16 16 4-4-4-4" }],
  ["path", { d: "m8 8-4 4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ServerCog = [
  ["path", { d: "m10.852 14.772-.383.923" }],
  ["path", { d: "M13.148 14.772a3 3 0 1 0-2.296-5.544l-.383-.923" }],
  ["path", { d: "m13.148 9.228.383-.923" }],
  ["path", { d: "m13.53 15.696-.382-.924a3 3 0 1 1-2.296-5.544" }],
  ["path", { d: "m14.772 10.852.923-.383" }],
  ["path", { d: "m14.772 13.148.923.383" }],
  ["path", { d: "M4.5 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-.5" }],
  ["path", { d: "M4.5 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-.5" }],
  ["path", { d: "M6 18h.01" }],
  ["path", { d: "M6 6h.01" }],
  ["path", { d: "m9.228 10.852-.923-.383" }],
  ["path", { d: "m9.228 13.148-.923.383" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ServerCrash = [
  ["path", { d: "M6 10H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2" }],
  ["path", { d: "M6 14H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-4a2 2 0 0 0-2-2h-2" }],
  ["path", { d: "M6 6h.01" }],
  ["path", { d: "M6 18h.01" }],
  ["path", { d: "m13 6-4 6h6l-4 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ServerOff = [
  ["path", { d: "M7 2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-5" }],
  ["path", { d: "M10 10 2.5 2.5C2 2 2 2.5 2 5v3a2 2 0 0 0 2 2h6z" }],
  ["path", { d: "M22 17v-1a2 2 0 0 0-2-2h-1" }],
  ["path", { d: "M4 14a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h16.5l1-.5.5.5-8-8H4z" }],
  ["path", { d: "M6 18h.01" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Server = [
  ["rect", { width: "20", height: "8", x: "2", y: "2", rx: "2", ry: "2" }],
  ["rect", { width: "20", height: "8", x: "2", y: "14", rx: "2", ry: "2" }],
  ["line", { x1: "6", x2: "6.01", y1: "6", y2: "6" }],
  ["line", { x1: "6", x2: "6.01", y1: "18", y2: "18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Settings2 = [
  ["path", { d: "M14 17H5" }],
  ["path", { d: "M19 7h-9" }],
  ["circle", { cx: "17", cy: "17", r: "3" }],
  ["circle", { cx: "7", cy: "7", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shapes = [
  [
    "path",
    {
      d: "M8.3 10a.7.7 0 0 1-.626-1.079L11.4 3a.7.7 0 0 1 1.198-.043L16.3 8.9a.7.7 0 0 1-.572 1.1Z"
    }
  ],
  ["rect", { x: "3", y: "14", width: "7", height: "7", rx: "1" }],
  ["circle", { cx: "17.5", cy: "17.5", r: "3.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Settings = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Share2 = [
  ["circle", { cx: "18", cy: "5", r: "3" }],
  ["circle", { cx: "6", cy: "12", r: "3" }],
  ["circle", { cx: "18", cy: "19", r: "3" }],
  ["line", { x1: "8.59", x2: "15.42", y1: "13.51", y2: "17.49" }],
  ["line", { x1: "15.41", x2: "8.59", y1: "6.51", y2: "10.49" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Share = [
  ["path", { d: "M12 2v13" }],
  ["path", { d: "m16 6-4-4-4 4" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shell = [
  [
    "path",
    {
      d: "M14 11a2 2 0 1 1-4 0 4 4 0 0 1 8 0 6 6 0 0 1-12 0 8 8 0 0 1 16 0 10 10 0 1 1-20 0 11.93 11.93 0 0 1 2.42-7.22 2 2 0 1 1 3.16 2.44"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sheet = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["line", { x1: "3", x2: "21", y1: "9", y2: "9" }],
  ["line", { x1: "3", x2: "21", y1: "15", y2: "15" }],
  ["line", { x1: "9", x2: "9", y1: "9", y2: "21" }],
  ["line", { x1: "15", x2: "15", y1: "9", y2: "21" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldAlert = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "M12 8v4" }],
  ["path", { d: "M12 16h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldBan = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "m4.243 5.21 14.39 12.472" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldCheck = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldEllipsis = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "M8 12h.01" }],
  ["path", { d: "M12 12h.01" }],
  ["path", { d: "M16 12h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldHalf = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "M12 22V2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldMinus = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "M9 12h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldOff = [
  ["path", { d: "m2 2 20 20" }],
  [
    "path",
    {
      d: "M5 5a1 1 0 0 0-1 1v7c0 5 3.5 7.5 7.67 8.94a1 1 0 0 0 .67.01c2.35-.82 4.48-1.97 5.9-3.71"
    }
  ],
  [
    "path",
    {
      d: "M9.309 3.652A12.252 12.252 0 0 0 11.24 2.28a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1v7a9.784 9.784 0 0 1-.08 1.264"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldPlus = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "M9 12h6" }],
  ["path", { d: "M12 9v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldQuestionMark = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" }],
  ["path", { d: "M12 17h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldUser = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "M6.376 18.91a6 6 0 0 1 11.249.003" }],
  ["circle", { cx: "12", cy: "11", r: "4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShieldX = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ],
  ["path", { d: "m14.5 9.5-5 5" }],
  ["path", { d: "m9.5 9.5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shield = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShipWheel = [
  ["circle", { cx: "12", cy: "12", r: "8" }],
  ["path", { d: "M12 2v7.5" }],
  ["path", { d: "m19 5-5.23 5.23" }],
  ["path", { d: "M22 12h-7.5" }],
  ["path", { d: "m19 19-5.23-5.23" }],
  ["path", { d: "M12 14.5V22" }],
  ["path", { d: "M10.23 13.77 5 19" }],
  ["path", { d: "M9.5 12H2" }],
  ["path", { d: "M10.23 10.23 5 5" }],
  ["circle", { cx: "12", cy: "12", r: "2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ship = [
  ["path", { d: "M12 10.189V14" }],
  ["path", { d: "M12 2v3" }],
  ["path", { d: "M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6" }],
  [
    "path",
    {
      d: "M19.38 20A11.6 11.6 0 0 0 21 14l-8.188-3.639a2 2 0 0 0-1.624 0L3 14a11.6 11.6 0 0 0 2.81 7.76"
    }
  ],
  [
    "path",
    {
      d: "M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1s1.2 1 2.5 1c2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shirt = [
  [
    "path",
    {
      d: "M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShoppingBag = [
  ["path", { d: "M16 10a4 4 0 0 1-8 0" }],
  ["path", { d: "M3.103 6.034h17.794" }],
  [
    "path",
    {
      d: "M3.4 5.467a2 2 0 0 0-.4 1.2V20a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6.667a2 2 0 0 0-.4-1.2l-2-2.667A2 2 0 0 0 17 2H7a2 2 0 0 0-1.6.8z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShoppingBasket = [
  ["path", { d: "m15 11-1 9" }],
  ["path", { d: "m19 11-4-7" }],
  ["path", { d: "M2 11h20" }],
  ["path", { d: "m3.5 11 1.6 7.4a2 2 0 0 0 2 1.6h9.8a2 2 0 0 0 2-1.6l1.7-7.4" }],
  ["path", { d: "M4.5 15.5h15" }],
  ["path", { d: "m5 11 4-7" }],
  ["path", { d: "m9 11 1 9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShoppingCart = [
  ["circle", { cx: "8", cy: "21", r: "1" }],
  ["circle", { cx: "19", cy: "21", r: "1" }],
  [
    "path",
    { d: "M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shovel = [
  ["path", { d: "M2 22v-5l5-5 5 5-5 5z" }],
  ["path", { d: "M9.5 14.5 16 8" }],
  ["path", { d: "m17 2 5 5-.5.5a3.53 3.53 0 0 1-5 0s0 0 0 0a3.53 3.53 0 0 1 0-5L17 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ShowerHead = [
  ["path", { d: "m4 4 2.5 2.5" }],
  ["path", { d: "M13.5 6.5a4.95 4.95 0 0 0-7 7" }],
  ["path", { d: "M15 5 5 15" }],
  ["path", { d: "M14 17v.01" }],
  ["path", { d: "M10 16v.01" }],
  ["path", { d: "M13 13v.01" }],
  ["path", { d: "M16 10v.01" }],
  ["path", { d: "M11 20v.01" }],
  ["path", { d: "M17 14v.01" }],
  ["path", { d: "M20 11v.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shredder = [
  ["path", { d: "M10 22v-5" }],
  ["path", { d: "M14 19v-2" }],
  ["path", { d: "M14 2v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M18 20v-3" }],
  ["path", { d: "M2 13h20" }],
  ["path", { d: "M20 13V7l-5-5H6a2 2 0 0 0-2 2v9" }],
  ["path", { d: "M6 20v-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shrimp = [
  ["path", { d: "M11 12h.01" }],
  ["path", { d: "M13 22c.5-.5 1.12-1 2.5-1-1.38 0-2-.5-2.5-1" }],
  [
    "path",
    {
      d: "M14 2a3.28 3.28 0 0 1-3.227 1.798l-6.17-.561A2.387 2.387 0 1 0 4.387 8H15.5a1 1 0 0 1 0 13 1 1 0 0 0 0-5H12a7 7 0 0 1-7-7V8"
    }
  ],
  ["path", { d: "M14 8a8.5 8.5 0 0 1 0 8" }],
  ["path", { d: "M16 16c2 0 4.5-4 4-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shrink = [
  ["path", { d: "m15 15 6 6m-6-6v4.8m0-4.8h4.8" }],
  ["path", { d: "M9 19.8V15m0 0H4.2M9 15l-6 6" }],
  ["path", { d: "M15 4.2V9m0 0h4.8M15 9l6-6" }],
  ["path", { d: "M9 4.2V9m0 0H4.2M9 9 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shrub = [
  ["path", { d: "M12 22v-5.172a2 2 0 0 0-.586-1.414L9.5 13.5" }],
  ["path", { d: "M14.5 14.5 12 17" }],
  ["path", { d: "M17 8.8A6 6 0 0 1 13.8 20H10A6.5 6.5 0 0 1 7 8a5 5 0 0 1 10 0z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Shuffle = [
  ["path", { d: "m18 14 4 4-4 4" }],
  ["path", { d: "m18 2 4 4-4 4" }],
  ["path", { d: "M2 18h1.973a4 4 0 0 0 3.3-1.7l5.454-8.6a4 4 0 0 1 3.3-1.7H22" }],
  ["path", { d: "M2 6h1.972a4 4 0 0 1 3.6 2.2" }],
  ["path", { d: "M22 18h-6.041a4 4 0 0 1-3.3-1.8l-.359-.45" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sigma = [
  [
    "path",
    {
      d: "M18 7V5a1 1 0 0 0-1-1H6.5a.5.5 0 0 0-.4.8l4.5 6a2 2 0 0 1 0 2.4l-4.5 6a.5.5 0 0 0 .4.8H17a1 1 0 0 0 1-1v-2"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SignalHigh = [
  ["path", { d: "M2 20h.01" }],
  ["path", { d: "M7 20v-4" }],
  ["path", { d: "M12 20v-8" }],
  ["path", { d: "M17 20V8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SignalLow = [
  ["path", { d: "M2 20h.01" }],
  ["path", { d: "M7 20v-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SignalMedium = [
  ["path", { d: "M2 20h.01" }],
  ["path", { d: "M7 20v-4" }],
  ["path", { d: "M12 20v-8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SignalZero = [["path", { d: "M2 20h.01" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Signal = [
  ["path", { d: "M2 20h.01" }],
  ["path", { d: "M7 20v-4" }],
  ["path", { d: "M12 20v-8" }],
  ["path", { d: "M17 20V8" }],
  ["path", { d: "M22 4v16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Signature = [
  [
    "path",
    {
      d: "m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"
    }
  ],
  ["path", { d: "M3 21h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Signpost = [
  ["path", { d: "M12 13v8" }],
  ["path", { d: "M12 3v3" }],
  [
    "path",
    {
      d: "M18 6a2 2 0 0 1 1.387.56l2.307 2.22a1 1 0 0 1 0 1.44l-2.307 2.22A2 2 0 0 1 18 13H6a2 2 0 0 1-1.387-.56l-2.306-2.22a1 1 0 0 1 0-1.44l2.306-2.22A2 2 0 0 1 6 6z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SignpostBig = [
  ["path", { d: "M10 9H4L2 7l2-2h6" }],
  ["path", { d: "M14 5h6l2 2-2 2h-6" }],
  ["path", { d: "M10 22V4a2 2 0 1 1 4 0v18" }],
  ["path", { d: "M8 22h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Siren = [
  ["path", { d: "M7 18v-6a5 5 0 1 1 10 0v6" }],
  ["path", { d: "M5 21a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2z" }],
  ["path", { d: "M21 12h1" }],
  ["path", { d: "M18.5 4.5 18 5" }],
  ["path", { d: "M2 12h1" }],
  ["path", { d: "M12 2v1" }],
  ["path", { d: "m4.929 4.929.707.707" }],
  ["path", { d: "M12 12v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SkipBack = [
  ["polygon", { points: "19 20 9 12 19 4 19 20" }],
  ["line", { x1: "5", x2: "5", y1: "19", y2: "5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SkipForward = [
  ["polygon", { points: "5 4 15 12 5 20 5 4" }],
  ["line", { x1: "19", x2: "19", y1: "5", y2: "19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Skull = [
  ["path", { d: "m12.5 17-.5-1-.5 1h1z" }],
  [
    "path",
    {
      d: "M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z"
    }
  ],
  ["circle", { cx: "15", cy: "12", r: "1" }],
  ["circle", { cx: "9", cy: "12", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Slack = [
  ["rect", { width: "3", height: "8", x: "13", y: "2", rx: "1.5" }],
  ["path", { d: "M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" }],
  ["rect", { width: "3", height: "8", x: "8", y: "14", rx: "1.5" }],
  ["path", { d: "M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" }],
  ["rect", { width: "8", height: "3", x: "14", y: "13", rx: "1.5" }],
  ["path", { d: "M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" }],
  ["rect", { width: "8", height: "3", x: "2", y: "8", rx: "1.5" }],
  ["path", { d: "M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Slash = [["path", { d: "M22 2 2 22" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Slice = [
  [
    "path",
    {
      d: "M11 16.586V19a1 1 0 0 1-1 1H2L18.37 3.63a1 1 0 1 1 3 3l-9.663 9.663a1 1 0 0 1-1.414 0L8 14"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SlidersHorizontal = [
  ["line", { x1: "21", x2: "14", y1: "4", y2: "4" }],
  ["line", { x1: "10", x2: "3", y1: "4", y2: "4" }],
  ["line", { x1: "21", x2: "12", y1: "12", y2: "12" }],
  ["line", { x1: "8", x2: "3", y1: "12", y2: "12" }],
  ["line", { x1: "21", x2: "16", y1: "20", y2: "20" }],
  ["line", { x1: "12", x2: "3", y1: "20", y2: "20" }],
  ["line", { x1: "14", x2: "14", y1: "2", y2: "6" }],
  ["line", { x1: "8", x2: "8", y1: "10", y2: "14" }],
  ["line", { x1: "16", x2: "16", y1: "18", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SlidersVertical = [
  ["line", { x1: "4", x2: "4", y1: "21", y2: "14" }],
  ["line", { x1: "4", x2: "4", y1: "10", y2: "3" }],
  ["line", { x1: "12", x2: "12", y1: "21", y2: "12" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "3" }],
  ["line", { x1: "20", x2: "20", y1: "21", y2: "16" }],
  ["line", { x1: "20", x2: "20", y1: "12", y2: "3" }],
  ["line", { x1: "2", x2: "6", y1: "14", y2: "14" }],
  ["line", { x1: "10", x2: "14", y1: "8", y2: "8" }],
  ["line", { x1: "18", x2: "22", y1: "16", y2: "16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SmartphoneCharging = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2" }],
  ["path", { d: "M12.667 8 10 12h4l-2.667 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SmartphoneNfc = [
  ["rect", { width: "7", height: "12", x: "2", y: "6", rx: "1" }],
  ["path", { d: "M13 8.32a7.43 7.43 0 0 1 0 7.36" }],
  ["path", { d: "M16.46 6.21a11.76 11.76 0 0 1 0 11.58" }],
  ["path", { d: "M19.91 4.1a15.91 15.91 0 0 1 .01 15.8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Smartphone = [
  ["rect", { width: "14", height: "20", x: "5", y: "2", rx: "2", ry: "2" }],
  ["path", { d: "M12 18h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SmilePlus = [
  ["path", { d: "M22 11v1a10 10 0 1 1-9-10" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }],
  ["path", { d: "M16 5h6" }],
  ["path", { d: "M19 2v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Smile = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["path", { d: "M8 14s1.5 2 4 2 4-2 4-2" }],
  ["line", { x1: "9", x2: "9.01", y1: "9", y2: "9" }],
  ["line", { x1: "15", x2: "15.01", y1: "9", y2: "9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Snail = [
  ["path", { d: "M2 13a6 6 0 1 0 12 0 4 4 0 1 0-8 0 2 2 0 0 0 4 0" }],
  ["circle", { cx: "10", cy: "13", r: "8" }],
  ["path", { d: "M2 21h12c4.4 0 8-3.6 8-8V7a2 2 0 1 0-4 0v6" }],
  ["path", { d: "M18 3 19.1 5.2" }],
  ["path", { d: "M22 3 20.9 5.2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Snowflake = [
  ["path", { d: "m10 20-1.25-2.5L6 18" }],
  ["path", { d: "M10 4 8.75 6.5 6 6" }],
  ["path", { d: "m14 20 1.25-2.5L18 18" }],
  ["path", { d: "m14 4 1.25 2.5L18 6" }],
  ["path", { d: "m17 21-3-6h-4" }],
  ["path", { d: "m17 3-3 6 1.5 3" }],
  ["path", { d: "M2 12h6.5L10 9" }],
  ["path", { d: "m20 10-1.5 2 1.5 2" }],
  ["path", { d: "M22 12h-6.5L14 15" }],
  ["path", { d: "m4 10 1.5 2L4 14" }],
  ["path", { d: "m7 21 3-6-1.5-3" }],
  ["path", { d: "m7 3 3 6h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SoapDispenserDroplet = [
  ["path", { d: "M10.5 2v4" }],
  ["path", { d: "M14 2H7a2 2 0 0 0-2 2" }],
  [
    "path",
    {
      d: "M19.29 14.76A6.67 6.67 0 0 1 17 11a6.6 6.6 0 0 1-2.29 3.76c-1.15.92-1.71 2.04-1.71 3.19 0 2.22 1.8 4.05 4 4.05s4-1.83 4-4.05c0-1.16-.57-2.26-1.71-3.19"
    }
  ],
  ["path", { d: "M9.607 21H6a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h7V7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sofa = [
  ["path", { d: "M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" }],
  [
    "path",
    {
      d: "M2 16a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z"
    }
  ],
  ["path", { d: "M4 18v2" }],
  ["path", { d: "M20 18v2" }],
  ["path", { d: "M12 4v9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Soup = [
  ["path", { d: "M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" }],
  ["path", { d: "M7 21h10" }],
  ["path", { d: "M19.5 12 22 6" }],
  ["path", { d: "M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62" }],
  ["path", { d: "M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62" }],
  ["path", { d: "M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Space = [["path", { d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Spade = [
  [
    "path",
    {
      d: "M5 9c-1.5 1.5-3 3.2-3 5.5A5.5 5.5 0 0 0 7.5 20c1.8 0 3-.5 4.5-2 1.5 1.5 2.7 2 4.5 2a5.5 5.5 0 0 0 5.5-5.5c0-2.3-1.5-4-3-5.5l-7-7-7 7Z"
    }
  ],
  ["path", { d: "M12 18v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sparkle = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sparkles = [
  [
    "path",
    {
      d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"
    }
  ],
  ["path", { d: "M20 3v4" }],
  ["path", { d: "M22 5h-4" }],
  ["path", { d: "M4 17v2" }],
  ["path", { d: "M5 18H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Speaker = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2" }],
  ["path", { d: "M12 6h.01" }],
  ["circle", { cx: "12", cy: "14", r: "4" }],
  ["path", { d: "M12 14h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Speech = [
  [
    "path",
    {
      d: "M8.8 20v-4.1l1.9.2a2.3 2.3 0 0 0 2.164-2.1V8.3A5.37 5.37 0 0 0 2 8.25c0 2.8.656 3.054 1 4.55a5.77 5.77 0 0 1 .029 2.758L2 20"
    }
  ],
  ["path", { d: "M19.8 17.8a7.5 7.5 0 0 0 .003-10.603" }],
  ["path", { d: "M17 15a3.5 3.5 0 0 0-.025-4.975" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SpellCheck2 = [
  ["path", { d: "m6 16 6-12 6 12" }],
  ["path", { d: "M8 12h8" }],
  [
    "path",
    {
      d: "M4 21c1.1 0 1.1-1 2.3-1s1.1 1 2.3 1c1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SpellCheck = [
  ["path", { d: "m6 16 6-12 6 12" }],
  ["path", { d: "M8 12h8" }],
  ["path", { d: "m16 20 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SplinePointer = [
  [
    "path",
    {
      d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z"
    }
  ],
  ["path", { d: "M5 17A12 12 0 0 1 17 5" }],
  ["circle", { cx: "19", cy: "5", r: "2" }],
  ["circle", { cx: "5", cy: "19", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Spline = [
  ["circle", { cx: "19", cy: "5", r: "2" }],
  ["circle", { cx: "5", cy: "19", r: "2" }],
  ["path", { d: "M5 17A12 12 0 0 1 17 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Split = [
  ["path", { d: "M16 3h5v5" }],
  ["path", { d: "M8 3H3v5" }],
  ["path", { d: "M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3" }],
  ["path", { d: "m15 9 6-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Spool = [
  [
    "path",
    {
      d: "M17 13.44 4.442 17.082A2 2 0 0 0 4.982 21H19a2 2 0 0 0 .558-3.921l-1.115-.32A2 2 0 0 1 17 14.837V7.66"
    }
  ],
  [
    "path",
    {
      d: "m7 10.56 12.558-3.642A2 2 0 0 0 19.018 3H5a2 2 0 0 0-.558 3.921l1.115.32A2 2 0 0 1 7 9.163v7.178"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SprayCan = [
  ["path", { d: "M3 3h.01" }],
  ["path", { d: "M7 5h.01" }],
  ["path", { d: "M11 7h.01" }],
  ["path", { d: "M3 7h.01" }],
  ["path", { d: "M7 9h.01" }],
  ["path", { d: "M3 11h.01" }],
  ["rect", { width: "4", height: "4", x: "15", y: "5" }],
  ["path", { d: "m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2" }],
  ["path", { d: "m13 14 8-2" }],
  ["path", { d: "m13 19 8-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sprout = [
  ["path", { d: "M7 20h10" }],
  ["path", { d: "M10 20c5.5-2.5.8-6.4 3-10" }],
  [
    "path",
    {
      d: "M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"
    }
  ],
  [
    "path",
    { d: "M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareActivity = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M17 12h-2l-2 5-2-10-2 5H7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowDownLeft = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m16 8-8 8" }],
  ["path", { d: "M16 16H8V8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowDownRight = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m8 8 8 8" }],
  ["path", { d: "M16 8v8H8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowLeft = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m12 8-4 4 4 4" }],
  ["path", { d: "M16 12H8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowDown = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M12 8v8" }],
  ["path", { d: "m8 12 4 4 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowOutDownLeft = [
  ["path", { d: "M13 21h6a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v6" }],
  ["path", { d: "m3 21 9-9" }],
  ["path", { d: "M9 21H3v-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowOutUpLeft = [
  ["path", { d: "M13 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-6" }],
  ["path", { d: "m3 3 9 9" }],
  ["path", { d: "M3 9V3h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowOutDownRight = [
  ["path", { d: "M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" }],
  ["path", { d: "m21 21-9-9" }],
  ["path", { d: "M21 15v6h-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowOutUpRight = [
  ["path", { d: "M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" }],
  ["path", { d: "m21 3-9 9" }],
  ["path", { d: "M15 3h6v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowRight = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M8 12h8" }],
  ["path", { d: "m12 16 4-4-4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowUpLeft = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M8 16V8h8" }],
  ["path", { d: "M16 16 8 8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowUpRight = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M8 8h8v8" }],
  ["path", { d: "m8 16 8-8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareArrowUp = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m16 12-4-4-4 4" }],
  ["path", { d: "M12 16V8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareAsterisk = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M12 8v8" }],
  ["path", { d: "m8.5 14 7-4" }],
  ["path", { d: "m8.5 10 7 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareBottomDashedScissors = [
  ["path", { d: "M4 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2" }],
  ["path", { d: "M10 22H8" }],
  ["path", { d: "M16 22h-2" }],
  ["circle", { cx: "8", cy: "8", r: "2" }],
  ["path", { d: "M9.414 9.414 12 12" }],
  ["path", { d: "M14.8 14.8 18 18" }],
  ["circle", { cx: "8", cy: "16", r: "2" }],
  ["path", { d: "m18 6-8.586 8.586" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareChartGantt = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M9 8h7" }],
  ["path", { d: "M8 12h6" }],
  ["path", { d: "M11 16h5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareCheckBig = [
  ["path", { d: "M21 10.656V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12.344" }],
  ["path", { d: "m9 11 3 3L22 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareCheck = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m9 12 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareChevronDown = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m16 10-4 4-4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareChevronLeft = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m14 16-4-4 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareChevronRight = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m10 8 4 4-4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareChevronUp = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m8 14 4-4 4 4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareCode = [
  ["path", { d: "m10 9-3 3 3 3" }],
  ["path", { d: "m14 15 3-3-3-3" }],
  ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareDashedBottomCode = [
  ["path", { d: "M10 9.5 8 12l2 2.5" }],
  ["path", { d: "M14 21h1" }],
  ["path", { d: "m14 9.5 2 2.5-2 2.5" }],
  ["path", { d: "M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2" }],
  ["path", { d: "M9 21h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareDashedBottom = [
  ["path", { d: "M5 21a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2" }],
  ["path", { d: "M9 21h1" }],
  ["path", { d: "M14 21h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareDashedKanban = [
  ["path", { d: "M8 7v7" }],
  ["path", { d: "M12 7v4" }],
  ["path", { d: "M16 7v9" }],
  ["path", { d: "M5 3a2 2 0 0 0-2 2" }],
  ["path", { d: "M9 3h1" }],
  ["path", { d: "M14 3h1" }],
  ["path", { d: "M19 3a2 2 0 0 1 2 2" }],
  ["path", { d: "M21 9v1" }],
  ["path", { d: "M21 14v1" }],
  ["path", { d: "M21 19a2 2 0 0 1-2 2" }],
  ["path", { d: "M14 21h1" }],
  ["path", { d: "M9 21h1" }],
  ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
  ["path", { d: "M3 14v1" }],
  ["path", { d: "M3 9v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareDashedMousePointer = [
  [
    "path",
    {
      d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z"
    }
  ],
  ["path", { d: "M5 3a2 2 0 0 0-2 2" }],
  ["path", { d: "M19 3a2 2 0 0 1 2 2" }],
  ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
  ["path", { d: "M9 3h1" }],
  ["path", { d: "M9 21h2" }],
  ["path", { d: "M14 3h1" }],
  ["path", { d: "M3 9v1" }],
  ["path", { d: "M21 9v2" }],
  ["path", { d: "M3 14v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareDashedTopSolid = [
  ["path", { d: "M14 21h1" }],
  ["path", { d: "M21 14v1" }],
  ["path", { d: "M21 19a2 2 0 0 1-2 2" }],
  ["path", { d: "M21 9v1" }],
  ["path", { d: "M3 14v1" }],
  ["path", { d: "M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" }],
  ["path", { d: "M3 9v1" }],
  ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
  ["path", { d: "M9 21h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareDashed = [
  ["path", { d: "M5 3a2 2 0 0 0-2 2" }],
  ["path", { d: "M19 3a2 2 0 0 1 2 2" }],
  ["path", { d: "M21 19a2 2 0 0 1-2 2" }],
  ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
  ["path", { d: "M9 3h1" }],
  ["path", { d: "M9 21h1" }],
  ["path", { d: "M14 3h1" }],
  ["path", { d: "M14 21h1" }],
  ["path", { d: "M3 9v1" }],
  ["path", { d: "M21 9v1" }],
  ["path", { d: "M3 14v1" }],
  ["path", { d: "M21 14v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareDivide = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["line", { x1: "8", x2: "16", y1: "12", y2: "12" }],
  ["line", { x1: "12", x2: "12", y1: "16", y2: "16" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareDot = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["circle", { cx: "12", cy: "12", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareEqual = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M7 10h10" }],
  ["path", { d: "M7 14h10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareFunction = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["path", { d: "M9 17c2 0 2.8-1 2.8-2.8V10c0-2 1-3.3 3.2-3" }],
  ["path", { d: "M9 11.2h5.7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareLibrary = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M7 7v10" }],
  ["path", { d: "M11 7v10" }],
  ["path", { d: "m15 7 2 10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareKanban = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M8 7v7" }],
  ["path", { d: "M12 7v4" }],
  ["path", { d: "M16 7v9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareM = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M8 16V8l4 4 4-4v8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareMenu = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M7 8h10" }],
  ["path", { d: "M7 12h10" }],
  ["path", { d: "M7 16h10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareMousePointer = [
  [
    "path",
    {
      d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z"
    }
  ],
  ["path", { d: "M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareMinus = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M8 12h8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareParkingOff = [
  ["path", { d: "M3.6 3.6A2 2 0 0 1 5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-.59 1.41" }],
  ["path", { d: "M3 8.7V19a2 2 0 0 0 2 2h10.3" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M13 13a3 3 0 1 0 0-6H9v2" }],
  ["path", { d: "M9 17v-2.3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareParking = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M9 17V7h4a3 3 0 0 1 0 6H9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquarePen = [
  ["path", { d: "M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" }],
  [
    "path",
    {
      d: "M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquarePercent = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m15 9-6 6" }],
  ["path", { d: "M9 9h.01" }],
  ["path", { d: "M15 15h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquarePi = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M7 7h10" }],
  ["path", { d: "M10 7v10" }],
  ["path", { d: "M16 17a2 2 0 0 1-2-2V7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquarePilcrow = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M12 12H9.5a2.5 2.5 0 0 1 0-5H17" }],
  ["path", { d: "M12 7v10" }],
  ["path", { d: "M16 7v10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquarePlus = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M8 12h8" }],
  ["path", { d: "M12 8v8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquarePlay = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "m9 8 6 4-6 4Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquarePower = [
  ["path", { d: "M12 7v4" }],
  ["path", { d: "M7.998 9.003a5 5 0 1 0 8-.005" }],
  ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareRadical = [
  ["path", { d: "M7 12h2l2 5 2-10h4" }],
  ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareRoundCorner = [
  ["path", { d: "M21 11a8 8 0 0 0-8-8" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareScissors = [
  ["rect", { width: "20", height: "20", x: "2", y: "2", rx: "2" }],
  ["circle", { cx: "8", cy: "8", r: "2" }],
  ["path", { d: "M9.414 9.414 12 12" }],
  ["path", { d: "M14.8 14.8 18 18" }],
  ["circle", { cx: "8", cy: "16", r: "2" }],
  ["path", { d: "m18 6-8.586 8.586" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareSigma = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M16 8.9V7H8l4 5-4 5h8v-1.9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareSlash = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["line", { x1: "9", x2: "15", y1: "15", y2: "9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareSplitHorizontal = [
  ["path", { d: "M8 19H5c-1 0-2-1-2-2V7c0-1 1-2 2-2h3" }],
  ["path", { d: "M16 5h3c1 0 2 1 2 2v10c0 1-1 2-2 2h-3" }],
  ["line", { x1: "12", x2: "12", y1: "4", y2: "20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareSplitVertical = [
  ["path", { d: "M5 8V5c0-1 1-2 2-2h10c1 0 2 1 2 2v3" }],
  ["path", { d: "M19 16v3c0 1-1 2-2 2H7c-1 0-2-1-2-2v-3" }],
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareSquare = [
  ["rect", { x: "3", y: "3", width: "18", height: "18", rx: "2" }],
  ["rect", { x: "8", y: "8", width: "8", height: "8", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareStack = [
  ["path", { d: "M4 10c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" }],
  ["path", { d: "M10 16c-1.1 0-2-.9-2-2v-4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2" }],
  ["rect", { width: "8", height: "8", x: "14", y: "14", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareTerminal = [
  ["path", { d: "m7 11 2-2-2-2" }],
  ["path", { d: "M11 13h4" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareUserRound = [
  ["path", { d: "M18 21a6 6 0 0 0-12 0" }],
  ["circle", { cx: "12", cy: "11", r: "4" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareUser = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["circle", { cx: "12", cy: "10", r: "3" }],
  ["path", { d: "M7 21v-2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquareX = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["path", { d: "m15 9-6 6" }],
  ["path", { d: "m9 9 6 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Square = [["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquaresExclude = [
  [
    "path",
    {
      d: "M16 12v2a2 2 0 0 1-2 2H9a1 1 0 0 0-1 1v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h0"
    }
  ],
  [
    "path",
    {
      d: "M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 1-1 1h-5a2 2 0 0 0-2 2v2"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquaresIntersect = [
  ["path", { d: "M10 22a2 2 0 0 1-2-2" }],
  ["path", { d: "M14 2a2 2 0 0 1 2 2" }],
  ["path", { d: "M16 22h-2" }],
  ["path", { d: "M2 10V8" }],
  ["path", { d: "M2 4a2 2 0 0 1 2-2" }],
  ["path", { d: "M20 8a2 2 0 0 1 2 2" }],
  ["path", { d: "M22 14v2" }],
  ["path", { d: "M22 20a2 2 0 0 1-2 2" }],
  ["path", { d: "M4 16a2 2 0 0 1-2-2" }],
  ["path", { d: "M8 10a2 2 0 0 1 2-2h5a1 1 0 0 1 1 1v5a2 2 0 0 1-2 2H9a1 1 0 0 1-1-1z" }],
  ["path", { d: "M8 2h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquaresSubtract = [
  ["path", { d: "M10 22a2 2 0 0 1-2-2" }],
  ["path", { d: "M16 22h-2" }],
  [
    "path",
    {
      d: "M16 4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-5a2 2 0 0 1 2-2h5a1 1 0 0 0 1-1z"
    }
  ],
  ["path", { d: "M20 8a2 2 0 0 1 2 2" }],
  ["path", { d: "M22 14v2" }],
  ["path", { d: "M22 20a2 2 0 0 1-2 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquaresUnite = [
  [
    "path",
    {
      d: "M4 16a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v3a1 1 0 0 0 1 1h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-3a1 1 0 0 0-1-1z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SquircleDashed = [
  ["path", { d: "M13.77 3.043a34 34 0 0 0-3.54 0" }],
  ["path", { d: "M13.771 20.956a33 33 0 0 1-3.541.001" }],
  ["path", { d: "M20.18 17.74c-.51 1.15-1.29 1.93-2.439 2.44" }],
  ["path", { d: "M20.18 6.259c-.51-1.148-1.291-1.929-2.44-2.438" }],
  ["path", { d: "M20.957 10.23a33 33 0 0 1 0 3.54" }],
  ["path", { d: "M3.043 10.23a34 34 0 0 0 .001 3.541" }],
  ["path", { d: "M6.26 20.179c-1.15-.508-1.93-1.29-2.44-2.438" }],
  ["path", { d: "M6.26 3.82c-1.149.51-1.93 1.291-2.44 2.44" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Squircle = [
  ["path", { d: "M12 3c7.2 0 9 1.8 9 9s-1.8 9-9 9-9-1.8-9-9 1.8-9 9-9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Squirrel = [
  ["path", { d: "M15.236 22a3 3 0 0 0-2.2-5" }],
  ["path", { d: "M16 20a3 3 0 0 1 3-3h1a2 2 0 0 0 2-2v-2a4 4 0 0 0-4-4V4" }],
  ["path", { d: "M18 13h.01" }],
  [
    "path",
    {
      d: "M18 6a4 4 0 0 0-4 4 7 7 0 0 0-7 7c0-5 4-5 4-10.5a4.5 4.5 0 1 0-9 0 2.5 2.5 0 0 0 5 0C7 10 3 11 3 17c0 2.8 2.2 5 5 5h10"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Stamp = [
  ["path", { d: "M14 13V8.5C14 7 15 7 15 5a3 3 0 0 0-6 0c0 2 1 2 1 3.5V13" }],
  [
    "path",
    {
      d: "M20 15.5a2.5 2.5 0 0 0-2.5-2.5h-11A2.5 2.5 0 0 0 4 15.5V17a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1z"
    }
  ],
  ["path", { d: "M5 22h14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const StarHalf = [
  [
    "path",
    {
      d: "M12 18.338a2.1 2.1 0 0 0-.987.244L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679A.53.53 0 0 1 12 2"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const StarOff = [
  ["path", { d: "M8.34 8.34 2 9.27l5 4.87L5.82 21 12 17.77 18.18 21l-.59-3.43" }],
  ["path", { d: "M18.42 12.76 22 9.27l-6.91-1L12 2l-1.44 2.91" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Star = [
  [
    "path",
    {
      d: "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const StepBack = [
  ["line", { x1: "18", x2: "18", y1: "20", y2: "4" }],
  ["polygon", { points: "14,20 4,12 14,4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const StepForward = [
  ["line", { x1: "6", x2: "6", y1: "4", y2: "20" }],
  ["polygon", { points: "10,4 20,12 10,20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sticker = [
  ["path", { d: "M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" }],
  ["path", { d: "M14 3v4a2 2 0 0 0 2 2h4" }],
  ["path", { d: "M8 13h.01" }],
  ["path", { d: "M16 13h.01" }],
  ["path", { d: "M10 16s.8 1 2 1c1.3 0 2-1 2-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Stethoscope = [
  ["path", { d: "M11 2v2" }],
  ["path", { d: "M5 2v2" }],
  ["path", { d: "M5 3H4a2 2 0 0 0-2 2v4a6 6 0 0 0 12 0V5a2 2 0 0 0-2-2h-1" }],
  ["path", { d: "M8 15a6 6 0 0 0 12 0v-3" }],
  ["circle", { cx: "20", cy: "10", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const StickyNote = [
  ["path", { d: "M16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8Z" }],
  ["path", { d: "M15 3v4a2 2 0 0 0 2 2h4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Store = [
  ["path", { d: "m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" }],
  ["path", { d: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" }],
  ["path", { d: "M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" }],
  ["path", { d: "M2 7h20" }],
  [
    "path",
    {
      d: "M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const StretchHorizontal = [
  ["rect", { width: "20", height: "6", x: "2", y: "4", rx: "2" }],
  ["rect", { width: "20", height: "6", x: "2", y: "14", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const StretchVertical = [
  ["rect", { width: "6", height: "20", x: "4", y: "2", rx: "2" }],
  ["rect", { width: "6", height: "20", x: "14", y: "2", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Strikethrough = [
  ["path", { d: "M16 4H9a3 3 0 0 0-2.83 4" }],
  ["path", { d: "M14 12a4 4 0 0 1 0 8H6" }],
  ["line", { x1: "4", x2: "20", y1: "12", y2: "12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Subscript = [
  ["path", { d: "m4 5 8 8" }],
  ["path", { d: "m12 5-8 8" }],
  [
    "path",
    {
      d: "M20 19h-4c0-1.5.44-2 1.5-2.5S20 15.33 20 14c0-.47-.17-.93-.48-1.29a2.11 2.11 0 0 0-2.62-.44c-.42.24-.74.62-.9 1.07"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SunDim = [
  ["circle", { cx: "12", cy: "12", r: "4" }],
  ["path", { d: "M12 4h.01" }],
  ["path", { d: "M20 12h.01" }],
  ["path", { d: "M12 20h.01" }],
  ["path", { d: "M4 12h.01" }],
  ["path", { d: "M17.657 6.343h.01" }],
  ["path", { d: "M17.657 17.657h.01" }],
  ["path", { d: "M6.343 17.657h.01" }],
  ["path", { d: "M6.343 6.343h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SunMedium = [
  ["circle", { cx: "12", cy: "12", r: "4" }],
  ["path", { d: "M12 3v1" }],
  ["path", { d: "M12 20v1" }],
  ["path", { d: "M3 12h1" }],
  ["path", { d: "M20 12h1" }],
  ["path", { d: "m18.364 5.636-.707.707" }],
  ["path", { d: "m6.343 17.657-.707.707" }],
  ["path", { d: "m5.636 5.636.707.707" }],
  ["path", { d: "m17.657 17.657.707.707" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SunMoon = [
  ["path", { d: "M12 2v2" }],
  ["path", { d: "M13 8.129A4 4 0 0 1 15.873 11" }],
  ["path", { d: "m19 5-1.256 1.256" }],
  ["path", { d: "M20 12h2" }],
  ["path", { d: "M9 8a5 5 0 1 0 7 7 7 7 0 1 1-7-7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SunSnow = [
  ["path", { d: "M10 21v-1" }],
  ["path", { d: "M10 4V3" }],
  ["path", { d: "M10 9a3 3 0 0 0 0 6" }],
  ["path", { d: "m14 20 1.25-2.5L18 18" }],
  ["path", { d: "m14 4 1.25 2.5L18 6" }],
  ["path", { d: "m17 21-3-6 1.5-3H22" }],
  ["path", { d: "m17 3-3 6 1.5 3" }],
  ["path", { d: "M2 12h1" }],
  ["path", { d: "m20 10-1.5 2 1.5 2" }],
  ["path", { d: "m3.64 18.36.7-.7" }],
  ["path", { d: "m4.34 6.34-.7-.7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sun = [
  ["circle", { cx: "12", cy: "12", r: "4" }],
  ["path", { d: "M12 2v2" }],
  ["path", { d: "M12 20v2" }],
  ["path", { d: "m4.93 4.93 1.41 1.41" }],
  ["path", { d: "m17.66 17.66 1.41 1.41" }],
  ["path", { d: "M2 12h2" }],
  ["path", { d: "M20 12h2" }],
  ["path", { d: "m6.34 17.66-1.41 1.41" }],
  ["path", { d: "m19.07 4.93-1.41 1.41" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sunrise = [
  ["path", { d: "M12 2v8" }],
  ["path", { d: "m4.93 10.93 1.41 1.41" }],
  ["path", { d: "M2 18h2" }],
  ["path", { d: "M20 18h2" }],
  ["path", { d: "m19.07 10.93-1.41 1.41" }],
  ["path", { d: "M22 22H2" }],
  ["path", { d: "m8 6 4-4 4 4" }],
  ["path", { d: "M16 18a4 4 0 0 0-8 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sunset = [
  ["path", { d: "M12 10V2" }],
  ["path", { d: "m4.93 10.93 1.41 1.41" }],
  ["path", { d: "M2 18h2" }],
  ["path", { d: "M20 18h2" }],
  ["path", { d: "m19.07 10.93-1.41 1.41" }],
  ["path", { d: "M22 22H2" }],
  ["path", { d: "m16 6-4 4-4-4" }],
  ["path", { d: "M16 18a4 4 0 0 0-8 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Superscript = [
  ["path", { d: "m4 19 8-8" }],
  ["path", { d: "m12 19-8-8" }],
  [
    "path",
    {
      d: "M20 12h-4c0-1.5.442-2 1.5-2.5S20 8.334 20 7.002c0-.472-.17-.93-.484-1.29a2.105 2.105 0 0 0-2.617-.436c-.42.239-.738.614-.899 1.06"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SwatchBook = [
  ["path", { d: "M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" }],
  ["path", { d: "M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" }],
  ["path", { d: "M 7 17h.01" }],
  [
    "path",
    { d: "m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SwissFranc = [
  ["path", { d: "M10 21V3h8" }],
  ["path", { d: "M6 16h9" }],
  ["path", { d: "M10 9.5h7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const SwitchCamera = [
  ["path", { d: "M11 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h5" }],
  ["path", { d: "M13 5h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5" }],
  ["circle", { cx: "12", cy: "12", r: "3" }],
  ["path", { d: "m18 22-3-3 3-3" }],
  ["path", { d: "m6 2 3 3-3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Sword = [
  ["polyline", { points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5" }],
  ["line", { x1: "13", x2: "19", y1: "19", y2: "13" }],
  ["line", { x1: "16", x2: "20", y1: "16", y2: "20" }],
  ["line", { x1: "19", x2: "21", y1: "21", y2: "19" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Swords = [
  ["polyline", { points: "14.5 17.5 3 6 3 3 6 3 17.5 14.5" }],
  ["line", { x1: "13", x2: "19", y1: "19", y2: "13" }],
  ["line", { x1: "16", x2: "20", y1: "16", y2: "20" }],
  ["line", { x1: "19", x2: "21", y1: "21", y2: "19" }],
  ["polyline", { points: "14.5 6.5 18 3 21 3 21 6 17.5 9.5" }],
  ["line", { x1: "5", x2: "9", y1: "14", y2: "18" }],
  ["line", { x1: "7", x2: "4", y1: "17", y2: "20" }],
  ["line", { x1: "3", x2: "5", y1: "19", y2: "21" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Syringe = [
  ["path", { d: "m18 2 4 4" }],
  ["path", { d: "m17 7 3-3" }],
  ["path", { d: "M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" }],
  ["path", { d: "m9 11 4 4" }],
  ["path", { d: "m5 19-3 3" }],
  ["path", { d: "m14 4 6 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Table2 = [
  [
    "path",
    {
      d: "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TableCellsMerge = [
  ["path", { d: "M12 21v-6" }],
  ["path", { d: "M12 9V3" }],
  ["path", { d: "M3 15h18" }],
  ["path", { d: "M3 9h18" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TableCellsSplit = [
  ["path", { d: "M12 15V9" }],
  ["path", { d: "M3 15h18" }],
  ["path", { d: "M3 9h18" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TableColumnsSplit = [
  ["path", { d: "M14 14v2" }],
  ["path", { d: "M14 20v2" }],
  ["path", { d: "M14 2v2" }],
  ["path", { d: "M14 8v2" }],
  ["path", { d: "M2 15h8" }],
  ["path", { d: "M2 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H2" }],
  ["path", { d: "M2 9h8" }],
  ["path", { d: "M22 15h-4" }],
  ["path", { d: "M22 3h-2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h2" }],
  ["path", { d: "M22 9h-4" }],
  ["path", { d: "M5 3v18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TableOfContents = [
  ["path", { d: "M16 12H3" }],
  ["path", { d: "M16 18H3" }],
  ["path", { d: "M16 6H3" }],
  ["path", { d: "M21 12h.01" }],
  ["path", { d: "M21 18h.01" }],
  ["path", { d: "M21 6h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TableProperties = [
  ["path", { d: "M15 3v18" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M21 9H3" }],
  ["path", { d: "M21 15H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TableRowsSplit = [
  ["path", { d: "M14 10h2" }],
  ["path", { d: "M15 22v-8" }],
  ["path", { d: "M15 2v4" }],
  ["path", { d: "M2 10h2" }],
  ["path", { d: "M20 10h2" }],
  ["path", { d: "M3 19h18" }],
  ["path", { d: "M3 22v-6a2 2 135 0 1 2-2h14a2 2 45 0 1 2 2v6" }],
  ["path", { d: "M3 2v2a2 2 45 0 0 2 2h14a2 2 135 0 0 2-2V2" }],
  ["path", { d: "M8 10h2" }],
  ["path", { d: "M9 22v-8" }],
  ["path", { d: "M9 2v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Table = [
  ["path", { d: "M12 3v18" }],
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 9h18" }],
  ["path", { d: "M3 15h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TabletSmartphone = [
  ["rect", { width: "10", height: "14", x: "3", y: "8", rx: "2" }],
  ["path", { d: "M5 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2.4" }],
  ["path", { d: "M8 18h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tablet = [
  ["rect", { width: "16", height: "20", x: "4", y: "2", rx: "2", ry: "2" }],
  ["line", { x1: "12", x2: "12.01", y1: "18", y2: "18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tablets = [
  ["circle", { cx: "7", cy: "7", r: "5" }],
  ["circle", { cx: "17", cy: "17", r: "5" }],
  ["path", { d: "M12 17h10" }],
  ["path", { d: "m3.46 10.54 7.08-7.08" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tag = [
  [
    "path",
    {
      d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"
    }
  ],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tags = [
  ["path", { d: "m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19" }],
  [
    "path",
    {
      d: "M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"
    }
  ],
  ["circle", { cx: "6.5", cy: "9.5", r: ".5", fill: "currentColor" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tally1 = [["path", { d: "M4 4v16" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tally2 = [
  ["path", { d: "M4 4v16" }],
  ["path", { d: "M9 4v16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tally3 = [
  ["path", { d: "M4 4v16" }],
  ["path", { d: "M9 4v16" }],
  ["path", { d: "M14 4v16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tally4 = [
  ["path", { d: "M4 4v16" }],
  ["path", { d: "M9 4v16" }],
  ["path", { d: "M14 4v16" }],
  ["path", { d: "M19 4v16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tally5 = [
  ["path", { d: "M4 4v16" }],
  ["path", { d: "M9 4v16" }],
  ["path", { d: "M14 4v16" }],
  ["path", { d: "M19 4v16" }],
  ["path", { d: "M22 6 2 18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tangent = [
  ["circle", { cx: "17", cy: "4", r: "2" }],
  ["path", { d: "M15.59 5.41 5.41 15.59" }],
  ["circle", { cx: "4", cy: "17", r: "2" }],
  ["path", { d: "M12 22s-4-9-1.5-11.5S22 12 22 12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Target = [
  ["circle", { cx: "12", cy: "12", r: "10" }],
  ["circle", { cx: "12", cy: "12", r: "6" }],
  ["circle", { cx: "12", cy: "12", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Telescope = [
  [
    "path",
    {
      d: "m10.065 12.493-6.18 1.318a.934.934 0 0 1-1.108-.702l-.537-2.15a1.07 1.07 0 0 1 .691-1.265l13.504-4.44"
    }
  ],
  ["path", { d: "m13.56 11.747 4.332-.924" }],
  ["path", { d: "m16 21-3.105-6.21" }],
  [
    "path",
    {
      d: "M16.485 5.94a2 2 0 0 1 1.455-2.425l1.09-.272a1 1 0 0 1 1.212.727l1.515 6.06a1 1 0 0 1-.727 1.213l-1.09.272a2 2 0 0 1-2.425-1.455z"
    }
  ],
  ["path", { d: "m6.158 8.633 1.114 4.456" }],
  ["path", { d: "m8 21 3.105-6.21" }],
  ["circle", { cx: "12", cy: "13", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TentTree = [
  ["circle", { cx: "4", cy: "4", r: "2" }],
  ["path", { d: "m14 5 3-3 3 3" }],
  ["path", { d: "m14 10 3-3 3 3" }],
  ["path", { d: "M17 14V2" }],
  ["path", { d: "M17 14H7l-5 8h20Z" }],
  ["path", { d: "M8 14v8" }],
  ["path", { d: "m9 14 5 8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tent = [
  ["path", { d: "M3.5 21 14 3" }],
  ["path", { d: "M20.5 21 10 3" }],
  ["path", { d: "M15.5 21 12 15l-3.5 6" }],
  ["path", { d: "M2 21h20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Terminal = [
  ["path", { d: "M12 19h8" }],
  ["path", { d: "m4 17 6-6-6-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TestTube = [
  ["path", { d: "M14.5 2v17.5c0 1.4-1.1 2.5-2.5 2.5c-1.4 0-2.5-1.1-2.5-2.5V2" }],
  ["path", { d: "M8.5 2h7" }],
  ["path", { d: "M14.5 16h-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TestTubes = [
  ["path", { d: "M9 2v17.5A2.5 2.5 0 0 1 6.5 22A2.5 2.5 0 0 1 4 19.5V2" }],
  ["path", { d: "M20 2v17.5a2.5 2.5 0 0 1-2.5 2.5a2.5 2.5 0 0 1-2.5-2.5V2" }],
  ["path", { d: "M3 2h7" }],
  ["path", { d: "M14 2h7" }],
  ["path", { d: "M9 16H4" }],
  ["path", { d: "M20 16h-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TestTubeDiagonal = [
  ["path", { d: "M21 7 6.82 21.18a2.83 2.83 0 0 1-3.99-.01a2.83 2.83 0 0 1 0-4L17 3" }],
  ["path", { d: "m16 2 6 6" }],
  ["path", { d: "M12 16H4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TextCursorInput = [
  ["path", { d: "M12 20h-1a2 2 0 0 1-2-2 2 2 0 0 1-2 2H6" }],
  ["path", { d: "M13 8h7a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-7" }],
  ["path", { d: "M5 16H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h1" }],
  ["path", { d: "M6 4h1a2 2 0 0 1 2 2 2 2 0 0 1 2-2h1" }],
  ["path", { d: "M9 6v12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TextCursor = [
  ["path", { d: "M17 22h-1a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4h1" }],
  ["path", { d: "M7 22h1a4 4 0 0 0 4-4v-1" }],
  ["path", { d: "M7 2h1a4 4 0 0 1 4 4v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TextQuote = [
  ["path", { d: "M17 6H3" }],
  ["path", { d: "M21 12H8" }],
  ["path", { d: "M21 18H8" }],
  ["path", { d: "M3 12v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TextSearch = [
  ["path", { d: "M21 6H3" }],
  ["path", { d: "M10 12H3" }],
  ["path", { d: "M10 18H3" }],
  ["circle", { cx: "17", cy: "15", r: "3" }],
  ["path", { d: "m21 19-1.9-1.9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TextSelect = [
  ["path", { d: "M14 21h1" }],
  ["path", { d: "M14 3h1" }],
  ["path", { d: "M19 3a2 2 0 0 1 2 2" }],
  ["path", { d: "M21 14v1" }],
  ["path", { d: "M21 19a2 2 0 0 1-2 2" }],
  ["path", { d: "M21 9v1" }],
  ["path", { d: "M3 14v1" }],
  ["path", { d: "M3 9v1" }],
  ["path", { d: "M5 21a2 2 0 0 1-2-2" }],
  ["path", { d: "M5 3a2 2 0 0 0-2 2" }],
  ["path", { d: "M7 12h10" }],
  ["path", { d: "M7 16h6" }],
  ["path", { d: "M7 8h8" }],
  ["path", { d: "M9 21h1" }],
  ["path", { d: "M9 3h1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Text = [
  ["path", { d: "M15 18H3" }],
  ["path", { d: "M17 6H3" }],
  ["path", { d: "M21 12H3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ThermometerSnowflake = [
  ["path", { d: "m10 20-1.25-2.5L6 18" }],
  ["path", { d: "M10 4 8.75 6.5 6 6" }],
  ["path", { d: "M10.585 15H10" }],
  ["path", { d: "M2 12h6.5L10 9" }],
  ["path", { d: "M20 14.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" }],
  ["path", { d: "m4 10 1.5 2L4 14" }],
  ["path", { d: "m7 21 3-6-1.5-3" }],
  ["path", { d: "m7 3 3 6h2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ThermometerSun = [
  ["path", { d: "M12 9a4 4 0 0 0-2 7.5" }],
  ["path", { d: "M12 3v2" }],
  ["path", { d: "m6.6 18.4-1.4 1.4" }],
  ["path", { d: "M20 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" }],
  ["path", { d: "M4 13H2" }],
  ["path", { d: "M6.34 7.34 4.93 5.93" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Theater = [
  ["path", { d: "M2 10s3-3 3-8" }],
  ["path", { d: "M22 10s-3-3-3-8" }],
  ["path", { d: "M10 2c0 4.4-3.6 8-8 8" }],
  ["path", { d: "M14 2c0 4.4 3.6 8 8 8" }],
  ["path", { d: "M2 10s2 2 2 5" }],
  ["path", { d: "M22 10s-2 2-2 5" }],
  ["path", { d: "M8 15h8" }],
  ["path", { d: "M2 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" }],
  ["path", { d: "M14 22v-1a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Thermometer = [["path", { d: "M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ThumbsDown = [
  ["path", { d: "M17 14V2" }],
  [
    "path",
    {
      d: "M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ThumbsUp = [
  ["path", { d: "M7 10v12" }],
  [
    "path",
    {
      d: "M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TicketCheck = [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TicketMinus = [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
    }
  ],
  ["path", { d: "M9 12h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TicketPercent = [
  [
    "path",
    {
      d: "M2 9a3 3 0 1 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 1 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
    }
  ],
  ["path", { d: "M9 9h.01" }],
  ["path", { d: "m15 9-6 6" }],
  ["path", { d: "M15 15h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TicketPlus = [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
    }
  ],
  ["path", { d: "M9 12h6" }],
  ["path", { d: "M12 9v6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TicketSlash = [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
    }
  ],
  ["path", { d: "m9.5 14.5 5-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TicketX = [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
    }
  ],
  ["path", { d: "m9.5 14.5 5-5" }],
  ["path", { d: "m9.5 9.5 5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ticket = [
  [
    "path",
    {
      d: "M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"
    }
  ],
  ["path", { d: "M13 5v2" }],
  ["path", { d: "M13 17v2" }],
  ["path", { d: "M13 11v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TicketsPlane = [
  ["path", { d: "M10.5 17h1.227a2 2 0 0 0 1.345-.52L18 12" }],
  ["path", { d: "m12 13.5 3.75.5" }],
  ["path", { d: "m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" }],
  ["path", { d: "M6 10V8" }],
  ["path", { d: "M6 14v1" }],
  ["path", { d: "M6 19v2" }],
  ["rect", { x: "2", y: "8", width: "20", height: "13", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tickets = [
  ["path", { d: "m4.5 8 10.58-5.06a1 1 0 0 1 1.342.488L18.5 8" }],
  ["path", { d: "M6 10V8" }],
  ["path", { d: "M6 14v1" }],
  ["path", { d: "M6 19v2" }],
  ["rect", { x: "2", y: "8", width: "20", height: "13", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TimerOff = [
  ["path", { d: "M10 2h4" }],
  ["path", { d: "M4.6 11a8 8 0 0 0 1.7 8.7 8 8 0 0 0 8.7 1.7" }],
  ["path", { d: "M7.4 7.4a8 8 0 0 1 10.3 1 8 8 0 0 1 .9 10.2" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M12 12v-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TimerReset = [
  ["path", { d: "M10 2h4" }],
  ["path", { d: "M12 14v-4" }],
  ["path", { d: "M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" }],
  ["path", { d: "M9 17H4v5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Timer = [
  ["line", { x1: "10", x2: "14", y1: "2", y2: "2" }],
  ["line", { x1: "12", x2: "15", y1: "14", y2: "11" }],
  ["circle", { cx: "12", cy: "14", r: "8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ToggleLeft = [
  ["circle", { cx: "9", cy: "12", r: "3" }],
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ToggleRight = [
  ["circle", { cx: "15", cy: "12", r: "3" }],
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Toilet = [
  [
    "path",
    {
      d: "M7 12h13a1 1 0 0 1 1 1 5 5 0 0 1-5 5h-.598a.5.5 0 0 0-.424.765l1.544 2.47a.5.5 0 0 1-.424.765H5.402a.5.5 0 0 1-.424-.765L7 18"
    }
  ],
  ["path", { d: "M8 18a5 5 0 0 1-5-5V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tornado = [
  ["path", { d: "M21 4H3" }],
  ["path", { d: "M18 8H6" }],
  ["path", { d: "M19 12H9" }],
  ["path", { d: "M16 16h-6" }],
  ["path", { d: "M11 20H9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ToolCase = [
  ["path", { d: "M10 15h4" }],
  [
    "path",
    {
      d: "m14.817 10.995-.971-1.45 1.034-1.232a2 2 0 0 0-2.025-3.238l-1.82.364L9.91 3.885a2 2 0 0 0-3.625.748L6.141 6.55l-1.725.426a2 2 0 0 0-.19 3.756l.657.27"
    }
  ],
  [
    "path",
    {
      d: "m18.822 10.995 2.26-5.38a1 1 0 0 0-.557-1.318L16.954 2.9a1 1 0 0 0-1.281.533l-.924 2.122"
    }
  ],
  ["path", { d: "M4 12.006A1 1 0 0 1 4.994 11H19a1 1 0 0 1 1 1v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Torus = [
  ["ellipse", { cx: "12", cy: "11", rx: "3", ry: "2" }],
  ["ellipse", { cx: "12", cy: "12.5", rx: "10", ry: "8.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TouchpadOff = [
  ["path", { d: "M12 20v-6" }],
  ["path", { d: "M19.656 14H22" }],
  ["path", { d: "M2 14h12" }],
  ["path", { d: "m2 2 20 20" }],
  ["path", { d: "M20 20H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2" }],
  ["path", { d: "M9.656 4H20a2 2 0 0 1 2 2v10.344" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Touchpad = [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
  ["path", { d: "M2 14h20" }],
  ["path", { d: "M12 20v-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TowerControl = [
  ["path", { d: "M18.2 12.27 20 6H4l1.8 6.27a1 1 0 0 0 .95.73h10.5a1 1 0 0 0 .96-.73Z" }],
  ["path", { d: "M8 13v9" }],
  ["path", { d: "M16 22v-9" }],
  ["path", { d: "m9 6 1 7" }],
  ["path", { d: "m15 6-1 7" }],
  ["path", { d: "M12 6V2" }],
  ["path", { d: "M13 2h-2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ToyBrick = [
  ["rect", { width: "18", height: "12", x: "3", y: "8", rx: "1" }],
  ["path", { d: "M10 8V5c0-.6-.4-1-1-1H6a1 1 0 0 0-1 1v3" }],
  ["path", { d: "M19 8V5c0-.6-.4-1-1-1h-3a1 1 0 0 0-1 1v3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tractor = [
  ["path", { d: "m10 11 11 .9a1 1 0 0 1 .8 1.1l-.665 4.158a1 1 0 0 1-.988.842H20" }],
  ["path", { d: "M16 18h-5" }],
  ["path", { d: "M18 5a1 1 0 0 0-1 1v5.573" }],
  ["path", { d: "M3 4h8.129a1 1 0 0 1 .99.863L13 11.246" }],
  ["path", { d: "M4 11V4" }],
  ["path", { d: "M7 15h.01" }],
  ["path", { d: "M8 10.1V4" }],
  ["circle", { cx: "18", cy: "18", r: "2" }],
  ["circle", { cx: "7", cy: "15", r: "5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TrafficCone = [
  ["path", { d: "M16.05 10.966a5 2.5 0 0 1-8.1 0" }],
  [
    "path",
    {
      d: "m16.923 14.049 4.48 2.04a1 1 0 0 1 .001 1.831l-8.574 3.9a2 2 0 0 1-1.66 0l-8.574-3.91a1 1 0 0 1 0-1.83l4.484-2.04"
    }
  ],
  ["path", { d: "M16.949 14.14a5 2.5 0 1 1-9.9 0L10.063 3.5a2 2 0 0 1 3.874 0z" }],
  ["path", { d: "M9.194 6.57a5 2.5 0 0 0 5.61 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TrainFrontTunnel = [
  ["path", { d: "M2 22V12a10 10 0 1 1 20 0v10" }],
  ["path", { d: "M15 6.8v1.4a3 2.8 0 1 1-6 0V6.8" }],
  ["path", { d: "M10 15h.01" }],
  ["path", { d: "M14 15h.01" }],
  ["path", { d: "M10 19a4 4 0 0 1-4-4v-3a6 6 0 1 1 12 0v3a4 4 0 0 1-4 4Z" }],
  ["path", { d: "m9 19-2 3" }],
  ["path", { d: "m15 19 2 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TrainFront = [
  ["path", { d: "M8 3.1V7a4 4 0 0 0 8 0V3.1" }],
  ["path", { d: "m9 15-1-1" }],
  ["path", { d: "m15 15 1-1" }],
  ["path", { d: "M9 19c-2.8 0-5-2.2-5-5v-4a8 8 0 0 1 16 0v4c0 2.8-2.2 5-5 5Z" }],
  ["path", { d: "m8 19-2 3" }],
  ["path", { d: "m16 19 2 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TramFront = [
  ["rect", { width: "16", height: "16", x: "4", y: "3", rx: "2" }],
  ["path", { d: "M4 11h16" }],
  ["path", { d: "M12 3v8" }],
  ["path", { d: "m8 19-2 3" }],
  ["path", { d: "m18 22-2-3" }],
  ["path", { d: "M8 15h.01" }],
  ["path", { d: "M16 15h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TrainTrack = [
  ["path", { d: "M2 17 17 2" }],
  ["path", { d: "m2 14 8 8" }],
  ["path", { d: "m5 11 8 8" }],
  ["path", { d: "m8 8 8 8" }],
  ["path", { d: "m11 5 8 8" }],
  ["path", { d: "m14 2 8 8" }],
  ["path", { d: "M7 22 22 7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Transgender = [
  ["path", { d: "M12 16v6" }],
  ["path", { d: "M14 20h-4" }],
  ["path", { d: "M18 2h4v4" }],
  ["path", { d: "m2 2 7.17 7.17" }],
  ["path", { d: "M2 5.355V2h3.357" }],
  ["path", { d: "m22 2-7.17 7.17" }],
  ["path", { d: "M8 5 5 8" }],
  ["circle", { cx: "12", cy: "12", r: "4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trash2 = [
  ["path", { d: "M3 6h18" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }],
  ["line", { x1: "10", x2: "10", y1: "11", y2: "17" }],
  ["line", { x1: "14", x2: "14", y1: "11", y2: "17" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trash = [
  ["path", { d: "M3 6h18" }],
  ["path", { d: "M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" }],
  ["path", { d: "M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TreeDeciduous = [
  [
    "path",
    {
      d: "M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z"
    }
  ],
  ["path", { d: "M12 19v3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TreePalm = [
  ["path", { d: "M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" }],
  ["path", { d: "M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" }],
  [
    "path",
    {
      d: "M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35"
    }
  ],
  ["path", { d: "M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TreePine = [
  [
    "path",
    {
      d: "m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z"
    }
  ],
  ["path", { d: "M12 22v-3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trees = [
  ["path", { d: "M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" }],
  ["path", { d: "M7 16v6" }],
  ["path", { d: "M13 19v3" }],
  [
    "path",
    {
      d: "M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trello = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2", ry: "2" }],
  ["rect", { width: "3", height: "9", x: "7", y: "7" }],
  ["rect", { width: "3", height: "5", x: "14", y: "7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TrendingDown = [
  ["path", { d: "M16 17h6v-6" }],
  ["path", { d: "m22 17-8.5-8.5-5 5L2 7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TrendingUpDown = [
  ["path", { d: "M14.828 14.828 21 21" }],
  ["path", { d: "M21 16v5h-5" }],
  ["path", { d: "m21 3-9 9-4-4-6 6" }],
  ["path", { d: "M21 8V3h-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TrendingUp = [
  ["path", { d: "M16 7h6v6" }],
  ["path", { d: "m22 7-8.5 8.5-5-5L2 17" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TriangleAlert = [
  ["path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" }],
  ["path", { d: "M12 9v4" }],
  ["path", { d: "M12 17h.01" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TriangleDashed = [
  ["path", { d: "M10.17 4.193a2 2 0 0 1 3.666.013" }],
  ["path", { d: "M14 21h2" }],
  ["path", { d: "m15.874 7.743 1 1.732" }],
  ["path", { d: "m18.849 12.952 1 1.732" }],
  ["path", { d: "M21.824 18.18a2 2 0 0 1-1.835 2.824" }],
  ["path", { d: "M4.024 21a2 2 0 0 1-1.839-2.839" }],
  ["path", { d: "m5.136 12.952-1 1.732" }],
  ["path", { d: "M8 21h2" }],
  ["path", { d: "m8.102 7.743-1 1.732" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TriangleRight = [
  ["path", { d: "M22 18a2 2 0 0 1-2 2H3c-1.1 0-1.3-.6-.4-1.3L20.4 4.3c.9-.7 1.6-.4 1.6.7Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Triangle = [
  ["path", { d: "M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Trophy = [
  ["path", { d: "M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978" }],
  ["path", { d: "M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978" }],
  ["path", { d: "M18 9h1.5a1 1 0 0 0 0-5H18" }],
  ["path", { d: "M4 22h16" }],
  ["path", { d: "M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z" }],
  ["path", { d: "M6 9H4.5a1 1 0 0 1 0-5H6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Truck = [
  ["path", { d: "M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" }],
  ["path", { d: "M15 18H9" }],
  [
    "path",
    { d: "M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" }
  ],
  ["circle", { cx: "17", cy: "18", r: "2" }],
  ["circle", { cx: "7", cy: "18", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TruckElectric = [
  ["path", { d: "M14 19V7a2 2 0 0 0-2-2H9" }],
  ["path", { d: "M15 19H9" }],
  ["path", { d: "M19 19h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62L18.3 9.38a1 1 0 0 0-.78-.38H14" }],
  ["path", { d: "M2 13v5a1 1 0 0 0 1 1h2" }],
  ["path", { d: "M4 3 2.15 5.15a.495.495 0 0 0 .35.86h2.15a.47.47 0 0 1 .35.86L3 9.02" }],
  ["circle", { cx: "17", cy: "19", r: "2" }],
  ["circle", { cx: "7", cy: "19", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Turtle = [
  [
    "path",
    {
      d: "m12 10 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a8 8 0 1 0-16 0v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3l2-4h4Z"
    }
  ],
  ["path", { d: "M4.82 7.9 8 10" }],
  ["path", { d: "M15.18 7.9 12 10" }],
  ["path", { d: "M16.93 10H20a2 2 0 0 1 0 4H2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TvMinimalPlay = [
  [
    "path",
    {
      d: "M10 7.75a.75.75 0 0 1 1.142-.638l3.664 2.249a.75.75 0 0 1 0 1.278l-3.664 2.25a.75.75 0 0 1-1.142-.64z"
    }
  ],
  ["path", { d: "M7 21h10" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TvMinimal = [
  ["path", { d: "M7 21h10" }],
  ["rect", { width: "20", height: "14", x: "2", y: "3", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Tv = [
  ["path", { d: "m17 2-5 5-5-5" }],
  ["rect", { width: "20", height: "15", x: "2", y: "7", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Twitch = [["path", { d: "M21 2H3v16h5v4l4-4h5l4-4V2zm-10 9V7m5 4V7" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Twitter = [
  [
    "path",
    {
      d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Type = [
  ["path", { d: "M12 4v16" }],
  ["path", { d: "M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2" }],
  ["path", { d: "M9 20h6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const TypeOutline = [
  [
    "path",
    {
      d: "M14 16.5a.5.5 0 0 0 .5.5h.5a2 2 0 0 1 0 4H9a2 2 0 0 1 0-4h.5a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5V8a2 2 0 0 1-4 0V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3a2 2 0 0 1-4 0v-.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UmbrellaOff = [
  ["path", { d: "M12 2v1" }],
  ["path", { d: "M15.5 21a1.85 1.85 0 0 1-3.5-1v-8H2a10 10 0 0 1 3.428-6.575" }],
  ["path", { d: "M17.5 12H22A10 10 0 0 0 9.004 3.455" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Umbrella = [
  ["path", { d: "M22 12a10.06 10.06 1 0 0-20 0Z" }],
  ["path", { d: "M12 12v8a2 2 0 0 0 4 0" }],
  ["path", { d: "M12 2v1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Underline = [
  ["path", { d: "M6 4v6a6 6 0 0 0 12 0V4" }],
  ["line", { x1: "4", x2: "20", y1: "20", y2: "20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Undo2 = [
  ["path", { d: "M9 14 4 9l5-5" }],
  ["path", { d: "M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UndoDot = [
  ["path", { d: "M21 17a9 9 0 0 0-15-6.7L3 13" }],
  ["path", { d: "M3 7v6h6" }],
  ["circle", { cx: "12", cy: "17", r: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Undo = [
  ["path", { d: "M3 7v6h6" }],
  ["path", { d: "M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UnfoldHorizontal = [
  ["path", { d: "M16 12h6" }],
  ["path", { d: "M8 12H2" }],
  ["path", { d: "M12 2v2" }],
  ["path", { d: "M12 8v2" }],
  ["path", { d: "M12 14v2" }],
  ["path", { d: "M12 20v2" }],
  ["path", { d: "m19 15 3-3-3-3" }],
  ["path", { d: "m5 9-3 3 3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UnfoldVertical = [
  ["path", { d: "M12 22v-6" }],
  ["path", { d: "M12 8V2" }],
  ["path", { d: "M4 12H2" }],
  ["path", { d: "M10 12H8" }],
  ["path", { d: "M16 12h-2" }],
  ["path", { d: "M22 12h-2" }],
  ["path", { d: "m15 19-3 3-3-3" }],
  ["path", { d: "m15 5-3-3-3 3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Ungroup = [
  ["rect", { width: "8", height: "6", x: "5", y: "4", rx: "1" }],
  ["rect", { width: "8", height: "6", x: "11", y: "14", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const University = [
  ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3" }],
  ["path", { d: "M18 12h.01" }],
  ["path", { d: "M18 16h.01" }],
  [
    "path",
    {
      d: "M22 7a1 1 0 0 0-1-1h-2a2 2 0 0 1-1.143-.359L13.143 2.36a2 2 0 0 0-2.286-.001L6.143 5.64A2 2 0 0 1 5 6H3a1 1 0 0 0-1 1v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z"
    }
  ],
  ["path", { d: "M6 12h.01" }],
  ["path", { d: "M6 16h.01" }],
  ["circle", { cx: "12", cy: "10", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Unlink2 = [["path", { d: "M15 7h2a5 5 0 0 1 0 10h-2m-6 0H7A5 5 0 0 1 7 7h2" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Unlink = [
  [
    "path",
    {
      d: "m18.84 12.25 1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"
    }
  ],
  [
    "path",
    { d: "m5.17 11.75-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71" }
  ],
  ["line", { x1: "8", x2: "8", y1: "2", y2: "5" }],
  ["line", { x1: "2", x2: "5", y1: "8", y2: "8" }],
  ["line", { x1: "16", x2: "16", y1: "19", y2: "22" }],
  ["line", { x1: "19", x2: "22", y1: "16", y2: "16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Unplug = [
  ["path", { d: "m19 5 3-3" }],
  ["path", { d: "m2 22 3-3" }],
  ["path", { d: "M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z" }],
  ["path", { d: "M7.5 13.5 10 11" }],
  ["path", { d: "M10.5 16.5 13 14" }],
  ["path", { d: "m12 6 6 6 2.3-2.3a2.4 2.4 0 0 0 0-3.4l-2.6-2.6a2.4 2.4 0 0 0-3.4 0Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Upload = [
  ["path", { d: "M12 3v12" }],
  ["path", { d: "m17 8-5-5-5 5" }],
  ["path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Usb = [
  ["circle", { cx: "10", cy: "7", r: "1" }],
  ["circle", { cx: "4", cy: "20", r: "1" }],
  ["path", { d: "M4.7 19.3 19 5" }],
  ["path", { d: "m21 3-3 1 2 2Z" }],
  ["path", { d: "M9.26 7.68 5 12l2 5" }],
  ["path", { d: "m10 14 5 2 3.5-3.5" }],
  ["path", { d: "m18 12 1-1 1 1-1 1Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserCheck = [
  ["path", { d: "m16 11 2 2 4-4" }],
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: "9", cy: "7", r: "4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserLock = [
  ["circle", { cx: "10", cy: "7", r: "4" }],
  ["path", { d: "M10.3 15H7a4 4 0 0 0-4 4v2" }],
  ["path", { d: "M15 15.5V14a2 2 0 0 1 4 0v1.5" }],
  ["rect", { width: "8", height: "5", x: "13", y: "16", rx: ".899" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserCog = [
  ["path", { d: "M10 15H6a4 4 0 0 0-4 4v2" }],
  ["path", { d: "m14.305 16.53.923-.382" }],
  ["path", { d: "m15.228 13.852-.923-.383" }],
  ["path", { d: "m16.852 12.228-.383-.923" }],
  ["path", { d: "m16.852 17.772-.383.924" }],
  ["path", { d: "m19.148 12.228.383-.923" }],
  ["path", { d: "m19.53 18.696-.382-.924" }],
  ["path", { d: "m20.772 13.852.924-.383" }],
  ["path", { d: "m20.772 16.148.924.383" }],
  ["circle", { cx: "18", cy: "15", r: "3" }],
  ["circle", { cx: "9", cy: "7", r: "4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserMinus = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: "9", cy: "7", r: "4" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserPen = [
  ["path", { d: "M11.5 15H7a4 4 0 0 0-4 4v2" }],
  [
    "path",
    {
      d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ],
  ["circle", { cx: "10", cy: "7", r: "4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserPlus = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: "9", cy: "7", r: "4" }],
  ["line", { x1: "19", x2: "19", y1: "8", y2: "14" }],
  ["line", { x1: "22", x2: "16", y1: "11", y2: "11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserRoundCheck = [
  ["path", { d: "M2 21a8 8 0 0 1 13.292-6" }],
  ["circle", { cx: "10", cy: "8", r: "5" }],
  ["path", { d: "m16 19 2 2 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserRoundCog = [
  ["path", { d: "m14.305 19.53.923-.382" }],
  ["path", { d: "m15.228 16.852-.923-.383" }],
  ["path", { d: "m16.852 15.228-.383-.923" }],
  ["path", { d: "m16.852 20.772-.383.924" }],
  ["path", { d: "m19.148 15.228.383-.923" }],
  ["path", { d: "m19.53 21.696-.382-.924" }],
  ["path", { d: "M2 21a8 8 0 0 1 10.434-7.62" }],
  ["path", { d: "m20.772 16.852.924-.383" }],
  ["path", { d: "m20.772 19.148.924.383" }],
  ["circle", { cx: "10", cy: "8", r: "5" }],
  ["circle", { cx: "18", cy: "18", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserRoundMinus = [
  ["path", { d: "M2 21a8 8 0 0 1 13.292-6" }],
  ["circle", { cx: "10", cy: "8", r: "5" }],
  ["path", { d: "M22 19h-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserRoundPen = [
  ["path", { d: "M2 21a8 8 0 0 1 10.821-7.487" }],
  [
    "path",
    {
      d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ],
  ["circle", { cx: "10", cy: "8", r: "5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserRoundPlus = [
  ["path", { d: "M2 21a8 8 0 0 1 13.292-6" }],
  ["circle", { cx: "10", cy: "8", r: "5" }],
  ["path", { d: "M19 16v6" }],
  ["path", { d: "M22 19h-6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserRoundSearch = [
  ["circle", { cx: "10", cy: "8", r: "5" }],
  ["path", { d: "M2 21a8 8 0 0 1 10.434-7.62" }],
  ["circle", { cx: "18", cy: "18", r: "3" }],
  ["path", { d: "m22 22-1.9-1.9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserRoundX = [
  ["path", { d: "M2 21a8 8 0 0 1 11.873-7" }],
  ["circle", { cx: "10", cy: "8", r: "5" }],
  ["path", { d: "m17 17 5 5" }],
  ["path", { d: "m22 17-5 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserRound = [
  ["circle", { cx: "12", cy: "8", r: "5" }],
  ["path", { d: "M20 21a8 8 0 0 0-16 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserSearch = [
  ["circle", { cx: "10", cy: "7", r: "4" }],
  ["path", { d: "M10.3 15H7a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: "17", cy: "17", r: "3" }],
  ["path", { d: "m21 21-1.9-1.9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UserX = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: "9", cy: "7", r: "4" }],
  ["line", { x1: "17", x2: "22", y1: "8", y2: "13" }],
  ["line", { x1: "22", x2: "17", y1: "8", y2: "13" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const User = [
  ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }],
  ["circle", { cx: "12", cy: "7", r: "4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UsersRound = [
  ["path", { d: "M18 21a8 8 0 0 0-16 0" }],
  ["circle", { cx: "10", cy: "8", r: "5" }],
  ["path", { d: "M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Users = [
  ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }],
  ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744" }],
  ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87" }],
  ["circle", { cx: "9", cy: "7", r: "4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UtensilsCrossed = [
  ["path", { d: "m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8" }],
  ["path", { d: "M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7" }],
  ["path", { d: "m2.1 21.8 6.4-6.3" }],
  ["path", { d: "m19 5-7 7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Utensils = [
  ["path", { d: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" }],
  ["path", { d: "M7 2v20" }],
  ["path", { d: "M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const UtilityPole = [
  ["path", { d: "M12 2v20" }],
  ["path", { d: "M2 5h20" }],
  ["path", { d: "M3 3v2" }],
  ["path", { d: "M7 3v2" }],
  ["path", { d: "M17 3v2" }],
  ["path", { d: "M21 3v2" }],
  ["path", { d: "m19 5-7 7-7-7" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vault = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["circle", { cx: "7.5", cy: "7.5", r: ".5", fill: "currentColor" }],
  ["path", { d: "m7.9 7.9 2.7 2.7" }],
  ["circle", { cx: "16.5", cy: "7.5", r: ".5", fill: "currentColor" }],
  ["path", { d: "m13.4 10.6 2.7-2.7" }],
  ["circle", { cx: "7.5", cy: "16.5", r: ".5", fill: "currentColor" }],
  ["path", { d: "m7.9 16.1 2.7-2.7" }],
  ["circle", { cx: "16.5", cy: "16.5", r: ".5", fill: "currentColor" }],
  ["path", { d: "m13.4 13.4 2.7 2.7" }],
  ["circle", { cx: "12", cy: "12", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Variable = [
  ["path", { d: "M8 21s-4-3-4-9 4-9 4-9" }],
  ["path", { d: "M16 3s4 3 4 9-4 9-4 9" }],
  ["line", { x1: "15", x2: "9", y1: "9", y2: "15" }],
  ["line", { x1: "9", x2: "15", y1: "9", y2: "15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const VectorSquare = [
  ["path", { d: "M19.5 7a24 24 0 0 1 0 10" }],
  ["path", { d: "M4.5 7a24 24 0 0 0 0 10" }],
  ["path", { d: "M7 19.5a24 24 0 0 0 10 0" }],
  ["path", { d: "M7 4.5a24 24 0 0 1 10 0" }],
  ["rect", { x: "17", y: "17", width: "5", height: "5", rx: "1" }],
  ["rect", { x: "17", y: "2", width: "5", height: "5", rx: "1" }],
  ["rect", { x: "2", y: "17", width: "5", height: "5", rx: "1" }],
  ["rect", { x: "2", y: "2", width: "5", height: "5", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vegan = [
  ["path", { d: "M16 8q6 0 6-6-6 0-6 6" }],
  ["path", { d: "M17.41 3.59a10 10 0 1 0 3 3" }],
  ["path", { d: "M2 2a26.6 26.6 0 0 1 10 20c.9-6.82 1.5-9.5 4-14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const VenetianMask = [
  ["path", { d: "M18 11c-1.5 0-2.5.5-3 2" }],
  [
    "path",
    {
      d: "M4 6a2 2 0 0 0-2 2v4a5 5 0 0 0 5 5 8 8 0 0 1 5 2 8 8 0 0 1 5-2 5 5 0 0 0 5-5V8a2 2 0 0 0-2-2h-3a8 8 0 0 0-5 2 8 8 0 0 0-5-2z"
    }
  ],
  ["path", { d: "M6 11c1.5 0 2.5.5 3 2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const VenusAndMars = [
  ["path", { d: "M10 20h4" }],
  ["path", { d: "M12 16v6" }],
  ["path", { d: "M17 2h4v4" }],
  ["path", { d: "m21 2-5.46 5.46" }],
  ["circle", { cx: "12", cy: "11", r: "5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Venus = [
  ["path", { d: "M12 15v7" }],
  ["path", { d: "M9 19h6" }],
  ["circle", { cx: "12", cy: "9", r: "6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const VibrateOff = [
  ["path", { d: "m2 8 2 2-2 2 2 2-2 2" }],
  ["path", { d: "m22 8-2 2 2 2-2 2 2 2" }],
  ["path", { d: "M8 8v10c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2" }],
  ["path", { d: "M16 10.34V6c0-.55-.45-1-1-1h-4.34" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vibrate = [
  ["path", { d: "m2 8 2 2-2 2 2 2-2 2" }],
  ["path", { d: "m22 8-2 2 2 2-2 2 2 2" }],
  ["rect", { width: "8", height: "14", x: "8", y: "5", rx: "1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const VideoOff = [
  ["path", { d: "M10.66 6H14a2 2 0 0 1 2 2v2.5l5.248-3.062A.5.5 0 0 1 22 7.87v8.196" }],
  ["path", { d: "M16 16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Video = [
  ["path", { d: "m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" }],
  ["rect", { x: "2", y: "6", width: "14", height: "12", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Videotape = [
  ["rect", { width: "20", height: "16", x: "2", y: "4", rx: "2" }],
  ["path", { d: "M2 8h20" }],
  ["circle", { cx: "8", cy: "14", r: "2" }],
  ["path", { d: "M8 12h8" }],
  ["circle", { cx: "16", cy: "14", r: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const View = [
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2" }],
  ["path", { d: "M21 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" }],
  ["circle", { cx: "12", cy: "12", r: "1" }],
  [
    "path",
    {
      d: "M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Voicemail = [
  ["circle", { cx: "6", cy: "12", r: "4" }],
  ["circle", { cx: "18", cy: "12", r: "4" }],
  ["line", { x1: "6", x2: "18", y1: "16", y2: "16" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Volleyball = [
  ["path", { d: "M11.1 7.1a16.55 16.55 0 0 1 10.9 4" }],
  ["path", { d: "M12 12a12.6 12.6 0 0 1-8.7 5" }],
  ["path", { d: "M16.8 13.6a16.55 16.55 0 0 1-9 7.5" }],
  ["path", { d: "M20.7 17a12.8 12.8 0 0 0-8.7-5 13.3 13.3 0 0 1 0-10" }],
  ["path", { d: "M6.3 3.8a16.55 16.55 0 0 0 1.9 11.5" }],
  ["circle", { cx: "12", cy: "12", r: "10" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Volume1 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Volume2 = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
    }
  ],
  ["path", { d: "M16 9a5 5 0 0 1 0 6" }],
  ["path", { d: "M19.364 18.364a9 9 0 0 0 0-12.728" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const VolumeOff = [
  ["path", { d: "M16 9a5 5 0 0 1 .95 2.293" }],
  ["path", { d: "M19.364 5.636a9 9 0 0 1 1.889 9.96" }],
  ["path", { d: "m2 2 20 20" }],
  [
    "path",
    {
      d: "m7 7-.587.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298V11"
    }
  ],
  ["path", { d: "M9.828 4.172A.686.686 0 0 1 11 4.657v.686" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const VolumeX = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
    }
  ],
  ["line", { x1: "22", x2: "16", y1: "9", y2: "15" }],
  ["line", { x1: "16", x2: "22", y1: "9", y2: "15" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Volume = [
  [
    "path",
    {
      d: "M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Vote = [
  ["path", { d: "m9 12 2 2 4-4" }],
  ["path", { d: "M5 7c0-1.1.9-2 2-2h10a2 2 0 0 1 2 2v12H5V7Z" }],
  ["path", { d: "M22 19H2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WalletCards = [
  ["rect", { width: "18", height: "18", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" }],
  [
    "path",
    { d: "M3 11h3c.8 0 1.6.3 2.1.9l1.1.9c1.6 1.6 4.1 1.6 5.7 0l1.1-.9c.5-.5 1.3-.9 2.1-.9H21" }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WalletMinimal = [
  ["path", { d: "M17 14h.01" }],
  ["path", { d: "M7 7h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wallet = [
  [
    "path",
    {
      d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"
    }
  ],
  ["path", { d: "M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wallpaper = [
  ["circle", { cx: "8", cy: "9", r: "2" }],
  [
    "path",
    {
      d: "m9 17 6.1-6.1a2 2 0 0 1 2.81.01L22 15V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2"
    }
  ],
  ["path", { d: "M8 21h8" }],
  ["path", { d: "M12 17v4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WandSparkles = [
  [
    "path",
    {
      d: "m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72"
    }
  ],
  ["path", { d: "m14 7 3 3" }],
  ["path", { d: "M5 6v4" }],
  ["path", { d: "M19 14v4" }],
  ["path", { d: "M10 2v2" }],
  ["path", { d: "M7 8H3" }],
  ["path", { d: "M21 16h-4" }],
  ["path", { d: "M11 3H9" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wand = [
  ["path", { d: "M15 4V2" }],
  ["path", { d: "M15 16v-2" }],
  ["path", { d: "M8 9h2" }],
  ["path", { d: "M20 9h2" }],
  ["path", { d: "M17.8 11.8 19 13" }],
  ["path", { d: "M15 9h.01" }],
  ["path", { d: "M17.8 6.2 19 5" }],
  ["path", { d: "m3 21 9-9" }],
  ["path", { d: "M12.2 6.2 11 5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Warehouse = [
  ["path", { d: "M18 21V10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v11" }],
  [
    "path",
    {
      d: "M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 1.132-1.803l7.95-3.974a2 2 0 0 1 1.837 0l7.948 3.974A2 2 0 0 1 22 8z"
    }
  ],
  ["path", { d: "M6 13h12" }],
  ["path", { d: "M6 17h12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WashingMachine = [
  ["path", { d: "M3 6h3" }],
  ["path", { d: "M17 6h.01" }],
  ["rect", { width: "18", height: "20", x: "3", y: "2", rx: "2" }],
  ["circle", { cx: "12", cy: "13", r: "5" }],
  ["path", { d: "M12 18a2.5 2.5 0 0 0 0-5 2.5 2.5 0 0 1 0-5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Watch = [
  ["path", { d: "M12 10v2.2l1.6 1" }],
  ["path", { d: "m16.13 7.66-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05" }],
  ["path", { d: "m7.88 16.36.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05" }],
  ["circle", { cx: "12", cy: "12", r: "6" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WavesLadder = [
  ["path", { d: "M19 5a2 2 0 0 0-2 2v11" }],
  [
    "path",
    {
      d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
    }
  ],
  ["path", { d: "M7 13h10" }],
  ["path", { d: "M7 9h10" }],
  ["path", { d: "M9 5a2 2 0 0 0-2 2v11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Waves = [
  [
    "path",
    { d: "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" }
  ],
  [
    "path",
    {
      d: "M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
    }
  ],
  [
    "path",
    {
      d: "M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Waypoints = [
  ["circle", { cx: "12", cy: "4.5", r: "2.5" }],
  ["path", { d: "m10.2 6.3-3.9 3.9" }],
  ["circle", { cx: "4.5", cy: "12", r: "2.5" }],
  ["path", { d: "M7 12h10" }],
  ["circle", { cx: "19.5", cy: "12", r: "2.5" }],
  ["path", { d: "m13.8 17.7 3.9-3.9" }],
  ["circle", { cx: "12", cy: "19.5", r: "2.5" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Webcam = [
  ["circle", { cx: "12", cy: "10", r: "8" }],
  ["circle", { cx: "12", cy: "10", r: "3" }],
  ["path", { d: "M7 22h10" }],
  ["path", { d: "M12 22v-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WebhookOff = [
  ["path", { d: "M17 17h-5c-1.09-.02-1.94.92-2.5 1.9A3 3 0 1 1 2.57 15" }],
  ["path", { d: "M9 3.4a4 4 0 0 1 6.52.66" }],
  ["path", { d: "m6 17 3.1-5.8a2.5 2.5 0 0 0 .057-2.05" }],
  ["path", { d: "M20.3 20.3a4 4 0 0 1-2.3.7" }],
  ["path", { d: "M18.6 13a4 4 0 0 1 3.357 3.414" }],
  ["path", { d: "m12 6 .6 1" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Webhook = [
  ["path", { d: "M18 16.98h-5.99c-1.1 0-1.95.94-2.48 1.9A4 4 0 0 1 2 17c.01-.7.2-1.4.57-2" }],
  ["path", { d: "m6 17 3.13-5.78c.53-.97.1-2.18-.5-3.1a4 4 0 1 1 6.89-4.06" }],
  ["path", { d: "m12 6 3.13 5.73C15.66 12.7 16.9 13 18 13a4 4 0 0 1 0 8" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Weight = [
  ["circle", { cx: "12", cy: "5", r: "3" }],
  [
    "path",
    {
      d: "M6.5 8a2 2 0 0 0-1.905 1.46L2.1 18.5A2 2 0 0 0 4 21h16a2 2 0 0 0 1.925-2.54L19.4 9.5A2 2 0 0 0 17.48 8Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WheatOff = [
  ["path", { d: "m2 22 10-10" }],
  ["path", { d: "m16 8-1.17 1.17" }],
  [
    "path",
    { d: "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" }
  ],
  ["path", { d: "m8 8-.53.53a3.5 3.5 0 0 0 0 4.94L9 15l1.53-1.53c.55-.55.88-1.25.98-1.97" }],
  ["path", { d: "M10.91 5.26c.15-.26.34-.51.56-.73L13 3l1.53 1.53a3.5 3.5 0 0 1 .28 4.62" }],
  ["path", { d: "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" }],
  [
    "path",
    {
      d: "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"
    }
  ],
  ["path", { d: "m16 16-.53.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.49 3.49 0 0 1 1.97-.98" }],
  ["path", { d: "M18.74 13.09c.26-.15.51-.34.73-.56L21 11l-1.53-1.53a3.5 3.5 0 0 0-4.62-.28" }],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wheat = [
  ["path", { d: "M2 22 16 8" }],
  [
    "path",
    { d: "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" }
  ],
  [
    "path",
    { d: "M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" }
  ],
  [
    "path",
    { d: "M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z" }
  ],
  ["path", { d: "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z" }],
  [
    "path",
    {
      d: "M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"
    }
  ],
  [
    "path",
    {
      d: "M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"
    }
  ],
  [
    "path",
    {
      d: "M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WholeWord = [
  ["circle", { cx: "7", cy: "12", r: "3" }],
  ["path", { d: "M10 9v6" }],
  ["circle", { cx: "17", cy: "12", r: "3" }],
  ["path", { d: "M14 7v8" }],
  ["path", { d: "M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WifiCog = [
  ["path", { d: "m14.305 19.53.923-.382" }],
  ["path", { d: "m15.228 16.852-.923-.383" }],
  ["path", { d: "m16.852 15.228-.383-.923" }],
  ["path", { d: "m16.852 20.772-.383.924" }],
  ["path", { d: "m19.148 15.228.383-.923" }],
  ["path", { d: "m19.53 21.696-.382-.924" }],
  ["path", { d: "M2 7.82a15 15 0 0 1 20 0" }],
  ["path", { d: "m20.772 16.852.924-.383" }],
  ["path", { d: "m20.772 19.148.924.383" }],
  ["path", { d: "M5 11.858a10 10 0 0 1 11.5-1.785" }],
  ["path", { d: "M8.5 15.429a5 5 0 0 1 2.413-1.31" }],
  ["circle", { cx: "18", cy: "18", r: "3" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WifiHigh = [
  ["path", { d: "M12 20h.01" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WifiLow = [
  ["path", { d: "M12 20h.01" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WifiOff = [
  ["path", { d: "M12 20h.01" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 5.17-2.69" }],
  ["path", { d: "M19 12.859a10 10 0 0 0-2.007-1.523" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 4.177-2.643" }],
  ["path", { d: "M22 8.82a15 15 0 0 0-11.288-3.764" }],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WifiPen = [
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0" }],
  [
    "path",
    {
      d: "M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"
    }
  ],
  ["path", { d: "M5 12.859a10 10 0 0 1 10.5-2.222" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 3-1.406" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WifiZero = [["path", { d: "M12 20h.01" }]];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wifi = [
  ["path", { d: "M12 20h.01" }],
  ["path", { d: "M2 8.82a15 15 0 0 1 20 0" }],
  ["path", { d: "M5 12.859a10 10 0 0 1 14 0" }],
  ["path", { d: "M8.5 16.429a5 5 0 0 1 7 0" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WindArrowDown = [
  ["path", { d: "M10 2v8" }],
  ["path", { d: "M12.8 21.6A2 2 0 1 0 14 18H2" }],
  ["path", { d: "M17.5 10a2.5 2.5 0 1 1 2 4H2" }],
  ["path", { d: "m6 6 4 4 4-4" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wind = [
  ["path", { d: "M12.8 19.6A2 2 0 1 0 14 16H2" }],
  ["path", { d: "M17.5 8a2.5 2.5 0 1 1 2 4H2" }],
  ["path", { d: "M9.8 4.4A2 2 0 1 1 11 8H2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WineOff = [
  ["path", { d: "M8 22h8" }],
  ["path", { d: "M7 10h3m7 0h-1.343" }],
  ["path", { d: "M12 15v7" }],
  [
    "path",
    {
      d: "M7.307 7.307A12.33 12.33 0 0 0 7 10a5 5 0 0 0 7.391 4.391M8.638 2.981C8.75 2.668 8.872 2.34 9 2h6c1.5 4 2 6 2 8 0 .407-.05.809-.145 1.198"
    }
  ],
  ["line", { x1: "2", x2: "22", y1: "2", y2: "22" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wine = [
  ["path", { d: "M8 22h8" }],
  ["path", { d: "M7 10h10" }],
  ["path", { d: "M12 15v7" }],
  ["path", { d: "M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Workflow = [
  ["rect", { width: "8", height: "8", x: "3", y: "3", rx: "2" }],
  ["path", { d: "M7 11v4a2 2 0 0 0 2 2h4" }],
  ["rect", { width: "8", height: "8", x: "13", y: "13", rx: "2" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Worm = [
  ["path", { d: "m19 12-1.5 3" }],
  ["path", { d: "M19.63 18.81 22 20" }],
  [
    "path",
    {
      d: "M6.47 8.23a1.68 1.68 0 0 1 2.44 1.93l-.64 2.08a6.76 6.76 0 0 0 10.16 7.67l.42-.27a1 1 0 1 0-2.73-4.21l-.42.27a1.76 1.76 0 0 1-2.63-1.99l.64-2.08A6.66 6.66 0 0 0 3.94 3.9l-.7.4a1 1 0 1 0 2.55 4.34z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const WrapText = [
  ["path", { d: "m16 16-2 2 2 2" }],
  ["path", { d: "M3 12h15a3 3 0 1 1 0 6h-4" }],
  ["path", { d: "M3 18h7" }],
  ["path", { d: "M3 6h18" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Wrench = [
  [
    "path",
    {
      d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const X = [
  ["path", { d: "M18 6 6 18" }],
  ["path", { d: "m6 6 12 12" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Youtube = [
  [
    "path",
    {
      d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"
    }
  ],
  ["path", { d: "m10 15 5-3-5-3z" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const Zap = [
  [
    "path",
    {
      d: "M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
    }
  ]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ZapOff = [
  ["path", { d: "M10.513 4.856 13.12 2.17a.5.5 0 0 1 .86.46l-1.377 4.317" }],
  ["path", { d: "M15.656 10H20a1 1 0 0 1 .78 1.63l-1.72 1.773" }],
  [
    "path",
    {
      d: "M16.273 16.273 10.88 21.83a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14H4a1 1 0 0 1-.78-1.63l4.507-4.643"
    }
  ],
  ["path", { d: "m2 2 20 20" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ZoomIn = [
  ["circle", { cx: "11", cy: "11", r: "8" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65" }],
  ["line", { x1: "11", x2: "11", y1: "8", y2: "14" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const ZoomOut = [
  ["circle", { cx: "11", cy: "11", r: "8" }],
  ["line", { x1: "21", x2: "16.65", y1: "21", y2: "16.65" }],
  ["line", { x1: "8", x2: "14", y1: "11", y2: "11" }]
];
/**
 * @license lucide v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const icons = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AArrowDown,
  AArrowUp,
  ALargeSmall,
  Accessibility,
  Activity,
  ActivitySquare: SquareActivity,
  AirVent,
  Airplay,
  AlarmCheck: AlarmClockCheck,
  AlarmClock,
  AlarmClockCheck,
  AlarmClockMinus,
  AlarmClockOff,
  AlarmClockPlus,
  AlarmMinus: AlarmClockMinus,
  AlarmPlus: AlarmClockPlus,
  AlarmSmoke,
  Album,
  AlertCircle: CircleAlert,
  AlertOctagon: OctagonAlert,
  AlertTriangle: TriangleAlert,
  AlignCenter,
  AlignCenterHorizontal,
  AlignCenterVertical,
  AlignEndHorizontal,
  AlignEndVertical,
  AlignHorizontalDistributeCenter,
  AlignHorizontalDistributeEnd,
  AlignHorizontalDistributeStart,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignHorizontalSpaceAround,
  AlignHorizontalSpaceBetween,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AlignStartHorizontal,
  AlignStartVertical,
  AlignVerticalDistributeCenter,
  AlignVerticalDistributeEnd,
  AlignVerticalDistributeStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  AlignVerticalSpaceAround,
  AlignVerticalSpaceBetween,
  Ambulance,
  Ampersand,
  Ampersands,
  Amphora,
  Anchor,
  Angry,
  Annoyed,
  Antenna,
  Anvil,
  Aperture,
  AppWindow,
  AppWindowMac,
  Apple,
  Archive,
  ArchiveRestore,
  ArchiveX,
  AreaChart: ChartArea,
  Armchair,
  ArrowBigDown,
  ArrowBigDownDash,
  ArrowBigLeft,
  ArrowBigLeftDash,
  ArrowBigRight,
  ArrowBigRightDash,
  ArrowBigUp,
  ArrowBigUpDash,
  ArrowDown,
  ArrowDown01,
  ArrowDown10,
  ArrowDownAZ,
  ArrowDownAz: ArrowDownAZ,
  ArrowDownCircle: CircleArrowDown,
  ArrowDownFromLine,
  ArrowDownLeft,
  ArrowDownLeftFromCircle: CircleArrowOutDownLeft,
  ArrowDownLeftFromSquare: SquareArrowOutDownLeft,
  ArrowDownLeftSquare: SquareArrowDownLeft,
  ArrowDownNarrowWide,
  ArrowDownRight,
  ArrowDownRightFromCircle: CircleArrowOutDownRight,
  ArrowDownRightFromSquare: SquareArrowOutDownRight,
  ArrowDownRightSquare: SquareArrowDownRight,
  ArrowDownSquare: SquareArrowDown,
  ArrowDownToDot,
  ArrowDownToLine,
  ArrowDownUp,
  ArrowDownWideNarrow,
  ArrowDownZA,
  ArrowDownZa: ArrowDownZA,
  ArrowLeft,
  ArrowLeftCircle: CircleArrowLeft,
  ArrowLeftFromLine,
  ArrowLeftRight,
  ArrowLeftSquare: SquareArrowLeft,
  ArrowLeftToLine,
  ArrowRight,
  ArrowRightCircle: CircleArrowRight,
  ArrowRightFromLine,
  ArrowRightLeft,
  ArrowRightSquare: SquareArrowRight,
  ArrowRightToLine,
  ArrowUp,
  ArrowUp01,
  ArrowUp10,
  ArrowUpAZ,
  ArrowUpAz: ArrowUpAZ,
  ArrowUpCircle: CircleArrowUp,
  ArrowUpDown,
  ArrowUpFromDot,
  ArrowUpFromLine,
  ArrowUpLeft,
  ArrowUpLeftFromCircle: CircleArrowOutUpLeft,
  ArrowUpLeftFromSquare: SquareArrowOutUpLeft,
  ArrowUpLeftSquare: SquareArrowUpLeft,
  ArrowUpNarrowWide,
  ArrowUpRight,
  ArrowUpRightFromCircle: CircleArrowOutUpRight,
  ArrowUpRightFromSquare: SquareArrowOutUpRight,
  ArrowUpRightSquare: SquareArrowUpRight,
  ArrowUpSquare: SquareArrowUp,
  ArrowUpToLine,
  ArrowUpWideNarrow,
  ArrowUpZA,
  ArrowUpZa: ArrowUpZA,
  ArrowsUpFromLine,
  Asterisk,
  AsteriskSquare: SquareAsterisk,
  AtSign,
  Atom,
  AudioLines,
  AudioWaveform,
  Award,
  Axe,
  Axis3D: Axis3d,
  Axis3d,
  Baby,
  Backpack,
  Badge,
  BadgeAlert,
  BadgeCent,
  BadgeCheck,
  BadgeDollarSign,
  BadgeEuro,
  BadgeHelp: BadgeQuestionMark,
  BadgeIndianRupee,
  BadgeInfo,
  BadgeJapaneseYen,
  BadgeMinus,
  BadgePercent,
  BadgePlus,
  BadgePoundSterling,
  BadgeQuestionMark,
  BadgeRussianRuble,
  BadgeSwissFranc,
  BadgeX,
  BaggageClaim,
  Ban,
  Banana,
  Bandage,
  Banknote,
  BanknoteArrowDown,
  BanknoteArrowUp,
  BanknoteX,
  BarChart: ChartNoAxesColumnIncreasing,
  BarChart2: ChartNoAxesColumn,
  BarChart3: ChartColumn,
  BarChart4: ChartColumnIncreasing,
  BarChartBig: ChartColumnBig,
  BarChartHorizontal: ChartBar,
  BarChartHorizontalBig: ChartBarBig,
  Barcode,
  Barrel,
  Baseline,
  Bath,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryPlus,
  BatteryWarning,
  Beaker,
  Bean,
  BeanOff,
  Bed,
  BedDouble,
  BedSingle,
  Beef,
  Beer,
  BeerOff,
  Bell,
  BellDot,
  BellElectric,
  BellMinus,
  BellOff,
  BellPlus,
  BellRing,
  BetweenHorizonalEnd: BetweenHorizontalEnd,
  BetweenHorizonalStart: BetweenHorizontalStart,
  BetweenHorizontalEnd,
  BetweenHorizontalStart,
  BetweenVerticalEnd,
  BetweenVerticalStart,
  BicepsFlexed,
  Bike,
  Binary,
  Binoculars,
  Biohazard,
  Bird,
  Bitcoin,
  Blend,
  Blinds,
  Blocks,
  Bluetooth,
  BluetoothConnected,
  BluetoothOff,
  BluetoothSearching,
  Bold,
  Bolt,
  Bomb,
  Bone,
  Book,
  BookA,
  BookAlert,
  BookAudio,
  BookCheck,
  BookCopy,
  BookDashed,
  BookDown,
  BookHeadphones,
  BookHeart,
  BookImage,
  BookKey,
  BookLock,
  BookMarked,
  BookMinus,
  BookOpen,
  BookOpenCheck,
  BookOpenText,
  BookPlus,
  BookTemplate: BookDashed,
  BookText,
  BookType,
  BookUp,
  BookUp2,
  BookUser,
  BookX,
  Bookmark,
  BookmarkCheck,
  BookmarkMinus,
  BookmarkPlus,
  BookmarkX,
  BoomBox,
  Bot,
  BotMessageSquare,
  BotOff,
  BottleWine,
  BowArrow,
  Box,
  BoxSelect: SquareDashed,
  Boxes,
  Braces,
  Brackets,
  Brain,
  BrainCircuit,
  BrainCog,
  BrickWall,
  BrickWallFire,
  Briefcase,
  BriefcaseBusiness,
  BriefcaseConveyorBelt,
  BriefcaseMedical,
  BringToFront,
  Brush,
  BrushCleaning,
  Bubbles,
  Bug,
  BugOff,
  BugPlay,
  Building,
  Building2,
  Bus,
  BusFront,
  Cable,
  CableCar,
  Cake,
  CakeSlice,
  Calculator,
  Calendar,
  Calendar1,
  CalendarArrowDown,
  CalendarArrowUp,
  CalendarCheck,
  CalendarCheck2,
  CalendarClock,
  CalendarCog,
  CalendarDays,
  CalendarFold,
  CalendarHeart,
  CalendarMinus,
  CalendarMinus2,
  CalendarOff,
  CalendarPlus,
  CalendarPlus2,
  CalendarRange,
  CalendarSearch,
  CalendarSync,
  CalendarX,
  CalendarX2,
  Camera,
  CameraOff,
  CandlestickChart: ChartCandlestick,
  Candy,
  CandyCane,
  CandyOff,
  Cannabis,
  Captions,
  CaptionsOff,
  Car,
  CarFront,
  CarTaxiFront,
  Caravan,
  CardSim,
  Carrot,
  CaseLower,
  CaseSensitive,
  CaseUpper,
  CassetteTape,
  Cast,
  Castle,
  Cat,
  Cctv,
  ChartArea,
  ChartBar,
  ChartBarBig,
  ChartBarDecreasing,
  ChartBarIncreasing,
  ChartBarStacked,
  ChartCandlestick,
  ChartColumn,
  ChartColumnBig,
  ChartColumnDecreasing,
  ChartColumnIncreasing,
  ChartColumnStacked,
  ChartGantt,
  ChartLine,
  ChartNetwork,
  ChartNoAxesColumn,
  ChartNoAxesColumnDecreasing,
  ChartNoAxesColumnIncreasing,
  ChartNoAxesCombined,
  ChartNoAxesGantt,
  ChartPie,
  ChartScatter,
  ChartSpline,
  Check,
  CheckCheck,
  CheckCircle: CircleCheckBig,
  CheckCircle2: CircleCheck,
  CheckLine,
  CheckSquare: SquareCheckBig,
  CheckSquare2: SquareCheck,
  ChefHat,
  Cherry,
  ChevronDown,
  ChevronDownCircle: CircleChevronDown,
  ChevronDownSquare: SquareChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronLeftCircle: CircleChevronLeft,
  ChevronLeftSquare: SquareChevronLeft,
  ChevronRight,
  ChevronRightCircle: CircleChevronRight,
  ChevronRightSquare: SquareChevronRight,
  ChevronUp,
  ChevronUpCircle: CircleChevronUp,
  ChevronUpSquare: SquareChevronUp,
  ChevronsDown,
  ChevronsDownUp,
  ChevronsLeft,
  ChevronsLeftRight,
  ChevronsLeftRightEllipsis,
  ChevronsRight,
  ChevronsRightLeft,
  ChevronsUp,
  ChevronsUpDown,
  Chrome,
  Church,
  Cigarette,
  CigaretteOff,
  Circle,
  CircleAlert,
  CircleArrowDown,
  CircleArrowLeft,
  CircleArrowOutDownLeft,
  CircleArrowOutDownRight,
  CircleArrowOutUpLeft,
  CircleArrowOutUpRight,
  CircleArrowRight,
  CircleArrowUp,
  CircleCheck,
  CircleCheckBig,
  CircleChevronDown,
  CircleChevronLeft,
  CircleChevronRight,
  CircleChevronUp,
  CircleDashed,
  CircleDivide,
  CircleDollarSign,
  CircleDot,
  CircleDotDashed,
  CircleEllipsis,
  CircleEqual,
  CircleFadingArrowUp,
  CircleFadingPlus,
  CircleGauge,
  CircleHelp: CircleQuestionMark,
  CircleMinus,
  CircleOff,
  CircleParking,
  CircleParkingOff,
  CirclePause,
  CirclePercent,
  CirclePlay,
  CirclePlus,
  CirclePoundSterling,
  CirclePower,
  CircleQuestionMark,
  CircleSlash,
  CircleSlash2,
  CircleSlashed: CircleSlash2,
  CircleSmall,
  CircleStop,
  CircleUser,
  CircleUserRound,
  CircleX,
  CircuitBoard,
  Citrus,
  Clapperboard,
  Clipboard,
  ClipboardCheck,
  ClipboardCopy,
  ClipboardEdit: ClipboardPen,
  ClipboardList,
  ClipboardMinus,
  ClipboardPaste,
  ClipboardPen,
  ClipboardPenLine,
  ClipboardPlus,
  ClipboardSignature: ClipboardPenLine,
  ClipboardType,
  ClipboardX,
  Clock,
  Clock1,
  Clock10,
  Clock11,
  Clock12,
  Clock2,
  Clock3,
  Clock4,
  Clock5,
  Clock6,
  Clock7,
  Clock8,
  Clock9,
  ClockAlert,
  ClockArrowDown,
  ClockArrowUp,
  ClockFading,
  ClockPlus,
  Cloud,
  CloudAlert,
  CloudCheck,
  CloudCog,
  CloudDownload,
  CloudDrizzle,
  CloudFog,
  CloudHail,
  CloudLightning,
  CloudMoon,
  CloudMoonRain,
  CloudOff,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudSun,
  CloudSunRain,
  CloudUpload,
  Cloudy,
  Clover,
  Club,
  Code,
  Code2: CodeXml,
  CodeSquare: SquareCode,
  CodeXml,
  Codepen,
  Codesandbox,
  Coffee,
  Cog,
  Coins,
  Columns: Columns2,
  Columns2,
  Columns3,
  Columns3Cog,
  Columns4,
  ColumnsSettings: Columns3Cog,
  Combine,
  Command,
  Compass,
  Component,
  Computer,
  ConciergeBell,
  Cone,
  Construction,
  Contact,
  Contact2: ContactRound,
  ContactRound,
  Container,
  Contrast,
  Cookie,
  CookingPot,
  Copy,
  CopyCheck,
  CopyMinus,
  CopyPlus,
  CopySlash,
  CopyX,
  Copyleft,
  Copyright,
  CornerDownLeft,
  CornerDownRight,
  CornerLeftDown,
  CornerLeftUp,
  CornerRightDown,
  CornerRightUp,
  CornerUpLeft,
  CornerUpRight,
  Cpu,
  CreativeCommons,
  CreditCard,
  Croissant,
  Crop,
  Cross,
  Crosshair,
  Crown,
  Cuboid,
  CupSoda,
  CurlyBraces: Braces,
  Currency,
  Cylinder,
  Dam,
  Database,
  DatabaseBackup,
  DatabaseZap,
  DecimalsArrowLeft,
  DecimalsArrowRight,
  Delete,
  Dessert,
  Diameter,
  Diamond,
  DiamondMinus,
  DiamondPercent,
  DiamondPlus,
  Dice1,
  Dice2,
  Dice3,
  Dice4,
  Dice5,
  Dice6,
  Dices,
  Diff,
  Disc,
  Disc2,
  Disc3,
  DiscAlbum,
  Divide,
  DivideCircle: CircleDivide,
  DivideSquare: SquareDivide,
  Dna,
  DnaOff,
  Dock,
  Dog,
  DollarSign,
  Donut,
  DoorClosed,
  DoorClosedLocked,
  DoorOpen,
  Dot,
  DotSquare: SquareDot,
  Download,
  DownloadCloud: CloudDownload,
  DraftingCompass,
  Drama,
  Dribbble,
  Drill,
  Drone,
  Droplet,
  DropletOff,
  Droplets,
  Drum,
  Drumstick,
  Dumbbell,
  Ear,
  EarOff,
  Earth,
  EarthLock,
  Eclipse,
  Edit: SquarePen,
  Edit2: Pen,
  Edit3: PenLine,
  Egg,
  EggFried,
  EggOff,
  Ellipsis,
  EllipsisVertical,
  Equal,
  EqualApproximately,
  EqualNot,
  EqualSquare: SquareEqual,
  Eraser,
  EthernetPort,
  Euro,
  Expand,
  ExternalLink,
  Eye,
  EyeClosed,
  EyeOff,
  Facebook,
  Factory,
  Fan,
  FastForward,
  Feather,
  Fence,
  FerrisWheel,
  Figma,
  File,
  FileArchive,
  FileAudio,
  FileAudio2,
  FileAxis3D: FileAxis3d,
  FileAxis3d,
  FileBadge,
  FileBadge2,
  FileBarChart: FileChartColumnIncreasing,
  FileBarChart2: FileChartColumn,
  FileBox,
  FileChartColumn,
  FileChartColumnIncreasing,
  FileChartLine,
  FileChartPie,
  FileCheck,
  FileCheck2,
  FileClock,
  FileCode,
  FileCode2,
  FileCog,
  FileCog2: FileCog,
  FileDiff,
  FileDigit,
  FileDown,
  FileEdit: FilePen,
  FileHeart,
  FileImage,
  FileInput,
  FileJson,
  FileJson2,
  FileKey,
  FileKey2,
  FileLineChart: FileChartLine,
  FileLock,
  FileLock2,
  FileMinus,
  FileMinus2,
  FileMusic,
  FileOutput,
  FilePen,
  FilePenLine,
  FilePieChart: FileChartPie,
  FilePlus,
  FilePlus2,
  FileQuestion: FileQuestionMark,
  FileQuestionMark,
  FileScan,
  FileSearch,
  FileSearch2,
  FileSignature: FilePenLine,
  FileSliders,
  FileSpreadsheet,
  FileStack,
  FileSymlink,
  FileTerminal,
  FileText,
  FileType,
  FileType2,
  FileUp,
  FileUser,
  FileVideo,
  FileVideo2,
  FileVolume,
  FileVolume2,
  FileWarning,
  FileX,
  FileX2,
  Files,
  Film,
  Filter: Funnel,
  FilterX: FunnelX,
  Fingerprint,
  FireExtinguisher,
  Fish,
  FishOff,
  FishSymbol,
  Flag,
  FlagOff,
  FlagTriangleLeft,
  FlagTriangleRight,
  Flame,
  FlameKindling,
  Flashlight,
  FlashlightOff,
  FlaskConical,
  FlaskConicalOff,
  FlaskRound,
  FlipHorizontal,
  FlipHorizontal2,
  FlipVertical,
  FlipVertical2,
  Flower,
  Flower2,
  Focus,
  FoldHorizontal,
  FoldVertical,
  Folder,
  FolderArchive,
  FolderCheck,
  FolderClock,
  FolderClosed,
  FolderCode,
  FolderCog,
  FolderCog2: FolderCog,
  FolderDot,
  FolderDown,
  FolderEdit: FolderPen,
  FolderGit,
  FolderGit2,
  FolderHeart,
  FolderInput,
  FolderKanban,
  FolderKey,
  FolderLock,
  FolderMinus,
  FolderOpen,
  FolderOpenDot,
  FolderOutput,
  FolderPen,
  FolderPlus,
  FolderRoot,
  FolderSearch,
  FolderSearch2,
  FolderSymlink,
  FolderSync,
  FolderTree,
  FolderUp,
  FolderX,
  Folders,
  Footprints,
  ForkKnife: Utensils,
  ForkKnifeCrossed: UtensilsCrossed,
  Forklift,
  FormInput: RectangleEllipsis,
  Forward,
  Frame,
  Framer,
  Frown,
  Fuel,
  Fullscreen,
  FunctionSquare: SquareFunction,
  Funnel,
  FunnelPlus,
  FunnelX,
  GalleryHorizontal,
  GalleryHorizontalEnd,
  GalleryThumbnails,
  GalleryVertical,
  GalleryVerticalEnd,
  Gamepad,
  Gamepad2,
  GanttChart: ChartNoAxesGantt,
  GanttChartSquare: SquareChartGantt,
  Gauge,
  GaugeCircle: CircleGauge,
  Gavel,
  Gem,
  GeorgianLari,
  Ghost,
  Gift,
  GitBranch,
  GitBranchPlus,
  GitCommit: GitCommitHorizontal,
  GitCommitHorizontal,
  GitCommitVertical,
  GitCompare,
  GitCompareArrows,
  GitFork,
  GitGraph,
  GitMerge,
  GitPullRequest,
  GitPullRequestArrow,
  GitPullRequestClosed,
  GitPullRequestCreate,
  GitPullRequestCreateArrow,
  GitPullRequestDraft,
  Github,
  Gitlab,
  GlassWater,
  Glasses,
  Globe,
  Globe2: Earth,
  GlobeLock,
  Goal,
  Gpu,
  Grab,
  GraduationCap,
  Grape,
  Grid: Grid3x3,
  Grid2X2: Grid2x2,
  Grid2X2Check: Grid2x2Check,
  Grid2X2Plus: Grid2x2Plus,
  Grid2X2X: Grid2x2X,
  Grid2x2,
  Grid2x2Check,
  Grid2x2Plus,
  Grid2x2X,
  Grid3X3: Grid3x3,
  Grid3x2,
  Grid3x3,
  Grip,
  GripHorizontal,
  GripVertical,
  Group,
  Guitar,
  Ham,
  Hamburger,
  Hammer,
  Hand,
  HandCoins,
  HandHeart,
  HandHelping,
  HandMetal,
  HandPlatter,
  Handshake,
  HardDrive,
  HardDriveDownload,
  HardDriveUpload,
  HardHat,
  Hash,
  Haze,
  HdmiPort,
  Heading,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  HeadphoneOff,
  Headphones,
  Headset,
  Heart,
  HeartCrack,
  HeartHandshake,
  HeartMinus,
  HeartOff,
  HeartPlus,
  HeartPulse,
  Heater,
  HelpCircle: CircleQuestionMark,
  HelpingHand: HandHelping,
  Hexagon,
  Highlighter,
  History,
  Home: House,
  Hop,
  HopOff,
  Hospital,
  Hotel,
  Hourglass,
  House,
  HousePlug,
  HousePlus,
  HouseWifi,
  IceCream: IceCreamCone,
  IceCream2: IceCreamBowl,
  IceCreamBowl,
  IceCreamCone,
  IdCard,
  IdCardLanyard,
  Image,
  ImageDown,
  ImageMinus,
  ImageOff,
  ImagePlay,
  ImagePlus,
  ImageUp,
  ImageUpscale,
  Images,
  Import,
  Inbox,
  Indent: IndentIncrease,
  IndentDecrease,
  IndentIncrease,
  IndianRupee,
  Infinity: Infinity$1,
  Info,
  Inspect: SquareMousePointer,
  InspectionPanel,
  Instagram,
  Italic,
  IterationCcw,
  IterationCw,
  JapaneseYen,
  Joystick,
  Kanban,
  KanbanSquare: SquareKanban,
  KanbanSquareDashed: SquareDashedKanban,
  Key,
  KeyRound,
  KeySquare,
  Keyboard,
  KeyboardMusic,
  KeyboardOff,
  Lamp,
  LampCeiling,
  LampDesk,
  LampFloor,
  LampWallDown,
  LampWallUp,
  LandPlot,
  Landmark,
  Languages,
  Laptop,
  Laptop2: LaptopMinimal,
  LaptopMinimal,
  LaptopMinimalCheck,
  Lasso,
  LassoSelect,
  Laugh,
  Layers,
  Layers2,
  Layers3: Layers,
  Layout: PanelsTopLeft,
  LayoutDashboard,
  LayoutGrid,
  LayoutList,
  LayoutPanelLeft,
  LayoutPanelTop,
  LayoutTemplate,
  Leaf,
  LeafyGreen,
  Lectern,
  LetterText,
  Library,
  LibraryBig,
  LibrarySquare: SquareLibrary,
  LifeBuoy,
  Ligature,
  Lightbulb,
  LightbulbOff,
  LineChart: ChartLine,
  LineSquiggle,
  Link,
  Link2,
  Link2Off,
  Linkedin,
  List,
  ListCheck,
  ListChecks,
  ListCollapse,
  ListEnd,
  ListFilter,
  ListFilterPlus,
  ListMinus,
  ListMusic,
  ListOrdered,
  ListPlus,
  ListRestart,
  ListStart,
  ListTodo,
  ListTree,
  ListVideo,
  ListX,
  Loader,
  Loader2: LoaderCircle,
  LoaderCircle,
  LoaderPinwheel,
  Locate,
  LocateFixed,
  LocateOff,
  LocationEdit,
  Lock,
  LockKeyhole,
  LockKeyholeOpen,
  LockOpen,
  LogIn,
  LogOut,
  Logs,
  Lollipop,
  Luggage,
  MSquare: SquareM,
  Magnet,
  Mail,
  MailCheck,
  MailMinus,
  MailOpen,
  MailPlus,
  MailQuestion: MailQuestionMark,
  MailQuestionMark,
  MailSearch,
  MailWarning,
  MailX,
  Mailbox,
  Mails,
  Map: Map$1,
  MapPin,
  MapPinCheck,
  MapPinCheckInside,
  MapPinHouse,
  MapPinMinus,
  MapPinMinusInside,
  MapPinOff,
  MapPinPlus,
  MapPinPlusInside,
  MapPinX,
  MapPinXInside,
  MapPinned,
  MapPlus,
  Mars,
  MarsStroke,
  Martini,
  Maximize,
  Maximize2,
  Medal,
  Megaphone,
  MegaphoneOff,
  Meh,
  MemoryStick,
  Menu,
  MenuSquare: SquareMenu,
  Merge,
  MessageCircle,
  MessageCircleCode,
  MessageCircleDashed,
  MessageCircleHeart,
  MessageCircleMore,
  MessageCircleOff,
  MessageCirclePlus,
  MessageCircleQuestion: MessageCircleQuestionMark,
  MessageCircleQuestionMark,
  MessageCircleReply,
  MessageCircleWarning,
  MessageCircleX,
  MessageSquare,
  MessageSquareCode,
  MessageSquareDashed,
  MessageSquareDiff,
  MessageSquareDot,
  MessageSquareHeart,
  MessageSquareLock,
  MessageSquareMore,
  MessageSquareOff,
  MessageSquarePlus,
  MessageSquareQuote,
  MessageSquareReply,
  MessageSquareShare,
  MessageSquareText,
  MessageSquareWarning,
  MessageSquareX,
  MessagesSquare,
  Mic,
  Mic2: MicVocal,
  MicOff,
  MicVocal,
  Microchip,
  Microscope,
  Microwave,
  Milestone,
  Milk,
  MilkOff,
  Minimize,
  Minimize2,
  Minus,
  MinusCircle: CircleMinus,
  MinusSquare: SquareMinus,
  Monitor,
  MonitorCheck,
  MonitorCog,
  MonitorDot,
  MonitorDown,
  MonitorOff,
  MonitorPause,
  MonitorPlay,
  MonitorSmartphone,
  MonitorSpeaker,
  MonitorStop,
  MonitorUp,
  MonitorX,
  Moon,
  MoonStar,
  MoreHorizontal: Ellipsis,
  MoreVertical: EllipsisVertical,
  Mountain,
  MountainSnow,
  Mouse,
  MouseOff,
  MousePointer,
  MousePointer2,
  MousePointerBan,
  MousePointerClick,
  MousePointerSquareDashed: SquareDashedMousePointer,
  Move,
  Move3D: Move3d,
  Move3d,
  MoveDiagonal,
  MoveDiagonal2,
  MoveDown,
  MoveDownLeft,
  MoveDownRight,
  MoveHorizontal,
  MoveLeft,
  MoveRight,
  MoveUp,
  MoveUpLeft,
  MoveUpRight,
  MoveVertical,
  Music,
  Music2,
  Music3,
  Music4,
  Navigation,
  Navigation2,
  Navigation2Off,
  NavigationOff,
  Network,
  Newspaper,
  Nfc,
  NonBinary,
  Notebook,
  NotebookPen,
  NotebookTabs,
  NotebookText,
  NotepadText,
  NotepadTextDashed,
  Nut,
  NutOff,
  Octagon,
  OctagonAlert,
  OctagonMinus,
  OctagonPause,
  OctagonX,
  Omega,
  Option,
  Orbit,
  Origami,
  Outdent: IndentDecrease,
  Package,
  Package2,
  PackageCheck,
  PackageMinus,
  PackageOpen,
  PackagePlus,
  PackageSearch,
  PackageX,
  PaintBucket,
  PaintRoller,
  Paintbrush,
  Paintbrush2: PaintbrushVertical,
  PaintbrushVertical,
  Palette,
  Palmtree: TreePalm,
  Panda,
  PanelBottom,
  PanelBottomClose,
  PanelBottomDashed,
  PanelBottomInactive: PanelBottomDashed,
  PanelBottomOpen,
  PanelLeft,
  PanelLeftClose,
  PanelLeftDashed,
  PanelLeftInactive: PanelLeftDashed,
  PanelLeftOpen,
  PanelRight,
  PanelRightClose,
  PanelRightDashed,
  PanelRightInactive: PanelRightDashed,
  PanelRightOpen,
  PanelTop,
  PanelTopClose,
  PanelTopDashed,
  PanelTopInactive: PanelTopDashed,
  PanelTopOpen,
  PanelsLeftBottom,
  PanelsLeftRight: Columns3,
  PanelsRightBottom,
  PanelsTopBottom: Rows3,
  PanelsTopLeft,
  Paperclip,
  Parentheses,
  ParkingCircle: CircleParking,
  ParkingCircleOff: CircleParkingOff,
  ParkingMeter,
  ParkingSquare: SquareParking,
  ParkingSquareOff: SquareParkingOff,
  PartyPopper,
  Pause,
  PauseCircle: CirclePause,
  PauseOctagon: OctagonPause,
  PawPrint,
  PcCase,
  Pen,
  PenBox: SquarePen,
  PenLine,
  PenOff,
  PenSquare: SquarePen,
  PenTool,
  Pencil,
  PencilLine,
  PencilOff,
  PencilRuler,
  Pentagon,
  Percent,
  PercentCircle: CirclePercent,
  PercentDiamond: DiamondPercent,
  PercentSquare: SquarePercent,
  PersonStanding,
  PhilippinePeso,
  Phone,
  PhoneCall,
  PhoneForwarded,
  PhoneIncoming,
  PhoneMissed,
  PhoneOff,
  PhoneOutgoing,
  Pi,
  PiSquare: SquarePi,
  Piano,
  Pickaxe,
  PictureInPicture,
  PictureInPicture2,
  PieChart: ChartPie,
  PiggyBank,
  Pilcrow,
  PilcrowLeft,
  PilcrowRight,
  PilcrowSquare: SquarePilcrow,
  Pill,
  PillBottle,
  Pin,
  PinOff,
  Pipette,
  Pizza,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  Play,
  PlayCircle: CirclePlay,
  PlaySquare: SquarePlay,
  Plug,
  Plug2,
  PlugZap,
  PlugZap2: PlugZap,
  Plus,
  PlusCircle: CirclePlus,
  PlusSquare: SquarePlus,
  Pocket,
  PocketKnife,
  Podcast,
  Pointer,
  PointerOff,
  Popcorn,
  Popsicle,
  PoundSterling,
  Power,
  PowerCircle: CirclePower,
  PowerOff,
  PowerSquare: SquarePower,
  Presentation,
  Printer,
  PrinterCheck,
  Projector,
  Proportions,
  Puzzle,
  Pyramid,
  QrCode,
  Quote,
  Rabbit,
  Radar,
  Radiation,
  Radical,
  Radio,
  RadioReceiver,
  RadioTower,
  Radius,
  RailSymbol,
  Rainbow,
  Rat,
  Ratio,
  Receipt,
  ReceiptCent,
  ReceiptEuro,
  ReceiptIndianRupee,
  ReceiptJapaneseYen,
  ReceiptPoundSterling,
  ReceiptRussianRuble,
  ReceiptSwissFranc,
  ReceiptText,
  RectangleCircle,
  RectangleEllipsis,
  RectangleGoggles,
  RectangleHorizontal,
  RectangleVertical,
  Recycle,
  Redo,
  Redo2,
  RedoDot,
  RefreshCcw,
  RefreshCcwDot,
  RefreshCw,
  RefreshCwOff,
  Refrigerator,
  Regex,
  RemoveFormatting,
  Repeat,
  Repeat1,
  Repeat2,
  Replace,
  ReplaceAll,
  Reply,
  ReplyAll,
  Rewind,
  Ribbon,
  Rocket,
  RockingChair,
  RollerCoaster,
  Rotate3D: Rotate3d,
  Rotate3d,
  RotateCcw,
  RotateCcwKey,
  RotateCcwSquare,
  RotateCw,
  RotateCwSquare,
  Route,
  RouteOff,
  Router,
  Rows: Rows2,
  Rows2,
  Rows3,
  Rows4,
  Rss,
  Ruler,
  RulerDimensionLine,
  RussianRuble,
  Sailboat,
  Salad,
  Sandwich,
  Satellite,
  SatelliteDish,
  SaudiRiyal,
  Save,
  SaveAll,
  SaveOff,
  Scale,
  Scale3D: Scale3d,
  Scale3d,
  Scaling,
  Scan,
  ScanBarcode,
  ScanEye,
  ScanFace,
  ScanHeart,
  ScanLine,
  ScanQrCode,
  ScanSearch,
  ScanText,
  ScatterChart: ChartScatter,
  School,
  School2: University,
  Scissors,
  ScissorsLineDashed,
  ScissorsSquare: SquareScissors,
  ScissorsSquareDashedBottom: SquareBottomDashedScissors,
  ScreenShare,
  ScreenShareOff,
  Scroll,
  ScrollText,
  Search,
  SearchCheck,
  SearchCode,
  SearchSlash,
  SearchX,
  Section,
  Send,
  SendHorizonal: SendHorizontal,
  SendHorizontal,
  SendToBack,
  SeparatorHorizontal,
  SeparatorVertical,
  Server,
  ServerCog,
  ServerCrash,
  ServerOff,
  Settings,
  Settings2,
  Shapes,
  Share,
  Share2,
  Sheet,
  Shell,
  Shield,
  ShieldAlert,
  ShieldBan,
  ShieldCheck,
  ShieldClose: ShieldX,
  ShieldEllipsis,
  ShieldHalf,
  ShieldMinus,
  ShieldOff,
  ShieldPlus,
  ShieldQuestion: ShieldQuestionMark,
  ShieldQuestionMark,
  ShieldUser,
  ShieldX,
  Ship,
  ShipWheel,
  Shirt,
  ShoppingBag,
  ShoppingBasket,
  ShoppingCart,
  Shovel,
  ShowerHead,
  Shredder,
  Shrimp,
  Shrink,
  Shrub,
  Shuffle,
  Sidebar: PanelLeft,
  SidebarClose: PanelLeftClose,
  SidebarOpen: PanelLeftOpen,
  Sigma,
  SigmaSquare: SquareSigma,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  Signature,
  Signpost,
  SignpostBig,
  Siren,
  SkipBack,
  SkipForward,
  Skull,
  Slack,
  Slash,
  SlashSquare: SquareSlash,
  Slice,
  Sliders: SlidersVertical,
  SlidersHorizontal,
  SlidersVertical,
  Smartphone,
  SmartphoneCharging,
  SmartphoneNfc,
  Smile,
  SmilePlus,
  Snail,
  Snowflake,
  SoapDispenserDroplet,
  Sofa,
  SortAsc: ArrowUpNarrowWide,
  SortDesc: ArrowDownWideNarrow,
  Soup,
  Space,
  Spade,
  Sparkle,
  Sparkles,
  Speaker,
  Speech,
  SpellCheck,
  SpellCheck2,
  Spline,
  SplinePointer,
  Split,
  SplitSquareHorizontal: SquareSplitHorizontal,
  SplitSquareVertical: SquareSplitVertical,
  Spool,
  SprayCan,
  Sprout,
  Square,
  SquareActivity,
  SquareArrowDown,
  SquareArrowDownLeft,
  SquareArrowDownRight,
  SquareArrowLeft,
  SquareArrowOutDownLeft,
  SquareArrowOutDownRight,
  SquareArrowOutUpLeft,
  SquareArrowOutUpRight,
  SquareArrowRight,
  SquareArrowUp,
  SquareArrowUpLeft,
  SquareArrowUpRight,
  SquareAsterisk,
  SquareBottomDashedScissors,
  SquareChartGantt,
  SquareCheck,
  SquareCheckBig,
  SquareChevronDown,
  SquareChevronLeft,
  SquareChevronRight,
  SquareChevronUp,
  SquareCode,
  SquareDashed,
  SquareDashedBottom,
  SquareDashedBottomCode,
  SquareDashedKanban,
  SquareDashedMousePointer,
  SquareDashedTopSolid,
  SquareDivide,
  SquareDot,
  SquareEqual,
  SquareFunction,
  SquareGanttChart: SquareChartGantt,
  SquareKanban,
  SquareLibrary,
  SquareM,
  SquareMenu,
  SquareMinus,
  SquareMousePointer,
  SquareParking,
  SquareParkingOff,
  SquarePen,
  SquarePercent,
  SquarePi,
  SquarePilcrow,
  SquarePlay,
  SquarePlus,
  SquarePower,
  SquareRadical,
  SquareRoundCorner,
  SquareScissors,
  SquareSigma,
  SquareSlash,
  SquareSplitHorizontal,
  SquareSplitVertical,
  SquareSquare,
  SquareStack,
  SquareTerminal,
  SquareUser,
  SquareUserRound,
  SquareX,
  SquaresExclude,
  SquaresIntersect,
  SquaresSubtract,
  SquaresUnite,
  Squircle,
  SquircleDashed,
  Squirrel,
  Stamp,
  Star,
  StarHalf,
  StarOff,
  Stars: Sparkles,
  StepBack,
  StepForward,
  Stethoscope,
  Sticker,
  StickyNote,
  StopCircle: CircleStop,
  Store,
  StretchHorizontal,
  StretchVertical,
  Strikethrough,
  Subscript,
  Subtitles: Captions,
  Sun,
  SunDim,
  SunMedium,
  SunMoon,
  SunSnow,
  Sunrise,
  Sunset,
  Superscript,
  SwatchBook,
  SwissFranc,
  SwitchCamera,
  Sword,
  Swords,
  Syringe,
  Table,
  Table2,
  TableCellsMerge,
  TableCellsSplit,
  TableColumnsSplit,
  TableConfig: Columns3Cog,
  TableOfContents,
  TableProperties,
  TableRowsSplit,
  Tablet,
  TabletSmartphone,
  Tablets,
  Tag,
  Tags,
  Tally1,
  Tally2,
  Tally3,
  Tally4,
  Tally5,
  Tangent,
  Target,
  Telescope,
  Tent,
  TentTree,
  Terminal,
  TerminalSquare: SquareTerminal,
  TestTube,
  TestTube2: TestTubeDiagonal,
  TestTubeDiagonal,
  TestTubes,
  Text,
  TextCursor,
  TextCursorInput,
  TextQuote,
  TextSearch,
  TextSelect,
  TextSelection: TextSelect,
  Theater,
  Thermometer,
  ThermometerSnowflake,
  ThermometerSun,
  ThumbsDown,
  ThumbsUp,
  Ticket,
  TicketCheck,
  TicketMinus,
  TicketPercent,
  TicketPlus,
  TicketSlash,
  TicketX,
  Tickets,
  TicketsPlane,
  Timer,
  TimerOff,
  TimerReset,
  ToggleLeft,
  ToggleRight,
  Toilet,
  ToolCase,
  Tornado,
  Torus,
  Touchpad,
  TouchpadOff,
  TowerControl,
  ToyBrick,
  Tractor,
  TrafficCone,
  Train: TramFront,
  TrainFront,
  TrainFrontTunnel,
  TrainTrack,
  TramFront,
  Transgender,
  Trash,
  Trash2,
  TreeDeciduous,
  TreePalm,
  TreePine,
  Trees,
  Trello,
  TrendingDown,
  TrendingUp,
  TrendingUpDown,
  Triangle,
  TriangleAlert,
  TriangleDashed,
  TriangleRight,
  Trophy,
  Truck,
  TruckElectric,
  Turtle,
  Tv,
  Tv2: TvMinimal,
  TvMinimal,
  TvMinimalPlay,
  Twitch,
  Twitter,
  Type,
  TypeOutline,
  Umbrella,
  UmbrellaOff,
  Underline,
  Undo,
  Undo2,
  UndoDot,
  UnfoldHorizontal,
  UnfoldVertical,
  Ungroup,
  University,
  Unlink,
  Unlink2,
  Unlock: LockOpen,
  UnlockKeyhole: LockKeyholeOpen,
  Unplug,
  Upload,
  UploadCloud: CloudUpload,
  Usb,
  User,
  User2: UserRound,
  UserCheck,
  UserCheck2: UserRoundCheck,
  UserCircle: CircleUser,
  UserCircle2: CircleUserRound,
  UserCog,
  UserCog2: UserRoundCog,
  UserLock,
  UserMinus,
  UserMinus2: UserRoundMinus,
  UserPen,
  UserPlus,
  UserPlus2: UserRoundPlus,
  UserRound,
  UserRoundCheck,
  UserRoundCog,
  UserRoundMinus,
  UserRoundPen,
  UserRoundPlus,
  UserRoundSearch,
  UserRoundX,
  UserSearch,
  UserSquare: SquareUser,
  UserSquare2: SquareUserRound,
  UserX,
  UserX2: UserRoundX,
  Users,
  Users2: UsersRound,
  UsersRound,
  Utensils,
  UtensilsCrossed,
  UtilityPole,
  Variable,
  Vault,
  VectorSquare,
  Vegan,
  VenetianMask,
  Venus,
  VenusAndMars,
  Verified: BadgeCheck,
  Vibrate,
  VibrateOff,
  Video,
  VideoOff,
  Videotape,
  View,
  Voicemail,
  Volleyball,
  Volume,
  Volume1,
  Volume2,
  VolumeOff,
  VolumeX,
  Vote,
  Wallet,
  Wallet2: WalletMinimal,
  WalletCards,
  WalletMinimal,
  Wallpaper,
  Wand,
  Wand2: WandSparkles,
  WandSparkles,
  Warehouse,
  WashingMachine,
  Watch,
  Waves,
  WavesLadder,
  Waypoints,
  Webcam,
  Webhook,
  WebhookOff,
  Weight,
  Wheat,
  WheatOff,
  WholeWord,
  Wifi,
  WifiCog,
  WifiHigh,
  WifiLow,
  WifiOff,
  WifiPen,
  WifiZero,
  Wind,
  WindArrowDown,
  Wine,
  WineOff,
  Workflow,
  Worm,
  WrapText,
  Wrench,
  X,
  XCircle: CircleX,
  XOctagon: OctagonX,
  XSquare: SquareX,
  Youtube,
  Zap,
  ZapOff,
  ZoomIn,
  ZoomOut
}, Symbol.toStringTag, { value: "Module" }));
var generated_default = '/*! tailwindcss v4.1.18 | MIT License | https://tailwindcss.com */\n@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-divide-y-reverse:0;--tw-border-style:solid;--tw-leading:initial;--tw-font-weight:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-outline-style:solid}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-amber-50:oklch(98.7% .022 95.277);--color-amber-100:oklch(96.2% .059 95.617);--color-amber-200:oklch(92.4% .12 95.746);--color-amber-600:oklch(66.6% .179 58.318);--color-amber-700:oklch(55.5% .163 48.998);--color-amber-800:oklch(47.3% .137 46.201);--color-amber-900:oklch(41.4% .112 45.904);--color-green-100:oklch(96.2% .044 156.743);--color-green-700:oklch(52.7% .154 150.069);--color-green-800:oklch(44.8% .119 151.328);--color-emerald-50:oklch(97.9% .021 166.113);--color-emerald-200:oklch(90.5% .093 164.15);--color-emerald-500:oklch(69.6% .17 162.48);--color-emerald-700:oklch(50.8% .118 165.612);--color-sky-50:oklch(97.7% .013 236.62);--color-sky-200:oklch(90.1% .058 230.902);--color-sky-700:oklch(50% .134 242.749);--color-blue-50:oklch(97% .014 254.604);--color-blue-100:oklch(93.2% .032 255.585);--color-blue-200:oklch(88.2% .059 254.128);--color-blue-600:oklch(54.6% .245 262.881);--color-blue-700:oklch(48.8% .243 264.376);--color-blue-800:oklch(42.4% .199 265.638);--color-violet-50:oklch(96.9% .016 293.756);--color-violet-200:oklch(89.4% .057 293.283);--color-violet-700:oklch(49.1% .27 292.581);--color-purple-50:oklch(97.7% .014 308.299);--color-purple-200:oklch(90.2% .063 306.703);--color-purple-700:oklch(49.6% .265 301.924);--color-rose-50:oklch(96.9% .015 12.422);--color-rose-200:oklch(89.2% .058 10.001);--color-rose-500:oklch(64.5% .246 16.439);--color-rose-600:oklch(58.6% .253 17.585);--color-rose-700:oklch(51.4% .222 16.935);--color-rose-800:oklch(45.5% .188 13.697);--color-rose-900:oklch(41% .159 10.272);--color-slate-200:oklch(92.9% .013 255.508);--color-slate-800:oklch(27.9% .041 260.031);--color-slate-900:oklch(20.8% .042 265.755);--color-slate-950:oklch(12.9% .042 264.695);--color-gray-50:oklch(98.5% .002 247.839);--color-gray-100:oklch(96.7% .003 264.542);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-300:oklch(87.2% .01 258.338);--color-gray-400:oklch(70.7% .022 261.325);--color-gray-500:oklch(55.1% .027 264.364);--color-gray-600:oklch(44.6% .03 256.802);--color-gray-700:oklch(37.3% .034 259.733);--color-gray-800:oklch(27.8% .033 256.848);--color-gray-900:oklch(21% .034 264.665);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-xs:20rem;--container-md:28rem;--container-2xl:42rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--font-weight-medium:500;--font-weight-semibold:600;--leading-snug:1.375;--leading-relaxed:1.625;--radius-sm:.25rem;--radius-md:.375rem;--radius-lg:.5rem;--radius-xl:.75rem;--animate-pulse:pulse 2s cubic-bezier(.4,0,.6,1)infinite;--blur-sm:8px;--blur-md:12px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab, red, red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}:host{font-family:var(--font-sans);color:var(--color-slate-900);background-color:#0000;display:block}}@layer components;@layer utilities{.pointer-events-auto{pointer-events:auto}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.static{position:static}.sticky{position:sticky}.top-0{top:calc(var(--spacing)*0)}.right-0{right:calc(var(--spacing)*0)}.right-1{right:calc(var(--spacing)*1)}.bottom-1{bottom:calc(var(--spacing)*1)}.left-0{left:calc(var(--spacing)*0)}.z-10{z-index:10}.z-30{z-index:30}.z-40{z-index:40}.z-50{z-index:50}.m-0{margin:calc(var(--spacing)*0)}.mx-4{margin-inline:calc(var(--spacing)*4)}.my-1{margin-block:calc(var(--spacing)*1)}.my-3{margin-block:calc(var(--spacing)*3)}.mt-0\\.5{margin-top:calc(var(--spacing)*.5)}.mt-1{margin-top:calc(var(--spacing)*1)}.mt-1\\.5{margin-top:calc(var(--spacing)*1.5)}.mt-2{margin-top:calc(var(--spacing)*2)}.mb-1{margin-bottom:calc(var(--spacing)*1)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.mb-4{margin-bottom:calc(var(--spacing)*4)}.ml-auto{margin-left:auto}.box-border{box-sizing:border-box}.block{display:block}.flex{display:flex}.grid{display:grid}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.h-1\\.5{height:calc(var(--spacing)*1.5)}.h-3{height:calc(var(--spacing)*3)}.h-3\\.5{height:calc(var(--spacing)*3.5)}.h-5{height:calc(var(--spacing)*5)}.h-6{height:calc(var(--spacing)*6)}.h-7{height:calc(var(--spacing)*7)}.h-8{height:calc(var(--spacing)*8)}.h-10{height:calc(var(--spacing)*10)}.h-12{height:calc(var(--spacing)*12)}.h-40{height:calc(var(--spacing)*40)}.h-full{height:100%}.max-h-64{max-height:calc(var(--spacing)*64)}.max-h-96{max-height:calc(var(--spacing)*96)}.w-1\\.5{width:calc(var(--spacing)*1.5)}.w-3{width:calc(var(--spacing)*3)}.w-3\\.5{width:calc(var(--spacing)*3.5)}.w-5{width:calc(var(--spacing)*5)}.w-6{width:calc(var(--spacing)*6)}.w-7{width:calc(var(--spacing)*7)}.w-8{width:calc(var(--spacing)*8)}.w-10{width:calc(var(--spacing)*10)}.w-12{width:calc(var(--spacing)*12)}.w-40{width:calc(var(--spacing)*40)}.w-auto{width:auto}.w-full{width:100%}.max-w-2xl{max-width:var(--container-2xl)}.max-w-\\[240px\\]{max-width:240px}.max-w-md{max-width:var(--container-md)}.max-w-xs{max-width:var(--container-xs)}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-\\[160px\\]{min-width:160px}.min-w-\\[200px\\]{min-width:200px}.flex-1{flex:1}.shrink-0{flex-shrink:0}.table-fixed{table-layout:fixed}.border-collapse{border-collapse:collapse}.-translate-y-\\[2px\\]{--tw-translate-y:calc(2px*-1);translate:var(--tw-translate-x)var(--tw-translate-y)}.rotate-180{rotate:180deg}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.animate-pulse{animation:var(--animate-pulse)}.cursor-grab{cursor:grab}.cursor-grabbing{cursor:grabbing}.cursor-nwse-resize{cursor:nwse-resize}.cursor-pointer{cursor:pointer}.touch-none{touch-action:none}.resize{resize:both}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.items-center{align-items:center}.items-start{align-items:flex-start}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.gap-1{gap:calc(var(--spacing)*1)}.gap-1\\.5{gap:calc(var(--spacing)*1.5)}.gap-2{gap:calc(var(--spacing)*2)}.gap-3{gap:calc(var(--spacing)*3)}.gap-4{gap:calc(var(--spacing)*4)}:where(.space-y-1>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*1)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*1)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-2>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*2)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*2)*calc(1 - var(--tw-space-y-reverse)))}:where(.space-y-3>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*3)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*3)*calc(1 - var(--tw-space-y-reverse)))}:where(.divide-y>:not(:last-child)){--tw-divide-y-reverse:0;border-bottom-style:var(--tw-border-style);border-top-style:var(--tw-border-style);border-top-width:calc(1px*var(--tw-divide-y-reverse));border-bottom-width:calc(1px*calc(1 - var(--tw-divide-y-reverse)))}:where(.divide-gray-200>:not(:last-child)){border-color:var(--color-gray-200)}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-auto{overflow:auto}.overflow-hidden{overflow:hidden}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius-lg)}.rounded-md{border-radius:var(--radius-md)}.rounded-sm{border-radius:var(--radius-sm)}.rounded-xl{border-radius:var(--radius-xl)}.border{border-style:var(--tw-border-style);border-width:1px}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-r{border-right-style:var(--tw-border-style);border-right-width:1px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-amber-200{border-color:var(--color-amber-200)}.border-blue-200{border-color:var(--color-blue-200)}.border-emerald-200{border-color:var(--color-emerald-200)}.border-gray-100{border-color:var(--color-gray-100)}.border-gray-200{border-color:var(--color-gray-200)}.border-purple-200{border-color:var(--color-purple-200)}.border-rose-200{border-color:var(--color-rose-200)}.border-sky-200{border-color:var(--color-sky-200)}.border-slate-200{border-color:var(--color-slate-200)}.border-violet-200{border-color:var(--color-violet-200)}.border-white\\/20{border-color:#fff3}@supports (color:color-mix(in lab, red, red)){.border-white\\/20{border-color:color-mix(in oklab,var(--color-white)20%,transparent)}}.bg-amber-50{background-color:var(--color-amber-50)}.bg-amber-100{background-color:var(--color-amber-100)}.bg-blue-50{background-color:var(--color-blue-50)}.bg-blue-100{background-color:var(--color-blue-100)}.bg-emerald-50{background-color:var(--color-emerald-50)}.bg-emerald-500{background-color:var(--color-emerald-500)}.bg-gray-50{background-color:var(--color-gray-50)}.bg-gray-50\\/50{background-color:#f9fafb80}@supports (color:color-mix(in lab, red, red)){.bg-gray-50\\/50{background-color:color-mix(in oklab,var(--color-gray-50)50%,transparent)}}.bg-gray-100{background-color:var(--color-gray-100)}.bg-gray-400{background-color:var(--color-gray-400)}.bg-gray-900{background-color:var(--color-gray-900)}.bg-green-100{background-color:var(--color-green-100)}.bg-purple-50{background-color:var(--color-purple-50)}.bg-rose-50{background-color:var(--color-rose-50)}.bg-rose-500{background-color:var(--color-rose-500)}.bg-rose-600{background-color:var(--color-rose-600)}.bg-sky-50{background-color:var(--color-sky-50)}.bg-slate-900{background-color:var(--color-slate-900)}.bg-slate-950\\/95{background-color:#020618f2}@supports (color:color-mix(in lab, red, red)){.bg-slate-950\\/95{background-color:color-mix(in oklab,var(--color-slate-950)95%,transparent)}}.bg-violet-50{background-color:var(--color-violet-50)}.bg-white{background-color:var(--color-white)}.bg-white\\/60{background-color:#fff9}@supports (color:color-mix(in lab, red, red)){.bg-white\\/60{background-color:color-mix(in oklab,var(--color-white)60%,transparent)}}.bg-white\\/95{background-color:#fffffff2}@supports (color:color-mix(in lab, red, red)){.bg-white\\/95{background-color:color-mix(in oklab,var(--color-white)95%,transparent)}}.p-2{padding:calc(var(--spacing)*2)}.p-3{padding:calc(var(--spacing)*3)}.p-4{padding:calc(var(--spacing)*4)}.px-1{padding-inline:calc(var(--spacing)*1)}.px-1\\.5{padding-inline:calc(var(--spacing)*1.5)}.px-2{padding-inline:calc(var(--spacing)*2)}.px-3{padding-inline:calc(var(--spacing)*3)}.px-4{padding-inline:calc(var(--spacing)*4)}.py-0\\.5{padding-block:calc(var(--spacing)*.5)}.py-1{padding-block:calc(var(--spacing)*1)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-2{padding-block:calc(var(--spacing)*2)}.py-2\\.5{padding-block:calc(var(--spacing)*2.5)}.py-3{padding-block:calc(var(--spacing)*3)}.py-4{padding-block:calc(var(--spacing)*4)}.py-8{padding-block:calc(var(--spacing)*8)}.text-center{text-align:center}.text-left{text-align:left}.align-middle{vertical-align:middle}.align-top{vertical-align:top}.font-mono{font-family:var(--font-mono)}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.text-\\[9px\\]{font-size:9px}.text-\\[10px\\]{font-size:10px}.text-\\[11px\\]{font-size:11px}.leading-relaxed{--tw-leading:var(--leading-relaxed);line-height:var(--leading-relaxed)}.leading-snug{--tw-leading:var(--leading-snug);line-height:var(--leading-snug)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.break-words{overflow-wrap:break-word}.whitespace-nowrap{white-space:nowrap}.whitespace-pre-wrap{white-space:pre-wrap}.text-amber-600{color:var(--color-amber-600)}.text-amber-700{color:var(--color-amber-700)}.text-amber-800{color:var(--color-amber-800)}.text-amber-900{color:var(--color-amber-900)}.text-blue-600{color:var(--color-blue-600)}.text-blue-700{color:var(--color-blue-700)}.text-blue-800{color:var(--color-blue-800)}.text-emerald-700{color:var(--color-emerald-700)}.text-gray-300{color:var(--color-gray-300)}.text-gray-400{color:var(--color-gray-400)}.text-gray-500{color:var(--color-gray-500)}.text-gray-600{color:var(--color-gray-600)}.text-gray-700{color:var(--color-gray-700)}.text-gray-800{color:var(--color-gray-800)}.text-gray-900{color:var(--color-gray-900)}.text-green-700{color:var(--color-green-700)}.text-green-800{color:var(--color-green-800)}.text-purple-700{color:var(--color-purple-700)}.text-rose-700{color:var(--color-rose-700)}.text-rose-800{color:var(--color-rose-800)}.text-rose-900{color:var(--color-rose-900)}.text-sky-700{color:var(--color-sky-700)}.text-slate-800{color:var(--color-slate-800)}.text-slate-900{color:var(--color-slate-900)}.text-violet-700{color:var(--color-violet-700)}.text-white{color:var(--color-white)}.italic{font-style:italic}.opacity-0{opacity:0}.opacity-80{opacity:.8}.shadow-\\[0_12px_30px_rgba\\(15\\,23\\,42\\,0\\.12\\)\\]{--tw-shadow:0 12px 30px var(--tw-shadow-color,#0f172a1f);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a),0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-1{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(1px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-black\\/5{--tw-ring-color:#0000000d}@supports (color:color-mix(in lab, red, red)){.ring-black\\/5{--tw-ring-color:color-mix(in oklab,var(--color-black)5%,transparent)}}.ring-transparent{--tw-ring-color:transparent}.ring-white\\/10{--tw-ring-color:#ffffff1a}@supports (color:color-mix(in lab, red, red)){.ring-white\\/10{--tw-ring-color:color-mix(in oklab,var(--color-white)10%,transparent)}}.backdrop-blur-md{--tw-backdrop-blur:blur(var(--blur-md));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.backdrop-blur-sm{--tw-backdrop-blur:blur(var(--blur-sm));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}@media (hover:hover){.group-hover\\:opacity-100:is(:where(.group):hover *){opacity:1}.hover\\:scale-105:hover{--tw-scale-x:105%;--tw-scale-y:105%;--tw-scale-z:105%;scale:var(--tw-scale-x)var(--tw-scale-y)}.hover\\:border-gray-300:hover{border-color:var(--color-gray-300)}.hover\\:border-white\\/30:hover{border-color:#ffffff4d}@supports (color:color-mix(in lab, red, red)){.hover\\:border-white\\/30:hover{border-color:color-mix(in oklab,var(--color-white)30%,transparent)}}.hover\\:bg-blue-50\\/50:hover{background-color:#eff6ff80}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-blue-50\\/50:hover{background-color:color-mix(in oklab,var(--color-blue-50)50%,transparent)}}.hover\\:bg-gray-50:hover{background-color:var(--color-gray-50)}.hover\\:bg-gray-100:hover{background-color:var(--color-gray-100)}.hover\\:bg-gray-200:hover{background-color:var(--color-gray-200)}.hover\\:bg-gray-800:hover{background-color:var(--color-gray-800)}.hover\\:bg-slate-900\\/95:hover{background-color:#0f172bf2}@supports (color:color-mix(in lab, red, red)){.hover\\:bg-slate-900\\/95:hover{background-color:color-mix(in oklab,var(--color-slate-900)95%,transparent)}}.hover\\:text-gray-600:hover{color:var(--color-gray-600)}.hover\\:text-gray-900:hover{color:var(--color-gray-900)}}.focus\\:border-gray-300:focus{border-color:var(--color-gray-300)}.focus\\:bg-gray-50:focus{background-color:var(--color-gray-50)}.focus\\:ring-2:focus{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(2px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-gray-200:focus{--tw-ring-color:var(--color-gray-200)}.focus\\:outline-none:focus{--tw-outline-style:none;outline-style:none}.focus-visible\\:outline:focus-visible{outline-style:var(--tw-outline-style);outline-width:1px}.focus-visible\\:outline-2:focus-visible{outline-style:var(--tw-outline-style);outline-width:2px}.focus-visible\\:outline-offset-2:focus-visible{outline-offset:2px}.focus-visible\\:outline-gray-300:focus-visible{outline-color:var(--color-gray-300)}.focus-visible\\:outline-gray-400:focus-visible{outline-color:var(--color-gray-400)}.focus-visible\\:outline-rose-500:focus-visible{outline-color:var(--color-rose-500)}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}@media (min-width:48rem){.md\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}}.\\[\\&\\>svg\\]\\:\\!h-8>svg{height:calc(var(--spacing)*8)!important}.\\[\\&\\>svg\\]\\:\\!w-8>svg{width:calc(var(--spacing)*8)!important}.sr-only{clip:rect(0,0,0,0);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-divide-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@keyframes pulse{50%{opacity:.5}}';
var inspector_logo_default = 'data:image/svg+xml,<svg width="136" height="26" viewBox="0 0 136 26" fill="none" xmlns="http://www.w3.org/2000/svg">%0A<path d="M15.5253 11.0828H11.2602C11.2299 10.7299 11.1492 10.4097 11.0181 10.1224C10.8921 9.83503 10.7157 9.588 10.4888 9.38129C10.267 9.16958 9.99725 9.00818 9.67964 8.89733C9.36202 8.78136 9.00155 8.72338 8.59823 8.72338C7.89242 8.72338 7.29501 8.89477 6.80598 9.23756C6.322 9.58045 5.95397 10.072 5.70189 10.7122C5.45486 11.3524 5.33134 12.1213 5.33134 13.0187C5.33134 13.9665 5.45738 14.7606 5.70946 15.4008C5.96657 16.0361 6.33712 16.515 6.82111 16.8376C7.30509 17.1553 7.88739 17.314 8.56798 17.314C8.95618 17.314 9.30404 17.2662 9.61158 17.1704C9.91911 17.0695 10.1863 16.9259 10.4132 16.7393C10.64 16.5528 10.8241 16.3284 10.9653 16.0663C11.1114 15.7991 11.2097 15.4991 11.2602 15.1664L15.5253 15.1967C15.4748 15.852 15.2908 16.52 14.9732 17.2006C14.6556 17.8762 14.2044 18.5013 13.6195 19.076C13.0398 19.6457 12.3214 20.1046 11.4643 20.4524C10.6073 20.8003 9.61158 20.9742 8.47724 20.9742C7.05554 20.9742 5.78004 20.6692 4.65074 20.0592C3.52649 19.4491 2.63667 18.5517 1.98126 17.367C1.33091 16.1823 1.00574 14.7328 1.00574 13.0187C1.00574 11.2946 1.33848 9.84259 2.00396 8.66285C2.66944 7.47811 3.56682 6.58324 4.69611 5.97827C5.82541 5.36825 7.08578 5.06323 8.47724 5.06323C9.45528 5.06323 10.3552 5.19683 11.177 5.46403C11.9987 5.73123 12.7196 6.12194 13.3397 6.63618C13.9599 7.14537 14.4589 7.77302 14.8371 8.51922C15.2152 9.26533 15.4446 10.1198 15.5253 11.0828Z" fill="%23010507"/>%0A<path d="M23.0894 20.9742C21.829 20.9742 20.7501 20.7246 19.8527 20.2256C18.9553 19.7214 18.2672 19.0206 17.7883 18.1232C17.3093 17.2208 17.0698 16.1747 17.0698 14.9849C17.0698 13.7951 17.3093 12.7516 17.7883 11.8542C18.2672 10.9517 18.9553 10.2509 19.8527 9.75184C20.7501 9.24767 21.829 8.99564 23.0894 8.99564C24.3498 8.99564 25.4286 9.24767 26.326 9.75184C27.2234 10.2509 27.9115 10.9517 28.3905 11.8542C28.8695 12.7516 29.1089 13.7951 29.1089 14.9849C29.1089 16.1747 28.8695 17.2208 28.3905 18.1232C27.9115 19.0206 27.2234 19.7214 26.326 20.2256C25.4286 20.7246 24.3498 20.9742 23.0894 20.9742ZM23.1196 17.8888C23.4726 17.8888 23.7776 17.7703 24.0346 17.5334C24.2918 17.2965 24.4909 16.9587 24.6321 16.5201C24.7733 16.0814 24.8438 15.5597 24.8438 14.9547C24.8438 14.3446 24.7733 13.8228 24.6321 13.3893C24.4909 12.9506 24.2918 12.6128 24.0346 12.3759C23.7776 12.139 23.4726 12.0205 23.1196 12.0205C22.7466 12.0205 22.4265 12.139 22.1592 12.3759C21.8921 12.6128 21.6878 12.9506 21.5466 13.3893C21.4056 13.8228 21.3349 14.3446 21.3349 14.9547C21.3349 15.5597 21.4056 16.0814 21.5466 16.5201C21.6878 16.9587 21.8921 17.2965 22.1592 17.5334C22.4265 17.7703 22.7466 17.8888 23.1196 17.8888Z" fill="%23010507"/>%0A<path d="M30.8029 25.1184V9.14681H34.947V11.1735H35.0377C35.189 10.7803 35.4109 10.4199 35.7032 10.0922C35.9957 9.7594 36.3587 9.4947 36.7922 9.2981C37.2257 9.09639 37.7299 8.99564 38.3046 8.99564C39.0709 8.99564 39.7995 9.19979 40.4901 9.60811C41.1858 10.0165 41.7505 10.6593 42.1841 11.5365C42.6227 12.4138 42.842 13.5531 42.842 14.9547C42.842 16.2957 42.6328 17.4073 42.2143 18.2896C41.801 19.1719 41.2464 19.8298 40.5506 20.2633C39.8599 20.697 39.1011 20.9137 38.2744 20.9137C37.7299 20.9137 37.2434 20.8255 36.8149 20.649C36.3914 20.4675 36.0284 20.223 35.7259 19.9155C35.4285 19.6029 35.199 19.25 35.0377 18.8568H34.9772V25.1184H30.8029ZM34.8865 14.9547C34.8865 15.5193 34.9596 16.0083 35.1058 16.4218C35.257 16.8301 35.4688 17.1477 35.7411 17.3746C36.0183 17.5964 36.3486 17.7073 36.7317 17.7073C37.1149 17.7073 37.44 17.5989 37.7072 17.3821C37.9795 17.1603 38.1862 16.8452 38.3273 16.4369C38.4736 16.0234 38.5466 15.5294 38.5466 14.9547C38.5466 14.3799 38.4736 13.8884 38.3273 13.48C38.1862 13.0666 37.9795 12.7516 37.7072 12.5347C37.44 12.3129 37.1149 12.202 36.7317 12.202C36.3486 12.202 36.0183 12.3129 35.7411 12.5347C35.4688 12.7516 35.257 13.0666 35.1058 13.48C34.9596 13.8884 34.8865 14.3799 34.8865 14.9547Z" fill="%23010507"/>%0A<path d="M44.5908 20.7625V9.14678H48.7652V20.7625H44.5908ZM46.6779 7.93683C46.1133 7.93683 45.6294 7.75033 45.2261 7.37726C44.8227 7.00419 44.621 6.55549 44.621 6.03118C44.621 5.50686 44.8227 5.05816 45.2261 4.68509C45.6294 4.31202 46.1133 4.12549 46.6779 4.12549C47.2477 4.12549 47.7316 4.31202 48.1299 4.68509C48.5332 5.05816 48.7349 5.50686 48.7349 6.03118C48.7349 6.55549 48.5332 7.00419 48.1299 7.37726C47.7316 7.75033 47.2477 7.93683 46.6779 7.93683Z" fill="%23010507"/>%0A<path d="M55.0664 5.27496V20.7625H50.892V5.27496H55.0664Z" fill="%23010507"/>%0A<path d="M62.7893 20.9742C61.5289 20.9742 60.4501 20.7246 59.5527 20.2256C58.6553 19.7214 57.9671 19.0206 57.4881 18.1232C57.0093 17.2208 56.7698 16.1747 56.7698 14.9849C56.7698 13.7951 57.0093 12.7516 57.4881 11.8542C57.9671 10.9517 58.6553 10.2509 59.5527 9.75184C60.4501 9.24767 61.5289 8.99564 62.7893 8.99564C64.0497 8.99564 65.1286 9.24767 66.026 9.75184C66.9234 10.2509 67.6115 10.9517 68.0904 11.8542C68.5694 12.7516 68.8089 13.7951 68.8089 14.9849C68.8089 16.1747 68.5694 17.2208 68.0904 18.1232C67.6115 19.0206 66.9234 19.7214 66.026 20.2256C65.1286 20.7246 64.0497 20.9742 62.7893 20.9742ZM62.8195 17.8888C63.1724 17.8888 63.4775 17.7703 63.7346 17.5334C63.9917 17.2965 64.1908 16.9587 64.332 16.5201C64.4731 16.0814 64.5438 15.5597 64.5438 14.9547C64.5438 14.3446 64.4731 13.8228 64.332 13.3893C64.1908 12.9506 63.9917 12.6128 63.7346 12.3759C63.4775 12.139 63.1724 12.0205 62.8195 12.0205C62.4464 12.0205 62.1263 12.139 61.8592 12.3759C61.5919 12.6128 61.3878 12.9506 61.2466 13.3893C61.1054 13.8228 61.0349 14.3446 61.0349 14.9547C61.0349 15.5597 61.1054 16.0814 61.2466 16.5201C61.3878 16.9587 61.5919 17.2965 61.8592 17.5334C62.1263 17.7703 62.4464 17.8888 62.8195 17.8888Z" fill="%23010507"/>%0A<path d="M77.4298 9.1468V12.1717H69.7769V9.1468H77.4298ZM71.2591 6.36392H75.4334V17.0267C75.4334 17.188 75.4612 17.3241 75.5166 17.4351C75.572 17.5409 75.6578 17.6216 75.7738 17.677C75.8897 17.7274 76.0384 17.7527 76.2199 17.7527C76.3459 17.7527 76.4921 17.7375 76.6585 17.7073C76.8299 17.677 76.9559 17.6518 77.0366 17.6317L77.6416 20.5659C77.4551 20.6213 77.1879 20.6894 76.84 20.77C76.4972 20.8507 76.0888 20.9037 75.6149 20.9288C74.657 20.9792 73.8529 20.8809 73.2026 20.6339C72.5522 20.3818 72.0631 19.9861 71.7355 19.4466C71.4078 18.9072 71.249 18.2316 71.2591 17.42V6.36392Z" fill="%23010507"/>%0A<path d="M79.3223 20.7625V5.27496H83.5268V11.5365H83.7385L88.397 5.27496H93.2973L88.0642 12.1717L93.4183 20.7625H88.397L84.9183 14.9546L83.5268 16.7696V20.7625H79.3223Z" fill="%23010507"/>%0A<path d="M95.3334 20.7625V9.14678H99.5077V20.7625H95.3334ZM97.4206 7.93683C96.8559 7.93683 96.3719 7.75033 95.9686 7.37726C95.5653 7.00419 95.3637 6.55549 95.3637 6.03118C95.3637 5.50686 95.5653 5.05816 95.9686 4.68509C96.3719 4.31202 96.8559 4.12549 97.4206 4.12549C97.9902 4.12549 98.4743 4.31202 98.8725 4.68509C99.2758 5.05816 99.4775 5.50686 99.4775 6.03118C99.4775 6.55549 99.2758 7.00419 98.8725 7.37726C98.4743 7.75033 97.9902 7.93683 97.4206 7.93683Z" fill="%23010507"/>%0A<path d="M108.562 9.1468V12.1717H100.909V9.1468H108.562ZM102.391 6.36392H106.565V17.0267C106.565 17.188 106.593 17.3241 106.648 17.4351C106.704 17.5409 106.789 17.6216 106.905 17.677C107.021 17.7274 107.17 17.7527 107.352 17.7527C107.478 17.7527 107.623 17.7375 107.791 17.7073C107.962 17.677 108.087 17.6518 108.168 17.6317L108.774 20.5659C108.587 20.6213 108.319 20.6894 107.971 20.77C107.629 20.8507 107.22 20.9037 106.747 20.9288C105.789 20.9792 104.985 20.8809 104.334 20.6339C103.684 20.3818 103.195 19.9861 102.867 19.4466C102.54 18.9072 102.381 18.2316 102.391 17.42V6.36392Z" fill="%23010507"/>%0A<path d="M119.539 8.67678C121.648 5.91866 123.398 3.19128 124.071 0.988777C124.089 0.928849 124.159 0.90339 124.212 0.937987C126.553 2.48864 130.818 3.50932 134.591 3.53328C134.656 3.53369 134.7 3.59769 134.677 3.65822C133.423 6.84039 131.891 12.5423 131.831 19.0536C131.831 19.1503 131.695 19.185 131.647 19.1009C129.5 15.3438 122.623 10.0644 119.574 8.81838C119.518 8.79519 119.502 8.7255 119.539 8.67678Z" fill="url(%23paint0_linear_8010_10612)"/>%0A<path d="M126.653 6.98969C123.357 8.03321 120.345 8.61334 119.626 8.74516C119.58 8.75356 119.571 8.81686 119.614 8.83473C122.687 10.1121 129.53 15.3761 131.657 19.118C131.661 19.1262 131.671 19.1292 131.68 19.1255C131.688 19.1214 131.693 19.1108 131.69 19.1016L126.653 6.98969Z" fill="url(%23paint1_linear_8010_10612)"/>%0A<path d="M124.221 0.931179C127.043 2.4702 130.303 3.16142 134.629 3.52564C134.656 3.52796 134.665 3.56437 134.641 3.57702C134.088 3.86136 130.918 5.47409 128.565 6.33784C127.934 6.56926 127.3 6.78394 126.676 6.982C126.662 6.98633 126.647 6.97951 126.641 6.96631L124.156 0.989469C124.139 0.949222 124.183 0.910305 124.221 0.931179Z" fill="url(%23paint2_linear_8010_10612)"/>%0A<path d="M124.171 1.02203L131.742 19.082" stroke="%23513C9F" stroke-width="0.183881" stroke-linecap="round"/>%0A<path d="M119.628 8.74279C119.628 8.74279 123.809 7.99233 127.739 6.63677C131.668 5.28124 134.594 3.6214 134.594 3.6214" stroke="%23513C9F" stroke-width="0.183881" stroke-linecap="round"/>%0A<path d="M125.209 3.30383L122.405 12.6358M122.405 12.6358H129.07M122.405 12.6358L111.874 25.0383" stroke="%23ABABAB" stroke-width="0.321797" stroke-linecap="round"/>%0A<path d="M119.181 22.485L117.94 22.6596C118.584 24.3618 119.904 25.1053 121.479 25.1053C125.341 25.1053 124.163 20.7382 126.4 20.7382C128.023 20.7382 127.364 24.2778 130.857 24.2778C132.989 24.2778 133.201 22.1301 132.837 21.2061C132.835 21.2005 132.833 21.1953 132.83 21.1902L132.259 20.3154C132.222 20.2572 132.131 20.2791 132.125 20.3483L132.018 21.4087C132.011 21.4824 132.013 21.5559 132.021 21.6295C132.109 22.3621 132.165 24.14 130.857 24.14C129.477 24.14 129.145 20.6462 126.4 20.6462C123.181 20.6462 123.594 24.9675 121.618 24.9675C120.313 24.9675 119.319 23.4964 119.181 22.485Z" fill="url(%23paint3_linear_8010_10612)"/>%0A<defs>%0A<linearGradient id="paint0_linear_8010_10612" x1="129.301" y1="2.33848" x2="125.623" y2="12.452" gradientUnits="userSpaceOnUse">%0A<stop stop-color="%236430AB"/>%0A<stop offset="1" stop-color="%23AA89D8"/>%0A</linearGradient>%0A<linearGradient id="paint1_linear_8010_10612" x1="126.451" y1="8.03874" x2="121.717" y2="17.1869" gradientUnits="userSpaceOnUse">%0A<stop stop-color="%23005DBB"/>%0A<stop offset="1" stop-color="%233D92E8"/>%0A</linearGradient>%0A<linearGradient id="paint2_linear_8010_10612" x1="128.565" y1="2.33842" x2="127.139" y2="6.79755" gradientUnits="userSpaceOnUse">%0A<stop stop-color="%231B70C4"/>%0A<stop offset="1" stop-color="%2354A4F2"/>%0A</linearGradient>%0A<linearGradient id="paint3_linear_8010_10612" x1="117.94" y1="22.7838" x2="132.981" y2="22.7838" gradientUnits="userSpaceOnUse">%0A<stop stop-color="%234497EA"/>%0A<stop offset="0.254755" stop-color="%231463B2"/>%0A<stop offset="0.498725" stop-color="%230A437D"/>%0A<stop offset="0.666667" stop-color="%232476C8"/>%0A<stop offset="0.972542" stop-color="%230C549A"/>%0A</linearGradient>%0A</defs>%0A</svg>%0A';
var inspector_logo_icon_default = 'data:image/svg+xml,<?xml version="1.0" encoding="utf-8"?>%0A<svg xmlns="http://www.w3.org/2000/svg" width="55" height="60" viewBox="0 0 55 60" fill="none">%0A  <g stroke="%23FFFFFF" stroke-width="3.3125" stroke-linejoin="round">%0A    <path d="M0 21.9336L16.5449 0C40.8483 5.37332 53 8.05998 53 8.05998L43.123 56L0 21.9336Z" />%0A    <line x1="16.5828" y1="0" x2="43.2454" y2="56" />%0A    <line x1="0" y1="21.9336" x2="53" y2="8.48421" />%0A  </g>%0A</svg>%0A';
function updateSizeFromElement(state, element, fallback) {
  const rect = element.getBoundingClientRect();
  state.size = {
    width: rect.width || fallback.width,
    height: rect.height || fallback.height
  };
}
function clampSize(size, viewport, edgeMargin, minWidth, minHeight) {
  const maxWidth = Math.max(minWidth, viewport.width - edgeMargin * 2);
  const maxHeight = Math.max(minHeight, viewport.height - edgeMargin * 2);
  return {
    width: clamp(size.width, minWidth, maxWidth),
    height: clamp(size.height, minHeight, maxHeight)
  };
}
function constrainToViewport(state, position, viewport, edgeMargin) {
  const maxX = Math.max(
    edgeMargin,
    viewport.width - state.size.width - edgeMargin
  );
  const maxY = Math.max(
    edgeMargin,
    viewport.height - state.size.height - edgeMargin
  );
  return {
    x: clamp(position.x, edgeMargin, maxX),
    y: clamp(position.y, edgeMargin, maxY)
  };
}
function keepPositionWithinViewport(state, viewport, edgeMargin) {
  state.position = constrainToViewport(
    state,
    state.position,
    viewport,
    edgeMargin
  );
}
function centerContext(state, viewport, edgeMargin) {
  const centered = {
    x: Math.round((viewport.width - state.size.width) / 2),
    y: Math.round((viewport.height - state.size.height) / 2)
  };
  state.position = constrainToViewport(state, centered, viewport, edgeMargin);
  updateAnchorFromPosition(state, viewport, edgeMargin);
  return state.position;
}
function updateAnchorFromPosition(state, viewport, edgeMargin) {
  const centerX = state.position.x + state.size.width / 2;
  const centerY = state.position.y + state.size.height / 2;
  const horizontal = centerX < viewport.width / 2 ? "left" : "right";
  const vertical = centerY < viewport.height / 2 ? "top" : "bottom";
  state.anchor = { horizontal, vertical };
  const maxHorizontalOffset = Math.max(
    edgeMargin,
    viewport.width - state.size.width - edgeMargin
  );
  const maxVerticalOffset = Math.max(
    edgeMargin,
    viewport.height - state.size.height - edgeMargin
  );
  state.anchorOffset = {
    x: horizontal === "left" ? clamp(state.position.x, edgeMargin, maxHorizontalOffset) : clamp(
      viewport.width - state.position.x - state.size.width,
      edgeMargin,
      maxHorizontalOffset
    ),
    y: vertical === "top" ? clamp(state.position.y, edgeMargin, maxVerticalOffset) : clamp(
      viewport.height - state.position.y - state.size.height,
      edgeMargin,
      maxVerticalOffset
    )
  };
}
function applyAnchorPosition(state, viewport, edgeMargin) {
  const maxHorizontalOffset = Math.max(
    edgeMargin,
    viewport.width - state.size.width - edgeMargin
  );
  const maxVerticalOffset = Math.max(
    edgeMargin,
    viewport.height - state.size.height - edgeMargin
  );
  const horizontalOffset = clamp(
    state.anchorOffset.x,
    edgeMargin,
    maxHorizontalOffset
  );
  const verticalOffset = clamp(
    state.anchorOffset.y,
    edgeMargin,
    maxVerticalOffset
  );
  const x2 = state.anchor.horizontal === "left" ? horizontalOffset : viewport.width - state.size.width - horizontalOffset;
  const y3 = state.anchor.vertical === "top" ? verticalOffset : viewport.height - state.size.height - verticalOffset;
  state.anchorOffset = { x: horizontalOffset, y: verticalOffset };
  state.position = constrainToViewport(state, { x: x2, y: y3 }, viewport, edgeMargin);
  return state.position;
}
function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}
function loadInspectorState(storageKey) {
  if (typeof window === "undefined") {
    return null;
  }
  const raw = window.localStorage.getItem(storageKey);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    } catch {
    }
  }
  if (typeof document !== "undefined") {
    const prefix = `${storageKey}=`;
    const entry = document.cookie.split("; ").find((cookie) => cookie.startsWith(prefix));
    if (entry) {
      const legacyRaw = entry.substring(prefix.length);
      try {
        const parsed = JSON.parse(decodeURIComponent(legacyRaw));
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch {
        return null;
      }
    }
  }
  return null;
}
function saveInspectorState(storageKey, state) {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (error) {
    console.warn("Failed to persist inspector state", error);
  }
}
function isValidAnchor(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return (candidate.horizontal === "left" || candidate.horizontal === "right") && (candidate.vertical === "top" || candidate.vertical === "bottom");
}
function isValidPosition(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return isFiniteNumber(candidate.x) && isFiniteNumber(candidate.y);
}
function isValidSize(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  const candidate = value;
  return isFiniteNumber(candidate.width) && isFiniteNumber(candidate.height);
}
function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}
function isValidDockMode(value) {
  return value === "floating" || value === "docked-left";
}
var WEB_INSPECTOR_TAG = "cpk-web-inspector";
var EDGE_MARGIN = 16;
var DRAG_THRESHOLD = 6;
var MIN_WINDOW_WIDTH = 600;
var MIN_WINDOW_WIDTH_DOCKED_LEFT = 420;
var MIN_WINDOW_HEIGHT = 200;
var INSPECTOR_STORAGE_KEY = "cpk:inspector:state";
var ANNOUNCEMENT_STORAGE_KEY = "cpk:inspector:announcements";
var ANNOUNCEMENT_URL = "https://cdn.copilotkit.ai/announcements.json";
var DEFAULT_BUTTON_SIZE = { width: 48, height: 48 };
var DEFAULT_WINDOW_SIZE = { width: 840, height: 560 };
var DOCKED_LEFT_WIDTH = 500;
var MAX_AGENT_EVENTS = 200;
var MAX_TOTAL_EVENTS = 500;
var AGENT_EVENT_TYPES = [
  "RUN_STARTED",
  "RUN_FINISHED",
  "RUN_ERROR",
  "TEXT_MESSAGE_START",
  "TEXT_MESSAGE_CONTENT",
  "TEXT_MESSAGE_END",
  "TOOL_CALL_START",
  "TOOL_CALL_ARGS",
  "TOOL_CALL_END",
  "TOOL_CALL_RESULT",
  "STATE_SNAPSHOT",
  "STATE_DELTA",
  "MESSAGES_SNAPSHOT",
  "RAW_EVENT",
  "CUSTOM_EVENT"
];
var WebInspectorElement = class extends i$2 {
  constructor() {
    super(...arguments);
    this._core = null;
    this.coreSubscriber = null;
    this.coreUnsubscribe = null;
    this.runtimeStatus = null;
    this.coreProperties = {};
    this.lastCoreError = null;
    this.agentSubscriptions = /* @__PURE__ */ new Map();
    this.agentEvents = /* @__PURE__ */ new Map();
    this.agentMessages = /* @__PURE__ */ new Map();
    this.agentStates = /* @__PURE__ */ new Map();
    this.flattenedEvents = [];
    this.eventCounter = 0;
    this.contextStore = {};
    this.pointerId = null;
    this.dragStart = null;
    this.dragOffset = { x: 0, y: 0 };
    this.isDragging = false;
    this.pointerContext = null;
    this.isOpen = false;
    this.draggedDuringInteraction = false;
    this.ignoreNextButtonClick = false;
    this.selectedMenu = "ag-ui-events";
    this.contextMenuOpen = false;
    this.dockMode = "floating";
    this.previousBodyMargins = null;
    this.transitionTimeoutId = null;
    this.pendingSelectedContext = null;
    this.autoAttachCore = true;
    this.attemptedAutoAttach = false;
    this.cachedTools = [];
    this.toolSignature = "";
    this.eventFilterText = "";
    this.eventTypeFilter = "all";
    this.announcementMarkdown = null;
    this.announcementHtml = null;
    this.announcementTimestamp = null;
    this.announcementPreviewText = null;
    this.hasUnseenAnnouncement = false;
    this.announcementLoaded = false;
    this.announcementLoadError = null;
    this.announcementPromise = null;
    this.showAnnouncementPreview = true;
    this.contextState = {
      button: {
        position: { x: EDGE_MARGIN, y: EDGE_MARGIN },
        size: { ...DEFAULT_BUTTON_SIZE },
        anchor: { horizontal: "right", vertical: "top" },
        anchorOffset: { x: EDGE_MARGIN, y: EDGE_MARGIN }
      },
      window: {
        position: { x: EDGE_MARGIN, y: EDGE_MARGIN },
        size: { ...DEFAULT_WINDOW_SIZE },
        anchor: { horizontal: "right", vertical: "top" },
        anchorOffset: { x: EDGE_MARGIN, y: EDGE_MARGIN }
      }
    };
    this.hasCustomPosition = {
      button: false,
      window: false
    };
    this.resizePointerId = null;
    this.resizeStart = null;
    this.resizeInitialSize = null;
    this.isResizing = false;
    this.menuItems = [
      { key: "ag-ui-events", label: "AG-UI Events", icon: "Zap" },
      { key: "agents", label: "Agent", icon: "Bot" },
      { key: "frontend-tools", label: "Frontend Tools", icon: "Hammer" },
      { key: "agent-context", label: "Context", icon: "FileText" }
    ];
    this.handlePointerDown = (event) => {
      if (this.dockMode !== "floating" && this.isOpen) {
        return;
      }
      const target = event.currentTarget;
      const contextAttr = target?.dataset.dragContext;
      const context = contextAttr === "window" ? "window" : "button";
      const eventTarget = event.target;
      if (context === "window" && eventTarget?.closest("button")) {
        return;
      }
      this.pointerContext = context;
      this.measureContext(context);
      event.preventDefault();
      this.pointerId = event.pointerId;
      this.dragStart = { x: event.clientX, y: event.clientY };
      const state = this.contextState[context];
      this.dragOffset = {
        x: event.clientX - state.position.x,
        y: event.clientY - state.position.y
      };
      this.isDragging = false;
      this.draggedDuringInteraction = false;
      this.ignoreNextButtonClick = false;
      target?.setPointerCapture?.(this.pointerId);
    };
    this.handlePointerMove = (event) => {
      if (this.pointerId !== event.pointerId || !this.dragStart || !this.pointerContext) {
        return;
      }
      const distance = Math.hypot(
        event.clientX - this.dragStart.x,
        event.clientY - this.dragStart.y
      );
      if (!this.isDragging && distance < DRAG_THRESHOLD) {
        return;
      }
      event.preventDefault();
      this.setDragging(true);
      this.draggedDuringInteraction = true;
      const desired = {
        x: event.clientX - this.dragOffset.x,
        y: event.clientY - this.dragOffset.y
      };
      const constrained = this.constrainToViewport(desired, this.pointerContext);
      this.contextState[this.pointerContext].position = constrained;
      this.updateHostTransform(this.pointerContext);
    };
    this.handlePointerUp = (event) => {
      if (this.pointerId !== event.pointerId) {
        return;
      }
      const target = event.currentTarget;
      if (target?.hasPointerCapture(this.pointerId)) {
        target.releasePointerCapture(this.pointerId);
      }
      const context = this.pointerContext ?? this.activeContext;
      if (this.isDragging && this.pointerContext) {
        event.preventDefault();
        this.setDragging(false);
        if (this.pointerContext === "window") {
          this.updateAnchorFromPosition(this.pointerContext);
          this.hasCustomPosition.window = true;
          this.applyAnchorPosition(this.pointerContext);
        } else if (this.pointerContext === "button") {
          this.snapButtonToCorner();
          this.hasCustomPosition.button = true;
          if (this.draggedDuringInteraction) {
            this.ignoreNextButtonClick = true;
          }
        }
      } else if (context === "button" && !this.isOpen && !this.draggedDuringInteraction) {
        this.openInspector();
      }
      this.resetPointerTracking();
    };
    this.handlePointerCancel = (event) => {
      if (this.pointerId !== event.pointerId) {
        return;
      }
      const target = event.currentTarget;
      if (target?.hasPointerCapture(this.pointerId)) {
        target.releasePointerCapture(this.pointerId);
      }
      this.resetPointerTracking();
    };
    this.handleButtonClick = (event) => {
      if (this.isDragging) {
        event.preventDefault();
        return;
      }
      if (this.ignoreNextButtonClick) {
        event.preventDefault();
        this.ignoreNextButtonClick = false;
        return;
      }
      if (!this.isOpen) {
        event.preventDefault();
        this.openInspector();
      }
    };
    this.handleClosePointerDown = (event) => {
      event.stopPropagation();
      event.preventDefault();
    };
    this.handleCloseClick = () => {
      this.closeInspector();
    };
    this.handleResizePointerDown = (event) => {
      event.stopPropagation();
      event.preventDefault();
      this.hasCustomPosition.window = true;
      this.isResizing = true;
      this.resizePointerId = event.pointerId;
      this.resizeStart = { x: event.clientX, y: event.clientY };
      this.resizeInitialSize = { ...this.contextState.window.size };
      if (document.body && this.dockMode !== "floating") {
        document.body.style.transition = "";
      }
      const target = event.currentTarget;
      target?.setPointerCapture?.(event.pointerId);
    };
    this.handleResizePointerMove = (event) => {
      if (!this.isResizing || this.resizePointerId !== event.pointerId || !this.resizeStart || !this.resizeInitialSize) {
        return;
      }
      event.preventDefault();
      const deltaX = event.clientX - this.resizeStart.x;
      const deltaY = event.clientY - this.resizeStart.y;
      const state = this.contextState.window;
      if (this.dockMode === "docked-left") {
        state.size = this.clampWindowSize({
          width: this.resizeInitialSize.width + deltaX,
          height: state.size.height
        });
        if (document.body) {
          document.body.style.marginLeft = `${state.size.width}px`;
        }
      } else {
        state.size = this.clampWindowSize({
          width: this.resizeInitialSize.width + deltaX,
          height: this.resizeInitialSize.height + deltaY
        });
        this.keepPositionWithinViewport("window");
        this.updateAnchorFromPosition("window");
      }
      this.requestUpdate();
      this.updateHostTransform("window");
    };
    this.handleResizePointerUp = (event) => {
      if (this.resizePointerId !== event.pointerId) {
        return;
      }
      const target = event.currentTarget;
      if (target?.hasPointerCapture(this.resizePointerId)) {
        target.releasePointerCapture(this.resizePointerId);
      }
      if (this.dockMode === "floating") {
        this.updateAnchorFromPosition("window");
        this.applyAnchorPosition("window");
      }
      this.persistState();
      this.resetResizeTracking();
    };
    this.handleResizePointerCancel = (event) => {
      if (this.resizePointerId !== event.pointerId) {
        return;
      }
      const target = event.currentTarget;
      if (target?.hasPointerCapture(this.resizePointerId)) {
        target.releasePointerCapture(this.resizePointerId);
      }
      if (this.dockMode === "floating") {
        this.updateAnchorFromPosition("window");
        this.applyAnchorPosition("window");
      }
      this.persistState();
      this.resetResizeTracking();
    };
    this.handleResize = () => {
      this.measureContext("button");
      this.applyAnchorPosition("button");
      this.measureContext("window");
      if (this.hasCustomPosition.window) {
        this.applyAnchorPosition("window");
      } else {
        this.centerContext("window");
      }
      this.updateHostTransform();
    };
    this.contextOptions = [
      { key: "all-agents", label: "All Agents" }
    ];
    this.selectedContext = "all-agents";
    this.expandedRows = /* @__PURE__ */ new Set();
    this.copiedEvents = /* @__PURE__ */ new Set();
    this.expandedTools = /* @__PURE__ */ new Set();
    this.expandedContextItems = /* @__PURE__ */ new Set();
    this.copiedContextItems = /* @__PURE__ */ new Set();
    this.handleClearEvents = () => {
      if (this.selectedContext === "all-agents") {
        this.agentEvents.clear();
        this.flattenedEvents = [];
      } else {
        this.agentEvents.delete(this.selectedContext);
        this.flattenedEvents = this.flattenedEvents.filter(
          (event) => event.agentId !== this.selectedContext
        );
      }
      this.expandedRows.clear();
      this.copiedEvents.clear();
      this.requestUpdate();
    };
    this.handleGlobalPointerDown = (event) => {
      if (!this.contextMenuOpen) {
        return;
      }
      const clickedDropdown = event.composedPath().some((node) => {
        return node instanceof HTMLElement && node.dataset?.contextDropdownRoot === "true";
      });
      if (!clickedDropdown) {
        this.contextMenuOpen = false;
        this.requestUpdate();
      }
    };
    this.handleDismissAnnouncement = () => {
      this.markAnnouncementSeen();
    };
  }
  static {
    this.properties = {
      core: { attribute: false },
      autoAttachCore: { type: Boolean, attribute: "auto-attach-core" }
    };
  }
  get core() {
    return this._core;
  }
  set core(value) {
    const oldValue = this._core;
    if (oldValue === value) {
      return;
    }
    this.detachFromCore();
    this._core = value ?? null;
    this.requestUpdate("core", oldValue);
    if (this._core) {
      this.attachToCore(this._core);
    }
  }
  attachToCore(core) {
    this.runtimeStatus = core.runtimeConnectionStatus;
    this.coreProperties = core.properties;
    this.lastCoreError = null;
    this.coreSubscriber = {
      onRuntimeConnectionStatusChanged: ({ status }) => {
        this.runtimeStatus = status;
        this.requestUpdate();
      },
      onPropertiesChanged: ({ properties }) => {
        this.coreProperties = properties;
        this.requestUpdate();
      },
      onError: ({ code, error }) => {
        this.lastCoreError = { code, message: error.message };
        this.requestUpdate();
      },
      onAgentsChanged: ({ agents }) => {
        this.processAgentsChanged(agents);
      },
      onContextChanged: ({ context }) => {
        this.contextStore = this.normalizeContextStore(context);
        this.requestUpdate();
      }
    };
    this.coreUnsubscribe = core.subscribe(this.coreSubscriber).unsubscribe;
    this.processAgentsChanged(core.agents);
    if (core.context) {
      this.contextStore = this.normalizeContextStore(core.context);
    }
  }
  detachFromCore() {
    if (this.coreUnsubscribe) {
      this.coreUnsubscribe();
      this.coreUnsubscribe = null;
    }
    this.coreSubscriber = null;
    this.runtimeStatus = null;
    this.lastCoreError = null;
    this.coreProperties = {};
    this.cachedTools = [];
    this.toolSignature = "";
    this.teardownAgentSubscriptions();
  }
  teardownAgentSubscriptions() {
    for (const unsubscribe of this.agentSubscriptions.values()) {
      unsubscribe();
    }
    this.agentSubscriptions.clear();
    this.agentEvents.clear();
    this.agentMessages.clear();
    this.agentStates.clear();
    this.flattenedEvents = [];
    this.eventCounter = 0;
  }
  processAgentsChanged(agents) {
    const seenAgentIds = /* @__PURE__ */ new Set();
    for (const agent of Object.values(agents)) {
      if (!agent?.agentId) {
        continue;
      }
      seenAgentIds.add(agent.agentId);
      this.subscribeToAgent(agent);
    }
    for (const agentId of Array.from(this.agentSubscriptions.keys())) {
      if (!seenAgentIds.has(agentId)) {
        this.unsubscribeFromAgent(agentId);
        this.agentEvents.delete(agentId);
        this.agentMessages.delete(agentId);
        this.agentStates.delete(agentId);
      }
    }
    this.updateContextOptions(seenAgentIds);
    this.refreshToolsSnapshot();
    this.requestUpdate();
  }
  refreshToolsSnapshot() {
    if (!this._core) {
      if (this.cachedTools.length > 0) {
        this.cachedTools = [];
        this.toolSignature = "";
        this.requestUpdate();
      }
      return;
    }
    const tools = this.extractToolsFromAgents();
    const signature = JSON.stringify(
      tools.map((tool) => ({
        agentId: tool.agentId,
        name: tool.name,
        type: tool.type,
        hasDescription: Boolean(tool.description),
        hasParameters: Boolean(tool.parameters)
      }))
    );
    if (signature !== this.toolSignature) {
      this.toolSignature = signature;
      this.cachedTools = tools;
      this.requestUpdate();
    }
  }
  tryAutoAttachCore() {
    if (this.attemptedAutoAttach || this._core || !this.autoAttachCore || typeof window === "undefined") {
      return;
    }
    this.attemptedAutoAttach = true;
    const globalWindow = window;
    const globalCandidates = [
      // Common app-level globals used during development
      globalWindow.__COPILOTKIT_CORE__,
      globalWindow.copilotkit?.core,
      globalWindow.copilotkitCore
    ];
    const foundCore = globalCandidates.find(
      (candidate) => !!candidate && typeof candidate === "object"
    );
    if (foundCore) {
      this.core = foundCore;
    }
  }
  subscribeToAgent(agent) {
    if (!agent.agentId) {
      return;
    }
    const agentId = agent.agentId;
    this.unsubscribeFromAgent(agentId);
    const subscriber = {
      onRunStartedEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "RUN_STARTED", event);
      },
      onRunFinishedEvent: ({ event, result }) => {
        this.recordAgentEvent(agentId, "RUN_FINISHED", { event, result });
      },
      onRunErrorEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "RUN_ERROR", event);
      },
      onTextMessageStartEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "TEXT_MESSAGE_START", event);
      },
      onTextMessageContentEvent: ({ event, textMessageBuffer }) => {
        this.recordAgentEvent(agentId, "TEXT_MESSAGE_CONTENT", {
          event,
          textMessageBuffer
        });
      },
      onTextMessageEndEvent: ({ event, textMessageBuffer }) => {
        this.recordAgentEvent(agentId, "TEXT_MESSAGE_END", {
          event,
          textMessageBuffer
        });
      },
      onToolCallStartEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "TOOL_CALL_START", event);
      },
      onToolCallArgsEvent: ({
        event,
        toolCallBuffer,
        toolCallName,
        partialToolCallArgs
      }) => {
        this.recordAgentEvent(agentId, "TOOL_CALL_ARGS", {
          event,
          toolCallBuffer,
          toolCallName,
          partialToolCallArgs
        });
      },
      onToolCallEndEvent: ({ event, toolCallArgs, toolCallName }) => {
        this.recordAgentEvent(agentId, "TOOL_CALL_END", {
          event,
          toolCallArgs,
          toolCallName
        });
      },
      onToolCallResultEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "TOOL_CALL_RESULT", event);
      },
      onStateSnapshotEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "STATE_SNAPSHOT", event);
        this.syncAgentState(agent);
      },
      onStateDeltaEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "STATE_DELTA", event);
        this.syncAgentState(agent);
      },
      onMessagesSnapshotEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "MESSAGES_SNAPSHOT", event);
        this.syncAgentMessages(agent);
      },
      onMessagesChanged: () => {
        this.syncAgentMessages(agent);
      },
      onRawEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "RAW_EVENT", event);
      },
      onCustomEvent: ({ event }) => {
        this.recordAgentEvent(agentId, "CUSTOM_EVENT", event);
      }
    };
    const { unsubscribe } = agent.subscribe(subscriber);
    this.agentSubscriptions.set(agentId, unsubscribe);
    this.syncAgentMessages(agent);
    this.syncAgentState(agent);
    if (!this.agentEvents.has(agentId)) {
      this.agentEvents.set(agentId, []);
    }
  }
  unsubscribeFromAgent(agentId) {
    const unsubscribe = this.agentSubscriptions.get(agentId);
    if (unsubscribe) {
      unsubscribe();
      this.agentSubscriptions.delete(agentId);
    }
  }
  recordAgentEvent(agentId, type, payload) {
    const eventId = `${agentId}:${++this.eventCounter}`;
    const normalizedPayload = this.normalizeEventPayload(type, payload);
    const event = {
      id: eventId,
      agentId,
      type,
      timestamp: Date.now(),
      payload: normalizedPayload
    };
    const currentAgentEvents = this.agentEvents.get(agentId) ?? [];
    const nextAgentEvents = [event, ...currentAgentEvents].slice(
      0,
      MAX_AGENT_EVENTS
    );
    this.agentEvents.set(agentId, nextAgentEvents);
    this.flattenedEvents = [event, ...this.flattenedEvents].slice(
      0,
      MAX_TOTAL_EVENTS
    );
    this.refreshToolsSnapshot();
    this.requestUpdate();
  }
  syncAgentMessages(agent) {
    if (!agent?.agentId) {
      return;
    }
    const messages = this.normalizeAgentMessages(
      agent.messages
    );
    if (messages) {
      this.agentMessages.set(agent.agentId, messages);
    } else {
      this.agentMessages.delete(agent.agentId);
    }
    this.requestUpdate();
  }
  syncAgentState(agent) {
    if (!agent?.agentId) {
      return;
    }
    const state = agent.state;
    if (state === void 0 || state === null) {
      this.agentStates.delete(agent.agentId);
    } else {
      this.agentStates.set(agent.agentId, this.sanitizeForLogging(state));
    }
    this.requestUpdate();
  }
  updateContextOptions(agentIds) {
    const nextOptions = [
      { key: "all-agents", label: "All Agents" },
      ...Array.from(agentIds).sort((a2, b2) => a2.localeCompare(b2)).map((id) => ({ key: id, label: id }))
    ];
    const optionsChanged = this.contextOptions.length !== nextOptions.length || this.contextOptions.some(
      (option, index) => option.key !== nextOptions[index]?.key
    );
    if (optionsChanged) {
      this.contextOptions = nextOptions;
    }
    const pendingContext = this.pendingSelectedContext;
    if (pendingContext) {
      const isPendingAvailable = pendingContext === "all-agents" || agentIds.has(pendingContext);
      if (isPendingAvailable) {
        if (this.selectedContext !== pendingContext) {
          this.selectedContext = pendingContext;
          this.expandedRows.clear();
        }
        this.pendingSelectedContext = null;
      } else if (agentIds.size > 0) {
        this.pendingSelectedContext = null;
      }
    }
    const hasSelectedContext = nextOptions.some(
      (option) => option.key === this.selectedContext
    );
    if (!hasSelectedContext && this.pendingSelectedContext === null) {
      let nextSelected = "all-agents";
      if (agentIds.has("default")) {
        nextSelected = "default";
      } else if (agentIds.size > 0) {
        nextSelected = Array.from(agentIds).sort(
          (a2, b2) => a2.localeCompare(b2)
        )[0];
      }
      if (this.selectedContext !== nextSelected) {
        this.selectedContext = nextSelected;
        this.expandedRows.clear();
        this.persistState();
      }
    }
  }
  getEventsForSelectedContext() {
    if (this.selectedContext === "all-agents") {
      return this.flattenedEvents;
    }
    return this.agentEvents.get(this.selectedContext) ?? [];
  }
  filterEvents(events) {
    const query = this.eventFilterText.trim().toLowerCase();
    return events.filter((event) => {
      if (this.eventTypeFilter !== "all" && event.type !== this.eventTypeFilter) {
        return false;
      }
      if (!query) {
        return true;
      }
      const payloadText = this.stringifyPayload(
        event.payload,
        false
      ).toLowerCase();
      return event.type.toLowerCase().includes(query) || event.agentId.toLowerCase().includes(query) || payloadText.includes(query);
    });
  }
  getLatestStateForAgent(agentId) {
    if (this.agentStates.has(agentId)) {
      const value = this.agentStates.get(agentId);
      return value === void 0 ? null : value;
    }
    const events = this.agentEvents.get(agentId) ?? [];
    const stateEvent = events.find((e2) => e2.type === "STATE_SNAPSHOT");
    if (!stateEvent) {
      return null;
    }
    return stateEvent.payload;
  }
  getLatestMessagesForAgent(agentId) {
    const messages = this.agentMessages.get(agentId);
    return messages ?? null;
  }
  getAgentStatus(agentId) {
    const events = this.agentEvents.get(agentId) ?? [];
    if (events.length === 0) {
      return "idle";
    }
    const runEvent = events.find(
      (e2) => e2.type === "RUN_STARTED" || e2.type === "RUN_FINISHED" || e2.type === "RUN_ERROR"
    );
    if (!runEvent) {
      return "idle";
    }
    if (runEvent.type === "RUN_ERROR") {
      return "error";
    }
    if (runEvent.type === "RUN_STARTED") {
      const finishedAfter = events.find(
        (e2) => e2.type === "RUN_FINISHED" && e2.timestamp > runEvent.timestamp
      );
      return finishedAfter ? "idle" : "running";
    }
    return "idle";
  }
  getAgentStats(agentId) {
    const events = this.agentEvents.get(agentId) ?? [];
    const messages = this.agentMessages.get(agentId);
    const toolCallCount = messages ? messages.reduce(
      (count, message) => count + (message.toolCalls?.length ?? 0),
      0
    ) : events.filter((e2) => e2.type === "TOOL_CALL_END").length;
    const messageCount = messages?.length ?? 0;
    return {
      totalEvents: events.length,
      lastActivity: events[0]?.timestamp ?? null,
      messages: messageCount,
      toolCalls: toolCallCount,
      errors: events.filter((e2) => e2.type === "RUN_ERROR").length
    };
  }
  renderToolCallDetails(toolCalls) {
    if (!Array.isArray(toolCalls) || toolCalls.length === 0) {
      return A;
    }
    return b`
      <div class="mt-2 space-y-2">
        ${toolCalls.map((call, index) => {
      const functionName = call.function?.name ?? call.toolName ?? "Unknown function";
      const callId = typeof call?.id === "string" ? call.id : `tool-call-${index + 1}`;
      const argsString = this.formatToolCallArguments(
        call.function?.arguments
      );
      return b`
            <div
              class="rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700"
            >
              <div
                class="flex flex-wrap items-center justify-between gap-1 font-medium text-gray-900"
              >
                <span>${functionName}</span>
                <span class="text-[10px] text-gray-500">ID: ${callId}</span>
              </div>
              ${argsString ? b`<pre
                    class="mt-2 overflow-auto rounded bg-white p-2 text-[11px] leading-relaxed text-gray-800"
                  >
${argsString}</pre
                  >` : A}
            </div>
          `;
    })}
      </div>
    `;
  }
  formatToolCallArguments(args) {
    if (args === void 0 || args === null || args === "") {
      return null;
    }
    if (typeof args === "string") {
      try {
        const parsed = JSON.parse(args);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return args;
      }
    }
    if (typeof args === "object") {
      try {
        return JSON.stringify(args, null, 2);
      } catch {
        return String(args);
      }
    }
    return String(args);
  }
  hasRenderableState(state) {
    if (state === null || state === void 0) {
      return false;
    }
    if (Array.isArray(state)) {
      return state.length > 0;
    }
    if (typeof state === "object") {
      return Object.keys(state).length > 0;
    }
    if (typeof state === "string") {
      const trimmed = state.trim();
      return trimmed.length > 0 && trimmed !== "{}";
    }
    return true;
  }
  formatStateForDisplay(state) {
    if (state === null || state === void 0) {
      return "";
    }
    if (typeof state === "string") {
      const trimmed = state.trim();
      if (trimmed.length === 0) {
        return "";
      }
      try {
        const parsed = JSON.parse(trimmed);
        return JSON.stringify(parsed, null, 2);
      } catch {
        return state;
      }
    }
    if (typeof state === "object") {
      try {
        return JSON.stringify(state, null, 2);
      } catch {
        return String(state);
      }
    }
    return String(state);
  }
  getEventBadgeClasses(type) {
    const base = "font-mono text-[10px] font-medium inline-flex items-center rounded-sm px-1.5 py-0.5 border";
    if (type.startsWith("RUN_")) {
      return `${base} bg-blue-50 text-blue-700 border-blue-200`;
    }
    if (type.startsWith("TEXT_MESSAGE")) {
      return `${base} bg-emerald-50 text-emerald-700 border-emerald-200`;
    }
    if (type.startsWith("TOOL_CALL")) {
      return `${base} bg-amber-50 text-amber-700 border-amber-200`;
    }
    if (type.startsWith("STATE")) {
      return `${base} bg-violet-50 text-violet-700 border-violet-200`;
    }
    if (type.startsWith("MESSAGES")) {
      return `${base} bg-sky-50 text-sky-700 border-sky-200`;
    }
    if (type === "RUN_ERROR") {
      return `${base} bg-rose-50 text-rose-700 border-rose-200`;
    }
    return `${base} bg-gray-100 text-gray-600 border-gray-200`;
  }
  stringifyPayload(payload, pretty) {
    try {
      if (payload === void 0) {
        return pretty ? "undefined" : "undefined";
      }
      if (typeof payload === "string") {
        return payload;
      }
      return JSON.stringify(payload, null, pretty ? 2 : 0) ?? "";
    } catch (error) {
      console.warn("Failed to stringify inspector payload", error);
      return String(payload);
    }
  }
  extractEventFromPayload(payload) {
    if (payload && typeof payload === "object" && "event" in payload) {
      return payload.event;
    }
    return payload;
  }
  async copyToClipboard(text, eventId) {
    try {
      await navigator.clipboard.writeText(text);
      this.copiedEvents.add(eventId);
      this.requestUpdate();
      setTimeout(() => {
        this.copiedEvents.delete(eventId);
        this.requestUpdate();
      }, 2e3);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  }
  static {
    this.styles = [
      r$2(generated_default),
      i$5`
      :host {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 2147483646;
        display: block;
        will-change: transform;
      }

      :host([data-transitioning="true"]) {
        transition: transform 300ms ease;
      }

      .console-button {
        transition:
          transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1),
          opacity 160ms ease;
      }

      .console-button[data-dragging="true"] {
        transition: opacity 160ms ease;
      }

      .inspector-window[data-transitioning="true"] {
        transition:
          width 300ms ease,
          height 300ms ease;
      }

      .inspector-window[data-docked="true"] {
        border-radius: 0 !important;
        box-shadow: none !important;
      }

      .resize-handle {
        touch-action: none;
        user-select: none;
      }

      .dock-resize-handle {
        position: absolute;
        top: 0;
        right: 0;
        width: 10px;
        height: 100%;
        cursor: ew-resize;
        touch-action: none;
        z-index: 50;
        background: transparent;
      }

      .tooltip-target {
        position: relative;
      }

      .tooltip-target::after {
        content: attr(data-tooltip);
        position: absolute;
        top: calc(100% + 6px);
        left: 50%;
        transform: translateX(-50%) translateY(-4px);
        white-space: nowrap;
        background: rgba(17, 24, 39, 0.95);
        color: white;
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 10px;
        line-height: 1.2;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
        opacity: 0;
        pointer-events: none;
        transition:
          opacity 120ms ease,
          transform 120ms ease;
        z-index: 4000;
      }

      .tooltip-target:hover::after {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }

      .announcement-preview {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        min-width: 300px;
        max-width: 300px;
        background: white;
        color: #111827;
        font-size: 13px;
        line-height: 1.4;
        border-radius: 12px;
        box-shadow: 0 12px 28px rgba(15, 23, 42, 0.22);
        padding: 10px 12px;
        display: inline-flex;
        align-items: flex-start;
        gap: 8px;
        z-index: 4500;
        animation: fade-slide-in 160ms ease;
        border: 1px solid rgba(148, 163, 184, 0.35);
        white-space: normal;
        word-break: break-word;
        text-align: left;
      }

      .announcement-preview[data-side="left"] {
        right: 100%;
        margin-right: 10px;
      }

      .announcement-preview[data-side="right"] {
        left: 100%;
        margin-left: 10px;
      }

      .announcement-preview__arrow {
        position: absolute;
        width: 10px;
        height: 10px;
        background: white;
        border: 1px solid rgba(148, 163, 184, 0.35);
        transform: rotate(45deg);
        top: 50%;
        margin-top: -5px;
        z-index: -1;
      }

      .announcement-preview[data-side="left"] .announcement-preview__arrow {
        right: -5px;
        box-shadow: 6px -6px 10px rgba(15, 23, 42, 0.12);
      }

      .announcement-preview[data-side="right"] .announcement-preview__arrow {
        left: -5px;
        box-shadow: -6px 6px 10px rgba(15, 23, 42, 0.12);
      }

      .announcement-dismiss {
        color: #6b7280;
        font-size: 12px;
        padding: 2px 8px;
        border-radius: 8px;
        border: 1px solid rgba(148, 163, 184, 0.5);
        background: rgba(248, 250, 252, 0.9);
        transition:
          background 120ms ease,
          color 120ms ease;
      }

      .announcement-dismiss:hover {
        background: rgba(241, 245, 249, 1);
        color: #111827;
      }

      .announcement-content {
        color: #111827;
        font-size: 14px;
        line-height: 1.6;
      }

      .announcement-content h1,
      .announcement-content h2,
      .announcement-content h3 {
        font-weight: 700;
        margin: 0.4rem 0 0.2rem;
      }

      .announcement-content h1 {
        font-size: 1.1rem;
      }

      .announcement-content h2 {
        font-size: 1rem;
      }

      .announcement-content h3 {
        font-size: 0.95rem;
      }

      .announcement-content p {
        margin: 0.25rem 0;
      }

      .announcement-content ul {
        list-style: disc;
        padding-left: 1.25rem;
        margin: 0.3rem 0;
      }

      .announcement-content ol {
        list-style: decimal;
        padding-left: 1.25rem;
        margin: 0.3rem 0;
      }

      .announcement-content a {
        color: #0f766e;
        text-decoration: underline;
      }
    `
    ];
  }
  connectedCallback() {
    super.connectedCallback();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.handleResize);
      window.addEventListener(
        "pointerdown",
        this.handleGlobalPointerDown
      );
      this.hydrateStateFromStorageEarly();
      this.tryAutoAttachCore();
      this.ensureAnnouncementLoading();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.handleResize);
      window.removeEventListener(
        "pointerdown",
        this.handleGlobalPointerDown
      );
    }
    this.removeDockStyles();
    this.detachFromCore();
  }
  firstUpdated() {
    if (typeof window === "undefined") {
      return;
    }
    if (!this._core) {
      this.tryAutoAttachCore();
    }
    this.measureContext("button");
    this.measureContext("window");
    this.contextState.button.anchor = { horizontal: "right", vertical: "top" };
    this.contextState.button.anchorOffset = { x: EDGE_MARGIN, y: EDGE_MARGIN };
    this.contextState.window.anchor = { horizontal: "right", vertical: "top" };
    this.contextState.window.anchorOffset = { x: EDGE_MARGIN, y: EDGE_MARGIN };
    this.hydrateStateFromStorage();
    if (this.isOpen && this.dockMode !== "floating") {
      this.applyDockStyles(true);
    }
    this.applyAnchorPosition("button");
    if (this.dockMode === "floating") {
      if (this.hasCustomPosition.window) {
        this.applyAnchorPosition("window");
      } else {
        this.centerContext("window");
      }
    }
    this.ensureAnnouncementLoading();
    this.updateHostTransform(this.isOpen ? "window" : "button");
  }
  render() {
    return this.isOpen ? this.renderWindow() : this.renderButton();
  }
  renderButton() {
    const buttonClasses = [
      "console-button",
      "group",
      "relative",
      "pointer-events-auto",
      "inline-flex",
      "h-12",
      "w-12",
      "items-center",
      "justify-center",
      "rounded-full",
      "border",
      "border-white/20",
      "bg-slate-950/95",
      "text-xs",
      "font-medium",
      "text-white",
      "ring-1",
      "ring-white/10",
      "backdrop-blur-md",
      "transition",
      "hover:border-white/30",
      "hover:bg-slate-900/95",
      "hover:scale-105",
      "focus-visible:outline",
      "focus-visible:outline-2",
      "focus-visible:outline-offset-2",
      "focus-visible:outline-rose-500",
      "touch-none",
      "select-none",
      this.isDragging ? "cursor-grabbing" : "cursor-grab"
    ].join(" ");
    return b`
      <button
        class=${buttonClasses}
        type="button"
        aria-label="Web Inspector"
        data-drag-context="button"
        data-dragging=${this.isDragging && this.pointerContext === "button" ? "true" : "false"}
        @pointerdown=${this.handlePointerDown}
        @pointermove=${this.handlePointerMove}
        @pointerup=${this.handlePointerUp}
        @pointercancel=${this.handlePointerCancel}
        @click=${this.handleButtonClick}
      >
        ${this.renderAnnouncementPreview()}
        <img
          src=${inspector_logo_icon_default}
          alt="Inspector logo"
          class="h-5 w-auto"
          loading="lazy"
        />
      </button>
    `;
  }
  renderWindow() {
    const windowState = this.contextState.window;
    const isDocked = this.dockMode !== "floating";
    const isTransitioning = this.hasAttribute("data-transitioning");
    const windowStyles = isDocked ? this.getDockedWindowStyles() : {
      width: `${Math.round(windowState.size.width)}px`,
      height: `${Math.round(windowState.size.height)}px`,
      minWidth: `${MIN_WINDOW_WIDTH}px`,
      minHeight: `${MIN_WINDOW_HEIGHT}px`
    };
    const hasContextDropdown = this.contextOptions.length > 0;
    const contextDropdown = hasContextDropdown ? this.renderContextDropdown() : A;
    const coreStatus = this.getCoreStatusSummary();
    const agentSelector = hasContextDropdown ? contextDropdown : b`
          <div
            class="flex items-center gap-2 rounded-md border border-dashed border-gray-200 px-2 py-1 text-xs text-gray-400"
          >
            <span>${this.renderIcon("Bot")}</span>
            <span class="truncate">No agents available</span>
          </div>
        `;
    return b`
      <section
        class="inspector-window pointer-events-auto relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-gray-900 shadow-lg"
        style=${o$1(windowStyles)}
        data-docked=${isDocked}
        data-transitioning=${isTransitioning}
      >
        ${isDocked ? b`
              <div
                class="dock-resize-handle pointer-events-auto"
                role="presentation"
                aria-hidden="true"
                @pointerdown=${this.handleResizePointerDown}
                @pointermove=${this.handleResizePointerMove}
                @pointerup=${this.handleResizePointerUp}
                @pointercancel=${this.handleResizePointerCancel}
              ></div>
            ` : A}
        <div
          class="flex flex-1 flex-col overflow-hidden bg-white text-gray-800"
        >
          <div
            class="drag-handle relative z-30 flex flex-col border-b border-gray-200 bg-white/95 backdrop-blur-sm ${isDocked ? "" : this.isDragging && this.pointerContext === "window" ? "cursor-grabbing" : "cursor-grab"}"
            data-drag-context="window"
            @pointerdown=${isDocked ? void 0 : this.handlePointerDown}
            @pointermove=${isDocked ? void 0 : this.handlePointerMove}
            @pointerup=${isDocked ? void 0 : this.handlePointerUp}
            @pointercancel=${isDocked ? void 0 : this.handlePointerCancel}
          >
            <div class="flex flex-wrap items-center gap-3 px-4 py-3">
              <div class="flex items-center min-w-0">
                <img
                  src=${inspector_logo_default}
                  alt="Inspector logo"
                  class="h-6 w-auto"
                  loading="lazy"
                />
              </div>
              <div class="ml-auto flex min-w-0 items-center gap-2">
                <div class="min-w-[160px] max-w-xs">${agentSelector}</div>
                <div class="flex items-center gap-1">
                  ${this.renderDockControls()}
                  <button
                    class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
                    type="button"
                    aria-label="Close Web Inspector"
                    @pointerdown=${this.handleClosePointerDown}
                    @click=${this.handleCloseClick}
                  >
                    ${this.renderIcon("X")}
                  </button>
                </div>
              </div>
            </div>
            <div
              class="flex flex-wrap items-center gap-2 border-t border-gray-100 px-3 py-2 text-xs"
            >
              ${this.menuItems.map(({ key, label, icon }) => {
      const isSelected = this.selectedMenu === key;
      const tabClasses = [
        "inline-flex items-center gap-2 rounded-md px-3 py-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-300",
        isSelected ? "bg-gray-900 text-white shadow-sm" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      ].join(" ");
      return b`
                  <button
                    type="button"
                    class=${tabClasses}
                    aria-pressed=${isSelected}
                    @click=${() => this.handleMenuSelect(key)}
                  >
                    <span
                      class="text-gray-400 ${isSelected ? "text-white" : ""}"
                    >
                      ${this.renderIcon(icon)}
                    </span>
                    <span>${label}</span>
                  </button>
                `;
    })}
            </div>
          </div>
          <div class="flex flex-1 flex-col overflow-hidden">
            <div class="flex-1 overflow-auto">
              ${this.renderAnnouncementPanel()}
              ${this.renderCoreWarningBanner()} ${this.renderMainContent()}
              <slot></slot>
            </div>
            <div class="border-t border-gray-200 bg-gray-50 px-4 py-2">
              <div
                class="flex items-center gap-2 rounded-md px-3 py-2 text-xs ${coreStatus.tone} w-full overflow-hidden my-1"
                title=${coreStatus.description}
              >
                <span
                  class="flex h-6 w-6 items-center justify-center rounded bg-white/60"
                >
                  ${this.renderIcon("Activity")}
                </span>
                <span class="font-medium">${coreStatus.label}</span>
                <span class="truncate text-[11px] opacity-80"
                  >${coreStatus.description}</span
                >
              </div>
            </div>
          </div>
        </div>
        <div
          class="resize-handle pointer-events-auto absolute bottom-1 right-1 flex h-5 w-5 cursor-nwse-resize items-center justify-center text-gray-400 transition hover:text-gray-600"
          role="presentation"
          aria-hidden="true"
          @pointerdown=${this.handleResizePointerDown}
          @pointermove=${this.handleResizePointerMove}
          @pointerup=${this.handleResizePointerUp}
          @pointercancel=${this.handleResizePointerCancel}
        >
          <svg
            class="h-3 w-3"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="1.5"
          >
            <path d="M5 15L15 5" />
            <path d="M9 15L15 9" />
          </svg>
        </div>
      </section>
    `;
  }
  hydrateStateFromStorageEarly() {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }
    const persisted = loadInspectorState(INSPECTOR_STORAGE_KEY);
    if (!persisted) {
      return;
    }
    if (typeof persisted.isOpen === "boolean") {
      this.isOpen = persisted.isOpen;
    }
    if (isValidDockMode(persisted.dockMode)) {
      this.dockMode = persisted.dockMode;
    }
    if (typeof persisted.selectedMenu === "string") {
      const validMenu = this.menuItems.find(
        (item) => item.key === persisted.selectedMenu
      );
      if (validMenu) {
        this.selectedMenu = validMenu.key;
      }
    }
    if (typeof persisted.selectedContext === "string") {
      this.selectedContext = persisted.selectedContext;
      this.pendingSelectedContext = persisted.selectedContext;
    }
  }
  hydrateStateFromStorage() {
    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }
    const persisted = loadInspectorState(INSPECTOR_STORAGE_KEY);
    if (!persisted) {
      return;
    }
    const persistedButton = persisted.button;
    if (persistedButton) {
      if (isValidAnchor(persistedButton.anchor)) {
        this.contextState.button.anchor = persistedButton.anchor;
      }
      if (isValidPosition(persistedButton.anchorOffset)) {
        this.contextState.button.anchorOffset = persistedButton.anchorOffset;
      }
      if (typeof persistedButton.hasCustomPosition === "boolean") {
        this.hasCustomPosition.button = persistedButton.hasCustomPosition;
      }
    }
    const persistedWindow = persisted.window;
    if (persistedWindow) {
      if (isValidAnchor(persistedWindow.anchor)) {
        this.contextState.window.anchor = persistedWindow.anchor;
      }
      if (isValidPosition(persistedWindow.anchorOffset)) {
        this.contextState.window.anchorOffset = persistedWindow.anchorOffset;
      }
      if (isValidSize(persistedWindow.size)) {
        this.contextState.window.size = this.clampWindowSize(
          persistedWindow.size
        );
      }
      if (typeof persistedWindow.hasCustomPosition === "boolean") {
        this.hasCustomPosition.window = persistedWindow.hasCustomPosition;
      }
    }
    if (typeof persisted.selectedContext === "string") {
      this.selectedContext = persisted.selectedContext;
      this.pendingSelectedContext = persisted.selectedContext;
    }
  }
  get activeContext() {
    return this.isOpen ? "window" : "button";
  }
  measureContext(context) {
    const selector = context === "window" ? ".inspector-window" : ".console-button";
    const element = this.renderRoot?.querySelector(
      selector
    );
    if (!element) {
      return;
    }
    const fallback = context === "window" ? DEFAULT_WINDOW_SIZE : DEFAULT_BUTTON_SIZE;
    updateSizeFromElement(this.contextState[context], element, fallback);
  }
  centerContext(context) {
    if (typeof window === "undefined") {
      return;
    }
    const viewport = this.getViewportSize();
    centerContext(this.contextState[context], viewport, EDGE_MARGIN);
    if (context === this.activeContext) {
      this.updateHostTransform(context);
    }
    this.hasCustomPosition[context] = false;
    this.persistState();
  }
  ensureWindowPlacement() {
    if (typeof window === "undefined") {
      return;
    }
    if (!this.hasCustomPosition.window) {
      this.centerContext("window");
      return;
    }
    const viewport = this.getViewportSize();
    keepPositionWithinViewport(this.contextState.window, viewport, EDGE_MARGIN);
    updateAnchorFromPosition(
      this.contextState.window,
      viewport,
      EDGE_MARGIN
    );
    this.updateHostTransform("window");
    this.persistState();
  }
  constrainToViewport(position, context) {
    if (typeof window === "undefined") {
      return position;
    }
    const viewport = this.getViewportSize();
    return constrainToViewport(
      this.contextState[context],
      position,
      viewport,
      EDGE_MARGIN
    );
  }
  keepPositionWithinViewport(context) {
    if (typeof window === "undefined") {
      return;
    }
    const viewport = this.getViewportSize();
    keepPositionWithinViewport(
      this.contextState[context],
      viewport,
      EDGE_MARGIN
    );
  }
  getViewportSize() {
    if (typeof window === "undefined") {
      return { ...DEFAULT_WINDOW_SIZE };
    }
    return { width: window.innerWidth, height: window.innerHeight };
  }
  persistState() {
    const state = {
      button: {
        anchor: this.contextState.button.anchor,
        anchorOffset: this.contextState.button.anchorOffset,
        hasCustomPosition: this.hasCustomPosition.button
      },
      window: {
        anchor: this.contextState.window.anchor,
        anchorOffset: this.contextState.window.anchorOffset,
        size: {
          width: Math.round(this.contextState.window.size.width),
          height: Math.round(this.contextState.window.size.height)
        },
        hasCustomPosition: this.hasCustomPosition.window
      },
      isOpen: this.isOpen,
      dockMode: this.dockMode,
      selectedMenu: this.selectedMenu,
      selectedContext: this.selectedContext
    };
    saveInspectorState(INSPECTOR_STORAGE_KEY, state);
    this.pendingSelectedContext = state.selectedContext ?? null;
  }
  clampWindowSize(size) {
    const minWidth = this.dockMode === "docked-left" ? MIN_WINDOW_WIDTH_DOCKED_LEFT : MIN_WINDOW_WIDTH;
    if (typeof window === "undefined") {
      return {
        width: Math.max(minWidth, size.width),
        height: Math.max(MIN_WINDOW_HEIGHT, size.height)
      };
    }
    const viewport = this.getViewportSize();
    return clampSize(
      size,
      viewport,
      EDGE_MARGIN,
      minWidth,
      MIN_WINDOW_HEIGHT
    );
  }
  setDockMode(mode) {
    if (this.dockMode === mode) {
      return;
    }
    this.startHostTransition();
    this.removeDockStyles();
    this.dockMode = mode;
    if (mode !== "floating") {
      if (mode === "docked-left") {
        this.contextState.window.size.width = DOCKED_LEFT_WIDTH;
      }
      this.applyDockStyles();
    } else {
      this.contextState.window.size = { ...DEFAULT_WINDOW_SIZE };
      this.centerContext("window");
    }
    this.persistState();
    this.requestUpdate();
    this.updateHostTransform("window");
  }
  startHostTransition(duration = 300) {
    this.setAttribute("data-transitioning", "true");
    if (this.transitionTimeoutId !== null) {
      clearTimeout(this.transitionTimeoutId);
    }
    this.transitionTimeoutId = setTimeout(() => {
      this.removeAttribute("data-transitioning");
      this.transitionTimeoutId = null;
    }, duration);
  }
  applyDockStyles(skipTransition = false) {
    if (typeof document === "undefined" || !document.body) {
      return;
    }
    const computedStyle = window.getComputedStyle(document.body);
    this.previousBodyMargins = {
      left: computedStyle.marginLeft,
      bottom: computedStyle.marginBottom
    };
    if (!this.isResizing && !skipTransition) {
      document.body.style.transition = "margin 300ms ease";
    }
    if (this.dockMode === "docked-left") {
      document.body.style.marginLeft = `${this.contextState.window.size.width}px`;
    }
    if (!this.isResizing && !skipTransition) {
      setTimeout(() => {
        if (document.body) {
          document.body.style.transition = "";
        }
      }, 300);
    }
  }
  removeDockStyles() {
    if (typeof document === "undefined" || !document.body) {
      return;
    }
    if (!this.isResizing) {
      document.body.style.transition = "margin 300ms ease";
    }
    if (this.previousBodyMargins) {
      document.body.style.marginLeft = this.previousBodyMargins.left;
      document.body.style.marginBottom = this.previousBodyMargins.bottom;
      this.previousBodyMargins = null;
    } else {
      document.body.style.marginLeft = "";
      document.body.style.marginBottom = "";
    }
    setTimeout(() => {
      if (document.body) {
        document.body.style.transition = "";
      }
    }, 300);
  }
  updateHostTransform(context = this.activeContext) {
    if (context !== this.activeContext) {
      return;
    }
    if (this.isOpen && this.dockMode === "docked-left") {
      this.style.transform = `translate3d(0, 0, 0)`;
    } else {
      const { position } = this.contextState[context];
      this.style.transform = `translate3d(${position.x}px, ${position.y}px, 0)`;
    }
  }
  setDragging(value) {
    if (this.isDragging !== value) {
      this.isDragging = value;
      this.requestUpdate();
    }
  }
  updateAnchorFromPosition(context) {
    if (typeof window === "undefined") {
      return;
    }
    const viewport = this.getViewportSize();
    updateAnchorFromPosition(
      this.contextState[context],
      viewport,
      EDGE_MARGIN
    );
  }
  snapButtonToCorner() {
    if (typeof window === "undefined") {
      return;
    }
    const viewport = this.getViewportSize();
    const state = this.contextState.button;
    const centerX = state.position.x + state.size.width / 2;
    const centerY = state.position.y + state.size.height / 2;
    const horizontal = centerX < viewport.width / 2 ? "left" : "right";
    const vertical = centerY < viewport.height / 2 ? "top" : "bottom";
    state.anchor = { horizontal, vertical };
    state.anchorOffset = { x: EDGE_MARGIN, y: EDGE_MARGIN };
    this.startHostTransition();
    this.applyAnchorPosition("button");
  }
  applyAnchorPosition(context) {
    if (typeof window === "undefined") {
      return;
    }
    const viewport = this.getViewportSize();
    applyAnchorPosition(
      this.contextState[context],
      viewport,
      EDGE_MARGIN
    );
    this.updateHostTransform(context);
    this.persistState();
  }
  resetResizeTracking() {
    this.resizePointerId = null;
    this.resizeStart = null;
    this.resizeInitialSize = null;
    this.isResizing = false;
  }
  resetPointerTracking() {
    this.pointerId = null;
    this.dragStart = null;
    this.pointerContext = null;
    this.setDragging(false);
    this.draggedDuringInteraction = false;
  }
  openInspector() {
    if (this.isOpen) {
      return;
    }
    this.showAnnouncementPreview = false;
    this.ensureAnnouncementLoading();
    this.isOpen = true;
    this.persistState();
    if (this.dockMode !== "floating") {
      this.applyDockStyles();
    }
    this.ensureWindowPlacement();
    this.requestUpdate();
    void this.updateComplete.then(() => {
      this.measureContext("window");
      if (this.dockMode === "floating") {
        if (this.hasCustomPosition.window) {
          this.applyAnchorPosition("window");
        } else {
          this.centerContext("window");
        }
      } else {
        this.updateHostTransform("window");
      }
    });
  }
  closeInspector() {
    if (!this.isOpen) {
      return;
    }
    this.isOpen = false;
    if (this.dockMode !== "floating") {
      this.removeDockStyles();
    }
    this.persistState();
    this.updateHostTransform("button");
    this.requestUpdate();
    void this.updateComplete.then(() => {
      this.measureContext("button");
      this.applyAnchorPosition("button");
    });
  }
  renderIcon(name) {
    const iconNode = icons[name];
    if (!iconNode) {
      return A;
    }
    const svgAttrs = {
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": "1.5",
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      class: "h-3.5 w-3.5"
    };
    const svgMarkup = `<svg ${this.serializeAttributes(svgAttrs)}>${iconNode.map(([tag2, attrs]) => `<${tag2} ${this.serializeAttributes(attrs)} />`).join("")}</svg>`;
    return o(svgMarkup);
  }
  renderDockControls() {
    if (this.dockMode === "floating") {
      return b`
        <button
          class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          type="button"
          aria-label="Dock to left"
          title="Dock Left"
          @click=${() => this.handleDockClick("docked-left")}
        >
          ${this.renderIcon("PanelLeft")}
        </button>
      `;
    } else {
      return b`
        <button
          class="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
          type="button"
          aria-label="Float window"
          title="Float"
          @click=${() => this.handleDockClick("floating")}
        >
          ${this.renderIcon("Maximize2")}
        </button>
      `;
    }
  }
  getDockedWindowStyles() {
    if (this.dockMode === "docked-left") {
      return {
        position: "fixed",
        top: "0",
        left: "0",
        bottom: "0",
        width: `${Math.round(this.contextState.window.size.width)}px`,
        height: "100vh",
        minWidth: `${MIN_WINDOW_WIDTH_DOCKED_LEFT}px`,
        borderRadius: "0"
      };
    }
    return {
      width: `${Math.round(this.contextState.window.size.width)}px`,
      height: `${Math.round(this.contextState.window.size.height)}px`,
      minWidth: `${MIN_WINDOW_WIDTH}px`,
      minHeight: `${MIN_WINDOW_HEIGHT}px`
    };
  }
  handleDockClick(mode) {
    this.setDockMode(mode);
  }
  serializeAttributes(attributes) {
    return Object.entries(attributes).filter(
      ([key, value]) => key !== "key" && value !== void 0 && value !== null && value !== ""
    ).map(
      ([key, value]) => `${key}="${String(value).replace(/"/g, "&quot;")}"`
    ).join(" ");
  }
  sanitizeForLogging(value, depth = 0, seen = /* @__PURE__ */ new WeakSet()) {
    if (value === void 0) {
      return "[undefined]";
    }
    if (value === null || typeof value === "number" || typeof value === "boolean") {
      return value;
    }
    if (typeof value === "string") {
      return value;
    }
    if (typeof value === "bigint" || typeof value === "symbol" || typeof value === "function") {
      return String(value);
    }
    if (value instanceof Date) {
      return value.toISOString();
    }
    if (Array.isArray(value)) {
      if (depth >= 4) {
        return "[Truncated depth]";
      }
      return value.map(
        (item) => this.sanitizeForLogging(item, depth + 1, seen)
      );
    }
    if (typeof value === "object") {
      if (seen.has(value)) {
        return "[Circular]";
      }
      seen.add(value);
      if (depth >= 4) {
        return "[Truncated depth]";
      }
      const result = {};
      for (const [key, entry] of Object.entries(
        value
      )) {
        result[key] = this.sanitizeForLogging(entry, depth + 1, seen);
      }
      return result;
    }
    return String(value);
  }
  normalizeEventPayload(_type, payload) {
    if (payload && typeof payload === "object" && "event" in payload) {
      const { event, ...rest } = payload;
      const cleaned = Object.keys(rest).length === 0 ? event : { event, ...rest };
      return this.sanitizeForLogging(cleaned);
    }
    return this.sanitizeForLogging(payload);
  }
  normalizeMessageContent(content) {
    if (typeof content === "string") {
      return content;
    }
    if (content && typeof content === "object" && "text" in content) {
      const maybeText = content.text;
      if (typeof maybeText === "string") {
        return maybeText;
      }
    }
    if (content === null || content === void 0) {
      return "";
    }
    if (typeof content === "object") {
      try {
        return JSON.stringify(this.sanitizeForLogging(content));
      } catch {
        return "";
      }
    }
    return String(content);
  }
  normalizeToolCalls(raw) {
    if (!Array.isArray(raw)) {
      return [];
    }
    return raw.map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }
      const call = entry;
      const fn = call.function;
      const functionName = typeof fn?.name === "string" ? fn.name : typeof call.toolName === "string" ? call.toolName : void 0;
      const args = fn && "arguments" in fn ? fn.arguments : call.arguments;
      const normalized = {
        id: typeof call.id === "string" ? call.id : void 0,
        toolName: typeof call.toolName === "string" ? call.toolName : functionName,
        status: typeof call.status === "string" ? call.status : void 0
      };
      if (functionName) {
        normalized.function = {
          name: functionName,
          arguments: this.sanitizeForLogging(args)
        };
      }
      return normalized;
    }).filter((call) => Boolean(call));
  }
  normalizeAgentMessage(message) {
    if (!message || typeof message !== "object") {
      return null;
    }
    const raw = message;
    const role = typeof raw.role === "string" ? raw.role : "unknown";
    const contentText = this.normalizeMessageContent(raw.content);
    const toolCalls = this.normalizeToolCalls(raw.toolCalls);
    return {
      id: typeof raw.id === "string" ? raw.id : void 0,
      role,
      contentText,
      contentRaw: raw.content !== void 0 ? this.sanitizeForLogging(raw.content) : void 0,
      toolCalls
    };
  }
  normalizeAgentMessages(messages) {
    if (!Array.isArray(messages)) {
      return null;
    }
    const normalized = messages.map((message) => this.normalizeAgentMessage(message)).filter((msg) => msg !== null);
    return normalized;
  }
  normalizeContextStore(context) {
    if (!context || typeof context !== "object") {
      return {};
    }
    const normalized = {};
    for (const [key, entry] of Object.entries(context)) {
      if (entry && typeof entry === "object" && "value" in entry) {
        const candidate = entry;
        const description = typeof candidate.description === "string" && candidate.description.trim().length > 0 ? candidate.description : void 0;
        normalized[key] = { description, value: candidate.value };
      } else {
        normalized[key] = { value: entry };
      }
    }
    return normalized;
  }
  getSelectedMenu() {
    const found = this.menuItems.find((item) => item.key === this.selectedMenu);
    return found ?? this.menuItems[0];
  }
  renderCoreWarningBanner() {
    if (this._core) {
      return A;
    }
    return b`
      <div
        class="mx-4 my-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800"
      >
        <span class="mt-0.5 shrink-0 text-amber-600"
          >${this.renderIcon("AlertTriangle")}</span
        >
        <div class="space-y-1">
          <div class="font-semibold text-amber-900">
            CopilotKit core not attached
          </div>
          <p class="text-[11px] leading-snug text-amber-800">
            Pass a live <code>CopilotKitCore</code> instance to
            <code>&lt;cpk-web-inspector&gt;</code> or expose it on
            <code>window.__COPILOTKIT_CORE__</code> for auto-attach.
          </p>
        </div>
      </div>
    `;
  }
  getCoreStatusSummary() {
    if (!this._core) {
      return {
        label: "Core not attached",
        tone: "border border-amber-200 bg-amber-50 text-amber-800",
        description: "Pass a CopilotKitCore instance to <cpk-web-inspector> or enable auto-attach."
      };
    }
    const status = this.runtimeStatus ?? CopilotKitCoreRuntimeConnectionStatus.Disconnected;
    const lastErrorMessage = this.lastCoreError?.message;
    if (status === CopilotKitCoreRuntimeConnectionStatus.Error) {
      return {
        label: "Runtime error",
        tone: "border border-rose-200 bg-rose-50 text-rose-700",
        description: lastErrorMessage ?? "CopilotKit runtime reported an error."
      };
    }
    if (status === CopilotKitCoreRuntimeConnectionStatus.Connecting) {
      return {
        label: "Connecting",
        tone: "border border-amber-200 bg-amber-50 text-amber-800",
        description: "Waiting for CopilotKit runtime to finish connecting."
      };
    }
    if (status === CopilotKitCoreRuntimeConnectionStatus.Connected) {
      return {
        label: "Connected",
        tone: "border border-emerald-200 bg-emerald-50 text-emerald-700",
        description: "Live runtime connection established."
      };
    }
    return {
      label: "Disconnected",
      tone: "border border-gray-200 bg-gray-50 text-gray-700",
      description: lastErrorMessage ?? "Waiting for CopilotKit runtime to connect."
    };
  }
  renderMainContent() {
    if (this.selectedMenu === "ag-ui-events") {
      return this.renderEventsTable();
    }
    if (this.selectedMenu === "agents") {
      return this.renderAgentsView();
    }
    if (this.selectedMenu === "frontend-tools") {
      return this.renderToolsView();
    }
    if (this.selectedMenu === "agent-context") {
      return this.renderContextView();
    }
    return A;
  }
  renderEventsTable() {
    const events = this.getEventsForSelectedContext();
    const filteredEvents = this.filterEvents(events);
    const selectedLabel = this.selectedContext === "all-agents" ? "all agents" : `agent ${this.selectedContext}`;
    if (events.length === 0) {
      return b`
        <div
          class="flex h-full items-center justify-center px-4 py-8 text-center"
        >
          <div class="max-w-md">
            <div
              class="mb-3 flex justify-center text-gray-300 [&>svg]:!h-8 [&>svg]:!w-8"
            >
              ${this.renderIcon("Zap")}
            </div>
            <p class="text-sm text-gray-600">No events yet</p>
            <p class="mt-2 text-xs text-gray-500">
              Trigger an agent run to see live activity.
            </p>
          </div>
        </div>
      `;
    }
    if (filteredEvents.length === 0) {
      return b`
        <div
          class="flex h-full items-center justify-center px-4 py-8 text-center"
        >
          <div class="max-w-md space-y-3">
            <div
              class="flex justify-center text-gray-300 [&>svg]:!h-8 [&>svg]:!w-8"
            >
              ${this.renderIcon("Filter")}
            </div>
            <p class="text-sm text-gray-600">
              No events match the current filters.
            </p>
            <div>
              <button
                type="button"
                class="inline-flex items-center gap-1 rounded-md bg-gray-900 px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-gray-800"
                @click=${this.resetEventFilters}
              >
                ${this.renderIcon("RefreshCw")}
                <span>Reset filters</span>
              </button>
            </div>
          </div>
        </div>
      `;
    }
    return b`
      <div class="flex h-full flex-col">
        <div
          class="flex flex-col gap-1.5 border-b border-gray-200 bg-white px-4 py-2.5"
        >
          <div class="flex flex-wrap items-center gap-2">
            <div class="relative min-w-[200px] flex-1">
              <input
                type="search"
                class="w-full rounded-md border border-gray-200 px-3 py-1.5 text-[11px] text-gray-700 shadow-sm outline-none ring-1 ring-transparent transition focus:border-gray-300 focus:ring-gray-200"
                placeholder="Search agent, type, payload"
                .value=${this.eventFilterText}
                @input=${this.handleEventFilterInput}
              />
            </div>
            <select
              class="w-40 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-[11px] text-gray-700 shadow-sm outline-none transition focus:border-gray-300 focus:ring-2 focus:ring-gray-200"
              .value=${this.eventTypeFilter}
              @change=${this.handleEventTypeChange}
            >
              <option value="all">All event types</option>
              ${AGENT_EVENT_TYPES.map(
      (type) => b`<option value=${type}>
                    ${type.toLowerCase().replace(/_/g, " ")}
                  </option>`
    )}
            </select>
            <div class="flex items-center gap-1 text-[11px]">
              <button
                type="button"
                class="tooltip-target flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Reset filters"
                data-tooltip="Reset filters"
                aria-label="Reset filters"
                @click=${this.resetEventFilters}
                ?disabled=${!this.eventFilterText && this.eventTypeFilter === "all"}
              >
                ${this.renderIcon("RotateCw")}
              </button>
              <button
                type="button"
                class="tooltip-target flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Export JSON"
                data-tooltip="Export JSON"
                aria-label="Export JSON"
                @click=${() => this.exportEvents(filteredEvents)}
                ?disabled=${filteredEvents.length === 0}
              >
                ${this.renderIcon("Download")}
              </button>
              <button
                type="button"
                class="tooltip-target flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                title="Clear events"
                data-tooltip="Clear events"
                aria-label="Clear events"
                @click=${this.handleClearEvents}
                ?disabled=${events.length === 0}
              >
                ${this.renderIcon("Trash2")}
              </button>
            </div>
          </div>
          <div class="text-[11px] text-gray-500">
            Showing ${filteredEvents.length} of
            ${events.length}${this.selectedContext === "all-agents" ? "" : ` for ${selectedLabel}`}
          </div>
        </div>
        <div class="relative h-full w-full overflow-y-auto overflow-x-hidden">
          <table class="w-full table-fixed border-collapse text-xs box-border">
            <thead class="sticky top-0 z-10">
              <tr class="bg-white">
                <th
                  class="border-b border-gray-200 bg-white px-3 py-2 text-left font-medium text-gray-900"
                >
                  Agent
                </th>
                <th
                  class="border-b border-gray-200 bg-white px-3 py-2 text-left font-medium text-gray-900"
                >
                  Time
                </th>
                <th
                  class="border-b border-gray-200 bg-white px-3 py-2 text-left font-medium text-gray-900"
                >
                  Event Type
                </th>
                <th
                  class="border-b border-gray-200 bg-white px-3 py-2 text-left font-medium text-gray-900"
                >
                  AG-UI Event
                </th>
              </tr>
            </thead>
            <tbody>
              ${filteredEvents.map((event, index) => {
      const rowBg = index % 2 === 0 ? "bg-white" : "bg-gray-50/50";
      const badgeClasses = this.getEventBadgeClasses(event.type);
      const extractedEvent = this.extractEventFromPayload(
        event.payload
      );
      const inlineEvent = this.stringifyPayload(extractedEvent, false) || "—";
      const prettyEvent = this.stringifyPayload(extractedEvent, true) || inlineEvent;
      const isExpanded = this.expandedRows.has(event.id);
      return b`
                  <tr
                    class="${rowBg} cursor-pointer transition hover:bg-blue-50/50"
                    @click=${() => this.toggleRowExpansion(event.id)}
                  >
                    <td
                      class="border-l border-r border-b border-gray-200 px-3 py-2"
                    >
                      <span class="font-mono text-[11px] text-gray-600"
                        >${event.agentId}</span
                      >
                    </td>
                    <td
                      class="border-r border-b border-gray-200 px-3 py-2 font-mono text-[11px] text-gray-600"
                    >
                      <span title=${new Date(event.timestamp).toLocaleString()}>
                        ${new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </td>
                    <td class="border-r border-b border-gray-200 px-3 py-2">
                      <span class=${badgeClasses}>${event.type}</span>
                    </td>
                    <td
                      class="border-r border-b border-gray-200 px-3 py-2 font-mono text-[10px] text-gray-600 ${isExpanded ? "" : "truncate max-w-xs"}"
                    >
                      ${isExpanded ? b`
                            <div class="group relative">
                              <pre
                                class="m-0 whitespace-pre-wrap break-words text-[10px] font-mono text-gray-600"
                              >
${prettyEvent}</pre
                              >
                              <button
                                class="absolute right-0 top-0 cursor-pointer rounded px-2 py-1 text-[10px] opacity-0 transition group-hover:opacity-100 ${this.copiedEvents.has(
        event.id
      ) ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-900"}"
                                @click=${(e2) => {
        e2.stopPropagation();
        this.copyToClipboard(prettyEvent, event.id);
      }}
                              >
                                ${this.copiedEvents.has(event.id) ? b`<span>✓ Copied</span>` : b`<span>Copy</span>`}
                              </button>
                            </div>
                          ` : inlineEvent}
                    </td>
                  </tr>
                `;
    })}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }
  handleEventFilterInput(event) {
    const target = event.target;
    this.eventFilterText = target?.value ?? "";
    this.requestUpdate();
  }
  handleEventTypeChange(event) {
    const target = event.target;
    const value = target?.value;
    if (!value) {
      return;
    }
    this.eventTypeFilter = value;
    this.requestUpdate();
  }
  resetEventFilters() {
    this.eventFilterText = "";
    this.eventTypeFilter = "all";
    this.requestUpdate();
  }
  exportEvents(events) {
    try {
      const payload = JSON.stringify(events, null, 2);
      const blob = new Blob([payload], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `copilotkit-events-${Date.now()}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export events", error);
    }
  }
  renderAgentsView() {
    if (this.selectedContext === "all-agents") {
      return b`
        <div
          class="flex h-full items-center justify-center px-4 py-8 text-center"
        >
          <div class="max-w-md">
            <div
              class="mb-3 flex justify-center text-gray-300 [&>svg]:!h-8 [&>svg]:!w-8"
            >
              ${this.renderIcon("Bot")}
            </div>
            <p class="text-sm text-gray-600">No agent selected</p>
            <p class="mt-2 text-xs text-gray-500">
              Select an agent from the dropdown above to view details.
            </p>
          </div>
        </div>
      `;
    }
    const agentId = this.selectedContext;
    const status = this.getAgentStatus(agentId);
    const stats = this.getAgentStats(agentId);
    const state = this.getLatestStateForAgent(agentId);
    const messages = this.getLatestMessagesForAgent(agentId);
    const statusColors = {
      running: "bg-emerald-50 text-emerald-700",
      idle: "bg-gray-100 text-gray-600",
      error: "bg-rose-50 text-rose-700"
    };
    return b`
      <div class="flex flex-col gap-4 p-4 overflow-auto">
        <!-- Agent Overview Card -->
        <div class="rounded-lg border border-gray-200 bg-white p-4">
          <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600"
              >
                ${this.renderIcon("Bot")}
              </div>
              <div>
                <h3 class="font-semibold text-sm text-gray-900">${agentId}</h3>
                <span
                  class="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusColors[status]} relative -translate-y-[2px]"
                >
                  <span
                    class="h-1.5 w-1.5 rounded-full ${status === "running" ? "bg-emerald-500 animate-pulse" : status === "error" ? "bg-rose-500" : "bg-gray-400"}"
                  ></span>
                  ${status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>
            ${stats.lastActivity ? b`<span class="text-xs text-gray-500"
                  >Last activity:
                  ${new Date(stats.lastActivity).toLocaleTimeString()}</span
                >` : A}
          </div>
          <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            <button
              type="button"
              class="rounded-md bg-gray-50 px-3 py-2 text-left transition hover:bg-gray-100 cursor-pointer overflow-hidden"
              @click=${() => this.handleMenuSelect("ag-ui-events")}
              title="View all events in AG-UI Events"
            >
              <div class="truncate whitespace-nowrap text-xs text-gray-600">
                Total Events
              </div>
              <div class="text-lg font-semibold text-gray-900">
                ${stats.totalEvents}
              </div>
            </button>
            <div class="rounded-md bg-gray-50 px-3 py-2 overflow-hidden">
              <div class="truncate whitespace-nowrap text-xs text-gray-600">
                Messages
              </div>
              <div class="text-lg font-semibold text-gray-900">
                ${stats.messages}
              </div>
            </div>
            <div class="rounded-md bg-gray-50 px-3 py-2 overflow-hidden">
              <div class="truncate whitespace-nowrap text-xs text-gray-600">
                Tool Calls
              </div>
              <div class="text-lg font-semibold text-gray-900">
                ${stats.toolCalls}
              </div>
            </div>
            <div class="rounded-md bg-gray-50 px-3 py-2 overflow-hidden">
              <div class="truncate whitespace-nowrap text-xs text-gray-600">
                Errors
              </div>
              <div class="text-lg font-semibold text-gray-900">
                ${stats.errors}
              </div>
            </div>
          </div>
        </div>

        <!-- Current State Section -->
        <div class="rounded-lg border border-gray-200 bg-white">
          <div class="border-b border-gray-200 px-4 py-3">
            <h4 class="text-sm font-semibold text-gray-900">Current State</h4>
          </div>
          <div class="overflow-auto p-4">
            ${this.hasRenderableState(state) ? b`
                  <pre
                    class="overflow-auto rounded-md bg-gray-50 p-3 text-xs text-gray-800 max-h-64"
                  ><code>${this.formatStateForDisplay(state)}</code></pre>
                ` : b`
                  <div
                    class="flex h-40 items-center justify-center text-xs text-gray-500"
                  >
                    <div class="flex items-center gap-2 text-gray-500">
                      <span class="text-lg text-gray-400"
                        >${this.renderIcon("Database")}</span
                      >
                      <span>State is empty</span>
                    </div>
                  </div>
                `}
          </div>
        </div>

        <!-- Current Messages Section -->
        <div class="rounded-lg border border-gray-200 bg-white">
          <div class="border-b border-gray-200 px-4 py-3">
            <h4 class="text-sm font-semibold text-gray-900">
              Current Messages
            </h4>
          </div>
          <div class="overflow-auto">
            ${messages && messages.length > 0 ? b`
                  <table class="w-full text-xs">
                    <thead class="bg-gray-50">
                      <tr>
                        <th
                          class="px-4 py-2 text-left font-medium text-gray-700"
                        >
                          Role
                        </th>
                        <th
                          class="px-4 py-2 text-left font-medium text-gray-700"
                        >
                          Content
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200">
                      ${messages.map((msg) => {
      const role = msg.role || "unknown";
      const roleColors = {
        user: "bg-blue-100 text-blue-800",
        assistant: "bg-green-100 text-green-800",
        system: "bg-gray-100 text-gray-800",
        tool: "bg-amber-100 text-amber-800",
        unknown: "bg-gray-100 text-gray-600"
      };
      const rawContent = msg.contentText ?? "";
      const toolCalls = msg.toolCalls ?? [];
      const hasContent = rawContent.trim().length > 0;
      const contentFallback = toolCalls.length > 0 ? "Invoked tool call" : "—";
      return b`
                          <tr>
                            <td class="px-4 py-2 align-top">
                              <span
                                class="inline-flex rounded px-2 py-0.5 text-[10px] font-medium ${roleColors[role] || roleColors.unknown}"
                              >
                                ${role}
                              </span>
                            </td>
                            <td class="px-4 py-2">
                              ${hasContent ? b`<div
                                    class="max-w-2xl whitespace-pre-wrap break-words text-gray-700"
                                  >
                                    ${rawContent}
                                  </div>` : b`<div
                                    class="text-xs italic text-gray-400"
                                  >
                                    ${contentFallback}
                                  </div>`}
                              ${role === "assistant" && toolCalls.length > 0 ? this.renderToolCallDetails(toolCalls) : A}
                            </td>
                          </tr>
                        `;
    })}
                    </tbody>
                  </table>
                ` : b`
                  <div
                    class="flex h-40 items-center justify-center text-xs text-gray-500"
                  >
                    <div class="flex items-center gap-2 text-gray-500">
                      <span class="text-lg text-gray-400"
                        >${this.renderIcon("MessageSquare")}</span
                      >
                      <span>No messages available</span>
                    </div>
                  </div>
                `}
          </div>
        </div>
      </div>
    `;
  }
  renderContextDropdown() {
    const filteredOptions = this.selectedMenu === "agents" ? this.contextOptions.filter((opt) => opt.key !== "all-agents") : this.contextOptions;
    const selectedLabel = filteredOptions.find((opt) => opt.key === this.selectedContext)?.label ?? "";
    return b`
      <div
        class="relative z-40 min-w-0 flex-1"
        data-context-dropdown-root="true"
      >
        <button
          type="button"
          class="relative z-40 flex w-full min-w-0 max-w-[240px] items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-xs font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          @pointerdown=${this.handleContextDropdownToggle}
        >
          <span class="truncate flex-1 text-left">${selectedLabel}</span>
          <span class="shrink-0 text-gray-400"
            >${this.renderIcon("ChevronDown")}</span
          >
        </button>
        ${this.contextMenuOpen ? b`
              <div
                class="absolute left-0 z-50 mt-1.5 w-40 rounded-md border border-gray-200 bg-white py-1 shadow-md ring-1 ring-black/5"
                data-context-dropdown-root="true"
              >
                ${filteredOptions.map(
      (option) => b`
                    <button
                      type="button"
                      class="flex w-full items-center justify-between px-3 py-1.5 text-left text-xs transition hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      data-context-dropdown-root="true"
                      @click=${() => this.handleContextOptionSelect(option.key)}
                    >
                      <span
                        class="truncate ${option.key === this.selectedContext ? "text-gray-900 font-medium" : "text-gray-600"}"
                        >${option.label}</span
                      >
                      ${option.key === this.selectedContext ? b`<span class="text-gray-500"
                            >${this.renderIcon("Check")}</span
                          >` : A}
                    </button>
                  `
    )}
              </div>
            ` : A}
      </div>
    `;
  }
  handleMenuSelect(key) {
    if (!this.menuItems.some((item) => item.key === key)) {
      return;
    }
    this.selectedMenu = key;
    if (key === "agents" && this.selectedContext === "all-agents") {
      const agentOptions = this.contextOptions.filter(
        (opt) => opt.key !== "all-agents"
      );
      if (agentOptions.length > 0) {
        const defaultAgent = agentOptions.find((opt) => opt.key === "default");
        this.selectedContext = defaultAgent ? defaultAgent.key : agentOptions[0].key;
      }
    }
    this.contextMenuOpen = false;
    this.persistState();
    this.requestUpdate();
  }
  handleContextDropdownToggle(event) {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuOpen = !this.contextMenuOpen;
    this.requestUpdate();
  }
  handleContextOptionSelect(key) {
    if (!this.contextOptions.some((option) => option.key === key)) {
      return;
    }
    if (this.selectedContext !== key) {
      this.selectedContext = key;
      this.expandedRows.clear();
    }
    this.contextMenuOpen = false;
    this.persistState();
    this.requestUpdate();
  }
  renderToolsView() {
    if (!this._core) {
      return b`
        <div
          class="flex h-full items-center justify-center px-4 py-8 text-xs text-gray-500"
        >
          No core instance available
        </div>
      `;
    }
    this.refreshToolsSnapshot();
    const allTools = this.cachedTools;
    if (allTools.length === 0) {
      return b`
        <div
          class="flex h-full items-center justify-center px-4 py-8 text-center"
        >
          <div class="max-w-md">
            <div
              class="mb-3 flex justify-center text-gray-300 [&>svg]:!h-8 [&>svg]:!w-8"
            >
              ${this.renderIcon("Hammer")}
            </div>
            <p class="text-sm text-gray-600">No tools available</p>
            <p class="mt-2 text-xs text-gray-500">
              Tools will appear here once agents are configured with tool
              handlers or renderers.
            </p>
          </div>
        </div>
      `;
    }
    const filteredTools = this.selectedContext === "all-agents" ? allTools : allTools.filter(
      (tool) => !tool.agentId || tool.agentId === this.selectedContext
    );
    return b`
      <div class="flex h-full flex-col overflow-hidden">
        <div class="overflow-auto p-4">
          <div class="space-y-3">
            ${filteredTools.map((tool) => this.renderToolCard(tool))}
          </div>
        </div>
      </div>
    `;
  }
  extractToolsFromAgents() {
    if (!this._core) {
      return [];
    }
    const tools = [];
    for (const coreTool of this._core.tools ?? []) {
      tools.push({
        agentId: coreTool.agentId ?? "",
        name: coreTool.name,
        description: coreTool.description,
        parameters: coreTool.parameters,
        type: "handler"
      });
    }
    for (const [agentId, agent] of Object.entries(this._core.agents)) {
      if (!agent) continue;
      const handlers = agent.toolHandlers;
      if (handlers && typeof handlers === "object") {
        for (const [toolName, handler] of Object.entries(handlers)) {
          if (handler && typeof handler === "object") {
            const handlerObj = handler;
            tools.push({
              agentId,
              name: toolName,
              description: typeof handlerObj.description === "string" && handlerObj.description || handlerObj.tool?.description,
              parameters: handlerObj.parameters ?? handlerObj.tool?.parameters,
              type: "handler"
            });
          }
        }
      }
      const renderers = agent.toolRenderers;
      if (renderers && typeof renderers === "object") {
        for (const [toolName, renderer] of Object.entries(renderers)) {
          if (!tools.some((t2) => t2.agentId === agentId && t2.name === toolName)) {
            if (renderer && typeof renderer === "object") {
              const rendererObj = renderer;
              tools.push({
                agentId,
                name: toolName,
                description: typeof rendererObj.description === "string" && rendererObj.description || rendererObj.tool?.description,
                parameters: rendererObj.parameters ?? rendererObj.tool?.parameters,
                type: "renderer"
              });
            }
          }
        }
      }
    }
    return tools.sort((a2, b2) => {
      const agentCompare = a2.agentId.localeCompare(b2.agentId);
      if (agentCompare !== 0) return agentCompare;
      return a2.name.localeCompare(b2.name);
    });
  }
  renderToolCard(tool) {
    const isExpanded = this.expandedTools.has(`${tool.agentId}:${tool.name}`);
    const schema = this.extractSchemaInfo(tool.parameters);
    const typeColors = {
      handler: "bg-blue-50 text-blue-700 border-blue-200",
      renderer: "bg-purple-50 text-purple-700 border-purple-200"
    };
    return b`
      <div class="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <button
          type="button"
          class="w-full px-4 py-3 text-left transition hover:bg-gray-50"
          @click=${() => this.toggleToolExpansion(`${tool.agentId}:${tool.name}`)}
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-mono text-sm font-semibold text-gray-900"
                  >${tool.name}</span
                >
                <span
                  class="inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-medium ${typeColors[tool.type]}"
                >
                  ${tool.type}
                </span>
              </div>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span class="flex items-center gap-1">
                  ${this.renderIcon("Bot")}
                  <span class="font-mono">${tool.agentId}</span>
                </span>
                ${schema.properties.length > 0 ? b`
                      <span class="text-gray-300">•</span>
                      <span
                        >${schema.properties.length}
                        parameter${schema.properties.length !== 1 ? "s" : ""}</span
                      >
                    ` : A}
              </div>
              ${tool.description ? b`<p class="mt-2 text-xs text-gray-600">
                    ${tool.description}
                  </p>` : A}
            </div>
            <span
              class="shrink-0 text-gray-400 transition ${isExpanded ? "rotate-180" : ""}"
            >
              ${this.renderIcon("ChevronDown")}
            </span>
          </div>
        </button>

        ${isExpanded ? b`
              <div class="border-t border-gray-200 bg-gray-50/50 px-4 py-3">
                ${schema.properties.length > 0 ? b`
                      <h5 class="mb-3 text-xs font-semibold text-gray-700">
                        Parameters
                      </h5>
                      <div class="space-y-3">
                        ${schema.properties.map(
      (prop) => b`
                            <div
                              class="rounded-md border border-gray-200 bg-white p-3"
                            >
                              <div
                                class="flex items-start justify-between gap-2 mb-1"
                              >
                                <span
                                  class="font-mono text-xs font-medium text-gray-900"
                                  >${prop.name}</span
                                >
                                <div class="flex items-center gap-1.5 shrink-0">
                                  ${prop.required ? b`<span
                                        class="text-[9px] rounded border border-rose-200 bg-rose-50 px-1 py-0.5 font-medium text-rose-700"
                                        >required</span
                                      >` : b`<span
                                        class="text-[9px] rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-medium text-gray-600"
                                        >optional</span
                                      >`}
                                  ${prop.type ? b`<span
                                        class="text-[9px] rounded border border-gray-200 bg-gray-50 px-1 py-0.5 font-mono text-gray-600"
                                        >${prop.type}</span
                                      >` : A}
                                </div>
                              </div>
                              ${prop.description ? b`<p class="mt-1 text-xs text-gray-600">
                                    ${prop.description}
                                  </p>` : A}
                              ${prop.defaultValue !== void 0 ? b`
                                    <div
                                      class="mt-2 flex items-center gap-1.5 text-[10px] text-gray-500"
                                    >
                                      <span>Default:</span>
                                      <code
                                        class="rounded bg-gray-100 px-1 py-0.5 font-mono"
                                        >${JSON.stringify(
        prop.defaultValue
      )}</code
                                      >
                                    </div>
                                  ` : A}
                              ${prop.enum && prop.enum.length > 0 ? b`
                                    <div class="mt-2">
                                      <span class="text-[10px] text-gray-500"
                                        >Allowed values:</span
                                      >
                                      <div class="mt-1 flex flex-wrap gap-1">
                                        ${prop.enum.map(
        (val) => b`
                                            <code
                                              class="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-mono text-gray-700"
                                              >${JSON.stringify(val)}</code
                                            >
                                          `
      )}
                                      </div>
                                    </div>
                                  ` : A}
                            </div>
                          `
    )}
                      </div>
                    ` : b`
                      <div
                        class="flex items-center justify-center py-4 text-xs text-gray-500"
                      >
                        <span>No parameters defined</span>
                      </div>
                    `}
              </div>
            ` : A}
      </div>
    `;
  }
  extractSchemaInfo(parameters) {
    const result = { properties: [] };
    if (!parameters || typeof parameters !== "object") {
      return result;
    }
    const zodDef = parameters._def;
    if (zodDef && typeof zodDef === "object") {
      if (zodDef.typeName === "ZodObject") {
        const rawShape = zodDef.shape;
        const shape = typeof rawShape === "function" ? rawShape() : rawShape;
        if (!shape || typeof shape !== "object") {
          return result;
        }
        const requiredKeys = /* @__PURE__ */ new Set();
        if (zodDef.unknownKeys === "strict" || !zodDef.catchall) {
          Object.keys(shape || {}).forEach((key) => {
            const candidate = shape[key];
            const fieldDef = candidate?._def;
            if (fieldDef && !this.isZodOptional(candidate)) {
              requiredKeys.add(key);
            }
          });
        }
        for (const [key, value] of Object.entries(shape || {})) {
          const fieldInfo = this.extractZodFieldInfo(value);
          result.properties.push({
            name: key,
            type: fieldInfo.type,
            description: fieldInfo.description,
            required: requiredKeys.has(key),
            defaultValue: fieldInfo.defaultValue,
            enum: fieldInfo.enum
          });
        }
      }
    } else if (parameters.type === "object" && parameters.properties) {
      const props = parameters.properties;
      const required = new Set(
        Array.isArray(parameters.required) ? parameters.required : []
      );
      for (const [key, value] of Object.entries(props ?? {})) {
        const prop = value;
        result.properties.push({
          name: key,
          type: prop.type,
          description: typeof prop.description === "string" ? prop.description : void 0,
          required: required.has(key),
          defaultValue: prop.default,
          enum: Array.isArray(prop.enum) ? prop.enum : void 0
        });
      }
    }
    return result;
  }
  isZodOptional(zodSchema) {
    const schema = zodSchema;
    if (!schema?._def) return false;
    const def2 = schema._def;
    if (def2.typeName === "ZodOptional" || def2.typeName === "ZodNullable") {
      return true;
    }
    if (def2.defaultValue !== void 0) {
      return true;
    }
    return false;
  }
  extractZodFieldInfo(zodSchema) {
    const info = {};
    const schema = zodSchema;
    if (!schema?._def) return info;
    let currentSchema = schema;
    let def2 = currentSchema._def;
    while (def2.typeName === "ZodOptional" || def2.typeName === "ZodNullable" || def2.typeName === "ZodDefault") {
      if (def2.typeName === "ZodDefault" && def2.defaultValue !== void 0) {
        info.defaultValue = typeof def2.defaultValue === "function" ? def2.defaultValue() : def2.defaultValue;
      }
      currentSchema = def2.innerType ?? currentSchema;
      if (!currentSchema?._def) break;
      def2 = currentSchema._def;
    }
    info.description = typeof def2.description === "string" ? def2.description : void 0;
    const typeName = typeof def2.typeName === "string" ? def2.typeName : void 0;
    const typeMap = {
      ZodString: "string",
      ZodNumber: "number",
      ZodBoolean: "boolean",
      ZodArray: "array",
      ZodObject: "object",
      ZodEnum: "enum",
      ZodLiteral: "literal",
      ZodUnion: "union",
      ZodAny: "any",
      ZodUnknown: "unknown"
    };
    info.type = typeName ? typeMap[typeName] || typeName.replace("Zod", "").toLowerCase() : void 0;
    if (typeName === "ZodEnum" && Array.isArray(def2.values)) {
      info.enum = def2.values;
    } else if (typeName === "ZodLiteral" && def2.value !== void 0) {
      info.enum = [def2.value];
    }
    return info;
  }
  toggleToolExpansion(toolId) {
    if (this.expandedTools.has(toolId)) {
      this.expandedTools.delete(toolId);
    } else {
      this.expandedTools.add(toolId);
    }
    this.requestUpdate();
  }
  renderContextView() {
    const contextEntries = Object.entries(this.contextStore);
    if (contextEntries.length === 0) {
      return b`
        <div
          class="flex h-full items-center justify-center px-4 py-8 text-center"
        >
          <div class="max-w-md">
            <div
              class="mb-3 flex justify-center text-gray-300 [&>svg]:!h-8 [&>svg]:!w-8"
            >
              ${this.renderIcon("FileText")}
            </div>
            <p class="text-sm text-gray-600">No context available</p>
            <p class="mt-2 text-xs text-gray-500">
              Context will appear here once added to CopilotKit.
            </p>
          </div>
        </div>
      `;
    }
    return b`
      <div class="flex h-full flex-col overflow-hidden">
        <div class="overflow-auto p-4">
          <div class="space-y-3">
            ${contextEntries.map(
      ([id, context]) => this.renderContextCard(id, context)
    )}
          </div>
        </div>
      </div>
    `;
  }
  renderContextCard(id, context) {
    const isExpanded = this.expandedContextItems.has(id);
    const valuePreview = this.getContextValuePreview(context.value);
    const hasValue = context.value !== void 0 && context.value !== null;
    const title = context.description?.trim() || id;
    return b`
      <div class="rounded-lg border border-gray-200 bg-white overflow-hidden">
        <button
          type="button"
          class="w-full px-4 py-3 text-left transition hover:bg-gray-50"
          @click=${() => this.toggleContextExpansion(id)}
        >
          <div class="flex items-start justify-between gap-3">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 mb-1">${title}</p>
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <span
                  class="font-mono truncate inline-block align-middle"
                  style="max-width: 180px;"
                  >${id}</span
                >
                ${hasValue ? b`
                      <span class="text-gray-300">•</span>
                      <span class="truncate">${valuePreview}</span>
                    ` : A}
              </div>
            </div>
            <span
              class="shrink-0 text-gray-400 transition ${isExpanded ? "rotate-180" : ""}"
            >
              ${this.renderIcon("ChevronDown")}
            </span>
          </div>
        </button>

        ${isExpanded ? b`
              <div class="border-t border-gray-200 bg-gray-50/50 px-4 py-3">
                <div class="mb-3">
                  <h5 class="mb-1 text-xs font-semibold text-gray-700">ID</h5>
                  <code
                    class="block rounded bg-white border border-gray-200 px-2 py-1 text-[10px] font-mono text-gray-600"
                    >${id}</code
                  >
                </div>
                ${hasValue ? b`
                      <div class="mb-2 flex items-center justify-between gap-2">
                        <h5 class="text-xs font-semibold text-gray-700">
                          Value
                        </h5>
                        <button
                          class="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-medium text-gray-700 transition hover:bg-gray-50"
                          type="button"
                          @click=${(e2) => {
      e2.stopPropagation();
      void this.copyContextValue(context.value, id);
    }}
                        >
                          ${this.copiedContextItems.has(id) ? "Copied" : "Copy JSON"}
                        </button>
                      </div>
                      <div
                        class="rounded-md border border-gray-200 bg-white p-3"
                      >
                        <pre
                          class="overflow-auto text-xs text-gray-800 max-h-96"
                        ><code>${this.formatContextValue(
      context.value
    )}</code></pre>
                      </div>
                    ` : b`
                      <div
                        class="flex items-center justify-center py-4 text-xs text-gray-500"
                      >
                        <span>No value available</span>
                      </div>
                    `}
              </div>
            ` : A}
      </div>
    `;
  }
  getContextValuePreview(value) {
    if (value === void 0 || value === null) {
      return "—";
    }
    if (typeof value === "string") {
      return value.length > 50 ? `${value.substring(0, 50)}...` : value;
    }
    if (typeof value === "number" || typeof value === "boolean") {
      return String(value);
    }
    if (Array.isArray(value)) {
      return `Array(${value.length})`;
    }
    if (typeof value === "object") {
      const keys = Object.keys(value);
      return `Object with ${keys.length} key${keys.length !== 1 ? "s" : ""}`;
    }
    if (typeof value === "function") {
      return "Function";
    }
    return String(value);
  }
  formatContextValue(value) {
    if (value === void 0) {
      return "undefined";
    }
    if (value === null) {
      return "null";
    }
    if (typeof value === "function") {
      return value.toString();
    }
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }
  async copyContextValue(value, contextId) {
    if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
      console.warn("Clipboard API is not available in this environment.");
      return;
    }
    const serialized = this.formatContextValue(value);
    try {
      await navigator.clipboard.writeText(serialized);
      this.copiedContextItems.add(contextId);
      this.requestUpdate();
      setTimeout(() => {
        this.copiedContextItems.delete(contextId);
        this.requestUpdate();
      }, 1500);
    } catch (error) {
      console.error("Failed to copy context value:", error);
    }
  }
  toggleContextExpansion(contextId) {
    if (this.expandedContextItems.has(contextId)) {
      this.expandedContextItems.delete(contextId);
    } else {
      this.expandedContextItems.add(contextId);
    }
    this.requestUpdate();
  }
  toggleRowExpansion(eventId) {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
      return;
    }
    if (this.expandedRows.has(eventId)) {
      this.expandedRows.delete(eventId);
    } else {
      this.expandedRows.add(eventId);
    }
    this.requestUpdate();
  }
  renderAnnouncementPanel() {
    if (!this.isOpen) {
      return A;
    }
    this.ensureAnnouncementLoading();
    if (!this.hasUnseenAnnouncement) {
      return A;
    }
    if (!this.announcementLoaded && !this.announcementMarkdown) {
      return b`<div
        class="mx-4 my-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
      >
        <div class="flex items-center gap-2 font-semibold">
          <span
            class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm"
          >
            ${this.renderIcon("Megaphone")}
          </span>
          <span>Loading latest announcement…</span>
        </div>
      </div>`;
    }
    if (this.announcementLoadError) {
      return b`<div
        class="mx-4 my-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900 shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
      >
        <div class="flex items-center gap-2 font-semibold">
          <span
            class="inline-flex h-6 w-6 items-center justify-center rounded-md bg-rose-600 text-white shadow-sm"
          >
            ${this.renderIcon("Megaphone")}
          </span>
          <span>Announcement unavailable</span>
        </div>
        <p class="mt-2 text-xs text-rose-800">
          We couldn’t load the latest notice. Please try opening the inspector
          again.
        </p>
      </div>`;
    }
    if (!this.announcementMarkdown) {
      return A;
    }
    const content = this.announcementHtml ? o(this.announcementHtml) : b`<pre class="whitespace-pre-wrap text-sm text-gray-900">
${this.announcementMarkdown}</pre
        >`;
    return b`<div
      class="mx-4 my-3 rounded-xl border border-slate-200 bg-white px-4 py-4 shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
    >
      <div
        class="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900"
      >
        <span
          class="inline-flex h-7 w-7 items-center justify-center rounded-md bg-slate-900 text-white shadow-sm"
        >
          ${this.renderIcon("Megaphone")}
        </span>
        <span>Announcement</span>
        <button
          class="announcement-dismiss ml-auto"
          type="button"
          @click=${this.handleDismissAnnouncement}
          aria-label="Dismiss announcement"
        >
          Dismiss
        </button>
      </div>
      <div class="announcement-content text-sm leading-relaxed text-gray-900">
        ${content}
      </div>
    </div>`;
  }
  ensureAnnouncementLoading() {
    if (this.announcementPromise || typeof window === "undefined" || typeof fetch === "undefined") {
      return;
    }
    this.announcementPromise = this.fetchAnnouncement();
  }
  renderAnnouncementPreview() {
    if (!this.hasUnseenAnnouncement || !this.showAnnouncementPreview || !this.announcementPreviewText) {
      return A;
    }
    const side = this.contextState.button.anchor.horizontal === "left" ? "right" : "left";
    return b`<div
      class="announcement-preview"
      data-side=${side}
      role="note"
      @click=${() => this.handleAnnouncementPreviewClick()}
    >
      <span>${this.announcementPreviewText}</span>
      <span class="announcement-preview__arrow"></span>
    </div>`;
  }
  handleAnnouncementPreviewClick() {
    this.showAnnouncementPreview = false;
    this.openInspector();
  }
  async fetchAnnouncement() {
    try {
      const response = await fetch(ANNOUNCEMENT_URL, { cache: "no-cache" });
      if (!response.ok) {
        throw new Error(`Failed to load announcement (${response.status})`);
      }
      const data = await response.json();
      const timestamp = typeof data?.timestamp === "string" ? data.timestamp : null;
      const previewText = typeof data?.previewText === "string" ? data.previewText : null;
      const markdown = typeof data?.announcement === "string" ? data.announcement : null;
      if (!timestamp || !markdown) {
        throw new Error("Malformed announcement payload");
      }
      const storedTimestamp = this.loadStoredAnnouncementTimestamp();
      this.announcementTimestamp = timestamp;
      this.announcementPreviewText = previewText ?? "";
      this.announcementMarkdown = markdown;
      this.hasUnseenAnnouncement = (!storedTimestamp || storedTimestamp !== timestamp) && !!this.announcementPreviewText;
      this.showAnnouncementPreview = this.hasUnseenAnnouncement;
      this.announcementHtml = await this.convertMarkdownToHtml(markdown);
      this.announcementLoaded = true;
      this.requestUpdate();
    } catch (error) {
      this.announcementLoadError = error;
      this.announcementLoaded = true;
      this.requestUpdate();
    }
  }
  async convertMarkdownToHtml(markdown) {
    const renderer = new marked.Renderer();
    renderer.link = (href, title, text) => {
      const safeHref = this.escapeHtmlAttr(this.appendRefParam(href ?? ""));
      const titleAttr = title ? ` title="${this.escapeHtmlAttr(title)}"` : "";
      return `<a href="${safeHref}" target="_blank" rel="noopener"${titleAttr}>${text}</a>`;
    };
    return marked.parse(markdown, { renderer });
  }
  appendRefParam(href) {
    try {
      const url = new URL(
        href,
        typeof window !== "undefined" ? window.location.href : "https://copilotkit.ai"
      );
      if (!url.searchParams.has("ref")) {
        url.searchParams.append("ref", "cpk-inspector");
      }
      return url.toString();
    } catch {
      return href;
    }
  }
  escapeHtmlAttr(value) {
    return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&#39;");
  }
  loadStoredAnnouncementTimestamp() {
    if (typeof window === "undefined" || !window.localStorage) {
      return null;
    }
    try {
      const raw = window.localStorage.getItem(ANNOUNCEMENT_STORAGE_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.timestamp === "string") {
        return parsed.timestamp;
      }
      return null;
    } catch {
    }
    return null;
  }
  persistAnnouncementTimestamp(timestamp) {
    if (typeof window === "undefined" || !window.localStorage) {
      return;
    }
    try {
      const payload = JSON.stringify({ timestamp });
      window.localStorage.setItem(ANNOUNCEMENT_STORAGE_KEY, payload);
    } catch {
    }
  }
  markAnnouncementSeen() {
    this.hasUnseenAnnouncement = false;
    this.showAnnouncementPreview = false;
    if (!this.announcementTimestamp) {
      if (this.announcementPromise && !this.announcementLoaded) {
        void this.announcementPromise.then(() => this.markAnnouncementSeen()).catch(() => void 0);
      }
      this.requestUpdate();
      return;
    }
    this.persistAnnouncementTimestamp(this.announcementTimestamp);
    this.requestUpdate();
  }
};
function defineWebInspector() {
  if (!customElements.get(WEB_INSPECTOR_TAG)) {
    customElements.define(WEB_INSPECTOR_TAG, WebInspectorElement);
  }
}
defineWebInspector();
export {
  WEB_INSPECTOR_TAG,
  WebInspectorElement,
  defineWebInspector
};
