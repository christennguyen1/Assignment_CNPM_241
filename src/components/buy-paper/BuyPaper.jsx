import { useState, useEffect } from "react";

const BuyPaper = () => {
    const [paperSize, setPaperSize] = useState('');
    const [pieces, setPieces] = useState('');
    const [price, setPrice] = useState(0);

    const handlePaperSizeChange = (e) => {
        setPaperSize(e.target.value);
    };

    const handlePiecesChange = (e) => {
        setPieces(e.target.value);
    };

    useEffect(() => {
        let unitPrice = 0;
        if (paperSize === 'a3') {
            unitPrice = 300;
        } else if (paperSize === 'a4') {
            unitPrice = 150;
        } else if (paperSize === 'a5') {
            unitPrice = 75;
        }
        setPrice(unitPrice * pieces);
    }, [paperSize, pieces]);

    return (
        <div className="flex-[2_0_30%] border border-gray-300 flex flex-col items-start justify-start p-3 relative">
            <div className="mt-5 mb-5 ml-5">
                <h2 className='text-left text-2xl font-bold'>
                    Mua giấy
                </h2>
            </div>

            <div className="w-full flex h-full">
                {/* Left Column */}
                <div className="w-1/2 pr-2 ml-5 mr-14 m-auto">
                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printer" className="w-1/3">Khổ giấy:</label>
                        <select
                            className={`w-2/3 border border-gray-300 py-2 px-1 rounded-md ${
                                paperSize === '' ? 'text-gray-400' : 'text-black'
                            }`}
                            value={paperSize}
                            onChange={handlePaperSizeChange}
                        >
                            <option value="" disabled hidden>
                                Chọn khổ giấy
                            </option>
                            <option value="a3" className="text-black">A3</option>
                            <option value="a4" className="text-black">A4</option>
                            <option value="a5" className="text-black">A5</option>
                        </select>
                    </div>

                    <div className="w-full flex items-center mb-3">
                        <label htmlFor="printer" className="w-1/3">Số tờ:</label>
                        <input
                            type="number"
                            className="w-2/3 border border-gray-300 p-2 rounded-md"
                            placeholder="Nhập số bản"
                            min="1"
                            value={pieces}
                            onChange={handlePiecesChange}
                        />
                    </div>
                </div>

                {/* Right Column */}
                <div className="w-1/2 flex-col m-auto mr-5">
                    {/* Buy Page Button */}
                    <div className='ml-2.5 -mt-6'>
                        <input
                            type="submit"
                            value="Mua giấy"
                            className='w-full text-white bg-black border border-black hover:bg-gray-600 hover:text-black py-2 px-4 font-bold rounded-md mt-2'
                        />
                    </div>

                    {/* BKPay Button */}
                    <div className='ml-2.5'>
                        <input
                            type="submit"
                            value="BKPay"
                            className='w-full text-white bg-gray-500 border border-gray-500 hover:border-black hover:bg-gray-600 hover:text-black py-2 px-4 font-bold rounded-md mt-2'
                        />
                    </div>
                </div>
            </div>
            <div className='w-1/2 flex flex-col ml-5 mb-5'>
                <span className='text-black font-bold'>Tổng giá: {price} VND</span>
            </div>
        </div>
    )
}

export default BuyPaper;