import PDFDocument from "pdfkit";
import fs from "fs";
import Empleado from "../models/empleado.model.js";

export const PDFController = {
  async generarPDF(req, res) {
    try {
      const empleado = await Empleado.findById(req.params.id)
        .populate("tarea", "nombreTarea descripcionTarea estado")
        .populate("datos", "supervisor rutEmpleado comentario");

      if (!empleado) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }

      const doc = new PDFDocument();
      const fileName = `empleado_${empleado._id}.pdf`;
      const writeStream = fs.createWriteStream(fileName);
      doc.pipe(writeStream);

      doc.fontSize(14).text("Datos del Empleado", { align: "center" }).moveDown();
      const table = {
        headers: ["Tarea", "Comentario"],
        rows: [[empleado.tarea.nombreTarea, empleado.datos.comentario]],
      };

      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold"),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
      });

      doc.end();

      console.log(`PDF generado correctamente: ${fileName}`);
      res.status(200).json({ message: "PDF generado correctamente", fileName });
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};
