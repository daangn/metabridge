import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve, sep } from 'node:path';

// Changesets 3 selects Yarn for Yarn projects, but Yarn cannot publish tarballs.
// Use npm for the already-built artifacts so trusted publishing handles auth.
const packDir = resolve(process.argv[2]);
const dryRun = process.argv.includes('--dry-run');
const manifest = JSON.parse(readFileSync(resolve(packDir, 'publish-plan.json')));
if (manifest.version !== 1 || !Array.isArray(manifest.plan)) {
  throw new Error('Unsupported Changesets publish plan');
}
const registry = 'https://registry.npmjs.org';
const run = (command, args) => execFileSync(command, args, { encoding: 'utf8' });

for (const release of manifest.plan.flat()) {
  if (release.kind !== 'publish') throw new Error(`Unsupported release: ${release.kind}`);
  const tarball = resolve(packDir, release.tarball.path);
  if (!tarball.startsWith(packDir + sep)) throw new Error('Invalid tarball path');
  const integrity = 'sha256-' + createHash('sha256').update(readFileSync(tarball)).digest('base64');
  if (integrity !== release.tarball.integrity) throw new Error(`Integrity mismatch: ${release.name}`);
  const tag = `${release.name}@${release.version}`;
  let published = false;
  try {
    published = JSON.parse(run('npm', ['view', tag, 'version', '--json', '--registry', registry])) === release.version;
  } catch (error) {
    let response;
    try { response = JSON.parse(error.stdout); } catch { throw error; }
    if (response.error?.code !== 'E404') throw error;
  }
  if (!published) {
    const args = ['publish', tarball, '--access', release.access, '--tag', release.tag,
      '--registry', registry, '--ignore-scripts'];
    if (dryRun) args.push('--dry-run');
    execFileSync('npm', args, { stdio: 'inherit' });
  } else {
    console.log(`Already published: ${tag}`);
  }
  if (dryRun) continue;
  // npm publish can succeed before the registry exposes the version.
  // Its exit status is authoritative; consumers may need to wait for propagation.
  if (!process.env.GITHUB_REPOSITORY || !process.env.GITHUB_SHA) throw new Error('GitHub release context required');
  try {
    run('gh', ['release', 'view', tag, '--repo', process.env.GITHUB_REPOSITORY]);
  } catch {
    execFileSync('gh', ['release', 'create', tag, '--repo', process.env.GITHUB_REPOSITORY,
      '--target', process.env.GITHUB_SHA, '--title', tag, '--generate-notes'], { stdio: 'inherit' });
  }
}
