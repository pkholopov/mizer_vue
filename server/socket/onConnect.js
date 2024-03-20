import { gameHandler } from "./handlers/game.handler.js"
import { playerHandler } from "./handlers/player.handler.js"

export const onConnect = (io, socket) => {
  playerHandler(io, socket)
  gameHandler(io, socket)
}
