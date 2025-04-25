import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonTable = ({ columns = 4, rows = 5 }) => {
    return (
        <div className="p-4 bg-white shadow-lg rounded-xl">
            <div className="mb-4">
                <Skeleton height={24} width="30%" />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead>
                    <tr>
                        {Array.from({ length: columns }).map((_, index) => (
                            <th key={index} className="px-6 py-3">
                                <Skeleton height={16} width="70%" />
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {Array.from({ length: rows }).map((_, rowIndex) => (
                        <tr key={rowIndex} className="border-b border-gray-200">
                            {Array.from({ length: columns }).map((_, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    <Skeleton height={16} />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SkeletonTable;
