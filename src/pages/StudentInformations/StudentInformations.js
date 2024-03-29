import React, { useState } from "react";
import "./StudentInformations.scss";

function SearchSection() {
  const [students, setStudents] = useState([]);
  const [searchStudentId, setSearchStudentId] = useState("");
  const [foundStudent, setFoundStudent] = useState(null);
  const [inputStudentId, setInputStudentId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Gọi API để lấy dữ liệu sinh viên dựa trên mã sinh viên
      const response = await fetch(`http://localhost:3001/students`);

      if (!response.ok) {
        throw new Error("Failed to fetch student data");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching student data:", error);
    }
  };

  const handleChange = (event) => {
    setInputStudentId(event.target.value);
  };

  const searchStudent = () => {
    const found = students.find((student) => student.id === searchStudentId);
    setFoundStudent(found);
    console.log(found);
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
            value={inputStudentId}
            onChange={handleChange}
          />
          <button
            onClick={() => {
              setSearchStudentId(inputStudentId);
              searchStudent();
            }}
          >
            Tìm kiếm
          </button>
        </form>
        <div id="result">
          {foundStudent && (
            <div>
              <div className="student-info">
                <h2>Thông tin sinh viên</h2>
                <p>Mã sinh viên: {foundStudent.id}</p>
                <p>Tên sinh viên: {foundStudent.name}</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Môn học</th>
                    <th>Thời gian tham gia</th>
                    <th>Điểm</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {foundStudent.subject.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>{item.time}</td>
                      <td>{item.score}</td>
                      <td>
                        <button>Xem chi tiết</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {foundStudent === undefined && searchStudentId !== "" && (
            <p className="notFound">Không tìm thấy sinh viên!!!</p>
          )}
          
        </div>
      </div>
    </>
  );
}

export default SearchSection;
