// Deployment configuration for the WCL Designer frontend.
//
// Leave apiBase empty when index.html and api.php are served from the same
// folder. For a static frontend on another origin, use the full URL of
// api.php:
//
//   apiBase: 'https://example.com/Editor/api.php'
//
// previewBase is optional. It must be the URL of the folder that serves
// designer/projects/; a trailing slash is added automatically. By default the
// preview is resolved next to api.php:
//
//   previewBase: 'https://example.com/Editor/'
window.WCL_CONFIG = {
  apiBase: '',
  previewBase: '',
};
