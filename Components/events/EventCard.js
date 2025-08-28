import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Star,
  Trophy,
  CheckCircle
} from "lucide-react";
import { format } from "date-fns";

const eventTypeColors = {
  fnr: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  weekend_ride: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  meetup: "bg-green-500/20 text-green-400 border-green-500/30",
  track_day: "bg-red-500/20 text-red-400 border-red-500/30",
  charity_ride: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  sponsored_event: "bg-orange-500/20 text-orange-400 border-orange-500/30"
};

const difficultyColors = {
  beginner: "bg-green-500/20 text-green-400",
  intermediate: "bg-yellow-500/20 text-yellow-400",
  advanced: "bg-red-500/20 text-red-400"
};

export default function EventCard({ 
  event, 
  currentUser, 
  onJoinEvent, 
  isOwner = false, 
  isAttending = false,
  mobile = false
}) {
  const isAlreadyAttending = event.attendees?.some(a => a.user_id === currentUser?.id);
  const attendeeCount = event.attendees?.length || 0;
  const isEventPast = new Date(event.date) < new Date();

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800 hover:border-purple-500/30 transition-all duration-200 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <Badge className={`${eventTypeColors[event.event_type]} border text-xs px-2 py-1`}>
                {event.event_type.toUpperCase().replace('_', ' ')}
              </Badge>
              {event.is_sponsored && (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400/30 text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Sponsored
                </Badge>
              )}
              {isOwner && (
                <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                  <Trophy className="w-3 h-3 mr-1" />
                  Organizer
                </Badge>
              )}
            </div>
            
            <h3 className="font-bold text-white text-lg leading-tight mb-3">{event.title}</h3>
            
            {/* Event Details */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(event.date), "MMM d, yyyy 'at' h:mm a")}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{event.meeting_point}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-sm text-zinc-400">
                  <Users className="w-4 h-4" />
                  <span>{attendeeCount} riders</span>
                  {event.max_participants && (
                    <span className="text-zinc-500">/ {event.max_participants}</span>
                  )}
                </div>
                {event.distance_km && (
                  <Badge className={`${difficultyColors[event.difficulty_level]} text-xs`}>
                    {event.difficulty_level} • {event.distance_km}km
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-zinc-300 text-sm leading-relaxed line-clamp-2 mt-3">
            {event.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        {/* Action Button */}
        <div className="space-y-3">
          {isEventPast ? (
            <Button disabled className="w-full bg-zinc-700 text-zinc-400">
              Event Completed
            </Button>
          ) : isAlreadyAttending || isAttending ? (
            <Button disabled className="w-full bg-green-600/20 text-green-400 border border-green-400/30">
              <CheckCircle className="w-4 h-4 mr-2" />
              Joined
            </Button>
          ) : isOwner ? (
            <Button variant="outline" className="w-full border-purple-500/30 text-purple-400 hover:bg-purple-600 hover:text-white">
              Manage Event
            </Button>
          ) : (
            <Button 
              onClick={() => onJoinEvent(event.id)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
              disabled={event.max_participants && attendeeCount >= event.max_participants}
            >
              {event.max_participants && attendeeCount >= event.max_participants 
                ? "Event Full" 
                : "Join Ride"
              }
            </Button>
          )}

          {/* Sponsor Info */}
          {event.is_sponsored && event.sponsor_name && (
            <div className="p-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <p className="text-xs text-yellow-400">
                Sponsored by <span className="font-medium">{event.sponsor_name}</span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}