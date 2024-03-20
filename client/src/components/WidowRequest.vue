<template>
  <div>
    <div v-if="!turn">
      <p class="text-xl text-red-300">Ожидаем решение по прикупу от другого игрока</p>
    </div>
    <div v-else class="text-xl text-emerald-300 flex flex-col items-center justify-center">
      <div v-if="!isAccepted">
        <p>Берёшь прикуп?</p>
        <div class="flex flex-row">
          <button @click="accept" class="mr-2 bg-gray-200 dark:bg-gray-700 font-bold py-2 px-4 rounded dark:text-gray-300">Да</button>
          <button @click="$emit('reject')" class="bg-gray-200 dark:bg-gray-700 font-bold py-2 px-4 rounded dark:text-gray-300">Нет</button>
        </div>
      </div>
      <div v-else>
        <p>Скидывай две карты</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineProps({
  turn: Boolean
})
const emit = defineEmits(['accept', 'reject'])

const isAccepted = ref(false)

const accept = () => {
  isAccepted.value = true
  emit('accept')
}
</script>
