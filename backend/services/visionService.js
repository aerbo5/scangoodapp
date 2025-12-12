// Vision API service
// Supports: Google Gemini Vision API, Google Cloud Vision API, and Azure Computer Vision API
// For OCR, barcode recognition, and image labeling

const axios = require('axios');

let visionClient = null;
let apiKey = null;
let useRestApi = false;
let useAzureVision = false;
let azureKey = null;
let azureEndpoint = null;
let useGeminiVision = false;
let geminiApiKey = null;

// Initialize Vision client (optional - only if API key is provided)
const initializeVision = () => {
  // IMPORTANT: OCR requires Google Cloud Vision or Azure Computer Vision
  // Gemini Vision does NOT support OCR, only product recognition
  
  // Try Azure Computer Vision first (free tier, no billing required, good for OCR)
  if (process.env.AZURE_COMPUTER_VISION_KEY && process.env.AZURE_COMPUTER_VISION_ENDPOINT) {
    azureKey = process.env.AZURE_COMPUTER_VISION_KEY;
    azureEndpoint = process.env.AZURE_COMPUTER_VISION_ENDPOINT;
    useAzureVision = true;
    console.log('✅ Azure Computer Vision initialized (5,000 free requests/month)');
    // Continue to check for other APIs (can use multiple)
  }

  // Try to initialize Google Cloud Vision with service account key file
  if (process.env.GOOGLE_CLOUD_VISION_KEY_FILE) {
    try {
      const vision = require('@google-cloud/vision');
      visionClient = new vision.ImageAnnotatorClient({
        keyFilename: process.env.GOOGLE_CLOUD_VISION_KEY_FILE,
      });
      console.log('✅ Google Cloud Vision initialized with service account key');
      // Continue to check for API key (can use both)
    } catch (error) {
      console.warn('⚠️ Failed to initialize with service account key:', error.message);
    }
  }

  // Try Google Cloud Vision with API key (using REST API)
  if (process.env.GOOGLE_CLOUD_VISION_API_KEY) {
    apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
    useRestApi = true;
    console.log('✅ Google Cloud Vision initialized with API key (REST API)');
  }

  // Try Google Gemini Vision API (for product recognition only, NOT for OCR)
  if (process.env.GOOGLE_GEMINI_API_KEY) {
    geminiApiKey = process.env.GOOGLE_GEMINI_API_KEY;
    useGeminiVision = true;
    console.log('✅ Google Gemini Vision API initialized (AI-powered product recognition)');
    console.log('💡 Note: Gemini Vision does NOT support OCR - use Google Cloud Vision or Azure for receipt scanning');
  }

  // Check if OCR is available
  const hasOCRSupport = useAzureVision || useRestApi || !!visionClient;
  
  if (!hasOCRSupport && !useGeminiVision) {
    console.log('ℹ️  No Vision API configured');
    console.log('💡 For receipt OCR, add one of:');
    console.log('   - GOOGLE_CLOUD_VISION_API_KEY (for Google Cloud Vision REST API)');
    console.log('   - GOOGLE_CLOUD_VISION_KEY_FILE (for Google Cloud Vision SDK)');
    console.log('   - AZURE_COMPUTER_VISION_KEY + AZURE_COMPUTER_VISION_ENDPOINT (free tier, 5,000 requests/month)');
    console.log('💡 For product recognition, add:');
    console.log('   - GOOGLE_GEMINI_API_KEY (AI-powered, free tier available)');
  } else if (!hasOCRSupport && useGeminiVision) {
    console.warn('⚠️  Gemini Vision is configured but OCR is NOT available!');
    console.warn('💡 Add GOOGLE_CLOUD_VISION_API_KEY or AZURE_COMPUTER_VISION_KEY for receipt scanning');
  }
};

