// AnimationPresence should be Parent
export const easeInOutAnimation = {
  key: 'overlay',
  initial: { left: '-100%' },
  animate: { left: 0, animation: 'ease-in-out' },
  transition: { duration: 0.3, ease: 'easeOut' },
  exit: { left: '-100%', transition: { duration: 0.1 } },
};
