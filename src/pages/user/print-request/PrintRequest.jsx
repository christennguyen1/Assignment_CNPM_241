import Layout from "../../../components/layout/Layout.jsx";
import OrderPrint from "../../../components/order-print/OrderPrint.jsx";
import BuyPaper from "../../../components/buy-paper/BuyPaper.jsx";
import PrintHistory from "../../../components/print-history/PrintHistory.jsx"

const PrintRequest = () => {
    return (
        <Layout>
            <div className="flex h-screen p-5 gap-5 box-border">
                <div className="flex-[1_1_33%] rounded-lg border border-gray-300">
                    <PrintHistory />
                </div>
                <div className="flex-[1_1_67%] flex flex-col mr-5 gap-5 overflow-y-auto">
                    <OrderPrint />
                    <BuyPaper />
                </div>
            </div>
        </Layout>
    );
};

export default PrintRequest;