import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data.json');

// Check if we're in production (Vercel)
const isProduction = process.env.NODE_ENV === 'production';

// In-memory storage for production (Vercel)
let memoryData: any = null;

export async function readData() {
  try {
    if (isProduction) {
      // In production, use in-memory storage or default data
      if (memoryData) {
        console.log('Production mode: returning memory data');
        return memoryData;
      } else {
        console.log('Production mode: returning default data');
        return getDefaultData();
      }
    } else {
      // In development, read from local file
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading data:', error);
    return getDefaultData();
  }
}

export async function writeData(data: any) {
  try {
    if (isProduction) {
      // In production, store in memory
      memoryData = data;
      console.log('Production mode: data stored in memory:', JSON.stringify(data, null, 2));
      console.log('✅ Data saved to memory (production mode)');
      return;
    } else {
      // In development, write to local file
      console.log('Writing data to file:', dataPath);
      console.log('Data to write:', JSON.stringify(data, null, 2));
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      console.log('✅ Data saved to local file successfully');
    }
  } catch (error) {
    console.error('Error writing data:', error);
    throw error;
  }
}

function getDefaultData() {
  return {
    hero: {
      name: "Hussam Awa",
      titles: ["Executive Producer", "HR Manager", "Sales Manager", "Marketing Manager"],
      description: "Golden Visa holder with 12+ years of experience in media production, marketing, and team leadership in Dubai's dynamic industry.",
      profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HUSSAM-6Lk8xXir2XB6TY1T0hIt5MJf8FXFPu.jpg"
    },
    photos: [],
    videos: [],
    about: {
      title: "Golden Visa Holder",
      profileImage: "",
      content: "",
      stats: [
        { icon: "Briefcase", value: "12+", label: "Years Experience" },
        { icon: "DollarSign", value: "$5M+", label: "Revenue Generated" },
        { icon: "Users", value: "20+", label: "Team Members Led" },
        { icon: "Award", value: "100+", label: "Projects Completed" }
      ]
    },
    resume: {
      experience: [],
      aboutMe: "",
      skills: []
    },
    testimonials: [],
    contact: {
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      socialLinks: {
        twitter: "",
        instagram: "",
        facebook: ""
      }
    },
    settings: {
      name: "Hussam Awa",
      title: "",
      email: "",
      phone: "",
      linkedin: "",
      profilePhoto: ""
    },
    blog: []
  };
}
