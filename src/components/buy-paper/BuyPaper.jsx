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
        <div
            className="flex-[2_0_15%] rounded-xl border border-gray-300 flex flex-col items-start justify-start p-3 relative">
            <div className="mt-5 mb-5 ml-5">
                <h2 className='text-left text-2xl font-poppins_bold'>
                    Mua giấy
                </h2>
            </div>

            <div className="w-full flex">
                <div className="w-full flex items-center mb-3 r-2 ml-5 mr-14">
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

                <div className="w-full flex items-center mb-3 pl-2 mr-5">
                    <label htmlFor="printer" className="w-1/3">Số tờ:</label>
                    <input
                        type="number"
                        className="w-2/3 border border-gray-300 p-2 rounded-md"
                        placeholder="Nhập số tờ"
                        min="1"
                        value={pieces}
                        onChange={handlePiecesChange}
                    />
                </div>
            </div>

            <div className="w-full flex items-center justify-between p-5">
                <span className='text-black font-poppins_bold'>Tổng giá: {price} VND</span>
                <input
                    type="submit"
                    value="Mua giấy"
                    className='text-white bg-black hover:bg-[#1488D8] hover:scale-105 py-2 px-4 font-poppins_bold rounded-full transition-transform duration-300'
                />
            </div>
        </div>
    )
}

export default BuyPaper;