import { storage } from './storage';
import { database } from './database';

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
    // Save to storage (file system)
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
