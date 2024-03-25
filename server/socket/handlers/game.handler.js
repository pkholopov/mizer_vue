import { game } from "../../game.js"

export const gameHandler = (io, socket) => {
  
  const updateCards = (playerId) => {
    const player = game.players.find(player => player.id === playerId)
    socket.emit('game:updatePlayerCards', {cards: player.cards, widow: player.discardedWidow})
  }

  const updateGameStatus = () => {
    socket.emit('game:status', {
      cardsInGame: game.cardsInGame,
      discardPile: game.discardPile,
      gameCounter: game.gameCounter,
      isGameStarted: game.isGameStarted,
      isPrep: game.isPrep,
      isWidowTaken: game.isWidowTaken,
      
    })
  }

  socket.on('game:statusUpdate', () => {
    updateGameStatus()
  })

  socket.on('game:playerReady',() => {
    if(game.isGameStarted) {
      io.emit('game:start')
    }
  })

  socket.on('game:getPlayerCards', (playerId) => {
    updateCards(playerId)
  })

  socket.on('game:acceptWidow', (playerId) => {
    game.takeWidow(playerId)
    updateCards(playerId)
  })

  socket.on('game:dropWidow', (payload) => {
    const {playerId, cards} = payload
    game.dropWidow(playerId, cards)
    updateCards(playerId)
    io.emit('game:prepEnd')
  })

  socket.on('game:turn', (card) => {
    game.turn(card)
    io.emit('game:updateGameCards', game.cardsInGame)
    updateCards(card.playerId)
    if(!game.isTurn) {
      io.emit('game:turnEnd', game.discardPile)
    }
    if(!game.isGameStarted) {
      io.emit('game:stop', game.gameCounter)
    }
  })
}
