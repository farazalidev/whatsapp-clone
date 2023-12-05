'use client';
import React from 'react';
import AuthPageTop from './AuthPageTop';
import { usePathname } from 'next/navigation';
import { LoginForm, RegisterForm } from './AuthPage';
import OtpVerification from './OtpVerification';
import CompleteProfile from './CompleteProfile';

const AuthPageComponent = () => {
  const path = usePathname();
  const authPaths = { login: '/auth/login', register: '/auth/register', otp: '/auth/otp', profile: 'auth/completeprofile' };
  return (
    <div className="flex flex-col">
      <div>
        <AuthPageTop />
      </div>
      <div className="bg-whatsapp-light-primary_bg  text-whatsapp-light-text md:min-h-screen  dark:bg-whatsapp-dark-primary_bg dark:text-whatsapp-dark-text">
        {path === authPaths.login ? (
          <LoginForm />
        ) : path === authPaths.register ? (
          <RegisterForm />
        ) : path === authPaths.otp ? (
          <OtpVerification />
        ) : (
          <CompleteProfile />
        )}
      </div>
    </div>
  );
};

export default AuthPageComponent;
