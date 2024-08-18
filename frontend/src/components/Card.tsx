interface Props {
  children: React.ReactNode;
}

export const Card: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex justify-center items-center h-full w-full bg-blue-light">
      <div className="flex flex-col max-w-[480px] bg-white border-1 radius-1 px-8 py-6">
        {children}
      </div>
    </div>
  );
};
