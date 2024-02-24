'use client';
import { cn } from '@/utils/cn';
import { VariantProps, cva } from 'class-variance-authority';
import React, { ForwardRefRenderFunction } from 'react';

export interface InputProps
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        VariantProps<typeof InputProps>,
        VariantProps<typeof InputLabelVariants> {
    label?: string;
    full_width?: boolean;
    error?: boolean;
    error_message?: string;
}

const InputProps = cva(
    [
        'bg-whatsapp-light-input_bg  placeholder:text-whatsapp-light-placeholder_text rounded-md text-whatsapp-dark-primary_bg placeholder:text-sm',
        'outline-none',
        'dark:bg-whatsapp-dark-input_bg placeholder:dark:text-whatsapp-dark-placeholder_text dark:text-whatsapp-light-primary_bg',
        'rounded-full border-[1px] border-whatsapp-misc-whatsapp_primary_green_light'
    ],
    {
        variants: {
            inputsize: {
                small: 'text-base px-2 py-1 ',
                medium: 'text-lg px-2 py-1',
                large: 'text-lg px-3 py-3 ',
            },
        },
        defaultVariants: {
            inputsize: 'small',
        },
    }
);

const InputLabelVariants = cva(['text-base flex flex-col justify-center text-whatsapp-light-text dark:text-whatsapp-dark-text'], {
    variants: {
        labelTextSize: {
            small: 'text-xs',
            large: 'text-lg',
            medium: 'text-base',
        },
    },
    defaultVariants: {
        labelTextSize: 'medium',
    },
});

const Input: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
    { className, label, error, error_message, full_width, labelTextSize, ...props },
    ref
) => {
    return (
        <div>
            <label
                htmlFor={props.id}
                className={cn(
                    InputLabelVariants({
                        labelTextSize: labelTextSize,
                        className: className,
                    })
                )}
            >
                {label}
            </label>
            <input
                id={props.id}
                autoComplete="true"
                ref={ref}
                {...props}
                className={cn(
                    InputProps({
                        inputsize: props.inputsize,
                        className: `mt-1 ${full_width ? 'w-full' : ''} ${error ? 'mb-2' : ''} ${
                            error ? 'outline-red-500' : 'outline-whatsapp-default-primary_green outline-'
                        } ${className}`,
                    })
                )}
            />
            {error ? <span className="text-red-500 text-xs whitespace-pre-line">{error_message}</span> : null}
        </div>
    );
};

export default React.forwardRef(Input);
