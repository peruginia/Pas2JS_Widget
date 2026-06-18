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
unit WebCtrls;

{$mode objfpc}{$H+}

interface

uses
  Classes,
  SysUtils,{%H-}
  LResources,
  LCLType,
  Graphics,
  Controls,
  Forms,
  StdCtrls,
  ExtCtrls,
  ComCtrls,
  NumCtrlsD,
  DttCtrlsD,
  BtnCtrlsD,
  DataGridD,
  CustomTimer,
  Grids,
  websocket,
  WebDBD;

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

  { TCustomTrackBar }

  TCustomTrackBar = class(TCustomControl)
  private
    FMax: LongInt;
    FMin: LongInt;
    FPosition: LongInt;
    procedure SetMax(AValue: LongInt);
    procedure SetMin(AValue: LongInt);
    procedure SetPosition(AValue: LongInt);
  protected
    procedure Paint; override;
  public
    constructor Create(AOwner: TComponent); override;
  published
    property Max: LongInt read FMax write SetMax default 100;
    property Min: LongInt read FMin write SetMin default 0;
    property Position: LongInt read FPosition write SetPosition default 0;
  end;

  { TCustomColorPicker }

  TCustomColorPicker = class(TCustomControl)
  private
    FColor: TColor;
    procedure SetColor(AValue: TColor);
  protected
    procedure Paint; override;
  public
    constructor Create(AOwner: TComponent); override;
  published
    property Color: TColor read FColor write SetColor default clBlack;
  end;

  TJSTouch = class
  private
    FClientX: longint;
    FClientY: longint;
    FIDentifier: longint;
    FPageX: longint;
    FPageY: longint;
    FScreenX: longint;
    FScreenY: longint;
    //FTarget: TJSElement;
  Public
    Property identifier : longint read FIDentifier;
    Property ScreenX : longint Read FScreenX;
    Property ScreenY : longint Read FScreenY;
    Property ClientX : longint Read FClientX;
    Property ClientY : longint Read FClientY;
    Property PageX : longint Read FPageX;
    Property PageY : longint Read FPageY;
    //Property Target : TJSElement Read FTarget;
  end;

  TJSTouchList = class
  private
    FLength: NativeInt;
  Public
    item : array of TJSTouch;
    length : NativeInt;
    Touches :array of TJSTouch;
  end;

  TJSTouchEvent = Class
  private
    FAltKey: Boolean;
    FChangedTouches: TJSTouchList;
    FCtrlKey: Boolean;
    FMetaKey: Boolean;
    FShiftKey: Boolean;
    FTargetTouches: TJSTouchList;
    FTouches: TJSTouchList;

  Public
    altKey : Boolean;
    ctrlKey : Boolean ;
    metaKey : Boolean;
    shiftKey : Boolean;
    changedTouches : TJSTouchList;
    touches : TJSTouchList;
    targetTouches : TJSTouchList;
  end;


  TJSTouchEventHandler = procedure(aEvent : TJSTouchEvent) of object;

  { TWForm }

  TWForm = class(TCustomForm)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property ActiveControl;
    property Align;
    property AlphaBlend;
    property AlphaBlendValue;
    property Caption;
    property ClientHeight;
    property ClientWidth;
    property Color;
    property DesignTimePPI;
    property Enabled;
    property Font;
    ///property FormType;  
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property KeyPreview;
    property ShowHint;
    property Visible;
    property OnActivate;
    property OnClick;
    property OnClose;
    property OnCloseQuery;
    property OnCreate;
    property OnDblClick;
    property OnDeactivate;
    property OnDestroy;
    property OnHide;
    property OnKeyDown;
    property OnKeyPress;
    property OnKeyUp;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
    property OnResize;
    ///property OnScroll;
    property OnShow;
  end;
  TWFormClass = class of TWForm;

  { TWFrame }

  TWFrame = class(TCustomFrame)
  published
    property Align;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property ClientHeight;
    property ClientWidth;
    property Color;
    property Enabled;
    property Font;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property TabOrder;
    property TabStop;
    property Visible;
    property OnClick;
    property OnDblClick;
    property OnEnter;
    property OnExit;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
    property OnResize;
  end;
  TWFrameClass = class of TWFrame;

  { TWDataModule }

  TWDataModule = class(TDataModule)
  end;   
  TWDataModuleClass = class of TWDataModule;

  { TWComboBox }

  TWComboBox = class(TCustomComboBox)
  private
    FHandleClass: string;
    FHandleId: string;
  public
    constructor Create(AOwner: TComponent); override;
  published
    property Align;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property BorderStyle;
    property Color;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property ItemHeight;
    property ItemIndex;
    property Items;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property TabOrder;
    property TabStop;
    property Text;
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
    property OnMouseWheel;
  end;

  { TWListBox }

  TWListBox = class(TCustomListBox)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property Align;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property BorderStyle;
    property Color;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property ItemHeight;
    property ItemIndex;
    property Items;
    property MultiSelect;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property TabOrder;
    property TabStop;
    property Visible;
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
    property OnMouseWheel;
    property OnSelectionChange;
  end;

  { TWEdit }

  TWEdit = class(TCustomEdit)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property Align;
    property Alignment;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property BorderStyle;
    property CharCase;
    property Color;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property MaxLength;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property PasswordChar;
    property ReadOnly;
    property ShowHint;
    property TabStop;
    property TabOrder;
    property Text;
    property TextHint;
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
    property OnMouseWheel;
    property OnResize;
  end;

  { TWMemo }

  TWMemo = class(TCustomMemo)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property Align;
    property Alignment;
    property Anchors;
    property BorderSpacing;
    property BorderStyle;
    property CharCase;
    property Color;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property Lines;
    property MaxLength;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property ReadOnly;
    property ShowHint;
    property TabOrder;
    property TabStop;
    property TextHint;
    property Visible;
    property WantReturns;
    property WantTabs;
    property WordWrap;
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
    property OnMouseWheel;
    property OnResize;
  end;

  { TWButton }

  TWButton = class(TCustomButton)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property Align;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property Caption;
    property Color;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property Hint;
    property ModalResult;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property TabOrder;
    property TabStop;
    property Visible;
    property OnClick;
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
    property OnMouseWheel;
    property OnResize;
  end;

  { TWCheckbox }

  TWCheckbox = class(TCustomCheckbox)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property Align;
    property Alignment;
    /// property AllowGrayed;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property Caption;
    property Checked;
    property Color;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property State;
    property TabOrder;
    property TabStop;
    property Visible;
    property OnChange;
    property OnClick;
    property OnEnter;
    property OnExit;
    property OnKeyPress;
    property OnKeyDown;
    property OnKeyUp;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
    property OnResize;
  end;

  { TWRadioButton }

  TWRadioButton = class(TCustomCheckBox)
  protected
    procedure CreateParams(var Params: TCreateParams); override;
  public
    constructor Create(TheOwner: TComponent); override;
  published
    property Align;
    property Alignment;
    property Anchors;
    property AutoSize default True;
    property BidiMode;
    property BorderSpacing;
    property Caption;
    property Checked;
    property Color;
    property Constraints;
    property DoubleBuffered;
    property DragCursor;
    property DragKind;
    property DragMode;
    property Enabled;
    property Font;
    property Hint;
    property OnChange;
    property OnClick;
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
    property OnMouseWheel;
    property OnResize;
    property OnStartDrag;
    property ParentBidiMode;
    property ParentColor;
    property ParentDoubleBuffered;
    property ParentFont;
    property ParentShowHint;
    property PopupMenu;
    property ShowHint;
    property TabOrder;
    property TabStop default False;
    property Visible;
  end;

  { TWLabel }

  TWLabel = class(TCustomLabel)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property Align;
    property Alignment;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property Caption;
    property Color;
    property Enabled;
    property FocusControl;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property Layout;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property Transparent;
    property Visible;
    property WordWrap;
    property OnClick;
    property OnDblClick;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
    property OnResize;
  end;

  { TWImage }

  TWImage = class(TCustomImage)
  private
    FHandleClass: string;
    FHandleId: string;
    FURL: String;

    // Touch
    fontouchstart: TJSTouchEventHandler;
    fontouchmove: TJSTouchEventHandler;
    fontouchcancel: TJSTouchEventHandler;
    fontouchend: TJSTouchEventHandler;
  published
    property Align;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property Center;
    property Enabled;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property ParentShowHint;
    property Proportional;
    property ShowHint;
    property Stretch;
    property StretchOutEnabled;
    property StretchInEnabled;
    property Transparent;
    property URL: String read FURL write FURL;
    property Visible;
    property OnClick;
    property OnDblClick;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
    property OnPaint;
    property OnPictureChanged;
    property OnResize;

    property ontouchstart: TJSTouchEventHandler read fontouchstart write fontouchstart;
    property ontouchmove: TJSTouchEventHandler read fontouchmove write fontouchmove;
    property ontouchcancel: TJSTouchEventHandler read fontouchcancel write fontouchcancel;
    property ontouchend: TJSTouchEventHandler read fontouchend write fontouchend;
  end;

  { TWPanel }

  TWPanel = class(TCustomPanel)
  private
    FHandleClass: string;
    FHandleId: string;
    FScrollvertical,fScrollHorizontal : Boolean;

    // Touch
    fontouchstart: TJSTouchEventHandler;
    fontouchmove: TJSTouchEventHandler;
    fontouchcancel: TJSTouchEventHandler;
    fontouchend: TJSTouchEventHandler;
  published
    property Align;
    property Alignment;
    property Anchors;
    property AutoSize;
    property BevelColor;
    property BevelInner;
    property BevelOuter;
    property BevelWidth;
    property BorderSpacing;
    property Caption;
    property ClientHeight;
    property ClientWidth;
    property Color;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property TabOrder;
    property TabStop;
    property Visible;
    property Wordwrap;
    property OnClick;
    property OnDblClick;
    property OnEnter;
    property OnExit;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
    property OnPaint;
    property OnResize;
    property ScrollVertical : boolean read FScrollVertical write FScrollVertical default false;
    property ScrollHorizontal : boolean read fScrollHorizontal write fScrollHorizontal default false;

    //touch
    property ontouchstart: TJSTouchEventHandler read fontouchstart write fontouchstart;
    property ontouchmove: TJSTouchEventHandler read fontouchmove write fontouchmove;
    property ontouchcancel: TJSTouchEventHandler read fontouchcancel write fontouchcancel;
    property ontouchend: TJSTouchEventHandler read fontouchend write fontouchend;
  end;

  { TWTimer }

  TWTimer = class(TCustomTimer)
  published
    property Enabled;
    property Interval;
    property OnTimer;
    property OnStartTimer;
    property OnStopTimer;
  end;

  { TWWebSocketClient }

  TWWebSocketClient = class(TCustomWebSocketClient)
  published
    property Url;
    property OnBinaryMessage;
    property OnClose;
    property OnError;
    property OnMessage;
    property OnOpen;
  end;

  { TWWebDBConnection }

  TWWebDBConnection = class(TCustomWebDBConnection)
  published
    property Backend;
    property BaseURL;
    property DBName;
    property DBVersion;
    property StoreName;
  end;

  { TWWebDBTable }

  TWWebDBTable = class(TCustomWebDBTable)
  published
    property Connection;
    property TableName;
    property AutoLoad;
    property Progressive;
    property PageSize;
    property OnLoad;
    property OnSave;
    property OnLoadError;
  end;

  { TWPageControl }

  TWPageControl = class(TPageControl)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
  end;

  { TWGroupBox }

  TWGroupBox = class(TCustomGroupBox)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
  end;

  { TWScrollBox }

  TWScrollBox = class(TCustomScrollBox)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
  end;

  { TWProgressBar }

  TWProgressBar = class(TCustomProgressBar)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
  end;

  { TWTrackBar }

  TWTrackBar = class(TCustomTrackBar)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
  end;

  { TWColorPicker }

  TWColorPicker = class(TCustomColorPicker)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
  end;

  { TWFloatEdit }

  TWFloatEdit = class(TCustomNumericEdit)
  private
    FHandleClass: string;
    FHandleId: string;
    function GetValue: double;
    procedure SetValue(AValue: double);
  protected
    procedure RealSetText(const AValue: TCaption); override;
  published
    property Align;
    property Alignment;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property BorderStyle;
    property Color;
    property DecimalPlaces;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property MaxValue;
    property MinValue;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property PasswordChar;
    property ReadOnly;
    property ShowHint;
    property TabStop;
    property TabOrder;
    property Text;
    property TextHint;
    property Value: double read GetValue write SetValue;
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
    property OnMouseWheel;
    property OnResize;
  end;

  { TWIntegerEdit }

  TWIntegerEdit = class(TCustomNumericEdit)
  private
    FHandleClass: string;
    FHandleId: string;
    function GetValue: NativeInt;
    procedure SetValue(AValue: NativeInt);
  protected
    procedure RealSetText(const AValue: TCaption); override;
  public
    constructor Create(AOwner: TComponent); override;
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
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property MaxValue;
    property MinValue;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property PasswordChar;
    property ReadOnly;
    property ShowHint;
    property TabStop;
    property TabOrder;
    property Text;
    property TextHint;
    property Value: NativeInt read GetValue write SetValue;
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
    property OnMouseWheel;
    property OnResize;
  end;

  { TWDateEditBox }

  TWDateEditBox = class(TCustomDateTimeEdit)
  private
    FHandleClass: string;
    FHandleId: string;
    function GetValue: TDate;
    procedure SetValue(AValue: TDate);
  protected
    procedure RealSetText(const AValue: TCaption); override;
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
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property PasswordChar;
    property ReadOnly;
    property ShowHint;
    property TabStop;
    property TabOrder;
    property Text;
    property TextHint;
    property Value: TDate read GetValue write SetValue;
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
    property OnMouseWheel;
    property OnResize;
  end;

  { TWTimeEditBox }

  TWTimeEditBox = class(TCustomDateTimeEdit)
  private
    FHandleClass: string;
    FHandleId: string;
    function GetValue: TTime;
    procedure SetValue(AValue: TTime);
  protected
    procedure RealSetText(const AValue: TCaption); override;
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
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property ParentColor;
    property ParentFont;
    property ParentShowHint;
    property PasswordChar;
    property ReadOnly;
    property ShowHint;
    property TabStop;
    property TabOrder;
    property Text;
    property TextHint;
    property Value: TTime read GetValue write SetValue;
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
    property OnMouseWheel;
    property OnResize;
  end;

  { TWDateTimePicker }

  TWDateTimePicker = class(TCustomDateTimePicker)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
  end;

  { TWFileButton }

  TWFileButton = class(TCustomFileButton)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property Align;
    property Anchors;
    property AutoSize;
    property BorderSpacing;
    property Caption;
    property Color;
    property Enabled;
    property Filter;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    //property ModalResult;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property TabOrder;
    property TabStop;
    property Visible;
    property OnChange;
    property OnClick;
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
    property OnMouseWheel;
    property OnResize;
  end;

  { TWDataGrid }

  TWDataGrid = class(TCustomDataGrid)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property Align;
    property Anchors;
    property BorderSpacing;
    property Columns;
    property ColumnClickSorts;
    property DefaultColWidth;
    property DefaultRowHeight;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property ParentFont;
    property ParentShowHint;
    property ShowHint;
    property SortOrder;
    property ShowHeader;
    property AlternateRowColor;
    property ResponsiveMode;
    property ResponsiveBreakpoint;
    property FilterBox;
    property InfiniteScroll;
    property TabOrder;
    property TabStop;
    property Visible;
    property OnCellClick;
    property OnCellDblClick;
    property OnEnter;
    property OnExit;
    property OnHeaderClick;
    property OnKeyDown;
    property OnKeyPress;
    property OnKeyUp;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;

    // DataSet
    property DataJSon;
    property DataTable;

    // Extend
    property RowSelect;
    property OnEndDraw;
    property OnAddSeparator;
    property OnDrawColumnCell;

  end;

  { TWPagination }

  TWPagination = class(TCustomPagination)
  private
    FHandleClass: string;
    FHandleId: string;
  published
    property Align;
    property Anchors;
    property BorderSpacing;
    property CurrentPage;
    property Enabled;
    property Font;
    property HandleClass: string read FHandleClass write FHandleClass;
    property HandleId: string read FHandleId write FHandleId;
    property ParentFont;
    property ParentShowHint;
    property RecordsPerPage;
    property ShowHint;
    property TabOrder;
    property TabStop;
    property TotalPages;
    property TotalRecords;
    property Visible;
    property OnKeyDown;
    property OnKeyPress;
    property OnKeyUp;
    property OnMouseDown;
    property OnMouseEnter;
    property OnMouseLeave;
    property OnMouseMove;
    property OnMouseUp;
    property OnMouseWheel;
    property OnPageClick;
  end;

  { TWStringGrid }

  TWStringGrid = class(TCustomStringGrid)
  public
    constructor Create(aOwner: TComponent); override;
  published
    property Anchors;
    property ColCount;
    property Columns;
    property DefaultColWidth;
    property DefaultRowHeight;
    property FixedCols;
    property FixedRows;
    property Options default [];
    property RowCount;
    property OnSelection;
  end;

