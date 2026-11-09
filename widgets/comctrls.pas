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
unit ComCtrls;

{$I pas2js_widget.inc}

interface

uses
  Classes,
  SysUtils,
  Types,
  JS,
  Web,
  Graphics,
  Controls,
  Generics.Collections;

type
  /// Forward declaration
  TCustomPageControl = class;

  TTabPosition = (tpTop, tpBottom, tpLeft, tpRight);

  { TCustomTabSheet }

  TCustomTabSheet = class(TWinControl)
  private
    FTabVisible: boolean;
    function GetPageControl: TCustomPageControl;
    function GetPageIndex: NativeInt;
    procedure SetPageControl(AValue: TCustomPageControl);
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
  public
    constructor Create(AOwner: TComponent); override;
    property PageIndex: NativeInt read GetPageIndex;
    property PageControl: TCustomPageControl read GetPageControl write SetPageControl;
    property TabVisible: boolean read FTabVisible write FTabVisible;
  end;

  { TTabSheet }

  TTabSheet = class(TCustomTabSheet)
  published
    property Caption;
    property ClientHeight;
    property ClientWidth;
    property Color;
    property Enabled;
    property Font;
    property Height;
    property Left;
    property PageIndex;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property TabVisible;
    property Top;
    property Width;
    property OnEnter;
    property OnExit;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
  end;

  { TCustomPageControl }

  TCustomPageControl = class(TWinControl)
  private
    FMultiLine: boolean;
    FOnShowPage: TNotifyEvent;
    FPageIndex: NativeInt;
    FPages: TJSArray;
    FShowTabs: boolean;
    FTabContainerElement: TJSHTMLElement;
    FTabHeight: smallint;
    FTabPosition: TTabPosition;
    FTabWidth: smallint;
    function GetActivePage: TCustomTabSheet;
    function GetPage(const AIndex: NativeInt): TCustomTabSheet;
    function GetPageCount: NativeInt;
    procedure SetActivePage(AValue: TCustomTabSheet);
    procedure SetMultiLine(AValue: boolean);
    procedure SetPageIndex(AValue: NativeInt);
    procedure SetShowTabs(AValue: boolean);
    procedure SetTabHeight(AValue: smallint);
    procedure SetTabPosition(AValue: TTabPosition);
    procedure SetTabWidth(AValue: smallint);
  protected
    property TabIndex: NativeInt read FPageIndex write SetPageIndex;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    function CreateTabContainerElement: TJSHTMLElement; virtual;
    procedure RegisterChild(AControl: TControl); override;
    procedure UnRegisterChild(AControl: TControl); override;
    function CalcTabHeight: NativeInt; virtual;
    function CalcTabWidth(const AText: string): NativeInt; virtual;
    function CalcMaxTabWidth: NativeInt; virtual;
    function CalcSumTabsWidth: NativeInt; virtual;
    function IndexOfTab(const ACaption: string): NativeInt;
    function RenderTab(const ACaption: string; const ALeft, ATop, AWidth, AHeight: NativeInt; const AEvent: JSValue): TJSHTMLElement; virtual;
    function RenderTabActive(const ACaption: string; const ALeft, ATop, AWidth, AHeight: NativeInt; const AEvent: JSValue): TJSHTMLElement; virtual;
    function RenderTabLeft(const ALeft, ATop, AWidth, AHeight: NativeInt; const AEvent: JSValue): TJSHTMLElement; virtual;
    function RenderTabRight(const ALeft, ATop, AWidth, AHeight: NativeInt; const AEvent: JSValue): TJSHTMLElement; virtual;
    procedure RenderTabs; virtual;
    procedure TabClick(AEvent: TJSMouseEvent); virtual;
    procedure TabLeftClick(AEvent: TJSMouseEvent); virtual;
    procedure TabRightClick(AEvent: TJSMouseEvent); virtual;
    procedure UpdatePages; virtual;
    procedure DoShowPage; virtual;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    function AddTabSheet: TCustomTabSheet;
    function IndexOf(APage: TCustomTabSheet): NativeInt; virtual;
    property PageCount: NativeInt read GetPageCount;
    property Pages[const AIndex: NativeInt]: TCustomTabSheet read GetPage;
  public
    property ActivePage: TCustomTabSheet read GetActivePage write SetActivePage;
    property MultiLine: boolean read FMultiLine write SetMultiLine;
    property ShowTabs: boolean read FShowTabs write SetShowTabs;
    property TabHeight: smallint read FTabHeight write SetTabHeight;
    property TabPosition: TTabPosition read FTabPosition write SetTabPosition;
    property TabWidth: smallint read FTabWidth write SetTabWidth;
    property OnShowPage: TNotifyEvent read FOnShowPage write FOnShowPage;
  end;

