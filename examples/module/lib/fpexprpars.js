rtl.module("fpexprpars",["System","Classes","SysUtils","contnrs","JS"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.TTokenType = {"0": "ttPlus", ttPlus: 0, "1": "ttMinus", ttMinus: 1, "2": "ttLessThan", ttLessThan: 2, "3": "ttLargerThan", ttLargerThan: 3, "4": "ttEqual", ttEqual: 4, "5": "ttDiv", ttDiv: 5, "6": "ttMod", ttMod: 6, "7": "ttMul", ttMul: 7, "8": "ttLeft", ttLeft: 8, "9": "ttRight", ttRight: 9, "10": "ttLessThanEqual", ttLessThanEqual: 10, "11": "ttLargerThanEqual", ttLargerThanEqual: 11, "12": "ttunequal", ttunequal: 12, "13": "ttNumber", ttNumber: 13, "14": "ttString", ttString: 14, "15": "ttIdentifier", ttIdentifier: 15, "16": "ttComma", ttComma: 16, "17": "ttAnd", ttAnd: 17, "18": "ttOr", ttOr: 18, "19": "ttXor", ttXor: 19, "20": "ttTrue", ttTrue: 20, "21": "ttFalse", ttFalse: 21, "22": "ttNot", ttNot: 22, "23": "ttif", ttif: 23, "24": "ttCase", ttCase: 24, "25": "ttPower", ttPower: 25, "26": "ttLike", ttLike: 26, "27": "ttEOF", ttEOF: 27};
  this.$rtti.$Enum("TTokenType",{minvalue: 0, maxvalue: 27, ordtype: 1, enumtype: this.TTokenType});
  this.ttDelimiters = rtl.createSet(this.TTokenType.ttPlus,this.TTokenType.ttMinus,this.TTokenType.ttLessThan,this.TTokenType.ttLargerThan,this.TTokenType.ttEqual,this.TTokenType.ttDiv,this.TTokenType.ttMul,this.TTokenType.ttLeft,this.TTokenType.ttRight,this.TTokenType.ttLessThanEqual,this.TTokenType.ttLargerThanEqual,this.TTokenType.ttunequal,this.TTokenType.ttPower);
  this.ttComparisons = rtl.createSet(this.TTokenType.ttLargerThan,this.TTokenType.ttLessThan,this.TTokenType.ttLargerThanEqual,this.TTokenType.ttLessThanEqual,this.TTokenType.ttEqual,this.TTokenType.ttunequal,this.TTokenType.ttLike);
  this.$rtti.$Class("TFPExpressionParser");
  this.$rtti.$Class("TExprBuiltInManager");
  this.$rtti.$Class("TFPExprFunction");
  this.$rtti.$ClassRef("TFPExprFunctionClass",{instancetype: this.$rtti["TFPExprFunction"]});
  this.TNumberKind = {"0": "nkDecimal", nkDecimal: 0, "1": "nkHex", nkHex: 1, "2": "nkOctal", nkOctal: 2, "3": "nkBinary", nkBinary: 3};
  this.$rtti.$Enum("TNumberKind",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TNumberKind});
  rtl.createClass(this,"TFPExpressionScanner",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FSource = "";
      this.LSource = 0;
      this.FPos = 0;
      this.FChar = "\x00";
      this.FToken = "";
      this.FTokenType = 0;
      this.FAllowLike = false;
    };
    this.GetCurrentChar = function () {
      var Result = "\x00";
      Result = this.FChar;
      return Result;
    };
    this.ScanError = function (Msg) {
      throw $mod.EExprScanner.$create("Create$1",[Msg]);
    };
    this.SetSource = function (AValue) {
      this.FSource = AValue;
      this.LSource = this.FSource.length;
      this.FTokenType = $mod.TTokenType.ttEOF;
      if (this.LSource === 0) {
        this.FPos = 0;
        this.FChar = $impl.cNull;
      } else {
        this.FPos = 1;
        this.FChar = this.FSource.charAt(0);
      };
      this.FToken = "";
    };
    this.DoIdentifier = function () {
      var Result = 0;
      var C = "\x00";
      var S = "";
      C = this.GetCurrentChar();
      while (!this.IsWordDelim(C) && (C !== $impl.cNull)) {
        if (C !== '"') {
          this.FToken = this.FToken + C}
         else {
          C = this.NextPos();
          while (!(C.charCodeAt() in rtl.createSet($impl.cNull.charCodeAt(),34))) {
            this.FToken = this.FToken + C;
            C = this.NextPos();
          };
          if (C !== '"') this.ScanError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrUnterminatedIdentifier"),pas.System.VarRecs(18,this.FToken)));
        };
        C = this.NextPos();
      };
      S = pas.SysUtils.LowerCase(this.FToken);
      if (S === "or") {
        Result = $mod.TTokenType.ttOr}
       else if (S === "xor") {
        Result = $mod.TTokenType.ttXor}
       else if (S === "and") {
        Result = $mod.TTokenType.ttAnd}
       else if (S === "true") {
        Result = $mod.TTokenType.ttTrue}
       else if (S === "false") {
        Result = $mod.TTokenType.ttFalse}
       else if (S === "not") {
        Result = $mod.TTokenType.ttNot}
       else if (S === "if") {
        Result = $mod.TTokenType.ttif}
       else if (S === "case") {
        Result = $mod.TTokenType.ttCase}
       else if (S === "mod") {
        Result = $mod.TTokenType.ttMod}
       else if ((S === "like") && this.FAllowLike) {
        Result = $mod.TTokenType.ttLike}
       else Result = $mod.TTokenType.ttIdentifier;
      return Result;
    };
    this.DoNumber = function (AKind) {
      var $Self = this;
      var Result = 0;
      var C = "\x00";
      var X = 0.0;
      var I = 0;
      var prevC = "\x00";
      function ValidDigit(C, AKind) {
        var Result = false;
        Result = $Self.IsDigit(C,AKind);
        if (!Result) {
          var $tmp = AKind;
          if ($tmp === $mod.TNumberKind.nkDecimal) {
            Result = (($Self.FToken !== "") && (pas.System.upcase(C) === "E")) || (($Self.FToken !== "") && (C.charCodeAt() in rtl.createSet(43,45)) && (prevC === "E"))}
           else if ($tmp === $mod.TNumberKind.nkHex) {
            Result = (C === $impl.cHexIdentifier) && (prevC === "\x00")}
           else if ($tmp === $mod.TNumberKind.nkOctal) {
            Result = (C === $impl.cOctalIdentifier) && (prevC === "\x00")}
           else if ($tmp === $mod.TNumberKind.nkBinary) Result = (C === $impl.cBinaryIdentifier) && (prevC === "\x00");
        };
        return Result;
      };
      C = this.GetCurrentChar();
      prevC = "\x00";
      while (C !== $impl.cNull) {
        if (this.IsWordDelim(C)) {
          var $tmp = AKind;
          if ($tmp === $mod.TNumberKind.nkDecimal) {
            if (!(prevC.charCodeAt() in rtl.createSet(69,45,43))) break}
           else if (($tmp === $mod.TNumberKind.nkHex) || ($tmp === $mod.TNumberKind.nkOctal)) {
            break}
           else if ($tmp === $mod.TNumberKind.nkBinary) if (prevC !== "\x00") break;
        };
        if (!ValidDigit(C,AKind)) this.ScanError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrInvalidNumberChar"),pas.System.VarRecs(9,C)));
        this.FToken = this.FToken + C;
        prevC = pas.System.upcase(C);
        C = this.NextPos();
      };
      pas.System.val$8(this.FToken,{get: function () {
          return X;
        }, set: function (v) {
          X = v;
        }},{get: function () {
          return I;
        }, set: function (v) {
          I = v;
        }});
      if (I !== 0) this.ScanError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrInvalidNumber"),pas.System.VarRecs(18,this.FToken)));
      Result = $mod.TTokenType.ttNumber;
      return Result;
    };
    this.DoDelimiter = function () {
      var Result = 0;
      var B = false;
      var C = "\x00";
      var D = "\x00";
      C = this.FChar;
      this.FToken = C;
      B = C.charCodeAt() in rtl.createSet(60,62);
      D = C;
      C = this.NextPos();
      if (B && (C.charCodeAt() in rtl.createSet(61,62))) {
        this.FToken = this.FToken + C;
        this.NextPos();
        if (D === ">") {
          Result = $mod.TTokenType.ttLargerThanEqual}
         else if (C === ">") {
          Result = $mod.TTokenType.ttunequal}
         else Result = $mod.TTokenType.ttLessThanEqual;
      } else {
        var $tmp = D;
        if ($tmp === "+") {
          Result = $mod.TTokenType.ttPlus}
         else if ($tmp === "-") {
          Result = $mod.TTokenType.ttMinus}
         else if ($tmp === "<") {
          Result = $mod.TTokenType.ttLessThan}
         else if ($tmp === ">") {
          Result = $mod.TTokenType.ttLargerThan}
         else if ($tmp === "=") {
          Result = $mod.TTokenType.ttEqual}
         else if ($tmp === "/") {
          Result = $mod.TTokenType.ttDiv}
         else if ($tmp === "*") {
          Result = $mod.TTokenType.ttMul}
         else if ($tmp === "(") {
          Result = $mod.TTokenType.ttLeft}
         else if ($tmp === ")") {
          Result = $mod.TTokenType.ttRight}
         else if ($tmp === ",") {
          Result = $mod.TTokenType.ttComma}
         else if ($tmp === "^") {
          Result = $mod.TTokenType.ttPower}
         else {
          this.ScanError(pas.SysUtils.Format(rtl.getResStr($mod,"SUnknownDelimiter"),pas.System.VarRecs(9,D)));
        };
      };
      return Result;
    };
    this.DoString = function () {
      var $Self = this;
      var Result = 0;
      function TerminatingChar(C) {
        var Result = false;
        Result = (C === $impl.cNull) || ((C === $impl.cSingleQuote) && !(($Self.FPos < $Self.LSource) && ($Self.FSource.charAt(($Self.FPos + 1) - 1) === $impl.cSingleQuote)));
        return Result;
      };
      var C = "\x00";
      this.FToken = "";
      C = this.NextPos();
      while (!TerminatingChar(C)) {
        this.FToken = this.FToken + C;
        if (C === $impl.cSingleQuote) this.NextPos();
        C = this.NextPos();
      };
      if (C === $impl.cNull) this.ScanError(rtl.getResStr($mod,"SBadQuotes"));
      Result = $mod.TTokenType.ttString;
      this.FTokenType = Result;
      this.NextPos();
      return Result;
    };
    this.NextPos = function () {
      var Result = "\x00";
      this.FPos += 1;
      if (this.FPos > this.FSource.length) {
        this.FChar = $impl.cNull}
       else this.FChar = this.FSource.charAt(this.FPos - 1);
      Result = this.FChar;
      return Result;
    };
    this.SkipWhiteSpace = function () {
      while ((this.FChar.charCodeAt() in $impl.WhiteSpace) && (this.FPos <= this.LSource)) this.NextPos();
    };
    this.IsWordDelim = function (C) {
      var Result = false;
      Result = C.charCodeAt() in $impl.WordDelimiters;
      return Result;
    };
    this.IsDelim = function (C) {
      var Result = false;
      Result = C.charCodeAt() in $impl.Delimiters;
      return Result;
    };
    this.IsDigit = function (C, AKind) {
      var Result = false;
      var $tmp = AKind;
      if ($tmp === $mod.TNumberKind.nkDecimal) {
        Result = C.charCodeAt() in $impl.Digits}
       else if ($tmp === $mod.TNumberKind.nkHex) {
        Result = C.charCodeAt() in $impl.HexDigits}
       else if ($tmp === $mod.TNumberKind.nkOctal) {
        Result = C.charCodeAt() in $impl.OctalDigits}
       else if ($tmp === $mod.TNumberKind.nkBinary) Result = C.charCodeAt() in $impl.BinaryDigits;
      return Result;
    };
    this.IsAlpha = function (C) {
      var Result = false;
      Result = C.charCodeAt() in rtl.createSet(null,65,90,null,97,122);
      return Result;
    };
    this.Create$1 = function () {
      this.SetSource("");
      return this;
    };
    this.GetToken = function () {
      var Result = 0;
      var C = "\x00";
      this.FToken = "";
      this.SkipWhiteSpace();
      C = this.FChar;
      if (C === $impl.cNull) {
        Result = $mod.TTokenType.ttEOF}
       else if (this.IsDelim(C)) {
        Result = this.DoDelimiter()}
       else if (C === $impl.cSingleQuote) {
        Result = this.DoString()}
       else if (C === $impl.cHexIdentifier) {
        Result = this.DoNumber($mod.TNumberKind.nkHex)}
       else if (C === $impl.cOctalIdentifier) {
        Result = this.DoNumber($mod.TNumberKind.nkOctal)}
       else if (C === $impl.cBinaryIdentifier) {
        Result = this.DoNumber($mod.TNumberKind.nkBinary)}
       else if (this.IsDigit(C,$mod.TNumberKind.nkDecimal)) {
        Result = this.DoNumber($mod.TNumberKind.nkDecimal)}
       else if (this.IsAlpha(C) || (C === '"') || (C === "_")) {
        Result = this.DoIdentifier()}
       else this.ScanError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrUnknownCharacter"),pas.System.VarRecs(0,this.FPos,9,C)));
      this.FTokenType = Result;
      return Result;
    };
  });
  rtl.createClass(this,"EExprScanner",pas.SysUtils.Exception,function () {
  });
  this.TResultType = {"0": "rtBoolean", rtBoolean: 0, "1": "rtInteger", rtInteger: 1, "2": "rtFloat", rtFloat: 2, "3": "rtDateTime", rtDateTime: 3, "4": "rtString", rtString: 4, "5": "rtCurrency", rtCurrency: 5};
  this.$rtti.$Enum("TResultType",{minvalue: 0, maxvalue: 5, ordtype: 1, enumtype: this.TResultType});
  this.$rtti.$Set("TResultTypes",{comptype: this.$rtti["TResultType"]});
  rtl.recNewT(this,"TFPExpressionResult",function () {
    this.ResultType = 0;
    this.resValue = undefined;
    this.$eq = function (b) {
      return (this.ResultType === b.ResultType) && (this.resValue === b.resValue);
    };
    this.$assign = function (s) {
      this.ResultType = s.ResultType;
      this.resValue = s.resValue;
      return this;
    };
    var $r = $mod.$rtti.$Record("TFPExpressionResult",{});
    $r.addField("ResultType",$mod.$rtti["TResultType"]);
    $r.addField("resValue",rtl.jsvalue);
  });
  this.$rtti.$Pointer("PFPExpressionResult",{reftype: this.$rtti["TFPExpressionResult"]});
  this.$rtti.$DynArray("TExprParameterArray",{eltype: this.$rtti["TFPExpressionResult"]});
  rtl.createClass(this,"TFPExprNode",pas.System.TObject,function () {
    this.CheckNodeType = function (Anode, Allowed) {
      var S = "";
      var A = 0;
      if (Anode === null) $impl.RaiseParserError(rtl.getResStr($mod,"SErrNoNodeToCheck"));
      if (!(Anode.NodeType() in Allowed)) {
        S = "";
        for (A = 0; A <= 5; A++) if (A in Allowed) {
          if (S !== "") S = S + ",";
          S = S + $mod.ResultTypeName(A);
        };
        $impl.RaiseParserError$1(rtl.getResStr($mod,"SInvalidNodeType"),pas.System.VarRecs(18,$mod.ResultTypeName(Anode.NodeType()),18,S,18,Anode.AsString()));
      };
    };
    this.InitAggregate = function () {
    };
    this.UpdateAggregate = function () {
    };
    this.IsAggregate = function () {
      var Result = false;
      Result = false;
      return Result;
    };
    this.HasAggregate = function () {
      var Result = false;
      Result = this.$class.IsAggregate();
      return Result;
    };
    this.NodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.GetNodeValue());
      return Result;
    };
  });
  this.$rtti.$DynArray("TExprArgumentArray",{eltype: this.$rtti["TFPExprNode"]});
  rtl.createClass(this,"TFPBinaryOperation",this.TFPExprNode,function () {
    this.$init = function () {
      $mod.TFPExprNode.$init.call(this);
      this.FLeft = null;
      this.FRight = null;
    };
    this.$final = function () {
      this.FLeft = undefined;
      this.FRight = undefined;
      $mod.TFPExprNode.$final.call(this);
    };
    this.CheckSameNodeTypes = function () {
      var LT = 0;
      var RT = 0;
      LT = this.FLeft.NodeType();
      RT = this.FRight.NodeType();
      if (RT !== LT) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrTypesDoNotMatch"),pas.System.VarRecs(18,$mod.ResultTypeName(LT),18,$mod.ResultTypeName(RT),18,this.FLeft.AsString(),18,this.FRight.AsString()));
    };
    this.Create$1 = function (ALeft, ARight) {
      this.FLeft = ALeft;
      this.FRight = ARight;
      return this;
    };
    this.Destroy = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FLeft;
        }, set: function (v) {
          this.p.FLeft = v;
        }});
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FRight;
        }, set: function (v) {
          this.p.FRight = v;
        }});
      pas.System.TObject.Destroy.call(this);
    };
    this.InitAggregate = function () {
      $mod.TFPExprNode.InitAggregate.call(this);
      if (this.FLeft != null) this.FLeft.InitAggregate();
      if (this.FRight != null) this.FRight.InitAggregate();
    };
    this.UpdateAggregate = function () {
      $mod.TFPExprNode.UpdateAggregate.call(this);
      if (this.FLeft != null) this.FLeft.UpdateAggregate();
      if (this.FRight != null) this.FRight.UpdateAggregate();
    };
    this.HasAggregate = function () {
      var Result = false;
      Result = $mod.TFPExprNode.HasAggregate.call(this);
      if (this.FLeft != null) Result = Result || this.FLeft.HasAggregate();
      if (this.FRight != null) Result = Result || this.FRight.HasAggregate();
      return Result;
    };
    this.Check = function () {
      if (!(this.FLeft != null)) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrNoleftOperand"),pas.System.VarRecs(18,this.$classname));
      if (!(this.FRight != null)) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrNoRightOperand"),pas.System.VarRecs(18,this.$classname));
    };
  });
  this.$rtti.$ClassRef("TFPBinaryOperationClass",{instancetype: this.$rtti["TFPBinaryOperation"]});
  rtl.createClass(this,"TFPBooleanOperation",this.TFPBinaryOperation,function () {
    this.Check = function () {
      $mod.TFPBinaryOperation.Check.call(this);
      this.CheckNodeType(this.FLeft,rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtBoolean));
      this.CheckNodeType(this.FRight,rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtBoolean));
      this.CheckSameNodeTypes();
    };
    this.NodeType = function () {
      var Result = 0;
      Result = this.FLeft.NodeType();
      return Result;
    };
  });
  rtl.createClass(this,"TFPBinaryAndOperation",this.TFPBooleanOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtBoolean) {
        Result.resValue = !(Result.resValue == false) && !(RRes.resValue == false)}
       else if ($tmp === $mod.TResultType.rtInteger) Result.resValue = rtl.and(rtl.trunc(Result.resValue),rtl.trunc(RRes.resValue));
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " and " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPBinaryOrOperation",this.TFPBooleanOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtBoolean) {
        Result.resValue = !(Result.resValue == false) || !(RRes.resValue == false)}
       else if ($tmp === $mod.TResultType.rtInteger) Result.resValue = rtl.or(rtl.trunc(Result.resValue),rtl.trunc(RRes.resValue));
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " or " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPBinaryXOrOperation",this.TFPBooleanOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtBoolean) {
        Result.resValue = !(Result.resValue == false) ^ !(RRes.resValue == false)}
       else if ($tmp === $mod.TResultType.rtInteger) Result.resValue = rtl.xor(rtl.trunc(Result.resValue),rtl.trunc(RRes.resValue));
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " xor " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPBooleanResultOperation",this.TFPBinaryOperation,function () {
    this.Check = function () {
      $mod.TFPBinaryOperation.Check.call(this);
      this.CheckSameNodeTypes();
    };
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtBoolean;
      return Result;
    };
  });
  this.$rtti.$ClassRef("TFPBooleanResultOperationClass",{instancetype: this.$rtti["TFPBooleanResultOperation"]});
  rtl.createClass(this,"TFPEqualOperation",this.TFPBooleanResultOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      Result.resValue = Result.resValue == RRes.resValue;
      Result.ResultType = $mod.TResultType.rtBoolean;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " = " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPLikeOperation",this.TFPBooleanResultOperation,function () {
    this.$init = function () {
      $mod.TFPBooleanResultOperation.$init.call(this);
      this.FRE = null;
      this.FLast = "";
    };
    this.$final = function () {
      this.FRE = undefined;
      $mod.TFPBooleanResultOperation.$final.call(this);
    };
    var RESpecials = "([\\$\\+\\[\\]\\(\\)\\\\\\.\\*\\^\\?\\|])";
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var S = "";
      var RE = null;
      S = "" + this.FRight.NodeValue().resValue;
      if ((this.FLast !== "") && (S === this.FLast)) {
        RE = this.FRE}
       else {
        this.FLast = S;
        S = S.replace(new RegExp(RESpecials,"g"),"\\$1");
        S = pas.SysUtils.StringReplace(S,"%","(.*)",rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll));
        S = pas.SysUtils.StringReplace(S,"_","(.)",rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll));
        S = "^" + S + "$";
        try {
          this.FRE = new RegExp(S,"i");
          RE = this.FRE;
        } catch ($e) {
          Result.resValue = false;
          return Result;
        };
      };
      Result.resValue = RE.test("" + this.FLeft.NodeValue().resValue);
      return Result;
    };
    this.Check = function () {
      if (this.FLeft.NodeType() !== $mod.TResultType.rtString) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrStringTypeRequired"),pas.System.VarRecs(18,$mod.ResultTypeName(this.FLeft.NodeType()),18,this.FLeft.AsString()));
      if (this.FRight.NodeType() !== $mod.TResultType.rtString) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrStringTypeRequired"),pas.System.VarRecs(18,$mod.ResultTypeName(this.FRight.NodeType()),18,this.FRight.AsString()));
      $mod.TFPBooleanResultOperation.Check.call(this);
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " LIKE " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPUnequalOperation",this.TFPEqualOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign($mod.TFPEqualOperation.GetNodeValue.call(this));
      Result.resValue = !Result.resValue;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " <> " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPOrderingOperation",this.TFPBooleanResultOperation,function () {
    var AllowedTypes = rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtFloat,$mod.TResultType.rtCurrency,$mod.TResultType.rtDateTime,$mod.TResultType.rtString);
    this.Check = function () {
      this.CheckNodeType(this.FLeft,AllowedTypes);
      this.CheckNodeType(this.FRight,AllowedTypes);
      $mod.TFPBooleanResultOperation.Check.call(this);
    };
  });
  rtl.createClass(this,"TFPLessThanOperation",this.TFPOrderingOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        Result.resValue = rtl.trunc(Result.resValue) < rtl.trunc(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result.resValue = rtl.getNumber(Result.resValue) < rtl.getNumber(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtCurrency) {
        Result.resValue = rtl.trunc(Result.resValue * 10000) < rtl.trunc(RRes.resValue * 10000)}
       else if ($tmp === $mod.TResultType.rtDateTime) {
        Result.resValue = rtl.getNumber(Result.resValue) < rtl.getNumber(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtString) Result.resValue = ("" + Result.resValue) < ("" + RRes.resValue);
      Result.ResultType = $mod.TResultType.rtBoolean;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " < " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPGreaterThanOperation",this.TFPOrderingOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        var $tmp1 = this.FRight.NodeType();
        if ($tmp1 === $mod.TResultType.rtInteger) {
          Result.resValue = rtl.trunc(Result.resValue) > rtl.trunc(RRes.resValue)}
         else if ($tmp1 === $mod.TResultType.rtFloat) {
          Result.resValue = rtl.trunc(Result.resValue) > rtl.getNumber(RRes.resValue)}
         else if ($tmp1 === $mod.TResultType.rtCurrency) Result.resValue = (rtl.trunc(Result.resValue) * 10000) > rtl.trunc(RRes.resValue * 10000);
      } else if ($tmp === $mod.TResultType.rtFloat) {
        var $tmp2 = this.FRight.NodeType();
        if ($tmp2 === $mod.TResultType.rtInteger) {
          Result.resValue = rtl.getNumber(Result.resValue) > rtl.trunc(RRes.resValue)}
         else if ($tmp2 === $mod.TResultType.rtFloat) {
          Result.resValue = rtl.getNumber(Result.resValue) > rtl.getNumber(RRes.resValue)}
         else if ($tmp2 === $mod.TResultType.rtCurrency) Result.resValue = (rtl.getNumber(Result.resValue) * 10000) > rtl.trunc(RRes.resValue * 10000);
      } else if ($tmp === $mod.TResultType.rtCurrency) {
        var $tmp3 = this.FRight.NodeType();
        if ($tmp3 === $mod.TResultType.rtInteger) {
          Result.resValue = rtl.trunc(Result.resValue * 10000) > (rtl.trunc(RRes.resValue) * 10000)}
         else if ($tmp3 === $mod.TResultType.rtFloat) {
          Result.resValue = rtl.trunc(Result.resValue * 10000) > (rtl.getNumber(RRes.resValue) * 10000)}
         else if ($tmp3 === $mod.TResultType.rtCurrency) Result.resValue = rtl.trunc(Result.resValue * 10000) > rtl.trunc(RRes.resValue * 10000);
      } else if ($tmp === $mod.TResultType.rtDateTime) {
        Result.resValue = rtl.getNumber(Result.resValue) > rtl.getNumber(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtString) Result.resValue = ("" + Result.resValue) > ("" + RRes.resValue);
      Result.ResultType = $mod.TResultType.rtBoolean;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " > " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPLessThanEqualOperation",this.TFPGreaterThanOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign($mod.TFPGreaterThanOperation.GetNodeValue.call(this));
      Result.resValue = !Result.resValue;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " <= " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPGreaterThanEqualOperation",this.TFPLessThanOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign($mod.TFPLessThanOperation.GetNodeValue.call(this));
      Result.resValue = !Result.resValue;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " >= " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TIfOperation",this.TFPBinaryOperation,function () {
    this.$init = function () {
      $mod.TFPBinaryOperation.$init.call(this);
      this.FCondition = null;
    };
    this.$final = function () {
      this.FCondition = undefined;
      $mod.TFPBinaryOperation.$final.call(this);
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FCondition.GetNodeValue());
      if (!(Result.resValue == false)) {
        Result.$assign(this.FLeft.GetNodeValue())}
       else Result.$assign(this.FRight.GetNodeValue());
      return Result;
    };
    this.Check = function () {
      $mod.TFPBinaryOperation.Check.call(this);
      if (this.FCondition.NodeType() !== $mod.TResultType.rtBoolean) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrIFNeedsBoolean"),pas.System.VarRecs(18,this.FCondition.AsString()));
      this.CheckSameNodeTypes();
    };
    this.InitAggregate = function () {
      $mod.TFPBinaryOperation.InitAggregate.call(this);
      if (this.FCondition != null) this.FCondition.InitAggregate();
    };
    this.UpdateAggregate = function () {
      $mod.TFPBinaryOperation.UpdateAggregate.call(this);
      if (this.FCondition != null) this.FCondition.UpdateAggregate();
    };
    this.HasAggregate = function () {
      var Result = false;
      Result = $mod.TFPBinaryOperation.HasAggregate.call(this);
      if (this.FCondition != null) Result = Result || this.FCondition.HasAggregate();
      return Result;
    };
    this.NodeType = function () {
      var Result = 0;
      Result = this.FLeft.NodeType();
      return Result;
    };
    this.Create$2 = function (ACondition, ALeft, ARight) {
      $mod.TFPBinaryOperation.Create$1.call(this,ALeft,ARight);
      this.FCondition = ACondition;
      return this;
    };
    this.Destroy = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FCondition;
        }, set: function (v) {
          this.p.FCondition = v;
        }});
      $mod.TFPBinaryOperation.Destroy.call(this);
    };
    this.AsString = function () {
      var Result = "";
      Result = pas.SysUtils.Format("if(%s , %s , %s)",pas.System.VarRecs(18,this.FCondition.AsString(),18,this.FLeft.AsString(),18,this.FRight.AsString()));
      return Result;
    };
  });
  rtl.createClass(this,"TCaseOperation",this.TFPExprNode,function () {
    this.$init = function () {
      $mod.TFPExprNode.$init.call(this);
      this.FArgs = [];
      this.FCondition = null;
    };
    this.$final = function () {
      this.FArgs = undefined;
      this.FCondition = undefined;
      $mod.TFPExprNode.$final.call(this);
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var I = 0;
      var L = 0;
      var B = false;
      var RT = $mod.TFPExpressionResult.$new();
      var RV = $mod.TFPExpressionResult.$new();
      RT.$assign(this.FArgs[0].GetNodeValue());
      L = rtl.length(this.FArgs);
      I = 2;
      B = false;
      while (!B && (I < L)) {
        Result.$assign(this.FArgs[I].GetNodeValue());
        var $tmp = RT.ResultType;
        if ($tmp === $mod.TResultType.rtBoolean) {
          B = RT.resValue == RV.resValue}
         else if ($tmp === $mod.TResultType.rtInteger) {
          B = RT.resValue == RV.resValue}
         else if ($tmp === $mod.TResultType.rtFloat) {
          B = RT.resValue == RV.resValue}
         else if ($tmp === $mod.TResultType.rtCurrency) {
          B = RT.resValue == RV.resValue}
         else if ($tmp === $mod.TResultType.rtDateTime) {
          B = RT.resValue == RV.resValue}
         else if ($tmp === $mod.TResultType.rtString) B = RT.resValue == RV.resValue;
        if (!B) I += 2;
      };
      Result.ResultType = this.FArgs[1].NodeType();
      if (B) {
        Result.$assign(this.FArgs[I + 1].GetNodeValue())}
       else if ((L % 2) === 0) Result.$assign(this.FArgs[1].GetNodeValue());
      return Result;
    };
    this.Check = function () {
      var T = 0;
      var V = 0;
      var I = 0;
      var N = null;
      if (rtl.length(this.FArgs) < 3) $impl.RaiseParserError(rtl.getResStr($mod,"SErrCaseNeeds3"));
      if ((rtl.length(this.FArgs) % 2) === 1) $impl.RaiseParserError(rtl.getResStr($mod,"SErrCaseEvenCount"));
      T = this.FArgs[0].NodeType();
      V = this.FArgs[1].NodeType();
      for (var $l = 2, $end = rtl.length(this.FArgs) - 1; $l <= $end; $l++) {
        I = $l;
        N = this.FArgs[I];
        if ((I % 2) === 0) {
          if (!$mod.TFPConstExpression.isPrototypeOf(N)) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrCaseLabelNotAConst"),pas.System.VarRecs(0,rtl.trunc(I / 2),18,N.AsString()));
          if (N.NodeType() !== T) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrCaseLabelType"),pas.System.VarRecs(0,rtl.trunc(I / 2),18,N.AsString(),18,$mod.ResultTypeName(T),18,$mod.ResultTypeName(N.NodeType())));
        } else {
          if (N.NodeType() !== V) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrCaseValueType"),pas.System.VarRecs(0,rtl.trunc((I - 1) / 2),18,N.AsString(),18,$mod.ResultTypeName(V),18,$mod.ResultTypeName(N.NodeType())));
        };
      };
    };
    this.InitAggregate = function () {
      var I = 0;
      $mod.TFPExprNode.InitAggregate.call(this);
      if (this.FCondition != null) this.FCondition.InitAggregate();
      for (var $l = 0, $end = rtl.length(this.FArgs) - 1; $l <= $end; $l++) {
        I = $l;
        this.FArgs[I].InitAggregate();
      };
    };
    this.UpdateAggregate = function () {
      var I = 0;
      $mod.TFPExprNode.UpdateAggregate.call(this);
      if (this.FCondition != null) this.FCondition.UpdateAggregate();
      for (var $l = 0, $end = rtl.length(this.FArgs) - 1; $l <= $end; $l++) {
        I = $l;
        this.FArgs[I].InitAggregate();
      };
    };
    this.HasAggregate = function () {
      var Result = false;
      var I = 0;
      var L = 0;
      Result = $mod.TFPExprNode.HasAggregate.call(this);
      L = rtl.length(this.FArgs);
      I = 0;
      while (!Result && (I < L)) {
        Result = Result || this.FArgs[I].HasAggregate();
        I += 1;
      };
      return Result;
    };
    this.NodeType = function () {
      var Result = 0;
      Result = this.FArgs[1].NodeType();
      return Result;
    };
    this.Create$1 = function (Args) {
      this.FArgs = rtl.arrayRef(Args);
      return this;
    };
    this.Destroy = function () {
      var I = 0;
      for (var $l = 0, $end = rtl.length(this.FArgs) - 1; $l <= $end; $l++) {
        I = $l;
        pas.SysUtils.FreeAndNil({a: I, p: this.FArgs, get: function () {
            return this.p[this.a];
          }, set: function (v) {
            this.p[this.a] = v;
          }});
      };
      pas.System.TObject.Destroy.call(this);
    };
    this.AsString = function () {
      var Result = "";
      var I = 0;
      Result = "";
      for (var $l = 0, $end = rtl.length(this.FArgs) - 1; $l <= $end; $l++) {
        I = $l;
        if (Result !== "") Result = Result + ", ";
        Result = Result + this.FArgs[I].AsString();
      };
      Result = "Case(" + Result + ")";
      return Result;
    };
  });
  rtl.createClass(this,"TMathOperation",this.TFPBinaryOperation,function () {
    var AllowedTypes = rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtFloat,$mod.TResultType.rtCurrency,$mod.TResultType.rtDateTime,$mod.TResultType.rtString);
    this.Check = function () {
      $mod.TFPBinaryOperation.Check.call(this);
      this.CheckNodeType(this.FLeft,AllowedTypes);
      this.CheckNodeType(this.FRight,AllowedTypes);
      this.CheckSameNodeTypes();
    };
    this.NodeType = function () {
      var Result = 0;
      Result = this.FLeft.NodeType();
      return Result;
    };
  });
  rtl.createClass(this,"TFPAddOperation",this.TMathOperation,function () {
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        Result.resValue = rtl.trunc(Result.resValue) + rtl.trunc(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtString) {
        Result.resValue = "" + Result.resValue + ("" + RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtDateTime) {
        Result.resValue = rtl.getNumber(Result.resValue) + rtl.getNumber(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result.resValue = rtl.getNumber(Result.resValue) + rtl.getNumber(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtCurrency) Result.resValue = (rtl.trunc(Result.resValue * 10000) + rtl.trunc(RRes.resValue * 10000)) / 10000;
      Result.ResultType = this.NodeType();
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " + " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPSubtractOperation",this.TMathOperation,function () {
    var AllowedTypes$1 = rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtFloat,$mod.TResultType.rtCurrency,$mod.TResultType.rtDateTime);
    this.Check = function () {
      this.CheckNodeType(this.FLeft,AllowedTypes$1);
      this.CheckNodeType(this.FRight,AllowedTypes$1);
      $mod.TMathOperation.Check.call(this);
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        Result.resValue = rtl.trunc(Result.resValue) - rtl.trunc(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtDateTime) {
        Result.resValue = rtl.getNumber(Result.resValue) - rtl.getNumber(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result.resValue = rtl.getNumber(Result.resValue) - rtl.getNumber(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtCurrency) Result.resValue = (rtl.trunc(Result.resValue * 10000) - rtl.trunc(RRes.resValue * 10000)) / 10000;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " - " + this.FRight.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPMultiplyOperation",this.TMathOperation,function () {
    var AllowedTypes$1 = rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtCurrency,$mod.TResultType.rtFloat);
    this.Check = function () {
      this.CheckNodeType(this.FLeft,AllowedTypes$1);
      this.CheckNodeType(this.FRight,AllowedTypes$1);
      $mod.TMathOperation.Check.call(this);
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " * " + this.FRight.AsString();
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        Result.resValue = rtl.trunc(Result.resValue) * rtl.trunc(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result.resValue = rtl.getNumber(Result.resValue) * rtl.getNumber(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtCurrency) Result.resValue = ((rtl.trunc(Result.resValue * 10000) * rtl.trunc(RRes.resValue * 10000)) / 10000) / 10000;
      return Result;
    };
  });
  rtl.createClass(this,"TFPDivideOperation",this.TMathOperation,function () {
    var AllowedTypes$1 = rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtCurrency,$mod.TResultType.rtFloat);
    this.Check = function () {
      this.CheckNodeType(this.FLeft,AllowedTypes$1);
      this.CheckNodeType(this.FRight,AllowedTypes$1);
      $mod.TMathOperation.Check.call(this);
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " / " + this.FRight.AsString();
      return Result;
    };
    this.NodeType = function () {
      var Result = 0;
      if ((this.FLeft.NodeType() === $mod.TResultType.rtCurrency) && (this.FRight.NodeType() === $mod.TResultType.rtCurrency)) {
        Result = $mod.TResultType.rtCurrency}
       else Result = $mod.TResultType.rtFloat;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        Result.resValue = rtl.trunc(Result.resValue) / rtl.trunc(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result.resValue = rtl.getNumber(Result.resValue) / rtl.getNumber(RRes.resValue)}
       else if ($tmp === $mod.TResultType.rtCurrency) if (this.NodeType() === $mod.TResultType.rtCurrency) {
        Result.resValue = rtl.trunc((rtl.trunc(Result.resValue * 10000) / rtl.trunc(RRes.resValue * 10000)) * 10000) / 10000}
       else Result.resValue = rtl.getNumber(Result.resValue) / rtl.getNumber(RRes.resValue);
      Result.ResultType = this.NodeType();
      return Result;
    };
  });
  rtl.createClass(this,"TFPModuloOperation",this.TMathOperation,function () {
    this.Check = function () {
      this.CheckNodeType(this.FLeft,rtl.createSet($mod.TResultType.rtInteger));
      this.CheckNodeType(this.FRight,rtl.createSet($mod.TResultType.rtInteger));
      $mod.TMathOperation.Check.call(this);
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + " mod " + this.FRight.AsString();
      return Result;
    };
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtInteger;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      Result.resValue = rtl.trunc(Result.resValue) % rtl.trunc(RRes.resValue);
      Result.ResultType = $mod.TResultType.rtInteger;
      return Result;
    };
  });
  rtl.createClass(this,"TFPPowerOperation",this.TMathOperation,function () {
    var AllowedTypes$1 = rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtCurrency,$mod.TResultType.rtFloat);
    this.Check = function () {
      this.CheckNodeType(this.FLeft,AllowedTypes$1);
      this.CheckNodeType(this.FRight,AllowedTypes$1);
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FLeft.AsString() + "^" + this.FRight.AsString();
      return Result;
    };
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtFloat;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var RRes = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FLeft.GetNodeValue());
      RRes.$assign(this.FRight.GetNodeValue());
      Result.resValue = $impl.power($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Result)),$mod.ArgToFloat($mod.TFPExpressionResult.$clone(RRes)));
      Result.ResultType = $mod.TResultType.rtFloat;
      return Result;
    };
  });
  rtl.createClass(this,"TFPUnaryOperator",this.TFPExprNode,function () {
    this.$init = function () {
      $mod.TFPExprNode.$init.call(this);
      this.FOperand = null;
    };
    this.$final = function () {
      this.FOperand = undefined;
      $mod.TFPExprNode.$final.call(this);
    };
    this.Create$1 = function (AOperand) {
      this.FOperand = AOperand;
      return this;
    };
    this.Destroy = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FOperand;
        }, set: function (v) {
          this.p.FOperand = v;
        }});
      pas.System.TObject.Destroy.call(this);
    };
    this.InitAggregate = function () {
      $mod.TFPExprNode.InitAggregate.call(this);
      if (this.FOperand != null) this.FOperand.InitAggregate();
    };
    this.UpdateAggregate = function () {
      $mod.TFPExprNode.UpdateAggregate.call(this);
      if (this.FOperand != null) this.FOperand.UpdateAggregate();
    };
    this.HasAggregate = function () {
      var Result = false;
      Result = $mod.TFPExprNode.HasAggregate.call(this);
      if (this.FOperand != null) Result = Result || this.FOperand.HasAggregate();
      return Result;
    };
    this.Check = function () {
      if (!(this.FOperand != null)) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrNoOperand"),pas.System.VarRecs(18,this.$classname));
    };
  });
  rtl.createClass(this,"TFPConvertNode",this.TFPUnaryOperator,function () {
    this.AsString = function () {
      var Result = "";
      Result = this.FOperand.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TFPNotNode",this.TFPUnaryOperator,function () {
    this.Check = function () {
      if (!(this.FOperand.NodeType() in rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtBoolean))) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrNoNOTOperation"),pas.System.VarRecs(18,$mod.ResultTypeName(this.FOperand.NodeType()),18,this.FOperand.AsString()));
    };
    this.NodeType = function () {
      var Result = 0;
      Result = this.FOperand.NodeType();
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FOperand.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        Result.resValue = !Result.resValue}
       else if ($tmp === $mod.TResultType.rtBoolean) Result.resValue = !Result.resValue;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = "not " + this.FOperand.AsString();
      return Result;
    };
  });
  rtl.createClass(this,"TIntConvertNode",this.TFPConvertNode,function () {
    this.Check = function () {
      $mod.TFPUnaryOperator.Check.call(this);
      this.CheckNodeType(this.FOperand,rtl.createSet($mod.TResultType.rtInteger));
    };
  });
  rtl.createClass(this,"TIntToFloatNode",this.TIntConvertNode,function () {
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtFloat;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FOperand.GetNodeValue());
      Result.resValue = Result.resValue;
      Result.ResultType = $mod.TResultType.rtFloat;
      return Result;
    };
  });
  rtl.createClass(this,"TIntToCurrencyNode",this.TIntConvertNode,function () {
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtCurrency;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FOperand.GetNodeValue());
      Result.resValue = Result.resValue;
      Result.ResultType = $mod.TResultType.rtCurrency;
      return Result;
    };
  });
  rtl.createClass(this,"TIntToDateTimeNode",this.TIntConvertNode,function () {
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtDateTime;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FOperand.GetNodeValue());
      Result.ResultType = $mod.TResultType.rtDateTime;
      return Result;
    };
  });
  rtl.createClass(this,"TFloatToDateTimeNode",this.TFPConvertNode,function () {
    this.Check = function () {
      $mod.TFPUnaryOperator.Check.call(this);
      this.CheckNodeType(this.FOperand,rtl.createSet($mod.TResultType.rtFloat));
    };
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtDateTime;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FOperand.GetNodeValue());
      Result.ResultType = $mod.TResultType.rtDateTime;
      return Result;
    };
  });
  rtl.createClass(this,"TFloatToCurrencyNode",this.TFPConvertNode,function () {
    this.Check = function () {
      this.CheckNodeType(this.FOperand,rtl.createSet($mod.TResultType.rtFloat));
    };
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtCurrency;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FOperand.GetNodeValue());
      Result.ResultType = $mod.TResultType.rtCurrency;
      Result.resValue = Result.resValue;
      return Result;
    };
  });
  rtl.createClass(this,"TCurrencyToDateTimeNode",this.TFPConvertNode,function () {
    this.Check = function () {
      $mod.TFPUnaryOperator.Check.call(this);
      this.CheckNodeType(this.FOperand,rtl.createSet($mod.TResultType.rtCurrency));
    };
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtDateTime;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      var R = $mod.TFPExpressionResult.$new();
      R.$assign(this.FOperand.GetNodeValue());
      Result.resValue = rtl.trunc(R.resValue * 10000) / 10000;
      Result.ResultType = $mod.TResultType.rtDateTime;
      return Result;
    };
  });
  rtl.createClass(this,"TCurrencyToFloatNode",this.TFPConvertNode,function () {
    this.Check = function () {
      $mod.TFPUnaryOperator.Check.call(this);
      this.CheckNodeType(this.FOperand,rtl.createSet($mod.TResultType.rtCurrency));
    };
    this.NodeType = function () {
      var Result = 0;
      Result = $mod.TResultType.rtFloat;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FOperand.GetNodeValue());
      Result.resValue = rtl.trunc(Result.resValue * 10000) / 10000;
      Result.ResultType = $mod.TResultType.rtFloat;
      return Result;
    };
  });
  rtl.createClass(this,"TFPNegateOperation",this.TFPUnaryOperator,function () {
    this.Check = function () {
      $mod.TFPUnaryOperator.Check.call(this);
      if (!(this.FOperand.NodeType() in rtl.createSet($mod.TResultType.rtInteger,$mod.TResultType.rtFloat,$mod.TResultType.rtCurrency))) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrNoNegation"),pas.System.VarRecs(18,$mod.ResultTypeName(this.FOperand.NodeType()),18,this.FOperand.AsString()));
    };
    this.NodeType = function () {
      var Result = 0;
      Result = this.FOperand.NodeType();
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FOperand.GetNodeValue());
      var $tmp = Result.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        Result.resValue = -rtl.trunc(Result.resValue)}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result.resValue = -rtl.getNumber(Result.resValue)}
       else if ($tmp === $mod.TResultType.rtCurrency) Result.resValue = -rtl.trunc(Result.resValue * 10000) / 10000;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      Result = "-" + pas.SysUtils.TrimLeft(this.FOperand.AsString());
      return Result;
    };
  });
  rtl.createClass(this,"TFPConstExpression",this.TFPExprNode,function () {
    this.$init = function () {
      $mod.TFPExprNode.$init.call(this);
      this.FValue = $mod.TFPExpressionResult.$new();
    };
    this.$final = function () {
      this.FValue = undefined;
      $mod.TFPExprNode.$final.call(this);
    };
    this.CreateString = function (AValue) {
      this.FValue.ResultType = $mod.TResultType.rtString;
      this.FValue.resValue = AValue;
      return this;
    };
    this.CreateInteger = function (AValue) {
      this.FValue.ResultType = $mod.TResultType.rtInteger;
      this.FValue.resValue = AValue;
      return this;
    };
    this.CreateDateTime = function (AValue) {
      this.FValue.ResultType = $mod.TResultType.rtDateTime;
      this.FValue.resValue = AValue;
      return this;
    };
    this.CreateFloat = function (AValue) {
      pas.System.TObject.Create.call(this);
      this.FValue.ResultType = $mod.TResultType.rtFloat;
      this.FValue.resValue = AValue;
      return this;
    };
    this.CreateBoolean = function (AValue) {
      this.FValue.ResultType = $mod.TResultType.rtBoolean;
      this.FValue.resValue = AValue;
      return this;
    };
    this.CreateCurrency = function (AValue) {
      pas.System.TObject.Create.call(this);
      this.FValue.ResultType = $mod.TResultType.rtCurrency;
      this.FValue.resValue = AValue / 10000;
      return this;
    };
    this.Check = function () {
    };
    this.NodeType = function () {
      var Result = 0;
      Result = this.FValue.ResultType;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FValue);
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      var $tmp = this.NodeType();
      if ($tmp === $mod.TResultType.rtString) {
        Result = "'" + ("" + this.FValue.resValue) + "'"}
       else if ($tmp === $mod.TResultType.rtInteger) {
        Result = pas.SysUtils.IntToStr(rtl.trunc(this.FValue.resValue))}
       else if ($tmp === $mod.TResultType.rtDateTime) {
        Result = "'" + pas.SysUtils.FormatDateTime("cccc",rtl.getNumber(this.FValue.resValue)) + "'"}
       else if ($tmp === $mod.TResultType.rtBoolean) {
        if (!(this.FValue.resValue == false)) {
          Result = "True"}
         else Result = "False"}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result = rtl.floatToStr(rtl.getNumber(this.FValue.resValue))}
       else if ($tmp === $mod.TResultType.rtCurrency) Result = rtl.floatToStr(rtl.trunc(this.FValue.resValue * 10000) / 10000);
      return Result;
    };
  });
  this.TIdentifierType = {"0": "itVariable", itVariable: 0, "1": "itFunctionHandler", itFunctionHandler: 1, "2": "itFunctionNode", itFunctionNode: 2};
  this.$rtti.$Enum("TIdentifierType",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TIdentifierType});
  this.$rtti.$RefToProcVar("TFPExprFunctionEvent",{procsig: rtl.newTIProcSig([["Args",this.$rtti["TExprParameterArray"],2]],this.$rtti["TFPExpressionResult"])});
  this.$rtti.$RefToProcVar("TFPExprVariableEvent",{procsig: rtl.newTIProcSig([["AName",rtl.string,2]],this.$rtti["TFPExpressionResult"])});
  rtl.createClass(this,"TFPExprIdentifierDef",pas.Classes.TCollectionItem,function () {
    this.$init = function () {
      pas.Classes.TCollectionItem.$init.call(this);
      this.FNodeType = null;
      this.FOnGetVarValue = null;
      this.FStringValue = "";
      this.FValue = $mod.TFPExpressionResult.$new();
      this.FArgumentTypes = "";
      this.FIDType = 0;
      this.FName = "";
      this.FOnGetValue = null;
    };
    this.$final = function () {
      this.FNodeType = undefined;
      this.FOnGetVarValue = undefined;
      this.FValue = undefined;
      this.FOnGetValue = undefined;
      pas.Classes.TCollectionItem.$final.call(this);
    };
    this.GetAsBoolean = function () {
      var Result = false;
      this.CheckResultType($mod.TResultType.rtBoolean);
      this.CheckVariable();
      Result = !(this.FValue.resValue == false);
      return Result;
    };
    this.GetAsDateTime = function () {
      var Result = 0.0;
      this.CheckResultType($mod.TResultType.rtDateTime);
      this.CheckVariable();
      Result = rtl.getNumber(this.FValue.resValue);
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      this.CheckResultType($mod.TResultType.rtFloat);
      this.CheckVariable();
      Result = rtl.getNumber(this.FValue.resValue);
      return Result;
    };
    this.GetAsCurrency = function () {
      var Result = 0;
      this.CheckResultType($mod.TResultType.rtCurrency);
      this.CheckVariable();
      Result = rtl.trunc(this.FValue.resValue * 10000);
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      this.CheckResultType($mod.TResultType.rtInteger);
      this.CheckVariable();
      Result = rtl.trunc(this.FValue.resValue);
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      this.CheckResultType($mod.TResultType.rtString);
      this.CheckVariable();
      Result = "" + this.FValue.resValue;
      return Result;
    };
    this.GetResultType = function () {
      var Result = 0;
      Result = this.FValue.ResultType;
      return Result;
    };
    this.GetValue = function () {
      var Result = "";
      var $tmp = this.FValue.ResultType;
      if ($tmp === $mod.TResultType.rtBoolean) {
        if (this.FValue.resValue) {
          Result = "True"}
         else Result = "False"}
       else if ($tmp === $mod.TResultType.rtInteger) {
        Result = pas.SysUtils.IntToStr(rtl.trunc(this.FValue.resValue))}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result = pas.SysUtils.FloatToStr(rtl.getNumber(this.FValue.resValue))}
       else if ($tmp === $mod.TResultType.rtCurrency) {
        Result = pas.SysUtils.CurrToStr(rtl.trunc(this.FValue.resValue * 10000))}
       else if ($tmp === $mod.TResultType.rtDateTime) {
        Result = pas.SysUtils.FormatDateTime("cccc",rtl.getNumber(this.FValue.resValue))}
       else if ($tmp === $mod.TResultType.rtString) Result = "" + this.FValue.resValue;
      return Result;
    };
    this.SetArgumentTypes = function (AValue) {
      var I = 0;
      if (this.FArgumentTypes === AValue) return;
      for (var $l = 1, $end = AValue.length; $l <= $end; $l++) {
        I = $l;
        $mod.CharToResultType(AValue.charAt(I - 1));
      };
      this.FArgumentTypes = AValue;
    };
    this.SetAsBoolean = function (AValue) {
      this.CheckVariable();
      this.CheckResultType($mod.TResultType.rtBoolean);
      this.FValue.resValue = AValue;
    };
    this.SetAsDateTime = function (AValue) {
      this.CheckVariable();
      this.CheckResultType($mod.TResultType.rtDateTime);
      this.FValue.resValue = AValue;
    };
    this.SetAsFloat = function (AValue) {
      this.CheckVariable();
      this.CheckResultType($mod.TResultType.rtFloat);
      this.FValue.resValue = AValue;
    };
    this.SetAsCurrency = function (AValue) {
      this.CheckVariable();
      this.CheckResultType($mod.TResultType.rtCurrency);
      this.FValue.resValue = AValue / 10000;
    };
    this.SetAsInteger = function (AValue) {
      this.CheckVariable();
      this.CheckResultType($mod.TResultType.rtInteger);
      this.FValue.resValue = AValue;
    };
    this.SetAsString = function (AValue) {
      this.CheckVariable();
      this.CheckResultType($mod.TResultType.rtString);
      this.FValue.resValue = AValue;
    };
    this.SetName = function (AValue) {
      if (this.FName === AValue) return;
      if (AValue !== "") if ((this.FCollection != null) && (this.FCollection.IndexOfIdentifier(AValue) !== -1)) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrDuplicateIdentifier"),pas.System.VarRecs(18,AValue));
      this.FName = AValue;
    };
    this.SetResultType = function (AValue) {
      if (AValue !== this.FValue.ResultType) {
        this.FValue.ResultType = AValue;
        this.SetValue(this.FStringValue);
      };
    };
    this.SetValue = function (AValue) {
      this.FStringValue = AValue;
      if (AValue !== "") {
        var $tmp = this.FValue.ResultType;
        if ($tmp === $mod.TResultType.rtBoolean) {
          this.FValue.resValue = this.FStringValue === "True"}
         else if ($tmp === $mod.TResultType.rtInteger) {
          this.FValue.resValue = pas.SysUtils.StrToInt(AValue)}
         else if ($tmp === $mod.TResultType.rtFloat) {
          this.FValue.resValue = pas.SysUtils.StrToFloat(AValue)}
         else if ($tmp === $mod.TResultType.rtCurrency) {
          this.FValue.resValue = pas.SysUtils.StrToCurr(AValue) / 10000}
         else if ($tmp === $mod.TResultType.rtDateTime) {
          this.FValue.resValue = pas.SysUtils.StrToDateTime(AValue)}
         else if ($tmp === $mod.TResultType.rtString) this.FValue.resValue = AValue;
      } else {
        var $tmp1 = this.FValue.ResultType;
        if ($tmp1 === $mod.TResultType.rtBoolean) {
          this.FValue.resValue = false}
         else if ($tmp1 === $mod.TResultType.rtInteger) {
          this.FValue.resValue = 0}
         else if ($tmp1 === $mod.TResultType.rtFloat) {
          this.FValue.resValue = 0.0}
         else if ($tmp1 === $mod.TResultType.rtCurrency) {
          this.FValue.resValue = 0.0}
         else if ($tmp1 === $mod.TResultType.rtDateTime) {
          this.FValue.resValue = 0}
         else if ($tmp1 === $mod.TResultType.rtString) this.FValue.resValue = "";
      };
    };
    this.CheckResultType = function (AType) {
      if (this.FValue.ResultType !== AType) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrInvalidResultType"),pas.System.VarRecs(18,$mod.ResultTypeName(AType)));
    };
    this.CheckVariable = function () {
      if (this.FIDType !== $mod.TIdentifierType.itVariable) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrNotVariable"),pas.System.VarRecs(18,this.FName));
      if (this.EventBasedVariable()) this.FetchValue();
    };
    this.FetchValue = function () {
      var RT = 0;
      var RT2 = 0;
      var I = 0;
      RT = this.GetResultType();
      if (this.FOnGetVarValue != null) this.FValue.$assign(this.FOnGetVarValue(this.FName));
      RT2 = this.FValue.ResultType;
      if (RT2 !== RT) {
        if ((RT2 === $mod.TResultType.rtInteger) && (RT === $mod.TResultType.rtFloat)) {
          this.FValue.ResultType = RT;
          I = rtl.trunc(this.FValue.resValue);
          this.FValue.resValue = I;
        } else {
          this.FValue.ResultType = RT;
          throw $mod.EExprParser.$create("CreateFmt",['Value handler for variable %s returned wrong type, expected "%s", got "%s"',pas.System.VarRecs(18,this.FName,18,pas.TypInfo.GetEnumName($mod.$rtti["TResultType"],RT),18,pas.TypInfo.GetEnumName($mod.$rtti["TResultType"],RT2))]);
        };
      };
    };
    this.ArgumentCount = function () {
      var Result = 0;
      Result = this.FArgumentTypes.length;
      return Result;
    };
    this.Assign = function (Source) {
      var EID = null;
      if ($mod.TFPExprIdentifierDef.isPrototypeOf(Source)) {
        EID = rtl.as(Source,$mod.TFPExprIdentifierDef);
        this.FStringValue = EID.FStringValue;
        this.FValue.$assign(EID.FValue);
        this.FArgumentTypes = EID.FArgumentTypes;
        this.FIDType = EID.FIDType;
        this.FName = EID.FName;
        this.FOnGetValue = EID.FOnGetValue;
        this.FOnGetVarValue = EID.FOnGetVarValue;
      } else pas.Classes.TPersistent.Assign.call(this,Source);
    };
    this.EventBasedVariable = function () {
      var Result = false;
      Result = this.FOnGetVarValue != null;
      return Result;
    };
    var $r = this.$rtti;
    $r.addProperty("IdentifierType",0,$mod.$rtti["TIdentifierType"],"FIDType","FIDType");
    $r.addProperty("Name",2,rtl.string,"FName","SetName");
    $r.addProperty("Value",3,rtl.string,"GetValue","SetValue");
    $r.addProperty("ParameterTypes",2,rtl.string,"FArgumentTypes","SetArgumentTypes");
    $r.addProperty("ResultType",3,$mod.$rtti["TResultType"],"GetResultType","SetResultType");
    $r.addProperty("OnGetFunctionValue",0,$mod.$rtti["TFPExprFunctionEvent"],"FOnGetValue","FOnGetValue");
    $r.addProperty("OnGetVariableValue",0,$mod.$rtti["TFPExprVariableEvent"],"FOnGetVarValue","FOnGetVarValue");
    $r.addProperty("NodeType",0,$mod.$rtti["TFPExprFunctionClass"],"FNodeType","FNodeType");
  });
  this.TBuiltInCategory = {"0": "bcStrings", bcStrings: 0, "1": "bcDateTime", bcDateTime: 1, "2": "bcMath", bcMath: 2, "3": "bcBoolean", bcBoolean: 3, "4": "bcConversion", bcConversion: 4, "5": "bcData", bcData: 5, "6": "bcVaria", bcVaria: 6, "7": "bcUser", bcUser: 7, "8": "bcAggregate", bcAggregate: 8};
  this.$rtti.$Enum("TBuiltInCategory",{minvalue: 0, maxvalue: 8, ordtype: 1, enumtype: this.TBuiltInCategory});
  this.$rtti.$Set("TBuiltInCategories",{comptype: this.$rtti["TBuiltInCategory"]});
  rtl.createClass(this,"TFPBuiltInExprIdentifierDef",this.TFPExprIdentifierDef,function () {
    this.$init = function () {
      $mod.TFPExprIdentifierDef.$init.call(this);
      this.FCategory = 0;
    };
    this.Assign = function (Source) {
      $mod.TFPExprIdentifierDef.Assign.call(this,Source);
      if ($mod.TFPBuiltInExprIdentifierDef.isPrototypeOf(Source)) this.FCategory = rtl.as(Source,$mod.TFPBuiltInExprIdentifierDef).FCategory;
    };
    var $r = this.$rtti;
    $r.addProperty("Category",0,$mod.$rtti["TBuiltInCategory"],"FCategory","FCategory");
  });
  rtl.createClass(this,"TFPExprIdentifierDefs",pas.Classes.TCollection,function () {
    this.$init = function () {
      pas.Classes.TCollection.$init.call(this);
      this.FParser = null;
    };
    this.$final = function () {
      this.FParser = undefined;
      pas.Classes.TCollection.$final.call(this);
    };
    this.GetI = function (AIndex) {
      var Result = null;
      Result = this.GetItem(AIndex);
      return Result;
    };
    this.SetI = function (AIndex, AValue) {
      this.SetItem(AIndex,AValue);
    };
    this.Update = function (Item) {
      pas.Classes.TCollection.Update.call(this,Item);
      if (this.FParser != null) this.FParser.FDirty = true;
    };
    this.IndexOfIdentifier = function (AName) {
      var Result = 0;
      Result = this.GetCount() - 1;
      while ((Result >= 0) && (pas.SysUtils.CompareText(this.GetI(Result).FName,AName) !== 0)) Result -= 1;
      return Result;
    };
    this.FindIdentifier = function (AName) {
      var Result = null;
      var I = 0;
      I = this.IndexOfIdentifier(AName);
      if (I === -1) {
        Result = null}
       else Result = this.GetI(I);
      return Result;
    };
    this.IdentifierByName = function (AName) {
      var Result = null;
      Result = this.FindIdentifier(AName);
      if (Result === null) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrUnknownIdentifier"),pas.System.VarRecs(18,AName));
      return Result;
    };
    this.AddVariable = function (AName, AResultType, ACallback) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.FIDType = $mod.TIdentifierType.itVariable;
      Result.SetName(AName);
      Result.SetResultType(AResultType);
      Result.FOnGetVarValue = ACallback;
      return Result;
    };
    this.AddVariable$1 = function (AName, AResultType, AValue) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.FIDType = $mod.TIdentifierType.itVariable;
      Result.SetName(AName);
      Result.SetResultType(AResultType);
      Result.SetValue(AValue);
      return Result;
    };
    this.AddBooleanVariable = function (AName, AValue) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.FIDType = $mod.TIdentifierType.itVariable;
      Result.SetName(AName);
      Result.SetResultType($mod.TResultType.rtBoolean);
      Result.FValue.resValue = AValue;
      return Result;
    };
    this.AddIntegerVariable = function (AName, AValue) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.FIDType = $mod.TIdentifierType.itVariable;
      Result.SetName(AName);
      Result.SetResultType($mod.TResultType.rtInteger);
      Result.FValue.resValue = AValue;
      return Result;
    };
    this.AddFloatVariable = function (AName, AValue) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.FIDType = $mod.TIdentifierType.itVariable;
      Result.SetName(AName);
      Result.SetResultType($mod.TResultType.rtFloat);
      Result.FValue.resValue = AValue;
      return Result;
    };
    this.AddCurrencyVariable = function (AName, AValue) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.FIDType = $mod.TIdentifierType.itVariable;
      Result.SetName(AName);
      Result.SetResultType($mod.TResultType.rtCurrency);
      Result.FValue.resValue = AValue / 10000;
      return Result;
    };
    this.AddStringVariable = function (AName, AValue) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.FIDType = $mod.TIdentifierType.itVariable;
      Result.SetName(AName);
      Result.SetResultType($mod.TResultType.rtString);
      Result.FValue.resValue = AValue;
      return Result;
    };
    this.AddDateTimeVariable = function (AName, AValue) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.FIDType = $mod.TIdentifierType.itVariable;
      Result.SetName(AName);
      Result.SetResultType($mod.TResultType.rtDateTime);
      Result.FValue.resValue = AValue;
      return Result;
    };
    this.AddFunction = function (AName, AResultType, AParamTypes, ACallBack) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.SetName(AName);
      Result.FIDType = $mod.TIdentifierType.itFunctionHandler;
      Result.SetArgumentTypes(AParamTypes);
      Result.SetResultType($mod.CharToResultType(AResultType));
      Result.FOnGetValue = ACallBack;
      return Result;
    };
    this.AddFunction$1 = function (AName, AResultType, AParamTypes, ANodeClass) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TFPExprIdentifierDef);
      Result.SetName(AName);
      Result.FIDType = $mod.TIdentifierType.itFunctionNode;
      Result.SetArgumentTypes(AParamTypes);
      Result.SetResultType($mod.CharToResultType(AResultType));
      Result.FNodeType = ANodeClass;
      return Result;
    };
  });
  rtl.createClass(this,"TFPExprIdentifierNode",this.TFPExprNode,function () {
    this.$init = function () {
      $mod.TFPExprNode.$init.call(this);
      this.FID = null;
      this.PResult = null;
      this.FResultType = 0;
    };
    this.$final = function () {
      this.FID = undefined;
      $mod.TFPExprNode.$final.call(this);
    };
    this.CreateIdentifier = function (AID) {
      pas.System.TObject.Create.call(this);
      this.FID = AID;
      this.PResult = this.FID.FValue;
      this.FResultType = this.FID.GetResultType();
      return this;
    };
    this.NodeType = function () {
      var Result = 0;
      Result = this.FResultType;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      if (this.FID.EventBasedVariable()) {
        this.FID.FetchValue();
        this.PResult = this.FID.FValue;
      };
      Result.$assign(this.PResult);
      Result.ResultType = this.FResultType;
      return Result;
    };
  });
  rtl.createClass(this,"TFPExprVariable",this.TFPExprIdentifierNode,function () {
    this.Check = function () {
    };
    this.AsString = function () {
      var Result = "";
      Result = this.FID.FName;
      return Result;
    };
  });
  rtl.createClass(this,"TFPExprFunction",this.TFPExprIdentifierNode,function () {
    this.$init = function () {
      $mod.TFPExprIdentifierNode.$init.call(this);
      this.FArgumentNodes = [];
      this.FargumentParams = [];
    };
    this.$final = function () {
      this.FArgumentNodes = undefined;
      this.FargumentParams = undefined;
      $mod.TFPExprIdentifierNode.$final.call(this);
    };
    this.CalcParams = function () {
      var I = 0;
      for (var $l = 0, $end = rtl.length(this.FargumentParams) - 1; $l <= $end; $l++) {
        I = $l;
        this.FargumentParams[I].$assign(this.FArgumentNodes[I].GetNodeValue());
      };
    };
    this.ConvertArgument = function (aIndex, aNode, aType) {
      var Result = null;
      var N = null;
      N = $mod.TFPExpressionParser.ConvertNode(aNode,aType);
      if (aNode === N) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrInvalidArgumentType"),pas.System.VarRecs(0,aIndex,18,$mod.ResultTypeName(aType),18,$mod.ResultTypeName(aNode.NodeType())));
      Result = N;
      return Result;
    };
    this.Check = function () {
      var I = 0;
      var rtp = 0;
      var rta = 0;
      if (rtl.length(this.FArgumentNodes) !== this.FID.ArgumentCount()) $impl.RaiseParserError$1(rtl.getResStr($mod,"ErrInvalidArgumentCount"),pas.System.VarRecs(18,this.FID.FName));
      for (var $l = 0, $end = rtl.length(this.FArgumentNodes) - 1; $l <= $end; $l++) {
        I = $l;
        rtp = $mod.CharToResultType(this.FID.FArgumentTypes.charAt((I + 1) - 1));
        rta = this.FArgumentNodes[I].NodeType();
        if (rtp !== rta) this.FArgumentNodes[I] = this.ConvertArgument(I + 1,this.FArgumentNodes[I],rtp);
      };
    };
    this.CreateFunction = function (AID, Args) {
      $mod.TFPExprIdentifierNode.CreateIdentifier.call(this,AID);
      this.FArgumentNodes = rtl.arrayRef(Args);
      this.FargumentParams = rtl.arraySetLength(this.FargumentParams,$mod.TFPExpressionResult,rtl.length(Args));
      return this;
    };
    this.Destroy = function () {
      var I = 0;
      for (var $l = 0, $end = rtl.length(this.FArgumentNodes) - 1; $l <= $end; $l++) {
        I = $l;
        pas.SysUtils.FreeAndNil({a: I, p: this.FArgumentNodes, get: function () {
            return this.p[this.a];
          }, set: function (v) {
            this.p[this.a] = v;
          }});
      };
      pas.System.TObject.Destroy.call(this);
    };
    this.InitAggregate = function () {
      var I = 0;
      for (var $l = 0, $end = rtl.length(this.FArgumentNodes) - 1; $l <= $end; $l++) {
        I = $l;
        this.FArgumentNodes[I].InitAggregate();
      };
    };
    this.UpdateAggregate = function () {
      var I = 0;
      for (var $l = 0, $end = rtl.length(this.FArgumentNodes) - 1; $l <= $end; $l++) {
        I = $l;
        this.FArgumentNodes[I].UpdateAggregate();
      };
    };
    this.HasAggregate = function () {
      var Result = false;
      var I = 0;
      Result = true;
      if (this.$class.IsAggregate()) return Result;
      for (var $l = 0, $end = rtl.length(this.FArgumentNodes) - 1; $l <= $end; $l++) {
        I = $l;
        if (this.FArgumentNodes[I].HasAggregate()) return Result;
      };
      Result = false;
      return Result;
    };
    this.AsString = function () {
      var Result = "";
      var S = "";
      var I = 0;
      S = "";
      for (var $l = 0, $end = rtl.length(this.FArgumentNodes) - 1; $l <= $end; $l++) {
        I = $l;
        if (S !== "") S = S + ",";
        S = S + this.FArgumentNodes[I].AsString();
      };
      if (S !== "") S = "(" + S + ")";
      Result = this.FID.FName + S;
      return Result;
    };
  });
  rtl.createClass(this,"TAggregateExpr",this.TFPExprFunction,function () {
    this.$init = function () {
      $mod.TFPExprFunction.$init.call(this);
      this.FResult = $mod.TFPExpressionResult.$new();
    };
    this.$final = function () {
      this.FResult = undefined;
      $mod.TFPExprFunction.$final.call(this);
    };
    this.IsAggregate = function () {
      var Result = false;
      Result = true;
      return Result;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign(this.FResult);
      return Result;
    };
  });
  rtl.createClass(this,"TAggregateMin",this.TAggregateExpr,function () {
    this.$init = function () {
      $mod.TAggregateExpr.$init.call(this);
      this.FFirst = false;
    };
    this.InitAggregate = function () {
      $mod.TFPExprFunction.InitAggregate.call(this);
      this.FFirst = true;
      this.FResult.ResultType = this.FArgumentNodes[0].NodeType();
      var $tmp = this.FResult.ResultType;
      if ($tmp === $mod.TResultType.rtFloat) {
        this.FResult.resValue = 0.0}
       else if ($tmp === $mod.TResultType.rtCurrency) {
        this.FResult.resValue = 0.0}
       else if ($tmp === $mod.TResultType.rtInteger) this.FResult.resValue = 0;
    };
    this.UpdateAggregate = function () {
      var OK = false;
      var N = $mod.TFPExpressionResult.$new();
      N.$assign(this.FArgumentNodes[0].GetNodeValue());
      if (this.FFirst) {
        this.FFirst = false;
        OK = true;
      } else {
        var $tmp = N.ResultType;
        if ($tmp === $mod.TResultType.rtFloat) {
          OK = rtl.getNumber(N.resValue) < rtl.getNumber(this.FResult.resValue)}
         else if ($tmp === $mod.TResultType.rtCurrency) {
          OK = rtl.trunc(N.resValue * 10000) < rtl.trunc(this.FResult.resValue * 10000)}
         else if ($tmp === $mod.TResultType.rtInteger) OK = rtl.trunc(N.resValue) < rtl.trunc(this.FResult.resValue);
      };
      if (OK) {
        var $tmp1 = this.FResult.ResultType;
        if ($tmp1 === $mod.TResultType.rtFloat) {
          this.FResult.resValue = N.resValue}
         else if ($tmp1 === $mod.TResultType.rtCurrency) {
          this.FResult.resValue = N.resValue}
         else if ($tmp1 === $mod.TResultType.rtInteger) this.FResult.resValue = N.resValue;
      };
      $mod.TFPExprFunction.UpdateAggregate.call(this);
    };
  });
  rtl.createClass(this,"TAggregateMax",this.TAggregateExpr,function () {
    this.$init = function () {
      $mod.TAggregateExpr.$init.call(this);
      this.FFirst = false;
    };
    this.InitAggregate = function () {
      $mod.TFPExprFunction.InitAggregate.call(this);
      this.FFirst = true;
      this.FResult.ResultType = this.FArgumentNodes[0].NodeType();
      var $tmp = this.FResult.ResultType;
      if ($tmp === $mod.TResultType.rtFloat) {
        this.FResult.resValue = 0.0}
       else if ($tmp === $mod.TResultType.rtCurrency) {
        this.FResult.resValue = 0.0}
       else if ($tmp === $mod.TResultType.rtInteger) this.FResult.resValue = 0;
    };
    this.UpdateAggregate = function () {
      var OK = false;
      var N = $mod.TFPExpressionResult.$new();
      N.$assign(this.FArgumentNodes[0].GetNodeValue());
      if (this.FFirst) {
        this.FResult.ResultType = N.ResultType;
        this.FFirst = false;
        OK = true;
      } else {
        var $tmp = N.ResultType;
        if ($tmp === $mod.TResultType.rtFloat) {
          OK = rtl.getNumber(N.resValue) > rtl.getNumber(this.FResult.resValue)}
         else if ($tmp === $mod.TResultType.rtCurrency) {
          OK = rtl.trunc(N.resValue * 10000) > rtl.trunc(this.FResult.resValue * 10000)}
         else if ($tmp === $mod.TResultType.rtInteger) OK = rtl.trunc(N.resValue) > rtl.trunc(this.FResult.resValue);
      };
      if (OK) {
        var $tmp1 = N.ResultType;
        if ($tmp1 === $mod.TResultType.rtFloat) {
          this.FResult.resValue = N.resValue}
         else if ($tmp1 === $mod.TResultType.rtInteger) {
          this.FResult.resValue = N.resValue}
         else if ($tmp1 === $mod.TResultType.rtCurrency) this.FResult.resValue = N.resValue;
      };
    };
  });
  rtl.createClass(this,"TAggregateSum",this.TAggregateExpr,function () {
    this.ConvertArgument = function (aIndex, aNode, aType) {
      var Result = null;
      if (!(aNode.NodeType() in rtl.createSet($mod.TResultType.rtFloat,$mod.TResultType.rtInteger,$mod.TResultType.rtCurrency))) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrInvalidArgumentType"),pas.System.VarRecs(0,aIndex,18,$mod.ResultTypeName(aType),18,$mod.ResultTypeName(aNode.NodeType())));
      Result = aNode;
      return Result;
    };
    this.InitAggregate = function () {
      this.FResult.ResultType = this.FArgumentNodes[0].NodeType();
      var $tmp = this.FResult.ResultType;
      if ($tmp === $mod.TResultType.rtFloat) {
        this.FResult.resValue = 0.0}
       else if ($tmp === $mod.TResultType.rtCurrency) {
        this.FResult.resValue = 0.0}
       else if ($tmp === $mod.TResultType.rtInteger) this.FResult.resValue = 0;
    };
    this.UpdateAggregate = function () {
      var R = $mod.TFPExpressionResult.$new();
      R.$assign(this.FArgumentNodes[0].GetNodeValue());
      var $tmp = this.FResult.ResultType;
      if ($tmp === $mod.TResultType.rtFloat) {
        this.FResult.resValue = rtl.getNumber(this.FResult.resValue) + rtl.getNumber(R.resValue)}
       else if ($tmp === $mod.TResultType.rtCurrency) {
        this.FResult.resValue = (rtl.trunc(this.FResult.resValue * 10000) + rtl.trunc(R.resValue * 10000)) / 10000}
       else if ($tmp === $mod.TResultType.rtInteger) this.FResult.resValue = rtl.trunc(this.FResult.resValue) + rtl.trunc(R.resValue);
    };
  });
  rtl.createClass(this,"TAggregateAvg",this.TAggregateSum,function () {
    this.$init = function () {
      $mod.TAggregateSum.$init.call(this);
      this.FCount = 0;
    };
    this.InitAggregate = function () {
      $mod.TAggregateSum.InitAggregate.call(this);
    };
    this.UpdateAggregate = function () {
      $mod.TAggregateSum.UpdateAggregate.call(this);
      this.FCount += 1;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      Result.$assign($mod.TAggregateExpr.GetNodeValue.call(this));
      Result.ResultType = this.FResult.ResultType;
      if (this.FCount === 0) {
        var $tmp = this.FResult.ResultType;
        if ($tmp === $mod.TResultType.rtInteger) {
          Result.ResultType = $mod.TResultType.rtFloat;
          Result.resValue = 0.0;
        } else if ($tmp === $mod.TResultType.rtFloat) {
          Result.resValue = 0.0}
         else if ($tmp === $mod.TResultType.rtCurrency) Result.resValue = 0.0;
      } else {
        var $tmp1 = this.FResult.ResultType;
        if ($tmp1 === $mod.TResultType.rtInteger) {
          Result.ResultType = $mod.TResultType.rtFloat;
          Result.resValue = rtl.trunc(this.FResult.resValue) / this.FCount;
        } else if ($tmp1 === $mod.TResultType.rtFloat) {
          Result.resValue = rtl.getNumber(this.FResult.resValue) / this.FCount}
         else if ($tmp1 === $mod.TResultType.rtCurrency) Result.resValue = rtl.trunc(rtl.trunc(this.FResult.resValue * 10000) / this.FCount) / 10000;
      };
      return Result;
    };
  });
  rtl.createClass(this,"TAggregateCount",this.TAggregateExpr,function () {
    this.InitAggregate = function () {
      this.FResult.ResultType = $mod.TResultType.rtInteger;
      this.FResult.resValue = 0;
    };
    this.UpdateAggregate = function () {
      this.FResult.resValue = rtl.trunc(this.FResult.resValue) + 1;
    };
  });
  rtl.createClass(this,"TFPFunctionEventHandler",this.TFPExprFunction,function () {
    this.$init = function () {
      $mod.TFPExprFunction.$init.call(this);
      this.FCallBack = null;
    };
    this.$final = function () {
      this.FCallBack = undefined;
      $mod.TFPExprFunction.$final.call(this);
    };
    this.CreateFunction = function (AID, Args) {
      $mod.TFPExprFunction.CreateFunction.apply(this,arguments);
      this.FCallBack = AID.FOnGetValue;
      return this;
    };
    this.GetNodeValue = function () {
      var Result = $mod.TFPExpressionResult.$new();
      if (rtl.length(this.FargumentParams) > 0) this.CalcParams();
      Result.$assign(this.FCallBack(this.FargumentParams));
      Result.ResultType = this.NodeType();
      return Result;
    };
  });
  rtl.createClass(this,"TFPExpressionParser",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FBuiltIns = {};
      this.FExpression = "";
      this.FScanner = null;
      this.FExprNode = null;
      this.FIdentifiers = null;
      this.FHashList = null;
      this.FDirty = false;
    };
    this.$final = function () {
      this.FBuiltIns = undefined;
      this.FScanner = undefined;
      this.FExprNode = undefined;
      this.FIdentifiers = undefined;
      this.FHashList = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.CheckEOF = function () {
      if (this.TokenType() === $mod.TTokenType.ttEOF) this.ParserError(rtl.getResStr($mod,"SErrUnexpectedEndOfExpression"));
    };
    this.GetAsBoolean = function () {
      var Result = false;
      var Res = $mod.TFPExpressionResult.$new();
      this.EvaluateExpression(Res);
      this.CheckResultType(Res,$mod.TResultType.rtBoolean);
      Result = !(Res.resValue == false);
      return Result;
    };
    this.GetAsDateTime = function () {
      var Result = 0.0;
      var Res = $mod.TFPExpressionResult.$new();
      this.EvaluateExpression(Res);
      this.CheckResultType(Res,$mod.TResultType.rtDateTime);
      Result = rtl.getNumber(Res.resValue);
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      var Res = $mod.TFPExpressionResult.$new();
      this.EvaluateExpression(Res);
      this.CheckResultTypes(Res,rtl.createSet($mod.TResultType.rtFloat,$mod.TResultType.rtCurrency,$mod.TResultType.rtInteger));
      var $tmp = Res.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        Result = rtl.trunc(Res.resValue)}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result = rtl.getNumber(Res.resValue)}
       else if ($tmp === $mod.TResultType.rtCurrency) Result = rtl.trunc(Res.resValue * 10000) / 10000;
      return Result;
    };
    this.GetAsCurrency = function () {
      var Result = 0;
      var Res = $mod.TFPExpressionResult.$new();
      this.EvaluateExpression(Res);
      this.CheckResultTypes(Res,rtl.createSet($mod.TResultType.rtFloat,$mod.TResultType.rtCurrency,$mod.TResultType.rtInteger));
      var $tmp = Res.ResultType;
      if ($tmp === $mod.TResultType.rtInteger) {
        Result = rtl.trunc(Res.resValue) * 10000}
       else if ($tmp === $mod.TResultType.rtFloat) {
        Result = rtl.trunc(rtl.getNumber(Res.resValue) * 10000)}
       else if ($tmp === $mod.TResultType.rtCurrency) Result = rtl.trunc(Res.resValue * 10000);
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      var Res = $mod.TFPExpressionResult.$new();
      this.EvaluateExpression(Res);
      this.CheckResultType(Res,$mod.TResultType.rtInteger);
      Result = rtl.trunc(Res.resValue);
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      var Res = $mod.TFPExpressionResult.$new();
      this.EvaluateExpression(Res);
      this.CheckResultType(Res,$mod.TResultType.rtString);
      Result = "" + Res.resValue;
      return Result;
    };
    this.GetAllowLike = function () {
      var Result = false;
      Result = this.FScanner.FAllowLike;
      return Result;
    };
    this.MatchNodes = function (Todo, Match) {
      var Result = null;
      var FromType = 0;
      var ToType = 0;
      Result = Todo;
      FromType = Todo.NodeType();
      ToType = Match.NodeType();
      if (FromType !== ToType) {
        var $tmp = FromType;
        if ($tmp === $mod.TResultType.rtInteger) {
          if (ToType in rtl.createSet($mod.TResultType.rtFloat,$mod.TResultType.rtCurrency,$mod.TResultType.rtDateTime)) Result = this.$class.ConvertNode(Todo,ToType)}
         else if ($tmp === $mod.TResultType.rtFloat) {
          if (ToType in rtl.createSet($mod.TResultType.rtCurrency,$mod.TResultType.rtDateTime)) Result = this.$class.ConvertNode(Todo,ToType)}
         else if ($tmp === $mod.TResultType.rtCurrency) if (ToType in rtl.createSet($mod.TResultType.rtFloat,$mod.TResultType.rtDateTime)) Result = this.$class.ConvertNode(Todo,ToType);
      };
      return Result;
    };
    this.CheckNodes = function (Left, Right) {
      Left.set(this.MatchNodes(Left.get(),Right.get()));
      Right.set(this.MatchNodes(Right.get(),Left.get()));
    };
    this.SetBuiltIns = function (AValue) {
      if (rtl.eqSet(this.FBuiltIns,AValue)) return;
      this.FBuiltIns = rtl.refSet(AValue);
      this.FDirty = true;
    };
    this.SetIdentifiers = function (AValue) {
      this.FIdentifiers.Assign(AValue);
    };
    this.SetAllowLike = function (AValue) {
      this.FScanner.FAllowLike = AValue;
    };
    this.ParserError = function (Msg) {
      throw $mod.EExprParser.$create("Create$1",[Msg]);
    };
    this.SetExpression = function (AValue) {
      if (this.FExpression === AValue) return;
      this.FExpression = AValue;
      this.FScanner.SetSource(AValue);
      if (this.FExprNode != null) pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FExprNode;
        }, set: function (v) {
          this.p.FExprNode = v;
        }});
      if (this.FExpression !== "") {
        this.GetToken();
        this.FExprNode = this.Level1();
        if (this.TokenType() !== $mod.TTokenType.ttEOF) this.ParserError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrUnterminatedExpression"),pas.System.VarRecs(0,this.FScanner.FPos,18,this.CurrentToken())));
        this.FExprNode.Check();
      } else this.FExprNode = null;
    };
    this.CheckResultType = function (Res, AType) {
      if (Res.ResultType !== AType) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrInvalidResultType"),pas.System.VarRecs(18,$mod.ResultTypeName(Res.ResultType)));
    };
    this.CheckResultTypes = function (Res, ATypes) {
      if (!(Res.ResultType in ATypes)) $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrInvalidResultType"),pas.System.VarRecs(18,$mod.ResultTypeName(Res.ResultType)));
    };
    this.ConvertNode = function (Todo, ToType) {
      var Result = null;
      Result = Todo;
      var $tmp = Todo.NodeType();
      if ($tmp === $mod.TResultType.rtInteger) {
        var $tmp1 = ToType;
        if ($tmp1 === $mod.TResultType.rtFloat) {
          Result = $mod.TIntToFloatNode.$create("Create$1",[Result])}
         else if ($tmp1 === $mod.TResultType.rtCurrency) {
          Result = $mod.TIntToCurrencyNode.$create("Create$1",[Result])}
         else if ($tmp1 === $mod.TResultType.rtDateTime) Result = $mod.TIntToDateTimeNode.$create("Create$1",[Result]);
      } else if ($tmp === $mod.TResultType.rtFloat) {
        var $tmp2 = ToType;
        if ($tmp2 === $mod.TResultType.rtCurrency) {
          Result = $mod.TFloatToCurrencyNode.$create("Create$1",[Result])}
         else if ($tmp2 === $mod.TResultType.rtDateTime) Result = $mod.TFloatToDateTimeNode.$create("Create$1",[Result]);
      } else if ($tmp === $mod.TResultType.rtCurrency) {
        var $tmp3 = ToType;
        if ($tmp3 === $mod.TResultType.rtFloat) {
          Result = $mod.TCurrencyToFloatNode.$create("Create$1",[Result])}
         else if ($tmp3 === $mod.TResultType.rtDateTime) Result = $mod.TCurrencyToDateTimeNode.$create("Create$1",[Result]);
      };
      return Result;
    };
    this.BuiltinsManager = function () {
      var Result = null;
      Result = $mod.BuiltinIdentifiers();
      return Result;
    };
    this.Level1 = function () {
      var Result = null;
      var tt = 0;
      var Right = null;
      if (this.TokenType() === $mod.TTokenType.ttNot) {
        this.GetToken();
        this.CheckEOF();
        Right = this.Level2();
        Result = $mod.TFPNotNode.$create("Create$1",[Right]);
      } else Result = this.Level2();
      try {
        while (this.TokenType() in rtl.createSet($mod.TTokenType.ttAnd,$mod.TTokenType.ttOr,$mod.TTokenType.ttXor)) {
          tt = this.TokenType();
          this.GetToken();
          this.CheckEOF();
          Right = this.Level2();
          var $tmp = tt;
          if ($tmp === $mod.TTokenType.ttOr) {
            Result = $mod.TFPBinaryOrOperation.$create("Create$1",[Result,Right])}
           else if ($tmp === $mod.TTokenType.ttAnd) {
            Result = $mod.TFPBinaryAndOperation.$create("Create$1",[Result,Right])}
           else if ($tmp === $mod.TTokenType.ttXor) {
            Result = $mod.TFPBinaryXOrOperation.$create("Create$1",[Result,Right])}
           else {
            this.ParserError(rtl.getResStr($mod,"SErrUnknownBooleanOp"));
          };
        };
      } catch ($e) {
        Result = rtl.freeLoc(Result);
        throw $e;
      };
      return Result;
    };
    this.Level2 = function () {
      var Result = null;
      var Right = null;
      var tt = 0;
      var C = null;
      Result = this.Level3();
      try {
        if (this.TokenType() in $mod.ttComparisons) {
          tt = this.TokenType();
          this.GetToken();
          this.CheckEOF();
          Right = this.Level3();
          this.CheckNodes({get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},{get: function () {
              return Right;
            }, set: function (v) {
              Right = v;
            }});
          var $tmp = tt;
          if ($tmp === $mod.TTokenType.ttLessThan) {
            C = $mod.TFPLessThanOperation}
           else if ($tmp === $mod.TTokenType.ttLessThanEqual) {
            C = $mod.TFPLessThanEqualOperation}
           else if ($tmp === $mod.TTokenType.ttLargerThan) {
            C = $mod.TFPGreaterThanOperation}
           else if ($tmp === $mod.TTokenType.ttLargerThanEqual) {
            C = $mod.TFPGreaterThanEqualOperation}
           else if ($tmp === $mod.TTokenType.ttEqual) {
            C = $mod.TFPEqualOperation}
           else if ($tmp === $mod.TTokenType.ttunequal) {
            C = $mod.TFPUnequalOperation}
           else if ($tmp === $mod.TTokenType.ttLike) {
            C = $mod.TFPLikeOperation}
           else {
            this.ParserError(rtl.getResStr($mod,"SErrUnknownComparison"));
          };
          Result = C.$create("Create$1",[Result,Right]);
        };
      } catch ($e) {
        Result = rtl.freeLoc(Result);
        throw $e;
      };
      return Result;
    };
    this.Level3 = function () {
      var Result = null;
      var tt = 0;
      var right = null;
      Result = this.Level4();
      try {
        while (this.TokenType() in rtl.createSet($mod.TTokenType.ttPlus,$mod.TTokenType.ttMinus)) {
          tt = this.TokenType();
          this.GetToken();
          this.CheckEOF();
          right = this.Level4();
          this.CheckNodes({get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},{get: function () {
              return right;
            }, set: function (v) {
              right = v;
            }});
          var $tmp = tt;
          if ($tmp === $mod.TTokenType.ttPlus) {
            Result = $mod.TFPAddOperation.$create("Create$1",[Result,right])}
           else if ($tmp === $mod.TTokenType.ttMinus) Result = $mod.TFPSubtractOperation.$create("Create$1",[Result,right]);
        };
      } catch ($e) {
        Result = rtl.freeLoc(Result);
        throw $e;
      };
      return Result;
    };
    this.Level4 = function () {
      var Result = null;
      var tt = 0;
      var right = null;
      Result = this.Level5();
      try {
        while (this.TokenType() in rtl.createSet($mod.TTokenType.ttMul,$mod.TTokenType.ttDiv,$mod.TTokenType.ttMod)) {
          tt = this.TokenType();
          this.GetToken();
          right = this.Level5();
          this.CheckNodes({get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},{get: function () {
              return right;
            }, set: function (v) {
              right = v;
            }});
          var $tmp = tt;
          if ($tmp === $mod.TTokenType.ttMul) {
            Result = $mod.TFPMultiplyOperation.$create("Create$1",[Result,right])}
           else if ($tmp === $mod.TTokenType.ttDiv) {
            Result = $mod.TFPDivideOperation.$create("Create$1",[Result,right])}
           else if ($tmp === $mod.TTokenType.ttMod) Result = $mod.TFPModuloOperation.$create("Create$1",[Result,right]);
        };
      } catch ($e) {
        Result = rtl.freeLoc(Result);
        throw $e;
      };
      return Result;
    };
    this.Level5 = function () {
      var Result = null;
      var B = false;
      B = false;
      if (this.TokenType() in rtl.createSet($mod.TTokenType.ttPlus,$mod.TTokenType.ttMinus)) {
        B = this.TokenType() === $mod.TTokenType.ttMinus;
        this.GetToken();
      };
      Result = this.Level6();
      if (B) Result = $mod.TFPNegateOperation.$create("Create$1",[Result]);
      return Result;
    };
    this.Level6 = function () {
      var Result = null;
      var right = null;
      Result = this.Level7();
      try {
        while (this.TokenType() === $mod.TTokenType.ttPower) {
          this.GetToken();
          right = this.Level5();
          this.CheckNodes({get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }},{get: function () {
              return right;
            }, set: function (v) {
              right = v;
            }});
          Result = $mod.TFPPowerOperation.$create("Create$1",[Result,right]);
        };
      } catch ($e) {
        Result = rtl.freeLoc(Result);
        throw $e;
      };
      return Result;
    };
    this.Level7 = function () {
      var Result = null;
      if (this.TokenType() === $mod.TTokenType.ttLeft) {
        this.GetToken();
        Result = this.Level1();
        try {
          if (this.TokenType() !== $mod.TTokenType.ttRight) this.ParserError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrBracketExpected"),pas.System.VarRecs(0,this.FScanner.FPos,18,this.CurrentToken())));
          this.GetToken();
        } catch ($e) {
          Result = rtl.freeLoc(Result);
          throw $e;
        };
      } else Result = this.Primitive();
      return Result;
    };
    this.Primitive = function () {
      var Result = null;
      var I = 0;
      var C = 0;
      var X = 0.0;
      var ACount = 0;
      var IFF = false;
      var IFC = false;
      var ID = null;
      var Args = [];
      var AI = 0;
      Args = rtl.arraySetLength(Args,null,0);
      if (this.TokenType() === $mod.TTokenType.ttNumber) {
        if (pas.SysUtils.TryStrToInt64(this.CurrentToken(),{get: function () {
            return I;
          }, set: function (v) {
            I = v;
          }})) {
          Result = $mod.TFPConstExpression.$create("CreateInteger",[I])}
         else {
          pas.System.val$8(this.CurrentToken(),{get: function () {
              return X;
            }, set: function (v) {
              X = v;
            }},{get: function () {
              return C;
            }, set: function (v) {
              C = v;
            }});
          if (C === 0) {
            Result = $mod.TFPConstExpression.$create("CreateFloat",[X])}
           else this.ParserError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrInvalidFloat"),pas.System.VarRecs(18,this.CurrentToken())));
        };
      } else if (this.TokenType() === $mod.TTokenType.ttString) {
        Result = $mod.TFPConstExpression.$create("CreateString",[this.CurrentToken()])}
       else if (this.TokenType() in rtl.createSet($mod.TTokenType.ttTrue,$mod.TTokenType.ttFalse)) {
        Result = $mod.TFPConstExpression.$create("CreateBoolean",[this.TokenType() === $mod.TTokenType.ttTrue])}
       else if (!(this.TokenType() in rtl.createSet($mod.TTokenType.ttIdentifier,$mod.TTokenType.ttif,$mod.TTokenType.ttCase))) {
        this.ParserError(pas.SysUtils.Format(rtl.getResStr($mod,"SerrUnknownTokenAtPos"),pas.System.VarRecs(0,this.FScanner.FPos,18,this.CurrentToken())))}
       else {
        IFF = this.TokenType() === $mod.TTokenType.ttif;
        IFC = this.TokenType() === $mod.TTokenType.ttCase;
        if (!(IFF || IFC)) {
          ID = this.IdentifierByName(this.CurrentToken());
          if (ID === null) this.ParserError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrUnknownIdentifier"),pas.System.VarRecs(18,this.CurrentToken())));
        };
        if (IFF) {
          ACount = 3}
         else if (IFC) {
          ACount = -4}
         else if (ID.FIDType in rtl.createSet($mod.TIdentifierType.itFunctionHandler,$mod.TIdentifierType.itFunctionNode)) {
          ACount = ID.ArgumentCount()}
         else ACount = 0;
        if (ACount !== 0) {
          this.GetToken();
          if (this.TokenType() !== $mod.TTokenType.ttLeft) this.ParserError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrLeftBracketExpected"),pas.System.VarRecs(0,this.FScanner.FPos,18,this.CurrentToken())));
          Args = rtl.arraySetLength(Args,null,Math.abs(ACount));
          AI = 0;
          try {
            do {
              this.GetToken();
              if ((ACount < 0) && (AI === rtl.length(Args))) {
                Args = rtl.arraySetLength(Args,null,AI + 1);
                Args[AI] = null;
              };
              Args[AI] = this.Level1();
              AI += 1;
              if (this.TokenType() !== $mod.TTokenType.ttComma) if (AI < Math.abs(ACount)) this.ParserError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrCommaExpected"),pas.System.VarRecs(0,this.FScanner.FPos,18,this.CurrentToken())));
            } while (!((AI === ACount) || ((ACount < 0) && (this.TokenType() === $mod.TTokenType.ttRight))));
            if (this.TokenType() !== $mod.TTokenType.ttRight) this.ParserError(pas.SysUtils.Format(rtl.getResStr($mod,"SErrBracketExpected"),pas.System.VarRecs(0,this.FScanner.FPos,18,this.CurrentToken())));
          } catch ($e) {
            if (pas.SysUtils.Exception.isPrototypeOf($e)) {
              var E = $e;
              AI -= 1;
              while (AI >= 0) {
                pas.SysUtils.FreeAndNil({a: AI, p: Args, get: function () {
                    return this.p[this.a];
                  }, set: function (v) {
                    this.p[this.a] = v;
                  }});
                AI -= 1;
              };
              throw $e;
            } else throw $e
          };
        };
        if (IFF) {
          Result = $mod.TIfOperation.$create("Create$2",[Args[0],Args[1],Args[2]])}
         else if (IFC) {
          Result = $mod.TCaseOperation.$create("Create$1",[rtl.arrayRef(Args)])}
         else {
          var $tmp = ID.FIDType;
          if ($tmp === $mod.TIdentifierType.itVariable) {
            Result = $mod.TFPExprVariable.$create("CreateIdentifier",[ID])}
           else if ($tmp === $mod.TIdentifierType.itFunctionHandler) {
            Result = $mod.TFPFunctionEventHandler.$create("CreateFunction",[ID,Args])}
           else if ($tmp === $mod.TIdentifierType.itFunctionNode) Result = ID.FNodeType.$create("CreateFunction",[ID,Args]);
        };
      };
      this.GetToken();
      return Result;
    };
    this.GetToken = function () {
      var Result = 0;
      Result = this.FScanner.GetToken();
      return Result;
    };
    this.TokenType = function () {
      var Result = 0;
      Result = this.FScanner.FTokenType;
      return Result;
    };
    this.CurrentToken = function () {
      var Result = "";
      Result = this.FScanner.FToken;
      return Result;
    };
    this.CreateHashList = function () {
      var ID = null;
      var BID = null;
      var I = 0;
      var M = null;
      this.FHashList.Clear();
      M = this.$class.BuiltinsManager();
      if (rtl.neSet(this.FBuiltIns,{}) && (M != null)) for (var $l = 0, $end = M.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        BID = M.GetI(I);
        if (BID.FCategory in this.FBuiltIns) this.FHashList.Add(pas.SysUtils.LowerCase(BID.FName),BID);
      };
      for (var $l1 = 0, $end1 = this.FIdentifiers.GetCount() - 1; $l1 <= $end1; $l1++) {
        I = $l1;
        ID = this.FIdentifiers.GetI(I);
        this.FHashList.Add(pas.SysUtils.LowerCase(ID.FName),ID);
      };
      this.FDirty = false;
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FIdentifiers = $mod.TFPExprIdentifierDefs.$create("Create$1",[$mod.TFPExprIdentifierDef]);
      this.FIdentifiers.FParser = this;
      this.FScanner = $mod.TFPExpressionScanner.$create("Create$1");
      this.FHashList = pas.contnrs.TFPObjectHashTable.$create("Create$2",[false]);
      return this;
    };
    this.Destroy = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FHashList;
        }, set: function (v) {
          this.p.FHashList = v;
        }});
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FExprNode;
        }, set: function (v) {
          this.p.FExprNode = v;
        }});
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FIdentifiers;
        }, set: function (v) {
          this.p.FIdentifiers = v;
        }});
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FScanner;
        }, set: function (v) {
          this.p.FScanner = v;
        }});
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.IdentifierByName = function (AName) {
      var Result = null;
      if (this.FDirty) this.CreateHashList();
      Result = this.FHashList.GetData(pas.SysUtils.LowerCase(AName));
      return Result;
    };
    this.Clear = function () {
      this.FExpression = "";
      this.FHashList.Clear();
      rtl.free(this,"FExprNode");
    };
    this.Evaluate = function (aExpression) {
      var Result = $mod.TFPExpressionResult.$new();
      var F = null;
      F = $mod.TFPExpressionParser.$create("Create$1",[null]);
      try {
        F.SetExpression(aExpression);
        Result.$assign(F.Evaluate$1());
      } finally {
        F = rtl.freeLoc(F);
      };
      return Result;
    };
    this.EvaluateExpression = function (Result) {
      Result.$assign(this.Evaluate$1());
    };
    this.ExtractNode = function (N) {
      var Result = false;
      Result = this.FExprNode != null;
      if (Result) {
        N.set(this.FExprNode);
        this.FExprNode = null;
        this.FExpression = "";
      };
      return Result;
    };
    this.Evaluate$1 = function () {
      var Result = $mod.TFPExpressionResult.$new();
      if (this.FExpression === "") this.ParserError(rtl.getResStr($mod,"SErrInExpressionEmpty"));
      if (!(this.FExprNode != null)) this.ParserError(rtl.getResStr($mod,"SErrInExpression"));
      Result.$assign(this.FExprNode.GetNodeValue());
      return Result;
    };
    this.ResultType = function () {
      var Result = 0;
      if (!(this.FExprNode != null)) this.ParserError(rtl.getResStr($mod,"SErrInExpression"));
      Result = this.FExprNode.NodeType();
      return Result;
    };
    this.HasAggregate = function () {
      var Result = false;
      Result = (this.FExprNode != null) && this.FExprNode.HasAggregate();
      return Result;
    };
    this.InitAggregate = function () {
      if (this.FExprNode != null) this.FExprNode.InitAggregate();
    };
    this.UpdateAggregate = function () {
      if (this.FExprNode != null) this.FExprNode.UpdateAggregate();
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Expression",2,rtl.string,"FExpression","SetExpression");
    $r.addProperty("Identifiers",2,$mod.$rtti["TFPExprIdentifierDefs"],"FIdentifiers","SetIdentifiers");
    $r.addProperty("BuiltIns",2,$mod.$rtti["TBuiltInCategories"],"FBuiltIns","SetBuiltIns");
  });
  this.$rtti.$ClassRef("TFPExpressionParserClass",{instancetype: this.$rtti["TFPExpressionParser"]});
  rtl.createClass(this,"TExprBuiltInManager",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FDefs = null;
    };
    this.$final = function () {
      this.FDefs = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FDefs.GetCount();
      return Result;
    };
    this.GetI = function (AIndex) {
      var Result = null;
      Result = this.FDefs.GetI(AIndex);
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FDefs = $mod.TFPExprIdentifierDefs.$create("Create$1",[$mod.TFPBuiltInExprIdentifierDef]);
      return this;
    };
    this.Destroy = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FDefs;
        }, set: function (v) {
          this.p.FDefs = v;
        }});
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.IndexOfIdentifier = function (AName) {
      var Result = 0;
      Result = this.FDefs.IndexOfIdentifier(AName);
      return Result;
    };
    this.FindIdentifier = function (AName) {
      var Result = null;
      Result = this.FDefs.FindIdentifier(AName);
      return Result;
    };
    this.IdentifierByName = function (AName) {
      var Result = null;
      Result = this.FDefs.IdentifierByName(AName);
      return Result;
    };
    this.AddVariable = function (ACategory, AName, AResultType, AValue) {
      var Result = null;
      Result = this.FDefs.AddVariable$1(AName,AResultType,AValue);
      Result.FCategory = ACategory;
      return Result;
    };
    this.AddBooleanVariable = function (ACategory, AName, AValue) {
      var Result = null;
      Result = this.FDefs.AddBooleanVariable(AName,AValue);
      Result.FCategory = ACategory;
      return Result;
    };
    this.AddIntegerVariable = function (ACategory, AName, AValue) {
      var Result = null;
      Result = this.FDefs.AddIntegerVariable(AName,AValue);
      Result.FCategory = ACategory;
      return Result;
    };
    this.AddFloatVariable = function (ACategory, AName, AValue) {
      var Result = null;
      Result = this.FDefs.AddFloatVariable(AName,AValue);
      Result.FCategory = ACategory;
      return Result;
    };
    this.AddCurrencyVariable = function (ACategory, AName, AValue) {
      var Result = null;
      Result = this.FDefs.AddCurrencyVariable(AName,AValue);
      Result.FCategory = ACategory;
      return Result;
    };
    this.AddStringVariable = function (ACategory, AName, AValue) {
      var Result = null;
      Result = this.FDefs.AddStringVariable(AName,AValue);
      Result.FCategory = ACategory;
      return Result;
    };
    this.AddDateTimeVariable = function (ACategory, AName, AValue) {
      var Result = null;
      Result = this.FDefs.AddDateTimeVariable(AName,AValue);
      Result.FCategory = ACategory;
      return Result;
    };
    this.AddFunction = function (ACategory, AName, AResultType, AParamTypes, ACallBack) {
      var Result = null;
      Result = this.FDefs.AddFunction(AName,AResultType,AParamTypes,ACallBack);
      Result.FCategory = ACategory;
      return Result;
    };
    this.AddFunction$1 = function (ACategory, AName, AResultType, AParamTypes, ANodeClass) {
      var Result = null;
      Result = this.FDefs.AddFunction$1(AName,AResultType,AParamTypes,ANodeClass);
      Result.FCategory = ACategory;
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"EExprParser",pas.SysUtils.Exception,function () {
  });
  this.AllBuiltIns = rtl.createSet(this.TBuiltInCategory.bcStrings,this.TBuiltInCategory.bcDateTime,this.TBuiltInCategory.bcMath,this.TBuiltInCategory.bcBoolean,this.TBuiltInCategory.bcConversion,this.TBuiltInCategory.bcData,this.TBuiltInCategory.bcVaria,this.TBuiltInCategory.bcUser,this.TBuiltInCategory.bcAggregate);
  this.TokenName = function (AToken) {
    var Result = "";
    Result = pas.TypInfo.GetEnumName($mod.$rtti["TTokenType"],AToken);
    return Result;
  };
  this.ResultTypeName = function (AResult) {
    var Result = "";
    Result = pas.TypInfo.GetEnumName($mod.$rtti["TResultType"],AResult);
    return Result;
  };
  this.CharToResultType = function (C) {
    var Result = 0;
    var $tmp = pas.System.upcase(C);
    if ($tmp === "S") {
      Result = $mod.TResultType.rtString}
     else if ($tmp === "D") {
      Result = $mod.TResultType.rtDateTime}
     else if ($tmp === "B") {
      Result = $mod.TResultType.rtBoolean}
     else if ($tmp === "I") {
      Result = $mod.TResultType.rtInteger}
     else if ($tmp === "F") {
      Result = $mod.TResultType.rtFloat}
     else if ($tmp === "C") {
      Result = $mod.TResultType.rtCurrency}
     else {
      $impl.RaiseParserError$1(rtl.getResStr($mod,"SErrInvalidResultCharacter"),pas.System.VarRecs(9,C));
    };
    return Result;
  };
  this.BuiltinIdentifiers = function () {
    var Result = null;
    if ($impl.BuiltIns === null) $impl.BuiltIns = $mod.TExprBuiltInManager.$create("Create$1",[null]);
    Result = $impl.BuiltIns;
    return Result;
  };
  this.RegisterStdBuiltins = function (AManager, Categories) {
    if ($mod.TBuiltInCategory.bcMath in Categories) {
      AManager.AddFloatVariable($mod.TBuiltInCategory.bcMath,"pi",Math.PI);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"cos","F","F",$impl.BuiltInCos);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"sin","F","F",$impl.BuiltInSin);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"abs","F","F",$impl.BuiltInAbs);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"sqr","F","F",$impl.BuiltInSqr);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"sqrt","F","F",$impl.BuiltInSqrt);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"exp","F","F",$impl.BuiltInExp);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"ln","F","F",$impl.BuiltInLn);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"log","F","F",$impl.BuiltInLog);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"frac","F","F",$impl.BuiltInFrac);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"int","F","F",$impl.BuiltInInt);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"round","I","F",$impl.BuiltInRound);
      AManager.AddFunction($mod.TBuiltInCategory.bcMath,"trunc","I","F",$impl.BuiltInTrunc);
    };
    if ($mod.TBuiltInCategory.bcStrings in Categories) {
      AManager.AddFunction($mod.TBuiltInCategory.bcStrings,"length","I","S",$impl.BuiltInLength);
      AManager.AddFunction($mod.TBuiltInCategory.bcStrings,"copy","S","SII",$impl.BuiltInCopy);
      AManager.AddFunction($mod.TBuiltInCategory.bcStrings,"delete","S","SII",$impl.BuiltInDelete);
      AManager.AddFunction($mod.TBuiltInCategory.bcStrings,"pos","I","SS",$impl.BuiltInPos);
      AManager.AddFunction($mod.TBuiltInCategory.bcStrings,"lowercase","S","S",$impl.BuiltInLowercase);
      AManager.AddFunction($mod.TBuiltInCategory.bcStrings,"uppercase","S","S",$impl.BuiltInUppercase);
      AManager.AddFunction($mod.TBuiltInCategory.bcStrings,"stringreplace","S","SSSBB",$impl.BuiltInStringReplace);
      AManager.AddFunction($mod.TBuiltInCategory.bcStrings,"comparetext","I","SS",$impl.BuiltInCompareText);
    };
    if ($mod.TBuiltInCategory.bcDateTime in Categories) {
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"date","D","",$impl.BuiltInDate);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"time","D","",$impl.BuiltInTime);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"now","D","",$impl.BuiltInNow);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"dayofweek","I","D",$impl.BuiltInDayofWeek);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"extractyear","I","D",$impl.BuiltInExtractYear);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"extractmonth","I","D",$impl.BuiltInExtractMonth);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"extractday","I","D",$impl.BuiltInExtractDay);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"extracthour","I","D",$impl.BuiltInExtractHour);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"extractmin","I","D",$impl.BuiltInExtractMin);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"extractsec","I","D",$impl.BuiltInExtractSec);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"extractmsec","I","D",$impl.BuiltInExtractMSec);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"encodedate","D","III",$impl.BuiltInEncodedate);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"encodetime","D","IIII",$impl.BuiltInEncodeTime);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"encodedatetime","D","IIIIIII",$impl.BuiltInEncodeDateTime);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"shortdayname","S","I",$impl.BuiltInShortDayName);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"shortmonthname","S","I",$impl.BuiltInShortMonthName);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"longdayname","S","I",$impl.BuiltInLongDayName);
      AManager.AddFunction($mod.TBuiltInCategory.bcDateTime,"longmonthname","S","I",$impl.BuiltInLongMonthName);
    };
    if ($mod.TBuiltInCategory.bcBoolean in Categories) {
      AManager.AddFunction($mod.TBuiltInCategory.bcBoolean,"shl","I","II",$impl.BuiltInShl);
      AManager.AddFunction($mod.TBuiltInCategory.bcBoolean,"shr","I","II",$impl.BuiltInShr);
      AManager.AddFunction($mod.TBuiltInCategory.bcBoolean,"IFS","S","BSS",$impl.BuiltinIFS);
      AManager.AddFunction($mod.TBuiltInCategory.bcBoolean,"IFF","F","BFF",$impl.BuiltinIFF);
      AManager.AddFunction($mod.TBuiltInCategory.bcBoolean,"IFD","D","BDD",$impl.BuiltinIFD);
      AManager.AddFunction($mod.TBuiltInCategory.bcBoolean,"IFI","I","BII",$impl.BuiltinIFI);
    };
    if ($mod.TBuiltInCategory.bcConversion in Categories) {
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"inttostr","S","I",$impl.BuiltInIntToStr);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtoint","I","S",$impl.BuiltInStrToInt);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtointdef","I","SI",$impl.BuiltInStrToIntDef);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"floattostr","S","F",$impl.BuiltInFloatToStr);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtofloat","F","S",$impl.BuiltInStrToFloat);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtofloatdef","F","SF",$impl.BuiltInStrToFloatDef);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"booltostr","S","B",$impl.BuiltInBoolToStr);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtobool","B","S",$impl.BuiltInStrToBool);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtobooldef","B","SB",$impl.BuiltInStrToBoolDef);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"datetostr","S","D",$impl.BuiltInDateToStr);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"timetostr","S","D",$impl.BuiltInTimeToStr);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtodate","D","S",$impl.BuiltInStrToDate);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtodatedef","D","SD",$impl.BuiltInStrToDateDef);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtotime","D","S",$impl.BuiltInStrToTime);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtotimedef","D","SD",$impl.BuiltInStrToTimeDef);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtodatetime","D","S",$impl.BuiltInStrToDateTime);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"strtodatetimedef","D","SD",$impl.BuiltInStrToDateTimeDef);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"formatfloat","S","SF",$impl.BuiltInFormatFloat);
      AManager.AddFunction($mod.TBuiltInCategory.bcConversion,"formatdatetime","S","SD",$impl.BuiltInFormatDateTime);
    };
    if ($mod.TBuiltInCategory.bcAggregate in Categories) {
      AManager.AddFunction$1($mod.TBuiltInCategory.bcAggregate,"count","I","",$mod.TAggregateCount);
      AManager.AddFunction$1($mod.TBuiltInCategory.bcAggregate,"sum","F","F",$mod.TAggregateSum);
      AManager.AddFunction$1($mod.TBuiltInCategory.bcAggregate,"avg","F","F",$mod.TAggregateAvg);
      AManager.AddFunction$1($mod.TBuiltInCategory.bcAggregate,"min","F","F",$mod.TAggregateMin);
      AManager.AddFunction$1($mod.TBuiltInCategory.bcAggregate,"max","F","F",$mod.TAggregateMax);
    };
  };
  this.ArgToFloat = function (Arg) {
    var Result = 0.0;
    if (Arg.ResultType === $mod.TResultType.rtInteger) {
      Result = rtl.trunc(Arg.resValue)}
     else if (Arg.ResultType === $mod.TResultType.rtCurrency) {
      Result = rtl.trunc(Arg.resValue * 10000) / 10000}
     else Result = rtl.getNumber(Arg.resValue);
    return Result;
  };
  $mod.$implcode = function () {
    $impl.cNull = "\x00";
    $impl.cSingleQuote = "'";
    $impl.cHexIdentifier = "$";
    $impl.cOctalIdentifier = "&";
    $impl.cBinaryIdentifier = "%";
    $impl.Digits = rtl.createSet(null,48,57,46);
    $impl.HexDigits = rtl.createSet(null,48,57,null,65,70,null,97,102);
    $impl.OctalDigits = rtl.createSet(null,48,55);
    $impl.BinaryDigits = rtl.createSet(48,49);
    $impl.WhiteSpace = rtl.createSet(32,13,10,9);
    $impl.Operators = rtl.createSet(43,45,60,62,61,47,42,94);
    $impl.Delimiters = rtl.unionSet($impl.Operators,rtl.createSet(44,40,41));
    $impl.Symbols = rtl.unionSet(rtl.createSet(37),$impl.Delimiters);
    $impl.WordDelimiters = rtl.unionSet($impl.WhiteSpace,$impl.Symbols);
    $impl.FileFormatSettings = pas.SysUtils.TFormatSettings.$new();
    $impl.RaiseParserError = function (Msg) {
      throw $mod.EExprParser.$create("Create$1",[Msg]);
    };
    $impl.RaiseParserError$1 = function (Fmt, Args) {
      throw $mod.EExprParser.$create("CreateFmt",[Fmt,Args]);
    };
    $impl.BuiltIns = null;
    $impl.power = function (base, exponent) {
      var Result = 0.0;
      var ex = 0;
      if (exponent === 0.0) {
        Result = 1.0}
       else if ((base === 0.0) && (exponent > 0.0)) {
        Result = 0.0}
       else if ((base < 0.0) && (pas.System.Frac(exponent) === 0.0)) {
        ex = Math.round(exponent);
        Result = Math.exp(exponent * Math.log(-base));
        if (pas.System.Odd(ex)) Result = -Result;
      } else Result = Math.exp(exponent * Math.log(base));
      return Result;
    };
    $impl.BuiltInCos = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = Math.cos($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInSin = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = Math.sin($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInAbs = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = Math.abs($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInSqr = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = pas.System.Sqr$1($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInSqrt = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = Math.sqrt($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInExp = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = Math.exp($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInLn = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = Math.log($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.L10 = 0.0;
    $impl.BuiltInLog = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = Math.log($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0]))) / $impl.L10;
      return Result;
    };
    $impl.BuiltInRound = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = Math.round($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInTrunc = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = pas.System.Trunc($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInInt = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = pas.System.Int($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInFrac = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = pas.System.Frac($mod.ArgToFloat($mod.TFPExpressionResult.$clone(Args[0])));
      return Result;
    };
    $impl.BuiltInLength = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = ("" + Args[0].resValue).length;
      return Result;
    };
    $impl.BuiltInCopy = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.System.Copy("" + Args[0].resValue,rtl.trunc(Args[1].resValue),rtl.trunc(Args[2].resValue));
      return Result;
    };
    $impl.BuiltInDelete = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      var S = "";
      Result.ResultType = $mod.TResultType.rtString;
      S = "" + Args[0].resValue;
      pas.System.Delete({get: function () {
          return S;
        }, set: function (v) {
          S = v;
        }},rtl.trunc(Args[1].resValue),rtl.trunc(Args[2].resValue));
      Result.resValue = S;
      return Result;
    };
    $impl.BuiltInPos = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = pas.System.Pos("" + Args[0].resValue,"" + Args[1].resValue);
      return Result;
    };
    $impl.BuiltInUppercase = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.UpperCase("" + Args[0].resValue);
      return Result;
    };
    $impl.BuiltInLowercase = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.LowerCase("" + Args[0].resValue);
      return Result;
    };
    $impl.BuiltInStringReplace = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      var F = {};
      Result.ResultType = $mod.TResultType.rtString;
      F = {};
      if (!(Args[3].resValue == false)) F = rtl.includeSet(F,pas.SysUtils.TStringReplaceFlag.rfReplaceAll);
      if (!(Args[4].resValue == false)) F = rtl.includeSet(F,pas.SysUtils.TStringReplaceFlag.rfIgnoreCase);
      Result.resValue = pas.SysUtils.StringReplace("" + Args[0].resValue,"" + Args[1].resValue,"" + Args[2].resValue,rtl.refSet(F));
      return Result;
    };
    $impl.BuiltInCompareText = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = pas.SysUtils.CompareText("" + Args[0].resValue,"" + Args[1].resValue);
      return Result;
    };
    $impl.BuiltInDate = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      if (rtl.length(Args) === 0) ;
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.Date();
      return Result;
    };
    $impl.BuiltInTime = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      if (rtl.length(Args) === 0) ;
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.Time();
      return Result;
    };
    $impl.BuiltInNow = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      if (rtl.length(Args) === 0) ;
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.Now();
      return Result;
    };
    $impl.BuiltInDayofWeek = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = pas.SysUtils.DayOfWeek(rtl.getNumber(Args[0].resValue));
      return Result;
    };
    $impl.BuiltInExtractYear = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      var Y = 0;
      var M = 0;
      var D = 0;
      Result.ResultType = $mod.TResultType.rtInteger;
      pas.SysUtils.DecodeDate(rtl.getNumber(Args[0].resValue),{get: function () {
          return Y;
        }, set: function (v) {
          Y = v;
        }},{get: function () {
          return M;
        }, set: function (v) {
          M = v;
        }},{get: function () {
          return D;
        }, set: function (v) {
          D = v;
        }});
      Result.resValue = Y;
      return Result;
    };
    $impl.BuiltInExtractMonth = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      var Y = 0;
      var M = 0;
      var D = 0;
      Result.ResultType = $mod.TResultType.rtInteger;
      pas.SysUtils.DecodeDate(rtl.getNumber(Args[0].resValue),{get: function () {
          return Y;
        }, set: function (v) {
          Y = v;
        }},{get: function () {
          return M;
        }, set: function (v) {
          M = v;
        }},{get: function () {
          return D;
        }, set: function (v) {
          D = v;
        }});
      Result.resValue = M;
      return Result;
    };
    $impl.BuiltInExtractDay = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      var Y = 0;
      var M = 0;
      var D = 0;
      Result.ResultType = $mod.TResultType.rtInteger;
      pas.SysUtils.DecodeDate(rtl.getNumber(Args[0].resValue),{get: function () {
          return Y;
        }, set: function (v) {
          Y = v;
        }},{get: function () {
          return M;
        }, set: function (v) {
          M = v;
        }},{get: function () {
          return D;
        }, set: function (v) {
          D = v;
        }});
      Result.resValue = D;
      return Result;
    };
    $impl.BuiltInExtractHour = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      var H = 0;
      var M = 0;
      var S = 0;
      var MS = 0;
      Result.ResultType = $mod.TResultType.rtInteger;
      pas.SysUtils.DecodeTime(rtl.getNumber(Args[0].resValue),{get: function () {
          return H;
        }, set: function (v) {
          H = v;
        }},{get: function () {
          return M;
        }, set: function (v) {
          M = v;
        }},{get: function () {
          return S;
        }, set: function (v) {
          S = v;
        }},{get: function () {
          return MS;
        }, set: function (v) {
          MS = v;
        }});
      Result.resValue = H;
      return Result;
    };
    $impl.BuiltInExtractMin = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      var H = 0;
      var M = 0;
      var S = 0;
      var MS = 0;
      Result.ResultType = $mod.TResultType.rtInteger;
      pas.SysUtils.DecodeTime(rtl.getNumber(Args[0].resValue),{get: function () {
          return H;
        }, set: function (v) {
          H = v;
        }},{get: function () {
          return M;
        }, set: function (v) {
          M = v;
        }},{get: function () {
          return S;
        }, set: function (v) {
          S = v;
        }},{get: function () {
          return MS;
        }, set: function (v) {
          MS = v;
        }});
      Result.resValue = M;
      return Result;
    };
    $impl.BuiltInExtractSec = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      var H = 0;
      var M = 0;
      var S = 0;
      var MS = 0;
      Result.ResultType = $mod.TResultType.rtInteger;
      pas.SysUtils.DecodeTime(rtl.getNumber(Args[0].resValue),{get: function () {
          return H;
        }, set: function (v) {
          H = v;
        }},{get: function () {
          return M;
        }, set: function (v) {
          M = v;
        }},{get: function () {
          return S;
        }, set: function (v) {
          S = v;
        }},{get: function () {
          return MS;
        }, set: function (v) {
          MS = v;
        }});
      Result.resValue = S;
      return Result;
    };
    $impl.BuiltInExtractMSec = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      var H = 0;
      var M = 0;
      var S = 0;
      var MS = 0;
      Result.ResultType = $mod.TResultType.rtInteger;
      pas.SysUtils.DecodeTime(rtl.getNumber(Args[0].resValue),{get: function () {
          return H;
        }, set: function (v) {
          H = v;
        }},{get: function () {
          return M;
        }, set: function (v) {
          M = v;
        }},{get: function () {
          return S;
        }, set: function (v) {
          S = v;
        }},{get: function () {
          return MS;
        }, set: function (v) {
          MS = v;
        }});
      Result.resValue = MS;
      return Result;
    };
    $impl.BuiltInEncodedate = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.EncodeDate(rtl.trunc(Args[0].resValue),rtl.trunc(Args[1].resValue),rtl.trunc(Args[2].resValue));
      return Result;
    };
    $impl.BuiltInEncodeTime = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.EncodeTime(rtl.trunc(Args[0].resValue),rtl.trunc(Args[1].resValue),rtl.trunc(Args[2].resValue),rtl.trunc(Args[3].resValue));
      return Result;
    };
    $impl.BuiltInEncodeDateTime = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.EncodeDate(rtl.trunc(Args[0].resValue),rtl.trunc(Args[1].resValue),rtl.trunc(Args[2].resValue)) + pas.SysUtils.EncodeTime(rtl.trunc(Args[3].resValue),rtl.trunc(Args[4].resValue),rtl.trunc(Args[5].resValue),rtl.trunc(Args[6].resValue));
      return Result;
    };
    $impl.BuiltInShortDayName = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.FormatSettings.ShortDayNames[rtl.trunc(Args[0].resValue) - 1];
      return Result;
    };
    $impl.BuiltInShortMonthName = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.FormatSettings.ShortMonthNames[rtl.trunc(Args[0].resValue) - 1];
      return Result;
    };
    $impl.BuiltInLongDayName = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.resValue = pas.SysUtils.FormatSettings.LongDayNames[rtl.trunc(Args[0].resValue) - 1];
      return Result;
    };
    $impl.BuiltInLongMonthName = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.FormatSettings.LongMonthNames[rtl.trunc(Args[0].resValue) - 1];
      return Result;
    };
    $impl.BuiltInFormatDateTime = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.FormatDateTime("" + Args[0].resValue,rtl.getNumber(Args[1].resValue));
      return Result;
    };
    $impl.BuiltInIntToStr = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.IntToStr(rtl.trunc(Args[0].resValue));
      return Result;
    };
    $impl.BuiltInStrToInt = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = pas.SysUtils.StrToInt("" + Args[0].resValue);
      return Result;
    };
    $impl.BuiltInStrToIntDef = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = pas.SysUtils.StrToIntDef$1("" + Args[0].resValue,rtl.trunc(Args[1].resValue));
      return Result;
    };
    $impl.BuiltInFloatToStr = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.FloatToStr(rtl.getNumber(Args[0].resValue));
      return Result;
    };
    $impl.BuiltInStrToFloat = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = pas.SysUtils.StrToFloat("" + Args[0].resValue);
      return Result;
    };
    $impl.BuiltInStrToFloatDef = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      Result.resValue = pas.SysUtils.StrToFloatDef("" + Args[0].resValue,rtl.getNumber(Args[1].resValue));
      return Result;
    };
    $impl.BuiltInDateToStr = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.DateToStr(rtl.getNumber(Args[0].resValue));
      return Result;
    };
    $impl.BuiltInTimeToStr = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.TimeToStr(rtl.getNumber(Args[0].resValue));
      return Result;
    };
    $impl.BuiltInStrToDate = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.StrToDate("" + Args[0].resValue);
      return Result;
    };
    $impl.BuiltInStrToDateDef = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.StrToDateDef("" + Args[0].resValue,rtl.getNumber(Args[1].resValue));
      return Result;
    };
    $impl.BuiltInStrToTime = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.StrToTime("" + Args[0].resValue);
      return Result;
    };
    $impl.BuiltInStrToTimeDef = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.StrToTimeDef("" + Args[0].resValue,rtl.getNumber(Args[1].resValue));
      return Result;
    };
    $impl.BuiltInStrToDateTime = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.StrToDateTime("" + Args[0].resValue);
      return Result;
    };
    $impl.BuiltInStrToDateTimeDef = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      Result.resValue = pas.SysUtils.StrToDateTimeDef("" + Args[0].resValue,rtl.getNumber(Args[1].resValue));
      return Result;
    };
    $impl.BuiltInFormatFloat = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.FormatFloat("" + Args[0].resValue,rtl.getNumber(Args[1].resValue));
      return Result;
    };
    $impl.BuiltInBoolToStr = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      Result.resValue = pas.SysUtils.BoolToStr(!(Args[0].resValue == false),false);
      return Result;
    };
    $impl.BuiltInStrToBool = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtBoolean;
      Result.resValue = pas.SysUtils.StrToBool("" + Args[0].resValue);
      return Result;
    };
    $impl.BuiltInStrToBoolDef = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.resValue = pas.SysUtils.StrToBoolDef("" + Args[0].resValue,!(Args[1].resValue == false));
      Result.ResultType = $mod.TResultType.rtBoolean;
      return Result;
    };
    $impl.BuiltInShl = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = rtl.shl(rtl.trunc(Args[0].resValue),rtl.trunc(Args[1].resValue));
      return Result;
    };
    $impl.BuiltInShr = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      Result.resValue = rtl.shr(rtl.trunc(Args[0].resValue),rtl.trunc(Args[1].resValue));
      return Result;
    };
    $impl.BuiltinIFS = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtString;
      if (!(Args[0].resValue == false)) {
        Result.resValue = Args[1].resValue}
       else Result.resValue = Args[2].resValue;
      return Result;
    };
    $impl.BuiltinIFI = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtInteger;
      if (!(Args[0].resValue == false)) {
        Result.resValue = Args[1].resValue}
       else Result.resValue = Args[2].resValue;
      return Result;
    };
    $impl.BuiltinIFF = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtFloat;
      if (!(Args[0].resValue == false)) {
        Result.resValue = Args[1].resValue}
       else Result.resValue = Args[2].resValue;
      return Result;
    };
    $impl.BuiltinIFD = function (Args) {
      var Result = $mod.TFPExpressionResult.$new();
      Result.ResultType = $mod.TResultType.rtDateTime;
      if (!(Args[0].resValue == false)) {
        Result.resValue = Args[1].resValue}
       else Result.resValue = Args[2].resValue;
      return Result;
    };
    $impl.InitFileFormatSettings = function () {
      $impl.FileFormatSettings.$assign(pas.SysUtils.FormatSettings);
      $impl.FileFormatSettings.DecimalSeparator = ".";
      $impl.FileFormatSettings.DateSeparator = "-";
      $impl.FileFormatSettings.TimeSeparator = ":";
      $impl.FileFormatSettings.ShortDateFormat = "yyyy-mm-dd";
      $impl.FileFormatSettings.LongTimeFormat = "hh:nn:ss";
    };
    $mod.$resourcestrings = {SBadQuotes: {org: "Unterminated string"}, SUnknownDelimiter: {org: 'Unknown delimiter character: "%s"'}, SErrUnknownCharacter: {org: 'Unknown character at pos %d: "%s"'}, SErrUnexpectedEndOfExpression: {org: "Unexpected end of expression"}, SErrUnknownComparison: {org: "Internal error: Unknown comparison"}, SErrUnknownBooleanOp: {org: "Internal error: Unknown boolean operation"}, SErrBracketExpected: {org: "Expected ) bracket at position %d, but got %s"}, SerrUnknownTokenAtPos: {org: "Unknown token at pos %d : %s"}, SErrLeftBracketExpected: {org: "Expected ( bracket at position %d, but got %s"}, SErrInvalidFloat: {org: "%s is not a valid floating-point value"}, SErrUnknownIdentifier: {org: "Unknown identifier: %s"}, SErrInExpression: {org: "Cannot evaluate: error in expression"}, SErrInExpressionEmpty: {org: "Cannot evaluate: empty expression"}, SErrCommaExpected: {org: "Expected comma (,) at position %d, but got %s"}, SErrInvalidNumberChar: {org: "Unexpected character in number : %s"}, SErrInvalidNumber: {org: "Invalid numerical value : %s"}, SErrUnterminatedIdentifier: {org: "Unterminated quoted identifier: %s"}, SErrNoOperand: {org: "No operand for unary operation %s"}, SErrNoleftOperand: {org: "No left operand for binary operation %s"}, SErrNoRightOperand: {org: "No right operand for binary operation %s"}, SErrNoNegation: {org: "Cannot negate expression of type %s : %s"}, SErrNoNOTOperation: {org: 'Cannot perform "not" on expression of type %s: %s'}, SErrTypesDoNotMatch: {org: 'Type mismatch: %s<>%s for expressions "%s" and "%s".'}, SErrNoNodeToCheck: {org: "Internal error: No node to check !"}, SInvalidNodeType: {org: "Node type (%s) not in allowed types (%s) for expression: %s"}, SErrUnterminatedExpression: {org: "Badly terminated expression. Found token at position %d : %s"}, SErrDuplicateIdentifier: {org: 'An identifier with name "%s" already exists.'}, SErrInvalidResultCharacter: {org: '"%s" is not a valid return type indicator'}, ErrInvalidArgumentCount: {org: "Invalid argument count for function %s"}, SErrInvalidArgumentType: {org: "Invalid type for argument %d: Expected %s, got %s"}, SErrInvalidResultType: {org: "Invalid result type: %s"}, SErrNotVariable: {org: "Identifier %s is not a variable"}, SErrIFNeedsBoolean: {org: "First argument to IF must be of type boolean: %s"}, SErrCaseNeeds3: {org: "Case statement needs to have at least 4 arguments"}, SErrCaseEvenCount: {org: "Case statement needs to have an even number of arguments"}, SErrCaseLabelNotAConst: {org: 'Case label %d "%s" is not a constant expression'}, SErrCaseLabelType: {org: 'Case label %d "%s" needs type %s, but has type %s'}, SErrCaseValueType: {org: 'Case value %d "%s" needs type %s, but has type %s'}, SErrStringTypeRequired: {org: 'Expression requires string type, got type "%s" for %s'}};
  };
  $mod.$init = function () {
    $impl.L10 = Math.log(10);
    $mod.RegisterStdBuiltins($mod.BuiltinIdentifiers(),$mod.AllBuiltIns);
    $impl.InitFileFormatSettings();
  };
},["TypInfo"]);
//# sourceMappingURL=fpexprpars.js.map
