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
    pl: {
      buyers: [
        'Zarejestruj konto jako Kupujący.',
        'Dokończ proces płatności, aby odblokować funkcje konta.',
        'Rozpocznij transakcję, tworząc depozyt i przesyłając umowę.',
        'Przekaż identyfikator transakcji (TXID) Sprzedającemu.',
        'Monitoruj status transakcji i przesłane dokumenty w panelu.',
        'Po przesłaniu wszystkich dokumentów przez Sprzedającego dokładnie je sprawdź.',
        'Zatwierdź lub odrzuć transakcję na podstawie dokumentów.',
        'Po zatwierdzeniu środki zostaną automatycznie przekazane Sprzedającemu.'
      ],
      sellers: [
        'Zarejestruj konto jako Sprzedający.',
        'Odbierz identyfikator transakcji (TXID) od Kupującego.',
        'Zaloguj się i przejdź do strony Potwierdzenia Wysyłki.',
        'Prześlij wszystkie wymagane dokumenty wysyłki:',
        'Potwierdź akceptację warunków umowy przesłanej przez Kupującego.',
        'Prześlij dokumenty do weryfikacji przez Kupującego.',
        'Poczekaj na zatwierdzenie transakcji i przekazanie środków.'
      ],
      documents: [
        'Faktura Handlowa',
        'Lista Pakowania',
        'List Przewozowy',
        'Certyfikat Ubezpieczeniowy',
        'Certyfikat Pochodzenia',
        'Certyfikat Kontroli',
        'Zdjęcia Wysyłki'
      ]
    },
    nl: {
      buyers: [
        'Registreer een account als Koper.',
        'Voltooi het betalingsproces om accountfuncties te activeren.',
        'Start een transactie door een escrow aan te maken en uw contract te uploaden.',
        'Geef de Transactie-ID (TXID) aan de Verkoper.',
        'Controleer de status en documenten via uw dashboard.',
        'Bekijk zorgvuldig alle documenten die de Verkoper heeft geüpload.',
        'Keur de transactie goed of wijs deze af op basis van de documenten.',
        'Na goedkeuring worden de middelen automatisch vrijgegeven aan de Verkoper.'
      ],
      sellers: [
        'Registreer een account als Verkoper.',
        'Ontvang de Transactie-ID (TXID) van de Koper.',
        'Log in en ga naar de pagina Verzending Bevestigen.',
        'Upload alle vereiste verzenddocumenten:',
        'Bevestig de voorwaarden van het door de Koper geüploade contract.',
        'Verzend alle documenten ter beoordeling door de Koper.',
        'Wacht tot de Koper de transactie goedkeurt en de betaling wordt vrijgegeven.'
      ],
      documents: [
        'Handelsfactuur',
        'Verpakkingslijst',
        'Vrachtbrief',
        'Verzekeringscertificaat',
        'Oorsprongscertificaat',
        'Inspectiecertificaat',
        'Verzendfoto\'s'
      ]
    },
    th: {
  buyers: [
    'ลงทะเบียนบัญชีในฐานะผู้ซื้อ',
    'ดำเนินการชำระเงินเพื่อปลดล็อกฟีเจอร์บัญชี',
    'เริ่มธุรกรรมโดยสร้างเอสโครว์และอัปโหลดสัญญา',
    'ให้รหัสธุรกรรม (TXID) กับผู้ขาย',
    'ติดตามสถานะและเอกสารผ่านแดชบอร์ดของคุณ',
    'ตรวจสอบเอกสารทั้งหมดที่ผู้ขายอัปโหลดอย่างละเอียด',
    'อนุมัติหรือปฏิเสธธุรกรรมตามเอกสาร',
    'เมื่ออนุมัติ เงินจะถูกโอนให้ผู้ขายโดยอัตโนมัติ'
  ],
  sellers: [
    'ลงทะเบียนบัญชีในฐานะผู้ขาย',
    'รับรหัสธุรกรรม (TXID) จากผู้ซื้อ',
    'เข้าสู่ระบบและไปที่หน้าการยืนยันการจัดส่ง',
    'อัปโหลดเอกสารการจัดส่งที่จำเป็นทั้งหมด:',
    'ยืนยันการยอมรับเงื่อนไขของสัญญาที่ผู้ซื้ออัปโหลด',
    'ส่งเอกสารทั้งหมดให้ผู้ซื้อตรวจสอบ',
    'รอให้ผู้ซื้ออนุมัติธุรกรรมและปล่อยการชำระเงิน'
  ],
  documents: [
    'ใบแจ้งหนี้การค้า',
    'รายการบรรจุภัณฑ์',
    'ใบตราส่งสินค้า',
    'ใบรับรองประกันภัย',
    'ใบรับรองแหล่งกำเนิดสินค้า',
    'ใบรับรองการตรวจสอบ',
    'รูปภาพการจัดส่ง'
  ]
},
id: {
  buyers: [
    'Daftar akun sebagai Pembeli.',
    'Selesaikan proses pembayaran untuk membuka fitur akun.',
    'Mulai transaksi dengan membuat escrow dan mengunggah kontrak.',
    'Berikan ID Transaksi (TXID) kepada Penjual.',
    'Pantau status dan dokumen melalui dashboard.',
    'Tinjau semua dokumen yang diunggah Penjual dengan seksama.',
    'Setujui atau tolak transaksi berdasarkan dokumen.',
    'Setelah disetujui, dana akan otomatis dikirim ke Penjual.'
  ],
  sellers: [
    'Daftar akun sebagai Penjual.',
    'Terima ID Transaksi (TXID) dari Pembeli.',
    'Masuk dan buka halaman Konfirmasi Pengiriman.',
    'Unggah semua dokumen pengiriman yang diperlukan:',
    'Konfirmasi persetujuan syarat kontrak dari Pembeli.',
    'Kirim semua dokumen untuk ditinjau oleh Pembeli.',
    'Tunggu Pembeli menyetujui transaksi dan dana dikirim.'
  ],
  documents: [
    'Faktur Komersial',
    'Daftar Kemasan',
    'Surat Jalan',
    'Sertifikat Asuransi',
    'Sertifikat Asal',
    'Sertifikat Inspeksi',
    'Gambar Pengiriman'
  ]
},

