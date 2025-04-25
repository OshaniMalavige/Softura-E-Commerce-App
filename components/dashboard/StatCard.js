const StatCard = ({ title, value, subtitle, icon, color }) => {
    return (
        <div className="bg-[#F1EFEC] p-6 rounded-lg shadow-sm flex-1 flex flex-col items-center">
            <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${color}`}
            >
                {icon}
            </div>
            <h3 className="text-lg font-medium text-gray-700">{title}</h3>
            <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
            <p className="text-3xl font-bold">{value}</p>
        </div>
    )
}
export default StatCard
