'use client';
import React, { FC, Fragment } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import { Menu, Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';
import { SideBarUserCardOptionsArray } from '@/data/SideBarUserCardOptionsData';

interface SideBarUserCardOptionsProps {}

const SideBarUserCardOptions: FC<SideBarUserCardOptionsProps> = ({ ...props }) => {
  return (
    <span className="" {...props}>
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="text-sm">
            <IoIosArrowDown size={22} className="text-gray-500" />
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
          <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right  bg-white dark:bg-whatsapp-dark-secondary_bg shadow-xl focus:outline-none">
            <div className="py-4">
              {SideBarUserCardOptionsArray.map((option, index) => (
                <Menu.Item key={index}>
                  {({ active }) => (
                    <span
                      className={cn(
                        active
                          ? 'bg-gray-100 text-gray-900 dark:bg-whatsapp-dark-primary_bg dark:text-white'
                          : 'text-gray-700 dark:text-white ',
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
