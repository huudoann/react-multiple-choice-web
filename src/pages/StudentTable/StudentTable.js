import React, { useState, useEffect } from "react";
import "./StudentTable.scss"; // Import CSS file
import AdminNavBar from '../../components/NavBar/AdminNavBar';
import { endPoint } from '../../util/api/endPoint';
import { Request } from '../../util/axios';
import axios from 'axios'
import SimpleCharts from './BarChart';

const StudentTable = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [userDataFetched, setUserDataFetched] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Không tìm thấy token trong Localstorage!");
      }

      try {
        const response = await Request.Server.get(endPoint.getAllUsers());
        console.log(response);
        setUsers(response);
        setUserDataFetched(true);

      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu users:', error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (userDataFetched) {
      const fetchData = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Không tìm thấy token trong Localstorage!");
        }

        try {
          const userIds = users.map(user => user.userId);

          const userPromises = userIds.map(async userId => {
            const [examAttemptsResponse, examResultsResponse] = await Promise.all([
              axios.get(`http://localhost:8080/api/exam-attempt/user/${userId}`),
              axios.get(`http://localhost:8080/api/exam-result/user/${userId}`)
            ]);

            return {
              userId,
              examAttempts: examAttemptsResponse.data,
              examResults: examResultsResponse.data
            };
          });

          const usersData = await Promise.all(userPromises);
          console.log("Dữ liệu users:", usersData);

          // Cập nhật mảng users với examAttempts và examResults
          const updatedUsers = users.map(user => {
            const userData = usersData.find(data => data.userId === user.userId);
            return {
              ...user,
              examAttempts: userData ? userData.examAttempts : [],
              examResults: userData ? userData.examResults : [],
            };
          });

          setUsers(updatedUsers);
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu users:', error.message);
        }
      };

      fetchData();
    }
  }, [userDataFetched]);


  const handleDownloadPDF = () => {
    window.print(); // In cả trang khi người dùng nhấn vào nút
  };

  const getAvgScore = (student) => {
    if (student.examResults) {
      let sum = 0;
      student.examResults.forEach((examResult) => {
        sum += examResult.score;
      });
      
      return Number(sum / student.examResults.length).toFixed(2);
    }
    return 0;
  };

  const filteredStudents = users.filter((student) =>
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
        <h1>Biểu đồ phân phối điểm trung bình</h1>
        <SimpleCharts/>
        <div className="getPDF">
          <button onClick={handleDownloadPDF}>Xuất PDF</button>
        </div>
      </div>
    </div>
  );
}

export default StudentTable;
