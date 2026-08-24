// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Block Metro from crawling native C++ build caches and Android/iOS build artifacts
config.resolver.blockList = [
  /android\/app\/\.cxx\/.*/,
  /android\/app\/build\/.*/,
  /android\/\.gradle\/.*/,
  /ios\/build\/.*/,
  /ios\/Pods\/.*/,
  /\.expo\/.*/,
  /\.cache\/.*/,
  /node_modules\/.*\/android\/\.cxx\/.*/,
];

// Fix EMFILE (too many open files) on Windows
// Limit max workers to reduce concurrent file handles
config.maxWorkers = process.platform === 'win32' ? 2 : 4;

// Configure the file watcher to be more efficient on Windows
config.watchFolders = [__dirname];

// Use a more efficient watcher configuration
config.watcher = {
  // Use polling instead of native watchers on Windows to avoid EMFILE
  // This is slower but more reliable
  useWatchman: process.platform !== 'win32',
  // If watchman is used, limit its file descriptors
  ...(process.platform !== 'win32' && {
    watchman: {
      // Reduce the number of file descriptors watchman uses
      enableSymlinks: false,
    },
  }),
};

// Increase the file descriptor limit for the Metro process (Node.js)
// Note: On Windows, this requires running with increased limits
// You can also set this via: node --max-old-space-size=4096 node_modules/.bin/expo start

module.exports = withNativeWind(config, { input: './src/shared/styles/index.css' });