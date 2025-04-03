// This is a simple in-memory store that will persist during the application lifecycle
// but will reset when the application is restarted/redeployed

// Define the type for our celebration store
type CelebrationStore = {
    counts: Record<string, number>;
  };
  
  // Create a global store (this will be shared across all components)
  const globalStore: CelebrationStore = {
    counts: {},
  };
  
  // Initialize from localStorage if available (to maintain persistence across page refreshes)
  try {
    const storedCounts = localStorage.getItem('global_celebration_counts');
    if (storedCounts) {
      globalStore.counts = JSON.parse(storedCounts);
    }
  } catch (error) {
    console.error('Failed to load celebration counts from localStorage', error);
  }
  
  // Function to get a celebration count
  export function getCelebrationCount(achievementId: string): number {
    return globalStore.counts[achievementId] || 0;
  }
  
  // Function to increment a celebration count
  export function incrementCelebrationCount(achievementId: string): number {
    const currentCount = getCelebrationCount(achievementId);
    const newCount = currentCount + 1;
    
    // Update the global store
    globalStore.counts[achievementId] = newCount;
    
    // Also update localStorage for persistence across page refreshes
    try {
      localStorage.setItem('global_celebration_counts', JSON.stringify(globalStore.counts));
    } catch (error) {
      console.error('Failed to save celebration counts to localStorage', error);
    }
    
    return newCount;
  }
  
  // Function to check if a user has celebrated an achievement in this session
  export function hasUserCelebrated(achievementId: string): boolean {
    try {
      const sessionCelebrations = sessionStorage.getItem('celebrated_achievements');
      return sessionCelebrations 
        ? JSON.parse(sessionCelebrations).includes(achievementId)
        : false;
    } catch (error) {
      console.error('Failed to check session celebrations', error);
      return false;
    }
  }
  
  // Function to mark an achievement as celebrated by the current user
  export function markAsCelebrated(achievementId: string): void {
    try {
      const sessionCelebrations = sessionStorage.getItem('celebrated_achievements');
      const celebrated = sessionCelebrations ? JSON.parse(sessionCelebrations) : [];
      
      if (!celebrated.includes(achievementId)) {
        celebrated.push(achievementId);
        sessionStorage.setItem('celebrated_achievements', JSON.stringify(celebrated));
      }
    } catch (error) {
      console.error('Failed to mark achievement as celebrated', error);
    }
  }
  