#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import readline from 'node:readline';

const ROOT = process.cwd();
const FLOWS_DIR = path.join(ROOT, 'test', 'flows');
const ENV_FILE = path.join(ROOT, 'test', '.env');

const DEVICE = process.env.MAESTRO_DEVICE || 'a5da5d01';
const APP_ID = 'com.jyrwajr.csspmobile.dev';

function loadEnv(file) {
  if (!fs.existsSync(file)) {
    console.error(`Missing env file: ${file}`);
    process.exit(1);
  }

  const env = {};

  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
    if (!match) continue;

    let [, key, value] = match;

    // Remove inline comments only when preceded by whitespace.
    value = value.replace(/\s+#.*$/, '').trim();

    // Remove surrounding quotes.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

function findFlows(dir) {
  const result = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      result.push(...findFlows(fullPath));
    } else if (entry.isFile() && /\.(ya?ml)$/i.test(entry.name)) {
      result.push(fullPath);
    }
  }

  return result.sort();
}

function selectFlow(flows) {
  return new Promise((resolve) => {
    let selected = 0;

    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    const render = () => {
      process.stdout.write('\x1b[2J\x1b[H');

      console.log('Select Maestro flow:\n');

      flows.forEach((flow, index) => {
        const relative = path.relative(ROOT, flow);
        const prefix = index === selected ? '❯' : ' ';
        console.log(`${prefix} ${relative}`);
      });

      console.log('\n↑/↓ select  Enter run  q quit');
    };

    const cleanup = () => {
      process.stdin.setRawMode(false);
      process.stdin.removeAllListeners('keypress');
    };

    render();

    process.stdin.on('keypress', (_, key) => {
      if (key.name === 'up') {
        selected = (selected - 1 + flows.length) % flows.length;
        render();
      } else if (key.name === 'down') {
        selected = (selected + 1) % flows.length;
        render();
      } else if (key.name === 'return') {
        cleanup();
        resolve(flows[selected]);
      } else if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
        cleanup();
        process.exit(0);
      }
    });
  });
}

const env = loadEnv(ENV_FILE);

const flows = findFlows(FLOWS_DIR);

if (flows.length === 0) {
  console.error(`No Maestro flows found in ${FLOWS_DIR}`);
  process.exit(1);
}

const flow = await selectFlow(flows);

const requiredEnv = ['PPO_NO', 'PASSWORD'];

for (const key of requiredEnv) {
  if (!env[key]) {
    console.error(`Missing ${key} in ${ENV_FILE}`);
    process.exit(1);
  }
}

const args = [
  '--device',
  DEVICE,
  'test',

  '-e',
  `APP_ID=${APP_ID}`,

  '-e',
  `PPO_NO=${env.PPO_NO}`,

  '-e',
  `PASSWORD=${env.PASSWORD}`,
];

// Optional variables.
const optionalEnv = [
  'REG_PPO_NO',
  'REG_ORGANIZATION',
  'REG_DOB',
  'REG_BANK',
  'REG_PASSWORD',
  'NEW_PASSWORD',
  'CLEAR_STATE',
];

for (const key of optionalEnv) {
  if (env[key]) {
    args.push('-e', `${key}=${env[key]}`);
  }
}

args.push(flow);

console.log('\nRunning:');
console.log(`maestro ${args.map((arg) => (arg.includes(' ') ? `"${arg}"` : arg)).join(' ')}\n`);

const result = spawnSync('maestro', args, {
  stdio: 'inherit',
  cwd: ROOT,
  env: {
    ...process.env,
    ...env,
  },
});

process.exit(result.status ?? 1);
