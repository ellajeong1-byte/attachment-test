import React, { useState, useEffect } from 'react';
import { T, questions, results, computeResult, LOVE_RESET_URL } from './attachmentData';
import { loveT, loveQuestions, loveQuestionsSingle, loveResults, loveAskSingle, computeLoveRanking } from './loveLanguage';
import { Heart, MessageCircle, ArrowLeft, ArrowRight, RotateCcw, Share2, ChevronRight, Clock, Users, User } from 'lucide-react';

const LANG_OPTIONS = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日本語' },
  { code: 'zh', label: '中文' },
];

const typeColors = {
  secure:  { bg: 'from-emerald-50/50 to-teal-50/30', accent: '#3D6B5A', light: '#E8F0EC', card: 'border-emerald-200/50' },
  anxious: { bg: 'from-amber-50/50 to-orange-50/30', accent: '#B87A3A', light: '#FDF0E0', card: 'border-amber-200/50' },
  avoidant: { bg: 'from-slate-100/50 to-blue-50/30', accent: '#4A6B9B', light: '#E4ECF4', card: 'border-slate-200/50' },
  fearful: { bg: 'from-purple-50/40 to-violet-50/30', accent: '#6B4FA0', light: '#EDE6F6', card: 'border-purple-200/50' },
  anxious_avoidant: { bg: 'from-amber-50/40 to-slate-50/30', accent: '#8B6B3A', light: '#F5EDE0', card: 'border-amber-200/50' },
  anxious_fearful: { bg: 'from-amber-50/40 to-purple-50/30', accent: '#7B4F8A', light: '#F0E6F4', card: 'border-purple-200/50' },
  avoidant_fearful: { bg: 'from-slate-50/40 to-purple-50/30', accent: '#5A4F85', light: '#E8E4F0', card: 'border-violet-200/50' },
};

const premiumLoveColors = {
  words: { bg: 'from-rose-50/40 to-pink-50/20', accent: '#9B4F5A', light: '#F5E0E4', card: 'border-rose-200/40' },
  time:  { bg: 'from-violet-50/40 to-purple-50/20', accent: '#6B4FA0', light: '#EDE6F6', card: 'border-violet-200/40' },
  gifts: { bg: 'from-amber-50/40 to-yellow-50/20', accent: '#9B7D3A', light: '#F5EBD0', card: 'border-amber-200/40' },
  acts:  { bg: 'from-emerald-50/40 to-teal-50/20', accent: '#3D6B5A', light: '#E8F0EC', card: 'border-emerald-200/40' },
  touch: { bg: 'from-sky-50/40 to-blue-50/20', accent: '#3A6B9B', light: '#E0ECF5', card: 'border-sky-200/40' },
};

