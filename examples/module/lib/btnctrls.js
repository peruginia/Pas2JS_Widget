rtl.module("BtnCtrls",["System","Classes","SysUtils","Types","Web","Graphics","Controls","StdCtrls"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TCustomFileButton",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FFileSelect = null;
      this.FFilter = "";
      this.FOnChange = null;
      this.FOpendDialogElement = null;
    };
    this.$final = function () {
      this.FFileSelect = undefined;
      this.FOnChange = undefined;
      this.FOpendDialogElement = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.SetFilter = function (AValue) {
      if (this.FFilter !== AValue) {
        this.FFilter = AValue;
        this.Changed();
      };
    };
    this.Change = function () {
      if (this.FOnChange != null) {
        this.FOnChange(this);
      };
    };
    this.HandleClick = function (AEvent) {
      var Result = false;
      Result = pas.Controls.TControl.HandleClick.call(this,AEvent);
      if (this.FOpendDialogElement != null) {
        this.FOpendDialogElement.click();
      };
      return Result;
    };
    this.HandleChange = function (AEvent) {
      var Result = false;
      var VFile = null;
      var VList = null;
      if (rtl.isExt(AEvent.target,HTMLInputElement)) {
        VList = AEvent.target.files;
        if (VList.length === 0) {
          this.FFileSelect = null;
          this.SetText(rtl.getResStr(pas.WCLStrConsts,"rsFileButtonNoFileSelected"));
          this.Changed();
          return false;
        };
        VFile = VList.item(0);
        this.FFileSelect = VFile;
        this.SetText(VFile.name);
        this.SetHint(VFile.name);
        this.Changed();
        this.Change();
        Result = true;
      };
      return Result;
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        $with.style.setProperty("padding","0");
        $with.innerHTML = this.GetText();
        if (this.FOpendDialogElement != null) {
          var $with1 = this.FOpendDialogElement;
          $with1.accept = this.FFilter;
          $with1.type = "file";
        };
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("button");
      return Result;
    };
    this.CreateOpendDialogElement = function () {
      var Result = null;
      Result = this.FHandleElement.appendChild(document.createElement("input"));
      return Result;
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 80;
      Result.cy = 25;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FOpendDialogElement = this.CreateOpendDialogElement();
      this.FOpendDialogElement.addEventListener("change",rtl.createCallback(this,"HandleChange"));
      this.FFilter = "";
      this.FFileSelect = null;
      this.BeginUpdate();
      try {
        this.SetText(rtl.getResStr(pas.WCLStrConsts,"rsFileButtonNoFileSelected"));
        this.SetHint(this.GetText());
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      if (this.FOpendDialogElement != null) {
        this.FOpendDialogElement.removeEventListener("change",rtl.createCallback(this,"HandleChange"));
      };
      pas.Controls.TControl.Destroy.call(this);
    };
    this.AdjustSize = function () {
      var VSize = pas.Types.TSize.$new();
      pas.Controls.TControl.AdjustSize.call(this);
      VSize.$assign(this.FFont.TextExtent(this.GetText()));
      this.SetBounds(this.FLeft,this.FTop,VSize.cx,VSize.cy);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
},["WCLStrConsts"]);
//# sourceMappingURL=btnctrls.js.map
