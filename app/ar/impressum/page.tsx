import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { Ltr } from "@/components/Ltr";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "البيانات القانونية",
  description: "البيانات القانونية الخاصة بوكالة نتويتشر الرقمية، برلين.",
  robots: { index: false },
};

// TODO: Platzhalter in eckigen Klammern mit echten Unternehmensdaten ersetzen
// (identischer Platzhalter-Status wie in der deutschen Version, siehe
// app/(de)/impressum/page.tsx — hier wurden bewusst keine Daten erfunden):
// 1) Vor- und Nachname der Inhaberin/des Inhabers bzw. Rechtsform (erster Absatz)
// 2) USt-IdNr. gemäß § 27a UStG, oder Absatz "الرقم الضريبي" entfernen
// 3) Vor- und Nachname der/des Verantwortlichen nach § 18 Abs. 2 MStV
export default function ImpressumPageAr() {
  return (
    <LegalPage title="البيانات القانونية">
      <h2>
        البيانات وفقًا للمادة <Ltr>§ 5</Ltr> من <Ltr>DDG</Ltr>
      </h2>
      <p>
        <Ltr>{site.legalName}</Ltr>
        <br />
        [الاسم الأول واسم العائلة لمالك/مالكة المنشأة، أو الشكل القانوني للشركة]
        <br />
        <Ltr>{site.street}</Ltr>
        <br />
        <Ltr>
          {site.zip} {site.city}
        </Ltr>
        <br />
        ألمانيا
      </p>

      <h2>التواصل</h2>
      <p>
        الهاتف: <Ltr>{site.phone}</Ltr>
        <br />
        البريد الإلكتروني:{" "}
        <a href={`mailto:${site.email}`}>
          <Ltr>{site.email}</Ltr>
        </a>
      </p>

      <h2>الرقم الضريبي</h2>
      <p>
        رقم التعريف الضريبي لضريبة القيمة المضافة وفقًا للمادة{" "}
        <Ltr>§ 27a</Ltr> من <Ltr>UStG</Ltr>:
        <br />
        [أدخل رقم التعريف الضريبي، أو احذف هذه الفقرة]
      </p>

      <h2>
        المسؤول عن المحتوى وفقًا للمادة <Ltr>§ 18 Abs. 2</Ltr> من{" "}
        <Ltr>MStV</Ltr>
      </h2>
      <p>
        [الاسم الأول واسم العائلة]
        <br />
        <Ltr>{site.street}</Ltr>، <Ltr>{site.zip} {site.city}</Ltr>
      </p>

      <h2>تسوية المنازعات الأوروبية عبر الإنترنت</h2>
      <p>
        توفّر المفوضية الأوروبية منصة لتسوية المنازعات عبر الإنترنت (OS):{" "}
        <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer">
          <Ltr>https://ec.europa.eu/consumers/odr/</Ltr>
        </a>
        . تجد عنوان بريدنا الإلكتروني أعلاه في البيانات القانونية.
      </p>

      <h2>تسوية منازعات المستهلكين / الهيئة العامة لتسوية المنازعات</h2>
      <p>
        نحن غير مستعدين وغير ملزَمين بالمشاركة في إجراءات تسوية المنازعات أمام
        هيئة تسوية منازعات المستهلكين.
      </p>

      <h2>المسؤولية عن المحتوى</h2>
      <p>
        بصفتنا مزوّد خدمة، نتحمل المسؤولية عن المحتوى الخاص بنا على هذه
        الصفحات وفقًا للقوانين العامة. إلا أننا غير ملزَمين بمراقبة المعلومات
        المنقولة أو المخزَّنة التي تعود لأطراف أخرى، أو بالبحث عن ظروف تشير
        إلى نشاط غير قانوني. تظل الالتزامات المتعلقة بإزالة أو حظر استخدام
        المعلومات وفقًا للقوانين العامة غير متأثرة بذلك.
      </p>

      <h2>المسؤولية عن الروابط</h2>
      <p>
        يحتوي موقعنا على روابط لمواقع خارجية تابعة لأطراف ثالثة، ليس لنا أي
        تأثير على محتواها. المسؤول عن محتوى الصفحات المرتبطة هو دائماً مزوّد
        الخدمة أو مشغّل تلك الصفحة. لم يكن أي محتوى غير قانوني واضحاً وقت
        الربط بالصفحة.
      </p>

      <h2>حقوق النشر</h2>
      <p>
        تخضع المحتويات والأعمال التي أنشأها مشغّلو هذا الموقع على هذه الصفحات
        لقانون حقوق النشر الألماني. يتطلب النسخ أو التعديل أو التوزيع وأي شكل
        من أشكال الاستغلال خارج حدود قانون حقوق النشر موافقة كتابية من المؤلف
        أو المُنشئ المعني.
      </p>
    </LegalPage>
  );
}
