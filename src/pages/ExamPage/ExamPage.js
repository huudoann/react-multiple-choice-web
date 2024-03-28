import React, { useState, useEffect } from 'react';
import './ExamPage.scss';
import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DropDownMenu from './ExamPageDropDown';
import { useLocation, useNavigate } from 'react-router-dom';

const ExamPage = () => {
    const [flashcards, setFlashcards] = useState([]);
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

    useEffect(() => {
        // Dữ liệu flashcards giả định
        const mockFlashcards = [
            { front_text: "Front tezzxt 1 132 1231 13 123 1323 1233 4456", back_text: "Back text 1`````````````````````````````````````````````````" },
            { front_text: "Front text 2", back_text: "Back text 2" },
            { front_text: "Front text 3", back_text: "Back text 3" },
            { front_text: "Front text 4", back_text: "Back text 4" },
            // Thêm dữ liệu flashcards khác nếu cần
        ];

        setFlashcards(mockFlashcards);
    }, []);

    useEffect(() => {
        if (flashcards.length > 0) {
            flashcards.forEach((flashcard, index) => {
                generateAnswers(flashcard, index);
            });
        }
    }, [flashcards]);

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

    const generateAnswers = (flashcard, index) => {
        const correctAnswerIndex = Math.floor(Math.random() * 4);
        const correctAnswer = flashcard.front_text;
        const randomAnswers = flashcards.map(flashcard => flashcard.front_text).filter(text => text !== correctAnswer);
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
        if (selectedAnswer === flashcards[index].front_text) {
            setCorrectAnswersCount(prevCount => prevCount + 1);
        }
    };

    const handleSubmitButtonClick = () => {
        setSubmitted(true);
        const totalQuestionsCount = flashcards.length;
        setTotalQuestions(totalQuestionsCount);

        let correctCount = 0;
        selectedAnswers.forEach((selectedAnswerIndex, index) => {
            if (selectedAnswerIndex !== null && answers[index * 4 + selectedAnswerIndex] === flashcards[index].front_text) {
                correctCount++;
            }
        });
        setCorrectAnswersCount(correctCount);
        setOpenDialog(true);
        setShowResult(true);
        navigate('/result', {
            state: {
                flashcards,
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
                flashcards,
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
                <DropDownMenu />
                <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
            </div>

            {flashcards.map((flashcard, index) => (
                <div className="tests-form" key={index}>
                    <div className='defi-box'>
                        <p>Câu {index + 1}:</p>
                        <p className="back-text">{flashcard.back_text}</p>
                    </div>
                    <div className='term-box'>
                        <p className='select-term'>Chọn đáp án đúng</p>
                        <div className="buttons-answer">
                            <div className="button-row">
                                {answers.slice(index * 4, index * 4 + 2).map((answer, answerIndex) => (
                                    <button
                                        key={answerIndex}
                                        className={selectedAnswers[index] === answerIndex ? 'clicked' : ''}
                                        onClick={() => handleAnswerSelection(index, answerIndex)}
                                    >
                                        {answer}
                                    </button>
                                ))}
                            </div>
                            <div className="button-row">
                                {answers.slice(index * 4 + 2, index * 4 + 4).map((answer, answerIndex) => (
                                    <button
                                        key={answerIndex + 2}
                                        className={selectedAnswers[index] === answerIndex + 2 ? 'clicked' : ''}
                                        onClick={() => handleAnswerSelection(index, answerIndex + 2)}
                                    >
                                        {answer}
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
