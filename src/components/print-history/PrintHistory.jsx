const PrintHistory = () => {
    const statuses = ['Hoàn thành', 'Đang chờ', 'Từ chối'];

    return (
        <div className="relative">
            <div className="sticky top-0 py-5 px-8 bg-white z-5 border-b border-gray-300">
                <h2 className="text-xl font-poppins_bold">Lịch sử in</h2>
            </div>
            <ul className="list-none overflow-y-auto h-[calc(100vh-8rem)] w-full">
                {Array.from({length: 100}, (_, i) => {
                    const status = statuses[Math.floor(Math.random() * statuses.length)];
                    let bgColor = '';
                    if (status === 'Hoàn thành') bgColor = 'bg-green-200';
                    else if (status === 'Đang chờ') bgColor = 'bg-yellow-200';
                    else if (status === 'Từ chối') bgColor = 'bg-red-200';

                    return (
                        <li key={i} className={`py-2 px-2 border-b border-gray-200 flex items-center w-full ${bgColor}`}>
                            <div className="w-2/3 flex-col ml-6">
                                <div className='flex'>Ngày in: <p className='font-bold ml-1'>01/01/2022</p></div>
                                <div className='flex'>Đã sử dụng: <p className='font-bold ml-1'>3 tờ A4</p></div>
                                <div className='flex'>Địa điểm: <p className='font-bold ml-1'>H6 BK-DAn</p></div>
                                <div className='flex'>Tổng giá: <p className='font-bold ml-1'>100.000 VND</p></div>
                            </div>
                            <div className='flex-col ml-5'>
                                Trạng thái: <p className="font-bold">{status}</p>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default PrintHistory;