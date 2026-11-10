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
    property Constraints;
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

type
  /// Forward declarations
  TListItems = class;
  TListItem = class;
  TListColumn = class;
  TListColumns = class;
  TCustomListView = class;

  TItemChange = (ctText, ctImage, ctState);
  TViewStyle = (vsIcon, vsSmallIcon, vsList, vsReport);
  TSortType = (stNone, stData, stText, stBoth);
  TSortDirection = (sdAscending, sdDescending);
  TSortIndicator = (siNone, siAscending, siDescending);

  TLVChangeEvent = procedure(Sender: TObject; Item: TListItem;
    Change: TItemChange) of object;
  TLVSelectItemEvent = procedure(Sender: TObject; Item: TListItem;
    Selected: Boolean) of object;
  TLVColumnClickEvent = procedure(Sender: TObject; Column: TListColumn) of object;
  TLVCheckedItemEvent = procedure(Sender: TObject; Item: TListItem) of object;
  TLVCompareEvent = procedure(Sender: TObject; Item1, Item2: TListItem;
    Data: Integer; var Compare: Integer) of object;

  { TListItem }

  /// One row of a TListView. Caption is the first column (or the only text in
  /// the non-report views); SubItems fills the remaining columns.
  TListItem = class(TPersistent)
  private
    FCaption: string;
    FChecked: Boolean;
    FData: TObject;
    FImageUrl: string;
    FOwner: TListItems;
    FSelected: Boolean;
    FSubItems: TStringList;
    function GetIndex: NativeInt;
    function GetListView: TCustomListView;
    function GetSubItems: TStrings;
    procedure SetCaption(const AValue: string);
    procedure SetChecked(AValue: Boolean);
    procedure SetImageUrl(const AValue: string);
    procedure SetSelected(AValue: Boolean);
    procedure SetSubItems(AValue: TStrings);
    procedure SubItemsChanged(Sender: TObject);
    procedure ItemChanged(AChange: TItemChange);
  public
    constructor Create(AOwner: TListItems);
    destructor Destroy; override;
    procedure Delete;
    procedure MakeVisible(APartialOK: Boolean = False);
    property Caption: string read FCaption write SetCaption;
    property Checked: Boolean read FChecked write SetChecked default False;
    property Data: TObject read FData write FData;
    property ImageUrl: string read FImageUrl write SetImageUrl;
    property Index: NativeInt read GetIndex;
    property ListView: TCustomListView read GetListView;
    property Owner: TListItems read FOwner;
    property Selected: Boolean read FSelected write SetSelected default False;
    property SubItems: TStrings read GetSubItems write SetSubItems;
  end;

  { TListItems }

  /// Collection of the rows of a list view. Item[] is the display order, so
  /// sorting reorders this list.
  TListItems = class(TPersistent)
  private
    FItems: TList<TListItem>;
    FOwner: TCustomListView;
    function GetCount: NativeInt;
    function GetItem(const AIndex: NativeInt): TListItem;
    procedure ReadData(Stream: TStream);
    procedure WriteData(Stream: TStream);
  protected
    procedure DefineProperties(Filer: TFiler); override;
  public
    constructor Create(AOwner: TCustomListView);
    destructor Destroy; override;
    function Add: TListItem;
    function Insert(AIndex: NativeInt): TListItem;
    procedure Delete(AIndex: NativeInt);
    procedure Clear;
    function IndexOf(AItem: TListItem): NativeInt;
    procedure BeginUpdate;
    procedure EndUpdate;
    property Count: NativeInt read GetCount;
    property Item[const AIndex: NativeInt]: TListItem read GetItem; default;
    property Owner: TCustomListView read FOwner;
  end;

  { TListColumn }

  TListColumn = class(TCollectionItem)
  private
    FAlignment: TAlignment;
    FAutoSize: Boolean;
    FCaption: string;
    FImageIndex: NativeInt;
    FMaxWidth: NativeInt;
    FMinWidth: NativeInt;
    FSortIndicator: TSortIndicator;
    FTag: NativeInt;
    FVisible: Boolean;
    FWidth: NativeInt;
    procedure SetAlignment(AValue: TAlignment);
    procedure SetAutoSize(AValue: Boolean);
    procedure SetCaption(const AValue: string);
    procedure SetMaxWidth(AValue: NativeInt);
    procedure SetMinWidth(AValue: NativeInt);
    procedure SetSortIndicator(AValue: TSortIndicator);
    procedure SetVisible(AValue: Boolean);
    procedure SetWidth(AValue: NativeInt);
    procedure ColumnChanged;
  protected
    function GetDisplayName: string; override;
  public
    constructor Create(ACollection: TCollection); override;
  published
    property Alignment: TAlignment read FAlignment write SetAlignment default taLeftJustify;
    property AutoSize: Boolean read FAutoSize write SetAutoSize default False;
    property Caption: string read FCaption write SetCaption;
    /// Accepted for .lfm compatibility; use item ImageUrl for icons.
    property ImageIndex: NativeInt read FImageIndex write FImageIndex default -1;
    property MaxWidth: NativeInt read FMaxWidth write SetMaxWidth default 0;
    property MinWidth: NativeInt read FMinWidth write SetMinWidth default 0;
    property SortIndicator: TSortIndicator read FSortIndicator write SetSortIndicator default siNone;
    property Tag: NativeInt read FTag write FTag default 0;
    property Visible: Boolean read FVisible write SetVisible default True;
    property Width: NativeInt read FWidth write SetWidth default 100;
  end;

  { TListColumns }

  TListColumns = class(TCollection)
  private
    FOwner: TCustomListView;
    function GetColumn(const AIndex: NativeInt): TListColumn;
    procedure SetColumn(const AIndex: NativeInt; AValue: TListColumn);
  protected
    function GetOwner: TPersistent; override;
    procedure Update(AItem: TCollectionItem); override;
  public
    constructor Create(AOwner: TCustomListView); reintroduce;
    function Add: TListColumn; reintroduce;
    property Owner: TCustomListView read FOwner;
    property Items[const AIndex: NativeInt]: TListColumn read GetColumn write SetColumn; default;
  end;

  { TCustomListView }

  /// LCL-compatible list view rendered with a table (vsReport) or with rows
  /// and tiles (vsList, vsSmallIcon, vsIcon). Items are created in code; the
  /// binary Items.Data/LazData saved by the IDE is accepted and ignored.
  TCustomListView = class(TWinControl)
  private
    FAutoSort: Boolean;
    FCheckboxes: Boolean;
    FColumns: TListColumns;
    FGridLines: Boolean;
    FItems: TListItems;
    FMultiSelect: Boolean;
    FOnChange: TLVChangeEvent;
    FOnColumnClick: TLVColumnClickEvent;
    FOnCompare: TLVCompareEvent;
    FOnItemChecked: TLVCheckedItemEvent;
    FOnSelectItem: TLVSelectItemEvent;
    FReadOnly: Boolean;
    FRowHeight: NativeInt;
    FRowSelect: Boolean;
    FShowColumnHeaders: Boolean;
    FSortColumn: NativeInt;
    FSortDirection: TSortDirection;
    FSortType: TSortType;
    FViewStyle: TViewStyle;
    FAnchor: TListItem;
    function GetColumn(const AIndex: NativeInt): TListColumn;
    function GetColumnCount: NativeInt;
    function GetItemIndex: NativeInt;
    function GetSelCount: NativeInt;
    function GetSelected: TListItem;
    procedure SetAutoSort(AValue: Boolean);
    procedure SetCheckboxes(AValue: Boolean);
    procedure SetGridLines(AValue: Boolean);
    procedure SetItemIndex(AValue: NativeInt);
    procedure SetMultiSelect(AValue: Boolean);
    procedure SetReadOnly(AValue: Boolean);
    procedure SetRowHeight(AValue: NativeInt);
    procedure SetRowSelect(AValue: Boolean);
    procedure SetSelected(AValue: TListItem);
    procedure SetShowColumnHeaders(AValue: Boolean);
    procedure SetSortColumn(AValue: NativeInt);
    procedure SetSortDirection(AValue: TSortDirection);
    procedure SetSortType(AValue: TSortType);
    procedure SetViewStyle(AValue: TViewStyle);
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
    procedure DoItemChange(AItem: TListItem; AChange: TItemChange); virtual;
    procedure DoItemChecked(AItem: TListItem); virtual;
    procedure DoSelectItem(AItem: TListItem; ASelected: Boolean); virtual;
    function FindItemElement(AItem: TListItem): TJSHTMLElement;
    function ItemFromEvent(AEvent: TJSMouseEvent): TListItem;
    function ColumnFromEvent(AEvent: TJSMouseEvent): TListColumn;
    procedure RenderView; virtual;
    procedure RenderReport; virtual;
    procedure RenderRows(AWithIcon: Boolean); virtual;
    procedure RenderIcons; virtual;
    procedure RenderHeader(ARow: TJSHTMLElement; AColumn: TListColumn); virtual;
    procedure ScrollToItem(AItem: TListItem);
    procedure SortItems; virtual;
    procedure ClearSelection;
    procedure SelectItem(AItem: TListItem; ASelected: Boolean);
    procedure SelectRange(AFrom, ATo: TListItem);
    procedure MoveSelection(ADelta: NativeInt);
    procedure SelectFirst;
    procedure SelectLast;
    function ItemClick(AEvent: TJSMouseEvent): boolean; virtual;
    function ItemCheckClick(AEvent: TJSMouseEvent): boolean; virtual;
    function ColumnClickHandler(AEvent: TJSMouseEvent): boolean; virtual;
    procedure ColumnClick(AColumn: TListColumn); virtual;
    procedure KeyDown(var Key: NativeInt; Shift: TShiftState); override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    function AlphaSort: Boolean;
    procedure Clear;
    procedure SelectAll;
    property Columns: TListColumns read FColumns;
    property Column[const AIndex: NativeInt]: TListColumn read GetColumn;
    property ColumnCount: NativeInt read GetColumnCount;
    property ItemIndex: NativeInt read GetItemIndex write SetItemIndex;
    property Items: TListItems read FItems;
    property SelCount: NativeInt read GetSelCount;
    property Selected: TListItem read GetSelected write SetSelected;
    property AutoSort: Boolean read FAutoSort write SetAutoSort default True;
    property Checkboxes: Boolean read FCheckboxes write SetCheckboxes default False;
    property GridLines: Boolean read FGridLines write SetGridLines default False;
    property MultiSelect: Boolean read FMultiSelect write SetMultiSelect default False;
    property ReadOnly: Boolean read FReadOnly write SetReadOnly default False;
    property RowHeight: NativeInt read FRowHeight write SetRowHeight default 0;
    property RowSelect: Boolean read FRowSelect write SetRowSelect default False;
    property ShowColumnHeaders: Boolean read FShowColumnHeaders write SetShowColumnHeaders default True;
    property SortColumn: NativeInt read FSortColumn write SetSortColumn default -1;
    property SortDirection: TSortDirection read FSortDirection write SetSortDirection default sdAscending;
    property SortType: TSortType read FSortType write SetSortType default stNone;
    property ViewStyle: TViewStyle read FViewStyle write SetViewStyle default vsList;
    property OnChange: TLVChangeEvent read FOnChange write FOnChange;
    property OnColumnClick: TLVColumnClickEvent read FOnColumnClick write FOnColumnClick;
    property OnCompare: TLVCompareEvent read FOnCompare write FOnCompare;
    property OnItemChecked: TLVCheckedItemEvent read FOnItemChecked write FOnItemChecked;
    property OnSelectItem: TLVSelectItemEvent read FOnSelectItem write FOnSelectItem;
  end;

  { TListView }

  TListView = class(TCustomListView)
  published
    property Align;
    property Anchors;
    property AutoSort;
    property BorderSpacing;
    property BorderStyle;
    property Checkboxes;
    property Color;
    property Columns;
    property Constraints;
    property Enabled;
    property Font;
    property GridLines;
    property HandleClass;
    property HandleId;
    property Height;
    property Items;
    property Left;
    property MultiSelect;
    property ParentFont;
    property ParentShowHint;
    property PopupMenu;
    property ReadOnly;
    property RowHeight;
    property RowSelect;
    property ShowColumnHeaders;
    property ShowHint;
    property SortColumn;
    property SortDirection;
    property SortType;
    property TabOrder;
    property TabStop;
    property Top;
    property ViewStyle;
    property Visible;
    property Width;
    property OnChange;
    property OnClick;
    property OnColumnClick;
    property OnCompare;
    property OnDblClick;
    property OnEnter;
    property OnExit;
    property OnItemChecked;
    property OnKeyDown;
    property OnKeyPress;
    property OnKeyUp;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
    property OnSelectItem;
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
    VToggle.addEventListener('click', TJSEventHandler(@NodeToggleClick));
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

  VRow.addEventListener('click', TJSEventHandler(@NodeClick));
  VRow.addEventListener('dblclick', TJSEventHandler(@NodeDblClick));

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

