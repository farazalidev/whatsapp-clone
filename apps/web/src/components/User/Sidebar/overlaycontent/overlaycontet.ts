import { FC } from 'react';
import CommunitiesOverlay from './CommunitiesOverlay';
import StatusOverlay from './StatusOverlay';
import ChannelsOverlay from './ChannelsOverlay';
import NewChatOverlay from './AddNewContactOverlay';

interface OverlayContentType {
  heading: string;
  content: FC;
}

export const overlayContent: OverlayContentType[] = [
  { heading: 'Communities', content: CommunitiesOverlay },
  { heading: 'Status', content: StatusOverlay },
  { heading: 'Channels', content: ChannelsOverlay },
  { heading: 'New Chat', content: NewChatOverlay },
];
