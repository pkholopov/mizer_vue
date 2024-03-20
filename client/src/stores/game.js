import { defineStore } from 'pinia'
import { ref } from 'vue'
import { socket } from '@/utils/socket'
import { usePlayerStore } from '@/stores/player'

export const useGameStore = defineStore('game', () => {
  
  const player = usePlayerStore()
  const playerCards = ref([])
  const cardsInGame = ref([])
  const discardPile = ref([])
  const gameCounter = ref(0)
  const isGameStarted = ref(false)
  const isPrep = ref(false)
  const drop = ref(false)

  const getCards = () => {
    socket.emit('game:getPlayerCards', player.id)
  }

  const playerReady = () => {
    socket.emit('game:playerReady')
  }

  const updateDiscardPile = (cards) => {
    discardPile.value = cards
  }

  const acceptWidow = () => {
    socket.emit('game:acceptWidow', player.id)
    drop.value = true
  }

  const discardWidow = (cards) => {
    socket.emit('game:dropWidow', {playerId: player.id, cards})
    drop.value = false
    getCards()
  }

  const bindEvents = () => {

    socket.on('game:updatePlayerCards', (cards) => {
      playerCards.value = cards
    })

    socket.on('game:updateGameCards', (cards) => {
      cardsInGame.value = cards
    })

    socket.on('game:start', () => {
      getCards()
      isGameStarted.value = true
      isPrep.value = true
    })

    socket.on('game:prepEnd', () => {
      isPrep.value = false
    })

    socket.on('game:turnEnd', (pile) => {
      updateDiscardPile(pile)
      socket.emit('players:getAll')
    })

    socket.on('game:stop', (counter) => {
      isGameStarted.value = false
      gameCounter.value = counter
    })
  }
  return {
    playerCards,
    cardsInGame,
    discardPile,
    gameCounter,
    isGameStarted,
    isPrep,
    drop,
    getCards,
    playerReady,
    updateDiscardPile,
    acceptWidow,
    discardWidow,
    bindEvents
  }
})