{ TListView styles }

var
  _WCLListRulesRegistered: Boolean;

procedure _RegisterWCLListRules;
begin
  if _WCLListRulesRegistered then
    Exit;
  RegisterWCLStyle(
    '.wcl-lv{' +
    'overflow:auto;' +
    'background:#fff;' +
    'border:1px solid #c9c3ba;' +
    'border-radius:4px;' +
    'box-sizing:border-box;' +
    'outline:none;' +
    'user-select:none;' +
    '-webkit-user-select:none;' +
    '-webkit-tap-highlight-color:transparent;}' +
    '.wcl-lv-table{' +
    'width:100%;' +
    'border-collapse:collapse;' +
    'table-layout:fixed;}' +
    '.wcl-lv-table th{' +
    'position:sticky;' +
    'top:0;' +
    'z-index:1;' +
    'background:#f0f0f0;' +
    'text-align:left;' +
    'font-weight:600;' +
    'padding:6px 8px;' +
    'border-bottom:1px solid #c9c3ba;' +
    'white-space:nowrap;' +
    'overflow:hidden;' +
    'text-overflow:ellipsis;' +
    'cursor:pointer;' +
    'color:#333;}' +
    '.wcl-lv-table td{' +
    'padding:5px 8px;' +
    'border-bottom:1px solid #eee;' +
    'white-space:nowrap;' +
    'overflow:hidden;' +
    'text-overflow:ellipsis;' +
    'color:#333;}' +
    '.wcl-lv-table tbody tr{' +
    'cursor:pointer;}' +
    '@media(hover:hover){' +
    '.wcl-lv-table tbody tr:hover{background:#eef3fb;}' +
    '}' +
    '.wcl-lv-table tbody tr.wcl-lv-selected{' +
    'background:#4A90D9;}' +
    '.wcl-lv-table tbody tr.wcl-lv-selected td{' +
    'color:#fff;}' +
    '.wcl-lv-gridlines td,.wcl-lv-gridlines th{' +
    'border-right:1px solid #eee;}' +
    '.wcl-lv-checkcell{' +
    'width:32px;' +
    'text-align:center;' +
    'padding:2px 4px!important;}' +
    '.wcl-lv-checkcell input{' +
    'width:16px;' +
    'height:16px;' +
    'margin:0;' +
    'cursor:pointer;}' +
    '.wcl-lv-list{' +
    'list-style:none;' +
    'margin:0;' +
    'padding:0;}' +
    '.wcl-lv-item{' +
    'display:flex;' +
    'align-items:center;' +
    'gap:6px;' +
    'min-height:24px;' +
    'padding:2px 8px;' +
    'cursor:pointer;' +
    'border-radius:3px;' +
    'white-space:nowrap;' +
    'color:#333;}' +
    '@media(hover:hover){' +
    '.wcl-lv-item:hover{background:#eef3fb;}' +
    '}' +
    '.wcl-lv-item.wcl-lv-selected{' +
    'background:#4A90D9;' +
    'color:#fff;}' +
    '.wcl-lv-item input[type=checkbox],.wcl-lv-tile input[type=checkbox]{' +
    'width:16px;' +
    'height:16px;' +
    'margin:0;' +
    'cursor:pointer;}' +
    '.wcl-lv-icon{' +
    'width:16px;' +
    'height:16px;' +
    'object-fit:contain;}' +
    '.wcl-lv-text{' +
    'overflow:hidden;' +
    'text-overflow:ellipsis;}' +
    '.wcl-lv-icons{' +
    'display:grid;' +
    'grid-template-columns:repeat(auto-fill,minmax(96px,1fr));' +
    'gap:8px;' +
    'padding:8px;}' +
    '.wcl-lv-tile{' +
    'display:flex;' +
    'flex-direction:column;' +
    'align-items:center;' +
    'gap:4px;' +
    'padding:8px;' +
    'border-radius:4px;' +
    'cursor:pointer;' +
    'text-align:center;' +
    'color:#333;}' +
    '@media(hover:hover){' +
    '.wcl-lv-tile:hover{background:#eef3fb;}' +
    '}' +
    '.wcl-lv-tile.wcl-lv-selected{' +
    'background:#4A90D9;' +
    'color:#fff;}' +
    '.wcl-lv-tile img{' +
    'width:32px;' +
    'height:32px;' +
    'object-fit:contain;}' +
    '.wcl-lv-sub{' +
    'font-size:12px;' +
    'opacity:0.7;' +
    'overflow:hidden;' +
    'text-overflow:ellipsis;' +
    'max-width:100%;}' +
    '@media(pointer:coarse){' +
    '.wcl-lv-item{min-height:36px;font-size:16px;}' +
    '.wcl-lv-table td,.wcl-lv-table th{min-height:36px;font-size:16px;padding:8px;}' +
    '.wcl-lv-checkcell input{width:20px;height:20px;}' +
    '}'
  );
  _WCLListRulesRegistered := True;
