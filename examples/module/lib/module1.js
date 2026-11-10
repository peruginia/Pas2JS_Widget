rtl.module("Module1",["System","JS","Classes","SysUtils","Graphics","Controls","Forms","WebCtrls","AppHost"],function () {
  "use strict";
  var $mod = this;
  rtl.createClass(this,"TModulePanel",pas.WebCtrls.TWPanel,function () {
    this.$init = function () {
      pas.WebCtrls.TWPanel.$init.call(this);
      this.FName$1 = null;
      this.FGreeting = null;
    };
    this.$final = function () {
      this.FName$1 = undefined;
      this.FGreeting = undefined;
      pas.WebCtrls.TWPanel.$final.call(this);
    };
    this.GreetClick = function (Sender) {
      this.FGreeting.SetText("Hello, " + this.FName$1.GetText() + "!");
    };
    this.AfterConstruction = function () {
      var Title = null;
      var Hint = null;
      var Button = null;
      pas.System.TObject.AfterConstruction.call(this);
      this.SetText("");
      Title = pas.WebCtrls.TWLabel.$create("Create$1",[this]);
      Title.SetParent(this);
      Title.SetLeft(24);
      Title.SetTop(24);
      Title.SetText("Module screen for " + pas.AppHost.TAppHost.UserName);
      Hint = pas.WebCtrls.TWLabel.$create("Create$1",[this]);
      Hint.SetParent(this);
      Hint.SetLeft(24);
      Hint.SetTop(56);
      Hint.SetText("Created by Module1 and embedded by the host.");
      this.FName$1 = pas.WebCtrls.TWEdit.$create("Create$1",[this]);
      this.FName$1.SetParent(this);
      this.FName$1.SetLeft(24);
      this.FName$1.SetTop(92);
      this.FName$1.SetWidth(240);
      this.FName$1.SetTextHint("Your name");
      Button = pas.WebCtrls.TWButton.$create("Create$1",[this]);
      Button.SetParent(this);
      Button.SetLeft(280);
      Button.SetTop(92);
      Button.SetWidth(100);
      Button.SetText("Greet");
      Button.FOnClick = rtl.createCallback(this,"GreetClick");
      this.FGreeting = pas.WebCtrls.TWLabel.$create("Create$1",[this]);
      this.FGreeting.SetParent(this);
      this.FGreeting.SetLeft(24);
      this.FGreeting.SetTop(142);
      this.FGreeting.SetText("");
    };
    rtl.addIntf(this,pas.System.IUnknown);
  });
  $mod.$init = function () {
    pas.AppHost.TAppHost.RegisterScreen("Module demo",$mod.TModulePanel);
  };
});
//# sourceMappingURL=module1.js.map
