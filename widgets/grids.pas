{
 /***************************************************************************
                                grids.pas
                                ---------

                   Initial Revision : Fri Oct 30 CST 2020

 ***************************************************************************/

 *****************************************************************************
  This file is part of the Web Component Library (WCL)

  See the file COPYING.modifiedLGPL.txt, included in this distribution,
  for details about the license.
 *****************************************************************************
}

unit Grids;

{$mode objfpc}{$H+}

{.$define DEBUG_GRID}

interface

uses
  SysUtils, Classes, Controls, Types, Web, Graphics, StdCtrls;

const
  DEFCOLWIDTH         = 64;

type
  TCustomGrid = class;
  TGridColumn = class;

  EGridException = class(Exception);

  TGridOption = (
    goFixedVertLine, goFixedHorzLine, goVertLine, goHorzLine, goRangeSelect,
    goDrawFocusSelected, goRowSizing, goColSizing, goRowMoving, goColMoving,
    goEditing, goTabs, goRowSelect, goAlwaysShowEditor, goThumbTracking,
    goColSpanning, goRelaxedRowSelect, goDblClickAutoSize, goSmoothScroll);
  TGridOptions = set of TGridOption;

  TGridState = (gsNormal, gsSelecting, gsRowSizing, gsColSizing, gsRowMoving,
    gsColMoving, gsHeaderClicking, gsButtonColumnClicking);

  TGridDrawState = set of (gdSelected, gdFixed, gdFocused);

  TGridZone = (gzNormal, gzFixedCols, gzFixedRows, gzFixedCells, gzInvalid);
  TGridZoneSet = set of TGridZone;

  TGridDataCache = record
    FixedWidth: Integer;        { Sum( Fixed ColsWidths[i] ) }
    FixedHeight: Integer;       { Sum( Fixed RowsHeights[i] ) }
    GridWidth: Integer;         { Sum( ColWidths[i] ) }
    GridHeight: Integer;        { Sum( RowHeights[i] ) }
    AccumWidth: TIntegerList;   { Accumulated width per column }
    AccumHeight: TIntegerList;  { Accumulated Height per row }
    HotGridZone: TGridZone;     { GridZone of last MouseMove }
    ClickCell: TPoint;          { cell coords of the latest mouse click }
    ClickMouse: TPoint;         { mouse coords of the latest mouse click }
  end;

const
  DefaultGridOptions = [];

