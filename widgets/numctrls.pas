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
unit NumCtrls;

{$I pas2js_widget.inc}

interface

uses
  Classes,
  SysUtils,
  Types,
  Graphics,
  Controls,
  StdCtrls,
  Web;

type

  { TCustomNumericEdit }

  TCustomNumericEdit = class(TCustomEdit)
  private
    FDecimals: NativeInt;
    FIncrement: Double;
    FMaxValue: Double;
    FMinValue: Double;
    procedure SetIncrement(AValue: Double);
    procedure SetMaxValue(AValue: Double);
    procedure SetMinValue(AValue: Double);
  protected
    procedure DoEnter; override;
    procedure DoExit; override;
    procedure DoInput(ANewValue: string); override;
  protected
    function GetInputType: string; override;
    /// Keyboard hint for the mobile on-screen keyboard.
    function GetInputMode: string; virtual;
    procedure Changed; override;
  public
    constructor Create(AOwner: TComponent); override;
    property DecimalPlaces: NativeInt read FDecimals write FDecimals default 2;
    property Increment: Double read FIncrement write SetIncrement;
    property MaxValue: Double read FMaxValue write SetMaxValue;
    property MinValue: Double read FMinValue write SetMinValue;
  end;

  { TCustomSpinEdit }

  TCustomSpinEdit = class(TCustomNumericEdit)
  private
    function GetValue: NativeInt;
    procedure SetValue(AValue: NativeInt);
  protected
    function GetInputType: string; override;
  public
    property Value: NativeInt read GetValue write SetValue;
  end;

  { TSpinEdit }

  TSpinEdit = class(TCustomSpinEdit)
  published
    property Align;
    property Alignment;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property BorderStyle;
    property Color;
    property Enabled;
    property Font;
    property HandleClass;
    property HandleId;
    property Increment;
    property MaxValue;
    property MinValue;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property ReadOnly;
    property ShowHint;
    property TabOrder;
    property TabStop;
    property Text;
    property TextHint;
    property Value;
    property Visible;
    property OnChange;
    property OnClick;
    property OnDblClick;
    property OnEnter;
    property OnExit;
    property OnKeyDown;
    property OnKeyPress;
    property OnKeyUp;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
  end;

  TUpDownDirection = (updNone, updUp, updDown);
  TUDBtnType = (btNext, btPrev);
  TUDOrientation = (udHorizontal, udVertical);
  TUDClickEvent = procedure(Sender: TObject; Button: TUDBtnType) of object;
  TUDChangingEvent = procedure(Sender: TObject; var AllowChange: Boolean) of object;
  TUDChangingEventEx = procedure(Sender: TObject; var AllowChange: Boolean;
    NewValue: Integer; Direction: TUpDownDirection) of object;

  { TUpDown }

  TUpDown = class(TWinControl)
  private
    FAssociate: TWinControl;
    FDownButton: TJSHTMLElement;
    FIncrement: Integer;
    FMax: Integer;
    FMin: Integer;
    FOrientation: TUDOrientation;
    FPosition: Integer;
    FThousands: Boolean;
    FUpButton: TJSHTMLElement;
    FWrap: Boolean;
    FOnChanging: TUDChangingEvent;
    FOnChangingEx: TUDChangingEventEx;
    FOnClick: TUDClickEvent;
    function GetPosition: Integer;
    procedure SetAssociate(AValue: TWinControl);
    procedure SetIncrement(AValue: Integer);
    procedure SetMax(AValue: Integer);
    procedure SetMin(AValue: Integer);
    procedure SetOrientation(AValue: TUDOrientation);
    procedure SetPosition(AValue: Integer);
    procedure SetThousands(AValue: Boolean);
    procedure SetWrap(AValue: Boolean);
  protected
    procedure Changed; override;
    function CreateHandleElement: TJSHTMLElement; override;
    procedure RegisterHandleEvents; override;
    procedure UnRegisterHandleEvents; override;
    procedure Notification(AComponent: TComponent; Operation: TOperation); override;
    function HandleUpClick(AEvent: TJSMouseEvent): boolean; virtual;
    function HandleDownClick(AEvent: TJSMouseEvent): boolean; virtual;
    procedure Click(AButton: TUDBtnType); virtual;
  protected
    class function GetControlClassDefaultSize: TSize; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
  published
    property Associate: TWinControl read FAssociate write SetAssociate;
    property Increment: Integer read FIncrement write SetIncrement default 1;
    property Max: Integer read FMax write SetMax default 100;
    property Min: Integer read FMin write SetMin default 0;
    property Orientation: TUDOrientation read FOrientation write SetOrientation default udVertical;
    property Position: Integer read GetPosition write SetPosition;
    property Thousands: Boolean read FThousands write SetThousands default True;
    property Wrap: Boolean read FWrap write SetWrap default False;
    property OnChanging: TUDChangingEvent read FOnChanging write FOnChanging;
    property OnChangingEx: TUDChangingEventEx read FOnChangingEx write FOnChangingEx;
    property OnClick: TUDClickEvent read FOnClick write FOnClick;
  end;

