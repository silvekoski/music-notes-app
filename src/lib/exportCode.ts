import JSZip from 'jszip';
import selfSource from './exportCode.ts?raw';

export async function downloadProjectCode(): Promise<void> {
  const files = import.meta.glob<string>(
    [
      '../../package.json',
      '../../package-lock.json',
      '../../bun.lockb',
      '../../index.html',
      '../../README.md',
      '../../.gitignore',
      '../../vite.config.ts',
      '../../tsconfig.json',
      '../../tsconfig.app.json',
      '../../tsconfig.node.json',
      '../../eslint.config.js',
      '../../postcss.config.js',
      '../../tailwind.config.ts',
      '../../components.json',
      '../../supabase/config.toml',
      '../../public/**/*',
      '../../src/**/*',
    ],
    { query: '?raw', import: 'default', eager: true }
  );

  const zip = new JSZip();
  const seen = new Set<string>();

  const addFile = (cleanPath: string, content: string) => {
    if (seen.has(cleanPath)) return;
    seen.add(cleanPath);
    zip.file(cleanPath, content);
  };

  for (const [path, content] of Object.entries(files)) {
    let cleanPath = path;
    if (cleanPath.startsWith('../../')) {
      cleanPath = cleanPath.slice('../../'.length);
    } else if (cleanPath.startsWith('../')) {
      cleanPath = 'src/' + cleanPath.slice('../'.length);
    } else if (cleanPath.startsWith('./')) {
      cleanPath = 'src/lib/' + cleanPath.slice('./'.length);
    }
    addFile(cleanPath, content);
  }

  // Ensure the current file is included; import.meta.glob may skip it.
  addFile('src/lib/exportCode.ts', selfSource);

  zip.file(
    'README-export.md',
    `# Music Notes - Exported Project Code\n\nThis archive contains the project source code exported from the Lovable editor.\n\n## Getting started\n\n1. Extract the ZIP.\n2. Run \`npm install\` (or \`bun install\`).\n3. Create a \`.env\` file with your Supabase project details if needed.\n4. Run \`npm run dev\` to start the local development server.\n`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'music-notes-project.zip';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
