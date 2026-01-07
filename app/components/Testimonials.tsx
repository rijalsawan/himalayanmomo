'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { 
  Star, ChevronLeft, ChevronRight, Quote,
  Users, Award, Shield, Clock, Heart, CheckCircle,
  ThumbsUp, Utensils, Coffee, MapPin, Phone,
  Truck, Leaf, Flame, Sparkles, Trophy, Medal, Crown, Target, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { testimonials as defaultTestimonials } from '../data/testimonials';

interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  text: string;
  location?: string | null;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface SiteSettings {
  testimonialSubtitle: string;
  testimonialHeadline: string;
  testimonialDescription: string;
  testimonialStat1Icon: string;
  testimonialStat1Value: string;
  testimonialStat1Label: string;
  testimonialStat2Icon: string;
  testimonialStat2Value: string;
  testimonialStat2Label: string;
  testimonialStat3Icon: string;
  testimonialStat3Value: string;
  testimonialStat3Label: string;
}

// Icon mapping for dynamic rendering
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Users, Award, Shield, Clock, Heart, CheckCircle, Star,
  ThumbsUp, Utensils, Coffee, MapPin, Phone,
  Truck, Leaf, Flame, Sparkles, Trophy, Medal, Crown, Target, Zap
};

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating
              ? 'text-amber-400 fill-amber-400'
              : 'text-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>({
    testimonialSubtitle: 'Testimonials',
    testimonialHeadline: 'Loved by Momo Enthusiasts',
    testimonialDescription: "Join thousands of satisfied customers who've made us their favorite spot",
    testimonialStat1Icon: 'Users',
    testimonialStat1Value: '500+',
    testimonialStat1Label: 'Happy Customers',
    testimonialStat2Icon: 'Star',
    testimonialStat2Value: '4.9',
    testimonialStat2Label: 'Average Rating',
    testimonialStat3Icon: 'CheckCircle',
    testimonialStat3Value: '100%',
    testimonialStat3Label: 'Authentic Recipes',
  });
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // Convert default testimonials to the right format
  const getDefaultTestimonials = (): Testimonial[] => {
    return defaultTestimonials.map((t, index) => ({
      id: t.id,
      name: t.name,
      avatar: t.avatar,
      rating: t.rating,
      text: t.text,
      location: t.location || null,
      isActive: true,
      order: index,
      createdAt: t.date,
      updatedAt: t.date,
    }));
  };

  // Fetch site settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/site-settings', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setSettings((prev) => ({
              ...prev,
              testimonialSubtitle: data.testimonialSubtitle || prev.testimonialSubtitle,
              testimonialHeadline: data.testimonialHeadline || prev.testimonialHeadline,
              testimonialDescription: data.testimonialDescription || prev.testimonialDescription,
              testimonialStat1Icon: data.testimonialStat1Icon || prev.testimonialStat1Icon,
              testimonialStat1Value: data.testimonialStat1Value || prev.testimonialStat1Value,
              testimonialStat1Label: data.testimonialStat1Label || prev.testimonialStat1Label,
              testimonialStat2Icon: data.testimonialStat2Icon || prev.testimonialStat2Icon,
              testimonialStat2Value: data.testimonialStat2Value || prev.testimonialStat2Value,
              testimonialStat2Label: data.testimonialStat2Label || prev.testimonialStat2Label,
              testimonialStat3Icon: data.testimonialStat3Icon || prev.testimonialStat3Icon,
              testimonialStat3Value: data.testimonialStat3Value || prev.testimonialStat3Value,
              testimonialStat3Label: data.testimonialStat3Label || prev.testimonialStat3Label,
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Fetch testimonials from API
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch('/api/testimonials', {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setTestimonials(data);
          } else {
            setTestimonials(getDefaultTestimonials());
          }
        } else {
          setTestimonials(getDefaultTestimonials());
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(getDefaultTestimonials());
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const nextTestimonial = useCallback(() => {
    const items = testimonials.length > 0 ? testimonials : getDefaultTestimonials();
    if (items.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [testimonials]);

  const prevTestimonial = () => {
    const items = testimonials.length > 0 ? testimonials : getDefaultTestimonials();
    if (items.length === 0) return;
    setCurrentIndex(
      (prev) => (prev - 1 + items.length) % items.length
    );
  };

  // Auto-play
  useEffect(() => {
    const items = testimonials.length > 0 ? testimonials : getDefaultTestimonials();
    if (!isAutoPlaying || items.length === 0) return;
    const interval = setInterval(nextTestimonial, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextTestimonial, testimonials]);

  // Get testimonials for display
  const getVisibleTestimonials = () => {
    const items = testimonials.length > 0 ? testimonials : getDefaultTestimonials();
    if (items.length === 0) return [];
    const visible = [];
    for (let i = 0; i < Math.min(3, items.length); i++) {
      visible.push(items[(currentIndex + i) % items.length]);
    }
    return visible;
  };

  // Show loading spinner only while actually loading
  if (isLoading) {
    return (
      <section
        id="testimonials"
        className="section-padding bg-gradient-to-b from-white to-[#FDF8F3] relative overflow-hidden"
      >
        <div className="container-custom relative">
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </section>
    );
  }

  // If somehow testimonials are still empty after loading, use defaults
  const displayTestimonials = testimonials.length > 0 ? testimonials : getDefaultTestimonials();

  return (
    <section
      id="testimonials"
      className="section-padding bg-gradient-to-b from-white to-[#FDF8F3] relative overflow-hidden"
      ref={ref}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
      
      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <span className="inline-flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-widest">
            <span className="w-8 h-px bg-primary/50" />
            {settings.testimonialSubtitle}
            <span className="w-8 h-px bg-primary/50" />
          </span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1A1A] mt-4">
            {(() => {
              const words = settings.testimonialHeadline.split(' ');
              if (words.length >= 3) {
                return (
                  <>
                    {words.slice(0, 2).join(' ')}{' '}
                    <span className="text-primary">{words[2]}</span>{' '}
                    {words.slice(3).join(' ')}
                  </>
                );
              }
              return settings.testimonialHeadline;
            })()}
          </h2>
          <p className="text-gray-500 mt-4 text-base md:text-lg">
            {settings.testimonialDescription}
          </p>
        </motion.div>

        {/* Main Content */}
        <div className="relative">
          {/* Featured Testimonial - Mobile */}
          <div className="lg:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-gray-100/50 border border-gray-100"
              >
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-primary" />
                </div>

                <StarRating rating={displayTestimonials[currentIndex]?.rating || 5} />
                
                <p className="text-gray-700 mt-4 text-base sm:text-lg leading-relaxed">
                  &ldquo;{displayTestimonials[currentIndex]?.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-gray-100">
                  {displayTestimonials[currentIndex]?.avatar ? (
                    <img
                      src={displayTestimonials[currentIndex].avatar}
                      alt={displayTestimonials[currentIndex].name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-primary/10"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center ring-2 ring-primary/10">
                      <span className="text-white font-bold">
                        {displayTestimonials[currentIndex]?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-[#1A1A1A]">
                      {displayTestimonials[currentIndex]?.name}
                    </h4>
                    {displayTestimonials[currentIndex]?.location && (
                      <p className="text-sm text-gray-500">
                        {displayTestimonials[currentIndex].location}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <Button
                variant="outline"
                size="icon"
                onClick={prevTestimonial}
                className="w-10 h-10 rounded-full border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-primary w-6'
                        : 'bg-gray-200 hover:bg-gray-300 w-2'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={nextTestimonial}
                className="w-10 h-10 rounded-full border-gray-200 hover:bg-primary hover:text-white hover:border-primary transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden lg:block">
            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="absolute -left-5 xl:-left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-gray-100 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="absolute -right-5 xl:-right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white shadow-lg border-gray-100 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>

            {/* Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid lg:grid-cols-3 gap-6"
            >
              {getVisibleTestimonials().map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`group relative ${index === 1 ? 'lg:-mt-4' : ''}`}
                >
                  <div className={`
                    relative bg-white rounded-2xl p-6 h-full transition-all duration-300
                    ${index === 1 
                      ? 'shadow-2xl shadow-primary/10 border-2 border-primary/20 scale-105' 
                      : 'shadow-lg shadow-gray-100/50 border border-gray-100 hover:shadow-xl hover:border-primary/10'
                    }
                  `}>
                    {/* Featured Badge for middle card */}
                    {index === 1 && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                        Featured
                      </div>
                    )}

                    {/* Quote Decoration */}
                    <div className={`
                      absolute -top-3 right-6 w-8 h-8 rounded-lg flex items-center justify-center
                      ${index === 1 ? 'bg-primary' : 'bg-primary/10'}
                    `}>
                      <Quote className={`w-4 h-4 ${index === 1 ? 'text-white' : 'text-primary'}`} />
                    </div>

                    <div className="pt-2">
                      <StarRating rating={testimonial.rating} />
                      
                      <p className="text-gray-600 mt-4 leading-relaxed line-clamp-4 text-[15px]">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-gray-100">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className={`
                              w-11 h-11 rounded-full object-cover 
                              ${index === 1 ? 'ring-2 ring-primary/30' : 'ring-2 ring-gray-100'}
                            `}
                          />
                        ) : (
                          <div className={`
                            w-11 h-11 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center
                            ${index === 1 ? 'ring-2 ring-primary/30' : 'ring-2 ring-gray-100'}
                          `}>
                            <span className="text-white font-bold">{testimonial.name?.charAt(0)}</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-semibold text-[#1A1A1A] text-sm truncate">
                            {testimonial.name}
                          </h4>
                          {testimonial.location && (
                            <p className="text-xs text-gray-400 truncate">
                              {testimonial.location}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Desktop Dots Indicator */}
            <div className="flex justify-center gap-2 mt-10">
              {displayTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-primary w-8'
                      : 'bg-gray-200 hover:bg-gray-300 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-12 md:mt-16 pt-10 border-t border-gray-100"
        >
          {/* Stat 1 */}
          <div className="flex items-center gap-2">
            {settings.testimonialStat1Icon === 'Users' ? (
              <div className="flex -space-x-2">
                {displayTestimonials.slice(0, 4).map((t, i) => (
                  t.avatar ? (
                    <img
                      key={t.id}
                      src={t.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full border-2 border-white object-cover"
                      style={{ zIndex: 4 - i }}
                    />
                  ) : (
                    <div
                      key={t.id}
                      className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center"
                      style={{ zIndex: 4 - i }}
                    >
                      <span className="text-white text-xs font-bold">{t.name?.charAt(0)}</span>
                    </div>
                  )
                ))}
              </div>
            ) : (
              (() => {
                const IconComponent = iconMap[settings.testimonialStat1Icon] || Users;
                return <IconComponent className="w-5 h-5 text-primary" />;
              })()
            )}
            <div className="text-sm">
              <span className="font-semibold text-[#1A1A1A]">{settings.testimonialStat1Value}</span>
              <span className="text-gray-500 ml-1">{settings.testimonialStat1Label}</span>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          
          {/* Stat 2 */}
          <div className="flex items-center gap-2">
            {settings.testimonialStat2Icon === 'Star' ? (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
            ) : (
              (() => {
                const IconComponent = iconMap[settings.testimonialStat2Icon] || Star;
                return <IconComponent className="w-5 h-5 text-primary" />;
              })()
            )}
            <div className="text-sm">
              <span className="font-semibold text-[#1A1A1A]">{settings.testimonialStat2Value}</span>
              <span className="text-gray-500 ml-1">{settings.testimonialStat2Label}</span>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-8 bg-gray-200" />
          
          {/* Stat 3 */}
          <div className="flex items-center gap-2">
            {(() => {
              const IconComponent = iconMap[settings.testimonialStat3Icon] || CheckCircle;
              return <IconComponent className="w-5 h-5 text-primary" />;
            })()}
            <div className="text-sm">
              <span className="font-semibold text-[#1A1A1A]">{settings.testimonialStat3Value}</span>
              <span className="text-gray-500 ml-1">{settings.testimonialStat3Label}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
