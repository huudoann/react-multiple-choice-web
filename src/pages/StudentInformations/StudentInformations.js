import React, { useState } from "react";
import "./StudentInformations.scss";

function SearchSection() {
  const [studentData, setStudentData] = useState(null);
  const [studentId, setStudentId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Gọi API để lấy dữ liệu sinh viên dựa trên mã sinh viên
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/users`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }

      const data = await response.json();
      setStudentData(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleChange = (event) => {
    setStudentId(event.target.value);
  };

  return (
    <>
      <div className="container">
        <h1>Tra cứu điểm sinh viên</h1>
        <form id="search-form" onSubmit={handleSubmit}>
          <label htmlFor="student-id">Nhập mã sinh viên:</label>
          <input
            type="text"
            id="student-id"
            name="student-id"
            required
            value={studentId}
            onChange={handleChange}
          />
          <button className="search-btn" type="submit">
            Tra cứu
          </button>
        </form>
        <div id="result">
          {studentData && (
            <div>
              <h2>Thông tin sinh viên</h2>
              <p>Mã sinh viên: {studentData.id}</p>
              <p>Tên sinh viên: {studentData.name}</p>
              <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Môn học</th>
                        <th>Điểm</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Toán</td>
                        <td>9.5</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Lý</td>
                        <td>8.5</td>
                    </tr>
                    <tr>
                        <td>3</td>
                        <td>Hóa</td>
                        <td>7.5</td>
                    </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default SearchSection;
