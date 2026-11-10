unit UMObile;

{$mode objfpc}{$H+}

interface

uses
  JS,
  Classes,
  SysUtils,
  Graphics,
  Controls,
  Forms,
  Dialogs,
  WebCtrls,
  ComCtrls,
  ExtCtrls,
  StdCtrls,
  Grids,
  DataGrid,
  WebDB;

/// Builds the whole mobile demo in code: no .lfm, so the layout is always
/// responsive (Align) and the touch sizes come from the shared theme.
procedure BuildMobileApp(AForm: TWForm);

implementation

var
  FPages: TWPageControl;
  FInfo: TWLabel;
  FSubTitle: TWLabel;
  FNav: array[0..2] of TWButton;

const
  BrandColor = TColor($00FE7E2A); /// #2A7EFE in BGR order

type
  /// Event handlers need an object instance: the demo is built on the base
  /// TWForm, so a small helper class holds the callbacks.
  TMobileEvents = class
  public
    procedure UpdateInfo(Sender: TObject);
    procedure SaveClick(Sender: TObject);
    procedure ShowFormClick(Sender: TObject);
    procedure ShowDataClick(Sender: TObject);
    procedure ShowInfoClick(Sender: TObject);
  end;

var
  FEvents: TMobileEvents;

procedure ShowPage(APage: NativeInt);
var
  VIndex: NativeInt;
  VCaption: string;
begin
  if (not Assigned(FPages)) then
    Exit;
  FPages.TabIndex := APage;
  case APage of
    0: VCaption := 'Form';
    1: VCaption := 'Data';
  else
    VCaption := 'Info';
  end;
  if Assigned(FSubTitle) then
    FSubTitle.Caption := VCaption;
  for VIndex := 0 to 2 do
  begin
    if Assigned(FNav[VIndex]) then
    begin
      if (VIndex = APage) then
        FNav[VIndex].Font.Style := [fsBold]
      else
        FNav[VIndex].Font.Style := [];
    end;
  end;
end;

procedure TMobileEvents.UpdateInfo(Sender: TObject);
var
  VMode: string;
begin
  if (not Assigned(FInfo)) then
    Exit;
  if (Application.ViewportMode = vmFitDesign) then
    VMode := 'fit design'
  else
    VMode := 'responsive';
  FInfo.Caption :=
    'Viewport: ' + IntToStr(Screen.ClientWidth) + ' x ' + IntToStr(Screen.ClientHeight) + #10 +
    'Screen: ' + IntToStr(Screen.Width) + ' x ' + IntToStr(Screen.Height) + #10 +
    'Touch: ' + BoolToStr(Screen.IsTouch, True) + #10 +
    'Mobile: ' + BoolToStr(Screen.IsMobile, True) + #10 +
    'Safe area T/R/B/L: ' + IntToStr(Screen.SafeAreaTop) + ' / ' +
      IntToStr(Screen.SafeAreaRight) + ' / ' +
      IntToStr(Screen.SafeAreaBottom) + ' / ' +
      IntToStr(Screen.SafeAreaLeft) + #10 +
    'Viewport mode: ' + VMode;
end;

procedure TMobileEvents.SaveClick(Sender: TObject);
begin
  ShowMessage('Form saved (demo).');
end;

procedure TMobileEvents.ShowFormClick(Sender: TObject);
begin
  ShowPage(0);
end;

procedure TMobileEvents.ShowDataClick(Sender: TObject);
begin
  ShowPage(1);
end;

procedure TMobileEvents.ShowInfoClick(Sender: TObject);
begin
  ShowPage(2);
end;

function AddLabel(AParent: TWinControl; const ACaption: string): TWLabel;
begin
  Result := TWLabel.Create(AParent);
  Result.Parent := AParent;
  Result.Align := alTop;
  Result.Height := 22;
  Result.BorderSpacing.Left := 16;
  Result.BorderSpacing.Right := 16;
  Result.BorderSpacing.Top := 12;
  Result.Caption := ACaption;
  Result.Font.Size := 12;
  Result.Font.Style := [fsBold];
end;

function AddEdit(AParent: TWinControl; const ATextHint: string;
  AType: TEditInputType): TWEdit;
begin
  Result := TWEdit.Create(AParent);
  Result.Parent := AParent;
  Result.Align := alTop;
  Result.Height := 38;
  Result.BorderSpacing.Left := 16;
  Result.BorderSpacing.Right := 16;
  Result.BorderSpacing.Top := 4;
  Result.TextHint := ATextHint;
  Result.InputType := AType;
end;

procedure BuildFormTab(AParent: TWinControl);
var
  VScroll: TWScrollBox;
  VMemo: TWMemo;
  VCheck: TWCheckbox;
  VCombo: TWComboBox;
  VTrack: TWTrackBar;
  VButton: TWButton;
