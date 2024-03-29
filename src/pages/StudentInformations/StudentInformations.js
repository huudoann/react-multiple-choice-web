import React from "react";
import "./StudentInformations.scss";

function SearchSection() {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  return (
    <>
      <div class="container">
        <h1>Tra cứu điểm sinh viên</h1>
        <form id="search-form">
          <label for="student-id">Nhập mã sinh viên:</label>
          <input type="text" id="student-id" name="student-id" required />
          <button class="search-btn" type="submit">
            Tra cứu
          </button>
        </form>
        <div id="result"></div>
      </div>
    </>
  );
}

export default SearchSection;
