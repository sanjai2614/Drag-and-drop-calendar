import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportPdf = (events) => {
  if (!events.length) {
    alert("No tasks to export");
    return;
  }

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Calendar Tasks", 14, 20);

  const tableData = events.map((item) => [
    new Date(item.start).toLocaleDateString("en-GB"),
    item.title,
  ]);

  autoTable(doc, {
    head: [["Date", "Task"]],
    body: tableData,
    startY: 30,
    theme: "grid",
    headStyles: {
      fillColor: [37, 99, 235],
    },
  });

  doc.save("Calendar_Tasks.pdf");
};
