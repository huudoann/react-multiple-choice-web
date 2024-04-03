import React, { useEffect, useState } from 'react';
import { read, utils } from 'xlsx';
import './CreateAndEditExams.scss';
import { useParams } from 'react-router-dom';
import AdminNavBar from '../../components/NavBar/AdminNavBar';
import { endPoint } from '../../util/api/endPoint';

const CreateAndEditExams = () => {
    const [examData, setExamData] = useState({
        questions: [],
        excelFile: null
    });

    const { examId } = useParams();

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const updatedQuestions = [...examData.questions];
        updatedQuestions[index][name] = value;
        setExamData({
            ...examData,
            questions: updatedQuestions
        });
    };

    const handleFileInputChange = (event) => {
        setExamData({
            ...examData,
            excelFile: event.target.files[0]
        });
    };

    const handleAddQuestionClick = () => {
        const newQuestion = {
            questionText: '',
            answerOptionA: '',
            answerOptionB: '',
            answerOptionC: '',
            answerOptionD: '',
            correctAnswer: ''
        };
        setExamData({
            ...examData,
            questions: [...examData.questions, newQuestion]
        });
    };

    const handleRemoveQuestionClick = (index) => {
        const updatedQuestions = [...examData.questions];
        updatedQuestions.splice(index, 1);
        setExamData({
            ...examData,
            questions: updatedQuestions
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await Request.Server.put(endPoint.createNewExam(), examData);
            console.log(response);
            // Xử lý response từ API (nếu cần)
        } catch (error) {
            console.error('Error creating exam:', error);
        }
    };

    return (
        <div className="content-container">
            <div className="navigation">
                <AdminNavBar />
            </div>
            <form id="examForm" onSubmit={handleSubmit}>
                {examData.questions.map((question, index) => (
                    <div key={index} className="question-container">
                        <label htmlFor={`questionText${index}`}>Câu hỏi {index + 1}:</label>
                        <input type="text" name="questionText" id={`questionText${index}`} value={question.questionText} onChange={(event) => handleInputChange(event, index)} />
                        <label htmlFor={`answerOptionA${index}`}>Đáp án A:</label>
                        <input type="text" name="answerOptionA" id={`answerOptionA${index}`} value={question.answerOptionA} onChange={(event) => handleInputChange(event, index)} />
                        <label htmlFor={`answerOptionB${index}`}>Đáp án B:</label>
                        <input type="text" name="answerOptionB" id={`answerOptionB${index}`} value={question.answerOptionB} onChange={(event) => handleInputChange(event, index)} />
                        <label htmlFor={`answerOptionC${index}`}>Đáp án C:</label>
                        <input type="text" name="answerOptionC" id={`answerOptionC${index}`} value={question.answerOptionC} onChange={(event) => handleInputChange(event, index)} />
                        <label htmlFor={`answerOptionD${index}`}>Đáp án D:</label>
                        <input type="text" name="answerOptionD" id={`answerOptionD${index}`} value={question.answerOptionD} onChange={(event) => handleInputChange(event, index)} />
                        <label htmlFor={`correctAnswer${index}`}>Đáp án đúng:</label>
                        <select name="correctAnswer" id={`correctAnswer${index}`} value={question.correctAnswer} onChange={(event) => handleInputChange(event, index)}>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                        <button type="button" onClick={() => handleRemoveQuestionClick(index)}>Xóa câu hỏi</button>
                    </div>
                ))}
                <button type="button" onClick={handleAddQuestionClick}>Thêm câu hỏi</button>
                <label htmlFor="excelInput" className="file-input-button">Lấy câu hỏi từ Excel
                    <input type="file" id="excelInput" onChange={handleFileInputChange} />
                </label>
                {/* 
                lấy ra data của từng câu hỏi một theo dạng
                {
                    "quesionText": ...,
                    "answerOptionA": ...,
                    "answerOptionB": ...,
                    "answerOptionC": ...,
                    "answerOptionD": ...,
                    "correctAnswer": ...
                    "examId": id của kỳ thi,
                }
                10 câu hỏi thì loop qua 10 câu rồi gửi từng câu về server, có thể lưu vào array
                arr_questions = [{data câu 1}, {data câu 2}, ...]
                xong loop qua từng câu
                arr_questions.forEach(async (question) => {
                    try {
                        viết thêm cái api endpoint trong util/api/endPoint.js không thì k gọi được cái
                        createQuestion() kia đâu
                        const response = await Request.Server.post(endPoint.createQuestion(), question);
                        console.log(response);
                        // Xử lý response từ API (nếu cần)
                    } catch (error) {
                        console.error('Error creating question:', error);
                    }
                })
                */}
                <button type="submit">Lưu kỳ thi</button>
            </form>
        </div>
    );
}

export default CreateAndEditExams;
