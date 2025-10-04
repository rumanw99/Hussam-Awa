import { storage } from './storage';

export async function readData() {
  try {
    const data = await storage.getData();
    console.log('Data loaded:', data);
    return data;
  } catch (error) {
    console.error('Error reading data:', error);
    return await storage.getData(); // This will return default data
  }
}

export async function writeData(data: any) {
  try {
    await storage.setData(data);
    console.log('✅ Data saved successfully');
    return;
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
}
