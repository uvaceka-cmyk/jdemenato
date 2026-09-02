import type { Metadata } from "next";import Link from "../../ui/SiteLink";import { notFound } from "next/navigation";import {categories,jobs}from"../../data";
const slugify=(s:string)=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");
export function generateStaticParams(){return categories.map(c=>({slug:slugify(c[0])}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{slug}=await params;const c=categories.find(x=>slugify(x[0])===slug);return c?{title:`Práce a zakázky – ${c[0]}`,description:`Aktuální práce a zakázky v oboru ${c[0]}. ${c[1]}.`,alternates:{canonical:`/obory/${slug}`}}:{}}
export default async function Page({params}:{params:Promise<{slug:string}>}){const{slug}=await params;const c=categories.find(x=>slugify(x[0])===slug);if(!c)notFound();return <main className="simple"><Link href="/" className="brand"><span>Zak</span><strong>ly</strong></Link><p className="eyebrow">OBOR</p><h1>{c[0]}</h1><p>{c[1]}</p><h2>Aktuální nabídky</h2><div className="job-grid">{jobs.map(j=><Link className="job-card" href={`/prace/${j.slug}`} key={j.slug}><small>{j.company}</small><h3>{j.title}</h3><b>{j.place} · {j.pay}</b></Link>)}</div></main>}


