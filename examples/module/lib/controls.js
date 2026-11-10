rtl.module("Controls",["System","Classes","SysUtils","Types","JS","Web","Math","Graphics","Generics.Collections"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.mrNone = 0;
  this.mrOk = 0 + 1;
  this.mrCancel = 0 + 2;
  this.mrAbort = 0 + 3;
  this.mrRetry = 0 + 4;
  this.mrIgnore = 0 + 5;
  this.mrYes = 0 + 6;
  this.mrNo = 0 + 7;
  this.mrAll = 0 + 8;
  this.mrNoToAll = 0 + 9;
  this.mrYesToAll = 0 + 10;
  this.mrClose = 0 + 11;
  this.mrLast = 11;
  this.$rtti.$StaticArray("ModalResultStr$a",{dims: [12], eltype: rtl.string});
  this.ModalResultStr = ["mrNone","mrOk","mrCancel","mrAbort","mrRetry","mrIgnore","mrYes","mrNo","mrAll","mrNoToAll","mrYesToAll","mrClose"];
  this.crDefault = 0;
  this.crNone = -1;
  this.crArrow = -2;
  this.crCross = -3;
  this.crIBeam = -4;
  this.crSize = -22;
  this.crSizeAll = -22;
  this.crSizeNESW = -6;
  this.crSizeNS = -7;
  this.crSizeNWSE = -8;
  this.crSizeWE = -9;
  this.crSizeNW = -23;
  this.crSizeN = -24;
  this.crSizeNE = -25;
  this.crSizeW = -26;
  this.crSizeE = -27;
  this.crSizeSW = -28;
  this.crSizeS = -29;
  this.crSizeSE = -30;
  this.crUpArrow = -10;
  this.crHourGlass = -11;
  this.crDrag = -12;
  this.crNoDrop = -13;
  this.crHSplit = -14;
  this.crVSplit = -15;
  this.crMultiDrag = -16;
  this.crSQLWait = -17;
  this.crNo = -18;
  this.crAppStart = -19;
  this.crHelp = -20;
  this.crHandPoint = -21;
  this.crMove = -31;
  this.scShift = 0x2000;
  this.scCtrl = 0x4000;
  this.scAlt = 0x8000;
  this.$rtti.$Class("TWinControl");
  this.$rtti.$ClassRef("TWinControlClass",{instancetype: this.$rtti["TWinControl"]});
  this.$rtti.$Class("TControl");
  this.$rtti.$ClassRef("TControlClass",{instancetype: this.$rtti["TControl"]});
  this.$rtti.$Class("TBasicAction");
  this.$rtti.$Class("TCustomPopupMenu");
  this.TDragMode = {"0": "dmManual", dmManual: 0, "1": "dmAutomatic", dmAutomatic: 1};
  this.$rtti.$Enum("TDragMode",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TDragMode});
  this.TDragKind = {"0": "dkDrag", dkDrag: 0, "1": "dkDock", dkDock: 1};
  this.$rtti.$Enum("TDragKind",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TDragKind});
  this.TDragState = {"0": "dsDragEnter", dsDragEnter: 0, "1": "dsDragLeave", dsDragLeave: 1, "2": "dsDragMove", dsDragMove: 2};
  this.$rtti.$Enum("TDragState",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TDragState});
  rtl.createClass(this,"TDragObject",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FSource = null;
    };
    this.$final = function () {
      this.FSource = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (ASource) {
      pas.System.TObject.Create.call(this);
      this.FSource = ASource;
      return this;
    };
  });
  this.$rtti.$MethodVar("TDragOverEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Source",pas.System.$rtti["TObject"]],["X",rtl.longint],["Y",rtl.longint],["State",this.$rtti["TDragState"]],["Accept",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TDragDropEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Source",pas.System.$rtti["TObject"]],["X",rtl.longint],["Y",rtl.longint]]), methodkind: 0});
  this.$rtti.$MethodVar("TStartDragEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["DragObject",this.$rtti["TDragObject"],1]]), methodkind: 0});
  this.$rtti.$MethodVar("TEndDragEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Target",pas.System.$rtti["TObject"]],["X",rtl.longint],["Y",rtl.longint]]), methodkind: 0});
  rtl.createClass(this,"TCustomPopupMenu",pas.Classes.TComponent,function () {
    this.PopupAt = function (AX, AY) {
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  this.TAlign = {"0": "alNone", alNone: 0, "1": "alTop", alTop: 1, "2": "alBottom", alBottom: 2, "3": "alLeft", alLeft: 3, "4": "alRight", alRight: 4, "5": "alClient", alClient: 5, "6": "alCustom", alCustom: 6};
  this.$rtti.$Enum("TAlign",{minvalue: 0, maxvalue: 6, ordtype: 1, enumtype: this.TAlign});
  this.$rtti.$Set("TAlignSet",{comptype: this.$rtti["TAlign"]});
  this.TAnchorKind = {"0": "akTop", akTop: 0, "1": "akLeft", akLeft: 1, "2": "akRight", akRight: 2, "3": "akBottom", akBottom: 3};
  this.$rtti.$Enum("TAnchorKind",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TAnchorKind});
  this.$rtti.$Set("TAnchors",{comptype: this.$rtti["TAnchorKind"]});
  this.TBevelCut = {"0": "bvNone", bvNone: 0, "1": "bvLowered", bvLowered: 1, "2": "bvRaised", bvRaised: 2, "3": "bvSpace", bvSpace: 3};
  this.$rtti.$Enum("TBevelCut",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TBevelCut});
  this.TFormBorderStyle = {"0": "bsNone", bsNone: 0, "1": "bsSingle", bsSingle: 1, "2": "bsSizeable", bsSizeable: 2, "3": "bsDialog", bsDialog: 3, "4": "bsToolWindow", bsToolWindow: 4, "5": "bsSizeToolWin", bsSizeToolWin: 5};
  this.$rtti.$Enum("TFormBorderStyle",{minvalue: 0, maxvalue: 5, ordtype: 1, enumtype: this.TFormBorderStyle});
  this.$rtti.$Enum("TBorderStyle",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TFormBorderStyle});
  this.$rtti.$inherited("TCaption",rtl.string,{});
  this.$rtti.$Int("TCursor",{minvalue: -32768, maxvalue: 32767, ordtype: 2});
  rtl.createClass(this,"TControlCanvas",pas.Graphics.TCanvas,function () {
    this.$init = function () {
      pas.Graphics.TCanvas.$init.call(this);
      this.FControl = null;
      this.FHeight = 0;
      this.FWidth = 0;
    };
    this.$final = function () {
      this.FControl = undefined;
      pas.Graphics.TCanvas.$final.call(this);
    };
    this.SetHeight = function (AValue) {
      if (this.FHeight !== AValue) {
        this.FHeight = AValue;
        this.FCanvasElement.height = this.FHeight;
      };
    };
    this.SetWidth = function (AValue) {
      if (this.FWidth !== AValue) {
        this.FWidth = AValue;
        this.FCanvasElement.width = this.FWidth;
      };
    };
    this.Create$2 = function (AControl) {
      pas.Graphics.TCanvas.Create$1.call(this);
      if (AControl != null) {
        this.SetHeight(AControl.FHeight);
        this.SetWidth(AControl.FWidth);
        this.FFont.Assign(AControl.FFont);
        this.FBrush.SetColor(AControl.FColor);
        this.FPen.SetColor(AControl.FFont.FColor);
        this.FControl = AControl;
        this.FControl.FHandleElement.insertBefore(this.FCanvasElement,AControl.FHandleElement.firstChild);
        this.FCanvasElement.style.setProperty("position","absolute");
        this.FCanvasElement.style.setProperty("left","0px");
        this.FCanvasElement.style.setProperty("top","0px");
        this.FCanvasElement.style.setProperty("display","block");
      };
      return this;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["AControl",$mod.$rtti["TControl"]]]);
  });
  this.TShiftStateEnum = {"0": "ssShift", ssShift: 0, "1": "ssAlt", ssAlt: 1, "2": "ssCtrl", ssCtrl: 2, "3": "ssLeft", ssLeft: 3, "4": "ssRight", ssRight: 4, "5": "ssMIDdle", ssMIDdle: 5, "6": "ssDouble", ssDouble: 6};
  this.$rtti.$Enum("TShiftStateEnum",{minvalue: 0, maxvalue: 6, ordtype: 1, enumtype: this.TShiftStateEnum});
  this.$rtti.$Set("TShiftState",{comptype: this.$rtti["TShiftStateEnum"]});
  this.$rtti.$MethodVar("TKeyEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Key",rtl.nativeint,1],["Shift",this.$rtti["TShiftState"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TKeyPressEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Key",rtl.char,1]]), methodkind: 0});
  this.TMouseButton = {"0": "mbLeft", mbLeft: 0, "1": "mbRight", mbRight: 1, "2": "mbMiddle", mbMiddle: 2};
  this.$rtti.$Enum("TMouseButton",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TMouseButton});
  this.$rtti.$MethodVar("TMouseEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Button",this.$rtti["TMouseButton"]],["Shift",this.$rtti["TShiftState"]],["X",rtl.nativeint],["Y",rtl.nativeint]]), methodkind: 0});
  this.$rtti.$MethodVar("TMouseMoveEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Shift",this.$rtti["TShiftState"]],["X",rtl.nativeint],["Y",rtl.nativeint]]), methodkind: 0});
  this.$rtti.$MethodVar("TMouseWheelEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Shift",this.$rtti["TShiftState"]],["WheelDelta",rtl.nativeint],["MousePos",pas.Types.$rtti["TPoint"]],["Handled",rtl.boolean,1]]), methodkind: 0});
  this.TFocusSearchDirection = {"0": "fsdFirst", fsdFirst: 0, "1": "fsdLast", fsdLast: 1, "2": "fsdNext", fsdNext: 2, "3": "fsdPrev", fsdPrev: 3};
  this.$rtti.$Enum("TFocusSearchDirection",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TFocusSearchDirection});
  this.TControlFlag = {"0": "cfInAlignControls", cfInAlignControls: 0};
  this.$rtti.$Enum("TControlFlag",{minvalue: 0, maxvalue: 0, ordtype: 1, enumtype: this.TControlFlag});
  this.$rtti.$Set("TControlFlags",{comptype: this.$rtti["TControlFlag"]});
  rtl.createClass(this,"TControlBorderSpacing",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FAround = 0;
      this.FBottom = 0;
      this.FLeft = 0;
      this.FRight = 0;
      this.FTop = 0;
      this.FUpdateCount = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FOnChange = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.SetAround = function (AValue) {
      if (this.FAround !== AValue) {
        this.FAround = AValue;
        this.Changed();
      };
    };
    this.SetBottom = function (AValue) {
      if (this.FBottom !== AValue) {
        this.FBottom = AValue;
        this.Changed();
      };
    };
    this.SetLeft = function (AValue) {
      if (this.FLeft !== AValue) {
        this.FLeft = AValue;
        this.Changed();
      };
    };
    this.SetRight = function (AValue) {
      if (this.FRight !== AValue) {
        this.FRight = AValue;
        this.Changed();
      };
    };
    this.SetTop = function (AValue) {
      if (this.FTop !== AValue) {
        this.FTop = AValue;
        this.Changed();
      };
    };
    this.Changed = function () {
      if ((this.FUpdateCount === 0) && (this.FOnChange != null)) {
        this.FOnChange(this);
      };
    };
    this.Create$1 = function () {
      pas.System.TObject.Create.call(this);
      this.FBottom = 0;
      this.FLeft = 0;
      this.FRight = 0;
      this.FTop = 0;
      this.FUpdateCount = 0;
      return this;
    };
    this.Assign = function (Source) {
      var VSpacing = null;
      if ((Source != null) && $mod.TControlBorderSpacing.isPrototypeOf(Source)) {
        this.BeginUpdate();
        try {
          VSpacing = Source;
          this.FAround = VSpacing.FAround;
          this.FBottom = VSpacing.FBottom;
          this.FLeft = VSpacing.FLeft;
          this.FRight = VSpacing.FRight;
          this.FTop = VSpacing.FTop;
        } finally {
          this.EndUpdate();
        };
      } else {
        pas.Classes.TPersistent.Assign.call(this,Source);
      };
    };
    this.BeginUpdate = function () {
      this.FUpdateCount += 1;
    };
    this.EndUpdate = function () {
      if (this.FUpdateCount > 0) {
        this.FUpdateCount -= 1;
        if (this.FUpdateCount === 0) {
          this.Changed();
        };
      };
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[]);
    $r.addProperty("Around",2,rtl.nativeint,"FAround","SetAround");
    $r.addProperty("Bottom",2,rtl.nativeint,"FBottom","SetBottom");
    $r.addProperty("Left",2,rtl.nativeint,"FLeft","SetLeft");
    $r.addProperty("Right",2,rtl.nativeint,"FRight","SetRight");
    $r.addProperty("Top",2,rtl.nativeint,"FTop","SetTop");
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
  });
  rtl.createClass(this,"TSizeConstraints",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FMaxHeight = 0;
      this.FMaxWidth = 0;
      this.FMinHeight = 0;
      this.FMinWidth = 0;
      this.FUpdateCount = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FOnChange = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.SetMaxHeight = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FMaxHeight !== AValue) {
        this.FMaxHeight = AValue;
        this.Changed();
      };
    };
    this.SetMaxWidth = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FMaxWidth !== AValue) {
        this.FMaxWidth = AValue;
        this.Changed();
      };
    };
    this.SetMinHeight = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FMinHeight !== AValue) {
        this.FMinHeight = AValue;
        this.Changed();
      };
    };
    this.SetMinWidth = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FMinWidth !== AValue) {
        this.FMinWidth = AValue;
        this.Changed();
      };
    };
    this.Changed = function () {
      if ((this.FUpdateCount === 0) && (this.FOnChange != null)) {
        this.FOnChange(this);
      };
    };
    this.Create$1 = function () {
      pas.System.TObject.Create.call(this);
      this.FMaxHeight = 0;
      this.FMaxWidth = 0;
      this.FMinHeight = 0;
      this.FMinWidth = 0;
      this.FUpdateCount = 0;
      return this;
    };
    this.Assign = function (Source) {
      var VConstraints = null;
      if ((Source != null) && $mod.TSizeConstraints.isPrototypeOf(Source)) {
        this.BeginUpdate();
        try {
          VConstraints = Source;
          this.FMaxHeight = VConstraints.FMaxHeight;
          this.FMaxWidth = VConstraints.FMaxWidth;
          this.FMinHeight = VConstraints.FMinHeight;
          this.FMinWidth = VConstraints.FMinWidth;
        } finally {
          this.EndUpdate();
        };
      } else {
        pas.Classes.TPersistent.Assign.call(this,Source);
      };
    };
    this.BeginUpdate = function () {
      this.FUpdateCount += 1;
    };
    this.EndUpdate = function () {
      if (this.FUpdateCount > 0) {
        this.FUpdateCount -= 1;
        if (this.FUpdateCount === 0) {
          this.Changed();
        };
      };
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[]);
    $r.addProperty("MaxHeight",2,rtl.nativeint,"FMaxHeight","SetMaxHeight",{Default: 0});
    $r.addProperty("MaxWidth",2,rtl.nativeint,"FMaxWidth","SetMaxWidth",{Default: 0});
    $r.addProperty("MinHeight",2,rtl.nativeint,"FMinHeight","SetMinHeight",{Default: 0});
    $r.addProperty("MinWidth",2,rtl.nativeint,"FMinWidth","SetMinWidth",{Default: 0});
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
  });
  rtl.createClass(this,"TControl",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FAction = null;
      this.FAlign = 0;
      this.FAnchors = {};
      this.FAutoSize = false;
      this.FBorderSpacing = null;
      this.FBorderStyle = $mod.TFormBorderStyle.bsNone;
      this.FCaption = "";
      this.FColor = 0;
      this.FConstraints = null;
      this.FControlFlags = {};
      this.FControls = null;
      this.FCursor = 0;
      this.FDesignRect = pas.Types.TRect.$new();
      this.FDragKind = 0;
      this.FDragMode = 0;
      this.FEnabled = false;
      this.FFont = null;
      this.FOnDragDrop = null;
      this.FOnDragOver = null;
      this.FOnEndDrag = null;
      this.FOnStartDrag = null;
      this.FHandleClass = "";
      this.FHandleElement = null;
      this.FHandleId = "";
      this.FHeight = 0;
      this.FHint = "";
      this.FLeft = 0;
      this.FParent = null;
      this.FParentColor = false;
      this.FParentFont = false;
      this.FParentShowHint = false;
      this.FPopupMenu = null;
      this.FShowHint = false;
      this.FTabOrder = 0;
      this.FTabStop = false;
      this.FTop = 0;
      this.FUpdateCount = 0;
      this.FVisible = false;
      this.FWidth = 0;
      this.FOnClick = null;
      this.FOnDblClick = null;
      this.FOnMouseDown = null;
      this.FOnMouseEnter = null;
      this.FOnMouseLeave = null;
      this.FOnMouseMove = null;
      this.FOnMouseUp = null;
      this.FOnMouseWheel = null;
      this.FOnResize = null;
      this.FOnScroll = null;
    };
    this.$final = function () {
      this.FAction = undefined;
      this.FAnchors = undefined;
      this.FBorderSpacing = undefined;
      this.FConstraints = undefined;
      this.FControlFlags = undefined;
      this.FControls = undefined;
      this.FDesignRect = undefined;
      this.FFont = undefined;
      this.FOnDragDrop = undefined;
      this.FOnDragOver = undefined;
      this.FOnEndDrag = undefined;
      this.FOnStartDrag = undefined;
      this.FHandleElement = undefined;
      this.FParent = undefined;
      this.FPopupMenu = undefined;
      this.FOnClick = undefined;
      this.FOnDblClick = undefined;
      this.FOnMouseDown = undefined;
      this.FOnMouseEnter = undefined;
      this.FOnMouseLeave = undefined;
      this.FOnMouseMove = undefined;
      this.FOnMouseUp = undefined;
      this.FOnMouseWheel = undefined;
      this.FOnResize = undefined;
      this.FOnScroll = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.GetClientHeight = function () {
      var Result = 0;
      Result = this.GetClientRect().Bottom;
      return Result;
    };
    this.GetClientOrigin = function () {
      var Result = pas.Types.TPoint.$new();
      if (this.FParent != null) {
        Result.$assign(this.FParent.GetClientOrigin());
        Result.x += this.FLeft;
        Result.y += this.FTop;
      } else {
        throw new Error(pas.SysUtils.Format("Control '%s' has no parent window",pas.System.VarRecs(18,this.FName)));
      };
      return Result;
    };
    this.GetClientRect = function () {
      var Result = pas.Types.TRect.$new();
      Result.$assign(pas.Types.Rect(0,0,this.FWidth - 1,this.FHeight - 1));
      return Result;
    };
    this.GetClientWidth = function () {
      var Result = 0;
      Result = this.GetClientRect().Right;
      return Result;
    };
    this.GetText = function () {
      var Result = "";
      Result = this.RealGetText();
      return Result;
    };
    this.IsAnchorsStored = function () {
      var Result = false;
      Result = rtl.neSet(this.FAnchors,$mod.AnchorAlign[this.FAlign]);
      return Result;
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
    this.SetAlign = function (AValue) {
      var oldalign = 0;
      if (this.FAlign !== AValue) {
        oldalign = this.FAlign;
        this.FAlign = AValue;
        if (rtl.eqSet(this.FAnchors,$mod.AnchorAlign[oldalign]) && rtl.neSet(this.FAnchors,$mod.AnchorAlign[this.FAlign])) this.SetAnchors(rtl.refSet($mod.AnchorAlign[this.FAlign]));
        if (this.FParent != null) {
          this.FParent.ReAlign()}
         else this.ReAlign();
      };
    };
    this.SetAnchors = function (AValue) {
      if (rtl.eqSet(this.FAnchors,AValue)) return;
      this.FAnchors = rtl.refSet(AValue);
    };
    this.SetAutoSize = function (AValue) {
      if (this.FAutoSize !== AValue) {
        this.FAutoSize = AValue;
        if (this.FAutoSize) {
          this.AdjustSize();
        };
      };
    };
    this.SetBorderSpacing = function (AValue) {
      this.FBorderSpacing.Assign(AValue);
    };
    this.SetClientSize = function (AValue) {
      var VClient = pas.Types.TRect.$new();
      VClient.$assign(this.GetClientRect());
      this.SetBounds(this.FLeft,this.FTop,(this.FWidth - VClient.Right) + AValue.x,(this.FHeight - VClient.Bottom) + AValue.y);
    };
    this.SetClientHeight = function (AValue) {
      this.SetClientSize(pas.Types.TPoint.$clone(pas.Types.Point(this.GetClientWidth(),AValue)));
    };
    this.SetClientWidth = function (AValue) {
      this.SetClientSize(pas.Types.TPoint.$clone(pas.Types.Point(AValue,this.GetClientHeight())));
    };
    this.SetColor = function (AValue) {
      if (this.FColor !== AValue) {
        this.FColor = AValue;
        this.FParentColor = false;
        this.ColorChanged(this);
      };
    };
    this.SetConstraints = function (AValue) {
      this.FConstraints.Assign(AValue);
    };
    this.SetCursor = function (AValue) {
      if (this.FCursor !== AValue) {
        this.FCursor = AValue;
        this.Changed();
      };
    };
    this.SetEnabled = function (AValue) {
      if (this.FEnabled !== AValue) {
        this.FEnabled = AValue;
        this.Changed();
      };
    };
    this.SetFont = function (AValue) {
      if (!this.FFont.IsEqual(AValue)) {
        this.FFont.Assign(AValue);
      };
    };
    this.SetHandleClass = function (AValue) {
      if (this.FHandleClass !== AValue) {
        this.FHandleClass = AValue;
        this.Changed();
      };
    };
    this.SetHandleId = function (AValue) {
      if (this.FHandleId !== AValue) {
        this.FHandleId = AValue;
        this.Changed();
      };
    };
    this.SetHeight = function (AValue) {
      this.SetBounds(this.FLeft,this.FTop,this.FWidth,AValue);
    };
    this.SetHint = function (AValue) {
      if (this.FHint !== AValue) {
        this.FHint = AValue;
        this.Changed();
      };
    };
    this.SetLeft = function (AValue) {
      this.SetBounds(AValue,this.FTop,this.FWidth,this.FHeight);
    };
    this.SetParent = function (AValue) {
      if (this.FParent != null) {
        this.FParent.UnRegisterChild(this);
      };
      this.CheckNewParent(AValue);
      this.FParent = AValue;
      if (this.FParent != null) {
        this.FParent.RegisterChild(this);
        this.BeginUpdate();
        try {
          if (this.FParentColor) {
            this.FColor = this.FParent.FColor;
          };
          if (this.FParentFont) {
            this.FFont.Assign(this.FParent.FFont);
          };
          if (this.FParentShowHint) {
            this.FShowHint = this.FParent.FShowHint;
          };
        } finally {
          this.EndUpdate();
        };
      };
    };
    this.SetParentColor = function (AValue) {
      if (this.FParentColor !== AValue) {
        this.FParentColor = AValue;
        if (this.FParentColor && (this.FParent != null)) {
          this.FColor = this.FParent.FColor;
          this.Changed();
        };
      };
    };
    this.SetParentFont = function (AValue) {
      if (this.FParentFont !== AValue) {
        this.FParentFont = AValue;
        if (this.FParentFont && (this.FParent != null) && !this.FFont.IsEqual(this.FParent.FFont)) {
          this.FFont.Assign(this.FParent.FFont);
        };
      };
    };
    this.SetParentShowHint = function (AValue) {
      if (this.FParentShowHint !== AValue) {
        this.FParentShowHint = AValue;
        if (this.FParentShowHint && (this.FParent != null)) {
          this.FShowHint = this.FParent.FShowHint;
          this.Changed();
        };
      };
    };
    this.SetPopupMenu = function (AValue) {
      if (this.FPopupMenu === AValue) return;
      if (this.FPopupMenu != null) this.FPopupMenu.RemoveFreeNotification(this);
      this.FPopupMenu = AValue;
      if (this.FPopupMenu != null) this.FPopupMenu.FreeNotification(this);
    };
    this.SetShowHint = function (AValue) {
      if (this.FShowHint !== AValue) {
        this.FShowHint = AValue;
        this.FParentShowHint = false;
        this.Changed();
      };
    };
    this.SetTabOrder = function (AValue) {
      if (this.FTabOrder !== AValue) {
        this.FTabOrder = AValue;
        if (this.FParent != null) {
          this.FParent.UpdateTabOrder(this);
        };
      };
    };
    this.SetTabStop = function (AValue) {
      if (this.FTabStop !== AValue) {
        this.FTabStop = AValue;
        this.Changed();
      };
    };
    this.SetText = function (AValue) {
      this.RealSetText(AValue);
    };
    this.SetTop = function (AValue) {
      this.SetBounds(this.FLeft,AValue,this.FWidth,this.FHeight);
    };
    this.SetVisible = function (AValue) {
      if (this.FVisible !== AValue) {
        this.FVisible = AValue;
        this.ReAlign();
      };
    };
    this.SetWidth = function (AValue) {
      this.SetBounds(this.FLeft,this.FTop,AValue,this.FHeight);
    };
    this.SetBorderStyle = function (AValue) {
      if (this.FBorderStyle !== AValue) {
        this.FBorderStyle = AValue;
        this.Changed();
      };
    };
    this.ActionUpdate = function (Sender) {
      if (!(this.FAction != null)) return;
      this.SetEnabled(this.FAction.FEnabled);
      this.SetVisible(this.FAction.FVisible);
      this.SetText(this.FAction.FCaption);
      this.SetHint(this.FAction.FHint);
    };
    this.Click = function () {
      if (this.FAction != null) {
        this.FAction.Execute();
      } else if (this.FOnClick != null) {
        this.FOnClick(this);
      };
    };
    this.DblClick = function () {
      if (this.FOnDblClick != null) {
        this.FOnDblClick(this);
      };
    };
    this.DoDragOver = function (ASource, X, Y, AState) {
      var Result = false;
      Result = false;
      if (this.FOnDragOver != null) this.FOnDragOver(this,ASource,X,Y,AState,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.DoDragDrop = function (ASource, X, Y) {
      if (this.FOnDragDrop != null) this.FOnDragDrop(this,ASource,X,Y);
    };
    this.DoResize = function () {
      if (this.FOnResize != null) {
        this.FOnResize(this);
      };
    };
    this.DoScroll = function () {
      if (this.FOnScroll != null) {
        this.FOnScroll(this);
      };
    };
    this.MouseDown = function (Button, Shift, X, Y) {
      if (this.FOnMouseDown != null) {
        this.FOnMouseDown(this,Button,rtl.refSet(Shift),X,Y);
      };
    };
    this.MouseEnter = function () {
      if (this.FOnMouseEnter != null) {
        this.FOnMouseEnter(this);
      };
    };
    this.MouseLeave = function () {
      if (this.FOnMouseLeave != null) {
        this.FOnMouseLeave(this);
      };
    };
    this.MouseMove = function (Shift, X, Y) {
      if (this.FOnMouseMove != null) {
        this.FOnMouseMove(this,rtl.refSet(Shift),X,Y);
      };
    };
    this.MouseUp = function (Button, Shift, X, Y) {
      if (this.FOnMouseUp != null) {
        this.FOnMouseUp(this,Button,rtl.refSet(Shift),X,Y);
      };
    };
    this.MouseWeel = function (Shift, WheelDelta, MousePos, Handled) {
      if (this.FOnMouseWheel != null) {
        this.FOnMouseWheel(this,rtl.refSet(Shift),WheelDelta,pas.Types.TPoint.$clone(MousePos),Handled);
      };
    };
    this.HandleClick = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.Click();
      Result = true;
      return Result;
    };
    this.HandleContextMenu = function (AEvent) {
      var Result = false;
      Result = false;
      if (!(this.FPopupMenu != null)) return Result;
      AEvent.preventDefault();
      AEvent.stopPropagation();
      this.FPopupMenu.PopupAt(AEvent.clientX,AEvent.clientY);
      Result = true;
      return Result;
    };
    this.HandleDblClick = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.DblClick();
      Result = true;
      return Result;
    };
    this.HandleMouseDown = function (AEvent) {
      var Result = false;
      var VButton = 0;
      var VOffSets = pas.Types.TRect.$new();
      var VShift = {};
      var X = 0;
      var Y = 0;
      VButton = $mod.ExtractMouseButton(AEvent);
      VOffSets.$assign($mod.OffSets(this.FHandleElement));
      VShift = rtl.refSet($mod.ExtractShiftState$1(AEvent));
      X = pas.System.Trunc(AEvent.clientX - VOffSets.Left);
      Y = pas.System.Trunc(AEvent.clientY - VOffSets.Top);
      if ($impl._DragManager != null) $impl._DragManager.SetPointerPos(pas.System.Trunc(AEvent.clientX),pas.System.Trunc(AEvent.clientY));
      AEvent.stopPropagation();
      this.MouseDown(VButton,rtl.refSet(VShift),X,Y);
      Result = true;
      return Result;
    };
    this.HandleMouseEnter = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.MouseEnter();
      Result = true;
      return Result;
    };
    this.HandlePointerDown = function (AEvent) {
      var Result = false;
      var VControl = null;
      var VElement = null;
      Result = false;
      VControl = null;
      if (!($impl._DragManager != null) || !(AEvent != null)) return Result;
      VElement = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
      while ((VElement != null) && (VElement !== this.FHandleElement)) {
        VControl = VElement.__wclControl || null;
        if (VControl != null) return Result;
        VElement = VElement.parentElement;
      };
      if (VElement !== this.FHandleElement) return Result;
      $impl._DragManager.SetPointerId(AEvent);
      $impl._DragManager.SetPointerPos(pas.System.Trunc(AEvent.clientX),pas.System.Trunc(AEvent.clientY));
      if ((this.FDragMode === $mod.TDragMode.dmAutomatic) && (AEvent.button === 0)) $impl._DragManager.StartPending(this,pas.System.Trunc(AEvent.clientX),pas.System.Trunc(AEvent.clientY),5,false);
      return Result;
    };
    this.HandleMouseLeave = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.MouseLeave();
      Result = true;
      return Result;
    };
    this.HandleMouseMove = function (AEvent) {
      var Result = false;
      var VOffSets = pas.Types.TRect.$new();
      var VShift = {};
      var X = 0;
      var Y = 0;
      VOffSets.$assign($mod.OffSets(this.FHandleElement));
      VShift = rtl.refSet($mod.ExtractShiftState$1(AEvent));
      X = pas.System.Trunc(AEvent.clientX - VOffSets.Left);
      Y = pas.System.Trunc(AEvent.clientY - VOffSets.Top);
      AEvent.stopPropagation();
      this.MouseMove(rtl.refSet(VShift),X,Y);
      Result = true;
      return Result;
    };
    this.HandleMouseUp = function (AEvent) {
      var Result = false;
      var VButton = 0;
      var VOffSets = pas.Types.TRect.$new();
      var VShift = {};
      var X = 0;
      var Y = 0;
      VButton = $mod.ExtractMouseButton(AEvent);
      VOffSets.$assign($mod.OffSets(this.FHandleElement));
      VShift = rtl.refSet($mod.ExtractShiftState$1(AEvent));
      X = pas.System.Trunc(AEvent.clientX - VOffSets.Left);
      Y = pas.System.Trunc(AEvent.clientY - VOffSets.Top);
      AEvent.stopPropagation();
      this.MouseUp(VButton,rtl.refSet(VShift),X,Y);
      Result = true;
      return Result;
    };
    this.HandleMouseWheel = function (AEvent) {
      var Result = false;
      var VDelta = 0;
      var VHandled = false;
      var VMousePos = pas.Types.TPoint.$new();
      var VShift = {};
      var VOffSets = pas.Types.TRect.$new();
      VDelta = pas.System.Trunc(-AEvent.deltaY);
      VHandled = false;
      VOffSets.$assign($mod.OffSets(this.FHandleElement));
      VMousePos.$assign(pas.Types.Point(VOffSets.Left,VOffSets.Top));
      VShift = rtl.refSet($mod.ExtractShiftState$1(AEvent));
      AEvent.stopPropagation();
      this.MouseWeel(rtl.refSet(VShift),VDelta,pas.Types.TPoint.$clone(VMousePos),{get: function () {
          return VHandled;
        }, set: function (v) {
          VHandled = v;
        }});
      Result = true;
      return Result;
    };
    this.HandleResize = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.DoResize();
      Result = true;
      return Result;
    };
    this.HandleScroll = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.DoScroll();
      Result = true;
      return Result;
    };
    this.Loaded = function () {
      pas.Classes.TComponent.Loaded.call(this);
      this.FDesignRect.$assign(pas.Types.Rect(this.FLeft,this.FTop,(this.FLeft + this.FWidth) - 1,(this.FTop + this.FHeight) - 1));
      this.Changed();
    };
    this.Notification = function (AComponent, Operation) {
      pas.Classes.TComponent.Notification.call(this,AComponent,Operation);
      if (Operation === pas.Classes.TOperation.opRemove) {
        if (AComponent === this.FPopupMenu) this.FPopupMenu = null;
        if (AComponent === this.FAction) this.FAction = null;
      };
    };
    this.Changed = function () {
      var $Self = this;
      var form = null;
      function AdjustWithPPI(aValue) {
        var Result = 0;
        Result = aValue;
        return Result;
      };
      function FindParentForm() {
        var Result = null;
        var p = null;
        p = $Self.FParent;
        while ((p != null) && !pas.Forms.TCustomForm.isPrototypeOf(p)) p = p.FParent;
        if (pas.Forms.TCustomForm.isPrototypeOf(p)) {
          Result = p}
         else Result = null;
        return Result;
      };
      if (!this.IsUpdating() && rtl.eqSet(rtl.intersectSet(rtl.createSet(pas.Classes.TComponentStateItem.csLoading,pas.Classes.TComponentStateItem.csDestroying),this.FComponentState),{})) {
        form = FindParentForm();
        var $with = this.FHandleElement;
        if (this.FHandleId !== "") {
          $with.setAttribute("id",this.FHandleId);
        } else {
          $with.removeAttribute("id");
        };
        if (this.FHandleClass !== "") {
          $with.setAttribute("class",this.FHandleClass);
        } else {
          $with.removeAttribute("class");
        };
        if ((this.FHandleClass === "") && (this.FHandleId === "")) {
          $with.style.setProperty("color",pas.Graphics.JSColor(this.FFont.FColor));
          $mod.UpdateHtmlElementFont(this.FHandleElement,this.FFont,false);
          if (this.FColor in rtl.createSet(536870912,536870911)) {
            $with.style.removeProperty("background-color");
          } else {
            $with.style.setProperty("background-color",pas.Graphics.JSColor(this.FColor));
          };
        };
        $with.style.setProperty("left",pas.SysUtils.IntToStr(AdjustWithPPI(this.FLeft)) + "px");
        $with.style.setProperty("top",pas.SysUtils.IntToStr(AdjustWithPPI(this.FTop)) + "px");
        $with.style.setProperty("width",pas.SysUtils.IntToStr(AdjustWithPPI(this.FWidth)) + "px");
        $with.style.setProperty("height",pas.SysUtils.IntToStr(AdjustWithPPI(this.FHeight)) + "px");
        $with.style.setProperty("cursor",$mod.JSCursor(this.FCursor));
        if (this.FEnabled) {
          $with.removeAttribute("disabled");
          $with.style.removeProperty("opacity");
        } else {
          $with.setAttribute("disabled","true");
          $with.style.setProperty("opacity","0.5");
        };
        if (this.FVisible) {
          $with.style.setProperty("visibility","visible");
          $with.style.setProperty("display","block");
        } else {
          $with.style.setProperty("visibility","hidden");
          $with.style.setProperty("display","none");
        };
        if ((this.FHint !== "") && this.FShowHint) {
          $with.setAttribute("title",this.FHint);
        } else {
          $with.removeAttribute("title");
        };
        if (this.FBorderStyle === $mod.TFormBorderStyle.bsNone) {
          $with.style.setProperty("border-style","none");
        } else {
          $with.style.removeProperty("border-style");
        };
        $with.setAttribute("tabindex",$mod.IfThen$3(this.FTabStop,"1","-1"));
        $with.style.setProperty("position","absolute");
        $with.style.setProperty("overflow","hidden");
        $with.style.setProperty("-webkit-box-sizing","border-box");
        $with.style.setProperty("-moz-box-sizing","border-box");
        $with.style.setProperty("box-sizing","border-box");
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      throw new Error(pas.SysUtils.Format("%s.CreateHandleElement=nil",pas.System.VarRecs(18,this.$classname)));
      return Result;
    };
    this.RegisterHandleEvents = function () {
      var $with = this.FHandleElement;
      $with.addEventListener("click",rtl.createCallback(this,"HandleClick"));
      $with.addEventListener("contextmenu",rtl.createCallback(this,"HandleContextMenu"));
      $with.addEventListener("dblclick",rtl.createCallback(this,"HandleDblClick"));
      $with.addEventListener("mousedown",rtl.createCallback(this,"HandleMouseDown"));
      $with.addEventListener("mouseenter",rtl.createCallback(this,"HandleMouseEnter"));
      $with.addEventListener("mouseleave",rtl.createCallback(this,"HandleMouseLeave"));
      $with.addEventListener("mousemove",rtl.createCallback(this,"HandleMouseMove"));
      $with.addEventListener("mouseup",rtl.createCallback(this,"HandleMouseUp"));
      $with.addEventListener("pointerdown",rtl.createCallback(this,"HandlePointerDown"));
      $with.addEventListener("scroll",rtl.createCallback(this,"HandleScroll"));
      $with.addEventListener("resize",rtl.createCallback(this,"HandleResize"));
      $with.addEventListener("wheel",rtl.createCallback(this,"HandleMouseWheel"));
    };
    this.UnRegisterHandleEvents = function () {
      var $with = this.FHandleElement;
      $with.removeEventListener("click",rtl.createCallback(this,"HandleClick"));
      $with.removeEventListener("contextmenu",rtl.createCallback(this,"HandleContextMenu"));
      $with.removeEventListener("dblclick",rtl.createCallback(this,"HandleDblClick"));
      $with.removeEventListener("mousedown",rtl.createCallback(this,"HandleMouseDown"));
      $with.removeEventListener("mouseenter",rtl.createCallback(this,"HandleMouseEnter"));
      $with.removeEventListener("mouseleave",rtl.createCallback(this,"HandleMouseLeave"));
      $with.removeEventListener("mousemove",rtl.createCallback(this,"HandleMouseMove"));
      $with.removeEventListener("mouseup",rtl.createCallback(this,"HandleMouseUp"));
      $with.removeEventListener("pointerdown",rtl.createCallback(this,"HandlePointerDown"));
      $with.removeEventListener("scroll",rtl.createCallback(this,"HandleScroll"));
      $with.removeEventListener("resize",rtl.createCallback(this,"HandleResize"));
      $with.removeEventListener("wheel",rtl.createCallback(this,"HandleMouseWheel"));
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.CheckNewParent = function (AParent) {
      if ((AParent != null) && !AParent.CheckChildClassAllowed(this.$class.ClassType())) {
        throw new Error(pas.SysUtils.Format("Control of class '%s' can't have control of class '%s' as a child",pas.System.VarRecs(8,AParent.$class.ClassType(),18,this.$classname)));
      };
      if (pas.Forms.TCustomForm.isPrototypeOf(this) && pas.Forms.TCustomForm.isPrototypeOf(AParent)) {
        throw new Error('A "Form" can\'t have another "Form" as parent');
      };
      if (this === AParent) {
        throw new Error('A "Control" can\'t have itself as a Parent');
      };
    };
    this.RegisterChild = function (AControl) {
      var VIndex = 0;
      if (AControl != null) {
        VIndex = this.FControls.indexOf(AControl);
        if (VIndex < 0) {
          this.FControls.push(AControl);
          if (!this.FHandleElement.contains(AControl.FHandleElement)) {
            this.FHandleElement.appendChild(AControl.FHandleElement);
          };
          this.ReAlign();
          AControl.SetTabOrder(this.FControls.length);
        };
      };
    };
    this.UnRegisterChild = function (AControl) {
      var VIndex = 0;
      if (AControl != null) {
        VIndex = this.FControls.indexOf(AControl);
        if (VIndex >= 0) {
          this.FControls.splice(VIndex,1);
          if (this.FHandleElement.contains(AControl.FHandleElement)) {
            this.FHandleElement.removeChild(AControl.FHandleElement);
          };
          this.ReAlign();
          this.UpdateTabOrder(null);
        };
      };
    };
    var AnchorStr = ["Top","Left","Right","Bottom"];
    this.AlignControls = function () {
      var $Self = this;
      function AnchorsToStr(aAnchors) {
        var Result = "";
        var anchor = 0;
        Result = "";
        for (anchor = 0; anchor <= 3; anchor++) if (anchor in aAnchors) {
          if (Result !== "") Result = Result + ", ";
          Result = Result + AnchorStr[anchor];
        };
        return Result;
      };
      var VControl = null;
      var VSpacing = null;
      var VIndex = 0;
      var VLeft = 0;
      var VTop = 0;
      var VRight = 0;
      var VBotton = 0;
      var VWidth = 0;
      var newleft = 0;
      var newtop = 0;
      var newright = 0;
      var newbottom = 0;
      if ($mod.TControlFlag.cfInAlignControls in this.FControlFlags) return;
      this.FControlFlags = rtl.includeSet(this.FControlFlags,$mod.TControlFlag.cfInAlignControls);
      this.BeginUpdate();
      try {
        VLeft = 0;
        VTop = 0;
        VRight = this.FWidth;
        VBotton = this.FHeight;
        VWidth = this.FWidth;
        for (var $l = 0, $end = this.FControls.length - 1; $l <= $end; $l++) {
          VIndex = $l;
          VControl = rtl.getObject(this.FControls[VIndex]);
          if ((VControl != null) && (VControl.FAlign === $mod.TAlign.alTop) && VControl.FVisible) {
            VControl.BeginUpdate();
            try {
              VSpacing = VControl.FBorderSpacing;
              VControl.SetLeft(VLeft + VSpacing.FLeft + VSpacing.FAround);
              VControl.SetTop(VTop + VSpacing.FTop + VSpacing.FAround);
              VControl.SetWidth(VWidth - VSpacing.FLeft - VSpacing.FRight - (VSpacing.FAround * 2));
              VControl.SetHeight(VControl.FHeight);
            } finally {
              VControl.EndUpdate();
            };
            VTop = VTop + VControl.FHeight + VSpacing.FTop + VSpacing.FBottom + (VSpacing.FAround * 2);
          };
        };
        if (VTop < 0) {
          VTop = 0;
        };
        for (var $l1 = 0, $end1 = this.FControls.length - 1; $l1 <= $end1; $l1++) {
          VIndex = $l1;
          VControl = rtl.getObject(this.FControls[VIndex]);
          if ((VControl != null) && (VControl.FAlign === $mod.TAlign.alBottom) && VControl.FVisible) {
            VControl.BeginUpdate();
            try {
              VSpacing = VControl.FBorderSpacing;
              VControl.SetLeft(VLeft + VSpacing.FLeft + VSpacing.FAround);
              if (!($mod.TAnchorKind.akTop in VControl.FAnchors)) {
                VControl.SetTop(VBotton - VControl.FHeight - VSpacing.FBottom - VSpacing.FAround)}
               else VControl.SetTop(VControl.FTop);
              VControl.SetWidth(VWidth - VSpacing.FLeft - VSpacing.FRight - (VSpacing.FAround * 2));
              if (!($mod.TAnchorKind.akTop in VControl.FAnchors)) {
                VControl.SetHeight(VControl.FHeight)}
               else VControl.SetHeight(VBotton - VControl.FTop);
            } finally {
              VControl.EndUpdate();
            };
            VBotton = VBotton - VControl.FHeight - VSpacing.FTop - VSpacing.FBottom - (VSpacing.FAround * 2);
          };
        };
        if (VBotton < 0) {
          VBotton = 0;
        };
        for (var $l2 = 0, $end2 = this.FControls.length - 1; $l2 <= $end2; $l2++) {
          VIndex = $l2;
          VControl = rtl.getObject(this.FControls[VIndex]);
          if ((VControl != null) && (VControl.FAlign === $mod.TAlign.alLeft) && VControl.FVisible) {
            VControl.BeginUpdate();
            try {
              VSpacing = VControl.FBorderSpacing;
              VControl.SetLeft(VLeft + VSpacing.FLeft + VSpacing.FAround);
              VControl.SetTop(VTop + VSpacing.FTop + VSpacing.FAround);
              VControl.SetWidth(VControl.FWidth);
              VControl.SetHeight(VBotton - VTop - VSpacing.FTop - VSpacing.FBottom - (VSpacing.FAround * 2));
            } finally {
              VControl.EndUpdate();
            };
            VLeft = VLeft + VControl.FWidth + VSpacing.FLeft + VSpacing.FRight + (VSpacing.FAround * 2);
          };
        };
        if (VLeft < 0) {
          VLeft = 0;
        };
        for (var $l3 = 0, $end3 = this.FControls.length - 1; $l3 <= $end3; $l3++) {
          VIndex = $l3;
          VControl = rtl.getObject(this.FControls[VIndex]);
          if ((VControl != null) && (VControl.FAlign === $mod.TAlign.alRight) && VControl.FVisible) {
            VControl.BeginUpdate();
            try {
              VSpacing = VControl.FBorderSpacing;
              if (!($mod.TAnchorKind.akLeft in VControl.FAnchors)) {
                VControl.SetLeft(VRight - VControl.FWidth - VSpacing.FRight - VSpacing.FAround)}
               else VControl.SetLeft(VControl.FLeft);
              VControl.SetTop(VTop + VSpacing.FTop + VSpacing.FAround);
              if (!($mod.TAnchorKind.akLeft in VControl.FAnchors)) {
                VControl.SetWidth(VControl.FWidth)}
               else VControl.SetWidth(VRight - VControl.FLeft);
              VControl.SetHeight(VBotton - VTop - VSpacing.FTop - VSpacing.FBottom - (VSpacing.FAround * 2));
            } finally {
              VControl.EndUpdate();
            };
            VRight = VRight - VControl.FWidth - VSpacing.FLeft - VSpacing.FRight - (VSpacing.FAround * 2);
          };
        };
        if (VRight < 0) {
          VRight = 0;
        };
        for (var $l4 = 0, $end4 = this.FControls.length - 1; $l4 <= $end4; $l4++) {
          VIndex = $l4;
          VControl = rtl.getObject(this.FControls[VIndex]);
          if ((VControl != null) && (VControl.FAlign === $mod.TAlign.alClient) && VControl.FVisible) {
            VControl.BeginUpdate();
            try {
              VSpacing = VControl.FBorderSpacing;
              VControl.SetLeft(VLeft + VSpacing.FLeft + VSpacing.FAround);
              VControl.SetTop(VTop + VSpacing.FTop + VSpacing.FAround);
              VControl.SetWidth(VRight - VLeft - VSpacing.FLeft - VSpacing.FRight - (VSpacing.FAround * 2));
              VControl.SetHeight(VBotton - VTop - VSpacing.FTop - VSpacing.FBottom - (VSpacing.FAround * 2));
            } finally {
              VControl.EndUpdate();
            };
          };
        };
        for (var $l5 = 0, $end5 = this.FControls.length - 1; $l5 <= $end5; $l5++) {
          VIndex = $l5;
          VControl = rtl.getObject(this.FControls[VIndex]);
          if ((VControl != null) && (VControl.FAlign === $mod.TAlign.alNone) && VControl.FVisible && rtl.neSet(VControl.FAnchors,{})) {
            VControl.BeginUpdate();
            try {
              if ($mod.TAnchorKind.akLeft in VControl.FAnchors) newleft = VControl.FLeft;
              if ($mod.TAnchorKind.akTop in VControl.FAnchors) newtop = VControl.FTop;
              if ($mod.TAnchorKind.akBottom in VControl.FAnchors) newbottom = this.FHeight - (this.FDesignRect.Bottom - VControl.FDesignRect.Bottom);
              if ($mod.TAnchorKind.akRight in VControl.FAnchors) newright = this.FWidth - (this.FDesignRect.Right - VControl.FDesignRect.Right);
              if (rtl.leSet(rtl.createSet($mod.TAnchorKind.akLeft,$mod.TAnchorKind.akRight),VControl.FAnchors)) {
                VControl.SetLeft(newleft);
                VControl.SetWidth((newright - newleft) + 1);
              } else if ($mod.TAnchorKind.akLeft in VControl.FAnchors) {
                VControl.SetLeft(newleft)}
               else if ($mod.TAnchorKind.akRight in VControl.FAnchors) VControl.SetLeft(newright - VControl.FWidth);
              if (rtl.leSet(rtl.createSet($mod.TAnchorKind.akTop,$mod.TAnchorKind.akBottom),VControl.FAnchors)) {
                VControl.SetTop(newtop);
                VControl.SetHeight((newbottom - newtop) + 1);
              } else if ($mod.TAnchorKind.akTop in VControl.FAnchors) {
                VControl.SetTop(newtop)}
               else if ($mod.TAnchorKind.akBottom in VControl.FAnchors) VControl.SetTop(newbottom - VControl.FHeight);
            } finally {
              VControl.EndUpdate();
            };
          };
        };
      } finally {
        this.FControlFlags = rtl.excludeSet(this.FControlFlags,$mod.TControlFlag.cfInAlignControls);
        this.EndUpdate();
      };
    };
    this.RealGetText = function () {
      var Result = "";
      Result = this.FCaption;
      return Result;
    };
    this.RealSetText = function (AValue) {
      if (this.FCaption !== AValue) {
        this.FCaption = AValue;
        this.Changed();
      };
    };
    this.BorderSpacingChanged = function (Sender) {
      if (this.FParent != null) {
        this.FParent.AlignControls();
      };
    };
    this.ColorChanged = function (Sender) {
      this.Changed();
    };
    this.ConstraintsChanged = function (Sender) {
      this.SetBounds(this.FLeft,this.FTop,this.FWidth,this.FHeight);
    };
    this.FontChanged = function (Sender) {
      this.Changed();
    };
    this.TabOrderArray = function () {
      var Result = null;
      Result = this.FControls.slice(0).sort(rtl.createCallback(this,"CompareTabOrder"));
      return Result;
    };
    this.CompareTabOrder = function (A, B) {
      var Result = 0;
      if (pas.System.Assigned(A) && pas.System.Assigned(B) && rtl.isExt(A,$mod.TControl,1) && rtl.isExt(B,$mod.TControl,1)) {
        Result = rtl.getObject(A).FTabOrder - rtl.getObject(B).FTabOrder;
      } else {
        Result = 0;
      };
      return Result;
    };
    this.UpdateTabOrder = function (AValue) {
      var VControl = null;
      var VArray = null;
      var VIndex = 0;
      if (AValue != null) {
        for (var $l = 0, $end = this.FControls.length - 1; $l <= $end; $l++) {
          VIndex = $l;
          VControl = rtl.getObject(this.FControls[VIndex]);
          if ((VControl != null) && (VControl !== AValue) && (VControl.FTabOrder >= AValue.FTabOrder)) {
            VControl.FTabOrder += 1;
          };
        };
      };
      VArray = this.TabOrderArray();
      try {
        for (var $l1 = 0, $end1 = VArray.length - 1; $l1 <= $end1; $l1++) {
          VIndex = $l1;
          VControl = rtl.getObject(VArray[VIndex]);
          if (VControl != null) {
            VControl.BeginUpdate();
            try {
              VControl.FTabOrder = VIndex;
            } finally {
              VControl.EndUpdate();
            };
          };
        };
      } finally {
        VArray.length = 0;
      };
    };
    this.SetParentComponent = function (AValue) {
      if ($mod.TWinControl.isPrototypeOf(AValue)) this.SetParent(AValue);
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 75;
      Result.cy = 50;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      var sz = pas.Types.TSize.$new();
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      $impl._RegisterWCLDragRules();
      this.FHandleElement = this.CreateHandleElement();
      this.FHandleClass = "";
      this.FHandleId = "";
      this.FHandleElement.__wclControl = this;
      this.RegisterHandleEvents();
      this.FControls = new Array();
      this.FBorderSpacing = $mod.TControlBorderSpacing.$create("Create$1");
      this.FBorderSpacing.FOnChange = rtl.createCallback(this,"BorderSpacingChanged");
      this.FConstraints = $mod.TSizeConstraints.$create("Create$1");
      this.FConstraints.FOnChange = rtl.createCallback(this,"ConstraintsChanged");
      this.FBorderStyle = $mod.TFormBorderStyle.bsSingle;
      this.FFont = pas.Graphics.TFont.$create("Create$1");
      this.FFont.FOnChange = rtl.createCallback(this,"FontChanged");
      this.FAlign = $mod.TAlign.alNone;
      this.FAnchors = rtl.createSet($mod.TAnchorKind.akLeft,$mod.TAnchorKind.akTop);
      this.FAutoSize = false;
      this.FCaption = "";
      this.FColor = 536870912;
      this.FCursor = 0;
      this.FDragKind = $mod.TDragKind.dkDrag;
      this.FDragMode = $mod.TDragMode.dmManual;
      this.FOnDragDrop = null;
      this.FOnDragOver = null;
      this.FOnEndDrag = null;
      this.FOnStartDrag = null;
      sz.$assign(this.$class.GetControlClassDefaultSize());
      this.FDesignRect.$assign(pas.Types.Rect(0,0,sz.cx - 1,sz.cy - 1));
      this.FEnabled = true;
      this.FLeft = 0;
      this.FParent = null;
      this.FParentColor = false;
      this.FParentFont = true;
      this.FParentShowHint = true;
      this.FShowHint = false;
      this.FTabOrder = 0;
      this.FTabStop = true;
      this.FTop = 0;
      this.FUpdateCount = 0;
      this.FVisible = true;
      return this;
    };
    this.Destroy = function () {
      if (($impl._DragManager != null) && ($impl._DragManager.FSource === this)) $impl._DragManager.EndDrag(false);
      if (this.FHandleElement != null) {
        this.FHandleElement.__wclControl = null;
        this.UnRegisterHandleEvents();
      };
      if (this.FParent != null) {
        this.FParent.UnRegisterChild(this);
      };
      if (this.FControls != null) this.FControls.length = 0;
      rtl.free(this,"FBorderSpacing");
      this.FBorderSpacing = null;
      rtl.free(this,"FConstraints");
      this.FConstraints = null;
      rtl.free(this,"FFont");
      this.FFont = null;
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.BeginUpdate = function () {
      this.FUpdateCount += 1;
    };
    this.EndUpdate = function () {
      if (this.FUpdateCount > 0) {
        this.FUpdateCount -= 1;
        if (this.FUpdateCount === 0) {
          this.Changed();
        };
      };
    };
    this.AdjustSize = function () {
    };
    this.IsParentOf = function (AControl) {
      var Result = false;
      Result = false;
      while (AControl != null) {
        AControl = AControl.FParent;
        if (this === AControl) {
          Result = true;
          return Result;
        };
      };
      return Result;
    };
    this.IsUpdating = function () {
      var Result = false;
      Result = this.FUpdateCount > 0;
      return Result;
    };
    this.GetTopParent = function () {
      var Result = null;
      Result = this;
      while (Result.FParent != null) {
        Result = Result.FParent;
      };
      return Result;
    };
    this.HasParent = function () {
      var Result = false;
      Result = this.FParent !== null;
      return Result;
    };
    this.Invalidate = function () {
    };
    this.ReAlign = function () {
      this.AlignControls();
      if (this.FParent != null) {
        this.FParent.ReAlign();
      };
      this.Invalidate();
    };
    this.BringToFront = function () {
      var VParentElement = null;
      VParentElement = this.FHandleElement.parentElement;
      if (VParentElement != null) {
        VParentElement.removeChild(this.FHandleElement);
        VParentElement.appendChild(this.FHandleElement);
      };
    };
    this.SendToBack = function () {
      var VNode = null;
      var VParentElement = null;
      var VIndex = 0;
      VParentElement = this.FHandleElement.parentElement;
      if (VParentElement != null) {
        for (var $l = 0, $end = VParentElement.childNodes.length - 1; $l <= $end; $l++) {
          VIndex = $l;
          VNode = VParentElement.childNodes.item(VIndex);
          if (!rtl.isExt(VNode,HTMLCanvasElement)) {
            VParentElement.removeChild(this.FHandleElement);
            VParentElement.insertBefore(this.FHandleElement,VParentElement.childNodes.item(VIndex));
            return;
          };
        };
      };
    };
    this.SetBounds = function (ALeft, ATop, AWidth, AHeight) {
      if (AWidth < 0) AWidth = 0;
      if (AHeight < 0) AHeight = 0;
      if (this.FConstraints != null) {
        if ((this.FConstraints.FMinWidth > 0) && (AWidth < this.FConstraints.FMinWidth)) AWidth = this.FConstraints.FMinWidth;
        if ((this.FConstraints.FMaxWidth > 0) && (AWidth > this.FConstraints.FMaxWidth)) AWidth = this.FConstraints.FMaxWidth;
        if ((this.FConstraints.FMinHeight > 0) && (AHeight < this.FConstraints.FMinHeight)) AHeight = this.FConstraints.FMinHeight;
        if ((this.FConstraints.FMaxHeight > 0) && (AHeight > this.FConstraints.FMaxHeight)) AHeight = this.FConstraints.FMaxHeight;
      };
      if ((this.FLeft !== ALeft) || (this.FTop !== ATop) || (this.FWidth !== AWidth) || (this.FHeight !== AHeight)) {
        this.FLeft = ALeft;
        this.FTop = ATop;
        this.FWidth = AWidth;
        this.FHeight = AHeight;
        this.Changed();
        this.ReAlign();
      };
    };
    this.BeginDrag = function (Immediate, Threshold) {
      if ($impl._DragManager != null) $impl._DragManager.StartPending(this,$impl._DragManager.FPointerX,$impl._DragManager.FPointerY,Threshold,Immediate);
    };
    this.EndDrag = function (Drop) {
      if (($impl._DragManager != null) && ($impl._DragManager.FSource === this)) $impl._DragManager.EndDrag(Drop);
    };
    this.GetDragging = function () {
      var Result = false;
      Result = ($impl._DragManager != null) && $impl._DragManager.FDragging && ($impl._DragManager.FSource === this);
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Constraints",2,$mod.$rtti["TSizeConstraints"],"FConstraints","SetConstraints");
    $r.addProperty("Cursor",2,$mod.$rtti["TCursor"],"FCursor","SetCursor");
    $r.addProperty("Action",2,$mod.$rtti["TBasicAction"],"FAction","SetAction");
    $r.addProperty("Dragging",1,rtl.boolean,"GetDragging","");
    $r.addProperty("DragKind",0,$mod.$rtti["TDragKind"],"FDragKind","FDragKind",{Default: $mod.TDragKind.dkDrag});
    $r.addProperty("DragMode",0,$mod.$rtti["TDragMode"],"FDragMode","FDragMode",{Default: $mod.TDragMode.dmManual});
    $r.addProperty("OnDragDrop",0,$mod.$rtti["TDragDropEvent"],"FOnDragDrop","FOnDragDrop");
    $r.addProperty("OnDragOver",0,$mod.$rtti["TDragOverEvent"],"FOnDragOver","FOnDragOver");
    $r.addProperty("OnEndDrag",0,$mod.$rtti["TEndDragEvent"],"FOnEndDrag","FOnEndDrag");
    $r.addProperty("OnStartDrag",0,$mod.$rtti["TStartDragEvent"],"FOnStartDrag","FOnStartDrag");
    $r.addProperty("PopupMenu",2,$mod.$rtti["TCustomPopupMenu"],"FPopupMenu","SetPopupMenu");
    $r.addProperty("Left",2,rtl.nativeint,"FLeft","SetLeft");
    $r.addProperty("Height",2,rtl.nativeint,"FHeight","SetHeight");
    $r.addProperty("Hint",2,rtl.string,"FHint","SetHint");
    $r.addProperty("Top",2,rtl.nativeint,"FTop","SetTop");
    $r.addProperty("Width",2,rtl.nativeint,"FWidth","SetWidth");
  });
  rtl.createClass(this,"TBasicActionClient",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.Client = null;
      this.Update = null;
    };
    this.$final = function () {
      this.Client = undefined;
      this.Update = undefined;
      pas.System.TObject.$final.call(this);
    };
  });
  rtl.createClass(this,"TBasicAction",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FCaption = "";
      this.FChecked = false;
      this.FClients = null;
      this.FEnabled = false;
      this.FHint = "";
      this.FShortCut = 0;
      this.FVisible = false;
      this.FOnUpdate = null;
    };
    this.$final = function () {
      this.FClients = undefined;
      this.FOnUpdate = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.SetCaption = function (AValue) {
      if (this.FCaption !== AValue) {
        this.FCaption = AValue;
        this.DoChanged();
      };
    };
    this.SetChecked = function (AValue) {
      if (this.FChecked !== AValue) {
        this.FChecked = AValue;
        this.DoChanged();
      };
    };
    this.SetEnabled = function (AValue) {
      if (this.FEnabled !== AValue) {
        this.FEnabled = AValue;
        this.DoChanged();
      };
    };
    this.SetHint = function (AValue) {
      if (this.FHint !== AValue) {
        this.FHint = AValue;
        this.DoChanged();
      };
    };
    this.SetShortCut = function (AValue) {
      if (this.FShortCut !== AValue) {
        this.FShortCut = AValue;
        this.DoChanged();
      };
    };
    this.SetVisible = function (AValue) {
      if (this.FVisible !== AValue) {
        this.FVisible = AValue;
        this.DoChanged();
      };
    };
    this.DoChanged = function () {
      var VClient = null;
      var VIndex = 0;
      if (!(this.FClients != null)) return;
      for (var $l = this.FClients.FLength - 1; $l >= 0; $l--) {
        VIndex = $l;
        VClient = this.FClients.GetItem(VIndex);
        if ((VClient != null) && (VClient.Update != null)) VClient.Update(this);
      };
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FCaption = "";
      this.FChecked = false;
      this.FClients = pas["Generics.Collections"].TList$G4.$create("Create$1");
      this.FEnabled = true;
      this.FHint = "";
      this.FShortCut = 0;
      this.FVisible = true;
      this.FOnUpdate = null;
      return this;
    };
    this.Destroy = function () {
      var VClient = null;
      var VIndex = 0;
      if (this.FClients != null) {
        for (var $l = 0, $end = this.FClients.FLength - 1; $l <= $end; $l++) {
          VIndex = $l;
          VClient = this.FClients.GetItem(VIndex);
          VClient = rtl.freeLoc(VClient);
        };
        rtl.free(this,"FClients");
        this.FClients = null;
      };
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.Execute = function () {
      var Result = false;
      Result = false;
      return Result;
    };
    this.Update = function () {
      if (this.FOnUpdate != null) this.FOnUpdate(this);
      this.DoChanged();
    };
    this.RegisterClient = function (AClient, AUpdate) {
      var VClient = null;
      var VIndex = 0;
      if (!(AClient != null)) return;
      for (var $l = 0, $end = this.FClients.FLength - 1; $l <= $end; $l++) {
        VIndex = $l;
        VClient = this.FClients.GetItem(VIndex);
        if (VClient.Client === AClient) {
          VClient.Update = AUpdate;
          return;
        };
      };
      VClient = $mod.TBasicActionClient.$create("Create");
      VClient.Client = AClient;
      VClient.Update = AUpdate;
      this.FClients.Add(VClient);
      AClient.FreeNotification(this);
    };
    this.UnregisterClient = function (AClient) {
      var VClient = null;
      var VIndex = 0;
      if (!(AClient != null)) return;
      for (var $l = this.FClients.FLength - 1; $l >= 0; $l--) {
        VIndex = $l;
        if (this.FClients.GetItem(VIndex).Client === AClient) {
          AClient.RemoveFreeNotification(this);
          VClient = this.FClients.GetItem(VIndex);
          VClient = rtl.freeLoc(VClient);
          this.FClients.Delete(VIndex);
          return;
        };
      };
    };
    this.Notification = function (AComponent, Operation) {
      pas.Classes.TComponent.Notification.call(this,AComponent,Operation);
      if (Operation === pas.Classes.TOperation.opRemove) this.UnregisterClient(AComponent);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Caption",2,rtl.string,"FCaption","SetCaption");
    $r.addProperty("Checked",2,rtl.boolean,"FChecked","SetChecked",{Default: false});
    $r.addProperty("Enabled",2,rtl.boolean,"FEnabled","SetEnabled",{Default: true});
    $r.addProperty("Hint",2,rtl.string,"FHint","SetHint");
    $r.addProperty("ShortCut",2,rtl.word,"FShortCut","SetShortCut",{Default: 0});
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible",{Default: true});
    $r.addProperty("OnUpdate",0,pas.Classes.$rtti["TNotifyEvent"],"FOnUpdate","FOnUpdate");
  });
  rtl.createClass(this,"TWinControl",this.TControl,function () {
    this.$init = function () {
      $mod.TControl.$init.call(this);
      this.FOnEnter = null;
      this.FOnExit = null;
      this.FOnKeyDown = null;
      this.FOnKeyPress = null;
      this.FOnKeyUp = null;
    };
    this.$final = function () {
      this.FOnEnter = undefined;
      this.FOnExit = undefined;
      this.FOnKeyDown = undefined;
      this.FOnKeyPress = undefined;
      this.FOnKeyUp = undefined;
      $mod.TControl.$final.call(this);
    };
    this.GetControl = function (AIndex) {
      var Result = null;
      Result = rtl.getObject(this.FControls[AIndex]);
      return Result;
    };
    this.GetControlCount = function () {
      var Result = 0;
      Result = this.FControls.length;
      return Result;
    };
    this.GetControlIndex = function (AControl) {
      var Result = 0;
      Result = this.FControls.indexOf(AControl);
      return Result;
    };
    this.DoEnter = function () {
      if (this.FOnEnter != null) {
        this.FOnEnter(this);
      };
    };
    this.DoExit = function () {
      if (this.FOnExit != null) {
        this.FOnExit(this);
      };
    };
    this.KeyDown = function (Key, Shift) {
      if (this.FOnKeyDown != null) {
        this.FOnKeyDown(this,Key,rtl.refSet(Shift));
      };
    };
    this.KeyPress = function (Key) {
      if (this.FOnKeyPress != null) {
        this.FOnKeyPress(this,Key);
      };
    };
    this.KeyUp = function (Key, Shift) {
      if (this.FOnKeyUp != null) {
        this.FOnKeyUp(this,Key,rtl.refSet(Shift));
      };
    };
    this.HandleEnter = function (AEvent) {
      var Result = false;
      var VParent = null;
      VParent = this.FParent;
      while (VParent != null) {
        if (pas.Forms.TCustomForm.isPrototypeOf(VParent)) {
          VParent.SetActiveControl(this);
          break;
        };
        VParent = VParent.FParent;
      };
      AEvent.stopPropagation();
      this.DoEnter();
      Result = true;
      return Result;
    };
    this.HandleExit = function (AEvent) {
      var Result = false;
      AEvent.stopPropagation();
      this.DoExit();
      Result = true;
      return Result;
    };
    this.HandleKeyDown = function (AEvent) {
      var Result = false;
      var VControl = null;
      var VForm = null;
      var VKey = 0;
      var VParent = null;
      var VShift = {};
      VParent = this.FParent;
      while (VParent != null) {
        if (pas.Forms.TCustomForm.isPrototypeOf(VParent)) {
          VForm = VParent;
          if (VForm.FKeyPreview && VForm.HandleKeyDown(AEvent)) {
            Result = true;
            return Result;
          };
        };
        VParent = VParent.FParent;
      };
      VKey = $mod.ExtractKeyCode(AEvent);
      VShift = rtl.refSet($mod.ExtractShiftState(AEvent));
      AEvent.stopPropagation();
      this.KeyDown({get: function () {
          return VKey;
        }, set: function (v) {
          VKey = v;
        }},rtl.refSet(VShift));
      if (VKey === 0) {
        AEvent.preventDefault();
      } else {
        var $tmp = VKey;
        if ($tmp === 9) {
          if (this.FParent != null) {
            if ($mod.TShiftStateEnum.ssShift in VShift) {
              VControl = this.FParent.FindFocusControl(this,$mod.TFocusSearchDirection.fsdPrev);
              if (!(VControl != null)) {
                VControl = this.FParent.FindFocusControl(null,$mod.TFocusSearchDirection.fsdLast);
              };
            } else {
              VControl = this.FParent.FindFocusControl(this,$mod.TFocusSearchDirection.fsdNext);
              if (!(VControl != null)) {
                VControl = this.FParent.FindFocusControl(null,$mod.TFocusSearchDirection.fsdFirst);
              };
            };
            if ((VControl != null) && VControl.CanSetFocus()) {
              VControl.SetFocus();
            };
            AEvent.preventDefault();
          };
        };
      };
      Result = true;
      return Result;
    };
    this.HandleKeyUp = function (AEvent) {
      var Result = false;
      var VForm = null;
      var VKey = 0;
      var VParent = null;
      var VShift = {};
      VParent = this.FParent;
      while (VParent != null) {
        if (pas.Forms.TCustomForm.isPrototypeOf(VParent)) {
          VForm = VParent;
          if (VForm.FKeyPreview && VForm.HandleKeyUp(AEvent)) {
            Result = true;
            return Result;
          };
        };
        VParent = VParent.FParent;
      };
      VKey = $mod.ExtractKeyCode(AEvent);
      VShift = rtl.refSet($mod.ExtractShiftState(AEvent));
      AEvent.stopPropagation();
      this.KeyUp({get: function () {
          return VKey;
        }, set: function (v) {
          VKey = v;
        }},rtl.refSet(VShift));
      if (VKey === 0) {
        AEvent.preventDefault();
      };
      Result = true;
      return Result;
    };
    this.HandleKeyPress = function (AEvent) {
      var Result = false;
      var VForm = null;
      var VKey = "\x00";
      var VParent = null;
      VParent = this.FParent;
      while (VParent != null) {
        if (pas.Forms.TCustomForm.isPrototypeOf(VParent)) {
          VForm = VParent;
          if (VForm.FKeyPreview && VForm.HandleKeyPress(AEvent)) {
            Result = true;
            return Result;
          };
        };
        VParent = VParent.FParent;
      };
      AEvent.stopPropagation();
      VKey = $mod.ExtractKeyChar(AEvent);
      if (VKey === "\x00") {
        AEvent.preventDefault();
      } else {
        this.KeyPress({get: function () {
            return VKey;
          }, set: function (v) {
            VKey = v;
          }});
        if (VKey === "\x00") {
          AEvent.preventDefault();
        };
      };
      Result = true;
      return Result;
    };
    this.RegisterHandleEvents = function () {
      $mod.TControl.RegisterHandleEvents.call(this);
      var $with = this.FHandleElement;
      $with.addEventListener("focus",rtl.createCallback(this,"HandleEnter"));
      $with.addEventListener("blur",rtl.createCallback(this,"HandleExit"));
      $with.addEventListener("keydown",rtl.createCallback(this,"HandleKeyDown"));
      $with.addEventListener("keypress",rtl.createCallback(this,"HandleKeyPress"));
      $with.addEventListener("keyup",rtl.createCallback(this,"HandleKeyUp"));
    };
    this.UnRegisterHandleEvents = function () {
      $mod.TControl.UnRegisterHandleEvents.call(this);
      var $with = this.FHandleElement;
      $with.removeEventListener("focus",rtl.createCallback(this,"HandleEnter"));
      $with.removeEventListener("blur",rtl.createCallback(this,"HandleExit"));
      $with.removeEventListener("keydown",rtl.createCallback(this,"HandleKeyDown"));
      $with.removeEventListener("keypress",rtl.createCallback(this,"HandleKeyPress"));
      $with.removeEventListener("keyup",rtl.createCallback(this,"HandleKeyUp"));
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = (AChildClass != null) && AChildClass.InheritsFrom($mod.TControl);
      return Result;
    };
    this.FindFocusControl = function (AStartControl, ADirection) {
      var Result = null;
      var VControl = null;
      var VArray = null;
      var VIndex = 0;
      var VTabOrder = 0;
      Result = null;
      VArray = this.TabOrderArray();
      if (VArray.length === 0) {
        return Result;
      };
      try {
        VTabOrder = VArray.indexOf(AStartControl);
        if (VTabOrder < 0) {
          if (ADirection in rtl.createSet($mod.TFocusSearchDirection.fsdFirst)) {
            VTabOrder = VArray.length - 1;
          } else {
            VTabOrder = 0;
          };
        };
        var $tmp = ADirection;
        if ($tmp === $mod.TFocusSearchDirection.fsdFirst) {
          VControl = rtl.getObject(VArray[0]);
          if ((VControl != null) && $mod.TWinControl.isPrototypeOf(VControl) && VControl.FEnabled && VControl.FVisible && VControl.FTabStop) {
            return VControl;
          };
        } else if ($tmp === $mod.TFocusSearchDirection.fsdLast) {
          VControl = rtl.getObject(VArray[VArray.length - 1]);
          if ((VControl != null) && $mod.TWinControl.isPrototypeOf(VControl) && VControl.FEnabled && VControl.FVisible && VControl.FTabStop) {
            return VControl;
          };
        } else if ($tmp === $mod.TFocusSearchDirection.fsdNext) {
          if (VTabOrder < (VArray.length - 1)) {
            for (var $l = VTabOrder + 1, $end = VArray.length - 1; $l <= $end; $l++) {
              VIndex = $l;
              VControl = rtl.getObject(VArray[VIndex]);
              if ((VControl != null) && $mod.TWinControl.isPrototypeOf(VControl) && VControl.FEnabled && VControl.FVisible && VControl.FTabStop) {
                return VControl;
              };
            };
          };
        } else if ($tmp === $mod.TFocusSearchDirection.fsdPrev) {
          if (VTabOrder > 0) {
            for (var $l1 = VTabOrder - 1; $l1 >= 0; $l1--) {
              VIndex = $l1;
              VControl = rtl.getObject(VArray[VIndex]);
              if ((VControl != null) && $mod.TWinControl.isPrototypeOf(VControl) && VControl.FEnabled && VControl.FVisible && VControl.FTabStop) {
                return VControl;
              };
            };
          };
        };
      } finally {
        VArray.length = 0;
      };
      return Result;
    };
    this.Focused = function () {
      var Result = false;
      Result = this.FHandleElement === document.activeElement;
      return Result;
    };
    this.CanSetFocus = function () {
      var Result = false;
      var VControl = null;
      VControl = this;
      while (true) {
        if (!VControl.FVisible && VControl.FEnabled) {
          Result = false;
          return Result;
        };
        if (VControl.FParent != null) {
          VControl = VControl.FParent;
        } else {
          break;
        };
      };
      Result = (VControl != null) && pas.Forms.TCustomForm.isPrototypeOf(VControl);
      return Result;
    };
    this.SetFocus = function () {
      this.FHandleElement.focus();
    };
    this.ContainsControl = function (AControl) {
      var Result = false;
      Result = this.FControls.indexOf(AControl) > -1;
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  rtl.createClass(this,"TCustomControl",this.TWinControl,function () {
    this.$init = function () {
      $mod.TWinControl.$init.call(this);
      this.FCanvas = null;
      this.FOnPaint = null;
    };
    this.$final = function () {
      this.FCanvas = undefined;
      this.FOnPaint = undefined;
      $mod.TWinControl.$final.call(this);
    };
    this.GetCanvas = function () {
      var Result = null;
      if (!(this.FCanvas != null)) {
        this.FCanvas = $mod.TControlCanvas.$create("Create$2",[this]);
      };
      Result = this.FCanvas;
      return Result;
    };
    this.ColorChanged = function (Sender) {
      if (this.FCanvas != null) {
        this.FCanvas.FBrush.SetColor(this.FColor);
      };
      $mod.TControl.ColorChanged.call(this,Sender);
    };
    this.FontChanged = function (Sender) {
      if (this.FCanvas != null) {
        this.FCanvas.FFont.Assign(this.FFont);
      };
      $mod.TControl.FontChanged.call(this,Sender);
    };
    this.Changed = function () {
      $mod.TControl.Changed.call(this);
      if (!this.IsUpdating() && rtl.eqSet(rtl.intersectSet(rtl.createSet(pas.Classes.TComponentStateItem.csLoading,pas.Classes.TComponentStateItem.csDestroying),this.FComponentState),{})) {
        this.Invalidate();
      };
    };
    this.Paint = function () {
      if (this.FOnPaint != null) {
        this.FOnPaint(this);
      };
    };
    this.Destroy = function () {
      if (this.FCanvas != null) {
        this.FCanvas.$destroy("Destroy");
        this.FCanvas = null;
      };
      $mod.TControl.Destroy.call(this);
    };
    this.Invalidate = function () {
      $mod.TControl.Invalidate.call(this);
      this.Paint();
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  this.AnchorAlign$a$clone = function (a) {
    var b = [];
    b.length = 7;
    for (var c = 0; c < 7; c++) b[c] = rtl.refSet(a[c]);
    return b;
  };
  this.$rtti.$StaticArray("AnchorAlign$a",{dims: [7], eltype: this.$rtti["TAnchors"]});
  this.AnchorAlign = [rtl.createSet(this.TAnchorKind.akLeft,this.TAnchorKind.akTop),rtl.createSet(this.TAnchorKind.akLeft,this.TAnchorKind.akTop,this.TAnchorKind.akRight),rtl.createSet(this.TAnchorKind.akLeft,this.TAnchorKind.akRight,this.TAnchorKind.akBottom),rtl.createSet(this.TAnchorKind.akLeft,this.TAnchorKind.akTop,this.TAnchorKind.akBottom),rtl.createSet(this.TAnchorKind.akRight,this.TAnchorKind.akTop,this.TAnchorKind.akBottom),rtl.createSet(this.TAnchorKind.akLeft,this.TAnchorKind.akTop,this.TAnchorKind.akRight,this.TAnchorKind.akBottom),rtl.createSet(this.TAnchorKind.akLeft,this.TAnchorKind.akTop)];
  this.CompareString = function (A, B) {
    return A.localeCompare(B, undefined, { numeric: true, sensitivity: 'base' });
  };
  this.CompareValues = function (A, B) {
    var Result = 0;
    if ((typeof(A) === "string") && (typeof(B) === "string")) {
      Result = $mod.CompareString("" + A,"" + B);
    } else if ((typeof(A) === "number") && (typeof(B) === "number")) {
      Result = pas.Math.CompareValue$3(rtl.getNumber(A),rtl.getNumber(B),0.0);
    } else if ((typeof(A) === "boolean") && (typeof(B) === "boolean")) {
      if (!(A == false) === !(B == false)) {
        Result = 0;
      } else if (!(A == false)) {
        Result = 1;
      } else {
        Result = -1;
      };
    } else {
      Result = 0;
    };
    return Result;
  };
  this.IfThen = function (AExpression, AConsequence, AAlternative) {
    var Result = false;
    if (AExpression) {
      Result = AConsequence;
    } else {
      Result = AAlternative;
    };
    return Result;
  };
  this.IfThen$1 = function (AExpression, AConsequence, AAlternative) {
    var Result = 0.0;
    if (AExpression) {
      Result = AConsequence;
    } else {
      Result = AAlternative;
    };
    return Result;
  };
  this.IfThen$2 = function (AExpression, AConsequence, AAlternative) {
    var Result = 0;
    if (AExpression) {
      Result = AConsequence;
    } else {
      Result = AAlternative;
    };
    return Result;
  };
  this.IfThen$3 = function (AExpression, AConsequence, AAlternative) {
    var Result = "";
    if (AExpression) {
      Result = AConsequence;
    } else {
      Result = AAlternative;
    };
    return Result;
  };
  this.ScrollbarWidth = function () {
    var Result = 0;
    var VDiv = null;
    VDiv = document.createElement("div");
    VDiv.style.setProperty("with","100");
    VDiv.style.setProperty("height","100");
    VDiv.style.setProperty("position","absolute");
    VDiv.style.setProperty("top","-9999");
    VDiv.style.setProperty("overflow","scroll");
    VDiv.style.setProperty("-ms-overflow-style","scrollbar");
    document.body.appendChild(VDiv);
    Result = Math.round(VDiv.offsetWidth - VDiv.clientWidth);
    if (Result < 0) {
      Result = 0;
    };
    document.body.removeChild(VDiv);
    return Result;
  };
  this.OffSets = function (AElement) {
    var Result = pas.Types.TRect.$new();
    Result.$assign(pas.Types.Rect(0,0,0,0));
    if (AElement != null) {
      var $with = AElement.getBoundingClientRect();
      Result.Left = pas.System.Trunc($with.left + window.scrollX);
      Result.Top = pas.System.Trunc($with.top + window.scrollY);
    };
    return Result;
  };
  this.UpdateHtmlElementFont = function (AElement, AFont, AClear) {
    var s = "";
    var $with = AElement.style;
    if (AClear) {
      $with.removeProperty("font-family");
      $with.removeProperty("font-size");
      $with.removeProperty("font-weight");
      $with.removeProperty("font-style");
      $with.removeProperty("text-decoration");
    } else {
      $with.setProperty("font-family",AFont.FName);
      $with.setProperty("font-size",pas.SysUtils.IntToStr(AFont.FSize) + "pt");
      if (pas.Graphics.TFontStyle.fsBold in AFont.FStyle) {
        $with.setProperty("font-weight","bold")}
       else $with.setProperty("font-weight","");
      $with.setProperty("font-style","normal");
      s = "";
      if (pas.Graphics.TFontStyle.fsItalic in AFont.FStyle) s = "italic";
      if (pas.Graphics.TFontStyle.fsUnderline in AFont.FStyle) {
        if (s !== "") s = s + " ";
        s = s + "underline";
      };
      if (pas.Graphics.TFontStyle.fsStrikeOut in AFont.FStyle) {
        if (s !== "") s = s + " ";
        s = s + "line-through";
      };
      if (s !== "") {
        $with.setProperty("text-decoration",s)}
       else $with.removeProperty("text-decoration");
    };
  };
  this.ExtractKeyCode = function (AEvent) {
    var Result = 0;
    var VLocation = 0;
    var VKey = "";
    VLocation = AEvent.location;
    VKey = "";
    if (AEvent.key != null) VKey = AEvent.key;
    VKey = pas.SysUtils.LowerCase(VKey);
    Result = -1;
    var $tmp = VKey;
    if ($tmp === "backspace") {
      Result = 8}
     else if ($tmp === "tab") {
      Result = 9}
     else if ($tmp === "enter") {
      Result = 13}
     else if ($tmp === "shift") {
      Result = 16}
     else if ($tmp === "control") {
      Result = 17}
     else if ($tmp === "alt") {
      Result = 18}
     else if ($tmp === "altgraph") {
      Result = 18}
     else if ($tmp === "pause") {
      Result = 19}
     else if ($tmp === "capslock") {
      Result = 20}
     else if ($tmp === "escape") {
      Result = 27}
     else if ($tmp === "pageup") {
      Result = 33}
     else if ($tmp === "pagedown") {
      Result = 34}
     else if ($tmp === " ") {
      Result = 32}
     else if ($tmp === "end") {
      Result = 35}
     else if ($tmp === "home") {
      Result = 36}
     else if ($tmp === "arrowleft") {
      Result = 37}
     else if ($tmp === "arrowup") {
      Result = 38}
     else if ($tmp === "arrowright") {
      Result = 39}
     else if ($tmp === "arrowdown") {
      Result = 40}
     else if ($tmp === "insert") {
      Result = 45}
     else if ($tmp === "delete") {
      Result = 46}
     else if ($tmp === "f1") {
      Result = 112}
     else if ($tmp === "f2") {
      Result = 113}
     else if ($tmp === "f3") {
      Result = 114}
     else if ($tmp === "f4") {
      Result = 115}
     else if ($tmp === "f5") {
      Result = 116}
     else if ($tmp === "f6") {
      Result = 117}
     else if ($tmp === "f7") {
      Result = 118}
     else if ($tmp === "f8") {
      Result = 119}
     else if ($tmp === "f9") {
      Result = 120}
     else if ($tmp === "f10") {
      Result = 121}
     else if ($tmp === "f11") {
      Result = 122}
     else if ($tmp === "f12") {
      Result = 123}
     else if ($tmp === "f13") {
      Result = 124}
     else if ($tmp === "f14") {
      Result = 125}
     else if ($tmp === "f15") {
      Result = 126}
     else if ($tmp === "f16") {
      Result = 127}
     else if ($tmp === "f17") {
      Result = 128}
     else if ($tmp === "f18") {
      Result = 129}
     else if ($tmp === "f19") {
      Result = 130}
     else if ($tmp === "f20") {
      Result = 131}
     else if ($tmp === "numlock") {
      Result = 144}
     else if ($tmp === "scrolllock") Result = 145;
    if (VLocation === 3) {
      var $tmp1 = VKey;
      if ($tmp1 === "0") {
        Result = 96}
       else if ($tmp1 === "1") {
        Result = 97}
       else if ($tmp1 === "2") {
        Result = 98}
       else if ($tmp1 === "3") {
        Result = 99}
       else if ($tmp1 === "4") {
        Result = 100}
       else if ($tmp1 === "5") {
        Result = 101}
       else if ($tmp1 === "6") {
        Result = 102}
       else if ($tmp1 === "7") {
        Result = 103}
       else if ($tmp1 === "8") {
        Result = 104}
       else if ($tmp1 === "9") {
        Result = 105}
       else if ($tmp1 === "*") {
        Result = 106}
       else if ($tmp1 === "+") {
        Result = 107}
       else if ($tmp1 === "-") {
        Result = 109}
       else if ($tmp1 === ",") {
        Result = 110}
       else if ($tmp1 === "/") {
        Result = 111}
       else if ($tmp1 === ".") Result = 194;
    } else {
      var $tmp2 = VKey;
      if ($tmp2 === "0") {
        Result = 48}
       else if ($tmp2 === "1") {
        Result = 49}
       else if ($tmp2 === "2") {
        Result = 50}
       else if ($tmp2 === "3") {
        Result = 51}
       else if ($tmp2 === "4") {
        Result = 52}
       else if ($tmp2 === "5") {
        Result = 53}
       else if ($tmp2 === "6") {
        Result = 54}
       else if ($tmp2 === "7") {
        Result = 55}
       else if ($tmp2 === "8") {
        Result = 56}
       else if ($tmp2 === "9") {
        Result = 57}
       else if ($tmp2 === "ç") {
        Result = 63}
       else if ($tmp2 === "a") {
        Result = 65}
       else if ($tmp2 === "b") {
        Result = 66}
       else if ($tmp2 === "c") {
        Result = 67}
       else if ($tmp2 === "d") {
        Result = 68}
       else if ($tmp2 === "e") {
        Result = 69}
       else if ($tmp2 === "f") {
        Result = 70}
       else if ($tmp2 === "g") {
        Result = 71}
       else if ($tmp2 === "h") {
        Result = 72}
       else if ($tmp2 === "i") {
        Result = 73}
       else if ($tmp2 === "j") {
        Result = 74}
       else if ($tmp2 === "k") {
        Result = 75}
       else if ($tmp2 === "l") {
        Result = 76}
       else if ($tmp2 === "m") {
        Result = 77}
       else if ($tmp2 === "n") {
        Result = 78}
       else if ($tmp2 === "o") {
        Result = 79}
       else if ($tmp2 === "p") {
        Result = 80}
       else if ($tmp2 === "q") {
        Result = 81}
       else if ($tmp2 === "r") {
        Result = 82}
       else if ($tmp2 === "s") {
        Result = 83}
       else if ($tmp2 === "t") {
        Result = 84}
       else if ($tmp2 === "u") {
        Result = 85}
       else if ($tmp2 === "v") {
        Result = 86}
       else if ($tmp2 === "w") {
        Result = 87}
       else if ($tmp2 === "x") {
        Result = 88}
       else if ($tmp2 === "y") {
        Result = 89}
       else if ($tmp2 === "z") {
        Result = 90}
       else if ($tmp2 === "=") {
        Result = 187}
       else if ($tmp2 === ",") {
        Result = 188}
       else if ($tmp2 === "-") {
        Result = 189}
       else if ($tmp2 === ".") {
        Result = 190}
       else if ($tmp2 === "'") {
        Result = 192}
       else if ($tmp2 === "/") {
        Result = 193}
       else if ($tmp2 === "]") {
        Result = 220}
       else if ($tmp2 === "[") Result = 221;
    };
    return Result;
  };
  this.ExtractKeyChar = function (AEvent) {
    var Result = "\x00";
    var VKey = "";
    VKey = "";
    if (AEvent.key != null) VKey = AEvent.key;
    VKey = pas.SysUtils.LowerCase(VKey);
    Result = "\x00";
    if (VKey.length === 1) {
      Result = VKey.charAt(0);
    } else {
      var $tmp = VKey;
      if ($tmp === "backspace") {
        Result = "\b"}
       else if ($tmp === "tab") {
        Result = "\t"}
       else if ($tmp === "enter") {
        Result = "\r"}
       else if ($tmp === "escape") Result = "\x1B";
    };
    return Result;
  };
  this.ExtractShiftState = function (AEvent) {
    var Result = {};
    Result = {};
    if (AEvent.altKey) {
      Result = rtl.unionSet(Result,rtl.createSet($mod.TShiftStateEnum.ssAlt));
    };
    if (AEvent.ctrlKey) {
      Result = rtl.unionSet(Result,rtl.createSet($mod.TShiftStateEnum.ssCtrl));
    };
    if (AEvent.shiftKey) {
      Result = rtl.unionSet(Result,rtl.createSet($mod.TShiftStateEnum.ssShift));
    };
    return Result;
  };
  this.ExtractShiftState$1 = function (AEvent) {
    var Result = {};
    Result = {};
    if (AEvent.altKey) {
      Result = rtl.unionSet(Result,rtl.createSet($mod.TShiftStateEnum.ssAlt));
    };
    if (AEvent.ctrlKey) {
      Result = rtl.unionSet(Result,rtl.createSet($mod.TShiftStateEnum.ssCtrl));
    };
    if (AEvent.shiftKey) {
      Result = rtl.unionSet(Result,rtl.createSet($mod.TShiftStateEnum.ssShift));
    };
    return Result;
  };
  this.ExtractMouseButton = function (AEvent) {
    var Result = 0;
    var $tmp = AEvent.button;
    if ($tmp === 0) {
      Result = $mod.TMouseButton.mbLeft}
     else if ($tmp === 1) {
      Result = $mod.TMouseButton.mbMiddle}
     else if ($tmp === 2) {
      Result = $mod.TMouseButton.mbRight}
     else {
      Result = $mod.TMouseButton.mbMiddle;
    };
    return Result;
  };
  this.JSCursor = function (ACursor) {
    var Result = "";
    var $tmp = ACursor;
    if ($tmp === -1) {
      Result = "none"}
     else if ($tmp === -3) {
      Result = "crosshair"}
     else if ($tmp === -4) {
      Result = "text"}
     else if ($tmp === -22) {
      Result = "move"}
     else if ($tmp === -6) {
      Result = "nesw-resize"}
     else if ($tmp === -7) {
      Result = "ns-resize"}
     else if ($tmp === -8) {
      Result = "nwse-resize"}
     else if ($tmp === -9) {
      Result = "ew-resize"}
     else if ($tmp === -23) {
      Result = "nwse-resize"}
     else if ($tmp === -24) {
      Result = "ns-resize"}
     else if ($tmp === -25) {
      Result = "nesw-resize"}
     else if ($tmp === -26) {
      Result = "col-resize"}
     else if ($tmp === -27) {
      Result = "col-resize"}
     else if ($tmp === -28) {
      Result = "nesw-resize"}
     else if ($tmp === -29) {
      Result = "ns-resize"}
     else if ($tmp === -30) {
      Result = "nwse-resize"}
     else if ($tmp === -11) {
      Result = "wait"}
     else if ($tmp === -13) {
      Result = "no-drop"}
     else if ($tmp === -14) {
      Result = "col-resize"}
     else if ($tmp === -15) {
      Result = "row-resize"}
     else if ($tmp === -17) {
      Result = "progress"}
     else if ($tmp === -18) {
      Result = "not-allowed"}
     else if ($tmp === -19) {
      Result = "wait"}
     else if ($tmp === -20) {
      Result = "help"}
     else if ($tmp === -21) {
      Result = "pointer"}
     else if ($tmp === -31) {
      Result = "move"}
     else {
      Result = "";
    };
    return Result;
  };
  this.RegisterWCLStyle = function (ARules) {
    var VStyle = null;
    $impl._WCLTheme = $impl._WCLTheme + ARules;
    if (!$impl._WCLThemeInjected) {
      VStyle = document.createElement("style");
      VStyle.setAttribute("type","text/css");
      VStyle.setAttribute("data-wcl","theme");
      VStyle.innerHTML = $impl._WCLTheme;
      document.head.appendChild(VStyle);
      $impl._WCLThemeInjected = true;
    } else {
      document.head.querySelector("style[data-wcl]").innerHTML = $impl._WCLTheme;
    };
  };
  $mod.$implcode = function () {
    rtl.createClass($impl,"TDragManager",pas.System.TObject,function () {
      this.$init = function () {
        pas.System.TObject.$init.call(this);
        this.FAccept = false;
        this.FDragObject = null;
        this.FDragging = false;
        this.FGhost = null;
        this.FListeners = false;
        this.FPending = false;
        this.FPointerId = undefined;
        this.FPointerX = 0;
        this.FPointerY = 0;
        this.FSource = null;
        this.FStartX = 0;
        this.FStartY = 0;
        this.FTarget = null;
        this.FThreshold = 0;
      };
      this.$final = function () {
        this.FDragObject = undefined;
        this.FGhost = undefined;
        this.FSource = undefined;
        this.FTarget = undefined;
        pas.System.TObject.$final.call(this);
      };
      this.AddListeners = function () {
        if (this.FListeners) return;
        document.addEventListener("pointermove",rtl.createCallback(this,"PointerMove"));
        document.addEventListener("pointerup",rtl.createCallback(this,"PointerUp"));
        document.addEventListener("pointercancel",rtl.createCallback(this,"PointerCancel"));
        document.addEventListener("keydown",rtl.createCallback(this,"KeyDown"));
        this.FListeners = true;
      };
      this.RemoveListeners = function () {
        if (!this.FListeners) return;
        document.removeEventListener("pointermove",rtl.createCallback(this,"PointerMove"));
        document.removeEventListener("pointerup",rtl.createCallback(this,"PointerUp"));
        document.removeEventListener("pointercancel",rtl.createCallback(this,"PointerCancel"));
        document.removeEventListener("keydown",rtl.createCallback(this,"KeyDown"));
        this.FListeners = false;
      };
      this.CapturePointer = function () {
        var VElement = null;
        if (!(this.FSource != null)) return;
        VElement = this.FSource.FHandleElement;
        try {
          if (VElement && VElement.setPointerCapture && this.FPointerId)
            VElement.setPointerCapture(this.FPointerId);
        } catch (e) {};
      };
      this.ReleasePointer = function () {
        var VElement = null;
        if (!(this.FSource != null)) return;
        VElement = this.FSource.FHandleElement;
        try {
          if (VElement && VElement.releasePointerCapture && this.FPointerId)
            VElement.releasePointerCapture(this.FPointerId);
        } catch (e) {};
      };
      this.CreateGhost = function () {
        this.DestroyGhost();
        this.FGhost = document.createElement("div");
        this.FGhost.classList.add("wcl-drag-ghost");
        if (this.FSource != null) {
          if (this.FSource.GetText() !== "") {
            this.FGhost.textContent = this.FSource.GetText()}
           else this.FGhost.textContent = this.FSource.$classname;
        };
        document.body.appendChild(this.FGhost);
      };
      this.DestroyGhost = function () {
        if (this.FGhost != null) {
          this.FGhost.remove();
          this.FGhost = null;
        };
      };
      this.MoveGhost = function (AX, AY) {
        if (this.FGhost != null) {
          this.FGhost.style.setProperty("left",pas.SysUtils.IntToStr(AX + 12) + "px");
          this.FGhost.style.setProperty("top",pas.SysUtils.IntToStr(AY + 12) + "px");
        };
      };
      this.ClearTarget = function () {
        var VAccept = false;
        if (this.FTarget != null) {
          this.FTarget.FHandleElement.classList.remove("wcl-drag-over");
          VAccept = this.FTarget.DoDragOver(this.FSource,0,0,$mod.TDragState.dsDragLeave);
        };
        this.FTarget = null;
        this.FAccept = false;
      };
      this.FindControlAt = function (AX, AY) {
        var Result = null;
        var VControl = null;
        var VElement = null;
        Result = null;
        VElement = document.elementFromPoint(AX,AY);
        while (VElement != null) {
          VControl = null;
          VControl = VElement.__wclControl || null;
          if ((VControl != null) && VControl.FVisible && VControl.FEnabled && (VControl.FOnDragOver != null)) {
            Result = VControl;
            return Result;
          };
          VElement = VElement.parentElement;
        };
        return Result;
      };
      this.GetLocal = function (AControl, AX, AY, LX, LY) {
        var VOffsets = pas.Types.TRect.$new();
        VOffsets.$assign($mod.OffSets(AControl.FHandleElement));
        LX.set(AX - VOffsets.Left);
        LY.set(AY - VOffsets.Top);
      };
      this.UpdateTarget = function (AX, AY, AState) {
        var VAccept = false;
        var VNew = null;
        var VX = 0;
        var VY = 0;
        VNew = this.FindControlAt(AX,AY);
        if ((VNew != null) && (VNew === this.FSource)) VNew = null;
        if (VNew !== this.FTarget) {
          this.ClearTarget();
          this.FTarget = VNew;
          if (this.FTarget != null) {
            this.GetLocal(this.FTarget,AX,AY,{get: function () {
                return VX;
              }, set: function (v) {
                VX = v;
              }},{get: function () {
                return VY;
              }, set: function (v) {
                VY = v;
              }});
            this.FAccept = this.FTarget.DoDragOver(this.FSource,VX,VY,$mod.TDragState.dsDragEnter);
            if (this.FAccept) this.FTarget.FHandleElement.classList.add("wcl-drag-over");
          };
        } else if (this.FTarget != null) {
          this.GetLocal(this.FTarget,AX,AY,{get: function () {
              return VX;
            }, set: function (v) {
              VX = v;
            }},{get: function () {
              return VY;
            }, set: function (v) {
              VY = v;
            }});
          this.FAccept = this.FTarget.DoDragOver(this.FSource,VX,VY,AState);
          if (this.FAccept) {
            this.FTarget.FHandleElement.classList.add("wcl-drag-over")}
           else this.FTarget.FHandleElement.classList.remove("wcl-drag-over");
        };
      };
      this.PointerMove = function (AEvent) {
        var Result = false;
        var VX = 0;
        var VY = 0;
        Result = false;
        if (!this.FPending && !this.FDragging) return Result;
        VX = pas.System.Trunc(AEvent.clientX);
        VY = pas.System.Trunc(AEvent.clientY);
        this.FPointerX = VX;
        this.FPointerY = VY;
        if (this.FDragging) {
          this.MoveGhost(VX,VY);
          this.UpdateTarget(VX,VY,$mod.TDragState.dsDragMove);
          AEvent.preventDefault();
          Result = true;
        } else if (this.FPending) {
          if ((Math.abs(VX - this.FStartX) >= this.FThreshold) || (Math.abs(VY - this.FStartY) >= this.FThreshold)) {
            this.StartDrag();
            if (this.FDragging) {
              this.MoveGhost(VX,VY);
              this.UpdateTarget(VX,VY,$mod.TDragState.dsDragMove);
            };
          };
          Result = true;
        };
        return Result;
      };
      this.PointerUp = function (AEvent) {
        var Result = false;
        Result = false;
        if (this.FDragging) {
          this.EndDrag(true);
          Result = true;
        } else if (this.FPending) {
          this.EndDrag(false);
          Result = true;
        };
        return Result;
      };
      this.PointerCancel = function (AEvent) {
        var Result = false;
        Result = false;
        if (this.FDragging || this.FPending) {
          this.EndDrag(false);
          Result = true;
        };
        return Result;
      };
      this.KeyDown = function (AEvent) {
        var Result = false;
        Result = false;
        if (!this.FDragging && !this.FPending) return Result;
        if (pas.SysUtils.SameText(AEvent.key,"Escape")) {
          this.EndDrag(false);
          AEvent.preventDefault();
          AEvent.stopPropagation();
          Result = true;
        };
        return Result;
      };
      this.Create$1 = function () {
        pas.System.TObject.Create.call(this);
        this.FAccept = false;
        this.FDragObject = null;
        this.FDragging = false;
        this.FGhost = null;
        this.FListeners = false;
        this.FPending = false;
        this.FPointerId = 0;
        this.FPointerX = 0;
        this.FPointerY = 0;
        this.FSource = null;
        this.FStartX = 0;
        this.FStartY = 0;
        this.FTarget = null;
        this.FThreshold = 5;
        return this;
      };
      this.Destroy = function () {
        this.EndDrag(false);
        pas.System.TObject.Destroy.call(this);
      };
      this.StartPending = function (ASource, AX, AY, AThreshold, AImmediate) {
        if (this.FDragging) return;
        if (this.FPending && (this.FSource !== ASource)) {
          this.RemoveListeners();
          this.FPending = false;
          this.FSource = null;
        };
        this.FSource = ASource;
        this.FPending = true;
        this.FDragging = false;
        this.FStartX = AX;
        this.FStartY = AY;
        this.FPointerX = AX;
        this.FPointerY = AY;
        this.FThreshold = AThreshold;
        if (this.FThreshold < 0) this.FThreshold = 5;
        this.AddListeners();
        if (AImmediate) this.StartDrag();
      };
      this.StartDrag = function () {
        var VDragObject = null;
        if (!this.FPending || !(this.FSource != null)) return;
        this.FPending = false;
        this.FDragging = true;
        VDragObject = null;
        if (this.FSource.FOnStartDrag != null) {
          this.FSource.FOnStartDrag(this.FSource,{get: function () {
              return VDragObject;
            }, set: function (v) {
              VDragObject = v;
            }});
          this.FDragObject = VDragObject;
        };
        if (!(this.FDragObject != null)) this.FDragObject = $mod.TDragObject.$create("Create$1",[this.FSource]);
        this.CreateGhost();
        this.CapturePointer();
        this.UpdateTarget(this.FPointerX,this.FPointerY,$mod.TDragState.dsDragEnter);
      };
      this.EndDrag = function (ADrop) {
        var VAccept = false;
        var VDropTarget = null;
        var VSource = null;
        var VTarget = null;
        var VX = 0;
        var VY = 0;
        if (!this.FDragging && !this.FPending) return;
        VSource = this.FSource;
        VTarget = this.FTarget;
        VDropTarget = null;
        if (this.FDragging && ADrop && this.FAccept && (VTarget != null)) {
          this.GetLocal(VTarget,this.FPointerX,this.FPointerY,{get: function () {
              return VX;
            }, set: function (v) {
              VX = v;
            }},{get: function () {
              return VY;
            }, set: function (v) {
              VY = v;
            }});
          VTarget.DoDragDrop(VSource,VX,VY);
          VDropTarget = VTarget;
        };
        if (this.FDragging && (VSource != null) && (VSource.FOnEndDrag != null)) {
          if (VDropTarget != null) {
            this.GetLocal(VDropTarget,this.FPointerX,this.FPointerY,{get: function () {
                return VX;
              }, set: function (v) {
                VX = v;
              }},{get: function () {
                return VY;
              }, set: function (v) {
                VY = v;
              }})}
           else {
            VX = this.FPointerX;
            VY = this.FPointerY;
          };
          VSource.FOnEndDrag(VSource,VDropTarget,VX,VY);
        };
        this.ReleasePointer();
        this.DestroyGhost();
        if (this.FTarget != null) {
          this.FTarget.FHandleElement.classList.remove("wcl-drag-over");
          VAccept = this.FTarget.DoDragOver(this.FSource,0,0,$mod.TDragState.dsDragLeave);
        };
        this.FTarget = null;
        this.FAccept = false;
        this.RemoveListeners();
        if (this.FDragObject != null) {
          rtl.free(this,"FDragObject");
          this.FDragObject = null;
        };
        this.FPending = false;
        this.FDragging = false;
        this.FSource = null;
        this.FPointerId = 0;
      };
      this.SetPointerId = function (AEvent) {
        this.FPointerId = (AEvent && AEvent.pointerId != null) ? AEvent.pointerId : 0;
      };
      this.SetPointerPos = function (AX, AY) {
        this.FPointerX = AX;
        this.FPointerY = AY;
      };
    });
    $impl._DragManager = null;
    $impl._WCLDragRulesRegistered = false;
    $impl._WCLTheme = "";
    $impl._WCLThemeInjected = false;
    $impl._RegisterWCLDragRules = function () {
      if ($impl._WCLDragRulesRegistered) return;
      $mod.RegisterWCLStyle(".wcl-drag-ghost{" + "position:fixed;" + "pointer-events:none;" + "z-index:100000;" + "padding:4px 10px;" + "border:1px solid #4A90D9;" + "border-radius:4px;" + "background:#fff;" + "box-shadow:0 4px 12px rgba(0,0,0,0.2);" + "font:14px sans-serif;" + "color:#333;" + "opacity:0.92;}" + ".wcl-drag-over{" + "outline:2px dashed #4A90D9;" + "outline-offset:-2px;}");
      $impl._WCLDragRulesRegistered = true;
    };
    $impl.CursorIdents$a$clone = function (a) {
      var b = [];
      b.length = 31;
      for (var c = 0; c < 31; c++) b[c] = pas.Classes.TIdentMapEntry.$clone(a[c]);
      return b;
    };
    $mod.$rtti.$StaticArray("CursorIdents$a",{dims: [31], eltype: pas.Classes.$rtti["TIdentMapEntry"]});
    $impl.CursorIdents = [pas.Classes.TIdentMapEntry.$clone({Value: 0, Name: "crDefault"}),pas.Classes.TIdentMapEntry.$clone({Value: -1, Name: "crNone"}),pas.Classes.TIdentMapEntry.$clone({Value: -2, Name: "crArrow"}),pas.Classes.TIdentMapEntry.$clone({Value: -3, Name: "crCross"}),pas.Classes.TIdentMapEntry.$clone({Value: -4, Name: "crIBeam"}),pas.Classes.TIdentMapEntry.$clone({Value: -6, Name: "crSizeNESW"}),pas.Classes.TIdentMapEntry.$clone({Value: -7, Name: "crSizeNS"}),pas.Classes.TIdentMapEntry.$clone({Value: -8, Name: "crSizeNWSE"}),pas.Classes.TIdentMapEntry.$clone({Value: -9, Name: "crSizeWE"}),pas.Classes.TIdentMapEntry.$clone({Value: -23, Name: "crSizeNW"}),pas.Classes.TIdentMapEntry.$clone({Value: -24, Name: "crSizeN"}),pas.Classes.TIdentMapEntry.$clone({Value: -25, Name: "crSizeNE"}),pas.Classes.TIdentMapEntry.$clone({Value: -26, Name: "crSizeW"}),pas.Classes.TIdentMapEntry.$clone({Value: -27, Name: "crSizeE"}),pas.Classes.TIdentMapEntry.$clone({Value: -28, Name: "crSizeSW"}),pas.Classes.TIdentMapEntry.$clone({Value: -29, Name: "crSizeS"}),pas.Classes.TIdentMapEntry.$clone({Value: -30, Name: "crSizeSE"}),pas.Classes.TIdentMapEntry.$clone({Value: -10, Name: "crUpArrow"}),pas.Classes.TIdentMapEntry.$clone({Value: -11, Name: "crHourGlass"}),pas.Classes.TIdentMapEntry.$clone({Value: -12, Name: "crDrag"}),pas.Classes.TIdentMapEntry.$clone({Value: -13, Name: "crNoDrop"}),pas.Classes.TIdentMapEntry.$clone({Value: -14, Name: "crHSplit"}),pas.Classes.TIdentMapEntry.$clone({Value: -15, Name: "crVSplit"}),pas.Classes.TIdentMapEntry.$clone({Value: -16, Name: "crMultiDrag"}),pas.Classes.TIdentMapEntry.$clone({Value: -17, Name: "crSQLWait"}),pas.Classes.TIdentMapEntry.$clone({Value: -18, Name: "crNo"}),pas.Classes.TIdentMapEntry.$clone({Value: -19, Name: "crAppStart"}),pas.Classes.TIdentMapEntry.$clone({Value: -20, Name: "crHelp"}),pas.Classes.TIdentMapEntry.$clone({Value: -21, Name: "crHandPoint"}),pas.Classes.TIdentMapEntry.$clone({Value: -22, Name: "crSizeAll"}),pas.Classes.TIdentMapEntry.$clone({Value: -31, Name: "crMove"})];
    $impl.CursorToIdent = function (aCursor, aIdent) {
      var Result = false;
      Result = pas.Classes.IntToIdent(aCursor,aIdent,$impl.CursorIdents);
      return Result;
    };
    $impl.IdentToCursor = function (aIdent, aCursor) {
      var Result = false;
      Result = pas.Classes.IdentToInt(aIdent,aCursor,$impl.CursorIdents);
      return Result;
    };
  };
  $mod.$init = function () {
    $impl._DragManager = $impl.TDragManager.$create("Create$1");
    pas.Classes.RegisterIntegerConsts($mod.$rtti["TCursor"],$impl.IdentToCursor,$impl.CursorToIdent);
  };
},["Forms"]);
//# sourceMappingURL=controls.js.map
