import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Share2, MapPin, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MOCK_POSTS } from "@/data/mockPosts";
import { useNavigate } from "react-router-dom";

export default function HomeFeed() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentingOn, setCommentingOn] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");

  const fetchPosts = async () => {
    if (!user) return;
    try {
      // Fetch posts with their authors
      const { data: rawPosts, error: postsError } = await supabase
        .from("posts")
        .select(`
          *,
          profiles(*),
          post_likes(user_id),
          post_comments(id, content, created_at, profiles(username, avatar_url))
        `)
        .order("created_at", { ascending: false });

      if (postsError || !rawPosts || rawPosts.length === 0) {
        // Fallback to mock posts if DB is empty or fails
        setPosts(MOCK_POSTS.map(p => ({ ...p, isMock: true })));
        setLoading(false);
        return;
      }

      // Fetch who the current user follows
      const { data: followingData } = await supabase
        .from("followers")
        .select("following_id")
        .eq("follower_id", user.id);
        
      const followingIds = new Set(followingData?.map(f => f.following_id) || []);

      const formatted = rawPosts.map((p: any) => ({
        id: p.id,
        user_id: p.user_id,
        username: p.profiles?.username || "user",
        avatar: p.profiles?.avatar_url,
        location: p.location,
        image: p.image_url,
        caption: p.caption,
        likes: p.post_likes?.length || 0,
        comments: p.post_comments?.length || 0,
        commentList: p.post_comments?.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) || [],
        shares: 0,
        liked: p.post_likes?.some((like: any) => like.user_id === user.id),
        following: followingIds.has(p.user_id),
        timestamp: new Date(p.created_at).toLocaleDateString(),
        isMock: false
      }));

      setPosts(formatted);
    } catch (e) {
      setPosts(MOCK_POSTS.map(p => ({ ...p, isMock: true })));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [user]);

  const toggleLike = async (post: any) => {
    if (post.isMock) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
      return;
    }

    const newLikedState = !post.liked;
    // Optimistic update
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, liked: newLikedState, likes: p.likes + (newLikedState ? 1 : -1) } : p));

    if (newLikedState) {
      await supabase.from("post_likes").insert({ post_id: post.id, user_id: user!.id });
    } else {
      await supabase.from("post_likes").delete().match({ post_id: post.id, user_id: user!.id });
    }
  };

  const toggleFollow = async (post: any) => {
    if (post.isMock) {
      setPosts(prev => prev.map(p => p.username === post.username ? { ...p, following: !p.following } : p));
      return;
    }

    if (post.user_id === user?.id) {
      toast.info("You cannot follow yourself");
      return;
    }

    const newFollowState = !post.following;
    // Optimistic update all posts by this user
    setPosts(prev => prev.map(p => p.user_id === post.user_id ? { ...p, following: newFollowState } : p));

    if (newFollowState) {
      await supabase.from("followers").insert({ follower_id: user!.id, following_id: post.user_id });
      toast.success(`You are now following ${post.username}`);
    } else {
      await supabase.from("followers").delete().match({ follower_id: user!.id, following_id: post.user_id });
      toast.info(`Unfollowed ${post.username}`);
    }
  };

  const sharePost = (post: any) => {
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, shares: p.shares + 1 } : p));
    toast.success("Post successfully shared to your network!");
  };

  const submitComment = async (post: any) => {
    if (!commentText.trim()) return;
    if (post.isMock) {
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, comments: p.comments + 1 } : p));
      toast.success("Comment added!");
      setCommentText("");
      setCommentingOn(null);
      return;
    }

    const { error } = await supabase.from("post_comments").insert({
      post_id: post.id,
      user_id: user!.id,
      content: commentText
    });

    if (!error) {
      setPosts(prev => prev.map(p => p.id === post.id ? { 
        ...p, 
        comments: p.comments + 1,
        commentList: [...(p.commentList || []), {
          id: Math.random(),
          content: commentText,
          profiles: { username: "You", avatar_url: null }
        }]
      } : p));
      toast.success("Comment added!");
    } else {
      toast.error("Failed to add comment");
    }
    setCommentText("");
    // Don't close the commenting window automatically, let them see their new comment.
  };

  const handleProfileClick = (username: string) => {
    navigate(`/dashboard/profile/${username}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-20 relative z-10">

      {loading ? (
        <div className="p-12 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>
      ) : posts.map((post) => (
        <div key={post.id} className="glass-card rounded-3xl p-5 sm:p-6 mb-8 transition-transform duration-500 hover:shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => handleProfileClick(post.username)}>
              <Avatar className="h-11 w-11 border border-white/10 shadow-sm transition-transform group-hover:scale-105">
                <AvatarImage src={post.avatar} alt={post.username} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                  {post.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-[15px] text-foreground outfit tracking-wide group-hover:text-primary transition-colors">{post.username}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{post.timestamp}</p>
                  {post.location && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
                        <MapPin className="h-3 w-3" />
                        {post.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            {post.user_id !== user?.id && (
              <Button
                variant={post.following ? "secondary" : "default"}
                size="sm"
                onClick={() => toggleFollow(post)}
                className={`text-xs h-8 rounded-full px-4 font-semibold shadow-sm transition-all hover:scale-105 ${!post.following ? 'glow-button bg-primary text-primary-foreground shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
              >
                {post.following ? "Following" : "Follow +"}
              </Button>
            )}
          </div>

          {/* Caption */}
          {post.caption && (
            <p className="text-[15px] text-foreground leading-relaxed mb-4">
              {post.caption}
            </p>
          )}

          {/* Inset Image */}
          {post.image && (
            <div className="w-full aspect-[4/3] sm:aspect-video rounded-2xl overflow-hidden bg-white/5 border border-white/5 relative shadow-inner mb-4">
              <img src={post.image} alt="post" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" loading="lazy" />
            </div>
          )}

          {/* Actions */}
          <div className="pt-2 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button onClick={() => toggleLike(post)} className="flex items-center gap-2 group">
                <div className={`p-2 rounded-full transition-colors ${post.liked ? 'bg-rose-500/10' : 'bg-white/5 group-hover:bg-primary/10'}`}>
                  <Heart className={`h-5 w-5 transition-all group-hover:scale-110 ${post.liked ? "fill-rose-500 text-rose-500" : "text-muted-foreground group-hover:text-primary"}`} />
                </div>
                <span className={`text-sm font-medium ${post.liked ? 'text-rose-500' : 'text-muted-foreground group-hover:text-primary'}`}>{post.likes}</span>
              </button>
              
              <button 
                onClick={() => setCommentingOn(commentingOn === post.id ? null : post.id)} 
                className="flex items-center gap-2 group"
              >
                <div className={`p-2 rounded-full transition-colors ${commentingOn === post.id ? 'bg-primary/10' : 'bg-white/5 group-hover:bg-primary/10'}`}>
                  <MessageCircle className={`h-5 w-5 transition-all group-hover:scale-110 ${commentingOn === post.id ? 'text-primary fill-primary/20' : 'text-muted-foreground group-hover:text-primary'}`} />
                </div>
                <span className={`text-sm font-medium ${commentingOn === post.id ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'}`}>{post.comments}</span>
              </button>
            </div>
            
            <button onClick={() => sharePost(post)} className="flex items-center gap-2 group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <Share2 className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-all group-hover:scale-110" />
              </div>
            </button>
          </div>
            
            {/* Commenting Box & List */}
            {commentingOn === post.id && (
              <div className="mt-4 pt-4 border-t border-white/5 space-y-4 animate-in fade-in slide-in-from-top-2">
                {/* List of Previous Comments */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {post.commentList && post.commentList.length > 0 ? (
                    post.commentList.map((c: any, i: number) => (
                      <div key={c.id || i} className="flex gap-3">
                        <Avatar className="h-8 w-8 border border-white/5 shadow-sm shrink-0">
                          <AvatarImage src={c.profiles?.avatar_url} />
                          <AvatarFallback className="bg-primary/20 text-primary text-[10px] font-bold">
                            {c.profiles?.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-sm px-4 py-2 text-sm">
                          <p className="font-semibold text-foreground outfit">{c.profiles?.username || 'User'}</p>
                          <p className="text-muted-foreground mt-0.5">{c.content}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-center text-muted-foreground py-2">No comments yet. Be the first to start the conversation!</p>
                  )}
                </div>
                
                {/* Comment Input */}
                <div className="flex items-center gap-2">
                  <input 
                    type="text" 
                    value={commentText} 
                    onChange={e => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
                    onKeyDown={e => e.key === 'Enter' && submitComment(post)}
                  />
                  <Button size="icon" variant="ghost" onClick={() => submitComment(post)} className="h-9 w-9 shrink-0 text-primary hover:bg-primary/10 transition-colors">
                    <Send size={16} />
                  </Button>
                </div>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}



