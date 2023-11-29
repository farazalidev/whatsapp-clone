import React, { ForwardRefRenderFunction, forwardRef } from 'react';
import { InputProps } from './Input';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/utils/cn';
import Image from 'next/image';

interface SearchInputProps
    extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
        VariantProps<typeof InputProps>,
        VariantProps<typeof InputLabelVariants> {
    label?: string;
    full_width?: boolean;
    error?: boolean;
    error_message?: string;
    icon_src: string;
    focus_down_icon_src: string;
}

const InputProps = cva(
    [
        'bg-whatsapp-light-input_bg  placeholder:text-whatsapp-light-placeholder_text rounded-md text-whatsapp-dark-primary_bg ',
        'outline-none',
        'dark:bg-whatsapp-dark-input_bg placeholder:dark:text-whatsapp-dark-placeholder_text dark:text-whatsapp-light-primary_bg',
    ],
    {
        variants: {
            inputsize: {
                small: 'text-base px-2 py-1 ',
                medium: 'text-lg px-2 py-1',
                large: 'text-xl px-3 py-3 ',
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

const SearchInput: ForwardRefRenderFunction<HTMLInputElement, SearchInputProps> = (
    { className, label, error, error_message, full_width, labelTextSize, icon_src, ...props },
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

            <div className="relative flex place-items-center">
                <input
                    id={props.id}
                    autoComplete="true"
                    ref={ref}
                    className={cn(
                        InputProps({
                            inputsize: props.inputsize,
                            className: `mt-1 py-2 pl-16 ${full_width ? 'w-full' : ''} ${error ? 'mb-2' : ''} ${
                                error ? 'outline-red-500' : 'outline-whatsapp-default-primary_green outline-'
                            } ${className}`,
                        })
                    )}
                    {...props}
                />
                <span className="absolute left-[32px] ">
                    <Image src={icon_src} alt="search" width={25} height={25} />
                </span>
            </div>
            {error ? <span className="text-red-500 text-xs whitespace-pre-line">{error_message}</span> : null}
        </div>
    );
};

export default forwardRef(SearchInput);
