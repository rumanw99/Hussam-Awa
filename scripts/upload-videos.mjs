import { put } from '@vercel/blob';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadVideos() {
  // Check if BLOB_READ_WRITE_TOKEN is set
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    console.error('❌ BLOB_READ_WRITE_TOKEN environment variable is not set!');
    console.log('Please set it in your .env.local file or environment variables.');
    return;
  }

  const videoDir = path.join(__dirname, '..', 'public', 'video');
  
  if (!fs.existsSync(videoDir)) {
    console.error('❌ Video directory not found:', videoDir);
    return;
  }
  
  const videoFiles = fs.readdirSync(videoDir).filter(file => file.endsWith('.mp4'));
  
  if (videoFiles.length === 0) {
    console.log('ℹ️ No video files found in', videoDir);
    return;
  }
  
  console.log(`📁 Found ${videoFiles.length} video files to upload:`);
  videoFiles.forEach(file => console.log(`  - ${file}`));
  
  const uploadedVideos = [];
  
  for (const file of videoFiles) {
    try {
      const filePath = path.join(videoDir, file);
      const fileBuffer = fs.readFileSync(filePath);
      
      console.log(`\n📤 Uploading ${file}...`);
      
      const blob = await put(file, fileBuffer, {
        access: 'public',
        token: process.env.BLOB_READ_WRITE_TOKEN
      });
      
      console.log(`✅ Uploaded successfully: ${blob.url}`);
      
      // Create video object for data.json
      const cleanTitle = file
        .replace('.mp4', '')
        .replace(/WhatsApp Video \d{4}-\d{2}-\d{2} at \d{2}\.\d{2}\.\d{2} AM/, 'Portfolio Video')
        .replace(/WhatsApp Video/, 'Portfolio Video');
      
      const videoData = {
        title: cleanTitle,
        description: `Professional video content showcasing our work - ${cleanTitle}`,
        category: "Portfolio",
        url: blob.url,
        thumbnail: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop&crop=center"
      };
      
      uploadedVideos.push(videoData);
      
    } catch (error) {
      console.error(`❌ Error uploading ${file}:`, error.message);
    }
  }
  
  if (uploadedVideos.length > 0) {
    console.log(`\n📋 Video data for data.json (${uploadedVideos.length} videos):`);
    console.log(JSON.stringify(uploadedVideos, null, 2));
    
    // Save to file
    const outputFile = path.join(__dirname, '..', 'uploaded-videos.json');
    fs.writeFileSync(outputFile, JSON.stringify(uploadedVideos, null, 2));
    console.log(`\n💾 Video data saved to: ${outputFile}`);
  }
  
  return uploadedVideos;
}

// Run the upload
uploadVideos()
  .then(() => {
    console.log('\n🎉 Video upload process completed!');
    console.log('Next steps:');
    console.log('1. Copy the video data above');
    console.log('2. Update your data.json file with the new video URLs');
    console.log('3. Deploy to Vercel');
  })
  .catch(console.error);
