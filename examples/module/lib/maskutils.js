rtl.module("MaskUtils",["System","Classes","SysUtils","JS"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.TStepState = {"0": "stLeading", stLeading: 0, "1": "stUpper", stUpper: 1, "2": "stLower", stLower: 2, "3": "stSpecial", stSpecial: 3, "4": "stArbitrary", stArbitrary: 4};
  this.$rtti.$Enum("TStepState",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TStepState});
  this.$rtti.$Set("TParseState",{comptype: this.$rtti["TStepState"]});
  rtl.createClass(this,"TMaskUtils",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FValue = "";
      this.FSourcePosition = 0;
      this.FPosition = 0;
      this.FEditMask = "";
      this.FMask = "";
      this.FSourceVal = "";
      this.FExitVal = "";
      this.FMatched = false;
      this.FMissChar = "\x00";
      this.FState = {};
    };
    this.$final = function () {
      this.FState = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.EvaluateExit = function () {
      if ($mod.TStepState.stUpper in this.FState) {
        this.FExitVal = this.FExitVal + pas.SysUtils.UpperCase(this.SourcePtr());
      } else if ($mod.TStepState.stLower in this.FState) {
        this.FExitVal = this.FExitVal + pas.SysUtils.LowerCase(this.SourcePtr());
      } else {
        this.FExitVal = this.FExitVal + this.SourcePtr();
      };
      this.FSourcePosition += 1;
    };
    this.EvaluateMissing = function () {
      this.FExitVal = this.FExitVal + this.FMissChar;
      this.FSourcePosition += 1;
    };
    this.DoFillRest = function () {
      var I = 0;
      if ($mod.TStepState.stArbitrary in this.FState) {
        I = this.FSourceVal.length - this.FMask.length;
        while (I >= 0) {
          this.EvaluateExit();
          I -= 1;
        };
      };
    };
    this.DoLiteral = function () {
      if ($mod.TStepState.stSpecial in this.FState) {
        this.FState = rtl.excludeSet(this.FState,$mod.TStepState.stSpecial);
      };
      if (this.FMatched && (this.MaskPtr() !== this.SourcePtr())) {
        this.RaiseError();
      };
      if (this.FMatched || !($impl.IsAlpha(this.SourcePtr()) || $impl.IsNumeric(this.SourcePtr()))) {
        this.FSourcePosition += 1;
      };
      this.FExitVal = this.FExitVal + this.MaskPtr();
    };
    this.DoLiteralInputMask = function () {
      if ($mod.TStepState.stSpecial in this.FState) {
        this.FState = rtl.excludeSet(this.FState,$mod.TStepState.stSpecial);
      };
      this.FExitVal = this.FExitVal + this.MaskPtr();
    };
    this.DoToken = function () {
      if ($mod.TStepState.stArbitrary in this.FState) {
        this.FState = rtl.excludeSet(this.FState,$mod.TStepState.stArbitrary);
      };
      var $tmp = this.MaskPtr();
      if ($tmp === "!") {
        this.FState = rtl.includeSet(this.FState,$mod.TStepState.stLeading)}
       else if ($tmp === ">") {
        this.DoUpper()}
       else if ($tmp === "<") {
        this.DoLower()}
       else if ($tmp === "\\") {
        this.FState = rtl.includeSet(this.FState,$mod.TStepState.stSpecial)}
       else if ($tmp === "L") {
        this.DoAlpha(true)}
       else if ($tmp === "l") {
        this.DoAlpha(false)}
       else if ($tmp === "A") {
        this.DoAlphaNumeric(true)}
       else if ($tmp === "a") {
        this.DoAlphaNumeric(false)}
       else if ($tmp === "C") {
        this.DoArbitrary(true)}
       else if ($tmp === "c") {
        this.DoArbitrary(false)}
       else if ($tmp === "0") {
        this.DoNumeric(true)}
       else if ($tmp === "9") {
        this.DoNumeric(false)}
       else if ($tmp === "#") {
        this.DoNumericPlusMinus()}
       else if ($tmp === ":") {
        this.DoTime()}
       else if ($tmp === "/") this.DoDate();
    };
    this.DoTokenInputMask = function () {
      var $tmp = this.MaskPtr();
      if (($tmp === "!") || ($tmp === ">") || ($tmp === "<")) {}
      else if ($tmp === "\\") {
        this.FState = rtl.includeSet(this.FState,$mod.TStepState.stSpecial)}
       else if (($tmp === "L") || ($tmp === "l") || ($tmp === "A") || ($tmp === "a") || ($tmp === "C") || ($tmp === "c") || ($tmp === "0") || ($tmp === "9") || ($tmp === "#")) {
        this.FExitVal = this.FExitVal + this.FMissChar}
       else if ($tmp === ":") {
        this.DoTime()}
       else if ($tmp === "/") this.DoDate();
    };
    this.DoUpper = function () {
      if ($mod.TStepState.stLower in this.FState) {
        this.FState = rtl.excludeSet(this.FState,$mod.TStepState.stLower);
      } else {
        this.FState = rtl.includeSet(this.FState,$mod.TStepState.stUpper);
      };
      if ((this.FPosition > 1) && (this.FMask.charAt(this.FPosition - 1 - 1) === "<")) {
        this.FState = rtl.excludeSet(this.FState,$mod.TStepState.stLower);
        this.FState = rtl.excludeSet(this.FState,$mod.TStepState.stUpper);
      };
    };
    this.DoLower = function () {
      if ($mod.TStepState.stUpper in this.FState) {
        this.FState = rtl.excludeSet(this.FState,$mod.TStepState.stUpper);
      } else {
        this.FState = rtl.includeSet(this.FState,$mod.TStepState.stLower);
      };
    };
    this.DoNumeric = function (ARequired) {
      if (ARequired) {
        if ($impl.IsNumeric(this.SourcePtr())) {
          this.EvaluateExit();
        } else {
          this.RaiseError();
        };
      } else {
        if ($impl.IsNumeric(this.SourcePtr())) {
          this.EvaluateExit();
        } else {
          this.EvaluateMissing();
        };
      };
    };
    this.DoAlpha = function (ARequired) {
      if (ARequired) {
        if ($impl.IsAlpha(this.SourcePtr())) {
          this.EvaluateExit();
        } else {
          this.RaiseError();
        };
      } else {
        if ($impl.IsAlpha(this.SourcePtr())) {
          this.EvaluateExit();
        } else {
          this.EvaluateMissing();
        };
      };
    };
    this.DoAlphaNumeric = function (ARequired) {
      if (ARequired) {
        if ($impl.IsAlpha(this.SourcePtr()) || $impl.IsNumeric(this.SourcePtr())) {
          this.EvaluateExit();
        } else {
          this.RaiseError();
        };
      } else {
        if ($impl.IsAlpha(this.SourcePtr()) || $impl.IsNumeric(this.SourcePtr())) {
          this.EvaluateExit();
        } else {
          this.EvaluateMissing();
        };
      };
    };
    this.DoNumericPlusMinus = function () {
      if ($impl.IsNumeric(this.SourcePtr()) || (this.SourcePtr() === "+") || (this.SourcePtr() === "-")) {
        this.EvaluateExit();
      } else {
        this.EvaluateMissing();
      };
    };
    this.DoArbitrary = function (ARequired) {
      this.FState = rtl.includeSet(this.FState,$mod.TStepState.stArbitrary);
      if (ARequired) {
        if (this.FPosition > this.FSourceVal.length) {
          this.RaiseError();
        };
      } else {
        if (this.FPosition > this.FSourceVal.length) {
          this.EvaluateMissing();
        } else {
          this.EvaluateExit();
        };
      };
    };
    this.DoTime = function () {
      this.FExitVal = this.FExitVal + pas.SysUtils.TimeSeparator;
    };
    this.DoDate = function () {
      this.FExitVal = this.FExitVal + pas.SysUtils.DateSeparator;
    };
    this.GetInputMask = function () {
      var Result = "";
      this.FExitVal = "";
      this.FPosition = 1;
      this.FState = {};
      while (this.FPosition <= this.FMask.length) {
        if ($impl.IsToken(this.MaskPtr()) && !($mod.TStepState.stSpecial in this.FState)) {
          this.DoTokenInputMask();
        } else {
          this.DoLiteralInputMask();
        };
        this.FPosition += 1;
      };
      Result = this.FExitVal;
      return Result;
    };
    this.SetMask = function (AValue) {
      if (this.FEditMask !== AValue) {
        this.FEditMask = AValue;
        this.ExtractMask();
      };
    };
    this.SetValue = function (AValue) {
      if (this.FSourceVal !== AValue) {
        this.FSourceVal = AValue;
      };
    };
    this.RaiseError = function () {
      if (this.FSourcePosition > this.FSourceVal.length) {
        this.EvaluateMissing();
      } else {
        throw new Error(rtl.getResStr($mod,"exInvalidMaskValue"));
      };
    };
    this.ExtractMask = function () {
      var P = 0;
      var S = "";
      this.FMissChar = " ";
      this.FMatched = false;
      S = pas.System.Copy(this.FEditMask,1,this.FEditMask.length);
      P = S.lastIndexOf(";") + 1;
      if (P === 0) {
        this.FMask = S;
      } else {
        this.FMissChar = pas.System.Copy(S,P + 1,1).charAt(0);
        pas.System.Delete({get: function () {
            return S;
          }, set: function (v) {
            S = v;
          }},P,2);
        P = S.lastIndexOf(";") + 1;
        this.FMatched = pas.System.Copy(S,P + 1,1) !== "0";
        pas.System.Delete({get: function () {
            return S;
          }, set: function (v) {
            S = v;
          }},P,2);
        this.FMask = S;
      };
    };
    this.MaskPtr = function () {
      var Result = "\x00";
      Result = this.FMask.charAt(this.FPosition - 1);
      return Result;
    };
    this.SourcePtr = function () {
      var Result = "\x00";
      if (this.FSourcePosition <= this.FSourceVal.length) {
        Result = this.FSourceVal.charAt(this.FSourcePosition - 1);
      } else {
        Result = "\x00";
      };
      return Result;
    };
    this.ValidateInput = function () {
      var Result = "";
      this.FExitVal = "";
      this.FPosition = 1;
      this.FSourcePosition = 1;
      this.FState = {};
      while (this.FPosition <= this.FMask.length) {
        if ($impl.IsToken(this.MaskPtr()) && !($mod.TStepState.stSpecial in this.FState)) {
          this.DoToken();
        } else {
          this.DoLiteral();
        };
        this.FPosition += 1;
      };
      this.DoFillRest();
      Result = this.FExitVal;
      return Result;
    };
  });
  this.FormatMaskText = function (AEditMask, AValue) {
    var Result = "";
    var VMask = null;
    VMask = $mod.TMaskUtils.$create("Create");
    try {
      VMask.SetMask(AEditMask);
      VMask.SetValue(AValue);
      Result = VMask.ValidateInput();
    } finally {
      VMask = rtl.freeLoc(VMask);
    };
    return Result;
  };
  this.FormatMaskInput = function (AEditMask) {
    var Result = "";
    var VMask = null;
    VMask = $mod.TMaskUtils.$create("Create");
    try {
      VMask.SetMask(AEditMask);
      Result = VMask.ValidateInput();
    } finally {
      VMask = rtl.freeLoc(VMask);
    };
    return Result;
  };
  this.MaskDoFormatText = function (AEditMask, AValue, ABlank) {
    var Result = "";
    var VMask = null;
    VMask = $mod.TMaskUtils.$create("Create");
    try {
      VMask.SetMask(AEditMask);
      VMask.SetValue(AValue);
      VMask.FMatched = false;
      VMask.FMissChar = ABlank;
      Result = VMask.ValidateInput();
    } finally {
      VMask = rtl.freeLoc(VMask);
    };
    return Result;
  };
  $mod.$implcode = function () {
    $impl.IsNumeric = function (C) {
      var Result = false;
      Result = C.charCodeAt() in rtl.createSet(null,48,57);
      return Result;
    };
    $impl.IsAlpha = function (C) {
      var Result = false;
      Result = C.charCodeAt() in rtl.createSet(null,97,122,null,65,90);
      return Result;
    };
    $impl.IsToken = function (C) {
      var Result = false;
      Result = C.charCodeAt() in rtl.createSet(33,62,60,92,76,108,65,97,67,99,48,57,35,58,47,59);
      return Result;
    };
    $mod.$resourcestrings = {exInvalidMaskValue: {org: "FormatMaskText function failed!"}};
  };
},[]);
//# sourceMappingURL=maskutils.js.map
