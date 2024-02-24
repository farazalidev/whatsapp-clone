'use client';
import React from 'react';
import AuthPageTop from './AuthPageTop';
import { LoginForm } from './AuthPage';

const AuthPageComponent = () => {
  return (
    <div className="flex flex-col">
      <div>
        <AuthPageTop />
      </div>
      <div className="bg-whatsapp-light-primary_bg  text-whatsapp-light-text dark:bg-whatsapp-dark-primary_bg  dark:text-whatsapp-dark-text md:min-h-screen">
        <LoginForm />
      </div>
    </div>
  );
};

export default AuthPageComponent;
