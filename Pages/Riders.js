
import React, { useState, useEffect, useCallback } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Calendar,
  Trophy,
  MessageCircle,
  Users,
  Bike
} from "lucide-react";
import { format } from "date-fns";

const organizerBadgeColors = {
  bronze: "bg-amber-600 text-white",
  silver: "bg-gray-400 text-white", 
  gold: "bg-yellow-500 text-white",
  platinum: "bg-purple-500 text-white"
};

export default function Riders() {
  const [riders, setRiders] = useState([]);
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const filterRiders = useCallback(() => {
    let filtered = riders;

    if (searchTerm) {
      filtered = filtered.filter(rider => 
        rider.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rider.location?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRiders(filtered);
  }, [riders, searchTerm]);

  useEffect(() => {
    loadRiders();
  }, []);

  useEffect(() => {
    filterRiders();
  }, [filterRiders]); // Updated dependency: now depends on the memoized filterRiders function

  const loadRiders = async () => {
    setIsLoading(true);
    try {
      const [ridersData, userData] = await Promise.all([
        User.list("-created_date"),
        User.me()
      ]);
      
      // Filter out current user
      const otherRiders = ridersData.filter(rider => rider.id !== userData.id);
      setRiders(otherRiders);
      setCurrentUser(userData);
    } catch (error) {
      console.error("Error loading riders:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-32 bg-zinc-800 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <Input
          placeholder="Search riders by name or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-zinc-800/50 border-zinc-700 text-white placeholder-zinc-400 rounded-xl"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-400" />
            <p className="text-2xl font-bold text-white">{filteredRiders.length}</p>
            <p className="text-sm text-zinc-400">Active Riders</p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-zinc-800">
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 mx-auto mb-2 text-yellow-400" />
            <p className="text-2xl font-bold text-white">
              {filteredRiders.filter(r => r.is_organizer).length}
            </p>
            <p className="text-sm text-zinc-400">Organizers</p>
          </CardContent>
        </Card>
      </div>

      {/* Riders List */}
      <div className="space-y-4">
        {filteredRiders.length > 0 ? (
          filteredRiders.map((rider) => (
            <Card key={rider.id} className="bg-zinc-900/50 border-zinc-800 hover:border-purple-500/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-2 border-purple-500/30 flex-shrink-0">
                    <AvatarImage src={rider.avatar_url} />
                    <AvatarFallback className="bg-purple-600 text-white font-bold text-lg">
                      {rider.full_name?.charAt(0) || 'R'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-white text-lg">{rider.full_name}</h3>
                          {rider.is_organizer && rider.organizer_badge && (
                            <Badge className={`${organizerBadgeColors[rider.organizer_badge]} text-xs px-2 py-1`}>
                              <Trophy className="w-3 h-3 mr-1" />
                              {rider.organizer_badge}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1 text-sm text-zinc-400">
                          {rider.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{rider.location}</span>
                            </div>
                          )}
                          {rider.rider_since && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>Riding since {new Date(rider.rider_since).getFullYear()}</span>
                            </div>
                          )}
                          {rider.bikes && rider.bikes.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Bike className="w-4 h-4" />
                              <span>{rider.bikes.length} bike{rider.bikes.length !== 1 ? 's' : ''}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bio */}
                    {rider.bio && (
                      <p className="text-zinc-300 text-sm leading-relaxed mb-3 line-clamp-2">
                        {rider.bio}
                      </p>
                    )}

                    {/* Primary Bike */}
                    {rider.bikes && rider.bikes.length > 0 && (
                      <div className="mb-3">
                        {rider.bikes.filter(bike => bike.is_primary).map((bike, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-zinc-800/30 rounded-lg">
                            {bike.image_url ? (
                              <img 
                                src={bike.image_url} 
                                alt={`${bike.make} ${bike.model}`}
                                className="w-12 h-12 object-cover rounded-lg"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-zinc-700 rounded-lg flex items-center justify-center">
                                <Bike className="w-6 h-6 text-zinc-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-white text-sm">{bike.make} {bike.model}</p>
                              <p className="text-xs text-zinc-400">{bike.year} • {bike.color}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Button */}
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      size="sm"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-zinc-900/50 border-zinc-800">
            <CardContent className="text-center py-12">
              <Users className="w-16 h-16 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-xl font-semibold text-white mb-2">No riders found</h3>
              <p className="text-zinc-400">Try adjusting your search terms</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
