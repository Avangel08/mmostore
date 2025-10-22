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
            <Head>
                <title>MMO Shop</title>
                <meta
                    name="description"
                    content="Tạo shop MMO của riêng bạn trong 5 phút"
                />
                <meta name="author" content="MMO Shop" />

                {/* Open Graph meta tags */}
                <meta property="og:title" content="MMO Shop" />
                <meta property="og:description" content="Tạo shop MMO của riêng bạn trong 5 phút" />
                {/* <meta property="og:image" content={theme?.pageHeaderImage || ""} /> */}
                <meta property="og:url" content="https://mmostore.local" />
                <meta property="og:type" content="product" />
                <meta property="og:site_name" content="MMO Shop" />

                {/* Twitter card tags (tùy chọn) */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="MMO Shop" />
                <meta name="twitter:description" content="Tạo shop MMO của riêng bạn trong 5 phút" />
                {/* <meta name="twitter:image" content={theme?.pageHeaderImage || ""} /> */}

                <meta name="robots" content="index, follow" />
            </Head>

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
