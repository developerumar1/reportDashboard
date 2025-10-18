const path = require('path');
const fs = require('fs');
const archiver = require('archiver');

const DATA_ROOT = path.join(__dirname, '../data');
const TESTLOGS_DIR = path.join(DATA_ROOT, 'testlogs');

function resolveSafe(p) {
const abs =  path.join(TESTLOGS_DIR, p);
  const resolved = path.resolve(abs);
  return resolved;
}

exports.listItems = (req, res) => {
  try {
    const relPath = req.query.path || '/';
    const target = resolveSafe(relPath === '/' ? '' : relPath);
    if (!fs.existsSync(target)) return res.status(404).json({ error: 'Not found' });

    const items = fs.readdirSync(target).map(name => {
      const full = path.join(target, name);
      const stat = fs.statSync(full);
      return {
        isFolder: stat.isDirectory(),
        name,
        path: path.relative(TESTLOGS_DIR, full) || '/',
        size: stat.isFile() ? stat.size : 0
      };
    });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.getFileContent = (req, res) => {
  try {
    const relPath = req.query.path;
    if (!relPath) return res.status(400).json({ error: 'path required' });

    const target = resolveSafe(relPath);
    if (!fs.existsSync(target)) return res.status(404).json({ error: 'File not found' });

    const stat = fs.statSync(target);
    if (stat.isDirectory()) return res.status(400).json({ error: 'Path is a folder' });

    const content = fs.readFileSync(target, 'utf8');
    res.type('text/plain').send(content);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

exports.downloadItem = (req, res) => {
  try {
    const relPath = req.query.path;
    if (!relPath) return res.status(400).json({ error: 'path required' });

    const target = resolveSafe(relPath);
    if (!fs.existsSync(target)) return res.status(404).json({ error: 'Not found' });

    const stat = fs.statSync(target);

    if (stat.isDirectory()) {
      const zipName = (path.basename(target) || 'archive') + '.zip';
      res.setHeader('Content-Disposition', `attachment; filename="${zipName}"`);
      res.setHeader('Content-Type', 'application/zip');

      const archive = archiver('zip', { zlib: { level: 9 } });
      archive.on('error', err => { throw err; });
      archive.pipe(res);
      archive.directory(target, false);
      archive.finalize();
    } else {
      const filename = path.basename(target);
      const shouldZip = req.query.zip === 'true';
      if (shouldZip) {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}.zip"`);
        res.setHeader('Content-Type', 'application/zip');
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.pipe(res);
        archive.file(target, { name: filename });
        archive.finalize();
      } else {
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'application/octet-stream');
        const stream = fs.createReadStream(target);
        stream.pipe(res);
      }
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

