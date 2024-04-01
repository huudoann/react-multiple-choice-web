export const baseUrl = "http://localhost:8080/api"

// trước thì xem tất cả api r khai báo tỏng náy nhé
//thang làm be đưa mỗi cái postman thôi ah 
// thế thì api nào để ý mà đang chữ có số thì truyền vào đường dẫn kiểu như mấy cái delete hay get theo id
// ko hiểu thì ping be bảo nó giải thích ngồi mò cx lâu
// phải báo be hd run hoặc deploy lên server free nào đó thì ms test đc oke a thế cứ code như kia là oke r đúng ko a
// uk nhưng mà khi vào màn lấy dữ liệu thì sẽ phải gọi trong useEffect để a viết mẫu cho 

export const endPoint = {
    // auth
    signup: () => `${baseUrl}/auth/signup`,
    login: () => `${baseUrl}/auth/login`,

    //exam
    createNewExam: () => `${baseUrl}/exam/create-exam`,
    deleteExamById: (id) => `${baseUrl}/exam/delete-exam/${id}`,
    editExamById: (id) => `${baseUrl}/exam/edit/${id}`,
    getExamById: (id) => `${baseUrl}/exams/${id}`,
    getAllExams: () => `${baseUrl}/exam/get-all-exams`,

    //user
    getAllUsers: () => `${baseUrl}/user/all-users`,
    createUser: () => `${baseUrl}/auth/signup`,
    deleteUser: (id) => `${baseUrl}/user/delete-user/${id}`,

    //question
    createNewExam: (examId) => `${baseUrl}/question/create-question/${examId}`,
    // ví dụ cái api get exam by id
    // baseUrl là cái khai báo bên trên chỉ thêm đoạn sau chữ api thôi
    // truyền id vào đây
}

// const getMethods = async () => {
//     // lấy id r truyền vào trong cái hàm này nhé
//     // cái api này ko cần truyền parám nên chỉ cần ntn là đc
//     const response = await Request.Server.get(endPoint.getExamById(id));

//     console.log(response);

//     // response lầ dữ liệu trả ve từ api
//   }
//   // put post delete nó giống nhau về cách gọi chỉ khác phương thức thôi
//   // sửa post thành put hoac delete là đc

//   const postMethods = async () => {
//     // vd cái api create new exam là dùng pt post
//     // m thay mấy data fix cứng này bằng dữ liệu ng dùng nhập là đc
//     const response = await Request.Server.put(endPoint.createNewExam(), {
//       examName: examName,
//       description: description,
//       examType: examType,
//       startTime: startTime,
//       endTime: endTime
//     });

//     console.log(response);
//   }

//   const putMethods = async () => {
//     // mấy cái api liên quan đến sửa xóa thì sẽ phải truyền id vào nhé
//     const response = await Request.Server.put(endPoint.editExamById(id), {
//       //xong r cũng để data trong này
//       examName: examName,
//       description: description,
//       examType: examType,
//       startTime: startTime,
//       endTime: endTime
//     });

//     console.log(response);
//   }

//   const deleteMethods = async () => {
//     // mấy cái api liên quan đến sửa xóa thì sẽ phải truyền id vào nhé
//     const response = await Request.Server.delete(endPoint.deleteExamById(id));

//     console.log(response);
//   }