import { useAlert } from 'context/AlertContext';
import { useEffect } from 'react';

const ConnectSSE = () => {
    const { showAlert } = useAlert();
    useEffect(() => {
        // Khởi tạo kết nối SSE
        const eventSource = new EventSource('http://localhost:8000/api/sse', {
            withCredentials: true // Nếu cần gửi cookie hoặc thông tin xác thực);
        });

        eventSource.onopen = () => {
            showAlert("Connect success SSE", "success")
        };

        eventSource.onerror = () => {
            showAlert("Fail connect to SSE", "error");
            eventSource.close();
        };

        // Cleanup khi component unmount
        return () => {
            eventSource.close();
        };
    }, []);

    return null; // Không render gì cả, chỉ hiển thị toast
};

export default ConnectSSE;