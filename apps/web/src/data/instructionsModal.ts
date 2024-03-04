import AudioApiNotSupportedModal from '@/components/Misc/instructionModals/AudioApiNotSupportedModal';
import AudioDeviceNotFoundModal from '@/components/Misc/instructionModals/AudioDeviceNotFoundModal';
import AudioDevicePermissionDeniedModal from '@/components/Misc/instructionModals/AudioDevicePermissionDeniedModal';
import { InstructionModalComponentType } from '@/global/features/ModalSlice';
import { FC } from 'react';

interface InstructionModalData {
  name: InstructionModalComponentType;
  component: FC;
}

export const instructionsModalData: InstructionModalData[] = [
  { name: 'Audio Device Not found', component: AudioDeviceNotFoundModal },
  { name: 'Audio Device Not supported', component: AudioApiNotSupportedModal },
  { name: 'Audio device Permission denied', component: AudioDevicePermissionDeniedModal },
];

export function getInstructionModal(name: InstructionModalComponentType) {
  return instructionsModalData.find((modal) => modal.name === name)?.component;
}
