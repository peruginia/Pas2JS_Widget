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
unit ExtCtrls;

{$I pas2js_widget.inc}

interface

uses
  JS,
  Classes,
  SysUtils,
  Types,
  Web,
  WebExtra,
  Graphics,
  Controls;

type

  { TCustomImage }

  TCustomImage = class(TCustomControl)
  private
    FCenter: boolean;
    FPicture: TPicture;
    FProportional: boolean;
    FStretch: boolean;
    FOnPictureChanged: TNotifyEvent;

    // Touch
    fOntouchStart: TJSTouchEventHandler;
    fOntouchMove: TJSTouchEventHandler;
    fOntouchCancel: TJSTouchEventHandler;
    fOntouchEnd: TJSTouchEventHandler;

    FStretchInEnabled: boolean;
    FStretchOutEnabled: boolean;
    FTransparent: boolean;
    FURL: String;
    FLastTouchTime: TDateTime;
    FZoomLevel: Integer;
    FZoomEnabled: boolean;
    FZoomX: Double;
    FZoomY: Double;
    FInitialZoom: Integer;
    FIsDragging: Boolean;
    FStartX, FStartY: double;
    FInitialDist: Double;

    procedure SetCenter(AValue: boolean);
    procedure SetPicture(AValue: TPicture);
    procedure SetProportional(AValue: boolean);
    procedure SetStretch(AValue: boolean);
    procedure SetStretchInEnabled(AValue: boolean);
    procedure SetStretchOutEnabled(AValue: boolean);
    procedure SetTransparent(AValue: boolean);
    procedure SetURL(AValue: String);
    procedure SetZoomLevel(AValue: Integer);
    procedure SetZoomX(AValue: Double);
    procedure SetZoomY(AValue: Double);
    procedure SetZoomEnabled(AValue: boolean);

    //Touch
    procedure SetOntouchStart(AValue : TJSTouchEventHandler);
    procedure SetOntouchMove(AValue : TJSTouchEventHandler);
    procedure SetOntouchCancel(AValue : TJSTouchEventHandler);
    procedure SetOntouchEnd(AValue : TJSTouchEventHandler);

    // Gestione interna touch e mouse per zoom/drag
    function HandleMouseDown(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleMouseMove(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleMouseUp(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleTouchStart(AEvent: TJSTouchEvent): boolean;
    function HandleTouchEnd(AEvent: TJSTouchEvent): boolean;
    function HandleTouchMove(AEvent: TJSTouchEvent): boolean;
    function HandleTouchCancel(AEvent: TJSTouchEvent): boolean;


  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    function CheckChildClassAllowed(AChildClass: TClass): boolean; override;
    procedure PictureChanged(Sender: TObject); virtual;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    property Center: boolean read FCenter write SetCenter default False;
    property Picture: TPicture read FPicture write SetPicture;
    property Proportional: boolean read FProportional write SetProportional default False;
    property Stretch: boolean read FStretch write SetStretch default False;
    property StretchOutEnabled: boolean read FStretchOutEnabled write SetStretchOutEnabled default True;
    property StretchInEnabled: boolean read FStretchInEnabled write SetStretchInEnabled default True;
    property Transparent: boolean read FTransparent write SetTransparent default False;
    property URL: String read FURL write SetURL;
    property ZoomLevel: Integer read FZoomLevel write SetZoomLevel default 100;
    property ZoomEnabled: boolean read FZoomEnabled write SetZoomEnabled default True;
    property ZoomX: Double read FZoomX write SetZoomX default 50;
    property ZoomY: Double read FZoomY write SetZoomY default 50;
     property OnPictureChanged: TNotifyEvent read FOnPictureChanged write FOnPictureChanged;
     //Touch
     property OnTouchStart: TJSTouchEventHandler read fOntouchStart write SetOntouchStart;
     property OnTouchMove: TJSTouchEventHandler read fOntouchMove write SetOntouchMove;
     property OnTouchCancel: TJSTouchEventHandler read fOntouchCancel write SetOnTouchCancel;
     property OnTouchEnd: TJSTouchEventHandler read fOntouchEnd write SetOntouchEnd;

  end;

  TPanelBevel = TBevelCut;
  TBevelWidth = 1..Maxint;

  { TCustomPanel }

  TCustomPanel = class(TCustomControl)
  private
    FAlignment: TAlignment;
    FBevelColor: TColor;
    FBevelInner: TPanelBevel;
    FBevelOuter: TPanelBevel;
    FBevelWidth: TBevelWidth;
    FLayout: TTextLayout;
    FWordWrap: boolean;
    FScrollvertical, fScrollHorizontal : Boolean;

    // Touch
    fOntouchStart: TJSTouchEventHandler;
    fOntouchMove: TJSTouchEventHandler;
    fOntouchCancel: TJSTouchEventHandler;
    fOntouchEnd: TJSTouchEventHandler;

    procedure SetAlignment(AValue: TAlignment);
    procedure SetBevelColor(AValue: TColor);
    procedure SetBevelInner(AValue: TPanelBevel);
    procedure SetBevelOuter(AValue: TPanelBevel);
    procedure SetBevelWidth(AValue: TBevelWidth);
    procedure SetLayout(AValue: TTextLayout);
    procedure SetWordWrap(AValue: boolean);
    procedure SetScrollableHorizontal(AValue: boolean);
    procedure SetScrollableVertical(AValue: boolean);

    //Touch
    procedure SetOntouchStart(AValue : TJSTouchEventHandler);
    procedure SetOntouchMove(AValue : TJSTouchEventHandler);
    procedure SetOntouchCancel(AValue : TJSTouchEventHandler);
    procedure SetOntouchEnd(AValue : TJSTouchEventHandler);
  protected
    property Layout: TTextLayout read FLayout write SetLayout;
    property WordWrap: boolean read FWordWrap write SetWordWrap;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
  public
    property Alignment: TAlignment read FAlignment write SetAlignment default taCenter;
    property BevelColor: TColor read FBevelColor write SetBevelColor default clDefault;
    property BevelInner: TPanelBevel read FBevelInner write SetBevelInner default bvNone;
    property BevelOuter: TPanelBevel read FBevelOuter write SetBevelOuter default bvRaised;
    property BevelWidth: TBevelWidth read FBevelWidth write SetBevelWidth default 1;
    property ScrollVertical: boolean read FScrollVertical write SetScrollableHorizontal default false;
    property ScrollHorizontal: boolean read fScrollHorizontal write SetScrollableHorizontal default false;

    //Touch
    property OnTouchStart: TJSTouchEventHandler read fOntouchStart write SetOntouchStart;
    property OnTouchMove: TJSTouchEventHandler read fOntouchMove write SetOntouchMove;
    property OnTouchCancel: TJSTouchEventHandler read fOntouchCancel write SetOnTouchCancel;
    property OnTouchEnd: TJSTouchEventHandler read fOntouchEnd write SetOntouchEnd;
  end;

  { TCustomTimer }

  TCustomTimer = class(TComponent)
  private
    FEnabled: Boolean;
    FInterval: Cardinal;
    FTimerHandle: NativeUInt;
    FOnStartTimer: TNotifyEvent;
    FOnStopTimer: TNotifyEvent;
    FOnTimer: TNotifyEvent;
  protected
    procedure SetEnabled(AValue: Boolean); virtual;
    procedure SetInterval(AValue: Cardinal); virtual;
    procedure SetOnTimer(AValue: TNotifyEvent); virtual;
    procedure DoOnTimer; virtual;
    procedure UpdateTimer; virtual;
    procedure KillTimer; virtual;
    procedure Loaded; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    property Enabled: Boolean read FEnabled write SetEnabled default True;
    property Interval: Cardinal read FInterval write SetInterval default 1000;
    property OnTimer: TNotifyEvent read FOnTimer write SetOnTimer;
    property OnStartTimer: TNotifyEvent read FOnStartTimer write FOnStartTimer;
    property OnStopTimer: TNotifyEvent read FOnStopTimer write FOnStopTimer;
  end;

  { TCustomWebSocketClient }
  TByteArray = TJSUint8Array;

  TNotifyWebSocketMessage = procedure(aSender: TObject; aData: String) of object;
  TNotifyWebSocketBinaryMessage = procedure(aSender: TObject; aData: TBytes) of object;
  TNotifyWebSocketClose = procedure(aSender: TObject; aCode: Cardinal; aReason: String) of object;

  TCustomWebSocketClient = class(TComponent)
  private
    fConnected: Boolean;
    fOnBinaryMessage: TNotifyWebSocketBinaryMessage;
    fOnClose: TNotifyWebSocketClose;
    fOnError: TNotifyEvent;
    fOnMessage: TNotifyWebSocketMessage;
    fOnOpen: TNotifyEvent;
    fUrl: String;
    fWebSocket: TJSWebSocket;
    function WebSocketCloseHandler(aEvent: TEventListenerEvent): Boolean;
    function WebSocketErrorHandler(aEvent: TEventListenerEvent): Boolean;
    function WebSocketMessageHandler(aEvent: TEventListenerEvent): Boolean;
    function WebSocketOpenHandler(aEvent: TEventListenerEvent): Boolean;
    function WebSocketReaderHandler(aEvent: TEventListenerEvent): Boolean;
    procedure SetUrl(aValue: String);
  public
    destructor Destroy; override;
    procedure Connect;
    procedure Close; overload;
    procedure Close(aCode: Cardinal); overload;
    procedure Close(aCode: Cardinal; aReason: String); overload;
    procedure Send(aData: String);
  public
    property Connected: Boolean read fConnected;
    property Url: String read fUrl write SetUrl;
    property OnBinaryMessage: TNotifyWebSocketBinaryMessage read fOnBinaryMessage write fOnBinaryMessage;
    property OnClose: TNotifyWebSocketClose read fOnClose write fOnClose;
    property OnError: TNotifyEvent read fOnError write fOnError;
    property OnMessage: TNotifyWebSocketMessage read fOnMessage write fOnMessage;
    property OnOpen: TNotifyEvent read fOnOpen write fOnOpen;
  end;

  { TCustomGroupBox }

  TCustomGroupBox = class(TCustomControl)
  private
    FLegendElement: TJSHTMLElement;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
  end;

  { TCustomTrackBar }

  TTrackBarOrientation = (trHorizontal, trVertical);

  TCustomTrackBar = class(TCustomControl)
  private
    FMax: Integer;
    FMin: Integer;
    FFrequency: Integer;
    FOrientation: TTrackBarOrientation;
    FPosition: Integer;
    FOnChange: TNotifyEvent;
    procedure SetMax(AValue: Integer);
    procedure SetMin(AValue: Integer);
    procedure SetOrientation(AValue: TTrackBarOrientation);
    procedure SetPosition(AValue: Integer);
    function HandleChange(AEvent: TJSEvent): boolean;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    property Max: Integer read FMax write SetMax default 100;
    property Min: Integer read FMin write SetMin default 0;
    property Frequency: Integer read FFrequency write FFrequency default 1;
    property Orientation: TTrackBarOrientation read FOrientation write SetOrientation default trHorizontal;
    property Position: Integer read FPosition write SetPosition default 0;
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
  end;

  { TCustomColorPicker }

  TCustomColorPicker = class(TCustomControl)
  private
    FColor: TColor;
    FOnChange: TNotifyEvent;
    procedure SetColor(AValue: TColor);
    function HandleChange(AEvent: TJSEvent): boolean;
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    property Color: TColor read FColor write SetColor default clBlack;
    property OnChange: TNotifyEvent read FOnChange write FOnChange;
  end;

  { TCustomScrollBox }

  TCustomScrollBox = class(TCustomControl)
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
  end;

  { TCustomProgressBar }

  TCustomProgressBar = class(TCustomControl)
  private
    FMax: NativeInt;
    FMin: NativeInt;
    FValue: NativeInt;
    procedure SetMax(AValue: NativeInt);
    procedure SetMin(AValue: NativeInt);
    procedure SetValue(AValue: NativeInt);
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    property Max: NativeInt read FMax write SetMax default 100;
    property Min: NativeInt read FMin write SetMin default 0;
    property Value: NativeInt read FValue write SetValue default 0;
  end;

implementation

uses
  WCLStrConsts;

{ TCustomWebSocketClient }

function TCustomWebSocketClient.WebSocketMessageHandler(aEvent: TEventListenerEvent): Boolean;
var
  reader: TJSFileReader;
  Data: TJSUint8Array;
begin
    if aEvent._type <> 'message' then
      Exit;
    case GetValueType(TJSMessageEvent(aEvent).Data) of
      jvtString:
        if Assigned(OnMessage) then
          OnMessage(Self, String(TJSMessageEvent(aEvent).Data));
      jvtObject:
        if Assigned(OnBinaryMessage) then begin
          reader := TJSFileReader.new;
          reader.readAsArrayBuffer(TJSBlob(TJSMessageEvent(aEvent).Data));
          reader.addEventListener('loadend', @WebSocketReaderHandler);
        end;
    end;
end;

function TCustomWebSocketClient.WebSocketCloseHandler(aEvent: TEventListenerEvent): Boolean;
begin
  if Assigned(OnClose) then
    OnClose(Self, TJSCloseEvent(aEvent).code, TJSCloseEvent(aEvent).reason);
end;

function TCustomWebSocketClient.WebSocketErrorHandler(aEvent: TEventListenerEvent): Boolean;
begin
  Close;
  if Assigned(OnError) then
    OnError(Self);
end;

function TCustomWebSocketClient.WebSocketOpenHandler(aEvent: TEventListenerEvent): Boolean;
begin
  fConnected := True;
  if Assigned(OnOpen) then
    OnOpen(Self);
end;

function TCustomWebSocketClient.WebSocketReaderHandler(aEvent: TEventListenerEvent): Boolean;
var
  Data: TJSUint8Array;
  ByteArray: TBytes;
  i: Integer;
begin
  Data := TJSUint8Array.new(TJSArrayBuffer(TJSFileReader(aEvent.target).Result));
  SetLength(ByteArray, Data.length);
  for i := 0 to Data.length - 1 do
    ByteArray[i] := Data[i];
  OnBinaryMessage(Self, ByteArray);
end;

procedure TCustomWebSocketClient.SetUrl(aValue: String);
begin
  fConnected := False;
  fUrl := aValue;
end;

destructor TCustomWebSocketClient.Destroy;
begin
  Close;
  inherited Destroy;
end;

procedure TCustomWebSocketClient.Connect;
begin
  Close;
  fWebSocket := TJSWebSocket.new(Url);
  fWebSocket.onmessage := @WebSocketMessageHandler;
  fWebSocket.onopen := @WebSocketOpenHandler;
  fWebSocket.onclose := @WebSocketCloseHandler;
  fWebSocket.onerror := @WebSocketErrorHandler;
end;

procedure TCustomWebSocketClient.Close;
begin
  Close(WS_NORMAL_CLOSURE, '');
end;

procedure TCustomWebSocketClient.Close(aCode: Cardinal);
begin
  Close(aCode, '');
end;

procedure TCustomWebSocketClient.Close(aCode: Cardinal; aReason: String);
begin
  if Assigned(fWebSocket) then begin
    fWebSocket.close(aCode, aReason);
    fWebSocket := nil;
  end;
  fConnected := False;
end;


procedure TCustomWebSocketClient.Send(aData: String);
begin
  if not Connected then
    raise Exception.Create('The WebSocket does not connected');
  fWebSocket.send(aData);
end;

{ TCustomTimer }

procedure TCustomTimer.SetEnabled(AValue: Boolean);
begin
  if FEnabled = AValue then
    Exit;
  FEnabled := AValue;
  UpdateTimer;
end;

procedure TCustomTimer.SetInterval(AValue: Cardinal);
begin
  if FInterval = AValue then
    Exit;
  FInterval := AValue;
  UpdateTimer;
end;

procedure TCustomTimer.SetOnTimer(AValue: TNotifyEvent);
begin
  if FOnTimer = AValue then
    Exit;
  FOnTimer := AValue;
  UpdateTimer;
end;

procedure TCustomTimer.DoOnTimer;
begin
  if Assigned(FOnTimer) then
    FOnTimer(Self);
end;

procedure TCustomTimer.UpdateTimer;
begin
  KillTimer;
  if FEnabled and (FInterval > 0) and
      ([csLoading, csDestroying] * ComponentState = []) and Assigned(FOnTimer) then begin
    FTimerHandle := window.setInterval(procedure begin FOnTimer(Self); end, FInterval);
    if FTimerHandle = 0 then
      raise EOutOfResources.Create(rsNoTimers);
    if Assigned(FOnStartTimer) then
      FOnStartTimer(Self);
  end;
end;

procedure TCustomTimer.KillTimer;
begin
   if FTimerHandle <> 0 then begin
      window.clearInterval(FTimerHandle);
      if Assigned(FOnStopTimer) then
         FOnStopTimer(Self);
   end;
end;

procedure TCustomTimer.Loaded;
begin
   inherited Loaded;
   UpdateTimer;
end;

constructor TCustomTimer.Create(AOwner: TComponent);
begin
   inherited Create(AOwner);
   FEnabled := True;
   FInterval := 1000;
   FTimerHandle := 0;
end;

destructor TCustomTimer.Destroy;
begin
   KillTimer;
   inherited Destroy;
end;

{ TCustomImage }

procedure TCustomImage.SetCenter(AValue: boolean);
begin
   if (FCenter <> AValue) then begin
      FCenter := AValue;
      PictureChanged(Self);
   end;
end;

procedure TCustomImage.SetPicture(AValue: TPicture);
begin
   if (not FPicture.IsEqual(AValue)) then begin
      FPicture.Assign(AValue);
   end;
end;

procedure TCustomImage.SetProportional(AValue: boolean);
begin
   if (FProportional <> AValue) then begin
      FProportional := AValue;
      PictureChanged(Self);
   end;
end;

procedure TCustomImage.SetStretch(AValue: boolean);
begin
   if (FStretch <> AValue) then begin
      FStretch := AValue;
      PictureChanged(Self);
   end;
end;

procedure TCustomImage.SetStretchInEnabled(AValue: boolean);
begin
   if (FStretchInEnabled <> AValue) then begin
      FStretchInEnabled := AValue;
      PictureChanged(Self);
   end;
end;

procedure TCustomImage.SetStretchOutEnabled(AValue: boolean);
begin
   if (FStretchOutEnabled <> AValue) then begin
      FStretchOutEnabled := AValue;
      PictureChanged(Self);
   end;
end;

procedure TCustomImage.SetTransparent(AValue: boolean);
begin
    if (FTransparent <> AValue) then begin
      FTransparent := AValue;
   end;
end;

procedure TCustomImage.SetURL(AValue: String);
begin
   if FURL = AValue then
      Exit;
   FURL := AValue;
   PictureChanged(Self);
end;

procedure TCustomImage.SetZoomEnabled(AValue: boolean);
begin
   if FZoomEnabled <> AValue then begin
      FZoomEnabled := AValue;
      Changed;
   end;
end;

function TCustomImage.HandleMouseDown(AEvent: TJSMouseEvent): boolean;
begin
  Result := True;
  if (not Enabled) or (not Visible) then Exit(False);
  if FZoomEnabled and (FZoomLevel > 100) then begin
    FIsDragging := True;
    FStartX := AEvent.ClientX;
    FStartY := AEvent.ClientY;
    HandleElement.style.setProperty('transition', 'none');
    AEvent.preventDefault;
  end;
end;

function TCustomImage.HandleMouseMove(AEvent: TJSMouseEvent): boolean;
var
  dx, dy, factor: Double;
begin
  Result := True;
  if FIsDragging and (FZoomLevel > 100) then
  begin
    // Formula per il trascinamento 1:1: 100 / (ZoomFactor - 1)
    factor := 10000 / (FZoomLevel - 100);
    
    dx := (AEvent.ClientX - FStartX) / HandleElement.clientWidth * factor;
    dy := (AEvent.ClientY - FStartY) / HandleElement.clientHeight * factor;
    
    FZoomX := FZoomX - dx;
    FZoomY := FZoomY - dy;
    
    if FZoomX < 0 then FZoomX := 0; if FZoomX > 100 then FZoomX := 100;
    if FZoomY < 0 then FZoomY := 0; if FZoomY > 100 then FZoomY := 100;
    
    asm
      this.FHandleElement.style.backgroundPosition = this.FZoomX + '% ' + this.FZoomY + '%';
    end;
    
    FStartX := AEvent.ClientX;
    FStartY := AEvent.ClientY;
    AEvent.preventDefault;
  end;
end;

function TCustomImage.HandleMouseUp(AEvent: TJSMouseEvent): boolean;
begin
  FIsDragging := False;
  HandleElement.style.setProperty('transition', 'background-size 0.2s ease-out');
  Result := True;
end;

function TCustomImage.HandleTouchStart(AEvent: TJSTouchEvent): boolean;
begin
   Result := True;
   if (not Enabled) or (not Visible) then Exit(False);

   if FZoomEnabled then begin
     if AEvent.touches.length = 2 then begin
        FIsDragging := False;
        asm
           let t0 = AEvent.touches[0];
           let t1 = AEvent.touches[1];
           let dx = t0.clientX - t1.clientX;
           let dy = t0.clientY - t1.clientY;
           this.FInitialDist = Math.hypot(dx, dy);

           // Memorizziamo il centro iniziale del pinch in coordinate percentuali
           let midX = (t0.clientX + t1.clientX) / 2;
           let midY = (t0.clientY + t1.clientY) / 2;
           let rect = this.FHandleElement.getBoundingClientRect();
           this.FZoomX = Math.max(0, Math.min(100, ((midX - rect.left) / rect.width) * 100));
           this.FZoomY = Math.max(0, Math.min(100, ((midY - rect.top) / rect.height) * 100));
        end;
        FInitialZoom := FZoomLevel;
        AEvent.stopPropagation;
     end else if AEvent.touches.length = 1 then begin
        if FZoomLevel > 100 then begin
           FIsDragging := True;
           FStartX := AEvent.touches[0].clientX;
           FStartY := AEvent.touches[0].clientY;
           HandleElement.style.setProperty('transition', 'none');
           AEvent.stopPropagation;
        end;
     end;
   end;
  
   if Assigned(fontouchstart) then fontouchstart(AEvent);
end;

function TCustomImage.HandleTouchEnd(AEvent: TJSTouchEvent): boolean;
begin
  FIsDragging := False;
  HandleElement.style.setProperty('transition', 'background-size 0.2s ease-out');
  
  if (not Enabled) or (not Visible) then exit(false);

  // Se stavamo facendo un pinch, non interpretiamo la fine come un click/doppio click
  if (AEvent.touches.length = 0) and (FInitialDist > 0) then
  begin
     FInitialDist := 0;
     FLastTouchTime := 0; // Reset double click timer
     if Assigned(fontouchend) then fontouchend(AEvent);
     Exit(True);
  end;

  if ((Assigned(OnDblClick)) and (Now - FLastTouchTime < 0.000005)) then
  begin
    FLastTouchTime := 0;
    OnDblClick(Self);
  end else begin
    FLastTouchTime := Now;
  end;

  if Assigned(fontouchend) then fontouchend(AEvent);
  Result := True;
end;

function TCustomImage.HandleTouchMove(AEvent: TJSTouchEvent): boolean;
var
  dist, factor, dx, dy: Double;
  newZoom: Integer;
begin
  Result := True;
  if (not Enabled) or (not Visible) then Exit(False);

  if FZoomEnabled then begin
    if AEvent.touches.length = 2 then
    begin
      asm
        let t0 = AEvent.touches[0];
        let t1 = AEvent.touches[1];
        let dx = t0.clientX - t1.clientX;
        let dy = t0.clientY - t1.clientY;
        dist = Math.hypot(dx, dy);
      end;

      if FInitialDist > 0 then
      begin
        factor := dist / FInitialDist;
        newZoom := Round(FInitialZoom * factor);
        if newZoom < 100 then newZoom := 100;
        if newZoom > 500 then newZoom := 500;

        SetZoomLevel(newZoom);
      end;

      AEvent.preventDefault;
      AEvent.stopPropagation;
    end
    else if (AEvent.touches.length = 1) and FIsDragging then
    begin
      factor := 10000 / (FZoomLevel - 100);
      dx := (AEvent.touches[0].clientX - FStartX) / HandleElement.clientWidth * factor;
      dy := (AEvent.touches[0].clientY - FStartY) / HandleElement.clientHeight * factor;

      FZoomX := FZoomX - dx;
      FZoomY := FZoomY - dy;

      if FZoomX < 0 then FZoomX := 0; if FZoomX > 100 then FZoomX := 100;
      if FZoomY < 0 then FZoomY := 0; if FZoomY > 100 then FZoomY := 100;

      asm
        this.FHandleElement.style.backgroundPosition = this.FZoomX + '% ' + this.FZoomY + '%';
      end;

      FStartX := AEvent.touches[0].clientX;
      FStartY := AEvent.touches[0].clientY;

      AEvent.preventDefault;
      AEvent.stopPropagation;
    end;
  end;

  if Assigned(fOntouchMove) then fOntouchMove(AEvent);
end;

function TCustomImage.HandleTouchCancel(AEvent: TJSTouchEvent): boolean;
Begin
   FIsDragging := False;
   if (Enabled=false or visible=false) then exit(false);
   if Assigned(fOntouchCancel) then fOntouchCancel(AEvent);
   Result := True;
end;

procedure TCustomImage.SetOntouchStart(AValue : TJSTouchEventHandler);
Begin
   if AValue<>fOntouchStart then begin
      fOntouchStart:=AValue;
      HandleElement.ontouchstart:=AValue;
   end;
end;

procedure TCustomImage.SetOntouchMove(AValue : TJSTouchEventHandler);
Begin
   if AValue<>fOntouchMove then begin
      fOntouchMove:=AValue;
   end;
end;

procedure TCustomImage.SetOntouchCancel(AValue : TJSTouchEventHandler);
Begin
   if AValue<>fOntouchCancel then begin
      fOntouchCancel:=AValue;
   end;
end;

procedure TCustomImage.SetOntouchEnd(AValue : TJSTouchEventHandler);
Begin
   if AValue<>fOntouchEnd then begin
      fOntouchEnd:=AValue;
   end;
end;

procedure TCustomImage.SetZoomLevel(AValue: Integer);
begin
  if FZoomLevel <> AValue then
  begin
    FZoomLevel := AValue;
    Changed;
  end;
end;

procedure TCustomImage.SetZoomX(AValue: Double);
begin
  if FZoomX <> AValue then
  begin
    FZoomX := AValue;
    Changed;
  end;
end;

procedure TCustomImage.SetZoomY(AValue: Double);
begin
  if FZoomY <> AValue then
  begin
    FZoomY := AValue;
    Changed;
  end;
end;

procedure TCustomImage.Changed;
begin
   inherited Changed;
   if (not IsUpdating) and not (csLoading in ComponentState) then begin
      with HandleElement do begin
         /// Focus highlight
         Style.SetProperty('outline', 'none');
         /// Load image
         Style.SetProperty('background-image', Format('url(''%s'')', [FURL]));
         Style.SetProperty('background-repeat', 'no-repeat');

         if (FZoomLevel > 100) then begin
            Style.SetProperty('background-size', Format('%d%%', [FZoomLevel]));
            asm
              this.FHandleElement.style.backgroundPosition = this.FZoomX + '% ' + this.FZoomY + '%';
            end;
         end else begin
            /// Center
            if (FCenter) then begin
               Style.SetProperty('background-position', 'center  center');
            end else begin
               Style.RemoveProperty('background-position');
            end;
            /// Proportional
            if (FProportional) then begin
               Style.SetProperty('background-size', 'contain');
               Style.SetProperty('background-position', 'center center');
            end else
               /// Stretch
               if (FStretch) then begin
                  if (FStretchInEnabled) and (FStretchOutEnabled) then begin
                     Style.SetProperty('background-size', '100% 100%');
                  end else if (FStretchInEnabled) then begin
                     Style.SetProperty('background-size', 'auto 100%');
                  end else if (FStretchOutEnabled) then begin
                     Style.SetProperty('background-size', '100% auto');
                  end;
               end else begin
                  Style.SetProperty('background-size', 'contain');
                  Style.SetProperty('background-position', 'center center');
               end;
         end;
      end;
      HandleElement.setAttribute('draggable', 'false');
      HandleElement.style.setProperty('-moz-user-select', 'none');
   end;
end;

function TCustomImage.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
end;

{$push}
{$hints off}

function TCustomImage.CheckChildClassAllowed(AChildClass: TClass): boolean;
begin
  Result := False;
end;

{$pop}

{$push}
{$hints off}

procedure TCustomImage.PictureChanged(Sender: TObject);
begin
  Changed;
  if (Assigned(FOnPictureChanged)) then
  begin
    FOnPictureChanged(Self);
  end;
end;

{$pop}

class function TCustomImage.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 90;
  Result.Cy := 90;
end;

constructor TCustomImage.Create(AOwner: TComponent);
var
  cbStart, cbMove, cbEnd, cbCancel: TJSTouchEventHandler;
begin
   inherited Create(AOwner);
   FPicture := TPicture.Create;
   FPicture.OnChange := @PictureChanged;
   FCenter := False;
   FProportional := False;
   FStretch := False;
   FStretchOutEnabled := True;
   FStretchInEnabled := True;
   FTransparent := False;
   FZoomLevel := 100;
   FZoomX := 50;
   FZoomY := 50;
   FIsDragging := False;
   FZoomEnabled := True;
   FInitialDist := 0;

   HandleElement.addEventListener('mousedown', @HandleMouseDown);
   HandleElement.addEventListener('mousemove', @HandleMouseMove);
   HandleElement.addEventListener('mouseup', @HandleMouseUp);
   
   cbStart := @HandleTouchStart;
   cbMove  := @HandleTouchMove;
   cbEnd   := @HandleTouchEnd;
   cbCancel := @HandleTouchCancel;

   asm
     var options = { passive: false };
     this.FHandleElement.addEventListener('touchstart', cbStart, options);
     this.FHandleElement.addEventListener('touchmove', cbMove, options);
     this.FHandleElement.addEventListener('touchend', cbEnd, options);
     this.FHandleElement.addEventListener('touchcancel', cbCancel, options);
   end;

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

var
  _WCLExtRulesRegistered: Boolean;

procedure _RegisterWCLExtRules;
begin
  if _WCLExtRulesRegistered then Exit;
  RegisterWCLStyle(
    '.wcl-panel{' +
    'border-radius:4px;' +
    'overflow:hidden;}'
  );
  _WCLExtRulesRegistered := True;
end;

{ TCustomPanel }

procedure TCustomPanel.SetOntouchStart(AValue : TJSTouchEventHandler);
Begin
   if AValue<>fOntouchStart then begin
      fOntouchStart:=AValue;
   end;
end;

procedure TCustomPanel.SetOntouchMove(AValue : TJSTouchEventHandler);
Begin
   if AValue<>fOntouchMove then begin
      fOntouchMove:=AValue;
      HandleElement.ontouchmove:=AValue;
   end;
end;

procedure TCustomPanel.SetOntouchCancel(AValue : TJSTouchEventHandler);
Begin
   if AValue<>fOntouchCancel then begin
      fOntouchCancel:=AValue;
      HandleElement.ontouchcancel:=AValue;
   end;
end;

procedure TCustomPanel.SetOntouchEnd(AValue : TJSTouchEventHandler);
Begin
   if AValue<>fOntouchEnd then begin
      fOntouchEnd:=AValue;
      HandleElement.ontouchend:=AValue;
   end;
end;

procedure TCustomPanel.SetAlignment(AValue: TAlignment);
begin
  if (FAlignment <> AValue) then
  begin
    FAlignment := AValue;
    Changed;
  end;
end;

procedure TCustomPanel.SetBevelColor(AValue: TColor);
begin
  if (FBevelColor <> AValue) then
  begin
    FBevelColor := AValue;
    Changed;
  end;
end;

procedure TCustomPanel.SetBevelInner(AValue: TPanelBevel);
begin
  if (FBevelInner <> AValue) then
  begin
    FBevelInner := AValue;
    Changed;
  end;
end;

procedure TCustomPanel.SetBevelOuter(AValue: TPanelBevel);
begin
  if (FBevelOuter <> AValue) then
  begin
    FBevelOuter := AValue;
    Changed;
  end;
end;

procedure TCustomPanel.SetBevelWidth(AValue: TBevelWidth);
begin
  if (FBevelWidth <> AValue) then
  begin
    FBevelWidth := AValue;
    Changed;
  end;
end;

procedure TCustomPanel.SetLayout(AValue: TTextLayout);
begin
  if (FLayout <> AValue) then
  begin
    FLayout := AValue;
    Changed;
  end;
end;

procedure TCustomPanel.SetScrollableHorizontal(AValue: boolean);
Begin
   if (fScrollHorizontal <> AValue) then begin
      fScrollHorizontal := AValue;
      Changed;
   end;
end;

procedure TCustomPanel.SetScrollableVertical(AValue: boolean);
Begin
   if (FScrollVertical <> AValue) then begin
      FScrollVertical := AValue;
      Changed;
   end;
end;

procedure TCustomPanel.SetWordWrap(AValue: boolean);
begin
  if (FWordWrap <> AValue) then
  begin
    FWordWrap := AValue;
    Changed;
  end;
end;

procedure TCustomPanel.Changed;
  var VTopColor: TColor;
      VBottomColor: TColor;
begin
   inherited Changed;
   if (not IsUpdating) and not (csLoading in ComponentState) then begin
      if (HandleClass = '') then begin
         _RegisterWCLExtRules;
         asm this.FHandleElement.classList.add('wcl-panel'); end;
      end;
      HandleElement.name := Name;
      with HandleElement do begin
         /// Bevel/Border
         if (FBevelOuter = bvNone) then begin
            Style.RemoveProperty('border-width');
            Style.RemoveProperty('border-left-color');
            Style.RemoveProperty('border-left-style');
            Style.RemoveProperty('border-top-color');
            Style.RemoveProperty('border-top-style');
            Style.RemoveProperty('border-right-color');
            Style.RemoveProperty('border-right-style');
            Style.RemoveProperty('border-bottom-color');
            Style.RemoveProperty('border-bottom-style');
         end else begin
            if (FBevelColor = clDefault) then begin
               case FBevelOuter of
                  bvLowered: begin
                     VTopColor := clGray; /// dark
                     VBottomColor := clWhite;
                  end;
                  bvRaised: begin
                     VTopColor := clWhite;
                     VBottomColor := clGray; /// dark
                  end;
                  else begin
                     VTopColor := Self.Color;
                     VBottomColor := Self.Color;
                  end;
               end;
            end else begin
               VTopColor := FBevelColor;
               VBottomColor := FBevelColor;
            end;
            Style.SetProperty('border-width', IntToStr(FBevelWidth) + 'px');
            Style.SetProperty('border-style', 'solid');
            Style.SetProperty('border-left-color', JSColor(VTopColor));
            Style.SetProperty('border-top-color', JSColor(VTopColor));
            Style.SetProperty('border-right-color', JSColor(VBottomColor));
            Style.SetProperty('border-bottom-color', JSColor(VBottomColor));
         end;
         /// Focus highlight
         Style.SetProperty('outline', 'none');
         /// Prevent text selection
         Style.SetProperty('user-select', 'none');
         Style.SetProperty('-moz-user-select', 'none');
         Style.SetProperty('-ms-user-select', 'none');
         Style.SetProperty('-khtml-user-select', 'none');
         Style.SetProperty('-webkit-user-select', 'none');

         /// If scrollable
         if fScrollHorizontal then Begin
            Style.setProperty('overflow-y', 'scroll');
         End else begin
            Style.setProperty('overflow-y', 'hidden');
         end;

         if FScrollvertical then Begin
            Style.setProperty('overflow-x', 'scroll');
         End else begin
            Style.setProperty('overflow-x', 'hidden');
         end;
      end;
   end;
end;

function TCustomPanel.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
end;

class function TCustomPanel.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 170;
  Result.Cy := 50;
end;

constructor TCustomPanel.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FAlignment := taCenter;
  FBevelColor := clDefault;
  FBevelOuter := bvRaised;
  FBevelInner := bvNone;
  FBevelWidth := 1;
  FLayout := tlCenter;
  FWordWrap := False;
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

{ TCustomGroupBox }

constructor TCustomGroupBox.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  BeginUpdate;
  try
    TabStop := False;
    with GetControlClassDefaultSize do
      SetBounds(0, 0, Cx, Cy);
  finally
    EndUpdate;
  end;
end;

class function TCustomGroupBox.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 200;
  Result.Cy := 150;
end;

function TCustomGroupBox.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('fieldset'));
  FLegendElement := TJSHTMLElement(Document.CreateElement('legend'));
  Result.AppendChild(FLegendElement);
end;

procedure TCustomGroupBox.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    HandleElement.setAttribute('name', Name);
    FLegendElement.InnerHTML := Self.Caption;
  end;
end;

{ TCustomScrollBox }

constructor TCustomScrollBox.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  BeginUpdate;
  try
    TabStop := False;
    with GetControlClassDefaultSize do
      SetBounds(0, 0, Cx, Cy);
  finally
    EndUpdate;
  end;
end;

class function TCustomScrollBox.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 200;
  Result.Cy := 200;
end;

function TCustomScrollBox.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
end;

procedure TCustomScrollBox.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    HandleElement.setAttribute('name', Name);
    HandleElement.Style.SetProperty('overflow', 'auto');
  end;
end;

{ TCustomProgressBar }

constructor TCustomProgressBar.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FMin := 0;
  FMax := 100;
  FValue := 0;
  BeginUpdate;
  try
    with GetControlClassDefaultSize do
      SetBounds(0, 0, Cx, Cy);
  finally
    EndUpdate;
  end;
end;

class function TCustomProgressBar.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 150;
  Result.Cy := 20;
end;

function TCustomProgressBar.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('progress'));
end;

procedure TCustomProgressBar.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    HandleElement.setAttribute('name', Name);
    with TJSHTMLProgressElement(HandleElement) do
    begin
      max := FMax;
      value := FValue;
    end;
  end;
end;

procedure TCustomProgressBar.SetMax(AValue: NativeInt);
begin
  if FMax <> AValue then
  begin
    if AValue < FMin then
      AValue := FMin;
    FMax := AValue;
    if FValue > FMax then
      FValue := FMax;
    Changed;
  end;
end;

procedure TCustomProgressBar.SetMin(AValue: NativeInt);
begin
  if FMin <> AValue then
  begin
    if AValue > FMax then
      AValue := FMax;
    FMin := AValue;
    if FValue < FMin then
      FValue := FMin;
    Changed;
  end;
end;

procedure TCustomProgressBar.SetValue(AValue: NativeInt);
begin
  if AValue < FMin then
    AValue := FMin;
  if AValue > FMax then
    AValue := FMax;
  if FValue <> AValue then
  begin
    FValue := AValue;
    Changed;
  end;
end;

{ TCustomTrackBar }

constructor TCustomTrackBar.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FMin := 0;
  FMax := 100;
  FFrequency := 1;
  FOrientation := trHorizontal;
  FPosition := 0;
  BeginUpdate;
  try
    with GetControlClassDefaultSize do
      SetBounds(0, 0, Cx, Cy);
  finally
    EndUpdate;
  end;
end;

class function TCustomTrackBar.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 150;
  Result.Cy := 30;
end;

function TCustomTrackBar.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('input'));
  TJSHTMLInputElement(Result)._type := 'range';
  Result.AddEventListener('change', @HandleChange);
