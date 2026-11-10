rtl.module("Classes",["System","RTLConsts","Types","SysUtils","JS","TypInfo","p2jsres"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.$rtti.$MethodVar("TNotifyEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]]]), methodkind: 0});
  this.$rtti.$RefToProcVar("TNotifyEventRef",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]]])});
  this.$rtti.$RefToProcVar("TStringNotifyEventRef",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["aString",rtl.string,2]])});
  this.TFPObservedOperation = {"0": "ooChange", ooChange: 0, "1": "ooFree", ooFree: 1, "2": "ooAddItem", ooAddItem: 2, "3": "ooDeleteItem", ooDeleteItem: 3, "4": "ooCustom", ooCustom: 4};
  this.$rtti.$Enum("TFPObservedOperation",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TFPObservedOperation});
  rtl.createClass(this,"EStreamError",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"EFCreateError",this.EStreamError,function () {
  });
  rtl.createClass(this,"EFOpenError",this.EStreamError,function () {
  });
  rtl.createClass(this,"EFilerError",this.EStreamError,function () {
  });
  rtl.createClass(this,"EReadError",this.EFilerError,function () {
  });
  rtl.createClass(this,"EWriteError",this.EFilerError,function () {
  });
  rtl.createClass(this,"EClassNotFound",this.EFilerError,function () {
  });
  rtl.createClass(this,"EMethodNotFound",this.EFilerError,function () {
  });
  rtl.createClass(this,"EInvalidImage",this.EFilerError,function () {
  });
  rtl.createClass(this,"EResNotFound",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"EListError",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"EBitsError",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"EStringListError",this.EListError,function () {
  });
  rtl.createClass(this,"EComponentError",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"EParserError",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"EOutOfResources",pas.SysUtils.EOutOfMemory,function () {
  });
  rtl.createClass(this,"EInvalidOperation",pas.SysUtils.Exception,function () {
  });
  this.TListAssignOp = {"0": "laCopy", laCopy: 0, "1": "laAnd", laAnd: 1, "2": "laOr", laOr: 2, "3": "laXor", laXor: 3, "4": "laSrcUnique", laSrcUnique: 4, "5": "laDestUnique", laDestUnique: 5};
  this.$rtti.$Enum("TListAssignOp",{minvalue: 0, maxvalue: 5, ordtype: 1, enumtype: this.TListAssignOp});
  this.$rtti.$ProcVar("TListSortCompare",{procsig: rtl.newTIProcSig([["Item1",rtl.jsvalue],["Item2",rtl.jsvalue]],rtl.longint)});
  this.$rtti.$RefToProcVar("TListSortCompareFunc",{procsig: rtl.newTIProcSig([["Item1",rtl.jsvalue],["Item2",rtl.jsvalue]],rtl.longint)});
  this.TAlignment = {"0": "taLeftJustify", taLeftJustify: 0, "1": "taRightJustify", taRightJustify: 1, "2": "taCenter", taCenter: 2};
  this.$rtti.$Enum("TAlignment",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TAlignment});
  this.$rtti.$Class("TFPList");
  this.$rtti.$Class("TReader");
  this.$rtti.$Class("TWriter");
  this.$rtti.$Class("TFiler");
  rtl.createClass(this,"TFPListEnumerator",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FList = null;
      this.FPosition = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (AList) {
      pas.System.TObject.Create.call(this);
      this.FList = AList;
      this.FPosition = -1;
      return this;
    };
    this.GetCurrent = function () {
      var Result = undefined;
      Result = this.FList.Get(this.FPosition);
      return Result;
    };
    this.MoveNext = function () {
      var Result = false;
      this.FPosition += 1;
      Result = this.FPosition < this.FList.FCount;
      return Result;
    };
  });
  rtl.createClass(this,"TFPList",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FList = [];
      this.FCount = 0;
      this.FCapacity = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.CopyMove = function (aList) {
      var r = 0;
      this.Clear();
      for (var $l = 0, $end = aList.FCount - 1; $l <= $end; $l++) {
        r = $l;
        this.Add(aList.Get(r));
      };
    };
    this.MergeMove = function (aList) {
      var r = 0;
      for (var $l = 0, $end = aList.FCount - 1; $l <= $end; $l++) {
        r = $l;
        if (this.IndexOf(aList.Get(r)) < 0) this.Add(aList.Get(r));
      };
    };
    this.DoCopy = function (ListA, ListB) {
      if (ListB != null) {
        this.CopyMove(ListB)}
       else this.CopyMove(ListA);
    };
    this.DoSrcUnique = function (ListA, ListB) {
      var r = 0;
      if (ListB != null) {
        this.Clear();
        for (var $l = 0, $end = ListA.FCount - 1; $l <= $end; $l++) {
          r = $l;
          if (ListB.IndexOf(ListA.Get(r)) < 0) this.Add(ListA.Get(r));
        };
      } else {
        for (var $l1 = this.FCount - 1; $l1 >= 0; $l1--) {
          r = $l1;
          if (ListA.IndexOf(this.Get(r)) >= 0) this.Delete(r);
        };
      };
    };
    this.DoAnd = function (ListA, ListB) {
      var r = 0;
      if (ListB != null) {
        this.Clear();
        for (var $l = 0, $end = ListA.FCount - 1; $l <= $end; $l++) {
          r = $l;
          if (ListB.IndexOf(ListA.Get(r)) >= 0) this.Add(ListA.Get(r));
        };
      } else {
        for (var $l1 = this.FCount - 1; $l1 >= 0; $l1--) {
          r = $l1;
          if (ListA.IndexOf(this.Get(r)) < 0) this.Delete(r);
        };
      };
    };
    this.DoDestUnique = function (ListA, ListB) {
      var $Self = this;
      function MoveElements(Src, Dest) {
        var r = 0;
        $Self.Clear();
        for (var $l = 0, $end = Src.FCount - 1; $l <= $end; $l++) {
          r = $l;
          if (Dest.IndexOf(Src.Get(r)) < 0) $Self.Add(Src.Get(r));
        };
      };
      var Dest = null;
      if (ListB != null) {
        MoveElements(ListB,ListA)}
       else Dest = $mod.TFPList.$create("Create");
      try {
        Dest.CopyMove($Self);
        MoveElements(ListA,Dest);
      } finally {
        Dest.$destroy("Destroy");
      };
    };
    this.DoOr = function (ListA, ListB) {
      if (ListB != null) {
        this.CopyMove(ListA);
        this.MergeMove(ListB);
      } else this.MergeMove(ListA);
    };
    this.DoXOr = function (ListA, ListB) {
      var r = 0;
      var l = null;
      if (ListB != null) {
        this.Clear();
        for (var $l = 0, $end = ListA.FCount - 1; $l <= $end; $l++) {
          r = $l;
          if (ListB.IndexOf(ListA.Get(r)) < 0) this.Add(ListA.Get(r));
        };
        for (var $l1 = 0, $end1 = ListB.FCount - 1; $l1 <= $end1; $l1++) {
          r = $l1;
          if (ListA.IndexOf(ListB.Get(r)) < 0) this.Add(ListB.Get(r));
        };
      } else {
        l = $mod.TFPList.$create("Create");
        try {
          l.CopyMove(this);
          for (var $l2 = this.FCount - 1; $l2 >= 0; $l2--) {
            r = $l2;
            if (ListA.IndexOf(this.Get(r)) >= 0) this.Delete(r);
          };
          for (var $l3 = 0, $end2 = ListA.FCount - 1; $l3 <= $end2; $l3++) {
            r = $l3;
            if (l.IndexOf(ListA.Get(r)) < 0) this.Add(ListA.Get(r));
          };
        } finally {
          l.$destroy("Destroy");
        };
      };
    };
    this.Get = function (Index) {
      var Result = undefined;
      if ((Index < 0) || (Index >= this.FCount)) this.RaiseIndexError(Index);
      Result = this.FList[Index];
      return Result;
    };
    this.Put = function (Index, Item) {
      if ((Index < 0) || (Index >= this.FCount)) this.RaiseIndexError(Index);
      this.FList[Index] = Item;
    };
    this.SetCapacity = function (NewCapacity) {
      if (NewCapacity < this.FCount) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListCapacityError"),"" + NewCapacity);
      if (NewCapacity === this.FCapacity) return;
      this.FList = rtl.arraySetLength(this.FList,undefined,NewCapacity);
      this.FCapacity = NewCapacity;
    };
    this.SetCount = function (NewCount) {
      if (NewCount < 0) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListCountError"),"" + NewCount);
      if (NewCount > this.FCount) {
        if (NewCount > this.FCapacity) this.SetCapacity(NewCount);
      };
      this.FCount = NewCount;
    };
    this.RaiseIndexError = function (Index) {
      this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),"" + Index);
    };
    this.Destroy = function () {
      this.Clear();
      pas.System.TObject.Destroy.call(this);
    };
    this.AddList = function (AList) {
      var I = 0;
      if (this.FCapacity < (this.FCount + AList.FCount)) this.SetCapacity(this.FCount + AList.FCount);
      for (var $l = 0, $end = AList.FCount - 1; $l <= $end; $l++) {
        I = $l;
        this.Add(AList.Get(I));
      };
    };
    this.Add = function (Item) {
      var Result = 0;
      if (this.FCount === this.FCapacity) this.Expand();
      this.FList[this.FCount] = Item;
      Result = this.FCount;
      this.FCount += 1;
      return Result;
    };
    this.Clear = function () {
      if (rtl.length(this.FList) > 0) {
        this.SetCount(0);
        this.SetCapacity(0);
      };
    };
    this.Delete = function (Index) {
      if ((Index < 0) || (Index >= this.FCount)) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),"" + Index);
      this.FCount = this.FCount - 1;
      this.FList.splice(Index,1);
      this.FCapacity -= 1;
    };
    this.Error = function (Msg, Data) {
      throw $mod.EListError.$create("CreateFmt",[Msg,pas.System.VarRecs(18,Data)]);
    };
    this.Exchange = function (Index1, Index2) {
      var Temp = undefined;
      if ((Index1 >= this.FCount) || (Index1 < 0)) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),"" + Index1);
      if ((Index2 >= this.FCount) || (Index2 < 0)) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),"" + Index2);
      Temp = this.FList[Index1];
      this.FList[Index1] = this.FList[Index2];
      this.FList[Index2] = Temp;
    };
    this.Expand = function () {
      var Result = null;
      var IncSize = 0;
      if (this.FCount < this.FCapacity) return this;
      IncSize = 4;
      if (this.FCapacity > 3) IncSize = IncSize + 4;
      if (this.FCapacity > 8) IncSize = IncSize + 8;
      if (this.FCapacity > 127) IncSize += this.FCapacity >>> 2;
      this.SetCapacity(this.FCapacity + IncSize);
      Result = this;
      return Result;
    };
    this.Extract = function (Item) {
      var Result = undefined;
      var i = 0;
      i = this.IndexOf(Item);
      if (i >= 0) {
        Result = Item;
        this.Delete(i);
      } else Result = null;
      return Result;
    };
    this.First = function () {
      var Result = undefined;
      if (this.FCount === 0) {
        Result = null}
       else Result = this.Get(0);
      return Result;
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = $mod.TFPListEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.IndexOf = function (Item) {
      var Result = 0;
      var C = 0;
      Result = 0;
      C = this.FCount;
      while ((Result < C) && (this.FList[Result] != Item)) Result += 1;
      if (Result >= C) Result = -1;
      return Result;
    };
    this.IndexOfItem = function (Item, Direction) {
      var Result = 0;
      if (Direction === pas.Types.TDirection.FromBeginning) {
        Result = this.IndexOf(Item)}
       else {
        Result = this.FCount - 1;
        while ((Result >= 0) && (this.FList[Result] != Item)) Result = Result - 1;
      };
      return Result;
    };
    this.Insert = function (Index, Item) {
      if ((Index < 0) || (Index > this.FCount)) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),"" + Index);
      this.FList.splice(Index,0,Item);
      this.FCapacity += 1;
      this.FCount += 1;
    };
    this.Last = function () {
      var Result = undefined;
      if (this.FCount === 0) {
        Result = null}
       else Result = this.Get(this.FCount - 1);
      return Result;
    };
    this.Move = function (CurIndex, NewIndex) {
      var Temp = undefined;
      if ((CurIndex < 0) || (CurIndex > (this.FCount - 1))) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),"" + CurIndex);
      if ((NewIndex < 0) || (NewIndex > (this.FCount - 1))) this.$class.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),"" + NewIndex);
      if (CurIndex === NewIndex) return;
      Temp = this.FList[CurIndex];
      this.FList.splice(CurIndex,1);
      this.FList.splice(NewIndex,0,Temp);
    };
    this.Assign = function (ListA, AOperator, ListB) {
      var $tmp = AOperator;
      if ($tmp === $mod.TListAssignOp.laCopy) {
        this.DoCopy(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laSrcUnique) {
        this.DoSrcUnique(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laAnd) {
        this.DoAnd(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laDestUnique) {
        this.DoDestUnique(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laOr) {
        this.DoOr(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laXor) this.DoXOr(ListA,ListB);
    };
    this.Remove = function (Item) {
      var Result = 0;
      Result = this.IndexOf(Item);
      if (Result !== -1) this.Delete(Result);
      return Result;
    };
    this.Pack = function () {
      var Dst = 0;
      var i = 0;
      var V = undefined;
      Dst = 0;
      for (var $l = 0, $end = this.FCount - 1; $l <= $end; $l++) {
        i = $l;
        V = this.FList[i];
        if (!pas.System.Assigned(V)) continue;
        this.FList[Dst] = V;
        Dst += 1;
      };
    };
    this.Sort = function (Compare) {
      var $Self = this;
      if (!(rtl.length(this.FList) > 0) || (this.FCount < 2)) return;
      $impl.QuickSort(rtl.arrayRef(this.FList),0,this.FCount - 1,function (Item1, Item2) {
        var Result = 0;
        Result = Compare(Item1,Item2);
        return Result;
      });
    };
    this.SortList = function (Compare) {
      if (!(rtl.length(this.FList) > 0) || (this.FCount < 2)) return;
      $impl.QuickSort(rtl.arrayRef(this.FList),0,this.FCount - 1,Compare);
    };
    this.ForEachCall = function (proc2call, arg) {
      var i = 0;
      var v = undefined;
      for (var $l = 0, $end = this.FCount - 1; $l <= $end; $l++) {
        i = $l;
        v = this.FList[i];
        if (pas.System.Assigned(v)) proc2call(v,arg);
      };
    };
    this.ForEachCall$1 = function (proc2call, arg) {
      var i = 0;
      var v = undefined;
      for (var $l = 0, $end = this.FCount - 1; $l <= $end; $l++) {
        i = $l;
        v = this.FList[i];
        if (pas.System.Assigned(v)) proc2call(v,arg);
      };
    };
  });
  this.TListNotification = {"0": "lnAdded", lnAdded: 0, "1": "lnExtracted", lnExtracted: 1, "2": "lnDeleted", lnDeleted: 2};
  this.$rtti.$Enum("TListNotification",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TListNotification});
  this.$rtti.$Class("TList");
  rtl.createClass(this,"TListEnumerator",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FList = null;
      this.FPosition = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (AList) {
      pas.System.TObject.Create.call(this);
      this.FList = AList;
      this.FPosition = -1;
      return this;
    };
    this.GetCurrent = function () {
      var Result = undefined;
      Result = this.FList.Get(this.FPosition);
      return Result;
    };
    this.MoveNext = function () {
      var Result = false;
      this.FPosition += 1;
      Result = this.FPosition < this.FList.GetCount();
      return Result;
    };
  });
  rtl.createClass(this,"TList",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FList = null;
    };
    this.$final = function () {
      this.FList = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.CopyMove = function (aList) {
      var r = 0;
      this.Clear();
      for (var $l = 0, $end = aList.GetCount() - 1; $l <= $end; $l++) {
        r = $l;
        this.Add(aList.Get(r));
      };
    };
    this.MergeMove = function (aList) {
      var r = 0;
      for (var $l = 0, $end = aList.GetCount() - 1; $l <= $end; $l++) {
        r = $l;
        if (this.IndexOf(aList.Get(r)) < 0) this.Add(aList.Get(r));
      };
    };
    this.DoCopy = function (ListA, ListB) {
      if (ListB != null) {
        this.CopyMove(ListB)}
       else this.CopyMove(ListA);
    };
    this.DoSrcUnique = function (ListA, ListB) {
      var r = 0;
      if (ListB != null) {
        this.Clear();
        for (var $l = 0, $end = ListA.GetCount() - 1; $l <= $end; $l++) {
          r = $l;
          if (ListB.IndexOf(ListA.Get(r)) < 0) this.Add(ListA.Get(r));
        };
      } else {
        for (var $l1 = this.GetCount() - 1; $l1 >= 0; $l1--) {
          r = $l1;
          if (ListA.IndexOf(this.Get(r)) >= 0) this.Delete(r);
        };
      };
    };
    this.DoAnd = function (ListA, ListB) {
      var r = 0;
      if (ListB != null) {
        this.Clear();
        for (var $l = 0, $end = ListA.GetCount() - 1; $l <= $end; $l++) {
          r = $l;
          if (ListB.IndexOf(ListA.Get(r)) >= 0) this.Add(ListA.Get(r));
        };
      } else {
        for (var $l1 = this.GetCount() - 1; $l1 >= 0; $l1--) {
          r = $l1;
          if (ListA.IndexOf(this.Get(r)) < 0) this.Delete(r);
        };
      };
    };
    this.DoDestUnique = function (ListA, ListB) {
      var $Self = this;
      function MoveElements(Src, Dest) {
        var r = 0;
        $Self.Clear();
        for (var $l = 0, $end = Src.GetCount() - 1; $l <= $end; $l++) {
          r = $l;
          if (Dest.IndexOf(Src.Get(r)) < 0) $Self.Add(Src.Get(r));
        };
      };
      var Dest = null;
      if (ListB != null) {
        MoveElements(ListB,ListA)}
       else try {
        Dest = $mod.TList.$create("Create$1");
        Dest.CopyMove($Self);
        MoveElements(ListA,Dest);
      } finally {
        Dest.$destroy("Destroy");
      };
    };
    this.DoOr = function (ListA, ListB) {
      if (ListB != null) {
        this.CopyMove(ListA);
        this.MergeMove(ListB);
      } else this.MergeMove(ListA);
    };
    this.DoXOr = function (ListA, ListB) {
      var r = 0;
      var l = null;
      if (ListB != null) {
        this.Clear();
        for (var $l = 0, $end = ListA.GetCount() - 1; $l <= $end; $l++) {
          r = $l;
          if (ListB.IndexOf(ListA.Get(r)) < 0) this.Add(ListA.Get(r));
        };
        for (var $l1 = 0, $end1 = ListB.GetCount() - 1; $l1 <= $end1; $l1++) {
          r = $l1;
          if (ListA.IndexOf(ListB.Get(r)) < 0) this.Add(ListB.Get(r));
        };
      } else try {
        l = $mod.TList.$create("Create$1");
        l.CopyMove(this);
        for (var $l2 = this.GetCount() - 1; $l2 >= 0; $l2--) {
          r = $l2;
          if (ListA.IndexOf(this.Get(r)) >= 0) this.Delete(r);
        };
        for (var $l3 = 0, $end2 = ListA.GetCount() - 1; $l3 <= $end2; $l3++) {
          r = $l3;
          if (l.IndexOf(ListA.Get(r)) < 0) this.Add(ListA.Get(r));
        };
      } finally {
        l.$destroy("Destroy");
      };
    };
    this.Get = function (Index) {
      var Result = undefined;
      Result = this.FList.Get(Index);
      return Result;
    };
    this.Put = function (Index, Item) {
      var V = undefined;
      V = this.Get(Index);
      this.FList.Put(Index,Item);
      if (pas.System.Assigned(V)) this.Notify(V,$mod.TListNotification.lnDeleted);
      if (pas.System.Assigned(Item)) this.Notify(Item,$mod.TListNotification.lnAdded);
    };
    this.Notify = function (aValue, Action) {
      if (pas.System.Assigned(aValue)) ;
      if (Action === $mod.TListNotification.lnExtracted) ;
    };
    this.SetCapacity = function (NewCapacity) {
      this.FList.SetCapacity(NewCapacity);
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = this.FList.FCapacity;
      return Result;
    };
    this.SetCount = function (NewCount) {
      if (NewCount < this.FList.FCount) {
        while (this.FList.FCount > NewCount) this.Delete(this.FList.FCount - 1)}
       else this.FList.SetCount(NewCount);
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FList.FCount;
      return Result;
    };
    this.GetList = function () {
      var Result = [];
      Result = this.FList.FList;
      return Result;
    };
    this.Create$1 = function () {
      pas.System.TObject.Create.call(this);
      this.FList = $mod.TFPList.$create("Create");
      return this;
    };
    this.Destroy = function () {
      if (this.FList != null) this.Clear();
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FList;
        }, set: function (v) {
          this.p.FList = v;
        }});
    };
    this.AddList = function (AList) {
      var I = 0;
      this.FList.AddList(AList.FList);
      for (var $l = 0, $end = AList.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        if (pas.System.Assigned(AList.Get(I))) this.Notify(AList.Get(I),$mod.TListNotification.lnAdded);
      };
    };
    this.Add = function (Item) {
      var Result = 0;
      Result = this.FList.Add(Item);
      if (pas.System.Assigned(Item)) this.Notify(Item,$mod.TListNotification.lnAdded);
      return Result;
    };
    this.Clear = function () {
      while (this.FList.FCount > 0) this.Delete(this.GetCount() - 1);
    };
    this.Delete = function (Index) {
      var V = undefined;
      V = this.FList.Get(Index);
      this.FList.Delete(Index);
      if (pas.System.Assigned(V)) this.Notify(V,$mod.TListNotification.lnDeleted);
    };
    this.Error = function (Msg, Data) {
      throw $mod.EListError.$create("CreateFmt",[Msg,pas.System.VarRecs(18,Data)]);
    };
    this.Exchange = function (Index1, Index2) {
      this.FList.Exchange(Index1,Index2);
    };
    this.Expand = function () {
      var Result = null;
      this.FList.Expand();
      Result = this;
      return Result;
    };
    this.Extract = function (Item) {
      var Result = undefined;
      var c = 0;
      c = this.FList.FCount;
      Result = this.FList.Extract(Item);
      if (c !== this.FList.FCount) this.Notify(Result,$mod.TListNotification.lnExtracted);
      return Result;
    };
    this.First = function () {
      var Result = undefined;
      Result = this.FList.First();
      return Result;
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = $mod.TListEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.IndexOf = function (Item) {
      var Result = 0;
      Result = this.FList.IndexOf(Item);
      return Result;
    };
    this.Insert = function (Index, Item) {
      this.FList.Insert(Index,Item);
      if (pas.System.Assigned(Item)) this.Notify(Item,$mod.TListNotification.lnAdded);
    };
    this.Last = function () {
      var Result = undefined;
      Result = this.FList.Last();
      return Result;
    };
    this.Move = function (CurIndex, NewIndex) {
      this.FList.Move(CurIndex,NewIndex);
    };
    this.Assign = function (ListA, AOperator, ListB) {
      var $tmp = AOperator;
      if ($tmp === $mod.TListAssignOp.laCopy) {
        this.DoCopy(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laSrcUnique) {
        this.DoSrcUnique(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laAnd) {
        this.DoAnd(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laDestUnique) {
        this.DoDestUnique(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laOr) {
        this.DoOr(ListA,ListB)}
       else if ($tmp === $mod.TListAssignOp.laXor) this.DoXOr(ListA,ListB);
    };
    this.Remove = function (Item) {
      var Result = 0;
      Result = this.IndexOf(Item);
      if (Result !== -1) this.Delete(Result);
      return Result;
    };
    this.Pack = function () {
      this.FList.Pack();
    };
    this.Sort = function (Compare) {
      this.FList.Sort(Compare);
    };
    this.SortList = function (Compare) {
      this.FList.SortList(Compare);
    };
  });
  rtl.createClass(this,"TPersistent",pas.System.TObject,function () {
    this.AssignError = function (Source) {
      var SourceName = "";
      if (Source !== null) {
        SourceName = Source.$classname}
       else SourceName = "Nil";
      throw pas.SysUtils.EConvertError.$create("Create$1",["Cannot assign a " + SourceName + " to a " + this.$classname + "."]);
    };
    this.DefineProperties = function (Filer) {
      if (Filer === null) return;
    };
    this.AssignTo = function (Dest) {
      Dest.AssignError(this);
    };
    this.GetOwner = function () {
      var Result = null;
      Result = null;
      return Result;
    };
    this.Assign = function (Source) {
      if (Source !== null) {
        Source.AssignTo(this)}
       else this.AssignError(null);
    };
    this.GetNamePath = function () {
      var Result = "";
      var OwnerName = "";
      var TheOwner = null;
      Result = this.$classname;
      TheOwner = this.GetOwner();
      if (TheOwner !== null) {
        OwnerName = TheOwner.GetNamePath();
        if (OwnerName !== "") Result = OwnerName + "." + Result;
      };
      return Result;
    };
  });
  this.$rtti.$ClassRef("TPersistentClass",{instancetype: this.$rtti["TPersistent"]});
  rtl.createClass(this,"TInterfacedPersistent",this.TPersistent,function () {
    this.$init = function () {
      $mod.TPersistent.$init.call(this);
      this.FOwnerInterface = null;
    };
    this.$final = function () {
      rtl.setIntfP(this,"FOwnerInterface",null);
      $mod.TPersistent.$final.call(this);
    };
    this._AddRef = function () {
      var Result = 0;
      Result = -1;
      if (this.FOwnerInterface != null) Result = this.FOwnerInterface._AddRef();
      return Result;
    };
    this._Release = function () {
      var Result = 0;
      Result = -1;
      if (this.FOwnerInterface != null) Result = this.FOwnerInterface._Release();
      return Result;
    };
    this.QueryInterface = function (IID, Obj) {
      var Result = 0;
      Result = -2147467262;
      if (this.GetInterface(IID,Obj)) Result = 0;
      return Result;
    };
    this.AfterConstruction = function () {
      try {
        pas.System.TObject.AfterConstruction.call(this);
        if (this.GetOwner() !== null) this.GetOwner().GetInterface(rtl.getIntfGUIDR(pas.System.IUnknown),{p: this, get: function () {
            return this.p.FOwnerInterface;
          }, set: function (v) {
            this.p.FOwnerInterface = v;
          }});
      } finally {
        rtl._Release(this.FOwnerInterface);
      };
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  this.$rtti.$Class("TStrings");
  rtl.createClass(this,"TStringsEnumerator",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FStrings = null;
      this.FPosition = 0;
    };
    this.$final = function () {
      this.FStrings = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (AStrings) {
      pas.System.TObject.Create.call(this);
      this.FStrings = AStrings;
      this.FPosition = -1;
      return this;
    };
    this.GetCurrent = function () {
      var Result = "";
      Result = this.FStrings.Get(this.FPosition);
      return Result;
    };
    this.MoveNext = function () {
      var Result = false;
      this.FPosition += 1;
      Result = this.FPosition < this.FStrings.GetCount();
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AStrings",$mod.$rtti["TStrings"]]]);
  });
  rtl.createClass(this,"TStrings",this.TPersistent,function () {
    this.$init = function () {
      $mod.TPersistent.$init.call(this);
      this.FSpecialCharsInited = false;
      this.FAlwaysQuote = false;
      this.FQuoteChar = "\x00";
      this.FDelimiter = "\x00";
      this.FNameValueSeparator = "\x00";
      this.FUpdateCount = 0;
      this.FLBS = 0;
      this.FSkipLastLineBreak = false;
      this.FStrictDelimiter = false;
      this.FLineBreak = "";
    };
    this.GetCommaText = function () {
      var Result = "";
      var C1 = "\x00";
      var C2 = "\x00";
      var FSD = false;
      this.CheckSpecialChars();
      FSD = this.FStrictDelimiter;
      C1 = this.GetDelimiter();
      C2 = this.GetQuoteChar();
      this.SetDelimiter(",");
      this.SetQuoteChar('"');
      this.FStrictDelimiter = false;
      try {
        Result = this.GetDelimitedText();
      } finally {
        this.SetDelimiter(C1);
        this.SetQuoteChar(C2);
        this.FStrictDelimiter = FSD;
      };
      return Result;
    };
    this.GetName = function (Index) {
      var Result = "";
      var V = "";
      this.GetNameValue(Index,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},{get: function () {
          return V;
        }, set: function (v) {
          V = v;
        }});
      return Result;
    };
    this.GetValue = function (Name) {
      var Result = "";
      var L = 0;
      var N = "";
      Result = "";
      L = this.IndexOfName(Name);
      if (L !== -1) this.GetNameValue(L,{get: function () {
          return N;
        }, set: function (v) {
          N = v;
        }},{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.GetLBS = function () {
      var Result = 0;
      this.CheckSpecialChars();
      Result = this.FLBS;
      return Result;
    };
    this.SetLBS = function (AValue) {
      this.CheckSpecialChars();
      this.FLBS = AValue;
    };
    this.SetCommaText = function (Value) {
      var C1 = "\x00";
      var C2 = "\x00";
      this.CheckSpecialChars();
      C1 = this.GetDelimiter();
      C2 = this.GetQuoteChar();
      this.SetDelimiter(",");
      this.SetQuoteChar('"');
      try {
        this.SetDelimitedText(Value);
      } finally {
        this.SetDelimiter(C1);
        this.SetQuoteChar(C2);
      };
    };
    this.SetValue = function (Name, Value) {
      var L = 0;
      this.CheckSpecialChars();
      L = this.IndexOfName(Name);
      if (L === -1) {
        this.Add(Name + this.FNameValueSeparator + Value)}
       else this.Put(L,Name + this.FNameValueSeparator + Value);
    };
    this.SetDelimiter = function (c) {
      this.CheckSpecialChars();
      this.FDelimiter = c;
    };
    this.SetQuoteChar = function (c) {
      this.CheckSpecialChars();
      this.FQuoteChar = c;
    };
    this.SetNameValueSeparator = function (c) {
      this.CheckSpecialChars();
      this.FNameValueSeparator = c;
    };
    this.DoSetTextStr = function (Value, DoClear) {
      var S = "";
      var P = 0;
      try {
        this.BeginUpdate();
        if (DoClear) this.Clear();
        P = 1;
        while (this.GetNextLinebreak(Value,{get: function () {
            return S;
          }, set: function (v) {
            S = v;
          }},{get: function () {
            return P;
          }, set: function (v) {
            P = v;
          }})) this.Add(S);
      } finally {
        this.EndUpdate();
      };
    };
    this.GetDelimiter = function () {
      var Result = "\x00";
      this.CheckSpecialChars();
      Result = this.FDelimiter;
      return Result;
    };
    this.GetNameValueSeparator = function () {
      var Result = "\x00";
      this.CheckSpecialChars();
      Result = this.FNameValueSeparator;
      return Result;
    };
    this.GetQuoteChar = function () {
      var Result = "\x00";
      this.CheckSpecialChars();
      Result = this.FQuoteChar;
      return Result;
    };
    this.GetLineBreak = function () {
      var Result = "";
      this.CheckSpecialChars();
      Result = this.FLineBreak;
      return Result;
    };
    this.SetLineBreak = function (S) {
      this.CheckSpecialChars();
      this.FLineBreak = S;
    };
    this.GetSkipLastLineBreak = function () {
      var Result = false;
      this.CheckSpecialChars();
      Result = this.FSkipLastLineBreak;
      return Result;
    };
    this.SetSkipLastLineBreak = function (AValue) {
      this.CheckSpecialChars();
      this.FSkipLastLineBreak = AValue;
    };
    this.ReadData = function (Reader) {
      Reader.ReadListBegin();
      this.BeginUpdate();
      try {
        this.Clear();
        while (!Reader.EndOfList()) this.Add(Reader.ReadString());
      } finally {
        this.EndUpdate();
      };
      Reader.ReadListEnd();
    };
    this.WriteData = function (Writer) {
      var i = 0;
      Writer.WriteListBegin();
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        Writer.WriteString(this.Get(i));
      };
      Writer.WriteListEnd();
    };
    this.DefineProperties = function (Filer) {
      var HasData = false;
      if (Filer.FAncestor != null) {
        if (Filer.FAncestor.$class.InheritsFrom($mod.TStrings)) {
          HasData = !this.Equals$2(Filer.FAncestor)}
         else HasData = true}
       else HasData = this.GetCount() > 0;
      Filer.DefineProperty("Strings",rtl.createCallback(this,"ReadData"),rtl.createCallback(this,"WriteData"),HasData);
    };
    this.Error = function (Msg, Data) {
      throw $mod.EStringListError.$create("CreateFmt",[Msg,pas.System.VarRecs(18,pas.SysUtils.IntToStr(Data))]);
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = this.GetCount();
      return Result;
    };
    this.GetObject = function (Index) {
      var Result = null;
      if (Index === 0) ;
      Result = null;
      return Result;
    };
    this.GetTextStr = function () {
      var Result = "";
      var I = 0;
      var S = "";
      var NL = "";
      this.CheckSpecialChars();
      if (this.FLineBreak !== pas.System.sLineBreak) {
        NL = this.FLineBreak}
       else {
        var $tmp = this.FLBS;
        if ($tmp === pas.System.TTextLineBreakStyle.tlbsLF) {
          NL = "\n"}
         else if ($tmp === pas.System.TTextLineBreakStyle.tlbsCRLF) {
          NL = "\r\n"}
         else if ($tmp === pas.System.TTextLineBreakStyle.tlbsCR) NL = "\r";
      };
      Result = "";
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        S = this.Get(I);
        Result = Result + S;
        if ((I < (this.GetCount() - 1)) || !this.GetSkipLastLineBreak()) Result = Result + NL;
      };
      return Result;
    };
    this.Put = function (Index, S) {
      var Obj = null;
      Obj = this.GetObject(Index);
      this.Delete(Index);
      this.InsertObject(Index,S,Obj);
    };
    this.PutObject = function (Index, AObject) {
      if (Index === 0) return;
      if (AObject === null) return;
    };
    this.SetCapacity = function (NewCapacity) {
      if (NewCapacity === 0) ;
    };
    this.SetTextStr = function (Value) {
      this.CheckSpecialChars();
      this.DoSetTextStr(Value,true);
    };
    this.SetUpdateState = function (Updating) {
      if (Updating) ;
    };
    this.DoCompareText = function (s1, s2) {
      var Result = 0;
      Result = pas.SysUtils.CompareText(s1,s2);
      return Result;
    };
    this.GetDelimitedText = function () {
      var Result = "";
      var I = 0;
      var RE = "";
      var S = "";
      var doQuote = false;
      this.CheckSpecialChars();
      Result = "";
      RE = this.GetQuoteChar() + "|" + this.GetDelimiter();
      if (!this.FStrictDelimiter) RE = " |" + RE;
      RE = "/" + RE + "/";
      for (var $l = 0, $end = this.GetCount() - 1; $l <= $end; $l++) {
        I = $l;
        S = this.Get(I);
        doQuote = this.FAlwaysQuote || (S.search(RE) !== -1);
        if (doQuote) {
          Result = Result + pas.SysUtils.QuoteString(S,this.GetQuoteChar())}
         else Result = Result + S;
        if (I < (this.GetCount() - 1)) Result = Result + this.GetDelimiter();
      };
      if ((Result.length === 0) && (this.GetCount() === 1)) Result = this.GetQuoteChar() + this.GetQuoteChar();
      return Result;
    };
    this.SetDelimitedText = function (AValue) {
      var i = 0;
      var j = 0;
      var aNotFirst = false;
      this.CheckSpecialChars();
      this.BeginUpdate();
      i = 1;
      j = 1;
      aNotFirst = false;
      try {
        this.Clear();
        if (this.FStrictDelimiter) {
          while (i <= AValue.length) {
            if (aNotFirst && (i <= AValue.length) && (AValue.charAt(i - 1) === this.FDelimiter)) i += 1;
            if (i <= AValue.length) {
              if (AValue.charAt(i - 1) === this.FQuoteChar) {
                j = i + 1;
                while ((j <= AValue.length) && ((AValue.charAt(j - 1) !== this.FQuoteChar) || (((j + 1) <= AValue.length) && (AValue.charAt((j + 1) - 1) === this.FQuoteChar)))) {
                  if ((j <= AValue.length) && (AValue.charAt(j - 1) === this.FQuoteChar)) {
                    j += 2}
                   else j += 1;
                };
                this.Add(pas.SysUtils.StringReplace(pas.System.Copy(AValue,i + 1,j - i - 1),this.FQuoteChar + this.FQuoteChar,this.FQuoteChar,rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll)));
                i = j + 1;
              } else {
                j = i;
                while ((j <= AValue.length) && (AValue.charAt(j - 1) !== this.FDelimiter)) j += 1;
                this.Add(pas.System.Copy(AValue,i,j - i));
                i = j;
              };
            } else {
              if (aNotFirst) this.Add("");
            };
            aNotFirst = true;
          };
        } else {
          while (i <= AValue.length) {
            if (aNotFirst && (i <= AValue.length) && (AValue.charAt(i - 1) === this.FDelimiter)) i += 1;
            while ((i <= AValue.length) && (AValue.charCodeAt(i - 1) <= 32)) i += 1;
            if (i <= AValue.length) {
              if (AValue.charAt(i - 1) === this.FQuoteChar) {
                j = i + 1;
                while ((j <= AValue.length) && ((AValue.charAt(j - 1) !== this.FQuoteChar) || (((j + 1) <= AValue.length) && (AValue.charAt((j + 1) - 1) === this.FQuoteChar)))) {
                  if ((j <= AValue.length) && (AValue.charAt(j - 1) === this.FQuoteChar)) {
                    j += 2}
                   else j += 1;
                };
                this.Add(pas.SysUtils.StringReplace(pas.System.Copy(AValue,i + 1,j - i - 1),this.FQuoteChar + this.FQuoteChar,this.FQuoteChar,rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll)));
                i = j + 1;
              } else {
                j = i;
                while ((j <= AValue.length) && (AValue.charCodeAt(j - 1) > 32) && (AValue.charAt(j - 1) !== this.FDelimiter)) j += 1;
                this.Add(pas.System.Copy(AValue,i,j - i));
                i = j;
              };
            } else {
              if (aNotFirst) this.Add("");
            };
            while ((i <= AValue.length) && (AValue.charCodeAt(i - 1) <= 32)) i += 1;
            aNotFirst = true;
          };
        };
      } finally {
        this.EndUpdate();
      };
    };
    this.GetValueFromIndex = function (Index) {
      var Result = "";
      var N = "";
      this.GetNameValue(Index,{get: function () {
          return N;
        }, set: function (v) {
          N = v;
        }},{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.SetValueFromIndex = function (Index, Value) {
      if (Value === "") {
        this.Delete(Index)}
       else {
        if (Index < 0) Index = this.Add("");
        this.CheckSpecialChars();
        this.Put(Index,this.GetName(Index) + this.FNameValueSeparator + Value);
      };
    };
    this.CheckSpecialChars = function () {
      if (!this.FSpecialCharsInited) {
        this.FQuoteChar = '"';
        this.FDelimiter = ",";
        this.FNameValueSeparator = "=";
        this.FLBS = pas.System.DefaultTextLineBreakStyle;
        this.FSpecialCharsInited = true;
        this.FLineBreak = pas.System.sLineBreak;
      };
    };
    this.GetNextLinebreak = function (Value, S, P) {
      var Result = false;
      var PPLF = 0;
      var PPCR = 0;
      var PP = 0;
      var PL = 0;
      S.set("");
      Result = false;
      if ((Value.length - P.get()) < 0) return Result;
      PPLF = Value.indexOf("\n",P.get() - 1) + 1;
      PPCR = Value.indexOf("\r",P.get() - 1) + 1;
      PL = 1;
      if ((PPLF > 0) && (PPCR > 0)) {
        if ((PPLF - PPCR) === 1) PL = 2;
        if (PPLF < PPCR) {
          PP = PPLF}
         else PP = PPCR;
      } else if ((PPLF > 0) && (PPCR < 1)) {
        PP = PPLF}
       else if ((PPCR > 0) && (PPLF < 1)) {
        PP = PPCR}
       else PP = Value.length + 1;
      S.set(pas.System.Copy(Value,P.get(),PP - P.get()));
      P.set(PP + PL);
      Result = true;
      return Result;
    };
    this.Create$1 = function () {
      pas.System.TObject.Create.call(this);
      this.FAlwaysQuote = false;
      return this;
    };
    this.Destroy = function () {
      pas.System.TObject.Destroy.call(this);
    };
    this.ToObjectArray = function () {
      var Result = [];
      Result = this.ToObjectArray$1(0,this.GetCount() - 1);
      return Result;
    };
    this.ToObjectArray$1 = function (aStart, aEnd) {
      var Result = [];
      var I = 0;
      Result = [];
      if (aStart > aEnd) return Result;
      Result = rtl.arraySetLength(Result,null,(aEnd - aStart) + 1);
      for (var $l = aStart, $end = aEnd; $l <= $end; $l++) {
        I = $l;
        Result[I - aStart] = this.GetObject(I);
      };
      return Result;
    };
    this.ToStringArray = function () {
      var Result = [];
      Result = this.ToStringArray$1(0,this.GetCount() - 1);
      return Result;
    };
    this.ToStringArray$1 = function (aStart, aEnd) {
      var Result = [];
      var I = 0;
      Result = [];
      if (aStart > aEnd) return Result;
      Result = rtl.arraySetLength(Result,"",(aEnd - aStart) + 1);
      for (var $l = aStart, $end = aEnd; $l <= $end; $l++) {
        I = $l;
        Result[I - aStart] = this.Get(I);
      };
      return Result;
    };
    this.Add = function (S) {
      var Result = 0;
      Result = this.GetCount();
      this.Insert(this.GetCount(),S);
      return Result;
    };
    this.Add$1 = function (Fmt, Args) {
      var Result = 0;
      Result = this.Add(pas.SysUtils.Format(Fmt,Args));
      return Result;
    };
    this.AddFmt = function (Fmt, Args) {
      var Result = 0;
      Result = this.Add(pas.SysUtils.Format(Fmt,Args));
      return Result;
    };
    this.AddObject = function (S, AObject) {
      var Result = 0;
      Result = this.Add(S);
      this.PutObject(Result,AObject);
      return Result;
    };
    this.AddObject$1 = function (Fmt, Args, AObject) {
      var Result = 0;
      Result = this.AddObject(pas.SysUtils.Format(Fmt,Args),AObject);
      return Result;
    };
    this.Append = function (S) {
      this.Add(S);
    };
    this.AddStrings = function (TheStrings) {
      var Runner = 0;
      for (var $l = 0, $end = TheStrings.GetCount() - 1; $l <= $end; $l++) {
        Runner = $l;
        this.AddObject(TheStrings.Get(Runner),TheStrings.GetObject(Runner));
      };
    };
    this.AddStrings$1 = function (TheStrings, ClearFirst) {
      this.BeginUpdate();
      try {
        if (ClearFirst) this.Clear();
        this.AddStrings(TheStrings);
      } finally {
        this.EndUpdate();
      };
    };
    this.AddStrings$2 = function (TheStrings) {
      var Runner = 0;
      if ((this.GetCount() + (rtl.length(TheStrings) - 1) + 1) > this.GetCapacity()) this.SetCapacity(this.GetCount() + (rtl.length(TheStrings) - 1) + 1);
      for (var $l = 0, $end = rtl.length(TheStrings) - 1; $l <= $end; $l++) {
        Runner = $l;
        this.Add(TheStrings[Runner]);
      };
    };
    this.AddStrings$3 = function (TheStrings, ClearFirst) {
      this.BeginUpdate();
      try {
        if (ClearFirst) this.Clear();
        this.AddStrings$2(TheStrings);
      } finally {
        this.EndUpdate();
      };
    };
    this.AddPair = function (AName, AValue) {
      var Result = null;
      Result = this.AddPair$1(AName,AValue,null);
      return Result;
    };
    this.AddPair$1 = function (AName, AValue, AObject) {
      var Result = null;
      Result = this;
      this.AddObject(AName + this.GetNameValueSeparator() + AValue,AObject);
      return Result;
    };
    this.AddText = function (S) {
      this.CheckSpecialChars();
      this.DoSetTextStr(S,false);
    };
    this.Assign = function (Source) {
      var S = null;
      if ($mod.TStrings.isPrototypeOf(Source)) {
        S = Source;
        this.BeginUpdate();
        try {
          this.Clear();
          this.FSpecialCharsInited = S.FSpecialCharsInited;
          this.FQuoteChar = S.FQuoteChar;
          this.FDelimiter = S.FDelimiter;
          this.FNameValueSeparator = S.FNameValueSeparator;
          this.FLBS = S.FLBS;
          this.FLineBreak = S.FLineBreak;
          this.AddStrings(S);
        } finally {
          this.EndUpdate();
        };
      } else $mod.TPersistent.Assign.call(this,Source);
    };
    this.BeginUpdate = function () {
      if (this.FUpdateCount === 0) this.SetUpdateState(true);
      this.FUpdateCount += 1;
    };
    this.EndUpdate = function () {
      if (this.FUpdateCount > 0) this.FUpdateCount -= 1;
      if (this.FUpdateCount === 0) this.SetUpdateState(false);
    };
    this.Equals = function (Obj) {
      var Result = false;
      if ($mod.TStrings.isPrototypeOf(Obj)) {
        Result = this.Equals$2(Obj)}
       else Result = pas.System.TObject.Equals.call(this,Obj);
      return Result;
    };
    this.Equals$2 = function (TheStrings) {
      var Result = false;
      var Runner = 0;
      var Nr = 0;
      Result = false;
      Nr = this.GetCount();
      if (Nr !== TheStrings.GetCount()) return Result;
      for (var $l = 0, $end = Nr - 1; $l <= $end; $l++) {
        Runner = $l;
        if (this.Get(Runner) !== TheStrings.Get(Runner)) return Result;
      };
      Result = true;
      return Result;
    };
    this.Exchange = function (Index1, Index2) {
      var Obj = null;
      var Str = "";
      this.BeginUpdate();
      try {
        Obj = this.GetObject(Index1);
        Str = this.Get(Index1);
        this.PutObject(Index1,this.GetObject(Index2));
        this.Put(Index1,this.Get(Index2));
        this.PutObject(Index2,Obj);
        this.Put(Index2,Str);
      } finally {
        this.EndUpdate();
      };
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = $mod.TStringsEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.IndexOf = function (S) {
      var Result = 0;
      Result = 0;
      while ((Result < this.GetCount()) && (this.DoCompareText(this.Get(Result),S) !== 0)) Result = Result + 1;
      if (Result === this.GetCount()) Result = -1;
      return Result;
    };
    this.IndexOfName = function (Name) {
      var Result = 0;
      var len = 0;
      var S = "";
      this.CheckSpecialChars();
      Result = 0;
      while (Result < this.GetCount()) {
        S = this.Get(Result);
        len = pas.System.Pos(this.FNameValueSeparator,S) - 1;
        if ((len >= 0) && (this.DoCompareText(Name,pas.System.Copy(S,1,len)) === 0)) return Result;
        Result += 1;
      };
      Result = -1;
      return Result;
    };
    this.IndexOfObject = function (AObject) {
      var Result = 0;
      Result = 0;
      while ((Result < this.GetCount()) && (this.GetObject(Result) !== AObject)) Result = Result + 1;
      if (Result === this.GetCount()) Result = -1;
      return Result;
    };
    this.InsertObject = function (Index, S, AObject) {
      this.Insert(Index,S);
      this.PutObject(Index,AObject);
    };
    this.Move = function (CurIndex, NewIndex) {
      var Obj = null;
      var Str = "";
      this.BeginUpdate();
      try {
        Obj = this.GetObject(CurIndex);
        Str = this.Get(CurIndex);
        this.PutObject(CurIndex,null);
        this.Delete(CurIndex);
        this.InsertObject(NewIndex,Str,Obj);
      } finally {
        this.EndUpdate();
      };
    };
    this.GetNameValue = function (Index, AName, AValue) {
      var L = 0;
      this.CheckSpecialChars();
      AValue.set(this.Get(Index));
      L = pas.System.Pos(this.FNameValueSeparator,AValue.get());
      if (L !== 0) {
        AName.set(pas.System.Copy(AValue.get(),1,L - 1));
        AValue.set(pas.System.Copy(AValue.get(),L + 1,AValue.get().length - L));
      } else AName.set("");
    };
    this.LoadFromURL = function (aURL, Async, OnLoaded, OnError) {
      var $Self = this;
      function DoLoaded(aString) {
        $Self.SetTextStr(aString);
        if (OnLoaded != null) OnLoaded($Self);
      };
      function DoError(AError) {
        if (OnError != null) {
          OnError($Self,AError)}
         else throw pas.SysUtils.EInOutError.$create("Create$1",["Failed to load from URL:" + AError]);
      };
      $impl.CheckLoadHelper();
      $impl.GlobalLoadHelper.LoadText(aURL,Async,DoLoaded,DoError);
    };
    this.LoadFromFile = function (aFileName, OnLoaded, AError) {
      var $Self = this;
      this.LoadFromURL(aFileName,false,function (Sender) {
        if (OnLoaded != null) OnLoaded();
      },function (Sender, ErrorMsg) {
        if (AError != null) AError(ErrorMsg);
      });
    };
    this.ExtractName = function (S) {
      var Result = "";
      var L = 0;
      this.CheckSpecialChars();
      L = pas.System.Pos(this.FNameValueSeparator,S);
      if (L !== 0) {
        Result = pas.System.Copy(S,1,L - 1)}
       else Result = "";
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[]);
  });
  rtl.recNewT(this,"TStringItem",function () {
    this.FString = "";
    this.FObject = null;
    this.$eq = function (b) {
      return (this.FString === b.FString) && (this.FObject === b.FObject);
    };
    this.$assign = function (s) {
      this.FString = s.FString;
      this.FObject = s.FObject;
      return this;
    };
    var $r = $mod.$rtti.$Record("TStringItem",{});
    $r.addField("FString",rtl.string);
    $r.addField("FObject",pas.System.$rtti["TObject"]);
  });
  this.$rtti.$DynArray("TStringItemArray",{eltype: this.$rtti["TStringItem"]});
  this.$rtti.$Class("TStringList");
  this.$rtti.$ProcVar("TStringListSortCompare",{procsig: rtl.newTIProcSig([["List",this.$rtti["TStringList"]],["Index1",rtl.longint],["Index2",rtl.longint]],rtl.longint)});
  this.TStringsSortStyle = {"0": "sslNone", sslNone: 0, "1": "sslUser", sslUser: 1, "2": "sslAuto", sslAuto: 2};
  this.$rtti.$Enum("TStringsSortStyle",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TStringsSortStyle});
  this.$rtti.$Set("TStringsSortStyles",{comptype: this.$rtti["TStringsSortStyle"]});
  rtl.createClass(this,"TStringList",this.TStrings,function () {
    this.$init = function () {
      $mod.TStrings.$init.call(this);
      this.FList = [];
      this.FCount = 0;
      this.FOnChange = null;
      this.FOnChanging = null;
      this.FDuplicates = 0;
      this.FCaseSensitive = false;
      this.FForceSort = false;
      this.FOwnsObjects = false;
      this.FSortStyle = 0;
    };
    this.$final = function () {
      this.FList = undefined;
      this.FOnChange = undefined;
      this.FOnChanging = undefined;
      $mod.TStrings.$final.call(this);
    };
    this.ExchangeItemsInt = function (Index1, Index2) {
      var S = "";
      var O = null;
      S = this.FList[Index1].FString;
      O = this.FList[Index1].FObject;
      this.FList[Index1].FString = this.FList[Index2].FString;
      this.FList[Index1].FObject = this.FList[Index2].FObject;
      this.FList[Index2].FString = S;
      this.FList[Index2].FObject = O;
    };
    this.GetSorted = function () {
      var Result = false;
      Result = this.FSortStyle in rtl.createSet($mod.TStringsSortStyle.sslUser,$mod.TStringsSortStyle.sslAuto);
      return Result;
    };
    this.Grow = function () {
      var NC = 0;
      NC = this.GetCapacity();
      if (NC >= 256) {
        NC = NC + rtl.trunc(NC / 4)}
       else if (NC === 0) {
        NC = 4}
       else NC = NC * 4;
      this.SetCapacity(NC);
    };
    this.InternalClear = function (FromIndex, ClearOnly) {
      var I = 0;
      if (FromIndex < this.FCount) {
        if (this.FOwnsObjects) {
          for (var $l = FromIndex, $end = this.FCount - 1; $l <= $end; $l++) {
            I = $l;
            this.FList[I].FString = "";
            pas.SysUtils.FreeAndNil({p: this.FList[I], get: function () {
                return this.p.FObject;
              }, set: function (v) {
                this.p.FObject = v;
              }});
          };
        } else {
          for (var $l1 = FromIndex, $end1 = this.FCount - 1; $l1 <= $end1; $l1++) {
            I = $l1;
            this.FList[I].FString = "";
          };
        };
        this.FCount = FromIndex;
      };
      if (!ClearOnly) this.SetCapacity(0);
    };
    this.QuickSort = function (L, R, CompareFn) {
      var Pivot = 0;
      var vL = 0;
      var vR = 0;
      if ((R - L) <= 1) {
        if (L < R) if (CompareFn(this,L,R) > 0) this.ExchangeItems(L,R);
        return;
      };
      vL = L;
      vR = R;
      Pivot = L + pas.System.Random(R - L);
      while (vL < vR) {
        while ((vL < Pivot) && (CompareFn(this,vL,Pivot) <= 0)) vL += 1;
        while ((vR > Pivot) && (CompareFn(this,vR,Pivot) > 0)) vR -= 1;
        this.ExchangeItems(vL,vR);
        if (Pivot === vL) {
          Pivot = vR}
         else if (Pivot === vR) Pivot = vL;
      };
      if ((Pivot - 1) >= L) this.QuickSort(L,Pivot - 1,CompareFn);
      if ((Pivot + 1) <= R) this.QuickSort(Pivot + 1,R,CompareFn);
    };
    this.SetSorted = function (Value) {
      if (Value) {
        this.SetSortStyle($mod.TStringsSortStyle.sslAuto)}
       else this.SetSortStyle($mod.TStringsSortStyle.sslNone);
    };
    this.SetCaseSensitive = function (b) {
      if (b === this.FCaseSensitive) return;
      this.FCaseSensitive = b;
      if (this.FSortStyle === $mod.TStringsSortStyle.sslAuto) {
        this.FForceSort = true;
        try {
          this.Sort();
        } finally {
          this.FForceSort = false;
        };
      };
    };
    this.SetSortStyle = function (AValue) {
      if (this.FSortStyle === AValue) return;
      if (AValue === $mod.TStringsSortStyle.sslAuto) this.Sort();
      this.FSortStyle = AValue;
    };
    this.CheckIndex = function (AIndex) {
      if ((AIndex < 0) || (AIndex >= this.FCount)) this.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),AIndex);
    };
    this.ExchangeItems = function (Index1, Index2) {
      this.ExchangeItemsInt(Index1,Index2);
    };
    this.Changed = function () {
      if (this.FUpdateCount === 0) {
        if (this.FOnChange != null) this.FOnChange(this);
      };
    };
    this.Changing = function () {
      if (this.FUpdateCount === 0) if (this.FOnChanging != null) this.FOnChanging(this);
    };
    this.Get = function (Index) {
      var Result = "";
      this.CheckIndex(Index);
      Result = this.FList[Index].FString;
      return Result;
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = rtl.length(this.FList);
      return Result;
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FCount;
      return Result;
    };
    this.GetObject = function (Index) {
      var Result = null;
      this.CheckIndex(Index);
      Result = this.FList[Index].FObject;
      return Result;
    };
    this.Put = function (Index, S) {
      if (this.GetSorted()) this.Error(rtl.getResStr(pas.RTLConsts,"SSortedListError"),0);
      this.CheckIndex(Index);
      this.Changing();
      this.FList[Index].FString = S;
      this.Changed();
    };
    this.PutObject = function (Index, AObject) {
      this.CheckIndex(Index);
      this.Changing();
      this.FList[Index].FObject = AObject;
      this.Changed();
    };
    this.SetCapacity = function (NewCapacity) {
      if (NewCapacity < 0) this.Error(rtl.getResStr(pas.RTLConsts,"SListCapacityError"),NewCapacity);
      if (NewCapacity !== this.GetCapacity()) this.FList = rtl.arraySetLength(this.FList,$mod.TStringItem,NewCapacity);
    };
    this.SetUpdateState = function (Updating) {
      if (Updating) {
        this.Changing()}
       else this.Changed();
    };
    this.InsertItem = function (Index, S) {
      this.InsertItem$1(Index,S,null);
    };
    this.InsertItem$1 = function (Index, S, O) {
      var It = $mod.TStringItem.$new();
      this.Changing();
      if (this.FCount === this.GetCapacity()) this.Grow();
      It.FString = S;
      It.FObject = O;
      this.FList.splice(Index,0,It);
      this.FCount += 1;
      this.Changed();
    };
    this.DoCompareText = function (s1, s2) {
      var Result = 0;
      if (this.FCaseSensitive) {
        Result = pas.SysUtils.CompareStr(s1,s2)}
       else Result = pas.SysUtils.CompareText(s1,s2);
      return Result;
    };
    this.CompareStrings = function (s1, s2) {
      var Result = 0;
      Result = this.DoCompareText(s1,s2);
      return Result;
    };
    this.Destroy = function () {
      this.InternalClear(0,false);
      $mod.TStrings.Destroy.call(this);
    };
    this.Add = function (S) {
      var Result = 0;
      if (!(this.FSortStyle === $mod.TStringsSortStyle.sslAuto)) {
        Result = this.FCount}
       else if (this.Find(S,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }})) {
        var $tmp = this.FDuplicates;
        if ($tmp === pas.Types.TDuplicates.dupIgnore) {
          return Result}
         else if ($tmp === pas.Types.TDuplicates.dupError) this.Error(rtl.getResStr(pas.RTLConsts,"SDuplicateString"),0);
      };
      this.InsertItem(Result,S);
      return Result;
    };
    this.Clear = function () {
      if (this.FCount === 0) return;
      this.Changing();
      this.InternalClear(0,false);
      this.Changed();
    };
    this.Delete = function (Index) {
      this.CheckIndex(Index);
      this.Changing();
      if (this.FOwnsObjects) pas.SysUtils.FreeAndNil({p: this.FList[Index], get: function () {
          return this.p.FObject;
        }, set: function (v) {
          this.p.FObject = v;
        }});
      this.FList.splice(Index,1);
      this.FList[this.GetCount() - 1].FString = "";
      this.FList[this.GetCount() - 1].FObject = null;
      this.FCount -= 1;
      this.Changed();
    };
    this.Exchange = function (Index1, Index2) {
      this.CheckIndex(Index1);
      this.CheckIndex(Index2);
      this.Changing();
      this.ExchangeItemsInt(Index1,Index2);
      this.Changed();
    };
    this.Find = function (S, Index) {
      var Result = false;
      var L = 0;
      var R = 0;
      var I = 0;
      var CompareRes = 0;
      Result = false;
      Index.set(-1);
      if (!this.GetSorted()) throw $mod.EListError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SErrFindNeedsSortedList")]);
      L = 0;
      R = this.GetCount() - 1;
      while (L <= R) {
        I = L + rtl.trunc((R - L) / 2);
        CompareRes = this.DoCompareText(S,this.FList[I].FString);
        if (CompareRes > 0) {
          L = I + 1}
         else {
          R = I - 1;
          if (CompareRes === 0) {
            Result = true;
            if (this.FDuplicates !== pas.Types.TDuplicates.dupAccept) L = I;
          };
        };
      };
      Index.set(L);
      return Result;
    };
    this.IndexOf = function (S) {
      var Result = 0;
      if (!this.GetSorted()) {
        Result = $mod.TStrings.IndexOf.call(this,S)}
       else if (!this.Find(S,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }})) Result = -1;
      return Result;
    };
    this.Insert = function (Index, S) {
      if (this.FSortStyle === $mod.TStringsSortStyle.sslAuto) {
        this.Error(rtl.getResStr(pas.RTLConsts,"SSortedListError"),0)}
       else {
        if ((Index < 0) || (Index > this.FCount)) this.Error(rtl.getResStr(pas.RTLConsts,"SListIndexError"),Index);
        this.InsertItem(Index,S);
      };
    };
    this.Sort = function () {
      this.CustomSort($impl.StringListAnsiCompare);
    };
    this.CustomSort = function (CompareFn) {
      if ((this.FForceSort || !(this.FSortStyle === $mod.TStringsSortStyle.sslAuto)) && (this.FCount > 1)) {
        this.Changing();
        this.QuickSort(0,this.FCount - 1,CompareFn);
        this.Changed();
      };
    };
  });
  this.$rtti.$Class("TCollection");
  rtl.createClass(this,"TCollectionItem",this.TPersistent,function () {
    this.$init = function () {
      $mod.TPersistent.$init.call(this);
      this.FCollection = null;
      this.FID = 0;
      this.FUpdateCount = 0;
    };
    this.$final = function () {
      this.FCollection = undefined;
      $mod.TPersistent.$final.call(this);
    };
    this.GetIndex = function () {
      var Result = 0;
      if (this.FCollection != null) {
        Result = this.FCollection.FItems.IndexOf(this)}
       else Result = -1;
      return Result;
    };
    this.SetCollection = function (Value) {
      if (Value !== this.FCollection) {
        if (this.FCollection != null) this.FCollection.RemoveItem(this);
        if (Value != null) Value.InsertItem(this);
      };
    };
    this.Changed = function (AllItems) {
      if ((this.FCollection !== null) && (this.FCollection.FUpdateCount === 0)) {
        if (AllItems) {
          this.FCollection.Update(null)}
         else this.FCollection.Update(this);
      };
    };
    this.GetOwner = function () {
      var Result = null;
      Result = this.FCollection;
      return Result;
    };
    this.GetDisplayName = function () {
      var Result = "";
      Result = this.$classname;
      return Result;
    };
    this.SetIndex = function (Value) {
      var Temp = 0;
      Temp = this.GetIndex();
      if ((Temp > -1) && (Temp !== Value)) {
        this.FCollection.FItems.Move(Temp,Value);
        this.Changed(true);
      };
    };
    this.SetDisplayName = function (Value) {
      this.Changed(false);
      if (Value === "") ;
    };
    this.Create$1 = function (ACollection) {
      pas.System.TObject.Create.call(this);
      this.SetCollection(ACollection);
      return this;
    };
    this.Destroy = function () {
      this.SetCollection(null);
      pas.System.TObject.Destroy.call(this);
    };
    this.GetNamePath = function () {
      var Result = "";
      if (this.FCollection !== null) {
        Result = this.FCollection.GetNamePath() + "[" + pas.SysUtils.IntToStr(this.GetIndex()) + "]"}
       else Result = this.$classname;
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ACollection",$mod.$rtti["TCollection"]]]);
  });
  rtl.createClass(this,"TCollectionEnumerator",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FCollection = null;
      this.FPosition = 0;
    };
    this.$final = function () {
      this.FCollection = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (ACollection) {
      pas.System.TObject.Create.call(this);
      this.FCollection = ACollection;
      this.FPosition = -1;
      return this;
    };
    this.GetCurrent = function () {
      var Result = null;
      Result = this.FCollection.GetItem(this.FPosition);
      return Result;
    };
    this.MoveNext = function () {
      var Result = false;
      this.FPosition += 1;
      Result = this.FPosition < this.FCollection.GetCount();
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ACollection",$mod.$rtti["TCollection"]]]);
  });
  this.$rtti.$ClassRef("TCollectionItemClass",{instancetype: this.$rtti["TCollectionItem"]});
  this.TCollectionNotification = {"0": "cnAdded", cnAdded: 0, "1": "cnExtracting", cnExtracting: 1, "2": "cnDeleting", cnDeleting: 2};
  this.$rtti.$Enum("TCollectionNotification",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TCollectionNotification});
  this.$rtti.$ProcVar("TCollectionSortCompare",{procsig: rtl.newTIProcSig([["Item1",this.$rtti["TCollectionItem"]],["Item2",this.$rtti["TCollectionItem"]]],rtl.longint)});
  this.$rtti.$RefToProcVar("TCollectionSortCompareFunc",{procsig: rtl.newTIProcSig([["Item1",this.$rtti["TCollectionItem"]],["Item2",this.$rtti["TCollectionItem"]]],rtl.longint)});
  rtl.createClass(this,"TCollection",this.TPersistent,function () {
    this.$init = function () {
      $mod.TPersistent.$init.call(this);
      this.FItemClass = null;
      this.FItems = null;
      this.FUpdateCount = 0;
      this.FNextID = 0;
      this.FPropName = "";
    };
    this.$final = function () {
      this.FItemClass = undefined;
      this.FItems = undefined;
      $mod.TPersistent.$final.call(this);
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FItems.FCount;
      return Result;
    };
    this.GetPropName = function () {
      var Result = "";
      Result = this.FPropName;
      this.SetPropName();
      Result = this.FPropName;
      return Result;
    };
    this.InsertItem = function (Item) {
      if (!this.FItemClass.isPrototypeOf(Item)) return;
      this.FItems.Add(Item);
      Item.FCollection = this;
      Item.FID = this.FNextID;
      this.FNextID += 1;
      this.SetItemName(Item);
      this.Notify(Item,$mod.TCollectionNotification.cnAdded);
      this.Changed();
    };
    this.RemoveItem = function (Item) {
      var I = 0;
      this.Notify(Item,$mod.TCollectionNotification.cnExtracting);
      I = this.FItems.IndexOfItem(Item,pas.Types.TDirection.FromEnd);
      if (I !== -1) this.FItems.Delete(I);
      Item.FCollection = null;
      this.Changed();
    };
    this.DoClear = function () {
      var Item = null;
      while (this.FItems.FCount > 0) {
        Item = rtl.getObject(this.FItems.Last());
        if (Item != null) Item.$destroy("Destroy");
      };
    };
    this.GetAttrCount = function () {
      var Result = 0;
      Result = 0;
      return Result;
    };
    this.GetAttr = function (Index) {
      var Result = "";
      Result = "";
      if (Index === 0) ;
      return Result;
    };
    this.GetItemAttr = function (Index, ItemIndex) {
      var Result = "";
      Result = rtl.getObject(this.FItems.Get(ItemIndex)).GetDisplayName();
      if (Index === 0) ;
      return Result;
    };
    this.Changed = function () {
      if (this.FUpdateCount === 0) this.Update(null);
    };
    this.GetItem = function (Index) {
      var Result = null;
      Result = rtl.getObject(this.FItems.Get(Index));
      return Result;
    };
    this.SetItem = function (Index, Value) {
      rtl.getObject(this.FItems.Get(Index)).Assign(Value);
    };
    this.SetItemName = function (Item) {
      if (Item === null) ;
    };
    this.SetPropName = function () {
      this.FPropName = "";
    };
    this.Update = function (Item) {
      if (Item === null) ;
    };
    this.Notify = function (Item, Action) {
      if (Item === null) ;
      if (Action === $mod.TCollectionNotification.cnAdded) ;
    };
    this.Create$1 = function (AItemClass) {
      pas.System.TObject.Create.call(this);
      this.FItemClass = AItemClass;
      this.FItems = $mod.TFPList.$create("Create");
      return this;
    };
    this.Destroy = function () {
      this.FUpdateCount = 1;
      try {
        this.DoClear();
      } finally {
        this.FUpdateCount = 0;
      };
      if (this.FItems != null) this.FItems.$destroy("Destroy");
      pas.System.TObject.Destroy.call(this);
    };
    this.Owner = function () {
      var Result = null;
      Result = this.GetOwner();
      return Result;
    };
    this.Add = function () {
      var Result = null;
      Result = this.FItemClass.$create("Create$1",[this]);
      return Result;
    };
    this.Assign = function (Source) {
      var I = 0;
      if ($mod.TCollection.isPrototypeOf(Source)) {
        this.Clear();
        for (var $l = 0, $end = Source.GetCount() - 1; $l <= $end; $l++) {
          I = $l;
          this.Add().Assign(Source.GetItem(I));
        };
        return;
      } else $mod.TPersistent.Assign.call(this,Source);
    };
    this.BeginUpdate = function () {
      this.FUpdateCount += 1;
    };
    this.Clear = function () {
      if (this.FItems.FCount === 0) return;
      this.BeginUpdate();
      try {
        this.DoClear();
      } finally {
        this.EndUpdate();
      };
    };
    this.EndUpdate = function () {
      if (this.FUpdateCount > 0) this.FUpdateCount -= 1;
      if (this.FUpdateCount === 0) this.Changed();
    };
    this.Delete = function (Index) {
      var Item = null;
      Item = rtl.getObject(this.FItems.Get(Index));
      this.Notify(Item,$mod.TCollectionNotification.cnDeleting);
      if (Item != null) Item.$destroy("Destroy");
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = $mod.TCollectionEnumerator.$create("Create$1",[this]);
      return Result;
    };
    this.GetNamePath = function () {
      var Result = "";
      var o = null;
      o = this.GetOwner();
      if ((o != null) && (this.GetPropName() !== "")) {
        Result = o.GetNamePath() + "." + this.GetPropName()}
       else Result = this.$classname;
      return Result;
    };
    this.Insert = function (Index) {
      var Result = null;
      Result = this.Add();
      Result.SetIndex(Index);
      return Result;
    };
    this.FindItemID = function (ID) {
      var Result = null;
      var I = 0;
      for (var $l = 0, $end = this.FItems.FCount - 1; $l <= $end; $l++) {
        I = $l;
        Result = rtl.getObject(this.FItems.Get(I));
        if (Result.FID === ID) return Result;
      };
      Result = null;
      return Result;
    };
    this.Exchange = function (Index1, index2) {
      this.FItems.Exchange(Index1,index2);
    };
    this.Sort = function (Compare) {
      this.BeginUpdate();
      try {
        this.FItems.Sort(Compare);
      } finally {
        this.EndUpdate();
      };
    };
    this.SortList = function (Compare) {
      this.BeginUpdate();
      try {
        this.FItems.SortList(Compare);
      } finally {
        this.EndUpdate();
      };
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AItemClass",$mod.$rtti["TCollectionItemClass"]]]);
  });
  rtl.createClass(this,"TOwnedCollection",this.TCollection,function () {
    this.$init = function () {
      $mod.TCollection.$init.call(this);
      this.FOwner = null;
    };
    this.$final = function () {
      this.FOwner = undefined;
      $mod.TCollection.$final.call(this);
    };
    this.GetOwner = function () {
      var Result = null;
      Result = this.FOwner;
      return Result;
    };
    this.Create$2 = function (AOwner, AItemClass) {
      this.FOwner = AOwner;
      $mod.TCollection.Create$1.call(this,AItemClass);
      return this;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["AOwner",$mod.$rtti["TPersistent"]],["AItemClass",$mod.$rtti["TCollectionItemClass"]]]);
  });
  this.$rtti.$Class("TComponent");
  this.TOperation = {"0": "opInsert", opInsert: 0, "1": "opRemove", opRemove: 1};
  this.$rtti.$Enum("TOperation",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TOperation});
  this.TComponentStateItem = {"0": "csLoading", csLoading: 0, "1": "csReading", csReading: 1, "2": "csWriting", csWriting: 2, "3": "csDestroying", csDestroying: 3, "4": "csDesigning", csDesigning: 4, "5": "csAncestor", csAncestor: 5, "6": "csUpdating", csUpdating: 6, "7": "csFixups", csFixups: 7, "8": "csFreeNotification", csFreeNotification: 8, "9": "csInline", csInline: 9, "10": "csDesignInstance", csDesignInstance: 10};
  this.$rtti.$Enum("TComponentStateItem",{minvalue: 0, maxvalue: 10, ordtype: 1, enumtype: this.TComponentStateItem});
  this.$rtti.$Set("TComponentState",{comptype: this.$rtti["TComponentStateItem"]});
  this.TComponentStyleItem = {"0": "csInheritable", csInheritable: 0, "1": "csCheckPropAvail", csCheckPropAvail: 1, "2": "csSubComponent", csSubComponent: 2, "3": "csTransient", csTransient: 3};
  this.$rtti.$Enum("TComponentStyleItem",{minvalue: 0, maxvalue: 3, ordtype: 1, enumtype: this.TComponentStyleItem});
  this.$rtti.$Set("TComponentStyle",{comptype: this.$rtti["TComponentStyleItem"]});
  this.$rtti.$MethodVar("TGetChildProc",{procsig: rtl.newTIProcSig([["Child",this.$rtti["TComponent"]]]), methodkind: 0});
  rtl.createClass(this,"TComponentEnumerator",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FComponent = null;
      this.FPosition = 0;
    };
    this.$final = function () {
      this.FComponent = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Create$1 = function (AComponent) {
      pas.System.TObject.Create.call(this);
      this.FComponent = AComponent;
      this.FPosition = -1;
      return this;
    };
    this.GetCurrent = function () {
      var Result = null;
      Result = this.FComponent.GetComponent(this.FPosition);
      return Result;
    };
    this.MoveNext = function () {
      var Result = false;
      this.FPosition += 1;
      Result = this.FPosition < this.FComponent.GetComponentCount();
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AComponent",$mod.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TComponent",this.TPersistent,function () {
    this.$init = function () {
      $mod.TPersistent.$init.call(this);
      this.FOwner = null;
      this.FName = "";
      this.FTag = 0;
      this.FComponents = null;
      this.FFreeNotifies = null;
      this.FDesignInfo = 0;
      this.FComponentState = {};
      this.FComponentStyle = {};
    };
    this.$final = function () {
      this.FOwner = undefined;
      this.FComponents = undefined;
      this.FFreeNotifies = undefined;
      this.FComponentState = undefined;
      this.FComponentStyle = undefined;
      $mod.TPersistent.$final.call(this);
    };
    this.GetComponent = function (AIndex) {
      var Result = null;
      if (!(this.FComponents != null)) {
        Result = null}
       else Result = rtl.getObject(this.FComponents.Get(AIndex));
      return Result;
    };
    this.GetComponentCount = function () {
      var Result = 0;
      if (!(this.FComponents != null)) {
        Result = 0}
       else Result = this.FComponents.FCount;
      return Result;
    };
    this.GetComponentIndex = function () {
      var Result = 0;
      if ((this.FOwner != null) && (this.FOwner.FComponents != null)) {
        Result = this.FOwner.FComponents.IndexOf(this)}
       else Result = -1;
      return Result;
    };
    this.Insert = function (AComponent) {
      if (!(this.FComponents != null)) this.FComponents = $mod.TFPList.$create("Create");
      this.FComponents.Add(AComponent);
      AComponent.FOwner = this;
    };
    this.ReadLeft = function (AReader) {
      this.FDesignInfo = (this.FDesignInfo & 0xffff0000) | (AReader.ReadInteger() & 0xffff);
    };
    this.ReadTop = function (AReader) {
      this.FDesignInfo = ((AReader.ReadInteger() & 0xffff) << 16) | (this.FDesignInfo & 0xffff);
    };
    this.Remove = function (AComponent) {
      AComponent.FOwner = null;
      if (this.FComponents != null) {
        this.FComponents.Remove(AComponent);
        if (this.FComponents.FCount === 0) {
          this.FComponents.$destroy("Destroy");
          this.FComponents = null;
        };
      };
    };
    this.RemoveNotification = function (AComponent) {
      if (this.FFreeNotifies !== null) {
        this.FFreeNotifies.Remove(AComponent);
        if (this.FFreeNotifies.FCount === 0) {
          this.FFreeNotifies.$destroy("Destroy");
          this.FFreeNotifies = null;
          this.FComponentState = rtl.excludeSet(this.FComponentState,$mod.TComponentStateItem.csFreeNotification);
        };
      };
    };
    this.SetComponentIndex = function (Value) {
      var Temp = 0;
      var Count = 0;
      if (!(this.FOwner != null)) return;
      Temp = this.GetComponentIndex();
      if (Temp < 0) return;
      if (Value < 0) Value = 0;
      Count = this.FOwner.FComponents.FCount;
      if (Value >= Count) Value = Count - 1;
      if (Value !== Temp) {
        this.FOwner.FComponents.Delete(Temp);
        this.FOwner.FComponents.Insert(Value,this);
      };
    };
    this.SetReference = function (Enable) {
      var aField = null;
      var aValue = null;
      var aOwner = null;
      if (this.FName === "") return;
      if (this.FOwner != null) {
        aOwner = this.FOwner;
        aField = this.FOwner.$class.FieldAddress(this.FName);
        if (aField != null) {
          if (Enable) {
            aValue = this}
           else aValue = null;
          aOwner["" + aField["name"]] = aValue;
        };
      };
    };
    this.WriteLeft = function (AWriter) {
      AWriter.WriteInteger(this.FDesignInfo & 0xffff);
    };
    this.WriteTop = function (AWriter) {
      AWriter.WriteInteger((this.FDesignInfo >>> 16) & 0xffff);
    };
    this.ChangeName = function (NewName) {
      this.FName = NewName;
    };
    this.DefineProperties = function (Filer) {
      var Temp = 0;
      var Ancestor = null;
      Ancestor = Filer.FAncestor;
      if (Ancestor != null) {
        Temp = Ancestor.FDesignInfo}
       else Temp = 0;
      Filer.DefineProperty("Left",rtl.createCallback(this,"ReadLeft"),rtl.createCallback(this,"WriteLeft"),(this.FDesignInfo & 0xffff) !== (Temp & 0xffff));
      Filer.DefineProperty("Top",rtl.createCallback(this,"ReadTop"),rtl.createCallback(this,"WriteTop"),(this.FDesignInfo & 0xffff0000) !== (Temp & 0xffff0000));
    };
    this.GetChildren = function (Proc, Root) {
      if (Proc === null) ;
      if (Root === null) ;
    };
    this.GetChildOwner = function () {
      var Result = null;
      Result = null;
      return Result;
    };
    this.GetChildParent = function () {
      var Result = null;
      Result = this;
      return Result;
    };
    this.GetOwner = function () {
      var Result = null;
      Result = this.FOwner;
      return Result;
    };
    this.Loaded = function () {
      this.FComponentState = rtl.excludeSet(this.FComponentState,$mod.TComponentStateItem.csLoading);
    };
    this.Loading = function () {
      this.FComponentState = rtl.includeSet(this.FComponentState,$mod.TComponentStateItem.csLoading);
    };
    this.SetWriting = function (Value) {
      if (Value) {
        this.FComponentState = rtl.includeSet(this.FComponentState,$mod.TComponentStateItem.csWriting)}
       else this.FComponentState = rtl.excludeSet(this.FComponentState,$mod.TComponentStateItem.csWriting);
    };
    this.SetReading = function (Value) {
      if (Value) {
        this.FComponentState = rtl.includeSet(this.FComponentState,$mod.TComponentStateItem.csReading)}
       else this.FComponentState = rtl.excludeSet(this.FComponentState,$mod.TComponentStateItem.csReading);
    };
    this.Notification = function (AComponent, Operation) {
      var C = 0;
      if (Operation === $mod.TOperation.opRemove) this.RemoveFreeNotification(AComponent);
      if (!(this.FComponents != null)) return;
      C = this.FComponents.FCount - 1;
      while (C >= 0) {
        rtl.getObject(this.FComponents.Get(C)).Notification(AComponent,Operation);
        C -= 1;
        if (C >= this.FComponents.FCount) C = this.FComponents.FCount - 1;
      };
    };
    this.PaletteCreated = function () {
    };
    this.ReadState = function (Reader) {
      Reader.ReadData(this);
    };
    this.SetAncestor = function (Value) {
      var Runner = 0;
      if (Value) {
        this.FComponentState = rtl.includeSet(this.FComponentState,$mod.TComponentStateItem.csAncestor)}
       else this.FComponentState = rtl.excludeSet(this.FComponentState,$mod.TComponentStateItem.csAncestor);
      if (this.FComponents != null) for (var $l = 0, $end = this.FComponents.FCount - 1; $l <= $end; $l++) {
        Runner = $l;
        rtl.getObject(this.FComponents.Get(Runner)).SetAncestor(Value);
      };
    };
    this.SetDesigning = function (Value, SetChildren) {
      var Runner = 0;
      if (Value) {
        this.FComponentState = rtl.includeSet(this.FComponentState,$mod.TComponentStateItem.csDesigning)}
       else this.FComponentState = rtl.excludeSet(this.FComponentState,$mod.TComponentStateItem.csDesigning);
      if ((this.FComponents != null) && SetChildren) for (var $l = 0, $end = this.FComponents.FCount - 1; $l <= $end; $l++) {
        Runner = $l;
        rtl.getObject(this.FComponents.Get(Runner)).SetDesigning(Value,true);
      };
    };
    this.SetDesignInstance = function (Value) {
      if (Value) {
        this.FComponentState = rtl.includeSet(this.FComponentState,$mod.TComponentStateItem.csDesignInstance)}
       else this.FComponentState = rtl.excludeSet(this.FComponentState,$mod.TComponentStateItem.csDesignInstance);
    };
    this.SetInline = function (Value) {
      if (Value) {
        this.FComponentState = rtl.includeSet(this.FComponentState,$mod.TComponentStateItem.csInline)}
       else this.FComponentState = rtl.excludeSet(this.FComponentState,$mod.TComponentStateItem.csInline);
    };
    this.SetName = function (NewName) {
      if (this.FName === NewName) return;
      if ((NewName !== "") && !pas.SysUtils.IsValidIdent(NewName,false,false)) throw $mod.EComponentError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SInvalidName"),pas.System.VarRecs(18,NewName)]);
      if (this.FOwner != null) {
        this.FOwner.ValidateRename(this,this.FName,NewName)}
       else this.ValidateRename(null,this.FName,NewName);
      this.SetReference(false);
      this.ChangeName(NewName);
      this.SetReference(true);
    };
    this.SetChildOrder = function (Child, Order) {
      if (Child === null) ;
      if (Order === 0) ;
    };
    this.SetParentComponent = function (Value) {
      if (Value === null) ;
    };
    this.Updating = function () {
      this.FComponentState = rtl.includeSet(this.FComponentState,$mod.TComponentStateItem.csUpdating);
    };
    this.Updated = function () {
      this.FComponentState = rtl.excludeSet(this.FComponentState,$mod.TComponentStateItem.csUpdating);
    };
    this.ValidateRename = function (AComponent, CurName, NewName) {
      if ((AComponent !== null) && (pas.SysUtils.CompareText(CurName,NewName) !== 0) && (AComponent.FOwner === this) && (this.FindComponent(NewName) !== null)) throw $mod.EComponentError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SDuplicateName"),pas.System.VarRecs(18,NewName)]);
      if (($mod.TComponentStateItem.csDesigning in this.FComponentState) && (this.FOwner !== null)) this.FOwner.ValidateRename(AComponent,CurName,NewName);
    };
    this.ValidateContainer = function (AComponent) {
      AComponent.ValidateInsert(this);
    };
    this.ValidateInsert = function (AComponent) {
      if (AComponent === null) ;
    };
    this._AddRef = function () {
      var Result = 0;
      Result = -1;
      return Result;
    };
    this._Release = function () {
      var Result = 0;
      Result = -1;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      this.FComponentStyle = rtl.createSet($mod.TComponentStyleItem.csInheritable);
      if (AOwner != null) AOwner.InsertComponent(this);
      return this;
    };
    this.Destroy = function () {
      var I = 0;
      var C = null;
      this.Destroying();
      if (this.FFreeNotifies != null) {
        I = this.FFreeNotifies.FCount - 1;
        while (I >= 0) {
          C = rtl.getObject(this.FFreeNotifies.Get(I));
          this.FFreeNotifies.Delete(I);
          C.Notification(this,$mod.TOperation.opRemove);
          if (this.FFreeNotifies === null) {
            I = 0}
           else if (I > this.FFreeNotifies.FCount) I = this.FFreeNotifies.FCount;
          I -= 1;
        };
        pas.SysUtils.FreeAndNil({p: this, get: function () {
            return this.p.FFreeNotifies;
          }, set: function (v) {
            this.p.FFreeNotifies = v;
          }});
      };
      this.DestroyComponents();
      if (this.FOwner !== null) this.FOwner.RemoveComponent(this);
      pas.System.TObject.Destroy.call(this);
    };
    this.BeforeDestruction = function () {
      if (!($mod.TComponentStateItem.csDestroying in this.FComponentState)) this.Destroying();
    };
    this.DestroyComponents = function () {
      var acomponent = null;
      while (this.FComponents != null) {
        acomponent = rtl.getObject(this.FComponents.Last());
        this.Remove(acomponent);
        acomponent.$destroy("Destroy");
      };
    };
    this.Destroying = function () {
      var Runner = 0;
      if ($mod.TComponentStateItem.csDestroying in this.FComponentState) return;
      this.FComponentState = rtl.includeSet(this.FComponentState,$mod.TComponentStateItem.csDestroying);
      if (this.FComponents != null) for (var $l = 0, $end = this.FComponents.FCount - 1; $l <= $end; $l++) {
        Runner = $l;
        rtl.getObject(this.FComponents.Get(Runner)).Destroying();
      };
    };
    this.QueryInterface = function (IID, Obj) {
      var Result = 0;
      if (this.GetInterface(IID,Obj)) {
        Result = 0}
       else Result = -2147467262;
      return Result;
    };
    this.WriteState = function (Writer) {
      Writer.WriteComponentData(this);
    };
    this.FindComponent = function (AName) {
      var Result = null;
      var I = 0;
      Result = null;
      if ((AName === "") || !(this.FComponents != null)) return Result;
      for (var $l = 0, $end = this.FComponents.FCount - 1; $l <= $end; $l++) {
        I = $l;
        if (pas.SysUtils.CompareText(rtl.getObject(this.FComponents.Get(I)).FName,AName) === 0) {
          Result = rtl.getObject(this.FComponents.Get(I));
          return Result;
        };
      };
      return Result;
    };
    this.FreeNotification = function (AComponent) {
      if ((this.FOwner !== null) && (AComponent === this.FOwner)) return;
      if (!(this.FFreeNotifies != null)) this.FFreeNotifies = $mod.TFPList.$create("Create");
      if (this.FFreeNotifies.IndexOf(AComponent) === -1) {
        this.FFreeNotifies.Add(AComponent);
        AComponent.FreeNotification(this);
      };
    };
    this.RemoveFreeNotification = function (AComponent) {
      this.RemoveNotification(AComponent);
      AComponent.RemoveNotification(this);
    };
    this.GetNamePath = function () {
      var Result = "";
      Result = this.FName;
      return Result;
    };
    this.GetParentComponent = function () {
      var Result = null;
      Result = null;
      return Result;
    };
    this.HasParent = function () {
      var Result = false;
      Result = false;
      return Result;
    };
    this.InsertComponent = function (AComponent) {
      AComponent.ValidateContainer(this);
      this.ValidateRename(AComponent,"",AComponent.FName);
      if (AComponent.FOwner !== null) AComponent.FOwner.RemoveComponent(AComponent);
      this.Insert(AComponent);
      if ($mod.TComponentStateItem.csDesigning in this.FComponentState) AComponent.SetDesigning(true,true);
      this.Notification(AComponent,$mod.TOperation.opInsert);
    };
    this.RemoveComponent = function (AComponent) {
      this.Notification(AComponent,$mod.TOperation.opRemove);
      this.Remove(AComponent);
      AComponent.SetDesigning(false,true);
      this.ValidateRename(AComponent,AComponent.FName,"");
    };
    this.SetSubComponent = function (ASubComponent) {
      if (ASubComponent) {
        this.FComponentStyle = rtl.includeSet(this.FComponentStyle,$mod.TComponentStyleItem.csSubComponent)}
       else this.FComponentStyle = rtl.excludeSet(this.FComponentStyle,$mod.TComponentStyleItem.csSubComponent);
    };
    this.GetEnumerator = function () {
      var Result = null;
      Result = $mod.TComponentEnumerator.$create("Create$1",[this]);
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",$r]]);
    $r.addProperty("Name",6,rtl.string,"FName","SetName");
    $r.addProperty("Tag",0,rtl.nativeint,"FTag","FTag",{Default: 0});
  });
  this.$rtti.$ClassRef("TComponentClass",{instancetype: this.$rtti["TComponent"]});
  this.TSeekOrigin = {"0": "soBeginning", soBeginning: 0, "1": "soCurrent", soCurrent: 1, "2": "soEnd", soEnd: 2};
  this.$rtti.$Enum("TSeekOrigin",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TSeekOrigin});
  rtl.createClass(this,"TStream",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FEndian = 0;
    };
    this.MakeInt = function (B, aSize, Signed) {
      var Result = 0;
      var Mem = null;
      var A = null;
      var D = null;
      var isLittle = false;
      isLittle = this.FEndian === pas.SysUtils.TEndian.Little;
      Mem = new ArrayBuffer(rtl.length(B));
      A = new Uint8Array(Mem);
      A.set(B);
      D = new DataView(Mem);
      if (Signed) {
        var $tmp = aSize;
        if ($tmp === 1) {
          Result = D.getInt8(0)}
         else if ($tmp === 2) {
          Result = D.getInt16(0,isLittle)}
         else if ($tmp === 4) {
          Result = D.getInt32(0,isLittle)}
         else if ($tmp === 8) Result = Math.round(D.getFloat64(0,isLittle));
      } else {
        var $tmp1 = aSize;
        if ($tmp1 === 1) {
          Result = D.getUint8(0)}
         else if ($tmp1 === 2) {
          Result = D.getUint16(0,isLittle)}
         else if ($tmp1 === 4) {
          Result = D.getUint32(0,isLittle)}
         else if ($tmp1 === 8) Result = Math.round(D.getFloat64(0,isLittle));
      };
      return Result;
    };
    this.MakeBytes = function (B, aSize, Signed) {
      var Result = [];
      var Mem = null;
      var A = null;
      var D = null;
      var isLittle = false;
      isLittle = this.FEndian === pas.SysUtils.TEndian.Little;
      Mem = new ArrayBuffer(aSize);
      D = new DataView(Mem);
      if (Signed) {
        var $tmp = aSize;
        if ($tmp === 1) {
          D.setInt8(0,B)}
         else if ($tmp === 2) {
          D.setInt16(0,B,isLittle)}
         else if ($tmp === 4) {
          D.setInt32(0,B,isLittle)}
         else if ($tmp === 8) D.setFloat64(0,B,isLittle);
      } else {
        var $tmp1 = aSize;
        if ($tmp1 === 1) {
          D.setUint8(0,B)}
         else if ($tmp1 === 2) {
          D.setUint16(0,B,isLittle)}
         else if ($tmp1 === 4) {
          D.setUint32(0,B,isLittle)}
         else if ($tmp1 === 8) D.setFloat64(0,B,isLittle);
      };
      Result = rtl.arraySetLength(Result,0,aSize);
      A = new Uint8Array(Mem);
      Result = $mod.TMemoryStream.MemoryToBytes$1(A);
      return Result;
    };
    this.InvalidSeek = function () {
      throw $mod.EStreamError.$create("CreateFmt",[rtl.getResStr($mod,"SStreamInvalidSeek"),pas.System.VarRecs(18,this.$classname)]);
    };
    var CSmallSize = 255;
    var CLargeMaxBuffer = 32 * 1024;
    this.Discard = function (Count) {
      var Buffer = [];
      if (Count === 0) return;
      if (Count <= 255) {
        Buffer = rtl.arraySetLength(Buffer,0,255);
        this.ReadBuffer({get: function () {
            return Buffer;
          }, set: function (v) {
            Buffer = v;
          }},Count);
      } else this.DiscardLarge(Count,32768);
    };
    this.DiscardLarge = function (Count, MaxBufferSize) {
      var Buffer = [];
      if (Count === 0) return;
      if (Count > MaxBufferSize) {
        Buffer = rtl.arraySetLength(Buffer,0,MaxBufferSize)}
       else Buffer = rtl.arraySetLength(Buffer,0,Count);
      while (Count >= rtl.length(Buffer)) {
        this.ReadBuffer({get: function () {
            return Buffer;
          }, set: function (v) {
            Buffer = v;
          }},rtl.length(Buffer));
        Count -= rtl.length(Buffer);
      };
      if (Count > 0) this.ReadBuffer({get: function () {
          return Buffer;
        }, set: function (v) {
          Buffer = v;
        }},Count);
    };
    this.FakeSeekForward = function (Offset, Origin, Pos) {
      if (Origin === $mod.TSeekOrigin.soBeginning) Offset -= Pos;
      if ((Offset < 0) || (Origin === $mod.TSeekOrigin.soEnd)) this.InvalidSeek();
      if (Offset > 0) this.Discard(Offset);
    };
    this.GetPosition = function () {
      var Result = 0;
      Result = this.Seek(0,$mod.TSeekOrigin.soCurrent);
      return Result;
    };
    this.SetPosition = function (Pos) {
      this.Seek(Pos,$mod.TSeekOrigin.soBeginning);
    };
    this.GetSize = function () {
      var Result = 0;
      var p = 0;
      p = this.Seek(0,$mod.TSeekOrigin.soCurrent);
      Result = this.Seek(0,$mod.TSeekOrigin.soEnd);
      this.Seek(p,$mod.TSeekOrigin.soBeginning);
      return Result;
    };
    this.SetSize = function (NewSize) {
      if (NewSize < 0) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SerrInvalidStreamSize")]);
    };
    this.SetSize64 = function (NewSize) {
      this.SetSize(NewSize);
    };
    this.ReadNotImplemented = function () {
      throw $mod.EStreamError.$create("CreateFmt",[rtl.getResStr($mod,"SStreamNoReading"),pas.System.VarRecs(18,this.$classname)]);
    };
    this.WriteNotImplemented = function () {
      throw $mod.EStreamError.$create("CreateFmt",[rtl.getResStr($mod,"SStreamNoWriting"),pas.System.VarRecs(18,this.$classname)]);
    };
    this.ReadMaxSizeData = function (Buffer, aSize, aCount) {
      var Result = 0;
      var CP = 0;
      if (aCount <= aSize) {
        Result = this.Read({get: function () {
            return Buffer;
          }, set: function (v) {
            Buffer = v;
          }},aCount)}
       else {
        Result = this.Read({get: function () {
            return Buffer;
          }, set: function (v) {
            Buffer = v;
          }},aSize);
        CP = this.GetPosition();
        Result = (Result + this.Seek(aCount - aSize,$mod.TSeekOrigin.soCurrent)) - CP;
      };
      return Result;
    };
    this.ReadExactSizeData = function (Buffer, aSize, aCount) {
      if (this.ReadMaxSizeData(rtl.arrayRef(Buffer),aSize,aCount) !== aCount) throw $mod.EReadError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.WriteMaxSizeData = function (Buffer, aSize, aCount) {
      var Result = 0;
      var CP = 0;
      if (aCount <= aSize) {
        Result = this.Write(Buffer,aCount)}
       else {
        Result = this.Write(Buffer,aSize);
        CP = this.GetPosition();
        Result = (Result + this.Seek(aCount - aSize,$mod.TSeekOrigin.soCurrent)) - CP;
      };
      return Result;
    };
    this.WriteExactSizeData = function (Buffer, aSize, aCount) {
      this.WriteMaxSizeData(Buffer,aSize,aCount);
    };
    this.Read = function (Buffer, Count) {
      var Result = 0;
      Result = this.Read$1(rtl.arrayRef(Buffer.get()),0,Count);
      return Result;
    };
    this.Write = function (Buffer, Count) {
      var Result = 0;
      Result = this.Write$1(Buffer,0,Count);
      return Result;
    };
    this.ReadData = function (Buffer, Count) {
      var Result = 0;
      Result = this.Read$1(rtl.arrayRef(Buffer),0,Count);
      return Result;
    };
    this.ReadData$1 = function (Buffer) {
      var Result = 0;
      var B = 0;
      Result = this.ReadData$8({get: function () {
          return B;
        }, set: function (v) {
          B = v;
        }},1);
      if (Result === 1) Buffer.set(B !== 0);
      return Result;
    };
    this.ReadData$2 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),1,Count);
      if (Result > 0) Buffer.set(B[0] !== 0);
      return Result;
    };
    this.ReadData$3 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$4(Buffer,2);
      return Result;
    };
    this.ReadData$4 = function (Buffer, Count) {
      var Result = 0;
      var W = 0;
      Result = this.ReadData$12({get: function () {
          return W;
        }, set: function (v) {
          W = v;
        }},Count);
      if (Result === 2) Buffer.set(String.fromCharCode(W));
      return Result;
    };
    this.ReadData$5 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$6(Buffer,1);
      return Result;
    };
    this.ReadData$6 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),1,Count);
      if (Result >= 1) Buffer.set(this.MakeInt(rtl.arrayRef(B),1,true));
      return Result;
    };
    this.ReadData$7 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$8(Buffer,1);
      return Result;
    };
    this.ReadData$8 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),1,Count);
      if (Result >= 1) Buffer.set(this.MakeInt(rtl.arrayRef(B),1,false));
      return Result;
    };
    this.ReadData$9 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$10(Buffer,2);
      return Result;
    };
    this.ReadData$10 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),2,Count);
      if (Result >= 2) Buffer.set(this.MakeInt(rtl.arrayRef(B),2,true));
      return Result;
    };
    this.ReadData$11 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$12(Buffer,2);
      return Result;
    };
    this.ReadData$12 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),2,Count);
      if (Result >= 2) Buffer.set(this.MakeInt(rtl.arrayRef(B),2,false));
      return Result;
    };
    this.ReadData$13 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$14(Buffer,4);
      return Result;
    };
    this.ReadData$14 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),4,Count);
      if (Result >= 4) Buffer.set(this.MakeInt(rtl.arrayRef(B),4,true));
      return Result;
    };
    this.ReadData$15 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$16(Buffer,4);
      return Result;
    };
    this.ReadData$16 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),4,Count);
      if (Result >= 4) Buffer.set(this.MakeInt(rtl.arrayRef(B),4,false));
      return Result;
    };
    this.ReadData$17 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$18(Buffer,8);
      return Result;
    };
    this.ReadData$18 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),8,8);
      if (Result >= 8) Buffer.set(this.MakeInt(rtl.arrayRef(B),8,true));
      return Result;
    };
    this.ReadData$19 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$20(Buffer,8);
      return Result;
    };
    this.ReadData$20 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      var B1 = 0;
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),4,4);
      if (Result >= 4) {
        B1 = this.MakeInt(rtl.arrayRef(B),4,false);
        Result = Result + this.ReadMaxSizeData(rtl.arrayRef(B),4,4);
        Buffer.set(this.MakeInt(rtl.arrayRef(B),4,false));
        Buffer.set(rtl.or(rtl.shl(Buffer.get(),32),B1));
      };
      return Result;
    };
    this.ReadData$21 = function (Buffer) {
      var Result = 0;
      Result = this.ReadData$22(Buffer,8);
      return Result;
    };
    this.ReadData$22 = function (Buffer, Count) {
      var Result = 0;
      var B = [];
      var Mem = null;
      var A = null;
      var D = null;
      B = rtl.arraySetLength(B,0,Count);
      Result = this.ReadMaxSizeData(rtl.arrayRef(B),8,Count);
      if (Result >= 8) {
        Mem = new ArrayBuffer(8);
        A = new Uint8Array(Mem);
        A.set(B);
        D = new DataView(Mem);
        Buffer.set(D.getFloat64(0));
      };
      return Result;
    };
    this.ReadBuffer = function (Buffer, Count) {
      this.ReadBuffer$1(Buffer,0,Count);
    };
    this.ReadBuffer$1 = function (Buffer, Offset, Count) {
      if (this.Read$1(rtl.arrayRef(Buffer.get()),Offset,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData = function (Buffer) {
      this.ReadBufferData$1(Buffer,1);
    };
    this.ReadBufferData$1 = function (Buffer, Count) {
      if (this.ReadData$2(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$2 = function (Buffer) {
      this.ReadBufferData$3(Buffer,2);
    };
    this.ReadBufferData$3 = function (Buffer, Count) {
      if (this.ReadData$4(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$4 = function (Buffer) {
      this.ReadBufferData$5(Buffer,1);
    };
    this.ReadBufferData$5 = function (Buffer, Count) {
      if (this.ReadData$6(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$6 = function (Buffer) {
      this.ReadBufferData$7(Buffer,1);
    };
    this.ReadBufferData$7 = function (Buffer, Count) {
      if (this.ReadData$8(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$8 = function (Buffer) {
      this.ReadBufferData$9(Buffer,2);
    };
    this.ReadBufferData$9 = function (Buffer, Count) {
      if (this.ReadData$10(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$10 = function (Buffer) {
      this.ReadBufferData$11(Buffer,2);
    };
    this.ReadBufferData$11 = function (Buffer, Count) {
      if (this.ReadData$12(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$12 = function (Buffer) {
      this.ReadBufferData$13(Buffer,4);
    };
    this.ReadBufferData$13 = function (Buffer, Count) {
      if (this.ReadData$14(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$14 = function (Buffer) {
      this.ReadBufferData$15(Buffer,4);
    };
    this.ReadBufferData$15 = function (Buffer, Count) {
      if (this.ReadData$16(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$16 = function (Buffer) {
      this.ReadBufferData$17(Buffer,8);
    };
    this.ReadBufferData$17 = function (Buffer, Count) {
      if (this.ReadData$18(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$18 = function (Buffer) {
      this.ReadBufferData$19(Buffer,8);
    };
    this.ReadBufferData$19 = function (Buffer, Count) {
      if (this.ReadData$20(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.ReadBufferData$20 = function (Buffer) {
      this.ReadBufferData$21(Buffer,8);
    };
    this.ReadBufferData$21 = function (Buffer, Count) {
      if (this.ReadData$22(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SReadError")]);
    };
    this.WriteBuffer = function (Buffer, Count) {
      this.WriteBuffer$1(Buffer,0,Count);
    };
    this.WriteBuffer$1 = function (Buffer, Offset, Count) {
      if (this.Write$1(Buffer,Offset,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteData = function (Buffer, Count) {
      var Result = 0;
      Result = this.Write$1(Buffer,0,Count);
      return Result;
    };
    this.WriteData$1 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$2(Buffer,1);
      return Result;
    };
    this.WriteData$2 = function (Buffer, Count) {
      var Result = 0;
      var B = 0;
      B = Buffer + 0;
      Result = this.WriteData$6(B,Count);
      return Result;
    };
    this.WriteData$3 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$4(Buffer,2);
      return Result;
    };
    this.WriteData$4 = function (Buffer, Count) {
      var Result = 0;
      var U = 0;
      U = Buffer.charCodeAt();
      Result = this.WriteData$12(U,Count);
      return Result;
    };
    this.WriteData$5 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$6(Buffer,1);
      return Result;
    };
    this.WriteData$6 = function (Buffer, Count) {
      var Result = 0;
      Result = this.WriteMaxSizeData(this.MakeBytes(Buffer,1,true),1,Count);
      return Result;
    };
    this.WriteData$7 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$8(Buffer,1);
      return Result;
    };
    this.WriteData$8 = function (Buffer, Count) {
      var Result = 0;
      Result = this.WriteMaxSizeData(this.MakeBytes(Buffer,1,false),1,Count);
      return Result;
    };
    this.WriteData$9 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$10(Buffer,2);
      return Result;
    };
    this.WriteData$10 = function (Buffer, Count) {
      var Result = 0;
      Result = this.WriteMaxSizeData(this.MakeBytes(Buffer,2,true),2,Count);
      return Result;
    };
    this.WriteData$11 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$12(Buffer,2);
      return Result;
    };
    this.WriteData$12 = function (Buffer, Count) {
      var Result = 0;
      Result = this.WriteMaxSizeData(this.MakeBytes(Buffer,2,true),2,Count);
      return Result;
    };
    this.WriteData$13 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$14(Buffer,4);
      return Result;
    };
    this.WriteData$14 = function (Buffer, Count) {
      var Result = 0;
      Result = this.WriteMaxSizeData(this.MakeBytes(Buffer,4,true),4,Count);
      return Result;
    };
    this.WriteData$15 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$16(Buffer,4);
      return Result;
    };
    this.WriteData$16 = function (Buffer, Count) {
      var Result = 0;
      Result = this.WriteMaxSizeData(this.MakeBytes(Buffer,4,false),4,Count);
      return Result;
    };
    this.WriteData$17 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$18(Buffer,8);
      return Result;
    };
    this.WriteData$18 = function (Buffer, Count) {
      var Result = 0;
      Result = this.WriteMaxSizeData(this.MakeBytes(Buffer,8,true),8,Count);
      return Result;
    };
    this.WriteData$19 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$20(Buffer,8);
      return Result;
    };
    this.WriteData$20 = function (Buffer, Count) {
      var Result = 0;
      Result = this.WriteMaxSizeData(this.MakeBytes(Buffer,8,false),8,Count);
      return Result;
    };
    this.WriteData$21 = function (Buffer) {
      var Result = 0;
      Result = this.WriteData$22(Buffer,8);
      return Result;
    };
    this.WriteData$22 = function (Buffer, Count) {
      var Result = 0;
      var Mem = null;
      var A = null;
      var D = null;
      var B = [];
      var I = 0;
      Mem = new ArrayBuffer(8);
      D = new DataView(Mem);
      D.setFloat64(0,Buffer);
      B = rtl.arraySetLength(B,0,8);
      A = new Uint8Array(Mem);
      for (I = 0; I <= 7; I++) B[I] = A[I];
      Result = this.WriteMaxSizeData(B,8,Count);
      return Result;
    };
    this.WriteBufferData = function (Buffer) {
      this.WriteBufferData$1(Buffer,4);
    };
    this.WriteBufferData$1 = function (Buffer, Count) {
      if (this.WriteData$14(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$2 = function (Buffer) {
      this.WriteBufferData$3(Buffer,1);
    };
    this.WriteBufferData$3 = function (Buffer, Count) {
      if (this.WriteData$2(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$4 = function (Buffer) {
      this.WriteBufferData$5(Buffer,2);
    };
    this.WriteBufferData$5 = function (Buffer, Count) {
      if (this.WriteData$4(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$6 = function (Buffer) {
      this.WriteBufferData$7(Buffer,1);
    };
    this.WriteBufferData$7 = function (Buffer, Count) {
      if (this.WriteData$6(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$8 = function (Buffer) {
      this.WriteBufferData$9(Buffer,1);
    };
    this.WriteBufferData$9 = function (Buffer, Count) {
      if (this.WriteData$8(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$10 = function (Buffer) {
      this.WriteBufferData$11(Buffer,2);
    };
    this.WriteBufferData$11 = function (Buffer, Count) {
      if (this.WriteData$10(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$12 = function (Buffer) {
      this.WriteBufferData$13(Buffer,2);
    };
    this.WriteBufferData$13 = function (Buffer, Count) {
      if (this.WriteData$12(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$14 = function (Buffer) {
      this.WriteBufferData$15(Buffer,4);
    };
    this.WriteBufferData$15 = function (Buffer, Count) {
      if (this.WriteData$16(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$16 = function (Buffer) {
      this.WriteBufferData$17(Buffer,8);
    };
    this.WriteBufferData$17 = function (Buffer, Count) {
      if (this.WriteData$18(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$18 = function (Buffer) {
      this.WriteBufferData$19(Buffer,8);
    };
    this.WriteBufferData$19 = function (Buffer, Count) {
      if (this.WriteData$20(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    this.WriteBufferData$20 = function (Buffer) {
      this.WriteBufferData$21(Buffer,8);
    };
    this.WriteBufferData$21 = function (Buffer, Count) {
      if (this.WriteData$22(Buffer,Count) !== Count) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SWriteError")]);
    };
    var MaxSize = 0x20000;
    this.CopyFrom = function (Source, Count) {
      var Result = 0;
      var Buffer = [];
      var BufferSize = 0;
      var i = 0;
      Result = 0;
      if (Count === 0) Source.SetPosition(0);
      BufferSize = 131072;
      if ((Count > 0) && (Count < BufferSize)) BufferSize = Count;
      Buffer = rtl.arraySetLength(Buffer,0,BufferSize);
      if (Count === 0) {
        do {
          i = Source.Read({get: function () {
              return Buffer;
            }, set: function (v) {
              Buffer = v;
            }},BufferSize);
          if (i > 0) this.WriteBuffer(Buffer,i);
          Result += i;
        } while (!(i < BufferSize))}
       else while (Count > 0) {
        if (Count > BufferSize) {
          i = BufferSize}
         else i = Count;
        Source.ReadBuffer({get: function () {
            return Buffer;
          }, set: function (v) {
            Buffer = v;
          }},i);
        this.WriteBuffer(Buffer,i);
        Count -= i;
        Result += i;
      };
      return Result;
    };
    this.ReadComponent = function (Instance) {
      var Result = null;
      var Reader = null;
      Reader = $mod.TReader.$create("Create$1",[this]);
      try {
        Result = Reader.ReadRootComponent(Instance);
      } finally {
        Reader = rtl.freeLoc(Reader);
      };
      return Result;
    };
    this.ReadComponentRes = function (Instance) {
      var Result = null;
      this.ReadResHeader();
      Result = this.ReadComponent(Instance);
      return Result;
    };
    this.WriteComponent = function (Instance) {
      this.WriteDescendent(Instance,null);
    };
    this.WriteComponentRes = function (ResName, Instance) {
      this.WriteDescendentRes(ResName,Instance,null);
    };
    this.WriteDescendent = function (Instance, Ancestor) {
      var Driver = null;
      var Writer = null;
      Driver = $mod.TBinaryObjectWriter.$create("Create$1",[this]);
      try {
        Writer = $mod.TWriter.$create("Create$1",[Driver]);
        try {
          Writer.WriteDescendent(Instance,Ancestor);
        } finally {
          Writer.$destroy("Destroy");
        };
      } finally {
        Driver = rtl.freeLoc(Driver);
      };
    };
    this.WriteDescendentRes = function (ResName, Instance, Ancestor) {
      var FixupInfo = 0;
      this.WriteResourceHeader(ResName,{get: function () {
          return FixupInfo;
        }, set: function (v) {
          FixupInfo = v;
        }});
      this.WriteDescendent(Instance,Ancestor);
      this.FixupResourceHeader(FixupInfo);
    };
    this.WriteResourceHeader = function (ResName, FixupInfo) {
      var ResType = 0;
      var Flags = 0;
      var B = 0;
      var I = 0;
      ResType = 0xA;
      Flags = 0x1030;
      this.WriteByte(0xff);
      this.WriteWord(ResType);
      for (var $l = 1, $end = ResName.length; $l <= $end; $l++) {
        I = $l;
        B = ResName.charCodeAt(I - 1);
        this.WriteByte(B);
      };
      this.WriteByte(0);
      this.WriteWord(Flags);
      this.WriteDWord(0);
      FixupInfo.set(this.GetPosition());
    };
    this.FixupResourceHeader = function (FixupInfo) {
      var ResSize = 0;
      var TmpResSize = 0;
      ResSize = this.GetPosition() - FixupInfo;
      TmpResSize = ResSize >>> 0;
      this.SetPosition(FixupInfo - 4);
      this.WriteDWord(TmpResSize);
      this.SetPosition(FixupInfo + ResSize);
    };
    this.ReadResHeader = function () {
      var ResType = 0;
      var Flags = 0;
      try {
        if (this.ReadByte() !== 0xff) throw $mod.EInvalidImage.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidImage")]);
        ResType = this.ReadWord();
        if (ResType !== 0xa) throw $mod.EInvalidImage.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidImage")]);
        while (this.ReadByte() !== 0) {
        };
        Flags = this.ReadWord();
        if (Flags !== 0x1030) throw $mod.EInvalidImage.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidImage")]);
        this.ReadDWord();
      } catch ($e) {
        if ($mod.EInvalidImage.isPrototypeOf($e)) {
          throw $e}
         else {
          throw $mod.EInvalidImage.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidImage")]);
        }
      };
    };
    this.ReadByte = function () {
      var Result = 0;
      this.ReadBufferData$7({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},1);
      return Result;
    };
    this.ReadWord = function () {
      var Result = 0;
      this.ReadBufferData$11({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},2);
      return Result;
    };
    this.ReadDWord = function () {
      var Result = 0;
      this.ReadBufferData$15({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},4);
      return Result;
    };
    this.ReadQWord = function () {
      var Result = 0;
      this.ReadBufferData$19({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},8);
      return Result;
    };
    this.WriteByte = function (b) {
      this.WriteBufferData$9(b,1);
    };
    this.WriteWord = function (w) {
      this.WriteBufferData$13(w,2);
    };
    this.WriteDWord = function (d) {
      this.WriteBufferData$15(d,4);
    };
    this.WriteQWord = function (q) {
      this.WriteBufferData$19(q,8);
    };
  });
  rtl.createClass(this,"TCustomMemoryStream",this.TStream,function () {
    this.$init = function () {
      $mod.TStream.$init.call(this);
      this.FMemory = null;
      this.FDataView = null;
      this.FDataArray = null;
      this.FSize = 0;
      this.FPosition = 0;
      this.FSizeBoundsSeek = false;
    };
    this.$final = function () {
      this.FMemory = undefined;
      this.FDataView = undefined;
      this.FDataArray = undefined;
      $mod.TStream.$final.call(this);
    };
    this.GetDataArray = function () {
      var Result = null;
      if (this.FDataArray === null) this.FDataArray = new Uint8Array(this.FMemory);
      Result = this.FDataArray;
      return Result;
    };
    this.GetDataView = function () {
      var Result = null;
      if (this.FDataView === null) this.FDataView = new DataView(this.FMemory);
      Result = this.FDataView;
      return Result;
    };
    this.GetSize = function () {
      var Result = 0;
      Result = this.FSize;
      return Result;
    };
    this.GetPosition = function () {
      var Result = 0;
      Result = this.FPosition;
      return Result;
    };
    this.SetPointer = function (Ptr, ASize) {
      this.FMemory = Ptr;
      this.FSize = ASize;
      this.FDataView = null;
      this.FDataArray = null;
    };
    this.MemoryToBytes = function (Mem) {
      var Result = [];
      Result = this.MemoryToBytes$1(new Uint8Array(Mem));
      return Result;
    };
    this.MemoryToBytes$1 = function (Mem) {
      var Result = [];
      var I = 0;
      Result = rtl.arraySetLength(Result,0,Mem.length);
      for (var $l = 0, $end = Mem.length - 1; $l <= $end; $l++) {
        I = $l;
        Result[I] = Mem[I];
      };
      return Result;
    };
    this.BytesToMemory = function (aBytes) {
      var Result = null;
      var a = null;
      Result = new ArrayBuffer(rtl.length(aBytes));
      a = new Uint8Array(Result);
      a.set(aBytes);
      return Result;
    };
    this.Read$1 = function (Buffer, Offset, Count) {
      var Result = 0;
      var I = 0;
      var Src = 0;
      var Dest = 0;
      Result = 0;
      if ((this.FSize > 0) && (this.FPosition < this.FSize) && (this.FPosition >= 0)) {
        Result = Count;
        if (Result > (this.FSize - this.FPosition)) Result = this.FSize - this.FPosition;
        Src = this.FPosition;
        Dest = Offset;
        I = 0;
        while (I < Result) {
          Buffer[Dest] = this.GetDataView().getUint8(Src);
          Src += 1;
          Dest += 1;
          I += 1;
        };
        this.FPosition = this.FPosition + Result;
      };
      return Result;
    };
    this.Seek = function (Offset, Origin) {
      var Result = 0;
      var $tmp = Origin;
      if ($tmp === $mod.TSeekOrigin.soBeginning) {
        this.FPosition = Offset}
       else if ($tmp === $mod.TSeekOrigin.soEnd) {
        this.FPosition = this.FSize + Offset}
       else if ($tmp === $mod.TSeekOrigin.soCurrent) this.FPosition = this.FPosition + Offset;
      if (this.FSizeBoundsSeek && (this.FPosition > this.FSize)) this.FPosition = this.FSize;
      Result = this.FPosition;
      return Result;
    };
    this.SaveToStream = function (Stream) {
      if (this.FSize > 0) Stream.WriteBuffer($mod.TMemoryStream.MemoryToBytes(this.FMemory),this.FSize);
    };
    this.LoadFromURL = function (aURL, Async, OnLoaded, OnError) {
      var $Self = this;
      function DoLoaded(abytes) {
        $Self.SetPointer(abytes,abytes.byteLength);
        if (OnLoaded != null) OnLoaded($Self);
      };
      function DoError(AError) {
        if (OnError != null) {
          OnError($Self,AError)}
         else throw pas.SysUtils.EInOutError.$create("Create$1",["Failed to load from URL:" + AError]);
      };
      $impl.CheckLoadHelper();
      $impl.GlobalLoadHelper.LoadBytes(aURL,Async,DoLoaded,DoError);
    };
    this.LoadFromFile = function (aFileName, OnLoaded, AError) {
      var $Self = this;
      this.LoadFromURL(aFileName,false,function (Sender) {
        if (OnLoaded != null) OnLoaded();
      },function (Sender, ErrorMsg) {
        if (AError != null) AError(ErrorMsg);
      });
    };
  });
  rtl.createClass(this,"TMemoryStream",this.TCustomMemoryStream,function () {
    this.$init = function () {
      $mod.TCustomMemoryStream.$init.call(this);
      this.FCapacity = 0;
    };
    this.SetCapacity = function (NewCapacity) {
      this.SetPointer(this.Realloc({get: function () {
          return NewCapacity;
        }, set: function (v) {
          NewCapacity = v;
        }}),this.FSize);
      this.FCapacity = NewCapacity;
    };
    this.Realloc = function (NewCapacity) {
      var Result = null;
      var GC = 0;
      var DestView = null;
      if (NewCapacity.get() < 0) {
        NewCapacity.set(0)}
       else {
        GC = this.FCapacity + rtl.trunc(this.FCapacity / 4);
        if ((NewCapacity.get() > this.FCapacity) && (NewCapacity.get() < GC)) NewCapacity.set(GC);
        NewCapacity.set((NewCapacity.get() + (4096 - 1)) & ~(4096 - 1));
      };
      if (NewCapacity.get() === this.FCapacity) {
        Result = this.FMemory}
       else if (NewCapacity.get() === 0) {
        Result = null}
       else {
        Result = new ArrayBuffer(NewCapacity.get());
        if (Result === null) throw $mod.EStreamError.$create("Create$1",[rtl.getResStr($mod,"SMemoryStreamError")]);
        DestView = new Uint8Array(Result);
        DestView.set(this.GetDataArray());
      };
      return Result;
    };
    this.Destroy = function () {
      this.Clear();
      pas.System.TObject.Destroy.call(this);
    };
    this.Clear = function () {
      this.FSize = 0;
      this.FPosition = 0;
      this.SetCapacity(0);
    };
    this.LoadFromStream = function (Stream) {
      this.SetPosition(0);
      Stream.SetPosition(0);
      this.SetSize(Stream.GetSize());
      if (this.GetSize() > 0) this.CopyFrom(Stream,0);
    };
    this.SetSize = function (NewSize) {
      this.SetCapacity(NewSize);
      this.FSize = NewSize;
      if (this.FPosition > this.FSize) this.FPosition = this.FSize;
    };
    this.Write$1 = function (Buffer, Offset, Count) {
      var Result = 0;
      var NewPos = 0;
      if ((Count === 0) || (this.FPosition < 0)) return 0;
      NewPos = this.FPosition + Count;
      if (NewPos > this.FSize) {
        if (NewPos > this.FCapacity) this.SetCapacity(NewPos);
        this.FSize = NewPos;
      };
      this.GetDataArray().set(rtl.arrayCopy(0,Buffer,Offset,Count),this.FPosition);
      this.FPosition = NewPos;
      Result = Count;
      return Result;
    };
  });
  rtl.createClass(this,"TBytesStream",this.TMemoryStream,function () {
    this.GetBytes = function () {
      var Result = [];
      Result = $mod.TMemoryStream.MemoryToBytes(this.FMemory);
      return Result;
    };
    this.Create$1 = function (ABytes) {
      pas.System.TObject.Create.call(this);
      this.SetPointer($mod.TMemoryStream.BytesToMemory(rtl.arrayRef(ABytes)),rtl.length(ABytes));
      this.FCapacity = rtl.length(ABytes);
      return this;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ABytes",pas.SysUtils.$rtti["TBytes"],2]]);
  });
  rtl.createClass(this,"TStringStream",this.TMemoryStream,function () {
    this.GetDataString = function () {
      var Result = "";
      var a = null;
      Result = "";
      a = new Uint16Array(this.FMemory.slice(0,this.GetSize()));
      if (a !== null) {
        // Result=String.fromCharCode.apply(null, new Uint16Array(a));
        Result=String.fromCharCode.apply(null, a);
      };
      return Result;
    };
    this.Create$1 = function () {
      this.Create$2("");
      return this;
    };
    this.Create$2 = function (aString) {
      var Len = 0;
      pas.System.TObject.Create.call(this);
      Len = aString.length;
      this.SetPointer($mod.StringToBuffer(aString,Len),Len * 2);
      this.FCapacity = Len * 2;
      return this;
    };
    this.ReadString = function (Count) {
      var Result = "";
      var B = [];
      var Buf = null;
      var BytesLeft = 0;
      var ByteCount = 0;
      ByteCount = Count * 2;
      BytesLeft = this.GetSize() - this.GetPosition();
      if (BytesLeft < ByteCount) ByteCount = BytesLeft;
      B = rtl.arraySetLength(B,0,ByteCount);
      this.ReadBuffer$1({get: function () {
          return B;
        }, set: function (v) {
          B = v;
        }},0,ByteCount);
      Buf = this.$class.BytesToMemory(rtl.arrayRef(B));
      Result = $mod.BufferToString(Buf,0,ByteCount);
      return Result;
    };
    this.WriteString = function (AString) {
      var Buf = null;
      var B = [];
      Buf = $mod.StringToBuffer(AString,AString.length);
      B = this.$class.MemoryToBytes(Buf);
      this.WriteBuffer(B,rtl.length(B));
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[]);
    $r.addMethod("Create$2",2,[["aString",rtl.string,2]]);
  });
  rtl.createClass(this,"TResourceStream",this.TCustomMemoryStream,function () {
    this.Initialize = function (aInfo) {
      var Ptr = null;
      var S = "";
      if (aInfo.encoding === "base64") {
        S = atob(aInfo.data)}
       else if (aInfo.encoding === "text") {
        S = aInfo.data}
       else throw pas.SysUtils.ENotSupportedException.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrResourceNotBase64"),pas.System.VarRecs(18,aInfo.name)]);
      Ptr = $mod.StringToBuffer(S,S.length);
      this.SetPointer(Ptr,Ptr.byteLength);
    };
    this.Initialize$1 = function (Instance, Name, ResType) {
      var aInfo = pas.p2jsres.TResourceInfo.$new();
      if (!pas.p2jsres.GetResourceInfo(Name,aInfo)) throw $mod.EResNotFound.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SResNotFound"),pas.System.VarRecs(18,Name)]);
      this.Initialize(pas.p2jsres.TResourceInfo.$clone(aInfo));
    };
    this.Create$1 = function (aInfo) {
      pas.System.TObject.Create.call(this);
      this.Initialize(pas.p2jsres.TResourceInfo.$clone(aInfo));
      return this;
    };
    this.Create$2 = function (Instance, ResName, ResType) {
      pas.System.TObject.Create.call(this);
      this.Initialize$1(Instance,ResName,ResType);
      return this;
    };
    this.CreateFromID = function (Instance, ResID, ResType) {
      pas.System.TObject.Create.call(this);
      this.Initialize$1(Instance,pas.SysUtils.IntToStr(ResID),ResType);
      return this;
    };
    this.Write$1 = function (Buffer, Offset, Count) {
      var Result = 0;
      throw pas.SysUtils.ENotSupportedException.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SErrResourceStreamNoWrite")]);
      Result = 0;
      return Result;
    };
    this.Destroy = function () {
      pas.System.TObject.Destroy.call(this);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["aInfo",pas.p2jsres.$rtti["TResourceInfo"]]]);
    $r.addMethod("Create$2",2,[["Instance",rtl.nativeint],["ResName",rtl.string,2],["ResType",rtl.string,2]]);
    $r.addMethod("CreateFromID",2,[["Instance",rtl.nativeint],["ResID",rtl.longint],["ResType",rtl.string]]);
  });
  this.TFilerFlag = {"0": "ffInherited", ffInherited: 0, "1": "ffChildPos", ffChildPos: 1, "2": "ffInline", ffInline: 2};
  this.$rtti.$Enum("TFilerFlag",{minvalue: 0, maxvalue: 2, ordtype: 1, enumtype: this.TFilerFlag});
  this.$rtti.$Set("TFilerFlags",{comptype: this.$rtti["TFilerFlag"]});
  this.$rtti.$MethodVar("TReaderProc",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TWriterProc",{procsig: rtl.newTIProcSig([["Writer",this.$rtti["TWriter"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TStreamProc",{procsig: rtl.newTIProcSig([["Stream",this.$rtti["TStream"]]]), methodkind: 0});
  rtl.createClass(this,"TFiler",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FRoot = null;
      this.FLookupRoot = null;
      this.FAncestor = null;
      this.FIgnoreChildren = false;
    };
    this.$final = function () {
      this.FRoot = undefined;
      this.FLookupRoot = undefined;
      this.FAncestor = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.SetRoot = function (ARoot) {
      this.FRoot = ARoot;
    };
  });
  this.TValueType = {"0": "vaNull", vaNull: 0, "1": "vaList", vaList: 1, "2": "vaInt8", vaInt8: 2, "3": "vaInt16", vaInt16: 3, "4": "vaInt32", vaInt32: 4, "5": "vaDouble", vaDouble: 5, "6": "vaString", vaString: 6, "7": "vaIdent", vaIdent: 7, "8": "vaFalse", vaFalse: 8, "9": "vaTrue", vaTrue: 9, "10": "vaBinary", vaBinary: 10, "11": "vaSet", vaSet: 11, "12": "vaNil", vaNil: 12, "13": "vaCollection", vaCollection: 13, "14": "vaCurrency", vaCurrency: 14, "15": "vaDate", vaDate: 15, "16": "vaNativeInt", vaNativeInt: 16};
  this.$rtti.$Enum("TValueType",{minvalue: 0, maxvalue: 16, ordtype: 1, enumtype: this.TValueType});
  rtl.createClass(this,"TAbstractObjectReader",pas.System.TObject,function () {
    this.FlushBuffer = function () {
    };
  });
  rtl.createClass(this,"TBinaryObjectReader",this.TAbstractObjectReader,function () {
    this.$init = function () {
      $mod.TAbstractObjectReader.$init.call(this);
      this.FStream = null;
    };
    this.$final = function () {
      this.FStream = undefined;
      $mod.TAbstractObjectReader.$final.call(this);
    };
    this.ReadWord = function () {
      var Result = 0;
      this.FStream.ReadBufferData$10({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadDWord = function () {
      var Result = 0;
      this.FStream.ReadBufferData$14({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.SkipProperty = function () {
      this.ReadStr();
      this.SkipValue();
    };
    this.SkipSetBody = function () {
      while (this.ReadStr().length > 0) {
      };
    };
    this.Create$1 = function (Stream) {
      pas.System.TObject.Create.call(this);
      if (Stream === null) throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SEmptyStreamIllegalReader")]);
      this.FStream = Stream;
      return this;
    };
    this.NextValue = function () {
      var Result = 0;
      Result = this.ReadValue();
      this.FStream.Seek(-1,$mod.TSeekOrigin.soCurrent);
      return Result;
    };
    this.ReadValue = function () {
      var Result = 0;
      var b = 0;
      this.FStream.ReadBufferData$6({get: function () {
          return b;
        }, set: function (v) {
          b = v;
        }});
      Result = b;
      return Result;
    };
    this.BeginRootComponent = function () {
      this.ReadSignature();
    };
    this.BeginComponent = function (Flags, AChildPos, CompClassName, CompName) {
      var Prefix = 0;
      var ValueType = 0;
      Flags.set({});
      if ((this.NextValue() & 0xf0) === 0xf0) {
        Prefix = this.ReadValue();
        Flags.set({});
        if ((Prefix & 0x1) !== 0) Flags.set(rtl.includeSet(Flags.get(),$mod.TFilerFlag.ffInherited));
        if ((Prefix & 0x2) !== 0) Flags.set(rtl.includeSet(Flags.get(),$mod.TFilerFlag.ffChildPos));
        if ((Prefix & 0x4) !== 0) Flags.set(rtl.includeSet(Flags.get(),$mod.TFilerFlag.ffInline));
        if ($mod.TFilerFlag.ffChildPos in Flags.get()) {
          ValueType = this.ReadValue();
          var $tmp = ValueType;
          if ($tmp === $mod.TValueType.vaInt8) {
            AChildPos.set(this.ReadInt8())}
           else if ($tmp === $mod.TValueType.vaInt16) {
            AChildPos.set(this.ReadInt16())}
           else if ($tmp === $mod.TValueType.vaInt32) {
            AChildPos.set(this.ReadInt32())}
           else if ($tmp === $mod.TValueType.vaNativeInt) {
            AChildPos.set(this.ReadNativeInt())}
           else {
            throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
          };
        };
      };
      CompClassName.set(this.ReadStr());
      CompName.set(this.ReadStr());
    };
    this.BeginProperty = function () {
      var Result = "";
      Result = this.ReadStr();
      return Result;
    };
    this.Read = function (Buffer, Count) {
      this.FStream.Read(Buffer,Count);
    };
    this.ReadBinary = function (DestData) {
      var BinSize = 0;
      BinSize = this.ReadDWord() & 0xFFFFFFFF;
      DestData.SetSize64(BinSize);
      DestData.CopyFrom(this.FStream,BinSize);
    };
    this.ReadFloat = function () {
      var Result = 0.0;
      this.FStream.ReadBufferData$20({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadCurrency = function () {
      var Result = 0;
      Result = rtl.trunc(this.ReadFloat() * 10000);
      return Result;
    };
    this.ReadIdent = function (ValueType) {
      var Result = "";
      var i = 0;
      var c = "\x00";
      var $tmp = ValueType;
      if ($tmp === $mod.TValueType.vaIdent) {
        this.FStream.ReadBufferData$6({get: function () {
            return i;
          }, set: function (v) {
            i = v;
          }});
        Result = rtl.strSetLength(Result,i);
        for (var $l = 1, $end = Result.length; $l <= $end; $l++) {
          i = $l;
          this.FStream.ReadBufferData$2({get: function () {
              return c;
            }, set: function (v) {
              c = v;
            }});
          Result = rtl.setCharAt(Result,i - 1,c);
        };
      } else if ($tmp === $mod.TValueType.vaNil) {
        Result = "nil"}
       else if ($tmp === $mod.TValueType.vaFalse) {
        Result = "False"}
       else if ($tmp === $mod.TValueType.vaTrue) {
        Result = "True"}
       else if ($tmp === $mod.TValueType.vaNull) Result = "Null";
      return Result;
    };
    this.ReadInt8 = function () {
      var Result = 0;
      this.FStream.ReadBufferData$4({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadInt16 = function () {
      var Result = 0;
      this.FStream.ReadBufferData$8({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadInt32 = function () {
      var Result = 0;
      this.FStream.ReadBufferData$12({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadNativeInt = function () {
      var Result = 0;
      this.FStream.ReadBufferData$16({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadSet = function (EnumType) {
      var Result = 0;
      var Name = "";
      var Value = 0;
      try {
        Result = 0;
        while (true) {
          Name = this.ReadStr();
          if (Name.length === 0) break;
          Value = EnumType.enumtype[Name];
          if (Value === -1) throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
          Result = Result | (1 << Value);
        };
      } catch ($e) {
        this.SkipSetBody();
        throw $e;
      };
      return Result;
    };
    this.ReadSignature = function () {
      var Signature = 0;
      this.FStream.ReadBufferData$12({get: function () {
          return Signature;
        }, set: function (v) {
          Signature = v;
        }});
      if (Signature !== 809914452) throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidImage")]);
    };
    this.ReadStr = function () {
      var Result = "";
      var l = 0;
      var i = 0;
      var c = "\x00";
      this.FStream.ReadBufferData$6({get: function () {
          return l;
        }, set: function (v) {
          l = v;
        }});
      Result = rtl.strSetLength(Result,l);
      for (var $l = 1, $end = l; $l <= $end; $l++) {
        i = $l;
        this.FStream.ReadBufferData$2({get: function () {
            return c;
          }, set: function (v) {
            c = v;
          }});
        Result = rtl.setCharAt(Result,i - 1,c);
      };
      return Result;
    };
    this.ReadString = function (StringType) {
      var Result = "";
      var i = 0;
      var C = "\x00";
      Result = "";
      if (StringType !== $mod.TValueType.vaString) throw $mod.EFilerError.$create("Create$1",["Invalid string type passed to ReadString"]);
      i = this.ReadDWord();
      Result = rtl.strSetLength(Result,i);
      for (var $l = 1, $end = Result.length; $l <= $end; $l++) {
        i = $l;
        this.FStream.ReadBufferData$2({get: function () {
            return C;
          }, set: function (v) {
            C = v;
          }});
        Result = rtl.setCharAt(Result,i - 1,C);
      };
      return Result;
    };
    this.ReadWideString = function () {
      var Result = "";
      Result = this.ReadString($mod.TValueType.vaString);
      return Result;
    };
    this.ReadUnicodeString = function () {
      var Result = "";
      Result = this.ReadString($mod.TValueType.vaString);
      return Result;
    };
    this.SkipComponent = function (SkipComponentInfos) {
      var Flags = {};
      var Dummy = 0;
      var CompClassName = "";
      var CompName = "";
      if (SkipComponentInfos) this.BeginComponent({get: function () {
          return Flags;
        }, set: function (v) {
          Flags = v;
        }},{get: function () {
          return Dummy;
        }, set: function (v) {
          Dummy = v;
        }},{get: function () {
          return CompClassName;
        }, set: function (v) {
          CompClassName = v;
        }},{get: function () {
          return CompName;
        }, set: function (v) {
          CompName = v;
        }});
      while (this.NextValue() !== $mod.TValueType.vaNull) this.SkipProperty();
      this.ReadValue();
      while (this.NextValue() !== $mod.TValueType.vaNull) this.SkipComponent(true);
      this.ReadValue();
    };
    this.SkipValue = function () {
      var $Self = this;
      function SkipBytes(Count) {
        var Dummy = [];
        var SkipNow = 0;
        while (Count > 0) {
          if (Count > 1024) {
            SkipNow = 1024}
           else SkipNow = Count;
          Dummy = rtl.arraySetLength(Dummy,0,SkipNow);
          $Self.Read({get: function () {
              return Dummy;
            }, set: function (v) {
              Dummy = v;
            }},SkipNow);
          Count -= SkipNow;
        };
      };
      var Count = 0;
      var $tmp = this.ReadValue();
      if (($tmp === $mod.TValueType.vaNull) || ($tmp === $mod.TValueType.vaFalse) || ($tmp === $mod.TValueType.vaTrue) || ($tmp === $mod.TValueType.vaNil)) {}
      else if ($tmp === $mod.TValueType.vaList) {
        while (this.NextValue() !== $mod.TValueType.vaNull) this.SkipValue();
        this.ReadValue();
      } else if ($tmp === $mod.TValueType.vaInt8) {
        SkipBytes(1)}
       else if ($tmp === $mod.TValueType.vaInt16) {
        SkipBytes(2)}
       else if ($tmp === $mod.TValueType.vaInt32) {
        SkipBytes(4)}
       else if (($tmp === $mod.TValueType.vaNativeInt) || ($tmp === $mod.TValueType.vaDouble)) {
        SkipBytes(8)}
       else if ($tmp === $mod.TValueType.vaIdent) {
        this.ReadStr()}
       else if ($tmp === $mod.TValueType.vaString) {
        this.ReadString($mod.TValueType.vaString)}
       else if ($tmp === $mod.TValueType.vaBinary) {
        Count = this.ReadDWord() & 0xFFFFFFFF;
        SkipBytes(Count);
      } else if ($tmp === $mod.TValueType.vaSet) {
        this.SkipSetBody()}
       else if ($tmp === $mod.TValueType.vaCollection) {
        while (this.NextValue() !== $mod.TValueType.vaNull) {
          if (this.NextValue() in rtl.createSet($mod.TValueType.vaInt8,$mod.TValueType.vaInt16,$mod.TValueType.vaInt32)) this.SkipValue();
          SkipBytes(1);
          while (this.NextValue() !== $mod.TValueType.vaNull) this.SkipProperty();
          this.ReadValue();
        };
        this.ReadValue();
      };
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["Stream",$mod.$rtti["TStream"]]]);
  });
  this.$rtti.$MethodVar("TFindMethodEvent",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]],["MethodName",rtl.string,2],["Address",rtl.pointer,1],["error",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TSetNameEvent",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]],["Component",this.$rtti["TComponent"]],["Name",rtl.string,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TReferenceNameEvent",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]],["Name",rtl.string,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TAncestorNotFoundEvent",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]],["ComponentName",rtl.string,2],["ComponentClass",this.$rtti["TPersistentClass"]],["Component",this.$rtti["TComponent"],1]]), methodkind: 0});
  this.$rtti.$MethodVar("TReadComponentsProc",{procsig: rtl.newTIProcSig([["Component",this.$rtti["TComponent"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TReaderError",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]],["Message",rtl.string,2],["Handled",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TPropertyNotFoundEvent",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]],["Instance",this.$rtti["TPersistent"]],["PropName",rtl.string,1],["IsPath",rtl.boolean],["Handled",rtl.boolean,1],["Skip",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TFindComponentClassEvent",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]],["ClassName",rtl.string,2],["ComponentClass",this.$rtti["TComponentClass"],1]]), methodkind: 0});
  this.$rtti.$MethodVar("TCreateComponentEvent",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]],["ComponentClass",this.$rtti["TComponentClass"]],["Component",this.$rtti["TComponent"],1]]), methodkind: 0});
  this.$rtti.$MethodVar("TSetMethodPropertyEvent",{procsig: rtl.newTIProcSig([["Reader",this.$rtti["TReader"]],["Instance",this.$rtti["TPersistent"]],["PropInfo",pas.TypInfo.$rtti["TTypeMemberProperty"]],["TheMethodName",rtl.string,2],["Handled",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TReadWriteStringPropertyEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["Instance",this.$rtti["TPersistent"],2],["PropInfo",pas.TypInfo.$rtti["TTypeMemberProperty"]],["Content",rtl.string,1]]), methodkind: 0});
  rtl.createClass(this,"TReader",this.TFiler,function () {
    this.$init = function () {
      $mod.TFiler.$init.call(this);
      this.FDriver = null;
      this.FOwner = null;
      this.FParent = null;
      this.FFixups = null;
      this.FLoaded = null;
      this.FOnFindMethod = null;
      this.FOnSetMethodProperty = null;
      this.FOnSetName = null;
      this.FOnReferenceName = null;
      this.FOnAncestorNotFound = null;
      this.FOnError = null;
      this.FOnPropertyNotFound = null;
      this.FOnFindComponentClass = null;
      this.FOnCreateComponent = null;
      this.FPropName = "";
      this.FCanHandleExcepts = false;
      this.FOnReadStringProperty = null;
    };
    this.$final = function () {
      this.FDriver = undefined;
      this.FOwner = undefined;
      this.FParent = undefined;
      this.FFixups = undefined;
      this.FLoaded = undefined;
      this.FOnFindMethod = undefined;
      this.FOnSetMethodProperty = undefined;
      this.FOnSetName = undefined;
      this.FOnReferenceName = undefined;
      this.FOnAncestorNotFound = undefined;
      this.FOnError = undefined;
      this.FOnPropertyNotFound = undefined;
      this.FOnFindComponentClass = undefined;
      this.FOnCreateComponent = undefined;
      this.FOnReadStringProperty = undefined;
      $mod.TFiler.$final.call(this);
    };
    this.DoFixupReferences = function () {
      var R = null;
      var RN = null;
      var G = null;
      var Ref = "";
      var C = null;
      var P = 0;
      var L = null;
      var $ir = rtl.createIntfRefs();
      try {
        if (this.FFixups != null) {
          L = this.FFixups;
          R = L.FRoot;
          while (R !== null) {
            RN = R.Next;
            Ref = R.FRelative;
            if (this.FOnReferenceName != null) this.FOnReferenceName(this,{get: function () {
                return Ref;
              }, set: function (v) {
                Ref = v;
              }});
            C = $mod.FindNestedComponent(R.FRoot,Ref,true);
            if (C != null) {
              if (R.FPropInfo.typeinfo.kind === pas.System.TTypeKind.tkInterface) {
                pas.TypInfo.SetInterfaceProp$1(R.Finstance,R.FPropInfo,$ir.ref(1,rtl.queryIntfT(C,pas.System.IUnknown)))}
               else pas.TypInfo.SetObjectProp$1(R.Finstance,R.FPropInfo,C)}
             else {
              P = pas.System.Pos(".",R.FRelative);
              if (P !== 0) {
                G = $impl.AddtoResolveList(R.Finstance);
                G.AddReference(R.FRoot,R.FPropInfo,pas.System.Copy(R.FRelative,1,P - 1),pas.System.Copy(R.FRelative,P + 1,R.FRelative.length - P));
              };
            };
            L.RemoveItem(R,true);
            R = RN;
          };
          pas.SysUtils.FreeAndNil({p: this, get: function () {
              return this.p.FFixups;
            }, set: function (v) {
              this.p.FFixups = v;
            }});
        };
      } finally {
        $ir.free();
      };
    };
    this.FindComponentClass = function (AClassName) {
      var $Self = this;
      var Result = null;
      var PersistentClass = null;
      function FindClassInFieldTable(Instance) {
        var Result = null;
        var aClass = null;
        var i = 0;
        var ClassTI = null;
        var MemberClassTI = null;
        var MemberTI = null;
        aClass = Instance.$class.ClassType();
        while (aClass !== null) {
          ClassTI = aClass.$rtti;
          for (var $l = 0, $end = ClassTI.fields.length - 1; $l <= $end; $l++) {
            i = $l;
            MemberTI = ClassTI.getField(i).typeinfo;
            if (MemberTI.kind === pas.System.TTypeKind.tkClass) {
              MemberClassTI = MemberTI;
              if (pas.SysUtils.SameText(MemberClassTI.name,AClassName) && rtl.is(MemberClassTI.class,$mod.TComponent)) return MemberClassTI.class;
            };
          };
          aClass = aClass.$ancestor;
        };
        return Result;
      };
      Result = null;
      Result = FindClassInFieldTable(this.FRoot);
      if ((Result === null) && (this.FLookupRoot != null) && (this.FLookupRoot !== this.FRoot)) Result = FindClassInFieldTable(this.FLookupRoot);
      if (Result === null) {
        PersistentClass = $mod.GetClass(AClassName);
        if ((PersistentClass != null) && PersistentClass.InheritsFrom($mod.TComponent)) Result = PersistentClass;
      };
      if ((Result === null) && (this.FOnFindComponentClass != null)) this.FOnFindComponentClass($Self,AClassName,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      if ((Result === null) || !Result.InheritsFrom($mod.TComponent)) throw $mod.EClassNotFound.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SClassNotFound"),pas.System.VarRecs(18,AClassName)]);
      return Result;
    };
    this.Error = function (Message) {
      var Result = false;
      Result = false;
      if (this.FOnError != null) this.FOnError(this,Message,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.FindMethod = function (ARoot, AMethodName) {
      var Result = null;
      var ErrorResult = false;
      Result = null;
      if ((ARoot === null) || (AMethodName === "")) return Result;
      Result = ARoot.$class.MethodAddress(AMethodName);
      ErrorResult = Result === null;
      if (this.FOnFindMethod != null) this.FOnFindMethod(this,AMethodName,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},{get: function () {
          return ErrorResult;
        }, set: function (v) {
          ErrorResult = v;
        }});
      if (ErrorResult) throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
      return Result;
    };
    this.ReadProperty = function (AInstance) {
      var $Self = this;
      var Path = "";
      var Instance = null;
      var PropInfo = null;
      var Obj = null;
      var Name = "";
      var Skip = false;
      var Handled = false;
      var OldPropName = "";
      var DotPos = "";
      var NextPos = 0;
      function HandleMissingProperty(IsPath) {
        var Result = false;
        Result = true;
        if ($Self.FOnPropertyNotFound != null) {
          OldPropName = $Self.FPropName;
          Handled = false;
          Skip = false;
          $Self.FOnPropertyNotFound($Self,Instance,{p: $Self, get: function () {
              return this.p.FPropName;
            }, set: function (v) {
              this.p.FPropName = v;
            }},IsPath,{get: function () {
              return Handled;
            }, set: function (v) {
              Handled = v;
            }},{get: function () {
              return Skip;
            }, set: function (v) {
              Skip = v;
            }});
          if (Handled && !Skip && (OldPropName !== $Self.FPropName)) PropInfo = pas.TypInfo.GetPropInfo$4(Instance.$class.ClassType(),$Self.FPropName);
          if (Skip) {
            $Self.FDriver.SkipValue();
            Result = false;
            return Result;
          };
        };
        return Result;
      };
      try {
        Path = this.FDriver.BeginProperty();
        try {
          Instance = AInstance;
          this.FCanHandleExcepts = true;
          DotPos = Path;
          while (true) {
            NextPos = pas.System.Pos(".",DotPos);
            if (NextPos > 0) {
              this.FPropName = pas.System.Copy(DotPos,1,NextPos - 1)}
             else {
              this.FPropName = DotPos;
              break;
            };
            pas.System.Delete({get: function () {
                return DotPos;
              }, set: function (v) {
                DotPos = v;
              }},1,NextPos);
            PropInfo = pas.TypInfo.GetPropInfo$4(Instance.$class.ClassType(),this.FPropName);
            if (!(PropInfo != null)) {
              if (!HandleMissingProperty(true)) return;
              if (!(PropInfo != null)) this.PropertyError();
            };
            if (PropInfo.typeinfo.kind === pas.System.TTypeKind.tkClass) {
              Obj = pas.TypInfo.GetObjectProp$2(Instance,PropInfo)}
             else Obj = null;
            if (!$mod.TPersistent.isPrototypeOf(Obj)) {
              this.FDriver.SkipValue();
              throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyPath")]);
            };
            Instance = Obj;
          };
          PropInfo = pas.TypInfo.GetPropInfo$4(Instance.$class.ClassType(),this.FPropName);
          if (PropInfo != null) {
            this.ReadPropValue(Instance,PropInfo)}
           else {
            this.FCanHandleExcepts = false;
            Instance.DefineProperties($Self);
            this.FCanHandleExcepts = true;
            if (this.FPropName.length > 0) {
              if (!HandleMissingProperty(false)) return;
              if (!(PropInfo != null)) this.PropertyError();
            };
          };
        } catch ($e) {
          if (pas.SysUtils.Exception.isPrototypeOf($e)) {
            var e = $e;
            Name = rtl.strSetLength(Name,0);
            if (AInstance.$class.InheritsFrom($mod.TComponent)) Name = AInstance.FName;
            if (Name.length === 0) Name = AInstance.$classname;
            throw $mod.EReadError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SPropertyException"),pas.System.VarRecs(18,Name,9,".",18,Path,18,e.fMessage)]);
          } else throw $e
        };
      } catch ($e) {
        if (pas.SysUtils.Exception.isPrototypeOf($e)) {
          var e = $e;
          if (!this.FCanHandleExcepts || !this.Error(e.fMessage)) throw $e;
        } else throw $e
      };
    };
    var NullMethod = pas.System.TMethod.$clone({Code: null, Data: null});
    this.ReadPropValue = function (Instance, PropInfo) {
      var PropType = null;
      var Value = 0;
      var Ident = "";
      var Method = pas.System.TMethod.$new();
      var Handled = false;
      var TmpStr = "";
      if (PropInfo.setter === "") throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SReadOnlyProperty")]);
      PropType = PropInfo.typeinfo;
      var $tmp = PropType.kind;
      if ($tmp === pas.System.TTypeKind.tkInteger) {
        var $tmp1 = this.FDriver.NextValue();
        if ($tmp1 === $mod.TValueType.vaIdent) {
          Ident = this.ReadIdent();
          if ($impl.GlobalIdentToInt(Ident,{get: function () {
              return Value;
            }, set: function (v) {
              Value = v;
            }})) {
            pas.TypInfo.SetOrdProp$1(Instance,PropInfo,Value)}
           else throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
        } else if ($tmp1 === $mod.TValueType.vaNativeInt) {
          pas.TypInfo.SetOrdProp$1(Instance,PropInfo,this.ReadNativeInt())}
         else if ($tmp1 === $mod.TValueType.vaCurrency) {
          pas.TypInfo.SetFloatProp$1(Instance,PropInfo,this.ReadCurrency() / 10000)}
         else {
          pas.TypInfo.SetOrdProp$1(Instance,PropInfo,this.ReadInteger());
        };
      } else if ($tmp === pas.System.TTypeKind.tkBool) {
        pas.TypInfo.SetBoolProp$1(Instance,PropInfo,this.ReadBoolean())}
       else if ($tmp === pas.System.TTypeKind.tkChar) {
        pas.TypInfo.SetOrdProp$1(Instance,PropInfo,this.ReadChar().charCodeAt())}
       else if ($tmp === pas.System.TTypeKind.tkEnumeration) {
        Value = pas.TypInfo.GetEnumValue(PropType,this.ReadIdent());
        if (Value === -1) throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
        pas.TypInfo.SetOrdProp$1(Instance,PropInfo,Value);
      } else if ($tmp === pas.System.TTypeKind.tkDouble) {
        pas.TypInfo.SetFloatProp$1(Instance,PropInfo,this.ReadFloat())}
       else if ($tmp === pas.System.TTypeKind.tkSet) {
        this.CheckValue($mod.TValueType.vaSet);
        if (PropType.comptype.kind === pas.System.TTypeKind.tkEnumeration) pas.TypInfo.SetOrdProp$1(Instance,PropInfo,this.FDriver.ReadSet(PropType.comptype));
      } else if (($tmp === pas.System.TTypeKind.tkMethod) || ($tmp === pas.System.TTypeKind.tkRefToProcVar)) {
        if (this.FDriver.NextValue() === $mod.TValueType.vaNil) {
          this.FDriver.ReadValue();
          pas.TypInfo.SetMethodProp(Instance,PropInfo,NullMethod);
        } else {
          Handled = false;
          Ident = this.ReadIdent();
          if (this.FOnSetMethodProperty != null) this.FOnSetMethodProperty(this,Instance,PropInfo,Ident,{get: function () {
              return Handled;
            }, set: function (v) {
              Handled = v;
            }});
          if (!Handled) {
            Method.Code = this.FindMethod(this.FRoot,Ident);
            Method.Data = this.FRoot;
            if (Method.Code != null) pas.TypInfo.SetMethodProp(Instance,PropInfo,Method);
          };
        }}
       else if ($tmp === pas.System.TTypeKind.tkString) {
        TmpStr = this.ReadString();
        if (this.FOnReadStringProperty != null) this.FOnReadStringProperty(this,Instance,PropInfo,{get: function () {
            return TmpStr;
          }, set: function (v) {
            TmpStr = v;
          }});
        pas.TypInfo.SetStrProp$1(Instance,PropInfo,TmpStr);
      } else if ($tmp === pas.System.TTypeKind.tkJSValue) {
        pas.TypInfo.SetJSValueProp$3(Instance,PropInfo,this.ReadVariant());
      } else if (($tmp === pas.System.TTypeKind.tkClass) || ($tmp === pas.System.TTypeKind.tkInterface)) {
        var $tmp2 = this.FDriver.NextValue();
        if ($tmp2 === $mod.TValueType.vaNil) {
          this.FDriver.ReadValue();
          pas.TypInfo.SetObjectProp$1(Instance,PropInfo,null);
        } else if ($tmp2 === $mod.TValueType.vaCollection) {
          this.FDriver.ReadValue();
          this.ReadCollection(pas.TypInfo.GetObjectProp$2(Instance,PropInfo));
        } else {
          if (!(this.FFixups != null)) this.FFixups = pas.simplelinkedlist.TLinkedList.$create("Create$1",[$impl.TLocalUnResolvedReference]);
          var $with = this.FFixups.Add();
          $with.Finstance = Instance;
          $with.FRoot = this.FRoot;
          $with.FPropInfo = PropInfo;
          $with.FRelative = this.ReadIdent();
        };
      } else {
        throw $mod.EReadError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SUnknownPropertyType"),pas.System.VarRecs(18,pas.System.TTypeKind[PropType.kind])]);
      };
    };
    this.PropertyError = function () {
      this.FDriver.SkipValue();
      throw $mod.EReadError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SUnknownProperty"),pas.System.VarRecs(18,this.FPropName)]);
    };
    this.ReadData = function (Instance) {
      var SavedOwner = null;
      var SavedParent = null;
      while (!this.EndOfList()) this.ReadProperty(Instance);
      this.ReadListEnd();
      SavedOwner = this.FOwner;
      SavedParent = this.FParent;
      try {
        this.FOwner = Instance.GetChildOwner();
        if (!(this.FOwner != null)) this.FOwner = this.FRoot;
        this.FParent = Instance.GetChildParent();
        while (!this.EndOfList()) this.ReadComponent(null);
        this.ReadListEnd();
      } finally {
        this.FOwner = SavedOwner;
        this.FParent = SavedParent;
      };
      if (Instance === this.FRoot) this.DoFixupReferences();
    };
    this.CreateDriver = function (Stream) {
      var Result = null;
      Result = $mod.TBinaryObjectReader.$create("Create$1",[Stream]);
      return Result;
    };
    this.Create$1 = function (Stream) {
      pas.System.TObject.Create.call(this);
      if (Stream === null) throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SEmptyStreamIllegalReader")]);
      this.FDriver = this.CreateDriver(Stream);
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FDriver");
      pas.System.TObject.Destroy.call(this);
    };
    this.FlushBuffer = function () {
      this.FDriver.FlushBuffer();
    };
    this.BeginReferences = function () {
      this.FLoaded = $mod.TFPList.$create("Create");
    };
    this.CheckValue = function (Value) {
      if (this.FDriver.NextValue() !== Value) {
        throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")])}
       else this.FDriver.ReadValue();
    };
    this.DefineProperty = function (Name, AReadData, WriteData, HasData) {
      if ((AReadData != null) && pas.SysUtils.SameText(Name,this.FPropName)) {
        AReadData(this);
        this.FPropName = rtl.strSetLength(this.FPropName,0);
      } else if ((WriteData != null) && HasData) ;
    };
    this.DefineBinaryProperty = function (Name, AReadData, WriteData, HasData) {
      var MemBuffer = null;
      if ((AReadData != null) && pas.SysUtils.SameText(Name,this.FPropName)) {
        if (this.FDriver.NextValue() !== $mod.TValueType.vaBinary) {
          this.FDriver.SkipValue();
          this.FCanHandleExcepts = true;
          throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
        } else this.FDriver.ReadValue();
        MemBuffer = $mod.TMemoryStream.$create("Create");
        try {
          this.FDriver.ReadBinary(MemBuffer);
          this.FCanHandleExcepts = true;
          AReadData(MemBuffer);
        } finally {
          MemBuffer = rtl.freeLoc(MemBuffer);
        };
        this.FPropName = rtl.strSetLength(this.FPropName,0);
      } else if ((WriteData != null) && HasData) ;
    };
    this.EndOfList = function () {
      var Result = false;
      Result = this.FDriver.NextValue() === $mod.TValueType.vaNull;
      return Result;
    };
    this.EndReferences = function () {
      rtl.free(this,"FLoaded");
      this.FLoaded = null;
    };
    this.FixupReferences = function () {
      var i = 0;
      this.DoFixupReferences();
      $impl.GlobalFixupReferences();
      for (var $l = 0, $end = this.FLoaded.FCount - 1; $l <= $end; $l++) {
        i = $l;
        rtl.getObject(this.FLoaded.Get(i)).Loaded();
      };
    };
    this.NextValue = function () {
      var Result = 0;
      Result = this.FDriver.NextValue();
      return Result;
    };
    this.Read = function (Buffer, Count) {
      this.FDriver.Read(Buffer,Count);
    };
    this.ReadBoolean = function () {
      var Result = false;
      var ValueType = 0;
      ValueType = this.FDriver.ReadValue();
      if (ValueType === $mod.TValueType.vaTrue) {
        Result = true}
       else if (ValueType === $mod.TValueType.vaFalse) {
        Result = false}
       else throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
      return Result;
    };
    this.ReadChar = function () {
      var Result = "\x00";
      var s = "";
      s = this.ReadString();
      if (s.length === 1) {
        Result = s.charAt(0)}
       else throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
      return Result;
    };
    this.ReadWideChar = function () {
      var Result = "\x00";
      var W = "";
      W = this.ReadWideString();
      if (W.length === 1) {
        Result = W.charAt(0)}
       else throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
      return Result;
    };
    this.ReadUnicodeChar = function () {
      var Result = "\x00";
      var U = "";
      U = this.ReadUnicodeString();
      if (U.length === 1) {
        Result = U.charAt(0)}
       else throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
      return Result;
    };
    this.ReadCollection = function (Collection) {
      var Item = null;
      Collection.BeginUpdate();
      if (!this.EndOfList()) Collection.Clear();
      while (!this.EndOfList()) {
        this.ReadListBegin();
        Item = Collection.Add();
        while (this.NextValue() !== $mod.TValueType.vaNull) this.ReadProperty(Item);
        this.ReadListEnd();
      };
      Collection.EndUpdate();
      this.ReadListEnd();
    };
    this.ReadComponent = function (Component) {
      var $Self = this;
      var Result = null;
      var Flags = {};
      function Recover(E, aComponent) {
        var Result = false;
        Result = false;
        if (!(($mod.TFilerFlag.ffInherited in Flags) || (Component != null))) aComponent.set(rtl.freeLoc(aComponent.get()));
        aComponent.set(null);
        $Self.FDriver.SkipComponent(false);
        Result = $Self.Error(E.fMessage);
        return Result;
      };
      var CompClassName = "";
      var Name = "";
      var n = 0;
      var ChildPos = 0;
      var SavedParent = null;
      var SavedLookupRoot = null;
      var ComponentClass = null;
      var C = null;
      var NewComponent = null;
      var SubComponents = null;
      this.FDriver.BeginComponent({get: function () {
          return Flags;
        }, set: function (v) {
          Flags = v;
        }},{get: function () {
          return ChildPos;
        }, set: function (v) {
          ChildPos = v;
        }},{get: function () {
          return CompClassName;
        }, set: function (v) {
          CompClassName = v;
        }},{get: function () {
          return Name;
        }, set: function (v) {
          Name = v;
        }});
      SavedParent = this.FParent;
      SavedLookupRoot = this.FLookupRoot;
      SubComponents = null;
      try {
        Result = Component;
        if (!(Result != null)) try {
          if ($mod.TFilerFlag.ffInherited in Flags) {
            if (this.FLookupRoot != null) {
              Result = this.FLookupRoot.FindComponent(Name)}
             else Result = null;
            if (!(Result != null)) {
              if (this.FOnAncestorNotFound != null) this.FOnAncestorNotFound($Self,Name,this.FindComponentClass(CompClassName),{get: function () {
                  return Result;
                }, set: function (v) {
                  Result = v;
                }});
              if (!(Result != null)) throw $mod.EReadError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SAncestorNotFound"),pas.System.VarRecs(18,Name)]);
            };
            this.FParent = Result.GetParentComponent();
            if (!(this.FParent != null)) this.FParent = this.FRoot;
          } else {
            Result = null;
            ComponentClass = this.FindComponentClass(CompClassName);
            if (this.FOnCreateComponent != null) this.FOnCreateComponent($Self,ComponentClass,{get: function () {
                return Result;
              }, set: function (v) {
                Result = v;
              }});
            if (!(Result != null)) {
              NewComponent = Object.create(ComponentClass);
              NewComponent.$init();
              if ($mod.TFilerFlag.ffInline in Flags) NewComponent.FComponentState = rtl.unionSet(NewComponent.FComponentState,rtl.createSet($mod.TComponentStateItem.csLoading,$mod.TComponentStateItem.csInline));
              NewComponent.Create$1(this.FOwner);
              NewComponent.AfterConstruction();
              Result = NewComponent;
            };
            Result.FComponentState = rtl.includeSet(Result.FComponentState,$mod.TComponentStateItem.csLoading);
          };
        } catch ($e) {
          if (pas.SysUtils.Exception.isPrototypeOf($e)) {
            var E = $e;
            if (!Recover(E,{get: function () {
                return Result;
              }, set: function (v) {
                Result = v;
              }})) throw $e;
          } else throw $e
        };
        if (Result != null) try {
          Result.FComponentState = rtl.includeSet(Result.FComponentState,$mod.TComponentStateItem.csLoading);
          SubComponents = $mod.TList.$create("Create$1");
          for (var $l = 0, $end = Result.GetComponentCount() - 1; $l <= $end; $l++) {
            n = $l;
            C = Result.GetComponent(n);
            if ($mod.TComponentStyleItem.csSubComponent in C.FComponentStyle) {
              SubComponents.Add(C);
              C.FComponentState = rtl.includeSet(C.FComponentState,$mod.TComponentStateItem.csLoading);
            };
          };
          if (!($mod.TFilerFlag.ffInherited in Flags)) try {
            Result.SetParentComponent(this.FParent);
            if (this.FOnSetName != null) this.FOnSetName($Self,Result,{get: function () {
                return Name;
              }, set: function (v) {
                Name = v;
              }});
            Result.SetName(Name);
            if ($mod.FindGlobalComponent(Name) === Result) Result.FComponentState = rtl.includeSet(Result.FComponentState,$mod.TComponentStateItem.csInline);
          } catch ($e) {
            if (pas.SysUtils.Exception.isPrototypeOf($e)) {
              var E = $e;
              if (!Recover(E,{get: function () {
                  return Result;
                }, set: function (v) {
                  Result = v;
                }})) throw $e;
            } else throw $e
          };
          if (!(Result != null)) return Result;
          if ($mod.TComponentStateItem.csInline in Result.FComponentState) this.FLookupRoot = Result;
          Result.FComponentState = rtl.includeSet(Result.FComponentState,$mod.TComponentStateItem.csReading);
          for (var $l1 = 0, $end1 = SubComponents.GetCount() - 1; $l1 <= $end1; $l1++) {
            n = $l1;
            rtl.getObject(SubComponents.Get(n)).FComponentState = rtl.includeSet(rtl.getObject(SubComponents.Get(n)).FComponentState,$mod.TComponentStateItem.csReading);
          };
          Result.ReadState($Self);
          Result.FComponentState = rtl.excludeSet(Result.FComponentState,$mod.TComponentStateItem.csReading);
          for (var $l2 = 0, $end2 = SubComponents.GetCount() - 1; $l2 <= $end2; $l2++) {
            n = $l2;
            rtl.getObject(SubComponents.Get(n)).FComponentState = rtl.excludeSet(rtl.getObject(SubComponents.Get(n)).FComponentState,$mod.TComponentStateItem.csReading);
          };
          if ($mod.TFilerFlag.ffChildPos in Flags) this.FParent.SetChildOrder(Result,ChildPos);
          if (!(($mod.TFilerFlag.ffInherited in Flags) || ($mod.TComponentStateItem.csInline in Result.FComponentState)) || (this.FLoaded.IndexOf(Result) < 0)) {
            for (var $l3 = 0, $end3 = SubComponents.GetCount() - 1; $l3 <= $end3; $l3++) {
              n = $l3;
              this.FLoaded.Add(SubComponents.Get(n));
            };
            this.FLoaded.Add(Result);
          };
        } catch ($e) {
          if (($mod.TFilerFlag.ffInherited in Flags) || (Component != null)) Result = rtl.freeLoc(Result);
          throw $e;
        };
      } finally {
        this.FParent = SavedParent;
        this.FLookupRoot = SavedLookupRoot;
        SubComponents = rtl.freeLoc(SubComponents);
      };
      return Result;
    };
    this.ReadComponents = function (AOwner, AParent, Proc) {
      var Component = null;
      this.SetRoot(AOwner);
      this.FOwner = AOwner;
      this.FParent = AParent;
      this.BeginReferences();
      try {
        while (!this.EndOfList()) {
          this.FDriver.BeginRootComponent();
          Component = this.ReadComponent(null);
          if (Proc != null) Proc(Component);
        };
        this.ReadListEnd();
        this.FixupReferences();
      } finally {
        this.EndReferences();
      };
    };
    this.ReadFloat = function () {
      var Result = 0.0;
      if (this.FDriver.NextValue() === $mod.TValueType.vaDouble) {
        this.ReadValue();
        Result = this.FDriver.ReadFloat();
      } else Result = this.ReadNativeInt();
      return Result;
    };
    this.ReadCurrency = function () {
      var Result = 0;
      if (this.FDriver.NextValue() === $mod.TValueType.vaCurrency) {
        this.FDriver.ReadValue();
        Result = this.FDriver.ReadCurrency();
      } else Result = this.ReadInteger() * 10000;
      return Result;
    };
    this.ReadIdent = function () {
      var Result = "";
      var ValueType = 0;
      ValueType = this.FDriver.ReadValue();
      if (ValueType in rtl.createSet($mod.TValueType.vaIdent,$mod.TValueType.vaNil,$mod.TValueType.vaFalse,$mod.TValueType.vaTrue,$mod.TValueType.vaNull)) {
        Result = this.FDriver.ReadIdent(ValueType)}
       else throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
      return Result;
    };
    this.ReadInteger = function () {
      var Result = 0;
      var $tmp = this.FDriver.ReadValue();
      if ($tmp === $mod.TValueType.vaInt8) {
        Result = this.FDriver.ReadInt8()}
       else if ($tmp === $mod.TValueType.vaInt16) {
        Result = this.FDriver.ReadInt16()}
       else if ($tmp === $mod.TValueType.vaInt32) {
        Result = this.FDriver.ReadInt32()}
       else {
        throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
      };
      return Result;
    };
    this.ReadNativeInt = function () {
      var Result = 0;
      if (this.FDriver.NextValue() === $mod.TValueType.vaNativeInt) {
        this.FDriver.ReadValue();
        Result = this.FDriver.ReadNativeInt();
      } else Result = this.ReadInteger();
      return Result;
    };
    this.ReadSet = function (EnumType) {
      var Result = 0;
      if (this.FDriver.NextValue() === $mod.TValueType.vaSet) {
        this.FDriver.ReadValue();
        Result = this.FDriver.ReadSet(EnumType);
      } else Result = this.ReadInteger();
      return Result;
    };
    this.ReadListBegin = function () {
      this.CheckValue($mod.TValueType.vaList);
    };
    this.ReadListEnd = function () {
      this.CheckValue($mod.TValueType.vaNull);
    };
    this.ReadRootComponent = function (ARoot) {
      var Result = null;
      var Dummy = 0;
      var i = 0;
      var Flags = {};
      var CompClassName = "";
      var CompName = "";
      var ResultName = "";
      this.FDriver.BeginRootComponent();
      Result = null;
      try {
        this.FDriver.BeginComponent({get: function () {
            return Flags;
          }, set: function (v) {
            Flags = v;
          }},{get: function () {
            return Dummy;
          }, set: function (v) {
            Dummy = v;
          }},{get: function () {
            return CompClassName;
          }, set: function (v) {
            CompClassName = v;
          }},{get: function () {
            return CompName;
          }, set: function (v) {
            CompName = v;
          }});
        if (!(ARoot != null)) {
          Result = $mod.FindClass(CompClassName).$create("Create$1",[null]);
          Result.SetName(CompName);
        } else {
          Result = ARoot;
          if (!($mod.TComponentStateItem.csDesigning in Result.FComponentState)) {
            Result.FComponentState = rtl.unionSet(Result.FComponentState,rtl.createSet($mod.TComponentStateItem.csLoading,$mod.TComponentStateItem.csReading));
            i = 0;
            ResultName = CompName;
            while ($mod.FindGlobalComponent(ResultName) != null) {
              i += 1;
              ResultName = CompName + "_" + pas.SysUtils.IntToStr(i);
            };
            Result.SetName(ResultName);
          };
        };
        this.FRoot = Result;
        this.FLookupRoot = Result;
        if ($impl.GlobalLoaded != null) {
          this.FLoaded = $impl.GlobalLoaded}
         else this.FLoaded = $mod.TFPList.$create("Create");
        try {
          if (this.FLoaded.IndexOf(this.FRoot) < 0) this.FLoaded.Add(this.FRoot);
          this.FOwner = this.FRoot;
          this.FRoot.FComponentState = rtl.unionSet(this.FRoot.FComponentState,rtl.createSet($mod.TComponentStateItem.csLoading,$mod.TComponentStateItem.csReading));
          this.FRoot.ReadState(this);
          this.FRoot.FComponentState = rtl.excludeSet(this.FRoot.FComponentState,$mod.TComponentStateItem.csReading);
          if (!($impl.GlobalLoaded != null)) for (var $l = 0, $end = this.FLoaded.FCount - 1; $l <= $end; $l++) {
            i = $l;
            rtl.getObject(this.FLoaded.Get(i)).Loaded();
          };
        } finally {
          if (!($impl.GlobalLoaded != null)) rtl.free(this,"FLoaded");
          this.FLoaded = null;
        };
        $impl.GlobalFixupReferences();
      } catch ($e) {
        $mod.RemoveFixupReferences(ARoot,"");
        if (!(ARoot != null)) Result = rtl.freeLoc(Result);
        throw $e;
      };
      return Result;
    };
    this.ReadVariant = function () {
      var Result = undefined;
      var nv = 0;
      nv = this.NextValue();
      var $tmp = nv;
      if ($tmp === $mod.TValueType.vaNil) {
        Result = undefined;
        this.ReadValue();
      } else if ($tmp === $mod.TValueType.vaNull) {
        Result = null;
        this.ReadValue();
      } else if (($tmp === $mod.TValueType.vaInt8) || ($tmp === $mod.TValueType.vaInt16) || ($tmp === $mod.TValueType.vaInt32)) {
        Result = this.ReadInteger();
      } else if ($tmp === $mod.TValueType.vaNativeInt) {
        Result = this.ReadNativeInt();
      } else if (($tmp === $mod.TValueType.vaFalse) || ($tmp === $mod.TValueType.vaTrue)) {
        Result = nv !== $mod.TValueType.vaFalse;
        this.ReadValue();
      } else if ($tmp === $mod.TValueType.vaCurrency) {
        Result = this.ReadCurrency() / 10000;
      } else if ($tmp === $mod.TValueType.vaDouble) {
        Result = this.ReadFloat();
      } else if ($tmp === $mod.TValueType.vaString) {
        Result = this.ReadString();
      } else {
        throw $mod.EReadError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SUnsupportedPropertyVariantType"),pas.System.VarRecs(0,nv)]);
      };
      return Result;
    };
    this.ReadSignature = function () {
      this.FDriver.ReadSignature();
    };
    this.ReadString = function () {
      var Result = "";
      var StringType = 0;
      StringType = this.FDriver.ReadValue();
      if (StringType === $mod.TValueType.vaString) {
        Result = this.FDriver.ReadString(StringType)}
       else throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidPropertyValue")]);
      return Result;
    };
    this.ReadWideString = function () {
      var Result = "";
      Result = this.ReadString();
      return Result;
    };
    this.ReadUnicodeString = function () {
      var Result = "";
      Result = this.ReadString();
      return Result;
    };
    this.ReadValue = function () {
      var Result = 0;
      Result = this.FDriver.ReadValue();
      return Result;
    };
    this.CopyValue = function (Writer) {
      var $tmp = this.FDriver.NextValue();
      if ($tmp === $mod.TValueType.vaNull) {
        Writer.WriteIdent("NULL")}
       else if ($tmp === $mod.TValueType.vaFalse) {
        Writer.WriteIdent("FALSE")}
       else if ($tmp === $mod.TValueType.vaTrue) {
        Writer.WriteIdent("TRUE")}
       else if ($tmp === $mod.TValueType.vaNil) {
        Writer.WriteIdent("NIL")}
       else if (($tmp === $mod.TValueType.vaInt8) || ($tmp === $mod.TValueType.vaInt16) || ($tmp === $mod.TValueType.vaInt32)) {
        Writer.WriteInteger(this.ReadInteger())}
       else if ($tmp === $mod.TValueType.vaDouble) {
        Writer.WriteFloat(this.ReadFloat())}
       else if ($tmp === $mod.TValueType.vaString) {
        Writer.WriteString(this.ReadString())}
       else if ($tmp === $mod.TValueType.vaIdent) {
        Writer.WriteIdent(this.ReadIdent())}
       else if ($tmp === $mod.TValueType.vaNativeInt) Writer.WriteInteger$1(this.ReadNativeInt());
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["Stream",$mod.$rtti["TStream"]]]);
  });
  rtl.createClass(this,"TAbstractObjectWriter",pas.System.TObject,function () {
  });
  rtl.createClass(this,"TBinaryObjectWriter",this.TAbstractObjectWriter,function () {
    this.$init = function () {
      $mod.TAbstractObjectWriter.$init.call(this);
      this.FStream = null;
      this.FBuffer = null;
      this.FBufSize = 0;
      this.FBufPos = 0;
      this.FBufEnd = 0;
    };
    this.$final = function () {
      this.FStream = undefined;
      $mod.TAbstractObjectWriter.$final.call(this);
    };
    this.WriteWord = function (w) {
      this.FStream.WriteBufferData$12(w);
    };
    this.WriteDWord = function (lw) {
      this.FStream.WriteBufferData$14(lw);
    };
    this.WriteValue = function (Value) {
      var b = 0;
      b = Value;
      this.FStream.WriteBufferData$8(b);
    };
    this.Create$1 = function (Stream) {
      pas.System.TObject.Create.call(this);
      if (Stream === null) throw $mod.EWriteError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SEmptyStreamIllegalWriter")]);
      this.FStream = Stream;
      return this;
    };
    this.WriteSignature = function () {
      this.FStream.WriteBufferData$14(809914452);
    };
    this.BeginCollection = function () {
      this.WriteValue($mod.TValueType.vaCollection);
    };
    this.BeginComponent = function (Component, Flags, ChildPos) {
      var Prefix = 0;
      if (rtl.neSet(Flags,{})) {
        Prefix = 0;
        if ($mod.TFilerFlag.ffInherited in Flags) Prefix = Prefix | 0x1;
        if ($mod.TFilerFlag.ffChildPos in Flags) Prefix = Prefix | 0x2;
        if ($mod.TFilerFlag.ffInline in Flags) Prefix = Prefix | 0x4;
        Prefix = Prefix | 0xf0;
        this.FStream.WriteBufferData$8(Prefix);
        if ($mod.TFilerFlag.ffChildPos in Flags) this.WriteInteger(ChildPos);
      };
      this.WriteStr(Component.$classname);
      this.WriteStr(Component.FName);
    };
    this.BeginList = function () {
      this.WriteValue($mod.TValueType.vaList);
    };
    this.EndList = function () {
      this.WriteValue($mod.TValueType.vaNull);
    };
    this.BeginProperty = function (PropName) {
      this.WriteStr(PropName);
    };
    this.EndProperty = function () {
    };
    this.FlushBuffer = function () {
    };
    this.Write = function (Buffer, Count) {
      this.FStream.Write(Buffer,Count);
    };
    this.WriteBinary = function (Buffer, Count) {
      this.WriteValue($mod.TValueType.vaBinary);
      this.WriteDWord(Count >>> 0);
      this.FStream.Write(Buffer,Count);
    };
    this.WriteBoolean = function (Value) {
      if (Value) {
        this.WriteValue($mod.TValueType.vaTrue)}
       else this.WriteValue($mod.TValueType.vaFalse);
    };
    this.WriteFloat = function (Value) {
      this.WriteValue($mod.TValueType.vaDouble);
      this.FStream.WriteBufferData$20(Value);
    };
    this.WriteCurrency = function (Value) {
      var F = 0.0;
      this.WriteValue($mod.TValueType.vaCurrency);
      F = Value / 10000;
      this.FStream.WriteBufferData$20(F);
    };
    this.WriteIdent = function (Ident) {
      if (pas.SysUtils.UpperCase(Ident) === "NIL") {
        this.WriteValue($mod.TValueType.vaNil)}
       else if (pas.SysUtils.UpperCase(Ident) === "FALSE") {
        this.WriteValue($mod.TValueType.vaFalse)}
       else if (pas.SysUtils.UpperCase(Ident) === "TRUE") {
        this.WriteValue($mod.TValueType.vaTrue)}
       else if (pas.SysUtils.UpperCase(Ident) === "NULL") {
        this.WriteValue($mod.TValueType.vaNull)}
       else {
        this.WriteValue($mod.TValueType.vaIdent);
        this.WriteStr(Ident);
      };
    };
    this.WriteInteger = function (Value) {
      var s = 0;
      var i = 0;
      var l = 0;
      if ((Value >= -128) && (Value <= 127)) {
        this.WriteValue($mod.TValueType.vaInt8);
        s = Value;
        this.FStream.WriteBufferData$6(s);
      } else if ((Value >= -32768) && (Value <= 32767)) {
        this.WriteValue($mod.TValueType.vaInt16);
        i = Value;
        this.WriteWord(i & 65535);
      } else if ((Value >= -0x80000000) && (Value <= 0x7fffffff)) {
        this.WriteValue($mod.TValueType.vaInt32);
        l = Value;
        this.WriteDWord(l >>> 0);
      } else {
        this.WriteValue($mod.TValueType.vaNativeInt);
        this.FStream.WriteBufferData$16(Value);
      };
    };
    this.WriteNativeInt = function (Value) {
      var s = 0;
      var i = 0;
      var l = 0;
      if (Value <= 127) {
        this.WriteValue($mod.TValueType.vaInt8);
        s = Value;
        this.FStream.WriteBufferData$6(s);
      } else if (Value <= 32767) {
        this.WriteValue($mod.TValueType.vaInt16);
        i = Value;
        this.WriteWord(i & 65535);
      } else if (Value <= 0x7fffffff) {
        this.WriteValue($mod.TValueType.vaInt32);
        l = Value;
        this.WriteDWord(l >>> 0);
      } else {
        this.WriteValue($mod.TValueType.vaNativeInt);
        this.FStream.WriteBufferData$16(Value);
      };
    };
    this.WriteMethodName = function (Name) {
      if (Name.length > 0) {
        this.WriteValue($mod.TValueType.vaIdent);
        this.WriteStr(Name);
      } else this.WriteValue($mod.TValueType.vaNil);
    };
    this.WriteSet = function (Value, SetType) {
      var i = 0;
      var b = 0;
      this.WriteValue($mod.TValueType.vaSet);
      b = 1;
      for (i = 0; i <= 31; i++) {
        if ((Value & b) !== 0) {
          this.WriteStr(pas.TypInfo.GetEnumName(SetType,i));
        };
        b = b << 1;
      };
      this.WriteStr("");
    };
    this.WriteStr = function (Value) {
      var len = 0;
      var i = 0;
      var b = 0;
      len = Value.length;
      if (len > 255) len = 255;
      b = len;
      this.FStream.WriteBufferData$8(b);
      for (var $l = 1, $end = len; $l <= $end; $l++) {
        i = $l;
        this.FStream.WriteBufferData$4(Value.charAt(i - 1));
      };
    };
    this.WriteString = function (Value) {
      var i = 0;
      var len = 0;
      len = Value.length;
      this.WriteValue($mod.TValueType.vaString);
      this.WriteDWord(len);
      for (var $l = 1, $end = len; $l <= $end; $l++) {
        i = $l;
        this.FStream.WriteBufferData$4(Value.charAt(i - 1));
      };
    };
    this.WriteWideString = function (Value) {
      this.WriteString(Value);
    };
    this.WriteUnicodeString = function (Value) {
      this.WriteString(Value);
    };
    this.WriteVariant = function (VarValue) {
      if (pas.JS.isUndefined(VarValue)) {
        this.WriteValue($mod.TValueType.vaNil)}
       else if (pas.JS.isNull(VarValue)) {
        this.WriteValue($mod.TValueType.vaNull)}
       else if (rtl.isNumber(VarValue)) {
        if (pas.System.Frac(rtl.getNumber(VarValue)) === 0) {
          this.WriteInteger(rtl.trunc(VarValue))}
         else this.WriteFloat(rtl.getNumber(VarValue));
      } else if (pas.JS.isBoolean(VarValue)) {
        this.WriteBoolean(!(VarValue == false))}
       else if (rtl.isString(VarValue)) {
        this.WriteString("" + VarValue)}
       else throw $mod.EWriteError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SUnsupportedPropertyVariantType")]);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["Stream",$mod.$rtti["TStream"]]]);
  });
  this.$rtti.$MethodVar("TFindAncestorEvent",{procsig: rtl.newTIProcSig([["Writer",this.$rtti["TWriter"]],["Component",this.$rtti["TComponent"]],["Name",rtl.string,2],["Ancestor",this.$rtti["TComponent"],1],["RootAncestor",this.$rtti["TComponent"],1]]), methodkind: 0});
  this.$rtti.$MethodVar("TWriteMethodPropertyEvent",{procsig: rtl.newTIProcSig([["Writer",this.$rtti["TWriter"]],["Instance",this.$rtti["TPersistent"]],["PropInfo",pas.TypInfo.$rtti["TTypeMemberProperty"]],["MethodValue",pas.System.$rtti["TMethod"],2],["DefMethodValue",pas.System.$rtti["TMethod"],2],["Handled",rtl.boolean,1]]), methodkind: 0});
  rtl.createClass(this,"TWriter",this.TFiler,function () {
    this.$init = function () {
      $mod.TFiler.$init.call(this);
      this.FDriver = null;
      this.FDestroyDriver = false;
      this.FRootAncestor = null;
      this.FPropPath = "";
      this.FAncestors = null;
      this.FAncestorPos = 0;
      this.FCurrentPos = 0;
      this.FOnFindAncestor = null;
      this.FOnWriteMethodProperty = null;
      this.FOnWriteStringProperty = null;
    };
    this.$final = function () {
      this.FDriver = undefined;
      this.FRootAncestor = undefined;
      this.FAncestors = undefined;
      this.FOnFindAncestor = undefined;
      this.FOnWriteMethodProperty = undefined;
      this.FOnWriteStringProperty = undefined;
      $mod.TFiler.$final.call(this);
    };
    this.AddToAncestorList = function (Component) {
      this.FAncestors.AddObject(Component.FName,$impl.TPosComponent.$create("Create$1",[this.FAncestors.GetCount(),Component]));
    };
    this.WriteComponentData = function (Instance) {
      var Flags = {};
      Flags = {};
      if ((this.FAncestor != null) && (!($mod.TComponentStateItem.csInline in Instance.FComponentState) || (($mod.TComponentStateItem.csAncestor in Instance.FComponentState) && (this.FAncestors !== null)))) {
        Flags = rtl.createSet($mod.TFilerFlag.ffInherited)}
       else if ($mod.TComponentStateItem.csInline in Instance.FComponentState) Flags = rtl.createSet($mod.TFilerFlag.ffInline);
      if ((this.FAncestors !== null) && ((this.FCurrentPos !== this.FAncestorPos) || (this.FAncestor === null))) Flags = rtl.includeSet(Flags,$mod.TFilerFlag.ffChildPos);
      this.FDriver.BeginComponent(Instance,rtl.refSet(Flags),this.FCurrentPos);
      if (this.FAncestors !== null) this.FCurrentPos += 1;
      this.WriteProperties(Instance);
      this.WriteListEnd();
      if (!this.FIgnoreChildren) this.WriteChildren(Instance);
    };
    this.DetermineAncestor = function (Component) {
      var I = 0;
      if (!(this.FAncestors != null)) return;
      I = this.FAncestors.IndexOf(Component.FName);
      if (I === -1) {
        this.FAncestor = null;
        this.FAncestorPos = -1;
      } else {
        var $with = this.FAncestors.GetObject(I);
        this.FAncestor = $with.FComponent;
        this.FAncestorPos = $with.FPos;
      };
    };
    this.DoFindAncestor = function (Component) {
      var C = null;
      if (this.FOnFindAncestor != null) if ((this.FAncestor === null) || $mod.TComponent.isPrototypeOf(this.FAncestor)) {
        C = this.FAncestor;
        this.FOnFindAncestor(this,Component,Component.FName,{get: function () {
            return C;
          }, set: function (v) {
            C = v;
          }},{p: this, get: function () {
            return this.p.FRootAncestor;
          }, set: function (v) {
            this.p.FRootAncestor = v;
          }});
        this.FAncestor = C;
      };
    };
    this.SetRoot = function (ARoot) {
      $mod.TFiler.SetRoot.call(this,ARoot);
      this.FLookupRoot = ARoot;
    };
    this.WriteBinary = function (AWriteData) {
      var MemBuffer = null;
      MemBuffer = $mod.TBytesStream.$create("Create");
      try {
        AWriteData(MemBuffer);
        this.FDriver.WriteBinary(MemBuffer.GetBytes(),MemBuffer.GetSize());
      } finally {
        MemBuffer = rtl.freeLoc(MemBuffer);
      };
    };
    this.WriteProperty = function (Instance, PropInfo) {
      var HasAncestor = false;
      var PropType = null;
      var N = 0;
      var Value = 0;
      var DefValue = 0;
      var Ident = "";
      var IntToIdentFn = null;
      var FloatValue = 0.0;
      var DefFloatValue = 0.0;
      var MethodValue = pas.System.TMethod.$new();
      var DefMethodValue = pas.System.TMethod.$new();
      var StrValue = "";
      var DefStrValue = "";
      var AncestorObj = null;
      var C = null;
      var Component = null;
      var ObjValue = null;
      var SavedAncestor = null;
      var Key = "";
      var SavedPropPath = "";
      var Name = "";
      var lMethodName = "";
      var VarValue = undefined;
      var DefVarValue = undefined;
      var BoolValue = false;
      var DefBoolValue = false;
      var Handled = false;
      var O = null;
      if (PropInfo.getter === "") return;
      PropType = PropInfo.typeinfo;
      if (PropInfo.setter === "") {
        if (PropType.kind !== pas.System.TTypeKind.tkClass) return;
        ObjValue = pas.TypInfo.GetObjectProp$2(Instance,PropInfo);
        if (!ObjValue.$class.InheritsFrom($mod.TComponent) || !($mod.TComponentStyleItem.csSubComponent in ObjValue.FComponentStyle)) return;
      };
      HasAncestor = (this.FAncestor != null) && ((Instance === this.FRoot) || (Instance.$class.ClassType() === this.FAncestor.$class.ClassType()));
      var $tmp = PropType.kind;
      if (($tmp === pas.System.TTypeKind.tkInteger) || ($tmp === pas.System.TTypeKind.tkChar) || ($tmp === pas.System.TTypeKind.tkEnumeration) || ($tmp === pas.System.TTypeKind.tkSet)) {
        Value = pas.TypInfo.GetOrdProp$1(Instance,PropInfo);
        if (HasAncestor) {
          DefValue = pas.TypInfo.GetOrdProp$1(this.FAncestor,PropInfo)}
         else {
          if (PropType.kind !== pas.System.TTypeKind.tkSet) {
            DefValue = rtl.trunc(PropInfo.Default)}
           else {
            O = PropInfo.Default;
            DefValue = 0;
            for (Key in O) {
              N = parseInt(Key,10);
              if (N < 32) DefValue = DefValue + (1 << N);
            };
          };
        };
        if ((Value !== DefValue) || (DefValue === 0x80000000)) {
          this.FDriver.BeginProperty(this.FPropPath + PropInfo.name);
          var $tmp1 = PropType.kind;
          if ($tmp1 === pas.System.TTypeKind.tkInteger) {
            IntToIdentFn = $mod.FindIntToIdent(PropInfo.typeinfo);
            if ((IntToIdentFn != null) && IntToIdentFn(Value,{get: function () {
                return Ident;
              }, set: function (v) {
                Ident = v;
              }})) {
              this.WriteIdent(Ident)}
             else this.WriteInteger(Value);
          } else if ($tmp1 === pas.System.TTypeKind.tkChar) {
            this.WriteChar(String.fromCharCode(Value))}
           else if ($tmp1 === pas.System.TTypeKind.tkSet) {
            this.FDriver.WriteSet(Value,PropType.comptype);
          } else if ($tmp1 === pas.System.TTypeKind.tkEnumeration) this.WriteIdent(pas.TypInfo.GetEnumName(PropType,Value));
          this.FDriver.EndProperty();
        };
      } else if ($tmp === pas.System.TTypeKind.tkDouble) {
        FloatValue = pas.TypInfo.GetFloatProp$1(Instance,PropInfo);
        if (HasAncestor) {
          DefFloatValue = pas.TypInfo.GetFloatProp$1(this.FAncestor,PropInfo)}
         else {
          DefFloatValue = rtl.getNumber(PropInfo.Default);
        };
        if ((FloatValue !== DefFloatValue) || (!HasAncestor && (pas.System.Int(DefFloatValue) === 0x80000000))) {
          this.FDriver.BeginProperty(this.FPropPath + PropInfo.name);
          this.WriteFloat(FloatValue);
          this.FDriver.EndProperty();
        };
      } else if ($tmp === pas.System.TTypeKind.tkMethod) {
        MethodValue.$assign(pas.TypInfo.GetMethodProp(Instance,PropInfo));
        if (HasAncestor) {
          DefMethodValue.$assign(pas.TypInfo.GetMethodProp(this.FAncestor,PropInfo))}
         else {
          DefMethodValue.Data = null;
          DefMethodValue.Code = null;
        };
        Handled = false;
        if (this.FOnWriteMethodProperty != null) this.FOnWriteMethodProperty(this,Instance,PropInfo,MethodValue,DefMethodValue,{get: function () {
            return Handled;
          }, set: function (v) {
            Handled = v;
          }});
        if (rtl.isString(MethodValue.Code)) {
          lMethodName = MethodValue.Code}
         else lMethodName = this.FLookupRoot.$class.MethodName(MethodValue.Code);
        if (!Handled && (MethodValue.Code !== DefMethodValue.Code) && (!(MethodValue.Code != null) || (lMethodName.length > 0))) {
          this.FDriver.BeginProperty(this.FPropPath + PropInfo.name);
          if (MethodValue.Code != null) {
            this.FDriver.WriteMethodName(lMethodName)}
           else this.FDriver.WriteMethodName("");
          this.FDriver.EndProperty();
        };
      } else if ($tmp === pas.System.TTypeKind.tkString) {
        StrValue = pas.TypInfo.GetStrProp$1(Instance,PropInfo);
        if (HasAncestor) {
          DefStrValue = pas.TypInfo.GetStrProp$1(this.FAncestor,PropInfo)}
         else {
          DefValue = rtl.trunc(PropInfo.Default);
          DefStrValue = rtl.strSetLength(DefStrValue,0);
        };
        if ((StrValue !== DefStrValue) || (!HasAncestor && (DefValue === 0x80000000))) {
          this.FDriver.BeginProperty(this.FPropPath + PropInfo.name);
          if (this.FOnWriteStringProperty != null) this.FOnWriteStringProperty(this,Instance,PropInfo,{get: function () {
              return StrValue;
            }, set: function (v) {
              StrValue = v;
            }});
          this.WriteString(StrValue);
          this.FDriver.EndProperty();
        };
      } else if ($tmp === pas.System.TTypeKind.tkJSValue) {
        VarValue = pas.TypInfo.GetJSValueProp$3(Instance,PropInfo);
        if (HasAncestor) {
          DefVarValue = pas.TypInfo.GetJSValueProp$3(this.FAncestor,PropInfo)}
         else DefVarValue = null;
        if (VarValue != DefVarValue) {
          this.FDriver.BeginProperty(this.FPropPath + PropInfo.name);
          this.WriteVariant(VarValue);
          this.FDriver.EndProperty();
        };
      } else if ($tmp === pas.System.TTypeKind.tkClass) {
        ObjValue = pas.TypInfo.GetObjectProp$2(Instance,PropInfo);
        if (HasAncestor) {
          AncestorObj = pas.TypInfo.GetObjectProp$2(this.FAncestor,PropInfo);
          if ($mod.TComponent.isPrototypeOf(AncestorObj) && $mod.TComponent.isPrototypeOf(ObjValue)) {
            if ((AncestorObj !== ObjValue) && (AncestorObj.FOwner === this.FRootAncestor) && (ObjValue.FOwner === this.FRoot) && (pas.SysUtils.UpperCase(AncestorObj.FName) === pas.SysUtils.UpperCase(ObjValue.FName))) {
              AncestorObj = ObjValue;
            };
          };
        } else AncestorObj = null;
        if (!(ObjValue != null)) {
          if (ObjValue !== AncestorObj) {
            this.FDriver.BeginProperty(this.FPropPath + PropInfo.name);
            this.FDriver.WriteIdent("NIL");
            this.FDriver.EndProperty();
          };
        } else if (ObjValue.$class.InheritsFrom($mod.TPersistent)) {
          if (ObjValue.$class.InheritsFrom($mod.TComponent) && (!($mod.TComponentStyleItem.csSubComponent in ObjValue.FComponentStyle) || ((ObjValue.FOwner !== Instance) && (ObjValue.FOwner !== null)))) {
            Component = ObjValue;
            if ((ObjValue !== AncestorObj) && !($mod.TComponentStyleItem.csTransient in Component.FComponentStyle)) {
              Name = "";
              C = Component;
              while ((C !== null) && (C.FName !== "")) {
                if (Name !== "") Name = "." + Name;
                if (C.FOwner === this.FLookupRoot) {
                  Name = C.FName + Name;
                  break;
                } else if (C === this.FLookupRoot) {
                  Name = "Owner" + Name;
                  break;
                };
                Name = C.FName + Name;
                C = C.FOwner;
              };
              if ((C === null) && (Component.FOwner === null)) if (Name !== "") Name = Name + ".Owner";
              if (Name.length > 0) {
                this.FDriver.BeginProperty(this.FPropPath + PropInfo.name);
                this.WriteIdent(Name);
                this.FDriver.EndProperty();
              };
            };
          } else {
            SavedAncestor = this.FAncestor;
            SavedPropPath = this.FPropPath;
            try {
              this.FPropPath = this.FPropPath + PropInfo.name + ".";
              if (HasAncestor) this.FAncestor = pas.TypInfo.GetObjectProp$2(this.FAncestor,PropInfo);
              this.WriteProperties(ObjValue);
            } finally {
              this.FAncestor = SavedAncestor;
              this.FPropPath = SavedPropPath;
            };
            if (ObjValue.$class.InheritsFrom($mod.TCollection)) {
              if (!HasAncestor || !$mod.CollectionsEqual$1(ObjValue,pas.TypInfo.GetObjectProp$2(this.FAncestor,PropInfo),this.FRoot,this.FRootAncestor)) {
                this.FDriver.BeginProperty(this.FPropPath + PropInfo.name);
                SavedPropPath = this.FPropPath;
                try {
                  this.FPropPath = rtl.strSetLength(this.FPropPath,0);
                  this.WriteCollection(ObjValue);
                } finally {
                  this.FPropPath = SavedPropPath;
                  this.FDriver.EndProperty();
                };
              };
            };
          };
        };
      } else if ($tmp === pas.System.TTypeKind.tkBool) {
        BoolValue = pas.TypInfo.GetOrdProp$1(Instance,PropInfo) !== 0;
        if (HasAncestor) {
          DefBoolValue = pas.TypInfo.GetOrdProp$1(this.FAncestor,PropInfo) !== 0}
         else {
          DefBoolValue = PropInfo.Default != 0;
          DefValue = rtl.trunc(PropInfo.Default);
        };
        if ((BoolValue !== DefBoolValue) || (DefValue === 0x80000000)) {
          this.FDriver.BeginProperty(this.FPropPath + PropInfo.name);
          this.WriteBoolean(BoolValue);
          this.FDriver.EndProperty();
        };
      } else if ($tmp === pas.System.TTypeKind.tkInterface) ;
    };
    this.WriteProperties = function (Instance) {
      var PropCount = 0;
      var i = 0;
      var PropList = [];
      PropList = pas.TypInfo.GetPropList$3(Instance);
      PropCount = rtl.length(PropList);
      if (PropCount > 0) for (var $l = 0, $end = PropCount - 1; $l <= $end; $l++) {
        i = $l;
        if (pas.TypInfo.IsStoredProp(Instance,PropList[i])) this.WriteProperty(Instance,PropList[i]);
      };
      Instance.DefineProperties(this);
    };
    this.WriteChildren = function (Component) {
      var SRoot = null;
      var SRootA = null;
      var SList = null;
      var SPos = 0;
      var I = 0;
      var SAncestorPos = 0;
      var O = null;
      SRoot = this.FRoot;
      SRootA = this.FRootAncestor;
      SList = this.FAncestors;
      SPos = this.FCurrentPos;
      SAncestorPos = this.FAncestorPos;
      try {
        this.FAncestors = null;
        this.FCurrentPos = 0;
        this.FAncestorPos = -1;
        if ($mod.TComponentStateItem.csInline in Component.FComponentState) this.FRoot = Component;
        if ($mod.TComponent.isPrototypeOf(this.FAncestor)) {
          this.FAncestors = $mod.TStringList.$create("Create$1");
          if ($mod.TComponentStateItem.csInline in this.FAncestor.FComponentState) this.FRootAncestor = this.FAncestor;
          this.FAncestor.GetChildren(rtl.createCallback(this,"AddToAncestorList"),this.FRootAncestor);
          this.FAncestors.SetSorted(true);
        };
        try {
          Component.GetChildren(rtl.createCallback(this,"WriteComponent"),this.FRoot);
        } finally {
          if (this.FAncestors != null) for (var $l = 0, $end = this.FAncestors.GetCount() - 1; $l <= $end; $l++) {
            I = $l;
            O = this.FAncestors.GetObject(I);
            this.FAncestors.PutObject(I,null);
            O = rtl.freeLoc(O);
          };
          pas.SysUtils.FreeAndNil({p: this, get: function () {
              return this.p.FAncestors;
            }, set: function (v) {
              this.p.FAncestors = v;
            }});
        };
      } finally {
        this.FAncestors = SList;
        this.FRoot = SRoot;
        this.FRootAncestor = SRootA;
        this.FCurrentPos = SPos;
        this.FAncestorPos = SAncestorPos;
      };
    };
    this.CreateDriver = function (Stream) {
      var Result = null;
      Result = $mod.TBinaryObjectWriter.$create("Create$1",[Stream]);
      return Result;
    };
    this.Create$1 = function (ADriver) {
      pas.System.TObject.Create.call(this);
      this.FDriver = ADriver;
      return this;
    };
    this.Create$2 = function (Stream) {
      pas.System.TObject.Create.call(this);
      if (Stream === null) throw $mod.EWriteError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SEmptyStreamIllegalWriter")]);
      this.FDriver = this.CreateDriver(Stream);
      this.FDestroyDriver = true;
      return this;
    };
    this.Destroy = function () {
      if (this.FDestroyDriver) rtl.free(this,"FDriver");
      pas.System.TObject.Destroy.call(this);
    };
    this.DefineProperty = function (Name, ReadData, AWriteData, HasData) {
      if (HasData && (AWriteData != null)) {
        this.FDriver.BeginProperty(this.FPropPath + Name);
        AWriteData(this);
        this.FDriver.EndProperty();
      } else if (ReadData != null) ;
    };
    this.DefineBinaryProperty = function (Name, ReadData, AWriteData, HasData) {
      if (HasData && (AWriteData != null)) {
        this.FDriver.BeginProperty(this.FPropPath + Name);
        this.WriteBinary(AWriteData);
        this.FDriver.EndProperty();
      } else if (ReadData != null) ;
    };
    this.FlushBuffer = function () {
      this.FDriver.FlushBuffer();
    };
    this.Write = function (Buffer, Count) {
      this.FDriver.Write(Buffer,Count);
    };
    this.WriteBoolean = function (Value) {
      this.FDriver.WriteBoolean(Value);
    };
    this.WriteCollection = function (Value) {
      var i = 0;
      this.FDriver.BeginCollection();
      if (Value != null) for (var $l = 0, $end = Value.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        this.WriteListBegin();
        this.WriteProperties(Value.GetItem(i));
        this.WriteListEnd();
      };
      this.WriteListEnd();
    };
    this.WriteComponent = function (Component) {
      var SA = null;
      var SR = null;
      var SRA = null;
      SR = this.FRoot;
      SA = this.FAncestor;
      SRA = this.FRootAncestor;
      try {
        Component.FComponentState = rtl.unionSet(Component.FComponentState,rtl.createSet($mod.TComponentStateItem.csWriting));
        try {
          this.DetermineAncestor(Component);
          this.DoFindAncestor(Component);
          Component.WriteState(this);
          this.FDriver.EndList();
        } finally {
          Component.FComponentState = rtl.diffSet(Component.FComponentState,rtl.createSet($mod.TComponentStateItem.csWriting));
        };
      } finally {
        this.FAncestor = SA;
        this.FRoot = SR;
        this.FRootAncestor = SRA;
      };
    };
    this.WriteChar = function (Value) {
      this.WriteString(Value);
    };
    this.WriteWideChar = function (Value) {
      this.WriteWideString(Value);
    };
    this.WriteDescendent = function (ARoot, AAncestor) {
      this.FRoot = ARoot;
      this.FAncestor = AAncestor;
      this.FRootAncestor = AAncestor;
      this.FLookupRoot = ARoot;
      this.WriteSignature();
      this.WriteComponent(ARoot);
    };
    this.WriteFloat = function (Value) {
      this.FDriver.WriteFloat(Value);
    };
    this.WriteCurrency = function (Value) {
      this.FDriver.WriteCurrency(Value);
    };
    this.WriteIdent = function (Ident) {
      this.FDriver.WriteIdent(Ident);
    };
    this.WriteInteger = function (Value) {
      this.FDriver.WriteInteger(Value);
    };
    this.WriteInteger$1 = function (Value) {
      this.FDriver.WriteInteger(Value);
    };
    this.WriteSet = function (Value, SetType) {
      this.FDriver.WriteSet(Value,SetType);
    };
    this.WriteListBegin = function () {
      this.FDriver.BeginList();
    };
    this.WriteListEnd = function () {
      this.FDriver.EndList();
    };
    this.WriteSignature = function () {
      this.FDriver.WriteSignature();
    };
    this.WriteRootComponent = function (ARoot) {
      this.WriteDescendent(ARoot,null);
    };
    this.WriteString = function (Value) {
      this.FDriver.WriteString(Value);
    };
    this.WriteWideString = function (Value) {
      this.FDriver.WriteWideString(Value);
    };
    this.WriteUnicodeString = function (Value) {
      this.FDriver.WriteUnicodeString(Value);
    };
    this.WriteVariant = function (VarValue) {
      this.FDriver.WriteVariant(VarValue);
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ADriver",$mod.$rtti["TAbstractObjectWriter"]]]);
    $r.addMethod("Create$2",2,[["Stream",$mod.$rtti["TStream"]]]);
  });
  this.TParserToken = {"0": "toUnknown", toUnknown: 0, "1": "toEOF", toEOF: 1, "2": "toSymbol", toSymbol: 2, "3": "ToString", ToString: 3, "4": "toInteger", toInteger: 4, "5": "toFloat", toFloat: 5, "6": "toMinus", toMinus: 6, "7": "toSetStart", toSetStart: 7, "8": "toListStart", toListStart: 8, "9": "toCollectionStart", toCollectionStart: 9, "10": "toBinaryStart", toBinaryStart: 10, "11": "toSetEnd", toSetEnd: 11, "12": "toListEnd", toListEnd: 12, "13": "toCollectionEnd", toCollectionEnd: 13, "14": "toBinaryEnd", toBinaryEnd: 14, "15": "toComma", toComma: 15, "16": "toDot", toDot: 16, "17": "toEqual", toEqual: 17, "18": "toColon", toColon: 18, "19": "toPlus", toPlus: 19};
  this.$rtti.$Enum("TParserToken",{minvalue: 0, maxvalue: 19, ordtype: 1, enumtype: this.TParserToken});
  rtl.createClass(this,"TParser",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.fStream = null;
      this.fBuf = [];
      this.FBufLen = 0;
      this.fPos = 0;
      this.fDeltaPos = 0;
      this.fFloatType = "\x00";
      this.fSourceLine = 0;
      this.fToken = 0;
      this.fEofReached = false;
      this.fLastTokenStr = "";
    };
    this.$final = function () {
      this.fStream = undefined;
      this.fBuf = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.GetTokenName = function (aTok) {
      var Result = "";
      Result = $impl.TokNames[aTok];
      return Result;
    };
    this.LoadBuffer = function () {
      var CharsRead = 0;
      var i = 0;
      CharsRead = 0;
      for (i = 0; i <= 4095; i++) {
        if (this.fStream.ReadData$3({a: i, p: this.fBuf, get: function () {
            return this.p[this.a];
          }, set: function (v) {
            this.p[this.a] = v;
          }}) !== 2) break;
        CharsRead += 1;
      };
      this.fDeltaPos += CharsRead;
      this.fPos = 0;
      this.FBufLen = CharsRead;
      this.fEofReached = CharsRead === 0;
    };
    this.CheckLoadBuffer = function () {
      if (this.fPos >= this.FBufLen) this.LoadBuffer();
    };
    this.ProcessChar = function () {
      this.fLastTokenStr = this.fLastTokenStr + this.fBuf[this.fPos];
      this.GotoToNextChar();
    };
    this.IsNumber = function () {
      var Result = false;
      Result = this.fBuf[this.fPos].charCodeAt() in rtl.createSet(null,48,57);
      return Result;
    };
    this.IsHexNum = function () {
      var Result = false;
      Result = this.fBuf[this.fPos].charCodeAt() in rtl.createSet(null,48,57,null,65,70,null,97,102);
      return Result;
    };
    this.IsAlpha = function () {
      var Result = false;
      Result = this.fBuf[this.fPos].charCodeAt() in rtl.createSet(95,null,65,90,null,97,122);
      return Result;
    };
    this.IsAlphaNum = function () {
      var Result = false;
      Result = this.IsAlpha() || this.IsNumber();
      return Result;
    };
    this.GetHexValue = function (c) {
      var Result = 0;
      var $tmp = c;
      if (($tmp >= "0") && ($tmp <= "9")) {
        Result = c.charCodeAt() - 0x30}
       else if (($tmp >= "A") && ($tmp <= "F")) {
        Result = c.charCodeAt() - 0x37}
       else if (($tmp >= "a") && ($tmp <= "f")) Result = c.charCodeAt() - 0x57;
      return Result;
    };
    this.GetAlphaNum = function () {
      var Result = "";
      if (!this.IsAlpha()) this.ErrorFmt(rtl.getResStr(pas.RTLConsts,"SParserExpected"),pas.System.VarRecs(18,this.GetTokenName($mod.TParserToken.toSymbol)));
      Result = "";
      while (!this.fEofReached && this.IsAlphaNum()) {
        Result = Result + this.fBuf[this.fPos];
        this.GotoToNextChar();
      };
      return Result;
    };
    this.HandleNewLine = function () {
      if (this.fBuf[this.fPos] === "\r") this.GotoToNextChar();
      if (!this.fEofReached && (this.fBuf[this.fPos] === "\n")) this.GotoToNextChar();
      this.fSourceLine += 1;
      this.fDeltaPos = -(this.fPos - 1);
    };
    this.SkipBOM = function () {
    };
    this.SkipSpaces = function () {
      while (!this.fEofReached && (this.fBuf[this.fPos].charCodeAt() in rtl.createSet(32,9))) this.GotoToNextChar();
    };
    this.SkipWhitespace = function () {
      while (!this.fEofReached) {
        var $tmp = this.fBuf[this.fPos];
        if (($tmp === " ") || ($tmp === "\t")) {
          this.SkipSpaces()}
         else if (($tmp === "\n") || ($tmp === "\r")) {
          this.HandleNewLine()}
         else {
          break;
        };
      };
    };
    this.HandleEof = function () {
      this.fToken = $mod.TParserToken.toEOF;
      this.fLastTokenStr = "";
    };
    this.HandleAlphaNum = function () {
      this.fLastTokenStr = this.GetAlphaNum();
      this.fToken = $mod.TParserToken.toSymbol;
    };
    var floatPunct = {"0": "fpDot", fpDot: 0, "1": "fpE", fpE: 1};
    this.HandleNumber = function () {
      var allowed = {};
      this.fLastTokenStr = "";
      while (this.IsNumber()) this.ProcessChar();
      this.fToken = $mod.TParserToken.toInteger;
      if (this.fBuf[this.fPos].charCodeAt() in rtl.createSet(46,101,69)) {
        this.fToken = $mod.TParserToken.toFloat;
        allowed = rtl.createSet(floatPunct.fpDot,floatPunct.fpE);
        while (this.fBuf[this.fPos].charCodeAt() in rtl.createSet(46,101,69,null,48,57)) {
          var $tmp = this.fBuf[this.fPos];
          if ($tmp === ".") {
            if (floatPunct.fpDot in allowed) {
              allowed = rtl.excludeSet(allowed,floatPunct.fpDot)}
             else break}
           else if (($tmp === "E") || ($tmp === "e")) if (floatPunct.fpE in allowed) {
            allowed = {};
            this.ProcessChar();
            if (this.fBuf[this.fPos].charCodeAt() in rtl.createSet(43,45)) this.ProcessChar();
            if (!(this.fBuf[this.fPos].charCodeAt() in rtl.createSet(null,48,57))) this.ErrorFmt(rtl.getResStr(pas.RTLConsts,"SParserInvalidFloat"),pas.System.VarRecs(18,this.fLastTokenStr + this.fBuf[this.fPos]));
          } else break;
          this.ProcessChar();
        };
      };
      if (this.fBuf[this.fPos].charCodeAt() in rtl.createSet(115,83,100,68,99,67)) {
        this.fFloatType = this.fBuf[this.fPos];
        this.GotoToNextChar();
        this.fToken = $mod.TParserToken.toFloat;
      } else this.fFloatType = "\x00";
    };
    this.HandleHexNumber = function () {
      var valid = false;
      this.fLastTokenStr = "$";
      this.GotoToNextChar();
      valid = false;
      while (this.IsHexNum()) {
        valid = true;
        this.ProcessChar();
      };
      if (!valid) this.ErrorFmt(rtl.getResStr(pas.RTLConsts,"SParserInvalidInteger"),pas.System.VarRecs(18,this.fLastTokenStr));
      this.fToken = $mod.TParserToken.toInteger;
    };
    this.HandleQuotedString = function () {
      var Result = "";
      Result = "";
      this.GotoToNextChar();
      while (true) {
        var $tmp = this.fBuf[this.fPos];
        if ($tmp === "\x00") {
          this.ErrorStr(rtl.getResStr(pas.RTLConsts,"SParserUnterminatedString"))}
         else if (($tmp === "\r") || ($tmp === "\n")) {
          this.ErrorStr(rtl.getResStr(pas.RTLConsts,"SParserUnterminatedString"))}
         else if ($tmp === "'") {
          this.GotoToNextChar();
          if (this.fBuf[this.fPos] !== "'") return Result;
        };
        Result = Result + this.fBuf[this.fPos];
        this.GotoToNextChar();
      };
      return Result;
    };
    this.HandleDecimalCharacter = function () {
      var Result = "\x00";
      var i = 0;
      this.GotoToNextChar();
      i = 0;
      while (this.IsNumber() && (i < 65535)) {
        i = ((i * 10) + this.fBuf[this.fPos].charCodeAt()) - 48;
        this.GotoToNextChar();
      };
      if (i > 65535) i = 0;
      Result = String.fromCharCode(i);
      return Result;
    };
    this.HandleString = function () {
      var s = "";
      this.fLastTokenStr = "";
      while (true) {
        var $tmp = this.fBuf[this.fPos];
        if ($tmp === "'") {
          s = this.HandleQuotedString();
          this.fLastTokenStr = this.fLastTokenStr + s;
        } else if ($tmp === "#") {
          this.fLastTokenStr = this.fLastTokenStr + this.HandleDecimalCharacter();
        } else {
          break;
        };
      };
      this.fToken = $mod.TParserToken.ToString;
    };
    this.HandleMinus = function () {
      this.GotoToNextChar();
      if (this.IsNumber()) {
        this.HandleNumber();
        this.fLastTokenStr = "-" + this.fLastTokenStr;
      } else {
        this.fToken = $mod.TParserToken.toMinus;
        this.fLastTokenStr = "-";
      };
    };
    this.HandleUnknown = function () {
      this.fToken = $mod.TParserToken.toUnknown;
      this.fLastTokenStr = this.fBuf[this.fPos];
      this.GotoToNextChar();
    };
    this.GotoToNextChar = function () {
      this.fPos += 1;
      this.CheckLoadBuffer();
    };
    this.Create$1 = function (Stream) {
      this.fStream = Stream;
      this.fBuf = rtl.arraySetLength(this.fBuf,"\x00",4096);
      this.FBufLen = 0;
      this.fPos = 0;
      this.fDeltaPos = 1;
      this.fSourceLine = 1;
      this.fEofReached = false;
      this.fLastTokenStr = "";
      this.fFloatType = "\x00";
      this.fToken = $mod.TParserToken.toEOF;
      this.LoadBuffer();
      this.SkipBOM();
      this.NextToken();
      return this;
    };
    this.Destroy = function () {
      var aCount = 0;
      aCount = this.fLastTokenStr.length * 2;
      this.fStream.SetPosition(this.SourcePos() - aCount);
    };
    this.CheckToken = function (T) {
      if (this.fToken !== T) this.ErrorFmt(rtl.getResStr(pas.RTLConsts,"SParserWrongTokenType"),pas.System.VarRecs(18,this.GetTokenName(T),18,this.GetTokenName(this.fToken)));
    };
    this.CheckTokenSymbol = function (S) {
      this.CheckToken($mod.TParserToken.toSymbol);
      if (pas.SysUtils.CompareText(this.fLastTokenStr,S) !== 0) this.ErrorFmt(rtl.getResStr(pas.RTLConsts,"SParserWrongTokenSymbol"),pas.System.VarRecs(18,S,18,this.fLastTokenStr));
    };
    this.Error = function (Ident) {
      this.ErrorStr(Ident);
    };
    this.ErrorFmt = function (Ident, Args) {
      this.ErrorStr(pas.SysUtils.Format(Ident,Args));
    };
    this.ErrorStr = function (Message) {
      throw $mod.EParserError.$create("CreateFmt",[Message + rtl.getResStr(pas.RTLConsts,"SParserLocInfo"),pas.System.VarRecs(0,this.fSourceLine,0,this.fPos + this.fDeltaPos,0,this.SourcePos())]);
    };
    this.HexToBinary = function (Stream) {
      var outbuf = [];
      var b = 0;
      var i = 0;
      outbuf = rtl.arraySetLength(outbuf,0,4096);
      i = 0;
      this.SkipWhitespace();
      while (this.IsHexNum()) {
        b = this.GetHexValue(this.fBuf[this.fPos]) << 4;
        this.GotoToNextChar();
        if (!this.IsHexNum()) this.Error(rtl.getResStr(pas.RTLConsts,"SParserUnterminatedBinValue"));
        b = b | this.GetHexValue(this.fBuf[this.fPos]);
        this.GotoToNextChar();
        outbuf[i] = b;
        i += 1;
        if (i >= 4096) {
          Stream.WriteBuffer(outbuf,i);
          i = 0;
        };
        this.SkipWhitespace();
      };
      if (i > 0) Stream.WriteBuffer(outbuf,i);
      this.NextToken();
    };
    this.NextToken = function () {
      var $Self = this;
      var Result = 0;
      function SetToken(aToken) {
        $Self.fToken = aToken;
        $Self.GotoToNextChar();
      };
      this.SkipWhitespace();
      if (this.fEofReached) {
        this.HandleEof()}
       else {
        var $tmp = this.fBuf[this.fPos];
        if (($tmp === "_") || (($tmp >= "A") && ($tmp <= "Z")) || (($tmp >= "a") && ($tmp <= "z"))) {
          this.HandleAlphaNum()}
         else if ($tmp === "$") {
          this.HandleHexNumber()}
         else if ($tmp === "-") {
          this.HandleMinus()}
         else if (($tmp >= "0") && ($tmp <= "9")) {
          this.HandleNumber()}
         else if (($tmp === "'") || ($tmp === "#")) {
          this.HandleString()}
         else if ($tmp === "[") {
          SetToken($mod.TParserToken.toSetStart)}
         else if ($tmp === "(") {
          SetToken($mod.TParserToken.toListStart)}
         else if ($tmp === "<") {
          SetToken($mod.TParserToken.toCollectionStart)}
         else if ($tmp === "{") {
          SetToken($mod.TParserToken.toBinaryStart)}
         else if ($tmp === "]") {
          SetToken($mod.TParserToken.toSetEnd)}
         else if ($tmp === ")") {
          SetToken($mod.TParserToken.toListEnd)}
         else if ($tmp === ">") {
          SetToken($mod.TParserToken.toCollectionEnd)}
         else if ($tmp === "}") {
          SetToken($mod.TParserToken.toBinaryEnd)}
         else if ($tmp === ",") {
          SetToken($mod.TParserToken.toComma)}
         else if ($tmp === ".") {
          SetToken($mod.TParserToken.toDot)}
         else if ($tmp === "=") {
          SetToken($mod.TParserToken.toEqual)}
         else if ($tmp === ":") {
          SetToken($mod.TParserToken.toColon)}
         else if ($tmp === "+") {
          SetToken($mod.TParserToken.toPlus)}
         else {
          this.HandleUnknown();
        };
      };
      Result = this.fToken;
      return Result;
    };
    this.SourcePos = function () {
      var Result = 0;
      Result = (this.fStream.GetPosition() - this.FBufLen) + this.fPos;
      return Result;
    };
    this.TokenComponentIdent = function () {
      var Result = "";
      if (this.fToken !== $mod.TParserToken.toSymbol) this.ErrorFmt(rtl.getResStr(pas.RTLConsts,"SParserExpected"),pas.System.VarRecs(18,this.GetTokenName($mod.TParserToken.toSymbol)));
      this.CheckLoadBuffer();
      while (this.fBuf[this.fPos] === ".") {
        this.ProcessChar();
        this.fLastTokenStr = this.fLastTokenStr + this.GetAlphaNum();
      };
      Result = this.fLastTokenStr;
      return Result;
    };
    this.TokenFloat = function () {
      var Result = 0.0;
      var errcode = 0;
      pas.System.val$8(this.fLastTokenStr,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }},{get: function () {
          return errcode;
        }, set: function (v) {
          errcode = v;
        }});
      if (errcode !== 0) this.ErrorFmt(rtl.getResStr(pas.RTLConsts,"SParserInvalidFloat"),pas.System.VarRecs(18,this.fLastTokenStr));
      return Result;
    };
    this.TokenInt = function () {
      var Result = 0;
      if (!pas.SysUtils.TryStrToInt64(this.fLastTokenStr,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }})) Result = pas.SysUtils.StrToQWord(this.fLastTokenStr);
      return Result;
    };
    this.TokenString = function () {
      var Result = "";
      var $tmp = this.fToken;
      if ($tmp === $mod.TParserToken.toFloat) {
        if (this.fFloatType !== "\x00") {
          Result = this.fLastTokenStr + this.fFloatType}
         else Result = this.fLastTokenStr}
       else {
        Result = this.fLastTokenStr;
      };
      return Result;
    };
    this.TokenSymbolIs = function (S) {
      var Result = false;
      Result = (this.fToken === $mod.TParserToken.toSymbol) && (pas.SysUtils.CompareText(this.fLastTokenStr,S) === 0);
      return Result;
    };
    var $r = this.$rtti;
    $mod.$rtti.$DynArray("TParser.fBuf$a",{eltype: rtl.char});
    $r.addMethod("Create$1",2,[["Stream",$mod.$rtti["TStream"]]]);
  });
  this.TObjectTextEncoding = {"0": "oteDFM", oteDFM: 0, "1": "oteLFM", oteLFM: 1};
  this.$rtti.$Enum("TObjectTextEncoding",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TObjectTextEncoding});
  rtl.createClass(this,"TObjectStreamConverter",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FIndent = "";
      this.FInput = null;
      this.FOutput = null;
      this.FEncoding = 0;
      this.FPlainStrings = false;
    };
    this.$final = function () {
      this.FInput = undefined;
      this.FOutput = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.Outchars = function (S) {
      var res = "";
      var NewStr = "";
      var i = 0;
      var len = 0;
      var w = 0;
      var InString = false;
      var NewInString = false;
      if (S === "") {
        res = "''"}
       else {
        res = "";
        InString = false;
        len = S.length;
        i = 0;
        while (i < len) {
          NewInString = InString;
          w = S.charCodeAt(i);
          if (w === 39) {
            if (!InString) NewInString = true;
            NewStr = "''";
          } else if ((w >= 32) && (w < 127)) {
            if (!InString) NewInString = true;
            NewStr = String.fromCharCode(w);
          } else {
            if (InString) NewInString = false;
            NewStr = "#" + pas.SysUtils.IntToStr(w);
          };
          if (NewInString !== InString) {
            NewStr = "'" + NewStr;
            InString = NewInString;
          };
          res = res + NewStr;
          i += 1;
        };
        if (InString) res = res + "'";
      };
      this.OutStr(res);
    };
    this.OutLn = function (s) {
      this.OutStr(s + pas.System.LineEnding);
    };
    this.OutStr = function (s) {
      var I = 0;
      for (var $l = 1, $end = s.length; $l <= $end; $l++) {
        I = $l;
        this.FOutput.WriteBufferData$4(s.charAt(I - 1));
      };
    };
    this.OutString = function (s) {
      this.Outchars(s);
    };
    this.ReadWord = function () {
      var Result = 0;
      this.FInput.ReadBufferData$10({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadDWord = function () {
      var Result = 0;
      this.FInput.ReadBufferData$14({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadDouble = function () {
      var Result = 0.0;
      this.FInput.ReadBufferData$20({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadInt = function (ValueType) {
      var Result = 0;
      var $tmp = ValueType;
      if ($tmp === $mod.TValueType.vaInt8) {
        Result = ((this.FInput.ReadByte() & 255) << 24) >> 24}
       else if ($tmp === $mod.TValueType.vaInt16) {
        Result = ((this.ReadWord() & 65535) << 16) >> 16}
       else if ($tmp === $mod.TValueType.vaInt32) {
        Result = this.ReadDWord() & 0xFFFFFFFF}
       else if ($tmp === $mod.TValueType.vaNativeInt) Result = this.ReadNativeInt();
      return Result;
    };
    this.ReadInt$1 = function () {
      var Result = 0;
      Result = this.ReadInt(this.FInput.ReadByte());
      return Result;
    };
    this.ReadNativeInt = function () {
      var Result = 0;
      this.FInput.ReadBufferData$16({get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }});
      return Result;
    };
    this.ReadStr = function () {
      var Result = "";
      var l = 0;
      var i = 0;
      var c = "\x00";
      this.FInput.ReadBufferData$6({get: function () {
          return l;
        }, set: function (v) {
          l = v;
        }});
      Result = rtl.strSetLength(Result,l);
      for (var $l = 1, $end = l; $l <= $end; $l++) {
        i = $l;
        this.FInput.ReadBufferData$2({get: function () {
            return c;
          }, set: function (v) {
            c = v;
          }});
        Result = rtl.setCharAt(Result,i - 1,c);
      };
      return Result;
    };
    this.ReadString = function (StringType) {
      var Result = "";
      var i = 0;
      var C = "\x00";
      Result = "";
      if (StringType !== $mod.TValueType.vaString) throw $mod.EFilerError.$create("Create$1",["Invalid string type passed to ReadString"]);
      i = this.ReadDWord();
      Result = rtl.strSetLength(Result,i);
      for (var $l = 1, $end = Result.length; $l <= $end; $l++) {
        i = $l;
        this.FInput.ReadBufferData$2({get: function () {
            return C;
          }, set: function (v) {
            C = v;
          }});
        Result = rtl.setCharAt(Result,i - 1,C);
      };
      return Result;
    };
    this.ProcessBinary = function () {
      var ToDo = 0;
      var DoNow = 0;
      var i = 0;
      var lbuf = [];
      var s = "";
      ToDo = this.ReadDWord();
      lbuf = rtl.arraySetLength(lbuf,0,32);
      this.OutLn("{");
      while (ToDo > 0) {
        DoNow = ToDo;
        if (DoNow > 32) DoNow = 32;
        ToDo -= DoNow;
        s = this.FIndent + "  ";
        this.FInput.ReadBuffer({get: function () {
            return lbuf;
          }, set: function (v) {
            lbuf = v;
          }},DoNow);
        for (var $l = 0, $end = DoNow - 1; $l <= $end; $l++) {
          i = $l;
          s = s + pas.SysUtils.IntToHex(lbuf[i],2);
        };
        this.OutLn(s);
      };
      this.OutLn(this.FIndent + "}");
    };
    this.ProcessValue = function (ValueType, Indent) {
      var s = "";
      var IsFirst = false;
      var ext = 0.0;
      var $tmp = ValueType;
      if ($tmp === $mod.TValueType.vaList) {
        this.OutStr("(");
        IsFirst = true;
        while (true) {
          ValueType = this.FInput.ReadByte();
          if (ValueType === $mod.TValueType.vaNull) break;
          if (IsFirst) {
            this.OutLn("");
            IsFirst = false;
          };
          this.OutStr(Indent + "  ");
          this.ProcessValue(ValueType,Indent + "  ");
        };
        this.OutLn(Indent + ")");
      } else if ($tmp === $mod.TValueType.vaInt8) {
        this.OutLn(pas.SysUtils.IntToStr(((this.FInput.ReadByte() & 255) << 24) >> 24))}
       else if ($tmp === $mod.TValueType.vaInt16) {
        this.OutLn(pas.SysUtils.IntToStr(((this.ReadWord() & 65535) << 16) >> 16))}
       else if ($tmp === $mod.TValueType.vaInt32) {
        this.OutLn(pas.SysUtils.IntToStr(this.ReadDWord() & 0xFFFFFFFF))}
       else if ($tmp === $mod.TValueType.vaNativeInt) {
        this.OutLn(pas.SysUtils.IntToStr(this.ReadNativeInt()))}
       else if ($tmp === $mod.TValueType.vaDouble) {
        ext = this.ReadDouble();
        s = rtl.floatToStr(ext);
        this.OutLn(s);
      } else if ($tmp === $mod.TValueType.vaString) {
        if (this.FPlainStrings) {
          this.OutStr("'" + pas.SysUtils.StringReplace(this.ReadString($mod.TValueType.vaString),"'","''",rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll)) + "'")}
         else this.OutString(this.ReadString($mod.TValueType.vaString));
        this.OutLn("");
      } else if ($tmp === $mod.TValueType.vaIdent) {
        this.OutLn(this.ReadStr())}
       else if ($tmp === $mod.TValueType.vaFalse) {
        this.OutLn("False")}
       else if ($tmp === $mod.TValueType.vaTrue) {
        this.OutLn("True")}
       else if ($tmp === $mod.TValueType.vaBinary) {
        this.ProcessBinary()}
       else if ($tmp === $mod.TValueType.vaSet) {
        this.OutStr("[");
        IsFirst = true;
        while (true) {
          s = this.ReadStr();
          if (s.length === 0) break;
          if (!IsFirst) this.OutStr(", ");
          IsFirst = false;
          this.OutStr(s);
        };
        this.OutLn("]");
      } else if ($tmp === $mod.TValueType.vaNil) {
        this.OutLn("nil")}
       else if ($tmp === $mod.TValueType.vaCollection) {
        this.OutStr("<");
        while (this.FInput.ReadByte() !== 0) {
          this.OutLn(Indent);
          this.FInput.Seek(-1,$mod.TSeekOrigin.soCurrent);
          this.OutStr(Indent + "  item");
          ValueType = this.FInput.ReadByte();
          if (ValueType !== $mod.TValueType.vaList) this.OutStr("[" + pas.SysUtils.IntToStr(this.ReadInt(ValueType)) + "]");
          this.OutLn("");
          this.ReadPropList(Indent + "    ");
          this.OutStr(Indent + "  end");
        };
        this.OutLn(">");
      } else {
        throw $mod.EReadError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrInvalidPropertyType"),pas.System.VarRecs(0,ValueType)]);
      };
    };
    this.ReadObject = function (indent) {
      var b = 0;
      var ObjClassName = "";
      var ObjName = "";
      var ChildPos = 0;
      b = this.FInput.ReadByte();
      if ((b & 0xf0) === 0xf0) {
        if ((b & 2) !== 0) ChildPos = this.ReadInt$1();
      } else {
        b = 0;
        this.FInput.Seek(-1,$mod.TSeekOrigin.soCurrent);
      };
      ObjClassName = this.ReadStr();
      ObjName = this.ReadStr();
      this.OutStr(indent);
      if ((b & 1) !== 0) {
        this.OutStr("inherited")}
       else if ((b & 4) !== 0) {
        this.OutStr("inline")}
       else this.OutStr("object");
      this.OutStr(" ");
      if (ObjName !== "") this.OutStr(ObjName + ": ");
      this.OutStr(ObjClassName);
      if ((b & 2) !== 0) this.OutStr("[" + pas.SysUtils.IntToStr(ChildPos) + "]");
      this.OutLn("");
      this.ReadPropList(indent + "  ");
      while (this.FInput.ReadByte() !== 0) {
        this.FInput.Seek(-1,$mod.TSeekOrigin.soCurrent);
        this.ReadObject(indent + "  ");
      };
      this.OutLn(indent + "end");
    };
    this.ReadPropList = function (indent) {
      while (this.FInput.ReadByte() !== 0) {
        this.FInput.Seek(-1,$mod.TSeekOrigin.soCurrent);
        this.OutStr(indent + this.ReadStr() + " = ");
        this.ProcessValue(this.FInput.ReadByte(),indent);
      };
    };
    this.ObjectBinaryToText = function (aInput, aOutput) {
      this.ObjectBinaryToText$1(aInput,aOutput,$mod.TObjectTextEncoding.oteDFM);
    };
    this.ObjectBinaryToText$1 = function (aInput, aOutput, aEncoding) {
      this.FInput = aInput;
      this.FOutput = aOutput;
      this.FEncoding = aEncoding;
      this.Execute();
    };
    this.Execute = function () {
      var Signature = 0;
      if (this.FIndent === "") this.FIndent = "  ";
      if (!(this.FInput != null)) throw $mod.EReadError.$create("Create$1",["Missing input stream"]);
      if (!(this.FOutput != null)) throw $mod.EReadError.$create("Create$1",["Missing output stream"]);
      this.FInput.ReadBufferData$12({get: function () {
          return Signature;
        }, set: function (v) {
          Signature = v;
        }});
      if (Signature !== 809914452) throw $mod.EReadError.$create("Create$1",[rtl.getResStr(pas.RTLConsts,"SInvalidImage")]);
      this.ReadObject("");
    };
  });
  rtl.createClass(this,"TObjectTextConverter",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FParser = null;
      this.FInput = null;
      this.Foutput = null;
    };
    this.$final = function () {
      this.FParser = undefined;
      this.FInput = undefined;
      this.Foutput = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.WriteDouble = function (e) {
      this.Foutput.WriteBufferData$20(e);
    };
    this.WriteDWord = function (lw) {
      this.Foutput.WriteBufferData$14(lw);
    };
    this.WriteInteger = function (value) {
      if ((value >= -128) && (value <= 127)) {
        this.Foutput.WriteByte($mod.TValueType.vaInt8);
        this.Foutput.WriteByte(value & 255);
      } else if ((value >= -32768) && (value <= 32767)) {
        this.Foutput.WriteByte($mod.TValueType.vaInt16);
        this.WriteWord(value & 65535);
      } else if ((value >= -2147483648) && (value <= 2147483647)) {
        this.Foutput.WriteByte($mod.TValueType.vaInt32);
        this.WriteDWord(value >>> 0);
      } else {
        this.Foutput.WriteByte($mod.TValueType.vaNativeInt);
        this.WriteQWord(value);
      };
    };
    this.WriteQWord = function (q) {
      this.Foutput.WriteBufferData$16(q);
    };
    this.WriteString = function (s) {
      var i = 0;
      var size = 0;
      if (s.length > 255) {
        size = 255}
       else size = s.length;
      this.Foutput.WriteByte(size);
      for (var $l = 1, $end = s.length; $l <= $end; $l++) {
        i = $l;
        this.Foutput.WriteBufferData$4(s.charAt(i - 1));
      };
    };
    this.WriteWord = function (w) {
      this.Foutput.WriteBufferData$12(w);
    };
    this.WriteWString = function (s) {
      var i = 0;
      this.WriteDWord(s.length);
      for (var $l = 1, $end = s.length; $l <= $end; $l++) {
        i = $l;
        this.Foutput.WriteBufferData$4(s.charAt(i - 1));
      };
    };
    this.ProcessObject = function () {
      var Flags = 0;
      var ObjectName = "";
      var ObjectType = "";
      var ChildPos = 0;
      if (this.FParser.TokenSymbolIs("OBJECT")) {
        Flags = 0}
       else {
        if (this.FParser.TokenSymbolIs("INHERITED")) {
          Flags = 1}
         else {
          this.FParser.CheckTokenSymbol("INLINE");
          Flags = 4;
        };
      };
      this.FParser.NextToken();
      this.FParser.CheckToken($mod.TParserToken.toSymbol);
      ObjectName = "";
      ObjectType = this.FParser.TokenString();
      this.FParser.NextToken();
      if (this.FParser.fToken === $mod.TParserToken.toColon) {
        this.FParser.NextToken();
        this.FParser.CheckToken($mod.TParserToken.toSymbol);
        ObjectName = ObjectType;
        ObjectType = this.FParser.TokenString();
        this.FParser.NextToken();
        if (this.FParser.fToken === $mod.TParserToken.toSetStart) {
          this.FParser.NextToken();
          ChildPos = this.FParser.TokenInt();
          this.FParser.NextToken();
          this.FParser.CheckToken($mod.TParserToken.toSetEnd);
          this.FParser.NextToken();
          Flags = Flags | 2;
        };
      };
      if (Flags !== 0) {
        this.Foutput.WriteByte(0xf0 | Flags);
        if ((Flags & 2) !== 0) this.WriteInteger(ChildPos);
      };
      this.WriteString(ObjectType);
      this.WriteString(ObjectName);
      while (!(this.FParser.TokenSymbolIs("END") || this.FParser.TokenSymbolIs("OBJECT") || this.FParser.TokenSymbolIs("INHERITED") || this.FParser.TokenSymbolIs("INLINE"))) this.ProcessProperty();
      this.Foutput.WriteByte(0);
      while (!this.FParser.TokenSymbolIs("END")) this.ProcessObject();
      this.FParser.NextToken();
      this.Foutput.WriteByte(0);
    };
    this.ProcessProperty = function () {
      var name = "";
      this.FParser.CheckToken($mod.TParserToken.toSymbol);
      name = this.FParser.TokenString();
      while (true) {
        this.FParser.NextToken();
        if (this.FParser.fToken !== $mod.TParserToken.toDot) break;
        this.FParser.NextToken();
        this.FParser.CheckToken($mod.TParserToken.toSymbol);
        name = name + "." + this.FParser.TokenString();
      };
      this.WriteString(name);
      this.FParser.CheckToken($mod.TParserToken.toEqual);
      this.FParser.NextToken();
      this.ProcessValue();
    };
    this.ProcessValue = function () {
      var flt = 0.0;
      var stream = null;
      var $tmp = this.FParser.fToken;
      if ($tmp === $mod.TParserToken.toInteger) {
        this.WriteInteger(this.FParser.TokenInt());
        this.FParser.NextToken();
      } else if ($tmp === $mod.TParserToken.toFloat) {
        this.Foutput.WriteByte($mod.TValueType.vaDouble);
        flt = this.FParser.TokenFloat();
        this.WriteDouble(flt);
        this.FParser.NextToken();
      } else if ($tmp === $mod.TParserToken.ToString) {
        this.ProcessWideString("")}
       else if ($tmp === $mod.TParserToken.toSymbol) {
        if (pas.SysUtils.CompareText(this.FParser.TokenString(),"True") === 0) {
          this.Foutput.WriteByte($mod.TValueType.vaTrue)}
         else if (pas.SysUtils.CompareText(this.FParser.TokenString(),"False") === 0) {
          this.Foutput.WriteByte($mod.TValueType.vaFalse)}
         else if (pas.SysUtils.CompareText(this.FParser.TokenString(),"nil") === 0) {
          this.Foutput.WriteByte($mod.TValueType.vaNil)}
         else {
          this.Foutput.WriteByte($mod.TValueType.vaIdent);
          this.WriteString(this.FParser.TokenComponentIdent());
        };
        this.FParser.NextToken();
      } else if ($tmp === $mod.TParserToken.toSetStart) {
        this.FParser.NextToken();
        this.Foutput.WriteByte($mod.TValueType.vaSet);
        if (this.FParser.fToken !== $mod.TParserToken.toSetEnd) while (true) {
          this.FParser.CheckToken($mod.TParserToken.toSymbol);
          this.WriteString(this.FParser.TokenString());
          this.FParser.NextToken();
          if (this.FParser.fToken === $mod.TParserToken.toSetEnd) break;
          this.FParser.CheckToken($mod.TParserToken.toComma);
          this.FParser.NextToken();
        };
        this.Foutput.WriteByte(0);
        this.FParser.NextToken();
      } else if ($tmp === $mod.TParserToken.toListStart) {
        this.FParser.NextToken();
        this.Foutput.WriteByte($mod.TValueType.vaList);
        while (this.FParser.fToken !== $mod.TParserToken.toListEnd) this.ProcessValue();
        this.Foutput.WriteByte(0);
        this.FParser.NextToken();
      } else if ($tmp === $mod.TParserToken.toCollectionStart) {
        this.FParser.NextToken();
        this.Foutput.WriteByte($mod.TValueType.vaCollection);
        while (this.FParser.fToken !== $mod.TParserToken.toCollectionEnd) {
          this.FParser.CheckTokenSymbol("item");
          this.FParser.NextToken();
          this.Foutput.WriteByte($mod.TValueType.vaList);
          while (!this.FParser.TokenSymbolIs("end")) this.ProcessProperty();
          this.FParser.NextToken();
          this.Foutput.WriteByte(0);
        };
        this.Foutput.WriteByte(0);
        this.FParser.NextToken();
      } else if ($tmp === $mod.TParserToken.toBinaryStart) {
        this.Foutput.WriteByte($mod.TValueType.vaBinary);
        stream = $mod.TBytesStream.$create("Create");
        try {
          this.FParser.HexToBinary(stream);
          this.WriteDWord(stream.GetSize());
          this.Foutput.WriteBuffer(stream.GetBytes(),stream.GetSize());
        } finally {
          stream = rtl.freeLoc(stream);
        };
        this.FParser.NextToken();
      } else {
        this.FParser.Error(rtl.getResStr(pas.RTLConsts,"SParserInvalidProperty"));
      };
    };
    this.ProcessWideString = function (left) {
      var ws = "";
      ws = left + this.FParser.TokenString();
      while (this.FParser.NextToken() === $mod.TParserToken.toPlus) {
        this.FParser.NextToken();
        if (!(this.FParser.fToken === $mod.TParserToken.ToString)) this.FParser.CheckToken($mod.TParserToken.ToString);
        ws = ws + this.FParser.TokenString();
      };
      this.Foutput.WriteByte($mod.TValueType.vaString);
      this.WriteWString(ws);
    };
    this.ObjectTextToBinary = function (aInput, aOutput) {
      this.FInput = aInput;
      this.Foutput = aOutput;
      this.Execute();
    };
    this.Execute = function () {
      if (!(this.FInput != null)) throw $mod.EReadError.$create("Create$1",["Missing input stream"]);
      if (!(this.Foutput != null)) throw $mod.EReadError.$create("Create$1",["Missing output stream"]);
      this.FParser = $mod.TParser.$create("Create$1",[this.FInput]);
      try {
        this.Foutput.WriteBufferData$14(809914452);
        this.ProcessObject();
      } finally {
        rtl.free(this,"FParser");
      };
    };
  });
  rtl.createClass(this,"TLoadHelper",pas.System.TObject,function () {
    $mod.$rtti.$RefToProcVar("TLoadHelper.TTextLoadedCallBack",{procsig: rtl.newTIProcSig([["aText",rtl.string,2]])});
    $mod.$rtti.$RefToProcVar("TLoadHelper.TBytesLoadedCallBack",{procsig: rtl.newTIProcSig([["aBuffer",pas.JS.$rtti["TJSArrayBuffer"],2]])});
    $mod.$rtti.$RefToProcVar("TLoadHelper.TErrorCallBack",{procsig: rtl.newTIProcSig([["aError",rtl.string,2]])});
  });
  this.$rtti.$ClassRef("TLoadHelperClass",{instancetype: this.$rtti["TLoadHelper"]});
  rtl.createClass(this,"TDataModule",this.TComponent,function () {
    this.$init = function () {
      $mod.TComponent.$init.call(this);
      this.FDPos = pas.Types.TPoint.$new();
      this.FDSize = pas.Types.TPoint.$new();
      this.FDPPI = 0;
      this.FOnCreate = null;
      this.FOnDestroy = null;
      this.FOldOrder = false;
    };
    this.$final = function () {
      this.FDPos = undefined;
      this.FDSize = undefined;
      this.FOnCreate = undefined;
      this.FOnDestroy = undefined;
      $mod.TComponent.$final.call(this);
    };
    this.ReadP = function (Reader) {
      this.FDPPI = Reader.ReadInteger();
    };
    this.WriteP = function (Writer) {
      Writer.WriteInteger(this.FDPPI);
    };
    this.ReadT = function (Reader) {
      this.FDPos.y = Reader.ReadInteger();
    };
    this.WriteT = function (Writer) {
      Writer.WriteInteger(this.FDPos.y);
    };
    this.ReadL = function (Reader) {
      this.FDPos.x = Reader.ReadInteger();
    };
    this.WriteL = function (Writer) {
      Writer.WriteInteger(this.FDPos.x);
    };
    this.ReadW = function (Reader) {
      this.FDSize.x = Reader.ReadInteger();
    };
    this.WriteW = function (Writer) {
      Writer.WriteInteger(this.FDSize.x);
    };
    this.ReadH = function (Reader) {
      this.FDSize.y = Reader.ReadInteger();
    };
    this.WriteH = function (Writer) {
      Writer.WriteInteger(this.FDSize.y);
    };
    this.DoCreate = function () {
      if (this.FOnCreate != null) try {
        this.FOnCreate(this);
      } catch ($e) {
        if (!this.HandleCreateException()) throw $e;
      };
    };
    this.DoDestroy = function () {
      if (this.FOnDestroy != null) try {
        this.FOnDestroy(this);
      } catch ($e) {
        if ($mod.ApplicationHandleException != null) $mod.ApplicationHandleException(this);
      };
    };
    this.DefineProperties = function (Filer) {
      var Ancestor = null;
      var HaveData = false;
      var HavePPIData = false;
      $mod.TComponent.DefineProperties.call(this,Filer);
      Ancestor = Filer.FAncestor;
      HaveData = (Ancestor === null) || (this.FDSize.x !== Ancestor.FDSize.x) || (this.FDSize.y !== Ancestor.FDSize.y) || (this.FDPos.y !== Ancestor.FDPos.y) || (this.FDPos.x !== Ancestor.FDPos.x);
      HavePPIData = ((Ancestor != null) && (this.FDPPI !== Ancestor.FDPPI)) || (!(Ancestor != null) && (this.FDPPI !== 96));
      Filer.DefineProperty("Height",rtl.createCallback(this,"ReadH"),rtl.createCallback(this,"WriteH"),HaveData);
      Filer.DefineProperty("HorizontalOffset",rtl.createCallback(this,"ReadL"),rtl.createCallback(this,"WriteL"),HaveData);
      Filer.DefineProperty("VerticalOffset",rtl.createCallback(this,"ReadT"),rtl.createCallback(this,"WriteT"),HaveData);
      Filer.DefineProperty("Width",rtl.createCallback(this,"ReadW"),rtl.createCallback(this,"WriteW"),HaveData);
      Filer.DefineProperty("PPI",rtl.createCallback(this,"ReadP"),rtl.createCallback(this,"WriteP"),HavePPIData);
    };
    this.GetChildren = function (Proc, Root) {
      var I = 0;
      $mod.TComponent.GetChildren.call(this,Proc,Root);
      if (Root === this) for (var $l = 0, $end = this.GetComponentCount() - 1; $l <= $end; $l++) {
        I = $l;
        if (!this.GetComponent(I).HasParent()) Proc(this.GetComponent(I));
      };
    };
    this.HandleCreateException = function () {
      var Result = false;
      Result = $mod.ApplicationHandleException != null;
      if (Result) $mod.ApplicationHandleException(this);
      return Result;
    };
    this.ReadState = function (Reader) {
      this.FOldOrder = false;
      $mod.TComponent.ReadState.call(this,Reader);
    };
    this.Create$1 = function (AOwner) {
      this.CreateNew(AOwner);
      if ((this.$class.ClassType() !== $mod.TDataModule) && !($mod.TComponentStateItem.csDesigning in this.FComponentState)) {
        if (!$mod.InitInheritedComponent(this,$mod.TDataModule)) throw $mod.EStreamError.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SErrNoStreaming"),pas.System.VarRecs(18,this.$classname)]);
        if (this.FOldOrder) this.DoCreate();
      };
      return this;
    };
    this.CreateNew = function (AOwner) {
      this.CreateNew$1(AOwner,0);
      return this;
    };
    this.CreateNew$1 = function (AOwner, CreateMode) {
      $mod.TComponent.Create$1.call(this,AOwner);
      this.FDPPI = 96;
      if (($mod.AddDataModule != null) && (CreateMode >= 0)) $mod.AddDataModule(this);
      return this;
    };
    this.Destroy = function () {
      if (this.FOldOrder) this.DoDestroy();
      if ($mod.RemoveDataModule != null) $mod.RemoveDataModule(this);
      $mod.TComponent.Destroy.call(this);
    };
    this.AfterConstruction = function () {
      if (!this.FOldOrder) this.DoCreate();
    };
    this.BeforeDestruction = function () {
      this.Destroying();
      $mod.RemoveFixupReferences(this,"");
      if (!this.FOldOrder) this.DoDestroy();
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",$mod.$rtti["TComponent"]]]);
    $r.addMethod("CreateNew",2,[["AOwner",$mod.$rtti["TComponent"]]]);
    $r.addMethod("CreateNew$1",2,[["AOwner",$mod.$rtti["TComponent"]],["CreateMode",rtl.longint]]);
    $r.addProperty("OnCreate",0,$mod.$rtti["TNotifyEvent"],"FOnCreate","FOnCreate");
    $r.addProperty("OnDestroy",0,$mod.$rtti["TNotifyEvent"],"FOnDestroy","FOnDestroy");
    $r.addProperty("OldCreateOrder",0,rtl.boolean,"FOldOrder","FOldOrder");
  });
  this.$rtti.$ClassRef("TDataModuleClass",{instancetype: this.$rtti["TDataModule"]});
  rtl.recNewT(this,"TIdentMapEntry",function () {
    this.Value = 0;
    this.Name = "";
    this.$eq = function (b) {
      return (this.Value === b.Value) && (this.Name === b.Name);
    };
    this.$assign = function (s) {
      this.Value = s.Value;
      this.Name = s.Name;
      return this;
    };
    var $r = $mod.$rtti.$Record("TIdentMapEntry",{});
    $r.addField("Value",rtl.longint);
    $r.addField("Name",rtl.string);
  });
  this.$rtti.$ProcVar("TIdentToInt",{procsig: rtl.newTIProcSig([["Ident",rtl.string,2],["Int",rtl.longint,1]],rtl.boolean)});
  this.$rtti.$ProcVar("TIntToIdent",{procsig: rtl.newTIProcSig([["Int",rtl.longint],["Ident",rtl.string,1]],rtl.boolean)});
  this.$rtti.$ProcVar("TFindGlobalComponent",{procsig: rtl.newTIProcSig([["Name",rtl.string,2]],this.$rtti["TComponent"])});
  this.$rtti.$ProcVar("TInitComponentHandler",{procsig: rtl.newTIProcSig([["Instance",this.$rtti["TComponent"]],["RootAncestor",pas.System.$rtti["TClass"]]],rtl.boolean)});
  this.RegisterInitComponentHandler = function (ComponentClass, Handler) {
    $impl.AddInitComponentHandler(ComponentClass,Handler,false);
  };
  this.RegisterClass = function (AClass) {
    $impl.ClassList[AClass.$classname] = AClass;
  };
  this.RegisterClasses = function (AClasses) {
    var AClass = null;
    for (var $in = AClasses, $l = 0, $end = rtl.length($in) - 1; $l <= $end; $l++) {
      AClass = $in[$l];
      $mod.RegisterClass(AClass);
    };
  };
  this.GetClass = function (AClassName) {
    var Result = null;
    Result = null;
    if (AClassName === "") return Result;
    if (!$impl.ClassList.hasOwnProperty(AClassName)) return Result;
    Result = rtl.getObject($impl.ClassList[AClassName]);
    return Result;
  };
  this.RegisterFindGlobalComponentProc = function (AFindGlobalComponent) {
    if (!($impl.FindGlobalComponentList != null)) $impl.FindGlobalComponentList = $mod.TFPList.$create("Create");
    if ($impl.FindGlobalComponentList.IndexOf(AFindGlobalComponent) < 0) $impl.FindGlobalComponentList.Add(AFindGlobalComponent);
  };
  this.UnregisterFindGlobalComponentProc = function (AFindGlobalComponent) {
    if ($impl.FindGlobalComponentList != null) $impl.FindGlobalComponentList.Remove(AFindGlobalComponent);
  };
  this.FindGlobalComponent = function (Name) {
    var Result = null;
    var i = 0;
    Result = null;
    if ($impl.FindGlobalComponentList != null) {
      for (var $l = $impl.FindGlobalComponentList.FCount - 1; $l >= 0; $l--) {
        i = $l;
        Result = $impl.FindGlobalComponentList.Get(i)(Name);
        if (Result != null) break;
      };
    };
    return Result;
  };
  this.FindNestedComponent = function (Root, APath, CStyle) {
    var Result = null;
    function GetNextName() {
      var Result = "";
      var P = 0;
      var CM = false;
      P = pas.System.Pos(".",APath);
      CM = false;
      if (P === 0) {
        if (CStyle) {
          P = pas.System.Pos("->",APath);
          CM = P !== 0;
        };
        if (P === 0) P = APath.length + 1;
      };
      Result = pas.System.Copy(APath,1,P - 1);
      pas.System.Delete({get: function () {
          return APath;
        }, set: function (v) {
          APath = v;
        }},1,P + (CM + 0));
      return Result;
    };
    var C = null;
    var S = "";
    if (APath === "") {
      Result = null}
     else {
      Result = Root;
      while ((APath !== "") && (Result !== null)) {
        C = Result;
        S = pas.SysUtils.UpperCase(GetNextName());
        Result = C.FindComponent(S);
        if ((Result === null) && (S === "OWNER")) Result = C;
      };
    };
    return Result;
  };
  this.InitInheritedComponent = function (Instance, RootAncestor) {
    var Result = false;
    var Handler = null;
    var ComponentClass = null;
    Handler = null;
    Result = !($impl.InitHandlerList != null);
    if (!Result) {
      ComponentClass = Instance.$class.ClassType();
      if (!$impl.FindInitComponentHandler(ComponentClass,{get: function () {
          return Handler;
        }, set: function (v) {
          Handler = v;
        }})) Handler = $impl.AddInitComponentHandler(ComponentClass,$impl.DefaultInitHandler,true);
      Result = Handler.AHandler(Instance,RootAncestor);
    };
    return Result;
  };
  this.RedirectFixupReferences = function (Root, OldRootName, NewRootName) {
    if ($impl.NeedResolving === null) return;
    $impl.VisitResolveList($impl.TRedirectReferenceVisitor.$create("Create$1",[Root,OldRootName,NewRootName]));
  };
  this.RemoveFixupReferences = function (Root, RootName) {
    if ($impl.NeedResolving === null) return;
    $impl.VisitResolveList($impl.TRemoveReferenceVisitor.$create("Create$1",[Root,RootName]));
  };
  this.RegisterIntegerConsts = function (IntegerType, IdentToIntFn, IntToIdentFn) {
    if (!($impl.IntConstList != null)) $impl.IntConstList = $mod.TFPList.$create("Create");
    $impl.IntConstList.Add($impl.TIntConst.$create("Create$1",[IntegerType,IdentToIntFn,IntToIdentFn]));
  };
  this.ExtractStrings = function (Separators, WhiteSpace, Content, Strings, AddEmptyStrings) {
    var Result = 0;
    var b = 0;
    var c = 0;
    function SkipWhitespace() {
      while (Content.charCodeAt(c - 1) in WhiteSpace) c += 1;
    };
    function AddString() {
      var l = 0;
      l = c - b;
      if ((l > 0) || AddEmptyStrings) {
        if (Strings != null) {
          if (l > 0) {
            Strings.Add(pas.System.Copy(Content,b,l))}
           else Strings.Add("");
        };
        Result += 1;
      };
    };
    var cc = "\x00";
    var quoted = "\x00";
    var aLen = 0;
    Result = 0;
    c = 1;
    quoted = "\x00";
    Separators = rtl.diffSet(rtl.unionSet(Separators,rtl.createSet(13,10)),rtl.createSet(39,34));
    SkipWhitespace();
    b = c;
    aLen = Content.length;
    while (c <= aLen) {
      cc = Content.charAt(c - 1);
      if (cc === quoted) {
        if ((c < aLen) && (Content.charAt((c + 1) - 1) === quoted)) {
          c += 1}
         else quoted = "\x00";
      } else if ((quoted === "\x00") && (cc.charCodeAt() in rtl.createSet(39,34))) quoted = cc;
      if ((quoted === "\x00") && (cc.charCodeAt() in Separators)) {
        AddString();
        c += 1;
        SkipWhitespace();
        b = c;
      } else c += 1;
    };
    if (c !== b) AddString();
    return Result;
  };
  this.IdentToInt = function (Ident, Int, map) {
    var Result = false;
    var i = 0;
    for (var $l = 0, $end = rtl.length(map) - 1; $l <= $end; $l++) {
      i = $l;
      if (pas.SysUtils.CompareText(map[i].Name,Ident) === 0) {
        Int.set(map[i].Value);
        return true;
      };
    };
    Result = false;
    return Result;
  };
  this.IntToIdent = function (Int, Ident, map) {
    var Result = false;
    var i = 0;
    for (var $l = 0, $end = rtl.length(map) - 1; $l <= $end; $l++) {
      i = $l;
      if (map[i].Value === Int) {
        Ident.set(map[i].Name);
        return true;
      };
    };
    Result = false;
    return Result;
  };
  this.FindIntToIdent = function (AIntegerType) {
    var Result = null;
    var i = 0;
    Result = null;
    if (!($impl.IntConstList != null)) return Result;
    var $with = $impl.IntConstList;
    for (var $l = 0, $end = $with.FCount - 1; $l <= $end; $l++) {
      i = $l;
      if (rtl.getObject($with.Get(i)).IntegerType === AIntegerType) return rtl.getObject($with.Get(i)).IntToIdentFn;
    };
    return Result;
  };
  this.FindIdentToInt = function (AIntegerType) {
    var Result = null;
    var i = 0;
    Result = null;
    if (!($impl.IntConstList != null)) return Result;
    var $with = $impl.IntConstList;
    for (var $l = 0, $end = $with.FCount - 1; $l <= $end; $l++) {
      i = $l;
      var $with1 = rtl.getObject($with.Get(i));
      if (rtl.getObject($with.Get(i)).IntegerType === AIntegerType) return $with1.IdentToIntFn;
    };
    return Result;
  };
  this.FindClass = function (AClassName) {
    var Result = null;
    Result = $mod.GetClass(AClassName);
    if (!(Result != null)) throw $mod.EClassNotFound.$create("CreateFmt",[rtl.getResStr(pas.RTLConsts,"SClassNotFound"),pas.System.VarRecs(18,AClassName)]);
    return Result;
  };
  this.CollectionsEqual = function (C1, C2) {
    var Result = false;
    var Comp1 = null;
    var Comp2 = null;
    Comp2 = null;
    Comp1 = $mod.TComponent.$create("Create");
    try {
      Result = $mod.CollectionsEqual$1(C1,C2,Comp1,Comp2);
    } finally {
      Comp1 = rtl.freeLoc(Comp1);
      Comp2 = rtl.freeLoc(Comp2);
    };
    return Result;
  };
  this.CollectionsEqual$1 = function (C1, C2, Owner1, Owner2) {
    var Result = false;
    function stream_collection(s, c, o) {
      var w = null;
      w = $mod.TWriter.$create("Create$2",[s]);
      try {
        w.SetRoot(o);
        w.FLookupRoot = o;
        w.WriteCollection(c);
      } finally {
        w = rtl.freeLoc(w);
      };
    };
    var s1 = null;
    var s2 = null;
    var b1 = [];
    var b2 = [];
    var I = 0;
    var Len = 0;
    Result = false;
    if ((C1.$class.ClassType() !== C2.$class.ClassType()) || (C1.GetCount() !== C2.GetCount())) return Result;
    if (C1.GetCount() === 0) {
      Result = true;
      return Result;
    };
    s2 = null;
    s1 = $mod.TBytesStream.$create("Create");
    try {
      s2 = $mod.TBytesStream.$create("Create");
      stream_collection(s1,C1,Owner1);
      stream_collection(s2,C2,Owner2);
      Result = s1.GetSize() === s2.GetSize();
      if (Result) {
        b1 = s1.GetBytes();
        b2 = s2.GetBytes();
        I = 0;
        Len = s1.GetSize();
        while (Result && (I < Len)) {
          Result = b1[I] === b2[I];
          I += 1;
        };
      };
    } finally {
      s2 = rtl.freeLoc(s2);
      s1 = rtl.freeLoc(s1);
    };
    return Result;
  };
  this.GetFixupReferenceNames = function (Root, Names) {
    if ($impl.NeedResolving === null) return;
    $impl.VisitResolveList($impl.TReferenceNamesVisitor.$create("Create$1",[Root,Names]));
  };
  this.GetFixupInstanceNames = function (Root, ReferenceRootName, Names) {
    if ($impl.NeedResolving === null) return;
    $impl.VisitResolveList($impl.TReferenceInstancesVisitor.$create("Create$1",[Root,ReferenceRootName,Names]));
  };
  this.ObjectBinaryToText = function (aInput, aOutput) {
    $mod.ObjectBinaryToText$1(aInput,aOutput,$mod.TObjectTextEncoding.oteLFM);
  };
  this.ObjectBinaryToText$1 = function (aInput, aOutput, aEncoding) {
    var Conv = null;
    Conv = $mod.TObjectStreamConverter.$create("Create");
    try {
      Conv.ObjectBinaryToText$1(aInput,aOutput,aEncoding);
    } finally {
      Conv = rtl.freeLoc(Conv);
    };
  };
  this.ObjectTextToBinary = function (aInput, aOutput) {
    var Conv = null;
    Conv = $mod.TObjectTextConverter.$create("Create");
    try {
      Conv.ObjectTextToBinary(aInput,aOutput);
    } finally {
      Conv = rtl.freeLoc(Conv);
    };
  };
  this.SetLoadHelperClass = function (aClass) {
    var Result = null;
    Result = $impl.GlobalLoadHelper;
    $impl.GlobalLoadHelper = aClass;
    return Result;
  };
  this.StringToBuffer = function (aString, aLen) {
    var Result = null;
    var I = 0;
    Result = new ArrayBuffer(aLen * 2);
    var $with = new Uint16Array(Result);
    for (var $l = 0, $end = aLen - 1; $l <= $end; $l++) {
      I = $l;
      $with[I] = aString.charCodeAt(I);
    };
    return Result;
  };
  this.BufferToString = function (aBuffer, aPos, aLen) {
    var Result = "";
    var a = null;
    Result = "";
    a = new Uint16Array(aBuffer.slice(aPos,aLen));
    if (a !== null) Result = "" + String.fromCharCode.apply(null,a);
    return Result;
  };
  this.BeginGlobalLoading = function () {
    $impl.GlobalLoaded = $mod.TFPList.$create("Create");
  };
  this.NotifyGlobalLoading = function () {
    var I = 0;
    var G = null;
    G = $impl.GlobalLoaded;
    for (var $l = 0, $end = G.FCount - 1; $l <= $end; $l++) {
      I = $l;
      rtl.getObject(G.Get(I)).Loaded();
    };
  };
  this.EndGlobalLoading = function () {
    rtl.free($impl,"GlobalLoaded");
  };
  this.$rtti.$MethodVar("TDataModuleNotifyEvent",{procsig: rtl.newTIProcSig([["DataModule",this.$rtti["TDataModule"]]]), methodkind: 0});
  this.$rtti.$MethodVar("TExceptionNotifyEvent",{procsig: rtl.newTIProcSig([["E",pas.SysUtils.$rtti["Exception"]]]), methodkind: 0});
  this.AddDataModule = null;
  this.RemoveDataModule = null;
  this.ApplicationHandleException = null;
  this.ApplicationShowException = null;
  this.FormResourceIsText = true;
  this.vaSingle = this.TValueType.vaDouble;
  this.vaExtended = this.TValueType.vaDouble;
  this.vaLString = this.TValueType.vaString;
  this.vaUTF8String = this.TValueType.vaString;
  this.vaUString = this.TValueType.vaString;
  this.vaWString = this.TValueType.vaString;
  this.vaQWord = this.TValueType.vaNativeInt;
  this.vaInt64 = this.TValueType.vaNativeInt;
  this.toWString = this.TParserToken.ToString;
  $mod.$implcode = function () {
    $impl.GlobalLoaded = null;
    $impl.IntConstList = null;
    $impl.GlobalLoadHelper = null;
    $impl.CheckLoadHelper = function () {
      if ($impl.GlobalLoadHelper === null) throw pas.SysUtils.EInOutError.$create("Create$1",["No support for loading URLS. Include Rtl.BrowserLoadHelper in your project uses clause"]);
    };
    $impl.CreateComponentfromRes = function (res, Inst, Component) {
      var Result = false;
      var ResStream = null;
      var Src = null;
      var aInfo = pas.p2jsres.TResourceInfo.$new();
      if (Inst === 0) ;
      Result = pas.p2jsres.GetResourceInfo(res,aInfo);
      if (Result) {
        ResStream = $mod.TResourceStream.$create("Create$1",[pas.p2jsres.TResourceInfo.$clone(aInfo)]);
        try {
          if (!$mod.FormResourceIsText) {
            Src = ResStream}
           else {
            Src = $mod.TMemoryStream.$create("Create");
            $mod.ObjectTextToBinary(ResStream,Src);
            Src.SetPosition(0);
          };
          Component.set(Src.ReadComponent(Component.get()));
        } finally {
          if (Src !== ResStream) Src = rtl.freeLoc(Src);
          ResStream = rtl.freeLoc(ResStream);
        };
      };
      return Result;
    };
    $impl.DefaultInitHandler = function (Instance, RootAncestor) {
      var Result = false;
      function doinit(_class) {
        var Result = false;
        Result = false;
        if ((_class.ClassType() === $mod.TComponent) || (_class.ClassType() === RootAncestor)) return Result;
        Result = doinit(_class.$ancestor);
        Result = $impl.CreateComponentfromRes(_class.$module.$name,0,{get: function () {
            return Instance;
          }, set: function (v) {
            Instance = v;
          }}) || Result;
        return Result;
      };
      Result = doinit(Instance.$class.ClassType());
      return Result;
    };
    rtl.createClass($impl,"TIntConst",pas.System.TObject,function () {
      this.$init = function () {
        pas.System.TObject.$init.call(this);
        this.IntegerType = null;
        this.IdentToIntFn = null;
        this.IntToIdentFn = null;
      };
      this.$final = function () {
        this.IdentToIntFn = undefined;
        this.IntToIdentFn = undefined;
        pas.System.TObject.$final.call(this);
      };
      this.Create$1 = function (AIntegerType, AIdentToInt, AIntToIdent) {
        this.IntegerType = AIntegerType;
        this.IdentToIntFn = AIdentToInt;
        this.IntToIdentFn = AIntToIdent;
        return this;
      };
      var $r = this.$rtti;
      $r.addMethod("Create$1",2,[["AIntegerType",rtl.pointer],["AIdentToInt",$mod.$rtti["TIdentToInt"]],["AIntToIdent",$mod.$rtti["TIntToIdent"]]]);
    });
    $impl.GlobalIdentToInt = function (Ident, Int) {
      var Result = false;
      var i = 0;
      Result = false;
      if (!($impl.IntConstList != null)) return Result;
      var $with = $impl.IntConstList;
      for (var $l = 0, $end = $with.FCount - 1; $l <= $end; $l++) {
        i = $l;
        if (rtl.getObject($with.Get(i)).IdentToIntFn(Ident,Int)) return true;
      };
      return Result;
    };
    $impl.QuickSort = function (aList, L, R, Compare) {
      var I = 0;
      var J = 0;
      var PivotIdx = 0;
      var P = undefined;
      var Q = undefined;
      do {
        I = L;
        J = R;
        PivotIdx = L + ((R - L) >>> 1);
        P = aList[PivotIdx];
        do {
          while ((I < PivotIdx) && (Compare(P,aList[I]) > 0)) I += 1;
          while ((J > PivotIdx) && (Compare(P,aList[J]) < 0)) J -= 1;
          if (I < J) {
            Q = aList[I];
            aList[I] = aList[J];
            aList[J] = Q;
            if (PivotIdx === I) {
              PivotIdx = J;
              I += 1;
            } else if (PivotIdx === J) {
              PivotIdx = I;
              J -= 1;
            } else {
              I += 1;
              J -= 1;
            };
          };
        } while (!(I >= J));
        if ((PivotIdx - L) < (R - PivotIdx)) {
          if ((L + 1) < PivotIdx) $impl.QuickSort(rtl.arrayRef(aList),L,PivotIdx - 1,Compare);
          L = PivotIdx + 1;
        } else {
          if ((PivotIdx + 1) < R) $impl.QuickSort(rtl.arrayRef(aList),PivotIdx + 1,R,Compare);
          if ((L + 1) < PivotIdx) {
            R = PivotIdx - 1}
           else return;
        };
      } while (!(L >= R));
    };
    $impl.StringListAnsiCompare = function (List, Index1, Index) {
      var Result = 0;
      Result = List.DoCompareText(List.FList[Index1].FString,List.FList[Index].FString);
      return Result;
    };
    $impl.TMSGrow = 4096;
    $impl.FilerSignatureInt = 809914452;
    rtl.createClass($impl,"TUnresolvedReference",pas.simplelinkedlist.TLinkedListItem,function () {
      this.$init = function () {
        pas.simplelinkedlist.TLinkedListItem.$init.call(this);
        this.FRoot = null;
        this.FPropInfo = null;
        this.FGlobal = "";
        this.FRelative = "";
      };
      this.$final = function () {
        this.FRoot = undefined;
        this.FPropInfo = undefined;
        pas.simplelinkedlist.TLinkedListItem.$final.call(this);
      };
      this.Resolve = function (Instance) {
        var Result = false;
        var C = null;
        C = $mod.FindGlobalComponent(this.FGlobal);
        Result = C !== null;
        if (Result) {
          C = $mod.FindNestedComponent(C,this.FRelative,true);
          Result = C !== null;
          if (Result) pas.TypInfo.SetObjectProp$1(Instance,this.FPropInfo,C);
        };
        return Result;
      };
      this.RootMatches = function (ARoot) {
        var Result = false;
        Result = (ARoot === null) || (ARoot === this.FRoot);
        return Result;
      };
      this.NextRef = function () {
        var Result = null;
        Result = this.Next;
        return Result;
      };
    });
    rtl.createClass($impl,"TLocalUnResolvedReference",$impl.TUnresolvedReference,function () {
      this.$init = function () {
        $impl.TUnresolvedReference.$init.call(this);
        this.Finstance = null;
      };
      this.$final = function () {
        this.Finstance = undefined;
        $impl.TUnresolvedReference.$final.call(this);
      };
      var $r = this.$rtti;
      $r.addField("Finstance",$mod.$rtti["TPersistent"]);
    });
    rtl.createClass($impl,"TUnResolvedInstance",pas.simplelinkedlist.TLinkedListItem,function () {
      this.$init = function () {
        pas.simplelinkedlist.TLinkedListItem.$init.call(this);
        this.Instance = null;
        this.FUnresolved = null;
      };
      this.$final = function () {
        this.Instance = undefined;
        this.FUnresolved = undefined;
        pas.simplelinkedlist.TLinkedListItem.$final.call(this);
      };
      this.Destroy = function () {
        rtl.free(this,"FUnresolved");
        pas.System.TObject.Destroy.call(this);
      };
      this.AddReference = function (ARoot, APropInfo, AGlobal, ARelative) {
        var Result = null;
        if (this.FUnresolved === null) this.FUnresolved = pas.simplelinkedlist.TLinkedList.$create("Create$1",[$impl.TUnresolvedReference]);
        Result = rtl.as(this.FUnresolved.Add(),$impl.TUnresolvedReference);
        Result.FGlobal = AGlobal;
        Result.FRelative = ARelative;
        Result.FPropInfo = APropInfo;
        Result.FRoot = ARoot;
        return Result;
      };
      this.RootUnresolved = function () {
        var Result = null;
        Result = null;
        if (this.FUnresolved != null) Result = this.FUnresolved.FRoot;
        return Result;
      };
      this.ResolveReferences = function () {
        var Result = false;
        var R = null;
        var RN = null;
        R = this.RootUnresolved();
        while (R !== null) {
          RN = R.NextRef();
          if (R.Resolve(this.Instance)) this.FUnresolved.RemoveItem(R,true);
          R = RN;
        };
        Result = this.RootUnresolved() === null;
        return Result;
      };
    });
    rtl.createClass($impl,"TBuildListVisitor",pas.simplelinkedlist.TLinkedListVisitor,function () {
      this.$init = function () {
        pas.simplelinkedlist.TLinkedListVisitor.$init.call(this);
        this.List = null;
      };
      this.$final = function () {
        this.List = undefined;
        pas.simplelinkedlist.TLinkedListVisitor.$final.call(this);
      };
      this.Add = function (Item) {
        if (this.List === null) this.List = $mod.TFPList.$create("Create");
        this.List.Add(Item);
      };
      this.Destroy = function () {
        var I = 0;
        if (this.List != null) for (var $l = 0, $end = this.List.FCount - 1; $l <= $end; $l++) {
          I = $l;
          $impl.NeedResolving.RemoveItem(rtl.getObject(this.List.Get(I)),true);
        };
        pas.SysUtils.FreeAndNil({p: this, get: function () {
            return this.p.List;
          }, set: function (v) {
            this.p.List = v;
          }});
        pas.System.TObject.Destroy.call(this);
      };
    });
    rtl.createClass($impl,"TResolveReferenceVisitor",$impl.TBuildListVisitor,function () {
      this.Visit = function (Item) {
        var Result = false;
        if (Item.ResolveReferences()) this.Add(Item);
        Result = true;
        return Result;
      };
      var $r = this.$rtti;
      $r.addMethod("Visit",1,[["Item",pas.simplelinkedlist.$rtti["TLinkedListItem"]]],rtl.boolean);
    });
    rtl.createClass($impl,"TRemoveReferenceVisitor",$impl.TBuildListVisitor,function () {
      this.$init = function () {
        $impl.TBuildListVisitor.$init.call(this);
        this.FRef = "";
        this.FRoot = null;
      };
      this.$final = function () {
        this.FRoot = undefined;
        $impl.TBuildListVisitor.$final.call(this);
      };
      this.Create$1 = function (ARoot, ARef) {
        this.FRoot = ARoot;
        this.FRef = pas.SysUtils.UpperCase(ARef);
        return this;
      };
      this.Visit = function (Item) {
        var Result = false;
        var I = 0;
        var UI = null;
        var R = null;
        var L = null;
        UI = Item;
        R = UI.RootUnresolved();
        L = null;
        try {
          while (R !== null) {
            if (R.RootMatches(this.FRoot) && ((this.FRef === "") || (this.FRef === pas.SysUtils.UpperCase(R.FGlobal)))) {
              if (!(L != null)) L = $mod.TFPList.$create("Create");
              L.Add(R);
            };
            R = R.NextRef();
          };
          if (L != null) {
            for (var $l = 0, $end = L.FCount - 1; $l <= $end; $l++) {
              I = $l;
              UI.FUnresolved.RemoveItem(rtl.getObject(L.Get(I)),true);
            };
          };
          if (UI.FUnresolved.FRoot === null) {
            if (this.List === null) this.List = $mod.TFPList.$create("Create");
            this.List.Add(UI);
          };
        } finally {
          L = rtl.freeLoc(L);
        };
        Result = true;
        return Result;
      };
      var $r = this.$rtti;
      $r.addMethod("Create$1",2,[["ARoot",$mod.$rtti["TComponent"]],["ARef",rtl.string,2]]);
    });
    rtl.createClass($impl,"TReferenceNamesVisitor",pas.simplelinkedlist.TLinkedListVisitor,function () {
      this.$init = function () {
        pas.simplelinkedlist.TLinkedListVisitor.$init.call(this);
        this.FList = null;
        this.FRoot = null;
      };
      this.$final = function () {
        this.FList = undefined;
        this.FRoot = undefined;
        pas.simplelinkedlist.TLinkedListVisitor.$final.call(this);
      };
      this.Visit = function (Item) {
        var Result = false;
        var R = null;
        R = Item.RootUnresolved();
        while (R !== null) {
          if (R.RootMatches(this.FRoot)) if (this.FList.IndexOf(R.FGlobal) === -1) this.FList.Add(R.FGlobal);
          R = R.NextRef();
        };
        Result = true;
        return Result;
      };
      this.Create$1 = function (ARoot, AList) {
        this.FRoot = ARoot;
        this.FList = AList;
        return this;
      };
      var $r = this.$rtti;
      $r.addMethod("Create$1",2,[["ARoot",$mod.$rtti["TComponent"]],["AList",$mod.$rtti["TStrings"]]]);
    });
    rtl.createClass($impl,"TReferenceInstancesVisitor",pas.simplelinkedlist.TLinkedListVisitor,function () {
      this.$init = function () {
        pas.simplelinkedlist.TLinkedListVisitor.$init.call(this);
        this.FList = null;
        this.FRef = "";
        this.FRoot = null;
      };
      this.$final = function () {
        this.FList = undefined;
        this.FRoot = undefined;
        pas.simplelinkedlist.TLinkedListVisitor.$final.call(this);
      };
      this.Visit = function (Item) {
        var Result = false;
        var R = null;
        R = Item.RootUnresolved();
        while (R !== null) {
          if ((this.FRoot === R.FRoot) && (this.FRef === pas.SysUtils.UpperCase(R.FGlobal))) if (this.FList.IndexOf(R.FRelative) === -1) this.FList.Add(R.FRelative);
          R = R.NextRef();
        };
        Result = true;
        return Result;
      };
      this.Create$1 = function (ARoot, ARef, AList) {
        this.FRoot = ARoot;
        this.FRef = pas.SysUtils.UpperCase(ARef);
        this.FList = AList;
        return this;
      };
      var $r = this.$rtti;
      $r.addMethod("Create$1",2,[["ARoot",$mod.$rtti["TComponent"]],["ARef",rtl.string,2],["AList",$mod.$rtti["TStrings"]]]);
    });
    rtl.createClass($impl,"TRedirectReferenceVisitor",pas.simplelinkedlist.TLinkedListVisitor,function () {
      this.$init = function () {
        pas.simplelinkedlist.TLinkedListVisitor.$init.call(this);
        this.FOld = "";
        this.FNew = "";
        this.FRoot = null;
      };
      this.$final = function () {
        this.FRoot = undefined;
        pas.simplelinkedlist.TLinkedListVisitor.$final.call(this);
      };
      this.Visit = function (Item) {
        var Result = false;
        var R = null;
        R = Item.RootUnresolved();
        while (R !== null) {
          if (R.RootMatches(this.FRoot) && (this.FOld === pas.SysUtils.UpperCase(R.FGlobal))) R.FGlobal = this.FNew;
          R = R.NextRef();
        };
        Result = true;
        return Result;
      };
      this.Create$1 = function (ARoot, AOld, ANew) {
        this.FRoot = ARoot;
        this.FOld = pas.SysUtils.UpperCase(AOld);
        this.FNew = ANew;
        return this;
      };
      var $r = this.$rtti;
      $r.addMethod("Create$1",2,[["ARoot",$mod.$rtti["TComponent"]],["AOld",rtl.string,2],["ANew",rtl.string,2]]);
    });
    $impl.NeedResolving = null;
    $impl.FindUnresolvedInstance = function (AInstance) {
      var Result = null;
      Result = null;
      if ($impl.NeedResolving != null) {
        Result = $impl.NeedResolving.FRoot;
        while ((Result !== null) && (Result.Instance !== AInstance)) Result = Result.Next;
      };
      return Result;
    };
    $impl.AddtoResolveList = function (AInstance) {
      var Result = null;
      Result = $impl.FindUnresolvedInstance(AInstance);
      if (Result === null) {
        if (!($impl.NeedResolving != null)) $impl.NeedResolving = pas.simplelinkedlist.TLinkedList.$create("Create$1",[$impl.TUnResolvedInstance]);
        Result = rtl.as($impl.NeedResolving.Add(),$impl.TUnResolvedInstance);
        Result.Instance = AInstance;
      };
      return Result;
    };
    $impl.VisitResolveList = function (V) {
      try {
        $impl.NeedResolving.ForEach(V);
      } finally {
        pas.SysUtils.FreeAndNil({get: function () {
            return V;
          }, set: function (v) {
            V = v;
          }});
      };
    };
    $impl.GlobalFixupReferences = function () {
      if ($impl.NeedResolving === null) return;
      $impl.VisitResolveList($impl.TResolveReferenceVisitor.$create("Create"));
    };
    rtl.createClass($impl,"TPosComponent",pas.System.TObject,function () {
      this.$init = function () {
        pas.System.TObject.$init.call(this);
        this.FPos = 0;
        this.FComponent = null;
      };
      this.$final = function () {
        this.FComponent = undefined;
        pas.System.TObject.$final.call(this);
      };
      this.Create$1 = function (APos, AComponent) {
        this.FPos = APos;
        this.FComponent = AComponent;
        return this;
      };
      var $r = this.$rtti;
      $r.addMethod("Create$1",2,[["APos",rtl.longint],["AComponent",$mod.$rtti["TComponent"]]]);
    });
    rtl.createClass($impl,"TInitHandler",pas.System.TObject,function () {
      this.$init = function () {
        pas.System.TObject.$init.call(this);
        this.AHandler = null;
        this.AClass = null;
      };
      this.$final = function () {
        this.AHandler = undefined;
        this.AClass = undefined;
        pas.System.TObject.$final.call(this);
      };
      var $r = this.$rtti;
      $r.addField("AHandler",$mod.$rtti["TInitComponentHandler"]);
      $r.addField("AClass",$mod.$rtti["TComponentClass"]);
    });
    $impl.ClassList = null;
    $impl.InitHandlerList = null;
    $impl.FindGlobalComponentList = null;
    $impl.FindInitComponentHandler = function (ComponentClass, Handler) {
      var Result = false;
      var A = 0;
      Result = false;
      if (!($impl.InitHandlerList != null)) $impl.InitHandlerList = $mod.TList.$create("Create$1");
      for (var $l = 0, $end = $impl.InitHandlerList.GetCount() - 1; $l <= $end; $l++) {
        A = $l;
        Handler.set(rtl.getObject($impl.InitHandlerList.Get(A)));
        if (Handler.get().AClass === ComponentClass) return true;
      };
      return Result;
    };
    $impl.AddInitComponentHandler = function (ComponentClass, Handler, ForceInsert) {
      var Result = null;
      if (ForceInsert || !$impl.FindInitComponentHandler(ComponentClass,{get: function () {
          return Result;
        }, set: function (v) {
          Result = v;
        }})) {
        Result = $impl.TInitHandler.$create("Create");
        Result.AClass = ComponentClass;
        $impl.InitHandlerList.Add(Result);
      };
      Result.AHandler = Handler;
      return Result;
    };
    $impl.ParseBufSize = 4096;
    $mod.$rtti.$StaticArray("TokNames$a",{dims: [20], eltype: rtl.string});
    $impl.TokNames = ["?","EOF","Symbol","String","Integer","Float","-","[","(","<","{","]",")",">","}",",",".","=",":","+"];
    $mod.$resourcestrings = {SStreamInvalidSeek: {org: "Seek is not implemented for class %s"}, SStreamNoReading: {org: "Stream reading is not implemented for class %s"}, SStreamNoWriting: {org: "Stream writing is not implemented for class %s"}, SReadError: {org: "Could not read data from stream"}, SWriteError: {org: "Could not write data to stream"}, SMemoryStreamError: {org: "Could not allocate memory"}, SerrInvalidStreamSize: {org: "Invalid Stream size"}};
  };
  $mod.$init = function () {
    (function () {
      $mod.RegisterInitComponentHandler($mod.TDataModule,$impl.DefaultInitHandler);
    })();
    $impl.ClassList = new Object();
  };
},["simplelinkedlist"]);
//# sourceMappingURL=classes.js.map
