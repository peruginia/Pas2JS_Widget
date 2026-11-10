rtl.module("simplelinkedlist",["System"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TLinkedListItem",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.Next = null;
    };
    this.$final = function () {
      this.Next = undefined;
      pas.System.TObject.$final.call(this);
    };
  });
  this.$rtti.$ClassRef("TLinkedListItemClass",{instancetype: this.$rtti["TLinkedListItem"]});
  rtl.createClass(this,"TLinkedListVisitor",pas.System.TObject,function () {
  });
  rtl.createClass(this,"TLinkedList",pas.System.TObject,function () {
    this.$init = function () {
      pas.System.TObject.$init.call(this);
      this.FItemClass = null;
      this.FRoot = null;
    };
    this.$final = function () {
      this.FItemClass = undefined;
      this.FRoot = undefined;
      pas.System.TObject.$final.call(this);
    };
    this.GetCount = function () {
      var Result = 0;
      var I = null;
      I = this.FRoot;
      Result = 0;
      while (I !== null) {
        I = I.Next;
        Result += 1;
      };
      return Result;
    };
    this.Create$1 = function (AnItemClass) {
      this.FItemClass = AnItemClass;
      return this;
    };
    this.Destroy = function () {
      this.Clear();
      pas.System.TObject.Destroy.call(this);
    };
    this.Clear = function () {
      var I = null;
      I = this.FRoot;
      while (I !== null) {
        this.FRoot = I;
        I = I.Next;
        this.FRoot.Next = null;
        pas.SysUtils.FreeAndNil({p: this, get: function () {
            return this.p.FRoot;
          }, set: function (v) {
            this.p.FRoot = v;
          }});
      };
    };
    this.Add = function () {
      var Result = null;
      Result = this.FItemClass.$create("Create");
      Result.Next = this.FRoot;
      this.FRoot = Result;
      return Result;
    };
    this.ForEach = function (Visitor) {
      var I = null;
      I = this.FRoot;
      while ((I !== null) && Visitor.Visit(I)) I = I.Next;
    };
    this.RemoveItem = function (Item, FreeItem) {
      var I = null;
      if ((Item !== null) && (this.FRoot !== null)) {
        if (Item === this.FRoot) {
          this.FRoot = Item.Next}
         else {
          I = this.FRoot;
          while ((I.Next !== null) && (I.Next !== Item)) I = I.Next;
          if (I.Next === Item) I.Next = Item.Next;
        };
        if (FreeItem) Item = rtl.freeLoc(Item);
      };
    };
  });
},["SysUtils"]);
//# sourceMappingURL=simplelinkedlist.js.map