end;

procedure TCustomTrackBar.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    HandleElement.setAttribute('name', Name);
    with TJSHTMLInputElement(HandleElement) do
    begin
      asm this.FHandleElement.min = this.FMin; end;
      asm this.FHandleElement.max = this.FMax; end;
      asm this.FHandleElement.step = this.FFrequency; end;
      asm this.FHandleElement.value = this.FPosition; end;
    end;
  end;
end;

function TCustomTrackBar.HandleChange(AEvent: TJSEvent): boolean;
begin
  Result := True;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    asm this.FPosition = parseInt(this.FHandleElement.value); end;
    if Assigned(FOnChange) then
      FOnChange(Self);
  end;
end;

procedure TCustomTrackBar.SetMax(AValue: Integer);
begin
  if FMax <> AValue then
  begin
    if AValue < FMin then AValue := FMin;
    FMax := AValue;
    if FPosition > FMax then FPosition := FMax;
    Changed;
  end;
end;

procedure TCustomTrackBar.SetMin(AValue: Integer);
begin
  if FMin <> AValue then
  begin
    if AValue > FMax then AValue := FMax;
    FMin := AValue;
    if FPosition < FMin then FPosition := FMin;
    Changed;
  end;
end;

procedure TCustomTrackBar.SetOrientation(AValue: TTrackBarOrientation);
begin
  if FOrientation <> AValue then
  begin
    FOrientation := AValue;
    Changed;
  end;
