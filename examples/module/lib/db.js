rtl.module("DB",["System","Classes","SysUtils","JS","Types","DateUtils"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.dsMaxBufferCount = rtl.trunc(2147483647 / 8);
  this.dsMaxStringSize = 8192;
  this.$rtti.$StaticArray("YesNoChars$a",{dims: [2], eltype: rtl.char});
  this.YesNoChars = ["N","Y"];
  this.SQLDelimiterCharacters = rtl.createSet(59,44,32,40,41,13,10,9);
  this.TDataSetState = {"0": "dsInactive", dsInactive: 0, "1": "dsBrowse", dsBrowse: 1, "2": "dsEdit", dsEdit: 2, "3": "dsInsert", dsInsert: 3, "4": "dsSetKey", dsSetKey: 4, "5": "dsCalcFields", dsCalcFields: 5, "6": "dsFilter", dsFilter: 6, "7": "dsNewValue", dsNewValue: 7, "8": "dsOldValue", dsOldValue: 8, "9": "dsCurValue", dsCurValue: 9, "10": "dsBlockRead", dsBlockRead: 10, "11": "dsInternalCalc", dsInternalCalc: 11, "12": "dsOpening", dsOpening: 12, "13": "dsRefreshFields", dsRefreshFields: 13};
  this.$rtti.$Enum("TDataSetState",{minvalue: 0, maxvalue: 13, ordtype: 1, enumtype: this.TDataSetState});
  this.TDataEvent = {"0": "deFieldChange", deFieldChange: 0, "1": "deRecordChange", deRecordChange: 1, "2": "deDataSetChange", deDataSetChange: 2, "3": "deDataSetScroll", deDataSetScroll: 3, "4": "deLayoutChange", deLayoutChange: 4, "5": "deUpdateRecord", deUpdateRecord: 5, "6": "deUpdateState", deUpdateState: 6, "7": "deCheckBrowseMode", deCheckBrowseMode: 7, "8": "dePropertyChange", dePropertyChange: 8, "9": "deFieldListChange", deFieldListChange: 9, "10": "deFocusControl", deFocusControl: 10, "11": "deParentScroll", deParentScroll: 11, "12": "deConnectChange", deConnectChange: 12, "13": "deReconcileError", deReconcileError: 13, "14": "deDisabledStateChange", deDisabledStateChange: 14};
  this.$rtti.$Enum("TDataEvent",{minvalue: 0, maxvalue: 14, ordtype: 1, enumtype: this.TDataEvent});
  this.TUpdateStatus = {"0": "usModified", usModified: 0, "1": "usInserted", usInserted: 1, "2": "usDeleted", usDeleted: 2};
  this.$rtti.$Enum("TUpdateStatus",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TUpdateStatus});
  this.$rtti.$Set("TUpdateStatusSet",{comptype: this.$rtti["TUpdateStatus"]});
  this.TResolveStatus = {"0": "rsUnresolved", rsUnresolved: 0, "1": "rsResolving", rsResolving: 1, "2": "rsResolved", rsResolved: 2, "3": "rsResolveFailed", rsResolveFailed: 3};
  this.$rtti.$Enum("TResolveStatus",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TResolveStatus});
  this.$rtti.$Set("TResolveStatusSet",{comptype: this.$rtti["TResolveStatus"]});
  this.TUpdateMode = {"0": "upWhereAll", upWhereAll: 0, "1": "upWhereChanged", upWhereChanged: 1, "2": "upWhereKeyOnly", upWhereKeyOnly: 2};
  this.$rtti.$Enum("TUpdateMode",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TUpdateMode});
  this.TResolverResponse = {"0": "rrSkip", rrSkip: 0, "1": "rrAbort", rrAbort: 1, "2": "rrMerge", rrMerge: 2, "3": "rrApply", rrApply: 3, "4": "rrIgnore", rrIgnore: 4};
  this.$rtti.$Enum("TResolverResponse",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TResolverResponse});
  this.TProviderFlag = {"0": "pfInUpdate", pfInUpdate: 0, "1": "pfInWhere", pfInWhere: 1, "2": "pfInKey", pfInKey: 2, "3": "pfHidden", pfHidden: 3, "4": "pfRefreshOnInsert", pfRefreshOnInsert: 4, "5": "pfRefreshOnUpdate", pfRefreshOnUpdate: 5};
  this.$rtti.$Enum("TProviderFlag",{minvalue: 0, maxvalue: 5, ordtype: 1, enumtype: this.TProviderFlag});
  this.$rtti.$Set("TProviderFlags",{comptype: this.$rtti["TProviderFlag"]});
  this.$rtti.$Class("TFieldDef");
  this.$rtti.$Class("TFieldDefs");
  this.$rtti.$Class("TField");
  this.$rtti.$Class("TFields");
  this.$rtti.$Class("TDataSet");
  this.$rtti.$Class("TDataSource");
  this.$rtti.$Class("TDataLink");
  this.$rtti.$Class("TDataProxy");
  this.$rtti.$Class("TDataRequest");
  this.$rtti.$Class("TRecordUpdateDescriptor");
  this.$rtti.$Class("TRecordUpdateDescriptorList");
  this.$rtti.$Class("TRecordUpdateBatch");
  rtl.createClass(this,"EDatabaseError",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"EUpdateError",this.EDatabaseError,function () {
    this.$init = function () {
      $mod.EDatabaseError.$init.call(this);
      this.FContext = "";
      this.FErrorCode = 0;
      this.FOriginalException = null;
      this.FPreviousError = 0;
    };
    this.$final = function () {
      this.FOriginalException = undefined;
      $mod.EDatabaseError.$final.call(this);
    };
    this.Create$2 = function (NativeError, Context, ErrCode, PrevError, E) {
      pas.SysUtils.Exception.CreateFmt.call(this,NativeError,pas.System.VarRecs(18,Context));
      this.FContext = Context;
      this.FErrorCode = ErrCode;
      this.FPreviousError = PrevError;
      this.FOriginalException = E;
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FOriginalException");
      pas.System.TObject.Destroy.call(this);
    };
  });
  this.$rtti.$ClassRef("TFieldClass",{instancetype: this.$rtti["TField"]});
  this.TFieldType = {"0": "ftUnknown", ftUnknown: 0, "1": "ftString", ftString: 1, "2": "ftInteger", ftInteger: 2, "3": "ftLargeInt", ftLargeInt: 3, "4": "ftBoolean", ftBoolean: 4, "5": "ftFloat", ftFloat: 5, "6": "ftDate", ftDate: 6, "7": "ftTime", ftTime: 7, "8": "ftDateTime", ftDateTime: 8, "9": "ftAutoInc", ftAutoInc: 9, "10": "ftBlob", ftBlob: 10, "11": "ftMemo", ftMemo: 11, "12": "ftFixedChar", ftFixedChar: 12, "13": "ftVariant", ftVariant: 13, "14": "ftDataset", ftDataset: 14};
  this.$rtti.$Enum("TFieldType",{minvalue: 0, maxvalue: 14, ordtype: 1, enumtype: this.TFieldType});
  this.TFieldAttribute = {"0": "faHiddenCol", faHiddenCol: 0, "1": "faReadonly", faReadonly: 1, "2": "faRequired", faRequired: 2, "3": "faLink", faLink: 3, "4": "faUnNamed", faUnNamed: 4, "5": "faFixed", faFixed: 5};
  this.$rtti.$Enum("TFieldAttribute",{minvalue: 0, maxvalue: 5, ordtype: 1, enumtype: this.TFieldAttribute});
  this.$rtti.$Set("TFieldAttributes",{comptype: this.$rtti["TFieldAttribute"]});
  rtl.createClass(this,"TNamedItem",pas.Classes.TCollectionItem,function () {
    this.$init = function () {
      pas.Classes.TCollectionItem.$init.call(this);
      this.FName = "";
    };
    this.GetDisplayName = function () {
      var Result = "";
      Result = this.FName;
      return Result;
    };
    this.SetDisplayName = function (Value) {
      var TmpInd = 0;
      if (this.FName === Value) return;
      if ((Value !== "") && $mod.TFieldDefs.isPrototypeOf(this.FCollection)) {
        TmpInd = this.FCollection.IndexOf(Value);
        if ((TmpInd >= 0) && (TmpInd !== this.GetIndex())) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SDuplicateName"),pas.System.VarRecs(18,Value,18,this.FCollection.$classname));
      };
      this.FName = Value;
      pas.Classes.TCollectionItem.SetDisplayName.call(this,Value);
    };
    var $r = this.$rtti;
    $r.addProperty("Name",2,rtl.string,"FName","SetDisplayName");
  });
  rtl.createClass(this,"TDefCollection",pas.Classes.TOwnedCollection,function () {
    this.$init = function () {
      pas.Classes.TOwnedCollection.$init.call(this);
      this.FDataset = null;
      this.FUpdated = false;
    };
    this.$final = function () {
      this.FDataset = undefined;
      pas.Classes.TOwnedCollection.$final.call(this);
    };
    this.SetItemName = function (Item) {
      var N = null;
      var TN = "";
      N = rtl.as(Item,$mod.TNamedItem);
      if (N.FName === "") {
        TN = pas.System.Copy(this.$classname,2,5) + pas.SysUtils.IntToStr(N.FID + 1);
        if (this.FDataset != null) TN = this.FDataset.FName + TN;
        N.SetDisplayName(TN);
      } else pas.Classes.TCollection.SetItemName.call(this,Item);
    };
    this.create$3 = function (ADataset, AOwner, AClass) {
      pas.Classes.TOwnedCollection.Create$2.call(this,AOwner,AClass);
      this.FDataset = ADataset;
      return this;
    };
    this.Find = function (AName) {
      var Result = null;
      var i = 0;
      Result = null;
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        if (pas.SysUtils.AnsiSameText(this.GetItem(i).FName,AName)) {
          Result = this.GetItem(i);
          break;
        };
      };
      return Result;
    };
    this.GetItemNames = function (List) {
      var i = 0;
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        List.Add(this.GetItem(i).FName);
      };
    };
    this.IndexOf = function (AName) {
      var Result = 0;
      var i = 0;
      Result = -1;
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        if (pas.SysUtils.AnsiSameText(this.GetItem(i).FName,AName)) {
          Result = i;
          break;
        };
      };
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("create$3",2,[["ADataset",$mod.$rtti["TDataSet"]],["AOwner",pas.Classes.$rtti["TPersistent"]],["AClass",pas.Classes.$rtti["TCollectionItemClass"]]]);
  });
  rtl.createClass(this,"TFieldDef",this.TNamedItem,function () {
    this.$init = function () {
      $mod.TNamedItem.$init.call(this);
      this.FAttributes = {};
      this.FDataType = 0;
      this.FFieldNo = 0;
      this.FInternalCalcField = false;
      this.FPrecision = 0;
      this.FRequired = false;
      this.FSize = 0;
    };
    this.$final = function () {
      this.FAttributes = undefined;
      $mod.TNamedItem.$final.call(this);
    };
    this.GetFieldClass = function () {
      var Result = null;
      if ((this.FCollection != null) && $mod.TFieldDefs.isPrototypeOf(this.FCollection) && (this.FCollection.FDataset != null)) {
        Result = this.FCollection.FDataset.GetFieldClass(this.FDataType)}
       else Result = null;
      return Result;
    };
    this.SetAttributes = function (AValue) {
      this.FAttributes = rtl.refSet(AValue);
      this.Changed(false);
    };
    this.SetDataType = function (AValue) {
      this.FDataType = AValue;
      this.Changed(false);
    };
    this.SetPrecision = function (AValue) {
      this.FPrecision = AValue;
      this.Changed(false);
    };
    this.SetSize = function (AValue) {
      this.FSize = AValue;
      this.Changed(false);
    };
    this.SetRequired = function (AValue) {
      this.FRequired = AValue;
      this.Changed(false);
    };
    this.Create$1 = function (ACollection) {
      pas.Classes.TCollectionItem.Create$1.call(this,ACollection);
      this.FFieldNo = this.GetIndex() + 1;
      return this;
    };
    this.Create$3 = function (AOwner, AName, ADataType, ASize, ARequired, AFieldNo) {
      pas.Classes.TCollectionItem.Create$1.call(this,AOwner);
      this.SetDisplayName(AName);
      this.FDataType = ADataType;
      this.FSize = ASize;
      this.FRequired = ARequired;
      this.FPrecision = -1;
      this.FFieldNo = AFieldNo;
      return this;
    };
    this.Destroy = function () {
      pas.Classes.TCollectionItem.Destroy.call(this);
    };
    this.Assign = function (Source) {
      var fd = null;
      fd = null;
      if ($mod.TFieldDef.isPrototypeOf(Source)) fd = rtl.as(Source,$mod.TFieldDef);
      if (fd != null) {
        this.FCollection.BeginUpdate();
        try {
          this.SetDisplayName(fd.FName);
          this.SetDataType(fd.FDataType);
          this.SetSize(fd.FSize);
          this.SetPrecision(fd.FPrecision);
          this.FRequired = fd.FRequired;
        } finally {
          this.FCollection.EndUpdate();
        };
      } else pas.Classes.TPersistent.Assign.call(this,Source);
    };
    this.CreateField = function (AOwner) {
      var Result = null;
      var TheField = null;
      TheField = this.GetFieldClass();
      if (TheField === null) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SUnknownFieldType"),pas.System.VarRecs(18,this.FName));
      Result = TheField.$create("Create$1",[AOwner]);
      try {
        Result.FFieldDef = this;
        Result.SetSize(this.FSize);
        Result.FRequired = this.FRequired;
        Result.FFieldName = this.FName;
        Result.FDisplayLabel = this.GetDisplayName();
        Result.FFieldNo = this.FFieldNo;
        Result.SetFieldType(this.FDataType);
        Result.FReadOnly = $mod.TFieldAttribute.faReadonly in this.FAttributes;
        Result.SetDataset(this.FCollection.FDataset);
        if ($mod.TFloatField.isPrototypeOf(Result)) Result.SetPrecision(this.FPrecision);
      } catch ($e) {
        Result = rtl.freeLoc(Result);
        throw $e;
      };
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ACollection",pas.Classes.$rtti["TCollection"]]]);
    $r.addMethod("Create$3",2,[["AOwner",$mod.$rtti["TFieldDefs"]],["AName",rtl.string,2],["ADataType",$mod.$rtti["TFieldType"]],["ASize",rtl.longint],["ARequired",rtl.boolean],["AFieldNo",rtl.longint]]);
    $r.addProperty("Attributes",2,$mod.$rtti["TFieldAttributes"],"FAttributes","SetAttributes",{Default: {}});
    $r.addProperty("DataType",2,$mod.$rtti["TFieldType"],"FDataType","SetDataType");
    $r.addProperty("Precision",2,rtl.longint,"FPrecision","SetPrecision",{Default: 0});
    $r.addProperty("Size",2,rtl.longint,"FSize","SetSize",{Default: 0});
  });
  this.$rtti.$ClassRef("TFieldDefClass",{instancetype: this.$rtti["TFieldDef"]});
  rtl.createClass(this,"TFieldDefs",this.TDefCollection,function () {
    this.$init = function () {
      $mod.TDefCollection.$init.call(this);
      this.FHiddenFields = false;
    };
    this.GetItem$1 = function (Index) {
      var Result = null;
      Result = this.GetItem(Index);
      return Result;
    };
    this.SetItem$1 = function (Index, AValue) {
      this.SetItem(Index,AValue);
    };
    this.FieldDefClass = function () {
      var Result = null;
      Result = $mod.TFieldDef;
      return Result;
    };
    this.Create$4 = function (ADataSet) {
      $mod.TDefCollection.create$3.call(this,ADataSet,this.Owner(),this.$class.FieldDefClass());
      return this;
    };
    this.Add$1 = function (AName, ADataType, ASize, APrecision, ARequired, AReadOnly, AFieldNo) {
      var Result = null;
      Result = this.$class.FieldDefClass().$create("Create$3",[this,this.MakeNameUnique(AName),ADataType,ASize,ARequired,AFieldNo]);
      if (AReadOnly) Result.SetAttributes(rtl.unionSet(Result.FAttributes,rtl.createSet($mod.TFieldAttribute.faReadonly)));
      return Result;
    };
    this.Add$2 = function (AName, ADataType, ASize, ARequired, AFieldNo) {
      var Result = null;
      Result = this.$class.FieldDefClass().$create("Create$3",[this,AName,ADataType,ASize,ARequired,AFieldNo]);
      return Result;
    };
    this.Add$3 = function (AName, ADataType, ASize, ARequired) {
      if (AName.length === 0) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SNeedFieldName"),this.FDataset);
      this.BeginUpdate();
      try {
        this.Add$2(AName,ADataType,ASize,ARequired,this.GetCount() + 1);
      } finally {
        this.EndUpdate();
      };
    };
    this.Add$4 = function (AName, ADataType, ASize) {
      this.Add$3(AName,ADataType,ASize,false);
    };
    this.Add$5 = function (AName, ADataType) {
      this.Add$3(AName,ADataType,0,false);
    };
    this.AddFieldDef = function () {
      var Result = null;
      Result = this.$class.FieldDefClass().$create("Create$3",[this,"",$mod.TFieldType.ftUnknown,0,false,this.GetCount() + 1]);
      return Result;
    };
    this.Assign$2 = function (FieldDefs) {
      var I = 0;
      this.Clear();
      for (var $l = 0, $end = FieldDefs.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        var $with = FieldDefs.GetItem$1(I);
        this.Add$3($with.FName,$with.FDataType,$with.FSize,$with.FRequired);
      };
    };
    this.Find$1 = function (AName) {
      var Result = null;
      Result = rtl.as($mod.TDefCollection.Find.call(this,AName),$mod.TFieldDef);
      if (Result === null) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SFieldNotFound"),pas.System.VarRecs(18,AName),this.FDataset);
      return Result;
    };
    this.Update$1 = function () {
      if (!this.FUpdated) {
        if (this.FDataset != null) this.FDataset.InitFieldDefs();
        this.FUpdated = true;
      };
    };
    this.MakeNameUnique = function (AName) {
      var Result = "";
      var DblFieldCount = 0;
      DblFieldCount = 0;
      Result = AName;
      while ($mod.TDefCollection.Find.call(this,Result) != null) {
        DblFieldCount += 1;
        Result = AName + "_" + pas.SysUtils.IntToStr(DblFieldCount);
      };
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$4",2,[["ADataSet",$mod.$rtti["TDataSet"]]]);
  });
  this.$rtti.$ClassRef("TFieldDefsClass",{instancetype: this.$rtti["TFieldDefs"]});
  this.TFieldKind = {"0": "fkData", fkData: 0, "1": "fkCalculated", fkCalculated: 1, "2": "fkLookup", fkLookup: 2, "3": "fkInternalCalc", fkInternalCalc: 3};
  this.$rtti.$Enum("TFieldKind",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TFieldKind});
  this.$rtti.$Set("TFieldKinds",{comptype: this.$rtti["TFieldKind"]});
  this.$rtti.$MethodVar("TFieldNotifyEvent",{procsig: rtl.newTIProcSig([["Sender",this.$rtti["TField"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TFieldGetTextEvent",{procsig: rtl.newTIProcSig([["Sender",this.$rtti["TField"]],["aText",rtl.string,1],["DisplayText",rtl.boolean]]), methodkind: 0});
  this.$rtti.$MethodVar("TFieldSetTextEvent",{procsig: rtl.newTIProcSig([["Sender",this.$rtti["TField"]],["aText",rtl.string,2]]), methodkind: 0});
  this.$rtti.$DynArray("TFieldChars",{eltype: rtl.char});
  rtl.createClass(this,"TLookupList",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FList = null;
    };
    this.$final = function () {
      this.FList = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function () {
      this.FList = pas.Classes.TFPList.$create("Create");
      return this;
    };
    this.Destroy = function () {
      this.Clear();
      this.FList.$destroy("Destroy");
      pas.System.TObject.Destroy.call(this);
    };
    this.Add = function (AKey, AValue) {
      var LookupRec = null;
      LookupRec = pas.JS.New(["Key",AKey,"Value",AValue]);
      this.FList.Add(LookupRec);
    };
    this.Clear = function () {
      this.FList.Clear();
    };
    this.FirstKeyByValue = function (AValue) {
      var Result = undefined;
      var i = 0;
      for (var $l = 0, $end = this.FList.FCount - 1; $l <= $end; $l++) {
        i = $l;
        var $with = this.FList.Get(i);
        if ($with["Value"] == AValue) {
          Result = $with["Key"];
          return Result;
        };
      };
      Result = null;
      return Result;
    };
    this.ValueOfKey = function (AKey) {
      var $Self = this;
      var Result = undefined;
      function VarArraySameValues(VarArray1, VarArray2) {
        var Result = false;
        var i = 0;
        Result = true;
        if (rtl.length(VarArray1) !== rtl.length(VarArray2)) return Result;
        for (var $l = 0, $end = rtl.length(VarArray1); $l <= $end; $l++) {
          i = $l;
          if (VarArray1[i] != VarArray2[i]) {
            Result = false;
            return Result;
          };
        };
        return Result;
      };
      var I = 0;
      Result = null;
      if (pas.JS.isNull(AKey)) return Result;
      I = this.FList.FCount - 1;
      if (rtl.isArray(AKey)) {
        while ((I >= 0) && !VarArraySameValues(this.FList.Get(I)["Key"],AKey)) I -= 1}
       else while ((I >= 0) && (this.FList.Get(I)["Key"] != AKey)) I -= 1;
      if (I >= 0) Result = this.FList.Get(I)["Value"];
      return Result;
    };
    this.ValuesToStrings = function (AStrings) {
      var i = 0;
      var p = null;
      AStrings.Clear();
      for (var $l = 0, $end = this.FList.FCount - 1; $l <= $end; $l++) {
        i = $l;
        p = this.FList.Get(i);
        AStrings.AddObject("" + p["Value"],p);
      };
    };
  });
  rtl.createClass(this,"TField",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FAlignment = 0;
      this.FAttributeSet = "";
      this.FCalculated = false;
      this.FConstraintErrorMessage = "";
      this.FCustomConstraint = "";
      this.FDataSet = null;
      this.FDataType = 0;
      this.FDefaultExpression = "";
      this.FDisplayLabel = "";
      this.FDisplayWidth = 0;
      this.FFieldDef = null;
      this.FFieldKind = 0;
      this.FFieldName = "";
      this.FFieldNo = 0;
      this.FFields = null;
      this.FHasConstraints = false;
      this.FImportedConstraint = "";
      this.FIsIndexField = false;
      this.FKeyFields = "";
      this.FLookupCache = false;
      this.FLookupDataSet = null;
      this.FLookupKeyfields = "";
      this.FLookupresultField = "";
      this.FLookupList = null;
      this.FOnChange = null;
      this.FOnGetText = null;
      this.FOnSetText = null;
      this.FOnValidate = null;
      this.FOrigin = "";
      this.FReadOnly = false;
      this.FRequired = false;
      this.FSize = 0;
      this.FValidChars = [];
      this.FValueBuffer = undefined;
      this.FValidating = false;
      this.FVisible = false;
      this.FProviderFlags = {};
    };
    this.$final = function () {
      this.FDataSet = undefined;
      this.FFieldDef = undefined;
      this.FFields = undefined;
      this.FLookupDataSet = undefined;
      this.FLookupList = undefined;
      this.FOnChange = undefined;
      this.FOnGetText = undefined;
      this.FOnSetText = undefined;
      this.FOnValidate = undefined;
      this.FValidChars = undefined;
      this.FProviderFlags = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.GetIndex = function () {
      var Result = 0;
      if (this.FDataSet != null) {
        Result = this.FDataSet.FFieldList.IndexOf(this)}
       else Result = -1;
      return Result;
    };
    this.GetLookup = function () {
      var Result = false;
      Result = this.FFieldKind === $mod.TFieldKind.fkLookup;
      return Result;
    };
    this.SetAlignment = function (AValue) {
      if (this.FAlignment !== AValue) {
        this.FAlignment = AValue;
        this.PropertyChanged(false);
      };
    };
    this.SetIndex = function (AValue) {
      if (this.FFields !== null) this.FFields.SetFieldIndex(this,AValue);
    };
    this.GetDisplayText = function () {
      var Result = "";
      Result = rtl.strSetLength(Result,0);
      if (this.FOnGetText != null) {
        this.FOnGetText(this,{get: function () {
            return Result;
          }, set: function (v) {
            Result = v;
          }},true)}
       else this.GetText({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},true);
      return Result;
    };
    this.GetEditText = function () {
      var Result = "";
      Result = rtl.strSetLength(Result,0);
      if (this.FOnGetText != null) {
        this.FOnGetText(this,{get: function () {
            return Result;
          }, set: function (v) {
            Result = v;
          }},false)}
       else this.GetText({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},false);
      return Result;
    };
    this.SetEditText = function (AValue) {
      if (this.FOnSetText != null) {
        this.FOnSetText(this,AValue)}
       else this.SetText(AValue);
    };
    this.SetDisplayLabel = function (AValue) {
      if (this.FDisplayLabel !== AValue) {
        this.FDisplayLabel = AValue;
        this.PropertyChanged(true);
      };
    };
    this.SetDisplayWidth = function (AValue) {
      if (this.FDisplayWidth !== AValue) {
        this.FDisplayWidth = AValue;
        this.PropertyChanged(true);
      };
    };
    this.GetDisplayWidth = function () {
      var Result = 0;
      if (this.FDisplayWidth === 0) {
        Result = this.GetDefaultWidth()}
       else Result = this.FDisplayWidth;
      return Result;
    };
    var ValueToLookupMap = [$mod.TFieldKind.fkData,$mod.TFieldKind.fkLookup];
    this.SetLookup = function (AValue) {
      this.FFieldKind = ValueToLookupMap[+AValue];
    };
    this.SetReadOnly = function (AValue) {
      if (this.FReadOnly !== AValue) {
        this.FReadOnly = AValue;
        this.PropertyChanged(true);
      };
    };
    this.SetVisible = function (AValue) {
      if (this.FVisible !== AValue) {
        this.FVisible = AValue;
        this.PropertyChanged(true);
      };
    };
    this.IsDisplayLabelStored = function () {
      var Result = false;
      Result = this.GetDisplayName() !== this.FFieldName;
      return Result;
    };
    this.IsDisplayWidthStored = function () {
      var Result = false;
      Result = this.FDisplayWidth !== 0;
      return Result;
    };
    this.GetLookupList = function () {
      var Result = null;
      if (!(this.FLookupList != null)) this.FLookupList = $mod.TLookupList.$create("Create$1");
      Result = this.FLookupList;
      return Result;
    };
    this.CalcLookupValue = function () {
      if ((this.FLookupDataSet != null) && this.FLookupDataSet.GetActive()) {
        this.SetAsJSValue(this.FLookupDataSet.Lookup(this.FLookupKeyfields,this.FDataSet.GetFieldValues(this.FKeyFields),this.FLookupresultField))}
       else this.SetAsJSValue(null);
    };
    this.RaiseAccessError = function (TypeName) {
      var E = null;
      E = this.AccessError(TypeName);
      throw E;
    };
    this.AccessError = function (TypeName) {
      var Result = null;
      Result = $mod.EDatabaseError.$create("CreateFmt",[rtl.getResStr(pas.DBConst,"SInvalidTypeConversion"),pas.System.VarRecs(18,TypeName,18,this.FFieldName)]);
      return Result;
    };
    this.CheckInactive = function () {
      if (this.FDataSet != null) this.FDataSet.CheckInactive();
    };
    this.CheckTypeSize = function (AValue) {
      if ((AValue !== 0) && !this.IsBlob()) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SInvalidFieldSize"),pas.System.VarRecs(0,AValue));
    };
    this.Change = function () {
      if (this.FOnChange != null) this.FOnChange(this);
    };
    this.Bind = function (Binding) {
      if (Binding && (this.FFieldKind === $mod.TFieldKind.fkLookup)) {
        if ((this.FLookupDataSet === null) || (this.FLookupKeyfields === "") || (this.FLookupresultField === "") || (this.FKeyFields === "")) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SLookupInfoError"),pas.System.VarRecs(18,this.GetDisplayName()));
        this.FFields.CheckFieldNames(this.FKeyFields);
        this.FLookupDataSet.Open();
        this.FLookupDataSet.FFieldList.CheckFieldNames(this.FLookupKeyfields);
        this.FLookupDataSet.FieldByName(this.FLookupresultField);
        if (this.FLookupCache) this.RefreshLookupList();
      };
    };
    this.DataChanged = function () {
      this.FDataSet.DataEvent($mod.TDataEvent.deFieldChange,this);
    };
    this.GetAsBoolean = function () {
      var Result = false;
      this.RaiseAccessError($impl.SBoolean);
      Result = false;
      return Result;
    };
    this.GetAsBytes = function () {
      var Result = [];
      this.RaiseAccessError($impl.SBytes);
      Result = [];
      return Result;
    };
    this.GetAsLargeInt = function () {
      var Result = 0;
      this.RaiseAccessError($impl.SLargeInt);
      Result = 0;
      return Result;
    };
    this.GetAsDateTime = function () {
      var Result = 0.0;
      this.RaiseAccessError($impl.SDateTime);
      Result = 0.0;
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      this.RaiseAccessError($impl.SDateTime);
      Result = 0.0;
      return Result;
    };
    this.GetAsLongint = function () {
      var Result = 0;
      Result = this.GetAsInteger();
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      this.RaiseAccessError($impl.SInteger);
      Result = 0;
      return Result;
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      Result = this.GetData();
      return Result;
    };
    this.GetOldValue = function () {
      var Result = undefined;
      var SaveState = 0;
      SaveState = this.FDataSet.FState;
      try {
        this.FDataSet.SetTempState($mod.TDataSetState.dsOldValue);
        Result = this.GetAsJSValue();
      } finally {
        this.FDataSet.RestoreState(SaveState);
      };
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      Result = this.GetClassDesc();
      return Result;
    };
    this.GetCanModify = function () {
      var Result = false;
      Result = !this.FReadOnly;
      if (Result) {
        Result = this.FFieldKind in rtl.createSet($mod.TFieldKind.fkData,$mod.TFieldKind.fkInternalCalc);
        if (Result) {
          Result = (this.FDataSet != null) && this.FDataSet.GetActive();
          if (Result) Result = this.FDataSet.GetCanModify();
        };
      };
      return Result;
    };
    this.GetClassDesc = function () {
      var Result = "";
      var ClassN = "";
      ClassN = pas.System.Copy(this.$classname,2,pas.System.Pos("Field",this.$classname) - 2);
      if (this.GetIsNull()) {
        Result = "(" + pas.SysUtils.LowerCase(ClassN) + ")"}
       else Result = "(" + pas.SysUtils.UpperCase(ClassN) + ")";
      return Result;
    };
    this.GetDataSize = function () {
      var Result = 0;
      Result = 0;
      return Result;
    };
    this.GetDefaultWidth = function () {
      var Result = 0;
      Result = 10;
      return Result;
    };
    this.GetDisplayName = function () {
      var Result = "";
      if (this.FDisplayLabel !== "") {
        Result = this.FDisplayLabel}
       else Result = this.FFieldName;
      return Result;
    };
    this.GetCurValue = function () {
      var Result = undefined;
      var SaveState = 0;
      SaveState = this.FDataSet.FState;
      try {
        this.FDataSet.SetTempState($mod.TDataSetState.dsCurValue);
        Result = this.GetAsJSValue();
      } finally {
        this.FDataSet.RestoreState(SaveState);
      };
      return Result;
    };
    this.GetNewValue = function () {
      var Result = undefined;
      var SaveState = 0;
      SaveState = this.FDataSet.FState;
      try {
        this.FDataSet.SetTempState($mod.TDataSetState.dsNewValue);
        Result = this.GetAsJSValue();
      } finally {
        this.FDataSet.RestoreState(SaveState);
      };
      return Result;
    };
    this.GetIsNull = function () {
      var Result = false;
      Result = pas.JS.isNull(this.GetData());
      return Result;
    };
    this.GetText = function (AText, ADisplayText) {
      AText.set(this.GetAsString());
    };
    this.Notification = function (AComponent, Operation) {
      pas.Classes.TComponent.Notification.call(this,AComponent,Operation);
      if ((Operation === pas.Classes.TOperation.opRemove) && (AComponent === this.FLookupDataSet)) this.FLookupDataSet = null;
    };
    this.PropertyChanged = function (LayoutAffected) {
      if ((this.FDataSet !== null) && this.FDataSet.GetActive()) if (LayoutAffected) {
        this.FDataSet.DataEvent($mod.TDataEvent.deLayoutChange,0)}
       else this.FDataSet.DataEvent($mod.TDataEvent.deDataSetChange,0);
    };
    this.SetAsBoolean = function (AValue) {
      this.RaiseAccessError($impl.SBoolean);
    };
    this.SetAsDateTime = function (AValue) {
      this.RaiseAccessError($impl.SDateTime);
    };
    this.SetAsFloat = function (AValue) {
      this.RaiseAccessError($impl.SFloat);
    };
    this.SetAsLongint = function (AValue) {
      this.SetAsInteger(AValue);
    };
    this.SetAsInteger = function (AValue) {
      this.RaiseAccessError($impl.SInteger);
    };
    this.SetAsLargeInt = function (AValue) {
      this.RaiseAccessError($impl.SLargeInt);
    };
    this.SetAsJSValue = function (AValue) {
      if (pas.JS.isNull(AValue)) {
        this.Clear()}
       else try {
        this.SetVarValue(AValue);
      } catch ($e) {
        if (pas.SysUtils.EVariantError.isPrototypeOf($e)) {
          $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SFieldValueError"),pas.System.VarRecs(18,this.GetDisplayName()))}
         else throw $e
      };
    };
    this.SetAsString = function (AValue) {
      this.RaiseAccessError($impl.SString);
    };
    this.SetDataset = function (AValue) {
      if (AValue === this.FDataSet) return;
      if (this.FDataSet != null) {
        this.FDataSet.CheckInactive();
        this.FDataSet.FFieldList.Remove(this);
      };
      if (AValue != null) {
        AValue.CheckInactive();
        AValue.FFieldList.Add(this);
      };
      this.FDataSet = AValue;
    };
    this.SetDataType = function (AValue) {
      this.FDataType = AValue;
    };
    this.SetNewValue = function (AValue) {
      var SaveState = 0;
      SaveState = this.FDataSet.FState;
      try {
        this.FDataSet.SetTempState($mod.TDataSetState.dsNewValue);
        this.SetAsJSValue(AValue);
      } finally {
        this.FDataSet.RestoreState(SaveState);
      };
    };
    this.SetSize = function (AValue) {
      this.CheckInactive();
      this.$class.CheckTypeSize(AValue);
      this.FSize = AValue;
    };
    this.SetParentComponent = function (Value) {
      this.SetDataset(rtl.as(Value,$mod.TDataSet));
    };
    this.SetText = function (AValue) {
      this.SetAsString(AValue);
    };
    this.SetVarValue = function (AValue) {
      this.RaiseAccessError($impl.SJSValue);
    };
    this.SetAsBytes = function (AValue) {
      this.RaiseAccessError($impl.SBytes);
    };
    this.DefineProperties = function (Filer) {
      var $Self = this;
      function IgnoreReadString(Reader) {
        Reader.ReadString();
      };
      function IgnoreReadBoolean(Reader) {
        Reader.ReadBoolean();
      };
      function IgnoreWrite(Writer) {
        if (Writer === null) ;
      };
      Filer.DefineProperty("AttributeSet",IgnoreReadString,IgnoreWrite,false);
      Filer.DefineProperty("Calculated",IgnoreReadBoolean,IgnoreWrite,false);
      Filer.DefineProperty("Lookup",IgnoreReadBoolean,IgnoreWrite,false);
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FVisible = true;
      this.FValidChars = rtl.arraySetLength(this.FValidChars,"\x00",255);
      this.FProviderFlags = rtl.createSet($mod.TProviderFlag.pfInUpdate,$mod.TProviderFlag.pfInWhere);
      return this;
    };
    this.Destroy = function () {
      if (this.FDataSet != null) {
        this.FDataSet.SetActive(false);
        if (this.FFields != null) this.FFields.Remove(this);
      };
      rtl.free(this,"FLookupList");
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.GetParentComponent = function () {
      var Result = null;
      Result = this.FDataSet;
      return Result;
    };
    this.HasParent = function () {
      var Result = false;
      Result = true;
      return Result;
    };
    this.Assign = function (Source) {
      if (Source === null) {
        this.Clear()}
       else if ($mod.TField.isPrototypeOf(Source)) {
        this.SetAsJSValue(Source.GetAsJSValue());
      } else pas.Classes.TPersistent.Assign.call(this,Source);
    };
    this.AssignValue = function (AValue) {
      var $Self = this;
      function error() {
        $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SFieldValueError"),pas.System.VarRecs(18,$Self.GetDisplayName()));
      };
      var $tmp = pas.JS.GetValueType(AValue);
      if ($tmp === pas.JS.TJSValueType.jvtNull) {
        this.Clear()}
       else if ($tmp === pas.JS.TJSValueType.jvtBoolean) {
        this.SetAsBoolean(!(AValue == false))}
       else if ($tmp === pas.JS.TJSValueType.jvtInteger) {
        this.SetAsLargeInt(rtl.trunc(AValue))}
       else if ($tmp === pas.JS.TJSValueType.jvtFloat) {
        this.SetAsFloat(rtl.getNumber(AValue))}
       else if ($tmp === pas.JS.TJSValueType.jvtString) {
        this.SetAsString("" + AValue)}
       else if ($tmp === pas.JS.TJSValueType.jvtArray) {
        this.SetAsBytes(AValue)}
       else {
        error();
      };
    };
    this.Clear = function () {
      this.SetData(null);
    };
    this.FocusControl = function () {
      var Field1 = null;
      Field1 = this;
      this.FDataSet.DataEvent($mod.TDataEvent.deFocusControl,Field1);
    };
    this.GetData = function () {
      var Result = undefined;
      if (this.FDataSet === null) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SNoDataset"),pas.System.VarRecs(18,this.FFieldName));
      if (this.FValidating) {
        Result = this.FValueBuffer}
       else {
        Result = this.FDataSet.GetFieldData(this);
        if (pas.JS.isUndefined(Result)) Result = null;
      };
      return Result;
    };
    this.IsBlob = function () {
      var Result = false;
      Result = false;
      return Result;
    };
    this.IsValidChar = function (InputChar) {
      var Result = false;
      Result = pas.SysUtils.CharInSet(InputChar,this.FValidChars);
      return Result;
    };
    this.RefreshLookupList = function () {
      var tmpActive = false;
      if (!(this.FLookupDataSet != null) || (this.FLookupKeyfields.length === 0) || (this.FLookupresultField.length === 0) || (this.FKeyFields.length === 0)) return;
      tmpActive = this.FLookupDataSet.GetActive();
      try {
        this.FLookupDataSet.SetActive(true);
        this.FFields.CheckFieldNames(this.FKeyFields);
        this.FLookupDataSet.FFieldList.CheckFieldNames(this.FLookupKeyfields);
        this.FLookupDataSet.FieldByName(this.FLookupresultField);
        this.GetLookupList().Clear();
        this.FLookupDataSet.DisableControls();
        try {
          this.FLookupDataSet.First();
          while (!this.FLookupDataSet.FEOF) {
            this.FLookupDataSet.Next();
          };
        } finally {
          this.FLookupDataSet.EnableControls();
        };
      } finally {
        this.FLookupDataSet.SetActive(tmpActive);
      };
    };
    this.SetData = function (Buffer) {
      if (!(this.FDataSet != null)) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SNoDataset"),pas.System.VarRecs(18,this.FFieldName));
      this.FDataSet.SetFieldData(this,Buffer);
    };
    this.SetFieldType = function (AValue) {
    };
    this.Validate = function (Buffer) {
      if (this.FOnValidate != null) {
        this.FValueBuffer = Buffer;
        this.FValidating = true;
        try {
          this.FOnValidate(this);
        } finally {
          this.FValidating = false;
        };
      };
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Alignment",2,pas.Classes.$rtti["TAlignment"],"FAlignment","SetAlignment",{Default: pas.Classes.TAlignment.taLeftJustify});
    $r.addProperty("CustomConstraint",0,rtl.string,"FCustomConstraint","FCustomConstraint");
    $r.addProperty("ConstraintErrorMessage",0,rtl.string,"FConstraintErrorMessage","FConstraintErrorMessage");
    $r.addProperty("DefaultExpression",0,rtl.string,"FDefaultExpression","FDefaultExpression");
    $r.addProperty("DisplayLabel",15,rtl.string,"GetDisplayName","SetDisplayLabel",{stored: "IsDisplayLabelStored"});
    $r.addProperty("DisplayWidth",15,rtl.longint,"GetDisplayWidth","SetDisplayWidth",{stored: "IsDisplayWidthStored"});
    $r.addProperty("FieldKind",0,$mod.$rtti["TFieldKind"],"FFieldKind","FFieldKind");
    $r.addProperty("FieldName",0,rtl.string,"FFieldName","FFieldName");
    $r.addProperty("HasConstraints",0,rtl.boolean,"FHasConstraints","");
    $r.addProperty("Index",3,rtl.longint,"GetIndex","SetIndex");
    $r.addProperty("ImportedConstraint",0,rtl.string,"FImportedConstraint","FImportedConstraint");
    $r.addProperty("KeyFields",0,rtl.string,"FKeyFields","FKeyFields");
    $r.addProperty("LookupCache",0,rtl.boolean,"FLookupCache","FLookupCache");
    $r.addProperty("LookupDataSet",0,$mod.$rtti["TDataSet"],"FLookupDataSet","FLookupDataSet");
    $r.addProperty("LookupKeyFields",0,rtl.string,"FLookupKeyfields","FLookupKeyfields");
    $r.addProperty("LookupResultField",0,rtl.string,"FLookupresultField","FLookupresultField");
    $r.addProperty("Origin",0,rtl.string,"FOrigin","FOrigin");
    $r.addProperty("ProviderFlags",0,$mod.$rtti["TProviderFlags"],"FProviderFlags","FProviderFlags");
    $r.addProperty("ReadOnly",2,rtl.boolean,"FReadOnly","SetReadOnly");
    $r.addProperty("Required",0,rtl.boolean,"FRequired","FRequired");
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible",{Default: true});
    $r.addProperty("OnChange",0,$mod.$rtti["TFieldNotifyEvent"],"FOnChange","FOnChange");
    $r.addProperty("OnGetText",0,$mod.$rtti["TFieldGetTextEvent"],"FOnGetText","FOnGetText");
    $r.addProperty("OnSetText",0,$mod.$rtti["TFieldSetTextEvent"],"FOnSetText","FOnSetText");
    $r.addProperty("OnValidate",0,$mod.$rtti["TFieldNotifyEvent"],"FOnValidate","FOnValidate");
  });
  rtl.createClass(this,"TStringField",this.TField,function () {
    this.$init = function () {
      $mod.TField.$init.call(this);
      this.FFixedChar = false;
      this.FTransliterate = false;
    };
    this.CheckTypeSize = function (AValue) {
      if (AValue < 0) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SInvalidFieldSize"),pas.System.VarRecs(0,AValue));
    };
    this.GetAsBoolean = function () {
      var Result = false;
      var S = "";
      S = this.GetAsString();
      Result = (S.length > 0) && (pas.System.upcase(S.charAt(0)).charCodeAt() in rtl.createSet(84,$mod.YesNoChars[1].charCodeAt()));
      return Result;
    };
    this.GetAsDateTime = function () {
      var Result = 0.0;
      Result = pas.SysUtils.StrToDateTime(this.GetAsString());
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      Result = pas.SysUtils.StrToFloat(this.GetAsString());
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      Result = pas.SysUtils.StrToInt(this.GetAsString());
      return Result;
    };
    this.GetAsLargeInt = function () {
      var Result = 0;
      Result = pas.SysUtils.StrToInt64(this.GetAsString());
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      var V = undefined;
      V = this.GetData();
      if (rtl.isString(V)) {
        Result = "" + V}
       else Result = "";
      return Result;
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      Result = this.GetData();
      return Result;
    };
    this.GetDefaultWidth = function () {
      var Result = 0;
      Result = this.FSize;
      return Result;
    };
    this.GetText = function (AText, ADisplayText) {
      AText.set(this.GetAsString());
    };
    this.SetAsBoolean = function (AValue) {
      if (AValue) {
        this.SetAsString("T")}
       else this.SetAsString("F");
    };
    this.SetAsDateTime = function (AValue) {
      this.SetAsString(pas.SysUtils.DateTimeToStr(AValue,false));
    };
    this.SetAsFloat = function (AValue) {
      this.SetAsString(pas.SysUtils.FloatToStr(AValue));
    };
    this.SetAsInteger = function (AValue) {
      this.SetAsString(pas.SysUtils.IntToStr(AValue));
    };
    this.SetAsLargeInt = function (AValue) {
      this.SetAsString(pas.SysUtils.IntToStr(AValue));
    };
    this.SetAsString = function (AValue) {
      this.SetData(AValue);
    };
    this.SetVarValue = function (AValue) {
      if (rtl.isString(AValue)) {
        this.SetAsString("" + AValue)}
       else this.RaiseAccessError(rtl.getResStr(pas.DBConst,"SFieldValueError"));
    };
    this.Create$1 = function (AOwner) {
      $mod.TField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftString);
      this.FFixedChar = false;
      this.FTransliterate = false;
      this.FSize = 20;
      return this;
    };
    this.SetFieldType = function (AValue) {
      if (AValue in rtl.createSet($mod.TFieldType.ftString,$mod.TFieldType.ftFixedChar)) this.SetDataType(AValue);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Size",2,rtl.longint,"FSize","SetSize",{Default: 20});
  });
  rtl.createClass(this,"TWideStringField",this.TStringField,function () {
    rtl.addIntf(this,pas.System.IUnknown);
  });
  rtl.createClass(this,"TNumericField",this.TField,function () {
    this.$init = function () {
      $mod.TField.$init.call(this);
      this.FDisplayFormat = "";
      this.FEditFormat = "";
    };
    this.CheckTypeSize = function (AValue) {
      if (AValue > 16) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SInvalidFieldSize"),pas.System.VarRecs(0,AValue));
    };
    this.RangeError = function (AValue, Min, Max) {
      $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SRangeError"),pas.System.VarRecs(3,AValue,3,Min,3,Max,18,this.FFieldName));
    };
    this.SetDisplayFormat = function (AValue) {
      if (this.FDisplayFormat !== AValue) {
        this.FDisplayFormat = AValue;
        this.PropertyChanged(true);
      };
    };
    this.SetEditFormat = function (AValue) {
      if (this.FEditFormat !== AValue) {
        this.FEditFormat = AValue;
        this.PropertyChanged(true);
      };
    };
    this.GetAsBoolean = function () {
      var Result = false;
      Result = this.GetAsInteger() !== 0;
      return Result;
    };
    this.SetAsBoolean = function (AValue) {
      this.SetAsInteger(AValue + 0);
    };
    this.Create$1 = function (AOwner) {
      $mod.TField.Create$1.call(this,AOwner);
      this.SetAlignment(pas.Classes.TAlignment.taRightJustify);
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Alignment",2,pas.Classes.$rtti["TAlignment"],"FAlignment","SetAlignment",{Default: pas.Classes.TAlignment.taRightJustify});
    $r.addProperty("DisplayFormat",2,rtl.string,"FDisplayFormat","SetDisplayFormat");
    $r.addProperty("EditFormat",2,rtl.string,"FEditFormat","SetEditFormat");
  });
  rtl.createClass(this,"TIntegerField",this.TNumericField,function () {
    this.$init = function () {
      $mod.TNumericField.$init.call(this);
      this.FMinValue = 0;
      this.FMaxValue = 0;
      this.FMinRange = 0;
      this.FMaxRange = 0;
    };
    this.SetMinValue = function (AValue) {
      if ((AValue >= this.FMinRange) && (AValue <= this.FMaxRange)) {
        this.FMinValue = AValue}
       else this.RangeError(AValue,this.FMinRange,this.FMaxRange);
    };
    this.SetMaxValue = function (AValue) {
      if ((AValue >= this.FMinRange) && (AValue <= this.FMaxRange)) {
        this.FMaxValue = AValue}
       else this.RangeError(AValue,this.FMinRange,this.FMaxRange);
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      Result = this.GetAsInteger();
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      if (!this.GetValue({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }})) Result = 0;
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      var L = 0;
      if (this.GetValue({get: function () {
          return L;
        }, set: function (v) {
          L = v;
        }})) {
        Result = pas.SysUtils.IntToStr(L)}
       else Result = "";
      return Result;
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      var L = 0;
      if (this.GetValue({get: function () {
          return L;
        }, set: function (v) {
          L = v;
        }})) {
        Result = L}
       else Result = null;
      return Result;
    };
    this.GetText = function (AText, ADisplayText) {
      var l = 0;
      var fmt = "";
      AText.set("");
      if (!this.GetValue({get: function () {
          return l;
        }, set: function (v) {
          l = v;
        }})) return;
      if (ADisplayText || (this.FEditFormat === "")) {
        fmt = this.FDisplayFormat}
       else fmt = this.FEditFormat;
      if (fmt.length !== 0) {
        AText.set(pas.SysUtils.FormatFloat(fmt,l))}
       else AText.set("" + l);
    };
    this.GetValue = function (AValue) {
      var Result = false;
      var V = undefined;
      V = this.GetData();
      Result = pas.JS.isInteger(V);
      if (Result) AValue.set(rtl.trunc(V));
      return Result;
    };
    this.SetAsFloat = function (AValue) {
      this.SetAsInteger(Math.round(AValue));
    };
    this.SetAsInteger = function (AValue) {
      if (this.CheckRange(AValue)) {
        this.SetData(AValue)}
       else if ((this.FMinValue !== 0) || (this.FMaxValue !== 0)) {
        this.RangeError(AValue,this.FMinValue,this.FMaxValue)}
       else this.RangeError(AValue,this.FMinRange,this.FMaxRange);
    };
    this.SetAsString = function (AValue) {
      var L = 0;
      var Code = 0;
      if (AValue.length === 0) {
        this.Clear()}
       else {
        pas.System.val$6(AValue,{get: function () {
            return L;
          }, set: function (v) {
            L = v;
          }},{get: function () {
            return Code;
          }, set: function (v) {
            Code = v;
          }});
        if (Code === 0) {
          this.SetAsInteger(L)}
         else $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SNotAninteger"),pas.System.VarRecs(18,AValue));
      };
    };
    this.SetVarValue = function (AValue) {
      if (pas.JS.isInteger(AValue)) {
        this.SetAsInteger(rtl.trunc(AValue))}
       else this.RaiseAccessError($impl.SInteger);
    };
    this.GetAsLargeInt = function () {
      var Result = 0;
      Result = this.GetAsInteger();
      return Result;
    };
    this.SetAsLargeInt = function (AValue) {
      if ((AValue >= this.FMinRange) && (AValue <= this.FMaxRange)) {
        this.SetAsInteger(AValue)}
       else this.RangeError(AValue,this.FMinRange,this.FMaxRange);
    };
    this.Create$1 = function (AOwner) {
      $mod.TNumericField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftInteger);
      this.FMinRange = -2147483648;
      this.FMaxRange = 2147483647;
      return this;
    };
    this.CheckRange = function (AValue) {
      var Result = false;
      if ((this.FMinValue !== 0) || (this.FMaxValue !== 0)) {
        Result = (AValue >= this.FMinValue) && (AValue <= this.FMaxValue)}
       else Result = (AValue >= this.FMinRange) && (AValue <= this.FMaxRange);
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("MaxValue",2,rtl.longint,"FMaxValue","SetMaxValue",{Default: 0});
    $r.addProperty("MinValue",2,rtl.longint,"FMinValue","SetMinValue",{Default: 0});
  });
  rtl.createClass(this,"TLongintField",this.TIntegerField,function () {
    rtl.addIntf(this,pas.System.IUnknown);
  });
  rtl.createClass(this,"TLargeintField",this.TNumericField,function () {
    this.$init = function () {
      $mod.TNumericField.$init.call(this);
      this.FMinValue = 0;
      this.FMaxValue = 0;
      this.FMinRange = 0;
      this.FMaxRange = 0;
    };
    this.SetMinValue = function (AValue) {
      if ((AValue >= this.FMinRange) && (AValue <= this.FMaxRange)) {
        this.FMinValue = AValue}
       else this.RangeError(AValue,this.FMinRange,this.FMaxRange);
    };
    this.SetMaxValue = function (AValue) {
      if ((AValue >= this.FMinRange) && (AValue <= this.FMaxRange)) {
        this.FMaxValue = AValue}
       else this.RangeError(AValue,this.FMinRange,this.FMaxRange);
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      Result = this.GetAsLargeInt();
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      Result = this.GetAsLargeInt();
      return Result;
    };
    this.GetAsLargeInt = function () {
      var Result = 0;
      if (!this.GetValue({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }})) Result = 0;
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      var L = 0;
      if (this.GetValue({get: function () {
          return L;
        }, set: function (v) {
          L = v;
        }})) {
        Result = pas.SysUtils.IntToStr(L)}
       else Result = "";
      return Result;
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      var L = 0;
      if (this.GetValue({get: function () {
          return L;
        }, set: function (v) {
          L = v;
        }})) {
        Result = L}
       else Result = null;
      return Result;
    };
    this.GetText = function (AText, ADisplayText) {
      var l = 0;
      var fmt = "";
      AText.set("");
      if (!this.GetValue({get: function () {
          return l;
        }, set: function (v) {
          l = v;
        }})) return;
      if (ADisplayText || (this.FEditFormat === "")) {
        fmt = this.FDisplayFormat}
       else fmt = this.FEditFormat;
      if (fmt.length !== 0) {
        AText.set(pas.SysUtils.FormatFloat(fmt,l))}
       else AText.set("" + l);
    };
    this.GetValue = function (AValue) {
      var Result = false;
      var P = undefined;
      P = this.GetData();
      Result = pas.JS.isInteger(P);
      if (Result) AValue.set(rtl.trunc(P));
      return Result;
    };
    this.SetAsFloat = function (AValue) {
      this.SetAsLargeInt(Math.round(AValue));
    };
    this.SetAsInteger = function (AValue) {
      this.SetAsLargeInt(AValue);
    };
    this.SetAsLargeInt = function (AValue) {
      if (this.CheckRange(AValue)) {
        this.SetData(AValue)}
       else this.RangeError(AValue,this.FMinValue,this.FMaxValue);
    };
    this.SetAsString = function (AValue) {
      var L = 0;
      var code = 0;
      if (AValue.length === 0) {
        this.Clear()}
       else {
        pas.System.val(AValue,{get: function () {
            return L;
          }, set: function (v) {
            L = v;
          }},{get: function () {
            return code;
          }, set: function (v) {
            code = v;
          }});
        if (code === 0) {
          this.SetAsLargeInt(L)}
         else $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SNotAninteger"),pas.System.VarRecs(18,AValue));
      };
    };
    this.SetVarValue = function (AValue) {
      if (pas.JS.isInteger(AValue)) {
        this.SetAsLargeInt(rtl.trunc(AValue))}
       else this.RaiseAccessError($impl.SLargeInt);
    };
    this.Create$1 = function (AOwner) {
      $mod.TNumericField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftLargeInt);
      this.FMinRange = -9007199254740991;
      this.FMaxRange = 9007199254740991;
      return this;
    };
    this.CheckRange = function (AValue) {
      var Result = false;
      if ((this.FMinValue !== 0) || (this.FMaxValue !== 0)) {
        Result = (AValue >= this.FMinValue) && (AValue <= this.FMaxValue)}
       else Result = (AValue >= this.FMinRange) && (AValue <= this.FMaxRange);
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("MaxValue",2,rtl.nativeint,"FMaxValue","SetMaxValue",{Default: 0});
    $r.addProperty("MinValue",2,rtl.nativeint,"FMinValue","SetMinValue",{Default: 0});
  });
  rtl.createClass(this,"TAutoIncField",this.TIntegerField,function () {
    this.SetAsInteger = function (AValue) {
      $mod.TIntegerField.SetAsInteger.apply(this,arguments);
    };
    this.Create$1 = function (AOwner) {
      $mod.TIntegerField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftAutoInc);
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TFloatField",this.TNumericField,function () {
    this.$init = function () {
      $mod.TNumericField.$init.call(this);
      this.FCurrency = false;
      this.FMaxValue = 0.0;
      this.FMinValue = 0.0;
      this.FPrecision = 0;
    };
    this.SetCurrency = function (AValue) {
      if (this.FCurrency === AValue) return;
      this.FCurrency = AValue;
    };
    this.SetPrecision = function (AValue) {
      if ((AValue === -1) || (AValue > 1)) {
        this.FPrecision = AValue}
       else this.FPrecision = 2;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      var P = undefined;
      P = this.GetData();
      if (rtl.isNumber(P)) {
        Result = rtl.getNumber(P)}
       else Result = 0.0;
      return Result;
    };
    this.GetAsLargeInt = function () {
      var Result = 0;
      Result = Math.round(this.GetAsFloat());
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      Result = Math.round(this.GetAsFloat());
      return Result;
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      var P = undefined;
      P = this.GetData();
      if (rtl.isNumber(P)) {
        Result = P}
       else Result = null;
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      var P = undefined;
      P = this.GetData();
      if (rtl.isNumber(P)) {
        Result = pas.SysUtils.FloatToStr(rtl.getNumber(P))}
       else Result = "";
      return Result;
    };
    this.GetText = function (AText, ADisplayText) {
      var fmt = "";
      var E = 0.0;
      var Digits = 0;
      var ff = 0;
      var P = undefined;
      AText.set("");
      P = this.GetData();
      if (!rtl.isNumber(P)) return;
      E = rtl.getNumber(P);
      if (ADisplayText || (this.FEditFormat.length === 0)) {
        fmt = this.FDisplayFormat}
       else fmt = this.FEditFormat;
      Digits = 0;
      if (!this.FCurrency) {
        ff = pas.SysUtils.TFloatFormat.ffGeneral}
       else {
        Digits = 2;
        ff = pas.SysUtils.TFloatFormat.ffFixed;
      };
      if (fmt !== "") {
        AText.set(pas.SysUtils.FormatFloat(fmt,E))}
       else AText.set(pas.SysUtils.FloatToStrF(E,ff,this.FPrecision,Digits));
    };
    this.SetAsFloat = function (AValue) {
      if (this.CheckRange(AValue)) {
        this.SetData(AValue)}
       else this.RangeError(AValue,this.FMinValue,this.FMaxValue);
    };
    this.SetAsLargeInt = function (AValue) {
      this.SetAsFloat(AValue);
    };
    this.SetAsInteger = function (AValue) {
      this.SetAsFloat(AValue);
    };
    this.SetAsString = function (AValue) {
      var f = 0.0;
      if (AValue === "") {
        this.Clear()}
       else {
        if (!pas.SysUtils.TryStrToFloat$2(AValue,{get: function () {
            return f;
          }, set: function (v) {
            f = v;
          }})) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SNotAFloat"),pas.System.VarRecs(18,AValue));
        this.SetAsFloat(f);
      };
    };
    this.SetVarValue = function (AValue) {
      if (rtl.isNumber(AValue)) {
        this.SetAsFloat(rtl.getNumber(AValue))}
       else this.RaiseAccessError("Float");
    };
    this.Create$1 = function (AOwner) {
      $mod.TNumericField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftFloat);
      this.FPrecision = 15;
      return this;
    };
    this.CheckRange = function (AValue) {
      var Result = false;
      if ((this.FMinValue !== 0) || (this.FMaxValue !== 0)) {
        Result = (AValue >= this.FMinValue) && (AValue <= this.FMaxValue)}
       else Result = true;
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Currency",2,rtl.boolean,"FCurrency","SetCurrency",{Default: false});
    $r.addProperty("MaxValue",0,rtl.double,"FMaxValue","FMaxValue");
    $r.addProperty("MinValue",0,rtl.double,"FMinValue","FMinValue");
    $r.addProperty("Precision",2,rtl.longint,"FPrecision","SetPrecision",{Default: 15});
  });
  rtl.createClass(this,"TBooleanField",this.TField,function () {
    this.FDisplays$a$clone = function (a) {
      var b = [];
      b.length = 2;
      for (var c = 0; c < 2; c++) b[c] = a[c].slice(0);
      return b;
    };
    this.$init = function () {
      $mod.TField.$init.call(this);
      this.FDisplayValues = "";
      this.FDisplays = rtl.arraySetLength(null,"",2,2);
    };
    this.$final = function () {
      this.FDisplays = undefined;
      $mod.TField.$final.call(this);
    };
    this.SetDisplayValues = function (AValue) {
      var I = 0;
      if (this.FDisplayValues !== AValue) {
        I = pas.System.Pos(";",AValue);
        if ((I < 2) || (I === AValue.length)) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SInvalidDisplayValues"),pas.System.VarRecs(18,AValue));
        this.FDisplayValues = AValue;
        this.FDisplays[0][1] = pas.System.Copy(AValue,1,I - 1);
        this.FDisplays[1][1] = pas.SysUtils.UpperCase(this.FDisplays[0][1]);
        this.FDisplays[0][0] = pas.System.Copy(AValue,I + 1,AValue.length - I);
        this.FDisplays[1][0] = pas.SysUtils.UpperCase(this.FDisplays[0][0]);
        this.PropertyChanged(true);
      };
    };
    this.GetAsBoolean = function () {
      var Result = false;
      var P = undefined;
      P = this.GetData();
      if (pas.JS.isBoolean(P)) {
        Result = !(P == false)}
       else Result = false;
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      var P = undefined;
      P = this.GetData();
      if (pas.JS.isBoolean(P)) {
        Result = this.FDisplays[0][+!(P == false)]}
       else Result = "";
      return Result;
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      var P = undefined;
      P = this.GetData();
      if (pas.JS.isBoolean(P)) {
        Result = !(P == false)}
       else Result = null;
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      Result = this.GetAsBoolean() + 0;
      return Result;
    };
    this.GetDefaultWidth = function () {
      var Result = 0;
      Result = this.FDisplays[0][0].length;
      if (Result < this.FDisplays[0][1].length) Result = this.FDisplays[0][1].length;
      return Result;
    };
    this.SetAsBoolean = function (AValue) {
      this.SetData(AValue);
    };
    this.SetAsString = function (AValue) {
      var Temp = "";
      Temp = pas.SysUtils.UpperCase(AValue);
      if (Temp === "") {
        this.Clear()}
       else if (pas.System.Pos(Temp,this.FDisplays[1][1]) === 1) {
        this.SetAsBoolean(true)}
       else if (pas.System.Pos(Temp,this.FDisplays[1][0]) === 1) {
        this.SetAsBoolean(false)}
       else $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SNotABoolean"),pas.System.VarRecs(18,AValue));
    };
    this.SetAsInteger = function (AValue) {
      this.SetAsBoolean(AValue !== 0);
    };
    this.SetVarValue = function (AValue) {
      if (pas.JS.isBoolean(AValue)) {
        this.SetAsBoolean(!(AValue == false))}
       else if (rtl.isNumber(AValue)) this.SetAsBoolean(rtl.getNumber(AValue) !== 0);
    };
    this.Create$1 = function (AOwner) {
      $mod.TField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftBoolean);
      this.SetDisplayValues("True;False");
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $mod.$rtti.$StaticArray("TBooleanField.FDisplays$a",{dims: [2,2], eltype: rtl.string});
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("DisplayValues",2,rtl.string,"FDisplayValues","SetDisplayValues");
  });
  rtl.createClass(this,"TDateTimeField",this.TField,function () {
    this.$init = function () {
      $mod.TField.$init.call(this);
      this.FDisplayFormat = "";
    };
    this.SetDisplayFormat = function (AValue) {
      if (this.FDisplayFormat !== AValue) {
        this.FDisplayFormat = AValue;
        this.PropertyChanged(true);
      };
    };
    this.ConvertToDateTime = function (aValue, aRaiseError) {
      var Result = 0.0;
      if (pas.JS.isNull(aValue)) {
        Result = 0}
       else if (this.FDataSet != null) {
        Result = this.FDataSet.ConvertToDateTime(this,aValue,aRaiseError)}
       else Result = $mod.TDataSet.DefaultConvertToDateTime(this,aValue,aRaiseError);
      return Result;
    };
    this.DateTimeToNativeDateTime = function (aValue) {
      var Result = undefined;
      if (this.FDataSet != null) {
        Result = this.FDataSet.ConvertDateTimeToNative(this,aValue)}
       else Result = $mod.TDataSet.DefaultConvertDateTimeToNative(this,aValue);
      return Result;
    };
    this.GetAsDateTime = function () {
      var Result = 0.0;
      Result = this.ConvertToDateTime(this.GetData(),false);
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      Result = this.GetAsDateTime();
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      this.GetText({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},false);
      return Result;
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      Result = this.GetData();
      if (!rtl.isString(Result) && !rtl.isObject(Result)) Result = null;
      return Result;
    };
    this.GetDataSize = function () {
      var Result = 0;
      Result = $mod.TField.GetDataSize.call(this);
      return Result;
    };
    this.GetText = function (AText, ADisplayText) {
      var R = 0.0;
      var F = "";
      R = this.ConvertToDateTime(this.GetData(),false);
      if (R === 0) {
        AText.set("")}
       else {
        if (ADisplayText && (this.FDisplayFormat.length !== 0)) {
          F = this.FDisplayFormat}
         else {
          var $tmp = this.FDataType;
          if ($tmp === $mod.TFieldType.ftTime) {
            F = pas.SysUtils.FormatSettings.LongTimeFormat}
           else if ($tmp === $mod.TFieldType.ftDate) {
            F = pas.SysUtils.FormatSettings.ShortDateFormat}
           else {
            F = "c";
          };
        };
        AText.set(pas.SysUtils.FormatDateTime(F,R));
      };
    };
    this.SetAsDateTime = function (AValue) {
      this.SetData(this.DateTimeToNativeDateTime(AValue));
    };
    this.SetAsFloat = function (AValue) {
      this.SetAsDateTime(AValue);
    };
    this.SetAsString = function (AValue) {
      var R = 0.0;
      if (AValue !== "") {
        R = pas.SysUtils.StrToDateTime(AValue);
        this.SetData(this.DateTimeToNativeDateTime(R));
      } else this.SetData(null);
    };
    this.SetVarValue = function (AValue) {
      this.SetAsDateTime(this.ConvertToDateTime(AValue,true));
    };
    this.Create$1 = function (AOwner) {
      $mod.TField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftDateTime);
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("DisplayFormat",2,rtl.string,"FDisplayFormat","SetDisplayFormat");
  });
  rtl.createClass(this,"TDateField",this.TDateTimeField,function () {
    this.Create$1 = function (AOwner) {
      $mod.TDateTimeField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftDate);
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TTimeField",this.TDateTimeField,function () {
    this.SetAsString = function (AValue) {
      var R = 0.0;
      if (AValue !== "") {
        R = pas.SysUtils.StrToTime(AValue);
        this.SetData(this.DateTimeToNativeDateTime(R));
      } else this.SetData(null);
    };
    this.Create$1 = function (AOwner) {
      $mod.TDateTimeField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftTime);
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TBinaryField",this.TField,function () {
    this.CheckTypeSize = function (AValue) {
      if (AValue < 1) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SInvalidFieldSize"),pas.System.VarRecs(0,AValue));
    };
    this.BlobToBytes = function (aValue) {
      var Result = [];
      if (this.FDataSet != null) {
        Result = this.FDataSet.BlobDataToBytes(aValue)}
       else Result = $mod.TDataSet.DefaultBlobDataToBytes(aValue);
      return Result;
    };
    this.BytesToBlob = function (aValue) {
      var Result = undefined;
      if (this.FDataSet != null) {
        Result = this.FDataSet.BytesToBlobData(rtl.arrayRef(aValue))}
       else Result = $mod.TDataSet.DefaultBytesToBlobData(rtl.arrayRef(aValue));
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      var V = undefined;
      var S = [];
      var I = 0;
      Result = "";
      V = this.GetData();
      if (V != null) if (this.FDataType === $mod.TFieldType.ftMemo) {
        Result = "" + V}
       else {
        S = this.BlobToBytes(V);
        for (var $l = 0, $end = rtl.length(S) - 1; $l <= $end; $l++) {
          I = $l;
          Result = Result.concat(String.fromCharCode(S[I]));
        };
      };
      return Result;
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      Result = this.GetData();
      return Result;
    };
    this.GetValue = function (AValue) {
      var Result = false;
      var V = undefined;
      V = this.GetData();
      Result = V != null;
      if (Result) {
        AValue.set(this.BlobToBytes(V))}
       else AValue.set(rtl.arraySetLength(AValue.get(),0,0));
      return Result;
    };
    this.SetAsString = function (AValue) {
      var B = [];
      var i = 0;
      if (this.FDataType === $mod.TFieldType.ftMemo) {
        this.SetData(AValue)}
       else {
        B = rtl.arraySetLength(B,0,AValue.length);
        for (var $l = 1, $end = AValue.length; $l <= $end; $l++) {
          i = $l;
          B[i - 1] = AValue.charCodeAt(i - 1);
        };
        this.SetAsBytes(B);
      };
    };
    this.SetVarValue = function (AValue) {
      var B = [];
      var I = 0;
      var Len = 0;
      if (rtl.isArray(AValue)) {
        Len = rtl.length(AValue);
        B = rtl.arraySetLength(B,0,Len);
        for (var $l = 1, $end = Len - 1; $l <= $end; $l++) {
          I = $l;
          B[I] = AValue[I];
        };
        this.SetAsBytes(B);
      } else if (rtl.isString(AValue)) {
        this.SetAsString("" + AValue)}
       else this.RaiseAccessError("Blob");
    };
    this.GetAsBytes = function () {
      var Result = [];
      var V = undefined;
      V = this.GetData();
      if (pas.System.Assigned(V)) {
        Result = this.BlobToBytes(V)}
       else Result = rtl.arraySetLength(Result,0,0);
      return Result;
    };
    this.SetAsBytes = function (aValue) {
      this.SetData(this.BytesToBlob(rtl.arrayRef(aValue)));
    };
    this.Create$1 = function (AOwner) {
      $mod.TField.Create$1.call(this,AOwner);
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("Size",2,rtl.longint,"FSize","SetSize",{Default: 16});
  });
  this.TBlobDisplayValue = {"0": "dvClass", dvClass: 0, "1": "dvFull", dvFull: 1, "2": "dvClip", dvClip: 2, "3": "dvFit", dvFit: 3};
  this.$rtti.$Enum("TBlobDisplayValue",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TBlobDisplayValue});
  this.TBlobStreamMode = {"0": "bmRead", bmRead: 0, "1": "bmWrite", bmWrite: 1, "2": "bmReadWrite", bmReadWrite: 2};
  this.$rtti.$Enum("TBlobStreamMode",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TBlobStreamMode});
  this.$rtti.$Enum("TBlobType",{minvalue: 10, maxvalue: 11, ordtype: 1, enumtype: this.TFieldType});
  rtl.createClass(this,"TBlobField",this.TBinaryField,function () {
    this.$init = function () {
      $mod.TBinaryField.$init.call(this);
      this.FDisplayValue = 0;
      this.FModified = false;
    };
    this.GetBlobType = function () {
      var Result = $mod.TFieldType.ftBlob;
      Result = $mod.TFieldType.ftBlob;
      return Result;
    };
    this.SetBlobType = function (AValue) {
      this.SetFieldType(AValue);
    };
    this.SetDisplayValue = function (AValue) {
      if (this.FDisplayValue === AValue) return;
      this.FDisplayValue = AValue;
      this.PropertyChanged(false);
    };
    this.CheckTypeSize = function (AValue) {
      if (AValue < 0) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SInvalidFieldSize"),pas.System.VarRecs(0,AValue));
    };
    this.GetBlobSize = function () {
      var Result = 0;
      var B = [];
      B = this.GetAsBytes();
      Result = rtl.length(B);
      return Result;
    };
    this.GetIsNull = function () {
      var Result = false;
      if (!this.FModified) {
        Result = $mod.TField.GetIsNull.call(this)}
       else Result = this.GetBlobSize() === 0;
      return Result;
    };
    this.GetText = function (AText, ADisplayText) {
      var $tmp = this.FDisplayValue;
      if ($tmp === $mod.TBlobDisplayValue.dvClass) {
        AText.set(this.GetClassDesc())}
       else if ($tmp === $mod.TBlobDisplayValue.dvFull) {
        AText.set(this.GetAsString())}
       else if ($tmp === $mod.TBlobDisplayValue.dvClip) {
        AText.set(this.GetAsString());
        if (ADisplayText && (AText.get().length > this.GetDisplayWidth())) AText.set(pas.System.Copy(this.GetEditText(),1,this.GetDisplayWidth()) + "...");
      } else if ($tmp === $mod.TBlobDisplayValue.dvFit) {
        AText.set(this.GetAsString());
        if (ADisplayText && (AText.get().length > this.GetDisplayWidth())) AText.set(this.GetClassDesc());
      };
    };
    this.Create$1 = function (AOwner) {
      $mod.TBinaryField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftBlob);
      return this;
    };
    this.Clear = function () {
      this.SetData(null);
    };
    this.IsBlob = function () {
      var Result = false;
      Result = true;
      return Result;
    };
    this.SetFieldType = function (AValue) {
      if (AValue in $mod.ftBlobTypes) this.SetDataType(AValue);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("DisplayValue",2,$mod.$rtti["TBlobDisplayValue"],"FDisplayValue","SetDisplayValue",{Default: $mod.TBlobDisplayValue.dvClass});
    $r.addProperty("BlobType",3,$mod.$rtti["TBlobType"],"GetBlobType","SetBlobType");
    $r.addProperty("Size",2,rtl.longint,"FSize","SetSize",{Default: 0});
  });
  rtl.createClass(this,"TMemoField",this.TBlobField,function () {
    this.Create$1 = function (AOwner) {
      $mod.TBlobField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftMemo);
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TVariantField",this.TField,function () {
    this.CheckTypeSize = function (aValue) {
    };
    this.GetAsBoolean = function () {
      var Result = false;
      Result = this.GetAsJSValue() == true;
      return Result;
    };
    this.SetAsBoolean = function (aValue) {
      this.SetVarValue(aValue);
    };
    this.GetAsDateTime = function () {
      var Result = 0.0;
      var V = undefined;
      V = this.GetData();
      if (this.FDataSet != null) {
        Result = this.FDataSet.ConvertToDateTime(this,V,true)}
       else Result = $mod.TDataSet.DefaultConvertToDateTime(this,V,true);
      return Result;
    };
    this.SetAsDateTime = function (aValue) {
      this.SetVarValue(aValue);
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      var V = undefined;
      V = this.GetData();
      if (rtl.isNumber(V)) {
        Result = rtl.getNumber(V)}
       else if (rtl.isString(V)) {
        Result = parseFloat("" + V)}
       else this.RaiseAccessError("Variant");
      return Result;
    };
    this.SetAsFloat = function (aValue) {
      this.SetVarValue(aValue);
    };
    this.GetAsInteger = function () {
      var Result = 0;
      var V = undefined;
      V = this.GetData();
      if (pas.JS.isInteger(V)) {
        Result = rtl.trunc(V)}
       else if (rtl.isString(V)) {
        Result = parseInt("" + V)}
       else this.RaiseAccessError("Variant");
      return Result;
    };
    this.SetAsInteger = function (AValue) {
      this.SetVarValue(AValue);
    };
    this.GetAsString = function () {
      var Result = "";
      var V = undefined;
      V = this.GetData();
      if (pas.JS.isInteger(V)) {
        Result = pas.SysUtils.IntToStr(rtl.trunc(V))}
       else if (rtl.isNumber(V)) {
        Result = pas.SysUtils.FloatToStr(rtl.getNumber(V))}
       else if (rtl.isString(V)) {
        Result = "" + V}
       else this.RaiseAccessError("Variant");
      return Result;
    };
    this.SetAsString = function (aValue) {
      this.SetVarValue(aValue);
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      Result = this.GetData();
      return Result;
    };
    this.SetVarValue = function (aValue) {
      this.SetData(aValue);
    };
    this.Create$1 = function (AOwner) {
      $mod.TField.Create$1.call(this,AOwner);
      this.SetDataType($mod.TFieldType.ftVariant);
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TDataSetField",this.TField,function () {
    this.$init = function () {
      $mod.TField.$init.call(this);
      this.FNestedDataSet = null;
    };
    this.$final = function () {
      this.FNestedDataSet = undefined;
      $mod.TField.$final.call(this);
    };
    this.AssignNestedDataSet = function (Value) {
      if (this.FNestedDataSet != null) {
        this.FNestedDataSet.Close();
        this.FNestedDataSet.FDataSetField = null;
        if (this.FDataSet != null) this.FDataSet.GetNestedDataSets().Remove(this.FNestedDataSet);
      };
      if (Value != null) this.FDataSet.GetNestedDataSets().Add(Value);
      this.FNestedDataSet = Value;
    };
    this.Bind = function (Binding) {
      $mod.TField.Bind.apply(this,arguments);
      if (this.FNestedDataSet != null) if (Binding) {
        if (this.FNestedDataSet.FState === $mod.TDataSetState.dsInactive) this.FNestedDataSet.Open();
      } else this.FNestedDataSet.Close();
    };
    this.Create$1 = function (AOwner) {
      $mod.TField.Create$1.apply(this,arguments);
      this.SetDataType($mod.TFieldType.ftDataset);
      return this;
    };
    this.Destroy = function () {
      this.AssignNestedDataSet(null);
      $mod.TField.Destroy.call(this);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  this.$rtti.$Class("TIndexDefs");
  this.TIndexOption = {"0": "ixPrimary", ixPrimary: 0, "1": "ixUnique", ixUnique: 1, "2": "ixDescending", ixDescending: 2, "3": "ixCaseInsensitive", ixCaseInsensitive: 3, "4": "ixExpression", ixExpression: 4, "5": "ixNonMaintained", ixNonMaintained: 5};
  this.$rtti.$Enum("TIndexOption",{minvalue: 0, maxvalue: 5, ordtype: 1, enumtype: this.TIndexOption});
  this.$rtti.$Set("TIndexOptions",{comptype: this.$rtti["TIndexOption"]});
  rtl.createClass(this,"TIndexDef",this.TNamedItem,function () {
    this.$init = function () {
      $mod.TNamedItem.$init.call(this);
      this.FCaseinsFields = "";
      this.FDescFields = "";
      this.FExpression = "";
      this.FFields = "";
      this.FOptions = {};
      this.FSource = "";
    };
    this.$final = function () {
      this.FOptions = undefined;
      $mod.TNamedItem.$final.call(this);
    };
    this.GetExpression = function () {
      var Result = "";
      Result = this.FExpression;
      return Result;
    };
    this.SetCaseInsFields = function (AValue) {
      if (this.FCaseinsFields === AValue) return;
      if (AValue !== "") this.FOptions = rtl.unionSet(this.FOptions,rtl.createSet($mod.TIndexOption.ixCaseInsensitive));
      this.FCaseinsFields = AValue;
    };
    this.SetDescFields = function (AValue) {
      if (this.FDescFields === AValue) return;
      if (AValue !== "") this.FOptions = rtl.unionSet(this.FOptions,rtl.createSet($mod.TIndexOption.ixDescending));
      this.FDescFields = AValue;
    };
    this.SetExpression = function (AValue) {
      this.FExpression = AValue;
    };
    this.Create$2 = function (Owner, AName, TheFields, TheOptions) {
      this.FName = AName;
      pas.Classes.TCollectionItem.Create$1.call(this,Owner);
      this.FFields = TheFields;
      this.FOptions = rtl.refSet(TheOptions);
      return this;
    };
    this.Assign = function (Source) {
      var idef = null;
      idef = null;
      if ($mod.TIndexDef.isPrototypeOf(Source)) idef = rtl.as(Source,$mod.TIndexDef);
      if (idef != null) {
        this.FName = idef.FName;
        this.FFields = idef.FFields;
        this.FOptions = rtl.refSet(idef.FOptions);
        this.FCaseinsFields = idef.FCaseinsFields;
        this.FDescFields = idef.FDescFields;
        this.FSource = idef.FSource;
        this.FExpression = idef.GetExpression();
      } else pas.Classes.TPersistent.Assign.call(this,Source);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["Owner",$mod.$rtti["TIndexDefs"]],["AName",rtl.string,2],["TheFields",rtl.string,2],["TheOptions",$mod.$rtti["TIndexOptions"]]]);
    $r.addProperty("Expression",3,rtl.string,"GetExpression","SetExpression");
    $r.addProperty("Fields",0,rtl.string,"FFields","FFields");
    $r.addProperty("CaseInsFields",2,rtl.string,"FCaseinsFields","SetCaseInsFields");
    $r.addProperty("DescFields",2,rtl.string,"FDescFields","SetDescFields");
    $r.addProperty("Options",0,$mod.$rtti["TIndexOptions"],"FOptions","FOptions");
    $r.addProperty("Source",0,rtl.string,"FSource","FSource");
  });
  this.$rtti.$ClassRef("TIndexDefClass",{instancetype: this.$rtti["TIndexDef"]});
  rtl.createClass(this,"TIndexDefs",this.TDefCollection,function () {
    this.GetItem$1 = function (Index) {
      var Result = null;
      Result = rtl.as(pas.Classes.TCollection.GetItem.call(this,Index),$mod.TIndexDef);
      return Result;
    };
    this.SetItem$1 = function (Index, Value) {
      pas.Classes.TCollection.SetItem.call(this,Index,Value);
    };
    this.Create$4 = function (ADataSet) {
      $mod.TDefCollection.create$3.call(this,ADataSet,this.Owner(),$mod.TIndexDef);
      return this;
    };
    this.Add$1 = function (Name, Fields, Options) {
      this.FItemClass.$create("Create$2",[this,Name,Fields,rtl.refSet(Options)]);
    };
    this.AddIndexDef = function () {
      var Result = null;
      Result = this.FItemClass.$create("Create$2",[this,"","",{}]);
      return Result;
    };
    this.Find$1 = function (IndexName) {
      var Result = null;
      Result = rtl.as($mod.TDefCollection.Find.call(this,IndexName),$mod.TIndexDef);
      if (Result === null) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SIndexNotFound"),pas.System.VarRecs(18,IndexName),this.FDataset);
      return Result;
    };
    this.FindIndexForFields = function (Fields) {
      var Result = null;
      Result = null;
      return Result;
    };
    this.GetIndexForFields = function (Fields, CaseInsensitive) {
      var Result = null;
      var i = 0;
      var FieldsLen = 0;
      var Last = null;
      Last = null;
      FieldsLen = Fields.length;
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        Result = this.GetItem$1(i);
        if (rtl.eqSet(rtl.intersectSet(Result.FOptions,rtl.createSet($mod.TIndexOption.ixDescending,$mod.TIndexOption.ixExpression)),{}) && (!CaseInsensitive || ($mod.TIndexOption.ixCaseInsensitive in Result.FOptions)) && pas.SysUtils.AnsiSameText(Fields,Result.FFields)) {
          return Result;
        } else if (pas.SysUtils.AnsiSameText(Fields,pas.System.Copy(Result.FFields,1,FieldsLen)) && ((Result.FFields.length === FieldsLen) || (Result.FFields.charAt((FieldsLen + 1) - 1) === ";"))) {
          if ((Last === null) || ((Last !== null) && (Last.FFields.length > Result.FFields.length))) Last = Result;
        };
      };
      Result = Last;
      return Result;
    };
    this.Update$1 = function () {
      if (!this.FUpdated && (this.FDataset != null)) {
        this.FDataset.UpdateIndexDefs();
        this.FUpdated = true;
      };
    };
    var $r = this.$rtti;
    $r.addMethod("Create$4",2,[["ADataSet",$mod.$rtti["TDataSet"]]]);
  });
  rtl.createClass(this,"TCheckConstraint",pas.Classes.TCollectionItem,function () {
    this.$init = function () {
      pas.Classes.TCollectionItem.$init.call(this);
      this.FCustomConstraint = "";
      this.FErrorMessage = "";
      this.FFromDictionary = false;
      this.FImportedConstraint = "";
    };
    this.Assign = function (Source) {
    };
    var $r = this.$rtti;
    $r.addProperty("CustomConstraint",0,rtl.string,"FCustomConstraint","FCustomConstraint");
    $r.addProperty("ErrorMessage",0,rtl.string,"FErrorMessage","FErrorMessage");
    $r.addProperty("FromDictionary",0,rtl.boolean,"FFromDictionary","FFromDictionary");
    $r.addProperty("ImportedConstraint",0,rtl.string,"FImportedConstraint","FImportedConstraint");
  });
  rtl.createClass(this,"TCheckConstraints",pas.Classes.TCollection,function () {
    this.GetItem$1 = function (Index) {
      var Result = null;
      Result = null;
      return Result;
    };
    this.SetItem$1 = function (index, Value) {
    };
    this.GetOwner = function () {
      var Result = null;
      Result = null;
      return Result;
    };
    this.Create$2 = function (AOwner) {
      pas.Classes.TCollection.Create$1.call(this,$mod.TCheckConstraint);
      return this;
    };
    this.Add$1 = function () {
      var Result = null;
      Result = null;
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["AOwner",pas.Classes.$rtti["TPersistent"]]]);
  });
  rtl.createClass(this,"TFieldsEnumerator",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FPosition = 0;
      this.FFields = null;
    };
    this.$final = function () {
      this.FFields = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.GetCurrent = function () {
      var Result = null;
      Result = this.FFields.GetField(this.FPosition);
      return Result;
    };
    this.Create$1 = function (AFields) {
      pas.System.TObject.Create.call(this);
      this.FFields = AFields;
      this.FPosition = -1;
      return this;
    };
    this.MoveNext = function () {
      var Result = false;
      this.FPosition += 1;
      Result = this.FPosition < this.FFields.GetCount();
      return Result;
    };
  });
  rtl.createClass(this,"TFields",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FDataset = null;
      this.FFieldList = null;
      this.FOnChange = null;
      this.FValidFieldKinds = {};
    };
    this.$final = function () {
      this.FDataset = undefined;
      this.FFieldList = undefined;
      this.FOnChange = undefined;
      this.FValidFieldKinds = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.ClearFieldDefs = function () {
      var i = 0;
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        this.GetField(i).FFieldDef = null;
      };
    };
    this.Changed = function () {
      if ((this.FDataset !== null) && !(pas.Classes.TComponentStateItem.csDestroying in this.FDataset.FComponentState)) this.FDataset.DataEvent($mod.TDataEvent.deFieldListChange,0);
      if (this.FOnChange != null) this.FOnChange(this);
    };
    this.CheckfieldKind = function (Fieldkind, Field) {
      if (!(Fieldkind in this.FValidFieldKinds)) $mod.DatabaseErrorFmt(rtl.getResStr(pas.DBConst,"SInvalidFieldKind"),pas.System.VarRecs(18,Field.FFieldName));
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FFieldList.FCount;
      return Result;
    };
    this.GetField = function (Index) {
      var Result = null;
      Result = rtl.getObject(this.FFieldList.Get(Index));
      return Result;
    };
    this.SetField = function (Index, Value) {
      this.GetField(Index).Assign(Value);
    };
    this.SetFieldIndex = function (Field, Value) {
      var Old = 0;
      Old = this.FFieldList.IndexOf(Field);
      if (Old === -1) return;
      if (Value < 0) Value = 0;
      if (Value >= this.GetCount()) Value = this.GetCount() - 1;
      if (Value !== Old) {
        this.FFieldList.Delete(Old);
        this.FFieldList.Insert(Value,Field);
        Field.PropertyChanged(true);
        this.Changed();
      };
    };
    this.Create$1 = function (ADataset) {
      this.FDataset = ADataset;
      this.FFieldList = pas.Classes.TFPList.$create("Create");
      this.FValidFieldKinds = rtl.createSet(null,$mod.TFieldKind.fkData,$mod.TFieldKind.fkInternalCalc);
      return this;
    };
    this.Destroy = function () {
      if (this.FFieldList != null) this.Clear();
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FFieldList;
        }, set: function (v) {
          this.p.FFieldList = v;
        }});
      pas.System.TObject.Destroy.call(this);
    };
    this.Add = function (Field) {
      this.CheckFieldName(Field.FFieldName);
      this.FFieldList.Add(Field);
      Field.FFields = this;
      this.Changed();
    };
    this.CheckFieldName = function (Value) {
      if (this.FindField(Value) !== null) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SDuplicateFieldName"),pas.System.VarRecs(18,Value),this.FDataset);
    };
    this.CheckFieldNames = function (Value) {
      var N = "";
      var StrPos = 0;
      if (Value === "") return;
      StrPos = 1;
      do {
        N = $mod.ExtractFieldName(Value,{get: function () {
            return StrPos;
          }, set: function (v) {
            StrPos = v;
          }});
        this.FieldByName(N);
      } while (!(StrPos > Value.length));
    };
    this.Clear = function () {
      var AField = null;
      while (this.FFieldList.FCount > 0) {
        AField = rtl.getObject(this.FFieldList.Last());
        AField.FDataSet = null;
        AField = rtl.freeLoc(AField);
        this.FFieldList.Delete(this.FFieldList.FCount - 1);
      };
      this.Changed();
    };
    this.FindField = function (Value) {
      var Result = null;
      var S = "";
      var I = 0;
      S = pas.SysUtils.UpperCase(Value);
      for (var $l = 0, $end = this.FFieldList.FCount - 1; $l <= $end; $l++) {
        I = $l;
        Result = rtl.getObject(this.FFieldList.Get(I));
        if (S === pas.SysUtils.UpperCase(Result.FFieldName)) {
          return Result;
        };
      };
      Result = null;
      return Result;
    };
    this.FieldByName = function (Value) {
      var Result = null;
      Result = this.FindField(Value);
      if (Result === null) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SFieldNotFound"),pas.System.VarRecs(18,Value),this.FDataset);
      return Result;
    };
    this.FieldByNumber = function (FieldNo) {
      var Result = null;
      var i = 0;
      for (var $l = 0, $end = this.FFieldList.FCount - 1; $l <= $end; $l++) {
        i = $l;
        Result = rtl.getObject(this.FFieldList.Get(i));
        if (FieldNo === Result.FFieldNo) return Result;
      };
      Result = null;
      return Result;
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = $mod.TFieldsEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.GetFieldNames = function (Values) {
      var i = 0;
      Values.Clear();
      for (var $l = 0, $end = this.FFieldList.FCount - 1; $l <= $end; $l++) {
        i = $l;
        Values.Add(rtl.getObject(this.FFieldList.Get(i)).FFieldName);
      };
    };
    this.IndexOf = function (Field) {
      var Result = 0;
      Result = this.FFieldList.IndexOf(Field);
      return Result;
    };
    this.Remove = function (Value) {
      this.FFieldList.Remove(Value);
      Value.FFields = null;
      this.Changed();
    };
  });
  this.$rtti.$ClassRef("TFieldsClass",{instancetype: this.$rtti["TFields"]});
  this.$rtti.$DynArray("TParamBinding",{eltype: rtl.longint});
  this.TParamType = {"0": "ptUnknown", ptUnknown: 0, "1": "ptInput", ptInput: 1, "2": "ptOutput", ptOutput: 2, "3": "ptInputOutput", ptInputOutput: 3, "4": "ptResult", ptResult: 4};
  this.$rtti.$Enum("TParamType",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TParamType});
  this.$rtti.$Set("TParamTypes",{comptype: this.$rtti["TParamType"]});
  this.TParamStyle = {"0": "psInterbase", psInterbase: 0, "1": "psPostgreSQL", psPostgreSQL: 1, "2": "psSimulated", psSimulated: 2};
  this.$rtti.$Enum("TParamStyle",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TParamStyle});
  this.$rtti.$Class("TParams");
  rtl.createClass(this,"TParam",pas.Classes.TCollectionItem,function () {
    this.$init = function () {
      pas.Classes.TCollectionItem.$init.call(this);
      this.FValue = undefined;
      this.FPrecision = 0;
      this.FNumericScale = 0;
      this.FName = "";
      this.FDataType = 0;
      this.FBound = false;
      this.FParamType = 0;
      this.FSize = 0;
    };
    this.GetDataSet = function () {
      var Result = null;
      if ((this.FCollection != null) && $mod.TParams.isPrototypeOf(this.FCollection)) {
        Result = this.FCollection.GetDataSet()}
       else Result = null;
      return Result;
    };
    this.IsParamStored = function () {
      var Result = false;
      Result = this.FBound;
      return Result;
    };
    this.AssignParam = function (Param) {
      if (!(Param != null)) {
        this.Clear();
        this.FDataType = $mod.TFieldType.ftUnknown;
        this.FParamType = $mod.TParamType.ptUnknown;
        this.FName = "";
        this.FSize = 0;
        this.FPrecision = 0;
        this.FNumericScale = 0;
      } else {
        this.FDataType = Param.FDataType;
        if (Param.GetIsNull()) {
          this.Clear()}
         else this.FValue = Param.FValue;
        this.FBound = Param.FBound;
        this.FName = Param.FName;
        if (this.FParamType === $mod.TParamType.ptUnknown) this.FParamType = Param.FParamType;
        this.FSize = Param.FSize;
        this.FPrecision = Param.FPrecision;
        this.FNumericScale = Param.FNumericScale;
      };
    };
    this.AssignTo = function (Dest) {
      if ($mod.TField.isPrototypeOf(Dest)) {
        this.AssignToField(Dest)}
       else pas.Classes.TPersistent.AssignTo.call(this,Dest);
    };
    this.GetAsBoolean = function () {
      var Result = false;
      if (this.GetIsNull()) {
        Result = false}
       else Result = this.FValue == true;
      return Result;
    };
    this.GetAsBytes = function () {
      var Result = [];
      if (this.GetIsNull()) {
        Result = []}
       else if (rtl.isArray(this.FValue)) Result = this.FValue;
      return Result;
    };
    this.GetAsDateTime = function () {
      var Result = 0.0;
      if (this.GetIsNull()) {
        Result = 0.0}
       else Result = rtl.getNumber(this.FValue);
      return Result;
    };
    this.GetAsFloat = function () {
      var Result = 0.0;
      if (this.GetIsNull()) {
        Result = 0.0}
       else Result = rtl.getNumber(this.FValue);
      return Result;
    };
    this.GetAsInteger = function () {
      var Result = 0;
      if (this.GetIsNull() || !pas.JS.isInteger(this.FValue)) {
        Result = 0}
       else Result = rtl.trunc(this.FValue);
      return Result;
    };
    this.GetAsLargeInt = function () {
      var Result = 0;
      if (this.GetIsNull() || !pas.JS.isInteger(this.FValue)) {
        Result = 0}
       else Result = rtl.trunc(this.FValue);
      return Result;
    };
    this.GetAsMemo = function () {
      var Result = "";
      if (this.GetIsNull() || !rtl.isString(this.FValue)) {
        Result = ""}
       else Result = "" + this.FValue;
      return Result;
    };
    this.GetAsString = function () {
      var Result = "";
      if (this.GetIsNull() || !rtl.isString(this.FValue)) {
        Result = ""}
       else Result = "" + this.FValue;
      return Result;
    };
    this.GetAsJSValue = function () {
      var Result = undefined;
      if (this.GetIsNull()) {
        Result = null}
       else Result = this.FValue;
      return Result;
    };
    this.GetDisplayName = function () {
      var Result = "";
      if (this.FName !== "") {
        Result = this.FName}
       else Result = pas.Classes.TCollectionItem.GetDisplayName.call(this);
      return Result;
    };
    this.GetIsNull = function () {
      var Result = false;
      Result = pas.JS.isNull(this.FValue);
      return Result;
    };
    this.IsEqual = function (AValue) {
      var Result = false;
      Result = (this.FName === AValue.FName) && (this.GetIsNull() === AValue.GetIsNull()) && (this.FBound === AValue.FBound) && (this.FDataType === AValue.FDataType) && (this.FParamType === AValue.FParamType) && (pas.JS.GetValueType(this.FValue) === pas.JS.GetValueType(AValue.FValue)) && (this.FValue == AValue.FValue);
      return Result;
    };
    this.SetAsBlob = function (AValue) {
      this.FDataType = $mod.TFieldType.ftBlob;
      this.FValue = AValue;
    };
    this.SetAsBoolean = function (AValue) {
      this.FDataType = $mod.TFieldType.ftBoolean;
      this.FValue = AValue;
    };
    this.SetAsBytes = function (AValue) {
    };
    this.SetAsDate = function (AValue) {
      this.FDataType = $mod.TFieldType.ftDate;
      this.FValue = AValue;
    };
    this.SetAsDateTime = function (AValue) {
      this.FDataType = $mod.TFieldType.ftDateTime;
      this.FValue = AValue;
    };
    this.SetAsFloat = function (AValue) {
      this.FDataType = $mod.TFieldType.ftFloat;
      this.FValue = AValue;
    };
    this.SetAsInteger = function (AValue) {
      this.FDataType = $mod.TFieldType.ftInteger;
      this.FValue = AValue;
    };
    this.SetAsLargeInt = function (AValue) {
      this.FDataType = $mod.TFieldType.ftLargeInt;
      this.FValue = AValue;
    };
    this.SetAsMemo = function (AValue) {
      this.FDataType = $mod.TFieldType.ftMemo;
      this.FValue = AValue;
    };
    this.SetAsString = function (AValue) {
      if (this.FDataType !== $mod.TFieldType.ftFixedChar) this.FDataType = $mod.TFieldType.ftString;
      this.FValue = AValue;
    };
    this.SetAsTime = function (AValue) {
      this.FDataType = $mod.TFieldType.ftTime;
      this.FValue = AValue;
    };
    this.SetAsJSValue = function (AValue) {
      this.FValue = AValue;
      this.FBound = !pas.JS.isNull(AValue);
      if (this.FBound) {
        var $tmp = pas.JS.GetValueType(AValue);
        if ($tmp === pas.JS.TJSValueType.jvtBoolean) {
          this.FDataType = $mod.TFieldType.ftBoolean}
         else if ($tmp === pas.JS.TJSValueType.jvtInteger) {
          this.FDataType = $mod.TFieldType.ftInteger}
         else if ($tmp === pas.JS.TJSValueType.jvtFloat) {
          this.FDataType = $mod.TFieldType.ftFloat}
         else if (($tmp === pas.JS.TJSValueType.jvtObject) || ($tmp === pas.JS.TJSValueType.jvtArray)) this.FDataType = $mod.TFieldType.ftBlob;
      };
    };
    this.SetDataType = function (AValue) {
      this.FDataType = AValue;
    };
    this.SetText = function (AValue) {
      this.SetAsJSValue(AValue);
    };
    this.Create$1 = function (ACollection) {
      pas.Classes.TCollectionItem.Create$1.call(this,ACollection);
      this.FParamType = $mod.TParamType.ptUnknown;
      this.SetDataType($mod.TFieldType.ftUnknown);
      this.FValue = null;
      return this;
    };
    this.Create$3 = function (AParams, AParamType) {
      this.Create$1(AParams);
      this.FParamType = AParamType;
      return this;
    };
    this.Assign = function (Source) {
      if ($mod.TParam.isPrototypeOf(Source)) {
        this.AssignParam(Source)}
       else if ($mod.TField.isPrototypeOf(Source)) {
        this.AssignField(Source)}
       else if (pas.Classes.TStrings.isPrototypeOf(Source)) {
        this.SetAsMemo(Source.GetTextStr())}
       else pas.Classes.TPersistent.Assign.call(this,Source);
    };
    this.AssignField = function (Field) {
      if (Field != null) {
        this.AssignFieldValue(Field,Field.GetAsJSValue());
        this.FName = Field.FFieldName;
      } else {
        this.Clear();
        this.FName = "";
      };
    };
    this.AssignToField = function (Field) {
      if (Field != null) {
        var $tmp = this.FDataType;
        if ($tmp === $mod.TFieldType.ftUnknown) {
          $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SUnknownParamFieldType"),pas.System.VarRecs(18,this.FName),this.GetDataSet())}
         else if (($tmp === $mod.TFieldType.ftInteger) || ($tmp === $mod.TFieldType.ftAutoInc)) {
          Field.SetAsInteger(this.GetAsInteger())}
         else if ($tmp === $mod.TFieldType.ftFloat) {
          Field.SetAsFloat(this.GetAsFloat())}
         else if ($tmp === $mod.TFieldType.ftBoolean) {
          Field.SetAsBoolean(this.GetAsBoolean())}
         else if (($tmp === $mod.TFieldType.ftBlob) || ($tmp === $mod.TFieldType.ftString) || ($tmp === $mod.TFieldType.ftMemo) || ($tmp === $mod.TFieldType.ftFixedChar)) {
          Field.SetAsString(this.GetAsString())}
         else if (($tmp === $mod.TFieldType.ftTime) || ($tmp === $mod.TFieldType.ftDate) || ($tmp === $mod.TFieldType.ftDateTime)) Field.SetAsDateTime(this.GetAsDateTime());
      };
    };
    this.AssignFieldValue = function (Field, AValue) {
      if (Field != null) {
        if ((Field.FDataType === $mod.TFieldType.ftString) && Field.FFixedChar) {
          this.FDataType = $mod.TFieldType.ftFixedChar}
         else if ((Field.FDataType === $mod.TFieldType.ftMemo) && (Field.FSize > 255)) {
          this.FDataType = $mod.TFieldType.ftString}
         else this.FDataType = Field.FDataType;
        if (pas.JS.isNull(AValue)) {
          this.Clear()}
         else this.SetAsJSValue(AValue);
        this.FSize = Field.GetDataSize();
        this.FBound = true;
      };
    };
    this.AssignFromField = function (Field) {
      if (Field != null) {
        this.FDataType = Field.FDataType;
        var $tmp = Field.FDataType;
        if ($tmp === $mod.TFieldType.ftUnknown) {
          $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SUnknownParamFieldType"),pas.System.VarRecs(18,this.FName),this.GetDataSet())}
         else if (($tmp === $mod.TFieldType.ftInteger) || ($tmp === $mod.TFieldType.ftAutoInc)) {
          this.SetAsInteger(Field.GetAsInteger())}
         else if ($tmp === $mod.TFieldType.ftFloat) {
          this.SetAsFloat(Field.GetAsFloat())}
         else if ($tmp === $mod.TFieldType.ftBoolean) {
          this.SetAsBoolean(Field.GetAsBoolean())}
         else if (($tmp === $mod.TFieldType.ftBlob) || ($tmp === $mod.TFieldType.ftString) || ($tmp === $mod.TFieldType.ftMemo) || ($tmp === $mod.TFieldType.ftFixedChar)) {
          this.SetAsString(Field.GetAsString())}
         else if (($tmp === $mod.TFieldType.ftTime) || ($tmp === $mod.TFieldType.ftDate) || ($tmp === $mod.TFieldType.ftDateTime)) this.SetAsDateTime(Field.GetAsDateTime());
      };
    };
    this.Clear = function () {
      this.FValue = null;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ACollection",pas.Classes.$rtti["TCollection"]]]);
    $r.addMethod("Create$3",2,[["AParams",$mod.$rtti["TParams"]],["AParamType",$mod.$rtti["TParamType"]]]);
    $r.addProperty("DataType",2,$mod.$rtti["TFieldType"],"FDataType","SetDataType");
    $r.addProperty("Name",0,rtl.string,"FName","FName");
    $r.addProperty("NumericScale",0,rtl.longint,"FNumericScale","FNumericScale",{Default: 0});
    $r.addProperty("ParamType",0,$mod.$rtti["TParamType"],"FParamType","FParamType");
    $r.addProperty("Precision",0,rtl.longint,"FPrecision","FPrecision",{Default: 0});
    $r.addProperty("Size",0,rtl.longint,"FSize","FSize",{Default: 0});
    $r.addProperty("Value",15,rtl.jsvalue,"GetAsJSValue","SetAsJSValue",{stored: "IsParamStored"});
  });
  this.$rtti.$ClassRef("TParamClass",{instancetype: this.$rtti["TParam"]});
  rtl.createClass(this,"TParams",pas.Classes.TCollection,function () {
    this.$init = function () {
      pas.Classes.TCollection.$init.call(this);
      this.FOwner = null;
    };
    this.$final = function () {
      this.FOwner = undefined;
      pas.Classes.TCollection.$final.call(this);
    };
    this.GetItem$1 = function (Index) {
      var Result = null;
      Result = rtl.as(pas.Classes.TCollection.GetItem.call(this,Index),$mod.TParam);
      return Result;
    };
    this.GetParamValue = function (ParamName) {
      var Result = undefined;
      Result = this.ParamByName(ParamName).GetAsJSValue();
      return Result;
    };
    this.SetItem$1 = function (Index, Value) {
      pas.Classes.TCollection.SetItem.call(this,Index,Value);
    };
    this.SetParamValue = function (ParamName, Value) {
      this.ParamByName(ParamName).SetAsJSValue(Value);
    };
    this.AssignTo = function (Dest) {
      if ($mod.TParams.isPrototypeOf(Dest)) {
        Dest.Assign(this)}
       else pas.Classes.TPersistent.AssignTo.call(this,Dest);
    };
    this.GetDataSet = function () {
      var Result = null;
      if ($mod.TDataSet.isPrototypeOf(this.FOwner)) {
        Result = this.FOwner}
       else Result = null;
      return Result;
    };
    this.GetOwner = function () {
      var Result = null;
      Result = this.FOwner;
      return Result;
    };
    this.ParamClass = function () {
      var Result = null;
      Result = $mod.TParam;
      return Result;
    };
    this.Create$2 = function (AOwner, AItemClass) {
      pas.Classes.TCollection.Create$1.call(this,AItemClass);
      this.FOwner = AOwner;
      return this;
    };
    this.Create$3 = function (AOwner) {
      this.Create$2(AOwner,this.$class.ParamClass());
      return this;
    };
    this.Create$4 = function () {
      this.Create$3(null);
      return this;
    };
    this.AddParam = function (Value) {
      Value.SetCollection(this);
    };
    this.AssignValues = function (Value) {
      var I = 0;
      var P = null;
      var PS = null;
      for (var $l = 0, $end = Value.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        PS = Value.GetItem$1(I);
        P = this.FindParam(PS.FName);
        if (P != null) P.Assign(PS);
      };
    };
    this.CreateParam = function (FldType, ParamName, ParamType) {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TParam);
      Result.FName = ParamName;
      Result.SetDataType(FldType);
      Result.FParamType = ParamType;
      return Result;
    };
    this.FindParam = function (Value) {
      var Result = null;
      var I = 0;
      Result = null;
      I = this.GetCount() - 1;
      while ((Result === null) && (I >= 0)) if (pas.SysUtils.CompareText(Value,this.GetItem$1(I).FName) === 0) {
        Result = this.GetItem$1(I)}
       else I -= 1;
      return Result;
    };
    this.GetParamList = function (List, ParamNames) {
      var P = null;
      var N = "";
      var StrPos = 0;
      if ((ParamNames === "") || (List === null)) return;
      StrPos = 1;
      do {
        N = $mod.ExtractFieldName(ParamNames,{get: function () {
            return StrPos;
          }, set: function (v) {
            StrPos = v;
          }});
        P = this.ParamByName(N);
        List.Add(P);
      } while (!(StrPos > ParamNames.length));
    };
    this.IsEqual = function (Value) {
      var Result = false;
      var I = 0;
      Result = Value.GetCount() === this.GetCount();
      I = this.GetCount() - 1;
      while (Result && (I >= 0)) {
        Result = this.GetItem$1(I).IsEqual(Value.GetItem$1(I));
        I -= 1;
      };
      return Result;
    };
    this.ParamByName = function (Value) {
      var Result = null;
      Result = this.FindParam(Value);
      if (Result === null) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SParameterNotFound"),pas.System.VarRecs(18,Value),this.GetDataSet());
      return Result;
    };
    this.ParseSQL = function (SQL, DoCreate) {
      var Result = "";
      var pb = [];
      var rs = "";
      Result = this.ParseSQL$3(SQL,DoCreate,true,true,$mod.TParamStyle.psInterbase,{get: function () {
          return pb;
        }, set: function (v) {
          pb = v;
        }},{get: function () {
          return rs;
        }, set: function (v) {
          rs = v;
        }});
      return Result;
    };
    this.ParseSQL$1 = function (SQL, DoCreate, EscapeSlash, EscapeRepeat, ParameterStyle) {
      var Result = "";
      var pb = [];
      var rs = "";
      Result = this.ParseSQL$3(SQL,DoCreate,EscapeSlash,EscapeRepeat,ParameterStyle,{get: function () {
          return pb;
        }, set: function (v) {
          pb = v;
        }},{get: function () {
          return rs;
        }, set: function (v) {
          rs = v;
        }});
      return Result;
    };
    this.ParseSQL$2 = function (SQL, DoCreate, EscapeSlash, EscapeRepeat, ParameterStyle, ParamBinding) {
      var Result = "";
      var rs = "";
      Result = this.ParseSQL$3(SQL,DoCreate,EscapeSlash,EscapeRepeat,ParameterStyle,ParamBinding,{get: function () {
          return rs;
        }, set: function (v) {
          rs = v;
        }});
      return Result;
    };
    var TStringPart = rtl.recNewT(null,"",function () {
      this.Start = 0;
      this.Stop = 0;
      this.$eq = function (b) {
        return (this.Start === b.Start) && (this.Stop === b.Stop);
      };
      this.$assign = function (s) {
        this.Start = s.Start;
        this.Stop = s.Stop;
        return this;
      };
    });
    var ParamAllocStepSize = 8;
    var PAramDelimiters = [";",","," ","(",")","\r","\n","\t","\x00","=","+","-","*","\\","/","[","]","|"];
    this.ParseSQL$3 = function (SQL, DoCreate, EscapeSlash, EscapeRepeat, ParameterStyle, ParamBinding, ReplaceString) {
      var Result = "";
      var IgnorePart = false;
      var p = 0;
      var ParamNameStart = 0;
      var BufStart = 0;
      var ParamName = "";
      var QuestionMarkParamCount = 0;
      var ParameterIndex = 0;
      var NewLength = 0;
      var ParamCount = 0;
      var ParamPart = [];
      var NewQueryLength = 0;
      var NewQuery = "";
      var NewQueryIndex = 0;
      var BufIndex = 0;
      var CopyLen = 0;
      var i = 0;
      var tmpParam = null;
      if (DoCreate) this.Clear();
      ParamCount = 0;
      NewQueryLength = SQL.length;
      ParamPart = rtl.arraySetLength(ParamPart,TStringPart,8);
      ParamBinding.set(rtl.arraySetLength(ParamBinding.get(),0,8));
      QuestionMarkParamCount = 0;
      ReplaceString.set("$");
      if (ParameterStyle === $mod.TParamStyle.psSimulated) while (pas.System.Pos(ReplaceString.get(),SQL) > 0) ReplaceString.set(ReplaceString.get() + "$");
      p = 1;
      BufStart = p;
      do {
        while ($impl.SkipComments(SQL,{get: function () {
            return p;
          }, set: function (v) {
            p = v;
          }},EscapeSlash,EscapeRepeat)) {
        };
        var $tmp = SQL.charAt(p - 1);
        if (($tmp === ":") || ($tmp === "?")) {
          IgnorePart = false;
          if (SQL.charAt(p - 1) === ":") {
            p += 1;
            if (pas.SysUtils.CharInSet(SQL.charAt(p - 1),[":","="," "])) {
              IgnorePart = true;
              p += 1;
            } else {
              if (SQL.charAt(p - 1) === '"') {
                ParamNameStart = p;
                $impl.SkipQuotesString(SQL,{get: function () {
                    return p;
                  }, set: function (v) {
                    p = v;
                  }},'"',EscapeSlash,EscapeRepeat);
                ParamName = pas.System.Copy(SQL,ParamNameStart + 1,p - ParamNameStart - 2);
              } else {
                ParamNameStart = p;
                while (!pas.SysUtils.CharInSet(SQL.charAt(p - 1),PAramDelimiters)) p += 1;
                ParamName = pas.System.Copy(SQL,ParamNameStart,p - ParamNameStart);
              };
            };
          } else {
            p += 1;
            ParamNameStart = p;
            ParamName = "";
          };
          if (!IgnorePart) {
            ParamCount += 1;
            if (ParamCount > rtl.length(ParamPart)) {
              NewLength = rtl.length(ParamPart) + 8;
              ParamPart = rtl.arraySetLength(ParamPart,TStringPart,NewLength);
              ParamBinding.set(rtl.arraySetLength(ParamBinding.get(),0,NewLength));
            };
            if (DoCreate) {
              tmpParam = this.FindParam(ParamName);
              if (!(tmpParam != null)) {
                ParameterIndex = this.CreateParam($mod.TFieldType.ftUnknown,ParamName,$mod.TParamType.ptInput).GetIndex()}
               else ParameterIndex = tmpParam.GetIndex();
            } else {
              if (ParamName !== "") {
                ParameterIndex = this.ParamByName(ParamName).GetIndex()}
               else {
                ParameterIndex = QuestionMarkParamCount;
                QuestionMarkParamCount += 1;
              };
            };
            if (ParameterStyle in rtl.createSet($mod.TParamStyle.psPostgreSQL,$mod.TParamStyle.psSimulated)) {
              i = ParameterIndex + 1;
              do {
                NewQueryLength += 1;
                i = rtl.trunc(i / 10);
              } while (!(i === 0));
            };
            ParamBinding.get()[ParamCount - 1] = ParameterIndex;
            ParamPart[ParamCount - 1].Start = ParamNameStart - BufStart;
            ParamPart[ParamCount - 1].Stop = (p - BufStart) + 1;
            NewQueryLength -= p - ParamNameStart;
          };
        } else if ($tmp === "\x00") {
          break}
         else {
          p += 1;
        };
      } while (!false);
      ParamPart = rtl.arraySetLength(ParamPart,TStringPart,ParamCount);
      ParamBinding.set(rtl.arraySetLength(ParamBinding.get(),0,ParamCount));
      if (ParamCount <= 0) {
        NewQuery = SQL}
       else {
        if ((ParameterStyle === $mod.TParamStyle.psSimulated) && (ReplaceString.get().length > 1)) NewQueryLength += ParamCount * (ReplaceString.get().length - 1);
        NewQuery = rtl.strSetLength(NewQuery,NewQueryLength);
        NewQueryIndex = 1;
        BufIndex = 1;
        for (var $l = 0, $end = rtl.length(ParamPart) - 1; $l <= $end; $l++) {
          i = $l;
          CopyLen = ParamPart[i].Start - BufIndex;
          NewQuery = NewQuery + pas.System.Copy(SQL,BufIndex,CopyLen);
          NewQueryIndex += CopyLen;
          var $tmp1 = ParameterStyle;
          if ($tmp1 === $mod.TParamStyle.psInterbase) {
            NewQuery = NewQuery + "?";
            NewQueryIndex += 1;
          } else if (($tmp1 === $mod.TParamStyle.psPostgreSQL) || ($tmp1 === $mod.TParamStyle.psSimulated)) {
            ParamName = pas.SysUtils.IntToStr(ParamBinding.get()[i] + 1);
            NewQuery = pas.System.StringOfChar("$",ReplaceString.get().length);
            NewQuery = NewQuery + ParamName;
          };
          BufIndex = ParamPart[i].Stop;
        };
        CopyLen = (SQL.length + 1) - BufIndex;
        if (CopyLen > 0) NewQuery = NewQuery + pas.System.Copy(SQL,BufIndex,CopyLen);
      };
      Result = NewQuery;
      return Result;
    };
    this.RemoveParam = function (Value) {
      Value.SetCollection(null);
    };
    this.CopyParamValuesFromDataset = function (ADataset, CopyBound) {
      var I = 0;
      var P = null;
      var F = null;
      if (ADataset != null) for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        P = this.GetItem$1(I);
        if (CopyBound || !P.FBound) {
          F = ADataset.FieldByName(P.FName);
          P.AssignField(F);
          if (!CopyBound) P.FBound = false;
        };
      };
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["AOwner",pas.Classes.$rtti["TPersistent"]],["AItemClass",pas.Classes.$rtti["TCollectionItemClass"]]]);
    $r.addMethod("Create$3",2,[["AOwner",pas.Classes.$rtti["TPersistent"]]]);
    $r.addMethod("Create$4",2,[]);
  });
  this.TBookmarkFlag = {"0": "bfCurrent", bfCurrent: 0, "1": "bfBOF", bfBOF: 1, "2": "bfEOF", bfEOF: 2, "3": "bfInserted", bfInserted: 3};
  this.$rtti.$Enum("TBookmarkFlag",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TBookmarkFlag});
  rtl.recNewT(this,"TBookmark",function () {
    this.Data = undefined;
    this.Flag = 0;
    this.$eq = function (b) {
      return (this.Data === b.Data) && (this.Flag === b.Flag);
    };
    this.$assign = function (s) {
      this.Data = s.Data;
      this.Flag = s.Flag;
      return this;
    };
    var $r = $mod.$rtti.$Record("TBookmark",{});
    $r.addField("Data",rtl.jsvalue);
    $r.addField("Flag",$mod.$rtti["TBookmarkFlag"]);
  });
  this.TGetMode = {"0": "gmCurrent", gmCurrent: 0, "1": "gmNext", gmNext: 1, "2": "gmPrior", gmPrior: 2};
  this.$rtti.$Enum("TGetMode",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TGetMode});
  this.TGetResult = {"0": "grOK", grOK: 0, "1": "grBOF", grBOF: 1, "2": "grEOF", grEOF: 2, "3": "grError", grError: 3};
  this.$rtti.$Enum("TGetResult",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TGetResult});
  this.TResyncMode$a = {"0": "rmExact", rmExact: 0, "1": "rmCenter", rmCenter: 1};
  this.$rtti.$Enum("TResyncMode$a",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TResyncMode$a});
  this.$rtti.$Set("TResyncMode",{comptype: this.$rtti["TResyncMode$a"]});
  this.TDataAction = {"0": "daFail", daFail: 0, "1": "daAbort", daAbort: 1, "2": "daRetry", daRetry: 2};
  this.$rtti.$Enum("TDataAction",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TDataAction});
  this.TUpdateAction = {"0": "uaFail", uaFail: 0, "1": "uaAbort", uaAbort: 1, "2": "uaSkip", uaSkip: 2, "3": "uaRetry", uaRetry: 3, "4": "uaApplied", uaApplied: 4};
  this.$rtti.$Enum("TUpdateAction",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TUpdateAction});
  this.TUpdateKind = {"0": "ukModify", ukModify: 0, "1": "ukInsert", ukInsert: 1, "2": "ukDelete", ukDelete: 2};
  this.$rtti.$Enum("TUpdateKind",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TUpdateKind});
  this.TLocateOption = {"0": "loCaseInsensitive", loCaseInsensitive: 0, "1": "loPartialKey", loPartialKey: 1, "2": "loFromCurrent", loFromCurrent: 2};
  this.$rtti.$Enum("TLocateOption",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TLocateOption});
  this.$rtti.$Set("TLocateOptions",{comptype: this.$rtti["TLocateOption"]});
  this.$rtti.$MethodVar("TDataOperation",{procsig: rtl.newTIProcSig([]), methodkind: 0});
  this.$rtti.$MethodVar("TDataSetNotifyEvent",{procsig: rtl.newTIProcSig([["DataSet",this.$rtti["TDataSet"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TDataSetErrorEvent",{procsig: rtl.newTIProcSig([["DataSet",this.$rtti["TDataSet"]],["E",this.$rtti["EDatabaseError"]],["DataAction",this.$rtti["TDataAction"],1]]), methodkind: 0});
  this.TFilterOption = {"0": "foCaseInsensitive", foCaseInsensitive: 0, "1": "foNoPartialCompare", foNoPartialCompare: 1};
  this.$rtti.$Enum("TFilterOption",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TFilterOption});
  this.$rtti.$Set("TFilterOptions",{comptype: this.$rtti["TFilterOption"]});
  this.TLoadOption = {"0": "loNoOpen", loNoOpen: 0, "1": "loNoEvents", loNoEvents: 1, "2": "loAtEOF", loAtEOF: 2, "3": "loCancelPending", loCancelPending: 3, "4": "loReload", loReload: 4};
  this.$rtti.$Enum("TLoadOption",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TLoadOption});
  this.$rtti.$Set("TLoadOptions",{comptype: this.$rtti["TLoadOption"]});
  this.$rtti.$MethodVar("TDatasetLoadEvent",{procsig: rtl.newTIProcSig([["DataSet",this.$rtti["TDataSet"]],["Data",rtl.jsvalue]]), methodkind: 0});
  this.$rtti.$MethodVar("TDatasetLoadFailEvent",{procsig: rtl.newTIProcSig([["DataSet",this.$rtti["TDataSet"]],["ID",rtl.longint],["ErrorMsg",rtl.string,2]]), methodkind: 0});
  this.$rtti.$MethodVar("TFilterRecordEvent",{procsig: rtl.newTIProcSig([["DataSet",this.$rtti["TDataSet"]],["Accept",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$ClassRef("TDatasetClass",{instancetype: this.$rtti["TDataSet"]});
  this.TRecordState = {"0": "rsNew", rsNew: 0, "1": "rsClean", rsClean: 1, "2": "rsUpdate", rsUpdate: 2, "3": "rsDelete", rsDelete: 3};
  this.$rtti.$Enum("TRecordState",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TRecordState});
  rtl.recNewT(this,"TDataRecord",function () {
    this.data = undefined;
    this.state = 0;
    this.bookmark = undefined;
    this.bookmarkFlag = 0;
    this.$eq = function (b) {
      return (this.data === b.data) && (this.state === b.state) && (this.bookmark === b.bookmark) && (this.bookmarkFlag === b.bookmarkFlag);
    };
    this.$assign = function (s) {
      this.data = s.data;
      this.state = s.state;
      this.bookmark = s.bookmark;
      this.bookmarkFlag = s.bookmarkFlag;
      return this;
    };
    var $r = $mod.$rtti.$Record("TDataRecord",{});
    $r.addField("data",rtl.jsvalue);
    $r.addField("state",$mod.$rtti["TRecordState"]);
    $r.addField("bookmark",rtl.jsvalue);
    $r.addField("bookmarkFlag",$mod.$rtti["TBookmarkFlag"]);
  });
  this.$rtti.$DynArray("TBuffers",{eltype: this.$rtti["TDataRecord"]});
  rtl.recNewT(this,"TResolveInfo",function () {
    this.Data = undefined;
    this.Status = 0;
    this.ResolveStatus = 0;
    this.Error = "";
    this._private = undefined;
    this.$new = function () {
      var r = Object.create(this);
      r.BookMark = $mod.TBookmark.$new();
      return r;
    };
    this.$eq = function (b) {
      return (this.Data === b.Data) && (this.Status === b.Status) && (this.ResolveStatus === b.ResolveStatus) && (this.Error === b.Error) && this.BookMark.$eq(b.BookMark) && (this._private === b._private);
    };
    this.$assign = function (s) {
      this.Data = s.Data;
      this.Status = s.Status;
      this.ResolveStatus = s.ResolveStatus;
      this.Error = s.Error;
      this.BookMark.$assign(s.BookMark);
      this._private = s._private;
      return this;
    };
    var $r = $mod.$rtti.$Record("TResolveInfo",{});
    $r.addField("Data",rtl.jsvalue);
    $r.addField("Status",$mod.$rtti["TUpdateStatus"]);
    $r.addField("ResolveStatus",$mod.$rtti["TResolveStatus"]);
    $r.addField("Error",rtl.string);
    $r.addField("BookMark",$mod.$rtti["TBookmark"]);
    $r.addField("_private",rtl.jsvalue);
  });
  this.$rtti.$DynArray("TResolveInfoArray",{eltype: this.$rtti["TResolveInfo"]});
  rtl.recNewT(this,"TResolveResults",function () {
    this.$new = function () {
      var r = Object.create(this);
      r.Records = [];
      return r;
    };
    this.$eq = function (b) {
      return this.Records === b.Records;
    };
    this.$assign = function (s) {
      this.Records = rtl.arrayRef(s.Records);
      return this;
    };
    var $r = $mod.$rtti.$Record("TResolveResults",{});
    $r.addField("Records",$mod.$rtti["TResolveInfoArray"]);
  });
  this.$rtti.$MethodVar("TOnRecordResolveEvent",{procsig: rtl.newTIProcSig([["Sender",this.$rtti["TDataSet"]],["info",this.$rtti["TResolveInfo"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TApplyUpdatesEvent",{procsig: rtl.newTIProcSig([["Sender",this.$rtti["TDataSet"]],["info",this.$rtti["TResolveResults"]]]), methodkind: 0});
  rtl.createClass(this,"TDataSet",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FAfterApplyUpdates = null;
      this.FAfterLoad = null;
      this.FBeforeApplyUpdates = null;
      this.FBeforeLoad = null;
      this.FBlockReadSize = 0;
      this.FCalcBuffer = $mod.TDataRecord.$new();
      this.FCalcFieldsCount = 0;
      this.FOnLoadFail = null;
      this.FOnRecordResolved = null;
      this.FOpenAfterRead = false;
      this.FActiveRecord = 0;
      this.FAfterCancel = null;
      this.FAfterClose = null;
      this.FAfterDelete = null;
      this.FAfterEdit = null;
      this.FAfterInsert = null;
      this.FAfterOpen = null;
      this.FAfterPost = null;
      this.FAfterRefresh = null;
      this.FAfterScroll = null;
      this.FAutoCalcFields = false;
      this.FBOF = false;
      this.FBeforeCancel = null;
      this.FBeforeClose = null;
      this.FBeforeDelete = null;
      this.FBeforeEdit = null;
      this.FBeforeInsert = null;
      this.FBeforeOpen = null;
      this.FBeforePost = null;
      this.FBeforeRefresh = null;
      this.FBeforeScroll = null;
      this.FBlobFieldCount = 0;
      this.FBuffers = [];
      this.FBufferCount = 0;
      this.FConstraints = null;
      this.FDisableControlsCount = 0;
      this.FDisableControlsState = 0;
      this.FCurrentRecord = 0;
      this.FDataSources = null;
      this.FDefaultFields = false;
      this.FEOF = false;
      this.FEnableControlsEvent = 0;
      this.FFieldList = null;
      this.FFieldDefs = null;
      this.FFilterOptions = {};
      this.FFilterText = "";
      this.FFiltered = false;
      this.FFound = false;
      this.FInternalCalcFields = false;
      this.FModified = false;
      this.FOnCalcFields = null;
      this.FOnDeleteError = null;
      this.FOnEditError = null;
      this.FOnFilterRecord = null;
      this.FOnNewRecord = null;
      this.FOnPostError = null;
      this.FRecordCount = 0;
      this.FIsUniDirectional = false;
      this.FState = 0;
      this.FInternalOpenComplete = false;
      this.FDataProxy = null;
      this.FDataRequestID = 0;
      this.FUpdateBatchID = 0;
      this.FChangeList = null;
      this.FBatchList = null;
      this.FInApplyupdates = false;
      this.FLoadCount = 0;
      this.FMinLoadID = 0;
      this.FDataSetField = null;
      this.FNestedDataSets = null;
      this.FNestedDataSetClass = null;
    };
    this.$final = function () {
      this.FAfterApplyUpdates = undefined;
      this.FAfterLoad = undefined;
      this.FBeforeApplyUpdates = undefined;
      this.FBeforeLoad = undefined;
      this.FCalcBuffer = undefined;
      this.FOnLoadFail = undefined;
      this.FOnRecordResolved = undefined;
      this.FAfterCancel = undefined;
      this.FAfterClose = undefined;
      this.FAfterDelete = undefined;
      this.FAfterEdit = undefined;
      this.FAfterInsert = undefined;
      this.FAfterOpen = undefined;
      this.FAfterPost = undefined;
      this.FAfterRefresh = undefined;
      this.FAfterScroll = undefined;
      this.FBeforeCancel = undefined;
      this.FBeforeClose = undefined;
      this.FBeforeDelete = undefined;
      this.FBeforeEdit = undefined;
      this.FBeforeInsert = undefined;
      this.FBeforeOpen = undefined;
      this.FBeforePost = undefined;
      this.FBeforeRefresh = undefined;
      this.FBeforeScroll = undefined;
      this.FBuffers = undefined;
      this.FConstraints = undefined;
      this.FDataSources = undefined;
      this.FFieldList = undefined;
      this.FFieldDefs = undefined;
      this.FFilterOptions = undefined;
      this.FOnCalcFields = undefined;
      this.FOnDeleteError = undefined;
      this.FOnEditError = undefined;
      this.FOnFilterRecord = undefined;
      this.FOnNewRecord = undefined;
      this.FOnPostError = undefined;
      this.FDataProxy = undefined;
      this.FChangeList = undefined;
      this.FBatchList = undefined;
      this.FDataSetField = undefined;
      this.FNestedDataSets = undefined;
      this.FNestedDataSetClass = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.DoInsertAppend = function (DoAppend) {
      var $Self = this;
      function DoInsert(DoAppend) {
        var BookBeforeInsert = $mod.TBookmark.$new();
        var TempBuf = $mod.TDataRecord.$new();
        var I = 0;
        if ($Self.FRecordCount > 0) BookBeforeInsert.$assign($Self.GetBookmark());
        if (!DoAppend) {
          if ($Self.FRecordCount > 0) {
            TempBuf.$assign($Self.FBuffers[$Self.FBufferCount]);
            for (var $l = $Self.FBufferCount, $end = $Self.FActiveRecord + 1; $l >= $end; $l--) {
              I = $l;
              $Self.FBuffers[I].$assign($Self.FBuffers[I - 1]);
            };
            $Self.FBuffers[$Self.FActiveRecord].$assign(TempBuf);
          };
        } else if ($Self.FRecordCount === $Self.FBufferCount) {
          $Self.ShiftBuffersBackward()}
         else {
          if ($Self.FRecordCount > 0) $Self.FActiveRecord += 1;
        };
        $Self.InitRecord($Self.FBuffers[$Self.FActiveRecord]);
        $Self.CursorPosChanged();
        if ($Self.FRecordCount === 0) {
          $Self.SetBookmarkFlag($Self.FBuffers[$Self.FActiveRecord],$mod.TBookmarkFlag.bfEOF)}
         else {
          $Self.FBOF = false;
          if ($Self.FRecordCount > 0) {
            $Self.SetBookmarkData($Self.FBuffers[$Self.FActiveRecord],$mod.TBookmark.$clone(BookBeforeInsert));
            $Self.FreeBookmark($mod.TBookmark.$clone(BookBeforeInsert));
          };
        };
        $Self.InternalInsert();
        if ($Self.FRecordCount < $Self.FBufferCount) $Self.FRecordCount += 1;
      };
      this.CheckBrowseMode();
      if (!this.GetCanModify()) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SDatasetReadOnly"),$Self);
      this.DoBeforeInsert();
      this.DoBeforeScroll();
      if (!DoAppend) {
        DoInsert(false);
      } else {
        this.ClearBuffers();
        this.InternalLast();
        this.GetPriorRecords();
        if (this.FRecordCount > 0) this.FActiveRecord = this.FRecordCount - 1;
        DoInsert(true);
        this.SetBookmarkFlag(this.FBuffers[this.FActiveRecord],$mod.TBookmarkFlag.bfEOF);
        this.FBOF = false;
        this.FEOF = true;
      };
      this.SetState($mod.TDataSetState.dsInsert);
      try {
        this.DoOnNewRecord();
      } catch ($e) {
        this.SetCurrentRecord(this.FActiveRecord);
        this.Resync({});
        throw $e;
      };
      this.FModified = false;
      this.DataEvent($mod.TDataEvent.deDataSetChange,0);
      this.DoAfterInsert();
      this.DoAfterScroll();
    };
    this.DoInternalOpen = function () {
      this.InternalOpen();
      this.FInternalOpenComplete = true;
      this.FRecordCount = 0;
      this.RecalcBufListSize();
      this.FBOF = true;
      this.FEOF = this.FRecordCount === 0;
      if (this.GetDataProxy() != null) this.InitChangeList();
    };
    this.GetBuffer = function (Index) {
      var Result = $mod.TDataRecord.$new();
      Result.$assign(this.FBuffers[Index]);
      return Result;
    };
    this.GetDataProxy = function () {
      var Result = null;
      if (this.FDataProxy === null) this.SetDataProxy(this.DoGetDataProxy());
      Result = this.FDataProxy;
      return Result;
    };
    this.GetIsLoading = function () {
      var Result = false;
      Result = this.FLoadCount > 0;
      return Result;
    };
    this.RegisterDataSource = function (ADataSource) {
      this.FDataSources.Add(ADataSource);
      this.RecalcBufListSize();
    };
    this.SetConstraints = function (Value) {
      this.FConstraints.Assign(Value);
    };
    this.SetDataProxy = function (AValue) {
      if (AValue === this.FDataProxy) return;
      if (this.FDataProxy != null) this.FDataProxy.RemoveFreeNotification(this);
      this.FDataProxy = AValue;
      if (this.FDataProxy != null) this.FDataProxy.FreeNotification(this);
    };
    this.ShiftBuffersForward = function () {
      var TempBuf = $mod.TDataRecord.$new();
      var I = 0;
      TempBuf.$assign(this.FBuffers[this.FBufferCount]);
      for (var $l = this.FBufferCount; $l >= 1; $l--) {
        I = $l;
        this.FBuffers[I].$assign(this.FBuffers[I - 1]);
      };
      this.FBuffers[0].$assign(TempBuf);
    };
    this.ShiftBuffersBackward = function () {
      var TempBuf = $mod.TDataRecord.$new();
      var I = 0;
      TempBuf.$assign(this.FBuffers[0]);
      for (var $l = 1, $end = this.FBufferCount; $l <= $end; $l++) {
        I = $l;
        this.FBuffers[I - 1].$assign(this.FBuffers[I]);
      };
      this.FBuffers[this.FBufferCount].$assign(TempBuf);
    };
    this.TryDoing = function (P, Ev) {
      var Result = false;
      var Retry = 0;
      Result = true;
      Retry = $mod.TDataAction.daRetry;
      while (Retry === $mod.TDataAction.daRetry) try {
        this.UpdateCursorPos();
        P();
        return Result;
      } catch ($e) {
        if ($mod.EDatabaseError.isPrototypeOf($e)) {
          var E = $e;
          Retry = $mod.TDataAction.daFail;
          if (Ev != null) Ev(this,E,{get: function () {
              return Retry;
            }, set: function (v) {
              Retry = v;
            }});
          var $tmp = Retry;
          if ($tmp === $mod.TDataAction.daFail) {
            throw $e}
           else if ($tmp === $mod.TDataAction.daAbort) pas.SysUtils.Abort();
        } else {
          throw $e;
        }
      };
      return Result;
    };
    this.GetActive = function () {
      var Result = false;
      Result = (this.FState !== $mod.TDataSetState.dsInactive) && (this.FState !== $mod.TDataSetState.dsOpening);
      return Result;
    };
    this.UnRegisterDataSource = function (ADataSource) {
      this.FDataSources.Remove(ADataSource);
    };
    this.SetBlockReadSize = function (AValue) {
      this.FBlockReadSize = AValue;
      if (AValue > 0) {
        this.CheckActive();
        this.SetState($mod.TDataSetState.dsBlockRead);
      } else {
        if (this.FState === $mod.TDataSetState.dsBlockRead) this.SetState($mod.TDataSetState.dsBrowse);
      };
    };
    this.SetFieldDefs = function (AFieldDefs) {
      this.FFieldList.ClearFieldDefs();
      this.FFieldDefs.Assign$2(AFieldDefs);
    };
    this.DoInsertAppendRecord = function (Values, DoAppend) {
      var i = 0;
      var ValuesSize = 0;
      ValuesSize = rtl.length(Values);
      if (ValuesSize > this.GetfieldCount()) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"STooManyFields"),this);
      if (DoAppend) {
        this.Append()}
       else this.Insert$1();
      for (var $l = 0, $end = ValuesSize - 1; $l <= $end; $l++) {
        i = $l;
        this.FFieldList.GetField(i).AssignValue(Values[i]);
      };
      this.Post();
    };
    this.ResolveRecordUpdate = function (anUpdate) {
      var Result = false;
      try {
        Result = this.DoResolveRecordUpdate(anUpdate);
        if (!Result) anUpdate.SetResolveStatus($mod.TResolveStatus.rsResolveFailed);
      } catch ($e) {
        if (pas.SysUtils.Exception.isPrototypeOf($e)) {
          var E = $e;
          anUpdate.ResolveFailed(E.$classname + ": " + E.fMessage);
          Result = false;
        } else throw $e
      };
      this.DoOnRecordResolved(anUpdate);
      return Result;
    };
    this.HandleRequestResponse = function (ARequest) {
      var DataAdded = false;
      if (!(ARequest != null)) return;
      if (ARequest.FRequestID <= this.FMinLoadID) {
        ARequest.$destroy("Destroy");
        return;
      };
      this.FLoadCount -= 1;
      var $tmp = ARequest.FSuccess;
      if ($tmp === $mod.TDataRequestResult.rrFail) {
        if (this.FOnLoadFail != null) this.FOnLoadFail(this,ARequest.FRequestID,ARequest.FErrorMsg);
      } else if (($tmp === $mod.TDataRequestResult.rrEOF) || ($tmp === $mod.TDataRequestResult.rrOK)) {
        DataAdded = false;
        if (ARequest.FEvent != null) ARequest.FEvent(this,ARequest.FData);
        if (ARequest.FSuccess !== $mod.TDataRequestResult.rrEOF) DataAdded = this.DataPacketReceived(ARequest);
        if (!(this.GetActive() || ($mod.TLoadOption.loNoOpen in ARequest.FLoadOptions))) {
          if (!($mod.TLoadOption.loNoEvents in ARequest.FLoadOptions)) this.DoAfterLoad();
          this.Open();
        } else {
          if (($mod.TLoadOption.loAtEOF in ARequest.FLoadOptions) && DataAdded) this.FEOF = false;
          if (!($mod.TLoadOption.loNoEvents in ARequest.FLoadOptions)) this.DoAfterLoad();
        };
      };
      ARequest.$destroy("Destroy");
    };
    this.GetNestedDataSets = function () {
      var Result = null;
      if (!(this.FNestedDataSets != null)) this.FNestedDataSets = pas.Classes.TFPList.$create("Create");
      Result = this.FNestedDataSets;
      return Result;
    };
    this.DoOnRecordResolved = function (anUpdate) {
      var Info = $mod.TResolveInfo.$new();
      if (!(this.FOnRecordResolved != null)) return;
      Info.$assign(this.RecordUpdateDescriptorToResolveInfo(anUpdate));
      this.FOnRecordResolved(this,$mod.TResolveInfo.$clone(Info));
    };
    this.RecordUpdateDescriptorToResolveInfo = function (anUpdate) {
      var Result = $mod.TResolveInfo.$new();
      Result.BookMark.$assign(anUpdate.FBookmark);
      Result.Data = anUpdate.FData;
      Result.Status = anUpdate.FStatus;
      Result.ResolveStatus = anUpdate.FResolveStatus;
      Result.Error = anUpdate.FResolveError;
      return Result;
    };
    this.DoResolveRecordUpdate = function (anUpdate) {
      var Result = false;
      Result = true;
      return Result;
    };
    this.GetRecordUpdates = function (AList) {
      var Result = 0;
      var I = 0;
      var MinIndex = 0;
      MinIndex = 0;
      for (var $l = MinIndex, $end = this.FChangeList.FCount - 1; $l <= $end; $l++) {
        I = $l;
        if (rtl.getObject(this.FChangeList.Get(I)).FResolveStatus === $mod.TResolveStatus.rsUnresolved) AList.Add(this.FChangeList.Get(I));
      };
      Result = this.FChangeList.FCount;
      return Result;
    };
    this.ResolveUpdateBatch = function (Sender, aBatch) {
      var BI = 0;
      var RI = 0;
      var Idx = 0;
      var RUD = null;
      var doRemove = false;
      var Results = $mod.TResolveResults.$new();
      if ((this.FBatchList != null) && (aBatch.FDataset === this)) {
        BI = this.FBatchList.IndexOf(aBatch)}
       else BI = -1;
      if (BI === -1) return;
      this.FBatchList.Delete(BI);
      Results.Records = rtl.arraySetLength(Results.Records,$mod.TResolveInfo,aBatch.FList.FCount);
      for (var $l = 0, $end = aBatch.FList.FCount - 1; $l <= $end; $l++) {
        RI = $l;
        RUD = aBatch.FList.GetUpdate(RI);
        Results.Records[RI].$assign(this.RecordUpdateDescriptorToResolveInfo(RUD));
        aBatch.FList.Put(RI,null);
        Idx = this.IndexInChangeList($mod.TBookmark.$clone(RUD.FBookmark));
        if (Idx !== -1) {
          doRemove = false;
          if (RUD.FResolveStatus === $mod.TResolveStatus.rsResolved) {
            doRemove = this.ResolveRecordUpdate(RUD)}
           else doRemove = RUD.FResolveStatus === $mod.TResolveStatus.rsResolved;
          if (doRemove) {
            RUD = rtl.freeLoc(RUD);
            this.FChangeList.Delete(Idx);
          } else RUD.Reset();
        };
      };
      if (this.FBatchList.FCount === 0) pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FBatchList;
        }, set: function (v) {
          this.p.FBatchList = v;
        }});
      this.DoAfterApplyUpdates(Results);
    };
    this.DataPacketReceived = function (ARequest) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.DoLoad = function (aOptions, aAfterLoad) {
      var Result = false;
      var Request = null;
      if (!($mod.TLoadOption.loNoEvents in aOptions)) this.DoBeforeLoad();
      Result = this.GetDataProxy() !== null;
      if (!Result) return Result;
      Request = this.GetDataProxy().GetDataRequest(rtl.refSet(aOptions),rtl.createCallback(this,"HandleRequestResponse"),aAfterLoad);
      Request.FDataset = this;
      if (this.GetActive()) {
        if ($mod.TLoadOption.loReload in aOptions) {
          this.Close()}
         else Request.FBookmark.$assign(this.GetBookmark());
      };
      this.FDataRequestID += 1;
      Request.FRequestID = this.FDataRequestID;
      if (this.GetDataProxy().DoGetData(Request)) {
        this.FLoadCount += 1}
       else Request = rtl.freeLoc(Request);
      return Result;
    };
    this.DoGetDataProxy = function () {
      var Result = null;
      Result = null;
      return Result;
    };
    this.InitChangeList = function () {
      this.DoneChangeList();
      this.FChangeList = pas.Classes.TFPList.$create("Create");
    };
    this.DoneChangeList = function () {
      this.ClearChangeList();
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FChangeList;
        }, set: function (v) {
          this.p.FChangeList = v;
        }});
    };
    this.ClearChangeList = function () {
      var I = 0;
      if (!(this.FChangeList != null)) return;
      for (var $l = 0, $end = this.FChangeList.FCount - 1; $l <= $end; $l++) {
        I = $l;
        rtl.getObject(this.FChangeList.Get(I)).$destroy("Destroy");
        this.FChangeList.Put(I,null);
      };
    };
    this.ResetUpdateDescriptors = function () {
      var I = 0;
      for (var $l = 0, $end = this.FChangeList.FCount - 1; $l <= $end; $l++) {
        I = $l;
        rtl.getObject(this.FChangeList.Get(I)).Reset();
      };
    };
    this.GetApplyUpdateData = function (aBuffer) {
      var Result = undefined;
      Result = aBuffer.data;
      return Result;
    };
    this.IndexInChangeList = function (aBookmark) {
      var Result = 0;
      Result = -1;
      if (!(this.FChangeList != null)) return Result;
      Result = this.FChangeList.FCount - 1;
      while ((Result >= 0) && (this.CompareBookmarks($mod.TBookmark.$clone(aBookmark),$mod.TBookmark.$clone(rtl.getObject(this.FChangeList.Get(Result)).FBookmark)) !== 0)) Result -= 1;
      return Result;
    };
    this.AddToChangeList = function (aChange) {
      var Result = null;
      var B = $mod.TBookmark.$new();
      var I = 0;
      var aData = undefined;
      Result = null;
      if (!(this.FChangeList != null)) return Result;
      B.$assign(this.GetBookmark());
      I = this.IndexInChangeList($mod.TBookmark.$clone(B));
      if (I === -1) {
        aData = this.GetApplyUpdateData($mod.TDataRecord.$clone(this.ActiveBuffer()));
        if (this.GetDataProxy() != null) {
          Result = this.GetDataProxy().GetUpdateDescriptor(this,$mod.TBookmark.$clone(B),aData,aChange)}
         else Result = $mod.TRecordUpdateDescriptor.$create("Create$1",[null,this,$mod.TBookmark.$clone(B),aData,aChange]);
        this.FChangeList.Add(Result);
      } else {
        Result = rtl.getObject(this.FChangeList.Get(I));
        var $tmp = aChange;
        if ($tmp === $mod.TUpdateStatus.usDeleted) {
          if (Result.FStatus === $mod.TUpdateStatus.usInserted) {
            this.FChangeList.Delete(I)}
           else Result.FStatus = $mod.TUpdateStatus.usDeleted;
        } else if ($tmp === $mod.TUpdateStatus.usInserted) {
          $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SErrInsertingSameRecordtwice"),this)}
         else if ($tmp === $mod.TUpdateStatus.usModified) Result.FData = this.GetApplyUpdateData($mod.TDataRecord.$clone(this.ActiveBuffer()));
      };
      return Result;
    };
    this.RemoveFromChangeList = function (R) {
      if (!((R != null) && (this.FChangeList != null))) return;
    };
    this.DoApplyUpdates = function () {
      var B = null;
      var l = null;
      var I = 0;
      if (!(this.GetDataProxy() != null)) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SErrDoApplyUpdatesNeedsProxy"),this);
      if (this.FInApplyupdates) return;
      try {
        this.FInApplyupdates = true;
        if (!((this.FChangeList != null) && (this.FChangeList.FCount > 0))) return;
        l = $mod.TRecordUpdateDescriptorList.$create("Create");
        try {
          I = this.GetRecordUpdates(l);
        } catch ($e) {
          l = rtl.freeLoc(l);
          throw $e;
        };
        this.FUpdateBatchID += 1;
        for (var $l = 0, $end = l.FCount - 1; $l <= $end; $l++) {
          I = $l;
          l.GetUpdate(I).SetResolveStatus($mod.TResolveStatus.rsResolving);
        };
        B = this.GetDataProxy().GetRecordUpdateBatch(this.FUpdateBatchID,l,true);
        B.FDataset = this;
        B.FLastChangeIndex = I;
        B.FOnResolve = rtl.createCallback(this,"ResolveUpdateBatch");
        if (!(this.FBatchList != null)) this.FBatchList = pas.Classes.TFPList.$create("Create");
        this.FBatchList.Add(B);
        this.GetDataProxy().ProcessUpdateBatch(B);
      } finally {
        this.FInApplyupdates = false;
      };
    };
    this.RecalcBufListSize = function () {
      var i = 0;
      var j = 0;
      var ABufferCount = 0;
      var DataLink = null;
      if (!this.IsCursorOpen()) return;
      if (this.FIsUniDirectional) {
        ABufferCount = 1}
       else ABufferCount = 10;
      for (var $l = 0, $end = this.FDataSources.FCount - 1; $l <= $end; $l++) {
        i = $l;
        for (var $l1 = 0, $end1 = rtl.getObject(this.FDataSources.Get(i)).FDataLinks.GetCount() - 1; $l1 <= $end1; $l1++) {
          j = $l1;
          DataLink = rtl.getObject(rtl.getObject(this.FDataSources.Get(i)).FDataLinks.Get(j));
          if (ABufferCount < DataLink.GetBufferCount()) ABufferCount = DataLink.GetBufferCount();
        };
      };
      if (this.FBufferCount === ABufferCount) return;
      this.SetBufListSize(ABufferCount);
      this.GetNextRecords();
      if ((this.FRecordCount < this.FBufferCount) && !this.FIsUniDirectional) {
        this.FActiveRecord = this.FActiveRecord + this.GetPriorRecords();
        this.CursorPosChanged();
      };
    };
    this.ActivateBuffers = function () {
      this.FBOF = false;
      this.FEOF = false;
      this.FActiveRecord = 0;
    };
    this.BindFields = function (Binding) {
      var i = 0;
      var FieldIndex = 0;
      var FieldDef = null;
      var Field = null;
      this.FCalcFieldsCount = 0;
      this.FBlobFieldCount = 0;
      for (var $l = 0, $end = this.FFieldList.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        Field = this.FFieldList.GetField(i);
        Field.FFieldDef = null;
        if (!Binding) {
          Field.FFieldNo = 0}
         else if (Field.FFieldKind in rtl.createSet($mod.TFieldKind.fkCalculated,$mod.TFieldKind.fkLookup)) {
          Field.FFieldNo = -1;
          this.FCalcFieldsCount += 1;
        } else {
          FieldIndex = this.FFieldDefs.IndexOf(Field.FFieldName);
          if (FieldIndex === -1) {
            $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SFieldNotFound"),pas.System.VarRecs(18,Field.FFieldName),this)}
           else {
            FieldDef = this.FFieldDefs.GetItem$1(FieldIndex);
            Field.FFieldDef = FieldDef;
            Field.FFieldNo = FieldDef.FFieldNo;
            if (FieldDef.FInternalCalcField) this.FInternalCalcFields = true;
            if (Field.$class.IsBlob()) {
              Field.FSize = FieldDef.FSize;
              this.FBlobFieldCount += 1;
            };
          };
        };
        Field.Bind(Binding);
      };
    };
    this.BlockReadNext = function () {
      this.MoveBy(1);
    };
    var BookmarkStates = rtl.createSet($mod.TDataSetState.dsBrowse,$mod.TDataSetState.dsEdit,$mod.TDataSetState.dsInsert);
    this.BookmarkAvailable = function () {
      var Result = false;
      Result = !this.IsEmpty() && !this.FIsUniDirectional && (this.FState in BookmarkStates) && (this.GetBookmarkFlag($mod.TDataRecord.$clone(this.ActiveBuffer())) === $mod.TBookmarkFlag.bfCurrent);
      return Result;
    };
    this.CalculateFields = function (Buffer) {
      var i = 0;
      this.FCalcBuffer.$assign(Buffer);
      if (this.FState !== $mod.TDataSetState.dsInternalCalc) {
        this.ClearCalcFields(this.FCalcBuffer);
        if (!this.FIsUniDirectional) for (var $l = 0, $end = this.FFieldList.GetCount() - 1; $l <= $end; $l++) {
          i = $l;
          if (this.FFieldList.GetField(i).FFieldKind === $mod.TFieldKind.fkLookup) this.FFieldList.GetField(i).CalcLookupValue();
        };
      };
      this.DoOnCalcFields();
    };
    this.CheckActive = function () {
      if (!this.GetActive()) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SInactiveDataset"),this);
    };
    this.CheckInactive = function () {
      if (this.GetActive()) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SActiveDataset"),this);
    };
    this.CheckBiDirectional = function () {
      if (this.FIsUniDirectional) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SUniDirectional"),this);
    };
    this.Loaded = function () {
      pas.Classes.TComponent.Loaded.call(this);
      try {
        if (this.FOpenAfterRead) this.SetActive(true);
      } catch ($e) {
        if (pas.SysUtils.Exception.isPrototypeOf($e)) {
          var E = $e;
          if (pas.Classes.TComponentStateItem.csDesigning in this.FComponentState) this.InternalHandleException(E);
        } else {
          throw $e;
        }
      };
    };
    this.ClearBuffers = function () {
      this.FRecordCount = 0;
      this.FActiveRecord = 0;
      this.FCurrentRecord = -1;
      this.FBOF = true;
      this.FEOF = true;
    };
    this.ClearCalcFields = function (Buffer) {
    };
    this.CloseBlob = function (Field) {
    };
    this.CloseCursor = function () {
      this.ClearBuffers();
      this.SetBufListSize(0);
      this.FFieldList.ClearFieldDefs();
      this.InternalClose();
      this.FInternalOpenComplete = false;
    };
    this.CreateFields = function () {
      var I = 0;
      for (var $l = 0, $end = this.FFieldDefs.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        var $with = this.FFieldDefs.GetItem$1(I);
        if ($with.FDataType !== $mod.TFieldType.ftUnknown) {
          $with.CreateField(this);
        };
      };
    };
    this.DataEvent = function (Event, Info) {
      var $Self = this;
      function HandleFieldChange(aField) {
        if (aField.FFieldKind in rtl.createSet($mod.TFieldKind.fkData,$mod.TFieldKind.fkInternalCalc)) $Self.SetModified(true);
        if ($Self.FState !== $mod.TDataSetState.dsSetKey) {
          if (aField.FFieldKind === $mod.TFieldKind.fkData) {
            if ($Self.FInternalCalcFields) {
              $Self.RefreshInternalCalcFields($Self.FBuffers[$Self.FActiveRecord])}
             else if ($Self.FAutoCalcFields && ($Self.FCalcFieldsCount !== 0)) $Self.CalculateFields($Self.FBuffers[$Self.FActiveRecord]);
          };
          aField.Change();
        };
      };
      function HandleScrollOrChange() {
        var A = 0;
        var NestedDataSet = null;
        if ($Self.FState !== $mod.TDataSetState.dsInsert) $Self.UpdateCursorPos();
        if ($Self.FNestedDataSets != null) for (var $l = 0, $end = $Self.GetNestedDataSets().FCount - 1; $l <= $end; $l++) {
          A = $l;
          NestedDataSet = rtl.getObject($Self.GetNestedDataSets().Get(A));
          if (NestedDataSet.GetActive()) NestedDataSet.DataEvent($mod.TDataEvent.deParentScroll,0);
        };
      };
      var i = 0;
      var $tmp = Event;
      if ($tmp === $mod.TDataEvent.deFieldChange) {
        HandleFieldChange(rtl.getObject(Info))}
       else if (($tmp === $mod.TDataEvent.deDataSetChange) || ($tmp === $mod.TDataEvent.deDataSetScroll)) {
        HandleScrollOrChange()}
       else if ($tmp === $mod.TDataEvent.deLayoutChange) this.FEnableControlsEvent = $mod.TDataEvent.deLayoutChange;
      if (!this.ControlsDisabled() && (this.FState !== $mod.TDataSetState.dsBlockRead)) {
        for (var $l = 0, $end = this.FDataSources.FCount - 1; $l <= $end; $l++) {
          i = $l;
          rtl.getObject(this.FDataSources.Get(i)).ProcessEvent(Event,Info);
        };
      };
    };
    this.DestroyFields = function () {
      this.FFieldList.Clear();
    };
    this.DoAfterCancel = function () {
      if (this.FAfterCancel != null) this.FAfterCancel(this);
    };
    this.DoAfterClose = function () {
      if ((this.FAfterClose != null) && !(pas.Classes.TComponentStateItem.csDestroying in this.FComponentState)) this.FAfterClose(this);
    };
    this.DoAfterDelete = function () {
      if (this.FAfterDelete != null) this.FAfterDelete(this);
    };
    this.DoAfterEdit = function () {
      if (this.FAfterEdit != null) this.FAfterEdit(this);
    };
    this.DoAfterInsert = function () {
      if (this.FAfterInsert != null) this.FAfterInsert(this);
    };
    this.DoAfterOpen = function () {
      if (this.FAfterOpen != null) this.FAfterOpen(this);
    };
    this.DoAfterPost = function () {
      if (this.FAfterPost != null) this.FAfterPost(this);
    };
    this.DoAfterScroll = function () {
      if (this.FAfterScroll != null) this.FAfterScroll(this);
    };
    this.DoAfterRefresh = function () {
      if (this.FAfterRefresh != null) this.FAfterRefresh(this);
    };
    this.DoBeforeCancel = function () {
      if (this.FBeforeCancel != null) this.FBeforeCancel(this);
    };
    this.DoBeforeClose = function () {
      if ((this.FBeforeClose != null) && !(pas.Classes.TComponentStateItem.csDestroying in this.FComponentState)) this.FBeforeClose(this);
    };
    this.DoBeforeDelete = function () {
      if (this.FBeforeDelete != null) this.FBeforeDelete(this);
    };
    this.DoBeforeEdit = function () {
      if (this.FBeforeEdit != null) this.FBeforeEdit(this);
    };
    this.DoBeforeInsert = function () {
      if (this.FBeforeInsert != null) this.FBeforeInsert(this);
    };
    this.DoBeforeOpen = function () {
      if (this.FBeforeOpen != null) this.FBeforeOpen(this);
    };
    this.DoBeforePost = function () {
      if (this.FBeforePost != null) this.FBeforePost(this);
    };
    this.DoBeforeScroll = function () {
      if (this.FBeforeScroll != null) this.FBeforeScroll(this);
    };
    this.DoBeforeRefresh = function () {
      if (this.FBeforeRefresh != null) this.FBeforeRefresh(this);
    };
    this.DoOnCalcFields = function () {
      if (this.FOnCalcFields != null) this.FOnCalcFields(this);
    };
    this.DoOnNewRecord = function () {
      if (this.FOnNewRecord != null) this.FOnNewRecord(this);
    };
    this.DoBeforeLoad = function () {
      if (this.FBeforeLoad != null) this.FBeforeLoad(this);
    };
    this.DoAfterLoad = function () {
      if (this.FAfterLoad != null) this.FAfterLoad(this);
    };
    this.DoBeforeApplyUpdates = function () {
      if (this.FBeforeApplyUpdates != null) this.FBeforeApplyUpdates(this);
    };
    this.DoAfterApplyUpdates = function (ResolveInfo) {
      if (this.FAfterApplyUpdates != null) this.FAfterApplyUpdates(this,$mod.TResolveResults.$clone(ResolveInfo));
    };
    this.FieldByNumber = function (FieldNo) {
      var Result = null;
      Result = this.FFieldList.FieldByNumber(FieldNo);
      return Result;
    };
    this.FindRecord = function (Restart, GoForward) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.GetBookmarkStr = function () {
      var Result = "";
      var B = $mod.TBookmark.$new();
      Result = "";
      if (this.BookmarkAvailable()) {
        this.GetBookmarkData($mod.TDataRecord.$clone(this.ActiveBuffer()),B);
        Result = JSON.stringify($mod.TBookmark.$clone(B));
      };
      return Result;
    };
    this.GetCalcFields = function (Buffer) {
      var OldState = 0;
      if ((this.FCalcFieldsCount > 0) || this.FInternalCalcFields) {
        OldState = this.FState;
        this.FState = $mod.TDataSetState.dsCalcFields;
        try {
          this.CalculateFields(Buffer);
        } finally {
          this.FState = OldState;
        };
      };
    };
    this.GetCanModify = function () {
      var Result = false;
      Result = !this.FIsUniDirectional;
      return Result;
    };
    this.GetChildren = function (Proc, Root) {
      var I = 0;
      var Field = null;
      for (var $l = 0, $end = this.FFieldList.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        Field = this.FFieldList.GetField(I);
        if (Field.FOwner === Root) Proc(Field);
      };
    };
    this.GetFieldClass = function (FieldType) {
      var Result = null;
      Result = $mod.DefaultFieldClasses[FieldType];
      return Result;
    };
    this.GetfieldCount = function () {
      var Result = 0;
      Result = this.FFieldList.GetCount();
      return Result;
    };
    this.GetFieldValues = function (FieldName) {
      var Result = undefined;
      var i = 0;
      var FieldList = null;
      var A = [];
      FieldList = pas.Classes.TList.$create("Create$1");
      try {
        this.GetFieldList(FieldList,FieldName);
        if (FieldList.GetCount() > 1) {
          A = rtl.arraySetLength(A,undefined,FieldList.GetCount());
          for (var $l = 0, $end = FieldList.GetCount() - 1; $l <= $end; $l++) {
            i = $l;
            A[i] = rtl.getObject(FieldList.Get(i)).GetAsJSValue();
          };
          Result = A;
        } else Result = this.FieldByName(FieldName).GetAsJSValue();
      } finally {
        FieldList = rtl.freeLoc(FieldList);
      };
      return Result;
    };
    this.GetIsIndexField = function (Field) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.GetIndexDefs = function (IndexDefs, IndexTypes) {
      var Result = null;
      var i = 0;
      var f = 0;
      var IndexFields = null;
      IndexDefs.Update$1();
      Result = $mod.TIndexDefs.$create("Create$4",[this]);
      Result.Assign(IndexDefs);
      i = 0;
      IndexFields = pas.Classes.TStringList.$create("Create$1");
      while (i < Result.GetCount()) {
        if (!(rtl.eqSet(IndexTypes,{}) && rtl.eqSet(Result.GetItem$1(i).FOptions,{})) && rtl.eqSet(rtl.intersectSet(IndexTypes,Result.GetItem$1(i).FOptions),{})) {
          Result.Delete(i);
          i -= 1;
        } else {
          for (var $l = 0, $end = IndexFields.GetCount() - 1; $l <= $end; $l++) {
            f = $l;
            if (this.FindField(IndexFields.Get(f)) === null) {
              Result.Delete(i);
              i -= 1;
              break;
            };
          };
        };
        i += 1;
      };
      IndexFields = rtl.freeLoc(IndexFields);
      return Result;
    };
    this.GetNextRecords = function () {
      var Result = 0;
      Result = 0;
      while ((this.FRecordCount < this.FBufferCount) && this.GetNextRecord()) Result += 1;
      return Result;
    };
    this.GetNextRecord = function () {
      var Result = false;
      var T = $mod.TDataRecord.$new();
      if (this.FRecordCount > 0) this.SetCurrentRecord(this.FRecordCount - 1);
      Result = this.GetRecord(this.FBuffers[this.FBufferCount],$mod.TGetMode.gmNext,true) === $mod.TGetResult.grOK;
      if (Result) {
        if (this.FRecordCount === 0) this.ActivateBuffers();
        if (this.FRecordCount === this.FBufferCount) {
          this.ShiftBuffersBackward()}
         else {
          this.FRecordCount += 1;
          this.FCurrentRecord = this.FRecordCount - 1;
          T.$assign(this.FBuffers[this.FCurrentRecord]);
          this.FBuffers[this.FCurrentRecord].$assign(this.FBuffers[this.FBufferCount]);
          this.FBuffers[this.FBufferCount].$assign(T);
        };
      } else this.CursorPosChanged();
      return Result;
    };
    this.GetPriorRecords = function () {
      var Result = 0;
      Result = 0;
      while ((this.FRecordCount < this.FBufferCount) && this.GetPriorRecord()) Result += 1;
      return Result;
    };
    this.GetPriorRecord = function () {
      var Result = false;
      this.CheckBiDirectional();
      if (this.FRecordCount > 0) this.SetCurrentRecord(0);
      Result = this.GetRecord(this.FBuffers[this.FBufferCount],$mod.TGetMode.gmPrior,true) === $mod.TGetResult.grOK;
      if (Result) {
        if (this.FRecordCount === 0) this.ActivateBuffers();
        this.ShiftBuffersForward();
        if (this.FRecordCount < this.FBufferCount) this.FRecordCount += 1;
      } else this.CursorPosChanged();
      return Result;
    };
    this.GetRecordCount = function () {
      var Result = 0;
      Result = -1;
      return Result;
    };
    this.GetRecNo = function () {
      var Result = 0;
      Result = -1;
      return Result;
    };
    this.InitFieldDefs = function () {
      if (this.IsCursorOpen()) {
        this.InternalInitFieldDefs()}
       else {
        try {
          this.OpenCursor(true);
        } finally {
          this.CloseCursor();
        };
      };
    };
    this.InitFieldDefsFromfields = function () {
      var i = 0;
      if (this.FFieldDefs.GetCount() === 0) {
        this.FFieldDefs.BeginUpdate();
        try {
          for (var $l = 0, $end = this.FFieldList.GetCount() - 1; $l <= $end; $l++) {
            i = $l;
            var $with = this.FFieldList.GetField(i);
            if (!($with.FFieldKind in rtl.createSet($mod.TFieldKind.fkCalculated,$mod.TFieldKind.fkLookup))) {
              $with.FFieldDef = this.FFieldDefs.$class.FieldDefClass().$create("Create$3",[this.FFieldDefs,$with.FFieldName,$with.FDataType,$with.FSize,$with.FRequired,this.FFieldDefs.GetCount() + 1]);
              var $with1 = $with.FFieldDef;
              if ($with1.FRequired) $with1.SetAttributes(rtl.unionSet($with1.FAttributes,rtl.createSet($mod.TFieldAttribute.faRequired)));
              if ($with.FReadOnly) $with1.SetAttributes(rtl.unionSet($with1.FAttributes,rtl.createSet($mod.TFieldAttribute.faReadonly)));
            };
          };
        } finally {
          this.FFieldDefs.EndUpdate();
        };
      };
    };
    this.InitRecord = function (Buffer) {
      this.InternalInitRecord(Buffer);
      this.ClearCalcFields(Buffer);
    };
    this.InternalCancel = function () {
    };
    this.InternalEdit = function () {
    };
    this.InternalInsert = function () {
    };
    this.InternalRefresh = function () {
    };
    this.OpenCursor = function (InfoQuery) {
      if (InfoQuery) {
        this.InternalInitFieldDefs()}
       else if (this.FState !== $mod.TDataSetState.dsOpening) this.DoInternalOpen();
    };
    this.OpenCursorcomplete = function () {
      try {
        if (this.FState === $mod.TDataSetState.dsOpening) this.DoInternalOpen();
      } finally {
        if (this.FInternalOpenComplete) {
          this.SetState($mod.TDataSetState.dsBrowse);
          this.DoAfterOpen();
          if (!this.IsEmpty()) this.DoAfterScroll();
        } else {
          this.SetState($mod.TDataSetState.dsInactive);
          this.CloseCursor();
        };
      };
    };
    this.RefreshInternalCalcFields = function (Buffer) {
    };
    this.RestoreState = function (Value) {
      this.FState = Value;
      this.FDisableControlsCount -= 1;
    };
    this.SetActive = function (Value) {
      if (Value && (this.FState === $mod.TDataSetState.dsInactive)) {
        if (pas.Classes.TComponentStateItem.csLoading in this.FComponentState) {
          this.FOpenAfterRead = true;
          return;
        } else {
          this.DoBeforeOpen();
          this.FEnableControlsEvent = $mod.TDataEvent.deLayoutChange;
          this.FInternalCalcFields = false;
          try {
            this.FDefaultFields = this.GetfieldCount() === 0;
            this.OpenCursor(false);
          } finally {
            if (this.FState !== $mod.TDataSetState.dsOpening) this.OpenCursorcomplete();
          };
        };
        this.FModified = false;
      } else if (!Value && (this.FState !== $mod.TDataSetState.dsInactive)) {
        this.DoBeforeClose();
        this.SetState($mod.TDataSetState.dsInactive);
        this.DoneChangeList();
        this.CloseCursor();
        this.DoAfterClose();
        this.FModified = false;
      };
    };
    this.SetBookmarkStr = function (Value) {
      var O = null;
      var B = $mod.TBookmark.$new();
      O = JSON.parse(Value);
      B.Flag = O["flag"];
      B.Data = O["Index"];
      this.GotoBookmark(B);
    };
    this.SetBufListSize = function (Value) {
      var I = 0;
      if (Value < 0) Value = 0;
      if (Value === this.FBufferCount) return;
      if (Value > this.FBufferCount) {
        this.FBuffers = rtl.arraySetLength(this.FBuffers,$mod.TDataRecord,Value + 1);
        for (var $l = this.FBufferCount, $end = Value; $l <= $end; $l++) {
          I = $l;
          this.FBuffers[I].$assign(this.AllocRecordBuffer());
        };
      } else if (Value < this.FBufferCount) if ((Value >= 0) && (this.FActiveRecord > (Value - 1))) {
        for (var $l1 = 0, $end1 = this.FActiveRecord - Value; $l1 <= $end1; $l1++) {
          I = $l1;
          this.ShiftBuffersBackward();
        };
        this.FActiveRecord = Value - 1;
      };
      this.FBuffers = rtl.arraySetLength(this.FBuffers,$mod.TDataRecord,Value + 1);
      this.FBufferCount = Value;
      if (this.FRecordCount > this.FBufferCount) this.FRecordCount = this.FBufferCount;
    };
    this.SetChildOrder = function (Child, Order) {
      var Field = null;
      Field = rtl.as(Child,$mod.TField);
      if (this.FFieldList.IndexOf(Field) >= 0) Field.SetIndex(Order);
    };
    this.SetCurrentRecord = function (Index) {
      if (this.FCurrentRecord !== Index) {
        if (!this.FIsUniDirectional) {
          var $tmp = this.GetBookmarkFlag($mod.TDataRecord.$clone(this.FBuffers[Index]));
          if ($tmp === $mod.TBookmarkFlag.bfCurrent) {
            this.InternalSetToRecord($mod.TDataRecord.$clone(this.FBuffers[Index]))}
           else if ($tmp === $mod.TBookmarkFlag.bfBOF) {
            this.InternalFirst()}
           else if ($tmp === $mod.TBookmarkFlag.bfEOF) this.InternalLast();
        };
        this.FCurrentRecord = Index;
      };
    };
    this.SetDefaultFields = function (Value) {
      this.FDefaultFields = Value;
    };
    this.SetFiltered = function (Value) {
      if (Value) this.CheckBiDirectional();
      this.FFiltered = Value;
    };
    this.SetFilterOptions = function (Value) {
      this.CheckBiDirectional();
      this.FFilterOptions = rtl.refSet(Value);
    };
    this.SetFilterText = function (Value) {
      this.FFilterText = Value;
    };
    this.SetFieldValues = function (FieldName, Value) {
      var i = 0;
      var FieldList = null;
      var A = [];
      if (rtl.isArray(Value)) {
        FieldList = pas.Classes.TList.$create("Create$1");
        try {
          this.GetFieldList(FieldList,FieldName);
          A = Value;
          if ((FieldList.GetCount() === 1) && (rtl.length(A) > 0)) {
            this.FieldByName(FieldName).SetAsJSValue(Value)}
           else for (var $l = 0, $end = FieldList.GetCount() - 1; $l <= $end; $l++) {
            i = $l;
            rtl.getObject(FieldList.Get(i)).SetAsJSValue(A[i]);
          };
        } finally {
          FieldList = rtl.freeLoc(FieldList);
        };
      } else this.FieldByName(FieldName).SetAsJSValue(Value);
    };
    this.SetFound = function (Value) {
      this.FFound = Value;
    };
    this.SetModified = function (Value) {
      this.FModified = Value;
    };
    this.SetName = function (NewName) {
      var $Self = this;
      function CheckName(FieldName) {
        var Result = "";
        var i = 0;
        var j = 0;
        Result = FieldName;
        i = 0;
        j = 0;
        while (i < $Self.FFieldList.GetCount()) {
          if (Result === $Self.FFieldList.GetField(i).FFieldName) {
            j += 1;
            Result = FieldName + pas.SysUtils.IntToStr(j);
          } else i += 1;
        };
        return Result;
      };
      var i = 0;
      var nm = "";
      var old = "";
      if ($Self.FName === NewName) return;
      old = $Self.FName;
      pas.Classes.TComponent.SetName.call(this,NewName);
      if (pas.Classes.TComponentStateItem.csDesigning in this.FComponentState) for (var $l = 0, $end = this.FFieldList.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        nm = old + this.FFieldList.GetField(i).FFieldName;
        if (pas.System.Copy(this.FFieldList.GetField(i).FName,1,nm.length) === nm) this.FFieldList.GetField(i).SetName(CheckName(NewName + this.FFieldList.GetField(i).FFieldName));
      };
    };
    this.SetOnFilterRecord = function (Value) {
      this.CheckBiDirectional();
      this.FOnFilterRecord = Value;
    };
    this.SetRecNo = function (Value) {
    };
    this.SetState = function (Value) {
      if (Value !== this.FState) {
        this.FState = Value;
        if (Value === $mod.TDataSetState.dsBrowse) this.FModified = false;
        this.DataEvent($mod.TDataEvent.deUpdateState,0);
      };
    };
    this.SetTempState = function (Value) {
      var Result = 0;
      Result = this.FState;
      this.FState = Value;
      this.FDisableControlsCount += 1;
      return Result;
    };
    this.TempBuffer = function () {
      var Result = $mod.TDataRecord.$new();
      Result.$assign(this.FBuffers[this.FRecordCount]);
      return Result;
    };
    this.UpdateIndexDefs = function () {
    };
    this.AllocRecordBuffer = function () {
      var Result = $mod.TDataRecord.$new();
      Result.data = null;
      Result.state = $mod.TRecordState.rsNew;
      return Result;
    };
    this.FreeRecordBuffer = function (Buffer) {
    };
    this.GetBookmarkData = function (Buffer, Data) {
    };
    this.GetBookmarkFlag = function (Buffer) {
      var Result = 0;
      Result = $mod.TBookmarkFlag.bfCurrent;
      return Result;
    };
    this.GetDataSource = function () {
      var Result = null;
      Result = null;
      return Result;
    };
    this.GetRecordSize = function () {
      var Result = 0;
      Result = 0;
      return Result;
    };
    this.InternalAddRecord = function (Buffer, AAppend) {
    };
    this.InternalDelete = function () {
    };
    this.InternalFirst = function () {
    };
    this.InternalGotoBookmark = function (ABookmark) {
    };
    this.InternalHandleException = function (E) {
      pas.SysUtils.ShowException(E,null);
    };
    this.InternalInitRecord = function (Buffer) {
    };
    this.InternalLast = function () {
    };
    this.InternalPost = function () {
      var $Self = this;
      function CheckRequiredFields() {
        var I = 0;
        for (var $l = 0, $end = $Self.FFieldList.GetCount() - 1; $l <= $end; $l++) {
          I = $l;
          var $with = $Self.FFieldList.GetField(I);
          if ($with.FRequired && !$with.FReadOnly && ($with.FFieldKind === $mod.TFieldKind.fkData) && !($with.FDataType === $mod.TFieldType.ftAutoInc) && $with.GetIsNull()) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SNeedField"),pas.System.VarRecs(18,$with.GetDisplayName()),$Self);
        };
      };
      CheckRequiredFields();
    };
    this.InternalSetToRecord = function (Buffer) {
    };
    this.SetBookmarkFlag = function (Buffer, Value) {
    };
    this.SetBookmarkData = function (Buffer, Data) {
    };
    this.SetUniDirectional = function (Value) {
      this.FIsUniDirectional = Value;
    };
    this.Notification = function (AComponent, Operation) {
      pas.Classes.TComponent.Notification.call(this,AComponent,Operation);
      if ((Operation === pas.Classes.TOperation.opRemove) && (AComponent === this.FDataProxy)) this.FDataProxy = null;
    };
    this.SetDataSetField = function (Value) {
      if (Value === this.FDataSetField) return;
      if ((Value !== null) && ((Value.FDataSet === this) || ((Value.FDataSet.GetDataSource() !== null) && (Value.FDataSet.GetDataSource().FDataSet === this)))) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SCircularDataLink"),this);
      if ((Value != null) && !this.$class.InheritsFrom(Value.FDataSet.FNestedDataSetClass)) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SNestedDataSetClass"),pas.System.VarRecs(18,Value.FDataSet.FNestedDataSetClass.$classname),this);
      if (this.GetActive()) this.Close();
      if (this.FDataSetField != null) this.FDataSetField.AssignNestedDataSet(null);
      this.FDataSetField = Value;
      if (Value != null) {
        Value.AssignNestedDataSet(this);
        if (Value.FDataSet.GetActive()) this.Open();
      };
    };
    this.GetFieldData = function (Field) {
      var Result = undefined;
      Result = this.GetFieldData$1(Field,$mod.TDataRecord.$clone(this.ActiveBuffer()));
      return Result;
    };
    this.SetFieldData = function (Field, AValue) {
      this.SetFieldData$1(Field,this.FBuffers[this.FActiveRecord],AValue);
    };
    this.GetFieldData$1 = function (Field, Buffer) {
      var Result = undefined;
      Result = Buffer.data[Field.FFieldName];
      if (pas.JS.isUndefined(Result)) Result = null;
      return Result;
    };
    this.SetFieldData$1 = function (Field, Buffer, AValue) {
      Buffer.data[Field.FFieldName] = AValue;
    };
    this.FieldDefsClass = function () {
      var Result = null;
      Result = $mod.TFieldDefs;
      return Result;
    };
    this.FieldsClass = function () {
      var Result = null;
      Result = $mod.TFields;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FFieldDefs = this.$class.FieldDefsClass().$create("Create$4",[this]);
      this.FFieldList = this.$class.FieldsClass().$create("Create$1",[this]);
      this.FDataSources = pas.Classes.TFPList.$create("Create");
      this.FConstraints = $mod.TCheckConstraints.$create("Create$2",[this]);
      this.FBuffers = rtl.arraySetLength(this.FBuffers,$mod.TDataRecord,1);
      this.FActiveRecord = 0;
      this.FEOF = true;
      this.FBOF = true;
      this.FIsUniDirectional = false;
      this.FAutoCalcFields = true;
      this.FDataRequestID = 0;
      this.FNestedDataSetClass = this.$class.ClassType();
      return this;
    };
    this.Destroy = function () {
      var i = 0;
      this.SetActive(false);
      this.SetDataSetField(null);
      rtl.free(this,"FFieldDefs");
      rtl.free(this,"FFieldList");
      rtl.free(this,"FNestedDataSets");
      var $with = this.FDataSources;
      while ($with.FCount > 0) rtl.getObject($with.Get($with.FCount - 1)).SetDataSet(null);
      $with.$destroy("Destroy");
      for (var $l = 0, $end = this.FBufferCount; $l <= $end; $l++) {
        i = $l;
        this.FreeRecordBuffer(this.FBuffers[i]);
      };
      rtl.free(this,"FConstraints");
      this.FBuffers = rtl.arraySetLength(this.FBuffers,$mod.TDataRecord,1);
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.ActiveBuffer = function () {
      var Result = $mod.TDataRecord.$new();
      if (this.FActiveRecord !== -1) {
        Result.$assign(this.FBuffers[this.FActiveRecord])}
       else Result.$assign($mod.TDataRecord.$new());
      return Result;
    };
    this.Append = function () {
      this.DoInsertAppend(true);
    };
    this.AppendRecord = function (Values) {
      this.DoInsertAppendRecord(Values,true);
    };
    this.BookmarkValid = function (ABookmark) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.ConvertToDateTime = function (aField, aValue, ARaiseException) {
      var Result = 0.0;
      Result = this.$class.DefaultConvertToDateTime(aField,aValue,ARaiseException);
      return Result;
    };
    this.ConvertDateTimeToNative = function (aField, aValue) {
      var Result = undefined;
      Result = this.$class.DefaultConvertDateTimeToNative(aField,aValue);
      return Result;
    };
    this.DefaultConvertToDateTime = function (aField, aValue, ARaiseException) {
      var Result = 0.0;
      Result = 0;
      if (rtl.isString(aValue)) {
        if (!pas.DateUtils.TryRFC3339ToDateTime("" + aValue,{get: function () {
            return Result;
          }, set: function (v) {
            Result = v;
          }})) throw pas.SysUtils.EConvertError.$create("CreateFmt",[rtl.getResStr(pas.DBConst,"SErrInvalidDateTime"),pas.System.VarRecs(18,"" + aValue)]);
      } else if (rtl.isNumber(aValue)) {
        Result = rtl.getNumber(aValue)}
       else if (pas.JS.isDate(aValue)) Result = pas.SysUtils.JSDateToDateTime(aValue);
      return Result;
    };
    this.DefaultConvertDateTimeToNative = function (aField, aValue) {
      var Result = undefined;
      Result = pas.DateUtils.DateTimeToRFC3339(aValue);
      return Result;
    };
    this.BlobDataToBytes = function (aValue) {
      var Result = [];
      Result = this.$class.DefaultBlobDataToBytes(aValue);
      return Result;
    };
    this.DefaultBlobDataToBytes = function (aValue) {
      var Result = [];
      var S = "";
      var I = 0;
      var J = 0;
      var L = 0;
      Result = rtl.arraySetLength(Result,0,0);
      if (rtl.isString(aValue)) {
        S = "" + aValue;
        L = S.length;
        Result = rtl.arraySetLength(Result,0,rtl.trunc((L + 1) / 2));
        I = 1;
        J = 0;
        while (I < L) {
          Result[J] = pas.SysUtils.StrToInt("$" + pas.System.Copy(S,I,2));
          I += 2;
          J += 1;
        };
      };
      return Result;
    };
    this.BytesToBlobData = function (aValue) {
      var Result = undefined;
      Result = this.$class.DefaultBytesToBlobData(rtl.arrayRef(aValue));
      return Result;
    };
    this.DefaultBytesToBlobData = function (aValue) {
      var Result = undefined;
      var S = "";
      var I = 0;
      if (rtl.length(aValue) === 0) {
        Result = null}
       else {
        S = "";
        for (var $l = 0, $end = rtl.length(aValue) - 1; $l <= $end; $l++) {
          I = $l;
          S = S.concat(pas.SysUtils.IntToHex(aValue[I],2));
        };
        Result = S;
      };
      return Result;
    };
    this.Cancel = function () {
      if (this.FState in rtl.createSet($mod.TDataSetState.dsEdit,$mod.TDataSetState.dsInsert)) {
        this.DataEvent($mod.TDataEvent.deCheckBrowseMode,0);
        this.DoBeforeCancel();
        this.UpdateCursorPos();
        this.InternalCancel();
        if ((this.FState === $mod.TDataSetState.dsInsert) && (this.FRecordCount === 1)) {
          this.FEOF = true;
          this.FBOF = true;
          this.FRecordCount = 0;
          this.InitRecord(this.FBuffers[this.FActiveRecord]);
          this.SetState($mod.TDataSetState.dsBrowse);
          this.DataEvent($mod.TDataEvent.deDataSetChange,0);
        } else {
          this.SetState($mod.TDataSetState.dsBrowse);
          this.SetCurrentRecord(this.FActiveRecord);
          this.Resync({});
        };
        this.DoAfterCancel();
      };
    };
    this.CheckBrowseMode = function () {
      this.CheckActive();
      this.DataEvent($mod.TDataEvent.deCheckBrowseMode,0);
      var $tmp = this.FState;
      if (($tmp === $mod.TDataSetState.dsEdit) || ($tmp === $mod.TDataSetState.dsInsert)) {
        this.UpdateRecord();
        if (this.FModified) {
          this.Post()}
         else this.Cancel();
      } else if ($tmp === $mod.TDataSetState.dsSetKey) this.Post();
    };
    this.ClearFields = function () {
      this.DataEvent($mod.TDataEvent.deCheckBrowseMode,0);
      this.InternalInitRecord(this.FBuffers[this.FActiveRecord]);
      if (this.FState !== $mod.TDataSetState.dsSetKey) this.GetCalcFields(this.FBuffers[this.FActiveRecord]);
      this.DataEvent($mod.TDataEvent.deRecordChange,0);
    };
    this.Close = function () {
      this.SetActive(false);
    };
    this.GetUpdateCount = function (UnresolvedOnly) {
      var Result = 0;
      var I = 0;
      Result = 0;
      if (!(this.FChangeList != null)) return Result;
      if (!UnresolvedOnly) {
        Result = this.FChangeList.FCount}
       else for (var $l = 0, $end = this.FChangeList.FCount - 1; $l <= $end; $l++) {
        I = $l;
        if (rtl.getObject(this.FChangeList.Get(I)).FResolveStatus === $mod.TResolveStatus.rsUnresolved) Result += 1;
      };
      return Result;
    };
    this.ApplyUpdates = function () {
      this.DoBeforeApplyUpdates();
      this.DoApplyUpdates();
    };
    this.ControlsDisabled = function () {
      var Result = false;
      Result = this.FDisableControlsCount > 0;
      return Result;
    };
    this.CompareBookmarks = function (Bookmark1, Bookmark2) {
      var Result = 0;
      Result = 0;
      return Result;
    };
    this.CursorPosChanged = function () {
      this.FCurrentRecord = -1;
    };
    this.Delete = function () {
      var R = null;
      if (!this.GetCanModify()) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SDatasetReadOnly"),this);
      if (this.IsEmpty()) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SDatasetEmpty"),this);
      if (this.FState in rtl.createSet($mod.TDataSetState.dsInsert)) {
        this.Cancel();
      } else {
        this.DataEvent($mod.TDataEvent.deCheckBrowseMode,0);
        this.DoBeforeDelete();
        this.DoBeforeScroll();
        R = this.AddToChangeList($mod.TUpdateStatus.usDeleted);
        if (!this.TryDoing(rtl.createCallback(this,"InternalDelete"),this.FOnDeleteError)) {
          if (R != null) this.RemoveFromChangeList(R);
          return;
        };
        this.SetState($mod.TDataSetState.dsBrowse);
        this.SetCurrentRecord(this.FActiveRecord);
        this.Resync({});
        this.DoAfterDelete();
        this.DoAfterScroll();
      };
    };
    this.DisableControls = function () {
      if (this.FDisableControlsCount === 0) {
        this.FDisableControlsState = this.FState;
        this.FEnableControlsEvent = $mod.TDataEvent.deDataSetChange;
      };
      this.FDisableControlsCount += 1;
    };
    this.Edit = function () {
      if (this.FState in rtl.createSet($mod.TDataSetState.dsEdit,$mod.TDataSetState.dsInsert)) return;
      this.CheckBrowseMode();
      if (!this.GetCanModify()) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SDatasetReadOnly"),this);
      if (this.FRecordCount === 0) {
        this.Append();
        return;
      };
      this.DoBeforeEdit();
      if (!this.TryDoing(rtl.createCallback(this,"InternalEdit"),this.FOnEditError)) return;
      this.GetCalcFields(this.FBuffers[this.FActiveRecord]);
      this.SetState($mod.TDataSetState.dsEdit);
      this.DataEvent($mod.TDataEvent.deRecordChange,0);
      this.DoAfterEdit();
    };
    this.EnableControls = function () {
      if (this.FDisableControlsCount > 0) this.FDisableControlsCount -= 1;
      if (this.FDisableControlsCount === 0) {
        if (this.FState !== this.FDisableControlsState) this.DataEvent($mod.TDataEvent.deUpdateState,0);
        if ((this.FState !== $mod.TDataSetState.dsInactive) && (this.FDisableControlsState !== $mod.TDataSetState.dsInactive)) this.DataEvent(this.FEnableControlsEvent,0);
      };
    };
    this.FieldByName = function (FieldName) {
      var Result = null;
      Result = this.FindField(FieldName);
      if (Result === null) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SFieldNotFound"),pas.System.VarRecs(18,FieldName),this);
      return Result;
    };
    this.FindField = function (FieldName) {
      var Result = null;
      Result = this.FFieldList.FindField(FieldName);
      return Result;
    };
    this.FindFirst = function () {
      var Result = false;
      Result = false;
      return Result;
    };
    this.FindLast = function () {
      var Result = false;
      Result = false;
      return Result;
    };
    this.FindNext = function () {
      var Result = false;
      Result = false;
      return Result;
    };
    this.FindPrior = function () {
      var Result = false;
      Result = false;
      return Result;
    };
    this.First = function () {
      this.CheckBrowseMode();
      this.DoBeforeScroll();
      if (!this.FIsUniDirectional) {
        this.ClearBuffers()}
       else if (!this.FBOF) {
        this.SetActive(false);
        this.SetActive(true);
      };
      try {
        this.InternalFirst();
        if (!this.FIsUniDirectional) this.GetNextRecords();
      } finally {
        this.FBOF = true;
        this.DataEvent($mod.TDataEvent.deDataSetChange,0);
        this.DoAfterScroll();
      };
    };
    this.FreeBookmark = function (ABookmark) {
    };
    this.GetBookmark = function () {
      var Result = $mod.TBookmark.$new();
      if (this.BookmarkAvailable()) {
        this.GetBookmarkData($mod.TDataRecord.$clone(this.ActiveBuffer()),Result)}
       else Result.Data = null;
      return Result;
    };
    this.GetCurrentRecord = function (Buffer) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.GetFieldList = function (List, FieldNames) {
      var F = null;
      var N = "";
      var StrPos = 0;
      if ((FieldNames === "") || (List === null)) return;
      StrPos = 1;
      do {
        N = $mod.ExtractFieldName(FieldNames,{get: function () {
            return StrPos;
          }, set: function (v) {
            StrPos = v;
          }});
        F = this.FieldByName(N);
        List.Add(F);
      } while (!(StrPos > FieldNames.length));
    };
    this.GetFieldList$1 = function (List, FieldNames) {
      var F = null;
      var N = "";
      var StrPos = 0;
      if ((FieldNames === "") || (List === null)) return;
      StrPos = 1;
      do {
        N = $mod.ExtractFieldName(FieldNames,{get: function () {
            return StrPos;
          }, set: function (v) {
            StrPos = v;
          }});
        F = this.FieldByName(N);
        List.Add(F);
      } while (!(StrPos > FieldNames.length));
    };
    this.GetFieldNames = function (List) {
      this.FFieldList.GetFieldNames(List);
    };
    this.GotoBookmark = function (ABookmark) {
      if (!pas.JS.isNull(ABookmark.Data)) {
        this.CheckBrowseMode();
        this.DoBeforeScroll();
        this.InternalGotoBookmark($mod.TBookmark.$clone(ABookmark));
        this.Resync(rtl.createSet($mod.TResyncMode$a.rmExact,$mod.TResyncMode$a.rmCenter));
        this.DoAfterScroll();
      };
    };
    this.Insert$1 = function () {
      this.DoInsertAppend(false);
    };
    this.InsertRecord = function (Values) {
      this.DoInsertAppendRecord(Values,false);
    };
    this.IsEmpty = function () {
      var Result = false;
      Result = this.FBOF && this.FEOF && !(this.FState === $mod.TDataSetState.dsInsert);
      return Result;
    };
    this.IsLinkedTo = function (ADataSource) {
      var Result = false;
      if ((ADataSource === null) || (ADataSource.FDataSet === null)) {
        Result = false;
      } else if (ADataSource.FDataSet === this) {
        Result = true;
      } else {
        Result = ADataSource.FDataSet.IsLinkedTo(ADataSource.FDataSet.GetDataSource());
      };
      return Result;
    };
    this.IsSequenced = function () {
      var Result = false;
      Result = true;
      return Result;
    };
    this.Last = function () {
      this.CheckBiDirectional();
      this.CheckBrowseMode();
      this.DoBeforeScroll();
      this.ClearBuffers();
      try {
        this.InternalLast();
        this.GetPriorRecords();
        if (this.FRecordCount > 0) this.FActiveRecord = this.FRecordCount - 1;
      } finally {
        this.FEOF = true;
        this.DataEvent($mod.TDataEvent.deDataSetChange,0);
        this.DoAfterScroll();
      };
    };
    this.Load = function (aOptions, aAfterLoad) {
      var Result = false;
      if ($mod.TLoadOption.loAtEOF in aOptions) $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SatEOFInternalOnly"),this);
      if ($mod.TLoadOption.loCancelPending in aOptions) this.CancelLoading();
      Result = this.DoLoad(rtl.refSet(aOptions),aAfterLoad);
      return Result;
    };
    this.Load$1 = function (aOptions) {
      var Result = false;
      Result = this.Load(rtl.refSet(aOptions),null);
      return Result;
    };
    this.Load$2 = function () {
      var Result = false;
      Result = this.Load({},null);
      return Result;
    };
    this.Locate = function (KeyFields, KeyValues, Options) {
      var Result = false;
      this.CheckBiDirectional();
      Result = false;
      return Result;
    };
    this.Lookup = function (KeyFields, KeyValues, ResultFields) {
      var Result = undefined;
      this.CheckBiDirectional();
      Result = null;
      return Result;
    };
    this.MoveBy = function (Distance) {
      var $Self = this;
      var Result = 0;
      var TheResult = 0;
      function ScrollForward() {
        var Result = 0;
        Result = 0;
        $Self.FBOF = false;
        while ((Distance > 0) && !$Self.FEOF) {
          if ($Self.FActiveRecord < ($Self.FRecordCount - 1)) {
            $Self.FActiveRecord += 1;
            Distance -= 1;
            TheResult += 1;
          } else {
            if ($Self.GetNextRecord()) {
              Distance -= 1;
              Result -= 1;
              TheResult += 1;
            } else {
              $Self.FEOF = true;
              $Self.DoLoad(rtl.createSet($mod.TLoadOption.loNoOpen,$mod.TLoadOption.loAtEOF),null);
            };
          };
        };
        return Result;
      };
      function ScrollBackward() {
        var Result = 0;
        $Self.CheckBiDirectional();
        Result = 0;
        $Self.FEOF = false;
        while ((Distance < 0) && !$Self.FBOF) {
          if ($Self.FActiveRecord > 0) {
            $Self.FActiveRecord -= 1;
            Distance += 1;
            TheResult -= 1;
          } else {
            if ($Self.GetPriorRecord()) {
              Distance += 1;
              Result += 1;
              TheResult -= 1;
            } else $Self.FBOF = true;
          };
        };
        return Result;
      };
      var Scrolled = 0;
      this.CheckBrowseMode();
      Result = 0;
      TheResult = 0;
      this.DoBeforeScroll();
      if ((Distance === 0) || ((Distance > 0) && this.FEOF) || ((Distance < 0) && this.FBOF)) return Result;
      try {
        Scrolled = 0;
        if (Distance > 0) {
          Scrolled = ScrollForward()}
         else Scrolled = ScrollBackward();
      } finally {
        this.DataEvent($mod.TDataEvent.deDataSetScroll,Scrolled);
        this.DoAfterScroll();
        Result = TheResult;
      };
      return Result;
    };
    this.Next = function () {
      if (this.FBlockReadSize > 0) {
        this.BlockReadNext()}
       else this.MoveBy(1);
    };
    this.Open = function () {
      this.SetActive(true);
    };
    var UpdateStates = [$mod.TUpdateStatus.usModified,$mod.TUpdateStatus.usInserted];
    this.Post = function () {
      var R = null;
      var WasInsert = false;
      this.UpdateRecord();
      if (this.FState in rtl.createSet($mod.TDataSetState.dsEdit,$mod.TDataSetState.dsInsert)) {
        this.DataEvent($mod.TDataEvent.deCheckBrowseMode,0);
        this.DoBeforePost();
        WasInsert = this.FState === $mod.TDataSetState.dsInsert;
        if (!this.TryDoing(rtl.createCallback(this,"InternalPost"),this.FOnPostError)) return;
        this.CursorPosChanged();
        this.SetState($mod.TDataSetState.dsBrowse);
        this.Resync({});
        R = this.AddToChangeList(UpdateStates[+WasInsert]);
        if (R != null) R.FBookmark.$assign(this.GetBookmark());
        this.DoAfterPost();
      } else if (this.FState !== $mod.TDataSetState.dsSetKey) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SNotEditing"),pas.System.VarRecs(18,this.FName),this);
    };
    this.Prior = function () {
      this.MoveBy(-1);
    };
    this.Refresh = function () {
      this.CheckBrowseMode();
      this.DoBeforeRefresh();
      this.UpdateCursorPos();
      this.InternalRefresh();
      this.Resync({});
      this.DoAfterRefresh();
    };
    this.Resync = function (Mode) {
      var i = 0;
      var count = 0;
      if (this.FIsUniDirectional) return;
      if (this.GetRecord(this.FBuffers[0],$mod.TGetMode.gmCurrent,false) !== $mod.TGetResult.grOK) if ($mod.TResyncMode$a.rmExact in Mode) {
        $mod.DatabaseError$1(rtl.getResStr(pas.DBConst,"SNoSuchRecord"),this)}
       else if ((this.GetRecord(this.FBuffers[0],$mod.TGetMode.gmNext,true) !== $mod.TGetResult.grOK) && (this.GetRecord(this.FBuffers[0],$mod.TGetMode.gmPrior,true) !== $mod.TGetResult.grOK)) {
        this.ClearBuffers();
        this.InternalInitRecord(this.FBuffers[this.FActiveRecord]);
        this.DataEvent($mod.TDataEvent.deDataSetChange,0);
        return;
      };
      this.FCurrentRecord = 0;
      this.FEOF = false;
      this.FBOF = false;
      if ($mod.TResyncMode$a.rmCenter in Mode) {
        count = rtl.trunc(this.FRecordCount / 2)}
       else count = this.FActiveRecord;
      i = 0;
      this.FRecordCount = 1;
      this.FActiveRecord = 0;
      while ((i < count) && this.GetPriorRecord()) i += 1;
      this.FActiveRecord = i;
      this.GetNextRecords();
      if (this.FRecordCount < this.FBufferCount) this.FActiveRecord = this.FActiveRecord + this.GetPriorRecords();
      this.DataEvent($mod.TDataEvent.deDataSetChange,0);
    };
    this.CancelLoading = function () {
      this.FMinLoadID = this.FDataRequestID;
      this.FLoadCount = 0;
    };
    this.SetFields = function (Values) {
      var I = 0;
      for (var $l = 0, $end = rtl.length(Values) - 1; $l <= $end; $l++) {
        I = $l;
        this.FFieldList.GetField(I).AssignValue(Values[I]);
      };
    };
    this.UpdateCursorPos = function () {
      if (this.FRecordCount > 0) this.SetCurrentRecord(this.FActiveRecord);
    };
    this.UpdateRecord = function () {
      if (!(this.FState in $mod.dsEditModes)) $mod.DatabaseErrorFmt$1(rtl.getResStr(pas.DBConst,"SNotEditing"),pas.System.VarRecs(18,this.FName),this);
      this.DataEvent($mod.TDataEvent.deUpdateRecord,0);
    };
    this.GetPendingUpdates = function () {
      var Result = [];
      var L = null;
      var I = 0;
      L = $mod.TRecordUpdateDescriptorList.$create("Create");
      try {
        Result = rtl.arraySetLength(Result,$mod.TResolveInfo,this.GetRecordUpdates(L));
        for (var $l = 0, $end = L.FCount - 1; $l <= $end; $l++) {
          I = $l;
          Result[I].$assign(this.RecordUpdateDescriptorToResolveInfo(L.GetUpdate(I)));
        };
      } finally {
        L = rtl.freeLoc(L);
      };
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TDataLink",pas.Classes.TPersistent,function () {
    this.$init = function () {
      pas.Classes.TPersistent.$init.call(this);
      this.FFirstRecord = 0;
      this.FBufferCount = 0;
      this.FActive = false;
      this.FDataSourceFixed = false;
      this.FEditing = false;
      this.FReadOnly = false;
      this.FUpdatingRecord = false;
      this.FVisualControl = false;
      this.FDataSource = null;
    };
    this.$final = function () {
      this.FDataSource = undefined;
      pas.Classes.TPersistent.$final.call(this);
    };
    this.CalcFirstRecord = function (Index) {
      var Result = 0;
      if (this.FDataSource.FDataSet.FActiveRecord > ((this.FFirstRecord + Index + this.FBufferCount) - 1)) {
        Result = this.FDataSource.FDataSet.FActiveRecord - ((this.FFirstRecord + Index + this.FBufferCount) - 1)}
       else if (this.FDataSource.FDataSet.FActiveRecord < (this.FFirstRecord + Index)) {
        Result = this.FDataSource.FDataSet.FActiveRecord - (this.FFirstRecord + Index)}
       else Result = 0;
      this.FFirstRecord += Index + Result;
      return Result;
    };
    this.CalcRange = function () {
      var aMax = 0;
      var aMin = 0;
      aMin = (this.GetDataset().FActiveRecord - this.FBufferCount) + 1;
      if (aMin < 0) aMin = 0;
      aMax = this.GetDataset().FBufferCount - this.FBufferCount;
      if (aMax < 0) aMax = 0;
      if (aMax > this.GetDataset().FActiveRecord) aMax = this.GetDataset().FActiveRecord;
      if (this.FFirstRecord < aMin) this.FFirstRecord = aMin;
      if (this.FFirstRecord > aMax) this.FFirstRecord = aMax;
      if ((this.FFirstRecord !== 0) && ((this.GetDataset().FActiveRecord - this.FFirstRecord) < (this.FBufferCount - 1))) this.FFirstRecord -= 1;
    };
    this.CheckActiveAndEditing = function () {
      var B = false;
      B = (this.FDataSource != null) && !(this.FDataSource.FState in rtl.createSet($mod.TDataSetState.dsInactive,$mod.TDataSetState.dsOpening));
      this.SetActive(B);
      B = (this.FDataSource != null) && (this.FDataSource.FState in $mod.dsEditModes) && !this.FReadOnly;
      if (B !== this.FEditing) {
        this.FEditing = B;
        this.EditingChanged();
      };
    };
    this.GetDataset = function () {
      var Result = null;
      if (this.FDataSource != null) {
        Result = this.FDataSource.FDataSet}
       else Result = null;
      return Result;
    };
    this.SetActive = function (AActive) {
      if (this.FActive !== AActive) {
        this.FActive = AActive;
        this.ActiveChanged();
      };
    };
    this.SetDataSource = function (Value) {
      if (this.FDataSource === Value) return;
      if (!this.FDataSourceFixed) {
        if (this.FDataSource != null) {
          this.FDataSource.UnregisterDataLink(this);
          this.FDataSource = null;
          this.CheckActiveAndEditing();
        };
        this.FDataSource = Value;
        if (this.FDataSource != null) {
          this.FDataSource.RegisterDataLink(this);
          this.CheckActiveAndEditing();
        };
      };
    };
    this.SetReadOnly = function (Value) {
      if (this.FReadOnly !== Value) {
        this.FReadOnly = Value;
        this.CheckActiveAndEditing();
      };
    };
    this.ActiveChanged = function () {
      this.FFirstRecord = 0;
    };
    this.CheckBrowseMode = function () {
    };
    this.DataEvent = function (Event, Info) {
      if (Event === $mod.TDataEvent.deUpdateState) {
        this.CheckActiveAndEditing()}
       else if (this.FActive) {
        var $tmp = Event;
        if (($tmp === $mod.TDataEvent.deFieldChange) || ($tmp === $mod.TDataEvent.deRecordChange)) {
          if (!this.FUpdatingRecord) this.RecordChanged(rtl.getObject(Info))}
         else if ($tmp === $mod.TDataEvent.deDataSetChange) {
          this.SetActive(this.FDataSource.FDataSet.GetActive());
          this.CalcRange();
          this.CalcFirstRecord(rtl.trunc(Info));
          this.DataSetChanged();
        } else if ($tmp === $mod.TDataEvent.deDataSetScroll) {
          this.DataSetScrolled(this.CalcFirstRecord(rtl.trunc(Info)))}
         else if ($tmp === $mod.TDataEvent.deLayoutChange) {
          this.CalcFirstRecord(rtl.trunc(Info));
          this.LayoutChanged();
        } else if ($tmp === $mod.TDataEvent.deUpdateRecord) {
          this.UpdateRecord()}
         else if ($tmp === $mod.TDataEvent.deCheckBrowseMode) {
          this.CheckBrowseMode()}
         else if ($tmp === $mod.TDataEvent.deFocusControl) this.FocusControl(Info);
      };
    };
    this.DataSetChanged = function () {
      this.RecordChanged(null);
    };
    this.DataSetScrolled = function (Distance) {
      this.DataSetChanged();
    };
    this.EditingChanged = function () {
    };
    this.FocusControl = function (Field) {
    };
    this.GetActiveRecord = function () {
      var Result = 0;
      Result = this.GetDataset().FActiveRecord - this.FFirstRecord;
      return Result;
    };
    this.GetBOF = function () {
      var Result = false;
      Result = this.GetDataset().FBOF;
      return Result;
    };
    this.GetBufferCount = function () {
      var Result = 0;
      Result = this.FBufferCount;
      return Result;
    };
    this.GetEOF = function () {
      var Result = false;
      Result = this.GetDataset().FEOF;
      return Result;
    };
    this.GetRecordCount = function () {
      var Result = 0;
      Result = this.GetDataset().FRecordCount;
      if (Result > this.GetBufferCount()) Result = this.GetBufferCount();
      return Result;
    };
    this.LayoutChanged = function () {
      this.DataSetChanged();
    };
    this.MoveBy = function (Distance) {
      var Result = 0;
      Result = this.GetDataset().MoveBy(Distance);
      return Result;
    };
    this.RecordChanged = function (Field) {
    };
    this.SetActiveRecord = function (Value) {
      this.GetDataset().FActiveRecord = Value + this.FFirstRecord;
    };
    this.SetBufferCount = function (Value) {
      if (this.FBufferCount !== Value) {
        this.FBufferCount = Value;
        if (this.FActive) {
          this.GetDataset().RecalcBufListSize();
          this.CalcRange();
        };
      };
    };
    this.UpdateData = function () {
    };
    this.Create$1 = function () {
      pas.System.TObject.Create.call(this);
      this.FBufferCount = 1;
      this.FFirstRecord = 0;
      this.FDataSource = null;
      this.FDataSourceFixed = false;
      return this;
    };
    this.Destroy = function () {
      this.FActive = false;
      this.FEditing = false;
      this.FDataSourceFixed = false;
      this.SetDataSource(null);
      pas.System.TObject.Destroy.call(this);
    };
    this.Edit = function () {
      var Result = false;
      if (!this.FReadOnly) this.FDataSource.Edit();
      Result = this.FEditing;
      return Result;
    };
    this.UpdateRecord = function () {
      this.FUpdatingRecord = true;
      try {
        this.UpdateData();
      } finally {
        this.FUpdatingRecord = false;
      };
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[]);
  });
  rtl.createClass(this,"TDetailDataLink",this.TDataLink,function () {
    this.GetDetailDataSet = function () {
      var Result = null;
      Result = null;
      return Result;
    };
  });
  rtl.createClass(this,"TMasterDataLink",this.TDetailDataLink,function () {
    this.$init = function () {
      $mod.TDetailDataLink.$init.call(this);
      this.FDetailDataSet = null;
      this.FFieldNames = "";
      this.FFields = null;
      this.FOnMasterChange = null;
      this.FOnMasterDisable = null;
    };
    this.$final = function () {
      this.FDetailDataSet = undefined;
      this.FFields = undefined;
      this.FOnMasterChange = undefined;
      this.FOnMasterDisable = undefined;
      $mod.TDetailDataLink.$final.call(this);
    };
    this.SetFieldNames = function (Value) {
      if (this.FFieldNames !== Value) {
        this.FFieldNames = Value;
        this.ActiveChanged();
      };
    };
    this.ActiveChanged = function () {
      this.FFields.Clear();
      if (this.FActive) try {
        this.GetDataset().GetFieldList(this.FFields,this.FFieldNames);
      } catch ($e) {
        this.FFields.Clear();
        throw $e;
      };
      if (this.FDetailDataSet.GetActive() && !(pas.Classes.TComponentStateItem.csDestroying in this.FDetailDataSet.FComponentState)) if (this.FActive && (this.FFields.GetCount() > 0)) {
        this.DoMasterChange()}
       else this.DoMasterDisable();
    };
    this.CheckBrowseMode = function () {
      if (this.FDetailDataSet.GetActive()) this.FDetailDataSet.CheckBrowseMode();
    };
    this.GetDetailDataSet = function () {
      var Result = null;
      Result = this.FDetailDataSet;
      return Result;
    };
    this.LayoutChanged = function () {
      this.ActiveChanged();
    };
    this.RecordChanged = function (Field) {
      if ((this.FDataSource.FState !== $mod.TDataSetState.dsSetKey) && this.FDetailDataSet.GetActive() && (this.FFields.GetCount() > 0) && ((Field === null) || (this.FFields.IndexOf(Field) >= 0))) this.DoMasterChange();
    };
    this.DoMasterDisable = function () {
      if (this.FOnMasterDisable != null) this.FOnMasterDisable(this);
    };
    this.DoMasterChange = function () {
      if (this.FOnMasterChange != null) this.FOnMasterChange(this);
    };
    this.Create$2 = function (ADataSet) {
      $mod.TDataLink.Create$1.call(this);
      this.FDetailDataSet = ADataSet;
      this.FFields = pas.Classes.TList.$create("Create$1");
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FFields");
      $mod.TDataLink.Destroy.call(this);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["ADataSet",$mod.$rtti["TDataSet"]]]);
  });
  rtl.createClass(this,"TMasterParamsDataLink",this.TMasterDataLink,function () {
    this.$init = function () {
      $mod.TMasterDataLink.$init.call(this);
      this.FParams = null;
    };
    this.$final = function () {
      this.FParams = undefined;
      $mod.TMasterDataLink.$final.call(this);
    };
    this.SetParams = function (AValue) {
      this.FParams = AValue;
      if (AValue !== null) this.RefreshParamNames();
    };
    this.DoMasterDisable = function () {
      $mod.TMasterDataLink.DoMasterDisable.call(this);
    };
    this.DoMasterChange = function () {
      $mod.TMasterDataLink.DoMasterChange.call(this);
      if ((this.FParams != null) && (this.GetDetailDataSet() != null) && this.GetDetailDataSet().GetActive()) {
        this.GetDetailDataSet().CheckBrowseMode();
        this.GetDetailDataSet().Close();
        this.GetDetailDataSet().Open();
      };
    };
    this.Create$2 = function (ADataSet) {
      var P = null;
      $mod.TMasterDataLink.Create$2.call(this,ADataSet);
      if (ADataSet !== null) {
        P = pas.TypInfo.GetObjectProp$1(ADataSet,"Params",$mod.TParams);
        if (P !== null) this.SetParams(P);
      };
      return this;
    };
    this.RefreshParamNames = function () {
      var FN = "";
      var DS = null;
      var F = null;
      var I = 0;
      var P = null;
      FN = "";
      DS = this.GetDataset();
      if (this.FParams != null) {
        F = null;
        for (var $l = 0, $end = this.FParams.GetCount() - 1; $l <= $end; $l++) {
          I = $l;
          P = this.FParams.GetItem$1(I);
          if (!P.FBound) {
            if (DS != null) F = DS.FindField(P.FName);
            if (!(DS != null) || !DS.GetActive() || (F !== null)) {
              if (FN !== "") FN = FN + ";";
              FN = FN + P.FName;
            };
          };
        };
      };
      this.SetFieldNames(FN);
    };
    this.CopyParamsFromMaster = function (CopyBound) {
      if (this.FParams != null) this.FParams.CopyParamValuesFromDataset(this.GetDataset(),CopyBound);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["ADataSet",$mod.$rtti["TDataSet"]]]);
  });
  this.$rtti.$MethodVar("TDataChangeEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Field",this.$rtti["TField"]]]), methodkind: 0});
  rtl.createClass(this,"TDataSource",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FDataSet = null;
      this.FDataLinks = null;
      this.FEnabled = false;
      this.FAutoEdit = false;
      this.FState = 0;
      this.FOnStateChange = null;
      this.FOnDataChange = null;
      this.FOnUpdateData = null;
    };
    this.$final = function () {
      this.FDataSet = undefined;
      this.FDataLinks = undefined;
      this.FOnStateChange = undefined;
      this.FOnDataChange = undefined;
      this.FOnUpdateData = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.DistributeEvent = function (Event, Info) {
      var i = 0;
      var $with = this.FDataLinks;
      for (var $l = 0, $end = $with.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        var $with1 = rtl.getObject($with.Get(i));
        if (!$with1.FVisualControl) $with1.DataEvent(Event,Info);
      };
      for (var $l1 = 0, $end1 = $with.GetCount() - 1; $l1 <= $end1; $l1++) {
        i = $l1;
        var $with2 = rtl.getObject($with.Get(i));
        if ($with2.FVisualControl) $with2.DataEvent(Event,Info);
      };
    };
    this.RegisterDataLink = function (DataLink) {
      this.FDataLinks.Add(DataLink);
      if (this.FDataSet != null) this.FDataSet.RecalcBufListSize();
    };
    var OnDataChangeEvents = rtl.createSet($mod.TDataEvent.deRecordChange,$mod.TDataEvent.deDataSetChange,$mod.TDataEvent.deDataSetScroll,$mod.TDataEvent.deLayoutChange,$mod.TDataEvent.deUpdateState);
    this.ProcessEvent = function (Event, Info) {
      var NeedDataChange = false;
      var FLastState = 0;
      if (Event === $mod.TDataEvent.deUpdateState) {
        NeedDataChange = this.FState === $mod.TDataSetState.dsInactive;
        FLastState = this.FState;
        if ((this.FDataSet != null) && this.FEnabled) {
          this.FState = this.FDataSet.FState}
         else this.FState = $mod.TDataSetState.dsInactive;
        if (this.FState === FLastState) return;
      } else NeedDataChange = true;
      this.DistributeEvent(Event,Info);
      if (!(pas.Classes.TComponentStateItem.csDestroying in this.FComponentState)) {
        if (Event === $mod.TDataEvent.deUpdateState) this.DoStateChange();
        if ((Event in OnDataChangeEvents) && NeedDataChange) this.DoDataChange(null);
        if (Event === $mod.TDataEvent.deFieldChange) this.DoDataChange(Info);
        if (Event === $mod.TDataEvent.deUpdateRecord) this.DoUpdateData();
      };
    };
    this.SetDataSet = function (ADataSet) {
      if (this.FDataSet !== null) {
        this.FDataSet.UnRegisterDataSource(this);
        this.FDataSet = null;
        this.ProcessEvent($mod.TDataEvent.deUpdateState,0);
      };
      if (ADataSet !== null) {
        ADataSet.RegisterDataSource(this);
        this.FDataSet = ADataSet;
        this.ProcessEvent($mod.TDataEvent.deUpdateState,0);
      };
    };
    this.SetEnabled = function (Value) {
      this.FEnabled = Value;
      this.ProcessEvent($mod.TDataEvent.deUpdateState,0);
    };
    this.UnregisterDataLink = function (DataLink) {
      this.FDataLinks.Remove(DataLink);
      if (this.FDataSet !== null) this.FDataSet.RecalcBufListSize();
    };
    this.DoDataChange = function (Info) {
      if (this.FOnDataChange != null) this.FOnDataChange(this,Info);
    };
    this.DoStateChange = function () {
      if (this.FOnStateChange != null) this.FOnStateChange(this);
    };
    this.DoUpdateData = function () {
      if (this.FOnUpdateData != null) this.FOnUpdateData(this);
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FDataLinks = pas.Classes.TList.$create("Create$1");
      this.FEnabled = true;
      this.FAutoEdit = true;
      return this;
    };
    this.Destroy = function () {
      this.FOnStateChange = null;
      this.SetDataSet(null);
      var $with = this.FDataLinks;
      while ($with.GetCount() > 0) rtl.getObject($with.Get($with.GetCount() - 1)).SetDataSource(null);
      rtl.free(this,"FDataLinks");
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.Edit = function () {
      if ((this.FState === $mod.TDataSetState.dsBrowse) && this.FAutoEdit) this.FDataSet.Edit();
    };
    this.IsLinkedTo = function (ADataSet) {
      var Result = false;
      Result = false;
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("AutoEdit",0,rtl.boolean,"FAutoEdit","FAutoEdit",{Default: true});
    $r.addProperty("DataSet",2,$mod.$rtti["TDataSet"],"FDataSet","SetDataSet");
    $r.addProperty("Enabled",2,rtl.boolean,"FEnabled","SetEnabled",{Default: true});
    $r.addProperty("OnStateChange",0,pas.Classes.$rtti["TNotifyEvent"],"FOnStateChange","FOnStateChange");
    $r.addProperty("OnDataChange",0,$mod.$rtti["TDataChangeEvent"],"FOnDataChange","FOnDataChange");
    $r.addProperty("OnUpdateData",0,pas.Classes.$rtti["TNotifyEvent"],"FOnUpdateData","FOnUpdateData");
  });
  this.TDataRequestResult = {"0": "rrFail", rrFail: 0, "1": "rrEOF", rrEOF: 1, "2": "rrOK", rrOK: 2};
  this.$rtti.$Enum("TDataRequestResult",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TDataRequestResult});
  this.$rtti.$MethodVar("TDataRequestEvent",{procsig: rtl.newTIProcSig([["ARequest",this.$rtti["TDataRequest"]]]), methodkind: 0});
  rtl.createClass(this,"TDataRequest",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FBookmark = $mod.TBookmark.$new();
      this.FCurrent = $mod.TBookmark.$new();
      this.FDataset = null;
      this.FErrorMsg = "";
      this.FEvent = null;
      this.FLoadOptions = {};
      this.FRequestID = 0;
      this.FSuccess = 0;
      this.FData = undefined;
      this.FAfterRequest = null;
      this.FDataProxy = null;
    };
    this.$final = function () {
      this.FBookmark = undefined;
      this.FCurrent = undefined;
      this.FDataset = undefined;
      this.FEvent = undefined;
      this.FLoadOptions = undefined;
      this.FAfterRequest = undefined;
      this.FDataProxy = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.DoAfterRequest = function () {
      if (this.FAfterRequest != null) this.FAfterRequest(this);
    };
    this.Create$1 = function (aDataProxy, aOptions, aAfterRequest, aAfterLoad) {
      this.FDataProxy = aDataProxy;
      this.FLoadOptions = rtl.refSet(aOptions);
      this.FEvent = aAfterLoad;
      this.FAfterRequest = aAfterRequest;
      return this;
    };
  });
  this.$rtti.$ClassRef("TDataRequestClass",{instancetype: this.$rtti["TDataRequest"]});
  rtl.createClass(this,"TRecordUpdateDescriptor",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FBookmark = $mod.TBookmark.$new();
      this.FData = undefined;
      this.FDataset = null;
      this.FProxy = null;
      this.FResolveStatus = 0;
      this.FResolveError = "";
      this.FServerData = undefined;
      this.FStatus = 0;
    };
    this.$final = function () {
      this.FBookmark = undefined;
      this.FDataset = undefined;
      this.FProxy = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.SetResolveStatus = function (aValue) {
      this.FResolveStatus = aValue;
    };
    this.Reset = function () {
      this.FResolveStatus = $mod.TResolveStatus.rsUnresolved;
      this.FResolveError = "";
      this.FServerData = null;
    };
    this.Create$1 = function (aProxy, aDataset, aBookmark, AData, AStatus) {
      this.FDataset = aDataset;
      this.FBookmark.$assign(aBookmark);
      this.FData = AData;
      this.FStatus = AStatus;
      this.FProxy = aProxy;
      return this;
    };
    this.Resolve = function (aData) {
      this.SetResolveStatus($mod.TResolveStatus.rsResolved);
      this.FServerData = aData;
    };
    this.ResolveFailed = function (aError) {
      this.SetResolveStatus($mod.TResolveStatus.rsResolveFailed);
      this.FResolveError = aError;
    };
  });
  this.$rtti.$ClassRef("TRecordUpdateDescriptorClass",{instancetype: this.$rtti["TRecordUpdateDescriptor"]});
  rtl.createClass(this,"TRecordUpdateDescriptorList",pas.Classes.TFPList,function () {
    this.GetUpdate = function (AIndex) {
      var Result = null;
      Result = rtl.getObject(this.Get(AIndex));
      return Result;
    };
  });
  this.TUpdateBatchStatus = {"0": "ubsPending", ubsPending: 0, "1": "ubsProcessing", ubsProcessing: 1, "2": "ubsProcessed", ubsProcessed: 2, "3": "ubsResolved", ubsResolved: 3};
  this.$rtti.$Enum("TUpdateBatchStatus",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TUpdateBatchStatus});
  this.$rtti.$MethodVar("TResolveBatchEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["ARequest",this.$rtti["TRecordUpdateBatch"]]]), methodkind: 0});
  rtl.createClass(this,"TRecordUpdateBatch",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FBatchID = 0;
      this.FDataset = null;
      this.FLastChangeIndex = 0;
      this.FList = null;
      this.FOnResolve = null;
      this.FOwnsList = false;
      this.FStatus = 0;
    };
    this.$final = function () {
      this.FDataset = undefined;
      this.FList = undefined;
      this.FOnResolve = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (aBatchID, AList, AOwnsList) {
      this.FBatchID = aBatchID;
      this.FList = AList;
      this.FOwnsList = AOwnsList;
      this.FStatus = $mod.TUpdateBatchStatus.ubsPending;
      return this;
    };
    this.Destroy = function () {
      if (this.FOwnsList) this.FreeList();
      pas.System.TObject.Destroy.call(this);
    };
    this.FreeList = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FList;
        }, set: function (v) {
          this.p.FList = v;
        }});
    };
  });
  this.$rtti.$ClassRef("TRecordUpdateBatchClass",{instancetype: this.$rtti["TRecordUpdateBatch"]});
  rtl.createClass(this,"TDataProxy",pas.Classes.TComponent,function () {
    this.GetDataRequestClass = function () {
      var Result = null;
      Result = $mod.TDataRequest;
      return Result;
    };
    this.GetUpdateDescriptorClass = function () {
      var Result = null;
      Result = $mod.TRecordUpdateDescriptor;
      return Result;
    };
    this.GetUpdateBatchClass = function () {
      var Result = null;
      Result = $mod.TRecordUpdateBatch;
      return Result;
    };
    this.ResolveBatch = function (aBatch) {
      try {
        if (aBatch.FOnResolve != null) aBatch.FOnResolve(this,aBatch);
      } finally {
        aBatch = rtl.freeLoc(aBatch);
      };
    };
    this.GetDataRequest = function (aOptions, aAfterRequest, aAfterLoad) {
      var Result = null;
      Result = this.GetDataRequestClass().$create("Create$1",[this,rtl.refSet(aOptions),aAfterRequest,aAfterLoad]);
      return Result;
    };
    this.GetUpdateDescriptor = function (aDataset, aBookmark, AData, AStatus) {
      var Result = null;
      Result = this.GetUpdateDescriptorClass().$create("Create$1",[this,aDataset,$mod.TBookmark.$clone(aBookmark),AData,AStatus]);
      return Result;
    };
    this.GetRecordUpdateBatch = function (aBatchID, AList, AOwnsList) {
      var Result = null;
      Result = this.GetUpdateBatchClass().$create("Create$1",[aBatchID,AList,AOwnsList]);
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  this.$rtti.$StaticArray("Fieldtypenames$a",{dims: [15], eltype: rtl.string});
  this.Fieldtypenames = ["Unknown","String","Integer","NativeInt","Boolean","Float","Date","Time","DateTime","AutoInc","Blob","Memo","FixedChar","Variant","Dataset"];
  this.$rtti.$StaticArray("DefaultFieldClasses$a",{dims: [15], eltype: this.$rtti["TFieldClass"]});
  this.DefaultFieldClasses = [this.TField,this.TStringField,this.TIntegerField,this.TLargeintField,this.TBooleanField,this.TFloatField,this.TDateField,this.TTimeField,this.TDateTimeField,this.TAutoIncField,this.TBlobField,this.TMemoField,this.TStringField,this.TVariantField,null];
  this.dsEditModes = rtl.createSet(this.TDataSetState.dsEdit,this.TDataSetState.dsInsert,this.TDataSetState.dsSetKey);
  this.dsWriteModes = rtl.createSet(this.TDataSetState.dsEdit,this.TDataSetState.dsInsert,this.TDataSetState.dsSetKey,this.TDataSetState.dsCalcFields,this.TDataSetState.dsFilter,this.TDataSetState.dsNewValue,this.TDataSetState.dsInternalCalc,this.TDataSetState.dsRefreshFields);
  this.ftBlobTypes = rtl.createSet(this.TFieldType.ftBlob,this.TFieldType.ftMemo);
  this.DatabaseError = function (Msg) {
    throw $mod.EDatabaseError.$create("Create$1",[Msg]);
  };
  this.DatabaseError$1 = function (Msg, Comp) {
    if ((Comp != null) && (Comp.FName !== "")) {
      throw $mod.EDatabaseError.$create("CreateFmt",["%s : %s",pas.System.VarRecs(18,Comp.FName,18,Msg)])}
     else $mod.DatabaseError(Msg);
  };
  this.DatabaseErrorFmt = function (Fmt, Args) {
    throw $mod.EDatabaseError.$create("CreateFmt",[Fmt,Args]);
  };
  this.DatabaseErrorFmt$1 = function (Fmt, Args, Comp) {
    if (Comp != null) {
      throw $mod.EDatabaseError.$create("CreateFmt",[pas.SysUtils.Format("%s : %s",pas.System.VarRecs(18,Comp.FName,18,Fmt)),Args])}
     else $mod.DatabaseErrorFmt(Fmt,Args);
  };
  this.ExtractFieldName = function (Fields, Pos) {
    var Result = "";
    var i = 0;
    var FieldsLength = 0;
    i = Pos.get();
    FieldsLength = Fields.length;
    while ((i <= FieldsLength) && (Fields.charAt(i - 1) !== ";")) i += 1;
    Result = pas.SysUtils.Trim(pas.System.Copy(Fields,Pos.get(),i - Pos.get()));
    if ((i <= FieldsLength) && (Fields.charAt(i - 1) === ";")) i += 1;
    Pos.set(i);
    return Result;
  };
  $mod.$implcode = function () {
    $impl.DefaultBufferCount = 10;
    $impl.SBoolean = "Boolean";
    $impl.SDateTime = "TDateTime";
    $impl.SFloat = "Float";
    $impl.SInteger = "Integer";
    $impl.SLargeInt = "NativeInt";
    $impl.SJSValue = "JSValue";
    $impl.SString = "String";
    $impl.SBytes = "Bytes";
    $impl.SkipQuotesString = function (S, p, QuoteChar, EscapeSlash, EscapeRepeat) {
      var notRepeatEscaped = false;
      p.set(p.get() + 1);
      do {
        notRepeatEscaped = true;
        while (!pas.SysUtils.CharInSet(S.charAt(p.get() - 1),["\x00",QuoteChar])) {
          if (EscapeSlash && (S.charAt(p.get() - 1) === "\\") && (p.get() < S.length)) {
            p.set(p.get() + 2)}
           else p.set(p.get() + 1);
        };
        if (S.charAt(p.get() - 1) === QuoteChar) {
          p.set(p.get() + 1);
          if ((S.charAt(p.get() - 1) === QuoteChar) && EscapeRepeat) {
            notRepeatEscaped = false;
            p.set(p.get() + 1);
          };
        };
      } while (!notRepeatEscaped);
    };
    $impl.SkipComments = function (S, p, EscapeSlash, EscapeRepeat) {
      var Result = false;
      Result = false;
      var $tmp = S.charAt(p.get() - 1);
      if (($tmp === "'") || ($tmp === '"') || ($tmp === "`")) {
        Result = true;
        $impl.SkipQuotesString(S,p,S.charAt(p.get() - 1),EscapeSlash,EscapeRepeat);
      } else if ($tmp === "-") {
        p.set(p.get() + 1);
        if (S.charAt(p.get() - 1) === "-") {
          Result = true;
          do {
            p.set(p.get() + 1);
          } while (!pas.SysUtils.CharInSet(S.charAt(p.get() - 1),["\n","\r","\x00"]));
          while (pas.SysUtils.CharInSet(S.charAt(p.get() - 1),["\n","\r"])) p.set(p.get() + 1);
        };
      } else if ($tmp === "/") {
        p.set(p.get() + 1);
        if (S.charAt(p.get() - 1) === "*") {
          Result = true;
          p.set(p.get() + 1);
          while (p.get() <= S.length) {
            if (S.charAt(p.get() - 1) === "*") {
              p.set(p.get() + 1);
              if (S.charAt(p.get() - 1) === "/") break;
            } else p.set(p.get() + 1);
          };
          if ((p.get() <= S.length) && (S.charAt(p.get() - 1) === "/")) p.set(p.get() + 1);
        };
      };
      return Result;
    };
  };
  $mod.$init = function () {
    pas.Classes.RegisterClass($mod.TLongintField);
    pas.Classes.RegisterClass($mod.TWideStringField);
  };
},["DBConst","TypInfo"]);
//# sourceMappingURL=db.js.map
