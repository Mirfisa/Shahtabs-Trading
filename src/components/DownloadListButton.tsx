import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Download } from 'lucide-react'; // Using lucide-react since it's in package.json

interface Car {
    'S.N.': string;
    'Car Name': string;
    'Model': string;
    'Year'?: string;
    'Chasis Number': string;
    'Colour': string;
    'Mileage': string;
    'Engine CC'?: string;
    'Engine'?: string;
    'Grade': string;
    'Details': string;
    'Landing': string;
    'Location': string;
    'Picture': string;
    'Status': string;
    [key: string]: any;
}

interface DownloadListButtonProps {
    cars: Car[];
}

const DownloadListButton: React.FC<DownloadListButtonProps> = ({ cars }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = () => {
        setIsDownloading(true);

        try {
            // Landscape mode A4
            const doc = new jsPDF('landscape', 'pt', 'a4');

            const tableColumn = [
                "S.N.",
                "Car Name",
                "Model",
                "Year",
                "Chasis Number",
                "Colour",
                "Mileage",
                "Engine CC",
                "Grade",
                "Details",
                "Landing",
                "Location",
                "Picture",
                "Status"
            ];

            const tableRows: any[] = [];

            cars.forEach((car, index) => {
                const rowData = [
                    (index + 1).toString(), // Auto-incrementing serial number instead of sheet S.N.
                    car['Car Name'] || car['name'] || '',
                    car['Model'] || car['model'] || '',
                    car['Year'] || car['year'] || '',
                    car['Chasis Number'] || '',
                    car['Colour'] || '',
                    car['Mileage'] || '',
                    car['Engine CC'] || car['Engine'] || car['engine'] || '',
                    car['Grade'] || car['grade'] || '',
                    car['Details'] || '',
                    car['Landing'] || '',
                    car['Location'] || '',
                    car['Picture'] || car['Picture Drive Link '] ? { content: 'Picture', styles: { textColor: [0, 0, 255] }, rowUrl: car['Picture Drive Link '] || car['Picture'] } : '',
                    car['Status'] || ''
                ];
                tableRows.push(rowData);
            });

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 130, // move start Y down to accommodate header
                theme: 'grid',
                styles: {
                    fontSize: 7,
                    cellPadding: 3,
                    halign: 'center', // center all table text
                    valign: 'middle',
                    lineColor: [200, 200, 200],
                    lineWidth: 0.5,
                },
                headStyles: {
                    fillColor: [0, 0, 0], // Black header
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center',
                },
                margin: { top: 130, left: 15, right: 15 },
                didDrawPage: (data) => {
                    // Header Logo
                    const logoImg = new Image();
                    logoImg.src = `${import.meta.env.BASE_URL}favicon.png`;
                    try {
                        //let's make it 40x50
                        const pageWidth = doc.internal.pageSize.getWidth();
                        const imgWidth = 50;
                        const imgHeight = 40;
                        doc.addImage(logoImg, 'PNG', (pageWidth - imgWidth) / 2, 10, imgWidth, imgHeight);
                    } catch (e) {
                        console.warn('Logo could not be loaded into PDF.');
                    }

                    // Contact Info
                    doc.setFontSize(8);
                    doc.setFont("helvetica", "bold");
                    const contactText = "Phone: 01937-431181 | Address: House # 105, Road # 13/A, Block # C, Dhaka, Bangladesh | Email: tinku38@hotmail.com";
                    const contactPdfWidth = doc.getTextWidth(contactText);
                    const pageWidth = doc.internal.pageSize.getWidth();
                    doc.text(contactText, (pageWidth - contactPdfWidth) / 2, 70);

                    // Date
                    doc.setFontSize(9);
                    doc.setFont("helvetica", "bold");
                    const downloadDate = new Date().toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                    }).replace(/ /g, '-');
                    const dateText = `Date: ${downloadDate}`;
                    const datePdfWidth = doc.getTextWidth(dateText);
                    doc.text(dateText, (pageWidth - datePdfWidth) / 2, 110);
                },
                didDrawCell: (data) => {
                    if (data.column.index === 12 && data.cell.section === 'body') {
                        const raw = data.cell.raw as any;
                        if (raw && raw.rowUrl) {
                            // Underline link to make it look like a standard hyperlink
                            doc.setDrawColor(0, 0, 255);
                            doc.setLineWidth(0.5);
                            doc.line(
                                data.cell.x + 2,
                                data.cell.y + data.cell.height / 2 + 3,
                                data.cell.x + data.cell.width - 2,
                                data.cell.y + data.cell.height / 2 + 3
                            );
                            doc.link(data.cell.x, data.cell.y, data.cell.width, data.cell.height, { url: raw.rowUrl });
                        }
                    }
                },
                willDrawCell: (data) => {
                    // Color Status column text
                    if (data.column.index === 13 && data.cell.section === 'body') {
                        const status = data.cell.raw as string;
                        if (status.toLowerCase() === 'unsold' || status.toLowerCase() === 'available') {
                            doc.setTextColor(0, 128, 0); // Green
                        } else if (status.toLowerCase() === 'sold') {
                            doc.setTextColor(255, 0, 0); // Red
                        }
                    }
                }
            });

            doc.save('StockList.pdf');
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isDownloading || cars.length === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-white md:text-sm text-xs transition duration-300 font-medium ${isDownloading || cars.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-[#fe9900] hover:bg-[#ec6f3d]'
                }`}
        >
            <Download size={16} />
            <span>{isDownloading ? 'Downloading...' : 'Download Stock List'}</span>
        </button>
    );
};

export default DownloadListButton;
