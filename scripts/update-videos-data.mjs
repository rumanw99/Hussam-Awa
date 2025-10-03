import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function updateVideosData() {
  try {
    // Read the uploaded videos data
    const uploadedVideosFile = path.join(__dirname, '..', 'uploaded-videos.json');
    
    if (!fs.existsSync(uploadedVideosFile)) {
      console.error('❌ uploaded-videos.json not found!');
      console.log('Please run the upload script first: pnpm run upload-videos');
      return;
    }
    
    const uploadedVideos = JSON.parse(fs.readFileSync(uploadedVideosFile, 'utf8'));
    console.log(`📁 Found ${uploadedVideos.length} uploaded videos`);
    
    // Read current data.json
    const dataFile = path.join(__dirname, '..', 'data.json');
    const currentData = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    
    // Backup current data
    const backupFile = path.join(__dirname, '..', 'data-backup.json');
    fs.writeFileSync(backupFile, JSON.stringify(currentData, null, 2));
    console.log(`💾 Backup created: ${backupFile}`);
    
    // Update videos section
    currentData.videos = uploadedVideos;
    
    // Write updated data
    fs.writeFileSync(dataFile, JSON.stringify(currentData, null, 2));
    
    console.log('✅ Successfully updated data.json with new video URLs');
    console.log(`📊 Updated ${uploadedVideos.length} videos`);
    
    // Show the updated videos
    console.log('\n📋 Updated videos:');
    uploadedVideos.forEach((video, index) => {
      console.log(`${index + 1}. ${video.title}`);
      console.log(`   URL: ${video.url}`);
      console.log(`   Category: ${video.category}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating data.json:', error.message);
  }
}

updateVideosData();
