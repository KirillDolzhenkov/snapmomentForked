import React, { ReactNode } from 'react';

import MoreHorizontalOutline from '@/../public/assets/components/MoreHorizontalOutline';
import defaultAvatar from '@/../public/question-avatar.png';
// import { MeResponse } from '@/features/auth/services/auth.types';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { clsx } from 'clsx';
import { StaticImageData } from 'next/image';

import s from './DropDownWrapper.module.scss';

import { MeResponse } from '../../api/common/model/api.types';
import { Typography } from '../typography/Typography';

type DropdownMenuDemoProps = {
  children: ReactNode;
  className?: string;
  data?: MeResponse;
  icon?: StaticImageData | string;
  type: 'head' | 'menu';
};

export const DropDownWrapper = (props: DropdownMenuDemoProps) => {
  const { children, className, data, icon, type } = props;

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label={'Customise options'} className={s.IconButton}>
          {type === 'head' ? (
            <img
              alt={''}
              className={clsx(s.dropdownHeaderImg, className)}
              src={typeof icon === 'string' ? icon : icon?.src || data?.userName || defaultAvatar.src}
            />
          ) : (
            <MoreHorizontalOutline className={s.dropdownHeaderImg} style={{ height: '25px', width: '25px' }} />
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={type === 'menu' ? s.DropdownMenuContentForMenu : s.DropdownMenuContent}
          sideOffset={5}
        >
          {type === 'head' && (
            <div className={s.header}>
              <img alt={''} src={typeof icon === 'string' ? icon : icon?.src || data?.userName || defaultAvatar.src} />
              <div>
                <Typography className={s.dropdownTextHeader} variant={'regular_text_16'}>
                  {data?.userName ?? 'JohnDoe'}
                </Typography>
                <Typography className={s.dropdownTextHeader} variant={'small_text'}>
                  {data?.email ?? 'john_doe@mail.ru'}
                </Typography>
              </div>
            </div>
          )}

          {React.Children.toArray(children).map((child, index) => (
            <React.Fragment key={index}>
              {type === 'menu' && index !== 0 && <DropdownMenu.Separator className={s.DropdownMenuSeparator} />}
              {type === 'head' && <DropdownMenu.Separator className={s.DropdownMenuSeparator} />}
              {child}
            </React.Fragment>
          ))}

          <DropdownMenu.Arrow className={s.DropdownMenuArrow} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};
