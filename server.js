import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROFESSOR_API_URL =
  process.env.PROFESSOR_API_URL ||
  'https://sisacad-enrollments-backend.vercel.app/restful/enrollment-certificate/'

app.get('/api/enrollment-certificate', async (req, res) => {
  try {
    const { cui } = req.query

    if (!cui) {
      return res.status(400).json({
        error: 'El parámetro cui es obligatorio',
      })
    }

    const apiUrl = new URL(PROFESSOR_API_URL)
    apiUrl.searchParams.set('cui', cui)

    const response = await fetch(apiUrl.toString())
    const contentType = response.headers.get('content-type') || 'application/json'
    const body = await response.text()

    res.status(response.status)
    res.setHeader('Content-Type', contentType)
    res.send(body)
  } catch (error) {
    console.error('Error consultando API del profesor:', error)

    res.status(500).json({
      error: 'Error consultando la API del profesor',
    })
  }
})

app.use(express.static(path.join(__dirname, 'dist')))

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})