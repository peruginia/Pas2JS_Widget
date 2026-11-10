// Loads a pas2js module into the host application.
//
// The host bundle already registered the RTL, the WCL and the AppHost unit.
// The module manifest lists every unit of the module; this loader executes
// only the modules that are not registered yet and then runs the module
// entry unit. Finally it starts the host program.

(async function () {
  function loadScript(url) {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = url;
      script.onload = function () { resolve(); };
      script.onerror = function () { reject(new Error("Cannot load " + url)); };
      document.head.appendChild(script);
    });
  }

  async function loadManifest(url) {
    var response = await fetch(url);
    if (!response.ok) {
      throw new Error("Cannot load " + url + " (" + response.status + ")");
    }
    return response.json();
  }

  async function loadModule(url) {
    var manifest = await loadManifest(url);
    var base = url.slice(0, url.lastIndexOf("/") + 1);
    for (var i = 0; i < manifest.files.length; i++) {
      var entry = manifest.files[i];
      var name = typeof entry === "string" ? null : entry.name;
      var file = typeof entry === "string" ? entry : entry.file;
      if (name && window.pas && pas[name]) {
        continue; // already provided by the host
      }
      await loadScript(base + file);
    }
    if (manifest.entry) {
      rtl.run(manifest.entry);
    }
    return manifest;
  }

  try {
    await loadModule("../module/lib/modules.json");
    rtl.run("program");
    document.getElementById("module-status").textContent = "Host started.";
  } catch (error) {
    document.getElementById("module-status").textContent = String(error);
    console.error(error);
  }
})();
