import Sidebar from "@/components/Sidebar";

const AdminLayout = ({ children }) => {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
