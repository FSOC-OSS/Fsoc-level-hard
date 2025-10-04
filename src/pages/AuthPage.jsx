import { useNavigate } from 'react-router-dom';
import AuthSystem from '../components/auth/AuthSystem';

const AuthPage = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    navigate('/');
  };

  return <AuthSystem onSuccess={handleAuthSuccess} />;
};

export default AuthPage;