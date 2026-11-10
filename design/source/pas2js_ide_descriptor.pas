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
unit Pas2JS_IDE_Descriptor;

{$mode objfpc}{$H+}

interface

uses
  Classes,
  SysUtils,
  Forms,
  Controls,
  LazIDEIntf,
  ProjectIntf,
  CompOptsIntf,
  FormEditingIntf,
  PropEdits;

type

  { TPas2JSProject }

  TPas2JSProject = class(TProjectDescriptor)
  private
    FPas2JSBuilder: string;
    FPas2JSJSON: string;
  public
    constructor Create; override;
    function GetLocalizedName: string; override;
    function GetLocalizedDescription: string; override;
    function InitProject(AProject: TLazProject): TModalResult; override;
    function CreateStartFiles({%H-}AProject: TLazProject): TModalResult; override;
  end;

  { TPas2JSModuleProject }

  TPas2JSModuleProject = class(TProjectDescriptor)
  public
    constructor Create; override;
    function GetLocalizedName: string; override;
    function GetLocalizedDescription: string; override;
    function InitProject(AProject: TLazProject): TModalResult; override;
    function CreateStartFiles({%H-}AProject: TLazProject): TModalResult; override;
  end;

  { TPas2JSWForm }

  TPas2JSWForm = class(TFileDescPascalUnitWithResource)
  public
    constructor Create; override;
    function GetInterfaceUsesSection: string; override;
    function GetInterfaceSource(const {%H-}Filename, {%H-}SourceName, ResourceName: string): string; override;
    function GetLocalizedName: string; override;
    function GetLocalizedDescription: string; override;
  end;

  { TPas2JSWFrame }

  TPas2JSWFrame = class(TFileDescPascalUnitWithResource)
  public
    constructor Create; override;
    function GetInterfaceUsesSection: string; override;
    function GetInterfaceSource(const {%H-}Filename, {%H-}SourceName, ResourceName: string): string; override;
    function GetLocalizedName: string; override;
    function GetLocalizedDescription: string; override;
  end;

  { TPas2JSWDataModule }

  TPas2JSWDataModule = class(TFileDescPascalUnitWithResource)
  public
    constructor Create; override;
    function GetInterfaceUsesSection: string; override;
    function GetInterfaceSource(const {%H-}Filename, {%H-}SourceName, ResourceName: string): string; override;
    function GetLocalizedName: string; override;
    function GetLocalizedDescription: string; override;
  end;

procedure Register;

var
  VPas2JSProject: TPas2JSProject;
  VPas2JSModuleProject: TPas2JSModuleProject;
  VPas2JSWForm: TPas2JSWForm;    
  VPas2JSWFrame: TPas2JSWFrame;   
  VPas2JSWDataModule: TPas2JSWDataModule;

implementation

uses
  TypInfo,
  FileUtil,
  WebCtrls,
  FPJSON,
  ComponentEditors;

{ TPas2JSProject }

constructor TPas2JSProject.Create;
begin
  inherited Create;
  FPas2JSBuilder := '';
  FPas2JSJSON := '';
  Name := 'Web GUI Application (Pas2JS)';
end;

function TPas2JSProject.GetLocalizedName: string;
begin
  Result := 'Web GUI Application (Pas2JS)';
end;

function TPas2JSProject.GetLocalizedDescription: string;
begin
  Result := 'Create a Pas2JS Web GUI application';
end;