type
  /// Forward declarations
  TTreeNodes = class;
  TTreeNode = class;
  TCustomTreeView = class;

  TTreeViewExpandingEvent = procedure(Sender: TObject; Node: TTreeNode;
    var AllowExpansion: Boolean) of object;
  TTreeViewCollapsingEvent = procedure(Sender: TObject; Node: TTreeNode;
    var AllowCollapse: Boolean) of object;
  TTreeViewExpandedEvent = procedure(Sender: TObject; Node: TTreeNode) of object;

  { TTreeNode }

  /// One entry of a TTreeView. Nodes are owned by the TTreeNodes collection
  /// (the flat list exposed as TreeView.Items) and know their parent and
  /// their direct children.
  TTreeNode = class(TPersistent)
  private
    FChildren: TList<TTreeNode>;
    FData: TObject;
    FExpanded: Boolean;
    FImageUrl: string;
    FNodes: TTreeNodes;
    FParent: TTreeNode;
    FText: string;
    function GetAbsoluteIndex: NativeInt;
    function GetCount: NativeInt;
    function GetExpanded: Boolean;
    function GetFirstChild: TTreeNode;
    function GetHasChildren: Boolean;
    function GetIndex: NativeInt;
    function GetItem(const AIndex: NativeInt): TTreeNode;
    function GetLastChild: TTreeNode;
    function GetLevel: NativeInt;
    function GetNext: TTreeNode;
    function GetNextSibling: TTreeNode;
    function GetPrev: TTreeNode;
    function GetPrevSibling: TTreeNode;
    function GetSelected: Boolean;
    procedure SetExpanded(AValue: Boolean);
    procedure SetImageUrl(const AValue: string);
    procedure SetSelected(AValue: Boolean);
    procedure SetText(const AValue: string);
    procedure TreeChanged;
  public
    constructor Create(ANodes: TTreeNodes; AParent: TTreeNode);
    destructor Destroy; override;
    procedure Collapse(ARecurse: Boolean = False);
    procedure Delete;
    procedure DeleteChildren;
    procedure Expand(ARecurse: Boolean = False);
    procedure MakeVisible;
    procedure ToggleExpanded;
    property AbsoluteIndex: NativeInt read GetAbsoluteIndex;
    property Count: NativeInt read GetCount;
    property Data: TObject read FData write FData;
    property Expanded: Boolean read GetExpanded write SetExpanded;
    property FirstChild: TTreeNode read GetFirstChild;
    property HasChildren: Boolean read GetHasChildren;
    property ImageUrl: string read FImageUrl write SetImageUrl;
    property Index: NativeInt read GetIndex;
    property Item[const AIndex: NativeInt]: TTreeNode read GetItem; default;
    property LastChild: TTreeNode read GetLastChild;
    property Level: NativeInt read GetLevel;
    property Next: TTreeNode read GetNext;
    property NextSibling: TTreeNode read GetNextSibling;
    property Parent: TTreeNode read FParent;
    property Prev: TTreeNode read GetPrev;
    property PrevSibling: TTreeNode read GetPrevSibling;
    property Selected: Boolean read GetSelected write SetSelected;
    property Text: string read FText write SetText;
  end;

  { TTreeNodes }

  /// Flat collection of every node of a tree (Item[] is the absolute index,
  /// Roots[] the top level ones). Add/AddChild keep it in sync.
  TTreeNodes = class(TPersistent)
  private
    FAll: TList<TTreeNode>;
    FRoots: TList<TTreeNode>;
    FTree: TCustomTreeView;
    function GetCount: NativeInt;
    function GetItem(const AIndex: NativeInt): TTreeNode;
    function GetRoot(const AIndex: NativeInt): TTreeNode;
    function GetRootCount: NativeInt;
    procedure ReadData(Stream: TStream);
    procedure WriteData(Stream: TStream);
    function AddNode(AParent: TTreeNode; AIndex: NativeInt;
      const AText: string): TTreeNode;
  protected
    procedure DefineProperties(Filer: TFiler); override;
    procedure RemoveSubtree(ANode: TTreeNode);
  public
    constructor Create(ATree: TCustomTreeView);
    destructor Destroy; override;
    /// Adds a node as the last sibling of AParent (nil = top level), as in LCL.
    function Add(AParent: TTreeNode; const AText: string): TTreeNode; overload;
    function Add(const AText: string): TTreeNode; overload;
    function AddChild(AParent: TTreeNode; const AText: string): TTreeNode;
    function Insert(AParent: TTreeNode; AIndex: NativeInt;
      const AText: string): TTreeNode;
    procedure AlphaSort;
    procedure Clear;
    procedure Delete(ANode: TTreeNode);
    function GetFirstNode: TTreeNode;
    function IndexOf(ANode: TTreeNode): NativeInt;
    property Count: NativeInt read GetCount;
    property Item[const AIndex: NativeInt]: TTreeNode read GetItem; default;
    property RootCount: NativeInt read GetRootCount;
    property Roots[const AIndex: NativeInt]: TTreeNode read GetRoot;
    property Tree: TCustomTreeView read FTree;
  end;

  { TCustomTreeView }

  /// LCL-compatible tree view rendered with nested <ul>/<li> elements. Nodes
  /// are created in code (the binary Items.Data saved by the IDE is ignored).
  TCustomTreeView = class(TWinControl)
  private
    FIndent: NativeInt;
    FItems: TTreeNodes;
    FOnChange: TNotifyEvent;
    FOnCollapsed: TTreeViewExpandedEvent;
    FOnCollapsing: TTreeViewCollapsingEvent;
    FOnExpanded: TTreeViewExpandedEvent;
    FOnExpanding: TTreeViewExpandingEvent;
    FRowHeight: NativeInt;
    FSelected: TTreeNode;
    FShowButtons: Boolean;
    FShowLines: Boolean;
    FShowRoot: Boolean;
    procedure SetIndent(AValue: NativeInt);
    procedure SetRowHeight(AValue: NativeInt);
    procedure SetSelected(AValue: TTreeNode);
    procedure SetShowButtons(AValue: Boolean);
    procedure SetShowLines(AValue: Boolean);
    procedure SetShowRoot(AValue: Boolean);
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure CollectVisible(AList: TList<TTreeNode>);
    procedure DoChange; virtual;
    procedure DoCollapsed(ANode: TTreeNode); virtual;
    function DoCollapsing(ANode: TTreeNode): Boolean; virtual;
    procedure DoExpanded(ANode: TTreeNode); virtual;
    function DoExpanding(ANode: TTreeNode): Boolean; virtual;
    function FindNodeElement(ANode: TTreeNode): TJSHTMLElement;
    function NodeFromEvent(AEvent: TJSMouseEvent): TTreeNode;
    procedure RenderNode(AUl: TJSHTMLElement; ANode: TTreeNode);
    procedure RenderTree; virtual;
    procedure ScrollToNode(ANode: TTreeNode);
    procedure SelectNode(ANode: TTreeNode; AFocus: Boolean);
    procedure UpdateVisibleSelection(ADelta: NativeInt);
    procedure ExpandSelected;
    procedure CollapseSelected;
    procedure SelectFirst;
    procedure SelectLast;
    function NodeClick(AEvent: TJSMouseEvent): boolean;
    function NodeDblClick(AEvent: TJSMouseEvent): boolean;
    function NodeToggleClick(AEvent: TJSMouseEvent): boolean;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
    procedure KeyDown(var Key: NativeInt; Shift: TShiftState); override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    procedure AlphaSort;
    procedure FullCollapse;
    procedure FullExpand;
    property Indent: NativeInt read FIndent write SetIndent default 18;
    property Items: TTreeNodes read FItems;
    property RowHeight: NativeInt read FRowHeight write SetRowHeight default 0;
    property Selected: TTreeNode read FSelected write SetSelected;
    property ShowButtons: Boolean read FShowButtons write SetShowButtons default True;
    property ShowLines: Boolean read FShowLines write SetShowLines default True;
    property ShowRoot: Boolean read FShowRoot write SetShowRoot default True;
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
    property OnCollapsed: TTreeViewExpandedEvent read FOnCollapsed write FOnCollapsed;
    property OnCollapsing: TTreeViewCollapsingEvent read FOnCollapsing write FOnCollapsing;
    property OnExpanded: TTreeViewExpandedEvent read FOnExpanded write FOnExpanded;
    property OnExpanding: TTreeViewExpandingEvent read FOnExpanding write FOnExpanding;
  end;

  { TTreeView }

  TTreeView = class(TCustomTreeView)
  published
    property Align;
    property Anchors;
    property BorderSpacing;
    property Color;
    property Enabled;
    property Font;
    property HandleClass;
    property HandleId;
    property Height;
    property Indent;
    property Items;
    property Left;
    property ParentFont;
    property ParentShowHint;
    property PopupMenu;
    property RowHeight;
    property ShowButtons;
    property ShowHint;
    property ShowLines;
    property ShowRoot;
    property TabOrder;
    property TabStop;
    property Top;
    property Visible;
    property Width;
    property OnChange;
    property OnClick;
    property OnCollapsed;
    property OnCollapsing;
    property OnDblClick;
    property OnEnter;
    property OnExit;
    property OnExpanded;
    property OnExpanding;
    property OnKeyDown;
    property OnKeyPress;
    property OnKeyUp;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
  end;

implementation

uses
  Forms;

{ TCustomTabSheet }

function TCustomTabSheet.GetPageControl: TCustomPageControl;
begin
  if (Parent is TCustomPageControl) then
  begin
    Result := TCustomPageControl(Parent);
  end
  else
  begin
    Result := nil;
  end;
end;

function TCustomTabSheet.GetPageIndex: NativeInt;
begin
  if (Parent is TCustomPageControl) then
  begin
    Result := TCustomPageControl(Parent).IndexOf(Self);
  end
  else
  begin
    Result := -1;
  end;
end;

procedure TCustomTabSheet.SetPageControl(AValue: TCustomPageControl);
begin
  /// The old condition was inverted: with Parent = nil, PageControl is nil too,
  /// so "PageControl = AValue" was False and the sheet was never parented.
  if (PageControl <> AValue) then
  begin
    Parent := AValue;
  end;
end;

procedure TCustomTabSheet.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    with HandleElement do
    begin
      /// Color
      Style.SetProperty('background-color', '#fff');
      /// Focus highlight
      Style.SetProperty('outline', 'none');
      /// Borders
      Style.SetProperty('border', '1px solid #c9c3ba');
      Style.SetProperty('border-top', '0px');
    end;
  end;
end;

function TCustomTabSheet.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('span'));
end;

constructor TCustomTabSheet.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FTabVisible := True;
  BeginUpdate;
  try
    Visible := False;
  finally
    EndUpdate;
  end;
end;

{ TCustomPageControl }

function TCustomPageControl.GetActivePage: TCustomTabSheet;
begin
  Result := GetPage(FPageIndex);
