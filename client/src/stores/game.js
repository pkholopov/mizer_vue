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
  const isWidowTaken = ref(false)
  const discardedWidow = ref([])
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

  const updateGame = (gameStatus) => {
    cardsInGame.value = gameStatus.cardsInGame
    discardPile.value = gameStatus.discardPile
    gameCounter.value = gameStatus.gameCounter
    isGameStarted.value = gameStatus.isGameStarted
    isPrep.value = gameStatus.isPrep
    isWidowTaken.value = gameStatus.isWidowTaken
  }

  const bindEvents = () => {

    socket.on('game:updatePlayerCards', ({cards, widow}) => {
      playerCards.value = cards
      discardedWidow.value = widow
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

    socket.on('game:status', (gameStatus) => {
      updateGame(gameStatus)
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
    isWidowTaken,
    discardedWidow,
    drop,
    getCards,
    playerReady,
    updateDiscardPile,
    acceptWidow,
    discardWidow,
    bindEvents
  }
})


