import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/app-sidebar"

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <TooltipProvider>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-6 md:p-8">
          {children}
        </main>
        <footer className="border-t px-6 py-4 text-center text-xs text-muted-foreground">
          Built by <span className="font-medium text-foreground">Group 2</span> with 🫶
        </footer>
      </SidebarInset>
    </SidebarProvider>
    <Toaster />
    </TooltipProvider>
  )
}
