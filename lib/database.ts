// Database-like storage using Vercel KV or alternative persistent storage
import { storage } from './storage';

class Database {
  private static instance: Database;
  private cache: Map<string, any> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  private constructor() {}

  static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async get(key: string): Promise<any> {
    try {
      // Check cache first
      if (this.cache.has(key)) {
        const cached = this.cache.get(key);
        if (Date.now() - cached.timestamp < this.cacheTimeout) {
          console.log(`Database: Retrieved ${key} from cache`);
          return cached.data;
        } else {
          this.cache.delete(key);
        }
      }

      // Try to get from storage
      const data = await storage.getData();
      const result = this.getNestedValue(data, key);
      
      // Cache the result
      this.cache.set(key, {
        data: result,
        timestamp: Date.now()
      });

      console.log(`Database: Retrieved ${key} from storage`);
      return result;
    } catch (error) {
      console.error(`Database: Error getting ${key}:`, error);
      return null;
    }
  }

  async set(key: string, value: any): Promise<boolean> {
    try {
      // Get current data
      const data = await storage.getData();
      
      // Update the nested value
      this.setNestedValue(data, key, value);
      
      // Save back to storage
      await storage.setData(data);
      
      // Update cache
      this.cache.set(key, {
        data: value,
        timestamp: Date.now()
      });

      console.log(`Database: Saved ${key} successfully`);
      return true;
    } catch (error) {
      console.error(`Database: Error setting ${key}:`, error);
      return false;
    }
  }

  private getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  private setNestedValue(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((current, key) => {
      if (!current[key]) {
        current[key] = {};
      }
      return current[key];
    }, obj);
    
    if (lastKey) {
      target[lastKey] = value;
    }
  }

  // Force refresh from storage (bypass cache)
  async refresh(): Promise<void> {
    this.cache.clear();
    console.log('Database: Cache cleared, will reload from storage');
  }
}

export const database = Database.getInstance();
