// AuthContext.js
import { createContext, useContext, useReducer, useEffect } from 'react';
import authAPI from 'api/authAPI';

const AuthContext = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true
            };
        case 'LOGOUT':
            return {
                ...state,
                user: null,
                isAuthenticated: false
            };
        case 'LOAD_USER':
            return {
                ...state,
                user: action.payload,
                isAuthenticated: true
            };
        case 'LOADED':
            return { ...state, isLoading: false };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        isAuthenticated: false,
        isLoading: true
    });

    // Kiểm tra auth khi khởi động app
    useEffect(() => {
        const loadUser = async () => {
            try {
                const user = await authAPI.getProfile();
                dispatch({
                    type: 'LOGIN',
                    payload: user.data
                });
            } catch (error) {
                // Nếu có lỗi nghĩa là cookie không hợp lệ hoặc hết hạn
                dispatch({ type: 'LOGOUT' });
            } finally {
                dispatch({ type: 'LOADED' });
            }
        };

        loadUser();
    }, []);

    // Login function - chỉ cần gọi API và xử lý response
    const login = async (credentials) => {
        try {
            // Gọi API login, BE sẽ set cookie tự động
            await authAPI.login(credentials);

            // Sau khi login thành công, lấy thông tin user
            const user = await authAPI.getProfile();
            dispatch({
                type: 'LOGIN',
                payload: user.data
            });
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    // Logout function - gọi API logout để BE xóa cookie
    const logout = async () => {
        try {
            await authAPI.logout();
        } finally {
            dispatch({ type: 'LOGOUT' });
        }
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                logout
            }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);