import Typography from '@/Atoms/Typography/Typography';
import React, { FC } from 'react';

interface ModalHeaderProps {
  heading: string;
}

const ModalHeader: FC<ModalHeaderProps> = ({ heading }) => {
  return (
    <Typography level={4} className="w-full h-[15%] bg-whatsapp-default-primary_green flex place-items-center px-4">
      {heading}
    </Typography>
  );
};

export default ModalHeader;
