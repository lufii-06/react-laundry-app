import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { axiosInstance } from "../lib/axios";
import { toast } from "sonner";

export default function RegisterPage() {

    const SchemaDesigner = z.object({
        name: z.string(),
        email: z.string().email("format E-Mail belum sesuai"),
        username: z.string().min(4, "minimal 5 karakter atau lebih"),
        password: z.string().min(8, "minimal 8 karakter atau lebih"),
    });

    const form = useForm({
        defaultValues: {
            name: "",
            email: "",
            username: "",
            password: "",
        },
        resolver: zodResolver(SchemaDesigner)
    },);

    const submitForm = async (data) => {
        try {
            await axiosInstance.post("/auth/register",
                { ...data, role: "employee" },
            );
            form.reset();
            toast.success("Berhasil Sign Up", { duration: 2500 })
        } catch (error) {
            console.log("Gagal Menyimpan data karena : " + error);
        }
    }
    return (
        <>
            <div className="flex justify-center items-center h-screen">
                <Card className="bg-white min-w-[400px] rounded-lg p-2">
                    <CardHeader>
                        <h1 className="mx-auto font-bold text-3xl">Register</h1>
                    </CardHeader>
                    <CardBody>
                        <form method="post" onSubmit={form.handleSubmit(submitForm)}>
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return <Input {...field} className="mb-3" type="text" color="success" placeholder="Input Your Name" label="Name" isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} />
                                }}
                            />
                            <Controller
                                name="email"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return <Input {...field} className="mb-3" type="email" color="success" placeholder="Input Your E-Mail" label="E-Mail" isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} />
                                }}
                            />
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return <Input {...field} className="mb-3" type="text" color="success" placeholder="Input Your Username" label="Username" isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} />
                                }}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return <Input {...field} className="mb-3" type="password" color="success" placeholder="Input Your Password" label="Password" isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} />
                                }}
                            />
                            <Button type="submit" color="success">Sign Up</Button>
                            <Link to="/" className="ms-2 text-blue-600">Login</Link>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </>
    )
}