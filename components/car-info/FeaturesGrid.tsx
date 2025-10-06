'use client';

import React from 'react';
import { 
  Shield, 
  Snowflake, 
  Wifi, 
  Navigation, 
  Music, 
  Car, 
  Zap,
  Users,
  Sun,
  Camera,
  Key,
  Volume2,
  Bluetooth,
  Usb,
  MapPin,
  Phone,
  Settings,
  CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EnhancedCar } from '@/lib/types';
import { cn } from '@/lib/utils';

interface FeaturesGridProps {
  features: string[];
  specifications: EnhancedCar['specifications'];
  categorized?: boolean;
  className?: string;
}

// Feature icon mapping
const getFeatureIcon = (feature: string) => {
  const featureLower = feature.toLowerCase();
  
  if (featureLower.includes('kondisioner') || featureLower.includes('climate')) {
    return <Snowflake className="h-4 w-4" />;
  }
  if (featureLower.includes('gps') || featureLower.includes('naviqasiya') || featureLower.includes('navigation')) {
    return <Navigation className="h-4 w-4" />;
  }
  if (featureLower.includes('bluetooth')) {
    return <Bluetooth className="h-4 w-4" />;
  }
  if (featureLower.includes('usb')) {
    return <Usb className="h-4 w-4" />;
  }
  if (featureLower.includes('wifi')) {
    return <Wifi className="h-4 w-4" />;
  }
  if (featureLower.includes('audio') || featureLower.includes('sound') || featureLower.includes('music')) {
    return <Music className="h-4 w-4" />;
  }
  if (featureLower.includes('camera') || featureLower.includes('rearview')) {
    return <Camera className="h-4 w-4" />;
  }
  if (featureLower.includes('key') || featureLower.includes('smart')) {
    return <Key className="h-4 w-4" />;
  }
  if (featureLower.includes('seat') || featureLower.includes('oturacaq') || featureLower.includes('heated')) {
    return <Users className="h-4 w-4" />;
  }
  if (featureLower.includes('roof') || featureLower.includes('panorama') || featureLower.includes('dam')) {
    return <Sun className="h-4 w-4" />;
  }
  if (featureLower.includes('safety') || featureLower.includes('assist') || featureLower.includes('təhlükəsizlik')) {
    return <Shield className="h-4 w-4" />;
  }
  if (featureLower.includes('charging') || featureLower.includes('wireless')) {
    return <Zap className="h-4 w-4" />;
  }
  
  return <CheckCircle className="h-4 w-4" />;
};

// Categorize features
const categorizeFeatures = (features: string[]) => {
  const categories = {
    safety: [] as string[],
    comfort: [] as string[],
    technology: [] as string[],
    other: [] as string[]
  };

  features.forEach(feature => {
    const featureLower = feature.toLowerCase();
    
    if (featureLower.includes('safety') || featureLower.includes('assist') || 
        featureLower.includes('təhlükəsizlik') || featureLower.includes('advanced') ||
        featureLower.includes('camera') || featureLower.includes('4wd')) {
      categories.safety.push(feature);
    } else if (featureLower.includes('seat') || featureLower.includes('oturacaq') || 
               featureLower.includes('heated') || featureLower.includes('massaj') ||
               featureLower.includes('kondisioner') || featureLower.includes('climate') ||
               featureLower.includes('roof') || featureLower.includes('panorama')) {
      categories.comfort.push(feature);
    } else if (featureLower.includes('gps') || featureLower.includes('bluetooth') ||
               featureLower.includes('usb') || featureLower.includes('wifi') ||
               featureLower.includes('audio') || featureLower.includes('charging') ||
               featureLower.includes('digital') || featureLower.includes('smart')) {
      categories.technology.push(feature);
    } else {
      categories.other.push(feature);
    }
  });

  return categories;
};

export function FeaturesGrid({ 
  features, 
  specifications, 
  categorized = true,
  className 
}: FeaturesGridProps) {
  if (categorized) {
    const categories = categorizeFeatures(features);
    
    return (
      <div className={cn("space-y-6", className)}>
        {/* Safety Features */}
        {categories.safety.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-green-600" />
                Təhlükəsizlik
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.safety.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                  >
                    {getFeatureIcon(feature)}
                    <span className="text-sm font-medium text-green-800">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comfort Features */}
        {categories.comfort.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                Rahatlıq
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.comfort.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                  >
                    {getFeatureIcon(feature)}
                    <span className="text-sm font-medium text-blue-800">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Technology Features */}
        {categories.technology.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Zap className="h-5 w-5 text-purple-600" />
                Texnologiya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.technology.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg"
                  >
                    {getFeatureIcon(feature)}
                    <span className="text-sm font-medium text-purple-800">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Other Features */}
        {categories.other.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5 text-gray-600" />
                Digər Xüsusiyyətlər
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {categories.other.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
                  >
                    {getFeatureIcon(feature)}
                    <span className="text-sm font-medium text-gray-800">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Non-categorized view
  return (
    <div className={cn("", className)}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Avtomobil Xüsusiyyətləri
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                {getFeatureIcon(feature)}
                <span className="text-sm font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}