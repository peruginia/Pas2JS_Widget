rtl.module("DataGrid",["System","Classes","SysUtils","Types","JS","Web","Graphics","Controls","DB","localjsondataset","WebDB"],function () {
  "use strict";
  var $mod = this;
  var $impl = $mod.$impl;
  this.$rtti.$Class("TCustomDataGrid");
  this.TColumnFormat = {"0": "cfBoolean", cfBoolean: 0, "1": "cfDataTime", cfDataTime: 1, "2": "cfNumber", cfNumber: 2, "3": "cfCurrency", cfCurrency: 3, "4": "cfString", cfString: 4};
  this.$rtti.$Enum("TColumnFormat",{minvalue: 0, maxvalue: 4, ordtype: 1, enumtype: this.TColumnFormat});
  rtl.createClass(this,"TDataColumn",pas.Classes.TCollectionItem,function () {
    this.$init = function () {
      pas.Classes.TCollectionItem.$init.call(this);
      this.FAlignment = 0;
      this.FColor = 0;
      this.FDisplayMask = "";
      this.FFont = null;
      this.FTitleFont = null;
      this.FFormat = 0;
      this.FHint = "";
      this.FName = "";
      this.FTag = 0;
      this.FTitle = "";
      this.FUpdateCount$1 = 0;
      this.FValueChecked = "";
      this.FValueUnchecked = "";
      this.FVisible = false;
      this.FWidth = 0;
      this.FResponsiveMinWidth = 0;
      this.FResponsiveMaxWidth = 0;
    };
    this.$final = function () {
      this.FFont = undefined;
      this.FTitleFont = undefined;
      pas.Classes.TCollectionItem.$final.call(this);
    };
    this.GetGrid = function () {
      var Result = null;
      if ((this.FCollection != null) && $mod.TDataColumns.isPrototypeOf(this.FCollection)) {
        Result = this.FCollection.FGrid;
      } else {
        Result = null;
      };
      return Result;
    };
    this.SetAlignment = function (AValue) {
      if (this.FAlignment !== AValue) {
        this.FAlignment = AValue;
        this.ColumnChanged();
      };
    };
    this.SetColor = function (AValue) {
      if (this.FColor !== AValue) {
        this.FColor = AValue;
        this.ColumnChanged();
      };
    };
    this.SetDisplayMask = function (AValue) {
      if (this.FDisplayMask !== AValue) {
        this.FDisplayMask = AValue;
        this.ColumnChanged();
      };
    };
    this.SetFont = function (AValue) {
      if (!this.FFont.IsEqual(AValue)) {
        this.FFont.Assign(AValue);
      };
    };
    this.SetTitleFont = function (AValue) {
      if (!this.FTitleFont.IsEqual(AValue)) {
        this.FTitleFont.Assign(AValue);
      };
    };
    this.SetFormat = function (AValue) {
      if (this.FFormat !== AValue) {
        this.FFormat = AValue;
        this.ColumnChanged();
      };
    };
    this.SetName = function (AValue) {
      if (this.FName !== AValue) {
        this.FName = AValue;
        this.ColumnChanged();
      };
    };
    this.SetTitle = function (AValue) {
      if (this.FTitle !== AValue) {
        this.FTitle = AValue;
        this.ColumnChanged();
      };
    };
    this.SetValueChecked = function (AValue) {
      if (this.FValueChecked !== AValue) {
        this.FValueChecked = AValue;
        this.ColumnChanged();
      };
    };
    this.SetValueUnchecked = function (AValue) {
      if (this.FValueUnchecked !== AValue) {
        this.FValueUnchecked = AValue;
        this.ColumnChanged();
      };
    };
    this.SetVisible = function (AValue) {
      if (this.FVisible !== AValue) {
        this.FVisible = AValue;
        this.ColumnChanged();
      };
    };
    this.SetWidth = function (AValue) {
      if (this.FWidth !== AValue) {
        this.FWidth = AValue;
        this.ColumnChanged();
      };
    };
    this.SetResponsiveMinWidth = function (AValue) {
      if (this.FResponsiveMinWidth !== AValue) {
        this.FResponsiveMinWidth = AValue;
        this.ColumnChanged();
      };
    };
    this.SetResponsiveMaxWidth = function (AValue) {
      if (this.FResponsiveMaxWidth !== AValue) {
        this.FResponsiveMaxWidth = AValue;
        this.ColumnChanged();
      };
    };
    this.ColumnChanged = function () {
      if (this.FUpdateCount$1 === 0) {
        this.Changed(false);
      };
    };
    this.GetDisplayName = function () {
      var Result = "";
      if (this.FTitle !== "") {
        Result = this.FTitle;
      } else {
        Result = "Column " + pas.SysUtils.IntToStr(this.GetIndex());
      };
      return Result;
    };
    this.FillDefaultFont = function () {
      if (this.GetGrid() != null) {
        this.FFont.Assign(this.GetGrid().FFont);
        this.FTitleFont.Assign(this.GetGrid().FFont);
      };
    };
    this.FontChanged = function (Sender) {
      this.ColumnChanged();
    };
    this.GetDefaultValueChecked = function () {
      var Result = "";
      Result = "1";
      return Result;
    };
    this.GetDefaultValueUnchecked = function () {
      var Result = "";
      Result = "0";
      return Result;
    };
    this.Create$1 = function (ACollection) {
      pas.Classes.TCollectionItem.Create$1.call(this,ACollection);
      this.FFont = pas.Graphics.TFont.$create("Create$1");
      this.FFont.FOnChange = rtl.createCallback(this,"FontChanged");
      this.FTitleFont = pas.Graphics.TFont.$create("Create$1");
      this.FTitleFont.FOnChange = rtl.createCallback(this,"FontChanged");
      this.FAlignment = pas.Classes.TAlignment.taLeftJustify;
      this.FColor = 16777215;
      this.FDisplayMask = "";
      this.FFormat = $mod.TColumnFormat.cfString;
      this.FHint = "";
      this.FName = "";
      this.FTag = 0;
      this.FTitle = "";
      this.FUpdateCount$1 = 0;
      this.FValueChecked = this.GetDefaultValueChecked();
      this.FValueUnchecked = this.GetDefaultValueUnchecked();
      this.FVisible = true;
      this.FWidth = 0;
      this.FResponsiveMinWidth = 0;
      this.FResponsiveMaxWidth = 0;
      this.FillDefaultFont();
      return this;
    };
    this.Destroy = function () {
      this.FFont.$destroy("Destroy");
      this.FFont = null;
      this.FTitleFont.$destroy("Destroy");
      this.FTitleFont = null;
      pas.Classes.TCollectionItem.Destroy.call(this);
    };
    this.Assign = function (Source) {
      var VColumn = null;
      if ((Source != null) && $mod.TDataColumn.isPrototypeOf(Source)) {
        this.BeginUpdate();
        try {
          VColumn = Source;
          this.FAlignment = VColumn.FAlignment;
          this.FColor = VColumn.FColor;
          this.FDisplayMask = VColumn.FDisplayMask;
          this.FFont.Assign(VColumn.FFont);
          this.FFormat = VColumn.FFormat;
          this.FHint = VColumn.FHint;
          this.FName = VColumn.FName;
          this.FTag = VColumn.FTag;
          this.FTitle = VColumn.FTitle;
          this.FValueChecked = VColumn.FValueChecked;
          this.FValueUnchecked = VColumn.FValueUnchecked;
          this.FVisible = VColumn.FVisible;
          this.FWidth = VColumn.FWidth;
          this.FResponsiveMinWidth = VColumn.FResponsiveMinWidth;
          this.FResponsiveMaxWidth = VColumn.FResponsiveMaxWidth;
        } finally {
          this.EndUpdate();
        };
      } else {
        pas.Classes.TPersistent.Assign.call(this,Source);
      };
    };
    this.BeginUpdate = function () {
      this.FUpdateCount$1 += 1;
    };
    this.EndUpdate = function () {
      if (this.FUpdateCount$1 > 0) {
        this.FUpdateCount$1 -= 1;
        if (this.FUpdateCount$1 === 0) {
          this.ColumnChanged();
        };
      };
    };
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["ACollection",pas.Classes.$rtti["TCollection"]]]);
    $r.addProperty("Alignment",2,pas.Classes.$rtti["TAlignment"],"FAlignment","SetAlignment");
    $r.addProperty("Color",2,rtl.longint,"FColor","SetColor");
    $r.addProperty("DisplayMask",2,rtl.string,"FDisplayMask","SetDisplayMask");
    $r.addProperty("Font",2,pas.Graphics.$rtti["TFont"],"FFont","SetFont");
    $r.addProperty("TitleFont",2,pas.Graphics.$rtti["TFont"],"FTitleFont","SetTitleFont");
    $r.addProperty("Format",2,$mod.$rtti["TColumnFormat"],"FFormat","SetFormat");
    $r.addProperty("Hint",0,rtl.string,"FHint","FHint");
    $r.addProperty("Name",2,rtl.string,"FName","SetName");
    $r.addProperty("Tag",0,rtl.longint,"FTag","FTag");
    $r.addProperty("Title",2,rtl.string,"FTitle","SetTitle");
    $r.addProperty("ValueChecked",2,rtl.string,"FValueChecked","SetValueChecked");
    $r.addProperty("ValueUnchecked",2,rtl.string,"FValueUnchecked","SetValueUnchecked");
    $r.addProperty("Visible",2,rtl.boolean,"FVisible","SetVisible");
    $r.addProperty("Width",2,rtl.nativeint,"FWidth","SetWidth");
    $r.addProperty("ResponsiveMinWidth",2,rtl.longint,"FResponsiveMinWidth","SetResponsiveMinWidth",{Default: 0});
    $r.addProperty("ResponsiveMaxWidth",2,rtl.longint,"FResponsiveMaxWidth","SetResponsiveMaxWidth",{Default: 0});
  });
  rtl.createClass(this,"TDataColumns",pas.Classes.TCollection,function () {
    this.$init = function () {
      pas.Classes.TCollection.$init.call(this);
      this.FGrid = null;
    };
    this.$final = function () {
      this.FGrid = undefined;
      pas.Classes.TCollection.$final.call(this);
    };
    this.GetColumn = function (AIndex) {
      var Result = null;
      Result = this.GetItem(AIndex);
      return Result;
    };
    this.SetColumn = function (AIndex, AValue) {
      this.GetColumn(AIndex).Assign(AValue);
    };
    this.GetOwner = function () {
      var Result = null;
      Result = this.FGrid;
      return Result;
    };
    this.Update = function (AItem) {
      this.FGrid.ColumnsChanged(AItem);
    };
    this.Create$2 = function (AGrid) {
      pas.Classes.TCollection.Create$1.call(this,$mod.TDataColumn);
      this.FGrid = AGrid;
      return this;
    };
    this.Add$1 = function () {
      var Result = null;
      Result = pas.Classes.TCollection.Add.call(this);
      return Result;
    };
    this.HasIndex = function (AIndex) {
      var Result = false;
      Result = (AIndex > -1) && (AIndex < this.GetCount());
      return Result;
    };
    var $r = this.$rtti;
    $r.addMethod("Create$2",2,[["AGrid",$mod.$rtti["TCustomDataGrid"]]]);
  });
  this.TSortOrder = {"0": "soAscending", soAscending: 0, "1": "soDescending", soDescending: 1};
  this.$rtti.$Enum("TSortOrder",{minvalue: 0, maxvalue: 1, ordtype: 1, enumtype: this.TSortOrder});
  this.$rtti.$MethodVar("TOnClickEvent",{procsig: rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["ACol",rtl.nativeint],["ARow",rtl.nativeint]]), methodkind: 0});
  this.$rtti.$MethodVar("TOnHeaderClick",{procsig: rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["ACol",rtl.nativeint]]), methodkind: 0});
  this.$rtti.$MethodVar("TOnDrawColumnCell",{procsig: rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["ColumnName",rtl.string],["Cell",pas.Web.$rtti["TJSHTMLTableCellElement"],1]]), methodkind: 0});
  this.$rtti.$MethodVar("TOnAddSeparator",{procsig: rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["data",rtl.string,1]]), methodkind: 0});
  this.$rtti.$MethodVar("TDataGridEvent",{procsig: rtl.newTIProcSig([["AEvent",pas.weborworker.$rtti["TJSEvent"]]],rtl.boolean), methodkind: 1});
  rtl.createClass(this,"TCustomDataGrid",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FAutoCreateColumns = false;
      this.FColumnClickSorts = false;
      this.FColumns = null;
      this.FData = null;
      this.FDataJSon = null;
      this.FDataTable = null;
      this.FTableDataLoaded = null;
      this.FRowSelect = false;
      this.fSelRow = 0;
      this.fSelCol = 0;
      this.fontouchstart = null;
      this.fontouchmove = null;
      this.fontouchcancel = null;
      this.fontouchend = null;
      this.fCurrentRID = "";
      this.fOnDrawColumnCell = null;
      this.fOnAddSeparator = null;
      this.fOnEndDraw = null;
      this.FDefColWidth = 0;
      this.FDefRowHeight = 0;
      this.FShowHeader = false;
      this.FSortColumn = 0;
      this.FSortOrder = 0;
      this.FOnCellClick = null;
      this.FOnHeaderClick = null;
      this.FOnCellDblClick = null;
      this.FLastClickTime = 0.0;
      this.FLastClickCell = null;
      this.FLastTouchTime = 0.0;
      this.FAlternateRowColor = 0;
      this.FNeedsFullRender = false;
      this.FInfiniteScroll = false;
      this.FScrollLoading = false;
      this.FResponsiveMode = false;
      this.FResponsiveBreakpoint = 0;
      this.FIsCardVisible = false;
      this.FLastCardRow = 0;
      this.FLastCardCol = 0;
      this.FTouchStartX = 0.0;
      this.FTouchStartY = 0.0;
      this.FLastResponsiveState = "";
      this.FFilterBox = false;
      this.FFilterText = "";
      this.FFilterTimer = 0;
      this.FGroupField = "";
      this.FGroupCollapsed = null;
      this.FScopeId = "";
      this.FStyleElement = null;
      this.FHandleWindowResize = null;
      this.FActiveCell = null;
      this.Body = null;
    };
    this.$final = function () {
      this.FColumns = undefined;
      this.FData = undefined;
      this.FDataJSon = undefined;
      this.FDataTable = undefined;
      this.FTableDataLoaded = undefined;
      this.fontouchstart = undefined;
      this.fontouchmove = undefined;
      this.fontouchcancel = undefined;
      this.fontouchend = undefined;
      this.fOnDrawColumnCell = undefined;
      this.fOnAddSeparator = undefined;
      this.fOnEndDraw = undefined;
      this.FOnCellClick = undefined;
      this.FOnHeaderClick = undefined;
      this.FOnCellDblClick = undefined;
      this.FLastClickCell = undefined;
      this.FGroupCollapsed = undefined;
      this.FStyleElement = undefined;
      this.FHandleWindowResize = undefined;
      this.FActiveCell = undefined;
      this.Body = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.DoTableDataLoaded = function (Sender) {
      this.FScrollLoading = false;
      this.FData = null;
      if (this.FTableDataLoaded != null) this.FTableDataLoaded(Sender);
      if (this.FDataTable != null) this.SetDataJson(this.FDataTable.FDataJson);
    };
    this.GetColCount = function () {
      var Result = 0;
      Result = this.FColumns.GetCount();
      return Result;
    };
    this.GetRowCount = function () {
      var Result = 0;
      var VBody = null;
      VBody = this.FHandleElement.querySelector("tbody");
      Result = pas.Controls.IfThen$2(VBody != null,VBody.rows.length,0);
      return Result;
    };
    this.SetColumnClickSorts = function (AValue) {
      if (this.FColumnClickSorts !== AValue) {
        this.FColumnClickSorts = AValue;
        this.Changed();
      };
    };
    this.SetColumns = function (AValue) {
      this.FColumns.Assign(AValue);
    };
    this.SetData = function (AValue) {
      if (this.FData !== AValue) {
        this.BeginUpdate();
        try {
          this.FData = AValue;
          this.FDataJSon = null;
          this.AutomaticallyCreateColumns();
        } finally {
          this.EndUpdate();
        };
      };
    };
    this.SetDataJson = function (AValue) {
      if (this.FDataJSon !== AValue) {
        this.BeginUpdate();
        try {
          this.FData = null;
          this.FDataJSon = AValue;
          this.FNeedsFullRender = true;
          this.AutomaticallyCreateColumns();
        } finally {
          this.EndUpdate();
        };
      } else {
        this.Changed();
      };
    };
    this.SetDataTable = function (AValue) {
      if (this.FDataTable !== AValue) {
        if (this.FDataTable != null) this.FDataTable.FOnLoad = this.FTableDataLoaded;
        this.FDataTable = AValue;
        if (this.FDataTable != null) {
          this.FTableDataLoaded = this.FDataTable.FOnLoad;
          this.FDataTable.FOnLoad = rtl.createCallback(this,"DoTableDataLoaded");
          if (this.FDataTable.GetActive()) {
            this.SetDataJson(this.FDataTable.FDataJson)}
           else this.SetDataJson(null);
        } else this.SetDataJson(null);
      };
    };
    this.SetDefColWidth = function (AValue) {
      if (this.FDefColWidth !== AValue) {
        this.FDefColWidth = AValue;
        this.FNeedsFullRender = true;
        this.Changed();
      };
    };
    this.SetDefRowHeight = function (AValue) {
      if (this.FDefRowHeight !== AValue) {
        this.FDefRowHeight = AValue;
        this.FNeedsFullRender = true;
        this.Changed();
      };
    };
    this.SetShowHeader = function (AValue) {
      if (this.FShowHeader !== AValue) {
        this.FShowHeader = AValue;
        this.FNeedsFullRender = true;
        this.Changed();
      };
    };
    this.SetAlternateRowColor = function (AValue) {
      if (this.FAlternateRowColor !== AValue) {
        this.FAlternateRowColor = AValue;
        this.Changed();
      };
    };
    this.SetResponsiveMode = function (AValue) {
      if (this.FResponsiveMode !== AValue) {
        this.FResponsiveMode = AValue;
        this.FNeedsFullRender = true;
        this.Changed();
        if (this.FResponsiveMode) {
          window.addEventListener('resize', this.FHandleWindowResize);
        } else {
          window.removeEventListener('resize', this.FHandleWindowResize);
        };
      };
    };
    this.SetResponsiveBreakpoint = function (AValue) {
      if (this.FResponsiveBreakpoint !== AValue) {
        this.FResponsiveBreakpoint = AValue;
        this.FNeedsFullRender = true;
        this.Changed();
      };
    };
    this.SetFilterBox = function (AValue) {
      if (this.FFilterBox !== AValue) {
        this.FFilterBox = AValue;
        if (!AValue) this.FFilterText = "";
        this.FNeedsFullRender = true;
        this.Changed();
      };
    };
    this.ProcessClick = function (ACell) {
      var VRow = null;
      var rid = "";
      var cid = "";
      var colid = "";
      var VColIndex = 0;
      var VRowIndex = 0;
      var VObj = null;
      if (!(ACell != null)) return;
      VRow = ACell.parentElement;
      if (!(VRow != null)) return;
      cid = ACell.getAttribute("name");
      if (cid == null) cid = "";
      if (cid !== "") {
        rid = pas.System.Copy(cid,1,pas.System.Pos("_",cid) - 1);
        colid = pas.System.Copy(cid,pas.System.Pos("_",cid) + 1,2147483647);
        VColIndex = pas.SysUtils.StrToIntDef(colid,-1);
        if (this.FData != null) {
          VRowIndex = pas.SysUtils.StrToIntDef(rid,0);
          if (VRowIndex < this.FData.length) {
            VObj = this.FData[VRowIndex];
            if ((this.FDataJSon != null) && VObj.hasOwnProperty("__dsrow")) {
              VRowIndex = rtl.trunc(VObj["__dsrow"]);
              if (this.FDataJSon.GetActive()) this.FDataJSon.First();
              if (this.FDataJSon.GetRecordCount() > VRowIndex) this.FDataJSon.MoveBy(VRowIndex);
            };
          };
        } else if (this.FDataJSon != null) {
          if (this.FDataJSon.GetActive()) this.FDataJSon.First();
          if (this.FDataJSon.GetRecordCount() > pas.SysUtils.StrToIntDef(rid,0)) this.FDataJSon.MoveBy(pas.SysUtils.StrToIntDef(rid,0));
        };
        this.fCurrentRID = rid;
        this.SetActiveCell(ACell);
        if ((this.FOnCellDblClick != null) && ((pas.SysUtils.Now() - this.FLastClickTime) < 5E-6) && (this.FLastClickCell === ACell)) {
          this.FLastClickTime = 0;
          this.FLastClickCell = null;
          this.FOnCellDblClick(this,VColIndex,VRow.sectionRowIndex);
        } else {
          this.FLastClickTime = pas.SysUtils.Now();
          this.FLastClickCell = ACell;
          this.CellClick(VColIndex,VRow.sectionRowIndex);
        };
      };
    };
    this.KeyDown = function (Key, Shift) {
      pas.Controls.TWinControl.KeyDown.call(this,Key,rtl.refSet(Shift));
      var $tmp = Key.get();
      if ($tmp === 33) {
        this.NavigatePageUp();
        Key.set(0);
      } else if ($tmp === 34) {
        this.NavigatePageDown();
        Key.set(0);
      } else if ($tmp === 35) {
        this.NavigateEnd();
        Key.set(0);
      } else if ($tmp === 36) {
        this.NavigateHome();
        Key.set(0);
      } else if ($tmp === 37) {
        this.NavigateLeft();
        Key.set(0);
      } else if ($tmp === 38) {
        this.NavigateUp();
        Key.set(0);
      } else if ($tmp === 39) {
        this.NavigateRight();
        Key.set(0);
      } else if ($tmp === 40) {
        this.NavigateDown();
        Key.set(0);
      };
    };
    this.DoEnter = function () {
      pas.Controls.TWinControl.DoEnter.call(this);
      if (!(this.FActiveCell != null)) {
        this.FActiveCell = this.SelectCell(0,0);
        if (this.FActiveCell != null) this.FActiveCell.click();
      };
    };
    this.CellClick = function (ACol, ARow) {
      if (this.FOnCellClick != null) this.FOnCellClick(this,ACol,ARow);
    };
    this.HeaderClick = function (ACol) {
      var VCol = null;
      if (this.FColumnClickSorts) {
        if (this.FSortColumn === ACol) {
          if (this.FSortOrder === $mod.TSortOrder.soAscending) {
            this.FSortOrder = $mod.TSortOrder.soDescending}
           else this.FSortOrder = $mod.TSortOrder.soAscending;
        } else this.FSortOrder = $mod.TSortOrder.soAscending;
        this.FSortColumn = ACol;
        if ((this.FDataTable != null) && (this.FDataTable.FLoadedRecords < this.FDataTable.FTotalRecords) && this.FColumns.HasIndex(ACol)) {
          VCol = this.FColumns.GetColumn(ACol);
          if (this.FGroupField !== "") {
            this.FDataTable.FSortField = this.FGroupField + "," + VCol.FName}
           else this.FDataTable.FSortField = VCol.FName;
          if (this.FSortOrder === $mod.TSortOrder.soAscending) {
            this.FDataTable.FSortDir = "asc"}
           else this.FDataTable.FSortDir = "desc";
          this.FNeedsFullRender = true;
          this.FDataTable.Load();
        } else this.Sort();
      };
      if (this.FOnHeaderClick != null) this.FOnHeaderClick(this,ACol);
    };
    this.CompareCells = function (A, B) {
      var Result = 0;
      var VColumn = null;
      var VValueA = undefined;
      var VValueB = undefined;
      var VGroup = "";
      Result = 0;
      if (!rtl.isExt(A,Object,1) || !rtl.isExt(B,Object,1)) return Result;
      if (this.FGroupField !== "") {
        VGroup = this.FGroupField;
        VValueA = A[VGroup];
        VValueB = B[VGroup];
        Result = pas.Controls.CompareValues(VValueA,VValueB);
        if (Result !== 0) return Result;
      };
      if (this.FColumns.HasIndex(this.FSortColumn)) {
        VColumn = this.FColumns.GetColumn(this.FSortColumn);
        if (VColumn != null) {
          VValueA = A[VColumn.FName];
          VValueB = B[VColumn.FName];
          if (this.FSortOrder === $mod.TSortOrder.soAscending) {
            Result = pas.Controls.CompareValues(VValueA,VValueB)}
           else Result = pas.Controls.CompareValues(VValueB,VValueA);
        };
      };
      return Result;
    };
    this.Sort = function () {
      var VObj = null;
      var VColIdx = 0;
      var VCol = null;
      var VRowIdx = 0;
      if (this.FData != null) {
        this.FData.sort(rtl.createCallback(this,"CompareCells"));
      } else if ((this.FDataJSon != null) && this.FDataJSon.GetActive()) {
        this.FData = new Array();
        this.FDataJSon.DisableControls();
        try {
          VRowIdx = 0;
          this.FDataJSon.First();
          while (!this.FDataJSon.FEOF) {
            VObj = new Object();
            for (var $l = 0, $end = this.FColumns.GetCount() - 1; $l <= $end; $l++) {
              VColIdx = $l;
              VCol = this.FColumns.GetColumn(VColIdx);
              VObj[VCol.FName] = this.FDataJSon.FieldByName(VCol.FName).GetAsString();
            };
            if (this.FGroupField !== "") VObj[this.FGroupField] = this.FDataJSon.FieldByName(this.FGroupField).GetAsString();
            VObj["__dsrow"] = VRowIdx;
            this.FData.push(VObj);
            this.FDataJSon.Next();
            VRowIdx += 1;
          };
        } finally {
          this.FDataJSon.EnableControls();
        };
        this.FData.sort(rtl.createCallback(this,"CompareCells"));
      };
      this.FNeedsFullRender = true;
      this.Changed();
    };
    this.NavigateDown = function () {
      var VCell = null;
      var VRow = null;
      if ((this.FActiveCell != null) && (this.FActiveCell.parentElement != null)) {
        VRow = this.FActiveCell.parentElement.nextElementSibling;
        if ((VRow != null) && (VRow.childNodes.length > 0)) {
          VCell = VRow.childNodes.item(this.FActiveCell.cellIndex);
          if (VCell != null) {
            VCell.click();
            this.ScrollCellIntoView(VCell);
          };
        };
      };
    };
    this.NavigateUp = function () {
      var VCell = null;
      var VRow = null;
      if ((this.FActiveCell != null) && (this.FActiveCell.parentElement != null)) {
        VRow = this.FActiveCell.parentElement.previousElementSibling;
        if ((VRow != null) && (VRow.childNodes.length > 0)) {
          VCell = VRow.childNodes.item(this.FActiveCell.cellIndex);
          if (VCell != null) {
            VCell.click();
            this.ScrollCellIntoView(VCell);
          };
        };
      };
    };
    this.NavigateLeft = function () {
      var VCell = null;
      if (this.FActiveCell != null) {
        VCell = this.FActiveCell.previousElementSibling;
        if (VCell != null) {
          VCell.click();
          this.ScrollCellIntoView(VCell);
        };
      };
    };
    this.NavigateRight = function () {
      var VCell = null;
      if (this.FActiveCell != null) {
        VCell = this.FActiveCell.nextElementSibling;
        if (VCell != null) {
          VCell.click();
          this.ScrollCellIntoView(VCell);
        };
      };
    };
    this.NavigateEnd = function () {
      var VBody = null;
      var VCell = null;
      var VRow = null;
      if (this.FActiveCell != null) {
        VBody = this.FHandleElement.querySelector("tbody");
        if ((VBody != null) && (VBody.rows.length > 0)) {
          VRow = VBody.rows.item(VBody.rows.length - 1);
          if ((VRow != null) && (VRow.childNodes.length > 0)) {
            VCell = VRow.childNodes.item(this.FActiveCell.cellIndex);
            if (VCell != null) {
              VCell.click();
              this.ScrollCellIntoView(VCell);
            };
          };
        };
      };
    };
    this.NavigateHome = function () {
      var VBody = null;
      var VCell = null;
      var VRow = null;
      if (this.FActiveCell != null) {
        VBody = this.FHandleElement.querySelector("tbody");
        if ((VBody != null) && (VBody.rows.length > 0)) {
          VRow = VBody.rows.item(0);
          if ((VRow != null) && (VRow.childNodes.length > 0)) {
            VCell = VRow.childNodes.item(this.FActiveCell.cellIndex);
            if (VCell != null) {
              VCell.click();
              this.ScrollCellIntoView(VCell);
            };
          };
        };
      };
    };
    this.NavigatePageDown = function () {
      var VBody = null;
      var VRow = null;
      var VCell = null;
      var VRowHeight = 0;
      var VPageRows = 0;
      var VTargetIdx = 0;
      var VCurrentIdx = 0;
      if (!(this.FActiveCell != null)) return;
      VBody = this.FHandleElement.querySelector("tbody");
      if (!(VBody != null) || (VBody.rows.length === 0)) return;
      VRow = this.FActiveCell.parentElement;
      VRowHeight = pas.Controls.IfThen$2(this.FDefRowHeight > 0,this.FDefRowHeight,this.CalcDefaultRowHeight());
      VPageRows = Math.floor(VBody.clientHeight / VRowHeight);
      if (VPageRows < 1) VPageRows = 1;
      VCurrentIdx = VRow.sectionRowIndex;
      VTargetIdx = VCurrentIdx + VPageRows;
      if (VTargetIdx >= VBody.rows.length) VTargetIdx = VBody.rows.length - 1;
      VRow = VBody.rows.item(VTargetIdx);
      if ((VRow != null) && (VRow.childNodes.length > 0)) {
        VCell = VRow.childNodes.item(this.FActiveCell.cellIndex);
        if (VCell != null) {
          VCell.click();
          this.ScrollCellIntoView(VCell);
        };
      };
    };
    this.NavigatePageUp = function () {
      var VBody = null;
      var VRow = null;
      var VCell = null;
      var VRowHeight = 0;
      var VPageRows = 0;
      var VTargetIdx = 0;
      var VCurrentIdx = 0;
      if (!(this.FActiveCell != null)) return;
      VBody = this.FHandleElement.querySelector("tbody");
      if (!(VBody != null) || (VBody.rows.length === 0)) return;
      VRow = this.FActiveCell.parentElement;
      VRowHeight = pas.Controls.IfThen$2(this.FDefRowHeight > 0,this.FDefRowHeight,this.CalcDefaultRowHeight());
      VPageRows = Math.floor(VBody.clientHeight / VRowHeight);
      if (VPageRows < 1) VPageRows = 1;
      VCurrentIdx = VRow.sectionRowIndex;
      VTargetIdx = VCurrentIdx - VPageRows;
      if (VTargetIdx < 0) VTargetIdx = 0;
      VRow = VBody.rows.item(VTargetIdx);
      if ((VRow != null) && (VRow.childNodes.length > 0)) {
        VCell = VRow.childNodes.item(this.FActiveCell.cellIndex);
        if (VCell != null) {
          VCell.click();
          this.ScrollCellIntoView(VCell);
        };
      };
    };
    this.ScrollCellIntoView = function (ACell) {
      if (!(ACell != null)) return;
      var body = this.FHandleElement.querySelector('tbody');
      var row = ACell.parentElement;
      if (body && row) {
        var rowTop = row.offsetTop;
        var rowH = row.offsetHeight;
        if (rowTop < body.scrollTop) {
          body.scrollTop = rowTop;
        } else if (rowTop + rowH > body.scrollTop + body.clientHeight) {
          body.scrollTop = rowTop + rowH - body.clientHeight;
        }
      };
    };
    this.HandleBodyClick = function (AEvent) {
      var Result = false;
      var TargetElement = null;
      var VCell = null;
      if (this.FEnabled === false) return true;
      if ((pas.SysUtils.Now() - this.FLastTouchTime) < 0.000006) {
        Result = true;
        return Result;
      };
      TargetElement = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
      VCell = $impl.FindClosestParent(TargetElement,"TD");
      if (VCell != null) {
        var gv = VCell.getAttribute('data-group');
        console.log('WCL: click TD, data-group=' + gv);
        if (gv) {
          this.FGroupCollapsed[gv] = !this.FGroupCollapsed[gv];
          AEvent.stopPropagation();
          this.FNeedsFullRender = true;
          this.Changed();
        } else {
          AEvent.stopPropagation();
          this.ProcessClick(VCell);
        };
      };
      Result = true;
      return Result;
    };
    this.HandleBodyTouchStart = function (AEvent) {
      var Result = false;
      this.FLastTouchTime = pas.SysUtils.Now();
      if (AEvent.touches.length > 0) {
        this.FTouchStartX = AEvent.touches[0].clientX;
        this.FTouchStartY = AEvent.touches[0].clientY;
      };
      if (this.fontouchstart != null) this.fontouchstart(AEvent);
      Result = true;
      return Result;
    };
    this.HandleBodyTouchEnd = function (AEvent) {
      var Result = false;
      var TargetElement = null;
      var VCell = null;
      var dist = 0.0;
      if (this.FEnabled === false) return true;
      dist = 0;
      if (AEvent.changedTouches.length > 0) {
        let t = AEvent.changedTouches[0];
        let tdx = Math.abs(t.clientX - this.FTouchStartX);
        let tdy = Math.abs(t.clientY - this.FTouchStartY);
        dist = Math.sqrt(tdx*tdx + tdy*tdy);
      };
      if (dist < 10) {
        TargetElement = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
        VCell = $impl.FindClosestParent(TargetElement,"TD");
        if (VCell != null) this.ProcessClick(VCell);
      };
      if (this.fontouchend != null) this.fontouchend(AEvent);
      Result = true;
      return Result;
    };
    this.HandleBodyScroll = function (AEvent) {
      var Result = false;
      var VBody = null;
      var VHead = null;
      var VScrollTop = 0.0;
      var VScrollHeight = 0.0;
      var VClientHeight = 0.0;
      VHead = this.FHandleElement.querySelector("thead");
      VBody = this.FHandleElement.querySelector("tbody");
      if ((VHead != null) && (VBody != null)) VHead.scrollLeft = VBody.scrollLeft;
      if (this.FInfiniteScroll && (this.FDataTable != null) && !this.FScrollLoading) {
        if (this.FDataTable.FLoadedRecords >= this.FDataTable.FTotalRecords) {
          this.FScrollLoading = false;
          AEvent.stopPropagation();
          Result = true;
          return Result;
        };
        VScrollTop = VBody.scrollTop;
        VScrollHeight = VBody.scrollHeight;
        VClientHeight = VBody.clientHeight;
        if ((VScrollTop + VClientHeight) >= (VScrollHeight - 50)) {
          this.FScrollLoading = true;
          this.FDataTable.LoadNextPage();
        };
      };
      AEvent.stopPropagation();
      Result = true;
      return Result;
    };
    this.HandleHeaderClick = function (AEvent) {
      var Result = false;
      var VCell = null;
      VCell = $impl.FindClosestParent(pas.Web.TJSEventHelper.GetTargetElement.call(AEvent),"TH");
      if (VCell != null) {
        AEvent.stopPropagation();
        if (VCell.hasAttribute("data-col")) this.HeaderClick(pas.SysUtils.StrToIntDef(VCell.getAttribute("data-col"),-1));
      };
      Result = true;
      return Result;
    };
    this.HandleCardClick = function (AEvent) {
      var Result = false;
      var VRow = 0;
      var VCol = 0;
      var VSortCol = 0;
      var VTarget = null;
      var VLabelEl = null;
      var VCell = null;
      if (this.FEnabled === false) return true;
      VSortCol = -1;
      VTarget = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent);
      if (VTarget != null) {
        VLabelEl = VTarget;
        while (VLabelEl != null) {
          if (pas.System.Pos("dg-label",VLabelEl.className) > 0) {
            VCell = VLabelEl.parentElement;
            while (VCell != null) {
              if (VCell.hasAttribute("dg-cell")) {
                VSortCol = pas.SysUtils.StrToIntDef(VCell.getAttribute("data-col"),-1);
                break;
              };
              VCell = VCell.parentElement;
            };
            break;
          };
          VLabelEl = VLabelEl.parentElement;
        };
      };
      if (VSortCol >= 0) {
        if (this.FColumnClickSorts) {
          if (this.FSortColumn === VSortCol) {
            if (this.FSortOrder === $mod.TSortOrder.soAscending) {
              this.FSortOrder = $mod.TSortOrder.soDescending}
             else this.FSortOrder = $mod.TSortOrder.soAscending}
           else this.FSortOrder = $mod.TSortOrder.soAscending;
          this.FSortColumn = VSortCol;
          this.Sort();
        };
        if (this.FOnHeaderClick != null) this.FOnHeaderClick(this,VSortCol);
        Result = true;
        return Result;
      };
      var el = AEvent.target;
      while (el && el.getAttribute && el.getAttribute('dg-cell') === null)
        el = el.parentElement;
      if (el) {
        VRow = parseInt(el.getAttribute('data-row'));
        VCol = parseInt(el.getAttribute('data-col'));
        var old = this.FHandleElement.querySelector('.dg-card.dg-active');
        if (old) old.classList.remove('dg-active');
        if (el.parentElement) el.parentElement.classList.add('dg-active');
      } else {
        VRow = -1; VCol = -1;
      };
      if (VRow < 0) return true;
      if ((this.FDataJSon != null) && this.FDataJSon.GetActive() && !(this.FData != null)) {
        if (this.FDataJSon.GetRecordCount() > VRow) {
          this.FDataJSon.First();
          this.FDataJSon.MoveBy(VRow);
        };
      };
      this.fCurrentRID = pas.SysUtils.TIntegerHelper.ToString$1.call({get: function () {
          return VRow;
        }, set: function (v) {
          VRow = v;
        }});
      if ((this.FOnCellDblClick != null) && ((pas.SysUtils.Now() - this.FLastClickTime) < 5E-6) && (this.FLastCardRow === VRow) && (this.FLastCardCol === VCol)) {
        this.FLastClickTime = 0;
        this.FLastCardRow = -1;
        this.FLastCardCol = -1;
        this.FOnCellDblClick(this,VCol,VRow);
      } else {
        this.FLastClickTime = pas.SysUtils.Now();
        this.FLastCardRow = VRow;
        this.FLastCardCol = VCol;
        this.CellClick(VCol,VRow);
      };
      Result = true;
      return Result;
    };
    this.HandleCardTouchEnd = function (AEvent) {
      var Result = false;
      var VCell = null;
      var VRow = 0;
      var VCol = 0;
      if (this.FEnabled === false) return true;
      AEvent.preventDefault();
      let el = AEvent.targetElement;
      while (el && !el.hasAttribute('dg-cell')) el = el.parentElement;
      VCell = el || null;
      if (!(VCell != null)) return true;
      VRow = parseInt(VCell.getAttribute('data-row'));
      VCol = parseInt(VCell.getAttribute('data-col'));
      this.CellClick(VCol,VRow);
      if (this.fontouchend != null) this.fontouchend(AEvent);
      Result = true;
      return Result;
    };
    this.HandleWindowResize = function (AEvent) {
      var Result = false;
      var VNewState = "";
      var VColIndex = 0;
      var VCol = null;
      var VViewW = 0;
      var VNeedsUpdate = false;
      VNeedsUpdate = false;
      VViewW = this.GetViewportWidth();
      if (this.FResponsiveBreakpoint > 0) {
        var card = VViewW < this.FResponsiveBreakpoint;
        if (card !== this.FIsCardVisible) {
          this.FIsCardVisible = card;
          VNeedsUpdate = true;
        };
      };
      VNewState = "";
      for (var $l = 0, $end = this.FColumns.GetCount() - 1; $l <= $end; $l++) {
        VColIndex = $l;
        VCol = this.FColumns.GetColumn(VColIndex);
        if (this.IsColumnVisibleAtWidth(VCol,VViewW)) {
          VNewState = VNewState + "1"}
         else VNewState = VNewState + "0";
      };
      if (VNewState !== this.FLastResponsiveState) {
        this.FLastResponsiveState = VNewState;
        VNeedsUpdate = true;
      };
      if (VNeedsUpdate) {
        this.FNeedsFullRender = true;
        this.Changed();
      };
      Result = true;
      return Result;
    };
    this.HandleFilterInput = function (AEvent) {
      var $Self = this;
      var Result = false;
      Result = true;
      AEvent.stopPropagation();
      this.FFilterText = AEvent.target.value;
      if ((this.FDataTable != null) && (this.FFilterText !== this.FDataTable.FFilterText)) {
        this.FDataTable.FFilterText = this.FFilterText;
        if (this.FFilterTimer !== 0) window.clearTimeout(this.FFilterTimer);
        this.FFilterTimer = window.setTimeout(function () {
          $Self.FFilterTimer = 0;
          if ($Self.FDataTable != null) $Self.FDataTable.Load();
        },300);
      };
      this.Changed();
      return Result;
    };
    this.FilterMatchesRow = function (AObject) {
      var Result = false;
      var VColIdx = 0;
      var VCol = null;
      var VVal = undefined;
      var VStr = "";
      Result = true;
      if (this.FFilterText === "") return Result;
      for (var $l = 0, $end = this.FColumns.GetCount() - 1; $l <= $end; $l++) {
        VColIdx = $l;
        VCol = this.FColumns.GetColumn(VColIdx);
        if (VCol.FName === "") continue;
        VVal = AObject[VCol.FName];
        if (pas.JS.GetValueType(VVal) === pas.JS.TJSValueType.jvtString) {
          VStr = pas.SysUtils.LowerCase("" + VVal);
          if (pas.System.Pos(pas.SysUtils.LowerCase(this.FFilterText),VStr) > 0) return Result;
        };
      };
      Result = false;
      return Result;
    };
    this.GetViewportWidth = function () {
      var Result = 0;
      Result = window.innerWidth;
      return Result;
    };
    this.IsColumnVisibleAtWidth = function (AColumn, AWidth) {
      var Result = false;
      Result = AColumn.FVisible;
      if (!Result) return Result;
      if ((AColumn.FResponsiveMinWidth > 0) && (AWidth < AColumn.FResponsiveMinWidth)) Result = false;
      if ((AColumn.FResponsiveMaxWidth > 0) && (AWidth > AColumn.FResponsiveMaxWidth)) Result = false;
      return Result;
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("table");
      return Result;
    };
    this.RenderTableStyle = function () {
      var $Self = this;
      function JSAlign(AAlignment) {
        var Result = "";
        var $tmp = AAlignment;
        if ($tmp === pas.Classes.TAlignment.taCenter) {
          Result = "center"}
         else if ($tmp === pas.Classes.TAlignment.taLeftJustify) {
          Result = "left"}
         else if ($tmp === pas.Classes.TAlignment.taRightJustify) Result = "right";
        return Result;
      };
      function Scoped(ARule) {
        var Result = "";
        Result = '[data-dg="' + $Self.FScopeId + '"] ' + ARule;
        return Result;
      };
      function ScopedChild(ARule) {
        var Result = "";
        Result = '[data-dg="' + $Self.FScopeId + '"] > ' + ARule;
        return Result;
      };
      var VColumn = null;
      var VColumnIndex = 0;
      var VCss = "";
      var VHeight = 0;
      var VHeadHeight = 0;
      var VWidth = 0;
      var VVisibleIndex = 0;
      var VViewportWidth = 0;
      VViewportWidth = this.GetViewportWidth();
      VHeight = pas.Controls.IfThen$2(this.FDefRowHeight < 0,this.CalcDefaultRowHeight(),this.FDefRowHeight);
      VHeadHeight = VHeight;
      if (this.FFilterBox) VHeadHeight = VHeight * 2;
      VCss = "";
      if (!(this.FResponsiveMode && (this.FResponsiveBreakpoint === 0))) {
        VCss = ScopedChild("thead") + "," + ScopedChild("tbody") + "{display: block;position: absolute;}" + ScopedChild("thead{overflow: hidden;width: calc(100% - " + pas.SysUtils.IntToStr(pas.Controls.ScrollbarWidth()) + "px);" + "height: auto;}") + ScopedChild("tbody{overflow: scroll;top: " + pas.SysUtils.IntToStr(pas.Controls.IfThen$2(this.FShowHeader,VHeadHeight,0)) + "px;" + "width: 100%;height: calc(100% - " + pas.SysUtils.IntToStr(pas.Controls.IfThen$2(this.FShowHeader,VHeadHeight,0)) + "px);}");
      };
      VVisibleIndex = 0;
      for (var $l = 0, $end = this.FColumns.GetCount() - 1; $l <= $end; $l++) {
        VColumnIndex = $l;
        VColumn = this.FColumns.GetColumn(VColumnIndex);
        if ((VColumn != null) && this.IsColumnVisibleAtWidth(VColumn,VViewportWidth)) {
          VWidth = pas.Controls.IfThen$2(VColumn.FWidth <= 0,this.FDefColWidth,VColumn.FWidth);
          VVisibleIndex += 1;
          if (!(this.FResponsiveMode && (this.FResponsiveBreakpoint === 0))) VCss = VCss + ScopedChild("thead th:nth-child(" + pas.SysUtils.IntToStr(VVisibleIndex) + "){" + "height:" + pas.SysUtils.IntToStr(pas.Controls.IfThen$2(this.FShowHeader,VHeight,0)) + "px;min-width:" + pas.SysUtils.IntToStr(VWidth) + "px;max-width:" + pas.SysUtils.IntToStr(VWidth) + "px;visibility:visible;padding:0;overflow:hidden;border:1px solid #ccc;background:#dddada;font:" + pas.Graphics.JSFont(VColumn.FTitleFont) + ";font-family:" + pas.Graphics.JSFontFamily(VColumn.FTitleFont) + ";text-align:center;text-overflow:clip;white-space:nowrap;cursor:pointer;}");
          if (!(this.FResponsiveMode && (this.FResponsiveBreakpoint === 0))) VCss = VCss + ScopedChild("tbody td:nth-child(" + pas.SysUtils.IntToStr(VVisibleIndex) + "){" + "height:" + pas.SysUtils.IntToStr(VHeight) + "px;min-width:" + pas.SysUtils.IntToStr(VWidth) + "px;max-width:" + pas.SysUtils.IntToStr(VWidth) + "px;visibility:visible;padding:0;overflow:hidden;border:1px solid #ccc;background-color:" + pas.Graphics.JSColor(VColumn.FColor) + ";font:" + pas.Graphics.JSFont(VColumn.FFont) + ";text-align:" + JSAlign(VColumn.FAlignment) + ";text-overflow:clip;white-space:nowrap;}");
        };
      };
      if (this.FResponsiveMode) {
        if ((this.FResponsiveBreakpoint > 0) && !this.FIsCardVisible) {
          VCss = VCss + "@media (max-width: " + pas.SysUtils.IntToStr(this.FResponsiveBreakpoint) + "px){";
        };
        VCss = VCss + Scoped(".dg-card-container{width:100%;height:100%;overflow-y:auto;}") + Scoped(".dg-card{margin:0 0 2px 0;border:1px solid #ccc;border-radius:4px;overflow:hidden;}") + Scoped(".dg-card.dg-active{border-color:dodgerblue;box-shadow:0 0 0 1px dodgerblue;}") + Scoped(".dg-card div[dg-cell]{display:block;padding:1px 6px;border-bottom:1px solid #eee;text-align:left;}") + Scoped(".dg-card div[dg-cell]:last-child{border-bottom:none;}") + Scoped(".dg-label{display:inline;font-weight:bold;color:#555;margin-right:4px;cursor:pointer;}") + Scoped('.dg-label::after{content:":";}') + Scoped(".dg-value{display:inline;word-break:break-word;}") + Scoped(".dg-separator{margin:2px 0;}") + Scoped(".dg-separator-table{width:100%;border-collapse:collapse;}");
        if ((this.FResponsiveBreakpoint > 0) && !this.FIsCardVisible) VCss = VCss + "}";
      };
      VCss = VCss + ScopedChild("thead .dg-filter-input{width:98%;box-sizing:border-box;padding:2px 4px;border:1px solid #ccc;border-radius:3px;margin:2px 0;}") + Scoped(".dg-filter-card input{width:100%;box-sizing:border-box;padding:4px 8px;border:1px solid #ccc;border-radius:4px;}");
      if ((this.FStyleElement != null) && (this.FStyleElement.parentElement === this.FHandleElement)) this.FHandleElement.removeChild(this.FStyleElement);
      this.FStyleElement = this.FHandleElement.appendChild(document.createElement("style"));
      this.FStyleElement.innerHTML = VCss;
    };
    this.RenderTableHead = function () {
      var VColumn = null;
      var VColumnIndex = 0;
      var VVisCols = 0;
      var VHead = null;
      var VRow = null;
      var VFilterRow = null;
      var VCell = null;
      var VFilterCell = null;
      var VFilterInput = null;
      var VViewportWidth = 0;
      VViewportWidth = this.GetViewportWidth();
      VHead = this.FHandleElement.appendChild(document.createElement("thead"));
      VHead.setAttribute("name",this.FName + "_head");
      if (this.FFilterBox) {
        VVisCols = 0;
        for (var $l = 0, $end = this.FColumns.GetCount() - 1; $l <= $end; $l++) {
          VColumnIndex = $l;
          if (this.IsColumnVisibleAtWidth(this.FColumns.GetColumn(VColumnIndex),VViewportWidth)) VVisCols += 1;
        };
        VFilterRow = VHead.appendChild(document.createElement("tr"));
        VFilterCell = VFilterRow.appendChild(document.createElement("th"));
        VFilterCell.setAttribute("colspan",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
            return VVisCols;
          }, set: function (v) {
            VVisCols = v;
          }}));
        VFilterCell.style.setProperty("padding","2px 4px");
        VFilterCell.style.setProperty("height","auto");
        VFilterInput = document.createElement("input");
        VFilterInput.setAttribute("type","text");
        VFilterInput.setAttribute("class","dg-filter-input");
        VFilterInput.setAttribute("placeholder","Filter...");
        VFilterInput.setAttribute("value",this.FFilterText);
        VFilterInput.style.setProperty("width","100%");
        VFilterInput.style.setProperty("box-sizing","border-box");
        VFilterInput.addEventListener("keyup",rtl.createCallback(this,"HandleFilterInput"));
        VFilterCell.appendChild(VFilterInput);
      };
      VRow = VHead.appendChild(document.createElement("tr"));
      for (var $l1 = 0, $end1 = this.FColumns.GetCount() - 1; $l1 <= $end1; $l1++) {
        VColumnIndex = $l1;
        VColumn = this.FColumns.GetColumn(VColumnIndex);
        if (!this.IsColumnVisibleAtWidth(VColumn,VViewportWidth)) continue;
        VCell = VRow.appendChild(document.createElement("th"));
        VCell.setAttribute("data-col",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
            return VColumnIndex;
          }, set: function (v) {
            VColumnIndex = v;
          }}));
        VCell.addEventListener("click",rtl.createCallback(this,"HandleHeaderClick"));
        VCell.innerHTML = this.RenderTableHeadCell(VColumn,VColumnIndex);
      };
    };
    this.RenderTableBody = function () {
      var VColumn = null;
      var VColumnIndex = 0;
      var VRowIndex = 0;
      var VDisplayRow = 0;
      var VRow = null;
      var VCell = null;
      var VObject = null;
      var VValue = undefined;
      var position = pas.DB.TBookmark.$new();
      var Separator = "";
      var VHidden = false;
      var VViewportWidth = 0;
      VViewportWidth = this.GetViewportWidth();
      this.Body = this.FHandleElement.appendChild(document.createElement("tbody"));
      this.Body.setAttribute("name",this.FName + "_body");
      this.Body.addEventListener("scroll",rtl.createCallback(this,"HandleBodyScroll"));
      this.Body.addEventListener("click",rtl.createCallback(this,"HandleBodyClick"));
      this.Body.addEventListener("touchend",rtl.createCallback(this,"HandleBodyTouchEnd"));
      this.Body.addEventListener("touchstart",rtl.createCallback(this,"HandleBodyTouchStart"));
      if (this.fontouchmove != null) this.Body.addEventListener("touchmove",this.fontouchmove);
      if (this.fontouchcancel != null) this.Body.addEventListener("touchcancel",this.fontouchcancel);
      if (this.FData != null) {
        VDisplayRow = 0;
        for (var $l = 0, $end = this.FData.length - 1; $l <= $end; $l++) {
          VRowIndex = $l;
          VValue = this.FData[VRowIndex];
          if (pas.System.Assigned(VValue) && rtl.isObject(VValue)) {
            VObject = VValue;
            if ((this.FFilterText !== "") && !this.FilterMatchesRow(VObject)) continue;
            if ((this.FDataJSon != null) && VObject.hasOwnProperty("__dsrow")) {
              if (this.FDataJSon.GetActive()) this.FDataJSon.First();
              if (this.FDataJSon.GetRecordCount() > rtl.trunc(VObject["__dsrow"])) this.FDataJSon.MoveBy(rtl.trunc(VObject["__dsrow"]));
            };
            if (this.fOnAddSeparator != null) {
              Separator = "";
              this.fOnAddSeparator(this,{get: function () {
                  return Separator;
                }, set: function (v) {
                  Separator = v;
                }});
              if (Separator !== "") {
                VRow = this.Body.appendChild(document.createElement("tr"));
                VRow.innerHTML = Separator;
              };
            };
            VHidden = false;
            if ((this.FGroupField !== "") && VObject.hasOwnProperty(this.FGroupField)) {
              var gv = VObject[this.FGroupField];
              if (this.FGroupCollapsed[gv]) VHidden = true;
            };
            VRow = this.Body.appendChild(document.createElement("tr"));
            if (VHidden) {
              VRow.style.setProperty("height","0");
              VRow.style.setProperty("overflow","hidden");
            };
            for (var $l1 = 0, $end1 = this.FColumns.GetCount() - 1; $l1 <= $end1; $l1++) {
              VColumnIndex = $l1;
              VColumn = this.FColumns.GetColumn(VColumnIndex);
              if (!this.IsColumnVisibleAtWidth(VColumn,VViewportWidth)) continue;
              VCell = VRow.appendChild(document.createElement("td"));
              VCell.setAttribute("name",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
                  return VRowIndex;
                }, set: function (v) {
                  VRowIndex = v;
                }}) + "_" + pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
                  return VColumnIndex;
                }, set: function (v) {
                  VColumnIndex = v;
                }}));
              VCell.setAttribute("data-label",VColumn.FTitle);
              if ((VDisplayRow % 2) === 0) VCell.style.setProperty("background-color",pas.Graphics.JSColor(this.FAlternateRowColor));
              VCell.innerHTML = this.RenderTableCell(VColumn,VObject);
              if (this.fOnDrawColumnCell != null) this.fOnDrawColumnCell(this,VColumn.FName,{get: function () {
                  return VCell;
                }, set: function (v) {
                  VCell = v;
                }});
            };
            VDisplayRow += 1;
          };
        };
      } else if ((this.FDataJSon != null) && this.FDataJSon.GetActive()) {
        if (this.FDataJSon.GetRecordCount() === 0) return;
        position.$assign(this.FDataJSon.GetBookmark());
        this.FDataJSon.First();
        VDisplayRow = 0;
        VRowIndex = 0;
        while (!this.FDataJSon.FEOF) {
          VObject = new Object();
          for (var $l2 = 0, $end2 = this.FColumns.GetCount() - 1; $l2 <= $end2; $l2++) {
            VColumnIndex = $l2;
            VColumn = this.FColumns.GetColumn(VColumnIndex);
            VObject[VColumn.FName] = this.FDataJSon.FieldByName(VColumn.FName).GetAsString();
          };
          if (this.FGroupField !== "") VObject[this.FGroupField] = this.FDataJSon.FieldByName(this.FGroupField).GetAsString();
          if (this.FFilterText !== "") {
            if (!this.FilterMatchesRow(VObject)) {
              this.FDataJSon.Next();
              VRowIndex += 1;
              continue;
            };
          };
          if (this.fOnAddSeparator != null) {
            Separator = "";
            this.fOnAddSeparator(this,{get: function () {
                return Separator;
              }, set: function (v) {
                Separator = v;
              }});
            if (Separator !== "") {
              VRow = this.Body.appendChild(document.createElement("tr"));
              VRow.innerHTML = Separator;
            };
          };
          VHidden = false;
          if ((this.FGroupField !== "") && VObject.hasOwnProperty(this.FGroupField)) {
            var gv = VObject[this.FGroupField];
            if (this.FGroupCollapsed[gv]) VHidden = true;
          };
          VRow = this.Body.appendChild(document.createElement("tr"));
          if (VHidden) VRow.style.setProperty("visibility","collapse");
          for (var $l3 = 0, $end3 = this.FColumns.GetCount() - 1; $l3 <= $end3; $l3++) {
            VColumnIndex = $l3;
            VColumn = this.FColumns.GetColumn(VColumnIndex);
            if (!this.IsColumnVisibleAtWidth(VColumn,VViewportWidth)) continue;
            VCell = VRow.appendChild(document.createElement("td"));
            VCell.setAttribute("name",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
                return VRowIndex;
              }, set: function (v) {
                VRowIndex = v;
              }}) + "_" + pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
                return VColumnIndex;
              }, set: function (v) {
                VColumnIndex = v;
              }}));
            VCell.setAttribute("data-label",VColumn.FTitle);
            if ((VDisplayRow % 2) === 0) VCell.style.setProperty("background-color",pas.Graphics.JSColor(this.FAlternateRowColor));
            VCell.innerHTML = this.RenderTableCell(VColumn,VObject);
            if (this.fOnDrawColumnCell != null) this.fOnDrawColumnCell(this,VColumn.FName,{get: function () {
                return VCell;
              }, set: function (v) {
                VCell = v;
              }});
            if (this.FDataJSon.GetBookmark().$eq(position)) this.SetActiveCell(VCell);
          };
          this.FDataJSon.Next();
          VRowIndex += 1;
          VDisplayRow += 1;
        };
        this.FDataJSon.GotoBookmark(position);
      };
    };
    this.RenderCardBody = function () {
      var VColumn = null;
      var VColumnIndex = 0;
      var VRowIndex = 0;
      var VDisplayRow = 0;
      var VCard = null;
      var VCell = null;
      var VLabel = null;
      var VValue = null;
      var VObject = null;
      var VJSValue = undefined;
      var position = pas.DB.TBookmark.$new();
      var VContainer = null;
      var VSeparator = "";
      var VViewportWidth = 0;
      VViewportWidth = this.GetViewportWidth();
      VContainer = this.FHandleElement.querySelector(".dg-card-container");
      if (!(VContainer != null)) return;
      if (this.FData != null) {
        for (var $l = 0, $end = this.FData.length - 1; $l <= $end; $l++) {
          VRowIndex = $l;
          VJSValue = this.FData[VRowIndex];
          if (pas.System.Assigned(VJSValue) && rtl.isObject(VJSValue)) {
            VObject = VJSValue;
            if ((this.FFilterText !== "") && !this.FilterMatchesRow(VObject)) continue;
            if (this.fOnAddSeparator != null) {
              VSeparator = "";
              this.fOnAddSeparator(this,{get: function () {
                  return VSeparator;
                }, set: function (v) {
                  VSeparator = v;
                }});
              this.AppendCardSeparator(VContainer,VSeparator);
            };
            VCard = document.createElement("div");
            VCard.setAttribute("class","dg-card");
            VCard.addEventListener("click",rtl.createCallback(this,"HandleCardClick"));
            if ((VDisplayRow % 2) === 0) VCard.style.setProperty("background-color",pas.Graphics.JSColor(this.FAlternateRowColor));
            VCard.setAttribute("data-row",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
                return VDisplayRow;
              }, set: function (v) {
                VDisplayRow = v;
              }}));
            for (var $l1 = 0, $end1 = this.FColumns.GetCount() - 1; $l1 <= $end1; $l1++) {
              VColumnIndex = $l1;
              VColumn = this.FColumns.GetColumn(VColumnIndex);
              if (!this.IsColumnVisibleAtWidth(VColumn,VViewportWidth)) continue;
              VCell = document.createElement("div");
              VCell.setAttribute("dg-cell","");
              VCell.setAttribute("data-row",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
                  return VRowIndex;
                }, set: function (v) {
                  VRowIndex = v;
                }}));
              VCell.setAttribute("data-col",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
                  return VColumnIndex;
                }, set: function (v) {
                  VColumnIndex = v;
                }}));
              VLabel = document.createElement("span");
              VLabel.setAttribute("class","dg-label");
              if (VColumnIndex === this.FSortColumn) {
                VLabel.innerHTML = pas.Controls.IfThen$3(this.FSortOrder === $mod.TSortOrder.soAscending,"↓ ","↑ ") + pas.Controls.IfThen$3(VColumn.FTitle !== "",VColumn.FTitle,VColumn.FName)}
               else VLabel.innerHTML = pas.Controls.IfThen$3(VColumn.FTitle !== "",VColumn.FTitle,VColumn.FName);
              VCell.appendChild(VLabel);
              VValue = document.createElement("span");
              VValue.setAttribute("class","dg-value");
              VValue.innerHTML = this.RenderTableCell(VColumn,VObject);
              VCell.appendChild(VValue);
              VCard.appendChild(VCell);
              if (this.fOnDrawColumnCell != null) {
                this.fOnDrawColumnCell(this,VColumn.FName,{get: function () {
                    return VCell;
                  }, set: function (v) {
                    VCell = v;
                  }});
                if (!VCell.querySelector('.dg-label'))
                VCell.insertBefore(VLabel, VCell.firstChild);
              };
            };
            VContainer.appendChild(VCard);
            VDisplayRow += 1;
          };
        };
      } else if ((this.FDataJSon != null) && this.FDataJSon.GetActive()) {
        position.$assign(this.FDataJSon.GetBookmark());
        this.FDataJSon.First();
        VDisplayRow = 0;
        while (!this.FDataJSon.FEOF) {
          VObject = new Object();
          for (var $l2 = 0, $end2 = this.FColumns.GetCount() - 1; $l2 <= $end2; $l2++) {
            VColumnIndex = $l2;
            VColumn = this.FColumns.GetColumn(VColumnIndex);
            VObject[VColumn.FName] = this.FDataJSon.FieldByName(VColumn.FName).GetAsString();
          };
          if ((this.FFilterText !== "") && !this.FilterMatchesRow(VObject)) {
            this.FDataJSon.Next();
            continue;
          };
          if (this.fOnAddSeparator != null) {
            VSeparator = "";
            this.fOnAddSeparator(this,{get: function () {
                return VSeparator;
              }, set: function (v) {
                VSeparator = v;
              }});
            this.AppendCardSeparator(VContainer,VSeparator);
          };
          VCard = document.createElement("div");
          VCard.setAttribute("class","dg-card");
          VCard.addEventListener("click",rtl.createCallback(this,"HandleCardClick"));
          if ((VDisplayRow % 2) === 0) VCard.style.setProperty("background-color",pas.Graphics.JSColor(this.FAlternateRowColor));
          VCard.setAttribute("data-row",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
              return VDisplayRow;
            }, set: function (v) {
              VDisplayRow = v;
            }}));
          for (var $l3 = 0, $end3 = this.FColumns.GetCount() - 1; $l3 <= $end3; $l3++) {
            VColumnIndex = $l3;
            VColumn = this.FColumns.GetColumn(VColumnIndex);
            if (!this.IsColumnVisibleAtWidth(VColumn,VViewportWidth)) continue;
            VCell = document.createElement("div");
            VCell.setAttribute("dg-cell","");
            VCell.setAttribute("data-row",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
                return VDisplayRow;
              }, set: function (v) {
                VDisplayRow = v;
              }}));
            VCell.setAttribute("data-col",pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
                return VColumnIndex;
              }, set: function (v) {
                VColumnIndex = v;
              }}));
            VLabel = document.createElement("span");
            VLabel.setAttribute("class","dg-label");
            if (VColumnIndex === this.FSortColumn) {
              VLabel.innerHTML = pas.Controls.IfThen$3(this.FSortOrder === $mod.TSortOrder.soAscending,"↓ ","↑ ") + pas.Controls.IfThen$3(VColumn.FTitle !== "",VColumn.FTitle,VColumn.FName)}
             else VLabel.innerHTML = pas.Controls.IfThen$3(VColumn.FTitle !== "",VColumn.FTitle,VColumn.FName);
            VCell.appendChild(VLabel);
            VValue = document.createElement("span");
            VValue.setAttribute("class","dg-value");
            VValue.innerHTML = this.RenderTableCell(VColumn,VObject);
            VCell.appendChild(VValue);
            VCard.appendChild(VCell);
            if (this.fOnDrawColumnCell != null) {
              this.fOnDrawColumnCell(this,VColumn.FName,{get: function () {
                  return VCell;
                }, set: function (v) {
                  VCell = v;
                }});
              if (!VCell.querySelector('.dg-label'))
              VCell.insertBefore(VLabel, VCell.firstChild);
            };
          };
          VContainer.appendChild(VCard);
          VDisplayRow += 1;
          this.FDataJSon.Next();
        };
        this.FDataJSon.GotoBookmark(position);
      };
    };
    this.AppendCardSeparator = function (AContainer, AHtml) {
      var VSeparator = null;
      if ((AHtml === "") || !(AContainer != null)) return;
      VSeparator = document.createElement("div");
      VSeparator.setAttribute("class","dg-separator");
      if (pas.System.Pos("<td",pas.SysUtils.LowerCase(AHtml)) > 0) {
        VSeparator.innerHTML = '<table class="dg-separator-table"><tbody><tr>' + AHtml + "</tr></tbody></table>"}
       else VSeparator.innerHTML = AHtml;
      AContainer.appendChild(VSeparator);
    };
    this.RenderTableCell = function (AColumn, AObject) {
      var Result = "";
      var VValue = undefined;
      Result = "";
      if ((AColumn != null) && AObject.hasOwnProperty(AColumn.FName)) {
        VValue = AObject[AColumn.FName];
        Result = this.FormatCellValue(AColumn,VValue);
      };
      return Result;
    };
    this.FormatCellValue = function (AColumn, AValue) {
      var Result = "";
      Result = "";
      var $tmp = pas.JS.GetValueType(AValue);
      if (($tmp === pas.JS.TJSValueType.jvtArray) || ($tmp === pas.JS.TJSValueType.jvtObject) || ($tmp === pas.JS.TJSValueType.jvtNull)) {}
      else if ($tmp === pas.JS.TJSValueType.jvtBoolean) {
        Result = pas.SysUtils.BoolToStr(!(AValue == false),true)}
       else if ($tmp === pas.JS.TJSValueType.jvtInteger) {
        Result = pas.SysUtils.FloatToStr(rtl.trunc(AValue))}
       else if ($tmp === pas.JS.TJSValueType.jvtFloat) {
        var $tmp1 = AColumn.FFormat;
        if ($tmp1 === $mod.TColumnFormat.cfDataTime) {
          Result = pas.SysUtils.FormatDateTime(AColumn.FDisplayMask,rtl.getNumber(AValue))}
         else if (($tmp1 === $mod.TColumnFormat.cfNumber) || ($tmp1 === $mod.TColumnFormat.cfCurrency)) {
          Result = pas.SysUtils.FormatFloat(pas.Controls.IfThen$3(AColumn.FDisplayMask !== "",AColumn.FDisplayMask,"#,##0.00"),rtl.getNumber(AValue))}
         else {
          Result = pas.SysUtils.FloatToStr(rtl.getNumber(AValue));
        };
      } else if ($tmp === pas.JS.TJSValueType.jvtString) {
        var $tmp2 = AColumn.FFormat;
        if (($tmp2 === $mod.TColumnFormat.cfNumber) || ($tmp2 === $mod.TColumnFormat.cfCurrency)) {
          Result = pas.SysUtils.FormatFloat(pas.Controls.IfThen$3(AColumn.FDisplayMask !== "",AColumn.FDisplayMask,"#,##0.00"),pas.SysUtils.StrToFloatDef("" + AValue,0))}
         else if ($tmp2 === $mod.TColumnFormat.cfDataTime) {
          Result = pas.SysUtils.FormatDateTime(AColumn.FDisplayMask,pas.SysUtils.StrToFloatDef("" + AValue,0))}
         else {
          if (AColumn.FDisplayMask !== "") {
            Result = pas.MaskUtils.MaskDoFormatText(AColumn.FDisplayMask,"" + AValue," ")}
           else Result = "" + AValue;
        };
      };
      return Result;
    };
    this.RenderTableHeadCell = function (AColumn, AIndex) {
      var Result = "";
      Result = "";
      if (AColumn != null) {
        if (AIndex === this.FSortColumn) {
          Result = pas.Controls.IfThen$3(this.FSortOrder === $mod.TSortOrder.soAscending,"↓","↑") + AColumn.FTitle}
         else Result = AColumn.FTitle;
      };
      return Result;
    };
    this.SelectCell = function (ACol, ARow) {
      var Result = null;
      var VBody = null;
      var VIndex = 0;
      Result = null;
      VBody = this.FHandleElement.querySelector("tbody");
      if ((VBody != null) && (VBody.rows.length > 0)) {
        if (ARow < 0) {
          ARow = 0}
         else if (ARow >= VBody.rows.length) ARow = VBody.rows.length - 1;
        Result = VBody.querySelector('[name="' + pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
            return ARow;
          }, set: function (v) {
            ARow = v;
          }}) + "_" + pas.SysUtils.TNativeIntHelper.ToString$1.call({get: function () {
            return ACol;
          }, set: function (v) {
            ACol = v;
          }}) + '"]');
        if (!(Result != null) && (VBody.rows.item(ARow).childNodes.length > 0)) {
          if (ACol < 0) {
            ACol = 0}
           else if (ACol >= VBody.rows.item(ARow).childNodes.length) ACol = VBody.rows.item(ARow).childNodes.length - 1;
          Result = VBody.rows.item(ARow).childNodes.item(ACol);
        };
      };
      return Result;
    };
    this.SetActiveCell = function (ACell) {
      if (this.FRowSelect === false) {
        if (this.FActiveCell != null) this.FActiveCell.style.setProperty("border","1px solid #ccc");
        this.FActiveCell = ACell;
        if (this.FActiveCell != null) this.FActiveCell.style.setProperty("border","2px solid dodgerblue");
      } else {
        if (this.FActiveCell != null) this.FActiveCell.parentElement.style.setProperty("border","1px solid #ccc");
        this.FActiveCell = ACell;
        if (this.FActiveCell != null) this.FActiveCell.parentElement.style.setProperty("border","2px solid dodgerblue");
      };
      if (this.FActiveCell != null) {
        this.fSelCol = this.FActiveCell.cellIndex;
        if (this.FActiveCell && this.FActiveCell.parentElement) {
          this.fSelRow = this.FActiveCell.parentElement.sectionRowIndex;
        } else {
          this.fSelRow = -1;
        };
      };
    };
    this.AutomaticallyCreateColumns = function () {
      var VColumn = null;
      var VKey = "";
      var VKeys = [];
      var VJSObject = null;
      var VJSValue = undefined;
      var index = 0;
      if ((this.FData != null) && (this.FData.length > 0) && (this.FColumns.GetCount() === 0) && this.FAutoCreateColumns) {
        VJSValue = this.FData[0];
        if (pas.System.Assigned(VJSValue) && (pas.JS.GetValueType(VJSValue) === pas.JS.TJSValueType.jvtObject)) {
          VJSObject = VJSValue;
          VKeys = Object.keys(VJSObject);
          this.BeginUpdate();
          try {
            for (var $in = VKeys, $l = 0, $end = rtl.length($in) - 1; $l <= $end; $l++) {
              VKey = $in[$l];
              VJSValue = VJSObject[VKey];
              if (pas.System.Assigned(VJSValue)) {
                VColumn = this.AddColumn();
                VColumn.SetName(VKey);
                VColumn.SetTitle(VColumn.FName);
                var $tmp = pas.JS.GetValueType(VJSValue);
                if ($tmp === pas.JS.TJSValueType.jvtBoolean) {
                  VColumn.SetAlignment(pas.Classes.TAlignment.taCenter);
                  VColumn.SetFormat($mod.TColumnFormat.cfBoolean);
                  VColumn.SetWidth(100);
                } else if (($tmp === pas.JS.TJSValueType.jvtFloat) || ($tmp === pas.JS.TJSValueType.jvtInteger)) {
                  VColumn.SetAlignment(pas.Classes.TAlignment.taRightJustify);
                  VColumn.SetFormat($mod.TColumnFormat.cfNumber);
                  VColumn.SetWidth(100);
                } else {
                  VColumn.SetFormat($mod.TColumnFormat.cfString);
                  VColumn.SetWidth(200);
                };
              };
            };
          } finally {
            this.EndUpdate();
          };
        };
      } else if ((this.FDataJSon != null) && (this.FColumns.GetCount() === 0) && this.FAutoCreateColumns) {
        this.BeginUpdate();
        try {
          for (var $l1 = 0, $end1 = this.FDataJSon.FFieldDefs.GetCount() - 1; $l1 <= $end1; $l1++) {
            index = $l1;
            VColumn = this.AddColumn();
            VColumn.SetName(this.FDataJSon.FFieldDefs.GetItem$1(index).FName);
            VColumn.SetTitle(VColumn.FName);
            VColumn.FTitleFont.SetStyle(rtl.createSet(pas.Graphics.TFontStyle.fsBold));
            var $tmp1 = this.FDataJSon.FFieldDefs.GetItem$1(index).FDataType;
            if ($tmp1 === pas.DB.TFieldType.ftBoolean) {
              VColumn.SetAlignment(pas.Classes.TAlignment.taCenter);
              VColumn.SetFormat($mod.TColumnFormat.cfBoolean);
              VColumn.SetWidth(100);
            } else if (($tmp1 === pas.DB.TFieldType.ftFloat) || ($tmp1 === pas.DB.TFieldType.ftInteger) || ($tmp1 === pas.DB.TFieldType.ftLargeInt) || ($tmp1 === pas.DB.TFieldType.ftAutoInc)) {
              VColumn.SetAlignment(pas.Classes.TAlignment.taRightJustify);
              VColumn.SetFormat($mod.TColumnFormat.cfNumber);
              VColumn.SetWidth(100);
            } else if ($tmp1 === pas.DB.TFieldType.ftDateTime) {
              VColumn.SetAlignment(pas.Classes.TAlignment.taRightJustify);
              VColumn.SetFormat($mod.TColumnFormat.cfDataTime);
              VColumn.SetWidth(100);
            } else {
              VColumn.SetFormat($mod.TColumnFormat.cfString);
              VColumn.SetWidth(200);
            };
          };
        } finally {
          this.EndUpdate();
        };
      };
    };
    this.ColumnsChanged = function (AColumn) {
      this.FNeedsFullRender = true;
      this.FLastResponsiveState = "";
      this.Changed();
    };
    this.CalcDefaultRowHeight = function () {
      var Result = 0;
      Result = this.FFont.TextHeight("Fj") + 10;
      if (pas.Forms.Screen.GetIsTouch() && (Result < 32)) Result = 32;
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 200;
      Result.cy = 100;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      $impl._DataGridSeq += 1;
      this.FScopeId = "dg" + pas.SysUtils.IntToStr($impl._DataGridSeq);
      this.FHandleElement.setAttribute("data-dg",this.FScopeId);
      this.FHandleWindowResize = rtl.createCallback(this,"HandleWindowResize");
      this.FColumns = $mod.TDataColumns.$create("Create$2",[this]);
      this.FActiveCell = null;
      this.fSelRow = -1;
      this.fSelCol = -1;
      this.FAutoCreateColumns = true;
      this.FColumnClickSorts = true;
      this.FDefColWidth = -1;
      this.FDefRowHeight = -1;
      this.FShowHeader = true;
      this.FSortColumn = -1;
      this.FSortOrder = $mod.TSortOrder.soAscending;
      this.FLastClickTime = 0;
      this.FLastClickCell = null;
      this.FLastTouchTime = 0;
      this.FAlternateRowColor = 0xF2F2F2;
      this.FNeedsFullRender = true;
      this.FResponsiveMode = false;
      this.FResponsiveBreakpoint = 0;
      this.FIsCardVisible = false;
      this.FLastCardRow = -1;
      this.FLastCardCol = -1;
      this.FTouchStartX = 0;
      this.FTouchStartY = 0;
      this.FLastResponsiveState = "";
      this.FFilterBox = false;
      this.FFilterText = "";
      this.FGroupField = "";
      this.FGroupCollapsed = new Object();
      this.BeginUpdate();
      try {
        this.SetColor(16777215);
        this.SetParentColor(false);
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    this.Destroy = function () {
      window.removeEventListener('resize', this.FHandleWindowResize);
      this.FColumns.$destroy("Destroy");
      this.FColumns = null;
      pas.Controls.TCustomControl.Destroy.call(this);
    };
    this.AddColumn = function () {
      var Result = null;
      Result = this.FColumns.Add$1();
      return Result;
    };
    this.Clear = function () {
      this.FData = null;
      this.FDataJSon = null;
      this.Changed();
    };
    this.ExportToCSV = function () {
      var VColIdx = 0;
      var VRowIdx = 0;
      var VCol = null;
      var VCSV = "";
      var VVal = "";
      var VFileName = "";
      var VObj = null;
      var VJSVal = undefined;
      VCSV = "";
      for (var $l = 0, $end = this.FColumns.GetCount() - 1; $l <= $end; $l++) {
        VColIdx = $l;
        VCol = this.FColumns.GetColumn(VColIdx);
        if (VColIdx > 0) VCSV = VCSV + ",";
        VCSV = VCSV + '"' + pas.Controls.IfThen$3(VCol.FTitle !== "",VCol.FTitle,VCol.FName) + '"';
      };
      VCSV = VCSV + "\r\n";
      if (this.FData != null) {
        for (var $l1 = 0, $end1 = this.FData.length - 1; $l1 <= $end1; $l1++) {
          VRowIdx = $l1;
          VJSVal = this.FData[VRowIdx];
          if (rtl.isObject(VJSVal)) {
            VObj = VJSVal;
            for (var $l2 = 0, $end2 = this.FColumns.GetCount() - 1; $l2 <= $end2; $l2++) {
              VColIdx = $l2;
              VCol = this.FColumns.GetColumn(VColIdx);
              if (VColIdx > 0) VCSV = VCSV + ",";
              VVal = this.FormatCellValue(VCol,VObj[VCol.FName]);
              VCSV = VCSV + '"' + pas.SysUtils.StringReplace(VVal,'"','""',rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll)) + '"';
            };
            VCSV = VCSV + "\r\n";
          };
        };
      } else if ((this.FDataJSon != null) && this.FDataJSon.GetActive()) {
        this.FDataJSon.First();
        while (!this.FDataJSon.FEOF) {
          for (var $l3 = 0, $end3 = this.FColumns.GetCount() - 1; $l3 <= $end3; $l3++) {
            VColIdx = $l3;
            VCol = this.FColumns.GetColumn(VColIdx);
            if (VColIdx > 0) VCSV = VCSV + ",";
            VVal = this.FDataJSon.FieldByName(VCol.FName).GetAsString();
            VCSV = VCSV + '"' + pas.SysUtils.StringReplace(VVal,'"','""',rtl.createSet(pas.SysUtils.TStringReplaceFlag.rfReplaceAll)) + '"';
          };
          VCSV = VCSV + "\r\n";
          this.FDataJSon.Next();
        };
      };
      VFileName = pas.Controls.IfThen$3(this.FName !== "",this.FName,"export") + ".csv";
      var blob = new Blob([VCSV], { type: 'text/csv;charset=utf-8;' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = VFileName;
      a.click();
      URL.revokeObjectURL(url);
    };
    this.Changed = function () {
      var VOldBody = null;
      var VContainer = null;
      var VFilterCard = null;
      var VFilterInput = null;
      var VIsCard = false;
      var VScrollPos = 0.0;
      pas.Controls.TCustomControl.Changed.call(this);
      if (this.FEnabled === false) return;
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        VIsCard = (this.FResponsiveMode && (this.FResponsiveBreakpoint === 0)) || this.FIsCardVisible;
        if (this.FNeedsFullRender) {
          var $with = this.FHandleElement;
          $with.innerHTML = "";
          $with.style.setProperty("border","1px solid #c9c3ba");
          $with.style.setProperty("border-collapse","collapse");
          $with.style.setProperty("border-spacing","0px");
          $with.style.setProperty("outline","none");
          if (this.FResponsiveMode) {
            if (this.FResponsiveBreakpoint > 0) this.FIsCardVisible = (window.innerWidth < this.FResponsiveBreakpoint);
            VIsCard = (this.FResponsiveBreakpoint === 0) || this.FIsCardVisible;
            if (VIsCard) {
              this.FHandleElement.style.setProperty("display","block")}
             else this.FHandleElement.style.setProperty("display","table");
            this.FHandleElement.classList.add('dg-card');
          } else {
            this.FHandleElement.style.setProperty("display","table");
            this.FHandleElement.classList.remove('dg-card');
          };
          this.FHandleElement.setAttribute("name",this.FName);
          this.RenderTableStyle();
          if (!VIsCard) {
            this.RenderTableHead();
            var th = this.FHandleElement.querySelector('thead');
            var tb = this.FHandleElement.querySelector('tbody');
            if (th && tb) {
              var h = th.offsetHeight;
              tb.style.top = h + 'px';
              tb.style.height = 'calc(100% - ' + h + 'px)';
            };
          } else {
            if (this.FFilterBox) {
              VFilterCard = document.createElement("div");
              VFilterCard.setAttribute("class","dg-card dg-filter-card");
              VFilterInput = document.createElement("input");
              VFilterInput.setAttribute("type","text");
              VFilterInput.setAttribute("placeholder","Filter...");
              VFilterInput.setAttribute("value",this.FFilterText);
              VFilterInput.addEventListener("keyup",rtl.createCallback(this,"HandleFilterInput"));
              VFilterCard.appendChild(VFilterInput);
              this.FHandleElement.appendChild(VFilterCard);
            };
            VContainer = document.createElement("div");
            VContainer.setAttribute("class","dg-card-container");
            this.FHandleElement.appendChild(VContainer);
          };
          this.FNeedsFullRender = false;
        } else {
          if (VIsCard) {
            VOldBody = this.FHandleElement.querySelector(".dg-card-container")}
           else VOldBody = this.FHandleElement.querySelector("tbody");
          if (VOldBody != null) {
            VScrollPos = VOldBody.scrollTop;
            this.FHandleElement.removeChild(VOldBody);
          };
          if (VIsCard) {
            VContainer = document.createElement("div");
            VContainer.setAttribute("class","dg-card-container");
            this.FHandleElement.appendChild(VContainer);
          };
        };
        if (VIsCard) {
          this.RenderCardBody()}
         else {
          var sr = this.fSelRow;
          var sc = this.fSelCol;
          this.RenderTableBody();
          this.fSelRow = sr;
          this.fSelCol = sc;
          var th = this.FHandleElement.querySelector('thead');
          var tb = this.FHandleElement.querySelector('tbody');
          if (th && tb) {
            var h = th.offsetHeight;
            tb.style.top = h + 'px';
            tb.style.height = 'calc(100% - ' + h + 'px)';
          };
        };
        if (!VIsCard && (VScrollPos > 0) && (this.Body != null)) {
          this.FScrollLoading = true;
          this.Body.scrollTop = VScrollPos;
          this.FScrollLoading = false;
        };
        if (!VIsCard) {
          if ((this.fSelRow >= 0) && (this.fSelCol >= 0)) {
            this.FActiveCell = this.SelectCell(this.fSelCol,this.fSelRow);
            if (this.FActiveCell != null) this.SetActiveCell(this.FActiveCell);
          } else {
            this.FActiveCell = this.SelectCell(0,0);
            if (this.FActiveCell != null) this.SetActiveCell(this.FActiveCell);
          };
        };
      };
      if (this.fOnEndDraw != null) this.fOnEndDraw(this);
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
    $r.addProperty("OnCellDblClick",0,$mod.$rtti["TOnClickEvent"],"FOnCellDblClick","FOnCellDblClick");
  });
  this.$rtti.$MethodVar("TOnPageEvent",{procsig: rtl.newTIProcSig([["ASender",pas.System.$rtti["TObject"]],["APage",rtl.nativeint]]), methodkind: 0});
  rtl.createClass(this,"TCustomPagination",pas.Controls.TCustomControl,function () {
    this.$init = function () {
      pas.Controls.TCustomControl.$init.call(this);
      this.FCurrentPage = 0;
      this.FOnPageClick = null;
      this.FRecordsPerPage = 0;
      this.FTotalPages = 0;
      this.FTotalRecords = 0;
    };
    this.$final = function () {
      this.FOnPageClick = undefined;
      pas.Controls.TCustomControl.$final.call(this);
    };
    this.SetCurrentPage = function (AValue) {
      if (this.FCurrentPage !== AValue) {
        this.FCurrentPage = AValue;
        this.Changed();
      };
    };
    this.SetRecordsPerPage = function (AValue) {
      if (this.FRecordsPerPage !== AValue) {
        this.FRecordsPerPage = AValue;
        this.Changed();
      };
    };
    this.SetTotalRecords = function (AValue) {
      if (this.FTotalRecords !== AValue) {
        this.FTotalRecords = AValue;
        this.Changed();
      };
    };
    this.PageClick = function (APage) {
      if (this.FOnPageClick != null) {
        this.FOnPageClick(this,APage);
      };
    };
    this.HandlePageClick = function (AEvent) {
      var Result = false;
      var VValue = "";
      VValue = pas.Web.TJSEventHelper.GetTargetElement.call(AEvent).innerHTML;
      if (VValue !== "") {
        if (VValue === "«") {
          this.FCurrentPage = 1}
         else if (VValue === "»") {
          this.FCurrentPage = this.FTotalPages}
         else this.FCurrentPage = pas.SysUtils.StrToIntDef(VValue,1);
      } else this.FCurrentPage = 1;
      AEvent.stopPropagation();
      this.PageClick(this.FCurrentPage);
      Result = true;
      this.Changed();
      return Result;
    };
    this.Changed = function () {
      var VIndex = 0;
      var VValue = 0;
      var VPageWidth = 0;
      var VPage = null;
      var VPages = null;
      pas.Controls.TCustomControl.Changed.call(this);
      if (!this.IsUpdating() && !(pas.Classes.TComponentStateItem.csLoading in this.FComponentState)) {
        var $with = this.FHandleElement;
        $with.innerHTML = "";
        $with.style.setProperty("outline","none");
        this.FHandleElement.setAttribute("name",this.FName);
        VPages = this.CalculatePages();
        VPageWidth = this.FFont.TextWidth("1000") + 10;
        if ((VPageWidth * 7) >= this.FWidth) VPageWidth = pas.System.Trunc(rtl.trunc(this.FWidth / 7));
        VPage = this.RenderPage("«",VPageWidth,rtl.createCallback(this,"HandlePageClick"),false);
        this.FHandleElement.appendChild(VPage);
        for (var $l = 0, $end = VPages.length - 1; $l <= $end; $l++) {
          VIndex = $l;
          VValue = rtl.trunc(VPages[VIndex]);
          VPage = this.RenderPage(pas.SysUtils.IntToStr(VValue),VPageWidth,rtl.createCallback(this,"HandlePageClick"),VValue === this.FCurrentPage);
          this.FHandleElement.appendChild(VPage);
        };
        VPage = this.RenderPage("»",VPageWidth,rtl.createCallback(this,"HandlePageClick"),false);
        this.FHandleElement.appendChild(VPage);
      };
    };
    this.CreateHandleElement = function () {
      var Result = null;
      Result = document.createElement("div");
      return Result;
    };
    this.CalculatePages = function () {
      var Result = null;
      var VIndex = 0;
      var VEnd = 0;
      var VStart = 0;
      this.FTotalPages = pas.Math.Ceil64(this.FTotalRecords / this.FRecordsPerPage);
      if (this.FCurrentPage < 1) this.FCurrentPage = 1;
      if (this.FTotalPages <= 5) {
        VStart = 1;
        VEnd = this.FTotalPages;
      } else {
        if (this.FCurrentPage <= 3) {
          VStart = 1;
          VEnd = 5;
        } else if ((this.FCurrentPage + 2) >= this.FTotalPages) {
          VStart = this.FTotalPages - 4;
          VEnd = this.FTotalPages;
        } else {
          VStart = this.FCurrentPage - 2;
          VEnd = this.FCurrentPage + 2;
        };
      };
      if (VEnd <= VStart) VEnd = VStart + 1;
      Result = new Array();
      for (var $l = VStart, $end = VEnd; $l <= $end; $l++) {
        VIndex = $l;
        Result.push(VIndex);
      };
      return Result;
    };
    this.RenderPage = function (ACaption, AWidth, AEvent, AActive) {
      var Result = null;
      Result = document.createElement("button");
      Result.style.setProperty("height","100%");
      Result.style.setProperty("width",pas.SysUtils.IntToStr(AWidth) + "px");
      Result.style.setProperty("border","1px solid #c9c3ba");
      Result.style.setProperty("background-color",pas.Controls.IfThen$3(AActive,"#fff","#dddada"));
      Result.style.setProperty("outline","none");
      Result.style.setProperty("padding","0");
      Result.style.setProperty("white-space","nowrap");
      Result.addEventListener("click",AEvent);
      Result.innerHTML = ACaption;
      return Result;
    };
    this.CheckChildClassAllowed = function (AChildClass) {
      var Result = false;
      Result = false;
      return Result;
    };
    this.GetControlClassDefaultSize = function () {
      var Result = pas.Types.TSize.$new();
      Result.cx = 150;
      Result.cy = 30;
      return Result;
    };
    this.Create$1 = function (AOwner) {
      pas.Controls.TControl.Create$1.call(this,AOwner);
      this.FCurrentPage = 1;
      this.FRecordsPerPage = 10;
      this.FTotalPages = 0;
      this.FTotalRecords = 0;
      this.BeginUpdate();
      try {
        this.SetTabStop(false);
        var $with = this.$class.GetControlClassDefaultSize();
        this.SetBounds(0,0,$with.cx,$with.cy);
      } finally {
        this.EndUpdate();
      };
      return this;
    };
    rtl.addIntf(this,pas.System.IUnknown);
    var $r = this.$rtti;
    $r.addMethod("Create$1",2,[["AOwner",pas.Classes.$rtti["TComponent"]]]);
  });
  $mod.$implcode = function () {
    $impl.DblClickThreshold = 0.000005;
    $impl._DataGridSeq = 0;
    $impl.FindClosestParent = function (AElement, ATagName) {
      var Result = null;
      var Current = null;
      Result = null;
      if (!(AElement != null)) return Result;
      Current = AElement;
      while (Current != null) {
        if (pas.SysUtils.SameText(Current.tagName,ATagName)) {
          Result = Current;
          return Result;
        };
        Current = Current.parentElement;
      };
      return Result;
    };
  };
},["Math","MaskUtils","Forms"]);
//# sourceMappingURL=datagrid.js.map
