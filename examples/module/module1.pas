unit Module1;

{$mode delphi}{$H+}

// A loadable screen. The unit registers a control class in AppHost; the host
// application creates it when the user selects the screen. The same unit is
// compiled to a separate JavaScript module (-Jc-) and loaded at runtime.

interface

uses
  JS, Classes, SysUtils, Graphics, Controls, Forms, WebCtrls, AppHost;

type
  TModulePanel = class(TWPanel)
  private
    FName: TWEdit;
    FGreeting: TWLabel;
    procedure GreetClick(Sender: TObject);
  public
    procedure AfterConstruction; override;
  end;

implementation

procedure TModulePanel.AfterConstruction;
var
  Title: TWLabel;
  Hint: TWLabel;
  Button: TWButton;
begin
  inherited AfterConstruction;
  Caption := '';

  Title := TWLabel.Create(Self);
  Title.Parent := Self;
  Title.Left := 24;
  Title.Top := 24;
  Title.Caption := 'Module screen for ' + TAppHost.UserName;

  Hint := TWLabel.Create(Self);
  Hint.Parent := Self;
  Hint.Left := 24;
  Hint.Top := 56;
  Hint.Caption := 'Created by Module1 and embedded by the host.';

  FName := TWEdit.Create(Self);
  FName.Parent := Self;
  FName.Left := 24;
  FName.Top := 92;
  FName.Width := 240;
  FName.TextHint := 'Your name';

  Button := TWButton.Create(Self);
  Button.Parent := Self;
  Button.Left := 280;
  Button.Top := 92;
  Button.Width := 100;
  Button.Caption := 'Greet';
  Button.OnClick := @GreetClick;

  FGreeting := TWLabel.Create(Self);
  FGreeting.Parent := Self;
  FGreeting.Left := 24;
  FGreeting.Top := 142;
  FGreeting.Caption := '';
end;

procedure TModulePanel.GreetClick(Sender: TObject);
begin
  FGreeting.Caption := 'Hello, ' + FName.Text + '!';
end;

initialization
  /// The host sees this registration when it runs the module with
  /// rtl.run('Module1'), before the host program creates its window.
  TAppHost.RegisterScreen('Module demo', TModulePanel);

end.
