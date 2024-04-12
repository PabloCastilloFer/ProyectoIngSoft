"use strict";
const mongoose = require("mongoose");
const tareaRealizadaSchema = new mongoose.Schema({
 
  Comentario: {
    type: String,
    required: true,
  },
  
  Estados :{
    type: String,
    enum: ["completa", "incompleta", "no realizada"], 


   //SubirPDF

   //Unir informacion de tareas para sacar restriccion horaria
   
  },
},

{
  versionKey: false,
});

const  tareaRealiza= mongoose.model("tareaRealizada", tareaRealizadaSchema);
module.exports = tareaRealiza;