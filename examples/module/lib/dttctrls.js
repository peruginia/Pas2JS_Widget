rtl.module("DttCtrls",["System","Classes","SysUtils","Types","Graphics","StdCtrls"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TCustomDateTimeEdit",pas.StdCtrls.TCustomEdit,function () {
    this.DoEnter = function () {
      pas.StdCtrls.TCustomEdit.DoEnter.call(this);
      this.RealSetText(this.RealGetText());
    };
    this.DoExit = function () {
      pas.Controls.TWinControl.DoExit.call(this);
      this.RealSetText(this.RealGetText());
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  rtl.createClass(this,"TCustomDateTimePicker",pas.StdCtrls.TCustomEdit,function () {
    this.GetValue = function () {
      var Result = 0.0;
      var VText = "";
      var VDateTime = 0.0;
      VText = this.RealGetText();
      if (VText === "") {
        Result = 0}
       else {
        VText = pas.SysUtils.StringReplace(VText,"T"," ",{});
        if (!pas.SysUtils.TryStrToDateTime(VText,{get: function () {
            return VDateTime;
          }, set: function (v) {
            VDateTime = v;
          }})) {
          Result = 0}
         else Result = VDateTime;
      };
      return Result;
    };
    this.SetValue = function (AValue) {
      if (AValue === 0) {
        this.RealSetText("")}
       else this.RealSetText(pas.SysUtils.FormatDateTime("yyyy-mm-dd",AValue) + "T" + pas.SysUtils.FormatDateTime("hh:nn",AValue));
    };
    this.GetInputType = function () {
      var Result = "";
      Result = "datetime-local";
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
});
//# sourceMappingURL=dttctrls.js.map
