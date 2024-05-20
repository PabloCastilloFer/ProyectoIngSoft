import PDFDocument from "pdfkit";
import fs from "fs";
import Empleado from "../models/empleado.model.js"; // Importa el modelo de Empleado

export const PDFController = {
  async generarPDF(req, res) {
    try {
      // Obtener los datos del empleado desde la base de datos
      const empleado = await Empleado.findById(req.params.id)
        .populate("tarea", "nombreTarea descripcionTarea estado")
        .populate("datos", "supervisor rutEmpleado comentario");

      if (!empleado) {
        return res.status(404).json({ error: "Empleado no encontrado" });
      }

      // Crear un nuevo documento PDF
      const doc = new PDFDocument();
      // Establecer el nombre del archivo de salida
      const fileName = `empleado_${empleado._id}.pdf`;
      // Crear un flujo de escritura para guardar el PDF en el sistema de archivos
      const writeStream = fs.createWriteStream(fileName);
      // Pipelining the PDF directly to the write stream
      doc.pipe(writeStream);

      // Añadir el contenido al PDF
      doc.fontSize(14).text("Datos del Empleado", { align: "center" }).moveDown();

      // Crear una tabla para mostrar los datos del empleado
      const table = {
        headers: ["Tarea", "Comentario"],
        rows: [[empleado.tarea.nombreTarea, empleado.datos.comentario]],
      };

      doc.table(table, {
        prepareHeader: () => doc.font("Helvetica-Bold"),
        prepareRow: (row, i) => doc.font("Helvetica").fontSize(10),
      });

      // Finalizar el documento PDF
      doc.end();

      console.log(`PDF generado correctamente: ${fileName}`);

      res.status(200).json({ message: "PDF generado correctamente", fileName });
    } catch (error) {
      console.error("Error al generar el PDF:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};