procedure Register;

implementation

uses
  Types;

procedure Register;
begin
  {$I webctrls.lrs}
  RegisterComponents('WCL', [
    TWComboBox,
    TWListBox,
    TWEdit,
    TWMemo,
    TWButton,
    TWCheckbox,
    TWRadioButton,
    TWLabel,
    TWImage,
    TWPanel,
    TWTimer,
    TWPageControl,
    TWFloatEdit,
    TWIntegerEdit,
    TWDateEditBox,
    TWTimeEditBox,
    TWDateTimePicker,
    TWFileButton,
    TWDataGrid,
    TWPagination,
    TWStringGrid,
    TWWebSocketClient,
    TWGroupBox,
    TWScrollBox,
    TWProgressBar,
    TWTrackBar,
    TWColorPicker,
    TWWebDBConnection,
    TWWebDBTable
    ]);
end;

{ TWRadioButton }

procedure TWRadioButton.CreateParams(var Params: TCreateParams);
begin
  inherited CreateParams(Params);
  Params.Style := (Params.Style and not BS_3STATE) or BS_RADIOBUTTON;
end;

constructor TWRadioButton.Create(TheOwner: TComponent);
begin
  inherited Create(TheOwner);
  AutoSize := True;
end;

{ TWStringGrid }

constructor TWStringGrid.Create(aOwner: TComponent);
begin
  inherited Create(aOwner);
  Options := [];
