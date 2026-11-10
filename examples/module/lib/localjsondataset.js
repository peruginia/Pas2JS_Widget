rtl.module("localjsondataset",["System","Classes","SysUtils","DB","JSONDataset","JS","Web"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.TStorageKind = {"0": "skLocal", skLocal: 0, "1": "skSession", skSession: 1};
  this.$rtti.$Enum("TStorageKind",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TStorageKind});
  this.TStorageOption = {"0": "soAutoLoad", soAutoLoad: 0, "1": "soAutoSave", soAutoSave: 1};
  this.$rtti.$Enum("TStorageOption",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TStorageOption});
  this.$rtti.$Set("TStorageOptions",{comptype: this.$rtti["TStorageOption"]});
  rtl.createClass(this,"TCustomLocalJSONDataset",pas.JSONDataset.TJSONDataset,function () {
    this.$init = function () {
      pas.JSONDataset.TJSONDataset.$init.call(this);
      this.FDataElement = "";
      this.FStorageKey = "";
      this.FStorageKind = 0;
      this.FStorageOptions = {};
    };
    this.$final = function () {
      this.FStorageOptions = undefined;
      pas.JSONDataset.TJSONDataset.$final.call(this);
    };
    this.GetAutoLoad = function () {
      var Result = false;
      Result = $mod.TStorageOption.soAutoLoad in this.FStorageOptions;
      return Result;
    };
    this.GetAutoSave = function () {
      var Result = false;
      Result = $mod.TStorageOption.soAutoSave in this.FStorageOptions;
      return Result;
    };
    this.GetStorage = function () {
      var Result = null;
      if (this.FStorageKind === $mod.TStorageKind.skLocal) {
        Result = window.localStorage}
       else Result = window.sessionStorage;
      return Result;
    };
    this.GetStorageKey = function () {
      var Result = "";
      Result = this.FStorageKey;
      if (Result === "") Result = this.FName;
      if (Result === "") {
        this.FStorageKey = this.$classname + pas.SysUtils.IntToStr((new Date()).getTime());
        Result = this.FStorageKey;
      };
      return Result;
    };
    this.IsKeyStored = function () {
      var Result = false;
      Result = this.FStorageKey !== this.FName;
      return Result;
    };
    this.SetDataElement = function (AValue) {
      if (this.FDataElement === AValue) return;
      this.CheckInactive();
      this.FDataElement = AValue;
    };
    this.SetStorageKey = function (AValue) {
      if (this.FStorageKey === AValue) return;
      this.FStorageKey = AValue;
    };
    this.SetStorageKind = function (AValue) {
      if (this.FStorageKind === AValue) return;
      this.CheckInactive();
      this.FStorageKind = AValue;
    };
    this.SetStorageOptions = function (AValue) {
      if (rtl.eqSet(this.FStorageOptions,AValue)) return;
      this.CheckInactive();
      this.FStorageOptions = rtl.refSet(AValue);
    };
    this.InternalOpen = function () {
      if (this.GetAutoLoad()) this.LoadDataFromStorage();
      pas.JSONDataset.TBaseJSONDataSet.InternalOpen.call(this);
    };
    this.InternalClose = function () {
      if (this.GetAutoSave()) this.SaveDataToStorage();
      pas.JSONDataset.TBaseJSONDataSet.InternalClose.call(this);
    };
    this.LoadDataFromStorage = function () {
      var S = "";
      var P = "";
      var value = undefined;
      this.SetRows(new Array());
      S = this.GetStorage().getItem(this.GetStorageKey());
      if (S !== "") {
        value = JSON.parse(S);
        if (rtl.isArray(value)) {
          this.SetRows(value)}
         else if (!rtl.isObject(value)) {
          pas.DB.DatabaseErrorFmt$1(rtl.getResStr($mod,"SErrStorageNotArray"),pas.System.VarRecs(18,this.GetStorageKey()),this)}
         else {
          P = this.FDataElement;
          if (P === "") P = "data";
          value = value[P];
          if (!rtl.isArray(value)) pas.DB.DatabaseErrorFmt$1(rtl.getResStr($mod,"SErrElementNotArray"),pas.System.VarRecs(18,P),this);
          this.SetRows(value);
        };
      };
    };
    this.SaveDataToStorage = function () {
      var CleanRows = null;
      var i = 0;
      var CurrentRow = undefined;
      var S = "";
      var J = null;
      CleanRows = new Array();
      for (var $l = 0, $end = this.FRows.length - 1; $l <= $end; $l++) {
        i = $l;
        CurrentRow = this.FRows[i];
        if (!(pas.JS.isUndefined(CurrentRow) || pas.JS.isNull(CurrentRow))) {
          CleanRows.push(CurrentRow);
        };
      };
      if (this.FDataElement !== "") {
        J = new Object();
        J[this.FDataElement] = CleanRows;
        S = JSON.stringify(J);
      } else S = JSON.stringify(CleanRows);
      this.GetStorage().setItem(this.GetStorageKey(),S);
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  rtl.createClass(this,"TLocalJSONDataset",this.TCustomLocalJSONDataset,function () {
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("DataElement",2,rtl.string,"FDataElement","SetDataElement");
    $r.addProperty("AutoLoad",1,rtl.boolean,"GetAutoLoad","");
    $r.addProperty("StorageKey",15,rtl.string,"GetStorageKey","SetStorageKey",{stored: "IsKeyStored"});
    $r.addProperty("StorageKind",2,$mod.$rtti["TStorageKind"],"FStorageKind","SetStorageKind");
    $r.addProperty("Options",2,$mod.$rtti["TStorageOptions"],"FStorageOptions","SetStorageOptions");
  });
  $mod.$implcode = function () {
    $mod.$resourcestrings = {SErrStorageNotArray: {org: "Storage data %s is not an array"}, SErrElementNotArray: {org: 'Storage object property "%s" is not an array'}};
  };
},[]);
//# sourceMappingURL=localjsondataset.js.map
