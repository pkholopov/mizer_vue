<template>
  <div class="h-screen flex justify-center items-center dark:bg-gray-900 dark:text-gray-200">
    <!-- <div class="absolute top-1 left-1">{{ player.name }}</div>  -->
    <ScoreBoard :players="players" class="absolute top-1" />
    <RoundScore v-if="!game.isGameStarted && game.gameCounter > 0" :players="players" class="absolute top-1 left-1" />
    <DiscardPile :cards="game.discardPile" class="absolute left-1"/>
    <ReadyButton v-if="!player.ready" @ready="playerReady"/>
    <p v-if="player.ready && waitingForPlayers" class="text-xl absolute top-[50%] left-[50%] -translate-x-[50%] translate-y-[-50%]">Ожидаем игроков</p>
    <WidowRequest v-if="game.isPrep && player.ready" :turn="player.turn" @accept="game.acceptWidow" @reject="rejectWidow"/>
    <GameBoard v-if="!game.isPrep && player.ready" :cards="game.cardsInGame" />
    <WidowBoard v-if="discardedWidow.length" :cards="discardedWidow" class="absolute right-1"/>
    <CardsBoard :cards="game.playerCards" @turn="turn" class="absolute bottom-1"/>
  </div>
</template>

<script setup>
import ScoreBoard from '../components/ScoreBoard.vue'
import RoundScore from '../components/RoundScore.vue'
import DiscardPile from '../components/DiscardPile.vue'
import ReadyButton from '../components/ReadyButton.vue'
import WidowRequest from '../components/WidowRequest.vue'
import GameBoard from '../components/GameBoard.vue'
import WidowBoard from '../components/WidowBoard.vue'
import CardsBoard from '../components/CardsBoard.vue'

import { usePlayerStore } from '@/stores/player';
import { useGameStore } from '@/stores/game'
import { socket } from '@/utils/socket';
import { ref, computed, onMounted } from 'vue';

const player = usePlayerStore();
const game = useGameStore();
const players = ref([])
const discardedWidow = ref([])

const waitingForPlayers = computed(() => (players.value.length < 3 || !players.value.every(p => p.ready)));

game.bindEvents()

const playerReady = () => {
  player.playerReady()
  game.playerReady()
  discardedWidow.value = []
  game.updateDiscardPile([])
}

socket.on('players_list:update', (data) => {
  players.value = data
  player.updatePlayer(data.find(p => p.id == player.id))
})

const rejectWidow = () => {
  socket.emit('player:rejectWidow')
}

const turn = (card) => {
  if(game.drop) {
    discardedWidow.value.push(card)
    if(discardedWidow.value.length === 2) {
      player.widow = discardedWidow.value
      game.discardWidow(discardedWidow.value)
      return
    }
    return
  }
  if(!player.turn) {
    alert('Ход другого игрока')
    return
  }
  card.playerId = player.id
  socket.emit('game:turn', card)
  socket.emit('players:getAll')
}

onMounted(() => {
  socket.emit('players:getAll')
})
</script>
