rtl.module("WebDB",["System","Classes","SysUtils","Types","JS","Web","DB","localjsondataset"],function () {
  "use strict";
  var $mod = this;
  this.TWebDBBackend = {"0": "wbMemory", wbMemory: 0, "1": "wbLocal", wbLocal: 1, "2": "wbSession", wbSession: 2, "3": "wbIndexedDB", wbIndexedDB: 3, "4": "wbWeb", wbWeb: 4};
  this.$rtti.$Enum("TWebDBBackend",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TWebDBBackend});
  this.$rtti.$MethodVar("TOnDBErrorEvent",{procsig: rtl.newTIProcSig([["Sender",pas.System.$rtti["TObject"]],["ErrorMessage",rtl.string]]), methodkind: 0});
  rtl.createClass(this,"TCustomWebDBConnection",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FBackend = 0;
      this.FBaseURL = "";
      this.FDBName = "";
      this.FDBVersion = 0;
      this.FStoreName = "";
      this.FMemory = null;
    };
    this.$final = function () {
      this.FMemory = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.SetBackend = function (AValue) {
      if (this.FBackend !== AValue) this.FBackend = AValue;
    };
    this.DoGet = function (Key, Filter, SortField, SortDir) {
      var $Self = this;
      var Result = null;
      var Conn = null;
      Conn = $Self;
      Result = new Promise(function (resolve, reject) {
        var $tmp = Conn.FBackend;
        if ($tmp === $mod.TWebDBBackend.wbMemory) {
          resolve(Conn.FMemory[Key] !== undefined ? Conn.FMemory[Key] : '')}
         else if ($tmp === $mod.TWebDBBackend.wbLocal) {
          resolve(window.localStorage.getItem(Key) || '')}
         else if ($tmp === $mod.TWebDBBackend.wbSession) {
          resolve(window.sessionStorage.getItem(Key) || '')}
         else if ($tmp === $mod.TWebDBBackend.wbIndexedDB) {
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
        } else if ($tmp === $mod.TWebDBBackend.wbWeb) {
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
        };
      });
      return Result;
    };
    this.DoPut = function (Key, Value) {
      var $Self = this;
      var Result = null;
      var Conn = null;
      Conn = $Self;
      Result = new Promise(function (resolve, reject) {
        var $tmp = Conn.FBackend;
        if ($tmp === $mod.TWebDBBackend.wbMemory) {
          Conn.FMemory[Key] = Value;
          resolve(true);
        } else if ($tmp === $mod.TWebDBBackend.wbLocal) {
          try {
            window.localStorage.setItem(Key,Value);
            resolve(true);
          } catch ($e) {
            reject('localStorage quota exceeded');
          }}
         else if ($tmp === $mod.TWebDBBackend.wbSession) {
          try {
            window.sessionStorage.setItem(Key,Value);
            resolve(true);
          } catch ($e) {
            reject('sessionStorage quota exceeded');
          }}
         else if ($tmp === $mod.TWebDBBackend.wbIndexedDB) {
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
        } else if ($tmp === $mod.TWebDBBackend.wbWeb) resolve(true);
      });
      return Result;
    };
    this.DoDelete = function (Key) {
      var $Self = this;
      var Result = null;
      var Conn = null;
      Conn = $Self;
      Result = new Promise(function (resolve, reject) {
        var $tmp = Conn.FBackend;
        if ($tmp === $mod.TWebDBBackend.wbMemory) {
          delete Conn.FMemory[Key];
          resolve(true);
        } else if ($tmp === $mod.TWebDBBackend.wbLocal) {
          window.localStorage.removeItem(Key);
          resolve(true);
        } else if ($tmp === $mod.TWebDBBackend.wbSession) {
          window.sessionStorage.removeItem(Key);
          resolve(true);
        } else if ($tmp === $mod.TWebDBBackend.wbIndexedDB) {
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
        } else if ($tmp === $mod.TWebDBBackend.wbWeb) resolve(true);
      });
      return Result;
    };
    this.DoGetPage = function (Key, Offset, Limit, Filter, SortField, SortDir) {
      var $Self = this;
      var Result = null;
      var Conn = null;
      Conn = $Self;
      Result = new Promise(function (resolve, reject) {
        if (Conn.FBackend !== $mod.TWebDBBackend.wbWeb) {
          resolve(null);
        } else {
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
        };
      });
      return Result;
    };
    this.EnsureMethodsIncluded = function () {
      if (this.FBackend !== $mod.TWebDBBackend.wbMemory) this.DoGet("__NEVER__","","","");
      if (this.FBackend !== $mod.TWebDBBackend.wbLocal) this.DoPut("__NEVER__","");
      if (this.FBackend !== $mod.TWebDBBackend.wbSession) this.DoDelete("__NEVER__");
      if (this.FBackend !== $mod.TWebDBBackend.wbWeb) this.DoGetPage("__NEVER__",0,0,"","","");
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FBackend = $mod.TWebDBBackend.wbMemory;
      this.FBaseURL = "";
      this.FDBName = "WCLDB";
      this.FDBVersion = 1;
      this.FStoreName = "Tables";
      this.FMemory = new Object();
      return this;
    };
    this.Destroy = function () {
      this.FMemory = null;
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.Get = function (Key, Filter, SortField, SortDir) {
      var Result = null;
      Result = this.DoGet(Key,Filter,SortField,SortDir);
      return Result;
    };
    this.Put = function (Key, Value) {
      var Result = null;
      Result = this.DoPut(Key,Value);
      return Result;
    };
    this.Delete = function (Key) {
      var Result = null;
      Result = this.DoDelete(Key);
      return Result;
    };
    this.GetPage = function (Key, Offset, Limit, Filter, SortField, SortDir) {
      var Result = null;
      Result = this.DoGetPage(Key,Offset,Limit,Filter,SortField,SortDir);
      return Result;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  rtl.createClass(this,"TCustomWebDBTable",pas.Classes.TComponent,function () {
    this.$init = function () {
      pas.Classes.TComponent.$init.call(this);
      this.FConnection = null;
      this.FDataJson = null;
      this.FTableName = "";
      this.FAutoLoad = false;
      this.FProgressive = false;
      this.FPageSize = 0;
      this.FTotalRecords = 0;
      this.FLoadedRecords = 0;
      this.FBackingData = null;
      this.FFilterText = "";
      this.FSortField = "";
      this.FSortDir = "";
      this.FOnLoad = null;
      this.FOnSave = null;
      this.FOnLoadError = null;
    };
    this.$final = function () {
      this.FConnection = undefined;
      this.FDataJson = undefined;
      this.FBackingData = undefined;
      this.FOnLoad = undefined;
      this.FOnSave = undefined;
      this.FOnLoadError = undefined;
      pas.Classes.TComponent.$final.call(this);
    };
    this.GetActive = function () {
      var Result = false;
      Result = (this.FDataJson != null) && this.FDataJson.GetActive();
      return Result;
    };
    this.GetRows = function () {
      var Result = null;
      if (this.FDataJson != null) {
        Result = this.FDataJson.FRows}
       else Result = null;
      return Result;
    };
    this.SetRows = function (AValue) {
      if (this.FDataJson != null) this.FDataJson.SetRows(AValue);
    };
    this.SetConnection = function (AValue) {
      if (this.FConnection !== AValue) this.FConnection = AValue;
    };
    this.SetProgressive = function (AValue) {
      if (this.FProgressive !== AValue) {
        this.FProgressive = AValue;
        if (!AValue) this.FLoadedRecords = 0;
      };
    };
    this.DoOnLoad = function () {
      if (this.FOnLoad != null) this.FOnLoad(this);
    };
    this.DoOnSave = function () {
      if (this.FOnSave != null) this.FOnSave(this);
    };
    this.DoOnLoadError = function (AMsg) {
      if (this.FOnLoadError != null) this.FOnLoadError(this,AMsg);
    };
    this.UseConnectionGet = function (AKey) {
      if (this.FConnection != null) this.FConnection.Get(AKey,"","","");
    };
    this.Loaded = function () {
      pas.Classes.TComponent.Loaded.call(this);
      if (this.FAutoLoad && (this.FConnection != null) && (this.FTableName !== "")) {
        this.Load().catch(function(e) {
          // Error already handled inside Load via OnLoadError
        });
      };
    };
    this.Create$1 = function (AOwner) {
      pas.Classes.TComponent.Create$1.call(this,AOwner);
      this.FConnection = null;
      this.FTableName = "";
      this.FAutoLoad = false;
      this.FProgressive = false;
      this.FPageSize = 100;
      this.FTotalRecords = 0;
      this.FLoadedRecords = 0;
      this.FBackingData = new Array();
      this.FDataJson = pas.localjsondataset.TLocalJSONDataset.$create("Create$1",[null]);
      return this;
    };
    this.Destroy = function () {
      if (this.FDataJson != null) {
        this.FDataJson.Close();
        rtl.free(this,"FDataJson");
        this.FDataJson = null;
      };
      pas.Classes.TComponent.Destroy.call(this);
    };
    this.Load = async function () {
      var JsonStr = "";
      var JData = undefined;
      var RawResult = undefined;
      var Arr = null;
      var FirstRow = null;
      var Keys = [];
      var Key = "";
      var FieldDef = null;
      var VVal = undefined;
      var FieldType = 0;
      if (false) {
        this.UseConnectionGet("");
      };
      try {
        if (this.FProgressive && (this.FConnection != null) && (this.FPageSize === -999)) {
          this.FConnection.Get("__anti_shake__","","","");
          this.FConnection.GetPage("__anti_shake__",0,0,"","","");
          this.FConnection.Put("__anti_shake__","");
          this.FConnection.Delete("__anti_shake__");
        };
        if (!(this.FConnection != null)) throw pas.SysUtils.Exception.$create("Create$1",["Connection not assigned"]);
        if (this.FTableName === "") throw pas.SysUtils.Exception.$create("Create$1",["TableName not set"]);
        if (this.FProgressive && (this.FConnection.FBackend === $mod.TWebDBBackend.wbWeb)) {
          this.FLoadedRecords = 0;
          RawResult = await this.FConnection.GetPage(this.FTableName, 0, this.FPageSize, this.FFilterText, this.FSortField, this.FSortDir);
          if (RawResult != null) {
            JData = RawResult["data"];
            if (rtl.isArray(JData)) {
              Arr = JData;
              this.FBackingData = Arr;
              this.FDataJson.Close();
              this.FDataJson.SetRows(Arr);
              if (Arr.length > 0) {
                if (this.FDataJson.FFieldDefs.GetCount() === 0) {
                  FirstRow = Arr[0];
                  Keys = Object.keys(FirstRow);
                  for (var $in = Keys, $l = 0, $end = rtl.length($in) - 1; $l <= $end; $l++) {
                    Key = $in[$l];
                    FieldDef = this.FDataJson.FFieldDefs.Add();
                    FieldDef.SetDisplayName(Key);
                    VVal = FirstRow[Key];
                    FieldType = 8;
                    if (typeof VVal === 'number') {
                      if (Number.isInteger(VVal))
                        FieldType = 2;
                      else
                        FieldType = 1;
                    } else if (typeof VVal === 'boolean') {
                      FieldType = 4;
                    };
                    var $tmp = FieldType;
                    if ($tmp === 1) {
                      FieldDef.SetDataType(pas.DB.TFieldType.ftFloat)}
                     else if ($tmp === 2) {
                      FieldDef.SetDataType(pas.DB.TFieldType.ftInteger)}
                     else if ($tmp === 4) {
                      FieldDef.SetDataType(pas.DB.TFieldType.ftBoolean)}
                     else {
                      FieldDef.SetDataType(pas.DB.TFieldType.ftString);
                      FieldDef.SetSize(255);
                    };
                  };
                };
              };
              this.FDataJson.Open();
              this.FLoadedRecords = Arr.length;
            };
            if (RawResult.total !== undefined) {
              this.FTotalRecords = RawResult.total;
            };
          };
        } else {
          RawResult = await this.FConnection.Get(this.FTableName, this.FFilterText, this.FSortField, this.FSortDir);
          JsonStr = "" + RawResult;
          if (JsonStr !== "") {
            this.FDataJson.Close();
            JData = JSON.parse(JsonStr);
            if (rtl.isArray(JData)) {
              Arr = JData;
              this.FBackingData = Arr;
              this.FDataJson.SetRows(Arr);
              if (Arr.length > 0) {
                if (this.FDataJson.FFieldDefs.GetCount() === 0) {
                  FirstRow = Arr[0];
                  Keys = Object.keys(FirstRow);
                  for (var $in1 = Keys, $l1 = 0, $end1 = rtl.length($in1) - 1; $l1 <= $end1; $l1++) {
                    Key = $in1[$l1];
                    FieldDef = this.FDataJson.FFieldDefs.Add();
                    FieldDef.SetDisplayName(Key);
                    VVal = FirstRow[Key];
                    FieldType = 8;
                    if (typeof VVal === 'number') {
                      if (Number.isInteger(VVal))
                        FieldType = 2;
                      else
                        FieldType = 1;
                    } else if (typeof VVal === 'boolean') {
                      FieldType = 4;
                    };
                    var $tmp1 = FieldType;
                    if ($tmp1 === 1) {
                      FieldDef.SetDataType(pas.DB.TFieldType.ftFloat)}
                     else if ($tmp1 === 2) {
                      FieldDef.SetDataType(pas.DB.TFieldType.ftInteger)}
                     else if ($tmp1 === 4) {
                      FieldDef.SetDataType(pas.DB.TFieldType.ftBoolean)}
                     else {
                      FieldDef.SetDataType(pas.DB.TFieldType.ftString);
                      FieldDef.SetSize(255);
                    };
                  };
                };
              };
            };
            this.FDataJson.Open();
            this.FTotalRecords = this.FDataJson.GetRecordCount();
            this.FLoadedRecords = this.FTotalRecords;
          };
        };
        this.DoOnLoad();
      } catch ($e) {
        if (pas.SysUtils.Exception.isPrototypeOf($e)) {
          var E = $e;
          this.DoOnLoadError(E.fMessage);
          throw $e;
        } else throw $e
      };
    };
    this.Save = async function () {
      var JsonStr = "";
      try {
        if (!(this.FConnection != null)) throw pas.SysUtils.Exception.$create("Create$1",["Connection not assigned"]);
        if (this.FTableName === "") throw pas.SysUtils.Exception.$create("Create$1",["TableName not set"]);
        if (!(this.FDataJson != null)) throw pas.SysUtils.Exception.$create("Create$1",["Dataset not available"]);
        JsonStr = JSON.stringify(this.FDataJson.Rows || []);
        await this.FConnection.Put(this.FTableName, JsonStr);
        this.DoOnSave();
      } catch ($e) {
        if (pas.SysUtils.Exception.isPrototypeOf($e)) {
          var E = $e;
          window.console.error("Save Error: " + E.fMessage);
        } else throw $e
      };
    };
    this.LoadNextPage = async function () {
      var Offset = 0;
      var PageResult = undefined;
      var NewRows = null;
      if (!this.FProgressive) return;
      if (!(this.FConnection != null)) return;
      if (!(this.FDataJson != null)) return;
      Offset = this.FLoadedRecords;
      try {
        PageResult = await this.FConnection.GetPage(this.FTableName, Offset, this.FPageSize, this.FFilterText, this.FSortField, this.FSortDir);
        if (PageResult != null) {
          NewRows = PageResult["data"];
          if (rtl.isArray(NewRows) && (NewRows.length > 0)) {
            this.FDataJson.Close();
            this.FBackingData = this.FBackingData.concat(NewRows);
            this.FDataJson.SetRows(this.FBackingData);
            this.FDataJson.Open();
            this.FLoadedRecords = this.FLoadedRecords + NewRows.length;
          };
          if (PageResult.total !== undefined) {
            this.FTotalRecords = PageResult.total;
          };
        };
        this.DoOnLoad();
      } catch ($e) {
        if (pas.SysUtils.Exception.isPrototypeOf($e)) {
          var E = $e;
          this.DoOnLoadError(E.fMessage);
          throw $e;
        } else throw $e
      };
    };
    this.LoadAll = async function () {
      if (!this.FProgressive) {
        await this.Load();
        return;
      };
      try {
        while (this.FLoadedRecords < this.FTotalRecords) {
          await this.LoadNextPage();
        };
      } catch ($e) {
        if (pas.SysUtils.Exception.isPrototypeOf($e)) {
          var E = $e;
          this.DoOnLoadError(E.fMessage);
          throw $e;
        } else throw $e
      };
    };
    this.Open = function () {
      if ((this.FDataJson != null) && !this.FDataJson.GetActive()) this.FDataJson.Open();
    };
    this.Close = function () {
      if ((this.FDataJson != null) && this.FDataJson.GetActive()) this.FDataJson.Close();
    };
    this.LoadFromArray = function (AArray) {
      var FirstRow = null;
      var Keys = [];
      var Key = "";
      var FieldDef = null;
      var VVal = undefined;
      var FieldType = 0;
      if (!(this.FDataJson != null)) return;
      this.FDataJson.Close();
      this.SetRows(AArray);
      if ((AArray != null) && (AArray.length > 0) && (this.FDataJson.FFieldDefs.GetCount() === 0)) {
        FirstRow = AArray[0];
        Keys = Object.keys(FirstRow);
        for (var $in = Keys, $l = 0, $end = rtl.length($in) - 1; $l <= $end; $l++) {
          Key = $in[$l];
          FieldDef = this.FDataJson.FFieldDefs.Add();
          FieldDef.SetDisplayName(Key);
          VVal = FirstRow[Key];
          FieldType = 8;
          if (typeof VVal === 'number') {
            if (Number.isInteger(VVal))
              FieldType = 2;
            else
              FieldType = 1;
          } else if (typeof VVal === 'boolean') {
            FieldType = 4;
          };
          var $tmp = FieldType;
          if ($tmp === 1) {
            FieldDef.SetDataType(pas.DB.TFieldType.ftFloat)}
           else if ($tmp === 2) {
            FieldDef.SetDataType(pas.DB.TFieldType.ftInteger)}
           else if ($tmp === 4) {
            FieldDef.SetDataType(pas.DB.TFieldType.ftBoolean)}
           else {
            FieldDef.SetDataType(pas.DB.TFieldType.ftString);
            FieldDef.SetSize(255);
          };
        };
      };
      this.FDataJson.Open();
      this.FTotalRecords = this.FDataJson.GetRecordCount();
      this.FLoadedRecords = this.FTotalRecords;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
});
//# sourceMappingURL=webdb.js.map
