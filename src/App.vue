<template>
  <div id="app">
    <GameStartDialog />
    <GameBoard />
    <GameOverDialog />
  </div>
</template>

<script>
import GameStartDialog from './components/GameStartDialog.vue';
import GameBoard from './components/GameBoard.vue';
import GameOverDialog from './components/GameOverDialog.vue';

export default {
  name: 'App',
  components: {
    GameStartDialog,
    GameBoard,
    GameOverDialog,
  },
  created() {
    this.$store.dispatch('getDictionary');
  },
};
</script>

<style lang="scss">
body{
  margin: 0;
  padding: 0;
  font-size: 16px;
  line-height: 1.5;
  height: 100vh;
  background: url('~@/assets/background-screen.png') no-repeat bottom, url('~@/assets/background-clouds.png') no-repeat top #46aaff;
  transition: background-color 2s;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

dialog{
  position: fixed;
  top: 50%;
  transform: translate(0, -50%);
}

.btn{
  padding: 12px 50px;
  cursor: pointer;
  border-radius: 3px;
  display: inline-block;
  min-width: 250px;
  border: none;
  color: #fff;
  margin-bottom: 25px;
  box-shadow: 0 0 10px rgba(255,255,255,0.2);
  font-size: 18px;
  background-color: #0074d9;
}
.btn-orange{
  background: orange;
}
.btn-red{
  background: red;
}
.btn-block{
  display: block;
  margin: 15px auto;
}
.add-score-form input{
  padding: 9px;
  font-size: 18px;
}
</style>
