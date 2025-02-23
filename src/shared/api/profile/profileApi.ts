import { snapmomentAPI } from '@/shared/api/common/snapmomentAPI';
import {
  GetUserProfileResponse,
  PublishPostsArgs,
  PublishPostsImageResponse,
  UpdateUserProfileArgs
} from '@/shared/api/profile/profileTypes';
import { Item } from '@/shared/api/public/publicTypes';

export const profileApi = snapmomentAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUserProfile: builder.query<GetUserProfileResponse, void>({
      providesTags: ['UserProfile'],
      query: () => 'v1/users/profile'
    }),
    publishPosts: builder.mutation<Item, PublishPostsArgs>({
      invalidatesTags: ['PostsByUserName', 'UserProfile', 'publicPost', 'PostsByUserName'],
      query: (data) => ({
        body: data,
        method: 'POST',
        url: 'v1/posts'
      })
    }),
    publishPostsImage: builder.mutation<PublishPostsImageResponse, File[]>({
      invalidatesTags: ['PostsByUserName', 'UserProfile', 'publicPost', 'PostsByUserName'],
      query: (data) => {
        const formData = new FormData();

        data.forEach((file: File) => {
          formData.append('file', file);
        });

        console.log({ apiFormData: formData });

        return {
          body: formData,
          method: 'POST',
          url: 'v1/posts/image'
        };
      }
    }),

    updateUserProfile: builder.mutation<any, UpdateUserProfileArgs>({
      invalidatesTags: ['UserProfile'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          profileApi.util.updateQueryData('getUserProfile', undefined, (draft) => {
            Object.assign(draft, args);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      query: (data) => ({
        body: data,
        method: 'PUT',
        url: 'v1/users/profile'
      })
    })
  })
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  usePublishPostsImageMutation,
  usePublishPostsMutation,
  useUpdateUserProfileMutation
} = profileApi;
