<template>
  <div>
    <Card v-for="card in cards" :key="card.id" :rank="card.rank" :suit="card.suit" class="mx-1 w-[60px]"></Card>
  </div>
</template>

<script setup>
import Card from './Card.vue';
defineProps({
  cards: Array
})
</script>
