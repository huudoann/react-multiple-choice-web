import React, { useState, useEffect } from 'react';
import './ExamPage.scss';
import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DropDownMenu from './ExamPageDropDown';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExamPage = () => {
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState(Array(20).fill(null));
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [totalQuestions, setTotalQuestions] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const answerOptions = ['A.', 'B.', 'C.', 'D.'];


    // useEffect(() => {
    //     // Dữ liệu questions giả định
    //     const mockFlashcards = [
    //         { front_text: "Front tezzxt 1 132 1231 13 123 1323 1233 4456", back_text: "Back text 1`````````````````````````````````````````````````" },
    //         { front_text: "Front text 2", back_text: "Back text 2" },
    //         { front_text: "Front text 3", back_text: "Back text 3" },
    //         { front_text: "Front text 4", back_text: "Back text 4" },
    //         // Thêm dữ liệu questions khác nếu cần
    //     ];

    //     setQuestions(mockFlashcards);
    // }, []);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const examId = localStorage.getItem("examId");

            try {
                // Thực hiện gọi API để lấy dữ liệu đáp án từ backend
                const response = await axios.get(`http://localhost:8080/api/question/get-all-questions/${examId}`);

                // Lấy dữ liệu đáp án từ response
                const apiData = response.data;

                // Cập nhật dữ liệu đáp án vào state
                setQuestions(apiData);

                // Hiển thị kết quả
                console.log('Dữ liệu đáp án:', apiData);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu câu hỏi:', error.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (questions.length > 0) {
            questions.forEach((question, index) => {
                generateAnswers(question, index);
            });
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

    const handleAnswerSelection = (index, answerIndex) => {
        const newSelectedAnswers = [...selectedAnswers];
        newSelectedAnswers[index] = answerIndex;
        setSelectedAnswers(newSelectedAnswers);

        const selectedAnswer = answers[index * 4 + answerIndex];
        if (selectedAnswer === questions[index].front_text) {
            setCorrectAnswersCount(prevCount => prevCount + 1);
        }
    };

    const handleSubmitButtonClick = () => {
        setSubmitted(true);
        const totalQuestionsCount = questions.length;
        setTotalQuestions(totalQuestionsCount);

        let correctCount = 0;
        selectedAnswers.forEach((selectedAnswerIndex, index) => {
            if (selectedAnswerIndex !== null && answers[index * 4 + selectedAnswerIndex] === questions[index].front_text) {
                correctCount++;
            }
        });
        setCorrectAnswersCount(correctCount);
        setOpenDialog(true);
        setShowResult(true);
        navigate('/result', {
            state: {
                questions,
                answers,
                selectedAnswers,
                correctAnswersCount,
                totalQuestions
            }
        });
    };

    const handleConfirmSubmit = () => {
        setConfirmSubmit(true);
    };

    const handleDialogClose = () => {
        setConfirmSubmit(false);
        setOpenDialog(false);
        setShowResult(true);
        navigate('/result', {
            state: {
                questions,
                answers,
                selectedAnswers,
                correctAnswersCount,
                totalQuestions
            }
        });
    };

    const handleCancelSubmit = () => {
        setConfirmSubmit(false);
    };

    const contentStyle = {
        display: submitted ? 'none' : 'block'
    };

    return (
        <div className="ExamPage">
            <div className="navigation">
                <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
            </div>
            {/* Phần hiển thị questions */}
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
                                        className={selectedAnswers[index] === optionIndex ? 'clicked' : ''}
                                        onClick={() => handleAnswerSelection(index, optionIndex)}
                                    >
                                        {option} {question[`question${optionIndex + 1}`]}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Dialog */}
            <Dialog open={openDialog} onClose={handleDialogClose}>
                <DialogTitle>Kết quả bài kiểm tra</DialogTitle>
                <DialogContent>
                    <div className="results">
                        <p>Số câu trả lời đúng: {correctAnswersCount} / {totalQuestions}</p>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Đóng
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Button "Gửi bài kiểm tra" */}
            {!submitted && !confirmSubmit && !showResult && (
                <Button variant="contained" onClick={handleSubmitButtonClick} className="submit-button">
                    Gửi bài kiểm tra
                </Button>
            )}

            {/* Xác nhận nộp bài */}
            {confirmSubmit && (
                <div className="confirm-submit-overlay">
                    <div className="confirm-submit">
                        <p>Bạn có chắc chắn muốn nộp bài không?</p>
                        <Button onClick={handleSubmitButtonClick} color="primary">
                            Đồng ý
                        </Button>
                        <Button onClick={handleCancelSubmit} color="primary">
                            Hủy
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamPage;
