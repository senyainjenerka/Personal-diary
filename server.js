require('dotenv').config();

const express = require('express');
const entriesRouter = require('./routes/entries.routes');
const tagsRouter = require('./routes/tags.routes');
const { sequelize } = require('./models');
const { ValidationError } = require('sequelize');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Diary API is running' });
});

app.use('/entries', entriesRouter);
app.use('/tags', tagsRouter);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' }); 
});

app.use((err, req, res, next) => {
  
  if (err instanceof SyntaxError && err.status === 400 && err.body) {
    return res.status(400).json({ error: 'Request body contains invalid JSON' });
  }

  if (err instanceof ValidationError) {
    return res.status(400).json({ error: err.errors[0]?.message || err.message });
  }

  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
});

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    app.listen(port, () => {
      console.log(`Diary API server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