end;

function TCustomPageControl.GetPage(const AIndex: NativeInt): TCustomTabSheet;
begin
  if (AIndex >= 0) and (AIndex < FPages.Length) then
  begin
    Result := TCustomTabSheet(FPages[AIndex]);
  end
  else
  begin
    Result := nil;
  end;
end;

function TCustomPageControl.GetPageCount: NativeInt;
begin
  Result := FPages.Length;
end;

procedure TCustomPageControl.SetActivePage(AValue: TCustomTabSheet);
begin
  SetPageIndex(FPages.IndexOf(AValue));
end;

procedure TCustomPageControl.SetMultiLine(AValue: boolean);
begin
  if (FMultiLine <> AValue) then
  begin
    FMultiLine := AValue;
  end;
end;

procedure TCustomPageControl.SetPageIndex(AValue: NativeInt);
begin
  if (AValue < 0) or (AValue >= FPages.Length) then
  begin
    AValue := 0;
  end;
  if (AValue <> FPageIndex) then
  begin
    FPageIndex := AValue;
    Changed;
    DoShowPage;
  end;
end;

procedure TCustomPageControl.SetShowTabs(AValue: boolean);
begin
  if (FShowTabs <> AValue) then
  begin
    FShowTabs := AValue;
    Changed;
  end;
end;

procedure TCustomPageControl.SetTabHeight(AValue: smallint);
begin
  if (FTabHeight <> AValue) then
  begin
    FTabHeight := AValue;
    Changed;
  end;
end;

procedure TCustomPageControl.SetTabPosition(AValue: TTabPosition);
begin
  if (FTabPosition <> AValue) then
  begin
    FTabPosition := AValue;
  end;
end;

procedure TCustomPageControl.SetTabWidth(AValue: smallint);
begin
  if (FTabWidth <> AValue) then
  begin
    FTabWidth := AValue;
    Changed;
  end;
end;

procedure TCustomPageControl.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    with HandleElement do
    begin
      /// Focus highlight
      Style.SetProperty('outline', 'none');
    end;
    RenderTabs;
    UpdatePages;
  end;
end;

function TCustomPageControl.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
end;

function TCustomPageControl.CreateTabContainerElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('span'));
  HandleElement.AppendChild(Result);
end;

procedure TCustomPageControl.RegisterChild(AControl: TControl);
var
  VIndex: NativeInt;
begin
  inherited RegisterChild(AControl);
  if (Assigned(AControl)) and (AControl is TCustomTabSheet) then
  begin
    VIndex := FPages.IndexOf(AControl);
    if (VIndex < 0) then
    begin
      FPages.Push(AControl);
    end;
  end;
end;

procedure TCustomPageControl.UnRegisterChild(AControl: TControl);
var
  VIndex: NativeInt;
begin
  inherited UnRegisterChild(AControl);
  if (Assigned(AControl)) and (AControl is TCustomTabSheet) then
  begin
    VIndex := FPages.IndexOf(AControl);
    if (VIndex >= 0) then
    begin
      FPages.Splice(VIndex, 1);
    end;
  end;
end;

function TCustomPageControl.CalcTabHeight: NativeInt;
begin
  if (FShowTabs) then
  begin
    if (FTabHeight > 0) then
    begin
      Result := FTabHeight;
    end
    else
    begin
      Result := Font.TextHeight('Fj') + 10;
      /// A finger needs a bigger target than a mouse pointer.
      if Screen.IsTouch and (Result < 36) then
        Result := 36;
    end;
  end
  else
  begin
    Result := 0;
  end;
end;

function TCustomPageControl.CalcTabWidth(const AText: string): NativeInt;
begin
  if (FTabWidth > 0) then
  begin
    Result := FTabWidth;
  end
  else
  begin
    Result := Font.TextWidth(AText) + 10;
  end;
end;

function TCustomPageControl.CalcMaxTabWidth: NativeInt;
var
  VPage: TCustomTabSheet;
  VIndex: NativeInt;
  VWidth: NativeInt;
begin
  Result := 0;
  if (FTabWidth > 0) then
  begin
    Result := FTabWidth;
  end
  else
  begin
    for VIndex := 0 to (FPages.Length - 1) do
    begin
      VPage := TCustomTabSheet(FPages[VIndex]);
      if (Assigned(VPage)) and (VPage.TabVisible) then
      begin
        VWidth := CalcTabWidth(VPage.Caption);
        if (VWidth > Result) then
        begin
          Result := VWidth;
        end;
      end;
    end;
  end;
end;

function TCustomPageControl.CalcSumTabsWidth: NativeInt;
var
  VIndex: NativeInt;
  VPage: TCustomTabSheet;
begin
  Result := 0;
  for VIndex := 0 to (FPages.Length - 1) do
  begin
    VPage := TCustomTabSheet(FPages[VIndex]);
    if (Assigned(VPage)) and (VPage.TabVisible) then
    begin
      Result := Result + CalcTabWidth(VPage.Caption);
    end;
  end;
end;

function TCustomPageControl.IndexOfTab(const ACaption: string): NativeInt;
var
  VIndex: NativeInt;
  VPage: TCustomTabSheet;
begin
  Result := -1;
  for VIndex := 0 to (FPages.Length - 1) do
  begin
    VPage := TCustomTabSheet(FPages[VIndex]);
    if (Assigned(VPage)) and (VPage.TabVisible) and (SameText(VPage.Caption, ACaption)) then
    begin
      Result := VIndex;
    end;
  end;
end;

function TCustomPageControl.RenderTab(const ACaption: string; const ALeft, ATop, AWidth, AHeight: NativeInt; const AEvent: JSValue): TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('button'));
  with Result do
  begin
    /// Bounds
    Style.SetProperty('left', IntToStr(ALeft) + 'px');
    Style.SetProperty('top', IntToStr(ATop) + 'px');
    Style.SetProperty('width', IntToStr(AWidth) + 'px');
    Style.SetProperty('height', IntToStr(AHeight) + 'px');
    /// Border
    Style.SetProperty('border', '1px solid #c9c3ba');
    Style.SetProperty('border-top-left-radius', '15px');
    Style.SetProperty('border-top-right-radius', '2px');
    /// Color
    Style.SetProperty('background-color', '#dddada');
    /// Font   
    Style.SetProperty('color', JSColor(Font.Color));
    Style.SetProperty('font', JSFont(Font));
    /// Focus highlight
    Style.SetProperty('outline', 'none');
    /// Position
    Style.SetProperty('position', 'absolute');
    /// Scroll
    Style.SetProperty('overflow', 'hidden');
    /// Normalize caption
    Style.SetProperty('padding', '0');
    Style.SetProperty('white-space', 'nowrap');
    /// Click
    AddEventListener('click', AEvent);
    /// Caption
    InnerHTML := ACaption;
  end;
end;

function TCustomPageControl.RenderTabActive(const ACaption: string; const ALeft, ATop, AWidth, AHeight: NativeInt; const AEvent: JSValue): TJSHTMLElement;
begin
  Result := RenderTab(ACaption, ALeft, ATop, AWidth, AHeight, AEvent);
  with Result do
  begin
    /// Border
    Style.SetProperty('border-bottom', '0px');
    /// Color
    Style.SetProperty('background-color', '#fff');
  end;
end;

function TCustomPageControl.RenderTabLeft(const ALeft, ATop, AWidth, AHeight: NativeInt; const AEvent: JSValue): TJSHTMLElement;
begin
  Result := RenderTab('‹', ALeft, ATop, AWidth, AHeight, AEvent);
  with Result do
  begin
    /// Color
    Style.SetProperty('background-color', '#fff');
  end;
end;

