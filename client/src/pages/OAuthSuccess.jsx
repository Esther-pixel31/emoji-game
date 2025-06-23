import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const token = params.get('token');
    const username = params.get('user');

    if (token && username) {
      login({ username, token, points: 0 });
      localStorage.setItem('auth_token', token);
      toast.success(`Welcome, ${username}!`);
      navigate('/');
    } else {
      toast.error('OAuth login failed');
      navigate('/');
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-muted">Logging you in via Google...</p>
    </div>
  );
}
