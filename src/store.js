import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    gameStarted: false,
    gameOver: false,
    difficulty: null,
    dictionary: null,
    dictionarySize: 0,
    currentWord: "",
    currentDesc: "",
    message: "",
    messageClass: "good",
    currentWordLength: 0,
    currentCharacter: 0,
    streak: 0,
    score: 0,
    wordCount: 0,
    timeLeft: 0,
    timer: 45,
    dPenalty: 0,
    dMultiplier: 0,
    dBonus: 0,
    dTimeFreeze: 0,
    dStreak: 0,
    explosion: false,
    superPowerFreeze: false,
    superPowerDouble: false,
    timerInterval: null,
    superPowerInterval: null
  },
  getters: {
    getField: (state, field) => {
      return state[field];
    }
  },
  mutations: {
    setField: function(state, data) {
      state[data[0]] = data[1];
    },
    startGame: function(state, data) {
      state.difficulty = data;
      state.gameStarted = true;

      // Set difficulty
      switch (data) {
        case 'insane':
          state.timer = 15;
          state.dPenalty = 15;
          state.dMultiplier = 6;
          state.dBonus = 1.5;
          state.dTimeFreeze = 1500;
          state.dStreak = 8;
          break;
        
        case 'average':
          state.timer = 30;
          state.dPenalty = 10;
          state.dMultiplier = 4;
          state.dBonus = 2;
          state.dTimeFreeze = 3000;
          state.dStreak = 6;
          break;

        case 'easy':
          state.timer = 45;
          state.dPenalty = 5;
          state.dMultiplier = 2;
          state.dBonus = 3;
          state.dTimeFreeze = 5000;
          state.dStreak = 5;
          break;
      }

      // Start the timer
      state.timerInterval = setInterval(function(){
        if(state.timer > 0){
          state.timer--;
        } else {
          state.gameStarted = false;
          state.gameOver = true;
        }
      }, 1000);

      // Get first word from the dictionary
      let number = Math.floor(Math.random() * state.dictionarySize);
      state.currentWord = Object.keys(state.dictionary)[number];
      let words = Object.keys(state.dictionary).map(function(number) {
        return state.dictionary[number];
      });
      state.currentDesc = words[number];
    },
    badWord (state) {
      state.timer = state.timer - state.dPenalty;
      state.streak = 0;
      state.currentCharacter = 0;
      state.superPowerFreeze = false;
      state.superPowerDouble = false;

      clearTimeout(state.messageTimeout);
      state.message = '<p>-' + state.dPenalty + 's</p>';
      state.messageClass = "bad";
      state.messageTimeout = setTimeout(function() {
        state.message = '';
      }, 2000);
    },
    correctWord (state) {
      state.currentCharacter = 0;
      state.wordCount++;

      let time = parseInt(state.currentWord.length / state.dMultiplier) + 1;
      state.timer = state.timer + time;

      let points = 0;
      if (state.superPowerDouble) {
        points = parseInt(state.currentWord.length / state.dMultiplier) * 400;
      } else {
        points = parseInt(state.currentWord.length / state.dMultiplier) * 200;
      }
      state.score = points + state.score;

      state.streak++;

      clearTimeout(state.messageTimeout);
      state.message = '<p>+' + points + ' points, +' + time + 's</p>';
      state.messageClass = "good";
      state.messageTimeout = setTimeout(function() {
        state.message = '';
      }, 2000);

      if (state.streak === state.dStreak) {
        let number = Math.floor(Math.random() * 3);
        state.streak = 0;

        

        // Explosion effect
        state.explosion = true;

        setTimeout(function() {
          state.explosion = false;
        }, 1000)

        if (number == 1) {
          state.superPowerDouble = true;
          clearTimeout(state.superPowerInterval);

          // For limited time add bonus points to score
          state.superPowerInterval = setTimeout(function() {
            state.superPowerDouble = false;
          }, state.dTimeFreeze);
        } else {
          state.superPowerFreeze = true;
          clearInterval(state.timerInterval);
          clearTimeout(state.superPowerInterval);

           // Freeze timer for a while
          state.superPowerInterval = setTimeout(function() {
            state.timerInterval = setInterval(function(){
              if(state.timer > 0){
                state.timer--;
              } else {
                state.gameStarted = false;
                state.gameOver = true;
              }
            }, 1000);
            state.superPowerFreeze = false;
          }, state.dTimeFreeze);
        }
      }
    },
    nextWord (state) {
      let number = Math.floor(Math.random() * state.dictionarySize);
      state.currentWord = Object.keys(state.dictionary)[number];
      let words = Object.keys(state.dictionary).map(function(number) {
        return state.dictionary[number];
      });
      state.currentDesc = words[number];
    }
  },
  actions: {
    getDictionary (context) {
      fetch('./dictionary.json').then(function(res) {
        res.json().then(function(data) {
          context.commit('setField', ['dictionary', data]);
          context.commit('setField', ['dictionarySize', Object.keys(data).length]);
        });
      });
    }
  },
});