function TCustomPageControl.RenderTabRight(const ALeft, ATop, AWidth, AHeight: NativeInt; const AEvent: JSValue): TJSHTMLElement;
begin
  Result := RenderTab('›', ALeft, ATop, AWidth, AHeight, AEvent);
  with Result do
  begin
    /// Color
    Style.SetProperty('background-color', '#fff');
  end;
end;

procedure TCustomPageControl.RenderTabs;
var
  form: TCustomForm;

  function AdjustWithPPI(aValue: Integer): Integer;
  begin
    if Assigned(form) then
      Result := Trunc(96 * aValue / form.DesignTimePPI)
    else
      Result := aValue;
  end;

  function FindParentForm: TCustomForm;
  var
    p: TWinControl;
  begin
    p := Parent;
    while Assigned(p) and not (p is TCustomForm) do
      p := p.Parent;
    if p is TCustomForm then
      Result := TCustomForm(p)
    else
      Result := Nil;
  end;

var
  VPage: TCustomTabSheet;
  VIndex: NativeInt;
  VStartIndex: NativeInt;
  VEndIndex: NativeInt;
  VTabCaption: string;
  VTabHeight: NativeInt;
  VTabLeft: NativeInt;
  VTabWidth: NativeInt;
  VSumTabsWidth: NativeInt;
  VMaxTabWidth: NativeInt;
  VTabsCount: NativeInt;
begin
  if (not FShowTabs) then
  begin
    FTabContainerElement.InnerHTML := '';
    FTabContainerElement.Style.SetProperty('display', 'none');
    Exit;
  end;
  FTabContainerElement.Style.SetProperty('display', 'block');
  form := FindParentForm;
  VTabHeight := CalcTabHeight;
  VSumTabsWidth := CalcSumTabsWidth;
  /// Containter
  with FTabContainerElement do
  begin
    /// Clean
    InnerHTML := '';
    /// Bounds
    Style.SetProperty('left', '0px');
    Style.SetProperty('top', '0px');
    Style.SetProperty('width', IntToStr(AdjustWithPPI(IfThen((VSumTabsWidth > Width), VSumTabsWidth, Width))) + 'px');
    Style.SetProperty('height', IntToStr(AdjustWithPPI(VTabHeight)) + 'px');
    /// Position
    Style.SetProperty('position', 'absolute');
    /// Scroll
    Style.SetProperty('overflow', 'hidden');
  end;
  /// Tabs
  if (FPageIndex > -1) and (FPageIndex < FPages.Length) then
  begin
    /// Quantity of tabs greater than the container
    if (VSumTabsWidth > Width) then
    begin
      VTabLeft := 40;
      VMaxTabWidth := CalcMaxTabWidth;
      VTabsCount := Trunc((Width - 80) div VMaxTabWidth);
      if (VTabsCount = 0) then
      begin
        VTabsCount := 1;
      end;
      if ((FPageIndex - VTabsCount) >= 0) then
      begin
        VStartIndex := (FPageIndex - VTabsCount) + 1;
        VEndIndex := FPageIndex;
      end
      else
      begin
        VStartIndex := 0;
        VEndIndex := VTabsCount - 1;
      end;
      VMaxTabWidth := Trunc((Width - 80) div VTabsCount);
      /// Tab
      for VIndex := VStartIndex to VEndIndex do
      begin
        VPage := TCustomTabSheet(FPages[VIndex]);
        if (Assigned(VPage)) and (VPage.TabVisible) then
        begin
          VTabCaption := VPage.Caption;
          VTabWidth := VMaxTabWidth;
          if (VIndex = FPageIndex) then
          begin
            /// Register tab
            FTabContainerElement.AppendChild(RenderTabActive(VTabCaption, AdjustWithPPI(VTabLeft), 0, AdjustWithPPI(VTabWidth), AdjustWithPPI(VTabHeight), @TabClick));
          end
          else
          begin
            /// Register tab
            FTabContainerElement.AppendChild(RenderTab(VTabCaption, AdjustWithPPI(VTabLeft), 0, AdjustWithPPI(VTabWidth), AdjustWithPPI(VTabHeight), @TabClick));
          end;
          /// Calculate the next position of the tab
          VTabLeft := VTabLeft + VTabWidth;
        end;
      end;
      /// Register navigation tabs
      with FTabContainerElement do // First and Last Tabs
      begin
        AppendChild(RenderTabLeft(0, 0, 40, AdjustWithPPI(VTabHeight), @TabLeftClick));
        AppendChild(RenderTabRight(AdjustWithPPI(Width - 40), 0, 40, AdjustWithPPI(VTabHeight), @TabRightClick));
      end;
    end
    else
    begin
      VTabLeft := 0;
      VStartIndex := 0;
      VEndIndex := (FPages.Length - 1);
      VTabWidth := (Width div FPages.Length);
      /// Tab
      for VIndex := VStartIndex to VEndIndex do
      begin
        VPage := TCustomTabSheet(FPages[VIndex]);
        if (Assigned(VPage)) and (VPage.TabVisible) then
        begin
          VTabCaption := VPage.Caption;
          if (VIndex = FPageIndex) then
          begin
            /// Register tab
            FTabContainerElement.AppendChild(RenderTabActive(VTabCaption, AdjustWithPPI(VTabLeft), 0, AdjustWithPPI(VTabWidth), AdjustWithPPI(VTabHeight), @TabClick));
          end
          else
          begin
            /// Register tab
            FTabContainerElement.AppendChild(RenderTab(VTabCaption, AdjustWithPPI(VTabLeft), 0, AdjustWithPPI(VTabWidth), AdjustWithPPI(VTabHeight), @TabClick));
          end;
          /// Calculate the next position of the tab
          VTabLeft := VTabLeft + VTabWidth;
        end;
      end;
    end;
  end;
end;

procedure TCustomPageControl.TabClick(AEvent: TJSMouseEvent);
begin
  SetPageIndex(IndexOfTab(AEvent.targetElement.InnerHTML));
end;

procedure TCustomPageControl.TabLeftClick(AEvent: TJSMouseEvent);
begin
  SetPageIndex(FPageIndex - 1);
end;

procedure TCustomPageControl.TabRightClick(AEvent: TJSMouseEvent);
begin
  SetPageIndex(FPageIndex + 1);
end;

procedure TCustomPageControl.UpdatePages;
var
  VIndex: NativeInt;
  VPage: TCustomTabSheet;
  VTabHeight: NativeInt;
begin
  VTabHeight := CalcTabHeight;
  for VIndex := 0 to (FPages.Length - 1) do
  begin
    VPage := TCustomTabSheet(FPages[VIndex]);
    if (Assigned(VPage)) and (VPage.TabVisible) then
    begin
      VPage.BeginUpdate;
      try
        if (VIndex = FPageIndex) then
        begin
          VPage.SetBounds(0, VTabHeight, (Width), ((Height) - VTabHeight));
          VPage.Visible := True;
        end
        else
        begin
          VPage.Visible := False;
        end;
      finally
        VPage.EndUpdate;
      end;
    end;
  end;
end;

procedure TCustomPageControl.DoShowPage;
begin
  if Assigned(FOnShowPage) then
    FOnShowPage(Self);
end;

class function TCustomPageControl.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 200; 
  Result.Cy := 200;
end;

constructor TCustomPageControl.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FTabContainerElement := CreateTabContainerElement;
  FPages := TJSArray.New();
  FPageIndex := -1;
  FShowTabs := True;
  FTabPosition := tpTop;
  BeginUpdate;
  try
    TabStop := False;
    with GetControlClassDefaultSize do
    begin
      SetBounds(0, 0, Cx, Cy);
    end;
  finally
    EndUpdate;
  end;
end;

destructor TCustomPageControl.Destroy;
begin
  FPages.Length := 0;
  inherited Destroy;
end;

function TCustomPageControl.AddTabSheet: TCustomTabSheet;
begin
  Result := TCustomTabSheet.Create(Self);
  Result.PageControl := Self;
