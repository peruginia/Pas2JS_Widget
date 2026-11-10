rtl.module("ActnList",["System","Classes","SysUtils","Generics.Collections","Controls"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TAction",pas.Controls.TBasicAction,function () {
    this.$init = function () {
      pas.Controls.TBasicAction.$init.call(this);
      this.FOnExecute = null;
    };
    this.$final = function () {
      this.FOnExecute = undefined;
      pas.Controls.TBasicAction.$final.call(this);
    };
    this.Execute = function () {
      var Result = false;
      if (this.FOnExecute != null) this.FOnExecute(this);
      Result = true;
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("OnExecute",0,pas.Classes.$rtti["TNotifyEvent"],"FOnExecute","FOnExecute");
  });
  rtl.createClass(this,"TActionList",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FActions = null;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FActions = undefined;
      this.FOnChange = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.GetAction = function (AIndex) {
      var Result = null;
      Result = this.FActions.GetItem(AIndex);
      return Result;
    };
    this.GetActionCount = function () {
      var Result = 0;
      Result = this.FActions.FLength;
      return Result;
    };
    this.SetOnChange = function (AValue) {
      this.FOnChange = AValue;
    };
    this.GetChildOwner = function () {
      var Result = null;
      Result = this;
      return Result;
    };
    this.GetChildParent = function () {
      var Result = null;
      Result = null;
      return Result;
    };
    this.Notification = function (AComponent, Operation) {
      pas.Classes.TComponent.Notification.call(this,AComponent,Operation);
      if ($mod.TAction.isPrototypeOf(AComponent) && (this.FActions != null) && (AComponent.FOwner === this)) {
        if (Operation === pas.Classes.TOperation.opInsert) {
          this.FActions.Add(AComponent)}
         else this.FActions.Remove(AComponent);
        if (this.FOnChange != null) this.FOnChange(this);
      };
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FActions = pas["Generics.Collections"].TList$G5.$create("Create$1");
      this.FOnChange = null;
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FActions");
      this.FActions = null;
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.AddAction = function () {
      var Result = null;
      Result = $mod.TAction.$create("Create$1",[this]);
      return Result;
    };
    this.ActionByName = function (AName) {
      var Result = null;
      var VIndex = 0;
      Result = null;
      for (var $l = 0, $end = this.FActions.FLength - 1; $l <= $end; $l++) {
        VIndex = $l;
        if (pas.SysUtils.SameText(this.FActions.GetItem(VIndex).FName,AName)) {
          Result = this.FActions.GetItem(VIndex);
          return Result;
        };
      };
      return Result;
    };
    this.IndexOf = function (AAction) {
      var Result = 0;
      Result = this.FActions.IndexOf(AAction);
      return Result;
    };
    this.Update = function () {
      var VIndex = 0;
      for (var $l = 0, $end = this.FActions.FLength - 1; $l <= $end; $l++) {
        VIndex = $l;
        this.FActions.GetItem(VIndex).Update();
      };
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("OnChange",2,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","SetOnChange");
  });
  $mod.$init = function () {
    pas.Classes.RegisterClass($mod.TAction);
  };
});
//# sourceMappingURL=actnlist.js.map
