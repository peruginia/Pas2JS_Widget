rtl.module("StdCtrls",["System","Classes","SysUtils","Types","Web","WebExtra","Graphics","Controls","Forms"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.TEditCharCase = {"0": "ecNormal", ecNormal: 0, "1": "ecUppercase", ecUppercase: 1, "2": "ecLowerCase", ecLowerCase: 2};
  this.$rtti.$Enum("TEditCharCase",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TEditCharCase});
  this.TEditInputType = {"0": "itText", itText: 0, "1": "itEmail", itEmail: 1, "2": "itTel", itTel: 2, "3": "itUrl", itUrl: 3, "4": "itSearch", itSearch: 4};
  this.$rtti.$Enum("TEditInputType",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TEditInputType});
  this.TScrollStyle = {"0": "ssNone", ssNone: 0, "1": "ssHorizontal", ssHorizontal: 1, "2": "ssVertical", ssVertical: 2, "3": "ssBoth", ssBoth: 3, "4": "ssAutoHorizontal", ssAutoHorizontal: 4, "5": "ssAutoVertical", ssAutoVertical: 5, "6": "ssAutoBoth", ssAutoBoth: 6};
  this.$rtti.$Enum("TScrollStyle",{minvalue: 0, maxvalue: 6, ordtype: 1, enumtype: this.TScrollStyle});
  this.TScrollBarKind = {"0": "sbHorizontal", sbHorizontal: 0, "1": "sbVertical", sbVertical: 1};
  this.$rtti.$Enum("TScrollBarKind",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TScrollBarKind});
  this.$rtti.$Int("TScrollBarInc",{minvalue: 1, maxvalue: 32768, ordtype: 3});
  this.TScrollCode = {"0": "scLineUp", scLineUp: 0, "1": "scLineDown", scLineDown: 1, "2": "scPageUp", scPageUp: 2, "3": "scPageDown", scPageDown: 3, "4": "scPosition", scPosition: 4, "5": "scTrack", scTrack: 5, "6": "scTop", scTop: 6, "7": "scBottom", scBottom: 7, "8": "scEndScroll", scEndScroll: 8};
  this.$rtti.$Enum("TScrollCode",{minvalue: 0, maxvalue: 8, ordtype: 1, enumtype: this.TScrollCode});
  this.$rtti.$MethodVar("TScrollEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["ScrollCode",this.$rtti["TScrollCode"]],["ScrollPos",rtl.longint,1]]), methodkind: 0});
  rtl.createClass(this,"TCustomScrollBar",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FInput = null;
      this.FKind = 0;
      this.FLargeChange = 0;
      this.FMax = 0;
      this.FMin = 0;
      this.FOnChange = null;
      this.FOnScroll$1 = null;
      this.FPageSize = 0;
      this.FPosition = 0;
      this.FSmallChange = 0;
    };
    this.$final = function () {
      this.FInput = undefined;
      this.FOnChange = undefined;
      this.FOnScroll$1 = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.SetKind = function (AValue) {
      if (this.FKind !== AValue) {
        this.FKind = AValue;
        this.Changed();
      };
    };
    this.SetLargeChange = function (AValue) {
      if (AValue < 1) AValue = 1;
      if (AValue > 32768) AValue = 32768;
      if (this.FLargeChange !== AValue) {
        this.FLargeChange = AValue;
        this.Changed();
      };
    };
    this.SetMax = function (AValue) {
      if (AValue < this.FMin) AValue = this.FMin;
      if (this.FMax !== AValue) {
        this.FMax = AValue;
        if (this.FPosition > this.FMax) this.FPosition = this.FMax;
        this.Changed();
      };
    };
    this.SetMin = function (AValue) {
      if (AValue > this.FMax) AValue = this.FMax;
      if (this.FMin !== AValue) {
        this.FMin = AValue;
        if (this.FPosition < this.FMin) this.FPosition = this.FMin;
        this.Changed();
      };
    };
    this.SetPageSize = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FPageSize !== AValue) {
        this.FPageSize = AValue;
        this.Changed();
      };
    };
    this.SetPosition = function (AValue) {
      if (AValue < this.FMin) AValue = this.FMin;
      if (AValue > this.FMax) AValue = this.FMax;
      if (this.FPosition !== AValue) {
        this.FPosition = AValue;
        this.Changed();
      };
    };
    this.SetSmallChange = function (AValue) {
      if (AValue < 1) AValue = 1;
      if (AValue > 32768) AValue = 32768;
      if (this.FSmallChange !== AValue) {
        this.FSmallChange = AValue;
        this.Changed();
      };
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FHandleElement.classList.add("wcl-scrollbar");
        if (this.FKind === $mod.TScrollBarKind.sbVertical) {
          this.FHandleElement.classList.add("wcl-scrollbar-vertical")}
         else this.FHandleElement.classList.remove("wcl-scrollbar-vertical");
        this.FInput.min = pas.SysUtils.IntToStr(this.FMin);
        this.FInput.max = pas.SysUtils.IntToStr(this.FMax);
        this.FInput.step = pas.SysUtils.IntToStr(this.FSmallChange);
        this.FInput.value = pas.SysUtils.IntToStr(this.FPosition);
        this.FInput.setAttribute("aria-label",this.FName);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      this.FInput = document.createElement("input");
      this.FInput.type = "range";
      Result.appendChild(this.FInput);
      return Result;
    };
    this.RegisterHandleEvents = function () {
      pas.Controls.TWinControl.RegisterHandleEvents.call(this);
      this.FInput.addEventListener("input",rtl.createCallback(this,"HandleInput"));
    };
    this.UnRegisterHandleEvents = function () {
      pas.Controls.TWinControl.UnRegisterHandleEvents.call(this);
      this.FInput.removeEventListener("input",rtl.createCallback(this,"HandleInput"));
    };
    this.HandleInput = function (AEvent) {
      var Result = false;
      var VPos = 0;
      AEvent.stopPropagation();
      VPos = pas.SysUtils.StrToIntDef(this.FInput.value,this.FMin);
      if (VPos < this.FMin) VPos = this.FMin;
      if (VPos > this.FMax) VPos = this.FMax;
      this.FPosition = VPos;
      this.Change();
      VPos = this.FPosition;
      this.Scroll($mod.TScrollCode.scTrack,{get: function () {
          return VPos;
        }, set: function (v) {
          VPos = v;
        }});
      if (VPos < this.FMin) VPos = this.FMin;
      if (VPos > this.FMax) VPos = this.FMax;
      this.FPosition = VPos;
      if (this.FInput.value !== pas.SysUtils.IntToStr(this.FPosition)) this.FInput.value = pas.SysUtils.IntToStr(this.FPosition);
      Result = true;
      return Result;
    };
    this.Change = function () {
      if (this.FOnChange != null) this.FOnChange(this);
    };
    this.Scroll = function (AScrollCode, AScrollPos) {
      if (this.FOnScroll$1 != null) this.FOnScroll$1(this,AScrollCode,AScrollPos);
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 120;
      Result.cy = 24;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FKind = $mod.TScrollBarKind.sbHorizontal;
      this.FLargeChange = 1;
      this.FMax = 100;
      this.FMin = 0;
      this.FPageSize = 0;
      this.FPosition = 0;
      this.FSmallChange = 1;
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
    this.SetParams = function (APosition, AMin, AMax, APageSize) {
      this.BeginUpdate();
      try {
        if (AMin > AMax) AMax = AMin;
        this.FMin = AMin;
        this.FMax = AMax;
        this.FPageSize = APageSize;
        if (this.FPageSize < 0) this.FPageSize = 0;
        if (APosition < this.FMin) APosition = this.FMin;
        if (APosition > this.FMax) APosition = this.FMax;
        this.FPosition = APosition;
      } finally {
        this.EndUpdate();
      };
    };
    this.SetParams$1 = function (APosition, AMin, AMax) {
      this.SetParams(APosition,AMin,AMax,0);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TScrollBar",this.TCustomScrollBar,function () {
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("Align",2,pas.Controls.$rtti["TAlign"],"FAlign","SetAlign");
    $r.addProperty("Anchors",14,pas.Controls.$rtti["TAnchors"],"FAnchors","SetAnchors",{stored: "IsAnchorsStored", Default: rtl.createSet(pas.Controls.TAnchorKind.akLeft,pas.Controls.TAnchorKind.akTop)});
    $r.addProperty("BorderSpacing",2,pas.Controls.$rtti["TControlBorderSpacing"],"FBorderSpacing","SetBorderSpacing");
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("Constraints",2,pas.Controls.$rtti["TSizeConstraints"],"FConstraints","SetConstraints");
    $r.addProperty("Enabled",2,rtl.boolean,"FEnabled","SetEnabled");
    $r.addProperty("Font",2,pas.Graphics.$rtti["TFont"],"FFont","SetFont");
    $r.addProperty("HandleClass",2,rtl.string,"FHandleClass","SetHandleClass");
    $r.addProperty("HandleId",2,rtl.string,"FHandleId","SetHandleId");
    $r.addProperty("Height",2,rtl.nativeint,"FHeight","SetHeight");
    $r.addProperty("Kind",2,$mod.$rtti["TScrollBarKind"],"FKind","SetKind",{Default: $mod.TScrollBarKind.sbHorizontal});
    $r.addProperty("LargeChange",2,$mod.$rtti["TScrollBarInc"],"FLargeChange","SetLargeChange",{Default: 1});
    $r.addProperty("Left",2,rtl.nativeint,"FLeft","SetLeft");
    $r.addProperty("Max",2,rtl.longint,"FMax","SetMax",{Default: 100});
    $r.addProperty("Min",2,rtl.longint,"FMin","SetMin",{Default: 0});
    $r.addProperty("PageSize",2,rtl.longint,"FPageSize","SetPageSize");
    $r.addProperty("ParentColor",2,rtl.boolean,"FParentColor","SetParentColor");
    $r.addProperty("ParentFont",2,rtl.boolean,"FParentFont","SetParentFont");
    $r.addProperty("ParentShowHint",2,rtl.boolean,"FParentShowHint","SetParentShowHint");
    $r.addProperty("PopupMenu",2,pas.Controls.$rtti["TCustomPopupMenu"],"FPopupMenu","SetPopupMenu");
    $r.addProperty("Position",2,rtl.longint,"FPosition","SetPosition",{Default: 0});
    $r.addProperty("ShowHint",2,rtl.boolean,"FShowHint","SetShowHint");
    $r.addProperty("SmallChange",2,$mod.$rtti["TScrollBarInc"],"FSmallChange","SetSmallChange",{Default: 1});
    $r.addProperty("TabOrder",2,rtl.nativeint,"FTabOrder","SetTabOrder");
    $r.addProperty("TabStop",2,rtl.boolean,"FTabStop","SetTabStop");
    $r.addProperty("Top",2,rtl.nativeint,"FTop","SetTop");
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible");
    $r.addProperty("Width",2,rtl.nativeint,"FWidth","SetWidth");
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
    $r.addProperty("OnEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnEnter","FOnEnter");
    $r.addProperty("OnExit",0,pas.Classes.$rtti["TNotifyEvent"],"FOnExit","FOnExit");
    $r.addProperty("OnMouseDown",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseDown","FOnMouseDown");
    $r.addProperty("OnMouseEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseEnter","FOnMouseEnter");
    $r.addProperty("OnMouseLeave",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseLeave","FOnMouseLeave");
    $r.addProperty("OnMouseMove",0,pas.Controls.$rtti["TMouseMoveEvent"],"FOnMouseMove","FOnMouseMove");
    $r.addProperty("OnMouseUp",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseUp","FOnMouseUp");
    $r.addProperty("OnMouseWheel",0,pas.Controls.$rtti["TMouseWheelEvent"],"FOnMouseWheel","FOnMouseWheel");
    $r.addProperty("OnScroll",0,$mod.$rtti["TScrollEvent"],"FOnScroll$1","FOnScroll$1");
  });
  this.TComboBoxStyle = {"0": "csDropDown", csDropDown: 0, "1": "csDropDownList", csDropDownList: 1, "2": "csOwnerDrawFixed", csOwnerDrawFixed: 2, "3": "csOwnerDrawVariable", csOwnerDrawVariable: 3, "4": "csSimple", csSimple: 4};
  this.$rtti.$Enum("TComboBoxStyle",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TComboBoxStyle});
  rtl.createClass(this,"TCustomComboBox",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FColumns = 0;
      this.FDropDownCount = 0;
      this.FItemHeight = 0;
      this.FItemIndex = 0;
      this.FItems = null;
      this.FHighlightIndex = 0;
      this.FListElement = null;
      this.FListId = "";
      this.FOnChange = null;
      this.FOpen = false;
      this.FSorted = false;
      this.FStyle = 0;
      this.FTopIndex = 0;
    };
    this.$final = function () {
      this.FItems = undefined;
      this.FListElement = undefined;
      this.FOnChange = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.CloseDropDown = function () {
      this.FOpen = false;
      if (this.FListElement != null) this.FListElement.style.setProperty("display","none");
    };
    this.OpenDropDown = function () {
      var VRect = null;
      if (!(this.FListElement != null) || (this.FItems.GetCount() === 0)) return;
      VRect = this.FHandleElement.getBoundingClientRect();
      this.FListElement.style.setProperty("display","block");
      this.FListElement.style.setProperty("left",pas.SysUtils.IntToStr(pas.System.Trunc(VRect.left)) + "px");
      this.FListElement.style.setProperty("top",pas.SysUtils.IntToStr(pas.System.Trunc(VRect.bottom) + 2) + "px");
      this.FListElement.style.setProperty("min-width",pas.SysUtils.IntToStr(pas.System.Trunc(VRect.width)) + "px");
      this.FOpen = true;
      if (this.FItemIndex >= 0) {
        this.FHighlightIndex = this.FItemIndex}
       else this.FHighlightIndex = 0;
      this.UpdateHighlight();
    };
    this.ToggleDropDown = function () {
      if (this.FOpen) {
        this.CloseDropDown()}
       else this.OpenDropDown();
    };
    this.UpdateHighlight = function () {
      var VIndex = 0;
      var VElement = null;
      if (!(this.FListElement != null)) return;
      for (var $l = 0, $end = this.FListElement.children.length - 1; $l <= $end; $l++) {
        VIndex = $l;
        VElement = this.FListElement.children.item(VIndex);
        if (VIndex === this.FHighlightIndex) {
          VElement.classList.add("wcl-combo-item-active")}
         else VElement.classList.remove("wcl-combo-item-active");
      };
      if ((this.FHighlightIndex >= 0) && (this.FHighlightIndex < this.FListElement.children.length)) this.FListElement.children.item(this.FHighlightIndex).scrollIntoView();
    };
    this.SelectIndex = function (AIndex, AFireChange) {
      var VInput = null;
      if ((AIndex < -1) || (AIndex >= this.FItems.GetCount())) return;
      this.FItemIndex = AIndex;
      VInput = this.FHandleElement;
      if (AIndex >= 0) {
        VInput.value = this.FItems.Get(AIndex)}
       else VInput.value = "";
      this.CloseDropDown();
      if (AFireChange) this.Change();
    };
    this.SetColumns = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FColumns !== AValue) {
        this.FColumns = AValue;
        this.Changed();
      };
    };
    this.SetDropDownCount = function (AValue) {
      if (AValue < 1) AValue = 1;
      if (this.FDropDownCount !== AValue) {
        this.FDropDownCount = AValue;
        this.Changed();
      };
    };
    this.SetItemHeight = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FItemHeight !== AValue) {
        this.FItemHeight = AValue;
        this.Changed();
      };
    };
    this.SetItemIndex = function (AValue) {
      if ((AValue < -1) || (AValue >= this.FItems.GetCount())) return;
      this.SelectIndex(AValue,false);
      this.Changed();
    };
    this.SetItems = function (AValue) {
      this.FItems.Assign(AValue);
      if (this.FItemIndex >= this.FItems.GetCount()) this.FItemIndex = -1;
      this.Changed();
    };
    this.SetSorted = function (AValue) {
      if (this.FSorted !== AValue) {
        this.FSorted = AValue;
        this.UpdateSorted();
      };
    };
    this.SetStyle = function (AValue) {
      if (this.FStyle !== AValue) {
        this.FStyle = AValue;
        if (this.FStyle === $mod.TComboBoxStyle.csDropDownList) {
          if (this.FItemIndex < 0) this.FItemIndex = this.FItems.IndexOf(this.FHandleElement.value);
        };
        this.Changed();
      };
    };
    this.SetTopIndex = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FTopIndex !== AValue) {
        this.FTopIndex = AValue;
        this.Changed();
      };
    };
    this.ItemsChange = function (ASender) {
      if (this.FItemIndex >= this.FItems.GetCount()) this.FItemIndex = -1;
      this.Changed();
    };
    this.Change = function () {
      if (this.FOnChange != null) {
        this.FOnChange(this);
      };
    };
    this.HandleClick$1 = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.ToggleDropDown();
      Result = true;
      return Result;
    };
    this.HandleDocumentClick = function (AEvent) {
      var Result = false;
      Result = false;
      if (this.FOpen) this.CloseDropDown();
      return Result;
    };
    this.HandleInput = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.FItemIndex = this.FItems.IndexOf(this.FHandleElement.value);
      if (this.FOpen) {
        this.FHighlightIndex = this.FItemIndex;
        this.UpdateHighlight();
      };
      this.Change();
      Result = true;
      return Result;
    };
    this.HandleItemClick = function (AEvent) {
      var Result = false;
      var VElement = null;
      var VIndex = 0;
      AEvent.stopPropagation();
      AEvent.preventDefault();
      VElement = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
      while ((VElement != null) && !VElement.hasAttribute("data-wcl-combo-index")) VElement = VElement.parentElement;
      if (VElement != null) {
        VIndex = pas.SysUtils.StrToIntDef(VElement.getAttribute("data-wcl-combo-index"),-1);
        this.SelectIndex(VIndex,true);
      };
      Result = true;
      return Result;
    };
    this.HandleKeyDown$1 = function (AEvent) {
      var Result = false;
      var VKey = 0;
      Result = false;
      VKey = pas.Controls.ExtractKeyCode(AEvent);
      if (!this.FOpen) {
        if ((VKey === 38) || (VKey === 40)) {
          this.OpenDropDown();
          AEvent.preventDefault();
          Result = true;
        };
        return Result;
      };
      var $tmp = VKey;
      if ($tmp === 38) {
        if (this.FHighlightIndex > 0) this.FHighlightIndex -= 1;
        this.UpdateHighlight();
        AEvent.preventDefault();
        Result = true;
      } else if ($tmp === 40) {
        if (this.FHighlightIndex < (this.FItems.GetCount() - 1)) this.FHighlightIndex += 1;
        this.UpdateHighlight();
        AEvent.preventDefault();
        Result = true;
      } else if ($tmp === 13) {
        this.SelectIndex(this.FHighlightIndex,true);
        AEvent.preventDefault();
        Result = true;
      } else if ($tmp === 27) {
        this.CloseDropDown();
        AEvent.preventDefault();
        Result = true;
      };
      return Result;
    };
    this.Changed = function () {
      var VIndex = 0;
      var VInput = null;
      var VItem = null;
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        if (this.FHandleClass === "") {
          $impl._RegisterWCLStdRules();
          this.FHandleElement.classList.add('wcl-input');
        };
        VInput = this.FHandleElement;
        VInput.setAttribute("name",this.FName);
        VInput.setAttribute("data-dropdown-count",pas.SysUtils.IntToStr(this.FDropDownCount));
        VInput.setAttribute("data-top-index",pas.SysUtils.IntToStr(this.FTopIndex));
        VInput.setAttribute("data-columns",pas.SysUtils.IntToStr(this.FColumns));
        if (this.FListElement != null) {
          this.FListElement.innerHTML = "";
          for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
            VIndex = $l;
            VItem = document.createElement("div");
            VItem.classList.add("wcl-combo-item");
            VItem.setAttribute("data-wcl-combo-index",pas.SysUtils.IntToStr(VIndex));
            VItem.textContent = this.FItems.Get(VIndex);
            if (this.FItemHeight > 0) VItem.style.setProperty("min-height",pas.SysUtils.IntToStr(this.FItemHeight) + "px");
            this.FListElement.appendChild(VItem);
          };
          if (!this.FOpen) this.FListElement.style.setProperty("display","none");
        };
        if (this.FStyle === $mod.TComboBoxStyle.csDropDownList) {
          VInput.readOnly = true;
          this.FHandleElement.classList.add("wcl-combo-list");
        } else {
          VInput.readOnly = false;
          this.FHandleElement.classList.remove("wcl-combo-list");
        };
        if ((this.FItemIndex >= 0) && (this.FItemIndex < this.FItems.GetCount())) VInput.value = this.FItems.Get(this.FItemIndex);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("input");
      Result.type = "text";
      $impl._ComboSeq += 1;
      this.FListId = "wcl-combo-list-" + pas.SysUtils.IntToStr($impl._ComboSeq);
      this.FListElement = document.createElement("div");
      this.FListElement.classList.add("wcl-combo-dropdown");
      this.FListElement.setAttribute("id",this.FListId);
      this.FListElement.style.setProperty("display","none");
      document.body.appendChild(this.FListElement);
      return Result;
    };
    this.RegisterHandleEvents = function () {
      pas.Controls.TWinControl.RegisterHandleEvents.call(this);
      this.FHandleElement.addEventListener("click",rtl.createCallback(this,"HandleClick$1"));
      this.FHandleElement.addEventListener("input",rtl.createCallback(this,"HandleInput"));
      this.FHandleElement.addEventListener("keydown",rtl.createCallback(this,"HandleKeyDown$1"));
      if (this.FListElement != null) this.FListElement.addEventListener("click",rtl.createCallback(this,"HandleItemClick"));
      document.addEventListener("click",rtl.createCallback(this,"HandleDocumentClick"));
    };
    this.UnRegisterHandleEvents = function () {
      pas.Controls.TWinControl.UnRegisterHandleEvents.call(this);
      this.FHandleElement.removeEventListener("click",rtl.createCallback(this,"HandleClick$1"));
      this.FHandleElement.removeEventListener("input",rtl.createCallback(this,"HandleInput"));
      this.FHandleElement.removeEventListener("keydown",rtl.createCallback(this,"HandleKeyDown$1"));
      if (this.FListElement != null) this.FListElement.removeEventListener("click",rtl.createCallback(this,"HandleItemClick"));
      document.removeEventListener("click",rtl.createCallback(this,"HandleDocumentClick"));
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.RealGetText = function () {
      var Result = "";
      if ((this.FItemIndex >= 0) && (this.FItemIndex < this.FItems.GetCount())) {
        Result = this.FItems.Get(this.FItemIndex)}
       else if (this.FHandleElement != null) {
        Result = this.FHandleElement.value}
       else Result = "";
      return Result;
    };
    this.RealSetText = function (AValue) {
      var VIndex = 0;
      VIndex = this.FItems.IndexOf(AValue);
      if (VIndex >= 0) {
        this.FItemIndex = VIndex;
        this.Changed();
      } else if (this.FStyle !== $mod.TComboBoxStyle.csDropDownList) {
        this.FItemIndex = -1;
        if (this.FHandleElement != null) this.FHandleElement.value = AValue;
      };
    };
    this.UpdateSorted = function () {
      this.FItems.SetSorted(this.FSorted);
      this.Changed();
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 100;
      Result.cy = 25;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FColumns = 0;
      this.FDropDownCount = 8;
      this.FHighlightIndex = -1;
      this.FItemHeight = 0;
      this.FItemIndex = -1;
      this.FItems = pas.Classes.TStringList.$create("Create$1");
      this.FItems.FOnChange = rtl.createCallback(this,"ItemsChange");
      this.FOpen = false;
      this.FSorted = false;
      this.FStyle = $mod.TComboBoxStyle.csDropDown;
      this.FTopIndex = 0;
      this.BeginUpdate();
      try {
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      this.CloseDropDown();
      if (this.FListElement != null) {
        this.FListElement.remove();
        this.FListElement = null;
      };
      this.FItems.$destroy("Destroy");
      this.FItems = null;
      pas.Controls.TControl.Destroy.call(this);
    };
    this.AddItem = function (AItem, AObject) {
      this.FItems.AddObject(AItem,AObject);
    };
    this.Append = function (AItem) {
      this.FItems.Append(AItem);
    };
    this.Clear = function () {
      this.CloseDropDown();
      this.FItems.Clear();
      this.FItemIndex = -1;
      if (this.FHandleElement != null) this.FHandleElement.value = "";
      this.Changed();
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  this.$rtti.$MethodVar("TSelectionChangeEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["User",rtl.boolean]]), methodkind: 0});
  rtl.createClass(this,"TCustomListBox",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FColumns = 0;
      this.FItemHeight = 0;
      this.FItemIndex = 0;
      this.FItems = null;
      this.FMultiSelect = false;
      this.FSelectionChanged = false;
      this.FSelected = [];
      this.FSorted = false;
      this.FTopIndex = 0;
      this.FOnSelectionChange = null;
    };
    this.$final = function () {
      this.FItems = undefined;
      this.FSelected = undefined;
      this.FOnSelectionChange = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.GetSelCount = function () {
      var Result = 0;
      var b = false;
      Result = 0;
      if (this.FMultiSelect) {
        for (var $in = this.FSelected, $l = 0, $end = rtl.length($in) - 1; $l <= $end; $l++) {
          b = $in[$l];
          if (b) Result += 1;
        };
      } else if (this.FItemIndex !== -1) Result += 1;
      return Result;
    };
    this.GetSelected = function (Index) {
      var Result = false;
      if ((Index < 0) || (Index >= this.FItems.GetCount())) throw pas.Classes.EListError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SListIndexError"),pas.System.VarRecs(0,Index)]);
      Result = this.FSelected[Index];
      return Result;
    };
    this.SetColumns = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FColumns !== AValue) {
        this.FColumns = AValue;
        this.Changed();
      };
    };
    this.SetItemHeight = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FItemHeight !== AValue) {
        this.FItemHeight = AValue;
        this.Changed();
      };
    };
    this.SetItemIndex = function (AValue) {
      if ((AValue > -1) && (AValue < this.FItems.GetCount())) {
        this.BeginUpdate();
        try {
          if (this.FMultiSelect) this.ClearSelection();
          this.FItemIndex = AValue;
          this.Changed();
        } finally {
          this.EndUpdate();
        };
      };
    };
    this.SetItems = function (AValue) {
      this.FItems.Assign(AValue);
      this.Changed();
    };
    this.SetMultiSelect = function (AValue) {
      if (this.FMultiSelect !== AValue) {
        this.ClearSelection();
        this.FMultiSelect = AValue;
        if (!(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) this.FSelectionChanged = true;
        this.Changed();
      };
    };
    this.SetSelected = function (Index, AValue) {
      var i = 0;
      if (Index > (rtl.length(this.FSelected) - 1)) throw pas.Classes.EListError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SListIndexError"),pas.System.VarRecs(0,Index)]);
      if (AValue && !this.FMultiSelect) {
        for (var $l = 0, $end = rtl.length(this.FSelected) - 1; $l <= $end; $l++) {
          i = $l;
          if (this.FSelected[i]) this.FSelected[i] = false;
        };
      };
      this.FSelected[Index] = AValue;
      if (AValue) {
        this.FItemIndex = Index}
       else {
        this.FItemIndex = -1;
        if (this.FMultiSelect) {
          for (var $l1 = 0, $end1 = rtl.length(this.FSelected) - 1; $l1 <= $end1; $l1++) {
            i = $l1;
            if (this.FSelected[i]) {
              this.FItemIndex = i;
              break;
            };
          };
        };
      };
      if (!(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) this.FSelectionChanged = true;
      this.Changed();
    };
    this.SetSorted = function (AValue) {
      if (this.FSorted !== AValue) {
        this.FSorted = AValue;
        this.UpdateSorted();
      };
    };
    this.SetTopIndex = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (AValue > (this.FItems.GetCount() - 1)) AValue = this.FItems.GetCount() - 1;
      if (AValue < 0) AValue = 0;
      if (this.FTopIndex !== AValue) {
        this.FTopIndex = AValue;
        this.Changed();
      };
    };
    this.ItemsChanged = function (ASender) {
      if (rtl.length(this.FSelected) !== this.FItems.GetCount()) this.FSelected = rtl.arraySetLength(this.FSelected,false,this.FItems.GetCount());
      this.Changed();
    };
    this.SelectionChange = function (AUser) {
      if (this.FOnSelectionChange != null) this.FOnSelectionChange(this,AUser);
    };
    this.HandleChange = function (AEvent) {
      var Result = false;
      var i = 0;
      AEvent.stopPropagation();
      var $with = this.FHandleElement;
      this.FItemIndex = $with.selectedIndex;
      for (var $l = 0, $end = $with.length - 1; $l <= $end; $l++) {
        i = $l;
        this.FSelected[i] = $with.item(i).selected;
      };
      this.SelectionChange(true);
      Result = true;
      return Result;
    };
    this.Changed = function () {
      var idx = 0;
      var v = "";
      var opt = null;
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        if (this.FSelectionChanged) {
          this.SelectionChange(false);
          this.FSelectionChanged = false;
        };
        var $with = this.FHandleElement;
        $with.style.setProperty("overflow","auto");
        $with.multiple = this.FMultiSelect;
        $with.size = 2;
        for (var $l = this.FHandleElement.length - 1; $l >= 0; $l--) {
          idx = $l;
          $with.remove(idx);
        };
        for (var $l1 = 0, $end = this.FItems.GetCount() - 1; $l1 <= $end; $l1++) {
          idx = $l1;
          v = this.FItems.Get(idx);
          opt = document.createElement("option");
          opt.value = v;
          opt.text = v;
          if (this.FItemHeight > 0) opt.style.setProperty("min-height",pas.SysUtils.IntToStr(this.FItemHeight) + "px");
          if (this.FMultiSelect) {
            opt.selected = this.FSelected[idx]}
           else opt.selected = idx === this.FItemIndex;
          $with.add(opt);
        };
        this.FHandleElement.setAttribute("data-columns",pas.SysUtils.IntToStr(this.FColumns));
        this.FHandleElement.setAttribute("data-top-index",pas.SysUtils.IntToStr(this.FTopIndex));
        if ((this.FTopIndex > 0) && (this.FItems.GetCount() > 0)) {
          if (this.FItemHeight > 0) {
            $with.scrollTop = this.FTopIndex * this.FItemHeight}
           else if (this.FTopIndex < this.FItems.GetCount()) $with.scrollTop = pas.System.Trunc($with.item(this.FTopIndex).offsetTop);
        };
        this.FHandleElement.setAttribute("name",this.FName);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("select");
      return Result;
    };
    this.RegisterHandleEvents = function () {
      pas.Controls.TWinControl.RegisterHandleEvents.call(this);
      var $with = this.FHandleElement;
      $with.addEventListener("change",rtl.createCallback(this,"HandleChange"));
    };
    this.UnRegisterHandleEvents = function () {
      pas.Controls.TWinControl.UnRegisterHandleEvents.call(this);
      var $with = this.FHandleElement;
      $with.removeEventListener("change",rtl.createCallback(this,"HandleChange"));
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.UpdateSorted = function () {
      this.FItems.SetSorted(this.FSorted);
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 100;
      Result.cy = 70;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FColumns = 0;
      this.FItemHeight = 0;
      this.FItemIndex = -1;
      this.FItems = pas.Classes.TStringList.$create("Create$1");
      this.FItems.FOnChange = rtl.createCallback(this,"ItemsChanged");
      this.FMultiSelect = false;
      this.FSorted = false;
      this.FTopIndex = 0;
      this.BeginUpdate();
      try {
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FItems");
      pas.Controls.TControl.Destroy.call(this);
    };
    this.AddItem = function (AItem, AObject) {
      this.FItems.AddObject(AItem,AObject);
      this.Changed();
    };
    this.Append = function (AItem) {
      this.FItems.Append(AItem);
      this.Changed();
    };
    this.Clear = function () {
      this.FItems.Clear();
      this.FItemIndex = -1;
      this.FSelected = [];
      this.Changed();
    };
    this.ClearSelection = function () {
      var i = 0;
      if (this.FMultiSelect) {
        this.BeginUpdate();
        try {
          for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
            i = $l;
            this.SetSelected(i,false);
          };
        } finally {
          this.EndUpdate();
        };
      } else this.SetItemIndex(-1);
    };
    this.SelectAll = function () {
      if (!this.FMultiSelect) return;
      this.SelectRange(0,this.FItems.GetCount() - 1,true);
    };
    this.SelectRange = function (ALow, AHigh, ASelected) {
      var i = 0;
      if (!this.FMultiSelect) return;
      if (ALow < 0) ALow = 0;
      if (AHigh >= this.FItems.GetCount()) AHigh = this.FItems.GetCount() - 1;
      if (AHigh < ALow) return;
      this.BeginUpdate();
      try {
        for (var $l = ALow, $end = AHigh; $l <= $end; $l++) {
          i = $l;
          this.SetSelected(i,ASelected);
        };
      } finally {
        this.EndUpdate();
      };
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $mod.$rtti.$DynArray("TCustomListBox.FSelected$a",{eltype: rtl.boolean});
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TCustomEdit",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FAlignment = 0;
      this.FAutocomplete = "";
      this.FCharCase = 0;
      this.FInputType = 0;
      this.FMaxLength = 0;
      this.FModified = false;
      this.FPasswordChar = "\x00";
      this.FPattern = "";
      this.FReadOnly = false;
      this.FRequired = false;
      this.FSelLength = 0;
      this.FSelStart = 0;
      this.FText = "";
      this.FTextHint = "";
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FOnChange = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.GetSelLength = function () {
      var Result = 0;
      if (this.FHandleElement != null) {
        var $with = this.FHandleElement;
        this.FSelLength = $with.selectionEnd - $with.selectionStart;
      };
      Result = this.FSelLength;
      return Result;
    };
    this.GetSelStart = function () {
      var Result = 0;
      if (this.FHandleElement != null) {
        var $with = this.FHandleElement;
        this.FSelStart = $with.selectionStart;
      };
      Result = this.FSelStart;
      return Result;
    };
    this.GetSelText = function () {
      var Result = "";
      Result = pas.System.Copy(this.RealGetText(),this.GetSelStart() + 1,this.GetSelLength());
      return Result;
    };
    this.SetAlignment = function (AValue) {
      if (this.FAlignment !== AValue) {
        this.FAlignment = AValue;
        this.Changed();
      };
    };
    this.SetAutocomplete = function (AValue) {
      if (this.FAutocomplete !== AValue) {
        this.FAutocomplete = AValue;
        this.Changed();
      };
    };
    this.SetCharCase = function (AValue) {
      if (this.FCharCase !== AValue) {
        this.FCharCase = AValue;
        this.Changed();
      };
    };
    this.SetInputType = function (AValue) {
      if (this.FInputType !== AValue) {
        this.FInputType = AValue;
        this.Changed();
      };
    };
    this.SetMaxLength = function (AValue) {
      if (this.FMaxLength !== AValue) {
        this.FMaxLength = AValue;
        this.Changed();
      };
    };
    this.SetModified = function (AValue) {
      if (this.FModified !== AValue) {
        this.FModified = AValue;
      };
    };
    this.SetPasswordChar = function (AValue) {
      if (this.FPasswordChar !== AValue) {
        this.FPasswordChar = AValue;
        this.Changed();
      };
    };
    this.SetPattern = function (AValue) {
      if (this.FPattern !== AValue) {
        this.FPattern = AValue;
        this.Changed();
      };
    };
    this.SetReadOnly = function (AValue) {
      if (this.FReadOnly !== AValue) {
        this.FReadOnly = AValue;
        this.Changed();
      };
    };
    this.SetRequired = function (AValue) {
      if (this.FRequired !== AValue) {
        this.FRequired = AValue;
        this.Changed();
      };
    };
    this.SetSelLength = function (AValue) {
      if (AValue < 0) {
        AValue = 0;
      };
      if (this.FSelLength !== AValue) {
        this.FSelLength = AValue;
        this.Changed();
      };
    };
    this.SetSelStart = function (AValue) {
      if (this.FSelStart !== AValue) {
        this.FSelStart = AValue;
        this.Changed();
      };
    };
    this.SetSelText = function (AValue) {
      var VText = "";
      var VLength = 0;
      var VStart = 0;
      if (!this.FReadOnly) {
        VText = this.RealGetText();
        VLength = this.GetSelLength();
        VStart = this.GetSelStart();
        if (VLength === 0) {
          pas.System.Insert(AValue,{get: function () {
              return VText;
            }, set: function (v) {
              VText = v;
            }},VStart + 1);
        } else {
          pas.System.Delete({get: function () {
              return VText;
            }, set: function (v) {
              VText = v;
            }},VStart + 1,VLength);
          pas.System.Insert(AValue,{get: function () {
              return VText;
            }, set: function (v) {
              VText = v;
            }},VStart + 1);
        };
        if (this.FMaxLength > 0) {
          VText = pas.System.Copy(VText,1,this.FMaxLength);
        };
        this.RealSetText(VText);
        this.FSelStart = VStart + AValue.length;
        this.FSelLength = 0;
        this.Changed();
      };
    };
    this.SetTextHint = function (AValue) {
      if (this.FTextHint !== AValue) {
        this.FTextHint = AValue;
        this.Changed();
      };
    };
    this.Change = function () {
      if (this.FOnChange != null) {
        this.FOnChange(this);
      };
    };
    this.DoEnter = function () {
      pas.Controls.TWinControl.DoEnter.call(this);
      this.SelectAll();
    };
    this.DoInput = function (ANewValue) {
      if (ANewValue !== this.RealGetText()) {
        this.FText = ANewValue;
        this.FModified = true;
        this.Change();
      };
    };
    this.HandleInput = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.DoInput(this.FHandleElement.value);
      Result = true;
      return Result;
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        if (this.FHandleClass === "") {
          $impl._RegisterWCLStdRules();
          this.FHandleElement.classList.add('wcl-input');
        };
        this.FHandleElement.name = this.FName;
        var $with = this.FHandleElement;
        var $tmp = this.FAlignment;
        if ($tmp === pas.Classes.TAlignment.taRightJustify) {
          $with.style.setProperty("text-align","right")}
         else if ($tmp === pas.Classes.TAlignment.taCenter) {
          $with.style.setProperty("text-align","center")}
         else {
          $with.style.removeProperty("text-align");
        };
        var $tmp1 = this.FCharCase;
        if ($tmp1 === $mod.TEditCharCase.ecLowerCase) {
          $with.style.setProperty("text-transform","lowercase")}
         else if ($tmp1 === $mod.TEditCharCase.ecUppercase) {
          $with.style.setProperty("text-transform","uppercase")}
         else {
          $with.style.removeProperty("text-transform");
        };
        if (this.FMaxLength > 0) {
          $with.maxLength = this.FMaxLength;
        } else {
          $with.removeAttribute("maxlength");
        };
        if (this.FPattern !== "") {
          $with.pattern = this.FPattern;
        } else {
          $with.removeAttribute("pattern");
        };
        if (this.FTextHint !== "") {
          $with.placeholder = this.FTextHint;
        } else {
          $with.removeAttribute("placeholder");
        };
        $with.readOnly = this.FReadOnly;
        $with.required = this.FRequired;
        var $tmp2 = this.GetInputType();
        if (($tmp2 === "text") || ($tmp2 === "search") || ($tmp2 === "url") || ($tmp2 === "tel") || ($tmp2 === "password")) {
          $with.setSelectionRange(this.FSelStart,this.FSelStart + this.FSelLength);
        };
        $with.type = this.GetInputType();
        $with.value = this.RealGetText();
        if (this.FAutocomplete !== "") {
          $with.autocomplete = this.FAutocomplete;
        } else {
          $with.removeAttribute("autocomplete");
        };
        this.FHandleElement.setAttribute("name",this.FName);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("input");
      return Result;
    };
    this.RegisterHandleEvents = function () {
      pas.Controls.TWinControl.RegisterHandleEvents.call(this);
      var $with = this.FHandleElement;
      $with.addEventListener("input",rtl.createCallback(this,"HandleInput"));
    };
    this.UnRegisterHandleEvents = function () {
      pas.Controls.TWinControl.UnRegisterHandleEvents.call(this);
      var $with = this.FHandleElement;
      $with.removeEventListener("input",rtl.createCallback(this,"HandleInput"));
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = pas.Controls.TWinControl.CheckChildClassAllowed.call(this,AChildClass);
      return Result;
    };
    this.RealGetText = function () {
      var Result = "";
      Result = this.FText;
      return Result;
    };
    this.RealSetText = function (AValue) {
      this.FText = AValue;
      this.FModified = false;
      this.Changed();
    };
    this.GetInputType = function () {
      var Result = "";
      if (this.FPasswordChar !== "\x00") {
        Result = "password"}
       else {
        var $tmp = this.FInputType;
        if ($tmp === $mod.TEditInputType.itEmail) {
          Result = "email"}
         else if ($tmp === $mod.TEditInputType.itTel) {
          Result = "tel"}
         else if ($tmp === $mod.TEditInputType.itUrl) {
          Result = "url"}
         else if ($tmp === $mod.TEditInputType.itSearch) {
          Result = "search"}
         else {
          Result = "text";
        };
      };
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
      this.FAutocomplete = "";
      this.FInputType = $mod.TEditInputType.itText;
      this.FMaxLength = 0;
      this.FModified = false;
      this.FPasswordChar = "\x00";
      this.FPattern = "";
      this.FReadOnly = false;
      this.FTextHint = "";
      this.FText = "";
      this.BeginUpdate();
      try {
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Clear = function () {
      this.FText = "";
      this.Changed();
    };
    this.SelectAll = function () {
      if (this.RealGetText() !== "") {
        this.BeginUpdate();
        try {
          this.SetSelStart(0);
          this.SetSelLength(this.RealGetText().length);
        } finally {
          this.EndUpdate();
        };
      };
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TCustomMemo",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FAlignment = 0;
      this.FCharCase = 0;
      this.FLines = null;
      this.FMaxLength = 0;
      this.FModified = false;
      this.FReadOnly = false;
      this.FSelLength = 0;
      this.FSelStart = 0;
      this.FTextHint = "";
      this.FWantReturns = false;
      this.FWantTabs = false;
      this.FWordWrap = false;
      this.FIsUserTyping = false;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FLines = undefined;
      this.FOnChange = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.GetSelLength = function () {
      var Result = 0;
      if (this.FHandleElement != null) {
        var $with = this.FHandleElement;
        this.FSelLength = $with.selectionEnd - $with.selectionStart;
      };
      Result = this.FSelLength;
      return Result;
    };
    this.GetSelStart = function () {
      var Result = 0;
      if (this.FHandleElement != null) {
        var $with = this.FHandleElement;
        this.FSelStart = $with.selectionStart;
      };
      Result = this.FSelStart;
      return Result;
    };
    this.GetSelText = function () {
      var Result = "";
      Result = pas.System.Copy(this.RealGetText(),this.GetSelStart() + 1,this.GetSelLength());
      return Result;
    };
    this.HandleLinesChange = function (aSender) {
      this.Changed();
    };
    this.SetAlignment = function (AValue) {
      if (this.FAlignment !== AValue) {
        this.FAlignment = AValue;
        this.Changed();
      };
    };
    this.SetCharCase = function (AValue) {
      if (this.FCharCase !== AValue) {
        this.FCharCase = AValue;
        this.Changed();
      };
    };
    this.SetLines = function (AValue) {
      this.FLines.Assign(AValue);
      this.Changed();
    };
    this.SetMaxLength = function (AValue) {
      if (this.FMaxLength !== AValue) {
        this.FMaxLength = AValue;
        this.Changed();
      };
    };
    this.SetModified = function (AValue) {
      if (this.FModified !== AValue) {
        this.FModified = AValue;
      };
    };
    this.SetReadOnly = function (AValue) {
      if (this.FReadOnly !== AValue) {
        this.FReadOnly = AValue;
        this.Changed();
      };
    };
    this.SetSelLength = function (AValue) {
      if (AValue < 0) {
        AValue = 0;
      };
      if (this.FSelLength !== AValue) {
        this.FSelLength = AValue;
        this.Changed();
      };
    };
    this.SetSelStart = function (AValue) {
      if (this.FSelStart !== AValue) {
        this.FSelStart = AValue;
        this.Changed();
      };
    };
    this.SetSelText = function (AValue) {
      var VText = "";
      var VLength = 0;
      var VStart = 0;
      if (!this.FReadOnly) {
        VText = this.RealGetText();
        VLength = this.GetSelLength();
        VStart = this.GetSelStart();
        if (VLength === 0) {
          pas.System.Insert(AValue,{get: function () {
              return VText;
            }, set: function (v) {
              VText = v;
            }},VStart + 1);
        } else {
          pas.System.Delete({get: function () {
              return VText;
            }, set: function (v) {
              VText = v;
            }},VStart + 1,VLength);
          pas.System.Insert(AValue,{get: function () {
              return VText;
            }, set: function (v) {
              VText = v;
            }},VStart + 1);
        };
        if (this.FMaxLength > 0) {
          VText = pas.System.Copy(VText,1,this.FMaxLength);
        };
        this.RealSetText(VText);
        this.FSelStart = VStart + AValue.length;
        this.FSelLength = 0;
        this.Changed();
      };
    };
    this.SetTextHint = function (AValue) {
      if (this.FTextHint !== AValue) {
        this.FTextHint = AValue;
      };
    };
    this.SetWantReturns = function (AValue) {
      if (this.FWantReturns !== AValue) {
        this.FWantReturns = AValue;
      };
    };
    this.SetWantTabs = function (AValue) {
      if (this.FWantTabs !== AValue) {
        this.FWantTabs = AValue;
      };
    };
    this.SetWordWrap = function (AValue) {
      if (this.FWordWrap !== AValue) {
        this.FWordWrap = AValue;
        this.Changed();
      };
    };
    this.Change = function () {
      if (this.FOnChange != null) {
        this.FOnChange(this);
      };
    };
    this.KeyDown = function (Key, Shift) {
      var StartPos = 0;
      var NewText = "";
      pas.Controls.TWinControl.KeyDown.call(this,Key,rtl.refSet(Shift));
      if (!this.FWantReturns && (Key.get() === 13)) {
        Key.set(0);
      };
      if (this.FWantTabs && (Key.get() === 9)) {
        StartPos = this.FHandleElement.selectionStart;
        NewText = this.GetText();
        pas.System.Insert("\t",{get: function () {
            return NewText;
          }, set: function (v) {
            NewText = v;
          }},StartPos + 1);
        this.SetText(NewText);
        this.FHandleElement.selectionEnd = StartPos + 1;
        Key.set(0);
      };
    };
    this.HandleChange = function (AEvent) {
      var Result = false;
      var VNewText = "";
      var VOldText = "";
      AEvent.stopPropagation();
      this.FIsUserTyping = true;
      try {
        VNewText = this.FHandleElement.value;
        VOldText = this.RealGetText();
        if (VNewText !== VOldText) {
          this.FLines.SetTextStr(VNewText);
          this.FModified = true;
          this.Change();
        };
      } finally {
        this.FIsUserTyping = false;
      };
      Result = true;
      return Result;
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        if (this.FHandleClass === "") {
          $impl._RegisterWCLStdRules();
          this.FHandleElement.classList.add('wcl-input');
        };
        var $with = this.FHandleElement;
        var $tmp = this.FAlignment;
        if ($tmp === pas.Classes.TAlignment.taRightJustify) {
          $with.style.setProperty("text-align","right")}
         else if ($tmp === pas.Classes.TAlignment.taCenter) {
          $with.style.setProperty("text-align","center")}
         else {
          $with.style.removeProperty("text-align");
        };
        var $tmp1 = this.FCharCase;
        if ($tmp1 === $mod.TEditCharCase.ecLowerCase) {
          $with.style.setProperty("text-transform","lowercase")}
         else if ($tmp1 === $mod.TEditCharCase.ecUppercase) {
          $with.style.setProperty("text-transform","uppercase")}
         else {
          $with.style.removeProperty("text-transform");
        };
        if (this.FMaxLength > 0) {
          $with.maxLength = this.FMaxLength;
        } else {
          $with.removeAttribute("maxlength");
        };
        if (this.FTextHint !== "") {
          $with.placeholder = this.FTextHint;
        } else {
          $with.removeAttribute("placeholder");
        };
        $with.readOnly = this.FReadOnly;
        $with.style.setProperty("resize","none");
        if (this.FWordWrap) {
          $with.removeAttribute("wrap");
        } else {
          $with.wrap = "off";
        };
        $with.style.setProperty("overflow","auto");
        if (!this.FIsUserTyping) {
          $with.value = this.RealGetText();
          $with.setSelectionRange(this.FSelStart,this.FSelStart + this.FSelLength);
        };
        this.FHandleElement.setAttribute("name",this.FName);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("textarea");
      return Result;
    };
    this.RegisterHandleEvents = function () {
      pas.Controls.TWinControl.RegisterHandleEvents.call(this);
      var $with = this.FHandleElement;
      $with.addEventListener("input",rtl.createCallback(this,"HandleChange"));
    };
    this.UnRegisterHandleEvents = function () {
      pas.Controls.TWinControl.UnRegisterHandleEvents.call(this);
      var $with = this.FHandleElement;
      $with.removeEventListener("input",rtl.createCallback(this,"HandleChange"));
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.RealGetText = function () {
      var Result = "";
      Result = this.FLines.GetTextStr();
      return Result;
    };
    this.RealSetText = function (AValue) {
      this.FLines.SetTextStr(AValue);
      this.FModified = false;
      this.Changed();
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 150;
      Result.cy = 90;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FIsUserTyping = false;
      this.FLines = $impl.TCustomMemoStrings.$create("Create$1");
      this.FLines.SetSkipLastLineBreak(true);
      this.FLines.SetLineBreak("\n");
      this.FLines.FStrictDelimiter = true;
      this.FLines.FOnChange = rtl.createCallback(this,"HandleLinesChange");
      this.FMaxLength = 0;
      this.FModified = false;
      this.FReadOnly = false;
      this.FTextHint = "";
      this.FWantReturns = true;
      this.FWantTabs = false;
      this.FWordWrap = true;
      this.BeginUpdate();
      try {
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      this.FLines.$destroy("Destroy");
      this.FLines = null;
      pas.Controls.TControl.Destroy.call(this);
    };
    this.Append = function (AValue) {
      this.FLines.Append(AValue);
      this.Changed();
    };
    this.Clear = function () {
      this.FLines.Clear();
      this.Changed();
    };
    this.SelectAll = function () {
      if (this.RealGetText() !== "") {
        this.BeginUpdate();
        try {
          this.SetSelStart(0);
          this.SetSelLength(this.RealGetText().length);
        } finally {
          this.EndUpdate();
        };
      };
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TCustomButton",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FCancel = false;
      this.FDefault = false;
      this.FModalResult = 0;
    };
    this.SetCancel = function (AValue) {
      if (this.FCancel !== AValue) {
        this.FCancel = AValue;
      };
    };
    this.SetDefault = function (AValue) {
      if (this.FDefault !== AValue) {
        this.FDefault = AValue;
      };
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        if (this.FHandleClass === "") {
          $impl._RegisterWCLStdRules();
          this.FHandleElement.classList.add('wcl-btn');
        };
        var $with = this.FHandleElement;
        $with.style.setProperty("display","inline-flex");
        $with.innerHTML = this.GetText();
        this.FHandleElement.setAttribute("name",this.FName);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("button");
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
      this.FModalResult = 0;
      this.BeginUpdate();
      try {
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.AdjustSize = function () {
      var VSize = pas.Types.TSize.$new();
      pas.Controls.TControl.AdjustSize.call(this);
      VSize.$assign(this.FFont.TextExtent(this.GetText()));
      this.SetBounds(this.FLeft,this.FTop,VSize.cx,VSize.cy);
    };
    this.Click = function () {
      var VParent = null;
      if (this.FModalResult !== 0) {
        VParent = this.FParent;
        while (VParent != null) {
          if (pas.Forms.TCustomForm.isPrototypeOf(VParent)) {
            VParent.SetModalResult(this.FModalResult);
            break;
          };
          VParent = VParent.FParent;
        };
      };
      pas.Controls.TControl.Click.call(this);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  this.TCheckBoxState = {"0": "cbUnchecked", cbUnchecked: 0, "1": "cbChecked", cbChecked: 1};
  this.$rtti.$Enum("TCheckBoxState",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TCheckBoxState});
  this.$rtti.$Enum("TLeftRight",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TAlignment});
  rtl.createClass(this,"TCustomCheckbox",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FAlignment = pas.Classes.TAlignment.taLeftJustify;
      this.FLabelElement = null;
      this.FMarkElement = null;
      this.FState = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FLabelElement = undefined;
      this.FMarkElement = undefined;
      this.FOnChange = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.GetChecked = function () {
      var Result = false;
      Result = this.GetState() === $mod.TCheckBoxState.cbChecked;
      return Result;
    };
    this.GetState = function () {
      var Result = 0;
      Result = this.FState;
      return Result;
    };
    this.SetAlignment = function (AValue) {
      if (this.FAlignment !== AValue) {
        this.FAlignment = AValue;
      };
    };
    this.SetChecked = function (AValue) {
      if (AValue) {
        this.SetState($mod.TCheckBoxState.cbChecked);
      } else {
        this.SetState($mod.TCheckBoxState.cbUnchecked);
      };
    };
    this.SetState = function (AValue) {
      if (this.FEnabled === false) return;
      if (this.FState !== AValue) {
        this.FState = AValue;
        this.Changed();
        this.DoOnChange();
      };
    };
    this.DoOnChange = function () {
      if (this.FOnChange != null) {
        this.FOnChange(this);
      };
    };
    this.HandleClick = function (AEvent) {
      var Result = false;
      if (this.FEnabled === false) return Result;
      this.SetChecked(this.FState !== $mod.TCheckBoxState.cbChecked);
      Result = pas.Controls.TControl.HandleClick.call(this,AEvent);
      return Result;
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        $with.style.setProperty("user-select","none");
        $with.style.setProperty("-moz-user-select","none");
        $with.style.setProperty("-ms-user-select","none");
        $with.style.setProperty("-khtml-user-select","none");
        $with.style.setProperty("-webkit-user-select","none");
        $with.style.setProperty("display","flex");
        $with.style.setProperty("align-items","center");
        this.FHandleElement.setAttribute("name",this.FName);
        var $with1 = this.FMarkElement;
        $with1.checked = this.FState === $mod.TCheckBoxState.cbChecked;
        $with1.type = "checkbox";
        if (this.FEnabled === false) {
          $with1.setAttribute("disabled","true");
        } else {
          $with1.removeAttribute("disabled");
        };
        var $with2 = this.FLabelElement;
        $with2.innerHTML = this.GetText();
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("span");
      return Result;
    };
    this.CreateMarkElement = function () {
      var Result = null;
      Result = this.FHandleElement.appendChild(document.createElement("input"));
      return Result;
    };
    this.CreateLabelElement = function () {
      var Result = null;
      Result = this.FHandleElement.appendChild(document.createElement("span"));
      return Result;
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 90;
      Result.cy = 23;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FMarkElement = this.CreateMarkElement();
      this.FLabelElement = this.CreateLabelElement();
      this.FAlignment = pas.Classes.TAlignment.taRightJustify;
      this.FState = $mod.TCheckBoxState.cbUnchecked;
      try {
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TCustomRadioButton",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.fInput = null;
      this.fLabel = null;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.fInput = undefined;
      this.fLabel = undefined;
      this.FOnChange = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.ChangeHandler = function (Event) {
      var Result = false;
      if (this.FOnChange != null) this.FOnChange(this);
      return Result;
    };
    this.GetChecked = function () {
      var Result = false;
      Result = this.fInput.checked;
      return Result;
    };
    this.LabelClickHandler = function (aEvent) {
      var Result = false;
      if (!this.GetChecked()) this.SetChecked(true);
      return Result;
    };
    this.SetChecked = function (AValue) {
      if (AValue === this.fInput.checked) return;
      this.fInput.checked = AValue;
      if (this.FOnChange != null) this.FOnChange(this);
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      this.FHandleElement.style.setProperty("display","flex");
      this.FHandleElement.style.setProperty("align-items","center");
      this.FHandleElement.setAttribute("name",this.FName);
      this.fInput.type = "radio";
      this.fInput.id = this.FName;
      this.fInput.name = this.FParent.FName;
      this.fInput.value = this.GetText();
      this.fLabel.textContent = this.GetText();
      this.fLabel.onclick = rtl.createSafeCallback(this,"LabelClickHandler");
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      this.fInput = document.createElement("input");
      this.fLabel = document.createElement("label");
      Result.append(this.fInput);
      this.fInput.onselect = rtl.createSafeCallback(this,"ChangeHandler");
      this.fInput.addEventListener("change",rtl.createCallback(this,"ChangeHandler"));
      Result.append(this.fLabel);
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.SetAutoSize(true);
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TCustomLabel",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FAlignment = 0;
      this.FContentElement = null;
      this.FFocusControl = null;
      this.FLayout = 0;
      this.FShowAccelChar = false;
      this.FTransparent = false;
      this.FWordWrap = false;
    };
    this.$final = function () {
      this.FContentElement = undefined;
      this.FFocusControl = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.SetAlignment = function (AValue) {
      if (this.FAlignment !== AValue) {
        this.FAlignment = AValue;
        this.Changed();
      };
    };
    this.SetLayout = function (AValue) {
      if (this.FLayout !== AValue) {
        this.FLayout = AValue;
        this.Changed();
      };
    };
    this.SetShowAccelChar = function (AValue) {
      if (this.FShowAccelChar !== AValue) {
        this.FShowAccelChar = AValue;
        this.Changed();
      };
    };
    this.SetTransparent = function (AValue) {
      if (this.FTransparent !== AValue) {
        this.FTransparent = AValue;
        this.BeginUpdate();
        try {
          if (this.FTransparent) {
            this.SetColor(536870911);
          } else if (this.FColor === 536870911) {
            this.SetColor(-2147483647);
          };
        } finally {
          this.EndUpdate();
        };
      };
    };
    this.SetWordWrap = function (AValue) {
      if (this.FWordWrap !== AValue) {
        this.FWordWrap = AValue;
        this.Changed();
      };
    };
    this.DoEnter = function () {
      pas.Controls.TWinControl.DoEnter.call(this);
      if ((this.FFocusControl != null) && this.FFocusControl.CanSetFocus()) {
        this.FFocusControl.SetFocus();
      };
    };
    this.HandleAccelKey = function (AEvent) {
      var Result = false;
      var VIndex = 0;
      var VKey = "";
      Result = false;
      if (!this.FShowAccelChar || !(this.FFocusControl != null) || !(AEvent != null) || !AEvent.altKey) return Result;
      VKey = AEvent.key;
      if (VKey.length !== 1) return Result;
      VIndex = 1;
      while (VIndex <= this.GetText().length) {
        if (this.GetText().charAt(VIndex - 1) === "&") {
          if ((VIndex < this.GetText().length) && (this.GetText().charAt((VIndex + 1) - 1) === "&")) {
            VIndex += 2}
           else if (VIndex < this.GetText().length) {
            if (pas.SysUtils.SameText(this.GetText().charAt((VIndex + 1) - 1),VKey)) {
              if (this.FFocusControl.CanSetFocus()) this.FFocusControl.SetFocus();
              AEvent.preventDefault();
              AEvent.stopPropagation();
              return true;
            };
            VIndex += 2;
          } else VIndex += 1;
        } else VIndex += 1;
      };
      return Result;
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        if (this.FTransparent) {
          $with.style.setProperty("background-color","transparent");
        };
        $with.style.setProperty("outline","none");
        $with.style.setProperty("user-select","none");
        $with.style.setProperty("-moz-user-select","none");
        $with.style.setProperty("-ms-user-select","none");
        $with.style.setProperty("-khtml-user-select","none");
        $with.style.setProperty("-webkit-user-select","none");
        $with.style.setProperty("word-break","break-word");
        if (this.FAutoSize) {
          $with.style.removeProperty("height");
          $with.style.removeProperty("width");
        };
        var $tmp = this.FAlignment;
        if ($tmp === pas.Classes.TAlignment.taCenter) {
          $with.style.setProperty("text-align","center")}
         else if ($tmp === pas.Classes.TAlignment.taLeftJustify) {
          $with.style.setProperty("text-align","left")}
         else if ($tmp === pas.Classes.TAlignment.taRightJustify) $with.style.setProperty("text-align","right");
        this.FHandleElement.setAttribute("name",this.FName);
        var $with1 = this.FContentElement;
        $with1.innerHTML = "";
        pas.Controls.UpdateHtmlElementFont(this.FContentElement,this.FFont,false);
        $with1.style.setProperty("display","table-cell");
        $with1.style.setProperty("width",pas.SysUtils.IntToStr(this.FWidth) + "px");
        $with1.style.setProperty("height",pas.SysUtils.IntToStr(this.FHeight) + "px");
        var $tmp1 = this.FLayout;
        if ($tmp1 === pas.Graphics.TTextLayout.tlBottom) {
          $with1.style.setProperty("vertical-align","bottom")}
         else if ($tmp1 === pas.Graphics.TTextLayout.tlCenter) {
          $with1.style.setProperty("vertical-align","middle")}
         else if ($tmp1 === pas.Graphics.TTextLayout.tlTop) $with1.style.setProperty("vertical-align","top");
        if (this.FWordWrap) {
          $with1.style.setProperty("word-wrap","break-word");
        } else {
          $with1.style.removeProperty("word-wrap");
        };
        $with1.style.setProperty("overflow","hidden");
        $with1.style.setProperty("text-overflow","ellipsis");
        $with1.innerHTML = $impl.CaptionToAccelHTML(this.GetText(),this.FShowAccelChar);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.CreateContentElement = function () {
      var Result = null;
      Result = this.FHandleElement.appendChild(document.createElement("label"));
      return Result;
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 65;
      Result.cy = 17;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FContentElement = this.CreateContentElement();
      this.FAlignment = pas.Classes.TAlignment.taLeftJustify;
      this.FFocusControl = null;
      this.FLayout = pas.Graphics.TTextLayout.tlTop;
      this.FShowAccelChar = true;
      this.FTransparent = true;
      this.FWordWrap = false;
      document.addEventListener("keydown",rtl.createCallback(this,"HandleAccelKey"));
      this.BeginUpdate();
      try {
        this.SetTabStop(false);
        this.SetAutoSize(true);
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      document.removeEventListener("keydown",rtl.createCallback(this,"HandleAccelKey"));
      pas.Controls.TControl.Destroy.call(this);
    };
    this.AdjustSize = function () {
      pas.Controls.TControl.AdjustSize.call(this);
      this.Changed();
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  this.ApplyScrollStyleToStyle = function (aStyle, aScrollStyle) {
    var $tmp = aScrollStyle;
    if ($tmp === $mod.TScrollStyle.ssNone) {
      aStyle.removeProperty("overflow-x");
      aStyle.removeProperty("overflow-y");
      aStyle.setProperty("overflow","hidden");
    } else if ($tmp === $mod.TScrollStyle.ssHorizontal) {
      aStyle.removeProperty("overflow");
      aStyle.setProperty("overflow-y","hidden");
      aStyle.setProperty("overflow-x","scroll");
    } else if ($tmp === $mod.TScrollStyle.ssVertical) {
      aStyle.removeProperty("overflow");
      aStyle.setProperty("overflow-x","hidden");
      aStyle.setProperty("overflow-y","scroll");
    } else if ($tmp === $mod.TScrollStyle.ssBoth) {
      aStyle.removeProperty("overflow-x");
      aStyle.removeProperty("overflow-y");
      aStyle.setProperty("overflow","scroll");
    } else if ($tmp === $mod.TScrollStyle.ssAutoHorizontal) {
      aStyle.removeProperty("overflow");
      aStyle.setProperty("overflow-y","hidden");
      aStyle.setProperty("overflow-x","auto");
    } else if ($tmp === $mod.TScrollStyle.ssAutoVertical) {
      aStyle.removeProperty("overflow");
      aStyle.setProperty("overflow-x","hidden");
      aStyle.setProperty("overflow-x","scroll");
    } else if ($tmp === $mod.TScrollStyle.ssAutoBoth) {
      aStyle.removeProperty("overflow-x");
      aStyle.removeProperty("overflow-y");
      aStyle.setProperty("overflow","auto");
    };
  };
  $mod.$implcode = function () {
    $impl._WCLStdRulesRegistered = false;
    $impl._RegisterWCLStdRules = function () {
      if ($impl._WCLStdRulesRegistered) return;
      pas.Controls.RegisterWCLStyle(".wcl-btn{" + "padding:6px 16px;" + "border-radius:4px;" + "border:1px solid #888;" + "background-color:#f0f0f0;" + "color:#333;" + "cursor:pointer;" + "font-size:14px!important;" + "display:inline-flex;" + "align-items:center;" + "justify-content:center;" + "touch-action:manipulation;" + "-webkit-tap-highlight-color:transparent;" + "transition:background-color 0.15s,border-color 0.15s;}" + "@media(hover:hover){" + ".wcl-btn:hover{background-color:#e0e0e0;border-color:#666;}" + "}" + ".wcl-btn:active{background-color:#d0d0d0;border-color:#555;}" + ".wcl-btn:disabled{opacity:0.5;cursor:default;pointer-events:none;}" + ".wcl-input,input.wcl-input,textarea.wcl-input{" + "padding:6px 8px;" + "border-radius:4px;" + "border:1px solid #888;" + "font-family:inherit;" + "font-size:inherit;" + "background-color:#fff;" + "box-sizing:border-box;" + "touch-action:manipulation;" + "-webkit-tap-highlight-color:transparent;}" + "select.wcl-input{" + "padding:3px 4px!important;" + "border-radius:4px;" + "border:1px solid #888;" + "font-size:14px!important;" + "background-color:#fff;}" + ".wcl-input:focus{outline:none;border-color:#4A90D9;box-shadow:0 0 0 2px rgba(74,144,217,0.2);}" + ".wcl-input:disabled{opacity:0.5;}" + ".wcl-scrollbar{" + "box-sizing:border-box;" + "display:flex;" + "align-items:center;" + "justify-content:center;" + "min-width:24px;" + "min-height:24px;}" + ".wcl-scrollbar input[type=range]{" + "width:100%;" + "height:100%;" + "margin:0;" + "padding:0;" + "cursor:pointer;" + "accent-color:#4A90D9;}" + ".wcl-scrollbar-vertical input[type=range]{" + "writing-mode:vertical-lr;" + "direction:rtl;}" + ".wcl-combo-dropdown{" + "position:fixed;" + "z-index:5000;" + "background:#fff;" + "border:1px solid #888;" + "border-radius:4px;" + "box-shadow:0 4px 12px rgba(0,0,0,0.2);" + "max-height:240px;" + "overflow:auto;" + "box-sizing:border-box;" + "padding:2px 0;}" + ".wcl-combo-item{" + "padding:4px 8px;" + "cursor:pointer;" + "white-space:nowrap;" + "overflow:hidden;" + "text-overflow:ellipsis;" + "color:#333;}" + "@media(hover:hover){" + ".wcl-combo-item:hover{background:#eef3fb;}" + "}" + ".wcl-combo-item-active{" + "background:#4A90D9;" + "color:#fff;}" + ".wcl-combo-list{" + "cursor:pointer;" + "padding-right:24px!important;" + "background-image:linear-gradient(45deg,transparent 50%,#666 50%),linear-gradient(135deg,#666 50%,transparent 50%);" + "background-position:calc(100% - 14px) 50%,calc(100% - 9px) 50%;" + "background-size:5px 5px,5px 5px;" + "background-repeat:no-repeat;}" + "@media(pointer:coarse){" + ".wcl-btn{min-height:36px;padding:8px 14px!important;}" + ".wcl-input,input.wcl-input,textarea.wcl-input{" + "min-height:36px;font-size:16px!important;padding:8px 10px!important;}" + "select.wcl-input{min-height:36px;font-size:16px!important;padding:6px 8px!important;}" + "}" + "@media(prefers-reduced-motion:reduce){" + ".wcl-btn{transition:none;}" + "}");
      $impl._WCLStdRulesRegistered = true;
    };
    $impl._ComboSeq = 0;
    rtl.createClass($impl,"TCustomMemoStrings",pas.Classes.TStringList,function () {
      this.DoReadData = function (Reader) {
        Reader.ReadListBegin();
        this.BeginUpdate();
        try {
          this.Clear();
          while (!Reader.EndOfList()) this.Add(Reader.ReadString());
        } finally {
          this.EndUpdate();
        };
        Reader.ReadListEnd();
      };
      this.DoWriteData = function (Writer) {
        var i = 0;
        var lStringsNoWordWrap = null;
        lStringsNoWordWrap = pas.Classes.TStringList.$create("Create$1");
        try {
          lStringsNoWordWrap.SetTextStr(this.GetTextStr());
          Writer.WriteListBegin();
          for (var $l = 0, $end = lStringsNoWordWrap.GetCount() - 1; $l <= $end; $l++) {
            i = $l;
            Writer.WriteString(lStringsNoWordWrap.Get(i));
          };
          Writer.WriteListEnd();
        } finally {
          lStringsNoWordWrap = rtl.freeLoc(lStringsNoWordWrap);
        };
      };
      this.DefineProperties = function (Filer) {
        var HasData = false;
        HasData = this.GetCount() > 0;
        Filer.DefineProperty("Strings",rtl.createCallback(this,"DoReadData"),rtl.createCallback(this,"DoWriteData"),HasData);
      };
    });
    $impl.EscapeHTMLChar = function (AChar) {
      var Result = "";
      var $tmp = AChar;
      if ($tmp === "&") {
        Result = "&amp;"}
       else if ($tmp === "<") {
        Result = "&lt;"}
       else if ($tmp === ">") {
        Result = "&gt;"}
       else if ($tmp === '"') {
        Result = "&quot;"}
       else if ($tmp === "'") {
        Result = "&#39;"}
       else {
        Result = AChar;
      };
      return Result;
    };
    $impl.CaptionToAccelHTML = function (AText, AShowAccel) {
      var Result = "";
      var VIndex = 0;
      var VChar = "\x00";
      Result = "";
      VIndex = 1;
      while (VIndex <= AText.length) {
        VChar = AText.charAt(VIndex - 1);
        if (VChar === "&") {
          if ((VIndex < AText.length) && (AText.charAt((VIndex + 1) - 1) === "&")) {
            Result = Result + "&amp;";
            VIndex += 2;
          } else if ((VIndex < AText.length) && AShowAccel) {
            Result = Result + "<u>" + $impl.EscapeHTMLChar(AText.charAt((VIndex + 1) - 1)) + "</u>";
            VIndex += 2;
          } else {
            Result = Result + "&amp;";
            VIndex += 1;
          };
        } else {
          Result = Result + $impl.EscapeHTMLChar(VChar);
          VIndex += 1;
        };
      };
      return Result;
    };
  };
},["RTLConsts"]);
//# sourceMappingURL=stdctrls.js.map
