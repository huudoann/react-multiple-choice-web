import React, { useState } from 'react';
import "./ExamManager.scss";

const ExamManager = () => {
    const [exams, setExams] = useState([]);
    const [deletingIndex, setDeletingIndex] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const addExam = () => {
        const examName = document.getElementById('exam_name').value;
        const examMode = document.getElementById('exam_mode').value;
        let examDate = document.getElementById('exam_date').value;

        if (examName.trim() !== '') {
            if (examMode === 'Luyện tập') {
                examDate = '';
            } else {
                if (examDate.trim() === '') {
                    alert('Vui lòng chọn ngày/tháng cho kỳ thi.');
                    return;
                }
            }

            const newExam = { name: examName, mode: examMode, date: examDate };
            setExams([...exams, newExam]);
            updateExamList([...exams, newExam]);
        }
    }

    const updateExamList = (updatedExams) => {
        return (
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên kì thi</th>
                        <th>Loại kì thi</th>
                        <th>Ngày thi</th>
                        <th>Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {updatedExams.map((exam, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{exam.name}</td>
                            <td>{exam.mode}</td>
                            <td>{exam.date}</td>
                            <td>
                                <div className="edit-delete-buttons">
                                    <button className="edit" onClick={() => editExam(index)}>Sửa</button>
                                    <button className="del" onClick={() => showDeleteForm(index)}>Xóa</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }


    const editExam = (index) => {
        const updatedExams = [...exams];
        const exam = updatedExams[index];
        const examName = prompt('Nhập tên mới cho kỳ thi:', exam.name);
        if (examName !== null) {
            const examMode = exam.mode;
            let examDate = exam.date;

            if (examMode !== 'Luyện tập') {
                examDate = prompt('Nhập ngày mới cho kỳ thi (YYYY-MM-DD):', exam.date);
                if (examDate !== null) {
                    const regex = /^\d{4}-\d{2}-\d{2}$/;
                    if (!regex.test(examDate)) {
                        alert('Ngày không hợp lệ! Vui lòng nhập theo định dạng YYYY-MM-DD.');
                        return;
                    }
                } else {
                    examDate = exam.date;
                }
            }

            updatedExams[index] = { name: examName, mode: examMode, date: examDate };
            setExams(updatedExams);
            updateExamList(updatedExams);
        }
    }

    const showDeleteForm = (index) => {
        setDeletingIndex(index);
    }

    const deleteExam = () => {
        const updatedExams = [...exams];
        updatedExams.splice(deletingIndex, 1);
        setExams(updatedExams);
        updateExamList(updatedExams);
        setDeletingIndex(null);
    }

    const cancelDelete = () => {
        setShowDeleteDialog(false); // Ẩn delete_form
    }

    return (
        <div className="ExamManger">
            <div className="create-container">
                <div className="input-container">
                    <input type="text" id="exam_name" placeholder="Tên kì thi" />
                    <select id="exam_mode">
                        <option value="Luyện tập">Luyện tập</option>
                        <option value="Thi thật">Thi thật</option>
                        <option value="Cuối kỳ">Cuối kỳ</option>
                    </select>
                    <input type="date" id="exam_date" />
                </div>
                <div className="button-container">
                    <button onClick={addExam}>Tạo kỳ thi</button>
                </div>
            </div>
            <ul id="exam_list">
                {updateExamList(exams)}
            </ul>

            {deletingIndex !== null && (
                <div id="delete_form" className="delete-dialog">
                    <p>Bạn có chắc chắn muốn xóa kỳ thi này không?</p>
                    <button onClick={deleteExam}>Có</button>
                    <button onClick={() => setDeletingIndex(null)}>Không</button>
                </div>
            )}
        </div>
    );

}

export default ExamManager;
