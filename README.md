# An Cư — website bất động sản

MVP bất động sản chạy bằng Node.js thuần, không cần cài package bên ngoài.

## Chạy trên máy

1. Cài Node.js 18 trở lên.
2. Mở terminal tại thư mục dự án và chạy `npm start`.
3. Truy cập http://localhost:3000.

Có thể đổi cổng bằng biến môi trường `PORT` (PowerShell: `$env:PORT=4000; npm start`).

## Tính năng

- Tìm theo địa điểm, lọc loại hình, mua bán/cho thuê và khoảng giá.
- Xem trang chi tiết dạng hộp thoại, thông tin liên hệ và gọi điện.
- Tạo tài khoản, đăng nhập, đăng tin bất động sản và xóa tin của mình.
- Lưu danh sách yêu thích theo tài khoản.
- Giao diện responsive cho máy tính và điện thoại.
- Trang khám phá riêng cho mua nhà và căn hộ, kèm checklist xem nhà/dự án.
- Bộ lọc căn hộ theo diện tích và phòng ngủ, thông tin dự án/tầng/pháp lý trong chi tiết tin.
- Công cụ ước tính khoản trả vay mua nhà và so sánh tối đa 3 bất động sản.
- Luồng thanh toán demo: tạo yêu cầu đặt cọc, chọn phương thức mô phỏng, xác nhận demo và xem lịch sử giao dịch.
- Tin đăng hỗ trợ nén/tải tối đa 5 ảnh, tiện ích, pháp lý và vị trí bản đồ.
- Bộ lọc theo khu vực, giá tối thiểu/tối đa, pháp lý, diện tích và số phòng ngủ.
- Đặt lịch xem nhà, người đăng xác nhận lịch hẹn; tài khoản có mục tin lưu, tin đăng, lịch hẹn và giao dịch.
- Có thể bật hàng chờ kiểm duyệt và trang quản trị qua biến `ADMIN_EMAIL`.
- Mỗi bất động sản có đường dẫn chia sẻ riêng (`/listing/:id`), thư viện ảnh và trang thông tin chi tiết.
- Chủ tin có thể sửa tin của mình; khi bật quản trị, nội dung sửa đổi quay lại trạng thái chờ duyệt.
- Danh sách phân trang phía máy chủ, sắp xếp theo mới nhất hoặc giá thấp trước.
- Dữ liệu tin đăng, tài khoản và yêu thích lưu trong `data.json`, được tạo lần đầu khi chạy máy chủ.

Tin mẫu được nạp khi `data.json` chưa tồn tại. Mật khẩu được băm bằng scrypt. Đây là MVP chạy cục bộ; phiên đăng nhập lưu trong bộ nhớ máy chủ và cần đăng nhập lại sau khi khởi động lại máy chủ. Ảnh mẫu tải từ Unsplash.

## Thanh toán

Chức năng thanh toán hiện chỉ mô phỏng quy trình kiểm thử và lưu trạng thái giao dịch trong `data.json`. Không có cổng thanh toán, mã QR ngân hàng hoặc giao dịch tiền thật. Không nhập số thẻ, mật khẩu ngân hàng hay OTP vào bản demo. Muốn nhận thanh toán thật cần tích hợp nhà cung cấp thanh toán, xác minh webhook và cấu hình bảo mật phía máy chủ.

## Quản trị và ảnh

## Google Maps và tìm địa chỉ

Tích hợp dùng Place Autocomplete (New) để gợi ý địa chỉ Việt Nam. Chọn địa chỉ trong form đăng tin sẽ điền địa chỉ, vĩ độ, kinh độ và hiển thị bản đồ Google. Ô khu vực trên trang tìm kiếm cũng có nút tìm địa chỉ Google; kết quả vẫn lọc trong kho tin của An Cư.

1. Trong Google Cloud, bật billing, **Maps JavaScript API** và **Places API (New)**.
2. Tạo API key dành cho trình duyệt, giới hạn theo Website/HTTP referrers: `http://127.0.0.1:3000/*`, `http://localhost:3000/*` và domain thực tế khi triển khai. Giới hạn API key vào hai API trên.
3. Dừng server cũ rồi chạy trong PowerShell:

     ```powershell
     $env:GOOGLE_MAPS_BROWSER_KEY='API_KEY_CUA_BAN'
   npm start
   ```

Key trình duyệt sẽ được gửi cho trình duyệt qua `/api/maps-config` theo thiết kế Google Maps; không dùng khóa dịch vụ/server ở đây. Chưa có key thì nhập địa chỉ thủ công vẫn hoạt động. Bản đồ dùng `DEMO_MAP_ID` cho môi trường thử nghiệm; thay bằng map ID của dự án khi triển khai chính thức.

Tài liệu: https://developers.google.com/maps/documentation/javascript/place-autocomplete-new

### Cấu hình kiểm duyệt

Để bật kiểm duyệt, khởi chạy với email quản trị, ví dụ PowerShell: `$env:ADMIN_EMAIL='admin@example.com'; npm start`. Đăng ký tài khoản bằng email này để hiện nút **Kiểm duyệt**. Tin đăng mới sẽ ở trạng thái chờ duyệt. Nếu không đặt `ADMIN_EMAIL`, tin mới được hiển thị ngay. Ảnh tải lên được lưu trong `public/uploads`; dữ liệu hồ sơ và lịch hẹn nằm trong `data.json`.
