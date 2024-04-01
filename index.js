const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Destination folder for storing uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // Unique filename for each image
  }
});

const upload = multer({ storage: storage });

// Define route for image upload
app.post('/upload', upload.array('images', 10), (req, res) => {
  // 'images' is the name of the field in your form that contains the images
  // 5 is the maximum number of files that can be uploaded
  
  // Check if files were uploaded
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // Construct an array of image URLs
  const imageUrls = req.files.map(file => {
    const imagePath = path.join('uploads', file.filename); // Use path.join to handle file path construction
    // Replacing backslashes with forward slashes and considering the provided folder path
    return `${req.protocol}://${req.get('host')}/${imagePath.replace(/\\/g, '/')}`;
  });

  // Respond with the array of image URLs
  res.status(200).json({ imageUrls: imageUrls });
});

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
