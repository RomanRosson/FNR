import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  Trophy,
  MoreHorizontal
} from "lucide-react";

const organizerBadgeColors = {
  bronze: "bg-amber-600 text-white",
  silver: "bg-gray-400 text-white",
  gold: "bg-yellow-500 text-white",
  platinum: "bg-purple-500 text-white"
};

export default function FeedPost({ 
  user, 
  content, 
  image, 
  timestamp, 
  likes, 
  comments 
}) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-purple-500/30">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-purple-600 text-white font-bold">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-white">{user.name}</h4>
                {user.is_organizer && user.organizer_badge && (
                  <Badge className={`${organizerBadgeColors[user.organizer_badge]} text-xs px-2 py-0.5`}>
                    <Trophy className="w-3 h-3 mr-1" />
                    {user.organizer_badge}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-400">
                <span>{user.location}</span>
                <span>•</span>
                <span>{timestamp}</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <p className="text-zinc-200 mb-4 leading-relaxed">{content}</p>

        {/* Image */}
        {image && (
          <div className="mb-4 rounded-xl overflow-hidden">
            <img 
              src={image} 
              alt="Post image" 
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
          <div className="flex items-center gap-6">
            <Button
              variant="ghost"
              size="sm"
              className={`gap-2 hover:bg-transparent ${
                isLiked ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'
              }`}
              onClick={handleLike}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              <span className="font-medium">{likeCount}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-blue-400 hover:bg-transparent">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{comments}</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="gap-2 text-zinc-400 hover:text-purple-400 hover:bg-transparent">
              <Share className="w-5 h-5" />
              <span className="font-medium">Share</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}