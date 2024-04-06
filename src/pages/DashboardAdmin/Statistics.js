import React, { useEffect, useState } from 'react';
import './Statistics.scss';
import { Request } from '../../util/axios'
import { endPoint } from '../../util/api/endPoint'
const Statistics = () => {
    const [examParticipants, setExamParticipants] = useState([]);
    console.log(examParticipants);

    // Sử dụng useEffect để gọi hàm cập nhật thống kê khi component được render
    useEffect(() => {
        const getAllStatistic = async () => {
            try {
                const response = await Request.Server.get(endPoint.getAllStatistic());
                setExamParticipants(response)
            } catch (error) {
                console.log(error);
            }
        }
        getAllStatistic()
    }, []);

    return (
        <div className='Statistics'>
            <div className="statistics-container">
                {/* Hiển thị thông tin thống kê */}
                {examParticipants && examParticipants.length !== 0 ? (
                    examParticipants.map((exam, index) => (
                        <div key={index}>
                            <p id="examStatisticId">Kỳ thi: {exam.examId}</p>
                            <p id='examName'>Tên kỳ thi: {exam.examName}</p>
                            <p id='totalParticipants'>Số lượng người dùng tham gia: {exam.participants}</p>
                            <p id='completionRate'>Tỉ lệ hoàn thành: {exam.completionRate}%</p>
                            <p id='averageScore'>Điểm trung bình: {exam.averageScore}</p>
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>Không có dữ liệu thống kê</p>
                )}
            </div>
        </div>
    );
}

export default Statistics;
