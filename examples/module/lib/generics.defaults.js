rtl.module("Generics.Defaults",["System"],function () {
  "use strict";
  var $mod = this;
  $mod.$rtti.$Interface("IComparer<System.Longint>");
  $mod.$rtti.$Interface("IEnumerator<System.Longint>");
  $mod.$rtti.$Interface("IEnumerable<System.Longint>");
  $mod.$rtti.$Interface("IComparer<Controls.TBasicActionClient>");
  $mod.$rtti.$Interface("IEnumerator<Controls.TBasicActionClient>");
  $mod.$rtti.$Interface("IEnumerable<Controls.TBasicActionClient>");
  $mod.$rtti.$Interface("IComparer<ActnList.TAction>");
  $mod.$rtti.$Interface("IEnumerator<ActnList.TAction>");
  $mod.$rtti.$Interface("IEnumerable<ActnList.TAction>");
  $mod.$rtti.$Interface("IComparer<Menus.TMenuItem>");
  $mod.$rtti.$Interface("IEnumerator<Menus.TMenuItem>");
  $mod.$rtti.$Interface("IEnumerable<Menus.TMenuItem>");
  $mod.$rtti.$Interface("IComparer<ComCtrls.TTreeNode>");
  $mod.$rtti.$Interface("IEnumerator<ComCtrls.TTreeNode>");
  $mod.$rtti.$Interface("IEnumerable<ComCtrls.TTreeNode>");
  $mod.$rtti.$Interface("IComparer<ComCtrls.TListItem>");
  $mod.$rtti.$Interface("IEnumerator<ComCtrls.TListItem>");
  $mod.$rtti.$Interface("IEnumerable<ComCtrls.TListItem>");
  rtl.createInterface(this,"IComparer$G18","{505778ED-F783-4456-9691-32F419CC5E18}",["Compare"],pas.System.IUnknown,function () {
    var $r = this.$rtti;
    $r.addMethod("Compare",1,[["Left",rtl.longint,2],["Right",rtl.longint,2]],rtl.longint);
  },"IComparer<System.Longint>");
  rtl.createInterface(this,"IEnumerator$G5","{BE4D2658-C397-337B-B088-7563ADDB2523}",["GetCurrent","MoveNext","Reset"],pas.System.IUnknown,function () {
    var $r = this.$rtti;
    $r.addMethod("GetCurrent",1,[],rtl.longint);
    $r.addMethod("MoveNext",1,[],rtl.boolean);
    $r.addMethod("Reset",0,[]);
    $r.addProperty("Current",1,rtl.longint,"GetCurrent","");
  },"IEnumerator<System.Longint>");
  rtl.createInterface(this,"IEnumerable$G4","{12A3F9CE-C397-3543-95B0-3285A78D12B5}",["GetEnumerator"],pas.System.IUnknown,function () {
    var $r = this.$rtti;
    $r.addMethod("GetEnumerator",1,[],$mod.$rtti["IEnumerator<System.Longint>"]);
  },"IEnumerable<System.Longint>");
  rtl.createInterface(this,"IComparer$G19","{505778ED-F783-4456-9691-32F419CC5E18}",["Compare"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("Compare",1,[["Left",pas.Controls.$rtti["TBasicActionClient"],2],["Right",pas.Controls.$rtti["TBasicActionClient"],2]],rtl.longint);
    };
  },"IComparer<Controls.TBasicActionClient>");
  rtl.createInterface(this,"IEnumerator$G6","{D73E893F-6CF7-386E-BA19-F071E9877166}",["GetCurrent","MoveNext","Reset"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetCurrent",1,[],pas.Controls.$rtti["TBasicActionClient"]);
      $r.addMethod("MoveNext",1,[],rtl.boolean);
      $r.addMethod("Reset",0,[]);
      $r.addProperty("Current",1,pas.Controls.$rtti["TBasicActionClient"],"GetCurrent","");
    };
  },"IEnumerator<Controls.TBasicActionClient>");
  rtl.createInterface(this,"IEnumerable$G5","{323F67D0-69D2-3F36-93EA-DD2CE987724A}",["GetEnumerator"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetEnumerator",1,[],$mod.$rtti["IEnumerator<Controls.TBasicActionClient>"]);
    };
  },"IEnumerable<Controls.TBasicActionClient>");
  rtl.createInterface(this,"IComparer$G20","{505778ED-F783-4456-9691-32F419CC5E18}",["Compare"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("Compare",1,[["Left",pas.ActnList.$rtti["TAction"],2],["Right",pas.ActnList.$rtti["TAction"],2]],rtl.longint);
    };
  },"IComparer<ActnList.TAction>");
  rtl.createInterface(this,"IEnumerator$G7","{3D88D0FE-01AE-3567-B75A-3772A5E930D8}",["GetCurrent","MoveNext","Reset"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetCurrent",1,[],pas.ActnList.$rtti["TAction"]);
      $r.addMethod("MoveNext",1,[],rtl.boolean);
      $r.addMethod("Reset",0,[]);
      $r.addProperty("Current",1,pas.ActnList.$rtti["TAction"],"GetCurrent","");
    };
  },"IEnumerator<ActnList.TAction>");
  rtl.createInterface(this,"IEnumerable$G6","{25DD2674-DF2E-3567-98AE-B8DFED689E14}",["GetEnumerator"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetEnumerator",1,[],$mod.$rtti["IEnumerator<ActnList.TAction>"]);
    };
  },"IEnumerable<ActnList.TAction>");
  rtl.createInterface(this,"IComparer$G21","{505778ED-F783-4456-9691-32F419CC5E18}",["Compare"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("Compare",1,[["Left",pas.Menus.$rtti["TMenuItem"],2],["Right",pas.Menus.$rtti["TMenuItem"],2]],rtl.longint);
    };
  },"IComparer<Menus.TMenuItem>");
  rtl.createInterface(this,"IEnumerator$G8","{87B776D0-269D-34EC-B154-E2F2FC9F1563}",["GetCurrent","MoveNext","Reset"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetCurrent",1,[],pas.Menus.$rtti["TMenuItem"]);
      $r.addMethod("MoveNext",1,[],rtl.boolean);
      $r.addMethod("Reset",0,[]);
      $r.addProperty("Current",1,pas.Menus.$rtti["TMenuItem"],"GetCurrent","");
    };
  },"IEnumerator<Menus.TMenuItem>");
  rtl.createInterface(this,"IEnumerable$G7","{1343256D-D69D-34F9-A52A-F0DA0D6D9EC0}",["GetEnumerator"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetEnumerator",1,[],$mod.$rtti["IEnumerator<Menus.TMenuItem>"]);
    };
  },"IEnumerable<Menus.TMenuItem>");
  rtl.createInterface(this,"IComparer$G22","{505778ED-F783-4456-9691-32F419CC5E18}",["Compare"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("Compare",1,[["Left",pas.ComCtrls.$rtti["TTreeNode"],2],["Right",pas.ComCtrls.$rtti["TTreeNode"],2]],rtl.longint);
    };
  },"IComparer<ComCtrls.TTreeNode>");
  rtl.createInterface(this,"IEnumerator$G9","{1592971B-A4D5-3C08-B26C-ED12B363D768}",["GetCurrent","MoveNext","Reset"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetCurrent",1,[],pas.ComCtrls.$rtti["TTreeNode"]);
      $r.addMethod("MoveNext",1,[],rtl.boolean);
      $r.addMethod("Reset",0,[]);
      $r.addProperty("Current",1,pas.ComCtrls.$rtti["TTreeNode"],"GetCurrent","");
    };
  },"IEnumerator<ComCtrls.TTreeNode>");
  rtl.createInterface(this,"IEnumerable$G8","{274CAD32-0210-3C07-A1AE-7972CE35F904}",["GetEnumerator"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetEnumerator",1,[],$mod.$rtti["IEnumerator<ComCtrls.TTreeNode>"]);
    };
  },"IEnumerable<ComCtrls.TTreeNode>");
  rtl.createInterface(this,"IComparer$G23","{505778ED-F783-4456-9691-32F419CC5E18}",["Compare"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("Compare",1,[["Left",pas.ComCtrls.$rtti["TListItem"],2],["Right",pas.ComCtrls.$rtti["TListItem"],2]],rtl.longint);
    };
  },"IComparer<ComCtrls.TListItem>");
  rtl.createInterface(this,"IEnumerator$G10","{14890CD2-F575-3C08-B26C-ED12B363D768}",["GetCurrent","MoveNext","Reset"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetCurrent",1,[],pas.ComCtrls.$rtti["TListItem"]);
      $r.addMethod("MoveNext",1,[],rtl.boolean);
      $r.addMethod("Reset",0,[]);
      $r.addProperty("Current",1,pas.ComCtrls.$rtti["TListItem"],"GetCurrent","");
    };
  },"IEnumerator<ComCtrls.TListItem>");
  rtl.createInterface(this,"IEnumerable$G9","{264321E9-52B0-3C07-A1AE-7972CE35F904}",["GetEnumerator"],pas.System.IUnknown,function () {
    this.$initSpec = function () {
      var $r = this.$rtti;
      $r.addMethod("GetEnumerator",1,[],$mod.$rtti["IEnumerator<ComCtrls.TListItem>"]);
    };
  },"IEnumerable<ComCtrls.TListItem>");
});
//# sourceMappingURL=generics.defaults.js.map
