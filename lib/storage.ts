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
      
      fs.writeFileSync(dataPath, JSON.stringify(newData, null, 2));
      console.log('Storage: Data persisted to file successfully');
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
}

export const storage = SimpleStorage.getInstance();
