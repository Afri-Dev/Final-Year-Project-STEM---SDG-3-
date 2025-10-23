'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FlipCard from '@components/3DFlipCard';
import FloatingElement from '@components/FloatingElement';
import TiltCard from '@components/TiltCard';
import { FiBook, FiCode, FiLayers, FiZap, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function ComponentsDemo() {
  const [activeTab, setActiveTab] = useState('flip');
  const [isMounted, setIsMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setReducedMotion(
      typeof window !== 'undefined' && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }, []);

  if (!isMounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">Loading...</div>;
  }

  const features = [
    {
      id: 1,
      icon: <FiBook className="text-4xl text-primary" />,
      title: 'Interactive Learning',
      description: 'Engage with interactive content that makes learning fun and effective.',
      details: 'Our platform uses advanced learning techniques to help you retain information better and make learning an enjoyable experience.'
    },
    {
      id: 2,
      icon: <FiCode className="text-4xl text-primary" />,
      title: 'Hands-on Coding',
      description: 'Practice coding with our interactive code editor and real-time feedback.',
      details: 'Get instant feedback on your code with our advanced evaluation system that helps you learn from your mistakes.'
    },
    {
      id: 3,
      icon: <FiLayers className="text-4xl text-primary" />,
      title: 'Structured Curriculum',
      description: 'Follow a well-structured learning path designed by industry experts.',
      details: 'Our curriculum is carefully designed to take you from beginner to advanced level with clear learning objectives.'
    },
    {
      id: 4,
      icon: <FiZap className="text-4xl text-primary" />,
      title: 'Quick Challenges',
      description: 'Test your skills with quick challenges and quizzes.',
      details: 'Reinforce your learning with bite-sized challenges that test your understanding of key concepts.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent mb-4">
            Interactive UI Components
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore our collection of interactive UI components designed to enhance user engagement
          </p>
        </header>

        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'flip', label: '3D Flip Cards' },
            { id: 'tilt', label: '3D Tilt Cards' },
            { id: 'float', label: 'Floating Elements' },
            { id: 'combined', label: 'Combined Effects' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="min-h-[60vh] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              {activeTab === 'flip' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <FlipCard
                      key={feature.id}
                      frontContent={
                        <>
                          <div className="text-5xl mb-4">{feature.icon}</div>
                          <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                          <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                        </>
                      }
                      backContent={
                        <>
                          <h3 className="text-xl font-bold mb-4">Learn More</h3>
                          <p className="mb-4 text-white/90">{feature.details}</p>
                          <div className="flex items-center text-sm text-white/80">
                            <span>Explore feature</span>
                            <FiArrowRight className="ml-2" />
                          </div>
                        </>
                      }
                      delay={index * 0.1}
                      className="h-80"
                    />
                  ))}
                </div>
              )}

              {activeTab === 'tilt' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <TiltCard 
                      key={feature.id} 
                      className="h-80 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
                      delay={index * 0.1}
                      intensity={15}
                      scale={1.03}
                    >
                      <div className="h-full flex flex-col">
                        <div className="text-5xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">{feature.description}</p>
                        <button className="mt-auto px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors self-start flex items-center">
                          Learn more <FiArrowRight className="ml-2" />
                        </button>
                      </div>
                    </TiltCard>
                  ))}
                </div>
              )}

              {activeTab === 'float' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {features.map((feature, index) => (
                    <FloatingElement 
                      key={feature.id}
                      delay={index * 0.2}
                      intensity={0.5}
                      duration={3 + index * 0.5}
                      className="h-80"
                    >
                      <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col">
                        <div className="text-5xl mb-4">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{feature.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">{feature.description}</p>
                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <FiCheckCircle className="mr-2 text-green-500" />
                            Interactive element
                          </div>
                        </div>
                      </div>
                    </FloatingElement>
                  ))}
                </div>
              )}

              {activeTab === 'combined' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.slice(0, 2).map((feature, index) => (
                    <TiltCard 
                      key={feature.id} 
                      className="h-96"
                      delay={index * 0.1}
                      intensity={20}
                      scale={1.02}
                    >
                      <FloatingElement 
                        delay={index * 0.2}
                        intensity={0.3}
                        duration={4 + index * 0.5}
                        className="h-full"
                      >
                        <FlipCard
                          frontContent={
                            <div className="p-6 h-full flex flex-col">
                              <div className="text-5xl mb-4">{feature.icon}</div>
                              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
                              <p className="text-gray-600 dark:text-gray-300 mb-6 flex-1">{feature.description}</p>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                Click to see more
                              </div>
                            </div>
                          }
                          backContent={
                            <div className="p-6 h-full flex flex-col">
                              <h3 className="text-2xl font-bold mb-4">More Details</h3>
                              <p className="text-white/90 mb-6 flex-1">{feature.details}</p>
                              <button 
                                className="mt-auto px-4 py-2 bg-white/20 rounded-lg backdrop-blur-sm text-white hover:bg-white/30 transition-colors self-start"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Handle button click
                                }}
                              >
                                Get Started
                              </button>
                            </div>
                          }
                          className="h-full"
                        />
                      </FloatingElement>
                    </TiltCard>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-16 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>These components are fully responsive and respect the user's motion preferences.</p>
          <p className="mt-2">
            {reducedMotion 
              ? "Reduced motion is enabled in your system preferences." 
              : "Tip: Try hovering over the elements to see the effects!"}
          </p>
        </div>
      </div>
    </div>
  );
}
