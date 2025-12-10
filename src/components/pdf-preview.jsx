import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function PdfPreview({ url }) {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div className="h-screen border rounded">
        <Viewer fileUrl={url} />
      </div>
    </Worker>
  );
}
