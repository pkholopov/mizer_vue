<template>
  <button @click="toggleMode" class="bg-gray-200 dark:bg-gray-700 font-bold py-2 px-4 rounded dark:text-gray-300">{{ title }}</button>
</template>

<script setup>
import { ref } from 'vue';

const title = ref('Темная тема')

const toggleMode = () => {
  if (document.body.classList.contains('dark')) {
    document.body.classList.remove('dark')
    title.value = 'Темная тема'
  } else {
    document.body.classList.add('dark')
    title.value = 'Светлая тема'
  }
}
</script>
