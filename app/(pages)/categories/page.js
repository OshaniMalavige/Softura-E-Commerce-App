import CategoryGrid from "@/app/(pages)/customer/categoryGrid/page.js";
import Header from "@/components/theme/Header.js";
import Footer from "@/components/theme/Footer.js";

const AllCategories =() =>{
    return (
        <>
            <Header/>
                <div className="p-8">
                    <h3 className="text-3xl font-bold text-[var(--primaryColor)] text-center">Categories</h3>
                    <p className="mt-3 text-md text-gray-600 text-center">
                        Create a WOW effect wherever you go with our range of designs. It&#39;s the perfect combination of comfort & sleek. Let&#39;s explore.
                    </p>
                </div>
            <CategoryGrid/>
            <Footer/>
        </>
    );
}

export default AllCategories;