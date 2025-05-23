import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getAllPosts } from '../data/posts';
import { BlogPost } from '../types/blog';
import { PenLine, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import siteConfig from '../config/site';

const BlogList: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllPosts()
      .then((fetchedPosts) => {
        setPosts(fetchedPosts);
        setLoading(false);
      })
      .catch((err) => {
        setError('Unable to load blog posts');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
        <Helmet>
          <title>Blog - {siteConfig.title}</title>
          <meta name="description" content={`Blog posts about ${siteConfig.description}`} />
          <link rel="canonical" href={`${siteConfig.siteUrl}/blog`} />
        </Helmet>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Posts</h1>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <PenLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No blog posts available yet.</p>
          <p className="text-gray-500 text-sm mt-2">Check back soon for new content!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6">
      <Helmet>
        <title>Blog - {siteConfig.title}</title>
        <meta name="description" content={`Blog posts about ${siteConfig.description}`} />
        <link rel="canonical" href={`${siteConfig.siteUrl}/blog`} />
      </Helmet>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Posts</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
          // Determine if the featured image is from YouTube
          const isYoutubeThumb = post.featuredImage?.includes('img.youtube.com');
          
          return (
            <article key={post.slug} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <Link to={`/${post.slug}`} className="block hover:no-underline">
                <div 
                  className={`${isYoutubeThumb ? 'youtube-thumbnail' : 'h-48'} bg-cover bg-center relative`}
                  style={{ 
                    backgroundImage: post.featuredImage 
                      ? `url(${post.featuredImage})` 
                      : 'url(https://images.unsplash.com/photo-1487611459768-bd414656ea10?q=80&w=1920&auto=format&fit=crop)'
                  }}
                >
                  {/* Only add overlay and title for non-featured images */}
                  {!post.featuredImage && (
                    <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                  )}
                  {!post.featuredImage && (
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <h2 className="text-xl font-semibold text-white text-center">
                        {post.title}
                      </h2>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {(post.featuredImage || isYoutubeThumb) && (
                    <h2 className="text-xl font-semibold text-gray-900 mb-2 hover:text-blue-600">
                      {post.title}
                    </h2>
                  )}
                  <div className="flex flex-wrap gap-4 text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      <time dateTime={post.date}>
                        {new Date(post.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                    </div>
                    {post.author && (
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2" />
                        <span>{post.author}</span>
                      </div>
                    )}
                  </div>
                  {post.excerpt && (
                    <div className="text-gray-600">
                      <ReactMarkdown>
                        {post.excerpt.length > 120
                          ? post.excerpt.substring(0, 120) + '...' 
                          : post.excerpt}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default BlogList;