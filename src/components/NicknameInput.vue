<script setup>
import { ref } from 'vue'

const nicknameInput = ref('')

const emit = defineEmits(['update:value'])

function emitValue() {
  emit('update:value', nicknameInput.value)
}
</script>

<template>
  <label class="formControls_label" for="nickname">您的暱稱</label>
  <input
    class="formControls_input"
    type="text"
    name="nickname"
    id="nickname"
    placeholder="請輸入您的暱稱"
    v-model="nicknameInput"
    @input="emitValue"
  />
</template>

<style scoped></style>
