import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// Function to recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, arrayOfFiles);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Get all TS and TSX files in the src directory
const allFiles = getAllFiles('./src');

// Update imports in each file
allFiles.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace imports from auth route to lib/auth
  const oldImport = /import\s+{\s*authOptions\s*}\s+from\s+['"](\.\.\/)*@?\/app\/api\/auth\/\[\.\.\.(nextauth|auth)\]\/route['"];/g;
  const newImport = 'import { authOptions } from "@/lib/auth";';
  
  // Only update if the old import exists
  if (oldImport.test(content)) {
    content = content.replace(oldImport, newImport);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated imports in ${filePath}`);
  }
});

console.log('All imports updated successfully!'); 