type
  TOnSelectEvent = procedure(aSender: TObject; aCol, aRow: Integer) of object;
  TOnSelectCellEvent = procedure(Sender: TObject; ACol, ARow: LongInt;
    var CanSelect: Boolean) of object;
  TOnGetEditTextEvent = procedure(Sender: TObject; ACol, ARow: LongInt;
    var Value: string) of object;
  TOnSetEditTextEvent = procedure(Sender: TObject; ACol, ARow: LongInt;
    const Value: string) of object;
  TOnDrawCellEvent = procedure(Sender: TObject; ACol, ARow: LongInt;
    AState: TGridDrawState; ACell: TJSHTMLTableDataCellElement) of object;

  { TGridColumnTitle }

  TGridColumnTitle = class(TPersistent)
  private
    fColumn: TGridColumn;
    fAlignment: TAlignment;
    fCaption: TCaption;
    fIsDefaultAlignment: Boolean;
    fIsDefaultCaption: Boolean;
    fIsDefaultLayout: Boolean;
    fLayout: TTextLayout;
    function GetAlignment: TAlignment;
    function GetLayout: TTextLayout;
    function IsAlignmentStored: Boolean;
    function IsCaptionStored: Boolean;
    function IsLayoutStored: Boolean;
    procedure SetAlignment(aValue: TAlignment);
    procedure SetLayout(aValue: TTextLayout);
    procedure WriteCaption(aWriter: TWriter);
  protected
    function GetDefaultAlignment: TAlignment;
    function GetDefaultCaption: String; virtual;
    function GetDefaultLayout: TTextLayout;
    function GetCaption: TCaption;
    procedure SetCaption(const aValue: TCaption); virtual;
  public
    constructor Create(aColumn: TGridColumn); virtual;
    procedure Assign(aSource: TPersistent); override;

    function IsDefault: Boolean;

    property Column: TGridColumn read fColumn;
  published
    property Alignment: TAlignment read GetAlignment write SetAlignment stored IsAlignmentStored;
    property Caption: TCaption read GetCaption write SetCaption stored IsCaptionStored;
    property Layout: TTextLayout read GetLayout write SetLayout stored IsLayoutStored;
  end;

  { TGridColumn }

  TGridColumn = class(TCollectionItem)
  private
    fAlignment: TAlignment;
    fLayout: TTextLayout;
    fTitle: TGridColumnTitle;
    function GetGrid: TCustomGrid;
    procedure SetAlignment(aValue: TAlignment);
    procedure SetLayout(AValue: TTextLayout);
    procedure SetTitle(aValue: TGridColumnTitle);
  protected
    function GetDefaultAlignment: TAlignment; virtual;
    function GetDefaultLayout: TTextLayout; virtual;

    procedure ColumnChanged; virtual;
    function CreateTitle: TGridColumnTitle; virtual;
  public
    constructor Create(aCollection: TCollection); override;
    destructor Destroy; override;

    function IsDefault: Boolean;

    property Grid: TCustomGrid read GetGrid;
  published
    property Alignment: TAlignment read fAlignment write SetAlignment;
    property Layout: TTextLayout read fLayout write SetLayout;
    property Title: TGridColumnTitle read fTitle write SetTitle;
  end;

  { TGridColumns }

  TGridColumns = class(TCollection)
  private
    fGrid: TCustomGrid;
    function GetColumn(Index: Integer): TGridColumn;
    function GetEnabled: Boolean;
    function GetVisibleCount: Integer;
    procedure SetColumn(Index: Integer; AValue: TGridColumn);
  protected
    procedure Update(aItem: TCollectionItem); override;
  public
    constructor Create(aGrid: TCustomGrid; aItemClass: TCollectionItemClass);

    function Add: TGridColumn;
    procedure Clear;
    function ColumnByTitle(const aTitle: String): TGridColumn;
    function IndexOf(aColumn: TGridColumn): Integer;
    function IsDefault: Boolean;
    function RealIndex(aIndex: Integer): Integer;

    property Enabled: Boolean read GetEnabled;
    property Grid: TCustomGrid read fGrid;
    property Items[Index: Integer]: TGridColumn read GetColumn write SetColumn; default;
    property VisibleCount: Integer read GetVisibleCount;
  end;

  TGridRect = TRect;
  TGridCoord = TPoint;

  { TCustomGrid }

  TCustomGrid = class(TCustomControl)
  private
    fAllowOutboundEvents: Boolean;
    fBorderColor: TColor;
    fCol: Integer;
    fCols: TIntegerList;
    fColumns: TGridColumns;
    fContentTable: TJSHTMLTableElement;
    fDefColWidth: Integer;
    fDefRowHeight: Integer;
    fEditing: Boolean;
    fEditor: TJSHTMLInputElement;
    fEditorCell: TJSHTMLElement;
    fEditorMode: Boolean;
    fGCache: TGridDataCache;
    fFixedColor: TColor;
    fFixedCols: Integer;
    fFixedColsTable: TJSHTMLTableElement;
    fFixedGridLineColor: TColor;
    fFixedRows: Integer;
    fFixedRowsTable: TJSHTMLTableElement;
    fFixedTopLeftTable: TJSHTMLTableElement;
    fFlat: Boolean;
    fGridBorderStyle: TBorderStyle;
    fMouseCell: TGridCoord;
    fMouseCellValid: Boolean;
    fGridLineColor: TColor;
    fGridLineStyle: TPenStyle;
    fGridLineWidth: Integer;
    fOnAfterSelection: TOnSelectEvent;
    fOnBeforeSelection: TOnSelectEvent;
    fOnDrawCell: TOnDrawCellEvent;
    fOnEditingDone: TNotifyEvent;
    fOnGetEditText: TOnGetEditTextEvent;
    fOnSelectCell: TOnSelectCellEvent;
    fOnSelection: TOnSelectEvent;
    fOnSetEditText: TOnSetEditTextEvent;
    fOnTopLeftChanged: TNotifyEvent;
    fOptions: TGridOptions;
    fRange: TGridRect;
    fRealizedDefColWidth: Integer;
    fRealizedDefRowHeight: Integer;
    fRow: Integer;
    fRows: TIntegerList;
    fScrollBars: TScrollStyle;
    fSelectedColor: TColor;
    fTopLeft: TPoint;
    fUpdateCount: Integer;
    procedure AdjustGrid(aIsColumn: Boolean; aOld, aNew: Integer);
    procedure CheckCount(aNewColCount, aNewRowCount: Integer);
    procedure CheckFixed(aCols, aRows, aFixedCols, aFixedRows: Integer);
    function DefaultColWidthIsStored: Boolean;
    function DefaultRowHeightIsStored: Boolean;
    procedure DoTopLeftChanged;
    procedure FixPosition(aIsColumn: Boolean; aIndex: Integer);
    function GetColCount: Integer;
    function GetColumns: TGridColumns;
    function GetColWidths(aCol: Integer): Integer;
    function GetDefColWidth: Integer;
    function GetDefRowHeight: Integer;
    function GetDrawState(aCol, aRow: Integer): TGridDrawState;
    function GetEditing: Boolean;
    function GetFixedColor: TColor; virtual;
    function GetRowCount: Integer;
    function GetRowHeights(aRow: Integer): Integer;
    function GetSelectedColor: TColor; virtual;
    procedure HeadersMouseMove(const aX, aY: Integer);
    function IsColumnsStored: Boolean;
    procedure ResetHotCell;
    function ScrollToCell(const aCol, aRow: Integer; const aForceFullyVisible: Boolean = True): Boolean;
    procedure SetBorderColor(aValue: TColor);
    procedure SetBorderStyle(aValue: TBorderStyle);
    procedure SetCol(aValue: Integer);
    procedure SetColCount(aValue: Integer);
    procedure SetColumns(aValue: TGridColumns);
    procedure SetColWidths(aCol: Integer; aValue: Integer);
    procedure SetDefColWidth(aValue: Integer);
    procedure SetDefRowHeight(aValue: Integer);
    procedure SetEditorMode(aValue: Boolean);
    procedure SetFixedColor(aValue: TColor); virtual;
    procedure SetFixedCols(aValue: Integer);
    procedure SetFixedGridLineColor(AValue: TColor);
    procedure SetFixedRows(aValue: Integer);
    procedure SetFlat(aValue: Boolean);
    procedure SetGridLineColor(aValue: TColor);
    procedure SetGridLineStyle(aValue: TPenStyle);
    procedure SetGridLineWidth(aValue: Integer);
    procedure SetOptions(aValue: TGridOptions);
    procedure SetRow(aValue: Integer);
    procedure SetRowCount(aValue: Integer);
    procedure SetRowHeights(aRow: Integer; aValue: Integer);
    procedure SetScrollBars(aValue: TScrollStyle);
    procedure SetSelectedColor(aValue: TColor); virtual;
    procedure UpdateCachedSizes;
  protected
    fGridState: TGridState;
    procedure AfterMoveSelection(const aPrevCol, aPrevRow: Integer); virtual;
    procedure BeforeMoveSelection(const aCol, aRow: Integer); virtual;
    procedure CacheMouseDown(aX, aY: Integer);
    function CellFromEvent(AEvent: TJSMouseEvent): TGridCoord;
    procedure CellClick(const aCol, aRow: Integer; const aButton: TMouseButton); virtual;
    procedure Changed; override;
    procedure CheckLimits(var aCol, aRow: Integer);
    function ColumnFromGridColumn(aColumn: Integer): TGridColumn;
    function ColumnIndexFromGridColumn(aColumn: Integer): Integer;
    procedure ColumnsChanged(aColumn: TGridColumn);
    function CreateColumns: TGridColumns; virtual;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure DoDrawCell(aCol, aRow: Integer;
      aCell: TJSHTMLTableDataCellElement); virtual;
    procedure DoScroll; override;
    procedure EndEdit(aAccept: Boolean); virtual;
    function FirstGridColumn: Integer; virtual;
    function FixedGrid: Boolean;
    function GetCells(aCol, aRow: Integer): String; virtual;
    function GetDefaultRowHeight: Integer; virtual;
    function GetIsCellSelected(aCol, aRow: Integer): Boolean; virtual;
    function GridColumnFromColumnIndex(aColumnIndex: Integer): Integer;
    function HandleDblClick(AEvent: TJSMouseEvent): boolean; override;
    function HandleEditorBlur(AEvent: TJSEvent): boolean; virtual;
    function HandleEditorKeyDown(AEvent: TJSKeyBoardEvent): boolean; virtual;
    function HandleEditorKeyPress(AEvent: TJSKeyBoardEvent): boolean; virtual;
    function HandleEditorKeyUp(AEvent: TJSKeyBoardEvent): boolean; virtual;
    function HandleMouseDown(AEvent: TJSMouseEvent): boolean; override;
    procedure InternalSetColCount(aCount: Integer);
    procedure InvalidateCell(aCol, aRow: Integer; aRedraw: Boolean); overload;
    function IsCellEditable(aCol, aRow: Integer): Boolean; virtual;
    function IsColumnIndexValid(aIndex: Integer): Boolean;
    function IsColumnIndexVariable(aIndex: Integer): Boolean;
    function IsRowIndexValid(aIndex: Integer): Boolean;
    function IsRowIndexVariable(aIndex: Integer): Boolean;
    procedure KeyDown(var Key: NativeInt; Shift: TShiftState); override;
    procedure KeyPress(var Key: char); override;
    procedure MouseDown(aButton: TMouseButton; aShift: TShiftState; aX, aY: integer); override;
    procedure MouseMove(aShift: TShiftState; aX, aY: integer); override;
    procedure MouseUp(aButton: TMouseButton; aShift: TShiftState; aX, aY: integer); override;
    function MoveExtend(aRelative: Boolean; aCol, aRow: Integer; aForceFullyVisible: Boolean = True): Boolean;
    function MoveNextSelectable(aRelative: Boolean; aDCol, aDRow: Integer): Boolean; virtual;
    procedure MoveSelection; virtual;
    function OffsetToColRow(aIsCol, aFisical: Boolean; aOffset: Integer; out aIndex, aRest: Integer): Boolean;
    function SelectCell(aCol, aRow: Integer): Boolean; virtual;
    procedure SetCellText(aCol, aRow: Integer; const aValue: string); virtual;
    procedure SizeChanged(aOldColCount, aOldRowCount: Integer); virtual;
    procedure StartEdit(const AInitialText: string); virtual;
    function TryMoveSelection(aRelative: Boolean; var aCol, aRow: Integer): Boolean;
    procedure TopLeftChanged; virtual;
    procedure UpdateBorderStyle;
    procedure VisualChange; virtual;

    property AllowOutboundEvents: Boolean read fAllowOutboundEvents write fAllowOutboundEvents default True;
    property BorderColor: TColor read fBorderColor write SetBorderColor default cl3DDKShadow;
    property BorderStyle: TBorderStyle read fGridBorderStyle write SetBorderStyle default bsSingle;
    property Col: Integer read fCol write SetCol;
    property ColCount: Integer read GetColCount write SetColCount default 5;
    property ColWidths[Col: Integer]: Integer read GetColWidths write SetColWidths;
    property Columns: TGridColumns read GetColumns write SetColumns stored IsColumnsStored;
    property DefaultColWidth: Integer read GetDefColWidth write SetDefColWidth stored DefaultColWidthIsStored;
    property DefaultRowHeight: Integer read GetDefRowHeight write SetDefRowHeight stored DefaultRowHeightIsStored;
    property FixedColor: TColor read GetFixedColor write SetFixedColor default clBtnFace;
    property FixedGridLineColor: TColor read fFixedGridLineColor write SetFixedGridLineColor default cl3DDKShadow;
    property Flat: Boolean read fFlat write SetFlat default False;
    property GridLineColor: TColor read fGridLineColor write SetGridLineColor default clSilver;
    property GridLineStyle: TPenStyle read fGridLineStyle write SetGridLineStyle;
    property GridLineWidth: Integer read fGridLineWidth write SetGridLineWidth default 1;
    property Options: TGridOptions read fOptions write SetOptions default DefaultGridOptions;
    property Row: Integer read fRow write SetRow;
    property RowCount: Integer read GetRowCount write SetRowCount default 5;
    property RowHeights[Row: Integer]: Integer read GetRowHeights write SetRowHeights;
    property ScrollBars: TScrollStyle read fScrollBars write SetScrollBars default ssAutoBoth;
    property SelectedColor: TColor read GetSelectedColor write SetSelectedColor;

    property OnAfterSelection: TOnSelectEvent read fOnAfterSelection write fOnAfterSelection;
    property OnBeforeSelection: TOnSelectEvent read fOnBeforeSelection write fOnBeforeSelection;
    property OnDrawCell: TOnDrawCellEvent read fOnDrawCell write fOnDrawCell;
    property OnEditingDone: TNotifyEvent read fOnEditingDone write fOnEditingDone;
    property OnGetEditText: TOnGetEditTextEvent read fOnGetEditText write fOnGetEditText;
    property OnSelectCell: TOnSelectCellEvent read fOnSelectCell write fOnSelectCell;
    property OnSelection: TOnSelectEvent read fOnSelection write fOnSelection;
    property OnSetEditText: TOnSetEditTextEvent read fOnSetEditText write fOnSetEditText;
  public
    constructor Create(aOwner: TComponent); override;
    destructor Destroy; override;

    function CellToGridZone(aCol, aRow: Integer): TGridZone;
    procedure Clear;
    function ClearCols: Boolean;
    function ClearRows: Boolean;
    procedure InvalidateCell(aCol, aRow: Integer); overload;
    procedure MouseToCell(aX, aY: Integer; out aCol, aRow: Integer); overload;
    function MouseToCell(const aMouse: TPoint): TGridCoord; overload; inline;
    function MouseToGridZone(aX, aY: Integer): TGridZone;

    property EditorMode: Boolean read fEditorMode write SetEditorMode;
    property Editing: Boolean read GetEditing;
    property FixedCols: Integer read fFixedCols write SetFixedCols default 1;
    property FixedRows: Integer read fFixedRows write SetFixedRows default 1;

    property OnTopLeftChanged: TNotifyEvent read fOnTopLeftChanged write fOnTopLeftChanged;
  end;

  TCellProps = class
    Data: TObject;
    Text: String;
  end;

  TColRowProps = class
    Size: Integer;
  end;

  { TVirtualGrid }

  TVirtualGrid = class
  private type
    TCellPropsArray = array of TCellProps;
    TCellPropsArrayArray = array of TCellPropsArray;
    TColRowPropsArray = array of TColRowProps;
  private
    fColCount: Integer;
    fRowCount: Integer;
    fCellArr: TCellPropsArrayArray;
    fColArr, fRowArr: TColRowPropsArray;
    function GetCells(aCol, aRow: Integer): TCellProps;
    function GetCols(aCol: Integer): TColRowProps;
    function GetRows(aRow: Integer): TColRowProps;
    procedure SetCells(aCol, aRow: Integer; aValue: TCellProps);
    procedure SetColCount(aValue: Integer);
    procedure SetCols(aCol: Integer; aValue: TColRowProps);
    procedure SetRowCount(aValue: Integer);
    procedure SetRows(aRow: Integer; aValue: TColRowProps);
  protected

  public
    procedure Clear;
    function GetDefaultCell: TCellProps;
    function GetDefaultColRow: TColRowProps;

    property ColCount: Integer read fColCount write SetColCount;
    property RowCount: Integer read fRowCount write SetRowCount;

    property Celda[Col, Row: Integer]: TCellProps read GetCells write SetCells;
    property Cols[Col: Integer]: TColRowProps read GetCols write SetCols;
    property Rows[Row: Integer]: TColRowProps read GetRows write SetRows;
  end;

  { TCustomDrawGrid }

  TCustomDrawGrid = class(TCustomGrid)
  protected
    FGrid: TVirtualGrid;
    function CreateVirtualGrid: TVirtualGrid; virtual;
    procedure SizeChanged(aOldColCount, aOldRowCount: Integer); override;
  public
    constructor Create(aOwner: TComponent); override;
    destructor Destroy; override;

    property AllowOutboundEvents;
    property Col;
    property ColCount;
    property ColWidths;
    property Options;
    property Row;
    property RowCount;
    property RowHeights;
  end;

  { TCustomStringGrid }

  TCustomStringGrid = class(TCustomDrawGrid)
  private
    fModified: Boolean;
  protected
    function GetCells(aCol, aRow: Integer): String; override;
    procedure SetCellText(aCol, aRow: Integer; const aValue: string); override;
    procedure SetCells(aCol, aRow: Integer; const aValue: String); virtual;

    property Modified: Boolean read fModified write fModified;
  public
    property Cells[Col, Row: Integer]: String read GetCells write SetCells;
    {property Cols[Index: Integer]: TStrings read GetCols write SetCols;
    property Objects[Col, Row: Integer]: TObject read GetObjects write SetObjects;
    property Rows[Index: Integer]: TStrings read GetRows write SetRows;}
  end;

  TWStringGrid = class(TCustomStringGrid)
  published
    property Anchors;
    property Col;
    property ColCount;
    property Columns;
    property DefaultColWidth;
    property DefaultRowHeight;
    property EditorMode;
    property FixedCols;
    property FixedRows;
    property Options;
    property Row;
    property RowCount;
    property ScrollBars;

    property OnDrawCell;
    property OnEditingDone;
    property OnGetEditText;
    property OnSelectCell;
    property OnSelection;
    property OnSetEditText;
  end;

implementation

uses
  TypInfo, WCLStrConsts;

{ TCustomStringGrid }

function TCustomStringGrid.GetCells(aCol, aRow: Integer): String;
var
  c: TCellProps;
begin
  Result := '';
  c := fGrid.Celda[aCol, aRow];
  if Assigned(c) then
    Result := c.Text;
end;

procedure TCustomStringGrid.SetCells(aCol, aRow: Integer; const aValue: String);

  procedure UpdateCell;
  begin
    InvalidateCell(aCol, aRow);
  end;

var
  c: TCellProps;
