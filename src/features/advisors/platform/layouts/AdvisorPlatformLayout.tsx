import { Outlet } from "react-router-dom"
import { AdvisorPlatformSidebar } from "../components/AdvisorPlatformSidebar"

export function AdvisorPlatformLayout() {
  return (
    <div className="min-h-screen flex w-full">
      <AdvisorPlatformSidebar />
      
      <div className="flex-1 flex flex-col">
        <header className="h-12 flex items-center border-b bg-background px-4">
          <h1 className="text-lg font-semibold">Advisor Platform</h1>
        </header>
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}