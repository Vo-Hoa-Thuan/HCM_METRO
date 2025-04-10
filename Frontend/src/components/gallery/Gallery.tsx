
import React, { useState } from 'react';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Card, CardContent } from '@/components/ui/card';
import { Camera, Info, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { metroImages } from '@/utils/galleryData';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="py-10 px-4">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4 flex items-center justify-center gap-2">
          <Camera className="h-4 w-4" />
          <span>Thư viện hình ảnh</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Khám phá <span className="text-accent">hình ảnh Metro TP.HCM</span>
        </h2>
        <p className="text-muted-foreground">
          Cùng chiêm ngưỡng những hình ảnh đẹp về hệ thống tàu điện ngầm hiện đại của thành phố Hồ Chí Minh.
        </p>
      </div>

      <div className="container mx-auto">
        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {metroImages.map((image, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 p-1">
                <div className="p-1">
                  <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer card-3d-effect"
                    onClick={() => setSelectedImage(image.url)}>
                    <CardContent className="p-0">
                      <AspectRatio ratio={4/3} className="bg-muted">
                        <img
                          src={image.url}
                          alt={image.caption}
                          className="object-cover w-full h-full transition-all duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                          <div className="absolute bottom-0 p-4 text-white">
                            <h3 className="text-sm font-medium">{image.caption}</h3>
                            <div className="flex justify-between items-center mt-2">
                              <span className="text-xs opacity-80">{image.location}</span>
                              <Button size="sm" variant="ghost" className="text-white hover:bg-white/20">
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </AspectRatio>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-2">
            <CarouselPrevious className="static translate-y-0 bg-background border border-input" />
            <CarouselNext className="static translate-y-0 bg-background border border-input" />
          </div>
        </Carousel>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {selectedImage && metroImages.find(img => img.url === selectedImage)?.caption}
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <img 
              src={selectedImage || ''} 
              alt="Metro" 
              className="w-full rounded-md" 
            />
            <p className="mt-4 text-sm text-muted-foreground">
              {selectedImage && metroImages.find(img => img.url === selectedImage)?.description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">
                {selectedImage && metroImages.find(img => img.url === selectedImage)?.location}
              </span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
