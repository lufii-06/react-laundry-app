import { Link, useParams } from "react-router-dom";
import NavbarComponent from "./NavbarComponent";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Spinner } from "@nextui-org/react";
import moment from "moment";
import { p } from "framer-motion/client";

export default function DetailOrderPage() {
    const { orderId } = useParams();
    const [detailOrder, setDetailOrder] = useState();
    const [isLoading, useIsLoading] = useState(true)
    const getData = async () => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            const response = await axiosInstance.get(`bills/${orderId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            setDetailOrder(response.data.data);
        } catch (error) {
            console.log("Terjadi kesalahan dalam mengambil data" + error + error.response.data + error.response.status);
        } finally {
            useIsLoading(false);
        }
    }
    useEffect(() => {
        getData();
    }, [])
    if (isLoading === true) {
        return <>
            <div className="h-screen w-screen flex justify-center items-center">
                <Spinner label="loading..." color="success" labelColor="success" />
            </div>
        </>
    }
    return (
        <>
            <NavbarComponent menu="orderMenu" />
            <div className="w-screen h-full bg-blue-300 bg-contain bg-no-repeat bg-[200%_0%] px-48 py-10 text-white" style={{ backgroundImage: "url('/bg-dashboard.png')" }}>
                <Card className="overflow-auto h-full p-5">
                    <CardHeader className="text-3xl font-bold">Detail Order</CardHeader>
                    <Divider />
                    <CardBody className="gap-5">
                        <Input readOnly label="Id Order" color="success" value={detailOrder.id} />
                        <Input readOnly label="Order Date" color="success" value={moment(detailOrder.billDate).locale("id").format("DD MMMM YYYY, HH:mm")} />
                        <Input readOnly label="Customer Name" color="success" value={detailOrder.customer.name} />
                        <div className="grid grid-cols-2 gap-3">
                            <Input readOnly label="Customer Phone" color="success" value={detailOrder.customer.phoneNumber} />
                            <Input readOnly label="Customer Address" color="success" value={detailOrder.customer.address} />
                        </div>
                        <Input readOnly label="Product" color="success" value={detailOrder.billDetails[0].product.name} />
                        <div className="grid grid-cols-2 gap-3">
                            <Input readOnly label="Price" color="success" value={detailOrder.billDetails[0].product.name} />
                            <Input readOnly label="Qty" color="success" value={detailOrder.billDetails[0].qty} />
                        </div>
                        <Input readOnly label="Total Price" color="success" value={detailOrder.billDetails[0].product.price * detailOrder.billDetails[0].qty} />
                    </CardBody>
                    <CardFooter className="flex justify-end px-7">
                        <Button color="primary"><Link to="/order">Kembali</Link></Button>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}