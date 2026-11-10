rtl.module("Graphics",["System","Classes","SysUtils","Types","Web"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.$rtti.$Int("TFontCharSet",{minvalue: 0, maxvalue: 255, ordtype: 3});
  this.TFontStyle = {"0": "fsBold", fsBold: 0, "1": "fsItalic", fsItalic: 1, "2": "fsUnderline", fsUnderline: 2, "3": "fsStrikeOut", fsStrikeOut: 3};
  this.$rtti.$Enum("TFontStyle",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TFontStyle});
  this.$rtti.$Set("TFontStyles",{comptype: this.$rtti["TFontStyle"]});
  this.TTextLayout = {"0": "tlTop", tlTop: 0, "1": "tlCenter", tlCenter: 1, "2": "tlBottom", tlBottom: 2};
  this.$rtti.$Enum("TTextLayout",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TTextLayout});
  this.TPenStyle = {"0": "psSolid", psSolid: 0, "1": "psDash", psDash: 1, "2": "psDot", psDot: 2, "3": "psDashDot", psDashDot: 3, "4": "psDashDotDot", psDashDotDot: 4, "5": "psInsideFrame", psInsideFrame: 5, "6": "psPattern", psPattern: 6, "7": "psClear", psClear: 7};
  this.$rtti.$Enum("TPenStyle",{minvalue: 0, maxvalue: 7, ordtype: 1, enumtype: this.TPenStyle});
  this.$rtti.$Set("TPenStyleSet",{comptype: this.$rtti["TPenStyle"]});
  this.TBrushStyle = {"0": "bsSolid", bsSolid: 0, "1": "bsClear", bsClear: 1, "2": "bsHorizontal", bsHorizontal: 2, "3": "bsVertical", bsVertical: 3, "4": "bsFDiagonal", bsFDiagonal: 4, "5": "bsBDiagonal", bsBDiagonal: 5, "6": "bsCross", bsCross: 6, "7": "bsDiagCross", bsDiagCross: 7, "8": "bsImage", bsImage: 8, "9": "bsPattern", bsPattern: 9};
  this.$rtti.$Enum("TBrushStyle",{minvalue: 0, maxvalue: 9, ordtype: 1, enumtype: this.TBrushStyle});
  rtl.createClass(this,"TFont",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FCharSet = 0;
      this.FColor = 0;
      this.FName = "";
      this.FSize = 0;
      this.FStyle = {};
      this.FUpdateCount = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FStyle = undefined;
      this.FOnChange = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.GetHeight = function () {
      var Result = 0;
      Result = Math.round((-this.FSize * 72) / 96);
      return Result;
    };
    this.SetCharSet = function (AValue) {
      if (this.FCharSet !== AValue) {
        this.FCharSet = AValue;
        this.Changed();
      };
    };
    this.SetColor = function (AValue) {
      if (this.FColor !== AValue) {
        this.FColor = AValue;
        this.Changed();
      };
    };
    this.SetHeight = function (AValue) {
      this.SetSize(Math.round((-AValue * 96) / 72));
    };
    this.SetName = function (AValue) {
      if (this.FName !== AValue) {
        this.FName = AValue;
        this.Changed();
      };
    };
    this.SetSize = function (AValue) {
      if (this.FSize !== AValue) {
        this.FSize = AValue;
        this.Changed();
      };
    };
    this.SetStyle = function (AValue) {
      if (rtl.neSet(this.FStyle,AValue)) {
        this.FStyle = rtl.refSet(AValue);
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
      this.FColor = 0;
      this.FName = $mod.ffSans;
      this.FSize = 10;
      this.FStyle = {};
      this.FUpdateCount = 0;
      return this;
    };
    this.Assign = function (Source) {
      var VFont = null;
      if ((Source != null) && $mod.TFont.isPrototypeOf(Source)) {
        this.BeginUpdate();
        try {
          VFont = Source;
          this.FCharSet = VFont.FCharSet;
          this.FColor = VFont.FColor;
          this.FName = VFont.FName;
          this.FSize = VFont.FSize;
          this.FStyle = rtl.refSet(VFont.FStyle);
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
    this.IsEqual = function (AFont) {
      var Result = false;
      if (AFont != null) {
        if ((this.FCharSet !== AFont.FCharSet) || (this.FColor !== AFont.FColor) || (this.FName !== AFont.FName) || (this.FSize !== AFont.FSize) || rtl.neSet(this.FStyle,AFont.FStyle)) {
          Result = false;
        } else {
          Result = true;
        };
      } else {
        Result = false;
      };
      return Result;
    };
    this.TextExtent = function (AText) {
      var Result = pas.Types.TSize.$new();
      Result.$assign($mod.JSMeasureText(AText,this.FName,this.FSize,0));
      return Result;
    };
    this.TextSize = function (AText, W, H) {
      var VSize = pas.Types.TSize.$new();
      VSize.$assign(this.TextExtent(AText));
      H.set(VSize.cy);
      W.set(VSize.cx);
    };
    this.TextHeight = function (AText) {
      var Result = 0;
      Result = this.TextExtent(AText).cy;
      return Result;
    };
    this.TextWidth = function (AText) {
      var Result = 0;
      Result = this.TextExtent(AText).cx;
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[]);
    $r.addProperty("CharSet",2,$mod.$rtti["TFontCharSet"],"FCharSet","SetCharSet");
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("Height",3,rtl.nativeint,"GetHeight","SetHeight");
    $r.addProperty("Name",2,rtl.string,"FName","SetName");
    $r.addProperty("Size",2,rtl.nativeint,"FSize","SetSize");
    $r.addProperty("Style",2,$mod.$rtti["TFontStyles"],"FStyle","SetStyle");
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
  });
  rtl.createClass(this,"TPen",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FColor = 0;
      this.FStyle = 0;
      this.FWidth = 0;
      this.FUpdateCount = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FOnChange = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.SetColor = function (AValue) {
      if (this.FColor !== AValue) {
        this.FColor = AValue;
        this.Changed();
      };
    };
    this.SetStyle = function (AValue) {
      if (this.FStyle !== AValue) {
        this.FStyle = AValue;
        this.Changed();
      };
    };
    this.SetWidth = function (AValue) {
      if (this.FWidth !== AValue) {
        this.FWidth = AValue;
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
      this.FColor = 0;
      this.FStyle = $mod.TPenStyle.psSolid;
      this.FWidth = 1;
      this.FUpdateCount = 0;
      return this;
    };
    this.Assign = function (Source) {
      var VPen = null;
      if ((Source != null) && $mod.TPen.isPrototypeOf(Source)) {
        this.BeginUpdate();
        try {
          VPen = Source;
          this.FColor = VPen.FColor;
          this.FStyle = VPen.FStyle;
          this.FWidth = VPen.FWidth;
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
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("Style",2,$mod.$rtti["TPenStyle"],"FStyle","SetStyle");
    $r.addProperty("Width",2,rtl.nativeint,"FWidth","SetWidth");
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
  });
  rtl.createClass(this,"TBrush",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FColor = 0;
      this.FStyle = 0;
      this.FUpdateCount = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FOnChange = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.SetColor = function (AValue) {
      if (this.FColor !== AValue) {
        this.FColor = AValue;
        this.Changed();
      };
    };
    this.SetStyle = function (AValue) {
      if (this.FStyle === AValue) {
        this.FStyle = AValue;
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
      this.FColor = 16777215;
      this.FStyle = $mod.TBrushStyle.bsSolid;
      this.FUpdateCount = 0;
      return this;
    };
    this.Assign = function (Source) {
      var VBrush = null;
      if ((Source != null) && $mod.TBrush.isPrototypeOf(Source)) {
        this.BeginUpdate();
        try {
          VBrush = Source;
          this.FColor = VBrush.FColor;
          this.FStyle = VBrush.FStyle;
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
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("Style",2,$mod.$rtti["TBrushStyle"],"FStyle","SetStyle");
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
  });
  rtl.createClass(this,"TPicture",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FData = "";
      this.FUpdateCount = 0;
      this.FOnChange = null;
    };
    this.$final = function () {
      this.FOnChange = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.SetData = function (AValue) {
      if (this.FData !== AValue) {
        this.FData = AValue;
        this.Changed();
      };
    };
    this.Changed = function () {
      if ((this.FUpdateCount === 0) && (this.FOnChange != null)) {
        this.FOnChange(this);
      };
    };
    this.Create$1 = function () {
      this.FData = "";
      this.FUpdateCount = 0;
      this.FOnChange = null;
      return this;
    };
    this.Assign = function (Source) {
      var VPicture = null;
      if ((Source != null) && $mod.TPicture.isPrototypeOf(Source)) {
        this.BeginUpdate();
        try {
          VPicture = Source;
          this.FData = VPicture.FData;
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
    this.IsEqual = function (APicture) {
      var Result = false;
      if (APicture != null) {
        if (this === APicture) {
          Result = true;
          return Result;
        };
        if (this.FData !== APicture.FData) {
          Result = false;
        } else {
          Result = true;
        };
      } else {
        Result = false;
      };
      return Result;
    };
    this.Clear = function () {
      this.SetData("");
    };
    this.IsEmpty = function () {
      var Result = false;
      Result = this.FData === "";
      return Result;
    };
    this.LoadFromDataURL = function (ADataURL) {
      this.SetData(ADataURL);
    };
    this.SaveToDataURL = function () {
      var Result = "";
      Result = this.FData;
      return Result;
    };
    this.LoadFromBase64 = function (ABase64, AMimeType) {
      if (ABase64 === "") {
        this.SetData("")}
       else this.SetData("data:" + AMimeType + ";base64," + ABase64);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[]);
    $r.addProperty("Data",2,rtl.string,"FData","SetData");
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
  });
  rtl.createClass(this,"TCanvas",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FBrush = null;
      this.FFont = null;
      this.FPen = null;
      this.FUpdateCount = 0;
      this.FOnChange = null;
      this.FCanvasElement = null;
      this.FContextElement = null;
    };
    this.$final = function () {
      this.FBrush = undefined;
      this.FFont = undefined;
      this.FPen = undefined;
      this.FOnChange = undefined;
      this.FCanvasElement = undefined;
      this.FContextElement = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.PrepareStyle = function () {
      this.FContextElement.fillStyle = $mod.JSColor(this.FBrush.FColor);
      this.FContextElement.lineWidth = this.FPen.FWidth;
      this.FContextElement.strokeStyle = $mod.JSColor(this.FPen.FColor);
      var $tmp = this.FPen.FStyle;
      if ($tmp === $mod.TPenStyle.psDash) {
        this.FContextElement.setLineDash([8,2])}
       else if ($tmp === $mod.TPenStyle.psDot) {
        this.FContextElement.setLineDash([1,2])}
       else if ($tmp === $mod.TPenStyle.psDashDot) {
        this.FContextElement.setLineDash([8,2,1,2])}
       else if ($tmp === $mod.TPenStyle.psDashDotDot) {
        this.FContextElement.setLineDash([8,2,1,2,1,2])}
       else {
        this.FContextElement.setLineDash([]);
      };
    };
    this.PrepareText = function () {
      this.FContextElement.font = $mod.JSFont(this.FFont);
      this.FContextElement.fillStyle = $mod.JSColor(this.FFont.FColor);
      this.FContextElement.textBaseline = "hanging";
    };
    this.Changed = function () {
      if ((this.FUpdateCount === 0) && (this.FOnChange != null)) {
        this.FOnChange(this);
      };
    };
    this.Create$1 = function () {
      pas.System.TObject.Create.call(this);
      this.FCanvasElement = document.createElement("canvas");
      this.FContextElement = this.FCanvasElement.getContext("2d");
      this.FBrush = $mod.TBrush.$create("Create$1");
      this.FFont = $mod.TFont.$create("Create$1");
      this.FPen = $mod.TPen.$create("Create$1");
      this.FUpdateCount = 0;
      return this;
    };
    this.Destroy = function () {
      this.FBrush.$destroy("Destroy");
      this.FFont.$destroy("Destroy");
      this.FPen.$destroy("Destroy");
      this.FBrush = null;
      this.FFont = null;
      this.FPen = null;
      pas.System.TObject.Destroy.call(this);
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
    this.Clear = function () {
      this.FContextElement.clearRect(0,0,this.FCanvasElement.width,this.FCanvasElement.height);
    };
    this.FillRect = function (ARect) {
      this.FillRect$1(ARect.Left,ARect.Top,ARect.Bottom - ARect.Top,ARect.Right - ARect.Left);
    };
    this.FillRect$1 = function (ALeft, ATop, AWidth, AHeight) {
      this.PrepareStyle();
      if (this.FBrush.FStyle !== $mod.TBrushStyle.bsClear) {
        this.FContextElement.fillRect(ALeft,ATop,AWidth,AHeight);
      };
    };
    this.LineTo = function (X, Y) {
      this.PrepareStyle();
      this.FContextElement.lineTo(X,Y);
      if (this.FPen.FStyle !== $mod.TPenStyle.psClear) {
        this.FContextElement.stroke();
      };
    };
    this.MoveTo = function (X, Y) {
      this.FContextElement.beginPath();
      this.FContextElement.moveTo(X,Y);
    };
    this.Rectangle = function (ARect) {
      this.Rectangle$1(ARect.Left,ARect.Top,ARect.Bottom - ARect.Top,ARect.Right - ARect.Left);
    };
    this.Rectangle$1 = function (ALeft, ATop, AWidth, AHeight) {
      this.FContextElement.beginPath();
      this.PrepareStyle();
      this.FContextElement.rect(ALeft,ATop,AWidth,AHeight);
      if (this.FBrush.FStyle !== $mod.TBrushStyle.bsClear) {
        this.FContextElement.fill();
      };
      if (this.FPen.FStyle !== $mod.TPenStyle.psClear) {
        this.FContextElement.stroke();
      };
    };
    this.TextOut = function (X, Y, AText) {
      this.PrepareText();
      if (this.FPen.FStyle !== $mod.TPenStyle.psClear) {
        this.FContextElement.fillText(AText,X,Y);
      };
    };
    this.Ellipse = function (X1, Y1, X2, Y2) {
      var VCx = 0.0;
      var VCy = 0.0;
      var VRx = 0.0;
      var VRy = 0.0;
      this.FContextElement.beginPath();
      this.PrepareStyle();
      VCx = (X1 + X2) / 2;
      VCy = (Y1 + Y2) / 2;
      VRx = Math.abs(X2 - X1) / 2;
      VRy = Math.abs(Y2 - Y1) / 2;
      if ((VRx <= 0) || (VRy <= 0)) return;
      this.FContextElement.ellipse(VCx,VCy,VRx,VRy,0,0,6.2831853071795862);
      if (this.FBrush.FStyle !== $mod.TBrushStyle.bsClear) {
        this.FContextElement.fill();
      };
      if (this.FPen.FStyle !== $mod.TPenStyle.psClear) {
        this.FContextElement.stroke();
      };
    };
    this.RoundRect = function (X1, Y1, X2, Y2, ARadiusX, ARadiusY) {
      var VRx = 0.0;
      var VRy = 0.0;
      this.FContextElement.beginPath();
      this.PrepareStyle();
      VRx = Math.abs(ARadiusX);
      VRy = Math.abs(ARadiusY);
      if ((VRx <= 0) || (VRy <= 0)) {
        this.FContextElement.rect(X1,Y1,X2 - X1,Y2 - Y1);
      } else {
        this.FContextElement.moveTo(X1 + VRx,Y1);
        this.FContextElement.lineTo(X2 - VRx,Y1);
        this.FContextElement.quadraticCurveTo(X2,Y1,X2,Y1 + VRy);
        this.FContextElement.lineTo(X2,Y2 - VRy);
        this.FContextElement.quadraticCurveTo(X2,Y2,X2 - VRx,Y2);
        this.FContextElement.lineTo(X1 + VRx,Y2);
        this.FContextElement.quadraticCurveTo(X1,Y2,X1,Y2 - VRy);
        this.FContextElement.lineTo(X1,Y1 + VRy);
        this.FContextElement.quadraticCurveTo(X1,Y1,X1 + VRx,Y1);
        this.FContextElement.closePath();
      };
      if (this.FBrush.FStyle !== $mod.TBrushStyle.bsClear) {
        this.FContextElement.fill();
      };
      if (this.FPen.FStyle !== $mod.TPenStyle.psClear) {
        this.FContextElement.stroke();
      };
    };
    this.Polygon = function (APoints) {
      var VIndex = 0;
      if (rtl.length(APoints) < 2) return;
      this.FContextElement.beginPath();
      this.PrepareStyle();
      this.FContextElement.moveTo(APoints[0].x,APoints[0].y);
      for (var $l = 1, $end = rtl.length(APoints) - 1; $l <= $end; $l++) {
        VIndex = $l;
        this.FContextElement.lineTo(APoints[VIndex].x,APoints[VIndex].y);
      };
      this.FContextElement.closePath();
      if (this.FBrush.FStyle !== $mod.TBrushStyle.bsClear) {
        this.FContextElement.fill();
      };
      if (this.FPen.FStyle !== $mod.TPenStyle.psClear) {
        this.FContextElement.stroke();
      };
    };
    this.Polyline = function (APoints) {
      var VIndex = 0;
      if (rtl.length(APoints) < 2) return;
      this.FContextElement.beginPath();
      this.PrepareStyle();
      this.FContextElement.moveTo(APoints[0].x,APoints[0].y);
      for (var $l = 1, $end = rtl.length(APoints) - 1; $l <= $end; $l++) {
        VIndex = $l;
        this.FContextElement.lineTo(APoints[VIndex].x,APoints[VIndex].y);
      };
      if (this.FPen.FStyle !== $mod.TPenStyle.psClear) {
        this.FContextElement.stroke();
      };
    };
    this.TextExtent = function (AText) {
      var Result = pas.Types.TSize.$new();
      Result.$assign($mod.JSMeasureText(AText,this.FFont.FName,this.FFont.FSize,0));
      return Result;
    };
    this.TextHeight = function (AText) {
      var Result = 0;
      Result = this.TextExtent(AText).cy;
      return Result;
    };
    this.TextWidth = function (AText) {
      var Result = 0;
      Result = this.TextExtent(AText).cx;
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[]);
    $r.addProperty("Brush",0,$mod.$rtti["TBrush"],"FBrush","FBrush");
    $r.addProperty("Font",0,$mod.$rtti["TFont"],"FFont","FFont");
    $r.addProperty("Pen",0,$mod.$rtti["TPen"],"FPen","FPen");
    $r.addProperty("OnChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnChange","FOnChange");
  });
  this.clBlack = 0x0;
  this.clMaroon = 0x80;
  this.clGreen = 0x8000;
  this.clOlive = 0x8080;
  this.clNavy = 0x800000;
  this.clPurple = 0x800080;
  this.clTeal = 0x808000;
  this.clGray = 0x808080;
  this.clSilver = 0xC0C0C0;
  this.clRed = 0xFF;
  this.clLime = 0xFF00;
  this.clYellow = 0xFFFF;
  this.clBlue = 0xFF0000;
  this.clFuchsia = 0xFF00FF;
  this.clAqua = 0xFFFF00;
  this.clLtGray = 0xC0C0C0;
  this.clDkGray = 0x808080;
  this.clWhite = 0xFFFFFF;
  this.clMoneyGreen = 0xC0DCC0;
  this.clSkyBlue = 0xF0CAA6;
  this.clCream = 0xF0FBFF;
  this.clMedGray = 0xA4A0A0;
  this.clNone = 0x1FFFFFFF;
  this.clDefault = 0x20000000;
  this.clBase = 0x80000000;
  this.clScrollBar = -2147483648 + 0;
  this.clBackground = -2147483648 + 1;
  this.clActiveCaption = -2147483648 + 2;
  this.clInactiveCaption = -2147483648 + 3;
  this.clMenu = -2147483648 + 4;
  this.clWindow = -2147483648 + 5;
  this.clWindowFrame = -2147483648 + 6;
  this.clMenuText = -2147483648 + 7;
  this.clWindowText = -2147483648 + 8;
  this.clCaptionText = -2147483648 + 9;
  this.clActiveBorder = -2147483648 + 10;
  this.clInactiveBorder = -2147483648 + 11;
  this.clAppWorkspace = -2147483648 + 12;
  this.clHighlight = -2147483648 + 13;
  this.clHighlightText = -2147483648 + 14;
  this.clBtnFace = -2147483648 + 15;
  this.clBtnShadow = -2147483648 + 16;
  this.clGrayText = -2147483648 + 17;
  this.clBtnText = -2147483648 + 18;
  this.clInactiveCaptionText = -2147483648 + 19;
  this.clBtnHighlight = -2147483648 + 20;
  this.cl3DDkShadow = -2147483648 + 21;
  this.cl3DLight = -2147483648 + 22;
  this.clInfoText = -2147483648 + 23;
  this.clInfoBk = -2147483648 + 24;
  this.clColorDesktop = -2147483647;
  this.cl3DFace = -2147483633;
  this.cl3DShadow = -2147483632;
  this.cl3DHiLight = -2147483628;
  this.clBtnHiLight = -2147483628;
  this.clFirstSpecialColor = -2147483628;
  this.clMask = 16777215;
  this.clDontMask = 0;
  this.ffMonospace = "Consolas, monaco, monospace";
  this.ffSans = '"Arial Narrow", Arial, "Helvetica Condensed", Helvetica, sans-serif';
  this.ffTimes = '"Times New Roman", Times, serif';
  this.JSColor = function (AColor) {
    var Result = "";
    var R = 0;
    var G = 0;
    var B = 0;
    var $tmp = AColor;
    if ($tmp === -2147483648) {
      Result = "Scrollbar"}
     else if ($tmp === -2147483647) {
      Result = "Background"}
     else if ($tmp === -2147483646) {
      Result = "ActiveCaption"}
     else if ($tmp === -2147483645) {
      Result = "InactiveCaption"}
     else if ($tmp === -2147483644) {
      Result = "Menu"}
     else if ($tmp === -2147483643) {
      Result = "Window"}
     else if ($tmp === -2147483642) {
      Result = "WindowFrame"}
     else if ($tmp === -2147483641) {
      Result = "MenuText"}
     else if ($tmp === -2147483640) {
      Result = "WindowText"}
     else if ($tmp === -2147483639) {
      Result = "CaptionText"}
     else if ($tmp === -2147483638) {
      Result = "ActiveBorder"}
     else if ($tmp === -2147483637) {
      Result = "InactiveBorder"}
     else if ($tmp === -2147483636) {
      Result = "AppWorkspace"}
     else if ($tmp === -2147483635) {
      Result = "Highlight"}
     else if ($tmp === -2147483634) {
      Result = "HighlightText"}
     else if ($tmp === -2147483633) {
      Result = "ButtonFace"}
     else if ($tmp === -2147483632) {
      Result = "ButtonShadow"}
     else if ($tmp === -2147483631) {
      Result = "GrayText"}
     else if ($tmp === -2147483630) {
      Result = "ButtonText"}
     else if ($tmp === -2147483629) {
      Result = "InactiveCaptionText"}
     else if ($tmp === -2147483628) {
      Result = "ButtonHighlight"}
     else if ($tmp === -2147483627) {
      Result = "ThreeDDarkShadow"}
     else if ($tmp === -2147483626) {
      Result = "ThreeDHighlight"}
     else if ($tmp === -2147483625) {
      Result = "InfoText"}
     else if ($tmp === -2147483624) {
      Result = "InfoBackground"}
     else {
      R = AColor & 0xFF;
      G = (AColor >>> 8) & 0xFF;
      B = (AColor >>> 16) & 0xFF;
      Result = "#" + pas.SysUtils.IntToHex(R,2) + pas.SysUtils.IntToHex(G,2) + pas.SysUtils.IntToHex(B,2);
    };
    return Result;
  };
  this.HTMLColorToTColor = function (AValue) {
    var Result = 0;
    var R = 0;
    var G = 0;
    var B = 0;
    Result = 0;
    if ((AValue.length === 7) && (AValue.charAt(0) === "#")) {
      R = pas.SysUtils.StrToIntDef("$" + pas.System.Copy(AValue,2,2),0);
      G = pas.SysUtils.StrToIntDef("$" + pas.System.Copy(AValue,4,2),0);
      B = pas.SysUtils.StrToIntDef("$" + pas.System.Copy(AValue,6,2),0);
      Result = R + (G << 8) + (B << 16);
    };
    return Result;
  };
  this.JSFont = function (AFont) {
    var Result = "";
    Result = "";
    if (AFont != null) {
      if ($mod.TFontStyle.fsBold in AFont.FStyle) {
        Result = Result + "bold ";
      };
      if ($mod.TFontStyle.fsItalic in AFont.FStyle) {
        Result = Result + "italic ";
      };
      Result = Result + pas.SysUtils.IntToStr(AFont.FSize) + "px " + AFont.FName;
    };
    return Result;
  };
  this.JSFontFamily = function (AFont) {
    var Result = "";
    Result = "";
    if (AFont != null) {
      if (pas.System.Pos("ARIAL NARROW",pas.SysUtils.UpperCase(AFont.FName)) > 0) {
        Result = '"Arial Narrow", Arial, sans-serif'}
       else if (pas.System.Pos("ARIAL",pas.SysUtils.UpperCase(AFont.FName)) > 0) {
        Result = "Arial, sans-serif"}
       else if (pas.System.Pos("VERDANA",pas.SysUtils.UpperCase(AFont.FName)) > 0) {
        Result = "Verdana, sans-serif"}
       else if (pas.System.Pos("TAHOMA",pas.SysUtils.UpperCase(AFont.FName)) > 0) {
        Result = "Tahoma, sans-serif"}
       else if (pas.System.Pos("TIMES NEW ROMAN",pas.SysUtils.UpperCase(AFont.FName)) > 0) {
        Result = '"Times New Roman", serif'}
       else if (pas.System.Pos("GEORGIA",pas.SysUtils.UpperCase(AFont.FName)) > 0) {
        Result = "Georgia , serif"}
       else if (pas.System.Pos("GARAMOND",pas.SysUtils.UpperCase(AFont.FName)) > 0) {
        Result = "Garamond, serif"}
       else if (pas.System.Pos("HELVETICA",pas.SysUtils.UpperCase(AFont.FName)) > 0) {
        Result = "Helvetica , serif"}
       else if (pas.System.Pos("COURIER NEW",pas.SysUtils.UpperCase(AFont.FName)) > 0) Result = '"Courier New", monospace';
    };
    return Result;
  };
  this.JSMeasureText = function (AText, AFontName, AFontSize, AFixedWidth) {
    var Result = pas.Types.TSize.$new();
    var VDiv = null;
    Result.$assign(pas.Types.Size(0,0));
    if (AText !== "") {
      VDiv = document.createElement("div");
      VDiv.style.setProperty("font-family",AFontName);
      VDiv.style.setProperty("font-size",pas.SysUtils.IntToStr(AFontSize) + "px");
      VDiv.style.setProperty("overflow","scroll");
      if (AFixedWidth === 0) {
        VDiv.style.setProperty("display","inline-block");
        VDiv.style.setProperty("white-space","nowrap");
      } else {
        VDiv.style.setProperty("max-width",pas.SysUtils.IntToStr(AFixedWidth) + "px");
        VDiv.style.setProperty("width",pas.SysUtils.IntToStr(AFixedWidth) + "px");
      };
      VDiv.innerHTML = AText;
      document.body.appendChild(VDiv);
      Result.$assign(pas.Types.Size(VDiv.scrollWidth,VDiv.scrollHeight));
      document.body.removeChild(VDiv);
    };
    return Result;
  };
  this.PenStyleToCSSBorderStyle = function (aStyle) {
    var Result = "";
    var $tmp = aStyle;
    if (($tmp === $mod.TPenStyle.psSolid) || ($tmp === $mod.TPenStyle.psInsideFrame)) {
      Result = "solid"}
     else if (($tmp === $mod.TPenStyle.psDash) || ($tmp === $mod.TPenStyle.psDashDot) || ($tmp === $mod.TPenStyle.psDashDotDot)) {
      Result = "dashed"}
     else if ($tmp === $mod.TPenStyle.psDot) {
      Result = "dotted"}
     else if (($tmp === $mod.TPenStyle.psClear) || ($tmp === $mod.TPenStyle.psPattern)) {
      Result = "none"}
     else {
      Result = "none";
    };
    return Result;
  };
  this.AlignmentToCSSAlignment = function (aAlignment) {
    var Result = "";
    var $tmp = aAlignment;
    if ($tmp === pas.Classes.TAlignment.taLeftJustify) {
      Result = "left"}
     else if ($tmp === pas.Classes.TAlignment.taRightJustify) {
      Result = "right"}
     else if ($tmp === pas.Classes.TAlignment.taCenter) Result = "center";
    return Result;
  };
  this.TextLayoutToCSSVerticalAlign = function (aLayout) {
    var Result = "";
    var $tmp = aLayout;
    if ($tmp === $mod.TTextLayout.tlTop) {
      Result = "text-top"}
     else if ($tmp === $mod.TTextLayout.tlCenter) {
      Result = "baseline"}
     else if ($tmp === $mod.TTextLayout.tlBottom) Result = "text-bottom";
    return Result;
  };
  this.IdentEntry = function (Entry, MapEntry) {
    var Result = false;
    Result = false;
    if ((Entry >= 0) && (Entry <= 46)) {
      MapEntry.$assign($impl.Colors[Entry]);
      Result = true;
    };
    return Result;
  };
  this.ColorToIdent = function (Color, Ident) {
    var Result = false;
    Result = pas.Classes.IntToIdent(Color,Ident,$impl.Colors);
    return Result;
  };
  this.IdentToColor = function (Ident, Color) {
    var Result = false;
    Result = pas.Classes.IdentToInt(Ident,Color,$impl.Colors);
    return Result;
  };
  this.ColorIndex = function (Color, Index) {
    var Result = false;
    var i = 0;
    for (i = 0; i <= 46; i++) if ($impl.Colors[i].Value === Color) {
      Result = true;
      Index.set(i);
      return Result;
    };
    Result = false;
    return Result;
  };
  $mod.$implcode = function () {
    $impl.TwoPi = 2 * 3.14159265358979323846;
    $impl.Colors$a$clone = function (a) {
      var b = [];
      b.length = 47;
      for (var c = 0; c < 47; c++) b[c] = pas.Classes.TIdentMapEntry.$clone(a[c]);
      return b;
    };
    $mod.$rtti.$StaticArray("Colors$a",{dims: [47], eltype: pas.Classes.$rtti["TIdentMapEntry"]});
    $impl.Colors = [pas.Classes.TIdentMapEntry.$clone({Value: 0, Name: "clBlack"}),pas.Classes.TIdentMapEntry.$clone({Value: 128, Name: "clMaroon"}),pas.Classes.TIdentMapEntry.$clone({Value: 32768, Name: "clGreen"}),pas.Classes.TIdentMapEntry.$clone({Value: 32896, Name: "clOlive"}),pas.Classes.TIdentMapEntry.$clone({Value: 8388608, Name: "clNavy"}),pas.Classes.TIdentMapEntry.$clone({Value: 8388736, Name: "clPurple"}),pas.Classes.TIdentMapEntry.$clone({Value: 8421376, Name: "clTeal"}),pas.Classes.TIdentMapEntry.$clone({Value: 8421504, Name: "clGray"}),pas.Classes.TIdentMapEntry.$clone({Value: 12632256, Name: "clSilver"}),pas.Classes.TIdentMapEntry.$clone({Value: 255, Name: "clRed"}),pas.Classes.TIdentMapEntry.$clone({Value: 65280, Name: "clLime"}),pas.Classes.TIdentMapEntry.$clone({Value: 65535, Name: "clYellow"}),pas.Classes.TIdentMapEntry.$clone({Value: 16711680, Name: "clBlue"}),pas.Classes.TIdentMapEntry.$clone({Value: 16711935, Name: "clFuchsia"}),pas.Classes.TIdentMapEntry.$clone({Value: 16776960, Name: "clAqua"}),pas.Classes.TIdentMapEntry.$clone({Value: 16777215, Name: "clWhite"}),pas.Classes.TIdentMapEntry.$clone({Value: 12639424, Name: "clMoneyGreen"}),pas.Classes.TIdentMapEntry.$clone({Value: 15780518, Name: "clSkyBlue"}),pas.Classes.TIdentMapEntry.$clone({Value: 15793151, Name: "clCream"}),pas.Classes.TIdentMapEntry.$clone({Value: 10789024, Name: "clMedGray"}),pas.Classes.TIdentMapEntry.$clone({Value: 536870911, Name: "clNone"}),pas.Classes.TIdentMapEntry.$clone({Value: 536870912, Name: "clDefault"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483648, Name: "clScrollBar"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483647, Name: "clBackground"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483646, Name: "clActiveCaption"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483645, Name: "clInactiveCaption"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483644, Name: "clMenu"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483641, Name: "clMenuText"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483643, Name: "clWindow"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483642, Name: "clWindowFrame"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483640, Name: "clWindowText"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483639, Name: "clCaptionText"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483638, Name: "clActiveBorder"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483637, Name: "clInactiveBorder"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483636, Name: "clAppWorkspace"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483635, Name: "clHighlight"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483634, Name: "clHighlightText"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483633, Name: "clBtnFace"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483632, Name: "clBtnShadow"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483631, Name: "clGrayText"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483630, Name: "clBtnText"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483629, Name: "clInactiveCaptionText"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483628, Name: "clBtnHighlight"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483627, Name: "cl3DDkShadow"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483626, Name: "cl3DLight"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483625, Name: "clInfoText"}),pas.Classes.TIdentMapEntry.$clone({Value: -2147483624, Name: "clInfoBk"})];
  };
  $mod.$init = function () {
    pas.Classes.RegisterIntegerConsts(rtl.longint,$mod.IdentToColor,$mod.ColorToIdent);
  };
},[]);
//# sourceMappingURL=graphics.js.map
