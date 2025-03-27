const CONFIG_STORAGE_KEY = 'app_config';

export interface ClientConfig {
  databases: {
    [name: string]: {
      connectionString: string;
      type: 'mongodb' | 'postgresql' | 'mysql';
      name: string;
    }
  };
  activeAiProvider: 'anthropic' | 'openai';
  anthropicModel: string;
  openaiModel: string;
}

// Get default values from env
const defaultConfig: ClientConfig = {
  databases: {},
  activeAiProvider: process.env.NEXT_PUBLIC_ACTIVE_AI_PROVIDER as 'anthropic' | 'openai' || 'anthropic',
  anthropicModel: process.env.NEXT_PUBLIC_ANTHROPIC_MODEL || 'claude-3-sonnet-20240229',
  openaiModel: process.env.NEXT_PUBLIC_OPENAI_MODEL || 'gpt-4-turbo-preview'
};

export function getClientConfig(): ClientConfig {
  if (typeof window === 'undefined') return defaultConfig;
  
  const stored = localStorage.getItem(CONFIG_STORAGE_KEY);
  if (!stored) {
    // Initialize localStorage with defaults
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(defaultConfig));
    return defaultConfig;
  }
  
  // Merge stored config with default config to ensure all fields exist
  const storedConfig = JSON.parse(stored);
  return {
    ...defaultConfig,
    ...storedConfig,
    // Ensure databases exists even if not in stored config
    databases: storedConfig.databases || {}
  };
}

export function updateClientConfig(newConfig: ClientConfig): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
} 