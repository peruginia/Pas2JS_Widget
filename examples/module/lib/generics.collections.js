rtl.module("Generics.Collections",["System","Classes","SysUtils","RTLConsts","Types","JS","Generics.Strings","Generics.Defaults"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  $mod.$rtti.$Class("TEnumerator<Generics.Collections.TPair<Generics.Collections.TDictionary.TKey,Generics.Collections.TDictionary.TValue>>");
  $mod.$rtti.$Class("TEnumerable<Generics.Collections.TPair<Generics.Collections.TDictionary.TKey,Generics.Collections.TDictionary.TValue>>");
  $mod.$rtti.$Class("TEnumerator<Generics.Collections.TPair<Generics.Collections.TObjectDictionary.TKey,Generics.Collections.TObjectDictionary.TValue>>");
  $mod.$rtti.$Class("TEnumerable<Generics.Collections.TPair<Generics.Collections.TObjectDictionary.TKey,Generics.Collections.TObjectDictionary.TValue>>");
  $mod.$rtti.$Class("TEnumerator<System.Longint>");
  $mod.$rtti.$Class("TEnumerable<System.Longint>");
  $mod.$rtti.$Class("TCustomArrayHelper<System.Longint>");
  $mod.$rtti.$Class("TArrayHelper<System.Longint>");
  $mod.$rtti.$Class("TCustomList<System.Longint>");
  $mod.$rtti.$Class("TCustomListEnumerator<System.Longint>");
  $mod.$rtti.$Class("TList<System.Longint>");
  $mod.$rtti.$Class("TEnumerator<Controls.TBasicActionClient>");
  $mod.$rtti.$Class("TEnumerable<Controls.TBasicActionClient>");
  $mod.$rtti.$Class("TCustomArrayHelper<Controls.TBasicActionClient>");
  $mod.$rtti.$Class("TArrayHelper<Controls.TBasicActionClient>");
  $mod.$rtti.$Class("TCustomList<Controls.TBasicActionClient>");
  $mod.$rtti.$Class("TCustomListEnumerator<Controls.TBasicActionClient>");
  $mod.$rtti.$Class("TList<Controls.TBasicActionClient>");
  $mod.$rtti.$Class("TEnumerator<ActnList.TAction>");
  $mod.$rtti.$Class("TEnumerable<ActnList.TAction>");
  $mod.$rtti.$Class("TCustomArrayHelper<ActnList.TAction>");
  $mod.$rtti.$Class("TArrayHelper<ActnList.TAction>");
  $mod.$rtti.$Class("TCustomList<ActnList.TAction>");
  $mod.$rtti.$Class("TCustomListEnumerator<ActnList.TAction>");
  $mod.$rtti.$Class("TList<ActnList.TAction>");
  $mod.$rtti.$Class("TEnumerator<Menus.TMenuItem>");
  $mod.$rtti.$Class("TEnumerable<Menus.TMenuItem>");
  $mod.$rtti.$Class("TCustomArrayHelper<Menus.TMenuItem>");
  $mod.$rtti.$Class("TArrayHelper<Menus.TMenuItem>");
  $mod.$rtti.$Class("TCustomList<Menus.TMenuItem>");
  $mod.$rtti.$Class("TCustomListEnumerator<Menus.TMenuItem>");
  $mod.$rtti.$Class("TList<Menus.TMenuItem>");
  $mod.$rtti.$Class("TEnumerator<ComCtrls.TTreeNode>");
  $mod.$rtti.$Class("TEnumerable<ComCtrls.TTreeNode>");
  $mod.$rtti.$Class("TCustomArrayHelper<ComCtrls.TTreeNode>");
  $mod.$rtti.$Class("TArrayHelper<ComCtrls.TTreeNode>");
  $mod.$rtti.$Class("TCustomList<ComCtrls.TTreeNode>");
  $mod.$rtti.$Class("TCustomListEnumerator<ComCtrls.TTreeNode>");
  $mod.$rtti.$Class("TList<ComCtrls.TTreeNode>");
  $mod.$rtti.$Class("TEnumerator<ComCtrls.TListItem>");
  $mod.$rtti.$Class("TEnumerable<ComCtrls.TListItem>");
  $mod.$rtti.$Class("TCustomArrayHelper<ComCtrls.TListItem>");
  $mod.$rtti.$Class("TArrayHelper<ComCtrls.TListItem>");
  $mod.$rtti.$Class("TCustomList<ComCtrls.TListItem>");
  $mod.$rtti.$Class("TCustomListEnumerator<ComCtrls.TListItem>");
  $mod.$rtti.$Class("TList<ComCtrls.TListItem>");
  this.TCollectionNotification = {"0": "cnAdded", cnAdded: 0, "1": "cnRemoved", cnRemoved: 1, "2": "cnExtracted", cnExtracted: 2};
  this.$rtti.$Enum("TCollectionNotification",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TCollectionNotification});
  rtl.recNewT(this,"TBinarySearchResult",function () {
    this.FoundIndex = 0;
    this.CandidateIndex = 0;
    this.CompareResult = 0;
    this.$eq = function (b) {
      return (this.FoundIndex === b.FoundIndex) && (this.CandidateIndex === b.CandidateIndex) && (this.CompareResult === b.CompareResult);
    };
    this.$assign = function (s) {
      this.FoundIndex = s.FoundIndex;
      this.CandidateIndex = s.CandidateIndex;
      this.CompareResult = s.CompareResult;
      return this;
    };
    var $r = $mod.$rtti.$Record("TBinarySearchResult",{});
    $r.addField("FoundIndex",rtl.nativeint);
    $r.addField("CandidateIndex",rtl.nativeint);
    $r.addField("CompareResult",rtl.nativeint);
  });
  this.TDirection = {"0": "FromBeginning", FromBeginning: 0, "1": "fromEnd", fromEnd: 1};
  this.$rtti.$Enum("TDirection",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TDirection});
  rtl.createClass(this,"EDictionary",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"TEnumerator$G12",pas.System.TObject,function () {
    this.MoveNext = function () {
      var Result = false;
      Result = this.DoMoveNext();
      return Result;
    };
  },"TEnumerator<Generics.Collections.TPair<Generics.Collections.TDictionary.TKey,Generics.Collections.TDictionary.TValue>>");
  rtl.createClass(this,"TEnumerable$G11",pas.System.TObject,function () {
    this.GetEnumerator = function () {
      var Result = null;
      Result = this.DoGetEnumerator();
      return Result;
    };
    this.ToArray = function () {
      var Result = [];
      var LEnumerator = null;
      Result = [];
      LEnumerator = this.GetEnumerator();
      try {
        while (LEnumerator.MoveNext()) Result.push($mod.TPair$G1.$clone(LEnumerator.DoGetCurrent()));
      } finally {
        LEnumerator = rtl.freeLoc(LEnumerator);
      };
      return Result;
    };
  },"TEnumerable<Generics.Collections.TPair<Generics.Collections.TDictionary.TKey,Generics.Collections.TDictionary.TValue>>");
  this.TDictionaryOwnership = {"0": "doOwnsKeys", doOwnsKeys: 0, "1": "doOwnsValues", doOwnsValues: 1};
  this.$rtti.$Enum("TDictionaryOwnership",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TDictionaryOwnership});
  this.$rtti.$Set("TDictionaryOwnerships",{comptype: this.$rtti["TDictionaryOwnership"]});
  rtl.createClass(this,"TEnumerator$G15",pas.System.TObject,function () {
    this.MoveNext = function () {
      var Result = false;
      Result = this.DoMoveNext();
      return Result;
    };
  },"TEnumerator<Generics.Collections.TPair<Generics.Collections.TObjectDictionary.TKey,Generics.Collections.TObjectDictionary.TValue>>");
  rtl.createClass(this,"TEnumerable$G14",pas.System.TObject,function () {
    this.GetEnumerator = function () {
      var Result = null;
      Result = this.DoGetEnumerator();
      return Result;
    };
    this.ToArray = function () {
      var Result = [];
      var LEnumerator = null;
      Result = [];
      LEnumerator = this.GetEnumerator();
      try {
        while (LEnumerator.MoveNext()) Result.push($mod.TPair$G2.$clone(LEnumerator.DoGetCurrent()));
      } finally {
        LEnumerator = rtl.freeLoc(LEnumerator);
      };
      return Result;
    };
  },"TEnumerable<Generics.Collections.TPair<Generics.Collections.TObjectDictionary.TKey,Generics.Collections.TObjectDictionary.TValue>>");
  rtl.createClass(this,"TEnumerator$G18",pas.System.TObject,function () {
    this.MoveNext = function () {
      var Result = false;
      Result = this.DoMoveNext();
      return Result;
    };
  },"TEnumerator<System.Longint>");
  rtl.createClass(this,"TEnumerable$G17",pas.System.TObject,function () {
    this.GetEnumerator = function () {
      var Result = null;
      Result = this.DoGetEnumerator();
      return Result;
    };
    this.ToArray = function () {
      var Result = [];
      var LEnumerator = null;
      Result = [];
      LEnumerator = this.GetEnumerator();
      try {
        while (LEnumerator.MoveNext()) Result.push(LEnumerator.DoGetCurrent());
      } finally {
        LEnumerator = rtl.freeLoc(LEnumerator);
      };
      return Result;
    };
  },"TEnumerable<System.Longint>");
  this.$rtti.$MethodVar("TCollectionNotifyEvent<System.Longint>",{procsig: rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["AItem",rtl.longint,2],["AAction",this.$rtti["TCollectionNotification"]]]), methodkind: 0});
  rtl.createClass(this,"TCustomArrayHelper$G12",pas.System.TObject,function () {
    this.Sort = function (AValues, AComparer) {
      this.Sort$1(AValues,AComparer,0,rtl.length(AValues.get()));
    };
    this.Sort$1 = function (AValues, AComparer, AIndex, ACount) {
      if (ACount <= 1) return;
      this.QuickSort(AValues,AIndex,(AIndex + ACount) - 1,AComparer);
    };
    this.BinarySearch$2 = function (AValues, AItem, AFoundIndex, AComparer) {
      var Result = false;
      Result = this.BinarySearch$1(AValues,AItem,AFoundIndex,AComparer,0,rtl.length(AValues));
      return Result;
    };
    this.BinarySearch$3 = function (AValues, AItem, ASearchResult, AComparer) {
      var Result = false;
      Result = this.BinarySearch(AValues,AItem,ASearchResult,AComparer,0,rtl.length(AValues));
      return Result;
    };
  },"TCustomArrayHelper<System.Longint>");
  rtl.createClass(this,"TArrayHelper$G11",this.TCustomArrayHelper$G12,function () {
    this.QuickSort = function (AValues, ALeft, ARight, AComparer) {
      var I = 0;
      var J = 0;
      var P = 0;
      var Q = 0;
      if (((ARight - ALeft) <= 0) || (rtl.length(AValues.get()) === 0)) return;
      do {
        I = ALeft;
        J = ARight;
        P = AValues.get()[ALeft + Math.floor((ARight - ALeft) / 2)];
        do {
          while (AComparer.Compare(AValues.get()[I],P) < 0) I += 1;
          while (AComparer.Compare(AValues.get()[J],P) > 0) J -= 1;
          if (I <= J) {
            if (I !== J) {
              Q = AValues.get()[I];
              AValues.get()[I] = AValues.get()[J];
              AValues.get()[J] = Q;
            };
            I += 1;
            J -= 1;
          };
        } while (!(I > J));
        if ((J - ALeft) < (ARight - I)) {
          if (ALeft < J) this.QuickSort(AValues,ALeft,J,AComparer);
          ALeft = I;
        } else {
          if (I < ARight) this.QuickSort(AValues,I,ARight,AComparer);
          ARight = J;
        };
      } while (!(ALeft >= ARight));
    };
    this.BinarySearch = function (AValues, AItem, ASearchResult, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var ilo = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      ilo = imid * imid;
      imid = ilo * imid;
      while (imin < imax) {
        imid = rtl.trunc((imax + imin) / 2);
        ASearchResult.CompareResult = AComparer.Compare(AValues[imid],AItem);
        if (ASearchResult.CompareResult < 0) {
          imin = imid + 1}
         else {
          if (ASearchResult.CompareResult === 0) {
            ASearchResult.FoundIndex = imid;
            ASearchResult.CandidateIndex = imid;
            return true;
          };
          imax = imid;
        };
      };
      Result = imax === imin;
      if (Result) {
        ASearchResult.CompareResult = AComparer.Compare(AValues[imin],AItem);
        ASearchResult.CandidateIndex = imin;
        Result = ASearchResult.CompareResult === 0;
        if (Result) {
          ASearchResult.FoundIndex = imin}
         else ASearchResult.FoundIndex = -1;
      } else {
        ASearchResult.CompareResult = 0;
        ASearchResult.FoundIndex = -1;
        ASearchResult.CandidateIndex = -1;
      };
      return Result;
    };
    this.BinarySearch$1 = function (AValues, AItem, AFoundIndex, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var LCompare = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      while (imin < imax) {
        imid = rtl.trunc((imin + imax) / 2);
        LCompare = AComparer.Compare(AValues[imid],AItem);
        if (LCompare < 0) {
          imin = imid + 1}
         else {
          if (LCompare === 0) {
            AFoundIndex.set(imid);
            return true;
          };
          imax = imid;
        };
      };
      LCompare = AComparer.Compare(AValues[imin],AItem);
      Result = (imax === imin) && (LCompare === 0);
      if (Result) {
        AFoundIndex.set(imin)}
       else AFoundIndex.set(-1);
      return Result;
    };
  },"TArrayHelper<System.Longint>");
  rtl.createClass(this,"TCustomList$G10",this.TEnumerable$G17,function () {
    this.$init = function () {
      $mod.TEnumerable$G17.$init.call(this);
      this.FOnNotify = null;
      this.FLength = 0;
      this.FItems = [];
    };
    this.$final = function () {
      this.FOnNotify = undefined;
      this.FItems = undefined;
      $mod.TEnumerable$G17.$final.call(this);
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = rtl.length(this.FItems);
      return Result;
    };
    this.PrepareAddingItem = function () {
      var Result = 0;
      if (this.FLength === rtl.length(this.FItems)) this.FItems.push(-2147483648);
      Result = this.FLength;
      this.FLength += 1;
      return Result;
    };
    this.PrepareAddingRange = function (ACount) {
      var Result = 0;
      var l = 0;
      if (ACount < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (ACount === 0) return this.FLength - 1;
      for (var $l = rtl.length(this.FItems) + 1, $end = this.FLength + ACount; $l <= $end; $l++) {
        l = $l;
        this.FItems.push(-2147483648);
      };
      Result = this.FLength;
      this.FLength += ACount;
      return Result;
    };
    this.Notify = function (AValue, ACollectionNotification) {
      if (this.FOnNotify != null) this.FOnNotify(this,AValue,ACollectionNotification);
    };
    this.DoRemove = function (AIndex, ACollectionNotification) {
      var Result = 0;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      this.FLength -= 1;
      this.FItems[AIndex] = -2147483648;
      this.FItems.splice(AIndex,1);
      this.Notify(Result,ACollectionNotification);
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FLength;
      return Result;
    };
    var $r = this.$rtti;
    $mod.$rtti.$DynArray("TCustomList<System.Longint>.FItems$a",{eltype: rtl.longint});
  },"TCustomList<System.Longint>");
  rtl.createClass(this,"TCustomListEnumerator$G8",this.TEnumerator$G18,function () {
    this.$init = function () {
      $mod.TEnumerator$G18.$init.call(this);
      this.FList = null;
      this.FIndex = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      $mod.TEnumerator$G18.$final.call(this);
    };
    this.DoMoveNext = function () {
      var Result = false;
      this.FIndex += 1;
      Result = (this.FList.FLength > 0) && (this.FIndex < this.FList.FLength);
      return Result;
    };
    this.DoGetCurrent = function () {
      var Result = 0;
      Result = this.GetCurrent();
      return Result;
    };
    this.GetCurrent = function () {
      var Result = 0;
      Result = this.FList.FItems[this.FIndex];
      return Result;
    };
    this.Create$1 = function (AList) {
      pas.System.TObject.Create.call(this);
      this.FIndex = -1;
      this.FList = AList;
      return this;
    };
  },"TCustomListEnumerator<System.Longint>");
  rtl.createClass(this,"TList$G3",this.TCustomList$G10,function () {
    rtl.createClass(this,"TEnumerator",$mod.TCustomListEnumerator$G8,function () {
    },"TList<System.Longint>.TEnumerator");
    this.$init = function () {
      $mod.TCustomList$G10.$init.call(this);
      this.FComparer = null;
    };
    this.$final = function () {
      rtl.setIntfP(this,"FComparer",null);
      $mod.TCustomList$G10.$final.call(this);
    };
    this.SameValue = function (Left, Right) {
      var Result = false;
      if (this.FComparer != null) {
        Result = this.FComparer.Compare(Left,Right) === 0}
       else Result = Left === Right;
      return Result;
    };
    this.SetCapacity = function (AValue) {
      if (AValue < this.FLength) this.SetCount(AValue);
      this.FItems = rtl.arraySetLength(this.FItems,0,AValue);
    };
    this.SetCount = function (AValue) {
      if (AValue < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (AValue > this.GetCapacity()) {
        this.SetCapacity(AValue)}
       else if (AValue < this.FLength) this.DeleteRange(AValue,this.FLength - AValue);
      this.FLength = AValue;
    };
    this.InitializeList = function () {
    };
    this.InternalInsert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.FItems.splice(AIndex,0,AValue);
      this.FLength += 1;
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.DoGetEnumerator = function () {
      var Result = null;
      Result = this.GetEnumerator$1();
      return Result;
    };
    this.GetItem = function (AIndex) {
      var Result = 0;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      return Result;
    };
    this.SetItem = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.Notify(this.FItems[AIndex],$mod.TCollectionNotification.cnRemoved);
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.GetEnumerator$1 = function () {
      var Result = null;
      Result = this.TEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.Create$1 = function () {
      this.InitializeList();
      return this;
    };
    this.Create$2 = function (AComparer) {
      this.InitializeList();
      rtl.setIntfP(this,"FComparer",AComparer);
      return this;
    };
    this.Create$3 = function (ACollection) {
      var LItem = 0;
      this.Create$1();
      var $in = ACollection.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LItem = $in.DoGetCurrent();
          this.Add(LItem);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
      return this;
    };
    this.Destroy = function () {
      this.SetCapacity(0);
    };
    this.Add = function (AValue) {
      var Result = 0;
      Result = this.PrepareAddingItem();
      this.FItems[Result] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
      return Result;
    };
    this.AddRange = function (AValues) {
      this.InsertRange(this.FLength,AValues);
    };
    this.AddRange$1 = function (AEnumerable) {
      var LValue = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.Add(LValue);
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.AddRange$2 = function (AEnumerable) {
      var LValue = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.Add(LValue);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Insert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.InternalInsert(AIndex,AValue);
    };
    this.InsertRange = function (AIndex, AValues) {
      var LLength = 0;
      var i = 0;
      var LValue = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LLength = rtl.length(AValues);
      if (LLength === 0) return;
      if (AIndex !== this.PrepareAddingRange(LLength)) {
        for (var $l = AIndex, $end = this.FLength - LLength - 1; $l <= $end; $l++) {
          i = $l;
          this.FItems[i + LLength] = this.FItems[i];
        };
        for (var $l1 = 0, $end1 = LLength - 1; $l1 <= $end1; $l1++) {
          i = $l1;
          this.FItems[AIndex + i] = -2147483648;
        };
      };
      for (var $l2 = 0, $end2 = LLength - 1; $l2 <= $end2; $l2++) {
        i = $l2;
        LValue = AValues[i];
        this.FItems[i + AIndex] = LValue;
        this.Notify(LValue,$mod.TCollectionNotification.cnAdded);
      };
    };
    this.InsertRange$1 = function (AIndex, AEnumerable) {
      var LValue = 0;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.InsertRange$2 = function (AIndex, AEnumerable) {
      var LValue = 0;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Remove = function (AValue) {
      var Result = 0;
      Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.RemoveItem = function (AValue, Direction) {
      var Result = 0;
      if (Direction === $mod.TDirection.fromEnd) {
        Result = this.LastIndexOf(AValue)}
       else Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.Delete = function (AIndex) {
      this.DoRemove(AIndex,$mod.TCollectionNotification.cnRemoved);
    };
    this.DeleteRange = function (AIndex, ACount) {
      var LDeleted = [];
      var i = 0;
      if (ACount === 0) return;
      if ((ACount < 0) || (AIndex < 0) || ((AIndex + ACount) > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LDeleted = this.FItems.splice(AIndex,this.FLength);
      this.FLength -= ACount;
      for (var $l = 0, $end = rtl.length(LDeleted) - 1; $l <= $end; $l++) {
        i = $l;
        this.Notify(LDeleted[i],$mod.TCollectionNotification.cnRemoved);
      };
    };
    this.ExtractIndex = function (AIndex) {
      var Result = 0;
      Result = this.DoRemove(AIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Extract = function (AValue) {
      var Result = 0;
      var LIndex = 0;
      LIndex = this.IndexOf(AValue);
      if (LIndex < 0) {
        Result = -2147483648}
       else Result = this.DoRemove(LIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Exchange = function (AIndex1, AIndex2) {
      var LTemp = 0;
      LTemp = this.FItems[AIndex1];
      this.FItems[AIndex1] = this.FItems[AIndex2];
      this.FItems[AIndex2] = LTemp;
    };
    this.Move = function (AIndex, ANewIndex) {
      var Arr = null;
      var LTemp = undefined;
      var i = 0;
      if (ANewIndex === AIndex) return;
      if ((ANewIndex < 0) || (ANewIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Arr = this.FItems;
      LTemp = Arr[AIndex];
      if (AIndex < ANewIndex) {
        for (var $l = AIndex, $end = ANewIndex - 1; $l <= $end; $l++) {
          i = $l;
          Arr[i] = Arr[i + 1];
        }}
       else for (var $l1 = AIndex, $end1 = ANewIndex + 1; $l1 >= $end1; $l1--) {
        i = $l1;
        Arr[i] = Arr[i - 1];
      };
      Arr[ANewIndex] = LTemp;
    };
    this.First = function () {
      var Result = 0;
      Result = this.GetItem(0);
      return Result;
    };
    this.Last = function () {
      var Result = 0;
      Result = this.GetItem(this.FLength - 1);
      return Result;
    };
    this.Clear = function () {
      this.SetCount(0);
      this.SetCapacity(0);
    };
    this.Contains = function (AValue) {
      var Result = false;
      Result = this.IndexOf(AValue) >= 0;
      return Result;
    };
    this.IndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = 0, $end = this.FLength - 1; $l <= $end; $l++) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.LastIndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = this.FLength - 1; $l >= 0; $l--) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.Reverse = function () {
      var a = 0;
      var b = 0;
      var LTemp = 0;
      a = 0;
      b = this.FLength - 1;
      while (a < b) {
        LTemp = this.FItems[a];
        this.FItems[a] = this.FItems[b];
        this.FItems[b] = LTemp;
        a += 1;
        b -= 1;
      };
    };
    this.TrimExcess = function () {
      this.SetCapacity(this.FLength);
    };
    this.Sort = function () {
      $mod.TArrayHelper$G11.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},this.FComparer,0,this.FLength);
    };
    this.Sort$1 = function (AComparer) {
      $mod.TArrayHelper$G11.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},AComparer,0,this.FLength);
    };
    this.BinarySearch = function (AItem, AIndex) {
      var Result = false;
      Result = $mod.TArrayHelper$G11.BinarySearch$1(this.FItems,AItem,AIndex,this.FComparer,0,this.FLength);
      return Result;
    };
    this.BinarySearch$1 = function (AItem, AIndex, AComparer) {
      var Result = false;
      Result = $mod.TArrayHelper$G11.BinarySearch$1(this.FItems,AItem,AIndex,AComparer,0,this.FLength);
      return Result;
    };
  },"TList<System.Longint>");
  rtl.createClass(this,"TEnumerator$G19",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.MoveNext = function () {
      var Result = false;
      Result = this.DoMoveNext();
      return Result;
    };
  },"TEnumerator<Controls.TBasicActionClient>");
  rtl.createClass(this,"TEnumerable$G18",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = this.DoGetEnumerator();
      return Result;
    };
    this.ToArray = function () {
      var Result = [];
      var LEnumerator = null;
      Result = [];
      LEnumerator = this.GetEnumerator();
      try {
        while (LEnumerator.MoveNext()) Result.push(LEnumerator.DoGetCurrent());
      } finally {
        LEnumerator = rtl.freeLoc(LEnumerator);
      };
      return Result;
    };
  },"TEnumerable<Controls.TBasicActionClient>");
  this.$rtti.$MethodVar("TCollectionNotifyEvent<Controls.TBasicActionClient>",{init: function () {
      this.procsig = rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["AItem",pas.Controls.$rtti["TBasicActionClient"],2],["AAction",$mod.$rtti["TCollectionNotification"]]]);
    }, methodkind: 0});
  rtl.createClass(this,"TCustomArrayHelper$G13",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.Sort = function (AValues, AComparer) {
      this.Sort$1(AValues,AComparer,0,rtl.length(AValues.get()));
    };
    this.Sort$1 = function (AValues, AComparer, AIndex, ACount) {
      if (ACount <= 1) return;
      this.QuickSort(AValues,AIndex,(AIndex + ACount) - 1,AComparer);
    };
    this.BinarySearch$2 = function (AValues, AItem, AFoundIndex, AComparer) {
      var Result = false;
      Result = this.BinarySearch$1(AValues,AItem,AFoundIndex,AComparer,0,rtl.length(AValues));
      return Result;
    };
    this.BinarySearch$3 = function (AValues, AItem, ASearchResult, AComparer) {
      var Result = false;
      Result = this.BinarySearch(AValues,AItem,ASearchResult,AComparer,0,rtl.length(AValues));
      return Result;
    };
  },"TCustomArrayHelper<Controls.TBasicActionClient>");
  rtl.createClass(this,"TArrayHelper$G12",this.TCustomArrayHelper$G13,function () {
    this.$initSpec = function () {
    };
    this.QuickSort = function (AValues, ALeft, ARight, AComparer) {
      var I = 0;
      var J = 0;
      var P = null;
      var Q = null;
      if (((ARight - ALeft) <= 0) || (rtl.length(AValues.get()) === 0)) return;
      do {
        I = ALeft;
        J = ARight;
        P = AValues.get()[ALeft + Math.floor((ARight - ALeft) / 2)];
        do {
          while (AComparer.Compare(AValues.get()[I],P) < 0) I += 1;
          while (AComparer.Compare(AValues.get()[J],P) > 0) J -= 1;
          if (I <= J) {
            if (I !== J) {
              Q = AValues.get()[I];
              AValues.get()[I] = AValues.get()[J];
              AValues.get()[J] = Q;
            };
            I += 1;
            J -= 1;
          };
        } while (!(I > J));
        if ((J - ALeft) < (ARight - I)) {
          if (ALeft < J) this.QuickSort(AValues,ALeft,J,AComparer);
          ALeft = I;
        } else {
          if (I < ARight) this.QuickSort(AValues,I,ARight,AComparer);
          ARight = J;
        };
      } while (!(ALeft >= ARight));
    };
    this.BinarySearch = function (AValues, AItem, ASearchResult, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var ilo = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      ilo = imid * imid;
      imid = ilo * imid;
      while (imin < imax) {
        imid = rtl.trunc((imax + imin) / 2);
        ASearchResult.CompareResult = AComparer.Compare(AValues[imid],AItem);
        if (ASearchResult.CompareResult < 0) {
          imin = imid + 1}
         else {
          if (ASearchResult.CompareResult === 0) {
            ASearchResult.FoundIndex = imid;
            ASearchResult.CandidateIndex = imid;
            return true;
          };
          imax = imid;
        };
      };
      Result = imax === imin;
      if (Result) {
        ASearchResult.CompareResult = AComparer.Compare(AValues[imin],AItem);
        ASearchResult.CandidateIndex = imin;
        Result = ASearchResult.CompareResult === 0;
        if (Result) {
          ASearchResult.FoundIndex = imin}
         else ASearchResult.FoundIndex = -1;
      } else {
        ASearchResult.CompareResult = 0;
        ASearchResult.FoundIndex = -1;
        ASearchResult.CandidateIndex = -1;
      };
      return Result;
    };
    this.BinarySearch$1 = function (AValues, AItem, AFoundIndex, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var LCompare = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      while (imin < imax) {
        imid = rtl.trunc((imin + imax) / 2);
        LCompare = AComparer.Compare(AValues[imid],AItem);
        if (LCompare < 0) {
          imin = imid + 1}
         else {
          if (LCompare === 0) {
            AFoundIndex.set(imid);
            return true;
          };
          imax = imid;
        };
      };
      LCompare = AComparer.Compare(AValues[imin],AItem);
      Result = (imax === imin) && (LCompare === 0);
      if (Result) {
        AFoundIndex.set(imin)}
       else AFoundIndex.set(-1);
      return Result;
    };
  },"TArrayHelper<Controls.TBasicActionClient>");
  rtl.createClass(this,"TCustomList$G11",this.TEnumerable$G18,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $mod.$rtti.$DynArray("TCustomList<Controls.TBasicActionClient>.FItems$a",{eltype: pas.Controls.$rtti["TBasicActionClient"]});
    };
    this.$init = function () {
      $mod.TEnumerable$G18.$init.call(this);
      this.FOnNotify = null;
      this.FLength = 0;
      this.FItems = [];
    };
    this.$final = function () {
      this.FOnNotify = undefined;
      this.FItems = undefined;
      $mod.TEnumerable$G18.$final.call(this);
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = rtl.length(this.FItems);
      return Result;
    };
    this.PrepareAddingItem = function () {
      var Result = 0;
      if (this.FLength === rtl.length(this.FItems)) this.FItems.push(null);
      Result = this.FLength;
      this.FLength += 1;
      return Result;
    };
    this.PrepareAddingRange = function (ACount) {
      var Result = 0;
      var l = 0;
      if (ACount < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (ACount === 0) return this.FLength - 1;
      for (var $l = rtl.length(this.FItems) + 1, $end = this.FLength + ACount; $l <= $end; $l++) {
        l = $l;
        this.FItems.push(null);
      };
      Result = this.FLength;
      this.FLength += ACount;
      return Result;
    };
    this.Notify = function (AValue, ACollectionNotification) {
      if (this.FOnNotify != null) this.FOnNotify(this,AValue,ACollectionNotification);
    };
    this.DoRemove = function (AIndex, ACollectionNotification) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      this.FLength -= 1;
      this.FItems[AIndex] = null;
      this.FItems.splice(AIndex,1);
      this.Notify(Result,ACollectionNotification);
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FLength;
      return Result;
    };
  },"TCustomList<Controls.TBasicActionClient>");
  rtl.createClass(this,"TCustomListEnumerator$G9",this.TEnumerator$G19,function () {
    this.$initSpec = function () {
    };
    this.$init = function () {
      $mod.TEnumerator$G19.$init.call(this);
      this.FList = null;
      this.FIndex = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      $mod.TEnumerator$G19.$final.call(this);
    };
    this.DoMoveNext = function () {
      var Result = false;
      this.FIndex += 1;
      Result = (this.FList.FLength > 0) && (this.FIndex < this.FList.FLength);
      return Result;
    };
    this.DoGetCurrent = function () {
      var Result = null;
      Result = this.GetCurrent();
      return Result;
    };
    this.GetCurrent = function () {
      var Result = null;
      Result = this.FList.FItems[this.FIndex];
      return Result;
    };
    this.Create$1 = function (AList) {
      pas.System.TObject.Create.call(this);
      this.FIndex = -1;
      this.FList = AList;
      return this;
    };
  },"TCustomListEnumerator<Controls.TBasicActionClient>");
  rtl.createClass(this,"TList$G4",this.TCustomList$G11,function () {
    this.$initSpec = function () {
      rtl.createClass(this,"TEnumerator",$mod.TCustomListEnumerator$G9,function () {
      },"TList<Controls.TBasicActionClient>.TEnumerator");
    };
    this.$init = function () {
      $mod.TCustomList$G11.$init.call(this);
      this.FComparer = null;
    };
    this.$final = function () {
      rtl.setIntfP(this,"FComparer",null);
      $mod.TCustomList$G11.$final.call(this);
    };
    this.SameValue = function (Left, Right) {
      var Result = false;
      if (this.FComparer != null) {
        Result = this.FComparer.Compare(Left,Right) === 0}
       else Result = Left === Right;
      return Result;
    };
    this.SetCapacity = function (AValue) {
      if (AValue < this.FLength) this.SetCount(AValue);
      this.FItems = rtl.arraySetLength(this.FItems,null,AValue);
    };
    this.SetCount = function (AValue) {
      if (AValue < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (AValue > this.GetCapacity()) {
        this.SetCapacity(AValue)}
       else if (AValue < this.FLength) this.DeleteRange(AValue,this.FLength - AValue);
      this.FLength = AValue;
    };
    this.InitializeList = function () {
    };
    this.InternalInsert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.FItems.splice(AIndex,0,AValue);
      this.FLength += 1;
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.DoGetEnumerator = function () {
      var Result = null;
      Result = this.GetEnumerator$1();
      return Result;
    };
    this.GetItem = function (AIndex) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      return Result;
    };
    this.SetItem = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.Notify(this.FItems[AIndex],$mod.TCollectionNotification.cnRemoved);
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.GetEnumerator$1 = function () {
      var Result = null;
      Result = this.TEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.Create$1 = function () {
      this.InitializeList();
      return this;
    };
    this.Create$2 = function (AComparer) {
      this.InitializeList();
      rtl.setIntfP(this,"FComparer",AComparer);
      return this;
    };
    this.Create$3 = function (ACollection) {
      var LItem = null;
      this.Create$1();
      var $in = ACollection.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LItem = $in.DoGetCurrent();
          this.Add(LItem);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
      return this;
    };
    this.Destroy = function () {
      this.SetCapacity(0);
    };
    this.Add = function (AValue) {
      var Result = 0;
      Result = this.PrepareAddingItem();
      this.FItems[Result] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
      return Result;
    };
    this.AddRange = function (AValues) {
      this.InsertRange(this.FLength,AValues);
    };
    this.AddRange$1 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.Add(LValue);
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.AddRange$2 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.Add(LValue);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Insert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.InternalInsert(AIndex,AValue);
    };
    this.InsertRange = function (AIndex, AValues) {
      var LLength = 0;
      var i = 0;
      var LValue = null;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LLength = rtl.length(AValues);
      if (LLength === 0) return;
      if (AIndex !== this.PrepareAddingRange(LLength)) {
        for (var $l = AIndex, $end = this.FLength - LLength - 1; $l <= $end; $l++) {
          i = $l;
          this.FItems[i + LLength] = this.FItems[i];
        };
        for (var $l1 = 0, $end1 = LLength - 1; $l1 <= $end1; $l1++) {
          i = $l1;
          this.FItems[AIndex + i] = null;
        };
      };
      for (var $l2 = 0, $end2 = LLength - 1; $l2 <= $end2; $l2++) {
        i = $l2;
        LValue = AValues[i];
        this.FItems[i + AIndex] = LValue;
        this.Notify(LValue,$mod.TCollectionNotification.cnAdded);
      };
    };
    this.InsertRange$1 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.InsertRange$2 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Remove = function (AValue) {
      var Result = 0;
      Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.RemoveItem = function (AValue, Direction) {
      var Result = 0;
      if (Direction === $mod.TDirection.fromEnd) {
        Result = this.LastIndexOf(AValue)}
       else Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.Delete = function (AIndex) {
      this.DoRemove(AIndex,$mod.TCollectionNotification.cnRemoved);
    };
    this.DeleteRange = function (AIndex, ACount) {
      var LDeleted = [];
      var i = 0;
      if (ACount === 0) return;
      if ((ACount < 0) || (AIndex < 0) || ((AIndex + ACount) > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LDeleted = this.FItems.splice(AIndex,this.FLength);
      this.FLength -= ACount;
      for (var $l = 0, $end = rtl.length(LDeleted) - 1; $l <= $end; $l++) {
        i = $l;
        this.Notify(LDeleted[i],$mod.TCollectionNotification.cnRemoved);
      };
    };
    this.ExtractIndex = function (AIndex) {
      var Result = null;
      Result = this.DoRemove(AIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Extract = function (AValue) {
      var Result = null;
      var LIndex = 0;
      LIndex = this.IndexOf(AValue);
      if (LIndex < 0) {
        Result = null}
       else Result = this.DoRemove(LIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Exchange = function (AIndex1, AIndex2) {
      var LTemp = null;
      LTemp = this.FItems[AIndex1];
      this.FItems[AIndex1] = this.FItems[AIndex2];
      this.FItems[AIndex2] = LTemp;
    };
    this.Move = function (AIndex, ANewIndex) {
      var Arr = null;
      var LTemp = undefined;
      var i = 0;
      if (ANewIndex === AIndex) return;
      if ((ANewIndex < 0) || (ANewIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Arr = this.FItems;
      LTemp = Arr[AIndex];
      if (AIndex < ANewIndex) {
        for (var $l = AIndex, $end = ANewIndex - 1; $l <= $end; $l++) {
          i = $l;
          Arr[i] = Arr[i + 1];
        }}
       else for (var $l1 = AIndex, $end1 = ANewIndex + 1; $l1 >= $end1; $l1--) {
        i = $l1;
        Arr[i] = Arr[i - 1];
      };
      Arr[ANewIndex] = LTemp;
    };
    this.First = function () {
      var Result = null;
      Result = this.GetItem(0);
      return Result;
    };
    this.Last = function () {
      var Result = null;
      Result = this.GetItem(this.FLength - 1);
      return Result;
    };
    this.Clear = function () {
      this.SetCount(0);
      this.SetCapacity(0);
    };
    this.Contains = function (AValue) {
      var Result = false;
      Result = this.IndexOf(AValue) >= 0;
      return Result;
    };
    this.IndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = 0, $end = this.FLength - 1; $l <= $end; $l++) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.LastIndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = this.FLength - 1; $l >= 0; $l--) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.Reverse = function () {
      var a = 0;
      var b = 0;
      var LTemp = null;
      a = 0;
      b = this.FLength - 1;
      while (a < b) {
        LTemp = this.FItems[a];
        this.FItems[a] = this.FItems[b];
        this.FItems[b] = LTemp;
        a += 1;
        b -= 1;
      };
    };
    this.TrimExcess = function () {
      this.SetCapacity(this.FLength);
    };
    this.Sort = function () {
      $mod.TArrayHelper$G12.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},this.FComparer,0,this.FLength);
    };
    this.Sort$1 = function (AComparer) {
      $mod.TArrayHelper$G12.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},AComparer,0,this.FLength);
    };
    this.BinarySearch = function (AItem, AIndex) {
      var Result = false;
      Result = $mod.TArrayHelper$G12.BinarySearch$1(this.FItems,AItem,AIndex,this.FComparer,0,this.FLength);
      return Result;
    };
    this.BinarySearch$1 = function (AItem, AIndex, AComparer) {
      var Result = false;
      Result = $mod.TArrayHelper$G12.BinarySearch$1(this.FItems,AItem,AIndex,AComparer,0,this.FLength);
      return Result;
    };
  },"TList<Controls.TBasicActionClient>");
  rtl.createClass(this,"TEnumerator$G20",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.MoveNext = function () {
      var Result = false;
      Result = this.DoMoveNext();
      return Result;
    };
  },"TEnumerator<ActnList.TAction>");
  rtl.createClass(this,"TEnumerable$G19",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = this.DoGetEnumerator();
      return Result;
    };
    this.ToArray = function () {
      var Result = [];
      var LEnumerator = null;
      Result = [];
      LEnumerator = this.GetEnumerator();
      try {
        while (LEnumerator.MoveNext()) Result.push(LEnumerator.DoGetCurrent());
      } finally {
        LEnumerator = rtl.freeLoc(LEnumerator);
      };
      return Result;
    };
  },"TEnumerable<ActnList.TAction>");
  this.$rtti.$MethodVar("TCollectionNotifyEvent<ActnList.TAction>",{init: function () {
      this.procsig = rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["AItem",pas.ActnList.$rtti["TAction"],2],["AAction",$mod.$rtti["TCollectionNotification"]]]);
    }, methodkind: 0});
  rtl.createClass(this,"TCustomArrayHelper$G14",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.Sort = function (AValues, AComparer) {
      this.Sort$1(AValues,AComparer,0,rtl.length(AValues.get()));
    };
    this.Sort$1 = function (AValues, AComparer, AIndex, ACount) {
      if (ACount <= 1) return;
      this.QuickSort(AValues,AIndex,(AIndex + ACount) - 1,AComparer);
    };
    this.BinarySearch$2 = function (AValues, AItem, AFoundIndex, AComparer) {
      var Result = false;
      Result = this.BinarySearch$1(AValues,AItem,AFoundIndex,AComparer,0,rtl.length(AValues));
      return Result;
    };
    this.BinarySearch$3 = function (AValues, AItem, ASearchResult, AComparer) {
      var Result = false;
      Result = this.BinarySearch(AValues,AItem,ASearchResult,AComparer,0,rtl.length(AValues));
      return Result;
    };
  },"TCustomArrayHelper<ActnList.TAction>");
  rtl.createClass(this,"TArrayHelper$G13",this.TCustomArrayHelper$G14,function () {
    this.$initSpec = function () {
    };
    this.QuickSort = function (AValues, ALeft, ARight, AComparer) {
      var I = 0;
      var J = 0;
      var P = null;
      var Q = null;
      if (((ARight - ALeft) <= 0) || (rtl.length(AValues.get()) === 0)) return;
      do {
        I = ALeft;
        J = ARight;
        P = AValues.get()[ALeft + Math.floor((ARight - ALeft) / 2)];
        do {
          while (AComparer.Compare(AValues.get()[I],P) < 0) I += 1;
          while (AComparer.Compare(AValues.get()[J],P) > 0) J -= 1;
          if (I <= J) {
            if (I !== J) {
              Q = AValues.get()[I];
              AValues.get()[I] = AValues.get()[J];
              AValues.get()[J] = Q;
            };
            I += 1;
            J -= 1;
          };
        } while (!(I > J));
        if ((J - ALeft) < (ARight - I)) {
          if (ALeft < J) this.QuickSort(AValues,ALeft,J,AComparer);
          ALeft = I;
        } else {
          if (I < ARight) this.QuickSort(AValues,I,ARight,AComparer);
          ARight = J;
        };
      } while (!(ALeft >= ARight));
    };
    this.BinarySearch = function (AValues, AItem, ASearchResult, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var ilo = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      ilo = imid * imid;
      imid = ilo * imid;
      while (imin < imax) {
        imid = rtl.trunc((imax + imin) / 2);
        ASearchResult.CompareResult = AComparer.Compare(AValues[imid],AItem);
        if (ASearchResult.CompareResult < 0) {
          imin = imid + 1}
         else {
          if (ASearchResult.CompareResult === 0) {
            ASearchResult.FoundIndex = imid;
            ASearchResult.CandidateIndex = imid;
            return true;
          };
          imax = imid;
        };
      };
      Result = imax === imin;
      if (Result) {
        ASearchResult.CompareResult = AComparer.Compare(AValues[imin],AItem);
        ASearchResult.CandidateIndex = imin;
        Result = ASearchResult.CompareResult === 0;
        if (Result) {
          ASearchResult.FoundIndex = imin}
         else ASearchResult.FoundIndex = -1;
      } else {
        ASearchResult.CompareResult = 0;
        ASearchResult.FoundIndex = -1;
        ASearchResult.CandidateIndex = -1;
      };
      return Result;
    };
    this.BinarySearch$1 = function (AValues, AItem, AFoundIndex, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var LCompare = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      while (imin < imax) {
        imid = rtl.trunc((imin + imax) / 2);
        LCompare = AComparer.Compare(AValues[imid],AItem);
        if (LCompare < 0) {
          imin = imid + 1}
         else {
          if (LCompare === 0) {
            AFoundIndex.set(imid);
            return true;
          };
          imax = imid;
        };
      };
      LCompare = AComparer.Compare(AValues[imin],AItem);
      Result = (imax === imin) && (LCompare === 0);
      if (Result) {
        AFoundIndex.set(imin)}
       else AFoundIndex.set(-1);
      return Result;
    };
  },"TArrayHelper<ActnList.TAction>");
  rtl.createClass(this,"TCustomList$G12",this.TEnumerable$G19,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $mod.$rtti.$DynArray("TCustomList<ActnList.TAction>.FItems$a",{eltype: pas.ActnList.$rtti["TAction"]});
    };
    this.$init = function () {
      $mod.TEnumerable$G19.$init.call(this);
      this.FOnNotify = null;
      this.FLength = 0;
      this.FItems = [];
    };
    this.$final = function () {
      this.FOnNotify = undefined;
      this.FItems = undefined;
      $mod.TEnumerable$G19.$final.call(this);
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = rtl.length(this.FItems);
      return Result;
    };
    this.PrepareAddingItem = function () {
      var Result = 0;
      if (this.FLength === rtl.length(this.FItems)) this.FItems.push(null);
      Result = this.FLength;
      this.FLength += 1;
      return Result;
    };
    this.PrepareAddingRange = function (ACount) {
      var Result = 0;
      var l = 0;
      if (ACount < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (ACount === 0) return this.FLength - 1;
      for (var $l = rtl.length(this.FItems) + 1, $end = this.FLength + ACount; $l <= $end; $l++) {
        l = $l;
        this.FItems.push(null);
      };
      Result = this.FLength;
      this.FLength += ACount;
      return Result;
    };
    this.Notify = function (AValue, ACollectionNotification) {
      if (this.FOnNotify != null) this.FOnNotify(this,AValue,ACollectionNotification);
    };
    this.DoRemove = function (AIndex, ACollectionNotification) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      this.FLength -= 1;
      this.FItems[AIndex] = null;
      this.FItems.splice(AIndex,1);
      this.Notify(Result,ACollectionNotification);
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FLength;
      return Result;
    };
  },"TCustomList<ActnList.TAction>");
  rtl.createClass(this,"TCustomListEnumerator$G10",this.TEnumerator$G20,function () {
    this.$initSpec = function () {
    };
    this.$init = function () {
      $mod.TEnumerator$G20.$init.call(this);
      this.FList = null;
      this.FIndex = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      $mod.TEnumerator$G20.$final.call(this);
    };
    this.DoMoveNext = function () {
      var Result = false;
      this.FIndex += 1;
      Result = (this.FList.FLength > 0) && (this.FIndex < this.FList.FLength);
      return Result;
    };
    this.DoGetCurrent = function () {
      var Result = null;
      Result = this.GetCurrent();
      return Result;
    };
    this.GetCurrent = function () {
      var Result = null;
      Result = this.FList.FItems[this.FIndex];
      return Result;
    };
    this.Create$1 = function (AList) {
      pas.System.TObject.Create.call(this);
      this.FIndex = -1;
      this.FList = AList;
      return this;
    };
  },"TCustomListEnumerator<ActnList.TAction>");
  rtl.createClass(this,"TList$G5",this.TCustomList$G12,function () {
    this.$initSpec = function () {
      rtl.createClass(this,"TEnumerator",$mod.TCustomListEnumerator$G10,function () {
      },"TList<ActnList.TAction>.TEnumerator");
    };
    this.$init = function () {
      $mod.TCustomList$G12.$init.call(this);
      this.FComparer = null;
    };
    this.$final = function () {
      rtl.setIntfP(this,"FComparer",null);
      $mod.TCustomList$G12.$final.call(this);
    };
    this.SameValue = function (Left, Right) {
      var Result = false;
      if (this.FComparer != null) {
        Result = this.FComparer.Compare(Left,Right) === 0}
       else Result = Left === Right;
      return Result;
    };
    this.SetCapacity = function (AValue) {
      if (AValue < this.FLength) this.SetCount(AValue);
      this.FItems = rtl.arraySetLength(this.FItems,null,AValue);
    };
    this.SetCount = function (AValue) {
      if (AValue < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (AValue > this.GetCapacity()) {
        this.SetCapacity(AValue)}
       else if (AValue < this.FLength) this.DeleteRange(AValue,this.FLength - AValue);
      this.FLength = AValue;
    };
    this.InitializeList = function () {
    };
    this.InternalInsert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.FItems.splice(AIndex,0,AValue);
      this.FLength += 1;
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.DoGetEnumerator = function () {
      var Result = null;
      Result = this.GetEnumerator$1();
      return Result;
    };
    this.GetItem = function (AIndex) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      return Result;
    };
    this.SetItem = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.Notify(this.FItems[AIndex],$mod.TCollectionNotification.cnRemoved);
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.GetEnumerator$1 = function () {
      var Result = null;
      Result = this.TEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.Create$1 = function () {
      this.InitializeList();
      return this;
    };
    this.Create$2 = function (AComparer) {
      this.InitializeList();
      rtl.setIntfP(this,"FComparer",AComparer);
      return this;
    };
    this.Create$3 = function (ACollection) {
      var LItem = null;
      this.Create$1();
      var $in = ACollection.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LItem = $in.DoGetCurrent();
          this.Add(LItem);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
      return this;
    };
    this.Destroy = function () {
      this.SetCapacity(0);
    };
    this.Add = function (AValue) {
      var Result = 0;
      Result = this.PrepareAddingItem();
      this.FItems[Result] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
      return Result;
    };
    this.AddRange = function (AValues) {
      this.InsertRange(this.FLength,AValues);
    };
    this.AddRange$1 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.Add(LValue);
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.AddRange$2 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.Add(LValue);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Insert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.InternalInsert(AIndex,AValue);
    };
    this.InsertRange = function (AIndex, AValues) {
      var LLength = 0;
      var i = 0;
      var LValue = null;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LLength = rtl.length(AValues);
      if (LLength === 0) return;
      if (AIndex !== this.PrepareAddingRange(LLength)) {
        for (var $l = AIndex, $end = this.FLength - LLength - 1; $l <= $end; $l++) {
          i = $l;
          this.FItems[i + LLength] = this.FItems[i];
        };
        for (var $l1 = 0, $end1 = LLength - 1; $l1 <= $end1; $l1++) {
          i = $l1;
          this.FItems[AIndex + i] = null;
        };
      };
      for (var $l2 = 0, $end2 = LLength - 1; $l2 <= $end2; $l2++) {
        i = $l2;
        LValue = AValues[i];
        this.FItems[i + AIndex] = LValue;
        this.Notify(LValue,$mod.TCollectionNotification.cnAdded);
      };
    };
    this.InsertRange$1 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.InsertRange$2 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Remove = function (AValue) {
      var Result = 0;
      Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.RemoveItem = function (AValue, Direction) {
      var Result = 0;
      if (Direction === $mod.TDirection.fromEnd) {
        Result = this.LastIndexOf(AValue)}
       else Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.Delete = function (AIndex) {
      this.DoRemove(AIndex,$mod.TCollectionNotification.cnRemoved);
    };
    this.DeleteRange = function (AIndex, ACount) {
      var LDeleted = [];
      var i = 0;
      if (ACount === 0) return;
      if ((ACount < 0) || (AIndex < 0) || ((AIndex + ACount) > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LDeleted = this.FItems.splice(AIndex,this.FLength);
      this.FLength -= ACount;
      for (var $l = 0, $end = rtl.length(LDeleted) - 1; $l <= $end; $l++) {
        i = $l;
        this.Notify(LDeleted[i],$mod.TCollectionNotification.cnRemoved);
      };
    };
    this.ExtractIndex = function (AIndex) {
      var Result = null;
      Result = this.DoRemove(AIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Extract = function (AValue) {
      var Result = null;
      var LIndex = 0;
      LIndex = this.IndexOf(AValue);
      if (LIndex < 0) {
        Result = null}
       else Result = this.DoRemove(LIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Exchange = function (AIndex1, AIndex2) {
      var LTemp = null;
      LTemp = this.FItems[AIndex1];
      this.FItems[AIndex1] = this.FItems[AIndex2];
      this.FItems[AIndex2] = LTemp;
    };
    this.Move = function (AIndex, ANewIndex) {
      var Arr = null;
      var LTemp = undefined;
      var i = 0;
      if (ANewIndex === AIndex) return;
      if ((ANewIndex < 0) || (ANewIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Arr = this.FItems;
      LTemp = Arr[AIndex];
      if (AIndex < ANewIndex) {
        for (var $l = AIndex, $end = ANewIndex - 1; $l <= $end; $l++) {
          i = $l;
          Arr[i] = Arr[i + 1];
        }}
       else for (var $l1 = AIndex, $end1 = ANewIndex + 1; $l1 >= $end1; $l1--) {
        i = $l1;
        Arr[i] = Arr[i - 1];
      };
      Arr[ANewIndex] = LTemp;
    };
    this.First = function () {
      var Result = null;
      Result = this.GetItem(0);
      return Result;
    };
    this.Last = function () {
      var Result = null;
      Result = this.GetItem(this.FLength - 1);
      return Result;
    };
    this.Clear = function () {
      this.SetCount(0);
      this.SetCapacity(0);
    };
    this.Contains = function (AValue) {
      var Result = false;
      Result = this.IndexOf(AValue) >= 0;
      return Result;
    };
    this.IndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = 0, $end = this.FLength - 1; $l <= $end; $l++) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.LastIndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = this.FLength - 1; $l >= 0; $l--) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.Reverse = function () {
      var a = 0;
      var b = 0;
      var LTemp = null;
      a = 0;
      b = this.FLength - 1;
      while (a < b) {
        LTemp = this.FItems[a];
        this.FItems[a] = this.FItems[b];
        this.FItems[b] = LTemp;
        a += 1;
        b -= 1;
      };
    };
    this.TrimExcess = function () {
      this.SetCapacity(this.FLength);
    };
    this.Sort = function () {
      $mod.TArrayHelper$G13.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},this.FComparer,0,this.FLength);
    };
    this.Sort$1 = function (AComparer) {
      $mod.TArrayHelper$G13.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},AComparer,0,this.FLength);
    };
    this.BinarySearch = function (AItem, AIndex) {
      var Result = false;
      Result = $mod.TArrayHelper$G13.BinarySearch$1(this.FItems,AItem,AIndex,this.FComparer,0,this.FLength);
      return Result;
    };
    this.BinarySearch$1 = function (AItem, AIndex, AComparer) {
      var Result = false;
      Result = $mod.TArrayHelper$G13.BinarySearch$1(this.FItems,AItem,AIndex,AComparer,0,this.FLength);
      return Result;
    };
  },"TList<ActnList.TAction>");
  rtl.createClass(this,"TEnumerator$G21",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.MoveNext = function () {
      var Result = false;
      Result = this.DoMoveNext();
      return Result;
    };
  },"TEnumerator<Menus.TMenuItem>");
  rtl.createClass(this,"TEnumerable$G20",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = this.DoGetEnumerator();
      return Result;
    };
    this.ToArray = function () {
      var Result = [];
      var LEnumerator = null;
      Result = [];
      LEnumerator = this.GetEnumerator();
      try {
        while (LEnumerator.MoveNext()) Result.push(LEnumerator.DoGetCurrent());
      } finally {
        LEnumerator = rtl.freeLoc(LEnumerator);
      };
      return Result;
    };
  },"TEnumerable<Menus.TMenuItem>");
  this.$rtti.$MethodVar("TCollectionNotifyEvent<Menus.TMenuItem>",{init: function () {
      this.procsig = rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["AItem",pas.Menus.$rtti["TMenuItem"],2],["AAction",$mod.$rtti["TCollectionNotification"]]]);
    }, methodkind: 0});
  rtl.createClass(this,"TCustomArrayHelper$G15",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.Sort = function (AValues, AComparer) {
      this.Sort$1(AValues,AComparer,0,rtl.length(AValues.get()));
    };
    this.Sort$1 = function (AValues, AComparer, AIndex, ACount) {
      if (ACount <= 1) return;
      this.QuickSort(AValues,AIndex,(AIndex + ACount) - 1,AComparer);
    };
    this.BinarySearch$2 = function (AValues, AItem, AFoundIndex, AComparer) {
      var Result = false;
      Result = this.BinarySearch$1(AValues,AItem,AFoundIndex,AComparer,0,rtl.length(AValues));
      return Result;
    };
    this.BinarySearch$3 = function (AValues, AItem, ASearchResult, AComparer) {
      var Result = false;
      Result = this.BinarySearch(AValues,AItem,ASearchResult,AComparer,0,rtl.length(AValues));
      return Result;
    };
  },"TCustomArrayHelper<Menus.TMenuItem>");
  rtl.createClass(this,"TArrayHelper$G14",this.TCustomArrayHelper$G15,function () {
    this.$initSpec = function () {
    };
    this.QuickSort = function (AValues, ALeft, ARight, AComparer) {
      var I = 0;
      var J = 0;
      var P = null;
      var Q = null;
      if (((ARight - ALeft) <= 0) || (rtl.length(AValues.get()) === 0)) return;
      do {
        I = ALeft;
        J = ARight;
        P = AValues.get()[ALeft + Math.floor((ARight - ALeft) / 2)];
        do {
          while (AComparer.Compare(AValues.get()[I],P) < 0) I += 1;
          while (AComparer.Compare(AValues.get()[J],P) > 0) J -= 1;
          if (I <= J) {
            if (I !== J) {
              Q = AValues.get()[I];
              AValues.get()[I] = AValues.get()[J];
              AValues.get()[J] = Q;
            };
            I += 1;
            J -= 1;
          };
        } while (!(I > J));
        if ((J - ALeft) < (ARight - I)) {
          if (ALeft < J) this.QuickSort(AValues,ALeft,J,AComparer);
          ALeft = I;
        } else {
          if (I < ARight) this.QuickSort(AValues,I,ARight,AComparer);
          ARight = J;
        };
      } while (!(ALeft >= ARight));
    };
    this.BinarySearch = function (AValues, AItem, ASearchResult, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var ilo = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      ilo = imid * imid;
      imid = ilo * imid;
      while (imin < imax) {
        imid = rtl.trunc((imax + imin) / 2);
        ASearchResult.CompareResult = AComparer.Compare(AValues[imid],AItem);
        if (ASearchResult.CompareResult < 0) {
          imin = imid + 1}
         else {
          if (ASearchResult.CompareResult === 0) {
            ASearchResult.FoundIndex = imid;
            ASearchResult.CandidateIndex = imid;
            return true;
          };
          imax = imid;
        };
      };
      Result = imax === imin;
      if (Result) {
        ASearchResult.CompareResult = AComparer.Compare(AValues[imin],AItem);
        ASearchResult.CandidateIndex = imin;
        Result = ASearchResult.CompareResult === 0;
        if (Result) {
          ASearchResult.FoundIndex = imin}
         else ASearchResult.FoundIndex = -1;
      } else {
        ASearchResult.CompareResult = 0;
        ASearchResult.FoundIndex = -1;
        ASearchResult.CandidateIndex = -1;
      };
      return Result;
    };
    this.BinarySearch$1 = function (AValues, AItem, AFoundIndex, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var LCompare = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      while (imin < imax) {
        imid = rtl.trunc((imin + imax) / 2);
        LCompare = AComparer.Compare(AValues[imid],AItem);
        if (LCompare < 0) {
          imin = imid + 1}
         else {
          if (LCompare === 0) {
            AFoundIndex.set(imid);
            return true;
          };
          imax = imid;
        };
      };
      LCompare = AComparer.Compare(AValues[imin],AItem);
      Result = (imax === imin) && (LCompare === 0);
      if (Result) {
        AFoundIndex.set(imin)}
       else AFoundIndex.set(-1);
      return Result;
    };
  },"TArrayHelper<Menus.TMenuItem>");
  rtl.createClass(this,"TCustomList$G13",this.TEnumerable$G20,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $mod.$rtti.$DynArray("TCustomList<Menus.TMenuItem>.FItems$a",{eltype: pas.Menus.$rtti["TMenuItem"]});
    };
    this.$init = function () {
      $mod.TEnumerable$G20.$init.call(this);
      this.FOnNotify = null;
      this.FLength = 0;
      this.FItems = [];
    };
    this.$final = function () {
      this.FOnNotify = undefined;
      this.FItems = undefined;
      $mod.TEnumerable$G20.$final.call(this);
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = rtl.length(this.FItems);
      return Result;
    };
    this.PrepareAddingItem = function () {
      var Result = 0;
      if (this.FLength === rtl.length(this.FItems)) this.FItems.push(null);
      Result = this.FLength;
      this.FLength += 1;
      return Result;
    };
    this.PrepareAddingRange = function (ACount) {
      var Result = 0;
      var l = 0;
      if (ACount < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (ACount === 0) return this.FLength - 1;
      for (var $l = rtl.length(this.FItems) + 1, $end = this.FLength + ACount; $l <= $end; $l++) {
        l = $l;
        this.FItems.push(null);
      };
      Result = this.FLength;
      this.FLength += ACount;
      return Result;
    };
    this.Notify = function (AValue, ACollectionNotification) {
      if (this.FOnNotify != null) this.FOnNotify(this,AValue,ACollectionNotification);
    };
    this.DoRemove = function (AIndex, ACollectionNotification) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      this.FLength -= 1;
      this.FItems[AIndex] = null;
      this.FItems.splice(AIndex,1);
      this.Notify(Result,ACollectionNotification);
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FLength;
      return Result;
    };
  },"TCustomList<Menus.TMenuItem>");
  rtl.createClass(this,"TCustomListEnumerator$G11",this.TEnumerator$G21,function () {
    this.$initSpec = function () {
    };
    this.$init = function () {
      $mod.TEnumerator$G21.$init.call(this);
      this.FList = null;
      this.FIndex = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      $mod.TEnumerator$G21.$final.call(this);
    };
    this.DoMoveNext = function () {
      var Result = false;
      this.FIndex += 1;
      Result = (this.FList.FLength > 0) && (this.FIndex < this.FList.FLength);
      return Result;
    };
    this.DoGetCurrent = function () {
      var Result = null;
      Result = this.GetCurrent();
      return Result;
    };
    this.GetCurrent = function () {
      var Result = null;
      Result = this.FList.FItems[this.FIndex];
      return Result;
    };
    this.Create$1 = function (AList) {
      pas.System.TObject.Create.call(this);
      this.FIndex = -1;
      this.FList = AList;
      return this;
    };
  },"TCustomListEnumerator<Menus.TMenuItem>");
  rtl.createClass(this,"TList$G6",this.TCustomList$G13,function () {
    this.$initSpec = function () {
      rtl.createClass(this,"TEnumerator",$mod.TCustomListEnumerator$G11,function () {
      },"TList<Menus.TMenuItem>.TEnumerator");
    };
    this.$init = function () {
      $mod.TCustomList$G13.$init.call(this);
      this.FComparer = null;
    };
    this.$final = function () {
      rtl.setIntfP(this,"FComparer",null);
      $mod.TCustomList$G13.$final.call(this);
    };
    this.SameValue = function (Left, Right) {
      var Result = false;
      if (this.FComparer != null) {
        Result = this.FComparer.Compare(Left,Right) === 0}
       else Result = Left === Right;
      return Result;
    };
    this.SetCapacity = function (AValue) {
      if (AValue < this.FLength) this.SetCount(AValue);
      this.FItems = rtl.arraySetLength(this.FItems,null,AValue);
    };
    this.SetCount = function (AValue) {
      if (AValue < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (AValue > this.GetCapacity()) {
        this.SetCapacity(AValue)}
       else if (AValue < this.FLength) this.DeleteRange(AValue,this.FLength - AValue);
      this.FLength = AValue;
    };
    this.InitializeList = function () {
    };
    this.InternalInsert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.FItems.splice(AIndex,0,AValue);
      this.FLength += 1;
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.DoGetEnumerator = function () {
      var Result = null;
      Result = this.GetEnumerator$1();
      return Result;
    };
    this.GetItem = function (AIndex) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      return Result;
    };
    this.SetItem = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.Notify(this.FItems[AIndex],$mod.TCollectionNotification.cnRemoved);
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.GetEnumerator$1 = function () {
      var Result = null;
      Result = this.TEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.Create$1 = function () {
      this.InitializeList();
      return this;
    };
    this.Create$2 = function (AComparer) {
      this.InitializeList();
      rtl.setIntfP(this,"FComparer",AComparer);
      return this;
    };
    this.Create$3 = function (ACollection) {
      var LItem = null;
      this.Create$1();
      var $in = ACollection.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LItem = $in.DoGetCurrent();
          this.Add(LItem);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
      return this;
    };
    this.Destroy = function () {
      this.SetCapacity(0);
    };
    this.Add = function (AValue) {
      var Result = 0;
      Result = this.PrepareAddingItem();
      this.FItems[Result] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
      return Result;
    };
    this.AddRange = function (AValues) {
      this.InsertRange(this.FLength,AValues);
    };
    this.AddRange$1 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.Add(LValue);
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.AddRange$2 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.Add(LValue);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Insert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.InternalInsert(AIndex,AValue);
    };
    this.InsertRange = function (AIndex, AValues) {
      var LLength = 0;
      var i = 0;
      var LValue = null;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LLength = rtl.length(AValues);
      if (LLength === 0) return;
      if (AIndex !== this.PrepareAddingRange(LLength)) {
        for (var $l = AIndex, $end = this.FLength - LLength - 1; $l <= $end; $l++) {
          i = $l;
          this.FItems[i + LLength] = this.FItems[i];
        };
        for (var $l1 = 0, $end1 = LLength - 1; $l1 <= $end1; $l1++) {
          i = $l1;
          this.FItems[AIndex + i] = null;
        };
      };
      for (var $l2 = 0, $end2 = LLength - 1; $l2 <= $end2; $l2++) {
        i = $l2;
        LValue = AValues[i];
        this.FItems[i + AIndex] = LValue;
        this.Notify(LValue,$mod.TCollectionNotification.cnAdded);
      };
    };
    this.InsertRange$1 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.InsertRange$2 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Remove = function (AValue) {
      var Result = 0;
      Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.RemoveItem = function (AValue, Direction) {
      var Result = 0;
      if (Direction === $mod.TDirection.fromEnd) {
        Result = this.LastIndexOf(AValue)}
       else Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.Delete = function (AIndex) {
      this.DoRemove(AIndex,$mod.TCollectionNotification.cnRemoved);
    };
    this.DeleteRange = function (AIndex, ACount) {
      var LDeleted = [];
      var i = 0;
      if (ACount === 0) return;
      if ((ACount < 0) || (AIndex < 0) || ((AIndex + ACount) > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LDeleted = this.FItems.splice(AIndex,this.FLength);
      this.FLength -= ACount;
      for (var $l = 0, $end = rtl.length(LDeleted) - 1; $l <= $end; $l++) {
        i = $l;
        this.Notify(LDeleted[i],$mod.TCollectionNotification.cnRemoved);
      };
    };
    this.ExtractIndex = function (AIndex) {
      var Result = null;
      Result = this.DoRemove(AIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Extract = function (AValue) {
      var Result = null;
      var LIndex = 0;
      LIndex = this.IndexOf(AValue);
      if (LIndex < 0) {
        Result = null}
       else Result = this.DoRemove(LIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Exchange = function (AIndex1, AIndex2) {
      var LTemp = null;
      LTemp = this.FItems[AIndex1];
      this.FItems[AIndex1] = this.FItems[AIndex2];
      this.FItems[AIndex2] = LTemp;
    };
    this.Move = function (AIndex, ANewIndex) {
      var Arr = null;
      var LTemp = undefined;
      var i = 0;
      if (ANewIndex === AIndex) return;
      if ((ANewIndex < 0) || (ANewIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Arr = this.FItems;
      LTemp = Arr[AIndex];
      if (AIndex < ANewIndex) {
        for (var $l = AIndex, $end = ANewIndex - 1; $l <= $end; $l++) {
          i = $l;
          Arr[i] = Arr[i + 1];
        }}
       else for (var $l1 = AIndex, $end1 = ANewIndex + 1; $l1 >= $end1; $l1--) {
        i = $l1;
        Arr[i] = Arr[i - 1];
      };
      Arr[ANewIndex] = LTemp;
    };
    this.First = function () {
      var Result = null;
      Result = this.GetItem(0);
      return Result;
    };
    this.Last = function () {
      var Result = null;
      Result = this.GetItem(this.FLength - 1);
      return Result;
    };
    this.Clear = function () {
      this.SetCount(0);
      this.SetCapacity(0);
    };
    this.Contains = function (AValue) {
      var Result = false;
      Result = this.IndexOf(AValue) >= 0;
      return Result;
    };
    this.IndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = 0, $end = this.FLength - 1; $l <= $end; $l++) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.LastIndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = this.FLength - 1; $l >= 0; $l--) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.Reverse = function () {
      var a = 0;
      var b = 0;
      var LTemp = null;
      a = 0;
      b = this.FLength - 1;
      while (a < b) {
        LTemp = this.FItems[a];
        this.FItems[a] = this.FItems[b];
        this.FItems[b] = LTemp;
        a += 1;
        b -= 1;
      };
    };
    this.TrimExcess = function () {
      this.SetCapacity(this.FLength);
    };
    this.Sort = function () {
      $mod.TArrayHelper$G14.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},this.FComparer,0,this.FLength);
    };
    this.Sort$1 = function (AComparer) {
      $mod.TArrayHelper$G14.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},AComparer,0,this.FLength);
    };
    this.BinarySearch = function (AItem, AIndex) {
      var Result = false;
      Result = $mod.TArrayHelper$G14.BinarySearch$1(this.FItems,AItem,AIndex,this.FComparer,0,this.FLength);
      return Result;
    };
    this.BinarySearch$1 = function (AItem, AIndex, AComparer) {
      var Result = false;
      Result = $mod.TArrayHelper$G14.BinarySearch$1(this.FItems,AItem,AIndex,AComparer,0,this.FLength);
      return Result;
    };
  },"TList<Menus.TMenuItem>");
  rtl.createClass(this,"TEnumerator$G22",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.MoveNext = function () {
      var Result = false;
      Result = this.DoMoveNext();
      return Result;
    };
  },"TEnumerator<ComCtrls.TTreeNode>");
  rtl.createClass(this,"TEnumerable$G21",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = this.DoGetEnumerator();
      return Result;
    };
    this.ToArray = function () {
      var Result = [];
      var LEnumerator = null;
      Result = [];
      LEnumerator = this.GetEnumerator();
      try {
        while (LEnumerator.MoveNext()) Result.push(LEnumerator.DoGetCurrent());
      } finally {
        LEnumerator = rtl.freeLoc(LEnumerator);
      };
      return Result;
    };
  },"TEnumerable<ComCtrls.TTreeNode>");
  this.$rtti.$MethodVar("TCollectionNotifyEvent<ComCtrls.TTreeNode>",{init: function () {
      this.procsig = rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["AItem",pas.ComCtrls.$rtti["TTreeNode"],2],["AAction",$mod.$rtti["TCollectionNotification"]]]);
    }, methodkind: 0});
  rtl.createClass(this,"TCustomArrayHelper$G16",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.Sort = function (AValues, AComparer) {
      this.Sort$1(AValues,AComparer,0,rtl.length(AValues.get()));
    };
    this.Sort$1 = function (AValues, AComparer, AIndex, ACount) {
      if (ACount <= 1) return;
      this.QuickSort(AValues,AIndex,(AIndex + ACount) - 1,AComparer);
    };
    this.BinarySearch$2 = function (AValues, AItem, AFoundIndex, AComparer) {
      var Result = false;
      Result = this.BinarySearch$1(AValues,AItem,AFoundIndex,AComparer,0,rtl.length(AValues));
      return Result;
    };
    this.BinarySearch$3 = function (AValues, AItem, ASearchResult, AComparer) {
      var Result = false;
      Result = this.BinarySearch(AValues,AItem,ASearchResult,AComparer,0,rtl.length(AValues));
      return Result;
    };
  },"TCustomArrayHelper<ComCtrls.TTreeNode>");
  rtl.createClass(this,"TArrayHelper$G15",this.TCustomArrayHelper$G16,function () {
    this.$initSpec = function () {
    };
    this.QuickSort = function (AValues, ALeft, ARight, AComparer) {
      var I = 0;
      var J = 0;
      var P = null;
      var Q = null;
      if (((ARight - ALeft) <= 0) || (rtl.length(AValues.get()) === 0)) return;
      do {
        I = ALeft;
        J = ARight;
        P = AValues.get()[ALeft + Math.floor((ARight - ALeft) / 2)];
        do {
          while (AComparer.Compare(AValues.get()[I],P) < 0) I += 1;
          while (AComparer.Compare(AValues.get()[J],P) > 0) J -= 1;
          if (I <= J) {
            if (I !== J) {
              Q = AValues.get()[I];
              AValues.get()[I] = AValues.get()[J];
              AValues.get()[J] = Q;
            };
            I += 1;
            J -= 1;
          };
        } while (!(I > J));
        if ((J - ALeft) < (ARight - I)) {
          if (ALeft < J) this.QuickSort(AValues,ALeft,J,AComparer);
          ALeft = I;
        } else {
          if (I < ARight) this.QuickSort(AValues,I,ARight,AComparer);
          ARight = J;
        };
      } while (!(ALeft >= ARight));
    };
    this.BinarySearch = function (AValues, AItem, ASearchResult, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var ilo = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      ilo = imid * imid;
      imid = ilo * imid;
      while (imin < imax) {
        imid = rtl.trunc((imax + imin) / 2);
        ASearchResult.CompareResult = AComparer.Compare(AValues[imid],AItem);
        if (ASearchResult.CompareResult < 0) {
          imin = imid + 1}
         else {
          if (ASearchResult.CompareResult === 0) {
            ASearchResult.FoundIndex = imid;
            ASearchResult.CandidateIndex = imid;
            return true;
          };
          imax = imid;
        };
      };
      Result = imax === imin;
      if (Result) {
        ASearchResult.CompareResult = AComparer.Compare(AValues[imin],AItem);
        ASearchResult.CandidateIndex = imin;
        Result = ASearchResult.CompareResult === 0;
        if (Result) {
          ASearchResult.FoundIndex = imin}
         else ASearchResult.FoundIndex = -1;
      } else {
        ASearchResult.CompareResult = 0;
        ASearchResult.FoundIndex = -1;
        ASearchResult.CandidateIndex = -1;
      };
      return Result;
    };
    this.BinarySearch$1 = function (AValues, AItem, AFoundIndex, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var LCompare = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      while (imin < imax) {
        imid = rtl.trunc((imin + imax) / 2);
        LCompare = AComparer.Compare(AValues[imid],AItem);
        if (LCompare < 0) {
          imin = imid + 1}
         else {
          if (LCompare === 0) {
            AFoundIndex.set(imid);
            return true;
          };
          imax = imid;
        };
      };
      LCompare = AComparer.Compare(AValues[imin],AItem);
      Result = (imax === imin) && (LCompare === 0);
      if (Result) {
        AFoundIndex.set(imin)}
       else AFoundIndex.set(-1);
      return Result;
    };
  },"TArrayHelper<ComCtrls.TTreeNode>");
  rtl.createClass(this,"TCustomList$G14",this.TEnumerable$G21,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $mod.$rtti.$DynArray("TCustomList<ComCtrls.TTreeNode>.FItems$a",{eltype: pas.ComCtrls.$rtti["TTreeNode"]});
    };
    this.$init = function () {
      $mod.TEnumerable$G21.$init.call(this);
      this.FOnNotify = null;
      this.FLength = 0;
      this.FItems = [];
    };
    this.$final = function () {
      this.FOnNotify = undefined;
      this.FItems = undefined;
      $mod.TEnumerable$G21.$final.call(this);
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = rtl.length(this.FItems);
      return Result;
    };
    this.PrepareAddingItem = function () {
      var Result = 0;
      if (this.FLength === rtl.length(this.FItems)) this.FItems.push(null);
      Result = this.FLength;
      this.FLength += 1;
      return Result;
    };
    this.PrepareAddingRange = function (ACount) {
      var Result = 0;
      var l = 0;
      if (ACount < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (ACount === 0) return this.FLength - 1;
      for (var $l = rtl.length(this.FItems) + 1, $end = this.FLength + ACount; $l <= $end; $l++) {
        l = $l;
        this.FItems.push(null);
      };
      Result = this.FLength;
      this.FLength += ACount;
      return Result;
    };
    this.Notify = function (AValue, ACollectionNotification) {
      if (this.FOnNotify != null) this.FOnNotify(this,AValue,ACollectionNotification);
    };
    this.DoRemove = function (AIndex, ACollectionNotification) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      this.FLength -= 1;
      this.FItems[AIndex] = null;
      this.FItems.splice(AIndex,1);
      this.Notify(Result,ACollectionNotification);
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FLength;
      return Result;
    };
  },"TCustomList<ComCtrls.TTreeNode>");
  rtl.createClass(this,"TCustomListEnumerator$G12",this.TEnumerator$G22,function () {
    this.$initSpec = function () {
    };
    this.$init = function () {
      $mod.TEnumerator$G22.$init.call(this);
      this.FList = null;
      this.FIndex = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      $mod.TEnumerator$G22.$final.call(this);
    };
    this.DoMoveNext = function () {
      var Result = false;
      this.FIndex += 1;
      Result = (this.FList.FLength > 0) && (this.FIndex < this.FList.FLength);
      return Result;
    };
    this.DoGetCurrent = function () {
      var Result = null;
      Result = this.GetCurrent();
      return Result;
    };
    this.GetCurrent = function () {
      var Result = null;
      Result = this.FList.FItems[this.FIndex];
      return Result;
    };
    this.Create$1 = function (AList) {
      pas.System.TObject.Create.call(this);
      this.FIndex = -1;
      this.FList = AList;
      return this;
    };
  },"TCustomListEnumerator<ComCtrls.TTreeNode>");
  rtl.createClass(this,"TList$G7",this.TCustomList$G14,function () {
    this.$initSpec = function () {
      rtl.createClass(this,"TEnumerator",$mod.TCustomListEnumerator$G12,function () {
      },"TList<ComCtrls.TTreeNode>.TEnumerator");
    };
    this.$init = function () {
      $mod.TCustomList$G14.$init.call(this);
      this.FComparer = null;
    };
    this.$final = function () {
      rtl.setIntfP(this,"FComparer",null);
      $mod.TCustomList$G14.$final.call(this);
    };
    this.SameValue = function (Left, Right) {
      var Result = false;
      if (this.FComparer != null) {
        Result = this.FComparer.Compare(Left,Right) === 0}
       else Result = Left === Right;
      return Result;
    };
    this.SetCapacity = function (AValue) {
      if (AValue < this.FLength) this.SetCount(AValue);
      this.FItems = rtl.arraySetLength(this.FItems,null,AValue);
    };
    this.SetCount = function (AValue) {
      if (AValue < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (AValue > this.GetCapacity()) {
        this.SetCapacity(AValue)}
       else if (AValue < this.FLength) this.DeleteRange(AValue,this.FLength - AValue);
      this.FLength = AValue;
    };
    this.InitializeList = function () {
    };
    this.InternalInsert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.FItems.splice(AIndex,0,AValue);
      this.FLength += 1;
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.DoGetEnumerator = function () {
      var Result = null;
      Result = this.GetEnumerator$1();
      return Result;
    };
    this.GetItem = function (AIndex) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      return Result;
    };
    this.SetItem = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.Notify(this.FItems[AIndex],$mod.TCollectionNotification.cnRemoved);
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.GetEnumerator$1 = function () {
      var Result = null;
      Result = this.TEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.Create$1 = function () {
      this.InitializeList();
      return this;
    };
    this.Create$2 = function (AComparer) {
      this.InitializeList();
      rtl.setIntfP(this,"FComparer",AComparer);
      return this;
    };
    this.Create$3 = function (ACollection) {
      var LItem = null;
      this.Create$1();
      var $in = ACollection.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LItem = $in.DoGetCurrent();
          this.Add(LItem);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
      return this;
    };
    this.Destroy = function () {
      this.SetCapacity(0);
    };
    this.Add = function (AValue) {
      var Result = 0;
      Result = this.PrepareAddingItem();
      this.FItems[Result] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
      return Result;
    };
    this.AddRange = function (AValues) {
      this.InsertRange(this.FLength,AValues);
    };
    this.AddRange$1 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.Add(LValue);
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.AddRange$2 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.Add(LValue);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Insert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.InternalInsert(AIndex,AValue);
    };
    this.InsertRange = function (AIndex, AValues) {
      var LLength = 0;
      var i = 0;
      var LValue = null;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LLength = rtl.length(AValues);
      if (LLength === 0) return;
      if (AIndex !== this.PrepareAddingRange(LLength)) {
        for (var $l = AIndex, $end = this.FLength - LLength - 1; $l <= $end; $l++) {
          i = $l;
          this.FItems[i + LLength] = this.FItems[i];
        };
        for (var $l1 = 0, $end1 = LLength - 1; $l1 <= $end1; $l1++) {
          i = $l1;
          this.FItems[AIndex + i] = null;
        };
      };
      for (var $l2 = 0, $end2 = LLength - 1; $l2 <= $end2; $l2++) {
        i = $l2;
        LValue = AValues[i];
        this.FItems[i + AIndex] = LValue;
        this.Notify(LValue,$mod.TCollectionNotification.cnAdded);
      };
    };
    this.InsertRange$1 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.InsertRange$2 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Remove = function (AValue) {
      var Result = 0;
      Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.RemoveItem = function (AValue, Direction) {
      var Result = 0;
      if (Direction === $mod.TDirection.fromEnd) {
        Result = this.LastIndexOf(AValue)}
       else Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.Delete = function (AIndex) {
      this.DoRemove(AIndex,$mod.TCollectionNotification.cnRemoved);
    };
    this.DeleteRange = function (AIndex, ACount) {
      var LDeleted = [];
      var i = 0;
      if (ACount === 0) return;
      if ((ACount < 0) || (AIndex < 0) || ((AIndex + ACount) > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LDeleted = this.FItems.splice(AIndex,this.FLength);
      this.FLength -= ACount;
      for (var $l = 0, $end = rtl.length(LDeleted) - 1; $l <= $end; $l++) {
        i = $l;
        this.Notify(LDeleted[i],$mod.TCollectionNotification.cnRemoved);
      };
    };
    this.ExtractIndex = function (AIndex) {
      var Result = null;
      Result = this.DoRemove(AIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Extract = function (AValue) {
      var Result = null;
      var LIndex = 0;
      LIndex = this.IndexOf(AValue);
      if (LIndex < 0) {
        Result = null}
       else Result = this.DoRemove(LIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Exchange = function (AIndex1, AIndex2) {
      var LTemp = null;
      LTemp = this.FItems[AIndex1];
      this.FItems[AIndex1] = this.FItems[AIndex2];
      this.FItems[AIndex2] = LTemp;
    };
    this.Move = function (AIndex, ANewIndex) {
      var Arr = null;
      var LTemp = undefined;
      var i = 0;
      if (ANewIndex === AIndex) return;
      if ((ANewIndex < 0) || (ANewIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Arr = this.FItems;
      LTemp = Arr[AIndex];
      if (AIndex < ANewIndex) {
        for (var $l = AIndex, $end = ANewIndex - 1; $l <= $end; $l++) {
          i = $l;
          Arr[i] = Arr[i + 1];
        }}
       else for (var $l1 = AIndex, $end1 = ANewIndex + 1; $l1 >= $end1; $l1--) {
        i = $l1;
        Arr[i] = Arr[i - 1];
      };
      Arr[ANewIndex] = LTemp;
    };
    this.First = function () {
      var Result = null;
      Result = this.GetItem(0);
      return Result;
    };
    this.Last = function () {
      var Result = null;
      Result = this.GetItem(this.FLength - 1);
      return Result;
    };
    this.Clear = function () {
      this.SetCount(0);
      this.SetCapacity(0);
    };
    this.Contains = function (AValue) {
      var Result = false;
      Result = this.IndexOf(AValue) >= 0;
      return Result;
    };
    this.IndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = 0, $end = this.FLength - 1; $l <= $end; $l++) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.LastIndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = this.FLength - 1; $l >= 0; $l--) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.Reverse = function () {
      var a = 0;
      var b = 0;
      var LTemp = null;
      a = 0;
      b = this.FLength - 1;
      while (a < b) {
        LTemp = this.FItems[a];
        this.FItems[a] = this.FItems[b];
        this.FItems[b] = LTemp;
        a += 1;
        b -= 1;
      };
    };
    this.TrimExcess = function () {
      this.SetCapacity(this.FLength);
    };
    this.Sort = function () {
      $mod.TArrayHelper$G15.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},this.FComparer,0,this.FLength);
    };
    this.Sort$1 = function (AComparer) {
      $mod.TArrayHelper$G15.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},AComparer,0,this.FLength);
    };
    this.BinarySearch = function (AItem, AIndex) {
      var Result = false;
      Result = $mod.TArrayHelper$G15.BinarySearch$1(this.FItems,AItem,AIndex,this.FComparer,0,this.FLength);
      return Result;
    };
    this.BinarySearch$1 = function (AItem, AIndex, AComparer) {
      var Result = false;
      Result = $mod.TArrayHelper$G15.BinarySearch$1(this.FItems,AItem,AIndex,AComparer,0,this.FLength);
      return Result;
    };
  },"TList<ComCtrls.TTreeNode>");
  rtl.createClass(this,"TEnumerator$G23",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.MoveNext = function () {
      var Result = false;
      Result = this.DoMoveNext();
      return Result;
    };
  },"TEnumerator<ComCtrls.TListItem>");
  rtl.createClass(this,"TEnumerable$G22",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = this.DoGetEnumerator();
      return Result;
    };
    this.ToArray = function () {
      var Result = [];
      var LEnumerator = null;
      Result = [];
      LEnumerator = this.GetEnumerator();
      try {
        while (LEnumerator.MoveNext()) Result.push(LEnumerator.DoGetCurrent());
      } finally {
        LEnumerator = rtl.freeLoc(LEnumerator);
      };
      return Result;
    };
  },"TEnumerable<ComCtrls.TListItem>");
  this.$rtti.$MethodVar("TCollectionNotifyEvent<ComCtrls.TListItem>",{init: function () {
      this.procsig = rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["AItem",pas.ComCtrls.$rtti["TListItem"],2],["AAction",$mod.$rtti["TCollectionNotification"]]]);
    }, methodkind: 0});
  rtl.createClass(this,"TCustomArrayHelper$G17",pas.System.TObject,function () {
    this.$initSpec = function () {
    };
    this.Sort = function (AValues, AComparer) {
      this.Sort$1(AValues,AComparer,0,rtl.length(AValues.get()));
    };
    this.Sort$1 = function (AValues, AComparer, AIndex, ACount) {
      if (ACount <= 1) return;
      this.QuickSort(AValues,AIndex,(AIndex + ACount) - 1,AComparer);
    };
    this.BinarySearch$2 = function (AValues, AItem, AFoundIndex, AComparer) {
      var Result = false;
      Result = this.BinarySearch$1(AValues,AItem,AFoundIndex,AComparer,0,rtl.length(AValues));
      return Result;
    };
    this.BinarySearch$3 = function (AValues, AItem, ASearchResult, AComparer) {
      var Result = false;
      Result = this.BinarySearch(AValues,AItem,ASearchResult,AComparer,0,rtl.length(AValues));
      return Result;
    };
  },"TCustomArrayHelper<ComCtrls.TListItem>");
  rtl.createClass(this,"TArrayHelper$G16",this.TCustomArrayHelper$G17,function () {
    this.$initSpec = function () {
    };
    this.QuickSort = function (AValues, ALeft, ARight, AComparer) {
      var I = 0;
      var J = 0;
      var P = null;
      var Q = null;
      if (((ARight - ALeft) <= 0) || (rtl.length(AValues.get()) === 0)) return;
      do {
        I = ALeft;
        J = ARight;
        P = AValues.get()[ALeft + Math.floor((ARight - ALeft) / 2)];
        do {
          while (AComparer.Compare(AValues.get()[I],P) < 0) I += 1;
          while (AComparer.Compare(AValues.get()[J],P) > 0) J -= 1;
          if (I <= J) {
            if (I !== J) {
              Q = AValues.get()[I];
              AValues.get()[I] = AValues.get()[J];
              AValues.get()[J] = Q;
            };
            I += 1;
            J -= 1;
          };
        } while (!(I > J));
        if ((J - ALeft) < (ARight - I)) {
          if (ALeft < J) this.QuickSort(AValues,ALeft,J,AComparer);
          ALeft = I;
        } else {
          if (I < ARight) this.QuickSort(AValues,I,ARight,AComparer);
          ARight = J;
        };
      } while (!(ALeft >= ARight));
    };
    this.BinarySearch = function (AValues, AItem, ASearchResult, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var ilo = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      ilo = imid * imid;
      imid = ilo * imid;
      while (imin < imax) {
        imid = rtl.trunc((imax + imin) / 2);
        ASearchResult.CompareResult = AComparer.Compare(AValues[imid],AItem);
        if (ASearchResult.CompareResult < 0) {
          imin = imid + 1}
         else {
          if (ASearchResult.CompareResult === 0) {
            ASearchResult.FoundIndex = imid;
            ASearchResult.CandidateIndex = imid;
            return true;
          };
          imax = imid;
        };
      };
      Result = imax === imin;
      if (Result) {
        ASearchResult.CompareResult = AComparer.Compare(AValues[imin],AItem);
        ASearchResult.CandidateIndex = imin;
        Result = ASearchResult.CompareResult === 0;
        if (Result) {
          ASearchResult.FoundIndex = imin}
         else ASearchResult.FoundIndex = -1;
      } else {
        ASearchResult.CompareResult = 0;
        ASearchResult.FoundIndex = -1;
        ASearchResult.CandidateIndex = -1;
      };
      return Result;
    };
    this.BinarySearch$1 = function (AValues, AItem, AFoundIndex, AComparer, AIndex, ACount) {
      var Result = false;
      var imin = 0;
      var imax = 0;
      var imid = 0;
      var LCompare = 0;
      imin = AIndex;
      imax = (AIndex + ACount) - 1;
      while (imin < imax) {
        imid = rtl.trunc((imin + imax) / 2);
        LCompare = AComparer.Compare(AValues[imid],AItem);
        if (LCompare < 0) {
          imin = imid + 1}
         else {
          if (LCompare === 0) {
            AFoundIndex.set(imid);
            return true;
          };
          imax = imid;
        };
      };
      LCompare = AComparer.Compare(AValues[imin],AItem);
      Result = (imax === imin) && (LCompare === 0);
      if (Result) {
        AFoundIndex.set(imin)}
       else AFoundIndex.set(-1);
      return Result;
    };
  },"TArrayHelper<ComCtrls.TListItem>");
  rtl.createClass(this,"TCustomList$G15",this.TEnumerable$G22,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $mod.$rtti.$DynArray("TCustomList<ComCtrls.TListItem>.FItems$a",{eltype: pas.ComCtrls.$rtti["TListItem"]});
    };
    this.$init = function () {
      $mod.TEnumerable$G22.$init.call(this);
      this.FOnNotify = null;
      this.FLength = 0;
      this.FItems = [];
    };
    this.$final = function () {
      this.FOnNotify = undefined;
      this.FItems = undefined;
      $mod.TEnumerable$G22.$final.call(this);
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = rtl.length(this.FItems);
      return Result;
    };
    this.PrepareAddingItem = function () {
      var Result = 0;
      if (this.FLength === rtl.length(this.FItems)) this.FItems.push(null);
      Result = this.FLength;
      this.FLength += 1;
      return Result;
    };
    this.PrepareAddingRange = function (ACount) {
      var Result = 0;
      var l = 0;
      if (ACount < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (ACount === 0) return this.FLength - 1;
      for (var $l = rtl.length(this.FItems) + 1, $end = this.FLength + ACount; $l <= $end; $l++) {
        l = $l;
        this.FItems.push(null);
      };
      Result = this.FLength;
      this.FLength += ACount;
      return Result;
    };
    this.Notify = function (AValue, ACollectionNotification) {
      if (this.FOnNotify != null) this.FOnNotify(this,AValue,ACollectionNotification);
    };
    this.DoRemove = function (AIndex, ACollectionNotification) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      this.FLength -= 1;
      this.FItems[AIndex] = null;
      this.FItems.splice(AIndex,1);
      this.Notify(Result,ACollectionNotification);
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FLength;
      return Result;
    };
  },"TCustomList<ComCtrls.TListItem>");
  rtl.createClass(this,"TCustomListEnumerator$G13",this.TEnumerator$G23,function () {
    this.$initSpec = function () {
    };
    this.$init = function () {
      $mod.TEnumerator$G23.$init.call(this);
      this.FList = null;
      this.FIndex = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      $mod.TEnumerator$G23.$final.call(this);
    };
    this.DoMoveNext = function () {
      var Result = false;
      this.FIndex += 1;
      Result = (this.FList.FLength > 0) && (this.FIndex < this.FList.FLength);
      return Result;
    };
    this.DoGetCurrent = function () {
      var Result = null;
      Result = this.GetCurrent();
      return Result;
    };
    this.GetCurrent = function () {
      var Result = null;
      Result = this.FList.FItems[this.FIndex];
      return Result;
    };
    this.Create$1 = function (AList) {
      pas.System.TObject.Create.call(this);
      this.FIndex = -1;
      this.FList = AList;
      return this;
    };
  },"TCustomListEnumerator<ComCtrls.TListItem>");
  rtl.createClass(this,"TList$G8",this.TCustomList$G15,function () {
    this.$initSpec = function () {
      rtl.createClass(this,"TEnumerator",$mod.TCustomListEnumerator$G13,function () {
      },"TList<ComCtrls.TListItem>.TEnumerator");
    };
    this.$init = function () {
      $mod.TCustomList$G15.$init.call(this);
      this.FComparer = null;
    };
    this.$final = function () {
      rtl.setIntfP(this,"FComparer",null);
      $mod.TCustomList$G15.$final.call(this);
    };
    this.SameValue = function (Left, Right) {
      var Result = false;
      if (this.FComparer != null) {
        Result = this.FComparer.Compare(Left,Right) === 0}
       else Result = Left === Right;
      return Result;
    };
    this.SetCapacity = function (AValue) {
      if (AValue < this.FLength) this.SetCount(AValue);
      this.FItems = rtl.arraySetLength(this.FItems,null,AValue);
    };
    this.SetCount = function (AValue) {
      if (AValue < 0) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      if (AValue > this.GetCapacity()) {
        this.SetCapacity(AValue)}
       else if (AValue < this.FLength) this.DeleteRange(AValue,this.FLength - AValue);
      this.FLength = AValue;
    };
    this.InitializeList = function () {
    };
    this.InternalInsert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.FItems.splice(AIndex,0,AValue);
      this.FLength += 1;
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.DoGetEnumerator = function () {
      var Result = null;
      Result = this.GetEnumerator$1();
      return Result;
    };
    this.GetItem = function (AIndex) {
      var Result = null;
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Result = this.FItems[AIndex];
      return Result;
    };
    this.SetItem = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.Notify(this.FItems[AIndex],$mod.TCollectionNotification.cnRemoved);
      this.FItems[AIndex] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
    };
    this.GetEnumerator$1 = function () {
      var Result = null;
      Result = this.TEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.Create$1 = function () {
      this.InitializeList();
      return this;
    };
    this.Create$2 = function (AComparer) {
      this.InitializeList();
      rtl.setIntfP(this,"FComparer",AComparer);
      return this;
    };
    this.Create$3 = function (ACollection) {
      var LItem = null;
      this.Create$1();
      var $in = ACollection.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LItem = $in.DoGetCurrent();
          this.Add(LItem);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
      return this;
    };
    this.Destroy = function () {
      this.SetCapacity(0);
    };
    this.Add = function (AValue) {
      var Result = 0;
      Result = this.PrepareAddingItem();
      this.FItems[Result] = AValue;
      this.Notify(AValue,$mod.TCollectionNotification.cnAdded);
      return Result;
    };
    this.AddRange = function (AValues) {
      this.InsertRange(this.FLength,AValues);
    };
    this.AddRange$1 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.Add(LValue);
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.AddRange$2 = function (AEnumerable) {
      var LValue = null;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.Add(LValue);
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Insert = function (AIndex, AValue) {
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      this.InternalInsert(AIndex,AValue);
    };
    this.InsertRange = function (AIndex, AValues) {
      var LLength = 0;
      var i = 0;
      var LValue = null;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LLength = rtl.length(AValues);
      if (LLength === 0) return;
      if (AIndex !== this.PrepareAddingRange(LLength)) {
        for (var $l = AIndex, $end = this.FLength - LLength - 1; $l <= $end; $l++) {
          i = $l;
          this.FItems[i + LLength] = this.FItems[i];
        };
        for (var $l1 = 0, $end1 = LLength - 1; $l1 <= $end1; $l1++) {
          i = $l1;
          this.FItems[AIndex + i] = null;
        };
      };
      for (var $l2 = 0, $end2 = LLength - 1; $l2 <= $end2; $l2++) {
        i = $l2;
        LValue = AValues[i];
        this.FItems[i + AIndex] = LValue;
        this.Notify(LValue,$mod.TCollectionNotification.cnAdded);
      };
    };
    this.InsertRange$1 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.GetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        rtl._Release($in)
      };
    };
    this.InsertRange$2 = function (AIndex, AEnumerable) {
      var LValue = null;
      var i = 0;
      if ((AIndex < 0) || (AIndex > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      i = 0;
      var $in = AEnumerable.GetEnumerator();
      try {
        while ($in.MoveNext()) {
          LValue = $in.DoGetCurrent();
          this.InternalInsert(AIndex + i,LValue);
          i += 1;
        }
      } finally {
        $in = rtl.freeLoc($in)
      };
    };
    this.Remove = function (AValue) {
      var Result = 0;
      Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.RemoveItem = function (AValue, Direction) {
      var Result = 0;
      if (Direction === $mod.TDirection.fromEnd) {
        Result = this.LastIndexOf(AValue)}
       else Result = this.IndexOf(AValue);
      if (Result >= 0) this.DoRemove(Result,$mod.TCollectionNotification.cnRemoved);
      return Result;
    };
    this.Delete = function (AIndex) {
      this.DoRemove(AIndex,$mod.TCollectionNotification.cnRemoved);
    };
    this.DeleteRange = function (AIndex, ACount) {
      var LDeleted = [];
      var i = 0;
      if (ACount === 0) return;
      if ((ACount < 0) || (AIndex < 0) || ((AIndex + ACount) > this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      LDeleted = this.FItems.splice(AIndex,this.FLength);
      this.FLength -= ACount;
      for (var $l = 0, $end = rtl.length(LDeleted) - 1; $l <= $end; $l++) {
        i = $l;
        this.Notify(LDeleted[i],$mod.TCollectionNotification.cnRemoved);
      };
    };
    this.ExtractIndex = function (AIndex) {
      var Result = null;
      Result = this.DoRemove(AIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Extract = function (AValue) {
      var Result = null;
      var LIndex = 0;
      LIndex = this.IndexOf(AValue);
      if (LIndex < 0) {
        Result = null}
       else Result = this.DoRemove(LIndex,$mod.TCollectionNotification.cnExtracted);
      return Result;
    };
    this.Exchange = function (AIndex1, AIndex2) {
      var LTemp = null;
      LTemp = this.FItems[AIndex1];
      this.FItems[AIndex1] = this.FItems[AIndex2];
      this.FItems[AIndex2] = LTemp;
    };
    this.Move = function (AIndex, ANewIndex) {
      var Arr = null;
      var LTemp = undefined;
      var i = 0;
      if (ANewIndex === AIndex) return;
      if ((ANewIndex < 0) || (ANewIndex >= this.FLength)) throw pas.SysUtils.EArgumentOutOfRangeException.$create("Create$1",[rtl.getResStr(pas["Generics.Strings"],"SArgumentOutOfRange")]);
      Arr = this.FItems;
      LTemp = Arr[AIndex];
      if (AIndex < ANewIndex) {
        for (var $l = AIndex, $end = ANewIndex - 1; $l <= $end; $l++) {
          i = $l;
          Arr[i] = Arr[i + 1];
        }}
       else for (var $l1 = AIndex, $end1 = ANewIndex + 1; $l1 >= $end1; $l1--) {
        i = $l1;
        Arr[i] = Arr[i - 1];
      };
      Arr[ANewIndex] = LTemp;
    };
    this.First = function () {
      var Result = null;
      Result = this.GetItem(0);
      return Result;
    };
    this.Last = function () {
      var Result = null;
      Result = this.GetItem(this.FLength - 1);
      return Result;
    };
    this.Clear = function () {
      this.SetCount(0);
      this.SetCapacity(0);
    };
    this.Contains = function (AValue) {
      var Result = false;
      Result = this.IndexOf(AValue) >= 0;
      return Result;
    };
    this.IndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = 0, $end = this.FLength - 1; $l <= $end; $l++) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.LastIndexOf = function (AValue) {
      var Result = 0;
      var i = 0;
      for (var $l = this.FLength - 1; $l >= 0; $l--) {
        i = $l;
        if (this.SameValue(AValue,this.FItems[i])) return i;
      };
      Result = -1;
      return Result;
    };
    this.Reverse = function () {
      var a = 0;
      var b = 0;
      var LTemp = null;
      a = 0;
      b = this.FLength - 1;
      while (a < b) {
        LTemp = this.FItems[a];
        this.FItems[a] = this.FItems[b];
        this.FItems[b] = LTemp;
        a += 1;
        b -= 1;
      };
    };
    this.TrimExcess = function () {
      this.SetCapacity(this.FLength);
    };
    this.Sort = function () {
      $mod.TArrayHelper$G16.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},this.FComparer,0,this.FLength);
    };
    this.Sort$1 = function (AComparer) {
      $mod.TArrayHelper$G16.Sort$1({p: this, get: function () {
          return this.p.FItems;
        }, set: function (v) {
          this.p.FItems = v;
        }},AComparer,0,this.FLength);
    };
    this.BinarySearch = function (AItem, AIndex) {
      var Result = false;
      Result = $mod.TArrayHelper$G16.BinarySearch$1(this.FItems,AItem,AIndex,this.FComparer,0,this.FLength);
      return Result;
    };
    this.BinarySearch$1 = function (AItem, AIndex, AComparer) {
      var Result = false;
      Result = $mod.TArrayHelper$G16.BinarySearch$1(this.FItems,AItem,AIndex,AComparer,0,this.FLength);
      return Result;
    };
  },"TList<ComCtrls.TListItem>");
  $mod.$implcode = function () {
    $mod.$resourcestrings = {SErrDictKeyNotFound: {org: "Key value not found"}, SErrDictDuplicateKey: {org: "Duplicate key value"}};
  };
},[]);
//# sourceMappingURL=generics.collections.js.map
