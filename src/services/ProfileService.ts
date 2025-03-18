import { v4 as uuidv4 } from 'uuid';

export interface UserProfile {
  id: string;
  userId: string;
  name: string;
  lastModified: number;
  currentState: {
    nodeCount: number;
    theme: string;
    interactionRadius: number;
    interactionEnabled: boolean;
    customMode: boolean;
    backgroundColor: string;
    nodeColor: string;
    connectionColor: string;
    nodeBrightness: number;
    isGradientMode: boolean;
    gradientColors: {
      from: string;
      to: string;
    };
  };
  presets: {
    id: string;
    name: string;
    nodeCount: number;
    theme: string;
    interactionRadius: number;
    interactionEnabled: boolean;
    customMode: boolean;
    backgroundColor: string;
    nodeColor: string;
    connectionColor: string;
    nodeBrightness: number;
    isGradientMode: boolean;
    gradientColors: {
      from: string;
      to: string;
    };
  }[];
}

export class ProfileService {
  private readonly USERS_KEY = 'network_users';
  private readonly PROFILES_KEY = 'network_profiles';

  constructor() {
    this.initializeStorage();
  }

  private initializeStorage(): void {
    if (!localStorage.getItem(this.USERS_KEY)) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.PROFILES_KEY)) {
      localStorage.setItem(this.PROFILES_KEY, JSON.stringify([]));
    }
  }

  private getUsers(): Array<{ id: string; email: string; passwordHash: string; createdAt: number }> {
    return JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
  }

  private getAllProfiles(): UserProfile[] {
    return JSON.parse(localStorage.getItem(this.PROFILES_KEY) || '[]');
  }

  private saveProfiles(profiles: UserProfile[]): void {
    localStorage.setItem(this.PROFILES_KEY, JSON.stringify(profiles));
  }

  async createUser(email: string, password: string): Promise<string> {
    const users = this.getUsers();
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      throw new Error('User already exists');
    }

    const userId = uuidv4();
    const passwordHash = await this.hashPassword(password);
    
    users.push({
      id: userId,
      email,
      passwordHash,
      createdAt: Date.now()
    });

    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    return userId;
  }

  async authenticateUser(email: string, password: string): Promise<string | null> {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
      return null;
    }

    const isValid = await this.verifyPassword(password, user.passwordHash);
    return isValid ? user.id : null;
  }

  async createProfile(userId: string, name: string, currentState: any): Promise<UserProfile> {
    const profiles = this.getAllProfiles();
    
    const profile: UserProfile = {
      id: uuidv4(),
      userId,
      name,
      lastModified: Date.now(),
      currentState,
      presets: []
    };

    profiles.push(profile);
    this.saveProfiles(profiles);
    return profile;
  }

  async getProfiles(userId: string): Promise<UserProfile[]> {
    const profiles = this.getAllProfiles();
    return profiles.filter(p => p.userId === userId);
  }

  async updateProfile(profile: UserProfile): Promise<void> {
    const profiles = this.getAllProfiles();
    const index = profiles.findIndex(p => p.id === profile.id && p.userId === profile.userId);
    
    if (index === -1) {
      throw new Error('Profile not found');
    }

    profiles[index] = profile;
    this.saveProfiles(profiles);
  }

  async deleteProfile(profileId: string, userId: string): Promise<void> {
    const profiles = this.getAllProfiles();
    const filteredProfiles = profiles.filter(p => !(p.id === profileId && p.userId === userId));
    
    if (filteredProfiles.length === profiles.length) {
      throw new Error('Profile not found');
    }

    this.saveProfiles(filteredProfiles);
  }

  private async hashPassword(password: string): Promise<string> {
    // For development, we'll use a simple hash
    // In production, you should use a proper hashing library
    return btoa(password);
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    // For development, we'll use a simple comparison
    // In production, you should use proper password verification
    return btoa(password) === hash;
  }
} 