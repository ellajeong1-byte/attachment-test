import React, { useState, useEffect, useRef } from 'react';
import { loveT, loveQuestions, loveQuestionsSingle, loveResults, loveAskSingle, computeLoveRanking, loveColors } from './loveLanguage';

const LANG_OPTIONS = [
  { code: 'ko', label: '한국어', flag: '🇰🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

const T = {
  ko: {
    discover: '나의 애착유형은?',
    subtitle: '3분이면 충분해요',
    description: '12개 질문으로 알아보는\n나의 관계 패턴과 애착 스타일',
    start: '테스트 시작하기',
    of: '/',
    strengths: '나의 강점',
    traps: '주의할 점',
    practices: '이번 주 실천 3가지',
    retry: '다시 하기',
    share: '결과 공유',
    copied: '링크가 복사되었어요!',
    comingSoon: '준비 중이에요!',
    comingSoonDesc: '곧 만나볼 수 있어요.\n조금만 기다려 주세요 💕',
    close: '닫기',
    loveReset: '사랑 리셋',
    loveResetSub: '다시 사랑에 빠질, 30가지 마법의 질문들',
    loveResetCta: '사랑 리셋 시작하기',
    loveResetOriginal: '$16',
    loveResetSale: '$13',
    loveResetOff: '19% OFF',
    yourType: '당신의 애착유형',
    coupleWorkbook: '커플 워크북',
  },
  en: {
    discover: 'What\'s Your\nAttachment Style?',
    subtitle: 'Just 3 minutes',
    description: 'Discover your relationship patterns\nthrough 12 simple questions',
    start: 'Start the Test',
    of: '/',
    strengths: 'Your Strengths',
    traps: 'Watch Out For',
    practices: 'Try This Week',
    retry: 'Retake',
    share: 'Share Result',
    copied: 'Link copied!',
    comingSoon: 'Coming Soon!',
    comingSoonDesc: 'This workbook is on its way.\nStay tuned! 💕',
    close: 'Close',
    loveReset: 'Love Reset',
    loveResetSub: '30 magical questions to fall in love again',
    loveResetCta: 'Start Love Reset',
    loveResetOriginal: '$16',
    loveResetSale: '$13',
    loveResetOff: '19% OFF',
    yourType: 'Your Attachment Style',
    coupleWorkbook: 'Couple Workbook',
  },
  ja: {
    discover: 'あなたの\n愛着スタイルは？',
    subtitle: '3分で完了',
    description: '12の質問であなたの\n恋愛パターンを発見',
    start: 'テストを始める',
    of: '/',
    strengths: 'あなたの強み',
    traps: '注意ポイント',
    practices: '今週の実践3つ',
    retry: 'もう一度',
    share: '結果をシェア',
    copied: 'リンクをコピーしました！',
    comingSoon: '準備中です！',
    comingSoonDesc: 'もうすぐ登場します。\nお楽しみに 💕',
    close: '閉じる',
    loveReset: 'ラブリセット',
    loveResetSub: 'もう一度恋に落ちる30の魔法の質問',
    loveResetCta: 'ラブリセットを始める',
    loveResetOriginal: '$16',
    loveResetSale: '$13',
    loveResetOff: '19% OFF',
    yourType: 'あなたの愛着タイプ',
    coupleWorkbook: 'カップルワークブック',
  },
  zh: {
    discover: '你的\n依恋类型是？',
    subtitle: '只需3分钟',
    description: '12个问题揭示\n你的恋爱模式',
    start: '开始测试',
    of: '/',
    strengths: '你的优势',
    traps: '需要注意',
    practices: '本周实践3件事',
    retry: '重新测试',
    share: '分享结果',
    copied: '链接已复制！',
    comingSoon: '即将上线！',
    comingSoonDesc: '正在准备中，\n请稍等 💕',
    close: '关闭',
    loveReset: '爱情重置',
    loveResetSub: '让你重新坠入爱河的30个神奇问题',
    loveResetCta: '开始爱情重置',
    loveResetOriginal: '$16',
    loveResetSale: '$13',
    loveResetOff: '19% OFF',
    yourType: '你的依恋类型',
    coupleWorkbook: '情侣工作手册',
  },
};

const questions = {
  ko: [
    { q: "연인(또는 가까운 사람)에게 연락이 한동안 없을 때 나는...", options: [
      { text: "괜찮다 — 각자 바쁠 수 있으니까", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "불안해지고 먼저 연락하게 된다", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "오히려 편하고 나만의 시간이 좋다", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "무시당하는 느낌인데 먼저 연락하기도 싫다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "갈등이 생겼을 때 나의 첫 반응은...", options: [
      { text: "대화로 풀고 싶고 서로 이해하려 노력한다", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "빨리 해결하고 싶어서 바로 이야기하려 한다", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "혼자 있고 싶고 대화 자체를 피하고 싶다", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "감정이 폭발했다가 후회하거나 완전히 닫혀버린다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "상대에게 도움이나 부탁을 할 때 나는...", options: [
      { text: "필요할 때 편하게 말하고 거절해도 괜찮다", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "말하지만 거절당하면 상처받고 관계가 불안해진다", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "거의 부탁하지 않는다 — 혼자 해결하는 게 편하다", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "말하고 싶지만 폐를 끼칠까 봐 참게 된다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "스킨십이나 애정표현에 대해 나는...", options: [
      { text: "자연스럽게 주고받는 편이고 거부감이 없다", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "좋아하고 자주 원하는 편이다", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "과하면 부담스럽고 적당한 거리가 좋다", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "원하면서도 어색하고 상대 반응이 신경 쓰인다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "관계에서 '확신'을 느끼는 순간은...", options: [
      { text: "서로 편안하게 대화하고 다툼 후에도 회복될 때", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "상대가 자주 연락하고 애정표현을 해줄 때", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "서로 간섭하지 않고 각자 시간을 존중할 때", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "확신을 느낀 적이 거의 없다 — 불안과 안정이 반복된다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "미래를 함께 계획하는(여행, 약속 등) 대화가 나오면...", options: [
      { text: "구체적으로 이야기하며 설레고 기대된다", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "좋지만 혹시 그때까지 관계가 유지될까 걱정도 된다", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "너무 먼 미래보다는 당장 가능한 것만 말한다", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "기대하고 싶지만 상대가 진심인지 의심이 먼저 든다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "상대가 다른 사람과 친하게 지내는 걸 보면...", options: [
      { text: "자연스럽게 받아들이고 나도 내 친구들과 시간을 보낸다", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "내가 소외된 기분이 들고 상대의 마음이 궁금하다", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "별로 신경 쓰지 않는다 — 각자 사회생활이 있는 거니까", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "괜찮은 척하지만 속으로 불안하고 혼자 생각이 많아진다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "감정이 격해지는 상황(다툼, 오해 등)에서 나는...", options: [
      { text: "시간을 두고 감정을 정리한 뒤 대화로 풀려고 한다", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "참을 수 없어서 바로 감정을 쏟아내게 된다", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "감정을 느끼지 않으려고 하고 거리를 둔다", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "감정이 오락가락하고 나도 내 반응을 예측할 수 없다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "혼자 있는 시간에 대해 나는...", options: [
      { text: "즐기면서도 함께하는 시간과 균형을 맞춘다", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "혼자 있으면 외롭고 누군가와 연결되고 싶다", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "혼자가 가장 편하고 충전되는 시간이다", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "혼자 있으면 불안하면서도 사람들과 있으면 지친다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "관계가 끝났을 때(이별) 나의 패턴은...", options: [
      { text: "슬프지만 정리하고 배울 점을 찾으려 한다", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "집착하거나 다시 연락하게 된다", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "빠르게 정리하고 감정을 차단한다", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "후회와 안도가 번갈아 오고 감정 정리가 오래 걸린다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "상대가 나의 약점이나 실수를 지적하면...", options: [
      { text: "들을 건 듣고 아닌 건 대화로 풀어본다", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "거부당하는 느낌이 들고 관계가 흔들리는 것 같다", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "불편하면 그냥 넘기거나 거리를 둔다", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "공격받는 느낌이 들어 방어적이 되거나 무너진다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "새로운 사람과 관계를 시작할 때 나는...", options: [
      { text: "열린 마음으로 천천히 알아가는 과정을 즐긴다", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "빠르게 가까워지고 싶고 상대 반응에 민감하다", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "경계를 유지하고 쉽게 마음을 열지 않는다", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "다가가고 싶으면서도 상처받을까 봐 망설여진다", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
  ],
  en: [
    { q: "When I haven't heard from my partner for a while...", options: [
      { text: "I'm okay — they're probably just busy", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "I get anxious and reach out first", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "I actually enjoy the alone time", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "I feel ignored but don't want to reach out either", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "When conflict arises, my first reaction is to...", options: [
      { text: "Talk it through and try to understand each other", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "Address it immediately — I need resolution fast", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "Withdraw and avoid the conversation", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "Explode emotionally, then regret or shut down", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "When asking someone for help, I...", options: [
      { text: "Ask comfortably and handle rejection fine", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "Ask but feel hurt and insecure if rejected", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "Rarely ask — I prefer handling things alone", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "Want to ask but hold back, afraid of being a burden", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "About physical affection, I...", options: [
      { text: "Give and receive naturally without discomfort", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "Love it and want it often", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "Prefer some distance — too much feels overwhelming", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "Want it but feel awkward and worry about their reaction", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "I feel most secure in a relationship when...", options: [
      { text: "We communicate well and recover after disagreements", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "They text often and show lots of affection", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "We respect each other's personal space", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "I rarely feel secure — it fluctuates constantly", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "When future plans come up (trips, commitments)...", options: [
      { text: "I get excited and love planning together", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "I'm happy but worry if we'll still be together", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "I prefer keeping things short-term and realistic", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "I want to hope but doubt if they're serious", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "When my partner is close with others...", options: [
      { text: "I'm fine and spend time with my own friends", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "I feel left out and wonder about their feelings", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "I don't mind — everyone has their social life", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "I act fine but internally feel anxious and overthink", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "When emotions run high (arguments, misunderstandings)...", options: [
      { text: "I take time to process, then discuss calmly", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "I can't hold back and pour out my feelings", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "I try not to feel anything and distance myself", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "My emotions swing wildly and I can't predict my reactions", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "About alone time, I...", options: [
      { text: "Enjoy it while balancing time with others", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "Feel lonely and want to connect with someone", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "Love it — it's when I feel most at peace", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "Feel anxious alone, but also drained around people", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "After a breakup, I tend to...", options: [
      { text: "Grieve, then reflect and find lessons", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "Obsess or try to reconnect", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "Move on quickly and shut down emotions", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "Alternate between regret and relief for a long time", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "When someone points out my flaws...", options: [
      { text: "I listen to what's valid and discuss the rest", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "I feel rejected and the relationship feels shaky", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "I brush it off or distance myself", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "I feel attacked and either defend or crumble", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "Starting a new relationship, I...", options: [
      { text: "Stay open and enjoy getting to know them slowly", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "Want to get close fast and watch for their reactions", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "Keep my guard up and don't open easily", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "Want to get close but fear getting hurt", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
  ],
  ja: [
    { q: "恋人からしばらく連絡がない時、私は...", options: [
      { text: "大丈夫 — お互い忙しいこともある", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "不安になって自分から連絡してしまう", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "むしろ気楽で、一人の時間を楽しむ", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "無視されている感じだけど連絡もしたくない", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "対立が起きた時、最初の反応は...", options: [
      { text: "話し合って理解し合おうとする", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "すぐに解決したくてすぐ話し合おうとする", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "一人になりたくて会話を避けたい", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "感情が爆発して後悔するか完全に閉じてしまう", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "相手に助けやお願いをする時...", options: [
      { text: "必要な時は気軽に言えて断られても大丈夫", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "言うけど断られると傷ついて不安になる", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "ほとんど頼まない — 自分で解決する方が楽", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "言いたいけど迷惑かけそうで我慢する", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "スキンシップや愛情表現について...", options: [
      { text: "自然にやり取りできて抵抗はない", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "好きでよく求める方だ", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "多すぎると負担で適度な距離がいい", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "求めたいけどぎこちなくて相手の反応が気になる", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "関係で「確信」を感じる瞬間は...", options: [
      { text: "気楽に話せてケンカの後も回復できる時", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "相手が頻繁に連絡して愛情表現してくれる時", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "お互い干渉せず各自の時間を尊重する時", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "確信を感じたことがほとんどない — 不安と安定が繰り返す", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "将来の計画の話が出ると...", options: [
      { text: "具体的に話してワクワクする", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "嬉しいけどその頃まで関係が続くか不安", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "遠い未来より今できることだけ話す", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "期待したいけど本気なのか疑ってしまう", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "相手が他の人と仲良くしているのを見ると...", options: [
      { text: "自然に受け入れて自分も友達と過ごす", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "疎外感を感じて相手の気持ちが気になる", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "あまり気にしない — 各自の社会生活がある", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "平気なふりして内心不安で考え込む", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "感情が高ぶる場面では...", options: [
      { text: "時間をおいて整理してから話し合う", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "我慢できずすぐ感情を出してしまう", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "感情を感じないようにして距離を置く", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "感情が行ったり来たりして自分の反応が予測できない", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "一人の時間について...", options: [
      { text: "楽しみながら一緒の時間とバランスを取る", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "一人だと寂しくて誰かとつながりたい", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "一人が一番楽で充電できる", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "一人は不安だけど人といると疲れる", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "別れた後の私のパターンは...", options: [
      { text: "悲しいけど整理して学びを探す", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "執着したりまた連絡してしまう", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "早く整理して感情を遮断する", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "後悔と安堵が交互に来て整理に時間がかかる", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "欠点やミスを指摘されると...", options: [
      { text: "聞くべきことは聞いて残りは話し合う", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "拒絶された気がして関係が揺らぐ感じ", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "不快ならスルーするか距離を置く", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "攻撃された気がして防御的になるか崩れる", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "新しい関係を始める時...", options: [
      { text: "オープンな気持ちでゆっくり知る過程を楽しむ", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "早く親しくなりたくて相手の反応に敏感", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "警戒心を保って簡単に心を開かない", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "近づきたいけど傷つくのが怖くて躊躇する", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
  ],
  zh: [
    { q: "当恋人很久没联系我时...", options: [
      { text: "没关系，大家都有忙的时候", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "变得焦虑，主动联系对方", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "反而觉得轻松，享受独处时光", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "感觉被忽视，但也不想主动联系", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "发生冲突时，我的第一反应是...", options: [
      { text: "想通过沟通解决，互相理解", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "想赶紧解决，马上说出来", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "想一个人待着，回避对话", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "情绪爆发后又后悔，或者完全封闭自己", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "向别人求助时...", options: [
      { text: "需要时会自在地说，被拒绝也没关系", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "会说但被拒绝会受伤和不安", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "很少求助，自己解决更舒服", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "想说但怕麻烦别人而忍着", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "关于肢体接触和表达爱意...", options: [
      { text: "自然地给予和接受，没有不适感", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "喜欢并经常想要", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "太多会有压力，适当距离更好", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "想要但觉得尴尬，在意对方反应", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "在关系中感到「确定」的时刻是...", options: [
      { text: "能轻松对话，吵架后也能恢复", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "对方经常联系并表达爱意时", w: { secure: 1, anxious: 3, avoidant: 0, fearful: 0 } },
      { text: "互不干涉，尊重各自时间时", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "几乎没有感到确定过，不安和安定交替出现", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "聊到未来计划时...", options: [
      { text: "具体地讨论，感到兴奋和期待", w: { secure: 3, anxious: 1, avoidant: 0, fearful: 0 } },
      { text: "开心但担心到那时关系是否还在", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "比起遥远的未来，只说当下能做的", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "想期待但先怀疑对方是否认真", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "看到对方和其他人亲近时...", options: [
      { text: "自然接受，我也和自己的朋友相处", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "感觉被冷落，好奇对方的心意", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "不太在意，各有各的社交生活", w: { secure: 1, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "装作没事但内心焦虑想很多", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "情绪激动时...", options: [
      { text: "给自己时间整理后再沟通", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "忍不住马上倾泻情绪", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "试着不去感受，保持距离", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "情绪反复无常，自己也无法预测", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "关于独处时间...", options: [
      { text: "享受独处同时平衡共处时间", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "独处时感到孤独想和人连接", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "独处最舒服，是充电时间", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 0 } },
      { text: "独处焦虑但和人在一起又累", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "分手后我的模式是...", options: [
      { text: "难过但会整理并寻找教训", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "执着或重新联系", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "快速整理并切断情感", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "后悔和释然交替，情绪整理很久", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "当被指出缺点或错误时...", options: [
      { text: "该听的听，不对的通过对话解决", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "感觉被拒绝，关系似乎动摇", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "不舒服就忽略或保持距离", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "感觉被攻击，变得防御或崩溃", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
    { q: "开始新关系时...", options: [
      { text: "保持开放心态享受慢慢了解的过程", w: { secure: 3, anxious: 0, avoidant: 1, fearful: 0 } },
      { text: "想快速亲近并对对方反应敏感", w: { secure: 0, anxious: 3, avoidant: 0, fearful: 1 } },
      { text: "保持警惕不轻易敞开心扉", w: { secure: 0, anxious: 0, avoidant: 3, fearful: 1 } },
      { text: "想靠近但怕受伤而犹豫", w: { secure: 0, anxious: 1, avoidant: 1, fearful: 3 } },
    ]},
  ],
};

const results = {
  ko: {
    secure:  { title: '안정형', emoji: '', summary: '관계에서 균형잡힌 리듬을 가진 당신', strengths: ['감정 조절 능력','건강한 경계','솔직한 대화','신뢰 기반'], traps: ['가끔 상대의 불안을 이해하기 어려울 수 있어요','자신의 니즈를 당연하게 여겨 표현을 놓칠 수 있어요','관계가 안정적이라고 방심하면 소홀해질 수 있어요'], practices: ['이번 주 상대에게 구체적인 질문 해보기','나의 감정도 정확히 표현해보기','관계가 좋을 때도 작은 감사 표현하기'], workbook: { title: '상대의 불안을 품어주는 대화법', desc: '안정형이 관계를 더 깊게 만드는 가이드', cta: '안정형 워크북 보러가기' }},
    anxious: { title: '불안형', emoji: '', summary: '마음이 먼저 움직이는 따뜻한 당신', strengths: ['공감 능력','관계 헌신','감정 민감도','적극적 소통'], traps: ['상대의 작은 변화에 과하게 반응할 수 있어요','확인받으려는 행동이 상대를 지치게 할 수 있어요','나를 잃어버리고 상대 중심으로 생각하게 돼요'], practices: ['불안할 때 10분 산책하고 메모하기','하루 한 번 나만의 시간 만들기','확인 요청 대신 내 감정 표현으로 바꿔보기'], workbook: { title: '사랑을 자주 확인받지 않아도 무너지지 않기', desc: '확인받고 싶은 마음을 나를 지키는 신호로 바꾸기', cta: '불안형 워크북 보러가기' }},
    avoidant: { title: '회피형', emoji: '', summary: '독립적인 리듬을 가진 당신', strengths: ['자기 확신','문제 해결력','감정 조절','객관적 시각'], traps: ['가까워지려는 상대를 무의식적으로 밀어낼 수 있어요','감정 표현을 회피하다 관계가 답답해질 수 있어요','혼자 해결하려다 상대가 소외감을 느낄 수 있어요'], practices: ['이번 주 작은 취약함 한 가지 나눠보기','상대가 감정 대화 시도하면 1분만 머물러보기','구체적 시간 약속으로 말하기'], workbook: { title: '사랑하는데 왜 도망치고 싶을까', desc: '거리두기가 습관일 때, 안전하게 가까워지는 연습', cta: '회피형 워크북 보러가기' }},
    fearful: { title: '혼란형', emoji: '', summary: '복잡한 마음을 가진 섬세한 당신', strengths: ['깊은 통찰력','감정 이해도','공감 범위','적응력'], traps: ['가까워지고 싶다가도 갑자기 도망치고 싶어져요','상대의 작은 행동을 과하게 해석할 수 있어요','감정 기복이 커서 관계가 불안정해질 수 있어요'], practices: ['감정 일기 쓰기','팩트와 내 해석 구분해서 적어보기','신뢰하는 사람에게 짧게 말해보기'], workbook: { title: '다가가고 싶지만, 멈추는 나', desc: '다가가고 싶고 피하고 싶은 마음을 정리하는 루틴', cta: '혼란형 워크북 보러가기' }},
    anxious_avoidant: { title: '불안 + 회피 혼합형', emoji: '', summary: '가까워지고 싶지만 거리를 두고 싶은 당신', strengths: ['양쪽 입장 이해','감정 민감도','독립성','자기 성찰'], traps: ['친밀함과 거리 사이에서 혼란스러울 수 있어요','상대에게 모순된 신호를 보낼 수 있어요','관계에서 일관성을 유지하기 어려울 수 있어요'], practices: ['오늘 원하는 거리감을 상대에게 말해보기','가까워지고 싶을 때와 멀어지고 싶을 때 패턴 파악하기','양쪽 니즈 모두 정상임을 인정하기'], workbook: { title: '집착하다가 갑자기 차단하는 나', desc: '붙잡고 싶다가 도망치는 패턴 이해하기', cta: '혼합형 워크북 보러가기' }},
    anxious_fearful: { title: '불안 + 혼란 강화형', emoji: '', summary: '관계에서 확신과 불안이 공존하는 당신', strengths: ['높은 공감력','관계 민감도','감정 깊이','헌신'], traps: ['과도한 걱정으로 관계가 지칠 수 있어요','상대 반응을 과하게 해석할 수 있어요','자기 의심이 관계를 흔들 수 있어요'], practices: ['불안할 때 지금 일어난 사실만 적어보기','하루 10분 나를 위한 시간 갖기','긍정적 순간도 일부러 기록하기'], workbook: { title: '사랑이 깊어질수록 두려워지는 나', desc: '불안과 혼란을 안정으로 바꾸는 2주 루틴', cta: '혼합형 워크북 보러가기' }},
    avoidant_fearful: { title: '회피 + 혼란 강화형', emoji: '', summary: '친밀함을 원하지만 두려워하는 당신', strengths: ['독립성','깊은 사고','자기 인식','통찰력'], traps: ['친밀함을 원하면서도 밀어낼 수 있어요','감정 표현을 극도로 어려워할 수 있어요','관계에서 완전히 고립될 수 있어요'], practices: ['작은 감정부터 나눠보기','안전한 사람 한 명과 주 1회 대화하기','거리두기가 습관인지 두려움인지 구분해보기'], workbook: { title: '가까우면 숨막히고, 멀어지면 무너지는 나', desc: '두려움 없이 가까워지는 단계별 연습', cta: '혼합형 워크북 보러가기' }},
  },
  en: {
    secure:  { title: 'Secure', emoji: '', summary: 'You bring balance and rhythm to your relationships', strengths: ['Emotional regulation','Healthy boundaries','Honest communication','Trust-based'], traps: ['May struggle to understand a partner\'s anxiety','Might take your own needs for granted','Could become complacent when things feel stable'], practices: ['Ask your partner a specific, meaningful question this week','Express your own feelings precisely instead of "I\'m fine"','Show small gratitude even when things are going well'], workbook: { title: 'Holding Space for Your Partner\'s Anxiety', desc: 'A guide for secure types to deepen relationships', cta: 'View Secure Workbook' }},
    anxious: { title: 'Anxious', emoji: '', summary: 'Your heart leads — warm, caring, deeply invested', strengths: ['Empathy','Devotion','Emotional sensitivity','Active communication'], traps: ['May overreact to small changes in your partner','Seeking reassurance can exhaust your partner','You might lose yourself focusing entirely on them'], practices: ['When anxious, take a 10-min walk before reaching out','Create intentional alone time once a day','Replace reassurance-seeking with emotional expression'], workbook: { title: 'Standing Strong Without Constant Reassurance', desc: 'Transform the need for reassurance into self-trust', cta: 'View Anxious Workbook' }},
    avoidant: { title: 'Avoidant', emoji: '', summary: 'Independent and self-assured in your own rhythm', strengths: ['Self-confidence','Problem-solving','Emotional composure','Objectivity'], traps: ['May unconsciously push away those who get close','Avoiding emotional expression can make relationships stale','Handling everything alone can make partners feel excluded'], practices: ['Share one small vulnerability this week','When they start an emotional conversation, stay for just 1 minute','Say "I\'ll talk in 30 minutes" instead of "I need space"'], workbook: { title: 'Why Do I Want to Run When I\'m in Love?', desc: 'Safely reconnect when distance has become a habit', cta: 'View Avoidant Workbook' }},
    fearful: { title: 'Fearful-Avoidant', emoji: '', summary: 'A complex, sensitive soul with deep feelings', strengths: ['Deep insight','Emotional understanding','Wide empathy','Adaptability'], traps: ['You may want closeness then suddenly want to flee','Small actions may be over-interpreted','Mood swings can destabilize relationships'], practices: ['Write an emotion journal daily','Separate facts from your interpretations','Tell one trusted person how you\'re feeling'], workbook: { title: 'I Want to Get Close, But I Stop Myself', desc: 'A routine to sort the push-pull of wanting and fearing closeness', cta: 'View Fearful Workbook' }},
    anxious_avoidant: { title: 'Anxious-Avoidant Mixed', emoji: '', summary: 'You crave closeness yet need your distance too', strengths: ['Understanding both sides','Emotional sensitivity','Independence','Self-reflection'], traps: ['Confusion between intimacy and distance','Sending mixed signals to your partner','Difficulty maintaining consistency'], practices: ['Tell your partner the distance you need today','Track when you want closeness vs. space','Accept that both needs are valid'], workbook: { title: 'Obsessing Then Suddenly Shutting Down', desc: 'Understanding the push-pull pattern', cta: 'View Mixed Workbook' }},
    anxious_fearful: { title: 'Anxious-Fearful Intensified', emoji: '', summary: 'Certainty and anxiety coexist in your relationships', strengths: ['High empathy','Relationship sensitivity','Emotional depth','Dedication'], traps: ['Excessive worry can drain the relationship','Over-interpreting your partner\'s reactions','Self-doubt can shake the relationship'], practices: ['When anxious, write down only the facts','Take 10 minutes daily just for yourself','Deliberately record positive moments too'], workbook: { title: 'The Deeper the Love, the Greater the Fear', desc: 'A 2-week routine to transform anxiety into stability', cta: 'View Mixed Workbook' }},
    avoidant_fearful: { title: 'Avoidant-Fearful Intensified', emoji: '', summary: 'You want intimacy but fear getting too close', strengths: ['Independence','Deep thinking','Self-awareness','Insight'], traps: ['Wanting closeness while pushing it away','Extreme difficulty expressing emotions','Risk of total isolation in relationships'], practices: ['Share a small feeling with someone safe','Have one conversation a week with a trusted person','Distinguish if distance is habit or fear'], workbook: { title: 'Suffocated When Close, Shattered When Apart', desc: 'Step-by-step practice to approach closeness without fear', cta: 'View Mixed Workbook' }},
  },
  ja: {
    secure:  { title: '安定型', emoji: '', summary: '関係にバランスの取れたリズムを持つあなた', strengths: ['感情調整力','健全な境界線','率直な対話','信頼ベース'], traps: ['パートナーの不安を理解しにくいことがある','自分のニーズを当然視して表現を忘れることがある','安定していると油断して疎かになることがある'], practices: ['今週パートナーに具体的な質問をしてみる','自分の気持ちも正確に表現してみる','関係が良い時も小さな感謝を表現する'], workbook: { title: 'パートナーの不安を受け止める対話法', desc: '安定型が関係をさらに深めるガイド', cta: '安定型ワークブックを見る' }},
    anxious: { title: '不安型', emoji: '', summary: '心が先に動く温かいあなた', strengths: ['共感力','関係への献身','感情の敏感さ','積極的コミュニケーション'], traps: ['パートナーの小さな変化に過剰反応しやすい','確認を求める行動がパートナーを疲れさせることがある','自分を見失いパートナー中心に考えがち'], practices: ['不安な時は10分散歩してメモする','1日1回自分だけの時間を作る','確認要求を感情表現に変えてみる'], workbook: { title: '確認しなくても崩れない愛し方', desc: '確認したい気持ちを自分を守るサインに変える', cta: '不安型ワークブックを見る' }},
    avoidant: { title: '回避型', emoji: '', summary: '独立したリズムを持つあなた', strengths: ['自信','問題解決力','感情コントロール','客観的視点'], traps: ['近づこうとする相手を無意識に押しのけることがある','感情表現を避けて関係が行き詰まることがある','一人で解決しようとして相手が疎外感を感じることがある'], practices: ['今週小さな弱みを一つ分かち合う','感情の対話が始まったら1分だけとどまる','具体的な時間約束で伝える'], workbook: { title: '愛しているのになぜ逃げたくなるのか', desc: '距離を置くのが習慣の時、安全に近づく練習', cta: '回避型ワークブックを見る' }},
    fearful: { title: '混乱型', emoji: '', summary: '複雑な心を持つ繊細なあなた', strengths: ['深い洞察力','感情理解力','共感の幅','適応力'], traps: ['近づきたいのに急に逃げたくなることがある','相手の小さな行動を過剰解釈しやすい','感情の起伏で関係が不安定になりやすい'], practices: ['感情日記をつける','事実と自分の解釈を分けて書く','信頼できる人に短く話してみる'], workbook: { title: '近づきたいのに、止まってしまう私', desc: '近づきたいのに逃げたい気持ちを整理するルーティン', cta: '混乱型ワークブックを見る' }},
    anxious_avoidant: { title: '不安＋回避 混合型', emoji: '', summary: '近づきたいけど距離も置きたいあなた', strengths: ['両方の立場理解','感情の敏感さ','独立性','自己省察'], traps: ['親密さと距離の間で混乱しやすい','パートナーに矛盾したサインを送りやすい','一貫性を保つのが難しい'], practices: ['今日望む距離感をパートナーに伝える','近づきたい時と離れたい時のパターンを把握する','両方のニーズが正常であることを認める'], workbook: { title: '執着してから突然遮断する私', desc: '引き寄せて押し戻すパターンを理解する', cta: '混合型ワークブックを見る' }},
    anxious_fearful: { title: '不安＋混乱 強化型', emoji: '', summary: '確信と不安が共存するあなた', strengths: ['高い共感力','関係の敏感さ','感情の深さ','献身'], traps: ['過度な心配で関係が疲弊しやすい','パートナーの反応を過剰解釈しやすい','自己疑念が関係を揺さぶることがある'], practices: ['不安な時は今起きた事実だけ書く','毎日10分自分のための時間を持つ','ポジティブな瞬間も意識的に記録する'], workbook: { title: '愛が深まるほど怖くなる私', desc: '不安と混乱を安定に変える2週間ルーティン', cta: '混合型ワークブックを見る' }},
    avoidant_fearful: { title: '回避＋混乱 強化型', emoji: '', summary: '親密さを求めながらも恐れるあなた', strengths: ['独立性','深い思考','自己認識','洞察力'], traps: ['親密さを求めながら押しのけてしまう','感情表現が極端に難しい','関係で完全に孤立するリスクがある'], practices: ['小さな感情から分かち合ってみる','安全な人と週1回対話する','距離が習慣なのか恐怖なのか区別する'], workbook: { title: '近いと息苦しく、離れると崩れる私', desc: '恐怖なく近づくための段階的練習', cta: '混合型ワークブックを見る' }},
  },
  zh: {
    secure:  { title: '安全型', emoji: '', summary: '在关系中拥有平衡节奏的你', strengths: ['情绪调节能力','健康边界','坦诚对话','信任基础'], traps: ['有时难以理解伴侣的焦虑','可能因为觉得理所当然而忽略表达需求','关系稳定时可能会疏忽'], practices: ['本周给伴侣问一个具体的问题','准确表达自己的感受','即使关系很好也要表达小小的感谢'], workbook: { title: '包容伴侣焦虑的对话法', desc: '安全型深化关系的指南', cta: '查看安全型手册' }},
    anxious: { title: '焦虑型', emoji: '', summary: '心先行动的温暖的你', strengths: ['共情能力','关系投入','情绪敏感度','积极沟通'], traps: ['对伴侣的小变化可能反应过度','寻求确认的行为可能让伴侣疲惫','可能迷失自己以对方为中心思考'], practices: ['焦虑时散步10分钟再联系','每天创造一次属于自己的时间','把求确认变成表达感受'], workbook: { title: '不需要频繁确认也不会崩塌的爱', desc: '把想确认的心变成保护自己的信号', cta: '查看焦虑型手册' }},
    avoidant: { title: '回避型', emoji: '', summary: '拥有独立节奏的你', strengths: ['自信','解决问题能力','情绪控制','客观视角'], traps: ['可能无意识地推开想亲近的人','回避情感表达导致关系沉闷','独自解决一切让伴侣感到被排斥'], practices: ['本周分享一个小小的脆弱','对方开始情感对话时停留1分钟','用具体时间约定来表达'], workbook: { title: '明明爱着为什么想逃跑', desc: '当保持距离成为习惯时安全地靠近', cta: '查看回避型手册' }},
    fearful: { title: '恐惧型', emoji: '', summary: '拥有复杂内心的敏感的你', strengths: ['深刻洞察力','情绪理解力','共情范围','适应力'], traps: ['想靠近又突然想逃跑','容易过度解读对方的小动作','情绪起伏大导致关系不稳定'], practices: ['写情绪日记','区分事实和自己的解读','对信任的人简短地说说感受'], workbook: { title: '想靠近，却停下脚步的我', desc: '整理想靠近又想逃避的心理', cta: '查看恐惧型手册' }},
    anxious_avoidant: { title: '焦虑+回避 混合型', emoji: '', summary: '想靠近又想保持距离的你', strengths: ['理解双方立场','情绪敏感','独立性','自我反思'], traps: ['在亲密和距离之间感到困惑','可能向伴侣发送矛盾信号','难以保持一致性'], practices: ['告诉伴侣今天需要的距离','追踪想靠近和想远离的模式','承认两种需求都是正常的'], workbook: { title: '执着之后突然拉黑的我', desc: '理解推拉模式', cta: '查看混合型手册' }},
    anxious_fearful: { title: '焦虑+恐惧 强化型', emoji: '', summary: '确信和焦虑共存的你', strengths: ['高共情力','关系敏感度','情感深度','奉献'], traps: ['过度担忧可能耗尽关系','过度解读伴侣的反应','自我怀疑可能动摇关系'], practices: ['焦虑时只写下事实','每天留10分钟给自己','刻意记录积极的时刻'], workbook: { title: '爱越深越害怕的我', desc: '将焦虑和混乱转化为稳定的2周计划', cta: '查看混合型手册' }},
    avoidant_fearful: { title: '回避+恐惧 强化型', emoji: '', summary: '渴望亲密却又害怕的你', strengths: ['独立性','深度思考','自我认知','洞察力'], traps: ['渴望亲密的同时推开','极度难以表达情感','有在关系中完全孤立的风险'], practices: ['从分享小感受开始','每周与安全的人对话一次','区分保持距离是习惯还是恐惧'], workbook: { title: '靠近时窒息，远离时崩溃的我', desc: '无恐惧地靠近的分步练习', cta: '查看混合型手册' }},
  },
};

// ─── computeResult v3 ───
function computeResult(answers, qs) {
  const sc = { secure:0, anxious:0, avoidant:0, fearful:0 };
  answers.forEach((ai, qi) => {
    const w = qs[qi].options[ai].w;
    sc.secure += w.secure; sc.anxious += w.anxious;
    sc.avoidant += w.avoidant; sc.fearful += w.fearful;
  });
  const total = sc.secure + sc.anxious + sc.avoidant + sc.fearful;
  if (!Number.isFinite(total) || total === 0) return 'secure';
  const p = { secure:sc.secure/total, anxious:sc.anxious/total, avoidant:sc.avoidant/total, fearful:sc.fearful/total };
  if (p.secure >= 0.30 && sc.secure > sc.anxious && sc.secure > sc.avoidant && sc.secure > sc.fearful) return 'secure';
  const ns = [
    { k:'anxious', s:sc.anxious, p:p.anxious },
    { k:'avoidant', s:sc.avoidant, p:p.avoidant },
    { k:'fearful', s:sc.fearful, p:p.fearful },
  ].sort((a,b)=>b.s-a.s);
  if (p.anxious>=0.28 && p.avoidant>=0.28 && p.fearful<0.32) return 'anxious_avoidant';
  if (p.anxious>=0.28 && p.fearful>=0.32 && p.avoidant<p.fearful) return 'anxious_fearful';
  if (p.avoidant>=0.28 && p.fearful>=0.32 && p.anxious<p.fearful) return 'avoidant_fearful';
  if (ns[0].s === ns[1].s) {
    const pri = { fearful:3, anxious:2, avoidant:1 };
    const tied = ns.filter(x=>x.s===ns[0].s); tied.sort((a,b)=>pri[b.k]-pri[a.k]);
    return tied[0].k;
  }
  return ns[0].k;
}

// ─── Payment URL for 사랑 리셋 ───
const LOVE_RESET_URL = 'https://payhip.com/b/uWMgQ';

// ─── Component ───
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
  const isLove = testType === 'love';
  const isSingle = relationshipStatus === 'single';
  const t = T[lang];
  const lt = loveT[lang];
  const qs = isLove ? (isSingle ? loveQuestionsSingle[lang] : loveQuestions[lang]) : questions[lang];
  const res = isLove ? loveResults[lang] : results[lang];

  const typeColors = {
    secure: { bg: 'from-emerald-50 to-teal-50', accent: '#059669', light: '#d1fae5', card: 'border-emerald-200' },
    anxious: { bg: 'from-orange-50 to-amber-50', accent: '#ea580c', light: '#ffedd5', card: 'border-orange-200' },
    avoidant: { bg: 'from-blue-50 to-sky-50', accent: '#2563eb', light: '#dbeafe', card: 'border-blue-200' },
    fearful: { bg: 'from-purple-50 to-violet-50', accent: '#7c3aed', light: '#ede9fe', card: 'border-purple-200' },
    anxious_avoidant: { bg: 'from-orange-50 to-blue-50', accent: '#c2410c', light: '#fff7ed', card: 'border-orange-200' },
    anxious_fearful: { bg: 'from-orange-50 to-purple-50', accent: '#9333ea', light: '#faf5ff', card: 'border-purple-200' },
    avoidant_fearful: { bg: 'from-blue-50 to-purple-50', accent: '#6d28d9', light: '#ede9fe', card: 'border-violet-200' },
  };

  const transition = (cb) => { setFadeIn(false); setTimeout(() => { cb(); setFadeIn(true); }, 250); };

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

  const [showPayhipEmbed, setShowPayhipEmbed] = useState(false);

  // Payhip Embed Page: load script once and render embed div
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
  const colors = (isLove ? loveColors[resultKey] : typeColors[resultKey]) || typeColors.secure;
  const secLabels = isLove
    ? { your: lt.yourLove, a: lt.feelLabel, b: lt.missLabel, c: isSingle ? lt.askLabelSingle : lt.askLabel }
    : { your: t.yourType, a: t.strengths, b: t.traps, c: t.practices };
  const secData = isLove
    ? { a: info?.feel, b: info?.miss, c: isSingle ? (loveAskSingle[lang][resultKey] || info?.ask) : info?.ask }
    : { a: info?.strengths, b: info?.traps, c: info?.practices };

  // ─── Styles ───
  const fontLink = "https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap";

  return (
    <>
      <link href={fontLink} rel="stylesheet" />
      <style>{`
        * { font-family: 'Noto Sans KR', sans-serif; }
        .font-display { font-family: 'Playfair Display', serif; }
        .fade-enter { opacity: 1; transform: translateY(0); transition: all 0.35s cubic-bezier(.4,0,.2,1); }
        .fade-exit { opacity: 0; transform: translateY(12px); transition: all 0.25s ease; }
        .strike { text-decoration: line-through; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .float { animation: float 3s ease-in-out infinite; }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">

        {/* ─── Brand Bar ─── */}
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur border-b border-rose-100/70">
          <div className="max-w-lg mx-auto px-5 h-12 flex items-center justify-center">
            <button onClick={() => { if (screen !== 'home') restart(); }} className="select-none" aria-label="HEART LAB home">
              <span className="font-display text-base font-bold tracking-[0.2em] text-rose-500">HEART LAB</span>
            </button>
          </div>
        </header>

        {/* Language Selector */}
        <div className="fixed top-2.5 right-4 z-50 flex gap-1 bg-white/80 backdrop-blur rounded-full px-2 py-1 shadow-sm">
          {LANG_OPTIONS.map(l => (
            <button key={l.code} onClick={() => { setLang(l.code); if (screen !== 'home') restart(); }}
              className={`text-xs px-2 py-1 rounded-full transition-all ${lang === l.code ? 'bg-rose-100 text-rose-700 font-medium' : 'text-gray-500 hover:text-gray-700'}`}>
              {l.flag}
            </button>
          ))}
        </div>

        <div className={`max-w-lg mx-auto px-5 py-12 ${fadeIn ? 'fade-enter' : 'fade-exit'}`}>

          {/* ═══ HOME (테스트 선택) ═══ */}
          {screen === 'home' && (
            <div className="text-center pt-16">
              <div className="float text-6xl mb-6">💕</div>
              <h1 className="font-display text-3xl font-bold text-gray-800 mb-2 leading-tight whitespace-pre-line">{lt.homeHeading}</h1>
              <p className="text-rose-400 font-medium mb-10">{lt.homeSub}</p>

              <div className="space-y-4">
                {/* 애착유형 테스트 카드 */}
                <button onClick={() => startTest('attachment')}
                  className="w-full text-left p-6 bg-white/80 backdrop-blur rounded-3xl shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-transparent hover:border-rose-200 active:scale-[0.99]">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl shrink-0">{lt.pickAttachEmoji}</span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-gray-800 leading-tight whitespace-pre-line">{lt.pickAttachTitle}</h2>
                      <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{lt.pickAttachDesc}</p>
                    </div>
                  </div>
                </button>

                {/* 러브랭귀지 테스트 카드 */}
                <button onClick={openLoveIntro}
                  className="w-full text-left p-6 bg-white/80 backdrop-blur rounded-3xl shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 border border-transparent hover:border-rose-200 active:scale-[0.99]">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl shrink-0">{lt.pickLoveEmoji}</span>
                    <div>
                      <h2 className="font-display text-lg font-bold text-gray-800 leading-tight whitespace-pre-line">{lt.pickLoveTitle}</h2>
                      <p className="text-xs text-gray-500 mt-1 whitespace-pre-line">{lt.pickLoveDesc}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ═══ LOVE INTRO (커플/싱글 분기) ═══ */}
          {screen === 'loveIntro' && (
            <div className="pt-16">
              <div className="text-center mb-8">
                <span className="inline-block text-xs font-medium text-rose-500 bg-rose-100/70 rounded-full px-3 py-1 mb-4">{lt.introBadge}</span>
                <h1 className="font-display text-3xl font-bold text-gray-800 mb-2 leading-tight whitespace-pre-line">{lt.introQ}</h1>
                <p className="text-gray-500 text-sm">{lt.introHint}</p>
              </div>
              <div className="space-y-4">
                <button onClick={() => startLove('couple')}
                  className="w-full text-left p-5 bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-transparent hover:border-rose-200 active:scale-[0.99]">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl shrink-0">💞</span>
                    <div>
                      <p className="font-semibold text-gray-800">{lt.introCouple}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{lt.introCoupleSub}</p>
                    </div>
                  </div>
                </button>
                <button onClick={() => startLove('single')}
                  className="w-full text-left p-5 bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 border border-transparent hover:border-rose-200 active:scale-[0.99]">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl shrink-0">🌷</span>
                    <div>
                      <p className="font-semibold text-gray-800">{lt.introSingle}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{lt.introSingleSub}</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ═══ QUIZ ═══ */}
          {screen === 'quiz' && qs[currentQ] && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <button onClick={handleBack} className={`text-gray-400 hover:text-gray-600 transition ${currentQ === 0 ? 'invisible' : ''}`}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                </button>
                <span className="text-sm text-gray-400 font-medium">{currentQ + 1} {t.of} {qs.length}</span>
                <div className="w-6" />
              </div>

              {/* Progress */}
              <div className="w-full h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-rose-300 to-pink-400 rounded-full transition-all duration-500" style={{ width: `${((currentQ + 1) / qs.length) * 100}%` }} />
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-8 leading-relaxed">{isLove ? lt.pairPrompt : qs[currentQ].q}</h2>

              <div className="space-y-3">
                {qs[currentQ].options.map((opt, idx) => (
                  <button key={idx} onClick={() => handleAnswer(idx)}
                    className="w-full text-left p-5 bg-white/80 backdrop-blur rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.01] border border-transparent hover:border-rose-200 active:scale-[0.99]">
                    <p className="text-gray-700 leading-relaxed text-sm">{opt.text}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ═══ RESULT ═══ */}
          {screen === 'result' && info && (
            <div>
              {/* Type Badge */}
              <div className="text-center mb-8 pt-8">
                <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">{secLabels.your}</p>
                <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">{info.title}</h1>
                <p className="text-gray-500 text-sm">{info.summary}</p>
                {isLove && secondaryKey && res[secondaryKey] && (
                  <p className="text-xs mt-3">
                    <span className="text-gray-400">{lt.secondaryLabel} · </span>
                    <span className="font-medium" style={{ color: (loveColors[secondaryKey] || {}).accent }}>{res[secondaryKey].title}</span>
                  </p>
                )}
              </div>

              {/* Strengths */}
              <div className={`bg-gradient-to-br ${colors.bg} rounded-2xl p-6 mb-4`}>
                <h3 className="text-sm font-bold text-gray-700 mb-3">{secLabels.a}</h3>
                <div className="flex flex-wrap gap-2">
                  {secData.a.map((s, i) => (
                    <span key={i} className="bg-white/70 text-gray-600 text-xs px-3 py-1.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {/* Traps */}
              <div className="bg-white/60 backdrop-blur rounded-2xl p-6 mb-4 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-3">{secLabels.b}</h3>
                <div className="space-y-2">
                  {secData.b.map((tr, i) => (
                    <p key={i} className="text-xs text-gray-600 leading-relaxed pl-4 border-l-2" style={{ borderColor: colors.accent + '40' }}>{tr}</p>
                  ))}
                </div>
              </div>

              {/* Practices */}
              <div className="bg-white/60 backdrop-blur rounded-2xl p-6 mb-8 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-3">{secLabels.c}</h3>
                <div className="space-y-2">
                  {secData.c.map((pr, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0 mt-0.5" style={{ background: colors.light, color: colors.accent }}>{i + 1}</span>
                      <p className="text-xs text-gray-600 leading-relaxed">{pr}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ─── 사랑 리셋 (Love Reset) Card ─── */}
              <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 mb-4 border border-rose-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-rose-400 font-medium">{t.coupleWorkbook}</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{t.loveReset}</h4>
                <p className="text-xs text-gray-500 mb-3">{t.loveResetSub}</p>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm text-gray-400 line-through">{t.loveResetOriginal}</span>
                  <span className="text-xl font-bold text-gray-800">{t.loveResetSale}</span>
                  <span className="px-2 py-0.5 bg-rose-400 text-white text-xs font-semibold rounded-full">{t.loveResetOff}</span>
                </div>
                <button onClick={() => {
                    if (showPayhipEmbed) {
                      setShowPayhipEmbed(false);
                    } else {
                      setShowPayhipEmbed(true);
                      // Fallback: if embed doesn't load within 2s, open in new tab
                      setTimeout(() => {
                        const embedEl = document.querySelector('.payhip-embed-page iframe');
                        if (!embedEl) {
                          window.open(`https://payhip.com/b/${payhipEmbedKey}`, '_blank');
                        }
                      }, 2000);
                    }
                  }}
                  className="w-full bg-gradient-to-r from-rose-400 to-pink-400 text-white py-3 rounded-xl font-medium text-sm shadow-md shadow-rose-200/40 hover:shadow-lg hover:-translate-y-0.5 transition-all active:scale-[0.98]">
                  {t.loveResetCta}
                </button>
                {showPayhipEmbed && (
                  <div className="mt-4 rounded-xl overflow-hidden">
                    <div
                      key={`${payhipEmbedKey}-${lang}-${resultKey}`}
                      className="payhip-embed-page"
                      data-key={payhipEmbedKey}
                    />
                  </div>
                )}
              </div>

              {/* ─── Type Workbook Card (Coming Soon) ─── */}
              <div className={`bg-white/60 backdrop-blur rounded-2xl p-6 mb-8 border ${colors.card}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-gray-400 font-medium">{info.title}</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">{info.workbook.title}</h4>
                <p className="text-xs text-gray-500 mb-4">{info.workbook.desc}</p>
                <button onClick={() => setShowComingSoon(true)}
                  className="w-full py-3 rounded-xl font-medium text-sm border-2 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                  style={{ borderColor: colors.accent, color: colors.accent }}>
                  {isLove ? lt.typeCta : info.workbook.cta}
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mb-12">
                <button onClick={restart} className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-white/60 border border-gray-200 hover:border-gray-300 transition-all">
                  {t.retry}
                </button>
                <button onClick={share} className="flex-1 py-3 rounded-xl text-sm font-medium text-rose-500 bg-rose-50 border border-rose-200 hover:border-rose-300 transition-all">
                  {t.share}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── Copied Toast ─── */}
        {showCopied && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-6 py-3 rounded-full shadow-lg z-50">
            {t.copied}
          </div>
        )}

        {/* ─── Coming Soon Modal ─── */}
        {showComingSoon && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-6" onClick={() => setShowComingSoon(false)}>
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="text-5xl mb-4">🔜</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{t.comingSoon}</h3>
              <p className="text-gray-500 text-sm mb-6 whitespace-pre-line">{t.comingSoonDesc}</p>
              <button onClick={() => setShowComingSoon(false)}
                className="px-8 py-3 rounded-full bg-gray-100 text-gray-600 font-medium text-sm hover:bg-gray-200 transition-all">
                {t.close}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
