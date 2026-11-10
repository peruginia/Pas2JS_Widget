rtl.module("TypInfo",["System","SysUtils","Types","RTLConsts","JS"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.TCallConv = {"0": "ccReg", ccReg: 0, "1": "ccCdecl", ccCdecl: 1, "2": "ccPascal", ccPascal: 2, "3": "ccStdCall", ccStdCall: 3, "4": "ccSafeCall", ccSafeCall: 4, "5": "ccCppdecl", ccCppdecl: 5, "6": "ccFar16", ccFar16: 6, "7": "ccOldFPCCall", ccOldFPCCall: 7, "8": "ccInternProc", ccInternProc: 8, "9": "ccSysCall", ccSysCall: 9, "10": "ccSoftFloat", ccSoftFloat: 10, "11": "ccMWPascal", ccMWPascal: 11};
  this.$rtti.$Enum("TCallConv",{minvalue: 0, maxvalue: 11, ordtype: 1, enumtype: this.TCallConv});
  this.$rtti.$ExtClass("TTypeInfoModule");
  this.$rtti.$ExtClass("TSectionRTTI",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "rtl.tSectionRTTI"});
  this.$rtti.$ExtClass("TTypeInfoModule",{jsclass: "Object"});
  this.$rtti.$inherited("TTypeInfoAttributes",pas.Types.$rtti["TJSValueDynArray"],{});
  this.$rtti.$ExtClass("TTypeInfo",{jsclass: "rtl.tTypeInfo"});
  this.$rtti.$ClassRef("TTypeInfoClassOf",{instancetype: this.$rtti["TTypeInfo"]});
  this.TOrdType = {"0": "otSByte", otSByte: 0, "1": "otUByte", otUByte: 1, "2": "otSWord", otSWord: 2, "3": "otUWord", otUWord: 3, "4": "otSLong", otSLong: 4, "5": "otULong", otULong: 5, "6": "otSIntDouble", otSIntDouble: 6, "7": "otUIntDouble", otUIntDouble: 7};
  this.$rtti.$Enum("TOrdType",{minvalue: 0, maxvalue: 7, ordtype: 1, enumtype: this.TOrdType});
  this.$rtti.$ExtClass("TTypeInfoInteger",{ancestor: this.$rtti["TTypeInfo"], jsclass: "rtl.tTypeInfoInteger"});
  this.$rtti.$ExtClass("TEnumType",{jsclass: "anonymous"});
  this.$rtti.$ExtClass("TTypeInfoEnum",{ancestor: this.$rtti["TTypeInfoInteger"], jsclass: "rtl.tTypeInfoEnum"});
  this.$rtti.$ExtClass("TTypeInfoSet",{ancestor: this.$rtti["TTypeInfo"], jsclass: "rtl.tTypeInfoSet"});
  this.$rtti.$ExtClass("TTypeInfoStaticArray",{ancestor: this.$rtti["TTypeInfo"], jsclass: "rtl.tTypeInfoStaticArray"});
  this.$rtti.$ExtClass("TTypeInfoDynArray",{ancestor: this.$rtti["TTypeInfo"], jsclass: "rtl.tTypeInfoDynArray"});
  this.TParamFlag = {"0": "pfVar", pfVar: 0, "1": "pfConst", pfConst: 1, "2": "pfOut", pfOut: 2, "3": "pfArray", pfArray: 3, "4": "pfAddress", pfAddress: 4, "5": "pfReference", pfReference: 5};
  this.$rtti.$Enum("TParamFlag",{minvalue: 0, maxvalue: 5, ordtype: 1, enumtype: this.TParamFlag});
  this.$rtti.$Set("TParamFlags",{comptype: this.$rtti["TParamFlag"]});
  this.$rtti.$ExtClass("TProcedureParam",{jsclass: "anonymous"});
  this.$rtti.$DynArray("TProcedureParams",{eltype: this.$rtti["TProcedureParam"]});
  this.TProcedureFlag = {"0": "pfStatic", pfStatic: 0, "1": "pfVarargs", pfVarargs: 1, "2": "pfExternal", pfExternal: 2, "3": "pfSafeCall", pfSafeCall: 3, "4": "pfAsync", pfAsync: 4};
  this.$rtti.$Enum("TProcedureFlag",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TProcedureFlag});
  this.$rtti.$Set("TProcedureFlags",{comptype: this.$rtti["TProcedureFlag"]});
  this.$rtti.$ExtClass("TProcedureSignature",{jsclass: "anonymous"});
  this.$rtti.$ExtClass("TTypeInfoProcVar",{ancestor: this.$rtti["TTypeInfo"], jsclass: "rtl.tTypeInfoProcVar"});
  this.$rtti.$ExtClass("TTypeInfoRefToProcVar",{ancestor: this.$rtti["TTypeInfoProcVar"], jsclass: "rtl.tTypeInfoRefToProcVar"});
  this.TMethodKind = {"0": "mkProcedure", mkProcedure: 0, "1": "mkFunction", mkFunction: 1, "2": "mkConstructor", mkConstructor: 2, "3": "mkDestructor", mkDestructor: 3, "4": "mkClassProcedure", mkClassProcedure: 4, "5": "mkClassFunction", mkClassFunction: 5};
  this.$rtti.$Enum("TMethodKind",{minvalue: 0, maxvalue: 5, ordtype: 1, enumtype: this.TMethodKind});
  this.$rtti.$Set("TMethodKinds",{comptype: this.$rtti["TMethodKind"]});
  this.$rtti.$ExtClass("TTypeInfoMethodVar",{ancestor: this.$rtti["TTypeInfoProcVar"], jsclass: "rtl.tTypeInfoMethodVar"});
  this.TTypeMemberKind = {"0": "tmkUnknown", tmkUnknown: 0, "1": "tmkField", tmkField: 1, "2": "tmkMethod", tmkMethod: 2, "3": "tmkProperty", tmkProperty: 3};
  this.$rtti.$Enum("TTypeMemberKind",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TTypeMemberKind});
  this.$rtti.$Set("TTypeMemberKinds",{comptype: this.$rtti["TTypeMemberKind"]});
  this.$rtti.$ExtClass("TTypeMember",{jsclass: "rtl.tTypeMember"});
  this.$rtti.$DynArray("TTypeMemberDynArray",{eltype: this.$rtti["TTypeMember"]});
  this.$rtti.$ExtClass("TTypeMemberField",{ancestor: this.$rtti["TTypeMember"], jsclass: "rtl.tTypeMemberField"});
  this.$rtti.$ExtClass("TTypeMemberMethod",{ancestor: this.$rtti["TTypeMember"], jsclass: "rtl.tTypeMemberMethod"});
  this.$rtti.$DynArray("TTypeMemberMethodDynArray",{eltype: this.$rtti["TTypeMemberMethod"]});
  this.pfGetFunction = 1;
  this.pfSetProcedure = 2;
  this.pfStoredFalse = 4;
  this.pfStoredField = 8;
  this.pfStoredFunction = 12;
  this.pfHasIndex = 16;
  this.$rtti.$ExtClass("TTypeMemberProperty",{ancestor: this.$rtti["TTypeMember"], jsclass: "rtl.tTypeMemberProperty"});
  this.$rtti.$DynArray("TTypeMemberPropertyDynArray",{eltype: this.$rtti["TTypeMemberProperty"]});
  this.$rtti.$ExtClass("TTypeMembers",{jsclass: "rtl.tTypeMembers"});
  this.$rtti.$ExtClass("TTypeInfoStruct",{ancestor: this.$rtti["TTypeInfo"], jsclass: "rtl.tTypeInfoStruct"});
  this.$rtti.$ExtClass("TTypeInfoRecord",{ancestor: this.$rtti["TTypeInfoStruct"], jsclass: "rtl.tTypeInfoRecord"});
  this.$rtti.$ExtClass("TTypeInfoClass",{ancestor: this.$rtti["TTypeInfoStruct"], jsclass: "rtl.tTypeInfoClass"});
  this.$rtti.$ExtClass("TTypeInfoExtClass",{ancestor: this.$rtti["TTypeInfo"], jsclass: "rtl.tTypeInfoExtClass"});
  this.$rtti.$ExtClass("TTypeInfoClassRef",{ancestor: this.$rtti["TTypeInfo"], jsclass: "rtl.tTypeInfoClassRef"});
  this.$rtti.$ExtClass("TTypeInfoPointer",{ancestor: this.$rtti["TTypeInfo"], jsclass: "rtl.tTypeInfoPointer"});
  this.$rtti.$ExtClass("TInterfaceInfo",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  this.$rtti.$ExtClass("TTypeInfoInterface",{ancestor: this.$rtti["TTypeInfoStruct"], jsclass: "rtl.tTypeInfoInterface"});
  this.$rtti.$ExtClass("TTypeInfoHelper",{ancestor: this.$rtti["TTypeInfoStruct"], jsclass: "rtl.tTypeInfoHelper"});
  this.$rtti.$ExtClass("TReferenceVariable",{jsclass: "Object"});
  this.$rtti.$ExtClass("TInterfaceObject",{ancestor: pas.JS.$rtti["TJSObject"], jsclass: "Object"});
  rtl.createClass(this,"EPropertyError",pas.SysUtils.Exception,function () {
  });
  this.GetTypeName = function (TypeInfo) {
    var Result = "";
    Result = TypeInfo.name;
    return Result;
  };
  this.GetClassMembers = function (aTIStruct) {
    var Result = [];
    var C = null;
    var i = 0;
    var PropName = "";
    var Names = null;
    Result = [];
    Names = new Object();
    C = aTIStruct;
    while (C !== null) {
      for (var $l = 0, $end = rtl.length(C.names) - 1; $l <= $end; $l++) {
        i = $l;
        PropName = C.names[i];
        if (Names.hasOwnProperty(PropName)) continue;
        Result.push(C.members[PropName]);
        Names[PropName] = true;
      };
      if (!rtl.isExt(C,rtl.tTypeInfoClass)) break;
      C = C.ancestor;
    };
    return Result;
  };
  this.GetClassMember = function (aTIStruct, aName) {
    var Result = null;
    var C = null;
    var i = 0;
    C = aTIStruct;
    while (C !== null) {
      if (C.members.hasOwnProperty(aName)) return C.members[aName];
      if (!rtl.isExt(C,rtl.tTypeInfoClass)) break;
      C = C.ancestor;
    };
    C = aTIStruct;
    while (C !== null) {
      for (var $l = 0, $end = rtl.length(C.names) - 1; $l <= $end; $l++) {
        i = $l;
        if (pas.SysUtils.CompareText(C.names[i],aName) === 0) return C.members[C.names[i]];
      };
      if (!rtl.isExt(C,rtl.tTypeInfoClass)) break;
      C = C.ancestor;
    };
    Result = null;
    return Result;
  };
  this.GetInstanceMethod = function (Instance, aName) {
    var Result = null;
    var TI = null;
    if (Instance === null) return null;
    TI = $mod.GetClassMember(Instance.$rtti,aName);
    if (!rtl.isExt(TI,rtl.tTypeMemberMethod)) return null;
    Result = rtl.createCallback(Instance,TI.name);
    return Result;
  };
  this.GetClassMethods = function (aTIStruct) {
    var Result = [];
    var C = null;
    var i = 0;
    var Cnt = 0;
    var j = 0;
    Cnt = 0;
    C = aTIStruct;
    while (C !== null) {
      Cnt += C.methods.length;
      if (!rtl.isExt(C,rtl.tTypeInfoClass)) break;
      C = C.ancestor;
    };
    Result = rtl.arraySetLength(Result,null,Cnt);
    C = aTIStruct;
    i = 0;
    while (C !== null) {
      for (var $l = 0, $end = C.methods.length - 1; $l <= $end; $l++) {
        j = $l;
        Result[i] = C.members[C.methods[j]];
        i += 1;
      };
      if (!rtl.isExt(C,rtl.tTypeInfoClass)) break;
      C = C.ancestor;
    };
    return Result;
  };
  this.GetInterfaceMembers = function (aTIInterface) {
    var Result = [];
    var Intf = null;
    var i = 0;
    var Cnt = 0;
    var j = 0;
    Cnt = 0;
    Intf = aTIInterface;
    while (Intf !== null) {
      Cnt += rtl.length(Intf.names);
      Intf = Intf.ancestor;
    };
    Result = rtl.arraySetLength(Result,null,Cnt);
    Intf = aTIInterface;
    i = 0;
    while (Intf !== null) {
      for (var $l = 0, $end = rtl.length(Intf.names) - 1; $l <= $end; $l++) {
        j = $l;
        Result[i] = Intf.members[Intf.names[j]];
        i += 1;
      };
      Intf = Intf.ancestor;
    };
    return Result;
  };
  this.GetInterfaceMember = function (aTIInterface, aName) {
    var Result = null;
    var Intf = null;
    var i = 0;
    Intf = aTIInterface;
    while (Intf !== null) {
      if (Intf.members.hasOwnProperty(aName)) return Intf.members[aName];
      Intf = Intf.ancestor;
    };
    Intf = aTIInterface;
    while (Intf !== null) {
      for (var $l = 0, $end = rtl.length(Intf.names) - 1; $l <= $end; $l++) {
        i = $l;
        if (pas.SysUtils.CompareText(Intf.names[i],aName) === 0) return Intf.members[Intf.names[i]];
      };
      Intf = Intf.ancestor;
    };
    Result = null;
    return Result;
  };
  this.GetInterfaceMethods = function (aTIInterface) {
    var Result = [];
    var Intf = null;
    var i = 0;
    var Cnt = 0;
    var j = 0;
    Cnt = 0;
    Intf = aTIInterface;
    while (Intf !== null) {
      Cnt += Intf.methods.length;
      Intf = Intf.ancestor;
    };
    Result = rtl.arraySetLength(Result,null,Cnt);
    Intf = aTIInterface;
    i = 0;
    while (Intf !== null) {
      for (var $l = 0, $end = Intf.methods.length - 1; $l <= $end; $l++) {
        j = $l;
        Result[i] = Intf.members[Intf.methods[j]];
        i += 1;
      };
      Intf = Intf.ancestor;
    };
    return Result;
  };
  this.GetRTTIAttributes = function (Attributes) {
    var Result = [];
    var i = 0;
    var len = 0;
    var AttrClass = null;
    var ProcName = "";
    var Attr = null;
    Result = [];
    if (Attributes == undefined) return Result;
    i = 0;
    len = rtl.length(Attributes);
    while (i < len) {
      AttrClass = rtl.getObject(Attributes[i]);
      i += 1;
      ProcName = "" + Attributes[i];
      i += 1;
      if ((i < len) && rtl.isArray(Attributes[i])) {
        Attr = AttrClass.$create(ProcName,Attributes[i]);
        i += 1;
      } else Attr = AttrClass.$create(ProcName);
      Result = rtl.arrayInsert(Attr,Result,rtl.length(Result));
    };
    return Result;
  };
  this.GetPropInfos = function (aTIStruct) {
    var Result = [];
    var C = null;
    var i = 0;
    var Names = null;
    var PropName = "";
    Result = [];
    C = aTIStruct;
    Names = new Object();
    while (C !== null) {
      for (var $l = 0, $end = C.properties.length - 1; $l <= $end; $l++) {
        i = $l;
        PropName = C.properties[i];
        if (Names.hasOwnProperty(PropName)) continue;
        Result.push(C.members[PropName]);
        Names[PropName] = true;
      };
      if (!rtl.isExt(C,rtl.tTypeInfoClass)) break;
      C = C.ancestor;
    };
    return Result;
  };
  this.GetPropList = function (aTIStruct, TypeKinds, Sorted) {
    var Result = [];
    function NameSort(a, b) {
      var Result = 0;
      if (a.name < b.name) {
        Result = -1}
       else if (a.name > b.name) {
        Result = 1}
       else Result = 0;
      return Result;
    };
    var C = null;
    var i = 0;
    var Names = null;
    var PropName = "";
    var Prop = null;
    Result = [];
    C = aTIStruct;
    Names = new Object();
    while (C !== null) {
      for (var $l = 0, $end = C.properties.length - 1; $l <= $end; $l++) {
        i = $l;
        PropName = C.properties[i];
        if (Names.hasOwnProperty(PropName)) continue;
        Prop = C.members[PropName];
        if (!(Prop.typeinfo.kind in TypeKinds)) continue;
        Result.push(Prop);
        Names[PropName] = true;
      };
      if (!rtl.isExt(C,rtl.tTypeInfoClass)) break;
      C = C.ancestor;
    };
    if (Sorted) Result.sort(NameSort);
    return Result;
  };
  this.GetPropList$1 = function (aTIStruct) {
    var Result = [];
    Result = $mod.GetPropInfos(aTIStruct);
    return Result;
  };
  this.GetPropList$2 = function (AClass) {
    var Result = [];
    Result = $mod.GetPropInfos(AClass.$rtti);
    return Result;
  };
  this.GetPropList$3 = function (Instance) {
    var Result = [];
    Result = $mod.GetPropList$2(Instance.$class.ClassType());
    return Result;
  };
  this.GetPropInfo = function (TI, PropName) {
    var Result = null;
    var m = null;
    var i = 0;
    var C = null;
    C = TI;
    while (C !== null) {
      m = C.members[PropName];
      if (rtl.isExt(m,rtl.tTypeMemberProperty)) return m;
      if (!rtl.isExt(C,rtl.tTypeInfoClass)) break;
      C = C.ancestor;
    };
    Result = null;
    do {
      for (var $l = 0, $end = TI.properties.length - 1; $l <= $end; $l++) {
        i = $l;
        if (pas.SysUtils.CompareText(PropName,TI.properties[i]) === 0) {
          m = TI.members[TI.properties[i]];
          if (rtl.isExt(m,rtl.tTypeMemberProperty)) Result = m;
          return Result;
        };
      };
      if (!rtl.isExt(TI,rtl.tTypeInfoClass)) break;
      TI = TI.ancestor;
    } while (!(TI === null));
    return Result;
  };
  this.GetPropInfo$1 = function (TI, PropName, Kinds) {
    var Result = null;
    Result = $mod.GetPropInfo(TI,PropName);
    if (rtl.neSet(Kinds,{}) && (Result !== null) && !(Result.typeinfo.kind in Kinds)) Result = null;
    return Result;
  };
  this.GetPropInfo$2 = function (Instance, PropName) {
    var Result = null;
    Result = $mod.GetPropInfo$1(Instance.$rtti,PropName,{});
    return Result;
  };
  this.GetPropInfo$3 = function (Instance, PropName, Kinds) {
    var Result = null;
    Result = $mod.GetPropInfo$1(Instance.$rtti,PropName,Kinds);
    return Result;
  };
  this.GetPropInfo$4 = function (aClass, PropName) {
    var Result = null;
    Result = $mod.GetPropInfo$1(aClass.$rtti,PropName,{});
    return Result;
  };
  this.GetPropInfo$5 = function (aClass, PropName, Kinds) {
    var Result = null;
    Result = $mod.GetPropInfo$1(aClass.$rtti,PropName,Kinds);
    return Result;
  };
  this.FindPropInfo = function (Instance, PropName) {
    var Result = null;
    Result = $mod.GetPropInfo(Instance.$rtti,PropName);
    if (Result === null) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrPropertyNotFound"),pas.System.VarRecs(18,PropName)]);
    return Result;
  };
  this.FindPropInfo$1 = function (Instance, PropName, Kinds) {
    var Result = null;
    Result = $mod.GetPropInfo$1(Instance.$rtti,PropName,Kinds);
    if (Result === null) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrPropertyNotFound"),pas.System.VarRecs(18,PropName)]);
    return Result;
  };
  this.FindPropInfo$2 = function (aClass, PropName) {
    var Result = null;
    Result = $mod.GetPropInfo(aClass.$rtti,PropName);
    if (Result === null) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrPropertyNotFound"),pas.System.VarRecs(18,PropName)]);
    return Result;
  };
  this.FindPropInfo$3 = function (aClass, PropName, Kinds) {
    var Result = null;
    Result = $mod.GetPropInfo$1(aClass.$rtti,PropName,Kinds);
    if (Result === null) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrPropertyNotFound"),pas.System.VarRecs(18,PropName)]);
    return Result;
  };
  this.IsStoredProp = function (Instance, PropInfo) {
    var Result = false;
    var $tmp = PropInfo.flags & 12;
    if ($tmp === 0) {
      Result = true}
     else if ($tmp === 4) {
      Result = false}
     else if ($tmp === 8) {
      Result = !(Instance[PropInfo.stored] == false)}
     else {
      Result = Instance[PropInfo.stored]();
    };
    return Result;
  };
  this.IsStoredProp$1 = function (Instance, PropName) {
    var Result = false;
    Result = $mod.IsStoredProp(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.IsPublishedProp = function (Instance, PropName) {
    var Result = false;
    Result = $mod.GetPropInfo$2(Instance,PropName) !== null;
    return Result;
  };
  this.IsPublishedProp$1 = function (aClass, PropName) {
    var Result = false;
    Result = $mod.GetPropInfo$4(aClass,PropName) !== null;
    return Result;
  };
  this.PropType = function (Instance, PropName) {
    var Result = 0;
    Result = $mod.FindPropInfo(Instance,PropName).typeinfo.kind;
    return Result;
  };
  this.PropType$1 = function (aClass, PropName) {
    var Result = 0;
    Result = $mod.FindPropInfo$2(aClass,PropName).typeinfo.kind;
    return Result;
  };
  this.PropIsType = function (Instance, PropName, TypeKind) {
    var Result = false;
    Result = $mod.PropType(Instance,PropName) === TypeKind;
    return Result;
  };
  this.PropIsType$1 = function (aClass, PropName, TypeKind) {
    var Result = false;
    Result = $mod.PropType$1(aClass,PropName) === TypeKind;
    return Result;
  };
  this.GetJSValueProp = function (Instance, TI, PropName) {
    var Result = undefined;
    var PropInfo = null;
    PropInfo = $mod.GetPropInfo(TI,PropName);
    if (PropInfo === null) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrPropertyNotFound"),pas.System.VarRecs(18,PropName)]);
    Result = $mod.GetJSValueProp$1(Instance,PropInfo);
    return Result;
  };
  this.GetJSValueProp$1 = function (Instance, PropInfo) {
    var Result = undefined;
    var gk = 0;
    gk = $impl.GetPropGetterKind(PropInfo);
    var $tmp = gk;
    if ($tmp === $impl.TGetterKind.gkNone) {
      throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SCantReadPropertyS"),pas.System.VarRecs(18,PropInfo.name)])}
     else if ($tmp === $impl.TGetterKind.gkField) {
      Result = Instance[PropInfo.getter]}
     else if ($tmp === $impl.TGetterKind.gkFunction) {
      if ((16 & PropInfo.flags) > 0) {
        Result = Instance[PropInfo.getter](PropInfo.index)}
       else Result = Instance[PropInfo.getter]()}
     else if ($tmp === $impl.TGetterKind.gkFunctionWithParams) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SIndexedPropertyNeedsParams"),pas.System.VarRecs(18,PropInfo.name)]);
    return Result;
  };
  this.GetJSValueProp$2 = function (Instance, PropName) {
    var Result = undefined;
    Result = $mod.GetJSValueProp$3(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetJSValueProp$3 = function (Instance, PropInfo) {
    var Result = undefined;
    Result = $mod.GetJSValueProp$1(Instance,PropInfo);
    return Result;
  };
  this.SetJSValueProp = function (Instance, TI, PropName, Value) {
    var PropInfo = null;
    PropInfo = $mod.GetPropInfo(TI,PropName);
    if (PropInfo === null) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrPropertyNotFound"),pas.System.VarRecs(18,PropName)]);
    $mod.SetJSValueProp$1(Instance,PropInfo,Value);
  };
  this.SetJSValueProp$1 = function (Instance, PropInfo, Value) {
    var sk = 0;
    sk = $impl.GetPropSetterKind(PropInfo);
    var $tmp = sk;
    if ($tmp === $impl.TSetterKind.skNone) {
      throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SCantWritePropertyS"),pas.System.VarRecs(18,PropInfo.name)])}
     else if ($tmp === $impl.TSetterKind.skField) {
      Instance[PropInfo.setter] = Value}
     else if ($tmp === $impl.TSetterKind.skProcedure) {
      if ((16 & PropInfo.flags) > 0) {
        Instance[PropInfo.setter](PropInfo.index,Value)}
       else Instance[PropInfo.setter](Value)}
     else if ($tmp === $impl.TSetterKind.skProcedureWithParams) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SIndexedPropertyNeedsParams"),pas.System.VarRecs(18,PropInfo.name)]);
  };
  this.SetJSValueProp$2 = function (Instance, PropName, Value) {
    $mod.SetJSValueProp$3(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetJSValueProp$3 = function (Instance, PropInfo, Value) {
    $mod.SetJSValueProp$1(Instance,PropInfo,Value);
  };
  this.GetNativeIntProp = function (Instance, PropName) {
    var Result = 0;
    Result = $mod.GetNativeIntProp$1(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetNativeIntProp$1 = function (Instance, PropInfo) {
    var Result = 0;
    Result = rtl.trunc($mod.GetJSValueProp$3(Instance,PropInfo));
    return Result;
  };
  this.SetNativeIntProp = function (Instance, PropName, Value) {
    $mod.SetJSValueProp$3(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetNativeIntProp$1 = function (Instance, PropInfo, Value) {
    $mod.SetJSValueProp$3(Instance,PropInfo,Value);
  };
  this.GetOrdProp = function (Instance, PropName) {
    var Result = 0;
    Result = $mod.GetOrdProp$1(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetOrdProp$1 = function (Instance, PropInfo) {
    var Result = 0;
    var o = null;
    var Key = "";
    var n = 0;
    var v = undefined;
    if (PropInfo.typeinfo.kind === pas.System.TTypeKind.tkSet) {
      o = $mod.GetJSValueProp$3(Instance,PropInfo);
      Result = 0;
      for (Key in o) {
        n = parseInt(Key,10);
        if (n < 32) Result = Result + (1 << n);
      };
    } else if (PropInfo.typeinfo.kind === pas.System.TTypeKind.tkChar) {
      v = $mod.GetJSValueProp$3(Instance,PropInfo);
      if (rtl.isNumber(v)) {
        Result = rtl.trunc(v)}
       else {
        Key = "" + v;
        if (Key === "") {
          Result = 0}
         else Result = Key.charCodeAt(0);
      };
    } else Result = rtl.trunc($mod.GetJSValueProp$3(Instance,PropInfo));
    return Result;
  };
  this.SetOrdProp = function (Instance, PropName, Value) {
    $mod.SetOrdProp$1(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetOrdProp$1 = function (Instance, PropInfo, Value) {
    var o = null;
    var i = 0;
    if (PropInfo.typeinfo.kind === pas.System.TTypeKind.tkSet) {
      o = new Object();
      for (i = 0; i <= 31; i++) if (((1 << i) & Value) > 0) o["" + i] = true;
      $mod.SetJSValueProp$3(Instance,PropInfo,o);
    } else if (PropInfo.typeinfo.kind === pas.System.TTypeKind.tkChar) {
      $mod.SetJSValueProp$3(Instance,PropInfo,String.fromCharCode(Value))}
     else $mod.SetJSValueProp$3(Instance,PropInfo,Value);
  };
  this.GetEnumProp = function (Instance, PropName) {
    var Result = "";
    Result = $mod.GetEnumProp$1(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetEnumProp$1 = function (Instance, PropInfo) {
    var Result = "";
    var n = 0;
    var TIEnum = null;
    TIEnum = rtl.asExt(PropInfo.typeinfo,rtl.tTypeInfoEnum);
    n = rtl.trunc($mod.GetJSValueProp$3(Instance,PropInfo));
    if ((n >= TIEnum.minvalue) && (n <= TIEnum.maxvalue)) {
      Result = TIEnum.enumtype[n]}
     else Result = "" + n;
    return Result;
  };
  this.SetEnumProp = function (Instance, PropName, Value) {
    $mod.SetEnumProp$1(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetEnumProp$1 = function (Instance, PropInfo, Value) {
    var TIEnum = null;
    var n = 0;
    TIEnum = rtl.asExt(PropInfo.typeinfo,rtl.tTypeInfoEnum);
    n = TIEnum.enumtype[Value];
    if (!pas.JS.isUndefined(n)) $mod.SetJSValueProp$3(Instance,PropInfo,n);
  };
  this.GetEnumName = function (TypeInfo, Value) {
    var Result = "";
    Result = TypeInfo.enumtype[Value];
    return Result;
  };
  this.GetEnumValue = function (TypeInfo, Name) {
    var Result = 0;
    Result = TypeInfo.enumtype[Name];
    return Result;
  };
  this.GetEnumNameCount = function (TypeInfo) {
    var Result = 0;
    var o = null;
    var l = 0;
    var r = 0;
    o = TypeInfo.enumtype;
    Result = 1;
    while (o.hasOwnProperty("" + Result)) Result = Result * 2;
    l = rtl.trunc(Result / 2);
    r = Result;
    while (l <= r) {
      Result = rtl.trunc((l + r) / 2);
      if (o.hasOwnProperty("" + Result)) {
        l = Result + 1}
       else r = Result - 1;
    };
    if (o.hasOwnProperty("" + Result)) Result += 1;
    return Result;
  };
  this.GetSetProp = function (Instance, PropName) {
    var Result = "";
    Result = $mod.GetSetProp$1(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetSetProp$1 = function (Instance, PropInfo) {
    var Result = "";
    var o = null;
    var key = "";
    var Value = "";
    var n = 0;
    var TIEnum = null;
    var TISet = null;
    Result = "";
    TISet = rtl.asExt(PropInfo.typeinfo,rtl.tTypeInfoSet);
    TIEnum = null;
    if (rtl.isExt(TISet.comptype,rtl.tTypeInfoEnum)) TIEnum = TISet.comptype;
    o = $mod.GetJSValueProp$3(Instance,PropInfo);
    for (key in o) {
      n = parseInt(key,10);
      if ((TIEnum !== null) && (n >= TIEnum.minvalue) && (n <= TIEnum.maxvalue)) {
        Value = TIEnum.enumtype[n]}
       else Value = "" + n;
      if (Result !== "") Result = Result + ",";
      Result = Result + Value;
    };
    Result = "[" + Result + "]";
    return Result;
  };
  this.GetSetPropArray = function (Instance, PropName) {
    var Result = [];
    Result = $mod.GetSetPropArray$1(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetSetPropArray$1 = function (Instance, PropInfo) {
    var Result = [];
    var o = null;
    var Key = "";
    Result = [];
    o = $mod.GetJSValueProp$3(Instance,PropInfo);
    for (Key in o) Result.push(parseInt(Key,10));
    return Result;
  };
  this.SetSetPropArray = function (Instance, PropName, Arr) {
    $mod.SetSetPropArray$1(Instance,$mod.FindPropInfo(Instance,PropName),Arr);
  };
  this.SetSetPropArray$1 = function (Instance, PropInfo, Arr) {
    var o = null;
    var i = 0;
    o = new Object();
    for (var $in = Arr, $l = 0, $end = rtl.length($in) - 1; $l <= $end; $l++) {
      i = $in[$l];
      o["" + i] = true;
    };
    $mod.SetJSValueProp$3(Instance,PropInfo,o);
  };
  this.GetBoolProp = function (Instance, PropName) {
    var Result = false;
    Result = $mod.GetBoolProp$1(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetBoolProp$1 = function (Instance, PropInfo) {
    var Result = false;
    Result = !($mod.GetJSValueProp$3(Instance,PropInfo) == false);
    return Result;
  };
  this.SetBoolProp = function (Instance, PropName, Value) {
    $mod.SetBoolProp$1(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetBoolProp$1 = function (Instance, PropInfo, Value) {
    $mod.SetJSValueProp$3(Instance,PropInfo,Value);
  };
  this.GetStrProp = function (Instance, PropName) {
    var Result = "";
    Result = $mod.GetStrProp$1(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetStrProp$1 = function (Instance, PropInfo) {
    var Result = "";
    Result = "" + $mod.GetJSValueProp$3(Instance,PropInfo);
    return Result;
  };
  this.SetStrProp = function (Instance, PropName, Value) {
    $mod.SetStrProp$1(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetStrProp$1 = function (Instance, PropInfo, Value) {
    $mod.SetJSValueProp$3(Instance,PropInfo,Value);
  };
  this.GetStringProp = function (Instance, PropName) {
    var Result = "";
    Result = $mod.GetStrProp(Instance,PropName);
    return Result;
  };
  this.GetStringProp$1 = function (Instance, PropInfo) {
    var Result = "";
    Result = $mod.GetStrProp$1(Instance,PropInfo);
    return Result;
  };
  this.SetStringProp = function (Instance, PropName, Value) {
    $mod.SetStrProp(Instance,PropName,Value);
  };
  this.SetStringProp$1 = function (Instance, PropInfo, Value) {
    $mod.SetStrProp$1(Instance,PropInfo,Value);
  };
  this.GetFloatProp = function (Instance, PropName) {
    var Result = 0.0;
    Result = $mod.GetFloatProp$1(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetFloatProp$1 = function (Instance, PropInfo) {
    var Result = 0.0;
    Result = rtl.getNumber($mod.GetJSValueProp$3(Instance,PropInfo));
    return Result;
  };
  this.SetFloatProp = function (Instance, PropName, Value) {
    $mod.SetFloatProp$1(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetFloatProp$1 = function (Instance, PropInfo, Value) {
    $mod.SetJSValueProp$3(Instance,PropInfo,Value);
  };
  this.GetObjectProp = function (Instance, PropName) {
    var Result = null;
    Result = $mod.GetObjectProp$2(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetObjectProp$1 = function (Instance, PropName, MinClass) {
    var Result = null;
    Result = $mod.GetObjectProp$2(Instance,$mod.FindPropInfo(Instance,PropName));
    if ((MinClass !== null) && (Result !== null)) if (!Result.$class.InheritsFrom(MinClass)) Result = null;
    return Result;
  };
  this.GetObjectProp$2 = function (Instance, PropInfo) {
    var Result = null;
    Result = $mod.GetObjectProp$3(Instance,PropInfo,null);
    return Result;
  };
  this.GetObjectProp$3 = function (Instance, PropInfo, MinClass) {
    var Result = null;
    var O = null;
    O = rtl.getObject($mod.GetJSValueProp$3(Instance,PropInfo));
    if ((MinClass !== null) && !O.$class.InheritsFrom(MinClass)) {
      Result = null}
     else Result = O;
    return Result;
  };
  this.SetObjectProp = function (Instance, PropName, Value) {
    $mod.SetObjectProp$1(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetObjectProp$1 = function (Instance, PropInfo, Value) {
    $mod.SetJSValueProp$3(Instance,PropInfo,Value);
  };
  this.GetMethodProp = function (Instance, PropInfo) {
    var Result = pas.System.TMethod.$new();
    var v = undefined;
    var fn = undefined;
    Result.Code = null;
    Result.Data = null;
    v = $mod.GetJSValueProp$3(Instance,PropInfo);
    if (!rtl.isFunction(v)) return Result;
    Result.Data = v["scope"];
    fn = v["fn"];
    if (rtl.isString(fn)) {
      if (Result.Data !== null) {
        Result.Code = Result.Data["" + fn]}
       else Result.Code = v;
    } else Result.Code = fn;
    return Result;
  };
  this.GetMethodProp$1 = function (Instance, PropName) {
    var Result = pas.System.TMethod.$new();
    Result.$assign($mod.GetMethodProp(Instance,$mod.FindPropInfo(Instance,PropName)));
    return Result;
  };
  this.SetMethodProp = function (Instance, PropInfo, Value) {
    var cb = null;
    var Code = null;
    Code = Value.Code;
    if (Code === null) {
      cb = null}
     else if (rtl.isFunction(Code)) {
      if ((Code["scope"] === Value.Data) && (rtl.isFunction(Code["fn"]) || rtl.isString(Code["fn"]))) {
        cb = Code;
      } else if (rtl.isString(Code["fn"])) {
        cb = rtl.createCallback(Value.Data,"" + Code["fn"])}
       else cb = rtl.createCallback(Value.Data,Code);
    } else cb = rtl.createCallback(Value.Data,Code);
    $mod.SetJSValueProp$3(Instance,PropInfo,cb);
  };
  this.SetMethodProp$1 = function (Instance, PropName, Value) {
    $mod.SetMethodProp(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.GetInterfaceProp = function (Instance, PropName) {
    var Result = null;
    var $ok = false;
    try {
      Result = rtl.setIntfL(Result,$mod.GetInterfaceProp$1(Instance,$mod.FindPropInfo(Instance,PropName)),true);
      $ok = true;
    } finally {
      if (!$ok) rtl._Release(Result);
    };
    return Result;
  };
  this.GetInterfaceProp$1 = function (Instance, PropInfo) {
    var Result = null;
    var gk = 0;
    var $ok = false;
    try {
      if (PropInfo.typeinfo.kind !== pas.System.TTypeKind.tkInterface) throw pas.SysUtils.Exception.$create("Create$1",["Cannot get RAW interface from IInterface interface"]);
      gk = $impl.GetPropGetterKind(PropInfo);
      var $tmp = gk;
      if ($tmp === $impl.TGetterKind.gkNone) {
        throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SCantReadPropertyS"),pas.System.VarRecs(18,PropInfo.name)])}
       else if ($tmp === $impl.TGetterKind.gkField) {
        Result = rtl.setIntfL(Result,rtl.getObject(Instance[PropInfo.getter]))}
       else if ($tmp === $impl.TGetterKind.gkFunction) {
        if ((16 & PropInfo.flags) > 0) {
          Result = rtl.setIntfL(Result,Instance[PropInfo.getter](PropInfo.index),true)}
         else Result = rtl.setIntfL(Result,Instance[PropInfo.getter](),true)}
       else if ($tmp === $impl.TGetterKind.gkFunctionWithParams) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SIndexedPropertyNeedsParams"),pas.System.VarRecs(18,PropInfo.name)]);
      $ok = true;
    } finally {
      if (!$ok) rtl._Release(Result);
    };
    return Result;
  };
  this.SetInterfaceProp = function (Instance, PropName, Value) {
    $mod.SetInterfaceProp$1(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetInterfaceProp$1 = function (Instance, PropInfo, Value) {
    var sk = 0;
    var Setter = "";
    if (PropInfo.typeinfo.kind !== pas.System.TTypeKind.tkInterface) throw pas.SysUtils.Exception.$create("Create$1",["Cannot set RAW interface from IInterface interface"]);
    sk = $impl.GetPropSetterKind(PropInfo);
    Setter = PropInfo.setter;
    var $tmp = sk;
    if ($tmp === $impl.TSetterKind.skNone) {
      throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SCantWritePropertyS"),pas.System.VarRecs(18,PropInfo.name)])}
     else if ($tmp === $impl.TSetterKind.skField) {
      rtl.setIntfP(Instance,Setter,Value)}
     else if ($tmp === $impl.TSetterKind.skProcedure) {
      if ((16 & PropInfo.flags) > 0) {
        Instance[Setter](PropInfo.index,Value)}
       else Instance[Setter](Value)}
     else if ($tmp === $impl.TSetterKind.skProcedureWithParams) throw $mod.EPropertyError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SIndexedPropertyNeedsParams"),pas.System.VarRecs(18,PropInfo.name)]);
  };
  this.GetRawInterfaceProp = function (Instance, PropName) {
    var Result = null;
    Result = $mod.GetRawInterfaceProp$1(Instance,$mod.FindPropInfo(Instance,PropName));
    return Result;
  };
  this.GetRawInterfaceProp$1 = function (Instance, PropInfo) {
    var Result = null;
    Result = $mod.GetJSValueProp$3(Instance,PropInfo);
    return Result;
  };
  this.SetRawInterfaceProp = function (Instance, PropName, Value) {
    $mod.SetRawInterfaceProp$1(Instance,$mod.FindPropInfo(Instance,PropName),Value);
  };
  this.SetRawInterfaceProp$1 = function (Instance, PropInfo, Value) {
    $mod.SetJSValueProp$3(Instance,PropInfo,Value);
  };
  $mod.$implcode = function () {
    $mod.$rtti.$ExtClass("TCreatorAttribute",{jsclass: "attr"});
    $mod.$rtti.$ClassRef("TCreatorAttributeClass",{instancetype: $mod.$rtti["TCreatorAttribute"]});
    $impl.TGetterKind = {"0": "gkNone", gkNone: 0, "1": "gkField", gkField: 1, "2": "gkFunction", gkFunction: 2, "3": "gkFunctionWithParams", gkFunctionWithParams: 3};
    $mod.$rtti.$Enum("TGetterKind",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: $impl.TGetterKind});
    $impl.GetPropGetterKind = function (PropInfo) {
      var Result = 0;
      if (PropInfo.getter === "") {
        Result = $impl.TGetterKind.gkNone}
       else if ((1 & PropInfo.flags) > 0) {
        if (rtl.length(PropInfo.params) > 0) {
          Result = $impl.TGetterKind.gkFunctionWithParams}
         else Result = $impl.TGetterKind.gkFunction;
      } else Result = $impl.TGetterKind.gkField;
      return Result;
    };
    $impl.TSetterKind = {"0": "skNone", skNone: 0, "1": "skField", skField: 1, "2": "skProcedure", skProcedure: 2, "3": "skProcedureWithParams", skProcedureWithParams: 3};
    $mod.$rtti.$Enum("TSetterKind",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: $impl.TSetterKind});
    $impl.GetPropSetterKind = function (PropInfo) {
      var Result = 0;
      if (PropInfo.setter === "") {
        Result = $impl.TSetterKind.skNone}
       else if ((2 & PropInfo.flags) > 0) {
        if (rtl.length(PropInfo.params) > 0) {
          Result = $impl.TSetterKind.skProcedureWithParams}
         else Result = $impl.TSetterKind.skProcedure;
      } else Result = $impl.TSetterKind.skField;
      return Result;
    };
  };
},[]);
//# sourceMappingURL=typinfo.js.map
