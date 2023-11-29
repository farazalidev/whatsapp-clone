'use client';
import React, { FC } from 'react';
import { Transition, TransitionRootProps } from '@headlessui/react';

const InitTransition: FC<TransitionRootProps<'div'>> = ({ children }) => {
    return (
        <Transition
            as="div"
            enter="transition-opacity duration-75"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            show
        >
            {children}
        </Transition>
    );
};

export default InitTransition;
