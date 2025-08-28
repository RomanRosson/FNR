import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bike, Star } from "lucide-react";

export default function BikeCard({ bike, mobile = false }) {
  if (mobile) {
    return (
      <Card className="bg-zinc-800/50 border-zinc-700 overflow-hidden">
        <div className="flex">
          <div className="w-24 h-24 bg-zinc-800 flex-shrink-0">
            {bike.image_url ? (
              <img 
                src={bike.image_url} 
                alt={`${bike.make} ${bike.model}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <Bike className="w-8 h-8" />
              </div>
            )}
          </div>
          
          <CardContent className="flex-1 p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-white">{bike.make} {bike.model}</h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-zinc-400">
                  <span>{bike.year}</span>
                  {bike.color && (
                    <>
                      <span>•</span>
                      <span>{bike.color}</span>
                    </>
                  )}
                </div>
              </div>
              {bike.is_primary && (
                <Badge className="bg-purple-600 text-white text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Primary
                </Badge>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  // Desktop version (keep existing code)
  return (
    <Card className="bg-zinc-800/50 border-zinc-700 overflow-hidden hover:border-purple-500/30 transition-all duration-200">
      <div className="aspect-[4/3] relative bg-zinc-800">
        {bike.image_url ? (
          <img 
            src={bike.image_url} 
            alt={`${bike.make} ${bike.model}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            <Bike className="w-12 h-12" />
          </div>
        )}
        {bike.is_primary && (
          <Badge className="absolute top-3 right-3 bg-purple-600 text-white">
            <Star className="w-3 h-3 mr-1" />
            Primary
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-bold text-white text-lg">{bike.make} {bike.model}</h3>
        <div className="flex items-center gap-3 mt-2 text-sm text-zinc-400">
          <span>{bike.year}</span>
          {bike.color && (
            <>
              <span>•</span>
              <span>{bike.color}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}