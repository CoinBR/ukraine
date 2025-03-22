import fs from 'fs/promises';
import yaml from 'js-yaml';
import path from 'path';
import { ServiceCollection } from './types';

export const readServicesFile = async (): Promise<ServiceCollection> => {
  try {
    const filePath = path.join(process.cwd(), 'services.yml');
    const fileContents = await fs.readFile(filePath, 'utf8');
    return yaml.load(fileContents) as ServiceCollection;
  } catch (error) {
    console.error(`Failed to read services file: ${(error as Error).message}`);
    return { services: [] };
  }
};

