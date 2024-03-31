import React, { useEffect, useState } from 'react';
import "./ExamManager.scss";
import { Request } from '../../util/axios';
import { endPoint } from '../../util/api/endPoint';

const ExamManager = () => {
    const [exams, setExams] = useState([]);
    const [deletingIndex, setDeletingIndex] = useState(null);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        const getListExam = async () => {
            const response = await Request.Server.get(endPoint.getAllExams());
            console.log(response);
            // xem dử liệu trả về r set vào state bên trên để hiển thị ra danh sách exam nhé
        }
        // viết hàm xong nhớ gọi hàm ra đấy ko viết mỗi như trên àm k gọi ra là ko chạy đâu

        getListExam(); // viết hàm getListExam thì bên dưới gọi ra nhé run cái be kia đc r thì có bug gì nhắn a sửa cho ocee a thế nghỉ nhé
    }, [])


    const addExam = async () => {
        // mấy cái api này nên try catch nhé tránh lỗi
        try {
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
                // sao api này có 5 trường dữ liệu mà web a thấy có 3 thôi v 
                // tùy vào backend nếu be mà validate thì gửi lên sẽ lỗi 
                // thế thì mấy cái ko có thì a tạm truyền data giống postman nhé
                // xong xem cái response trả về r set lại vào cái dữ liệu ban đầu là xong 

                const response = await Request.Server.post(endPoint.createNewExam(), {
                    examName,
                    examType: examMode,
                    startTime: examDate,
                    endTime: "15/12/2024 10:00:00",
                    description: "test desc 5",
                })
                console.log(response);
                // const newExam = { name: examName, mode: examMode, date: examDate };
                // setExams([...exams, newExam]);
                // updateExamList([...exams, newExam]);
            }
        } catch (e) {
            console.log(e);
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
                        <th>Ngày bắt đầu</th>
                        <th>Ngày kết thúc</th>
                        <th>Miêu tả</th>
                        <th>Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {updatedExams.map((exam, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{exam.examName}</td>
                            <td>{exam.examType}</td>
                            <td>{exam.startTime}</td>
                            <td>{exam.endTime}</td>
                            <td>{exam.description}</td>
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
        // chạy thử web a test luôn cho trang em làm đấy
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
                    <input type="text" id="description" placeholder="Miêu tả" />
                    <select id="exam_mode">
                        <option value="Giữa kỳ">Giữa kỳ</option>
                        <option value="Cuối kỳ">Cuối kỳ</option>
                    </select>
                    <label htmlFor="startTime">Ngày bắt đầu:</label>
                    <input type="date" id="startTime" />
                    <label htmlFor="endTime">Ngày kết thúc:</label>
                    <input type="date" id="endTime" />
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
