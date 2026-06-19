{
  MIT License

  Copyright (c) 2025-2026

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
unit WebDB;

{$I pas2js_widget.inc}

interface

uses
  Classes, SysUtils, Types, JS, Web, DB, localjsondataset;

type

  TWebDBBackend = (
    wbMemory,
    wbLocal,
    wbSession,
    wbIndexedDB,
    wbWeb
  );

  TOnDBErrorEvent = procedure(Sender: TObject; ErrorMessage: String) of object;

  { TCustomWebDBConnection }

  TCustomWebDBConnection = class(TComponent)
  private
    FBackend: TWebDBBackend;
    FBaseURL: String;
    FDBName: String;
    FDBVersion: Integer;
    FStoreName: String;
    FMemory: TJSObject;
    procedure SetBackend(AValue: TWebDBBackend);
    function DoGet(Key, Filter, SortField, SortDir: String): TJSPromise;
    function DoPut(Key, Value: String): TJSPromise;
    function DoDelete(Key: String): TJSPromise;
    function DoGetPage(Key: String; Offset, Limit: Integer; Filter, SortField, SortDir: String): TJSPromise;
  protected
    procedure EnsureMethodsIncluded;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    function Get(Key: String; const Filter: String = ''; const SortField: String = ''; const SortDir: String = ''): TJSPromise;
    function Put(Key, Value: String): TJSPromise;
    function Delete(Key: String): TJSPromise;
    function GetPage(Key: String; Offset, Limit: Integer; const Filter: String = ''; const SortField: String = ''; const SortDir: String = ''): TJSPromise;
    property Backend: TWebDBBackend read FBackend write SetBackend;
    property BaseURL: String read FBaseURL write FBaseURL;
    property DBName: String read FDBName write FDBName;
    property DBVersion: Integer read FDBVersion write FDBVersion;
    property StoreName: String read FStoreName write FStoreName;
  end;

  { TCustomWebDBTable }

  TCustomWebDBTable = class(TComponent)
  private
    FConnection: TCustomWebDBConnection;
    FDataJson: TLocalJSONDataset;
    FTableName: String;
    FAutoLoad: Boolean;
    FProgressive: Boolean;
    FPageSize: Integer;
    FTotalRecords: NativeInt;
    FLoadedRecords: NativeInt;
    FBackingData: TJSArray;
    FFilterText: String;
    FSortField: String;
    FSortDir: String;
    FOnLoad: TNotifyEvent;
    FOnSave: TNotifyEvent;
    FOnLoadError: TOnDBErrorEvent;
    function GetActive: Boolean;
    function GetRows: TJSArray;
    procedure SetRows(AValue: TJSArray);
    procedure SetConnection(AValue: TCustomWebDBConnection);
    procedure SetProgressive(AValue: Boolean);
    procedure DoOnLoad;
    procedure DoOnSave;
    procedure DoOnLoadError(const AMsg: String);
    procedure UseConnectionGet(AKey: String);
  protected
    procedure Loaded; override;
  public
    constructor Create(AOwner: TComponent); override;
    destructor Destroy; override;
    procedure Load; async;
    procedure Save; async;
    procedure LoadNextPage; async;
    procedure LoadAll; async;
    procedure Open;
    procedure Close;
    procedure LoadFromArray(AArray: TJSArray);
    property DataJson: TLocalJSONDataset read FDataJson;
    property Active: Boolean read GetActive;
    property TotalRecords: NativeInt read FTotalRecords;
    property LoadedRecords: NativeInt read FLoadedRecords;
    property Rows: TJSArray read GetRows write SetRows;
    property Connection: TCustomWebDBConnection read FConnection write SetConnection;
    property TableName: String read FTableName write FTableName;
    property AutoLoad: Boolean read FAutoLoad write FAutoLoad;
    property Progressive: Boolean read FProgressive write SetProgressive;
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
  FBaseURL := '';
  FDBName := 'WCLDB';
  FDBVersion := 1;
  FStoreName := 'Tables';
  FMemory := TJSObject.new;
end;

destructor TCustomWebDBConnection.Destroy;
begin
  FMemory := nil;
  inherited Destroy;
end;

procedure TCustomWebDBConnection.SetBackend(AValue: TWebDBBackend);
begin
  if FBackend <> AValue then
    FBackend := AValue;
end;

procedure TCustomWebDBConnection.EnsureMethodsIncluded;
begin
  // Force pas2js compiler to include all backend code paths.
  // The condition uses a runtime value so the compiler cannot strip it.
  if FBackend <> wbMemory then
    DoGet('__NEVER__', '', '', '');
  if FBackend <> wbLocal then
    DoPut('__NEVER__', '');
  if FBackend <> wbSession then
    DoDelete('__NEVER__');
  if FBackend <> wbWeb then
    DoGetPage('__NEVER__', 0, 0, '', '', '');
end;

function TCustomWebDBConnection.Get(Key: String; const Filter: String = ''; const SortField: String = ''; const SortDir: String = ''): TJSPromise;
begin
  Result := DoGet(Key, Filter, SortField, SortDir);
end;

function TCustomWebDBConnection.Put(Key, Value: String): TJSPromise;
begin
  Result := DoPut(Key, Value);
end;

function TCustomWebDBConnection.Delete(Key: String): TJSPromise;
begin
  Result := DoDelete(Key);
end;

function TCustomWebDBConnection.GetPage(Key: String; Offset, Limit: Integer; const Filter: String = ''; const SortField: String = ''; const SortDir: String = ''): TJSPromise;
begin
  Result := DoGetPage(Key, Offset, Limit, Filter, SortField, SortDir);
end;

function TCustomWebDBConnection.DoGet(Key, Filter, SortField, SortDir: String): TJSPromise;
var
  Conn: TCustomWebDBConnection;
begin
  Conn := Self;

  Result := TJSPromise.new(procedure(resolve, reject: TJSPromiseResolver)
  begin
    case Conn.FBackend of
      wbMemory:
        asm
          resolve(Conn.FMemory[Key] !== undefined ? Conn.FMemory[Key] : '');
        end;
      wbLocal:
        asm
          resolve(window.localStorage.getItem(Key) || '');
        end;
      wbSession:
        asm
          resolve(window.sessionStorage.getItem(Key) || '');
        end;
      wbIndexedDB:
        asm
          var request = window.indexedDB.open(Conn.FDBName, Conn.FDBVersion);

          request.onupgradeneeded = function(event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains(Conn.FStoreName)) {
              db.createObjectStore(Conn.FStoreName);
            }
          };

          request.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction([Conn.FStoreName], 'readwrite');
            var store = transaction.objectStore(Conn.FStoreName);
            var getRequest = store.get(Key);

            getRequest.onsuccess = function() {
              if (getRequest.result !== undefined) {
                resolve(String(getRequest.result));
              } else {
                var lsData = window.localStorage.getItem(Key);
                if (lsData) {
                  store.put(lsData, Key);
                  window.localStorage.removeItem(Key);
                  resolve(lsData);
                } else {
                  resolve('');
                }
              }
            };

            getRequest.onerror = function() {
              resolve('');
            };
          };

          request.onerror = function(event) {
            resolve('');
          };
        end;
      wbWeb:
        asm
          var url = Conn.FBaseURL + '?table=' + Key;
          if (Filter) url += '&filter=' + encodeURIComponent(Filter);
          if (SortField) url += '&sort=' + encodeURIComponent(SortField) + '&order=' + (SortDir || 'asc');
          fetch(url)
            .then(function(response) {
              if (!response.ok) throw new Error('HTTP ' + response.status);
              return response.text();
            })
            .then(function(text) {
              resolve(text);
            })
            .catch(function(err) {
              console.error('WCL: Fetch error - ' + (err.message || err));
              reject(String(err.message || err));
            });
        end;
    end;
  end);
