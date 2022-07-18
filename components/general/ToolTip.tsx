import { InformationCircleIcon } from "@heroicons/react/outline";

export const Tooltip = ({ 
  message, children 
} : {
  message: string, children 
}) => {
  return (
    <div className="relative flex flex-col group">
    <div className="flex mb-2">
    <InformationCircleIcon className="w-5 h-5 mr-2"></InformationCircleIcon> {children}  

    </div>
      <div className="absolute bottom-0 flex flex-col items-center hidden mb-6 group-hover:flex">
        <span className="relative z-10 p-2 text-xs leading-none text-white whitespace-no-wrap bg-gray-600 shadow-lg rounded-md">{message}</span>
        <div className="w-3 h-3 -mt-2 rotate-45 bg-gray-600"></div>
      </div>
    </div>
  );
};