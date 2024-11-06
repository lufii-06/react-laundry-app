import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { axiosInstance } from "../lib/axios";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginPage() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const SchemaDesigner = z.object({
        username: z.string().min(4, "minimal 5 karakter atau lebih"),
        password: z.string().min(8, "minimal 8 karakter atau lebih"),
    });
    const form = useForm({
        defaultValues: {
            username: "",
            password: "",
        },
        resolver: zodResolver(SchemaDesigner)
    });

    const submitFrom = async (Submitdata) => {
        try {
            const response = await axiosInstance.post("/auth/login", Submitdata);
            if (response && response.data.data.token) {
                localStorage.setItem("enigma_laundry_token", response.data.data.token);
                localStorage.setItem("is_login", true);
            }
            toast.success("berhasil login", { duration: 2500 });
            navigate("/");
        } catch (error) {
            console.log("Terjadi Kesalahan saat Login" + error);
        }
    }
    return (
        <>
            <div className="flex justify-center items-center h-screen bg-cover bg-center" style={{ backgroundImage: `url('/bg-login.jpg')` }}>
                <Card className="bg-blue-200 min-w-[350px] rounded-lg p-2 min-h-[310px]">
                    <CardHeader>
                        <h1 className="mx-auto font-bold text-3xl">Sign In</h1>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <form onSubmit={form.handleSubmit(submitFrom)} method="post">
                            <Controller
                                name="username"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return <Input {...field} isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} className="mb-2" type="text" color="success" placeholder="Input Your Username" label="Username" />
                                }}
                            />
                            <Controller
                                name="password"
                                control={form.control}
                                render={({ field, fieldState }) => {
                                    return <Input {...field} isInvalid={Boolean(fieldState.error)} errorMessage={fieldState.error?.message} type="password" color="success" placeholder="Input Your Password" label="Password" />
                                }}
                            />
                            <Divider className="my-4" />
                            <Button type="submit" color="success">Sign In</Button>
                        </form>
                    </CardBody>
                    {/* <CardFooter>
                        <Link to="/register" className="ms-2 text-blue-600">Sign Up</Link>
                    </CardFooter> */}
                </Card>

            </div>
        </>
    )
}