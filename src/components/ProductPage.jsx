import { useEffect, useState } from "react";
import NavbarComponent from "./NavbarComponent";
import { Input, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import { axiosInstance } from "../lib/axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Controller } from "react-hook-form";

export default function ProductPage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [product, useProduct] = useState([]);
    const type = [
        { key: "Kg", label: "Kg" },
        { key: "g", label: "g" },
        { key: "Unit", label: "Unit" },
        { key: "Liter", label: "Liter" },
    ];
    const navigate = useNavigate();
    const SchemaDesigner = z.object({
        name: z.string().min(5, "minimal 5 karakter atau lebih"),
        price: z.number().positive("Harga harus lebih dari 0"),
        type: z.string(),
    });
    const form = useForm({
        defaultValues: {
            name: "",
            price: "",
            type: "",
        },
        resolver: zodResolver(SchemaDesigner)
    });

    const checkAuth = () => {
        if (localStorage.getItem("is_login") == null) {
            navigate("/login");
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
    const addProduct = async (submitData, onClose) => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            await axiosInstance.post("/products", submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onClose();
            getProduct();
            toast.success("Berhasil Menyimpan data", { duration: 2500 });
        } catch (error) {
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Status Code:", error.response.status);
            }
            console.log("Api Token : " + localStorage.getItem("enigma_laundry_token"));

            console.log("Terjadi eror gagal Menyimpan data product:", error.message);
        }
    }

    useEffect(() => {
        checkAuth();
        getProduct();
    }, []);
    return (
        <>
            <NavbarComponent menu="productMenu" />
            <div className="w-screen px-48 bg-blue-300 h-screen bg-contain bg-no-repeat bg-[200%_0%] " style={{ backgroundImage: "url('/bg-dashboard.png')" }}>
                <Button onPress={onOpen} color="primary" size="sm" className="my-8">Tambah Produk Baru</Button>
                <Table aria-label="Example static collection table" className="w-full">
                    <TableHeader>
                        <TableColumn>Nama Produk</TableColumn>
                        <TableColumn>Type Produk</TableColumn>
                        <TableColumn>Harga Produk</TableColumn>
                        <TableColumn>Detail Produk</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {product.map((item) => {
                            if (item.name) {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.type}</TableCell>
                                        <TableCell>{item.price}</TableCell>
                                        <TableCell><Button color="success" size="sm"
                                            onClick={() => {
                                                navigate(`/product-detail/${item.id}`)
                                            }}>Edit Produk</Button></TableCell>
                                    </TableRow>
                                )
                            }
                        })}
                    </TableBody>
                </Table>
                <Modal isOpen={isOpen} onOpenChange={onOpenChange} className="bg-slate-700 text-white">
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <form onSubmit={form.handleSubmit((data) => addProduct(data, onClose))} method="post">
                                    <ModalHeader className="flex flex-col gap-1">Tambah Produk Baru</ModalHeader>
                                    <ModalBody>
                                        <Controller
                                            name="name"
                                            control={form.control}
                                            render={({ field, fieldState }) => {
                                                return <Input {...field} isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} className="mb-2" type="text" color="success" placeholder="Input Product Name" label="Product Name" />
                                            }}
                                        />
                                        <Controller
                                            name="price"
                                            control={form.control}
                                            render={({ field, fieldState }) => {
                                                return <Input {...field}
                                                    type="number"
                                                    step="500"
                                                    isInvalid={Boolean(fieldState.error)}
                                                    errorMessage={fieldState.error?.message}
                                                    className="mb-2"
                                                    color="success"
                                                    placeholder="Input Product Price"
                                                    label="Rp. Product Price"
                                                    onChange={(e) => {
                                                        const value = e.target.value ? Number(e.target.value) : 0;
                                                        field.onChange(value);
                                                    }} />
                                            }}
                                        />
                                        <Controller
                                            name="type"
                                            control={form.control}
                                            render={({ field, fieldState }) => {
                                                return (
                                                    <Select items={type}
                                                        label="Type Produk"
                                                        placeholder="Input Your Product Type"
                                                        {...field} isInvalid={Boolean(fieldState.error)}
                                                        errorMessage={fieldState.error?.message}
                                                        className="mb-2"
                                                        color="success">
                                                        {(type) => <SelectItem>{type.label}</SelectItem>}
                                                    </Select>
                                                )
                                            }}
                                        />
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="shadow" onPress={onClose}>
                                            Batal
                                        </Button>
                                        <Button color="primary" variant="shadow" type="submit">
                                            Tambah
                                        </Button>
                                    </ModalFooter>
                                </form>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    )
}