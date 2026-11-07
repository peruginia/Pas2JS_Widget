unit Menus;

{$I pas2js_widget.inc}

interface

uses
  Classes,
  SysUtils,
  Types,
  Generics.Collections,
  JS,
  Web,
  Graphics,
  Controls;

const
  scShift = $2000;
  scCtrl = $4000;
  scAlt = $8000;

type
  /// Same encoding as LCL: a virtual key code plus the modifier bits above.
  TShortCut = Word;

  TMainMenu = class;
  TMenuItem = class;
  TMenuItems = class;

  /// Method pointers for the document-level listeners. They are kept in
  /// fields so removeEventListener can detach the very same callbacks.
  TMouseMenuHandler = function(AEvent: TJSMouseEvent): boolean of object;
  TKeyMenuHandler = function(AEvent: TJSKeyBoardEvent): boolean of object;

  { TMenuItem }

  TMenuItem = class(TComponent)
  private
    FCaption: string;
    FChecked: Boolean;
    FEnabled: Boolean;
    FItems: TMenuItems;
    FRadioItem: Boolean;
    FShortCut: TShortCut;
    FVisible: Boolean;
    FOnClick: TNotifyEvent;
    FRoot: TMainMenu;
    procedure SetCaption(const AValue: string);
    procedure SetChecked(AValue: Boolean);
    procedure SetEnabled(AValue: Boolean);
    procedure SetRadioItem(AValue: Boolean);
    procedure SetShortCut(AValue: TShortCut);
    procedure SetVisible(AValue: Boolean);
    procedure MenuChanged;
  protected
    /// The reader creates the nested items with this item as owner, so they
    /// land in this item's list through Notification.
    function GetChildOwner: TComponent; override;
    function GetChildParent: TComponent; override;
    procedure Notification(AComponent: TComponent; Operation: TOperation); override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    procedure Click;
    /// A caption of '-' renders a separator.
    function IsSeparator: Boolean;
    property Items: TMenuItems read FItems;
    property Root: TMainMenu read FRoot;
  published
    property Caption: string read FCaption write SetCaption;
    property Checked: Boolean read FChecked write SetChecked default False;
    property Enabled: Boolean read FEnabled write SetEnabled default True;
    property RadioItem: Boolean read FRadioItem write SetRadioItem default False;
    property ShortCut: TShortCut read FShortCut write SetShortCut default 0;
    property Visible: Boolean read FVisible write SetVisible default True;
    property OnClick: TNotifyEvent read FOnClick write FOnClick;
  end;

  { TMenuItems }

  TMenuItems = class(TPersistent)
  private
    FItems: TList<TMenuItem>;
    FOwnerComponent: TComponent;
    FRoot: TMainMenu;
    function GetCount: NativeInt;
    function GetItem(AIndex: NativeInt): TMenuItem;
  public
    constructor Create(AOwnerComponent: TComponent; ARoot: TMainMenu);
    destructor Destroy; override;
    function Add(const ACaption: string; AOnClick: TNotifyEvent = nil): TMenuItem;
    function AddSeparator: TMenuItem;
    procedure Clear;
    function IndexOf(AItem: TMenuItem): NativeInt;
    /// Used by Notification when the reader (or Add) inserts a child item.
    procedure AddItem(AItem: TMenuItem);
    procedure RemoveItem(AItem: TMenuItem);
    property Count: NativeInt read GetCount;
    property Items[AIndex: NativeInt]: TMenuItem read GetItem; default;
  end;

  { TMenuBar }

  /// The bar created by TMainMenu and parented to the form (Align = alTop).
  TMenuBar = class(TCustomControl)
  private
    FDocClick: TMouseMenuHandler;
    FDocKeyDown: TKeyMenuHandler;
    FMenu: TMainMenu;
    /// Path of the open submenu chain, e.g. '0' or '0-5-1'.
    FOpenPath: string;
    procedure SetMenu(AValue: TMainMenu);
    function GetDataAttr(AElement: TJSElement; const AName: string): string;
    function IsPathOpen(const APath: string): Boolean;
    function ParentPath(const APath: string): string;
    function FindItem(const APath: string): TMenuItem;
    procedure RenderItems(AItems: TMenuItems; const APath: string;
      ALevel: NativeInt; var AHtml: string);
    procedure StartDocTracking;
    procedure StopDocTracking;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
    function HandleClick(AEvent: TJSMouseEvent): boolean; override;
    function HandleDocClick(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleDocKeyDown(AEvent: TJSKeyBoardEvent): boolean; virtual;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    procedure CloseDropdown;
    procedure Render;
    property Menu: TMainMenu read FMenu write SetMenu;
  end;

  { TMainMenu }

  TMainMenu = class(TComponent)
  private
    FBar: TMenuBar;
    FItems: TMenuItems;
    FLeft: NativeInt;
    FTop: NativeInt;
    FOnChange: TNotifyEvent;
    procedure SetOnChange(AValue: TNotifyEvent);
  protected
    /// Nested items are owned by the menu, so they reach Notification.
    function GetChildOwner: TComponent; override;
    function GetChildParent: TComponent; override;
    procedure Notification(AComponent: TComponent; Operation: TOperation); override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    /// Creates the bar (once) and redraws it.
    procedure Update;
    property Bar: TMenuBar read FBar;
    property Items: TMenuItems read FItems;
  published
    /// Only used by the IDE to place the non-visual component on the form.
    property Left: NativeInt read FLeft write FLeft default 0;
    property Top: NativeInt read FTop write FTop default 0;
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
  end;

/// Converts 'Ctrl+S' (and similar) to the numeric shortcut used by the .lfm.
function TextToShortCut(const AText: string): TShortCut;
/// Converts a numeric shortcut back to text, for display.
function ShortCutToText(AShortCut: TShortCut): string;

implementation

const
  MenuRules =
    '.wcl-menubar-items{display:flex;align-items:stretch;height:100%;' +
    'font:13px system-ui,-apple-system,Segoe UI,sans-serif}' +
    '.wcl-menubar-item{position:relative;display:flex;align-items:center;' +
    'padding:0 12px;cursor:pointer;color:#222;user-select:none;white-space:nowrap}' +
    '.wcl-menubar-item:hover{background:#e8e8e8}' +
    '.wcl-menubar-item.wcl-open{background:#dcdcdc}' +
    '.wcl-menubar-drop{position:absolute;top:100%;left:0;min-width:190px;' +
    'background:#fff;color:#222;border:1px solid #c9c3ba;box-shadow:0 4px 12px rgba(0,0,0,.18);' +
    'padding:4px 0;z-index:1000}' +
    '.wcl-menubar-entry{position:relative;display:flex;align-items:center;gap:16px;' +
    'justify-content:space-between;padding:6px 14px;cursor:pointer;white-space:nowrap}' +
    '.wcl-menubar-entry:hover{background:#2a7efe;color:#fff}' +
    '.wcl-menubar-entry.wcl-disabled{color:#aaa;pointer-events:none}' +
    '.wcl-menubar-entry.wcl-has-sub::after{content:"\25B8";font-size:10px;color:#888;margin-left:8px}' +
    '.wcl-menubar-entry:hover.wcl-has-sub::after{color:#fff}' +
    '.wcl-menubar-entry .wcl-menubar-drop{left:100%;top:-5px}' +
    '.wcl-menubar-sep{height:1px;background:#ddd;margin:4px 0}' +
    '.wcl-menubar-shortcut{color:#888;font-size:12px}' +
    '.wcl-menubar-entry:hover .wcl-menubar-shortcut{color:#eee}';

var
  _MenuRulesRegistered: Boolean = False;

procedure _RegisterMenuRules;
begin
  if not _MenuRulesRegistered then
  begin
    _MenuRulesRegistered := True;
    RegisterWCLStyle(MenuRules);
  end;
end;

function EscapeMenuText(const AText: string): string;
begin
  Result := StringReplace(AText, '&', '&amp;', [rfReplaceAll]);
  Result := StringReplace(Result, '<', '&lt;', [rfReplaceAll]);
  Result := StringReplace(Result, '>', '&gt;', [rfReplaceAll]);
  Result := StringReplace(Result, '"', '&quot;', [rfReplaceAll]);
end;

function KeyNameToCode(const AName: string): Word;
var
  VNumber: NativeInt;
begin
  Result := 0;
  if (Length(AName) = 1) then
    Exit(Ord(AName[1]));
  if (AName = 'ESC') then Exit(27);
  if (AName = 'ENTER') then Exit(13);
  if (AName = 'TAB') then Exit(9);
  if (AName = 'SPACE') then Exit(32);
  if (AName = 'BACKSPACE') then Exit(8);
  if (AName = 'DELETE') then Exit(46);
  if (AName = 'INSERT') then Exit(45);
  if (AName = 'HOME') then Exit(36);
  if (AName = 'END') then Exit(35);
  if (AName = 'PAGEUP') then Exit(33);
  if (AName = 'PAGEDOWN') then Exit(34);
  if (AName = 'LEFT') then Exit(37);
  if (AName = 'UP') then Exit(38);
  if (AName = 'RIGHT') then Exit(39);
  if (AName = 'DOWN') then Exit(40);
  if (Copy(AName, 1, 1) = 'F') then
  begin
    VNumber := StrToIntDef(Copy(AName, 2, MaxInt), 0);
    if (VNumber >= 1) and (VNumber <= 12) then
      Exit(111 + VNumber);   // VK_F1 = 112
  end;
end;

function TextToShortCut(const AText: string): TShortCut;
var
  VRest: string;
  VPart: string;
  VPos: NativeInt;
begin
  Result := 0;
  VRest := UpperCase(Trim(AText));
  if (VRest = '') then
    Exit;
  while True do
  begin
    VPos := Pos('+', VRest);
    if (VPos = 0) then
      Break;
    VPart := Trim(Copy(VRest, 1, VPos - 1));
    if (VPart = 'CTRL') or (VPart = 'CONTROL') then
      Result := Result or scCtrl
    else if (VPart = 'SHIFT') then
      Result := Result or scShift
    else if (VPart = 'ALT') then
      Result := Result or scAlt;
    VRest := Copy(VRest, VPos + 1, MaxInt);
  end;
  Result := Result or KeyNameToCode(Trim(VRest));
end;

function ShortCutToText(AShortCut: TShortCut): string;
var
  VCode: Word;
  VName: string;
begin
  Result := '';
  if (AShortCut = 0) then
    Exit;
  VCode := AShortCut and $0FFF;
  if (AShortCut and scCtrl) <> 0 then
    Result := 'Ctrl+';
  if (AShortCut and scShift) <> 0 then
    Result := Result + 'Shift+';
  if (AShortCut and scAlt) <> 0 then
    Result := Result + 'Alt+';
  case VCode of
    27: VName := 'Esc';
    13: VName := 'Enter';
    9: VName := 'Tab';
    32: VName := 'Space';
    8: VName := 'Backspace';
    46: VName := 'Delete';
    45: VName := 'Insert';
    36: VName := 'Home';
    35: VName := 'End';
    33: VName := 'PageUp';
    34: VName := 'PageDown';
    37: VName := 'Left';
    38: VName := 'Up';
    39: VName := 'Right';
    40: VName := 'Down';
  else
    if (VCode >= 112) and (VCode <= 123) then
      VName := 'F' + IntToStr(VCode - 111)
    else if (VCode >= 32) and (VCode < 127) then
      VName := Chr(VCode)
    else
      VName := '';
  end;
  Result := Result + VName;
end;

{ TMenuItem }

constructor TMenuItem.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FChecked := False;
  FEnabled := True;
  FRadioItem := False;
  FVisible := True;
  FCaption := '';
  FShortCut := 0;
  FRoot := nil;
  if (AOwner is TMenuItem) then
    FRoot := TMenuItem(AOwner).Root
  else if (AOwner is TMainMenu) then
    FRoot := TMainMenu(AOwner);
  FItems := TMenuItems.Create(Self, FRoot);
end;

destructor TMenuItem.Destroy;
begin
  FItems.Free;
  FItems := nil;
  inherited Destroy;
end;

function TMenuItem.GetChildOwner: TComponent;
begin
  /// Nested menu items are owned by their parent item.
  Result := Self;
end;

function TMenuItem.GetChildParent: TComponent;
begin
  Result := nil;
end;

procedure TMenuItem.Notification(AComponent: TComponent; Operation: TOperation);
begin
  inherited Notification(AComponent, Operation);
  if (AComponent is TMenuItem) and Assigned(FItems) and (AComponent.Owner = Self) then
  begin
    if (Operation = opInsert) then
      FItems.AddItem(TMenuItem(AComponent))
    else
      FItems.RemoveItem(TMenuItem(AComponent));
  end;
end;

function TMenuItem.IsSeparator: Boolean;
begin
  Result := (Trim(FCaption) = '-');
end;

procedure TMenuItem.Click;
begin
  if (not FEnabled) then
    Exit;
  if Assigned(FOnClick) then
    FOnClick(Self);
end;

procedure TMenuItem.MenuChanged;
begin
  if Assigned(FRoot) then
    FRoot.Update;
end;

procedure TMenuItem.SetCaption(const AValue: string);
begin
  if (FCaption <> AValue) then
  begin
    FCaption := AValue;
    MenuChanged;
  end;
end;

procedure TMenuItem.SetChecked(AValue: Boolean);
begin
  if (FChecked <> AValue) then
  begin
    FChecked := AValue;
    MenuChanged;
  end;
end;

procedure TMenuItem.SetEnabled(AValue: Boolean);
begin
  if (FEnabled <> AValue) then
  begin
    FEnabled := AValue;
    MenuChanged;
  end;
end;

procedure TMenuItem.SetRadioItem(AValue: Boolean);
begin
  if (FRadioItem <> AValue) then
  begin
    FRadioItem := AValue;
    MenuChanged;
  end;
end;

procedure TMenuItem.SetShortCut(AValue: TShortCut);
begin
  if (FShortCut <> AValue) then
  begin
    FShortCut := AValue;
    MenuChanged;
  end;
end;

procedure TMenuItem.SetVisible(AValue: Boolean);
begin
  if (FVisible <> AValue) then
  begin
    FVisible := AValue;
    MenuChanged;
  end;
end;

{ TMenuItems }

constructor TMenuItems.Create(AOwnerComponent: TComponent; ARoot: TMainMenu);
begin
  inherited Create;
  FOwnerComponent := AOwnerComponent;
  FRoot := ARoot;
  FItems := TList<TMenuItem>.Create;
end;

destructor TMenuItems.Destroy;
begin
  /// The items are owned by their parent component, which frees them.
  FItems.Free;
  FItems := nil;
  inherited Destroy;
end;

function TMenuItems.GetCount: NativeInt;
begin
  Result := FItems.Count;
end;

function TMenuItems.GetItem(AIndex: NativeInt): TMenuItem;
begin
  if (AIndex >= 0) and (AIndex < FItems.Count) then
    Result := FItems[AIndex]
  else
    Result := nil;
end;

function TMenuItems.IndexOf(AItem: TMenuItem): NativeInt;
begin
  Result := FItems.IndexOf(AItem);
end;

procedure TMenuItems.AddItem(AItem: TMenuItem);
begin
  if Assigned(AItem) and (FItems.IndexOf(AItem) < 0) then
    FItems.Add(AItem);
end;

procedure TMenuItems.RemoveItem(AItem: TMenuItem);
var
  VIndex: NativeInt;
begin
  VIndex := FItems.IndexOf(AItem);
  if (VIndex >= 0) then
    FItems.Delete(VIndex);
end;

function TMenuItems.Add(const ACaption: string; AOnClick: TNotifyEvent): TMenuItem;
begin
  /// Creating with the owner set makes the parent add the item to its list
  /// through Notification, so the same path serves code and .lfm streaming.
  Result := TMenuItem.Create(FOwnerComponent);
  Result.FRoot := FRoot;
  Result.FCaption := ACaption;
  Result.FOnClick := AOnClick;
  if Assigned(FRoot) then
    FRoot.Update;
end;

function TMenuItems.AddSeparator: TMenuItem;
begin
  Result := Add('-');
end;

procedure TMenuItems.Clear;
var
  VItem: TMenuItem;
begin
  while (FItems.Count > 0) do
  begin
    VItem := FItems[0];
    VItem.Free;
  end;
end;

{ TMenuBar }

constructor TMenuBar.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FDocClick := @HandleDocClick;
  FDocKeyDown := @HandleDocKeyDown;
  FMenu := nil;
  FOpenPath := '';
  _RegisterMenuRules;
  BeginUpdate;
  try
    Color := clWhite;
    Height := 26;
  finally
    EndUpdate;
  end;
end;

destructor TMenuBar.Destroy;
begin
  StopDocTracking;
  inherited Destroy;
end;

function TMenuBar.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
end;

{$push}
{$hints off}

function TMenuBar.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  Result := False;
end;

{$pop}

procedure TMenuBar.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and ([csLoading, csDestroying] * ComponentState = []) then
    /// The dropdown is absolutely positioned below the bar and must not be clipped.
    HandleElement.Style.SetProperty('overflow', 'visible');
end;

procedure TMenuBar.SetMenu(AValue: TMainMenu);
begin
  FMenu := AValue;
  Render;
end;

function TMenuBar.GetDataAttr(AElement: TJSElement; const AName: string): string;
begin
  Result := '';
  if (AElement is TJSHTMLElement) then
  begin
    Result := TJSHTMLElement(AElement).getAttribute(AName);
    if (Result = Null) then
      Result := '';
  end;
end;

procedure TMenuBar.StartDocTracking;
begin
  /// Capture phase: the click must reach the bar handler first, and clicks
  /// outside must close the dropdown even when a control stops propagation.
  asm
    document.addEventListener('click', this.FDocClick, true);
    document.addEventListener('keydown', this.FDocKeyDown, true);
  end;
end;

procedure TMenuBar.StopDocTracking;
begin
  asm
    document.removeEventListener('click', this.FDocClick, true);
    document.removeEventListener('keydown', this.FDocKeyDown, true);
  end;
end;

procedure TMenuBar.CloseDropdown;
begin
  if (FOpenPath = '') then
    Exit;
  FOpenPath := '';
  StopDocTracking();
  Render;
end;

function TMenuBar.IsPathOpen(const APath: string): Boolean;
begin
  Result := (FOpenPath = APath) or
    (Copy(FOpenPath, 1, Length(APath) + 1) = APath + '-');
end;

function TMenuBar.ParentPath(const APath: string): string;
var
  VPos: NativeInt;
begin
  VPos := LastDelimiter('-', APath);
  if (VPos = 0) then
    Result := ''
  else
    Result := Copy(APath, 1, VPos - 1);
end;

function TMenuBar.FindItem(const APath: string): TMenuItem;
var
  VRest: string;
  VPart: string;
  VPos: NativeInt;
  VItems: TMenuItems;
  VItem: TMenuItem;
begin
  Result := nil;
  if (not Assigned(FMenu)) or (APath = '') then
    Exit;
  VItems := FMenu.Items;
  VRest := APath;
  VItem := nil;
  while (VRest <> '') do
  begin
    VPos := Pos('-', VRest);
    if (VPos = 0) then
    begin
      VPart := VRest;
      VRest := '';
    end
    else
    begin
      VPart := Copy(VRest, 1, VPos - 1);
      VRest := Copy(VRest, VPos + 1, MaxInt);
    end;
    if (not Assigned(VItems)) then
      Exit;
    VItem := VItems[StrToIntDef(VPart, -1)];
    if (not Assigned(VItem)) then
      Exit;
    VItems := VItem.Items;
  end;
  Result := VItem;
end;

procedure TMenuBar.RenderItems(AItems: TMenuItems; const APath: string;
  ALevel: NativeInt; var AHtml: string);
var
  VIndex: NativeInt;
  VItem: TMenuItem;
  VClass: string;
  VCheck: string;
  VShortCut: string;
  VPath: string;
begin
  if (not Assigned(AItems)) then
    Exit;
  for VIndex := 0 to (AItems.Count - 1) do
  begin
    VItem := AItems[VIndex];
    if (not Assigned(VItem)) or (not VItem.Visible) then
      Continue;
    if VItem.IsSeparator then
    begin
      AHtml := AHtml + '<div class="wcl-menubar-sep"></div>';
      Continue;
    end;
    VPath := IntToStr(VIndex);
    if (APath <> '') then
      VPath := APath + '-' + VPath;
    VClass := 'wcl-menubar-entry';
    if (not VItem.Enabled) then
      VClass := VClass + ' wcl-disabled';
    if (VItem.Items.Count > 0) then
      VClass := VClass + ' wcl-has-sub';
    VCheck := '';
    if VItem.Checked or VItem.RadioItem then
      VCheck := '&#10003; ';
    AHtml := AHtml + '<div class="' + VClass + '" data-path="' + VPath + '">' +
      '<span>' + VCheck + EscapeMenuText(VItem.Caption) + '</span>';
    VShortCut := ShortCutToText(VItem.ShortCut);
    if (VShortCut <> '') then
      AHtml := AHtml + '<span class="wcl-menubar-shortcut">' +
        EscapeMenuText(VShortCut) + '</span>';
    if (VItem.Items.Count > 0) and IsPathOpen(VPath) then
    begin
      AHtml := AHtml + '<div class="wcl-menubar-drop">';
      RenderItems(VItem.Items, VPath, ALevel + 1, AHtml);
      AHtml := AHtml + '</div>';
    end;
    AHtml := AHtml + '</div>';
  end;
end;

procedure TMenuBar.Render;
var
  VHtml: string;
  VIndex: NativeInt;
  VItem: TMenuItem;
  VClass: string;
  VPath: string;
begin
  if (not Assigned(FMenu)) then
    Exit;
  _RegisterMenuRules;
  VHtml := '<div class="wcl-menubar-items">';
  for VIndex := 0 to (FMenu.Items.Count - 1) do
  begin
    VItem := FMenu.Items[VIndex];
    if (not Assigned(VItem)) or (not VItem.Visible) then
      Continue;
    VPath := IntToStr(VIndex);
    VClass := 'wcl-menubar-item';
    if IsPathOpen(VPath) then
      VClass := VClass + ' wcl-open';
    VHtml := VHtml + '<div class="' + VClass + '" data-path="' + VPath + '">' +
      EscapeMenuText(VItem.Caption);
    if (VItem.Items.Count > 0) and IsPathOpen(VPath) then
    begin
      VHtml := VHtml + '<div class="wcl-menubar-drop">';
      RenderItems(VItem.Items, VPath, 1, VHtml);
      VHtml := VHtml + '</div>';
    end;
    VHtml := VHtml + '</div>';
  end;
  VHtml := VHtml + '</div>';
  HandleElement.InnerHTML := VHtml;
end;

function TMenuBar.HandleClick(AEvent: TJSMouseEvent): boolean;
var
  VElement: TJSElement;
  VPath: string;
  VItem: TMenuItem;
begin
  Result := inherited HandleClick(AEvent);
  if (not Assigned(FMenu)) then
    Exit;
  VElement := AEvent.targetElement;
  while Assigned(VElement) and (VElement <> HandleElement) do
  begin
    VPath := GetDataAttr(VElement, 'data-path');
    if (VPath <> '') then
    begin
      VItem := FindItem(VPath);
      if Assigned(VItem) and (VItem.Items.Count > 0) then
      begin
        /// Submenu: open it, or close it and keep the parent open.
        if IsPathOpen(VPath) and (FOpenPath = VPath) then
          FOpenPath := ParentPath(VPath)
        else
          FOpenPath := VPath;
        Render;
        StartDocTracking;
      end
      else
      begin
        FOpenPath := '';
        StopDocTracking();
        Render;
        if Assigned(VItem) then
          VItem.Click;
      end;
      Result := True;
      Exit;
    end;
    VElement := VElement.parentElement;
  end;
end;

function TMenuBar.HandleDocClick(AEvent: TJSMouseEvent): boolean;
var
  VTarget: TJSElement;
begin
  Result := False;
  if (FOpenPath = '') then
    Exit;
  VTarget := AEvent.targetElement;
  if Assigned(VTarget) and HandleElement.Contains(VTarget) then
    Exit;
  CloseDropdown;
  Result := True;
end;

function TMenuBar.HandleDocKeyDown(AEvent: TJSKeyBoardEvent): boolean;
begin
  Result := False;
  if (FOpenPath = '') then
    Exit;
  if (AEvent.key = 'Escape') then
  begin
    CloseDropdown;
    Result := True;
  end;
end;

class function TMenuBar.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 300;
  Result.Cy := 26;
end;

{ TMainMenu }

constructor TMainMenu.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FBar := nil;
  FLeft := 0;
  FTop := 0;
  FItems := TMenuItems.Create(Self, Self);
  Update;
end;

destructor TMainMenu.Destroy;
begin
  FItems.Free;
  FItems := nil;
  if Assigned(FBar) then
  begin
    FBar.Menu := nil;
    FBar.Free;
    FBar := nil;
  end;
  inherited Destroy;
end;

function TMainMenu.GetChildOwner: TComponent;
begin
  Result := Self;
end;

function TMainMenu.GetChildParent: TComponent;
begin
  Result := nil;
end;

procedure TMainMenu.Notification(AComponent: TComponent; Operation: TOperation);
begin
  inherited Notification(AComponent, Operation);
  if (AComponent is TMenuItem) and Assigned(FItems) then
  begin
    if (Operation = opInsert) then
      FItems.AddItem(TMenuItem(AComponent))
    else
      FItems.RemoveItem(TMenuItem(AComponent));
  end;
end;

procedure TMainMenu.SetOnChange(AValue: TNotifyEvent);
begin
  FOnChange := AValue;
end;

procedure TMainMenu.Update;
var
  VParent: TWinControl;
begin
  if (not Assigned(FBar)) and (Owner is TWinControl) then
  begin
    VParent := TWinControl(Owner);
    FBar := TMenuBar.Create(Self);
    FBar.Parent := VParent;
    FBar.Align := alTop;
    FBar.Height := 26;
    FBar.Menu := Self;
  end;
  if Assigned(FBar) then
    FBar.Render;
  if Assigned(FOnChange) then
    FOnChange(Self);
end;

initialization
  /// Lets the .lfm reader resolve the nested "object X: TMenuItem" blocks
  /// without the form having to declare a field for every item.
  RegisterClass(TMenuItem);

end.
