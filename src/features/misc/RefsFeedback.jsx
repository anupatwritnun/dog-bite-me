import React from "react";
import Card from "../../components/Card";

export default function RefsFeedback() {
  return (
    <section className="mt-10">
      <Card icon="🔗" title="อ้างอิง" tone="info">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <img
            src="/ref.png"
            alt="Reference guideline"
            className="w-full sm:w-40 rounded-lg border border-slate-200 shadow-sm"
          />
          <div className="text-xs sm:text-sm text-slate-700">
            <a
              href="https://drive.google.com/file/d/1xmnQJaKxMxxTQbahXY5CPVguRO42IHLe/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50"
            >
              แนวทางการดูแลรักษาผู้สัมผัสโรคพิษสุนัขบ้า สถานเสาวภา (พ.ศ. 2561)
            </a>
          </div>
        </div>
      </Card>

      <div className="h-3" />

      <Card icon="📝" title="ประเมินความพึงพอใจ / ข้อเสนอแนะเพิ่มเติม">
        <div className="text-xs sm:text-sm">
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSeJcLkLyEuAM71K65FNjYvrZCUOoyaQzvQgg8PgK4JC1jQGXw/viewform?usp=header"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            เปิดแบบฟอร์ม
          </a>
        </div>
      </Card>
    </section>
  );
}