end;

function TCustomWebDBConnection.DoPut(Key, Value: String): TJSPromise;
var
  Conn: TCustomWebDBConnection;
begin
  Conn := Self;

  Result := TJSPromise.new(procedure(resolve, reject: TJSPromiseResolver)
  begin
    case Conn.FBackend of
      wbMemory:
        asm
          Conn.FMemory[Key] = Value;
          resolve(true);
        end;
      wbLocal:
        try
          window.localStorage.setItem(Key, Value);
          asm resolve(true); end;
        except
          asm reject('localStorage quota exceeded'); end;
        end;
      wbSession:
        try
          window.sessionStorage.setItem(Key, Value);
          asm resolve(true); end;
        except
          asm reject('sessionStorage quota exceeded'); end;
        end;
      wbIndexedDB:
        asm
          var request = window.indexedDB.open(Conn.FDBName, Conn.FDBVersion);

          request.onupgradeneeded = function(event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains(Conn.FStoreName)) {
              db.createObjectStore(Conn.FStoreName);
            }
          };

          request.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction([Conn.FStoreName], 'readwrite');
            var store = transaction.objectStore(Conn.FStoreName);

            store.put(Value, Key);

            transaction.oncomplete = function() {
              resolve(true);
            };

            transaction.onerror = function(e) {
              reject('IndexedDB transaction error');
            };
          };

          request.onerror = function(event) {
            reject('IndexedDB open error');
          };
        end;
      wbWeb:
        asm
          resolve(true);
        end;
    end;
  end);