end;

function ListAlignmentCSS(AValue: TAlignment): string;
begin
  case AValue of
    taCenter:
      Result := 'center';
    taRightJustify:
      Result := 'right';
  else
    Result := 'left';
  end;
end;

{ TListItem }

constructor TListItem.Create(AOwner: TListItems);
begin
  inherited Create;
  FCaption := '';
  FChecked := False;
  FData := nil;
  FImageUrl := '';
  FOwner := AOwner;
  FSelected := False;
  FSubItems := TStringList.Create;
  FSubItems.OnChange := @SubItemsChanged;
end;

destructor TListItem.Destroy;
begin
  FSubItems.Free;
  FSubItems := nil;
  inherited Destroy;
end;

function TListItem.GetListView: TCustomListView;
begin
  if Assigned(FOwner) then
    Result := FOwner.Owner
  else
    Result := nil;
end;

function TListItem.GetSubItems: TStrings;
begin
  Result := FSubItems;
end;

function TListItem.GetIndex: NativeInt;
begin
  if Assigned(FOwner) then
    Result := FOwner.IndexOf(Self)
  else
    Result := -1;
end;

procedure TListItem.ItemChanged(AChange: TItemChange);
var
  VList: TCustomListView;
begin
  VList := GetListView;
  if Assigned(VList) then
  begin
    VList.DoItemChange(Self, AChange);
    VList.Changed;
  end;
end;

procedure TListItem.SetCaption(const AValue: string);
begin
  if (FCaption <> AValue) then
  begin
    FCaption := AValue;
    ItemChanged(ctText);
  end;
end;

procedure TListItem.SetChecked(AValue: Boolean);
begin
  if (FChecked <> AValue) then
  begin
    FChecked := AValue;
    ItemChanged(ctState);
  end;
end;

procedure TListItem.SetImageUrl(const AValue: string);
begin
  if (FImageUrl <> AValue) then
  begin
    FImageUrl := AValue;
    ItemChanged(ctImage);
  end;
end;

procedure TListItem.SetSelected(AValue: Boolean);
var
  VList: TCustomListView;
