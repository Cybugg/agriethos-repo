"use client"
import React, {createContext, useContext, useState, ReactNode} from "react";

// Variants for our pages
type Page = "home" | "manage" 
type Bool = true | false;

//  create the shape of the context state
interface NavContextType {
    currentPage:Page,
    setCurrentPage:(page:Page)=>void;
    mobileDisplay:Bool;
    setMobileDisplay:(bool:Bool) => void;
}

// create instance for the React Context with undefined value
const NavContext = createContext<NavContextType | undefined>(undefined);

// Custom hook to access navigation context

export const useNavContext = () =>{
    const context = useContext(NavContext);
    if(!context){
        throw new Error("useNavContext must be used within NavProvider")
    }
    return context;
};

// create NavProvider for wrapping children component
export const NavProvider = ({children}:{children:ReactNode})=>{
    const [currentPage, setCurrentPage] = useState<Page>("home"); // default page is home
    const [mobileDisplay, setMobileDisplay] = useState<Bool>(false); // default nav value is false
    return(
        <NavContext.Provider value={{currentPage,setCurrentPage,mobileDisplay,setMobileDisplay}}>
            {children}
        </NavContext.Provider>
    )
}