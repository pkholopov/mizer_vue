<template>
  <div>
    <card-t :rank :suit ></card-t>
  </div>
  
</template>

<script setup>
defineProps({
  rank: String,
  suit: String,
})

</script>

