/**
 * かん字れんしゅうシート データベース
 * 準拠: https://newslin-design.github.io/nihonngo/sheet.html?id=n4-01
 */

window.KANJI_DB = {
  // --- N4 ① 質・問・答・題 ---
  "質": {
    strokes: 15,
    yomi: "シツ",
    examples: [
      { w: "質問", r: "しつもん" },
      { w: "品質", r: "ひんしつ" },
      { w: "人質", r: "ひとじち" }
    ]
  },
  "問": {
    strokes: 11,
    yomi: "モン・とう",
    examples: [
      { w: "質問", r: "しつもん" },
      { w: "問題", r: "もんだい" },
      { w: "問い合せ", r: "といあわせ" }
    ]
  },
  "答": {
    strokes: 12,
    yomi: "トウ・こたえる",
    examples: [
      { w: "答え", r: "こたえ" },
      { w: "回答", r: "かいとう" },
      { w: "解答", r: "かいとう" }
    ]
  },
  "題": {
    strokes: 18,
    yomi: "ダイ",
    examples: [
      { w: "問題", r: "もんだい" },
      { w: "宿題", r: "しゅくだい" },
      { w: "題名", r: "だいめい" }
    ]
  },

  // --- N4 ② 医・者・病・院 ---
  "医": {
    strokes: 7,
    yomi: "イ",
    examples: [
      { w: "医者", r: "いしゃ" },
      { w: "医学", r: "いがく" },
      { w: "医院", r: "いいん" }
    ]
  },
  "者": {
    strokes: 8,
    yomi: "シャ・もの",
    examples: [
      { w: "医者", r: "いしゃ" },
      { w: "学者", r: "がくしゃ" },
      { w: "若者", r: "わかもの" }
    ]
  },
  "病": {
    strokes: 10,
    yomi: "ビョウ・やまい",
    examples: [
      { w: "病院", r: "びょういん" },
      { w: "病気", r: "びょうき" }
    ]
  },
  "院": {
    strokes: 10,
    yomi: "イン",
    examples: [
      { w: "病院", r: "びょういん" },
      { w: "入院", r: "にゅういん" },
      { w: "大学院", r: "だいがくいん" }
    ]
  },

  // --- N5 ① 日・月・火・水 ---
  "日": {
    strokes: 4,
    yomi: "ニチ・ジツ・ひ・か",
    examples: [
      { w: "日曜日", r: "にちようび" },
      { w: "日本", r: "にほん" },
      { w: "今日", r: "きょう" }
    ]
  },
  "月": {
    strokes: 4,
    yomi: "ゲツ・ガツ・つき",
    examples: [
      { w: "月曜日", r: "げつようび" },
      { w: "一月", r: "いちがつ" },
      { w: "今月", r: "こんげつ" }
    ]
  },
  "火": {
    strokes: 4,
    yomi: "カ・ひ",
    examples: [
      { w: "火曜日", r: "かようび" },
      { w: "火事", r: "かじ" },
      { w: "花火", r: "はなび" }
    ]
  },
  "水": {
    strokes: 4,
    yomi: "スイ・みず",
    examples: [
      { w: "水曜日", r: "すいようび" },
      { w: "お水", r: "おみず" },
      { w: "水泳", r: "すいえい" }
    ]
  },

  // --- N5 ② 人・男・女・子 ---
  "人": {
    strokes: 2,
    yomi: "ジン・ニン・ひと",
    examples: [
      { w: "日本人", r: "にほんじん" },
      { w: "三人", r: "さんにん" },
      { w: "大人", r: "おとな" }
    ]
  },
  "男": {
    strokes: 7,
    yomi: "ダン・ナン・おとこ",
    examples: [
      { w: "男の人", r: "おとこのひと" },
      { w: "男の子", r: "おとこのこ" },
      { w: "男性", r: "だんせい" }
    ]
  },
  "女": {
    strokes: 3,
    yomi: "ジョ・ニョ・おんな",
    examples: [
      { w: "女の人", r: "おんなのひと" },
      { w: "女の子", r: "おんなのこ" },
      { w: "女性", r: "じょせい" }
    ]
  },
  "子": {
    strokes: 3,
    yomi: "シ・ス・こ",
    examples: [
      { w: "子ども", r: "こども" },
      { w: "男の子", r: "おとこのこ" },
      { w: "椅子", r: "いす" }
    ]
  },

  // --- N3 ① 経・験・報・告 ---
  "経": {
    strokes: 11,
    yomi: "ケイ・へる",
    examples: [
      { w: "経験", r: "けいけん" },
      { w: "経済", r: "けいざい" },
      { w: "経営", r: "けいえい" }
    ]
  },
  "験": {
    strokes: 18,
    yomi: "ケン",
    examples: [
      { w: "試験", r: "しけん" },
      { w: "経験", r: "けいけん" },
      { w: "受験", r: "じゅけん" }
    ]
  },
  "報": {
    strokes: 12,
    yomi: "ホウ・むくいる",
    examples: [
      { w: "報告", r: "ほうこく" },
      { w: "天気予報", r: "てんきよほう" },
      { w: "情報", r: "じょうほう" }
    ]
  },
  "告": {
    strokes: 7,
    yomi: "コク・つげる",
    examples: [
      { w: "報告", r: "ほうこく" },
      { w: "広告", r: "こうこく" },
      { w: "警告", r: "けいこく" }
    ]
  }
};

