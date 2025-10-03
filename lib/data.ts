import fs from 'fs';
import path from 'path';

const dataPath = path.join(process.cwd(), 'data.json');

// For now, always use local file storage
const useLocalStorage = true;

export async function readData() {
  if (useLocalStorage) {
    // Use local file storage
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
  if (useLocalStorage) {
    // Use local file storage
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
