import axios from "axios";

const API_URL = "http://localhost:3000/api/users";

interface TokenResponse {
  token: TokenResponse;
  accessToken: string;
  refreshToken: string;
}

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

class AuthService {
  private static instance: AuthService;

  private constructor() {
    // Set up axios interceptors
    axiosInstance.interceptors.request.use(
      (request) => {
        const accessToken = this.getAccessToken();
        if (accessToken) {
          request.headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return request;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response, // Directly return successful responses.
      async (error) => {
        const originalRequest = error.config;
        if (!error.response) {
          return Promise.reject(error);
        }
        console.log(error.response.status);
        if (error.response.status === 401 && !originalRequest._retry) {
          // const originalRequest._retry = true;
          try {
            const refreshToken = this.getRefreshToken();
            console.log("refresh", refreshToken);
            const response = await axios.post<TokenResponse>(
              `${API_URL}/refresh`,
              { refreshToken: refreshToken }
            );

            console.log("response" + response);
            const { accessToken, refreshToken: newRefreshToken } =
              response.data;
            console.log(accessToken, newRefreshToken);
            // Store the new access and refresh tokens.
            this.setAccessToken(accessToken);
            this.setRefreshToken(newRefreshToken);

            console.log(accessToken, refreshToken);
            // Update the authorization header with the new access token.
            axiosInstance.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${accessToken}`;
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            // Handle refresh token errors by clearing stored tokens and redirecting to the login page.
            console.error("Token refresh failed:", refreshError);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error("No refresh token found.");
      }

      const response = await axios.post<TokenResponse>(`${API_URL}/refresh`, {
        refreshToken,
      });

      this.setAccessToken(response.data.accessToken);
      return response.data.accessToken;
    } catch (error) {
      throw new Error("Failed to refresh token.");
    }
  }

  public async login(email: string, password: string): Promise<void> {
    try {
      const response = await axios.post<TokenResponse>(`${API_URL}/login`, {
        email,
        password,
      });

      this.setTokens(response.data.token as TokenResponse);
    } catch (error) {
      console.error(error);
    }
  }

  public logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  }

  private setAccessToken(accessToken: string) {
    localStorage.setItem("accessToken", accessToken);
  }

  private setRefreshToken(refreshToken: string) {
    localStorage.setItem("refreshToken", refreshToken);
  }

  private setTokens(tokens: TokenResponse) {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }

  private getAccessToken(): string | null {
    return localStorage.getItem("accessToken");
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem("refreshToken");
  }
}

export default AuthService.getInstance();