end;

function TCustomPageControl.IndexOf(APage: TCustomTabSheet): NativeInt;
begin
  Result := FPages.IndexOf(APage);
end;

{ TTreeView styles }

var
  _WCLTreeRulesRegistered: Boolean;

procedure _RegisterWCLTreeRules;
begin
  if _WCLTreeRulesRegistered then
    Exit;
  RegisterWCLStyle(
    '.wcl-tree{' +
    'overflow:auto;' +
    'background:#fff;' +
    'border:1px solid #c9c3ba;' +
    'border-radius:4px;' +
    'box-sizing:border-box;' +
    'outline:none;' +
    'user-select:none;' +
    '-webkit-user-select:none;' +
    '-webkit-tap-highlight-color:transparent;}' +
    '.wcl-tree ul{' +
    'list-style:none;' +
    'margin:0;' +
    'padding:0;}' +
    '.wcl-tree-row{' +
    'display:flex;' +
    'align-items:center;' +
    'gap:4px;' +
    'min-height:24px;' +
    'padding:2px 6px;' +
    'cursor:pointer;' +
    'white-space:nowrap;' +
    'border-radius:3px;' +
    'color:#333;}' +
    '@media(hover:hover){' +
    '.wcl-tree-row:hover{background:#eef3fb;}' +
    '}' +
    '.wcl-tree-node.wcl-tree-selected>.wcl-tree-row{' +
    'background:#4A90D9;' +
    'color:#fff;}' +
    '.wcl-tree-toggle{' +
    'display:inline-flex;' +
    'align-items:center;' +
    'justify-content:center;' +
    'width:16px;' +
    'min-width:16px;' +
    'height:16px;' +
    'font-size:10px;' +
    'line-height:1;' +
    'color:#666;}' +
    '.wcl-tree-node.wcl-tree-selected>.wcl-tree-row .wcl-tree-toggle{' +
    'color:#fff;}' +
    '.wcl-tree-icon{' +
    'width:16px;' +
    'height:16px;' +
    'object-fit:contain;}' +
    '.wcl-tree-text{' +
    'overflow:hidden;' +
    'text-overflow:ellipsis;}' +
    '.wcl-tree.wcl-tree-lines ul.wcl-tree-children{' +
    'border-left:1px dotted #c9c3ba;' +
    'margin-left:7px;' +
    'padding-left:10px;}' +
    '@media(pointer:coarse){' +
    '.wcl-tree-row{min-height:36px;font-size:16px;}' +
    '.wcl-tree-toggle{width:20px;min-width:20px;height:20px;font-size:12px;}' +
    '}'
  );
  _WCLTreeRulesRegistered := True;
end;

{ TTreeNode }

constructor TTreeNode.Create(ANodes: TTreeNodes; AParent: TTreeNode);
begin
  inherited Create;
  FChildren := TList<TTreeNode>.Create;
  FData := nil;
  FExpanded := False;
  FImageUrl := '';
  FNodes := ANodes;
  FParent := AParent;
  FText := '';
end;

destructor TTreeNode.Destroy;
begin
  FChildren.Free;
  FChildren := nil;
  inherited Destroy;
end;

procedure TTreeNode.TreeChanged;
begin
  if Assigned(FNodes) and Assigned(FNodes.Tree) then
    FNodes.Tree.Changed;
end;

function TTreeNode.GetAbsoluteIndex: NativeInt;
begin
  if Assigned(FNodes) then
    Result := FNodes.IndexOf(Self)
  else
    Result := -1;
end;

function TTreeNode.GetCount: NativeInt;
begin
  Result := FChildren.Count;
end;

function TTreeNode.GetExpanded: Boolean;
begin
  Result := FExpanded;
end;

function TTreeNode.GetFirstChild: TTreeNode;
begin
  if (FChildren.Count > 0) then
    Result := FChildren[0]
  else
    Result := nil;
end;

function TTreeNode.GetHasChildren: Boolean;
begin
  Result := (FChildren.Count > 0);
end;

function TTreeNode.GetIndex: NativeInt;
begin
  if Assigned(FParent) then
    Result := FParent.FChildren.IndexOf(Self)
  else if Assigned(FNodes) then
    Result := FNodes.FRoots.IndexOf(Self)
  else
    Result := -1;
end;

function TTreeNode.GetItem(const AIndex: NativeInt): TTreeNode;
begin
  if (AIndex >= 0) and (AIndex < FChildren.Count) then
    Result := FChildren[AIndex]
  else
    Result := nil;
end;

function TTreeNode.GetLastChild: TTreeNode;
begin
  if (FChildren.Count > 0) then
    Result := FChildren[FChildren.Count - 1]
  else
    Result := nil;
end;

function TTreeNode.GetLevel: NativeInt;
var
  VNode: TTreeNode;
begin
  Result := 0;
  VNode := FParent;
  while Assigned(VNode) do
  begin
    Inc(Result);
    VNode := VNode.FParent;
  end;
end;

function TTreeNode.GetNext: TTreeNode;
var
  VIndex: NativeInt;
begin
  Result := nil;
  if (not Assigned(FNodes)) then
    Exit;
  VIndex := GetAbsoluteIndex;
  if (VIndex >= 0) and (VIndex < (FNodes.Count - 1)) then
    Result := FNodes[VIndex + 1];
end;

function TTreeNode.GetNextSibling: TTreeNode;
var
  VIndex: NativeInt;
begin
  Result := nil;
  if Assigned(FParent) then
  begin
    VIndex := FParent.FChildren.IndexOf(Self);
    if (VIndex >= 0) and (VIndex < (FParent.FChildren.Count - 1)) then
      Result := FParent.FChildren[VIndex + 1];
  end
  else if Assigned(FNodes) then
  begin
    VIndex := FNodes.FRoots.IndexOf(Self);
    if (VIndex >= 0) and (VIndex < (FNodes.FRoots.Count - 1)) then
      Result := FNodes.FRoots[VIndex + 1];
  end;
end;

function TTreeNode.GetPrev: TTreeNode;
var
  VIndex: NativeInt;
begin
  Result := nil;
  if (not Assigned(FNodes)) then
    Exit;
  VIndex := GetAbsoluteIndex;
  if (VIndex > 0) then
    Result := FNodes[VIndex - 1];
end;

function TTreeNode.GetPrevSibling: TTreeNode;
var
  VIndex: NativeInt;
begin
  Result := nil;
  if Assigned(FParent) then
  begin
    VIndex := FParent.FChildren.IndexOf(Self);
    if (VIndex > 0) then
      Result := FParent.FChildren[VIndex - 1];
  end
  else if Assigned(FNodes) then
  begin
    VIndex := FNodes.FRoots.IndexOf(Self);
    if (VIndex > 0) then
      Result := FNodes.FRoots[VIndex - 1];
  end;
end;

function TTreeNode.GetSelected: Boolean;
begin
  Result := Assigned(FNodes) and Assigned(FNodes.Tree) and
    (FNodes.Tree.Selected = Self);
end;

procedure TTreeNode.SetExpanded(AValue: Boolean);
begin
  if (FExpanded = AValue) then
    Exit;
  if AValue then
    Expand
  else
    Collapse;
end;

procedure TTreeNode.SetImageUrl(const AValue: string);
begin
  if (FImageUrl <> AValue) then
  begin
    FImageUrl := AValue;
    TreeChanged;
  end;
end;

procedure TTreeNode.SetSelected(AValue: Boolean);
begin
  if (not Assigned(FNodes)) or (not Assigned(FNodes.Tree)) then
    Exit;
  if AValue then
    FNodes.Tree.Selected := Self
  else if (FNodes.Tree.Selected = Self) then
    FNodes.Tree.Selected := nil;
end;

