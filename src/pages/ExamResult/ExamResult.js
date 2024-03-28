import React from 'react';
import './ExamResult.scss'; // Đảm bảo bạn có file CSS tương ứng để định dạng giao diện

const ExamResult = ({ flashcards, answers, selectedAnswers }) => {
    const getAnswerClass = (index, answerIndex) => {
        const selectedAnswer = selectedAnswers[index];
        const correctAnswerIndex = flashcards[index].front_text === answers[index * 4 + answerIndex] ? answerIndex : null;
        return selectedAnswer === answerIndex ? 'correct' : (selectedAnswer === correctAnswerIndex ? 'incorrect' : '');
    };

    return (
        <div className="answer-page-container">
            <h2>Đáp án đúng</h2>
            {flashcards.map((flashcard, index) => (
                <div key={index} className="flashcard-answer">
                    <p>Câu {index + 1}: {flashcard.front_text}</p>
                    <p>Đáp án: {flashcard.front_text}</p>
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
            ))}
        </div>
    );
};

export default ExamResult;
