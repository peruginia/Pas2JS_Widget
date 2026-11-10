rtl.module("ExtCtrls",["System","JS","Classes","SysUtils","Types","Web","WebExtra","Graphics","Controls"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  rtl.createClass(this,"TCustomImage",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FCenter = false;
      this.FPicture = null;
      this.FProportional = false;
      this.FStretch = false;
      this.FOnPictureChanged = null;
      this.fOntouchStart = null;
      this.fOntouchMove = null;
      this.fOntouchCancel = null;
      this.fOntouchEnd = null;
      this.FStretchInEnabled = false;
      this.FStretchOutEnabled = false;
      this.FTransparent = false;
      this.FURL = "";
      this.FLastTouchTime = 0.0;
      this.FZoomLevel = 0;
      this.FZoomEnabled = false;
      this.FZoomX = 0.0;
      this.FZoomY = 0.0;
      this.FInitialZoom = 0;
      this.FIsDragging = false;
      this.FStartX = 0.0;
      this.FStartY = 0.0;
      this.FInitialDist = 0.0;
    };
    this.$final = function () {
      this.FPicture = undefined;
      this.FOnPictureChanged = undefined;
      this.fOntouchStart = undefined;
      this.fOntouchMove = undefined;
      this.fOntouchCancel = undefined;
      this.fOntouchEnd = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.SetCenter = function (AValue) {
      if (this.FCenter !== AValue) {
        this.FCenter = AValue;
        this.PictureChanged(this);
      };
    };
    this.SetPicture = function (AValue) {
      if (!this.FPicture.IsEqual(AValue)) {
        this.FPicture.Assign(AValue);
      };
    };
    this.SetProportional = function (AValue) {
      if (this.FProportional !== AValue) {
        this.FProportional = AValue;
        this.PictureChanged(this);
      };
    };
    this.SetStretch = function (AValue) {
      if (this.FStretch !== AValue) {
        this.FStretch = AValue;
        this.PictureChanged(this);
      };
    };
    this.SetStretchInEnabled = function (AValue) {
      if (this.FStretchInEnabled !== AValue) {
        this.FStretchInEnabled = AValue;
        this.PictureChanged(this);
      };
    };
    this.SetStretchOutEnabled = function (AValue) {
      if (this.FStretchOutEnabled !== AValue) {
        this.FStretchOutEnabled = AValue;
        this.PictureChanged(this);
      };
    };
    this.SetTransparent = function (AValue) {
      if (this.FTransparent !== AValue) {
        this.FTransparent = AValue;
      };
    };
    this.SetURL = function (AValue) {
      if (this.FURL === AValue) return;
      this.FURL = AValue;
      this.PictureChanged(this);
    };
    this.SetZoomLevel = function (AValue) {
      if (this.FZoomLevel !== AValue) {
        this.FZoomLevel = AValue;
        this.Changed();
      };
    };
    this.SetZoomX = function (AValue) {
      if (this.FZoomX !== AValue) {
        this.FZoomX = AValue;
        this.Changed();
      };
    };
    this.SetZoomY = function (AValue) {
      if (this.FZoomY !== AValue) {
        this.FZoomY = AValue;
        this.Changed();
      };
    };
    this.SetZoomEnabled = function (AValue) {
      if (this.FZoomEnabled !== AValue) {
        this.FZoomEnabled = AValue;
        this.Changed();
      };
    };
    this.SetOntouchStart = function (AValue) {
      if (!rtl.eqCallback(AValue,this.fOntouchStart)) {
        this.fOntouchStart = AValue;
        this.FHandleElement.ontouchstart = AValue;
      };
    };
    this.SetOntouchMove = function (AValue) {
      if (!rtl.eqCallback(AValue,this.fOntouchMove)) {
        this.fOntouchMove = AValue;
      };
    };
    this.SetOntouchCancel = function (AValue) {
      if (!rtl.eqCallback(AValue,this.fOntouchCancel)) {
        this.fOntouchCancel = AValue;
      };
    };
    this.SetOntouchEnd = function (AValue) {
      if (!rtl.eqCallback(AValue,this.fOntouchEnd)) {
        this.fOntouchEnd = AValue;
      };
    };
    this.HandleMouseDown$1 = function (AEvent) {
      var Result = false;
      Result = true;
      if (!this.FEnabled || !this.FVisible) return false;
      if (this.FZoomEnabled && (this.FZoomLevel > 100)) {
        this.FIsDragging = true;
        this.FStartX = AEvent.clientX;
        this.FStartY = AEvent.clientY;
        this.FHandleElement.style.setProperty("transition","none");
        AEvent.preventDefault();
      };
      return Result;
    };
    this.HandleMouseMove$1 = function (AEvent) {
      var Result = false;
      var dx = 0.0;
      var dy = 0.0;
      var factor = 0.0;
      Result = true;
      if (this.FIsDragging && (this.FZoomLevel > 100)) {
        factor = 10000 / (this.FZoomLevel - 100);
        dx = ((AEvent.clientX - this.FStartX) / this.FHandleElement.clientWidth) * factor;
        dy = ((AEvent.clientY - this.FStartY) / this.FHandleElement.clientHeight) * factor;
        this.FZoomX = this.FZoomX - dx;
        this.FZoomY = this.FZoomY - dy;
        if (this.FZoomX < 0) this.FZoomX = 0;
        if (this.FZoomX > 100) this.FZoomX = 100;
        if (this.FZoomY < 0) this.FZoomY = 0;
        if (this.FZoomY > 100) this.FZoomY = 100;
        this.FHandleElement.style.backgroundPosition = this.FZoomX + '% ' + this.FZoomY + '%';
        this.FStartX = AEvent.clientX;
        this.FStartY = AEvent.clientY;
        AEvent.preventDefault();
      };
      return Result;
    };
    this.HandleMouseUp$1 = function (AEvent) {
      var Result = false;
      this.FIsDragging = false;
      this.FHandleElement.style.setProperty("transition","background-size 0.2s ease-out");
      Result = true;
      return Result;
    };
    this.HandleTouchStart = function (AEvent) {
      var Result = false;
      Result = true;
      if (!this.FEnabled || !this.FVisible) return false;
      if (this.FZoomEnabled) {
        if (AEvent.touches.length === 2) {
          this.FIsDragging = false;
          let t0 = AEvent.touches[0];
                     let t1 = AEvent.touches[1];
                     let dx = t0.clientX - t1.clientX;
                     let dy = t0.clientY - t1.clientY;
                     this.FInitialDist = Math.hypot(dx, dy);
          
                     // Memorizziamo il centro iniziale del pinch in coordinate percentuali
                     let midX = (t0.clientX + t1.clientX) / 2;
                     let midY = (t0.clientY + t1.clientY) / 2;
                     let rect = this.FHandleElement.getBoundingClientRect();
                     this.FZoomX = Math.max(0, Math.min(100, ((midX - rect.left) / rect.width) * 100));
                     this.FZoomY = Math.max(0, Math.min(100, ((midY - rect.top) / rect.height) * 100));
          this.FInitialZoom = this.FZoomLevel;
          AEvent.stopPropagation();
        } else if (AEvent.touches.length === 1) {
          if (this.FZoomLevel > 100) {
            this.FIsDragging = true;
            this.FStartX = AEvent.touches.item(0).clientX;
            this.FStartY = AEvent.touches.item(0).clientY;
            this.FHandleElement.style.setProperty("transition","none");
            AEvent.stopPropagation();
          };
        };
      };
      if (this.fOntouchStart != null) this.fOntouchStart(AEvent);
      return Result;
    };
    this.HandleTouchEnd = function (AEvent) {
      var Result = false;
      this.FIsDragging = false;
      this.FHandleElement.style.setProperty("transition","background-size 0.2s ease-out");
      if (!this.FEnabled || !this.FVisible) return false;
      if ((AEvent.touches.length === 0) && (this.FInitialDist > 0)) {
        this.FInitialDist = 0;
        this.FLastTouchTime = 0;
        if (this.fOntouchEnd != null) this.fOntouchEnd(AEvent);
        return true;
      };
      if ((this.FOnDblClick != null) && ((pas.SysUtils.Now() - this.FLastTouchTime) < 0.000005)) {
        this.FLastTouchTime = 0;
        this.FOnDblClick(this);
      } else {
        this.FLastTouchTime = pas.SysUtils.Now();
      };
      if (this.fOntouchEnd != null) this.fOntouchEnd(AEvent);
      Result = true;
      return Result;
    };
    this.HandleTouchMove = function (AEvent) {
      var Result = false;
      var dist = 0.0;
      var factor = 0.0;
      var dx = 0.0;
      var dy = 0.0;
      var newZoom = 0;
      Result = true;
      if (!this.FEnabled || !this.FVisible) return false;
      if (this.FZoomEnabled) {
        if (AEvent.touches.length === 2) {
          let t0 = AEvent.touches[0];
          let t1 = AEvent.touches[1];
          let dx = t0.clientX - t1.clientX;
          let dy = t0.clientY - t1.clientY;
          dist = Math.hypot(dx, dy);
          if (this.FInitialDist > 0) {
            factor = dist / this.FInitialDist;
            newZoom = Math.round(this.FInitialZoom * factor);
            if (newZoom < 100) newZoom = 100;
            if (newZoom > 500) newZoom = 500;
            this.SetZoomLevel(newZoom);
          };
          AEvent.preventDefault();
          AEvent.stopPropagation();
        } else if ((AEvent.touches.length === 1) && this.FIsDragging) {
          factor = 10000 / (this.FZoomLevel - 100);
          dx = ((AEvent.touches.item(0).clientX - this.FStartX) / this.FHandleElement.clientWidth) * factor;
          dy = ((AEvent.touches.item(0).clientY - this.FStartY) / this.FHandleElement.clientHeight) * factor;
          this.FZoomX = this.FZoomX - dx;
          this.FZoomY = this.FZoomY - dy;
          if (this.FZoomX < 0) this.FZoomX = 0;
          if (this.FZoomX > 100) this.FZoomX = 100;
          if (this.FZoomY < 0) this.FZoomY = 0;
          if (this.FZoomY > 100) this.FZoomY = 100;
          this.FHandleElement.style.backgroundPosition = this.FZoomX + '% ' + this.FZoomY + '%';
          this.FStartX = AEvent.touches.item(0).clientX;
          this.FStartY = AEvent.touches.item(0).clientY;
          AEvent.preventDefault();
          AEvent.stopPropagation();
        };
      };
      if (this.fOntouchMove != null) this.fOntouchMove(AEvent);
      return Result;
    };
    this.HandleTouchCancel = function (AEvent) {
      var Result = false;
      this.FIsDragging = false;
      if ((this.FEnabled === (false || this.FVisible)) === false) return false;
      if (this.fOntouchCancel != null) this.fOntouchCancel(AEvent);
      Result = true;
      return Result;
    };
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        $with.style.setProperty("outline","none");
        $with.style.setProperty("background-image",pas.SysUtils.Format("url('%s')",pas.System.VarRecs(18,this.FURL)));
        $with.style.setProperty("background-repeat","no-repeat");
        if (this.FZoomLevel > 100) {
          $with.style.setProperty("background-size",pas.SysUtils.Format("%d%%",pas.System.VarRecs(0,this.FZoomLevel)));
          this.FHandleElement.style.backgroundPosition = this.FZoomX + '% ' + this.FZoomY + '%';
        } else {
          if (this.FCenter) {
            $with.style.setProperty("background-position","center  center");
          } else {
            $with.style.removeProperty("background-position");
          };
          if (this.FProportional) {
            $with.style.setProperty("background-size","contain");
            $with.style.setProperty("background-position","center center");
          } else if (this.FStretch) {
            if (this.FStretchInEnabled && this.FStretchOutEnabled) {
              $with.style.setProperty("background-size","100% 100%");
            } else if (this.FStretchInEnabled) {
              $with.style.setProperty("background-size","auto 100%");
            } else if (this.FStretchOutEnabled) {
              $with.style.setProperty("background-size","100% auto");
            };
          } else {
            $with.style.setProperty("background-size","contain");
            $with.style.setProperty("background-position","center center");
          };
        };
        this.FHandleElement.setAttribute("draggable","false");
        this.FHandleElement.style.setProperty("-moz-user-select","none");
      };
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
    this.PictureChanged = function (Sender) {
      this.Changed();
      if (this.FOnPictureChanged != null) {
        this.FOnPictureChanged(this);
      };
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 90;
      Result.cy = 90;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      var cbStart = null;
      var cbMove = null;
      var cbEnd = null;
      var cbCancel = null;
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FPicture = pas.Graphics.TPicture.$create("Create$1");
      this.FPicture.FOnChange = rtl.createCallback(this,"PictureChanged");
      this.FCenter = false;
      this.FProportional = false;
      this.FStretch = false;
      this.FStretchOutEnabled = true;
      this.FStretchInEnabled = true;
      this.FTransparent = false;
      this.FZoomLevel = 100;
      this.FZoomX = 50;
      this.FZoomY = 50;
      this.FIsDragging = false;
      this.FZoomEnabled = true;
      this.FInitialDist = 0;
      this.FHandleElement.addEventListener("mousedown",rtl.createCallback(this,"HandleMouseDown$1"));
      this.FHandleElement.addEventListener("mousemove",rtl.createCallback(this,"HandleMouseMove$1"));
      this.FHandleElement.addEventListener("mouseup",rtl.createCallback(this,"HandleMouseUp$1"));
      cbStart = rtl.createSafeCallback(this,"HandleTouchStart");
      cbMove = rtl.createSafeCallback(this,"HandleTouchMove");
      cbEnd = rtl.createSafeCallback(this,"HandleTouchEnd");
      cbCancel = rtl.createSafeCallback(this,"HandleTouchCancel");
      var options = { passive: false };
      this.FHandleElement.addEventListener('touchstart', cbStart, options);
      this.FHandleElement.addEventListener('touchmove', cbMove, options);
      this.FHandleElement.addEventListener('touchend', cbEnd, options);
      this.FHandleElement.addEventListener('touchcancel', cbCancel, options);
      this.BeginUpdate();
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
  this.$rtti.$Int("TBevelWidth",{minvalue: 1, maxvalue: 2147483647, ordtype: 5});
  rtl.createClass(this,"TCustomPanel",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FAlignment = 0;
      this.FBevelColor = 0;
      this.FBevelInner = 0;
      this.FBevelOuter = 0;
      this.FBevelWidth = 0;
      this.FLayout = 0;
      this.FWordWrap = false;
      this.FScrollvertical = false;
      this.fScrollHorizontal = false;
      this.fOntouchStart = null;
      this.fOntouchMove = null;
      this.fOntouchCancel = null;
      this.fOntouchEnd = null;
    };
    this.$final = function () {
      this.fOntouchStart = undefined;
      this.fOntouchMove = undefined;
      this.fOntouchCancel = undefined;
      this.fOntouchEnd = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.SetAlignment = function (AValue) {
      if (this.FAlignment !== AValue) {
        this.FAlignment = AValue;
        this.Changed();
      };
    };
    this.SetBevelColor = function (AValue) {
      if (this.FBevelColor !== AValue) {
        this.FBevelColor = AValue;
        this.Changed();
      };
    };
    this.SetBevelInner = function (AValue) {
      if (this.FBevelInner !== AValue) {
        this.FBevelInner = AValue;
        this.Changed();
      };
    };
    this.SetBevelOuter = function (AValue) {
      if (this.FBevelOuter !== AValue) {
        this.FBevelOuter = AValue;
        this.Changed();
      };
    };
    this.SetBevelWidth = function (AValue) {
      if (this.FBevelWidth !== AValue) {
        this.FBevelWidth = AValue;
        this.Changed();
      };
    };
    this.SetLayout = function (AValue) {
      if (this.FLayout !== AValue) {
        this.FLayout = AValue;
        this.Changed();
      };
    };
    this.SetWordWrap = function (AValue) {
      if (this.FWordWrap !== AValue) {
        this.FWordWrap = AValue;
        this.Changed();
      };
    };
    this.SetScrollableHorizontal = function (AValue) {
      if (this.fScrollHorizontal !== AValue) {
        this.fScrollHorizontal = AValue;
        this.Changed();
      };
    };
    this.SetScrollableVertical = function (AValue) {
      if (this.FScrollvertical !== AValue) {
        this.FScrollvertical = AValue;
        this.Changed();
      };
    };
    this.SetOntouchStart = function (AValue) {
      if (!rtl.eqCallback(AValue,this.fOntouchStart)) {
        this.fOntouchStart = AValue;
      };
    };
    this.SetOntouchMove = function (AValue) {
      if (!rtl.eqCallback(AValue,this.fOntouchMove)) {
        this.fOntouchMove = AValue;
        this.FHandleElement.ontouchmove = AValue;
      };
    };
    this.SetOntouchCancel = function (AValue) {
      if (!rtl.eqCallback(AValue,this.fOntouchCancel)) {
        this.fOntouchCancel = AValue;
        this.FHandleElement.ontouchcancel = AValue;
      };
    };
    this.SetOntouchEnd = function (AValue) {
      if (!rtl.eqCallback(AValue,this.fOntouchEnd)) {
        this.fOntouchEnd = AValue;
        this.FHandleElement.ontouchend = AValue;
      };
    };
    this.Changed = function () {
      var VTopColor = 0;
      var VBottomColor = 0;
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        if (this.FHandleClass === "") {
          $impl._RegisterWCLExtRules();
          this.FHandleElement.classList.add('wcl-panel');
        };
        this.FHandleElement.name = this.FName;
        var $with = this.FHandleElement;
        if (this.FBevelOuter === pas.Controls.TBevelCut.bvNone) {
          $with.style.removeProperty("border-width");
          $with.style.removeProperty("border-left-color");
          $with.style.removeProperty("border-left-style");
          $with.style.removeProperty("border-top-color");
          $with.style.removeProperty("border-top-style");
          $with.style.removeProperty("border-right-color");
          $with.style.removeProperty("border-right-style");
          $with.style.removeProperty("border-bottom-color");
          $with.style.removeProperty("border-bottom-style");
        } else {
          if (this.FBevelColor === 536870912) {
            var $tmp = this.FBevelOuter;
            if ($tmp === pas.Controls.TBevelCut.bvLowered) {
              VTopColor = 8421504;
              VBottomColor = 16777215;
            } else if ($tmp === pas.Controls.TBevelCut.bvRaised) {
              VTopColor = 16777215;
              VBottomColor = 8421504;
            } else {
              VTopColor = this.FColor;
              VBottomColor = this.FColor;
            };
          } else {
            VTopColor = this.FBevelColor;
            VBottomColor = this.FBevelColor;
          };
          $with.style.setProperty("border-width",pas.SysUtils.IntToStr(this.FBevelWidth) + "px");
          $with.style.setProperty("border-style","solid");
          $with.style.setProperty("border-left-color",pas.Graphics.JSColor(VTopColor));
          $with.style.setProperty("border-top-color",pas.Graphics.JSColor(VTopColor));
          $with.style.setProperty("border-right-color",pas.Graphics.JSColor(VBottomColor));
          $with.style.setProperty("border-bottom-color",pas.Graphics.JSColor(VBottomColor));
        };
        $with.style.setProperty("outline","none");
        $with.style.setProperty("user-select","none");
        $with.style.setProperty("-moz-user-select","none");
        $with.style.setProperty("-ms-user-select","none");
        $with.style.setProperty("-khtml-user-select","none");
        $with.style.setProperty("-webkit-user-select","none");
        if (this.fScrollHorizontal) {
          $with.style.setProperty("overflow-y","scroll");
        } else {
          $with.style.setProperty("overflow-y","hidden");
        };
        if (this.FScrollvertical) {
          $with.style.setProperty("overflow-x","scroll");
        } else {
          $with.style.setProperty("overflow-x","hidden");
        };
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 170;
      Result.cy = 50;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FAlignment = pas.Classes.TAlignment.taCenter;
      this.FBevelColor = 536870912;
      this.FBevelOuter = pas.Controls.TBevelCut.bvRaised;
      this.FBevelInner = pas.Controls.TBevelCut.bvNone;
      this.FBevelWidth = 1;
      this.FLayout = pas.Graphics.TTextLayout.tlCenter;
      this.FWordWrap = false;
      this.BeginUpdate();
      try {
        this.SetTabStop(false);
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
  rtl.createClass(this,"TCustomTimer",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FEnabled = false;
      this.FInterval = 0;
      this.FTimerHandle = 0;
      this.FOnStartTimer = null;
      this.FOnStopTimer = null;
      this.FOnTimer = null;
    };
    this.$final = function () {
      this.FOnStartTimer = undefined;
      this.FOnStopTimer = undefined;
      this.FOnTimer = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.SetEnabled = function (AValue) {
      if (this.FEnabled === AValue) return;
      this.FEnabled = AValue;
      this.UpdateTimer();
    };
    this.SetInterval = function (AValue) {
      if (this.FInterval === AValue) return;
      this.FInterval = AValue;
      this.UpdateTimer();
    };
    this.SetOnTimer = function (AValue) {
      if (rtl.eqCallback(this.FOnTimer,AValue)) return;
      this.FOnTimer = AValue;
      this.UpdateTimer();
    };
    this.DoOnTimer = function () {
      if (this.FOnTimer != null) this.FOnTimer(this);
    };
    this.UpdateTimer = function () {
      var $Self = this;
      this.KillTimer();
      if (this.FEnabled && (this.FInterval > 0) && rtl.eqSet(rtl.intersectSet(rtl.createSet(pas.Classes.TComponentStateItem.csLoading,pas.Classes.TComponentStateItem.csDestroying),this.FComponentState),{}) && (this.FOnTimer != null)) {
        this.FTimerHandle = window.setInterval(function () {
          $Self.FOnTimer($Self);
        },this.FInterval);
        if (this.FTimerHandle === 0) throw pas.Classes.EOutOfResources.$create("Create$1",[rtl.getResStr(pas.WCLStrConsts,"rsNoTimers")]);
        if (this.FOnStartTimer != null) this.FOnStartTimer($Self);
      };
    };
    this.KillTimer = function () {
      if (this.FTimerHandle !== 0) {
        window.clearInterval(this.FTimerHandle);
        if (this.FOnStopTimer != null) this.FOnStopTimer(this);
      };
    };
    this.Loaded = function () {
      pas.Classes.TComponent.Loaded.call(this);
      this.UpdateTimer();
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FEnabled = true;
      this.FInterval = 1000;
      this.FTimerHandle = 0;
      return this;
    };
    this.Destroy = function () {
      this.KillTimer();
      pas.Classes.TComponent.Destroy.call(this);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  this.$rtti.$MethodVar("TNotifyWebSocketMessage",{procsig: rtl.newTIProcSig([["aSender",pas.System.$rtti["TObject"]],["aData",rtl.string]]), methodkind: 0});
  this.$rtti.$MethodVar("TNotifyWebSocketBinaryMessage",{procsig: rtl.newTIProcSig([["aSender",pas.System.$rtti["TObject"]],["aData",pas.SysUtils.$rtti["TBytes"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TNotifyWebSocketClose",{procsig: rtl.newTIProcSig([["aSender",pas.System.$rtti["TObject"]],["aCode",rtl.longword],["aReason",rtl.string]]), methodkind: 0});
  rtl.createClass(this,"TCustomWebSocketClient",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.fConnected = false;
      this.fOnBinaryMessage = null;
      this.fOnClose = null;
      this.fOnError = null;
      this.fOnMessage = null;
      this.fOnOpen = null;
      this.fUrl = "";
      this.fWebSocket = null;
    };
    this.$final = function () {
      this.fOnBinaryMessage = undefined;
      this.fOnClose = undefined;
      this.fOnError = undefined;
      this.fOnMessage = undefined;
      this.fOnOpen = undefined;
      this.fWebSocket = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.WebSocketCloseHandler = function (aEvent) {
      var Result = false;
      if (this.fOnClose != null) this.fOnClose(this,aEvent.code,aEvent.reason);
      return Result;
    };
    this.WebSocketErrorHandler = function (aEvent) {
      var Result = false;
      this.Close();
      if (this.fOnError != null) this.fOnError(this);
      return Result;
    };
    this.WebSocketMessageHandler = function (aEvent) {
      var Result = false;
      var reader = null;
      var Data = null;
      if (aEvent.type !== "message") return Result;
      var $tmp = pas.JS.GetValueType(aEvent.data);
      if ($tmp === pas.JS.TJSValueType.jvtString) {
        if (this.fOnMessage != null) this.fOnMessage(this,"" + aEvent.data)}
       else if ($tmp === pas.JS.TJSValueType.jvtObject) if (this.fOnBinaryMessage != null) {
        reader = new FileReader();
        reader.readAsArrayBuffer(aEvent.data);
        reader.addEventListener("loadend",rtl.createCallback(this,"WebSocketReaderHandler"));
      };
      return Result;
    };
    this.WebSocketOpenHandler = function (aEvent) {
      var Result = false;
      this.fConnected = true;
      if (this.fOnOpen != null) this.fOnOpen(this);
      return Result;
    };
    this.WebSocketReaderHandler = function (aEvent) {
      var Result = false;
      var Data = null;
      var ByteArray = [];
      var i = 0;
      Data = new Uint8Array(aEvent.target.result);
      ByteArray = rtl.arraySetLength(ByteArray,0,Data.length);
      for (var $l = 0, $end = Data.length - 1; $l <= $end; $l++) {
        i = $l;
        ByteArray[i] = Data[i];
      };
      this.fOnBinaryMessage(this,rtl.arrayRef(ByteArray));
      return Result;
    };
    this.SetUrl = function (aValue) {
      this.fConnected = false;
      this.fUrl = aValue;
    };
    this.Destroy = function () {
      this.Close();
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.Connect = function () {
      this.Close();
      this.fWebSocket = new WebSocket(this.fUrl);
      this.fWebSocket.onmessage = rtl.createSafeCallback(this,"WebSocketMessageHandler");
      this.fWebSocket.onopen = rtl.createSafeCallback(this,"WebSocketOpenHandler");
      this.fWebSocket.onclose = rtl.createSafeCallback(this,"WebSocketCloseHandler");
      this.fWebSocket.onerror = rtl.createSafeCallback(this,"WebSocketErrorHandler");
    };
    this.Close = function () {
      this.Close$2(1000,"");
    };
    this.Close$1 = function (aCode) {
      this.Close$2(aCode,"");
    };
    this.Close$2 = function (aCode, aReason) {
      if (this.fWebSocket != null) {
        this.fWebSocket.close(aCode,aReason);
        this.fWebSocket = null;
      };
      this.fConnected = false;
    };
    this.Send = function (aData) {
      if (!this.fConnected) throw pas.SysUtils.Exception.$create("Create$1",["The WebSocket does not connected"]);
      this.fWebSocket.send(aData);
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  rtl.createClass(this,"TCustomGroupBox",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FLegendElement = null;
    };
    this.$final = function () {
      this.FLegendElement = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FHandleElement.setAttribute("name",this.FName);
        this.FLegendElement.innerHTML = this.GetText();
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("fieldset");
      this.FLegendElement = document.createElement("legend");
      Result.appendChild(this.FLegendElement);
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 200;
      Result.cy = 150;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.BeginUpdate();
      try {
        this.SetTabStop(false);
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
  this.TTrackBarOrientation = {"0": "trHorizontal", trHorizontal: 0, "1": "trVertical", trVertical: 1};
  this.$rtti.$Enum("TTrackBarOrientation",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TTrackBarOrientation});
  rtl.createClass(this,"TCustomTrackBar",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FMax = 0;
      this.FMin = 0;
      this.FFrequency = 0;
      this.FOrientation = 0;
      this.FPosition = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FOnChange = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.SetMax = function (AValue) {
      if (this.FMax !== AValue) {
        if (AValue < this.FMin) AValue = this.FMin;
        this.FMax = AValue;
        if (this.FPosition > this.FMax) this.FPosition = this.FMax;
        this.Changed();
      };
    };
    this.SetMin = function (AValue) {
      if (this.FMin !== AValue) {
        if (AValue > this.FMax) AValue = this.FMax;
        this.FMin = AValue;
        if (this.FPosition < this.FMin) this.FPosition = this.FMin;
        this.Changed();
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
      if (this.FPosition !== AValue) {
        this.FPosition = AValue;
        this.Changed();
      };
    };
    this.HandleChange = function (AEvent) {
      var Result = false;
      Result = true;
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FPosition = parseInt(this.FHandleElement.value);
        if (this.FOnChange != null) this.FOnChange(this);
      };
      return Result;
    };
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FHandleElement.setAttribute("name",this.FName);
        var $with = this.FHandleElement;
        this.FHandleElement.min = this.FMin;
        this.FHandleElement.max = this.FMax;
        this.FHandleElement.step = this.FFrequency;
        this.FHandleElement.value = this.FPosition;
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("input");
      Result.type = "range";
      Result.addEventListener("change",rtl.createCallback(this,"HandleChange"));
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 150;
      Result.cy = 30;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FMin = 0;
      this.FMax = 100;
      this.FFrequency = 1;
      this.FOrientation = $mod.TTrackBarOrientation.trHorizontal;
      this.FPosition = 0;
      this.BeginUpdate();
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
  rtl.createClass(this,"TCustomColorPicker",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FColor$1 = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FOnChange = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.SetColor$1 = function (AValue) {
      if (this.FColor$1 !== AValue) {
        this.FColor$1 = AValue;
        this.Changed();
      };
    };
    this.HandleChange = function (AEvent) {
      var Result = false;
      Result = true;
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FColor$1 = pas.Graphics.HTMLColorToTColor(this.FHandleElement.value);
        if (this.FOnChange != null) this.FOnChange(this);
      };
      return Result;
    };
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FHandleElement.setAttribute("name",this.FName);
        this.FHandleElement.value = pas.Graphics.JSColor(this.FColor$1);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("input");
      Result.type = "color";
      Result.addEventListener("change",rtl.createCallback(this,"HandleChange"));
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 50;
      Result.cy = 30;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FColor$1 = 0;
      this.BeginUpdate();
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
  rtl.createClass(this,"TCustomScrollBox",pas.Controls.TCustomControl,function () {
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FHandleElement.setAttribute("name",this.FName);
        this.FHandleElement.style.setProperty("overflow","auto");
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 200;
      Result.cy = 200;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.BeginUpdate();
      try {
        this.SetTabStop(false);
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
  rtl.createClass(this,"TCustomProgressBar",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FMax = 0;
      this.FMin = 0;
      this.FValue = 0;
    };
    this.SetMax = function (AValue) {
      if (this.FMax !== AValue) {
        if (AValue < this.FMin) AValue = this.FMin;
        this.FMax = AValue;
        if (this.FValue > this.FMax) this.FValue = this.FMax;
        this.Changed();
      };
    };
    this.SetMin = function (AValue) {
      if (this.FMin !== AValue) {
        if (AValue > this.FMax) AValue = this.FMax;
        this.FMin = AValue;
        if (this.FValue < this.FMin) this.FValue = this.FMin;
        this.Changed();
      };
    };
    this.SetValue = function (AValue) {
      if (AValue < this.FMin) AValue = this.FMin;
      if (AValue > this.FMax) AValue = this.FMax;
      if (this.FValue !== AValue) {
        this.FValue = AValue;
        this.Changed();
      };
    };
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        this.FHandleElement.setAttribute("name",this.FName);
        var $with = this.FHandleElement;
        $with.max = this.FMax;
        $with.value = this.FValue;
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("progress");
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 150;
      Result.cy = 20;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FMin = 0;
      this.FMax = 100;
      this.FValue = 0;
      this.BeginUpdate();
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
  this.TResizeStyle = {"0": "rsNone", rsNone: 0, "1": "rsLine", rsLine: 1, "2": "rsUpdate", rsUpdate: 2, "3": "rsPattern", rsPattern: 3};
  this.$rtti.$Enum("TResizeStyle",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TResizeStyle});
  this.$rtti.$MethodVar("TMouseDragHandler",{procsig: rtl.newTIProcSig([["AEvent",pas.Web.$rtti["TJSMouseEvent"]]],rtl.boolean), methodkind: 1});
  rtl.createClass(this,"TCustomSplitter",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FAutoSnap = false;
      this.FBeveled = false;
      this.FDragMove = null;
      this.FDragUp = null;
      this.FDragging = false;
      this.FMinSize = 0;
      this.FResizeStyle = 0;
      this.FStartCoord = 0.0;
      this.FStartSize = 0;
      this.FTarget = null;
      this.FTouchEnd = null;
      this.FTouchMove = null;
      this.FTouchStart = null;
      this.FOnMoved = null;
    };
    this.$final = function () {
      this.FDragMove = undefined;
      this.FDragUp = undefined;
      this.FTarget = undefined;
      this.FTouchEnd = undefined;
      this.FTouchMove = undefined;
      this.FTouchStart = undefined;
      this.FOnMoved = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.SetAutoSnap = function (AValue) {
      if (this.FAutoSnap !== AValue) {
        this.FAutoSnap = AValue;
        this.Changed();
      };
    };
    this.SetBeveled = function (AValue) {
      if (this.FBeveled !== AValue) {
        this.FBeveled = AValue;
        this.Changed();
      };
    };
    this.SetMinSize = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FMinSize !== AValue) {
        this.FMinSize = AValue;
        this.Changed();
      };
    };
    this.SetResizeStyle = function (AValue) {
      if (this.FResizeStyle !== AValue) {
        this.FResizeStyle = AValue;
        this.Changed();
      };
    };
    this.Horizontal = function () {
      var Result = false;
      Result = !(this.FAlign in rtl.createSet(pas.Controls.TAlign.alTop,pas.Controls.TAlign.alBottom));
      return Result;
    };
    this.FindTarget = function () {
      var Result = null;
      var VParent = null;
      var VIndex = 0;
      var VSelf = 0;
      var VControl = null;
      var VWant = 0;
      Result = null;
      VParent = this.FParent;
      if (!(VParent != null)) return Result;
      var $tmp = this.FAlign;
      if ($tmp === pas.Controls.TAlign.alLeft) {
        VWant = pas.Controls.TAlign.alLeft}
       else if ($tmp === pas.Controls.TAlign.alRight) {
        VWant = pas.Controls.TAlign.alRight}
       else if ($tmp === pas.Controls.TAlign.alTop) {
        VWant = pas.Controls.TAlign.alTop}
       else if ($tmp === pas.Controls.TAlign.alBottom) {
        VWant = pas.Controls.TAlign.alBottom}
       else {
        return Result;
      };
      VSelf = VParent.GetControlIndex(this);
      if (VSelf < 0) return Result;
      if (VWant in rtl.createSet(pas.Controls.TAlign.alLeft,pas.Controls.TAlign.alTop)) {
        for (var $l = VSelf - 1; $l >= 0; $l--) {
          VIndex = $l;
          VControl = VParent.GetControl(VIndex);
          if ((VControl != null) && (VControl.FAlign === VWant) && VControl.FVisible) {
            Result = VControl;
            return Result;
          };
        };
      } else {
        for (var $l1 = VSelf + 1, $end = VParent.GetControlCount() - 1; $l1 <= $end; $l1++) {
          VIndex = $l1;
          VControl = VParent.GetControl(VIndex);
          if ((VControl != null) && (VControl.FAlign === VWant) && VControl.FVisible) {
            Result = VControl;
            return Result;
          };
        };
      };
      return Result;
    };
    this.MaxTargetSize = function () {
      var Result = 0;
      var VParent = null;
      var VIndex = 0;
      var VControl = null;
      var VAvailable = 0;
      VParent = this.FParent;
      if (!(VParent != null)) {
        Result = this.FMinSize;
        return Result;
      };
      if (this.Horizontal()) {
        VAvailable = VParent.GetClientWidth()}
       else VAvailable = VParent.GetClientHeight();
      for (var $l = 0, $end = VParent.GetControlCount() - 1; $l <= $end; $l++) {
        VIndex = $l;
        VControl = VParent.GetControl(VIndex);
        if (!(VControl != null) || (VControl === this) || (VControl === this.FTarget)) continue;
        if (!VControl.FVisible) continue;
        if (this.Horizontal()) {
          if (VControl.FAlign in rtl.createSet(pas.Controls.TAlign.alLeft,pas.Controls.TAlign.alRight)) VAvailable = VAvailable - VControl.FWidth;
        } else {
          if (VControl.FAlign in rtl.createSet(pas.Controls.TAlign.alTop,pas.Controls.TAlign.alBottom)) VAvailable = VAvailable - VControl.FHeight;
        };
      };
      Result = VAvailable - this.FMinSize;
      if (Result < this.FMinSize) Result = this.FMinSize;
      return Result;
    };
    this.ApplySize = function (ANewSize) {
      if (!(this.FTarget != null)) return;
      if (ANewSize < this.FMinSize) ANewSize = this.FMinSize;
      if (ANewSize > this.MaxTargetSize()) ANewSize = this.MaxTargetSize();
      if (this.Horizontal()) {
        if (this.FTarget.FWidth !== ANewSize) this.FTarget.SetWidth(ANewSize);
      } else {
        if (this.FTarget.FHeight !== ANewSize) this.FTarget.SetHeight(ANewSize);
      };
      if (this.FParent != null) this.FParent.ReAlign();
    };
    this.DragTo = function (AClientX, AClientY) {
      var VDelta = 0.0;
      if (!this.FDragging || !(this.FTarget != null)) return;
      if (this.Horizontal()) {
        VDelta = AClientX - this.FStartCoord}
       else VDelta = AClientY - this.FStartCoord;
      if ((this.FAlign === pas.Controls.TAlign.alRight) || (this.FAlign === pas.Controls.TAlign.alBottom)) VDelta = -VDelta;
      if (this.FResizeStyle !== $mod.TResizeStyle.rsNone) this.ApplySize(this.FStartSize + Math.round(VDelta));
    };
    this.StartDragTracking = function () {
      document.addEventListener('mousemove', this.FDragMove, true);
      document.addEventListener('mouseup', this.FDragUp, true);
    };
    this.StopDragTracking = function () {
      document.removeEventListener('mousemove', this.FDragMove, true);
      document.removeEventListener('mouseup', this.FDragUp, true);
    };
    this.StartTouchTracking = function () {
      document.addEventListener('touchmove', this.FTouchMove, { passive: false, capture: true });
      document.addEventListener('touchend', this.FTouchEnd, { passive: false, capture: true });
      document.addEventListener('touchcancel', this.FTouchEnd, { passive: false, capture: true });
    };
    this.StopTouchTracking = function () {
      document.removeEventListener('touchmove', this.FTouchMove, { passive: false, capture: true });
      document.removeEventListener('touchend', this.FTouchEnd, { passive: false, capture: true });
      document.removeEventListener('touchcancel', this.FTouchEnd, { passive: false, capture: true });
    };
    this.Changed = function () {
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && rtl.eqSet(rtl.intersectSet(rtl.createSet(pas.Classes.TComponentStateItem.csLoading,pas.Classes.TComponentStateItem.csDestroying),this.FComponentState),{})) {
        if (this.Horizontal()) {
          if (this.FCursor !== -14) this.SetCursor(-14);
        } else {
          if (this.FCursor !== -15) this.SetCursor(-15);
        };
        if (this.FBeveled) {
          this.FHandleElement.style.setProperty("box-shadow","inset 0 0 0 1px #b0b0b0")}
         else this.FHandleElement.style.removeProperty("box-shadow");
      };
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
    this.HandleMouseDown = function (AEvent) {
      var Result = false;
      Result = pas.Controls.TControl.HandleMouseDown.call(this,AEvent);
      if (!this.FEnabled || this.FDragging) return Result;
      this.FTarget = this.FindTarget();
      if (!(this.FTarget != null)) return Result;
      this.FDragging = true;
      if (this.Horizontal()) {
        this.FStartCoord = AEvent.clientX;
        this.FStartSize = this.FTarget.FWidth;
      } else {
        this.FStartCoord = AEvent.clientY;
        this.FStartSize = this.FTarget.FHeight;
      };
      this.StartDragTracking();
      AEvent.preventDefault();
      AEvent.stopPropagation();
      Result = true;
      return Result;
    };
    this.HandleDocMouseMove = function (AEvent) {
      var Result = false;
      Result = false;
      if (!this.FDragging || !(this.FTarget != null)) return Result;
      this.DragTo(AEvent.clientX,AEvent.clientY);
      AEvent.preventDefault();
      Result = true;
      return Result;
    };
    this.HandleDocMouseUp = function (AEvent) {
      var Result = false;
      Result = false;
      if (!this.FDragging) return Result;
      this.StopDragTracking();
      if (this.FResizeStyle === $mod.TResizeStyle.rsNone) this.DragTo(AEvent.clientX,AEvent.clientY);
      this.FDragging = false;
      this.FTarget = null;
      if (this.FOnMoved != null) this.FOnMoved(this);
      AEvent.stopPropagation();
      Result = true;
      return Result;
    };
    this.HandleTouchStart = function (AEvent) {
      var Result = false;
      Result = false;
      if (!this.FEnabled || this.FDragging) return Result;
      if (AEvent.touches.length === 0) return Result;
      this.FTarget = this.FindTarget();
      if (!(this.FTarget != null)) return Result;
      this.FDragging = true;
      if (this.Horizontal()) {
        this.FStartCoord = AEvent.touches.item(0).clientX;
        this.FStartSize = this.FTarget.FWidth;
      } else {
        this.FStartCoord = AEvent.touches.item(0).clientY;
        this.FStartSize = this.FTarget.FHeight;
      };
      this.StartTouchTracking();
      AEvent.preventDefault();
      Result = true;
      return Result;
    };
    this.HandleDocTouchMove = function (AEvent) {
      var Result = false;
      Result = false;
      if (!this.FDragging || !(this.FTarget != null)) return Result;
      if (AEvent.touches.length === 0) return Result;
      this.DragTo(AEvent.touches.item(0).clientX,AEvent.touches.item(0).clientY);
      AEvent.preventDefault();
      Result = true;
      return Result;
    };
    this.HandleDocTouchEnd = function (AEvent) {
      var Result = false;
      Result = false;
      if (!this.FDragging) return Result;
      this.StopTouchTracking();
      this.FDragging = false;
      this.FTarget = null;
      if (this.FOnMoved != null) this.FOnMoved(this);
      AEvent.stopPropagation();
      Result = true;
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 5;
      Result.cy = 100;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FAutoSnap = true;
      this.FBeveled = false;
      this.FDragMove = rtl.createCallback(this,"HandleDocMouseMove");
      this.FDragUp = rtl.createCallback(this,"HandleDocMouseUp");
      this.FTouchStart = rtl.createSafeCallback(this,"HandleTouchStart");
      this.FTouchMove = rtl.createSafeCallback(this,"HandleDocTouchMove");
      this.FTouchEnd = rtl.createSafeCallback(this,"HandleDocTouchEnd");
      this.FDragging = false;
      this.FMinSize = 30;
      this.FResizeStyle = $mod.TResizeStyle.rsUpdate;
      this.FTarget = null;
      this.FOnMoved = null;
      this.FHandleElement.addEventListener('touchstart', this.FTouchStart, { passive: false });
      this.BeginUpdate();
      try {
        this.SetAlign(pas.Controls.TAlign.alLeft);
        this.SetColor(-2147483633);
        this.SetWidth(5);
        this.SetHeight(100);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      if (this.FDragging) {
        this.StopDragTracking();
        this.StopTouchTracking();
        this.FDragging = false;
      };
      this.FHandleElement.removeEventListener('touchstart', this.FTouchStart, { passive: false });
      this.FTarget = null;
      pas.Controls.TCustomControl.Destroy.call(this);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  this.TShapeType = {"0": "stRectangle", stRectangle: 0, "1": "stSquare", stSquare: 1, "2": "stRoundRect", stRoundRect: 2, "3": "stRoundSquare", stRoundSquare: 3, "4": "stCircle", stCircle: 4, "5": "stEllipse", stEllipse: 5, "6": "stSquaredTriangle", stSquaredTriangle: 6, "7": "stTriangle", stTriangle: 7};
  this.$rtti.$Enum("TShapeType",{minvalue: 0, maxvalue: 7, ordtype: 1, enumtype: this.TShapeType});
  rtl.createClass(this,"TCustomShape",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FBrush = null;
      this.FPen = null;
      this.FShape = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FBrush = undefined;
      this.FPen = undefined;
      this.FOnChange = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.SetBrush = function (AValue) {
      this.FBrush.Assign(AValue);
    };
    this.SetPen = function (AValue) {
      this.FPen.Assign(AValue);
    };
    this.SetShape = function (AValue) {
      if (this.FShape !== AValue) {
        this.FShape = AValue;
        this.StyleChanged(this);
      };
    };
    this.StyleChanged = function (Sender) {
      this.Invalidate();
      if (this.FOnChange != null) {
        this.FOnChange(this);
      };
    };
    var VPoints$a$clone = function (a) {
      var b = [];
      b.length = 3;
      for (var c = 0; c < 3; c++) b[c] = pas.Types.TPoint.$clone(a[c]);
      return b;
    };
    this.Paint = function () {
      var $Self = this;
      var VWidth = 0.0;
      var VHeight = 0.0;
      var VSide = 0.0;
      var VX = 0.0;
      var VY = 0.0;
      var VRadius = 0.0;
      var VPoints = rtl.arraySetLength(null,pas.Types.TPoint,3);
      function Smallest(A, B) {
        var Result = 0.0;
        if (A < B) {
          Result = A}
         else Result = B;
        return Result;
      };
      VWidth = this.FWidth;
      VHeight = this.FHeight;
      if (this.GetCanvas().FWidth !== VWidth) {
        this.GetCanvas().SetWidth(pas.System.Trunc(VWidth));
      };
      if (this.GetCanvas().FHeight !== VHeight) {
        this.GetCanvas().SetHeight(pas.System.Trunc(VHeight));
      };
      this.GetCanvas().Clear();
      this.GetCanvas().FBrush.Assign(this.FBrush);
      this.GetCanvas().FPen.Assign(this.FPen);
      var $tmp = this.FShape;
      if ($tmp === $mod.TShapeType.stRectangle) {
        this.GetCanvas().Rectangle$1(0,0,VWidth,VHeight)}
       else if ($tmp === $mod.TShapeType.stSquare) {
        VSide = Smallest(VWidth,VHeight);
        VX = (VWidth - VSide) / 2;
        VY = (VHeight - VSide) / 2;
        this.GetCanvas().Rectangle$1(VX,VY,VSide,VSide);
      } else if ($tmp === $mod.TShapeType.stRoundRect) {
        VRadius = Smallest(VWidth,VHeight) / 4;
        this.GetCanvas().RoundRect(0,0,VWidth,VHeight,VRadius,VRadius);
      } else if ($tmp === $mod.TShapeType.stRoundSquare) {
        VSide = Smallest(VWidth,VHeight);
        VX = (VWidth - VSide) / 2;
        VY = (VHeight - VSide) / 2;
        VRadius = VSide / 4;
        this.GetCanvas().RoundRect(VX,VY,VX + VSide,VY + VSide,VRadius,VRadius);
      } else if ($tmp === $mod.TShapeType.stCircle) {
        VSide = Smallest(VWidth,VHeight);
        VX = (VWidth - VSide) / 2;
        VY = (VHeight - VSide) / 2;
        this.GetCanvas().Ellipse(VX,VY,VX + VSide,VY + VSide);
      } else if ($tmp === $mod.TShapeType.stEllipse) {
        this.GetCanvas().Ellipse(0,0,VWidth,VHeight)}
       else if ($tmp === $mod.TShapeType.stTriangle) {
        VPoints[0].$assign(pas.Types.Point(pas.System.Trunc(VWidth / 2),0));
        VPoints[1].$assign(pas.Types.Point(pas.System.Trunc(VWidth),pas.System.Trunc(VHeight)));
        VPoints[2].$assign(pas.Types.Point(0,pas.System.Trunc(VHeight)));
        this.GetCanvas().Polygon(VPoints);
      } else if ($tmp === $mod.TShapeType.stSquaredTriangle) {
        VPoints[0].$assign(pas.Types.Point(0,0));
        VPoints[1].$assign(pas.Types.Point(0,pas.System.Trunc(VHeight)));
        VPoints[2].$assign(pas.Types.Point(pas.System.Trunc(VWidth),pas.System.Trunc(VHeight)));
        this.GetCanvas().Polygon(VPoints);
      };
      pas.Controls.TCustomControl.Paint.call(this);
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 65;
      Result.cy = 65;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FBrush = pas.Graphics.TBrush.$create("Create$1");
      this.FBrush.FOnChange = rtl.createCallback(this,"StyleChanged");
      this.FPen = pas.Graphics.TPen.$create("Create$1");
      this.FPen.FOnChange = rtl.createCallback(this,"StyleChanged");
      this.FShape = $mod.TShapeType.stRectangle;
      this.FOnChange = null;
      this.BeginUpdate();
      try {
        this.FBrush.SetColor(-2147483633);
        this.FPen.SetColor(0);
        this.SetBounds(0,0,65,65);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FBrush");
      this.FBrush = null;
      rtl.free(this,"FPen");
      this.FPen = null;
      pas.Controls.TCustomControl.Destroy.call(this);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TCustomPaintBox",pas.Controls.TCustomControl,function () {
    this.ResizeCanvas = function () {
      if (this.GetCanvas().FWidth !== this.FWidth) {
        this.GetCanvas().SetWidth(this.FWidth);
      };
      if (this.GetCanvas().FHeight !== this.FHeight) {
        this.GetCanvas().SetHeight(this.FHeight);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 105;
      Result.cy = 105;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.ResizeCanvas();
      return this;
    };
    this.Invalidate = function () {
      this.ResizeCanvas();
      pas.Controls.TCustomControl.Invalidate.call(this);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  $mod.$implcode = function () {
    $impl._WCLExtRulesRegistered = false;
    $impl._RegisterWCLExtRules = function () {
      if ($impl._WCLExtRulesRegistered) return;
      pas.Controls.RegisterWCLStyle(".wcl-panel{" + "border-radius:4px;" + "overflow:hidden;}");
      $impl._WCLExtRulesRegistered = true;
    };
  };
},["WCLStrConsts"]);
//# sourceMappingURL=extctrls.js.map