function TPas2JSProject.InitProject(AProject: TLazProject): TModalResult;

  function Project: TLazProjectFile;

    function Source: string;
    const
      LE = LineEnding;
    begin
      Result :=
        'program Project1; ' + LE +
        '' + LE +
        '{$mode delphi}{$H+}' + LE +
        '' + LE +
        'uses' + LE +
        '  Interfaces, Forms;' + LE +
        '' + LE +
        'begin' + LE +
        '  Application.Initialize;' + LE +
        '  Application.Run;' + LE +
        'end.';
    end;

  begin
    Result := AProject.CreateProjectFile('project1.lpr');
    Result.IsPartOfProject := True;
    Result.SetSourceText(Source, True);
  end;

  function HTMLFile: TLazProjectFile;
  const
    TemplateHTMLSource =
         '<!doctype html>'+LineEnding
        +'<html lang="en">'+LineEnding
        +'<head>'+LineEnding
        +'  <meta http-equiv="Content-type" content="text/html; charset=utf-8">'+LineEnding
        +'  <meta name="viewport" content="width=device-width, initial-scale=1">'+LineEnding
        +'  <title>Project1</title>'+LineEnding
        +'  <script src="project1.js"></script>'+LineEnding
        +'</head>'+LineEnding
        +'<body>'+LineEnding
        +'  <script>'+LineEnding
        +'    rtl.run();'+LineEnding
        +'  </script>'+LineEnding
        +'</body>'+LineEnding
        +'</html>'+LineEnding;
  begin
    Result := AProject.CreateProjectFile('project1.html');
    Result.IsPartOfProject := True;
    AProject.CustomData.Values['PasJSHTMLFile'] := Result.Filename;
    AProject.CustomData['PasJSWebBrowserProject'] := '1';
    Result.CustomData['PasJSIsProjectHTMLFile'] := '1';
    Result.CustomData.Values['MaintainHTML'] := '1';
    Result.SetSourceText(TemplateHTMLSource);

  end;

var
  CompOpts: TLazCompilerOptions;
begin
  Result := inherited InitProject(AProject);
  AProject.AddFile(Project, False);
  AProject.AddFile(HTMLFile, True);

  AProject.AddPackageDependency('pas2js_rtl');
  AProject.AddPackageDependency('WCL');
  AProject.Flags := AProject.Flags - [pfRunnable];
  AProject.LoadDefaultIcon;
  AProject.MainFileID := 0;
  AProject.LazCompilerOptions.TargetFilename := 'project1';
  CompOpts := AProject.LazCompilerOptions;
  CompOpts.TargetOS:='Browser';
  CompOpts.GenerateDebugInfo := False;
  CompOpts.CompilerPath := '$(pas2js)';
  CompOpts.CustomOptions := '-Jeutf-8 -Jirtl.js -Jc -Jminclude -JRjs';
end;

function TPas2JSProject.CreateStartFiles(AProject: TLazProject): TModalResult;
begin
  LazarusIDE.DoOpenEditorFile('project1.html', -1, -1, [ofProjectLoading,ofRegularFile]);
  LazarusIDE.DoNewEditorFile(VPas2JSWForm, '', '', [nfIsPartOfProject, nfOpenInEditor, nfCreateDefaultSrc]);
  Result := mrOk;
end;

{ TPas2JSModuleProject }

constructor TPas2JSModuleProject.Create;
begin
  inherited Create;
  Name := 'Web Module (Pas2JS)';
end;

function TPas2JSModuleProject.GetLocalizedName: string;
begin
  Result := 'Web Module (Pas2JS)';
end;

function TPas2JSModuleProject.GetLocalizedDescription: string;
begin
  Result := 'Create a Pas2JS module: the units are compiled to separate ' +
    'JavaScript modules that a host application can load at runtime';
end;

