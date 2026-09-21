// Option Dictionary & Grammar Helper for JLPT Practice
// Provides instant lookup for correct & incorrect options, meanings, readings, and vocabulary bookmarking.

window.OptionDictionaryHelper = (function() {

  // Common JLPT Grammar patterns dictionary (N5-N1)
  const GRAMMAR_DICT = {
    // N5
    "〜てください": { reading: "てください", en: "Please do ~", zh: "請〜", ko: "~해 주세요", lvl: "N5" },
    "〜てもいい": { reading: "てもいい", en: "May do ~ (permission)", zh: "可以〜（許可）", ko: "~해도 좋다 (허가)", lvl: "N5" },
    "〜てはいけない": { reading: "てはいけない", en: "Must not do ~ (prohibition)", zh: "不可以〜（禁止）", ko: "~해서는 안 된다 (금지)", lvl: "N5" },
    "〜から": { reading: "から", en: "Because / Since ~", zh: "因為〜", ko: "~때문에 / ~부터", lvl: "N5" },
    "〜ましょう": { reading: "ましょう", en: "Let's ~", zh: "我們一起〜吧", ko: "~합시다", lvl: "N5" },
    "〜たい": { reading: "たい", en: "Want to do ~", zh: "想要〜", ko: "~하고 싶다", lvl: "N5" },

    // N4
    "〜なければならない": { reading: "なければならない", en: "Must do ~ (obligation)", zh: "必須〜", ko: "~해야 한다", lvl: "N4" },
    "〜なくてもいい": { reading: "なくてもいい", en: "Don't have to do ~", zh: "不用〜也可以", ko: "~하지 않아도 된다", lvl: "N4" },
    "〜たことがある": { reading: "たことがある", en: "Have experience of ~", zh: "曾經〜過", ko: "~한 적이 있다", lvl: "N4" },
    "〜ほうがいい": { reading: "ほうがいい", en: "Had better do ~ (advice)", zh: "最好〜（建議）", ko: "~하는 편이 좋다", lvl: "N4" },
    "〜すぎる": { reading: "すぎる", en: "Too much / Excessively ~", zh: "過於〜 / 太〜", ko: "너무 ~하다", lvl: "N4" },
    "〜やすい": { reading: "やすい", en: "Easy to do ~", zh: "容易〜", ko: "~하기 쉽다", lvl: "N4" },
    "〜にくい": { reading: "にくい", en: "Hard / Difficult to do ~", zh: "難以〜", ko: "~하기 어렵다", lvl: "N4" },

    // N3
    "〜はずだ": { reading: "はずだ", en: "Should be / Ought to be ~", zh: "應該〜", ko: "~할 터이다 / ~일 것이다", lvl: "N3" },
    "〜わけだ": { reading: "わけだ", en: "That is why / No wonder ~", zh: "怪不得 / 難怪〜", ko: "~한 셈이다 / 당연히 ~하다", lvl: "N3" },
    "〜わけにはいかない": { reading: "わけにはいかない", en: "Cannot afford to / Must not ~", zh: "不能〜 / 無法〜", ko: "~할 수는 없다", lvl: "N3" },
    "〜に対して": { reading: "にたいして", en: "Towards / In contrast to ~", zh: "對抗 / 相比於〜", ko: "~에 대해서 / ~에 반해", lvl: "N3" },
    "〜に関して": { reading: "にかんして", en: "Regarding / Concerning ~", zh: "關於〜", ko: "~에 관해서", lvl: "N3" },
    "〜において": { reading: "において", en: "In / At (formal) ~", zh: "在〜（場所・領域）", ko: "~에 있어서", lvl: "N3" },
    "〜によって": { reading: "によって", en: "By means of / Due to ~", zh: "由於 / 根據〜", ko: "~에 의해서 / ~에 따라", lvl: "N3" },
    "〜たとたん": { reading: "たとたん", en: "As soon as ~", zh: "剛〜的一瞬間", ko: "~하자마자", lvl: "N3" },

    // N2
    "〜に違いない": { reading: "にちがいない", en: "Must be / No doubt that ~", zh: "必定是〜 / 毫無疑問〜", ko: "~임에 틀림없다", lvl: "N2" },
    "〜ざるを得ない": { reading: "ざるをえない", en: "Cannot help but ~ / Have to ~", zh: "不得不〜", ko: "~하지 않을 수 없다", lvl: "N2" },
    "〜かねる": { reading: "かねる", en: "Cannot do / Hesitate to ~", zh: "難以〜 / 恕難〜", ko: "~하기 어렵다 / 곤란하다", lvl: "N2" },
    "〜にすぎない": { reading: "にすぎない", en: "Merely / Nothing more than ~", zh: "只不過是〜", ko: "~에 지나지 않는다", lvl: "N2" },
    "〜をめぐって": { reading: "をめぐって", en: "Surrounding / In dispute over ~", zh: "圍繞著〜", ko: "~를 둘러싸고", lvl: "N2" },
    "〜に際して": { reading: "にさいして", en: "On the occasion of ~", zh: "在〜之際", ko: "~할 때에 즈음하여", lvl: "N2" },

    // N1
    "〜を皮切りに": { reading: "をかわきりに", en: "Starting with ~ as the first", zh: "以〜為開端", ko: "~를 시작으로", lvl: "N1" },
    "〜であれ": { reading: "であれ", en: "Whether it is ~ or ~", zh: "無論是〜", ko: "~이든 간에", lvl: "N1" },
    "〜極まりない": { reading: "きわまりない", en: "Extremely / Boundlessly ~", zh: "極其〜 / 無比〜", ko: "극히 ~하다", lvl: "N1" },
    "〜を禁じ得ない": { reading: "をきんじえない", en: "Cannot suppress / Cannot help feeling ~", zh: "不禁〜 / 禁不住〜", ko: "~를 금할 수 없다", lvl: "N1" }
  };

  // Deinflect Japanese forms to find dictionary entries
  function deinflect(word) {
    if (!word) return [];
    const clean = word.trim().replace(/^[\s・〜~]+|[\s・〜~]+$/g, '');
    const forms = [clean];

    // ます形 (ます, ました, ません, ませんでした)
    if (clean.endsWith('ます') || clean.endsWith('ません')) {
      const stem = clean.slice(0, -2);
      forms.push(stem + 'る'); // 一段
      const godanMap = {'き':'く', 'ぎ':'ぐ', 'し':'す', 'ち':'つ', 'に':'ぬ', 'び':'ぶ', 'み':'む', 'り':'る', 'い':'う'};
      if (stem.length > 0 && godanMap[stem.slice(-1)]) {
        forms.push(stem.slice(0, -1) + godanMap[stem.slice(-1)]);
      }
    } else if (clean.endsWith('ました')) {
      const stem = clean.slice(0, -3);
      forms.push(stem + 'る');
      const godanMap = {'き':'く', 'ぎ':'ぐ', 'し':'す', 'ち':'つ', 'に':'ぬ', 'び':'ぶ', 'み':'む', 'り':'る', 'い':'う'};
      if (stem.length > 0 && godanMap[stem.slice(-1)]) {
        forms.push(stem.slice(0, -1) + godanMap[stem.slice(-1)]);
      }
    }

    // て形 / た形
    if (clean.endsWith('て') || clean.endsWith('た')) {
      const stem = clean.slice(0, -1);
      forms.push(stem + 'る');
      if (stem.endsWith('っ')) {
        const root = stem.slice(0, -1);
        forms.push(root + 'う', root + 'つ', root + 'る');
      } else if (stem.endsWith('ん')) {
        const root = stem.slice(0, -1);
        forms.push(root + 'む', root + 'ぶ', root + 'ぬ');
      } else if (stem.endsWith('い')) {
        forms.push(stem.slice(0, -1) + 'く');
      }
    }

    // ない形
    if (clean.endsWith('ない')) {
      const stem = clean.slice(0, -2);
      forms.push(stem + 'る');
      const godanMap = {'か':'く', 'が':'ぐ', 'さ':'す', 'た':'つ', 'な':'ぬ', 'ば':'ぶ', 'ま':'む', 'ら':'る', 'わ':'う'};
      if (stem.length > 0 && godanMap[stem.slice(-1)]) {
        forms.push(stem.slice(0, -1) + godanMap[stem.slice(-1)]);
      }
    }

    // い形容詞の過去形 / 副詞形
    if (clean.endsWith('かった')) {
      forms.push(clean.slice(0, -3) + 'い');
    }
    if (clean.endsWith('く') && clean.length > 1) {
      forms.push(clean.slice(0, -1) + 'い');
    }

    return Array.from(new Set(forms));
  }

  // Find vocabulary in JLPT_VOCAB
  let vocabIndex = null;

  function buildVocabIndex() {
    if (vocabIndex) return;
    vocabIndex = new Map();

    if (typeof JLPT_VOCAB === 'undefined') return;

    for (let lvl in JLPT_VOCAB) {
      const list = JLPT_VOCAB[lvl];
      for (let item of list) {
        if (!item || !item.word) continue;
        const w = item.word.trim();
        const r = (item.reading || item.k || '').trim();

        if (!vocabIndex.has(w)) vocabIndex.set(w, item);
        if (r && !vocabIndex.has(r)) vocabIndex.set(r, item);

        // Strip punctuation
        const cleanW = w.replace(/[;；/／].*$/, '').trim();
        if (cleanW && !vocabIndex.has(cleanW)) vocabIndex.set(cleanW, item);
      }
    }
  }

  // Lookup single option
  function lookup(optText) {
    if (!optText) return null;
    buildVocabIndex();

    const clean = optText.trim().replace(/^[\s・〜~]+|[\s・〜~]+$/g, '');

    // 1. Check Grammar dictionary
    for (let pat in GRAMMAR_DICT) {
      const patClean = pat.replace(/^〜/, '');
      if (clean === patClean || clean.includes(patClean)) {
        const g = GRAMMAR_DICT[pat];
        return {
          type: 'grammar',
          word: pat,
          reading: g.reading,
          level: g.lvl,
          meanings: [g.en],
          meaningsZh: g.zh,
          meaningsKo: g.ko,
          isGrammar: true
        };
      }
    }

    // 2. Check Vocabulary Index with deinflection
    const candidates = deinflect(clean);
    for (let c of candidates) {
      if (vocabIndex && vocabIndex.has(c)) {
        const item = vocabIndex.get(c);
        return {
          type: 'vocab',
          word: item.word,
          originalOpt: optText,
          reading: item.reading || item.k || clean,
          level: item.level || 'JLPT',
          meanings: item.meanings || [],
          examples: item.examples || [],
          isGrammar: false
        };
      }
    }

    // 3. Fallback for Kanji Reading options (e.g. てんき, でんき)
    // If not found in index, return clean form
    return {
      type: 'option',
      word: clean,
      originalOpt: optText,
      reading: clean,
      level: 'JLPT',
      meanings: ['選択肢 / Option'],
      isGrammar: false
    };
  }

  // Save option word to user's main vocabulary list
  function saveToVocabList(item) {
    if (typeof UserProgress === 'undefined') {
      alert('進捗管理モジュールが読み込まれていません。');
      return false;
    }
    const word = item.word || item.originalOpt;
    const reading = item.reading || '';
    const meanings = item.meanings || [item.meaningsEn || ''];
    const level = item.level || 'JLPT';

    const isSaved = UserProgress.isVocabSaved(word);
    UserProgress.toggleSaveVocab({ word, reading, meanings, level });

    return !isSaved; // returns true if newly saved, false if removed
  }

  function isSaved(word) {
    if (typeof UserProgress === 'undefined') return false;
    return UserProgress.isVocabSaved(word);
  }

  return {
    lookup,
    saveToVocabList,
    isSaved
  };
})();
