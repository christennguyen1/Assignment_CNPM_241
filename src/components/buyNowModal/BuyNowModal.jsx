/* eslint-disable react/prop-types */
import {
    Button,
    Dialog,
    DialogBody,
} from "@material-tailwind/react";
import { useState } from "react";

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);
    return (
        <>
            <Button
                type="button"
                onClick={handleOpen}
                className="w-full px-4 py-3 text-center text-white bg-black border border-transparent dark:border-gray-700 hover:bg-gray-800 rounded-xl"
            >
                Mua ngay
            </Button>
            <Dialog open={open} handler={handleOpen}>
                <DialogBody className="">
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            value={addressInfo.name}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    name: e.target.value
                                })
                            }}
                            placeholder='Nhập họ tên'
                            className='bg-gray-300 border border-gray-800 px-2 py-2 w-full rounded-md outline-none placeholder-gray-600'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="address"
                            value={addressInfo.address}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    address: e.target.value
                                })
                            }}
                            placeholder='Nhập địa chỉ'
                            className='bg-gray-300 border border-gray-800 px-2 py-2 w-full rounded-md outline-none placeholder-gray-600'
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="number"
                            name="pincode"
                            value={addressInfo.pincode}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    pincode: e.target.value
                                })
                            }}
                            placeholder='Nhập mã PIN'
                            className='bg-gray-300 border border-gray-800 px-2 py-2 w-full rounded-md outline-none placeholder-gray-600'
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            name="mobileNumber"
                            value={addressInfo.mobileNumber}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    mobileNumber: e.target.value
                                })
                            }}
                            placeholder='Nhập số điện thoại'
                            className='bg-gray-300 border border-gray-800 px-2 py-2 w-full rounded-md outline-none placeholder-gray-600'
                        />
                    </div>

                    <div className="">
                        <Button

                            type="button"
                            onClick={() => {
                                handleOpen();
                                buyNowFunction();
                            }}
                            className="w-full px-4 py-3 text-center text-white bg-black border border-transparent dark:border-gray-700 rounded-lg"
                        >
                            Mua ngay
                        </Button>
                    </div>

                </DialogBody>
            </Dialog>
        </>
    );
}

export default BuyNowModal;
