import { storage } from './storage';
import { database } from './database';

// Check if we're in production and have KV available
const isProduction = process.env.NODE_ENV === 'production';
const hasKV = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

export async function readData() {
  try {
    // In production with KV, try KV first
    if (isProduction && hasKV) {
      try {
        const { readData: readKVData } = await import('./data-kv');
        const data = await readKVData();
        console.log('Data loaded from KV:', data);
        return data;
      } catch (kvError) {
        console.log('KV not available, falling back to storage:', kvError);
      }
    }
    
    // Fallback to storage
    const data = await storage.getData();
    console.log('Data loaded from storage:', data);
    return data;
  } catch (error) {
    console.error('Error reading data:', error);
    return await storage.getData(); // This will return default data
  }
}

export async function writeData(data: any) {
  try {
    // In production with KV, save to KV first
    if (isProduction && hasKV) {
      try {
        const { writeData: writeKVData } = await import('./data-kv');
        await writeKVData(data);
        console.log('✅ Data saved to KV storage');
      } catch (kvError) {
        console.log('KV save failed, falling back to storage:', kvError);
      }
    }
    
    // Always save to storage (file system) as backup
    await storage.setData(data);
    
    // Also save to database (persistent cache)
    await database.set('hero', data.hero);
    await database.set('resume', data.resume);
    await database.set('testimonials', data.testimonials);
    await database.set('about', data.about);
    await database.set('contact', data.contact);
    await database.set('settings', data.settings);
    await database.set('photos', data.photos);
    await database.set('videos', data.videos);
    await database.set('blog', data.blog);
    
    console.log('✅ Data saved successfully to both storage and database');
    return;
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
}