end;

function TCustomWebDBConnection.DoDelete(Key: String): TJSPromise;
var
  Conn: TCustomWebDBConnection;
begin
  Conn := Self;

  Result := TJSPromise.new(procedure(resolve, reject: TJSPromiseResolver)
  begin
    case Conn.FBackend of
      wbMemory:
        asm
          delete Conn.FMemory[Key];
          resolve(true);
        end;
      wbLocal:
        asm
          window.localStorage.removeItem(Key);
          resolve(true);
        end;
      wbSession:
        asm
          window.sessionStorage.removeItem(Key);
          resolve(true);
        end;
      wbIndexedDB:
        asm
          var request = window.indexedDB.open(Conn.FDBName, Conn.FDBVersion);

          request.onupgradeneeded = function(event) {
            var db = event.target.result;
            if (!db.objectStoreNames.contains(Conn.FStoreName)) {
              db.createObjectStore(Conn.FStoreName);
            }
          };

          request.onsuccess = function(event) {
            var db = event.target.result;
            var transaction = db.transaction([Conn.FStoreName], 'readwrite');
            var store = transaction.objectStore(Conn.FStoreName);
            var delRequest = store.delete(Key);

            delRequest.onsuccess = function() {
              resolve(true);
            };

            delRequest.onerror = function() {
              reject('IndexedDB delete error');
            };
          };

          request.onerror = function(event) {
            reject('IndexedDB open error');
          };
        end;
      wbWeb:
        asm
          resolve(true);
        end;
    end;
  end);
end;

function TCustomWebDBConnection.DoGetPage(Key: String; Offset, Limit: Integer; Filter, SortField, SortDir: String): TJSPromise;
var
  Conn: TCustomWebDBConnection;
begin
  Conn := Self;
  Result := TJSPromise.new(procedure(resolve, reject: TJSPromiseResolver)
  begin
    if Conn.FBackend <> wbWeb then
    begin
      asm resolve(null); end;
    end
    else
    begin
      asm
        var url = Conn.FBaseURL + '?table=' + Key + '&offset=' + Offset + '&limit=' + Limit;
        if (Filter) url += '&filter=' + encodeURIComponent(Filter);
        if (SortField) url += '&sort=' + encodeURIComponent(SortField) + '&order=' + (SortDir || 'asc');
        fetch(url)
          .then(function(response) {
            if (!response.ok) throw new Error('HTTP ' + response.status);
            return response.json();
          })
          .then(function(data) {
            resolve(data);
          })
          .catch(function(err) {
            console.error('WCL: Page fetch error - ' + (err.message || err));
            reject(String(err.message || err));
          });
      end;
    end;
  end);
end;

{ TCustomWebDBTable }

constructor TCustomWebDBTable.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FConnection := nil;
  FTableName := '';
  FAutoLoad := False;
  FProgressive := False;
  FPageSize := 100;
  FTotalRecords := 0;
  FLoadedRecords := 0;
  FBackingData := TJSArray.New;
  FDataJson := TLocalJSONDataset.Create(nil);
end;

destructor TCustomWebDBTable.Destroy;
begin
  if Assigned(FDataJson) then
  begin
    FDataJson.Close;
    FDataJson.Free;
    FDataJson := nil;
  end;
  inherited Destroy;
end;

function TCustomWebDBTable.GetActive: Boolean;
begin
  Result := Assigned(FDataJson) and FDataJson.Active;
end;

function TCustomWebDBTable.GetRows: TJSArray;
begin
  if Assigned(FDataJson) then
    Result := TCustomLocalJSONDataset(FDataJson).Rows
  else
    Result := nil;
end;

procedure TCustomWebDBTable.SetRows(AValue: TJSArray);
begin
  if Assigned(FDataJson) then
    TCustomLocalJSONDataset(FDataJson).Rows := AValue;
end;

procedure TCustomWebDBTable.SetConnection(AValue: TCustomWebDBConnection);
begin
  if FConnection <> AValue then
    FConnection := AValue;