function TPas2JSModuleProject.InitProject(AProject: TLazProject): TModalResult;
const
  LE = LineEnding;
  MainSource =
    'program Project1;' + LE +
    '' + LE +
    '{$mode delphi}{$H+}' + LE +
    '' + LE +
    'uses' + LE +
    '  JS, Classes, SysUtils, Forms, WebCtrls, Module1;' + LE +
    '' + LE +
    'begin' + LE +
    '  // A module does not start the application: the host does.' + LE +
    '  // Module1 registers itself in its initialization section; the' + LE +
    '  // host can also call TModule1.Register explicitly.' + LE +
    'end.';
  UnitSource =
    'unit Module1;' + LE +
    '' + LE +
    '{$mode delphi}{$H+}' + LE +
    '' + LE +
    'interface' + LE +
    '' + LE +
    'uses' + LE +
    '  JS, Classes, SysUtils, Forms, WebCtrls;' + LE +
    '' + LE +
    'type' + LE +
    '  TModule1 = class' + LE +
    '  public' + LE +
    '    class procedure Register;' + LE +
    '  end;' + LE +
    '' + LE +
    'implementation' + LE +
    '' + LE +
    'class procedure TModule1.Register;' + LE +
    'begin' + LE +
    '  // Register screens, services and actions in the host application.' + LE +
    'end;' + LE +
    '' + LE +
    'initialization' + LE +
    '  // Runs when the module is loaded. Remove this call if the host' + LE +
    '  // calls TModule1.Register explicitly.' + LE +
    '  TModule1.Register;' + LE +
    '' + LE +
    'end.';
  HTMLSource =
    '<!doctype html>' + LE +
    '<html lang="en">' + LE +
    '<head>' + LE +
    '  <meta charset="utf-8">' + LE +
    '  <meta name="viewport" content="width=device-width, initial-scale=1">' + LE +
    '  <title>Project1 module</title>' + LE +
    '</head>' + LE +
    '<body>' + LE +
    '  <pre id="module-status">Loading...</pre>' + LE +
    '  <script>' + LE +
    '    (async function () {' + LE +
    '      function loadScript(url) {' + LE +
    '        return new Promise(function (resolve, reject) {' + LE +
    '          var script = document.createElement("script");' + LE +
    '          script.src = url;' + LE +
    '          script.onload = function () { resolve(); };' + LE +
    '          script.onerror = function () { reject(new Error("Cannot load " + url)); };' + LE +
    '          document.head.appendChild(script);' + LE +
    '        });' + LE +
    '      }' + LE +
    '      async function loadFirst(urls) {' + LE +
    '        var last = null;' + LE +
    '        for (var i = 0; i < urls.length; i++) {' + LE +
    '          try { await loadScript(urls[i]); return; }' + LE +
    '          catch (error) { last = error; }' + LE +
    '        }' + LE +
    '        throw last || new Error("Nothing to load");' + LE +
    '      }' + LE +
    '      async function fetchManifest(urls) {' + LE +
    '        for (var i = 0; i < urls.length; i++) {' + LE +
    '          try {' + LE +
    '            var response = await fetch(urls[i]);' + LE +
    '            if (response.ok) return { url: urls[i], data: await response.json() };' + LE +
    '          } catch (error) {}' + LE +
    '        }' + LE +
    '        return null;' + LE +
    '      }' + LE +
    '      try {' + LE +
    '        await loadFirst(["project1.js", "lib/project1.js"]);' + LE +
    '        var manifest = await fetchManifest(["modules.json", "lib/modules.json"]);' + LE +
    '        if (manifest) {' + LE +
    '          var base = manifest.url.slice(0, manifest.url.length - "modules.json".length);' + LE +
    '          for (var i = 0; i < manifest.data.files.length; i++) {' + LE +
    '            var item = manifest.data.files[i];' + LE +
    '            var file = typeof item === "string" ? item : item.file;' + LE +
    '            await loadScript(base + file);' + LE +
    '          }' + LE +
    '        }' + LE +
    '        rtl.run("program");' + LE +
    '        document.getElementById("module-status").textContent = "Module loaded.";' + LE +
    '      } catch (error) {' + LE +
    '        document.getElementById("module-status").textContent = String(error);' + LE +
    '        console.error(error);' + LE +
    '      }' + LE +
    '    })();' + LE +
    '  </script>' + LE +
    '</body>' + LE +
    '</html>';
var
  CompOpts: TLazCompilerOptions;
  MainFile: TLazProjectFile;
  UnitFile: TLazProjectFile;
  HtmlFile: TLazProjectFile;
