import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function AddBikeDialog({ open, onOpenChange, onAddBike }) {
  const [bikeData, setBikeData] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    image_url: "",
    is_primary: false
  });
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      await onAddBike({
        ...bikeData,
        year: bikeData.year ? parseInt(bikeData.year) : null
      });
      
      // Reset form
      setBikeData({
        make: "",
        model: "",
        year: "",
        color: "",
        image_url: "",
        is_primary: false
      });
    } catch (error) {
      console.error("Error adding bike:", error);
    }
    
    setIsAdding(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Add New Bike</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Make & Model */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="make" className="text-zinc-300">Make</Label>
              <Input
                id="make"
                placeholder="Yamaha"
                value={bikeData.make}
                onChange={(e) => setBikeData({ ...bikeData, make: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="model" className="text-zinc-300">Model</Label>
              <Input
                id="model"
                placeholder="R1"
                value={bikeData.model}
                onChange={(e) => setBikeData({ ...bikeData, model: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>
          </div>

          {/* Year & Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="year" className="text-zinc-300">Year</Label>
              <Input
                id="year"
                type="number"
                placeholder="2023"
                value={bikeData.year}
                onChange={(e) => setBikeData({ ...bikeData, year: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <div>
              <Label htmlFor="color" className="text-zinc-300">Color</Label>
              <Input
                id="color"
                placeholder="Matte Black"
                value={bikeData.color}
                onChange={(e) => setBikeData({ ...bikeData, color: e.target.value })}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <Label htmlFor="image_url" className="text-zinc-300">Image URL (Optional)</Label>
            <Input
              id="image_url"
              placeholder="https://example.com/my-bike-photo.jpg"
              value={bikeData.image_url}
              onChange={(e) => setBikeData({ ...bikeData, image_url: e.target.value })}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>

          {/* Primary Bike */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_primary"
              checked={bikeData.is_primary}
              onCheckedChange={(checked) => setBikeData({ ...bikeData, is_primary: checked })}
              className="border-zinc-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
            />
            <Label htmlFor="is_primary" className="text-zinc-300 text-sm">
              Set as primary bike
            </Label>
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
              disabled={isAdding}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              {isAdding ? "Adding..." : "Add Bike"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}