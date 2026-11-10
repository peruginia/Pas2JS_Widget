rtl.module("p2jsres",["System","Types"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.TResourceSource = {"0": "rsJS", rsJS: 0, "1": "rsHTML", rsHTML: 1};
  this.$rtti.$Enum("TResourceSource",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TResourceSource});
  rtl.recNewT(this,"TResourceInfo",function () {
    this.name = "";
    this.encoding = "";
    this.resourceunit = "";
    this.format = "";
    this.data = "";
    this.$eq = function (b) {
      return (this.name === b.name) && (this.encoding === b.encoding) && (this.resourceunit === b.resourceunit) && (this.format === b.format) && (this.data === b.data);
    };
    this.$assign = function (s) {
      this.name = s.name;
      this.encoding = s.encoding;
      this.resourceunit = s.resourceunit;
      this.format = s.format;
      this.data = s.data;
      return this;
    };
    var $r = $mod.$rtti.$Record("TResourceInfo",{});
    $r.addField("name",rtl.string);
    $r.addField("encoding",rtl.string);
    $r.addField("resourceunit",rtl.string);
    $r.addField("format",rtl.string);
    $r.addField("data",rtl.string);
  });
  this.$rtti.$RefToProcVar("TResourceEnumCallBack",{procsig: rtl.newTIProcSig([["resName",rtl.string,2]],rtl.boolean)});
  this.$rtti.$RefToProcVar("TResourcesLoadedEnumCallBack",{procsig: rtl.newTIProcSig([["LoadedResources",rtl.string,10]])});
  this.$rtti.$RefToProcVar("TResourcesLoadErrorCallBack",{procsig: rtl.newTIProcSig([["aError",rtl.string,2]])});
  this.SetResourceSource = function (aSource) {
    var Result = 0;
    Result = $impl.gMode;
    $impl.gMode = aSource;
    return Result;
  };
  this.GetResourceNames = function () {
    var Result = [];
    Result = $mod.GetResourceNames$1($impl.gMode);
    return Result;
  };
  this.GetResourceNames$1 = function (aSource) {
    var Result = [];
    var $tmp = aSource;
    if ($tmp === $mod.TResourceSource.rsJS) {
      Result = rtl.getResourceList()}
     else if ($tmp === $mod.TResourceSource.rsHTML) Result = $impl.GetHTMLResources();
    return Result;
  };
  this.EnumResources = function (aCallback) {
    var Result = 0;
    Result = $mod.EnumResources$1($impl.gMode,aCallback);
    return Result;
  };
  this.EnumResources$1 = function (aSource, aCallback) {
    var Result = 0;
    var RL = [];
    var I = 0;
    var ContinueEnum = false;
    Result = 0;
    RL = $mod.GetResourceNames$1(aSource);
    I = 0;
    Result = rtl.length(RL);
    ContinueEnum = true;
    while ((I < Result) && ContinueEnum) {
      ContinueEnum = aCallback(RL[I]);
      I += 1;
    };
    return Result;
  };
  this.GetResourceInfo = function (aName, aInfo) {
    var Result = false;
    Result = $mod.GetResourceInfo$1($impl.gMode,aName,aInfo);
    return Result;
  };
  this.GetResourceInfo$1 = function (aSource, aName, aInfo) {
    var Result = false;
    var $tmp = aSource;
    if ($tmp === $mod.TResourceSource.rsJS) {
      Result = $impl.GetRTLResourceInfo(aName,aInfo)}
     else if ($tmp === $mod.TResourceSource.rsHTML) Result = $impl.GetHTMLResourceInfo(aName,aInfo);
    return Result;
  };
  this.LoadHTMLLinkResources = function (aURL, OnLoad, OnError) {
    function FetchOK(Res) {
      var Result = undefined;
      Result = null;
      if (!Res.ok) {
        if (OnError != null) throw new Error("HTTP Error for URL aURL, status = " + pas.SysUtils.IntToStr(Res.status) + " : " + Res.statusText);
      } else Result = Res.text();
      return Result;
    };
    function BlobOK(Res) {
      var Result = undefined;
      var ID = "";
      var Tmpl = null;
      var El = null;
      var Arr = [];
      var aParent = null;
      Result = null;
      aParent = document.head;
      if (aParent === null) aParent = document.body;
      Arr = rtl.arraySetLength(Arr,"",0);
      Tmpl = document.createElement("template");
      Tmpl.innerHTML = Res.trim();
      El = Tmpl.content.firstElementChild;
      while (El !== null) {
        if (pas.SysUtils.SameText(El.tagName,"link") && $impl.IsResourceLink(El)) {
          aParent.append(document.importNode(El,true));
          ID = El.id;
          pas.System.Delete({get: function () {
              return ID;
            }, set: function (v) {
              ID = v;
            }},1,$impl.IDPrefix.length);
          if (ID !== "") Arr.push(ID);
        };
        El = El.nextElementSibling;
      };
      if (OnLoad != null) OnLoad(Arr);
      return Result;
    };
    function DoError(aValue) {
      var Result = undefined;
      Result = null;
      if (OnError != null) if (aValue === null) OnError("Error: " + aValue.message);
      return Result;
    };
    if (!$impl.HasTemplate()) {
      if (OnError != null) OnError("No template support in this browser");
    } else window.fetch(aURL).then(FetchOK).then(BlobOK).catch(DoError);
  };
  $mod.$implcode = function () {
    $impl.gMode = 0;
    $mod.$rtti.$ExtClass("TRTLResourceInfo",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
    $impl.GetRTLResourceInfo = function (aName, aInfo) {
      var Result = false;
      var RTLInfo = null;
      RTLInfo = rtl.getResource(pas.SysUtils.LowerCase(aName));
      Result = RTLInfo != null;
      if (Result) {
        aInfo.name = RTLInfo.name;
        aInfo.encoding = RTLInfo.encoding;
        aInfo.format = RTLInfo.format;
        aInfo.resourceunit = RTLInfo.unit;
        aInfo.data = RTLInfo.data;
      };
      return Result;
    };
    $impl.IDPrefix = "resource-";
    $impl.IsResourceLink = function (L) {
      var Result = false;
      Result = (pas.System.Copy(L.id,1,$impl.IDPrefix.length) === $impl.IDPrefix) && pas.JS.isDefined(L.dataset["unit"]) && (pas.System.Copy(L.href,1,4) === "data");
      return Result;
    };
    $impl.GetHTMLResources = function () {
      var Result = [];
      var LC = null;
      var L = null;
      var I = 0;
      var ID = "";
      Result = rtl.arraySetLength(Result,"",0);
      if (!pas.JS.isDefined(document)) return Result;
      LC = document.getElementsByTagName("link");
      for (var $l = 0, $end = LC.length - 1; $l <= $end; $l++) {
        I = $l;
        L = LC.item(I);
        ID = L.id;
        if ($impl.IsResourceLink(L)) {
          pas.System.Delete({get: function () {
              return ID;
            }, set: function (v) {
              ID = v;
            }},1,$impl.IDPrefix.length);
          if (ID !== "") Result.push(ID);
        };
      };
      return Result;
    };
    $impl.GetHTMLResourceInfo = function (aName, aInfo) {
      var Result = false;
      var el = null;
      var S = "";
      var I = 0;
      Result = false;
      if (!pas.JS.isDefined(document)) return Result;
      el = document.getElementById($impl.IDPrefix + pas.SysUtils.LowerCase(aName));
      Result = (el != null) && pas.SysUtils.SameText(el.tagName,"link");
      if (!Result) return Result;
      aInfo.name = pas.SysUtils.LowerCase(aName);
      aInfo.resourceunit = el.dataset["unit"];
      S = el.href;
      S = pas.System.Copy(S,6,S.length - 5);
      I = pas.System.Pos(",",S);
      aInfo.data = pas.System.Copy(S,I + 1,S.length - 1);
      S = pas.System.Copy(S,1,I - 1);
      I = pas.System.Pos(";",S);
      if (I === 0) {
        aInfo.encoding = ""}
       else {
        aInfo.encoding = pas.System.Copy(S,I + 1,S.length - 1);
        S = pas.System.Copy(S,1,I - 1);
      };
      aInfo.format = S;
      return Result;
    };
    $impl.HasTemplate = function () {
      var Result = false;
      return ('content' in document.createElement('template'));
      Result = false;
      return Result;
    };
  };
},["SysUtils","JS","Web"]);
//# sourceMappingURL=p2jsres.js.map
