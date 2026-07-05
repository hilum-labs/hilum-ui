import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const releasePackages = [
  { name: '@hilum/ui', dir: 'packages/ui' },
  { name: '@hilum/app-shell', dir: 'packages/app-shell' },
  { name: '@hilum/designer', dir: 'packages/designer' },
  { name: '@hilum/designer-canvas', dir: 'packages/designer-canvas' },
  { name: '@hilum/blocks', dir: 'packages/blocks' },
];

const releaseDir = '.aws-release';
const packageJsonFile = 'package.json';
const changelogFile = 'CHANGELOG.md';

function nextPatchVersion(version) {
  const parts = version.split('.').map((part) => Number.parseInt(part, 10));
  if (parts.length !== 3 || parts.some((part) => !Number.isInteger(part) || part < 0)) {
    throw new Error(`Expected semver x.y.z version, received "${version}"`);
  }
  parts[2] += 1;
  return parts.join('.');
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function writeJson(filePath, value) {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function buildChangelogEntry(version, sourceSha) {
  const sourceText = sourceSha ? ` from ${sourceSha.slice(0, 7)}` : '';
  return [
    `## ${version}`,
    '',
    '### Patch Changes',
    '',
    `- Automated AWS CodeCommit patch release${sourceText}.`,
    '',
  ].join('\n');
}

function insertChangelogEntry(changelog, version, sourceSha) {
  if (changelog.includes(`## ${version}\n`)) {
    return changelog;
  }

  const titleEnd = changelog.indexOf('\n\n');
  if (titleEnd === -1) {
    return `${changelog.trim()}\n\n${buildChangelogEntry(version, sourceSha)}`;
  }

  return [
    changelog.slice(0, titleEnd + 2),
    buildChangelogEntry(version, sourceSha),
    changelog.slice(titleEnd + 2),
  ].join('');
}

const sourceSha = process.env.CODEBUILD_RESOLVED_SOURCE_VERSION || process.env.GIT_COMMIT || '';
const baseline = await readJson(path.join(releasePackages[0].dir, packageJsonFile));
const currentVersion = baseline.version;
const nextVersion = nextPatchVersion(currentVersion);

for (const releasePackage of releasePackages) {
  const packageJsonPath = path.join(releasePackage.dir, packageJsonFile);
  const changelogPath = path.join(releasePackage.dir, changelogFile);
  const packageJson = await readJson(packageJsonPath);

  packageJson.version = nextVersion;
  await writeJson(packageJsonPath, packageJson);

  const changelog = await readFile(changelogPath, 'utf8');
  await writeFile(changelogPath, insertChangelogEntry(changelog, nextVersion, sourceSha));
}

await mkdir(releaseDir, { recursive: true });
await writeFile(path.join(releaseDir, 'version'), `${nextVersion}\n`);

console.log(`Prepared Hilum UI ${currentVersion} -> ${nextVersion}`);
