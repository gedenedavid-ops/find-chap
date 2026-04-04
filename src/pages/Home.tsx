import { Button, Accordion } from "@heroui/react"
import { useNavigate } from "react-router-dom"
import Layout from "../components/Layout"
import { Zap, Rocket, Database, HelpCircle, FileText, Lock, Gauge, RefreshCcw } from "lucide-react"
import { useRef } from "react"

export default function Home() {
  const navigate = useNavigate()
  const faqRef = useRef<HTMLDivElement>(null)

  const scrollToFaq = () => {
    faqRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const faqItems = [
    {
      title: "Comment fonctionne la recherche ?",
      content: "Uploadez votre fichier (PDF, Excel, CSV), choisissez la colonne identifiante (ex: Matricule) et lancez votre recherche. Notre algorithme scanne instantanément des milliers de lignes.",
      icon: <FileText size={20} className="text-brand-indigo" />
    },
    {
      title: "Mes données sont-elles sécurisées ?",
      content: "Oui. FindChap traite vos données localement durant votre session. Aucun fichier n'est stocké de façon permanente sur nos serveurs.",
      icon: <Lock size={20} className="text-brand-green" />
    },
    {
      title: "Quels sont les formats acceptés ?",
      content: "Nous acceptons les fichiers Excel (.xlsx, .xls), CSV et PDF. Le système détecte automatiquement la structure de votre document.",
      icon: <Database size={20} className="text-blue-400" />
    },
    {
      title: "C'est vraiment instantané ?",
      content: "Absolument. FindChap est conçu pour l'excellence académique et peut traiter plus de 50 000 lignes en moins de 2 secondes.",
      icon: <Gauge size={20} className="text-orange-400" />
    },
    {
      title: "Puis-je changer de fichier ?",
      content: "Oui, vous pouvez recommencer à tout moment en cliquant sur le bouton 'Recommencer' dans l'interface de recherche.",
      icon: <RefreshCcw size={20} className="text-pink-400" />
    }
  ]

  return (
    <Layout>
      <div className="flex flex-col items-center text-center space-y-12 md:space-y-16 animate-in fade-in slide-in-from-bottom-10 duration-[1200ms] relative z-10 px-4 md:px-0">
        <div className="space-y-6 md:space-y-8 max-w-4xl pt-10 md:pt-20">
          <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full glass border border-white/10 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-brand-indigo mb-2 animate-bounce">
            <Zap size={12} fill="currentColor" />
            L'outil de recherche ultime
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-8xl font-title tracking-tighter leading-[0.85] md:leading-[0.8] uppercase font-black">
            Retrouve-la <br />
            <span className="text-gradient-indigo italic">Maintenant.</span>
          </h1>

          <p className="text-base md:text-2xl text-gray-400 font-sans max-w-2xl mx-auto leading-relaxed font-medium tracking-tight px-4 md:px-0">
            Fini de se perdre dans une multitude de lignes ou colonnes. <br className="hidden md:block" />
            Trouve exactement ce que tu cherches en moins de deux.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center w-full max-w-md pt-2 md:pt-4">
          <Button
            className="w-full md:w-auto bg-white text-black px-12 md:px-16 h-16 md:h-20 text-lg md:text-xl font-black uppercase tracking-widest hover:bg-brand-indigo hover:text-white hover:translate-y-[-6px] active:translate-y-[0] transition-all shadow-[0_20px_50px_rgba(255,255,255,0.15)] rounded-2xl md:rounded-3xl group"
            onPress={() => navigate('/upload')}
          >
            Commencer
            <Rocket size={18} className="ml-3 group-hover:translate-y-[-4px] group-hover:translate-x-[4px] transition-transform duration-500" />
          </Button>

          <button
            onClick={scrollToFaq}
            className="text-gray-400 hover:text-white uppercase tracking-[0.3em] md:tracking-[0.4em] text-[9px] md:text-[10px] font-black transition-all bg-transparent border-none py-4 px-8 underline underline-offset-8 decoration-white/0 hover:decoration-white/20"
          >
            En savoir plus
          </button>
        </div>



        {/* Section FAQ / En savoir plus */}
        <div ref={faqRef} className="w-full max-w-2xl pt-20 md:pt-48 pb-20 space-y-10 md:space-y-16 animate-in fade-in duration-1000 px-4 md:px-0">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border border-white/5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-brand-green">
              <HelpCircle size={14} />
              Exploration
            </div>
            <h2 className="text-3xl md:text-5xl font-title uppercase tracking-tighter font-black leading-none">Tout savoir.</h2>
          </div>

          <Accordion
            variant="default"
            className="px-0 w-full"
          >
            {faqItems.map((item, index) => (
              <Accordion.Item key={index} className="glass mb-3 rounded-xl md:rounded-2xl border border-white/5 px-4 md:px-5 py-0.5 md:py-1 overflow-hidden shadow-none group glossy-hover">
                <Accordion.Heading>
                  <Accordion.Trigger className="py-4 md:py-5 flex items-center justify-between w-full hover:no-underline">
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-brand-indigo/20 transition-colors">
                        {item.icon}
                      </div>
                      <span className="text-left font-bold text-gray-400 group-hover:text-white transition-colors text-xs md:text-sm tracking-tight leading-tight">
                        {item.title}
                      </span>
                    </div>
                  </Accordion.Trigger>
                </Accordion.Heading>
                <Accordion.Panel className="text-left text-gray-400 pb-5 md:pb-6 leading-relaxed px-0 text-[10px] md:text-xs pl-10 md:pl-12">
                  <Accordion.Body>
                    {item.content}
                  </Accordion.Body>
                </Accordion.Panel>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>
    </Layout>
  )
}
