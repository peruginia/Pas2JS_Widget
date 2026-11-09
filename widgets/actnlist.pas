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
unit ActnList;

{$I pas2js_widget.inc}

interface

uses
  Classes,
  SysUtils,
  Generics.Collections,
  Controls;

type
  /// A named action: controls and menu items linked to it follow Caption,
  /// Enabled, Visible, Checked, Hint and ShortCut; clicking runs OnExecute.
  TAction = class(TBasicAction)
  private
    FOnExecute: TNotifyEvent;
  public
    function Execute: Boolean; override;
  published
    property OnExecute: TNotifyEvent read FOnExecute write FOnExecute;
  end;

  /// Owns a list of actions. Actions can be added in code or streamed from
  /// the .lfm as nested "object Action1: TAction" blocks.
  TActionList = class(TComponent)
  private
    FActions: TList<TAction>;
    FOnChange: TNotifyEvent;
    function GetAction(AIndex: NativeInt): TAction;
    function GetActionCount: NativeInt;
    procedure SetOnChange(AValue: TNotifyEvent);
  protected
    function GetChildOwner: TComponent; override;
    function GetChildParent: TComponent; override;
    procedure Notification(AComponent: TComponent; Operation: TOperation); override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    function AddAction: TAction;
    function ActionByName(const AName: string): TAction;
    function IndexOf(AAction: TAction): NativeInt;
    /// Calls Update on every action (OnUpdate + client refresh).
    procedure Update;
    property Actions[AIndex: NativeInt]: TAction read GetAction; default;
    property ActionCount: NativeInt read GetActionCount;
  published
    property OnChange: TNotifyEvent read FOnChange write SetOnChange;
  end;

implementation

{ TAction }

function TAction.Execute: Boolean;
begin
  if Assigned(FOnExecute) then
    FOnExecute(Self);
  Result := True;
end;

{ TActionList }

constructor TActionList.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FActions := TList<TAction>.Create;
  FOnChange := nil;
end;

destructor TActionList.Destroy;
begin
  FActions.Free;
  FActions := nil;
  inherited Destroy;
end;

function TActionList.GetAction(AIndex: NativeInt): TAction;
begin
  Result := FActions[AIndex];
end;

function TActionList.GetActionCount: NativeInt;
begin
  Result := FActions.Count;
end;

procedure TActionList.SetOnChange(AValue: TNotifyEvent);
begin
  FOnChange := AValue;
end;

function TActionList.GetChildOwner: TComponent;
begin
  /// Actions streamed from the .lfm are owned by the list.
  Result := Self;
end;

function TActionList.GetChildParent: TComponent;
begin
  Result := nil;
end;

procedure TActionList.Notification(AComponent: TComponent; Operation: TOperation);
begin
  inherited Notification(AComponent, Operation);
  if (AComponent is TAction) and Assigned(FActions) and (AComponent.Owner = Self) then
  begin
    if (Operation = opInsert) then
      FActions.Add(TAction(AComponent))
    else
      FActions.Remove(TAction(AComponent));
    if Assigned(FOnChange) then
      FOnChange(Self);
  end;
end;

function TActionList.AddAction: TAction;
begin
  Result := TAction.Create(Self);
end;

function TActionList.ActionByName(const AName: string): TAction;
var
  VIndex: NativeInt;
begin
  Result := nil;
  for VIndex := 0 to (FActions.Count - 1) do
  begin
    if SameText(FActions[VIndex].Name, AName) then
    begin
      Result := FActions[VIndex];
      Exit;
    end;
  end;
end;

function TActionList.IndexOf(AAction: TAction): NativeInt;
begin
  Result := FActions.IndexOf(AAction);
end;

procedure TActionList.Update;
var
  VIndex: NativeInt;
begin
  for VIndex := 0 to (FActions.Count - 1) do
    FActions[VIndex].Update;
end;

initialization
  /// Lets the .lfm reader resolve nested "object Action1: TAction" blocks.
  RegisterClass(TAction);

end.
