const Track = () => {
    return (
        <section>
            <div className="container mx-auto px-5 py-10 md:py-14">
                {/* main  */}
                {/* Heading  */}
                <h1 className='text-center text-3xl font-poppins_bold mb-5'>Hệ thống in thông minh cho sinh viên HCMUT</h1>

                {/* para  */}
                <h2 className='text-left text-2xl mb-7'>
                    <span style={{color: '#1488D8', fontWeight: 'bold', fontFamily: 'Poppins'}}>HCMUT-SSPS</span> là hệ thống được xây dựng bởi đại học Bách Khoa thành phố Hồ Chí Minh nhằm mục đích phục vụ, in ấn tài liệu cho sinh viên của trường một cách tiện lợi nhất. Hệ thống cam kết mang lại những giá trị sau:
                </h2>

                {/* para  */}
                <p className='text-left text-gray-600 mb-12'>Thời gian hoạt động:  5:00 - 22:00 hàng ngày</p>

                <div className="flex flex-wrap -m-4 text-center">
                    {/* Track 1 */}
                    <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                        <div
                            className="border-2 hover:shadow-xl hover:shadow-gray-200 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg">
                            <svg className="w-12 h-12 mb-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1488D8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"/>
                            </svg>
                            <h2 className="title-font font-poppins_semibold text-lg">Chất lượng in hàng đầu</h2>
                            <p className="leading-relaxed">Cung cấp các sản phẩm in sắc nét, bền bỉ với chất lượng cao,
                                đáp ứng mọi nhu cầu từ cá nhân đến tập thể.</p>
                        </div>
                    </div>

                    {/* Track 2 */}
                    <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                        <div
                            className="border-2 hover:shadow-xl hover:shadow-gray-200 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg">
                            <svg className="w-12 h-12 mb-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1488D8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"/>
                            </svg>
                            <h2 className="title-font font-poppins_semibold text-lg">Đa dạng dịch vụ in ấn</h2>
                            <p className="leading-relaxed">Hệ thống in ấn phong phú với đầy đủ các dịch vụ như in tài
                                liệu, in sách, poster, in ấn phẩm truyền thông, và nhiều hơn thế.</p>
                        </div>
                    </div>

                    {/* Track 3 */}
                    <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                        <div
                            className="border-2 hover:shadow-xl hover:shadow-gray-200 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg">
                            <svg className="w-12 h-12 mb-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1488D8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                            <h2 className="title-font text-lg font-poppins_semibold">Tiết kiệm thời gian tối đa</h2>
                            <p className="leading-relaxed">Quy trình đặt hàng máy, in ấn nhanh chóng, đảm bảo sinh viên
                                luôn nhận sản phẩm đúng thời hạn và trong tình trạng tốt nhất.</p>
                        </div>
                    </div>

                    {/* Track 4 */}
                    <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                        <div
                            className="border-2 hover:shadow-xl hover:shadow-gray-200 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg">
                            <svg className="w-12 h-12 mb-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1488D8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"/>
                            </svg>
                            <h2 className="title-font font-poppins_semibold text-lg">Giải pháp in tiết kiệm, hiệu
                                quả</h2>
                            <p className="leading-relaxed">Sau khi dùng hết trang in miễn phí, hệ thống cam kết mức giá
                                hợp lý, cạnh tranh, phù hợp với chất lượng dịch vụ mang lại.</p>
                        </div>
                    </div>

                    {/* Track 5 */}
                    <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                        <div
                            className="border-2 hover:shadow-xl hover:shadow-gray-200 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg">
                            <svg className="w-12 h-12 mb-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1488D8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"/>
                            </svg>
                            <h2 className="title-font font-poppins_semibold text-lg">Cung cấp dịch vụ giao tài liệu in
                                tận nơi</h2>
                            <p className="leading-relaxed"> Đội ngũ giao hàng chuyên nghiệp, nhanh chóng, đảm bảo tài
                                liệu in đến tay sinh viên một cách an toàn trong địa chỉ bán kính dưới 3km.</p>
                        </div>
                    </div>

                    {/* Track 6 */}
                    <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                        <div
                            className="border-2 hover:shadow-xl hover:shadow-gray-200 border-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg">
                            <svg className="w-12 h-12 mb-3 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none"
                                 viewBox="0 0 24 24" strokeWidth={1.5} stroke="#1488D8">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"/>
                            </svg>
                            <h2 className="title-font font-poppins_semibold text-lg">Hỗ trợ kỹ thuật tận tâm</h2>
                            <p className="leading-relaxed">Luôn đồng hành cùng sinh viên để giải quyết mọi vấn đề kỹ
                                thuật, đảm bảo sản phẩm hoàn hảo khi đến tay bạn.</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Track;