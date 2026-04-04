import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@heroui/react";
import Layout from "../components/Layout";
import { Upload as UploadIcon, File as FileIcon, X, Sparkles } from "lucide-react";
import axios from "axios";

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const interval = setInterval(() => {
        setProgress((prev) => (prev < 90 ? prev + 10 : prev));
      }, 200);

      const response = await axios.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(interval);
      setProgress(100);

      sessionStorage.setItem("findchap_session", response.data.session_id);
      sessionStorage.setItem("findchap_columns", JSON.stringify(response.data.columns));
      sessionStorage.setItem("findchap_filename", response.data.filename);

      setTimeout(() => navigate("/select-column"), 800);

    } catch (error) {
      console.error("Erreur lors de l'upload :", error);
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <Layout>
      <div className="flex flex-col items-center max-w-lg mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo text-[10px] font-bold uppercase tracking-widest mb-4">
            <Sparkles size={12} />
            Système Intelligent
          </div>
          <h2 className="text-5xl md:text-6xl font-title uppercase tracking-tighter leading-tight font-black">Analyse</h2>
          <p className="text-gray-400 font-sans max-w-xs mx-auto text-sm leading-relaxed">
            Propulsez vos fichiers PDF ou Excel dans notre moteur de recherche instantané.
          </p>
        </div>

        <Card 
          className={`w-full h-80 flex flex-col items-center justify-center p-8 transition-all duration-500 relative overflow-hidden group glass cursor-pointer ${
            file ? 'border-brand-indigo/50 ring-4 ring-brand-indigo/5' : 'hover:border-white/20'
          }`}
          onPointerDown={() => !isUploading && fileInputRef.current?.click()}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-indigo/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange}
            accept=".pdf,.xlsx,.xls,.csv"
            disabled={isUploading}
          />
          
          {file ? (
            <div className="flex flex-col items-center space-y-6 animate-in zoom-in-95 duration-500 relative z-10 w-full">
              <div className="w-24 h-24 bg-white/5 text-brand-indigo rounded-3xl flex items-center justify-center shadow-2xl shadow-brand-indigo/20 group-hover:scale-110 transition-transform duration-500">
                <FileIcon size={40} />
              </div>
              <div className="text-center w-full px-4">
                <p className="font-bold text-xl tracking-tight truncate w-full">{file.name}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-2 font-bold focus:outline-none">
                  {(file.size / 1024 / 1024).toFixed(2)} MB — Prêt pour l'extraction
                </p>
              </div>
              <div 
                className="absolute top-4 right-4 bg-brand-indigo/10 border border-brand-indigo/20 text-brand-indigo hover:bg-brand-indigo hover:text-white rounded-full p-2.5 transition-all cursor-pointer shadow-lg active:scale-95 group/x"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
              >
                <X size={18} className="group-hover/x:rotate-90 transition-transform duration-300" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6 text-gray-500 group-hover:text-white transition-colors duration-500 relative z-10">
              <div className="w-20 h-20 rounded-full border-2 border-white/5 flex items-center justify-center group-hover:border-brand-indigo/40 transition-colors duration-500">
                <UploadIcon size={40} strokeWidth={1} className="group-hover:translate-y-[-5px] transition-transform duration-500" />
              </div>
              <div className="text-center space-y-1">
                <p className="font-bold uppercase tracking-[0.2em] text-xs">Déposez votre document</p>
                <p className="text-[10px] opacity-50 uppercase tracking-widest font-medium">Formats supportés : PDF, XLSX, CSV</p>
              </div>
            </div>
          )}
        </Card>

        <div className="w-full flex flex-col items-center space-y-8 h-32">
          {isUploading && (
            <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                   className="h-full bg-brand-indigo transition-all duration-300 ease-out shadow-[0_0_20px_rgba(99,102,241,0.5)]" 
                   style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-center text-[10px] font-black tracking-[0.3em] text-brand-indigo uppercase animate-pulse">Extraction des données en cours...</p>
            </div>
          )}

          {!isUploading && file && (
            <Button 
              className="bg-white text-black px-16 h-16 font-black uppercase tracking-widest hover:bg-brand-indigo hover:text-white transition-all text-sm shadow-2xl rounded-2xl hover:translate-y-[-4px] active:translate-y-[0]"
              onPress={handleUpload}
            >
              Lancer l'analyse
            </Button>
          )}

          {!file && !isUploading && (
            <div className="flex items-center gap-2 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-bold italic border border-white/5">PDF</div>
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-bold italic border border-white/5">XLS</div>
               <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[10px] font-bold italic border border-white/5">CSV</div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
