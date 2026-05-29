import React, { ReactNode } from 'react';

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="flex flex-col h-[100dvh] w-full bg-background relative overflow-hidden">
      <div className="flex-1 w-full h-full pb-safe overflow-y-auto phone-scrollbar">
        {children}
      </div>
    </div>
  );
}