import React, { useState, useEffect, useRef } from 'react';
import { Form, Dropdown } from 'react-bootstrap';
import axios from 'axios';
import {useTranslation} from "react-i18next";

interface SearchableSelectProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    id?: string;
    searchEndpoint: string;
    searchParam?: string;
    displayField: string;
    valueField: string;
    secondaryField?: string;
    className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    value,
    onChange,
    placeholder = "Search...",
    label,
    id,
    searchEndpoint,
    searchParam = "search",
    displayField,
    valueField,
    secondaryField,
    className = ""
}) => {
    const {t, i18n} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [options, setOptions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState<any>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const loadInitialOptions = async () => {
        setLoading(true);
        try {
            const response = await axios.get(searchEndpoint, {
                params: {
                    limit: 20
                }
            });

            if (response.data.success) {
                setOptions(response.data.data);
            }
        } catch (error) {
            console.error('Error loading options:', error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    };

    const searchOptions = async (term: string) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await axios.get(searchEndpoint, {
                    params: {
                        [searchParam]: term,
                        limit: 20
                    }
                });

                if (response.data.success) {
                    setOptions(response.data.data);
                }
            } catch (error) {
                console.error('Error searching options:', error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        }, 300);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        
        if (term.trim() === '') {
            loadInitialOptions();
        } else {
            searchOptions(term);
        }
    };

    const handleOptionSelect = (option: any) => {
        setSelectedOption(option);
        onChange(option[valueField]);
        setSearchTerm('');
        setIsOpen(false);
    };

    const handleToggle = (nextShow: boolean) => {
        setIsOpen(nextShow);
        if (nextShow) {
            // Load initial options when dropdown opens
            loadInitialOptions();
            setSearchTerm('');
        }
    };

    const handleFormControlClick = () => {
        if (!isOpen) {
            // Load initial options when opening
            loadInitialOptions();
            setSearchTerm('');
        }
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (value && options.length > 0) {
            const found = options.find(option => option[valueField] === value);
            if (found) {
                setSelectedOption(found);
            }
        } else if (!value) {
            setSelectedOption(null);
        }
    }, [value, options]);

    useEffect(() => {
        loadInitialOptions();
    }, [searchEndpoint]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className={`searchable-select ${className}`} ref={dropdownRef}>
            {label && <Form.Label htmlFor={id}>{label}</Form.Label>}
            <div className="position-relative">
                <Form.Control
                    type="text"
                    id={id}
                    className="form-control"
                    placeholder={selectedOption 
                        ? `${selectedOption[displayField]}${secondaryField ? ` (${selectedOption[secondaryField]})` : ''}`
                        : placeholder
                    }
                    value={selectedOption 
                        ? `${selectedOption[displayField]}${secondaryField ? ` (${selectedOption[secondaryField]})` : ''}`
                        : ''
                    }
                    readOnly
                    onClick={handleFormControlClick}
                    style={{ cursor: 'pointer' }}
                />
                <div 
                    className="position-absolute top-50 end-0 translate-middle-y pe-3"
                    style={{ pointerEvents: 'none' }}
                >
                    <i className={`ri-arrow-down-s-line ${isOpen ? 'rotate-180' : ''}`}></i>
                </div>

                {isOpen && (
                    <div 
                        className="position-absolute w-100 bg-white border rounded shadow-lg"
                        style={{ 
                            top: '100%', 
                            left: 0, 
                            zIndex: 1050,
                            maxHeight: '300px',
                            overflowY: 'auto'
                        }}
                    >
                        <div className="p-2 border-bottom">
                            <Form.Control
                                type="text"
                                placeholder={`${placeholder}...`}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                autoFocus
                                className="mb-0"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                        
                        <div className="py-1">
                            {loading && (
                                <div className="px-3 py-2 text-muted">
                                    <div className="d-flex align-items-center">
                                        <div className="spinner-border spinner-border-sm me-2" role="status">
                                            <span className="visually-hidden">{t("Loading")}</span>
                                        </div>
                                        {t("Search...")}
                                    </div>
                                </div>
                            )}

                            {!loading && options.length === 0 && searchTerm && (
                                <div className="px-3 py-2 text-muted">
                                    No results found
                                </div>
                            )}

                            {!loading && options.length === 0 && searchTerm === '' && (
                                <div className="px-3 py-2 text-muted">
                                    No options available
                                </div>
                            )}

                            {options.map((option, index) => (
                                <div
                                    key={option[valueField] || index}
                                    className={`px-3 py-2 cursor-pointer ${
                                        selectedOption && selectedOption[valueField] === option[valueField] 
                                            ? 'bg-primary text-white' 
                                            : 'hover-bg-light'
                                    }`}
                                    onClick={() => handleOptionSelect(option)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <div className="fw-medium">{option[displayField]}</div>
                                    {secondaryField && (
                                        <small className={`${selectedOption && selectedOption[valueField] === option[valueField] ? 'text-white-50' : 'text-muted'}`}>
                                            {option[secondaryField]}
                                        </small>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchableSelect;
