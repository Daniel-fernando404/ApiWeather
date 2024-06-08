const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/climaApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conexión exitosa a MongoDB');
});

const historialSchema = new mongoose.Schema({
  city: String,
  weatherData: Object,
  date: { type: Date, default: Date.now }
});

const Historial = mongoose.model('Historial', historialSchema);

app.post('/api/history', async (req, res) => {
  const { city, weather } = req.body;
  try {
    const newHistorial = new Historial({ city, weatherData: weather });
    await newHistorial.save();
    res.send('Historial guardado en MongoDB');
  } catch (error) {
    console.error('Error al guardar el historial en MongoDB:', error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