// OCR - Extract text from receipt image
const extractTextFromImage = async (imageBuffer) => {
  console.log('🔍 Starting OCR extraction...');
  console.log('📊 Vision API status:', {
    useAzureVision,
    useRestApi,
    hasVisionClient: !!visionClient,
    useGeminiVision,
  });
  
  // Try Azure Computer Vision first (free tier, good for OCR)
  // If Azure is configured, ONLY use Azure (don't fallback to Google Vision)
  if (useAzureVision && azureKey && azureEndpoint) {
    try {
      console.log('📸 Using Azure Computer Vision for OCR...');
      // Increase timeout for large images (long receipts)
      const imageSizeMB = imageBuffer.length / (1024 * 1024);
      const baseTimeout = 30000; // 30 seconds base
      const additionalTimeout = Math.ceil(imageSizeMB * 5000); // +5 seconds per MB
      const requestTimeout = Math.min(baseTimeout + additionalTimeout, 60000); // Max 60 seconds
      
      console.log(`📊 Image size: ${imageSizeMB.toFixed(2)}MB, using ${requestTimeout}ms timeout`);
      
      const response = await axios.post(
        `${azureEndpoint}/vision/v3.2/read/analyze`,
        imageBuffer,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': azureKey,
            'Content-Type': 'application/octet-stream',
          },
          timeout: requestTimeout,
        }
      );
      
      // Azure returns operation location, need to poll for results
      const operationLocation = response.headers['operation-location'];
      if (operationLocation) {
        console.log('⏳ Polling Azure OCR results...');
        console.log('📊 Image size:', imageBuffer.length, 'bytes');
        
        // For long receipts, increase polling attempts
        // Calculate max attempts based on image size (larger images take longer)
        const imageSizeMB = imageBuffer.length / (1024 * 1024);
        const baseAttempts = 30; // Base attempts for normal receipts
        const additionalAttempts = Math.ceil(imageSizeMB * 10); // +10 attempts per MB
        const maxAttempts = Math.min(baseAttempts + additionalAttempts, 90); // Max 90 attempts (90 seconds)
        
        console.log(`📊 Image size: ${imageSizeMB.toFixed(2)}MB, using ${maxAttempts} polling attempts (max 90 seconds)`);
        
        // Poll for results with adaptive timeout
        for (let i = 0; i < maxAttempts; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          try {
            const resultResponse = await axios.get(operationLocation, {
              headers: {
                'Ocp-Apim-Subscription-Key': azureKey,
              },
              timeout: 15000, // Increased timeout for polling requests
            });
            
            if (resultResponse.data.status === 'succeeded') {
              // Extract text from Azure response
              const readResults = resultResponse.data.analyzeResult?.readResults || [];
              if (readResults.length > 0) {
                const lines = readResults[0].lines || [];
                const text = lines.map(line => line.text).join('\n');
                if (text && text.length > 0) {
                  console.log(`✅ Azure OCR extracted text, length: ${text.length} chars (${readResults[0].lines.length} lines)`);
                  console.log(`⏱️  Completed in ${i + 1} seconds`);
                  return text;
                }
              }
              console.log('⚠️ Azure OCR succeeded but no text found');
              break;
            } else if (resultResponse.data.status === 'failed') {
              console.error('❌ Azure OCR failed:', resultResponse.data);
              break;
            }
            
            // Log progress for long receipts
            if (i > 0 && i % 10 === 0) {
              console.log(`⏳ Still processing... (${i + 1}/${maxAttempts} seconds)`);
            }
            
            // Continue polling if status is 'running' or 'notStarted'
          } catch (pollError) {
            console.error('❌ Error polling Azure OCR results:', pollError.message);
            if (i === maxAttempts - 1) break; // Last attempt failed
          }
        }
        console.log(`⚠️ Azure OCR polling timeout after ${maxAttempts} seconds - no text extracted`);
      } else {
        console.log('⚠️ Azure OCR did not return operation location');
      }
      
      // If Azure is configured but failed, return null (don't try Google Vision)
      console.log('⚠️ Azure OCR failed or returned no text - not trying Google Vision (Azure-only mode)');
      return null;
    } catch (error) {
      console.error('❌ Error in Azure OCR:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      // If Azure is configured but failed, return null (don't try Google Vision)
      console.log('⚠️ Azure OCR error - not trying Google Vision (Azure-only mode)');
      return null;
    }
  }

  // Try Google Cloud Vision REST API if API key is provided (only if Azure is NOT configured)
  if (useRestApi && apiKey && !useAzureVision) {
    try {
      console.log('📸 Using Google Cloud Vision REST API for OCR...');
      console.log('📊 Image buffer size:', imageBuffer.length, 'bytes');
      
      const base64Image = imageBuffer.toString('base64');
      console.log('📊 Base64 image length:', base64Image.length, 'chars');
      
      const requestBody = {
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
      };
      
      // Increase timeout for large images (long receipts)
      const imageSizeMB = imageBuffer.length / (1024 * 1024);
      const baseTimeout = 30000; // 30 seconds base
      const additionalTimeout = Math.ceil(imageSizeMB * 5000); // +5 seconds per MB
      const requestTimeout = Math.min(baseTimeout + additionalTimeout, 60000); // Max 60 seconds
      
      console.log(`📊 Image size: ${imageSizeMB.toFixed(2)}MB, using ${requestTimeout}ms timeout`);
      console.log('🌐 Sending request to Google Vision API...');
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
        requestBody,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: requestTimeout,
        }
      );

      console.log('📥 Google Vision API response received');
      console.log('📊 Response status:', response.status);
      console.log('📊 Response data keys:', Object.keys(response.data || {}));
      
      // Check for errors in response
      if (response.data.responses && response.data.responses.length > 0) {
        const firstResponse = response.data.responses[0];
        
        // Check for API errors
        if (firstResponse.error) {
          console.error('❌ Google Vision API error:', firstResponse.error);
          return null;
        }
        
        const annotations = firstResponse.textAnnotations;
        if (annotations && annotations.length > 0) {
          const text = annotations[0].description;
          console.log('✅ Google Vision OCR extracted text, length:', text.length);
          console.log('📝 First 200 chars:', text.substring(0, 200));
          return text;
        } else {
          console.log('⚠️ Google Vision OCR returned no text annotations');
          console.log('📊 Full response:', JSON.stringify(firstResponse, null, 2));
        }
      } else {
        console.log('⚠️ Google Vision API returned empty responses array');
        console.log('📊 Full response data:', JSON.stringify(response.data, null, 2));
      }
      
      return null;
    } catch (error) {
      console.error('❌ Error in OCR (REST API):', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        stack: error.stack,
      });
      
      // More detailed error info
      if (error.response?.data?.error) {
        console.error('❌ API Error details:', JSON.stringify(error.response.data.error, null, 2));
      }
      
      return null;
    }
  }

  // Use SDK if service account key is provided
  if (visionClient) {
    try {
      console.log('📸 Using Google Cloud Vision SDK for OCR...');
      const [result] = await visionClient.textDetection({
        image: { content: imageBuffer },
      });
      
      const detections = result.textAnnotations;
      if (detections && detections.length > 0) {
        const text = detections[0].description;
        console.log('✅ Google Vision SDK OCR extracted text, length:', text.length);
        return text;
      }
      console.log('⚠️ Google Vision SDK OCR returned no text');
      return null;
    } catch (error) {
      console.error('❌ Error in OCR (SDK):', error.message);
      return null;
    }
  }

  // No Vision API configured
  console.error('❌ No Vision API configured for OCR!');
  console.error('💡 Please configure one of the following:');
  console.error('   1. GOOGLE_CLOUD_VISION_API_KEY (for Google Cloud Vision REST API)');
  console.error('   2. GOOGLE_CLOUD_VISION_KEY_FILE (for Google Cloud Vision SDK)');
  console.error('   3. AZURE_COMPUTER_VISION_KEY + AZURE_COMPUTER_VISION_ENDPOINT (for Azure Computer Vision)');
  console.error('   4. GOOGLE_GEMINI_API_KEY (for Gemini Vision - but OCR not supported, only product recognition)');
  return null;
};