end;

procedure TCustomWebDBTable.SetProgressive(AValue: Boolean);
begin
  if FProgressive <> AValue then
  begin
    FProgressive := AValue;
    if not AValue then
      FLoadedRecords := 0;
  end;
end;

procedure TCustomWebDBTable.DoOnLoad;
begin
  if Assigned(FOnLoad) then
    FOnLoad(Self);
end;

procedure TCustomWebDBTable.DoOnSave;
begin
  if Assigned(FOnSave) then
    FOnSave(Self);
end;

procedure TCustomWebDBTable.DoOnLoadError(const AMsg: String);
begin
  if Assigned(FOnLoadError) then
    FOnLoadError(Self, AMsg);
end;

procedure TCustomWebDBTable.Loaded;
begin
  inherited Loaded;
  if FAutoLoad and Assigned(FConnection) and (FTableName <> '') then
  begin
    asm
      this.Load().catch(function(e) {
        // Error already handled inside Load via OnLoadError
      });
    end;
  end;
end;

procedure TCustomWebDBTable.Load; async;
var
  JsonStr: String;
  JData: JSValue;
  RawResult: JSValue;
  Arr: TJSArray;
  FirstRow: TJSObject;
  Keys: TStringDynArray;
  Key: String;
  FieldDef: TFieldDef;
  VVal: JSValue;
  FieldType: Integer;
begin
  {$push}{$hints off}
  if False then
  begin
    UseConnectionGet('');
  end;
  {$pop}

  try

    // Anti-tree-shaking: force pas2js to include all connection methods.
    // Uses runtime fields so the compiler cannot evaluate the condition at compile-time.
    if FProgressive and Assigned(FConnection) and (FPageSize = -999) then
    begin
      FConnection.Get('__anti_shake__');
      FConnection.GetPage('__anti_shake__', 0, 0);
      FConnection.Put('__anti_shake__', '');
      FConnection.Delete('__anti_shake__');
    end;

    if not Assigned(FConnection) then
      raise Exception.Create('Connection not assigned');
    if FTableName = '' then
      raise Exception.Create('TableName not set');


    if FProgressive and (FConnection.Backend = wbWeb) then
    begin
      FLoadedRecords := 0;
      asm
        RawResult = await this.FConnection.GetPage(this.FTableName, 0, this.FPageSize, this.FFilterText, this.FSortField, this.FSortDir);
      end;
      if RawResult <> nil then
      begin
        JData := TJSObject(RawResult)['data'];
        if isArray(JData) then
        begin
          Arr := TJSArray(JData);
          FBackingData := Arr;
          FDataJson.Close;
          TCustomLocalJSONDataset(FDataJson).Rows := Arr;
          if Arr.Length > 0 then
          begin
            if FDataJson.FieldDefs.Count = 0 then
            begin
              FirstRow := TJSObject(Arr[0]);
              Keys := TJSObject.keys(FirstRow);
              for Key in Keys do
              begin
                FieldDef := TFieldDef(FDataJson.FieldDefs.Add);
                FieldDef.Name := Key;
                VVal := FirstRow[Key];
                FieldType := 8;
                asm
                  if (typeof VVal === 'number') {
                    if (Number.isInteger(VVal))
                      FieldType = 2;
                    else
                      FieldType = 1;
                  } else if (typeof VVal === 'boolean') {
                    FieldType = 4;
                  }
                end;
                case FieldType of
                  1: FieldDef.DataType := ftFloat;
                  2: FieldDef.DataType := ftInteger;
                  4: FieldDef.DataType := ftBoolean;
                  else begin FieldDef.DataType := ftString; FieldDef.Size := 255; end;
                end;
              end;
            end;
          end;
          FDataJson.Open;
          FLoadedRecords := Arr.Length;
        end;
        asm
          if (RawResult.total !== undefined) {
            this.FTotalRecords = RawResult.total;
          }
        end;
      end;
    end
    else
    begin
      asm
        RawResult = await this.FConnection.Get(this.FTableName, this.FFilterText, this.FSortField, this.FSortDir);
      end;
      JsonStr := String(RawResult);
      if JsonStr <> '' then
      begin
        FDataJson.Close;
        JData := TJSJSON.parse(JsonStr);
        if isArray(JData) then
        begin
          Arr := TJSArray(JData);
          FBackingData := Arr;
          TCustomLocalJSONDataset(FDataJson).Rows := Arr;
          if Arr.Length > 0 then
          begin
            if FDataJson.FieldDefs.Count = 0 then
            begin
              FirstRow := TJSObject(Arr[0]);
              Keys := TJSObject.keys(FirstRow);
              for Key in Keys do
              begin
                FieldDef := TFieldDef(FDataJson.FieldDefs.Add);
                FieldDef.Name := Key;
                VVal := FirstRow[Key];
                FieldType := 8;
                asm
                  if (typeof VVal === 'number') {
                    if (Number.isInteger(VVal))
                      FieldType = 2;
                    else
                      FieldType = 1;
                  } else if (typeof VVal === 'boolean') {
                    FieldType = 4;
                  }
                end;
                case FieldType of
                  1: FieldDef.DataType := ftFloat;
                  2: FieldDef.DataType := ftInteger;
                  4: FieldDef.DataType := ftBoolean;
                  else begin FieldDef.DataType := ftString; FieldDef.Size := 255; end;
                end;
              end;
            end;
          end;
        end;
        FDataJson.Open;
        FTotalRecords := FDataJson.RecordCount;
        FLoadedRecords := FTotalRecords;
      end;
    end;

    DoOnLoad;
  except
    on E: Exception do
    begin
      DoOnLoadError(E.Message);
      raise;
    end;
  end;
