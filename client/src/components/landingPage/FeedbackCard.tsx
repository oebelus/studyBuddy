interface FeedbackCardProps {
    content: string,
    name: string, 
    title: string
}

export default function FeedbackCard({ content, name, title }: FeedbackCardProps) {
  return (
    <div className="group bg-blue-400 bg-opacity-50 shadow-lg flex justify-between flex-col px-10 py-12 rounded-[20px] w-[370px] md:mr-10 sm:mr-5 mr-0 my-5 transition-all duration-300 ease-in-out transform hover:scale-105">
      <span className="text-[#334A88] material-symbols-outlined text-[42px] object-contain">format_quote</span>
      <p className="text-[18px] leading-[32px] my-10">{content}</p>

      <div className="flex flex-row">
        <span className="material-symbols-outlined text-[48px] text-[#334A88]">account_circle</span>
        <div className="flex flex-col ml-4">
          <h4 className="text-[20px] leading-[32px] font-semibold">{name}</h4>
          <h4>{title}</h4>
        </div>
      </div>
    </div>
  );
}

