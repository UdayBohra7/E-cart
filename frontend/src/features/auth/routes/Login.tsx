import { useNavigate } from 'react-router-dom';

import { LoginForm } from '../components/LoginForm';
import { LoginLayout } from '../components/Layout';
import { toast } from 'sonner';
import { useUser } from '@/lib/auth';
import { useEffect } from 'react';

export const Login = () => {
  const navigate = useNavigate();
  const {user } = useUser()


  useEffect(() => {
if (user) {
    navigate('/superadmin');
    toast.error("You are already logged in");
  }

  }, [user])

  
  return (
    <LoginLayout title="Login">
      <LoginForm onSuccess={() => {
        navigate('/admin');
        toast.success("Login successfully");
      }} />
    </LoginLayout>
  );
};
