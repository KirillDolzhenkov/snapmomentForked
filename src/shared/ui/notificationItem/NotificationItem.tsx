import Close from '@/../public/assets/components/Close';
import { INotificationItem } from '@/shared/api/notifications/notificationsTypes';
import { Button, Typography } from '@/shared/ui';
import { clsx } from 'clsx';

import s from './NotificationItem.module.scss';

type Props = {
  notice: INotificationItem;
  readedNotices: number[];
};

export const NotificationItem = (props: Props) => {
  const {
    notice: { id, isRead, message },
    readedNotices
  } = props;

  const isReadedNotice = readedNotices.includes(id);

  return (
    <div className={s.notification}>
      <div className={s.title}>
        {!isReadedNotice ? (
          <div className={s.newBox}>
            <Typography variant={'bold_text_16'}>New notice!</Typography>
            <Typography className={s.new} variant={'small_text'}>
              New
            </Typography>
          </div>
        ) : (
          <div></div>
        )}
        <Button className={s.closeButton} title={'Clear'} variant={'text'}>
          <Close />
        </Button>
      </div>

      <Typography className={clsx(s.message, isReadedNotice && s.isRead)} variant={'regular_text_14'}>
        {message}
        <div style={{ color: 'red' }}>{` ${isRead}`} </div>
        <div style={{ color: 'green' }}>{` ${isReadedNotice}`} </div>
      </Typography>
      <Typography className={s.time} variant={'small_text'}>
        1 час назад
      </Typography>
    </div>
  );
};
