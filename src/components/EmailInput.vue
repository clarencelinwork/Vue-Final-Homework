<script setup>
import { ref } from 'vue';
const emailInput = ref('');

const emit = defineEmits(['update:value']);
function emitValue() {
  emit('update:value', emailInput.value);
}
</script>

<template>
  <label class="formControls_label" for="email">Email</label>
  <input
    class="formControls_input"
    type="email"
    id="email"
    name="email"
    placeholder="請輸入 email"
    required
    v-model="emailInput"
    @input="emitValue"
  />
</template>

<style scoped>

</style>
