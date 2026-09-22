import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

for (const scenario of ['new', 'published', 'integrity', 'auth', 'propagation']) {
  test(`packed publishing: ${scenario}`, () => {
    const dir = mkdtempSync(resolve(tmpdir(), 'publish-packed-'));
    try {
      const content = 'test artifact';
      writeFileSync(resolve(dir, 'package.tgz'), content);
      writeFileSync(resolve(dir, 'publish-plan.json'), JSON.stringify({version: 1, plan: [[{
        kind: 'publish', name: '@metabridge/example', version: '1.0.0', access: 'public', tag: 'latest',
        tarball: {path: 'package.tgz', integrity: scenario === 'integrity' ? 'invalid' : 'sha256-' + createHash('sha256').update(content).digest('base64')}
      }]]}));
      writeFileSync(resolve(dir, 'npm'), `#!/usr/bin/env node
const fs = require('fs');
fs.appendFileSync(process.env.LOG, process.argv.slice(2).join(' ') + '\\n');
if (process.argv[2] === 'view') {
  if (process.env.SCENARIO === 'published') console.log(JSON.stringify('1.0.0'));
  else { console.log(JSON.stringify({error:{code:process.env.SCENARIO === 'auth' ? 'E401' : 'E404'}})); process.exit(1); }
}
`, {mode: 0o755});
      writeFileSync(resolve(dir, 'gh'), '#!/usr/bin/env node\nprocess.exit(0);\n', {mode: 0o755});
      const log = resolve(dir, 'commands');
      writeFileSync(log, '');
      const result = spawnSync(process.execPath, ['scripts/publish-packed.mjs', dir, ...(scenario === 'propagation' ? [] : ['--dry-run'])], {
        encoding: 'utf8', env: {...process.env, PATH: dir + ':' + process.env.PATH, LOG: log, SCENARIO: scenario, GITHUB_REPOSITORY: 'test/repo', GITHUB_SHA: 'test-sha'}
      });
      const commands = readFileSync(log, 'utf8');
      assert.equal(result.status, ['integrity', 'auth'].includes(scenario) ? 1 : 0, result.stderr);
      assert.equal(commands.includes('publish '), ['new', 'propagation'].includes(scenario));
      if (scenario === 'new') assert.match(commands, /--ignore-scripts --dry-run/);
      if (scenario === 'integrity') assert.equal(commands, '');
      if (scenario === 'propagation') assert.equal(commands.split('view ').length - 1, 1);
    } finally { rmSync(dir, {recursive: true, force: true}); }
  });
}
