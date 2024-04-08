import React, { useEffect, useState } from 'react';
import { read, utils } from 'xlsx';
import './CreateAndEditExams.scss';
import { useParams } from 'react-router-dom';
import AdminNavBar from '../../components/NavBar/AdminNavBar';
import { endPoint } from '../../util/api/endPoint';
import { Request } from '../../util/axios';
import { Box, MenuItem, Select, InputLabel, FormControl, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';

const CreateAndEditExams = () => {
    const [examData, setExamData] = useState({
        questions: [],
        excelFile: null
    });

    const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
    const [questionToDeleteIndex, setQuestionToDeleteIndex] = useState(null);

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
        updatedQuestions[index].changed = true; // Đánh dấu câu hỏi đã thay đổi
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
        setQuestionToDeleteIndex(index);
        setConfirmDeleteDialogOpen(true);
    };

    const confirmDeleteQuestion = async () => {
        // Xác nhận xóa câu hỏi
        const index = questionToDeleteIndex;
        const questionToRemove = examData.questions[index];
        if (questionToRemove.questionId) {
            try {
                // Gửi yêu cầu xóa câu hỏi đến máy chủ
                const response = await Request.Server.delete(endPoint.deleteQuestionbyQuestionId(questionToRemove.questionId));
                console.log("Xóa câu hỏi thành công", response);
            } catch (error) {
                console.error('Lỗi xóa câu hỏi:', error);
            }
        }
        // Xóa câu hỏi khỏi danh sách câu hỏi hiện tại
        const updatedQuestions = [...examData.questions];
        updatedQuestions.splice(index, 1);
        setExamData({
            ...examData,
            questions: updatedQuestions
        });
        // Đóng dialog xác nhận xóa
        setConfirmDeleteDialogOpen(false);
    };

    const handleCloseConfirmDeleteDialog = () => {
        setConfirmDeleteDialogOpen(false);
        setQuestionToDeleteIndex(null);
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

    const handleChangeSubmit = async (event) => {
        event.preventDefault();
        try {
            const updatedQuestions = []; // Danh sách câu hỏi cũ đã thay đổi
            const newQuestions = []; // Danh sách câu hỏi mới

            examData.questions.forEach(question => {
                if (question.changed) {
                    updatedQuestions.push(question);
                } else {
                    newQuestions.push(question);
                }
            });

            // Thực hiện các yêu cầu PUT cho các câu hỏi cũ đã thay đổi
            for (let i = 0; i < updatedQuestions.length; i++) {
                const question = updatedQuestions[i];
                if (question.questionId) { // Kiểm tra xem câu hỏi có questionId hay không
                    const response = await Request.Server.put(endPoint.editQuestionByQuestionId(question.questionId), {
                        ...question,
                    });
                    console.log("Sửa thành công", response);
                } else { // Nếu không có questionId, thực hiện yêu cầu POST để tạo câu hỏi mới
                    const response = await Request.Server.post(endPoint.createNewExamQuestions(examId), {
                        ...question,
                    });
                    console.log("Thêm mới thành công", response);
                }
            }

            console.log("Tất cả các thay đổi đã được lưu.");
        } catch (error) {
            console.error('Lỗi sửa câu hỏi:', error);
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
            <form id="examForm">
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
                {examData.questions.length === 0 ? (
                    <button type="button" onClick={handleSubmit}>Tạo kỳ thi</button>
                ) : (
                    <button type="submit" onClick={handleChangeSubmit}>Lưu thay đổi</button>
                )}
            </form>

            <Dialog open={confirmDeleteDialogOpen} onClose={handleCloseConfirmDeleteDialog}>
                <DialogTitle>Bạn có chắc chắn muốn xóa câu hỏi này?</DialogTitle>
                <DialogActions>
                    <Button onClick={handleCloseConfirmDeleteDialog} color="primary">Hủy</Button>
                    <Button onClick={confirmDeleteQuestion} color="secondary">Đồng ý</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default CreateAndEditExams;
