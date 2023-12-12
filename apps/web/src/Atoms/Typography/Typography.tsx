import { cn } from '@/utils/cn';
import { VariantProps, cva } from 'class-variance-authority';
import React, { FC } from 'react';

const TypographyVariants = cva('text-base text-black opacity-80 dark:text-white', {
  variants: {
    level: {
      1: 'text-xs ',
      2: 'text-base ',
      3: 'text-lg ',
      4: 'text-xl ',
      5: 'text-2xl ',
    },
    text_style: {
      error: ['text-red-600 font-extralight dark:text-red-500', 'p-[2px] w-full text-center rounded-md'],
      success: 'text-green-600 font-extralight dark:text-green-500',
      default: 'text-whatsapp-light-text dark:text-whatsapp-dark-text',
    },
  },
  defaultVariants: {
    level: 2,
    text_style: 'default',
  },
});

interface TypographyProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>,
    VariantProps<typeof TypographyVariants> {
  children: React.ReactNode;
  bold?: boolean;
}

const Typography: FC<TypographyProps> = ({ className, level, text_style, bold, ...props }) => {
  return (
    <div
      className={cn(
        TypographyVariants({
          level: level,
          text_style: text_style,
          className: `${bold ? 'font-bold' : ''} ${className}`,
        }),
      )}
      {...props}
    >
      {props.children}
    </div>
  );
};

export default Typography;
