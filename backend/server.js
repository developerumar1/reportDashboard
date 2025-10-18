const express = require('express');
const cors = require('cors');
const path = require('path');

const fileRoutes = require('./routes/fileRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const DATA_ROOT = path.join(__dirname, 'data');
const TESTLOGS_DIR = path.join(DATA_ROOT, 'testlogs');

app.use(cors());
app.use(express.json());

app.use('/api', fileRoutes);

app.listen(PORT, () => {
  console.log(`Backend listening on ${PORT}`);
  console.log(`Test logs root: ${TESTLOGS_DIR}`);
});
