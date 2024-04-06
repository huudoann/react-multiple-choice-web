import * as React from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import { useEffect, useState } from "react";
import { endPoint } from "../../util/api/endPoint";
import { Request } from "../../util/axios";
import axios from "axios";

export default function SimpleCharts() {
  const [users, setUsers] = useState([]);
  const [userDataFetched, setUserDataFetched] = useState(false);
  const dataset = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

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
        console.error("Lỗi khi lấy dữ liệu users:", error.message);
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
          const userIds = users.map((user) => user.userId);

          const userPromises = userIds.map(async (userId) => {
            const [examAttemptsResponse, examResultsResponse] =
              await Promise.all([
                axios.get(
                  `http://localhost:8080/api/exam-attempt/user/${userId}`
                ),
                axios.get(
                  `http://localhost:8080/api/exam-result/user/${userId}`
                ),
              ]);

            return {
              userId,
              examAttempts: examAttemptsResponse.data,
              examResults: examResultsResponse.data,
            };
          });

          const usersData = await Promise.all(userPromises);
          console.log("Dữ liệu users:", usersData);

          // Cập nhật mảng users với examAttempts và examResults
          const updatedUsers = users.map((user) => {
            const userData = usersData.find(
              (data) => data.userId === user.userId
            );
            return {
              ...user,
              examAttempts: userData ? userData.examAttempts : [],
              examResults: userData ? userData.examResults : [],
            };
          });

          setUsers(updatedUsers);
        } catch (error) {
          console.error("Lỗi khi lấy dữ liệu users:", error.message);
        }
      };

      fetchData();
    }
  }, [userDataFetched]);

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

  const cal = (users) => {
    users.forEach((user) => {
      dataset[parseInt(getAvgScore(user))] += 1;
    });
  };

  cal(users);

  return (
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
  );
}
