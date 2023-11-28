'use client';
import React from 'react';
import Input from '@/Atoms/Input/Input';

const page = () => {
  return (
    <div className="dark:bg-whatsapp-dark-primary_bg p-4">
      <Input
        inputsize={'medium'}
        label="Email"
        type="email"
        placeholder="Enter your email"
      />
    </div>
  );
};

export default page;
