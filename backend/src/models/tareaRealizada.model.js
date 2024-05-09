"use strict";
import { Schema , model} from "mongoose";

const tareaRealizadaSchema = new Schema({
  
  Comentario: {
    type: String,
    required: true,
  },
  Estado: {
    type: String,
    enum: ["completa", "incompleta", "no realizada"],
  },
}, {
  versionKey: false,
});


export default model ("TareaRealizada", tareaRealizadaSchema);