begin
  if (FSelected = AValue) then
    Exit;
  VList := GetListView;
  if AValue and Assigned(VList) and (not VList.MultiSelect) then
    VList.ClearSelection;
  FSelected := AValue;
  if Assigned(VList) then
  begin
    VList.Changed;
    VList.DoItemChange(Self, ctState);
    VList.DoSelectItem(Self, AValue);
  end;
end;

procedure TListItem.SetSubItems(AValue: TStrings);
begin
  if Assigned(AValue) then
  begin
    FSubItems.BeginUpdate;
    try
      FSubItems.Assign(AValue);
    finally
      FSubItems.EndUpdate;
    end;
  end
  else
    FSubItems.Clear;
end;

procedure TListItem.SubItemsChanged(Sender: TObject);
begin
  ItemChanged(ctText);
end;

procedure TListItem.Delete;
begin
  if Assigned(FOwner) then
    FOwner.Delete(Index);
end;

procedure TListItem.MakeVisible(APartialOK: Boolean);
var
  VList: TCustomListView;
begin
  VList := GetListView;
  if Assigned(VList) then
    VList.ScrollToItem(Self);
end;

{ TListItems }

constructor TListItems.Create(AOwner: TCustomListView);
begin
  inherited Create;
  FOwner := AOwner;
  FItems := TList<TListItem>.Create;
end;

destructor TListItems.Destroy;
var
  VIndex: NativeInt;
  VItem: TListItem;
begin
  if Assigned(FItems) then
  begin
    for VIndex := (FItems.Count - 1) downto 0 do
    begin
      VItem := FItems[VIndex];
      VItem.Free;
    end;
    FItems.Free;
    FItems := nil;
  end;
  inherited Destroy;
end;

procedure TListItems.DefineProperties(Filer: TFiler);
begin
  inherited DefineProperties(Filer);
  /// The LCL list editor stores the rows in binary properties; accept them
  /// (so the .lfm loads) but ignore them: items are built in code.
  Filer.DefineBinaryProperty('Data', @ReadData, @WriteData, False);
  Filer.DefineBinaryProperty('LazData', @ReadData, @WriteData, False);
end;

procedure TListItems.ReadData(Stream: TStream);
begin
  if Assigned(Stream) then
    Stream.Position := Stream.Size;
end;

procedure TListItems.WriteData(Stream: TStream);
begin
  /// Nothing to save: items are created in code.
end;

function TListItems.GetCount: NativeInt;
begin
  Result := FItems.Count;
end;

function TListItems.GetItem(const AIndex: NativeInt): TListItem;
begin
  if (AIndex >= 0) and (AIndex < FItems.Count) then
    Result := FItems[AIndex]
  else
    Result := nil;
end;

function TListItems.Add: TListItem;
begin
  if Assigned(FOwner) then
    FOwner.BeginUpdate;
  try
    Result := TListItem.Create(Self);
    FItems.Add(Result);
  finally
    if Assigned(FOwner) then
      FOwner.EndUpdate;
  end;
end;

function TListItems.Insert(AIndex: NativeInt): TListItem;
begin
  if (AIndex < 0) or (AIndex > FItems.Count) then
    AIndex := FItems.Count;
  if Assigned(FOwner) then
    FOwner.BeginUpdate;
  try
    Result := TListItem.Create(Self);
    FItems.Insert(AIndex, Result);
  finally
    if Assigned(FOwner) then
      FOwner.EndUpdate;
  end;
end;

procedure TListItems.Delete(AIndex: NativeInt);
var
  VItem: TListItem;
begin
  if (AIndex < 0) or (AIndex >= FItems.Count) then
    Exit;
  if Assigned(FOwner) then
    FOwner.BeginUpdate;
  try
    VItem := FItems[AIndex];
    FItems.Delete(AIndex);
    if Assigned(FOwner) and (FOwner.FAnchor = VItem) then
      FOwner.FAnchor := nil;
    VItem.Free;
  finally
    if Assigned(FOwner) then
      FOwner.EndUpdate;
  end;
end;

procedure TListItems.Clear;
var
  VIndex: NativeInt;
  VItem: TListItem;
begin
  if Assigned(FOwner) then
    FOwner.BeginUpdate;
  try
    for VIndex := (FItems.Count - 1) downto 0 do
    begin
      VItem := FItems[VIndex];
      VItem.Free;
    end;
    FItems.Clear;
    if Assigned(FOwner) then
      FOwner.FAnchor := nil;
  finally
    if Assigned(FOwner) then
      FOwner.EndUpdate;
  end;
end;

function TListItems.IndexOf(AItem: TListItem): NativeInt;
begin
  Result := FItems.IndexOf(AItem);
end;

procedure TListItems.BeginUpdate;
begin
  if Assigned(FOwner) then
    FOwner.BeginUpdate;
end;

procedure TListItems.EndUpdate;
begin
  if Assigned(FOwner) then
    FOwner.EndUpdate;
end;

{ TListColumn }

constructor TListColumn.Create(ACollection: TCollection);
begin
  inherited Create(ACollection);
  FAlignment := taLeftJustify;
  FAutoSize := False;
  FCaption := '';
  FImageIndex := -1;
  FMaxWidth := 0;
  FMinWidth := 0;
  FSortIndicator := siNone;
  FTag := 0;
  FVisible := True;
  FWidth := 100;
end;

procedure TListColumn.ColumnChanged;
begin
  Changed(False);
end;

function TListColumn.GetDisplayName: string;
begin
  if (FCaption <> '') then
    Result := FCaption
  else
    Result := inherited GetDisplayName;
end;

procedure TListColumn.SetAlignment(AValue: TAlignment);
begin
  if (FAlignment <> AValue) then
  begin
    FAlignment := AValue;
    ColumnChanged;
  end;
end;

procedure TListColumn.SetAutoSize(AValue: Boolean);
begin
  if (FAutoSize <> AValue) then
  begin
    FAutoSize := AValue;
    ColumnChanged;
  end;
end;

procedure TListColumn.SetCaption(const AValue: string);
begin
  if (FCaption <> AValue) then
  begin
    FCaption := AValue;
    ColumnChanged;
  end;
end;

procedure TListColumn.SetMaxWidth(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FMaxWidth <> AValue) then
  begin
    FMaxWidth := AValue;
    ColumnChanged;
  end;
end;

procedure TListColumn.SetMinWidth(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FMinWidth <> AValue) then
  begin
    FMinWidth := AValue;
    ColumnChanged;
  end;
end;

procedure TListColumn.SetSortIndicator(AValue: TSortIndicator);
begin
  if (FSortIndicator <> AValue) then
  begin
    FSortIndicator := AValue;
    ColumnChanged;
  end;
