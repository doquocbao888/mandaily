'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SectionHeader from '@/components/common/SectionHeader';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface ProductFaqSectionProps {
  title?: string;
  faqs?: FaqItem[];
  className?: string;
}

const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'The Lawn Mower® Ultra Gen 6 là gì?',
    answer:
      'The Lawn Mower® Ultra Gen 6 là tông đơ cắt tỉa lông vùng kín và toàn thân hiện đại nhất của MANFRESH. Được trang bị công nghệ lưỡi gốm SkinSafe™ thế hệ mới, đầu cạo lưỡi kép thay đổi linh hoạt, động cơ 2 tốc độ (lên đến 7.200 vòng/phút), màn hình LED thông minh, đèn rọi hai dải nhiệt màu và chuẩn kháng nước IPX7, mang lại trải nghiệm chăm sóc mượt mà và an toàn tối đa.',
  },
  {
    id: 'faq-2',
    question: 'Bên trong hộp sản phẩm gồm những gì?',
    answer:
      'Hộp sản phẩm chính hãng gồm có: Thân máy tông đơ The Lawn Mower® Ultra Gen 6, Lưỡi tông đơ SkinSafe™, Đầu cạo sát Foil Blade SkinSafe™, 2 cữ lược điều chỉnh độ dài (2mm, 4mm, 6mm, 8mm), dock sạc không dây từ tính kèm cáp USB-C, chổi vệ sinh cao cấp và sổ hướng dẫn sử dụng tiếng Việt.',
  },
  {
    id: 'faq-3',
    question:
      'Cách tháo lắp và thay thế đầu lưỡi cạo như thế nào?',
    answer:
      'Trước khi thay lưỡi, hãy tắt nguồn máy. Giữ chặt thân tông đơ bằng một tay và dùng ngón tay cái đẩy nhẹ đầu lưỡi về phía trước theo chiều hướng lên để bật lưỡi ra khỏi khớp. Để lắp đầu lưỡi mới (lưỡi tông đơ hoặc đầu cạo màng mỏng Foil Blade), căn chỉnh các mấu gài ở đáy với rãnh trên thân máy rồi nhấn dứt khoát cho đến khi nghe tiếng tách chắc chắn.',
  },
  {
    id: 'faq-4',
    question: 'Cách sạc pin và thời lượng pin sử dụng được bao lâu?',
    answer:
      'The Lawn Mower® Ultra Gen 6 sở hữu viên pin Li-ion dung lượng cao 800mAh cho thời gian hoạt động liên tục lên đến 90 phút sau một lần sạc đầy. Bạn có thể sạc tiện lợi trên dock sạc từ tính đi kèm hoặc cắm sạc trực tiếp qua cổng USB-C. Thời gian sạc đầy khoảng 90 phút, màn hình LED hiển thị chính xác % pin để bạn luôn chủ động.',
  },
  {
    id: 'faq-5',
    question: 'Màn hình LED thông minh hiển thị những thông tin gì?',
    answer:
      'Màn hình kỹ thuật số LED độ tương phản cao hiển thị phần trăm pin thực tế (0–100%), chế độ tốc độ động cơ (Tiêu chuẩn / Siêu tốc Turbo), biểu tượng khóa an toàn du lịch (khóa / mở), biểu tượng nhắc nhở vệ sinh bảo dưỡng và hiệu ứng trạng thái đang sạc.',
  },
  {
    id: 'faq-6',
    question: 'Làm thế nào để kích hoạt khóa du lịch chống vô tình bật máy?',
    answer:
      'Thiết bị tích hợp tính năng Khóa du lịch thông minh. Để khóa máy, nhấn và giữ nút nguồn trong 3 giây. Biểu tượng ổ khóa sẽ nhấp nháy rồi sáng cố định trên màn hình LED, ngăn máy tự khởi động trong vali hay balo. Để mở khóa, bạn chỉ cần nhấn giữ nút nguồn lại trong 3 giây.',
  },
  {
    id: 'faq-7',
    question: 'Đèn rọi hai dải nhiệt màu hoạt động như thế nào?',
    answer:
      'Đèn rọi LED 4000K tích hợp giúp chiếu sáng rõ các vùng khuất khó nhìn để thao tác chuẩn xác. Ultra Gen 6 trang bị hai tông ánh sáng (Ánh sáng ấm và Ánh sáng trắng ban ngày). Bạn có thể bấm đúp vào nút điều khiển đèn để chuyển đổi tông sáng phù hợp nhất với màu da và sợi lông.',
  },
  {
    id: 'faq-8',
    question: 'Tại sao sản phẩm này lại an toàn và êm ái hơn cho vùng da nhạy cảm?',
    answer:
      'Ultra Gen 6 sử dụng công nghệ lưỡi gốm SkinSafe™ độc quyền với các răng vi mô bo tròn thụt lùi 0,5mm so with mép cắt, ngăn ngừa tình trạng kéo rứt, kẹp da hoặc trầy xước. Kết hợp cùng động cơ giảm chấn rung êm ái và tay cầm công thái học chống trơn trượt, giúp bạn tự tin tuyệt đối khi cạo tỉa vùng nhạy cảm.',
  },
  {
    id: 'faq-9',
    question: 'The Lawn Mower® Ultra Gen 6 có thể cạo sát đến mức nào?',
    answer:
      'Với lưỡi gốm tiêu chuẩn, máy cạo tỉa siêu êm ở cự ly chỉ 0,2mm, không gây kích ứng da hay lông mọc ngược. Nếu muốn cạo sát phẳng mịn như da em bé, bạn lắp thêm đầu màng cạo Foil Blade đi kèm để triệt sạch tận gốc mà không làm đỏ rát.',
  },
  {
    id: 'faq-10',
    question: 'Bao lâu thì nên thay lưỡi dao cạo một lần?',
    answer:
      'Chúng tôi khuyến nghị nên thay lưỡi cạo SkinSafe™ định kỳ mỗi 3 tháng một lần để đảm bảo vệ sinh, độ sắc bén và hiệu suất êm ái tối ưu. Lưỡi cạo thay thế chính hãng luôn có sẵn trên website MANFRESH.',
  },
  {
    id: 'faq-11',
    question: 'Cách vệ sinh máy sau khi sử dụng như thế nào?',
    answer:
      'Vệ sinh cực kỳ đơn giản nhờ chuẩn chống nước 100%. Sau khi dùng, tháo đầu lưỡi và dùng chổi quét sạch lông thừa trong khoang máy. Bạn có thể xả trực tiếp toàn bộ thân máy và đầu lưỡi dưới vòi nước ấm, sau đó để ráo nơi thoáng mát trước khi cất giữ.',
  },
  {
    id: 'faq-12',
    question: 'Máy có kháng nước hoàn toàn để dùng trong phòng tắm không?',
    answer:
      'Hoàn toàn có! The Lawn Mower® Ultra Gen 6 đạt chuẩn kháng nước IPX7, chịu được độ sâu nước 1 mét trong tối đa 30 phút. Bạn có thể thoải mái sử dụng cạo khô hoặc cạo ướt cùng bọt tắm ngay dưới vòi sen một cách an toàn và tiện lợi.',
  },
];