begin
  c := fGrid.Celda[aCol, aRow];
  if Assigned(c) then begin
    c.Text := aValue;
    UpdateCell;
    fModified := True;
  end else if aValue <> '' then begin
    c := TCellProps.Create;
    c.Text := aValue;
    fGrid.Celda[aCol, aRow] := c;
    UpdateCell;
    fModified := True;
  end;
end;

procedure TCustomStringGrid.SetCellText(aCol, aRow: Integer;
  const aValue: string);
begin
  SetCells(aCol, aRow, aValue);
end;

{ TCustomDrawGrid }

function TCustomDrawGrid.CreateVirtualGrid: TVirtualGrid;
begin
  Result := TVirtualGrid.Create;
end;

procedure TCustomDrawGrid.SizeChanged(aOldColCount, aOldRowCount: Integer);
begin
  if aOldColCount <> ColCount then begin
    fGrid.ColCount := ColCount;
  end;

  if aOldRowCount <> RowCount then begin
    fGrid.RowCount := RowCount;
  end;
end;

constructor TCustomDrawGrid.Create(aOwner: TComponent);
begin
  fGrid := CreateVirtualGrid;
  inherited Create(aOwner);
end;

destructor TCustomDrawGrid.Destroy;
begin
  fGrid.Free;
  inherited Destroy;
end;

{ TVirtualGrid }

procedure TVirtualGrid.SetColCount(aValue: Integer);
begin
  if fColCount = aValue then
    Exit;

  fColCount := aValue;

  SetLength(fColArr, fColCount);
  SetLength(fCellArr, fColCount, fRowCount);
end;

function TVirtualGrid.GetCells(aCol, aRow: Integer): TCellProps;
begin
  Result := fCellArr[aCol, aRow];
end;

function TVirtualGrid.GetCols(aCol: Integer): TColRowProps;
begin
  Result := fColArr[aCol];
end;

function TVirtualGrid.GetRows(aRow: Integer): TColRowProps;
begin
  Result := fRowArr[aRow];
end;

procedure TVirtualGrid.SetCells(aCol, aRow: Integer; aValue: TCellProps);
begin
  fCellArr[aCol, aRow].Free;
  fCellArr[aCol, aRow] := aValue;
end;

procedure TVirtualGrid.SetCols(aCol: Integer; aValue: TColRowProps);
begin
  fColArr[aCol].Free;
  fColArr[aCol] := aValue;
end;

procedure TVirtualGrid.SetRowCount(aValue: Integer);
begin
  if fRowCount = AValue then
    Exit;

  fRowCount := aValue;

  SetLength(fRowArr, fRowCount);
  SetLength(fCellArr, fColCount, fRowCount);
end;

procedure TVirtualGrid.SetRows(aRow: Integer; aValue: TColRowProps);
begin
  fRowArr[aRow].Free;
  fRowArr[aRow] := aValue;
end;

procedure TVirtualGrid.Clear;
begin
  fRowCount := 0;
  fColCount := 0;
end;

function TVirtualGrid.GetDefaultCell: TCellProps;
begin
  Result := TCellProps.Create;
end;

function TVirtualGrid.GetDefaultColRow: TColRowProps;
begin
  Result := TColRowProps.Create;
end;

{ TGridColumnTitle }

function TGridColumnTitle.IsCaptionStored: Boolean;
begin
  Result := not fIsDefaultCaption;
end;

function TGridColumnTitle.GetAlignment: TAlignment;
begin
  if fIsDefaultAlignment then
    Result := GetDefaultAlignment
  else
    Result := fAlignment;
end;

function TGridColumnTitle.GetLayout: TTextLayout;
begin
  if fIsDefaultLayout then
    Result := GetDefaultLayout
  else
    Result := fLayout;
end;

function TGridColumnTitle.IsAlignmentStored: Boolean;
begin
  Result := not fIsDefaultAlignment;
end;

function TGridColumnTitle.IsLayoutStored: Boolean;
begin
  Result := not fIsDefaultLayout;
end;

procedure TGridColumnTitle.SetAlignment(aValue: TAlignment);
begin
  if fIsDefaultAlignment or (fAlignment <> aValue) then begin
    fIsDefaultAlignment := False;
    fAlignment := aValue;
    fColumn.ColumnChanged;
  end;
end;

procedure TGridColumnTitle.SetLayout(aValue: TTextLayout);
begin
  if fIsDefaultLayout or (fLayout <> aValue) then begin
    fIsDefaultLayout := False;
    fLayout := aValue;
    fColumn.ColumnChanged;
  end;
end;

procedure TGridColumnTitle.WriteCaption(aWriter: TWriter);
var
  s: TCaption;
  pi: TTypeMemberProperty;
begin
  s := Caption;
  if Assigned(aWriter.OnWriteStringProperty) then begin
    pi := GetPropInfo(Self, 'Caption');
    aWriter.OnWriteStringProperty(aWriter, Self, pi, s);
  end;
  aWriter.WriteString(s);
end;

function TGridColumnTitle.GetDefaultAlignment: TAlignment;
begin
  Result := taLeftJustify;
end;

function TGridColumnTitle.GetCaption: TCaption;
begin
  if fIsDefaultCaption then
    Result := GetDefaultCaption
  else
    Result := fCaption;
end;

procedure TGridColumnTitle.SetCaption(const aValue: TCaption);
begin
  if fIsDefaultCaption or (fCaption <> aValue) then begin
    fIsDefaultCaption := False;
    fCaption := aValue;
    fColumn.ColumnChanged;
  end;
end;

function TGridColumnTitle.GetDefaultCaption: String;
begin
  Result := 'Title';
end;

function TGridColumnTitle.GetDefaultLayout: TTextLayout;
begin
  Result := tlCenter;
end;

constructor TGridColumnTitle.Create(aColumn: TGridColumn);
begin
  fColumn := aColumn;

  fIsDefaultAlignment := True;
  fIsDefaultCaption := True;
  fIsDefaultLayout := True;

  fAlignment := taLeftJustify;
  fLayout := tlCenter;
end;

procedure TGridColumnTitle.Assign(aSource: TPersistent);
begin
  if aSource is TGridColumnTitle then begin
    Caption := TGridColumnTitle(aSource).Caption;
  end else
    inherited Assign(aSource);
end;

function TGridColumnTitle.IsDefault: Boolean;
begin
  Result := fIsDefaultCaption and
            fIsDefaultAlignment and
            fIsDefaultLayout;
end;

{ TGridColumn }

function TGridColumn.GetGrid: TCustomGrid;
begin
  if Collection is TGridColumns then
    Result := (Collection as TGridColumns).Grid
  else
    Result := nil;
end;

procedure TGridColumn.SetAlignment(aValue: TAlignment);
begin
  if fAlignment <> aValue then begin
    fAlignment := aValue;
    ColumnChanged;
  end;
end;

procedure TGridColumn.SetLayout(AValue: TTextLayout);
begin
  if fLayout = aValue then
    Exit;
  fLayout := aValue;
  ColumnChanged;
end;

procedure TGridColumn.SetTitle(aValue: TGridColumnTitle);
begin
  fTitle.Assign(aValue);
end;

function TGridColumn.GetDefaultAlignment: TAlignment;
begin
  Result := taLeftJustify;
end;

function TGridColumn.GetDefaultLayout: TTextLayout;
begin
  Result := tlCenter;
end;

procedure TGridColumn.ColumnChanged;
begin
  Changed(False);
end;

function TGridColumn.CreateTitle: TGridColumnTitle;
begin
  Result := TGridColumnTitle.Create(Self);
end;

constructor TGridColumn.Create(aCollection: TCollection);
begin
  inherited Create(aCollection);

  fTitle := CreateTitle;

  fAlignment := GetDefaultAlignment;
end;

destructor TGridColumn.Destroy;
begin
  fTitle.Free;
  inherited Destroy;
end;

function TGridColumn.IsDefault: Boolean;
begin
  Result := fTitle.IsDefault;
end;

{ TGridColumns }

function TGridColumns.GetColumn(Index: Integer): TGridColumn;
begin
  Result := TGridColumn(inherited Items[Index]);
end;

function TGridColumns.GetEnabled: Boolean;
begin
  Result := VisibleCount > 0;
end;

function TGridColumns.GetVisibleCount: Integer;
begin
  Result := Count;
end;

procedure TGridColumns.SetColumn(Index: Integer; AValue: TGridColumn);
begin
  Items[Index].Assign(aValue);
end;

procedure TGridColumns.Update(aItem: TCollectionItem);
begin
  fGrid.ColumnsChanged(TGridColumn(aItem));
end;

constructor TGridColumns.Create(aGrid: TCustomGrid;
  aItemClass: TCollectionItemClass);
begin
  inherited Create(aItemClass);
  fGrid := aGrid;
end;

function TGridColumns.Add: TGridColumn;
begin
  Result := TGridColumn(inherited Add);
end;

procedure TGridColumns.Clear;
begin
  BeginUpdate;
  try
    inherited Clear;
  finally
    EndUpdate;
  end;
end;

function TGridColumns.ColumnByTitle(const aTitle: String): TGridColumn;
var
  i: Integer;
begin
  Result := Nil;
  for i := 0 to Count - 1 do
    if SameText(Items[i].Title.Caption, aTitle) then begin
      Result := Items[i];
      Break;
    end;
end;

function TGridColumns.IndexOf(aColumn: TGridColumn): Integer;
var
  i: Integer;
begin
  Result := -1;
  for i := 0 to Count - 1 do
    if Items[i] = aColumn then begin
      Result := i;
      Break;
    end;
end;

function TGridColumns.IsDefault: Boolean;
var
  i: Integer;
begin
  Result := True;
  for i := 0 to Count - 1 do begin
    Result := Result and Items[i].IsDefault;
    if not Result then
      Break;
  end;
end;

function TGridColumns.RealIndex(aIndex: Integer): Integer;
begin
  if aIndex >= Count then
    Result := -1
  else
    Result := aIndex;
end;

{ TCustomGrid }

procedure TCustomGrid.AdjustGrid(aIsColumn: Boolean; aOld, aNew: Integer);

  procedure AdjustList(aList: TIntegerList; aCount: Integer);
  begin
    { add new elements with the default size }
    while aList.Count < aCount do
      aList.Add(-1);

    aList.Count := aCount;
  end;

var
  oldcount, newcount: Integer;
begin
  if aIsColumn then begin
    AdjustList(fCols, aNew);
    fGCache.AccumWidth.Count := aNew;

    oldcount := RowCount;
    if (aOld = 0) and (aNew >= 0) then begin
      fTopLeft.X := fFixedCols;
      if RowCount = 0 then begin
        newcount := 1;
        fTopLeft.Y := fFixedRows;
        AdjustList(fRows, newcount);
        fGCache.AccumHeight.Count := newcount;
      end;
    end;

    UpdateCachedSizes;
    SizeChanged(aOld, oldcount);

    { if new count makes current Col out of range, adjust position if not,
       position should not change (fake changed col to be the last one) }
    Dec(aNew);
    if aNew < Col then
      aNew := Col;
    FixPosition(True, aNew);
  end else begin
    AdjustList(fRows, aNew);
    fGCache.AccumHeight.Count := aNew;

    oldcount := ColCount;
    if (aOld = 0) and (aNew >= 0) then begin
      fTopLeft.Y := fFixedRows;
      if ColCount = 0 then begin
        newcount := 1;
        fTopLeft.X := fFixedCols;
        AdjustList(fCols, newcount);
        fGCache.AccumWidth.Count := newcount;
      end;
    end;

    UpdateCachedSizes;
    SizeChanged(oldcount, aOld);

    { if new count makes current Row out of range, adjust position if not,
      position should not change (fake changed row to be the last one) }
    Dec(aNew);
    if aNew < Row then
      aNew := Row;
    FixPosition(False, aNew);
  end;
