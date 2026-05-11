import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

const JDOODLE_BASE_URL = '/';

interface JDoodleAuthRequest {
  clientId: string;
  clientSecret: string;
}

interface JDoodleExecuteRequest {
  clientId: string;
  clientSecret: string;
  script: string;
  language: string;
  stdin?: string;
  compileOnly?: boolean;
}

interface JDoodleResponse {
  output?: string;
  statusCode?: number;
  memory?: string;
  cpuTime?: string;
  error?: string;
}

export interface JDoodleService {
  authenticate(): Promise<JDoodleResponse>;
  executeCode(params: Omit<JDoodleExecuteRequest, 'clientId' | 'clientSecret'>): Promise<JDoodleResponse>;
}

class AxiosJDoodleService implements JDoodleService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      // baseURL: JDOODLE_BASE_URL,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async authenticate(): Promise<JDoodleResponse> {
    const response = await this.axiosInstance.post<JDoodleResponse>('/api/jdoodle/auth');

    return this.handleResponse(response);
  }

  async executeCode(params: Omit<JDoodleExecuteRequest, 'clientId' | 'clientSecret'>): Promise<JDoodleResponse> {
    const response = await this.axiosInstance.post<JDoodleResponse>('/api/jdoodle/execute', params);

    return this.handleResponse(response);
  }

  private handleResponse<T>(response: AxiosResponse<T>): T {
    return response.data;
  }
}

export const jdoodleService: JDoodleService = new AxiosJDoodleService();