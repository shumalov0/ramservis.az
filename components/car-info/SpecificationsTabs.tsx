'use client';

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Car, 
  Gauge, 
  Zap, 
  Fuel, 
  Users, 
  Calendar, 
  Shield, 
  CreditCard,
  FileText,
  Settings
} from 'lucide-react';
import { EnhancedCar } from '@/lib/types';
import { cn } from '@/lib/utils';

interface SpecificationsTabsProps {
  car: EnhancedCar;
  activeTab?: 'overview' | 'specs' | 'features' | 'rules';
  onTabChange?: (tab: string) => void;
  className?: string;
}

export function SpecificationsTabs({ 
  car, 
  activeTab = 'overview', 
  onTabChange,
  className 
}: SpecificationsTabsProps) {
  const [currentTab, setCurrentTab] = useState(activeTab);

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab as any);
    onTabChange?.(tab);
  };

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Car className="h-4 w-4" />
            <span className="hidden sm:inline">Ümumi</span>
          </TabsTrigger>
          <TabsTrigger value="specs" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Texniki</span>
          </TabsTrigger>
          <TabsTrigger value="features" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            <span className="hidden sm:inline">Xüsusiyyətlər</span>
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Qaydalar</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  Əsas Məlumatlar
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Marka</span>
                    <p className="font-medium">{car.brand}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Model</span>
                    <p className="font-medium">{car.model}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">İl</span>
                    <p className="font-medium">{car.year}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Kateqoriya</span>
                    <p className="font-medium">{car.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Oturacaq</span>
                    <p className="font-medium flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {car.seats} nəfər
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Transmissiya</span>
                    <p className="font-medium">{car.transmission}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Qiymət Məlumatları
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Günlük qiymət</span>
                    <span className="font-bold text-lg">₼{car.dailyPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Həftəlik qiymət</span>
                    <span className="font-medium">₼{car.weeklyPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Aylıq qiymət</span>
                    <span className="font-medium">₼{car.monthlyPrice}</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Depozit</span>
                      <span className="font-medium text-orange-600">₼{car.deposit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="specs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" />
                Texniki Xüsusiyyətlər
              </CardTitle>
              <CardDescription>
                Avtomobilin ətraflı texniki məlumatları
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Mühərrik</span>
                    </div>
                    <span className="font-medium">{car.specifications.engine}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Güc</span>
                    </div>
                    <span className="font-medium">{car.specifications.horsepower} HP</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Sürətlənmə</span>
                    </div>
                    <span className="font-medium">{car.specifications.acceleration}</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Maksimum sürət</span>
                    </div>
                    <span className="font-medium">{car.specifications.topSpeed} km/h</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Yanacaq sərfiyyatı</span>
                    </div>
                    <span className="font-medium">{car.specifications.fuelConsumption}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Yanacaq növü</span>
                    </div>
                    <span className="font-medium">{car.fuelType}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Xüsusiyyətlər və Avadanlıqlar
              </CardTitle>
              <CardDescription>
                Bu avtomobilda mövcud olan bütün xüsusiyyətlər
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {car.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                İcarə Qaydaları və Şərtləri
              </CardTitle>
              <CardDescription>
                Bu avtomobili icarəyə götürmək üçün tələblər
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Minimum yaş</h4>
                      <p className="text-sm text-muted-foreground">Sürücü üçün minimum yaş tələbi</p>
                    </div>
                    <Badge variant="secondary">{car.rules.minimumAge} yaş</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Sürücülük təcrübəsi</h4>
                      <p className="text-sm text-muted-foreground">Minimum sürücülük təcrübəsi</p>
                    </div>
                    <Badge variant="secondary">{car.rules.drivingExperience} il</Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Pasport</h4>
                      <p className="text-sm text-muted-foreground">Pasport tələb olunur</p>
                    </div>
                    <Badge variant={car.rules.passportRequired ? "default" : "secondary"}>
                      {car.rules.passportRequired ? "Tələb olunur" : "Tələb olunmur"}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Sürücülük vəsiqəsi</h4>
                      <p className="text-sm text-muted-foreground">Etibarlı sürücülük vəsiqəsi</p>
                    </div>
                    <Badge variant={car.rules.licenseRequired ? "default" : "secondary"}>
                      {car.rules.licenseRequired ? "Tələb olunur" : "Tələb olunmur"}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Əlavə Məlumat</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Depozit icarə müddəti bitdikdən sonra geri qaytarılır</li>
                  <li>• Avtomobil tam yanacaqla təhvil verilir və belə qaytarılmalıdır</li>
                  <li>• Zərər halında sığorta şirkəti ilə əlaqə saxlanılmalıdır</li>
                  <li>• Gecikmə halında gündəlik qiymətin 10%-i cərimə tətbiq olunur</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}