import {cardsDeck} from './cardsDeck.js'

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const strongestCard = (cards) => {
  let array = [...cards]
  if (array.some((el) => el.trump)) {
    return array.sort((a, b) => b.trumpStrength - a.trumpStrength)[0]
  } else {
    let firstCard = array[0];
    return array
      .filter((el) => el.suitId === firstCard.suitId)
      .sort((a, b) => b.rankId - a.rankId)[0]
  }
}

export const game = {
  players: [],
  widow: [],
  cardsInGame: [],
  discardPile: [],
  gameCounter: 0,
  firstTurnPlayer: 0,
  currentTurnPlayer: 0,
  widowRejectCounter: 0,
  scoreMultiplier: 1,

  isGameStarted: false,
  isPrep: false,
  isWidowTaken: false,
  isTurn: false,

  addPlayer(player) {
    if(this.players.length === 0) {
      player.turn = true
    }
    this.players.push(player)
  },

  removePlayer(playerId) {
    const index = this.players.findIndex(player => player.id === playerId)
    this.players.splice(index, 1)
  },

  dealCards() {
    const shuffledDeck = shuffle(cardsDeck)
    this.players.forEach((player, index) => {
      player.cards = shuffledDeck
        .slice(10 * index, 10 * index + 10)
        .sort((a, b) => b.suitId - a.suitId)
        .sort((a, b) => b.trumpStrength - a.trumpStrength);
    })
    this.widow = shuffledDeck.slice(30);
  },

  playerReady(playerId) {
    const player = this.players.find(player => player.id === playerId)
    player.ready = true
    if(this.checkAllPlayersReady() && this.players.length === 3) {
      this.startGame()
    }
  },

  checkAllPlayersReady() {
    return this.players.every(player => player.ready)
  },

  startGame() {
    this.isGameStarted = true
    this.isPrep = true
    this.dealCards()
    this.players.forEach(player => player.roundScore = 0)
    this.currentTurnPlayer = this.firstTurnPlayer
    this.changeTurn()
  },

  changeTurn() {
    this.players.forEach(player => player.turn = false)
    this.players[this.currentTurnPlayer].turn = true
  },
  
  takeWidow(playerId) {
    const player = this.players.find(player => player.id === playerId)
    const playerIndex = this.players.findIndex(player => player.id === playerId)
    player.cards = player.cards.concat(this.widow)
    player.isWidow = true
    this.isWidowTaken = true
    this.currentTurnPlayer = playerIndex
    this.changeTurn()
  },

  dropWidow(playerId, cards) {
    const player = this.players.find(player => player.id === playerId)
    player.roundScore += cards.reduce((acc, card) => acc + card.score, 0)
    player.cards = player.cards.filter(card => !cards.some(c => c.id === card.id))
    .sort((a, b) => b.suitId - a.suitId)
    .sort((a, b) => b.trumpStrength - a.trumpStrength);
    this.isPrep = false
  },

  turn(card) {
    this.isTurn = true
    this.cardsInGame.push(card)
    const turnPlayer = this.players.find(player => player.id === card.playerId)
    const cardIndex = turnPlayer.cards.findIndex(c => c.id === card.id)
    this.currentTurnPlayer = (this.currentTurnPlayer + 1) % 3
    this.changeTurn()
    turnPlayer.cards.splice(cardIndex, 1)
    if(this.cardsInGame.length === 3) {
      this.discardPile.push([...this.cardsInGame])
      const winPlayerId = strongestCard(this.cardsInGame).playerId
      const winPlayerIndex = this.players.findIndex(player => player.id === winPlayerId)
      this.currentTurnPlayer = winPlayerIndex
      this.changeTurn()
      this.players[winPlayerIndex].roundScore += this.cardsInGame.reduce((acc, card) => acc + card.score, 0)
      this.cardsInGame.length = 0;
      this.isTurn = false
      if(this.players.every(player => player.cards.length === 0)) {
        this.stopGame()
      }
    }
  },

  stopGame() {
    this.isGameStarted = false
    this.gameCounter += 1
    this.players.forEach(player => player.ready = false)
    this.firstTurnPlayer = (this.firstTurnPlayer + 1) % 3
    this.scoreCounter()
    this.discardPile = []
  },

  scoreCounter() {
    if(this.isWidowTaken) {
      const playerWithWidow = this.players.find(player => player.isWidow)
      const playersWithoutWidow = this.players.filter(player => !player.isWidow)
      if(playerWithWidow.roundScore < 30) {
        playerWithWidow.gameScore += 4 * this.scoreMultiplier
        this.scoreMultiplier = 1
      } else if(playerWithWidow.roundScore < 60) {
        playerWithWidow.gameScore += 2 * this.scoreMultiplier
        this.scoreMultiplier = 1
      } else if(playerWithWidow.roundScore === 60) {
        this.scoreMultiplier *= 2
      } else if(playerWithWidow.roundScore > 90) {
        playersWithoutWidow.forEach(player => player.gameScore += 4 * this.scoreMultiplier)
        this.scoreMultiplier = 1
      } else {
        playersWithoutWidow.forEach(player => player.gameScore += 2 * this.scoreMultiplier)
        this.scoreMultiplier = 1
      }
    } else {
      if(this.players.every(player => player.roundScore === 40)) {
        this.scoreMultiplier *= 2
      } else {
        const sortedByScore = [...this.players].sort((a, b) => b.roundScore - a.roundScore)
        if(sortedByScore[1].roundScore === sortedByScore[2].roundScore) {
          sortedByScore[0].gameScore += 2 * this.scoreMultiplier
        } else {
          sortedByScore[0].gameScore += 4 * this.scoreMultiplier
          sortedByScore[1].gameScore += 2 * this.scoreMultiplier
        }
        this.scoreMultiplier = 1
      }
    }
  }
}
