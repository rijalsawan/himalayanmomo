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
import { testimonials as defaultTestimonials } from '../data/testimonials';
import SectionBackdrop from './SectionBackdrop';

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
  sectionBackgroundStyle: string;
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
              ? 'text-golden fill-golden'
              : 'text-dark/15'
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
    sectionBackgroundStyle: 'dots',
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
              sectionBackgroundStyle: data.sectionBackgroundStyle || prev.sectionBackgroundStyle,
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
        className="section-padding bg-cream relative overflow-hidden"
      >
        <div className="container-custom relative">
          <div className="text-center py-20">
            <div className="w-10 h-10 border-[3px] border-dashed border-dark/30 rounded-full animate-spin-slow mx-auto"></div>
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
      className="section-padding bg-cream border-b-[3px] border-dark relative overflow-hidden"
      ref={ref}
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <SectionBackdrop style={settings.sectionBackgroundStyle} tone="light" />
      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12 md:mb-16"
        >
          <div className="eyebrow-brutal mx-auto">
            {settings.testimonialSubtitle}
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-extrabold text-dark mt-5 tracking-tight">
            {(() => {
              const words = settings.testimonialHeadline.split(' ');
              if (words.length >= 3) {
                return (
                  <>
                    {words.slice(0, 2).join(' ')}{' '}
                    <span className="font-accent italic text-brand">{words[2]}</span>{' '}
                    {words.slice(3).join(' ')}
                  </>
                );
              }
              return settings.testimonialHeadline;
            })()}
          </h2>
          <p className="text-dark/70 mt-4 text-base md:text-lg">
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
                className="border-brutal bg-warm-light p-6 sm:p-8 shadow-brutal-sm rotate-[-0.5deg]"
              >
                {/* Quote Icon */}
                <div className="w-10 h-10 border-[1.5px] border-dark bg-golden/30 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-dark" />
                </div>

                <StarRating rating={displayTestimonials[currentIndex]?.rating || 5} />
                
                <p className="font-accent italic text-dark mt-4 text-lg sm:text-xl leading-relaxed">
                  &ldquo;{displayTestimonials[currentIndex]?.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mt-6 pt-5 border-t-[1.5px] border-dark/15">
                  {displayTestimonials[currentIndex]?.avatar ? (
                    <img
                      src={displayTestimonials[currentIndex].avatar}
                      alt={displayTestimonials[currentIndex].name}
                      className="w-12 h-12 object-cover border-[1.5px] border-dark"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-brand border-[1.5px] border-dark flex items-center justify-center">
                      <span className="text-warm-light font-bold font-heading">
                        {displayTestimonials[currentIndex]?.name?.charAt(0) || '?'}
                      </span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-heading font-bold text-dark">
                      {displayTestimonials[currentIndex]?.name}
                    </h4>
                    {displayTestimonials[currentIndex]?.location && (
                      <p className="font-mono-brutal text-[10px] uppercase tracking-wide text-dark/50">
                        {displayTestimonials[currentIndex].location}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Mobile Navigation */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={prevTestimonial}
                className="w-10 h-10 flex items-center justify-center border-brutal-thin bg-warm-light hover:bg-dark hover:text-warm-light transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {displayTestimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 transition-all duration-300 ${
                      index === currentIndex
                        ? 'bg-brand w-6'
                        : 'bg-dark/20 hover:bg-dark/40 w-2'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="w-10 h-10 flex items-center justify-center border-brutal-thin bg-warm-light hover:bg-dark hover:text-warm-light transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Desktop Grid Layout */}
          <div className="hidden lg:block">
            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute -left-5 xl:-left-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center border-brutal bg-warm-light shadow-brutal-sm hover:bg-dark hover:text-warm-light transition-colors duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute -right-5 xl:-right-8 top-1/2 -translate-y-1/2 z-10 w-12 h-12 flex items-center justify-center border-brutal bg-warm-light shadow-brutal-sm hover:bg-dark hover:text-warm-light transition-colors duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

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
                    relative bg-warm-light p-6 h-full transition-all duration-300 border-brutal
                    ${index === 1
                      ? 'shadow-brutal-brand rotate-[0.6deg]'
                      : index === 0 ? 'shadow-brutal-sm -rotate-[0.8deg] hover:shadow-brutal' : 'shadow-brutal-sm rotate-[0.8deg] hover:shadow-brutal'
                    }
                  `}>
                    {/* Featured Badge for middle card */}
                    {index === 1 && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-brand text-warm-light font-mono-brutal text-[10px] font-bold uppercase tracking-wide border-[1.5px] border-dark">
                        Featured
                      </div>
                    )}

                    {/* Quote Decoration */}
                    <div className={`
                      absolute -top-3 right-6 w-8 h-8 border-[1.5px] border-dark flex items-center justify-center
                      ${index === 1 ? 'bg-brand' : 'bg-golden/30'}
                    `}>
                      <Quote className={`w-4 h-4 ${index === 1 ? 'text-warm-light' : 'text-dark'}`} />
                    </div>

                    <div className="pt-2">
                      <StarRating rating={testimonial.rating} />
                      
                      <p className="font-accent italic text-dark mt-4 leading-relaxed line-clamp-4 text-lg">
                        &ldquo;{testimonial.text}&rdquo;
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 mt-5 pt-4 border-t-[1.5px] border-dark/15">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-11 h-11 object-cover border-[1.5px] border-dark"
                          />
                        ) : (
                          <div className="w-11 h-11 bg-brand border-[1.5px] border-dark flex items-center justify-center">
                            <span className="text-warm-light font-bold font-heading">{testimonial.name?.charAt(0)}</span>
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-heading font-bold text-dark text-sm truncate">
                            {testimonial.name}
                          </h4>
                          {testimonial.location && (
                            <p className="font-mono-brutal text-[10px] uppercase tracking-wide text-dark/40 truncate">
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
                  className={`h-2 transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-brand w-8'
                      : 'bg-dark/20 hover:bg-dark/40 w-2'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges - dark stat strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-12 md:mt-16 bg-dark border-brutal shadow-brutal-sm px-6 sm:px-10 py-6"
        >
          {/* Stat 1 */}
          <div className="flex items-center gap-2.5">
            {settings.testimonialStat1Icon === 'Users' ? (
              <div className="flex -space-x-2">
                {displayTestimonials.slice(0, 4).map((t, i) => (
                  t.avatar ? (
                    <img
                      key={t.id}
                      src={t.avatar}
                      alt=""
                      className="w-8 h-8 border-[1.5px] border-warm-light object-cover"
                      style={{ zIndex: 4 - i }}
                    />
                  ) : (
                    <div
                      key={t.id}
                      className="w-8 h-8 border-[1.5px] border-warm-light bg-brand flex items-center justify-center"
                      style={{ zIndex: 4 - i }}
                    >
                      <span className="text-warm-light text-xs font-bold">{t.name?.charAt(0)}</span>
                    </div>
                  )
                ))}
              </div>
            ) : (
              (() => {
                const IconComponent = iconMap[settings.testimonialStat1Icon] || Users;
                return <IconComponent className="w-5 h-5 text-golden" />;
              })()
            )}
            <div className="text-sm font-mono-brutal">
              <span className="font-bold text-warm-light">{settings.testimonialStat1Value}</span>
              <span className="text-warm-light/50 ml-1.5 uppercase text-[11px]">{settings.testimonialStat1Label}</span>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-8 bg-warm-light/15" />
          
          {/* Stat 2 */}
          <div className="flex items-center gap-2.5">
            {settings.testimonialStat2Icon === 'Star' ? (
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-golden fill-golden" />
                ))}
              </div>
            ) : (
              (() => {
                const IconComponent = iconMap[settings.testimonialStat2Icon] || Star;
                return <IconComponent className="w-5 h-5 text-golden" />;
              })()
            )}
            <div className="text-sm font-mono-brutal">
              <span className="font-bold text-warm-light">{settings.testimonialStat2Value}</span>
              <span className="text-warm-light/50 ml-1.5 uppercase text-[11px]">{settings.testimonialStat2Label}</span>
            </div>
          </div>
          
          <div className="hidden sm:block w-px h-8 bg-warm-light/15" />
          
          {/* Stat 3 */}
          <div className="flex items-center gap-2.5">
            {(() => {
              const IconComponent = iconMap[settings.testimonialStat3Icon] || CheckCircle;
              return <IconComponent className="w-5 h-5 text-golden" />;
            })()}
            <div className="text-sm font-mono-brutal">
              <span className="font-bold text-warm-light">{settings.testimonialStat3Value}</span>
              <span className="text-warm-light/50 ml-1.5 uppercase text-[11px]">{settings.testimonialStat3Label}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