procedure TTreeNode.SetText(const AValue: string);
begin
  if (FText <> AValue) then
  begin
    FText := AValue;
    TreeChanged;
  end;
end;

procedure TTreeNode.Expand(ARecurse: Boolean);
var
  VIndex: NativeInt;
  VTree: TCustomTreeView;
begin
  if (not HasChildren) then
    Exit;
  VTree := nil;
  if Assigned(FNodes) then
    VTree := FNodes.Tree;
  if FExpanded then
  begin
    if ARecurse then
      for VIndex := 0 to (FChildren.Count - 1) do
        FChildren[VIndex].Expand(True);
    Exit;
  end;
  if Assigned(VTree) and (not VTree.DoExpanding(Self)) then
    Exit;
  if Assigned(VTree) then
    VTree.BeginUpdate;
  try
    FExpanded := True;
    if ARecurse then
      for VIndex := 0 to (FChildren.Count - 1) do
        FChildren[VIndex].Expand(True);
  finally
    if Assigned(VTree) then
      VTree.EndUpdate;
  end;
  if Assigned(VTree) then
    VTree.DoExpanded(Self);
end;

procedure TTreeNode.Collapse(ARecurse: Boolean);
var
  VIndex: NativeInt;
  VTree: TCustomTreeView;
begin
  if (not HasChildren) then
    Exit;
  VTree := nil;
  if Assigned(FNodes) then
    VTree := FNodes.Tree;
  if (not FExpanded) then
  begin
    if ARecurse then
      for VIndex := 0 to (FChildren.Count - 1) do
        FChildren[VIndex].Collapse(True);
    Exit;
  end;
  if Assigned(VTree) and (not VTree.DoCollapsing(Self)) then
    Exit;
  if Assigned(VTree) then
    VTree.BeginUpdate;
  try
    if ARecurse then
      for VIndex := 0 to (FChildren.Count - 1) do
        FChildren[VIndex].Collapse(True);
    FExpanded := False;
  finally
    if Assigned(VTree) then
      VTree.EndUpdate;
  end;
  if Assigned(VTree) then
    VTree.DoCollapsed(Self);
end;

procedure TTreeNode.ToggleExpanded;
begin
  Expanded := not FExpanded;
end;

procedure TTreeNode.MakeVisible;
var
  VNode: TTreeNode;
begin
  VNode := FParent;
  while Assigned(VNode) do
  begin
    VNode.FExpanded := True;
    VNode := VNode.FParent;
  end;
  if Assigned(FNodes) and Assigned(FNodes.Tree) then
  begin
    FNodes.Tree.Changed;
    FNodes.Tree.ScrollToNode(Self);
  end;
end;

procedure TTreeNode.Delete;
begin
  if Assigned(FNodes) then
    FNodes.Delete(Self);
end;

procedure TTreeNode.DeleteChildren;
var
  VIndex: NativeInt;
begin
  if (not Assigned(FNodes)) then
    Exit;
  for VIndex := (FChildren.Count - 1) downto 0 do
    FNodes.Delete(FChildren[VIndex]);
end;

{ TTreeNodes }

constructor TTreeNodes.Create(ATree: TCustomTreeView);
begin
  inherited Create;
  FTree := ATree;
  FAll := TList<TTreeNode>.Create;
  FRoots := TList<TTreeNode>.Create;
end;

destructor TTreeNodes.Destroy;
var
  VIndex: NativeInt;
  VNode: TTreeNode;
begin
  if Assigned(FAll) then
  begin
    for VIndex := (FAll.Count - 1) downto 0 do
    begin
      VNode := FAll[VIndex];
      VNode.Free;
    end;
    FAll.Free;
    FAll := nil;
  end;
  FRoots.Free;
  FRoots := nil;
  inherited Destroy;
end;

procedure TTreeNodes.DefineProperties(Filer: TFiler);
begin
  inherited DefineProperties(Filer);
  /// The LCL tree editor stores the nodes in the binary Items.Data property.
  /// It is accepted (so the .lfm loads) but ignored: nodes are built in code.
  Filer.DefineBinaryProperty('Data', @ReadData, @WriteData, False);
end;

procedure TTreeNodes.ReadData(Stream: TStream);
begin
  /// Ignore the IDE tree data.
  if Assigned(Stream) then
    Stream.Position := Stream.Size;
end;

procedure TTreeNodes.WriteData(Stream: TStream);
begin
  /// Nothing to save: nodes are created in code.
end;

function TTreeNodes.GetCount: NativeInt;
begin
  Result := FAll.Count;
end;

function TTreeNodes.GetItem(const AIndex: NativeInt): TTreeNode;
begin
  if (AIndex >= 0) and (AIndex < FAll.Count) then
    Result := FAll[AIndex]
  else
    Result := nil;
end;

function TTreeNodes.GetRoot(const AIndex: NativeInt): TTreeNode;
begin
  if (AIndex >= 0) and (AIndex < FRoots.Count) then
    Result := FRoots[AIndex]
  else
    Result := nil;
end;

function TTreeNodes.GetRootCount: NativeInt;
begin
  Result := FRoots.Count;
end;

function TTreeNodes.IndexOf(ANode: TTreeNode): NativeInt;
begin
  Result := FAll.IndexOf(ANode);
end;

function TTreeNodes.AddNode(AParent: TTreeNode; AIndex: NativeInt;
  const AText: string): TTreeNode;
begin
  if Assigned(FTree) then
    FTree.BeginUpdate;
  try
    Result := TTreeNode.Create(Self, AParent);
    Result.FText := AText;
    FAll.Add(Result);
    if Assigned(AParent) then
    begin
      if (AIndex < 0) or (AIndex > AParent.FChildren.Count) then
        AParent.FChildren.Add(Result)
      else
        AParent.FChildren.Insert(AIndex, Result);
    end
    else
    begin
      if (AIndex < 0) or (AIndex > FRoots.Count) then
        FRoots.Add(Result)
      else
        FRoots.Insert(AIndex, Result);
    end;
  finally
    if Assigned(FTree) then
      FTree.EndUpdate;
  end;
end;

function TTreeNodes.Add(AParent: TTreeNode; const AText: string): TTreeNode;
begin
  if Assigned(AParent) then
    Result := AddNode(AParent.Parent, -1, AText)
  else
    Result := AddNode(nil, -1, AText);
end;

function TTreeNodes.Add(const AText: string): TTreeNode;
begin
  Result := AddNode(nil, -1, AText);
end;

function TTreeNodes.AddChild(AParent: TTreeNode;
  const AText: string): TTreeNode;
begin
  Result := AddNode(AParent, -1, AText);
end;

function TTreeNodes.Insert(AParent: TTreeNode; AIndex: NativeInt;
  const AText: string): TTreeNode;
begin
  Result := AddNode(AParent, AIndex, AText);
end;

function TTreeNodes.GetFirstNode: TTreeNode;
begin
  if (FRoots.Count > 0) then
    Result := FRoots[0]
  else
    Result := nil;
end;

procedure TTreeNodes.RemoveSubtree(ANode: TTreeNode);
var
  VIndex: NativeInt;
begin
  if (not Assigned(ANode)) then
    Exit;
  for VIndex := (ANode.FChildren.Count - 1) downto 0 do
    RemoveSubtree(ANode.FChildren[VIndex]);
  if Assigned(ANode.FParent) then
    ANode.FParent.FChildren.Remove(ANode)
  else
    FRoots.Remove(ANode);
  FAll.Remove(ANode);
  if Assigned(FTree) and (FTree.Selected = ANode) then
    FTree.FSelected := nil;
  ANode.Free;
end;

procedure TTreeNodes.Delete(ANode: TTreeNode);
begin
  if (not Assigned(ANode)) or (FAll.IndexOf(ANode) < 0) then
    Exit;
  if Assigned(FTree) then
    FTree.BeginUpdate;
  try
    RemoveSubtree(ANode);
  finally
    if Assigned(FTree) then
      FTree.EndUpdate;
  end;
