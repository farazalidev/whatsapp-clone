import SearchInput from '@/Atoms/Input/SearchInput';
import React from 'react';
import OptionIcon from './OptionIcon';

const SideBarSearch = () => {
  return (
    <div className="px-3 pb-1 bg-white dark:bg-whatsapp-dark-primary_bg flex gap-2 place-items-center border-b-[1px] border-gray-200  dark:border-none  ">
      <SearchInput
        placeholder="Search or start a new chat"
        icon_src="/icons/search.svg"
        focus_down_icon_src="/icons/backward.svg"
        full_width
      />
      <OptionIcon src="/icons/filter.svg" tooltip="unread chat filter" />
    </div>
  );
};

export default SideBarSearch;
