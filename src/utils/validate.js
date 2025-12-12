// /src/utils/validate.js

import bus from './eventBus'

// Kiểm tra email
export function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return {
        isValid: re.test(email),
        message: 'Email không hợp lệ'
    };
}

// Kiểm tra mật khẩu (tối thiểu 6 ký tự)
export function validatePassword(password) {
    const minLength = 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!password || password.length < minLength) {
        return {
            isValid: false,
            message: 'Mật khẩu phải có ít nhất 8 ký tự'
        };
    }

    if (!hasLowerCase) {
        return {
            isValid: false,
            message: 'Mật khẩu phải có ít nhất 1 chữ thường'
        };
    }

    if (!hasUpperCase) {
        return {
            isValid: false,
            message: 'Mật khẩu phải có ít nhất 1 chữ hoa'
        };
    }

    if (!hasNumber) {
        return {
            isValid: false,
            message: 'Mật khẩu phải có ít nhất 1 chữ số'
        };
    }

    if (!hasSpecialChar) {
        return {
            isValid: false,
            message: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt'
        };
    }

    return {
        isValid: true,
        message: ''
    };
}


// Kiểm tra họ và tên (chỉ chứa chữ cái và khoảng trắng)
export function validateFullName(name) {
    if (!name || name.trim() === '') {
        return { isValid: false, message: 'Họ và tên không được để trống' };
    }
    if (name.length < 3 || name.length > 50) {
        return { isValid: false, message: 'Họ và tên phải từ 3 đến 50 ký tự' };
    }
    const pattern = /^[a-zA-ZÀ-ỹ\s]+$/;
    if (!pattern.test(name)) {
        return { isValid: false, message: 'Họ và tên chỉ được chứa chữ cái và khoảng trắng' };
    }
    return { isValid: true, message: '' };
}

export async function checkEmailExists(email) {
    try {
        // Try new API endpoint first
        const res = await fetch('http://localhost:3001/checkemail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        const result = await res.json();
        return result.exists === true;
    } catch (error) {
        console.error('Lỗi kiểm tra email:', error);
        // Fallback to old endpoint
        try {
            const res = await fetch('http://localhost:3000/api/auth/checkemail', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const result = await res.json();
            return result.exists === true;
        } catch (fallbackError) {
            console.error('Lỗi kiểm tra email (fallback):', fallbackError);
            return false;
        }
    }
}



// Kiểm tra mật khẩu xác nhận
export function validateConfirmPassword(password, confirmPassword) {
    return {
        isValid: password === confirmPassword,
        message: 'Mật khẩu xác nhận không khớp'
    };
}

export function validateAcceptTerms(acceptTerms) {
    return acceptTerms === true;
}

//Hàm để lưu dữ liệu (Legacy - for backward compatibility)
export async function CreateAccount(username, email, password) {
    try {
        console.log('Đang gửi dữ liệu đăng ký:', {
            fullName: username,
            email: email,
            passWord: password
        });

        // Try new API endpoint first
        let response = await fetch("http://localhost:3001/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                fullName: username,
                email: email,
                passWord: password,
            }),
        });

        // Fallback to old endpoint if new one fails
        if (!response.ok) {
            response = await fetch("http://localhost:3000/api/auth/createaccount", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fullName: username,
                    email: email,
                    passWord: password,
                }),
            });
        }

        const result = await response.json();
        console.log('Kết quả từ server đăng ký:', result);

        if (response.ok && result.success) {
            console.log("Đăng ký thành công!", result);
            alert(result.message || "Đăng ký thành công!");
            return { success: true };
        } else {
            console.error("Lỗi từ server:", result);
            alert(result.message || "Đăng ký thất bại!");
            return { success: false };
        }
    } catch (error) {
        console.error("Lỗi:", error);
        alert("Có lỗi xảy ra khi đăng ký");
        return { success: false };
    }
}

//Hàm kiểm tra đăng nhập (Legacy - for backward compatibility)
export async function KiemTraDangNhap(email, password, router) {
    try {
        // Try new API endpoint first
        let res = await fetch("http://localhost:3001/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                passWord: password,
            }),
        });

        // Fallback to old endpoint if new one fails
        if (!res.ok) {
            res = await fetch("http://localhost:3000/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    passWord: password,
                }),
            });
        }

        const result = await res.json();

        if (res.ok && (result.success || result.message === 'Đăng nhập thành công!')) {
            // Lưu thông tin người dùng vào localStorage
            const userData = result.data?.user || result.user;
            const token = result.data?.token || result.token;
            
            if (token) {
                localStorage.setItem('token', token);
            }
            if (userData) {
                localStorage.setItem('userFullName', userData.fullName || '');
                localStorage.setItem('userEmail', userData.email || '');
                localStorage.setItem('isLoggedIn', 'true');
                
                // Save role to localStorage
                if (userData.role) {
                    localStorage.setItem('userRole', userData.role);
                }
                
                if (userData._id) {
                    localStorage.setItem('userId', userData._id);
                } else if (userData.id) {
                    localStorage.setItem('userId', userData.id);
                }
                if (userData.user_id) {
                    localStorage.setItem('user_id', userData.user_id);
                }
                
                // Save other user data if available
                // Always save avatar and cover URLs, even if empty (to preserve existing)
                if (userData.avatar_url !== undefined) {
                    localStorage.setItem('userAvatar', userData.avatar_url || '');
                }
                if (userData.cover_url !== undefined) {
                    localStorage.setItem('userCover', userData.cover_url || '');
                }
                if (userData.is_verified !== undefined) {
                    localStorage.setItem('userVerified', userData.is_verified.toString());
                }
            }
            
            // Emit event đăng nhập thành công
            bus.emit('login-success', {
                fullName: userData?.fullName || '',
                email: userData?.email || '',
                isLoggedIn: true
            });
            
            // Thông báo thành công
            alert(result.message || "Đăng nhập thành công");
            
            // Chuyển hướng về trang chủ
            if (router) {
                router.push('/');
            }
            
            return { success: true, fullName: userData?.fullName || '' };
        } else {
            console.error("Lỗi từ server:", result);
            alert(result.error || result.message || "Email hoặc mật khẩu không đúng");
            return { success: false };
        }
    } catch (error) {
        console.log("Lỗi:", error);
        alert("Có lỗi xảy ra khi đăng nhập");
        return { success: false };
    }
}

// Thêm hàm đăng xuất
export function DangXuat(router) {
    // Xóa thông tin người dùng khỏi localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userFullName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    localStorage.removeItem('user_id');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userCover');
    localStorage.removeItem('userVerified');
    
    // Emit event đăng xuất
    bus.emit('logout');
    
    // Chuyển hướng về trang chủ
    if (router) {
        router.push('/');
    }
    
    // Reload trang để cập nhật UI
    window.location.reload();
}