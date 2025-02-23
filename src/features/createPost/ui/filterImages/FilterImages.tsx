// @flow
import * as React from 'react';
import { useEffect, useState } from 'react';

import { photoFilters } from '@/entities';
import { useAppDispatch, useAppSelector } from '@/shared/lib';
import { Typography } from '@/shared/ui';
import { clsx } from 'clsx';

import s from './FilterImages.module.scss';

import { createImage } from '../../lib/cropImage';
import { createPostActions, createPostSelectors } from '../../service/createPostSlice';
import { CreatePostImgProps } from '../../service/createPostSliceTypes';

type Props = {
  className?: string;
  imgIndex: number;
};

/**
 * Компонента для применения фильтров к выбранному кроппированному изображению
 * @description Есть заранее заготовленная переменная с фильтрами. Тут мы прокидываем открытый индекс изображения (от карусели). При клике на изображение в области фильтров, применяем трансформацию к выбранному изображению (к обрезанному) из стейта НО ТОЛЬКО ДЛЯ buferUrl (не url и не originalUrl).
 * @description Для обновления фильров картинки ИСПОЛЬЗУЕМ useEffect потому что функция сохранения картинки с фильтром асинхронная и чтобы обеспечить моментальное ее срабатывание, делаем useEffect. Когда не использовал, картинка обновляляась только на второй клик.
 * @param {number} props.imgIndex - индекс выбранного изображения (от карусели)
 */
export const FilterImages = (props: Props) => {
  const { className, imgIndex } = props;
  const dispatch = useAppDispatch();
  const allPostImages = useAppSelector(createPostSelectors.allPostImages);
  const [selectedFilter, setSelectedFilter] = useState<string>(allPostImages[imgIndex]?.filter || 'none'); // Инициализируем на основе фильтра изображения

  async function transformImage(img: CreatePostImgProps) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const modifiedImage = await createImage(img.url as string); // Тут без разницы, url или buferUrl потому что на этапе кроппирования мы сохранили обрезку как в url, так и в buferUrl. То есть что url, что buferUrl - значения не имеет

    canvas.width = modifiedImage.width;
    canvas.height = modifiedImage.height;

    ctx?.drawImage(modifiedImage, 0, 0, modifiedImage.width, modifiedImage.height);

    if (ctx) {
      ctx.filter = img.filter;
    }

    ctx?.drawImage(modifiedImage, 0, 0, modifiedImage.width, modifiedImage.height);

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob((result) => resolve(result), 'image/jpeg'));

    const objectUrl = blob ? URL.createObjectURL(blob) : null;

    return {
      croppedAreaPx: img.croppedAreaPx,
      id: img.id,
      url: objectUrl
    };
  }

  // ИСПОЛЬЗУЕМ useEffect потому что функция сохранения картинки с фильтром асинхронная и чтобы обеспечить моментальное ее срабатывание, делаем useEffect
  // Когда не использовал, картинка обновляляась только на второй клик.
  useEffect(() => {
    // if (selectedFilter !== 'none') {
    const img = allPostImages[imgIndex];

    transformImage(img).then((transformedImage) => {
      dispatch(createPostActions.setFinalBuferImg({ imgIndex, transformedImage }));
    });
    // }
  }, [selectedFilter]);

  // Синхронизация selectedFilter с изменениями imgIndex
  useEffect(() => {
    setSelectedFilter(allPostImages[imgIndex]?.filter || 'none'); // Обновляем фильтр при смене изображения
  }, [imgIndex, allPostImages]);

  const handleFilterChange = (style: string) => {
    setSelectedFilter(style);
    // Сохраняем значение фильтра в стейте на всякий случай
    dispatch(createPostActions.setFilter({ imgFilter: style, imgIndex }));
  };

  return (
    <div className={s.container}>
      {photoFilters.map((filter) => {
        const isSelected = selectedFilter === filter.style;

        return (
          // <div className={s.wrapper} key={filter.name}>
          <div key={filter.name}>
            {/* ! Использую не <Image, а img, иначе ошибка гидрации в консоли, или с параметром suppressHydrationWarning*/}
            <img
              alt={`Photo # ${imgIndex}`}
              className={clsx(s.image, isSelected ? s.active : '')}
              height={100}
              onClick={() => handleFilterChange(filter.style)}
              src={allPostImages[imgIndex].url}
              style={{ filter: filter.style }}
              width={100}
            />
            <Typography className={s.text} variant={'regular_text_16'}>
              {filter.name}
            </Typography>
          </div>
        );
      })}
    </div>
  );
};