window.SHEET_MANIFEST = [
  { id: "n4-01", grade: "N4", label: "N4 ① 質・問・答・題（べんきょう）", kanji: ["質", "問", "答", "題"] },
  { id: "n4-02", grade: "N4", label: "N4 ② 医・者・病・院（びょういん）", kanji: ["医", "者", "病", "院"] },
  { id: "n5-01", grade: "N5", label: "N5 ① 日・月・火・水（カレンダー）", kanji: ["日", "月", "火", "水"] },
  { id: "n5-02", grade: "N5", label: "N5 ② 人・男・女・子（かぞく・ひと）", kanji: ["人", "男", "女", "子"] },
  { id: "n3-01", grade: "N3", label: "N3 ① 経・験・報・告（ビジネス）", kanji: ["経", "験", "報", "告"] }
];

window.SHEETS_DATA = {
  "n4-01": {
    id: "n4-01",
    grade: "N4",
    label: "N4 ① 質・問・答・題",
    brand: "JLPT N4 漢字ドリル",
    kanji: ["質", "問", "答", "題"],
    scoreNote: "80点以上で合格。まちがえた漢字はもう一度書いてみましょう。",
    footer: "漢字れんしゅうシート ／ JLPT N4 ／ 質・問・答・題",
    sections: [
      {
        type: "trace",
        points: 20,
        heading: "なぞってから、じぶんで書きましょう。",
        cells: 5,
        guides: 2
      },
      {
        type: "reading",
        points: 10,
        heading: "―の読み方をひらがなで書きましょう。",
        items: [
          { text: "先生に{質問}する。", answer: "しつもん" },
          { text: "この{問題}はむずかしい。", answer: "もんだい" },
          { text: "ノートに{答え}を書く。", answer: "こたえ" },
          { text: "{宿題}をわすれた。", answer: "しゅくだい" },
          { text: "この紙は{品質}がいい。", answer: "ひんしつ" },
          { text: "アンケートに{回答}する。", answer: "かいとう" }
        ]
      },
      {
        type: "fill",
        points: 10,
        heading: "□に漢字を書きましょう。",
        items: [
          { text: "{}問があります。", hint: "しつ", answer: "質" },
          { text: "{}題をとく。", hint: "もん", answer: "問" },
          { text: "{}えを書く。", hint: "こた", answer: "答" },
          { text: "宿{}をする。", hint: "だい", answer: "題" }
        ]
      }
    ]
  },
  "n4-02": {
    id: "n4-02",
    grade: "N4",
    label: "N4 ② 医・者・病・院",
    brand: "JLPT N4 漢字ドリル",
    kanji: ["医", "者", "病", "院"],
    scoreNote: "80点以上で合格。まちがえた漢字はもう一度書いてみましょう。",
    footer: "漢字れんしゅうシート ／ JLPT N4 ／ 医・者・病・院",
    sections: [
      {
        type: "trace",
        points: 20,
        heading: "なぞってから、じぶんで書きましょう。",
        cells: 5,
        guides: 2
      },
      {
        type: "reading",
        points: 10,
        heading: "―の読み方をひらがなで書きましょう。",
        items: [
          { text: "{病院}へ行きます。", answer: "びょういん" },
          { text: "優しい{お医者さん}です。", answer: "おいしゃさん" },
          { text: "風邪の{病気}になった。", answer: "びょうき" },
          { text: "来週{退院}します。", answer: "たいいん" }
        ]
      },
      {
        type: "fill",
        points: 10,
        heading: "□に漢字を書きましょう。",
        items: [
          { text: "{}者に行く。", hint: "い", answer: "医" },
          { text: "若{}の意見。", hint: "もの", answer: "者" },
          { text: "{}気になった。", hint: "びょう", answer: "病" },
          { text: "大工{}に入る。", hint: "いん", answer: "院" }
        ]
      }
    ]
  },
  "n5-01": {
    id: "n5-01",
    grade: "N5",
    label: "N5 ① 日・月・火・水",
    brand: "JLPT N5 漢字ドリル",
    kanji: ["日", "月", "火", "水"],
    scoreNote: "80点以上で合格。きれいに書いてみましょう。",
    footer: "漢字れんしゅうシート ／ JLPT N5 ／ 日・月・火・水",
    sections: [
      {
        type: "trace",
        points: 20,
        heading: "なぞってから、じぶんで書きましょう。",
        cells: 5,
        guides: 2
      },
      {
        type: "reading",
        points: 10,
        heading: "―の読み方をひらがなで書きましょう。",
        items: [
          { text: "{日曜日}に映画を見ます。", answer: "にちようび" },
          { text: "きれいな{お月様}が出ている。", answer: "おつきさま" },
          { text: "タバコの{火}に注意する。", answer: "ひ" },
          { text: "冷たい{お水}を飲む。", answer: "おみず" }
        ]
      },
      {
        type: "fill",
        points: 10,
        heading: "□に漢字を書きましょう。",
        items: [
          { text: "{}曜日。", hint: "にち", answer: "日" },
          { text: "今{}の予定。", hint: "げつ", answer: "月" },
          { text: "花{}を見る。", hint: "び", answer: "火" },
          { text: "{}泳を習う。", hint: "すい", answer: "水" }
        ]
      }
    ]
  },
  "n5-02": {
    id: "n5-02",
    grade: "N5",
    label: "N5 ② 人・男・女・子",
    brand: "JLPT N5 漢字ドリル",
    kanji: ["人", "男", "女", "子"],
    scoreNote: "80点以上で合格。まちがえた漢字はもう一度書いてみましょう。",
    footer: "漢字れんしゅうシート ／ JLPT N5 ／ 人・男・女・子",
    sections: [
      {
        type: "trace",
        points: 20,
        heading: "なぞってから、じぶんで書きましょう。",
        cells: 5,
        guides: 2
      },
      {
        type: "reading",
        points: 10,
        heading: "―の読み方をひらがなで書きましょう。",
        items: [
          { text: "あそこに{男の人}がいる。", answer: "おとこのひと" },
          { text: "あそこに{女の人}がいる。", answer: "おんなのひと" },
          { text: "元気な{男の子}です。", answer: "おんなのこ" },
          { text: "公園で{子ども}が遊ぶ。", answer: "こども" }
        ]
      },
      {
        type: "fill",
        points: 10,
        heading: "□に漢字を書きましょう。",
        items: [
          { text: "日本{}です。", hint: "じん", answer: "人" },
          { text: "{}の人。", hint: "おとこ", answer: "男" },
          { text: "{}の人。", hint: "おんな", answer: "女" },
          { text: "椅{}に座る。", hint: "す", answer: "子" }
        ]
      }
    ]
  },
  "n3-01": {
    id: "n3-01",
    grade: "N3",
    label: "N3 ① 経・験・報・告",
    brand: "JLPT N3 漢字ドリル",
    kanji: ["経", "験", "報", "告"],
    scoreNote: "80点以上で合格。ビジネス表現をマスターしましょう。",
    footer: "漢字れんしゅうシート ／ JLPT N3 ／ 経・験・報・告",
    sections: [
      {
        type: "trace",
        points: 20,
        heading: "なぞってから、じぶんで書きましょう。",
        cells: 5,
        guides: 2
      },
      {
        type: "reading",
        points: 10,
        heading: "―の読み方をひらがなで書きましょう。",
        items: [
          { text: "仕事の{経験}をつむ。", answer: "けいけん" },
          { text: "明日は日本語の{試験}だ。", answer: "しけん" },
          { text: "上司に進捗を{報告}する。", answer: "ほうこく" },
          { text: "テレビの{天気予報}を見る。", answer: "てんきよほう" }
        ]
      },
      {
        type: "fill",
        points: 10,
        heading: "□に漢字を書きましょう。",
        items: [
          { text: "{}済学を学ぶ。", hint: "けい", answer: "経" },
          { text: "実{}を行う。", hint: "けん", answer: "験" },
          { text: "情{}を共有する。", hint: "ほう", answer: "報" },
          { text: "広{}を出す。", hint: "こく", answer: "告" }
        ]
      }
    ]
  }
};
