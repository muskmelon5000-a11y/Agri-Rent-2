import React, { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen w-full bg-background relative">
      <div className="w-full h-full pb-safe overflow-y-auto">
        {children}
      </div>
    </div>
  );
}