import React, { useEffect, useState } from 'react';
import './HomePage.scss';
import NavBar from '../../components/NavBar/NavBar';
import { Search } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ExamTable = ({ exams, startExam, goToSubmit }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Tên bài thi</th>
                    <th>Hình thức thi</th>
                    <th>Thời gian bắt đầu</th>
                    <th>Thời gian kết thúc</th>
                    <th>Trạng Thái</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {exams.map((exam, index) => (
                    <tr key={exam.examId}>
                        <td>{index + 1}</td>
                        <td className="exam-name">{exam.examName}</td>
                        <td>{exam.examType}</td>
                        <td>{exam.startTime}</td>
                        <td>{exam.endTime}</td>
                        <td>{exam.status}</td>
                        <td className='note-class'>
                            {exam.status === 'Đã hoàn thành' ? (
                                <p className='done' onClick={() => goToSubmit(exam.examId)} >
                                    Xem kết quả
                                </p>
                            ) : (
                                <p onClick={() => startExam(exam.examId)}>
                                    Làm bài
                                </p>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

const MainPage = () => {
    const [exams, setExams] = useState([]);
    const [examResults, setExamResults] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [showModal, setShowModal] = useState(false); // State để kiểm soát việc hiển thị modal
    const [examIdToStart, setExamIdToStart] = useState(null); // State để lưu ID của bài thi muốn bắt đầu
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        let token = localStorage.getItem('token');
        const userId = localStorage.getItem("userId");

        if (!token) {
            throw new Error('Token không tồn tại trong localStorage');
        } else {
            try {
                const [examsResponse, examResultsResponse] = await Promise.all([
                    axios.get(`http://localhost:8080/api/exam/get-all-exams`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }),
                    axios.get(`http://localhost:8080/api/exam-result/user/${userId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                ]);

                const examsData = examsResponse.data;
                const examResultsData = examResultsResponse.data;

                const updatedExams = examsData.map(exam => {
                    const result = examResultsData.find(result => result.examId === exam.examId);
                    const status = result && result.status === 'completed' ? 'Đã hoàn thành' : 'Chưa hoàn thành';
                    return { ...exam, status };
                });

                setExams(updatedExams);
                setFilteredExams(updatedExams);
                console.log("Lấy dữ liệu thành công", updatedExams);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error.message);
            }
        }
    };

    const startExam = (examId) => {
        const confirmMessage = "Bạn chắc chắn muốn bắt đầu bài kiểm tra không?\n\nLưu ý: Thời gian sẽ tính khi bấm nút 'Bắt đầu'";
        // Xác nhận hiển thị modal khi nhấn nút "Làm bài"
        setExamIdToStart(examId);
        setShowModal(true);
    };

    const onCancel = () => {
        setShowModal(false);
    };

    const onConfirm = () => {
        localStorage.setItem('examId', examIdToStart);
        navigate(`/exam`);
        setShowModal(false);
    };

    const filterExams = (examType) => {
        if (examType === 'Tất cả') {
            setFilteredExams(exams);
        } else {
            const filtered = exams.filter(exam => exam.examType === examType);
            setFilteredExams(filtered);
        }
    };

    const searchExam = () => {
        let input, filter, examInfoDiv, examDiv, txtValue;
        input = document.getElementById('searchInput');
        filter = input.value.toUpperCase();
        examInfoDiv = document.getElementById('examInfoList');
        examDiv = examInfoDiv.getElementsByClassName('exam-name'); // Chỉ lấy các thẻ có class là "exam-name"

        for (let i = 0; i < examDiv.length; i++) {
            txtValue = examDiv[i].textContent || examDiv[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                examDiv[i].parentNode.style.display = ''; // Hiển thị phần tử cha của thẻ có class là "exam-name"
            } else {
                examDiv[i].parentNode.style.display = 'none'; // Ẩn phần tử cha của thẻ có class là "exam-name"
            }
        }
    };

    const handleInputChange = (event) => {
        searchExam();
    };

    const goToSubmit = (examId) => {
        localStorage.setItem("examId", examId);
        navigate('/result');
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
                    <input type="text" id="searchInput" placeholder="Tìm kiếm theo tên kỳ thi..." style={{ width: '97%', paddingLeft: '2rem' }} onChange={handleInputChange} />
                    <Search style={{ position: 'absolute', top: '50%', left: '1rem', transform: 'translateY(-50%)', color: '#aaa' }} />
                </div>
            </div>

            <div id="examInfoList">
                <ExamTable exams={filteredExams} startExam={startExam} goToSubmit={goToSubmit} />
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>Bạn chắc chắn muốn bắt đầu bài kiểm tra không?</p>
                        <p>Lưu ý: Thời gian sẽ tính khi bấm nút 'Bắt đầu'</p>
                        <div className="button-container">
                            <button onClick={onCancel}>Hủy</button>
                            <button onClick={onConfirm}>Bắt đầu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainPage;
