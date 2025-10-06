'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Share2, 
  Facebook, 
  Twitter, 
  MessageCircle, 
  Mail, 
  Link2, 
  Check,
  Copy
} from 'lucide-react';
import { EnhancedCar } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

interface SocialShareProps {
  car: EnhancedCar;
  currentUrl?: string;
}

export default function SocialShare({ car, currentUrl }: SocialShareProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = currentUrl || (typeof window !== 'undefined' ? window.location.href : '');
  const title = `Check out this ${car.brand} ${car.model} ${car.year} for rent!`;
  const description = `${car.brand} ${car.model} ${car.year} - ${car.category} class, ${car.fuelType}, ${car.transmission}. Starting from $${car.dailyPrice}/day. Book now at Ram Servis!`;
  const hashtags = ['CarRental', 'Baku', 'RamServis', car.brand.replace(/\s+/g, ''), car.category];

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(title + ' - ' + description)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}&hashtags=${hashtags.join(',')}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(title + '\n\n' + description + '\n\n' + url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(description + '\n\nView details: ' + url)}`,
  };

  const handleShare = async (platform: keyof typeof shareLinks | 'copy') => {
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        toast({
          title: "Link copied!",
          description: "The car details link has been copied to your clipboard.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Please copy the link manually.",
          variant: "destructive",
        });
      }
      return;
    }

    // Open share link in new window
    const shareUrl = shareLinks[platform];
    const windowFeatures = 'width=600,height=400,scrollbars=yes,resizable=yes';
    window.open(shareUrl, '_blank', windowFeatures);
    
    // Track sharing event (in real app, you'd send this to analytics)
    console.log(`Shared ${car.brand} ${car.model} on ${platform}`);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: description,
          url,
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Native share cancelled or failed');
      }
    } else {
      setIsOpen(!isOpen);
    }
  };

  const shareButtons = [
    {
      key: 'facebook' as const,
      label: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      textColor: 'text-white'
    },
    {
      key: 'twitter' as const,
      label: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      textColor: 'text-white'
    },
    {
      key: 'whatsapp' as const,
      label: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      textColor: 'text-white'
    },
    {
      key: 'email' as const,
      label: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      textColor: 'text-white'
    },
  ];

  return (
    <div className="relative">
      <Button
        onClick={handleNativeShare}
        variant="outline"
        className="flex items-center space-x-2 border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400 dark:hover:bg-amber-900/20"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 right-0 z-50 w-80 bg-white/95 dark:bg-[#1a1a1a]/95 backdrop-blur-sm border shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="text-center">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                  Share this car
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {car.brand} {car.model} {car.year}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {shareButtons.map((button) => {
                  const IconComponent = button.icon;
                  return (
                    <Button
                      key={button.key}
                      onClick={() => handleShare(button.key)}
                      className={`${button.color} ${button.textColor} flex items-center justify-center space-x-2 h-10`}
                    >
                      <IconComponent className="h-4 w-4" />
                      <span className="text-sm">{button.label}</span>
                    </Button>
                  );
                })}
              </div>

              <div className="border-t pt-3">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 text-sm text-gray-700 dark:text-gray-300 truncate">
                    {url}
                  </div>
                  <Button
                    onClick={() => handleShare('copy')}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}