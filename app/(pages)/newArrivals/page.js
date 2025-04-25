import ProductList from "@/app/(pages)/productList/page.js";
import Header from "@/components/theme/Header.js";
import Footer from "@/components/theme/Footer.js";

const NewArrivals = () =>{
    return (
        <>
            <Header/>
                <div className="p-8">
                    <h3 className="text-3xl font-bold text-[var(--primaryColor)] text-center">New Arrivals</h3>
                    <p className="mt-3 text-md text-gray-600 text-center">
                        Trendy uncommon products are available in Softura.
                    </p>
                </div>
                <ProductList filterStatus="New" />
            <Footer/>
        </>
    );
}

export default NewArrivals;