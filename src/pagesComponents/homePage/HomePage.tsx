import React, { MutableRefObject, useCallback, useEffect, useRef, useState } from 'react';

import { useLazyGetPublicPostsQuery } from '@/shared/api/public/publicApi';
import { Item as ResponseItem } from '@/shared/api/public/publicTypes';
import { IUseInfiniteScroll, useInfiniteScroll } from '@/shared/lib/hooks/useInfiniteScroll';
import { UserCard } from '@/widget';

import s from './HomePage.module.scss';

type Props = {
  showPostModalHandler: (isOpen: boolean, postId?: number) => void;
};

const START_POSTS_COUNT = 10;
const NEXT_POSTS_COUNT = 10;

export const HomePage = (props: Props) => {
  const { showPostModalHandler } = props;
  const triggerRef = useRef() as MutableRefObject<HTMLDivElement>;

  const [getPublicPosts, { data: fetchedData, isFetching }] = useLazyGetPublicPostsQuery();
  const [posts, setPosts] = useState<ResponseItem[]>([]); // Локальное состояние для списка постов

  // Первоначальная загрузка постов
  useEffect(() => {
    getPublicPosts({ pageSize: START_POSTS_COUNT });
  }, []);

  // Проверка на отсутствие дополнительных постов
  const hasNoMorePosts = fetchedData?.totalCount === posts.length;

  const onLoadNextPosts = useCallback(() => {
    if (!isFetching && !hasNoMorePosts && posts.length) {
      const cursorID = posts[posts.length - 1]?.id;

      getPublicPosts({ endCursorPostId: cursorID, pageSize: NEXT_POSTS_COUNT });
    }
  }, [getPublicPosts, hasNoMorePosts, isFetching, posts]);

  useInfiniteScroll({
    callBack: onLoadNextPosts,
    rootMargin: '0px',
    threshold: 0.1,
    triggerRef
  } as IUseInfiniteScroll);

  // Обновление состояния постов при приходе новых данных
  useEffect(() => {
    if (fetchedData?.items) {
      setPosts((prev) => [...prev, ...fetchedData.items]); // Добавление новых постов к текущему состоянию
    }
  }, [fetchedData]);

  return (
    <div className={s.container}>
      <div className={s.cards}>
        {posts.map((post) => (
          <UserCard key={post.id} post={post} showPostModalHandler={showPostModalHandler} />
        ))}
      </div>
      <div ref={triggerRef} style={{ opacity: 0 }}>
        .
      </div>
    </div>
  );
};
