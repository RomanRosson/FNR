import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const colorClasses = {
  purple: "from-purple-600 to-purple-700",
  blue: "from-blue-600 to-blue-700",
  green: "from-green-600 to-green-700",
  orange: "from-orange-600 to-orange-700"
};

export default function QuickStats({ title, value, icon: Icon, trend, color = "purple", compact = false }) {
  return (
    <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800 hover:border-purple-500/30 transition-all duration-200">
      <CardContent className={compact ? "p-4" : "p-6"}>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-xs font-medium">{title}</p>
            <p className={`font-bold text-white mt-1 ${compact ? 'text-xl' : 'text-3xl'}`}>{value}</p>
            {trend && !compact && (
              <div className="flex items-center mt-2 text-xs">
                <TrendingUp className="w-3 h-3 mr-1 text-green-400" />
                <span className="text-green-400 font-medium">{trend}</span>
              </div>
            )}
          </div>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]} bg-opacity-20 shadow-lg ${compact ? 'p-2' : 'p-3'}`}>
            <Icon className={`text-white ${compact ? 'w-4 h-4' : 'w-6 h-6'}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}