end;

{ TWComboBox }

constructor TWComboBox.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  Style := csDropDownList;
end;

{ TWFloatEdit }

function TWFloatEdit.GetValue: double;
begin
  Result := StrToFloatDef(RealGetText, 0);
end;

procedure TWFloatEdit.SetValue(AValue: double);
begin
  RealSetText(FloatToStrF(AValue, ffFixed, 20, DecimalPlaces));
end;

procedure TWFloatEdit.RealSetText(const AValue: TCaption);
begin
  inherited RealSetText(FloatToStrF(StrToFloatDef(AValue, 0), ffFixed, 20, DecimalPlaces));
end;

{ TWIntegerEdit }

function TWIntegerEdit.GetValue: NativeInt;
begin
  Result := StrToIntDef(RealGetText, 0);
end;

procedure TWIntegerEdit.SetValue(AValue: NativeInt);
begin
  RealSetText(FloatToStrF(AValue, ffFixed, 20, DecimalPlaces));
end;

procedure TWIntegerEdit.RealSetText(const AValue: TCaption);
begin
  inherited RealSetText(FloatToStrF(StrToFloatDef(AValue, 0), ffFixed, 20, DecimalPlaces));
end;

constructor TWIntegerEdit.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  DecimalPlaces := 0;
end;

{ TWDateEditBox }

