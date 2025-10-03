import { kv } from '@vercel/kv';

const DATA_KEY = 'portfolio-data';

export async function readData() {
  try {
    const data = await kv.get(DATA_KEY);
    if (data) {
      return data;
    }
    
    // If no data exists, return default data
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
  } catch (error) {
    console.error('Error reading data from KV:', error);
    throw error;
  }
}

export async function writeData(data: any) {
  try {
    await kv.set(DATA_KEY, data);
    console.log('✅ Data saved to KV storage');
  } catch (error) {
    console.error('Error writing data to KV:', error);
    throw error;
  }
}
