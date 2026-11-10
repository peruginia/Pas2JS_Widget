rtl.module("weborworker",["System","JS","Types"],function () {
  "use strict";
  var $mod = this;
  this.$rtti.$ExtClass("TJSCryptoKey");
  this.$rtti.$ExtClass("TJSSubtleCrypto");
  this.$rtti.$ExtClass("TJSEventTarget");
  this.$rtti.$ExtClass("TIDBDatabase");
  this.$rtti.$ExtClass("TJSIDBObjectStore");
  this.$rtti.$ExtClass("TJSIDBRequest");
  this.$rtti.$ExtClass("TJSServiceWorker");
  this.$rtti.$ExtClass("TJSReadableStream");
  this.$rtti.$ExtClass("TJSClient");
  this.$rtti.$ExtClass("TJSFileSystemHandle");
  this.$rtti.$ExtClass("TJSFileSystemFileHandle");
  this.$rtti.$ExtClass("TJSFileSystemDirectoryHandle");
  this.$rtti.$ExtClass("TJSFileSystemWritableFileStream");
  this.$rtti.$ExtClass("TJSFileSystemSyncAccessHandle");
  this.$rtti.$DynArray("TJSFileSystemFileHandleArray",{eltype: this.$rtti["TJSFileSystemFileHandle"]});
  this.$rtti.$DynArray("TJSFileSystemDirectoryHandleArray",{eltype: this.$rtti["TJSFileSystemDirectoryHandle"]});
  this.$rtti.$ExtClass("TJSConsole",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Console"});
  this.$rtti.$RefToProcVar("TJSTimerCallBack",{procsig: rtl.newTIProcSig([],null,8)});
  rtl.recNewT(this,"TJSEventInit",function () {
    this.bubbles = false;
    this.cancelable = false;
    this.scoped = false;
    this.composed = false;
    this.$eq = function (b) {
      return (this.bubbles === b.bubbles) && (this.cancelable === b.cancelable) && (this.scoped === b.scoped) && (this.composed === b.composed);
    };
    this.$assign = function (s) {
      this.bubbles = s.bubbles;
      this.cancelable = s.cancelable;
      this.scoped = s.scoped;
      this.composed = s.composed;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSEventInit",{});
    $r.addField("bubbles",rtl.boolean);
    $r.addField("cancelable",rtl.boolean);
    $r.addField("scoped",rtl.boolean);
    $r.addField("composed",rtl.boolean);
  });
  this.$rtti.$ExtClass("TJSEvent",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Event"});
  this.$rtti.$ExtClass("TJSExtendableEvent",{ancestor: this.$rtti["TJSEvent"], jsclass: "ExtendableEvent"});
  this.$rtti.$RefToProcVar("TJSEventHandler",{procsig: rtl.newTIProcSig([["Event",this.$rtti["TJSEvent"]]],rtl.boolean,8)});
  this.$rtti.$RefToProcVar("TJSRawEventHandler",{procsig: rtl.newTIProcSig([["Event",this.$rtti["TJSEvent"]]],null,8)});
  this.$rtti.$ExtClass("TJSEventTarget",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "EventTarget"});
  this.$rtti.$ExtClass("TJSMessagePort",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "MessagePort"});
  this.$rtti.$DynArray("TJSMessagePortDynArray",{eltype: this.$rtti["TJSMessagePort"]});
  this.$rtti.$ExtClass("TJSMessageEvent",{ancestor: this.$rtti["TJSEvent"], jsclass: "MessageEvent"});
  this.$rtti.$ExtClass("TJSExtendableMessageEvent",{ancestor: this.$rtti["TJSExtendableEvent"], jsclass: "ExtendableMessageEvent"});
  this.$rtti.$ExtClass("TJSClient",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Client"});
  this.$rtti.$ExtClass("TJSStructuredSerializeOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSReadableStreamDefaultReader",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ReadableStreamDefaultReader"});
  this.$rtti.$ExtClass("TJSReadableStream",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ReadableStream"});
  this.$rtti.$ExtClass("TJSWritableStream",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "WritableStream"});
  this.$rtti.$ExtClass("TJSBlob",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "Blob"});
  this.$rtti.$ExtClass("TJSFileNewOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSFile",{ancestor: this.$rtti["TJSBlob"], jsclass: "File"});
  this.$rtti.$ExtClass("TJSBody",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Body"});
  this.$rtti.$StaticArray("Theader",{dims: [2], eltype: rtl.string});
  this.$rtti.$DynArray("THeaderArray",{eltype: this.$rtti["Theader"]});
  this.$rtti.$ExtClass("TJSHTMLHeaders",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Headers"});
  this.$rtti.$ExtClass("TJSResponseInit",{jsclass: "Object"});
  this.$rtti.$ExtClass("TJSResponse",{ancestor: this.$rtti["TJSBody"], jsclass: "Response"});
  this.$rtti.$ExtClass("TJSFormData",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "FormData"});
  this.$rtti.$ExtClass("TJSRequest",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Request"});
  this.$rtti.$DynArray("TJSRequestDynArray",{eltype: this.$rtti["TJSRequest"]});
  this.$rtti.$ExtClass("TJSFetchEvent",{ancestor: this.$rtti["TJSExtendableEvent"], jsclass: "FetchEvent"});
  rtl.createClass(this,"TJSIDBTransactionMode",pas.System.TObject,function () {
    this.readonly = "readonly";
    this.readwrite = "readwrite";
    this.versionchange = "versionchange";
  });
  this.$rtti.$ExtClass("TJSIDBTransaction",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBTransaction"});
  this.$rtti.$ExtClass("TJSIDBKeyRange",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "IDBKeyRange"});
  rtl.recNewT(this,"TJSIDBIndexParameters",function () {
    this.unique = false;
    this.multiEntry = false;
    this.locale = "";
    this.$eq = function (b) {
      return (this.unique === b.unique) && (this.multiEntry === b.multiEntry) && (this.locale === b.locale);
    };
    this.$assign = function (s) {
      this.unique = s.unique;
      this.multiEntry = s.multiEntry;
      this.locale = s.locale;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSIDBIndexParameters",{});
    $r.addField("unique",rtl.boolean);
    $r.addField("multiEntry",rtl.boolean);
    $r.addField("locale",rtl.string);
  });
  this.$rtti.$ExtClass("TJSIDBIndex",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "IDBIndex"});
  this.$rtti.$ExtClass("TJSIDBCursorDirection",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "IDBCursorDirection"});
  this.$rtti.$ExtClass("TJSIDBCursor",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "IDBCursor"});
  this.$rtti.$ExtClass("TJSIDBObjectStore",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBObjectStore"});
  this.$rtti.$ExtClass("TJSIDBRequest",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBRequest"});
  this.$rtti.$ExtClass("TJSIDBOpenDBRequest",{ancestor: this.$rtti["TJSIDBRequest"], jsclass: "IDBOpenDBRequest"});
  rtl.recNewT(this,"TJSCreateObjectStoreOptions",function () {
    this.keyPath = undefined;
    this.autoIncrement = false;
    this.$eq = function (b) {
      return (this.keyPath === b.keyPath) && (this.autoIncrement === b.autoIncrement);
    };
    this.$assign = function (s) {
      this.keyPath = s.keyPath;
      this.autoIncrement = s.autoIncrement;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCreateObjectStoreOptions",{});
    $r.addField("keyPath",rtl.jsvalue);
    $r.addField("autoIncrement",rtl.boolean);
  });
  this.$rtti.$ExtClass("TIDBDatabase",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBDatabase"});
  this.$rtti.$ExtClass("TJSIDBFactory",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "IDBFactory"});
  this.$rtti.$ExtClass("TJSCacheDeleteOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$RefToProcVar("TJSParamEnumCallBack",{procsig: rtl.newTIProcSig([["aKey",rtl.string,2],["aValue",rtl.string,2]])});
  this.$rtti.$ExtClass("TJSURLSearchParams",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "URLSearchParams"});
  this.$rtti.$ExtClass("TJSURL",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "URL"});
  this.$rtti.$DynArray("TJSURLDynArray",{eltype: this.$rtti["TJSURL"]});
  this.$rtti.$ExtClass("TJSNavigationPreloadState",{jsclass: "navigationPreloadState"});
  this.$rtti.$ExtClass("TJSCache",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Cache"});
  this.$rtti.$ExtClass("TJSCacheStorage",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "CacheStorage"});
  rtl.recNewT(this,"TJSCryptoAlgorithm",function () {
    this.name = "";
    this.$eq = function (b) {
      return this.name === b.name;
    };
    this.$assign = function (s) {
      this.name = s.name;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAlgorithm",{});
    $r.addField("name",rtl.string);
  });
  rtl.recNewT(this,"TJSCryptoAesCbcParams",function () {
    this.iv = null;
    this.$eq = function (b) {
      return this.iv === b.iv;
    };
    this.$assign = function (s) {
      this.iv = s.iv;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesCbcParams",{});
    $r.addField("iv",pas.JS.$rtti["TJSBufferSource"]);
  });
  rtl.recNewT(this,"TJSCryptoAesCtrParams",function () {
    this.counter = null;
    this.$eq = function (b) {
      return (this.counter === b.counter) && (this.length === b.length);
    };
    this.$assign = function (s) {
      this.counter = s.counter;
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesCtrParams",{});
    $r.addField("counter",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("length",rtl.byte);
  });
  rtl.recNewT(this,"TJSCryptoAesGcmParams",function () {
    this.iv = null;
    this.additionalData = null;
    this.tagLength = 0;
    this.$eq = function (b) {
      return (this.iv === b.iv) && (this.additionalData === b.additionalData) && (this.tagLength === b.tagLength);
    };
    this.$assign = function (s) {
      this.iv = s.iv;
      this.additionalData = s.additionalData;
      this.tagLength = s.tagLength;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesGcmParams",{});
    $r.addField("iv",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("additionalData",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("tagLength",rtl.byte);
  });
  rtl.recNewT(this,"TJSCryptoHmacImportParams",function () {
    this.hash = undefined;
    this.$eq = function (b) {
      return this.hash === b.hash;
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoHmacImportParams",{});
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoPbkdf2Params",function () {
    this.salt = null;
    this.iterations = 0;
    this.hash = undefined;
    this.$eq = function (b) {
      return (this.salt === b.salt) && (this.iterations === b.iterations) && (this.hash === b.hash);
    };
    this.$assign = function (s) {
      this.salt = s.salt;
      this.iterations = s.iterations;
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoPbkdf2Params",{});
    $r.addField("salt",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("iterations",rtl.nativeint);
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoRsaHashedImportParams",function () {
    this.hash = undefined;
    this.$eq = function (b) {
      return this.hash === b.hash;
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaHashedImportParams",{});
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoAesKeyGenParams",function () {
    this.$eq = function (b) {
      return this.length === b.length;
    };
    this.$assign = function (s) {
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesKeyGenParams",{});
    $r.addField("length",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoHmacKeyGenParams",function () {
    this.hash = undefined;
    this.$eq = function (b) {
      return (this.hash === b.hash) && (this.length === b.length);
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoHmacKeyGenParams",{});
    $r.addField("hash",rtl.jsvalue);
    $r.addField("length",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoRsaHashedKeyGenParams",function () {
    this.modulusLength = 0;
    this.publicExponent = null;
    this.hash = undefined;
    this.$eq = function (b) {
      return (this.modulusLength === b.modulusLength) && (this.publicExponent === b.publicExponent) && (this.hash === b.hash);
    };
    this.$assign = function (s) {
      this.modulusLength = s.modulusLength;
      this.publicExponent = s.publicExponent;
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaHashedKeyGenParams",{});
    $r.addField("modulusLength",rtl.longint);
    $r.addField("publicExponent",pas.JS.$rtti["TJSUint8Array"]);
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoRsaOaepParams",function () {
    this.$eq = function (b) {
      return this.label === b.label;
    };
    this.$assign = function (s) {
      this.label = s.label;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaOaepParams",{});
    $r.addField("label",pas.JS.$rtti["TJSBufferSource"]);
  });
  rtl.recNewT(this,"TJSCryptoRsaPssParams",function () {
    this.saltLength = 0;
    this.$eq = function (b) {
      return this.saltLength === b.saltLength;
    };
    this.$assign = function (s) {
      this.saltLength = s.saltLength;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaPssParams",{});
    $r.addField("saltLength",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoDhKeyGenParams",function () {
    this.prime = null;
    this.generator = null;
    this.$eq = function (b) {
      return (this.prime === b.prime) && (this.generator === b.generator);
    };
    this.$assign = function (s) {
      this.prime = s.prime;
      this.generator = s.generator;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoDhKeyGenParams",{});
    $r.addField("prime",pas.JS.$rtti["TJSUint8Array"]);
    $r.addField("generator",pas.JS.$rtti["TJSUint8Array"]);
  });
  rtl.recNewT(this,"TJSCryptoEcKeyGenParams",function () {
    this.$eq = function (b) {
      return this.namedCurve === b.namedCurve;
    };
    this.$assign = function (s) {
      this.namedCurve = s.namedCurve;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoEcKeyGenParams",{});
    $r.addField("namedCurve",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoAesDerivedKeyParams",function () {
    this.$eq = function (b) {
      return this.length === b.length;
    };
    this.$assign = function (s) {
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoAesDerivedKeyParams",{});
    $r.addField("length",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoHmacDerivedKeyParams",function () {
    this.$eq = function (b) {
      return this.length === b.length;
    };
    this.$assign = function (s) {
      this.length = s.length;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoHmacDerivedKeyParams",{});
    $r.addField("length",rtl.longint);
  });
  rtl.recNewT(this,"TJSCryptoEcdhKeyDeriveParams",function () {
    this.$eq = function (b) {
      return this.public === b.public;
    };
    this.$assign = function (s) {
      this.public = s.public;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoEcdhKeyDeriveParams",{});
    $r.addField("public",$mod.$rtti["TJSCryptoKey"]);
  });
  rtl.recNewT(this,"TJSCryptoDhKeyDeriveParams",function () {
    this.$eq = function (b) {
      return this.public === b.public;
    };
    this.$assign = function (s) {
      this.public = s.public;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoDhKeyDeriveParams",{});
    $r.addField("public",$mod.$rtti["TJSCryptoKey"]);
  });
  rtl.recNewT(this,"TJSCryptoDhImportKeyParams",function () {
    this.prime = null;
    this.generator = null;
    this.$eq = function (b) {
      return (this.prime === b.prime) && (this.generator === b.generator);
    };
    this.$assign = function (s) {
      this.prime = s.prime;
      this.generator = s.generator;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoDhImportKeyParams",{});
    $r.addField("prime",pas.JS.$rtti["TJSUint8Array"]);
    $r.addField("generator",pas.JS.$rtti["TJSUint8Array"]);
  });
  rtl.recNewT(this,"TJSCryptoEcdsaParams",function () {
    this.hash = undefined;
    this.$eq = function (b) {
      return this.hash === b.hash;
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoEcdsaParams",{});
    $r.addField("hash",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoEcKeyImportParams",function () {
    this.$eq = function (b) {
      return this.namedCurve === b.namedCurve;
    };
    this.$assign = function (s) {
      this.namedCurve = s.namedCurve;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoEcKeyImportParams",{});
    $r.addField("namedCurve",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSCryptoHkdfParams",function () {
    this.hash = undefined;
    this.salt = null;
    this.info = null;
    this.$eq = function (b) {
      return (this.hash === b.hash) && (this.salt === b.salt) && (this.info === b.info);
    };
    this.$assign = function (s) {
      this.hash = s.hash;
      this.salt = s.salt;
      this.info = s.info;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoHkdfParams",{});
    $r.addField("hash",rtl.jsvalue);
    $r.addField("salt",pas.JS.$rtti["TJSBufferSource"]);
    $r.addField("info",pas.JS.$rtti["TJSBufferSource"]);
  });
  rtl.recNewT(this,"TJSCryptoRsaOtherPrimesInfo",function () {
    this.r = "";
    this.d = "";
    this.t = "";
    this.$eq = function (b) {
      return (this.r === b.r) && (this.d === b.d) && (this.t === b.t);
    };
    this.$assign = function (s) {
      this.r = s.r;
      this.d = s.d;
      this.t = s.t;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoRsaOtherPrimesInfo",{});
    $r.addField("r",rtl.string);
    $r.addField("d",rtl.string);
    $r.addField("t",rtl.string);
  });
  this.$rtti.$DynArray("TJSCryptoRsaOtherPrimesInfoDynArray",{eltype: this.$rtti["TJSCryptoRsaOtherPrimesInfo"]});
  rtl.recNewT(this,"TJSCryptoJsonWebKey",function () {
    this.kty = "";
    this.use = "";
    this.alg = "";
    this.ext = false;
    this.crv = "";
    this.x = "";
    this.y = "";
    this.d = "";
    this.n = "";
    this.e = "";
    this.p = "";
    this.q = "";
    this.dp = "";
    this.dq = "";
    this.qi = "";
    this.k = "";
    this.$new = function () {
      var r = Object.create(this);
      r.key_ops = [];
      r.oth = [];
      return r;
    };
    this.$eq = function (b) {
      return (this.kty === b.kty) && (this.use === b.use) && (this.key_ops === b.key_ops) && (this.alg === b.alg) && (this.ext === b.ext) && (this.crv === b.crv) && (this.x === b.x) && (this.y === b.y) && (this.d === b.d) && (this.n === b.n) && (this.e === b.e) && (this.p === b.p) && (this.q === b.q) && (this.dp === b.dp) && (this.dq === b.dq) && (this.qi === b.qi) && (this.oth === b.oth) && (this.k === b.k);
    };
    this.$assign = function (s) {
      this.kty = s.kty;
      this.use = s.use;
      this.key_ops = rtl.arrayRef(s.key_ops);
      this.alg = s.alg;
      this.ext = s.ext;
      this.crv = s.crv;
      this.x = s.x;
      this.y = s.y;
      this.d = s.d;
      this.n = s.n;
      this.e = s.e;
      this.p = s.p;
      this.q = s.q;
      this.dp = s.dp;
      this.dq = s.dq;
      this.qi = s.qi;
      this.oth = rtl.arrayRef(s.oth);
      this.k = s.k;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoJsonWebKey",{});
    $r.addField("kty",rtl.string);
    $r.addField("use",rtl.string);
    $r.addField("key_ops",pas.Types.$rtti["TStringDynArray"]);
    $r.addField("alg",rtl.string);
    $r.addField("ext",rtl.boolean);
    $r.addField("crv",rtl.string);
    $r.addField("x",rtl.string);
    $r.addField("y",rtl.string);
    $r.addField("d",rtl.string);
    $r.addField("n",rtl.string);
    $r.addField("e",rtl.string);
    $r.addField("p",rtl.string);
    $r.addField("q",rtl.string);
    $r.addField("dp",rtl.string);
    $r.addField("dq",rtl.string);
    $r.addField("qi",rtl.string);
    $r.addField("oth",$mod.$rtti["TJSCryptoRsaOtherPrimesInfoDynArray"]);
    $r.addField("k",rtl.string);
  });
  rtl.recNewT(this,"TJSCryptoKeyPair",function () {
    this.publicKey = null;
    this.privateKey = null;
    this.$eq = function (b) {
      return (this.publicKey === b.publicKey) && (this.privateKey === b.privateKey);
    };
    this.$assign = function (s) {
      this.publicKey = s.publicKey;
      this.privateKey = s.privateKey;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSCryptoKeyPair",{});
    $r.addField("publicKey",$mod.$rtti["TJSCryptoKey"]);
    $r.addField("privateKey",$mod.$rtti["TJSCryptoKey"]);
  });
  this.$rtti.$DynArray("TJSCryptoKeyUsageDynArray",{eltype: rtl.string});
  this.$rtti.$ExtClass("TJSCryptoKey",{jsclass: "CryptoKey"});
  this.$rtti.$ExtClass("TJSSubtleCrypto",{jsclass: "SubtleCrypto"});
  this.$rtti.$ExtClass("TJSCrypto",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Crypto"});
  this.$rtti.$ExtClass("TJSEventSourceOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSEventSource",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "EventSource"});
  this.$rtti.$ExtClass("TJSNavigationPreload",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "navigationPreload"});
  this.$rtti.$ExtClass("TJSWorker",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "Worker"});
  this.$rtti.$ExtClass("TJSServiceWorkerRegistration",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "ServiceWorkerRegistration"});
  this.$rtti.$ExtClass("TJSServiceWorker",{ancestor: this.$rtti["TJSWorker"], jsclass: "ServiceWorker"});
  this.$rtti.$RefToProcVar("TOnChangeProcedure",{procsig: rtl.newTIProcSig([])});
  this.$rtti.$ExtClass("TJSPermissionDescriptor",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSPermissionStatus",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "PermissionStatus"});
  this.$rtti.$ExtClass("TJSPermissions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Permissions"});
  this.$rtti.$ExtClass("TJSFileSystemHandlePermissionDescriptor",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  rtl.recNewT(this,"TJSFileSystemCreateWritableOptions",function () {
    this.keepExistingData = false;
    this.$eq = function (b) {
      return this.keepExistingData === b.keepExistingData;
    };
    this.$assign = function (s) {
      this.keepExistingData = s.keepExistingData;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemCreateWritableOptions",{});
    $r.addField("keepExistingData",rtl.boolean);
  });
  rtl.recNewT(this,"TJSFileSystemGetFileOptions",function () {
    this.create = false;
    this.$eq = function (b) {
      return this.create === b.create;
    };
    this.$assign = function (s) {
      this.create = s.create;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemGetFileOptions",{});
    $r.addField("create",rtl.boolean);
  });
  rtl.recNewT(this,"TJSFileSystemGetDirectoryOptions",function () {
    this.create = false;
    this.$eq = function (b) {
      return this.create === b.create;
    };
    this.$assign = function (s) {
      this.create = s.create;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemGetDirectoryOptions",{});
    $r.addField("create",rtl.boolean);
  });
  rtl.recNewT(this,"TJSFileSystemRemoveOptions",function () {
    this.recursive = false;
    this.$eq = function (b) {
      return this.recursive === b.recursive;
    };
    this.$assign = function (s) {
      this.recursive = s.recursive;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemRemoveOptions",{});
    $r.addField("recursive",rtl.boolean);
  });
  rtl.recNewT(this,"TJSWriteParams",function () {
    this.size = 0;
    this.position = 0;
    this.data = undefined;
    this.$eq = function (b) {
      return (this.type === b.type) && (this.size === b.size) && (this.position === b.position) && (this.data === b.data);
    };
    this.$assign = function (s) {
      this.type = s.type;
      this.size = s.size;
      this.position = s.position;
      this.data = s.data;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSWriteParams",{});
    $r.addField("type",rtl.string);
    $r.addField("size",rtl.nativeint);
    $r.addField("position",rtl.nativeint);
    $r.addField("data",rtl.jsvalue);
  });
  rtl.recNewT(this,"TJSFileSystemReadWriteOptions",function () {
    this.at = 0;
    this.$eq = function (b) {
      return this.at === b.at;
    };
    this.$assign = function (s) {
      this.at = s.at;
      return this;
    };
    var $r = $mod.$rtti.$Record("TJSFileSystemReadWriteOptions",{});
    $r.addField("at",rtl.nativeint);
  });
  this.$rtti.$ExtClass("TJSFileSystemHandle",{jsclass: "FileSystemHandle"});
  this.$rtti.$ExtClass("TJSFileSystemSyncAccessHandle",{jsclass: "FileSystemSyncAccessHandle"});
  this.$rtti.$ExtClass("TJSFileSystemFileHandle",{ancestor: this.$rtti["TJSFileSystemHandle"], jsclass: "FileSystemFileHandle"});
  this.$rtti.$ExtClass("TJSFileSystemDirectoryHandle",{ancestor: this.$rtti["TJSFileSystemHandle"], jsclass: "FileSystemDirectoryHandle"});
  this.$rtti.$ExtClass("TJSFileSystemWritableFileStream",{ancestor: this.$rtti["TJSWritableStream"], jsclass: "FileSystemWritableFileStream"});
  this.$rtti.$ExtClass("TJSStorageManager",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "StorageManager"});
  this.$rtti.$RefToProcVar("TJSMicrotaskProcedure",{procsig: rtl.newTIProcSig([])});
  this.$rtti.$ExtClass("TJSImageBitmapOptions",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TWindowOrWorkerGlobalScope",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSAbortSignal",{ancestor: this.$rtti["TJSEventTarget"], jsclass: "AbortSignal"});
  this.$rtti.$ExtClass("TJSAbortController",{ancestor: this.$rtti["TJSAbortSignal"], jsclass: "AbortController"});
});
//# sourceMappingURL=weborworker.js.map
