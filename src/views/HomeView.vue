<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const cui = ref('20250100')

function buscarConstancia() {
  const cuiLimpio = cui.value.trim()

  if (!cuiLimpio) {
    alert('Ingrese un CUI')
    return
  }

  router.push(`/constancia/${cuiLimpio}`)
}
</script>

<template>
  <main class="buscador">
    <h1>Buscar constancia de matrícula</h1>

    <form @submit.prevent="buscarConstancia">
      <label for="cui">Ingrese CUI:</label>

      <input
        id="cui"
        v-model="cui"
        type="text"
        placeholder="Ejemplo: 20250100"
      />

      <button type="submit">
        Buscar
      </button>
    </form>
  </main>
</template>