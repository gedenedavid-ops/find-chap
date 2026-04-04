import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import Layout from "../components/Layout";
import { Search, ChevronRight, Settings2, FileCheck } from "lucide-react";

export default function SelectColumn() {
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedColumns = sessionStorage.getItem("findchap_columns");
    const storedFilename = sessionStorage.getItem("findchap_filename");
    
    if (storedColumns && storedFilename) {
      setColumns(JSON.parse(storedColumns));
      setFilename(storedFilename);
    } else {
      navigate("/upload");
    }
  }, [navigate]);

  const handleConfirm = () => {
    if (!selectedColumn) return;
    sessionStorage.setItem("findchap_selected_column", selectedColumn);
    navigate("/search");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center max-w-2xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-bold uppercase tracking-widest">
            <FileCheck size={12} />
            Document Identifié
          </div>
          <h2 className="text-5xl md:text-6xl font-title uppercase tracking-tighter leading-tight font-black">Indexation</h2>
          <div className="space-y-2">
            <p className="text-gray-400 font-sans max-w-md mx-auto leading-relaxed text-sm">
                Définissez le pivot de recherche pour <span className="text-white font-bold tracking-tight italic underline decoration-brand-indigo/50 underline-offset-4">{filename}</span>.
            </p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {columns.map((column) => (
                <div 
                  key={column}
                  className={`p-6 md:p-8 cursor-pointer transition-all duration-500 rounded-[2.5rem] glass relative overflow-hidden group hover:translate-y-[-6px] active:scale-95 ${
                    selectedColumn === column 
                    ? 'border-brand-indigo bg-brand-indigo/20 shadow-[0_0_40px_rgba(99,102,241,0.2)]' 
                    : 'hover:border-white/20'
                  }`}
                  onClick={() => setSelectedColumn(column)}
                >
                   {/* Glow effect for selected item */}
                   {selectedColumn === column && (
                     <div className="absolute top-0 right-0 w-32 h-32 bg-brand-indigo/20 blur-[50px] -mr-10 -mt-10 animate-pulse" />
                   )}
                   
                   <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                   
                   <div className="flex items-center justify-between relative z-10">
                      <div className="flex flex-col gap-2">
                        <span className={`font-sans font-black text-lg tracking-tight transition-all ${selectedColumn === column ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                          {column}
                        </span>
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${selectedColumn === column ? 'bg-brand-indigo animate-pulse' : 'bg-gray-700'}`} />
                           <span className={`text-[10px] uppercase tracking-widest font-black transition-colors ${selectedColumn === column ? 'text-brand-indigo' : 'text-gray-600 group-hover:text-gray-400'}`}>
                             {selectedColumn === column ? 'Sélectionné' : 'Définir comme pivot'}
                           </span>
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${selectedColumn === column ? 'bg-brand-indigo text-white rotate-0 shadow-brand-indigo/30' : 'bg-white/5 text-gray-600 rotate-12 group-hover:rotate-0'}`}>
                         {selectedColumn === column ? <FileCheck size={20} /> : <Settings2 size={20} />}
                      </div>
                   </div>
                </div>
            ))}
        </div>

        <div className="flex flex-col items-center space-y-6 pt-8 w-full">
            <Button 
                isDisabled={!selectedColumn}
                className={`px-16 h-16 font-black uppercase tracking-[0.2em] transition-all text-sm shadow-2xl rounded-2xl ${
                    selectedColumn ? 'bg-white text-black hover:bg-brand-indigo hover:text-white hover:translate-y-[-4px] active:translate-y-[0]' : 'bg-white/5 text-gray-600 grayscale cursor-not-allowed border-none'
                }`}
                onPress={handleConfirm}
            >
                Finaliser la structure
                <ChevronRight size={18} className="ml-2" />
            </Button>
            
            <button 
               className="text-gray-500 hover:text-white uppercase tracking-[0.3em] text-[9px] font-black transition-colors bg-transparent border-none py-2"
               onClick={() => navigate('/upload')}
            >
               — Annuler et recharger —
            </button>
        </div>

        <div className="flex gap-4 items-center text-[9px] text-gray-500 glass-dark py-4 px-8 rounded-full font-black uppercase tracking-[0.2em] border-white/5 shadow-2xl">
            <Search size={14} className="text-brand-indigo animate-pulse" />
            Matching direct . Indexation optimisée . Recherche éclair
        </div>
      </div>
    </Layout>
  );
}
