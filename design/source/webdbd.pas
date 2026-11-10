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
unit WebDBD;

{$mode objfpc}{$H+}

interface

uses
  Classes, SysUtils;

type

  TWebDBBackend = (wbMemory, wbLocal, wbSession, wbIndexedDB, wbWeb);

  TOnDBErrorEvent = procedure(Sender: TObject; ErrorMessage: String) of object;

  { TCustomWebDBConnection }

  TCustomWebDBConnection = class(TComponent)
  private
    FBackend: TWebDBBackend;
    FBaseURL: String;
    FDBName: String;
    FDBVersion: Integer;
    FStoreName: String;
  public
    constructor Create(AOwner: TComponent); override;
    property Backend: TWebDBBackend read FBackend write FBackend;
    property BaseURL: String read FBaseURL write FBaseURL;
    property DBName: String read FDBName write FDBName;
    property DBVersion: Integer read FDBVersion write FDBVersion;
    property StoreName: String read FStoreName write FStoreName;
  end;

  { TCustomWebDBTable }

  TCustomWebDBTable = class(TComponent)
  private
    FConnection: TCustomWebDBConnection;
    FTableName: String;
    FAutoLoad: Boolean;
    FProgressive: Boolean;
    FPageSize: Integer;
    FFilterText: String;
    FSortField: String;
    FSortDir: String;
    FOnLoad: TNotifyEvent;
    FOnSave: TNotifyEvent;
    FOnLoadError: TOnDBErrorEvent;
  public
    constructor Create(AOwner: TComponent); override;
    property Connection: TCustomWebDBConnection read FConnection write FConnection;
    property TableName: String read FTableName write FTableName;
    property AutoLoad: Boolean read FAutoLoad write FAutoLoad;
    property Progressive: Boolean read FProgressive write FProgressive;
    property PageSize: Integer read FPageSize write FPageSize;
    property FilterText: String read FFilterText write FFilterText;
    property SortField: String read FSortField write FSortField;
    property SortDir: String read FSortDir write FSortDir;
    property OnLoad: TNotifyEvent read FOnLoad write FOnLoad;
    property OnSave: TNotifyEvent read FOnSave write FOnSave;
    property OnLoadError: TOnDBErrorEvent read FOnLoadError write FOnLoadError;
  end;

implementation

{ TCustomWebDBConnection }

constructor TCustomWebDBConnection.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FBackend := wbMemory;
  FDBName := 'WCLDB';
  FDBVersion := 1;
  FStoreName := 'Tables';
end;

{ TCustomWebDBTable }

constructor TCustomWebDBTable.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FAutoLoad := False;
  FProgressive := False;
  FPageSize := 100;
end;

end.
