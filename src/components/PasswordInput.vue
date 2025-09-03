<script setup>
defineProps({
  inputName: String,
  inputId: String,
  labelName: String,
  placeholder: String,
})

import { ref } from 'vue'

const passwordInput = ref('')

const emit = defineEmits(['update:value'])

function emitValue() {
  emit('update:value', passwordInput.value)
}
</script>

<template>
  <label class="formControls_label" :for="inputId">{{ labelName }}</label>
  <input
    class="formControls_input"
    type="password"
    :name="inputName"
    :id="inputId"
    :placeholder="placeholder"
    required
    v-model="passwordInput"
    @input="emitValue"
  />
</template>

<style scoped></style>
