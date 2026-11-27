/**
 * research-reuse.mjs — Ported from https://github.com/dr-week/fast-framework
 * Scans local/reference codebases and catalogs GitHub reference architectures
 * for Minimal Google Drive Sync, Gemini Task Breakdown, and Zuari 5-Plane UI.
 */
import { readdir, readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const GITHUB_REFERENCE_PROJECTS = [
  {
    repo: 'dr-week/fast-framework',
    url: 'https://github.com/dr-week/fast-framework',
    adoptedPatterns: [
      'Zuari 5-Plane Feature Division Matrix (Surface, Dock, Drawer, Command, Ambient)',
      'Contrasting Boxiness 1px border & OKLCH lightness stops',
      '@zuari/ai reactive workflow & token stream pattern',
      '@zuari/sync OPFS & compact delta storage adapter',
    ],
  },
  {
    repo: 'Ywtoo/ToDoFeito',
    url: 'https://github.com/Ywtoo/ToDoFeito',
    adoptedPatterns: ['Deterministic offline-first task sync with Google Drive appDataFolder'],
  },
  {
    repo: 'imxade/kitsy',
    url: 'https://github.com/imxade/kitsy',
    adoptedPatterns: ['Client-side local-first PWA todo workflow with optional Google Drive sync'],
  },
  {
    repo: 'publius-github/hypomnema',
    url: 'https://github.com/publius-github/hypomnema',
    adoptedPatterns: ['Zero-server sovereign tasks/notes synced through personal Google Drive'],
  },
]

const EXCLUDED_DIRS = new Set(['.git', 'node_modules', 'dist', 'android', 'coverage', '__pycache__'])
const EXTENSIONS = new Set(['.ts', '.vue', '.mjs', '.py', '.scss', '.css'])

export async function researchReuse({ roots = ['.'], query = 'gemini drive fit plane' } = {}) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const results = []

  for (const r of roots) {
    const absRoot = path.resolve(r)
    await walkDir(absRoot, absRoot, terms, results)
  }
  return results.sort((a, b) => b.score - a.score).slice(0, 20)
}

async function walkDir(dir, root, terms, results) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) await walkDir(full, root, terms, results)
      continue
    }
    const ext = path.extname(entry.name)
    if (!EXTENSIONS.has(ext)) continue
    const fstat = await stat(full)
    if (fstat.size > 500_000) continue
    const text = (await readFile(full, 'utf8')).toLowerCase()
    const rel = path.relative(root, full)
    let score = 0
    for (const t of terms) {
      if (rel.toLowerCase().includes(t)) score += 4
      if (text.includes(t)) score += 2
    }
    if (score > 0) {
      results.push({ path: rel, lines: text.split('\n').length, score })
    }
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const queryArgIdx = process.argv.indexOf('--query')
  const query = queryArgIdx !== -1 ? process.argv[queryArgIdx + 1] : 'gemini drive fit plane'
  console.log('=== Mindset Machine — Fast-Framework & GitHub Reference Reuse Scanner ===')
  for (const ref of GITHUB_REFERENCE_PROJECTS) {
    console.log(`* ${ref.repo} (${ref.url})`)
    for (const p of ref.adoptedPatterns) console.log(`    - ${p}`)
  }
  console.log('\n=== Local High-Score Reusable Modules ===')
  const matches = await researchReuse({ roots: ['src'], query })
  for (const m of matches) {
    console.log(`  [${String(m.score).padStart(2)} pts] ${String(m.lines).padStart(3)} lines  src/${m.path}`)
  }
}
