const API_BASE_URL = "http://localhost:5000/api";

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function apiClient(endpoint: string, options: ApiOptions = {}) {
  const { method = "GET", body, headers = {} } = options;
  
  // Get token from localStorage
  const token = localStorage.getItem("token");
  
  // Set up headers with auth token
  const requestHeaders: Record<string, string> = {
    ...headers
  };
  
  // Add auth header if token exists
  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }
  
  // Add content-type for JSON requests
  if (body && !(body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }
  
  const config: RequestInit = {
    method,
    headers: requestHeaders,
    credentials: "include",
  };
  
  // Add body if present
  if (body) {
    if (body instanceof FormData) {
      config.body = body;
    } else {
      config.body = JSON.stringify(body);
    }
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle 401 Unauthorized by redirecting to login
    if (response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem("token");
      window.location.href = "/auth";
      throw new Error("Session expired. Please log in again.");
    }
    
    // Parse JSON response
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || "API request failed");
    }
    
    return data;
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}