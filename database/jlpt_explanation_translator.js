// JLPT Authentic Multilingual Explanation Engine
// Supports: 日本語 (JA), English (EN), 繁體中文 (ZH), 한국어 (KO)

window.JLPTExplanationTranslator = (function() {
  const STORAGE_KEY = 'jlpt_explanation_lang';

  // Available languages
  const LANGUAGES = [
    { code: 'ja', label: '🇯🇵 日本語', name: '日本語' },
    { code: 'en', label: '🇺🇸 English', name: 'English' },
    { code: 'zh', label: '🇹🇼 繁體中文', name: '繁體中文' },
    { code: 'ko', label: '🇰🇷 한국어', name: '한국어' }
  ];

  function getCurrentLang() {
    return localStorage.getItem(STORAGE_KEY) || 'ja';
  }

  function setLang(langCode) {
    if (LANGUAGES.some(l => l.code === langCode)) {
      localStorage.setItem(STORAGE_KEY, langCode);
    }
  }

  // Header feedback strings
  function getHeaderFeedback(isCorrect, correctIndex, lang) {
    const num = correctIndex + 1;
    switch (lang) {
      case 'en':
        return isCorrect
          ? `Correct! The answer is [${num}]`
          : `Incorrect... The correct answer is [${num}]`;
      case 'zh':
        return isCorrect
          ? `回答正確！ 正確答案為【${num}】`
          : `回答錯誤… 正確答案為【${num}】`;
      case 'ko':
        return isCorrect
          ? `정답입니다! 정답은 【${num}】입니다`
          : `오답입니다… 올바른 정답은 【${num}】입니다`;
      case 'ja':
      default:
        return isCorrect
          ? `正解！ 正解は【${num}】です`
          : `不正解… 正解は【${num}】です`;
    }
  }

  // Generate localized explanation text
  function getLocalizedExplanation(q, lang) {
    const rawExp = q.explanation || '';
    const ans = (q.options && q.options[q.correct]) ? q.options[q.correct] : '';
    const cat = q.category || '';
    const transEn = q.translationEn || '';

    if (lang === 'ja') {
      return {
        explanation: rawExp,
        orderExplanation: q.orderExplanation || '',
        translation: transEn ? `<strong>EN:</strong> ${transEn}` : ''
      };
    }

    // 1. Kanji Reading (漢字の読み)
    const mReading = rawExp.match(/「([^」]+)」は「([^」]+)」と読みます/);
    if (mReading || cat === 'kanji_reading') {
      const word = mReading ? mReading[1] : (q.question ? (q.question.match(/<u>([^<]+)<\/u>/) || ['', ''])[1] : '');
      const reading = mReading ? mReading[2] : ans;

      if (lang === 'en') {
        return {
          explanation: `The kanji "${word || ans}" is read as "${reading}".`,
          orderExplanation: '',
          translation: transEn ? `<strong>Translation:</strong> ${transEn}` : ''
        };
      } else if (lang === 'zh') {
        return {
          explanation: `漢字「${word || ans}」的正確讀音為「${reading}」。`,
          orderExplanation: '',
          translation: transEn ? `<strong>英文參考翻譯:</strong> ${transEn}` : ''
        };
      } else if (lang === 'ko') {
        return {
          explanation: `한자 「${word || ans}」의 올바른 읽는 법은 「${reading}」입니다.`,
          orderExplanation: '',
          translation: transEn ? `<strong>영어 참고 번역:</strong> ${transEn}` : ''
        };
      }
    }

    // 2. Kanji Writing / Orthography (漢字表記)
    const mWriting = rawExp.match(/「([^」]+)」の漢字は「([^」]+)」です/);
    if (mWriting || cat === 'kanji_writing') {
      const reading = mWriting ? mWriting[1] : (q.question ? (q.question.match(/<u>([^<]+)<\/u>/) || ['', ''])[1] : '');
      const kanji = mWriting ? mWriting[2] : ans;

      if (lang === 'en') {
        return {
          explanation: `The correct kanji expression for "${reading || ans}" is "${kanji}".`,
          orderExplanation: '',
          translation: transEn ? `<strong>Translation:</strong> ${transEn}` : ''
        };
      } else if (lang === 'zh') {
        return {
          explanation: `「${reading || ans}」對應的正確漢字寫法為「${kanji}」。`,
          orderExplanation: '',
          translation: transEn ? `<strong>英文參考翻譯:</strong> ${transEn}` : ''
        };
      } else if (lang === 'ko') {
        return {
          explanation: `「${reading || ans}」에 해당하는 올바른 한자 표기는 「${kanji}」입니다.`,
          orderExplanation: '',
          translation: transEn ? `<strong>영어 참고 번역:</strong> ${transEn}` : ''
        };
      }
    }

    // 3. Sentence Order / Scramble (文の組み立て・並べ替え)
    const mOrder = (q.orderExplanation || rawExp).match(/★の位置には【([^】]+)】が入ります。.*文全体:\s*([^）\)]+)/);
    if (mOrder || cat === 'sentence_order' || cat === 'sentence_construction') {
      const orderAns = mOrder ? mOrder[1] : ans;
      const fullSent = mOrder ? mOrder[2] : '';

      if (lang === 'en') {
        return {
          explanation: `The star (★) position takes option [${q.correct + 1}] "${orderAns}".${fullSent ? ` Complete sentence: "${fullSent}"` : ''}`,
          orderExplanation: fullSent ? `Ordered Sentence: ${fullSent}` : '',
          translation: transEn ? `<strong>Translation:</strong> ${transEn}` : ''
        };
      } else if (lang === 'zh') {
        return {
          explanation: `★ 星號位置應填入選項【${q.correct + 1}】「${orderAns}」。${fullSent ? ` 完整句子：「${fullSent}」` : ''}`,
          orderExplanation: fullSent ? `排序後完整句：「${fullSent}」` : '',
          translation: transEn ? `<strong>英文參考翻譯:</strong> ${transEn}` : ''
        };
      } else if (lang === 'ko') {
        return {
          explanation: `★ 위치에는 선택지 【${q.correct + 1}】 「${orderAns}」가 들어갑니다.${fullSent ? ` 완성 문장: "${fullSent}"` : ''}`,
          orderExplanation: fullSent ? `배열 완성 문장: "${fullSent}"` : '',
          translation: transEn ? `<strong>영어 참고 번역:</strong> ${transEn}` : ''
        };
      }
    }

    // 4. Grammar / Grammar Form (文法形式・文型)
    const mGrammar = rawExp.match(/（文型：([^、]+)、意味:\s*([^）]+)）/);
    if (mGrammar || cat === 'grammar_form' || cat === 'grammar') {
      const pattern = mGrammar ? mGrammar[1] : '';
      const meaning = mGrammar ? mGrammar[2] : '';

      if (lang === 'en') {
        let text = `Correct answer: [${q.correct + 1}] "${ans}".`;
        if (pattern) text += ` Grammar pattern: ${pattern} (Meaning: ${meaning}).`;
        text += ` It is the most natural fit based on grammatical connections and sentence context.`;
        return {
          explanation: text,
          orderExplanation: '',
          translation: transEn ? `<strong>Translation:</strong> ${transEn}` : ''
        };
      } else if (lang === 'zh') {
        let text = `正確答案為選項【${q.correct + 1}】「${ans}」。`;
        if (pattern) text += ` 句型：${pattern}（含義：${meaning}）。`;
        text += ` 符合接續規則與上下文語意。`;
        return {
          explanation: text,
          orderExplanation: '',
          translation: transEn ? `<strong>英文參考翻譯:</strong> ${transEn}` : ''
        };
      } else if (lang === 'ko') {
        let text = `정답은 선택지 【${q.correct + 1}】 「${ans}」입니다.`;
        if (pattern) text += ` 문형: ${pattern} (의미: ${meaning}).`;
        text += ` 문법적 접속 규칙과 문맥상 가장 자연스럽습니다.`;
        return {
          explanation: text,
          orderExplanation: '',
          translation: transEn ? `<strong>영어 참고 번역:</strong> ${transEn}` : ''
        };
      }
    }

    // 5. Reading Comprehension (読解問題)
    if (cat.includes('reading') || cat.includes('comprehension')) {
      if (lang === 'en') {
        return {
          explanation: `According to the passage context and logic, option [${q.correct + 1}] "${ans}" is the correct answer. ${rawExp.replace(/^正解は【\d+】です。/, '')}`,
          orderExplanation: '',
          translation: transEn ? `<strong>Passage / Question Translation:</strong> ${transEn}` : ''
        };
      } else if (lang === 'zh') {
        return {
          explanation: `根據文章前後邏輯與主旨，選項【${q.correct + 1}】「${ans}」為正確答案。${rawExp.replace(/^正解は【\d+】です。/, '')}`,
          orderExplanation: '',
          translation: transEn ? `<strong>英文參考翻譯:</strong> ${transEn}` : ''
        };
      } else if (lang === 'ko') {
        return {
          explanation: `본문의 문맥과 논리적 흐름에 비추어 볼 때, 선택지 【${q.correct + 1}】 「${ans}」가 정답입니다. ${rawExp.replace(/^正解は【\d+】です。/, '')}`,
          orderExplanation: '',
          translation: transEn ? `<strong>영어 참고 번역:</strong> ${transEn}` : ''
        };
      }
    }

    // 6. Vocabulary / Context Usage / Synonyms (語彙・類義語・用法・一般)
    if (lang === 'en') {
      return {
        explanation: `Option [${q.correct + 1}] "${ans}" is the correct answer. It best fits this sentence's semantic context and nuance. (${rawExp})`,
        orderExplanation: '',
        translation: transEn ? `<strong>Sentence Translation:</strong> ${transEn}` : ''
      };
    } else if (lang === 'zh') {
      return {
        explanation: `選項【${q.correct + 1}】「${ans}」為正確答案。最符合本題語境與語意搭配。（原文解析: ${rawExp}）`,
        orderExplanation: '',
        translation: transEn ? `<strong>英文參考翻譯:</strong> ${transEn}` : ''
      };
    } else if (lang === 'ko') {
      return {
        explanation: `선택지 【${q.correct + 1}】 「${ans}」가 정답입니다. 이 문장의 문맥과 의미에 가장 적절합니다. (원문 해설: ${rawExp})`,
        orderExplanation: '',
        translation: transEn ? `<strong>영어 참고 번역:</strong> ${transEn}` : ''
      };
    }

    return {
      explanation: rawExp,
      orderExplanation: q.orderExplanation || '',
      translation: transEn ? `<strong>EN:</strong> ${transEn}` : ''
    };
  }

  return {
    LANGUAGES,
    getCurrentLang,
    setLang,
    getHeaderFeedback,
    getLocalizedExplanation
  };
})();
