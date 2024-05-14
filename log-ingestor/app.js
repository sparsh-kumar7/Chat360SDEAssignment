// app.js

const express = require('express');
const mongoose = require('mongoose');
const logRoutes = require('./routes/logRoutes');
const errorHandlingMiddleware = require('./middleware/errorHandlingMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/logs', logRoutes);
app.use(errorHandlingMiddleware);

mongoose.connect('mongodb+srv://admin:admin@cluster0.dst4ehy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
});