begin
  VScroll := TWScrollBox.Create(AParent);
  VScroll.Parent := AParent;
  VScroll.Align := alClient;

  AddLabel(VScroll, 'Full name');
  AddEdit(VScroll, 'Mario Rossi', itText);
  AddLabel(VScroll, 'Email');
  AddEdit(VScroll, 'name@example.com', itEmail);
  AddLabel(VScroll, 'Phone');
  AddEdit(VScroll, '+39 000 000 0000', itTel);
  AddLabel(VScroll, 'Website');
  AddEdit(VScroll, 'https://example.com', itUrl);

  AddLabel(VScroll, 'Notes');
  VMemo := TWMemo.Create(VScroll);
  VMemo.Parent := VScroll;
  VMemo.Align := alTop;
  VMemo.Height := 90;
  VMemo.BorderSpacing.Left := 16;
  VMemo.BorderSpacing.Right := 16;
  VMemo.BorderSpacing.Top := 4;
  VMemo.TextHint := 'Type here...';

  AddLabel(VScroll, 'Preferences');
  VCombo := TWComboBox.Create(VScroll);
  VCombo.Parent := VScroll;
  VCombo.Align := alTop;
  VCombo.Height := 38;
  VCombo.BorderSpacing.Left := 16;
  VCombo.BorderSpacing.Right := 16;
  VCombo.BorderSpacing.Top := 4;
  VCombo.Items.Add('Standard');
  VCombo.Items.Add('Compact');
  VCombo.Items.Add('Large');
  VCombo.ItemIndex := 0;

  VCheck := TWCheckbox.Create(VScroll);
  VCheck.Parent := VScroll;
  VCheck.Align := alTop;
  VCheck.Height := 32;
  VCheck.BorderSpacing.Left := 16;
  VCheck.BorderSpacing.Top := 8;
  VCheck.Caption := 'Subscribe to updates';
  VCheck.Checked := True;

  AddLabel(VScroll, 'Volume');
  VTrack := TWTrackBar.Create(VScroll);
  VTrack.Parent := VScroll;
  VTrack.Align := alTop;
  VTrack.Height := 40;
  VTrack.BorderSpacing.Left := 16;
  VTrack.BorderSpacing.Right := 16;
  VTrack.Min := 0;
  VTrack.Max := 100;
  VTrack.Position := 40;
  VTrack.Frequency := 10;

  VButton := TWButton.Create(VScroll);
  VButton.Parent := VScroll;
  VButton.Align := alTop;
  VButton.Height := 44;
  VButton.BorderSpacing.Left := 16;
  VButton.BorderSpacing.Right := 16;
  VButton.BorderSpacing.Top := 16;
  VButton.BorderSpacing.Bottom := 16;
  VButton.Caption := 'Save';
  VButton.OnClick := @FEvents.SaveClick;
end;

function BuildRows: TJSArray;

  procedure AddRow(const AName, ACity: string; AAge: NativeInt);
  var
    VRow: TJSObject;
  begin
    VRow := TJSObject.New;
    VRow['Name'] := AName;
    VRow['City'] := ACity;
    VRow['Age'] := AAge;
    Result.Push(VRow);
  end;

begin
  Result := TJSArray.New;
  AddRow('Mario Rossi', 'Rome', 30);
  AddRow('Elena Blu', 'Rome', 31);
  AddRow('Luigi Bianchi', 'Milan', 25);
  AddRow('Anna Verdi', 'Naples', 28);
  AddRow('Sara Neri', 'Florence', 35);
  AddRow('Paolo Rosa', 'Turin', 38);
end;

procedure BuildDataTab(AParent: TWinControl);
var
  VGrid: TWDataGrid;
begin
  VGrid := TWDataGrid.Create(AParent);
  VGrid.Parent := AParent;
  VGrid.Align := alClient;
  VGrid.BorderSpacing.Around := 10;
  VGrid.FilterBox := True;
  VGrid.ColumnClickSorts := True;
  VGrid.AlternateRowColor := TColor($F2F2F2);
  /// Cards on every width: this is the phone layout.
  VGrid.ResponsiveMode := True;
  VGrid.ResponsiveBreakpoint := 0;
  VGrid.Data := BuildRows;
end;

procedure BuildInfoTab(AParent: TWinControl);
var
  VScroll: TWScrollBox;
  VTitle: TWLabel;
  VHint: TWLabel;
