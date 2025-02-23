import React, { Fragment } from 'react';

import { RegisteredUsersCounter } from '@/entities';
import { wrapper } from '@/myApp/store';
import { getRunningQueriesThunk } from '@/shared/api/common/snapmomentAPI';
import { getPublicPosts } from '@/shared/api/public/publicApi';
import { Item } from '@/shared/api/public/publicTypes';
import { useShowPostModal } from '@/shared/lib';
import { getConditionLayout } from '@/shared/providers';
import { PostModal, UserCard } from '@/widget';
import { GetStaticPropsResult, InferGetStaticPropsType } from 'next';

import s from '@/pagesComponents/publicPage/ui/PublicPage.module.scss';

export default function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isOpen, postId, showPostModalHandler } = useShowPostModal();

  return getConditionLayout(
    <>
      {isOpen && <PostModal postId={postId} showPostModalHandler={showPostModalHandler} />}
      <section className={s.container}>
        <RegisteredUsersCounter />

        <div className={s.cards}>
          {posts?.map((post) => (
            <Fragment key={post.id}>
              <UserCard post={post} showPostModalHandler={showPostModalHandler} isSwiperComplexRef />
            </Fragment>
          ))}
        </div>
      </section>
    </>
  );
}

export const getStaticProps = wrapper.getStaticProps(
  (store) => async (): Promise<GetStaticPropsResult<{ posts: Item[] }>> => {
    const posts = await store.dispatch(
      getPublicPosts.initiate({
        pageSize: 4,
        sortBy: 'createdAt',
        sortDirection: 'desc'
      })
    );

    await Promise.all(store.dispatch(getRunningQueriesThunk()));

    if (!posts || !posts.data) {
      return { props: { posts: [] }, revalidate: 60 };
    }

    return {
      props: {
        posts: posts.data.items
      },
      revalidate: 60
    };
  }
);
