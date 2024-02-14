// AnimatePresence should be parent
export const profilePreviewAnimation = {
  key: 'profile-preview',
  initial: { right: '-100%' },
  animate: { left: 0, ease: 'ease-in-out' },
  transition: { duration: 0.2, ease: 'easeOut' },
  exit: { right: '-100%', transition: { duration: 0.1 } },
};