implementation

{ TCustomNumericEdit }

procedure TCustomNumericEdit.DoEnter;
begin
  inherited DoEnter;
  RealSetText(RealGetText);
end;

procedure TCustomNumericEdit.DoExit;
var
  VVal: Double;
begin
  VVal := StrToFloatDef(RealGetText, 0);
  if (FMinValue <> 0) and (VVal < FMinValue) then
  begin
    VVal := FMinValue;
    RealSetText(FloatToStrF(VVal, ffFixed, 15, FDecimals));
  end;
  if (FMaxValue <> 0) and (VVal > FMaxValue) then
  begin
    VVal := FMaxValue;
    RealSetText(FloatToStrF(VVal, ffFixed, 15, FDecimals));
  end;
  inherited DoExit;
  RealSetText(RealGetText);
end;

procedure TCustomNumericEdit.DoInput(ANewValue: string);
  var VDiff: string;
      VOldValue: string;
begin
   VOldValue := RealGetText;
   if (Length(ANewValue) >= Length(VOldValue)) then begin
      VDiff := StringReplace(ANewValue, VOldValue, '', []);
      if (VDiff = DecimalSeparator) then begin
         if (FDecimals = 0) then begin
            VDiff := '';
         end;
         if (Pos(VDiff, VOldValue) > 0) then begin
            VDiff := '';
         end;
      end;
      if (not (VDiff[1] in ['0'..'9', DecimalSeparator])) then begin
         TJSHTMLInputElement(HandleElement).Value := VOldValue;
         ANewValue := VOldValue;
      end;
   end;
   inherited DoInput(ANewValue);
end;

function TCustomNumericEdit.GetInputType: string;
begin
  Result := 'text';
end;

function TCustomNumericEdit.GetInputMode: string;
begin
  Result := 'numeric';
end;

procedure TCustomNumericEdit.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    with TJSHTMLInputElement(HandleElement) do
    begin
      InputMode := GetInputMode;
      if FIncrement > 0 then
        asm this.FHandleElement.step = this.FIncrement; end;
      if FMinValue <> 0 then
        asm this.FHandleElement.min = this.FMinValue; end;
      if FMaxValue <> 0 then
        asm this.FHandleElement.max = this.FMaxValue; end;
    end;
  end;
end;

constructor TCustomNumericEdit.Create(AOwner: TComponent);
begin
   inherited Create(AOwner);
   FDecimals := 2;
   FIncrement := 1;
   FMaxValue := 0;
   FMinValue := 0;
   BeginUpdate;
   try
      Alignment := taRightJustify;
   finally
      EndUpdate;
   end;
end;

procedure TCustomNumericEdit.SetIncrement(AValue: Double);
begin
  if (FIncrement <> AValue) and (AValue > 0) then
  begin
    FIncrement := AValue;
    Changed;
  end;
end;

procedure TCustomNumericEdit.SetMaxValue(AValue: Double);
begin
  if FMaxValue <> AValue then
  begin
    FMaxValue := AValue;
    if (FMinValue <> 0) and (FMaxValue <> 0) and (FMinValue > FMaxValue) then
      FMinValue := FMaxValue;
  end;
end;