ms: {
  buyers: [
    'Daftar akaun sebagai Pembeli.',
    'Lengkapkan proses pembayaran untuk membuka ciri akaun.',
    'Mulakan transaksi dengan membuat escrow dan memuat naik kontrak.',
    'Berikan ID Transaksi (TXID) kepada Penjual.',
    'Pantau status dan dokumen melalui papan pemuka.',
    'Semak semua dokumen yang dimuat naik oleh Penjual dengan teliti.',
    'Luluskan atau tolak transaksi berdasarkan dokumen.',
    'Selepas diluluskan, dana akan dihantar secara automatik kepada Penjual.'
  ],
  sellers: [
    'Daftar akaun sebagai Penjual.',
    'Terima ID Transaksi (TXID) daripada Pembeli.',
    'Log masuk dan pergi ke halaman Pengesahan Penghantaran.',
    'Muat naik semua dokumen penghantaran yang diperlukan:',
    'Sahkan penerimaan syarat kontrak yang dimuat naik oleh Pembeli.',
    'Hantar semua dokumen untuk semakan Pembeli.',
    'Tunggu Pembeli meluluskan transaksi dan pembayaran.'
  ],
  documents: [
    'Invois Komersial',
    'Senarai Pembungkusan',
    'Bil Muatan',
    'Sijil Insurans',
    'Sijil Asal',
    'Sijil Pemeriksaan',
    'Gambar Penghantaran'
  ]
},

sw: {
  buyers: [
    'Jisajili kama Mnunuzi.',
    'Kamilisha mchakato wa malipo kufungua vipengele vya akaunti.',
    'Anza muamala kwa kuunda escrow na kupakia mkataba wako.',
    'Toa Nambari ya Muamala (TXID) kwa Muuzaji.',
    'Fuatilia hali na hati kupitia dashibodi yako.',
    'Kagua hati zote zilizopakiwa na Muuzaji kwa makini.',
    'Idhinisha au kataa muamala kulingana na hati.',
    'Baada ya idhini, fedha zitatumwa moja kwa moja kwa Muuzaji.'
  ],
  sellers: [
    'Jisajili kama Muuzaji.',
    'Pokea Nambari ya Muamala (TXID) kutoka kwa Mnunuzi.',
    'Ingia na nenda kwenye ukurasa wa Uhakikisho wa Usafirishaji.',
    'Pakia hati zote muhimu za usafirishaji:',
    'Thibitisha kukubali masharti ya mkataba uliopakiwa na Mnunuzi.',
    'Tuma hati zote kwa ukaguzi wa Mnunuzi.',
    'Subiri Mnunuzi akubali muamala na fedha zitolewe.'
  ],
  documents: [
    'Ankara ya Kibiashara',
    'Orodha ya Ufungaji',
    'Hati ya Usafirishaji',
    'Cheti cha Bima',
    'Cheti cha Asili',
    'Cheti cha Ukaguzi',
    'Picha za Usafirishaji'
  ]
},

