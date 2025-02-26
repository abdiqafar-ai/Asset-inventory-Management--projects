import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000/api"; // Flask Backend URL

class ApiService {
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
      headers: { "Content-Type": "application/json" },
    });

    this.accessToken = sessionStorage.getItem("access_token");
    this.refreshToken = sessionStorage.getItem("refresh_token");

    this.setupInterceptors();
  }

  // Store Tokens Securely
  storeTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("refresh_token", refreshToken);
  }

  // Clear Tokens on Logout or Expiry
  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
  }

  // Setup Axios Interceptors for Authentication
  setupInterceptors() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const refreshed = await this.refreshAccessToken();
          if (refreshed) {
            return this.axiosInstance(originalRequest); // Retry with new token
          } else {
            this.clearTokens();
            window.location.href = "/login"; // Redirect to login if refresh fails
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Refresh Access Token
  async refreshAccessToken() {
    if (!this.refreshToken) return false;

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: this.refreshToken,
      });

      if (response.status === 200) {
        const { access_token } = response.data;
        this.storeTokens(access_token, this.refreshToken);
        return true;
      }
    } catch (error) {
      console.error("Token refresh failed", error);
    }
    return false;
  }

  // Generic API Request Method
  async request(method, endpoint, data = null, params = null) {
    try {
      const response = await this.axiosInstance({
        method,
        url: endpoint,
        data,
        params,
      });
      return response.data;
    } catch (error) {
      console.error(`API ${method} request to ${endpoint} failed:`, error);
      throw error;
    }
  }

  // GET Request
  async get(endpoint, params = null) {
    return this.request("get", endpoint, null, params);
  }

  // POST Request
  async post(endpoint, data) {
    return this.request("post", endpoint, data);
  }

  // PUT Request
  async put(endpoint, data) {
    return this.request("put", endpoint, data);
  }

  // DELETE Request
  async delete(endpoint) {
    return this.request("delete", endpoint);
  }

  // Logout Request
  async logout() {
    try {
      await this.post("/auth/logout");
      this.clearTokens();
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
}

// Export a Singleton Instance
const apiService = new ApiService();
export default apiService;
