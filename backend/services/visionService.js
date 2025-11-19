// Google Cloud Vision API service
// For OCR, barcode recognition, and image labeling

const axios = require('axios');

let visionClient = null;
let apiKey = null;
let useRestApi = false;

// Initialize Vision client (optional - only if API key is provided)
const initializeVision = () => {
  // Try to initialize with service account key file first
  if (process.env.GOOGLE_CLOUD_VISION_KEY_FILE) {
    try {
      const vision = require('@google-cloud/vision');
      visionClient = new vision.ImageAnnotatorClient({
        keyFilename: process.env.GOOGLE_CLOUD_VISION_KEY_FILE,
      });
      console.log('✅ Google Cloud Vision initialized with service account key');
      return;
    } catch (error) {
      console.warn('⚠️ Failed to initialize with service account key:', error.message);
    }
  }

  // Fallback: Try with API key (using REST API)
  if (process.env.GOOGLE_CLOUD_VISION_API_KEY) {
    apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
    useRestApi = true;
    console.log('✅ Google Cloud Vision initialized with API key (REST API)');
    return;
  }

  // If neither is configured, use dummy data
  if (!visionClient && !apiKey) {
    console.log('ℹ️  Google Cloud Vision not configured - using dummy data');
  }
};

// OCR - Extract text from receipt image
const extractTextFromImage = async (imageBuffer) => {
  // Use REST API if API key is provided
  if (useRestApi && apiKey) {
    try {
      const base64Image = imageBuffer.toString('base64');
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const annotations = response.data.responses[0]?.textAnnotations;
      if (annotations && annotations.length > 0) {
        return annotations[0].description; // Full text
      }
      return null;
    } catch (error) {
      console.error('Error in OCR (REST API):', error.response?.data || error.message);
      return null;
    }
  }

  // Use SDK if service account key is provided
  if (visionClient) {
    try {
      const [result] = await visionClient.textDetection({
        image: { content: imageBuffer },
      });
      
      const detections = result.textAnnotations;
      if (detections && detections.length > 0) {
        return detections[0].description; // Full text
      }
      return null;
    } catch (error) {
      console.error('Error in OCR:', error);
      return null;
    }
  }

  return null; // Will use dummy data
};

// Barcode detection
const detectBarcode = async (imageBuffer) => {
  // Use REST API if API key is provided
  if (useRestApi && apiKey) {
    try {
      const base64Image = imageBuffer.toString('base64');
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'BARCODE_DETECTION',
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const barcodes = response.data.responses[0]?.barcodeAnnotations;
      if (barcodes && barcodes.length > 0) {
        return barcodes[0].rawValue; // Barcode value
      }
      return null;
    } catch (error) {
      console.error('Error in barcode detection (REST API):', error.response?.data || error.message);
      return null;
    }
  }

  // Use SDK if service account key is provided
  if (visionClient) {
    try {
      const [result] = await visionClient.barcodeDetection({
        image: { content: imageBuffer },
      });
      
      const barcodes = result.barcodeAnnotations;
      if (barcodes && barcodes.length > 0) {
        return barcodes[0].rawValue; // Barcode value
      }
      return null;
    } catch (error) {
      console.error('Error in barcode detection:', error);
      return null;
    }
  }

  return null; // Will use dummy data
};

// Product label detection (for product recognition)
const detectProductLabels = async (imageBuffer) => {
  // Use REST API if API key is provided
  if (useRestApi && apiKey) {
    try {
      const base64Image = imageBuffer.toString('base64');
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        {
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'LABEL_DETECTION',
                  maxResults: 10,
                },
              ],
            },
          ],
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const labels = response.data.responses[0]?.labelAnnotations;
      if (labels && labels.length > 0) {
        return labels.map(label => ({
          description: label.description,
          score: label.score,
        }));
      }
      return null;
    } catch (error) {
      console.error('Error in label detection (REST API):', error.response?.data || error.message);
      return null;
    }
  }

  // Use SDK if service account key is provided
  if (visionClient) {
    try {
      const [result] = await visionClient.labelDetection({
        image: { content: imageBuffer },
      });
      
      const labels = result.labelAnnotations;
      if (labels && labels.length > 0) {
        return labels.map(label => ({
          description: label.description,
          score: label.score,
        }));
      }
      return null;
    } catch (error) {
      console.error('Error in label detection:', error);
      return null;
    }
  }

  return null; // Will use dummy data
};

// Parse receipt text into items
const parseReceiptText = (text) => {
  if (!text) return null;

  // Simple receipt parsing logic
  // In production, use ML model or more sophisticated parsing
  const lines = text.split('\n');
  const items = [];
  
  // Look for price patterns (e.g., $3.99, 3.99)
  const pricePattern = /\$?(\d+\.\d{2})/;
  
  lines.forEach((line, index) => {
    const priceMatch = line.match(pricePattern);
    if (priceMatch) {
      const price = parseFloat(priceMatch[1]);
      const name = line.replace(pricePattern, '').trim();
      
      if (name && price > 0) {
        items.push({
          name: name || `Item ${items.length + 1}`,
          price: price,
          quantity: 1,
        });
      }
    }
  });

  return items.length > 0 ? items : null;
};

module.exports = {
  initializeVision,
  extractTextFromImage,
  detectBarcode,
  detectProductLabels,
  parseReceiptText,
};

