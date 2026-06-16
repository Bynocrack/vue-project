<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const API_URL = import.meta.env.VITE_API_URL || '/api/enrollment-certificate'

const matriculas = ref([])
const total = ref(0)
const loading = ref(false)
const error = ref(null)
const fechaEmision = ref('')

const alumno = computed(() => {
  return matriculas.value[0]?.student ?? {
    cui: '',
    full_name: '',
    email: ''
  }
})

function formatearFecha(fechaISO) {
  if (!fechaISO) return ''

  const fecha = new Date(fechaISO)

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(fecha)
}

async function cargarConstancia(cui) {
  loading.value = true
  error.value = null
  matriculas.value = []
  total.value = 0
  fechaEmision.value = ''

  try {
    const url = new URL(API_URL, window.location.origin)
    url.searchParams.set('cui', cui)

    const response = await fetch(url.toString())

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}`)
    }

    const data = await response.json()

    matriculas.value = data.results ?? []
    total.value = data.count ?? matriculas.value.length

    if (matriculas.value.length === 0) {
      error.value = `No se encontraron matrículas para el CUI ${cui}.`
      return
    }

    fechaEmision.value = formatearFecha(matriculas.value[0]?.created)
  } catch (err) {
    error.value = 'No se pudieron cargar los datos de matrícula.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

watch(
  () => route.params.cui,
  (nuevoCui) => {
    cargarConstancia(nuevoCui)
  },
  { immediate: true }
)
</script>

<template>
  <main class="documento">
    <header class="encabezado">
      <h1>CONSTANCIA DE MATRÍCULA DE LABORATORIO</h1>
      <h2>Escuela Profesional de Ingeniería de Sistemas EPIS</h2>

      <p v-if="fechaEmision" class="fecha">
        Emitido el: {{ fechaEmision }}
      </p>
    </header>

    <hr />

    <p v-if="loading" class="mensaje">
      Cargando constancia...
    </p>

    <p v-else-if="error" class="error">
      {{ error }}
    </p>

    <template v-else>
      <section class="bloque">
        <h3>DATOS DEL ALUMNO</h3>

        <div class="datos-alumno">
          <div class="fila-dato">
            <strong>C.U.I.:</strong>
            <span>{{ alumno.cui }}</span>
          </div>

          <div class="fila-dato">
            <strong>Nombre completo:</strong>
            <span>{{ alumno.full_name }}</span>
          </div>

          <div class="fila-dato">
            <strong>Email:</strong>
            <span>{{ alumno.email }}</span>
          </div>
        </div>
      </section>

      <section class="bloque">
        <h3>ASIGNATURAS MATRICULADAS</h3>

        <table>
          <thead>
            <tr>
              <th>N°</th>
              <th>Código</th>
              <th>Curso</th>
              <th>Año</th>
              <th>Grupo</th>
              <th>Laboratorio</th>
              <th>Docente</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(matricula, index) in matriculas" :key="matricula.id">
              <td>{{ index + 1 }}</td>

              <td>{{ matricula.workload.course.code }}</td>

              <td class="curso">
                <strong>{{ matricula.workload.course.name }}</strong>
                <span>({{ matricula.workload.course.acronym }})</span>
              </td>

              <td>{{ matricula.workload.course.year_display }}</td>

              <td>{{ matricula.workload.group }}</td>

              <td>{{ matricula.workload.laboratory }}</td>

              <td>{{ matricula.workload.teacher.full_name }}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <p class="total">
        <strong>Total de cursos matriculados:</strong> {{ total }}
      </p>

      <footer>
        Documento generado digitalmente por el Sistema de Matrícula de Laboratorio EPIS.
      </footer>
    </template>
  </main>
</template>