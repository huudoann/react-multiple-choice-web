import React, { useState } from 'react';
import './UserManagement.scss';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [deleteIndex, setDeleteIndex] = useState(null);

    const addUser = () => {
        let fullName = document.getElementById('full_name').value;
        // let birthDate = document.getElementById('birth_date').value;
        // let studentId = document.getElementById('student_id').value;
        // let userClass = document.getElementById('class').value;

        if (fullName.trim() !== '') {
            setUsers(prevUsers => [...prevUsers, { name: fullName }]);
        } else {
            alert('Vui lòng nhập đầy đủ thông tin người dùng.');
        }
    }

    const editUser = (index) => {
        let updatedUsers = [...users];
        let user = updatedUsers[index];
        let fullName = prompt('Nhập tên mới:', user.name);
        // let birthDate = prompt('Nhập ngày sinh mới (YYYY-MM-DD):', user.birth);
        // let studentId = prompt('Nhập mã sinh viên mới:', user.id);
        // let userClass = prompt('Nhập lớp mới:', user.class);

        if (fullName !== null ) {
            updatedUsers[index] = { name: fullName};
            setUsers(updatedUsers);
        }
    }

    const deleteUser = (index) => {
        setDeleteIndex(index); // Hiển thị form xác nhận xóa
    }

    const confirmDeleteUser = () => {
        let updatedUsers = [...users];
        updatedUsers.splice(deleteIndex, 1);
        setUsers(updatedUsers);
        setDeleteIndex(null); // Ẩn form xác nhận xóa sau khi xác nhận
    }

    const cancelDeleteUser = () => {
        setDeleteIndex(null); // Ẩn form xác nhận xóa nếu hủy
    }

    return (
        <div className='UserManagement'>
            <div className="create-container-user">
                <input type="text" id="full_name" placeholder="Họ và tên" />
                {/* <input type="date" id="birth_date" /> */}
                {/* <input type="text" id="student_id" placeholder="Mã sinh viên" /> */}
                {/* <input type="text" id="class" placeholder="Lớp" /> */}
                <button onClick={addUser}>Thêm người dùng</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên người dùng</th>
                        {/* <th>Ngày sinh</th>
                        <th>Mã sinh viên</th>
                        <th>Lớp</th> */}
                        <th>Chỉnh sửa</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{user.name}</td>
                            {/* <td>{user.birth}</td>
                            <td>{user.id}</td>
                            <td>{user.class}</td> */}
                            <td>
                                <button className="edit" onClick={() => editUser(index)}>Sửa</button>
                                <button className="del" onClick={() => deleteUser(index)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {deleteIndex !== null && (
                <div id="delete_form">
                    <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
                    <button onClick={confirmDeleteUser}>Xác nhận</button>
                    <button onClick={cancelDeleteUser}>Hủy</button>
                </div>
            )}
        </div>
    );
}

export default UserManagement;
