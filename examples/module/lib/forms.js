rtl.module("Forms",["System","Classes","SysUtils","Types","JS","Web","Graphics","Controls"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.TFormType = {"0": "ftModalForm", ftModalForm: 0, "1": "ftWindow", ftWindow: 1};
  this.$rtti.$Enum("TFormType",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TFormType});
  this.TCloseAction = {"0": "caNone", caNone: 0, "1": "caHide", caHide: 1, "2": "caFree", caFree: 2};
  this.$rtti.$Enum("TCloseAction",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TCloseAction});
  this.$rtti.$MethodVar("TCloseEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["CloseAction",this.$rtti["TCloseAction"],1]]), methodkind: 0});
  this.$rtti.$MethodVar("TCloseQueryEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["CanClose",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$Class("TCustomForm");
  this.$rtti.$Int("TModalResult",{minvalue: -2147483648, maxvalue: 2147483647, ordtype: 4});
  this.$rtti.$RefToProcVar("TModalResultProc",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["ModalResult",this.$rtti["TModalResult"]]])});
  this.$rtti.$ProcVar("TApplicationMessageBoxProc",{procsig: rtl.newTIProcSig([["AOwner",this.$rtti["TCustomForm"]],["AMessage",rtl.string,2],["ACaption",rtl.string,2],["AFlags",rtl.longint],["AModalResultProc",this.$rtti["TModalResultProc"]]])});
  rtl.createClass(this,"TCustomDataModule",pas.Controls.TControl,function () {
    this.$init = function () {
      pas.Controls.TControl.$init.call(this);
      this.FOldOrder = false;
      this.FOnCreate = null;
      this.FOnDestroy = null;
    };
    this.$final = function () {
      this.FOnCreate = undefined;
      this.FOnDestroy = undefined;
      pas.Controls.TControl.$final.call(this);
    };
    this.DoCreate = function () {
      if (this.FOnCreate != null) {
        this.FOnCreate(this);
      };
    };
    this.DoDestroy = function () {
      if (this.FOnDestroy != null) {
        this.FOnDestroy(this);
      };
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        $with.style.setProperty("visibility","hidden");
        $with.style.setProperty("display","none");
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 150;
      Result.cy = 150;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.BeginUpdate();
      try {
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.AfterConstruction = function () {
      pas.System.TObject.AfterConstruction.call(this);
      $mod.Application().RegisterModule(this);
      this.Loaded();
      this.DoCreate();
    };
    this.BeforeDestruction = function () {
      pas.Classes.TComponent.BeforeDestruction.call(this);
      $mod.Application().UnRegisterModule(this);
      this.DoDestroy();
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TCustomFrame",pas.Controls.TCustomControl,function () {
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        $with.style.setProperty("outline","none");
        $with.style.setProperty("overflow","auto");
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 320;
      Result.cy = 240;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      if ((this.$class.ClassType() !== $mod.TWFrame) && rtl.eqSet(rtl.intersectSet(rtl.createSet(pas.Classes.TComponentStateItem.csDesignInstance,pas.Classes.TComponentStateItem.csDesigning),this.FComponentState),{})) {
        if (!pas.WResources.InitResourceComponent(this,$mod.TWFrame)) throw pas.Classes.EResNotFound.$create("CreateFmt",[rtl.getResStr(pas.WCLStrConsts,"rsResourceNotFound"),pas.System.VarRecs(18,this.$classname)]);
      } else {
        this.BeginUpdate();
        try {
          this.SetParentFont(false);
          this.SetParentShowHint(false);
          var $with = this.$class.GetControlClassDefaultSize();
          this.SetBounds(0,0,$with.cx,$with.cy);
        } finally {
          this.EndUpdate();
        };
      };
      return this;
    };
    this.AfterConstruction = function () {
      pas.System.TObject.AfterConstruction.call(this);
      this.Loaded();
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  this.$rtti.$ClassRef("TCustomFrameClass",{instancetype: this.$rtti["TCustomFrame"]});
  rtl.createClass(this,"TCustomForm",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FActiveControl = null;
      this.FAlphaBlend = false;
      this.FAlphaBlendValue = 0;
      this.FChildForm = null;
      this.FDesignTimePPI = 0;
      this.FFormType = 0;
      this.FKeyPreview = false;
      this.FModalResult = 0;
      this.FModalResultProc = null;
      this.FOverlay = null;
      this.FOnActivate = null;
      this.FOnClose = null;
      this.FOnCloseQuery = null;
      this.FOnCreate = null;
      this.FOnDeactivate = null;
      this.FOnDestroy = null;
      this.FOnHide = null;
      this.FOnResize$1 = null;
      this.FOnScroll$1 = null;
      this.FOnShow = null;
      this.fFormBorderStyle = 0;
    };
    this.$final = function () {
      this.FActiveControl = undefined;
      this.FChildForm = undefined;
      this.FModalResultProc = undefined;
      this.FOverlay = undefined;
      this.FOnActivate = undefined;
      this.FOnClose = undefined;
      this.FOnCloseQuery = undefined;
      this.FOnCreate = undefined;
      this.FOnDeactivate = undefined;
      this.FOnDestroy = undefined;
      this.FOnHide = undefined;
      this.FOnResize$1 = undefined;
      this.FOnScroll$1 = undefined;
      this.FOnShow = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.SetActiveControl = function (AValue) {
      if (this.FActiveControl !== AValue) {
        this.FActiveControl = AValue;
      };
    };
    this.SetAlphaBlend = function (AValue) {
      if (this.FAlphaBlend !== AValue) {
        this.FAlphaBlend = AValue;
        this.Changed();
      };
    };
    this.SetAlphaBlendValue = function (AValue) {
      if (this.FAlphaBlendValue !== AValue) {
        this.FAlphaBlendValue = AValue;
        this.Changed();
      };
    };
    this.SetFormBorderStyle = function (AValue) {
      var bs = pas.Controls.TFormBorderStyle.bsNone;
      if (this.fFormBorderStyle === AValue) return;
      this.fFormBorderStyle = AValue;
      if (AValue in rtl.createSet(null,pas.Controls.TFormBorderStyle.bsNone,pas.Controls.TFormBorderStyle.bsSingle)) {
        bs = AValue}
       else bs = pas.Controls.TFormBorderStyle.bsNone;
      pas.Controls.TControl.SetBorderStyle.call(this,bs);
    };
    this.SetModalResult = function (AValue) {
      if (this.FModalResult !== AValue) {
        this.FModalResult = AValue;
        if ((this.FModalResult !== 0) && (this.FModalResultProc != null)) {
          this.Close();
        };
      };
    };
    this.Activate = function () {
      if (this.FOnActivate != null) {
        this.FOnActivate(this);
      };
    };
    this.Deactivate = function () {
      if (this.FOnDeactivate != null) {
        this.FOnDeactivate(this);
      };
    };
    this.DoClose = function (CloseAction) {
      if (this.FOnDeactivate != null) {
        this.FOnDeactivate(this);
      };
    };
    this.DoCreate = function () {
      if (this.FOnCreate != null) {
        this.FOnCreate(this);
      };
    };
    this.DoDestroy = function () {
      if (this.FOnDestroy != null) {
        this.FOnDestroy(this);
      };
    };
    this.DoHide = function () {
      if (this.FOnHide != null) {
        this.FOnHide(this);
      };
    };
    this.DoResize = function () {
      pas.Controls.TControl.DoResize.call(this);
      if (this.FOnResize$1 != null) {
        this.FOnResize$1(this);
      };
    };
    this.DoShow = function () {
      if (this.FOnShow != null) {
        this.FOnShow(this);
      };
    };
    this.HandleEnter = function (AEvent) {
      var Result = false;
      var VControl = null;
      Result = pas.Controls.TWinControl.HandleEnter.call(this,AEvent);
      if ((this.FChildForm != null) && (this.FChildForm.FFormType === $mod.TFormType.ftModalForm)) {
        this.FChildForm.Show();
      } else {
        if (this.FActiveControl != null) {
          VControl = this.FActiveControl;
        } else {
          VControl = this.FindFocusControl(null,pas.Controls.TFocusSearchDirection.fsdFirst);
        };
        this.FocusControl(VControl);
        this.Activate();
      };
      return Result;
    };
    this.HandleExit = function (AEvent) {
      var Result = false;
      Result = pas.Controls.TWinControl.HandleExit.call(this,AEvent);
      this.Deactivate();
      return Result;
    };
    this.HandleWindowResize = function (AEvent) {
      var Result = false;
      this.Resize();
      Result = true;
      return Result;
    };
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FHandleElement.name = this.FName;
        var $with = this.FHandleElement;
        $with.style.setProperty("outline","none");
        if (this.FAlphaBlend) {
          $with.style.setProperty("opacity",pas.SysUtils.FloatToStr(rtl.trunc(this.FAlphaBlendValue / 255)));
        } else {
          $with.style.removeProperty("opacity");
        };
        $with.style.setProperty("overflow","hidden");
        this.FHandleElement.setAttribute("name",this.FName);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.ProcessResource = function () {
      if (!pas.WResources.InitResourceComponent(this,$mod.TWForm)) throw pas.Classes.EResNotFound.$create("CreateFmt",[rtl.getResStr(pas.WCLStrConsts,"rsFormResourceSNotFoundForResourcelessFormsCreateNew"),pas.System.VarRecs(18,this.$classname)]);
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 320;
      Result.cy = 240;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      this.CreateNew(AOwner,1);
      if ((this.$class.ClassType() !== $mod.TWForm) && !(pas.Classes.TComponentStateItem.csDesigning in this.FComponentState)) {
        this.ProcessResource();
      };
      return this;
    };
    this.CreateNew = function (AOwner, Num) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FActiveControl = null;
      this.FAlphaBlend = false;
      this.FAlphaBlendValue = 255;
      this.FDesignTimePPI = 96;
      this.FChildForm = null;
      this.FFormType = $mod.TFormType.ftWindow;
      this.FKeyPreview = false;
      this.FModalResult = 0;
      this.FModalResultProc = null;
      this.FOverlay = null;
      this.SetFormBorderStyle(pas.Controls.TFormBorderStyle.bsSizeable);
      this.BeginUpdate();
      try {
        this.SetColor(16777215);
        this.SetParentFont(false);
        this.SetParentShowHint(false);
        this.SetVisible(false);
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      this.FActiveControl = null;
      this.FChildForm = null;
      pas.Controls.TCustomControl.Destroy.call(this);
    };
    this.AfterConstruction = function () {
      pas.System.TObject.AfterConstruction.call(this);
      $mod.Application().UpdateMainForm(this);
      $mod.Application().RegisterModule(this);
      window.addEventListener("resize",rtl.createCallback(this,"HandleWindowResize"));
      this.Loaded();
      this.DoCreate();
    };
    this.BeforeDestruction = function () {
      window.removeEventListener("resize",rtl.createCallback(this,"HandleWindowResize"));
      pas.Classes.TComponent.BeforeDestruction.call(this);
      $mod.Application().UnRegisterModule(this);
      this.DoDestroy();
    };
    this.Close = function () {
      var VAction = 0;
      var VIndex = 0;
      var VOwnerForm = null;
      var VModule = null;
      if (this.CloseQuery()) {
        VAction = $mod.TCloseAction.caHide;
        this.DoClose({get: function () {
            return VAction;
          }, set: function (v) {
            VAction = v;
          }});
        if (VAction !== $mod.TCloseAction.caNone) {
          if ($mod.Application().FMainForm === this) {
            $mod.Application().Terminate();
          } else {
            this.Hide();
            if (this.FFormType === $mod.TFormType.ftModalForm) {
              if ((this.FOwner != null) && $mod.TCustomForm.isPrototypeOf(this.FOwner)) {
                VOwnerForm = this.FOwner;
                VOwnerForm.FChildForm = null;
                if (VOwnerForm.FOverlay != null) {
                  VOwnerForm.FOverlay.$destroy("Destroy");
                  VOwnerForm.FOverlay = null;
                };
                VOwnerForm.Show();
              };
              if (this.FModalResultProc != null) {
                this.FModalResultProc(this,this.FModalResult);
              };
            } else {
              for (var $l = $mod.Application().GetModuleCount() - 1; $l >= 0; $l--) {
                VIndex = $l;
                VModule = $mod.Application().GetModule(VIndex);
                if ((VModule != null) && VModule.FVisible && (VModule !== this) && VModule.$class.InheritsFrom($mod.TCustomForm)) {
                  VModule.Show();
                  return;
                };
              };
              if ($mod.Application().FMainForm != null) {
                $mod.Application().FMainForm.Show();
              };
            };
          };
        };
      };
    };
    this.CloseQuery = function () {
      var Result = false;
      Result = true;
      if (this.FOnCloseQuery != null) {
        this.FOnCloseQuery(this,{get: function () {
            return Result;
          }, set: function (v) {
            Result = v;
          }});
      };
      return Result;
    };
    this.FocusControl = function (AControl) {
      if ((AControl != null) && AControl.CanSetFocus()) {
        AControl.SetFocus();
      };
    };
    this.Hide = function () {
      this.SetVisible(false);
      this.DoHide();
    };
    this.Loaded = function () {
      pas.Controls.TControl.Loaded.call(this);
    };
    this.Resize = function () {
      var VHeight = 0;
      var VLeft = 0;
      var VTop = 0;
      var VWidth = 0;
      var VWindowHeight = 0;
      var VWindowWidth = 0;
      var VSafeLeft = 0;
      var VSafeTop = 0;
      var VSafeRight = 0;
      var VSafeBottom = 0;
      $mod.Screen.UpdateSafeArea();
      VWindowWidth = window.innerWidth;
      VWindowHeight = window.innerHeight;
      VSafeLeft = $mod.Screen.FSafeAreaLeft;
      VSafeTop = $mod.Screen.FSafeAreaTop;
      VSafeRight = $mod.Screen.FSafeAreaRight;
      VSafeBottom = $mod.Screen.FSafeAreaBottom;
      var $tmp = this.FFormType;
      if ($tmp === $mod.TFormType.ftModalForm) {
        VWidth = this.FWidth;
        VHeight = this.FHeight;
        VLeft = VSafeLeft + rtl.trunc((VWindowWidth - VSafeLeft - VSafeRight - VWidth) / 2);
        VTop = VSafeTop + rtl.trunc((VWindowHeight - VSafeTop - VSafeBottom - VHeight) / 2);
        this.SetBounds(VLeft,VTop,VWidth,VHeight);
      } else if ($tmp === $mod.TFormType.ftWindow) {
        VLeft = VSafeLeft;
        VTop = VSafeTop;
        VWidth = VWindowWidth - VSafeLeft - VSafeRight;
        VHeight = VWindowHeight - VSafeTop - VSafeBottom;
        if (VWidth < 0) VWidth = 0;
        if (VHeight < 0) VHeight = 0;
        this.SetBounds(VLeft,VTop,VWidth,VHeight);
      };
      this.DoResize();
    };
    this.Show = function () {
      $mod.Application().FActiveForm = this;
      $mod.Application().SetTitle(this.GetText());
      this.BeginUpdate();
      try {
        this.SetVisible(true);
        this.Resize();
      } finally {
        this.EndUpdate();
      };
      this.BringToFront();
      this.SetFocus();
      this.DoShow();
    };
    this.ShowModal = function (AModalResultProc) {
      var VForm = null;
      if (!(this.FOwner != null)) {
        throw new Error("Owner not found.");
      };
      if (!$mod.TCustomForm.isPrototypeOf(this.FOwner)) {
        throw new Error("Invalid owner.");
      };
      VForm = this.FOwner;
      if (VForm.FChildForm != null) {
        throw new Error("Modal form already exists.");
      };
      VForm.FChildForm = this;
      VForm.FOverlay = $impl.TOverlay.$create("Create$1",[VForm]);
      this.FFormType = $mod.TFormType.ftModalForm;
      this.FModalResult = 0;
      if (AModalResultProc != null) {
        this.FModalResultProc = AModalResultProc;
      } else {
        this.FModalResultProc = $impl.DefaultModalProc;
      };
      this.Show();
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addMethod("CreateNew",2,[["AOwner",pas.Classes.$rtti["TComponent"]],["Num",rtl.longint]]);
  });
  this.$rtti.$ClassRef("TCustomFormClass",{instancetype: this.$rtti["TCustomForm"]});
  this.TViewportMode = {"0": "vmResponsive", vmResponsive: 0, "1": "vmFitDesign", vmFitDesign: 1};
  this.$rtti.$Enum("TViewportMode",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TViewportMode});
  rtl.createClass(this,"TApplication",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FModules = null;
      this.FActiveForm = null;
      this.FBackgroundColor = 0;
      this.FDesignWidth = 0;
      this.FMainForm = null;
      this.FMessageBoxHandler = null;
      this.FStopOnException = false;
      this.FTerminated = false;
      this.FTitle = "";
      this.FViewportFit = false;
      this.FViewportMode = 0;
      this.FOnResize = null;
      this.FOnUnload = null;
    };
    this.$final = function () {
      this.FModules = undefined;
      this.FActiveForm = undefined;
      this.FMainForm = undefined;
      this.FMessageBoxHandler = undefined;
      this.FOnResize = undefined;
      this.FOnUnload = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.GetApplicatioName = function () {
      var Result = "";
      Result = window.location.pathname;
      return Result;
    };
    this.GetModule = function (AIndex) {
      var Result = null;
      Result = rtl.getObject(this.FModules[AIndex]);
      return Result;
    };
    this.GetModuleCount = function () {
      var Result = 0;
      Result = this.FModules.length;
      return Result;
    };
    this.GetModuleIndex = function (AModule) {
      var Result = 0;
      Result = this.FModules.indexOf(AModule);
      return Result;
    };
    this.GetTitle = function () {
      var Result = "";
      Result = this.FTitle;
      return Result;
    };
    this.SetBackgroundColor = function (AValue) {
      if (this.FBackgroundColor !== AValue) {
        this.FBackgroundColor = AValue;
        this.ApplyBackground();
      };
    };
    this.SetTitle = function (AValue) {
      if (this.FTitle !== AValue) {
        this.FTitle = AValue;
        document.title = this.FTitle;
      };
    };
    this.DoResize = function () {
      if (this.FOnResize != null) {
        this.FOnResize(this);
      };
    };
    this.DoUnload = function () {
      if (this.FOnUnload != null) {
        this.FOnUnload(this);
      };
    };
    this.LoadIcon = function () {
      var $with = document.head.appendChild(document.createElement("link"));
      $with.setAttribute("rel","icon");
      $with.setAttribute("type","image/icon");
      $with.setAttribute("href",this.GetApplicatioName().replace("html","ico"));
    };
    this.ApplyBackground = function () {
      var VColor = 0;
      if (!(document.body != null)) return;
      VColor = this.FBackgroundColor;
      if ((VColor === 536870912) && (this.FMainForm != null)) VColor = this.FMainForm.FColor;
      if (VColor === 536870912) {
        document.body.style.removeProperty("background-color")}
       else document.body.style.setProperty("background-color",pas.Graphics.JSColor(VColor));
    };
    this.RegisterHandleEvents = function () {
      window.addEventListener("error",rtl.createCallback(this,"HandleError"));
      window.addEventListener("resize",rtl.createCallback(this,"HandleResize"));
      window.addEventListener("pagehide",rtl.createCallback(this,"HandleUnload"));
    };
    this.UnRegisterHandleEvents = function () {
      window.removeEventListener("error",rtl.createCallback(this,"HandleError"));
      window.removeEventListener("resize",rtl.createCallback(this,"HandleResize"));
      window.removeEventListener("pagehide",rtl.createCallback(this,"HandleUnload"));
    };
    var CLE = pas.System.LineEnding;
    var CError = "Error Message: %s " + CLE + "Line Nro: %d " + CLE + "Column Nro: %d " + CLE;
    this.HandleError = function (AEvent) {
      var Result = false;
      if (AEvent.message.toLowerCase().indexOf("script error",0) > -1) {
        window.alert("Script Error: See Browser Console for Detail");
      } else {
        window.alert(pas.SysUtils.Format(CError,pas.System.VarRecs(18,AEvent.message,0,AEvent.lineno,0,AEvent.colno)));
      };
      if (this.FStopOnException) {
        this.Terminate();
      };
      AEvent.stopPropagation();
      Result = false;
      return Result;
    };
    this.HandleResize = function (AEvent) {
      var Result = false;
      var VControl = null;
      var VIndex = 0;
      AEvent.stopPropagation();
      this.DoResize();
      Result = true;
      for (var $l = 0, $end = this.FModules.length - 1; $l <= $end; $l++) {
        VIndex = $l;
        VControl = rtl.getObject(this.FModules[VIndex]);
        if ((VControl != null) && VControl.FVisible && VControl.$class.InheritsFrom($mod.TCustomForm)) {
          VControl.Resize();
        };
      };
      return Result;
    };
    this.HandleUnload = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      Result = true;
      try {
        this.DoUnload();
      } finally {
        this.Terminate();
      };
      return Result;
    };
    this.HandleException = function (AException) {
      if (pas.SysUtils.Exception.isPrototypeOf(AException)) {
        window.alert(pas.SysUtils.Format(rtl.getResStr(pas.WCLStrConsts,"rsErrUncaughtException"),pas.System.VarRecs(18,AException.$classname,18,AException.fMessage)));
      } else {
        window.alert(pas.SysUtils.Format(rtl.getResStr(pas.WCLStrConsts,"rsErrUncaughtObject"),pas.System.VarRecs(18,AException.$classname)));
      };
      if (this.FStopOnException) this.Terminate();
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      pas.p2jsres.SetResourceSource(pas.p2jsres.TResourceSource.rsJS);
      pas.SysUtils.SetOnUnCaughtExceptionHandler($impl.DoUncaughtPascalException);
      rtl.showUncaughtExceptions=true;
      this.FModules = new Array();
      this.FBackgroundColor = 536870912;
      this.FDesignWidth = 0;
      this.FMainForm = null;
      this.FMessageBoxHandler = null;
      this.FStopOnException = true;
      this.FTerminated = false;
      this.FTitle = "";
      this.FViewportFit = false;
      this.FViewportMode = $mod.TViewportMode.vmResponsive;
      return this;
    };
    this.Destroy = function () {
      this.FModules.length = 0;
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.CreateForm = function (AInstanceClass, AReference) {
      try {
        AReference.set(AInstanceClass.$create("Create$1",[this]));
      } catch ($e) {
        AReference.set(null);
        throw $e;
      };
    };
    this.Initialize = function () {
    };
    this.Run = function () {
      this.RegisterHandleEvents();
      this.ApplyViewport();
      this.LoadIcon();
      this.ApplyBackground();
      if (this.FMainForm != null) {
        this.FMainForm.Show();
      };
    };
    this.Terminate = function () {
      var VModule = null;
      var VIndex = 0;
      if (!this.FTerminated) {
        this.UnRegisterHandleEvents();
        this.FTerminated = true;
        for (var $l = this.FModules.length - 1; $l >= 0; $l--) {
          VIndex = $l;
          VModule = rtl.getObject(this.FModules[VIndex]);
          if (VModule != null) {
            VModule.$destroy("Destroy");
            VModule = null;
          };
        };
      };
    };
    this.MessageBox = function (AMessage, ACaption, AFlags, AModalResultProc) {
      this.MessageBox$1(this.FActiveForm,AMessage,ACaption,AFlags,AModalResultProc);
    };
    this.MessageBox$1 = function (AOwner, AMessage, ACaption, AFlags, AModalResultProc) {
      if (this.FMessageBoxHandler != null) {
        this.FMessageBoxHandler(AOwner,AMessage,ACaption,AFlags,AModalResultProc)}
       else {
        window.alert(AMessage);
        if (AModalResultProc != null) AModalResultProc(AOwner,1);
      };
    };
    this.UpdateMainForm = function (AForm) {
      if (!(this.FMainForm != null)) {
        this.FMainForm = AForm;
        this.FActiveForm = AForm;
      };
    };
    this.ApplyViewport = function () {
      var $Self = this;
      var VMeta = null;
      var VContent = "";
      var VWidth = 0;
      function KeepExtra(AOld, ABase) {
        var Result = "";
        Result = ABase;
        var parts = (AOld || '').split(',').map(function(s) { return s.trim(); })
          .filter(function(s) {
            return s && s.indexOf('width=') !== 0 && s.indexOf('initial-scale=') !== 0 &&
              s.indexOf('viewport-fit=') !== 0;
          });
        if (parts.length) Result = ABase + ', ' + parts.join(', ');
        return Result;
      };
      VWidth = this.FDesignWidth;
      if ((VWidth <= 0) && (this.FMainForm != null)) VWidth = this.FMainForm.FWidth;
      if ((this.FViewportMode === $mod.TViewportMode.vmFitDesign) && (VWidth > 0)) {
        VContent = "width=" + pas.SysUtils.IntToStr(VWidth) + ", initial-scale=1"}
       else VContent = "width=device-width, initial-scale=1";
      if (this.FViewportFit) VContent = VContent + ", viewport-fit=cover";
      VMeta = document.querySelector('meta[name="viewport"]');
      if (!(VMeta != null)) {
        VMeta = document.createElement("meta");
        VMeta.setAttribute("name","viewport");
        document.head.appendChild(VMeta);
      } else VContent = KeepExtra(VMeta.getAttribute("content"),VContent);
      VMeta.setAttribute("content",VContent);
      $mod.Screen.UpdateSafeArea();
    };
    this.RegisterModule = function (AModule) {
      if (AModule != null) {
        if (this.FModules.indexOf(AModule) === -1) {
          this.FModules.push(AModule);
          if (!document.body.contains(AModule.FHandleElement)) {
            document.body.appendChild(AModule.FHandleElement);
          };
        };
      };
    };
    this.UnRegisterModule = function (AModule) {
      var VIndex = 0;
      if (AModule != null) {
        VIndex = this.FModules.indexOf(AModule);
        if (VIndex >= 0) {
          this.FModules.splice(VIndex,1);
          if (document.body.contains(AModule.FHandleElement)) {
            document.body.removeChild(AModule.FHandleElement);
          };
        };
      };
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TWForm",this.TCustomForm,function () {
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("ActiveControl",2,pas.Controls.$rtti["TWinControl"],"FActiveControl","SetActiveControl");
    $r.addProperty("Align",2,pas.Controls.$rtti["TAlign"],"FAlign","SetAlign");
    $r.addProperty("AlphaBlend",2,rtl.boolean,"FAlphaBlend","SetAlphaBlend");
    $r.addProperty("AlphaBlendValue",2,rtl.byte,"FAlphaBlendValue","SetAlphaBlendValue");
    $r.addProperty("Caption",3,pas.Controls.$rtti["TCaption"],"GetText","SetText");
    $r.addProperty("ClientHeight",3,rtl.nativeint,"GetClientHeight","SetClientHeight");
    $r.addProperty("ClientWidth",3,rtl.nativeint,"GetClientWidth","SetClientWidth");
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("DesignTimePPI",0,rtl.longint,"FDesignTimePPI","FDesignTimePPI");
    $r.addProperty("Enabled",2,rtl.boolean,"FEnabled","SetEnabled");
    $r.addProperty("Font",2,pas.Graphics.$rtti["TFont"],"FFont","SetFont");
    $r.addProperty("HandleClass",2,rtl.string,"FHandleClass","SetHandleClass");
    $r.addProperty("HandleId",2,rtl.string,"FHandleId","SetHandleId");
    $r.addProperty("KeyPreview",0,rtl.boolean,"FKeyPreview","FKeyPreview");
    $r.addProperty("ShowHint",2,rtl.boolean,"FShowHint","SetShowHint");
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible");
    $r.addProperty("OnActivate",0,pas.Classes.$rtti["TNotifyEvent"],"FOnActivate","FOnActivate");
    $r.addProperty("OnClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnClick","FOnClick");
    $r.addProperty("OnClose",0,$mod.$rtti["TCloseEvent"],"FOnClose","FOnClose");
    $r.addProperty("OnCloseQuery",0,$mod.$rtti["TCloseQueryEvent"],"FOnCloseQuery","FOnCloseQuery");
    $r.addProperty("OnCreate",0,pas.Classes.$rtti["TNotifyEvent"],"FOnCreate","FOnCreate");
    $r.addProperty("OnDblClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnDblClick","FOnDblClick");
    $r.addProperty("OnDeactivate",0,pas.Classes.$rtti["TNotifyEvent"],"FOnDeactivate","FOnDeactivate");
    $r.addProperty("OnDestroy",0,pas.Classes.$rtti["TNotifyEvent"],"FOnDestroy","FOnDestroy");
    $r.addProperty("OnHide",0,pas.Classes.$rtti["TNotifyEvent"],"FOnHide","FOnHide");
    $r.addProperty("OnKeyDown",0,pas.Controls.$rtti["TKeyEvent"],"FOnKeyDown","FOnKeyDown");
    $r.addProperty("OnKeyPress",0,pas.Controls.$rtti["TKeyPressEvent"],"FOnKeyPress","FOnKeyPress");
    $r.addProperty("OnKeyUp",0,pas.Controls.$rtti["TKeyEvent"],"FOnKeyUp","FOnKeyUp");
    $r.addProperty("OnMouseDown",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseDown","FOnMouseDown");
    $r.addProperty("OnMouseEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseEnter","FOnMouseEnter");
    $r.addProperty("OnMouseLeave",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseLeave","FOnMouseLeave");
    $r.addProperty("OnMouseMove",0,pas.Controls.$rtti["TMouseMoveEvent"],"FOnMouseMove","FOnMouseMove");
    $r.addProperty("OnMouseUp",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseUp","FOnMouseUp");
    $r.addProperty("OnMouseWheel",0,pas.Controls.$rtti["TMouseWheelEvent"],"FOnMouseWheel","FOnMouseWheel");
    $r.addProperty("OnResize",0,pas.Classes.$rtti["TNotifyEvent"],"FOnResize$1","FOnResize$1");
    $r.addProperty("OnScroll",0,pas.Classes.$rtti["TNotifyEvent"],"FOnScroll$1","FOnScroll$1");
    $r.addProperty("OnShow",0,pas.Classes.$rtti["TNotifyEvent"],"FOnShow","FOnShow");
  });
  this.$rtti.$ClassRef("TWFormClass",{instancetype: this.$rtti["TWForm"]});
  rtl.createClass(this,"TWFrame",this.TCustomFrame,function () {
    this.$init = function () {
      $mod.TCustomFrame.$init.call(this);
      this.FDesignLeft = 0;
      this.FDesignTop = 0;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("Align",2,pas.Controls.$rtti["TAlign"],"FAlign","SetAlign");
    $r.addProperty("Anchors",14,pas.Controls.$rtti["TAnchors"],"FAnchors","SetAnchors",{stored: "IsAnchorsStored", Default: rtl.createSet(pas.Controls.TAnchorKind.akLeft,pas.Controls.TAnchorKind.akTop)});
    $r.addProperty("AutoSize",2,rtl.boolean,"FAutoSize","SetAutoSize",{Default: false});
    $r.addProperty("BorderSpacing",2,pas.Controls.$rtti["TControlBorderSpacing"],"FBorderSpacing","SetBorderSpacing");
    $r.addProperty("ClientHeight",3,rtl.nativeint,"GetClientHeight","SetClientHeight");
    $r.addProperty("ClientWidth",3,rtl.nativeint,"GetClientWidth","SetClientWidth");
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("Enabled",2,rtl.boolean,"FEnabled","SetEnabled");
    $r.addProperty("Font",2,pas.Graphics.$rtti["TFont"],"FFont","SetFont");
    $r.addProperty("ParentColor",2,rtl.boolean,"FParentColor","SetParentColor");
    $r.addProperty("ParentFont",2,rtl.boolean,"FParentFont","SetParentFont");
    $r.addProperty("ParentShowHint",2,rtl.boolean,"FParentShowHint","SetParentShowHint");
    $r.addProperty("ShowHint",2,rtl.boolean,"FShowHint","SetShowHint");
    $r.addProperty("TabOrder",2,rtl.nativeint,"FTabOrder","SetTabOrder");
    $r.addProperty("TabStop",2,rtl.boolean,"FTabStop","SetTabStop");
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible");
    $r.addProperty("OnClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnClick","FOnClick");
    $r.addProperty("OnDblClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnDblClick","FOnDblClick");
    $r.addProperty("OnEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnEnter","FOnEnter");
    $r.addProperty("OnExit",0,pas.Classes.$rtti["TNotifyEvent"],"FOnExit","FOnExit");
    $r.addProperty("OnMouseDown",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseDown","FOnMouseDown");
    $r.addProperty("OnMouseEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseEnter","FOnMouseEnter");
    $r.addProperty("OnMouseLeave",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseLeave","FOnMouseLeave");
    $r.addProperty("OnMouseMove",0,pas.Controls.$rtti["TMouseMoveEvent"],"FOnMouseMove","FOnMouseMove");
    $r.addProperty("OnMouseUp",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseUp","FOnMouseUp");
    $r.addProperty("OnMouseWheel",0,pas.Controls.$rtti["TMouseWheelEvent"],"FOnMouseWheel","FOnMouseWheel");
    $r.addProperty("OnResize",0,pas.Classes.$rtti["TNotifyEvent"],"FOnResize","FOnResize");
    $r.addProperty("DesignLeft",0,rtl.longint,"FDesignLeft","FDesignLeft");
    $r.addProperty("DesignTop",0,rtl.longint,"FDesignTop","FDesignTop");
  });
  this.$rtti.$ClassRef("TWFrameClass",{instancetype: this.$rtti["TWFrame"]});
  rtl.createClass(this,"TScreen",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FSafeAreaBottom = 0;
      this.FSafeAreaLeft = 0;
      this.FSafeAreaRight = 0;
      this.FSafeAreaTop = 0;
    };
    this.GetClientHeight = function () {
      var Result = 0;
      Result = window.innerHeight;
      return Result;
    };
    this.GetClientWidth = function () {
      var Result = 0;
      Result = window.innerWidth;
      return Result;
    };
    this.GetHeight = function () {
      var Result = 0;
      Result = window.screen.height;
      return Result;
    };
    this.GetIsMobile = function () {
      var Result = false;
      Result = (window.screen !== undefined) &&
      (Math.min(window.screen.width, window.screen.height) <= 600);
      return Result;
    };
    this.GetIsTouch = function () {
      var Result = false;
      Result = (window.matchMedia !== undefined) &&
      window.matchMedia('(pointer: coarse)').matches;
      return Result;
    };
    this.GetPixelsPerInch = function () {
      var Result = 0;
      Result = Math.round(window.devicePixelRatio * 96);
      return Result;
    };
    this.GetWidth = function () {
      var Result = 0;
      Result = window.screen.width;
      return Result;
    };
    this.GetWorkAreaHeight = function () {
      var Result = 0;
      Result = window.screen.availHeight;
      return Result;
    };
    this.GetWorkAreaWidth = function () {
      var Result = 0;
      Result = window.screen.availWidth;
      return Result;
    };
    this.UpdateSafeArea = function () {
      var probe = document.createElement('div');
      probe.style.position = 'fixed';
      probe.style.top = '0';
      probe.style.left = '0';
      probe.style.width = '0';
      probe.style.height = '0';
      probe.style.visibility = 'hidden';
      probe.style.pointerEvents = 'none';
      probe.style.paddingTop = 'env(safe-area-inset-top, 0px)';
      probe.style.paddingRight = 'env(safe-area-inset-right, 0px)';
      probe.style.paddingBottom = 'env(safe-area-inset-bottom, 0px)';
      probe.style.paddingLeft = 'env(safe-area-inset-left, 0px)';
      document.body.appendChild(probe);
      var cs = window.getComputedStyle(probe);
      this.FSafeAreaTop = Math.round(parseFloat(cs.paddingTop) || 0);
      this.FSafeAreaRight = Math.round(parseFloat(cs.paddingRight) || 0);
      this.FSafeAreaBottom = Math.round(parseFloat(cs.paddingBottom) || 0);
      this.FSafeAreaLeft = Math.round(parseFloat(cs.paddingLeft) || 0);
      document.body.removeChild(probe);
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  this.Screen = null;
  this.Application = function () {
    var Result = null;
    if (!($impl.VAppInstance != null)) {
      $impl.VAppInstance = $mod.TApplication.$create("Create$1",[null]);
    };
    Result = $impl.VAppInstance;
    return Result;
  };
  $mod.$implcode = function () {
    $impl.DefaultModalProc = function (Sender, ModalResult) {
      if (Sender != null) {
        Sender.$destroy("Destroy");
        Sender = null;
      };
    };
    $impl.VAppInstance = null;
    rtl.createClass($impl,"TOverlay",pas.System.TObject,function () {
      this.$init = function () {
        pas.System.TObject.$init.call(this);
        this.FForm = null;
        this.FHandleElement = null;
      };
      this.$final = function () {
        this.FForm = undefined;
        this.FHandleElement = undefined;
        pas.System.TObject.$final.call(this);
      };
      this.Create$1 = function (AForm) {
        this.FForm = AForm;
        if (this.FForm != null) {
          this.FHandleElement = document.createElement("div");
          var $with = this.FHandleElement;
          $with.style.setProperty("left","0px");
          $with.style.setProperty("top","0px");
          $with.style.setProperty("height","100%");
          $with.style.setProperty("width","100%");
          $with.style.setProperty("background","rgba(0, 0, 0, 0.6)");
          $with.style.setProperty("position","absolute");
          $with.style.setProperty("overflow","hidden");
          this.FForm.FHandleElement.appendChild(this.FHandleElement);
        };
        return this;
      };
      this.Destroy = function () {
        if (this.FForm != null) {
          this.FForm.FHandleElement.removeChild(this.FHandleElement);
        };
        pas.System.TObject.Destroy.call(this);
      };
    });
    $impl.DoUncaughtPascalException = function (E) {
      $mod.Application().HandleException(E);
    };
  };
  $mod.$init = function () {
    $mod.Screen = $mod.TScreen.$create("Create$1",[null]);
  };
},["WResources","WCLStrConsts","p2jsres"]);
//# sourceMappingURL=forms.js.map
