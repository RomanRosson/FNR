import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, CloudRain, Sun, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function WeatherWidget() {
  // Mock weather data - in real app this would come from weather API
  const weatherData = {
    location: "Sydney, NSW",
    current: {
      temp: 22,
      condition: "Partly Cloudy",
      icon: Cloud,
      windSpeed: 15
    },
    forecast: [
      { day: "Today", icon: Cloud, high: 24, low: 18, rain: 20 },
      { day: "Tomorrow", icon: CloudRain, high: 19, low: 15, rain: 80 },
      { day: "Friday", icon: Sun, high: 26, low: 20, rain: 10 }
    ],
    alerts: [
      { type: "rain", message: "Rain expected tomorrow - not ideal for riding" }
    ]
  };

  return (
    <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
          <Sun className="w-5 h-5 text-yellow-400" />
          Riding Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Weather */}
        <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded-xl">
          <div className="flex items-center gap-3">
            <weatherData.current.icon className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-xl font-bold text-white">{weatherData.current.temp}°C</p>
              <p className="text-zinc-400 text-xs">{weatherData.current.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-zinc-300 text-sm font-medium">{weatherData.location}</p>
            <p className="text-zinc-500 text-xs">Wind: {weatherData.current.windSpeed} km/h</p>
          </div>
        </div>

        {/* 3-Day Forecast */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-zinc-300">3-Day Forecast</h4>
          <div className="flex gap-2 overflow-x-auto">
            {weatherData.forecast.map((day, index) => (
              <div key={index} className="flex flex-col items-center min-w-[70px] p-2 bg-zinc-800/20 rounded-lg">
                <day.icon className={`w-5 h-5 mb-1 ${day.rain > 50 ? 'text-blue-400' : 'text-yellow-400'}`} />
                <span className="text-zinc-300 text-xs font-medium">{day.day}</span>
                <div className="flex items-center gap-1 text-xs mt-1">
                  <span className="text-white font-medium">{day.high}°</span>
                  <span className="text-zinc-400">{day.low}°</span>
                </div>
                <Badge variant="outline" className={`text-xs px-1 py-0 mt-1 ${
                  day.rain > 50 ? 'text-blue-400 border-blue-400/30' : 'text-green-400 border-green-400/30'
                }`}>
                  {day.rain}%
                </Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        {weatherData.alerts.length > 0 && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-yellow-400 font-medium text-sm">Rider Alert</p>
                <p className="text-yellow-200 text-xs mt-1">{weatherData.alerts[0].message}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}