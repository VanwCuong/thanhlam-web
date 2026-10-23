const SPREADSHEET_ID = '1SFx-H3QB3T5yJiJiwPPWJr4WEKVytyksE0CZAiujoQI';
const SHEET_NAME = 'Trang tính2';
const FALLBACK_SHEET_NAME = 'Orders';

const ORDER_HEADERS = [
  'Thời gian',
  'Họ tên',
  'Số điện thoại',
  'Địa chỉ',
  'Chiều cao (cm)',
  'Cân nặng (kg)',
  'Ghi chú',
  'Sản phẩm',
  'Tổng tiền'
];

function testConnection() {
  const sheet = getOrderSheet_();
  const message = `Đã kết nối tới tab "${sheet.getName()}".`;
  Logger.log(message);
  return message;
}

function doGet() {
  try {
    const sheet = getOrderSheet_();
    return jsonResponse_({
      ok: true,
      message: 'Apps Script đã kết nối Google Sheet.',
      sheetName: sheet.getName()
    });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  }
}

function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error('Request body is missing. Test by submitting the website form, not by running doPost in the editor.');
    }

    const order = JSON.parse(e.postData.contents);
    const requiredFields = ['customerName', 'customerPhone', 'customerAddress', 'cartItems'];
    const missingFields = requiredFields.filter(field => !String(order[field] || '').trim());

    if (missingFields.length) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    const sheet = getOrderSheet_();
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(ORDER_HEADERS);
    }

    sheet.appendRow([
      new Date(),
      safeCell_(order.customerName, 150),
      safeCell_(order.customerPhone, 50),
      safeCell_(order.customerAddress, 500),
      safeCell_(order.customerHeight, 20),
      safeCell_(order.customerWeight, 20),
      safeCell_(order.orderNote, 1000),
      safeCell_(order.cartItems, 5000),
      safeCell_(order.totalPrice, 50)
    ]);

    SpreadsheetApp.flush();
    return jsonResponse_({ ok: true });
  } catch (error) {
    console.error(error);
    return jsonResponse_({ ok: false, error: String(error.message || error) });
  }
}

function getOrderSheet_() {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = spreadsheet.getSheetByName(SHEET_NAME) ||
    spreadsheet.getSheetByName(FALLBACK_SHEET_NAME);

  if (!sheet) {
    throw new Error(`Không tìm thấy tab "${SHEET_NAME}" hoặc "${FALLBACK_SHEET_NAME}".`);
  }

  return sheet;
}

function safeCell_(value, maxLength) {
  let text = String(value == null ? '' : value).trim().slice(0, maxLength);

  if (/^[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return text;
}

function jsonResponse_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}
