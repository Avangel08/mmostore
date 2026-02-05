import React, { useEffect, useState } from "react";
import { Head, Link } from "@inertiajs/react";
import GuestLayout from "../../../Layouts/GuestLayout";

type Props = {
    redirectUrl: string;
    seconds?: number;
}

export default function Redirect({ redirectUrl, seconds = 5 }: Props) {
    const [counter, setCounter] = useState<number>(seconds);

    useEffect(() => {
        const interval = setInterval(() => {
            setCounter((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    window.location.href = redirectUrl;
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [redirectUrl]);

    return (
        <React.Fragment>
            <GuestLayout>
                <Head title="Đăng ký thành công" />
                <div className="auth-page-content mt-lg-5">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-md-8 col-lg-6 col-xl-5">
                                <div className="card mt-4">
                                    <div className="card-body p-4 text-center">
                                        <div className="d-inline-flex align-items-center justify-content-center rounded-circle bg-success-subtle" style={{ width: 72, height: 72 }}>
                                            <i className="ri-store-2-fill text-success" style={{ fontSize: 36 }}></i>
                                        </div>
                                        <h4 className="mt-3 mb-1">Đăng ký cửa hàng thành công</h4>

                                        <p className="mb-4">Đang chuyển hướng về trang quản trị trong <span className="fw-semibold">{counter} giây</span></p>

                                        <div className="d-flex gap-2 justify-content-center">
                                            <a className="btn btn-success" href={redirectUrl}>Vào trang quản trị ngay</a>
                                            <Link className="btn btn-outline-secondary" href="/">Về trang đăng ký</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </GuestLayout>
        </React.Fragment>
    );
}