end;

procedure TCustomGrid.CheckCount(aNewColCount, aNewRowCount: Integer);
var
  newcol, newrow: Integer;
begin
  if Col >= aNewColCount then
    newcol := aNewColCount - 1
  else
    newcol := Col;
  if Row >= aNewRowCount then
    newrow := aNewRowCount - 1
  else
    newrow := Row;
  if (newcol >= 0) and (newrow >= 0) and ((newcol <> Col) or (newrow <> Row)) then begin
    if (aNewColCount <> fFixedCols) and (aNewRowCount <> fFixedRows) then
      MoveNextSelectable(False, NewCol, NewRow);
  end;
end;

procedure TCustomGrid.CheckFixed(aCols, aRows, aFixedCols, aFixedRows: Integer);
begin
  if aFixedCols < 0 then
    raise EGridException.Create('FixedCols < 0');
  if aFixedRows < 0 then
    raise EGridException.Create('FixedRows < 0');

  if csLoading in ComponentState then
    Exit;

  if aFixedCols > aCols then
    raise EGridException.Create(rsFixedColsTooBig);
  if aFixedRows > aRows then
    raise EGridException.Create(rsFixedRowsTooBig);
end;

function TCustomGrid.DefaultColWidthIsStored: Boolean;
begin
  Result := fDefColWidth >= 0;
end;

function TCustomGrid.DefaultRowHeightIsStored: Boolean;
begin
  Result := fDefRowHeight >= 0;
end;

procedure TCustomGrid.DoTopLeftChanged;
begin
  TopLeftChanged;
  VisualChange;
end;

procedure TCustomGrid.FixPosition(aIsColumn: Boolean; aIndex: Integer);

  procedure FixSelection;
  begin
    if fRow > fRows.Count - 1 then
      fRow := fRows.Count - 1
    else if (fRow < FixedRows) and (FixedRows < fRows.Count) then
      fRow := FixedRows;
    if fCol > fCols.Count - 1 then
      fCol := fCols.Count - 1
    else if (fCol < FixedCols) and (FixedCols < fCols.Count) then
      fCol := FixedCols;
  end;

begin
  FixSelection;
  VisualChange;
end;

function TCustomGrid.GetColCount: Integer;
begin
  Result := fCols.Count;
end;

function TCustomGrid.GetColumns: TGridColumns;
begin
  Result := fColumns;
end;

function TCustomGrid.GetColWidths(aCol: Integer): Integer;
begin
  if IsColumnIndexValid(aCol) then
    Result := FCols[aCol]
  else
    Result := -1;

  if Result < 0 then
    Result := DefaultColWidth;
end;

function TCustomGrid.GetDefColWidth: Integer;
begin
  if fDefColWidth < 0 then begin
    if fRealizedDefColWidth <= 0 then
      fRealizedDefColWidth := DEFCOLWIDTH;
    Result := fRealizedDefColWidth;
  end else
    Result := fDefColWidth;
end;

function TCustomGrid.GetDefRowHeight: Integer;
begin
  if fDefRowHeight < 0 then begin
    if fRealizedDefRowHeight <= 0 then
      fRealizedDefRowHeight := GetDefaultRowHeight;
    Result := fRealizedDefRowHeight;
  end else
    Result := fDefRowHeight;
end;

function TCustomGrid.GetFixedColor: TColor;
begin
  Result := fFixedColor;
end;

function TCustomGrid.GetRowCount: Integer;
begin
  Result := fRows.Count;
end;

function TCustomGrid.GetRowHeights(aRow: Integer): Integer;
begin
  if IsRowIndexValid(aRow) then
    Result := FRows[aRow]
  else
    Result := -1;

  if Result < 0 then
    Result := DefaultRowHeight;
end;

function TCustomGrid.GetSelectedColor: TColor;
begin
  Result := fSelectedColor;
end;

procedure TCustomGrid.HeadersMouseMove(const aX, aY: Integer);
var
  gz: TGridZone;
begin
  gz := MouseToGridZone(aX, aY);

  fGCache.HotGridZone := gz;
end;

function TCustomGrid.IsColumnsStored: Boolean;
begin
  Result := Columns.Enabled;
end;

procedure TCustomGrid.ResetHotCell;
begin
  with FGCache do begin
    HotGridZone := gzInvalid;
  end;
end;

procedure TCustomGrid.SetBorderColor(aValue: TColor);
begin
  if fBorderColor = aValue then
    Exit;
  fBorderColor := aValue;
  if BorderStyle <> bsNone then
    Changed;
end;

procedure TCustomGrid.SetBorderStyle(aValue: TBorderStyle);
begin
  if fGridBorderStyle = aValue then
    Exit;

  fGridBorderStyle := aValue;
  UpdateBorderStyle;
end;

procedure TCustomGrid.SetCol(aValue: Integer);
begin
  if fCol = aValue then
    Exit;
  MoveExtend(False, aValue, fRow, True);
  Click;
  Changed;
end;

procedure TCustomGrid.SetColCount(aValue: Integer);
begin
  if Columns.Enabled then
    raise EGridException.Create('Use Columns property to add/remove columns');
  InternalSetColCount(AValue);
  Changed;
end;

procedure TCustomGrid.SetColumns(aValue: TGridColumns);
begin
  fColumns.Assign(aValue);
end;

procedure TCustomGrid.SetColWidths(aCol: Integer; aValue: Integer);
begin
  if not IsColumnIndexValid(aCol) then
    Exit;

  if aValue < 0 then
    aValue := -1;

  if fCols[aCol] = aValue then
    Exit;

  fCols[aCol] := aValue;
  Changed;
end;

procedure TCustomGrid.SetDefColWidth(aValue: Integer);
begin
  if fDefColWidth = aValue then
    Exit;

  fDefColWidth := aValue;
  Changed;
end;

procedure TCustomGrid.SetDefRowHeight(aValue: Integer);
begin
  if fDefRowHeight = aValue then
    Exit;

  fDefRowHeight := aValue;
  Changed;
end;

procedure TCustomGrid.SetEditorMode(aValue: Boolean);
begin
  if aValue then
  begin
    /// StartEdit sets EditorMode only when the cell is really editable.
    if not fEditing then
      StartEdit('');
  end
  else if fEditing then
    EndEdit(True)
  else
    fEditorMode := False;
end;

procedure TCustomGrid.SetFixedColor(aValue: TColor);
begin
  if fFixedColor = aValue then
    Exit;
  fFixedColor := aValue;
  Invalidate;
end;

procedure TCustomGrid.SetFixedCols(aValue: Integer);
begin
  if fFixedCols = aValue then
    Exit;

  CheckFixed(ColCount, RowCount, aValue, FixedRows);

  if EditorMode then
    EditorMode := False;

  fFixedCols := aValue;
  fTopLeft.x := aValue;

  if Columns.Enabled then begin
    if not (csLoading in ComponentState) then
      DoTopLeftChanged;

    ColumnsChanged(Nil);
  end else begin
    if not (csLoading in ComponentState) then
      DoTopLeftChanged;
  end;

  UpdateCachedSizes;
end;

procedure TCustomGrid.SetFixedGridLineColor(AValue: TColor);
begin
  if FFixedGridLineColor=AValue then Exit;
  FFixedGridLineColor:=AValue;
end;

procedure TCustomGrid.SetFixedRows(aValue: Integer);
begin
  if fFixedRows = aValue then
    Exit;

  CheckFixed(ColCount, RowCount, FixedCols, aValue);

  if EditorMode then
    EditorMode := False;

  fFixedRows := aValue;
  fTopLeft.y := aValue;

  if not (csLoading in ComponentState) then
    DoTopLeftChanged;

  UpdateCachedSizes;
end;

procedure TCustomGrid.SetFlat(aValue: Boolean);
begin
  if fFlat = aValue then
    Exit;

  fFlat := aValue;
end;

procedure TCustomGrid.SetGridLineColor(aValue: TColor);
begin
  if fGridLineColor = aValue then
    Exit;
  fGridLineColor := aValue;
  Invalidate;
end;

procedure TCustomGrid.SetGridLineStyle(aValue: TPenStyle);
begin
  if fGridLineStyle = aValue then
    Exit;
  fGridLineStyle:=AValue;
  Invalidate;
end;

procedure TCustomGrid.SetGridLineWidth(aValue: Integer);
begin
  if fGridLineWidth = aValue then
    Exit;
  fGridLineWidth := aValue;
  Invalidate;
end;

procedure TCustomGrid.SetOptions(aValue: TGridOptions);
begin
  if fOptions = aValue then
    Exit;
  fOptions := aValue;
  Changed;
end;

procedure TCustomGrid.SetRow(aValue: Integer);
begin
  if fRow = aValue then
    Exit;
  MoveExtend(False, fCol, aValue, True);
  Changed;
  Click;
end;

procedure TCustomGrid.SetRowCount(aValue: Integer);
var
  old: Integer;
begin
  old := fRows.Count;
  if aValue = old then
    Exit;

  if aValue >= 0 then begin
    if EditorMode and (aValue < old) then
      EditorMode := False;

    CheckFixed(ColCount, aValue, fFixedCols, fFixedRows);
    CheckCount(ColCount, aValue);
    AdjustGrid(False, old, aValue);
  end else
    ClearRows;

  Changed;
end;

procedure TCustomGrid.SetRowHeights(aRow: Integer; aValue: Integer);
begin
  if not IsRowIndexValid(aRow) then
    Exit;

  if aValue < 0 then
    aValue := -1;

  if fRows[aRow] = aValue then
    Exit;

  fRows[aRow] := aValue;
  Changed;
end;

procedure TCustomGrid.SetScrollBars(aValue: TScrollStyle);
begin
  if fScrollBars = aValue then
    Exit;
  fScrollBars := aValue;
  Changed;
end;

procedure TCustomGrid.SetSelectedColor(aValue: TColor);
begin
  if fSelectedColor = aValue then
    Exit;
  fSelectedColor := aValue;
  Changed;
end;

procedure TCustomGrid.UpdateCachedSizes;
var
  i: Integer;
begin
  fGCache.GridWidth := 0;
  fGCache.GridHeight := 0;
  fGCache.FixedWidth := 0;
  fGCache.FixedHeight := 0;

  for i := 0 to ColCount - 1 do begin
    fGCache.AccumWidth[i] := fGCache.GridWidth;
    fGCache.GridWidth := fGCache.GridWidth + GetColWidths(i);
    if i < FixedCols then
      fGCache.FixedWidth := fGCache.GridWidth;
  end;

  for i := 0 to RowCount - 1 do begin
    fGCache.AccumHeight[i] := fGCache.GridHeight;
    fGCache.GridHeight := fGCache.GridHeight + GetRowHeights(i);
    if i < FixedRows then
      fGCache.FixedHeight := fGCache.GridHeight;
  end;

