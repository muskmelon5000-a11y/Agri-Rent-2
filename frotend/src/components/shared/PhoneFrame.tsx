import React, { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-background relative">
      <div className="flex-1 w-full min-h-screen pb-safe overflow-y-auto phone-scrollbar">
        {children}
      </div>
    </div>
  );
}