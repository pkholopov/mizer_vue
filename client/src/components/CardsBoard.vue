<template>
  <div class="flex flex-row justify-center h-fit w-full">
    <Card v-for="card in cards" :key="card.id" :rank="card.rank" :suit="card.suit" @click="$emit('turn', card)" class="mx-2 w-[100px] cursor-pointer"></Card>
  </div>
</template>

<script setup>
import Card from './Card.vue';
defineProps({
  cards: Array
})
</script>
