"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageContainer } from "@/components/layouts/page-container";
import { MotionImage } from "@/components/animations/motion-image";
import { MotionText } from "@/components/animations/motion-text";
import { StaggerContainer } from "@/components/animations/stagger-container";
import { AnimatedHero } from "@/components/layouts/animated-hero";
import { AnimatedSection } from "@/components/layouts/animated-section";
import { AnimatedFeature } from "@/components/common/animated-feature";
import { AnimatedBookCard } from "@/components/common/animated-book-card";
import { GlassCard } from "@/components/ui/glass-card";
import { AnimatedCallout } from "@/components/ui/animated-callout";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  PenTool,
  Sparkles,
  Star,
  TrendingUp,
  Library,
} from "lucide-react";

// Mock data for featured books
const FEATURED_BOOKS = [
  {
    id: "1",
    title: "The Silent Echo",
    author: "Emily Chen",
    cover:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=687&auto=format&fit=crop",
    rating: 4.8,
  },
  {
    id: "2",
    title: "Midnight in the Garden",
    author: "Robert Johnson",
    cover:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1374&auto=format&fit=crop",
    rating: 4.5,
  },
  {
    id: "3",
    title: "The Lost Horizon",
    author: "Sarah Williams",
    cover:
      "https://images.unsplash.com/photo-1531346878377-a5be20888e57?q=80&w=687&auto=format&fit=crop",
    rating: 4.7,
  },
];

// Testimonials data
const TESTIMONIALS = [
  {
    name: "Alex Johnson",
    role: "Book Enthusiast",
    content:
      "This platform has completely transformed how I discover new books. The recommendations are spot on!",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop",
  },
  {
    name: "Sophia Chen",
    role: "Literature Student",
    content:
      "The review system is incredibly helpful for my literature studies. I appreciate the thoughtful community insights.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1470&auto=format&fit=crop",
  },
  {
    name: "Marcus Williams",
    role: "Author",
    content:
      "As an author, getting direct feedback from readers has been invaluable. This platform bridges the gap between writers and readers.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1374&auto=format&fit=crop",
  },
];

