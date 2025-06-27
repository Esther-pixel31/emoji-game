import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async () => {
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

  const fetchWithAutoRefresh = async (path, options = {}) => {
    let res = await fetch(`/api${path}`, {
      ...options,
      credentials: 'include',
    });

    if (res.status === 401) {
      // Try to refresh token
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

  const fetchMe = async () => {
    try {
      const res = await fetchWithAutoRefresh('/me');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Fetch /me failed:', err);
    }
    return null;
  };

  const fetchProfile = async () => {
    try {
      const res = await fetchWithAutoRefresh('/profile');
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.error('Fetch /profile failed:', err);
    }
    return null;
  };

  const updatePoints = async (points) => {
    try {
      const res = await fetchWithAutoRefresh('/update-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const updateProfile = async (updates) => {
    try {
      const res = await fetchWithAutoRefresh('/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        await fetchUser(); // Refresh base user data
        return true;
      } else {
        console.error('Failed to update profile');
      }
    } catch (err) {
      console.error('Update profile error:', err);
    }
    return false;
  };

  const deleteAccount = async () => {
    try {
      const res = await fetchWithAutoRefresh('/delete-account', {
        method: 'DELETE',
      });

      if (res.ok) {
        setUser(null);
        return true;
      } else {
        console.error('Failed to delete account');
      }
    } catch (err) {
      console.error('Delete account error:', err);
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        fetchUser,
        fetchMe,
        fetchProfile,
        fetchWithAutoRefresh,
        updatePoints,
        updateProfile,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
