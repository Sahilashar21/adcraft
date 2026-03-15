'use client';

import { useState } from 'react';
import CaptionGenerator from '../CaptionGenerator';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart3, FileText, Zap, Star, ChevronRight, Gem, PenSquare, Clapperboard, Library, Download, Lightbulb, Check, Rocket, Users, TrendingUp, Zap as ZapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: Sparkles,
    title: "AI Image Generator",
    description: "Create stunning AI-powered images for your advertisements.",
    href: "/generate-image",
    color: "from-blue-500 to-teal-500",
    badge: "Powered by AI"
  },
  {
    icon: Clapperboard,
    title: "AI Video Generator",
    description: "Produce dynamic video advertisements from images with AI.",
    href: "/generate-video",
    color: "from-green-500 to-lime-500",
    badge: "New"
  },
  {
    icon: PenSquare,
    title: "AI Script Generator",
    description: "Generate engaging advertisement scripts and dialogue.",
    href: "/generate-script",
    color: "from-yellow-500 to-orange-500",
    badge: "Smart"
  },
  {
    icon: FileText,
    title: "AI Caption Generator",
    description: "Generate compelling marketing copy in seconds with our advanced AI technology.",
    href: "#caption-generator",
    color: "from-purple-500 to-pink-500",
    badge: "Popular"
  },
  {
    icon: BarChart3,
    title: "Campaign Management",
    description: "Create, organize, and track your marketing campaigns with powerful analytics.",
    href: "/campaigns",
    color: "from-blue-500 to-cyan-500",
    badge: "Essential"
  },
  {
    icon: Library,
    title: "Campaign Library",
    description: "Access your generated campaigns, edit them, and reuse successful content.",
    href: "/campaign-library",
    color: "from-indigo-500 to-violet-500",
    badge: "Organize"
  }
];

const stats = [
  { label: "Captions Generated", value: "10K+", icon: FileText, change: "+23%" },
  { label: "Active Campaigns", value: "500+", icon: BarChart3, change: "+18%" },
  { label: "Happy Users", value: "2K+", icon: Users, change: "+42%" },
  { label: "AI Accuracy", value: "95%", icon: Zap, change: "Industry Best" }
];

const howItWorks = [
  {
    step: 1,
    title: "Create Your Campaign",
    description: "Enter your product details, target audience, and marketing platform.",
    icon: <Lightbulb className="w-8 h-8 text-purple-600" />
  },
  {
    step: 2,
    title: "AI Generates Assets",
    description: "Our AI instantly creates captions, images, scripts, and marketing ideas.",
    icon: <ZapIcon className="w-8 h-8 text-purple-600" />
  },
  {
    step: 3,
    title: "Export & Deploy",
    description: "Download your assets and publish directly to social media.",
    icon: <Download className="w-8 h-8 text-purple-600" />
  }
];

const benefits = [
  { icon: Rocket, title: "10x Faster", description: "Create marketing content in minutes, not days" },
  { icon: Star, title: "Professional Quality", description: "AI-generated content that converts" },
  { icon: TrendingUp, title: "Higher Engagement", description: "Proven to increase social engagement" },
  { icon: Zap, title: "Unlimited Variations", description: "Generate unlimited versions instantly" },
];