end;

procedure TTreeNodes.Clear;
var
  VIndex: NativeInt;
  VNode: TTreeNode;
begin
  if Assigned(FTree) then
    FTree.BeginUpdate;
  try
    if Assigned(FTree) then
      FTree.FSelected := nil;
    for VIndex := (FAll.Count - 1) downto 0 do
    begin
      VNode := FAll[VIndex];
      VNode.Free;
    end;
    FAll.Clear;
    FRoots.Clear;
  finally
    if Assigned(FTree) then
      FTree.EndUpdate;
  end;
end;

procedure TTreeNodes.AlphaSort;
var
  VTree: TCustomTreeView;

  procedure SortList(AList: TList<TTreeNode>);
  var
    I, J: NativeInt;
    VTemp: TTreeNode;
  begin
    for I := 0 to (AList.Count - 2) do
      for J := (I + 1) to (AList.Count - 1) do
        if CompareText(AList[I].Text, AList[J].Text) > 0 then
        begin
          VTemp := AList[I];
          AList[I] := AList[J];
          AList[J] := VTemp;
        end;
    for I := 0 to (AList.Count - 1) do
      SortList(AList[I].FChildren);
  end;

begin
  VTree := FTree;
  if Assigned(VTree) then
    VTree.BeginUpdate;
  try
    SortList(FRoots);
  finally
    if Assigned(VTree) then
      VTree.EndUpdate;
  end;
end;

{ TCustomTreeView }

constructor TCustomTreeView.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  _RegisterWCLTreeRules;
  FItems := TTreeNodes.Create(Self);
  FSelected := nil;
  FIndent := 18;
  FRowHeight := 0;
  FShowButtons := True;
  FShowLines := True;
  FShowRoot := True;
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

destructor TCustomTreeView.Destroy;
begin
  FSelected := nil;
  FItems.Free;
  FItems := nil;
  inherited Destroy;
end;

class function TCustomTreeView.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 200;
  Result.Cy := 200;
end;

function TCustomTreeView.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
end;

procedure TCustomTreeView.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
    RenderTree;
end;

procedure TCustomTreeView.DoChange;
begin
  if Assigned(FOnChange) then
    FOnChange(Self);
end;

function TCustomTreeView.DoExpanding(ANode: TTreeNode): Boolean;
begin
  Result := True;
  if Assigned(FOnExpanding) then
    FOnExpanding(Self, ANode, Result);
end;

procedure TCustomTreeView.DoExpanded(ANode: TTreeNode);
begin
  if Assigned(FOnExpanded) then
    FOnExpanded(Self, ANode);
end;

function TCustomTreeView.DoCollapsing(ANode: TTreeNode): Boolean;
begin
  Result := True;
  if Assigned(FOnCollapsing) then
    FOnCollapsing(Self, ANode, Result);
end;

procedure TCustomTreeView.DoCollapsed(ANode: TTreeNode);
begin
  if Assigned(FOnCollapsed) then
    FOnCollapsed(Self, ANode);
end;

procedure TCustomTreeView.SetIndent(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FIndent <> AValue) then
  begin
    FIndent := AValue;
    Changed;
  end;
end;

procedure TCustomTreeView.SetRowHeight(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FRowHeight <> AValue) then
  begin
    FRowHeight := AValue;
    Changed;
  end;
end;

procedure TCustomTreeView.SetSelected(AValue: TTreeNode);
begin
  if (FSelected = AValue) then
    Exit;
  if Assigned(AValue) and (AValue.FNodes <> FItems) then
    Exit;
  FSelected := AValue;
  Changed;
  DoChange;
end;

procedure TCustomTreeView.SetShowButtons(AValue: Boolean);
begin
  if (FShowButtons <> AValue) then
  begin
    FShowButtons := AValue;
    Changed;
  end;
end;

procedure TCustomTreeView.SetShowLines(AValue: Boolean);
begin
  if (FShowLines <> AValue) then
  begin
    FShowLines := AValue;
    Changed;
  end;
end;

procedure TCustomTreeView.SetShowRoot(AValue: Boolean);
begin
  if (FShowRoot <> AValue) then
  begin
    FShowRoot := AValue;
    Changed;
  end;
end;

procedure TCustomTreeView.RenderTree;
var
  VRoot: TJSHTMLElement;
  VNode: TTreeNode;
  I, J: NativeInt;
  VScrollTop: NativeInt;
begin
  if (not Assigned(FItems)) or (not Assigned(HandleElement)) then
    Exit;
  VScrollTop := HandleElement.scrollTop;
  HandleElement.InnerHTML := '';
  HandleElement.Style.SetProperty('overflow', 'auto');
  HandleElement.classList.add('wcl-tree');
  if FShowLines then
    HandleElement.classList.add('wcl-tree-lines')
  else
    HandleElement.classList.remove('wcl-tree-lines');
  VRoot := TJSHTMLElement(Document.CreateElement('ul'));
  VRoot.classList.add('wcl-tree-root');
  for I := 0 to (FItems.RootCount - 1) do
  begin
    VNode := FItems.Roots[I];
    if FShowRoot then
      RenderNode(VRoot, VNode)
    else
      for J := 0 to (VNode.Count - 1) do
        RenderNode(VRoot, VNode.Item[J]);
  end;
  HandleElement.AppendChild(VRoot);
  HandleElement.scrollTop := VScrollTop;
end;

procedure TCustomTreeView.RenderNode(AUl: TJSHTMLElement; ANode: TTreeNode);
var
  VLi, VRow, VToggle, VIcon, VText, VChildUl: TJSHTMLElement;
  I: NativeInt;
begin
  if (not Assigned(ANode)) then
    Exit;

  VLi := TJSHTMLElement(Document.CreateElement('li'));
  VLi.classList.add('wcl-tree-node');
  if ANode.Selected then
    VLi.classList.add('wcl-tree-selected');
  VLi.setAttribute('data-wcl-node', IntToStr(ANode.AbsoluteIndex));

  VRow := TJSHTMLElement(Document.CreateElement('div'));
  VRow.classList.add('wcl-tree-row');
  VRow.setAttribute('data-wcl-node', IntToStr(ANode.AbsoluteIndex));
  if (FRowHeight > 0) then
    VRow.Style.SetProperty('min-height', IntToStr(FRowHeight) + 'px');

  VToggle := TJSHTMLElement(Document.CreateElement('span'));
  VToggle.classList.add('wcl-tree-toggle');
  VToggle.setAttribute('data-wcl-node', IntToStr(ANode.AbsoluteIndex));
  if FShowButtons and ANode.HasChildren then
  begin
    if ANode.Expanded then
      VToggle.TextContent := '▾'
    else
      VToggle.TextContent := '▸';
    VToggle.addEventListener('click', @NodeToggleClick);
  end;
  VRow.AppendChild(VToggle);

  if (ANode.ImageUrl <> '') then
  begin
    VIcon := TJSHTMLElement(Document.CreateElement('img'));
    VIcon.classList.add('wcl-tree-icon');
    VIcon.setAttribute('src', ANode.ImageUrl);
    VIcon.setAttribute('alt', '');
    VRow.AppendChild(VIcon);
  end;

  VText := TJSHTMLElement(Document.CreateElement('span'));
  VText.classList.add('wcl-tree-text');
  VText.TextContent := ANode.Text;
  VRow.AppendChild(VText);

  VRow.addEventListener('click', @NodeClick);
  VRow.addEventListener('dblclick', @NodeDblClick);

  VLi.AppendChild(VRow);

  if ANode.HasChildren and ANode.Expanded then
  begin
    VChildUl := TJSHTMLElement(Document.CreateElement('ul'));
    VChildUl.classList.add('wcl-tree-children');
    if (FIndent > 0) then
      VChildUl.Style.SetProperty('padding-left', IntToStr(FIndent) + 'px');
    for I := 0 to (ANode.Count - 1) do
      RenderNode(VChildUl, ANode.Item[I]);
    VLi.AppendChild(VChildUl);
  end;

  AUl.AppendChild(VLi);
