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
		  WMainMenu1: TWMainMenu;
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
	 procedure WButton1Click(Sender: TObject);
	 procedure WCheckbox1Click(Sender: TObject);
	 procedure WTopBarUserClick(Sender: TObject);
  private
    FDemoCards: Boolean;
    FDemoData: TJSArray;
    FDemoGrid: TWDataGrid;
    FDemoGrouped: Boolean;
    FDemoInfo: TWLabel;
    FDemoMode: NativeInt;
    FDemoLastCity: string;
    FDemoSeparators: Boolean;
    FDemoTable: TWWebDBTable;
    FLayoutInfo: TWLabel;
    FLayoutLeft: TWPanel;
    FLayoutTop: TWPanel;
    procedure BuildGridModesTab;
    procedure BuildSplitterTab;
    procedure DemoSplitterMoved(Sender: TObject);
    procedure DemoAddRow(AData: TJSArray; const AName: string; AAge: NativeInt;
      const ACity: string; AActive: Boolean);
    procedure DemoAddSeparator(ASender: TObject; var AData: string);
    function DemoDataArray: TJSArray;
    procedure DemoExportCSV(Sender: TObject);
    procedure DemoModeArray(Sender: TObject);
    procedure DemoModeDataJson(Sender: TObject);
    procedure DemoModeTable(Sender: TObject);
    procedure DemoRefresh;
    procedure DemoTableLoaded(Sender: TObject);
    procedure DemoToggleCards(Sender: TObject);
    procedure DemoToggleGroup(Sender: TObject);
    procedure DemoToggleSeparators(Sender: TObject);
    procedure DemoUpdateInfo;
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

uses
  uLogin;

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
  BuildGridModesTab;
  BuildSplitterTab;
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
   /// Disconnect: back to the login form.
   WUserPannel.Visible := False;
   Hide;
   if (Assigned(FormLogin)) then
   begin
      FormLogin.PrepareLogin;
      FormLogin.Show;
   end;
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

procedure TWForm1.WButton1Click(Sender: TObject);
begin

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

{ --- DataGrid demo: same grid fed by the three data sources --- }

const
  DM_ARRAY = 0;
  DM_JSON  = 1;
  DM_TABLE = 2;

procedure TWForm1.DemoAddRow(AData: TJSArray; const AName: string; AAge: NativeInt;
  const ACity: string; AActive: Boolean);
var
  VRow: TJSObject;
begin
  VRow := TJSObject.New;
  VRow['Name'] := AName;
  VRow['Age'] := AAge;
  VRow['City'] := ACity;
  VRow['Active'] := AActive;
  AData.Push(VRow);
end;

function TWForm1.DemoDataArray: TJSArray;
begin
  Result := TJSArray.New;
  /// Rows are ordered so cities repeat in blocks: with OnAddSeparator this
  /// produces one separator per group instead of one per row.
  // Rome
  DemoAddRow(Result, 'Mario Rossi', 30, 'Rome', True);
  DemoAddRow(Result, 'Elena Blu', 31, 'Rome', True);
  DemoAddRow(Result, 'Luca Ferri', 45, 'Rome', False);
  // Milan
  DemoAddRow(Result, 'Luigi Bianchi', 25, 'Milan', False);
  DemoAddRow(Result, 'Paolo Rosa', 38, 'Milan', True);
  DemoAddRow(Result, 'Chiara Costa', 29, 'Milan', True);
  // Naples
  DemoAddRow(Result, 'Anna Verdi', 28, 'Naples', True);
  DemoAddRow(Result, 'Giulia Viola', 27, 'Naples', False);
  DemoAddRow(Result, 'Simone Greco', 36, 'Naples', True);
  // Florence
  DemoAddRow(Result, 'Sofia Neri', 35, 'Florence', True);
  DemoAddRow(Result, 'Davide Ricci', 41, 'Florence', False);
  DemoAddRow(Result, 'Francesca Romano', 24, 'Florence', True);
  // Turin
  DemoAddRow(Result, 'Marco Gialli', 42, 'Turin', False);
  DemoAddRow(Result, 'Martina Colombo', 33, 'Turin', True);
