import PDFDocument from "pdfkit";

export class PDFModel {
    static buildPDF(data) {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument();

            // Agrega lógica para construir el PDF basado en los datos proporcionados
            doc.fontSize(25).text(data.title, 100, 100);

            const buffers = [];
            doc.on("data", (chunk) => buffers.push(chunk));
            doc.on("end", () => resolve(Buffer.concat(buffers)));
            doc.end();
        });
    }
}
