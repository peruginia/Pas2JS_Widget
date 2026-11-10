rtl.module("Menus",["System","Classes","SysUtils","Types","Generics.Collections","JS","Web","Graphics","Controls"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.scShift = 8192;
  this.scCtrl = 16384;
  this.scAlt = 32768;
  this.$rtti.$Class("TMainMenu");
  this.$rtti.$Class("TMenuItem");
  this.$rtti.$Class("TMenuItems");
  this.$rtti.$MethodVar("TMouseMenuHandler",{procsig: rtl.newTIProcSig([["AEvent",pas.Web.$rtti["TJSMouseEvent"]]],rtl.boolean), methodkind: 1});
  this.$rtti.$MethodVar("TKeyMenuHandler",{procsig: rtl.newTIProcSig([["AEvent",pas.Web.$rtti["TJSKeyboardEvent"]]],rtl.boolean), methodkind: 1});
  rtl.createClass(this,"TMenuItem",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FAction = null;
      this.FAutoCheck = false;
      this.FCaption = "";
      this.FChecked = false;
      this.FDefault = false;
      this.FEnabled = false;
      this.FGroupIndex = 0;
      this.FImageIndex = 0;
      this.FImageUrl = "";
      this.FItems = null;
      this.FOwnerItems = null;
      this.FRadioItem = false;
      this.FShortCut = 0;
      this.FVisible = false;
      this.FOnClick = null;
      this.FRoot = null;
    };
    this.$final = function () {
      this.FAction = undefined;
      this.FItems = undefined;
      this.FOwnerItems = undefined;
      this.FOnClick = undefined;
      this.FRoot = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.SetAction = function (AValue) {
      if (this.FAction === AValue) return;
      if (this.FAction != null) {
        this.FAction.RemoveFreeNotification(this);
        this.FAction.UnregisterClient(this);
      };
      this.FAction = AValue;
      if (this.FAction != null) {
        this.FAction.RegisterClient(this,rtl.createCallback(this,"ActionUpdate"));
        this.FAction.FreeNotification(this);
        this.ActionUpdate(this.FAction);
      };
    };
    this.SetCaption = function (AValue) {
      if (this.FCaption !== AValue) {
        this.FCaption = AValue;
        this.MenuChanged();
      };
    };
    this.SetChecked = function (AValue) {
      if (this.FChecked !== AValue) {
        this.FChecked = AValue;
        if (this.FChecked) this.UncheckRadioSiblings();
        this.MenuChanged();
      };
    };
    this.SetEnabled = function (AValue) {
      if (this.FEnabled !== AValue) {
        this.FEnabled = AValue;
        this.MenuChanged();
      };
    };
    this.SetRadioItem = function (AValue) {
      if (this.FRadioItem !== AValue) {
        this.FRadioItem = AValue;
        this.MenuChanged();
      };
    };
    this.SetShortCut = function (AValue) {
      if (this.FShortCut !== AValue) {
        this.FShortCut = AValue;
        this.MenuChanged();
      };
    };
    this.SetVisible = function (AValue) {
      if (this.FVisible !== AValue) {
        this.FVisible = AValue;
        this.MenuChanged();
      };
    };
    this.SetGroupIndex = function (AValue) {
      if (this.FGroupIndex !== AValue) {
        this.FGroupIndex = AValue;
        this.MenuChanged();
      };
    };
    this.SetImageUrl = function (AValue) {
      if (this.FImageUrl !== AValue) {
        this.FImageUrl = AValue;
        this.MenuChanged();
      };
    };
    this.UncheckRadioSiblings = function () {
      var VIndex = 0;
      var VItem = null;
      if (!this.FRadioItem || !(this.FOwnerItems != null) || (this.FGroupIndex === 0)) return;
      for (var $l = 0, $end = this.FOwnerItems.GetCount() - 1; $l <= $end; $l++) {
        VIndex = $l;
        VItem = this.FOwnerItems.GetItem(VIndex);
        if ((VItem !== this) && VItem.FRadioItem && (VItem.FGroupIndex === this.FGroupIndex) && VItem.FChecked) VItem.SetChecked(false);
      };
    };
    this.MenuChanged = function () {
      if (this.FRoot != null) this.FRoot.Update();
    };
    this.GetShortCut = function () {
      var Result = 0;
      if (this.FShortCut !== 0) {
        Result = this.FShortCut}
       else if (this.FAction != null) {
        Result = this.FAction.FShortCut}
       else Result = 0;
      return Result;
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
      if ((Operation === pas.Classes.TOperation.opRemove) && (AComponent === this.FAction)) this.FAction = null;
      if ($mod.TMenuItem.isPrototypeOf(AComponent) && (this.FItems != null) && (AComponent.FOwner === this)) {
        if (Operation === pas.Classes.TOperation.opInsert) {
          this.FItems.AddItem(AComponent)}
         else this.FItems.RemoveItem(AComponent);
      };
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FAutoCheck = false;
      this.FChecked = false;
      this.FDefault = false;
      this.FEnabled = true;
      this.FGroupIndex = 0;
      this.FImageIndex = -1;
      this.FImageUrl = "";
      this.FRadioItem = false;
      this.FVisible = true;
      this.FCaption = "";
      this.FShortCut = 0;
      this.FRoot = null;
      if ($mod.TMenuItem.isPrototypeOf(AOwner)) {
        this.FRoot = AOwner.FRoot}
       else if ($mod.TMainMenu.isPrototypeOf(AOwner)) this.FRoot = AOwner;
      this.FItems = $mod.TMenuItems.$create("Create$1",[this,this.FRoot]);
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FItems");
      this.FItems = null;
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.ActionUpdate = function (Sender) {
      if (!(this.FAction != null)) return;
      this.FCaption = this.FAction.FCaption;
      this.FEnabled = this.FAction.FEnabled;
      this.FVisible = this.FAction.FVisible;
      this.FChecked = this.FAction.FChecked;
      this.MenuChanged();
    };
    this.Click = function () {
      if (!this.FEnabled) return;
      if (this.FAction != null) {
        this.FAction.Execute();
        return;
      };
      if (this.FAutoCheck) {
        this.SetChecked(!this.FChecked)}
       else if (this.FRadioItem) this.SetChecked(true);
      if (this.FOnClick != null) this.FOnClick(this);
    };
    this.IsSeparator = function () {
      var Result = false;
      Result = pas.SysUtils.Trim(this.FCaption) === "-";
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Action",2,pas.Controls.$rtti["TBasicAction"],"FAction","SetAction");
    $r.addProperty("AutoCheck",0,rtl.boolean,"FAutoCheck","FAutoCheck",{Default: false});
    $r.addProperty("Caption",2,rtl.string,"FCaption","SetCaption");
    $r.addProperty("Checked",2,rtl.boolean,"FChecked","SetChecked",{Default: false});
    $r.addProperty("Default",0,rtl.boolean,"FDefault","FDefault",{Default: false});
    $r.addProperty("Enabled",2,rtl.boolean,"FEnabled","SetEnabled",{Default: true});
    $r.addProperty("GroupIndex",2,rtl.nativeint,"FGroupIndex","SetGroupIndex",{Default: 0});
    $r.addProperty("ImageIndex",0,rtl.nativeint,"FImageIndex","FImageIndex",{Default: -1});
    $r.addProperty("ImageUrl",2,rtl.string,"FImageUrl","SetImageUrl");
    $r.addProperty("RadioItem",2,rtl.boolean,"FRadioItem","SetRadioItem",{Default: false});
    $r.addProperty("ShortCut",3,rtl.word,"GetShortCut","SetShortCut",{Default: 0});
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible",{Default: true});
    $r.addProperty("OnClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnClick","FOnClick");
  });
  rtl.createClass(this,"TMenuItems",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FItems = null;
      this.FOwnerComponent = null;
      this.FRoot = null;
    };
    this.$final = function () {
      this.FItems = undefined;
      this.FOwnerComponent = undefined;
      this.FRoot = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FItems.FLength;
      return Result;
    };
    this.GetItem = function (AIndex) {
      var Result = null;
      if ((AIndex >= 0) && (AIndex < this.FItems.FLength)) {
        Result = this.FItems.GetItem(AIndex)}
       else Result = null;
      return Result;
    };
    this.Create$1 = function (AOwnerComponent, ARoot) {
      pas.System.TObject.Create.call(this);
      this.FOwnerComponent = AOwnerComponent;
      this.FRoot = ARoot;
      this.FItems = pas["Generics.Collections"].TList$G6.$create("Create$1");
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FItems");
      this.FItems = null;
      pas.System.TObject.Destroy.call(this);
    };
    this.Add = function (ACaption, AOnClick) {
      var Result = null;
      Result = $mod.TMenuItem.$create("Create$1",[this.FOwnerComponent]);
      Result.FRoot = this.FRoot;
      Result.FCaption = ACaption;
      Result.FOnClick = AOnClick;
      if (this.FRoot != null) this.FRoot.Update();
      return Result;
    };
    this.AddSeparator = function () {
      var Result = null;
      Result = this.Add("-",null);
      return Result;
    };
    this.Clear = function () {
      var VItem = null;
      while (this.FItems.FLength > 0) {
        VItem = this.FItems.GetItem(0);
        VItem = rtl.freeLoc(VItem);
      };
    };
    this.IndexOf = function (AItem) {
      var Result = 0;
      Result = this.FItems.IndexOf(AItem);
      return Result;
    };
    this.AddItem = function (AItem) {
      if ((AItem != null) && (this.FItems.IndexOf(AItem) < 0)) {
        this.FItems.Add(AItem);
        AItem.FOwnerItems = this;
      };
    };
    this.RemoveItem = function (AItem) {
      var VIndex = 0;
      VIndex = this.FItems.IndexOf(AItem);
      if (VIndex >= 0) this.FItems.Delete(VIndex);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwnerComponent",pas.Classes.$rtti["TComponent"]],["ARoot",$mod.$rtti["TMainMenu"]]]);
  });
  rtl.createClass(this,"TMenuBar",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FDocClick = null;
      this.FDocKeyDown = null;
      this.FMenu = null;
      this.FShortCutKeys = null;
      this.FOpenPath = "";
    };
    this.$final = function () {
      this.FDocClick = undefined;
      this.FDocKeyDown = undefined;
      this.FMenu = undefined;
      this.FShortCutKeys = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.SetMenu = function (AValue) {
      this.FMenu = AValue;
      this.Render();
    };
    this.GetDataAttr = function (AElement, AName) {
      var Result = "";
      Result = "";
      if (rtl.isExt(AElement,HTMLElement)) {
        Result = AElement.getAttribute(AName);
        if (Result == null) Result = "";
      };
      return Result;
    };
    this.IsPathOpen = function (APath) {
      var Result = false;
      Result = (this.FOpenPath === APath) || (pas.System.Copy(this.FOpenPath,1,APath.length + 1) === (APath + "-"));
      return Result;
    };
    this.ParentPath = function (APath) {
      var Result = "";
      var VPos = 0;
      VPos = pas.SysUtils.LastDelimiter("-",APath);
      if (VPos === 0) {
        Result = ""}
       else Result = pas.System.Copy(APath,1,VPos - 1);
      return Result;
    };
    this.FindItem = function (APath) {
      var Result = null;
      var VRest = "";
      var VPart = "";
      var VPos = 0;
      var VItems = null;
      var VItem = null;
      Result = null;
      if (!(this.FMenu != null) || (APath === "")) return Result;
      VItems = this.FMenu.FItems;
      VRest = APath;
      VItem = null;
      while (VRest !== "") {
        VPos = pas.System.Pos("-",VRest);
        if (VPos === 0) {
          VPart = VRest;
          VRest = "";
        } else {
          VPart = pas.System.Copy(VRest,1,VPos - 1);
          VRest = pas.System.Copy(VRest,VPos + 1,2147483647);
        };
        if (!(VItems != null)) return Result;
        VItem = VItems.GetItem(pas.SysUtils.StrToIntDef(VPart,-1));
        if (!(VItem != null)) return Result;
        VItems = VItem.FItems;
      };
      Result = VItem;
      return Result;
    };
    this.RenderItems = function (AItems, APath, ALevel, AHtml) {
      var VIndex = 0;
      var VItem = null;
      var VClass = "";
      var VCheck = "";
      var VIcon = "";
      var VStyle = "";
      var VShortCut = "";
      var VPath = "";
      if (!(AItems != null)) return;
      for (var $l = 0, $end = AItems.GetCount() - 1; $l <= $end; $l++) {
        VIndex = $l;
        VItem = AItems.GetItem(VIndex);
        if (!(VItem != null) || !VItem.FVisible) continue;
        if (VItem.IsSeparator()) {
          AHtml.set(AHtml.get() + '<div class="wcl-menubar-sep"></div>');
          continue;
        };
        VPath = pas.SysUtils.IntToStr(VIndex);
        if (APath !== "") VPath = APath + "-" + VPath;
        VClass = "wcl-menubar-entry";
        if (!VItem.FEnabled) VClass = VClass + " wcl-disabled";
        if (VItem.FItems.GetCount() > 0) VClass = VClass + " wcl-has-sub";
        VCheck = "";
        if (VItem.FChecked) VCheck = "&#10003; ";
        VIcon = "";
        if (VItem.FImageUrl !== "") VIcon = '<img class="wcl-menubar-icon" src="' + $impl.EscapeMenuText(VItem.FImageUrl) + '">';
        VStyle = "";
        if (VItem.FDefault) VStyle = ' style="font-weight:bold"';
        AHtml.set(AHtml.get() + '<div class="' + VClass + '" data-path="' + VPath + '">' + VIcon + "<span" + VStyle + ">" + VCheck + $impl.EscapeMenuText(VItem.FCaption) + "</span>");
        VShortCut = $mod.ShortCutToText(VItem.GetShortCut());
        if (VShortCut !== "") AHtml.set(AHtml.get() + '<span class="wcl-menubar-shortcut">' + $impl.EscapeMenuText(VShortCut) + "</span>");
        if ((VItem.FItems.GetCount() > 0) && this.IsPathOpen(VPath)) {
          AHtml.set(AHtml.get() + '<div class="wcl-menubar-drop">');
          this.RenderItems(VItem.FItems,VPath,ALevel + 1,AHtml);
          AHtml.set(AHtml.get() + "</div>");
        };
        AHtml.set(AHtml.get() + "</div>");
      };
    };
    this.StartDocTracking = function () {
      document.addEventListener('click', this.FDocClick, true);
      document.addEventListener('keydown', this.FDocKeyDown, true);
    };
    this.StopDocTracking = function () {
      document.removeEventListener('click', this.FDocClick, true);
      document.removeEventListener('keydown', this.FDocKeyDown, true);
    };
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && rtl.eqSet(rtl.intersectSet(rtl.createSet(pas.Classes.TComponentStateItem.csLoading,pas.Classes.TComponentStateItem.csDestroying),this.FComponentState),{})) this.FHandleElement.style.setProperty("overflow","visible");
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.HandleClick = function (AEvent) {
      var Result = false;
      var VElement = null;
      var VPath = "";
      var VItem = null;
      Result = pas.Controls.TControl.HandleClick.call(this,AEvent);
      if (!(this.FMenu != null)) return Result;
      VElement = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
      while ((VElement != null) && (VElement !== this.FHandleElement)) {
        VPath = this.GetDataAttr(VElement,"data-path");
        if (VPath !== "") {
          VItem = this.FindItem(VPath);
          if ((VItem != null) && (VItem.FItems.GetCount() > 0)) {
            if (this.IsPathOpen(VPath) && (this.FOpenPath === VPath)) {
              this.FOpenPath = this.ParentPath(VPath)}
             else this.FOpenPath = VPath;
            this.Render();
            this.StartDocTracking();
          } else {
            this.FOpenPath = "";
            this.StopDocTracking();
            this.Render();
            if (VItem != null) VItem.Click();
          };
          Result = true;
          return Result;
        };
        VElement = VElement.parentElement;
      };
      return Result;
    };
    this.HandleDocClick = function (AEvent) {
      var Result = false;
      var VTarget = null;
      Result = false;
      if (this.FOpenPath === "") return Result;
      VTarget = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
      if ((VTarget != null) && this.FHandleElement.contains(VTarget)) return Result;
      this.CloseDropdown();
      Result = true;
      return Result;
    };
    this.HandleDocKeyDown = function (AEvent) {
      var Result = false;
      Result = false;
      if (this.FOpenPath === "") return Result;
      if (AEvent.key === "Escape") {
        this.CloseDropdown();
        Result = true;
      };
      return Result;
    };
    this.HandleShortCutKey = function (AEvent) {
      var Result = false;
      var VShortCut = 0;
      var VItem = null;
      var VTarget = null;
      var VTag = "";
      Result = false;
      if (!(this.FMenu != null)) return Result;
      VShortCut = $impl.KeyEventToShortCut(AEvent);
      if (VShortCut === 0) return Result;
      if ((VShortCut & (16384 | 32768)) === 0) {
        VTarget = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
        if ((VTarget != null) && rtl.isExt(VTarget,HTMLElement)) {
          VTag = VTarget.tagName;
          if ((VTag === "INPUT") || (VTag === "TEXTAREA") || (VTag === "SELECT")) return Result;
        };
      };
      VItem = $impl.FindShortCutItem(this.FMenu.FItems,VShortCut);
      if (!(VItem != null)) return Result;
      AEvent.preventDefault();
      AEvent.stopPropagation();
      this.CloseDropdown();
      VItem.Click();
      Result = true;
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 300;
      Result.cy = 26;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FDocClick = rtl.createCallback(this,"HandleDocClick");
      this.FDocKeyDown = rtl.createCallback(this,"HandleDocKeyDown");
      this.FShortCutKeys = rtl.createCallback(this,"HandleShortCutKey");
      this.FMenu = null;
      this.FOpenPath = "";
      document.addEventListener('keydown', this.FShortCutKeys, true);
      $impl._RegisterMenuRules();
      this.BeginUpdate();
      try {
        this.SetColor(16777215);
        this.SetHeight(pas.Controls.IfThen$2(pas.Forms.Screen.GetIsTouch(),36,26));
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      this.StopDocTracking();
      document.removeEventListener('keydown', this.FShortCutKeys, true);
      pas.Controls.TCustomControl.Destroy.call(this);
    };
    this.CloseDropdown = function () {
      if (this.FOpenPath === "") return;
      this.FOpenPath = "";
      this.StopDocTracking();
      this.Render();
    };
    this.Render = function () {
      var VHtml = "";
      var VIndex = 0;
      var VItem = null;
      var VClass = "";
      var VPath = "";
      if (!(this.FMenu != null)) return;
      $impl._RegisterMenuRules();
      VHtml = '<div class="wcl-menubar-items">';
      for (var $l = 0, $end = this.FMenu.FItems.GetCount() - 1; $l <= $end; $l++) {
        VIndex = $l;
        VItem = this.FMenu.FItems.GetItem(VIndex);
        if (!(VItem != null) || !VItem.FVisible) continue;
        VPath = pas.SysUtils.IntToStr(VIndex);
        VClass = "wcl-menubar-item";
        if (this.IsPathOpen(VPath)) VClass = VClass + " wcl-open";
        VHtml = VHtml + '<div class="' + VClass + '" data-path="' + VPath + '">' + $impl.EscapeMenuText(VItem.FCaption);
        if ((VItem.FItems.GetCount() > 0) && this.IsPathOpen(VPath)) {
          VHtml = VHtml + '<div class="wcl-menubar-drop">';
          this.RenderItems(VItem.FItems,VPath,1,{get: function () {
              return VHtml;
            }, set: function (v) {
              VHtml = v;
            }});
          VHtml = VHtml + "</div>";
        };
        VHtml = VHtml + "</div>";
      };
      VHtml = VHtml + "</div>";
      this.FHandleElement.innerHTML = VHtml;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TMainMenu",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FBar = null;
      this.FItems = null;
      this.FLeft = 0;
      this.FTop = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FBar = undefined;
      this.FItems = undefined;
      this.FOnChange = undefined;
      pas.Classes.TComponent.$final.call(this);
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
      if ($mod.TMenuItem.isPrototypeOf(AComponent) && (this.FItems != null)) {
        if (Operation === pas.Classes.TOperation.opInsert) {
          this.FItems.AddItem(AComponent)}
         else this.FItems.RemoveItem(AComponent);
      };
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FBar = null;
      this.FLeft = 0;
      this.FTop = 0;
      this.FItems = $mod.TMenuItems.$create("Create$1",[this,this]);
      this.Update();
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FItems");
      this.FItems = null;
      if (this.FBar != null) {
        this.FBar.SetMenu(null);
        rtl.free(this,"FBar");
        this.FBar = null;
      };
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.Update = function () {
      var VParent = null;
      if (!(this.FBar != null) && pas.Controls.TWinControl.isPrototypeOf(this.FOwner)) {
        VParent = this.FOwner;
        this.FBar = $mod.TMenuBar.$create("Create$1",[this]);
        this.FBar.SetParent(VParent);
        this.FBar.SetAlign(pas.Controls.TAlign.alTop);
        this.FBar.SetHeight(pas.Controls.IfThen$2(pas.Forms.Screen.GetIsTouch(),36,26));
        this.FBar.SetMenu(this);
      };
      if (this.FBar != null) this.FBar.Render();
      if (this.FOnChange != null) this.FOnChange(this);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Left",0,rtl.nativeint,"FLeft","FLeft",{Default: 0});
    $r.addProperty("Top",0,rtl.nativeint,"FTop","FTop",{Default: 0});
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
  });
  rtl.createClass(this,"TPopupMenu",pas.Controls.TCustomPopupMenu,function () {
    this.$init = function () {
      pas.Controls.TCustomPopupMenu.$init.call(this);
      this.FDocClick = null;
      this.FDocKeyDown = null;
      this.FItems = null;
      this.FOnChange = null;
      this.FOpen = false;
      this.FPanel = null;
      this.FPanelClick = null;
    };
    this.$final = function () {
      this.FDocClick = undefined;
      this.FDocKeyDown = undefined;
      this.FItems = undefined;
      this.FOnChange = undefined;
      this.FPanel = undefined;
      this.FPanelClick = undefined;
      pas.Controls.TCustomPopupMenu.$final.call(this);
    };
    this.EnsurePanel = function () {
      if (this.FPanel != null) return;
      this.FPanel = document.createElement("div");
      this.FPanel.className = "wcl-menubar-drop wcl-popup";
      this.FPanel.style.setProperty("position","fixed");
      this.FPanel.style.setProperty("display","none");
      this.FPanel.style.setProperty("z-index","2000");
      this.FPanel.addEventListener("click",rtl.createCallback(this,"HandlePanelClick"));
      document.body.appendChild(this.FPanel);
    };
    this.HandleDocClick = function (AEvent) {
      var Result = false;
      var VTarget = null;
      Result = false;
      if (!this.FOpen || !(this.FPanel != null)) return Result;
      VTarget = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
      if ((VTarget != null) && this.FPanel.contains(VTarget)) return Result;
      this.Close();
      Result = true;
      return Result;
    };
    this.HandleDocKeyDown = function (AEvent) {
      var Result = false;
      Result = false;
      if (!this.FOpen) return Result;
      if (AEvent.key === "Escape") {
        this.Close();
        Result = true;
      };
      return Result;
    };
    this.HandlePanelClick = function (AEvent) {
      var Result = false;
      var VElement = null;
      var VPath = "";
      var VItem = null;
      Result = false;
      VElement = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
      while ((VElement != null) && (VElement !== this.FPanel)) {
        VPath = "";
        if (rtl.isExt(VElement,HTMLElement)) {
          VPath = VElement.getAttribute("data-path");
          if (VPath == null) VPath = "";
        };
        if (VPath !== "") {
          VItem = this.FItems.GetItem(pas.SysUtils.StrToIntDef(VPath,-1));
          this.Close();
          if (VItem != null) VItem.Click();
          Result = true;
          return Result;
        };
        VElement = VElement.parentElement;
      };
      return Result;
    };
    this.StartDocTracking = function () {
      document.addEventListener('click', this.FDocClick, true);
      document.addEventListener('keydown', this.FDocKeyDown, true);
    };
    this.StopDocTracking = function () {
      document.removeEventListener('click', this.FDocClick, true);
      document.removeEventListener('keydown', this.FDocKeyDown, true);
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FDocClick = rtl.createCallback(this,"HandleDocClick");
      this.FDocKeyDown = rtl.createCallback(this,"HandleDocKeyDown");
      this.FPanelClick = rtl.createCallback(this,"HandlePanelClick");
      this.FItems = $mod.TMenuItems.$create("Create$1",[this,null]);
      this.FPanel = null;
      this.FOpen = false;
      this.FOnChange = null;
      return this;
    };
    this.Destroy = function () {
      this.Close();
      rtl.free(this,"FItems");
      this.FItems = null;
      if (this.FPanel != null) {
        document.body.removeChild(this.FPanel);
        this.FPanel = null;
      };
      pas.Classes.TComponent.Destroy.call(this);
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
      if ($mod.TMenuItem.isPrototypeOf(AComponent) && (this.FItems != null) && (AComponent.FOwner === this)) {
        if (Operation === pas.Classes.TOperation.opInsert) {
          this.FItems.AddItem(AComponent)}
         else this.FItems.RemoveItem(AComponent);
      };
    };
    this.Close = function () {
      if (!this.FOpen) return;
      this.FOpen = false;
      this.StopDocTracking();
      if (this.FPanel != null) this.FPanel.style.setProperty("display","none");
      if (this.FOnChange != null) this.FOnChange(this);
    };
    this.PopupAt = function (AX, AY) {
      var VWidth = 0;
      var VHeight = 0;
      var VLeft = 0;
      var VTop = 0;
      this.Render();
      if (this.FItems.GetCount() === 0) return;
      this.FPanel.style.setProperty("left","0px");
      this.FPanel.style.setProperty("top","0px");
      this.FPanel.style.setProperty("display","block");
      this.FPanel.style.setProperty("visibility","hidden");
      VWidth = pas.System.Trunc(this.FPanel.offsetWidth);
      VHeight = pas.System.Trunc(this.FPanel.offsetHeight);
      VLeft = pas.System.Trunc(AX);
      VTop = pas.System.Trunc(AY);
      if ((VLeft + VWidth) > window.innerWidth) VLeft = pas.System.Trunc(AX) - VWidth;
      if ((VTop + VHeight) > window.innerHeight) VTop = pas.System.Trunc(AY) - VHeight;
      if (VLeft < 0) VLeft = 0;
      if (VTop < 0) VTop = 0;
      this.FPanel.style.setProperty("left",pas.SysUtils.IntToStr(VLeft) + "px");
      this.FPanel.style.setProperty("top",pas.SysUtils.IntToStr(VTop) + "px");
      this.FPanel.style.setProperty("visibility","visible");
      this.FOpen = true;
      this.StartDocTracking();
      if (this.FOnChange != null) this.FOnChange(this);
    };
    this.Render = function () {
      var VHtml = "";
      var VIndex = 0;
      var VItem = null;
      var VClass = "";
      var VCheck = "";
      var VIcon = "";
      var VStyle = "";
      var VShortCut = "";
      this.EnsurePanel();
      $impl._RegisterMenuRules();
      VHtml = "";
      for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
        VIndex = $l;
        VItem = this.FItems.GetItem(VIndex);
        if (!(VItem != null) || !VItem.FVisible) continue;
        if (VItem.IsSeparator()) {
          VHtml = VHtml + '<div class="wcl-menubar-sep"></div>';
          continue;
        };
        VClass = "wcl-menubar-entry";
        if (!VItem.FEnabled) VClass = VClass + " wcl-disabled";
        if (VItem.FItems.GetCount() > 0) VClass = VClass + " wcl-has-sub";
        VCheck = "";
        if (VItem.FChecked) VCheck = "&#10003; ";
        VIcon = "";
        if (VItem.FImageUrl !== "") VIcon = '<img class="wcl-menubar-icon" src="' + $impl.EscapeMenuText(VItem.FImageUrl) + '">';
        VStyle = "";
        if (VItem.FDefault) VStyle = ' style="font-weight:bold"';
        VHtml = VHtml + '<div class="' + VClass + '" data-path="' + pas.SysUtils.IntToStr(VIndex) + '">' + VIcon + "<span" + VStyle + ">" + VCheck + $impl.EscapeMenuText(VItem.FCaption) + "</span>";
        VShortCut = $mod.ShortCutToText(VItem.GetShortCut());
        if (VShortCut !== "") VHtml = VHtml + '<span class="wcl-menubar-shortcut">' + $impl.EscapeMenuText(VShortCut) + "</span>";
        VHtml = VHtml + "</div>";
      };
      this.FPanel.innerHTML = VHtml;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
  });
  this.TextToShortCut = function (AText) {
    var Result = 0;
    var VRest = "";
    var VPart = "";
    var VPos = 0;
    Result = 0;
    VRest = pas.SysUtils.UpperCase(pas.SysUtils.Trim(AText));
    if (VRest === "") return Result;
    while (true) {
      VPos = pas.System.Pos("+",VRest);
      if (VPos === 0) break;
      VPart = pas.SysUtils.Trim(pas.System.Copy(VRest,1,VPos - 1));
      if ((VPart === "CTRL") || (VPart === "CONTROL")) {
        Result = Result | 16384}
       else if (VPart === "SHIFT") {
        Result = Result | 8192}
       else if (VPart === "ALT") Result = Result | 32768;
      VRest = pas.System.Copy(VRest,VPos + 1,2147483647);
    };
    Result = Result | $impl.KeyNameToCode(pas.SysUtils.Trim(VRest));
    return Result;
  };
  this.ShortCutToText = function (AShortCut) {
    var Result = "";
    var VCode = 0;
    var VName = "";
    Result = "";
    if (AShortCut === 0) return Result;
    VCode = AShortCut & 0xFFF;
    if ((AShortCut & 16384) !== 0) Result = "Ctrl+";
    if ((AShortCut & 8192) !== 0) Result = Result + "Shift+";
    if ((AShortCut & 32768) !== 0) Result = Result + "Alt+";
    var $tmp = VCode;
    if ($tmp === 27) {
      VName = "Esc"}
     else if ($tmp === 13) {
      VName = "Enter"}
     else if ($tmp === 9) {
      VName = "Tab"}
     else if ($tmp === 32) {
      VName = "Space"}
     else if ($tmp === 8) {
      VName = "Backspace"}
     else if ($tmp === 46) {
      VName = "Delete"}
     else if ($tmp === 45) {
      VName = "Insert"}
     else if ($tmp === 36) {
      VName = "Home"}
     else if ($tmp === 35) {
      VName = "End"}
     else if ($tmp === 33) {
      VName = "PageUp"}
     else if ($tmp === 34) {
      VName = "PageDown"}
     else if ($tmp === 37) {
      VName = "Left"}
     else if ($tmp === 38) {
      VName = "Up"}
     else if ($tmp === 39) {
      VName = "Right"}
     else if ($tmp === 40) {
      VName = "Down"}
     else {
      if ((VCode >= 112) && (VCode <= 123)) {
        VName = "F" + pas.SysUtils.IntToStr(VCode - 111)}
       else if ((VCode >= 32) && (VCode < 127)) {
        VName = String.fromCharCode(VCode)}
       else VName = "";
    };
    Result = Result + VName;
    return Result;
  };
  $mod.$implcode = function () {
    $impl.MenuRules = ".wcl-menubar-items{display:flex;align-items:stretch;height:100%;" + "font:13px system-ui,-apple-system,Segoe UI,sans-serif}" + ".wcl-menubar-item{position:relative;display:flex;align-items:center;" + "padding:0 12px;cursor:pointer;color:#222;user-select:none;white-space:nowrap}" + ".wcl-menubar-item:hover{background:#e8e8e8}" + ".wcl-menubar-item.wcl-open{background:#dcdcdc}" + ".wcl-menubar-drop{position:absolute;top:100%;left:0;min-width:190px;" + "background:#fff;color:#222;border:1px solid #c9c3ba;box-shadow:0 4px 12px rgba(0,0,0,.18);" + "padding:4px 0;z-index:1000}" + ".wcl-menubar-entry{position:relative;display:flex;align-items:center;gap:16px;" + "justify-content:space-between;padding:6px 14px;cursor:pointer;white-space:nowrap}" + ".wcl-menubar-entry:hover{background:#2a7efe;color:#fff}" + ".wcl-menubar-entry.wcl-disabled{color:#aaa;pointer-events:none}" + ".wcl-menubar-icon{width:16px;height:16px;object-fit:contain;margin-right:6px;flex:0 0 auto}" + '.wcl-menubar-entry.wcl-has-sub::after{content:"\\25B8";font-size:10px;color:#888;margin-left:8px}' + ".wcl-menubar-entry:hover.wcl-has-sub::after{color:#fff}" + ".wcl-menubar-entry .wcl-menubar-drop{left:100%;top:-5px}" + ".wcl-menubar-sep{height:1px;background:#ddd;margin:4px 0}" + ".wcl-menubar-shortcut{color:#888;font-size:12px}" + ".wcl-menubar-entry:hover .wcl-menubar-shortcut{color:#eee}" + "@media(pointer:coarse){" + ".wcl-menubar-item{padding:0 16px;}" + ".wcl-menubar-entry{min-height:36px;padding:8px 14px;}" + "}";
    $impl._MenuRulesRegistered = false;
    $impl._RegisterMenuRules = function () {
      if (!$impl._MenuRulesRegistered) {
        $impl._MenuRulesRegistered = true;
        pas.Controls.RegisterWCLStyle($impl.MenuRules);
      };
    };
    $impl.EscapeMenuText = function (AText) {
      var Result = "";
      Result = pas.SysUtils.StringReplace(AText,"&","&amp;",rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll));
      Result = pas.SysUtils.StringReplace(Result,"<","&lt;",rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll));
      Result = pas.SysUtils.StringReplace(Result,">","&gt;",rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll));
      Result = pas.SysUtils.StringReplace(Result,'"',"&quot;",rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll));
      return Result;
    };
    $impl.KeyNameToCode = function (AName) {
      var Result = 0;
      var VNumber = 0;
      Result = 0;
      if (AName.length === 1) return AName.charCodeAt(1 - 1);
      if (AName === "ESC") return 27;
      if (AName === "ENTER") return 13;
      if (AName === "TAB") return 9;
      if (AName === "SPACE") return 32;
      if (AName === "BACKSPACE") return 8;
      if (AName === "DELETE") return 46;
      if (AName === "INSERT") return 45;
      if (AName === "HOME") return 36;
      if (AName === "END") return 35;
      if (AName === "PAGEUP") return 33;
      if (AName === "PAGEDOWN") return 34;
      if (AName === "LEFT") return 37;
      if (AName === "UP") return 38;
      if (AName === "RIGHT") return 39;
      if (AName === "DOWN") return 40;
      if (pas.System.Copy(AName,1,1) === "F") {
        VNumber = pas.SysUtils.StrToIntDef(pas.System.Copy(AName,2,2147483647),0);
        if ((VNumber >= 1) && (VNumber <= 12)) return 111 + VNumber;
      };
      return Result;
    };
    $impl.KeyEventToShortCut = function (AEvent) {
      var Result = 0;
      var VCode = "";
      var VName = "";
      var VNumber = 0;
      Result = 0;
      if (!(AEvent != null)) return Result;
      VCode = "";
      if (AEvent.code != null) VCode = AEvent.code;
      if (VCode === '') {
        if (AEvent.key != null) VCode = AEvent.key;
      };
      if (VCode === "") return Result;
      VName = pas.SysUtils.UpperCase(VCode);
      if (VCode.length === 1) {
        Result = VName.charCodeAt(1 - 1)}
       else if ((pas.System.Copy(VName,1,3) === "KEY") && (VCode.length === 4)) {
        Result = VName.charCodeAt(4 - 1)}
       else if ((pas.System.Copy(VName,1,5) === "DIGIT") && (VCode.length === 6)) {
        Result = VName.charCodeAt(6 - 1)}
       else if ((VName === "ESCAPE") || (VName === "ESC")) {
        Result = 27}
       else if ((VName === "ENTER") || (VName === "NUMENTER")) {
        Result = 13}
       else if (VName === "TAB") {
        Result = 9}
       else if (VName === "SPACE") {
        Result = 32}
       else if (VName === "BACKSPACE") {
        Result = 8}
       else if ((VName === "DELETE") || (VName === "DEL")) {
        Result = 46}
       else if ((VName === "INSERT") || (VName === "INS")) {
        Result = 45}
       else if (VName === "HOME") {
        Result = 36}
       else if (VName === "END") {
        Result = 35}
       else if (VName === "PAGEUP") {
        Result = 33}
       else if (VName === "PAGEDOWN") {
        Result = 34}
       else if ((VName === "ARROWLEFT") || (VName === "LEFT")) {
        Result = 37}
       else if ((VName === "ARROWUP") || (VName === "UP")) {
        Result = 38}
       else if ((VName === "ARROWRIGHT") || (VName === "RIGHT")) {
        Result = 39}
       else if ((VName === "ARROWDOWN") || (VName === "DOWN")) {
        Result = 40}
       else if (VName.charAt(0) === "F") {
        VNumber = pas.SysUtils.StrToIntDef(pas.System.Copy(VName,2,2147483647),0);
        if ((VNumber >= 1) && (VNumber <= 12)) Result = 111 + VNumber;
      };
      if (Result === 0) return Result;
      if (AEvent.ctrlKey) Result = Result | 16384;
      if (AEvent.shiftKey) Result = Result | 8192;
      if (AEvent.altKey) Result = Result | 32768;
      return Result;
    };
    $impl.FindShortCutItem = function (AItems, AShortCut) {
      var Result = null;
      var VIndex = 0;
      var VItem = null;
      Result = null;
      if (!(AItems != null) || (AShortCut === 0)) return Result;
      for (var $l = 0, $end = AItems.GetCount() - 1; $l <= $end; $l++) {
        VIndex = $l;
        VItem = AItems.GetItem(VIndex);
        if (!(VItem != null) || !VItem.FVisible || !VItem.FEnabled) continue;
        if (!VItem.IsSeparator() && (VItem.GetShortCut() === AShortCut)) {
          Result = VItem;
          return Result;
        };
        Result = $impl.FindShortCutItem(VItem.FItems,AShortCut);
        if (Result != null) return Result;
      };
      return Result;
    };
  };
  $mod.$init = function () {
    pas.Classes.RegisterClass($mod.TMenuItem);
  };
},["Forms"]);
//# sourceMappingURL=menus.js.map
