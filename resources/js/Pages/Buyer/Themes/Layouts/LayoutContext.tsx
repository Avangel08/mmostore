import axios from 'axios';
import React, { createContext, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import Swal from 'sweetalert2';

interface LayoutContextType {
    pingDeposit: () => Promise<boolean>;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

const LayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const { t } = useTranslation();
    const pingDeposit = async (): Promise<boolean> => {
        try {
            const url = route('buyer.deposit.ping');
            const res = await axios.get(url);
            if (res.data?.status === 'success') {
                Swal.fire({
                    title: t("Deposit success"),
                    text: t("Successful deposit") + ": " + res.data?.data.toLocaleString('vi-VN') + " VND",
                    icon: "success",
                    confirmButtonText: t("Close")
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
                return true;
            }
            return false;
        } catch (error) {
            console.error('Ping deposit error:', error);
            return false;
        }
    };

    const value = {
        pingDeposit
    };

    return (
        <LayoutContext.Provider value={value}>
            {children}
        </LayoutContext.Provider>
    );
};

export {
    LayoutContext,
    LayoutProvider
};

// Custom hook to use LayoutContext
export const useLayoutContext = () => {
    const context = useContext(LayoutContext);
    if (context === undefined) {
        throw new Error('useLayoutContext must be used within a LayoutProvider');
    }
    return context;
};