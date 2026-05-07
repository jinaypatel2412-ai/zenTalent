export interface Post {
  id: string;
  username: string;
  avatar: string;
  location?: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  following: boolean;
  timestamp: string;
}

export const MOCK_POSTS: Post[] = [
  {
    id: "1",
    username: "priya_sharma",
    avatar: "https://i.pravatar.cc/150?img=1",
    location: "Bangalore, India",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=600&fit=crop",
    caption: "Just landed my dream role as a Senior Data Engineer! Thanks to everyone who helped me prepare 🎉🚀 #Zentalent #CareerGoals",
    likes: 1243,
    comments: 89,
    shares: 34,
    liked: false,
    following: false,
    timestamp: "2h ago",
  },
  {
    id: "2",
    username: "arjun_kapoor",
    avatar: "https://i.pravatar.cc/150?img=3",
    location: "Mumbai, India",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=600&fit=crop",
    caption: "Completed my coding challenge on Zentalent — scored 94/100! The AI evaluation is incredibly accurate 💻🔥",
    likes: 876,
    comments: 45,
    shares: 12,
    liked: false,
    following: false,
    timestamp: "4h ago",
  },
  {
    id: "3",
    username: "sarah_tech",
    avatar: "https://i.pravatar.cc/150?img=5",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=600&fit=crop",
    caption: "Team building day at the office! Great to work with such amazing people 🙌 #WorkCulture #TechLife",
    likes: 2104,
    comments: 156,
    shares: 78,
    liked: false,
    following: false,
    timestamp: "6h ago",
  },
  {
    id: "4",
    username: "dev_michael",
    avatar: "https://i.pravatar.cc/150?img=8",
    location: "San Francisco, USA",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=600&fit=crop",
    caption: "Late night coding sessions hitting different when you're building something you love 🌃💡 #Developer #Startup",
    likes: 543,
    comments: 23,
    shares: 9,
    liked: false,
    following: false,
    timestamp: "8h ago",
  },
  {
    id: "5",
    username: "recruiter_jane",
    avatar: "https://i.pravatar.cc/150?img=10",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop",
    caption: "Just hired 3 amazing engineers through Zentalent! The AI screening saved us weeks of manual review ☕️ #Hiring #TechRecruiting",
    likes: 321,
    comments: 18,
    shares: 5,
    liked: false,
    following: false,
    timestamp: "12h ago",
  },
  {
    id: "6",
    username: "fitness_raj",
    avatar: "https://i.pravatar.cc/150?img=12",
    location: "Delhi, India",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=600&fit=crop",
    caption: "Work-life balance is key! Morning workouts before interview prep sessions 💪🏋️ #HealthyHiring",
    likes: 1890,
    comments: 210,
    shares: 45,
    liked: false,
    following: false,
    timestamp: "1d ago",
  },
  {
    id: "7",
    username: "design_nina",
    avatar: "https://i.pravatar.cc/150?img=9",
    location: "Berlin, Germany",
    image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=600&fit=crop",
    caption: "UI/UX portfolio review session done! Ready for my next design interview 🎨✨ #DesignJobs",
    likes: 754,
    comments: 62,
    shares: 28,
    liked: false,
    following: false,
    timestamp: "1d ago",
  },
  {
    id: "8",
    username: "data_alex",
    avatar: "https://i.pravatar.cc/150?img=11",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop",
    caption: "Data science bootcamp graduation! From zero to ML engineer in 6 months 📊🤖 #DataScience #MachineLearning",
    likes: 1567,
    comments: 134,
    shares: 67,
    liked: false,
    following: false,
    timestamp: "2d ago",
  },
];



