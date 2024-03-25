<template>
  <div class="flex flex-col justify-center items-center h-screen dark:bg-gray-900 dark:text-gray-200">
    <h1 class="text-3xl font-bold mb-4">Мизер</h1>
    <input type="text" placeholder="Введите имя" autofocus class="border rounded p-2 w-[300px] h-12 dark:text-gray-800" v-model="player.name">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-[300px]" @click="player.enter">Вход</button>
    <div v-if="player.enterError" class="text-xl text-red-500 mt-4">Ошибка входа. Повторите попытку (или не надо лучше)</div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePlayerStore } from '@/stores/player'

const player = usePlayerStore();

onMounted(() => {
  player.bindEvents()
})
</script>
