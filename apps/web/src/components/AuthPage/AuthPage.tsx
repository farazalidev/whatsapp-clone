'use client';
import Button from '@/Atoms/Button/Button';
import Input from '@/Atoms/Input/Input';
import Typography from '@/Atoms/Typography/Typography';
import { LoginSchema, LoginSchemaType, RegisterSchema, RegisterSchemaType } from '@/schema/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import FormLayout from './FormLayout';
import { useLoginApiMutation, useRegisterApiMutation } from '@/global/apis/AuthApi';
import { redirect, useRouter } from 'next/navigation';

export const LoginForm = () => {
  const router = useRouter();

  const [loginUser, { isError, error, isSuccess, isLoading, data }] = useLoginApiMutation();

  useEffect(() => {
    if (isSuccess) {
      router.refresh();
    }
  }, [isSuccess, router]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const handleLogin = async (data: LoginSchemaType) => {
    await loginUser(data);
  };

  return (
    <FormLayout>
      {/* Login */}
      <form className='p-4 w-full md:w-[80%] mx-auto max-h-[90%] mt-0 md:mt-10 flex flex-col gap-2' onSubmit={handleSubmit(handleLogin)}>
        <Typography level={4} bold className='mb-4'>
          Welcome Back
          {isError && error ? <Typography text_style={'error'}>{(error as any)?.data?.message}</Typography> : null}
          {isSuccess ? <Typography text_style={'success'}>{data?.successMessage}</Typography> : null}
        </Typography>
        <Input
          inputsize={'large'}
          placeholder='Enter Your Email'
          type='email'
          full_width
          label='Email'
          {...register('email')}
          error={+!!errors.email?.message ? true : false}
          error_message={errors.email?.message}
        />
        <Input
          inputsize={'large'}
          placeholder='Enter Your Password'
          type='password'
          full_width
          label='Password'
          {...register('password')}
          error={+!!errors.password?.message ? true : false}
          error_message={errors.password?.message}
        />
        <Typography className='mt-2'>
          New to Whatsapp? <Link href={'/auth/register'}>Register</Link>
        </Typography>
        <Button color_variant={'primary'} size={'lg'} className='mt-1' type='submit' loading={isLoading}>
          Login
        </Button>
      </form>
      <div className='col-span-1 relative rounded-lg'>
        <Image
          src={'/bg-1.png'}
          fill
          alt='bg'
          style={{ objectFit: 'cover', objectPosition: 'right' }}
          className='text-black rounded-e-lg'
        />
      </div>
    </FormLayout>
  );
};

export const RegisterForm = () => {
  const router = useRouter();

  const [registerUser, { isError, isLoading, isSuccess, data, error }] = useRegisterApiMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterSchemaType>({
    defaultValues: {},
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(RegisterSchema),
  });

  useEffect(() => {
    if (isSuccess) {
      const timeoutId = setTimeout(() => {
        router.push('/auth/otp');
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [isSuccess]);

  const handleRegister = async (data: RegisterSchemaType) => {
    await registerUser(data);
  };

  return (
    <FormLayout>
      {/* Registration */}
      <form
        className='p-4 w-full md:w-[80%] mx-auto max-h-[90%] mt-0 md:mt-10 flex flex-col gap-2'
        onSubmit={handleSubmit(handleRegister)}
        noValidate
      >
        <Typography level={4} bold className='mb-4'>
          Register for Account
          {isError && error ? <Typography text_style={'error'}>{(error as any)?.data?.message}</Typography> : null}
          {isSuccess ? <Typography text_style={'success'}>{data?.successMessage}</Typography> : null}
        </Typography>
        <Input
          inputsize={'large'}
          placeholder='Enter Your Name'
          type='text'
          full_width
          label='Name'
          {...register('name')}
          error={!!errors.name?.message ? true : false}
          error_message={errors.name?.message}
        />
        <Input
          inputsize={'large'}
          placeholder='Enter Your Email'
          type='email'
          full_width
          label='Email'
          {...register('email')}
          error={!!errors.email?.message ? true : false}
          error_message={errors.email?.message}
        />
        <Input
          inputsize={'large'}
          placeholder='Enter Your username'
          type='text'
          full_width
          label='Username'
          {...register('username')}
          error={!!errors.username?.message ? true : false}
          error_message={errors.username?.message}
        />
        <Input
          inputsize={'large'}
          placeholder='Enter Your Password'
          type='password'
          full_width
          label='Password'
          {...register('password')}
          error={!!errors.password ? true : false}
          error_message={errors.password?.message}
        />
        <Typography level={2}>
          Have an Account? <Link href={'/auth/login'}>Login</Link>
        </Typography>
        <Button color_variant={'primary'} size={'lg'} className='mt-1' type='submit' loading={isLoading}>
          Register
        </Button>
      </form>
      <div className='col-span-1 relative hidden md:block'>
        <Image src={'/bg-1.png'} fill alt='bg' style={{ objectFit: 'cover', objectPosition: 'right' }} className='text-black' />
      </div>
    </FormLayout>
  );
};
