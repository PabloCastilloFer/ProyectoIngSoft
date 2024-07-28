import mongoose from 'mongoose';

const comentarioSchema = new mongoose.Schema({
  rutAsignado: {
    type: String,
    required: true,
    match: /^[0-9]+[-|‐]{1}[0-9kK]{1}$/,
    minlength: 9,
    maxlength: 10
  },
  comentario: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
});

const Comentario = mongoose.model('Comentario', comentarioSchema);

export default Comentario;