function TWDateEditBox.GetValue: TDate;
begin
  Result := StrToDateDef(RealGetText, 0);
end;

procedure TWDateEditBox.SetValue(AValue: TDate);
begin
  RealSetText(DateToStr(AValue));
end;

procedure TWDateEditBox.RealSetText(const AValue: TCaption);
begin
  inherited RealSetText(FormatDateTime(DefaultFormatSettings.ShortDateFormat, StrToDateDef(AValue, 0)));
end;

{ TWTimeEditBox }

function TWTimeEditBox.GetValue: TTime;
begin
  Result := StrToTimeDef(RealGetText, 0);
end;

procedure TWTimeEditBox.SetValue(AValue: TTime);
begin
  RealSetText(TimeToStr(AValue));
end;

procedure TWTimeEditBox.RealSetText(const AValue: TCaption);
begin
  inherited RealSetText(FormatDateTime(DefaultFormatSettings.ShortTimeFormat, StrToTimeDef(AValue, 0)));
end;

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

{ TCustomTrackBar }

constructor TCustomTrackBar.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FMin := 0;
  FMax := 100;
  FPosition := 0;
  Width := 150;
  Height := 30;
end;

procedure TCustomTrackBar.SetMax(AValue: LongInt);
begin
  if FMax <> AValue then
  begin
    if AValue < FMin then AValue := FMin;
    FMax := AValue;
    if FPosition > FMax then FPosition := FMax;
    Invalidate;
  end;
