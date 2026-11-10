rtl.module("JS",["System","Types"],function () {
  "use strict";
  var $mod = this;
  this.$rtti.$ExtClass("TJSArray");
  this.$rtti.$ExtClass("TJSMap");
  rtl.createClass(this,"EJS",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FMessage = "";
    };
    this.Create$1 = function (Msg) {
      this.FMessage = Msg;
      return this;
    };
  });
  this.$rtti.$ExtClass("TJSObject",{jsclass: "Object"});
  this.$rtti.$ClassRef("TJSObjectClass",{instancetype: this.$rtti["TJSObject"]});
  this.$rtti.$DynArray("TJSObjectDynArray",{eltype: this.$rtti["TJSObject"]});
  this.$rtti.$DynArray("TJSObjectDynArrayArray",{eltype: this.$rtti["TJSObjectDynArray"]});
  this.$rtti.$DynArray("TJSStringDynArray",{eltype: rtl.string});
  this.$rtti.$ExtClass("TJSIteratorValue",{jsclass: "IteratorValue"});
  this.$rtti.$ExtClass("TJSIterator",{jsclass: "Iterator"});
  this.$rtti.$ExtClass("TJSSet");
  this.$rtti.$RefToProcVar("TJSSetEventProc",{procsig: rtl.newTIProcSig([["value",rtl.jsvalue],["key",rtl.nativeint],["set_",this.$rtti["TJSSet"]]])});
  this.$rtti.$RefToProcVar("TJSSetProcCallBack",{procsig: rtl.newTIProcSig([["value",rtl.jsvalue],["key",rtl.jsvalue]])});
  this.$rtti.$ExtClass("TJSSet",{jsclass: "Set"});
  this.$rtti.$RefToProcVar("TJSMapFunctionCallBack",{procsig: rtl.newTIProcSig([["arg",rtl.jsvalue]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSMapProcCallBack",{procsig: rtl.newTIProcSig([["value",rtl.jsvalue],["key",rtl.jsvalue]])});
  this.$rtti.$ExtClass("TJSMap",{jsclass: "Map"});
  this.$rtti.$ExtClass("TJSFunction",{ancestor: this.$rtti["TJSObject"], jsclass: "Function"});
  this.$rtti.$ExtClass("TJSDate",{ancestor: this.$rtti["TJSFunction"], jsclass: "Date"});
  this.$rtti.$ExtClass("TJSSymbol",{ancestor: this.$rtti["TJSFunction"], jsclass: "Symbol"});
  rtl.recNewT(this,"TLocaleCompareOptions",function () {
    this.localematched = "";
    this.usage = "";
    this.sensitivity = "";
    this.ignorePunctuation = false;
    this.numeric = false;
    this.caseFirst = "";
    this.$eq = function (b) {
      return (this.localematched === b.localematched) && (this.usage === b.usage) && (this.sensitivity === b.sensitivity) && (this.ignorePunctuation === b.ignorePunctuation) && (this.numeric === b.numeric) && (this.caseFirst === b.caseFirst);
    };
    this.$assign = function (s) {
      this.localematched = s.localematched;
      this.usage = s.usage;
      this.sensitivity = s.sensitivity;
      this.ignorePunctuation = s.ignorePunctuation;
      this.numeric = s.numeric;
      this.caseFirst = s.caseFirst;
      return this;
    };
    var $r = $mod.$rtti.$Record("TLocaleCompareOptions",{});
    $r.addField("localematched",rtl.string);
    $r.addField("usage",rtl.string);
    $r.addField("sensitivity",rtl.string);
    $r.addField("ignorePunctuation",rtl.boolean);
    $r.addField("numeric",rtl.boolean);
    $r.addField("caseFirst",rtl.string);
  });
  this.$rtti.$ExtClass("TJSRegexp",{jsclass: "RegExp"});
  this.$rtti.$RefToProcVar("TReplaceCallBack",{procsig: rtl.newTIProcSig([["match",rtl.string,2]],rtl.string,2)});
  this.$rtti.$RefToProcVar("TReplaceCallBack0",{procsig: rtl.newTIProcSig([["match",rtl.string,2],["offset",rtl.longint],["AString",rtl.string]],rtl.string)});
  this.$rtti.$RefToProcVar("TReplaceCallBack1",{procsig: rtl.newTIProcSig([["match",rtl.string,2],["p1",rtl.string,2],["offset",rtl.longint],["AString",rtl.string]],rtl.string)});
  this.$rtti.$RefToProcVar("TReplaceCallBack2",{procsig: rtl.newTIProcSig([["match",rtl.string,2],["p1",rtl.string,2],["p2",rtl.string,2],["offset",rtl.longint],["AString",rtl.string]],rtl.string)});
  this.$rtti.$ExtClass("TJSString",{jsclass: "String"});
  this.$rtti.$RefToProcVar("TJSArrayEventProc",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSArray"]]])});
  this.$rtti.$RefToProcVar("TJSArrayEvent",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSArray"]]],rtl.boolean)});
  this.$rtti.$RefToProcVar("TJSArrayMapEvent",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSArray"]]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSArrayReduceEvent",{procsig: rtl.newTIProcSig([["accumulator",rtl.jsvalue],["currentValue",rtl.jsvalue],["currentIndex",rtl.nativeint],["anArray",this.$rtti["TJSArray"]]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSArrayCompareEvent",{procsig: rtl.newTIProcSig([["a",rtl.jsvalue],["b",rtl.jsvalue]],rtl.nativeint)});
  this.$rtti.$ExtClass("TJSArray",{jsclass: "Array"});
  this.$rtti.$ExtClass("TJSArrayBuffer",{ancestor: this.$rtti["TJSObject"], jsclass: "ArrayBuffer"});
  this.$rtti.$ExtClass("TJSBufferSource",{jsclass: "BufferSource"});
  this.$rtti.$ExtClass("TJSTypedArray");
  this.$rtti.$RefToProcVar("TJSTypedArrayCallBack",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSTypedArray"]]],rtl.boolean)});
  this.$rtti.$RefToProcVar("TJSTypedArrayMapCallBack",{procsig: rtl.newTIProcSig([["element",rtl.jsvalue],["index",rtl.nativeint],["anArray",this.$rtti["TJSTypedArray"]]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSTypedArrayReduceCallBack",{procsig: rtl.newTIProcSig([["accumulator",rtl.jsvalue],["currentValue",rtl.jsvalue],["currentIndex",rtl.nativeint],["anArray",this.$rtti["TJSTypedArray"]]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSTypedArrayCompareCallBack",{procsig: rtl.newTIProcSig([["a",rtl.jsvalue],["b",rtl.jsvalue]],rtl.nativeint)});
  this.$rtti.$ExtClass("TJSTypedArray",{ancestor: this.$rtti["TJSBufferSource"], jsclass: "TypedArray"});
  this.$rtti.$ExtClass("TJSInt8Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Int8Array"});
  this.$rtti.$ExtClass("TJSUint8Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Uint8Array"});
  this.$rtti.$ExtClass("TJSUint8ClampedArray",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Uint8ClampedArray"});
  this.$rtti.$ExtClass("TJSInt16Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Int16Array"});
  this.$rtti.$ExtClass("TJSUint16Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Uint16Array"});
  this.$rtti.$ExtClass("TJSInt32Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Int32Array"});
  this.$rtti.$ExtClass("TJSUint32Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Uint32Array"});
  this.$rtti.$ExtClass("TJSFloat32Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Float32Array"});
  this.$rtti.$ExtClass("TJSFloat64Array",{ancestor: this.$rtti["TJSTypedArray"], jsclass: "Float64Array"});
  this.$rtti.$ExtClass("TJSDataView",{ancestor: this.$rtti["TJSBufferSource"], jsclass: "DataView"});
  this.$rtti.$ExtClass("TJSJSON",{ancestor: this.$rtti["TJSObject"], jsclass: "JSON"});
  this.$rtti.$ExtClass("TJSError",{ancestor: this.$rtti["TJSObject"], jsclass: "Error"});
  this.$rtti.$RefToProcVar("TJSPromiseResolver",{procsig: rtl.newTIProcSig([["aValue",rtl.jsvalue]],rtl.jsvalue)});
  this.$rtti.$RefToProcVar("TJSPromiseExecutor",{procsig: rtl.newTIProcSig([["resolve",this.$rtti["TJSPromiseResolver"]],["reject",this.$rtti["TJSPromiseResolver"]]])});
  this.$rtti.$RefToProcVar("TJSPromiseFinallyHandler",{procsig: rtl.newTIProcSig([])});
  this.$rtti.$ExtClass("TJSPromise");
  this.$rtti.$DynArray("TJSPromiseArray",{eltype: this.$rtti["TJSPromise"]});
  this.$rtti.$ExtClass("TJSPromise",{jsclass: "Promise"});
  this.$rtti.$ExtClass("TJSFunctionArguments",{jsclass: "arguments"});
  this.$rtti.$ExtClass("TJSIteratorResult",{ancestor: this.$rtti["TJSObject"], jsclass: "IteratorResult"});
  this.$rtti.$ExtClass("TJSAsyncIterator",{ancestor: this.$rtti["TJSObject"], jsclass: "AsyncIterator"});
  this.$rtti.$ExtClass("TJSSyntaxError",{ancestor: this.$rtti["TJSError"], jsclass: "SyntaxError"});
  this.$rtti.$ExtClass("TJSTextDecoderOptions",{ancestor: this.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSTextDecodeOptions",{ancestor: this.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSTextDecoder",{ancestor: this.$rtti["TJSObject"], jsclass: "TextDecoder"});
  this.$rtti.$ExtClass("TJSTextEncoderEncodeIntoResult",{ancestor: this.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TJSTextEncoder",{ancestor: this.$rtti["TJSObject"], jsclass: "TextEncoder"});
  this.$rtti.$ExtClass("TGGenerator<System.JSValue>",{ancestor: this.$rtti["TJSObject"], jsclass: "Generator"});
  this.$rtti.$ExtClass("TGGenerator<System.JSValue>.TGGeneratorValue",{ancestor: this.$rtti["TJSObject"], jsclass: "Generator"});
  this.$rtti.$ExtClass("TJSProxy",{ancestor: this.$rtti["TJSObject"], jsclass: "Proxy"});
  this.$rtti.$ExtClass("TJSNumber",{ancestor: this.$rtti["TJSFunction"], jsclass: "Number"});
  this.Symbol$1 = function () {
    return Symbol();
  };
  this.Symbol$2 = function (Description) {
    return Symbol(Description);
  };
  this.JSValueArrayOf = function (Args) {
    var Result = [];
    var I = 0;
    Result = rtl.arraySetLength(Result,undefined,rtl.length(Args));
    for (var $l = 0, $end = rtl.length(Args) - 1; $l <= $end; $l++) {
      I = $l;
      Result[I] = Args[I].VJSValue;
    };
    return Result;
  };
  this.New = function (aElements) {
    var Result = null;
    var L = 0;
    var I = 0;
    var S = "";
    L = rtl.length(aElements);
    if ((L % 2) === 1) throw $mod.EJS.$create("Create$1",["Number of arguments must be even"]);
    I = 0;
    while (I < L) {
      if (!rtl.isString(aElements[I])) {
        S = String(I);
        throw $mod.EJS.$create("Create$1",["Argument " + S + " must be a string."]);
      };
      I += 2;
    };
    I = 0;
    Result = new Object();
    while (I < L) {
      S = "" + aElements[I];
      Result[S] = aElements[I + 1];
      I += 2;
    };
    return Result;
  };
  this.JSDelete = function (Obj, PropName) {
    return delete Obj[PropName];
  };
  this.hasValue = function (v) {
    if(v){ return true; } else { return false; };
  };
  this.jsIn = function (keyName, object) {
    return keyName in object;
  };
  this.isBoolean = function (v) {
    return typeof(v) == 'boolean';
  };
  this.isDate = function (v) {
    return (v instanceof Date);
  };
  this.isCallback = function (v) {
    return rtl.isObject(v) && rtl.isObject(v.scope) && (rtl.isString(v.fn) || rtl.isFunction(v.fn));
  };
  this.isChar = function (v) {
    return (typeof(v)!="string") && (v.length==1);
  };
  this.isClass = function (v) {
    return (typeof(v)=="object") && (v!=null) && (v.$class == v);
  };
  this.isClassInstance = function (v) {
    return (typeof(v)=="object") && (v!=null) && (v.$class == Object.getPrototypeOf(v));
  };
  this.isInteger = function (v) {
    return Math.floor(v)===v;
  };
  this.isNull = function (v) {
    return v === null;
  };
  this.isRecord = function (v) {
    return (typeof(v)==="object")
    && (typeof(v.$new)==="function")
    && (typeof(v.$clone)==="function")
    && (typeof(v.$eq)==="function")
    && (typeof(v.$assign)==="function");
  };
  this.isUndefined = function (v) {
    return v == undefined;
  };
  this.isDefined = function (v) {
    return !(v == undefined);
  };
  this.isUTF16Char = function (v) {
    if (typeof(v)!="string") return false;
    if ((v.length==0) || (v.length>2)) return false;
    var code = v.charCodeAt(0);
    if (code < 0xD800){
      if (v.length == 1) return true;
    } else if (code <= 0xDBFF){
      if (v.length==2){
        code = v.charCodeAt(1);
        if (code >= 0xDC00 && code <= 0xDFFF) return true;
      };
    };
    return false;
  };
  this.jsInstanceOf = function (aFunction, aFunctionWithPrototype) {
    return aFunction instanceof aFunctionWithPrototype;
  };
  this.toNumber = function (v) {
    return v-0;
  };
  this.toInteger = function (v) {
    var Result = 0;
    if ($mod.isInteger(v)) {
      Result = rtl.trunc(v)}
     else Result = 0;
    return Result;
  };
  this.toObject = function (Value) {
    var Result = null;
    if (rtl.isObject(Value)) {
      Result = Value}
     else Result = null;
    return Result;
  };
  this.toArray = function (Value) {
    var Result = null;
    if (rtl.isArray(Value)) {
      Result = Value}
     else Result = null;
    return Result;
  };
  this.toBoolean = function (Value) {
    var Result = false;
    if ($mod.isBoolean(Value)) {
      Result = !(Value == false)}
     else Result = false;
    return Result;
  };
  this.ToString = function (Value) {
    var Result = "";
    if (rtl.isString(Value)) {
      Result = "" + Value}
     else Result = "";
    return Result;
  };
  this.TJSValueType = {"0": "jvtNull", jvtNull: 0, "1": "jvtBoolean", jvtBoolean: 1, "2": "jvtInteger", jvtInteger: 2, "3": "jvtFloat", jvtFloat: 3, "4": "jvtString", jvtString: 4, "5": "jvtObject", jvtObject: 5, "6": "jvtArray", jvtArray: 6};
  this.$rtti.$Enum("TJSValueType",{minvalue: 0, maxvalue: 6, ordtype: 1, enumtype: this.TJSValueType});
  this.GetValueType = function (JS) {
    var Result = 0;
    var t = "";
    if ($mod.isNull(JS)) {
      Result = $mod.TJSValueType.jvtNull}
     else {
      t = typeof(JS);
      if (t === "string") {
        Result = $mod.TJSValueType.jvtString}
       else if (t === "boolean") {
        Result = $mod.TJSValueType.jvtBoolean}
       else if (t === "object") {
        if (rtl.isArray(JS)) {
          Result = $mod.TJSValueType.jvtArray}
         else Result = $mod.TJSValueType.jvtObject;
      } else if (t === "number") if ($mod.isInteger(JS)) {
        Result = $mod.TJSValueType.jvtInteger}
       else Result = $mod.TJSValueType.jvtFloat;
    };
    return Result;
  };
  this.$rtti.$ExtClass("TGPromise<System.Boolean>",{jsclass: "Promise"});
  this.$rtti.$ExtClass("TGPromise<System.JSValue>",{jsclass: "Promise"});
  this.$rtti.$ExtClass("TGPromise<weborworker.TJSFile>",{jsclass: "Promise"});
  this.$rtti.$ExtClass("TGPromise<weborworker.TJSFileSystemWritableFileStream>",{jsclass: "Promise"});
  this.$rtti.$ExtClass("TGPromise<weborworker.TJSFileSystemSyncAccessHandle>",{jsclass: "Promise"});
  this.$rtti.$ExtClass("TGPromise<weborworker.TJSFileSystemFileHandle>",{jsclass: "Promise"});
  this.$rtti.$ExtClass("TGPromise<Types.TStringDynArray>",{jsclass: "Promise"});
  this.$rtti.$ExtClass("TGPromise<weborworker.TJSFileSystemDirectoryHandle>",{jsclass: "Promise"});
});
//# sourceMappingURL=js.js.map
