# Nhom17_BookingFlight

Đây là code nguồn của dự án ứng dụng đặt vé máy bay (nhóm 17). Bao gồm backend (Node.js/Express) và frontend (React Native / Expo).

## Cấu trúc chính

- `backend/` - API server Node.js
  - `index.js` - entrypoint server
  - `config/` - cấu hình database
  - `controller/` - xử lý route
  - `model/` - schema / model dữ liệu
  - `routes/` - định nghĩa endpoint
- `frontend/` - mobile app (React Native + Expo)
  - `app/` - source TypeScript/JSX
  - `package.json`, `app.json`, `tsconfig.json` - cấu hình project

## Yêu cầu

- Node.js >= 14
- npm hoặc yarn
- MongoDB (hoặc điều chỉnh trong `backend/config/datasbase.js`)

## Cài đặt & chạy

1. Backend

```bash
cd d:/LT_DT/Nhom17_BookingFlight/backend
npm install
# cấu hình kết nối database trong config/datasbase.js
npm start
```

Server mặc định lắng nghe trên cổng được định nghĩa trong `index.js`.

2. Frontend (Expo)

```bash
cd d:/LT_DT/Nhom17_BookingFlight/frontend
npm install
npm start
```

Mở app bằng Expo Go hoặc mô phỏng trên iOS/Android.

## API cơ bản

- Xem các route trong `backend/routes/` để biết endpoint hiện có (tài khoản, sân bay, chuyến bay, đơn đặt hàng, v.v.).

## Ghi chú

- Kiểm tra `backend/config/datasbase.js` để cấu hình MongoDB.
- Nếu cần seed dữ liệu mẫu, thêm script seed hoặc sử dụng API để tạo dữ liệu.

## Liên hệ

Nếu cần hỗ trợ thêm, miêu tả yêu cầu hoặc lỗi cụ thể để mình giúp tiếp.

## Mô tả sơ lược

TwoT Flight — Hệ thống đặt vé máy bay (TwoT Flight) là nền tảng kết nối hành khách và các hãng hàng không, hỗ trợ tìm kiếm, so sánh, đặt và thanh toán vé cho cả chuyến nội địa và quốc tế. Ứng dụng phục vụ hai nhóm người dùng chính:

- **Guest**: Tìm kiếm chuyến bay, tìm điểm đến, xem chi tiết chuyến bay, và đăng ký tài khoản.
- **Member**: Bao gồm toàn bộ quyền của Guest, thêm đăng nhập, đặt vé, thanh toán trực tuyến, và xem lịch sử đặt vé.

Quy trình chính: Người dùng tìm kiếm chuyến bay → chọn chuyến phù hợp → nhập thông tin hành khách, chọn dịch vụ bổ sung (chỗ ngồi, hành lý, bảo hiểm) → thanh toán → nhận mã đặt chỗ và email xác nhận. Hệ thống đảm bảo xác thực thông tin, tính phí phụ thu theo thời gian thực và lưu lịch sử giao dịch.

## Use Case (sơ đồ)

Chèn sơ đồ Use Case ở đây (nếu có file ảnh, đặt tên `images/usecase.png`).

![Use Case](images/usecase.png)

> Ghi chú: nếu hình không hiển thị, vui lòng tải ảnh `usecase.png` vào thư mục `Nhom17_BookingFlight/images`.

## Class Diagram (sơ đồ lớp)

Sơ đồ lớp minh họa các thực thể chính: `Accounts`, `Airplane`, `Flight`, `Order`, `OrderDetails`, `Airport` cùng các mối quan hệ giữa chúng. (Nếu có ảnh, đặt tên `images/class_diagram.png`).

![Class Diagram](images/class_diagram.png)

> Ghi chú: nếu hình không hiển thị, vui lòng tải ảnh `class_diagram.png` vào thư mục `Nhom17_BookingFlight/images`.

## Lời khuyên để thêm ảnh vào repo

1. Tạo thư mục ảnh:

```bash
mkdir d:/LT_DT/Nhom17_BookingFlight/images
```

2. Đặt hai ảnh ở đó với tên `usecase.png` và `class_diagram.png`.

Sau khi upload ảnh, README sẽ hiển thị trực tiếp sơ đồ trong GitHub/VSCode.

