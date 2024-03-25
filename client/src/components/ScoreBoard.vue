<template>
  <div class="flex flex-col h-fit w-full pb-2 justify-center items-center">
    <div class="flex flex-row justify-center w-full p-2 border-b">
      <div v-for="player in players" :key="player.id" class="text-center mx-8" :class="{'bg-emerald-100 dark:text-gray-800': player.turn}">
        <ul>
          <li class="text-3xl" :class="player.ready ? 'text-emerald-500' : 'text-red-500'">{{ player.name }}</li>
          <li>Баллы за игру: {{ player.gameScore }}</li>
        </ul>
      </div>
    </div>
    <div class="text-2xl bg-gray-100 dark:bg-gray-700 w-full text-center p-1">Ход игрока {{ players[players.findIndex(player => player.turn)]?.name }}</div>
  </div>
</template>

<script setup>
defineProps({
  players: Array
})
</script>
