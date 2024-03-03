'use client';
import React, { FC, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';
import { SideBarUserCardOptionsArray } from '@/data/SideBarUserCardOptionsData';
import OptionIcon from './OptionIcon';

interface SideBarUserCardOptionsProps {}

const SideBarUserCardOptions: FC<SideBarUserCardOptionsProps> = ({ ...props }) => {
  return (
    <span {...props}>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="flex place-items-center text-sm">
            <OptionIcon src="/icons/down.svg" tooltip="options" height={15} width={15} />
          </Menu.Button>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="dark:bg-whatsapp-dark-secondary_bg absolute right-0 z-10 mt-2 w-56  origin-top-right bg-white shadow-xl focus:outline-none">
            <div className="py-4">
              {SideBarUserCardOptionsArray.map((option, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <span
                      className={cn(
                        active ? 'dark:bg-whatsapp-dark-primary_bg bg-gray-100 text-gray-900 dark:text-white' : 'text-gray-700 dark:text-white ',
                        'block px-6 py-3 text-sm',
                      )}
                    >
                      {option.label}
                    </span>
                  )}
                </Menu.Item>
              ))}
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </span>
  );
};

export default SideBarUserCardOptions;
