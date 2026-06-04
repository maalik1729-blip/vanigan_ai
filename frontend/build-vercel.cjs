const fs = require('fs');
const path = require('path');

// Helper to copy directory recursively
function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log('Structuring Vercel Build Output inside frontend...');
  const outputDir = path.join(__dirname, '.vercel', 'output');
  
  // Clean previous output
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
  }
  fs.mkdirSync(outputDir, { recursive: true });

  // Copy static files
  const clientDir = path.join(__dirname, 'dist', 'client');
  const staticDir = path.join(outputDir, 'static');
  if (fs.existsSync(clientDir)) {
    copyDir(clientDir, staticDir);
    console.log('Copied static files.');
  }

  // Copy functions
  const serverDir = path.join(__dirname, 'dist', 'server');
  const functionDir = path.join(outputDir, 'functions', '__server.func');
  if (fs.existsSync(serverDir)) {
    copyDir(serverDir, functionDir);
    console.log('Copied server function.');
  }

  // Copy config
  const configFile = path.join(__dirname, 'dist', 'config.json');
  if (fs.existsSync(configFile)) {
    fs.copyFileSync(configFile, path.join(outputDir, 'config.json'));
    console.log('Copied config.json.');
  }

  console.log('Vercel Build Output structured inside frontend successfully!');
} catch (error) {
  console.error('Build structuring failed:', error);
  process.exit(1);
}
