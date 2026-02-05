import React from "react";
import Pagination from "react-bootstrap/Pagination";

// Định nghĩa kiểu của 1 link từ Laravel paginator
export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

// Định nghĩa props của component
interface AppPaginationProps {
    links: PaginationLink[];
    onPageChange: (url: string) => void;
}

const PaginationBootstrap: React.FC<AppPaginationProps> = ({ links, onPageChange }) => {

    return (
        <React.Fragment>
            <div className="d-flex justify-content-end">
                <Pagination className="gap-2">
                    {links.map((link, index) => {
                        const label = link.label
                            .replace("&laquo; Previous", "«")
                            .replace("Next &raquo;", "»"); // 👈 xử lý ký tự HTML thủ công
                        return (
                            <Pagination.Item
                                key={index}
                                active={link.active}
                                disabled={!link.url}
                                onClick={() => link.url && !link.active && onPageChange(link.url)}
                            >
                                <span dangerouslySetInnerHTML={{ __html: label }} />
                            </Pagination.Item>
                        )
                    })}
                </Pagination>
            </div>
        </React.Fragment>
    );
}

export default PaginationBootstrap;