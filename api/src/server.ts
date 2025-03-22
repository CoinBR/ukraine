import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
import speakeasy from 'speakeasy';
import { readServicesFile } from './fileUtils';
import { sanitizeServices, findServiceByName } from './serviceUtils';
import { AccessRequest, AccessResponse } from './types';

dotenvExpand.expand(dotenv.config())

const app = express();
app.use(express.json());
app.use(cors({
  origin: process.env.UI_URL,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

const API_PORT = process.env.API_PORT;
const API_URL = process.env.API_URL;

app.get('/api/services', async (req, res) => {
  try {
    const serviceCollection = await readServicesFile();
    const sanitizedServices = sanitizeServices(serviceCollection.services);
    res.json({ services: sanitizedServices });
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/access-service', async (req, res) => {
  const { serviceName, code }: AccessRequest = req.body;

  try {
    const serviceCollection = await readServicesFile();
    const targetService = findServiceByName(serviceCollection, serviceName);

    if (!targetService) {
      return res.status(404).json({
        success: false,
        message: `Service not found: ${serviceName}`
      });
    }

    if (!targetService.totpSecret) {
      return res.json({
        success: true,
        url: targetService.url
      });
    }

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authentication code required'
      });
    }

    const isValidCode = speakeasy.totp.verify({
      secret: targetService.totpSecret,
      encoding: 'base32',
      token: code,
      digits: 6,
      step: 30,
      window: 1
    });

    if (!isValidCode) {
      return res.status(401).json({
        success: false,
        message: 'Invalid authentication code'
      });
    }

    return res.json({
      success: true,
      url: targetService.url
    });

  } catch (error) {
    console.error('Error processing access request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

app.listen(API_PORT, () => {
  console.log(`Server running at ${API_URL}`);
});

