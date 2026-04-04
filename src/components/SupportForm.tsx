import { useState } from 'react';
import {
  Button
} from "@heroui/react";
import axios from 'axios';
import { Send, MessageSquareHeart, X, User, Phone, Mail, MessageSquare } from 'lucide-react';

interface SupportFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function SupportForm({ isOpen, onOpenChange }: SupportFormProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const DISCORD_WEBHOOK_URL = import.meta.env.VITE_DISCORD_WEBHOOK_URL || "";

  const isFormValid = fullName.trim() !== '' && message.trim() !== '';

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setStatus('loading');
    try {
      if (DISCORD_WEBHOOK_URL) {
        await axios.post(DISCORD_WEBHOOK_URL, {
          content: null,
          embeds: [{
            title: "🚀 Nouveau Feedback FindChap Production",
            description: "Un utilisateur a envoyé un message depuis le portail de support.",
            color: 6385407, // Brand Indigo
            fields: [
              { name: "👤 Nom Complet", value: `\`${fullName}\``, inline: true },
              { name: "📱 Numéro", value: `\`${phone || "Non fourni"}\``, inline: true },
              { name: "📧 Email", value: `\`${email || "Non fourni"}\``, inline: true },
              { name: "💬 Message", value: `>>> ${message}` }
            ],
            footer: {
              text: "FindChap v1.2 — Système de Production",
              icon_url: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            },
            timestamp: new Date().toISOString()
          }]
        });
      }
 else {
        console.warn("Webhook Discord non configuré.");
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setStatus('success');
      setTimeout(() => {
        onOpenChange(false);
        setFullName('');
        setEmail('');
        setPhone('');
        setMessage('');
        setStatus('idle');
      }, 2000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 animate-in fade-in duration-300">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-xl"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative w-full max-w-xl glass border-white/10 rounded-[3rem] shadow-2xl p-8 md:p-12 animate-in zoom-in-95 duration-300 flex flex-col gap-8 text-white overflow-hidden max-h-[95vh] overflow-y-auto custom-scrollbar">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-brand-indigo via-white/20 to-brand-green" />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-brand-indigo/20 flex items-center justify-center text-brand-indigo shadow-2xl shadow-brand-indigo/20">
              <MessageSquareHeart size={24} />
            </div>
            <div className="flex flex-col text-left">
              <h3 className="font-title font-black uppercase tracking-tighter text-2xl leading-none">Support Direct</h3>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">soumettez vos préoccupations à l'équipe FindChap</span>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-12 h-12 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors text-gray-500 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Nom Complet */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 ml-1">
              <User size={12} className="text-brand-indigo" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Nom Complet <span className="text-brand-indigo italic">(requis)</span></p>
            </div>
            <div className="glass-dark border-white/5 rounded-2xl px-5 py-4 focus-within:border-brand-indigo/50 transition-colors flex items-center gap-3">
              <input
                placeholder="Edene David"
                className="w-full bg-transparent border-none text-white text-sm font-bold focus:ring-0 placeholder:text-gray-700 outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          </div>

          {/* Numéro */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 ml-1">
              <Phone size={12} className="text-gray-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Numéro <span className="text-gray-700 italic">(optionnel)</span></p>
            </div>
            <div className="glass-dark border-white/5 rounded-2xl px-5 py-4 focus-within:border-brand-indigo/50 transition-colors">
              <input
                placeholder="+225 07 00 00 00"
                className="w-full bg-transparent border-none text-white text-sm font-bold focus:ring-0 placeholder:text-gray-700 outline-none font-mono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Email */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 ml-1">
              <Mail size={12} className="text-gray-500" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Votre Email <span className="text-gray-700 italic">(optionnel)</span></p>
            </div>
            <div className="glass-dark border-white/5 rounded-2xl px-5 py-4 focus-within:border-brand-indigo/50 transition-colors">
              <input
                type="email"
                placeholder="contact@exemple.com"
                className="w-full bg-transparent border-none text-white text-sm font-bold focus:ring-0 placeholder:text-gray-700 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Message */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 ml-1">
              <MessageSquare size={12} className="text-brand-indigo" />
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Votre message <span className="text-brand-indigo italic">(requis)</span></p>
            </div>
            <div className="glass-dark border-white/5 rounded-[2rem] px-5 py-5 focus-within:border-brand-indigo/50 transition-colors">
              <textarea
                placeholder="Comment pouvons-nous vous aider ?"
                rows={4}
                className="w-full bg-transparent border-none text-white text-sm font-bold focus:ring-0 placeholder:text-gray-700 outline-none resize-none leading-relaxed"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {status === 'success' && (
            <div className="bg-brand-green/10 border border-brand-green/20 text-brand-green px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
              <div className="w-3 h-3 rounded-full bg-brand-green animate-pulse" />
              Merci ! Votre message a été transmis avec succès.
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-4 animate-in slide-in-from-top-4 duration-500">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              Une erreur est survenue lors de l'envoi.
            </div>
          )}

          <div className="flex items-center gap-4">
            <Button
              className="flex-grow bg-white text-black h-16 font-black uppercase tracking-widest text-[11px] rounded-[1.5rem] hover:bg-brand-indigo hover:text-white transition-all shadow-[0_20px_50px_rgba(255,255,255,0.1)] active:scale-95 disabled:opacity-30 disabled:grayscale"
              onPress={handleSubmit}
              isDisabled={!isFormValid || status === 'loading'}
            >
              {status === 'loading' ? 'Transmission en cours...' : 'Envoyer mon feedback'}
              {status !== 'loading' && <Send size={16} className="ml-3" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
