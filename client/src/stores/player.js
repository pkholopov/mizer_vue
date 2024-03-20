import { ref } from 'vue'
import { defineStore } from 'pinia'
import { socket } from '@/utils/socket'
import router from '@/router'

export const usePlayerStore = defineStore('player', () => {

  const id = ref(localStorage.getItem('id') || '')
  const name = ref('')
  const ready = ref(false)
  const turn = ref(false)
  const widow = ref([])
  const enterError = ref(false)
  
  const updatePlayer = (player) => {
    localStorage.setItem('id', player.id)
    id.value = player.id
    name.value = player.name
    ready.value = player.ready
    turn.value = player.turn
  }

  const resetPlayer = () => {
    localStorage.removeItem('id')
    id.value = ''
    name.value = ''
    ready.value = false
    turn.value = false
  }

  const enter = () => {
    socket.emit('player:enter', { id: id.value, name: name.value })
  }

  const leave = () => {
    socket.emit('player:leave', id.value)
  }

  const playerReady = () => {
    socket.emit('player:ready', id.value)
  }

  const bindEvents = () => {

    socket.on('player:enterSuccess', (player) => {
      updatePlayer(player)
      router.push({ name: 'room' })
    })

    socket.on('player:enterError', () => {
      enterError.value = true
    })

    socket.on('player:update', (player) => {
      updatePlayer(player)
    })

    socket.on('player:leaveSuccess', () => {
      resetPlayer()
    })
  }

  return { 
    id, 
    name, 
    ready,
    turn, 
    widow,
    updatePlayer, 
    resetPlayer, 
    enter, 
    leave, 
    playerReady, 
    bindEvents 
  }
})