procedure TCustomNumericEdit.SetMinValue(AValue: Double);
begin
  if FMinValue <> AValue then
  begin
    FMinValue := AValue;
    if (FMinValue <> 0) and (FMaxValue <> 0) and (FMinValue > FMaxValue) then
      FMaxValue := FMinValue;
  end;
end;

{ TCustomSpinEdit }

function TCustomSpinEdit.GetInputType: string;
begin
  Result := 'number';
end;

function TCustomSpinEdit.GetValue: NativeInt;
begin
  Result := Trunc(StrToFloatDef(RealGetText, 0));
end;

procedure TCustomSpinEdit.SetValue(AValue: NativeInt);
begin
  RealSetText(IntToStr(AValue));
  Change;
end;

{ TUpDown styles }

var
  _WCLNumRulesRegistered: Boolean;

procedure _RegisterWCLNumRules;
begin
  if _WCLNumRulesRegistered then
    Exit;
  RegisterWCLStyle(
    '.wcl-updown{' +
    'display:flex;' +
    'flex-direction:column;' +
    'box-sizing:border-box;' +
    'border:1px solid #888;' +
    'border-radius:4px;' +
    'overflow:hidden;' +
    'background:#f0f0f0;}' +
    '.wcl-updown-horizontal{' +
    'flex-direction:row;}' +
    '.wcl-updown-btn{' +
    'flex:1;' +
    'min-width:0;' +
    'min-height:0;' +
    'border:0;' +
    'background:transparent;' +
    'cursor:pointer;' +
    'font-size:10px;' +
    'line-height:1;' +
    'padding:0;' +
    'color:#333;' +
    'touch-action:manipulation;' +
    '-webkit-tap-highlight-color:transparent;}' +
    '@media(hover:hover){' +
    '.wcl-updown-btn:hover{background:#e0e0e0;}' +
    '}' +
    '.wcl-updown-btn:active{' +
    'background:#d0d0d0;}' +
    '@media(pointer:coarse){' +
    '.wcl-updown-btn{font-size:12px;}' +
    '}'
  );
  _WCLNumRulesRegistered := True;
end;

{ TUpDown }

constructor TUpDown.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  _RegisterWCLNumRules;
  FAssociate := nil;
  FIncrement := 1;
  FMax := 100;
  FMin := 0;
  FOrientation := udVertical;
  FPosition := 0;
  FThousands := True;
  FWrap := False;
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

destructor TUpDown.Destroy;
begin
  if Assigned(FAssociate) then
    FAssociate.RemoveFreeNotification(Self);
  FAssociate := nil;
  inherited Destroy;
end;

class function TUpDown.GetControlClassDefaultSize: TSize;
begin
  Result.Cx := 24;
  Result.Cy := 40;
end;

function TUpDown.CreateHandleElement: TJSHTMLElement;
begin
  Result := TJSHTMLElement(Document.CreateElement('div'));
  FUpButton := TJSHTMLElement(Document.CreateElement('button'));
  FUpButton.classList.add('wcl-updown-btn');
  FUpButton.setAttribute('type', 'button');
  Result.AppendChild(FUpButton);
  FDownButton := TJSHTMLElement(Document.CreateElement('button'));
  FDownButton.classList.add('wcl-updown-btn');
  FDownButton.setAttribute('type', 'button');
  Result.AppendChild(FDownButton);
end;

procedure TUpDown.RegisterHandleEvents;
begin
  inherited RegisterHandleEvents;
  FUpButton.addEventListener('click', TJSEventHandler(@HandleUpClick));
  FDownButton.addEventListener('click', TJSEventHandler(@HandleDownClick));
end;

procedure TUpDown.UnRegisterHandleEvents;
begin
  inherited UnRegisterHandleEvents;
  FUpButton.removeEventListener('click', TJSEventHandler(@HandleUpClick));
  FDownButton.removeEventListener('click', TJSEventHandler(@HandleDownClick));
end;

