const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');

// 1. Ensure .nojekyll exists so GitHub Pages serves assets with underscores like _next
const noJekyllPath = path.join(outDir, '.nojekyll');
fs.writeFileSync(noJekyllPath, '', 'utf8');
console.log('[prepare-export] Created out/.nojekyll');

// 2. Enhance 404.html with zero-latency SPA redirect for direct links
const notFoundPath = path.join(outDir, '404.html');
if (fs.existsSync(notFoundPath)) {
  let content = fs.readFileSync(notFoundPath, 'utf8');
  
  const redirectScript = `<script>
(function() {
  try {
    var p = window.location.pathname;
    var search = window.location.search || '';
    var hash = window.location.hash || '';
    var match = p.match(/\\/trips\\/(trip-[^\\/\\?#]+)/);
    var prefix = p.indexOf('/TRIPMATE.AI') !== -1 ? '/TRIPMATE.AI' : '';
    if (match) {
      window.location.replace(prefix + '/trips?id=' + encodeURIComponent(match[1]) + (search ? '&' + search.slice(1) : '') + hash);
      return;
    }
  } catch(e) {}
})();
</script>`;

  if (!content.includes('trip-[^\\/\\?#]+')) {
    // Inject right after <head> or at beginning
    if (content.includes('<head>')) {
      content = content.replace('<head>', '<head>' + redirectScript);
    } else {
      content = redirectScript + content;
    }
    fs.writeFileSync(notFoundPath, content, 'utf8');
    console.log('[prepare-export] Injected instant SPA client redirect into out/404.html');
  }
}
console.log('[prepare-export] Export preparation completed successfully.');
