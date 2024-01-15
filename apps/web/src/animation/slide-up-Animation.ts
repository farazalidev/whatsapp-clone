// AnimatePresence should be parent
export const slideUpAnimation = {
  key: 'overlay-container',
  initial: { bottom: '-100%' },
  animate: { top: 0, ease: 'ease-in-out' },
  transition: { duration: 0.2, ease: 'easeOut' },
  exit: { bottom: '-100%', transition: { duration: 0.1 } },
};
