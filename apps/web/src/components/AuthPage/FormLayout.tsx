import { cn } from '@/utils/cn';
import React, { FC } from 'react';

interface FormLayoutProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: React.ReactNode;
}
const FormLayout: FC<FormLayoutProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        `-mt-20 p-0 w-full md:container bg-whatsapp-light-primary_bg text-whatsapp-light-text h-screen md:h-[60%] min-h-[700px] dark:bg-whatsapp-dark-primary_bg shadow-xl rounded-t-xl lg:rounded-lg ${className}`,
      )}
    >
      {children}
    </div>
  );
};

export default FormLayout;
