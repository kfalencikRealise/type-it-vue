<template>
  <div v-if="state.gameStarted" id="gameboard">
    <div class="game-word">
      <div class="current-word">
        {{ state.currentWord }}
      </div>
    </div>
    <div class="game-stats">
      <div :class="{'stat': true, 'frozen': state.superPowerFreeze}"><span class="timer">{{ state.timer }}</span> seconds</div>
      <div class="stat"><span class="score">{{ state.score }}</span></div>
      <div class="stat"><span class="words">{{ state.wordCount }}</span></div>
    </div>
    <div class="game-messages">
      <div v-if="state.message != ''" :class="'message ' + state.messageClass" v-html="state.message"></div>
    </div>
    <div class="game-effects" v-if="state.explosion">
      <div v-for="(star, i) in 20" :key="i" class="particle"></div>
    </div>
    <div class="game-stars">
      <div v-for="(star, i) in state.streak" :key="i" class="streak-star"></div>
    </div>
    <div class="game-typing">
      <div v-for="(x,i) in state.currentWord.length" :key="i" class="text-input">
        <input type="text" :character="i" :disabled="{'disabled': i < state.currentCharacter}" :class="{'good': i < state.currentCharacter}" :value="currentWordLetters[i]" />
      </div>
    </div>
    <div class="game-word-description">
      <div class="current-word-desc">{{ state.currentDesc }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentWordLetters: []
    }
  },
  mounted() {
    const self = this;
    document.addEventListener('keyup', function(e) {
      let key = e.key;
      let color = '';

      if(key != 13 && key != 'return' && key != 'Enter') {
        self.checkLetter(key);
      }

      setInterval(function() {
        if (self.state.timer <= 80) {
          color = '#46aaff';
        }
        if (self.state.timer <= 60) {
          color = '#99b7d0';
        }
        if (self.state.timer <= 40) {
          color = '#ffad16';
        }
        if (self.state.timer <= 20) {
          color = '#fd5e22';
        }
        if (self.state.timer <= 10) {
          color = '#ef3434';
        }

        document.querySelector('body').style.backgroundColor = color;
      }, 200);
    });
  },
  computed: {
    state: function() {
      return this.$store.state;
    }
  },
  methods: {
    checkLetter: function(key) {
      if (key.toLowerCase() === this.state.currentWord.split("")[this.state.currentCharacter].toLowerCase()) {
        this.currentWordLetters.push(key);
        this.goodLetter();
      } else {
        this.badLetter();
      }
    },
    goodLetter: function() {
      if (this.state.currentCharacter + 1 === this.state.currentWord.length) {
        this.correctWord();
      } else {
        this.$store.commit('setField', ['currentCharacter', this.state.currentCharacter + 1]);
      }
    },
    badLetter: function() {
      this.$store.commit('badWord');
      this.$store.commit('nextWord');
      this.currentWordLetters = [];
    },
    correctWord: function() {
      this.$store.commit('correctWord');
      this.$store.commit('nextWord');
      this.currentWordLetters = [];
    }
  },
};
</script>

<style lang="scss" scoped>
#gameboard{
  max-width: 1200px;
  margin: 0 auto;
  width: 80%;

  .current-word{
    font-family: Pangolin, sans-serif;
    font-size: 32px;
    text-align: center;
    background: url('~@/assets/top-board.png') no-repeat top;
    margin-bottom: 50px;
    height: 105px;
    color: #61290d;
    line-height: 120px;
  }

  .game-word-description{
    background: url('~@/assets/word-description.png');
    max-width: 700px;
    min-height: 125px;
    padding: 20px 60px;
    font-weight: bold;
    background-size: 100%;
    color: #61290d;
    text-align: center;
    margin: 100px auto;
  }

  .game-messages{
    text-align: center;
    position: absolute;
    top: 50px;
    right: 100px;

    .message{
      font-weight: bold;
      color: #045404;
      width: 200px;
      height: 85px;
      line-height: 85px;
      text-align: center;
      background: url('~@/assets/message-good.png');
      background-size: 100%;
    }

    .message.bad{
      color: #000;
      background: url('~@/assets/message-bad.png');
      background-size: 100%;
    }

    .message.game-over{
      color: #000;
      line-height: 125px;
      width: 300px;
      height: 125px;
      background: url('~@/assets/message-game-over.png');
      background-size: 100%;
    }
  }

  .game-typing{
    text-align: center;
    margin: 75px auto 0;
  }
  .text-input{
    display: inline-block;
  }
  .text-input input{
    display: inline-block;
    background: url('~@/assets/input-empty.png');
    background-size: 100%;
    width: 50px;
    border-radius: 100%;
    color: #fff;
    height: 48px;
    border: none;
    font-size: 26px;
    font-family: Pangolin, sans-serif;
    text-align: center;
    margin: 0 5px;
    text-transform: uppercase;
  }
  .text-input input.good{
    background: url('~@/assets/input-good.png');
    background-size: 100%;
  }
  .text-input input.bad{
    background: url('~@/assets/input-bad.png');
    background-size: 100%;
  }

  .game-stars{
    text-align: center;
    height: 50px;
    width: 500px;
    margin: 0 auto;
  }
  .game-stars .streak-star{
    display: inline-block;
    background: url('~@/assets/streak-star.png') no-repeat;
    width: 50px;
    height: 50px;
    background-size: 100%;
  }

  .game-instruction{
    font-size: 32px;
  }

  .superpower{
    font-weight: bold;
    font-size: 18px;
    width: 365px;
    height: 75px;
    background-size: 100%;
    color: #fff;
    line-height: 100px;
    margin-left: -180px;
    position: absolute;
    display: inline-block;
    background: url('~@/assets/superpower.png') no-repeat center top;
    animation: fadein 1s 1;
  }

  @keyframes fadein{
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }

  .game-stats{
    position: absolute;
    top: 50px;
    left: 100px;
  }
  .game-stats .stat{
    height: 80px;
    width: 150px;
    color: #61290d;
    font-weight: bold;
    font-size: 22px;
    padding-left: 105px;
    line-height: 76px;
    margin-bottom: 25px;
    transition: .5s;
  }

  .game-stats .stat:nth-child(1){
    background: url('~@/assets/timer.png') no-repeat;
  }
  .game-stats .stat.frozen:nth-child(1){
    background: url('~@/assets/timer-frost.png') no-repeat;
  }
  .game-stats .stat:nth-child(2){
    background: url('~@/assets/points.png') no-repeat;
  }
  .game-stats .stat:nth-child(3){
    background: url('~@/assets/word-count.png') no-repeat;
  }

  .game-effects{
    position: relative;
    width: 200px;
    margin: 0 auto;
  }

  .particle {
    position: absolute;
    width: 35px;
    background: url('~@/assets/streak-star.png') no-repeat;
    background-size: 100%;
    height: 35px;
    border-radius: 50%;
    opacity: 0;
  }

  @for $i from 1 to 20 {
      .particle:nth-child(#{$i}) { 
        animation: pop .5s reverse forwards;
        animation-delay: $i * 0.02s; 
        left: random(100) + px;
        top: random(200) + px;
      }
    }

  @keyframes pop {
    from {
      opacity: 0;
    }
    to {
      top: random(400) / 100 * 100%;
      left: random(100) / 100 * 100%;
      opacity: .75;
    }
  }
}
</style>