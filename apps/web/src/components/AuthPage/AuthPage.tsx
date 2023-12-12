'use client';
import Button from '@/Atoms/Button/Button';
import Input from '@/Atoms/Input/Input';
import Typography from '@/Atoms/Typography/Typography';
import { LoginSchema, LoginSchemaType, RegisterSchema, RegisterSchemaType } from '@/schema/authSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormLayout from './FormLayout';
import { useRouter } from 'next/navigation';
import { Mutation } from '@/utils/fetcher';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import { RegisterUserDto } from '@server/modules/user/DTO/user.dto';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
  });

  const handleLogin = async (data: LoginSchemaType) => {
    try {
      setIsLoading(true);
      await Mutation('auth/login', data).then(async () => {
        setTimeout(() => {
          router.push('/user');
        }, 1500);
      });
      toast.success('Login successful', { position: 'top-right' });
    } catch (error) {
      toast.error(((error as AxiosError<{ message: string }>).response?.data.message as string) || 'Login failed', {
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout className="lg:grid lg:grid-cols-2">
      {/* Login */}

      <form
        className="relative p-4 w-full md:w-[80%] mx-auto h-full  md:max-h-[90%] mt-0 md:mt-10 flex flex-col gap-2 bg-pattern bg-opacity-0"
        onSubmit={handleSubmit(handleLogin)}
      >
        <span className="absolute  inset-0 dark:bg-black dark:bg-opacity-50 " />
        <div className="p-4 w-full md:w-[80%] mx-auto max-h-[90%] mt-0 md:mt-10 flex flex-col gap-2 dark:bg-black z-10">
          <Input
            inputsize={'large'}
            placeholder="Enter Your Email"
            type="email"
            full_width
            label="Email"
            {...register('email')}
            error={errors.email?.message ? true : false}
            error_message={errors.email?.message}
          />
          <Input
            inputsize={'large'}
            placeholder="Enter Your Password"
            type="password"
            full_width
            label="Password"
            {...register('password')}
            error={errors.password?.message ? true : false}
            error_message={errors.password?.message}
          />
          <Typography className="mt-2">
            New to Whatsapp? <Link href={'/auth/register'}>Register</Link>
          </Typography>
          <Button color_variant={'primary'} size={'lg'} className="mt-1" type="submit" loading={isLoading}>
            Login
          </Button>
        </div>
      </form>
      <div className="col-span-1 rounded-lg hidden lg:flex place-items-center justify-center ">
        <div className="">
          <Image
            src={'/icons/web.svg'}
            width={500}
            height={500}
            alt="bg"
            style={{ objectFit: 'cover', objectPosition: 'right' }}
            className="text-black rounded-e-lg"
          />
        </div>
      </div>
    </FormLayout>
  );
};

export const RegisterForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    defaultValues: {},
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(RegisterSchema),
  });

  const handleRegister = async (data: RegisterSchemaType) => {
    try {
      setIsLoading(true);
      await Mutation<RegisterUserDto>('auth/register', data).then(() => {
        setTimeout(() => {
          router.push('/auth/otp');
        }, 1500);
      });
      toast.success('Registration successful', { position: 'top-right' });
    } catch (error) {
      toast.error(((error as AxiosError<{ message: string }>).response?.data.message as string) || 'Registration failed', {
        position: 'top-right',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FormLayout className="lg:grid lg:grid-cols-2">
      {/* Registration */}
      <form
        className="relative p-4 w-full md:w-[80%] mx-auto h-full  md:max-h-[90%] mt-0 md:mt-10 flex flex-col gap-2 bg-pattern bg-opacity-0"
        onSubmit={handleSubmit(handleRegister)}
        noValidate
      >
        <span className="absolute  inset-0 dark:bg-black dark:bg-opacity-50 " />
        <div className="p-4 w-full md:w-[80%] mx-auto max-h-[90%] mt-0 md:mt-10 flex flex-col gap-2 dark:bg-black z-10">
          <Typography level={4} bold className="mb-4">
            Register for Account
          </Typography>
          <Input
            inputsize={'large'}
            placeholder="Enter Your Name"
            type="text"
            full_width
            label="Name"
            {...register('name')}
            error={errors.name?.message ? true : false}
            error_message={errors.name?.message}
          />
          <Input
            inputsize={'large'}
            placeholder="Enter Your Email"
            type="email"
            full_width
            label="Email"
            {...register('email')}
            error={errors.email?.message ? true : false}
            error_message={errors.email?.message}
          />
          <Input
            inputsize={'large'}
            placeholder="Enter Your username"
            type="text"
            full_width
            label="Username"
            {...register('username')}
            error={errors.username?.message ? true : false}
            error_message={errors.username?.message}
          />
          <Input
            inputsize={'large'}
            placeholder="Enter Your Password"
            type="password"
            full_width
            label="Password"
            {...register('password')}
            error={errors.password ? true : false}
            error_message={errors.password?.message}
          />
          <Typography level={2}>
            Have an Account? <Link href={'/auth/login'}>Login</Link>
          </Typography>
          <Button color_variant={'primary'} size={'lg'} className="mt-1" type="submit" loading={isLoading}>
            Register
          </Button>
        </div>
      </form>
      <div className="col-span-1 rounded-lg hidden lg:flex place-items-center justify-center ">
        <div className="">
          <Image
            src={'/icons/web.svg'}
            width={500}
            height={500}
            alt="bg"
            style={{ objectFit: 'cover', objectPosition: 'right' }}
            className="text-black rounded-e-lg"
          />
        </div>
      </div>
    </FormLayout>
  );
};