end;

procedure TWForm1.DemoRefresh;
begin
  /// GroupField has no setter, so the grid must be re-bound to re-render.
  case FDemoMode of
    DM_ARRAY:
      begin
        FDemoGrid.Data := nil;
        FDemoGrid.Data := FDemoData;
      end;
    DM_JSON:
      begin
        FDemoGrid.DataJson := nil;
        FDemoGrid.DataJson := FDemoTable.DataJson;
      end;
    DM_TABLE:
      begin
        FDemoGrid.DataTable := nil;
        FDemoGrid.DataTable := FDemoTable;
      end;
  end;
end;

procedure TWForm1.DemoUpdateInfo;
var
  VMode: string;
  VRows: string;
begin
  case FDemoMode of
    DM_ARRAY: VMode := 'Data (TJSArray)';
    DM_JSON:  VMode := 'DataJSon (TLocalJSONDataset)';
  else
    VMode := 'DataTable (in-memory)';
  end;
  if FDemoMode = DM_ARRAY then
    VRows := 'rows: ' + IntToStr(FDemoData.Length)
  else
    VRows := 'rows: ' + IntToStr(FDemoTable.LoadedRecords) + ' / ' +
      IntToStr(FDemoTable.TotalRecords);
  FDemoInfo.Caption :=
    'Source: ' + VMode + #10 +
    VRows + #10 +
    'Cards: ' + BoolToStr(FDemoCards, True) + '   Group: ' + BoolToStr(FDemoGrouped, True) +
    '   Separators: ' + BoolToStr(FDemoSeparators, True);
end;

{ OnAddSeparator is called before every row: writing HTML into AData inserts
  an extra <tr> in front of that row. }
procedure TWForm1.DemoAddSeparator(ASender: TObject; var AData: string);
var
  VCity: string;
begin
  AData := '';
  if (not FDemoSeparators) or (FDemoMode = DM_ARRAY) then
    Exit;
  if (not Assigned(FDemoTable)) or (not FDemoTable.Active) then
    Exit;
  /// Reset on the first record so a re-render starts from scratch.
  if (FDemoTable.DataJson.RecNo <= 1) then
    FDemoLastCity := '';
  VCity := FDemoTable.DataJson.FieldByName('City').AsString;
  /// An unpositioned dataset yields an empty value: never emit a blank row.
  if (VCity = '') then
    Exit;
  if (VCity = FDemoLastCity) then
    Exit;
  FDemoLastCity := VCity;
  AData := '<td colspan="4" style="background:#e8e8e8;font-weight:bold;' +
    'padding:6px 8px;border-top:1px solid #c9c3ba">' + VCity + '</td>';
end;

procedure TWForm1.DemoToggleSeparators(Sender: TObject);
begin
  FDemoSeparators := not FDemoSeparators;
  FDemoLastCity := '';
  /// The separator reads the dataset cursor, so switch to a dataset source
  /// when the grid is showing a plain array.
  if FDemoSeparators and (FDemoMode = DM_ARRAY) then
    DemoModeTable(nil)
  else
  begin
    DemoRefresh;
    DemoUpdateInfo;
  end;
end;

procedure TWForm1.DemoModeArray(Sender: TObject);
begin
  /// Unbind the table first: SetData does not clear DataTable, and a stale
  /// binding would route header clicks to the (server) sort path.
  FDemoGrid.DataTable := nil;
  FDemoMode := DM_ARRAY;
  FDemoGrid.Data := FDemoData;
  DemoUpdateInfo;
end;

