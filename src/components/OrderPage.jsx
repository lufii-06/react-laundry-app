import { useEffect, useState } from "react";
import NavbarComponent from "./NavbarComponent";
import { axiosInstance } from "../lib/axios";
import { Select, SelectItem, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Input, Spinner } from "@nextui-org/react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

export default function OrderPage() {

    const [orders, useOrders] = useState();
    const [product, useProduct] = useState();
    const [customer, useCustomer] = useState();
    const navigate = useNavigate();
    const [price, usePrice] = useState(0);
    const [totalBayar, useTotalBayar] = useState(0);
    const [isLoading, useIsLoading] = useState(true);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    // const schemaDesigner = z.object({
    //     qty: z.number("format data harus number").min(1, "quantity tidak boleh lebih kecil dari atau sama dengan 0")
    // })
    const form = useForm({
        defaultValues: {
            customerId: "",
            billDetails: [
                {
                    product: {
                        id: ""
                    },
                    qty: ""
                },
            ],
        },
        // resolver: zodResolver(schemaDesigner)
    });
    const checkAuth = () => {
        if (localStorage.getItem("is_login") == null) {
            navigate("/login");
        }
    }
    const getOrder = async () => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            const response = await axiosInstance.get("/bills", {
                headers: {
                    'Authorization': token
                }
            })
            useOrders(response.data.data);
        } catch (error) {
            console.log("Terjadi Kesalahan dalam mengambil data order" + error.response.data + error.response.status + error.message);
            if (error.response.data.message === "Unauthorized") {
                toast.error("silahkan login kembali", { duration: 2500 });
                navigate("/login");
            }
        } finally {
            useIsLoading(false);
        }
    }

    const getProduct = async () => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            const response = await axiosInstance.get("/products", {
                headers: {
                    'Authorization': token
                }
            });
            useProduct(response.data.data);
        } catch (error) {
            console.log("Terjadi eror gagal mendapatkan data product" + error);
            if (error.response.data.message === "Unauthorized") {
                toast.error("silahkan login kembali", { duration: 2500 });
                navigate("/login");
            }
        }
    };
    const getCustomer = async () => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            const response = await axiosInstance.get("/customers", {
                headers: {
                    'Authorization': token
                }
            });
            useCustomer(response.data.data);
        } catch (error) {
            console.log("Terjadi eror gagal mendapatkan data Customer" + error);
            if (error.response.data.message === "Unauthorized") {
                toast.error("silahkan login kembali"), { duration: 2500 };
                navigate("/login");
            }
        }
    };

    const createOrder = async (data, onClose) => {
        try {
            console.log(data);
            const token = localStorage.getItem("enigma_laundry_token");
            await axiosInstance.post("/bills", data, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            onClose();
            toast.success("Berhasil Membuat Orderan Baru", { duration: 2500 });
            getOrder();
        } catch (error) {
            console.log("gagal membuat orderan baru" + error);
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Status Code:", error.response.status);
            }
        }
    }

    const hitungTotal = (e) => {
        const productId = e.target.value;
        form.setValue("billDetails[0].product.id", productId);
        // console.log("produk dari inputan" + productId);
        // console.log("produk dari form" + form.getValues("billDetails[0].product.id"));
        const selectedProduk = product.find((p) => p.id === productId);
        usePrice(selectedProduk.price);
        useTotalBayar(selectedProduk.price * form.getValues("billDetails[0].qty"))
    }

    useEffect(() => {
        checkAuth();
        getCustomer();
        getProduct();
        getOrder();
    }, [])
    if (isLoading == true) {
        return <>
            <div className="h-screen w-screen flex justify-center items-center">
                <Spinner label="loading..." color="success" labelColor="success" />
            </div>
        </>
    }
    return (
        <>
            <NavbarComponent menu="orderMenu" />
            <div className="w-screen px-48 h-screen bg-blue-300 bg-contain bg-no-repeat bg-[200%_0%]" style={{ backgroundImage: "url('/bg-dashboard.png')" }}>
                <Button color="primary" className="my-8" onClick={onOpen}>Buat Order Baru</Button>
                <Table aria-label="Example static collection table" className="w-full">
                    <TableHeader>
                        <TableColumn>ID Bill</TableColumn>
                        <TableColumn>Nama Customer</TableColumn>
                        <TableColumn>Order Date</TableColumn>
                        <TableColumn>Action</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => {
                            return (
                                <TableRow TableRow key={order.id} >
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.customer.name}</TableCell>
                                    <TableCell>{moment(order.billDate).locale("id").format("DD MMMM YYYY, HH:mm")}</TableCell>
                                    <TableCell><Button color="success" onClick={() => {
                                        navigate(`/order-detail/${order.id}`)
                                    }}>Detail Order</Button></TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div >
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="bg-slate-700 text-white">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <form onSubmit={form.handleSubmit((data) => createOrder(data, onClose))} method="post">
                                <ModalHeader className="flex flex-col gap-1">Create Order</ModalHeader>
                                <ModalBody>
                                    <Controller
                                        name="customerId"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <Select items={customer}
                                                    label="Customer"
                                                    placeholder="Select a Customer"
                                                    {...field} isInvalid={Boolean(fieldState.error)}
                                                    errorMessage={fieldState.error?.message}
                                                    className="mb-2"
                                                    color="success">
                                                    {(customer) => <SelectItem value={customer.id}>{customer.name}</SelectItem>}
                                                </Select>
                                            )
                                        }}
                                    />
                                    <Controller
                                        name="billDetails[0].product.id"
                                        control={form.control}
                                        render={({ field, fieldState }) => {
                                            return (
                                                <Select items={product}
                                                    label="Product"
                                                    placeholder="Select a Product"
                                                    {...field} isInvalid={Boolean(fieldState.error)}
                                                    errorMessage={fieldState.error?.message}
                                                    className="mb-2"
                                                    onChange={hitungTotal}
                                                    color="success">
                                                    {(product) => <SelectItem value={product.id} >{product.name}</SelectItem>}
                                                </Select>
                                            )
                                        }}
                                    />
                                    <div className="grid grid-cols-2 gap-2">
                                        <Controller
                                            name="billDetails[0].qty"
                                            control={form.control}
                                            render={({ field, fieldState }) => {
                                                return (<Input {...field}
                                                    type="number"
                                                    isInvalid={Boolean(fieldState.error)}
                                                    errorMessage={fieldState.error?.message}
                                                    value={field.value}
                                                    className="mb-2"
                                                    min="1"
                                                    color="success"
                                                    placeholder="Input Quantity"
                                                    label="input Quantity"
                                                    onChange={(e) => {
                                                        const value = e.target.value ? Number(e.target.value) : 0;
                                                        field.onChange(value);
                                                        useTotalBayar(value * price);
                                                    }} />)
                                            }}
                                        />
                                        <Input type="number" className="mb-2" color="success" placeholder="Price" label="Price" value={price} readOnly />
                                    </div>
                                    <Input name="total" value={totalBayar} label="Total Bill" color="success" readOnly />
                                </ModalBody>
                                <ModalFooter>
                                    <Button color="danger" variant="shadow" onPress={onClose}>
                                        Close
                                    </Button>
                                    <Button type="submit" color="success" variant="shadow">
                                        Create
                                    </Button>
                                </ModalFooter>
                            </form>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}

