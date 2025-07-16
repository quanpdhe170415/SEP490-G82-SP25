import React, { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
    const [pageTitle, setPageTitle] = useState("Tổng quan");
    const [pageSubtitle, setPageSubtitle] = useState("");

    const setHeaderInfo = (headerData) => {
        setPageTitle(headerData.title);
        setPageSubtitle(headerData.subtitle);
    };

    const value = {
        pageTitle,
        pageSubtitle,
        setHeaderInfo // Cung cấp hàm để các component khác có thể thay đổi state
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
    return useContext(UIContext);
}