rtl.module("ComCtrls",["System","Classes","SysUtils","Types","JS","Web","Graphics","Controls","Generics.Collections"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.$rtti.$Class("TCustomPageControl");
  this.TTabPosition = {"0": "tpTop", tpTop: 0, "1": "tpBottom", tpBottom: 1, "2": "tpLeft", tpLeft: 2, "3": "tpRight", tpRight: 3};
  this.$rtti.$Enum("TTabPosition",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TTabPosition});
  rtl.createClass(this,"TCustomTabSheet",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FTabVisible = false;
    };
    this.GetPageControl = function () {
      var Result = null;
      if ($mod.TCustomPageControl.isPrototypeOf(this.FParent)) {
        Result = this.FParent;
      } else {
        Result = null;
      };
      return Result;
    };
    this.GetPageIndex = function () {
      var Result = 0;
      if ($mod.TCustomPageControl.isPrototypeOf(this.FParent)) {
        Result = this.FParent.IndexOf(this);
      } else {
        Result = -1;
      };
      return Result;
    };
    this.SetPageControl = function (AValue) {
      if (this.GetPageControl() !== AValue) {
        this.SetParent(AValue);
      };
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        $with.style.setProperty("background-color","#fff");
        $with.style.setProperty("outline","none");
        $with.style.setProperty("border","1px solid #c9c3ba");
        $with.style.setProperty("border-top","0px");
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("span");
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FTabVisible = true;
      this.BeginUpdate();
      try {
        this.SetVisible(false);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TTabSheet",this.TCustomTabSheet,function () {
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("Caption",3,pas.Controls.$rtti["TCaption"],"GetText","SetText");
    $r.addProperty("ClientHeight",3,rtl.nativeint,"GetClientHeight","SetClientHeight");
    $r.addProperty("ClientWidth",3,rtl.nativeint,"GetClientWidth","SetClientWidth");
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("Enabled",2,rtl.boolean,"FEnabled","SetEnabled");
    $r.addProperty("Font",2,pas.Graphics.$rtti["TFont"],"FFont","SetFont");
    $r.addProperty("Height",2,rtl.nativeint,"FHeight","SetHeight");
    $r.addProperty("Left",2,rtl.nativeint,"FLeft","SetLeft");
    $r.addProperty("PageIndex",1,rtl.nativeint,"GetPageIndex","");
    $r.addProperty("ParentFont",2,rtl.boolean,"FParentFont","SetParentFont");
    $r.addProperty("ParentShowHint",2,rtl.boolean,"FParentShowHint","SetParentShowHint");
    $r.addProperty("ShowHint",2,rtl.boolean,"FShowHint","SetShowHint");
    $r.addProperty("TabVisible",0,rtl.boolean,"FTabVisible","FTabVisible");
    $r.addProperty("Top",2,rtl.nativeint,"FTop","SetTop");
    $r.addProperty("Width",2,rtl.nativeint,"FWidth","SetWidth");
    $r.addProperty("OnEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnEnter","FOnEnter");
    $r.addProperty("OnExit",0,pas.Classes.$rtti["TNotifyEvent"],"FOnExit","FOnExit");
    $r.addProperty("OnMouseDown",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseDown","FOnMouseDown");
    $r.addProperty("OnMouseEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseEnter","FOnMouseEnter");
    $r.addProperty("OnMouseLeave",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseLeave","FOnMouseLeave");
    $r.addProperty("OnMouseMove",0,pas.Controls.$rtti["TMouseMoveEvent"],"FOnMouseMove","FOnMouseMove");
    $r.addProperty("OnMouseUp",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseUp","FOnMouseUp");
    $r.addProperty("OnMouseWheel",0,pas.Controls.$rtti["TMouseWheelEvent"],"FOnMouseWheel","FOnMouseWheel");
  });
  rtl.createClass(this,"TCustomPageControl",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FMultiLine = false;
      this.FOnShowPage = null;
      this.FPageIndex = 0;
      this.FPages = null;
      this.FShowTabs = false;
      this.FTabContainerElement = null;
      this.FTabHeight = 0;
      this.FTabPosition = 0;
      this.FTabWidth = 0;
    };
    this.$final = function () {
      this.FOnShowPage = undefined;
      this.FPages = undefined;
      this.FTabContainerElement = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.GetActivePage = function () {
      var Result = null;
      Result = this.GetPage(this.FPageIndex);
      return Result;
    };
    this.GetPage = function (AIndex) {
      var Result = null;
      if ((AIndex >= 0) && (AIndex < this.FPages.length)) {
        Result = rtl.getObject(this.FPages[AIndex]);
      } else {
        Result = null;
      };
      return Result;
    };
    this.GetPageCount = function () {
      var Result = 0;
      Result = this.FPages.length;
      return Result;
    };
    this.SetActivePage = function (AValue) {
      this.SetPageIndex(this.FPages.indexOf(AValue));
    };
    this.SetMultiLine = function (AValue) {
      if (this.FMultiLine !== AValue) {
        this.FMultiLine = AValue;
      };
    };
    this.SetPageIndex = function (AValue) {
      if ((AValue < 0) || (AValue >= this.FPages.length)) {
        AValue = 0;
      };
      if (AValue !== this.FPageIndex) {
        this.FPageIndex = AValue;
        this.Changed();
        this.DoShowPage();
      };
    };
    this.SetShowTabs = function (AValue) {
      if (this.FShowTabs !== AValue) {
        this.FShowTabs = AValue;
        this.Changed();
      };
    };
    this.SetTabHeight = function (AValue) {
      if (this.FTabHeight !== AValue) {
        this.FTabHeight = AValue;
        this.Changed();
      };
    };
    this.SetTabPosition = function (AValue) {
      if (this.FTabPosition !== AValue) {
        this.FTabPosition = AValue;
      };
    };
    this.SetTabWidth = function (AValue) {
      if (this.FTabWidth !== AValue) {
        this.FTabWidth = AValue;
        this.Changed();
      };
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        $with.style.setProperty("outline","none");
        this.RenderTabs();
        this.UpdatePages();
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.CreateTabContainerElement = function () {
      var Result = null;
      Result = document.createElement("span");
      this.FHandleElement.appendChild(Result);
      return Result;
    };
    this.RegisterChild = function (AControl) {
      var VIndex = 0;
      pas.Controls.TControl.RegisterChild.call(this,AControl);
      if ((AControl != null) && $mod.TCustomTabSheet.isPrototypeOf(AControl)) {
        VIndex = this.FPages.indexOf(AControl);
        if (VIndex < 0) {
          this.FPages.push(AControl);
        };
      };
    };
    this.UnRegisterChild = function (AControl) {
      var VIndex = 0;
      pas.Controls.TControl.UnRegisterChild.call(this,AControl);
      if ((AControl != null) && $mod.TCustomTabSheet.isPrototypeOf(AControl)) {
        VIndex = this.FPages.indexOf(AControl);
        if (VIndex >= 0) {
          this.FPages.splice(VIndex,1);
        };
      };
    };
    this.CalcTabHeight = function () {
      var Result = 0;
      if (this.FShowTabs) {
        if (this.FTabHeight > 0) {
          Result = this.FTabHeight;
        } else {
          Result = this.FFont.TextHeight("Fj") + 10;
          if (pas.Forms.Screen.GetIsTouch() && (Result < 36)) Result = 36;
        };
      } else {
        Result = 0;
      };
      return Result;
    };
    this.CalcTabWidth = function (AText) {
      var Result = 0;
      if (this.FTabWidth > 0) {
        Result = this.FTabWidth;
      } else {
        Result = this.FFont.TextWidth(AText) + 10;
      };
      return Result;
    };
    this.CalcMaxTabWidth = function () {
      var Result = 0;
      var VPage = null;
      var VIndex = 0;
      var VWidth = 0;
      Result = 0;
      if (this.FTabWidth > 0) {
        Result = this.FTabWidth;
      } else {
        for (var $l = 0, $end = this.FPages.length - 1; $l <= $end; $l++) {
          VIndex = $l;
          VPage = rtl.getObject(this.FPages[VIndex]);
          if ((VPage != null) && VPage.FTabVisible) {
            VWidth = this.CalcTabWidth(VPage.GetText());
            if (VWidth > Result) {
              Result = VWidth;
            };
          };
        };
      };
      return Result;
    };
    this.CalcSumTabsWidth = function () {
      var Result = 0;
      var VIndex = 0;
      var VPage = null;
      Result = 0;
      for (var $l = 0, $end = this.FPages.length - 1; $l <= $end; $l++) {
        VIndex = $l;
        VPage = rtl.getObject(this.FPages[VIndex]);
        if ((VPage != null) && VPage.FTabVisible) {
          Result = Result + this.CalcTabWidth(VPage.GetText());
        };
      };
      return Result;
    };
    this.IndexOfTab = function (ACaption) {
      var Result = 0;
      var VIndex = 0;
      var VPage = null;
      Result = -1;
      for (var $l = 0, $end = this.FPages.length - 1; $l <= $end; $l++) {
        VIndex = $l;
        VPage = rtl.getObject(this.FPages[VIndex]);
        if ((VPage != null) && VPage.FTabVisible && pas.SysUtils.SameText(VPage.GetText(),ACaption)) {
          Result = VIndex;
        };
      };
      return Result;
    };
    this.RenderTab = function (ACaption, ALeft, ATop, AWidth, AHeight, AEvent) {
      var Result = null;
      Result = document.createElement("button");
      Result.style.setProperty("left",pas.SysUtils.IntToStr(ALeft) + "px");
      Result.style.setProperty("top",pas.SysUtils.IntToStr(ATop) + "px");
      Result.style.setProperty("width",pas.SysUtils.IntToStr(AWidth) + "px");
      Result.style.setProperty("height",pas.SysUtils.IntToStr(AHeight) + "px");
      Result.style.setProperty("border","1px solid #c9c3ba");
      Result.style.setProperty("border-top-left-radius","15px");
      Result.style.setProperty("border-top-right-radius","2px");
      Result.style.setProperty("background-color","#dddada");
      Result.style.setProperty("color",pas.Graphics.JSColor(this.FFont.FColor));
      Result.style.setProperty("font",pas.Graphics.JSFont(this.FFont));
      Result.style.setProperty("outline","none");
      Result.style.setProperty("position","absolute");
      Result.style.setProperty("overflow","hidden");
      Result.style.setProperty("padding","0");
      Result.style.setProperty("white-space","nowrap");
      Result.addEventListener("click",AEvent);
      Result.innerHTML = ACaption;
      return Result;
    };
    this.RenderTabActive = function (ACaption, ALeft, ATop, AWidth, AHeight, AEvent) {
      var Result = null;
      Result = this.RenderTab(ACaption,ALeft,ATop,AWidth,AHeight,AEvent);
      Result.style.setProperty("border-bottom","0px");
      Result.style.setProperty("background-color","#fff");
      return Result;
    };
    this.RenderTabLeft = function (ALeft, ATop, AWidth, AHeight, AEvent) {
      var Result = null;
      Result = this.RenderTab("‹",ALeft,ATop,AWidth,AHeight,AEvent);
      Result.style.setProperty("background-color","#fff");
      return Result;
    };
    this.RenderTabRight = function (ALeft, ATop, AWidth, AHeight, AEvent) {
      var Result = null;
      Result = this.RenderTab("›",ALeft,ATop,AWidth,AHeight,AEvent);
      Result.style.setProperty("background-color","#fff");
      return Result;
    };
    this.RenderTabs = function () {
      var $Self = this;
      var form = null;
      function AdjustWithPPI(aValue) {
        var Result = 0;
        if (form != null) {
          Result = pas.System.Trunc((96 * aValue) / form.FDesignTimePPI)}
         else Result = aValue;
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
      var VPage = null;
      var VIndex = 0;
      var VStartIndex = 0;
      var VEndIndex = 0;
      var VTabCaption = "";
      var VTabHeight = 0;
      var VTabLeft = 0;
      var VTabWidth = 0;
      var VSumTabsWidth = 0;
      var VMaxTabWidth = 0;
      var VTabsCount = 0;
      if (!this.FShowTabs) {
        this.FTabContainerElement.innerHTML = "";
        this.FTabContainerElement.style.setProperty("display","none");
        return;
      };
      this.FTabContainerElement.style.setProperty("display","block");
      form = FindParentForm();
      VTabHeight = this.CalcTabHeight();
      VSumTabsWidth = this.CalcSumTabsWidth();
      var $with = this.FTabContainerElement;
      $with.innerHTML = "";
      $with.style.setProperty("left","0px");
      $with.style.setProperty("top","0px");
      $with.style.setProperty("width",pas.SysUtils.IntToStr(AdjustWithPPI(pas.Controls.IfThen$2(VSumTabsWidth > this.FWidth,VSumTabsWidth,this.FWidth))) + "px");
      $with.style.setProperty("height",pas.SysUtils.IntToStr(AdjustWithPPI(VTabHeight)) + "px");
      $with.style.setProperty("position","absolute");
      $with.style.setProperty("overflow","hidden");
      if ((this.FPageIndex > -1) && (this.FPageIndex < this.FPages.length)) {
        if (VSumTabsWidth > this.FWidth) {
          VTabLeft = 40;
          VMaxTabWidth = this.CalcMaxTabWidth();
          VTabsCount = pas.System.Trunc(rtl.trunc((this.FWidth - 80) / VMaxTabWidth));
          if (VTabsCount === 0) {
            VTabsCount = 1;
          };
          if ((this.FPageIndex - VTabsCount) >= 0) {
            VStartIndex = (this.FPageIndex - VTabsCount) + 1;
            VEndIndex = this.FPageIndex;
          } else {
            VStartIndex = 0;
            VEndIndex = VTabsCount - 1;
          };
          VMaxTabWidth = pas.System.Trunc(rtl.trunc((this.FWidth - 80) / VTabsCount));
          for (var $l = VStartIndex, $end = VEndIndex; $l <= $end; $l++) {
            VIndex = $l;
            VPage = rtl.getObject(this.FPages[VIndex]);
            if ((VPage != null) && VPage.FTabVisible) {
              VTabCaption = VPage.GetText();
              VTabWidth = VMaxTabWidth;
              if (VIndex === this.FPageIndex) {
                this.FTabContainerElement.appendChild(this.RenderTabActive(VTabCaption,AdjustWithPPI(VTabLeft),0,AdjustWithPPI(VTabWidth),AdjustWithPPI(VTabHeight),rtl.createCallback($Self,"TabClick")));
              } else {
                this.FTabContainerElement.appendChild(this.RenderTab(VTabCaption,AdjustWithPPI(VTabLeft),0,AdjustWithPPI(VTabWidth),AdjustWithPPI(VTabHeight),rtl.createCallback($Self,"TabClick")));
              };
              VTabLeft = VTabLeft + VTabWidth;
            };
          };
          var $with1 = this.FTabContainerElement;
          $with1.appendChild(this.RenderTabLeft(0,0,40,AdjustWithPPI(VTabHeight),rtl.createCallback($Self,"TabLeftClick")));
          $with1.appendChild(this.RenderTabRight(AdjustWithPPI(this.FWidth - 40),0,40,AdjustWithPPI(VTabHeight),rtl.createCallback($Self,"TabRightClick")));
        } else {
          VTabLeft = 0;
          VStartIndex = 0;
          VEndIndex = this.FPages.length - 1;
          VTabWidth = rtl.trunc(this.FWidth / this.FPages.length);
          for (var $l1 = VStartIndex, $end1 = VEndIndex; $l1 <= $end1; $l1++) {
            VIndex = $l1;
            VPage = rtl.getObject(this.FPages[VIndex]);
            if ((VPage != null) && VPage.FTabVisible) {
              VTabCaption = VPage.GetText();
              if (VIndex === this.FPageIndex) {
                this.FTabContainerElement.appendChild(this.RenderTabActive(VTabCaption,AdjustWithPPI(VTabLeft),0,AdjustWithPPI(VTabWidth),AdjustWithPPI(VTabHeight),rtl.createCallback($Self,"TabClick")));
              } else {
                this.FTabContainerElement.appendChild(this.RenderTab(VTabCaption,AdjustWithPPI(VTabLeft),0,AdjustWithPPI(VTabWidth),AdjustWithPPI(VTabHeight),rtl.createCallback($Self,"TabClick")));
              };
              VTabLeft = VTabLeft + VTabWidth;
            };
          };
        };
      };
    };
    this.TabClick = function (AEvent) {
      this.SetPageIndex(this.IndexOfTab(pas.Web.TJSEventHelper.GetTargetElement.call(AEvent).innerHTML));
    };
    this.TabLeftClick = function (AEvent) {
      this.SetPageIndex(this.FPageIndex - 1);
    };
    this.TabRightClick = function (AEvent) {
      this.SetPageIndex(this.FPageIndex + 1);
    };
    this.UpdatePages = function () {
      var VIndex = 0;
      var VPage = null;
      var VTabHeight = 0;
      VTabHeight = this.CalcTabHeight();
      for (var $l = 0, $end = this.FPages.length - 1; $l <= $end; $l++) {
        VIndex = $l;
        VPage = rtl.getObject(this.FPages[VIndex]);
        if ((VPage != null) && VPage.FTabVisible) {
          VPage.BeginUpdate();
          try {
            if (VIndex === this.FPageIndex) {
              VPage.SetBounds(0,VTabHeight,this.FWidth,this.FHeight - VTabHeight);
              VPage.SetVisible(true);
            } else {
              VPage.SetVisible(false);
            };
          } finally {
            VPage.EndUpdate();
          };
        };
      };
    };
    this.DoShowPage = function () {
      if (this.FOnShowPage != null) this.FOnShowPage(this);
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 200;
      Result.cy = 200;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FTabContainerElement = this.CreateTabContainerElement();
      this.FPages = new Array();
      this.FPageIndex = -1;
      this.FShowTabs = true;
      this.FTabPosition = $mod.TTabPosition.tpTop;
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
    this.Destroy = function () {
      this.FPages.length = 0;
      pas.Controls.TControl.Destroy.call(this);
    };
    this.AddTabSheet = function () {
      var Result = null;
      Result = $mod.TCustomTabSheet.$create("Create$1",[this]);
      Result.SetPageControl(this);
      return Result;
    };
    this.IndexOf = function (APage) {
      var Result = 0;
      Result = this.FPages.indexOf(APage);
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  this.$rtti.$Class("TTreeNodes");
  this.$rtti.$Class("TTreeNode");
  this.$rtti.$Class("TCustomTreeView");
  this.$rtti.$MethodVar("TTreeViewExpandingEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Node",this.$rtti["TTreeNode"]],["AllowExpansion",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TTreeViewCollapsingEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Node",this.$rtti["TTreeNode"]],["AllowCollapse",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TTreeViewExpandedEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Node",this.$rtti["TTreeNode"]]]), methodkind: 0});
  rtl.createClass(this,"TTreeNode",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FChildren = null;
      this.FData = null;
      this.FExpanded = false;
      this.FImageUrl = "";
      this.FNodes = null;
      this.FParent = null;
      this.FText = "";
    };
    this.$final = function () {
      this.FChildren = undefined;
      this.FData = undefined;
      this.FNodes = undefined;
      this.FParent = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.GetAbsoluteIndex = function () {
      var Result = 0;
      if (this.FNodes != null) {
        Result = this.FNodes.IndexOf(this)}
       else Result = -1;
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FChildren.FLength;
      return Result;
    };
    this.GetExpanded = function () {
      var Result = false;
      Result = this.FExpanded;
      return Result;
    };
    this.GetFirstChild = function () {
      var Result = null;
      if (this.FChildren.FLength > 0) {
        Result = this.FChildren.GetItem(0)}
       else Result = null;
      return Result;
    };
    this.GetHasChildren = function () {
      var Result = false;
      Result = this.FChildren.FLength > 0;
      return Result;
    };
    this.GetIndex = function () {
      var Result = 0;
      if (this.FParent != null) {
        Result = this.FParent.FChildren.IndexOf(this)}
       else if (this.FNodes != null) {
        Result = this.FNodes.FRoots.IndexOf(this)}
       else Result = -1;
      return Result;
    };
    this.GetItem = function (AIndex) {
      var Result = null;
      if ((AIndex >= 0) && (AIndex < this.FChildren.FLength)) {
        Result = this.FChildren.GetItem(AIndex)}
       else Result = null;
      return Result;
    };
    this.GetLastChild = function () {
      var Result = null;
      if (this.FChildren.FLength > 0) {
        Result = this.FChildren.GetItem(this.FChildren.FLength - 1)}
       else Result = null;
      return Result;
    };
    this.GetLevel = function () {
      var Result = 0;
      var VNode = null;
      Result = 0;
      VNode = this.FParent;
      while (VNode != null) {
        Result += 1;
        VNode = VNode.FParent;
      };
      return Result;
    };
    this.GetNext = function () {
      var Result = null;
      var VIndex = 0;
      Result = null;
      if (!(this.FNodes != null)) return Result;
      VIndex = this.GetAbsoluteIndex();
      if ((VIndex >= 0) && (VIndex < (this.FNodes.GetCount() - 1))) Result = this.FNodes.GetItem(VIndex + 1);
      return Result;
    };
    this.GetNextSibling = function () {
      var Result = null;
      var VIndex = 0;
      Result = null;
      if (this.FParent != null) {
        VIndex = this.FParent.FChildren.IndexOf(this);
        if ((VIndex >= 0) && (VIndex < (this.FParent.FChildren.FLength - 1))) Result = this.FParent.FChildren.GetItem(VIndex + 1);
      } else if (this.FNodes != null) {
        VIndex = this.FNodes.FRoots.IndexOf(this);
        if ((VIndex >= 0) && (VIndex < (this.FNodes.FRoots.FLength - 1))) Result = this.FNodes.FRoots.GetItem(VIndex + 1);
      };
      return Result;
    };
    this.GetPrev = function () {
      var Result = null;
      var VIndex = 0;
      Result = null;
      if (!(this.FNodes != null)) return Result;
      VIndex = this.GetAbsoluteIndex();
      if (VIndex > 0) Result = this.FNodes.GetItem(VIndex - 1);
      return Result;
    };
    this.GetPrevSibling = function () {
      var Result = null;
      var VIndex = 0;
      Result = null;
      if (this.FParent != null) {
        VIndex = this.FParent.FChildren.IndexOf(this);
        if (VIndex > 0) Result = this.FParent.FChildren.GetItem(VIndex - 1);
      } else if (this.FNodes != null) {
        VIndex = this.FNodes.FRoots.IndexOf(this);
        if (VIndex > 0) Result = this.FNodes.FRoots.GetItem(VIndex - 1);
      };
      return Result;
    };
    this.GetSelected = function () {
      var Result = false;
      Result = (this.FNodes != null) && (this.FNodes.FTree != null) && (this.FNodes.FTree.FSelected === this);
      return Result;
    };
    this.SetExpanded = function (AValue) {
      if (this.FExpanded === AValue) return;
      if (AValue) {
        this.Expand(false)}
       else this.Collapse(false);
    };
    this.SetImageUrl = function (AValue) {
      if (this.FImageUrl !== AValue) {
        this.FImageUrl = AValue;
        this.TreeChanged();
      };
    };
    this.SetSelected = function (AValue) {
      if (!(this.FNodes != null) || !(this.FNodes.FTree != null)) return;
      if (AValue) {
        this.FNodes.FTree.SetSelected(this)}
       else if (this.FNodes.FTree.FSelected === this) this.FNodes.FTree.SetSelected(null);
    };
    this.SetText = function (AValue) {
      if (this.FText !== AValue) {
        this.FText = AValue;
        this.TreeChanged();
      };
    };
    this.TreeChanged = function () {
      if ((this.FNodes != null) && (this.FNodes.FTree != null)) this.FNodes.FTree.Changed();
    };
    this.Create$1 = function (ANodes, AParent) {
      pas.System.TObject.Create.call(this);
      this.FChildren = pas["Generics.Collections"].TList$G7.$create("Create$1");
      this.FData = null;
      this.FExpanded = false;
      this.FImageUrl = "";
      this.FNodes = ANodes;
      this.FParent = AParent;
      this.FText = "";
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FChildren");
      this.FChildren = null;
      pas.System.TObject.Destroy.call(this);
    };
    this.Collapse = function (ARecurse) {
      var VIndex = 0;
      var VTree = null;
      if (!this.GetHasChildren()) return;
      VTree = null;
      if (this.FNodes != null) VTree = this.FNodes.FTree;
      if (!this.FExpanded) {
        if (ARecurse) for (var $l = 0, $end = this.FChildren.FLength - 1; $l <= $end; $l++) {
          VIndex = $l;
          this.FChildren.GetItem(VIndex).Collapse(true);
        };
        return;
      };
      if ((VTree != null) && !VTree.DoCollapsing(this)) return;
      if (VTree != null) VTree.BeginUpdate();
      try {
        if (ARecurse) for (var $l1 = 0, $end1 = this.FChildren.FLength - 1; $l1 <= $end1; $l1++) {
          VIndex = $l1;
          this.FChildren.GetItem(VIndex).Collapse(true);
        };
        this.FExpanded = false;
      } finally {
        if (VTree != null) VTree.EndUpdate();
      };
      if (VTree != null) VTree.DoCollapsed(this);
    };
    this.Delete = function () {
      if (this.FNodes != null) this.FNodes.Delete(this);
    };
    this.DeleteChildren = function () {
      var VIndex = 0;
      if (!(this.FNodes != null)) return;
      for (var $l = this.FChildren.FLength - 1; $l >= 0; $l--) {
        VIndex = $l;
        this.FNodes.Delete(this.FChildren.GetItem(VIndex));
      };
    };
    this.Expand = function (ARecurse) {
      var VIndex = 0;
      var VTree = null;
      if (!this.GetHasChildren()) return;
      VTree = null;
      if (this.FNodes != null) VTree = this.FNodes.FTree;
      if (this.FExpanded) {
        if (ARecurse) for (var $l = 0, $end = this.FChildren.FLength - 1; $l <= $end; $l++) {
          VIndex = $l;
          this.FChildren.GetItem(VIndex).Expand(true);
        };
        return;
      };
      if ((VTree != null) && !VTree.DoExpanding(this)) return;
      if (VTree != null) VTree.BeginUpdate();
      try {
        this.FExpanded = true;
        if (ARecurse) for (var $l1 = 0, $end1 = this.FChildren.FLength - 1; $l1 <= $end1; $l1++) {
          VIndex = $l1;
          this.FChildren.GetItem(VIndex).Expand(true);
        };
      } finally {
        if (VTree != null) VTree.EndUpdate();
      };
      if (VTree != null) VTree.DoExpanded(this);
    };
    this.MakeVisible = function () {
      var VNode = null;
      VNode = this.FParent;
      while (VNode != null) {
        VNode.FExpanded = true;
        VNode = VNode.FParent;
      };
      if ((this.FNodes != null) && (this.FNodes.FTree != null)) {
        this.FNodes.FTree.Changed();
        this.FNodes.FTree.ScrollToNode(this);
      };
    };
    this.ToggleExpanded = function () {
      this.SetExpanded(!this.FExpanded);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ANodes",$mod.$rtti["TTreeNodes"]],["AParent",$r]]);
  });
  rtl.createClass(this,"TTreeNodes",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FAll = null;
      this.FRoots = null;
      this.FTree = null;
    };
    this.$final = function () {
      this.FAll = undefined;
      this.FRoots = undefined;
      this.FTree = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FAll.FLength;
      return Result;
    };
    this.GetItem = function (AIndex) {
      var Result = null;
      if ((AIndex >= 0) && (AIndex < this.FAll.FLength)) {
        Result = this.FAll.GetItem(AIndex)}
       else Result = null;
      return Result;
    };
    this.GetRoot = function (AIndex) {
      var Result = null;
      if ((AIndex >= 0) && (AIndex < this.FRoots.FLength)) {
        Result = this.FRoots.GetItem(AIndex)}
       else Result = null;
      return Result;
    };
    this.GetRootCount = function () {
      var Result = 0;
      Result = this.FRoots.FLength;
      return Result;
    };
    this.ReadData = function (Stream) {
      if (Stream != null) Stream.SetPosition(Stream.GetSize());
    };
    this.WriteData = function (Stream) {
    };
    this.AddNode = function (AParent, AIndex, AText) {
      var Result = null;
      if (this.FTree != null) this.FTree.BeginUpdate();
      try {
        Result = $mod.TTreeNode.$create("Create$1",[this,AParent]);
        Result.FText = AText;
        this.FAll.Add(Result);
        if (AParent != null) {
          if ((AIndex < 0) || (AIndex > AParent.FChildren.FLength)) {
            AParent.FChildren.Add(Result)}
           else AParent.FChildren.Insert(AIndex,Result);
        } else {
          if ((AIndex < 0) || (AIndex > this.FRoots.FLength)) {
            this.FRoots.Add(Result)}
           else this.FRoots.Insert(AIndex,Result);
        };
      } finally {
        if (this.FTree != null) this.FTree.EndUpdate();
      };
      return Result;
    };
    this.DefineProperties = function (Filer) {
      pas.Classes.TPersistent.DefineProperties.call(this,Filer);
      Filer.DefineBinaryProperty("Data",rtl.createCallback(this,"ReadData"),rtl.createCallback(this,"WriteData"),false);
    };
    this.RemoveSubtree = function (ANode) {
      var VIndex = 0;
      if (!(ANode != null)) return;
      for (var $l = ANode.FChildren.FLength - 1; $l >= 0; $l--) {
        VIndex = $l;
        this.RemoveSubtree(ANode.FChildren.GetItem(VIndex));
      };
      if (ANode.FParent != null) {
        ANode.FParent.FChildren.Remove(ANode)}
       else this.FRoots.Remove(ANode);
      this.FAll.Remove(ANode);
      if ((this.FTree != null) && (this.FTree.FSelected === ANode)) this.FTree.FSelected = null;
      ANode = rtl.freeLoc(ANode);
    };
    this.Create$1 = function (ATree) {
      pas.System.TObject.Create.call(this);
      this.FTree = ATree;
      this.FAll = pas["Generics.Collections"].TList$G7.$create("Create$1");
      this.FRoots = pas["Generics.Collections"].TList$G7.$create("Create$1");
      return this;
    };
    this.Destroy = function () {
      var VIndex = 0;
      var VNode = null;
      if (this.FAll != null) {
        for (var $l = this.FAll.FLength - 1; $l >= 0; $l--) {
          VIndex = $l;
          VNode = this.FAll.GetItem(VIndex);
          VNode = rtl.freeLoc(VNode);
        };
        rtl.free(this,"FAll");
        this.FAll = null;
      };
      rtl.free(this,"FRoots");
      this.FRoots = null;
      pas.System.TObject.Destroy.call(this);
    };
    this.Add = function (AParent, AText) {
      var Result = null;
      if (AParent != null) {
        Result = this.AddNode(AParent.FParent,-1,AText)}
       else Result = this.AddNode(null,-1,AText);
      return Result;
    };
    this.Add$1 = function (AText) {
      var Result = null;
      Result = this.AddNode(null,-1,AText);
      return Result;
    };
    this.AddChild = function (AParent, AText) {
      var Result = null;
      Result = this.AddNode(AParent,-1,AText);
      return Result;
    };
    this.Insert = function (AParent, AIndex, AText) {
      var Result = null;
      Result = this.AddNode(AParent,AIndex,AText);
      return Result;
    };
    this.AlphaSort = function () {
      var $Self = this;
      var VTree = null;
      function SortList(AList) {
        var I = 0;
        var J = 0;
        var VTemp = null;
        for (var $l = 0, $end = AList.FLength - 2; $l <= $end; $l++) {
          I = $l;
          for (var $l1 = I + 1, $end1 = AList.FLength - 1; $l1 <= $end1; $l1++) {
            J = $l1;
            if (pas.SysUtils.CompareText(AList.GetItem(I).FText,AList.GetItem(J).FText) > 0) {
              VTemp = AList.GetItem(I);
              AList.SetItem(I,AList.GetItem(J));
              AList.SetItem(J,VTemp);
            };
          };
        };
        for (var $l2 = 0, $end2 = AList.FLength - 1; $l2 <= $end2; $l2++) {
          I = $l2;
          SortList(AList.GetItem(I).FChildren);
        };
      };
      VTree = this.FTree;
      if (VTree != null) VTree.BeginUpdate();
      try {
        SortList(this.FRoots);
      } finally {
        if (VTree != null) VTree.EndUpdate();
      };
    };
    this.Clear = function () {
      var VIndex = 0;
      var VNode = null;
      if (this.FTree != null) this.FTree.BeginUpdate();
      try {
        if (this.FTree != null) this.FTree.FSelected = null;
        for (var $l = this.FAll.FLength - 1; $l >= 0; $l--) {
          VIndex = $l;
          VNode = this.FAll.GetItem(VIndex);
          VNode = rtl.freeLoc(VNode);
        };
        this.FAll.Clear();
        this.FRoots.Clear();
      } finally {
        if (this.FTree != null) this.FTree.EndUpdate();
      };
    };
    this.Delete = function (ANode) {
      if (!(ANode != null) || (this.FAll.IndexOf(ANode) < 0)) return;
      if (this.FTree != null) this.FTree.BeginUpdate();
      try {
        this.RemoveSubtree(ANode);
      } finally {
        if (this.FTree != null) this.FTree.EndUpdate();
      };
    };
    this.GetFirstNode = function () {
      var Result = null;
      if (this.FRoots.FLength > 0) {
        Result = this.FRoots.GetItem(0)}
       else Result = null;
      return Result;
    };
    this.IndexOf = function (ANode) {
      var Result = 0;
      Result = this.FAll.IndexOf(ANode);
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ATree",$mod.$rtti["TCustomTreeView"]]]);
  });
  rtl.createClass(this,"TCustomTreeView",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FIndent = 0;
      this.FItems = null;
      this.FOnChange = null;
      this.FOnCollapsed = null;
      this.FOnCollapsing = null;
      this.FOnExpanded = null;
      this.FOnExpanding = null;
      this.FRowHeight = 0;
      this.FSelected = null;
      this.FShowButtons = false;
      this.FShowLines = false;
      this.FShowRoot = false;
    };
    this.$final = function () {
      this.FItems = undefined;
      this.FOnChange = undefined;
      this.FOnCollapsed = undefined;
      this.FOnCollapsing = undefined;
      this.FOnExpanded = undefined;
      this.FOnExpanding = undefined;
      this.FSelected = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.SetIndent = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FIndent !== AValue) {
        this.FIndent = AValue;
        this.Changed();
      };
    };
    this.SetRowHeight = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FRowHeight !== AValue) {
        this.FRowHeight = AValue;
        this.Changed();
      };
    };
    this.SetSelected = function (AValue) {
      if (this.FSelected === AValue) return;
      if ((AValue != null) && (AValue.FNodes !== this.FItems)) return;
      this.FSelected = AValue;
      this.Changed();
      this.DoChange();
    };
    this.SetShowButtons = function (AValue) {
      if (this.FShowButtons !== AValue) {
        this.FShowButtons = AValue;
        this.Changed();
      };
    };
    this.SetShowLines = function (AValue) {
      if (this.FShowLines !== AValue) {
        this.FShowLines = AValue;
        this.Changed();
      };
    };
    this.SetShowRoot = function (AValue) {
      if (this.FShowRoot !== AValue) {
        this.FShowRoot = AValue;
        this.Changed();
      };
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) this.RenderTree();
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.CollectVisible = function (AList) {
      var $Self = this;
      function AddNode(ANode) {
        var I = 0;
        if (!(ANode != null)) return;
        AList.Add(ANode);
        if (ANode.GetExpanded()) for (var $l = 0, $end = ANode.GetCount() - 1; $l <= $end; $l++) {
          I = $l;
          AddNode(ANode.GetItem(I));
        };
      };
      var I = 0;
      var J = 0;
      var VRoot = null;
      for (var $l = 0, $end = this.FItems.GetRootCount() - 1; $l <= $end; $l++) {
        I = $l;
        VRoot = this.FItems.GetRoot(I);
        if (this.FShowRoot) {
          AddNode(VRoot)}
         else for (var $l1 = 0, $end1 = VRoot.GetCount() - 1; $l1 <= $end1; $l1++) {
          J = $l1;
          AddNode(VRoot.GetItem(J));
        };
      };
    };
    this.DoChange = function () {
      if (this.FOnChange != null) this.FOnChange(this);
    };
    this.DoCollapsed = function (ANode) {
      if (this.FOnCollapsed != null) this.FOnCollapsed(this,ANode);
    };
    this.DoCollapsing = function (ANode) {
      var Result = false;
      Result = true;
      if (this.FOnCollapsing != null) this.FOnCollapsing(this,ANode,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.DoExpanded = function (ANode) {
      if (this.FOnExpanded != null) this.FOnExpanded(this,ANode);
    };
    this.DoExpanding = function (ANode) {
      var Result = false;
      Result = true;
      if (this.FOnExpanding != null) this.FOnExpanding(this,ANode,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.FindNodeElement = function (ANode) {
      var Result = null;
      Result = null;
      if (!(ANode != null) || !(this.FHandleElement != null)) return Result;
      Result = this.FHandleElement.querySelector('[data-wcl-node="' + pas.SysUtils.IntToStr(ANode.GetAbsoluteIndex()) + '"]');
      return Result;
    };
    this.NodeFromEvent = function (AEvent) {
      var Result = null;
      var VElement = null;
      var VIndex = 0;
      Result = null;
      if (!(AEvent != null)) return Result;
      VElement = pas.Web.TJSEventHelper.GetCurrentTargetElement.call(AEvent);
      if (!(VElement != null)) return Result;
      if (!VElement.hasAttribute("data-wcl-node")) return Result;
      VIndex = pas.SysUtils.StrToIntDef(VElement.getAttribute("data-wcl-node"),-1);
      if ((VIndex >= 0) && (VIndex < this.FItems.GetCount())) Result = this.FItems.GetItem(VIndex);
      return Result;
    };
    this.RenderNode = function (AUl, ANode) {
      var VLi = null;
      var VRow = null;
      var VToggle = null;
      var VIcon = null;
      var VText = null;
      var VChildUl = null;
      var I = 0;
      if (!(ANode != null)) return;
      VLi = document.createElement("li");
      VLi.classList.add("wcl-tree-node");
      if (ANode.GetSelected()) VLi.classList.add("wcl-tree-selected");
      VLi.setAttribute("data-wcl-node",pas.SysUtils.IntToStr(ANode.GetAbsoluteIndex()));
      VRow = document.createElement("div");
      VRow.classList.add("wcl-tree-row");
      VRow.setAttribute("data-wcl-node",pas.SysUtils.IntToStr(ANode.GetAbsoluteIndex()));
      if (this.FRowHeight > 0) VRow.style.setProperty("min-height",pas.SysUtils.IntToStr(this.FRowHeight) + "px");
      VToggle = document.createElement("span");
      VToggle.classList.add("wcl-tree-toggle");
      VToggle.setAttribute("data-wcl-node",pas.SysUtils.IntToStr(ANode.GetAbsoluteIndex()));
      if (this.FShowButtons && ANode.GetHasChildren()) {
        if (ANode.GetExpanded()) {
          VToggle.textContent = "▾"}
         else VToggle.textContent = "▸";
        VToggle.addEventListener("click",rtl.createCallback(this,"NodeToggleClick"));
      };
      VRow.appendChild(VToggle);
      if (ANode.FImageUrl !== "") {
        VIcon = document.createElement("img");
        VIcon.classList.add("wcl-tree-icon");
        VIcon.setAttribute("src",ANode.FImageUrl);
        VIcon.setAttribute("alt","");
        VRow.appendChild(VIcon);
      };
      VText = document.createElement("span");
      VText.classList.add("wcl-tree-text");
      VText.textContent = ANode.FText;
      VRow.appendChild(VText);
      VRow.addEventListener("click",rtl.createCallback(this,"NodeClick"));
      VRow.addEventListener("dblclick",rtl.createCallback(this,"NodeDblClick"));
      VLi.appendChild(VRow);
      if (ANode.GetHasChildren() && ANode.GetExpanded()) {
        VChildUl = document.createElement("ul");
        VChildUl.classList.add("wcl-tree-children");
        if (this.FIndent > 0) VChildUl.style.setProperty("padding-left",pas.SysUtils.IntToStr(this.FIndent) + "px");
        for (var $l = 0, $end = ANode.GetCount() - 1; $l <= $end; $l++) {
          I = $l;
          this.RenderNode(VChildUl,ANode.GetItem(I));
        };
        VLi.appendChild(VChildUl);
      };
      AUl.appendChild(VLi);
    };
    this.RenderTree = function () {
      var VRoot = null;
      var VNode = null;
      var I = 0;
      var J = 0;
      var VScrollTop = 0;
      if (!(this.FItems != null) || !(this.FHandleElement != null)) return;
      VScrollTop = this.FHandleElement.scrollTop;
      this.FHandleElement.innerHTML = "";
      this.FHandleElement.style.setProperty("overflow","auto");
      this.FHandleElement.classList.add("wcl-tree");
      if (this.FShowLines) {
        this.FHandleElement.classList.add("wcl-tree-lines")}
       else this.FHandleElement.classList.remove("wcl-tree-lines");
      VRoot = document.createElement("ul");
      VRoot.classList.add("wcl-tree-root");
      for (var $l = 0, $end = this.FItems.GetRootCount() - 1; $l <= $end; $l++) {
        I = $l;
        VNode = this.FItems.GetRoot(I);
        if (this.FShowRoot) {
          this.RenderNode(VRoot,VNode)}
         else for (var $l1 = 0, $end1 = VNode.GetCount() - 1; $l1 <= $end1; $l1++) {
          J = $l1;
          this.RenderNode(VRoot,VNode.GetItem(J));
        };
      };
      this.FHandleElement.appendChild(VRoot);
      this.FHandleElement.scrollTop = VScrollTop;
    };
    this.ScrollToNode = function (ANode) {
      var VElement = null;
      VElement = this.FindNodeElement(ANode);
      if (VElement != null) VElement.scrollIntoView({ block: 'nearest' });
    };
    this.SelectNode = function (ANode, AFocus) {
      if (!(ANode != null)) return;
      if (this.FSelected !== ANode) this.SetSelected(ANode);
      if (AFocus) this.ScrollToNode(ANode);
    };
    this.UpdateVisibleSelection = function (ADelta) {
      var VList = null;
      var VIndex = 0;
      VList = pas["Generics.Collections"].TList$G7.$create("Create$1");
      try {
        this.CollectVisible(VList);
        if (VList.FLength === 0) return;
        if (this.FSelected != null) {
          VIndex = VList.IndexOf(this.FSelected)}
         else VIndex = -1;
        if (VIndex < 0) {
          if (ADelta >= 0) {
            VIndex = 0}
           else VIndex = VList.FLength - 1;
        } else {
          VIndex = VIndex + ADelta;
          if (VIndex < 0) VIndex = 0;
          if (VIndex > (VList.FLength - 1)) VIndex = VList.FLength - 1;
        };
        this.SelectNode(VList.GetItem(VIndex),true);
      } finally {
        VList = rtl.freeLoc(VList);
      };
    };
    this.ExpandSelected = function () {
      if (!(this.FSelected != null)) return;
      if (this.FSelected.GetHasChildren()) {
        if (!this.FSelected.GetExpanded()) {
          this.FSelected.Expand(false)}
         else this.SelectNode(this.FSelected.GetItem(0),true);
      };
    };
    this.CollapseSelected = function () {
      if (!(this.FSelected != null)) return;
      if (this.FSelected.GetHasChildren() && this.FSelected.GetExpanded()) {
        this.FSelected.Collapse(false)}
       else if (this.FSelected.FParent != null) this.SelectNode(this.FSelected.FParent,true);
    };
    this.SelectFirst = function () {
      var VList = null;
      VList = pas["Generics.Collections"].TList$G7.$create("Create$1");
      try {
        this.CollectVisible(VList);
        if (VList.FLength > 0) this.SelectNode(VList.GetItem(0),true);
      } finally {
        VList = rtl.freeLoc(VList);
      };
    };
    this.SelectLast = function () {
      var VList = null;
      VList = pas["Generics.Collections"].TList$G7.$create("Create$1");
      try {
        this.CollectVisible(VList);
        if (VList.FLength > 0) this.SelectNode(VList.GetItem(VList.FLength - 1),true);
      } finally {
        VList = rtl.freeLoc(VList);
      };
    };
    this.NodeClick = function (AEvent) {
      var Result = false;
      var VNode = null;
      Result = true;
      VNode = this.NodeFromEvent(AEvent);
      if (VNode != null) {
        this.SetFocus();
        this.SetSelected(VNode);
      };
      return Result;
    };
    this.NodeDblClick = function (AEvent) {
      var Result = false;
      var VNode = null;
      AEvent.stopPropagation();
      AEvent.preventDefault();
      VNode = this.NodeFromEvent(AEvent);
      if (VNode != null) {
        this.SetFocus();
        this.SetSelected(VNode);
        if (VNode.GetHasChildren()) VNode.ToggleExpanded();
      };
      this.DblClick();
      Result = true;
      return Result;
    };
    this.NodeToggleClick = function (AEvent) {
      var Result = false;
      var VNode = null;
      AEvent.stopPropagation();
      AEvent.preventDefault();
      VNode = this.NodeFromEvent(AEvent);
      if ((VNode != null) && VNode.GetHasChildren()) {
        this.SetFocus();
        VNode.ToggleExpanded();
      };
      Result = true;
      return Result;
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.KeyDown = function (Key, Shift) {
      pas.Controls.TWinControl.KeyDown.call(this,Key,rtl.refSet(Shift));
      var $tmp = Key.get();
      if ($tmp === 38) {
        this.UpdateVisibleSelection(-1);
        Key.set(0);
      } else if ($tmp === 40) {
        this.UpdateVisibleSelection(1);
        Key.set(0);
      } else if ($tmp === 37) {
        this.CollapseSelected();
        Key.set(0);
      } else if ($tmp === 39) {
        this.ExpandSelected();
        Key.set(0);
      } else if ($tmp === 36) {
        this.SelectFirst();
        Key.set(0);
      } else if ($tmp === 35) {
        this.SelectLast();
        Key.set(0);
      } else if (($tmp === 13) || ($tmp === 32)) {
        if (this.FSelected != null) this.FSelected.ToggleExpanded();
        Key.set(0);
      };
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 200;
      Result.cy = 200;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      $impl._RegisterWCLTreeRules();
      this.FItems = $mod.TTreeNodes.$create("Create$1",[this]);
      this.FSelected = null;
      this.FIndent = 18;
      this.FRowHeight = 0;
      this.FShowButtons = true;
      this.FShowLines = true;
      this.FShowRoot = true;
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
      this.FSelected = null;
      rtl.free(this,"FItems");
      this.FItems = null;
      pas.Controls.TControl.Destroy.call(this);
    };
    this.AlphaSort = function () {
      this.FItems.AlphaSort();
    };
    this.FullCollapse = function () {
      var VIndex = 0;
      this.BeginUpdate();
      try {
        for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
          VIndex = $l;
          this.FItems.GetItem(VIndex).FExpanded = false;
        };
      } finally {
        this.EndUpdate();
      };
    };
    this.FullExpand = function () {
      var VIndex = 0;
      this.BeginUpdate();
      try {
        for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
          VIndex = $l;
          if (this.FItems.GetItem(VIndex).GetHasChildren()) this.FItems.GetItem(VIndex).FExpanded = true;
        };
      } finally {
        this.EndUpdate();
      };
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TTreeView",this.TCustomTreeView,function () {
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
    $r.addProperty("Indent",2,rtl.nativeint,"FIndent","SetIndent",{Default: 18});
    $r.addProperty("Items",0,$mod.$rtti["TTreeNodes"],"FItems","");
    $r.addProperty("Left",2,rtl.nativeint,"FLeft","SetLeft");
    $r.addProperty("ParentFont",2,rtl.boolean,"FParentFont","SetParentFont");
    $r.addProperty("ParentShowHint",2,rtl.boolean,"FParentShowHint","SetParentShowHint");
    $r.addProperty("PopupMenu",2,pas.Controls.$rtti["TCustomPopupMenu"],"FPopupMenu","SetPopupMenu");
    $r.addProperty("RowHeight",2,rtl.nativeint,"FRowHeight","SetRowHeight",{Default: 0});
    $r.addProperty("ShowButtons",2,rtl.boolean,"FShowButtons","SetShowButtons",{Default: true});
    $r.addProperty("ShowHint",2,rtl.boolean,"FShowHint","SetShowHint");
    $r.addProperty("ShowLines",2,rtl.boolean,"FShowLines","SetShowLines",{Default: true});
    $r.addProperty("ShowRoot",2,rtl.boolean,"FShowRoot","SetShowRoot",{Default: true});
    $r.addProperty("TabOrder",2,rtl.nativeint,"FTabOrder","SetTabOrder");
    $r.addProperty("TabStop",2,rtl.boolean,"FTabStop","SetTabStop");
    $r.addProperty("Top",2,rtl.nativeint,"FTop","SetTop");
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible");
    $r.addProperty("Width",2,rtl.nativeint,"FWidth","SetWidth");
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
    $r.addProperty("OnClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnClick","FOnClick");
    $r.addProperty("OnCollapsed",0,$mod.$rtti["TTreeViewExpandedEvent"],"FOnCollapsed","FOnCollapsed");
    $r.addProperty("OnCollapsing",0,$mod.$rtti["TTreeViewCollapsingEvent"],"FOnCollapsing","FOnCollapsing");
    $r.addProperty("OnDblClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnDblClick","FOnDblClick");
    $r.addProperty("OnEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnEnter","FOnEnter");
    $r.addProperty("OnExit",0,pas.Classes.$rtti["TNotifyEvent"],"FOnExit","FOnExit");
    $r.addProperty("OnExpanded",0,$mod.$rtti["TTreeViewExpandedEvent"],"FOnExpanded","FOnExpanded");
    $r.addProperty("OnExpanding",0,$mod.$rtti["TTreeViewExpandingEvent"],"FOnExpanding","FOnExpanding");
    $r.addProperty("OnKeyDown",0,pas.Controls.$rtti["TKeyEvent"],"FOnKeyDown","FOnKeyDown");
    $r.addProperty("OnKeyPress",0,pas.Controls.$rtti["TKeyPressEvent"],"FOnKeyPress","FOnKeyPress");
    $r.addProperty("OnKeyUp",0,pas.Controls.$rtti["TKeyEvent"],"FOnKeyUp","FOnKeyUp");
    $r.addProperty("OnMouseDown",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseDown","FOnMouseDown");
    $r.addProperty("OnMouseEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseEnter","FOnMouseEnter");
    $r.addProperty("OnMouseLeave",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseLeave","FOnMouseLeave");
    $r.addProperty("OnMouseMove",0,pas.Controls.$rtti["TMouseMoveEvent"],"FOnMouseMove","FOnMouseMove");
    $r.addProperty("OnMouseUp",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseUp","FOnMouseUp");
    $r.addProperty("OnMouseWheel",0,pas.Controls.$rtti["TMouseWheelEvent"],"FOnMouseWheel","FOnMouseWheel");
  });
  this.$rtti.$Class("TListItems");
  this.$rtti.$Class("TListItem");
  this.$rtti.$Class("TListColumn");
  this.$rtti.$Class("TListColumns");
  this.$rtti.$Class("TCustomListView");
  this.TItemChange = {"0": "ctText", ctText: 0, "1": "ctImage", ctImage: 1, "2": "ctState", ctState: 2};
  this.$rtti.$Enum("TItemChange",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TItemChange});
  this.TViewStyle = {"0": "vsIcon", vsIcon: 0, "1": "vsSmallIcon", vsSmallIcon: 1, "2": "vsList", vsList: 2, "3": "vsReport", vsReport: 3};
  this.$rtti.$Enum("TViewStyle",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TViewStyle});
  this.TSortType = {"0": "stNone", stNone: 0, "1": "stData", stData: 1, "2": "stText", stText: 2, "3": "stBoth", stBoth: 3};
  this.$rtti.$Enum("TSortType",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TSortType});
  this.TSortDirection = {"0": "sdAscending", sdAscending: 0, "1": "sdDescending", sdDescending: 1};
  this.$rtti.$Enum("TSortDirection",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TSortDirection});
  this.TSortIndicator = {"0": "siNone", siNone: 0, "1": "siAscending", siAscending: 1, "2": "siDescending", siDescending: 2};
  this.$rtti.$Enum("TSortIndicator",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TSortIndicator});
  this.$rtti.$MethodVar("TLVChangeEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Item",this.$rtti["TListItem"]],["Change",this.$rtti["TItemChange"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TLVSelectItemEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Item",this.$rtti["TListItem"]],["Selected",rtl.boolean]]), methodkind: 0});
  this.$rtti.$MethodVar("TLVColumnClickEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Column",this.$rtti["TListColumn"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TLVCheckedItemEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Item",this.$rtti["TListItem"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TLVCompareEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Item1",this.$rtti["TListItem"]],["Item2",this.$rtti["TListItem"]],["Data",rtl.longint],["Compare",rtl.longint,1]]), methodkind: 0});
  rtl.createClass(this,"TListItem",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FCaption = "";
      this.FChecked = false;
      this.FData = null;
      this.FImageUrl = "";
      this.FOwner = null;
      this.FSelected = false;
      this.FSubItems = null;
    };
    this.$final = function () {
      this.FData = undefined;
      this.FOwner = undefined;
      this.FSubItems = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.GetIndex = function () {
      var Result = 0;
      if (this.FOwner != null) {
        Result = this.FOwner.IndexOf(this)}
       else Result = -1;
      return Result;
    };
    this.GetListView = function () {
      var Result = null;
      if (this.FOwner != null) {
        Result = this.FOwner.FOwner}
       else Result = null;
      return Result;
    };
    this.GetSubItems = function () {
      var Result = null;
      Result = this.FSubItems;
      return Result;
    };
    this.SetCaption = function (AValue) {
      if (this.FCaption !== AValue) {
        this.FCaption = AValue;
        this.ItemChanged($mod.TItemChange.ctText);
      };
    };
    this.SetChecked = function (AValue) {
      if (this.FChecked !== AValue) {
        this.FChecked = AValue;
        this.ItemChanged($mod.TItemChange.ctState);
      };
    };
    this.SetImageUrl = function (AValue) {
      if (this.FImageUrl !== AValue) {
        this.FImageUrl = AValue;
        this.ItemChanged($mod.TItemChange.ctImage);
      };
    };
    this.SetSelected = function (AValue) {
      var VList = null;
      if (this.FSelected === AValue) return;
      VList = this.GetListView();
      if (AValue && (VList != null) && !VList.FMultiSelect) VList.ClearSelection();
      this.FSelected = AValue;
      if (VList != null) {
        VList.Changed();
        VList.DoItemChange(this,$mod.TItemChange.ctState);
        VList.DoSelectItem(this,AValue);
      };
    };
    this.SetSubItems = function (AValue) {
      if (AValue != null) {
        this.FSubItems.BeginUpdate();
        try {
          this.FSubItems.Assign(AValue);
        } finally {
          this.FSubItems.EndUpdate();
        };
      } else this.FSubItems.Clear();
    };
    this.SubItemsChanged = function (Sender) {
      this.ItemChanged($mod.TItemChange.ctText);
    };
    this.ItemChanged = function (AChange) {
      var VList = null;
      VList = this.GetListView();
      if (VList != null) {
        VList.DoItemChange(this,AChange);
        VList.Changed();
      };
    };
    this.Create$1 = function (AOwner) {
      pas.System.TObject.Create.call(this);
      this.FCaption = "";
      this.FChecked = false;
      this.FData = null;
      this.FImageUrl = "";
      this.FOwner = AOwner;
      this.FSelected = false;
      this.FSubItems = pas.Classes.TStringList.$create("Create$1");
      this.FSubItems.FOnChange = rtl.createCallback(this,"SubItemsChanged");
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FSubItems");
      this.FSubItems = null;
      pas.System.TObject.Destroy.call(this);
    };
    this.Delete = function () {
      if (this.FOwner != null) this.FOwner.Delete(this.GetIndex());
    };
    this.MakeVisible = function (APartialOK) {
      var VList = null;
      VList = this.GetListView();
      if (VList != null) VList.ScrollToItem(this);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",$mod.$rtti["TListItems"]]]);
  });
  rtl.createClass(this,"TListItems",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FItems = null;
      this.FOwner = null;
    };
    this.$final = function () {
      this.FItems = undefined;
      this.FOwner = undefined;
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
    this.ReadData = function (Stream) {
      if (Stream != null) Stream.SetPosition(Stream.GetSize());
    };
    this.WriteData = function (Stream) {
    };
    this.DefineProperties = function (Filer) {
      pas.Classes.TPersistent.DefineProperties.call(this,Filer);
      Filer.DefineBinaryProperty("Data",rtl.createCallback(this,"ReadData"),rtl.createCallback(this,"WriteData"),false);
      Filer.DefineBinaryProperty("LazData",rtl.createCallback(this,"ReadData"),rtl.createCallback(this,"WriteData"),false);
    };
    this.Create$1 = function (AOwner) {
      pas.System.TObject.Create.call(this);
      this.FOwner = AOwner;
      this.FItems = pas["Generics.Collections"].TList$G8.$create("Create$1");
      return this;
    };
    this.Destroy = function () {
      var VIndex = 0;
      var VItem = null;
      if (this.FItems != null) {
        for (var $l = this.FItems.FLength - 1; $l >= 0; $l--) {
          VIndex = $l;
          VItem = this.FItems.GetItem(VIndex);
          VItem = rtl.freeLoc(VItem);
        };
        rtl.free(this,"FItems");
        this.FItems = null;
      };
      pas.System.TObject.Destroy.call(this);
    };
    this.Add = function () {
      var Result = null;
      if (this.FOwner != null) this.FOwner.BeginUpdate();
      try {
        Result = $mod.TListItem.$create("Create$1",[this]);
        this.FItems.Add(Result);
      } finally {
        if (this.FOwner != null) this.FOwner.EndUpdate();
      };
      return Result;
    };
    this.Insert = function (AIndex) {
      var Result = null;
      if ((AIndex < 0) || (AIndex > this.FItems.FLength)) AIndex = this.FItems.FLength;
      if (this.FOwner != null) this.FOwner.BeginUpdate();
      try {
        Result = $mod.TListItem.$create("Create$1",[this]);
        this.FItems.Insert(AIndex,Result);
      } finally {
        if (this.FOwner != null) this.FOwner.EndUpdate();
      };
      return Result;
    };
    this.Delete = function (AIndex) {
      var VItem = null;
      if ((AIndex < 0) || (AIndex >= this.FItems.FLength)) return;
      if (this.FOwner != null) this.FOwner.BeginUpdate();
      try {
        VItem = this.FItems.GetItem(AIndex);
        this.FItems.Delete(AIndex);
        if ((this.FOwner != null) && (this.FOwner.FAnchor === VItem)) this.FOwner.FAnchor = null;
        VItem = rtl.freeLoc(VItem);
      } finally {
        if (this.FOwner != null) this.FOwner.EndUpdate();
      };
    };
    this.Clear = function () {
      var VIndex = 0;
      var VItem = null;
      if (this.FOwner != null) this.FOwner.BeginUpdate();
      try {
        for (var $l = this.FItems.FLength - 1; $l >= 0; $l--) {
          VIndex = $l;
          VItem = this.FItems.GetItem(VIndex);
          VItem = rtl.freeLoc(VItem);
        };
        this.FItems.Clear();
        if (this.FOwner != null) this.FOwner.FAnchor = null;
      } finally {
        if (this.FOwner != null) this.FOwner.EndUpdate();
      };
    };
    this.IndexOf = function (AItem) {
      var Result = 0;
      Result = this.FItems.IndexOf(AItem);
      return Result;
    };
    this.BeginUpdate = function () {
      if (this.FOwner != null) this.FOwner.BeginUpdate();
    };
    this.EndUpdate = function () {
      if (this.FOwner != null) this.FOwner.EndUpdate();
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",$mod.$rtti["TCustomListView"]]]);
  });
  rtl.createClass(this,"TListColumn",pas.Classes.TCollectionItem,function () {
    this.$init = function () {
      pas.Classes.TCollectionItem.$init.call(this);
      this.FAlignment = 0;
      this.FAutoSize = false;
      this.FCaption = "";
      this.FImageIndex = 0;
      this.FMaxWidth = 0;
      this.FMinWidth = 0;
      this.FSortIndicator = 0;
      this.FTag = 0;
      this.FVisible = false;
      this.FWidth = 0;
    };
    this.SetAlignment = function (AValue) {
      if (this.FAlignment !== AValue) {
        this.FAlignment = AValue;
        this.ColumnChanged();
      };
    };
    this.SetAutoSize = function (AValue) {
      if (this.FAutoSize !== AValue) {
        this.FAutoSize = AValue;
        this.ColumnChanged();
      };
    };
    this.SetCaption = function (AValue) {
      if (this.FCaption !== AValue) {
        this.FCaption = AValue;
        this.ColumnChanged();
      };
    };
    this.SetMaxWidth = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FMaxWidth !== AValue) {
        this.FMaxWidth = AValue;
        this.ColumnChanged();
      };
    };
    this.SetMinWidth = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FMinWidth !== AValue) {
        this.FMinWidth = AValue;
        this.ColumnChanged();
      };
    };
    this.SetSortIndicator = function (AValue) {
      if (this.FSortIndicator !== AValue) {
        this.FSortIndicator = AValue;
        this.ColumnChanged();
      };
    };
    this.SetVisible = function (AValue) {
      if (this.FVisible !== AValue) {
        this.FVisible = AValue;
        this.ColumnChanged();
      };
    };
    this.SetWidth = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FWidth !== AValue) {
        this.FWidth = AValue;
        this.ColumnChanged();
      };
    };
    this.ColumnChanged = function () {
      this.Changed(false);
    };
    this.GetDisplayName = function () {
      var Result = "";
      if (this.FCaption !== "") {
        Result = this.FCaption}
       else Result = pas.Classes.TCollectionItem.GetDisplayName.call(this);
      return Result;
    };
    this.Create$1 = function (ACollection) {
      pas.Classes.TCollectionItem.Create$1.call(this,ACollection);
      this.FAlignment = pas.Classes.TAlignment.taLeftJustify;
      this.FAutoSize = false;
      this.FCaption = "";
      this.FImageIndex = -1;
      this.FMaxWidth = 0;
      this.FMinWidth = 0;
      this.FSortIndicator = $mod.TSortIndicator.siNone;
      this.FTag = 0;
      this.FVisible = true;
      this.FWidth = 100;
      return this;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ACollection",pas.Classes.$rtti["TCollection"]]]);
    $r.addProperty("Alignment",2,pas.Classes.$rtti["TAlignment"],"FAlignment","SetAlignment",{Default: pas.Classes.TAlignment.taLeftJustify});
    $r.addProperty("AutoSize",2,rtl.boolean,"FAutoSize","SetAutoSize",{Default: false});
    $r.addProperty("Caption",2,rtl.string,"FCaption","SetCaption");
    $r.addProperty("ImageIndex",0,rtl.nativeint,"FImageIndex","FImageIndex",{Default: -1});
    $r.addProperty("MaxWidth",2,rtl.nativeint,"FMaxWidth","SetMaxWidth",{Default: 0});
    $r.addProperty("MinWidth",2,rtl.nativeint,"FMinWidth","SetMinWidth",{Default: 0});
    $r.addProperty("SortIndicator",2,$mod.$rtti["TSortIndicator"],"FSortIndicator","SetSortIndicator",{Default: $mod.TSortIndicator.siNone});
    $r.addProperty("Tag",0,rtl.nativeint,"FTag","FTag",{Default: 0});
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible",{Default: true});
    $r.addProperty("Width",2,rtl.nativeint,"FWidth","SetWidth",{Default: 100});
  });
  rtl.createClass(this,"TListColumns",pas.Classes.TCollection,function () {
    this.$init = function () {
      pas.Classes.TCollection.$init.call(this);
      this.FOwner = null;
    };
    this.$final = function () {
      this.FOwner = undefined;
      pas.Classes.TCollection.$final.call(this);
    };
    this.GetColumn = function (AIndex) {
      var Result = null;
      Result = pas.Classes.TCollection.GetItem.call(this,AIndex);
      return Result;
    };
    this.SetColumn = function (AIndex, AValue) {
      pas.Classes.TCollection.SetItem.call(this,AIndex,AValue);
    };
    this.GetOwner = function () {
      var Result = null;
      Result = this.FOwner;
      return Result;
    };
    this.Update = function (AItem) {
      pas.Classes.TCollection.Update.call(this,AItem);
      if (this.FOwner != null) this.FOwner.Changed();
    };
    this.Create$2 = function (AOwner) {
      pas.Classes.TCollection.Create$1.call(this,$mod.TListColumn);
      this.FOwner = AOwner;
      return this;
    };
    this.Add$1 = function () {
      var Result = null;
      Result = pas.Classes.TCollection.Add.call(this);
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["AOwner",$mod.$rtti["TCustomListView"]]]);
  });
  rtl.createClass(this,"TCustomListView",pas.Controls.TWinControl,function () {
    this.$init = function () {
      pas.Controls.TWinControl.$init.call(this);
      this.FAutoSort = false;
      this.FCheckboxes = false;
      this.FColumns = null;
      this.FGridLines = false;
      this.FItems = null;
      this.FMultiSelect = false;
      this.FOnChange = null;
      this.FOnColumnClick = null;
      this.FOnCompare = null;
      this.FOnItemChecked = null;
      this.FOnSelectItem = null;
      this.FReadOnly = false;
      this.FRowHeight = 0;
      this.FRowSelect = false;
      this.FShowColumnHeaders = false;
      this.FSortColumn = 0;
      this.FSortDirection = 0;
      this.FSortType = 0;
      this.FViewStyle = 0;
      this.FAnchor = null;
    };
    this.$final = function () {
      this.FColumns = undefined;
      this.FItems = undefined;
      this.FOnChange = undefined;
      this.FOnColumnClick = undefined;
      this.FOnCompare = undefined;
      this.FOnItemChecked = undefined;
      this.FOnSelectItem = undefined;
      this.FAnchor = undefined;
      pas.Controls.TWinControl.$final.call(this);
    };
    this.GetColumn = function (AIndex) {
      var Result = null;
      Result = this.FColumns.GetColumn(AIndex);
      return Result;
    };
    this.GetColumnCount = function () {
      var Result = 0;
      Result = this.FColumns.GetCount();
      return Result;
    };
    this.GetItemIndex = function () {
      var Result = 0;
      var VItem = null;
      VItem = this.GetSelected();
      if (VItem != null) {
        Result = VItem.GetIndex()}
       else Result = -1;
      return Result;
    };
    this.GetSelCount = function () {
      var Result = 0;
      var VIndex = 0;
      Result = 0;
      for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
        VIndex = $l;
        if (this.FItems.GetItem(VIndex).FSelected) Result += 1;
      };
      return Result;
    };
    this.GetSelected = function () {
      var Result = null;
      var VIndex = 0;
      Result = null;
      for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
        VIndex = $l;
        if (this.FItems.GetItem(VIndex).FSelected) {
          Result = this.FItems.GetItem(VIndex);
          return Result;
        };
      };
      return Result;
    };
    this.SetAutoSort = function (AValue) {
      if (this.FAutoSort !== AValue) this.FAutoSort = AValue;
    };
    this.SetCheckboxes = function (AValue) {
      if (this.FCheckboxes !== AValue) {
        this.FCheckboxes = AValue;
        this.Changed();
      };
    };
    this.SetGridLines = function (AValue) {
      if (this.FGridLines !== AValue) {
        this.FGridLines = AValue;
        this.Changed();
      };
    };
    this.SetItemIndex = function (AValue) {
      if ((AValue >= 0) && (AValue < this.FItems.GetCount())) {
        this.SetSelected(this.FItems.GetItem(AValue))}
       else this.SetSelected(null);
    };
    this.SetMultiSelect = function (AValue) {
      if (this.FMultiSelect !== AValue) {
        this.FMultiSelect = AValue;
        if (!this.FMultiSelect) this.ClearSelection();
        this.Changed();
      };
    };
    this.SetReadOnly = function (AValue) {
      if (this.FReadOnly !== AValue) this.FReadOnly = AValue;
    };
    this.SetRowHeight = function (AValue) {
      if (AValue < 0) AValue = 0;
      if (this.FRowHeight !== AValue) {
        this.FRowHeight = AValue;
        this.Changed();
      };
    };
    this.SetRowSelect = function (AValue) {
      if (this.FRowSelect !== AValue) {
        this.FRowSelect = AValue;
        this.Changed();
      };
    };
    this.SetSelected = function (AValue) {
      var VOld = null;
      VOld = this.GetSelected();
      if (VOld === AValue) return;
      this.ClearSelection();
      if (VOld != null) this.DoSelectItem(VOld,false);
      if (AValue != null) {
        AValue.FSelected = true;
        this.DoSelectItem(AValue,true);
      };
      this.Changed();
      this.DoItemChange(AValue,$mod.TItemChange.ctState);
    };
    this.SetShowColumnHeaders = function (AValue) {
      if (this.FShowColumnHeaders !== AValue) {
        this.FShowColumnHeaders = AValue;
        this.Changed();
      };
    };
    this.SetSortColumn = function (AValue) {
      if (this.FSortColumn !== AValue) {
        this.FSortColumn = AValue;
        this.Changed();
      };
    };
    this.SetSortDirection = function (AValue) {
      if (this.FSortDirection !== AValue) {
        this.FSortDirection = AValue;
        this.Changed();
      };
    };
    this.SetSortType = function (AValue) {
      if (this.FSortType !== AValue) this.FSortType = AValue;
    };
    this.SetViewStyle = function (AValue) {
      if (this.FViewStyle !== AValue) {
        this.FViewStyle = AValue;
        this.Changed();
      };
    };
    this.Changed = function () {
      pas.Controls.TControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) this.RenderView();
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
    this.DoItemChange = function (AItem, AChange) {
      if (this.FOnChange != null) this.FOnChange(this,AItem,AChange);
    };
    this.DoItemChecked = function (AItem) {
      if (this.FOnItemChecked != null) this.FOnItemChecked(this,AItem);
    };
    this.DoSelectItem = function (AItem, ASelected) {
      if (this.FOnSelectItem != null) this.FOnSelectItem(this,AItem,ASelected);
    };
    this.FindItemElement = function (AItem) {
      var Result = null;
      Result = null;
      if (!(AItem != null) || !(this.FHandleElement != null)) return Result;
      Result = this.FHandleElement.querySelector('[data-wcl-item="' + pas.SysUtils.IntToStr(AItem.GetIndex()) + '"].wcl-lv-row');
      return Result;
    };
    this.ItemFromEvent = function (AEvent) {
      var Result = null;
      var VElement = null;
      var VIndex = 0;
      Result = null;
      if (!(AEvent != null)) return Result;
      VElement = pas.Web.TJSEventHelper.GetCurrentTargetElement.call(AEvent);
      if (!(VElement != null) || !VElement.hasAttribute("data-wcl-item")) return Result;
      VIndex = pas.SysUtils.StrToIntDef(VElement.getAttribute("data-wcl-item"),-1);
      if ((VIndex >= 0) && (VIndex < this.FItems.GetCount())) Result = this.FItems.GetItem(VIndex);
      return Result;
    };
    this.ColumnFromEvent = function (AEvent) {
      var Result = null;
      var VElement = null;
      var VIndex = 0;
      Result = null;
      if (!(AEvent != null)) return Result;
      VElement = pas.Web.TJSEventHelper.GetCurrentTargetElement.call(AEvent);
      if (!(VElement != null) || !VElement.hasAttribute("data-wcl-col")) return Result;
      VIndex = pas.SysUtils.StrToIntDef(VElement.getAttribute("data-wcl-col"),-1);
      if ((VIndex >= 0) && (VIndex < this.FColumns.GetCount())) Result = this.FColumns.GetColumn(VIndex);
      return Result;
    };
    this.RenderView = function () {
      var VScrollTop = 0;
      if (!(this.FItems != null) || !(this.FColumns != null) || !(this.FHandleElement != null)) return;
      VScrollTop = this.FHandleElement.scrollTop;
      this.FHandleElement.innerHTML = "";
      this.FHandleElement.style.setProperty("overflow","auto");
      this.FHandleElement.classList.add("wcl-lv");
      var $tmp = this.FViewStyle;
      if ($tmp === $mod.TViewStyle.vsReport) {
        this.RenderReport()}
       else if ($tmp === $mod.TViewStyle.vsIcon) {
        this.RenderIcons()}
       else if ($tmp === $mod.TViewStyle.vsSmallIcon) {
        this.RenderRows(true)}
       else {
        this.RenderRows(false);
      };
      this.FHandleElement.scrollTop = VScrollTop;
    };
    this.RenderReport = function () {
      var VTable = null;
      var VColGroup = null;
      var VCol = null;
      var VThead = null;
      var VHeadRow = null;
      var VTh = null;
      var VTbody = null;
      var VTr = null;
      var VTd = null;
      var VInput = null;
      var VItem = null;
      var VColumn = null;
      var I = 0;
      var J = 0;
      var VWidth = 0;
      VTable = document.createElement("table");
      VTable.classList.add("wcl-lv-table");
      if (this.FGridLines) VTable.classList.add("wcl-lv-gridlines");
      VColGroup = document.createElement("colgroup");
      if (this.FCheckboxes) {
        VCol = document.createElement("col");
        VCol.style.setProperty("width","32px");
        VColGroup.appendChild(VCol);
      };
      for (var $l = 0, $end = this.FColumns.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        VColumn = this.FColumns.GetColumn(I);
        if (!VColumn.FVisible) continue;
        VCol = document.createElement("col");
        if (!VColumn.FAutoSize) {
          VWidth = VColumn.FWidth;
          if ((VColumn.FMinWidth > 0) && (VWidth < VColumn.FMinWidth)) VWidth = VColumn.FMinWidth;
          if ((VColumn.FMaxWidth > 0) && (VWidth > VColumn.FMaxWidth)) VWidth = VColumn.FMaxWidth;
          VCol.style.setProperty("width",pas.SysUtils.IntToStr(VWidth) + "px");
        };
        VColGroup.appendChild(VCol);
      };
      VTable.appendChild(VColGroup);
      if (this.FShowColumnHeaders) {
        VThead = document.createElement("thead");
        VHeadRow = document.createElement("tr");
        if (this.FCheckboxes) {
          VTh = document.createElement("th");
          VTh.classList.add("wcl-lv-checkcell");
          VHeadRow.appendChild(VTh);
        };
        for (var $l1 = 0, $end1 = this.FColumns.GetCount() - 1; $l1 <= $end1; $l1++) {
          I = $l1;
          VColumn = this.FColumns.GetColumn(I);
          if (!VColumn.FVisible) continue;
          VTh = document.createElement("th");
          VTh.setAttribute("data-wcl-col",pas.SysUtils.IntToStr(I));
          this.RenderHeader(VTh,VColumn);
          VTh.addEventListener("click",rtl.createCallback(this,"ColumnClickHandler"));
          VHeadRow.appendChild(VTh);
        };
        VThead.appendChild(VHeadRow);
        VTable.appendChild(VThead);
      };
      VTbody = document.createElement("tbody");
      for (var $l2 = 0, $end2 = this.FItems.GetCount() - 1; $l2 <= $end2; $l2++) {
        J = $l2;
        VItem = this.FItems.GetItem(J);
        VTr = document.createElement("tr");
        VTr.classList.add("wcl-lv-row");
        if (VItem.FSelected) VTr.classList.add("wcl-lv-selected");
        VTr.setAttribute("data-wcl-item",pas.SysUtils.IntToStr(J));
        if (this.FRowHeight > 0) VTr.style.setProperty("height",pas.SysUtils.IntToStr(this.FRowHeight) + "px");
        if (this.FCheckboxes) {
          VTd = document.createElement("td");
          VTd.classList.add("wcl-lv-checkcell");
          VInput = document.createElement("input");
          VInput.setAttribute("type","checkbox");
          VInput.setAttribute("data-wcl-item",pas.SysUtils.IntToStr(J));
          VInput.checked = VItem.FChecked;
          VInput.addEventListener("click",rtl.createCallback(this,"ItemCheckClick"));
          VTd.appendChild(VInput);
          VTr.appendChild(VTd);
        };
        for (var $l3 = 0, $end3 = this.FColumns.GetCount() - 1; $l3 <= $end3; $l3++) {
          I = $l3;
          VColumn = this.FColumns.GetColumn(I);
          if (!VColumn.FVisible) continue;
          VTd = document.createElement("td");
          VTd.style.setProperty("text-align",$impl.ListAlignmentCSS(VColumn.FAlignment));
          if (I === 0) {
            VTd.textContent = VItem.FCaption}
           else if ((I - 1) < VItem.GetSubItems().GetCount()) VTd.textContent = VItem.GetSubItems().Get(I - 1);
          VTr.appendChild(VTd);
        };
        VTr.addEventListener("click",rtl.createCallback(this,"ItemClick"));
        VTbody.appendChild(VTr);
      };
      VTable.appendChild(VTbody);
      this.FHandleElement.appendChild(VTable);
    };
    this.RenderRows = function (AWithIcon) {
      var VUl = null;
      var VLi = null;
      var VInput = null;
      var VIcon = null;
      var VText = null;
      var VItem = null;
      var I = 0;
      VUl = document.createElement("ul");
      VUl.classList.add("wcl-lv-list");
      for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        VItem = this.FItems.GetItem(I);
        VLi = document.createElement("li");
        VLi.classList.add("wcl-lv-item");
        VLi.classList.add("wcl-lv-row");
        if (VItem.FSelected) VLi.classList.add("wcl-lv-selected");
        VLi.setAttribute("data-wcl-item",pas.SysUtils.IntToStr(I));
        if (this.FRowHeight > 0) VLi.style.setProperty("min-height",pas.SysUtils.IntToStr(this.FRowHeight) + "px");
        if (this.FCheckboxes) {
          VInput = document.createElement("input");
          VInput.setAttribute("type","checkbox");
          VInput.setAttribute("data-wcl-item",pas.SysUtils.IntToStr(I));
          VInput.checked = VItem.FChecked;
          VInput.addEventListener("click",rtl.createCallback(this,"ItemCheckClick"));
          VLi.appendChild(VInput);
        };
        if (AWithIcon && (VItem.FImageUrl !== "")) {
          VIcon = document.createElement("img");
          VIcon.classList.add("wcl-lv-icon");
          VIcon.setAttribute("src",VItem.FImageUrl);
          VIcon.setAttribute("alt","");
          VLi.appendChild(VIcon);
        };
        VText = document.createElement("span");
        VText.classList.add("wcl-lv-text");
        VText.textContent = VItem.FCaption;
        VLi.appendChild(VText);
        VLi.addEventListener("click",rtl.createCallback(this,"ItemClick"));
        VUl.appendChild(VLi);
      };
      this.FHandleElement.appendChild(VUl);
    };
    this.RenderIcons = function () {
      var VDiv = null;
      var VTile = null;
      var VInput = null;
      var VIcon = null;
      var VText = null;
      var VSub = null;
      var VItem = null;
      var I = 0;
      VDiv = document.createElement("div");
      VDiv.classList.add("wcl-lv-icons");
      for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        VItem = this.FItems.GetItem(I);
        VTile = document.createElement("div");
        VTile.classList.add("wcl-lv-tile");
        VTile.classList.add("wcl-lv-row");
        if (VItem.FSelected) VTile.classList.add("wcl-lv-selected");
        VTile.setAttribute("data-wcl-item",pas.SysUtils.IntToStr(I));
        if (this.FCheckboxes) {
          VInput = document.createElement("input");
          VInput.setAttribute("type","checkbox");
          VInput.setAttribute("data-wcl-item",pas.SysUtils.IntToStr(I));
          VInput.checked = VItem.FChecked;
          VInput.addEventListener("click",rtl.createCallback(this,"ItemCheckClick"));
          VTile.appendChild(VInput);
        };
        if (VItem.FImageUrl !== "") {
          VIcon = document.createElement("img");
          VIcon.setAttribute("src",VItem.FImageUrl);
          VIcon.setAttribute("alt","");
          VTile.appendChild(VIcon);
        };
        VText = document.createElement("span");
        VText.classList.add("wcl-lv-text");
        VText.textContent = VItem.FCaption;
        VTile.appendChild(VText);
        if (VItem.GetSubItems().GetCount() > 0) {
          VSub = document.createElement("span");
          VSub.classList.add("wcl-lv-sub");
          VSub.textContent = VItem.GetSubItems().Get(0);
          VTile.appendChild(VSub);
        };
        VTile.addEventListener("click",rtl.createCallback(this,"ItemClick"));
        VDiv.appendChild(VTile);
      };
      this.FHandleElement.appendChild(VDiv);
    };
    this.RenderHeader = function (ARow, AColumn) {
      var VSuffix = "";
      VSuffix = "";
      if (this.FSortColumn === AColumn.GetIndex()) {
        if (this.FSortDirection === $mod.TSortDirection.sdAscending) {
          VSuffix = " ▲"}
         else VSuffix = " ▼";
      };
      ARow.textContent = AColumn.FCaption + VSuffix;
      ARow.style.setProperty("text-align",$impl.ListAlignmentCSS(AColumn.FAlignment));
    };
    this.ScrollToItem = function (AItem) {
      var VElement = null;
      VElement = this.FindItemElement(AItem);
      if (VElement != null) VElement.scrollIntoView({ block: 'nearest' });
    };
    this.SortItems = function () {
      var $Self = this;
      var VIndex = 0;
      var VInner = 0;
      var VTemp = null;
      var VCompare = 0;
      function CompareItems(A, B) {
        var Result = 0;
        var VSub = 0;
        var VA = "";
        var VB = "";
        if (($Self.FSortType in rtl.createSet($mod.TSortType.stData,$mod.TSortType.stBoth)) && ($Self.FOnCompare != null)) {
          VCompare = 0;
          $Self.FOnCompare($Self,A,B,$Self.FSortColumn,{get: function () {
              return VCompare;
            }, set: function (v) {
              VCompare = v;
            }});
          Result = VCompare;
        } else {
          if ($Self.FSortColumn > 0) {
            VSub = $Self.FSortColumn - 1;
            if (VSub < A.GetSubItems().GetCount()) {
              VA = A.GetSubItems().Get(VSub)}
             else VA = "";
            if (VSub < B.GetSubItems().GetCount()) {
              VB = B.GetSubItems().Get(VSub)}
             else VB = "";
            Result = pas.SysUtils.CompareText(VA,VB);
            if (Result === 0) Result = pas.SysUtils.CompareText(A.FCaption,B.FCaption);
          } else Result = pas.SysUtils.CompareText(A.FCaption,B.FCaption);
        };
        if ($Self.FSortDirection === $mod.TSortDirection.sdDescending) Result = -Result;
        return Result;
      };
      this.BeginUpdate();
      try {
        for (var $l = 1, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
          VIndex = $l;
          VTemp = this.FItems.GetItem(VIndex);
          VInner = VIndex - 1;
          while ((VInner >= 0) && (CompareItems(this.FItems.GetItem(VInner),VTemp) > 0)) {
            this.FItems.FItems.SetItem(VInner + 1,this.FItems.FItems.GetItem(VInner));
            VInner -= 1;
          };
          this.FItems.FItems.SetItem(VInner + 1,VTemp);
        };
        for (var $l1 = 0, $end1 = this.FColumns.GetCount() - 1; $l1 <= $end1; $l1++) {
          VIndex = $l1;
          if (VIndex === this.FSortColumn) {
            if (this.FSortDirection === $mod.TSortDirection.sdAscending) {
              this.FColumns.GetColumn(VIndex).FSortIndicator = $mod.TSortIndicator.siAscending}
             else this.FColumns.GetColumn(VIndex).FSortIndicator = $mod.TSortIndicator.siDescending;
          } else this.FColumns.GetColumn(VIndex).FSortIndicator = $mod.TSortIndicator.siNone;
        };
      } finally {
        this.EndUpdate();
      };
    };
    this.ClearSelection = function () {
      var VIndex = 0;
      for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
        VIndex = $l;
        this.FItems.GetItem(VIndex).FSelected = false;
      };
      this.Changed();
    };
    this.SelectItem = function (AItem, ASelected) {
      if (!(AItem != null) || (AItem.FSelected === ASelected)) return;
      AItem.FSelected = ASelected;
      this.Changed();
      this.DoItemChange(AItem,$mod.TItemChange.ctState);
      this.DoSelectItem(AItem,ASelected);
    };
    this.SelectRange = function (AFrom, ATo) {
      var VFrom = 0;
      var VTo = 0;
      var VIndex = 0;
      if (!(AFrom != null) || !(ATo != null)) return;
      VFrom = AFrom.GetIndex();
      VTo = ATo.GetIndex();
      if (VFrom > VTo) {
        VIndex = VFrom;
        VFrom = VTo;
        VTo = VIndex;
      };
      this.BeginUpdate();
      try {
        for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
          VIndex = $l;
          this.FItems.GetItem(VIndex).FSelected = (VIndex >= VFrom) && (VIndex <= VTo);
        };
      } finally {
        this.EndUpdate();
      };
      this.DoItemChange(ATo,$mod.TItemChange.ctState);
      this.DoSelectItem(ATo,true);
    };
    this.MoveSelection = function (ADelta) {
      var VIndex = 0;
      if (this.FItems.GetCount() === 0) return;
      VIndex = this.GetItemIndex();
      if (VIndex < 0) {
        VIndex = 0}
       else VIndex = VIndex + ADelta;
      if (VIndex < 0) VIndex = 0;
      if (VIndex > (this.FItems.GetCount() - 1)) VIndex = this.FItems.GetCount() - 1;
      this.SetSelected(this.FItems.GetItem(VIndex));
      this.ScrollToItem(this.FItems.GetItem(VIndex));
    };
    this.SelectFirst = function () {
      if (this.FItems.GetCount() > 0) {
        this.SetSelected(this.FItems.GetItem(0));
        this.ScrollToItem(this.FItems.GetItem(0));
      };
    };
    this.SelectLast = function () {
      if (this.FItems.GetCount() > 0) {
        this.SetSelected(this.FItems.GetItem(this.FItems.GetCount() - 1));
        this.ScrollToItem(this.FItems.GetItem(this.FItems.GetCount() - 1));
      };
    };
    this.ItemClick = function (AEvent) {
      var Result = false;
      var VItem = null;
      Result = true;
      VItem = this.ItemFromEvent(AEvent);
      if (!(VItem != null)) return Result;
      this.SetFocus();
      if (this.FMultiSelect && AEvent.ctrlKey) {
        this.FAnchor = VItem;
        this.SelectItem(VItem,!VItem.FSelected);
      } else if (this.FMultiSelect && AEvent.shiftKey && (this.FAnchor != null)) {
        this.SelectRange(this.FAnchor,VItem)}
       else {
        this.FAnchor = VItem;
        this.SetSelected(VItem);
      };
      return Result;
    };
    this.ItemCheckClick = function (AEvent) {
      var Result = false;
      var VItem = null;
      AEvent.stopPropagation();
      AEvent.preventDefault();
      Result = true;
      if (this.FReadOnly) return Result;
      VItem = this.ItemFromEvent(AEvent);
      if (!(VItem != null)) return Result;
      this.SetFocus();
      VItem.SetChecked(!VItem.FChecked);
      this.DoItemChecked(VItem);
      return Result;
    };
    this.ColumnClickHandler = function (AEvent) {
      var Result = false;
      var VColumn = null;
      AEvent.stopPropagation();
      Result = true;
      VColumn = this.ColumnFromEvent(AEvent);
      if (VColumn != null) this.ColumnClick(VColumn);
      return Result;
    };
    this.ColumnClick = function (AColumn) {
      if (!(AColumn != null)) return;
      if (this.FOnColumnClick != null) this.FOnColumnClick(this,AColumn);
      if (!this.FAutoSort) return;
      if (this.FSortColumn === AColumn.GetIndex()) {
        if (this.FSortDirection === $mod.TSortDirection.sdAscending) {
          this.FSortDirection = $mod.TSortDirection.sdDescending}
         else this.FSortDirection = $mod.TSortDirection.sdAscending;
      } else {
        this.FSortColumn = AColumn.GetIndex();
        this.FSortDirection = $mod.TSortDirection.sdAscending;
      };
      this.SortItems();
    };
    this.KeyDown = function (Key, Shift) {
      pas.Controls.TWinControl.KeyDown.call(this,Key,rtl.refSet(Shift));
      var $tmp = Key.get();
      if ($tmp === 38) {
        this.MoveSelection(-1);
        Key.set(0);
      } else if ($tmp === 40) {
        this.MoveSelection(1);
        Key.set(0);
      } else if ($tmp === 36) {
        this.SelectFirst();
        Key.set(0);
      } else if ($tmp === 35) {
        this.SelectLast();
        Key.set(0);
      } else if ($tmp === 32) {
        if (this.FCheckboxes && !this.FReadOnly && (this.GetSelected() != null)) {
          this.GetSelected().SetChecked(!this.GetSelected().FChecked);
          this.DoItemChecked(this.GetSelected());
        };
        Key.set(0);
      } else if ($tmp === 65) {
        if ((pas.Controls.TShiftStateEnum.ssCtrl in Shift) && this.FMultiSelect) {
          this.SelectAll();
          Key.set(0);
        };
      };
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 240;
      Result.cy = 160;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      $impl._RegisterWCLListRules();
      this.FItems = $mod.TListItems.$create("Create$1",[this]);
      this.FColumns = $mod.TListColumns.$create("Create$2",[this]);
      this.FAutoSort = true;
      this.FCheckboxes = false;
      this.FGridLines = false;
      this.FMultiSelect = false;
      this.FReadOnly = false;
      this.FRowHeight = 0;
      this.FRowSelect = false;
      this.FShowColumnHeaders = true;
      this.FSortColumn = -1;
      this.FSortDirection = $mod.TSortDirection.sdAscending;
      this.FSortType = $mod.TSortType.stNone;
      this.FViewStyle = $mod.TViewStyle.vsList;
      this.FAnchor = null;
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
      this.FAnchor = null;
      rtl.free(this,"FColumns");
      this.FColumns = null;
      rtl.free(this,"FItems");
      this.FItems = null;
      pas.Controls.TControl.Destroy.call(this);
    };
    this.AlphaSort = function () {
      var Result = false;
      this.FSortColumn = 0;
      this.FSortDirection = $mod.TSortDirection.sdAscending;
      this.SortItems();
      Result = true;
      return Result;
    };
    this.Clear = function () {
      this.FItems.Clear();
    };
    this.SelectAll = function () {
      var VIndex = 0;
      if (!this.FMultiSelect) return;
      this.BeginUpdate();
      try {
        for (var $l = 0, $end = this.FItems.GetCount() - 1; $l <= $end; $l++) {
          VIndex = $l;
          this.FItems.GetItem(VIndex).FSelected = true;
        };
      } finally {
        this.EndUpdate();
      };
      this.DoItemChange(null,$mod.TItemChange.ctState);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TListView",this.TCustomListView,function () {
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("Align",2,pas.Controls.$rtti["TAlign"],"FAlign","SetAlign");
    $r.addProperty("Anchors",14,pas.Controls.$rtti["TAnchors"],"FAnchors","SetAnchors",{stored: "IsAnchorsStored", Default: rtl.createSet(pas.Controls.TAnchorKind.akLeft,pas.Controls.TAnchorKind.akTop)});
    $r.addProperty("AutoSort",2,rtl.boolean,"FAutoSort","SetAutoSort",{Default: true});
    $r.addProperty("BorderSpacing",2,pas.Controls.$rtti["TControlBorderSpacing"],"FBorderSpacing","SetBorderSpacing");
    $r.addProperty("BorderStyle",2,pas.Controls.$rtti["TBorderStyle"],"FBorderStyle","SetBorderStyle");
    $r.addProperty("Checkboxes",2,rtl.boolean,"FCheckboxes","SetCheckboxes",{Default: false});
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("Columns",0,$mod.$rtti["TListColumns"],"FColumns","");
    $r.addProperty("Constraints",2,pas.Controls.$rtti["TSizeConstraints"],"FConstraints","SetConstraints");
    $r.addProperty("Enabled",2,rtl.boolean,"FEnabled","SetEnabled");
    $r.addProperty("Font",2,pas.Graphics.$rtti["TFont"],"FFont","SetFont");
    $r.addProperty("GridLines",2,rtl.boolean,"FGridLines","SetGridLines",{Default: false});
    $r.addProperty("HandleClass",2,rtl.string,"FHandleClass","SetHandleClass");
    $r.addProperty("HandleId",2,rtl.string,"FHandleId","SetHandleId");
    $r.addProperty("Height",2,rtl.nativeint,"FHeight","SetHeight");
    $r.addProperty("Items",0,$mod.$rtti["TListItems"],"FItems","");
    $r.addProperty("Left",2,rtl.nativeint,"FLeft","SetLeft");
    $r.addProperty("MultiSelect",2,rtl.boolean,"FMultiSelect","SetMultiSelect",{Default: false});
    $r.addProperty("ParentFont",2,rtl.boolean,"FParentFont","SetParentFont");
    $r.addProperty("ParentShowHint",2,rtl.boolean,"FParentShowHint","SetParentShowHint");
    $r.addProperty("PopupMenu",2,pas.Controls.$rtti["TCustomPopupMenu"],"FPopupMenu","SetPopupMenu");
    $r.addProperty("ReadOnly",2,rtl.boolean,"FReadOnly","SetReadOnly",{Default: false});
    $r.addProperty("RowHeight",2,rtl.nativeint,"FRowHeight","SetRowHeight",{Default: 0});
    $r.addProperty("RowSelect",2,rtl.boolean,"FRowSelect","SetRowSelect",{Default: false});
    $r.addProperty("ShowColumnHeaders",2,rtl.boolean,"FShowColumnHeaders","SetShowColumnHeaders",{Default: true});
    $r.addProperty("ShowHint",2,rtl.boolean,"FShowHint","SetShowHint");
    $r.addProperty("SortColumn",2,rtl.nativeint,"FSortColumn","SetSortColumn",{Default: -1});
    $r.addProperty("SortDirection",2,$mod.$rtti["TSortDirection"],"FSortDirection","SetSortDirection",{Default: $mod.TSortDirection.sdAscending});
    $r.addProperty("SortType",2,$mod.$rtti["TSortType"],"FSortType","SetSortType",{Default: $mod.TSortType.stNone});
    $r.addProperty("TabOrder",2,rtl.nativeint,"FTabOrder","SetTabOrder");
    $r.addProperty("TabStop",2,rtl.boolean,"FTabStop","SetTabStop");
    $r.addProperty("Top",2,rtl.nativeint,"FTop","SetTop");
    $r.addProperty("ViewStyle",2,$mod.$rtti["TViewStyle"],"FViewStyle","SetViewStyle",{Default: $mod.TViewStyle.vsList});
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible");
    $r.addProperty("Width",2,rtl.nativeint,"FWidth","SetWidth");
    $r.addProperty("OnChange",0,$mod.$rtti["TLVChangeEvent"],"FOnChange","FOnChange");
    $r.addProperty("OnClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnClick","FOnClick");
    $r.addProperty("OnColumnClick",0,$mod.$rtti["TLVColumnClickEvent"],"FOnColumnClick","FOnColumnClick");
    $r.addProperty("OnCompare",0,$mod.$rtti["TLVCompareEvent"],"FOnCompare","FOnCompare");
    $r.addProperty("OnDblClick",0,pas.Classes.$rtti["TNotifyEvent"],"FOnDblClick","FOnDblClick");
    $r.addProperty("OnEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnEnter","FOnEnter");
    $r.addProperty("OnExit",0,pas.Classes.$rtti["TNotifyEvent"],"FOnExit","FOnExit");
    $r.addProperty("OnItemChecked",0,$mod.$rtti["TLVCheckedItemEvent"],"FOnItemChecked","FOnItemChecked");
    $r.addProperty("OnKeyDown",0,pas.Controls.$rtti["TKeyEvent"],"FOnKeyDown","FOnKeyDown");
    $r.addProperty("OnKeyPress",0,pas.Controls.$rtti["TKeyPressEvent"],"FOnKeyPress","FOnKeyPress");
    $r.addProperty("OnKeyUp",0,pas.Controls.$rtti["TKeyEvent"],"FOnKeyUp","FOnKeyUp");
    $r.addProperty("OnMouseDown",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseDown","FOnMouseDown");
    $r.addProperty("OnMouseEnter",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseEnter","FOnMouseEnter");
    $r.addProperty("OnMouseLeave",0,pas.Classes.$rtti["TNotifyEvent"],"FOnMouseLeave","FOnMouseLeave");
    $r.addProperty("OnMouseMove",0,pas.Controls.$rtti["TMouseMoveEvent"],"FOnMouseMove","FOnMouseMove");
    $r.addProperty("OnMouseUp",0,pas.Controls.$rtti["TMouseEvent"],"FOnMouseUp","FOnMouseUp");
    $r.addProperty("OnMouseWheel",0,pas.Controls.$rtti["TMouseWheelEvent"],"FOnMouseWheel","FOnMouseWheel");
    $r.addProperty("OnSelectItem",0,$mod.$rtti["TLVSelectItemEvent"],"FOnSelectItem","FOnSelectItem");
  });
  $mod.$implcode = function () {
    $impl._WCLTreeRulesRegistered = false;
    $impl._RegisterWCLTreeRules = function () {
      if ($impl._WCLTreeRulesRegistered) return;
      pas.Controls.RegisterWCLStyle(".wcl-tree{" + "overflow:auto;" + "background:#fff;" + "border:1px solid #c9c3ba;" + "border-radius:4px;" + "box-sizing:border-box;" + "outline:none;" + "user-select:none;" + "-webkit-user-select:none;" + "-webkit-tap-highlight-color:transparent;}" + ".wcl-tree ul{" + "list-style:none;" + "margin:0;" + "padding:0;}" + ".wcl-tree-row{" + "display:flex;" + "align-items:center;" + "gap:4px;" + "min-height:24px;" + "padding:2px 6px;" + "cursor:pointer;" + "white-space:nowrap;" + "border-radius:3px;" + "color:#333;}" + "@media(hover:hover){" + ".wcl-tree-row:hover{background:#eef3fb;}" + "}" + ".wcl-tree-node.wcl-tree-selected>.wcl-tree-row{" + "background:#4A90D9;" + "color:#fff;}" + ".wcl-tree-toggle{" + "display:inline-flex;" + "align-items:center;" + "justify-content:center;" + "width:16px;" + "min-width:16px;" + "height:16px;" + "font-size:10px;" + "line-height:1;" + "color:#666;}" + ".wcl-tree-node.wcl-tree-selected>.wcl-tree-row .wcl-tree-toggle{" + "color:#fff;}" + ".wcl-tree-icon{" + "width:16px;" + "height:16px;" + "object-fit:contain;}" + ".wcl-tree-text{" + "overflow:hidden;" + "text-overflow:ellipsis;}" + ".wcl-tree.wcl-tree-lines ul.wcl-tree-children{" + "border-left:1px dotted #c9c3ba;" + "margin-left:7px;" + "padding-left:10px;}" + "@media(pointer:coarse){" + ".wcl-tree-row{min-height:36px;font-size:16px;}" + ".wcl-tree-toggle{width:20px;min-width:20px;height:20px;font-size:12px;}" + "}");
      $impl._WCLTreeRulesRegistered = true;
    };
    $impl._WCLListRulesRegistered = false;
    $impl._RegisterWCLListRules = function () {
      if ($impl._WCLListRulesRegistered) return;
      pas.Controls.RegisterWCLStyle(".wcl-lv{" + "overflow:auto;" + "background:#fff;" + "border:1px solid #c9c3ba;" + "border-radius:4px;" + "box-sizing:border-box;" + "outline:none;" + "user-select:none;" + "-webkit-user-select:none;" + "-webkit-tap-highlight-color:transparent;}" + ".wcl-lv-table{" + "width:100%;" + "border-collapse:collapse;" + "table-layout:fixed;}" + ".wcl-lv-table th{" + "position:sticky;" + "top:0;" + "z-index:1;" + "background:#f0f0f0;" + "text-align:left;" + "font-weight:600;" + "padding:6px 8px;" + "border-bottom:1px solid #c9c3ba;" + "white-space:nowrap;" + "overflow:hidden;" + "text-overflow:ellipsis;" + "cursor:pointer;" + "color:#333;}" + ".wcl-lv-table td{" + "padding:5px 8px;" + "border-bottom:1px solid #eee;" + "white-space:nowrap;" + "overflow:hidden;" + "text-overflow:ellipsis;" + "color:#333;}" + ".wcl-lv-table tbody tr{" + "cursor:pointer;}" + "@media(hover:hover){" + ".wcl-lv-table tbody tr:hover{background:#eef3fb;}" + "}" + ".wcl-lv-table tbody tr.wcl-lv-selected{" + "background:#4A90D9;}" + ".wcl-lv-table tbody tr.wcl-lv-selected td{" + "color:#fff;}" + ".wcl-lv-gridlines td,.wcl-lv-gridlines th{" + "border-right:1px solid #eee;}" + ".wcl-lv-checkcell{" + "width:32px;" + "text-align:center;" + "padding:2px 4px!important;}" + ".wcl-lv-checkcell input{" + "width:16px;" + "height:16px;" + "margin:0;" + "cursor:pointer;}" + ".wcl-lv-list{" + "list-style:none;" + "margin:0;" + "padding:0;}" + ".wcl-lv-item{" + "display:flex;" + "align-items:center;" + "gap:6px;" + "min-height:24px;" + "padding:2px 8px;" + "cursor:pointer;" + "border-radius:3px;" + "white-space:nowrap;" + "color:#333;}" + "@media(hover:hover){" + ".wcl-lv-item:hover{background:#eef3fb;}" + "}" + ".wcl-lv-item.wcl-lv-selected{" + "background:#4A90D9;" + "color:#fff;}" + ".wcl-lv-item input[type=checkbox],.wcl-lv-tile input[type=checkbox]{" + "width:16px;" + "height:16px;" + "margin:0;" + "cursor:pointer;}" + ".wcl-lv-icon{" + "width:16px;" + "height:16px;" + "object-fit:contain;}" + ".wcl-lv-text{" + "overflow:hidden;" + "text-overflow:ellipsis;}" + ".wcl-lv-icons{" + "display:grid;" + "grid-template-columns:repeat(auto-fill,minmax(96px,1fr));" + "gap:8px;" + "padding:8px;}" + ".wcl-lv-tile{" + "display:flex;" + "flex-direction:column;" + "align-items:center;" + "gap:4px;" + "padding:8px;" + "border-radius:4px;" + "cursor:pointer;" + "text-align:center;" + "color:#333;}" + "@media(hover:hover){" + ".wcl-lv-tile:hover{background:#eef3fb;}" + "}" + ".wcl-lv-tile.wcl-lv-selected{" + "background:#4A90D9;" + "color:#fff;}" + ".wcl-lv-tile img{" + "width:32px;" + "height:32px;" + "object-fit:contain;}" + ".wcl-lv-sub{" + "font-size:12px;" + "opacity:0.7;" + "overflow:hidden;" + "text-overflow:ellipsis;" + "max-width:100%;}" + "@media(pointer:coarse){" + ".wcl-lv-item{min-height:36px;font-size:16px;}" + ".wcl-lv-table td,.wcl-lv-table th{min-height:36px;font-size:16px;padding:8px;}" + ".wcl-lv-checkcell input{width:20px;height:20px;}" + "}");
      $impl._WCLListRulesRegistered = true;
    };
    $impl.ListAlignmentCSS = function (AValue) {
      var Result = "";
      var $tmp = AValue;
      if ($tmp === pas.Classes.TAlignment.taCenter) {
        Result = "center"}
       else if ($tmp === pas.Classes.TAlignment.taRightJustify) {
        Result = "right"}
       else {
        Result = "left";
      };
      return Result;
    };
  };
},["Forms"]);
//# sourceMappingURL=comctrls.js.map