end;

procedure TListColumn.SetVisible(AValue: Boolean);
begin
  if (FVisible <> AValue) then
  begin
    FVisible := AValue;
    ColumnChanged;
  end;
end;

procedure TListColumn.SetWidth(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FWidth <> AValue) then
  begin
    FWidth := AValue;
    ColumnChanged;
  end;
end;

{ TListColumns }

constructor TListColumns.Create(AOwner: TCustomListView);
begin
  inherited Create(TListColumn);
  FOwner := AOwner;
end;

function TListColumns.Add: TListColumn;
begin
  Result := TListColumn(inherited Add);
end;

function TListColumns.GetColumn(const AIndex: NativeInt): TListColumn;
begin
  Result := TListColumn(inherited GetItem(AIndex));
end;

procedure TListColumns.SetColumn(const AIndex: NativeInt; AValue: TListColumn);
begin
  inherited SetItem(AIndex, AValue);
end;

function TListColumns.GetOwner: TPersistent;
begin
  Result := FOwner;
end;

procedure TListColumns.Update(AItem: TCollectionItem);
begin
  inherited Update(AItem);
  if Assigned(FOwner) then
    FOwner.Changed;
end;

{ TCustomListView }

constructor TCustomListView.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  _RegisterWCLListRules;
  FItems := TListItems.Create(Self);
  FColumns := TListColumns.Create(Self);
  FAutoSort := True;
  FCheckboxes := False;
  FGridLines := False;
  FMultiSelect := False;
  FReadOnly := False;
  FRowHeight := 0;
  FRowSelect := False;
  FShowColumnHeaders := True;
  FSortColumn := -1;
  FSortDirection := sdAscending;
  FSortType := stNone;
  FViewStyle := vsList;
  FAnchor := nil;
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

destructor TCustomListView.Destroy;
begin
  FAnchor := nil;
  FColumns.Free;
  FColumns := nil;
  FItems.Free;
  FItems := nil;
  inherited Destroy;
end;

class function TCustomListView.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 240;
  Result.Cy := 160;
end;

function TCustomListView.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
end;

function TCustomListView.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  /// The list renders its own DOM inside the handle element.
  Result := False;
end;

procedure TCustomListView.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
    RenderView;
end;

function TCustomListView.GetColumn(const AIndex: NativeInt): TListColumn;
begin
  Result := FColumns[AIndex];
end;

function TCustomListView.GetColumnCount: NativeInt;
begin
  Result := FColumns.Count;
end;

function TCustomListView.GetSelected: TListItem;
var
  VIndex: NativeInt;
begin
  Result := nil;
  for VIndex := 0 to (FItems.Count - 1) do
    if FItems[VIndex].FSelected then
    begin
      Result := FItems[VIndex];
      Exit;
    end;
end;

function TCustomListView.GetSelCount: NativeInt;
var
  VIndex: NativeInt;
begin
  Result := 0;
  for VIndex := 0 to (FItems.Count - 1) do
    if FItems[VIndex].FSelected then
      Inc(Result);
end;

function TCustomListView.GetItemIndex: NativeInt;
var
  VItem: TListItem;
begin
  VItem := GetSelected;
  if Assigned(VItem) then
    Result := VItem.Index
  else
    Result := -1;
end;

procedure TCustomListView.SetItemIndex(AValue: NativeInt);
begin
  if (AValue >= 0) and (AValue < FItems.Count) then
    SetSelected(FItems[AValue])
  else
    SetSelected(nil);
end;

procedure TCustomListView.SetSelected(AValue: TListItem);
var
  VOld: TListItem;
begin
  VOld := GetSelected;
  if (VOld = AValue) then
    Exit;
  ClearSelection;
  if Assigned(VOld) then
    DoSelectItem(VOld, False);
  if Assigned(AValue) then
  begin
    AValue.FSelected := True;
    DoSelectItem(AValue, True);
  end;
  Changed;
  DoItemChange(AValue, ctState);
end;

procedure TCustomListView.ClearSelection;
var
  VIndex: NativeInt;
begin
  for VIndex := 0 to (FItems.Count - 1) do
    FItems[VIndex].FSelected := False;
  Changed;
end;

procedure TCustomListView.SelectItem(AItem: TListItem; ASelected: Boolean);
begin
  if (not Assigned(AItem)) or (AItem.FSelected = ASelected) then
    Exit;
  AItem.FSelected := ASelected;
  Changed;
  DoItemChange(AItem, ctState);
  DoSelectItem(AItem, ASelected);
end;

procedure TCustomListView.SelectRange(AFrom, ATo: TListItem);
var
  VFrom, VTo, VIndex: NativeInt;
begin
  if (not Assigned(AFrom)) or (not Assigned(ATo)) then
    Exit;
  VFrom := AFrom.Index;
  VTo := ATo.Index;
  if (VFrom > VTo) then
  begin
    VIndex := VFrom;
    VFrom := VTo;
    VTo := VIndex;
  end;
  BeginUpdate;
  try
    for VIndex := 0 to (FItems.Count - 1) do
      FItems[VIndex].FSelected := (VIndex >= VFrom) and (VIndex <= VTo);
  finally
    EndUpdate;
  end;
  DoItemChange(ATo, ctState);
  DoSelectItem(ATo, True);
end;

procedure TCustomListView.SelectAll;
var
  VIndex: NativeInt;
begin
  if (not FMultiSelect) then
    Exit;
  BeginUpdate;
  try
    for VIndex := 0 to (FItems.Count - 1) do
      FItems[VIndex].FSelected := True;
  finally
    EndUpdate;
  end;
  DoItemChange(nil, ctState);
end;

procedure TCustomListView.DoItemChange(AItem: TListItem; AChange: TItemChange);
begin
  if Assigned(FOnChange) then
    FOnChange(Self, AItem, AChange);
end;

procedure TCustomListView.DoSelectItem(AItem: TListItem; ASelected: Boolean);
begin
  if Assigned(FOnSelectItem) then
    FOnSelectItem(Self, AItem, ASelected);
end;

procedure TCustomListView.DoItemChecked(AItem: TListItem);
begin
  if Assigned(FOnItemChecked) then
    FOnItemChecked(Self, AItem);
end;

procedure TCustomListView.SetAutoSort(AValue: Boolean);
begin
  if (FAutoSort <> AValue) then
    FAutoSort := AValue;
end;

procedure TCustomListView.SetCheckboxes(AValue: Boolean);
begin
  if (FCheckboxes <> AValue) then
  begin
    FCheckboxes := AValue;
    Changed;
  end;
end;

