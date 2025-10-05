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
      description: "Experienced media professional with 12+ years of expertise in production, marketing, and team leadership. Executive Producer, HR, Sales Manager and Marketing Manager with extensive experience in Dubai's dynamic media industry.",
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
      title: "Media Industry Expert",
      profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg",
      content: "I am an Executive Producer (filmmaker), HR, Sales Manager, and Marketing Manager with 12 years of experience in the media industry. I have extensive experience in developing and executing marketing and sales strategies, positioning, research, and branding for various production companies and Media Zone Authority 'towfour54'.\n\nMy expertise includes:\n• Producing multimedia content for TV, web, and social media platforms, including documentaries, commercials, and corporate videos\n• Managing sales and business development activities, generating over $5 million in revenue and securing long-term partnerships with key clients\n• Leading and mentoring teams of up to 20 creative professionals, enhancing employee relations and performance\n• Developing comprehensive sales and marketing plans for high-profile events\n• Establishing effective communication channels with various media outlets\n• Coordinating charity concerts and managing contracts and logistical details\n• Leading job analysis projects to evaluate and redesign positions\n• Designing and implementing performance management systems\n• Creating training and development programs for employees\n\nI hold a golden visa as a multimedia producer and am eager to contribute to the success of organizations while growing professionally. I am fluent in Arabic and English, with exceptional communication skills and celebrity contacts.",
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
          title: "Sales Manager",
          company: "iPro Group General Trading",
          location: "Dubai, UAE",
          period: "2021 - Present",
          description: "Achieving growth and hitting sales targets by successfully managing the sales team. Designing and implementing strategic sales plans that expand company's customer base and ensure strong presence. Managing recruiting, objectives setting, coaching and performance monitoring of sales representatives."
        },
        {
          title: "PR & Sales Manager",
          company: "SAMIT Event Management",
          location: "Dubai, UAE",
          period: "Aug 2022 - Present",
          description: "Orchestrated site selection for photography, securing permits through effective collaboration. Led cross-functional production team members to optimize workflow and meet project goals. Spearheaded identification and scheduling of actors and singers, ensuring cohesive production process."
        },
        {
          title: "Events Manager",
          company: "iPro General Trading FZLLC",
          location: "Dubai, UAE",
          period: "Jan 2019 - Aug 2023",
          description: "Developed and executed comprehensive sales and marketing plans for high-profile events. Established effective communication channels with various media outlets, enhancing event visibility. Successfully coordinated charity concerts, managing contracts and logistical details."
        },
        {
          title: "Executive Producer",
          company: "ProX Production FZLLC / Media Zone Authority",
          location: "Abu Dhabi, UAE",
          period: "Apr 2013 - Dec 2019",
          description: "Led job analysis project to evaluate and redesign current positions. Designed and implemented new performance management system to build performance culture and boost productivity. Supervised production of films, determined work schedules and correct workflow. Coordinated with television stations."
        },
        {
          title: "HR and Admin Manager",
          company: "Prox Production FZ LLC",
          location: "Abu Dhabi, UAE",
          period: "2017 - 2021",
          description: "Led job analysis project to evaluate and redesign current positions. Designed and implemented new performance management system. Designed training and development system program, including employee training and new employee orientation program."
        }
      ],
      aboutMe: "I am an Executive Producer (filmmaker), HR, Sales Manager, and Marketing Manager with 12 years of experience in the media industry. I have extensive experience in developing and executing marketing and sales strategies, positioning, research, and branding for various production companies and Media Zone Authority 'towfour54'.",
      skills: [
        { name: "Strategic Planning and Execution", level: 95 },
        { name: "Team Leadership and Communication", level: 90 },
        { name: "Talent Management and Scheduling", level: 88 },
        { name: "Logistics and Operations Management", level: 92 },
        { name: "Budgeting and Negotiation", level: 85 },
        { name: "Marketing Strategy and Implementation", level: 90 },
        { name: "Media Relations and Communication", level: 88 },
        { name: "Celebrity and Influencer Relations", level: 90 },
        { name: "Multimedia Content Production", level: 95 },
        { name: "Event Management and Coordination", level: 92 },
        { name: "HR Management and Performance Systems", level: 85 },
        { name: "Business Development and Sales", level: 88 }
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
      email: "hussam.awa@icloud.com",
      phone: "+971 50 1883240",
      location: "Dubai Sports City, UAE",
      linkedin: "https://www.linkedin.com/in/hussam-awa-aaa47998/",
      socialLinks: {
        twitter: "",
        instagram: "",
        facebook: ""
      }
    },
    settings: {
      name: "Hussam Awa",
      title: "Executive Producer, HR, Sales & Marketing Manager",
      email: "hussam.awa@icloud.com",
      phone: "+971 50 1883240",
      linkedin: "https://www.linkedin.com/in/hussam-awa-aaa47998/",
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
