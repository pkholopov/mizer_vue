<template>
  <div>
    <div v-for="pile in cards" class="relative flex flex-row justify-center my-2 hover:scale-150 hover:z-10 origin-left transition duration-500">
      <Card v-for="card in pile" :key="card.id" :rank="card.rank" :suit="card.suit" class="mx-1 w-[50px]"></Card>
    </div>
  </div>
</template>

<script setup>
import Card from './Card.vue';
defineProps({
  cards: Array
})
</script>
