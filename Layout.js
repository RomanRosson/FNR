import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/entities/User";
import { 
  Home, 
  Calendar, 
  MessageCircle, 
  Users, 
  Settings,
  Bike,
  Trophy,
  Bell,
  Menu,
  X
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Feed",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Events",
    url: createPageUrl("Events"),
    icon: Calendar,
  },
  {
    title: "Messages",
    url: createPageUrl("Messages"),
    icon: MessageCircle,
  },
  {
    title: "Riders",
    url: createPageUrl("Riders"),
    icon: Users,
  },
  {
    title: "Profile",
    url: createPageUrl("Profile"),
    icon: Settings,
  },
];

const organizerBadgeColors = {
  bronze: "bg-amber-600",
  silver: "bg-gray-400", 
  gold: "bg-yellow-500",
  platinum: "bg-purple-500"
};

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.log("User not authenticated");
    }
  };

  const currentPage = navigationItems.find(item => location.pathname === item.url);

  return (
    <div className="min-h-screen bg-zinc-900">
      <style>{`
        :root {
          --background: 15 15 17;
          --foreground: 245 245 245;
          --card: 22 22 26;
          --card-foreground: 245 245 245;
          --popover: 22 22 26;
          --popover-foreground: 245 245 245;
          --primary: 139 92 246;
          --primary-foreground: 255 255 255;
          --secondary: 39 39 42;
          --secondary-foreground: 245 245 245;
          --muted: 39 39 42;
          --muted-foreground: 161 161 170;
          --accent: 139 92 246;
          --accent-foreground: 255 255 255;
          --destructive: 239 68 68;
          --destructive-foreground: 255 255 255;
          --border: 39 39 42;
          --input: 39 39 42;
          --ring: 139 92 246;
        }
        
        body {
          background: rgb(15 15 17);
          color: rgb(245 245 245);
        }
        
        .gradient-bg {
          background: linear-gradient(135deg, rgb(15 15 17) 0%, rgb(22 22 26) 50%, rgb(30 25 35) 100%);
        }
        
        .purple-gradient {
          background: linear-gradient(135deg, rgb(139 92 246) 0%, rgb(168 85 247) 100%);
        }

        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
      
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur-xl border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 purple-gradient rounded-lg flex items-center justify-center">
              <Bike className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-white text-lg">RiderConnect</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="text-zinc-400">
              <Bell className="w-5 h-5" />
            </Button>
            
            {user && (
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="text-zinc-400"
              >
                {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}
          </div>
        </div>

        {/* Page Title */}
        {currentPage && (
          <div className="mt-2">
            <h2 className="text-xl font-semibold text-white">{currentPage.title}</h2>
          </div>
        )}
      </header>

      {/* Mobile Slide-out Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowMobileMenu(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-zinc-900 border-l border-zinc-800 p-6">
            {user && (
              <div className="flex items-center gap-3 mb-8">
                <Avatar className="w-12 h-12 border-2 border-purple-500/50">
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback className="bg-purple-500 text-white font-bold">
                    {user.full_name?.charAt(0) || 'R'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-white">{user.full_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    {user.is_organizer && user.organizer_badge && (
                      <Badge className={`${organizerBadgeColors[user.organizer_badge]} text-white text-xs px-2 py-0.5`}>
                        <Trophy className="w-3 h-3 mr-1" />
                        {user.organizer_badge}
                      </Badge>
                    )}
                    <p className="text-xs text-zinc-400">{user.location}</p>
                  </div>
                </div>
              </div>
            )}
            
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Link 
                  key={item.title}
                  to={item.url} 
                  onClick={() => setShowMobileMenu(false)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                    location.pathname === item.url 
                      ? 'bg-purple-500/20 text-purple-400' 
                      : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-xl border-t border-zinc-800 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-2">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link 
                key={item.title}
                to={item.url}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-purple-400' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-purple-400' : ''}`}>
                  {item.title}
                </span>
                {isActive && (
                  <div className="w-4 h-0.5 bg-purple-400 rounded-full mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}