end;

procedure TCustomTrackBar.SetMin(AValue: LongInt);
begin
  if FMin <> AValue then
  begin
    if AValue > FMax then AValue := FMax;
    FMin := AValue;
    if FPosition < FMin then FPosition := FMin;
    Invalidate;
  end;
end;

procedure TCustomTrackBar.SetPosition(AValue: LongInt);
begin
  if AValue < FMin then AValue := FMin;
  if AValue > FMax then AValue := FMax;
  if FPosition <> AValue then
  begin
    FPosition := AValue;
    Invalidate;
  end;
end;

procedure TCustomTrackBar.Paint;
var
  R: TRect;
  ThumbX: Integer;
begin
  inherited Paint;
  R := ClientRect;
  Canvas.Brush.Color := clBtnFace;
  Canvas.FillRect(R);
  Canvas.Pen.Color := clGray;
  Canvas.MoveTo(4, R.Height div 2);
  Canvas.LineTo(R.Width - 4, R.Height div 2);
  if (FMax > FMin) then
  begin
    ThumbX := Round((FPosition - FMin) / (FMax - FMin) * (R.Width - 12)) + 6;
    Canvas.Brush.Color := clHighlight;
    Canvas.Rectangle(ThumbX - 5, 4, ThumbX + 5, R.Height - 4);
  end;
end;

{ TCustomColorPicker }

constructor TCustomColorPicker.Create(AOwner: TComponent);
begin
  inherited Create(AOwner);
  FColor := clBlack;
  Width := 50;
  Height := 30;
end;

procedure TCustomColorPicker.SetColor(AValue: TColor);
begin
  if FColor <> AValue then
  begin
    FColor := AValue;
    Invalidate;
  end;
end;

procedure TCustomColorPicker.Paint;
var
  R: TRect;
begin
  inherited Paint;
  R := ClientRect;
  Canvas.Pen.Color := clGray;
  Canvas.Brush.Color := FColor;
  Canvas.Rectangle(R);
end;

end.
