'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselSlide {
  id: string;
  title: string;
  description: string;
  image?: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoPlay?: boolean;
  interval?: number;
}

export default function Carousel({ slides, autoPlay = false, interval = 5000 }: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentSlide(index % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (slides.length === 0) {
    return null;
  }

  const slide = slides[currentSlide];

  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-6">
      <div className="max-w-7xl mx-auto">
        <div
          className={`relative rounded-lg overflow-hidden h-80 flex items-center justify-center ${slide.backgroundColor}`}
          style={{
            backgroundImage: slide.image ? `url(${slide.image})` : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>

          {/* Content */}
          <div className="relative z-10 text-center text-white max-w-2xl px-4">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
            <p className="text-lg md:text-xl mb-6">{slide.description}</p>
            <a
              href={slide.buttonLink}
              className="inline-block px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              {slide.buttonText}
            </a>
          </div>

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors text-gray-900"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/80 hover:bg-white transition-colors text-gray-900"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-brand-navy' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="text-center mt-3 text-sm text-gray-600">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
}