procedure TCustomListView.SetGridLines(AValue: Boolean);
begin
  if (FGridLines <> AValue) then
  begin
    FGridLines := AValue;
    Changed;
  end;
end;

procedure TCustomListView.SetMultiSelect(AValue: Boolean);
begin
  if (FMultiSelect <> AValue) then
  begin
    FMultiSelect := AValue;
    if (not FMultiSelect) then
      ClearSelection;
    Changed;
  end;
end;

procedure TCustomListView.SetReadOnly(AValue: Boolean);
begin
  if (FReadOnly <> AValue) then
    FReadOnly := AValue;
end;

procedure TCustomListView.SetRowHeight(AValue: NativeInt);
begin
  if (AValue < 0) then
    AValue := 0;
  if (FRowHeight <> AValue) then
  begin
    FRowHeight := AValue;
    Changed;
  end;
end;

procedure TCustomListView.SetRowSelect(AValue: Boolean);
begin
  if (FRowSelect <> AValue) then
  begin
    FRowSelect := AValue;
    Changed;
  end;
end;

procedure TCustomListView.SetShowColumnHeaders(AValue: Boolean);
begin
  if (FShowColumnHeaders <> AValue) then
  begin
    FShowColumnHeaders := AValue;
    Changed;
  end;
end;

procedure TCustomListView.SetSortColumn(AValue: NativeInt);
begin
  if (FSortColumn <> AValue) then
  begin
    FSortColumn := AValue;
    Changed;
  end;
end;

procedure TCustomListView.SetSortDirection(AValue: TSortDirection);
begin
  if (FSortDirection <> AValue) then
  begin
    FSortDirection := AValue;
    Changed;
  end;
end;

procedure TCustomListView.SetSortType(AValue: TSortType);
begin
  if (FSortType <> AValue) then
    FSortType := AValue;
end;

procedure TCustomListView.SetViewStyle(AValue: TViewStyle);
begin
  if (FViewStyle <> AValue) then
  begin
    FViewStyle := AValue;
    Changed;
  end;
end;

procedure TCustomListView.RenderView;
var
  VScrollTop: NativeInt;
begin
  if (not Assigned(FItems)) or (not Assigned(FColumns)) or
    (not Assigned(HandleElement)) then
    Exit;
  VScrollTop := HandleElement.scrollTop;
  HandleElement.InnerHTML := '';
  HandleElement.Style.SetProperty('overflow', 'auto');
  HandleElement.classList.add('wcl-lv');
  case FViewStyle of
    vsReport:
      RenderReport;
    vsIcon:
      RenderIcons;
    vsSmallIcon:
      RenderRows(True);
  else
    RenderRows(False);
  end;
  HandleElement.scrollTop := VScrollTop;
end;

procedure TCustomListView.RenderHeader(ARow: TJSHTMLElement;
  AColumn: TListColumn);
var
  VSuffix: string;
begin
  VSuffix := '';
  if (FSortColumn = AColumn.Index) then
  begin
    if (FSortDirection = sdAscending) then
      VSuffix := ' ▲'
    else
      VSuffix := ' ▼';
  end;
  ARow.TextContent := AColumn.Caption + VSuffix;
  ARow.Style.SetProperty('text-align', ListAlignmentCSS(AColumn.Alignment));
end;

procedure TCustomListView.RenderReport;
var
  VTable, VColGroup, VCol, VThead, VHeadRow, VTh: TJSHTMLElement;
  VTbody, VTr, VTd, VInput: TJSHTMLElement;
  VItem: TListItem;
  VColumn: TListColumn;
  I, J, VWidth: NativeInt;
begin
  VTable := TJSHTMLElement(Document.CreateElement('table'));
  VTable.classList.add('wcl-lv-table');
  if FGridLines then
    VTable.classList.add('wcl-lv-gridlines');

  VColGroup := TJSHTMLElement(Document.CreateElement('colgroup'));
  if FCheckboxes then
  begin
    VCol := TJSHTMLElement(Document.CreateElement('col'));
    VCol.Style.SetProperty('width', '32px');
    VColGroup.AppendChild(VCol);
  end;
  for I := 0 to (FColumns.Count - 1) do
  begin
    VColumn := FColumns[I];
    if (not VColumn.Visible) then
      Continue;
    VCol := TJSHTMLElement(Document.CreateElement('col'));
    if (not VColumn.AutoSize) then
    begin
      VWidth := VColumn.Width;
      if (VColumn.MinWidth > 0) and (VWidth < VColumn.MinWidth) then
        VWidth := VColumn.MinWidth;
      if (VColumn.MaxWidth > 0) and (VWidth > VColumn.MaxWidth) then
        VWidth := VColumn.MaxWidth;
      VCol.Style.SetProperty('width', IntToStr(VWidth) + 'px');
    end;
    VColGroup.AppendChild(VCol);
  end;
  VTable.AppendChild(VColGroup);

  if FShowColumnHeaders then
  begin
    VThead := TJSHTMLElement(Document.CreateElement('thead'));
    VHeadRow := TJSHTMLElement(Document.CreateElement('tr'));
    if FCheckboxes then
    begin
      VTh := TJSHTMLElement(Document.CreateElement('th'));
      VTh.classList.add('wcl-lv-checkcell');
      VHeadRow.AppendChild(VTh);
    end;
    for I := 0 to (FColumns.Count - 1) do
    begin
      VColumn := FColumns[I];
      if (not VColumn.Visible) then
        Continue;
      VTh := TJSHTMLElement(Document.CreateElement('th'));
      VTh.setAttribute('data-wcl-col', IntToStr(I));
      RenderHeader(VTh, VColumn);
      VTh.addEventListener('click', TJSEventHandler(@ColumnClickHandler));
      VHeadRow.AppendChild(VTh);
    end;
    VThead.AppendChild(VHeadRow);
    VTable.AppendChild(VThead);
  end;

  VTbody := TJSHTMLElement(Document.CreateElement('tbody'));
  for J := 0 to (FItems.Count - 1) do
  begin
    VItem := FItems[J];
    VTr := TJSHTMLElement(Document.CreateElement('tr'));
    VTr.classList.add('wcl-lv-row');
    if VItem.FSelected then
      VTr.classList.add('wcl-lv-selected');
    VTr.setAttribute('data-wcl-item', IntToStr(J));
    if (FRowHeight > 0) then
      VTr.Style.SetProperty('height', IntToStr(FRowHeight) + 'px');

    if FCheckboxes then
    begin
      VTd := TJSHTMLElement(Document.CreateElement('td'));
      VTd.classList.add('wcl-lv-checkcell');
      VInput := TJSHTMLElement(Document.CreateElement('input'));
      VInput.setAttribute('type', 'checkbox');
      VInput.setAttribute('data-wcl-item', IntToStr(J));
      TJSHTMLInputElement(VInput).checked := VItem.Checked;
      VInput.addEventListener('click', TJSEventHandler(@ItemCheckClick));
      VTd.AppendChild(VInput);
      VTr.AppendChild(VTd);
    end;

    for I := 0 to (FColumns.Count - 1) do
    begin
      VColumn := FColumns[I];
      if (not VColumn.Visible) then
        Continue;
      VTd := TJSHTMLElement(Document.CreateElement('td'));
      VTd.Style.SetProperty('text-align', ListAlignmentCSS(VColumn.Alignment));
      if (I = 0) then
        VTd.TextContent := VItem.Caption
      else if ((I - 1) < VItem.SubItems.Count) then
        VTd.TextContent := VItem.SubItems[I - 1];
      VTr.AppendChild(VTd);
    end;

    VTr.addEventListener('click', TJSEventHandler(@ItemClick));
    VTbody.AppendChild(VTr);
  end;
  VTable.AppendChild(VTbody);
  HandleElement.AppendChild(VTable);
