'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function HomeContent() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-16"
    >
      <h1 className="text-4xl md:text-6xl font-bold text-center mb-8">
        Bem-vindo à Yallah
      </h1>
      <p className="text-xl text-center text-gray-600 max-w-2xl mx-auto">
        Especialistas em administração de imóveis para Airbnb e Booking
      </p>
    </motion.section>
  )
} 