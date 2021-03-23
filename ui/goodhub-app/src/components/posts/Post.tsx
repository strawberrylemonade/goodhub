import { FC } from 'react';

import { IPost } from '@strawberrylemonade/goodhub-lib';
import Picture from '../generic/Picture';
import { ContentRenderer } from '../content/ContentRenderer';
import { PostMetadata } from './PostMetadata';
import { PostActions } from './PostActions';
import { PostRecommendationExplanation } from './PostRecommendationExplanation';

export interface PostProps {
  open?: (postId: string) => void
  personId?: string
  post: IPost
}

export const Post: FC<PostProps> = ({ post, personId, open }) => {
  return <div className="bg-white shadow-sm border border-gray-200 rounded-lg flex flex-col overflow-hidden mb-3 sm:mb-5">
    { post.tags.length ? <PostRecommendationExplanation tag="Education"></PostRecommendationExplanation> : null }
    { post.hero?.image ? <Picture image={post.hero?.image}></Picture> : null}
    <div className="p-4 pb-1 sm:p-5">
      <ContentRenderer content={post.text}></ContentRenderer>
      <div className="pt-2 sm:pt-4 mt-4 border-t border-gray-200 flex flex-col items-start sm:items-center justify-between sm:flex-row">
        <PostMetadata postedAt={post.postedAt.toDateString()} identity={post.postedIdentity} personId={post.postedBy} organisationId={post.organisationId}></PostMetadata>
        <PostActions postId={post.id} personId={personId} likes={post.likes ?? [`${personId}`]} open={open}></PostActions>
      </div>
    </div>
  </div>
}