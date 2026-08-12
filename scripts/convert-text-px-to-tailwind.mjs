import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const REPLACEMENTS = [
  // Responsive combinations (longest first)
  ['text-[36px] sm:text-[48px] md:text-[64px]', 'text-4xl sm:text-5xl md:text-6xl'],
  ['text-[34px] md:text-[56px]', 'text-3xl md:text-5xl'],
  ['text-[40px] sm:text-[56px]', 'text-4xl sm:text-5xl'],
  ['text-[40px] font-semibold leading-[1.08] tracking-[-0.03em] text-[#1D1D1F] sm:text-[56px]', 'text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-[#1D1D1F] sm:text-5xl'],
  ['text-[44px] md:text-[56px]', 'text-4xl md:text-5xl'],
  ['text-[36px] md:text-[52px]', 'text-4xl md:text-5xl'],
  ['text-[28px] md:text-[40px]', 'text-3xl md:text-4xl'],
  ['text-[28px] md:text-[36px]', 'text-3xl md:text-4xl'],
  ['text-[26px] md:text-[36px]', 'text-2xl md:text-4xl'],
  ['text-[22px] md:text-[28px]', 'text-xl md:text-3xl'],
  ['text-[20px] md:text-[28px]', 'text-xl md:text-3xl'],
  ['text-[16px] md:text-[18px]', 'text-base md:text-lg'],
  ['text-[16px] md:text-[19px]', 'text-base md:text-lg'],
  ['text-[17px] md:text-[20px]', 'text-base md:text-xl'],
  ['text-[15px] md:text-[17px]', 'text-sm md:text-lg'],
  ['text-[18px] md:text-[21px]', 'text-lg md:text-xl'],
  ['text-[14px] sm:text-[17px]', 'text-sm sm:text-lg'],
  ['text-[14px] sm:text-[15px]', 'text-sm'],
  ['text-[15px] sm:text-[16px]', 'text-sm sm:text-base'],
  ['text-[13px] sm:text-[14px]', 'text-sm'],
  ['text-[20px] sm:text-[22px]', 'text-xl sm:text-2xl'],
  ['text-[20px] md:text-[22px]', 'text-xl md:text-2xl'],
  ['text-[14px] md:text-[15px]', 'text-sm md:text-base'],
  ['text-[28px] font-semibold tracking-[-0.02em] text-[#1D1D1F] sm:text-[32px]', 'text-3xl font-semibold tracking-[-0.02em] text-[#1D1D1F] sm:text-3xl'],
  ['text-[28px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[34px]', 'text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-4xl'],
  ['text-[13px] sm:px-5 sm:py-2.5 sm:text-[14px]', 'text-sm sm:px-5 sm:py-2.5 sm:text-sm'],
  ['text-[13px] font-medium text-white transition hover:bg-[#0071e3]/90 sm:px-5 sm:py-2.5 sm:text-[14px]', 'text-sm font-medium text-white transition hover:bg-[#0071e3]/90 sm:px-5 sm:py-2.5 sm:text-sm'],
  ['text-[13px] font-medium text-[#1D1D1F] transition hover:bg-stone-50 sm:px-5 sm:py-2.5 sm:text-[14px]', 'text-sm font-medium text-[#1D1D1F] transition hover:bg-stone-50 sm:px-5 sm:py-2.5 sm:text-sm'],
  ['text-[14px] sm:text-[17px] px-3 sm:px-8', 'text-sm sm:text-lg px-3 sm:px-8'],

  // Single sizes
  ['text-[72px]', 'text-7xl'],
  ['text-[64px]', 'text-6xl'],
  ['text-[56px]', 'text-5xl'],
  ['text-[52px]', 'text-5xl'],
  ['text-[48px]', 'text-5xl'],
  ['text-[44px]', 'text-4xl'],
  ['text-[40px]', 'text-4xl'],
  ['text-[36px]', 'text-4xl'],
  ['text-[34px]', 'text-3xl'],
  ['text-[32px]', 'text-3xl'],
  ['text-[28px]', 'text-3xl'],
  ['text-[26px]', 'text-2xl'],
  ['text-[22px]', 'text-xl'],
  ['text-[21px]', 'text-xl'],
  ['text-[20px]', 'text-xl'],
  ['text-[19px]', 'text-lg'],
  ['text-[18px]', 'text-lg'],
  ['text-[17px]', 'text-lg'],
  ['text-[16px]', 'text-base'],
  ['text-[15px]', 'text-sm'],
  ['text-[14px]', 'text-sm'],
  ['text-[13px]', 'text-sm'],
  ['text-[12px]', 'text-xs'],
  ['text-[11px]', 'text-xs'],
  ['text-[10px]', 'text-xs'],
  ['text-[9px]', 'text-xs'],
];

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === '.next') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (/\.(tsx|ts|jsx|js)$/.test(entry.name) && !full.includes('convert-text-px-to-tailwind')) files.push(full);
  }
  return files;
}

let totalFiles = 0;
let totalReplacements = 0;

for (const file of walk(ROOT)) {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('text-[')) continue;

  const original = content;
  for (const [from, to] of REPLACEMENTS) {
    if (content.includes(from)) {
      const count = content.split(from).length - 1;
      content = content.split(from).join(to);
      totalReplacements += count;
    }
  }

  if (content !== original) {
    fs.writeFileSync(file, content);
    totalFiles += 1;
    console.log('updated', path.relative(ROOT, file));
  }
}

const remaining = walk(ROOT).filter((file) => /text-\[[0-9]+px\]/.test(fs.readFileSync(file, 'utf8')));
console.log(`\nUpdated ${totalFiles} files (${totalReplacements} replacements).`);
console.log(`Remaining files with text-[Npx]: ${remaining.length}`);
for (const file of remaining) {
  const matches = [...fs.readFileSync(file, 'utf8').matchAll(/text-\[[0-9]+px\]/g)].map((m) => m[0]);
  console.log(`  ${path.relative(ROOT, file)}: ${[...new Set(matches)].join(', ')}`);
}