{$ifdef DEBUG_GRID}
  Writeln('Cached Grid Information: ');
  Writeln('GridWidth: ', fGCache.GridWidth);
  Writeln('GridHeight: ', fGCache.GridHeight);
  Writeln('FixedWidth: ', fGCache.FixedWidth);
  Writeln('FixedHeight: ', fGCache.FixedHeight);
  Writeln('AccumWidth: ', fGCache.AccumWidth.Count);
  for i := 0 to ColCount - 1 do
    Writeln('   ', i, ': ', fGCache.AccumWidth[i]);
  Writeln('AccumHeight: ', fGCache.AccumHeight.Count);
  for i := 0 to RowCount - 1 do
    Writeln('   ', i, ': ', fGCache.AccumHeight[i]);
{$endif}
end;

procedure TCustomGrid.AfterMoveSelection(const aPrevCol, aPrevRow: Integer);
begin
  if Assigned(fOnAfterSelection) then
    fOnAfterSelection(Self, aPrevCol, aPrevRow);
end;

procedure TCustomGrid.BeforeMoveSelection(const aCol, aRow: Integer);
begin
  if Assigned(fOnBeforeSelection) then
    fOnBeforeSelection(Self, aCol, aRow);
end;

function TCustomGrid.CellFromEvent(AEvent: TJSMouseEvent): TGridCoord;
var
  VElement: TJSElement;
  VRow: TJSHTMLTableRowElement;
begin
  /// Uses the DOM position of the clicked cell: the cached row/column sizes
  /// can differ from the rendered ones (borders, line-height, zoom).
  Result := Point(-1, -1);
  VElement := AEvent.targetElement;
  while Assigned(VElement) and (VElement.tagName <> 'TD') do
    VElement := VElement.parentElement;
  if not Assigned(VElement) then
    Exit;
  if not Assigned(VElement.parentElement) then
    Exit;
  if (VElement.parentElement.tagName <> 'TR') then
    Exit;
  VRow := TJSHTMLTableRowElement(VElement.parentElement);
  Result := Point(TJSHTMLTableCellElement(VElement).cellIndex, VRow.rowIndex);
end;

procedure TCustomGrid.CacheMouseDown(aX, aY: Integer);
begin
  fGCache.ClickMouse := Point(aX, aY);
  fGCache.ClickCell := MouseToCell(fGCache.ClickMouse);
  if fGCache.HotGridZone = gzInvalid then
    fGCache.HotGridZone := CellToGridZone(fGCache.ClickCell.X, fGCache.ClickCell.Y);
end;

procedure TCustomGrid.CellClick(const aCol, aRow: Integer;
  const aButton: TMouseButton);
begin
  { empty }
end;

procedure TCustomGrid.Changed;

  procedure AdjustRows(aTable: TJSHTMLTableElement; aCount: LongInt);
  begin
    if aTable.rows.length <> aCount then begin
      while aTable.rows.length > aCount do
        aTable.deleteRow(aTable.rows.length - 1);

      while aTable.rows.length < aCount do
        aTable.insertRow(aTable.rows.length);
    end;
  end;

  procedure AdjustCells(aRow: TJSHTMLTableRowElement; aCount: LongInt);
  var
    cell: TJSHTMLTableCellElement;
  begin
    if aRow.cells.length <> aCount then begin
      while aRow.cells.length > aCount do
        aRow.deleteCell(aRow.cells.length - 1);

      while aRow.cells.length < aCount do begin
        cell := aRow.insertCell(aRow.cells.length);
        cell.appendChild(document.createElement('div'));
      end;
    end;
  end;

  procedure UpdateCell(aCell: TJSHTMLTableDataCellElement; aCol, aRow: LongInt; aColumn: TGridColumn; aIsLastCol, aIsLastRow: Boolean);
  var
    content: TJSHTMLElement;
    w, h: LongInt;
    style: TJSCSSStyleDeclaration;
    bs: String;
    alignment: TAlignment;
    layout: TTextLayout;
  begin
    content := TJSHTMLElement(aCell.getElementsByTagName('div')[0]);

    /// While a cell is being edited its div hosts the <input>: keep it.
    if (not fEditing) or (aCol <> fCol) or (aRow <> fRow) then
    begin
      if Assigned(aColumn) and (aRow = 0) then
        content.textContent := aColumn.Title.Caption
      else
        content.textContent := GetCells(aCol, aRow);
    end;

    /// The inline editor is positioned inside this div.
    content.style.setProperty('position', 'relative');

    alignment := taLeftJustify;
    layout := tlCenter;
    if Assigned(aColumn) then begin
      if aRow = 0 then begin
        alignment := aColumn.Title.Alignment;
        layout := aColumn.Title.Layout;
      end else begin
        alignment := aColumn.Alignment;
        layout := aColumn.Layout;
      end;
    end;

    w := fCols[aCol];
    if w < 0 then
      w := DefaultColWidth;
    { respect border width }
    if w > 0 then
      Dec(w);
    if (w > 0) and (aCol = 0) then
      Dec(w);

    if w < 0 then
      content.style.removeProperty('width')
    else
      content.style.setProperty('width', IntToStr(w) + 'px');

    h := fRows[aRow];
    if h < 0 then
      h := DefaultRowHeight;
    { respect border width }
    if h > 0 then
      Dec(h);
    if (h > 0) and (aRow = 0) then
      Dec(h);

    if h < 0 then begin
      content.style.removeProperty('height');
      content.style.removeProperty('line-height');
    end else begin
      content.style.setProperty('height', IntToStr(h) + 'px');
      content.style.setProperty('line-height', IntToStr(h) + 'px');
    end;

    style := aCell.style;

    style.SetProperty('white-space', 'nowrap');
    style.SetProperty('overflow', 'hidden');

    if (fSelectedColor <> clNone) and GetIsCellSelected(aCol, aRow) and
       (aCol >= fFixedCols) and (aRow >= fFixedRows) then
      content.style.setProperty('background-color', JSColor(fSelectedColor))
    else
      content.style.removeProperty('background-color');

    content.style.setProperty('text-align', AlignmentToCSSAlignment(alignment));
    { does not yet work :/ }
    content.style.setProperty('vertical-align', TextLayoutToCSSVerticalAlign(layout));

    bs := PenStyleToCSSBorderStyle(fGridLineStyle);
    style.SetProperty('border-left-style', bs);
    style.SetProperty('border-top-style', bs);
    if aIsLastCol then
      style.SetProperty('border-right-style', bs)
    else
      style.RemoveProperty('border-right-style');
    if aIsLastRow then
      style.SetProperty('border-bottom-style', bs)
    else
      style.RemoveProperty('border-bottom-style');
    style.SetProperty('border-width', IntToStr(fGridLineWidth) + 'px');

    style.SetProperty('border-color', JSColor(fGridLineColor));
  end;

  procedure UpdateFixedCell(aCell: TJSHTMLTableDataCellElement; aCol, aRow: LongInt; aColumn: TGridColumn; aIsLastCol, aIsLastRow: Boolean);
  var
    c: TColor;
  begin
    UpdateCell(aCell, aCol, aRow, aColumn, aIsLastCol, aIsLastRow);

    c := FixedColor;
    if c <> clNone then
      aCell.style.SetProperty('background-color', JSColor(c))
    else
      aCell.style.removeProperty('background-color');

    aCell.style.SetProperty('border-color', JSColor(fFixedGridLineColor));

    if (aCol = 0) then
      aCell.style.setProperty('border-left-color', JSColor(fGridLineColor));
    if (aRow = 0) then
      aCell.style.setProperty('border-top-color', JSColor(fGridLineColor));
  end;

  procedure AppendOrRemoveNode(aContainer, aNode: TJSHTMLElement; aAdd: Boolean);
  begin
    if aAdd then begin
      if not aContainer.contains(aNode) then
        aContainer.appendChild(aNode);
    end else begin
      if aContainer.contains(aNode) then
        aContainer.removeChild(aNode);
    end;
  end;

var
  row, rowtop, rowleft, rowtopleft: TJSHTMLTableRowElement;
  i, j: LongInt;
  cell, contentcell: TJSHTMLTableDataCellElement;
  container: TJSHTMLElement;
  usecolumns: Boolean;
  column: TGridColumn;
