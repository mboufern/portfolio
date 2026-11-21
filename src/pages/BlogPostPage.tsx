import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { TbArrowLeft } from 'react-icons/tb';
import { BLOG_POSTS, getBlogPostBySlug } from '../blogs/registry';
import { BlogLayout } from '../blogs/BlogLayout';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const postIdx = BLOG_POSTS.findIndex((entry) => entry.meta.slug === slug);
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  if (!post) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#f8f7fc] flex flex-col items-center justify-center px-6 text-center">
        <h1
          className="text-3xl font-black text-zinc-900 mb-3"
          style={{ fontFamily: 'Archivo Black, sans-serif' }}
        >
          Article Not Found
        </h1>
        <p className="text-zinc-600 text-sm mb-6">
          That post does not exist or may have moved.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 text-white text-sm font-semibold no-underline"
        >
          <TbArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>
      </div>
    );
  }

  const prevPost = postIdx > 0 ? BLOG_POSTS[postIdx - 1] : undefined;
  const nextPost =
    postIdx >= 0 && postIdx < BLOG_POSTS.length - 1
      ? BLOG_POSTS[postIdx + 1]
      : undefined;
  const PostComponent = post.Component;

  return (
    <BlogLayout
      post={post}
      postNumber={postIdx + 1}
      prevPost={prevPost}
      nextPost={nextPost}
    >
      <PostComponent />
    </BlogLayout>
  );
};
