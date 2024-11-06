import { useNavigate, useParams } from "react-router-dom"
import NavbarComponent from "./NavbarComponent";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Select, SelectItem } from "@nextui-org/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export default function DetailCustomerPage() {
    const navigate = useNavigate();
    const { customerId } = useParams();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
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
    const editCustomer = async (submitData) => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            await axiosInstance.put("/customers", { ...submitData, id: customerId }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success("Berhasil Mengupdate data", { duration: 2500 });
            navigate("/customer");
            navi
        } catch (error) {
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Status Code:", error.response.status);
            }
            console.log("Terjadi eror gagal Menyimpan data customer:", error.message);
        }
    }
    const getDetailCustomer = async () => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            const response = await axiosInstance.get(`/customers/${customerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            setCustomer(response.data.data);
        } catch (error) {
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Status Code:", error.response.status);
            }
            console.log("Terjadi Kesalahan Dalam Mengambil detail customer" + error);
        } finally {
            setLoading(false);
        }
    }

    const deleteData = async () => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            await axiosInstance.delete(`/customers/${customerId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            navigate("/customer");
            toast.success("berhasil menghapus data", { duration: 2500 });
        } catch (error) {
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Status Code:", error.response.status);
            }
            console.log("Terjadi Kesalahan Dalam Menghapus Customer" + error);
        }
    }

    useEffect(() => {
        getDetailCustomer();
    }, []);

    useEffect(() => {
        if (customer) {
            form.setValue("id", customer.id);
            form.setValue("name", customer.name);
            form.setValue("phoneNumber", customer.phoneNumber);
            form.setValue("address", customer.address);
        }
    }, [customer]);
    if (loading) return <div className="text-white">Loading...</div>;
    return (
        <>
            <NavbarComponent />
            <div className="w-screen bg-blue-300 h-screen bg-contain bg-no-repeat bg-[200%_0%] px-48 text-white" style={{ backgroundImage: "url('/bg-dashboard.png')" }}>
                <h1 className="text-2xl py-4">Detail Customer</h1>
                <form onSubmit={form.handleSubmit(editCustomer)} method="put">
                    <Controller
                        name="id"
                        control={form.control}
                        defaultValue={customerId}
                        render={({ field }) => {
                            return (<Input type="text" {...field} readOnly className="mb-2" color="success" label="Customer Id" />)
                        }}
                    />
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
                    <Button className="me-2" type="submit" color="success">Update</Button>
                    <Button color="danger" onClick={deleteData}>Delete Data</Button>
                </form>
            </div >
        </>
    )
}