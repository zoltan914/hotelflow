import { useEffect, useRef, useState } from "react";


interface SearchInputProps {
    onSearch: (value: string) => void;
    placeholder?: string;
    delay?: number;
}

export const SearchInput = ({ onSearch, placeholder = "Keresés...", delay = 400 }: SearchInputProps) => {

    const [text, setText] = useState("");
    const [isSearching] = useState(false);

    const onSearchRef = useRef(onSearch)
    useEffect(() => { onSearchRef.current = onSearch }, [onSearch])

    useEffect(() => {
        const handler = setTimeout(() => onSearchRef.current(text), delay);
        return () => clearTimeout(handler);
    }, [text, delay]); 


    return (
        <div className="search-container">
            <input
                type="text"
                className="search-input"
                placeholder={placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
            
            {/* SPINNER VAGY TÖRLÉS GOMB */}
            <div className="search-icon-wrapper">
                {isSearching ? (
                    <div className="search-spinner"></div>
                ) : (
                    text && <button className="clear-btn" onClick={() => setText("")}>✕</button>
                )}
            </div>
        </div>
    );

}