end;

procedure TCustomListView.RenderRows(AWithIcon: Boolean);
var
  VUl, VLi, VInput, VIcon, VText: TJSHTMLElement;
  VItem: TListItem;
  I: NativeInt;
begin
  VUl := TJSHTMLElement(Document.CreateElement('ul'));
  VUl.classList.add('wcl-lv-list');
  for I := 0 to (FItems.Count - 1) do
  begin
    VItem := FItems[I];
    VLi := TJSHTMLElement(Document.CreateElement('li'));
    VLi.classList.add('wcl-lv-item');
    VLi.classList.add('wcl-lv-row');
    if VItem.FSelected then
      VLi.classList.add('wcl-lv-selected');
    VLi.setAttribute('data-wcl-item', IntToStr(I));
    if (FRowHeight > 0) then
      VLi.Style.SetProperty('min-height', IntToStr(FRowHeight) + 'px');

    if FCheckboxes then
    begin
      VInput := TJSHTMLElement(Document.CreateElement('input'));
      VInput.setAttribute('type', 'checkbox');
      VInput.setAttribute('data-wcl-item', IntToStr(I));
      TJSHTMLInputElement(VInput).checked := VItem.Checked;
      VInput.addEventListener('click', TJSEventHandler(@ItemCheckClick));
      VLi.AppendChild(VInput);
    end;

    if AWithIcon and (VItem.ImageUrl <> '') then
    begin
      VIcon := TJSHTMLElement(Document.CreateElement('img'));
      VIcon.classList.add('wcl-lv-icon');
      VIcon.setAttribute('src', VItem.ImageUrl);
      VIcon.setAttribute('alt', '');
      VLi.AppendChild(VIcon);
    end;

    VText := TJSHTMLElement(Document.CreateElement('span'));
    VText.classList.add('wcl-lv-text');
    VText.TextContent := VItem.Caption;
    VLi.AppendChild(VText);

    VLi.addEventListener('click', TJSEventHandler(@ItemClick));
    VUl.AppendChild(VLi);
  end;
  HandleElement.AppendChild(VUl);
end;

procedure TCustomListView.RenderIcons;
var
  VDiv, VTile, VInput, VIcon, VText, VSub: TJSHTMLElement;
  VItem: TListItem;
  I: NativeInt;
begin
  VDiv := TJSHTMLElement(Document.CreateElement('div'));
  VDiv.classList.add('wcl-lv-icons');
  for I := 0 to (FItems.Count - 1) do
  begin
    VItem := FItems[I];
    VTile := TJSHTMLElement(Document.CreateElement('div'));
    VTile.classList.add('wcl-lv-tile');
    VTile.classList.add('wcl-lv-row');
    if VItem.FSelected then
      VTile.classList.add('wcl-lv-selected');
    VTile.setAttribute('data-wcl-item', IntToStr(I));

    if FCheckboxes then
    begin
      VInput := TJSHTMLElement(Document.CreateElement('input'));
      VInput.setAttribute('type', 'checkbox');
      VInput.setAttribute('data-wcl-item', IntToStr(I));
      TJSHTMLInputElement(VInput).checked := VItem.Checked;
      VInput.addEventListener('click', TJSEventHandler(@ItemCheckClick));
      VTile.AppendChild(VInput);
    end;

    if (VItem.ImageUrl <> '') then
    begin
      VIcon := TJSHTMLElement(Document.CreateElement('img'));
      VIcon.setAttribute('src', VItem.ImageUrl);
      VIcon.setAttribute('alt', '');
      VTile.AppendChild(VIcon);
    end;

    VText := TJSHTMLElement(Document.CreateElement('span'));
    VText.classList.add('wcl-lv-text');
    VText.TextContent := VItem.Caption;
    VTile.AppendChild(VText);

    if (VItem.SubItems.Count > 0) then
    begin
      VSub := TJSHTMLElement(Document.CreateElement('span'));
      VSub.classList.add('wcl-lv-sub');
      VSub.TextContent := VItem.SubItems[0];
      VTile.AppendChild(VSub);
    end;

    VTile.addEventListener('click', TJSEventHandler(@ItemClick));
    VDiv.AppendChild(VTile);
  end;
  HandleElement.AppendChild(VDiv);
end;

function TCustomListView.ItemFromEvent(AEvent: TJSMouseEvent): TListItem;
var
  VElement: TJSHTMLElement;
  VIndex: NativeInt;
begin
  Result := nil;
  if (not Assigned(AEvent)) then
    Exit;
  VElement := TJSHTMLElement(AEvent.currentTargetElement);
  if (not Assigned(VElement)) or (not VElement.hasAttribute('data-wcl-item')) then
    Exit;
  VIndex := StrToIntDef(VElement.getAttribute('data-wcl-item'), -1);
  if (VIndex >= 0) and (VIndex < FItems.Count) then
    Result := FItems[VIndex];
end;

function TCustomListView.ColumnFromEvent(AEvent: TJSMouseEvent): TListColumn;
var
  VElement: TJSHTMLElement;
  VIndex: NativeInt;
begin
  Result := nil;
  if (not Assigned(AEvent)) then
    Exit;
  VElement := TJSHTMLElement(AEvent.currentTargetElement);
  if (not Assigned(VElement)) or (not VElement.hasAttribute('data-wcl-col')) then
    Exit;
  VIndex := StrToIntDef(VElement.getAttribute('data-wcl-col'), -1);
  if (VIndex >= 0) and (VIndex < FColumns.Count) then
    Result := FColumns[VIndex];
end;

function TCustomListView.ItemClick(AEvent: TJSMouseEvent): boolean;
var
  VItem: TListItem;
