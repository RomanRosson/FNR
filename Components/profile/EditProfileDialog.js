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

export default function EditProfileDialog({ open, onOpenChange, user, onUpdateProfile }) {
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    location: user?.location || "",
    instagram_handle: user?.instagram_handle || "",
    tiktok_handle: user?.tiktok_handle || "",
    youtube_channel: user?.youtube_channel || "",
    rider_since: user?.rider_since || ""
  });
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await onUpdateProfile(formData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
    
    setIsUpdating(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Bio */}
          <div>
            <Label htmlFor="bio" className="text-zinc-300">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about yourself and your riding passion..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white h-20 resize-none"
            />
          </div>

          {/* Location */}
          <div>
            <Label htmlFor="location" className="text-zinc-300">Location</Label>
            <Input
              id="location"
              placeholder="Sydney, NSW"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          {/* Rider Since */}
          <div>
            <Label htmlFor="rider_since" className="text-zinc-300">Riding Since</Label>
            <Input
              id="rider_since"
              type="date"
              value={formData.rider_since}
              onChange={(e) => setFormData({ ...formData, rider_since: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          {/* Social Media */}
          <div>
            <Label htmlFor="instagram" className="text-zinc-300">Instagram Handle</Label>
            <Input
              id="instagram"
              placeholder="your_username"
              value={formData.instagram_handle}
              onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="tiktok" className="text-zinc-300">TikTok Handle</Label>
            <Input
              id="tiktok"
              placeholder="your_username"
              value={formData.tiktok_handle}
              onChange={(e) => setFormData({ ...formData, tiktok_handle: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          <div>
            <Label htmlFor="youtube" className="text-zinc-300">YouTube Channel URL</Label>
            <Input
              id="youtube"
              placeholder="https://youtube.com/@yourchannel"
              value={formData.youtube_channel}
              onChange={(e) => setFormData({ ...formData, youtube_channel: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
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
              disabled={isUpdating}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}