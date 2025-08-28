import React, { useState, useEffect } from "react";
import { Event } from "@/entities/Event";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  TrendingUp,
  Zap,
  Trophy,
  Plus,
  ArrowRight
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

import FeedPost from "../components/dashboard/FeedPost";
import QuickStats from "../components/dashboard/QuickStats";
import WeatherWidget from "../components/dashboard/WeatherWidget";

const eventTypeColors = {
  fnr: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  weekend_ride: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  meetup: "bg-green-500/20 text-green-400 border-green-500/30",
  track_day: "bg-red-500/20 text-red-400 border-red-500/30",
  charity_ride: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  sponsored_event: "bg-orange-500/20 text-orange-400 border-orange-500/30"
};

export default function Dashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentRiders, setRecentRiders] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [events, riders, user] = await Promise.all([
        Event.filter({ status: "upcoming" }, "-date", 5),
        User.list("-created_date", 8),
        User.me()
      ]);
      setUpcomingEvents(events);
      setRecentRiders(riders);
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-zinc-800 rounded-xl"></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-zinc-800 rounded-xl"></div>
            <div className="h-20 bg-zinc-800 rounded-xl"></div>
          </div>
          <div className="h-48 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800 p-6 text-white">
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-2">
            G'day, {currentUser?.full_name?.split(' ')[0] || 'Rider'}! 🏍️
          </h1>
          <p className="text-purple-100 text-sm mb-4">
            Ready to hit the road? Check out what's happening in the community.
          </p>
          <Link to={createPageUrl("Events")}>
            <Button className="bg-white text-purple-600 hover:bg-purple-50 font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </Link>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full transform translate-x-10 -translate-y-10"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <QuickStats
          title="Total Events"
          value={upcomingEvents.length}
          icon={Calendar}
          color="purple"
          compact={true}
        />
        <QuickStats
          title="Active Riders"
          value={recentRiders.length}
          icon={Users}
          color="blue"
          compact={true}
        />
      </div>

      {/* Weather Widget */}
      <WeatherWidget />

      {/* Upcoming Events */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              Upcoming Rides
            </CardTitle>
            <Link to={createPageUrl("Events")}>
              <Button variant="ghost" size="sm" className="text-zinc-300 hover:text-white p-2">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingEvents.length > 0 ? (
            upcomingEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white text-sm">{event.title}</h3>
                      <Badge className={`${eventTypeColors[event.event_type]} border text-xs`}>
                        {event.event_type.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-xs text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(event.date), "MMM d, h:mm a")}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{event.meeting_point}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {event.attendees?.length || 0} riders
                      </div>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                  Join Ride
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-zinc-400">
              <Calendar className="w-10 h-10 mx-auto mb-3 text-zinc-600" />
              <p className="text-sm">No upcoming events yet.</p>
              <p className="text-xs mt-1">Be the first to organize a ride!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity Feed */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white px-1">Community Feed</h2>
        
        <FeedPost
          user={{
            name: "Jake Thompson",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
            location: "Sydney, NSW",
            is_organizer: true,
            organizer_badge: "gold"
          }}
          content="Just picked up my new Yamaha R1! Can't wait to take her out on the next FNR. Who's keen for a ride this Friday? 🔥"
          image="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop"
          timestamp="2 hours ago"
          likes={23}
          comments={8}
        />
        
        <FeedPost
          user={{
            name: "Sarah Mitchell",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
            location: "Melbourne, VIC",
            is_organizer: false
          }}
          content="Epic ride through the Great Ocean Road yesterday! The views were absolutely incredible. Thanks to everyone who joined - already planning the next one 🌊"
          image="https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&h=400&fit=crop"
          timestamp="1 day ago"
          likes={47}
          comments={15}
        />
      </div>

      {/* New Riders */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            New Riders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recentRiders.slice(0, 5).map((rider, index) => (
              <div key={rider.id} className="flex flex-col items-center gap-2 min-w-[80px]">
                <Avatar className="w-12 h-12 border-2 border-purple-500/30">
                  <AvatarImage src={rider.avatar_url} />
                  <AvatarFallback className="bg-purple-600 text-white text-sm font-bold">
                    {rider.full_name?.charAt(0) || 'R'}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-medium text-white text-xs truncate w-20">{rider.full_name}</p>
                  <p className="text-xs text-zinc-400 truncate w-20">{rider.location || 'Australia'}</p>
                </div>
                {rider.is_organizer && (
                  <Trophy className="w-3 h-3 text-yellow-400" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}