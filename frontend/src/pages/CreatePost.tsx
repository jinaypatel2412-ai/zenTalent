import { useState, useRef } from "react";
import { ImagePlus, X, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [location, setLocation] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handlePost = async () => {
    if (!user) {
      toast.error("You must be logged in to post.");
      return;
    }
    if (!preview && !caption.trim()) {
      toast.error("Please add an image or a caption.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        caption: caption.trim(),
        location: location.trim() || null,
        image_url: preview || null // Using base64 for prototyping simplicity
      });

      if (error) {
        toast.error("Failed to publish post: " + error.message);
      } else {
        toast.success("Post published successfully! 🎉");
        setCaption("");
        setLocation("");
        setPreview(null);
        navigate("/dashboard/feed");
      }
    } catch (err) {
      toast.error("An error occurred while posting.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-20">
      <h1 className="text-2xl font-bold text-foreground">Create Post</h1>
      <p className="text-sm text-muted-foreground">Share your journey with the Zentalent community</p>

      <div className="bg-card border border-border rounded-2xl shadow-sm p-6 space-y-5">
        {/* Image Upload */}
        {preview ? (
          <div className="relative rounded-xl overflow-hidden">
            <img src={preview} alt="Preview" className="w-full aspect-square object-cover" />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-foreground/60 flex items-center justify-center text-background hover:bg-foreground/80 transition"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full aspect-video rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <ImagePlus size={24} className="text-primary" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Click to upload an image</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, PNG up to 5MB</p>
            </div>
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

        {/* Caption */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Caption</label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="What's on your mind? Share your career updates, achievements..."
            className="w-full h-28 px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Location (optional)</label>
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Add your location"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
        </div>

        {/* Post Button */}
        <button
          onClick={handlePost}
          disabled={isSubmitting}
          className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Send size={16} /> {isSubmitting ? "Publishing..." : "Publish Post"}
        </button>
      </div>
    </div>
  );
}



