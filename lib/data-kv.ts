import { kv } from '@vercel/kv';

const DATA_KEY = 'portfolio-data';

export async function readData() {
  try {
    // Check if KV is available
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.log('KV not configured, returning default data');
      return getDefaultData();
    }

    const data = await kv.get(DATA_KEY);
    if (data) {
      console.log('Data loaded from KV:', data);
      return data;
    }
    
    // If no data exists, return default data
    console.log('No data in KV, returning default data');
    return getDefaultData();
  } catch (error) {
    console.error('Error reading data from KV:', error);
    console.log('Falling back to default data');
    return getDefaultData();
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
    photos: [
      {
        title: "Wedding Day",
        description: "Beautiful moments from a wedding ceremony.",
        category: "Wedding",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.17%20AM-260S0kGXlmtR6XxQXsdcDl9ZGLn8K0.jpeg"
      },
      {
        title: "Corporate Event",
        description: "Highlights from a corporate gathering.",
        category: "Corporate",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.18%20AM-kV9xEAuLTpUEnxVr0ue1ZzhNsCmaMi.jpeg"
      },
      {
        title: "Portrait Shoot",
        description: "Studio portrait photography.",
        category: "Portrait",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.17%20AM%20%281%29-elgrYlm3la1jNM3pcf56fvtAxVHks1.jpeg"
      }
    ],
    videos: [
      {
        title: "Portfolio Video 1",
        description: "Professional video showcasing my work",
        url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp-Video-2025-09-30-at-12.23.14-AM.mp4",
        thumbnail: "/video-production-thumbnail.png"
      }
    ],
    about: {
      title: "Golden Visa Holder",
      profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg",
      content: "Experienced professional with a proven track record in media production, marketing, and team leadership. Golden Visa holder with extensive experience in Dubai's dynamic business environment.",
      stats: [
        { icon: "Briefcase", value: "12+", label: "Years Experience" },
        { icon: "DollarSign", value: "$5M+", label: "Revenue Generated" },
        { icon: "Users", value: "20+", label: "Team Members Led" },
        { icon: "Award", value: "100+", label: "Projects Completed" }
      ]
    },
    resume: {
      experience: [
        {
          title: "Executive Producer",
          company: "Media Production Company",
          location: "Dubai, UAE",
          period: "2020 - Present",
          description: "Leading production teams and managing high-profile media projects."
        }
      ],
      aboutMe: "Experienced professional with a proven track record in media production, marketing, and team leadership.",
      skills: [
        { name: "Project Management", level: 95 },
        { name: "Team Leadership", level: 90 },
        { name: "Media Production", level: 95 },
        { name: "Marketing Strategy", level: 85 }
      ]
    },
    testimonials: [
      {
        name: "Client Name",
        role: "CEO",
        company: "Company Name",
        content: "Hussam delivered exceptional results on our project. Highly recommended!",
        rating: 5
      }
    ],
    contact: {
      email: "hussam@example.com",
      phone: "+971 50 123 4567",
      location: "Dubai, UAE",
      linkedin: "https://linkedin.com/in/hussam-awa",
      socialLinks: {
        twitter: "",
        instagram: "",
        facebook: ""
      }
    },
    settings: {
      name: "Hussam Awa",
      title: "Executive Producer",
      email: "hussam@example.com",
      phone: "+971 50 123 4567",
      linkedin: "https://linkedin.com/in/hussam-awa",
      profilePhoto: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/HUSSAM-6Lk8xXir2XB6TY1T0hIt5MJf8FXFPu.jpg"
    },
    blog: []
  };
}

export async function writeData(data: any) {
  try {
    // Check if KV is available
    if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
      console.log('KV not configured, data not saved to KV');
      return;
    }

    await kv.set(DATA_KEY, data);
    console.log('✅ Data saved to KV storage');
  } catch (error) {
    console.error('Error writing data to KV:', error);
    // Don't throw error, just log it
    console.log('Data not saved to KV, but continuing...');
  }
}
