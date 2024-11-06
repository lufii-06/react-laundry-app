import { useNavigate, useParams } from "react-router-dom"
import NavbarComponent from "./NavbarComponent";
import { Controller, useForm } from "react-hook-form";
import { Button, Input, Select, SelectItem, Spinner } from "@nextui-org/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export default function DetailProductPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const SchemaDesigner = z.object({
        name: z.string().min(5, "minimal 5 karakter atau lebih"),
        price: z.number().positive("Harga harus lebih dari 0"),
        type: z.string(),
    });
    const typeOption = [
        { key: "Kg", label: "Kg" },
        { key: "g", label: "g" },
        { key: "Unit", label: "Unit" },
        { key: "Liter", label: "Liter" },
    ];
    const form = useForm({
        defaultValues: {
            id: "",
            name: "",
            price: "",
            type: "",
        },
        resolver: zodResolver(SchemaDesigner)
    });
    const editProduct = async (submitData) => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            await axiosInstance.put("/products", { ...submitData, id: productId }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success("Berhasil Mengupdate data", { duration: 2500 });
            navigate("/");
            navi
        } catch (error) {
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Status Code:", error.response.status);
            }
            console.log("Terjadi eror gagal Menyimpan data product:", error.message);
        }
    }
    const getDetailProduct = async () => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            const response = await axiosInstance.get(`/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProduct(response.data.data);
        } catch (error) {
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Status Code:", error.response.status);
            }
            console.log("Terjadi Kesalahan Dalam Mengambil Nilai Detail Produk" + error);
        } finally {
            setLoading(false);
        }
    }

    const deleteData = async () => {
        try {
            const token = localStorage.getItem("enigma_laundry_token");
            await axiosInstance.delete(`/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate("/");
            toast.success("berhasil menghapus data", { duration: 2500 });
        } catch (error) {
            if (error.response) {
                console.log("Error Response Data:", error.response.data);
                console.log("Status Code:", error.response.status);
            }
            console.log("Terjadi Kesalahan Dalam Menghapus Produk" + error);
        }
    }

    useEffect(() => {
        getDetailProduct();
    }, []);
    useEffect(() => {
        if (product) {
            form.setValue("id", product.id);
            form.setValue("name", product.name);
            form.setValue("price", product.price);
            form.setValue("type", product.type);
        }
    }, [product]);
    if (loading) {
        return <>
            <div className="h-screen w-screen flex justify-center items-center">
                <Spinner label="loading..." color="success" labelColor="success" />
            </div>
        </>
    }
    return (
        <>
            <NavbarComponent />
            <div className="w-screen h-screen bg-blue-300 bg-contain bg-no-repeat bg-[200%_0%] px-48 text-white" style={{ backgroundImage: "url('/bg-dashboard.png')" }}>
                <h1 className="text-2xl py-4">Detail Product</h1>
                <form onSubmit={form.handleSubmit(editProduct)} method="put">
                    <Controller
                        name="id"
                        control={form.control}
                        defaultValue={productId}
                        render={({ field }) => {
                            return (<Input type="hidden" {...field} />)
                        }}
                    />
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
                                }}
                            />
                        }}
                    />
                    <Controller
                        name="type"
                        control={form.control}
                        render={({ field, fieldState }) => {
                            return (
                                <Select
                                    {...field}
                                    label="Type Produk"
                                    placeholder="Input Your Product Type"
                                    onChange={(value) => {
                                        field.onChange(value);
                                    }}
                                    defaultSelectedKeys={[product.type]}
                                    isInvalid={Boolean(fieldState.error)}
                                    errorMessage={fieldState.error?.message}
                                    className="mb-2"
                                    color="success">
                                    {typeOption.map((item) => {
                                        return (<SelectItem key={item.key} >{item.label}</SelectItem>)
                                    })}
                                </Select>
                            )
                        }}
                    />
                    <Button className="me-2" type="submit" color="success">Update</Button>
                    <Button color="danger" onClick={deleteData}>Delete Data</Button>
                </form>
            </div >
        </>
    )
}