begin
  Result := inherited InitProject(AProject);

  MainFile := AProject.CreateProjectFile('project1.lpr');
  MainFile.IsPartOfProject := True;
  MainFile.SetSourceText(MainSource, True);
  AProject.AddFile(MainFile, False);

  UnitFile := AProject.CreateProjectFile('module1.pas');
  UnitFile.IsPartOfProject := True;
  UnitFile.SetSourceText(UnitSource);
  AProject.AddFile(UnitFile, False);

  HtmlFile := AProject.CreateProjectFile('project1.html');
  HtmlFile.IsPartOfProject := True;
  HtmlFile.SetSourceText(HTMLSource);
  AProject.CustomData.Values['PasJSHTMLFile'] := HtmlFile.Filename;
  AProject.CustomData['PasJSWebBrowserProject'] := '1';
  HtmlFile.CustomData['PasJSIsProjectHTMLFile'] := '1';
  HtmlFile.CustomData.Values['MaintainHTML'] := '1';
  AProject.AddFile(HtmlFile, True);

  AProject.AddPackageDependency('pas2js_rtl');
  AProject.AddPackageDependency('WCL');
  AProject.Flags := AProject.Flags - [pfRunnable];
  AProject.LoadDefaultIcon;
  AProject.MainFileID := 0;

  AProject.LazCompilerOptions.TargetFilename := 'project1';
  CompOpts := AProject.LazCompilerOptions;
  CompOpts.TargetOS := 'Browser';
  CompOpts.GenerateDebugInfo := False;
  CompOpts.CompilerPath := '$(pas2js)';
  CompOpts.UnitOutputDirectory := 'lib';
  CompOpts.CustomOptions := '-Jeutf-8 -Jirtl.js -Jc- -Jm- -JRjs';
end;

function TPas2JSModuleProject.CreateStartFiles(AProject: TLazProject): TModalResult;
begin
  LazarusIDE.DoOpenEditorFile('project1.html', -1, -1, [ofProjectLoading,ofRegularFile]);
  Result := mrOk;
end;

{ TPas2JSWForm }

constructor TPas2JSWForm.Create;
begin
  inherited Create;
  Name := 'WForm';
  ResourceClass := TWForm;
  UseCreateFormStatements := True;
end;

function TPas2JSWForm.GetInterfaceUsesSection: string;
begin
  Result := 'JS, Classes, SysUtils, Graphics, Controls, Forms, Dialogs, WebCtrls';
end;

function TPas2JSWForm.GetInterfaceSource(const Filename, SourceName, ResourceName: string): string;
const
  LE = LineEnding;
begin
  Result :=
    'type' + LE +
    '  T' + ResourceName + ' = class(' + ResourceClass.ClassName + ')' + LE +
    '  private' + LE + LE +
    '  public' + LE + LE +
    '  end;' + LE + LE;

  if (DeclareClassVariable) then
  begin
    Result := Result +
      'var' + LE +
      '  ' + ResourceName + ': T' + ResourceName + ';' + LE + LE;
  end;
end;

function TPas2JSWForm.GetLocalizedName: string;
begin
  Result := 'Web Form (Pas2JS)';
end;

function TPas2JSWForm.GetLocalizedDescription: string;
begin
  Result := 'Create a Pas2JS Web Form';
end;

{ TPas2JSWFrame }

constructor TPas2JSWFrame.Create;
begin
  inherited Create;
  Name := 'WFrame';
  ResourceClass := TWFrame;
  UseCreateFormStatements := False;
end;

function TPas2JSWFrame.GetInterfaceUsesSection: string;
begin
  Result := 'JS, Classes, SysUtils, Graphics, Controls, Forms, Dialogs, WebCtrls';
end;
                       
function TPas2JSWFrame.GetInterfaceSource(const Filename, SourceName, ResourceName: string): string;
const
  LE = LineEnding;
begin
  Result :=
    'type' + LE +
    '  T' + ResourceName + ' = class(' + ResourceClass.ClassName + ')' + LE +
    '  private' + LE + LE +
    '  public' + LE + LE +
    '  end;' + LE + LE;
end;

function TPas2JSWFrame.GetLocalizedName: string;
begin
  Result := 'Web Frame (Pas2JS)';
end;

function TPas2JSWFrame.GetLocalizedDescription: string;
begin
  Result := 'Create a Pas2JS Web Fram';
end;

{ TPas2JSWDataModule }

constructor TPas2JSWDataModule.Create;
begin
  inherited Create;
  Name := 'WDataModule';
  ResourceClass := TWDataModule;
  UseCreateFormStatements := True;
end;

function TPas2JSWDataModule.GetInterfaceUsesSection: string;
begin
  Result := 'JS, Classes, SysUtils, Graphics, Controls, Forms, Dialogs, WebCtrls';
end;

function TPas2JSWDataModule.GetInterfaceSource(const Filename, SourceName, ResourceName: string): string;
const
  LE = LineEnding;
