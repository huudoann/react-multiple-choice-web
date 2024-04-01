import React, { useEffect } from 'react';
import { read, utils } from 'xlsx';
import './CreateAndEditExams.scss';
import { useParams } from 'react-router-dom';
import AdminNavBar from '../../components/NavBar/AdminNavBar';
import { endPoint } from '../../util/api/endPoint';


const CreateAndEditExams = () => {
    let { examId } = useParams();

    useEffect(() => {
        const addQuestionButton = document.getElementById("addQuestion");
        addQuestionButton.addEventListener("click", handleAddQuestionClick);

        const createExamForm = async () => {
            const response = await Request.Server.put(endPoint.createNewExam());
            console.log(response);
        }

        // Hủy đăng ký event listener khi component unmount
        return () => {
            addQuestionButton.removeEventListener("click", handleAddQuestionClick);
        };
    }, []); // [] để useEffect chỉ chạy một lần sau khi component được render

    // Xử lý khi nhấn nút "Thêm câu hỏi"
    const handleAddQuestionClick = () => {
        const questionList = document.getElementById("questionList");
        const div = document.createElement("div");

        // Tạo input cho câu hỏi
        const questionInput = document.createElement("input");
        questionInput.type = "text";
        questionInput.name = "questions[]";
        questionInput.placeholder = "Nhập câu hỏi";
        div.appendChild(questionInput);

        // Tạo input và label cho các đáp án và input radio đại diện cho đáp án đúng
        for (let i = 0; i < 4; i++) {
            const answerDiv = document.createElement("div");
            answerDiv.classList.add("answerDiv");

            // Tạo input radio đại diện cho đáp án đúng
            const correctAnswerRadio = document.createElement("input");
            correctAnswerRadio.type = "radio";
            correctAnswerRadio.name = `correctAnswer_${questionList.childElementCount}`;
            correctAnswerRadio.value = i;
            answerDiv.appendChild(correctAnswerRadio);

            // Tạo input cho đáp án
            const answerInput = document.createElement("input");
            answerInput.type = "text";
            answerInput.name = `answers[${questionList.childElementCount}][${i}]`;
            answerInput.placeholder = `Nhập đáp án ${String.fromCharCode(65 + i)}`;
            answerDiv.appendChild(answerInput);

            div.appendChild(answerDiv);
        }

        // Tạo nút xóa câu hỏi
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Xóa";
        deleteButton.type = "button";
        deleteButton.addEventListener("click", function () {
            div.remove();
        });
        div.appendChild(deleteButton);

        // Tạo nút chỉnh sửa câu hỏi
        const editButton = document.createElement("button");
        editButton.textContent = "Chỉnh sửa";
        editButton.type = "button";
        editButton.addEventListener("click", function () {
            // sửa câu hỏi ở đay
        });
        div.appendChild(editButton);

        questionList.appendChild(div);
    };

    return (
        <div className="content-container">
            <div className="navigation">
                <AdminNavBar />
            </div>
            <form id="examForm">
                <label htmlFor="examName">Tên kỳ thi:</label>
                <input type="text" id="examName" name="examName" required /><br />
                <label htmlFor="question">Danh sách câu hỏi:</label>
                <div id="questionList"></div>
                <button type="button" id="addQuestion">Thêm câu hỏi</button>
                <label htmlFor="excelInput" className="file-input-button">Lấy câu hỏi từ Excel
                    <input type="file" id="excelInput" />
                </label>
                <button type="submit">Lưu kỳ thi</button>
            </form>
        </div>
    );
}

export default CreateAndEditExams;
