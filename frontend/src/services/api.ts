import { SystemHealthResponse, ProjectGenerationInput, ProjectGenerationResponse } from 'shared';

// Base URL is relative due to Vite dev-server proxy configurations
const BASE_URL = '';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta: {
    requestId: string;
    timestamp: string;
    failures?: Record<string, string>;
  };
}

export class ApiService {
  async fetchHealth(
    providerOverride?: string,
    modelOverride?: string,
    signal?: AbortSignal
  ): Promise<ApiResponse<SystemHealthResponse & { latencies: Record<string, number> }>> {
    let url = `${BASE_URL}/api/health`;
    const params = new URLSearchParams();
    if (providerOverride) params.append('provider', providerOverride);
    if (modelOverride) params.append('model', modelOverride);
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { method: 'GET', signal });
    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({ message: 'Failed to retrieve system health' }));
      throw new Error(errorJson.message || 'Failed to retrieve system health');
    }
    return res.json();
  }

  async fetchProviders(signal?: AbortSignal): Promise<ApiResponse<{ providers: any[] }>> {
    const res = await fetch(`${BASE_URL}/api/providers`, { method: 'GET', signal });
    if (!res.ok) {
      throw new Error('Failed to retrieve providers list');
    }
    return res.json();
  }

  async fetchModels(provider: string, signal?: AbortSignal): Promise<ApiResponse<{ provider: string; models: string[] }>> {
    const res = await fetch(`${BASE_URL}/api/models?provider=${encodeURIComponent(provider)}`, { method: 'GET', signal });
    if (!res.ok) {
      throw new Error(`Failed to retrieve models list for provider '${provider}'`);
    }
    return res.json();
  }

  async generateProjects(
    input: ProjectGenerationInput & { providerOverride?: string; modelOverride?: string },
    signal?: AbortSignal
  ): Promise<ApiResponse<ProjectGenerationResponse>> {
    const res = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(input),
      signal
    });

    const data = await res.json().catch(() => ({ success: false, message: 'Invalid server response' }));
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'Generation failed on backend');
    }
    return data;
  }
}

export const apiService = new ApiService();
