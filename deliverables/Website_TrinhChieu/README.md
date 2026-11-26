# Website Trình Chiếu V2 — LẠC HỒNG SỐ (Nghị quyết 57-NQ/TW · Cụm 1)

Website trình chiếu tương tác 7 giai đoạn phục vụ phần thuyết trình bộ 05 ấn phẩm **LẠC HỒNG SỐ – Nghị quyết 57 đến gần thanh niên Cụm 1** tại **Trại Thanh niên số thành phố Đồng Nai năm 2026** (hỗ trợ trình bày **Mục 2 – Thiết kế**, Chủ đề 1: *Nghị quyết đến gần thanh niên*).

---

## 1. Đường dẫn trực tuyến, Kho mã nguồn & Nguồn chân lý V2

- **Website trình chiếu trực tuyến (GitHub Pages):**  
  `https://lovemvaf.github.io/lac-hong-so-nghiquyet57-cum1/`
- **Kho mã nguồn độc lập (GitHub):**  
  `https://github.com/lovemvaf/lac-hong-so-nghiquyet57-cum1` *(nhánh `main`; mốc V1 trước nâng cấp được gắn tag **`v1-pre-sync`** và lưu ảnh đối chiếu tại `LacHongSo_Cum1_NQ57_2026/qa/before_v1/`)*
- **Nguồn chân lý duy nhất (SSOT):**  
  `LacHongSo_Cum1_NQ57_2026/content/campaign-content.json` (đồng bộ trực tiếp vào `src/content/campaign-content.json` và `src/content/lac-hong-data.js`).
