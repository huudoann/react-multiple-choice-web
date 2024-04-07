import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import AdminNavBar from "../../components/NavBar/AdminNavBar";
import "./ExamStatistic.scss";

export default function ExamStatistic() {
  const [optionsExamId, setOptionsExamId] = useState("1");
  const [dataset, setDataset] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  const [listOptionsExamId, setListOptionsExamId] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Không tìm thấy token trong Localstorage!");
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/exam/get-all-exams`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setListOptionsExamId(data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu exam-result:", error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Không tìm thấy token trong Localstorage!");
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/exam-result/exam/${optionsExamId}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        var tempDataset = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        data.forEach((element) => {
          tempDataset[element.score]++;
        }); // Add closing parenthesis here
        setDataset(tempDataset);
        console.log("Dataset:", dataset);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu exam-result:", error.message);
      }
    };
    fetchData();
  }, [optionsExamId]);

  const handleDownloadPDF = () => {
    window.print(); // In cả trang khi người dùng nhấn vào nút
  };

  return (
    <div className="exam-statistic">
      <div className="navigation">
        <AdminNavBar />
      </div>
      <div className="container">
        <h1>Biều đồ phân phối điểm</h1>
        <BarChart
          xAxis={[
            {
              id: "barCategories",
              data: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
              scaleType: "band",
            },
          ]}
          series={[
            {
              data: dataset,
              color: "#cf443a",
            },
          ]}
          width={1000}
          height={500}
        />
        <div>
          <select
            value={optionsExamId}
            onChange={(event) => setOptionsExamId(event.target.value)}
          >
            {listOptionsExamId.map((option) => (
              <option key={option.examId} value={option.examId}>
                {option.examName}
              </option>
            ))}
          </select>
        </div>
        <div className="getPDF">
          <button onClick={handleDownloadPDF}>Xuất PDF</button>
        </div>
      </div>
    </div>
  );
}
