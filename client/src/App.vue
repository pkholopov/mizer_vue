<template>
  <ThemeSwitcher class="absolute top-1 right-1 z-10" @toggle="toggle" :is-dark="isDark"/>
  <RouterView />
</template>

<script setup>
import ThemeSwitcher from './components/ThemeSwitcher.vue';

import { ref, onMounted, onBeforeMount } from 'vue';

const isDark = ref(false)

const toggle = () => {
  isDark.value = !isDark.value
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  setupTheme()
}

const setupTheme = () => {
  if(isDark.value) {
    document.body.classList.add('dark')
  } else {
    document.body.classList.remove('dark')
  }
}

onBeforeMount(() => {
  isDark.value = localStorage.getItem('theme') === 'dark'
})

onMounted(() => {
  setupTheme()
})
</script>
