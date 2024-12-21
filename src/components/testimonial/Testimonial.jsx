/* eslint-disable react/no-unescaped-entities */

const Testimonial = () => {
    return (
        <div>
            <section className="body-font mb-10">
                {/* main  */}
                <div className="container px-5 py-10 mx-auto">
                    {/* Heading  */}
                    <h1 className=' text-center text-3xl font-poppins_semibold'>Đội ngũ phát triển: <span
                        style={{color: '#1488D8'}}>Trai lầu xanh</span></h1>
                    {/* para  */}
                    <h2 className=' text-center text-2xl font-poppins_semibold mb-10'>Thành viên nhóm:</h2>

                    <div className="flex flex-wrap -m-4">
                        {/* Testimonial 1 */}
                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="h-full text-center">
                                <img alt="testimonial"
                                     className="w-20 h-20 object-cover object-center rounded-full inline-block bg-gray-100"
                                     src="https://u.cubeupload.com/BinhDangCap/Hung.jpg"/>
                                <div><span className="inline-block h-1 w-10 rounded"
                                           style={{backgroundColor: '#1488D8'}}/></div>
                                <h2 className="font-medium title-font tracking-wider text-sm uppercase">Nguyễn
                                    Minh Hưng</h2>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="h-full text-center">
                                <img alt="testimonial"
                                     className="w-20 h-20 object-cover object-center rounded-full inline-block bg-gray-100"
                                     src="https://u.cubeupload.com/BinhDangCap/BinhDangCap.jpg"/>
                                <div><span className="inline-block h-1 w-10 rounded"
                                           style={{backgroundColor: '#1488D8'}}/></div>
                                <h2 className="font-medium title-font tracking-wider text-sm uppercase">Phan
                                    Thanh Bình</h2>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="p-4 md:w-1/3 sm:w-1/2 w-full">
                            <div className="h-full text-center">
                                <img alt="testimonial"
                                     className="w-20 h-20 object-cover object-center rounded-full inline-block bg-gray-100"
                                     src="https://u.cubeupload.com/BinhDangCap/HoanBao.jpg"/>
                                <div><span className="inline-block h-1 w-10 rounded"
                                           style={{backgroundColor: '#1488D8'}}/></div>
                                <h2 className="font-medium title-font tracking-wider text-sm uppercase">Vũ
                                    Đình Hoàn</h2>
                            </div>
                        </div>

                        {/* Testimonial 4 */}
                        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                            <div className="h-full text-center">
                                <img alt="testimonial"
                                     className="w-20 h-20 object-cover object-center rounded-full inline-block bg-gray-100"
                                     src="https://u.cubeupload.com/BinhDangCap/Quy.jpg"/>
                                <div><span className="inline-block h-1 w-10 rounded"
                                           style={{backgroundColor: '#1488D8'}}/></div>
                                <h2 className="font-medium title-font tracking-wider text-sm uppercase">Đỗ
                                    Quý</h2>
                            </div>
                        </div>

                        {/* Testimonial 5 */}
                        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                            <div className="h-full text-center">
                                <img alt="testimonial"
                                     className="w-20 h-20 object-cover object-center rounded-full inline-block bg-gray-100"
                                     src="https://u.cubeupload.com/BinhDangCap/Kiet.jpg"/>
                                <div><span className="inline-block h-1 w-10 rounded"
                                           style={{backgroundColor: '#1488D8'}}/></div>
                                <h2 className="font-medium title-font tracking-wider text-sm uppercase">Nguyễn
                                    Quốc Kiệt</h2>
                            </div>
                        </div>

                        {/* Testimonial 6 */}
                        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                            <div className="h-full text-center">
                                <img alt="testimonial"
                                     className="w-20 h-20 object-cover object-center rounded-full inline-block bg-gray-100"
                                     src="https://u.cubeupload.com/BinhDangCap/HoanBao.jpg"/>
                                <div><span className="inline-block h-1 w-10 rounded"
                                           style={{backgroundColor: '#1488D8'}}/></div>
                                <h2 className="font-medium title-font tracking-wider text-sm uppercase">Nguyễn
                                    Hữu Bảo</h2>
                            </div>
                        </div>

                        {/* Testimonial 7 */}
                        <div className="p-4 md:w-1/4 sm:w-1/2 w-full">
                            <div className="h-full text-center">
                                <img alt="testimonial"
                                     className="w-20 h-20 object-cover object-center rounded-full inline-block bg-gray-100"
                                     src="https://u.cubeupload.com/BinhDangCap/Vinh.jpg"/>
                                <div><span className="inline-block h-1 w-10 rounded"
                                           style={{backgroundColor: '#1488D8'}}/></div>
                                <h2 className="font-medium title-font tracking-wider text-sm uppercase">Nguyễn
                                    Khắc Vinh</h2>
                            </div>
                        </div>
                    </div>


                    <div className="flex justify-center w-full mt-32">
                        <div
                            className="order-2 hover:shadow-xl hover:shadow-gray-200 bg-gray-100 shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] px-4 py-6 rounded-lg">
                            <div className="flex items-center justify-center whitespace-nowrap">
                                <p className='font-poppins_bold text-center text-xl'>
                                    Logo nhận dạng máy in thuộc hệ thống
                                </p>
                                <img className="ml-6 w-65 h-12 object-cover rounded"
                                     src="https://u.cubeupload.com/BinhDangCap/TraiLauXanh.png" alt="Trai Lau Xanh"/>
                                <img className="ml-6 w-12 h-12 object-cover"
                                     src="https://u.cubeupload.com/BinhDangCap/logo.png" alt="Logo"/>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Testimonial