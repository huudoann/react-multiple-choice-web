import React, { useState, useEffect } from 'react';
import './ExamResult.scss';
import { Close } from '@mui/icons-material';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ExamResult = () => {
    const [questions, setQuestions] = useState([]);
    const [correctAnswers, setCorrectAnswers] = useState([]);
    const [userAnswer, setUserAnswer] = useState([]);
    const [resultArray, setResultArray] = useState([]);
    const [correctCount, setCorrectCount] = useState(0);
    const navigate = useNavigate();
    const answerOptions = ['A.', 'B.', 'C.', 'D.'];

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
                const correctAnswersArray = apiData.map(question => question.correctAnswer);
                setCorrectAnswers(correctAnswersArray);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu câu hỏi:', error.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            const examId = localStorage.getItem("examId");

            if (!token) {
                throw new Error("Không tìm thấy token trong Localstorage!");
            }

            try {
                const response = await axios.get(`http://localhost:8080/api/user-answer/exam/${examId}/user/${userId}`);
                const apiData = response.data;
                const userAnswersArray = apiData.map(question => question.selectedAnswer);
                setUserAnswer(userAnswersArray);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu câu hỏi:', error.message);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const compareAnswers = () => {
            // Kiểm tra nếu độ dài của hai mảng không bằng nhau, trả về mảng rỗng
            if (correctAnswers.length !== userAnswer.length) {
                setResultArray([]);
                return;
            }

            const result = correctAnswers.map((correctAnswer, index) => {
                // So sánh phần tử của hai mảng tại vị trí index
                if (correctAnswer === userAnswer[index]) {
                    return 'correct';
                } else {
                    return 'incorrect';
                }
            });

            setResultArray(result);
            // Tính số câu trả lời đúng
            const correctCount = result.filter(answer => answer === 'correct').length;
            setCorrectCount(correctCount);
        };
        compareAnswers();
    }, [correctAnswers, userAnswer]);

    const handleCloseButtonClick = () => {
        navigate(`/home`);
        localStorage.removeItem("examId");
    };

    return (
        <div className="ExamResult">
            <div className="navigation">
                <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
            </div>
            <div className="results">
                <p>Số câu hỏi đúng: {correctCount}/{questions.length}</p>
                <p>Số điểm: {(correctCount / questions.length * 10).toFixed(1)}</p>
            </div>
            {/* Phần hiển thị câu hỏi và đáp án */}
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
                                {answerOptions.map((option, optionIndex) => {
                                    let buttonClass = '';
                                    if (resultArray[index] === 'correct') {
                                        buttonClass = correctAnswers[index] === option.substring(0, 1) ? 'correct' : '';
                                    } else if (resultArray[index] === 'incorrect') {
                                        if (userAnswer[index] === option.substring(0, 1)) {
                                            buttonClass = 'incorrect';
                                        } else if (correctAnswers[index] === option.substring(0, 1)) {
                                            buttonClass = 'correct';
                                        }
                                    } return (
                                        <button
                                            key={optionIndex}
                                            className={buttonClass}
                                            disabled={true} // Không cho phép thay đổi đáp án
                                        >
                                            {option} {question[`answerOption${String.fromCharCode(65 + optionIndex)}`]}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ExamResult;
