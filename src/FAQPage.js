// FAQPage.js - Multilingual FAQ Component for XLMGuard

import React, { useState } from 'react';

const faqContent = {
  tr: [
    {
      question: "XLMGuard nedir?",
      answer:
        `XLMGuard, Stellar (XLM) ve XRP için oluşturulmuş blok zinciri tabanlı bir emanet ve ödeme doğrulama hizmetidir. Özellikle eşler arası ödemelerde ve satışlarda, zincir dışı güven gerektiren durumlarda ekstra güvenlik sağlar.`
    },
    {
      question: "🔑 XLMGuard Nasıl Çalışır",
      answer:
        `• İşlem başlatma: Gönderen, XLMGuard üzerinden bir ödeme talebi oluşturur.
• Fonları tutma: Fonlar, her iki taraf önceden belirlenmiş koşulları yerine getirene kadar emanet hesabında tutulur.
• Doğrulama: XLMGuard, işlemi izler ve gerekirse zincir dışı onay mekanizmaları entegre eder.
• Serbest bırakma veya iade: Koşullar yerine getirildiğinde fonlar otomatik olarak serbest bırakılır ya da bir sorun varsa iade edilir.`
    },
    {
      question: "🌟 Onu Benzersiz Kılan Nedir?",
      answer:
        `• Zincirler arası destek: Hem XLM hem XRP ile çalışır; çoğu emanet hizmeti yalnızca bir ağa odaklanır.
• Zincir dışı doğrulama: XLMGuard sadece çok imzalı değil—serbest bırakma öncesinde harici onayları da içerebilir.
• İşlem bütünlüğü: Önceden belirlenmiş koşulları uygularak dolandırıcılığı ve hataları önler.
• Gerçek dünya kullanımına uygun: Pazar satışları, serbest çalışan işleri veya genel emanet işlemleri için özel olarak tasarlanmıştır.`
    },
    {
      question: "✅ Sonuç: XLM İşlemlerinde Benzersiz Bir Konum?",
      answer:
        `Evet—XLMGuard şunları yapabildiği için öne çıkar:
Vekil olmadan emanet ve ödeme doğrulama hizmeti sunar,
Hem Stellar hem Ripple ağlarında çalışır,
Zincir dışı mantıkla zenginleştirilmiş blok zinciri özellikleri kullanır,
Koşula bağlı otomatik serbest bırakmalarla karşı taraf riskinden korur.

Bu sadece özel anahtarları korumakla ilgili değil—XLM işlemlerinde adalet ve bütünlüğü sağlamakla ilgilidir. İşte bu onun eşsiz nişidir.`
    }
  ],
  vi: [
    {
      question: "XLMGuard là gì?",
      answer:
        `XLMGuard là một dịch vụ ký quỹ và xác minh thanh toán dựa trên blockchain được xây dựng cho cả Stellar (XLM) và XRP. Nó được thiết kế để tăng thêm mức độ tin cậy và bảo mật cho các giao dịch—đặc biệt là trong các thanh toán ngang hàng, mua bán hoặc nơi cần xác minh ngoài chuỗi.`
    },
    {
      question: "🔑 Cách XLMGuard hoạt động",
      answer:
        `• Khởi tạo giao dịch: Người gửi tạo yêu cầu thanh toán qua XLMGuard.
• Giữ tiền: XLM hoặc XRP được giữ trong tài khoản ký quỹ cho đến khi cả hai bên đáp ứng điều kiện đã định.
• Xác minh: XLMGuard theo dõi giao dịch—có thể tích hợp các cơ chế xác minh ngoài chuỗi.
• Giải phóng hoặc hoàn tiền: Khi đáp ứng điều kiện, tiền sẽ được tự động giải phóng hoặc hoàn trả nếu có sự cố.`
    },
    {
      question: "🌟 Điều gì khiến nó độc đáo?",
      answer:
        `• Hỗ trợ đa chuỗi: Hoạt động với cả XLM và XRP—đa số dịch vụ ký quỹ chỉ hỗ trợ một mạng.
• Xác minh ngoài chuỗi: Không chỉ là multisig—nó có thể bao gồm xác nhận hoặc phê duyệt bên ngoài.
• Tính toàn vẹn giao dịch: Ngăn chặn gian lận và lỗi bằng cách thực thi các điều khoản định sẵn trong ký quỹ.
• Thiết kế cho trường hợp thực tế: Phù hợp cho bán hàng trực tuyến, làm việc tự do hoặc giao dịch kiểu ký quỹ.`
    },
    {
      question: "✅ Kết luận: Vị thế độc đáo trong các giao dịch XLM?",
      answer:
        `Đúng vậy—XLMGuard nổi bật vì:
Hoạt động như một dịch vụ ký quỹ và xác minh thanh toán không giám hộ,
Hoạt động trên cả hai mạng Stellar và Ripple,
Sử dụng tính năng blockchain kết hợp với logic ngoài chuỗi,
Bảo vệ người dùng khỏi rủi ro bằng cách tự động giải phóng có điều kiện.

Không chỉ bảo vệ khóa riêng—mà còn đảm bảo tính công bằng và toàn vẹn cho các giao dịch XLM.`
    }
  ],
  en: [
    {
      question: "What is XLMGuard?",
      answer:
        `XLMGuard is a blockchain-based escrow and payment-verification service built for both Stellar (XLM) and XRP. It’s designed to add an extra layer of trust and security to transactions—especially in peer-to-peer payments, sales, or where trust needs to be off‑chain verified.`
    },
    {
      question: "🔑 How XLMGuard Works",
      answer:
        `• Initiating a transaction: The sender creates a payment request via XLMGuard.
• Holding funds: The lumens (or XRP) are placed in escrow until both parties fulfill predefined conditions.
• Verification: XLMGuard monitors the transaction—possibly integrating off-chain confirmation mechanisms.
• Release or refund: Once conditions are met, funds are automatically released, or refunded if something goes wrong.`
    },
    {
      question: "🌟 What Makes It Unique?",
      answer:
        `• Cross‑chain support: It works with both XLM and XRP, which is less common—most escrow services target only one network.
• Off‑chain verification: XLMGuard isn't just multisig—it can include external confirmations or approvals before releasing funds.
• Transaction integrity: It prevents fraud and mistakes by enforcing pre-set terms in escrow, rather than trust-based or manual release.
• Designed for real-world use cases: It’s tailor-made for things like marketplace sales, freelance work, or escrow-type transactions, not simply holding keys safely.`
    },
    {
      question: "✅ Conclusion: A Unique Position in XLM Transactions?",
      answer:
        `Yes—XLMGuard stands out because it:
Acts as a non-custodial escrow and payment verifier,
Works across both Stellar and Ripple networks,
Utilizes blockchain features enriched with off-chain logic,
Shields users from counterpart risk by automating condition-based releases.

It's not just about securing private keys—it's about ensuring transaction fairness and integrity for XLM transactions. That's its unique niche.`
    }
  ],
  ru: [
    {
      question: "Что такое XLMGuard?",
      answer:
        `XLMGuard — это основанная на блокчейне служба условного депонирования и проверки платежей, разработанная как для Stellar (XLM), так и для XRP. Она обеспечивает дополнительный уровень доверия и безопасности, особенно в одноранговых платежах и продажах, где доверие должно быть подтверждено вне цепочки.`
    },
    {
      question: "🔑 Как работает XLMGuard",
      answer:
        `• Инициация транзакции: Отправитель создает запрос на платеж через XLMGuard.
• Удержание средств: XLM или XRP размещаются в эскроу до выполнения условий обеими сторонами.
• Проверка: XLMGuard отслеживает транзакцию, возможно с применением внешних подтверждений.
• Освобождение или возврат: Средства автоматически высвобождаются или возвращаются при нарушении условий.`
    },
    {
      question: "🌟 Чем он уникален?",
      answer:
        `• Поддержка нескольких сетей: Работает как с XLM, так и с XRP, что редко встречается.
• Верификация вне блокчейна: Включает внешние подтверждения.
• Целостность транзакций: Предотвращает ошибки и мошенничество, применяя заранее установленные условия.
• Предназначен для реального использования: Отлично подходит для торговых площадок, фриланс-услуг и других ситуаций с необходимостью депонирования.`
    },
    {
      question: "✅ Заключение: Уникальная роль в XLM-транзакциях?",
      answer:
        `Да — XLMGuard выделяется тем, что:
Выступает как некастодиальный посредник,
Работает с сетями Stellar и Ripple,
Использует функции блокчейна с логикой вне цепочки,
Защищает пользователей от рисков за счет автоматизации условий.

Речь не только о безопасности ключей, а о справедливости и прозрачности каждой сделки.`
    }
  ],
  pl: [
    {
      question: "Czym jest XLMGuard?",
      answer:
        `XLMGuard to oparta na blockchainie usługa escrow i weryfikacji płatności dla Stellar (XLM) i XRP. Zapewnia dodatkowy poziom zaufania i bezpieczeństwa, zwłaszcza przy transakcjach peer-to-peer.`
    },
    {
      question: "🔑 Jak działa XLMGuard",
      answer:
        `• Rozpoczęcie transakcji: Nadawca tworzy żądanie płatności przez XLMGuard.
• Przechowywanie środków: Lumens (lub XRP) są przechowywane w escrow, aż obie strony spełnią ustalone warunki.
• Weryfikacja: XLMGuard monitoruje transakcję—z możliwością weryfikacji poza łańcuchem.
• Zwolnienie lub zwrot: Po spełnieniu warunków środki są automatycznie zwalniane lub zwracane.`
    },
    {
      question: "🌟 Co czyni go wyjątkowym?",
      answer:
        `• Obsługa wielu łańcuchów: Współpracuje zarówno z XLM, jak i XRP.
• Weryfikacja poza łańcuchem: Może zawierać zewnętrzne zatwierdzenia.
• Integralność transakcji: Zapobiega oszustwom i błędom przez egzekwowanie warunków.
• Zaprojektowany do rzeczywistego użycia: Idealny dla sprzedaży, freelancingu lub transakcji escrow.`
    },
    {
      question: "✅ Wniosek: Unikalna pozycja w transakcjach XLM?",
      answer:
        `Tak—XLMGuard wyróżnia się, ponieważ:
Działa jako niepowierniczy pośrednik escrow,
Obsługuje sieci Stellar i Ripple,
Wykorzystuje logikę poza łańcuchem,
Chroni użytkowników przed ryzykiem kontrahenta poprzez automatyczne zwalnianie.

To nie tylko ochrona kluczy prywatnych—chodzi o sprawiedliwość i integralność transakcji XLM.`
    }
  ],
  nl: [
    {
      question: "Wat is XLMGuard?",
      answer:
        `XLMGuard is een op blockchain gebaseerde escrow- en betalingsverificatieservice voor zowel Stellar (XLM) als XRP. Het is ontworpen om extra vertrouwen en veiligheid toe te voegen aan transacties—vooral bij peer-to-peer betalingen en verkoop waarbij externe verificatie nodig is.`
    },
    {
      question: "🔑 Hoe werkt XLMGuard",
      answer:
        `• Transactie starten: De verzender maakt een betalingsverzoek via XLMGuard.
• Fondsen vasthouden: De lumens (of XRP) worden in escrow geplaatst totdat beide partijen aan vooraf bepaalde voorwaarden voldoen.
• Verificatie: XLMGuard controleert de transactie—mogelijk met off-chain bevestigingen.
• Vrijgave of terugbetaling: Zodra aan de voorwaarden is voldaan, worden de fondsen automatisch vrijgegeven of terugbetaald bij problemen.`
    },
    {
      question: "🌟 Wat maakt het uniek?",
      answer:
        `• Ondersteuning voor meerdere ketens: Werkt met zowel XLM als XRP, wat zeldzaam is.
• Off-chain verificatie: Niet alleen multisig—maar ook externe goedkeuringen mogelijk.
• Transactie-integriteit: Voorkomt fraude en fouten door vooraf ingestelde voorwaarden af te dwingen.
• Ontworpen voor praktijkgebruik: Ideaal voor marktplaatsen, freelancers en escrow-transacties.`
    },
    {
      question: "✅ Conclusie: Een unieke positie in XLM-transacties?",
      answer:
        `Ja—XLMGuard valt op omdat het:
Fungeert als een niet-custodiale escrow- en verificatieservice,
Werkt op zowel Stellar als Ripple netwerken,
Blockchainfuncties combineert met off-chain logica,
Gebruikers beschermt tegen tegenpartijrisico door automatische vrijgave.

Het draait niet alleen om sleutelbeveiliging—maar om eerlijke en veilige XLM-transacties.`
    }
  ],
  th: [
    {
      question: "XLMGuard คืออะไร?",
      answer:
        `XLMGuard เป็นบริการฝากเงินและตรวจสอบการชำระเงินที่ใช้บล็อกเชน รองรับทั้ง Stellar (XLM) และ XRP ช่วยเพิ่มความปลอดภัยและความน่าเชื่อถือในการทำธุรกรรม โดยเฉพาะธุรกรรมระหว่างบุคคลและการขายออนไลน์ที่ต้องการการตรวจสอบนอกเครือข่าย`
    },
    {
      question: "🔑 XLMGuard ทำงานอย่างไร",
      answer:
        `• เริ่มต้นธุรกรรม: ผู้ส่งสร้างคำขอการชำระเงินผ่าน XLMGuard
• ถือครองเงิน: XLM หรือ XRP ถูกฝากไว้ในบัญชีฝากจนกว่าทั้งสองฝ่ายจะปฏิบัติตามเงื่อนไข
• การตรวจสอบ: XLMGuard ติดตามธุรกรรมและอาจรวมถึงการยืนยันนอกเครือข่าย
• ปล่อยหรือคืนเงิน: เมื่อครบเงื่อนไข เงินจะถูกปล่อยอัตโนมัติหรือคืนหากมีปัญหา`
    },
    {
      question: "🌟 อะไรทำให้มันพิเศษ?",
      answer:
        `• รองรับหลายเครือข่าย: ใช้ได้ทั้ง XLM และ XRP
• การตรวจสอบนอกเครือข่าย: ไม่ใช่แค่ multisig แต่รวมถึงการอนุมัติจากภายนอก
• ความซื่อตรงของธุรกรรม: ป้องกันการฉ้อโกงด้วยเงื่อนไขล่วงหน้า
• ออกแบบเพื่อการใช้งานจริง เช่น การขายออนไลน์ งานฟรีแลนซ์ หรือฝากเงิน`
    },
    {
      question: "✅ สรุป: จุดเด่นในโลกของ XLM?",
      answer:
        `ใช่—XLMGuard โดดเด่นเพราะว่า:
เป็นบริการฝากเงินแบบไม่เก็บคีย์
รองรับทั้งเครือข่าย Stellar และ Ripple
ใช้คุณสมบัติบล็อกเชนที่มีตรรกะนอกเครือข่าย
ปกป้องผู้ใช้จากความเสี่ยงด้วยการปล่อยเงินแบบมีเงื่อนไข

ไม่ใช่แค่ปกป้องคีย์—แต่เพื่อความยุติธรรมและความโปร่งใสในธุรกรรม XLM`
    }
  ],
  id: [
    {
      question: "Apa itu XLMGuard?",
      answer:
        `XLMGuard adalah layanan escrow dan verifikasi pembayaran berbasis blockchain untuk Stellar (XLM) dan XRP. Layanan ini dirancang untuk menambah tingkat kepercayaan dan keamanan dalam transaksi—terutama dalam pembayaran peer-to-peer atau jual beli dengan kebutuhan verifikasi off-chain.`
    },
    {
      question: "🔑 Bagaimana XLMGuard Bekerja",
      answer:
        `• Memulai transaksi: Pengirim membuat permintaan pembayaran melalui XLMGuard.
• Menahan dana: Lumens (atau XRP) ditempatkan di escrow hingga kedua belah pihak memenuhi syarat yang telah ditentukan.
• Verifikasi: XLMGuard memantau transaksi—bisa termasuk konfirmasi dari luar blockchain.
• Pelepasan atau pengembalian: Setelah syarat terpenuhi, dana dilepaskan secara otomatis atau dikembalikan jika ada masalah.`
    },
    {
      question: "🌟 Apa yang Membuatnya Unik?",
      answer:
        `• Dukungan lintas rantai: Mendukung XLM dan XRP, yang jarang ditemukan.
• Verifikasi off-chain: Tidak hanya multisig—tetapi juga bisa mencakup persetujuan eksternal.
• Integritas transaksi: Mencegah penipuan dan kesalahan dengan menegakkan syarat di escrow.
• Dirancang untuk penggunaan nyata: Cocok untuk marketplace, pekerjaan lepas, atau transaksi escrow lainnya.`
    },
    {
      question: "✅ Kesimpulan: Posisi Unik dalam Transaksi XLM?",
      answer:
        `Ya—XLMGuard menonjol karena:
Bertindak sebagai escrow dan verifikator pembayaran non-kustodial,
Bekerja di jaringan Stellar dan Ripple,
Menggabungkan fitur blockchain dengan logika off-chain,
Melindungi pengguna dari risiko pihak lawan melalui pelepasan otomatis berdasarkan syarat.

Ini bukan sekadar tentang menyimpan kunci—tetapi memastikan keadilan dan integritas dalam transaksi XLM.`
    }
  ],
  ms: [
    {
      question: "Apa itu XLMGuard?",
      answer:
        `XLMGuard ialah perkhidmatan escrow dan pengesahan pembayaran berasaskan blockchain untuk Stellar (XLM) dan XRP. Ia direka untuk menambahkan lapisan kepercayaan dan keselamatan dalam transaksi—terutamanya dalam pembayaran peer-to-peer dan jual beli yang memerlukan pengesahan luar rantaian.`
    },
    {
      question: "🔑 Bagaimana XLMGuard Berfungsi",
      answer:
        `• Memulakan transaksi: Penghantar membuat permintaan pembayaran melalui XLMGuard.
• Menyimpan dana: Lumens (atau XRP) dimasukkan ke dalam escrow sehingga kedua-dua pihak memenuhi syarat yang telah ditentukan.
• Pengesahan: XLMGuard memantau transaksi—mungkin dengan integrasi mekanisme pengesahan luar.
• Pelepasan atau bayaran balik: Setelah syarat dipenuhi, dana dilepaskan secara automatik, atau dikembalikan jika berlaku masalah.`
    },
    {
      question: "🌟 Apa yang Menjadikannya Unik?",
      answer:
        `• Sokongan rentas rantai: Berfungsi dengan XLM dan XRP, yang jarang berlaku.
• Pengesahan luar rantaian: Bukan sekadar multisig—ia boleh melibatkan pengesahan atau kelulusan luaran.
• Integriti transaksi: Menghalang penipuan dan kesilapan dengan penguatkuasaan syarat dalam escrow.
• Direka untuk kes penggunaan sebenar: Sesuai untuk jual beli, kerja bebas, atau transaksi jenis escrow.`
    },
    {
      question: "✅ Kesimpulan: Kedudukan Unik dalam Transaksi XLM?",
      answer:
        `Ya—XLMGuard menonjol kerana ia:
Bertindak sebagai escrow dan pengesah pembayaran tanpa penjaga,
Berfungsi merentasi rangkaian Stellar dan Ripple,
Menggunakan ciri blockchain dengan logik luar rantaian,
Melindungi pengguna daripada risiko pihak lawan melalui pelepasan berdasarkan syarat.

Ia bukan hanya mengenai keselamatan kunci—tetapi tentang memastikan keadilan dan integriti dalam transaksi XLM.`
    }
  ],
  sw: [
    {
      question: "XLMGuard ni nini?",
      answer:
        `XLMGuard ni huduma ya uhifadhi na uthibitisho wa malipo inayotumia teknolojia ya blockchain kwa ajili ya mtandao wa Stellar (XLM) na XRP. Imeundwa ili kuongeza usalama na uaminifu katika miamala—hasa kwa malipo ya moja kwa moja kati ya watu na mauzo yanayohitaji uthibitisho wa nje ya mnyororo.`
    },
    {
      question: "🔑 Jinsi XLMGuard Inavyofanya Kazi",
      answer:
        `• Kuanza muamala: Mtumaji huunda ombi la malipo kupitia XLMGuard.
• Kuhifadhi fedha: Lumens (au XRP) huwekwa katika akaunti ya escrow hadi pande zote mbili zitimize masharti yaliyowekwa.
• Uthibitisho: XLMGuard hufuatilia muamala—ikiwezekana kwa kutumia uthibitisho wa nje ya blockchain.
• Kutoa au kurejesha: Pesa hutolewa moja kwa moja au kurudishwa endapo kutakuwa na tatizo.`
    },
    {
      question: "🌟 Nini Kinachokifanya Kiwe cha Kipekee?",
      answer:
        `• Msaada wa mitandao tofauti: Hufanya kazi na XLM na XRP, tofauti na huduma nyingi.
• Uthibitisho wa nje ya blockchain: Zaidi ya multisig—pia inaweza kujumuisha idhini ya nje.
• Uadilifu wa miamala: Huzuia udanganyifu na makosa kwa kutumia masharti yaliyopangwa.
• Imeundwa kwa matumizi halisi: Inafaa kwa mauzo ya soko mtandaoni, kazi huru, au miamala ya escrow.`
    },
    {
      question: "✅ Hitimisho: Nafasi ya Kipekee Katika Miamala ya XLM?",
      answer:
        `Ndiyo—XLMGuard ni wa kipekee kwa sababu:
Hutoa huduma ya escrow na uthibitisho wa malipo bila kuhifadhi,
Inafanya kazi na mitandao ya Stellar na Ripple,
Inatumia blockchain pamoja na mantiki ya nje ya mnyororo,
Hulinda watumiaji dhidi ya hatari kwa kutekeleza masharti otomatiki.

Sio tu kuhusu kulinda funguo—ni kuhusu kuhakikisha haki na uadilifu wa miamala ya XLM.`
    }
  ],
  fa: [
    {
      question: "XLMGuard چیست؟",
      answer:
        `XLMGuard یک سرویس مبتنی بر بلاک‌چین برای سپرده‌گذاری و تأیید پرداخت‌ها است که برای شبکه‌های Stellar (XLM) و XRP طراحی شده است. این سرویس برای افزایش سطح اعتماد و امنیت در تراکنش‌ها—به‌ویژه در پرداخت‌های فرد به فرد یا فروش‌هایی که نیاز به تأیید خارج از زنجیره دارند—ایجاد شده است.`
    },
    {
      question: "🔑 XLMGuard چگونه کار می‌کند",
      answer:
        `• شروع تراکنش: فرستنده درخواست پرداختی را از طریق XLMGuard ایجاد می‌کند.
• نگهداری وجه: XLM یا XRP تا زمان تحقق شرایط از سوی هر دو طرف، در حالت امانت باقی می‌ماند.
• تأیید: XLMGuard تراکنش را نظارت می‌کند—ممکن است مکانیسم‌های تأیید خارج از زنجیره را نیز شامل شود.
• آزادسازی یا بازپرداخت: پس از تحقق شرایط، وجه به صورت خودکار آزاد شده یا در صورت بروز مشکل بازپرداخت می‌شود.`
    },
    {
      question: "🌟 چه چیزی آن را منحصربه‌فرد می‌کند؟",
      answer:
        `• پشتیبانی از چند زنجیره: با هر دو شبکه XLM و XRP کار می‌کند—در حالی که بیشتر سرویس‌های امانت فقط یک شبکه را پوشش می‌دهند.
• تأیید خارج از زنجیره: فقط محدود به multisig نیست—بلکه می‌تواند شامل تأییدیه‌های خارجی قبل از آزادسازی وجوه باشد.
• یکپارچگی تراکنش: با اجرای شرایط از پیش تعیین شده در سیستم امانت، مانع از تقلب و اشتباهات می‌شود.
• طراحی شده برای کاربردهای واقعی: برای فروشگاه‌های آنلاین، پروژه‌های فریلنس، یا تراکنش‌های امانی بسیار مناسب است.`
    },
    {
      question: "✅ نتیجه‌گیری: جایگاهی منحصربه‌فرد در تراکنش‌های XLM؟",
      answer:
        `بله—XLMGuard برجسته است زیرا:
به‌عنوان یک سرویس امانت و تأیید پرداخت غیرامانی عمل می‌کند،
با هر دو شبکه Stellar و Ripple کار می‌کند،
از ویژگی‌های بلاک‌چین همراه با منطق خارج از زنجیره استفاده می‌کند،
با خودکارسازی آزادسازی بر اساس شرایط، کاربران را از ریسک طرف مقابل محافظت می‌کند.

فقط در مورد امنیت کلیدهای خصوصی نیست—بلکه در مورد اطمینان از عدالت و یکپارچگی تراکنش‌های XLM است.`
    }
  ],
  th: [],
  id: [],
  ms: [],
  sw: [],
  fa: [],
  
};

const FAQPage = () => {
  const [language, setLanguage] = useState('en');
  const faqs = faqContent[language] || faqContent['en'];

  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
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

      <div className="faq-section">
        {faqs.map((item, index) => (
          <div key={index} className="faq-item">
            <h3>{item.question}</h3>
            <p style={{ whiteSpace: 'pre-line' }}>{item.answer}</p>
          </div>
        ))}
        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => window.location.href = '/'} style={{ padding: '0.5rem 1rem', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
  ⬅️ Return to Home
</button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;






