// Barcode detection
const detectBarcode = async (imageBuffer) => {
  // Try Azure Computer Vision first (if configured, use only Azure)
  if (useAzureVision && azureKey && azureEndpoint) {
    try {
      console.log('🔍 Using Azure Computer Vision for barcode detection...');
      const response = await axios.post(
        `${azureEndpoint}vision/v3.2/analyze?visualFeatures=Read&language=en`,
        imageBuffer,
        {
          headers: {
            'Ocp-Apim-Subscription-Key': azureKey,
            'Content-Type': 'application/octet-stream',
          },
          timeout: 30000,
        }
      );
      
      // Azure Read API can detect barcodes
      const readResults = response.data.readResults || [];
      if (readResults.length > 0) {
        const lines = readResults[0].lines || [];
        for (const line of lines) {
          const words = line.words || [];
          for (const word of words) {
            // Check if word looks like a barcode (numeric, 8+ digits)
            const barcodePattern = /^\d{8,}$/;
            if (barcodePattern.test(word.text)) {
              console.log('✅ Azure detected barcode:', word.text);
              return word.text;
            }
          }
        }
      }
      
      // Azure also has a separate barcode detection endpoint
      try {
        const barcodeResponse = await axios.post(
          `${azureEndpoint}vision/v3.2/read/analyze`,
          imageBuffer,
          {
            headers: {
              'Ocp-Apim-Subscription-Key': azureKey,
              'Content-Type': 'application/octet-stream',
            },
            timeout: 30000,
          }
        );
        
        const operationLocation = barcodeResponse.headers['operation-location'];
        if (operationLocation) {
          // Poll for barcode results
          for (let i = 0; i < 10; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            try {
              const resultResponse = await axios.get(operationLocation, {
                headers: {
                  'Ocp-Apim-Subscription-Key': azureKey,
                },
                timeout: 10000,
              });
              
              if (resultResponse.data.status === 'succeeded') {
                const readResults = resultResponse.data.analyzeResult?.readResults || [];
                if (readResults.length > 0) {
                  const lines = readResults[0].lines || [];
                  for (const line of lines) {
                    const words = line.words || [];
                    for (const word of words) {
                      const barcodePattern = /^\d{8,}$/;
                      if (barcodePattern.test(word.text)) {
                        console.log('✅ Azure detected barcode:', word.text);
                        return word.text;
                      }
                    }
                  }
                }
                break;
              }
            } catch (pollError) {
              if (i === 9) break;
            }
          }
        }
      } catch (barcodeError) {
        // Barcode detection failed, continue
      }
      
      console.log('⚠️ Azure did not detect barcode');
      return null; // Don't try Google Vision if Azure is configured
    } catch (error) {
      console.error('❌ Error in Azure barcode detection:', error.message);
      return null; // Don't try Google Vision if Azure is configured
    }
  }
  
  // Use REST API if API key is provided (only if Azure is NOT configured)
  if (useRestApi && apiKey && !useAzureVision) {
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

  // Use SDK if service account key is provided (only if Azure is NOT configured)
  if (visionClient && !useAzureVision) {
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

  return null;
};

// AI-powered product recognition using Google Gemini Vision API
const detectProductWithAI = async (imageBuffer) => {
  if (useGeminiVision && geminiApiKey) {
    try {
      console.log('🤖 Calling Google Gemini Vision API for AI-powered product recognition...');
      const base64Image = imageBuffer.toString('base64');
      
      // Try different Gemini models - some may not be available depending on API key
      const requestData = {
        contents: [
          {
            parts: [
              {
                text: 'You are analyzing a product package image. Your task is to extract ALL visible text and identify the product information.\n\nSTEP 1: Read ALL text visible on the package:\n- Brand names (usually at the top, large text)\n- Product names (main text, often in banners or large fonts)\n- Descriptions (flavor, type, variety)\n- Size/weight information (usually at bottom, e.g., "2 lb", "32 OZ", "6 count")\n- Any other product details\n\nSTEP 2: Extract the following:\n1. Brand name: Look for the MAIN brand name at the top of the package (e.g., "CATTLEMEN\'S RANCH", "Perrier", "Coca-Cola")\n2. Product name: Extract the COMPLETE product description including:\n   - Product type (e.g., "Beef Burger Patties", "Sparkling Water")\n   - Flavor/variety (e.g., "Bacon Cheddar", "Black Angus")\n   - Any descriptive text (e.g., "Black Angus Bacon Cheddar Beef Burger Patties")\n   - DO NOT use generic terms like "Bacon & Cheese" - use the FULL descriptive name\n3. Size/Weight: Look for weight or quantity information (e.g., "2 lb", "32 OZ", "6 count", "6 - 1/3 POUND PATTIES")\n\nSTEP 3: Combine into full product name:\n- Format: "Brand Product Name" (e.g., "Cattlemen\'s Ranch Black Angus Bacon Cheddar Beef Burger Patties")\n\nCRITICAL RULES:\n- Read EVERY word visible on the package\n- If you see "BLACK ANGUS" include it in the product name\n- If you see "BACON & CHEDDAR CHEESE" use the FULL phrase, not just "Bacon & Cheese"\n- If you see weight like "2 LB" or "32 OZ" include it in size\n- If you see quantity like "6 PATTIES" or "6 COUNT" include it in size\n- NEVER use generic terms - always use the EXACT text from the package\n\nRespond ONLY with a JSON object in this exact format:\n{\n  "brand": "Exact Brand Name from Package",\n  "product": "Complete Product Description with ALL Details",\n  "fullName": "Brand + Complete Product Description",\n  "size": "Exact Size/Weight/Quantity from Package"\n}\n\nExample for a burger patties package:\n{\n  "brand": "Cattlemen\'s Ranch",\n  "product": "Black Angus Bacon Cheddar Beef Burger Patties",\n  "fullName": "Cattlemen\'s Ranch Black Angus Bacon Cheddar Beef Burger Patties",\n  "size": "6 - 1/3 POUND PATTIES NET WT 32 OZ (2 LB)"\n}\n\nIf you cannot identify any field, use "Unknown" for that field. READ ALL TEXT ON THE PACKAGE CAREFULLY.'
              },
              {
                inline_data: {
                  mime_type: 'image/jpeg',
                  data: base64Image,
                },
              },
            ],
          },
        ],
      };
      
      const requestConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 15000,
      };

      let response;
      // Try different Gemini models - Use the latest available models from your API
      // Based on your API response, these are the available models:
      const modelsToTry = [
        { name: 'gemini-2.5-flash', version: 'v1', url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}` },
        { name: 'gemini-2.5-pro', version: 'v1', url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${geminiApiKey}` },
        { name: 'gemini-2.0-flash-001', version: 'v1', url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-001:generateContent?key=${geminiApiKey}` },
        { name: 'gemini-2.0-flash', version: 'v1', url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}` },
        { name: 'gemini-2.5-flash-lite', version: 'v1', url: `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${geminiApiKey}` },
      ];

      let lastError = null;
      for (const model of modelsToTry) {
        try {
          console.log(`  🔄 Trying ${model.name} (${model.version})...`);
          response = await axios.post(
            model.url,
            requestData,
            requestConfig
          );
          console.log(`  ✅ Successfully using ${model.name}`);
          break; // Success, exit loop
        } catch (error) {
          lastError = error;
          if (error.response?.status === 404) {
            console.log(`  ❌ ${model.name} not available, trying next model...`);
            continue; // Try next model
          } else {
            // Non-404 error, throw immediately
            throw error;
          }
        }
      }

      // If all models failed, return null (don't throw - let OCR/Vision API handle it)
      if (!response) {
        console.log('  ⚠️ All Gemini models failed - API key may not have access to these models');
        console.log('  💡 Tip: Check your API key permissions in Google AI Studio');
        console.log('  💡 Tip: Try using a different API key or check available models');
        return null; // Return null instead of throwing - let fallback methods handle it
      }

      const text = response.data.candidates[0]?.content?.parts[0]?.text;
      if (text) {
        console.log('✅ Gemini Vision API response:', text.substring(0, 200));
        
        // Try to parse JSON from response
        try {
          // Extract JSON from response (might have markdown code blocks)
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const productInfo = JSON.parse(jsonMatch[0]);
            console.log('✅ Product identified by AI:', productInfo);
            return productInfo;
          }
        } catch (parseError) {
          console.warn('⚠️ Could not parse Gemini response as JSON, trying text extraction...');
          // Fallback: try to extract brand/product from text
          const brandMatch = text.match(/brand["\s:]+"([^"]+)"/i) || text.match(/brand["\s:]+([^\n,}]+)/i);
          const productMatch = text.match(/product["\s:]+"([^"]+)"/i) || text.match(/product["\s:]+([^\n,}]+)/i);
          const fullNameMatch = text.match(/fullName["\s:]+"([^"]+)"/i) || text.match(/fullName["\s:]+([^\n,}]+)/i);
          const sizeMatch = text.match(/size["\s:]+"([^"]+)"/i) || text.match(/size["\s:]+([^\n,}]+)/i);
          
          if (brandMatch || productMatch || fullNameMatch) {
            return {
              brand: brandMatch ? brandMatch[1].trim() : 'Unknown',
              product: productMatch ? productMatch[1].trim() : 'Unknown',
              fullName: fullNameMatch ? fullNameMatch[1].trim() : (brandMatch && productMatch ? `${brandMatch[1].trim()} ${productMatch[1].trim()}` : 'Unknown'),
              size: sizeMatch ? sizeMatch[1].trim() : 'Unknown',
            };
          }
        }
      }
      
      console.log('⚠️ Gemini Vision API returned no product information');
      return null;
    } catch (error) {
      // Don't log as error if it's a 404 (model not available) - this is expected for some API keys
      if (error.response?.status === 404) {
        console.log('  ⚠️ Gemini models not available with this API key');
        console.log('  💡 This is normal - falling back to OCR and Vision API');
      } else {
        console.error('❌ Error in AI product recognition (Gemini Vision):', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message,
        });
      }
      return null; // Return null to allow fallback to OCR/Vision API
    }
  }
  
  return null;
};

// Product label detection (for product recognition)
const detectProductLabels = async (imageBuffer) => {
  // Note: AI-powered recognition is handled separately in server.js
  // This function only handles traditional Vision API label detection

  // Try Azure Computer Vision (free tier, no billing required)
  if (useAzureVision && azureKey && azureEndpoint) {
    try {
      console.log('🔍 Calling Azure Computer Vision API for label detection...');
      const response = await axios.post(
        `${azureEndpoint}vision/v3.2/analyze?visualFeatures=Tags,Description&language=en`,
        imageBuffer, // Send binary data directly
        {
          headers: {
            'Ocp-Apim-Subscription-Key': azureKey,
            'Content-Type': 'application/octet-stream',
          },
        }
      );
      
      // Azure returns tags and description
      const tags = response.data.tags || [];
      const description = response.data.description?.tags || [];
      
      // Combine tags and description tags
      const allLabels = [
        ...tags.map(tag => ({ description: tag.name, score: tag.confidence })),
        ...description.map(tag => ({ description: tag, score: 0.8 })),
      ];
      
      if (allLabels.length > 0) {
        console.log('✅ Azure Vision API returned', allLabels.length, 'labels:', allLabels.map(l => l.description).join(', '));
        return allLabels.slice(0, 10); // Return top 10
      } else {
        console.log('⚠️ Azure Vision API returned no labels');
        return null;
      }
    } catch (error) {
      console.error('❌ Error in label detection (Azure Vision):', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      return null;
    }
    // If Azure is configured, don't try Google Vision even if Azure failed (Azure-only mode)
    console.log('⚠️ Azure label detection failed - not trying Google Vision (Azure-only mode)');
    return null;
  }

  // Use Google Cloud Vision REST API if API key is provided (only if Azure is NOT configured)
  if (useRestApi && apiKey && !useAzureVision) {
    try {
      console.log('🔍 Calling Google Vision API for label detection...');
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
        console.log('✅ Vision API returned', labels.length, 'labels:', labels.map(l => l.description).join(', '));
        return labels.map(label => ({
          description: label.description,
          score: label.score,
        }));
      } else {
        console.log('⚠️ Vision API returned no labels');
        return null;
      }
    } catch (error) {
      console.error('❌ Error in label detection (REST API):', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      return null;
    }
  }

  // Use SDK if service account key is provided (only if Azure is NOT configured)
  if (visionClient && !useAzureVision) {
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

  return null;
};

// Parse receipt text into items
// FOLLOWS STRICT RULES: Only extract grocery items, ignore everything else
// Returns: { items: [...], ignoredElements: {...}, metadata: {...} }
const parseReceiptText = (text) => {
  if (!text) return null;

  console.log('📄 Parsing receipt text, length:', text.length);
  console.log('📄 First 500 chars:', text.substring(0, 500));

  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const items = []; // SECTION A: Grocery Items Only
  const ignoredElements = {
    paymentInfo: [],
    storeInfo: [],
    metadata: [],
    footerCoupons: [],
    nonItem: [],
    unclear: [],
  };
  
  // Metadata (for backward compatibility with existing API)
  let receiptDate = null;
  let receiptTime = null;
  let storeName = null;
  let storeAddress = null;
  let receiptTotal = null;
  let youSaveAmount = null;
  let subtotal = null;
  let tax = null;
  let totalSales = null;
  let totalDue = null;
  
  // ========== PATTERNS FOR IGNORING ELEMENTS ==========
  // Based on comprehensive exclude_fields list
  
  // Payment info patterns (MUST IGNORE)
  const paymentInfoPatterns = [
    /(?:visa|mastercard|amex|american\s*express|discover)/i,
    /card\s*#/i,
    /cardholder/i,
    /debit\s*card/i,
    /credit\s*card/i,
    /expires?/i,
    /authorization/i,
    /auth\s*code/i,
    /approval/i,
    /approved/i,
    /transaction\s*id/i,
    /ref\s*#/i,
    /account\s*#/i,
    /pin/i,
    /signature/i,
    /last\s*4\s*digits/i,
    /\*\*\*\*\s*\d{4}/, // Masked card number
    /payment\s*method/i,
    /aid/i,
    /arqc/i,
    /tvr/i,
    /change\s*given/i,
    /card\s*type/i,
  ];
  
  // Store info patterns (MUST IGNORE) - Comprehensive list
  const storeInfoPatterns = [
    /^(walmart|target|publix|whole\s*foods|kroger|safeway|winn.?dixie|aldi|costco|sams\s*club|trader\s*joes?)/i,
    /store\s*#/i,
    /store\s*number/i,
    /store\s*id/i,
    /store\s*name/i,
    /store\s*address/i,
    /register/i,
    /register\s*number/i,
    /terminal\s*number/i,
    /lane\s*number/i,
    /cashier/i,
    /cashier\s*name/i,
    /cashier\s*id/i,
    /store\s*manager/i,
    /manager\s*name/i,
    /phone/i,
    /phone\s*number/i,
    /customer\s*service/i,
    /customer\s*service\s*number/i,
    /^\d{3}-\d{3}-\d{4}/, // Phone numbers
    /^\d{10,}/, // Phone numbers without dashes
    /\b(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|circle|cir|court|ct)\b/i,
    /\b\d{5}(-\d{4})?\b/, // ZIP codes (5 digits or 5+4)
    /zip\s*code/i,
    /city/i,
    /state/i,
    /address/i,
    /survey/i,
    /logo/i,
    /slogan/i,
    /store\s*hours/i,
    /website/i,
    /www\./i,
    /http/i,
  ];
  
  // Store name patterns (for extraction but mark as ignored)
  const storeNamePatterns = [
    /^(walmart|target|publix|whole\s*foods|kroger|safeway|winn.?dixie|aldi|costco|sams\s*club|trader\s*joes?)/i,
  ];
  
  // Metadata patterns (MUST IGNORE) - Date/Time
  const metadataPatterns = [
    /(\d{1,2}\/\d{1,2}\/\d{2,4})/, // Date
    /(\d{1,2}:\d{2}(?::\d{2})?(?:\s*(?:AM|PM))?)/i, // Time
    /purchase\s*date/i,
    /purchase\s*time/i,
    /transaction\s*timestamp/i,
    /transaction\s*#/i,
    /receipt\s*#/i,
    /receipt\s*number/i,
    /^#\d+/, // Receipt numbers
    /barcode/i,
    /qr\s*code/i,
    /receipt\s*barcode/i,
    /loyalty\s*barcode/i,
    /coupon\s*barcode/i,
  ];
  
  // Loyalty/Membership patterns (MUST IGNORE)
  const loyaltyPatterns = [
    /loyalty/i,
    /loyalty\s*number/i,
    /rewards/i,
    /rewards\s*number/i,
    /membership/i,
    /membership\s*id/i,
    /club\s*member/i,
    /club\s*member\s*id/i,
    /digital\s*coupon\s*code/i,
    /loyalty\s*savings/i,
    /reward\s*savings/i,
    /fuel\s*points/i,
    /fuel\s*rewards/i,
    /points\s*earned/i,
    /points\s*balance/i,
  ];
  
  // Footer/coupons patterns (MUST IGNORE)
  const footerCouponPatterns = [
    /thank\s*you/i,
    /thank\s*you\s*message/i,
    /return\s*policy/i,
    /refund\s*policy/i,
    /survey/i,
    /survey\s*code/i,
    /survey\s*invitation/i,
    /coupon/i,
    /store\s*coupon/i,
    /manufacturer\s*coupon/i,
    /digital\s*coupon/i,
    /bogo\s*discount/i,
    /promo\s*savings/i,
    /deal\s*savings/i,
    /club\s*savings/i,
    /loyalty\s*price\s*adjustment/i,
    /promotion/i,
    /marketing/i,
    /promotional\s*message/i,
    /visit\s*us/i,
    /visit\s*us\s*online/i,
    /website/i,
    /www\./i,
    /http/i,
    /alcohol\s*warning/i,
    /tobacco\s*warning/i,
    /age\s*verification/i,
  ];
  
  // Non-item patterns (MUST IGNORE) - Totals, Taxes, Fees
  const nonItemPatterns = [
    /^(total|subtotal|tax|discount|change|cash|card|receipt|net\s*sales|sales\s*tax)/i,
    /savings\s*total/i,
    /total\s*before\s*tax/i,
    /total\s*after\s*tax/i,
    /balance\s*due/i,
    /amount\s*paid/i,
    /grand\s*total/i,
    /cashback\s*amount/i,
    /roundup\s*donation/i,
    /return\s*value/i,
    /total\s*fsa/i,
    /total\s*rx/i,
    /approved\s*fsa/i,
    /approved\s*hra/i,
    /change\s*due/i,
    /cash\s*back/i,
    /tax\s*total/i,
    /state\s*tax/i,
    /county\s*tax/i,
    /city\s*tax/i,
    /environmental\s*fee/i,
    /bottle\s*deposit/i,
    /crv\s*fee/i,
    /bag\s*fee/i,
    /service\s*fee/i,
    /saved/i, // "SAVED" text on receipts
    /you\s*saved/i,
    /total\s*saved/i,
  ];
  
  // Special sections patterns (MUST IGNORE)
  const specialSectionPatterns = [
    /fuel\s*rewards\s*summary/i,
    /donation\s*info/i,
    /membership\s*renewal/i,
  ];
  
  // Date/Time patterns (for extraction but mark as ignored)
  const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4})/;
  const timePattern = /(\d{1,2}:\d{2}(?::\d{2})?(?:\s*(?:AM|PM))?)/i;
  
  // Price pattern - matches $3.99 or 3.99
  const pricePattern = /\$?(\d+\.\d{2})/;
  
  // Combined skip patterns (for quick checking)
  const skipPatterns = [
    ...paymentInfoPatterns,
    ...storeInfoPatterns,
    ...metadataPatterns,
    ...loyaltyPatterns,
    ...footerCouponPatterns,
    ...nonItemPatterns,
    ...specialSectionPatterns,
    /^markdown:/i,                           // Markdown lines (handled separately for discounts)
    /tare:/i,                                // Tare weight
    /^\d+\.\d+\s*(?:lb|lbs|kg|g|oz)\s*@/i,  // Weight info like "0.21 lb @"
    /\[.*tare.*\]/i,                         // [Tare: ...] brackets
    /^(lb|lbs|kg|g|oz)$/i,                  // Just weight units
    /^saved$/i,                             // Just "SAVED" text
    /^you\s*saved$/i,                        // "YOU SAVED" text
  ];
  
  // Check if line is weight/measurement info (not a product)
  const isWeightInfo = (line) => {
    return /(?:tare|lb|lbs|kg|g|oz|@\s*\$\d+\.\d+\/(?:lb|lbs|kg|g|oz))/i.test(line) &&
           !/[a-z]{4,}/i.test(line.replace(/(?:tare|lb|lbs|kg|g|oz|@|\$|\d|\.|\s)/gi, '')); // If only weight units, it's weight info
  };
  
  let pendingProductNames = []; // Array to store multiple pending product names (FIFO)
  let pendingDiscount = null; // Store discount amount from "Markdown:" lines
  
  // First pass: Extract metadata (date, time, store name) from first 20 lines
  for (let i = 0; i < Math.min(20, lines.length); i++) {
    const line = lines[i];
    
    // Extract store name (usually at top)
    if (!storeName) {
      for (const pattern of storeNamePatterns) {
        const match = line.match(pattern);
        if (match) {
          storeName = match[1].trim();
          console.log(`  🏪 Found store name: ${storeName}`);
          break;
        }
      }
      // Also check for store name without pattern (common store names)
      if (!storeName && line.length > 2 && line.length < 50 && !pricePattern.test(line)) {
        const commonStores = ['WALMART', 'TARGET', 'PUBLIX', 'WHOLE FOODS', 'KROGER', 'SAFEWAY', 'WINN-DIXIE', 'ALDI', 'COSTCO'];
        const upperLine = line.toUpperCase();
        for (const store of commonStores) {
          if (upperLine.includes(store)) {
            storeName = store;
            console.log(`  🏪 Found store name: ${storeName}`);
            break;
          }
        }
      }
    }
    
    // Extract date
    if (!receiptDate) {
      const dateMatch = line.match(datePattern);
      if (dateMatch) {
        receiptDate = dateMatch[1];
        console.log(`  📅 Found date: ${receiptDate}`);
      }
    }
    
    // Extract time
    if (!receiptTime) {
      const timeMatch = line.match(timePattern);
      if (timeMatch) {
        receiptTime = timeMatch[1].trim();
        console.log(`  🕐 Found time: ${receiptTime}`);
      }
    }
    
    // Extract address (usually contains street number, street name, city, state, zip)
    if (!storeAddress && /^\d+/.test(line) && (/\b(street|st|avenue|ave|road|rd|boulevard|blvd|drive|dr|lane|ln|way|circle|cir|court|ct)\b/i.test(line) || 
        /\b\d{5}\b/.test(line) || /\b[A-Z]{2}\s+\d{5}\b/.test(line))) {
      // Skip if it's a phone number or date
      if (!/^\d{3}-\d{3}-\d{4}/.test(line) && !datePattern.test(line)) {
        storeAddress = line.trim();
        console.log(`  📍 Found store address: ${storeAddress}`);
      }
    }
    
    // Extract "you save" amount (only if it's a total/standalone line, not per-product)
    // Per-product discounts are already applied to product prices, so we don't need to track them here
    if (!youSaveAmount) {
      const youSaveMatch = line.match(/you\s*save[:\s]*\$?(\d+\.\d{2})/i);
      if (youSaveMatch && !pricePattern.test(line)) {
        // Only extract if it's a standalone "you save" line (not in a product line with price)
        youSaveAmount = parseFloat(youSaveMatch[1]);
        console.log(`  💰 Found total "you save" amount: $${youSaveAmount.toFixed(2)} (informational only, discounts already applied to products)`);
      }
    }
  }
  
  // Helper function to categorize and add ignored elements
  const addIgnoredElement = (line, category) => {
    if (!ignoredElements[category].includes(line)) {
      ignoredElements[category].push(line);
    }
  };
  
  // Helper function to check if line should be ignored
  const shouldIgnore = (line) => {
    // Check payment info
    if (paymentInfoPatterns.some(p => p.test(line))) {
      addIgnoredElement(line, 'paymentInfo');
      return true;
    }
    // Check store info
    if (storeInfoPatterns.some(p => p.test(line))) {
      addIgnoredElement(line, 'storeInfo');
      return true;
    }
    // Check metadata
    if (metadataPatterns.some(p => p.test(line))) {
      addIgnoredElement(line, 'metadata');
      return true;
    }
    // Check footer/coupons
    if (footerCouponPatterns.some(p => p.test(line))) {
      addIgnoredElement(line, 'footerCoupons');
      return true;
    }
    // Check non-item
    if (nonItemPatterns.some(p => p.test(line))) {
      addIgnoredElement(line, 'nonItem');
      return true;
    }
    return false;
  };
  
  // Second pass: Extract products and categorize ignored elements
  // Use for loop instead of forEach to allow look-ahead
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    
    // First, check if line should be ignored
    if (shouldIgnore(line)) {
      continue;
    }
    
    // Check for discount/markdown lines (e.g., "Markdown: $1.40")
    // Don't reset pendingProductNames for markdown - it's part of the product info
    const markdownMatch = line.match(/markdown:\s*\$?(\d+\.\d{2})/i);
    if (markdownMatch) {
      pendingDiscount = parseFloat(markdownMatch[1]);
      console.log(`  💰 Found discount: $${pendingDiscount.toFixed(2)} (for pending product: ${pendingProductNames[0] || 'none'})`);
      continue; // Continue to next line, keep pendingProductNames
    }
    
    // Skip header/footer lines (already checked in shouldIgnore, but double-check)
    if (skipPatterns.some(pattern => pattern.test(line))) {
      // Don't reset if it's just a skip pattern that might be between product name and price
      // Only reset if it's a major separator
      if (/^(total|subtotal|tax|net\s*sales|sales\s*tax)/i.test(line)) {
        pendingProductNames = [];
        pendingDiscount = null;
      }
      continue;
    }
    
    // Skip date/time lines (already extracted)
    if (datePattern.test(line) && line.length < 30) {
      continue;
    }
    if (timePattern.test(line) && line.length < 20) {
      continue;
    }
    
    // Skip weight/measurement info lines
    if (isWeightInfo(line)) {
      console.log(`  ⏭️  Skipping weight info: "${line}"`);
      pendingProductNames = [];
      // Also skip next line if it's likely a product name after weight info
      if (index < lines.length - 1) {
        const nextLine = lines[index + 1]?.trim();
        if (nextLine && nextLine.length > 3 && nextLine.length < 80 && !pricePattern.test(nextLine)) {
          index++; // Skip next line
        }
      }
      continue;
    }
    
    // Skip lines that are too short
    if (line.length < 2) {
      continue;
    }
    
    // FIRST: Check if line should be skipped entirely (before checking for price)
    // This prevents excluded fields from being processed at all
    const shouldSkipLine = skipPatterns.some(pattern => pattern.test(line)) ||
                           /saved/i.test(line) || // Any line containing "saved"
                           /store\s*manager/i.test(line) ||
                           /zip\s*code/i.test(line) ||
                           /^\d{5}(-\d{4})?$/.test(line) || // Just ZIP code
                           /^\d{3}-\d{3}-\d{4}$/.test(line) || // Just phone number
                           /^(store|manager|cashier|register|terminal|lane|phone|zip|city|state|address|street|avenue|road|boulevard|drive|way|circle|court|landing|river|ste|suite|nw|ne|sw|se)$/i.test(line) ||
                           /\b(river|landing|ste|suite|dr|drive|nw|ne|sw|se|fl|florida|mi|miami)\b/i.test(line); // Address keywords
    
    if (shouldSkipLine) {
      console.log(`  ⏭️  Skipping excluded line: "${line}"`);
      ignoredElements.nonItem.push(line);
      continue;
    }
    
    // Check if line contains a price
    const priceMatch = line.match(pricePattern);
    const hasPrice = priceMatch && parseFloat(priceMatch[1]) > 0 && parseFloat(priceMatch[1]) < 10000;
    
    // Check if line is just a price (e.g., "$3.49 F" or "$5.59 F")
    const isJustPrice = /^\$?\d+\.\d{2}\s*[A-Z0-9]{0,3}$/i.test(line);
    
    if (hasPrice) {
      const price = parseFloat(priceMatch[1]);
      
      // Extract product name
      let name = '';
      let skipNext = false;
      
      // If line has both product name and price (e.g., "TRADITIONAL MEDICINALS TEA $6.49")
      const nameBeforePrice = line.substring(0, priceMatch.index).trim();
      if (nameBeforePrice.length > 2 && !isWeightInfo(nameBeforePrice)) {
        name = nameBeforePrice;
      } 
      // If line is just price (e.g., "$5.59 F" or "$3.49 F"), use first pending product name (FIFO)
      else if (isJustPrice && pendingProductNames.length > 0) {
        name = pendingProductNames.shift(); // Get first pending name and remove it
        console.log(`  🔗 Matched price $${price.toFixed(2)} with pending product: "${name}"`);
      }
      // If line is just price but no pending name, look ahead for product name
      else if (isJustPrice && pendingProductNames.length === 0 && index < lines.length - 1) {
        const nextLine = lines[index + 1]?.trim();
        if (nextLine && 
            nextLine.length > 3 && 
            nextLine.length < 80 && 
            !pricePattern.test(nextLine) && 
            !isWeightInfo(nextLine) &&
            !skipPatterns.some(p => p.test(nextLine)) &&
            !/^[A-Z\s]{15,}$/.test(nextLine)) { // Not all caps long headers
          // Next line is likely product name, use it
          name = nextLine;
          skipNext = true; // Mark to skip next line
        }
      }
      // Otherwise try to extract name from line
      else if (!isJustPrice) {
        name = line
          .replace(/\$\d+\.\d{2}.*$/i, '')
          .replace(/\d+\.\d{2}.*$/i, '')
          .replace(/\s*[A-Z0-9]{1,3}\s*$/, '') // Remove single/two/three letter suffixes like "F", "T1F"
          .trim();
      }
      
      // Skip next line if we used it as product name
      if (skipNext) {
        index++;
      }
      
      // Extract quantity if present (e.g., "2 @ $3.99" or "2x $3.99")
      // But NOT for weight-based quantities (lb, kg, etc.) - those are weight info
      let quantity = 1;
      const quantityMatch = line.match(/^(\d+)\s*(?:x|@|\*)\s*(?!.*(?:lb|lbs|kg|g|oz))/i);
      if (quantityMatch) {
        quantity = parseInt(quantityMatch[1]);
      }
      
      // Clean up product name - remove weight info, brackets, etc.
      if (name) {
        name = name
          .replace(/\[.*?\]/g, '')           // Remove brackets like [Tare: 0.01 lb]
          .replace(/\d+\.\d+\s*(?:lb|lbs|kg|g|oz)\s*@\s*\$?\d+\.\d+\/(?:lb|lbs|kg|g|oz)/gi, '') // Remove weight info
          .replace(/^\d+\s*/, '')            // Remove leading numbers
          .replace(/\s*-\s*$/, '')           // Remove trailing dashes
          .replace(/\s+/g, ' ')               // Normalize spaces
          .trim();
      }
      
      // Only add if we have a meaningful name (not weight info, not skip patterns)
      // Additional checks for excluded fields from comprehensive list
      const isExcludedField = skipPatterns.some(pattern => pattern.test(name)) ||
                               /^(lb|lbs|kg|g|oz|tare|net\s*sales|sales\s*tax|markdown|saved|you\s*saved)$/i.test(name) ||
                               /^(store|manager|cashier|register|terminal|lane|phone|zip|city|state|address|street|avenue|road|boulevard|drive|lane|way|circle|court)$/i.test(name) ||
                               /^\d{5}(-\d{4})?$/.test(name) || // ZIP codes
                               /^\d{3}-\d{3}-\d{4}$/.test(name) || // Phone numbers
                               /^\d{10,}$/.test(name); // Long numbers (could be phone, card, etc.)
      
      if (name && 
          name.length >= 2 && 
          !isWeightInfo(name) &&
          !isExcludedField) {
        
        // Apply discount if available (from Markdown)
        // Note: Discount is applied ONCE to the product price, not to the total
        let finalPrice = price;
        if (pendingDiscount && pendingDiscount > 0) {
          finalPrice = Math.max(0, price - pendingDiscount);
          console.log(`  💰 Applied discount (markdown): $${price.toFixed(2)} - $${pendingDiscount.toFixed(2)} = $${finalPrice.toFixed(2)}`);
          pendingDiscount = null; // Use discount once
        }
        
        // Check if line contains "you save" amount - apply to this product only
        // This is per-product discount, not a total discount
        const lineYouSaveMatch = line.match(/you\s*save[:\s]*\$?(\d+\.\d{2})/i);
        if (lineYouSaveMatch) {
          const saveAmount = parseFloat(lineYouSaveMatch[1]);
          finalPrice = Math.max(0, finalPrice - saveAmount);
          console.log(`  💰 Applied "you save" discount to product: $${price.toFixed(2)} - $${saveAmount.toFixed(2)} = $${finalPrice.toFixed(2)}`);
          // Don't add to youSaveAmount - this is already applied to the product price
        }
        
        // Extract weight/quantity info if present
        let weightQuantity = null;
        const weightMatch = line.match(/(\d+\.?\d*)\s*(?:lb|lbs|kg|g|oz)/i);
        if (weightMatch) {
          weightQuantity = weightMatch[0];
        } else if (quantity > 1) {
          weightQuantity = `${quantity} @ ${price.toFixed(2)}`;
        }
        
        // Calculate total line price
        const totalLinePrice = finalPrice * quantity;
        
        // SECTION A: Add grocery item (exactly as written, with final price after discounts)
        items.push({
          name: name, // Item name (exactly as written, don't rewrite or guess)
          price: finalPrice, // Final price per item after discounts
          quantity: quantity, // Quantity/weight if shown
          weightQuantity: weightQuantity, // Weight/quantity info if available
          totalLinePrice: totalLinePrice, // Total price of the item line
        });
        
        console.log(`  ✅ Parsed item: "${name}" - $${finalPrice.toFixed(2)} per item (qty: ${quantity}, total: $${totalLinePrice.toFixed(2)})`);
      } else if (hasPrice && !name) {
        // Unclear line - has price but no clear product name
        addIgnoredElement(line, 'unclear');
        console.log(`  ⚠️ Unclear text - cannot extract: "${line}"`);
      }
    } 
    // Extract financial information (subtotal, tax, total sales, total due, total)
    // priceMatch is already defined above, use it if available
    if (priceMatch) {
      const amount = parseFloat(priceMatch[1]);
      
      // Extract subtotal
      if (!subtotal && /^(sub\s*total|subtotal)/i.test(line)) {
        subtotal = amount;
        console.log(`  💰 Found subtotal: $${subtotal.toFixed(2)}`);
        continue;
      }
      
      // Extract tax
      if (!tax && /(?:sales\s*tax|tax|tax\s*amount)/i.test(line)) {
        tax = amount;
        console.log(`  💰 Found tax: $${tax.toFixed(2)}`);
        continue;
      }
      
      // Extract total sales
      if (!totalSales && /^total\s*sales/i.test(line)) {
        totalSales = amount;
        console.log(`  💰 Found total sales: $${totalSales.toFixed(2)}`);
        continue;
      }
      
      // Extract total due
      if (!totalDue && /^total\s*due/i.test(line)) {
        totalDue = amount;
        console.log(`  💰 Found total due: $${totalDue.toFixed(2)}`);
        continue;
      }
    }
    
    // Check for total sales line (e.g., "TOTAL SALES $32.52", "TOTAL $32.52", "TOTAL DUE $32.52")
    // Prefer "TOTAL SALES" over other totals (it's the final amount before tax)
    // These will be used as "you paid" in the app
    if (!receiptTotal) {
      // First priority: "TOTAL SALES" (this is the amount before tax)
      if (totalSales) {
        receiptTotal = totalSales;
        console.log(`  💵 Using total sales as receipt total: $${receiptTotal.toFixed(2)}`);
      }
      // Second priority: "TOTAL DUE"
      else if (totalDue) {
        receiptTotal = totalDue;
        console.log(`  💵 Using total due as receipt total: $${receiptTotal.toFixed(2)}`);
      }
      // Third priority: Other total keywords
      else if (/^(total|amount\s*due|grand\s*total)/i.test(line)) {
        const totalMatch = line.match(pricePattern);
        if (totalMatch) {
          receiptTotal = parseFloat(totalMatch[1]);
          console.log(`  💵 Found receipt total (you paid): $${receiptTotal.toFixed(2)}`);
          continue; // Skip this line, don't process as product
        }
      }
      // Last resort: Check if line is just a price (likely total at end of receipt)
      // This should be one of the last lines and be a reasonable total amount
      else if (index >= lines.length - 5 && /^\$?\d+\.\d{2}\s*$/.test(line)) {
        const totalMatch = line.match(pricePattern);
        if (totalMatch) {
          const potentialTotal = parseFloat(totalMatch[1]);
          // If it's a reasonable total (between $1 and $10000), treat it as total
          if (potentialTotal >= 1 && potentialTotal <= 10000) {
            receiptTotal = potentialTotal;
            console.log(`  💵 Found receipt total (you paid) from price-only line: $${receiptTotal.toFixed(2)}`);
            continue; // Skip this line, don't process as product
          }
        }
      }
    }
    
    // Check for "you save" in product lines (e.g., "YOU SAVE $1.40")
    // But only if it's a standalone line, not part of a product line with price
    // We'll handle "you save" discounts per product, not as a total
    const youSaveMatch = line.match(/you\s*save[:\s]*\$?(\d+\.\d{2})/i);
    if (youSaveMatch && !hasPrice && !youSaveAmount) {
      // Only extract if it's a standalone "you save" line (not in a product line)
      youSaveAmount = parseFloat(youSaveMatch[1]);
      console.log(`  💰 Found "you save" amount (standalone): $${youSaveAmount.toFixed(2)}`);
      // This is informational only - discounts are already applied to product prices
    }
    
    // If line doesn't have price but looks like a product name, store it for next line
    else if (line.length > 3 && line.length < 100 && !skipPatterns.some(pattern => pattern.test(line)) && !isWeightInfo(line)) {
      // Don't store lines that are just prices (e.g., "$1.47 F", "$3.49 F")
      const isJustPrice = /^\$?\d+\.\d{2}\s*[A-Z0-9]{0,3}$/i.test(line);
      if (isJustPrice) {
        // This is just a price, don't store as product name
        continue;
      }
      
      // Check if it's likely a product name
      // Increased threshold for all caps from 20 to 30 to allow longer product names like "GOLDEN BLOSSOM HONEY"
      const isLikelyProductName = !/^[A-Z\s]{30,}$/.test(line) && // Not all caps very long headers (increased threshold)
                                  !/^\d+$/.test(line) &&          // Not just numbers
                                  !/^[A-Z]{1,2}$/.test(line) &&   // Not single/two letter codes
                                  !isWeightInfo(line) &&          // Not weight info
                                  !/^(net\s*sales|sales\s*tax|tare|lb|lbs|kg|g|oz|total|subtotal)$/i.test(line); // Not common skip terms
      
      if (isLikelyProductName) {
        // Clean the name before storing
        const cleanName = line
          .replace(/\[.*?\]/g, '')
          .replace(/\d+\.\d+\s*(?:lb|lbs|kg|g|oz)\s*@/gi, '')
          .trim();
        
        if (cleanName.length >= 2 && !skipPatterns.some(pattern => pattern.test(cleanName))) {
          pendingProductNames.push(cleanName); // Add to array (FIFO)
          console.log(`  📝 Stored pending product name: "${cleanName}" (${pendingProductNames.length} pending)`);
        }
      }
    }
  }

  console.log(`📦 Parsed ${items.length} items from receipt`);
  console.log(`🚫 Ignored ${Object.values(ignoredElements).flat().length} elements`);
  
  // Initialize mergedItems and itemMap before processing
  let mergedItems = [];
  const itemMap = new Map();
  
  for (const item of items) {
    const key = item.name.toLowerCase().trim();
    if (itemMap.has(key)) {
      // Merge with existing item
      const existing = itemMap.get(key);
      existing.quantity = (existing.quantity || 1) + (item.quantity || 1);
      existing.totalLinePrice = (existing.totalLinePrice || existing.price || 0) + (item.totalLinePrice || item.price || 0);
      console.log(`  🔀 Merged duplicate: "${item.name}" - Total qty: ${existing.quantity}, Total price: $${existing.totalLinePrice.toFixed(2)}`);
    } else {
      // New item
      const mergedItem = {
        name: item.name,
        price: item.price,
        quantity: item.quantity || 1,
        weightQuantity: item.weightQuantity,
        totalLinePrice: item.totalLinePrice || item.price || 0,
      };
      itemMap.set(key, mergedItem);
      mergedItems.push(mergedItem);
    }
  }
  
  // Calculate total from items only (sum of all product prices, ignore grand total, tax, etc.)
  const itemsTotal = mergedItems.reduce((sum, item) => {
    return sum + (item.totalLinePrice || item.price || 0);
  }, 0);
  
  console.log(`📊 Merged to ${mergedItems.length} unique items`);
  console.log(`💰 Items total (sum of products only): $${itemsTotal.toFixed(2)}`);
  
  // Combine all financial information into a single summary object
  const receiptSummary = {
    subtotal: subtotal || null,
    tax: tax || null,
    totalSales: totalSales || null,
    totalDue: totalDue || null,
    total: receiptTotal || null, // Final total (you paid)
    youSave: youSaveAmount || null,
  };
  
  // Return object with items, ignored elements, and metadata
  const result = {
    items: mergedItems.length > 0 ? mergedItems : null, // Use merged items
    ignoredElements: ignoredElements, // SECTION B: All ignored elements
    date: receiptDate,
    time: receiptTime,
    store: storeName,
    address: storeAddress,
    youPaid: itemsTotal, // Sum of product prices only (ignore grand total, tax, etc.)
    youSave: youSaveAmount, // Total "you save" amount from receipt
    receiptSummary: receiptSummary, // All financial information in one place
  };
  
  return mergedItems.length > 0 ? result : null;
};

module.exports = {
  initializeVision,
  extractTextFromImage,
  detectBarcode,
  detectProductLabels,
  detectProductWithAI,
  parseReceiptText,
};

