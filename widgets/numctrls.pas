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
    FMaxValue: Double;
    FMinValue: Double;
    procedure SetMaxValue(AValue: Double);
    procedure SetMinValue(AValue: Double);
  protected
    procedure DoEnter; override;
    procedure DoExit; override;
    procedure DoInput(ANewValue: string); override;
  protected
    procedure Changed; override;
  public
    constructor Create(AOwner: TComponent); override;
    property DecimalPlaces: NativeInt read FDecimals write FDecimals default 2;
    property MaxValue: Double read FMaxValue write SetMaxValue;
    property MinValue: Double read FMinValue write SetMinValue;
  end;

  { TCustomSpinEdit }

  TCustomSpinEdit = class(TCustomNumericEdit)
  private
    FIncrement: Double;
    procedure SetIncrement(AValue: Double);
  protected
    function InputType: string; override;
    procedure Changed; override;
  public
    constructor Create(AOwner: TComponent); override;
    property Increment: Double read FIncrement write SetIncrement;
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

procedure TCustomNumericEdit.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    with TJSHTMLInputElement(HandleElement) do
    begin
      InputMode := 'numeric';
    end;
  end;
end;

constructor TCustomNumericEdit.Create(AOwner: TComponent);
begin
   inherited Create(AOwner);
   FDecimals := 2;
   FMaxValue := 0;
   FMinValue := 0;
   BeginUpdate;
   try
      Alignment := taRightJustify;
   finally
      EndUpdate;
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

constructor TCustomSpinEdit.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FIncrement := 1;
end;

function TCustomSpinEdit.InputType: string;
begin
  Result := 'number';
end;

procedure TCustomSpinEdit.Changed;
begin
  inherited Changed;
  if (not IsUpdating) and not (csLoading in ComponentState) then
  begin
    with TJSHTMLInputElement(HandleElement) do
    begin
      if FIncrement > 0 then
        asm this.FHandleElement.step = this.FIncrement; end;
      if FMinValue <> 0 then
        asm this.FHandleElement.min = this.FMinValue; end;
      if FMaxValue <> 0 then
        asm this.FHandleElement.max = this.FMaxValue; end;
    end;
  end;
end;

procedure TCustomSpinEdit.SetIncrement(AValue: Double);
begin
  if (FIncrement <> AValue) and (AValue > 0) then
  begin
    FIncrement := AValue;
    Changed;
  end;
end;

end.
