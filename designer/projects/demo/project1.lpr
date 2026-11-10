program project1; 

{$mode delphi}{$H+}

uses
      Interfaces, Forms, Unit1, uLogin;

{$R *.res}

begin
      Application.Initialize;
      { The login form is created first, so it becomes the main form and
        Application.Run shows it. The main form stays hidden until the login
        succeeds (see TFormLogin.LoginSucceeded). }
      Application.CreateForm(TFormLogin, FormLogin);
		Application.CreateForm(TWForm1, WForm1);
      Application.Run;
end.