procedure TWForm1.DemoModeDataJson(Sender: TObject);
begin
  FDemoGrid.DataTable := nil;
  FDemoMode := DM_JSON;
  FDemoTable.LoadFromArray(FDemoData);
  FDemoGrid.DataJson := FDemoTable.DataJson;
  DemoUpdateInfo;
end;

procedure TWForm1.DemoModeTable(Sender: TObject);
begin
  FDemoMode := DM_TABLE;
  FDemoTable.LoadFromArray(FDemoData);
  FDemoGrid.DataTable := nil;
  FDemoGrid.DataTable := FDemoTable;
  DemoUpdateInfo;
end;

procedure TWForm1.DemoToggleCards(Sender: TObject);
begin
  FDemoCards := not FDemoCards;
  FDemoGrid.ResponsiveMode := FDemoCards;
  DemoUpdateInfo;
end;

procedure TWForm1.DemoToggleGroup(Sender: TObject);
begin
  FDemoGrouped := not FDemoGrouped;
  if FDemoGrouped then
    FDemoGrid.GroupField := 'City'
  else
    FDemoGrid.GroupField := '';
  DemoRefresh;
  DemoUpdateInfo;
end;

procedure TWForm1.DemoExportCSV(Sender: TObject);
begin
  FDemoGrid.ExportToCSV;
end;

procedure TWForm1.DemoTableLoaded(Sender: TObject);
begin
  DemoUpdateInfo;
end;

procedure TWForm1.BuildGridModesTab;
var
  VSheet: TCustomTabSheet;
  VBar: TWPanel;
begin
  FDemoData := DemoDataArray;
  FDemoMode := DM_ARRAY;
  FDemoCards := False;
  FDemoGrouped := False;
  FDemoSeparators := False;
  FDemoLastCity := '';

  FDemoTable := TWWebDBTable.Create(Self);
  FDemoTable.TableName := 'Demo';
  FDemoTable.OnLoad := @DemoTableLoaded;

  VSheet := WPageControl1.AddTabSheet;
  VSheet.Caption := 'Grid Modes';
  /// Inactive pages are not sized by the page control, so give it a start size;
  /// UpdatePages will re-set it (and ReAlign the children) when the tab is shown.
  VSheet.SetBounds(0, 0, WPageControl1.Width, WPageControl1.Height);

  /// Grid first, panel on top (same order as the .lfm uses)
  FDemoGrid := TWDataGrid.Create(Self);
  FDemoGrid.Parent := VSheet;
  FDemoGrid.Align := alClient;
  FDemoGrid.BorderSpacing.Around := 10;
  FDemoGrid.ColumnClickSorts := True;
  FDemoGrid.FilterBox := True;
  FDemoGrid.ShowHeader := True;
  FDemoGrid.RowSelect := True;
  FDemoGrid.AlternateRowColor := 15921906;
  FDemoGrid.ResponsiveBreakpoint := 600;
  FDemoGrid.OnAddSeparator := @DemoAddSeparator;
  FDemoGrid.Data := FDemoData;

  VBar := TWPanel.Create(Self);
  VBar.Parent := VSheet;
  VBar.Align := alTop;
  VBar.Height := 80;
  VBar.Caption := '';

  FDemoInfo := TWLabel.Create(Self);
  FDemoInfo.Parent := VBar;
  FDemoInfo.Align := alClient;
  FDemoInfo.BorderSpacing.Left := 430;
  FDemoInfo.BorderSpacing.Around := 8;
  FDemoInfo.AutoSize := False;
  FDemoInfo.Caption := '';

  /// Row 1: data sources
  with TWButton.Create(Self) do
  begin
    Parent := VBar;
    Left := 8;  Top := 8;  Width := 130; Height := 28;
    Caption := 'Data: array';
    OnClick := @DemoModeArray;
  end;
  with TWButton.Create(Self) do
  begin
    Parent := VBar;
    Left := 146; Top := 8; Width := 130; Height := 28;
    Caption := 'Data: DataJson';
    OnClick := @DemoModeDataJson;
  end;
  with TWButton.Create(Self) do
  begin
    Parent := VBar;
    Left := 284; Top := 8; Width := 130; Height := 28;
    Caption := 'Data: table';
    OnClick := @DemoModeTable;
  end;

  /// Row 2: display modes
  with TWButton.Create(Self) do
  begin
    Parent := VBar;
    Left := 8;  Top := 44; Width := 130; Height := 28;
    Caption := 'Toggle cards';
    OnClick := @DemoToggleCards;
  end;
  with TWButton.Create(Self) do
  begin
    Parent := VBar;
    Left := 146; Top := 44; Width := 130; Height := 28;
    Caption := 'Toggle group';
    OnClick := @DemoToggleGroup;
  end;
  with TWButton.Create(Self) do
  begin
    Parent := VBar;
    Left := 284; Top := 44; Width := 130; Height := 28;
    Caption := 'Export CSV';
    OnClick := @DemoExportCSV;
  end;
  with TWButton.Create(Self) do
  begin
    Parent := VBar;
    Left := 422; Top := 44; Width := 130; Height := 28;
    Caption := 'Toggle separators';
    OnClick := @DemoToggleSeparators;
  end;

  DemoUpdateInfo;
