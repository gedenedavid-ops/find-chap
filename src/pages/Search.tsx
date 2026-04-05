import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Button, 
  Input, 
  Card,
  Spinner
} from "@heroui/react";
import Layout from "../components/Layout";
import { ArrowLeft, Database, UploadCloud } from "lucide-react";
import axios from "axios";

export default function Search() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [selectedColumn, setSelectedColumn] = useState<string>("");
  const [sessionId, setSessionId] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedColumn = sessionStorage.getItem("findchap_selected_column");
    const storedSession = sessionStorage.getItem("findchap_session");
    
    if (storedColumn && storedSession) {
      setSelectedColumn(storedColumn);
      setSessionId(storedSession);
    } else {
      navigate("/");
    }
  }, [navigate]);

  const handleSearch = async (ev?: any) => {
    if (ev?.preventDefault) ev.preventDefault();
    if (!query) return;

    setIsSearching(true);
    setResult(null);
    setMessage(null);

    try {
      const response = await axios.post("/api/search", {
        session_id: sessionId,
        column: selectedColumn,
        query: query
      });

      if (response.data.result) {
        setResult(response.data.result);
      } else {
        setMessage(response.data.message);
      }
    } catch (error: any) {
      console.error("Erreur de recherche :", error);
      // Afficher le message d'erreur du backend si disponible
      const errorMessage = error.response?.data?.detail || "Une erreur est survenue lors de la recherche.";
      setMessage(errorMessage);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setQuery("");
    setResult(null);
    setMessage(null);
  };

  return (
    <Layout>
      <div className="flex flex-col items-center max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-1000">
        
        <div className="text-center space-y-8 w-full max-w-3xl">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-[10px] font-black uppercase tracking-widest">
              <Database size={12} />
              Accès Mémoire
            </div>
            <h2 className="text-5xl md:text-7xl font-title uppercase tracking-tighter leading-tight font-black">Recherche</h2>
            <p className="text-gray-400 font-sans leading-relaxed text-sm">
              Pivot d'indexation : <span className="text-white font-bold tracking-tight italic underline underline-offset-4 decoration-brand-indigo/50">"{selectedColumn}"</span>
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 w-full glass p-2 rounded-[2.5rem] shadow-2xl">
            <Input 
              placeholder={`Saisir ${selectedColumn.toLowerCase()}...`}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-grow font-sans font-bold text-lg bg-transparent border-none text-white focus:ring-0"
              disabled={isSearching}
            />
            <Button 
              className={`bg-white text-black px-12 h-16 font-black uppercase tracking-widest text-sm hover:bg-brand-indigo hover:text-white transition-all shadow-xl rounded-[2rem] min-w-[180px] ${isSearching ? 'opacity-70' : ''}`}
              onPress={() => handleSearch()}
              isDisabled={!query}
            >
              {isSearching ? <Spinner size="sm" color="current" /> : "Identifier"}
            </Button>
          </form>
          
          <button 
             className="text-gray-500 hover:text-white uppercase tracking-[0.3em] text-[9px] font-black transition-colors bg-transparent border-none py-2"
             onClick={() => navigate('/select-column')}
          >
             <ArrowLeft size={10} className="inline mr-2" />
             — Modifier le pivot de référence —
          </button>
        </div>

        <div className="w-full transition-all duration-700 min-h-[300px]">
          {result && (
            <Card className="w-full glass shadow-2xl p-8 md:p-12 rounded-[3rem] animate-in zoom-in-95 duration-700 overflow-visible text-left relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-green/20 blur-3xl rounded-full"></div>
              
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-brand-green/10 text-brand-green border border-brand-green/20 rounded-2xl flex items-center justify-center font-bold shadow-2xl shadow-brand-green/20">
                       <Database size={24} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-green leading-none">Record found</span>
                       <span className="text-sm font-bold text-gray-400 mt-1">Données extraites de la session</span>
                    </div>
                 </div>
                 <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                    <Button 
                        onPress={() => navigate('/upload')}
                        className="w-full md:w-auto text-gray-400 hover:text-white uppercase tracking-widest text-[9px] font-black bg-white/5 hover:bg-white/10 border border-white/5 rounded-full px-6 h-10"
                    >
                        <UploadCloud size={12} className="mr-2" />
                        Recommencer
                    </Button>
                    <Button 
                        onPress={handleReset}
                        className="w-full md:w-auto text-brand-indigo hover:text-white uppercase tracking-widest text-[9px] font-black bg-brand-indigo/10 hover:bg-brand-indigo border border-brand-indigo/20 rounded-full px-6 h-10 shadow-lg shadow-brand-indigo/10"
                    >
                        Nouveau Scan
                    </Button>
                 </div>
              </div>

              <div className="custom-table-container">
                <table className="w-full text-left font-sans border-separate border-spacing-y-2">
                  <thead>
                    <tr>
                      <th className="text-gray-500 font-black uppercase tracking-widest text-[9px] py-4 px-6">Propriété</th>
                      <th className="text-gray-500 font-black uppercase tracking-widest text-[9px] py-4 px-6 text-right">Valeur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(result).map(([key, val]: [string, any]) => (
                      <tr key={key} className="group">
                        <td className="py-4 px-6 text-[11px] font-black uppercase tracking-widest text-gray-400 border-l border-t border-b border-white/10 rounded-l-2xl glass-dark group-hover:border-brand-indigo/30 transition-colors">
                          {key}
                        </td>
                        <td className={`py-4 px-6 text-sm font-bold border-r border-t border-b border-white/10 rounded-r-2xl glass-dark text-right group-hover:border-brand-indigo/30 transition-colors ${key === selectedColumn ? "text-brand-indigo bg-brand-indigo/10" : "text-white"}`}>
                          {val !== null ? String(val) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {message && !isSearching && (
            <div className="flex flex-col items-center justify-center p-24 space-y-8 text-center animate-in fade-in zoom-in-95 duration-500 glass rounded-[3rem]">
               <div className="relative">
                  <div className="w-24 h-24 bg-white/5 text-gray-500 rounded-full flex items-center justify-center font-bold text-3xl border border-white/10">?</div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-brand-indigo rounded-full animate-ping opacity-20"></div>
               </div>
               <div className="space-y-3">
                 <p className="text-2xl font-black uppercase italic tracking-tighter text-white">{message}</p>
                 <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em] max-w-xs mx-auto leading-relaxed">Vérifiez l'entrée ou le pivot de référence.</p>
               </div>
                <div className="flex flex-col md:flex-row gap-4 w-full max-w-sm">
                  <Button 
                     className="w-full md:w-auto bg-white text-black font-black uppercase tracking-widest text-[10px] px-12 rounded-2xl border-none h-14 hover:bg-brand-indigo hover:text-white transition-all shadow-2xl active:scale-95"
                     onPress={handleReset}
                  >
                     Essayer à nouveau
                  </Button>
                  <Button 
                     className="w-full md:w-auto bg-white/5 text-gray-400 font-black uppercase tracking-widest text-[10px] px-12 rounded-2xl border border-white/5 h-14 hover:bg-white/10 hover:text-white transition-all active:scale-95"
                     onPress={() => navigate('/upload')}
                  >
                     <UploadCloud size={14} className="mr-2" />
                     Changer de fichier
                  </Button>
                </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
