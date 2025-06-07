'use client';
import { useRouter } from "next/router";
import { useApp } from "../Context/AppContext";
import { disconnect } from "process";

export default function Checkout(){
    const router = useRouter();

    const {cart , isSignedIn} = useApp();
    const handleCheckout=()=>{
        if(!isSignedIn){
            toast.error("please sign in to login");
            return;
        }
        if(!cart.length){
            toast.error("your cart is empty");
            return;
        }
        try{
            router.push("/checout");
        }catch(error){
            console.error("error during checkout:",error);
            toast.error("Failed to proceed to checkout. Please try again.");
        }
    };
    return(
        <div className="mt-6 flex justify-between items-center">
            <div>
                <p className="text-lg font-semibold">
                    Total :₹{cart.reduce((sum , item)=>sum+ (item.price*item.quantity) , 0)}
                </p>
                <p className="text-sm text-gray-500">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)} items
                </p>
            </div>
            <button
                onClick={handleCheckout}
                className={`px-6 py-3 rounded-lg transition ${
                isSignedIn && cart.length
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                disabled={!isSignedIn||!cart.length}
                    >
                        proceed to checkout
            </button>
        </div>
    )

}