end;

function TCustomTreeView.NodeFromEvent(AEvent: TJSMouseEvent): TTreeNode;
var
  VElement: TJSHTMLElement;
  VIndex: NativeInt;
begin
  Result := nil;
  if (not Assigned(AEvent)) then
    Exit;
  VElement := TJSHTMLElement(AEvent.currentTargetElement);
  if (not Assigned(VElement)) then
    Exit;
  if (not VElement.hasAttribute('data-wcl-node')) then
    Exit;
  VIndex := StrToIntDef(VElement.getAttribute('data-wcl-node'), -1);
  if (VIndex >= 0) and (VIndex < FItems.Count) then
    Result := FItems[VIndex];
end;

function TCustomTreeView.NodeClick(AEvent: TJSMouseEvent): boolean;
var
  VNode: TTreeNode;
begin
  Result := True;
  VNode := NodeFromEvent(AEvent);
  if Assigned(VNode) then
  begin
    SetFocus;
    Selected := VNode;
  end;
end;

function TCustomTreeView.NodeDblClick(AEvent: TJSMouseEvent): boolean;
var
  VNode: TTreeNode;
begin
  AEvent.StopPropagation;
  AEvent.PreventDefault;
  VNode := NodeFromEvent(AEvent);
  if Assigned(VNode) then
  begin
    SetFocus;
    Selected := VNode;
    if VNode.HasChildren then
      VNode.ToggleExpanded;
  end;
  DblClick;
  Result := True;
end;

function TCustomTreeView.NodeToggleClick(AEvent: TJSMouseEvent): boolean;
var
  VNode: TTreeNode;
begin
  AEvent.StopPropagation;
  AEvent.PreventDefault;
  VNode := NodeFromEvent(AEvent);
  if Assigned(VNode) and VNode.HasChildren then
  begin
    SetFocus;
    VNode.ToggleExpanded;
  end;
  Result := True;
end;

function TCustomTreeView.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  /// The tree renders its own DOM inside the handle element.
  Result := False;
end;

procedure TCustomTreeView.CollectVisible(AList: TList<TTreeNode>);

  procedure AddNode(ANode: TTreeNode);
  var
    I: NativeInt;
  begin
    if (not Assigned(ANode)) then
      Exit;
    AList.Add(ANode);
    if ANode.Expanded then
      for I := 0 to (ANode.Count - 1) do
        AddNode(ANode.Item[I]);
  end;

var
  I, J: NativeInt;
  VRoot: TTreeNode;
begin
  for I := 0 to (FItems.RootCount - 1) do
  begin
    VRoot := FItems.Roots[I];
    if FShowRoot then
      AddNode(VRoot)
    else
      for J := 0 to (VRoot.Count - 1) do
        AddNode(VRoot.Item[J]);
  end;
end;

procedure TCustomTreeView.SelectNode(ANode: TTreeNode; AFocus: Boolean);
begin
  if (not Assigned(ANode)) then
    Exit;
  if (FSelected <> ANode) then
    Selected := ANode;
  if AFocus then
    ScrollToNode(ANode);
end;

procedure TCustomTreeView.UpdateVisibleSelection(ADelta: NativeInt);
var
  VList: TList<TTreeNode>;
  VIndex: NativeInt;
begin
  VList := TList<TTreeNode>.Create;
  try
    CollectVisible(VList);
    if (VList.Count = 0) then
      Exit;
    if Assigned(FSelected) then
      VIndex := VList.IndexOf(FSelected)
    else
      VIndex := -1;
    if (VIndex < 0) then
    begin
      if (ADelta >= 0) then
        VIndex := 0
      else
        VIndex := VList.Count - 1;
    end
    else
    begin
      VIndex := VIndex + ADelta;
      if (VIndex < 0) then
        VIndex := 0;
      if (VIndex > (VList.Count - 1)) then
        VIndex := VList.Count - 1;
    end;
    SelectNode(VList[VIndex], True);
  finally
    VList.Free;
  end;
end;

procedure TCustomTreeView.SelectFirst;
var
  VList: TList<TTreeNode>;
begin
  VList := TList<TTreeNode>.Create;
  try
    CollectVisible(VList);
    if (VList.Count > 0) then
      SelectNode(VList[0], True);
  finally
    VList.Free;
  end;
end;

procedure TCustomTreeView.SelectLast;
var
  VList: TList<TTreeNode>;
begin
  VList := TList<TTreeNode>.Create;
  try
    CollectVisible(VList);
    if (VList.Count > 0) then
      SelectNode(VList[VList.Count - 1], True);
  finally
    VList.Free;
  end;
end;

procedure TCustomTreeView.ExpandSelected;
begin
  if (not Assigned(FSelected)) then
    Exit;
  if FSelected.HasChildren then
  begin
    if (not FSelected.Expanded) then
      FSelected.Expand
    else
      SelectNode(FSelected.Item[0], True);
  end;
end;

procedure TCustomTreeView.CollapseSelected;
begin
  if (not Assigned(FSelected)) then
    Exit;
  if FSelected.HasChildren and FSelected.Expanded then
    FSelected.Collapse
  else if Assigned(FSelected.Parent) then
    SelectNode(FSelected.Parent, True);
end;

procedure TCustomTreeView.KeyDown(var Key: NativeInt; Shift: TShiftState);
begin
  inherited KeyDown(Key, Shift);
  case Key of
    /// Up
    38:
      begin
        UpdateVisibleSelection(-1);
        Key := 0;
      end;
    /// Down
    40:
      begin
        UpdateVisibleSelection(1);
        Key := 0;
      end;
    /// Left
    37:
      begin
        CollapseSelected;
        Key := 0;
      end;
    /// Right
    39:
      begin
        ExpandSelected;
        Key := 0;
      end;
    /// Home
    36:
      begin
        SelectFirst;
        Key := 0;
      end;
    /// End
    35:
      begin
        SelectLast;
        Key := 0;
      end;
    /// Enter / Space
    13, 32:
      begin
        if Assigned(FSelected) then
          FSelected.ToggleExpanded;
        Key := 0;
      end;
  end;
end;

function TCustomTreeView.FindNodeElement(ANode: TTreeNode): TJSHTMLElement;
begin
  Result := nil;
  if (not Assigned(ANode)) or (not Assigned(HandleElement)) then
    Exit;
  Result := TJSHTMLElement(HandleElement.querySelector(
    '[data-wcl-node="' + IntToStr(ANode.AbsoluteIndex) + '"]'));
end;

procedure TCustomTreeView.ScrollToNode(ANode: TTreeNode);
var
  VElement: TJSHTMLElement;
begin
  VElement := FindNodeElement(ANode);
  if Assigned(VElement) then
    asm
      VElement.scrollIntoView({ block: 'nearest' });
    end;
end;

procedure TCustomTreeView.FullExpand;
var
  VIndex: NativeInt;
begin
  BeginUpdate;
  try
    for VIndex := 0 to (FItems.Count - 1) do
      if FItems[VIndex].HasChildren then
        FItems[VIndex].FExpanded := True;
  finally
    EndUpdate;
  end;
end;

procedure TCustomTreeView.FullCollapse;
var
  VIndex: NativeInt;
begin
  BeginUpdate;
  try
    for VIndex := 0 to (FItems.Count - 1) do
      FItems[VIndex].FExpanded := False;
  finally
    EndUpdate;
  end;
end;

procedure TCustomTreeView.AlphaSort;
begin
  FItems.AlphaSort;
end;

end.
