/*import PDF from "../models/generarPDF.model.js";
import { createTable } from "../utils/generarPDF.js";

export async function createReports(req,res){

    const generarPDF = new Report(req.body);
    const reportSave = await generarPDF.save();
    createTable();

    res.status(201).json({
        message: "Reporte creado con éxito",
        data:reportSave
    })
}
*/