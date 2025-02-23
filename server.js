const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/trainning_programs', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
mongoose.connection.once('open',()=>{
  console.log("connected to mongodb successfully!");
}).on('error',(err)=>{
  console.error('mongodb connection error:',err);
})

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files

// Define Schema
const formSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  termsAccepted: Boolean,
});

// Create Model
const Form = mongoose.model('Form', formSchema,'custom_collection_name');

// Handle POST Request
app.post('/submit', async (req, res) => {
  try {
    const { name, email, message, termsAccepted } = req.body;

    // Save data to MongoDB
    const formData = new Form({ name, email, message, termsAccepted });
    await formData.save();

    res.status(200).send('Form submitted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error submitting form');
  }
});

// Start Server
app.listen(4000, () => console.log('Server running on http://localhost:4000'));