begin
  inherited Changed;

  container := TJSHTMLElement(HandleElement);

  ApplyScrollStyleToStyle(container.style, ScrollBars);

  if BorderStyle = bsSingle then begin
    container.style.setProperty('border-color', JSColor(BorderColor));
    container.style.setProperty('border-style', 'solid');
    container.style.setProperty('border-width', '1px');
  end;

  { ensure that a new stacking context for the z-index is opened }
  container.style.SetProperty('opacity', '0.99');

  if not Assigned(fContentTable) then begin
    fContentTable := TJSHTMLTableElement(document.createElement('table'));
    fContentTable.style.setProperty('position', 'relative');
    fContentTable.style.setProperty('z-index', '1');
    fContentTable.cellSpacing := '0px';
    fContentTable.cellPadding := '0px';

    { always add the content table }
    container.appendChild(fContentTable);
  end;

  if not Assigned(fFixedColsTable) then begin
    fFixedColsTable := TJSHTMLTableElement(document.createElement('table'));
    fFixedColsTable.style.setProperty('position', 'absolute');
    fFixedColsTable.style.setProperty('z-index', '2');
    fFixedColsTable.style.setProperty('left', '0px');
    fFixedColsTable.style.setProperty('top', '0px');
    fFixedColsTable.cellSpacing := '0px';
    fFixedColsTable.cellPadding := '0px';
  end;

  if not Assigned(fFixedRowsTable) then begin
    fFixedRowsTable := TJSHTMLTableElement(document.createElement('table'));
    fFixedRowsTable.style.setProperty('position', 'absolute');
    fFixedRowsTable.style.setProperty('z-index', '3');
    fFixedRowsTable.style.setProperty('left', '0px');
    fFixedRowsTable.style.setProperty('top', '0px');
    fFixedRowsTable.cellSpacing := '0px';
    fFixedRowsTable.cellPadding := '0px';
  end;

  if not Assigned(fFixedTopLeftTable) then begin
    fFixedTopLeftTable := TJSHTMLTableElement(document.createElement('table'));
    fFixedTopLeftTable.style.setProperty('position', 'absolute');
    fFixedTopLeftTable.style.setProperty('z-index', '4');
    fFixedTopLeftTable.style.setProperty('left', '0px');
    fFixedTopLeftTable.style.setProperty('top', '0px');
    fFixedTopLeftTable.cellSpacing := '0px';
    fFixedTopLeftTable.cellPadding := '0px';
  end;

  AppendOrRemoveNode(container, fFixedRowsTable, FixedRows > 0);
  AppendOrRemoveNode(container, fFixedColsTable, FixedCols > 0);
  AppendOrRemoveNode(container, fFixedTopLeftTable, (FixedRows > 0) and (FixedCols > 0));

  AdjustRows(fContentTable, fRows.Count);
  AdjustRows(fFixedColsTable, fRows.Count);
  AdjustRows(fFixedRowsTable, FixedRows);
  AdjustRows(fFixedTopLeftTable, FixedRows);

  usecolumns := columns.Enabled;

  for i := 0 to fContentTable.rows.length - 1 do begin
    row := TJSHTMLTableRowElement(fContentTable.rows[i]);

    AdjustCells(row, fCols.Count);

    if i < FixedRows then begin
      rowtop := TJSHTMLTableRowElement(fFixedRowsTable.rows[i]);
      AdjustCells(rowtop, fCols.Count);
    end else
      rowtop := Nil;

    if FixedCols > 0 then begin
      rowleft := TJSHTMLTableRowElement(fFixedColsTable.rows[i]);
      AdjustCells(rowleft, FixedCols);
    end else
      rowleft := Nil;

    if (i < FixedRows) and (FixedCols > 0) then begin
      rowtopleft := TJSHTMLTableRowElement(fFixedTopLeftTable.rows[i]);
      AdjustCells(rowtopleft, FixedCols);
    end else
      rowtopleft := Nil;

    for j := 0 to row.cells.length - 1 do begin
      contentcell := TJSHTMLTableDataCellElement(row.cells[j]);
      cell := contentcell;

      column := Nil;
      if usecolumns and IsColumnIndexVariable(j) then
        column := ColumnFromGridColumn(j);

      UpdateCell(cell, j, i, column, j = ColCount - 1, i = RowCount - 1);

      if j < FixedCols then begin
        cell := TJSHTMLTableDataCellElement(rowleft.cells[j]);
        UpdateFixedCell(cell, j, i, column, j = FixedCols - 1, (i = FixedRows - 1) and (RowCount = 1))
      end;

      if i < FixedRows then begin
        cell := TJSHTMLTableDataCellElement(rowtop.cells[j]);
        UpdateFixedCell(cell, j, i, column, (j = FixedCols - 1) and (ColCount = 1), i = FixedRows - 1);
      end;

      if (j < FixedCols) and (i < FixedRows) then begin
        cell := TJSHTMLTableDataCellElement(rowtopleft.cells[j]);
        UpdateFixedCell(cell, j, i, column, (j = FixedCols - 1) and (ColCount = 1), (i = FixedRows - 1) and (RowCount = 1));
      end;

      /// Fire OnDrawCell once, on the element that is actually visible.
      /// The edited cell keeps its <input>, so it is not redrawn.
      if Assigned(fOnDrawCell) and not (fEditing and (j = fCol) and (i = fRow)) then
      begin
        if (i < FixedRows) and (j < FixedCols) and Assigned(rowtopleft) then
          DoDrawCell(j, i, TJSHTMLTableDataCellElement(rowtopleft.cells[j]))
        else if (i < FixedRows) and Assigned(rowtop) then
          DoDrawCell(j, i, TJSHTMLTableDataCellElement(rowtop.cells[j]))
        else if (j < FixedCols) and Assigned(rowleft) then
          DoDrawCell(j, i, TJSHTMLTableDataCellElement(rowleft.cells[j]))
        else
          DoDrawCell(j, i, contentcell);
      end;
    end;
  end;
end;

procedure TCustomGrid.CheckLimits(var aCol, aRow: Integer);
begin
  if aCol < fFixedCols then
    aCol := fFixedCols
  else if aCol > ColCount - 1 then
    aCol := ColCount - 1;

  if aRow < fFixedRows then
    aRow := fFixedRows
  else if aRow > RowCount - 1 then
    aRow := RowCount - 1;
end;

function TCustomGrid.ColumnFromGridColumn(aColumn: Integer): TGridColumn;
var
  idx: Integer;
begin
  idx := ColumnIndexFromGridColumn(aColumn);
  if idx >= 0 then
    Result := Columns[idx]
  else
    Result := Nil;
end;

function TCustomGrid.ColumnIndexFromGridColumn(aColumn: Integer): Integer;
begin
  if Columns.Enabled and (aColumn >= FirstGridColumn) then
    Result := Columns.RealIndex(aColumn - FirstGridColumn)
  else
    Result := -1;
end;

procedure TCustomGrid.ColumnsChanged(aColumn: TGridColumn);
begin
  if csDestroying in ComponentState then
    Exit;

  if not Assigned(aColumn) then begin
    if FirstGridColumn + Columns.VisibleCount <> ColCount then
      InternalSetColCount(FirstGridColumn + Columns.VisibleCount)
    else
      Changed;
  end else begin
    if Columns.IndexOf(aColumn) >= 0 then
      Changed;
  end;
end;

function TCustomGrid.CreateColumns: TGridColumns;
begin
  Result := TGridColumns.Create(Self, TGridColumn);
end;

function TCustomGrid.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(document.createElement('div'));
end;

procedure TCustomGrid.DoScroll;
var
  container: TJSHTMLElement;
begin
  inherited DoScroll;

  container := HandleElement;

  if Assigned(fFixedColsTable) then
    fFixedColsTable.style.setProperty('left', IntToStr(container.scrollLeft) + 'px');

  if Assigned(fFixedColsTable) then
    fFixedRowsTable.style.setProperty('top', IntToStr(container.scrollTop) + 'px');

  if Assigned(fFixedTopLeftTable) then begin
    fFixedTopLeftTable.style.setProperty('top', IntToStr(container.scrollTop) + 'px');
    fFixedTopLeftTable.style.setProperty('left', IntToStr(container.scrollLeft) + 'px');
  end;
end;

function TCustomGrid.FirstGridColumn: Integer;
begin
  Result := FixedCols;
end;

function TCustomGrid.FixedGrid: Boolean;
begin
  Result := (FixedCols = ColCount) or (FixedRows = RowCount);
end;

function TCustomGrid.GetCells(aCol, aRow: Integer): String;
begin
  Result := '';
end;

function TCustomGrid.GetDefaultRowHeight: Integer;
begin
  Result := Font.TextHeight('Xy') + 7;
end;

function TCustomGrid.GetIsCellSelected(aCol, aRow: Integer): Boolean;
begin
  Result := (fRange.Left <= aCol) and (aCol <= fRange.Right) and
            (fRange.Top <= aRow) and (aRow <= fRange.Bottom);
end;

function TCustomGrid.GridColumnFromColumnIndex(aColumnIndex: Integer): Integer;
begin
  Result := aColumnIndex + FirstGridColumn;
  if Result > ColCount - 1 then
    Result := -1;
end;

procedure TCustomGrid.InternalSetColCount(aCount: Integer);
var
  old: Integer;
begin
  old := fCols.Count;

  if old = aCount then
    Exit;

  if aCount < 1 then
    Clear
  else begin
    if EditorMode and (aCount < old) then
      EditorMode := False;

    CheckFixed(aCount, RowCount, FixedCols, FixedRows);
    CheckCount(aCount, RowCount);
    AdjustGrid(True, old, aCount);
  end;
end;

procedure TCustomGrid.InvalidateCell(aCol, aRow: Integer; aRedraw: Boolean);
begin
  if aRedraw then
    Changed;
end;

function TCustomGrid.IsColumnIndexValid(aIndex: Integer): Boolean;
begin
  Result := (aIndex >= 0) and (aIndex < ColCount);
end;

function TCustomGrid.IsColumnIndexVariable(aIndex: Integer): Boolean;
begin
  Result := (aIndex >= fFixedCols) and (aIndex < ColCount);
end;

function TCustomGrid.IsRowIndexValid(aIndex: Integer): Boolean;
begin
  Result := (aIndex >= 0) and (aIndex < RowCount);
end;

function TCustomGrid.IsRowIndexVariable(aIndex: Integer): Boolean;
begin
  Result := (aIndex >= fFixedRows) and (aIndex < RowCount);
end;

procedure TCustomGrid.MouseDown(aButton: TMouseButton; aShift: TShiftState; aX,
  aY: integer);
begin
  inherited MouseDown(aButton, aShift, aX, aY);

  if csDesigning in ComponentState then
    Exit;

  if not Focused then begin
    SetFocus;
    if not Focused then
      Exit;
  end;

  CacheMouseDown(aX, aY);

  /// Prefer the DOM cell under the pointer over the cached-size maths.
  if fMouseCellValid then
  begin
    fGCache.ClickCell := fMouseCell;
    fGCache.HotGridZone := CellToGridZone(fMouseCell.X, fMouseCell.Y);
  end;

  case fGCache.HotGridZone of
    gzNormal: begin
      if not FixedGrid then begin
        fGridState := gsSelecting;

        if not MoveExtend(False, fGCache.ClickCell.x, fGCache.ClickCell.y, False) then begin
          MoveSelection;
        end else
          fGridState := gsSelecting;

        Changed;
      end;
    end;
    { ToDo }
    gzFixedCols: ;
    gzFixedRows: ;
    gzFixedCells: ;
  end;
end;

procedure TCustomGrid.MouseMove(aShift: TShiftState; aX, aY: integer);
var
  cell: TGridCoord;
begin
  inherited MouseMove(aShift, aX, aY);

  HeadersMouseMove(aX, aY);
end;

procedure TCustomGrid.MouseUp(aButton: TMouseButton; aShift: TShiftState; aX,
  aY: integer);
var
  cur: TGridCoord;
  gz: TGridZone;

  function IsValidCellClick: Boolean;
  begin
    Result := (Cur.X = fGCache.ClickCell.X) and (Cur.Y = fGCache.ClickCell.Y) and (gz <> gzInvalid);
  end;

begin
  inherited MouseUp(aButton, aShift, aX, aY);

  if fMouseCellValid then
    cur := fMouseCell
  else
    cur := MouseToCell(Point(aX, aY));
  gz := CellToGridZone(cur.x, cur.y);

  case fGridState of
    gsNormal: begin
      if not FixedGrid and IsValidCellClick then begin
        CellClick(cur.x, cur.y, aButton);
      end;
    end;
    gsSelecting: begin
      CellClick(cur.x, cur.y, aButton);
    end;
    { ToDo }
    gsRowSizing: ;
    gsColSizing: ;
    gsRowMoving: ;
    gsColMoving: ;
    gsHeaderClicking: ;
    gsButtonColumnClicking: ;
  end;
end;

function TCustomGrid.MoveExtend(aRelative: Boolean; aCol, aRow: Integer;
  aForceFullyVisible: Boolean): Boolean;
var
  oldrange: TGridRect;
  prevrow, prevcol: Integer;
begin
  /// Moving the selection always closes the inline editor first.
  if fEditing then
    EndEdit(True);

  Result := TryMoveSelection(aRelative, aCol, aRow);
  if not Result then
    Exit;

  BeforeMoveSelection(aCol, aRow);

  oldrange := fRange;
  prevrow := fRow;
  prevcol := fCol;

  if goRowSelect in Options then
    fRange := Rect(fFixedCols, aRow, ColCount - 1, aRow)
  else
    fRange := Rect(aCol, aRow, aCol, aRow);

  {if not }ScrollToCell(aCol, aRow, aForceFullyVisible){ then
    InvalidateMovement(aCol, aRow, oldrange)};

  //Writeln('New selection: ', fCol, ' ', fRow);
  fCol := aCol;
  fRow := aRow;

  MoveSelection;

  AfterMoveSelection(prevcol, prevrow);
end;

function TCustomGrid.MoveNextSelectable(aRelative: Boolean; aDCol,
  aDRow: Integer): Boolean;
