import React, { useEffect } from 'react';
import { read, utils } from 'xlsx';
import './CreateAndEditExams.scss';
import { useParams } from 'react-router-dom';


const CreateAndEditExams = () => {

    let { examId } = useParams();

    console.log(examId);
    useEffect(() => {
        const examForm = document.getElementById("examForm");
        const questionList = document.getElementById("questionList");
        const addQuestionButton = document.getElementById("addQuestion");
        const excelInput = document.getElementById("excelInput");

        // Khai báo một mảng để lưu các đáp án đúng
        const correctAnswers = [];

        addQuestionButton.addEventListener("click", function () {
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

            questionList.appendChild(div);

            // Lưu đáp án đúng vào mảng correctAnswers
            correctAnswers.push(questionList.childElementCount);
        });


        examForm.addEventListener("submit", function (event) {
            event.preventDefault();
            // Gửi dữ liệu của kỳ thi lên server
            // Sau khi gửi, có thể chuyển hướng hoặc thực hiện các hành động khác
            console.log("Dữ liệu kỳ thi đã được gửi!");
        });

        excelInput.addEventListener('change', function (e) {
            var file = e.target.files[0];
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = new Uint8Array(e.target.result);
                var workbook = read(data, { type: 'array' });
                var sheetName = workbook.SheetNames[0];
                var sheet = workbook.Sheets[sheetName];
                var html = utils.sheet_to_html(sheet);
                questionList.innerHTML = html;
            };
            reader.readAsArrayBuffer(file);
        });
    }, []); // [] để useEffect chỉ chạy một lần sau khi component được render

    return (
        <div className="content-container">
            <form id="examForm">
                <label htmlFor="examName">Tên kỳ thi:</label>
                <input type="text" id="examName" name="examName" required /><br />
                {/* <label htmlFor="description">Mô tả:</label>
                <textarea id="description" name="description"></textarea><br />
                <label htmlFor="examType">Loại kỳ thi:</label>
                <select id="examType" name="examType">
                    <option value="free">Tự do</option>
                    <option value="timed">Thời gian cụ thể</option>
                </select><br /> */}
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
