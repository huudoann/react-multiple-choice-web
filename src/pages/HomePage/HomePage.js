import React, { useEffect, useState } from 'react';
import './HomePage.scss';
import NavBar from '../../components/NavBar/NavBar';
import { Button, Box, ButtonGroup, TextField } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const ExamTable = ({ exams, startExam, goToSubmit }) => {
    const isExamDisabled = (startTime, endTime) => {
        const currentDate = moment();
        const start = moment(startTime, 'DD/MM/YYYY HH:mm:ss');
        const end = moment(endTime, 'DD/MM/YYYY HH:mm:ss');
        console.log('currentDate', currentDate, 'start', start, 'end', end);
        return currentDate.isBefore(start) || currentDate.isAfter(end);
    };

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
                                <Button className='done' onClick={() => goToSubmit(exam.examId)} style={{ backgroundColor: 'green', border: '1px solid green' }}>
                                    Xem kết quả
                                </Button>
                            ) : (
                                <Button
                                    disabled={isExamDisabled(exam.startTime, exam.endTime)}
                                    onClick={() => startExam(exam.examId)}
                                    style={{ backgroundColor: isExamDisabled(exam.startTime, exam.endTime) ? 'gray' : '', color: isExamDisabled(exam.startTime, exam.endTime) ? 'white' : '', border: isExamDisabled(exam.startTime, exam.endTime) ? 'gray 1px solid' : '' }}
                                >
                                    {isExamDisabled(exam.startTime, exam.endTime) ? 'Ngoài thời gian' : 'Làm bài'}
                                </Button>
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
    const [filteredExams, setFilteredExams] = useState([]);
    const [showModal, setShowModal] = useState(false); // State để kiểm soát việc hiển thị modal
    const [examIdToStart, setExamIdToStart] = useState(null); // State để lưu ID của bài thi muốn bắt đầu
    const [startTime, setStartTime] = useState(null);
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

    const convertDateTimeFormat = (dateTimeInput) => {
        const dateTime = new Date(dateTimeInput);
        const day = dateTime.getDate();
        const month = dateTime.getMonth() + 1;
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        const seconds = dateTime.getSeconds();

        // Đảm bảo hiển thị 2 chữ số cho ngày, tháng, giờ, phút, giây
        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}0`;
        return formattedDateTime;
    };

    const postExamAttemptData = async () => {
        const token = localStorage.getItem("token");
        const examId = localStorage.getItem("examId");
        const userId = localStorage.getItem("userId");
        setStartTime(new Date().toLocaleString());

        if (!token) {
            throw new Error("Không tìm thấy token trong Localstorage!");
        }
        try {
            const startTime = new Date().toLocaleString(); // Thời gian bắt đầu
            const postData = {
                userId: userId,
                examId: examId,
                startTime: convertDateTimeFormat(startTime),
                endTime: convertDateTimeFormat(startTime),
            };
            // Gửi dữ liệu ngay khi vào trang
            const response = await axios.post('http://localhost:8080/api/exam-attempt/create-exam-attempt', postData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Lưu ID của exam attempt vào state và localStorage
            const examAttemptId = response.data.examAttemptId;
            localStorage.setItem("examAttemptId", examAttemptId);
            console.log('Gửi exam attempt thành công:', response);
        } catch (error) {
            console.error('Lỗi khi gửi exam attempt:', error.message);
        }
    };

    const onConfirm = () => {

        localStorage.setItem('examId', examIdToStart);
        postExamAttemptData();
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

    const searchExam = (event) => {
        const filter = event.target.value.toUpperCase();
        const filteredExams = exams.filter(exam => exam.examName.toUpperCase().includes(filter));
        setFilteredExams(filteredExams);
    };

    const handleInputChange = (event) => {
        searchExam(event);
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
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '& > *': {
                            m: 1,
                        },
                    }}
                >
                    <ButtonGroup size="small" aria-label="Small button group">
                        <Button className="exam-item" onClick={() => filterExams('Tất cả')}>Tất cả</Button>
                        <Button className="exam-item" onClick={() => filterExams('Luyện tập')}>Luyện tập</Button>
                        <Button className="exam-item" onClick={() => filterExams('Giữa kỳ')}>Giữa kỳ</Button>
                        <Button className="exam-item" onClick={() => filterExams('Cuối kỳ')}>Cuối kỳ</Button>
                    </ButtonGroup>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-end', width: '120%', marginRight: '2rem' }}>
                    <TextField
                        id="input-search"
                        label="Tìm kiếm"
                        className='search-box'
                        variant="standard"
                        onChange={handleInputChange}
                        InputLabelProps={{
                            style: { color: 'white', fontSize: '1rem' }
                        }}
                        style={{ position: 'relative', border: 'none', color: 'white' }} />
                </Box>
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