var
  cinc, rinc: Integer;
  ncol, nrow: Integer;
begin
  { Reference }
  if not aRelative then begin
    ncol := aDCol;
    nrow := aDRow;
    aDCol := ncol - fCol;
    aDRow := nrow - fRow;
  end else begin
    ncol := fCol + aDCol;
    nrow := fRow + aDRow;
  end;

  CheckLimits(ncol, nrow);

  { Increment }
  if aDCol < 0 then
    cinc := -1
  else if aDCol > 0 then
    cinc := 1
  else
    cinc := 0;
  if aDRow < 0 then
    rinc := -1
  else if aDRow > 0 then
    rinc := 1
  else
    rinc := 0;

  { Calculate }
  Result := False;
  while ((ColWidths[ncol] = 0) and (cinc <> 0))
     or ((RowHeights[nrow] = 0) and (rinc <> 0)) do
  begin
    if not (IsRowIndexVariable(nrow + rinc) and IsColumnIndexVariable(ncol + cinc)) then
      Exit;
    Inc(ncol, cinc);
    Inc(nrow, rinc);
  end;
  Result := MoveExtend(False, ncol, nrow, True);
end;

procedure TCustomGrid.MoveSelection;
begin
  if Assigned(fOnSelection) then
    fOnSelection(Self, fCol, fRow);
end;

function TCustomGrid.OffsetToColRow(aIsCol, aFisical: Boolean;
  aOffset: Integer; out aIndex, aRest: Integer): Boolean;
begin
  aIndex := 0;
  aRest := 0;
  Result := False;
  //aOffset := aOffset - GetBorderWidth;
  if aOffset < 0 then
    Exit;

  if aIsCol then begin
    if aFisical and (aOffset > fGCache.FixedWidth - 1) then begin
      aIndex := fTopLeft.X;
      if IsColumnIndexValid(aIndex) then begin
        aOffset := aOffset - fGCache.FixedWidth + fGCache.AccumWidth[aIndex];
      end;
      if not IsColumnIndexValid(aIndex) or (aOffset > fGCache.GridWidth - 1) then begin
        if AllowOutboundEvents then
          aIndex := ColCount - 1
        else
          aIndex := -1;
        Exit;
      end;
    end;

    while aOffset > fGCache.AccumWidth[aIndex] + GetColWidths(aIndex) - 1 do begin
      Inc(aIndex);
      if not IsColumnIndexValid(aIndex) then begin
        if AllowOutBoundEvents then
          aIndex := ColCount - 1
        else
          aIndex := -1;
        Exit;
      end;
    end;

    aRest := aOffset;
    if aIndex <> 0 then
      aRest := aOffset - fGCache.AccumWidth[aIndex];
  end else begin
    if aFisical and (aOffset > fGCache.FixedHeight - 1) then begin
      aIndex := fTopLeft.Y;
      if IsRowIndexValid(aIndex) then begin
        aOffset := aOffset - fGCache.FixedHeight + fGCache.AccumHeight[aIndex];
      end;
      if not IsRowIndexValid(aIndex) or (aOffset > fGCache.GridHeight - 1) then begin
        if AllowOutboundEvents then
          aIndex := RowCount - 1
        else
          aIndex := -1;
        Exit;
      end;
    end;

    while aOffset > fGCache.AccumHeight[aIndex] + GetRowHeights(aIndex) - 1 do begin
      Inc(aIndex);
      if not IsRowIndexValid(aIndex) then begin
        if AllowOutBoundEvents then
          aIndex := RowCount - 1
        else
          aIndex := -1;
        Exit;
      end;
    end;

    aRest := aOffset;
    if aIndex <> 0 then
      aRest := aOffset - fGCache.AccumHeight[aIndex];
  end;

  Result := True;
end;

function TCustomGrid.SelectCell(aCol, aRow: Integer): Boolean;
var
  VCanSelect: Boolean;
begin
  Result := (ColWidths[aCol] > 0) and (RowHeights[aRow] > 0);
  if (not Result) or (not Assigned(fOnSelectCell)) then
    Exit;
  VCanSelect := True;
  fOnSelectCell(Self, aCol, aRow, VCanSelect);
  Result := VCanSelect;
end;

function TCustomGrid.GetDrawState(aCol, aRow: Integer): TGridDrawState;
begin
  Result := [];
  if (aCol < fFixedCols) or (aRow < fFixedRows) then
    Include(Result, gdFixed);
  if GetIsCellSelected(aCol, aRow) then
    Include(Result, gdSelected);
  if (aCol = fCol) and (aRow = fRow) then
    Include(Result, gdFocused);
end;

function TCustomGrid.GetEditing: Boolean;
begin
  Result := fEditing;
end;

procedure TCustomGrid.DoDrawCell(aCol, aRow: Integer;
  aCell: TJSHTMLTableDataCellElement);
begin
  if Assigned(fOnDrawCell) then
    fOnDrawCell(Self, aCol, aRow, GetDrawState(aCol, aRow), aCell);
end;

function TCustomGrid.IsCellEditable(aCol, aRow: Integer): Boolean;
begin
  Result := (goEditing in fOptions) and
    (aCol >= fFixedCols) and (aCol < ColCount) and
    (aRow >= fFixedRows) and (aRow < RowCount);
end;

procedure TCustomGrid.SetCellText(aCol, aRow: Integer; const aValue: string);
begin
  /// Descendants store the value (TCustomStringGrid writes into Cells).
end;

procedure TCustomGrid.StartEdit(const AInitialText: string);
var
  VRow: TJSHTMLTableRowElement;
  VCell: TJSHTMLTableDataCellElement;
  VContent: TJSHTMLElement;
  VValue: string;
begin
  if fEditing then
    Exit;
  if not IsCellEditable(fCol, fRow) then
    Exit;
  if not Assigned(fContentTable) then
    Exit;
  if (fRow < 0) or (fRow >= fContentTable.rows.length) then
    Exit;

  VRow := TJSHTMLTableRowElement(fContentTable.rows[fRow]);
  if (fCol < 0) or (fCol >= VRow.cells.length) then
    Exit;

  VCell := TJSHTMLTableDataCellElement(VRow.cells[fCol]);
  VContent := TJSHTMLElement(VCell.getElementsByTagName('div')[0]);
  if not Assigned(VContent) then
    Exit;

  if not Assigned(fEditor) then
  begin
    fEditor := TJSHTMLInputElement(Document.CreateElement('input'));
    fEditor._type := 'text';
    fEditor.style.SetProperty('position', 'absolute');
    fEditor.style.SetProperty('left', '0px');
    fEditor.style.SetProperty('top', '0px');
    fEditor.style.SetProperty('width', '100%');
    fEditor.style.SetProperty('height', '100%');
    fEditor.style.SetProperty('box-sizing', 'border-box');
    fEditor.style.SetProperty('margin', '0px');
    fEditor.style.SetProperty('padding', '0px 2px');
    fEditor.style.SetProperty('border', 'none');
    fEditor.style.SetProperty('outline', 'none');
    fEditor.style.SetProperty('background-color', '#ffffff');
    fEditor.style.SetProperty('font', 'inherit');
    fEditor.style.SetProperty('z-index', '10');
    fEditor.addEventListener('keydown', @HandleEditorKeyDown);
    fEditor.addEventListener('keypress', @HandleEditorKeyPress);
    fEditor.addEventListener('keyup', @HandleEditorKeyUp);
    fEditor.addEventListener('blur', @HandleEditorBlur);
  end;

  VValue := GetCells(fCol, fRow);
  if Assigned(fOnGetEditText) then
    fOnGetEditText(Self, fCol, fRow, VValue);

  VContent.style.SetProperty('position', 'relative');
  VContent.appendChild(fEditor);
  fEditorCell := VContent;
  fEditing := True;
  fEditorMode := True;

  if (AInitialText <> '') then
  begin
    /// Typing a character starts the editor with that character.
    fEditor.value := AInitialText;
    fEditor.setSelectionRange(Length(AInitialText), Length(AInitialText));
  end
  else
  begin
    fEditor.value := VValue;
    fEditor.select();
  end;
  fEditor.focus();
end;

procedure TCustomGrid.EndEdit(aAccept: Boolean);
var
  VCol, VRow: Integer;
  VValue: string;
begin
  if not fEditing then
    Exit;

  VCol := fCol;
  VRow := fRow;
  VValue := '';
  if Assigned(fEditor) then
    VValue := fEditor.value;

  fEditing := False;
  fEditorMode := False;
  if Assigned(fEditor) and Assigned(fEditorCell) and fEditorCell.contains(fEditor) then
    fEditorCell.removeChild(fEditor);
  fEditorCell := nil;

  if aAccept then
  begin
    SetCellText(VCol, VRow, VValue);
    if Assigned(fOnSetEditText) then
      fOnSetEditText(Self, VCol, VRow, VValue);
  end;

  InvalidateCell(VCol, VRow);
  if Assigned(fOnEditingDone) then
    fOnEditingDone(Self);
end;

function TCustomGrid.HandleEditorKeyDown(AEvent: TJSKeyBoardEvent): boolean;
var
  VKey: string;
begin
  Result := True;
  AEvent.StopPropagation;
  VKey := '';
  asm
    if (AEvent.key != null) VKey = AEvent.key;
  end;

  if (VKey = 'Enter') then
  begin
    AEvent.PreventDefault;
    EndEdit(True);
    if MoveNextSelectable(True, 0, 1) then
      Changed;
    HandleElement.focus();
  end
  else if (VKey = 'Escape') then
  begin
    AEvent.PreventDefault;
    EndEdit(False);
    HandleElement.focus();
  end
  else if (VKey = 'Tab') then
  begin
    if (goTabs in Options) then
    begin
      AEvent.PreventDefault;
      EndEdit(True);
      if (ssShift in ExtractShiftState(AEvent)) then
      begin
        if MoveNextSelectable(True, -1, 0) then
          Changed;
      end
      else
      begin
        if MoveNextSelectable(True, 1, 0) then
          Changed;
      end;
      HandleElement.focus();
    end
    else
    begin
      EndEdit(True);
      Result := False;
    end;
  end;
end;

function TCustomGrid.HandleEditorKeyPress(AEvent: TJSKeyBoardEvent): boolean;
begin
  AEvent.StopPropagation;
  Result := True;
end;

function TCustomGrid.HandleEditorKeyUp(AEvent: TJSKeyBoardEvent): boolean;
begin
  AEvent.StopPropagation;
  Result := True;
end;

function TCustomGrid.HandleEditorBlur(AEvent: TJSEvent): boolean;
begin
  Result := True;
  if fEditing then
    EndEdit(True);
end;

function TCustomGrid.HandleMouseDown(AEvent: TJSMouseEvent): boolean;
var
  VTarget: TJSElement;
begin
  if fEditing and Assigned(fEditor) then
  begin
    VTarget := AEvent.targetElement;
    if (VTarget = fEditor) then
    begin
      /// Clicking inside the editor must not close it.
      AEvent.StopPropagation;
      Exit(True);
    end;
  end;
  fMouseCell := CellFromEvent(AEvent);
  fMouseCellValid := (fMouseCell.X >= 0) and (fMouseCell.Y >= 0);
  Result := inherited HandleMouseDown(AEvent);
