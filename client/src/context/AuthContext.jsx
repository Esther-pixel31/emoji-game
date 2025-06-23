import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async () => {
    // No need to POST credentials here; UI handles it.
    return await fetchUser();
  };

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setUser(null);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetchWithAutoRefresh('/me');
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        return true;
      }
    } catch (err) {
      console.error('Fetch user failed:', err);
    }

    setUser(null);
    return false;
  };

  const fetchWithAutoRefresh = async (path, options = {}) => {
    let res = await fetch(`/api${path}`, {
      ...options,
      credentials: 'include',
    });

    if (res.status === 401) {
      const refreshRes = await fetch('/api/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (refreshRes.ok) {
        res = await fetch(`/api${path}`, {
          ...options,
          credentials: 'include',
        });
      } else {
        setUser(null);
      }
    }

    return res;
  };

  const updatePoints = async (points) => {
  try {
    const res = await fetchWithAutoRefresh('/update-points', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ points }),
    });

    if (res.ok) {
      const data = await res.json();
      setUser((prev) => ({ ...prev, points: data.points }));
    } else {
      console.error('Failed to update points');
    }
  } catch (err) {
    console.error('Update points error:', err);
  }
};


  return (
    <AuthContext.Provider
      value={{ user, setUser, login, logout, fetchUser, fetchWithAutoRefresh, updatePoints  }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
