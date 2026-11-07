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

type
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
    FShortCut: string;
    FVisible: Boolean;
    FOnClick: TNotifyEvent;
    FRoot: TMainMenu;
    procedure SetCaption(const AValue: string);
    procedure SetChecked(AValue: Boolean);
    procedure SetEnabled(AValue: Boolean);
    procedure SetRadioItem(AValue: Boolean);
    procedure SetShortCut(const AValue: string);
    procedure SetVisible(AValue: Boolean);
    procedure MenuChanged;
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
    property ShortCut: string read FShortCut write SetShortCut;
    property Visible: Boolean read FVisible write SetVisible default True;
    property OnClick: TNotifyEvent read FOnClick write FOnClick;
  end;

  { TMenuItems }

  TMenuItems = class(TPersistent)
  private
    FItems: TList<TMenuItem>;
    FOwnerItem: TMenuItem;
    FRoot: TMainMenu;
    function GetCount: NativeInt;
    function GetItem(AIndex: NativeInt): TMenuItem;
  public
    constructor Create(AOwnerItem: TMenuItem; ARoot: TMainMenu);
    destructor Destroy; override;
    function Add(const ACaption: string; AOnClick: TNotifyEvent = nil): TMenuItem;
    function AddSeparator: TMenuItem;
    procedure Clear;
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
    FOpenIndex: NativeInt;
    procedure SetMenu(AValue: TMainMenu);
    function GetDataAttr(AElement: TJSElement; const AName: string): string;
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
    property OpenIndex: NativeInt read FOpenIndex;
  end;

  { TMainMenu }

  TMainMenu = class(TComponent)
  private
    FBar: TMenuBar;
    FItems: TMenuItems;
    FOnChange: TNotifyEvent;
    procedure SetOnChange(AValue: TNotifyEvent);
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    /// Creates the bar (once) and redraws it.
    procedure Update;
    property Bar: TMenuBar read FBar;
    property Items: TMenuItems read FItems;
  published
    property OnChange: TNotifyEvent read FOnChange write SetOnChange;
  end;

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
    'background:#fff;border:1px solid #c9c3ba;box-shadow:0 4px 12px rgba(0,0,0,.18);' +
    'padding:4px 0;z-index:1000}' +
    '.wcl-menubar-entry{display:flex;align-items:center;gap:16px;' +
    'justify-content:space-between;padding:6px 14px;cursor:pointer;white-space:nowrap}' +
    '.wcl-menubar-entry:hover{background:#2a7efe;color:#fff}' +
    '.wcl-menubar-entry.wcl-disabled{color:#aaa;pointer-events:none}' +
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

{ TMenuItem }

constructor TMenuItem.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FChecked := False;
  FEnabled := True;
  FRadioItem := False;
  FVisible := True;
  FCaption := '';
  FShortCut := '';
  if (AOwner is TMenuItem) then
    FRoot := TMenuItem(AOwner).Root;
  FItems := TMenuItems.Create(Self, FRoot);
end;

destructor TMenuItem.Destroy;
begin
  FItems.Free;
  FItems := nil;
  inherited Destroy;
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

procedure TMenuItem.SetShortCut(const AValue: string);
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

constructor TMenuItems.Create(AOwnerItem: TMenuItem; ARoot: TMainMenu);
begin
  inherited Create;
  FOwnerItem := AOwnerItem;
  FRoot := ARoot;
  FItems := TList<TMenuItem>.Create;
end;

destructor TMenuItems.Destroy;
begin
  Clear;
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

function TMenuItems.Add(const ACaption: string; AOnClick: TNotifyEvent): TMenuItem;
begin
  Result := TMenuItem.Create(FOwnerItem);
  Result.FRoot := FRoot;
  Result.FCaption := ACaption;
  Result.FOnClick := AOnClick;
  FItems.Add(Result);
  if Assigned(FRoot) then
    FRoot.Update;
end;

function TMenuItems.AddSeparator: TMenuItem;
begin
  Result := Add('-');