fa: {
  buyers: [
    'یک حساب به عنوان خریدار ایجاد کنید.',
    'فرآیند پرداخت را تکمیل کنید تا ویژگی‌های حساب فعال شود.',
    'با ایجاد حساب امانی و بارگذاری قرارداد، معامله را آغاز کنید.',
    'شناسه تراکنش (TXID) را به فروشنده ارائه دهید.',
    'وضعیت معامله و اسناد را از طریق داشبورد پیگیری کنید.',
    'پس از بارگذاری تمام اسناد توسط فروشنده، آن‌ها را با دقت بررسی کنید.',
    'معامله را بر اساس اسناد تایید یا رد کنید.',
    'پس از تایید، وجه به طور خودکار به فروشنده منتقل می‌شود.'
  ],
  sellers: [
    'یک حساب به عنوان فروشنده ایجاد کنید.',
    'شناسه تراکنش (TXID) را از خریدار دریافت کنید.',
    'وارد شوید و به صفحه تایید ارسال بروید.',
    'تمام اسناد لازم ارسال را بارگذاری کنید:',
    'تایید شرایط قرارداد بارگذاری شده توسط خریدار.',
    'تمام اسناد را برای بررسی خریدار ارسال کنید.',
    'منتظر تایید معامله توسط خریدار و انتقال وجه باشید.'
  ],
  documents: [
    'صورتحساب تجاری',
    'لیست بسته‌بندی',
    'بارنامه',
    'گواهی بیمه',
    'گواهی مبدا',
    'گواهی بازرسی',
    'تصاویر ارسال'
  ]
},

es: {
  buyers: [
    'Regístrese para obtener una cuenta como Comprador.',
    'Complete el proceso de pago para desbloquear las funciones de la cuenta.',
    'Inicie una transacción creando un depósito en garantía y subiendo su contrato.',
    'Proporcione el ID de la transacción (TXID) al Vendedor.',
    'Supervise el estado de la transacción y los documentos en su panel.',
    'Una vez que el Vendedor haya subido todos los documentos de envío, revíselos cuidadosamente.',
    'Acepte o rechace la transacción en función de la documentación proporcionada.',
    'Al aprobar, los fondos se liberarán automáticamente al Vendedor.'
  ],
  sellers: [
    'Regístrese para obtener una cuenta como Vendedor.',
    'Reciba el ID de la transacción (TXID) de su Comprador.',
    'Inicie sesión y vaya a la página de Confirmación de Envío.',
    'Suba todos los documentos de envío requeridos:',
    'Confirme la aceptación de los términos del contrato subido por el Comprador.',
    'Envíe todos los documentos para la revisión del Comprador.',
    'Espere a que el Comprador apruebe la transacción y libere el pago.'
  ],
  documents: [
    'Factura Comercial',
    'Lista de Empaque',
    'Conocimiento de Embarque',
    'Certificado de Seguro',
    'Certificado de Origen',
    'Certificado de Inspección',
    'Imágenes del Envío'
  ]
},
fr: {
      buyers: [
        'Créez un compte en tant qu’Acheteur.',
        'Terminez le processus de paiement pour débloquer les fonctionnalités du compte.',
        'Initiez une transaction en créant un dépôt fiduciaire et en téléchargeant votre contrat.',
        'Fournissez l’identifiant de transaction (TXID) au Vendeur.',
        'Surveillez l’état de la transaction et les documents via votre tableau de bord.',
        'Une fois tous les documents téléchargés par le Vendeur, examinez-les attentivement.',
        'Approuvez ou refusez la transaction en fonction des documents fournis.',
        'Après approbation, les fonds seront automatiquement transférés au Vendeur.'
      ],
      sellers: [
        'Créez un compte en tant que Vendeur.',
        'Recevez l’identifiant de transaction (TXID) de l’Acheteur.',
        'Connectez-vous et accédez à la page de Confirmation d’Expédition.',
        'Téléchargez tous les documents d’expédition requis :',
        'Confirmez l’acceptation des conditions du contrat téléchargé par l’Acheteur.',
        'Envoyez tous les documents pour examen par l’Acheteur.',
        'Attendez que l’Acheteur approuve la transaction et libère le paiement.'
      ],
      documents: [
        'Facture commerciale',
        'Liste de colisage',
        'Connaissement',
        'Certificat d’assurance',
        'Certificat d’origine',
        'Certificat d’inspection',
        'Images de l’expédition'
      ]
    },
    ar: {
      buyers: [
        'قم بإنشاء حساب كمشتري.',
        'أكمل عملية الدفع لفتح ميزات الحساب.',
        'ابدأ معاملة عن طريق إنشاء حساب ضمان وتحميل العقد الخاص بك.',
        'قدم رقم تعريف المعاملة (TXID) للبائع.',
        'راقب حالة المعاملة والمستندات عبر لوحة التحكم الخاصة بك.',
        'بعد أن يقوم البائع بتحميل جميع مستندات الشحنة، راجعها بعناية.',
        'وافق على المعاملة أو ارفضها بناءً على المستندات المقدمة.',
        'عند الموافقة، سيتم تحويل الأموال تلقائيًا إلى البائع.'
      ],
      sellers: [
        'قم بإنشاء حساب كبائع.',
        'استلم رقم تعريف المعاملة (TXID) من المشتري.',
        'سجل الدخول وانتقل إلى صفحة تأكيد الشحنة.',
        'قم بتحميل جميع مستندات الشحن المطلوبة:',
        'أكد قبول شروط العقد الذي تم تحميله من قبل المشتري.',
        'أرسل جميع المستندات لمراجعة المشتري.',
        'انتظر موافقة المشتري على المعاملة وإطلاق الدفعة.'
      ],
      documents: [
        'فاتورة تجارية',
        'قائمة التعبئة',
        'بوليصة الشحن',
        'شهادة التأمين',
        'شهادة المنشأ',
        'شهادة الفحص',
        'صور الشحنة'
      ]
    },
    zh: {
      buyers: [
        '注册一个买家账户。',
        '完成付款流程以解锁账户功能。',
        '通过创建托管账户并上传合同来发起交易。',
        '将交易ID（TXID）提供给卖家。',
        '通过仪表板监控交易状态和已上传的文件。',
        '卖家上传所有发货文件后，请仔细核查。',
        '根据提供的文件批准或拒绝交易。',
        '批准后，资金将自动转入卖家账户。'
      ],
      sellers: [
        '注册一个卖家账户。',
        '从买家处接收交易ID（TXID）。',
        '登录并进入发货确认页面。',
        '上传所有所需的发货文件：',
        '确认接受买家上传的合同条款。',
        '提交所有文件以供买家审核。',
        '等待买家批准交易并释放付款。'
      ],
      documents: [
        '商业发票',
        '装箱单',
        '提单',
        '保险证明',
        '原产地证书',
        '检验证书',
        '发货图片'
      ]
    },

