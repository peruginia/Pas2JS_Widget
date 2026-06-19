unit Unit1;

{$mode objfpc}{$H+}

interface

uses
  JS, Classes, SysUtils, Graphics, Controls, Forms, Dialogs, WebCtrls, ComCtrls, WebDB, Grids, StdCtrls;

type

  { TWForm1 }

  TWForm1 = class(TWForm)
		  btnAggiornaApp: TWButton;
		  btnScollegaUtente: TWButton;
		  LabelUserName: TWLabel;
		  Panel1: TWPanel;
		  TabSheet4: TTabSheet;
		  TopMenuRight: TWPanel;
		  WButton3: TWButton;
		  WButton4: TWButton;
		  WButton5: TWButton;
		  WComboBox2: TWComboBox;
		  WEdit2: TWEdit;
		  WGroupBox1: TWGroupBox;
		  WImage1: TWImage;
		  WLabel5: TWLabel;
		  WListBox1: TWListBox;
    WPageControl1: TWPageControl;
    TabSheet1: TTabSheet;
      WLabel1: TWLabel;
      WEdit1: TWEdit;
      WLabel2: TWLabel;
      WMemo1: TWMemo;
      WComboBox1: TWComboBox;
      WButton1: TWButton;
      WButton2: TWButton;
      WCheckbox1: TWCheckbox;
		WPanel1: TWPanel;
		WPanel2: TWPanel;
      WRadioButton1: TWRadioButton;
    TabSheet2: TTabSheet;
      WFloatEdit1: TWFloatEdit;
      WIntegerEdit1: TWIntegerEdit;
      WDateEditBox1: TWDateEditBox;
		WStringGrid1: TWStringGrid;
      WTimeEditBox1: TWTimeEditBox;
		WTopBarUser: TWImage;
      WTrackBar1: TWTrackBar;
      WLabel3: TWLabel;
      WProgressBar1: TWProgressBar;
      WColorPicker1: TWColorPicker;
      WFileButton1: TWFileButton;
    TabSheet3: TTabSheet;
      WLabel4: TWLabel;
      WDataGrid1: TWDataGrid;
      WPagination1: TWPagination;
		WUserPannel: TWPanel;
    WWebDBConnection1: TWWebDBConnection;
    WWebDBTable1: TWWebDBTable;
    WTimer1: TWTimer;
	 procedure btnAggiornaAppClick(Sender: TObject);
  procedure btnScollegaUtenteClick(Sender: TObject);
    procedure LoadFromArray(Sender: TObject);
    procedure LoadFromURL(Sender: TObject);
    procedure LoadMore(Sender: TObject);
    procedure OnTableLoaded(Sender: TObject);
	 procedure WCheckbox1Click(Sender: TObject);
	 procedure WTopBarUserClick(Sender: TObject);
  private
    procedure WButton2Click(Sender: TObject);
    procedure WCombo1Change(Sender: TObject);
    procedure WTrackBar1Change(Sender: TObject);
    procedure WColorPickChange(Sender: TObject);
    procedure WTimerTick(Sender: TObject);
  public
    procedure AfterConstruction; override;
  end;

var
  WForm1: TWForm1;

implementation

{$R *.lfm}

procedure TWForm1.AfterConstruction;
begin
  inherited AfterConstruction;
  WEdit1.TextHint := 'Enter your name';
  WMemo1.TextHint := 'Enter description...';
  WFloatEdit1.TextHint := 'Float value';
  WIntegerEdit1.TextHint := 'Integer value';
  WCheckbox1.Checked := True;
  WRadioButton1.Checked := True;
  WComboBox1.Items.Add('Italy');
  WComboBox1.Items.Add('France');
  WComboBox1.Items.Add('Germany');
  WComboBox1.Items.Add('Spain');
  WComboBox1.ItemIndex := 0;
  WComboBox2.Items.Add('Red');
  WComboBox2.Items.Add('Green');
  WComboBox2.Items.Add('Blue');
  WComboBox2.ItemIndex := 0;
  WListBox1.Items.Add('Option 1');
  WListBox1.Items.Add('Option 2');
  WListBox1.Items.Add('Option 3');
  WListBox1.Items.Add('Option 4');
  WListBox1.ItemIndex := 0;
  WProgressBar1.Value := 50;
  WLabel3.Caption := 'Value: 50';
  WEdit2.TextHint := 'https://jsonplaceholder.typicode.com/users';
  WButton2.OnClick := @WButton2Click;
  WButton3.OnClick := @LoadFromArray;
  WButton4.OnClick := @LoadFromURL;
  WButton5.OnClick := @LoadMore;
  WLabel4.Caption := '';
  WWebDBTable1.OnLoad := @OnTableLoaded;
  WComboBox1.OnChange := @WCombo1Change;
  WTrackBar1.OnChange := @WTrackBar1Change;
  WColorPicker1.OnChange := @WColorPickChange;
  WTimer1.OnTimer := @WTimerTick;