end;

function TCustomGrid.HandleDblClick(AEvent: TJSMouseEvent): boolean;
var
  VCell: TGridCoord;
begin
  Result := inherited HandleDblClick(AEvent);

  if (csDesigning in ComponentState) or (not (goEditing in Options)) then
    Exit;

  VCell := CellFromEvent(AEvent);
  if IsCellEditable(VCell.X, VCell.Y) then
  begin
    MoveExtend(False, VCell.X, VCell.Y, False);
    StartEdit('');
  end;
end;

procedure TCustomGrid.KeyDown(var Key: NativeInt; Shift: TShiftState);
var
  VPage: Integer;
begin
  inherited KeyDown(Key, Shift);

  if fEditing then
    Exit;

  case Key of
    /// Left
    37:
      begin
        if MoveNextSelectable(True, -1, 0) then
          Changed;
        Key := 0;
      end;
    /// Right
    39:
      begin
        if MoveNextSelectable(True, 1, 0) then
          Changed;
        Key := 0;
      end;
    /// Up
    38:
      begin
        if MoveNextSelectable(True, 0, -1) then
          Changed;
        Key := 0;
      end;
    /// Down
    40:
      begin
        if MoveNextSelectable(True, 0, 1) then
          Changed;
        Key := 0;
      end;
    /// Home
    36:
      begin
        if MoveNextSelectable(False, fFixedCols, fRow) then
          Changed;
        Key := 0;
      end;
    /// End
    35:
      begin
        if MoveNextSelectable(False, ColCount - 1, fRow) then
          Changed;
        Key := 0;
      end;
    /// PageUp / PageDown
    33, 34:
      begin
        VPage := (Height - fGCache.FixedHeight) div DefaultRowHeight;
        if VPage < 1 then
          VPage := 1;
        if (Key = 33) then
        begin
          if MoveNextSelectable(False, fCol, fRow - VPage) then
            Changed;
        end
        else
        begin
          if MoveNextSelectable(False, fCol, fRow + VPage) then
            Changed;
        end;
        Key := 0;
      end;
    /// Enter
    13:
      begin
        if (goEditing in Options) and IsCellEditable(fCol, fRow) then
          StartEdit('')
        else if MoveNextSelectable(True, 0, 1) then
          Changed;
        Key := 0;
      end;
    /// F2
    113:
      begin
        if (goEditing in Options) then
        begin
          StartEdit('');
          Key := 0;
        end;
      end;
    /// Delete
    46:
      begin
        if IsCellEditable(fCol, fRow) then
        begin
          SetCellText(fCol, fRow, '');
          InvalidateCell(fCol, fRow);
          Key := 0;
        end;
      end;
    /// Tab / Shift+Tab
    9:
      begin
        if (goTabs in Options) then
        begin
          if (ssShift in Shift) then
          begin
            if MoveNextSelectable(True, -1, 0) then
              Changed;
          end
          else
          begin
            if MoveNextSelectable(True, 1, 0) then
              Changed;
          end;
          Key := 0;
        end;
      end;
  end;
end;

procedure TCustomGrid.KeyPress(var Key: char);
begin
  if fEditing then
    Exit;

  if (goEditing in Options) and IsCellEditable(fCol, fRow) and (Key >= ' ') then
  begin
    StartEdit(Key);
    Key := #0;
    Exit;
  end;

  inherited KeyPress(Key);
end;

function TCustomGrid.ScrollToCell(const aCol, aRow: Integer;
  const aForceFullyVisible: Boolean): Boolean;
var
  VRow: TJSHTMLTableRowElement;
  VCell, VContainer: TJSHTMLElement;
  VTop, VLeft: Integer;
begin
  Result := False;
  if not Assigned(fContentTable) then
    Exit;
  if (aRow < 0) or (aRow >= fContentTable.rows.length) then
    Exit;

  VRow := TJSHTMLTableRowElement(fContentTable.rows[aRow]);
  if (aCol < 0) or (aCol >= VRow.cells.length) then
    Exit;

  VContainer := HandleElement;
  /// Nothing to scroll while the grid is hidden (inactive tab).
  if (VContainer.clientWidth <= 0) or (VContainer.clientHeight <= 0) then
    Exit;

  VCell := TJSHTMLElement(VRow.cells[aCol]);
  VTop := Trunc(VCell.offsetTop);
  VLeft := Trunc(VCell.offsetLeft);

  /// Keep the cell below/right of the fixed overlays and inside the viewport.
  if VTop < VContainer.scrollTop + fGCache.FixedHeight then
    VContainer.scrollTop := VTop - fGCache.FixedHeight
  else if VTop + Trunc(VCell.offsetHeight) > VContainer.scrollTop + VContainer.clientHeight then
    VContainer.scrollTop := VTop + Trunc(VCell.offsetHeight) - VContainer.clientHeight;

  if VLeft < VContainer.scrollLeft + fGCache.FixedWidth then
    VContainer.scrollLeft := VLeft - fGCache.FixedWidth
  else if VLeft + Trunc(VCell.offsetWidth) > VContainer.scrollLeft + VContainer.clientWidth then
    VContainer.scrollLeft := VLeft + Trunc(VCell.offsetWidth) - VContainer.clientWidth;

  Result := True;
end;

procedure TCustomGrid.SizeChanged(aOldColCount, aOldRowCount: Integer);
begin
  { empty }
end;

function TCustomGrid.TryMoveSelection(aRelative: Boolean; var aCol,
  aRow: Integer): Boolean;
begin
  Result := False;

  if FixedGrid then
    Exit;

  if aRelative then begin
    Inc(aCol, fCol);
    Inc(aRow, fRow);
  end;

  CheckLimits(aCol, aRow);

  // Change on Focused cell?
  if (aCol = fCol) and (aRow = fRow) then
    SelectCell(aCol, aRow)
  else
    Result := SelectCell(aCol, aRow);
end;

procedure TCustomGrid.TopLeftChanged;
begin
  if Assigned(OnTopLeftChanged) and not (csDesigning in ComponentState) then
    OnTopLeftChanged(Self);
end;

procedure TCustomGrid.UpdateBorderStyle;
var
  bs: TBorderStyle;
begin
  if not Flat and (fGridBorderStyle = bsSingle) then
    bs := bsSingle
  else
    bs := bsNone;

  inherited SetBorderStyle(bs);

  if [csDestroying, csLoading] * ComponentState = [] then begin
    VisualChange;
  end;
end;

procedure TCustomGrid.VisualChange;
begin
  if fUpdateCount <> 0 then
    Exit;

  Invalidate;
end;

constructor TCustomGrid.Create(aOwner: TComponent);
begin
  fGCache.AccumWidth := TIntegerList.Create;
  fGCache.AccumHeight := TIntegerList.Create;
  fGCache.ClickCell := point(-1, -1);
  inherited Create(aOwner);
  fTopLeft := Point(1, 1);
  fCols := TIntegerList.Create;
  fRows := TIntegerList.Create;
  fColumns := CreateColumns;

  fDefColWidth := -1;
  fDefRowHeight := -1;
  fAllowOutboundEvents := True;

  fEditing := False;
  fEditorMode := False;
  fEditor := nil;
  fEditorCell := nil;

  fScrollBars := ssAutoBoth;

  fGridLineColor := clSilver;
  fGridLineWidth := 1;
  fGridLineStyle := psSolid;
  fFixedColor := clBtnFace;
  fFixedGridLineColor := cl3DDkShadow;
  fBorderColor := cl3DDkShadow;

  fOptions := DefaultGridOptions;
  fGridState := gsNormal;

  fFlat := False;
  fGridBorderStyle := bsSingle;
  UpdateBorderStyle;

  fRange := Rect(-1, -1, -1, -1);
  fSelectedColor := clHighlight;

  ResetHotCell;

  ColCount := 5;
  RowCount := 5;
  FixedRows := 1;
  FixedCols := 1;
end;

destructor TCustomGrid.Destroy;
begin
  fColumns.Free;
  fCols.Free;
  fRows.Free;
  fGCache.AccumHeight.Free;
  fGCache.AccumWidth.Free;
  inherited Destroy;
end;

function TCustomGrid.CellToGridZone(aCol, aRow: Integer): TGridZone;
begin
  if (aCol < 0) or (aRow < 0) then
    Result := gzInvalid
  else if aCol < FFixedCols then
    if aRow < FFixedRows then
      Result := gzFixedCells
    else
      Result := gzFixedRows
  else if aRow < FFixedRows then
    if aCol < FFixedCols then
      Result := gzFixedCells
    else
      Result := gzFixedCols
  else
    Result := gzNormal;
end;

procedure TCustomGrid.Clear;
var
  rowschanged, colschanged: Boolean;
begin
  rowschanged := ClearRows;
  colschanged := ClearCols;
  if not (rowschanged or colschanged) then
    Exit;
  fRange := Rect(-1, -1, -1, -1);
  ResetHotCell;
  Changed;
end;

function TCustomGrid.ClearCols: Boolean;
begin
  Result := False;
  if fCols.Count = 0 then
    Exit;
  fFixedCols := 0;
  fCols.Clear;
  Result := True;
end;

function TCustomGrid.ClearRows: Boolean;
begin
  Result := False;
  if fRows.Count = 0 then
    Exit;
  fFixedRows := 0;
  fRows.Clear;
  Result := True;
end;

procedure TCustomGrid.InvalidateCell(aCol, aRow: Integer);
begin
  InvalidateCell(aCol, aRow, True);
end;

procedure TCustomGrid.MouseToCell(aX, aY: Integer; out aCol, aRow: Integer);
var
  dummy: Integer;
begin
  OffsetToColRow(True, True, aX + HandleElement.scrollLeft, aCol, dummy);
  if aCol < 0 then
    aRow := -1
  else begin
    OffsetToColRow(False, True, aY + HandleElement.scrollTop, aRow, dummy);
    if aRow < 0 then
      aCol := -1;
  end;
end;

function TCustomGrid.MouseToCell(const aMouse: TPoint): TGridCoord;
begin
  MouseToCell(aMouse.X, aMouse.Y, Result.X, Result.Y);
end;

function TCustomGrid.MouseToGridZone(aX, aY: Integer): TGridZone;
var
  bw, r, c: Integer;
begin
  bw := 0;
  if aX < fGCache.FixedWidth + bw then begin
    { in fixed width zone }
    if aY < fGCache.FixedHeight + bw then
      Result := gzFixedCells
    else begin
      OffsetToColRow(False, True, aY, r, c);
      if (r < 0) or (RowCount <= FixedRows) then
        Result := gzInvalid
      else
        Result := gzFixedRows;
    end;
  end else if aY < fGCache.FixedHeight + bw then begin
    { in fixed height zone }
    if aX < fGCache.FixedWidth + bw then
      Result := gzFixedCells
    else begin
      OffsetToColRow(True, True, aX, r, c);
      if (c < 0) or (ColCount <= FixedCols) then
        Result := gzInvalid
      else
        Result := gzFixedCols;
    end;
  end else if not FixedGrid then begin
    { in normal cell zone }
    MouseToCell(aX, aY, c, r);
    if (c < 0) or (r < 0) then
      Result := gzInvalid
    else
      Result := gzNormal;
  end else
    Result := gzInvalid;
end;

end.

