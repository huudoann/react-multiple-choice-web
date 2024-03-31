import React, { useEffect, useState } from 'react';
import './Statistics.scss';

const Statistics = () => {
    const [examParticipants, setExamParticipants] = useState([]);

    // Hàm cập nhật thống kê
    const updateStatistics = () => {
        setExamParticipants([
            { examResultId: 2, score: 2, status: "completed", userId: 100, examId: 2 },
            // { examName: 'Toán rời rạc', participants: 150, completionRate: 75, averageScore: 8.0 },
            // { examName: 'Lí thuyết thông tin', participants: 80, completionRate: 90, averageScore: 8.5 },
            // { examName: 'Tin học cơ sở', participants: 120, completionRate: 85, averageScore: 7.8 },
            // { examName: 'Triết học', participants: 200, completionRate: 70, averageScore: 7.0 }
        ]);
    };

    // Sử dụng useEffect để gọi hàm cập nhật thống kê khi component được render
    useEffect(() => {
        updateStatistics();
    }, []);

    return (
        <div className='Statistics'>
            <div className="statistics-container">
                {/* Hiển thị thông tin thống kê */}
                {examParticipants.map((exam, index) => (
                    <div key={index}>
                        <p>Kỳ thi: {exam.examId}</p>
                        <p>Số lượng người dùng tham gia: {exam.userId}</p>
                        <p>Trạng thái: {exam.status}</p>
                        <p>Điểm trung bình: {exam.examResultId}</p>
                        <hr />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Statistics;
