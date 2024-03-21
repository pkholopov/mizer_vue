<template>
  <button @click="$emit('toggle')" class="bg-gray-200 dark:bg-gray-700 font-bold py-2 px-4 rounded dark:text-gray-300">{{ title }}</button>
</template>

<script setup>
import { computed, ref } from 'vue';

const prop = defineProps({
  isDark: Boolean
})

const title = computed(() => (prop.isDark ? 'Светлая тема' : 'Темная тема'))

</script>
