import { v4 as uuid } from "uuid"
import { game } from "../../game.js"

class Player {
  constructor(id, name) {
    this.id = id
    this.name = name
    this.roundScore = 0
    this.gameScore = 0
    this.cards = []
    this.ready = false
    this.turn = false
    this.isWidow = false
  }
}

export const playerHandler = (io, socket) => {

  const sanityzePlayer = (player) => {
    const {cards, ...rest} = player
    return rest
  }

  const updatePlayersList = () => {
    io.emit('players_list:update', game.players.map(player => sanityzePlayer(player)))
  }

  const updatePlayer = (id) => {
    socket.emit('player:update', game.players.find(player => player.id === id))
  }

  socket.on('players:getAll', () => {
    updatePlayersList()
  })

  let player = {}
  socket.on('player:enter', ({id, name}) => {
    if(game.players.length >= 3) {
      socket.emit('player:enterError')
      return
    }
    if(!id) {
      player = new Player(uuid(), name)
      game.addPlayer(player)
      socket.emit('player:enterSuccess', player)
    } else if(id) {
      const existingPlayer = game.players.find(player => player.id === id)
      if (existingPlayer) {
        existingPlayer.name = name
        socket.emit('player:enterSuccess', existingPlayer)
      } else {
        player = new Player(id, name)
        game.addPlayer(player)
        socket.emit('player:enterSuccess', player)
      }
    }
  })

  socket.on('player:leave', (id) => {
    game.removePlayer(id)
    socket.emit('player:leaveSuccess')
    updatePlayersList()
  })

  socket.on('player:ready', (id) => {
    game.playerReady(id)
    updatePlayer(id)
    updatePlayersList()
  })

  socket.on('player:rejectWidow', () => {
    game.currentTurnPlayer = (game.currentTurnPlayer + 1) % 3
    game.changeTurn()
    updatePlayersList()
    game.widowRejectCounter++
    if(game.widowRejectCounter === 3) {
      game.isPrep = false
      game.widowRejectCounter = 0
      io.emit('game:prepEnd')
    }
  })
}
