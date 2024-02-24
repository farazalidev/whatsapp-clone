import { cn } from '@/utils/cn';
import { VariantProps, cva } from 'class-variance-authority';
import React, { ForwardRefRenderFunction, forwardRef } from 'react';

interface ButtonProps
  extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  children: React.ReactNode;
  loading?: boolean;
}
const ButtonVariants = cva(
  'px-2 py-[2px] rounded-full text-white transition-colors duration-200 bg-whatsapp-default-primary_green disabled:bg-opacity-60 whitespace-nowrap',
  {
    variants: {
      size: {
        sm: 'text-xs font-extralight px-1 h-7',
        md: 'text-sm font-extralight px-2 h-8',
        lg: 'text-sm h-9',
      },
      color_variant: {
        primary: 'bg-whatsapp-default-primary_green text-white',
        secondary:
          'bg-whatsapp-light-secondary_bg text-whatsapp-light-text border-[1px] border-gray-800 dark:bg-whatsapp-dark-secondary_bg dark:text-whatsapp-dark-text',
      },
    },
    defaultVariants: {
      size: 'sm',
      color_variant: 'primary',
    },
  },
);

const Button: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = ({ children, loading, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cn(ButtonVariants({ size: props.size, color_variant: props.color_variant, className: props.className }))}
      disabled={loading}
    >
      {loading ? (
        <div className="flex place-items-center justify-center gap-2">
          <div role="status">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              viewBox="0 0 24 24"
              stroke-linecap="round"
              stroke-linejoin="round"
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin w-6 h-6 stroke-white"
            >
              <path d="M12 3v3m6.366-.366-2.12 2.12M21 12h-3m.366 6.366-2.12-2.12M12 21v-3m-6.366.366 2.12-2.12M3 12h3m-.366-6.366 2.12 2.12"></path>
            </svg>
          </div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

Button.displayName = 'Button';

export default forwardRef(Button);
