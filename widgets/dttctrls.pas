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
unit DttCtrls;

{$I pas2js_widget.inc}

interface

uses
  Classes,
  SysUtils,
  Types,
  Graphics,
  StdCtrls;

type

  { TCustomDateTimeEdit }

  TCustomDateTimeEdit = class(TCustomEdit)
  protected
    procedure DoEnter; override;
    procedure DoExit; override;
  end;

  { TCustomDateTimePicker }

  TCustomDateTimePicker = class(TCustomEdit)
  private
    function GetValue: TDateTime;
    procedure SetValue(AValue: TDateTime);
  protected
    function InputType: string; override;
  public
    property Value: TDateTime read GetValue write SetValue;
  end;

implementation

{ TCustomDateTimeEdit }

procedure TCustomDateTimeEdit.DoEnter;
begin
  inherited DoEnter;
  RealSetText(RealGetText);
end;

procedure TCustomDateTimeEdit.DoExit;
begin
  inherited DoExit;
  RealSetText(RealGetText);
end;

{ TCustomDateTimePicker }

function TCustomDateTimePicker.InputType: string;
begin
  Result := 'datetime-local';
end;

function TCustomDateTimePicker.GetValue: TDateTime;
var
  VText: string;
  VDateTime: TDateTime;
begin
  VText := RealGetText;
  if VText = '' then
    Result := 0
  else
  begin
    // HTML format: "YYYY-MM-DDTHH:MM" → convert to Pascal TDateTime
    VText := StringReplace(VText, 'T', ' ', []);
    if not TryStrToDateTime(VText, VDateTime) then
      Result := 0
    else
      Result := VDateTime;
  end;
end;

procedure TCustomDateTimePicker.SetValue(AValue: TDateTime);
begin
  if AValue = 0 then
    RealSetText('')
  else
    RealSetText(FormatDateTime('yyyy-mm-dd', AValue) + 'T' + FormatDateTime('hh:nn', AValue));
end;

end.
