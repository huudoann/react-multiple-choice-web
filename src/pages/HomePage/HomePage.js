import React, { useEffect, useState } from 'react';
import './HomePage.scss';
import NavBar from '../../components/NavBar/NavBar';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExamTable = ({ exams, startExam }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Exam Name</th>
                    <th>Exam Type</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                </tr>
            </thead>
            <tbody>
                {exams.map((exam, index) => (
                    <tr key={exam.examId}>
                        <td>{index + 1}</td>
                        <td className="exam-name" onClick={() => startExam(exam.examId)}>{exam.examName}</td>
                        <td>{exam.examType}</td>
                        <td>{exam.startTime}</td>
                        <td>{exam.endTime}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const MainPage = () => {
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let token = localStorage.getItem('token');

        if (!token) {
            throw new Error('Token không tồn tại trong localStorage');
        } else {
            try {
                const response = await axios.get(`http://localhost:8080/api/exam/get-all-exams`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const apiData = response.data;
                setExams(apiData);
                setFilteredExams(apiData);
                console.log("Lấy dữ liệu bài ktra thành công", apiData);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách các bài kiểm tra:', error.message);
            }
        }
    };

    const startExam = (examId) => {
        localStorage.setItem('examId', examId);
        navigate(`/exam`);
    };

    const filterExams = (examType) => {
        if (examType === 'Tất cả') {
            setFilteredExams(exams);
        } else {
            const filtered = exams.filter(exam => exam.examType === examType);
            setFilteredExams(filtered);
        }
    };

    const showExams = (examType) => {
        const examInfoDiv = document.getElementById('examInfoList');
        examInfoDiv.innerHTML = '';
        let count = 1;

        const examSubjectsList = exams.filter(exam => exam.examType === examType);
        if (examSubjectsList.length > 0) {
            examSubjectsList.forEach((exam) => {
                const subjectDiv = document.createElement('div');
                subjectDiv.classList.add('exam-info');

                const subjectNameSpan = document.createElement('span');
                subjectNameSpan.classList.add('exam-name');
                subjectNameSpan.textContent = count + ". " + exam.examName;
                subjectNameSpan.onclick = () => {
                    startExam(exam.examName, exam.examId);
                };
                subjectDiv.appendChild(subjectNameSpan);

                const modeSpan = document.createElement('span');
                modeSpan.classList.add('exam-type');
                modeSpan.textContent = exam.examType;
                subjectDiv.appendChild(modeSpan);

                const statusSpan = document.createElement('span');
                statusSpan.textContent = exam.startTime === 'free' ? 'Tự do' : exam.startTime;
                statusSpan.classList.add('exam-status');
                if (exam.startTime === 'free') {
                    statusSpan.classList.add('exam-status-free');
                } else {
                    statusSpan.classList.add('exam-status-timed');
                }
                subjectDiv.appendChild(statusSpan);

                examInfoDiv.appendChild(subjectDiv);
                count++;
            });
        } else {
            examInfoDiv.textContent = 'Không có kỳ thi nào trong danh mục này.';
        }
    };

    const showAllExams = () => {
        const examInfoDiv = document.getElementById('examInfoList');
        examInfoDiv.innerHTML = '';
        let count = 1;

        if (exams.length > 0) {
            exams.forEach((exam) => {
                const subjectDiv = document.createElement('div');
                subjectDiv.classList.add('exam-info');

                const subjectNameSpan = document.createElement('span');
                subjectNameSpan.classList.add('exam-name');
                subjectNameSpan.textContent = count + ". " + exam.examName;
                subjectNameSpan.onclick = () => {
                    startExam(exam.examName, exam.examId);
                };
                subjectDiv.appendChild(subjectNameSpan);

                const modeSpan = document.createElement('span');
                modeSpan.classList.add('exam-type');
                modeSpan.textContent = exam.examType;
                subjectDiv.appendChild(modeSpan);

                const statusSpan = document.createElement('span');
                statusSpan.textContent = exam.startTime === 'free' ? 'Tự do' : exam.startTime;
                statusSpan.classList.add('exam-status');
                if (exam.startTime === 'free') {
                    statusSpan.classList.add('exam-status-free');
                } else {
                    statusSpan.classList.add('exam-status-timed');
                }
                subjectDiv.appendChild(statusSpan);

                examInfoDiv.appendChild(subjectDiv);
                count++;
            });
        } else {
            examInfoDiv.textContent = 'Không có kỳ thi nào.';
        }
    };

    const searchExam = () => {
        let input, filter, examInfoDiv, examDiv, txtValue;
        input = document.getElementById('searchInput');
        filter = input.value.toUpperCase();
        examInfoDiv = document.getElementById('examInfoList');
        examDiv = examInfoDiv.getElementsByClassName('exam-info');

        for (let i = 0; i < examDiv.length; i++) {
            txtValue = examDiv[i].textContent || examDiv[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                examDiv[i].style.display = '';
            } else {
                examDiv[i].style.display = 'none';
            }
        }
    };

    return (
        <div className="home-container">
            <header>
                <NavBar />
                <h1>Hệ Thống Thi Trắc Nghiệm Trực Tuyến</h1>
            </header>
            <div id="examList">
                <button className="exam-item" onClick={() => filterExams('Tất cả')}>Tất cả</button>
                <button className="exam-item" onClick={() => filterExams('Luyện tập')}>Luyện tập</button>
                <button className="exam-item" onClick={() => filterExams('Giữa kỳ')}>Giữa kỳ</button>
                <button className="exam-item" onClick={() => filterExams('Cuối kỳ')}>Cuối kỳ</button>
                <div style={{ position: 'relative', width: '70%' }}>
                    <input type="text" id="searchInput" placeholder="Tìm kiếm theo tên kỳ thi..." style={{ width: '97%', paddingLeft: '2rem' }} />
                    <Search style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#aaa' }} />
                </div>
            </div>

            <div id="examInfoList">
                <ExamTable exams={filteredExams} startExam={startExam} />
            </div>
        </div>
    );
};

export default MainPage;