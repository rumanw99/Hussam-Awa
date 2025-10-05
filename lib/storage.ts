// Simple in-memory storage with persistence attempts
class SimpleStorage {
  private static instance: SimpleStorage;
  private data: any = null;
  private initialized = false;
  private isProduction = process.env.NODE_ENV === 'production';

  private constructor() {}

  static getInstance(): SimpleStorage {
    if (!SimpleStorage.instance) {
      SimpleStorage.instance = new SimpleStorage();
    }
    return SimpleStorage.instance;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      // Try to load from file first
      const fs = await import('fs');
      const path = await import('path');
      const dataPath = path.join(process.cwd(), 'data.json');
      
      try {
        const fileData = fs.readFileSync(dataPath, 'utf8');
        this.data = JSON.parse(fileData);
        console.log('Storage: Loaded data from file successfully');
        console.log('Storage: Data contains:', {
          hero: !!this.data.hero,
          resume: !!this.data.resume,
          testimonials: this.data.testimonials?.length || 0,
          experience: this.data.resume?.experience?.length || 0,
          skills: this.data.resume?.skills?.length || 0
        });
      } catch (fileError) {
        console.log('Storage: Could not load from file, using default data');
        this.data = this.getDefaultData();
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Storage initialization error:', error);
      this.data = this.getDefaultData();
      this.initialized = true;
    }
  }

  async getData() {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.data;
  }

  async setData(newData: any) {
    this.data = newData;
    console.log('Storage: Data updated in memory');
    
    // Try to persist to file
    try {
      const fs = await import('fs');
      const path = await import('path');
      const dataPath = path.join(process.cwd(), 'data.json');
      
      // Create backup of original data
      try {
        const originalData = fs.readFileSync(dataPath, 'utf8');
        fs.writeFileSync(dataPath + '.backup', originalData);
        console.log('Storage: Created backup of original data');
      } catch (backupError) {
        console.log('Storage: Could not create backup');
      }
      
      fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));
      console.log('Storage: Data persisted to file successfully');
      
      // Verify the data was written correctly
      try {
        const writtenData = fs.readFileSync(dataPath, 'utf8');
        const parsedData = JSON.parse(writtenData);
        console.log('Storage: Data verification successful');
        console.log('Storage: Written data summary:', {
          hero: !!parsedData.hero,
          resume: !!parsedData.resume,
          testimonials: parsedData.testimonials?.length || 0
        });
      } catch (verifyError) {
        console.log('Storage: Data verification failed');
      }
      
    } catch (error) {
      console.log('Storage: Could not persist to file, data stored in memory only');
      console.log('Storage: Error details:', error);
    }
    
    // In production, also try to update the original data.json in the repo
    if (this.isProduction) {
      console.log('Storage: Production mode - data will persist in memory across requests');
      console.log('Storage: Production data summary:', {
        hero: !!newData.hero,
        resume: !!newData.resume,
        testimonials: newData.testimonials?.length || 0,
        experience: newData.resume?.experience?.length || 0,
        skills: newData.resume?.skills?.length || 0
      });
    }
  }

  private getDefaultData() {
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
        title: "Media Industry Expert",
        profileImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-09-30%20at%2012.18.16%20AM-Du2MSqMkvpngprQPjx6MyLl6NuUz3v.jpeg",
        content: "I am an Executive Producer (filmmaker), HR, Sales Manager, and Marketing Manager with 12 years of experience in the media industry. Seeking a senior position that leverages my skills in developing and executing marketing strategies, producing multimedia content, and leading creative teams to deliver exceptional results.\n\nMy expertise includes developing and executing marketing strategies, positioning, research, and branding for various production companies and Media Zone Authority \"twofour54\". I specialize in producing multimedia content for TV, web, and social media platforms, including documentaries, commercials, and corporate videos.\n\nWith a proven track record in managing sales and business development activities, I've generated over $5 million in revenue and secured long-term partnerships with key clients. I take pride in leading and mentoring teams of up to 20 creative professionals, enhancing employee relations and performance.",
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
}

export const storage = SimpleStorage.getInstance();