begin
  VScroll := TWScrollBox.Create(AParent);
  VScroll.Parent := AParent;
  VScroll.Align := alClient;

  VTitle := TWLabel.Create(VScroll);
  VTitle.Parent := VScroll;
  VTitle.Align := alTop;
  VTitle.Height := 28;
  VTitle.BorderSpacing.Left := 16;
  VTitle.BorderSpacing.Top := 16;
  VTitle.Caption := 'Runtime information';
  VTitle.Font.Size := 16;
  VTitle.Font.Style := [fsBold];

  FInfo := TWLabel.Create(VScroll);
  FInfo.Parent := VScroll;
  FInfo.Align := alTop;
  FInfo.Height := 150;
  FInfo.AutoSize := False;
  FInfo.WordWrap := True;
  FInfo.BorderSpacing.Left := 16;
  FInfo.BorderSpacing.Right := 16;
  FInfo.BorderSpacing.Top := 8;
  FInfo.Font.Size := 12;
  /// Keep the #10 line breaks of the caption.
  FInfo.HandleElement.Style.SetProperty('white-space', 'pre-line');

  VHint := TWLabel.Create(VScroll);
  VHint.Parent := VScroll;
  VHint.Align := alTop;
  VHint.AutoSize := False;
  VHint.WordWrap := True;
  VHint.Height := 120;
  VHint.BorderSpacing.Left := 16;
  VHint.BorderSpacing.Right := 16;
  VHint.BorderSpacing.Top := 16;
  VHint.Font.Size := 11;
  VHint.Font.Color := clGray;
  VHint.Caption :=
    'This demo uses Align only, no fixed coordinates: the layout follows the ' +
    'window width. On a phone the controls are enlarged by the touch theme ' +
    '(16px inputs, 36px targets) and the form respects the safe area. ' +
    'The page is a PWA: use the browser "Add to Home screen" action.';

  FEvents.UpdateInfo(nil);
end;

procedure BuildTopBar(AForm: TWForm);
var
  VBar: TWPanel;
  VTitle, VSub: TWLabel;
begin
  VBar := TWPanel.Create(AForm);
  VBar.Parent := AForm;
  VBar.Align := alTop;
  VBar.Height := 64;
  VBar.BevelOuter := bvNone;
  VBar.Color := BrandColor;

  VTitle := TWLabel.Create(VBar);
  VTitle.Parent := VBar;
  VTitle.Align := alTop;
  VTitle.Height := 36;
  VTitle.BorderSpacing.Left := 16;
  VTitle.BorderSpacing.Top := 10;
  VTitle.Transparent := True;
  VTitle.Caption := 'WCL Mobile';
  VTitle.Font.Color := clWhite;
  VTitle.Font.Size := 18;
  VTitle.Font.Style := [fsBold];

  VSub := TWLabel.Create(VBar);
  VSub.Parent := VBar;
  VSub.Align := alTop;
  VSub.Height := 18;
  VSub.BorderSpacing.Left := 16;
  VSub.Transparent := True;
  VSub.Caption := 'Responsive demo';
  VSub.Font.Color := clWhite;
  VSub.Font.Size := 11;
  FSubTitle := VSub;
end;

function AddNav(AParent: TWinControl; const ACaption: string;
  AHandler: TNotifyEvent): TWButton;
begin
  Result := TWButton.Create(AParent);
  Result.Parent := AParent;
  Result.Align := alLeft;
  Result.Width := 90;
  Result.Height := 44;
  Result.BorderSpacing.Left := 8;
  Result.BorderSpacing.Top := 8;
  Result.Caption := ACaption;
  Result.OnClick := AHandler;
end;

procedure BuildBottomBar(AForm: TWForm);
var
  VBar: TWPanel;
begin
  VBar := TWPanel.Create(AForm);
  VBar.Parent := AForm;
  VBar.Align := alBottom;
  VBar.Height := 60;
  VBar.BevelOuter := bvNone;
  VBar.Color := clWhite;

  FNav[0] := AddNav(VBar, 'Form', @FEvents.ShowFormClick);
  FNav[1] := AddNav(VBar, 'Data', @FEvents.ShowDataClick);
  FNav[2] := AddNav(VBar, 'Info', @FEvents.ShowInfoClick);
end;

procedure BuildPages(AForm: TWForm);
var
  VSheet: TCustomTabSheet;
begin
  FPages := TWPageControl.Create(AForm);
  FPages.Parent := AForm;
  FPages.Align := alClient;
  /// The bottom bar is the navigation on a phone: no tab strip.
  FPages.ShowTabs := False;

  VSheet := FPages.AddTabSheet;
  VSheet.Caption := 'Form';
  VSheet.SetBounds(0, 0, FPages.Width, FPages.Height);
  BuildFormTab(VSheet);

  VSheet := FPages.AddTabSheet;
  VSheet.Caption := 'Data';
  VSheet.SetBounds(0, 0, FPages.Width, FPages.Height);
  BuildDataTab(VSheet);

  VSheet := FPages.AddTabSheet;
  VSheet.Caption := 'Info';
  VSheet.SetBounds(0, 0, FPages.Width, FPages.Height);
  BuildInfoTab(VSheet);

  ShowPage(0);
end;

procedure BuildMobileApp(AForm: TWForm);
begin
  if (not Assigned(AForm)) then
    Exit;
  AForm.Caption := 'WCL Mobile Demo';
  AForm.Color := clWhite;

  FEvents := TMobileEvents.Create;

  BuildTopBar(AForm);
  BuildBottomBar(AForm);
  BuildPages(AForm);

  Application.OnResize := @FEvents.UpdateInfo;
  FEvents.UpdateInfo(nil);
end;

end.
