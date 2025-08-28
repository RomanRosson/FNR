# FNR - Friday Night Rides 🏍️

A modern React Native app for Australian motorcycle riders to connect, organize rides, and build community.

## 🎯 Vision

FNR (Friday Night Rides) aims to replace Facebook groups as the primary platform for Australian riders to:
- Connect with other bikers
- Organize and join rides (especially Friday Night Rides)
- Share bike photos and content
- Get real-time weather alerts
- Find nearby riders and events

## ✨ Features

### Core Features
- **Community Feed** - Share rides, bike photos, and updates
- **Event Management** - Create, join, and manage bike meetups
- **Rider Profiles** - Showcase your bikes and social media
- **Messaging** - Direct messages and group chats
- **Weather Integration** - Real-time weather alerts for riders
- **Location Services** - Find nearby riders and events

### Event Types
- **FNR (Friday Night Rides)** - Weekly social rides
- **Scenic Rides** - Day trips and photography rides
- **Track Days** - Performance and training events
- **Social Events** - Meetups and gatherings
- **Sponsored Events** - Brand-sponsored rides

### Role System
- **Bronze** - New organizers
- **Silver** - Regular event hosts
- **Gold** - Experienced organizers
- **Platinum** - Community leaders and brands

## 🎨 Design

### Theme
- **Primary**: Deep Purple (#7C3AED) - Energetic and mysterious
- **Secondary**: Charcoal Black (#0D0D0D) - Background base
- **Accents**: Electric Blue (#00CFFF) and Neon Teal (#39FF14)
- **Overall**: Minimalist, neon-against-dark aesthetic

### Brand Identity
- Logo: "FNR" with stylized headlight glow
- Tagline: "Own the Night"
- Voice: Confident, rider-first, modern

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/fnr-app.git
   cd fnr-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## 📱 App Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Card, Input)
│   ├── dashboard/      # Dashboard-specific components
│   ├── events/         # Event-related components
│   ├── profile/        # Profile components
│   └── riders/         # Rider discovery components
├── screens/            # Main app screens
│   ├── DashboardScreen.js
│   ├── EventsScreen.js
│   ├── MessagesScreen.js
│   ├── RidersScreen.js
│   └── ProfileScreen.js
├── navigation/         # Navigation configuration
│   └── AppNavigator.js
├── theme/              # Design system
│   ├── colors.js       # Color palette
│   ├── typography.js   # Font styles
│   └── spacing.js      # Layout spacing
└── utils/              # Helper functions
```

## 🛠️ Tech Stack

- **Framework**: React Native + Expo
- **Navigation**: React Navigation v6
- **Icons**: Expo Vector Icons (Ionicons)
- **State Management**: React Hooks
- **Styling**: StyleSheet API
- **Maps**: React Native Maps (future)
- **Authentication**: Custom implementation (future)

## 📋 Development Roadmap

### Phase 1 (MVP) - ✅ Complete
- [x] Basic app structure
- [x] Navigation setup
- [x] Theme system
- [x] Dashboard screen
- [x] Events screen
- [x] UI components

### Phase 2 (Core Features)
- [ ] User authentication
- [ ] Profile management
- [ ] Event creation/management
- [ ] Messaging system
- [ ] Location services

### Phase 3 (Advanced Features)
- [ ] Real-time weather integration
- [ ] Map integration with rider locations
- [ ] Social media linking
- [ ] Push notifications
- [ ] Analytics and insights

### Phase 4 (Monetization)
- [ ] Sponsored events
- [ ] Premium features
- [ ] Marketplace integration
- [ ] Brand partnerships

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
# API Configuration
API_BASE_URL=your_api_url_here
API_KEY=your_api_key_here

# Weather API
WEATHER_API_KEY=your_weather_api_key

# Maps API
GOOGLE_MAPS_API_KEY=your_maps_api_key

# Push Notifications
EXPO_PUSH_TOKEN=your_expo_push_token
```

### App Configuration
Update `app.json` with your app details:
- Bundle identifier
- App name and slug
- Icons and splash screen
- Permissions

## 📱 Platform Support

- **iOS**: 13.0+
- **Android**: 8.0+ (API level 26+)
- **Web**: React Native Web support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow React Native best practices
- Use the established theme system
- Write clean, documented code
- Test on both iOS and Android
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Australian motorcycle community for inspiration
- React Native and Expo teams
- Open source contributors
- Beta testers and feedback providers

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/fnr-app/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/fnr-app/discussions)
- **Email**: support@fnr-app.com

---

**Ride Together. Ride FNR.** 🏍️💜
