<template>
  <dialog v-if="gameOver" id="dialog-game-over" class="site-dialog">
    <header class="dialog-header">
      <h1>Game over</h1>
    </header>
    <div class="dialog-content">
      <p>Your score:</p>
      <p class="scoreboard-score">{{ score }}</p>
      <p>Press any key to start again</p>
    </div>
  </dialog>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  watch: {
    gameOver: function (val) {
      if (val === true){
        setTimeout(function(){
          document.querySelector('#dialog-game-over').showModal();
        }, 200)  
        
      }
    }
  },
  computed: {
    gameOver: function() {
      return this.$store.state.gameOver;
    },
    score: function() {
      return this.$store.state.score;
    }
  },
  methods: {
    startAgain: function(){
      this.$store.commit('resetGame');
    }
  },
};
</script>

<style lang="scss" scoped>
.site-dialog {
  overflow: hidden;
  width: 95%;
  max-width: 640px;
  padding: 0;
  border-width: 0;
  border-radius: 5px;
  background: transparent;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.3);
  background: url('~@/assets/board.png') no-repeat;
  background-size: 100%;
  height: 610px;
}
.site-dialog::backdrop, dialog + .backdrop{
  background: rgba(255,255,255,0.5);
  text-align: center;
}
.site-dialog h1 {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
  padding-top: 25px;
  font-weight: normal;
  margin: 0;
  color: #fff;
}
.site-dialog img{
  margin-top: 25px;
  max-height: 170px;
}
.site-dialog p {
  font-size: 18px;
  color: #fff;
}
.site-dialog .dialog-header {
  text-align: center;
  padding-top: 20px;
}
.site-dialog .dialog-content {
  padding: 15px 45px 30px;
  text-align: center;
  color: #555;
}
.site-dialog .dialog-content p:last-of-type,
.site-dialog .dialog-content p:only-child {
  margin-top: 0;
  margin-bottom: 0;
}
</style>
