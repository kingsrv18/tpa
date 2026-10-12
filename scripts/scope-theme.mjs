import fs from 'node:fs/promises';
import postcss from 'postcss';
let result='';
for(const file of ['assets/eae8f268b874f452.css','assets/6518041c3900bcc5.css','assets/57f3fc861f708226.css','behaviors.css','tpa.css']){
  const ast=postcss.parse(await fs.readFile('theme/'+file,'utf8'));
  // Keep utility precedence inside the isolated theme; the platform's global
  // CSS is intentionally unlayered and must not override these colors/layouts.
  ast.walkAtRules('layer',at=>{if(at.nodes)at.replaceWith(at.nodes);else at.remove();});
  ast.walkRules(rule=>{
    let parent=rule.parent;while(parent){if(parent.type==='atrule'&&/keyframes/.test(parent.name))return;parent=parent.parent;}
    rule.selectors=rule.selectors.map(selector=>{
      if(/\b(?:html|body)\b/.test(selector))return selector.replace(/\b(?:html|body)\b/g,'.layernote-theme');
      if(selector.includes(':root')||selector.includes(':host'))return selector.replace(/:root|:host/g,'.layernote-theme');
      return ':where(.layernote-theme) '+selector;
    });
  });
  result+=ast.toString().replaceAll('/assets/','/theme/assets/')+'\n';
}
result+='\n.layernote-theme{--ink:#05131a;--muted:#667078;--navy:#05131a;--paper:#fff;--font-inter:Inter,Arial,sans-serif;font-family:Inter,Arial,sans-serif;font-size:16px;line-height:1.5;color:#05131a;background:white;isolation:isolate;min-height:100vh}.layernote-theme>nav{position:sticky;top:0}.layernote-theme .tpa-inquiry-slot{font-family:Inter,Arial,sans-serif}.layernote-theme .inquiry-intake{color:#05131a;line-height:1.65}.layernote-theme h1{color:#05131a}.layernote-theme nav a{font-size:14px}.layernote-theme nav a:last-of-type{white-space:nowrap}';
await fs.writeFile('public/theme/scoped.css',result);
console.log('Scoped the LayerNote layout to the public landing page.');
