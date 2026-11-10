program Project1;

{$mode delphi}{$H+}

uses
  Interfaces, Forms, UHost;

var
  HostForm: TWForm;

begin
  Application.Initialize;
  Application.CreateForm(TWForm, HostForm);
  BuildHostApp(HostForm);
  Application.Run;
end.
