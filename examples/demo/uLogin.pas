unit uLogin;

{$mode delphi}{$H+}

interface

uses
  JS, Classes, SysUtils, Graphics, Controls, Forms, Dialogs, WebCtrls;

type
  { TFormLogin }

  TFormLogin = class(TWForm)
    btnLogin: TWButton;
    edtPassword: TWEdit;
    edtUser: TWEdit;
    lblError: TWLabel;
    lblHint: TWLabel;
    lblPassword: TWLabel;
    lblTitle: TWLabel;
    lblUser: TWLabel;
    LoginPanel: TWPanel;
    procedure btnLoginClick(Sender: TObject);
    procedure FormResize(Sender: TObject);
  private
    procedure CenterPanel;
    procedure DoLogin; async;
    procedure EditKeyDown(Sender: TObject; var Key: NativeInt; Shift: TShiftState);
    procedure LoginSucceeded(const AName: string);
  public
    procedure AfterConstruction; override;
    /// Clears the error and the password before showing the form again.
    procedure PrepareLogin;
  end;

var
  FormLogin: TFormLogin;

implementation

uses
  Unit1;

{$R *.lfm}

procedure TFormLogin.CenterPanel;
begin
  if (not Assigned(LoginPanel)) then
    Exit;
  LoginPanel.Left := (ClientWidth - LoginPanel.Width) div 2;
  LoginPanel.Top := (ClientHeight - LoginPanel.Height) div 2;
end;

procedure TFormLogin.FormResize(Sender: TObject);
begin
  CenterPanel;
end;

procedure TFormLogin.AfterConstruction;
begin
  inherited AfterConstruction;
  CenterPanel;
  /// Enter in the password field submits the form.
  if (Assigned(edtPassword)) then
    edtPassword.OnKeyDown := @EditKeyDown;
end;

procedure TFormLogin.EditKeyDown(Sender: TObject; var Key: NativeInt; Shift: TShiftState);
begin
  if (Key = 13) then
  begin
    Key := 0;
    DoLogin;
  end;
end;

procedure TFormLogin.LoginSucceeded(const AName: string);
begin
  if (Assigned(WForm1)) then
  begin
    WForm1.Caption := 'WCL Component Demo - ' + AName;
    WForm1.Show;
    Hide;
  end;
end;

procedure TFormLogin.PrepareLogin;
begin
  lblError.Caption := '';
  edtPassword.Text := '';
end;

procedure TFormLogin.DoLogin; async;
const
  /// Relative URL: it works when the page is served by PHP (php -S).
  /// On static hosting the request fails and the demo/demo fallback kicks in.
  API_LOGIN = 'api.php?cmd=Login';
var
  VBase, VPass, VText, VUser, VName: string;
  VOk: Boolean;
  VObj: TJSObject;
  VRaw: JSValue;
begin
  VUser := Trim(edtUser.Text);
  VPass := edtPassword.Text;
  lblError.Caption := '';

  if (VUser = '') then
  begin
    lblError.Caption := 'Inserire il nome utente.';
    edtUser.SetFocus;
    Exit;
  end;
  if (VPass = '') then
  begin
    lblError.Caption := 'Inserire la password.';
    edtPassword.SetFocus;
    Exit;
  end;

  btnLogin.Enabled := False;
  try
    VOk := False;
    VName := '';
    VText := '';
    VBase := API_LOGIN;
    try
      asm
        var url = VBase + '&UserName=' + encodeURIComponent(VUser) +
                  '&Password=' + encodeURIComponent(VPass);
        VRaw = await fetch(url, { cache: 'no-store' })
          .then(function (r) { return r.ok ? r.text() : ''; })
          .catch(function () { return ''; });
      end;
      VText := String(VRaw);
    except
      VText := '';
    end;

    /// Only trust the answer when it really looks like the API response:
    /// on GitHub Pages api.php is served as a text file, not executed.
    if (VText <> '') and (Pos('"result"', VText) > 0) then
    begin
      try
        VObj := TJSObject(TJSJSON.parse(VText));
        VOk := (LowerCase(String(VObj['result'])) = 'true');
        if VOk then
          VName := String(VObj['Name']);
      except
        /// Not JSON (e.g. the PHP source served as a static file).
        VOk := False;
      end;
    end;

    /// No backend available: keep the multi-form demo usable anyway.
    if (not VOk) and (VUser = 'demo') and (VPass = 'demo') then
    begin
      VOk := True;
      VName := 'Demo User';
    end;

    if VOk then
      LoginSucceeded(VName)
    else
    begin
      lblError.Caption := 'Nome utente o password errati.';
      edtPassword.Text := '';
      edtPassword.SetFocus;
    end;
  finally
    btnLogin.Enabled := True;
  end;
end;

procedure TFormLogin.btnLoginClick(Sender: TObject);
begin
  DoLogin;
end;

end.
