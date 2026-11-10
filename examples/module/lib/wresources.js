rtl.module("WResources",["System","Classes"],function () {
  "use strict";
  var $mod = this;
  this.InitResourceComponent = function (Instance, RootAncestor) {
    var Result = false;
    function InitComponent(ClassType) {
      var Result = false;
      var data = "";
      var ResName = "";
      var Stream = null;
      var BinStream = null;
      var Reader = null;
      var info = pas.p2jsres.TResourceInfo.$new();
      Result = false;
      if ((ClassType === pas.Classes.TComponent) || (ClassType === RootAncestor)) return Result;
      if (ClassType.$ancestor != null) Result = InitComponent(ClassType.$ancestor);
      Stream = null;
      ResName = ClassType.$module.$name;
      if (!pas.p2jsres.GetResourceInfo(ResName,info)) return Result;
      data = window.atob(info.data);
      if (data !== "") Stream = pas.Classes.TStringStream.$create("Create$2",[data]);
      if (!(Stream != null)) return Result;
      try {
        try {
          BinStream = pas.Classes.TMemoryStream.$create("Create");
          try {
            pas.Classes.ObjectTextToBinary(Stream,BinStream);
            BinStream.SetPosition(0);
            Reader = pas.Classes.TReader.$create("Create$1",[BinStream]);
            try {
              Reader.ReadRootComponent(Instance);
            } finally {
              Reader = rtl.freeLoc(Reader);
            };
          } finally {
            BinStream = rtl.freeLoc(BinStream);
          };
        } catch ($e) {
          if (pas.SysUtils.Exception.isPrototypeOf($e)) {
            var E = $e;
            pas.System.Writeln(pas.SysUtils.Format(rtl.getResStr(pas.WCLStrConsts,"rsFormStreamingError"),pas.System.VarRecs(18,ClassType.$classname,18,E.fMessage)));
            throw $e;
          } else throw $e
        };
      } finally {
        Stream = rtl.freeLoc(Stream);
      };
      Result = true;
      return Result;
    };
    if (rtl.neSet(rtl.intersectSet(Instance.FComponentState,rtl.createSet(pas.Classes.TComponentStateItem.csLoading,pas.Classes.TComponentStateItem.csInline)),{})) {
      Result = InitComponent(Instance.$class.ClassType());
    } else try {
      Result = InitComponent(Instance.$class.ClassType());
    } finally {
    };
    return Result;
  };
  $mod.$init = function () {
    pas.Classes.RegisterInitComponentHandler(pas.Classes.TComponent,$mod.InitResourceComponent);
  };
},["Web","SysUtils","p2jsres","WCLStrConsts"]);
//# sourceMappingURL=wresources.js.map
