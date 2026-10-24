import React from 'react';
import { User, Award, Check, Sparkles, X } from 'lucide-react';
import { PlayerCharacter, Badge, UserProgress } from '../types';
import { INITIAL_CHARACTERS } from '../data/questionsData';
import { soundManager } from '../utils/soundEffects';

interface CharacterModalProps {
  userProgress: UserProgress;
  onUpdateCharacter: (charId: 'tri' | 'duong' | 'long' | 'vy') => void;
  onClose: () => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  userProgress,
  onUpdateCharacter,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-indigo-500/40 rounded-2xl shadow-2xl p-5 sm:p-6 text-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Chọn Nhân Vật Thám Hiểm</h3>
              <p className="text-xs text-slate-400">Đại diện cho bạn trên Đảo Toán Học 9</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {INITIAL_CHARACTERS.map((char) => {
            const isSelected = userProgress.characterId === char.id;
            return (
              <div
                key={char.id}
                onClick={() => {
                  soundManager.playClick();
                  onUpdateCharacter(char.id);
                }}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-indigo-950/60 border-indigo-400 shadow-lg ring-2 ring-indigo-500/40'
                    : 'bg-slate-950/70 hover:bg-slate-850 border-slate-800'
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white font-black text-lg shadow-inner"
                  style={{ backgroundColor: char.color }}
                >
                  {char.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-white truncate">{char.name}</h4>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="text-xs font-semibold text-indigo-300 mb-1">{char.role}</div>
                  <p className="text-[11px] text-slate-400 leading-snug">{char.bio}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Badges Collection */}
        <div className="pt-2 border-t border-slate-800 space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" />
            Huy Hiệu Tiến Bộ & Nỗ Lực (Thông Tư 22)
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {userProgress.badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border text-center transition-all ${
                  badge.unlocked
                    ? 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    : 'bg-slate-950/50 border-slate-800/80 text-slate-600 opacity-60'
                }`}
              >
                <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-slate-900 flex items-center justify-center">
                  <Sparkles className={`w-4 h-4 ${badge.unlocked ? 'text-amber-400' : 'text-slate-600'}`} />
                </div>
                <div className="text-xs font-bold truncate">{badge.name}</div>
                <div className="text-[10px] mt-0.5 line-clamp-2 leading-tight">
                  {badge.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
