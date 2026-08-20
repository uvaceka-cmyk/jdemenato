import type { Metadata } from "next";import { SupplierRequest } from "./request";import "../request-simple.css";
export const metadata:Metadata={title:"Vyhledávač dodavatelů – porovnejte ceny a termíny",description:"Najděte dodavatele pro domácnost i firmu. Zadejte službu, místo a termín a porovnejte nabídky, hodnocení a podmínky.",alternates:{canonical:"/dodavatele"}};
export default function Page(){return <SupplierRequest/>}
