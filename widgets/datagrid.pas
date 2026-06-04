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
  localjsondataset;

type

  /// Forward declaration
  TCustomDataGrid = class;

  TColumnFormat = (cfBoolean, cfDataTime, cfNumber, cfString);

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
    FRowSelect : Boolean;
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
     FTouchStartX: Double;
     FTouchStartY: Double;
     function GetColCount: NativeInt;
    function GetRowCount: NativeInt;
    procedure SetColumnClickSorts(AValue: boolean);
    procedure SetColumns(AValue: TDataColumns);
    procedure SetData(AValue: TJSArray);
    procedure SetDataJson(AValue: TLocalJSONDataset);
    procedure SetDefColWidth(AValue: NativeInt);
    procedure SetDefRowHeight(AValue: NativeInt);
    procedure SetShowHeader(AValue: boolean);
    procedure SetAlternateRowColor(AValue: TColor);
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
    function HandleBodyClick(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleBodyTouchStart(AEvent: TJSTouchEvent): boolean; virtual;
    function HandleBodyTouchEnd(AEvent: TJSTouchEvent): boolean; virtual;
    function HandleBodyScroll(AEvent: TJSEvent): boolean; virtual;
    function HandleHeaderClick(AEvent: TJSMouseEvent): boolean; virtual;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure RenderTableStyle; virtual;
    procedure RenderTableHead; virtual;
    procedure RenderTableBody; virtual;
    function RenderTableCell(const AColumn: TDataColumn; const AObject: TJSObject): string; virtual;
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
    procedure Changed; override;
    property AutoCreateColumns: boolean read FAutoCreateColumns write FAutoCreateColumns;
    property ColCount: NativeInt read GetColCount;
    property Columns: TDataColumns read FColumns write SetColumns;
    property ColumnClickSorts: boolean read FColumnClickSorts write SetColumnClickSorts;
    property Data: TJSArray read FData write SetData;
    property DataJson: TLocalJSONDataset read FDataJSon write SetDataJson;
    property DefaultColWidth: NativeInt read FDefColWidth write SetDefColWidth;
    property DefaultRowHeight: NativeInt read FDefRowHeight write SetDefRowHeight;
    property RowCount: NativeInt read GetRowCount;
    property SortColumn: NativeInt read FSortColumn;
    property SortOrder: TSortOrder read FSortOrder;
     property ShowHeader: boolean read FShowHeader write SetShowHeader;
     property AlternateRowColor: TColor read FAlternateRowColor write SetAlternateRowColor;
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
      rid, cid: string;
begin
   if not Assigned(ACell) then Exit;

   VRow := TJSHTMLTableRowElement(ACell.parentElement);
   if not Assigned(VRow) then Exit;

   cid := ACell.getAttribute('name');
   if cid=null then cid:='';

   if (cid <> '') then begin
      rid := copy(cid, 1, pos('_', cid) - 1);
      //if fCurrentRID <> rid then begin
         if Assigned(FDataJSon) then
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
         FOnCellDblClick(Self, ACell.cellIndex, VRow.rowIndex);
      end else begin
         FLastClickTime := Now;
         FLastClickCell := ACell;
         CellClick(ACell.cellIndex, VRow.rowIndex);
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
    HeaderClick(VCell.CellIndex);
  end;
  Result := True;
end;

procedure TCustomDataGrid.RenderTableBody;
  var VColumn: TDataColumn;
      VColumnIndex, VRowIndex: NativeInt;
      VRow: TJSHTMLTableRowElement;
      VCell: TJSHTMLTableCellElement;
      VObject: TJSObject;
      VValue: JSValue;
      position : TBookmark;
      Separator : String;
begin
   Body := TJSHTMLTableSectionElement(HandleElement.AppendChild(Document.CreateElement('tbody')));
   Body.setAttribute('name', Name + '_body' );

   Body.AddEventListener('scroll', @HandleBodyScroll);
   Body.AddEventListener('click', @HandleBodyClick);
   Body.AddEventListener('touchend', @HandleBodyTouchEnd);
   Body.AddEventListener('touchstart', @HandleBodyTouchStart);
   if Assigned(fontouchmove) then Body.AddEventListener('touchmove', fontouchmove);
   if Assigned(fontouchcancel) then Body.AddEventListener('touchcancel', fontouchcancel);

   if (Assigned(FData)) then begin
      for VRowIndex := 0 to (FData.Length - 1) do begin
         VValue := FData[VRowIndex];
         if (Assigned(VValue)) and (IsObject(VValue)) then
         begin
            VObject := TJSObject(VValue);
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
               VCell := TJSHTMLTableCellElement(VRow.AppendChild(Document.CreateElement('td')));
               VCell.setAttribute('name', VRowIndex.ToString + '_' + VColumnIndex.ToString);
               if (VRowIndex mod 2)=0 then
                  VCell.Style.SetProperty('background-color', JSColor(FAlternateRowColor));
               VCell.InnerHTML := RenderTableCell(VColumn, VObject);
               if (Assigned(fOnDrawColumnCell)) then
                  fOnDrawColumnCell(self, VColumn.Name, VCell);
            end;
         end;
      end;
   end else if Assigned(FDataJSon) then Begin
      if FDataJSon.Active then position := FDataJSon.GetBookmark;
      FDataJSon.First;
      VRowIndex:=0;
      while not FDataJSon.eof do begin

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
            VCell := TJSHTMLTableCellElement(VRow.AppendChild(Document.CreateElement('td')));
            VCell.setAttribute('name', VRowIndex.ToString + '_' + VColumnIndex.ToString);
            if (VRowIndex mod 2)=0 then
               VCell.Style.SetProperty('background-color', JSColor(FAlternateRowColor));
            VCell.InnerHTML := FDataJSon.FieldByName(VColumn.name).AsString;
            if (Assigned(fOnDrawColumnCell)) then
               fOnDrawColumnCell(self, VColumn.Name, VCell);
            if FDataJSon.Active and (FDataJSon.GetBookmark=position) then
               SetActiveCell(VCell);
         end;
         FDataJSon.Next;
         inc(VRowIndex);
      end;
      if FDataJSon.Active then FDataJSon.GotoBookmark(position);
   end;
end;

constructor TCustomDataGrid.Create(AOwner: TComponent);
begin
   inherited Create(AOwner);
   FColumns := TDataColumns.Create(Self);
   FActiveCell := nil;
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
   FTouchStartX := 0;
   FTouchStartY := 0;
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
         AutomaticallyCreateColumns;
      finally
         EndUpdate;
      end;
   end else changed;
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

procedure TCustomDataGrid.KeyDown(var Key: NativeInt; Shift: TShiftState);
begin
  inherited KeyDown(Key, Shift);
  case Key of
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
begin
   if (Assigned(FData)) then begin
      FData.Sort(@CompareCells);
      Changed;
   end;
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
      if (Assigned(VCell)) then VCell.Click;
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
      if (Assigned(VCell)) then VCell.Click;
    end;
  end;
end;

procedure TCustomDataGrid.NavigateLeft;
var
  VColumnn: TDataColumn;
  VCell: TJSHTMLTableCellElement;
  VRow: TJSHTMLTableRowElement;
  VIndex: NativeInt;
begin
  if (Assigned(FActiveCell)) then
  begin
    VRow := TJSHTMLTableRowElement(FActiveCell.ParentElement);
    if (Assigned(VRow)) and (VRow.ChildNodes.Length > 0) then
    begin
      for VIndex := (FActiveCell.CellIndex - 1) downto 0 do
      begin
        VCell := TJSHTMLTableCellElement(VRow.ChildNodes[VIndex]);
        if (Assigned(VCell)) and (FColumns.HasIndex(VIndex)) then
        begin
          VColumnn := FColumns[VIndex];
          if (Assigned(VColumnn)) and (VColumnn.Visible) then
          begin
            VCell.Click;
            Exit;
          end;
        end;
      end;
    end;
  end;
end;

procedure TCustomDataGrid.NavigateRight;
var
  VColumnn: TDataColumn;
  VCell: TJSHTMLTableCellElement;
  VRow: TJSHTMLTableRowElement;
  VIndex: NativeInt;
begin
  if (Assigned(FActiveCell)) then
  begin
    VRow := TJSHTMLTableRowElement(FActiveCell.ParentElement);
    if (Assigned(VRow)) and (VRow.ChildNodes.Length > 0) then
    begin
      for VIndex := (FActiveCell.CellIndex + 1) to (VRow.ChildNodes.Length - 1) do
      begin
        VCell := TJSHTMLTableCellElement(VRow.ChildNodes[VIndex]);
        if (Assigned(VCell)) and (FColumns.HasIndex(VIndex)) then
        begin
          VColumnn := FColumns[VIndex];
          if (Assigned(VColumnn)) and (VColumnn.Visible) then
          begin
            VCell.Click;
            Exit;
          end;
        end;
      end;
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
        if (Assigned(VCell)) then VCell.Click;
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
        if (Assigned(VCell)) then VCell.Click;
      end;
    end;
  end;
end;

function TCustomDataGrid.HandleBodyScroll(AEvent: TJSEvent): boolean;
var
  VBody: TJSHTMLTableSectionElement;
  VHead: TJSHTMLTableSectionElement;
begin
  VHead := TJSHTMLTableSectionElement(HandleElement.QuerySelector('thead'));
  VBody := TJSHTMLTableSectionElement(HandleElement.QuerySelector('tbody'));
  if (Assigned(VHead)) and (Assigned(VBody)) then
    VHead.ScrollLeft := VBody.ScrollLeft;
  AEvent.StopPropagation;
  Result := True;
end;

procedure TCustomDataGrid.Changed;
var
  VOldBody: TJSElement;
begin
   inherited Changed;
   if Enabled=false then exit;
   if (not IsUpdating) and not (csLoading in ComponentState) then begin
      if FNeedsFullRender then begin
         with HandleElement do begin
            InnerHTML := '';
            Style.SetProperty('border', '1px solid #c9c3ba');
            Style.SetProperty('border-collapse', 'collapse');
            Style.SetProperty('border-spacing', '0px');
            Style.SetProperty('outline', 'none');
         end;
         HandleElement.setAttribute('name', Name );
         RenderTableStyle;
         RenderTableHead;
         FNeedsFullRender := False;
      end else begin
         VOldBody := HandleElement.QuerySelector('tbody');
         if Assigned(VOldBody) then
            HandleElement.RemoveChild(VOldBody);
      end;
      RenderTableBody;
      if (Focused) then begin
         FActiveCell := SelectCell(FSortColumn, 0);
         if (Assigned(FActiveCell)) then FActiveCell.Click;
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
  VWidth: NativeInt;
begin
  VHeight := IfThen(FDefRowHeight < 0, CalcDefaultRowHeight, FDefRowHeight);
  VCss :=
    'thead, tbody{display: block;position: absolute;}' +
    'thead{overflow: hidden;width: calc(100% - ' + IntToStr(ScrollbarWidth) + 'px);' +
    'height: ' + IntToStr(IfThen(FShowHeader, VHeight, 0)) + 'px;}' +
    'tbody{overflow: scroll;top: ' + IntToStr(IfThen(FShowHeader, VHeight, 0)) + 'px;' +
    'width: 100%;height: calc(100% - ' + IntToStr(IfThen(FShowHeader, VHeight, 0)) + 'px);}';
  for VColumnIndex := 0 to (FColumns.Count - 1) do begin
    VColumn := FColumns[VColumnIndex];
    if (Assigned(VColumn)) then begin
      VWidth := IfThen(VColumn.Width <= 0, FDefColWidth, VColumn.Width);
      VCss := VCss +
        'thead th:nth-child(' + IntToStr(VColumnIndex + 1) + '){' +
        'height:'+IntToStr(IfThen(FShowHeader, VHeight, 0))+'px;min-width:'+IntToStr(IfThen(VColumn.Visible,VWidth,0))+'px;max-width:'+IntToStr(IfThen(VColumn.Visible,VWidth,0))+'px;visibility:'+IfThen(VColumn.Visible,'visible','hidden')+';padding:0;overflow:hidden;border:'+IntToStr(IfThen(VColumn.Visible,1,0))+'px solid #ccc;background:#dddada;font:'+JSFont(VColumn.TitleFont)+';font-family:'+JSFontFamily(VColumn.TitleFont)+';text-align:center;text-overflow:clip;white-space:nowrap;cursor:pointer;}';
      VCss := VCss +
        'tbody td:nth-child(' + IntToStr(VColumnIndex + 1) + '){' +
        'height:'+IntToStr(VHeight)+'px;min-width:'+IntToStr(IfThen(VColumn.Visible,VWidth,0))+'px;max-width:'+IntToStr(IfThen(VColumn.Visible,VWidth,0))+'px;visibility:'+IfThen(VColumn.Visible,'visible','hidden')+';padding:0;overflow:hidden;border:'+IntToStr(IfThen(VColumn.Visible,1,0))+'px solid #ccc;background-color:'+JSColor(VColumn.Color)+';font:'+JSFont(VColumn.Font)+';text-align:'+JSAlign(VColumn.Alignment)+';text-overflow:clip;white-space:nowrap;}';
    end;
  end;
  VStyle := TJSHTMLElement(HandleElement.AppendChild(Document.CreateElement('style')));
  VStyle.InnerHTML := VCss;
end;

procedure TCustomDataGrid.RenderTableHead;
  var VColumn: TDataColumn;
      VColumnIndex: NativeInt;
      VHead: TJSHTMLTableSectionElement;
      VRow: TJSHTMLTableRowElement;
      VCell: TJSHTMLTableCellElement;
begin
   VHead := TJSHTMLTableSectionElement(HandleElement.AppendChild(Document.CreateElement('thead')));
   VHead.setAttribute('name', Name + '_head' );
   VRow := TJSHTMLTableRowElement(VHead.AppendChild(Document.CreateElement('tr')));
   for VColumnIndex := 0 to (FColumns.Count - 1) do begin
      VColumn := FColumns[VColumnIndex];
      VCell := TJSHTMLTableCellElement(VRow.AppendChild(Document.CreateElement('th')));
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
      case GetValueType(VValue) of
           jvtArray, jvtObject, jvtNull: ;
           jvtBoolean: Result := BoolToStr(boolean(VValue));
           jvtInteger: Result := FloatToStr(NativeInt(VValue));
           jvtFloat:
              case AColumn.Format of
                 cfDataTime: Result := FormatDateTime(AColumn.DisplayMask, extended(VValue));
                 cfNumber: Result := FormatFloat(AColumn.DisplayMask, extended(VValue));
                 else Result := FloatToStr(extended(VValue));
              end;
           jvtString:
              if (AColumn.DisplayMask <> '') then Result := MaskDoFormatText(AColumn.DisplayMask, string(VValue), ' ')
              else Result := string(VValue);
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
begin
   Result := nil;
   VBody := TJSHTMLTableSectionElement(HandleElement.QuerySelector('tbody'));
   if (Assigned(VBody)) and (VBody.Rows.Length > 0) and (VBody.Rows[0].HasChildNodes) then begin
      if (ARow < 0) then ARow := 0
      else if (ARow >= VBody.Rows.Length) then ARow := (VBody.Rows.Length - 1);
      if (ACol < 0) then ACol := 0
      else if (ACol >= VBody.Rows[0].ChildNodes.Length) then ACol := (VBody.Rows[0].ChildNodes.Length - 1);
      Result := TJSHTMLTableCellElement(VBody.Rows[ARow].ChildNodes[ACol]);
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
         for index:=0 to FDataJSon.FieldCount-1 do begin
            VColumn := Self.AddColumn;
            VColumn.Name := FDataJSon.FieldDefs[index].Name;
            VColumn.Title := VColumn.Name;
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
