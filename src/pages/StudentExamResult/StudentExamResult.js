import React from "react";

function StudentExamResult() {
  return (
    <>
        <div class="container-fluid px-4">
            <h1 class="mt-4">Chi tiết kết quả kỳ thi của sinh viên </h1>

            <div class="card mb-4">
                <div class="card-body">
                    Trang kết quả kỳ thi.
                </div>

            </div>

            <div class="card mb-4">
                <div class="card-header">

                </div>
                <div class="card-body">
                    <h2 class="card-score">
                        Kết quả:
                    </h2>
                </div>
                <table id="result-table" class="table">
                    <thead>
                        <tr>
                            <th>Câu</th>
                            <th>Đáp án</th>
                            <th>Đáp án của sinh viên</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    </>
  );
}

export default StudentExamResult;