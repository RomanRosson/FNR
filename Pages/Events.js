import React, { useState, useEffect, useCallback } from "react";
import { Event } from "@/entities/Event";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  Plus,
  Filter,
  Search,
  Star
} from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import EventCard from "../components/events/EventCard";
import CreateEventDialog from "../components/events/CreateEventDialog";
import EventFilters from "../components/events/EventFilters";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    eventType: "all",
    difficulty: "all",
    timeframe: "upcoming"
  });
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const filterEvents = useCallback(() => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.meeting_point.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by event type
    if (selectedFilters.eventType !== "all") {
      filtered = filtered.filter(event => event.event_type === selectedFilters.eventType);
    }

    // Filter by difficulty
    if (selectedFilters.difficulty !== "all") {
      filtered = filtered.filter(event => event.difficulty_level === selectedFilters.difficulty);
    }

    // Filter by timeframe
    if (selectedFilters.timeframe === "upcoming") {
      filtered = filtered.filter(event => new Date(event.date) >= new Date());
    } else if (selectedFilters.timeframe === "past") {
      filtered = filtered.filter(event => new Date(event.date) < new Date());
    }

    setFilteredEvents(filtered);
  }, [events, searchTerm, selectedFilters]);

  useEffect(() => {
    loadEventsAndUser();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [filterEvents]);

  const loadEventsAndUser = async () => {
    setIsLoading(true);
    try {
      const [eventsData, userData] = await Promise.all([
        Event.list("-date"),
        User.me()
      ]);
      setEvents(eventsData);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateEvent = async (eventData) => {
    try {
      const newEvent = await Event.create({
        ...eventData,
        organizer_id: currentUser.id,
        attendees: []
      });
      setEvents(prev => [newEvent, ...prev]);
      setShowCreateDialog(false);
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleJoinEvent = async (eventId) => {
    try {
      const event = events.find(e => e.id === eventId);
      const updatedAttendees = [
        ...(event.attendees || []),
        {
          user_id: currentUser.id,
          rsvp_date: new Date().toISOString(),
          bike_bringing: currentUser.bikes?.[0]?.make + " " + currentUser.bikes?.[0]?.model || "TBD"
        }
      ];
      
      await Event.update(eventId, { attendees: updatedAttendees });
      setEvents(prev => prev.map(e => e.id === eventId ? { ...e, attendees: updatedAttendees } : e));
    } catch (error) {
      console.error("Error joining event:", error);
    }
  };

  const myEvents = filteredEvents.filter(event => event.organizer_id === currentUser?.id);
  const joinedEvents = filteredEvents.filter(event => 
    event.attendees?.some(attendee => attendee.user_id === currentUser?.id)
  );

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 font-semibold rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          placeholder="Search events or locations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400 rounded-xl"
        />
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="border-zinc-700 text-zinc-300 hover:bg-zinc-800"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
        <p className="text-sm text-zinc-400">{filteredEvents.length} events</p>
      </div>

      {/* Filters */}
      {showFilters && (
        <EventFilters 
          filters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          mobile={true}
        />
      )}

      {/* Event Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="bg-zinc-800/50 border-zinc-700 w-full">
          <TabsTrigger value="all" className="flex-1 data-[state=active]:bg-purple-600">
            All ({filteredEvents.length})
          </TabsTrigger>
          <TabsTrigger value="my-events" className="flex-1 data-[state=active]:bg-purple-600">
            Mine ({myEvents.length})
          </TabsTrigger>
          <TabsTrigger value="joined" className="flex-1 data-[state=active]:bg-purple-600">
            Joined ({joinedEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-48 bg-zinc-800/50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="space-y-4">
              {filteredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  currentUser={currentUser}
                  onJoinEvent={handleJoinEvent}
                  mobile={true}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800">
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
                <h3 className="text-xl font-semibold text-white mb-2">No events found</h3>
                <p className="text-zinc-400 mb-6">Try adjusting your search or filters, or create a new event!</p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Event
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-events">
          <div className="space-y-4">
            {myEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUser={currentUser}
                onJoinEvent={handleJoinEvent}
                isOwner={true}
                mobile={true}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="joined">
          <div className="space-y-4">
            {joinedEvents.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                currentUser={currentUser}
                onJoinEvent={handleJoinEvent}
                isAttending={true}
                mobile={true}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Event Dialog */}
      <CreateEventDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
}