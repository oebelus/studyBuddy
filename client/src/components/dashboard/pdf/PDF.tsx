import { PDFDocumentProxy } from 'pdfjs-dist';
import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFProps {
    pdfName: string;
}

export default function PDF(props: PDFProps) {
    const PAGE_MAX_HEIGHT = 600;

    const [allPageNumbers, setAllPageNumbers] = useState<number[]>(); // default value is undefined.

    function onDocumentLoadSuccess(pdf: PDFDocumentProxy) {
		const allPageNumbers: number[] = [];
		for (let p = 1; p < pdf.numPages + 1; p++) {
			allPageNumbers.push(p);
		}
		setAllPageNumbers(allPageNumbers);
	}

    return (
        <div>
            <Document file={`/pdfs/${props.pdfName}`}
                onLoadSuccess={onDocumentLoadSuccess}
                    scale={2.0}
            >
                <div
                style={{
                    maxHeight: `${PAGE_MAX_HEIGHT}px`,
                    overflowY: 'scroll', 
                    overflowX: 'hidden',

                    border: '2px solid lightgray',
                    borderRadius: '5px',
                }}>

                {allPageNumbers
                ? allPageNumbers.map((pn) => (
                    <Page key={`page-${pn}`} pageNumber={pn} />
                ))
                : undefined}
                </div>
            </Document>
        </div>
    )
}
