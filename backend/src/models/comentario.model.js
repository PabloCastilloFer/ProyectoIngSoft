import mongoose from "mongoose";
import comentarioSchema from "../schema/comentario.schema.js";

const Comentario = mongoose.model("comentario", comentarioSchema);

export default Comentario;
