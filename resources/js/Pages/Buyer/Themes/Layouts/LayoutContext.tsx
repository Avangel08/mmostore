import axios from 'axios';
import React, { createContext, useContext, useState } from 'react';
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
                    text: t("Deposit success message"),
                    icon: "success"
                });
                return true;
            }
            return false;
        } catch (error) {
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
}