import { cn } from '@/utils/cn';
import React, { useState } from 'react';
import ModalHeader from './ModalHeader';
import Input from '@/Atoms/Input/Input';
import Button from '@/Atoms/Button/Button';
import Typography from '@/Atoms/Typography/Typography';
import { useForm } from 'react-hook-form';
import { AddNewContactSchemaType, addNewContactSchema } from '@/schema/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mutation, fetcher } from '@/utils/fetcher';
import { searchUserResponse } from '@server/Misc/successTypes/userSuccess.types';
import RequestCard from '@/Atoms/Cards/RequestCard';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { mutate } from 'swr';

const AddNewContactModalContent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddNewContactSchemaType>({ resolver: zodResolver(addNewContactSchema) });

  const [searchQueryState, setSearchQueryState] = useState<{ isError: boolean; error: string | null }>({ error: null, isError: false });
  const [foundedUser, setFoundedUser] = useState<searchUserResponse | undefined>(undefined);
  const [SearchIsLoading, setSearchIsLoading] = useState(false);

  const handleSearch = async (data: AddNewContactSchemaType) => {
    try {
      setSearchIsLoading(true);
      await fetcher<searchUserResponse>(`/user/search-user/${data.email}`).then(async (data) => {
        setFoundedUser({ ...data });
      });
      setSearchQueryState({ error: null, isError: false });
    } catch (error) {
      setSearchQueryState({ error: (error as any).data?.message, isError: true });
      setFoundedUser(undefined);
      toast.error((error as AxiosError<{ message: string }>).response?.data.message || 'Internal Server Error', { position: 'top-right' });
    } finally {
      setSearchIsLoading(false);
    }
  };

  const handleSendRequest = async () => {
    if (foundedUser) {
      try {
        await Mutation(`user/add-contact/${foundedUser.user_id}`, undefined);
        await mutate('api/contacts');
        toast.success('Contact Added!', { position: 'top-right' });
      } catch (error) {
        toast.error((error as AxiosError<{ message: string }>).response?.data.message || 'Internal Server Error', {
          position: 'top-right',
        });
      }
    }
  };

  return (
    <div
      className={cn(
        'relative h-[450px] w-full',
        'bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-primary_bg  ',
        'text-whatsapp-light-text dark:text-whatsapp-dark-text',
      )}
    >
      <ModalHeader heading="Add a new contact" />
      <form className="flex flex-col justify-center gap-4 px-10 py-4" onSubmit={handleSubmit(handleSearch)}>
        {searchQueryState.error ? <Typography text_style={'error'}>{searchQueryState.error || 'Internal Server Error'}</Typography> : null}
        {/* {isError ? <Typography text_style={'error'}>{(error as any)?.data.message || 'Internal Server Error'}</Typography> : null} */}
        <Input
          placeholder="Search contact"
          inputsize={'medium'}
          full_width
          label="Contact email"
          {...register('email')}
          error={!!errors.email?.message}
          error_message={errors.email?.message}
        />
        <Button color_variant={'secondary'} size={'md'} type="submit" loading={SearchIsLoading}>
          Search
        </Button>
      </form>
      {foundedUser ? (
        <div className="mx-4">
          <RequestCard name={foundedUser?.name} user_id={foundedUser.user_id} for_other onButtonClick={handleSendRequest} />
        </div>
      ) : null}

      <Typography className="absolute bottom-4 px-10 text-center font-extralight">
        After Adding the contact, Your request will be sended to requested contact.
      </Typography>
    </div>
  );
};

export default AddNewContactModalContent;