begin
  Result := True;
  VItem := ItemFromEvent(AEvent);
  if (not Assigned(VItem)) then
    Exit;
  SetFocus;
  if FMultiSelect and AEvent.ctrlKey then
  begin
    FAnchor := VItem;
    SelectItem(VItem, not VItem.FSelected);
  end
  else if FMultiSelect and AEvent.shiftKey and Assigned(FAnchor) then
    SelectRange(FAnchor, VItem)
  else
  begin
    FAnchor := VItem;
    SetSelected(VItem);
  end;
end;

function TCustomListView.ItemCheckClick(AEvent: TJSMouseEvent): boolean;
var
  VItem: TListItem;
begin
  AEvent.StopPropagation;
  AEvent.PreventDefault;
  Result := True;
  if FReadOnly then
    Exit;
  VItem := ItemFromEvent(AEvent);
  if (not Assigned(VItem)) then
    Exit;
  SetFocus;
  VItem.Checked := not VItem.Checked;
  DoItemChecked(VItem);
end;

function TCustomListView.ColumnClickHandler(AEvent: TJSMouseEvent): boolean;
var
  VColumn: TListColumn;
begin
  AEvent.StopPropagation;
  Result := True;
  VColumn := ColumnFromEvent(AEvent);
  if Assigned(VColumn) then
    ColumnClick(VColumn);
end;

procedure TCustomListView.ColumnClick(AColumn: TListColumn);
begin
  if (not Assigned(AColumn)) then
    Exit;
  if Assigned(FOnColumnClick) then
    FOnColumnClick(Self, AColumn);
  if (not FAutoSort) then
    Exit;
  if (FSortColumn = AColumn.Index) then
  begin
    if (FSortDirection = sdAscending) then
      FSortDirection := sdDescending
    else
      FSortDirection := sdAscending;
  end
  else
  begin
    FSortColumn := AColumn.Index;
    FSortDirection := sdAscending;
  end;
  SortItems;
end;

procedure TCustomListView.SortItems;
var
  VIndex, VInner: NativeInt;
  VTemp: TListItem;
  VCompare: Integer;

  function CompareItems(A, B: TListItem): Integer;
  var
    VSub: NativeInt;
    VA, VB: string;
  begin
    if (FSortType in [stData, stBoth]) and Assigned(FOnCompare) then
    begin
      VCompare := 0;
      FOnCompare(Self, A, B, FSortColumn, VCompare);
      Result := VCompare;
    end
    else
    begin
      if (FSortColumn > 0) then
      begin
        VSub := FSortColumn - 1;
        if (VSub < A.SubItems.Count) then
          VA := A.SubItems[VSub]
        else
          VA := '';
        if (VSub < B.SubItems.Count) then
          VB := B.SubItems[VSub]
        else
          VB := '';
        Result := CompareText(VA, VB);
        if (Result = 0) then
          Result := CompareText(A.Caption, B.Caption);
      end
      else
        Result := CompareText(A.Caption, B.Caption);
    end;
    if (FSortDirection = sdDescending) then
      Result := -Result;
  end;

begin
  BeginUpdate;
  try
    /// Insertion sort: the lists are small and it avoids a comparer object.
    for VIndex := 1 to (FItems.Count - 1) do
    begin
      VTemp := FItems[VIndex];
      VInner := VIndex - 1;
      while (VInner >= 0) and (CompareItems(FItems[VInner], VTemp) > 0) do
      begin
        FItems.FItems[VInner + 1] := FItems.FItems[VInner];
        Dec(VInner);
      end;
      FItems.FItems[VInner + 1] := VTemp;
    end;
    for VIndex := 0 to (FColumns.Count - 1) do
    begin
      if (VIndex = FSortColumn) then
      begin
        if (FSortDirection = sdAscending) then
          FColumns[VIndex].FSortIndicator := siAscending
        else
          FColumns[VIndex].FSortIndicator := siDescending;
      end
      else
        FColumns[VIndex].FSortIndicator := siNone;
    end;
  finally
    EndUpdate;
  end;
end;

function TCustomListView.AlphaSort: Boolean;
begin
  FSortColumn := 0;
  FSortDirection := sdAscending;
  SortItems;
  Result := True;
end;

procedure TCustomListView.Clear;
begin
  FItems.Clear;
end;

function TCustomListView.FindItemElement(AItem: TListItem): TJSHTMLElement;
begin
  Result := nil;
  if (not Assigned(AItem)) or (not Assigned(HandleElement)) then
    Exit;
  Result := TJSHTMLElement(HandleElement.querySelector(
    '[data-wcl-item="' + IntToStr(AItem.Index) + '"].wcl-lv-row'));
end;

procedure TCustomListView.ScrollToItem(AItem: TListItem);
var
  VElement: TJSHTMLElement;
begin
  VElement := FindItemElement(AItem);
  if Assigned(VElement) then
    asm
      VElement.scrollIntoView({ block: 'nearest' });
    end;
end;

procedure TCustomListView.MoveSelection(ADelta: NativeInt);
var
  VIndex: NativeInt;
begin
  if (FItems.Count = 0) then
    Exit;
  VIndex := GetItemIndex;
  if (VIndex < 0) then
    VIndex := 0
  else
    VIndex := VIndex + ADelta;
  if (VIndex < 0) then
    VIndex := 0;
  if (VIndex > (FItems.Count - 1)) then
    VIndex := FItems.Count - 1;
  SetSelected(FItems[VIndex]);
  ScrollToItem(FItems[VIndex]);
end;

procedure TCustomListView.SelectFirst;
begin
  if (FItems.Count > 0) then
  begin
    SetSelected(FItems[0]);
    ScrollToItem(FItems[0]);
  end;
end;

procedure TCustomListView.SelectLast;
begin
  if (FItems.Count > 0) then
  begin
    SetSelected(FItems[FItems.Count - 1]);
    ScrollToItem(FItems[FItems.Count - 1]);
  end;
end;

procedure TCustomListView.KeyDown(var Key: NativeInt; Shift: TShiftState);
begin
  inherited KeyDown(Key, Shift);
  case Key of
    /// Up
    38:
      begin
        MoveSelection(-1);
        Key := 0;
      end;
    /// Down
    40:
      begin
        MoveSelection(1);
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
    /// Space
    32:
      begin
        if FCheckboxes and (not FReadOnly) and Assigned(Selected) then
        begin
          Selected.Checked := not Selected.Checked;
          DoItemChecked(Selected);
        end;
        Key := 0;
      end;
    /// Ctrl+A
    65:
      begin
        if (ssCtrl in Shift) and FMultiSelect then
        begin
          SelectAll;
          Key := 0;
        end;
      end;
  end;
end;

end.
