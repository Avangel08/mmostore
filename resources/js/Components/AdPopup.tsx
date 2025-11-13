import { usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";

const banners = [
    {
        image: "/images/banner/popup-hidemium.webp",
        link: "https://hidemium.io?utm_source=mmoshop_web&utm_medium=banner&utm_campaign=hidemium",
    },
    {
        image: "/images/banner/popup-merdify.webp",
        link: "https://merdify.com?utm_campaign=merdify&utm_medium=banner&utm_source=mmoshop_web",
    },
];

const AdPopup = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [nextIndex, setNextIndex] = useState<number | null>(null);
    const [currentIndex, setCurrentIndex] = useState(() => {
        const data = JSON.parse(localStorage.getItem("ad_popup_log") || "{}");
        return typeof data.index === "number" ? data.index : 0;
    });

    useEffect(() => {
        // 🎯 1. Preload tất cả ảnh banner
        banners.forEach((banner) => {
            const img = new Image();
            img.src = banner.image;
        });

        const showAdPopup = () => setShowPopup(true);
        window.addEventListener("showAdPopup", showAdPopup);
        setTimeout(() => checkAndShowAd(), 0);

        const timer = setInterval(() => {
            const lastShown = getLastShown();
            if (lastShown && minutesSince(lastShown) >= 30 && canShowAd()) {
                triggerAdPopup();
            }
        }, 60 * 1000);

        const handleScroll = () => {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const scrollHeight =
                document.documentElement.scrollHeight -
                document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;

            if (scrollPercent >= 60 && canShowAd()) {
                triggerAdPopup();
                window.removeEventListener("scroll", handleScroll);
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            clearInterval(timer);
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("showAdPopup", showAdPopup);
        };
    }, []);

    // Khi đóng modal
    const handleClose = () => {
        setShowPopup(false);
        const ni = (currentIndex + 1) % banners.length;
        setNextIndex(ni); // Chưa cập nhật ngay để tránh nhảy ảnh
    };

    // Khi modal đóng hoàn toàn xong (animation kết thúc)
    const handleExited = () => {
        if (nextIndex !== null) {
            setCurrentIndex(nextIndex);
            saveNextIndex(nextIndex);
            setNextIndex(null);
        }
    };

    return (
        <React.Fragment>
            <style>
                {`
                    .modal-content {
                        border: none;
                        overflow: hidden;
                    }
                    .close-popup {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        cursor: pointer;
                        z-index: 10;
                        color: white;
                    }

                `}
            </style>
            <Modal
                show={showPopup}
                onHide={handleClose}
                onExited={handleExited}
                backdrop="static"
                centered
            >
                <Button className="close-popup btn btn-ghost-dark waves-effect waves-light" onClick={handleClose}>
                    <i className="ri-close-line fs-4"></i>
                </Button>
                <a href={banners[currentIndex].link} target="_blank" rel="noopener noreferrer">
                    <img
                        src={banners[currentIndex].image}
                        alt={`Ad Banner ${currentIndex + 1}`}
                        width="500"
                        height="500"
                        loading="eager"
                        fetchPriority="high"
                        decoding="async"
                        className="w-100"
                    />
                </a>
            </Modal>
        </React.Fragment>
    );
};

/* ======== Logic xử lý quảng cáo ======== */

function triggerAdPopup() {
    saveAdShown();
    window.dispatchEvent(new Event("showAdPopup"));
}

function canShowAd() {
    const data = JSON.parse(localStorage.getItem("ad_popup_log") || "{}");
    const today = new Date().toDateString();
    if (!data.date || data.date !== today) return true;
    return (data.count || 0) < 2;
}

function saveAdShown(index = 0) {
    const now = new Date();
    const today = now.toDateString();
    const data = JSON.parse(localStorage.getItem("ad_popup_log") || "{}");
    const newData = {
        date: today,
        count: data.date === today ? (data.count || 0) + 1 : 1,
        lastShown: now.toISOString(),
        index,
    };
    localStorage.setItem("ad_popup_log", JSON.stringify(newData));
}

function checkAndShowAd() {
    if (canShowAd()) {
        const lastShown = getLastShown();
        if (!lastShown || minutesSince(lastShown) >= 30) triggerAdPopup();
    }
}

function saveNextIndex(index = 0) {
    const data = JSON.parse(localStorage.getItem("ad_popup_log") || "{}");
    data.index = index;
    localStorage.setItem("ad_popup_log", JSON.stringify(data));
}

function getLastShown() {
    const data = JSON.parse(localStorage.getItem("ad_popup_log") || "{}");
    return data.lastShown ? new Date(data.lastShown) : null;
}

function minutesSince(date: Date | null) {
    if (!date) return Infinity;
    return (Date.now() - date.getTime()) / (1000 * 60);
}

export default AdPopup;