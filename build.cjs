const fs = require('node:fs');
const esbuild = require('esbuild');
(async () => {
  const result = await esbuild.build({entryPoints:['src/main.mjs'],bundle:true,write:false,format:'iife',minify:true,target:['es2020'],legalComments:'inline'});
  const javascript = result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
  const template = fs.readFileSync('src/template.html','utf8');
  fs.writeFileSync('index.html',template.replace('<script src="galaxy.js"></script>',()=>'<script>'+javascript+'</script>'));
})();