- **Nguồn chính thống Nghị quyết 57-NQ/TW (Bộ Chính trị, 22/12/2024):**  
  - **Nguồn chính (Primary QR & Citation):** [Cổng TTĐT Chính phủ (`xaydungchinhsach.chinhphu.vn`)](https://xaydungchinhsach.chinhphu.vn/toan-van-nghi-quyet-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-119241224180048642.htm)
  - **Nguồn đối chiếu phụ (Mirror):** [Bộ Khoa học và Công nghệ (`mst.gov.vn`)](https://mst.gov.vn/toan-van-nghi-quyet-57-nq-tw-ve-dot-pha-phat-trien-khoa-hoc-cong-nghe-doi-moi-sang-tao-va-chuyen-doi-so-quoc-gia-197250813164610621.htm)
  - **Văn bản triển khai cấp Chính phủ (tách biệt trong Modal `I`):** `03/NQ-CP` (`09/01/2025`) & `71/NQ-CP` (`01/04/2025`).

> **Lưu ý tách biệt dự án gốc (Zero Overwrite):**  
> Dự án **LẠC HỒNG SỐ** vận hành trên thư mục và kho Git **hoàn toàn độc lập** (`lovemvaf/lac-hong-so-nghiquyet57-cum1`). Kho lưu trữ và website gốc của dự án *“Nét vẽ tri ân – Một dòng code, vạn chân trời”* (`lovemvaf/net-ve-tri-an-dntu-2026` · `https://lovemvaf.github.io/net-ve-tri-an-dntu-2026/`) giữ nguyên ở commit `f0138b6` bản **V10 (20/11)**, tuyệt đối không bị ghi đè.

---

## 2. Cấu trúc mạch trình chiếu 7 giai đoạn (V2)

| Giai đoạn | Tên màn hình | Tệp ấn phẩm & Điểm nổi bật V2 |
|---|---|---|
| **Stage 0** | `Mở đầu` (`#stage-landing`) | Huy hiệu Đoàn nguyên bản (`huy-hieu-doan-clean.png`), họa tiết **Trống đồng Đông Sơn** vector 16 tia mặt trời & vòng Chim Lạc, tổng quan chiến dịch **LẠC HỒNG SỐ**, 05 thẻ xem trước ấn phẩm V2 (bấm để nhảy nhanh), nút CTA **Khám phá bộ 05 ấn phẩm →**. |
| **Stage 1** | `01 / 05` (`01_dat_cau_hoi_1080x1350.png`) | **ĐẶT VẤN ĐỀ** — *NGHỊ QUYẾT 57 GẦN BẠN THẾ NÀO?* + nút **`Tải PNG`** + chip đồng bộ `Video: SHORT 1 + đầu SHORT 2`. |
| **Stage 2** | `02 / 05` (`02_quan_diem_cot_loi_1080x1350.png`) | **QUAN ĐIỂM CỐT LÕI** — *HIỂU ĐÚNG ĐỊNH HƯỚNG* + **4 thẻ tóm tắt Mục I** (`Động lực phát triển`, `Con người là trung tâm`, `5 nền tảng cốt lõi`, `An toàn số`) gắn nhãn `Định hướng NQ57`. |
| **Stage 3** | `03 / 05` (`03_muc_tieu_2030_tam_nhin_2045_1080x1350.png`) | **MỤC TIÊU & TẦM NHÌN** — *2030 → 2045: TẦM NHÌN SỐ* — **tự động hiển thị ngay khối `#panel-policy-highlights`** (`MỤC TIÊU ĐẾN NĂM 2030`: `>= 30% GDP`, `> 80%`, `TOP 3 ĐNA · TOP 50 THẾ GIỚI`, `2% GDP`; `TẦM NHÌN ĐẾN NĂM 2045`: `>= 50% GDP`, `TOP 30 THẾ GIỚI`, `NƯỚC PHÁT TRIỂN, THU NHẬP CAO`) kèm nhãn **`MỤC TIÊU / TẦM NHÌN THEO NGHỊ QUYẾT 57 (KHÔNG PHẢI KẾT QUẢ HIỆN TẠI)`**. |
| **Stage 4** | `04 / 05` (`04_thanh_nien_cum1_hanh_dong_1080x1350.png`) | **THANH NIÊN HÀNH ĐỘNG** — *THANH NIÊN CỤM 1 HÀNH ĐỘNG* + **5 thẻ phần việc** gắn nhãn `Đề xuất Cụm 1` (không phải thống kê kết quả đã diễn ra). |
| **Stage 5** | `05 / 05` (`05_lan_toa_1080x1350.png`) | **LAN TỎA** — *HIỂU ĐÚNG. LÀM THẬT. LAN TỎA.* + mã QR thật trên poster & nút mở toàn văn `xaydungchinhsach.chinhphu.vn` + link đối chiếu `mst.gov.vn`. |
| **Stage 6** | `Tổng kết` (`#stage-finale`) | Thư viện thu nhỏ 05 ấn phẩm (nhấp để phóng to Lightbox + **`Tải PNG`**), mã QR động trỏ về `xaydungchinhsach.chinhphu.vn`, link đối chiếu `mst.gov.vn`, nút mở Modal **`7NV, 5 câu hỏi & Nguồn (I)`**, quay lại & công bố minh bạch AI. |

- Toàn bộ 05 ấn phẩm hiển thị nguyên vẹn tỷ lệ **`1080 × 1350` (`object-fit: contain`)** không cắt xén ở `1920×1080`, `1366×768` và `390×844` (cuộn dọc mượt trên di động, HUD 2 hàng gọn).
- **Không** có bảng debug/overlay kỹ thuật; **không** tự phát `<audio>`; **100%** font **Be Vietnam Pro** đóng gói cục bộ hoạt động ngoại tuyến.

---

## 3. Phím tắt & Thao tác trình bày trực tiếp (V2)

| Phím / Nút trên giao diện | Tác dụng |
|---|---|
| `→` (`ArrowRight`) / `Space` / **Tiếp ›** | Chuyển sang giai đoạn tiếp theo (`Mở đầu → 01 → 02 → 03 → 04 → 05 → Tổng kết`). |
| `←` (`ArrowLeft`) / **‹ Trước** | Lùi về giai đoạn trước đó. |
| `Home` / `R` / **Về đầu (R)** | Quay tức thì về màn hình Mở đầu (`Stage 0`). |
| `End` | Chuyển nhanh đến màn hình Tổng kết (`Stage 6`). |
| `N` / **Lời dẫn (N)** | Bật/tắt khung **Lời dẫn thuyết trình** tương ứng từng giai đoạn. |
| `Z` / **Phóng to (Z)** / Nhấp vào poster | Mở **Lightbox độ phân giải gốc** kèm nút **`Tải PNG`** trực tiếp (`←` / `→` để lướt giữa 05 poster, `Esc` hoặc `Z` để đóng). |
| `I` / **Nguồn & 7NV (I)** / **Xem thêm (I)** | Mở/đóng hộp thoại **`#sources-modal`** chứa trọn vẹn **7 nhiệm vụ (4 trụ)**, **5 câu hỏi đánh giá (`THUYẾT TRÌNH`)**, link **`chinhphu.vn` / `mst.gov.vn` / `03/NQ-CP` / `71/NQ-CP`** và tuyên bố ranh giới sáng tạo (`Esc` để đóng). |
| **Tải PNG** *(dưới poster & trong Lightbox)* | Tải trực tiếp tệp ảnh gốc `0X_..._1080x1350.png`. |
| `L` / **Chế độ nhẹ (L)** | Bật/tắt **Chế độ nhẹ** (dừng canvas Chim Lạc & hiệu ứng GSAP; tự động bật khi máy bật `prefers-reduced-motion: reduce`). |
| `F` / **Toàn màn hình (F)** | Bật/tắt trình chiếu toàn màn hình trên máy tính/máy chiếu. |

### Gợi ý nhịp thuyết trình sáng 27/11/2026 (tối đa 06 phút trình bày + 04 phút phản biện)
1. **0:00 – 0:30 (`Mở đầu`):** Giới thiệu Đội `[CHƯA XÁC NHẬN]` Cụm 1, concept **LẠC HỒNG SỐ** và khẩu hiệu *Hiểu đúng. Làm thật. Lan tỏa.* (Xem kịch bản đầy đủ tại [SPEAKER_NOTES_05_POSTERS.md](file:///c:/Users/asus/Desktop/Netvetrian_QKD_KhoaCNTT-DNTU/lac-hong-so-nghiquyet57-cum1/LacHongSo_Cum1_NQ57_2026/content/SPEAKER_NOTES_05_POSTERS.md)).
2. **0:30 – 4:50 (`01/05` → `05/05`):** Lướt lần lượt 5 poster; tại `03/05` chỉ thẳng khối **`2030 → 2045`** (*Mục tiêu theo NQ 57, không phải kết quả hiện tại*) và nhấn **`I`** khi Ban Giám khảo hỏi về **7 nhiệm vụ** hoặc **5 câu hỏi trọng tâm**.
3. **4:50 – 5:30 (`Tổng kết`):** Mời Ban Giám khảo quét thử QR trên Poster `05` hoặc màn hình Finale trỏ thẳng về `xaydungchinhsach.chinhphu.vn` (kèm bản đối chiếu `mst.gov.vn`), sau đó bước vào `04 phút` phản biện.

---

## 4. Chạy cục bộ, Build và Kiểm định tự động

Yêu cầu môi trường: **Node.js >= 20**, **pnpm** (hoặc **npm**), **Python + Pillow** (cho `qa:posters`).

```bash
# 1. Di chuyển vào thư mục dự án độc lập
cd lac-hong-so-nghiquyet57-cum1

# 2. Cài đặt phụ thuộc (nếu chưa cài)
pnpm install

# 3. Chạy máy chủ trình chiếu cục bộ (Vite)
# Truy cập: http://127.0.0.1:5174/lac-hong-so-nghiquyet57-cum1/
pnpm run dev

# 4. Đóng gói bản dựng tĩnh (./dist) và xem thử bản build
pnpm run build
pnpm run preview

# 5. Kiểm định bộ 05 ấn phẩm PNG/SVG & giải mã pixel QR thật (198 tiêu chí)
npm run qa:posters

# 6. Chạy bộ kiểm thử E2E Playwright (1920x1080, 1366x768, 390x844, prefers-reduced-motion)
pnpm test
```
