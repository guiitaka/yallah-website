'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronRight, Star } from 'lucide-react';

export default function MobileHomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white px-4 py-6">
        <h1 className="text-2xl font-bold mb-2">Discover Events</h1>
        <div className="bg-gray-100 rounded-full px-4 py-2 flex items-center">
          <input
            type="search"
            placeholder="Search events..."
            className="bg-transparent w-full outline-none text-sm"
          />
        </div>
      </header>

      {/* Featured Events */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Featured Events</h2>
          <button className="text-blue-500 text-sm font-medium">See All</button>
        </div>
        <div className="space-y-4">
          {[1, 2].map((item) => (
            <div key={item} className="bg-white rounded-2xl p-4 shadow-sm">
              <div className="relative h-48 w-full mb-4 rounded-xl overflow-hidden">
                <Image
                  src="/placeholder-event.jpg"
                  alt="Event"
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="font-semibold mb-1">Summer Music Festival</h3>
              <p className="text-gray-500 text-sm mb-2">July 15 • Central Park</p>
              <div className="flex items-center text-sm text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="ml-1">4.8 (2.5k reviews)</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-6">
        <h2 className="text-lg font-semibold mb-4">Categories</h2>
        <div className="grid grid-cols-2 gap-4">
          {['Music', 'Sports', 'Arts', 'Food'].map((category) => (
            <button
              key={category}
              className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm"
            >
              <span className="font-medium">{category}</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          ))}
        </div>
      </section>
    </div>
  );
} 