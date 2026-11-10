unit AppHost;

{$mode delphi}{$H+}

// Shared host services. The host application and every dynamically loaded
// module use this unit, so they see the same instance and the same values.

interface

uses
  Classes, SysUtils, Controls;

type
  TScreenClass = class of TControl;

  TAppHost = class
  public
    /// The panel where the host shows the screen of the selected module.
    class var Content: TWinControl;
    /// A value shared by the host and the modules.
    class var UserName: string;
    class procedure RegisterScreen(const ACaption: string; AClass: TScreenClass);
    class function ScreenCount: NativeInt;
    class function ScreenCaption(AIndex: NativeInt): string;
    class function ScreenClass(AIndex: NativeInt): TScreenClass;
  end;

implementation

type
  TScreenEntry = class
  public
    Caption: string;
    ControlClass: TScreenClass;
  end;

var
  Screens: TList = nil;

class procedure TAppHost.RegisterScreen(const ACaption: string; AClass: TScreenClass);
var
  Entry: TScreenEntry;
begin
  if not Assigned(Screens) then
    Screens := TList.Create;
  Entry := TScreenEntry.Create;
  Entry.Caption := ACaption;
  Entry.ControlClass := AClass;
  Screens.Add(Entry);
end;

class function TAppHost.ScreenCount: NativeInt;
begin
  if Assigned(Screens) then
    Result := Screens.Count
  else
    Result := 0;
end;

class function TAppHost.ScreenCaption(AIndex: NativeInt): string;
begin
  if Assigned(Screens) and (AIndex >= 0) and (AIndex < Screens.Count) then
    Result := TScreenEntry(Screens[AIndex]).Caption
  else
    Result := '';
end;

class function TAppHost.ScreenClass(AIndex: NativeInt): TScreenClass;
begin
  if Assigned(Screens) and (AIndex >= 0) and (AIndex < Screens.Count) then
    Result := TScreenEntry(Screens[AIndex]).ControlClass
  else
    Result := nil;
end;

end.
