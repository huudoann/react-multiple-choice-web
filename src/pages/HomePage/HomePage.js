import React, { useEffect } from 'react';
import './HomePage.scss';
import NavBar from '../NavBar/NavBar';

const examSubjects = {
    "Luyện tập": [
        { name: "Tin học cơ sở", status: "free" },
        { name: "Lập trình Web", status: "free" }
    ],
    "Giữa kỳ": [
        { name: "Lý thuyết thông tin", status: "20/4/2024" },
        { name: "Trắc nghiệm Toán rời rạc", status: "25/4/2024" },
    ],
    "Cuối kỳ": [
        { name: "Đại số", status: "30/4/2024" }
    ]
};

const MainPage = () => {
    useEffect(() => {
        displayAllSubjects();
    }, []);

    const startExam = (examName) => {
        window.location.href = "baiThi.html";
    };

    const displayAllSubjects = () => {
        const examInfoDiv = document.getElementById('examInfoList');
        examInfoDiv.innerHTML = '';
        let count = 1;

        Object.keys(examSubjects).forEach((examType) => {
            const examSubjectsList = examSubjects[examType];
            if (examSubjectsList) {
                examSubjectsList.forEach((exam) => {
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
                    statusSpan.textContent = exam.status === 'free' ? 'Tự do' : exam.status;
                    statusSpan.classList.add('exam-status');
                    if (exam.status === 'free') {
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

        const examSubjectsList = examSubjects[examType];
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
                statusSpan.textContent = exam.status === 'free' ? 'Tự do' : exam.status;
                statusSpan.classList.add('exam-status');
                if (exam.status === 'free') {
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
        examInfoDiv.innerHTML = ''; // Xóa nội dung cũ
        let count = 1; // Counter for numbering subjects

        Object.keys(examSubjects).forEach((examType) => {
            const examSubjectsList = examSubjects[examType];
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
                    statusSpan.textContent = exam.status === 'free' ? 'Tự do' : exam.status;
                    statusSpan.classList.add('exam-status');
                    if (exam.status === 'free') {
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
                <h1>Hệ Thống Thi Trắc Nghiệm Trực Tuyến</h1>
            </header>
            <div id="examList">
                <button className="exam-item" onClick={() => showAllExams()}>Tất cả</button>
                <button className="exam-item" onClick={() => showExams('Luyện tập')}>Luyện tập</button>
                <button className="exam-item" onClick={() => showExams('Giữa kỳ')}>Giữa kỳ</button>
                <button className="exam-item" onClick={() => showExams('Cuối kỳ')}>Cuối kỳ</button>
                <input type="text" id="searchInput" onKeyUp={() => searchExam()} placeholder="Tìm kiếm theo tên kỳ thi..." />
            </div>

            <div id="examInfoList"></div>
        </div>
    );
};

export default MainPage;
