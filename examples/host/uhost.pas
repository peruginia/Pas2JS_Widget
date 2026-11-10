unit UHost;

{$mode delphi}{$H+}

// The host shell: a header, a menu built from the screens registered in
// AppHost, and a content panel that embeds the selected screen.

interface

uses
  JS, Classes, SysUtils, Graphics, Controls, Forms, WebCtrls, AppHost;

procedure BuildHostApp(AForm: TWForm);

implementation

type
  TScreenButton = class(TWButton)
  public
    ScreenIndex: NativeInt;
  end;

  THostUI = class
  private
    FForm: TWForm;
    FMenu: TWPanel;
    FContent: TWPanel;
    FCurrent: TControl;
    procedure Build;
    procedure AddScreenButton(AIndex: NativeInt);
    procedure ScreenClick(Sender: TObject);
    procedure ShowScreen(AIndex: NativeInt);
  public
    constructor Create(AForm: TWForm);
  end;

constructor THostUI.Create(AForm: TWForm);
begin
  inherited Create;
  FForm := AForm;
  Build;
end;

procedure THostUI.Build;
var
  Header: TWPanel;
  Title: TWLabel;
  UserLabel: TWLabel;
  I: NativeInt;
begin
  FForm.Caption := 'WCL module host';
  FForm.Width := 960;
  FForm.Height := 600;

  Header := TWPanel.Create(FForm);
  Header.Parent := FForm;
  Header.Align := alTop;
  Header.Height := 56;
  Header.BevelOuter := bvNone;

  Title := TWLabel.Create(Header);
  Title.Parent := Header;
  Title.Left := 20;
  Title.Top := 16;
  Title.Caption := 'WCL module host';

  UserLabel := TWLabel.Create(Header);
  UserLabel.Parent := Header;
  UserLabel.Left := 280;
  UserLabel.Top := 18;
  UserLabel.Caption := 'User: ' + TAppHost.UserName;

  FMenu := TWPanel.Create(FForm);
  FMenu.Parent := FForm;
  FMenu.Align := alLeft;
  FMenu.Width := 230;

  FContent := TWPanel.Create(FForm);
  FContent.Parent := FForm;
  FContent.Align := alClient;
  TAppHost.Content := FContent;

  for I := 0 to TAppHost.ScreenCount - 1 do
    AddScreenButton(I);

  if TAppHost.ScreenCount > 0 then
    ShowScreen(0);
end;

procedure THostUI.AddScreenButton(AIndex: NativeInt);
var
  Button: TScreenButton;
begin
  Button := TScreenButton.Create(FMenu);
  Button.Parent := FMenu;
  Button.Left := 14;
  Button.Top := 18 + AIndex * 46;
  Button.Width := FMenu.Width - 28;
  Button.Height := 34;
  Button.Caption := TAppHost.ScreenCaption(AIndex);
  Button.ScreenIndex := AIndex;
  Button.OnClick := @ScreenClick;
end;

procedure THostUI.ScreenClick(Sender: TObject);
begin
  ShowScreen(TScreenButton(Sender).ScreenIndex);
end;

procedure THostUI.ShowScreen(AIndex: NativeInt);
var
  ScreenClass: TScreenClass;
begin
  if Assigned(FCurrent) then
    FreeAndNil(FCurrent);
  ScreenClass := TAppHost.ScreenClass(AIndex);
  if not Assigned(ScreenClass) then
    Exit;
  FCurrent := ScreenClass.Create(FContent);
  FCurrent.Parent := FContent;
  FCurrent.Align := alClient;
end;

procedure BuildHostApp(AForm: TWForm);
begin
  TAppHost.UserName := 'demo';
  THostUI.Create(AForm);
end;

end.