begin
  Result :=
    'type' + LE +
    '  T' + ResourceName + ' = class(' + ResourceClass.ClassName + ')' + LE +
    '  private' + LE + LE +
    '  public' + LE + LE +
    '  end;' + LE + LE;

  if (DeclareClassVariable) then
  begin
    Result := Result +
      'var' + LE +
      '  ' + ResourceName + ': T' + ResourceName + ';' + LE + LE;
  end;
end;

function TPas2JSWDataModule.GetLocalizedName: string;
begin
  Result := 'Web Data Module (Pas2JS)';
end;

function TPas2JSWDataModule.GetLocalizedDescription: string;
begin
  Result := 'Create a Pas2JS Web Data Module';
end;

{$IF declared(TComponentRequirements)}

type
  TPas2JSWidgetsRequirements = class(TComponentRequirements)
  public
    procedure RequiredUnits(aUnits: TStrings); override;
    procedure RequiredPkgs(aPkgs: TStrings); override;
  end;

{ TPas2JSWidgetsRequirements }

procedure TPas2JSWidgetsRequirements.RequiredUnits(aUnits: TStrings);
begin
  if ComponentClass.ClassType = TWStringGrid then begin
    aUnits.Clear;
    aUnits.Add('Grids');
  end;
  if (ComponentClass.ClassType = TWWebDBConnection) or
     (ComponentClass.ClassType = TWWebDBTable) then begin
    aUnits.Add('WebCtrls');
    aUnits.Add('WebDB');
  end;
end;

procedure TPas2JSWidgetsRequirements.RequiredPkgs(aPkgs: TStrings);
begin
  aPkgs.Clear;
  aPkgs.Add('WCL');
end;

{$ENDIF}

procedure Register;
begin
  VPas2JSWForm := TPas2JSWForm.Create;           
  VPas2JSWFrame := TPas2JSWFrame.Create;
  VPas2JSWDataModule := TPas2JSWDataModule.Create;

  RegisterProjectFileDescriptor(VPas2JSWForm);
  RegisterProjectFileDescriptor(VPas2JSWFrame);
  RegisterProjectFileDescriptor(VPas2JSWDataModule);

{$if declared(TPas2JSWidgetsRequirements)}
  /// Every component registered in the WCL palette. When one is dropped on a
  /// form, the IDE adds the WCL package (and the extra units it needs).
  RegisterComponentRequirements([TWComboBox, TWListBox, TWOpenDialog,
    TWSaveDialog, TWColorDialog, TWFontDialog, TWScrollBar, TWSpinEdit,
    TWUpDown, TWEdit, TWMemo, TWButton,
    TWCheckbox, TWRadioButton, TWLabel, TWImage, TWPanel, TWTimer, TWPageControl,
    TWTreeView, TWListView,
    TWFloatEdit, TWIntegerEdit, TWDateEditBox, TWTimeEditBox, TWDateTimePicker,
    TWFileButton, TWDataGrid, TWPagination, TWStringGrid, TWWebSocketClient,
    TWGroupBox, TWScrollBox, TWProgressBar, TWTrackBar, TWColorPicker, TWSplitter,
    TWMainMenu, TWPopupMenu,
    TWAction, TWActionList,
    TWShape, TWPaintBox,
    TWWebDBConnection, TWWebDBTable], TPas2JSWidgetsRequirements);
{$endif}

  FormEditingHook.RegisterDesignerBaseClass(TWForm);
  FormEditingHook.RegisterDesignerBaseClass(TWFrame);
  FormEditingHook.RegisterDesignerBaseClass(TWDataModule);
  //FormEditingHook.StandardDesignerBaseClasses[3{DesignerBaseClassId_TForm}] := TWForm;
  //FormEditingHook.StandardDesignerBaseClasses[DesignerBaseClassId_TFrame] := TWFrame;
  //FormEditingHook.StandardDesignerBaseClasses[DesignerBaseClassId_TDataModule] := TWDataModule;

  VPas2JSProject := TPas2JSProject.Create;
  RegisterProjectDescriptor(VPas2JSProject);

  VPas2JSModuleProject := TPas2JSModuleProject.Create;
  RegisterProjectDescriptor(VPas2JSModuleProject);
end;

end.