export default function AttachmentQuiz() {
  const [lang, setLang] = useState('ko');
  const [testType, setTestType] = useState('attachment');
  const [relationshipStatus, setRelationshipStatus] = useState('couple');
  const [screen, setScreen] = useState('home');
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [resultKey, setResultKey] = useState('secure');
  const [secondaryKey, setSecondaryKey] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);
  const [showPayhipEmbed, setShowPayhipEmbed] = useState(false);

  const isLove = testType === 'love';
  const isSingle = relationshipStatus === 'single';
  const t = T[lang];
  const lt = loveT[lang];
  const qs = isLove ? (isSingle ? loveQuestionsSingle[lang] : loveQuestions[lang]) : questions[lang];
  const res = isLove ? loveResults[lang] : results[lang];

  const transition = (cb) => { setFadeIn(false); setTimeout(() => { cb(); setFadeIn(true); }, 300); };

  const handleAnswer = (idx) => {
    const newAnswers = [...answers, idx];
    setAnswers(newAnswers);
    if (newAnswers.length >= qs.length) {
      if (isLove) {
        const ranking = computeLoveRanking(newAnswers, qs);
        transition(() => { setResultKey(ranking[0]); setSecondaryKey(ranking[1]); setScreen('result'); });
      } else {
        const rk = computeResult(newAnswers, qs);
        transition(() => { setResultKey(rk); setScreen('result'); });
      }
    } else {
      transition(() => setCurrentQ(currentQ + 1));
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      transition(() => { setAnswers(answers.slice(0, -1)); setCurrentQ(currentQ - 1); });
    }
  };

  const restart = () => { transition(() => { setScreen('home'); setCurrentQ(0); setAnswers([]); }); };
  const startTest = (type) => { setTestType(type); transition(() => { setCurrentQ(0); setAnswers([]); setScreen('quiz'); }); };
  const openLoveIntro = () => { setTestType('love'); transition(() => { setScreen('loveIntro'); }); };
  const startLove = (status) => { setTestType('love'); setRelationshipStatus(status); transition(() => { setCurrentQ(0); setAnswers([]); setScreen('quiz'); }); };

  const share = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setShowCopied(true); setTimeout(() => setShowCopied(false), 2000); } catch { }
  };

  const payhipEmbedKey = lang === 'ko' ? 'uWMgQ' : '8k35D';

  useEffect(() => {
    if (!showPayhipEmbed) return;
    const scriptId = 'payhip-embed-page-script';
    const initPayhip = () => {
      requestAnimationFrame(() => {
        if (window.PayhipEmbed && typeof window.PayhipEmbed.init === 'function') {
          window.PayhipEmbed.init();
        }
      });
    };
    const existing = document.getElementById(scriptId);
    if (!existing) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://payhip.com/embed-page.js?v=24u68985';
      script.async = true;
      script.onload = initPayhip;
      script.onerror = () => console.warn('Payhip embed script failed to load');
      document.body.appendChild(script);
    } else {
      initPayhip();
    }
  }, [showPayhipEmbed, payhipEmbedKey, resultKey]);

  const info = res[resultKey];
  const colors = (isLove ? premiumLoveColors[resultKey] : typeColors[resultKey]) || typeColors.secure;
  const secLabels = isLove
    ? { your: lt.yourLove, a: lt.feelLabel, b: lt.missLabel, c: isSingle ? lt.askLabelSingle : lt.askLabel }
    : { your: t.yourType, a: t.strengths, b: t.traps, c: t.practices };
  const secData = isLove
    ? { a: info?.feel, b: info?.miss, c: isSingle ? (loveAskSingle[lang][resultKey] || info?.ask) : info?.ask }
    : { a: info?.strengths, b: info?.traps, c: info?.practices };

  const fontLink = "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap";

  return (
    <>
      <link href={fontLink} rel="stylesheet" />
      <style>{`
        .fade-enter { opacity: 1; transform: translateY(0); transition: all 0.4s cubic-bezier(.4,0,.2,1); }
        .fade-exit { opacity: 0; transform: translateY(8px); transition: all 0.3s ease; }
      `}</style>

      <div className="min-h-screen bg-cream">

        {/* ─── Header ─── */}
        <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md">
          <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
            <button onClick={() => { if (screen !== 'home') restart(); }} className="select-none" aria-label="Home">
              <span className="font-display text-[15px] font-semibold tracking-[0.25em] text-forest">HEART LAB</span>
            </button>
            <div className="flex gap-0.5">
              {LANG_OPTIONS.map(l => (
                <button key={l.code} onClick={() => { setLang(l.code); if (screen !== 'home') restart(); }}
                  className={`text-[11px] px-2 py-1 rounded-sm transition-all duration-200 ${
                    lang === l.code
                      ? 'text-forest font-medium bg-forest/5'
                      : 'text-neutral-400 hover:text-neutral-600'
                  }`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="h-px bg-sand/60" />
        </header>

        <div className={`max-w-xl mx-auto px-6 py-10 ${fadeIn ? 'fade-enter' : 'fade-exit'}`}>

          {/* ═══ HOME ═══ */}
          {screen === 'home' && (
            <div className="pt-20 pb-8">
              <div className="flex justify-center mb-10">
                <div className="w-10 h-px bg-gold" />
              </div>

              <div className="text-center mb-16">
                <h1 className="font-display text-[32px] md:text-[38px] font-medium text-charcoal leading-[1.25] whitespace-pre-line tracking-tight">
                  {lt.homeHeading}
                </h1>
                <p className="text-[13px] text-neutral-400 mt-4 tracking-[0.15em] uppercase font-light">
                  {lt.homeSub}
                </p>
              </div>

              <div className="space-y-4">
                <button onClick={() => startTest('attachment')}
                  className="group w-full text-left p-7 bg-white rounded-2xl border border-sand hover:border-forest/20 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-forest/[0.06] flex items-center justify-center shrink-0 group-hover:bg-forest/[0.10] transition-colors duration-300">
                      <Heart size={21} strokeWidth={1.4} className="text-forest" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-[17px] font-semibold text-charcoal leading-snug whitespace-pre-line">{lt.pickAttachTitle}</h2>
                      <p className="text-[12px] text-neutral-400 mt-1.5 leading-relaxed">{lt.pickAttachDesc}</p>
                    </div>
                    <ChevronRight size={18} className="text-neutral-300 group-hover:text-forest shrink-0 transition-colors duration-300 group-hover:translate-x-0.5" />
                  </div>
                </button>

                <button onClick={openLoveIntro}
                  className="group w-full text-left p-7 bg-white rounded-2xl border border-sand hover:border-gold/30 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 rounded-xl bg-gold/[0.08] flex items-center justify-center shrink-0 group-hover:bg-gold/[0.14] transition-colors duration-300">
                      <MessageCircle size={21} strokeWidth={1.4} className="text-gold" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="font-display text-[17px] font-semibold text-charcoal leading-snug whitespace-pre-line">{lt.pickLoveTitle}</h2>
                      <p className="text-[12px] text-neutral-400 mt-1.5 leading-relaxed">{lt.pickLoveDesc}</p>
                    </div>
                    <ChevronRight size={18} className="text-neutral-300 group-hover:text-gold shrink-0 transition-colors duration-300 group-hover:translate-x-0.5" />
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ═══ LOVE INTRO ═══ */}
          {screen === 'loveIntro' && (
            <div className="pt-16">
              <div className="text-center mb-10">
                <span className="inline-block text-[10px] font-medium text-gold tracking-[0.2em] uppercase mb-5">
                  {lt.introBadge}
                </span>
                <h1 className="font-display text-[28px] font-medium text-charcoal leading-tight whitespace-pre-line">
                  {lt.introQ}
                </h1>
                <p className="text-[13px] text-neutral-400 mt-3">{lt.introHint}</p>
              </div>
              <div className="space-y-3">
                <button onClick={() => startLove('couple')}
                  className="group w-full text-left p-6 bg-white rounded-2xl border border-sand hover:border-forest/20 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-forest/[0.06] flex items-center justify-center shrink-0">
                      <Users size={18} strokeWidth={1.5} className="text-forest" />
                    </div>
                    <div>
                      <p className="font-medium text-[15px] text-charcoal">{lt.introCouple}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{lt.introCoupleSub}</p>
                    </div>
                  </div>
                </button>
                <button onClick={() => startLove('single')}
                  className="group w-full text-left p-6 bg-white rounded-2xl border border-sand hover:border-gold/25 shadow-[0_1px_3px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-0.5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gold/[0.08] flex items-center justify-center shrink-0">
                      <User size={18} strokeWidth={1.5} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-medium text-[15px] text-charcoal">{lt.introSingle}</p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">{lt.introSingleSub}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ═══ QUIZ ═══ */}
          {screen === 'quiz' && qs[currentQ] && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button onClick={handleBack}
                  className={`text-neutral-400 hover:text-forest transition-colors ${currentQ === 0 ? 'invisible' : ''}`}>
                  <ArrowLeft size={20} strokeWidth={1.5} />
                </button>
                <span className="text-[12px] text-neutral-400 tracking-wider font-light">
                  {currentQ + 1} {t.of} {qs.length}
                </span>
                <div className="w-5" />
              </div>

              <div className="w-full h-[2px] bg-sand rounded-full mb-10 overflow-hidden">
                <div className="h-full bg-forest rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQ + 1) / qs.length) * 100}%` }} />
              </div>

              <h2 className="text-[18px] font-medium text-charcoal mb-8 leading-relaxed">
                {isLove ? lt.pairPrompt : qs[currentQ].q}
              </h2>

              <div className="space-y-3">
                {qs[currentQ].options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswer(idx)}
                    className="w-full text-left p-5 bg-white rounded-xl border border-sand hover:border-forest/20 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-[0_3px_14px_rgba(0,0,0,0.06)] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.995]">
                    <p className="text-[14px] text-neutral-600 leading-relaxed">{opt.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ RESULT ═══ */}
          {screen === 'result' && info && (
            <div>
              {/* Type Header */}
              <div className="text-center mb-10 pt-10">
                <p className="text-[10px] text-gold tracking-[0.25em] uppercase font-medium mb-4">{secLabels.your}</p>
                <div className="w-8 h-px bg-gold mx-auto mb-6" />
                <h1 className="font-display text-[30px] font-semibold text-charcoal mb-3">{info.title}</h1>
                <p className="text-[13px] text-neutral-500 leading-relaxed max-w-xs mx-auto">{info.summary}</p>
                {isLove && secondaryKey && res[secondaryKey] && (
                  <p className="text-[12px] mt-4">
                    <span className="text-neutral-400">{lt.secondaryLabel}</span>
                    <span className="mx-2 text-sand">|</span>
                    <span className="font-medium" style={{ color: (premiumLoveColors[secondaryKey] || {}).accent }}>
                      {res[secondaryKey].title}
                    </span>
                  </p>
                )}
              </div>

              {/* Strengths */}
              <div className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 mb-4`}>
                <h3 className="text-[10px] font-semibold text-neutral-500 tracking-[0.18em] uppercase mb-4">{secLabels.a}</h3>
                <div className="flex flex-wrap gap-2">
                  {secData.a.map((s, i) => (
                    <span key={i} className="bg-white/70 text-neutral-600 text-[12px] px-3.5 py-1.5 rounded-full border border-white/40">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Watch Out */}
              <div className="bg-white rounded-2xl p-6 mb-4 border border-sand">
                <h3 className="text-[10px] font-semibold text-neutral-500 tracking-[0.18em] uppercase mb-4">{secLabels.b}</h3>
                <div className="space-y-3">
                  {secData.b.map((tr, i) => (
                    <p key={i} className="text-[13px] text-neutral-500 leading-relaxed pl-4 border-l-2"
                      style={{ borderColor: colors.accent + '30' }}>{tr}</p>
                  ))}
                </div>
              </div>

              {/* Practices */}
              <div className="bg-white rounded-2xl p-6 mb-10 border border-sand">
                <h3 className="text-[10px] font-semibold text-neutral-500 tracking-[0.18em] uppercase mb-4">{secLabels.c}</h3>
                <div className="space-y-3">
                  {secData.c.map((pr, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-[11px] font-semibold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: colors.light, color: colors.accent }}>{i + 1}</span>
                      <p className="text-[13px] text-neutral-500 leading-relaxed">{pr}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Love Reset CTA */}
              <div className="bg-forest rounded-2xl p-7 mb-4 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.03] rounded-full -translate-y-1/2 translate-x-1/2" />
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-2 relative">{t.coupleWorkbook}</p>
                <h4 className="font-display text-[20px] font-semibold mb-1 relative">{t.loveReset}</h4>
                <p className="text-[13px] text-white/60 mb-5 relative">{t.loveResetSub}</p>
                <div className="flex items-center gap-3 mb-5 relative">
                  <span className="text-[13px] text-white/30 line-through">{t.loveResetOriginal}</span>
                  <span className="text-[24px] font-semibold">{t.loveResetSale}</span>
                  <span className="px-2.5 py-0.5 bg-gold text-white text-[10px] font-semibold rounded tracking-wider">{t.loveResetOff}</span>
                </div>
                <button onClick={() => {
                    if (showPayhipEmbed) {
                      setShowPayhipEmbed(false);
                    } else {
                      setShowPayhipEmbed(true);
                      setTimeout(() => {
                        const embedEl = document.querySelector('.payhip-embed-page iframe');
                        if (!embedEl) {
                          window.open(`https://payhip.com/b/${payhipEmbedKey}`, '_blank');
                        }
                      }, 2000);
                    }
                  }}
                  className="relative w-full bg-gold hover:bg-[#A6845E] text-white py-3.5 rounded-xl font-medium text-[14px] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] flex items-center justify-center gap-2">
                  {t.loveResetCta}
                  <ArrowRight size={16} strokeWidth={2} />
                </button>
                {showPayhipEmbed && (
                  <div className="mt-4 rounded-xl overflow-hidden bg-white relative">
                    <div key={`${payhipEmbedKey}-${lang}-${resultKey}`} className="payhip-embed-page" data-key={payhipEmbedKey} />
                  </div>
                )}
              </div>

              {/* Type Workbook CTA */}
              <div className={`bg-white rounded-2xl p-6 mb-10 border ${colors.card}`}>
                <p className="text-[10px] tracking-[0.2em] uppercase text-neutral-400 mb-2">{info.title}</p>
                <h4 className="text-[16px] font-semibold text-charcoal mb-1">{info.workbook.title}</h4>
                <p className="text-[12px] text-neutral-400 mb-5">{info.workbook.desc}</p>
                <button onClick={() => setShowComingSoon(true)}
                  className="w-full py-3 rounded-xl font-medium text-[13px] border-[1.5px] transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ borderColor: colors.accent, color: colors.accent }}>
                  {isLove ? lt.typeCta : info.workbook.cta}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-14">
                <button onClick={restart}
                  className="flex-1 py-3 rounded-xl text-[13px] font-medium text-neutral-500 bg-white border border-sand hover:border-neutral-300 transition-all duration-200 flex items-center justify-center gap-2">
                  <RotateCcw size={14} strokeWidth={1.5} />
                  {t.retry}
                </button>
                <button onClick={share}
                  className="flex-1 py-3 rounded-xl text-[13px] font-medium text-forest bg-forest/[0.05] border border-forest/10 hover:border-forest/25 transition-all duration-200 flex items-center justify-center gap-2">
                  <Share2 size={14} strokeWidth={1.5} />
                  {t.share}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Copied Toast */}
        {showCopied && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[13px] px-6 py-3 rounded-xl shadow-lg z-50 tracking-wide">
            {t.copied}
          </div>
        )}

        {/* Coming Soon Modal */}
        {showComingSoon && (
          <div className="fixed inset-0 bg-black/15 backdrop-blur-sm flex items-center justify-center z-50 p-6"
            onClick={() => setShowComingSoon(false)}>
            <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl border border-sand/50"
              onClick={e => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-full bg-forest/[0.06] flex items-center justify-center mx-auto mb-5">
                <Clock size={22} strokeWidth={1.4} className="text-forest" />
              </div>
              <h3 className="font-display text-[20px] font-semibold text-charcoal mb-2">{t.comingSoon}</h3>
              <p className="text-[13px] text-neutral-400 mb-6 whitespace-pre-line leading-relaxed">
                {(t.comingSoonDesc || '').replace(/\s*💕\s*/g, '')}
              </p>
              <button onClick={() => setShowComingSoon(false)}
                className="px-8 py-3 rounded-xl bg-ivory text-neutral-600 font-medium text-[13px] hover:bg-sand/60 transition-all duration-200">
                {t.close}
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
