import React from "react";
import { Head } from "@inertiajs/react";
import Home from "./home";
import Navbar from "./navbar";
import Footer from "./footer";
import Showcase from "./Showcase";
import Services from "./services";

export default function Index() {
    const toTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    return (
        <React.Fragment>
            <Head title="Landing | Velzon - React Admin & Dashboard Template" />
            <div className="layout-wrapper landing">
                <Navbar />
                <Home />
                <Showcase />
                <Services />
                <Footer />
                <button
                    onClick={() => toTop()}
                    className="btn btn-danger btn-icon landing-back-top"
                    id="back-to-top"
                >
                    <i className="ri-arrow-up-line"></i>
                </button>
            </div>
        </React.Fragment>
    );
}
