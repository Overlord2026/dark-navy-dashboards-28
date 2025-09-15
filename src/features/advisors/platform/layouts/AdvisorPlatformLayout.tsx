import { Button } from "@/components/ui/button"
import { AdvisorPlatformSidebar } from "../components/AdvisorPlatformSidebar"

interface AdvisorPlatformLayoutProps {
  children: React.ReactNode
}

export function AdvisorPlatformLayout({ children }: AdvisorPlatformLayoutProps) {
  return (
    <div className="min-h-screen flex w-full">
      <AdvisorPlatformSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="h-12 flex items-center border-b bg-background px-4">
          <h1 className="text-lg font-semibold">Advisor Platform</h1>
        </header>
        
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}