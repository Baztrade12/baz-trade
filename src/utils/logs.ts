import fs from 'fs';
import path from 'path';

const logsDir = 'logs';

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

export default logsDir;
