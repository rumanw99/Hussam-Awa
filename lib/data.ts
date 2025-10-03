import fs from 'fs';
import path from 'path';
import { kv } from '@vercel/kv';

const dataPath = path.join(process.cwd(), 'data.json');

// Check if we're in production (Vercel) or development
const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL;

export async function readData() {
  if (isProduction) {
    // Use Vercel KV in production
    try {
      const data = await kv.get('portfolio-data');
      if (data) {
        return data;
      }
      
      // If no data exists, try to read from local file and migrate
      try {
        const localData = fs.readFileSync(dataPath, 'utf8');
        const parsedData = JSON.parse(localData);
        await kv.set('portfolio-data', parsedData);
        return parsedData;
      } catch {
        // Return default data if no local file exists
        return getDefaultData();
      }
    } catch (error) {
      console.error('Error reading from KV:', error);
      return getDefaultData();
    }
  } else {
    // Use local file in development
    try {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading local data file:', error);
      return getDefaultData();
    }
  }
}

export async function writeData(data: any) {
  if (isProduction) {
    // Use Vercel KV in production
    try {
      await kv.set('portfolio-data', data);
      console.log('✅ Data saved to KV storage');
    } catch (error) {
      console.error('Error writing to KV:', error);
      throw error;
    }
  } else {
    // Use local file in development
    try {
      fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
      console.log('✅ Data saved to local file');
    } catch (error) {
      console.error('Error writing to local file:', error);
      throw error;
    }
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
