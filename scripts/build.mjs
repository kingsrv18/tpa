import fs from 'node:fs/promises';
await fs.mkdir('dist',{recursive:true});
await fs.cp('src','dist',{recursive:true});
console.log('Static build ready in dist/');
