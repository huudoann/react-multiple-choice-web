import React, { useEffect, useState } from 'react';
import { read, utils } from 'xlsx';
import './CreateAndEditExams.scss';
import { useParams } from 'react-router-dom';
import AdminNavBar from '../../components/NavBar/AdminNavBar';
import { endPoint } from '../../util/api/endPoint';
import { Request } from '../../util/axios';
import { Box, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

const CreateAndEditExams = () => {
    const [examData, setExamData] = useState({
        questions: [],
        excelFile: null
    });

    const { examId } = useParams();

    useEffect(() => {
        const fetchData = async (examId) => {
            try {
                const response = await Request.Server.get(endPoint.getAllQuestionByExamId(examId));
                setExamData({
                    questions: response,
                    excelFile: null
                })
                // Set examData with the response data
            } catch (error) {
                console.error('Error fetching exam data:', error);
            }
        };
        if (examId) {
            fetchData(examId);
        }
    }, [examId])

    const handleInputChange = (event, index) => {
        const { name, value } = event.target;
        const updatedQuestions = [...examData.questions];
        updatedQuestions[index][name] = value;
        console.log(updatedQuestions)
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
            console.log(examData, examId);
            for (let i = 0; i < examData.questions.length; i++) {
                const response = await Request.Server.post(endPoint.createNewExamQuestions(examId), {
                    ...examData.questions[i],
                })
                console.log(response);
            }
            // const createQuestionPromises = examData.questions.map(async (question) => {
            //     const response = await Request.Server.post(endPoint.createQuestion(), {
            //         ...question,
            //         examId: examId // Add examId to each question object
            //     });
            //     console.log(response);
            //     return response;
            // });
            // Wait for all requests to complete
            // const responses = await Promise.all(createQuestionPromises);
            // console.log(responses);
        } catch (error) {
            console.error('Error creating questions:', error);
        }
    };

    const submitExam = async () => {
        try {
            const questionText = document.getElementById('questionText').value;
            const answerOptionA = document.getElementById('answerOptionA').value;
            const answerOptionB = document.getElementById('answerOptionB').value;
            const answerOptionC = document.getElementById('answerOptionC').value;
            const answerOptionD = document.getElementById('answerOptionD').value;
            const correctAnswer = document.getElementById('correctAnswer').value;
            const response = await Request.Server.post(endPoint.createQuestion(examId), {
                questionText,
                answerOptionA,
                answerOptionB,
                answerOptionC,
                answerOptionD,
                correctAnswer,
                examId
            });
            console.log(response);
        } catch (error) {

        }
    }

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

                        <Box sx={{ minWidth: 120 }}>
                            <FormControl fullWidth>
                                <InputLabel id={`correctAnswer${index}`}>Đáp án đúng</InputLabel>
                                <Select
                                    labelId={`correctAnswer${index}`}
                                    name="correctAnswer"
                                    value={question.correctAnswer}
                                    label="Đáp án đúng:"
                                    onChange={(event) => handleInputChange(event, index)}
                                >
                                    <MenuItem value="A">A</MenuItem>
                                    <MenuItem value="B">B</MenuItem>
                                    <MenuItem value="C">C</MenuItem>
                                    <MenuItem value="D">D</MenuItem>

                                </Select>
                            </FormControl>
                        </Box>
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
