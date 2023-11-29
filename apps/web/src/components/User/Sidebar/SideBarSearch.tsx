import SearchInput from '@/Atoms/Input/SearchInput';
import React from 'react';
import OptionIcon from './OptionIcon';

const SideBarSearch = () => {
  return (
    <div className="px-3 bg-white dark:bg-whatsapp-dark-bg flex place-items-center justify-between border-b-[1px] border-gray-200 dark:border-white  ">
      <SearchInput placeholder="Search or start a new chat" icon_src="/icons/search.svg" focus_down_icon_src="" full_width />
      <OptionIcon src="/icons/filter.svg" tooltip="unread chat filter" />
    </div>
  );
};

export default SideBarSearch;
