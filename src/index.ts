import { watch } from 'chokidar';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { spawn } from 'child_process';
import path from 'path';
import ora from 'ora';
import simpleGit from 'simple-git';
import parseDiff from 'parse-diff';

import { generateTestForFile } from './lib/generate_test';

const git = simpleGit();
const watchedDir = 'src';

console.log(`👀 Watching for file changes in ${watchedDir}...`);
const watcher = watch(`${watchedDir}/**/*.ts`, { ignoreInitial: true, ignored: ['__tests__/**', 'node_modules/**', 'dist/**', 'src/lib/generate_test.ts', 'src/index.ts'] })



watcher.on('change', async (filePath) => {
  console.log(`📄 File changed: ${filePath}`);

  const spinner = ora('🧠 Generating unit test with AI...').start();

  const sourceCode = readFileSync(filePath, 'utf-8');

  const diffText = await git.diff([filePath]);
  const parsed = parseDiff(diffText);
  const file = parsed.find(f => f.to === filePath || f.to?.endsWith('/' + filePath));

  if (!file || !file.chunks.length) {
    spinner.info('⚠️ No relevant changes found in diff. Skipping.');
    return;
  }

  const changedLines = file.chunks.flatMap(chunk =>
    chunk.changes
      .filter(line => line.type === 'add')
      .map(line => line.content)
  ).join('\n').trim();

  if (!changedLines) {
    spinner.info('⚠️ No added lines found. Skipping.');
    return;
  }

  try {
    const testCode = await generateTestForFile(sourceCode, filePath);
    spinner.text = '📦 Comparing with existing test file...';

    const fileName = path.basename(filePath, '.ts');
    const testFilePath = `__tests__/${fileName}.test.ts`;

    let shouldWrite = true;
    if (existsSync(testFilePath)) {
      const existing = readFileSync(testFilePath, 'utf-8');
      if (existing.trim() === testCode.trim()) {
        shouldWrite = false;
        spinner.info('⚠️ No changes in test. Skipping update and test run.');
      }
    }

    if (shouldWrite) {
      writeFileSync(testFilePath, testCode);
      spinner.succeed('✅ Test generated and updated!');

      console.log(`📝 Test file updated: ${testFilePath}`);

      const testProcess = spawn('npx', ['jest', testFilePath], { stdio: 'inherit' });
      testProcess.on('exit', (code) => {
        if (code === 0) console.log('🟢 All tests passed');
        else console.log('🔴 Test failed');
      });
    }
  } catch (err) {
    spinner.fail('❌ Failed to generate test');
    console.error(err);
  }
});

watcher.on('unlink', (filePath) => {
  const fileName = path.basename(filePath, '.ts');
  const testFilePath = `__tests__/${fileName}.test.ts`;
  if (existsSync(testFilePath)) {
    unlinkSync(testFilePath);
    console.log(`🗑️ Test file removed: ${testFilePath}`);
  }
});