end;

procedure TWForm1.LoadFromArray(Sender: TObject);
var
  VData: TJSArray;
  VRow: TJSObject;
begin
  VData := TJSArray.New;
  VRow := TJSObject.New;
  VRow['Name'] := 'Mario Rossi';
  VRow['Age'] := 30;
  VRow['City'] := 'Rome';
  VData.Push(VRow);
  VRow := TJSObject.New;
  VRow['Name'] := 'Luigi Bianchi';
  VRow['Age'] := 25;
  VRow['City'] := 'Milan';
  VData.Push(VRow);
  VRow := TJSObject.New;
  VRow['Name'] := 'Anna Verdi';
  VRow['Age'] := 28;
  VRow['City'] := 'Naples';
  VData.Push(VRow);
  VRow := TJSObject.New;
  VRow['Name'] := 'Sofia Neri';
  VRow['Age'] := 35;
  VRow['City'] := 'Florence';
  VData.Push(VRow);
  VRow := TJSObject.New;
  VRow['Name'] := 'Marco Gialli';
  VRow['Age'] := 42;
  VRow['City'] := 'Turin';
  VData.Push(VRow);
  WDataGrid1.Data := VData;
end;

procedure TWForm1.btnScollegaUtenteClick(Sender: TObject);
begin
   ShowMessage('Bye bye....');
end;

procedure TWForm1.btnAggiornaAppClick(Sender: TObject);
begin
   ShowMessage('Updating....');
end;

procedure TWForm1.LoadFromURL(Sender: TObject);
var
  VURL: string;
begin
  VURL := WEdit2.Text;
  if VURL = '' then
    VURL := 'http://localhost/api.php';

  // 1. Configura la connessione
  WWebDBConnection1.Backend := wbWeb;
  WWebDBConnection1.BaseURL := VURL;

  // 2. Configura la tabella con caricamento progressivo
  WWebDBTable1.Connection := WWebDBConnection1;
  WWebDBTable1.TableName := 'Clienti';
  WWebDBTable1.Progressive := True;
  WWebDBTable1.PageSize := 100;

  // 3. Collega la DataGrid e abilita infinite scroll
  WDataGrid1.DataTable := WWebDBTable1;
  WDataGrid1.InfiniteScroll := True;

  // 4. Carica prima pagina
  WWebDBTable1.Load;
end;

procedure TWForm1.LoadMore(Sender: TObject);
begin
  if WWebDBTable1.LoadedRecords < WWebDBTable1.TotalRecords then
    WWebDBTable1.LoadNextPage;
end;

procedure TWForm1.OnTableLoaded(Sender: TObject);
begin
  WLabel4.Caption := IntToStr(WWebDBTable1.LoadedRecords) +
                     ' di ' + IntToStr(WWebDBTable1.TotalRecords);
  if WWebDBTable1.LoadedRecords >= WWebDBTable1.TotalRecords then
    WButton5.Enabled := False;
end;

procedure TWForm1.WCheckbox1Click(Sender: TObject);
begin
   WRadioButton1.Enabled:=WCheckbox1.Checked;
end;

procedure TWForm1.WTopBarUserClick(Sender: TObject);
begin
   WUserPannel.Visible:= not WUserPannel.Visible;
end;

procedure TWForm1.WButton2Click(Sender: TObject);
begin
  WEdit1.Text := '';
  WMemo1.Text := '';
end;

procedure TWForm1.WCombo1Change(Sender: TObject);
begin
  if WComboBox1.ItemIndex >= 0 then
    WLabel1.Caption := WComboBox1.Items[WComboBox1.ItemIndex];
end;

procedure TWForm1.WTrackBar1Change(Sender: TObject);
begin
  WProgressBar1.Value := WTrackBar1.Position;
  WLabel3.Caption := 'Value: ' + IntToStr(WTrackBar1.Position);
end;

procedure TWForm1.WColorPickChange(Sender: TObject);
begin
  WPanel1.Color := WColorPicker1.Color;
end;

procedure TWForm1.WTimerTick(Sender: TObject);
begin
  if WProgressBar1.Value >= 100 then
    WProgressBar1.Value := 0
  else
    WProgressBar1.Value := WProgressBar1.Value + 1;
end;

end.
