const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-[14px] shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-[#e5e7eb] ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
