import React, { useEffect, useState } from "react";
import { Grid3X3, Bookmark, Settings, UserPlus, UserCheck } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const MOCK_PROFILE_POSTS = [
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=300&fit=crop",
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop",
];

export default function ProfilePage() {
  const { user: currentUser } = useAuth();
  const { username } = useParams<{ username: string }>();
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [stats, setStats] = useState({ followers: 0, following: 0 });
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUser) return;
      
      try {
        let userIdToFetch = currentUser.id;
        let profileData = null;

        if (username) {
          // View someone else's profile
          const { data } = await supabase.from("profiles").select("*").eq("username", username).single();
          if (data) {
            userIdToFetch = data.id;
            profileData = data;
          } else {
            throw new Error("User not found");
          }
        } else {
          // View own profile
          const { data } = await supabase.from("profiles").select("*").eq("id", currentUser.id).single();
          profileData = data || { 
            id: currentUser.id, 
            full_name: currentUser.user_metadata?.full_name, 
            username: currentUser.email?.split('@')[0],
            avatar_url: `https://i.pravatar.cc/150?img=15` 
          };
        }

        setProfile(profileData);

        // Fetch stats
        const [
          { count: followersCount },
          { count: followingCount },
          { data: userPosts },
          { data: isFollowingData }
        ] = await Promise.all([
          supabase.from("followers").select("*", { count: 'exact', head: true }).eq("following_id", userIdToFetch),
          supabase.from("followers").select("*", { count: 'exact', head: true }).eq("follower_id", userIdToFetch),
          supabase.from("posts").select("*").eq("user_id", userIdToFetch).order("created_at", { ascending: false }),
          supabase.from("followers").select("*").match({ follower_id: currentUser.id, following_id: userIdToFetch })
        ]);

        setStats({
          followers: followersCount || 0,
          following: followingCount || 0,
        });

        if (userPosts && userPosts.length > 0) {
          setPosts(userPosts);
        } else {
          // If no posts in DB, use mock just to show UI if we want, or keep empty
          // We will use mock images mapped to mock posts for aesthetic purposes
          setPosts(MOCK_PROFILE_POSTS.map((url, i) => ({ id: `mock-${i}`, image_url: url })));
        }

        setIsFollowing(!!isFollowingData && isFollowingData.length > 0);

      } catch (err) {
        console.error("Profile fetch error", err);
        // Fallback mock
        setProfile({
          full_name: username || currentUser?.user_metadata?.full_name || "User",
          username: username || currentUser?.email?.split('@')[0] || "user",
          avatar_url: `https://i.pravatar.cc/150?u=${username || '15'}`,
          bio: "📸 Photographer | 🌍 Traveler | ☕ Coffee enthusiast\nBuilding the future of hiring with AI 🚀"
        });
        setPosts(MOCK_PROFILE_POSTS.map((url, i) => ({ id: `mock-${i}`, image_url: url })));
        setStats({ followers: 1283, following: 567 });
      }
      
      setLoading(false);
    };

    fetchProfile();
  }, [username, currentUser]);

  const handleToggleFollow = async () => {
    if (!profile || !currentUser || profile.id === currentUser.id) return;
    
    // Fallback logic for mock users (won't save to DB)
    if (!profile.id || profile.id.startsWith("mock")) {
      setIsFollowing(!isFollowing);
      setStats(prev => ({ ...prev, followers: isFollowing ? prev.followers - 1 : prev.followers + 1 }));
      return;
    }

    try {
      if (isFollowing) {
        await supabase.from("followers").delete().match({ follower_id: currentUser.id, following_id: profile.id });
        setIsFollowing(false);
        setStats(prev => ({ ...prev, followers: prev.followers - 1 }));
      } else {
        await supabase.from("followers").insert({ follower_id: currentUser.id, following_id: profile.id });
        setIsFollowing(true);
        setStats(prev => ({ ...prev, followers: prev.followers + 1 }));
      }
    } catch {
      toast.error("Failed to update follow status");
    }
  };

  if (loading) {
    return <div className="max-w-2xl mx-auto p-12 text-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" /></div>;
  }

  const isOwnProfile = !username || (profile && currentUser && profile.id === currentUser.id);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Profile Header */}
      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 overflow-hidden relative">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
          <Avatar className="h-24 w-24 border-4 border-background shadow-md shrink-0">
            <AvatarImage src={profile?.avatar_url || `https://i.pravatar.cc/150?u=${profile?.username}`} alt={profile?.full_name} />
            <AvatarFallback className="text-2xl font-bold bg-primary/10 text-primary">
              {profile?.full_name?.charAt(0).toUpperCase() || profile?.username?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 w-full">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">{profile?.full_name || profile?.username}</h1>
                <p className="text-muted-foreground">@{profile?.username}</p>
              </div>
              <div className="flex items-center gap-2">
                {isOwnProfile ? (
                  <>
                    <Button variant="outline" size="sm" className="rounded-xl">Edit Profile</Button>
                    <Button variant="ghost" size="icon" className="rounded-xl"><Settings size={18} /></Button>
                  </>
                ) : (
                  <Button 
                    variant={isFollowing ? "secondary" : "default"} 
                    onClick={handleToggleFollow}
                    className="rounded-xl gap-2 shadow-sm"
                  >
                    {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            </div>
            
            <div className="flex gap-6 mb-4">
              <div className="text-center">
                <p className="font-bold text-foreground text-lg">{posts.length}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Posts</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground text-lg">{stats.followers.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Followers</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-foreground text-lg">{stats.following.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Following</p>
              </div>
            </div>
            
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed max-w-lg">
              {profile?.bio || "📸 Photographer | 🌍 Traveler | ☕ Coffee enthusiast\nBuilding the future of hiring with AI 🚀"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 ${
            activeTab === "posts"
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
          }`}
        >
          <Grid3X3 size={16} /> Posts
        </button>
        {isOwnProfile && (
          <button
            onClick={() => setActiveTab("saved")}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 ${
              activeTab === "saved"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            <Bookmark size={16} /> Saved
          </button>
        )}
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-2 rounded-xl overflow-hidden">
        {posts.map((post, i) => (
          <div key={post.id || i} className="aspect-square bg-muted group relative cursor-pointer overflow-hidden rounded-md">
            <img
              src={post.image_url}
              alt={`Post ${i + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          </div>
        ))}
        {posts.length === 0 && (
          <div className="col-span-3 p-12 text-center text-muted-foreground border border-dashed border-border rounded-2xl">
            No posts yet.
          </div>
        )}
      </div>
    </div>
  );
}