end;

procedure TCustomTrackBar.SetPosition(AValue: Integer);
begin
  if AValue < FMin then AValue := FMin;
  if AValue > FMax then AValue := FMax;
  if FPosition <> AValue then
  begin
    FPosition := AValue;
    Changed;
  end;
end;

{ TCustomColorPicker }

constructor TCustomColorPicker.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FColor := clBlack;
  BeginUpdate;
  try
    with GetControlClassDefaultSize do
      SetBounds(0, 0, Cx, Cy);
  finally
    EndUpdate;
  end;
end;

class function TCustomColorPicker.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 50;
  Result.Cy := 30;
end;

function TCustomColorPicker.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('input'));
  TJSHTMLInputElement(Result)._type := 'color';
  Result.AddEventListener('change', @HandleChange);
end;

procedure TCustomColorPicker.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    HandleElement.setAttribute('name', Name);
    TJSHTMLInputElement(HandleElement).value := JSColor(FColor);
  end;
end;

function TCustomColorPicker.HandleChange(AEvent: TJSEvent): boolean;
begin
  Result := True;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    asm this.FColor = this.FHandleElement.value; end;
    if Assigned(FOnChange) then
      FOnChange(Self);
  end;
end;

procedure TCustomColorPicker.SetColor(AValue: TColor);
begin
  if FColor <> AValue then
  begin
    FColor := AValue;
    Changed;
  end;
end;

end.
