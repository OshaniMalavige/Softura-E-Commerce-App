import ProductList from "@/app/(pages)/productList/page.js";

const BestSelling =() =>{
    return(
        <>
            <div className="p-8">
                <h3 className="text-3xl font-bold text-[var(--primaryColor)] text-center">Best Selling</h3>
                <p className="mt-3 text-md text-gray-600 text-center">
                    Best quality fashion products are available in Softura.
                </p>
            </div>
            <ProductList filterStatus="New"/>
        </>
    );
}

export default BestSelling;