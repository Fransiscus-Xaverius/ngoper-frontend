import { useState, useRef, useEffect, useCallback } from 'react';
import { MaterialIcon } from '../components/ui/MaterialIcon';
import { Header } from '../components/layout/Header';
import { useAppSelector } from '../store/hooks';
import { postsApi, getImageUrl, type Post } from '../api/posts';

interface FeedPost {
  id: string;
  type: 'trip' | 'product' | 'member_only';
  creator: {
    name: string;
    avatar: string;
    location: string;
  };
  timestamp: string;
  content: string;
  title?: string;
  images?: string[];
  likes: number;
  comments: number;
  shares: number;
  isLive?: boolean;
  price?: string;
  isLocked?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
  allowRequests?: boolean;
}

function mapPost(post: Post): FeedPost {
  return {
    id: post.id,
    type: post.type === 'exclusive' ? 'member_only' : post.type,
    creator: {
      name: post.creator?.name || 'Unknown',
      avatar: post.creator?.avatar || '',
      location: post.creator?.location || post.location || '',
    },
    timestamp: formatTimestamp(post.timestamp),
    content: post.content,
    images: post.images,
    likes: post.likes,
    comments: post.comments,
    shares: post.shares,
    isLive: post.isLive,
    price: post.price,
    isLocked: post.isLocked,
    isLiked: post.isLiked,
    isBookmarked: post.isBookmarked,
    allowRequests: post.allow_requests,
  };
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const filterChips = ['All Updates', 'Trips', 'Product Finds', 'Exclusive'];

function filterToApiParam(chip: string): string {
  switch (chip) {
    case 'Trips': return 'trip';
    case 'Product Finds': return 'product';
    case 'Exclusive': return 'exclusive';
    default: return '';
  }
}

export function HomePage() {
  const user = useAppSelector((state) => state.auth.user);
  const [activeFilter, setActiveFilter] = useState('All Updates');
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [uploadedImages, setUploadedImages] = useState<
    { dataUrl: string; file: File }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [allowRequests, setAllowRequests] = useState(false);
  const [requestPostId, setRequestPostId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFeed = useCallback(
    async (pageNum: number, filter: string) => {
      setLoading(true);
      setError(null);
      try {
        const apiFilter = filterToApiParam(filter);
        const response = await postsApi.getFeed({
          page: pageNum,
          limit: 20,
          ...(apiFilter ? { filter: apiFilter } : {}),
        });
        const mapped = response.data.posts.map(mapPost);
        if (pageNum === 1) {
          setPosts(mapped);
        } else {
          setPosts((prev) => [...prev, ...mapped]);
        }
        setHasMore(response.pagination.hasMore);
        setPage(pageNum);
      } catch (err: unknown) {
        const e = err as { response?: { data?: { error?: { message?: string } } } };
        setError(e.response?.data?.error?.message || 'Failed to load feed');
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    fetchFeed(1, activeFilter);
  }, [activeFilter, fetchFeed]);

  const handleFilterChange = (chip: string) => {
    setActiveFilter(chip);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    fetchFeed(nextPage, activeFilter);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (uploadedImages.length >= 4) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [
            ...prev,
            { dataUrl: event.target!.result as string, file },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!postContent.trim() && uploadedImages.length === 0) return;

    setSubmitting(true);
    try {
      const imageUrls: string[] = [];
      if (uploadedImages.length > 0) {
        setUploading(true);
        for (const img of uploadedImages) {
          const res = await postsApi.uploadImage(img.file);
          imageUrls.push(res.url);
        }
        setUploading(false);
      }

      const response = await postsApi.createPost({
        content: postContent,
        type: 'trip',
        images: imageUrls,
        allow_requests: allowRequests,
      });

      const newPost = mapPost(response.data);
      setPosts((prev) => [newPost, ...prev]);
      setPostContent('');
      setUploadedImages([]);
      setAllowRequests(false);
      setIsModalOpen(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setError(e.response?.data?.error?.message || 'Failed to create post');
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const handleLike = async (postId: string, isLiked: boolean) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId
          ? {
              ...p,
              likes: isLiked ? p.likes - 1 : p.likes + 1,
              isLiked: !isLiked,
            }
          : p
      )
    );
    try {
      if (isLiked) {
        await postsApi.unlikePost(postId);
      } else {
        await postsApi.likePost(postId);
      }
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId
            ? {
                ...p,
                likes: isLiked ? p.likes + 1 : p.likes - 1,
                isLiked,
              }
            : p
        )
      );
    }
  };

  const handleBookmark = async (postId: string, isBookmarked: boolean) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, isBookmarked: !isBookmarked } : p
      )
    );
    try {
      if (isBookmarked) {
        await postsApi.unbookmarkPost(postId);
      } else {
        await postsApi.bookmarkPost(postId);
      }
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, isBookmarked } : p
        )
      );
    }
  };

  const handleShare = async (postId: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, shares: p.shares + 1 } : p
      )
    );
    try {
      await postsApi.sharePost(postId);
    } catch {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, shares: p.shares - 1 } : p
        )
      );
    }
  };

  const userAvatar = user?.avatar ? getImageUrl(user.avatar) : '';
  const userName = user?.name || 'User';

  return (
    <div className="h-screen overflow-hidden">
      <Header variant="loggedIn" />

      <div className="pt-16 h-screen overflow-hidden">
        <main className="h-full overflow-y-auto no-scrollbar scroll-smooth px-4 md:px-8 py-6">
          <div className="max-w-2xl mx-auto space-y-6">
            {/* Action Card */}
            <section
              className="glass-card rounded-xl p-6 border border-red-500/20 cursor-pointer hover:scale-[1.02] transition-transform"
              style={{ boxShadow: '0 0 20px rgba(255,77,90,0.2)' }}
              onClick={() => setIsModalOpen(true)}
            >
              <h1 className="text-xl font-bold mb-4 text-on-surface">
                What do you want to request?
              </h1>
              <div className="grid grid-cols-2 gap-3">
                <button
                  className="bg-primary-container text-on-primary-container font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-2 active:scale-95 duration-200 transition-all shadow-lg"
                  style={{ boxShadow: '0 4px 15px rgba(255,82,93,0.3)' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsModalOpen(true);
                  }}
                >
                  <MaterialIcon name="add_circle" className="text-2xl" />
                  Create a new post
                </button>
                <button className="bg-surface-container-highest text-on-surface font-bold py-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-white/10 active:scale-95 duration-200 transition-all">
                  <MaterialIcon name="explore" className="text-2xl" />
                  Browse Open Trips
                </button>
              </div>
            </section>

            {/* Feed Filtering Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
              {filterChips.map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleFilterChange(chip)}
                  className={`px-4 py-1.5 rounded-full font-medium text-sm whitespace-nowrap cursor-pointer transition-all ${
                    activeFilter === chip
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-surface-container-high text-on-surface-variant border border-white/5'
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                {error}
                <button
                  className="ml-3 underline"
                  onClick={() => fetchFeed(1, activeFilter)}
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading */}
            {loading && posts.length === 0 && (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {/* Empty State */}
            {!loading && posts.length === 0 && !error && (
              <div className="text-center py-12 text-slate-500">
                <MaterialIcon name="inbox" className="text-4xl mb-2" />
                <p className="text-lg font-bold">No posts yet</p>
                <p className="text-sm">Be the first to share something!</p>
              </div>
            )}

            {/* Feed Posts */}
            {posts.map((post) => (
              <FeedCard
                key={post.id}
                post={post}
                onLike={handleLike}
                onBookmark={handleBookmark}
                onShare={handleShare}
                onRequest={(id) => setRequestPostId(id)}
              />
            ))}

            {/* Load More */}
            {hasMore && posts.length > 0 && (
              <div className="text-center pb-8">
                <button
                  onClick={loadMore}
                  disabled={loading}
                  className="px-6 py-2 bg-surface-container-high text-on-surface-variant rounded-full font-medium text-sm border border-white/5 hover:border-white/20 transition-all disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              </div>
            )}
          </div>
        </main>

        {/* Floating Action Button */}
        <button
          className="fixed bottom-10 right-10 w-14 h-14 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group"
          style={{ boxShadow: '0 8px 30px rgba(255,77,90,0.6)' }}
          onClick={() => setIsModalOpen(true)}
        >
          <MaterialIcon name="add" className="text-3xl group-hover:rotate-90 transition-transform duration-300" />
        </button>
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-surface-container-high rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-2xl border border-white/10">
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <MaterialIcon name="close" className="text-xl" />
              </button>
              <button
                onClick={handleCreatePost}
                disabled={
                  (!postContent.trim() && uploadedImages.length === 0) ||
                  submitting
                }
                className={`px-4 py-1.5 rounded-full font-bold text-sm transition-all ${
                  postContent.trim() ||
                  uploadedImages.length > 0
                    ? 'bg-primary-container text-on-primary-container'
                    : 'bg-white/10 text-slate-500 cursor-not-allowed'
                }`}
              >
                {submitting
                  ? uploading
                    ? 'Uploading...'
                    : 'Posting...'
                  : 'Post'}
              </button>
            </div>

            <div className="p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 bg-surface-container-high">
                  {userAvatar ? (
                    <img alt={userName} className="w-full h-full object-cover" src={userAvatar} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-on-surface/30">
                      <MaterialIcon name="person" className="text-2xl" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <textarea
                    value={postContent}
                    onChange={(e) =>
                      setPostContent(e.target.value.slice(0, 2000))
                    }
                    placeholder="What do you want to share?"
                    className="w-full bg-transparent text-on-surface text-lg placeholder:text-slate-500 resize-none outline-none min-h-[120px]"
                    autoFocus
                  />

                  {uploadedImages.length > 0 && (
                    <div
                      className={`mt-3 grid gap-1 ${
                        uploadedImages.length === 1
                          ? 'grid-cols-1'
                          : 'grid-cols-2'
                      }`}
                    >
                      {uploadedImages.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            alt={`Upload ${idx + 1}`}
                            src={img.dataUrl}
                            className="w-full h-40 object-cover rounded-lg"
                          />
                          <button
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 bg-black/60 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MaterialIcon name="close" className="text-white text-sm" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end mt-2">
                <span
                  className={`text-xs ${
                    postContent.length >= 1900
                      ? 'text-red-500'
                      : 'text-slate-500'
                  }`}
                >
                  {postContent.length}/2000
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadedImages.length >= 4}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors disabled:opacity-30"
                >
                  <MaterialIcon name="image" className="text-red-500 text-xl" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <MaterialIcon name="gif_box" className="text-slate-400 text-xl" />
                </button>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <MaterialIcon name="location_on" className="text-slate-400 text-xl" />
                </button>
                <span className="text-xs text-slate-500">
                  {uploadedImages.length}/4
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </div>

              {user?.role === 'jastiper' && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/10">
                  <input
                    type="checkbox"
                    id="allow-requests"
                    checked={allowRequests}
                    onChange={(e) => setAllowRequests(e.target.checked)}
                    className="w-5 h-5 rounded border-white/20 bg-white/5 text-primary-container focus:ring-primary-container/50"
                  />
                  <label htmlFor="allow-requests" className="text-sm text-on-surface/70 cursor-pointer select-none">
                    Enable Jastip Requests
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {requestPostId && (
        <RequestModal
          postId={requestPostId}
          onClose={() => setRequestPostId(null)}
        />
      )}
    </div>
  );
}

function FeedCard({
  post,
  onLike,
  onBookmark,
  onShare,
  onRequest,
}: {
  post: FeedPost;
  onLike: (postId: string, isLiked: boolean) => void;
  onBookmark: (postId: string, isBookmarked: boolean) => void;
  onShare: (postId: string) => void;
  onRequest: (postId: string) => void;
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const getGridClass = (count: number) => {
    switch (count) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-2 [&>*:first-child]:row-span-2';
      case 4:
        return 'grid-cols-2';
      default:
        return 'grid-cols-2';
    }
  };

  return (
    <article
      className={`glass-card rounded-xl overflow-hidden ${
        post.type === 'member_only' ? 'border border-red-500/10' : ''
      }`}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full border-2 p-0.5 ${
              post.type === 'trip' ? 'border-red-500' : 'border-slate-700'
            }`}
          >
            {post.creator.avatar ? (
              <img
                alt={post.creator.name}
                className="w-full h-full rounded-full object-cover"
                src={post.creator.avatar}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center text-on-surface/30">
                <MaterialIcon name="person" className="text-lg" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm">{post.creator.name}</h3>
            <p className="text-xs text-slate-500 uppercase tracking-tighter">
              {post.creator.location} • {post.timestamp}
            </p>
          </div>
        </div>
        {post.type === 'member_only' ? (
          <span className="px-2 py-1 bg-red-500/10 text-red-500 text-[10px] font-bold rounded uppercase">
            Member Only
          </span>
        ) : (
          <MaterialIcon name="more_horiz" className="text-slate-500" />
        )}
      </div>

      {post.isLocked ? (
        <div className="relative h-48 w-full group overflow-hidden">
          <img
            alt="Locked content"
            className="w-full h-full object-cover blur-xl scale-110 opacity-50"
            src={post.images?.[0]}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
            <MaterialIcon name="lock" className="text-4xl text-red-500 mb-2" />
            <button
              className="bg-red-500 text-white px-6 py-2 rounded-full font-medium text-sm active:scale-95 transition-all"
              style={{ boxShadow: '0 0 20px rgba(255,77,90,0.2)' }}
            >
              Unlock with Pro Membership
            </button>
          </div>
        </div>
      ) : post.images && post.images.length > 0 ? (
        <div className="relative">
          {post.images.length > 1 ? (
            <div
              className={`grid ${getGridClass(post.images.length)} gap-0.5`}
            >
              {post.images.slice(0, 4).map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square overflow-hidden cursor-pointer"
                  onClick={() => setCurrentImageIndex(idx)}
                >
                  <img
                    alt={`Post image ${idx + 1}`}
                    className="w-full h-full object-cover"
                    src={img}
                  />
                  {idx === currentImageIndex && (
                    <div className="absolute inset-0 bg-white/10" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="relative">
              <img
                alt="Post image"
                className="w-full h-auto max-h-96 object-cover"
                src={post.images[0]}
              />
            </div>
          )}

          {post.images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-black/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(currentImageIndex - 1);
                  }}
                >
                  <MaterialIcon
                    name="chevron_left"
                    className="text-white"
                  />
                </button>
              )}
              {currentImageIndex < post.images.length - 1 && (
                <button
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md p-2 rounded-full hover:bg-black/80 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentImageIndex(currentImageIndex + 1);
                  }}
                >
                  <MaterialIcon
                    name="chevron_right"
                    className="text-white"
                  />
                </button>
              )}

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentImageIndex(idx);
                    }}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      idx === currentImageIndex
                        ? 'bg-white'
                        : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {post.isLive && (
            <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 flex items-center gap-1">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                Live Updates
              </span>
            </div>
          )}
        </div>
      ) : null}

      <div className="p-4 space-y-2">
        {post.title && (
          <h4 className="font-bold text-lg mb-1 text-on-surface">
            {post.title}
          </h4>
        )}
        <p className="text-sm text-on-surface whitespace-pre-wrap">
          {post.content}
        </p>

        {post.price && (
          <div className="pt-2 flex items-center justify-between bg-white/5 p-3 rounded-lg mt-2">
            <div>
              <span className="text-xs text-slate-500">Product Price</span>
              <p className="text-lg font-bold text-red-500">{post.price}</p>
            </div>
            <button
              className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:bg-red-400 active:scale-95 transition-all shadow-md"
              style={{ boxShadow: '0 0 15px rgba(255,179,178,0.3)' }}
            >
              I want this!
            </button>
          </div>
          )}
        {post.allowRequests && (
          <button
            className="w-full mt-2 py-2.5 border border-primary-container/50 text-primary-container rounded-lg font-bold text-sm hover:bg-primary-container/10 active:scale-[0.98] transition-all"
            onClick={() => onRequest(post.id)}
          >
            <MaterialIcon name="shopping_cart" className="text-lg mr-1" />
            Make a Request
          </button>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-6">
            <button
              className={`flex items-center gap-1.5 transition-colors group ${
                post.isLiked ? 'text-red-500' : 'text-slate-400 hover:text-red-500'
              }`}
              onClick={() => onLike(post.id, !!post.isLiked)}
            >
              <MaterialIcon
                name="favorite"
                className="text-xl"
                filled={post.isLiked}
              />
              <span className="text-xs font-bold">
                {post.likes >= 1000
                  ? `${(post.likes / 1000).toFixed(1)}k`
                  : post.likes}
              </span>
            </button>
            <button className="flex items-center gap-1.5 text-slate-400 hover:text-blue-400 transition-colors">
              <MaterialIcon name="chat_bubble" className="text-xl" />
              <span className="text-xs font-bold">{post.comments}</span>
            </button>
            <button
              className="flex items-center gap-1.5 text-slate-400 hover:text-green-400 transition-colors"
              onClick={() => onShare(post.id)}
            >
              <MaterialIcon name="share" className="text-xl" />
            </button>
          </div>
          <button
            className={`transition-colors ${
              post.isBookmarked
                ? 'text-yellow-400'
                : 'text-slate-400 hover:text-yellow-400'
            }`}
            onClick={() => onBookmark(post.id, !!post.isBookmarked)}
          >
            <MaterialIcon
              name={post.isBookmarked ? 'bookmark' : 'bookmark_border'}
              className="text-xl"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

function RequestModal({
  postId,
  onClose,
}: {
  postId: string;
  onClose: () => void;
}) {
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reqImages, setReqImages] = useState<
    { dataUrl: string; file: File }[]
  >([]);
  const [reqProposedPrice, setReqProposedPrice] = useState('');
  const [reqUploading, setReqUploading] = useState(false);
  const [reqSubmitting, setReqSubmitting] = useState(false);
  const [reqError, setReqError] = useState<string | null>(null);
  const [reqSuccess, setReqSuccess] = useState(false);
  const reqFileRef = useRef<HTMLInputElement>(null);

  const handleReqImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (reqImages.length >= 4) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setReqImages((prev) => [
            ...prev,
            { dataUrl: event.target!.result as string, file },
          ]);
        }
      };
      reader.readAsDataURL(file);
    });
    if (reqFileRef.current) reqFileRef.current.value = '';
  };

  const handleSubmitRequest = async () => {
    if (!description.trim()) {
      setReqError('Please describe what you want');
      return;
    }
    setReqSubmitting(true);
    setReqError(null);
    try {
      const imageUrls: string[] = [];
      if (reqImages.length > 0) {
        setReqUploading(true);
        for (const img of reqImages) {
          const res = await postsApi.uploadImage(img.file);
          imageUrls.push(res.url);
        }
        setReqUploading(false);
      }

      await postsApi.createRequest(postId, {
        description,
        images: imageUrls,
        quantity,
        proposed_price: reqProposedPrice ? parseFloat(reqProposedPrice) : undefined,
      });
      setReqSuccess(true);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } };
      setReqError(e.response?.data?.error?.message || 'Failed to submit request');
    } finally {
      setReqSubmitting(false);
      setReqUploading(false);
    }
  };

  if (reqSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        <div className="relative bg-surface-container-high rounded-2xl w-full max-w-md mx-4 p-8 text-center border border-white/10">
          <MaterialIcon name="check_circle" className="text-5xl text-green-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Request Sent!</h3>
          <p className="text-slate-400 mb-6">
            The jastiper will review your request and respond soon.
          </p>
          <button
            className="bg-primary-container text-on-primary-container font-bold px-8 py-3 rounded-full active:scale-95 transition-all"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-high rounded-2xl w-full max-w-md mx-4 overflow-hidden shadow-2xl border border-white/10">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="font-bold text-lg">Make a Request</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <MaterialIcon name="close" className="text-xl" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {reqError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {reqError}
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              What do you want?
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 500))}
              placeholder="Describe the item, size, color, brand, etc."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-on-surface text-sm placeholder:text-slate-500 resize-none outline-none min-h-[80px]"
              autoFocus
            />
            <span className="text-[10px] text-slate-500">
              {description.length}/500
            </span>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Quantity
            </label>
            <div className="flex items-center gap-2">
              <button
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <MaterialIcon name="remove" className="text-sm" />
              </button>
              <span className="text-lg font-bold w-8 text-center">
                {quantity}
              </span>
              <button
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center"
                onClick={() => setQuantity(quantity + 1)}
              >
                <MaterialIcon name="add" className="text-sm" />
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Your Proposed Price (USD)
            </label>
            <input
              type="number"
              value={reqProposedPrice}
              onChange={(e) => setReqProposedPrice(e.target.value)}
              placeholder="How much are you willing to pay?"
              step="0.01"
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-on-surface text-sm placeholder:text-slate-500 outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 block">
              Reference Images
            </label>
            <div className="flex gap-2 flex-wrap">
              {reqImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img
                    alt={`Ref ${idx + 1}`}
                    src={img.dataUrl}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <button
                    className="absolute -top-1 -right-1 bg-black/80 rounded-full p-0.5"
                    onClick={() =>
                      setReqImages((prev) => prev.filter((_, i) => i !== idx))
                    }
                  >
                    <MaterialIcon name="close" className="text-white text-xs" />
                  </button>
                </div>
              ))}
              {reqImages.length < 4 && (
                <button
                  className="w-20 h-20 rounded-lg border border-dashed border-white/20 flex items-center justify-center hover:bg-white/5 transition-colors"
                  onClick={() => reqFileRef.current?.click()}
                >
                  <MaterialIcon name="add" className="text-slate-500 text-2xl" />
                </button>
              )}
              <input
                ref={reqFileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleReqImageSelect}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10">
          <button
            className="w-full bg-primary-container text-on-primary-container font-bold py-3 rounded-full active:scale-[0.98] transition-all disabled:opacity-50"
            onClick={handleSubmitRequest}
            disabled={!description.trim() || reqSubmitting}
          >
            {reqSubmitting
              ? reqUploading
                ? 'Uploading images...'
                : 'Sending...'
              : 'Submit Request'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
