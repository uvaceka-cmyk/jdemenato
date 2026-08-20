import type { Metadata } from "next";
import { RequestManager } from "./request-manager";
export const metadata: Metadata = { title: "Správa poptávky", robots: { index: false, follow: false } };
export default async function ManageRequestPage({ params }: { params: Promise<{ id: string }> }) { const { id } = await params; return <RequestManager id={id}/>; }
