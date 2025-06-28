// InstructionsPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InstructionsPage() {
  const navigate = useNavigate();
  const [language, setLanguage] = useState('en');

  const instructions = {
    en: {
      buyers: [
        'Register for an account as a Buyer.',
        'Complete the payment process to unlock your account features.',
        'Initiate a transaction by creating a payment escrow and uploading your contract.',
        'Provide the Transaction ID (TXID) to the Seller.',
        'Monitor transaction status and uploaded documents through your dashboard.',
        'Once all shipment documents are uploaded by the Seller, review them carefully.',
        'Approve or reject the transaction based on the documentation provided.',
        'Upon approval, funds will be released to the Seller automatically.'
      ],
      sellers: [
        'Register for an account as a Seller.',
        'Receive the Transaction ID (TXID) from your Buyer.',
        'Log in to your account and go to the Shipment Confirmation page.',
        'Upload all required shipment documents:',
        'Confirm acceptance of the terms of the contract uploaded by the Buyer.',
        'Submit all documentation for Buyer review.',
        'Wait for the Buyer to approve the transaction and release payment.'
      ],
      documents: [
        'Commercial Invoice',
        'Packing List',
        'Bill of Lading',
        'Insurance Certificate',
        'Certificate of Origin',
        'Inspection Certificate',
        'Shipment Images'
      ]
    },
    ru: {
      buyers: [
        'Зарегистрируйте аккаунт как покупатель.',
        'Завершите процесс оплаты, чтобы разблокировать функции аккаунта.',
        'Начните сделку, создав эскроу и загрузив ваш контракт.',
        'Предоставьте идентификатор транзакции (TXID) продавцу.',
        'Следите за статусом сделки и загруженными документами через панель управления.',
        'После загрузки всех документов продавцом внимательно их проверьте.',
        'Одобрите или отклоните сделку на основе предоставленных документов.',
        'После одобрения средства автоматически будут переведены продавцу.'
      ],
      sellers: [
        'Зарегистрируйте аккаунт как продавец.',
        'Получите идентификатор транзакции (TXID) от покупателя.',
        'Войдите в аккаунт и перейдите на страницу подтверждения отправки.',
        'Загрузите все необходимые документы отгрузки:',
        'Подтвердите принятие условий контракта, загруженного покупателем.',
        'Отправьте все документы на проверку покупателю.',
        'Дождитесь одобрения сделки и перевода средств.'
      ],
      documents: [
        'Коммерческий инвойс',
        'Упаковочный лист',
        'Коносамент',
        'Страховой сертификат',
        'Сертификат происхождения',
        'Сертификат инспекции',
        'Изображения отгрузки'
      ]
    },
    tr: {
      buyers: [
        'Alıcı olarak bir hesap oluşturun.',
        'Hesap özelliklerinizi açmak için ödeme sürecini tamamlayın.',
        'Bir ödeme emaneti oluşturarak ve sözleşmenizi yükleyerek işlemi başlatın.',
        'İşlem Kimliği (TXID)\'ni satıcıya verin.',
        'İşlem durumunu ve belgeleri panelinizden takip edin.',
        'Tüm belgeler satıcı tarafından yüklendikten sonra dikkatlice inceleyin.',
        'Belgeleri inceleyerek işlemi onaylayın veya reddedin.',
        'Onay sonrasında fonlar otomatik olarak satıcıya aktarılacaktır.'
      ],
      sellers: [
        'Satıcı olarak bir hesap oluşturun.',
        'Alıcıdan İşlem Kimliği (TXID) alın.',
        'Hesabınıza giriş yapın ve Gönderi Onayı sayfasına gidin.',
        'Gerekli tüm belgeleri yükleyin:',
        'Alıcının yüklediği sözleşme şartlarını kabul edin.',
        'Tüm belgeleri alıcı incelemesi için gönderin.',
        'Alıcının işlemi onaylamasını ve ödemenin yapılmasını bekleyin.'
      ],
      documents: [
        'Ticari Fatura',
        'Paketleme Listesi',
        'Konşimento',
        'Sigorta Sertifikası',
        'Menşe Sertifikası',
        'Muayene Sertifikası',
        'Sevkiyat Görselleri'
      ]
    },
    vi: {
      buyers: [
        'Đăng ký tài khoản với vai trò Người Mua.',
        'Hoàn tất quy trình thanh toán để mở khóa các tính năng tài khoản.',
        'Tạo giao dịch bằng cách lập tài khoản ký quỹ và tải lên hợp đồng của bạn.',
        'Cung cấp Mã Giao Dịch (TXID) cho Người Bán.',
        'Theo dõi trạng thái giao dịch và tài liệu qua bảng điều khiển.',
        'Sau khi tất cả tài liệu được Người Bán tải lên, hãy xem xét cẩn thận.',
        'Phê duyệt hoặc từ chối giao dịch dựa trên tài liệu.',
        'Khi phê duyệt, khoản tiền sẽ được tự động chuyển cho Người Bán.'
      ],
      sellers: [
        'Đăng ký tài khoản với vai trò Người Bán.',
        'Nhận Mã Giao Dịch (TXID) từ Người Mua.',
        'Đăng nhập và truy cập trang Xác Nhận Giao Hàng.',
        'Tải lên tất cả tài liệu cần thiết:',
        'Xác nhận chấp nhận các điều khoản trong hợp đồng.',
        'Gửi toàn bộ tài liệu để Người Mua xem xét.',
        'Chờ Người Mua phê duyệt và giải ngân thanh toán.'
      ],
      documents: [
        'Hóa Đơn Thương Mại',
        'Phiếu Đóng Gói',
        'Vận Đơn',
        'Giấy Chứng Nhận Bảo Hiểm',
        'Giấy Chứng Nhận Xuất Xứ',
        'Giấy Chứng Nhận Kiểm Định',
        'Hình Ảnh Lô Hàng'
      ]
    },
    // Repeat similar structure for pl, nl, th, id, ms, sw, fa
  };

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Instructions for Use</h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="language">Select Language: </label>
        <select
          id="language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          style={{ padding: '5px' }}
        >
          <option value="en">English</option>
          <option value="ru">Русский</option>
          <option value="tr">Türkçe</option>
          <option value="vi">Tiếng Việt</option>
          <option value="pl">Polski</option>
          <option value="nl">Nederlands</option>
          <option value="th">ไทย</option>
          <option value="id">Bahasa Indonesia</option>
          <option value="ms">Bahasa Melayu</option>
          <option value="sw">Kiswahili</option>
          <option value="fa">فارسی</option>
        </select>
      </div>

      <section style={{ marginBottom: '40px' }}>
        <h2>Buyers</h2>
        <ol>
          {instructions[language]?.buyers.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </section>

      <section style={{ marginBottom: '40px' }}>
        <h2>Sellers</h2>
        <ol>
          {instructions[language]?.sellers.map((item, index) => (
            <li key={index}>
              {item}
              {index === 3 && (
                <ul>
                  {instructions[language]?.documents.map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </section>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button onClick={() => navigate('/')} style={{ padding: '10px 20px' }}>
          Return to Home
        </button>
      </div>
    </div>
  );
}
