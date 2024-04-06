import React, { useEffect, useState } from "react";
import "./SearchStudentInformations.scss";
import AdminNavBar from '../../components/NavBar/AdminNavBar';
import axios from 'axios';

const SearchSection = () => {
  const [students, setStudents] = useState([]);
  const [searchStudentId, setSearchStudentId] = useState("");
  const [foundStudent, setFoundStudent] = useState(null);
  const [inputStudentId, setInputStudentId] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // try {
    //   // Gọi API để lấy dữ liệu sinh viên dựa trên mã sinh viên
    //   const response = await fetch(`http://localhost:8080/api/user/all-users`);

    //   if (!response.ok) {
    //     throw new Error("Failed to fetch student data");
    //   }

    //   const data = await response.json();
    //   setStudents(data);
    // } catch (error) {
    //   console.error("Error fetching student data:", error);
    // }
  };

  const NavigateToStudentExamResult = (examId) => {
    localStorage.setItem("examId", examId);
    localStorage.setItem("userId", foundStudent.userId);
    // Navigate to StudentExamResult page
    window.location.href = `/result-admin`;

  }
  const handleDownloadPDF = () => {
    window.print(); // In cả trang khi người dùng nhấn vào nút
  };

  const handleChange = (event) => {
    setInputStudentId(event.target.value);
  };

  const fetchStudentExamResults = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/exam-result/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student exam results:', error.message);
      return [];
    }
  };

  const fetchExamName = async (examId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/exam/${examId}`);
      return response.data.examName;
    } catch (error) {
      console.error('Error fetching exam name:', error.message);
      return '';
    }
  };

  const fetchExamEndTime = async (examId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/exam-attempt/exam/${examId}`);
      console.log(response.data);

      // Duyệt qua mảng dữ liệu để tìm phần tử có examId trùng với examId cần tìm
      const foundExamAttempt = response.data.find((item) => item.examId === examId);
      if (foundExamAttempt) {
        console.log(foundExamAttempt.endTime);
        return foundExamAttempt.endTime;
      } else {
        console.log(`Không tìm thấy thông tin cho examId ${examId}`);
        return '';
      }
    } catch (error) {
      console.error('Error fetching exam name:', error.message);
      return '';
    }
  };

  const searchStudent = async () => {
    const foundById = students.find((student) => student.userId === parseInt(searchStudentId));
    const foundByName = students.find((student) => student.username === searchStudentId);
    const found = foundById || foundByName;

    if (found) {
      try {
        const examResults = await fetchStudentExamResults(found.userId);
        const examResultsWithNames = await Promise.all(
          examResults.map(async (result) => ({
            ...result,
            examName: await fetchExamName(result.examId),
            endTime: await fetchExamEndTime(result.examId)
          }))
        );
        setFoundStudent({ ...found, examResults: examResultsWithNames });
      } catch (error) {
        console.error('Error fetching student exam results:', error.message);
      }
    } else {
      setFoundStudent(null);
    }
  };

  // const getExamName = (examId) => {
  //   const exam = exams.find((exam) => exam.examId === examId);
  //   return exam ? exam.examName : "";
  // };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Gọi API để lấy dữ liệu sinh viên dựa trên mã sinh viên
        const response = await fetch(`http://localhost:8080/api/user/all-users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch student data");
        }

        const studentData = await response.json();
        setStudents(studentData);

      } catch (error) {
        console.error("Error fetching student data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    searchStudent();
  }, [searchStudentId]);

  return (
    <div className="SearchStudentInformations">
      <div className="navigation">
        <AdminNavBar />
      </div>
      <div className="container">
        <h1>Tra cứu điểm sinh viên</h1>
        <form id="search-form" onSubmit={handleSubmit}>
          <div className="input-student-box">
            <label htmlFor="student-id">Nhập mã sinh viên hoặc tên sinh viên:</label>
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
                setSearchStudentId(inputStudentId); // Cập nhật giá trị của searchStudentId
                // searchStudent(); // Gọi hàm searchStudent sau khi đã cập nhật giá trị
              }}
            >
              Tìm kiếm
            </button></div>

        </form>
        <div id="result">
          {foundStudent && (
            <div>
              <div className="student-info">
                <h2>Thông tin sinh viên</h2>
                <p>Tên: {foundStudent.username} - MSV: {foundStudent.userId}</p>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Bài thi</th>
                    <th>Thời gian hoàn thành</th>
                    <th>Trạng thái</th>
                    <th>Điểm</th>
                    <th></th>
                  </tr>
                </thead>
                {foundStudent && foundStudent.examResults && (
                  <tbody>
                    {foundStudent.examResults.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.examName}</td>
                        <td>{item.endTime}</td>
                        <td>{item.status === 'completed' ? 'Đã hoàn thành' : item.status}</td>
                        <td>{item.score}</td>
                        <td>
                          <button className="button" onClick={() => { NavigateToStudentExamResult(item.examId) }}>Xem chi tiết</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          )}
          {foundStudent === undefined && searchStudentId !== "" && (
            <p className="notFound">Không tìm thấy sinh viên!!!</p>
          )}
        </div>
        <div className="getPDF">
          <button onClick={handleDownloadPDF}>
            Tải xuống báo cáo dưới dạng pdf
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchSection;
