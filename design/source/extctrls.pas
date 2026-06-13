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

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils, Graphics, Controls;

type

  { TCustomScrollBox }

  TCustomScrollBox = class(TCustomControl)
  public
    constructor Create(AOwner: TComponent); override;
  end;

  { TCustomProgressBar }

  TCustomProgressBar = class(TCustomControl)
  private
    FMax: LongInt;
    FMin: LongInt;
    FValue: LongInt;
    procedure SetMax(AValue: LongInt);
    procedure SetMin(AValue: LongInt);
    procedure SetValue(AValue: LongInt);
  protected
    procedure Paint; override;
  public
    constructor Create(AOwner: TComponent); override;
  published
    property Max: LongInt read FMax write SetMax default 100;
    property Min: LongInt read FMin write SetMin default 0;
    property Value: LongInt read FValue write SetValue default 0;
  end;

implementation

uses
  LCLType, Types;

{ TCustomScrollBox }

constructor TCustomScrollBox.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  ControlStyle := ControlStyle + [csAcceptsControls, csCaptureMouse];
  Width := 200;
  Height := 200;
end;

{ TCustomProgressBar }

constructor TCustomProgressBar.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FMin := 0;
  FMax := 100;
  FValue := 0;
  Width := 150;
  Height := 20;
end;

procedure TCustomProgressBar.SetMax(AValue: LongInt);
begin
  if FMax <> AValue then
  begin
    if AValue < FMin then AValue := FMin;
    FMax := AValue;
    if FValue > FMax then FValue := FMax;
    Invalidate;
  end;
end;

procedure TCustomProgressBar.SetMin(AValue: LongInt);
begin
  if FMin <> AValue then
  begin
    if AValue > FMax then AValue := FMax;
    FMin := AValue;
    if FValue < FMin then FValue := FMin;
    Invalidate;
  end;
end;

procedure TCustomProgressBar.SetValue(AValue: LongInt);
begin
  if AValue < FMin then AValue := FMin;
  if AValue > FMax then AValue := FMax;
  if FValue <> AValue then
  begin
    FValue := AValue;
    Invalidate;
  end;
end;

procedure TCustomProgressBar.Paint;
var
  R: TRect;
  Pct: Double;
  FillW: Integer;
begin
  inherited Paint;
  Canvas.Brush.Color := clBtnFace;
  Canvas.Pen.Color := clGray;
  Canvas.Rectangle(ClientRect);
  R := ClientRect;
  InflateRect(R, -1, -1);
  Canvas.Pen.Color := clSilver;
  Canvas.Brush.Color := clWhite;
  Canvas.Rectangle(R);
  if (FMax > FMin) then
  begin
    Pct := (FValue - FMin) / (FMax - FMin);
    FillW := Round((R.Right - R.Left) * Pct);
    InflateRect(R, -1, -1);
    R.Right := R.Left + FillW;
    Canvas.Brush.Color := clHighlight;
    Canvas.FillRect(R);
  end;
end;

end.
