import { cn } from '@/utils/cn';
import React, { useState } from 'react';
import ModalHeader from './ModalHeader';
import Input from '@/Atoms/Input/Input';
import Button from '@/Atoms/Button/Button';
import Typography from '@/Atoms/Typography/Typography';
import { useForm } from 'react-hook-form';
import { AddNewContactSchemaType, addNewContactSchema } from '@/schema/forms';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSendChatRequestMutation, userApi } from '@/global/apis/UserApi';
import { store } from '@/global/store';
import { TbSend } from 'react-icons/tb';

const AddNewContactModalContent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddNewContactSchemaType>({ resolver: zodResolver(addNewContactSchema) });

  const [searchQueryState, setSearchQueryState] = useState<{ isError: boolean; error: string | null }>({ error: null, isError: false });
  const [foundedUser, setFoundedUser] = useState<string | null>(null);
  const [SearchIsLoading, setSearchIsLoading] = useState(false);

  const handleSearch = async (data: AddNewContactSchemaType) => {
    try {
      setSearchIsLoading(true);
      const user = await store.dispatch(userApi.endpoints.searchUser.initiate({ user_email: data.email })).unwrap();
      console.log('🚀 ~ file: AddNewContactModalContent.tsx:28 ~ handleSearch ~ user:', user);
      setFoundedUser(user.email);
      setSearchQueryState({ error: null, isError: false });
    } catch (error) {
      setSearchQueryState({ error: (error as any).data.message, isError: true });
      console.log(error);
    } finally {
      setSearchIsLoading(false);
    }
  };

  const [sendRequest, { isLoading, error, data, isError }] = useSendChatRequestMutation();
  console.log('🚀 ~ file: AddNewContactModalContent.tsx:41 ~ AddNewContactModalContent ~ data:', data);
  console.log('🚀 ~ file: AddNewContactModalContent.tsx:41 ~ AddNewContactModalContent ~ error:', error);

  const handleSendRequest = async () => {
    if (foundedUser) {
      await sendRequest({ acceptor_email: foundedUser });
    }
  };

  return (
    <div
      className={cn(
        'w-full h-[450px] relative',
        'bg-whatsapp-light-primary_bg dark:bg-whatsapp-dark-primary_bg  ',
        'text-whatsapp-light-text dark:text-whatsapp-dark-text',
      )}
    >
      <ModalHeader heading="Add a new contact" />
      <form className="flex gap-4 flex-col px-10 justify-center py-4" onSubmit={handleSubmit(handleSearch)}>
        {searchQueryState.error ? <Typography text_style={'error'}>{searchQueryState.error}</Typography> : null}
        {isError ? <Typography text_style={'error'}>{(error as any)?.data.message}</Typography> : null}
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
        <div className="flex w-full px-10 py-2 justify-between place-items-center bg-whatsapp-light-secondary_bg dark:bg-whatsapp-dark-secondary_bg">
          <div className="flex flex-col">
            <span>{foundedUser}</span>
            <span className="text-whatsapp-default-primary_green">User Founded</span>
          </div>
          <Button className="flex gap-2 place-items-center justify-center" size={'lg'} onClick={handleSendRequest} loading={isLoading}>
            <TbSend /> <span>Send Request</span>
          </Button>
        </div>
      ) : null}
      <Typography className="font-extralight text-center absolute bottom-4 px-10">
        After Adding the contact, Your request will be sended to requested contact.
      </Typography>
    </div>
  );
};

export default AddNewContactModalContent;
