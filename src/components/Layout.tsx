import React, { useState } from 'react'
import GeometricBackground from './ui/geometric'
import SupportForm from './SupportForm'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const onOpen = () => setIsOpen(true)
  const onOpenChange = (open: boolean) => setIsOpen(open)

  return (
    <GeometricBackground className="min-h-screen">
      <div className="relative min-h-screen flex flex-col items-center px-4 md:px-6 transition-all duration-700 ease-in-out selection:bg-brand-indigo/30 z-10">
        
        {/* Header Premium */}
        <nav className="w-full max-w-5xl py-6 md:py-10 flex items-center justify-between z-10">
          <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.href = '/'}>
            <div className="w-7 h-7 md:w-8 md:h-8 bg-brand-indigo rounded-lg flex items-center justify-center font-black text-white shadow-lg shadow-brand-indigo/40 group-hover:rotate-12 transition-transform duration-500 text-xs md:text-sm">F</div>
            <span className="text-lg md:text-xl font-bold font-title tracking-tighter uppercase whitespace-nowrap">FindChap.</span>
          </div>
          <div className="flex items-center">
            <button 
              onClick={onOpen}
              className="px-3 md:px-4 py-1.5 rounded-full border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white/5 backdrop-blur-md whitespace-nowrap text-gray-500 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            >
              Support
            </button>
          </div>
        </nav>

        <main className="w-full max-w-4xl pt-8 md:pt-12 pb-20 z-10 flex-grow">
          {children}
        </main>

        <footer className="w-full py-10 md:py-12 text-center text-[9px] md:text-[10px] text-gray-500 font-bold uppercase tracking-[0.3em] md:tracking-[0.4em] z-10 mt-auto">
          FindChap — Fait par Edene David
        </footer>
      </div>

      <SupportForm isOpen={isOpen} onOpenChange={onOpenChange} />
    </GeometricBackground>
  )
}

export default Layout
