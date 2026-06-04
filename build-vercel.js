const { execSync } = require('child_process');
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
  console.log('Installing frontend dependencies...');
  execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

  console.log('Building frontend...');
  execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

  console.log('Promoting frontend Vercel output to root...');
  const rootOutputDir = path.join(__dirname, '.vercel', 'output');
  const frontendOutputDir = path.join(__dirname, 'frontend', '.vercel', 'output');
  
  if (fs.existsSync(rootOutputDir)) {
    fs.rmSync(rootOutputDir, { recursive: true, force: true });
  }
  
  if (fs.existsSync(frontendOutputDir)) {
    copyDir(frontendOutputDir, rootOutputDir);
    console.log('Root Vercel Build Output structured successfully!');
  } else {
    throw new Error('Frontend Vercel build output not found!');
  }
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
