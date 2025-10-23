import React from "react";
import { Head, usePage } from "@inertiajs/react";
import Home from "./home";
import Navbar from "./navbar";
import Footer from "./footer";
import Showcase from "./Showcase";
import Services from "./Services";
import Features from "./Features";
import Faqs from "./Faqs";
import ModalRedirectStore from "./Modal/ModalRedirectStore";

export default function Index() {
    const toTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };
    
    const { message }: any = usePage().props;

    return (
        <React.Fragment>
            <div className="layout-wrapper landing">
                <Navbar />
                <Home />
                <Showcase />
                <Services />
                <Features />
                <Faqs />
                <Footer />
                <button
                    onClick={() => toTop()}
                    className="btn btn-danger btn-icon landing-back-top"
                    id="back-to-top"
                >
                    <i className="ri-arrow-up-line"></i>
                </button>
            </div>

            {/* Show modal redirect store */}
            <ModalRedirectStore message={message} />
        </React.Fragment>
    );
}