export default function Home() {
  return (
    <PageContainer>
      {/* Hero Section */}
      <AnimatedHero>
        <div className="grid items-center grid-cols-1 gap-8 md:gap-10 lg:gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <AnimatedCallout label="NEW" delay={0.2}>
              Discover our enhanced recommendation engine
            </AnimatedCallout>

            <MotionText
              animation="fadeUp"
              delay={0.3}
              className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
            >
              Your Literary Journey{" "}
              <span className="text-transparent bg-gradient-to-r from-primary to-purple-500 bg-clip-text">
                Reimagined
              </span>
            </MotionText>

            <MotionText
              animation="fadeUp"
              delay={0.4}
              className="text-xl text-muted-foreground"
            >
              Discover, review, and connect through the power of books. Join our
              community of passionate readers today.
            </MotionText>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Button size="lg" asChild className="text-base rounded-full">
                <Link href="/signup">Get Started</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="text-base rounded-full"
              >
                <Link href="/login">Sign In</Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 border-2 rounded-full border-background bg-muted"
                  />
                ))}
              </div>
              <span>Joined by 10,000+ book lovers</span>
            </motion.div>
          </div>

          <div className="relative h-[300px] sm:h-[400px] md:h-[450px] lg:h-[500px] w-full">
            <div className="absolute w-64 h-64 rounded-full -right-10 -top-10 bg-primary/20 blur-3xl" />
            <div className="absolute w-64 h-64 rounded-full -bottom-10 -left-10 bg-purple-500/20 blur-3xl" />

            <GlassCard
              className="absolute hidden sm:block left-0 top-1/2 z-10 max-w-[150px] sm:max-w-[180px] md:max-w-[200px] -translate-y-1/2 rounded-xl p-3 sm:p-4"
              delay={0.8}
            >
              <div className="flex items-center gap-3">
                <Star className="w-10 h-10 text-yellow-400" />
                <div>
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-xs text-muted-foreground">
                    Average Rating
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard
              className="absolute hidden sm:block bottom-10 sm:bottom-16 md:bottom-20 right-0 z-10 max-w-[150px] sm:max-w-[180px] md:max-w-[200px] rounded-xl p-3 sm:p-4"
              delay={0.9}
            >
              <div className="flex items-center gap-3">
                <Library className="w-10 h-10 text-primary" />
                <div>
                  <p className="text-2xl font-bold">5k+</p>
                  <p className="text-xs text-muted-foreground">Book Reviews</p>
                </div>
              </div>
            </GlassCard>

            <MotionImage
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=1470&auto=format&fit=crop"
              alt="Book collection"
              fill
              className="z-0 object-cover rounded-3xl"
              priority
              animation="fadeInScale"
              delay={0.6}
            />
          </div>
        </div>
      </AnimatedHero>

      {/* Features Section */}
      <AnimatedSection
        title="Why Choose Our Platform"
        subtitle="We've crafted a unique experience for book lovers with features designed to enhance your reading journey."
        backgroundEffect
        contentClassName="grid grid-cols-1 gap-4 sm:gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatedFeature
          icon={<BookOpen className="w-6 h-6" />}
          title="Personalized Recommendations"
          description="Our AI analyzes your reading preferences to suggest books you'll love."
          index={0}
        />
        <AnimatedFeature
          icon={<PenTool className="w-6 h-6" />}
          title="Thoughtful Reviews"
          description="Share your insights and read in-depth reviews from our community."
          index={1}
        />
        <AnimatedFeature
          icon={<Users className="w-6 h-6" />}
          title="Connect with Readers"
          description="Build your network of like-minded book enthusiasts."
          index={2}
        />
        <AnimatedFeature
          icon={<Sparkles className="w-6 h-6" />}
          title="Curated Collections"
          description="Discover hand-picked book lists for every mood and interest."
          index={3}
        />
        <AnimatedFeature
          icon={<Star className="w-6 h-6" />}
          title="Rating System"
          description="Find the highest-rated books in your favorite genres."
          index={4}
        />
        <AnimatedFeature
          icon={<TrendingUp className="w-6 h-6" />}
          title="Reading Challenges"
          description="Set goals and track your reading progress throughout the year."
          index={5}
        />
      </AnimatedSection>

      {/* Featured Books Section */}
      <AnimatedSection
        title="Featured Books"
        subtitle="Explore some of the top-rated books from our community"
        className="bg-muted/30"
        contentClassName="mt-12"
      >
        <StaggerContainer className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_BOOKS.map((book, index) => (
            <AnimatedBookCard
              key={book.id}
              id={book.id}
              title={book.title}
              author={book.author}
              cover={book.cover}
              rating={book.rating}
              index={index}
            />
          ))}
        </StaggerContainer>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg" asChild className="rounded-full">
            <Link href="/dashboard">Explore All Books</Link>
          </Button>
        </motion.div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection
        title="What Our Community Says"
        subtitle="Join thousands of satisfied readers who have found their next favorite book on our platform"
        backgroundEffect
      >
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:gap-6 mt-8 sm:mt-10 md:mt-12 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial, index) => (
            <GlassCard
              key={index}
              delay={0.2 * index}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 overflow-hidden rounded-full">
                  <MotionImage
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <h4 className="font-medium">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </p>
            </GlassCard>
          ))}
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="text-center">
        <GlassCard className="max-w-4xl py-8 sm:py-12 md:py-16 mx-auto">
          <MotionText
            animation="fadeUp"
            className="max-w-2xl mx-auto text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
          >
            Ready to start your reading journey?
          </MotionText>

          <MotionText
            animation="fadeUp"
            delay={0.1}
            className="max-w-2xl mx-auto mt-4 text-muted-foreground"
          >
            Join our community today and discover your next favorite book.
          </MotionText>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4 mt-8"
          >
            <Button size="lg" asChild className="rounded-full">
              <Link href="/signup">Get Started for Free</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full"
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </motion.div>
        </GlassCard>
      </AnimatedSection>
    </PageContainer>
  );
}
