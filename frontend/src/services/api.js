const API_URL = process.env.REACT_APP_BACKEND_URL;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API errors
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || error.message || 'Request failed');
  }
  return response.json();
};

// Auth API
export const authAPI = {
  signup: async (email, name, password, avatar = '🧠') => {
    const response = await fetch(`${API_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password, avatar })
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateProfile: async (updates) => {
    const response = await fetch(`${API_URL}/api/user/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    return handleResponse(response);
  }
};

// Progress API
export const progressAPI = {
  sync: async (progressData) => {
    const response = await fetch(`${API_URL}/api/progress/sync`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(progressData)
    });
    return handleResponse(response);
  },

  load: async () => {
    const response = await fetch(`${API_URL}/api/progress/load`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Leaderboard API
export const leaderboardAPI = {
  getLeaderboard: async (limit = 100) => {
    const response = await fetch(`${API_URL}/api/leaderboard?limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Community API
export const communityAPI = {
  createPuzzle: async (puzzleData) => {
    const response = await fetch(`${API_URL}/api/community/puzzles`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(puzzleData)
    });
    return handleResponse(response);
  },

  getPuzzles: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_URL}/api/community/puzzles?${queryString}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getPuzzle: async (puzzleId) => {
    const response = await fetch(`${API_URL}/api/community/puzzles/${puzzleId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  ratePuzzle: async (puzzleId, rating, review = null) => {
    const response = await fetch(`${API_URL}/api/community/puzzles/${puzzleId}/rate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating, review })
    });
    return handleResponse(response);
  },

  likePuzzle: async (puzzleId) => {
    const response = await fetch(`${API_URL}/api/community/puzzles/${puzzleId}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getMyPuzzles: async () => {
    const response = await fetch(`${API_URL}/api/community/my-puzzles`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  deletePuzzle: async (puzzleId) => {
    const response = await fetch(`${API_URL}/api/community/puzzles/${puzzleId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Default export for backward compatibility
const api = {
  get: async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  post: async (url, data) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  put: async (url, data) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  },
  delete: async (url) => {
    const response = await fetch(`${API_URL}${url}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

export default api;
