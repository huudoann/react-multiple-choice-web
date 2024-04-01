import React, { useState, useEffect } from "react";
import "./StudentTable.scss"; // Import CSS file
import AdminNavBar from '../../components/NavBar/AdminNavBar';


function StudentTable() {
  const [students, setStudents] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    // Gửi request đến backend để lấy dữ liệu sinh viên
    fetch("http://localhost:8080/api/user/all-users")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const handleDownloadPDF = () => {
    window.print(); // In cả trang khi người dùng nhấn vào nút
  };

  const getAvgScore = (student) => {
    if (student.examResults) {
      let sum = 0;
      student.examResults.forEach((examResult) => {
        sum += examResult.score;
      });
      return sum / student.examResults.length;
    }
    return 0;
  };

  const filteredStudents = students.filter((student) =>
    student.username.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="studentTable">
      <div className="navigation">
        <AdminNavBar />
      </div>
      <div className="container">
        <h1>Bảng thống kê sinh viên</h1>
        <input className="filterBar"
          type="text"
          placeholder="Lọc"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <table className="table-container">
          <thead>
            <tr>
              <th>STT</th>
              <th>Họ và tên</th>
              <th>Số lần tham gia</th>
              <th>Điểm trung bình</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{student.username}</td>
                <td>{student.examAttempts ? student.examAttempts.length : 0}</td>
                <td>{getAvgScore(student) ? getAvgScore(student) : 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="getPDF">
          <button onClick={handleDownloadPDF}>Xuất PDF</button>
        </div>
      </div>
    </div>
  );
}

export default StudentTable;
