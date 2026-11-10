rtl.module("AppHost",["System","Classes","SysUtils","Controls"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.$rtti.$ClassRef("TScreenClass",{instancetype: pas.Controls.$rtti["TControl"]});
  rtl.createClass(this,"TAppHost",pas.System.TObject,function () {
    this.Content = null;
    this.UserName = "";
    this.RegisterScreen = function (ACaption, AClass) {
      var Entry = null;
      if (!($impl.Screens != null)) $impl.Screens = pas.Classes.TList.$create("Create$1");
      Entry = $impl.TScreenEntry.$create("Create");
      Entry.Caption = ACaption;
      Entry.ControlClass = AClass;
      $impl.Screens.Add(Entry);
    };
    this.ScreenCount = function () {
      var Result = 0;
      if ($impl.Screens != null) {
        Result = $impl.Screens.GetCount()}
       else Result = 0;
      return Result;
    };
    this.ScreenCaption = function (AIndex) {
      var Result = "";
      if (($impl.Screens != null) && (AIndex >= 0) && (AIndex < $impl.Screens.GetCount())) {
        Result = rtl.getObject($impl.Screens.Get(AIndex)).Caption}
       else Result = "";
      return Result;
    };
    this.ScreenClass = function (AIndex) {
      var Result = null;
      if (($impl.Screens != null) && (AIndex >= 0) && (AIndex < $impl.Screens.GetCount())) {
        Result = rtl.getObject($impl.Screens.Get(AIndex)).ControlClass}
       else Result = null;
      return Result;
    };
  });
  $mod.$implcode = function () {
    rtl.createClass($impl,"TScreenEntry",pas.System.TObject,function () {
      this.$init = function () {
        pas.System.TObject.$init.call(this);
        this.Caption = "";
        this.ControlClass = null;
      };
      this.$final = function () {
        this.ControlClass = undefined;
        pas.System.TObject.$final.call(this);
      };
    });
    $impl.Screens = null;
  };
},[]);
//# sourceMappingURL=apphost.js.map
