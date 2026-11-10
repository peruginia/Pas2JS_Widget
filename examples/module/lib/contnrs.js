rtl.module("contnrs",["System","SysUtils","Classes"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.$rtti.$RefToProcVar("TObjectListCallback",{procsig: rtl.newTIProcSig([["data",pas.System.$rtti["TObject"]],["arg",rtl.jsvalue]])});
  rtl.createClass(this,"TFPObjectList",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FFreeObjects = false;
      this.FList = null;
    };
    this.$final = function () {
      this.FList = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.GetCount = function () {
      var Result = 0;
      Result = this.FList.FCount;
      return Result;
    };
    this.SetCount = function (AValue) {
      if (this.FList.FCount !== AValue) this.FList.SetCount(AValue);
    };
    this.GetItem = function (Index) {
      var Result = null;
      Result = rtl.getObject(this.FList.Get(Index));
      return Result;
    };
    this.SetItem = function (Index, AObject) {
      var O = null;
      if (this.FFreeObjects) {
        O = rtl.getObject(this.FList.Get(Index));
        this.FList.Put(Index,AObject);
        O = rtl.freeLoc(O);
      } else this.FList.Put(Index,AObject);
    };
    this.SetCapacity = function (NewCapacity) {
      this.FList.SetCapacity(NewCapacity);
    };
    this.GetCapacity = function () {
      var Result = 0;
      Result = this.FList.FCapacity;
      return Result;
    };
    this.Create$1 = function () {
      pas.System.TObject.Create.call(this);
      this.FList = pas.Classes.TFPList.$create("Create");
      this.FFreeObjects = true;
      return this;
    };
    this.Create$2 = function (FreeObjects) {
      this.Create$1();
      this.FFreeObjects = FreeObjects;
      return this;
    };
    this.Destroy = function () {
      if (this.FList !== null) {
        this.Clear();
        this.FList.$destroy("Destroy");
      };
      pas.System.TObject.Destroy.call(this);
    };
    this.Clear = function () {
      var i = 0;
      var O = null;
      if (this.FFreeObjects) for (var $l = this.FList.FCount - 1; $l >= 0; $l--) {
        i = $l;
        O = rtl.getObject(this.FList.Get(i));
        this.FList.Put(i,null);
        O = rtl.freeLoc(O);
      };
      this.FList.Clear();
    };
    this.Add = function (AObject) {
      var Result = 0;
      Result = this.FList.Add(AObject);
      return Result;
    };
    this.Delete = function (Index) {
      var O = null;
      if (this.FFreeObjects) {
        O = rtl.getObject(this.FList.Get(Index));
        this.FList.Put(Index,null);
        O = rtl.freeLoc(O);
      };
      this.FList.Delete(Index);
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
      var Result = null;
      Result = rtl.getObject(this.FList.Extract(Item));
      return Result;
    };
    this.Remove = function (AObject) {
      var Result = 0;
      var O = null;
      Result = this.IndexOf(AObject);
      if (Result !== -1) {
        if (this.FFreeObjects) {
          O = rtl.getObject(this.FList.Get(Result));
          this.FList.Put(Result,null);
          O = rtl.freeLoc(O);
        };
        this.FList.Delete(Result);
      };
      return Result;
    };
    this.IndexOf = function (AObject) {
      var Result = 0;
      Result = this.FList.IndexOf(AObject);
      return Result;
    };
    this.FindInstanceOf = function (AClass, AExact, AStartAt) {
      var Result = 0;
      var I = 0;
      I = AStartAt;
      Result = -1;
      if (AExact) {
        while ((I < this.GetCount()) && (Result === -1)) if (this.GetItem(I).$class.ClassType() === AClass) {
          Result = I}
         else I += 1}
       else while ((I < this.GetCount()) && (Result === -1)) if (this.GetItem(I).$class.InheritsFrom(AClass)) {
        Result = I}
       else I += 1;
      return Result;
    };
    this.Insert = function (Index, AObject) {
      this.FList.Insert(Index,AObject);
    };
    this.First = function () {
      var Result = null;
      Result = rtl.getObject(this.FList.First());
      return Result;
    };
    this.Last = function () {
      var Result = null;
      Result = rtl.getObject(this.FList.Last());
      return Result;
    };
    this.Move = function (CurIndex, NewIndex) {
      this.FList.Move(CurIndex,NewIndex);
    };
    this.Assign = function (Obj) {
      var i = 0;
      this.Clear();
      for (var $l = 0, $end = Obj.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        this.Add(Obj.GetItem(i));
      };
    };
    this.Pack = function () {
      this.FList.Pack();
    };
    this.Sort = function (Compare) {
      this.FList.Sort(Compare);
    };
    this.ForEachCall = function (proc2call, arg) {
      this.FList.ForEachCall(proc2call,arg);
    };
  });
  rtl.createClass(this,"TObjectList",pas.Classes.TList,function () {
    this.$init = function () {
      pas.Classes.TList.$init.call(this);
      this.FFreeObjects = false;
    };
    this.Notify = function (Ptr, Action) {
      var O = null;
      if (this.FFreeObjects) if (Action === pas.Classes.TListNotification.lnDeleted) {
        O = rtl.getObject(Ptr);
        O = rtl.freeLoc(O);
      };
      pas.Classes.TList.Notify.call(this,Ptr,Action);
    };
    this.GetItem = function (Index) {
      var Result = null;
      Result = rtl.getObject(pas.Classes.TList.Get.call(this,Index));
      return Result;
    };
    this.SetItem = function (Index, AObject) {
      this.Put(Index,AObject);
    };
    this.Create$2 = function () {
      pas.Classes.TList.Create$1.call(this);
      this.FFreeObjects = true;
      return this;
    };
    this.Create$3 = function (FreeObjects) {
      pas.Classes.TList.Create$1.call(this);
      this.FFreeObjects = FreeObjects;
      return this;
    };
    this.Add$1 = function (AObject) {
      var Result = 0;
      Result = pas.Classes.TList.Add.call(this,AObject);
      return Result;
    };
    this.Extract$1 = function (Item) {
      var Result = null;
      Result = rtl.getObject(pas.Classes.TList.Extract.call(this,Item));
      return Result;
    };
    this.Remove$1 = function (AObject) {
      var Result = 0;
      Result = pas.Classes.TList.Remove.call(this,AObject);
      return Result;
    };
    this.IndexOf$1 = function (AObject) {
      var Result = 0;
      Result = pas.Classes.TList.IndexOf.call(this,AObject);
      return Result;
    };
    this.FindInstanceOf = function (AClass, AExact, AStartAt) {
      var Result = 0;
      var I = 0;
      I = AStartAt;
      Result = -1;
      if (AExact) {
        while ((I < this.GetCount()) && (Result === -1)) if (this.GetItem(I).$class.ClassType() === AClass) {
          Result = I}
         else I += 1}
       else while ((I < this.GetCount()) && (Result === -1)) if (this.GetItem(I).$class.InheritsFrom(AClass)) {
        Result = I}
       else I += 1;
      return Result;
    };
    this.Insert$1 = function (Index, AObject) {
      pas.Classes.TList.Insert.call(this,Index,AObject);
    };
    this.First$1 = function () {
      var Result = null;
      Result = rtl.getObject(pas.Classes.TList.First.call(this));
      return Result;
    };
    this.Last$1 = function () {
      var Result = null;
      Result = rtl.getObject(pas.Classes.TList.Last.call(this));
      return Result;
    };
  });
  rtl.createClass(this,"TComponentList",this.TObjectList,function () {
    this.$init = function () {
      $mod.TObjectList.$init.call(this);
      this.FNotifier = null;
    };
    this.$final = function () {
      this.FNotifier = undefined;
      $mod.TObjectList.$final.call(this);
    };
    this.Notify = function (Ptr, Action) {
      if (this.FNotifier === null) {
        this.FNotifier = $impl.TlistComponent.$create("Create$1",[null]);
        this.FNotifier.Flist = this;
      };
      if (pas.System.Assigned(Ptr)) {
        var $with = rtl.getObject(Ptr);
        var $tmp = Action;
        if ($tmp === pas.Classes.TListNotification.lnAdded) {
          $with.FreeNotification(this.FNotifier)}
         else if (($tmp === pas.Classes.TListNotification.lnExtracted) || ($tmp === pas.Classes.TListNotification.lnDeleted)) $with.RemoveFreeNotification(this.FNotifier);
      };
      $mod.TObjectList.Notify.call(this,Ptr,Action);
    };
    this.GetItems = function (Index) {
      var Result = null;
      Result = this.GetItem(Index);
      return Result;
    };
    this.SetItems = function (Index, AComponent) {
      this.Put(Index,AComponent);
    };
    this.HandleFreeNotify = function (Sender, AComponent) {
      this.Extract$2(AComponent);
      if (Sender === null) ;
    };
    this.Destroy = function () {
      pas.Classes.TList.Destroy.call(this);
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FNotifier;
        }, set: function (v) {
          this.p.FNotifier = v;
        }});
    };
    this.Add$2 = function (AComponent) {
      var Result = 0;
      Result = $mod.TObjectList.Add$1.call(this,AComponent);
      return Result;
    };
    this.Extract$2 = function (Item) {
      var Result = null;
      Result = $mod.TObjectList.Extract$1.call(this,Item);
      return Result;
    };
    this.Remove$2 = function (AComponent) {
      var Result = 0;
      Result = $mod.TObjectList.Remove$1.call(this,AComponent);
      return Result;
    };
    this.IndexOf$2 = function (AComponent) {
      var Result = 0;
      Result = $mod.TObjectList.IndexOf$1.call(this,AComponent);
      return Result;
    };
    this.First$2 = function () {
      var Result = null;
      Result = $mod.TObjectList.First$1.call(this);
      return Result;
    };
    this.Last$2 = function () {
      var Result = null;
      Result = $mod.TObjectList.Last$1.call(this);
      return Result;
    };
    this.Insert$2 = function (Index, AComponent) {
      $mod.TObjectList.Insert$1.call(this,Index,AComponent);
    };
  });
  rtl.createClass(this,"TClassList",pas.Classes.TList,function () {
    this.GetItems = function (Index) {
      var Result = null;
      Result = rtl.getObject(this.Get(Index));
      return Result;
    };
    this.SetItems = function (Index, AClass) {
      this.Put(Index,AClass);
    };
    this.Add$1 = function (AClass) {
      var Result = 0;
      Result = pas.Classes.TList.Add.call(this,AClass);
      return Result;
    };
    this.Extract$1 = function (Item) {
      var Result = null;
      Result = rtl.getObject(pas.Classes.TList.Extract.call(this,Item));
      return Result;
    };
    this.Remove$1 = function (AClass) {
      var Result = 0;
      Result = pas.Classes.TList.Remove.call(this,AClass);
      return Result;
    };
    this.IndexOf$1 = function (AClass) {
      var Result = 0;
      Result = pas.Classes.TList.IndexOf.call(this,AClass);
      return Result;
    };
    this.First$1 = function () {
      var Result = null;
      Result = rtl.getObject(pas.Classes.TList.First.call(this));
      return Result;
    };
    this.Last$1 = function () {
      var Result = null;
      Result = rtl.getObject(pas.Classes.TList.Last.call(this));
      return Result;
    };
    this.Insert$1 = function (Index, AClass) {
      pas.Classes.TList.Insert.call(this,Index,AClass);
    };
  });
  rtl.createClass(this,"TOrderedList",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FList = null;
    };
    this.$final = function () {
      this.FList = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.PopItem = function () {
      var Result = undefined;
      var $with = this.FList;
      if ($with.GetCount() > 0) {
        Result = $with.Get($with.GetCount() - 1);
        $with.Delete($with.GetCount() - 1);
      } else Result = null;
      return Result;
    };
    this.PeekItem = function () {
      var Result = undefined;
      var $with = this.FList;
      Result = $with.Get($with.GetCount() - 1);
      return Result;
    };
    this.Create$1 = function () {
      this.FList = pas.Classes.TList.$create("Create$1");
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FList");
    };
    this.Count = function () {
      var Result = 0;
      Result = this.FList.GetCount();
      return Result;
    };
    this.AtLeast = function (ACount) {
      var Result = false;
      Result = this.FList.GetCount() >= ACount;
      return Result;
    };
    this.Push = function (AItem) {
      var Result = undefined;
      this.PushItem(AItem);
      Result = AItem;
      return Result;
    };
    this.Pop = function () {
      var Result = undefined;
      if (this.AtLeast(1)) {
        Result = this.PopItem()}
       else Result = null;
      return Result;
    };
    this.Peek = function () {
      var Result = undefined;
      if (this.AtLeast(1)) {
        Result = this.PeekItem()}
       else Result = null;
      return Result;
    };
  });
  rtl.createClass(this,"TStack",this.TOrderedList,function () {
    this.PushItem = function (AItem) {
      this.FList.Add(AItem);
    };
  });
  rtl.createClass(this,"TObjectStack",this.TStack,function () {
    this.Push$1 = function (AObject) {
      var Result = null;
      Result = rtl.getObject($mod.TOrderedList.Push.call(this,AObject));
      return Result;
    };
    this.Pop$1 = function () {
      var Result = null;
      Result = rtl.getObject($mod.TOrderedList.Pop.call(this));
      return Result;
    };
    this.Peek$1 = function () {
      var Result = null;
      Result = rtl.getObject($mod.TOrderedList.Peek.call(this));
      return Result;
    };
  });
  rtl.createClass(this,"TQueue",this.TOrderedList,function () {
    this.PushItem = function (AItem) {
      var $with = this.FList;
      $with.Insert(0,AItem);
    };
  });
  rtl.createClass(this,"TObjectQueue",this.TQueue,function () {
    this.Push$1 = function (AObject) {
      var Result = null;
      Result = rtl.getObject($mod.TOrderedList.Push.call(this,AObject));
      return Result;
    };
    this.Pop$1 = function () {
      var Result = null;
      Result = rtl.getObject($mod.TOrderedList.Pop.call(this));
      return Result;
    };
    this.Peek$1 = function () {
      var Result = null;
      Result = rtl.getObject($mod.TOrderedList.Peek.call(this));
      return Result;
    };
  });
  this.$rtti.$ProcVar("THashFunction",{procsig: rtl.newTIProcSig([["S",rtl.string,2],["TableSize",rtl.longword,2]],rtl.longword)});
  rtl.createClass(this,"THTCustomNode",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FKey = "";
    };
    this.CreateWith = function (AString) {
      pas.System.TObject.Create.call(this);
      this.FKey = AString;
      return this;
    };
    this.HasKey = function (AKey) {
      var Result = false;
      Result = AKey === this.FKey;
      return Result;
    };
  });
  this.$rtti.$ClassRef("THTCustomNodeClass",{instancetype: this.$rtti["THTCustomNode"]});
  rtl.createClass(this,"TFPCustomHashTable",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FHashTable = null;
      this.FHashFunction = null;
      this.FCount = 0;
      this.FHashTableSize = 0;
    };
    this.$final = function () {
      this.FHashTable = undefined;
      this.FHashFunction = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.GetDensity = function () {
      var Result = 0;
      Result = this.FHashTableSize - this.GetVoidSlots();
      return Result;
    };
    this.GetNumberOfCollisions = function () {
      var Result = 0;
      Result = this.FCount - (this.FHashTableSize - this.GetVoidSlots());
      return Result;
    };
    this.SetHashTableSize = function (Value) {
      var i = 0;
      var newSize = 0;
      if (Value !== this.FHashTableSize) {
        i = 0;
        while (($impl.PRIMELIST[i] < Value) && (i < 27)) i += 1;
        newSize = $impl.PRIMELIST[i];
        if (this.FCount === 0) {
          this.FHashTableSize = newSize;
          this.InitializeHashTable();
        } else this.ChangeTableSize(newSize);
      };
    };
    this.InitializeHashTable = function () {
      var i = 0;
      if (this.FHashTableSize > 0) for (var $l = 0, $end = this.FHashTableSize - 1; $l <= $end; $l++) {
        i = $l;
        this.FHashTable.Add(null);
      };
      this.FCount = 0;
    };
    this.GetVoidSlots = function () {
      var Result = 0;
      var i = 0;
      var num = 0;
      num = 0;
      if (this.FHashTableSize > 0) for (var $l = 0, $end = this.FHashTableSize - 1; $l <= $end; $l++) {
        i = $l;
        if (!(this.Chain(i) != null)) num += 1;
      };
      Result = num;
      return Result;
    };
    this.GetLoadFactor = function () {
      var Result = 0.0;
      Result = this.FCount / this.FHashTableSize;
      return Result;
    };
    this.GetAVGChainLen = function () {
      var Result = 0.0;
      Result = this.FCount / (this.FHashTableSize - this.GetVoidSlots());
      return Result;
    };
    this.GetMaxChainLength = function () {
      var Result = 0;
      var i = 0;
      Result = 0;
      if (this.FHashTableSize > 0) for (var $l = 0, $end = this.FHashTableSize - 1; $l <= $end; $l++) {
        i = $l;
        if (this.ChainLength(i) > Result) Result = this.ChainLength(i);
      };
      return Result;
    };
    this.Chain = function (index) {
      var Result = null;
      Result = this.FHashTable.GetItem(index);
      return Result;
    };
    this.ChainLength = function (ChainIndex) {
      var Result = 0;
      if (this.Chain(ChainIndex) != null) {
        Result = this.Chain(ChainIndex).GetCount()}
       else Result = 0;
      return Result;
    };
    this.FindOrCreateNew = function (aKey) {
      var Result = null;
      var hashCode = 0;
      var chn = null;
      var i = 0;
      hashCode = this.FHashFunction(aKey,this.FHashTableSize);
      chn = this.Chain(hashCode);
      if (chn != null) {
        if (chn.GetCount() > 0) for (var $l = 0, $end = chn.GetCount() - 1; $l <= $end; $l++) {
          i = $l;
          if (chn.GetItem(i).FKey === aKey) return chn.GetItem(i);
        };
      } else {
        this.FHashTable.SetItem(hashCode,$mod.TFPObjectList.$create("Create$2",[true]));
        chn = this.Chain(hashCode);
      };
      this.FCount += 1;
      Result = this.CreateNewNode(aKey);
      chn.Add(Result);
      return Result;
    };
    this.SetHashFunction = function (AHashFunction) {
      if (this.IsEmpty()) {
        this.FHashFunction = AHashFunction}
       else throw pas.SysUtils.Exception.$create("Create$1",[rtl.getResStr($mod,"NotEmptyMsg")]);
    };
    this.FindChainForAdd = function (aKey) {
      var Result = null;
      var hashCode = 0;
      var i = 0;
      hashCode = this.FHashFunction(aKey,this.FHashTableSize);
      Result = this.Chain(hashCode);
      if (Result != null) {
        if (Result.GetCount() > 0) for (var $l = 0, $end = Result.GetCount() - 1; $l <= $end; $l++) {
          i = $l;
          if (Result.GetItem(i).FKey === aKey) throw $mod.EDuplicate.$create("CreateFmt",[rtl.getResStr($mod,"DuplicateMsg"),pas.System.VarRecs(18,aKey)]);
        };
      } else {
        this.FHashTable.SetItem(hashCode,$mod.TFPObjectList.$create("Create$2",[true]));
        Result = this.Chain(hashCode);
      };
      this.FCount += 1;
      return Result;
    };
    this.Create$1 = function () {
      this.CreateWith(196613,$mod.RSHash);
      return this;
    };
    this.CreateWith = function (AHashTableSize, aHashFunc) {
      pas.System.TObject.Create.call(this);
      this.FHashTable = $mod.TFPObjectList.$create("Create$2",[true]);
      this.SetHashTableSize(AHashTableSize);
      this.FHashFunction = aHashFunc;
      return this;
    };
    this.Destroy = function () {
      rtl.free(this,"FHashTable");
      pas.System.TObject.Destroy.call(this);
    };
    this.ChangeTableSize = function (ANewSize) {
      var SavedTable = null;
      var List = null;
      var SavedTableSize = 0;
      var i = 0;
      var j = 0;
      var temp = null;
      SavedTable = this.FHashTable;
      SavedTableSize = this.FHashTableSize;
      this.FHashTableSize = ANewSize;
      this.FHashTable = $mod.TFPObjectList.$create("Create$2",[true]);
      this.InitializeHashTable();
      if (SavedTableSize > 0) for (var $l = 0, $end = SavedTableSize - 1; $l <= $end; $l++) {
        i = $l;
        List = SavedTable.GetItem(i);
        if (List != null) for (var $l1 = 0, $end1 = List.GetCount() - 1; $l1 <= $end1; $l1++) {
          j = $l1;
          temp = List.GetItem(j);
          this.AddNode(temp);
        };
      };
      SavedTable = rtl.freeLoc(SavedTable);
    };
    this.Clear = function () {
      var i = 0;
      if (this.FHashTableSize > 0) for (var $l = 0, $end = this.FHashTableSize - 1; $l <= $end; $l++) {
        i = $l;
        if (this.Chain(i) != null) this.Chain(i).Clear();
      };
      this.FCount = 0;
    };
    this.Delete = function (aKey) {
      var hashCode = 0;
      var chn = null;
      var i = 0;
      hashCode = this.FHashFunction(aKey,this.FHashTableSize);
      chn = this.Chain(hashCode);
      if (chn != null) if (chn.GetCount() > 0) for (var $l = 0, $end = chn.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        if (chn.GetItem(i).FKey === aKey) {
          chn.Delete(i);
          this.FCount -= 1;
          return;
        };
      };
    };
    this.Find = function (aKey) {
      var Result = null;
      var hashCode = 0;
      var chn = null;
      var i = 0;
      hashCode = this.FHashFunction(aKey,this.FHashTableSize);
      chn = this.Chain(hashCode);
      if (chn != null) if (chn.GetCount() > 0) for (var $l = 0, $end = chn.GetCount() - 1; $l <= $end; $l++) {
        i = $l;
        if (chn.GetItem(i).FKey === aKey) return chn.GetItem(i);
      };
      Result = null;
      return Result;
    };
    this.IsEmpty = function () {
      var Result = false;
      Result = this.FCount === 0;
      return Result;
    };
  });
  rtl.createClass(this,"THTDataNode",this.THTCustomNode,function () {
    this.$init = function () {
      $mod.THTCustomNode.$init.call(this);
      this.FData = undefined;
    };
  });
  this.$rtti.$MethodVar("TDataIteratorMethod",{procsig: rtl.newTIProcSig([["Item",rtl.jsvalue],["Key",rtl.string,2],["Continue",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$ProcVar("TDataIteratorCallBack",{procsig: rtl.newTIProcSig([["Item",rtl.jsvalue],["Key",rtl.string,2],["Continue",rtl.boolean,1]])});
  rtl.createClass(this,"TFPDataHashTable",this.TFPCustomHashTable,function () {
    this.$init = function () {
      $mod.TFPCustomHashTable.$init.call(this);
      this.FIteratorCallBack = null;
    };
    this.$final = function () {
      this.FIteratorCallBack = undefined;
      $mod.TFPCustomHashTable.$final.call(this);
    };
    this.CallbackIterator = function (Item, Key, Continue) {
      this.FIteratorCallBack(Item,Key,Continue);
    };
    this.CreateNewNode = function (aKey) {
      var Result = null;
      Result = $mod.THTDataNode.$create("CreateWith",[aKey]);
      return Result;
    };
    this.AddNode = function (ANode) {
      this.Add(ANode.FKey,ANode.FData);
    };
    this.SetData = function (index, AValue) {
      this.FindOrCreateNew(index).FData = AValue;
    };
    this.GetData = function (index) {
      var Result = undefined;
      var node = null;
      node = this.Find(index);
      if (node != null) {
        Result = node.FData}
       else Result = null;
      return Result;
    };
    this.ForEachCall = function (aMethod) {
      var Result = null;
      var i = 0;
      var j = 0;
      var Continue = false;
      Result = null;
      Continue = true;
      if (this.FHashTableSize > 0) for (var $l = 0, $end = this.FHashTableSize - 1; $l <= $end; $l++) {
        i = $l;
        if (this.Chain(i) != null) if (this.Chain(i).GetCount() > 0) for (var $l1 = 0, $end1 = this.Chain(i).GetCount() - 1; $l1 <= $end1; $l1++) {
          j = $l1;
          aMethod(this.Chain(i).GetItem(j).FData,this.Chain(i).GetItem(j).FKey,{get: function () {
              return Continue;
            }, set: function (v) {
              Continue = v;
            }});
          if (!Continue) {
            Result = this.Chain(i).GetItem(j);
            return Result;
          };
        };
      };
      return Result;
    };
    this.Iterate = function (aMethod) {
      var Result = undefined;
      var N = null;
      N = this.ForEachCall(aMethod);
      if (N != null) {
        Result = N.FData}
       else Result = null;
      return Result;
    };
    this.Iterate$1 = function (aMethod) {
      var Result = undefined;
      this.FIteratorCallBack = aMethod;
      Result = this.Iterate(rtl.createCallback(this,"CallbackIterator"));
      return Result;
    };
    this.Add = function (aKey, AItem) {
      var chn = null;
      var NewNode = null;
      chn = this.FindChainForAdd(aKey);
      NewNode = this.CreateNewNode(aKey);
      NewNode.FData = AItem;
      chn.Add(NewNode);
    };
  });
  rtl.createClass(this,"THTStringNode",this.THTCustomNode,function () {
    this.$init = function () {
      $mod.THTCustomNode.$init.call(this);
      this.FData = "";
    };
  });
  this.$rtti.$MethodVar("TStringIteratorMethod",{procsig: rtl.newTIProcSig([["Item",rtl.string],["Key",rtl.string,2],["Continue",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$ProcVar("TStringIteratorCallback",{procsig: rtl.newTIProcSig([["Item",rtl.string],["Key",rtl.string,2],["Continue",rtl.boolean,1]])});
  rtl.createClass(this,"TFPStringHashTable",this.TFPCustomHashTable,function () {
    this.$init = function () {
      $mod.TFPCustomHashTable.$init.call(this);
      this.FIteratorCallBack = null;
    };
    this.$final = function () {
      this.FIteratorCallBack = undefined;
      $mod.TFPCustomHashTable.$final.call(this);
    };
    this.CallbackIterator = function (Item, Key, Continue) {
      this.FIteratorCallBack(Item,Key,Continue);
    };
    this.CreateNewNode = function (aKey) {
      var Result = null;
      Result = $mod.THTStringNode.$create("CreateWith",[aKey]);
      return Result;
    };
    this.AddNode = function (ANode) {
      this.Add(ANode.FKey,ANode.FData);
    };
    this.SetData = function (Index, AValue) {
      this.FindOrCreateNew(Index).FData = AValue;
    };
    this.GetData = function (index) {
      var Result = "";
      var node = null;
      node = this.Find(index);
      if (node != null) {
        Result = node.FData}
       else Result = "";
      return Result;
    };
    this.ForEachCall = function (aMethod) {
      var Result = null;
      var i = 0;
      var j = 0;
      var Continue = false;
      Result = null;
      Continue = true;
      if (this.FHashTableSize > 0) for (var $l = 0, $end = this.FHashTableSize - 1; $l <= $end; $l++) {
        i = $l;
        if (this.Chain(i) != null) if (this.Chain(i).GetCount() > 0) for (var $l1 = 0, $end1 = this.Chain(i).GetCount() - 1; $l1 <= $end1; $l1++) {
          j = $l1;
          aMethod(this.Chain(i).GetItem(j).FData,this.Chain(i).GetItem(j).FKey,{get: function () {
              return Continue;
            }, set: function (v) {
              Continue = v;
            }});
          if (!Continue) {
            Result = this.Chain(i).GetItem(j);
            return Result;
          };
        };
      };
      return Result;
    };
    this.Iterate = function (aMethod) {
      var Result = "";
      var N = null;
      N = this.ForEachCall(aMethod);
      if (N != null) {
        Result = N.FData}
       else Result = "";
      return Result;
    };
    this.Iterate$1 = function (aMethod) {
      var Result = "";
      this.FIteratorCallBack = aMethod;
      Result = this.Iterate(rtl.createCallback(this,"CallbackIterator"));
      return Result;
    };
    this.Add = function (aKey, aItem) {
      var chn = null;
      var NewNode = null;
      chn = this.FindChainForAdd(aKey);
      NewNode = this.CreateNewNode(aKey);
      NewNode.FData = aItem;
      chn.Add(NewNode);
    };
  });
  rtl.createClass(this,"THTObjectNode",this.THTCustomNode,function () {
    this.$init = function () {
      $mod.THTCustomNode.$init.call(this);
      this.FData = null;
    };
    this.$final = function () {
      this.FData = undefined;
      $mod.THTCustomNode.$final.call(this);
    };
  });
  rtl.createClass(this,"THTOwnedObjectNode",this.THTObjectNode,function () {
    this.Destroy = function () {
      pas.SysUtils.FreeAndNil({p: this, get: function () {
          return this.p.FData;
        }, set: function (v) {
          this.p.FData = v;
        }});
      pas.System.TObject.Destroy.call(this);
    };
  });
  this.$rtti.$MethodVar("TObjectIteratorMethod",{procsig: rtl.newTIProcSig([["Item",pas.System.$rtti["TObject"]],["Key",rtl.string,2],["Continue",rtl.boolean,1]]), methodkind: 0});
  this.$rtti.$ProcVar("TObjectIteratorCallback",{procsig: rtl.newTIProcSig([["Item",pas.System.$rtti["TObject"]],["Key",rtl.string,2],["Continue",rtl.boolean,1]])});
  rtl.createClass(this,"TFPObjectHashTable",this.TFPCustomHashTable,function () {
    this.$init = function () {
      $mod.TFPCustomHashTable.$init.call(this);
      this.FOwnsObjects = false;
      this.FIteratorCallBack = null;
    };
    this.$final = function () {
      this.FIteratorCallBack = undefined;
      $mod.TFPCustomHashTable.$final.call(this);
    };
    this.CallbackIterator = function (Item, Key, Continue) {
      this.FIteratorCallBack(Item,Key,Continue);
    };
    this.CreateNewNode = function (aKey) {
      var Result = null;
      if (this.FOwnsObjects) {
        Result = $mod.THTOwnedObjectNode.$create("CreateWith",[aKey])}
       else Result = $mod.THTObjectNode.$create("CreateWith",[aKey]);
      return Result;
    };
    this.AddNode = function (ANode) {
      this.Add(ANode.FKey,ANode.FData);
    };
    this.SetData = function (Index, AObject) {
      this.FindOrCreateNew(Index).FData = AObject;
    };
    this.GetData = function (index) {
      var Result = null;
      var node = null;
      node = this.Find(index);
      if (node != null) {
        Result = node.FData}
       else Result = null;
      return Result;
    };
    this.ForEachCall = function (aMethod) {
      var Result = null;
      var i = 0;
      var j = 0;
      var Continue = false;
      Result = null;
      Continue = true;
      if (this.FHashTableSize > 0) for (var $l = 0, $end = this.FHashTableSize - 1; $l <= $end; $l++) {
        i = $l;
        if (this.Chain(i) != null) if (this.Chain(i).GetCount() > 0) for (var $l1 = 0, $end1 = this.Chain(i).GetCount() - 1; $l1 <= $end1; $l1++) {
          j = $l1;
          aMethod(this.Chain(i).GetItem(j).FData,this.Chain(i).GetItem(j).FKey,{get: function () {
              return Continue;
            }, set: function (v) {
              Continue = v;
            }});
          if (!Continue) {
            Result = this.Chain(i).GetItem(j);
            return Result;
          };
        };
      };
      return Result;
    };
    this.Create$2 = function (AOwnsObjects) {
      $mod.TFPCustomHashTable.Create$1.call(this);
      this.FOwnsObjects = AOwnsObjects;
      return this;
    };
    this.CreateWith$1 = function (AHashTableSize, aHashFunc, AOwnsObjects) {
      $mod.TFPCustomHashTable.CreateWith.call(this,AHashTableSize,aHashFunc);
      this.FOwnsObjects = AOwnsObjects;
      return this;
    };
    this.Iterate = function (aMethod) {
      var Result = null;
      var N = null;
      N = this.ForEachCall(aMethod);
      if (N != null) {
        Result = N.FData}
       else Result = null;
      return Result;
    };
    this.Iterate$1 = function (aMethod) {
      var Result = null;
      this.FIteratorCallBack = aMethod;
      Result = this.Iterate(rtl.createCallback(this,"CallbackIterator"));
      return Result;
    };
    this.Add = function (aKey, AItem) {
      var chn = null;
      var NewNode = null;
      chn = this.FindChainForAdd(aKey);
      NewNode = this.CreateNewNode(aKey);
      NewNode.FData = AItem;
      chn.Add(NewNode);
    };
  });
  rtl.createClass(this,"EDuplicate",pas.SysUtils.Exception,function () {
  });
  rtl.createClass(this,"EKeyNotFound",pas.SysUtils.Exception,function () {
  });
  var b = 378551;
  this.RSHash = function (S, TableSize) {
    var Result = 0;
    var a = 0;
    var i = 0;
    a = 63689;
    Result = 0;
    if (S.length > 0) for (var $l = 1, $end = S.length; $l <= $end; $l++) {
      i = $l;
      Result = (Result * a) + S.charCodeAt(i - 1);
      a = a * 378551;
    };
    Result = rtl.lw(Result & 0x7FFFFFFF) % TableSize;
    return Result;
  };
  rtl.recNewT(this,"TBucketItem",function () {
    this.Item = undefined;
    this.Data = undefined;
    this.$eq = function (b) {
      return (this.Item === b.Item) && (this.Data === b.Data);
    };
    this.$assign = function (s) {
      this.Item = s.Item;
      this.Data = s.Data;
      return this;
    };
    var $r = $mod.$rtti.$Record("TBucketItem",{});
    $r.addField("Item",rtl.jsvalue);
    $r.addField("Data",rtl.jsvalue);
  });
  this.$rtti.$DynArray("TBucketItemArray",{eltype: this.$rtti["TBucketItem"]});
  rtl.recNewT(this,"TBucket",function () {
    this.Count = 0;
    this.$new = function () {
      var r = Object.create(this);
      r.Items = [];
      return r;
    };
    this.$eq = function (b) {
      return (this.Count === b.Count) && (this.Items === b.Items);
    };
    this.$assign = function (s) {
      this.Count = s.Count;
      this.Items = rtl.arrayRef(s.Items);
      return this;
    };
    var $r = $mod.$rtti.$Record("TBucket",{});
    $r.addField("Count",rtl.longint);
    $r.addField("Items",$mod.$rtti["TBucketItemArray"]);
  });
  this.$rtti.$DynArray("TBucketArray",{eltype: this.$rtti["TBucket"]});
  this.$rtti.$RefToProcVar("TBucketProc",{procsig: rtl.newTIProcSig([["AInfo",rtl.jsvalue],["AItem",rtl.jsvalue],["AData",rtl.jsvalue],["AContinue",rtl.boolean,4]])});
  rtl.createClass(this,"TCustomBucketList",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FBuckets = [];
    };
    this.$final = function () {
      this.FBuckets = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.GetBucketCount = function () {
      var Result = 0;
      Result = rtl.length(this.FBuckets);
      return Result;
    };
    this.GetData = function (AItem) {
      var Result = undefined;
      var B = 0;
      var I = 0;
      this.GetBucketItem(AItem,{get: function () {
          return B;
        }, set: function (v) {
          B = v;
        }},{get: function () {
          return I;
        }, set: function (v) {
          I = v;
        }});
      Result = this.FBuckets[B].Items[I].Data;
      return Result;
    };
    this.SetData = function (AItem, AData) {
      var B = 0;
      var I = 0;
      this.GetBucketItem(AItem,{get: function () {
          return B;
        }, set: function (v) {
          B = v;
        }},{get: function () {
          return I;
        }, set: function (v) {
          I = v;
        }});
      this.FBuckets[B].Items[I].Data = AData;
    };
    this.SetBucketCount = function (Value) {
      if (Value !== this.GetBucketCount()) this.FBuckets = rtl.arraySetLength(this.FBuckets,$mod.TBucket,Value);
    };
    this.GetBucketItem = function (AItem, ABucket, AIndex) {
      if (!this.FindItem(AItem,ABucket,AIndex)) this.Error(rtl.getResStr($mod,"SErrNoSuchItem"),pas.System.VarRecs(20,AItem));
    };
    this.AddItem = function (ABucket, AItem, AData) {
      var Result = undefined;
      var L = 0;
      L = rtl.length(this.FBuckets[ABucket].Items);
      if (this.FBuckets[ABucket].Count === L) {
        if (L < 8) {
          L = 8}
         else L = L + rtl.trunc(L / 2);
        this.FBuckets[ABucket].Items = rtl.arraySetLength(this.FBuckets[ABucket].Items,$mod.TBucketItem,L);
      };
      var $with = this.FBuckets[ABucket];
      $with.Items[$with.Count].Item = AItem;
      $with.Items[$with.Count].Data = AData;
      Result = AData;
      $with.Count += 1;
      return Result;
    };
    this.DeleteItem = function (ABucket, AIndex) {
      var Result = undefined;
      var I = 0;
      var L = 0;
      Result = this.FBuckets[ABucket].Items[AIndex].Data;
      if (this.FBuckets[ABucket].Count === 1) {
        this.FBuckets[ABucket].Items = rtl.arraySetLength(this.FBuckets[ABucket].Items,$mod.TBucketItem,0)}
       else {
        L = this.FBuckets[ABucket].Count - AIndex - 1;
        for (var $l = 0, $end = L - 1; $l <= $end; $l++) {
          I = $l;
          this.FBuckets[ABucket].Items[AIndex + I].$assign(this.FBuckets[ABucket].Items[AIndex + I + 1]);
        };
      };
      this.FBuckets[ABucket].Count -= 1;
      return Result;
    };
    this.Error = function (Msg, Args) {
      throw pas.Classes.EListError.$create("CreateFmt",[Msg,Args]);
    };
    this.FindItem = function (AItem, ABucket, AIndex) {
      var Result = false;
      var I = 0;
      var B = $mod.TBucket.$new();
      ABucket.set(this.BucketFor(AItem));
      B.$assign(this.FBuckets[ABucket.get()]);
      I = B.Count - 1;
      while ((I >= 0) && (B.Items[I].Item != AItem)) I -= 1;
      Result = I >= 0;
      if (Result) AIndex.set(I);
      return Result;
    };
    this.Destroy = function () {
      this.Clear();
      pas.System.TObject.Destroy.call(this);
    };
    this.Clear = function () {
      var B = $mod.TBucket.$new();
      var I = 0;
      var J = 0;
      for (var $l = 0, $end = rtl.length(this.FBuckets) - 1; $l <= $end; $l++) {
        I = $l;
        B.$assign(this.FBuckets[I]);
        for (var $l1 = B.Count - 1; $l1 >= 0; $l1--) {
          J = $l1;
          this.DeleteItem(I,J);
        };
      };
      this.FBuckets = rtl.arraySetLength(this.FBuckets,$mod.TBucket,0);
    };
    this.Add = function (AItem, AData) {
      var Result = undefined;
      var B = 0;
      var I = 0;
      if (this.FindItem(AItem,{get: function () {
          return B;
        }, set: function (v) {
          B = v;
        }},{get: function () {
          return I;
        }, set: function (v) {
          I = v;
        }})) this.Error(rtl.getResStr($mod,"SDuplicateItem"),pas.System.VarRecs(20,AItem));
      Result = this.AddItem(B,AItem,AData);
      return Result;
    };
    this.Assign = function (AList) {
      var I = 0;
      var J = 0;
      this.Clear();
      this.FBuckets = rtl.arraySetLength(this.FBuckets,$mod.TBucket,rtl.length(AList.FBuckets));
      for (var $l = 0, $end = this.GetBucketCount() - 1; $l <= $end; $l++) {
        I = $l;
        this.FBuckets[I].Items = rtl.arraySetLength(this.FBuckets[I].Items,$mod.TBucketItem,rtl.length(AList.FBuckets[I].Items));
        for (var $l1 = 0, $end1 = AList.FBuckets[I].Count - 1; $l1 <= $end1; $l1++) {
          J = $l1;
          var $with = AList.FBuckets[I].Items[J];
          this.AddItem(I,$with.Item,$with.Data);
        };
      };
    };
    this.Exists = function (AItem) {
      var Result = false;
      var B = 0;
      var I = 0;
      Result = this.FindItem(AItem,{get: function () {
          return B;
        }, set: function (v) {
          B = v;
        }},{get: function () {
          return I;
        }, set: function (v) {
          I = v;
        }});
      return Result;
    };
    this.Find = function (AItem, AData) {
      var Result = false;
      var B = 0;
      var I = 0;
      Result = this.FindItem(AItem,{get: function () {
          return B;
        }, set: function (v) {
          B = v;
        }},{get: function () {
          return I;
        }, set: function (v) {
          I = v;
        }});
      if (Result) AData.set(this.FBuckets[B].Items[I].Data);
      return Result;
    };
    this.ForEach = function (AProc, AInfo) {
      var Result = false;
      var I = 0;
      var J = 0;
      var S = 0;
      var Bu = $mod.TBucket.$new();
      I = 0;
      Result = true;
      S = this.GetBucketCount();
      while (Result && (I < S)) {
        J = 0;
        Bu.$assign(this.FBuckets[I]);
        while (Result && (J < Bu.Count)) {
          var $with = Bu.Items[J];
          AProc(AInfo,$with.Item,$with.Data,{get: function () {
              return Result;
            }, set: function (v) {
              Result = v;
            }});
          J += 1;
        };
        I += 1;
      };
      return Result;
    };
    this.ForEach$1 = function (AProc) {
      var Result = false;
      Result = this.ForEach(AProc,null);
      return Result;
    };
    this.Remove = function (AItem) {
      var Result = undefined;
      var B = 0;
      var I = 0;
      if (this.FindItem(AItem,{get: function () {
          return B;
        }, set: function (v) {
          B = v;
        }},{get: function () {
          return I;
        }, set: function (v) {
          I = v;
        }})) {
        Result = this.FBuckets[B].Items[I].Data;
        this.DeleteItem(B,I);
      } else Result = null;
      return Result;
    };
  });
  this.TBucketListSizes = {"0": "bl2", bl2: 0, "1": "bl4", bl4: 1, "2": "bl8", bl8: 2, "3": "bl16", bl16: 3, "4": "bl32", bl32: 4, "5": "bl64", bl64: 5, "6": "bl128", bl128: 6, "7": "bl256", bl256: 7};
  this.$rtti.$Enum("TBucketListSizes",{minvalue: 0, maxvalue: 7, ordtype: 1, enumtype: this.TBucketListSizes});
  rtl.createClass(this,"TBucketList",this.TCustomBucketList,function () {
    this.$init = function () {
      $mod.TCustomBucketList.$init.call(this);
      this.FBucketMask = 0;
    };
    this.BucketFor = function (AItem) {
      var Result = 0;
      Result = rtl.lw(rtl.lw(rtl.trunc(AItem) >>> 2) & this.FBucketMask);
      return Result;
    };
    this.Create$1 = function (ABuckets) {
      var L = 0;
      pas.System.TObject.Create.call(this);
      L = 1 << (ABuckets + 1);
      this.SetBucketCount(L);
      this.FBucketMask = L - 1;
      return this;
    };
  });
  rtl.createClass(this,"TObjectBucketList",this.TBucketList,function () {
    this.GetData$1 = function (AItem) {
      var Result = null;
      Result = rtl.getObject($mod.TCustomBucketList.GetData.call(this,AItem));
      return Result;
    };
    this.SetData$1 = function (AItem, AData) {
      $mod.TCustomBucketList.SetData.call(this,AItem,AData);
    };
    this.Add$1 = function (AItem, AData) {
      var Result = null;
      Result = rtl.getObject($mod.TCustomBucketList.Add.call(this,AItem,AData));
      return Result;
    };
    this.Remove$1 = function (AItem) {
      var Result = null;
      Result = rtl.getObject($mod.TCustomBucketList.Remove.call(this,AItem));
      return Result;
    };
  });
  $mod.$implcode = function () {
    $impl.NPRIMES = 28;
    $mod.$rtti.$StaticArray("PRIMELIST$a",{dims: [28], eltype: rtl.longword});
    $impl.PRIMELIST = [53,97,193,389,769,1543,3079,6151,12289,24593,49157,98317,196613,393241,786433,1572869,3145739,6291469,12582917,25165843,50331653,100663319,201326611,402653189,805306457,1610612741,3221225473,4294967291];
    rtl.createClass($impl,"TlistComponent",pas.Classes.TComponent,function () {
      this.$init = function () {
        pas.Classes.TComponent.$init.call(this);
        this.Flist = null;
      };
      this.$final = function () {
        this.Flist = undefined;
        pas.Classes.TComponent.$final.call(this);
      };
      this.Notification = function (AComponent, Operation) {
        if (Operation === pas.Classes.TOperation.opRemove) this.Flist.HandleFreeNotify(this,AComponent);
        pas.Classes.TComponent.Notification.apply(this,arguments);
      };
      rtl.addIntf(this,pas.System.IUnknown);
    });
    $mod.$resourcestrings = {DuplicateMsg: {org: "An item with key %0:s already exists"}, NotEmptyMsg: {org: "Hash table not empty."}, SErrNoSuchItem: {org: "No item in list for %p"}, SDuplicateItem: {org: "Item already exists in list: %p"}};
  };
},["JS"]);
//# sourceMappingURL=contnrs.js.map
