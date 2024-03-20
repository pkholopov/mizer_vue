<template>
  <div class="w-1/2 h-[50vh] border rounded-2xl bg-emerald-300 flex justify-center items-center">
    <div v-if="cards.length" class="flex flex-row justify-center h-fit w-full">
      <Card v-for="card in cards" :key="card.id" :rank="card.rank" :suit="card.suit"  class="mx-2 w-[100px]"></Card>
    </div>
    
  </div>
</template>

<script setup>
import Card from './Card.vue';
defineProps({
  cards: Array,
  ready: Boolean
})
</script>
