
import React from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button"; // Note: Button is imported but not used in the provided code snippets. Retaining as per original.
import { Filter } from "lucide-react";

export default function EventFilters({ filters, onFiltersChange, mobile = false }) {
  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  if (mobile) {
    return (
      <div className="grid grid-cols-1 gap-3">
        <Select value={filters.eventType} onValueChange={(value) => handleFilterChange("eventType", value)}>
          <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
            <SelectValue placeholder="Event Type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="fnr">Friday Night Ride</SelectItem>
            <SelectItem value="weekend_ride">Weekend Ride</SelectItem>
            <SelectItem value="meetup">Meetup</SelectItem>
            <SelectItem value="track_day">Track Day</SelectItem>
            <SelectItem value="charity_ride">Charity Ride</SelectItem>
            <SelectItem value="sponsored_event">Sponsored Event</SelectItem>
          </SelectContent>
        </Select>

        <div className="grid grid-cols-2 gap-3">
          <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange("difficulty", value)}>
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.timeframe} onValueChange={(value) => handleFilterChange("timeframe", value)}>
            <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-white">
              <SelectValue placeholder="Timeframe" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700">
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past Events</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <div className="flex gap-3 items-center">
      <Filter className="w-4 h-4 text-zinc-400" />
      
      <Select value={filters.eventType} onValueChange={(value) => handleFilterChange("eventType", value)}>
        <SelectTrigger className="w-40 bg-zinc-800/50 border-zinc-700 text-white">
          <SelectValue placeholder="Event Type" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="fnr">Friday Night Ride</SelectItem>
          <SelectItem value="weekend_ride">Weekend Ride</SelectItem>
          <SelectItem value="meetup">Meetup</SelectItem>
          <SelectItem value="track_day">Track Day</SelectItem>
          <SelectItem value="charity_ride">Charity Ride</SelectItem>
          <SelectItem value="sponsored_event">Sponsored Event</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange("difficulty", value)}>
        <SelectTrigger className="w-32 bg-zinc-800/50 border-zinc-700 text-white">
          <SelectValue placeholder="Difficulty" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          <SelectItem value="all">All Levels</SelectItem>
          <SelectItem value="beginner">Beginner</SelectItem>
          <SelectItem value="intermediate">Intermediate</SelectItem>
          <SelectItem value="advanced">Advanced</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.timeframe} onValueChange={(value) => handleFilterChange("timeframe", value)}>
        <SelectTrigger className="w-32 bg-zinc-800/50 border-zinc-700 text-white">
          <SelectValue placeholder="Timeframe" />
        </SelectTrigger>
        <SelectContent className="bg-zinc-800 border-zinc-700">
          <SelectItem value="all">All Events</SelectItem>
          <SelectItem value="upcoming">Upcoming</SelectItem>
          <SelectItem value="past">Past Events</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
