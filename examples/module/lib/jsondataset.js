rtl.module("JSONDataset",["System","Types","JS","DB","Classes","SysUtils","TypInfo","fpexprpars"],function () {
  "use strict";
  var $mod = this;
  this.$rtti.$Class("TBaseJSONDataSet");
  this.$rtti.$Class("TJSONIndexDef");
  this.TJSONRowType = {"0": "rtJSONObject", rtJSONObject: 0, "1": "rtJSONArray", rtJSONArray: 1};
  this.$rtti.$Enum("TJSONRowType",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TJSONRowType});
  rtl.createClass(this,"TJSONFieldMapper",pas.System.TObject,function () {
    this.CopyRow = function (aRow) {
      var Result = undefined;
      Result = JSON.parse(JSON.stringify(aRow));
      return Result;
    };
    this.GetJSONDataForField$1 = function (F, Row) {
      var Result = undefined;
      Result = this.GetJSONDataForField(F.FFieldName,F.GetIndex(),Row);
      return Result;
    };
    this.SetJSONDataForField$1 = function (F, Row, Data) {
      this.SetJSONDataForField(F.FFieldName,F.GetIndex(),Row,Data);
    };
  });
  rtl.createClass(this,"TJSONDateField",pas.DB.TDateField,function () {
    this.$init = function () {
      pas.DB.TDateField.$init.call(this);
      this.FDateFormat = "";
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("DateFormat",0,rtl.string,"FDateFormat","FDateFormat");
  });
  rtl.createClass(this,"TJSONTimeField",pas.DB.TTimeField,function () {
    this.$init = function () {
      pas.DB.TTimeField.$init.call(this);
      this.FTimeFormat = "";
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("TimeFormat",0,rtl.string,"FTimeFormat","FTimeFormat");
  });
  rtl.createClass(this,"TJSONDateTimeField",pas.DB.TDateTimeField,function () {
    this.$init = function () {
      pas.DB.TDateTimeField.$init.call(this);
      this.FDateTimeFormat = "";
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("DateTimeFormat",0,rtl.string,"FDateTimeFormat","FDateTimeFormat");
  });
  rtl.createClass(this,"TFieldComparer",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FDesc = false;
      this.FValue = undefined;
      this.FField = null;
      this.FOptions = {};
      this.FDataset = null;
    };
    this.$final = function () {
      this.FField = undefined;
      this.FOptions = undefined;
      this.FDataset = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (aDataset, aField, aValue, aOptions) {
      this.FField = aField;
      this.FValue = aValue;
      this.FOptions = rtl.refSet(aOptions);
      this.FDataset = aDataset;
      return this;
    };
    this.GetFieldValue = function (RowIndex) {
      var Result = undefined;
      Result = this.FDataset.FFieldMapper.GetJSONDataForField$1(this.FField,this.FDataset.FRows[RowIndex]);
      return Result;
    };
    this.CompareRows = function (RowIndex1, RowIndex2) {
      var Result = 0;
      Result = this.Compare(RowIndex1,this.GetFieldValue(RowIndex2));
      return Result;
    };
    this.Compare$1 = function (RowIndex) {
      var Result = 0;
      Result = this.Compare(RowIndex,this.FValue);
      return Result;
    };
  });
  this.$rtti.$ClassRef("TFieldComparerClass",{instancetype: this.$rtti["TFieldComparer"]});
  rtl.createClass(this,"TStringFieldComparer",this.TFieldComparer,function () {
    this.Compare = function (RowIndex, aValue) {
      var Result = 0;
      var S1 = "";
      var S2 = "";
      S1 = "" + this.GetFieldValue(RowIndex);
      S2 = "" + aValue;
      if (pas.DB.TLocateOption.loPartialKey in this.FOptions) S1 = pas.System.Copy(S1,1,S2.length);
      if (pas.DB.TLocateOption.loCaseInsensitive in this.FOptions) {
        Result = pas.SysUtils.CompareText(S1,S2)}
       else Result = pas.SysUtils.CompareStr(S1,S2);
      return Result;
    };
  });
  rtl.createClass(this,"TNativeIntFieldComparer",this.TFieldComparer,function () {
    this.Compare = function (RowIndex, aValue) {
      var Result = 0;
      var I1 = 0;
      var I2 = 0;
      I1 = rtl.trunc(this.GetFieldValue(RowIndex));
      I2 = rtl.trunc(aValue);
      Result = I1 - I2;
      return Result;
    };
  });
  rtl.createClass(this,"TBooleanFieldComparer",this.TFieldComparer,function () {
    this.Compare = function (RowIndex, aValue) {
      var Result = 0;
      var B1 = false;
      var B2 = false;
      B1 = !(this.GetFieldValue(RowIndex) == false);
      B2 = !(aValue == false);
      Result = (B1 + 0) - (B2 + 0);
      return Result;
    };
  });
  rtl.createClass(this,"TDateTimeFieldComparer",this.TFieldComparer,function () {
    this.Compare = function (RowIndex, aValue) {
      var $Self = this;
      var Result = 0;
      var D1 = 0.0;
      var D2 = 0.0;
      function ToDate(v) {
        var Result = 0.0;
        if (pas.JS.isDate(v)) {
          Result = pas.SysUtils.JSDateToDateTime(v)}
         else Result = $Self.FDataset.ConvertDateTimeField("" + v,$Self.FField);
        return Result;
      };
      D1 = ToDate(this.GetFieldValue(RowIndex));
      D2 = ToDate(aValue);
      Result = Math.round(D1 - D2);
      return Result;
    };
  });
  rtl.createClass(this,"TFloatFieldComparer",this.TFieldComparer,function () {
    this.Compare = function (RowIndex, aValue) {
      var Result = 0;
      var D1 = 0.0;
      var D2 = 0.0;
      D1 = rtl.getNumber(this.GetFieldValue(RowIndex));
      D2 = rtl.getNumber(aValue);
      Result = Math.round(D1 - D2);
      return Result;
    };
  });
  rtl.createClass(this,"TRecordComparer",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FDataset = null;
      this.FIndexBased = false;
      this.FItems = [];
      this.FOptions = {};
      this.FValues = [];
    };
    this.$final = function () {
      this.FDataset = undefined;
      this.FItems = undefined;
      this.FOptions = undefined;
      this.FValues = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.GetFieldComparer = function (Index) {
      var Result = null;
      if ((Index < 0) || (Index >= rtl.length(this.FItems))) throw pas.Classes.EListError.$create("CreateFmt",["Index out of bounds: %d not in [%d,%d]",pas.System.VarRecs(0,Index,0,0,19,rtl.length(this.FItems) - 1)]);
      Result = this.GetFieldComparer(Index);
      return Result;
    };
    this.ConstructItems = function (aFields) {
      var L = null;
      var FCC = null;
      var F = null;
      var I = 0;
      L = pas.Classes.TFPList.$create("Create");
      try {
        this.FDataset.GetFieldList$1(L,aFields);
        if (!this.FIndexBased && (L.FCount !== rtl.length(this.FValues))) throw pas.DB.EDatabaseError.$create("CreateFmt",["Array of values has different length (%d) from array of fields (%d)",pas.System.VarRecs(19,rtl.length(this.FValues),0,L.FCount)]);
        this.FItems = rtl.arraySetLength(this.FItems,null,L.FCount);
        for (var $l = 0, $end = L.FCount - 1; $l <= $end; $l++) {
          I = $l;
          F = rtl.getObject(L.Get(I));
          FCC = this.DataTypeToComparerClass(F.FDataType);
          if (FCC === null) throw pas.DB.EDatabaseError.$create("CreateFmt",["Cannot locate on field %s of type %s)",pas.System.VarRecs(18,F.FFieldName,18,pas.TypInfo.GetEnumName(pas.DB.$rtti["TFieldType"],F.FDataType))]);
          if (this.FIndexBased) {
            this.FItems[I] = FCC.$create("Create$1",[this.FDataset,F,null,rtl.refSet(this.FOptions)])}
           else this.FItems[I] = FCC.$create("Create$1",[this.FDataset,F,this.FValues[I],rtl.refSet(this.FOptions)]);
        };
      } finally {
        L = rtl.freeLoc(L);
      };
    };
    this.DataTypeToComparerClass = function (aFieldType) {
      var Result = null;
      var $tmp = aFieldType;
      if (($tmp === pas.DB.TFieldType.ftMemo) || ($tmp === pas.DB.TFieldType.ftFixedChar) || ($tmp === pas.DB.TFieldType.ftString)) {
        Result = $mod.TStringFieldComparer}
       else if (($tmp === pas.DB.TFieldType.ftAutoInc) || ($tmp === pas.DB.TFieldType.ftInteger) || ($tmp === pas.DB.TFieldType.ftLargeInt)) {
        Result = $mod.TNativeIntFieldComparer}
       else if ($tmp === pas.DB.TFieldType.ftBoolean) {
        Result = $mod.TBooleanFieldComparer}
       else if ($tmp === pas.DB.TFieldType.ftFloat) {
        Result = $mod.TFloatFieldComparer}
       else if (($tmp === pas.DB.TFieldType.ftDate) || ($tmp === pas.DB.TFieldType.ftTime) || ($tmp === pas.DB.TFieldType.ftDateTime)) {
        Result = $mod.TDateTimeFieldComparer}
       else {
        Result = null;
      };
      return Result;
    };
    this.Compare = function (aRowindex) {
      var Result = 0;
      var I = 0;
      var L = 0;
      Result = 0;
      I = 0;
      L = rtl.length(this.FItems);
      while ((Result === 0) && (I < L)) {
        Result = this.FItems[I].Compare$1(aRowindex);
        I += 1;
      };
      return Result;
    };
    this.CompareRows = function (aRowindex1, aRowIndex2) {
      var Result = 0;
      var I = 0;
      var L = 0;
      Result = 0;
      I = 0;
      L = rtl.length(this.FItems);
      while ((Result === 0) && (I < L)) {
        Result = this.FItems[I].CompareRows(aRowindex1,aRowIndex2);
        if ((Result !== 0) && this.FItems[I].FDesc) Result = -Result;
        I += 1;
      };
      return Result;
    };
    this.updateFromIndex = function (aIndex) {
      var L = null;
      var I = 0;
      L = pas.Classes.TFPList.$create("Create");
      try {
        if (aIndex.FCaseinsFields !== "") {
          this.FDataset.GetFieldList$1(L,aIndex.FCaseinsFields);
          for (var $l = 0, $end = rtl.length(this.FItems) - 1; $l <= $end; $l++) {
            I = $l;
            if (L.IndexOf(this.FItems[I].FField) !== -1) this.FItems[I].FOptions = rtl.unionSet(this.FItems[I].FOptions,rtl.createSet(pas.DB.TLocateOption.loCaseInsensitive));
          };
        };
        L.Clear();
        this.FDataset.GetFieldList$1(L,aIndex.FDescFields);
        for (var $l1 = 0, $end1 = rtl.length(this.FItems) - 1; $l1 <= $end1; $l1++) {
          I = $l1;
          this.FItems[I].FDesc = (pas.DB.TIndexOption.ixDescending in aIndex.FOptions) || (L.IndexOf(this.FItems[I].FField) !== -1);
        };
      } finally {
        L = rtl.freeLoc(L);
      };
    };
    this.Create$1 = function (aDataset, aFields, aValues, aOptions) {
      this.FDataset = aDataset;
      if (rtl.isArray(aValues)) {
        this.FValues = aValues}
       else {
        this.FValues = rtl.arraySetLength(this.FValues,undefined,1);
        this.FValues[0] = aValues;
      };
      this.FOptions = rtl.refSet(aOptions);
      this.ConstructItems(aFields);
      return this;
    };
    this.Create$2 = function (aDataset, aIndex) {
      this.FDataset = aDataset;
      this.FIndexBased = true;
      if (pas.DB.TIndexOption.ixCaseInsensitive in aIndex.FOptions) this.FOptions = rtl.createSet(pas.DB.TLocateOption.loCaseInsensitive);
      this.ConstructItems(aIndex.FFields);
      this.updateFromIndex(aIndex);
      return this;
    };
    this.Destroy = function () {
      var I = 0;
      for (var $l = 0, $end = rtl.length(this.FItems) - 1; $l <= $end; $l++) {
        I = $l;
        rtl.free(this.FItems,I);
      };
      pas.System.TObject.Destroy.call(this);
    };
    var $r = this.$rtti;
    $mod.$rtti.$DynArray("TRecordComparer.FItems$a",{eltype: $mod.$rtti["TFieldComparer"]});
  });
  this.$rtti.$ClassRef("TRecordComparerClass",{instancetype: this.$rtti["TRecordComparer"]});
  rtl.createClass(this,"TJSONIndex",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FList = null;
      this.FRows = null;
      this.FDataset = null;
    };
    this.$final = function () {
      this.FList = undefined;
      this.FRows = undefined;
      this.FDataset = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.GetRecordIndex = function (aListIndex) {
      var Result = 0;
      if (pas.JS.isUndefined(this.FList[aListIndex])) {
        Result = -1}
       else Result = rtl.trunc(this.FList[aListIndex]);
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FList.length;
      return Result;
    };
    this.ClearIndex = function () {
      this.FList.length = 0;
    };
    this.Create$1 = function (aDataset, aRows) {
      this.FRows = aRows;
      this.FList = new Array(this.FRows.length);
      this.FDataset = aDataset;
      this.CreateIndex();
      return this;
    };
    this.Delete = function (aListIndex) {
      var Result = 0;
      var a = null;
      a = this.FList.splice(aListIndex,1);
      if (a.length > 0) {
        Result = rtl.trunc(a[0])}
       else Result = -1;
      return Result;
    };
    this.DeleteByRowIndex = function (aRowIndex) {
      var Result = 0;
      Result = this.IndexOfRow(aRowIndex);
      if (Result !== -1) this.FList.splice(Result,1);
      return Result;
    };
    this.Insert = function (aCurrentIndex, aRecordIndex) {
      var Result = 0;
      Result = this.Append(aRecordIndex);
      return Result;
    };
    this.IndexOfRow = function (aRowIndex) {
      var Result = 0;
      Result = this.FList.indexOf(aRowIndex);
      return Result;
    };
  });
  rtl.createClass(this,"TDefaultJSONIndex",this.TJSONIndex,function () {
    this.CreateIndex = function () {
      var I = 0;
      for (var $l = 0, $end = this.FRows.length - 1; $l <= $end; $l++) {
        I = $l;
        this.FList[I] = I;
      };
    };
    this.AppendToIndex = function () {
      var I = 0;
      var L = 0;
      L = this.FList.length;
      this.FList.length = this.FRows.length;
      for (var $l = L, $end = this.FRows.length - 1; $l <= $end; $l++) {
        I = $l;
        this.FList[I] = I;
      };
    };
    this.Append = function (aRecordIndex) {
      var Result = 0;
      Result = this.FList.push(aRecordIndex) - 1;
      return Result;
    };
    this.Insert = function (aCurrentIndex, aRecordIndex) {
      var Result = 0;
      this.FList.splice(aCurrentIndex,0,aRecordIndex);
      Result = aCurrentIndex;
      return Result;
    };
    this.FindRecord = function (aRecordIndex) {
      var Result = 0;
      Result = this.FList.indexOf(aRecordIndex);
      return Result;
    };
    this.Update = function (aRecordIndex) {
      var Result = 0;
      Result = aRecordIndex;
      return Result;
    };
  });
  rtl.createClass(this,"TSortedJSONIndex",this.TJSONIndex,function () {
    this.$init = function () {
      $mod.TJSONIndex.$init.call(this);
      this.FComparer = null;
      this.FUnique = false;
    };
    this.$final = function () {
      this.FComparer = undefined;
      $mod.TJSONIndex.$final.call(this);
    };
    this.FindPos = function (aRecordIndex) {
      var Result = 0;
      var L = 0;
      var R = 0;
      var I = 0;
      var CompareRes = 0;
      if (!(this.FComparer != null)) return Result;
      L = 0;
      R = this.GetCount() - 1;
      while (L <= R) {
        I = L + rtl.trunc((R - L) / 2);
        CompareRes = this.FComparer.CompareRows(aRecordIndex,rtl.trunc(this.FList[I]));
        if (CompareRes > 0) {
          L = I + 1}
         else {
          R = I - 1;
          if (CompareRes === 0) {
            if (this.FUnique) L = I;
          };
        };
      };
      Result = L;
      return Result;
    };
    this.MergeSort = function (aList) {
      var Result = null;
      var temp = null;
      var l = 0;
      var p = 0;
      var q = 0;
      var e = 0;
      var tail = 0;
      var insize = 0;
      var nmerges = 0;
      var psize = 0;
      var qsize = 0;
      if (aList === null) return null;
      l = aList.length;
      Result = new Array(l);
      if (l === 0) return Result;
      insize = 1;
      do {
        p = 0;
        tail = 0;
        nmerges = 0;
        while (p < l) {
          nmerges += 1;
          psize = l - p;
          if (insize < psize) psize = insize;
          q = p + psize;
          qsize = insize;
          while ((psize > 0) || ((qsize > 0) && (q < l))) {
            if (psize === 0) {
              e = q;
              q += 1;
              qsize -= 1;
            } else if ((qsize === 0) || (q >= l)) {
              e = p;
              p += 1;
              psize -= 1;
            } else if (this.FComparer.CompareRows(rtl.trunc(aList[p]),rtl.trunc(aList[q])) <= 0) {
              e = p;
              p += 1;
              psize -= 1;
            } else {
              e = q;
              q += 1;
              qsize -= 1;
            };
            Result[tail] = aList[e];
            tail += 1;
          };
          p = q;
        };
        if (nmerges <= 1) return Result;
        insize = insize * 2;
        temp = Result;
        Result = aList;
        aList = temp;
      } while (!false);
      return Result;
    };
    this.Destroy = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FComparer;
        }, set: function (v) {
          this.p.FComparer = v;
        }});
      pas.System.TObject.Destroy.call(this);
    };
    this.CreateComparer = function (aIndex) {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FComparer;
        }, set: function (v) {
          this.p.FComparer = v;
        }});
      this.FComparer = $mod.TRecordComparer.$create("Create$2",[this.FDataset,aIndex]);
    };
    this.CreateIndex = function () {
      var Lst = [];
      var I = 0;
      var SrcLen = 0;
      var Destlen = 0;
      if (this.FComparer === null) return;
      SrcLen = this.FRows.length;
      Lst = rtl.arraySetLength(Lst,0,SrcLen);
      Destlen = 0;
      for (var $l = 0, $end = SrcLen - 1; $l <= $end; $l++) {
        I = $l;
        if (!pas.JS.isUndefined(this.FRows[I])) {
          Lst[Destlen] = I;
          Destlen += 1;
        };
      };
      Lst = rtl.arraySetLength(Lst,0,Destlen);
      this.FList = this.MergeSort(Lst);
    };
    this.AppendToIndex = function () {
      this.CreateIndex();
    };
    this.Append = function (aRecordIndex) {
      var Result = 0;
      Result = this.FindPos(aRecordIndex);
      this.FList.splice(Result,0,aRecordIndex);
      return Result;
    };
    this.FindRecord = function (aRecordIndex) {
      var Result = 0;
      Result = this.FList.indexOf(aRecordIndex);
      return Result;
    };
    this.Update = function (aRecordIndex) {
      var Result = 0;
      var aCurrentIndex = 0;
      aCurrentIndex = this.FindRecord(aRecordIndex);
      Result = this.FindPos(aRecordIndex);
      if (Result !== aCurrentIndex) this.FList.splice(Result,0,this.FList.splice(aCurrentIndex,1)[0]);
      return Result;
    };
  });
  rtl.createClass(this,"TJSONIndexDef",pas.DB.TIndexDef,function () {
    this.$init = function () {
      pas.DB.TIndexDef.$init.call(this);
      this.FIndex = null;
    };
    this.$final = function () {
      this.FIndex = undefined;
      pas.DB.TIndexDef.$final.call(this);
    };
    this.ClearIndex = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FIndex;
        }, set: function (v) {
          this.p.FIndex = v;
        }});
    };
    this.BuildIndex = function (aDataset) {
      if (this.FIndex === null) {
        this.FIndex = $mod.TSortedJSONIndex.$create("Create$1",[aDataset,aDataset.FRows])}
       else this.FIndex.ClearIndex();
      this.FIndex.CreateComparer(this);
      this.FIndex.CreateIndex();
    };
  });
  rtl.createClass(this,"TJSONIndexDefs",pas.DB.TIndexDefs,function () {
    this.GetD = function (aIndex) {
      var Result = null;
      Result = rtl.as(this.GetItem$1(aIndex),$mod.TJSONIndexDef);
      return Result;
    };
    this.SetD = function (aIndex, AValue) {
      this.SetItem$1(aIndex,AValue);
    };
    this.AddJSONIndexDef = function () {
      var Result = null;
      Result = rtl.as(this.Add(),$mod.TJSONIndexDef);
      return Result;
    };
  });
  this.TBlobFormat = {"0": "bfHex", bfHex: 0, "1": "bfBase64", bfBase64: 1, "2": "bfBytes", bfBytes: 2, "3": "bfCustom", bfCustom: 3};
  this.$rtti.$Enum("TBlobFormat",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TBlobFormat});
  this.$rtti.$Set("TBlobFormats",{comptype: this.$rtti["TBlobFormat"]});
  this.$rtti.$MethodVar("TOnDecodeBlobBytesEvent",{procsig: rtl.newTIProcSig([["Sender",pas.DB.$rtti["TDataSet"]],["aValue",rtl.jsvalue],["aData",pas.SysUtils.$rtti["TBytes"],1]]), methodkind: 0});
  this.$rtti.$MethodVar("TOnEncodeBlobBytesEvent",{procsig: rtl.newTIProcSig([["Sender",pas.DB.$rtti["TDataSet"]],["aData",pas.SysUtils.$rtti["TBytes"]],["aValue",rtl.jsvalue,1]]), methodkind: 0});
  rtl.createClass(this,"TBaseJSONDataSet",pas.DB.TDataSet,function () {
    this.$init = function () {
      pas.DB.TDataSet.$init.call(this);
      this.FActiveIndex = "";
      this.FBlobFormat = 0;
      this.FIndexes = null;
      this.FMUS = false;
      this.FOnDecodeBlobValue = null;
      this.FOnEncodeBlobValue = null;
      this.FOwnsData = false;
      this.FDefaultIndex = null;
      this.FCurrentIndex = null;
      this.FCurrent = 0;
      this.FMetaData = null;
      this.FRows = null;
      this.FDeletedRows = null;
      this.FFieldMapper = null;
      this.FEditIdx = 0;
      this.FEditRow = undefined;
      this.FFilterRow = undefined;
      this.FUseDateTimeFormatFields = false;
      this.FRowType = 0;
      this.FFilterExpression = null;
    };
    this.$final = function () {
      this.FIndexes = undefined;
      this.FOnDecodeBlobValue = undefined;
      this.FOnEncodeBlobValue = undefined;
      this.FDefaultIndex = undefined;
      this.FCurrentIndex = undefined;
      this.FMetaData = undefined;
      this.FRows = undefined;
      this.FDeletedRows = undefined;
      this.FFieldMapper = undefined;
      this.FFilterExpression = undefined;
      pas.DB.TDataSet.$final.call(this);
    };
    this.GetFilterField = function (AName) {
      var Result = pas.fpexprpars.TFPExpressionResult.$new();
      var F = null;
      var C = 0;
      F = this.FieldByName(AName);
      Result.ResultType = this.FieldTypeToExpressionType(F.FDataType);
      var $tmp = Result.ResultType;
      if ($tmp === pas.fpexprpars.TResultType.rtBoolean) {
        Result.resValue = F.GetAsBoolean()}
       else if ($tmp === pas.fpexprpars.TResultType.rtInteger) {
        Result.resValue = F.GetAsLargeInt()}
       else if ($tmp === pas.fpexprpars.TResultType.rtFloat) {
        Result.resValue = F.GetAsFloat()}
       else if ($tmp === pas.fpexprpars.TResultType.rtDateTime) {
        Result.resValue = F.GetAsDateTime()}
       else if ($tmp === pas.fpexprpars.TResultType.rtString) {
        Result.resValue = F.GetAsString()}
       else if ($tmp === pas.fpexprpars.TResultType.rtCurrency) {
        C = F.GetAsFloat() * 10000;
        Result.resValue = C / 10000;
      };
      return Result;
    };
    this.SetActiveIndex = function (AValue) {
      if (this.FActiveIndex === AValue) return;
      this.FActiveIndex = AValue;
      if (pas.Classes.TComponentStateItem.csLoading in this.FComponentState) return;
      this.ActivateIndex(this.GetActive());
    };
    this.SetIndexes = function (AValue) {
      if (this.FIndexes === AValue) return;
      this.FIndexes.Assign(AValue);
      if (this.GetActive()) this.BuildIndexes();
    };
    this.SetMetaData = function (AValue) {
      this.CheckInactive();
      this.FMetaData = AValue;
    };
    this.SetRows = function (AValue) {
      if (AValue === this.FRows) return;
      this.CheckInactive();
      this.FRows = null;
      this.AddToRows(AValue);
    };
    this.SetRowType = function (AValue) {
      if (this.FRowType === AValue) return;
      this.CheckInactive();
      this.FRowType = AValue;
    };
    this.RemoveCalcFields = function (Buf) {
      var i = 0;
      for (var $l = 0, $end = this.FFieldList.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        if (this.FFieldList.GetField(i).FFieldKind in rtl.createSet(pas.DB.TFieldKind.fkCalculated,pas.DB.TFieldKind.fkInternalCalc,pas.DB.TFieldKind.fkLookup)) this.FFieldMapper.RemoveField(this.FFieldList.GetField(i).FFieldName,this.FFieldList.GetField(i).GetIndex(),Buf);
      };
    };
    this.ActivateIndex = function (Build) {
      var Idx = null;
      if (this.FActiveIndex !== "") {
        Idx = rtl.as(this.FIndexes.Find$1(this.FActiveIndex),$mod.TJSONIndexDef)}
       else Idx = null;
      if (Idx === null) {
        this.FCurrentIndex = this.FDefaultIndex}
       else {
        if ((Idx.FIndex === null) && Build) Idx.BuildIndex(this);
        this.FCurrentIndex = Idx.FIndex;
      };
      if (this.GetActive()) this.Resync(rtl.createSet(pas.DB.TResyncMode$a.rmCenter));
    };
    this.FieldTypeToExpressionType = function (aDataType) {
      var Result = 0;
      var $tmp = aDataType;
      if (($tmp === pas.DB.TFieldType.ftMemo) || ($tmp === pas.DB.TFieldType.ftFixedChar) || ($tmp === pas.DB.TFieldType.ftString)) {
        Result = pas.fpexprpars.TResultType.rtString}
       else if (($tmp === pas.DB.TFieldType.ftInteger) || ($tmp === pas.DB.TFieldType.ftAutoInc) || ($tmp === pas.DB.TFieldType.ftLargeInt)) {
        Result = pas.fpexprpars.TResultType.rtInteger}
       else if ($tmp === pas.DB.TFieldType.ftBoolean) {
        Result = pas.fpexprpars.TResultType.rtBoolean}
       else if ($tmp === pas.DB.TFieldType.ftFloat) {
        Result = pas.fpexprpars.TResultType.rtFloat}
       else if (($tmp === pas.DB.TFieldType.ftDate) || ($tmp === pas.DB.TFieldType.ftTime) || ($tmp === pas.DB.TFieldType.ftDateTime)) {
        Result = pas.fpexprpars.TResultType.rtDateTime}
       else {
        pas.DB.DatabaseErrorFmt$1("Fields of type %s are not supported in filter expressions.",pas.System.VarRecs(18,pas.DB.Fieldtypenames[aDataType]),this);
      };
      return Result;
    };
    this.GetFilterIsNull = function (Args) {
      var Result = pas.fpexprpars.TFPExpressionResult.$new();
      Result.ResultType = pas.fpexprpars.TResultType.rtBoolean;
      Result.resValue = this.FieldByName("" + Args[0].resValue).GetIsNull();
      return Result;
    };
    this.FilterExpressionClass = function () {
      var Result = null;
      Result = pas.fpexprpars.TFPExpressionParser;
      return Result;
    };
    this.CreateFilterExpression = function () {
      var Result = null;
      var I = 0;
      Result = this.FilterExpressionClass().$create("Create$1",[this]);
      Result.SetAllowLike(true);
      for (var $l = 0, $end = this.FFieldList.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        if (!(this.FFieldList.GetField(I).FDataType in rtl.createSet(pas.DB.TFieldType.ftBlob,pas.DB.TFieldType.ftMemo))) Result.FIdentifiers.AddVariable(this.FFieldList.GetField(I).FFieldName,this.FieldTypeToExpressionType(this.FFieldList.GetField(I).FDataType),rtl.createCallback(this,"GetFilterField"));
      };
      Result.FIdentifiers.AddFunction("IsNull","B","S",rtl.createCallback(this,"GetFilterIsNull"));
      Result.SetExpression(this.FFilterText);
      return Result;
    };
    this.DoFilterRecord = function () {
      var Result = false;
      var DS = 0;
      Result = true;
      DS = this.SetTempState(pas.DB.TDataSetState.dsFilter);
      try {
        if (this.FOnFilterRecord != null) {
          this.FOnFilterRecord(this,{get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }});
          if (!Result) return Result;
        };
        if (!this.FFiltered || (this.FFilterText === "")) return Result;
        if (this.FFilterExpression === null) this.FFilterExpression = this.CreateFilterExpression();
        Result = this.FFilterExpression.GetAsBoolean();
      } finally {
        this.RestoreState(DS);
      };
      return Result;
    };
    this.CreateIndexDefs = function () {
      var Result = null;
      Result = $mod.TJSONIndexDefs.$create("create$3",[this,this,$mod.TJSONIndexDef]);
      return Result;
    };
    this.RecordComparerClass = function () {
      var Result = null;
      Result = $mod.TRecordComparer;
      return Result;
    };
    this.LocateRecordIndex = function (KeyFields, KeyValues, Options) {
      var Result = 0;
      var Comp = null;
      var RI = 0;
      var I = 0;
      Result = -1;
      Comp = this.RecordComparerClass().$create("Create$1",[this,KeyFields,KeyValues,rtl.refSet(Options)]);
      try {
        if (pas.DB.TLocateOption.loFromCurrent in Options) {
          I = this.FCurrent}
         else I = 0;
        RI = this.FCurrentIndex.GetRecordIndex(I);
        while ((Result === -1) && (RI !== -1)) {
          if (Comp.Compare(RI) === 0) Result = RI;
          I += 1;
          RI = this.FCurrentIndex.GetRecordIndex(I);
        };
      } finally {
        Comp = rtl.freeLoc(Comp);
      };
      return Result;
    };
    this.AllocRecordBuffer = function () {
      var Result = pas.DB.TDataRecord.$new();
      Result.data = new Object();
      Result.bookmark = null;
      Result.state = pas.DB.TRecordState.rsNew;
      return Result;
    };
    this.FreeRecordBuffer = function (Buffer) {
      Buffer.data = null;
      Buffer.bookmark = null;
      Buffer.state = pas.DB.TRecordState.rsNew;
    };
    this.InternalInitRecord = function (Buffer) {
      Buffer.data = this.FFieldMapper.CreateRow();
      Buffer.bookmark = null;
      Buffer.state = pas.DB.TRecordState.rsNew;
    };
    this.GetRecord = function (Buffer, GetMode, DoCheck) {
      var Result = 0;
      var BkmIdx = 0;
      var recordAccepted = false;
      Result = pas.DB.TGetResult.grOK;
      do {
        recordAccepted = true;
        var $tmp = GetMode;
        if ($tmp === pas.DB.TGetMode.gmNext) {
          if (this.FCurrent < (this.FCurrentIndex.GetCount() - 1)) {
            this.FCurrent += 1}
           else Result = pas.DB.TGetResult.grEOF}
         else if ($tmp === pas.DB.TGetMode.gmPrior) {
          if (this.FCurrent > 0) {
            this.FCurrent -= 1}
           else Result = pas.DB.TGetResult.grBOF}
         else if ($tmp === pas.DB.TGetMode.gmCurrent) if ((this.FCurrent < 0) || (this.FCurrent >= this.FCurrentIndex.GetCount())) Result = pas.DB.TGetResult.grEOF;
        if (Result === pas.DB.TGetResult.grOK) {
          BkmIdx = this.FCurrentIndex.GetRecordIndex(this.FCurrent);
          Buffer.data = this.FRows[BkmIdx];
          Buffer.bookmarkFlag = pas.DB.TBookmarkFlag.bfCurrent;
          Buffer.bookmark = BkmIdx;
          this.GetCalcFields(Buffer);
          if (this.FFiltered) {
            this.FFilterRow = Buffer.data;
            recordAccepted = this.DoFilterRecord();
            if (!recordAccepted && (GetMode === pas.DB.TGetMode.gmCurrent)) {
              recordAccepted = true;
              Result = pas.DB.TGetResult.grEOF;
            };
          };
        };
      } while (!recordAccepted);
      return Result;
    };
    this.GetRecordSize = function () {
      var Result = 0;
      Result = 0;
      return Result;
    };
    this.AddToRows = function (AValue) {
      if (this.FRows === null) {
        this.FRows = AValue}
       else {
        this.FRows = this.FRows.concat(AValue);
        this.AppendToIndexes();
      };
    };
    this.InternalClose = function () {
      this.BindFields(false);
      if (this.FDefaultFields) this.DestroyFields();
      this.FreeData();
    };
    this.InternalDelete = function () {
      var I = 0;
      var RowIdx = 0;
      var aIndex = null;
      RowIdx = this.FCurrentIndex.Delete(this.FCurrent);
      if (RowIdx !== -1) {
        for (var $l = 0, $end = this.FIndexes.GetCount() - 1; $l <= $end; $l++) {
          I = $l;
          aIndex = this.FIndexes.GetD(I).FIndex;
          if (aIndex !== this.FCurrentIndex) aIndex.DeleteByRowIndex(RowIdx);
        };
        if (!(this.FDeletedRows != null)) {
          this.FDeletedRows = new Array(this.FRows[RowIdx])}
         else this.FDeletedRows.push(this.FRows[RowIdx]);
        this.FRows[RowIdx] = undefined;
      };
    };
    this.InternalFirst = function () {
      this.FCurrent = -1;
    };
    this.InternalLast = function () {
      this.FCurrent = this.FCurrentIndex.GetCount();
    };
    this.InternalOpen = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FFieldMapper;
        }, set: function (v) {
          this.p.FFieldMapper = v;
        }});
      this.FFieldMapper = this.CreateFieldMapper();
      if (this.FRows === null) {
        this.FRows = new Array();
        this.FOwnsData = true;
      };
      this.CreateIndexes();
      this.InternalInitFieldDefs();
      if (this.FDefaultFields) this.CreateFields();
      this.BindFields(true);
      this.InitDateTimeFields();
      if (this.FActiveIndex !== "") this.ActivateIndex(true);
      this.FCurrent = -1;
    };
    this.InternalPost = function () {
      var I = 0;
      var NewIdx = 0;
      var NewCurrent = 0;
      var Idx = 0;
      var B = pas.DB.TBookmark.$new();
      NewCurrent = -1;
      this.GetBookmarkData(pas.DB.TDataRecord.$clone(this.ActiveBuffer()),B);
      if (this.FState === pas.DB.TDataSetState.dsInsert) {
        Idx = this.FRows.push(this.FEditRow) - 1;
        if (this.GetBookmarkFlag(pas.DB.TDataRecord.$clone(this.ActiveBuffer())) === pas.DB.TBookmarkFlag.bfEOF) {
          this.FDefaultIndex.Append(Idx);
          for (var $l = 0, $end = this.FIndexes.GetCount() - 1; $l <= $end; $l++) {
            I = $l;
            if (this.FIndexes.GetD(I).FIndex != null) {
              NewIdx = this.FIndexes.GetD(I).FIndex.Append(Idx);
              if (this.FIndexes.GetD(I).FIndex === this.FCurrentIndex) NewCurrent = NewIdx;
            };
          };
        } else {
          this.FCurrent = this.FDefaultIndex.Insert(this.FCurrent,Idx);
          for (var $l1 = 0, $end1 = this.FIndexes.GetCount() - 1; $l1 <= $end1; $l1++) {
            I = $l1;
            if (this.FIndexes.GetD(I).FIndex != null) {
              NewIdx = this.FIndexes.GetD(I).FIndex.Append(Idx);
              if (this.FIndexes.GetD(I).FIndex === this.FCurrentIndex) NewCurrent = NewIdx;
            };
          };
        };
      } else {
        if (this.FEditIdx === -1) pas.DB.DatabaseErrorFmt("Failed to retrieve record index for record %d",pas.System.VarRecs(0,this.FCurrent));
        Idx = this.FEditIdx;
        this.FRows[Idx] = this.FEditRow;
        this.FDefaultIndex.Update(Idx);
        for (var $l2 = 0, $end2 = this.FIndexes.GetCount() - 1; $l2 <= $end2; $l2++) {
          I = $l2;
          NewIdx = this.FCurrentIndex.Update(Idx);
          if (this.FIndexes.GetD(I).FIndex != null) if (this.FIndexes.GetD(I).FIndex === this.FCurrentIndex) NewCurrent = NewIdx;
        };
      };
      if (NewCurrent !== -1) this.FCurrent = NewCurrent;
      this.FEditIdx = -1;
      this.FEditRow = null;
    };
    this.InternalInsert = function () {
      var I = 0;
      var D = null;
      this.FEditRow = this.ActiveBuffer().data;
      for (var $l = 0, $end = this.FFieldDefs.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        D = this.FFieldDefs.GetItem$1(I);
        this.FFieldMapper.SetJSONDataForField(D.FName,D.GetIndex(),this.FEditRow,null);
      };
    };
    this.InternalEdit = function () {
      this.FEditIdx = this.FCurrentIndex.GetRecordIndex(this.FCurrent);
      if (!pas.JS.isUndefined(this.FRows[this.FEditIdx])) {
        this.FEditRow = this.FFieldMapper.CopyRow(this.FRows[this.FEditIdx]);
      } else this.FEditRow = this.FFieldMapper.CreateRow();
    };
    this.InternalCancel = function () {
      this.FEditIdx = -1;
      this.FEditRow = null;
    };
    this.InternalInitFieldDefs = function () {
      if (this.FMetaData != null) this.MetaDataToFieldDefs();
      if (this.FFieldDefs.GetCount() === 0) throw $mod.EJSONDataset.$create("Create$1",["No fields found"]);
    };
    this.InternalSetToRecord = function (Buffer) {
      this.FCurrent = this.FCurrentIndex.FindRecord(rtl.trunc(Buffer.bookmark));
    };
    this.SetFilterText = function (Value) {
      pas.DB.TDataSet.SetFilterText.call(this,Value);
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FFilterExpression;
        }, set: function (v) {
          this.p.FFilterExpression = v;
        }});
      if (this.GetActive()) this.Resync(rtl.createSet(pas.DB.TResyncMode$a.rmCenter));
    };
    this.SetFiltered = function (Value) {
      pas.DB.TDataSet.SetFiltered.call(this,Value);
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FFilterExpression;
        }, set: function (v) {
          this.p.FFilterExpression = v;
        }});
      if (this.GetActive()) this.Resync(rtl.createSet(pas.DB.TResyncMode$a.rmCenter));
    };
    this.GetFieldClass = function (FieldType) {
      var Result = null;
      if (this.FUseDateTimeFormatFields && (FieldType in rtl.createSet(pas.DB.TFieldType.ftDate,pas.DB.TFieldType.ftDateTime,pas.DB.TFieldType.ftTime))) {
        var $tmp = FieldType;
        if ($tmp === pas.DB.TFieldType.ftDate) {
          Result = $mod.TJSONDateField}
         else if ($tmp === pas.DB.TFieldType.ftDateTime) {
          Result = $mod.TJSONDateTimeField}
         else if ($tmp === pas.DB.TFieldType.ftTime) Result = $mod.TJSONTimeField;
      } else Result = pas.DB.TDataSet.GetFieldClass.call(this,FieldType);
      return Result;
    };
    this.GetApplyUpdateData = function (Buffer) {
      var Result = undefined;
      Result = this.FFieldMapper.CopyRow(Buffer.data);
      this.RemoveCalcFields(Result);
      return Result;
    };
    this.IsCursorOpen = function () {
      var Result = false;
      Result = this.FDefaultIndex != null;
      return Result;
    };
    this.GetBookmarkData = function (Buffer, Data) {
      Data.Data = Buffer.bookmark;
    };
    this.GetBookmarkFlag = function (Buffer) {
      var Result = 0;
      Result = Buffer.bookmarkFlag;
      return Result;
    };
    this.InternalGotoBookmark = function (ABookmark) {
      if (rtl.isNumber(ABookmark.Data)) this.FCurrent = this.FCurrentIndex.FindRecord(rtl.trunc(ABookmark.Data));
    };
    this.SetBookmarkFlag = function (Buffer, Value) {
      Buffer.bookmarkFlag = Value;
    };
    this.SetBookmarkData = function (Buffer, Data) {
      Buffer.bookmark = Data.Data;
    };
    this.GetRecordCount = function () {
      var Result = 0;
      if (this.FCurrentIndex != null) {
        Result = this.FCurrentIndex.GetCount()}
       else Result = 0;
      return Result;
    };
    this.SetRecNo = function (Value) {
      this.CheckBrowseMode();
      this.DoBeforeScroll();
      if ((Value < 1) || (Value > this.FCurrentIndex.GetCount())) throw $mod.EJSONDataset.$create("CreateFmt",["%s: SetRecNo: index %d out of range",pas.System.VarRecs(18,this.FName,0,Value)]);
      this.FCurrent = Value - 1;
      this.Resync({});
      this.DoAfterScroll();
    };
    this.GetRecNo = function () {
      var Result = 0;
      var bkmIdx = 0;
      bkmIdx = rtl.trunc(this.ActiveBuffer().bookmark);
      Result = this.FCurrentIndex.FindRecord(bkmIdx) + 1;
      return Result;
    };
    this.BuildIndexes = function () {
      var I = 0;
      for (var $l = 0, $end = this.FIndexes.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        this.FIndexes.GetD(I).BuildIndex(this);
      };
    };
    this.FreeData = function () {
      var I = 0;
      if (this.FOwnsData) {
        this.FRows = null;
        this.FMetaData = null;
      };
      for (var $l = 0, $end = this.FIndexes.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        this.FIndexes.GetD(I).ClearIndex();
      };
      this.FCurrentIndex = null;
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FDefaultIndex;
        }, set: function (v) {
          this.p.FDefaultIndex = v;
        }});
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FFieldMapper;
        }, set: function (v) {
          this.p.FFieldMapper = v;
        }});
      this.FCurrentIndex = null;
      this.FDeletedRows = null;
    };
    this.AppendToIndexes = function () {
      this.FDefaultIndex.AppendToIndex();
      if ((this.FCurrentIndex != null) && (this.FCurrentIndex !== this.FDefaultIndex)) this.FCurrentIndex.AppendToIndex();
    };
    this.CreateIndexes = function () {
      this.FDefaultIndex = $mod.TDefaultJSONIndex.$create("Create$1",[this,this.FRows]);
      this.AppendToIndexes();
      if (this.FCurrentIndex === null) this.FCurrentIndex = this.FDefaultIndex;
    };
    this.InitDateTimeFields = function () {
    };
    this.ConvertDateTimeField = function (S, F) {
      var Result = 0.0;
      var Ptrn = "";
      Result = 0;
      Ptrn = "";
      var $tmp = F.FDataType;
      if ($tmp === pas.DB.TFieldType.ftDate) {
        if ($mod.TJSONDateField.isPrototypeOf(F)) Ptrn = rtl.as(F,$mod.TJSONDateField).FDateFormat}
       else if ($tmp === pas.DB.TFieldType.ftTime) {
        if ($mod.TJSONTimeField.isPrototypeOf(F)) Ptrn = rtl.as(F,$mod.TJSONTimeField).FTimeFormat}
       else if ($tmp === pas.DB.TFieldType.ftDateTime) if ($mod.TJSONDateTimeField.isPrototypeOf(F)) Ptrn = rtl.as(F,$mod.TJSONDateTimeField).FDateTimeFormat;
      if (Ptrn === "") {
        Result = this.$class.DefaultConvertToDateTime(F,S,true)}
       else Result = pas.DateUtils.ScanDateTime(Ptrn,S,1);
      return Result;
    };
    this.FormatDateTimeField = function (DT, F) {
      var Result = "";
      var Ptrn = "";
      Result = "";
      Ptrn = "";
      var $tmp = F.FDataType;
      if ($tmp === pas.DB.TFieldType.ftDate) {
        if ($mod.TJSONDateField.isPrototypeOf(F)) Ptrn = F.FDateFormat}
       else if ($tmp === pas.DB.TFieldType.ftTime) {
        if ($mod.TJSONTimeField.isPrototypeOf(F)) Ptrn = F.FTimeFormat}
       else if ($tmp === pas.DB.TFieldType.ftDateTime) if ($mod.TJSONDateTimeField.isPrototypeOf(F)) Ptrn = F.FDateTimeFormat;
      if (Ptrn === "") {
        Result = pas.DateUtils.DateTimeToRFC3339(DT)}
       else Result = pas.SysUtils.FormatDateTime(Ptrn,DT);
      return Result;
    };
    this.CreateFieldMapper = function () {
      var Result = null;
      if (this.FRowType === $mod.TJSONRowType.rtJSONArray) {
        Result = $mod.TJSONArrayFieldMapper.$create("Create")}
       else Result = $mod.TJSONObjectFieldMapper.$create("Create");
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.DB.TDataSet.Create$1.apply(this,arguments);
      this.FOwnsData = true;
      this.FUseDateTimeFormatFields = false;
      this.FEditIdx = -1;
      this.FIndexes = this.CreateIndexDefs();
      return this;
    };
    this.Destroy = function () {
      this.Close();
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FFilterExpression;
        }, set: function (v) {
          this.p.FFilterExpression = v;
        }});
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FIndexes;
        }, set: function (v) {
          this.p.FIndexes = v;
        }});
      this.FEditIdx = -1;
      pas.DB.TDataSet.Destroy.call(this);
    };
    this.BlobDataToBytes = function (aValue) {
      var Result = [];
      Result = [];
      var $tmp = this.FBlobFormat;
      if ($tmp === $mod.TBlobFormat.bfHex) {
        Result = this.$class.DefaultBlobDataToBytes(aValue)}
       else if ($tmp === $mod.TBlobFormat.bfBase64) {
        Result = pas.SysUtils.BytesOf(atob("" + aValue))}
       else if ($tmp === $mod.TBlobFormat.bfBytes) {
        Result = aValue}
       else if ($tmp === $mod.TBlobFormat.bfCustom) if (this.FOnDecodeBlobValue != null) this.FOnDecodeBlobValue(this,aValue,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.BytesToBlobData = function (aValue) {
      var Result = undefined;
      Result = "";
      var $tmp = this.FBlobFormat;
      if ($tmp === $mod.TBlobFormat.bfHex) {
        Result = this.$class.DefaultBytesToBlobData(rtl.arrayRef(aValue))}
       else if ($tmp === $mod.TBlobFormat.bfBase64) {
        Result = btoa(pas.SysUtils.StringOf(aValue));
      } else if ($tmp === $mod.TBlobFormat.bfBytes) {
        Result = aValue}
       else if ($tmp === $mod.TBlobFormat.bfCustom) if (this.FOnEncodeBlobValue != null) this.FOnEncodeBlobValue(this,rtl.arrayRef(aValue),{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ConvertDateTimeToNative = function (aField, aValue) {
      var Result = undefined;
      if (isNaN(aValue)) {
        Result = null}
       else Result = this.FormatDateTimeField(aValue,aField);
      return Result;
    };
    this.Locate = function (KeyFields, KeyValues, Options) {
      var Result = false;
      var I = 0;
      var BM = pas.DB.TBookmark.$new();
      Result = pas.DB.TDataSet.Locate.apply(this,arguments);
      I = this.LocateRecordIndex(KeyFields,KeyValues,rtl.refSet(Options));
      Result = I !== -1;
      if (Result) {
        BM.Data = I;
        BM.Flag = pas.DB.TBookmarkFlag.bfCurrent;
        this.GotoBookmark(BM);
      };
      return Result;
    };
    this.Lookup = function (KeyFields, KeyValues, ResultFields) {
      var Result = undefined;
      var RI = 0;
      var I = 0;
      var l = null;
      var Vals = [];
      Result = null;
      l = pas.Classes.TFPList.$create("Create");
      try {
        this.GetFieldList$1(l,ResultFields);
        Result = pas.DB.TDataSet.Lookup.call(this,KeyFields,KeyValues,ResultFields);
        RI = this.LocateRecordIndex(KeyFields,KeyValues,{});
        if (RI !== -1) {
          Vals = rtl.arraySetLength(Vals,undefined,l.FCount);
          for (var $l = 0, $end = l.FCount - 1; $l <= $end; $l++) {
            I = $l;
            Vals[I] = this.FFieldMapper.GetJSONDataForField$1(rtl.getObject(l.Get(I)),this.FRows[RI]);
          };
          if (l.FCount === 1) {
            Result = Vals[I]}
           else Result = Vals;
        };
      } finally {
        l = rtl.freeLoc(l);
      };
      return Result;
    };
    this.GetFieldData$1 = function (Field, Buffer) {
      var Result = undefined;
      var R = undefined;
      if (this.FState in rtl.createSet(pas.DB.TDataSetState.dsCalcFields,pas.DB.TDataSetState.dsInternalCalc)) {
        R = this.FCalcBuffer.data}
       else if (this.FState === pas.DB.TDataSetState.dsFilter) {
        R = this.FFilterRow}
       else if (this.FEditIdx == Buffer.bookmark) {
        if (this.FState === pas.DB.TDataSetState.dsOldValue) {
          R = Buffer.data}
         else R = this.FEditRow;
      } else {
        if (this.FState === pas.DB.TDataSetState.dsOldValue) {
          return null}
         else R = Buffer.data;
      };
      Result = this.FFieldMapper.GetJSONDataForField$1(Field,R);
      if (pas.JS.isUndefined(Result)) Result = null;
      return Result;
    };
    this.SetFieldData$1 = function (Field, Buffer, AValue) {
      var R = undefined;
      if (this.FState in rtl.createSet(pas.DB.TDataSetState.dsCalcFields,pas.DB.TDataSetState.dsInternalCalc)) {
        R = this.FCalcBuffer.data}
       else R = this.FEditRow;
      this.FFieldMapper.SetJSONDataForField$1(Field,R,AValue);
      if (!(this.FState in rtl.createSet(pas.DB.TDataSetState.dsCalcFields,pas.DB.TDataSetState.dsInternalCalc,pas.DB.TDataSetState.dsFilter,pas.DB.TDataSetState.dsNewValue))) this.DataEvent(pas.DB.TDataEvent.deFieldChange,Field);
      this.SetModified(true);
    };
    this.BookmarkValid = function (ABookmark) {
      var Result = false;
      Result = rtl.isNumber(ABookmark.Data);
      return Result;
    };
    this.CompareBookmarks = function (Bookmark1, Bookmark2) {
      var Result = 0;
      if (rtl.isNumber(Bookmark1.Data) && rtl.isNumber(Bookmark2.Data)) {
        Result = rtl.trunc(Bookmark2.Data) - rtl.trunc(Bookmark1.Data)}
       else {
        if (rtl.isNumber(Bookmark1.Data)) {
          Result = -1}
         else if (rtl.isNumber(Bookmark2.Data)) {
          Result = 1}
         else Result = 0;
      };
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TJSONDataset",this.TBaseJSONDataSet,function () {
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addProperty("FieldDefs",2,pas.DB.$rtti["TFieldDefs"],"FFieldDefs","SetFieldDefs");
    $r.addProperty("RowType",2,$mod.$rtti["TJSONRowType"],"FRowType","SetRowType");
    $r.addProperty("UseDateTimeFormatFields",0,rtl.boolean,"FUseDateTimeFormatFields","FUseDateTimeFormatFields");
    $r.addProperty("Indexes",2,$mod.$rtti["TJSONIndexDefs"],"FIndexes","SetIndexes");
    $r.addProperty("ActiveIndex",2,rtl.string,"FActiveIndex","SetActiveIndex");
    $r.addProperty("Active",3,rtl.boolean,"GetActive","SetActive",{Default: false});
    $r.addProperty("BeforeOpen",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FBeforeOpen","FBeforeOpen");
    $r.addProperty("AfterOpen",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FAfterOpen","FAfterOpen");
    $r.addProperty("BeforeClose",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FBeforeClose","FBeforeClose");
    $r.addProperty("AfterClose",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FAfterClose","FAfterClose");
    $r.addProperty("BeforeInsert",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FBeforeInsert","FBeforeInsert");
    $r.addProperty("AfterInsert",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FAfterInsert","FAfterInsert");
    $r.addProperty("BeforeEdit",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FBeforeEdit","FBeforeEdit");
    $r.addProperty("AfterEdit",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FAfterEdit","FAfterEdit");
    $r.addProperty("BeforePost",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FBeforePost","FBeforePost");
    $r.addProperty("AfterPost",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FAfterPost","FAfterPost");
    $r.addProperty("BeforeCancel",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FBeforeCancel","FBeforeCancel");
    $r.addProperty("AfterCancel",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FAfterCancel","FAfterCancel");
    $r.addProperty("BeforeDelete",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FBeforeDelete","FBeforeDelete");
    $r.addProperty("AfterDelete",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FAfterDelete","FAfterDelete");
    $r.addProperty("BeforeScroll",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FBeforeScroll","FBeforeScroll");
    $r.addProperty("AfterScroll",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FAfterScroll","FAfterScroll");
    $r.addProperty("OnCalcFields",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FOnCalcFields","FOnCalcFields");
    $r.addProperty("OnDeleteError",0,pas.DB.$rtti["TDataSetErrorEvent"],"FOnDeleteError","FOnDeleteError");
    $r.addProperty("OnEditError",0,pas.DB.$rtti["TDataSetErrorEvent"],"FOnEditError","FOnEditError");
    $r.addProperty("OnFilterRecord",2,pas.DB.$rtti["TFilterRecordEvent"],"FOnFilterRecord","SetOnFilterRecord");
    $r.addProperty("OnNewRecord",0,pas.DB.$rtti["TDataSetNotifyEvent"],"FOnNewRecord","FOnNewRecord");
    $r.addProperty("OnPostError",0,pas.DB.$rtti["TDataSetErrorEvent"],"FOnPostError","FOnPostError");
    $r.addProperty("OnRecordResolved",0,pas.DB.$rtti["TOnRecordResolveEvent"],"FOnRecordResolved","FOnRecordResolved");
    $r.addProperty("OnLoadFail",0,pas.DB.$rtti["TDatasetLoadFailEvent"],"FOnLoadFail","FOnLoadFail");
    $r.addProperty("BlobFormat",0,$mod.$rtti["TBlobFormat"],"FBlobFormat","FBlobFormat");
    $r.addProperty("OnDecodeBlobValue",0,$mod.$rtti["TOnDecodeBlobBytesEvent"],"FOnDecodeBlobValue","FOnDecodeBlobValue");
    $r.addProperty("OnEncodeBlobValue",0,$mod.$rtti["TOnEncodeBlobBytesEvent"],"FOnEncodeBlobValue","FOnEncodeBlobValue");
  });
  rtl.createClass(this,"TJSONObjectFieldMapper",this.TJSONFieldMapper,function () {
    this.RemoveField = function (FieldName, FieldIndex, Row) {
      pas.JS.JSDelete(Row,FieldName);
    };
    this.SetJSONDataForField = function (FieldName, FieldIndex, Row, Data) {
      Row[FieldName] = Data;
    };
    this.GetJSONDataForField = function (FieldName, FieldIndex, Row) {
      var Result = undefined;
      Result = Row[FieldName];
      return Result;
    };
    this.CreateRow = function () {
      var Result = undefined;
      Result = new Object();
      return Result;
    };
  });
  rtl.createClass(this,"TJSONArrayFieldMapper",this.TJSONFieldMapper,function () {
    this.RemoveField = function (FieldName, FieldIndex, Row) {
      Row.splice(FieldIndex,1);
    };
    this.SetJSONDataForField = function (FieldName, FieldIndex, Row, Data) {
      Row[FieldIndex] = Data;
    };
    this.GetJSONDataForField = function (FieldName, FieldIndex, Row) {
      var Result = undefined;
      Result = Row[FieldIndex];
      return Result;
    };
    this.CreateRow = function () {
      var Result = undefined;
      Result = new Array();
      return Result;
    };
  });
  rtl.createClass(this,"EJSONDataset",pas.DB.EDatabaseError,function () {
  });
},["DateUtils"]);
//# sourceMappingURL=jsondataset.js.map
