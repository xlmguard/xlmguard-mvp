// FAQPage.js - Multilingual FAQ Component for XLMGuard

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const faqContent = {
  en: [
    { question: "What is XLMGuard?", answer: "XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP.

🔑 How XLMGuard Works
• Initiating a transaction: The sender creates a payment request via XLMGuard.
• Holding funds: The lumens (or XRP) are placed in escrow until both parties fulfill predefined conditions.
• Verification: XLMGuard monitors the transaction—possibly integrating off-chain confirmation mechanisms.
• Release or refund: Once conditions are met, funds are automatically released, or refunded if something goes wrong.

🌟 What Makes It Unique?
• Cross‑chain support: It works with both XLM and XRP, which is less common—most escrow services target only one network.
• Off‑chain verification: XLMGuard isn't just multisig—it can include external confirmations or approvals before releasing funds.
• Transaction integrity: It prevents fraud and mistakes by enforcing pre-set terms in escrow, rather than trust-based or manual release.
• Designed for real-world use cases: It’s tailor-made for things like marketplace sales, freelance work, or escrow-type transactions, not simply holding keys safely.

✅ Conclusion: A Unique Position in XLM Transactions?
• Acts as a non-custodial escrow and payment verifier,
• Works across both Stellar and Ripple networks,
• Utilizes blockchain features enriched with off-chain logic,
• Shields users from counterpart risk by automating condition-based releases.

It's not just about securing private keys—it's about ensuring transaction fairness and integrity for XLM transactions. That's its unique niche." }
  ],
  tr: [
    { question: "XLMGuard nedir?", answer: "XLMGuard, Stellar (XLM) ve XRP için oluşturulmuş blok zinciri tabanlı bir emanet ve ödeme doğrulama hizmetidir. Alıcılar ve satıcılar için sınır ötesi işlemleri yönetmede güvenli ve şeffaf bir yöntem sunar." },
    { question: "XLMGuard nasıl çalışır?", answer: "Alıcı, fonları bir emanet cüzdanına yatırır ve sözleşme yükler. Satıcı, gönderi belgelerini yükler. Alıcı her şeyi onayladığında, fonlar satıcıya serbest bırakılır." },
    { question: "Hangi belgeler gereklidir?", answer: "Satıcı, ticari fatura, paketleme listesi, konşimento, sigorta sertifikası, menşe belgesi, denetim sertifikası ve gönderi görsellerini yüklemelidir." },
    { question: "Kimler XLMGuard kullanmalı?", answer: "XLM veya XRP kullanarak uluslararası ticaret yapan herkes — ithalatçılar, ihracatçılar ve aracılar dahil — XLMGuard’dan fayda sağlayabilir." }
  ],
  vi: [
    { question: "XLMGuard là gì?", answer: "XLMGuard là dịch vụ ký quỹ và xác minh thanh toán dựa trên blockchain dành cho cả Stellar (XLM) và XRP. Nó cung cấp một phương pháp an toàn và minh bạch để người mua và người bán quản lý giao dịch xuyên biên giới." },
    { question: "XLMGuard hoạt động như thế nào?", answer: "Người mua gửi tiền vào ví ký quỹ và tải lên hợp đồng. Người bán tải lên các tài liệu giao hàng. Sau khi người mua xác minh xong, tiền được chuyển cho người bán." },
    { question: "Cần những tài liệu gì?", answer: "Người bán phải tải lên hóa đơn thương mại, danh sách đóng gói, vận đơn, chứng chỉ bảo hiểm, chứng nhận xuất xứ, chứng nhận kiểm định và hình ảnh lô hàng." },
    { question: "Ai nên sử dụng XLMGuard?", answer: "Bất kỳ ai tham gia vào thương mại quốc tế bằng XLM hoặc XRP, bao gồm cả nhà nhập khẩu, xuất khẩu và môi giới." }
  ],
  pl: [
    { question: "Czym jest XLMGuard?", answer: "XLMGuard to oparty na technologii blockchain serwis depozytowy i weryfikacji płatności stworzony dla Stellar (XLM) i XRP. Zapewnia bezpieczną i przejrzystą metodę zarządzania transakcjami międzynarodowymi." },
    { question: "Jak działa XLMGuard?", answer: "Kupujący deponuje środki w portfelu depozytowym i przesyła umowę. Sprzedający przesyła dokumenty wysyłkowe. Po weryfikacji kupującego, środki są zwalniane do sprzedającego." },
    { question: "Jakie dokumenty są wymagane?", answer: "Sprzedający musi przesłać fakturę handlową, listę pakunkową, list przewozowy, certyfikat ubezpieczeniowy, świadectwo pochodzenia, certyfikat inspekcji i zdjęcia przesyłki." },
    { question: "Kto powinien korzystać z XLMGuard?", answer: "Każdy, kto uczestniczy w handlu międzynarodowym przy użyciu XLM lub XRP — importerzy, eksporterzy i brokerzy." }
  ],
  nl: [
    { question: "Wat is XLMGuard?", answer: "XLMGuard is een op blockchain gebaseerde escrow- en betalingsverificatieservice gebouwd voor Stellar (XLM) en XRP. Het biedt een veilige en transparante manier voor kopers en verkopers om grensoverschrijdende transacties te beheren." },
    { question: "Hoe werkt XLMGuard?", answer: "De koper stort geld op een escrow-portemonnee en uploadt een contract. De verkoper uploadt verzenddocumenten. Nadat de koper alles heeft gecontroleerd, worden de fondsen vrijgegeven aan de verkoper." },
    { question: "Welke documenten zijn vereist?", answer: "De verkoper moet een factuur, paklijst, cognossement, verzekeringscertificaat, oorsprongscertificaat, inspectiecertificaat en verzendfoto’s uploaden." },
    { question: "Wie moet XLMGuard gebruiken?", answer: "Iedereen die internationale handel drijft met XLM of XRP, waaronder importeurs, exporteurs en makelaars." }
  ],
  th: [
    { question: "XLMGuard คืออะไร?", answer: "XLMGuard เป็นบริการรับฝากและตรวจสอบการชำระเงินที่ใช้บล็อกเชนสำหรับ Stellar (XLM) และ XRP ให้ความปลอดภัยและโปร่งใสสำหรับการจัดการธุรกรรมระหว่างประเทศของผู้ซื้อและผู้ขาย." },
    { question: "XLMGuard ทำงานอย่างไร?", answer: "ผู้ซื้อฝากเงินเข้ากระเป๋ารับฝากและอัปโหลดสัญญา ผู้ขายอัปโหลดเอกสารการจัดส่ง เมื่อผู้ซื้อยืนยันเรียบร้อยแล้ว เงินจะถูกปล่อยให้กับผู้ขาย." },
    { question: "ต้องใช้เอกสารอะไรบ้าง?", answer: "ผู้ขายต้องอัปโหลดใบแจ้งหนี้ทางการค้า รายการบรรจุสินค้า ใบตราส่ง ใบรับรองการประกันภัย ใบรับรองแหล่งกำเนิด ใบรับรองการตรวจสอบ และรูปภาพของการจัดส่ง." },
    { question: "ใครควรใช้ XLMGuard?", answer: "ผู้ที่เกี่ยวข้องกับการค้าระหว่างประเทศโดยใช้ XLM หรือ XRP รวมถึงผู้นำเข้า ผู้ส่งออก และนายหน้า." }
  ],
    id: [
    { question: "Apa itu XLMGuard?", answer: "XLMGuard adalah layanan escrow dan verifikasi pembayaran berbasis blockchain untuk Stellar (XLM) dan XRP. Ini memberikan metode yang aman dan transparan bagi pembeli dan penjual untuk mengelola transaksi lintas batas." },
    { question: "Bagaimana cara kerja XLMGuard?", answer: "Pembeli menyetor dana ke dompet escrow dan mengunggah kontrak. Penjual mengunggah dokumen pengiriman. Setelah diverifikasi pembeli, dana dilepaskan ke penjual." },
    { question: "Dokumen apa saja yang diperlukan?", answer: "Penjual harus mengunggah faktur komersial, daftar pengepakan, bill of lading, sertifikat asuransi, sertifikat asal, sertifikat inspeksi, dan gambar pengiriman." },
    { question: "Siapa yang harus menggunakan XLMGuard?", answer: "Siapa pun yang melakukan perdagangan internasional menggunakan XLM atau XRP, termasuk importir, eksportir, dan broker." }
  ],
  ms: [
    { question: "Apakah itu XLMGuard?", answer: "XLMGuard ialah perkhidmatan escrow dan pengesahan pembayaran berasaskan blockchain yang dibina untuk Stellar (XLM) dan XRP. Ia menyediakan kaedah yang selamat dan telus untuk pembeli dan penjual menguruskan transaksi rentas sempadan." },
    { question: "Bagaimana XLMGuard berfungsi?", answer: "Pembeli mendepositkan dana ke dalam dompet escrow dan memuat naik kontrak. Penjual memuat naik dokumen penghantaran. Setelah pembeli mengesahkan semuanya, dana akan dibebaskan kepada penjual." },
    { question: "Dokumen apa yang diperlukan?", answer: "Penjual mesti memuat naik invois komersial, senarai pembungkusan, bil muatan, sijil insurans, sijil asal, sijil pemeriksaan dan gambar penghantaran." },
    { question: "Siapa yang patut guna XLMGuard?", answer: "Sesiapa yang terlibat dalam perdagangan antarabangsa menggunakan XLM atau XRP, termasuk pengimport, pengeksport dan broker." }
  ],
  sw: [
    { question: "XLMGuard ni nini?", answer: "XLMGuard ni huduma ya amana na uthibitishaji wa malipo inayotumia blockchain kwa ajili ya Stellar (XLM) na XRP. Inatoa njia salama na wazi kwa wanunuzi na wauzaji kudhibiti miamala ya kimataifa." },
    { question: "XLMGuard inafanyaje kazi?", answer: "Mnunuzi anaweka fedha kwenye pochi ya amana na kupakia mkataba. Muuzaji hupakia nyaraka za usafirishaji. Baada ya mnunuzi kuthibitisha, fedha hutolewa kwa muuzaji." },
    { question: "Ni nyaraka zipi zinahitajika?", answer: "Muuzaji lazima apakie ankara ya kibiashara, orodha ya upakiaji, hati ya mzigo, cheti cha bima, cheti cha asili, cheti cha ukaguzi, na picha za mzigo." },
    { question: "Nani anapaswa kutumia XLMGuard?", answer: "Yeyote anayehusika katika biashara ya kimataifa akitumia XLM au XRP, wakiwemo waagizaji, wauzaji nje, na madalali." }
  ],
  fa: [
    { question: "XLMGuard چیست؟", answer: "XLMGuard یک سرویس امانتداری و تأیید پرداخت مبتنی بر بلاکچین برای Stellar (XLM) و XRP است. این سرویس روش امن و شفافی را برای مدیریت تراکنش‌های فرامرزی بین خریداران و فروشندگان فراهم می‌کند." },
    { question: "XLMGuard چگونه کار می‌کند؟", answer: "خریدار وجه را به کیف پول امانت واریز کرده و قرارداد را بارگذاری می‌کند. فروشنده اسناد حمل را بارگذاری می‌کند. پس از تأیید توسط خریدار، وجه برای فروشنده آزاد می‌شود." },
    { question: "چه مدارکی مورد نیاز است؟", answer: "فروشنده باید فاکتور تجاری، لیست بسته‌بندی، بارنامه، گواهی بیمه، گواهی مبدأ، گواهی بازرسی و تصاویر محموله را بارگذاری کند." },
    { question: "چه کسانی باید از XLMGuard استفاده کنند؟", answer: "هر کسی که در تجارت بین‌المللی با استفاده از XLM یا XRP فعالیت می‌کند، از جمله واردکنندگان، صادرکنندگان و دلالان." }
  ],
  ru: [
    { question: "Что такое XLMGuard?", answer: "XLMGuard — это основанный на блокчейне сервис условного депонирования и проверки платежей для Stellar (XLM) и XRP. Он обеспечивает безопасный и прозрачный способ управления международными транзакциями." },
    { question: "Как работает XLMGuard?", answer: "Покупатель вносит средства в эскроу-кошелёк и загружает контракт. Продавец загружает отгрузочные документы. После проверки покупателем средства переводятся продавцу." },
    { question: "Какие документы требуются?", answer: "Продавец должен загрузить коммерческий инвойс, упаковочный лист, коносамент, страховой сертификат, сертификат происхождения, сертификат инспекции и фотографии груза." },
    { question: "Кто должен использовать XLMGuard?", answer: "Любой, кто участвует в международной торговле с использованием XLM или XRP: импортеры, экспортеры и брокеры." }
  ]
};

const FAQPage = () => {
  const [language, setLanguage] = useState('en');
  const navigate = useNavigate();

  return (
    <div className="faq-page" style={{ fontFamily: 'Arial, sans-serif', padding: '2rem' }}>
      <h1 style={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
        {language === 'en' ? 'Frequently Asked Questions (FAQ)' : 'FAQ'}
      </h1>

      <select
        onChange={(e) => setLanguage(e.target.value)}
        value={language}
        style={{ margin: '1rem 0', padding: '0.5rem', fontSize: '1rem' }}
      >
        <option value="en">English</option>
        <option value="ru">Русский (Russian)</option>
        <option value="tr">Türkçe (Turkish)</option>
        <option value="vi">Tiếng Việt (Vietnamese)</option>
        <option value="pl">Polski (Polish)</option>
        <option value="nl">Nederlands (Dutch)</option>
        <option value="th">ไทย (Thai)</option>
        <option value="id">Bahasa Indonesia</option>
        <option value="ms">Bahasa Melayu (Malay)</option>
        <option value="sw">Kiswahili (Swahili)</option>
        <option value="fa">فارسی (Persian)</option>
      </select>

      <div className="faq-list">
        {faqContent[language]?.map((item, index) => (
          <div key={index} className="faq-item" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#333' }}>{item.question}</h2>
            <ul style={{ fontSize: '1rem', color: '#555', paddingLeft: '1.5rem', listStyleType: 'disc' }}>
              {item.answer.split(/
|•/).map((line, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>{line.trim()}</li>
              ))}
            </ul>
          </div>
        )) || <p>No FAQ available in this language yet.</p>}
      </div>
        )) || <p>No FAQ available in this language yet.</p>}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            backgroundColor: '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          Return to Home
        </button>
      </div>
    </div>
  );
};

export default FAQPage;



























