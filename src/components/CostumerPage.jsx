import { useEffect, useState } from "react";
import NavbarComponent from "./NavbarComponent";
import { Input, Button, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem } from "@nextui-org/react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Controller } from "react-hook-form";

export default function CostumerPage() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [customer, useCustomer] = useState([]);
    const navigate = useNavigate();
    const SchemaDesigner = z.object({
        name: z.string().min(5, "minimal 5 karakter atau lebih"),
        phoneNumber: z.string().min(12, "minimal 12 karakter atau lebih"),
        address: z.string(),
    });
    const form = useForm({
        defaultValues: {
            name: "",
            phoneNumber: "",
            address: "",
        },
        resolver: zodResolver(SchemaDesigner)
    });
    const checkAuth = () => {
        if (localStorage.getItem("is_login") == null) {
            navigate("/login");
        }
    }
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
                toast.error("silahkan login kembali", { duration: 2500 });
                navigate("/login");
            }
        }
    };
    const addCustomer = async (submitData, onClose) => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            await axiosInstance.post("/customers", submitData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            onClose();
            getCustomer();
            toast.success("Berhasil Menyimpan data", { duration: 2500 });
        } catch (error) {
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Status Code:", error.response.status);
            }
            console.log("Api Token : " + localStorage.getItem("enigma_laundry_token"));
            console.log("Terjadi eror gagal Menyimpan data Customer:", error.message);
        }
    }

    useEffect(() => {
        checkAuth();
        getCustomer();
    }, []);
    return (
        <>
            <NavbarComponent menu="customerMenu" />
            <div className="w-screen bg-blue-300 h-screen px-48 bg-contain bg-no-repeat bg-[200%_0%]" style={{ backgroundImage: "url('/bg-dashboard.png')" }}>
                <Button onPress={onOpen} color="primary" size="sm" className="my-8">Buat Customer Baru</Button>
                <Table aria-label="Example static collection table" className="w-full">
                    <TableHeader>
                        <TableColumn>Nama Customer</TableColumn>
                        <TableColumn>Nohp Customer</TableColumn>
                        <TableColumn>Alamat Customer</TableColumn>
                        <TableColumn>Detail Customer</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {customer.map((item) => {
                            if (item.name) {
                                return (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.phoneNumber}</TableCell>
                                        <TableCell>{item.address}</TableCell>
                                        <TableCell><Button color="success" size="sm"
                                            onClick={() => {
                                                navigate(`/customer-detail/${item.id}`)
                                            }}>Edit Customer</Button></TableCell>
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
                                <form onSubmit={form.handleSubmit((data) => addCustomer(data, onClose))} method="post">
                                    <ModalHeader className="flex flex-col gap-1">Buat Customer Baru</ModalHeader>
                                    <ModalBody>
                                        <Controller
                                            name="name"
                                            control={form.control}
                                            render={({ field, fieldState }) => {
                                                return <Input {...field} isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} className="mb-2" type="text" color="success" placeholder="Input Customer Name" label="Customer Name" />
                                            }}
                                        />
                                        <Controller
                                            name="phoneNumber"
                                            control={form.control}
                                            render={({ field, fieldState }) => {
                                                return <Input {...field} isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} className="mb-2" type="text" color="success" placeholder="Input Customer Phone" label="Customer Phone" />
                                            }}
                                        />
                                        <Controller
                                            name="address"
                                            control={form.control}
                                            render={({ field, fieldState }) => {
                                                return <Input {...field} isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} className="mb-2" type="text" color="success" placeholder="Input Customer Address" label="Customer Address" />
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
    );
}