end;

{ --- TSplitter demo: two panels split vertically and horizontally --- }

procedure TWForm1.DemoSplitterMoved(Sender: TObject);
begin
  if Assigned(FLayoutInfo) then
    FLayoutInfo.Caption := 'Left panel: ' + IntToStr(FLayoutLeft.Width) + ' px' + #10 +
      'Top panel: ' + IntToStr(FLayoutTop.Height) + ' px' + #10 +
      'Drag the grey bars.';
end;

procedure TWForm1.BuildSplitterTab;
var
  VSheet: TCustomTabSheet;
  VClient, VBottom: TWPanel;
  VSplitV, VSplitH: TWSplitter;
begin
  VSheet := WPageControl1.AddTabSheet;
  VSheet.Caption := 'Layout';
  VSheet.SetBounds(0, 0, WPageControl1.Width, WPageControl1.Height);

  /// alClient first, then the alLeft chain (AlignControls places alLeft in
  /// declaration order, so the panel comes before its splitter).
  VClient := TWPanel.Create(Self);
  VClient.Parent := VSheet;
  VClient.Align := alClient;
  VClient.Color := clWhite;

  FLayoutLeft := TWPanel.Create(Self);
  FLayoutLeft.Parent := VSheet;
  FLayoutLeft.Align := alLeft;
  FLayoutLeft.Width := 160;
  FLayoutLeft.Color := clSilver;

  VSplitV := TWSplitter.Create(Self);
  VSplitV.Parent := VSheet;
  VSplitV.Align := alLeft;
  VSplitV.Width := 6;
  VSplitV.MinSize := 80;
  VSplitV.OnMoved := @DemoSplitterMoved;

  /// Inside the client area: horizontal split.
  VBottom := TWPanel.Create(Self);
  VBottom.Parent := VClient;
  VBottom.Align := alClient;
  VBottom.Color := clGray;

  FLayoutTop := TWPanel.Create(Self);
  FLayoutTop.Parent := VClient;
  FLayoutTop.Align := alTop;
  FLayoutTop.Height := 100;
  FLayoutTop.Color := clSilver;

  VSplitH := TWSplitter.Create(Self);
  VSplitH.Parent := VClient;
  VSplitH.Align := alTop;
  VSplitH.Height := 6;
  VSplitH.MinSize := 40;
  VSplitH.OnMoved := @DemoSplitterMoved;

  FLayoutInfo := TWLabel.Create(Self);
  FLayoutInfo.Parent := FLayoutTop;
  FLayoutInfo.Align := alClient;
  FLayoutInfo.BorderSpacing.Around := 8;
  FLayoutInfo.AutoSize := False;

  DemoSplitterMoved(nil);
end;

end.
