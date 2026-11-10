rtl.module("NumCtrls",["System","Classes","SysUtils","Types","Graphics","Controls","StdCtrls","Web"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  rtl.createClass(this,"TCustomNumericEdit",pas.StdCtrls.TCustomEdit,function () {
    this.$init = function () {
      pas.StdCtrls.TCustomEdit.$init.call(this);
      this.FDecimals = 0;
      this.FIncrement = 0.0;
      this.FMaxValue = 0.0;
      this.FMinValue = 0.0;
    };
    this.SetIncrement = function (AValue) {
      if ((this.FIncrement !== AValue) && (AValue > 0)) {
        this.FIncrement = AValue;
        this.Changed();
      };
    };
    this.SetMaxValue = function (AValue) {
      if (this.FMaxValue !== AValue) {
        this.FMaxValue = AValue;
        if ((this.FMinValue !== 0) && (this.FMaxValue !== 0) && (this.FMinValue > this.FMaxValue)) this.FMinValue = this.FMaxValue;
      };
    };
    this.SetMinValue = function (AValue) {
      if (this.FMinValue !== AValue) {
        this.FMinValue = AValue;
        if ((this.FMinValue !== 0) && (this.FMaxValue !== 0) && (this.FMinValue > this.FMaxValue)) this.FMaxValue = this.FMinValue;
      };
    };
    this.DoEnter = function () {
      pas.StdCtrls.TCustomEdit.DoEnter.call(this);
      this.RealSetText(this.RealGetText());
    };
    this.DoExit = function () {
      var VVal = 0.0;
      VVal = pas.SysUtils.StrToFloatDef(this.RealGetText(),0);
      if ((this.FMinValue !== 0) && (VVal < this.FMinValue)) {
        VVal = this.FMinValue;
        this.RealSetText(pas.SysUtils.FloatToStrF(VVal,pas.SysUtils.TFloatFormat.ffFixed,15,this.FDecimals));
      };
      if ((this.FMaxValue !== 0) && (VVal > this.FMaxValue)) {
        VVal = this.FMaxValue;
        this.RealSetText(pas.SysUtils.FloatToStrF(VVal,pas.SysUtils.TFloatFormat.ffFixed,15,this.FDecimals));
      };
      pas.Controls.TWinControl.DoExit.call(this);
      this.RealSetText(this.RealGetText());
    };
    this.DoInput = function (ANewValue) {
      var VDiff = "";
      var VOldValue = "";
      VOldValue = this.RealGetText();
      if (ANewValue.length >= VOldValue.length) {
        VDiff = pas.SysUtils.StringReplace(ANewValue,VOldValue,"",{});
        if (VDiff === pas.SysUtils.DecimalSeparator) {
          if (this.FDecimals === 0) {
            VDiff = "";
          };
          if (pas.System.Pos(VDiff,VOldValue) > 0) {
            VDiff = "";
          };
        };
        if (!(VDiff.charCodeAt(0) in rtl.createSet(null,48,57,pas.SysUtils.DecimalSeparator.charCodeAt()))) {
          this.FHandleElement.value = VOldValue;
          ANewValue = VOldValue;
        };
      };
      pas.StdCtrls.TCustomEdit.DoInput.call(this,ANewValue);
    };
    this.GetInputType = function () {
      var Result = "";
      Result = "text";
      return Result;
    };
    this.GetInputMode = function () {
      var Result = "";
      Result = "numeric";
      return Result;
    };
    this.Changed = function () {
      pas.StdCtrls.TCustomEdit.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        $with.inputMode = this.GetInputMode();
        if (this.FIncrement > 0) this.FHandleElement.step = this.FIncrement;
        if (this.FMinValue !== 0) this.FHandleElement.min = this.FMinValue;
        if (this.FMaxValue !== 0) this.FHandleElement.max = this.FMaxValue;
      };
    };
    this.Create$1 = function (AOwner) {
      pas.StdCtrls.TCustomEdit.Create$1.call(this,AOwner);
      this.FDecimals = 2;
      this.FIncrement = 1;
      this.FMaxValue = 0;
      this.FMinValue = 0;
      this.BeginUpdate();
      try {
        this.SetAlignment(pas.Classes.TAlignment.taRightJustify);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TCustomSpinEdit",this.TCustomNumericEdit,function () {
    this.GetValue = function () {
      var Result = 0;
      Result = pas.System.Trunc(pas.SysUtils.StrToFloatDef(this.RealGetText(),0));
      return Result;
    };
    this.SetValue = function (AValue) {
      this.RealSetText(pas.SysUtils.IntToStr(AValue));
      this.Change();
    };
    this.GetInputType = function () {
      var Result = "";
      Result = "number";
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  rtl.createClass(this,"TSpinEdit",this.TCustomSpinEdit,function () {
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("Align",2,pas.Controls.$rtti["TAlign"],"FAlign","SetAlign");
    $r.addProperty("Alignment",2,pas.Classes.$rtti["TAlignment"],"FAlignment","SetAlignment");
    $r.addProperty("Anchors",14,pas.Controls.$rtti["TAnchors"],"FAnchors","SetAnchors",{stored: "IsAnchorsStored", Default: rtl.createSet(pas.Controls.TAnchorKind.akLeft,pas.Controls.TAnchorKind.akTop)});
    $r.addProperty("AutoSize",2,rtl.boolean,"FAutoSize","SetAutoSize",{Default: false});
    $r.addProperty("BorderSpacing",2,pas.Controls.$rtti["TControlBorderSpacing"],"FBorderSpacing","SetBorderSpacing");
    $r.addProperty("BorderStyle",2,pas.Controls.$rtti["TBorderStyle"],"FBorderStyle","SetBorderStyle");
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("Enabled",2,rtl.boolean,"FEnabled","SetEnabled");
    $r.addProperty("Font",2,pas.Graphics.$rtti["TFont"],"FFont","SetFont");
    $r.addProperty("HandleClass",2,rtl.string,"FHandleClass","SetHandleClass");
    $r.addProperty("HandleId",2,rtl.string,"FHandleId","SetHandleId");
    $r.addProperty("Increment",2,rtl.double,"FIncrement","SetIncrement");
    $r.addProperty("MaxValue",2,rtl.double,"FMaxValue","SetMaxValue");
    $r.addProperty("MinValue",2,rtl.double,"FMinValue","SetMinValue");
    $r.addProperty("ParentColor",2,rtl.boolean,"FParentColor","SetParentColor");
    $r.addProperty("ParentFont",2,rtl.boolean,"FParentFont","SetParentFont");
    $r.addProperty("ParentShowHint",2,rtl.boolean,"FParentShowHint","SetParentShowHint");
    $r.addProperty("ReadOnly",2,rtl.boolean,"FReadOnly","SetReadOnly");
    $r.addProperty("ShowHint",2,rtl.boolean,"FShowHint","SetShowHint");
    $r.addProperty("TabOrder",2,rtl.nativeint,"FTabOrder","SetTabOrder");
    $r.addProperty("TabStop",2,rtl.boolean,"FTabStop","SetTabStop");
    $r.addProperty("Text",3,pas.Controls.$rtti["TCaption"],"GetText","SetText");
    $r.addProperty("TextHint",2,rtl.string,"FTextHint","SetTextHint");
    $r.addProperty("Value",3,rtl.nativeint,"GetValue","SetValue");
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible");
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
    $r.addProperty("OnClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnClick","FOnClick");
    $r.addProperty("OnDblClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnDblClick","FOnDblClick");
    $r.addProperty("OnEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnEnter","FOnEnter");
    $r.addProperty("OnExit",0,pas.Classes.$rtti["TNotifyEvent"],"FOnExit","FOnExit");
    $r.addProperty("OnKeyDown",0,pas.Controls.$rtti["TKeyEvent"],"FOnKeyDown","FOnKeyDown");
    $r.addProperty("OnKeyPress",0,pas.Controls.$rtti["TKeyPressEvent"],"FOnKeyPress","FOnKeyPress");
    $r.addProperty("OnKeyUp",0,pas.Controls.$rtti["TKeyEvent"],"FOnKeyUp","FOnKeyUp");
    $r.addProperty("OnMouseDown",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseDown","FOnMouseDown");
    $r.addProperty("OnMouseEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseEnter","FOnMouseEnter");
    $r.addProperty("OnMouseLeave",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseLeave","FOnMouseLeave");
    $r.addProperty("OnMouseMove",0,pas.Controls.$rtti["TMouseMoveEvent"],"FOnMouseMove","FOnMouseMove");
    $r.addProperty("OnMouseUp",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseUp","FOnMouseUp");
  });
  this.TUpDownDirection = {"0": "updNone", updNone: 0, "1": "updUp", updUp: 1, "2": "updDown", updDown: 2};
  this.$rtti.$Enum("TUpDownDirection",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TUpDownDirection});
  this.TUDBtnType = {"0": "btNext", btNext: 0, "1": "btPrev", btPrev: 1};
  this.$rtti.$Enum("TUDBtnType",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TUDBtnType});
  this.TUDOrientation = {"0": "udHorizontal", udHorizontal: 0, "1": "udVertical", udVertical: 1};
  this.$rtti.$Enum("TUDOrientation",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TUDOrientation});
  this.$rtti.$MethodVar("TUDClickEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Button",this.$rtti["TUDBtnType"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TUDChangingEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["AllowChange",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TUDChangingEventEx",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["AllowChange",rtl.boolean,1],["NewValue",rtl.longint],["Direction",this.$rtti["TUpDownDirection"]]]), methodkind: 0});
  rtl.createClass(this,"TUpDown",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FAssociate = null;
      this.FDownButton = null;
      this.FIncrement = 0;
      this.FMax = 0;
      this.FMin = 0;
      this.FOrientation = 0;
      this.FPosition = 0;
      this.FThousands = false;
      this.FUpButton = null;
      this.FWrap = false;
      this.FOnChanging = null;
      this.FOnChangingEx = null;
      this.FOnClick$1 = null;
    };
    this.$final = function () {
      this.FAssociate = undefined;
      this.FDownButton = undefined;
      this.FUpButton = undefined;
      this.FOnChanging = undefined;
      this.FOnChangingEx = undefined;
      this.FOnClick$1 = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.GetPosition = function () {
      var Result = 0;
      if (this.FAssociate != null) {
        Result = pas.SysUtils.StrToIntDef(this.FAssociate.GetText(),this.FPosition)}
       else Result = this.FPosition;
      return Result;
    };
    this.SetAssociate = function (AValue) {
      if (this.FAssociate === AValue) return;
      if (this.FAssociate != null) this.FAssociate.RemoveFreeNotification(this);
      this.FAssociate = AValue;
      if (this.FAssociate != null) {
        this.FAssociate.FreeNotification(this);
        this.FPosition = this.GetPosition();
      };
    };
    this.SetIncrement = function (AValue) {
      if (AValue < 1) AValue = 1;
      if (this.FIncrement !== AValue) this.FIncrement = AValue;
    };
    this.SetMax = function (AValue) {
      if (AValue < this.FMin) AValue = this.FMin;
      if (this.FMax !== AValue) {
        this.FMax = AValue;
        if (this.GetPosition() > this.FMax) this.SetPosition(this.FMax);
      };
    };
    this.SetMin = function (AValue) {
      if (AValue > this.FMax) AValue = this.FMax;
      if (this.FMin !== AValue) {
        this.FMin = AValue;
        if (this.GetPosition() < this.FMin) this.SetPosition(this.FMin);
      };
    };
    this.SetOrientation = function (AValue) {
      if (this.FOrientation !== AValue) {
        this.FOrientation = AValue;
        this.Changed();
      };
    };
    this.SetPosition = function (AValue) {
      if (AValue < this.FMin) AValue = this.FMin;
      if (AValue > this.FMax) AValue = this.FMax;
      this.FPosition = AValue;
      if (this.FAssociate != null) this.FAssociate.SetText(pas.SysUtils.IntToStr(AValue));
    };
    this.SetThousands = function (AValue) {
      this.FThousands = AValue;
    };
    this.SetWrap = function (AValue) {
      this.FWrap = AValue;
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FHandleElement.classList.add("wcl-updown");
        if (this.FOrientation === $mod.TUDOrientation.udHorizontal) {
          this.FHandleElement.classList.add("wcl-updown-horizontal")}
         else this.FHandleElement.classList.remove("wcl-updown-horizontal");
        if (this.FOrientation === $mod.TUDOrientation.udHorizontal) {
          this.FDownButton.textContent = "◀";
          this.FUpButton.textContent = "▶";
        } else {
          this.FUpButton.textContent = "▲";
          this.FDownButton.textContent = "▼";
        };
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      this.FUpButton = document.createElement("button");
      this.FUpButton.classList.add("wcl-updown-btn");
      this.FUpButton.setAttribute("type","button");
      Result.appendChild(this.FUpButton);
      this.FDownButton = document.createElement("button");
      this.FDownButton.classList.add("wcl-updown-btn");
      this.FDownButton.setAttribute("type","button");
      Result.appendChild(this.FDownButton);
      return Result;
    };
    this.RegisterHandleEvents = function () {
      pas.Controls.TWinControl.RegisterHandleEvents.call(this);
      this.FUpButton.addEventListener("click",rtl.createCallback(this,"HandleUpClick"));
      this.FDownButton.addEventListener("click",rtl.createCallback(this,"HandleDownClick"));
    };
    this.UnRegisterHandleEvents = function () {
      pas.Controls.TWinControl.UnRegisterHandleEvents.call(this);
      this.FUpButton.removeEventListener("click",rtl.createCallback(this,"HandleUpClick"));
      this.FDownButton.removeEventListener("click",rtl.createCallback(this,"HandleDownClick"));
    };
    this.Notification = function (AComponent, Operation) {
      pas.Controls.TControl.Notification.call(this,AComponent,Operation);
      if ((Operation === pas.Classes.TOperation.opRemove) && (AComponent === this.FAssociate)) this.FAssociate = null;
    };
    this.HandleUpClick = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.Click$1($mod.TUDBtnType.btNext);
      Result = true;
      return Result;
    };
    this.HandleDownClick = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.Click$1($mod.TUDBtnType.btPrev);
      Result = true;
      return Result;
    };
    this.Click$1 = function (AButton) {
      var VAllow = false;
      var VDirection = 0;
      var VNew = 0;
      VNew = this.GetPosition();
      if (AButton === $mod.TUDBtnType.btNext) {
        VNew += this.FIncrement;
        VDirection = $mod.TUpDownDirection.updUp;
      } else {
        VNew -= this.FIncrement;
        VDirection = $mod.TUpDownDirection.updDown;
      };
      if (this.FWrap) {
        if (VNew > this.FMax) VNew = this.FMin;
        if (VNew < this.FMin) VNew = this.FMax;
      } else {
        if (VNew < this.FMin) VNew = this.FMin;
        if (VNew > this.FMax) VNew = this.FMax;
      };
      VAllow = true;
      if (this.FOnChanging != null) this.FOnChanging(this,{get: function () {
          return VAllow;
        }, set: function (v) {
          VAllow = v;
        }});
      if (VAllow && (this.FOnChangingEx != null)) this.FOnChangingEx(this,{get: function () {
          return VAllow;
        }, set: function (v) {
          VAllow = v;
        }},VNew,VDirection);
      if (VAllow) {
        this.SetPosition(VNew);
        if (this.FOnClick$1 != null) this.FOnClick$1(this,AButton);
      };
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 24;
      Result.cy = 40;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      $impl._RegisterWCLNumRules();
      this.FAssociate = null;
      this.FIncrement = 1;
      this.FMax = 100;
      this.FMin = 0;
      this.FOrientation = $mod.TUDOrientation.udVertical;
      this.FPosition = 0;
      this.FThousands = true;
      this.FWrap = false;
      this.BeginUpdate();
      try {
        this.SetTabStop(true);
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      if (this.FAssociate != null) this.FAssociate.RemoveFreeNotification(this);
      this.FAssociate = null;
      pas.Controls.TControl.Destroy.call(this);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Associate",2,pas.Controls.$rtti["TWinControl"],"FAssociate","SetAssociate");
    $r.addProperty("Increment",2,rtl.longint,"FIncrement","SetIncrement",{Default: 1});
    $r.addProperty("Max",2,rtl.longint,"FMax","SetMax",{Default: 100});
    $r.addProperty("Min",2,rtl.longint,"FMin","SetMin",{Default: 0});
    $r.addProperty("Orientation",2,$mod.$rtti["TUDOrientation"],"FOrientation","SetOrientation",{Default: $mod.TUDOrientation.udVertical});
    $r.addProperty("Position",3,rtl.longint,"GetPosition","SetPosition");
    $r.addProperty("Thousands",2,rtl.boolean,"FThousands","SetThousands",{Default: true});
    $r.addProperty("Wrap",2,rtl.boolean,"FWrap","SetWrap",{Default: false});
    $r.addProperty("OnChanging",0,$mod.$rtti["TUDChangingEvent"],"FOnChanging","FOnChanging");
    $r.addProperty("OnChangingEx",0,$mod.$rtti["TUDChangingEventEx"],"FOnChangingEx","FOnChangingEx");
    $r.addProperty("OnClick",0,$mod.$rtti["TUDClickEvent"],"FOnClick$1","FOnClick$1");
  });
  $mod.$implcode = function () {
    $impl._WCLNumRulesRegistered = false;
    $impl._RegisterWCLNumRules = function () {
      if ($impl._WCLNumRulesRegistered) return;
      pas.Controls.RegisterWCLStyle(".wcl-updown{" + "display:flex;" + "flex-direction:column;" + "box-sizing:border-box;" + "border:1px solid #888;" + "border-radius:4px;" + "overflow:hidden;" + "background:#f0f0f0;}" + ".wcl-updown-horizontal{" + "flex-direction:row;}" + ".wcl-updown-btn{" + "flex:1;" + "min-width:0;" + "min-height:0;" + "border:0;" + "background:transparent;" + "cursor:pointer;" + "font-size:10px;" + "line-height:1;" + "padding:0;" + "color:#333;" + "touch-action:manipulation;" + "-webkit-tap-highlight-color:transparent;}" + "@media(hover:hover){" + ".wcl-updown-btn:hover{background:#e0e0e0;}" + "}" + ".wcl-updown-btn:active{" + "background:#d0d0d0;}" + "@media(pointer:coarse){" + ".wcl-updown-btn{font-size:12px;}" + "}");
      $impl._WCLNumRulesRegistered = true;
    };
  };
},[]);
//# sourceMappingURL=numctrls.js.map
