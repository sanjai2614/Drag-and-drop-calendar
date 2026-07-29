import * as XLSX from "xlsx";

export const excelExport = (events) => {
  if (events.length === 0) {
    alert("No tasks to export");
    return;
  }

  const excelData = events.map((item) => ({
    Date: new Date(item.start).toLocaleDateString("en-GB"),
    Task: item.title,
  }));

  const worksheet = XLSX.utils.json_to_sheet(excelData);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");

  XLSX.writeFile(workbook, "calender.xlsx");

  //     type: "array",
  //     bookType: "xlsx",
  //   });

  //   const file = new Blob([excelBuffer], {
  //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //   });

  //   saveAs(file, "Calendar_tasks.xlsx");
};
