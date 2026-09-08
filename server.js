const express = require('express');
const entriesRouter = require('./routes/entries.routes');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Diary API is running' });
});

app.use('/entries', entriesRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' }); 
});

app.use((err, req, res, next) => {
  
  if (err instanceof SyntaxError && err.status === 400 && err.body) {
    return res.status(400).json({ error: 'Request body contains invalid JSON' });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Diary API server is running on port ${port}`);
});

module.exports = app;
