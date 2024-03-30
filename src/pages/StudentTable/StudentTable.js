import React, { useState, useEffect } from "react";
import "./StudentTable.scss"; // Import CSS file

function StudentTable() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Gửi request đến backend để lấy dữ liệu sinh viên
    fetch("http://localhost:3001/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDownloadPDF = () => {
    window.print(); // In cả trang khi người dùng nhấn vào nút
  };

  return (
    <>
      <h1>Student Table</h1>
      <table className="table-container">
        <thead>
          <tr>
            <th>STT</th>
            <th>Họ và tên</th>
            <th>Mã sinh viên</th>
            <th>Số lần tham gia</th>
            <th>Điểm trung bình</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{student.name}</td>
              <td>{student.id}</td>
              <td>{student.attemps}</td>
              <td>{student.avg}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="getPDF">
        <button onClick={handleDownloadPDF}>Tải xuống báo cáo dưới dạng pdf</button>
      </div>
    </>
  );
} 

export default StudentTable;
