import { exec } from 'child_process';
import os from 'os';
import fs from 'fs';
import path from 'path';

export function previewHTML(htmlContent: string, mode: 'browser' | 'console' = 'browser') {
  if (mode === 'browser') {
    previewInBrowser(htmlContent);
  } else {
    console.log(htmlContent);
  }
}

function previewInBrowser(htmlContent: string) {
  const tempDir = os.tmpdir();
  const tempFilePath = path.join(tempDir, 'temp.html');
  fs.writeFileSync(tempFilePath, htmlContent, 'utf-8');
  let command: string;
  switch (os.platform()) {
    case 'win32':
      command = `start ${tempFilePath}`;
      break;
    case 'darwin':
      command = `open ${tempFilePath}`;
      break;
    case 'linux':
      command = `xdg-open ${tempFilePath}`;
      break;
    default:
      console.error('Unsupported platfrom');
      return;
  }
  exec(command, (err) => {
    if (err) {
      console.log(`Error: ${err.message}`);
      return;
    }
  });
}
