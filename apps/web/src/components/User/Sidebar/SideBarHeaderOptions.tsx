import React from 'react';
import OptionIcon from './OptionIcon';

const SideBarHeaderOptions = () => {
    return (
        <div className="flex place-items-center gap-4">
            <OptionIcon src="/icons/comminities.svg" tooltip="communities" />
            <OptionIcon src="/icons/status.svg" tooltip="status" />
            <OptionIcon src="/icons/channels.svg" tooltip="channels" />
            <OptionIcon src="/icons/newchat.svg" tooltip="new chat" />
            <OptionIcon src="/icons/option.svg" tooltip="menu" />
        </div>
    );
};

export default SideBarHeaderOptions;
