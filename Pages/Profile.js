import React, { useState, useEffect } from "react";
import { User } from "@/entities/User";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Edit, 
  Trophy, 
  Calendar,
  MapPin,
  Instagram,
  Youtube,
  Music2,
  Plus,
  Bike
} from "lucide-react";

import EditProfileDialog from "../components/profile/EditProfileDialog";
import BikeCard from "../components/profile/BikeCard";
import AddBikeDialog from "../components/profile/AddBikeDialog";

const organizerBadgeColors = {
  bronze: "bg-amber-600 text-white",
  silver: "bg-gray-400 text-white", 
  gold: "bg-yellow-500 text-white",
  platinum: "bg-purple-500 text-white"
};

export default function Profile() {
  const [user, setUser] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddBikeDialog, setShowAddBikeDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setIsLoading(false);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      await User.updateMyUserData(updatedData);
      setUser({ ...user, ...updatedData });
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleAddBike = async (bikeData) => {
    try {
      const updatedBikes = [...(user.bikes || []), bikeData];
      await User.updateMyUserData({ bikes: updatedBikes });
      setUser({ ...user, bikes: updatedBikes });
      setShowAddBikeDialog(false);
    } catch (error) {
      console.error("Error adding bike:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-48 bg-zinc-800 rounded-xl"></div>
          <div className="h-32 bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-4 text-center text-zinc-400">
        <p>Unable to load profile. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800 overflow-hidden">
        <div className="relative h-24 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-800">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        
        <CardContent className="relative -mt-12 pb-6">
          <div className="flex flex-col items-center text-center space-y-4">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-zinc-900 shadow-xl">
                <AvatarImage src={user.avatar_url} />
                <AvatarFallback className="bg-purple-600 text-white text-2xl font-bold">
                  {user.full_name?.charAt(0) || 'R'}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon"
                className="absolute bottom-0 right-0 bg-purple-600 hover:bg-purple-700 rounded-full w-7 h-7"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>

            {/* Profile Info */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold text-white">{user.full_name}</h1>
                  {user.is_organizer && user.organizer_badge && (
                    <Badge className={`${organizerBadgeColors[user.organizer_badge]} px-2 py-1`}>
                      <Trophy className="w-3 h-3 mr-1" />
                      {user.organizer_badge}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-center gap-4 text-zinc-400 text-sm flex-wrap">
                  {user.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  {user.rider_since && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>Since {new Date(user.rider_since).getFullYear()}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button 
                onClick={() => setShowEditDialog(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>

            {/* Bio */}
            {user.bio && (
              <p className="text-zinc-300 leading-relaxed text-sm px-4">{user.bio}</p>
            )}

            {/* Social Links */}
            {(user.instagram_handle || user.tiktok_handle || user.youtube_channel) && (
              <div className="flex justify-center gap-4 flex-wrap">
                {user.instagram_handle && (
                  <a 
                    href={`https://instagram.com/${user.instagram_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors text-sm"
                  >
                    <Instagram className="w-4 h-4" />
                    <span>@{user.instagram_handle}</span>
                  </a>
                )}
                {user.tiktok_handle && (
                  <a 
                    href={`https://tiktok.com/@${user.tiktok_handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-white hover:text-zinc-300 transition-colors text-sm"
                  >
                    <Music2 className="w-4 h-4" />
                    <span>@{user.tiktok_handle}</span>
                  </a>
                )}
                {user.youtube_channel && (
                  <a 
                    href={user.youtube_channel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bikes Section */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
              <Bike className="w-5 h-5 text-purple-400" />
              My Bikes ({user.bikes?.length || 0})
            </CardTitle>
            <Button 
              onClick={() => setShowAddBikeDialog(true)}
              size="sm"
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {user.bikes && user.bikes.length > 0 ? (
            <div className="space-y-4">
              {user.bikes.map((bike, index) => (
                <BikeCard key={index} bike={bike} mobile={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-zinc-400">
              <Bike className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
              <h3 className="text-lg font-semibold text-white mb-2">No bikes added yet</h3>
              <p className="mb-4 text-sm">Show off your ride!</p>
              <Button 
                onClick={() => setShowAddBikeDialog(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Bike
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <EditProfileDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        user={user}
        onUpdateProfile={handleUpdateProfile}
      />

      <AddBikeDialog
        open={showAddBikeDialog}
        onOpenChange={setShowAddBikeDialog}
        onAddBike={handleAddBike}
      />
    </div>
  );
}