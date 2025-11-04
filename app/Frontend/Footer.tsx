'use client'
import React from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-green-500">AgriTracker</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering Pakistani farmers with real-time market data, weather insights, 
                and community support to make informed agricultural decisions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/prices" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Market Prices
                </Link>
              </li>
              <li>
                <Link href="/weather" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Weather Forecast
                </Link>
              </li>
              <li>
                <Link href="/forum" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  Community Forum
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Our Services</h4>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-400 hover:text-green-500 transition-colors text-sm cursor-pointer">
                  Live Price Updates
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-green-500 transition-colors text-sm cursor-pointer">
                  Weather Alerts
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-green-500 transition-colors text-sm cursor-pointer">
                  Crop Advisory
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-green-500 transition-colors text-sm cursor-pointer">
                  Market Trends
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-green-500 transition-colors text-sm cursor-pointer">
                  Farming Tips
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-green-500" />
                <span className="text-gray-400 text-sm">
                  Agriculture House, Lahore, Pakistan
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-green-500" />
                <span className="text-gray-400 text-sm">
                  +92 300 1234567
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-green-500" />
                <span className="text-gray-400 text-sm">
                  info@agritracker.pk
                </span>
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2 text-white">Stay Updated</h5>
              <div className="flex space-x-2">
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                />
                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 AgriTracker. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-green-500 transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}