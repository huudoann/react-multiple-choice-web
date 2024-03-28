import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './ExamResult.scss';
import { Close } from '@mui/icons-material';

const ExamResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { flashcards, answers, selectedAnswers } = location.state;

    const handleCloseButtonClick = () => {
        navigate(`/home`);
    };

    const correctAnswersCount = flashcards.reduce((count, flashcard, index) => {
        const selectedAnswer = selectedAnswers[index];
        const correctAnswerIndex = flashcard.front_text === answers[index * 4 + selectedAnswer] ? selectedAnswer : null;
        if (correctAnswerIndex !== null) {
            return count + 1;
        } else {
            return count;
        }
    }, 0);

    const totalQuestions = flashcards.length;

    const score = Math.round((correctAnswersCount / totalQuestions) * 10 * 10) / 10;

    const getAnswerClass = (index, answerIndex) => {
        const selectedAnswer = selectedAnswers[index];
        const correctAnswerIndex = flashcards[index].front_text === answers[index * 4 + answerIndex] ? answerIndex : null;
        if (selectedAnswer === null) {
            return '';
        } else if (selectedAnswer === answerIndex) {
            return correctAnswerIndex === answerIndex ? 'correct' : 'incorrect';
        } else {
            return correctAnswerIndex === answerIndex ? 'correct' : '';
        }
    };

    return (
        <div className="ExamResult">
            <div className="navigation">
                <button className="close-button" onClick={handleCloseButtonClick}><Close /></button>
            </div>
            <div className="results">
                <p>Số câu trả lời đúng: {correctAnswersCount} / {totalQuestions}</p>
                <p>Điểm: {score}</p>
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
                                        className={getAnswerClass(index, answerIndex)}
                                        disabled={true}
                                    >
                                        {answer}
                                    </button>
                                ))}
                            </div>
                            <div className="button-row">
                                {answers.slice(index * 4 + 2, index * 4 + 4).map((answer, answerIndex) => (
                                    <button
                                        key={answerIndex + 2}
                                        className={getAnswerClass(index, answerIndex + 2)}
                                        disabled={true}
                                    >
                                        {answer}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    );
};

export default ExamResult;
