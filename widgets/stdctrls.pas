{
  MIT License

  Copyright (c) 2018 Hélio S. Ribeiro and Anderson J. Gado da Silva

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
}
unit StdCtrls;

{$I pas2js_widget.inc}

interface

uses
  Classes,
  SysUtils,
  Types,
  Web,
  WebExtra,
  Graphics,
  Controls,
  Forms;

type
  TEditCharCase = (ecNormal, ecUppercase, ecLowerCase);

  /// HTML input type for TWEdit; selects the mobile keyboard and validation.
  TEditInputType = (itText, itEmail, itTel, itUrl, itSearch);

  TScrollStyle = (ssNone, ssHorizontal, ssVertical, ssBoth,
    ssAutoHorizontal, ssAutoVertical, ssAutoBoth);

  TScrollBarKind = (sbHorizontal, sbVertical);
  TScrollBarInc = 1..32768;
  TScrollCode = (scLineUp, scLineDown, scPageUp, scPageDown, scPosition,
    scTrack, scTop, scBottom, scEndScroll);
  TScrollEvent = procedure(Sender: TObject; ScrollCode: TScrollCode;
    var ScrollPos: Integer) of object;

  { TCustomScrollBar }

  TCustomScrollBar = class(TWinControl)
  private
    FInput: TJSHTMLInputElement;
    FKind: TScrollBarKind;
    FLargeChange: TScrollBarInc;
    FMax: Integer;
    FMin: Integer;
    FOnChange: TNotifyEvent;
    FOnScroll: TScrollEvent;
    FPageSize: Integer;
    FPosition: Integer;
    FSmallChange: TScrollBarInc;
    procedure SetKind(AValue: TScrollBarKind);
    procedure SetLargeChange(AValue: TScrollBarInc);
    procedure SetMax(AValue: Integer);
    procedure SetMin(AValue: Integer);
    procedure SetPageSize(AValue: Integer);
    procedure SetPosition(AValue: Integer);
    procedure SetSmallChange(AValue: TScrollBarInc);
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure RegisterHandleEvents; override;
    procedure UnRegisterHandleEvents; override;
    function HandleInput(AEvent: TJSEvent): boolean; virtual;
    procedure Change; virtual;
    procedure Scroll(AScrollCode: TScrollCode; var AScrollPos: Integer); virtual;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    procedure SetParams(APosition, AMin, AMax, APageSize: Integer); overload;
    procedure SetParams(APosition, AMin, AMax: Integer); overload;
    property Kind: TScrollBarKind read FKind write SetKind default sbHorizontal;
    property LargeChange: TScrollBarInc read FLargeChange write SetLargeChange default 1;
    property Max: Integer read FMax write SetMax default 100;
    property Min: Integer read FMin write SetMin default 0;
    property PageSize: Integer read FPageSize write SetPageSize;
    property Position: Integer read FPosition write SetPosition default 0;
    property SmallChange: TScrollBarInc read FSmallChange write SetSmallChange default 1;
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
    property OnScroll: TScrollEvent read FOnScroll write FOnScroll;
  end;

  { TScrollBar }

  TScrollBar = class(TCustomScrollBar)
  published
    property Align;
    property Anchors;
    property BorderSpacing;
    property Color;
    property Constraints;
    property Enabled;
    property Font;
    property HandleClass;
    property HandleId;
    property Height;
    property Kind;
    property LargeChange;
    property Left;
    property Max;
    property Min;
    property PageSize;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property PopupMenu;
    property Position;
    property ShowHint;
    property SmallChange;
    property TabOrder;
    property TabStop;
    property Top;
    property Visible;
    property Width;
    property OnChange;
    property OnEnter;
    property OnExit;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
    property OnScroll;
  end;

  TComboBoxStyle = (csDropDown, csDropDownList, csOwnerDrawFixed,
    csOwnerDrawVariable, csSimple);

    { TCustomComboBox }

  TCustomComboBox = class(TWinControl)
  private
    FColumns: NativeInt;
    FDropDownCount: integer;
    FItemHeight: NativeInt;
    FItemIndex: NativeInt;
    FItems: TStrings;
    FHighlightIndex: NativeInt;
    FListElement: TJSHTMLElement;
    FListId: string;
    FOnChange: TNotifyEvent;
    FOpen: Boolean;
    FSorted: boolean;
    FStyle: TComboBoxStyle;
    FTopIndex: NativeInt;
    procedure CloseDropDown;
    procedure OpenDropDown;
    procedure ToggleDropDown;
    procedure UpdateHighlight;
    procedure SelectIndex(AIndex: NativeInt; AFireChange: Boolean);
    procedure SetColumns(AValue: NativeInt);
    procedure SetDropDownCount(AValue: integer);
    procedure SetItemHeight(AValue: NativeInt);
    procedure SetItemIndex(AValue: NativeInt);
    procedure SetItems(AValue: TStrings);
    procedure SetSorted(AValue: boolean);
    procedure SetStyle(AValue: TComboBoxStyle);
    procedure SetTopIndex(AValue: NativeInt);
  private
    procedure ItemsChange(ASender: TObject);
  protected
    procedure Change; virtual;
  protected
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
  protected
    function HandleClick(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleDocumentClick(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleInput(AEvent: TJSEvent): boolean; virtual;
    function HandleItemClick(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleKeyDown(AEvent: TJSKeyBoardEvent): boolean; virtual;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure RegisterHandleEvents; override;
    procedure UnRegisterHandleEvents; override;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
    function RealGetText: string; override;
    procedure RealSetText(const AValue: string); override;
    procedure UpdateSorted; virtual;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    procedure AddItem(const AItem: string; AObject: TObject); virtual;
    procedure Append(const AItem: string);
    procedure Clear; virtual;
    property Columns: NativeInt read FColumns write SetColumns default 0;
    property DropDownCount: integer read FDropDownCount write SetDropDownCount;
    property ItemHeight: NativeInt read FItemHeight write SetItemHeight;
    property ItemIndex: NativeInt read FItemIndex write SetItemIndex;
    property Items: TStrings read FItems write SetItems;
    property Sorted: boolean read FSorted write SetSorted;
    property Style: TComboBoxStyle read FStyle write SetStyle default csDropDown;
    property TopIndex: NativeInt read FTopIndex write SetTopIndex default 0;
  end;

{ TCustomListBox }

  TSelectionChangeEvent = procedure(Sender: TObject; User: boolean) of object;

  TCustomListBox = class(TWinControl)
  private
    FColumns: NativeInt;
    FItemHeight: NativeInt;
    FItemIndex: NativeInt;
    FItems: TStrings;
    FMultiSelect: Boolean;
    FSelectionChanged: Boolean;
    FSelected: array of Boolean;
    FSorted: Boolean;
    FTopIndex: NativeInt;
    FOnSelectionChange: TSelectionChangeEvent;
    function GetSelCount: integer;
    function GetSelected(Index: Integer): Boolean;
    procedure SetColumns(AValue: NativeInt);
    procedure SetItemHeight(AValue: NativeInt);
    procedure SetItemIndex(AValue: NativeInt);
    procedure SetItems(AValue: TStrings);
    procedure SetMultiSelect(AValue: Boolean);
    procedure SetSelected(Index: Integer; AValue: Boolean);
    procedure SetSorted(AValue: Boolean);
    procedure SetTopIndex(AValue: NativeInt);
  private
    procedure ItemsChanged(ASender: TObject);
  protected
    procedure SelectionChange(AUser: Boolean); virtual;
  protected
    function HandleChange(AEvent: TJSEvent): boolean; virtual;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure RegisterHandleEvents; override;
    procedure UnRegisterHandleEvents; override;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
    procedure UpdateSorted; virtual;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    procedure AddItem(const AItem: String; AObject: TObject); virtual;
    procedure Append(const AItem: String);
    procedure Clear;
    procedure ClearSelection;
    procedure SelectAll; virtual;
    procedure SelectRange(ALow, AHigh: Integer; ASelected: boolean); virtual;
    property Columns: NativeInt read FColumns write SetColumns default 0;
    property ItemHeight: NativeInt read FItemHeight write SetItemHeight;
    property ItemIndex: NativeInt read FItemIndex write SetItemIndex default -1;
    property Items: TStrings read FItems write SetItems;
    property MultiSelect: Boolean read FMultiSelect write SetMultiSelect default False;
    property SelCount: integer read GetSelCount;
    property Selected[Index: Integer]: Boolean read GetSelected write SetSelected;
    property Sorted: Boolean read FSorted write SetSorted default False;
    property TopIndex: NativeInt read FTopIndex write SetTopIndex default 0;
    property OnSelectionChange: TSelectionChangeEvent read FOnSelectionChange write FOnSelectionChange;
  end;

  { TCustomEdit }

  TCustomEdit = class(TWinControl)
  private
    FAlignment: TAlignment;
    FAutocomplete: string;
    FCharCase: TEditCharCase;
    FInputType: TEditInputType;
    FMaxLength: NativeInt;
    FModified: boolean;
    FPasswordChar: char;
    FPattern: string;
    FReadOnly: boolean;
    FRequired: boolean;
    FSelLength: NativeInt;
    FSelStart: NativeInt;
    FText: string;
    FTextHint: string;
    FOnChange: TNotifyEvent;
    function GetSelLength: NativeInt;
    function GetSelStart: NativeInt;
    function GetSelText: string;
    procedure SetAlignment(AValue: TAlignment);
    procedure SetAutocomplete(const AValue: string);
    procedure SetCharCase(AValue: TEditCharCase);
    procedure SetInputType(AValue: TEditInputType);
    procedure SetMaxLength(AValue: NativeInt);
    procedure SetModified(AValue: boolean);
    procedure SetPasswordChar(AValue: char);
    procedure SetPattern(AValue: string);
    procedure SetReadOnly(AValue: boolean);
    procedure SetRequired(AValue: boolean);
    procedure SetSelLength(AValue: NativeInt);
    procedure SetSelStart(AValue: NativeInt);
    procedure SetSelText(AValue: string);
    procedure SetTextHint(AValue: string);
  protected
    procedure Change; virtual;
    procedure DoEnter; override;
    procedure DoInput(ANewValue:string); virtual;
  protected
    function HandleInput(AEvent: TJSEvent): boolean; virtual;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure RegisterHandleEvents; override;
    procedure UnRegisterHandleEvents; override;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
    function RealGetText: string; override;
    procedure RealSetText(const AValue: string); override;
    function GetInputType: string; virtual;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    procedure Clear;
    procedure SelectAll;
  public
    property Alignment: TAlignment read FAlignment write SetAlignment;
    /// HTML autocomplete hint, e.g. 'username' or 'current-password'.
    /// Empty removes the attribute and leaves the browser default.
    property Autocomplete: string read FAutocomplete write SetAutocomplete;
    property CharCase: TEditCharCase read FCharCase write SetCharCase;
    /// HTML input type: text, email, tel, url or search.
    property InputType: TEditInputType read FInputType write SetInputType;
    property MaxLength: NativeInt read FMaxLength write SetMaxLength;
    property Modified: boolean read FModified write SetModified;
    property PasswordChar: char read FPasswordChar write SetPasswordChar;
    property Pattern: string read FPattern write SetPattern;
    property ReadOnly: boolean read FReadOnly write SetReadOnly;
    property Required: boolean read FRequired write SetRequired;
    property SelLength: NativeInt read GetSelLength write SetSelLength;
    property SelStart: NativeInt read GetSelStart write SetSelStart;
    property SelText: string read GetSelText write SetSelText;
    property TextHint: string read FTextHint write SetTextHint;
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
  end;

  { TCustomMemo }

  TCustomMemo = class(TWinControl)
  private
    FAlignment: TAlignment;
    FCharCase: TEditCharCase;
    FLines: TStrings;
    FMaxLength: NativeInt;
    FModified: boolean;
    FReadOnly: boolean;
    FSelLength: NativeInt;
    FSelStart: NativeInt;
    FTextHint: string;
    FWantReturns: boolean;
    FWantTabs: boolean;
    FWordWrap: boolean;
    FIsUserTyping: boolean;

    FOnChange: TNotifyEvent;
    function GetSelLength: NativeInt;
    function GetSelStart: NativeInt;
    function GetSelText: string;
    procedure HandleLinesChange(aSender: TObject);
    procedure SetAlignment(AValue: TAlignment);
    procedure SetCharCase(AValue: TEditCharCase);
    procedure SetLines(AValue: TStrings);
    procedure SetMaxLength(AValue: NativeInt);
    procedure SetModified(AValue: boolean);
    procedure SetReadOnly(AValue: boolean);
    procedure SetSelLength(AValue: NativeInt);
    procedure SetSelStart(AValue: NativeInt);
    procedure SetSelText(AValue: string);
    procedure SetTextHint(AValue: string);
    procedure SetWantReturns(AValue: boolean);
    procedure SetWantTabs(AValue: boolean);
    procedure SetWordWrap(AValue: boolean);
  protected
    procedure Change; virtual;
    procedure KeyDown(var Key: NativeInt; Shift: TShiftState); override;
  protected
    function HandleChange(AEvent: TJSEvent): boolean; virtual;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure RegisterHandleEvents; override;
    procedure UnRegisterHandleEvents; override;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
    function RealGetText: string; override;
    procedure RealSetText(const AValue: string); override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    procedure Append(const AValue: string);
    procedure Clear;
    procedure SelectAll;
  public
    property Alignment: TAlignment read FAlignment write SetAlignment;
    property CharCase: TEditCharCase read FCharCase write SetCharCase;
    property Lines: TStrings read FLines write SetLines;
    property MaxLength: NativeInt read FMaxLength write SetMaxLength;
    property Modified: boolean read FModified write SetModified;
    property ReadOnly: boolean read FReadOnly write SetReadOnly;
    property SelLength: NativeInt read GetSelLength write SetSelLength;
    property SelStart: NativeInt read GetSelStart write SetSelStart;
    property SelText: string read GetSelText write SetSelText;
    property TextHint: string read FTextHint write SetTextHint;
    property WantReturns: boolean read FWantReturns write SetWantReturns;
    property WantTabs: boolean read FWantTabs write SetWantTabs;
    property WordWrap: boolean read FWordWrap write SetWordWrap;
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
  end;

  { TCustomButton }

  TCustomButton = class(TWinControl)
  private
    FCancel: boolean;
    FDefault: boolean;
    FModalResult: TModalResult;
    procedure SetCancel(AValue: boolean);
    procedure SetDefault(AValue: boolean);
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    procedure AdjustSize; override;
    procedure Click; override;
  public
    property Cancel: boolean read FCancel write SetCancel;
    property Default: boolean read FDefault write SetDefault;
    property ModalResult: TModalResult read FModalResult write FModalResult;
  end;

  TCheckBoxState = (cbUnchecked, cbChecked);
  TLeftRight = taLeftJustify..taRightJustify;

  { TCustomCheckbox }

  TCustomCheckbox = class(TWinControl)
  private
    FAlignment: TLeftRight;
    FLabelElement: TJSHTMLElement;
    FMarkElement: TJSHTMLInputElement;
    FState: TCheckBoxState;
    FOnChange: TNotifyEvent;
    function GetChecked: boolean;
    function GetState: TCheckBoxState;
    procedure SetAlignment(AValue: TLeftRight);
    procedure SetChecked(AValue: boolean);
    procedure SetState(AValue: TCheckBoxState);
  protected
    procedure DoOnChange; virtual;
  protected
    property MarkElement: TJSHTMLInputElement read FMarkElement;
    property LabelElement: TJSHTMLElement read FLabelElement;
    property Checked: boolean read GetChecked write SetChecked;
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
  protected
    function HandleClick(AEvent: TJSMouseEvent): boolean; override;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    function CreateMarkElement: TJSHTMLInputElement; virtual;
    function CreateLabelElement: TJSHTMLElement; virtual;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
  public
    property Alignment: TLeftRight read FAlignment write SetAlignment default taRightJustify;
    property State: TCheckBoxState read GetState write SetState default cbUnchecked;
  end;

  { TCustomRadioButton }

  TCustomRadioButton = class(TWinControl)
  private
    fInput: TJSHTMLInputElement;
    fLabel: TJSHTMLLabelElement;
    FOnChange: TNotifyEvent;
    function ChangeHandler(Event: TEventListenerEvent): boolean;
    function GetChecked: boolean;
    function LabelClickHandler(aEvent: TJSMouseEvent): boolean;
    procedure SetChecked(AValue: boolean);
  protected
    property Checked: boolean read GetChecked write SetChecked;
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
  public
    constructor Create(AOwner: TComponent); override;
  end;

  { TCustomLabel }

  TCustomLabel = class(TWinControl)
  private
    FAlignment: TAlignment;
    FContentElement: TJSHTMLTableElement;
    FFocusControl: TWinControl;
    FLayout: TTextLayout;
    FShowAccelChar: boolean;
    FTransparent: boolean;
    FWordWrap: boolean;
    procedure SetAlignment(AValue: TAlignment);
    procedure SetLayout(AValue: TTextLayout);
    procedure SetShowAccelChar(AValue: boolean);
    procedure SetTransparent(AValue: boolean);
    procedure SetWordWrap(AValue: boolean);
  protected
    procedure DoEnter; override;
    function HandleAccelKey(AEvent: TJSKeyBoardEvent): boolean; virtual;
  protected
    property ContentElement: TJSHTMLTableElement read FContentElement;
    property Alignment: TAlignment read FAlignment write SetAlignment;
    property FocusControl: TWinControl read FFocusControl write FFocusControl;
    property Layout: TTextLayout read FLayout write SetLayout;
    property ShowAccelChar: boolean read FShowAccelChar write SetShowAccelChar default True;
    property Transparent: boolean read FTransparent write SetTransparent;
    property WordWrap: boolean read FWordWrap write SetWordWrap;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    function CreateContentElement: TJSHTMLTableElement; virtual;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    procedure AdjustSize; override;
    property AutoSize default True;
  end;

procedure ApplyScrollStyleToStyle(aStyle: TJSCSSStyleDeclaration; aScrollStyle: TScrollStyle);

implementation

uses
  RTLConsts;

procedure ApplyScrollStyleToStyle(aStyle: TJSCSSStyleDeclaration;
  aScrollStyle: TScrollStyle);
begin
  case aScrollStyle of
    ssNone: begin
      aStyle.removeProperty('overflow-x');
      aStyle.removeProperty('overflow-y');
      aStyle.setProperty('overflow', 'hidden');
    end;
    ssHorizontal: begin
      aStyle.removeProperty('overflow');
      aStyle.setProperty('overflow-y', 'hidden');
      aStyle.setProperty('overflow-x', 'scroll');
    end;
    ssVertical: begin
      aStyle.removeProperty('overflow');
      aStyle.setProperty('overflow-x', 'hidden');
      aStyle.setProperty('overflow-y', 'scroll');
    end;
    ssBoth: begin
      aStyle.removeProperty('overflow-x');
      aStyle.removeProperty('overflow-y');
      aStyle.setProperty('overflow', 'scroll');
    end;
    ssAutoHorizontal: begin
      aStyle.removeProperty('overflow');
      aStyle.setProperty('overflow-y', 'hidden');
      aStyle.setProperty('overflow-x', 'auto');
    end;
    ssAutoVertical: begin
      aStyle.removeProperty('overflow');
      aStyle.setProperty('overflow-x', 'hidden');
      aStyle.setProperty('overflow-x', 'scroll');
    end;
    ssAutoBoth: begin
      aStyle.removeProperty('overflow-x');
      aStyle.removeProperty('overflow-y');
      aStyle.setProperty('overflow', 'auto');
    end;
  end;
end;

{ TCustomRadioButton }

function TCustomRadioButton.ChangeHandler(Event: TEventListenerEvent): boolean;
begin
  if Assigned(OnChange) then
    OnChange(Self);
end;

function TCustomRadioButton.GetChecked: boolean;
begin
  Result := fInput.checked;
end;

function TCustomRadioButton.LabelClickHandler(aEvent: TJSMouseEvent): boolean;
begin
  if not Checked then
    Checked := true;
end;

procedure TCustomRadioButton.SetChecked(AValue: boolean);
begin
  if AValue = fInput.checked then
    Exit;
  fInput.checked := AValue;
  if Assigned(OnChange) then
    OnChange(Self);
end;

procedure TCustomRadioButton.Changed;
begin
  inherited Changed;
  HandleElement.style.setProperty('display','flex' );
  HandleElement.style.setProperty('align-items', 'center');
  HandleElement.setAttribute('name', Name );
  fInput._type := 'radio';
  fInput.id := Name;
  fInput.name := Parent.Name;
  fInput.value := Caption;
  fLabel.textContent := Caption;
  { #todo -oyus : After publish this fix to release https://bugs.freepascal.org/view.php?id=38862. Need refactoring }
  // fLabel.htmlFor := Name;
  fLabel.onclick := @LabelClickHandler;
end;

function TCustomRadioButton.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
  fInput := TJSHTMLInputElement(document.createElement('input'));
  fLabel := TJSHTMLLabelElement(document.createElement('label'));
  Result.append(fInput);
  fInput.onselect := @ChangeHandler;
  fInput.addEventListener('change', TJSEventHandler(@ChangeHandler));
  Result.append(fLabel);
end;

constructor TCustomRadioButton.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  AutoSize := True;
end;

var
  _WCLStdRulesRegistered: Boolean;

procedure _RegisterWCLStdRules;
begin
  if _WCLStdRulesRegistered then Exit;
  RegisterWCLStyle(
    '.wcl-btn{' +
    'padding:6px 16px;' +
    'border-radius:4px;' +
    'border:1px solid #888;' +
    'background-color:#f0f0f0;' +
    'color:#333;' +
    'cursor:pointer;' +
    'font-size:14px!important;' +
    'display:inline-flex;' +
    'align-items:center;' +
    'justify-content:center;' +
    'touch-action:manipulation;' +
    '-webkit-tap-highlight-color:transparent;' +
    'transition:background-color 0.15s,border-color 0.15s;}' +
    '@media(hover:hover){' +
    '.wcl-btn:hover{background-color:#e0e0e0;border-color:#666;}' +
    '}' +
    '.wcl-btn:active{background-color:#d0d0d0;border-color:#555;}' +
    '.wcl-btn:disabled{opacity:0.5;cursor:default;pointer-events:none;}' +
    '.wcl-input,input.wcl-input,textarea.wcl-input{' +
    'padding:6px 8px;' +
    'border-radius:4px;' +
    'border:1px solid #888;' +
    'font-family:inherit;' +
    'font-size:inherit;' +
    'background-color:#fff;' +
    'box-sizing:border-box;' +
    'touch-action:manipulation;' +
    '-webkit-tap-highlight-color:transparent;}' +
    'select.wcl-input{' +
    'padding:3px 4px!important;' +
    'border-radius:4px;' +
    'border:1px solid #888;' +
    'font-size:14px!important;' +
    'background-color:#fff;}' +
    '.wcl-input:focus{outline:none;border-color:#4A90D9;box-shadow:0 0 0 2px rgba(74,144,217,0.2);}' +
    '.wcl-input:disabled{opacity:0.5;}' +
    '.wcl-scrollbar{' +
    'box-sizing:border-box;' +
    'display:flex;' +
    'align-items:center;' +
    'justify-content:center;' +
    'min-width:24px;' +
    'min-height:24px;}' +
    '.wcl-scrollbar input[type=range]{' +
    'width:100%;' +
    'height:100%;' +
    'margin:0;' +
    'padding:0;' +
    'cursor:pointer;' +
    'accent-color:#4A90D9;}' +
    '.wcl-scrollbar-vertical input[type=range]{' +
    'writing-mode:vertical-lr;' +
    'direction:rtl;}' +
    '.wcl-combo-dropdown{' +
    'position:fixed;' +
    'z-index:5000;' +
    'background:#fff;' +
    'border:1px solid #888;' +
    'border-radius:4px;' +
    'box-shadow:0 4px 12px rgba(0,0,0,0.2);' +
    'max-height:240px;' +
    'overflow:auto;' +
    'box-sizing:border-box;' +
    'padding:2px 0;}' +
    '.wcl-combo-item{' +
    'padding:4px 8px;' +
    'cursor:pointer;' +
    'white-space:nowrap;' +
    'overflow:hidden;' +
    'text-overflow:ellipsis;' +
    'color:#333;}' +
    '@media(hover:hover){' +
    '.wcl-combo-item:hover{background:#eef3fb;}' +
    '}' +
    '.wcl-combo-item-active{' +
    'background:#4A90D9;' +
    'color:#fff;}' +
    '.wcl-combo-list{' +
    'cursor:pointer;' +
    'padding-right:24px!important;' +
    'background-image:linear-gradient(45deg,transparent 50%,#666 50%),linear-gradient(135deg,#666 50%,transparent 50%);' +
    'background-position:calc(100% - 14px) 50%,calc(100% - 9px) 50%;' +
    'background-size:5px 5px,5px 5px;' +
    'background-repeat:no-repeat;}' +
    /// Touch devices: readable text (16px avoids the iOS focus zoom) and
    /// finger-sized targets. Independent of the viewport width, so it also
    /// applies in fit-design mode.
    '@media(pointer:coarse){' +
    '.wcl-btn{min-height:36px;padding:8px 14px!important;}' +
    '.wcl-input,input.wcl-input,textarea.wcl-input{' +
    'min-height:36px;font-size:16px!important;padding:8px 10px!important;}' +
    'select.wcl-input{min-height:36px;font-size:16px!important;padding:6px 8px!important;}' +
    '}' +
    '@media(prefers-reduced-motion:reduce){' +
    '.wcl-btn{transition:none;}' +
    '}'
  );
  _WCLStdRulesRegistered := True;
end;

{ TCustomComboBox }

var
  _ComboSeq: NativeInt = 0;

procedure TCustomComboBox.SetColumns(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FColumns <> AValue) then
  begin
    FColumns := AValue;
    Changed;
  end;
end;

procedure TCustomComboBox.SetDropDownCount(AValue: integer);
begin
  if (AValue < 1) then
    AValue := 1;
  if (FDropDownCount <> AValue) then
  begin
    FDropDownCount := AValue;
    Changed;
  end;
end;

procedure TCustomComboBox.SetItemHeight(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FItemHeight <> AValue) then
  begin
    FItemHeight := AValue;
    Changed;
  end;
end;

procedure TCustomComboBox.SetItemIndex(AValue: NativeInt);
begin
  if (AValue < -1) or (AValue >= FItems.Count) then
    Exit;
  SelectIndex(AValue, False);
  Changed;
end;

procedure TCustomComboBox.SetItems(AValue: TStrings);
begin
  FItems.Assign(AValue);
  if (FItemIndex >= FItems.Count) then
    FItemIndex := -1;
  Changed;
end;

procedure TCustomComboBox.SetSorted(AValue: boolean);
begin
  if (FSorted <> AValue) then
  begin
    FSorted := AValue;
    UpdateSorted;
  end;
end;

procedure TCustomComboBox.SetStyle(AValue: TComboBoxStyle);
begin
  if (FStyle <> AValue) then
  begin
    FStyle := AValue;
    if (FStyle = csDropDownList) then
    begin
      if (FItemIndex < 0) then
        FItemIndex := FItems.IndexOf(TJSHTMLInputElement(HandleElement).Value);
    end;
    Changed;
  end;
end;

procedure TCustomComboBox.SetTopIndex(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FTopIndex <> AValue) then
  begin
    FTopIndex := AValue;
    Changed;
  end;
end;

procedure TCustomComboBox.ItemsChange(ASender: TObject);
begin
  if (FItemIndex >= FItems.Count) then
    FItemIndex := -1;
  Changed;
end;

procedure TCustomComboBox.Change;
begin
  if (Assigned(FOnChange)) then
  begin
    FOnChange(Self);
  end;
end;

procedure TCustomComboBox.CloseDropDown;
begin
  FOpen := False;
  if Assigned(FListElement) then
    FListElement.Style.SetProperty('display', 'none');
end;

procedure TCustomComboBox.OpenDropDown;
var
  VRect: TJSDOMRect;
begin
  if (not Assigned(FListElement)) or (FItems.Count = 0) then
    Exit;
  VRect := HandleElement.getBoundingClientRect;
  FListElement.Style.SetProperty('display', 'block');
  FListElement.Style.SetProperty('left', IntToStr(Trunc(VRect.Left)) + 'px');
  FListElement.Style.SetProperty('top', IntToStr(Trunc(VRect.Bottom) + 2) + 'px');
  FListElement.Style.SetProperty('min-width', IntToStr(Trunc(VRect.Width)) + 'px');
  FOpen := True;
  if (FItemIndex >= 0) then
    FHighlightIndex := FItemIndex
  else
    FHighlightIndex := 0;
  UpdateHighlight;
end;

procedure TCustomComboBox.ToggleDropDown;
begin
  if FOpen then
    CloseDropDown
  else
    OpenDropDown;
end;

procedure TCustomComboBox.UpdateHighlight;
var
  VIndex: NativeInt;
  VElement: TJSHTMLElement;
begin
  if (not Assigned(FListElement)) then
    Exit;
  for VIndex := 0 to (FListElement.children.length - 1) do
  begin
    VElement := TJSHTMLElement(FListElement.children[VIndex]);
    if (VIndex = FHighlightIndex) then
      VElement.classList.add('wcl-combo-item-active')
    else
      VElement.classList.remove('wcl-combo-item-active');
  end;
  if (FHighlightIndex >= 0) and (FHighlightIndex < FListElement.children.length) then
    TJSHTMLElement(FListElement.children[FHighlightIndex]).scrollIntoView({ block: 'nearest' });
end;

procedure TCustomComboBox.SelectIndex(AIndex: NativeInt; AFireChange: Boolean);
var
  VInput: TJSHTMLInputElement;
begin
  if (AIndex < -1) or (AIndex >= FItems.Count) then
    Exit;
  FItemIndex := AIndex;
  VInput := TJSHTMLInputElement(HandleElement);
  if (AIndex >= 0) then
    VInput.Value := FItems[AIndex]
  else
    VInput.Value := '';
  CloseDropDown;
  if AFireChange then
    Change;
end;

function TCustomComboBox.HandleClick(AEvent: TJSMouseEvent): boolean;
begin
  AEvent.StopPropagation;
  ToggleDropDown;
  Result := True;
end;

function TCustomComboBox.HandleDocumentClick(AEvent: TJSMouseEvent): boolean;
begin
  Result := False;
  if FOpen then
    CloseDropDown;
end;

function TCustomComboBox.HandleInput(AEvent: TJSEvent): boolean;
begin
  AEvent.StopPropagation;
  FItemIndex := FItems.IndexOf(TJSHTMLInputElement(HandleElement).Value);
  if FOpen then
  begin
    FHighlightIndex := FItemIndex;
    UpdateHighlight;
  end;
  Change();
  Result := True;
end;

function TCustomComboBox.HandleItemClick(AEvent: TJSMouseEvent): boolean;
var
  VElement: TJSElement;
  VIndex: NativeInt;
begin
  AEvent.StopPropagation;
  AEvent.PreventDefault;
  VElement := AEvent.targetElement;
  while Assigned(VElement) and (not VElement.hasAttribute('data-wcl-combo-index')) do
    VElement := VElement.parentElement;
  if Assigned(VElement) then
  begin
    VIndex := StrToIntDef(TJSHTMLElement(VElement).getAttribute('data-wcl-combo-index'), -1);
    SelectIndex(VIndex, True);
  end;
  Result := True;
end;

function TCustomComboBox.HandleKeyDown(AEvent: TJSKeyBoardEvent): boolean;
var
  VKey: NativeInt;
begin
  Result := False;
  VKey := ExtractKeyCode(AEvent);
  if (not FOpen) then
  begin
    if (VKey = 38) or (VKey = 40) then
    begin
      OpenDropDown;
      AEvent.PreventDefault;
      Result := True;
    end;
    Exit;
  end;
  case VKey of
    /// Up
    38:
      begin
        if (FHighlightIndex > 0) then
          Dec(FHighlightIndex);
        UpdateHighlight;
        AEvent.PreventDefault;
        Result := True;
      end;
    /// Down
    40:
      begin
        if (FHighlightIndex < (FItems.Count - 1)) then
          Inc(FHighlightIndex);
        UpdateHighlight;
        AEvent.PreventDefault;
        Result := True;
      end;
    /// Enter
    13:
      begin
        SelectIndex(FHighlightIndex, True);
        AEvent.PreventDefault;
        Result := True;
      end;
    /// Escape
    27:
      begin
        CloseDropDown;
        AEvent.PreventDefault;
        Result := True;
      end;
  end;
end;

procedure TCustomComboBox.Changed;
var
  VIndex: NativeInt;
  VInput: TJSHTMLInputElement;
  VItem: TJSHTMLElement;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    if (HandleClass = '') then
    begin
      _RegisterWCLStdRules;
      asm this.FHandleElement.classList.add('wcl-input'); end;
    end;
    VInput := TJSHTMLInputElement(HandleElement);
    VInput.setAttribute('name', Name);
    /// DropDownCount, TopIndex and Columns are kept for LCL compatibility.
    VInput.setAttribute('data-dropdown-count', IntToStr(FDropDownCount));
    VInput.setAttribute('data-top-index', IntToStr(FTopIndex));
    VInput.setAttribute('data-columns', IntToStr(FColumns));
    if Assigned(FListElement) then
    begin
      FListElement.InnerHTML := '';
      for VIndex := 0 to (FItems.Count - 1) do
      begin
        VItem := TJSHTMLElement(Document.CreateElement('div'));
        VItem.classList.add('wcl-combo-item');
        VItem.setAttribute('data-wcl-combo-index', IntToStr(VIndex));
        VItem.TextContent := FItems[VIndex];
        if (FItemHeight > 0) then
          VItem.Style.SetProperty('min-height', IntToStr(FItemHeight) + 'px');
        FListElement.AppendChild(VItem);
      end;
      if (not FOpen) then
        FListElement.Style.SetProperty('display', 'none');
    end;
    if (FStyle = csDropDownList) then
    begin
      VInput.ReadOnly := True;
      HandleElement.classList.add('wcl-combo-list');
    end
    else
    begin
      VInput.ReadOnly := False;
      HandleElement.classList.remove('wcl-combo-list');
    end;
    if (FItemIndex >= 0) and (FItemIndex < FItems.Count) then
      VInput.Value := FItems[FItemIndex];
  end;
end;

function TCustomComboBox.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('input'));
  TJSHTMLInputElement(Result)._type := 'text';
  Inc(_ComboSeq);
  FListId := 'wcl-combo-list-' + IntToStr(_ComboSeq);
  FListElement := TJSHTMLElement(Document.CreateElement('div'));
  FListElement.classList.add('wcl-combo-dropdown');
  FListElement.setAttribute('id', FListId);
  FListElement.Style.SetProperty('display', 'none');
  Document.Body.AppendChild(FListElement);
end;

procedure TCustomComboBox.RegisterHandleEvents;
begin
  inherited RegisterHandleEvents;
  HandleElement.addEventListener('click', TJSEventHandler(@HandleClick));
  HandleElement.addEventListener('input', TJSEventHandler(@HandleInput));
  HandleElement.addEventListener('keydown', TJSEventHandler(@HandleKeyDown));
  if Assigned(FListElement) then
    FListElement.addEventListener('click', TJSEventHandler(@HandleItemClick));
  Document.addEventListener('click', TJSEventHandler(@HandleDocumentClick));
end;

procedure TCustomComboBox.UnRegisterHandleEvents;
begin
  inherited UnRegisterHandleEvents;
  HandleElement.removeEventListener('click', TJSEventHandler(@HandleClick));
  HandleElement.removeEventListener('input', TJSEventHandler(@HandleInput));
  HandleElement.removeEventListener('keydown', TJSEventHandler(@HandleKeyDown));
  if Assigned(FListElement) then
    FListElement.removeEventListener('click', TJSEventHandler(@HandleItemClick));
  Document.removeEventListener('click', TJSEventHandler(@HandleDocumentClick));
end;

{$push}
{$hints off}

function TCustomComboBox.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  Result := False;
end;

{$pop}

function TCustomComboBox.RealGetText: string;
begin
  if (FItemIndex >= 0) and (FItemIndex < FItems.Count) then
    Result := FItems[FItemIndex]
  else if Assigned(HandleElement) then
    Result := TJSHTMLInputElement(HandleElement).Value
  else
    Result := '';
end;

procedure TCustomComboBox.RealSetText(const AValue: string);
var
  VIndex: NativeInt;
begin
  VIndex := FItems.IndexOf(AValue);
  if (VIndex >= 0) then
  begin
    FItemIndex := VIndex;
    Changed;
  end
  else if (FStyle <> csDropDownList) then
  begin
    FItemIndex := -1;
    if Assigned(HandleElement) then
      TJSHTMLInputElement(HandleElement).Value := AValue;
  end;
end;

procedure TCustomComboBox.UpdateSorted;
begin
  TStringList(FItems).Sorted := FSorted;
  Changed;
end;

class function TCustomComboBox.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 100;
  Result.Cy := 25;
end;

constructor TCustomComboBox.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FColumns := 0;
  FDropDownCount := 8;
  FHighlightIndex := -1;
  FItemHeight := 0;
  FItemIndex := -1;
  FItems := TStringList.Create;
  TStringList(FItems).OnChange := ItemsChange;
  FOpen := False;
  FSorted := False;
  FStyle := csDropDown;
  FTopIndex := 0;
  BeginUpdate;
  try
    with GetControlClassDefaultSize do
    begin
      SetBounds(0, 0, Cx, Cy);
    end;
  finally
    EndUpdate;
  end;
end;

destructor TCustomComboBox.Destroy;
begin
  CloseDropDown;
  if Assigned(FListElement) then
  begin
    FListElement.remove;
    FListElement := nil;
  end;
  FItems.Destroy;
  FItems := nil;
  inherited Destroy;
end;

procedure TCustomComboBox.AddItem(const AItem: string; AObject: TObject);
begin
  FItems.AddObject(AItem, AObject);
end;

procedure TCustomComboBox.Append(const AItem: string);
begin
  FItems.Append(AItem);
end;

procedure TCustomComboBox.Clear;
begin
  CloseDropDown;
  FItems.Clear;
  FItemIndex := -1;
  if Assigned(HandleElement) then
    TJSHTMLInputElement(HandleElement).Value := '';
  Changed;
end;

{ TCustomListBox }

procedure TCustomListBox.SetColumns(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FColumns <> AValue) then
  begin
    FColumns := AValue;
    Changed;
  end;
end;

procedure TCustomListBox.SetTopIndex(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (AValue > (FItems.Count - 1)) then
    AValue := FItems.Count - 1;
  if (AValue < 0) then
    AValue := 0;
  if (FTopIndex <> AValue) then
  begin
    FTopIndex := AValue;
    Changed;
  end;
end;

procedure TCustomListBox.SetItemHeight(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if FItemHeight <> AValue then begin
    FItemHeight := AValue;
    Changed;
  end;
end;

procedure TCustomListBox.SetItemIndex(AValue: NativeInt);
begin
  if (AValue > -1) and (AValue < FItems.Count) then begin
    BeginUpdate;
    try
      if FMultiSelect then
        ClearSelection;
      FItemIndex := AValue;
      Changed;
    finally
      EndUpdate;
    end;
  end;
end;

procedure TCustomListBox.SetItems(AValue: TStrings);
begin
  FItems.Assign(AValue);
  Changed;
end;

procedure TCustomListBox.SetSorted(AValue: Boolean);
begin
  if FSorted <> AValue then begin
    FSorted := AValue;
    UpdateSorted;
  end;
end;

function TCustomListBox.GetSelCount: integer;
var
  b: Boolean;
begin
  Result := 0;
  if FMultiSelect then begin
    for b in FSelected do
      if b then
        Inc(Result);
  end else if ItemIndex <> -1 then
    Inc(Result);
end;

function TCustomListBox.GetSelected(Index: Integer): Boolean;
begin
  if (Index < 0) or (Index >= FItems.Count) then
    raise EListError.CreateFmt(SListIndexError, [Index]);
  Result := FSelected[Index];
end;

procedure TCustomListBox.ItemsChanged(ASender: TObject);
begin
  if Length(FSelected) <> FItems.Count then
    SetLength(FSelected, FItems.Count);
  Changed;
end;

procedure TCustomListBox.SetMultiSelect(AValue: Boolean);
begin
  if FMultiSelect <> AValue then begin
    ClearSelection;
    FMultiSelect := AValue;
    if not (csLoading in ComponentState) then
      FSelectionChanged := True;
    Changed;
  end;
end;

procedure TCustomListBox.SetSelected(Index: Integer; AValue: Boolean);
var
  i: NativeInt;
begin
  if Index > High(FSelected) then
    raise EListError.CreateFmt(SListIndexError, [Index]);
  if AValue and not FMultiSelect then begin
    for i := 0 to High(FSelected) do
      if FSelected[i] then
        FSelected[i] := False;
  end;
  FSelected[Index] := AValue;
  if AValue then
    FItemIndex := Index
  else begin
    FItemIndex := -1;
    if FMultiSelect then begin
      for i := 0 to High(FSelected) do
        if FSelected[i] then begin
          FItemIndex := i;
          Break;
        end;
    end;
  end;
  if not (csLoading in ComponentState) then
    FSelectionChanged := True;
  Changed;
end;

procedure TCustomListBox.SelectionChange(AUser: Boolean);
begin
  if Assigned(FOnSelectionChange) then
    FOnSelectionChange(Self, AUser);
end;

function TCustomListBox.HandleChange(AEvent: TJSEvent): boolean;
var
  i: NativeInt;
begin
  AEvent.StopPropagation;
  with TJSHTMLSelectElement(HandleElement) do begin
    FItemIndex := selectedIndex;
    for i := 0 to length - 1 do
      FSelected[i] := item(i).selected;
  end;
  SelectionChange(True);
  Result := True;
end;

procedure TCustomListBox.Changed;
var
  idx: NativeInt;
  v: String;
  opt: TJSHTMLOptionElement;
begin
  inherited Changed;
  if not IsUpdating and not (csLoading in ComponentState) then begin
    if FSelectionChanged then begin
      SelectionChange(False);
      FSelectionChanged := False;
    end;
    with TJSHTMLSelectElement(HandleElement) do begin
      Style.SetProperty('overflow', 'auto');
      multiple := FMultiSelect;
      { use 2, so that it isn't shown as a dropdown }
      size := 2;
      { remove old items }
      for idx := TJSHTMLSelectElement(HandleElement).Length - 1 downto 0 do
        Remove(idx);
      { add new items }
      for idx := 0 to FItems.Count - 1 do begin
        v := FItems[idx];
        opt := TJSHTMLOptionElement(Document.CreateElement('option'));
        opt.Value := v;
        opt.Text := v;
        if FItemHeight > 0 then
          opt.Style.SetProperty('min-height', IntToStr(FItemHeight) + 'px');
        if FMultiselect then
          opt.Selected := FSelected[idx]
        else
          opt.Selected := idx = FItemIndex;
        Add(opt);
      end;
      HandleElement.setAttribute('data-columns', IntToStr(FColumns));
      HandleElement.setAttribute('data-top-index', IntToStr(FTopIndex));
      if (FTopIndex > 0) and (FItems.Count > 0) then
      begin
        if (FItemHeight > 0) then
          scrollTop := FTopIndex * FItemHeight
        else if (FTopIndex < FItems.Count) then
          scrollTop := Trunc(item(FTopIndex).offsetTop);
      end;
    end;
    HandleElement.setAttribute('name', Name );
  end;
end;

function TCustomListBox.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('select'));
end;

procedure TCustomListBox.RegisterHandleEvents;
begin
  inherited RegisterHandleEvents;
  with HandleElement do
  begin
    AddEventListener('change', TJSEventHandler(@HandleChange));
  end;
end;

procedure TCustomListBox.UnRegisterHandleEvents;
begin
  inherited UnRegisterHandleEvents;
  with HandleElement do
  begin
    RemoveEventListener('change', TJSEventHandler(@HandleChange));
  end;
end;

function TCustomListBox.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  Result := False;
end;

procedure TCustomListBox.UpdateSorted;
begin
  TStringList(FItems).Sorted := FSorted;
end;

class function TCustomListBox.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 100;
  Result.Cy := 70;
end;

constructor TCustomListBox.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FColumns := 0;
  FItemHeight := 0;
  FItemIndex := -1;
  FItems := TStringList.Create;
  TStringList(FItems).OnChange := @ItemsChanged;
  FMultiSelect := False;
  FSorted := False;
  FTopIndex := 0;
  BeginUpdate;
  try
    with GetControlClassDefaultSize do begin
      SetBounds(0, 0, Cx, Cy);
    end;
  finally
    EndUpdate;
  end;
end;

destructor TCustomListBox.Destroy;
begin
  FItems.Free;
  inherited Destroy;
end;

procedure TCustomListBox.AddItem(const AItem: String; AObject: TObject);
begin
  FItems.AddObject(AItem, AObject);
  Changed;
end;

procedure TCustomListBox.Append(const AItem: String);
begin
  FItems.Append(AItem);
  Changed;
end;

procedure TCustomListBox.Clear;
begin
  FItems.Clear;
  FItemIndex := -1;
  FSelected := Nil;
  Changed;
end;

procedure TCustomListBox.ClearSelection;
var
  i: Integer;
begin
  if FMultiSelect then begin
    BeginUpdate;
    try
      for i := 0 to FItems.Count - 1 do
        Selected[i] := False;
    finally
      EndUpdate;
    end;
  end else
    ItemIndex := -1;
end;

procedure TCustomListBox.SelectAll;
begin
  if not FMultiSelect then
    Exit;
  SelectRange(0, FItems.Count - 1, True);
end;

procedure TCustomListBox.SelectRange(ALow, AHigh: Integer; ASelected: boolean);
var
  i: Integer;
begin
  if not FMultiSelect then
    Exit;
  if ALow < 0 then
    ALow := 0;
  if AHigh >= FItems.Count then
    AHigh := FItems.Count - 1;
  if AHigh < ALow then
    Exit;
  BeginUpdate;
  try
    for i := ALow to AHigh do
      Selected[i] := ASelected;
  finally
    EndUpdate;
  end;
end;

{ TCustomEdit }

procedure TCustomEdit.SetAlignment(AValue: TAlignment);
begin
  if (FAlignment <> AValue) then
  begin
    FAlignment := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetAutocomplete(const AValue: string);
begin
  if (FAutocomplete <> AValue) then
  begin
    FAutocomplete := AValue;
    Changed;
  end;
end;

function TCustomEdit.GetSelLength: NativeInt;
begin
  if (Assigned(HandleElement)) then
  begin
    with TJSHTMLInputElement(HandleElement) do
    begin
      FSelLength := (SelectionEnd - SelectionStart);
    end;
  end;
  Result := FSelLength;
end;

function TCustomEdit.GetSelStart: NativeInt;
begin
  if (Assigned(HandleElement)) then
  begin
    with TJSHTMLInputElement(HandleElement) do
    begin
      FSelStart := (SelectionStart);
    end;
  end;
  Result := FSelStart;
end;

function TCustomEdit.GetSelText: string;
begin
  Result := Copy(RealGetText, SelStart + 1, SelLength);
end;

procedure TCustomEdit.SetCharCase(AValue: TEditCharCase);
begin
  if (FCharCase <> AValue) then
  begin
    FCharCase := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetInputType(AValue: TEditInputType);
begin
  if (FInputType <> AValue) then
  begin
    FInputType := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetMaxLength(AValue: NativeInt);
begin
  if (FMaxLength <> AValue) then
  begin
    FMaxLength := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetModified(AValue: boolean);
begin
  if (FModified <> AValue) then
  begin
    FModified := AValue;
  end;
end;

procedure TCustomEdit.SetPasswordChar(AValue: char);
begin
  if (FPasswordChar <> AValue) then
  begin
    FPasswordChar := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetPattern(AValue: string);
begin
  if (FPattern <> AValue) then
  begin
    FPattern := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetReadOnly(AValue: boolean);
begin
  if (FReadOnly <> AValue) then
  begin
    FReadOnly := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetRequired(AValue: boolean);
begin
  if (FRequired <> AValue) then
  begin
    FRequired := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetSelLength(AValue: NativeInt);
begin
  if (AValue < 0) then
  begin
    AValue := 0;
  end;
  if (FSelLength <> AValue) then
  begin
    FSelLength := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetSelStart(AValue: NativeInt);
begin
  if (FSelStart <> AValue) then
  begin
    FSelStart := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.SetSelText(AValue: string);
var
  VText: string;
  VLength: NativeInt;
  VStart: NativeInt;
begin
  if (not ReadOnly) then
  begin
    VText := RealGetText;
    VLength := SelLength;
    VStart := SelStart;
    if (VLength = 0) then
    begin
      System.Insert(AValue, VText, VStart + 1);
    end
    else
    begin
      System.Delete(VText, VStart + 1, VLength);
      System.Insert(AValue, VText, VStart + 1);
    end;
    if (MaxLength > 0) then
    begin
      VText := Copy(VText, 1, MaxLength);
    end;
    RealSetText(VText);
    FSelStart := VStart + Length(AValue);
    FSelLength := 0;
    Changed;
  end;
end;

procedure TCustomEdit.SetTextHint(AValue: string);
begin
  if (FTextHint <> AValue) then
  begin
    FTextHint := AValue;
    Changed;
  end;
end;

procedure TCustomEdit.Change;
begin
  if (Assigned(FOnChange)) then
  begin
    FOnChange(Self);
  end;
end;

procedure TCustomEdit.DoEnter;
begin
  inherited DoEnter;
  SelectAll;
end;

procedure TCustomEdit.DoInput(ANewValue: string);
begin
  if (ANewValue <> RealGetText) then
  begin
    FText := ANewValue;
    FModified := True;
    Change;
  end;
end;

function TCustomEdit.HandleInput(AEvent: TJSEvent): boolean;
begin
  AEvent.StopPropagation;
  DoInput(TJSHTMLInputElement(HandleElement).Value);
  Result := True;
end;

procedure TCustomEdit.Changed;
begin
   inherited Changed;
   if (not IsUpdating) and not (csLoading in ComponentState) then begin
      if (HandleClass = '') then begin
         _RegisterWCLStdRules;
         asm this.FHandleElement.classList.add('wcl-input'); end;
      end;
      TJSHTMLInputElement(HandleElement).Name := Name;
      with TJSHTMLInputElement(HandleElement) do begin
         /// Alignment
         case Alignment of
            taRightJustify: Style.SetProperty('text-align', 'right');
            taCenter: Style.SetProperty('text-align', 'center');
            else
               Style.RemoveProperty('text-align');
         end;
         /// CharCase
         case FCharCase of
            ecLowerCase: Style.SetProperty('text-transform', 'lowercase');
            ecUppercase: Style.SetProperty('text-transform', 'uppercase');
            else
               Style.RemoveProperty('text-transform');
         end;
         /// Max Length
         if (FMaxLength > 0) then begin
            MaxLength := FMaxLength;
         end else begin
            RemoveAttribute('maxlength');
         end;
         /// Pattern
         if (FPattern <> '') then begin
            Pattern := FPattern;
         end else begin
            RemoveAttribute('pattern');
         end;
         /// Placeholder
         if (FTextHint <> '') then begin
            Placeholder := FTextHint;
         end else begin
            RemoveAttribute('placeholder');
         end;
         /// ReadOnly
         ReadOnly := FReadOnly;
         /// Required
         Required := FRequired;
         /// Selection
         case GetInputType of
            'text',
            'search',
            'url',
            'tel',
            'password': begin
               SetSelectionRange(FSelStart, FSelStart + FSelLength);
            end;
         end;
         /// Type
         _Type := GetInputType;
         /// Text
         Value := RealGetText;
         /// Autocomplete: empty means "no hint", i.e. the browser default.
         if (FAutocomplete <> '') then begin
            Autocomplete := FAutocomplete;
         end else begin
            RemoveAttribute('autocomplete');
         end;
      end;
      HandleElement.setAttribute('name', Name );
   end;
end;

function TCustomEdit.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('input'));
end;

procedure TCustomEdit.RegisterHandleEvents;
begin
  inherited RegisterHandleEvents;
  with HandleElement do
  begin
    AddEventListener('input', TJSEventHandler(@HandleInput));
  end;
end;

procedure TCustomEdit.UnRegisterHandleEvents;
begin
  inherited UnRegisterHandleEvents;
  with HandleElement do
  begin
    RemoveEventListener('input', TJSEventHandler(@HandleInput));
  end;
end;

function TCustomEdit.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  Result := inherited CheckChildClassAllowed(AChildClass);
end;

function TCustomEdit.RealGetText: string;
begin
  Result := FText;
end;

procedure TCustomEdit.RealSetText(const AValue: string);
begin
  FText := AValue;
  FModified := False;
  Changed;
end;

function TCustomEdit.GetInputType: string;
begin
  if (FPasswordChar <> #0) then
    Result := 'password'
  else
    case FInputType of
      itEmail: Result := 'email';
      itTel: Result := 'tel';
      itUrl: Result := 'url';
      itSearch: Result := 'search';
      else Result := 'text';
    end;
end;

class function TCustomEdit.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 80;
  Result.Cy := 25;
end;

constructor TCustomEdit.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FAutocomplete := '';
  FInputType := itText;
  FMaxLength := 0;
  FModified := False;
  FPasswordChar := #0;
  FPattern := '';
  FReadOnly := False;
  FTextHint := '';
  FText := '';
  BeginUpdate;
  try
    with GetControlClassDefaultSize do
    begin
      SetBounds(0, 0, Cx, Cy);
    end;
  finally
    EndUpdate;
  end;
end;

procedure TCustomEdit.Clear;
begin
  FText := '';
  Changed;
end;

procedure TCustomEdit.SelectAll;
begin
  if (RealGetText <> '') then
  begin
    BeginUpdate;
    try
      SetSelStart(0);
      SetSelLength(Length(RealGetText));
    finally
      EndUpdate;
    end;
  end;
end;

type
  TCustomMemoStrings = class(TStringList)
  protected
    procedure DoReadData(Reader: TReader); virtual;
    procedure DoWriteData(Writer: TWriter); virtual;
    procedure DefineProperties(Filer: TFiler); override;
  end;

{ TCustomMemoStrings }

procedure TCustomMemoStrings.DoReadData(Reader: TReader);
begin
  Reader.ReadListBegin;
  BeginUpdate;
  try
    Clear;
    while not Reader.EndOfList do
      Add(Reader.ReadString);
  finally
    EndUpdate;
  end;
  Reader.ReadListEnd;
end;

procedure TCustomMemoStrings.DoWriteData(Writer: TWriter);
var
  i: Integer;
  lStringsNoWordWrap: TStringList;
begin
  lStringsNoWordWrap := TStringList.Create;
  try
    lStringsNoWordWrap.Text := Text;

    Writer.WriteListBegin;
    for i := 0 to lStringsNoWordWrap.Count - 1 do
      Writer.WriteString(lStringsNoWordWrap.Strings[i]);
    Writer.WriteListEnd;
  finally
    lStringsNoWordWrap.Free;
  end;
end;

procedure TCustomMemoStrings.DefineProperties(Filer: TFiler);
var
  HasData: Boolean;
begin
  HasData := Count > 0;
  Filer.DefineProperty('Strings', @DoReadData, @DoWriteData, HasData);
end;


{ TCustomMemo }

procedure TCustomMemo.SetAlignment(AValue: TAlignment);
begin
  if (FAlignment <> AValue) then
  begin
    FAlignment := AValue;
    Changed;
  end;
end;

function TCustomMemo.GetSelLength: NativeInt;
begin
  if (Assigned(HandleElement)) then
  begin
    with TJSHTMLTextAreaElement(HandleElement) do
    begin
      FSelLength := (SelectionEnd - SelectionStart);
    end;
  end;
  Result := FSelLength;
end;

function TCustomMemo.GetSelStart: NativeInt;
begin
  if (Assigned(HandleElement)) then
  begin
    with TJSHTMLTextAreaElement(HandleElement) do
    begin
      FSelStart := (SelectionStart);
    end;
  end;
  Result := FSelStart;
end;

function TCustomMemo.GetSelText: string;
begin
  Result := Copy(RealGetText, SelStart + 1, SelLength);
end;

procedure TCustomMemo.HandleLinesChange(aSender: TObject);
begin
  Changed;
end;

procedure TCustomMemo.SetCharCase(AValue: TEditCharCase);
begin
  if (FCharCase <> AValue) then
  begin
    FCharCase := AValue;
    Changed;
  end;
end;

procedure TCustomMemo.SetLines(AValue: TStrings);
begin
  FLines.Assign(AValue);
  Changed;
end;

procedure TCustomMemo.SetMaxLength(AValue: NativeInt);
begin
  if (FMaxLength <> AValue) then
  begin
    FMaxLength := AValue;
    Changed;
  end;
end;

procedure TCustomMemo.SetModified(AValue: boolean);
begin
  if (FModified <> AValue) then
  begin
    FModified := AValue;
  end;
end;

procedure TCustomMemo.SetReadOnly(AValue: boolean);
begin
  if (FReadOnly <> AValue) then
  begin
    FReadOnly := AValue;
    Changed;
  end;
end;

procedure TCustomMemo.SetSelLength(AValue: NativeInt);
begin
  if (AValue < 0) then
  begin
    AValue := 0;
  end;
  if (FSelLength <> AValue) then
  begin
    FSelLength := AValue;
    Changed;
  end;
end;

procedure TCustomMemo.SetSelStart(AValue: NativeInt);
begin
  if (FSelStart <> AValue) then
  begin
    FSelStart := AValue;
    Changed;
  end;
end;

procedure TCustomMemo.SetSelText(AValue: string);
  var VText: string;
      VLength: NativeInt;
      VStart: NativeInt;
begin
   if (not ReadOnly) then begin
      VText := RealGetText;
      VLength := SelLength;
      VStart := SelStart;
      if (VLength = 0) then begin
         System.Insert(AValue, VText, VStart + 1);
      end else begin
         System.Delete(VText, VStart + 1, VLength);
         System.Insert(AValue, VText, VStart + 1);
      end;
      if (MaxLength > 0) then begin
         VText := Copy(VText, 1, MaxLength);
      end;
      RealSetText(VText);
      FSelStart := VStart + Length(AValue);
      FSelLength := 0;
      Changed;
   end;
end;

procedure TCustomMemo.SetTextHint(AValue: string);
begin
  if (FTextHint <> AValue) then
  begin
    FTextHint := AValue;
  end;
end;

procedure TCustomMemo.SetWantReturns(AValue: boolean);
begin
  if (FWantReturns <> AValue) then
  begin
    FWantReturns := AValue;
  end;
end;

procedure TCustomMemo.SetWantTabs(AValue: boolean);
begin
  if (FWantTabs <> AValue) then
  begin
    FWantTabs := AValue;
  end;
end;

procedure TCustomMemo.SetWordWrap(AValue: boolean);
begin
  if (FWordWrap <> AValue) then
  begin
    FWordWrap := AValue;
    Changed;
  end;
end;

procedure TCustomMemo.Change;
begin
  if (Assigned(FOnChange)) then
  begin
    FOnChange(Self);
  end;
end;

procedure TCustomMemo.KeyDown(var Key: NativeInt; Shift: TShiftState);
  var StartPos: NativeInt;
      NewText: String;
begin
   inherited KeyDown(Key, Shift);
   if (not FWantReturns) and (Key = 13) then begin
      Key := 0;
   end;
   if (FWantTabs) and (Key = 9) then begin
      StartPos := TJSHTMLTextAreaElement(HandleElement).selectionStart;
      NewText := Text;
      System.Insert(#9, NewText, StartPos + 1);
      Text := NewText;
      TJSHTMLTextAreaElement(HandleElement).selectionEnd := StartPos + 1;
      Key := 0;
   end;
end;

function TCustomMemo.HandleChange(AEvent: TJSEvent): boolean;
  var VNewText: string;
      VOldText: string;
begin
   AEvent.StopPropagation;

   // Blocchiamo gli aggiornamenti verso il browser perché è l'utente che scrive
   FIsUserTyping := True;
   try
      VNewText := TJSHTMLTextAreaElement(HandleElement).Value;
      // Nota: RealGetText usa FLines che usa la funzione GetTextStr che hai postato
      VOldText := RealGetText;

      if (VNewText <> VOldText) then begin
         FLines.Text := VNewText;
         FModified := True;
         Change;
      end;
   finally
      // Rilasciamo il blocco
      FIsUserTyping := False;
   end;

   Result := True;
end;

procedure TCustomMemo.Changed;
begin
   inherited Changed;
   if (not IsUpdating) and not (csLoading in ComponentState) then begin
      if (HandleClass = '') then begin
         _RegisterWCLStdRules;
         asm this.FHandleElement.classList.add('wcl-input'); end;
      end;
      with TJSHTMLTextAreaElement(HandleElement) do begin
         /// Alignment
         case Alignment of
            taRightJustify: Style.SetProperty('text-align', 'right');
            taCenter: Style.SetProperty('text-align', 'center');
            else Style.RemoveProperty('text-align');
         end;
         /// CharCase
         case FCharCase of
            ecLowerCase: Style.SetProperty('text-transform', 'lowercase');
            ecUppercase: Style.SetProperty('text-transform', 'uppercase');
            else Style.RemoveProperty('text-transform');
         end;
         /// Max Length
         if (FMaxLength > 0) then begin
            MaxLength := FMaxLength;
         end else begin
            RemoveAttribute('maxlength');
         end;
         /// Placeholder
         if (FTextHint <> '') then begin
            Placeholder := FTextHint;
         end else begin
            RemoveAttribute('placeholder');
         end;
         /// ReadOnly
         ReadOnly := FReadOnly;
         /// Resize
         Style.SetProperty('resize', 'none');
         /// WordWrap
         if (FWordWrap) then begin
            RemoveAttribute('wrap');
         end else begin
            Wrap := 'off';
         end;
         /// Scroll
         Style.SetProperty('overflow', 'auto');
         /// Text
         // AGGIORNA IL DOM SOLO SE NON STA SCRIVENDO L'UTENTE
         if not FIsUserTyping then begin
            Value := RealGetText;
            SetSelectionRange(FSelStart, FSelStart + FSelLength);
			end;
		end;
      HandleElement.setAttribute('name', Name );
   end;
end;

function TCustomMemo.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('textarea'));
end;

procedure TCustomMemo.RegisterHandleEvents;
begin
  inherited RegisterHandleEvents;
  with HandleElement do
  begin
    AddEventListener('input', TJSEventHandler(@HandleChange));
  end;
end;

procedure TCustomMemo.UnRegisterHandleEvents;
begin
  inherited UnRegisterHandleEvents;
  with HandleElement do
  begin
    RemoveEventListener('input', TJSEventHandler(@HandleChange));
  end;
end;

{$push}
{$hints off}

function TCustomMemo.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  Result := False;
end;

{$pop}

function TCustomMemo.RealGetText: string;
begin
  Result := FLines.Text;
end;

procedure TCustomMemo.RealSetText(const AValue: string);
begin
  FLines.Text := AValue;
  FModified := False;
  Changed;
end;

class function TCustomMemo.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 150;
  Result.Cy := 90;
end;

constructor TCustomMemo.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FIsUserTyping := False; // Inizializza a False

  FLines := TCustomMemoStrings.Create;
  FLines.SkipLastLineBreak:=True;

  // Impostiamo il LineBreak a #10 (LF) che è lo standard per i controlli Web/HTML
  FLines.LineBreak := #10;
  // StrictDelimiter := True impedisce a TStringList di aggiungere un LineBreak extra
  // alla fine del testo se non è esplicitamente presente una riga vuota.
  FLines.StrictDelimiter := True;

  TCustomMemoStrings(FLines).OnChange := HandleLinesChange;
  FMaxLength := 0;
  FModified := False;
  FReadOnly := False;
  FTextHint := '';
  FWantReturns := True;
  FWantTabs := False;
  FWordWrap := True;
  BeginUpdate;
  try
    with GetControlClassDefaultSize do
    begin
      SetBounds(0, 0, Cx, Cy);
    end;
  finally
    EndUpdate;
  end;
end;

destructor TCustomMemo.Destroy;
begin
  FLines.Destroy;
  FLines := nil;
  inherited Destroy;
end;

procedure TCustomMemo.Append(const AValue: string);
begin
  FLines.Append(AValue);
  Changed;
end;

procedure TCustomMemo.Clear;
begin
  FLines.Clear;
  Changed;
end;

procedure TCustomMemo.SelectAll;
begin
  if (RealGetText <> '') then
  begin
    BeginUpdate;
    try
      SetSelStart(0);
      SetSelLength(Length(RealGetText));
    finally
      EndUpdate;
    end;
  end;
end;

{ TCustomButton }

procedure TCustomButton.SetCancel(AValue: boolean);
begin
  if (FCancel <> AValue) then
  begin
    FCancel := AValue;
  end;
end;

procedure TCustomButton.SetDefault(AValue: boolean);
begin
  if (FDefault <> AValue) then
  begin
    FDefault := AValue;
  end;
end;

procedure TCustomButton.Changed;
begin
   inherited Changed;
   if (not IsUpdating) and not (csLoading in ComponentState) then begin
      if (HandleClass = '') then begin
         _RegisterWCLStdRules;
         asm this.FHandleElement.classList.add('wcl-btn'); end;
      end;
      with HandleElement do begin
         Style.SetProperty('display', 'inline-flex');
         InnerHTML := Self.Caption;
      end;
      HandleElement.setAttribute('name', Name );
   end;
end;

function TCustomButton.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('button'));
end;

{$push}
{$hints off}

function TCustomButton.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  Result := False;
end;

{$pop}

class function TCustomButton.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 80;
  Result.Cy := 25;
end;

constructor TCustomButton.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FModalResult := mrNone;
  BeginUpdate;
  try
    with GetControlClassDefaultSize do
    begin
      SetBounds(0, 0, Cx, Cy);
    end;
  finally
    EndUpdate;
  end;
end;

procedure TCustomButton.AdjustSize;
var
  VSize: TSize;
begin
  inherited AdjustSize;
  VSize := Font.TextExtent(Caption);
  SetBounds(Left, Top, VSize.Cx, VSize.Cy);
end;

procedure TCustomButton.Click;
var
  VParent: TControl;
begin
  if (FModalResult <> mrNone) then
  begin
    VParent := Parent;
    while (Assigned(VParent)) do
    begin
      if (VParent is TCustomForm) then
      begin
        TCustomForm(VParent).ModalResult := FModalResult;
        Break;
      end;
      VParent := VParent.Parent;
    end;
  end;
  inherited Click;
end;

{ TCustomCheckbox }

function TCustomCheckbox.GetChecked: boolean;
begin
  Result := (GetState = cbChecked);
end;

function TCustomCheckbox.GetState: TCheckBoxState;
begin
  Result := FState;
end;

procedure TCustomCheckbox.SetAlignment(AValue: TLeftRight);
begin
   if (FAlignment <> AValue) then begin
      FAlignment := AValue;
      //Changed;
   end;
end;

procedure TCustomCheckbox.SetChecked(AValue: boolean);
begin
   if (AValue) then begin
      SetState(cbChecked);
   end else begin
      SetState(cbUnchecked);
   end;
end;

procedure TCustomCheckbox.SetState(AValue: TCheckBoxState);
begin
   if Enabled=false then exit;

   if (FState <> AValue) then begin
      FState := AValue;
      Changed;
      DoOnChange;
   end;
end;

procedure TCustomCheckbox.DoOnChange;
begin
  if (Assigned(FOnChange)) then begin
     FOnChange(Self);
  end;
end;

function TCustomCheckbox.HandleClick(AEvent: TJSMouseEvent): boolean;
begin
   if Enabled=false then exit;
   SetChecked(FState <> cbChecked);
   Result := inherited HandleClick(AEvent);
end;

procedure TCustomCheckbox.Changed;
begin
   inherited Changed;
   if (not IsUpdating) and not (csLoading in ComponentState) then begin
      with HandleElement do begin
         /// Prevent text selection
         Style.SetProperty('user-select', 'none');
         Style.SetProperty('-moz-user-select', 'none');
         Style.SetProperty('-ms-user-select', 'none');
         Style.SetProperty('-khtml-user-select', 'none');
         Style.SetProperty('-webkit-user-select', 'none');
         /// Position
         Style.SetProperty('display', 'flex');
         Style.SetProperty('align-items', 'center');
      end;
      HandleElement.setAttribute('name', Name );

      /// Mark
      with FMarkElement do begin
         Checked := (FState = cbChecked);
         _type := 'checkbox';
        if Enabled=false then begin
           // Disable also checkbox element
           SetAttribute('disabled', 'true');
           //Style.SetProperty('opacity','0.5');
        end else begin
           RemoveAttribute('disabled');
           //Style.RemoveProperty('opacity');
        end;
      end;
      /// Label
      with FLabelElement do begin
         innerHTML := Caption;
      end;


   end;
end;

function TCustomCheckbox.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('span'));
end;

function TCustomCheckbox.CreateMarkElement: TJSHTMLInputElement;
begin
  Result := TJSHTMLInputElement(HandleElement.AppendChild(Document.CreateElement('input')));
end;

function TCustomCheckbox.CreateLabelElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(HandleElement.AppendChild(Document.CreateElement('span')));
end;

{$push}
{$hints off}

function TCustomCheckbox.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  Result := False;
end;

{$pop}

class function TCustomCheckbox.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 90;
  Result.Cy := 23;
end;

constructor TCustomCheckbox.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FMarkElement := CreateMarkElement;
  FLabelElement := CreateLabelElement;
  FAlignment := taRightJustify;
  FState := cbUnchecked;
  try
    with GetControlClassDefaultSize do
    begin
      SetBounds(0, 0, Cx, Cy);
    end;
  finally
    EndUpdate;
  end;
end;

function EscapeHTMLChar(AChar: char): string;
begin
  case AChar of
    '&': Result := '&amp;';
    '<': Result := '&lt;';
    '>': Result := '&gt;';
    '"': Result := '&quot;';
    '''': Result := '&#39;';
  else
    Result := AChar;
  end;
end;

function CaptionToAccelHTML(const AText: string; AShowAccel: Boolean): string;
var
  VIndex: NativeInt;
  VChar: char;
begin
  Result := '';
  VIndex := 1;
  while (VIndex <= Length(AText)) do
  begin
    VChar := AText[VIndex];
    if (VChar = '&') then
    begin
      if (VIndex < Length(AText)) and (AText[VIndex + 1] = '&') then
      begin
        Result := Result + '&amp;';
        Inc(VIndex, 2);
      end
      else if (VIndex < Length(AText)) and AShowAccel then
      begin
        Result := Result + '<u>' + EscapeHTMLChar(AText[VIndex + 1]) + '</u>';
        Inc(VIndex, 2);
      end
      else
      begin
        Result := Result + '&amp;';
        Inc(VIndex);
      end;
    end
    else
    begin
      Result := Result + EscapeHTMLChar(VChar);
      Inc(VIndex);
    end;
  end;
end;

{ TCustomLabel }

procedure TCustomLabel.SetAlignment(AValue: TAlignment);
begin
  if (FAlignment <> AValue) then
  begin
    FAlignment := AValue;
    Changed;
  end;
end;

procedure TCustomLabel.SetLayout(AValue: TTextLayout);
begin
  if (FLayout <> AValue) then
  begin
    FLayout := AValue;
    Changed;
  end;
end;

procedure TCustomLabel.SetShowAccelChar(AValue: boolean);
begin
  if (FShowAccelChar <> AValue) then
  begin
    FShowAccelChar := AValue;
    Changed;
  end;
end;

procedure TCustomLabel.SetTransparent(AValue: boolean);
begin
  if (FTransparent <> AValue) then
  begin
    FTransparent := AValue;
    BeginUpdate;
    try
      if (FTransparent) then
      begin
        Color := clNone;
      end
      else
      if (Color = clNone) then
      begin
        Color := clBackground;
      end;
    finally
      EndUpdate;
    end;
  end;
end;

procedure TCustomLabel.SetWordWrap(AValue: boolean);
begin
  if (FWordWrap <> AValue) then
  begin
    FWordWrap := AValue;
    Changed;
  end;
end;

procedure TCustomLabel.DoEnter;
begin
  inherited DoEnter;
  if (Assigned(FFocusControl)) and (FFocusControl.CanSetFocus) then
  begin
    FFocusControl.SetFocus;
  end;
end;

function TCustomLabel.HandleAccelKey(AEvent: TJSKeyBoardEvent): boolean;
var
  VIndex: NativeInt;
  VKey: string;
begin
  Result := False;
  if (not FShowAccelChar) or (not Assigned(FFocusControl)) or
    (not Assigned(AEvent)) or (not AEvent.altKey) then
    Exit;
  VKey := AEvent.Key;
  if (Length(VKey) <> 1) then
    Exit;
  VIndex := 1;
  while (VIndex <= Length(Caption)) do
  begin
    if (Caption[VIndex] = '&') then
    begin
      if (VIndex < Length(Caption)) and (Caption[VIndex + 1] = '&') then
        Inc(VIndex, 2)
      else if (VIndex < Length(Caption)) then
      begin
        if SameText(string(Caption[VIndex + 1]), VKey) then
        begin
          if FFocusControl.CanSetFocus then
            FFocusControl.SetFocus;
          AEvent.PreventDefault;
          AEvent.StopPropagation;
          Exit(True);
        end;
        Inc(VIndex, 2);
      end
      else
        Inc(VIndex);
    end
    else
      Inc(VIndex);
  end;
end;

procedure TCustomLabel.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then begin
    with HandleElement do begin
      /// Transparent
      if (FTransparent) then
      begin
        Style.SetProperty('background-color', 'transparent');
      end;
      /// Focus highlight
      Style.SetProperty('outline', 'none');
      /// Prevent text selection
      Style.SetProperty('user-select', 'none');
      Style.SetProperty('-moz-user-select', 'none');
      Style.SetProperty('-ms-user-select', 'none');
      Style.SetProperty('-khtml-user-select', 'none');
      Style.SetProperty('-webkit-user-select', 'none');
      /// Text wrapping
      Style.SetProperty('word-break', 'break-word');
      if AutoSize then begin
        Style.removeProperty('height');
        Style.removeProperty('width');
      end;
      /// Aligment
      case FAlignment of
        taCenter: Style.SetProperty('text-align', 'center');
        taLeftJustify: Style.SetProperty('text-align', 'left');
        taRightJustify: Style.SetProperty('text-align', 'right');
      end;
    end;
    HandleElement.setAttribute('name', Name );

    with FContentElement do
    begin
      /// Clear
      InnerHTML := '';
      /// Font
      UpdateHtmlElementFont(TJSHTMLElement(FContentElement), Font, False);
      /// Layout
      Style.SetProperty('display', 'table-cell');
      Style.SetProperty('width', IntToStr(Self.Width) + 'px');
      Style.SetProperty('height', IntToStr(Self.Height) + 'px');
      case FLayout of
        tlBottom: Style.SetProperty('vertical-align', 'bottom');
        tlCenter: Style.SetProperty('vertical-align', 'middle');
        tlTop: Style.SetProperty('vertical-align', 'top');
      end;
      /// WordWrap
      if (FWordWrap) then
      begin
        Style.SetProperty('word-wrap', 'break-word');
      end
      else
      begin
        Style.removeProperty('word-wrap');
      end;
      /// Scroll
      Style.SetProperty('overflow', 'hidden');
      /// Specifies how overflowed content
      Style.SetProperty('text-overflow', 'ellipsis');
      /// Caption (&X is an underlined accelerator when ShowAccelChar is set)
      InnerHTML := CaptionToAccelHTML(Self.Caption, FShowAccelChar);
    end;
  end;
end;

function TCustomLabel.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
end;

function TCustomLabel.CreateContentElement: TJSHTMLTableElement;
begin
  Result := TJSHTMLTableElement(HandleElement.AppendChild(Document.CreateElement('label')));
end;

{$push}
{$hints off}

function TCustomLabel.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  Result := False;
end;

{$pop}

class function TCustomLabel.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 65;
  Result.Cy := 17;
end;

constructor TCustomLabel.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FContentElement := CreateContentElement;
  FAlignment := taLeftJustify;
  FFocusControl := nil;
  FLayout := tlTop;
  FShowAccelChar := True;
  FTransparent := True;
  FWordWrap := False;
  Document.AddEventListener('keydown', TJSEventHandler(@HandleAccelKey));
  BeginUpdate;
  try
    TabStop := False;
    AutoSize := True;
    with GetControlClassDefaultSize do
    begin
      SetBounds(0, 0, Cx, Cy);
    end;
  finally
    EndUpdate;
  end;
end;

destructor TCustomLabel.Destroy;
begin
  Document.RemoveEventListener('keydown', TJSEventHandler(@HandleAccelKey));
  inherited Destroy;
end;

procedure TCustomLabel.AdjustSize;
begin
  inherited AdjustSize;
  Changed;
end;

{ TCustomScrollBar }

constructor TCustomScrollBar.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FKind := sbHorizontal;
  FLargeChange := 1;
  FMax := 100;
  FMin := 0;
  FPageSize := 0;
  FPosition := 0;
  FSmallChange := 1;
  BeginUpdate;
  try
    TabStop := True;
    with GetControlClassDefaultSize do
    begin
      SetBounds(0, 0, Cx, Cy);
    end;
  finally
    EndUpdate;
  end;
end;

class function TCustomScrollBar.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 120;
  Result.Cy := 24;
end;

function TCustomScrollBar.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
  FInput := TJSHTMLInputElement(Document.CreateElement('input'));
  FInput._type := 'range';
  Result.AppendChild(FInput);
end;

procedure TCustomScrollBar.RegisterHandleEvents;
begin
  inherited RegisterHandleEvents;
  FInput.addEventListener('input', TJSEventHandler(@HandleInput));
end;

procedure TCustomScrollBar.UnRegisterHandleEvents;
begin
  inherited UnRegisterHandleEvents;
  FInput.removeEventListener('input', TJSEventHandler(@HandleInput));
end;

procedure TCustomScrollBar.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    HandleElement.classList.add('wcl-scrollbar');
    if (FKind = sbVertical) then
      HandleElement.classList.add('wcl-scrollbar-vertical')
    else
      HandleElement.classList.remove('wcl-scrollbar-vertical');
    FInput.min := IntToStr(FMin);
    FInput.max := IntToStr(FMax);
    FInput.step := IntToStr(FSmallChange);
    FInput.Value := IntToStr(FPosition);
    FInput.setAttribute('aria-label', Name);
  end;
end;

procedure TCustomScrollBar.Change;
begin
  if Assigned(FOnChange) then
    FOnChange(Self);
end;

procedure TCustomScrollBar.Scroll(AScrollCode: TScrollCode;
  var AScrollPos: Integer);
begin
  if Assigned(FOnScroll) then
    FOnScroll(Self, AScrollCode, AScrollPos);
end;

function TCustomScrollBar.HandleInput(AEvent: TJSEvent): boolean;
var
  VPos: Integer;
begin
  AEvent.StopPropagation;
  VPos := StrToIntDef(FInput.Value, FMin);
  if (VPos < FMin) then
    VPos := FMin;
  if (VPos > FMax) then
    VPos := FMax;
  FPosition := VPos;
  Change;
  VPos := FPosition;
  Scroll(scTrack, VPos);
  if (VPos < FMin) then
    VPos := FMin;
  if (VPos > FMax) then
    VPos := FMax;
  FPosition := VPos;
  if (FInput.Value <> IntToStr(FPosition)) then
    FInput.Value := IntToStr(FPosition);
  Result := True;
end;

procedure TCustomScrollBar.SetKind(AValue: TScrollBarKind);
begin
  if (FKind <> AValue) then
  begin
    FKind := AValue;
    Changed;
  end;
end;

procedure TCustomScrollBar.SetLargeChange(AValue: TScrollBarInc);
begin
  if (AValue < 1) then
    AValue := 1;
  if (AValue > 32768) then
    AValue := 32768;
  if (FLargeChange <> AValue) then
  begin
    FLargeChange := AValue;
    Changed;
  end;
end;

procedure TCustomScrollBar.SetMax(AValue: Integer);
begin
  if (AValue < FMin) then
    AValue := FMin;
  if (FMax <> AValue) then
  begin
    FMax := AValue;
    if (FPosition > FMax) then
      FPosition := FMax;
    Changed;
  end;
end;

procedure TCustomScrollBar.SetMin(AValue: Integer);
begin
  if (AValue > FMax) then
    AValue := FMax;
  if (FMin <> AValue) then
  begin
    FMin := AValue;
    if (FPosition < FMin) then
      FPosition := FMin;
    Changed;
  end;
end;

procedure TCustomScrollBar.SetPageSize(AValue: Integer);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FPageSize <> AValue) then
  begin
    FPageSize := AValue;
    Changed;
  end;
end;

procedure TCustomScrollBar.SetPosition(AValue: Integer);
begin
  if (AValue < FMin) then
    AValue := FMin;
  if (AValue > FMax) then
    AValue := FMax;
  if (FPosition <> AValue) then
  begin
    FPosition := AValue;
    Changed;
  end;
end;

procedure TCustomScrollBar.SetSmallChange(AValue: TScrollBarInc);
begin
  if (AValue < 1) then
    AValue := 1;
  if (AValue > 32768) then
    AValue := 32768;
  if (FSmallChange <> AValue) then
  begin
    FSmallChange := AValue;
    Changed;
  end;
end;

procedure TCustomScrollBar.SetParams(APosition, AMin, AMax, APageSize: Integer);
begin
  BeginUpdate;
  try
    if (AMin > AMax) then
      AMax := AMin;
    FMin := AMin;
    FMax := AMax;
    FPageSize := APageSize;
    if (FPageSize < 0) then
      FPageSize := 0;
    if (APosition < FMin) then
      APosition := FMin;
    if (APosition > FMax) then
      APosition := FMax;
    FPosition := APosition;
  finally
    EndUpdate;
  end;
end;

procedure TCustomScrollBar.SetParams(APosition, AMin, AMax: Integer);
begin
  SetParams(APosition, AMin, AMax, 0);
end;

end.
