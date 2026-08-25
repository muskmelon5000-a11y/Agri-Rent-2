import React from 'react';
import { Link } from 'react-router-dom';
import { AppHeader } from '../../components/shared/AppHeader';
import { Card } from '../../components/shared/Card';
import { Input } from '../../components/shared/Input';
import {
  SearchIcon,
  PhoneIcon,
  MessageCircleIcon,
  MailIcon,
  ChevronRightIcon } from
'lucide-react';
export function HelpSupport() {
  return (
    <div className="h-full bg-background flex flex-col">
      <AppHeader title="Help & Support" showBack />

      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* Search */}
        <Input
          placeholder="Search for help..."
          icon={<SearchIcon className="w-5 h-5 text-gray-400" />} />
        

        {/* Contact Support Card */}
        <Card className="p-5 bg-primary text-white border-none">
          <h2 className="text-lg font-bold mb-2">Need immediate help?</h2>
          <p className="text-primary-100 text-sm mb-6">
            Our support team is available 24/7 to assist you with bookings and
            issues.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white text-primary py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50">
              <PhoneIcon className="w-4 h-4" /> Call Us
            </button>
            <button className="bg-[#25D366] text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#20BD5A]">
              <MessageCircleIcon className="w-4 h-4" /> WhatsApp
            </button>
          </div>
        </Card>

        {/* Categories */}
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3">
            Help Categories
          </h2>
          <div className="space-y-2">
            <Card className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <span className="font-semibold text-gray-900">
                Booking & Payments
              </span>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Card>
            <Link to="/faq">
              <Card className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <span className="font-semibold text-gray-900">
                  Equipment Usage FAQs
                </span>
                <ChevronRightIcon className="w-5 h-5 text-gray-400" />
              </Card>
            </Link>
            <Card className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <span className="font-semibold text-gray-900">
                Account & Profile
              </span>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Card>
            <Card className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
              <span className="font-semibold text-gray-900">
                Safety & Rules
              </span>
              <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            </Card>
          </div>
        </div>

        {/* Email Support */}
        <div className="text-center pt-4">
          <p className="text-sm text-gray-600 mb-2">Prefer email?</p>
          <a
            href="mailto:support@cropmate.com"
            className="inline-flex items-center gap-2 text-primary font-bold">
            
            <MailIcon className="w-4 h-4" /> support@cropmate.com
          </a>
        </div>
      </div>
    </div>);

}