end;

procedure TMenuItems.Clear;
var
  VIndex: NativeInt;
  VItem: TMenuItem;
begin
  for VIndex := (FItems.Count - 1) downto 0 do
  begin
    VItem := FItems[VIndex];
    VItem.Free;
  end;
  FItems.Clear;
end;

{ TMenuBar }

constructor TMenuBar.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FDocClick := @HandleDocClick;
  FDocKeyDown := @HandleDocKeyDown;
  FMenu := nil;
  FOpenIndex := -1;
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
  if (FOpenIndex < 0) then
    Exit;
  FOpenIndex := -1;
  StopDocTracking();
  Render;
end;

procedure TMenuBar.Render;
var
  VHtml: string;
  VIndex, VSubIndex: NativeInt;
  VItem, VSub: TMenuItem;
  VClass: string;
  VCheck: string;
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
    VClass := 'wcl-menubar-item';
    if (VIndex = FOpenIndex) then
      VClass := VClass + ' wcl-open';
    VHtml := VHtml + '<div class="' + VClass + '" data-i="' + IntToStr(VIndex) + '">' +
      EscapeMenuText(VItem.Caption);
    if (VIndex = FOpenIndex) and (VItem.Items.Count > 0) then
    begin
      VHtml := VHtml + '<div class="wcl-menubar-drop">';
      for VSubIndex := 0 to (VItem.Items.Count - 1) do
      begin
        VSub := VItem.Items[VSubIndex];
        if (not Assigned(VSub)) or (not VSub.Visible) then
          Continue;
        if VSub.IsSeparator then
        begin
          VHtml := VHtml + '<div class="wcl-menubar-sep"></div>';
          Continue;
        end;
        VClass := 'wcl-menubar-entry';
        if (not VSub.Enabled) then
          VClass := VClass + ' wcl-disabled';
        VCheck := '';
        if VSub.Checked or VSub.RadioItem then
          VCheck := '&#10003; ';
        VHtml := VHtml + '<div class="' + VClass + '" data-i="' + IntToStr(VIndex) +
          '" data-j="' + IntToStr(VSubIndex) + '">' +
          '<span>' + VCheck + EscapeMenuText(VSub.Caption) + '</span>';
        if (VSub.ShortCut <> '') then
          VHtml := VHtml + '<span class="wcl-menubar-shortcut">' +
            EscapeMenuText(VSub.ShortCut) + '</span>';
        VHtml := VHtml + '</div>';
      end;
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
  VIndex: string;
  VSubIndex: string;
  VItem: TMenuItem;
  VSub: TMenuItem;
  VNumber: NativeInt;
begin
  Result := inherited HandleClick(AEvent);
  if (not Assigned(FMenu)) then
    Exit;
  VElement := AEvent.targetElement;
  while Assigned(VElement) and (VElement <> HandleElement) do
  begin
    VSubIndex := GetDataAttr(VElement, 'data-j');
    VIndex := GetDataAttr(VElement, 'data-i');
    if (VSubIndex <> '') and (VIndex <> '') then
    begin
      VNumber := StrToIntDef(VIndex, -1);
      VItem := FMenu.Items[VNumber];
      if Assigned(VItem) then
      begin
        VSub := VItem.Items[StrToIntDef(VSubIndex, -1)];
        CloseDropdown;
        if Assigned(VSub) then
          VSub.Click;
      end
      else
        CloseDropdown;
      Result := True;
      Exit;
    end;
    if (VIndex <> '') then
    begin
      VNumber := StrToIntDef(VIndex, -1);
      if (VNumber = FOpenIndex) then
        CloseDropdown
      else if (VNumber >= 0) and (VNumber < FMenu.Items.Count) then
      begin
        FOpenIndex := VNumber;
        Render;
        StartDocTracking;
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
  if (FOpenIndex < 0) then
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
  if (FOpenIndex < 0) then
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
  FItems := TMenuItems.Create(nil, Self);
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

end.
