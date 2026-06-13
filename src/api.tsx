const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';


let isRefreshing = false;
let failedQueue: Array<{ resolve: (value: string) => void, reject: (reason?: any) => void }> = [];

const processQueue = (error: Error | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token as string);
    }
  });
  failedQueue = [];
};

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  let token = localStorage.getItem('jwt');
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const fullUrl = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
  let response = await fetch(fullUrl, { ...options, headers });

  if (!response.ok) {
    // --- 401 UNAUTHORIZED (TOKEN EXPIRED) ---
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refreshToken');

      if (!refreshToken) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userRole');
        window.location.href = '/login';
        throw new Error("No refresh token available");
      }

      // If no one else is refreshing, lock the door and do it
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const refreshResponse = await fetch(`${BASE_URL}/api/auth/refresh-user`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshResponse.ok) {
            throw new Error("Refresh token rejected by server");

          }

          const data = await refreshResponse.json();
          const newJwt = data.jwtToken; 

          localStorage.setItem('jwt', newJwt);
          headers.set('Authorization', `Bearer ${newJwt}`);
          processQueue(null, newJwt);

          // Retry the original request
          response = await fetch(fullUrl, { ...options, headers });

        } catch (err) {
        
          processQueue(err as Error, null);
          localStorage.removeItem('jwt');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userRole');
          window.location.href = '/login';
          throw err;
        } finally {
          isRefreshing = false;
        }
      } 
      else {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
        .then((newToken) => {
          headers.set('Authorization', `Bearer ${newToken}`);
          return fetch(fullUrl, { ...options, headers });
        })
        .then(async (retryResponse) => {
          const rawText = await retryResponse.text();
          if (!rawText) return null;
          return JSON.parse(rawText);
        });
      }
    }
    else if (response.status === 403) {
      localStorage.removeItem('jwt');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userRole');
      const publicRoutes = ['/login', '/register'];
      if (!publicRoutes.includes(window.location.pathname)) {
        window.location.href = '/login'; 
      }
      throw new Error(`API Error: ${response.status}`);
    }
    else {
      throw new Error(`API Error: ${response.status}`);
    }
  }
  const rawText = await response.text();
  if (!rawText) return null;

  try {
    return JSON.parse(rawText);
  } catch (error) {
    console.error(`CRITICAL: Failed to parse JSON from ${endpoint}.`, rawText);
    throw new Error("Invalid JSON response from server.");
  }
}