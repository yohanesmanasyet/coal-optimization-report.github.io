// React hooks will be available globally from CDN
const { useState, useEffect, useMemo, useRef } = React;

// -----------------------------
// SIGNATURE CANVAS COMPONENT
// -----------------------------
function SignatureCanvas({ onSignatureChange, signature, title, role }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size - bigger for better signature experience
    canvas.width = 350;
    canvas.height = 180;
    
    // Set drawing styles
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#1f2937';
    
    // Clear canvas
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Restore signature if exists
    if (signature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        setHasSignature(true);
      };
      img.src = signature;
    }
  }, [signature]);

  const getEventPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    // Handle both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    setHasSignature(true);
    const pos = getEventPos(e);
    
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const pos = getEventPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    if (e) e.preventDefault();
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      const signatureData = canvas.toDataURL();
      onSignatureChange(signatureData);
    }
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange(null);
  };

  return (
    <div className="signature-canvas" style={{ 
      textAlign: 'center', 
      border: '1px solid #e2e8f0', 
      borderRadius: '8px', 
      padding: '16px',
      backgroundColor: '#fafafa',
      minHeight: '240px'
    }}>
      <div style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px' }}>
        {title}
      </div>
      
      <div style={{ 
        border: '2px dashed #d1d5db', 
        borderRadius: '6px', 
        padding: '12px',
        backgroundColor: 'white',
        marginBottom: '12px'
      }}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          style={{ 
            cursor: 'crosshair',
            display: 'block',
            width: '100%',
            height: '150px',
            border: 'none',
            touchAction: 'none'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '8px' }}>
        <button
          onClick={clearSignature}
          style={{
            padding: '4px 8px',
            fontSize: '11px',
            backgroundColor: '#f87171',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
        <div style={{ 
          fontSize: '10px', 
          color: hasSignature ? '#16a34a' : '#94a3b8',
          alignSelf: 'center'
        }}>
          {hasSignature ? '✓ Signed' : 'Draw signature'}
        </div>
      </div>
      
      <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#374151' }}>
        {role}
      </div>
    </div>
  );
}

// -----------------------------
// CONFIGURATIONS
// -----------------------------
const roofChecklist = [
  { 
    id: "A", 
    groupTitle: "Area Observed", 
    items: [
      { id: "A1", text: "Coal body already cleaned", subtext: "(Apakah body batubara sudah benar-benar dibersihkan +/- 10 cm bagian roof)" },
      { id: "A2", text: "Coal body already cleaned used cutting edge", subtext: "(Membersihkan batubara menggunakan excavator kecil dengan cutting edge/flat)" },
      { id: "A3", text: "There is no more parting and other non coal material", subtext: "(Tidak ada lagi sisipan dan material selain batubara di area tersebut)" },
      { id: "A4", text: "There is no water accumulation at loading area and coal body", subtext: "(Tidak ada genangan air di area penggalian dan badan batubara)" },
      { id: "A5", text: "At night shift must be supported by good lighting plant at coal getting area", subtext: "(Pada jadwal kerja malam, harus dibantu dengan lampu penerangan yang memadai di area penggalian batubara)" },
      { id: "A6", text: "There isn't spontaneous combustion at coal mining area", subtext: "(Tidak ada Swa Bakar pada area penambangan batubara)" },
      { id: "A7", text: "Volume coal expose is determined", subtext: "(Volume batubara terkupas sudah ditentukan)" },
      { id: "A8", text: "Location coal expose match with plan", subtext: "(Lokasi batubara terkupas sesuai rencana)" }
    ]
  },
  { 
    id: "B", 
    groupTitle: "Personel Attendance", 
    items: [
      { id: "B1", text: "Engineering, production & survey crew present for coal getting join inspection area", subtext: "(Eng, prod & survey hadir saat inspeksi gabungan dilokasi penggalian batubara)" }
    ]
  },
  { 
    id: "C", 
    groupTitle: "Survey Data for coal cleaning", 
    items: [
      { id: "C1", text: "Survey data for coal cleaning have been taken by surveyor (marked with tape)", subtext: "(Pengambilan data batubara yang sudah bersih telah dilakukan oleh team survey, ditandai dengan pita)" }
    ]
  }
];

const floorChecklist = [
  { 
    id: "A", 
    groupTitle: "Area Observed", 
    items: [
      { id: "A1", text: "Coal body already mine", subtext: "(Apakah body batubara sudah benar-benar diambil)" }
    ]
  },
  { 
    id: "B", 
    groupTitle: "Coal Floor", 
    items: [
      { id: "B1", text: "Coal floor left +/- 10 cm", subtext: "(Batubara yang ditinggalkan setelah 10cm)" }
    ]
  },
  { 
    id: "C", 
    groupTitle: "Location Clean", 
    items: [
      { id: "C1", text: "There is no more coal pile left in the location", subtext: "(Tidak ada lagi tumpukan batubara tersisa dilokasi)" }
    ]
  },
  { 
    id: "D", 
    groupTitle: "Survey", 
    items: [
      { id: "D1", text: "Survey data for coal floor have been taken by surveyor (marked with tape)", subtext: "(Pengambilan data lantai batubara telah dilakukan oleh team survey, ditandai dengan pita)" }
    ]
  },
  { 
    id: "E", 
    groupTitle: "Personnel Attendance", 
    items: [
      { id: "E1", text: "Engineer, Production & Survey crew present for join mineout inspection area", subtext: "(Eng, Prod & Survey hadir di lokasi inspeksi bersama)" }
    ]
  }
];

const templates = [
  { key: "floor", title: "PT BRE - PT KPP RANTAU PROJECT", subtitle: "DAILY COAL MINEOUT/FLOOR INSPECTION & SIGN OFF\nRANTAU MINE", checklist: floorChecklist },
  { key: "roof", title: "Berita Acara Expose / Roof Inspection", subtitle: "PT BRE – PT KPP (Project)", checklist: roofChecklist },
  { key: "combined", title: "Berita Acara Gabungan Roof & Floor", subtitle: "PT BRE – PT KPP (Project)", checklist: [...roofChecklist, ...floorChecklist] },
];

// -----------------------------
// UTIL
// -----------------------------
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatDateISO(d) {
  if (!d) return "";
  try {
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yyyy = dt.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  } catch {
    return d;
  }
}

// -----------------------------
// MAIN COMPONENT
// -----------------------------
function App() {
  const [template, setTemplate] = useState("floor");

  // Common form fields
  const [form, setForm] = useState({
    date: "",
    time: "",
    day: "",
    project: "PT BRE – PT KPP RANTAU",
    pit: "",
    block: "",
    seam: "",
    rl: "",
    preparedBy: "Engineering KPP",
    verifiedBy: "Production KPP",
    approvedBy: "Pit Geos/Operation BRE",
    notes: "",
    recommendations: "",
    photoNote: "", // Note untuk foto
  });

  // Checklist status per template
  const initialChecklist = useMemo(() => {
    const t = templates.find((t) => t.key === template);
    const allItems = [];
    
    t.checklist.forEach(group => {
      if (group.items) {
        group.items.forEach(item => {
          allItems.push(item);
        });
      } else {
        allItems.push(group);
      }
    });
    
    return Object.fromEntries(
      allItems.map((item) => [item.id, { status: "", evidence: undefined, remark: "" }])
    );
  }, [template]);

  const [checks, setChecks] = useState(initialChecklist);

  // General photos (outside checklist)
  const [generalPhotos, setGeneralPhotos] = useState([]);

  // Signatures state
  const [signatures, setSignatures] = useState({
    bre: null,
    engineering: null,
    production: null
  });

  // Reset when template changes
  useEffect(() => {
    setChecks(initialChecklist);
    setGeneralPhotos([]);
    setSignatures({ bre: null, engineering: null, production: null });
  }, [template, initialChecklist]);

  // Handlers
  const onChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));
  const onStatusChange = (id, status) => setChecks((s) => ({ ...s, [id]: { ...s[id], status } }));
  const onRemarkChange = (id, remark) => setChecks((s) => ({ ...s, [id]: { ...s[id], remark } }));
  const onUploadEvidence = async (id, file) => {
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setChecks((s) => ({ ...s, [id]: { ...s[id], evidence: { file, dataUrl } } }));
  };
  const onAddGeneralPhotos = async (files) => {
    if (!files) return;
    const arr = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      const dataUrl = await readFileAsDataURL(f);
      arr.push({ file: f, dataUrl });
    }
    // Limit to maximum 3 photos total
    setGeneralPhotos((p) => {
      const newPhotos = [...p, ...arr];
      return newPhotos.slice(0, 3); // Keep only first 3 photos
    });
  };

  const removeGeneralPhoto = (idx) => setGeneralPhotos((p) => p.filter((_, i) => i !== idx));

  // Signature handlers
  const handleSignatureChange = (type, signatureData) => {
    setSignatures(prev => ({
      ...prev,
      [type]: signatureData
    }));
  };

  // -----------------------------
  // PDF EXPORT (vector text + tables + images)
  // -----------------------------
  const exportPDF = async () => {
    const t = templates.find((t) => t.key === template);
    const doc = new window.jspdf.jsPDF({ orientation: "p", unit: "mm", format: "a4" });
    const margin = 14;

    // Header with logos
    try {
      // Add BRE Logo (left side)
      const breImg = new Image();
      breImg.src = './Logo/Logo_BRE.jpeg';
      doc.addImage(breImg, 'JPEG', margin, 8, 25, 15);
    } catch {
      // Fallback text if image fails
      doc.setFontSize(8);
      doc.text("[LOGO BRE]", margin, 15);
    }
    
    try {
      // Add KPP Logo (right side)  
      const kppImg = new Image();
      kppImg.src = './Logo/Logo KPP.png';
      doc.addImage(kppImg, 'PNG', 210 - margin - 25, 8, 25, 15);
    } catch {
      // Fallback text if image fails
      doc.setFontSize(8);
      doc.text("[LOGO KPP]", 210 - margin - 20, 15);
    }

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(t.title, 105, 18, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    const subtitleLines = t.subtitle.split('\n');
    subtitleLines.forEach((line, i) => {
      doc.text(line, 105, 25 + (i * 5), { align: "center" });
    });

    // Right header info
    const rightX = 210 - margin;
    let headerY = 40;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    
    // Left side: Date, Time, Day
    doc.text(`Date: ${formatDateISO(form.date) || "___________"}`, margin, headerY);
    doc.text(`Time: ${form.time || "___________"}`, margin, headerY + 4);
    doc.text(`Day: ${form.day || "___________"}`, margin, headerY + 8);
    
    // Right side: Seam, Block, RL
    doc.text(`Seam: ${form.seam || "___________"}`, rightX - 50, headerY);
    doc.text(`Block: ${form.block || "___________"}`, rightX - 50, headerY + 4);
    doc.text(`RL: ${form.rl || "___________"}`, rightX - 50, headerY + 8);

    // Give Mark explanation
    let giveMarkY = 65;
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Give mark (Beri tanda):", margin, giveMarkY);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Y (Yes) = Actual condition is accepted (Kondisi penambangan telah sesuai prosedur)", margin + 5, giveMarkY + 5);
    doc.text("N (No) = Actual condition is not accepted (Kondisi penambangan tidak sesuai prosedur)", margin + 5, giveMarkY + 9);
    doc.text("N/A (Not Available) = No description/data available (Tidak ada deskripsi yang tersedia)", margin + 5, giveMarkY + 13);

    // Checklist table
    const startY = 85;

    const tableRows = [];
    let rowNumber = 1;
    t.checklist.forEach((group, groupIdx) => {
      if (group.items) {
        group.items.forEach((item, itemIdx) => {
          tableRows.push([
            rowNumber,
            `${item.text}\n${item.subtext}`,
            checks[item.id]?.status || "",  // ENG KPP
            checks[item.id]?.status || "",  // PRO KPP
            "",                             // BRE - always empty
            checks[item.id]?.remark || ""   // Remark from form
          ]);
          rowNumber++;
        });
      }
    });



    doc.autoTable({
      startY,
      head: [["No", "Check List Items", "ENG KPP", "PRO KPP", "BRE", "Remark/ Keterangan"]],
      body: tableRows,
      styles: { fontSize: 7, cellPadding: 1.5, valign: "middle", lineWidth: 0.1 },
      headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: "bold", halign: "center", fontSize: 7 },
      margin: { left: margin, right: margin },
      columnStyles: { 
        0: { cellWidth: 8, halign: "center" }, 
        1: { cellWidth: 85 },
        2: { cellWidth: 12, halign: "center" }, 
        3: { cellWidth: 12, halign: "center" }, 
        4: { cellWidth: 12, halign: "center" }, 
        5: { cellWidth: 48 }
      }
    });

    // Photo Section - Separate table as intended  
    let photoY = doc.lastAutoTable && doc.lastAutoTable.finalY ? doc.lastAutoTable.finalY + 3 : 160;  // Less spacing from previous table
    
    // Photo section title
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Foto Floor Batubara", margin, photoY + 1);
    
    // Very small table header only - no body content
    doc.autoTable({
      startY: photoY + 3,
      head: [["Foto Floor Batubara", "Note"]],
      body: [],  // Empty body - no content inside table
      styles: { fontSize: 6, cellPadding: 0.8, minCellHeight: 6 },  // Even smaller header
      headStyles: { fillColor: [220, 220, 220], textColor: 0, fontStyle: "bold", halign: "center", fontSize: 6 },
      margin: { left: margin, right: margin },
      columnStyles: { 
        0: { cellWidth: 100, halign: "center" },  // Center aligned
        1: { cellWidth: 80, halign: "center" }    // Center aligned
      }
    });
    
    // Content OUTSIDE the table - centered in columns
    let contentY = doc.lastAutoTable.finalY + 0.5;  // Very close to header
    
    // Add photos outside table (centered in "Foto Floor Batubara" column)
    if (generalPhotos.length > 0) {
      try {
        const photosToShow = Math.min(3, generalPhotos.length);  // Changed to 3 photos max
        let photoWidth, photoHeight;
        
        // Adjust size based on number of photos - smaller to save space
        if (photosToShow === 1) {
          photoWidth = 45;
          photoHeight = 25;
        } else if (photosToShow === 2) {
          photoWidth = 35;
          photoHeight = 25;
        } else { // 3 photos
          photoWidth = 25;
          photoHeight = 20;
        }
        
        // Center photos in left column (100px width)
        const leftColumnCenter = margin + 50;  // Center of 100px column
        let totalPhotoWidth;
        
        if (photosToShow === 1) {
          totalPhotoWidth = photoWidth;
        } else if (photosToShow === 2) {
          totalPhotoWidth = (photoWidth * 2 + 5);
        } else { // 3 photos
          totalPhotoWidth = (photoWidth * 3 + 10);
        }
        
        const startX = leftColumnCenter - (totalPhotoWidth / 2);
        
        for (let i = 0; i < photosToShow; i++) {
          const photo = generalPhotos[i];
          const x = startX + (i * (photoWidth + 5));
          const y = contentY;
          
          doc.addImage(photo.dataUrl, "JPEG", x, y, photoWidth, photoHeight, undefined, "FAST");
        }
      } catch (error) {
        console.warn("Error adding photos:", error);
        doc.setFontSize(9);
        doc.text("Error loading photos", margin + 25, contentY + 15);
      }
    } else {
      doc.setFontSize(8);
      doc.text("Belum ada foto", margin + 25, contentY + 10);
    }
    
    // Add note outside table (more centered in "Note" column)
    if (form.photoNote) {
      doc.setFontSize(7);  // Smaller note text to save space
      const noteX = margin + 115; // Move more to center of right column
      const noteLines = doc.splitTextToSize(form.photoNote, 65);
      doc.text(noteLines, noteX, contentY + 3);
    }
    
    photoY = contentY + 25; // Further reduce space after photos and notes

    // Signatures - positioned after photo section
    let signY = photoY + 5;  // Reduce spacing to fit in one page
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Tanda Tangan", margin, signY - 4);

    const boxW = (210 - margin * 2 - 10) / 3;
    const roles = [
      { label: "Accepted by / Diterima Oleh", name: "Pit Geos/Operation BRE", position: "Pit Geos/Operation BRE", signKey: "bre" },
      { label: "Prepared by / Diajukan Oleh", name: "Engineering KPP", position: "Engineering KPP", signKey: "engineering" },
      { label: "Proposed by / Diajukan Oleh", name: "Production KPP", position: "Production KPP", signKey: "production" },
    ];

    roles.forEach((r, i) => {
      const x = margin + i * (boxW + 5);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(r.label, x + 3, signY + 4);
      
      // Add signature image if available
      const signatureData = signatures[r.signKey];
      if (signatureData) {
        try {
          // Add signature image
          doc.addImage(signatureData, 'PNG', x + 6, signY + 7, boxW - 12, 12);
        } catch (error) {
          console.log("Error adding signature:", error);
          // Fallback to line if signature fails
          doc.line(x + 6, signY + 20, x + boxW - 6, signY + 20);
        }
      } else {
        // Default signature line if no signature
        doc.line(x + 6, signY + 20, x + boxW - 6, signY + 20);
      }
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.text(r.position || "", x + 3, signY + 24);  // Reduce position for name
    });

    // Footer page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(`Halaman ${i} / ${pageCount}`, 210 - margin, 297 - 10, { align: "right" });
    }

    // Save
    const fileName = `${t.title.replace(/\s+/g, "_")}_${new Date().toISOString().slice(0, 10)}.pdf`;
    doc.save(fileName);
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  const t = templates.find((t) => t.key === template);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
      {/* CSS Responsive untuk Mobile */}
      <style>{`
        @media (max-width: 768px) {
          .form-layout {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .sidebar {
            order: 2;
          }
          
          .main-form {
            order: 1;
          }
          
          .header-container {
            flex-direction: column !important;
            gap: 16px !important;
            text-align: center !important;
          }
          
          .header-container > div {
            justify-content: center !important;
          }
          
          .template-grid {
            grid-template-columns: 1fr !important;
            gap: 8px !important;
          }
          
          .info-grid-3 {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          .info-grid-2 {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          .signature-container {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          
          .signature-canvas {
            min-height: 260px !important;
          }
          
          .signature-canvas canvas {
            height: 170px !important;
          }
        }
        
        @media (max-width: 480px) {
          .container {
            padding: 16px !important;
          }
          
          .form-card {
            padding: 16px !important;
          }
          
          .signature-canvas {
            min-height: 280px !important;
            padding: 20px !important;
          }
          
          .signature-canvas canvas {
            height: 200px !important;
          }
        }
      `}</style>
      
      {/* HEADER */}
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
        {/* Logo Header */}
        <div className="header-container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '16px',
          padding: '16px 24px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '2px solid #e2e8f0'
        }}>
          {/* Logo BRE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="./Logo/Logo_BRE.jpeg" 
              alt="Logo BRE" 
              style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
          
          {/* Title Center */}
          <div style={{ textAlign: 'center', flex: 1 }}>
            <h1 style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              marginBottom: '4px', 
              color: '#0f172a',
              textTransform: 'uppercase'
            }}>
              PT BRE - PT KPP RANTAU PROJECT
            </h1>
            <h2 style={{ 
              fontSize: '18px', 
              fontWeight: '600', 
              color: '#374151'
            }}>
              DAILY COAL MINEOUT/FLOOR INSPECTION & SIGN OFF
            </h2>
            <p style={{ 
              fontSize: '14px', 
              color: '#6b7280',
              marginTop: '4px'
            }}>
              RANTAU MINE
            </p>
          </div>
          
          {/* Logo KPP */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src="./Logo/Logo KPP.png" 
              alt="Logo KPP" 
              style={{ height: '60px', width: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <p style={{ color: '#64748b', fontSize: '16px', textAlign: 'center' }}>
            Pilih template laporan, isi form, unggah evidensi, lalu ekspor sebagai PDF yang rapi dan konsisten.
          </p>
        </div>

        {/* TEMPLATE SELECTOR */}
        <div style={{ marginBottom: '24px' }}>
          <div className="template-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: '4px',
            backgroundColor: '#e2e8f0',
            padding: '4px',
            borderRadius: '8px',
            marginBottom: '16px'
          }}>
            {templates.map((tmpl) => (
              <button
                key={tmpl.key}
                onClick={() => setTemplate(tmpl.key)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: template === tmpl.key ? 'white' : 'transparent',
                  color: template === tmpl.key ? '#0f172a' : '#64748b',
                  fontWeight: template === tmpl.key ? '600' : 'normal',
                  cursor: 'pointer',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
              >
                {tmpl.key === 'roof' ? '📋 Roof Inspection' : 
                 tmpl.key === 'floor' ? '🏗️ Floor Inspection' : 
                 '📊 Combined Report'}
              </button>
            ))}
          </div>
        </div>

        {/* FORM SECTION */}
        <div className="form-layout" style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: '20px', 
          marginBottom: '24px'
        }}>
          {/* Main Form */}
          <div className="main-form form-card" style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
              📝 Informasi Umum
            </h2>
            
            <div className="info-grid-3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Tanggal</label>
                <input 
                  type="date" 
                  value={form.date} 
                  onChange={(e) => onChange("date", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Waktu</label>
                <input 
                  type="time" 
                  value={form.time} 
                  onChange={(e) => onChange("time", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Hari</label>
                <input 
                  placeholder="Senin / Monday" 
                  value={form.day} 
                  onChange={(e) => onChange("day", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div className="info-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Project</label>
                <input 
                  value={form.project} 
                  onChange={(e) => onChange("project", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Pit / Area</label>
                <input 
                  placeholder="Pit A / South Area" 
                  value={form.pit} 
                  onChange={(e) => onChange("pit", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Block</label>
                <input 
                  placeholder="A1, B2, etc" 
                  value={form.block} 
                  onChange={(e) => onChange("block", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>Seam</label>
                <input 
                  placeholder="Seam A, B, C" 
                  value={form.seam} 
                  onChange={(e) => onChange("seam", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>RL (mMSL)</label>
                <input 
                  placeholder="e.g. +125.5" 
                  value={form.rl} 
                  onChange={(e) => onChange("rl", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>



          </div>

          {/* Sidebar */}
          <div className="sidebar form-card" style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            height: 'fit-content'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              ✅ Template Aktif
            </h2>
            
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
              Anda sedang mengisi: <strong style={{ color: '#0f172a' }}>{t.title}</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', marginBottom: '8px' }}>
              Checklist otomatis menyesuaikan dengan template.
            </div>
            <div style={{ fontSize: '12px', marginBottom: '16px' }}>
              Subtitle di PDF: <em>{t.subtitle}</em>
            </div>
            
            <div style={{ paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>Penandatangan</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <input 
                  placeholder="Diajukan oleh" 
                  value={form.preparedBy} 
                  onChange={(e) => onChange("preparedBy", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <input 
                  placeholder="Diverifikasi oleh" 
                  value={form.verifiedBy} 
                  onChange={(e) => onChange("verifiedBy", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                <input 
                  placeholder="Disetujui oleh" 
                  value={form.approvedBy} 
                  onChange={(e) => onChange("approvedBy", e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* CHECKLIST */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            📋 Checklist Pemeriksaan ({t.checklist.length} item)
          </h2>
          
          {/* Give Mark Legend */}
          <div style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '20px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#495057' }}>
              Give Mark (Beri Tanda):
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 'bold', color: '#28a745' }}>Y (Yes)</span>
                <span>- Actual condition is accepted (Kondisi penambangan telah sesuai prosedur)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 'bold', color: '#dc3545' }}>N (No)</span>
                <span>- Actual condition is not accepted (Kondisi penambangan tidak sesuai prosedur)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontWeight: 'bold', color: '#6c757d' }}>N/A (Not Available)</span>
                <span>- No description/data available (Tidak ada deskripsi yang tersedia)</span>
              </div>
            </div>
          </div>          {/* Group-based checklist */}
          {t.checklist.map((group, groupIdx) => (
            <div key={group.id} style={{ marginBottom: '20px' }}>
              <h3 style={{ 
                fontSize: '16px', 
                fontWeight: '600', 
                marginBottom: '12px',
                color: '#374151',
                backgroundColor: '#f3f4f6',
                padding: '8px 12px',
                borderRadius: '6px',
                borderLeft: '4px solid #3b82f6'
              }}>
                {group.id} | {group.groupTitle}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {group.items.map((item, itemIdx) => (
                  <div key={item.id} style={{ 
                    display: 'block', 
                    alignItems: 'start',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    backgroundColor: 
                      checks[item.id]?.status === 'Y' ? '#f0f9ff' : 
                      checks[item.id]?.status === 'N' ? '#fef2f2' : 
                      checks[item.id]?.status === 'N/A' ? '#f8f9fa' : 'white'
                  }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ 
                        fontSize: '14px', 
                        fontWeight: '500', 
                        lineHeight: '1.5',
                        color: '#0f172a'
                      }}>
                        <strong>{groupIdx + 1}.</strong> {item.text}
                      </div>
                      
                      <div style={{ 
                        fontSize: '12px', 
                        fontStyle: 'italic',
                        color: '#6b7280',
                        marginLeft: '20px'
                      }}>
                        {item.subtext}
                      </div>
                      
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginTop: '8px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name={item.id}
                            value="Y"
                            checked={checks[item.id]?.status === 'Y'}
                            onChange={() => onStatusChange(item.id, 'Y')}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ color: '#28a745', fontWeight: 'bold' }}>Y (Yes)</span>
                        </label>
                        
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name={item.id}
                            value="N"
                            checked={checks[item.id]?.status === 'N'}
                            onChange={() => onStatusChange(item.id, 'N')}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ color: '#dc3545', fontWeight: 'bold' }}>N (No)</span>
                        </label>
                        
                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                          <input
                            type="radio"
                            name={item.id}
                            value="N/A"
                            checked={checks[item.id]?.status === 'N/A'}
                            onChange={() => onStatusChange(item.id, 'N/A')}
                            style={{ width: '16px', height: '16px' }}
                          />
                          <span style={{ color: '#6c757d', fontWeight: 'bold' }}>N/A</span>
                        </label>
                      </div>
                      
                      {/* Remark/Keterangan Field */}
                      <div style={{ marginTop: '12px' }}>
                        <label style={{ 
                          display: 'block', 
                          fontSize: '12px', 
                          fontWeight: '500', 
                          marginBottom: '6px',
                          color: '#374151'
                        }}>
                          Remark / Keterangan:
                        </label>
                        <textarea
                          value={checks[item.id]?.remark || ''}
                          onChange={(e) => onRemarkChange(item.id, e.target.value)}
                          placeholder="Tambahkan catatan atau keterangan untuk item ini..."
                          style={{
                            width: '100%',
                            minHeight: '60px',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                        />
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOTO FLOOR BATUBARA SECTION */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
            📸 Foto Floor Batubara
          </h2>
          <p style={{ fontSize: '12px', color: '#6c757d', marginBottom: '16px' }}>
            (diserahkan parameter: hari, tanggal dan jam pengambilan)
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
            {/* Area Foto */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <label style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  backgroundColor: generalPhotos.length >= 3 ? '#e2e8f0' : '#f1f5f9',
                  cursor: generalPhotos.length >= 3 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  border: '1px solid #cbd5e1',
                  opacity: generalPhotos.length >= 3 ? 0.6 : 1
                }}>
                  🖼️ {generalPhotos.length >= 3 ? 'Maksimal 3 Foto' : 'Tambah Foto'}
                  <input 
                    style={{ display: 'none' }} 
                    accept="image/*" 
                    multiple 
                    type="file" 
                    disabled={generalPhotos.length >= 3}
                    onChange={(e) => onAddGeneralPhotos(e.target.files)} 
                  />
                </label>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  ({generalPhotos.length}/3 foto)
                </span>
              </div>

              {generalPhotos.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px',
                  color: '#64748b',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  minHeight: '150px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column'
                }}>
                  <div style={{ fontSize: '24px', marginBottom: '8px' }}>📷</div>
                  <div>Belum ada foto floor batubara</div>
                  <div style={{ fontSize: '10px', color: '#9ca3af' }}>Upload foto sesuai parameter waktu</div>
                </div>
              ) : (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', 
                  gap: '12px',
                  minHeight: '150px',
                  padding: '12px',
                  backgroundColor: '#f0f0f0',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db'
                }}>
                  {generalPhotos.map((p, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img 
                        src={p.dataUrl} 
                        style={{ 
                          borderRadius: '8px', 
                          border: '1px solid #e2e8f0', 
                          width: '100%', 
                          height: '120px', 
                          objectFit: 'cover'
                        }} 
                      />
                      <button
                        onClick={() => removeGeneralPhoto(i)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          padding: '4px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.9)',
                          border: 'none',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                          fontSize: '12px'
                        }}
                        title="Hapus"
                      >
                        ❌
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Area Note */}
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>
                Note / Catatan
              </label>
              <textarea 
                rows={8} 
                placeholder="Catatan untuk foto floor batubara..." 
                value={form.photoNote} 
                onChange={(e) => onChange("photoNote", e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                  resize: 'vertical',
                  lineHeight: '1.5',
                  minHeight: '150px'
                }}
              />
            </div>
          </div>
        </div>

        {/* SIGNATURES SECTION */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
            ✍️ Tanda Tangan
          </h2>
          
          <div className="signature-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <SignatureCanvas
              title="Accepted by / Diterima Oleh"
              role="Pit Geos/Operation BRE"
              signature={signatures.bre}
              onSignatureChange={(data) => handleSignatureChange('bre', data)}
            />
            
            <SignatureCanvas
              title="Prepared by / Diajukan Oleh"
              role="Engineering KPP"
              signature={signatures.engineering}
              onSignatureChange={(data) => handleSignatureChange('engineering', data)}
            />
            
            <SignatureCanvas
              title="Proposed by / Diajukan Oleh"
              role="Production KPP"
              signature={signatures.production}
              onSignatureChange={(data) => handleSignatureChange('production', data)}
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', color: '#64748b' }}>
            Progress: <strong>{Object.values(checks).filter(c => c && c.status).length} / {t.checklist.reduce((acc, group) => acc + (group.items ? group.items.length : 1), 0)}</strong> checklist selesai
          </div>
          
          <button 
            onClick={exportPDF}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
          >
            📥 Export PDF
          </button>
        </div>

        {/* PREVIEW SUMMARY */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px' }}>
            📄 Preview Laporan: {t.title}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', fontSize: '12px' }}>
            <div>
              <strong>Tanggal:</strong> {formatDateISO(form.date) || '-'}<br />
              <strong>Waktu:</strong> {form.time || '-'}<br />
              <strong>Cuaca:</strong> {form.weather || '-'}<br />
              <strong>Project:</strong> {form.project || '-'}
            </div>
            <div>
              <strong>Pit:</strong> {form.pit || '-'}<br />
              <strong>Block:</strong> {form.block || '-'}<br />
              <strong>Seam:</strong> {form.seam || '-'}<br />
              <strong>RL:</strong> {form.rl || '-'}
            </div>
            <div>
              <strong>Volume:</strong> {form.coalVolume || '-'}<br />
              <strong>Checklist:</strong> {Object.values(checks).filter(c => c && c.checked).length}/{t.checklist.length} ✅<br />
              <strong>Foto Evidence:</strong> {Object.values(checks).filter(c => c && c.evidence).length}<br />
              <strong>Foto Umum:</strong> {generalPhotos.length}
            </div>
            <div>
              <strong>Completion:</strong> {Math.round((Object.values(checks).filter(c => c && c.status).length / t.checklist.reduce((acc, group) => acc + (group.items ? group.items.length : 1), 0)) * 100)}%<br />
              <strong>Y Status:</strong> {Object.values(checks).filter(c => c && c.status === 'Y').length}<br />
              <strong>N Status:</strong> {Object.values(checks).filter(c => c && c.status === 'N').length}<br />
              <strong>N/A Status:</strong> {Object.values(checks).filter(c => c && c.status === 'N/A').length}
            </div>
          </div>
        </div>

        {/* FOOTNOTE */}
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#94a3b8', marginTop: '24px' }}>
          🏭 KPP-FGDP Data Analyst | Project Dandy - Berita Acara Generator v1.0
        </div>
      </div>
    </div>
  );
}

// Render the component
ReactDOM.render(<TemplateGenerator />, document.getElementById("root"));
