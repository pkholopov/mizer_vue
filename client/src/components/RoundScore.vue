<template>
  <div class="flex flex-col justify-center bg-gray-200 dark:bg-gray-700">
    <div v-for="player in players" :key="player.id" class="text-center mx-8">
      <ul>
        <li class="text-xl" >{{ player.name }}</li>
        <li>Баллы за игру: {{ player.gameScore }}</li>
        <li>Очков за раунд: {{ player.roundScore }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
defineProps({
  players: Array
})
</script>
