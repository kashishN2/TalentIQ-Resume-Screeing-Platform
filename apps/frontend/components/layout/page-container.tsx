import type { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
}

export default function PageContainer({
  children,
}: PageContainerProps) {
  return (
    <div className="min-h-screen bg-[#f6f7fb]">
      {children}
    </div>
  );
}
