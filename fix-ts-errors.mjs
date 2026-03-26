import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.join(__dirname, 'src');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) {
         arrayOfFiles.push(path.join(dirPath, file));
      }
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(srcDir);
const types = ['LeadOrder', 'Role', 'OrderStatus', 'User', 'AuthSession', 'ReferralCode', 'Product', 'PickupPoint', 'ReactNode'];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Remove unused React import
  content = content.replace(/^import\s+React\s+from\s+['"]react['"];?[\r\n]*/gm, '');
  content = content.replace(/^import\s+React,\s*\{/gm, 'import {');

  // 2. Add 'type' modifier to specific type imports inside import statements
  for (const t of types) {
    const regex = new RegExp(`(import\\s+\\{[^}]*?)(?<!type\\s+)\\b${t}\\b([^}]*?\\}\\s+from)`, 'g');
    let prev;
    while (content !== prev) {
      prev = content;
      content = content.replace(regex, `$1type ${t}$2`);
    }
  }
  
  // 3. Unused local variables mentioned as errors
  if (file.endsWith('AdminDashboardPage.tsx')) {
     content = content.replace(/,\s*Tag\b/g, '');
     content = content.replace(/const\s+referrals\s*=\s*\[[\s\S]*?\];?/g, '');
  }

  if (content !== original) {
    console.log(`Fixed ${file}`);
    fs.writeFileSync(file, content);
  }
}
console.log('Done');
