// CircularProgressBar.js
import React, { FC, useEffect } from "react";
import { useAnimation, motion } from 'framer-motion';
import Image from "next/image";


interface ICircularProgressBar {
  percentage: number
  loading: boolean
}

const CircularProgressBar: FC<ICircularProgressBar> = ({ percentage, loading }) => {
  const circleControl = useAnimation();

  // Trigger the animation whenever the percentage changes
  useEffect(() => {
    circleControl.start({ strokeDashoffset: 285 - (285 * percentage) / 100 });

  }, [circleControl, percentage])

  return (
    <div className="w-14 h-14 relative bg-black rounded-full bg-opacity-70 flex justify-center place-items-center z-10">
      {loading ?
        <Image src={'/icons/spinner.svg'} height={50} width={50} alt="spinner" /> :

        <motion.svg
          viewBox="0 0 100 100"
          className="absolute top-0 left-0 w-full h-full"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#00a884"
            strokeWidth="10"
            strokeDasharray={285}
            strokeDashoffset={285} // Initial value before animation
            animate={circleControl}
          />
        </motion.svg>}

    </div>
  );
};

export default CircularProgressBar;
