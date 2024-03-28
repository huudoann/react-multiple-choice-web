import React, { useState, useEffect } from 'react';
import './ExamPage.scss';
import { Close } from '@mui/icons-material';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DropDownMenu from './ExamPageDropDown';
// import getCardsDataFromSet from '../../utils/getCardsDataFromSet';
import { useLocation, useNavigate } from 'react-router-dom';

const Tests = () => {
    const [flashcards, setFlashcards] = useState([]);
    const [answers, setAnswers] = useState([]);
    const [mounted, setMounted] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedAnswers, setSelectedAnswers] = useState(Array(20).fill(null));
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0); // Biến đếm số lượng câu trả lời đúng
    const [submitted, setSubmitted] = useState(false); // Kiểm tra xem người dùng đã nộp bài thi chưa
    const [totalQuestions, setTotalQuestions] = useState(0); // Lưu tổng số câu hỏi
    const [openDialog, setOpenDialog] = useState(false);
    const [confirmSubmit, setConfirmSubmit] = useState(false);

    // useEffect(() => {
    //     if (!mounted) {
    //         setMounted(true);
    //         return;
    //     }

    //     const fetchData = async () => {
    //         try {
    //             const set_id = new URLSearchParams(location.search).get('set_id');
    //             const flashcardsData = await getCardsDataFromSet(set_id);
    //             const data = flashcardsData.content;
    //             if (data && data.length > 0) {
    //                 const shuffledFlashcards = shuffleArray(data).slice(0, 20);
    //                 setFlashcards(shuffledFlashcards);
    //                 console.log("Lấy dữ liệu thành công", data);
    //             }
    //         } catch (error) {
    //             console.error('Lỗi lấy cards:', error);
    //         }
    //     };

    //     fetchData();

    // }, [location.search, mounted]);

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
        navigate(`/flashcard${location.search}`);
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

        // console.log('Câu trả lời đúng:', correctAnswer);
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
    };

    const handleConfirmSubmit = () => {
        setConfirmSubmit(true);
    };

    const handleDialogClose = () => {
        setConfirmSubmit(false);
        setOpenDialog(false);
    };

    const handleCancelSubmit = () => {
        setConfirmSubmit(false);
    };

    const contentStyle = {
        display: submitted ? 'none' : 'block'
    };

    return (
        <div className="Tests">
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

            {!submitted && !confirmSubmit && (
                <Button variant="contained" onClick={handleConfirmSubmit} className="submit-button">
                    Gửi bài kiểm tra
                </Button>
            )}

            {/* {confirmSubmit && (
                <div className="confirm-submit">
                    <p>Bạn có chắc chắn muốn nộp bài không?</p>
                    <Button onClick={handleSubmitButtonClick} color="primary">
                        Đồng ý
                    </Button>
                    <Button onClick={handleCancelSubmit} color="primary">
                        Hủy
                    </Button>
                </div>
            )} */}

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

export default Tests;