{
  MIT License

  Copyright (c) 2018 Hélio S. Ribeiro and Anderson J. Gado da Silva
  (Refactored for event delegation by Gemini, with compatibility fix)

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
unit DataGrid;

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
  DB,
  localjsondataset,
  webdb;

type

  /// Forward declaration
  TCustomDataGrid = class;

  TColumnFormat = (cfBoolean, cfDataTime, cfNumber, cfCurrency, cfString);

  { TDataColumn }
  TDataColumn = class(TCollectionItem)
  private
    FAlignment: TAlignment;
    FColor: TColor;
    FDisplayMask: string;
    FFont: TFont;
    FTitleFont: TFont;
    FFormat: TColumnFormat;
    FHint: string;
    FName: string;
    FTag: integer;
    FTitle: string;
    FUpdateCount: NativeInt;
    FValueChecked: string;
    FValueUnchecked: string;
    FVisible: boolean;
    FWidth: NativeInt;
    FResponsiveMinWidth: Integer;
    FResponsiveMaxWidth: Integer;
    function GetGrid: TCustomDataGrid;
    procedure SetAlignment(AValue: TAlignment);
    procedure SetColor(AValue: TColor);
    procedure SetDisplayMask(AValue: string);
    procedure SetFont(AValue: TFont);
    procedure SetTitleFont(AValue: TFont);
    procedure SetFormat(AValue: TColumnFormat);
    procedure SetName(AValue: string);
    procedure SetTitle(AValue: string);
    procedure SetValueChecked(AValue: string);
    procedure SetValueUnchecked(AValue: string);
    procedure SetVisible(AValue: boolean);
    procedure SetWidth(AValue: NativeInt);
    procedure SetResponsiveMinWidth(AValue: Integer);
    procedure SetResponsiveMaxWidth(AValue: Integer);
  protected
    procedure ColumnChanged; virtual;
    function GetDisplayName: string; override;
    procedure FillDefaultFont; virtual;
    procedure FontChanged(Sender: TObject); virtual;
    function GetDefaultValueChecked: string; virtual;
    function GetDefaultValueUnchecked: string; virtual;
  public
    constructor Create(ACollection: TCollection); override;
    destructor Destroy; override;
    procedure Assign(Source: TPersistent); override;
    procedure BeginUpdate; virtual;
    procedure EndUpdate; virtual;
    property Grid: TCustomDataGrid read GetGrid;
  published
    property Alignment: TAlignment read FAlignment write SetAlignment;
    property Color: TColor read FColor write SetColor;
    property DisplayMask: string read FDisplayMask write SetDisplayMask;
    property Font: TFont read FFont write SetFont;
    property TitleFont: TFont read FTitleFont write SetTitleFont;
    property Format: TColumnFormat read FFormat write SetFormat;
    property Hint: string read FHint write FHint;
    property Name: string read FName write SetName;
    property Tag: integer read FTag write FTag;
    property Title: string read FTitle write SetTitle;
    property ValueChecked: string read FValueChecked write SetValueChecked;
    property ValueUnchecked: string read FValueUnchecked write SetValueUnchecked;
    property Visible: boolean read FVisible write SetVisible;
    property Width: NativeInt read FWidth write SetWidth;
    property ResponsiveMinWidth: Integer read FResponsiveMinWidth write SetResponsiveMinWidth default 0;
    property ResponsiveMaxWidth: Integer read FResponsiveMaxWidth write SetResponsiveMaxWidth default 0;
  end;


  { TDataColumns }
  TDataColumns = class(TCollection)
  private
    FGrid: TCustomDataGrid;
    function GetColumn(AIndex: NativeInt): TDataColumn;
    procedure SetColumn(AIndex: NativeInt; AValue: TDataColumn);
  protected
    function GetOwner: TPersistent; override;
    procedure Update(AItem: TCollectionItem); override;
  public
    constructor Create(AGrid: TCustomDataGrid); reintroduce;
    function Add: TDataColumn; reintroduce;
    function HasIndex(const AIndex: integer): boolean;
    property Grid: TCustomDataGrid read FGrid;
    property Items[AIndex: NativeInt]: TDataColumn read GetColumn write SetColumn; default;
  end;

  TSortOrder = (soAscending, soDescending);

  TOnClickEvent = procedure(ASender: TObject; ACol, ARow: NativeInt) of object;
  TOnHeaderClick = procedure(ASender: TObject; ACol: NativeInt) of object;
  TOnDrawColumnCell = procedure(ASender: TObject; ColumnName: String; var Cell : TJSHTMLTableCellElement ) of object;
  TOnAddSeparator = procedure(ASender: TObject; var data : String ) of object;

  { TCustomDataGrid }

  TCustomDataGrid = class(TCustomControl)
  private
    FAutoCreateColumns: boolean;
    FColumnClickSorts: boolean;
    FColumns: TDataColumns;
    FData: TJSArray;
    FDataJSon : TLocalJSONDataset;
    FDataTable: TCustomWebDBTable;
    FTableDataLoaded: TNotifyEvent;
    procedure DoTableDataLoaded(Sender: TObject);
    FRowSelect : Boolean;
    fSelRow, fSelCol : NativeInt;
    fontouchstart: TJSTouchEventHandler;
    fontouchmove: TJSTouchEventHandler;
    fontouchcancel: TJSTouchEventHandler;
    fontouchend: TJSTouchEventHandler;
    fCurrentRID : String;
    fOnDrawColumnCell : TOnDrawColumnCell;
    fOnAddSeparator : TOnAddSeparator;
    fOnEndDraw : TNotifyEvent;
    FDefColWidth: NativeInt;
    FDefRowHeight: NativeInt;
    FShowHeader: boolean;
    FSortColumn: NativeInt;
    FSortOrder: TSortOrder;
    FOnCellClick: TOnClickEvent;
    FOnHeaderClick: TOnHeaderClick;
    FOnCellDblClick: TOnClickEvent;
    FLastClickTime: TDateTime;
    FLastClickCell: TJSHTMLTableCellElement;
    FLastTouchTime: TDateTime;
    FAlternateRowColor: TColor;
     FNeedsFullRender: boolean;
    FInfiniteScroll: boolean;
    FScrollLoading: boolean;
     FResponsiveMode: boolean;
   FResponsiveBreakpoint: Integer;
    FIsCardVisible: Boolean;
    FLastCardRow: Integer;
    FLastCardCol: Integer;
    FTouchStartX: Double;
    FTouchStartY: Double;
    FLastResponsiveState: string;
    FFilterBox: boolean;
    FFilterText: string;
    FFilterTimer: NativeInt;
     function GetColCount: NativeInt;
    function GetRowCount: NativeInt;
    procedure SetColumnClickSorts(AValue: boolean);
    procedure SetColumns(AValue: TDataColumns);
    procedure SetData(AValue: TJSArray);
    procedure SetDataJson(AValue: TLocalJSONDataset);
    procedure SetDataTable(AValue: TCustomWebDBTable);
    procedure SetDefColWidth(AValue: NativeInt);
    procedure SetDefRowHeight(AValue: NativeInt);
    procedure SetShowHeader(AValue: boolean);
    procedure SetAlternateRowColor(AValue: TColor);
    procedure SetResponsiveMode(AValue: boolean);
    procedure SetResponsiveBreakpoint(AValue: Integer);
    procedure SetFilterBox(AValue: boolean);
    procedure ProcessClick(ACell: TJSHTMLTableCellElement);
  protected
    FActiveCell: TJSHTMLTableCellElement;
    procedure KeyDown(var Key: NativeInt; Shift: TShiftState); override;
    procedure DoEnter; override;
    procedure CellClick(ACol, ARow: NativeInt); virtual;
    procedure HeaderClick(ACol: NativeInt); virtual;
    function CompareCells(A, B: JSValue): NativeInt; virtual;
    procedure Sort; virtual;
    procedure NavigateDown; virtual;
    procedure NavigateUp; virtual;
    procedure NavigateLeft; virtual;
    procedure NavigateRight; virtual;
    procedure NavigateEnd; virtual;
    procedure NavigateHome; virtual;
    procedure NavigatePageDown; virtual;
    procedure NavigatePageUp; virtual;
    procedure ScrollCellIntoView(ACell: TJSHTMLTableCellElement);
    function HandleBodyClick(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleBodyTouchStart(AEvent: TJSTouchEvent): boolean; virtual;
    function HandleBodyTouchEnd(AEvent: TJSTouchEvent): boolean; virtual;
    function HandleBodyScroll(AEvent: TJSEvent): boolean; virtual;
    function HandleHeaderClick(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleCardClick(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleCardTouchEnd(AEvent: TJSTouchEvent): boolean; virtual;
    function HandleWindowResize(AEvent: TJSEvent): boolean;
    function HandleFilterInput(AEvent: TJSEvent): boolean;
    function FilterMatchesRow(AObject: TJSObject): boolean;
    function GetViewportWidth: Integer;
    function IsColumnVisibleAtWidth(const AColumn: TDataColumn; AWidth: Integer): boolean;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure RenderTableStyle; virtual;
    procedure RenderTableHead; virtual;
    procedure RenderTableBody; virtual;
    procedure RenderCardBody; virtual;
    function RenderTableCell(const AColumn: TDataColumn; const AObject: TJSObject): string; virtual;
    function FormatCellValue(const AColumn: TDataColumn; const AValue: JSValue): string; virtual;
    function RenderTableHeadCell(const AColumn: TDataColumn; const AIndex: NativeInt): string; virtual;
    function SelectCell(ACol, ARow: NativeInt): TJSHTMLTableCellElement; virtual;
    procedure SetActiveCell(ACell: TJSHTMLTableCellElement); virtual;
    procedure AutomaticallyCreateColumns; virtual;
    procedure ColumnsChanged(AColumn: TDataColumn); virtual;
    function CalcDefaultRowHeight: NativeInt; virtual;
    class function GetControlClassDefaultSize: TSize; override;
  public
    Body: TJSHTMLTableSectionElement;
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    function AddColumn: TDataColumn; virtual;
    procedure Clear; virtual;
    procedure ExportToCSV; virtual;
    procedure Changed; override;
    property AutoCreateColumns: boolean read FAutoCreateColumns write FAutoCreateColumns;
    property ColCount: NativeInt read GetColCount;
    property Columns: TDataColumns read FColumns write SetColumns;
    property ColumnClickSorts: boolean read FColumnClickSorts write SetColumnClickSorts;
    property Data: TJSArray read FData write SetData;
    property DataJson: TLocalJSONDataset read FDataJSon write SetDataJson;
    property DataTable: TCustomWebDBTable read FDataTable write SetDataTable;
    property DefaultColWidth: NativeInt read FDefColWidth write SetDefColWidth;
    property DefaultRowHeight: NativeInt read FDefRowHeight write SetDefRowHeight;
    property RowCount: NativeInt read GetRowCount;
    property SortColumn: NativeInt read FSortColumn;
    property SortOrder: TSortOrder read FSortOrder;
     property ShowHeader: boolean read FShowHeader write SetShowHeader;
     property AlternateRowColor: TColor read FAlternateRowColor write SetAlternateRowColor;
     property ResponsiveMode: boolean read FResponsiveMode write SetResponsiveMode;
    property ResponsiveBreakpoint: Integer read FResponsiveBreakpoint write SetResponsiveBreakpoint;
    property FilterBox: boolean read FFilterBox write SetFilterBox;
    property InfiniteScroll: boolean read FInfiniteScroll write FInfiniteScroll;
    property OnCellClick: TOnClickEvent read FOnCellClick write FOnCellClick;
    property OnHeaderClick: TOnHeaderClick read FOnHeaderClick write FOnHeaderClick;
    property onTouchStart: TJSTouchEventHandler read fontouchstart write fontouchstart;
    property onTouchMove: TJSTouchEventHandler read fontouchmove write fontouchmove;
    property onTouchCancel: TJSTouchEventHandler read fontouchcancel write fontouchcancel;
    property onTouchEnd: TJSTouchEventHandler read fontouchend write fontouchend;
    property OnDrawColumnCell : TOnDrawColumnCell read fOnDrawColumnCell write fOnDrawColumnCell;
    property OnAddSeparator : TOnAddSeparator read fOnAddSeparator write fOnAddSeparator;
    property OnEndDraw: TNotifyEvent read fOnEndDraw write fOnEndDraw;
    property RowSelect : Boolean read FRowSelect write FRowSelect default false;
  published
    property OnCellDblClick: TOnClickEvent read FOnCellDblClick write FOnCellDblClick;
  end;

  TOnPageEvent = procedure(ASender: TObject; APage: NativeInt) of object;

  { TCustomPagination }
  TCustomPagination = class(TCustomControl)
  private
    FCurrentPage: NativeInt;
    FOnPageClick: TOnPageEvent;
    FRecordsPerPage: NativeInt;
    FTotalPages: NativeInt;
    FTotalRecords: NativeInt;
    procedure SetCurrentPage(AValue: NativeInt);
    procedure SetRecordsPerPage(AValue: NativeInt);
    procedure SetTotalRecords(AValue: NativeInt);
  public
    procedure PageClick(APage: NativeInt); virtual;
  protected
    function HandlePageClick(AEvent: TJSMouseEvent): boolean; virtual;
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    function CalculatePages: TJSArray; virtual;
    function RenderPage(const ACaption: string; const AWidth: NativeInt; const AEvent: JSValue; const AActive: boolean = False): TJSHTMLElement; virtual;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    property CurrentPage: NativeInt read FCurrentPage write SetCurrentPage;
    property RecordsPerPage: NativeInt read FRecordsPerPage write SetRecordsPerPage;
    property TotalPages: NativeInt read FTotalPages;
    property TotalRecords: NativeInt read FTotalRecords write SetTotalRecords;
    property OnPageClick: TOnPageEvent read FOnPageClick write FOnPageClick;
  end;

implementation

uses
  Math,
  Maskutils;

const
  DblClickThreshold = 0.000005;

function FindClosestParent(AElement: TJSElement; const ATagName: string): TJSElement;
var
  Current: TJSElement;
begin
  Result := nil;
  if not Assigned(AElement) then Exit;
  Current := AElement;
  while Assigned(Current) do
  begin
    if SameText(Current.tagName, ATagName) then
    begin
      Result := Current;
      Exit;
    end;
    Current := Current.parentElement;
  end;
end;


{ TDataColumn }
function TDataColumn.GetGrid: TCustomDataGrid;
begin
   if (Assigned(Collection)) and (Collection is TDataColumns) then begin
      Result := TDataColumns(Collection).Grid;
   end else begin
      Result := nil;
   end;
end;

procedure TDataColumn.SetAlignment(AValue: TAlignment);
begin
   if (FAlignment <> AValue) then begin
      FAlignment := AValue;
      ColumnChanged;
   end;
end;

procedure TDataColumn.SetColor(AValue: TColor);
begin
   if (FColor <> AValue) then begin
      FColor := AValue;
      ColumnChanged;
   end;
end;

procedure TDataColumn.SetDisplayMask(AValue: string);
begin
  if (FDisplayMask <> AValue) then
  begin
    FDisplayMask := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.SetFont(AValue: TFont);
begin
  if (not FFont.IsEqual(AValue)) then
  begin
    FFont.Assign(AValue);
  end;
end;

procedure TDataColumn.SetTitleFont(AValue: TFont);
begin
  if (not FTitleFont.IsEqual(AValue)) then
  begin
    FTitleFont.Assign(AValue);
  end;
end;

procedure TDataColumn.SetFormat(AValue: TColumnFormat);
begin
  if (FFormat <> AValue) then
  begin
    FFormat := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.SetName(AValue: string);
begin
  if (FName <> AValue) then
  begin
    FName := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.SetTitle(AValue: string);
begin
  if (FTitle <> AValue) then
  begin
    FTitle := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.SetValueChecked(AValue: string);
begin
  if (FValueChecked <> AValue) then
  begin
    FValueChecked := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.SetValueUnchecked(AValue: string);
begin
  if (FValueUnchecked <> AValue) then
  begin
    FValueUnchecked := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.SetVisible(AValue: boolean);
begin
  if (FVisible <> AValue) then
  begin
    FVisible := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.SetWidth(AValue: NativeInt);
begin
  if (FWidth <> AValue) then
  begin
    FWidth := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.SetResponsiveMinWidth(AValue: Integer);
begin
  if (FResponsiveMinWidth <> AValue) then
  begin
    FResponsiveMinWidth := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.SetResponsiveMaxWidth(AValue: Integer);
begin
  if (FResponsiveMaxWidth <> AValue) then
  begin
    FResponsiveMaxWidth := AValue;
    ColumnChanged;
  end;
end;

procedure TDataColumn.ColumnChanged;
begin
  if (FUpdateCount = 0) then
  begin
    Changed(False);
  end;
end;

function TDataColumn.GetDisplayName: string;
begin
  if (FTitle <> '') then
  begin
    Result := FTitle;
  end
  else
  begin
    Result := 'Column ' + IntToStr(Index);
  end;
end;

procedure TDataColumn.FillDefaultFont;
begin
   if (Assigned(Grid)) then begin
      FFont.Assign(Grid.Font);
      FTitleFont.Assign(Grid.Font);
   end;
end;

{$push}
{$hints off}

procedure TDataColumn.FontChanged(Sender: TObject);
begin
  ColumnChanged;
end;

{$pop}

function TDataColumn.GetDefaultValueChecked: string;
begin
  Result := '1';
end;

function TDataColumn.GetDefaultValueUnchecked: string;
begin
  Result := '0';
end;

constructor TDataColumn.Create(ACollection: TCollection);
begin
  inherited Create(ACollection);
  FFont := TFont.Create;
  FFont.OnChange := @FontChanged;
  FTitleFont := TFont.Create;
  FTitleFont.OnChange := @FontChanged;

  FAlignment := taLeftJustify;
  FColor := clWhite;
  FDisplayMask := '';
  FFormat := cfString;
  FHint := '';
  FName := '';
  FTag := 0;
  FTitle := '';
  FUpdateCount := 0;
  FValueChecked := GetDefaultValueChecked;
  FValueUnchecked := GetDefaultValueUnchecked;
  FVisible := True;
  FWidth := 0;
  FResponsiveMinWidth := 0;
  FResponsiveMaxWidth := 0;
  FillDefaultFont;
end;

destructor TDataColumn.Destroy;
begin
  FFont.Destroy;
  FFont := nil;
  FTitleFont.Destroy;
  FTitleFont := nil;
  inherited Destroy;
end;

procedure TDataColumn.Assign(Source: TPersistent);
  var VColumn: TDataColumn;
begin
   if (Assigned(Source)) and (Source is TDataColumn) then begin
      BeginUpdate;
      try
         VColumn := TDataColumn(Source);
         FAlignment := VColumn.Alignment;
         FColor := VColumn.Color;
         FDisplayMask := VColumn.DisplayMask;
         FFont.Assign(VColumn.FFont);
         FFormat := VColumn.Format;
         FHint := VColumn.Hint;
         FName := VColumn.Name;
         FTag := VColumn.Tag;
         FTitle := VColumn.Title;
         FValueChecked := VColumn.ValueChecked;
         FValueUnchecked := VColumn.ValueUnchecked;
         FVisible := VColumn.Visible;
         FWidth := VColumn.Width;
         FResponsiveMinWidth := VColumn.ResponsiveMinWidth;
         FResponsiveMaxWidth := VColumn.ResponsiveMaxWidth;
      finally
         EndUpdate;
      end;
   end else begin
      inherited Assign(Source);
   end;
end;

procedure TDataColumn.BeginUpdate;
begin
   Inc(FUpdateCount);
end;

procedure TDataColumn.EndUpdate;
begin
  if (FUpdateCount > 0) then
  begin
    Dec(FUpdateCount);
    if (FUpdateCount = 0) then
    begin
      ColumnChanged;
    end;
  end;
end;

{ TDataColumns }
function TDataColumns.GetColumn(AIndex: NativeInt): TDataColumn;
begin
  Result := TDataColumn(inherited Items[AIndex]);
end;

procedure TDataColumns.SetColumn(AIndex: NativeInt; AValue: TDataColumn);
begin
  Items[AIndex].Assign(AValue);
end;

function TDataColumns.GetOwner: TPersistent;
begin
  Result := FGrid;
end;

procedure TDataColumns.Update(AItem: TCollectionItem);
begin
  FGrid.ColumnsChanged(TDataColumn(AItem));
end;

constructor TDataColumns.Create(AGrid: TCustomDataGrid);
begin
  inherited Create(TDataColumn);
  FGrid := AGrid;
end;

function TDataColumns.Add: TDataColumn;
begin
  Result := TDataColumn(inherited Add);
end;

function TDataColumns.HasIndex(const AIndex: integer): boolean;
begin
  Result := (Aindex > -1) and (AIndex < Count);
end;


{ TCustomDataGrid }

procedure TCustomDataGrid.ProcessClick(ACell: TJSHTMLTableCellElement);
  var VRow: TJSHTMLTableRowElement;
      rid, cid, colid: string;
      VColIndex: NativeInt;
begin
   if not Assigned(ACell) then Exit;

   VRow := TJSHTMLTableRowElement(ACell.parentElement);
   if not Assigned(VRow) then Exit;

   cid := ACell.getAttribute('name');
   if cid=null then cid:='';

   if (cid <> '') then begin
      rid := copy(cid, 1, pos('_', cid) - 1);
      colid := copy(cid, pos('_', cid) + 1, MaxInt);
      VColIndex := StrToIntDef(colid, -1);
      //if fCurrentRID <> rid then begin
         if Assigned(FDataJSon) and not Assigned(FData) then
         begin
            if FDataJSon.Active then FDataJSon.First;
            if FDataJSon.RecordCount > StrToIntDef(rid, 0) then
               FDataJSon.MoveBy(StrToIntDef(rid, 0));
         end;
         fCurrentRID := rid;
      //end;

      SetActiveCell(ACell);

      if (Assigned(FOnCellDblClick)) and
         (Now - FLastClickTime < DblClickThreshold) and
         (FLastClickCell = ACell) then
      begin
         FLastClickTime := 0;
         FLastClickCell := nil;
          FOnCellDblClick(Self, VColIndex, VRow.sectionRowIndex);
      end else begin
         FLastClickTime := Now;
         FLastClickCell := ACell;
          CellClick(VColIndex, VRow.sectionRowIndex);
      end;
   end;
end;

function TCustomDataGrid.HandleBodyTouchStart(AEvent: TJSTouchEvent): boolean;
begin
  FLastTouchTime := Now;
  asm
    if (AEvent.touches.length > 0) {
      this.FTouchStartX = AEvent.touches[0].clientX;
      this.FTouchStartY = AEvent.touches[0].clientY;
    }
  end;
  if Assigned(fontouchstart) then fontouchstart(AEvent);
  Result := True;
end;

function TCustomDataGrid.HandleBodyTouchEnd(AEvent: TJSTouchEvent): boolean;
var
  TargetElement: TJSElement;
  VCell: TJSHTMLTableCellElement;
  dist: Double;
begin
   if Enabled=false then exit(True);

   // Allow native scrolling by NOT calling preventDefault.
   // Only process as a click if the touch didn't move (tap vs swipe/scroll).
   dist := 0;
   asm
     if (AEvent.changedTouches.length > 0) {
       let t = AEvent.changedTouches[0];
       let tdx = Math.abs(t.clientX - this.FTouchStartX);
       let tdy = Math.abs(t.clientY - this.FTouchStartY);
       dist = Math.sqrt(tdx*tdx + tdy*tdy);
     }
   end;

   if dist < 10 then begin
     TargetElement := AEvent.targetElement;
     VCell := TJSHTMLTableCellElement(FindClosestParent(TargetElement, 'TD'));
     if Assigned(VCell) then
       ProcessClick(VCell);
   end;

   if Assigned(fontouchend) then fontouchend(AEvent);
   Result := True;
end;

function TCustomDataGrid.HandleBodyClick(AEvent: TJSMouseEvent): boolean;
var
  TargetElement: TJSElement;
  VCell: TJSHTMLTableCellElement;
begin
   if Enabled=false then exit(True);

   if (Now - FLastTouchTime < 0.000006) then
   begin
     Result := True;
     Exit;
   end;

   TargetElement := AEvent.targetElement;
   VCell := TJSHTMLTableCellElement(FindClosestParent(TargetElement, 'TD'));

   if Assigned(VCell) then
   begin
     AEvent.StopPropagation;
     ProcessClick(VCell);
   end;
   Result := True;
end;

// LA FUNZIONE REINTEGRATA
function TCustomDataGrid.HandleHeaderClick(AEvent: TJSMouseEvent): boolean;
var
  VCell: TJSHTMLTableCellElement;
begin
  VCell := TJSHTMLTableCellElement(FindClosestParent(AEvent.targetElement, 'TH'));
  if Assigned(VCell) then
  begin
    AEvent.StopPropagation;
    if VCell.hasAttribute('data-col') then
      HeaderClick(StrToIntDef(VCell.getAttribute('data-col'), -1));
  end;
  Result := True;
end;

procedure TCustomDataGrid.RenderTableBody;
  var VColumn: TDataColumn;
      VColumnIndex, VRowIndex, VDisplayRow: NativeInt;
      VRow: TJSHTMLTableRowElement;
      VCell: TJSHTMLTableCellElement;
      VObject: TJSObject;
      VValue: JSValue;
      position : TBookmark;
      Separator : String;
      VViewportWidth: Integer;
begin
   VViewportWidth := GetViewportWidth;
   Body := TJSHTMLTableSectionElement(HandleElement.AppendChild(Document.CreateElement('tbody')));
   Body.setAttribute('name', Name + '_body' );

   Body.AddEventListener('scroll', @HandleBodyScroll);
   Body.AddEventListener('click', @HandleBodyClick);
   Body.AddEventListener('touchend', @HandleBodyTouchEnd);
   Body.AddEventListener('touchstart', @HandleBodyTouchStart);
   if Assigned(fontouchmove) then Body.AddEventListener('touchmove', fontouchmove);
   if Assigned(fontouchcancel) then Body.AddEventListener('touchcancel', fontouchcancel);

   if (Assigned(FData)) then begin
      VDisplayRow := 0;
      for VRowIndex := 0 to (FData.Length - 1) do begin
         VValue := FData[VRowIndex];
         if (Assigned(VValue)) and (IsObject(VValue)) then
         begin
            VObject := TJSObject(VValue);
            if (FFilterText <> '') and not FilterMatchesRow(VObject) then continue;
            If Assigned(fOnAddSeparator) then begin
               Separator:='';
               fOnAddSeparator(self, Separator);
               if Separator<>'' then begin
                  VRow := TJSHTMLTableRowElement(Body.AppendChild(Document.CreateElement('tr')));
                  vrow.innerHTML:=Separator;
               end;
            end;

            VRow := TJSHTMLTableRowElement(Body.AppendChild(Document.CreateElement('tr')));
            for VColumnIndex := 0 to (FColumns.Count - 1) do begin
               VColumn := FColumns[VColumnIndex];
               if not IsColumnVisibleAtWidth(VColumn, VViewportWidth) then continue;
               VCell := TJSHTMLTableCellElement(VRow.AppendChild(Document.CreateElement('td')));
               VCell.setAttribute('name', VRowIndex.ToString + '_' + VColumnIndex.ToString);
               VCell.setAttribute('data-label', VColumn.Title);
               if (VDisplayRow mod 2)=0 then
                  VCell.Style.SetProperty('background-color', JSColor(FAlternateRowColor));
               VCell.InnerHTML := RenderTableCell(VColumn, VObject);
               if (Assigned(fOnDrawColumnCell)) then
                  fOnDrawColumnCell(self, VColumn.Name, VCell);
            end;
            Inc(VDisplayRow);
         end;
      end;
    end else if Assigned(FDataJSon) and FDataJSon.Active then Begin
       if FDataJSon.RecordCount = 0 then exit;
       position := FDataJSon.GetBookmark;
       FDataJSon.First;
       VDisplayRow := 0;
       VRowIndex:=0;
        while not FDataJSon.eof do begin
           VObject := TJSObject.new;
           for VColumnIndex := 0 to (FColumns.Count - 1) do begin
             VColumn := FColumns[VColumnIndex];
             VObject[VColumn.Name] := FDataJSon.FieldByName(VColumn.name).AsString;
           end;
           if FFilterText <> '' then begin
             if not FilterMatchesRow(VObject) then begin
               FDataJSon.Next;
               inc(VRowIndex);
               continue;
             end;
           end;

         If Assigned(fOnAddSeparator) then begin
            Separator:='';
            fOnAddSeparator(self, Separator);
            if Separator<>'' then begin
               VRow := TJSHTMLTableRowElement(Body.AppendChild(Document.CreateElement('tr')));
               vrow.innerHTML:=Separator;
            end;
         end;

         VRow := TJSHTMLTableRowElement(Body.AppendChild(Document.CreateElement('tr')));
         for VColumnIndex := 0 to (FColumns.Count - 1) do begin
            VColumn := FColumns[VColumnIndex];
            if not IsColumnVisibleAtWidth(VColumn, VViewportWidth) then continue;
            VCell := TJSHTMLTableCellElement(VRow.AppendChild(Document.CreateElement('td')));
            VCell.setAttribute('name', VRowIndex.ToString + '_' + VColumnIndex.ToString);
            VCell.setAttribute('data-label', VColumn.Title);
            if (VDisplayRow mod 2)=0 then
               VCell.Style.SetProperty('background-color', JSColor(FAlternateRowColor));
            VCell.InnerHTML := RenderTableCell(VColumn, VObject);
            if (Assigned(fOnDrawColumnCell)) then
               fOnDrawColumnCell(self, VColumn.Name, VCell);
            if (FDataJSon.GetBookmark=position) then
               SetActiveCell(VCell);
         end;
         FDataJSon.Next;
         inc(VRowIndex);
         Inc(VDisplayRow);
      end;
      FDataJSon.GotoBookmark(position);
   end;
end;

function TCustomDataGrid.HandleCardClick(AEvent: TJSMouseEvent): boolean;
var
  VRow, VCol, VSortCol: Integer;
  VTarget, VLabelEl, VCell: TJSElement;
begin
   if Enabled=false then exit(True);

   // Check if click target is a label → sort column
   VSortCol := -1;
   VTarget := AEvent.targetElement;
   if Assigned(VTarget) then begin
     VLabelEl := VTarget;
     while Assigned(VLabelEl) do begin
       if Pos('dg-label', TJSHTMLElement(VLabelEl).className) > 0 then begin
         VCell := VLabelEl.parentElement;
         while Assigned(VCell) do begin
           if TJSHTMLElement(VCell).hasAttribute('dg-cell') then begin
             VSortCol := StrToIntDef(TJSHTMLElement(VCell).getAttribute('data-col'), -1);
             break;
           end;
           VCell := VCell.parentElement;
         end;
         break;
       end;
       VLabelEl := VLabelEl.parentElement;
     end;
   end;
   if VSortCol >= 0 then begin
     if FColumnClickSorts then begin
       if (FSortColumn = VSortCol) then
         if (FSortOrder = soAscending) then FSortOrder := soDescending else FSortOrder := soAscending
       else FSortOrder := soAscending;
       FSortColumn := VSortCol;
       Sort;
     end;
     if Assigned(FOnHeaderClick) then FOnHeaderClick(Self, VSortCol);
     Result := True;
     Exit;
   end;

   // Find the card cell, read data, and highlight — all in JS
   asm
     var el = AEvent.target;
     while (el && el.getAttribute && el.getAttribute('dg-cell') === null)
       el = el.parentElement;
     if (el) {
       VRow = parseInt(el.getAttribute('data-row'));
       VCol = parseInt(el.getAttribute('data-col'));
       var old = this.FHandleElement.querySelector('.dg-card.dg-active');
       if (old) old.classList.remove('dg-active');
       if (el.parentElement) el.parentElement.classList.add('dg-active');
     } else {
       VRow = -1; VCol = -1;
     }
   end;
   if VRow < 0 then exit(True);
    // Sync DataJSon (only if rendering directly from dataset, not after sort)
    if Assigned(FDataJSon) and FDataJSon.Active and not Assigned(FData) then begin
      if FDataJSon.RecordCount > VRow then begin
         FDataJSon.First;
         FDataJSon.MoveBy(VRow);
      end;
    end;
   fCurrentRID := VRow.ToString;
   // Double-click detection
   if (Assigned(FOnCellDblClick)) and
      (Now - FLastClickTime < DblClickThreshold) and
      (FLastCardRow = VRow) and (FLastCardCol = VCol) then
   begin
     FLastClickTime := 0;
     FLastCardRow := -1;
     FLastCardCol := -1;
     FOnCellDblClick(Self, VCol, VRow);
   end else begin
     FLastClickTime := Now;
     FLastCardRow := VRow;
     FLastCardCol := VCol;
     CellClick(VCol, VRow);
   end;
   Result := True;
end;

function TCustomDataGrid.HandleCardTouchEnd(AEvent: TJSTouchEvent): boolean;
var
  VCell: TJSElement;
  VRow, VCol: Integer;
begin
   if Enabled=false then exit(True);
   AEvent.preventDefault;
   asm
     let el = AEvent.targetElement;
     while (el && !el.hasAttribute('dg-cell')) el = el.parentElement;
     VCell = el || null;
   end;
   if not Assigned(VCell) then exit(True);
   asm
     VRow = parseInt(VCell.getAttribute('data-row'));
     VCol = parseInt(VCell.getAttribute('data-col'));
   end;
   CellClick(VCol, VRow);
   if Assigned(fontouchend) then fontouchend(AEvent);
   Result := True;
end;

procedure TCustomDataGrid.RenderCardBody;
var
  VColumn: TDataColumn;
  VColumnIndex, VRowIndex, VDisplayRow: NativeInt;
  VCard, VCell, VLabel, VValue: TJSHTMLElement;
  VObject: TJSObject;
  VJSValue: JSValue;
  position: TBookmark;
  VContainer: TJSHTMLElement;
  VViewportWidth: Integer;
begin
   VViewportWidth := GetViewportWidth;
    VContainer := TJSHTMLElement(HandleElement.QuerySelector('.dg-card-container'));
    if not Assigned(VContainer) then Exit;

    if (Assigned(FData)) then begin
      for VRowIndex := 0 to (FData.Length - 1) do begin
         VJSValue := FData[VRowIndex];
         if (Assigned(VJSValue)) and (IsObject(VJSValue)) then begin
            VObject := TJSObject(VJSValue);
            if (FFilterText <> '') and not FilterMatchesRow(VObject) then continue;
            VCard := TJSHTMLElement(Document.CreateElement('div'));
            VCard.setAttribute('class', 'dg-card');
            VCard.AddEventListener('click', @HandleCardClick);
            if (VDisplayRow mod 2)=0 then
               VCard.Style.SetProperty('background-color', JSColor(FAlternateRowColor));
            VCard.setAttribute('data-row', VDisplayRow.ToString);
            for VColumnIndex := 0 to (FColumns.Count - 1) do begin
               VColumn := FColumns[VColumnIndex];
               if not IsColumnVisibleAtWidth(VColumn, VViewportWidth) then continue;
               VCell := TJSHTMLElement(Document.CreateElement('div'));
               VCell.setAttribute('dg-cell', '');
               VCell.setAttribute('data-row', VRowIndex.ToString);
               VCell.setAttribute('data-col', VColumnIndex.ToString);
               VLabel := TJSHTMLElement(Document.CreateElement('span'));
               VLabel.setAttribute('class', 'dg-label');
               if (VColumnIndex = FSortColumn) then
                 VLabel.InnerHTML := IfThen(FSortOrder = soAscending, '↓ ', '↑ ') + IfThen(VColumn.Title <> '', VColumn.Title, VColumn.Name)
               else
                 VLabel.InnerHTML := IfThen(VColumn.Title <> '', VColumn.Title, VColumn.Name);
               VCell.AppendChild(VLabel);
               VValue := TJSHTMLElement(Document.CreateElement('span'));
               VValue.setAttribute('class', 'dg-value');
               VValue.InnerHTML := RenderTableCell(VColumn, VObject);
               VCell.AppendChild(VValue);
               VCard.AppendChild(VCell);
               if Assigned(fOnDrawColumnCell) then begin
                  fOnDrawColumnCell(self, VColumn.Name, TJSHTMLTableCellElement(VCell));
                  asm
                    if (!VCell.querySelector('.dg-label'))
                      VCell.insertBefore(VLabel, VCell.firstChild);
                  end;
               end;
            end;
            VContainer.AppendChild(VCard);
            Inc(VDisplayRow);
         end;
      end;
   end else if Assigned(FDataJSon) and FDataJSon.Active then begin
      position := FDataJSon.GetBookmark;
      FDataJSon.First;
      VDisplayRow := 0;
       while not FDataJSon.eof do begin
          VObject := TJSObject.new;
          for VColumnIndex := 0 to (FColumns.Count - 1) do begin
            VColumn := FColumns[VColumnIndex];
            VObject[VColumn.Name] := FDataJSon.FieldByName(VColumn.name).AsString;
          end;
          if FFilterText <> '' then begin
            if not FilterMatchesRow(VObject) then begin
             FDataJSon.Next;
             continue;
           end;
           VCard := TJSHTMLElement(Document.CreateElement('div'));
           VCard.setAttribute('class', 'dg-card');
           VCard.AddEventListener('click', @HandleCardClick);
           if (VDisplayRow mod 2)=0 then
              VCard.Style.SetProperty('background-color', JSColor(FAlternateRowColor));
           VCard.setAttribute('data-row', VDisplayRow.ToString);
           for VColumnIndex := 0 to (FColumns.Count - 1) do begin
              VColumn := FColumns[VColumnIndex];
              if not IsColumnVisibleAtWidth(VColumn, VViewportWidth) then continue;
              VCell := TJSHTMLElement(Document.CreateElement('div'));
              VCell.setAttribute('dg-cell', '');
              VCell.setAttribute('data-row', VDisplayRow.ToString);
              VCell.setAttribute('data-col', VColumnIndex.ToString);
              VLabel := TJSHTMLElement(Document.CreateElement('span'));
              VLabel.setAttribute('class', 'dg-label');
              if (VColumnIndex = FSortColumn) then
                VLabel.InnerHTML := IfThen(FSortOrder = soAscending, '↓ ', '↑ ') + IfThen(VColumn.Title <> '', VColumn.Title, VColumn.Name)
              else
                VLabel.InnerHTML := IfThen(VColumn.Title <> '', VColumn.Title, VColumn.Name);
              VCell.AppendChild(VLabel);
              VValue := TJSHTMLElement(Document.CreateElement('span'));
              VValue.setAttribute('class', 'dg-value');
              VValue.InnerHTML := RenderTableCell(VColumn, VObject);
              VCell.AppendChild(VValue);
              VCard.AppendChild(VCell);
              if Assigned(fOnDrawColumnCell) then begin
                 fOnDrawColumnCell(self, VColumn.Name, TJSHTMLTableCellElement(VCell));
                 asm
                   if (!VCell.querySelector('.dg-label'))
                     VCell.insertBefore(VLabel, VCell.firstChild);
                 end;
              end;
           end;
           VContainer.AppendChild(VCard);
           Inc(VDisplayRow);
         end else begin
           VCard := TJSHTMLElement(Document.CreateElement('div'));
           VCard.setAttribute('class', 'dg-card');
           VCard.AddEventListener('click', @HandleCardClick);
           if (VDisplayRow mod 2)=0 then
              VCard.Style.SetProperty('background-color', JSColor(FAlternateRowColor));
           for VColumnIndex := 0 to (FColumns.Count - 1) do begin
              VColumn := FColumns[VColumnIndex];
              if not IsColumnVisibleAtWidth(VColumn, VViewportWidth) then continue;
              VCell := TJSHTMLElement(Document.CreateElement('div'));
              VCell.setAttribute('dg-cell', '');
              VCell.setAttribute('data-row', VDisplayRow.ToString);
              VCell.setAttribute('data-col', VColumnIndex.ToString);
              VLabel := TJSHTMLElement(Document.CreateElement('span'));
              VLabel.setAttribute('class', 'dg-label');
              if (VColumnIndex = FSortColumn) then
                VLabel.InnerHTML := IfThen(FSortOrder = soAscending, '↓ ', '↑ ') + IfThen(VColumn.Title <> '', VColumn.Title, VColumn.Name)
              else
                VLabel.InnerHTML := IfThen(VColumn.Title <> '', VColumn.Title, VColumn.Name);
              VCell.AppendChild(VLabel);
              VValue := TJSHTMLElement(Document.CreateElement('span'));
              VValue.setAttribute('class', 'dg-value');
              VValue.InnerHTML := FormatCellValue(VColumn, FDataJSon.FieldByName(VColumn.name).AsString);
              VCell.AppendChild(VValue);
              VCard.AppendChild(VCell);
              if Assigned(fOnDrawColumnCell) then begin
                 fOnDrawColumnCell(self, VColumn.Name, TJSHTMLTableCellElement(VCell));
                 asm
                   if (!VCell.querySelector('.dg-label'))
                     VCell.insertBefore(VLabel, VCell.firstChild);
                 end;
              end;
           end;
           VContainer.AppendChild(VCard);
           Inc(VDisplayRow);
         end;
         FDataJSon.Next;
      end;
      FDataJSon.GotoBookmark(position);
   end;
end;

constructor TCustomDataGrid.Create(AOwner: TComponent);
begin
   inherited Create(AOwner);
   FColumns := TDataColumns.Create(Self);
    FActiveCell := nil;
    fSelRow := -1;
    fSelCol := -1;
   FAutoCreateColumns := True;
   FColumnClickSorts := True;
   FDefColWidth := -1;
   FDefRowHeight := -1;
   FShowHeader := True;
   FSortColumn := -1;
   FSortOrder := soAscending;
   FLastClickTime := 0;
   FLastClickCell := nil;
   FLastTouchTime := 0;
   FAlternateRowColor := TColor($F2F2F2);
   FNeedsFullRender := True;
   FResponsiveMode := False;
   FResponsiveBreakpoint := 0;
   FIsCardVisible := False;
   FLastCardRow := -1;
    FLastCardCol := -1;
     FTouchStartX := 0;
     FTouchStartY := 0;
     FLastResponsiveState := '';
     FFilterBox := False;
     FFilterText := '';
     BeginUpdate;
   try
      Color := clWhite;
      ParentColor := False;
      with GetControlClassDefaultSize do begin
         SetBounds(0, 0, Cx, Cy);
      end;
   finally
      EndUpdate;
   end;
end;

destructor TCustomDataGrid.Destroy;
begin
   asm window.removeEventListener('resize', this.FHandleWindowResize); end;
   FColumns.Destroy;
   FColumns := nil;
   inherited Destroy;
end;

function TCustomDataGrid.AddColumn: TDataColumn;
begin
   Result := FColumns.Add;
end;

procedure TCustomDataGrid.Clear;
begin
   FData := nil;
   FDataJSon := nil;
   Changed;
end;

procedure TCustomDataGrid.ExportToCSV;
var
  VColIdx, VRowIdx: NativeInt;
  VCol: TDataColumn;
  VCSV, VVal, VFileName: string;
  VObj: TJSObject;
  VJSVal: JSValue;
begin
  VCSV := '';
  // Header
  for VColIdx := 0 to FColumns.Count - 1 do
  begin
    VCol := FColumns[VColIdx];
    if VColIdx > 0 then VCSV := VCSV + ',';
    VCSV := VCSV + '"' + IfThen(VCol.Title <> '', VCol.Title, VCol.Name) + '"';
  end;
  VCSV := VCSV + #13#10;
  // Data
  if Assigned(FData) then
  begin
    for VRowIdx := 0 to FData.Length - 1 do
    begin
      VJSVal := FData[VRowIdx];
      if IsObject(VJSVal) then
      begin
        VObj := TJSObject(VJSVal);
        for VColIdx := 0 to FColumns.Count - 1 do
        begin
          VCol := FColumns[VColIdx];
          if VColIdx > 0 then VCSV := VCSV + ',';
          VVal := String(VObj[VCol.Name]);
          VCSV := VCSV + '"' + StringReplace(VVal, '"', '""', [rfReplaceAll]) + '"';
        end;
        VCSV := VCSV + #13#10;
      end;
    end;
  end
  else if Assigned(FDataJSon) and FDataJSon.Active then
  begin
    FDataJSon.First;
    while not FDataJSon.Eof do
    begin
      for VColIdx := 0 to FColumns.Count - 1 do
      begin
        VCol := FColumns[VColIdx];
        if VColIdx > 0 then VCSV := VCSV + ',';
        VCSV := VCSV + '"' + FDataJSon.FieldByName(VCol.Name).AsString + '"';
      end;
      VCSV := VCSV + #13#10;
      FDataJSon.Next;
    end;
  end;
  VFileName := IfThen(Name <> '', Name, 'export') + '.csv';
  // Download via browser
  asm
    var blob = new Blob([VCSV], { type: 'text/csv;charset=utf-8;' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = VFileName;
    a.click();
    URL.revokeObjectURL(url);
  end;
end;

function TCustomDataGrid.GetColCount: NativeInt;
begin
  Result := FColumns.Count;
end;

function TCustomDataGrid.GetRowCount: NativeInt;
  var VBody: TJSHTMLTableSectionElement;
begin
   VBody := TJSHTMLTableSectionElement(HandleElement.QuerySelector('tbody'));
   Result := IfThen(Assigned(VBody), VBody.Rows.Length, 0);
end;

procedure TCustomDataGrid.SetColumnClickSorts(AValue: boolean);
begin
  if (FColumnClickSorts <> AValue) then
  begin
    FColumnClickSorts := AValue;
    Changed;
  end;
end;

procedure TCustomDataGrid.SetColumns(AValue: TDataColumns);
begin
  FColumns.Assign(AValue);
end;

procedure TCustomDataGrid.SetData(AValue: TJSArray);
begin
   if (FData <> AValue) then begin
      BeginUpdate;
      try
         FData := AValue;
         FDataJSon := nil;
         AutomaticallyCreateColumns;
      finally
         EndUpdate;
      end;
   end;
end;

procedure TCustomDataGrid.SetDataJson(AValue: TLocalJSONDataset);
Begin
   if (FDataJSon <> AValue) then begin
      BeginUpdate;
      try
         FData:=nil;
         FDataJSon := AValue;
         FNeedsFullRender := True;
         AutomaticallyCreateColumns;
      finally
         EndUpdate;
      end;
   end else begin
    changed;
  end;
end;

procedure TCustomDataGrid.SetDataTable(AValue: TCustomWebDBTable);
begin
  if (FDataTable <> AValue) then
  begin
    if Assigned(FDataTable) then
      FDataTable.OnLoad := FTableDataLoaded;
    FDataTable := AValue;
    if Assigned(FDataTable) then
    begin
      FTableDataLoaded := FDataTable.OnLoad;
      FDataTable.OnLoad := @DoTableDataLoaded;
      if FDataTable.Active then
        SetDataJson(FDataTable.DataJson)
      else
        SetDataJson(nil);
    end
    else
      SetDataJson(nil);
  end;
end;

procedure TCustomDataGrid.DoTableDataLoaded(Sender: TObject);
begin
  FScrollLoading := False;
  if Assigned(FTableDataLoaded) then
    FTableDataLoaded(Sender);
  if Assigned(FDataTable) then
    SetDataJson(FDataTable.DataJson);
end;

procedure TCustomDataGrid.SetDefColWidth(AValue: NativeInt);
begin
  if (FDefColWidth <> AValue) then
  begin
    FDefColWidth := AValue;
    FNeedsFullRender := True;
    Changed;
  end;
end;

procedure TCustomDataGrid.SetDefRowHeight(AValue: NativeInt);
begin
  if (FDefRowHeight <> AValue) then
  begin
    FDefRowHeight := AValue;
    FNeedsFullRender := True;
    Changed;
  end;
end;

procedure TCustomDataGrid.SetShowHeader(AValue: boolean);
begin
  if (FShowHeader <> AValue) then
  begin
    FShowHeader := AValue;
    FNeedsFullRender := True;
    Changed;
  end;
end;

procedure TCustomDataGrid.SetAlternateRowColor(AValue: TColor);
begin
  if (FAlternateRowColor <> AValue) then
  begin
    FAlternateRowColor := AValue;
    Changed;
  end;
end;

procedure TCustomDataGrid.SetResponsiveMode(AValue: boolean);
begin
  if (FResponsiveMode <> AValue) then
  begin
    FResponsiveMode := AValue;
    FNeedsFullRender := True;
    Changed;
    // Register/unregister resize observer for breakpoint > 0 or responsive columns
    asm
      if (this.FResponsiveMode) {
        window.addEventListener('resize', this.FHandleWindowResize);
      } else {
        window.removeEventListener('resize', this.FHandleWindowResize);
      }
    end;
  end;
end;

procedure TCustomDataGrid.SetResponsiveBreakpoint(AValue: Integer);
begin
  if (FResponsiveBreakpoint <> AValue) then
  begin
    FResponsiveBreakpoint := AValue;
    FNeedsFullRender := True;
    Changed;
  end;
end;

procedure TCustomDataGrid.SetFilterBox(AValue: boolean);
begin
  if (FFilterBox <> AValue) then
  begin
    FFilterBox := AValue;
    if not AValue then
      FFilterText := '';
    FNeedsFullRender := True;
    Changed;
  end;
end;

function TCustomDataGrid.HandleWindowResize(AEvent: TJSEvent): boolean;
var
  VNewState: string;
  VColIndex: Integer;
  VCol: TDataColumn;
  VViewW: Integer;
  VNeedsUpdate: Boolean;
begin
  VNeedsUpdate := False;
  VViewW := GetViewportWidth;
  // Check card/table breakpoint
  if FResponsiveBreakpoint > 0 then begin
    asm
      var card = VViewW < this.FResponsiveBreakpoint;
      if (card !== this.FIsCardVisible) {
        this.FIsCardVisible = card;
        VNeedsUpdate = true;
      }
    end;
  end;
  // Check responsive column visibility
  VNewState := '';
  for VColIndex := 0 to (FColumns.Count - 1) do begin
    VCol := FColumns[VColIndex];
    if IsColumnVisibleAtWidth(VCol, VViewW) then
      VNewState := VNewState + '1'
    else
      VNewState := VNewState + '0';
  end;
  if VNewState <> FLastResponsiveState then begin
    FLastResponsiveState := VNewState;
    VNeedsUpdate := True;
  end;
  if VNeedsUpdate then begin
    FNeedsFullRender := True;
    Changed;
  end;
  Result := True;
end;

function TCustomDataGrid.HandleFilterInput(AEvent: TJSEvent): boolean;
begin
  Result := True;
  AEvent.stopPropagation;
  FFilterText := TJSHTMLInputElement(AEvent.target).value;
  if Assigned(FDataTable) and (FFilterText <> FDataTable.FilterText) then
  begin
    FDataTable.FilterText := FFilterText;
    if FFilterTimer <> 0 then
      window.clearTimeout(FFilterTimer);
    FFilterTimer := window.setTimeout(
      procedure begin
        FFilterTimer := 0;
        if Assigned(FDataTable) then
          FDataTable.Load;
      end,
      300
    );
  end;
  Changed;
end;

function TCustomDataGrid.FilterMatchesRow(AObject: TJSObject): boolean;
var
  VColIdx: NativeInt;
  VCol: TDataColumn;
  VVal: JSValue;
  VStr: string;
begin
  Result := True;
  if FFilterText = '' then Exit;
  for VColIdx := 0 to FColumns.Count - 1 do begin
    VCol := FColumns[VColIdx];
    if VCol.Name = '' then continue;
    VVal := AObject[VCol.Name];
    if (GetValueType(VVal) = jvtString) then begin
      VStr := LowerCase(String(VVal));
      if Pos(LowerCase(FFilterText), VStr) > 0 then Exit;
    end;
  end;
  Result := False;
end;

function TCustomDataGrid.GetViewportWidth: Integer;
begin
  Result := window.innerWidth;
end;

function TCustomDataGrid.IsColumnVisibleAtWidth(const AColumn: TDataColumn; AWidth: Integer): boolean;
begin
  Result := AColumn.Visible;
  if not Result then Exit;
  if (AColumn.ResponsiveMinWidth > 0) and (AWidth < AColumn.ResponsiveMinWidth) then Result := False;
  if (AColumn.ResponsiveMaxWidth > 0) and (AWidth > AColumn.ResponsiveMaxWidth) then Result := False;
end;

procedure TCustomDataGrid.KeyDown(var Key: NativeInt; Shift: TShiftState);
begin
  inherited KeyDown(Key, Shift);
  case Key of
    33: begin NavigatePageUp; Key := 0; end;
    34: begin NavigatePageDown; Key := 0; end;
    35: begin NavigateEnd; Key := 0; end;
    36: begin NavigateHome; Key := 0; end;
    37: begin NavigateLeft; Key := 0; end;
    38: begin NavigateUP; Key := 0; end;
    39: begin NavigateRight; Key := 0; end;
    40: begin NavigateDown; Key := 0; end;
  end;
end;

procedure TCustomDataGrid.DoEnter;
begin
   inherited DoEnter;
   if (not Assigned(FActiveCell)) then begin
      FActiveCell := SelectCell(0, 0);
      if (Assigned(FActiveCell)) then FActiveCell.Click;
   end;
end;

procedure TCustomDataGrid.CellClick(ACol, ARow: NativeInt);
begin
   if (Assigned(FOnCellClick)) then
     FOnCellClick(Self, ACol, ARow);
end;

procedure TCustomDataGrid.HeaderClick(ACol: NativeInt);
var
  VCol: TDataColumn;
begin
  if (FColumnClickSorts) then
  begin
    if (FSortColumn = ACol) then
    begin
      if (FSortOrder = soAscending) then FSortOrder := soDescending
      else FSortOrder := soAscending;
    end
    else FSortOrder := soAscending;
    FSortColumn := ACol;

    if Assigned(FDataTable) and (FDataTable.LoadedRecords < FDataTable.TotalRecords) and
       FColumns.HasIndex(ACol) then
    begin
      VCol := FColumns[ACol];
      FDataTable.SortField := VCol.Name;
      if FSortOrder = soAscending then
        FDataTable.SortDir := 'asc'
      else
        FDataTable.SortDir := 'desc';
      FNeedsFullRender := True;
      FDataTable.Load;
    end
    else
      Sort;
  end;
  if (Assigned(FOnHeaderClick)) then FOnHeaderClick(Self, ACol);
end;

function TCustomDataGrid.CompareCells(A, B: JSValue): NativeInt;
var
  VColumn: TDataColumn;
  VValueA, VValueB: JSValue;
begin
  Result := 0;
  if (FColumns.HasIndex(FSortColumn)) then
  begin
    VColumn := FColumns[FSortColumn];
    if (Assigned(VColumn)) and (Assigned(A)) and (Assigned(B)) and (A is TJSObject) and (B is TJSObject) then
    begin
      VValueA := TJSObject(A)[VColumn.Name];
      VValueB := TJSObject(B)[VColumn.Name];
      if (FSortOrder = soAscending) then Result := CompareValues(VValueA, VValueB)
      else Result := CompareValues(VValueB, VValueA);
    end;
  end;
end;

procedure TCustomDataGrid.Sort;
  var VObj: TJSObject;
      VColIdx: NativeInt;
      VCol: TDataColumn;
begin
   if (Assigned(FData)) then begin
      FData.Sort(@CompareCells);
   end else if (Assigned(FDataJSon)) and (FDataJSon.Active) then begin
      FData := TJSArray.new;
      FDataJSon.First;
      while not FDataJSon.Eof do begin
        VObj := TJSObject.new;
        for VColIdx := 0 to FColumns.Count - 1 do begin
          VCol := FColumns[VColIdx];
          VObj[VCol.Name] := FDataJSon.FieldByName(VCol.Name).AsString;
        end;
        FData.push(VObj);
        FDataJSon.Next;
      end;
      FData.Sort(@CompareCells);
   end;
   FNeedsFullRender := True;
   Changed;
end;

procedure TCustomDataGrid.NavigateDown;
var
  VCell: TJSHTMLTableCellElement;
  VRow: TJSHTMLTableRowElement;
begin
  if (Assigned(FActiveCell)) and (Assigned(FActiveCell.ParentElement)) then
  begin
    VRow := TJSHTMLTableRowElement(FActiveCell.ParentElement.NextElementSibling);
    if (Assigned(VRow)) and (VRow.ChildNodes.Length > 0) then
    begin
      VCell := TJSHTMLTableCellElement(VRow.ChildNodes[FActiveCell.CellIndex]);
      if (Assigned(VCell)) then
      begin
        VCell.Click;
        ScrollCellIntoView(VCell);
      end;
    end;
  end;
end;

procedure TCustomDataGrid.NavigateUp;
var
  VCell: TJSHTMLTableCellElement;
  VRow: TJSHTMLTableRowElement;
begin
  if (Assigned(FActiveCell)) and (Assigned(FActiveCell.ParentElement)) then
  begin
    VRow := TJSHTMLTableRowElement(FActiveCell.ParentElement.PreviousElementSibling);
    if (Assigned(VRow)) and (VRow.ChildNodes.Length > 0) then
    begin
      VCell := TJSHTMLTableCellElement(VRow.ChildNodes[FActiveCell.CellIndex]);
      if (Assigned(VCell)) then
      begin
        VCell.Click;
        ScrollCellIntoView(VCell);
      end;
    end;
  end;
end;

procedure TCustomDataGrid.NavigateLeft;
var
  VCell: TJSHTMLTableCellElement;
begin
  if (Assigned(FActiveCell)) then
  begin
    VCell := TJSHTMLTableCellElement(FActiveCell.PreviousElementSibling);
    if (Assigned(VCell)) then
    begin
      VCell.Click;
      ScrollCellIntoView(VCell);
    end;
  end;
end;

procedure TCustomDataGrid.NavigateRight;
var
  VCell: TJSHTMLTableCellElement;
begin
  if (Assigned(FActiveCell)) then
  begin
    VCell := TJSHTMLTableCellElement(FActiveCell.NextElementSibling);
    if (Assigned(VCell)) then
    begin
      VCell.Click;
      ScrollCellIntoView(VCell);
    end;
  end;
end;

procedure TCustomDataGrid.NavigateEnd;
var
  VBody: TJSHTMLTableSectionElement;
  VCell: TJSHTMLTableCellElement;
  VRow: TJSHTMLTableRowElement;
begin
  if (Assigned(FActiveCell)) then
  begin
    VBody := TJSHTMLTableSectionElement(HandleElement.QuerySelector('tbody'));
    if (Assigned(VBody)) and (VBody.Rows.Length > 0) then
    begin
      VRow := TJSHTMLTableRowElement(VBody.Rows[VBody.Rows.Length - 1]);
      if (Assigned(VRow)) and (VRow.ChildNodes.Length > 0) then
      begin
        VCell := TJSHTMLTableCellElement(VRow.ChildNodes[FActiveCell.CellIndex]);
        if (Assigned(VCell)) then
        begin
          VCell.Click;
          ScrollCellIntoView(VCell);
        end;
      end;
    end;
  end;
end;

procedure TCustomDataGrid.NavigateHome;
var
  VBody: TJSHTMLTableSectionElement;
  VCell: TJSHTMLTableCellElement;
  VRow: TJSHTMLTableRowElement;
begin
  if (Assigned(FActiveCell)) then
  begin
    VBody := TJSHTMLTableSectionElement(HandleElement.QuerySelector('tbody'));
    if (Assigned(VBody)) and (VBody.Rows.Length > 0) then
    begin
      VRow := TJSHTMLTableRowElement(VBody.Rows[0]);
      if (Assigned(VRow)) and (VRow.ChildNodes.Length > 0) then
      begin
        VCell := TJSHTMLTableCellElement(VRow.ChildNodes[FActiveCell.CellIndex]);
        if (Assigned(VCell)) then
        begin
          VCell.Click;
          ScrollCellIntoView(VCell);
        end;
      end;
    end;
  end;
end;

procedure TCustomDataGrid.NavigatePageDown;
var
  VBody: TJSHTMLTableSectionElement;
  VRow: TJSHTMLTableRowElement;
  VCell: TJSHTMLTableCellElement;
  VRowHeight, VPageRows, VTargetIdx: NativeInt;
  VCurrentIdx: NativeInt;
begin
  if not Assigned(FActiveCell) then Exit;
  VBody := TJSHTMLTableSectionElement(HandleElement.QuerySelector('tbody'));
  if not Assigned(VBody) or (VBody.Rows.Length = 0) then Exit;

  VRow := TJSHTMLTableRowElement(FActiveCell.ParentElement);
  VRowHeight := IfThen(FDefRowHeight > 0, FDefRowHeight, CalcDefaultRowHeight);
  asm VPageRows = Math.floor(VBody.clientHeight / VRowHeight); end;
  if VPageRows < 1 then VPageRows := 1;

  VCurrentIdx := VRow.sectionRowIndex;
  VTargetIdx := VCurrentIdx + VPageRows;
  if VTargetIdx >= VBody.Rows.Length then
    VTargetIdx := VBody.Rows.Length - 1;

  VRow := TJSHTMLTableRowElement(VBody.Rows[VTargetIdx]);
  if Assigned(VRow) and (VRow.ChildNodes.Length > 0) then
  begin
    VCell := TJSHTMLTableCellElement(VRow.ChildNodes[FActiveCell.CellIndex]);
    if Assigned(VCell) then
    begin
      VCell.Click;
      ScrollCellIntoView(VCell);
    end;
  end;
end;

procedure TCustomDataGrid.NavigatePageUp;
var
  VBody: TJSHTMLTableSectionElement;
  VRow: TJSHTMLTableRowElement;
  VCell: TJSHTMLTableCellElement;
  VRowHeight, VPageRows, VTargetIdx: NativeInt;
  VCurrentIdx: NativeInt;
begin
  if not Assigned(FActiveCell) then Exit;
  VBody := TJSHTMLTableSectionElement(HandleElement.QuerySelector('tbody'));
  if not Assigned(VBody) or (VBody.Rows.Length = 0) then Exit;

  VRow := TJSHTMLTableRowElement(FActiveCell.ParentElement);
  VRowHeight := IfThen(FDefRowHeight > 0, FDefRowHeight, CalcDefaultRowHeight);
  asm VPageRows = Math.floor(VBody.clientHeight / VRowHeight); end;
  if VPageRows < 1 then VPageRows := 1;

  VCurrentIdx := VRow.sectionRowIndex;
  VTargetIdx := VCurrentIdx - VPageRows;
  if VTargetIdx < 0 then VTargetIdx := 0;

  VRow := TJSHTMLTableRowElement(VBody.Rows[VTargetIdx]);
  if Assigned(VRow) and (VRow.ChildNodes.Length > 0) then
  begin
    VCell := TJSHTMLTableCellElement(VRow.ChildNodes[FActiveCell.CellIndex]);
    if Assigned(VCell) then
    begin
      VCell.Click;
      ScrollCellIntoView(VCell);
    end;
  end;
end;

procedure TCustomDataGrid.ScrollCellIntoView(ACell: TJSHTMLTableCellElement);
begin
  if not Assigned(ACell) then Exit;
  asm
    var body = this.FHandleElement.querySelector('tbody');
    var row = ACell.parentElement;
    if (body && row) {
      var rowTop = row.offsetTop;
      var rowH = row.offsetHeight;
      if (rowTop < body.scrollTop) {
        body.scrollTop = rowTop;
      } else if (rowTop + rowH > body.scrollTop + body.clientHeight) {
        body.scrollTop = rowTop + rowH - body.clientHeight;
      }
    }
  end;
end;

function TCustomDataGrid.HandleBodyScroll(AEvent: TJSEvent): boolean;
var
  VBody: TJSHTMLTableSectionElement;
  VHead: TJSHTMLTableSectionElement;
  VScrollTop, VScrollHeight, VClientHeight: Double;
begin
  VHead := TJSHTMLTableSectionElement(HandleElement.QuerySelector('thead'));
  VBody := TJSHTMLTableSectionElement(HandleElement.QuerySelector('tbody'));
  if (Assigned(VHead)) and (Assigned(VBody)) then
    VHead.ScrollLeft := VBody.ScrollLeft;

  if FInfiniteScroll and Assigned(FDataTable) and not FScrollLoading then
  begin
    if FDataTable.LoadedRecords >= FDataTable.TotalRecords then
    begin
      FScrollLoading := False;
      AEvent.StopPropagation;
      Result := True;
      Exit;
    end;
    asm
      VScrollTop = VBody.scrollTop;
      VScrollHeight = VBody.scrollHeight;
      VClientHeight = VBody.clientHeight;
    end;
    if (VScrollTop + VClientHeight >= VScrollHeight - 50) then
    begin
      FScrollLoading := True;
      FDataTable.LoadNextPage;
    end;
  end;

  AEvent.StopPropagation;
  Result := True;
end;

procedure TCustomDataGrid.Changed;
var
  VOldBody: TJSElement;
  VContainer, VFilterCard: TJSHTMLElement;
  VFilterInput: TJSHTMLInputElement;
  VIsCard: Boolean;
  VScrollPos: Double;
begin
   inherited Changed;
   if Enabled=false then exit;
   if (not IsUpdating) and not (csLoading in ComponentState) then begin
      VIsCard := (FResponsiveMode and (FResponsiveBreakpoint = 0)) or FIsCardVisible;
      if FNeedsFullRender then begin
         with HandleElement do begin
            InnerHTML := '';
            Style.SetProperty('border', '1px solid #c9c3ba');
            Style.SetProperty('border-collapse', 'collapse');
            Style.SetProperty('border-spacing', '0px');
            Style.SetProperty('outline', 'none');
         end;
         if FResponsiveMode then begin
            // Determine initial card state for breakpoint > 0
            if FResponsiveBreakpoint > 0 then
               asm this.FIsCardVisible = (window.innerWidth < this.FResponsiveBreakpoint); end;
            VIsCard := (FResponsiveBreakpoint = 0) or FIsCardVisible;
            if VIsCard then
               HandleElement.Style.SetProperty('display', 'block')
            else
               HandleElement.Style.SetProperty('display', 'table');
            asm this.FHandleElement.classList.add('dg-card'); end;
         end else begin
            HandleElement.Style.SetProperty('display', 'table');
            asm this.FHandleElement.classList.remove('dg-card'); end;
         end;
         HandleElement.setAttribute('name', Name );
         RenderTableStyle;
          if not VIsCard then
          begin
             RenderTableHead;
             asm
               var th = this.FHandleElement.querySelector('thead');
               var tb = this.FHandleElement.querySelector('tbody');
               if (th && tb) {
                 var h = th.offsetHeight;
                 tb.style.top = h + 'px';
                 tb.style.height = 'calc(100% - ' + h + 'px)';
               }
             end;
          end
         else begin
           // Card mode: filter outside container (survives body-only rebuilds)
           if FFilterBox then begin
             VFilterCard := TJSHTMLElement(Document.CreateElement('div'));
             VFilterCard.setAttribute('class', 'dg-card dg-filter-card');
             VFilterInput := TJSHTMLInputElement(Document.CreateElement('input'));
             VFilterInput.setAttribute('type', 'text');
             VFilterInput.setAttribute('placeholder', 'Filter...');
             VFilterInput.setAttribute('value', FFilterText);
             VFilterInput.AddEventListener('keyup', @HandleFilterInput);
             VFilterCard.AppendChild(VFilterInput);
             HandleElement.AppendChild(VFilterCard);
           end;
           VContainer := TJSHTMLElement(Document.CreateElement('div'));
           VContainer.setAttribute('class', 'dg-card-container');
           HandleElement.AppendChild(VContainer);
         end;
         FNeedsFullRender := False;
      end else begin
         if VIsCard then
           VOldBody := HandleElement.QuerySelector('.dg-card-container')
         else
           VOldBody := HandleElement.QuerySelector('tbody');
         if Assigned(VOldBody) then
         begin
           asm VScrollPos = VOldBody.scrollTop; end;
           HandleElement.RemoveChild(VOldBody);
         end;
         if VIsCard then begin
           VContainer := TJSHTMLElement(Document.CreateElement('div'));
           VContainer.setAttribute('class', 'dg-card-container');
           HandleElement.AppendChild(VContainer);
         end;
      end;
      if VIsCard then
         RenderCardBody
       else begin
         asm
           var sr = this.fSelRow;
           var sc = this.fSelCol;
         end;
         RenderTableBody;
         asm
           this.fSelRow = sr;
           this.fSelCol = sc;
           var th = this.FHandleElement.querySelector('thead');
           var tb = this.FHandleElement.querySelector('tbody');
           if (th && tb) {
             var h = th.offsetHeight;
             tb.style.top = h + 'px';
             tb.style.height = 'calc(100% - ' + h + 'px)';
           }
         end;
       end;
      if not VIsCard and (VScrollPos > 0) and Assigned(Body) then
      begin
        FScrollLoading := True;
        asm this.Body.scrollTop = VScrollPos; end;
        FScrollLoading := False;
      end;
      if not VIsCard then begin
         if (fSelRow >= 0) and (fSelCol >= 0) then
         begin
           FActiveCell := SelectCell(fSelCol, fSelRow);
           if Assigned(FActiveCell) then
             SetActiveCell(FActiveCell);
         end else
         begin
           FActiveCell := SelectCell(0, 0);
           if Assigned(FActiveCell) then
             SetActiveCell(FActiveCell);
         end;
      end;
   end;
   if Assigned(fOnEndDraw) then fOnEndDraw(self);
end;

function TCustomDataGrid.CreateHandleElement: TJSHTMLElement;
begin
   Result := TJSHTMLElement(Document.CreateElement('table'));
end;

procedure TCustomDataGrid.RenderTableStyle;
  function JSAlign(const AAlignment: TAlignment): string;
  begin
    case AAlignment of
      taCenter: Result := 'center';
      taLeftJustify: Result := 'left';
      taRightJustify: Result := 'right';
    end;
  end;
var
  VColumn: TDataColumn;
  VColumnIndex: NativeInt;
  VStyle: TJSHTMLElement;
  VCss: string;
  VHeight: NativeInt;
  VHeadHeight: NativeInt;
  VWidth: NativeInt;
  VVisibleIndex: NativeInt;
  VViewportWidth: Integer;
begin
  VViewportWidth := GetViewportWidth;
  VHeight := IfThen(FDefRowHeight < 0, CalcDefaultRowHeight, FDefRowHeight);
  VHeadHeight := VHeight;
  if FFilterBox then
    VHeadHeight := VHeight * 2;
  VCss := '';
  if not (FResponsiveMode and (FResponsiveBreakpoint = 0)) then begin
    VCss :=
      'thead, tbody{display: block;position: absolute;}' +
      'thead{overflow: hidden;width: calc(100% - ' + IntToStr(ScrollbarWidth) + 'px);' +
      'height: auto;}' +
      'tbody{overflow: scroll;top: ' + IntToStr(IfThen(FShowHeader, VHeadHeight, 0)) + 'px;' +
      'width: 100%;height: calc(100% - ' + IntToStr(IfThen(FShowHeader, VHeadHeight, 0)) + 'px);}';
  end;
  VVisibleIndex := 0;
  for VColumnIndex := 0 to (FColumns.Count - 1) do begin
    VColumn := FColumns[VColumnIndex];
    if (Assigned(VColumn)) and IsColumnVisibleAtWidth(VColumn, VViewportWidth) then begin
      VWidth := IfThen(VColumn.Width <= 0, FDefColWidth, VColumn.Width);
      Inc(VVisibleIndex);
      if not (FResponsiveMode and (FResponsiveBreakpoint = 0)) then
        VCss := VCss +
          'thead th:nth-child(' + IntToStr(VVisibleIndex) + '){' +
          'height:'+IntToStr(IfThen(FShowHeader, VHeight, 0))+'px;min-width:'+IntToStr(VWidth)+'px;max-width:'+IntToStr(VWidth)+'px;visibility:visible;padding:0;overflow:hidden;border:1px solid #ccc;background:#dddada;font:'+JSFont(VColumn.TitleFont)+';font-family:'+JSFontFamily(VColumn.TitleFont)+';text-align:center;text-overflow:clip;white-space:nowrap;cursor:pointer;}';
      // Skip tbody td:nth-child when responsive without breakpoint (card layout)
      if not (FResponsiveMode and (FResponsiveBreakpoint = 0)) then
        VCss := VCss +
          'tbody td:nth-child(' + IntToStr(VVisibleIndex) + '){' +
          'height:'+IntToStr(VHeight)+'px;min-width:'+IntToStr(VWidth)+'px;max-width:'+IntToStr(VWidth)+'px;visibility:visible;padding:0;overflow:hidden;border:1px solid #ccc;background-color:'+JSColor(VColumn.Color)+';font:'+JSFont(VColumn.Font)+';text-align:'+JSAlign(VColumn.Alignment)+';text-overflow:clip;white-space:nowrap;}';
    end;
  end;
  if FResponsiveMode then begin
    if (FResponsiveBreakpoint > 0) and not FIsCardVisible then begin
      // Desktop mode: @media card CSS for when viewport shrinks without re-render
      VCss := VCss + '@media (max-width: ' + IntToStr(FResponsiveBreakpoint) + 'px){';
    end;
    // Card CSS (used directly when FIsCardVisible or Breakpoint=0, inside @media otherwise)
    VCss := VCss +
      '.dg-card-container{width:100%;height:100%;overflow-y:auto;}' +
      '.dg-card{margin:0 0 2px 0;border:1px solid #ccc;border-radius:4px;overflow:hidden;}' +
      '.dg-card.dg-active{border-color:dodgerblue;box-shadow:0 0 0 1px dodgerblue;}' +
      '.dg-card div[dg-cell]{display:block;padding:1px 6px;border-bottom:1px solid #eee;text-align:left;}' +
      '.dg-card div[dg-cell]:last-child{border-bottom:none;}' +
      '.dg-label{display:inline;font-weight:bold;color:#555;margin-right:4px;cursor:pointer;}' +
      '.dg-label::after{content:":";}' +
      '.dg-value{display:inline;word-break:break-word;}';
    if (FResponsiveBreakpoint > 0) and not FIsCardVisible then
      VCss := VCss + '}';
  end;
  VCss := VCss +
    'thead .dg-filter-input{width:98%;box-sizing:border-box;padding:2px 4px;border:1px solid #ccc;border-radius:3px;margin:2px 0;}' +
    '.dg-filter-card input{width:100%;box-sizing:border-box;padding:4px 8px;border:1px solid #ccc;border-radius:4px;}';
  VStyle := TJSHTMLElement(HandleElement.AppendChild(Document.CreateElement('style')));
  VStyle.InnerHTML := VCss;
end;

procedure TCustomDataGrid.RenderTableHead;
  var VColumn: TDataColumn;
      VColumnIndex, VVisCols: NativeInt;
      VHead: TJSHTMLTableSectionElement;
      VRow, VFilterRow: TJSHTMLTableRowElement;
      VCell, VFilterCell: TJSHTMLTableCellElement;
      VFilterInput: TJSHTMLInputElement;
      VViewportWidth: Integer;
begin
   VViewportWidth := GetViewportWidth;
   VHead := TJSHTMLTableSectionElement(HandleElement.AppendChild(Document.CreateElement('thead')));
   VHead.setAttribute('name', Name + '_head' );
    if FFilterBox then begin
      VVisCols := 0;
      for VColumnIndex := 0 to (FColumns.Count - 1) do
        if IsColumnVisibleAtWidth(FColumns[VColumnIndex], VViewportWidth) then
          Inc(VVisCols);
      VFilterRow := TJSHTMLTableRowElement(VHead.AppendChild(Document.CreateElement('tr')));
      VFilterCell := TJSHTMLTableCellElement(VFilterRow.AppendChild(Document.CreateElement('th')));
      VFilterCell.setAttribute('colspan', VVisCols.ToString);
      VFilterCell.Style.SetProperty('padding', '2px 4px');
      VFilterCell.Style.SetProperty('height', 'auto');
      VFilterInput := TJSHTMLInputElement(Document.CreateElement('input'));
      VFilterInput.setAttribute('type', 'text');
      VFilterInput.setAttribute('class', 'dg-filter-input');
      VFilterInput.setAttribute('placeholder', 'Filter...');
      VFilterInput.setAttribute('value', FFilterText);
      VFilterInput.Style.SetProperty('width', '100%');
      VFilterInput.Style.SetProperty('box-sizing', 'border-box');
      VFilterInput.AddEventListener('keyup', @HandleFilterInput);
     VFilterCell.AppendChild(VFilterInput);
   end;
   VRow := TJSHTMLTableRowElement(VHead.AppendChild(Document.CreateElement('tr')));
   for VColumnIndex := 0 to (FColumns.Count - 1) do begin
      VColumn := FColumns[VColumnIndex];
      if not IsColumnVisibleAtWidth(VColumn, VViewportWidth) then continue;
      VCell := TJSHTMLTableCellElement(VRow.AppendChild(Document.CreateElement('th')));
      VCell.setAttribute('data-col', VColumnIndex.ToString);
      VCell.AddEventListener('click', @HandleHeaderClick);
      VCell.InnerHTML := RenderTableHeadCell(VColumn, VColumnIndex);
   end;
end;

function TCustomDataGrid.RenderTableCell(const AColumn: TDataColumn; const AObject: TJSObject): string;
  var VValue: JSValue;
begin
   Result := '';
   if (Assigned(AColumn)) and (AObject.HasOwnProperty(AColumn.Name)) then begin
      VValue := AObject[AColumn.Name];
      Result := FormatCellValue(AColumn, VValue);
   end;
end;

function TCustomDataGrid.FormatCellValue(const AColumn: TDataColumn; const AValue: JSValue): string;
begin
  Result := '';
  case GetValueType(AValue) of
       jvtArray, jvtObject, jvtNull: ;
       jvtBoolean: Result := BoolToStr(boolean(AValue));
       jvtInteger: Result := FloatToStr(NativeInt(AValue));
       jvtFloat:
          case AColumn.Format of
             cfDataTime: Result := FormatDateTime(AColumn.DisplayMask, extended(AValue));
             cfNumber, cfCurrency: Result := FormatFloat(IfThen(AColumn.DisplayMask <> '', AColumn.DisplayMask, '#,##0.00'), extended(AValue));
             else Result := FloatToStr(extended(AValue));
          end;
       jvtString:
          case AColumn.Format of
             cfNumber, cfCurrency: Result := FormatFloat(IfThen(AColumn.DisplayMask <> '', AColumn.DisplayMask, '#,##0.00'), StrToFloatDef(string(AValue), 0));
             cfDataTime: Result := FormatDateTime(AColumn.DisplayMask, StrToFloatDef(string(AValue), 0));
             else
               if (AColumn.DisplayMask <> '') then Result := MaskDoFormatText(AColumn.DisplayMask, string(AValue), ' ')
               else Result := string(AValue);
          end;
  end;
end;

function TCustomDataGrid.RenderTableHeadCell(const AColumn: TDataColumn; const AIndex: NativeInt): string;
begin
   Result := '';
   if (Assigned(AColumn)) then begin
      if (AIndex = FSortColumn) then Result := IfThen((FSortOrder = soAscending), '↓', '↑') + AColumn.Title
      else Result := AColumn.Title;
   end;
end;

function TCustomDataGrid.SelectCell(ACol, ARow: NativeInt): TJSHTMLTableCellElement;
  var VBody: TJSHTMLTableSectionElement;
      VIndex: NativeInt;
begin
   Result := nil;
   VBody := TJSHTMLTableSectionElement(HandleElement.QuerySelector('tbody'));
   if (Assigned(VBody)) and (VBody.Rows.Length > 0) then begin
      if (ARow < 0) then ARow := 0
      else if (ARow >= VBody.Rows.Length) then ARow := (VBody.Rows.Length - 1);
      // Try exact cell by name attribute
      Result := TJSHTMLTableCellElement(VBody.QuerySelector('[name="' + ARow.ToString + '_' + ACol.ToString + '"]'));
      if not Assigned(Result) and (VBody.Rows[ARow].ChildNodes.Length > 0) then begin
         // Fallback: use DOM index with bounds clamping
         if (ACol < 0) then ACol := 0
         else if (ACol >= VBody.Rows[ARow].ChildNodes.Length) then ACol := (VBody.Rows[ARow].ChildNodes.Length - 1);
         Result := TJSHTMLTableCellElement(VBody.Rows[ARow].ChildNodes[ACol]);
      end;
   end;
end;

procedure TCustomDataGrid.SetActiveCell(ACell: TJSHTMLTableCellElement);
begin
   if FRowSelect = false then begin
      if (Assigned(FActiveCell)) then
         FActiveCell.style.SetProperty('border', '1px solid #ccc');
      FActiveCell := ACell;
      if (Assigned(FActiveCell)) then
         FActiveCell.style.SetProperty('border', '2px solid dodgerblue');
   end Else Begin
      if (Assigned(FActiveCell)) then
         TJSHTMLTableRowElement(FActiveCell.ParentElement).style.SetProperty('border', '1px solid #ccc');
      FActiveCell := ACell;
      if (Assigned(FActiveCell)) then
         TJSHTMLTableRowElement(FActiveCell.ParentElement).style.SetProperty('border', '2px solid dodgerblue');
   end;
   if Assigned(FActiveCell) then
   begin
     fSelCol := FActiveCell.CellIndex;
     asm
       if (this.FActiveCell && this.FActiveCell.parentElement) {
         this.fSelRow = this.FActiveCell.parentElement.sectionRowIndex;
       } else {
         this.fSelRow = -1;
       }
     end;
   end;
end;

procedure TCustomDataGrid.AutomaticallyCreateColumns;
  var VColumn: TDataColumn;
      VKey: string;
      VKeys: TStringDynArray;
      VJSObject: TJSObject;
      VJSValue: JSValue;
      index : integer;
begin
   if (Assigned(FData)) and (FData.Length > 0) and (FColumns.Count = 0) and (FAutoCreateColumns) then begin
      VJSValue := FData[0];
      if (Assigned(VJSValue)) and (GetValueType(VJSValue) = jvtObject) then begin
         VJSObject := TJSObject(VJSValue);
         VKeys := TJSObject.keys(VJSObject);
         BeginUpdate;
         try
            for VKey in VKeys do begin
               VJSValue := VJSObject[VKey];
               if (Assigned(VJSValue)) then begin
                  VColumn := Self.AddColumn;
                  VColumn.Name := VKey;
                  VColumn.Title := VColumn.Name;
                  case GetValueType(VJSValue) of
                     jvtBoolean: begin VColumn.Alignment := taCenter; VColumn.Format := cfBoolean; VColumn.Width := 100; end;
                     jvtFloat, jvtInteger: begin VColumn.Alignment := taRightJustify; VColumn.Format := cfNumber; VColumn.Width := 100; end;
                     else begin VColumn.Format := cfString; VColumn.Width := 200; end;
                  end;
               end;
            end;
         finally
            EndUpdate;
         end;
      end;
   end else if (Assigned(FDataJSon) and (FColumns.Count = 0) and (FAutoCreateColumns)) then begin
      BeginUpdate;
      try
          for index:=0 to FDataJSon.FieldDefs.Count-1 do begin
            VColumn := Self.AddColumn;
            VColumn.Name := FDataJSon.FieldDefs[index].Name;
            VColumn.Title := VColumn.Name;
            VColumn.TitleFont.Style := [fsBold];
            case FDataJSon.FieldDefs[index].DataType of
               ftBoolean: begin VColumn.Alignment := taCenter; VColumn.Format := cfBoolean; VColumn.Width := 100; end;
               ftFloat, ftInteger,ftLargeInt, ftAutoInc : begin VColumn.Alignment := taRightJustify; VColumn.Format := cfNumber; VColumn.Width := 100; end;
               ftDateTime : Begin VColumn.Alignment := taRightJustify; VColumn.Format := cfDataTime; VColumn.Width := 100; end;
               else begin VColumn.Format := cfString; VColumn.Width := 200; end;
            end;
         end;
      finally
         EndUpdate;
      end;
   end;
end;

{$push}
{$hints off}
procedure TCustomDataGrid.ColumnsChanged(AColumn: TDataColumn);
begin
   FNeedsFullRender := True;
   FLastResponsiveState := '';
   Changed;
end;
{$pop}

function TCustomDataGrid.CalcDefaultRowHeight: NativeInt;
begin
   Result := Font.TextHeight('Fj') + 10;
end;

class function TCustomDataGrid.GetControlClassDefaultSize: TSize;
begin
   Result.Cx := 200;
   Result.Cy := 100;
end;

{ TCustomPagination }
procedure TCustomPagination.SetCurrentPage(AValue: NativeInt);
begin
   if (FCurrentPage <> AValue) then begin
      FCurrentPage := AValue;
      Changed;
   end;
end;

procedure TCustomPagination.SetRecordsPerPage(AValue: NativeInt);
begin
   if (FRecordsPerPage <> AValue) then begin
      FRecordsPerPage := AValue;
      Changed;
   end;
end;

procedure TCustomPagination.SetTotalRecords(AValue: NativeInt);
begin
   if (FTotalRecords <> AValue) then begin
      FTotalRecords := AValue;
      Changed;
   end;
end;

procedure TCustomPagination.PageClick(APage: NativeInt);
begin
   if (Assigned(FOnPageClick)) then begin
      FOnPageClick(Self, APage);
   end;
end;

function TCustomPagination.HandlePageClick(AEvent: TJSMouseEvent): boolean;
  var VValue: string;
begin
   VValue := AEvent.targetElement.InnerHTML;
   if (VValue <> '') then begin
      if (VValue = '«') then FCurrentPage := 1
      else if (VValue = '»') then FCurrentPage := FTotalPages
      else FCurrentPage := StrToIntDef(VValue, 1);
   end else FCurrentPage := 1;
   AEvent.StopPropagation;
   PageClick(FCurrentPage);
   Result := True;
   Changed;
end;

procedure TCustomPagination.Changed;
  var VIndex, VValue, VPageWidth: NativeInt;
      VPage: TJSHTMLElement;
      VPages: TJSArray;
begin
   inherited Changed;
   if (not IsUpdating) and not (csLoading in ComponentState) then begin
      with HandleElement do begin
         InnerHTML := '';
         Style.SetProperty('outline', 'none');
      end;
      HandleElement.setAttribute('name', Name );
      VPages := CalculatePages;
      VPageWidth := (Font.TextWidth('1000') + 10);
      if ((VPageWidth * 7) >= Width) then VPageWidth := Trunc(Width div 7);
      VPage := RenderPage('«', VPageWidth, @HandlePageClick);
      HandleElement.AppendChild(VPage);
      for VIndex := 0 to (VPages.Length - 1) do begin
         VValue := NativeInt(VPages[VIndex]);
         VPage := RenderPage(IntToStr(VValue), VPageWidth, @HandlePageClick, (VValue = FCurrentPage));
         HandleElement.AppendChild(VPage);
      end;
      VPage := RenderPage('»', VPageWidth, @HandlePageClick);
      HandleElement.AppendChild(VPage);
   end;
end;

function TCustomPagination.CreateHandleElement: TJSHTMLElement;
begin
   Result := TJSHTMLElement(Document.CreateElement('div'));
end;

function TCustomPagination.CalculatePages: TJSArray;
  var VIndex, VEnd, VStart: NativeInt;
begin
   FTotalPages := Ceil64(FTotalRecords / FRecordsPerPage);
   if (FCurrentPage < 1) then FCurrentPage := 1;
   if (FTotalPages <= 5) then begin
      VStart := 1;
      VEnd := FTotalPages;
   end else begin
      if (FCurrentPage <= 3) then begin
         VStart := 1;
         VEnd := 5;
      end else if ((FCurrentPage + 2) >= FTotalPages) then begin
         VStart := FTotalPages - 4;
         VEnd := FTotalPages;
      end else begin
         VStart := FCurrentPage - 2;
         VEnd := FCurrentPage + 2;
      end;
   end;
   if (VEnd <= VStart) then VEnd := VStart + 1;
   Result := TJSArray.New;
   for VIndex := VStart to VEnd do Result.Push(VIndex);
end;

function TCustomPagination.RenderPage(const ACaption: string; const AWidth: NativeInt; const AEvent: JSValue; const AActive: boolean): TJSHTMLElement;
begin
   Result := TJSHTMLElement(Document.CreateElement('button'));
   with Result do begin
      Style.SetProperty('height', '100%');
      Style.SetProperty('width', IntToStr(AWidth) + 'px');
      Style.SetProperty('border', '1px solid #c9c3ba');
      Style.SetProperty('background-color', IfThen(AActive, '#fff', '#dddada'));
      Style.SetProperty('outline', 'none');
      Style.SetProperty('padding', '0');
      Style.SetProperty('white-space', 'nowrap');
      AddEventListener('click', AEvent);
      InnerHTML := ACaption;
   end;
end;

{$push}
{$hints off}
function TCustomPagination.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
   Result := False;
end;
{$pop}

class function TCustomPagination.GetControlClassDefaultSize: TSize;
begin
   Result.Cx := 150;
   Result.Cy := 30;
end;

constructor TCustomPagination.Create(AOwner: TComponent);
begin
   inherited Create(AOwner);
   FCurrentPage := 1;
   FRecordsPerPage := 10;
   FTotalPages := 0;
   FTotalRecords := 0;
   BeginUpdate;
   try
      TabStop := False;
      with GetControlClassDefaultSize do begin
         SetBounds(0, 0, Cx, Cy);
      end;
   finally
      EndUpdate;
   end;
end;

end.
