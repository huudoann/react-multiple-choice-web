import React, { useEffect, useState } from 'react'
import "./ExamManager.scss"
import { Request } from '../../util/axios'
import { endPoint } from '../../util/api/endPoint'
import { Link } from 'react-router-dom'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
// import { DateTimeField, LocalizationProvider } from '@mui/x-date-pickers'
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { DateField } from '@mui/x-date-pickers/DateField';

const ExamManager = () => {
    const [exams, setExams] = useState([])
    const [deletingIndex, setDeletingIndex] = useState(null)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteExamId, setDeleteExamId] = useState(null)
    const [editExamId, setEditExamId] = useState(null)
    console.log(exams)

    const [selectedValue, setSelectedValue] = useState('luyen tap');

    // Event handler to handle changes in the TextField
    const handleChange = (event) => {
        setSelectedValue(event.target.value);
    };


    useEffect(() => {
        const getListExam = async () => {
            const response = await Request.Server.get(endPoint.getAllExams())
            console.log(response)
            setExams(response)
            // xem dử liệu trả về r set vào state bên trên để hiển thị ra danh sách exam nhé
        }
        // viết hàm xong nhớ gọi hàm ra đấy ko viết mỗi như trên àm k gọi ra là ko chạy đâu

        getListExam() // viết hàm getListExam thì bên dưới gọi ra nhé run cái be kia đc r thì có bug gì nhắn a sửa cho ocee a thế nghỉ nhé
    }, [])

    const convertDateTimeFormat = (dateTimeInput) => {
        const dateTime = new Date(dateTimeInput)
        const day = dateTime.getDate()
        const month = dateTime.getMonth() + 1
        const year = dateTime.getFullYear()
        const hours = dateTime.getHours()
        const minutes = dateTime.getMinutes()
        const seconds = dateTime.getSeconds()

        // Đảm bảo hiển thị 2 chữ số cho ngày, tháng, giờ, phút, giây
        const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}0`
        return formattedDateTime
    }


    const addExam = async () => {
        // mấy cái api này nên try catch nhé tránh lỗi
        try {
            const examName = document.getElementById('exam_name').value
            const examType = selectedValue
            const description = document.getElementById('description').value
            const startTime = document.getElementById('startTime').value
            const endTime = document.getElementById('endTime').value

            if (examName.trim() !== '') {
                // sao api này có 5 trường dữ liệu mà web a thấy có 3 thôi v 
                // tùy vào backend nếu be mà validate thì gửi lên sẽ lỗi 
                // thế thì mấy cái ko có thì a tạm truyền data giống postman nhé
                // xong xem cái response trả về r set lại vào cái dữ liệu ban đầu là xong 

                let formattedStartTime = convertDateTimeFormat(startTime)
                let formattedEndTime = convertDateTimeFormat(endTime)
                console.log("1", examType)
                console.log(typeof formattedStartTime)
                console.log(formattedEndTime)

                const response = await Request.Server.post(endPoint.createNewExam(), {
                    examName,
                    examType: examType,
                    startTime: formattedStartTime,
                    endTime: formattedEndTime,
                    description,
                })
                console.log(response)
                const newExam = { examName: examName, examType: examType, startTime: formattedStartTime, endTime: formattedEndTime, description: description }
                setExams([...exams, newExam])
                updateExamList([...exams, newExam])
            }
        } catch (e) {
            console.log(e)
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
                                    <Link to={`/exam/${exam.examId}`} style={{ color: 'inherit', textDecoration: 'inherit' }} >
                                        <button className="del" onClick={() => showDeleteForm(exam.examId, index)}>Thêm câu hỏi</button>
                                    </Link>
                                    <button className="edit" onClick={() => editExam(exam.examId, index)}>Sửa</button>
                                    <button className="del" onClick={() => showDeleteForm(exam.examId, index)}>Xóa</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }


    const editExam = async (examId, index) => {
        setEditExamId(examId)
        const updatedExams = [...exams]
        const exam = updatedExams[index]
        console.log(exam)
        const examName = prompt('Nhập tên mới cho kỳ thi:', exam.examName)
        if (examName !== null) {
            let examType = prompt('Nhập loại kì thi mới cho kỳ thi:', exam.examType)
            let startTime = exam.startTime
            let endTime = exam.endTime
            let description = exam.description

            if (examType !== 'Luyện tập') {
                startTime = prompt('Nhập ngày bắt đầu mới cho kỳ thi (dd/mm/yyyy hh:mm:ss):', exam.startTime)
                if (startTime !== null) {
                    const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/
                    if (!regex.test(startTime)) {
                        alert('Ngày không hợp lệ! Vui lòng nhập theo định dạng (dd/mm/yyyy hh:mm:ss).')
                        return
                    }
                } else {
                    startTime = exam.startTime
                }

                endTime = prompt('Nhập ngày kết thúc mới cho kỳ thi (dd/mm/yyyy hh:mm:ss):', exam.endTime)
                if (endTime !== null) {
                    const regex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/
                    if (!regex.test(endTime)) {
                        alert('Ngày không hợp lệ! Vui lòng nhập theo định dạng (dd/mm/yyyy hh:mm:ss).')
                        return
                    }
                } else {
                    endTime = exam.endTime
                }

                description = prompt('Nhập ngày mô tả mới cho kỳ thi:', exam.description)
                if (description === null) {
                    description = exam.description
                }
            }

            updatedExams[index] = {
                examName: examName,
                examType: examType,
                startTime,
                endTime,
                description
            }
            // Gọi API edit exam với examId
            try {
                console.log(editExamId)
                await Request.Server.put(endPoint.editExamById(editExamId), updatedExams[index])
                setExams(prevExams => prevExams.filter(exam => exam.deleteExamId !== deleteExamId))
            } catch (error) {
                console.error('Error edit exam:', error)
            } finally {
                setEditExamId(null) // Ẩn form xác nhận xóa sau khi xác nhận
            }
            setExams(updatedExams)
            updateExamList(updatedExams)
        }
    }

    const showDeleteForm = (examId, index) => {
        setDeletingIndex(index)
        setDeleteExamId(examId)
    }

    const deleteExam = async () => {
        // chạy thử web a test luôn cho trang em làm đấy
        const updatedExams = [...exams]
        updatedExams.splice(deletingIndex, 1)
        setExams(updatedExams)
        updateExamList(updatedExams)
        setDeletingIndex(null)
        // Gọi API xóa exam với examId
        try {
            console.log(deleteExamId)
            await Request.Server.delete(endPoint.deleteExamById(deleteExamId))
            setExams(prevExams => prevExams.filter(exam => exam.deleteExamId !== deleteExamId))
        } catch (error) {
            console.error('Error deleting exam:', error)
        } finally {
            setDeleteExamId(null) // Ẩn form xác nhận xóa sau khi xác nhận
        }
    }

    const cancelDelete = () => {
        setShowDeleteDialog(false) // Ẩn delete_form
    }

    return (
        <div className="ExamManger">
            <div className="create-container">
                <div className="input-container">
                    <TextField id="exam_name" label="Tên kì thi" variant="outlined" />
                    <TextField id="description" label="Mô tả" variant="outlined" />
                    {/* <input type="text" id="exam_name" placeholder="Tên kì thi" /> */}
                    {/* <input type="text" id="description" placeholder="Miêu tả" /> */}
                    {/* <select id="exam_mode">
                        <option value="luyen tap">Luyện tập</option>
                        <option value="giua ki">Giữa kỳ</option>
                        <option value="cuoi ki">Cuối kỳ</option>
                    </select> */}
                    {/* <InputLabel id="examTypeId">Loại kì thi</InputLabel> */}
                    <TextField
                        id='exam_mode'
                        label="Chọn kì thi"
                        select style={{ minWidth: '150px' }}
                        value={selectedValue} // Set the selected value
                        onChange={handleChange} // Handle changes
                    >
                        <MenuItem selected="true" value="Luyện tập">Luyện tập</MenuItem>
                        <MenuItem value="Giữa kỳ">Giữa kỳ</MenuItem>
                        <MenuItem value="Cuối kỳ">Cuối kỳ</MenuItem>
                    </TextField>
                </div>
                <div className="input-group">
                    <label htmlFor="startTime">Ngày bắt đầu:</label>
                    <input type="datetime-local" id="startTime" />
                </div>
                <div className="input-group">
                    <label htmlFor="endTime">Ngày kết thúc:</label>
                    <input type="datetime-local" id="endTime" />
                </div>
                <div className="button-container">
                    {/* <button onClick={addExam}>Tạo kỳ thi</button> */}
                    <Button onClick={addExam} variant="contained" color='success'>Tạo kỳ thi</Button>
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
    )

}

export default ExamManager