end;

procedure TCustomWebDBTable.Save; async;
var
  JsonStr: String;
begin
  try
    if not Assigned(FConnection) then
      raise Exception.Create('Connection not assigned');
    if FTableName = '' then
      raise Exception.Create('TableName not set');
    if not Assigned(FDataJson) then
      raise Exception.Create('Dataset not available');

    asm
      JsonStr = JSON.stringify(this.FDataJson.Rows || []);
    end;

    asm
      await this.FConnection.Put(this.FTableName, JsonStr);
    end;

    DoOnSave;
  except
    on E: Exception do
      console.error('Save Error: ' + E.Message);
  end;
end;

procedure TCustomWebDBTable.LoadNextPage; async;
var
  Offset: Integer;
  PageResult: JSValue;
  NewRows: TJSArray;
begin
  if not FProgressive then Exit;
  if not Assigned(FConnection) then Exit;
  if not Assigned(FDataJson) then Exit;

  Offset := FLoadedRecords;
  try
    asm
        PageResult = await this.FConnection.GetPage(this.FTableName, Offset, this.FPageSize, this.FFilterText, this.FSortField, this.FSortDir);
    end;

    if PageResult <> nil then
    begin
      NewRows := TJSArray(TJSObject(PageResult)['data']);
      if isArray(NewRows) and (NewRows.Length > 0) then
      begin
        FDataJson.Close;
        asm
          this.FBackingData = this.FBackingData.concat(NewRows);
        end;
        TCustomLocalJSONDataset(FDataJson).Rows := FBackingData;
        FDataJson.Open;
        FLoadedRecords := FLoadedRecords + NewRows.Length;
      end;
      asm
        if (PageResult.total !== undefined) {
           this.FTotalRecords = PageResult.total;
         }
       end;
    end;
    DoOnLoad;
   except
     on E: Exception do
     begin
       DoOnLoadError(E.Message);
       raise;
     end;
   end;
 end;

 procedure TCustomWebDBTable.LoadAll; async;
begin
  if not FProgressive then
  begin
    asm
      await this.Load();
    end;
    Exit;
  end;

  try
    while FLoadedRecords < FTotalRecords do
    begin
      asm
        await this.LoadNextPage();
      end;
    end;
  except
    on E: Exception do
    begin
      DoOnLoadError(E.Message);
      raise;
    end;
  end;
end;

procedure TCustomWebDBTable.Open;
begin
  if Assigned(FDataJson) and not FDataJson.Active then
    FDataJson.Open;
end;

procedure TCustomWebDBTable.Close;
begin
  if Assigned(FDataJson) and FDataJson.Active then
    FDataJson.Close;
end;

procedure TCustomWebDBTable.LoadFromArray(AArray: TJSArray);
begin
  if not Assigned(FDataJson) then Exit;
  FDataJson.Close;
  SetRows(AArray);
  FDataJson.Open;
  FTotalRecords := FDataJson.RecordCount;
  FLoadedRecords := FTotalRecords;
end;

procedure TCustomWebDBTable.UseConnectionGet(AKey: String);
begin
  if Assigned(FConnection) then
    FConnection.Get(AKey);
end;

end.
