import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@heroui/react";
import Layout from "../components/Layout";
import { Search, ChevronRight, ChevronLeft, Settings2, FileCheck, X } from "lucide-react";

export default function SelectColumn() {
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [filename, setFilename] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);
  const navigate = useNavigate();

  // Responsive items per page: 6 sur desktop (md+), 5 sur mobile
  const ITEMS_PER_PAGE = isMobile ? 5 : 6;

  // Filtrer les colonnes basées sur la recherche
  const filteredColumns = columns.filter(col =>
    col.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredColumns.length / ITEMS_PER_PAGE);
  
  // Colonnes à afficher pour la page actuelle
  const startIdx = currentPage * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const displayedColumns = filteredColumns.slice(startIdx, endIdx);

  useEffect(() => {
    const storedColumns = sessionStorage.getItem("findchap_columns");
    const storedFilename = sessionStorage.getItem("findchap_filename");
    
    if (storedColumns && storedFilename) {
      setColumns(JSON.parse(storedColumns));
      setFilename(storedFilename);
      setCurrentPage(0);
    } else {
      navigate("/upload");
    }
  }, [navigate]);

  // Détecter les changements de taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setCurrentPage(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Réinitialiser la page quand la recherche change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery]);

  const handleConfirm = () => {
    if (!selectedColumn) return;
    sessionStorage.setItem("findchap_selected_column", selectedColumn);
    navigate("/search");
  };

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <Layout>
      <div className="flex flex-col items-center max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="text-center space-y-6 w-full">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-bold uppercase tracking-widest">
            <FileCheck size={12} />
            Document Identifié
          </div>
          <h2 className="text-5xl md:text-6xl font-title uppercase tracking-tighter leading-tight font-black">Indexation</h2>
          <div className="space-y-2">
            <p className="text-gray-400 font-sans max-w-md mx-auto leading-relaxed text-sm">
                Définissez le pivot de recherche pour <span className="text-white font-bold tracking-tight italic underline decoration-brand-indigo/50 underline-offset-4">{filename}</span>.
            </p>
            <p className="text-gray-500 font-sans text-[11px] uppercase tracking-widest">
              {filteredColumns.length > 0 ? `${filteredColumns.length} colonne${filteredColumns.length > 1 ? 's' : ''} ${searchQuery ? '(résultats filtrés)' : ''}` : 'Aucune colonne trouvée'}
            </p>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="w-full max-w-2xl">
          <div className="relative flex items-center gap-2 bg-white/5 border border-white/10 text-white rounded-2xl px-4 py-2 focus-within:border-brand-indigo/50 focus-within:bg-white/10 transition-all">
            <Search size={16} className="text-gray-500 flex-shrink-0" />
            <input
              type="text"
              placeholder="Rechercher une colonne (N°, Nom, HLFI64203...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent outline-none flex-1 text-white placeholder-gray-500 font-sans"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                aria-label="Effacer la recherche"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Grille des colonnes - Responsive: 6 colonnes on desktop, 5 on mobile */}
        {filteredColumns.length > 0 ? (
          <div className={`w-full gap-4 min-h-[400px] ${isMobile ? 'grid grid-cols-1' : 'grid grid-cols-2 lg:grid-cols-3'}`}>
            {displayedColumns.map((column) => (
                <div 
                  key={column}
                  className={`p-4 md:p-6 cursor-pointer transition-all duration-500 rounded-2xl md:rounded-[2.5rem] glass relative overflow-hidden group hover:translate-y-[-6px] active:scale-95 ${
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
                   
                   <div className="flex items-center justify-between relative z-10 gap-2">
                      <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <span className={`font-sans font-black text-xs md:text-sm tracking-tight transition-all line-clamp-2 ${selectedColumn === column ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                          {column}
                        </span>
                        <div className="flex items-center gap-2">
                           <div className={`w-1 h-1 rounded-full flex-shrink-0 ${selectedColumn === column ? 'bg-brand-indigo animate-pulse' : 'bg-gray-700'}`} />
                           <span className={`text-[9px] uppercase tracking-widest font-black transition-colors whitespace-nowrap ${selectedColumn === column ? 'text-brand-indigo' : 'text-gray-600 group-hover:text-gray-400'}`}>
                             {selectedColumn === column ? 'Sel.' : 'Def.'}
                           </span>
                        </div>
                      </div>
                      <div className={`w-8 h-8 lg:w-10 lg:h-10 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl flex-shrink-0 ${selectedColumn === column ? 'bg-brand-indigo text-white rotate-0 shadow-brand-indigo/30' : 'bg-white/5 text-gray-600 rotate-12 group-hover:rotate-0'}`}>
                         {selectedColumn === column ? <FileCheck size={14} /> : <Settings2 size={14} />}
                      </div>
                   </div>
                </div>
            ))}
          </div>
        ) : (
          <div className="w-full text-center py-12">
            <p className="text-gray-500 text-sm">Aucune colonne ne correspond à votre recherche</p>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-4 md:gap-6 pt-4 w-full flex-wrap">
            <Button 
              isDisabled={currentPage === 0}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-3 md:px-4 h-10 md:h-12 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              onPress={goToPrevPage}
            >
              <ChevronLeft size={16} />
            </Button>
            
            <div className="flex items-center gap-1 md:gap-2">
              {Array.from({ length: Math.min(totalPages, 9) }).map((_, idx) => {
                // Afficher au max 9 points/indicateurs
                if (totalPages <= 9 || idx < 4 || idx >= totalPages - 4 || Math.abs(idx - currentPage) <= 1) {
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx)}
                      className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                        idx === currentPage 
                          ? 'bg-brand-indigo w-6 md:w-8' 
                          : 'bg-white/20 hover:bg-white/40'
                      }`}
                      title={`Page ${idx + 1}`}
                    />
                  );
                } else if (idx === 4 && currentPage < totalPages - 5) {
                  return (
                    <span key="ellipsis" className="text-gray-500 text-xs px-1">
                      ...
                    </span>
                  );
                }
                return null;
              })}
            </div>

            <Button 
              isDisabled={currentPage === totalPages - 1}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full px-3 md:px-4 h-10 md:h-12 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              onPress={goToNextPage}
            >
              <ChevronRight size={16} />
            </Button>

            <span className="text-gray-500 text-xs md:text-sm whitespace-nowrap ml-auto md:ml-0">
              {currentPage + 1} / {totalPages}
            </span>
          </div>
        )}

        <div className="flex flex-col items-center space-y-6 pt-8 w-full">
            <Button 
                isDisabled={!selectedColumn}
                className={`px-12 md:px-16 h-12 md:h-16 font-black uppercase tracking-widest md:tracking-[0.2em] transition-all text-xs md:text-sm shadow-2xl rounded-2xl ${
                    selectedColumn ? 'bg-white text-black hover:bg-brand-indigo hover:text-white hover:translate-y-[-4px] active:translate-y-[0]' : 'bg-white/5 text-gray-600 grayscale cursor-not-allowed border-none'
                }`}
                onPress={handleConfirm}
            >
                Finaliser
                <ChevronRight size={16} className="ml-2" />
            </Button>
            
            <button 
               className="text-gray-500 hover:text-white uppercase tracking-[0.3em] text-[8px] md:text-[9px] font-black transition-colors bg-transparent border-none py-2"
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
