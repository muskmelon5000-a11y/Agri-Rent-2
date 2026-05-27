import React from 'react';
interface PhoneFrameProps {
  children: ReactNode;
}
export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
      <div className="relative">
        {/* Phone Frame */}
        <div className="w-[390px] h-[844px] bg-black rounded-[3rem] shadow-2xl p-3 relative">
          {/* Screen */}
          <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-11 bg-surface z-50 flex items-center justify-between px-6">
              <span className="text-sm font-semibold text-gray-900">9:41</span>
              <div className="w-24 h-6 bg-black rounded-full" />
              <div className="flex items-center gap-1">
                <div className="w-4 h-3 border border-gray-900 rounded-sm" />
                <div className="w-1 h-2 bg-gray-900 rounded-sm" />
              </div>
            </div>

            {/* Content Area */}
            <div className="h-full pt-11 pb-8 overflow-y-auto phone-scrollbar">
              {children}
            </div>
          </div>

          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white rounded-full opacity-50" />
        </div>
      </div>
    </div>);

}