procedure TUpDown.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    HandleElement.classList.add('wcl-updown');
    if (FOrientation = udHorizontal) then
      HandleElement.classList.add('wcl-updown-horizontal')
    else
      HandleElement.classList.remove('wcl-updown-horizontal');
    if (FOrientation = udHorizontal) then
    begin
      FDownButton.TextContent := '◀';
      FUpButton.TextContent := '▶';
    end
    else
    begin
      FUpButton.TextContent := '▲';
      FDownButton.TextContent := '▼';
    end;
  end;
end;

function TUpDown.HandleUpClick(AEvent: TJSMouseEvent): boolean;
begin
  AEvent.StopPropagation;
  Click(btNext);
  Result := True;
end;

function TUpDown.HandleDownClick(AEvent: TJSMouseEvent): boolean;
begin
  AEvent.StopPropagation;
  Click(btPrev);
  Result := True;
end;

function TUpDown.GetPosition: Integer;
begin
  if Assigned(FAssociate) then
    Result := StrToIntDef(FAssociate.Caption, FPosition)
  else
    Result := FPosition;
end;

procedure TUpDown.Click(AButton: TUDBtnType);
var
  VAllow: Boolean;
  VDirection: TUpDownDirection;
  VNew: Integer;
begin
  VNew := GetPosition;
  if (AButton = btNext) then
  begin
    Inc(VNew, FIncrement);
    VDirection := updUp;
  end
  else
  begin
    Dec(VNew, FIncrement);
    VDirection := updDown;
  end;
  if FWrap then
  begin
    if (VNew > FMax) then
      VNew := FMin;
    if (VNew < FMin) then
      VNew := FMax;
  end
  else
  begin
    if (VNew < FMin) then
      VNew := FMin;
    if (VNew > FMax) then
      VNew := FMax;
  end;
  VAllow := True;
  if Assigned(FOnChanging) then
    FOnChanging(Self, VAllow);
  if VAllow and Assigned(FOnChangingEx) then
    FOnChangingEx(Self, VAllow, VNew, VDirection);
  if VAllow then
  begin
    SetPosition(VNew);
    if Assigned(FOnClick) then
      FOnClick(Self, AButton);
  end;
end;

procedure TUpDown.SetAssociate(AValue: TWinControl);
begin
  if (FAssociate = AValue) then
    Exit;
  if Assigned(FAssociate) then
    FAssociate.RemoveFreeNotification(Self);
  FAssociate := AValue;
  if Assigned(FAssociate) then
  begin
    FAssociate.FreeNotification(Self);
    FPosition := GetPosition;
  end;
end;

procedure TUpDown.Notification(AComponent: TComponent;
  Operation: TOperation);
begin
  inherited Notification(AComponent, Operation);
  if (Operation = opRemove) and (AComponent = FAssociate) then
    FAssociate := nil;
end;

procedure TUpDown.SetIncrement(AValue: Integer);
begin
  if (AValue < 1) then
    AValue := 1;
  if (FIncrement <> AValue) then
    FIncrement := AValue;
end;

procedure TUpDown.SetMax(AValue: Integer);
begin
  if (AValue < FMin) then
    AValue := FMin;
  if (FMax <> AValue) then
  begin
    FMax := AValue;
    if (GetPosition > FMax) then
      SetPosition(FMax);
  end;
end;

procedure TUpDown.SetMin(AValue: Integer);
begin
  if (AValue > FMax) then
    AValue := FMax;
  if (FMin <> AValue) then
  begin
    FMin := AValue;
    if (GetPosition < FMin) then
      SetPosition(FMin);
  end;
end;

procedure TUpDown.SetOrientation(AValue: TUDOrientation);
begin
  if (FOrientation <> AValue) then
  begin
    FOrientation := AValue;
    Changed;
  end;
end;

procedure TUpDown.SetPosition(AValue: Integer);
begin
  if (AValue < FMin) then
    AValue := FMin;
  if (AValue > FMax) then
    AValue := FMax;
  FPosition := AValue;
  if Assigned(FAssociate) then
    FAssociate.Caption := IntToStr(AValue);
end;

procedure TUpDown.SetThousands(AValue: Boolean);
begin
  FThousands := AValue;
end;

procedure TUpDown.SetWrap(AValue: Boolean);
begin
  FWrap := AValue;
end;

end.