pt: {
  buyers: [
    'Registre-se para uma conta como Comprador.',
    'Conclua o processo de pagamento para desbloquear os recursos da conta.',
    'Inicie uma transação criando uma conta escrow e carregando seu contrato.',
    'Forneça o ID da transação (TXID) ao Vendedor.',
    'Monitore o status da transação e os documentos através do seu painel.',
    'Após o Vendedor carregar todos os documentos de envio, revise-os com atenção.',
    'Aprove ou rejeite a transação com base na documentação fornecida.',
    'Após a aprovação, os fundos serão liberados automaticamente ao Vendedor.'
  ],
  sellers: [
    'Registre-se para uma conta como Vendedor.',
    'Receba o ID da transação (TXID) do Comprador.',
    'Faça login e vá para a página de Confirmação de Envio.',
    'Carregue todos os documentos de envio obrigatórios:',
    'Confirme a aceitação dos termos do contrato carregado pelo Comprador.',
    'Envie todos os documentos para revisão do Comprador.',
    'Aguarde o Comprador aprovar a transação e liberar o pagamento.'
  ],
  documents: [
    'Fatura Comercial',
    'Lista de Embalagem',
    'Conhecimento de Embarque',
    'Certificado de Seguro',
    'Certificado de Origem',
    'Certificado de Inspeção',
    'Imagens do Envio'
  ]
},



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
  <option value="es">Español</option>
  <option value="pt">Português</option>
  <option value="fr">Français</option>
  <option value="ar">العربية</option>
  <option value="zh">中文 (简体)</option>

        </select>
      </div>
      <section style={{ marginBottom: '40px' }}>
        <h2>Buyers</h2>
        <ol>
          {instructions[language]?.buyers?.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </section>
      <section style={{ marginBottom: '40px' }}>
        <h2>Sellers</h2>
        <ol>
          {instructions[language]?.sellers?.map((item, index) => (
            <li key={index}>
              {item}
              {index === 3 && (
                <ul>
                  {instructions[language]?.documents?.map((doc, i) => (
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





