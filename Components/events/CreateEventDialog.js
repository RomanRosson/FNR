import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";

export default function CreateEventDialog({ open, onOpenChange, onCreateEvent }) {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    event_type: "fnr",
    date: "",
    meeting_point: "",
    destination: "",
    max_participants: "",
    difficulty_level: "beginner",
    distance_km: ""
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsCreating(true);

    try {
      await onCreateEvent({
        ...eventData,
        max_participants: eventData.max_participants ? parseInt(eventData.max_participants) : null,
        distance_km: eventData.distance_km ? parseFloat(eventData.distance_km) : null
      });
      
      // Reset form
      setEventData({
        title: "",
        description: "",
        event_type: "fnr",
        date: "",
        meeting_point: "",
        destination: "",
        max_participants: "",
        difficulty_level: "beginner",
        distance_km: ""
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }

    setIsCreating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Event</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div>
            <Label htmlFor="title" className="text-zinc-300">Event Title</Label>
            <Input
              id="title"
              placeholder="Friday Night Ride - City Circuit"
              value={eventData.title}
              onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          {/* Event Type & Difficulty */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-zinc-300">Event Type</Label>
              <Select value={eventData.event_type} onValueChange={(value) => setEventData({ ...eventData, event_type: value })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="fnr">Friday Night Ride</SelectItem>
                  <SelectItem value="weekend_ride">Weekend Ride</SelectItem>
                  <SelectItem value="meetup">Meetup</SelectItem>
                  <SelectItem value="track_day">Track Day</SelectItem>
                  <SelectItem value="charity_ride">Charity Ride</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-zinc-300">Difficulty</Label>
              <Select value={eventData.difficulty_level} onValueChange={(value) => setEventData({ ...eventData, difficulty_level: value })}>
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700">
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Date & Time */}
          <div>
            <Label htmlFor="date" className="text-zinc-300">Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              value={eventData.date}
              onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          {/* Meeting Point */}
          <div>
            <Label htmlFor="meeting_point" className="text-zinc-300">Meeting Point</Label>
            <Input
              id="meeting_point"
              placeholder="McDonald's Parramatta, 123 Church St"
              value={eventData.meeting_point}
              onChange={(e) => setEventData({ ...eventData, meeting_point: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
              required
            />
          </div>

          {/* Destination */}
          <div>
            <Label htmlFor="destination" className="text-zinc-300">Destination (Optional)</Label>
            <Input
              id="destination"
              placeholder="Royal National Park"
              value={eventData.destination}
              onChange={(e) => setEventData({ ...eventData, destination: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          {/* Distance & Max Participants */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="distance" className="text-zinc-300">Distance (km)</Label>
              <Input
                id="distance"
                type="number"
                placeholder="120"
                value={eventData.distance_km}
                onChange={(e) => setEventData({ ...eventData, distance_km: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="max_participants" className="text-zinc-300">Max Riders</Label>
              <Input
                id="max_participants"
                type="number"
                placeholder="15"
                value={eventData.max_participants}
                onChange={(e) => setEventData({ ...eventData, max_participants: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-zinc-300">Description</Label>
            <Textarea
              id="description"
              placeholder="Join us for an epic Friday night ride through the city! We'll meet at McDonald's and cruise through some amazing routes. Perfect for intermediate riders..."
              value={eventData.description}
              onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white h-24 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isCreating ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}