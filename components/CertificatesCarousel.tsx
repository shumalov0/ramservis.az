'use client';

import React, { useState, useCallback } from 'react';
import { useSafeDate } from '@/hooks/use-hydration';
import Image from 'next/image';
import { Certificate } from '@/lib/types';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Building, Award, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificatesCarouselProps {
  certificates: Certificate[];
  autoPlay?: boolean;
  showDots?: boolean;
  currentLang?: string;
  className?: string;
}

export function CertificatesCarousel({
  certificates,
  autoPlay = false,
  showDots = true,
  currentLang = 'az',
  className
}: CertificatesCarouselProps) {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { formatDate } = useSafeDate();

  const handleCertificateClick = useCallback((certificate: Certificate) => {
    setSelectedCertificate(certificate);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedCertificate(null);
  }, []);



  const isValidUntil = (certificate: Certificate) => {
    if (!certificate.validUntil) return true;
    return new Date(certificate.validUntil) > new Date();
  };

  if (!certificates || certificates.length === 0) {
    return null;
  }

  return (
    <>
      <div className={cn("w-full", className)}>
        <Carousel
          opts={{
            align: "start",
            loop: true,
            skipSnaps: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {certificates.map((certificate) => (
              <CarouselItem 
                key={certificate.id} 
                className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
              >
                <Card 
                  className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 group"
                  onClick={() => handleCertificateClick(certificate)}
                >
                  <CardContent className="p-4">
                    <div className="relative aspect-[4/3] mb-4 overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={certificate.image}
                        alt={certificate.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                      <div className="absolute top-2 right-2">
                        {isValidUntil(certificate) ? (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            <Award className="w-3 h-3 mr-1" />
                            {currentLang === 'az' ? 'Aktiv' : 'Active'}
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                            {currentLang === 'az' ? 'Müddəti bitib' : 'Expired'}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                        {certificate.title}
                      </h3>
                      
                      <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
                        {certificate.description}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Building className="w-3 h-3" />
                        <span className="truncate">{certificate.issuer}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(certificate.issueDate, currentLang)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="flex justify-center mt-6 gap-4">
            <CarouselPrevious className="relative translate-y-0 left-0" />
            <CarouselNext className="relative translate-y-0 right-0" />
          </div>
        </Carousel>
      </div>

      {/* Certificate Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCertificate && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">
                  {selectedCertificate.title}
                </DialogTitle>
                <DialogDescription>
                  {selectedCertificate.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg">
                  <Image
                    src={selectedCertificate.image}
                    alt={selectedCertificate.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {currentLang === 'az' ? 'Verən təşkilat' : 'Issuer'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedCertificate.issuer}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {currentLang === 'az' ? 'Verilmə tarixi' : 'Issue Date'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(selectedCertificate.issueDate, currentLang)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {selectedCertificate.validUntil && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {currentLang === 'az' ? 'Etibarlılıq müddəti' : 'Valid Until'}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(selectedCertificate.validUntil, currentLang)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {selectedCertificate.credentialId && (
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {currentLang === 'az' ? 'Sertifikat ID' : 'Credential ID'}
                          </p>
                          <p className="text-sm text-muted-foreground font-mono">
                            {selectedCertificate.credentialId}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <Badge 
                        variant={isValidUntil(selectedCertificate) ? "secondary" : "outline"}
                        className={isValidUntil(selectedCertificate) 
                          ? "bg-green-100 text-green-800" 
                          : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        <Award className="w-3 h-3 mr-1" />
                        {isValidUntil(selectedCertificate) 
                          ? (currentLang === 'az' ? 'Aktiv Sertifikat' : 'Active Certificate')
                          : (currentLang === 'az' ? 'Müddəti Bitmiş' : 'Expired Certificate')
                        }
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}