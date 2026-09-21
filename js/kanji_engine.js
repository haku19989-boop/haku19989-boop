/**
 * Kanji Engine:
 * 1. Mainichi-Kanji Writing Quiz (Matches user screenshot media_1789917012981.png)
 * 2. JLPT Kanji Level List (N5, N4, N3) with Stroke Order Modal (Matches Image 2)
 */

(function() {
  const KANJI_CACHE = {};
  const NS = "http://www.w3.org/2000/svg";
  const GRID = 109;

  function svgEl(name, attrs) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    return n;
  }

  async function fetchKanjiStrokes(char) {
    if (KANJI_CACHE[char]) return KANJI_CACHE[char];
    try {
      const hex = char.charCodeAt(0).toString(16).padStart(5, '0');
      const url = `https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/${hex}.svg`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("KanjiVG fetch failed: " + res.status);
      const svgText = await res.text();

      const pathMatches = [...svgText.matchAll(/<path[^>]*\bd="([^"]+)"/g)];
      const paths = pathMatches.map(m => m[1]);

      const numMatches = [...svgText.matchAll(/<text[^>]*transform="matrix\([^\)]+\s+([\d\.]+)\s+([\d\.]+)\)"[^>]*>(\d+)<\/text>/g)];
      const nums = numMatches.map(m => [parseFloat(m[1]), parseFloat(m[2])]);

      const data = { char, size: GRID, strokesCount: paths.length, paths, nums };
      KANJI_CACHE[char] = data;
      return data;
    } catch (e) {
      console.warn("KanjiVG fetch error for " + char, e);
      return null;
    }
  }

  function makeTianGridGuidelines(size) {
    const g = svgEl("g", { "stroke": "#BAE6FD", "stroke-width": "1", "stroke-dasharray": "4 4" });
    g.appendChild(svgEl("line", { x1: size / 2, y1: 2, x2: size / 2, y2: size - 2 }));
    g.appendChild(svgEl("line", { x1: 2, y1: size / 2, x2: size - 2, y2: size / 2 }));
    return g;
  }

  function getInkWidth(totalStrokes) {
    const w = 5.8 - totalStrokes * 0.14;
    return Math.max(2.6, Math.min(5.4, w));
  }

  // ============================================================
  // 漢字のレベル別 厳選例文データベース (JLPT N5〜N1対応)
  // ============================================================
  const PRESET_KANJI_EXAMPLES = {
    "一": [
      { word: "一日（いちにち）", ja: "今日（きょう）は とても 楽（たの）しい 一日（いちにち）でした。", en: "Today was a very fun day." },
      { word: "一人（ひとり）", ja: "一人（ひとり）で 日本（にほん）へ 旅行（りょこう）に 行（い）きます。", en: "I will travel to Japan alone." },
      { word: "一番（いちばん）", ja: "日本語（にほんご）が 一番（いちばん） 好（す）きな 言語（げんご）です。", en: "Japanese is my favorite language." }
    ],
    "二": [
      { word: "二人（ふたり）", ja: "二人（ふたり）で 映画（えいが）を 見（み）に 行（い）きました。", en: "The two of us went to see a movie." },
      { word: "二月（にがつ）", ja: "二月（にがつ）は 雪（ゆき）が たくさん 降（ふ）ります。", en: "It snows a lot in February." },
      { word: "二つ（ふたつ）", ja: "りんごを 二つ（ふたつ） ください。", en: "Two apples, please." }
    ],
    "三": [
      { word: "三人（さんにん）", ja: "私（わたし）の 家族（かぞく）は 三人（さんにん）です。", en: "There are three people in my family." },
      { word: "三月（さんがつ）", ja: "三月（さんがつ）に 桜（さくら）の 花（はな）が 咲（さ）きます。", en: "Cherry blossoms bloom in March." },
      { word: "三つ（みっつ）", ja: "ケーキを 三つ（みっつ） 買（か）いました。", en: "I bought three cakes." }
    ],
    "四": [
      { word: "四時（よじ）", ja: "午後（ごご） 四時（よじ）に 友達（ともだち）と 会（あ）います。", en: "I will meet my friend at 4 PM." },
      { word: "四月（しがつ）", ja: "四月（しがつ）から 新（あたら）しい 学校（がっこう）が 始（はじ）まります。", en: "A new school term starts in April." },
      { word: "四季（しき）", ja: "日本（にほん）には 美（うつく）しい 四季（しき）が あります。", en: "Japan has four beautiful seasons." }
    ],
    "五": [
      { word: "五時（ごじ）", ja: "夕方（ゆうがた） 五時（ごじ）に 仕事（しごと）が 終（お）わります。", en: "Work finishes at 5 PM." },
      { word: "五月（ごがつ）", ja: "五月（ごがつ）の 風（かぜ）は とても 爽（さわ）やかです。", en: "The May breeze is very refreshing." },
      { word: "五つ（いつつ）", ja: "みかんが 五つ（いつつ） あります。", en: "There are five tangerines." }
    ],
    "六": [
      { word: "六時（ろくじ）", ja: "毎朝（まいあさ） 六時（ろくじ）に 起（お）きます。", en: "I get up at six every morning." },
      { word: "六月（ろくがつ）", ja: "六月（ろくがつ）は 雨（あめ）の 日（ひ）が 多（おお）いです。", en: "There are many rainy days in June." }
    ],
    "七": [
      { word: "七時（しちじ）", ja: "夜（よる） 七時（しちじ）に 晩（ばん）ごはんを 食（た）べます。", en: "I eat dinner at 7 PM." },
      { word: "七月（しちがつ）", ja: "七月（しちがつ）に 夏祭（なつまつ）りが あります。", en: "There is a summer festival in July." }
    ],
    "八": [
      { word: "八時（はちじ）", ja: "電車（でんしゃ）は 八時（はちじ）に 駅（えき）に 着（つ）きます。", en: "The train arrives at the station at 8." },
      { word: "八月（はちがつ）", ja: "八月（はちがつ）は 夏休（なつやす）みで 楽（たの）しいです。", en: "August is fun with summer vacation." }
    ],
    "九": [
      { word: "九時（くじ）", ja: "午前（ごぜん） 九時（くじ）に 授業（じゅぎょう）が 始（はじ）まります。", en: "Class begins at 9 AM." },
      { word: "九月（くがつ）", ja: "九月（くがつ）に 新（あたら）しい 学期（がっき）が 始（はじ）まります。", en: "The new semester begins in September." }
    ],
    "十": [
      { word: "十（じゅう）", ja: "箱（はこ）の 中（なか）に ボールが 十個（じゅっこ） 入（はい）っています。", en: "There are ten balls inside the box." },
      { word: "十月（じゅうがつ）", ja: "十月（じゅうがつ）に 紅葉（こうよう）を 見（み）に 行（い）きます。", en: "I will go to see the autumn leaves in October." },
      { word: "十日（とおか）", ja: "来月（らいげつ）の 十日（とおか）に 会（あ）いましょう。", en: "Let's meet on the 10th of next month." }
    ],
    "百": [
      { word: "百（ひゃく）", ja: "百円（ひゃくえん）の ペンを 買（か）いました。", en: "I bought a 100-yen pen." },
      { word: "百人（ひゃくにん）", ja: "百人（ひゃくにん）の 人（ひと）が 集（あつ）まりました。", en: "One hundred people gathered." }
    ],
    "千": [
      { word: "千（せん）", ja: "千円（せんえん）札（さつ）で 支払（しはら）いました。", en: "I paid with a 1,000-yen bill." },
      { word: "千人（せんにん）", ja: "会場（かいじょう）に 千人（せんにん）以上（いじょう）の 観客（かんきゃく）が 来（き）ました。", en: "More than a thousand spectators came." }
    ],
    "万": [
      { word: "一万（いちまん）", ja: "一万円（いちまんえん）を 貯金（ちょきん）しました。", en: "I saved 10,000 yen." },
      { word: "万全（ばんぜん）", ja: "万全（ばんぜん）の 準備（じゅんび）を して 試験（しけん）を 受（う）けます。", en: "I will take the exam with thorough preparation." }
    ],
    "円": [
      { word: "円（えん）", ja: "この 本（ほん）は 五百円（ごひゃくえん）です。", en: "This book is 500 yen." },
      { word: "円高（えんだか）", ja: "円高（えんだか）で 海外（かいがい）旅行（りょこう）が 人気（にんき）です。", en: "Overseas travel is popular due to the strong yen." }
    ],
    "年": [
      { word: "今年（ことし）", ja: "今年（ことし） 日本語（にほんご）の 試験（しけん）に 合格（ごうかく）したいです。", en: "I want to pass the Japanese exam this year." },
      { word: "去年（きょねん）", ja: "去年（きょねん） 東京（とうきょう）へ 旅行（りょこう）に 行（い）きました。", en: "I went on a trip to Tokyo last year." },
      { word: "来年（らいねん）", ja: "来年（らいねん） 大学（だいがく）を 卒業（そつぎょう）します。", en: "I will graduate from university next year." }
    ],
    "日": [
      { word: "日曜日（にちようび）", ja: "日曜日（にちようび）に 友達（ともだち）と 買い物（かいもの）に 行（い）きます。", en: "I go shopping with a friend on Sunday." },
      { word: "毎日（まいにち）", ja: "毎日（まいにち） 日本語（にほんご）を 勉強（べんきょう）しています。", en: "I study Japanese every day." },
      { word: "一日（いちにち）", ja: "今日（きょう）は とても 楽（たの）しい 一日（いちにち）でした。", en: "Today was a very fun day." }
    ],
    "月": [
      { word: "月曜日（げつようび）", ja: "月曜日（げつようび）から 金曜日（きんようび）まで 働（はたら）きます。", en: "I work from Monday to Friday." },
      { word: "今月（こんげつ）", ja: "今月（こんげつ）は 仕事（しごと）が 忙（いそが）しいです。", en: "I am busy with work this month." },
      { word: "月（つき）", ja: "今夜（こんや）は 月（つき）が とても きれいです。", en: "The moon is very beautiful tonight." }
    ],
    "火": [
      { word: "火曜日（かようび）", ja: "火曜日（かようび）に 日本語（にほんご）の テストが あります。", en: "There is a Japanese test on Tuesday." },
      { word: "火（ひ）", ja: "火（ひ）の 取（と）り扱（あつか）いに 気（き）をつけてください。", en: "Please be careful when handling fire." }
    ],
    "水": [
      { word: "水曜日（すいようび）", ja: "水曜日（すいようび）は 学校（がっこう）が 休（やす）みです。", en: "School is off on Wednesday." },
      { word: "水（みず）", ja: "冷（つめ）たい 水（みず）を 一杯（いっぱい） 飲（の）みたいです。", en: "I would like to drink a glass of cold water." }
    ],
    "木": [
      { word: "木曜日（もくようび）", ja: "木曜日（もくようび）の 午後（ごご）に 会（あ）いましょう。", en: "Let's meet on Thursday afternoon." },
      { word: "木（き）", ja: "庭（にわ）に 大（おお）きな 木（き）が あります。", en: "There is a big tree in the garden." }
    ],
    "金": [
      { word: "金曜日（きんようび）", ja: "金曜日（きんようび）の 夜（よる）は 外食（がいしょく）します。", en: "I eat out on Friday night." },
      { word: "お金（おかね）", ja: "財布（さいふ）に お金（おかね）が 入（はい）っていません。", en: "There is no money in my wallet." }
    ],
    "土": [
      { word: "土曜日（どようび）", ja: "土曜日（どようび）は 家（いえ）で ゆっくり 休（やす）みます。", en: "I take a good rest at home on Saturday." },
      { word: "お土産（おみやげ）", ja: "旅行（りょこう）の お土産（おみやげ）を 買（か）いました。", en: "I bought souvenirs from the trip." }
    ],
    "人": [
      { word: "日本人（にほんじん）", ja: "田中（たなか）さんは 親切（しんせつ）な 日本人（にほんじん）です。", en: "Tanaka-san is a kind Japanese person." },
      { word: "人（ひと）", ja: "あの人（ひと）は 誰（だれ）ですか？", en: "Who is that person?" },
      { word: "大人（おとな）", ja: "映画（えいが）の チケットは 大人（おとな） 千円（せんえん）です。", en: "Movie tickets are 1,000 yen for adults." }
    ],
    "学": [
      { word: "学校（がっこう）", ja: "毎朝（まいあさ） ８時（はちじ）に 学校（がっこう）へ 行（い）きます。", en: "I go to school at 8 o'clock every morning." },
      { word: "学生（がくせい）", ja: "私（わたし）は 大学（だいがく）の 学生（がくせい）です。", en: "I am a university student." },
      { word: "学ぶ（まなぶ）", ja: "日本（にほん）の 文化（ぶんか）を 学（まな）びたいです。", en: "I want to learn about Japanese culture." }
    ],
    "校": [
      { word: "学校（がっこう）", ja: "この 学校（がっこう）には たくさんの 生徒（せいと）が います。", en: "There are many students in this school." },
      { word: "高校（こうこう）", ja: "弟（おとうと）は 高校（こうこう）に 通（かよ）っています。", en: "My younger brother attends high school." }
    ],
    "先": [
      { word: "先生（せんせい）", ja: "日本語（にほんご）の 先生（せんせい）に 質問（しつもん）しました。", en: "I asked the Japanese teacher a question." },
      { word: "先週（せんしゅう）", ja: "先週（せんしゅう） 京都（きょうと）へ 旅行（りょこう）に 行（い）きました。", en: "I went on a trip to Kyoto last week." },
      { word: "先に（さきに）", ja: "お先（さき）に 失礼（しつれい）します。", en: "Excuse me for leaving ahead of you." }
    ],
    "生": [
      { word: "先生（せんせい）", ja: "とても 優（やさ）しい 先生（せんせい）です。", en: "He is a very kind teacher." },
      { word: "生活（せいかつ）", ja: "日本（にほん）での 生活（せいかつ）に 慣（な）れました。", en: "I have gotten used to life in Japan." },
      { word: "生まれる（うまれる）", ja: "私（わたし）は ４月（しがつ）に 生（う）まれました。", en: "I was born in April." }
    ],
    "大": [
      { word: "大きい（おおきい）", ja: "公園（こうえん）に 大（おお）きな 木（き）が あります。", en: "There is a big tree in the park." },
      { word: "大学（だいがく）", ja: "東京（とうきょう）の 大学（だいがく）で 勉強（べんきょう）しています。", en: "I study at a university in Tokyo." },
      { word: "大変（たいへん）", ja: "今日（きょう）は 仕事（しごと）が 大変（たいへん）でした。", en: "Work was tough today." }
    ],
    "小": [
      { word: "小さい（ちいさい）", ja: "小（ちい）さな 鳥（とり）が 歌（うた）っています。", en: "A small bird is singing." },
      { word: "小学校（しょうがっこう）", ja: "弟（おとうと）は 小学校（しょうがっこう）に 通（かよ）っています。", en: "My younger brother attends elementary school." }
    ],
    "中": [
      { word: "中（なか）", ja: "かばんの 中（なか）に 本（ほん）が あります。", "en": "There is a book inside the bag." },
      { word: "一日中（いちにちじゅう）", ja: "今日（きょう）は 一日中（いちにちじゅう） 家（いえ）に いました。", "en": "I stayed home all day today." }
    ],
    "国": [
      { word: "外国（がいこく）", ja: "外国（がいこく）へ 旅行（りょこう）に 行（い）きたいです。", en: "I want to travel abroad." },
      { word: "国（くに）", ja: "あなたの 国（くに）は どちらですか？", en: "Which country are you from?" },
      { word: "外国人（がいこくじん）", ja: "街（まち）で 外国人（がいこくじん）の 観光客（かんこうきゃく）を 見（み）かけました。", en: "I saw foreign tourists in town." }
    ],
    "本": [
      { word: "日本（にほん）", ja: "日本（にほん）の 春（はる）は 桜（さくら）が きれいです。", en: "In Japanese spring, the cherry blossoms are beautiful." },
      { word: "本（ほん）", ja: "図書館（としょかん）で 面白（おもしろ）い 本（ほん）を 借（か）りました。", en: "I borrowed an interesting book at the library." }
    ],
    "何": [
      { word: "何（なに）", ja: "昨日（きのう） 何（なに）を 食（た）べましたか？", en: "What did you eat yesterday?" },
      { word: "何時（なんじ）", ja: "今（いま） 何時（なんじ）ですか？", en: "What time is it now?" },
      { word: "何人（なんにん）", ja: "何人（なんにん）で 来（き）ましたか？", en: "How many people did you come with?" }
    ],
    "時": [
      { word: "時間（じかん）", ja: "映画（えいが）の 始（はじ）まる 時間（じかん）に 間に合（まにあ）いました。", en: "I made it in time for the start of the movie." },
      { word: "時々（ときどき）", ja: "時々（ときどき） カフェで 日本語（にほんご）を 勉強（べんきょう）します。", en: "Sometimes I study Japanese at a cafe." }
    ],
    "間": [
      { word: "時間（じかん）", ja: "１時間（いちじかん） 散歩（さんぽ）を しました。", en: "I took a walk for one hour." },
      { word: "間（あいだ）", ja: "本（ほん）と 本（ほん）の 間（あいだ）に 手紙（てがみ）が 挟（はさ）まっています。", en: "A letter is sandwiched between the books." }
    ],
    "分": [
      { word: "分（ふん / ぷん）", ja: "あと 十（じゅっ）分（ぷん）で 電車（でんしゃ）が 来（き）ます。", en: "The train will arrive in ten minutes." },
      { word: "自分（じぶん）", ja: "自分（じぶん）の 部屋（へや）を 掃除（そうじ）しました。", en: "I cleaned my own room." },
      { word: "分かる（わかる）", ja: "日本語（にほんご）の 意味（いみ）が よく 分（わ）かりました。", en: "I understood the meaning of the Japanese well." }
    ]
  };

  /**
   * 漢字とレベルに応じた最適な例文を取得する関数
   */
  function getKanjiExamples(char, level) {
    // 1. プリセット辞書をチェック
    if (PRESET_KANJI_EXAMPLES && PRESET_KANJI_EXAMPLES[char]) {
      return PRESET_KANJI_EXAMPLES[char];
    }

    const results = [];
    const targetLevel = level || 'N5';
    
    // 確実に語彙データベースを取得 (window.JLPT_VOCAB または JLPT_VOCAB)
    const vocabDb = (typeof window !== 'undefined' && window.JLPT_VOCAB) 
      ? window.JLPT_VOCAB 
      : ((typeof JLPT_VOCAB !== 'undefined') ? JLPT_VOCAB : null);

    if (vocabDb) {
      // 優先1: 同一レベルで、漢字を含み例文がある単語
      const sameList = vocabDb[targetLevel] || [];
      for (let i = 0; i < sameList.length; i++) {
        const v = sameList[i];
        if (v.word && v.word.includes(char) && v.examples && v.examples.length > 0) {
          results.push({
            word: `${v.word}${v.reading ? '（' + v.reading + '）' : ''}`,
            ja: v.examples[0].ja,
            en: v.examples[0].en || (v.meanings ? v.meanings.join(', ') : '')
          });
          if (results.length >= 3) break;
        }
      }

      // 優先2: 他のレベルで、漢字を含み例文がある単語
      if (results.length < 2) {
        const otherLevels = ['N5', 'N4', 'N3', 'N2', 'N1'];
        for (let l = 0; l < otherLevels.length; l++) {
          const ol = otherLevels[l];
          if (ol === targetLevel) continue;
          const oList = vocabDb[ol] || [];
          for (let i = 0; i < oList.length; i++) {
            const v = oList[i];
            if (v.word && v.word.includes(char) && v.examples && v.examples.length > 0) {
              results.push({
                word: `${v.word}${v.reading ? '（' + v.reading + '）' : ''}`,
                ja: v.examples[0].ja,
                en: v.examples[0].en || (v.meanings ? v.meanings.join(', ') : '')
              });
              if (results.length >= 3) break;
            }
          }
          if (results.length >= 3) break;
        }
      }

      // 優先3: 例文はないが単語が存在する場合、自然な実践短文を構成
      if (results.length === 0) {
        for (const lvl of ['N5', 'N4', 'N3', 'N2', 'N1']) {
          const lList = vocabDb[lvl] || [];
          for (let i = 0; i < lList.length; i++) {
            const v = lList[i];
            if (v.word && v.word.includes(char)) {
              const r = v.reading ? `（${v.reading}）` : '';
              const m = (v.meanings && v.meanings[0]) || '';
              results.push({
                word: `${v.word}${r}`,
                ja: `日常（にちじょう）会話（かいわ）で「${v.word}${r}」を よく 使（つか）います。`,
                en: m ? `Common expression: "${v.word}" (${m})` : `Useful vocabulary containing "${char}".`
              });
              if (results.length >= 2) break;
            }
          }
          if (results.length >= 2) break;
        }
      }
    }

    // 優先4: 漢字自体の情報から自然な学習例文を生成 (ダミー文は完全撤廃)
    if (results.length === 0) {
      let kObj = null;
      if (typeof window !== 'undefined' && window.JLPT_KANJI_DATA) {
        for (const lvl of ['N5', 'N4', 'N3', 'N2', 'N1']) {
          const found = (window.JLPT_KANJI_DATA[lvl] || []).find(k => k.character === char);
          if (found) { kObj = found; break; }
        }
      }
      if (kObj) {
        const on = (kObj.onyomi && kObj.onyomi[0]) || '';
        const kun = (kObj.kunyomi && kObj.kunyomi[0]) || '';
        const mean = (kObj.meanings && kObj.meanings.slice(0, 2).join(', ')) || '';
        const yomiDisplay = kun ? `（${kun}）` : (on ? `（${on}）` : '');
        results.push({
          word: `${char}${yomiDisplay}`,
          ja: `「${char}」は「${mean || '重要'}」という意味を表す漢字です。`,
          en: `Kanji "${char}" means "${mean}".`
        });
      }
    }

    return results;
  }

  // ============================================================
  // 1. 筆順アニメーション＆コマ送りモーダル (画像2 完全再現)
  // ============================================================
  window.KanjiEngine = {
    fetchStrokes: fetchKanjiStrokes,
    currentAnimTimer: null,
    getExamples: getKanjiExamples,

    async openStrokeModal(char, extraInfo = {}) {
      const old = document.getElementById('kanji-stroke-modal-overlay');
      if (old) old.remove();

      let data = await fetchKanjiStrokes(char);
      const strokesCount = (data && data.strokesCount) || (extraInfo.strokes) || 1;

      // Find full kanji details if not provided
      let kObj = extraInfo || {};
      if (!kObj.onyomi && !kObj.kunyomi && typeof window !== 'undefined' && window.JLPT_KANJI_DATA) {
        for (const lvl of ['N5', 'N4', 'N3', 'N2', 'N1']) {
          const found = (window.JLPT_KANJI_DATA[lvl] || []).find(k => k.character === char);
          if (found) { kObj = found; break; }
        }
      }
      const lvl = kObj.level || (window.KanjiListEngine ? window.KanjiListEngine.currentLevel : 'N5');
      const onList = kObj.onyomi || [];
      const kunList = kObj.kunyomi || [];
      const meanList = kObj.meanings || [];
      const onStr = onList.length > 0 ? onList.join('、') : '—';
      const kunStr = kunList.length > 0 ? kunList.join('、') : '—';
      const meanStr = meanList.length > 0 ? meanList.join(', ') : '—';

      const examples = getKanjiExamples(char, lvl);

      const overlay = document.createElement('div');
      overlay.id = 'kanji-stroke-modal-overlay';
      overlay.className = 'kanji-stroke-modal-overlay';
      overlay.onclick = (e) => { if (e.target === overlay) KanjiEngine.closeStrokeModal(); };

      overlay.innerHTML = `
        <div class="kanji-modal-box">
          <div class="kanji-modal-header">
            <div class="kanji-modal-title-group">
              <span class="kanji-char-badge">${char}</span>
              <div style="display:flex; flex-direction:column; gap:2px;">
                <div style="display:flex; align-items:center; gap:6px;">
                  <span class="kanji-stroke-badge">${strokesCount}画</span>
                  <span style="background:#EFF6FF; color:#1D4ED8; font-weight:800; font-size:0.75rem; padding:2px 8px; border-radius:6px; border:1px solid #BFDBFE;">JLPT ${lvl}</span>
                </div>
                <div style="font-size:0.78rem; color:#64748B; max-width:260px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${meanStr}</div>
              </div>
            </div>
            <button class="kanji-modal-close-btn" onclick="KanjiEngine.closeStrokeModal()">✕</button>
          </div>

          <div class="kanji-modal-body" style="padding:16px 20px 24px; display:flex; flex-direction:column; gap:16px;">
            <!-- 田字格アニメーション (240px) -->
            <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
              <div class="kanji-stage-box" id="kanji-modal-stage"></div>

              <!-- コントロールバー -->
              <div class="kanji-controls-bar">
                <button class="kanji-play-btn" onclick="KanjiEngine.replayAnimation('${char}')">▶ もういちど</button>
                <label style="display:inline-flex; align-items:center; gap:5px; cursor:pointer; font-size:0.82rem; color:#475569; font-weight:700;">
                  <input type="checkbox" id="kanji-slow-toggle" onchange="KanjiEngine.replayAnimation('${char}')"> ゆっくり
                </label>
                <label style="display:inline-flex; align-items:center; gap:5px; cursor:pointer; font-size:0.82rem; color:#475569; font-weight:700;">
                  <input type="checkbox" id="kanji-numbers-toggle" checked onchange="KanjiEngine.toggleNumbers()"> 番号
                </label>
                <button class="kanji-btn-trace-mode" id="btn-toggle-trace" onclick="KanjiEngine.toggleTrace('${char}')">✍ なぞり練習</button>
              </div>
            </div>

            <!-- 1画ごとのコマ送りグリッド (新画赤色ハイライト) -->
            <div>
              <div style="font-size:0.78rem; font-weight:700; color:#64748B; margin-bottom:6px; display:flex; align-items:center; gap:4px;">
                <span>🖌️</span> <span>筆順コマ送り（新しく書く画＝赤色）:</span>
              </div>
              <div class="kanji-step-grid" id="kanji-modal-step-grid"></div>
            </div>

            <!-- 音読み・訓読み・意味の詳しい表示 -->
            <div class="kanji-detail-info-strip">
              <div class="kanji-detail-row">
                <span class="kanji-detail-label on">音読み</span>
                <span class="kanji-detail-value" style="color:#DC2626;">${onStr}</span>
              </div>
              <div class="kanji-detail-row">
                <span class="kanji-detail-label kun">訓読み</span>
                <span class="kanji-detail-value" style="color:#2563EB;">${kunStr}</span>
              </div>
              <div class="kanji-detail-row">
                <span class="kanji-detail-label mean">英語の意味</span>
                <span class="kanji-detail-value">${meanStr}</span>
              </div>
            </div>

            <!-- レベルに合わせた例文セクション -->
            <div class="kanji-examples-section">
              <div class="kanji-examples-header">
                <span style="display:flex; align-items:center; gap:5px;">
                  <span>📖</span> <span>【${lvl}】の言葉・使い方例文</span>
                </span>
                <span style="font-size:0.75rem; font-weight:700; color:#0284C7;">${examples.length}件</span>
              </div>
              ${examples.map(ex => {
                const escapedJa = ex.ja.replace(/'/g, "\\'").replace(/"/g, '&quot;');
                return `
                  <div class="kanji-example-card">
                    <div class="kanji-example-word-row">
                      <span class="kanji-example-word">${ex.word}</span>
                      <button class="kanji-example-audio-btn" onclick="playGoogleTTS('${escapedJa}')" title="音声を聴く">
                        🔊 発音
                      </button>
                    </div>
                    <div class="kanji-example-ja">${ex.ja}</div>
                    ${ex.en ? `<div class="kanji-example-en">${ex.en}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>

            <div class="kanji-credits-note" style="text-align:center; font-size:0.72rem; color:#94A3B8; margin-top:4px;">
              筆順データ : KanjiVG (CC BY-SA 3.0) ｜ JLPT総合学習プラットフォーム
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      if (data) {
        this.renderStage(data);
        this.renderStepGrid(data);
      } else {
        const stage = document.getElementById('kanji-modal-stage');
        if (stage) stage.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-size:3.5rem;color:#1E3A8A;font-family:serif;">${char}</div>`;
      }
    },

    closeStrokeModal() {
      const overlay = document.getElementById('kanji-stroke-modal-overlay');
      if (overlay) overlay.remove();
      if (this.currentAnimTimer) cancelAnimationFrame(this.currentAnimTimer);
    },

    replayAnimation(char) {
      const data = KANJI_CACHE[char];
      if (data) this.renderStage(data);
    },

    toggleNumbers() {
      const checked = document.getElementById('kanji-numbers-toggle')?.checked;
      const g = document.getElementById('kvg-numbers-layer');
      if (g) g.style.display = checked ? 'block' : 'none';
    },

    toggleTrace(char) {
      const stage = document.getElementById('kanji-modal-stage');
      const data = KANJI_CACHE[char];
      const btn = document.getElementById('btn-toggle-trace');
      if (!stage || !data) return;

      const isTracing = stage.classList.contains('tracing-on');
      if (isTracing) {
        stage.classList.remove('tracing-on');
        btn.textContent = "✍ なぞり練習";
        this.renderStage(data);
      } else {
        stage.classList.add('tracing-on');
        btn.textContent = "▶ お手本に戻る";
        this.startTrace(stage, data);
      }
    },

    startTrace(container, data) {
      container.innerHTML = '';
      const size = data.size || GRID;

      const ghostSvg = svgEl("svg", {
        viewBox: `0 0 ${size} ${size}`,
        style: "position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:1;"
      });
      ghostSvg.appendChild(makeTianGridGuidelines(size));
      const strokeW = getInkWidth(data.strokesCount);
      data.paths.forEach(p => {
        ghostSvg.appendChild(svgEl("path", {
          d: p, fill: "none", stroke: "#CBD5E1",
          "stroke-width": strokeW, "stroke-linecap": "round", "stroke-linejoin": "round"
        }));
      });
      container.appendChild(ghostSvg);

      const canvas = document.createElement('canvas');
      const w = 240, h = 240;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.style.position = "absolute";
      canvas.style.inset = "0";
      canvas.style.zIndex = "2";
      canvas.style.touchAction = "none";
      canvas.style.cursor = "crosshair";
      container.appendChild(canvas);

      const ctx = canvas.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 6.5;

      let drawing = false;
      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };

      canvas.onpointerdown = (e) => {
        canvas.setPointerCapture(e.pointerId);
        drawing = true;
        const p = getPos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
      };
      canvas.onpointermove = (e) => {
        if (!drawing) return;
        const p = getPos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      };
      const stop = () => { drawing = false; };
      canvas.onpointerup = stop;
      canvas.onpointercancel = stop;
    },

    renderStage(data) {
      const stage = document.getElementById('kanji-modal-stage');
      if (!stage) return;
      stage.innerHTML = '';
      stage.classList.remove('tracing-on');

      const isSlow = document.getElementById('kanji-slow-toggle')?.checked;
      const showNums = document.getElementById('kanji-numbers-toggle')?.checked ?? true;

      const size = data.size || GRID;
      const svg = svgEl("svg", { viewBox: `0 0 ${size} ${size}`, style: "width:100%; height:100%;" });
      svg.appendChild(makeTianGridGuidelines(size));

      const strokeW = getInkWidth(data.strokesCount);
      const pathNodes = [];

      data.paths.forEach((d) => {
        const p = svgEl("path", {
          d: d,
          fill: "none",
          stroke: "#2563EB",
          "stroke-width": strokeW,
          "stroke-linecap": "round",
          "stroke-linejoin": "round"
        });
        svg.appendChild(p);
        pathNodes.push(p);
      });

      const numG = svgEl("g", { id: "kvg-numbers-layer", style: `display:${showNums ? 'block' : 'none'};` });
      if (data.nums) {
        data.nums.forEach(([x, y], i) => {
          const t = svgEl("text", {
            x: x, y: y,
            fill: "#1E40AF",
            "font-size": "9",
            "font-weight": "bold",
            "font-family": "sans-serif",
            opacity: "0.85"
          });
          t.textContent = i + 1;
          numG.appendChild(t);
        });
      }
      svg.appendChild(numG);
      stage.appendChild(svg);

      this.animatePaths(pathNodes, isSlow ? 750 : 380);
    },

    animatePaths(paths, durationPerStroke) {
      if (this.currentAnimTimer) cancelAnimationFrame(this.currentAnimTimer);

      const lengths = paths.map(p => {
        const l = p.getTotalLength();
        p.style.strokeDasharray = l;
        p.style.strokeDashoffset = l;
        return l;
      });

      let currentIdx = 0;
      let startTime = null;

      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(1, elapsed / durationPerStroke);

        const curPath = paths[currentIdx];
        const curLen = lengths[currentIdx];
        curPath.style.strokeDashoffset = curLen * (1 - progress);

        if (progress < 1) {
          this.currentAnimTimer = requestAnimationFrame(step);
        } else {
          curPath.style.strokeDashoffset = 0;
          currentIdx++;
          if (currentIdx < paths.length) {
            startTime = null;
            this.currentAnimTimer = requestAnimationFrame(step);
          }
        }
      };

      this.currentAnimTimer = requestAnimationFrame(step);
    },

    renderStepGrid(data) {
      const grid = document.getElementById('kanji-modal-step-grid');
      if (!grid) return;
      grid.innerHTML = '';

      const size = data.size || GRID;
      const strokeW = getInkWidth(data.strokesCount);

      data.paths.forEach((_, stepIdx) => {
        const cell = document.createElement('div');
        cell.className = 'kanji-step-cell';

        const numTag = document.createElement('span');
        numTag.className = 'kanji-step-num';
        numTag.textContent = stepIdx + 1;
        cell.appendChild(numTag);

        const svg = svgEl("svg", { viewBox: `0 0 ${size} ${size}`, style: "width:100%; height:100%;" });
        svg.appendChild(makeTianGridGuidelines(size));

        for (let i = 0; i <= stepIdx; i++) {
          const isLatest = (i === stepIdx);
          svg.appendChild(svgEl("path", {
            d: data.paths[i],
            fill: "none",
            stroke: isLatest ? "#DC2626" : "#475569",
            "stroke-width": isLatest ? strokeW * 1.15 : strokeW,
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }));
        }

        cell.appendChild(svg);
        grid.appendChild(cell);
      });
    }
  };

  // ============================================================
  // 2. 毎日漢字スタイル 手書きテスト (写真 media_1789917012981.png 完全再現)
  //    N5〜N1対応・縦インデックス・まいにち10問ずつ
  // ============================================================
  window.MainichiKanjiQuiz = {
    containerId: 'mainichi-quiz-card',
    currentLevel: 'N5',
    currentDay: 1,
    currentIndexInDay: 0,
    canvasHistory: [],

    getLevelData() {
      if (window.JLPT_DAILY_KANJI_DATA && window.JLPT_DAILY_KANJI_DATA[this.currentLevel]) {
        return window.JLPT_DAILY_KANJI_DATA[this.currentLevel];
      }
      return null;
    },

    getDays() {
      const lvlData = this.getLevelData();
      if (lvlData && Array.isArray(lvlData.days) && lvlData.days.length > 0) {
        return lvlData.days;
      }
      // Fallback for standalone legacy questions
      const all = window.KANJI_QUIZ_DATA || [];
      const filtered = all.filter(q => q.level === this.currentLevel);
      const fallbackList = filtered.length > 0 ? filtered : all;
      const chunks = [];
      for (let i = 0; i < fallbackList.length; i += 10) {
        chunks.push({
          day: Math.floor(i / 10) + 1,
          label: `Day ${Math.floor(i / 10) + 1}`,
          count: Math.min(10, fallbackList.length - i),
          questions: fallbackList.slice(i, i + 10)
        });
      }
      return chunks;
    },

    getCurrentDayQuestions() {
      const days = this.getDays();
      if (!days || days.length === 0) return [];
      const found = days.find(d => d.day === this.currentDay);
      return (found && found.questions) || (days[0] && days[0].questions) || [];
    },

    init(containerId, level = 'N5', day = 1) {
      this.containerId = containerId;
      this.currentLevel = level;
      this.currentDay = day;
      this.currentIndexInDay = 0;
      this.render();
    },

    setLevel(level) {
      this.currentLevel = level;
      this.currentDay = 1;
      this.currentIndexInDay = 0;
      this.render();
    },

    setDay(day) {
      this.currentDay = day;
      this.currentIndexInDay = 0;
      this.render();
      // Smooth scroll active day item in sidebar
      setTimeout(() => {
        const activeItem = document.querySelector('.mainichi-day-item.active');
        if (activeItem) activeItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }, 50);
    },

    setQuestion(idx) {
      const questions = this.getCurrentDayQuestions();
      if (idx >= 0 && idx < questions.length) {
        this.currentIndexInDay = idx;
        this.render();
      }
    },

    render() {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      const days = this.getDays();
      const questions = this.getCurrentDayQuestions();

      if (days.length === 0 || questions.length === 0) {
        container.innerHTML = '<div style="padding:40px; text-align:center; color:#64748B;">クイズデータがありません。</div>';
        return;
      }

      if (this.currentIndexInDay >= questions.length) {
        this.currentIndexInDay = 0;
      }

      const q = questions[this.currentIndexInDay];
      const sentenceHtml = q.questionSentence.replace(
        `{${q.targetKana}}`,
        `<span class="mainichi-target-kana">${q.targetKana}</span>`
      );

      const isFirstQ = (this.currentIndexInDay === 0 && this.currentDay === 1);
      const isLastQInDay = (this.currentIndexInDay === questions.length - 1);
      const isLastDay = (this.currentDay >= days.length);

      // Clean speech text
      const cleanSent = q.questionSentence.replace(/{|}/g, '').replace(/[\r\n]+/g, ' ');
      const cleanWord = (q.fullWord || q.kanji || '').replace(/[\r\n]+/g, ' ');

      container.innerHTML = `
        <div class="mainichi-quiz-layout">
          <!-- 縦インデックス サイドバー (Day 1〜Day 30) -->
          <div class="mainichi-day-index-sidebar">
            <div class="mainichi-day-sidebar-title">
              <span>📅 Day 選択</span>
              <span style="font-size:0.75rem; color:#64748B;">全${days.length}日 (1日10問)</span>
            </div>
            <div class="mainichi-day-list" id="mainichi-day-list">
              ${days.map(d => `
                <button class="mainichi-day-item ${d.day === this.currentDay ? 'active' : ''}" onclick="MainichiKanjiQuiz.setDay(${d.day})">
                  <span>${d.label}</span>
                  <span class="mainichi-day-badge">${d.count || d.questions.length}問</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- 右側メインクイズエリア -->
          <div class="mainichi-quiz-main">
            <!-- 10問クイックジャンプバー -->
            <div style="display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; margin-bottom:12px; background:#F8FAFC; padding:8px 14px; border-radius:12px; border:1px solid #E2E8F0;">
              <div style="display:flex; align-items:center; gap:8px;">
                <span style="font-weight:800; font-size:0.95rem; color:#1E3A8A;">【${this.currentLevel}】Day ${this.currentDay}</span>
                <span style="font-size:0.8rem; color:#64748B;">まいにち10問</span>
              </div>
              <div class="mainichi-q-pills">
                ${questions.map((_, i) => `
                  <button class="mainichi-q-pill ${i === this.currentIndexInDay ? 'active' : ''}" onclick="MainichiKanjiQuiz.setQuestion(${i})" title="第 ${i + 1} 問へ">
                    ${i + 1}
                  </button>
                `).join('')}
              </div>
            </div>

            <!-- 写真完全一致のクイズカード (media_1789917012981.png) -->
            <div class="mainichi-quiz-card" style="margin:0; max-width:100%;">
              <!-- 写真上部のお知らせバナー -->
              <div class="quiz-notice-banner">
                <span class="quiz-notice-badge">NEW</span>
                <span>🔖 を押すと問題をマイリストに保存できるようになりました</span>
              </div>

              <!-- 問題行: 1. 敵をアザムく作戦だ。 + 🔊 + 🔖 -->
              <div class="mainichi-question-row">
                <div class="mainichi-sentence">
                  <span style="font-weight:800; color:#1E3A8A; margin-right:4px;">${this.currentIndexInDay + 1}.</span>
                  <span>${sentenceHtml}</span>
                </div>
                <div style="display:flex; align-items:center; gap:8px;">
                  <button onclick="playGoogleTTS('${cleanSent.replace(/'/g, "\\'")}')" title="Google音声で問題文を聞く" style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:8px; font-size:1.05rem; cursor:pointer; padding:3px 8px; color:#1D4ED8; display:inline-flex; align-items:center;" onmouseover="this.style.background='#DBEAFE'" onmouseout="this.style.background='#EFF6FF'">
                    🔊
                  </button>
                  <button class="mainichi-bookmark-btn" id="btn-quiz-bookmark" onclick="MainichiKanjiQuiz.toggleBookmark()" title="マイリストに保存">
                    🔖
                  </button>
                </div>
              </div>

              <!-- 丸っこいグレーの「解答」ボタン (写真完全一致) -->
              <button class="mainichi-btn-answer" id="mainichi-btn-answer" onclick="MainichiKanjiQuiz.toggleAnswer()">
                解答
              </button>

              <!-- 白紙の手書きキャンバス枠 (写真中央) -->
              <div class="mainichi-canvas-frame">
                <canvas class="mainichi-canvas" id="mainichi-writing-canvas"></canvas>
              </div>

              <!-- キャンバス下ツールバー [✕] [↺] [^ 閉じる] (写真完全一致) -->
              <div class="mainichi-canvas-toolbar">
                <div class="mainichi-tools-left">
                  <button class="mainichi-square-btn" title="全て消去" onclick="MainichiKanjiQuiz.clearCanvas()">✕</button>
                  <button class="mainichi-square-btn" title="1画戻す" onclick="MainichiKanjiQuiz.undoCanvas()">↺</button>
                  <button class="mainichi-pill-close-btn" onclick="MainichiKanjiQuiz.hideAnswer()">＾ 閉じる</button>
                </div>
                <div style="font-size:0.84rem; font-weight:700; color:#64748B;">
                  第 ${this.currentIndexInDay + 1} / ${questions.length} 問
                </div>
              </div>

              <!-- 解答展開パネル (「解答」ボタンを押して自分で開く) -->
              <div class="mainichi-answer-panel" id="mainichi-answer-panel">
                <div class="mainichi-answer-head">
                  <div style="display:flex; align-items:center; gap:8px;">
                    <span class="mainichi-ans-kanji">${q.kanji}</span>
                    <span class="mainichi-ans-reading">（${q.reading}）</span>
                    <button onclick="playGoogleTTS('${cleanWord.replace(/'/g, "\\'")}')" title="単語の音声を聞く" style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:6px; font-size:0.95rem; cursor:pointer; padding:2px 7px; color:#1D4ED8;">
                      🔊
                    </button>
                  </div>
                  <button class="mainichi-stroke-modal-btn" onclick="KanjiEngine.openStrokeModal('${q.kanji[0]}')">
                    🔍 筆順・書き順を見る
                  </button>
                </div>
                <div class="mainichi-ans-expl">${q.explanation || ''}</div>

                <!-- 例文（ふりがな付き） ＆ その日本語訳 (ユーザー要望反映) -->
                <div class="mainichi-example-card" style="background:#FFFFFF; border:1.5px solid #BAE6FD; border-radius:12px; padding:12px 16px; margin:12px 0 14px; box-shadow:0 1px 4px rgba(0,0,0,0.03);">
                  <div style="font-size:0.8rem; font-weight:800; color:#0284C7; margin-bottom:6px; display:flex; align-items:center; justify-content:space-between;">
                    <span>📖 例文（ふりがな付き）</span>
                    <button onclick="playGoogleTTS('${(q.fullSentence || cleanSent).replace(/'/g, "\\'")}')" title="例文の音声を再生" style="background:#EFF6FF; border:1px solid #BFDBFE; border-radius:6px; font-size:0.84rem; padding:2px 8px; color:#1D4ED8; cursor:pointer;">
                      🔊 例文を聞く
                    </button>
                  </div>
                  <div style="font-size:1.15rem; font-weight:600; color:#0F172A; line-height:2.0; margin-bottom:6px;">
                    ${q.rubySentence || q.fullSentence || cleanSent}
                  </div>
                  ${q.translation ? `
                    <div style="font-size:0.88rem; color:#475569; border-top:1px dashed #E2E8F0; padding-top:6px; margin-top:4px;">
                      <span style="font-weight:700; color:#64748B;">訳:</span> ${q.translation}
                    </div>
                  ` : ''}
                </div>

                <div class="mainichi-self-check-bar">
                  <button class="btn-check-ok" onclick="MainichiKanjiQuiz.mark(true)">⭕ 正解した！</button>
                  <button class="btn-check-ng" onclick="MainichiKanjiQuiz.mark(false)">❌ まちがえた（復習に追加）</button>
                </div>
              </div>

              <!-- ナビゲーションバー (前へ・次へ) -->
              <div class="mainichi-nav-bar">
                <button class="mainichi-nav-btn" onclick="MainichiKanjiQuiz.prev()" ${isFirstQ ? 'disabled' : ''}>
                  ◀ 前の問題
                </button>
                <button class="mainichi-nav-btn" onclick="MainichiKanjiQuiz.next()">
                  ${isLastQInDay ? (isLastDay ? '全問達成！🎉' : '次のDay (' + (this.currentDay + 1) + ') へ ▶') : '次の問題 ▶'}
                </button>
              </div>
            </div>
          </div>
        </div>
      `;

      this.setupCanvas();
    },

    setupCanvas() {
      const cvs = document.getElementById('mainichi-writing-canvas');
      if (!cvs) return;

      const container = cvs.parentElement;
      const w = container.clientWidth || 600;
      const h = 260;

      cvs.width = w * window.devicePixelRatio;
      cvs.height = h * window.devicePixelRatio;
      cvs.style.width = w + "px";
      cvs.style.height = h + "px";

      const ctx = cvs.getContext('2d');
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 6.5;

      this.canvasHistory = [];
      let currentStroke = [];
      let drawing = false;

      const getPos = (e) => {
        const rect = cvs.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
      };

      cvs.onpointerdown = (e) => {
        cvs.setPointerCapture(e.pointerId);
        drawing = true;
        currentStroke = [];
        const p = getPos(e);
        currentStroke.push(p);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
      };

      cvs.onpointermove = (e) => {
        if (!drawing) return;
        const p = getPos(e);
        currentStroke.push(p);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      };

      const stop = () => {
        if (!drawing) return;
        drawing = false;
        if (currentStroke.length > 0) this.canvasHistory.push([...currentStroke]);
      };

      cvs.onpointerup = stop;
      cvs.onpointercancel = stop;
    },

    clearCanvas() {
      const cvs = document.getElementById('mainichi-writing-canvas');
      if (!cvs) return;
      const ctx = cvs.getContext('2d');
      ctx.clearRect(0, 0, cvs.width, cvs.height);
      this.canvasHistory = [];
    },

    undoCanvas() {
      const cvs = document.getElementById('mainichi-writing-canvas');
      if (!cvs || this.canvasHistory.length === 0) return;
      this.canvasHistory.pop();

      const ctx = cvs.getContext('2d');
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 6.5;

      this.canvasHistory.forEach(stroke => {
        if (stroke.length === 0) return;
        ctx.beginPath();
        ctx.moveTo(stroke[0].x, stroke[0].y);
        for (let i = 1; i < stroke.length; i++) {
          ctx.lineTo(stroke[i].x, stroke[i].y);
        }
        ctx.stroke();
      });
    },

    toggleAnswer() {
      const panel = document.getElementById('mainichi-answer-panel');
      if (!panel) return;
      const isNone = (panel.style.display === 'none' || !panel.style.display);
      panel.style.display = isNone ? 'block' : 'none';
    },

    hideAnswer() {
      const panel = document.getElementById('mainichi-answer-panel');
      if (panel) panel.style.display = 'none';
    },

    mark(isCorrect) {
      const questions = this.getCurrentDayQuestions();
      const q = questions[this.currentIndexInDay];
      if (!isCorrect) {
        if (typeof UserProgress !== 'undefined') {
          UserProgress.toggleSaveVocab({
            word: q.kanji,
            reading: q.reading,
            meaning: `${q.targetKana} -> ${q.meaning}`,
            level: q.level
          });
          alert(`「${q.kanji}」をマイリスト（復習リスト）に追加しました！`);
        }
      } else {
        alert("正解！よくできました！🎉");
      }
      this.next();
    },

    toggleBookmark() {
      const questions = this.getCurrentDayQuestions();
      const q = questions[this.currentIndexInDay];
      if (typeof UserProgress !== 'undefined') {
        UserProgress.toggleSaveVocab({
          word: q.kanji,
          reading: q.reading,
          meaning: q.meaning,
          level: q.level
        });
        alert(`「${q.kanji}」をマイリストに保存しました！`);
      }
    },

    next() {
      const questions = this.getCurrentDayQuestions();
      const days = this.getDays();

      if (this.currentIndexInDay < questions.length - 1) {
        this.currentIndexInDay++;
        this.render();
      } else if (this.currentDay < days.length) {
        this.setDay(this.currentDay + 1);
      } else {
        alert("おめでとうございます！全30日分の漢字テストを修了しました！🎊");
      }
    },

    prev() {
      if (this.currentIndexInDay > 0) {
        this.currentIndexInDay--;
        this.render();
      } else if (this.currentDay > 1) {
        this.currentDay--;
        const prevQuestions = this.getCurrentDayQuestions();
        this.currentIndexInDay = Math.max(0, prevQuestions.length - 1);
        this.render();
      }
    }
  };

  // ============================================================
  // 3. JLPT漢字リスト (レベル別: N5 / N4 / N3)
  // ============================================================
  window.KanjiListEngine = {
    currentLevel: 'N5',
    currentSearch: '',

    init(containerId, level = 'N5') {
      this.containerId = containerId;
      this.currentLevel = level;
      this.render();
    },

    setLevel(level, btnEl) {
      this.currentLevel = level;
      if (btnEl && btnEl.parentElement) {
        btnEl.parentElement.querySelectorAll('.quiz-level-pill').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
      }
      this.render();
    },

    onSearch(val) {
      this.currentSearch = (val || '').trim().toLowerCase();
      this.render();
    },

    render() {
      const container = document.getElementById(this.containerId);
      if (!container) return;

      const allData = window.JLPT_KANJI_DATA || {};
      let list = allData[this.currentLevel] || [];

      if (this.currentSearch) {
        list = list.filter(k => {
          if (k.character.includes(this.currentSearch)) return true;
          if (k.onyomi && k.onyomi.some(r => r.toLowerCase().includes(this.currentSearch))) return true;
          if (k.kunyomi && k.kunyomi.some(r => r.toLowerCase().includes(this.currentSearch))) return true;
          if (k.meanings && k.meanings.some(m => m.toLowerCase().includes(this.currentSearch))) return true;
          return false;
        });
      }

      container.innerHTML = `
        <div class="kanji-list-toolbar">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
            <button onclick="switchWritingTab('quiz')" style="background:#EFF6FF; border:1.5px solid #93C5FD; color:#1D4ED8; padding:6px 14px; border-radius:8px; font-weight:800; font-size:0.84rem; cursor:pointer; display:inline-flex; align-items:center; gap:4px; box-shadow:0 1px 3px rgba(0,0,0,0.05);" title="漢字書き取りテストに戻る">
              ← 漢字テストに戻る
            </button>
            <div class="quiz-level-pills">
              <button class="quiz-level-pill ${this.currentLevel === 'N5' ? 'active' : ''}" onclick="KanjiListEngine.setLevel('N5', this)">N5</button>
              <button class="quiz-level-pill ${this.currentLevel === 'N4' ? 'active' : ''}" onclick="KanjiListEngine.setLevel('N4', this)">N4</button>
              <button class="quiz-level-pill ${this.currentLevel === 'N3' ? 'active' : ''}" onclick="KanjiListEngine.setLevel('N3', this)">N3</button>
              <button class="quiz-level-pill ${this.currentLevel === 'N2' ? 'active' : ''}" onclick="KanjiListEngine.setLevel('N2', this)">N2</button>
              <button class="quiz-level-pill ${this.currentLevel === 'N1' ? 'active' : ''}" onclick="KanjiListEngine.setLevel('N1', this)">N1</button>
            </div>
          </div>
          <input type="text" class="kanji-list-search" placeholder="漢字・よみ・意味で検索..." value="${this.currentSearch}" oninput="KanjiListEngine.onSearch(this.value)">
        </div>

        <!-- 音読み・訓読みの解説ガイド -->
        <div class="kanji-list-yomi-guide" style="background:#F0FDF4; border:1.5px solid #86EFAC; border-radius:14px; padding:12px 16px; margin-bottom:14px; font-size:0.85rem; color:#166534; line-height:1.6;">
          <div style="font-weight:800; font-size:0.92rem; margin-bottom:6px; display:flex; align-items:center; gap:6px; color:#15803D;">
            <span>💡</span> <span>【音読み】と【訓読み】の違い</span>
          </div>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:10px; margin-bottom:8px;">
            <div style="background:white; border:1px solid #BBF7D0; border-radius:10px; padding:8px 12px;">
              <span style="font-weight:800; color:#DC2626; background:#FEE2E2; padding:2px 8px; border-radius:6px; font-size:0.78rem; margin-right:6px;">音（音読み・カタカナ）</span>
              <div style="font-size:0.8rem; color:#374151; margin-top:4px;">
                昔の中国の発音に由来する読み方。主に<strong>2文字以上の熟語</strong>で使われます。<br>
                <span style="color:#6B7280; font-size:0.75rem;">（例: 【日】<strong>ニチ</strong>ようび / <strong>ガク</strong>こう）</span>
              </div>
            </div>
            <div style="background:white; border:1px solid #BBF7D0; border-radius:10px; padding:8px 12px;">
              <span style="font-weight:800; color:#2563EB; background:#DBEAFE; padding:2px 8px; border-radius:6px; font-size:0.78rem; margin-right:6px;">訓（訓読み・ひらがな）</span>
              <div style="font-size:0.8rem; color:#374151; margin-top:4px;">
                漢字の意味を表す日本古来の読み方。<strong>漢字1文字や送り仮名がつく言葉</strong>で使われます。<br>
                <span style="color:#6B7280; font-size:0.75rem;">（例: 【日】<strong>ひ</strong> / <strong>まな</strong>ぶ）</span>
              </div>
            </div>
          </div>
          <div style="font-size:0.78rem; color:#15803D; display:flex; align-items:center; gap:4px;">
            <span>✨</span> <span>漢字を押すと、書き順アニメーション・なぞり書き・<strong>レベル別の例文</strong>が見られます！</span>
          </div>
        </div>

        <div class="kanji-tiles-grid">
          ${list.map(k => {
            const onList = k.onyomi || [];
            const kunList = k.kunyomi || [];
            const onStr = onList.slice(0, 2).join('、');
            const kunStr = kunList.slice(0, 2).join('、');
            const escapedK = JSON.stringify(k).replace(/"/g, '&quot;');
            return `
              <div class="kanji-tile-card" onclick='KanjiEngine.openStrokeModal("${k.character}", ${escapedK})'>
                <div class="kanji-tile-char">${k.character}</div>
                <div class="kanji-tile-strokes">${k.strokes}画</div>
                <div class="kanji-tile-yomi-box">
                  ${onStr ? `<div class="kanji-yomi-line on"><span class="kanji-badge-on">音</span>${onStr}</div>` : ''}
                  ${kunStr ? `<div class="kanji-yomi-line kun"><span class="kanji-badge-kun">訓</span>${kunStr}</div>` : ''}
                  ${!onStr && !kunStr ? `<div style="color:#94A3B8; font-size:0.7rem;">—</div>` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `;
    }
  };

  // Google TTS Player (Google Translate TTS API)
  window.playGoogleTTS = function(text) {
    if (!text) return;
    try {
      const clean = text.trim();
      const encoded = encodeURIComponent(clean);
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&tl=ja&client=tw-ob&q=${encoded}`;
      const audio = new Audio(url);
      audio.play().catch(err => {
        console.warn("Google TTS direct playback prevented, falling back:", err);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const u = new SpeechSynthesisUtterance(clean);
          u.lang = 'ja-JP';
          u.rate = 0.88;
          window.speechSynthesis.speak(u);
        }
      });
    } catch (e) {
      if ('speechSynthesis' in window) {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'ja-JP';
        window.speechSynthesis.speak(u);
      }
    }
  };
})();
