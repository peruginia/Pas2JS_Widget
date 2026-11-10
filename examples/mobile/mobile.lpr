program mobile;

{$mode objfpc}{$H+}

uses
  Interfaces,
  Forms,
  WebCtrls,
  UMObile;

var
  MobileForm: TWForm;

begin
  Application.Initialize;
  /// Responsive layout + notch support; the PWA manifest lives in mobile.html.
  Application.ViewportMode := vmResponsive;
  Application.ViewportFit := True;
  Application.CreateForm(TWForm, MobileForm);
  BuildMobileApp(MobileForm);
  Application.Run;
end.
