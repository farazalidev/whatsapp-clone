import React, { FC, useEffect } from 'react';
import './css/cicularProgressbar.css';
import { motion, useAnimation } from 'framer-motion';
import { IUploadState } from '@/hooks/useUpload';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import { expectedFileTypes } from '../../../../../shared/types/mediaTypes';

interface ProgressBarProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, IUploadState {
  barStyle: 'circle' | 'line';
  /**
   * show the download button when the loading is false and progress is 100%
   */
  showActionButton: boolean;
  messageType: expectedFileTypes | 'text' | undefined;
  onRetryClick?: () => void;
  onPauseClick?: () => void;
  onActionButtonClick?: () => void;
}

const ProgressBar: FC<ProgressBarProps> = ({
  barStyle,
  isLoading,
  progress,
  showActionButton,
  isResumable,
  onPauseClick,
  onRetryClick,
  messageType,
  onActionButtonClick,
  ...props
}) => {
  const circleControl = useAnimation();

  // Trigger the animation whenever the percentage changes
  useEffect(() => {
    if (progress) circleControl.start({ strokeDashoffset: 285 - (285 * progress) / 100 });
  }, [circleControl, progress]);

  return barStyle === 'circle' ? (
    <div className={cn([`relative flex h-12 w-12 place-items-center justify-center rounded-full z-10`, [showActionButton && messageType === "video" ? `bg-opacity-70 bg-black` : showActionButton && messageType === "image" ? null : messageType === "others" ? 'bg-opacity-40 bg-black' : null], props.className])}>
      {/* cancel button */}
      {progress && progress < 94 && !isResumable ? (
        <span onClick={onPauseClick} className="z-10 cursor-pointer">
          <Image src={'/icons/cross.svg'} height={25} width={25} alt="cancel" />
        </span>
      ) : null}

      {/* resume button */}
      {isResumable && !isLoading ? (
        <span onClick={onRetryClick} className="z-10 cursor-pointer">
          <Image src={'/icons/upload.svg'} height={25} width={25} alt="retry" />
        </span>
      ) : null}

      {/* action button */}
      {showActionButton && progress === 100 && !isLoading ? (
        <span onClick={onActionButtonClick} className="z-10 cursor-pointer">
          {messageType === 'others' ? (
            <Image src={'/icons/gallery-icons/download.svg'} alt="download" height={25} width={25} />
          ) : messageType === 'video' ? (
            <Image src={'/icons/play.svg'} alt="play" height={25} width={25} />
          ) : null}
        </span>
      ) : null}

      {isLoading ? (
        <div role="status">
          <svg
            aria-hidden="true"
            className="h-12 w-12 animate-spin fill-white text-gray-500 dark:text-gray-500"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      ) : progress && progress < 100 ? (
        <motion.svg viewBox="0 0 100 100" className="absolute left-0 top-0 h-full w-full">
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#00a884"
            strokeWidth="5"
            strokeDasharray={285}
            strokeDashoffset={285} // Initial value before animation
            animate={circleControl}
          />
        </motion.svg>
      ) : null}
    </div>
  ) : (
    <div {...props}>
      <progress value={progress} max={100} />
    </div>
  );
};

export default ProgressBar;
