import { PDFModel } from "./PDFModel.js";

export class PDFController {
    static async generatePDF(req, res) {
        try {
            // Aquí podrías obtener los datos necesarios para construir el PDF desde la base de datos u otras fuentes
            const data = {
                title: "Hello World",
            };

            // Construye el PDF utilizando el modelo
            const pdfBuffer = await PDFModel.buildPDF(data);

            // Envía el PDF como respuesta al cliente
            res.set({
                "Content-Type": "application/pdf",
                "Content-Disposition": "attachment; filename=example.pdf",
            });
            res.send(pdfBuffer);
        } catch (error) {
            console.error("Error al generar el PDF:", error);
            res.status(500).send("Error interno del servidor");
        }
    }
}