export default function ProductFaqSection({
  title = 'Câu hỏi thường gặp & Giải đáp chi tiết',
  faqs = DEFAULT_FAQS,
  className = '',
}: ProductFaqSectionProps) {
  // Support toggling single FAQ item (or closing if already open)
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="faqs"
      aria-label="Câu hỏi thường gặp"
      className={`w-full py-16 sm:py-20 md:py-24 bg-[#f8f7f2] border-t border-neutral-200/60 scroll-mt-20 ${className}`}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Heading */}
        <SectionHeader
          title={title}
          subtitle="Giải đáp mọi thắc mắc về tính năng, cách sử dụng và chế độ bảo hành sản phẩm MANFRESH."
          align="left"
        />

        {/* Accordion List */}
        <div className="border-t border-neutral-300">
          {faqs.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className="border-b border-neutral-300 transition-colors duration-150"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 sm:py-6 flex items-center justify-between text-left group gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-semibold text-neutral-900 tracking-normal group-hover:text-amber-800 transition-colors duration-150 leading-relaxed pr-2">
                    {item.question}
                  </span>
                  <div
                    className={`flex-shrink-0 text-neutral-600 transition-transform duration-300 ease-out ${
                      isOpen ? 'rotate-180 text-neutral-900' : 'group-hover:text-neutral-900'
                    }`}
                  >
                    <ChevronDown className="w-5 h-5 stroke-[1.75]" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{
                        height: 'auto',
                        opacity: 1,
                        transition: {
                          height: { duration: 0.28, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.22, delay: 0.05 },
                        },
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                        transition: {
                          height: { duration: 0.22, ease: [0.04, 0.62, 0.23, 0.98] },
                          opacity: { duration: 0.15 },
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 text-sm sm:text-base text-neutral-700 leading-relaxed max-w-3xl font-normal">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
