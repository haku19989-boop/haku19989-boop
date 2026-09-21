/**
 * User Progress & Gamification Manager
 * Manages lesson completion, stage unlocking, and comprehensive vocabulary bookmarks.
 * Synchronized with auth.js (per-user storage).
 */
(function() {
  class ProgressManager {
    constructor() {
      this.listeners = [];
      this.init();
      
      if (window.AppAuth) {
        window.AppAuth.onAuthStateChanged(() => {
          this.init();
        });
      }
    }

    getStorageKey() {
      const user = window.AppAuth ? window.AppAuth.getCurrentUser() : null;
      return user ? `jlpt_progress_${user.id}` : 'jlpt_progress_guest';
    }

    init() {
      const key = this.getStorageKey();
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          this.data = JSON.parse(raw);
        } catch(e) {
          this.data = this.getDefaultData();
        }
      } else {
        this.data = this.getDefaultData();
      }
      this.notify();
    }

    getDefaultData() {
      return {
        completedLessons: [], // ['stage1-lesson1', 'stage1-lesson2', ...]
        unlockedStages: [1, 2, 3], // Default unlocked stages
        allUnlocked: true, // Default to accessible for easy exploration
        savedVocab: [], // [{ word, reading, meaning, level, addedAt }]
        points: 0
      };
    }

    save() {
      const key = this.getStorageKey();
      localStorage.setItem(key, JSON.stringify(this.data));
      this.notify();
    }

    onProgressChanged(cb) {
      if (typeof cb === 'function') {
        this.listeners.push(cb);
        cb(this.data);
      }
    }

    notify() {
      this.listeners.forEach(cb => {
        try { cb(this.data); } catch(e) { console.error(e); }
      });
    }

    // --- Lessons Completion ---
    isLessonCompleted(lessonId) {
      return (this.data.completedLessons || []).includes(lessonId);
    }

    toggleLessonCompleted(lessonId) {
      const list = this.data.completedLessons || [];
      const idx = list.indexOf(lessonId);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        list.push(lessonId);
      }
      this.data.completedLessons = list;
      this.save();
      return this.isLessonCompleted(lessonId);
    }

    getCompletedLessonsCount() {
      return (this.data.completedLessons || []).length;
    }

    // --- Stages Unlocking ---
    isStageUnlocked(stageNum) {
      if (this.data.allUnlocked) return true;
      return (this.data.unlockedStages || [1]).includes(Number(stageNum));
    }

    toggleStageUnlocked(stageNum) {
      const num = Number(stageNum);
      const list = this.data.unlockedStages || [1];
      const idx = list.indexOf(num);
      if (idx >= 0) {
        if (list.length > 1) list.splice(idx, 1);
      } else {
        list.push(num);
      }
      this.data.unlockedStages = list;
      this.save();
      return this.isStageUnlocked(stageNum);
    }

    setAllUnlocked(bool) {
      this.data.allUnlocked = !!bool;
      this.save();
    }

    isAllUnlocked() {
      return !!this.data.allUnlocked;
    }

    // --- Saved Vocabulary (Global Vocab Bookmark) ---
    getSavedVocabList() {
      return this.data.savedVocab || [];
    }

    isVocabSaved(word) {
      return (this.data.savedVocab || []).some(v => v.word === word);
    }

    toggleSaveVocab(vocabItem) {
      const list = this.data.savedVocab || [];
      const wordKey = vocabItem.word || vocabItem.text || '';
      const idx = list.findIndex(v => v.word === wordKey);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        let meaningStr = vocabItem.meaning || '';
        if (!meaningStr && Array.isArray(vocabItem.meanings)) {
          meaningStr = vocabItem.meanings.join(', ');
        }
        list.unshift({
          word: wordKey,
          reading: vocabItem.reading || vocabItem.kana || '',
          meaning: meaningStr,
          level: vocabItem.level || '表現',
          addedAt: new Date().toISOString()
        });
      }
      this.data.savedVocab = list;
      this.save();
      return this.isVocabSaved(wordKey);
    }

    removeSavedVocab(word) {
      const list = this.data.savedVocab || [];
      this.data.savedVocab = list.filter(v => v.word !== word);
      this.save();
    }

    clearSavedVocab() {
      this.data.savedVocab = [];
      this.save();
    }

    // --- Points (Placeholder for future gamification rules) ---
    getPoints() {
      return this.data.points || 0;
    }

    addPoints(pt) {
      this.data.points = (this.data.points || 0) + Number(pt);
      this.save();
    }
  }

  window.UserProgress = new ProgressManager();
})();
