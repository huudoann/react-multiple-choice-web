import React, { useState, useEffect } from 'react';
import './ExamPage.scss';
import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExamPage = () => {
    const [elapsedTime, setElapsedTime] = useState(3600);
    const [questions, setQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
    const [userScore, setUserScore] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const answerOptions = ['A.', 'B.', 'C.', 'D.'];

    //lấy thời gian ngay khi vào làm bài
    useEffect(() => {
        setStartTime(new Date().toLocaleString());
    }, []);

    //bộ đếm ngược
    useEffect(() => {
        const timerId = setInterval(() => {
            setElapsedTime(prevTime => {
                if (prevTime > 0) {
                    return prevTime - 1;
                } else {
                    clearInterval(timerId);
                    setOpenDialog(true);
                    return 0;
                }
            });
        }, 1000); // Mỗi giây

        return () => {
            clearInterval(timerId);
        };
    }, []);

    //format thời gian
    const formatTime = (timeInSeconds) => {
        const hours = Math.floor(timeInSeconds / 3600);
        const minutes = Math.floor((timeInSeconds % 3600) / 60);
        const seconds = timeInSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    //lấy các câu hỏi
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const examId = localStorage.getItem("examId");

            if (!token) {
                throw new Error("Không tìm thấy token trong Localstorage!");
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/question/get-all-questions/${examId}`);
                const apiData = response.data;
                setQuestions(apiData);
                console.log("Lấy dữ liệu câu hỏi thành công", apiData);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu câu hỏi:', error.message);
            }
        };

        fetchData();
    }, []);

    //sinh câu hỏi và đáp án
    useEffect(() => {
        if (questions.length > 0) {
            const initialSelectedAnswers = Array(questions.length).fill(null);
            const initialAnswers = [];

            questions.forEach((question, index) => {
                generateAnswers(question, index);
            });

            setSelectedAnswers(initialSelectedAnswers);
            setAnswers(initialAnswers);
        }
    }, [questions]);

    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const handleCloseButtonClick = () => {
        navigate(`/home`);
    };

    const generateAnswers = (question, index) => {
        const correctAnswerIndex = Math.floor(Math.random() * 4);
        const correctAnswer = question.front_text;
        const randomAnswers = questions.map(question => question.front_text).filter(text => text !== correctAnswer);
        const shuffledAnswers = shuffleArray(randomAnswers).slice(0, 3);
        shuffledAnswers.splice(correctAnswerIndex, 0, correctAnswer);
        setAnswers(prevAnswers => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers.splice(index * 4, 4, ...shuffledAnswers);
            return updatedAnswers;
        });

        setCorrectAnswersCount(prevCount => prevCount + 1);
    };

    const calculateScore = async () => {
        let score = 0;
        for (let i = 0; i < questions.length; i++) {
            const correctAnswer = questions[i].correctAnswer; // Loại bỏ dấu chấm ở cuối
            const selectedOption = document.querySelector(`.tests-form:nth-child(${i + 2}) .clicked`);
            const userAnswer = selectedOption ? selectedOption.textContent.trim().charAt(0) : null;
            if (userAnswer == correctAnswer) {
                score += 1;
            }
            // console.log(correctAnswer, userAnswer, score, questions.length);
        }
        const roundedScore = Math.round((score / questions.length) * 10);
        setUserScore(roundedScore);

        const token = localStorage.getItem("token");
        const examId = localStorage.getItem("examId");
        const userId = localStorage.getItem("userId");

        if (!token) {
            throw new Error("Không có token trong Localstorage!");
        }

        try {

            const postData = {
                userId: userId,
                examId: examId,
                status: "completed",
                score: roundedScore,
            };
            const response = await axios.post('http://localhost:8080/api/exam-result/create-exam-result', postData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Gửi exam result thành công:', response);
        } catch (error) {
            console.error('Lỗi khi gửi exam result:', error.message);
        }
    };

    const handleAnswerSelection = (index, answerIndex) => {
        const selectedAnswer = String.fromCharCode(65 + answerIndex); // Chuyển đổi index sang ký tự tương ứng: A, B, C, D
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[index] = selectedAnswer;
        setSelectedAnswers(newSelectedAnswers);
        if (selectedAnswer === questions[index].front_text) {
            setCorrectAnswersCount(prevCount => prevCount + 1);
        }
    };

    const handleSubmitButtonClick = () => {
        setOpenDialog(true);
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

    const handleConfirmSubmit = async () => {
        setOpenDialog(false);
        setSubmitted(true);
        setShowSubmitConfirmation(true);
        calculateScore();
        const token = localStorage.getItem("token");
        const examId = localStorage.getItem("examId");
        const userId = localStorage.getItem("userId");

        if (!token) {
            throw new Error("Không có token trong Localstorage!");
        }

        try {
            for (let i = 0; i < selectedAnswers.length; i++) {
                const userAnswer = selectedAnswers[i];
                let selectedAnswer = 'F'; // Giá trị mặc định là 'F'
                let questionId;
                if (userAnswer !== null && userAnswer !== undefined) {
                    selectedAnswer = userAnswer;
                    questionId = questions[i].questionId;
                }
                const postData = {
                    userId: userId,
                    examId: examId,
                    questionId: questionId,
                    selectedAnswer: selectedAnswer,
                };
                const response = await axios.post('http://localhost:8080/api/user-answer/create-user-answer', postData, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                console.log('Dữ liệu đã được gửi thành công:', response);
            }
        } catch (error) {
            console.error('Lỗi khi gửi dữ liệu:', error.message);
        }

        try {
            const endTime = new Date().toLocaleString(); // Thời gian kết thúc
            let formattedStartTime = convertDateTimeFormat(startTime)
            let formattedEndTime = convertDateTimeFormat(endTime)

            const postData = {
                userId: userId,
                examId: examId,
                startTime: formattedStartTime,
                endTime: formattedEndTime,
            };
            const response = await axios.post('http://localhost:8080/api/exam-attempt/create-exam-attempt', postData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Gửi exam attempt thành công:', response);
        } catch (error) {
            console.error('Lỗi khi gửi exam attempt:', error.message);
        }
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleViewResultButtonClick = () => {
        navigate(`/result`);
    };

    return (
        <div className="ExamPage">
            <div className="navigation">
                {/* Hiển thị thời gian */}
                <div className="elapsed-time">
                    <p>Thời gian còn lại: {formatTime(elapsedTime)}</p>
                </div>
                <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
            </div>

            {/* Phần hiển thị đáp án */}
            {questions.map((question, index) => (
                <div className="tests-form" key={index}>
                    <div className='defi-box'>
                        <p>Câu {index + 1}:</p>
                        <p className="back-text">{question.questionText}</p>
                    </div>
                    <div className='term-box'>
                        <p className='select-term'>Chọn đáp án đúng</p>
                        <div className="buttons-answer">
                            <div className="button-row">
                                {answerOptions.map((option, optionIndex) => (
                                    <button
                                        key={optionIndex}
                                        className={selectedAnswers[index] === String.fromCharCode(65 + optionIndex) ? 'clicked' : ''}
                                        onClick={() => handleAnswerSelection(index, optionIndex)}
                                    >
                                        {option} {question[`answerOption${String.fromCharCode(65 + optionIndex)}`]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Xác nhận nộp bài</DialogTitle>
                <DialogContent>
                    <p>Bạn có chắc chắn muốn nộp bài không?</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Hủy
                    </Button>
                    <Button onClick={handleConfirmSubmit} color="primary" autoFocus>
                        Đồng ý
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog "Bạn đã nộp bài" */}
            <Dialog open={showSubmitConfirmation}>
                <DialogTitle>Bạn đã nộp bài</DialogTitle>
                <DialogContent>
                    <p>Bạn đã hoàn thành bài kiểm tra.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleViewResultButtonClick} color="primary" autoFocus>
                        Xem kết quả
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Button "Gửi bài kiểm tra" */}
            {!submitted && (
                <Button variant="contained" onClick={handleSubmitButtonClick} className="submit-button" style={{ backgroundColor: '#dc3545' }}>
                    Nộp bài
                </Button>
            )}
        </div>
    );
};

export default ExamPage;
