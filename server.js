require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinataSDK = require('@pinata/sdk');

// Initialize Pinata with your API Key and Secret
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

const app = express();
app.use(cors());
app.use(express.json());

// Route to upload JSON data to Pinata
app.post('/uploadJson', async (req, res) => {
  const jsonData = req.body;
  try {
    const result = await pinata.pinJSONToIPFS(jsonData);
    res.status(200).json({ IpfsHash: result.IpfsHash });
  } catch (error) {
    console.error('Error uploading to Pinata:', error);
    res.status(500).json({ error: 'Failed to upload data to Pinata' });
  }
});

// Route to upload a file to Pinata (can be added with multer or other middleware)
app.post('/uploadFile', async (req, res) => {
  res.status(501).send('File upload not yet implemented');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
