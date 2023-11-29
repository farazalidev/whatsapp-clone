'use client';
import React, { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface OutInAnimationProps {
    children: ReactNode;
    className: string | undefined;
}

const OutInAnimation: FC<OutInAnimationProps> = ({ children, className }) => {
    return (
        <motion.div
            initial={{ x: -200, opacity: 0, width: '100vw' }}
            animate={{ x: 0, opacity: 1, animationDelay: 'initial' }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default OutInAnimation;