export default function Home() {
  const demoPrompt = 'Luxury coffee brand ad with warm tones';
  const demoImageUrl =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      "<svg xmlns='http://www.w3.org/2000/svg' width='960' height='540' viewBox='0 0 960 540'>" +
        "<defs>" +
          "<linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>" +
            "<stop offset='0%' stop-color='#f6e7d8'/>" +
            "<stop offset='100%' stop-color='#b86b4b'/>" +
          "</linearGradient>" +
          "<linearGradient id='steam' x1='0' y1='0' x2='0' y2='1'>" +
            "<stop offset='0%' stop-color='#ffffff' stop-opacity='0.8'/>" +
            "<stop offset='100%' stop-color='#ffffff' stop-opacity='0'/>" +
          "</linearGradient>" +
        "</defs>" +
        "<rect width='960' height='540' fill='url(#bg)'/>" +
        "<circle cx='740' cy='120' r='90' fill='#f3d7c4' opacity='0.6'/>" +
        "<circle cx='180' cy='420' r='120' fill='#8b4b33' opacity='0.3'/>" +
        "<g transform='translate(300,160)'>" +
          "<rect x='0' y='90' width='320' height='170' rx='26' fill='#f9f2eb' stroke='#6b3a2a' stroke-width='8'/>" +
          "<rect x='18' y='120' width='284' height='110' rx='18' fill='#c77652'/>" +
          "<path d='M320 110c50 0 80 30 80 70s-30 70-80 70' fill='none' stroke='#6b3a2a' stroke-width='16'/>" +
          "<path d='M70 30c-30 40 30 70 0 110' fill='none' stroke='url(#steam)' stroke-width='14'/>" +
          "<path d='M150 10c-30 40 30 70 0 110' fill='none' stroke='url(#steam)' stroke-width='14'/>" +
          "<path d='M230 30c-30 40 30 70 0 110' fill='none' stroke='url(#steam)' stroke-width='14'/>" +
        "</g>" +
        "<text x='60' y='120' font-family='Segoe UI, Arial' font-size='36' fill='#4a2417' font-weight='700'>Luxury Coffee</text>" +
        "<text x='60' y='165' font-family='Segoe UI, Arial' font-size='20' fill='#4a2417'>Warm tones · Premium aroma · Crafted daily</text>" +
        "<rect x='60' y='210' width='220' height='46' rx='23' fill='#4a2417'/>" +
        "<text x='92' y='241' font-family='Segoe UI, Arial' font-size='18' fill='#f7e8d9'>Order Now</text>" +
      "</svg>"
    );

  // Fixed preview image, no generation needed.

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-purple-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-48">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-800 dark:text-purple-300 px-6 py-3 rounded-full text-sm font-semibold border border-purple-200 dark:border-purple-800 backdrop-blur-sm shadow-lg"
            >
              <Rocket className="w-5 h-5" />
              ✨ AI-Powered Marketing Platform
            </motion.div>

            {/* Main Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="space-y-6"
            >
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent">
                  Create Marketing
                </span>
                <br />
                <span className="text-gray-900 dark:text-white">Ads with AI</span>
                <br />
                <span className="text-3xl md:text-5xl">in Seconds</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                Generate captions, images, scripts, and videos instantly. Build complete marketing campaigns with AI precision—no experience needed.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
            >
              <Link href="/campaigns">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 dark:shadow-purple-900/50 text-white px-10 py-7 text-lg font-bold shadow-2xl transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  Start Creating Free
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/generate-image">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-2 border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 px-10 py-7 text-lg font-bold"
                >
                  Try Image Generator
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-6 justify-center items-center text-sm text-gray-600 dark:text-gray-400 pt-4"
            >
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                No credit card required
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-green-500" />
                Free tier available
              </div>
              <div className="w-1 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                4.9/5 rating
              </div>
            </motion.div>
          </motion.div>

          {/* Floating Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur opacity-20" />
            <div className="relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-gray-700">
              <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-semibold">
                    <Sparkles className="w-4 h-4" />
                    See it in action
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                    Example prompt and output
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Here is a fixed example prompt and the sample image it produces.
                  </p>
                  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 px-4 py-3 text-gray-900 dark:text-gray-100">
                    {demoPrompt}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Demo uses a public preview generator for instant feedback.
                  </p>
                </div>
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-20" />
                  <div className="relative aspect-video rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 overflow-hidden flex items-center justify-center">
                    {demoImageUrl ? (
                      <img
                        src={demoImageUrl}
                        alt="Generated preview"
                        className="w-full h-full object-cover"
                        loading="eager"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="text-center"
                      >
                        <Sparkles className="w-16 h-16 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-300 font-semibold">Preview shows here</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-800 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 font-medium mb-2">{stat.label}</div>
                <div className="text-sm text-green-600 dark:text-green-400 font-semibold">{stat.change}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
              All-in-One Marketing Suite
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to create, manage, and optimize your marketing campaigns. All powered by cutting-edge AI.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Link href={feature.href}>
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 relative overflow-hidden">
                    {/* Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold rounded-full max-w-[75%] whitespace-normal text-center">
                        {feature.badge}
                      </span>
                    </div>

                    <CardHeader className="pb-4">
                      <div className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${feature.color} rounded-xl mb-4 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                        <feature.icon className="w-7 h-7 text-white" />
                      </div>
                      <CardTitle className="text-2xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-gray-600 dark:text-gray-400 leading-relaxed text-base">
                        {feature.description}
                      </CardDescription>
                      <div className="mt-6 flex items-center text-purple-600 dark:text-purple-400 font-semibold group-hover:translate-x-2 transition-transform">
                        Learn more
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-white dark:bg-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              Why Choose AdCraft?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of marketers creating professional content in minutes
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl mb-6 group-hover:scale-110 transition-transform">
                  <benefit.icon className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Caption Generator Section */}
      <section id="caption-generator" className="py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 -left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Try Our AI Caption Generator
            </h2>
            <p className="text-xl text-purple-100 max-w-3xl mx-auto">
              Experience the power of AI-driven content creation. Generate compelling captions for your campaigns instantly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl"
          >
            <CaptionGenerator />
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 via-white to-pink-50 dark:from-purple-900/20 dark:via-slate-800 dark:to-pink-900/20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Three simple steps to transform your marketing campaigns with AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative">

            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="relative"
              >
                <Card className="relative z-10 h-full overflow-visible border-2 border-purple-200 dark:border-purple-700 bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all">
                  <CardContent className="p-8 pt-12">
                    <div className="flex flex-col items-center text-center">
                      {/* Number Badge */}
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                          <span className="text-white font-black text-lg">{item.step}</span>
                        </div>
                      </div>

                      <div className="mt-6 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl mb-6">
                        {item.icon}
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link href="/campaigns">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-7 text-lg font-bold shadow-xl hover:shadow-2xl transition-all">
                Start Building Your Campaign
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-transparent to-black/10" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.h2
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-white leading-tight"
            >
              Start Creating Ads Today
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="text-xl text-white/90 max-w-2xl mx-auto"
            >
              Join 2000+ marketers creating professional ads with AI. No credit card required.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/campaigns">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-12 py-7 text-lg font-bold shadow-2xl hover:shadow-xl transition-all">
                  Start Free Now
                  <ArrowRight className="ml-3 w-6 h-6" />
                </Button>
              </Link>
              <Link href="/campaign-library">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white bg-white/10 hover:bg-white/20 px-12 py-7 text-lg font-bold"
                >
                  Explore Campaign Library
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gem className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-bold text-white">AdCraft</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered marketing platform for creating stunning ads in seconds.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/#caption-generator" className="hover:text-purple-400">Caption Generator</Link></li>
                <li><Link href="/generate-image" className="hover:text-purple-400">Image Generator</Link></li>
                <li><Link href="/generate-script" className="hover:text-purple-400">Script Generator</Link></li>
                <li><Link href="/campaigns" className="hover:text-purple-400">Campaigns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-purple-400">About</Link></li>
                <li><Link href="/blog" className="hover:text-purple-400">Blog</Link></li>
                <li><Link href="/pricing" className="hover:text-purple-400">Pricing</Link></li>
                <li><Link href="/contact" className="hover:text-purple-400">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy" className="hover:text-purple-400">Privacy</Link></li>
                <li><Link href="/terms" className="hover:text-purple-400">Terms</Link></li>
                <li><Link href="/support" className="hover:text-purple-400">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 AdCraft. All rights reserved. Powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}