import React, { useEffect, useState } from 'react';
import './HomePage.scss';
import NavBar from '../../components/NavBar/NavBar';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const [sets, setSets] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            let token = localStorage.getItem('token');

            // Kiểm tra xem token có tồn tại không
            if (!token) {
                throw new Error('Token không tồn tại trong localStorage');
            } else {
                try {
                    // Thực hiện gọi API ở đây
                    const response = await axios.get(`http://localhost:8080/api/exam/get-all-exams`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    // Dữ liệu từ API
                    const apiData = response.data;

                    // Cập nhật dữ liệu vào examSubjects
                    const updatedExamSubjects = {};
                    Object.keys(apiData).forEach(examType => {
                        updatedExamSubjects[examType] = apiData[examType].map(exam => ({
                            name: exam.examName,
                            status: {
                                beginDate: exam.beginDate,
                                endDate: exam.endDate
                            }
                        }));
                    });

                    setSets(updatedExamSubjects);
                    console.log('Lấy dữ liệu bài kiểm tra thành công', response.data);

                    displayAllSubjects();
                } catch (error) {
                    console.error('Lỗi khi lấy danh sách các bài kiểm tra:', error.message);
                }
            }
        };

        fetchData();
    }, []);

    const startExam = (examName, examId) => {
        localStorage.setItem('examId', examId);
        navigate(`/exam`);
    };

    const displayAllSubjects = () => {
        const examInfoDiv = document.getElementById('examInfoList');
        examInfoDiv.innerHTML = '';
        let count = 1;

        Object.keys(sets).forEach(examType => {
            const examSubjectsList = sets[examType];
            if (examSubjectsList) {
                examSubjectsList.forEach(exam => {
                    const subjectDiv = document.createElement('div');
                    subjectDiv.classList.add('exam-info');

                    const subjectNameSpan = document.createElement('span');
                    subjectNameSpan.classList.add('exam-name');
                    subjectNameSpan.textContent = count + ". " + exam.name;
                    subjectNameSpan.onclick = () => {
                        startExam(exam.name);
                    };
                    subjectDiv.appendChild(subjectNameSpan);

                    const modeSpan = document.createElement('span');
                    modeSpan.classList.add('exam-type');
                    modeSpan.textContent = examType;
                    subjectDiv.appendChild(modeSpan);

                    const statusSpan = document.createElement('span');
                    statusSpan.textContent = exam.status.beginDate === 'free' ? 'Tự do' : exam.status.beginDate;
                    statusSpan.classList.add('exam-status');
                    if (exam.status.beginDate === 'free') {
                        statusSpan.classList.add('exam-status-free');
                    } else {
                        statusSpan.classList.add('exam-status-timed');
                    }
                    subjectDiv.appendChild(statusSpan);

                    examInfoDiv.appendChild(subjectDiv);
                    count++;
                });
            }
        });
    };

    const showExams = (examType) => {
        const examInfoDiv = document.getElementById('examInfoList');
        examInfoDiv.innerHTML = '';
        let count = 1;

        const examSubjectsList = sets[examType];
        if (examSubjectsList) {
            examSubjectsList.forEach((exam) => {
                const subjectDiv = document.createElement('div');
                subjectDiv.classList.add('exam-info');

                const subjectNameSpan = document.createElement('span');
                subjectNameSpan.classList.add('exam-name');
                subjectNameSpan.textContent = count + ". " + exam.name;
                subjectDiv.appendChild(subjectNameSpan);

                const modeSpan = document.createElement('span');
                modeSpan.classList.add('exam-type');
                modeSpan.textContent = examType;
                subjectDiv.appendChild(modeSpan);

                const statusSpan = document.createElement('span');
                statusSpan.textContent = exam.status.beginDate === 'free' ? 'Tự do' : exam.status.beginDate;
                statusSpan.classList.add('exam-status');
                if (exam.status.beginDate === 'free') {
                    statusSpan.classList.add('exam-status-free');
                } else {
                    statusSpan.classList.add('exam-status-timed');
                }
                subjectDiv.appendChild(statusSpan);

                examInfoDiv.appendChild(subjectDiv);
                count++;
            });
        }
    };

    const showAllExams = () => {
        const examInfoDiv = document.getElementById('examInfoList');
        examInfoDiv.innerHTML = '';
        let count = 1;

        Object.keys(sets).forEach((examType) => {
            const examSubjectsList = sets[examType];
            if (examSubjectsList) {
                examSubjectsList.forEach((exam) => {
                    const subjectDiv = document.createElement('div');
                    subjectDiv.classList.add('exam-info');

                    const subjectNameSpan = document.createElement('span');
                    subjectNameSpan.classList.add('exam-name');
                    subjectNameSpan.textContent = count + ". " + exam.name;
                    subjectDiv.appendChild(subjectNameSpan);

                    const modeSpan = document.createElement('span');
                    modeSpan.classList.add('exam-type');
                    modeSpan.textContent = examType;
                    subjectDiv.appendChild(modeSpan);

                    const statusSpan = document.createElement('span');
                    statusSpan.textContent = exam.status.beginDate === 'free' ? 'Tự do' : exam.status.beginDate;
                    statusSpan.classList.add('exam-status');
                    if (exam.status.beginDate === 'free') {
                        statusSpan.classList.add('exam-status-free');
                    } else {
                        statusSpan.classList.add('exam-status-timed');
                    }
                    subjectDiv.appendChild(statusSpan);

                    examInfoDiv.appendChild(subjectDiv);
                    count++;
                });
            }
        });
    };

    const searchExam = () => {
        let input, filter, examInfoDiv, examDiv, txtValue;
        input = document.getElementById('searchInput');
        filter = input.value.toUpperCase();
        examInfoDiv = document.getElementById('examInfoList');
        examDiv = examInfoDiv.getElementsByTagName('div');

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
                <button className="exam-item" onClick={() => showAllExams()}>Tất cả</button>
                <button className="exam-item" onClick={() => showExams('Luyện tập')}>Luyện tập</button>
                <button className="exam-item" onClick={() => showExams('Giữa kỳ')}>Giữa kỳ</button>
                <button className="exam-item" onClick={() => showExams('Cuối kỳ')}>Cuối kỳ</button>
                <div style={{ position: 'relative', width: '71%' }}>
                    <input type="text" id="searchInput" onKeyUp={() => searchExam()} placeholder="Tìm kiếm theo tên kỳ thi..." style={{ width: '100%', paddingLeft: '2rem' }} />
                    <Search style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#aaa' }} />
                </div>
            </div>

            <div id="examInfoList"></div>
        </div>
    );
};

export default MainPage;
